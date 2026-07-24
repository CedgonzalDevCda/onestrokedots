// AdditionnalRuleBadge.tsx
import { useState } from "react"
import { View, Text, Pressable, Modal } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { LevelRuleConfig } from "@/src/core/rules/LevelRuleConfig"

import {
  RULE_LABELS,
  RULE_DESCRIPTIONS,
} from "@/src/core/rules/LevelRuleContent"

import { RuleIcon } from "./RuleIcon"
import { styles } from "./AdditionnalRuleBadge.styles"

type Props = {
  rule: LevelRuleConfig
}

function getSubBadgeContent(rule: LevelRuleConfig): string | null {
  switch (rule.type) {
    case "start-point":
      return "Start"
    case "end-point":
      return "End"
    case "min-stars":
      return String(rule.params.qty)
    case "ordered-stars":
      return `${rule.params.order[0]} to ${rule.params.order[rule.params.order.length - 1]}`
    default:
      return null
  }
}

export function AdditionnalRuleBadge({ rule }: Props) {
  const [visible, setVisible] = useState(false)

  const subBadgeContent = getSubBadgeContent(rule)

  return (
    <>
      <Pressable style={styles.container} onPress={() => setVisible(true)}>
        <View style={styles.badge}>
          <RuleIcon type={rule.type} />
        </View>

        {subBadgeContent && (
          <View style={styles.subBadgeContainer}>
            <LinearGradient
              colors={["#FFC014", "#FFDD1A", "#FFDD1A", "#FF851A"]}
              locations={[0.204, 0.2882, 0.671, 0.9055]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.22 }}
              style={styles.subBadge}
            >
              <View style={styles.subBadgeHighlight} />
              <View style={styles.subBadgeGlow} />
              <Text style={styles.subBadgeText}>{subBadgeContent}</Text>
            </LinearGradient>
          </View>
        )}
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <RuleIcon type={rule.type} />
            </View>
            <Text style={styles.modalDescription}>
              {RULE_DESCRIPTIONS[rule.type]}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}