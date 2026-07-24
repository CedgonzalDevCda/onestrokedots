import { Currency } from "@/src/presentation/features/shop/CurrencyToggle";
import { ProductType } from "@/src/core/shop/catalog";

export const mapCurrencyToType = (currency: Currency): ProductType => {
  switch (currency) {
    case "Gold":
      return "gold";
    case "Bulbs":
      return "bubble";
    case "Hearts":
      return "life";
  }
};
