import { Text, StyleSheet } from "react-native"
import { AdMode } from "@/src/infrastructure/ads/AdProvider"

export default function NoAdsStatus({ adMode }: { adMode: AdMode }) {
  if (adMode !== "no_ads") return null

  return (
    <Text style={styles.text}>
      Mode sans pubs actif
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    marginTop: 15,
    color: "#4CAF50",
    fontWeight: "600",
  },
})
