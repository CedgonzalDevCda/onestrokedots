import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { AdMode } from "@/src/infrastructure/ads/AdProvider"
import Radio from "./Radio"

type Props = {
  title: string
  description: string
  value: AdMode
  current: AdMode
  onSelect: (mode: AdMode) => void
}

export default function AdOption({
  title,
  description,
  value,
  current,
  onSelect,
}: Props) {
  const isSelected = current === value

  return (
    <TouchableOpacity
      style={[styles.option, isSelected && styles.selected]}
      onPress={() => onSelect(value)}
      disabled={current === "no_ads" && value !== "no_ads"}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>

      <Radio selected={isSelected} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
})
