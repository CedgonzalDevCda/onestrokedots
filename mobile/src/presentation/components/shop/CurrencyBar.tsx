import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native"
import { progression } from "@/src/application/progression/ProgressionService"
import GoldIcon from "@/assets/gameimg/money-gold-icon.svg"
import BubbleIcon from "@/assets/gameimg/money-bubble-icon.svg"

type Props = {
  style?: StyleProp<ViewStyle>
}

export default function CurrencyBar({ style }: Props) {
  const gold = progression.getState().currency.gold
  const bubble = progression.getState().currency.bubble

  const formatGold = (value: number) => value.toString().padStart(5, "0")
  const formatBubble = (value: number) => value.toString().padStart(4, "0")

  return (
    <View style={[styles.resources, style]}>
      {/* GOLD */}
      <View style={styles.badge}>
        <GoldIcon width={18} height={18} />
        <Text style={styles.badgeText}>{formatGold(gold)}</Text>
      </View>

      {/* BUBBLE */}
      <View style={styles.badge}>
        <BubbleIcon width={18} height={18} />
        <Text style={styles.badgeText}>{formatBubble(bubble)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  resources: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})
