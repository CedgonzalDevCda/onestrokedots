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

// ✅ MOCK ADS
jest.mock("react-native-google-mobile-ads", () => ({
  __esModule: true,
  default: () => ({
    initialize: jest.fn(),
  }),
  MobileAds: {
    initialize: jest.fn(),
  },
}));

// ✅ ✅ FIX IMPORTANT ICI
jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    GestureHandlerRootView: ({ children, ...props }: any) => (
      <View {...props}>{children}</View>
    ),
    GestureDetector: ({ children }: any) => <>{children}</>,
  };
});

// ✅ MOCK STATUS BAR
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

// ✅ MOCKS ASYNC
const mockInitDatabase = jest.fn().mockResolvedValue(undefined);

jest.mock("@/src/data/sources/local/sqlite/initDatabase", () => ({
  initDatabase: () => mockInitDatabase(),
}));

const mockProgressionInit = jest.fn().mockResolvedValue(undefined);

jest.mock("@/src/application/progression/ProgressionService", () => ({
  progression: {
    init: () => mockProgressionInit(),
  },
}));

// ✅ IMPORTS APRÈS MOCKS
import { render, waitFor } from "@testing-library/react-native";
import Layout from "../_layout";

describe("Layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls init functions", async () => {
    render(<Layout />);

    await waitFor(() => {
      expect(mockInitDatabase).toHaveBeenCalled();
      expect(mockProgressionInit).toHaveBeenCalled();
    });
  });

  it("renders app after init", async () => {
    const { getByTestId } = render(<Layout />);

    await waitFor(() => {
      expect(getByTestId("app-root")).toBeTruthy();
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
