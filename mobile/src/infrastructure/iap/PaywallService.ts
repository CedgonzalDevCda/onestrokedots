import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui"

export class PaywallService {
  async presentPaywall(): Promise<boolean> {
    try {
      const result = await RevenueCatUI.presentPaywall()

      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          return true

        case PAYWALL_RESULT.CANCELLED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.NOT_PRESENTED:
        default:
          return false
      }
    } catch (e) {
      console.warn("Paywall error:", e)
      return false
    }
  }
}
