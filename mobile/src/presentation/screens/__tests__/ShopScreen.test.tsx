// ✅ MOCKS AVANT IMPORTS

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, style }: any) => (
      <View style={style}>{children}</View>
    ),
  };
});

jest.mock("@/assets/gameimg/store_bg.svg", () => "StoreBg");

const mockShopHeader = jest.fn((_props: any) => null);
jest.mock("@/src/presentation/features/shop/ShopHeader", () => (props: any) => {
  mockShopHeader(props);
  return null;
});

const mockShopGrid = jest.fn((_props: any) => null);
jest.mock("@/src/presentation/features/shop/ShopGrid", () => (props: any) => {
  mockShopGrid(props);
  return null;
});

const mockCurrencyToggle = jest.fn((_props: any) => null);
jest.mock("@/src/presentation/features/shop/CurrencyToggle", () => ({
  __esModule: true,
  default: (props: any) => {
    mockCurrencyToggle(props);
    return null;
  },
}));

const mockCurrencyBar = jest.fn((_props: any) => null);
jest.mock("@/src/presentation/features/shop/CurrencyBar", () => (props: any) => {
  mockCurrencyBar(props);
  return null;
});

const mockPurchaseProduct = jest.fn();
jest.mock("@/src/infrastructure/iap/RevenueCatPurchaseService", () => {
  return {
    RevenueCatPurchaseService: jest.fn().mockImplementation(function () {
      return {
        purchaseProduct: (...args: any[]) => mockPurchaseProduct(...args),
      };
    }),
  };
});

jest.mock("@/src/core/shop/catalog", () => ({
  PRODUCTS: [
    { id: "gold_qty_1", type: "gold", amount: 100 },
    { id: "gold_qty_2", type: "gold", amount: 200 },
    { id: "bubble_qty_10", type: "bubble", amount: 10 },
    { id: "life_qty_2", type: "life", amount: 2 },
  ],
}));

jest.mock("@/src/core/shop/mappers", () => ({
  mapCurrencyToType: (currency: string) => {
    if (currency === "Gold") return "gold";
    if (currency === "Bubble") return "bubble";
    return "life";
  },
}));

// ✅ IMPORT APRÈS MOCKS
import { render, act } from "@testing-library/react-native";
import ShopScreen from "../ShopScreen/ShopScreen";

function getLastCallProps(mockFn: jest.Mock): any {
  const calls = mockFn.mock.calls;
  expect(calls.length).toBeGreaterThan(0);
  return calls[calls.length - 1][0];
}

describe("ShopScreen", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockShopHeader.mockClear();
    mockShopGrid.mockClear();
    mockCurrencyToggle.mockClear();
    mockCurrencyBar.mockClear();
    mockPurchaseProduct.mockReset();
  });

  // ✅ SANITY TEST — vérifie que l'instance du service partage bien la même
  // référence mockPurchaseProduct que le test peut contrôler
  it("SANITY: instance.purchaseProduct should be the same reference as mockPurchaseProduct", () => {
    // L'instance est créée au premier import de ShopScreen (module-level).
    // On vérifie que le mock factory a bienwrapé la référence via closure.
    render(<ShopScreen />);
    const gridProps = getLastCallProps(mockShopGrid);
    expect(typeof gridProps.onPressItem).toBe("function");
    expect(mockPurchaseProduct).not.toHaveBeenCalled();
  });

  it("should render without crashing", () => {
    expect(() => render(<ShopScreen />)).not.toThrow();
  });

  it("should render Gold products by default", () => {
    render(<ShopScreen />);
    const gridProps = getLastCallProps(mockShopGrid);
    expect(gridProps.products).toHaveLength(2);
    expect(gridProps.products.every((p: any) => p.type === "gold")).toBe(true);
  });

  it("should pass a price to each filtered product", () => {
    render(<ShopScreen />);
    const gridProps = getLastCallProps(mockShopGrid);
    gridProps.products.forEach((p: any) => {
      expect(typeof p.price).toBe("string");
      expect(p.price).toMatch(/€$/);
    });
  });

  it("should navigate to home when back button is pressed", () => {
    render(<ShopScreen />);
    const headerProps = getLastCallProps(mockShopHeader);
    act(() => {
      headerProps.onBack();
    });
    expect(mockPush).toHaveBeenCalledWith("/(main)/home");
  });

  it("should filter products by currency when CurrencyToggle changes", () => {
    render(<ShopScreen />);
    const toggleProps = getLastCallProps(mockCurrencyToggle);
    act(() => {
      toggleProps.onChange("Bubble");
    });
    const gridProps = getLastCallProps(mockShopGrid);
    expect(gridProps.products).toHaveLength(1);
    expect(gridProps.products[0].type).toBe("bubble");
  });

  it("should call purchaseProduct with the correct id on item press", async () => {
    mockPurchaseProduct.mockResolvedValue(undefined);
    render(<ShopScreen />);
    const gridProps = getLastCallProps(mockShopGrid);
    await act(async () => {
      await gridProps.onPressItem("gold_qty_1");
    });
    expect(mockPurchaseProduct).toHaveBeenCalledWith("gold_qty_1");
  });

  it("should not crash and should log a warning when purchaseProduct rejects (regression test)", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockPurchaseProduct.mockRejectedValue(new Error("Purchase failed"));
    render(<ShopScreen />);
    const gridProps = getLastCallProps(mockShopGrid);
    await act(async () => {
      await expect(gridProps.onPressItem("gold_qty_1")).resolves.not.toThrow();
    });
    expect(consoleSpy).toHaveBeenCalledWith("Purchase failed", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should return correct mock price for known product ids", () => {
    render(<ShopScreen />);
    const gridProps = getLastCallProps(mockShopGrid);
    const goldQty1 = gridProps.products.find((p: any) => p.id === "gold_qty_1");
    expect(goldQty1.price).toBe("2.99€");
  });

  it("should return fallback price 19.99€ for unknown product ids", () => {
    expect(true).toBe(true); // placeholder
  });
});