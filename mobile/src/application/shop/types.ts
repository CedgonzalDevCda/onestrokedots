import { Product } from "@/src/core/shop/catalog";

export type ShopProduct = Product & {
  price: string;
};
