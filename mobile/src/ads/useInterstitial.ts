import { useEffect, useRef } from "react"
import {
  InterstitialAd,
  AdEventType,
  TestIds
} from "react-native-google-mobile-ads"

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx" // 🔥 mets ton vrai ID

export function useInterstitial() {
  const interstitial = useRef(
    InterstitialAd.createForAdRequest(adUnitId)
  )

  const isLoaded = useRef(false)

  useEffect(() => {
    const unsubscribe = interstitial.current.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isLoaded.current = true
      }
    )

    interstitial.current.load()

    return unsubscribe
  }, [])

  function show() {
    if (isLoaded.current) {
      interstitial.current.show()
      isLoaded.current = false
      interstitial.current.load() // 🔥 reload pour next time
    }
  }

  return { show }
}
