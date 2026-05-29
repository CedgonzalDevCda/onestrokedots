import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  PurchasesStoreProduct,
} from "react-native-purchases"

import { IPurchaseService } from "@/src/meta/purchase/purchases"

const ENTITLEMENT_ID = "OneStrokeDotsNoPub"

export class RevenueCatPurchaseService implements IPurchaseService {

  // ✅ NO ADS
  async purchaseNoAds(): Promise<void> {
    const offerings = await Purchases.getOfferings()

    const pkg: PurchasesPackage | undefined =
      offerings.current?.availablePackages[0]

    if (!pkg) {
      throw new Error("No package available")
    }

    await Purchases.purchasePackage(pkg)
  }

  // ✅ RESTORE
  async restorePurchases(): Promise<boolean> {
    const customerInfo = await Purchases.restorePurchases()
    return this.hasNoAds(customerInfo)
  }

  async hasPurchasedNoAds(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      return this.hasNoAds(customerInfo)
    } catch (e) {
      console.warn("Erreur customerInfo:", e)
      return false
    }
  }

  private hasNoAds(customerInfo: CustomerInfo): boolean {
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID]
  }

  // =========================
  // ✅ ✅ SHOP PART (IMPORTANT)
  // =========================

  async getProducts(productIds: string[]): Promise<PurchasesStoreProduct[]> {
    return await Purchases.getProducts(productIds)
  }

  async purchaseProduct(productId: string): Promise<void> {
    try {
      const { customerInfo } = await Purchases.purchaseProduct(productId)

      // ✅ ici tu peux donner la reward
      this.handleConsumable(productId)

    } catch (e: any) {
      if (!e.userCancelled) {
        console.warn("Purchase error:", e)
        throw e
      }
    }
  }

  // ✅ mapping produit → reward
  private handleConsumable(productId: string) {
    switch (productId) {
      case "gold_qty_1":
        // addGold(1)
        break
      case "gold_qty_5":
        // addGold(5)
        break
      case "bubble_qty_50":
        // addBubbles(50)
        break
      case "life_qty_10":
        // addLives(10)
        break
    }
  }
}
