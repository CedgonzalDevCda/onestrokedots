// ✅ MOCKS AVANT IMPORTS

jest.mock("expo-router", () => {
  const React = require("react");

  const MockStack = ({ children }: any) => <>{children}</>;
  MockStack.Screen = () => null;

  return {
    Stack: MockStack,
    Slot: () => null,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
    }),
    useSegments: () => [],
  };
});

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock("expo-navigation-bar", () => ({
  setVisibilityAsync: jest.fn(),
}));

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");
  return {
    GestureHandlerRootView: ({ children, style }: any) => (
      <View style={style}>{children}</View>
    ),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaProvider: ({ children }: any) => <View>{children}</View>,
    SafeAreaView: ({ children, style }: any) => (
      <View style={style}>{children}</View>
    ),
  };
});

jest.mock("@/src/infrastructure/ads/AdProvider", () => ({
  AdProvider: ({ children }: any) => children,
}));

// ✅ FIX : jest.fn() défini DIRECTEMENT dans la factory pour éviter le piège
// de hoisting (const déclarée hors factory = TDZ au moment de l'exécution
// du jest.mock hoisté par Babel, ce qui rendait initDatabase() undefined
// à l'exécution réelle malgré un mock "apparemment" correct).
jest.mock("@/src/infrastructure/persistence/sqlite/initDatabase", () => ({
  initDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/src/meta/progression/ProgressionService", () => ({
  progression: {
    init: jest.fn().mockResolvedValue(undefined),
  },
}));

// ✅ IMPORTS APRÈS MOCKS
import { render, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { initDatabase } from "@/src/infrastructure/persistence/sqlite/initDatabase";
import { progression } from "@/src/meta/progression/ProgressionService";
import Layout from "../_layout";

// ✅ On récupère les mocks typés APRÈS l'import, via cast — plus sûr que
// de recréer des jest.fn() externes qui seraient hors du scope hoisted
const mockInitDatabase = initDatabase as jest.Mock;
const mockProgressionInit = progression.init as jest.Mock;

describe("Layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInitDatabase.mockResolvedValue(undefined);
    mockProgressionInit.mockResolvedValue(undefined);
    Platform.OS = "ios";
  });

  it("should render nothing before init completes", () => {
    // Arrange & Act
    mockInitDatabase.mockReturnValue(new Promise(() => {})); // never resolves
    const { queryByTestId } = render(<Layout />);

    // Assert
    expect(queryByTestId("app-root")).toBeNull();
  });

  it("should call init functions on mount", async () => {
    // Arrange & Act
    render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(mockInitDatabase).toHaveBeenCalledTimes(1);
      expect(mockProgressionInit).toHaveBeenCalledTimes(1);
    });
  });

  it("should call SplashScreen.preventAutoHideAsync and hideAsync around init", async () => {
    // Arrange & Act
    render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(SplashScreen.preventAutoHideAsync).toHaveBeenCalledTimes(1);
      expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
    });
  });

  it("should render app root after init completes", async () => {
    // Arrange & Act
    const { getByTestId } = render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(getByTestId("app-root")).toBeTruthy();
    });
  });

  it("should hide navigation bar on Android", async () => {
    // Arrange
    Platform.OS = "android";

    // Act
    render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(NavigationBar.setVisibilityAsync).toHaveBeenCalledWith("hidden");
    });
  });

  it("should not call NavigationBar on iOS", async () => {
    // Arrange
    Platform.OS = "ios";

    // Act
    render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(mockInitDatabase).toHaveBeenCalled();
    });
    expect(NavigationBar.setVisibilityAsync).not.toHaveBeenCalled();
  });

  it("should still hide splash screen if initDatabase throws (regression test)", async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockInitDatabase.mockRejectedValue(new Error("DB init failed"));

    // Act
    render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
    });
    expect(consoleSpy).toHaveBeenCalledWith("Init error", expect.any(Error));

    consoleSpy.mockRestore();
  });

  it("should still hide splash screen if progression.init throws (regression test)", async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockProgressionInit.mockRejectedValue(new Error("Progression init failed"));

    // Act
    render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
    });

    consoleSpy.mockRestore();
  });

  it("should not render app-root if an init error occurs (ready stays false)", async () => {
    // Arrange
    jest.spyOn(console, "log").mockImplementation(() => {});
    mockInitDatabase.mockRejectedValue(new Error("DB init failed"));

    // Act
    const { queryByTestId } = render(<Layout />);

    // Assert
    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });
    expect(queryByTestId("app-root")).toBeNull();
  });
});