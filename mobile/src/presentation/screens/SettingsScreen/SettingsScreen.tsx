import { View, Text, StyleSheet } from "react-native"
import { useAds } from "@/src/infrastructure/ads/AdProvider"
import { PaywallService } from "@/src/infrastructure/iap/PaywallService"
import { useIAP } from "@/src/presentation/hooks/useIAP"

import AdOption from "./components/AdOption"
import PurchaseBlock from "./components/PurchaseBlock"
import NoAdsStatus from "./components/NoAdsStatus"

export default function SettingsScreen() {
  const { adMode, setAdMode } = useAds()
  const { refreshPurchases } = useIAP()

  const handlePurchaseNoAds = async () => {
    const service = new PaywallService()
    const success = await service.presentPaywall()

    if (success) {
      await refreshPurchases()
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Publicités</Text>

      <AdOption
        title="Normal"
        description="Bannières + pubs récompensées"
        value="normal"
        current={adMode}
        onSelect={setAdMode}
      />

      <AdOption
        title="Boost rewards (+25%)"
        description="Ajoute des pubs entre les niveaux"
        value="high"
        current={adMode}
        onSelect={setAdMode}
      />

      <View style={styles.separator} />

      <PurchaseBlock onPress={handlePurchaseNoAds} />

      <NoAdsStatus adMode={adMode} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
})
