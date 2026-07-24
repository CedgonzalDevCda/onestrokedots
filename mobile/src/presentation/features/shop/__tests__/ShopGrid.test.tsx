// ✅ MOCKS AVANT IMPORTS

const mockShopItem = jest.fn((_props: any) => null);
jest.mock("../ShopItem", () => (props: any) => {
  mockShopItem(props);
  return null;
});

jest.mock("@/assets/gameimg/money-gold-icon.svg", () => "GoldIcon");
jest.mock("@/assets/gameimg/money-bubble-icon.svg", () => "BubbleIcon");
jest.mock("@/assets/gameimg/money-life-icon.svg", () => "LifeIcon");

// ✅ IMPORTS APRÈS MOCKS
import { render } from "@testing-library/react-native";
import ShopGrid from "../ShopGrid";
import { ShopProduct } from "@/src/application/shop/types";

const makeProduct = (overrides: Partial<ShopProduct> = {}): ShopProduct => ({
  id: "gold_qty_1",
  type: "gold",
  amount: 100,
  price: "2.99€",
  ...overrides,
});

// Helper typé pour éviter les erreurs TS2532 / TS2493 sur mock.calls[0][0]
function getLastShopItemProps(): any {
  const calls = mockShopItem.mock.calls;
  expect(calls.length).toBeGreaterThan(0);
  return calls[calls.length - 1][0];
}

describe("ShopGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render one ShopItem per product", () => {
    // Arrange
    const products = [
      makeProduct({ id: "p1" }),
      makeProduct({ id: "p2" }),
      makeProduct({ id: "p3" }),
    ];

    // Act
    render(<ShopGrid products={products} onPressItem={jest.fn()} />);

    // Assert
    expect(mockShopItem).toHaveBeenCalledTimes(3);
  });

  it("should render nothing when products is empty", () => {
    // Arrange & Act
    render(<ShopGrid products={[]} onPressItem={jest.fn()} />);

    // Assert
    expect(mockShopItem).not.toHaveBeenCalled();
  });

  it("should pass correct props to each ShopItem (prop drilling)", () => {
    // Arrange
    const product = makeProduct({
      id: "gold_qty_5",
      amount: 500,
      price: "9.99€",
      type: "gold",
    });
    const onPressItem = jest.fn();

    // Act
    render(<ShopGrid products={[product]} onPressItem={onPressItem} />);

    // Assert
    const props = getLastShopItemProps();
    expect(props).toEqual(
      expect.objectContaining({
        amount: 500,
        price: "9.99€",
        productId: "gold_qty_5",
        onPress: onPressItem,
      })
    );
  });

  describe("icon selection by product type", () => {
    it("should render GoldIcon for type 'gold'", () => {
      // Arrange
      const product = makeProduct({ type: "gold" });

      // Act
      render(<ShopGrid products={[product]} onPressItem={jest.fn()} />);

      // Assert
      const props = getLastShopItemProps();
      expect(props.icon.type).toBe("GoldIcon");
    });

    it("should render BubbleIcon for type 'bubble'", () => {
      // Arrange
      const product = makeProduct({ type: "bubble", id: "bubble_qty_10" });

      // Act
      render(<ShopGrid products={[product]} onPressItem={jest.fn()} />);

      // Assert
      const props = getLastShopItemProps();
      expect(props.icon.type).toBe("BubbleIcon");
    });

    it("should render LifeIcon for type 'life'", () => {
      // Arrange
      const product = makeProduct({ type: "life", id: "life_qty_2" });

      // Act
      render(<ShopGrid products={[product]} onPressItem={jest.fn()} />);

      // Assert
      const props = getLastShopItemProps();
      expect(props.icon.type).toBe("LifeIcon");
    });

    it("should not crash and return undefined icon for an unknown product type (regression test)", () => {
      // Arrange
      const product = makeProduct({ type: "unknown" as any });

      // Act & Assert
      expect(() =>
        render(<ShopGrid products={[product]} onPressItem={jest.fn()} />)
      ).not.toThrow();

      const props = getLastShopItemProps();
      expect(props.icon).toBeUndefined();
    });
  });

  it("should not mutate the products array passed as prop", () => {
    // Arrange
    const products = [makeProduct()];
    const productsCopy = JSON.parse(JSON.stringify(products));

    // Act
    render(<ShopGrid products={products} onPressItem={jest.fn()} />);

    // Assert
    expect(products).toEqual(productsCopy);
  });
});