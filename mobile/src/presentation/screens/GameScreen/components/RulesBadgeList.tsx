import { View } from "react-native"

import {
  LevelRuleConfig,
  DEFAULT_RULE_TYPES,
} from "@/src/core/rules/LevelRuleConfig"

import { AdditionnalRuleBadge } from "./AdditionnalRuleBadge"
import { styles } from "./RulesBadgeList.styles"

type Props = {
  rules: LevelRuleConfig[]
}

export function RulesBadgeList({ rules }: Props) {
  const additionnalRules = rules.filter(
    (rule) => !DEFAULT_RULE_TYPES.has(rule.type)
  )

  if (additionnalRules.length === 0) return null

  return (
    <View style={styles.container}>
      {additionnalRules.map((rule, index) => (
        <AdditionnalRuleBadge key={`${rule.type}-${index}`} rule={rule} />
      ))}
    </View>
  )
}