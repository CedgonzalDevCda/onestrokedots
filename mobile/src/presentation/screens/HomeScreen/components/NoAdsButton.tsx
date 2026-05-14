import { Text, Pressable } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { styles } from "../HomeScreen.styles"
import NoAdsIcon from "@/assets/gameimg/no-ads-icon.svg"

import { PaywallService } from "@/src/infrastructure/iap/PaywallService"
import { useIAP } from "@/src/presentation/hooks/useIAP"

export default function NoAdsButton() {
  const { refreshPurchases } = useIAP()

  const handlePress = async () => {
    const service = new PaywallService()

    const success = await service.presentPaywall()

    if (success) {
      await refreshPurchases()
    }
  }

  return (
    <Pressable onPress={handlePress}>
      <LinearGradient
        colors={["#FF6CEB", "#C30075"]}
        style={styles.noAdsBtn}
      >
        <NoAdsIcon width={42} height={42} />
        <Text style={styles.price}>$ 2.99</Text>
      </LinearGradient>
    </Pressable>
  )
}
