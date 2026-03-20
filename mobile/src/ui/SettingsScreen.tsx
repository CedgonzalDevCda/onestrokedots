import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useAds, AdMode } from "@/src/ads/AdProvider"

export default function SettingsScreen() {
  const { adMode, setAdMode } = useAds()

  const handlePurchaseNoAds = () => {
    setAdMode("no_ads")
  }

  const renderOption = (
    title: string,
    description: string,
    value: AdMode
  ) => {
    const isSelected = adMode === value

    return (
      <TouchableOpacity
        style={[styles.option, isSelected && styles.selected]}
        onPress={() => setAdMode(value)}
        disabled={adMode === "no_ads" && value !== "no_ads"}
      >
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{description}</Text>
        </View>

        <View style={styles.radio}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Publicités</Text>

      {renderOption(
        "Normal",
        "Bannières + pubs récompensées",
        "normal"
      )}

      {renderOption(
        "Boost rewards (+25%)",
        "Ajoute des pubs entre les niveaux",
        "high"
      )}

      <View style={styles.separator} />

      <TouchableOpacity style={styles.purchase} onPress={handlePurchaseNoAds}>
        <Text style={styles.purchaseText}>
          Supprimer les pubs – 2.99€
        </Text>
        <Text style={styles.purchaseDesc}>
          Supprime bannières + interstitielles (rewarded conservées)
        </Text>
      </TouchableOpacity>

      {adMode === "no_ads" && (
        <Text style={styles.active}>
          Mode sans pubs actif
        </Text>
      )}
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
  option: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selected: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  purchase: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF3E0",
  },
  purchaseText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  purchaseDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },
  active: {
    marginTop: 15,
    color: "#4CAF50",
    fontWeight: "600",
  },
})
