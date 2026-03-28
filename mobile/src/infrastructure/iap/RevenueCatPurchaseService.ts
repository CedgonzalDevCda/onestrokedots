import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases"
import { IPurchaseService } from "@/src/domain/purchases"

const ENTITLEMENT_ID = "OneStrokeDotsNoPub"

export class RevenueCatPurchaseService implements IPurchaseService {
  async purchaseNoAds(): Promise<void> {
    const offerings = await Purchases.getOfferings()

    const pkg: PurchasesPackage | undefined =
      offerings.current?.availablePackages[0]

    if (!pkg) {
      throw new Error("No package available")
    }

    await Purchases.purchasePackage(pkg)
  }

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
}
