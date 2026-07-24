export type ProductType = "gold" | "bubble" | "life";

export type Product = {
  id: string;
  type: ProductType;
  amount: number;
};

export const PRODUCTS: Product[] = [
  // GOLD
  { id: "gold_qty_1", type: "gold", amount: 1 },
  { id: "gold_qty_2", type: "gold", amount: 2 },
  { id: "gold_qty_5", type: "gold", amount: 5 },
  { id: "gold_qty_12", type: "gold", amount: 12 },

  // BUBBLE
  { id: "bubble_qty_10", type: "bubble", amount: 10 },
  { id: "bubble_qty_20", type: "bubble", amount: 20 },
  { id: "bubble_qty_50", type: "bubble", amount: 50 },
  { id: "bubble_qty_120", type: "bubble", amount: 120 },

  // LIFE
  { id: "life_qty_2", type: "life", amount: 2 },
  { id: "life_qty_5", type: "life", amount: 5 },
  { id: "life_qty_10", type: "life", amount: 10 },
  { id: "life_qty_25", type: "life", amount: 25 },
];
