export interface IPurchaseService {
  purchaseNoAds(): Promise<void>
  restorePurchases(): Promise<boolean>
}
