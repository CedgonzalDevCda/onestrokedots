import Svg, { Path, Circle } from "react-native-svg"

import { LevelRuleType } from "@/src/core/rules/LevelRuleConfig"

type Props = {
  type: LevelRuleType
  size?: number
  color?: string
}

export function RuleIcon({ type, size = 24, color = "#FFFFFF" }: Props) {
  switch (type) {
    case "start-point":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" fill="#FF87DB" stroke={color} strokeWidth="1" />
        </Svg>
      )
    case "end-point":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" fill="#AA00FF" stroke={color} strokeWidth="1" />
        </Svg>
      )
    case "min-stars":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l2.9 6.6L22 9.3l-5 4.8 1.2 7-6.2-3.6L5.8 21l1.2-7-5-4.8 7.1-.7L12 2z"
            fill={color}
          />
        </Svg>
      )
    case "ordered-stars":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 6h16M4 12h16M4 18h10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      )
    case "avoid-zone":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
          <Path d="M6 18L18 6" stroke={color} strokeWidth="2" />
        </Svg>
      )
    case "color-match":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="8" cy="12" r="4" fill={color} />
          <Circle cx="16" cy="12" r="4" fill={color} opacity={0.5} />
        </Svg>
      )
    default:
      return null
  }
}