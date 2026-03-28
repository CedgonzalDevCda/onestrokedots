import { useEffect, useState } from "react"
import Purchases from "react-native-purchases"
import { Platform } from "react-native"
import { RevenueCatPurchaseService } from "@/src/infrastructure/iap/RevenueCatPurchaseService"

type State = "idle" | "loading" | "error" | "success"

export function useIAP() {
  const [state, setState] = useState<State>("idle")
  const [isPro, setIsPro] = useState(false)

  const service = new RevenueCatPurchaseService()

  useEffect(() => {
    const init = async () => {
      Purchases.configure({
        apiKey:
          Platform.OS === "ios"
            ? "APPLE_API_KEY"
            : "test_zHsUetNDUfCJtJnhPHoHCmiHoHl",
      })

      // ✅ check au lancement
      try {
        const hasPurchased = await service.hasPurchasedNoAds()
        setIsPro(hasPurchased)
      } catch {
        // silent fail
      }
    }

    init()
  }, [])

  const purchaseNoAds = async () => {
    setState("loading")

    try {
      await service.purchaseNoAds()

      // ✅ re-check après achat (important)
      const hasPurchased = await service.hasPurchasedNoAds()

      if (hasPurchased) {
        setIsPro(true)
        setState("success")
      } else {
        setState("error")
      }
    } catch (e) {
      setState("error")
    }
  }

  const refreshPurchases = async () => {
  try {
    const hasPurchased = await service.hasPurchasedNoAds()
    setIsPro(hasPurchased)
  } catch (e) {
    console.warn("refreshPurchases error:", e)
  }
}

  const restorePurchases = async () => {
    try {
      const restored = await service.restorePurchases()
      setIsPro(restored)
      return restored
    } catch {
      return false
    }
  }

  return {
    purchaseNoAds,
    restorePurchases,
    purchaseState: state,
    isPro,
    refreshPurchases,
  }
}
