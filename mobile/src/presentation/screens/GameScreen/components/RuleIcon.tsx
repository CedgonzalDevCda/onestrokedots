import Svg, { Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend, Circle } from "react-native-svg"

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
        <Svg width="41" height="40" viewBox="0 0 41 40" fill="none">
          <Defs>
            <Filter id="filter0_d_142_1698" x="0" y="0" width="41" height="40" filterUnits="userSpaceOnUse">
              <FeFlood floodOpacity="0" result="BackgroundImageFix" />
              <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <FeOffset dy="2" />
              <FeGaussianBlur stdDeviation="2" />
              <FeComposite in2="hardAlpha" operator="out" />
              <FeColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_142_1698" />
              <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_142_1698" result="shape" />
            </Filter>
          </Defs>

          <Path d="M4 14.0191C4 12.8172 14.8949 11.6153 14.8949 11.6153C14.8949 11.6153 19.1318 1.99996 20.3423 2C20.3555 8.92045 20.376 19.7209 20.376 19.7209C20.376 19.7209 10.3952 16.2458 4 14.0191Z" fill="#FF9553" />
          <Path d="M4 14.0191C4 12.8172 14.8949 11.6153 14.8949 11.6153C14.8949 11.6153 19.1318 1.99996 20.3423 2C20.3555 8.92045 20.376 19.7209 20.376 19.7209C20.376 19.7209 10.3952 16.2458 4 14.0191Z" fill="#FFF9D6" />

          <Path d="M20.3423 2C21.5529 1.99996 26.1757 12.0432 26.1757 12.0432C26.1757 12.0432 36.6847 12.8172 37 14.5346L20.376 19.7209C20.376 19.7209 20.3555 8.92045 20.3423 2Z" fill="#FF9553" />
          <Path d="M20.3423 2C21.5529 1.99996 26.1757 12.0432 26.1757 12.0432C26.1757 12.0432 36.6847 12.8172 37 14.5346L20.376 19.7209C20.376 19.7209 20.3555 8.92045 20.3423 2Z" fill="#FFDD53" />

          <Path d="M37 14.5346C36.6847 16.4229 29.2323 23.0334 29.2323 23.0334C29.2323 23.0334 30.6319 32.0477 30.4412 34L20.376 19.7209L37 14.5346Z" fill="#FF9553" />
          <Path d="M37 14.5346C36.6847 16.4229 29.2323 23.0334 29.2323 23.0334C29.2323 23.0334 30.6319 32.0477 30.4412 34L20.376 19.7209L37 14.5346Z" fill="#FFBA3B" />

          <Path d="M30.4412 34C28.2109 33.8506 19.8093 29.2062 19.8093 29.2062C19.8093 29.2062 11.2633 33.2496 9.54771 33.4373L20.376 19.7209L30.4412 34Z" fill="#FF9553" />
          <Path d="M30.4412 34C28.2109 33.8506 19.8093 29.2062 19.8093 29.2062C19.8093 29.2062 11.2633 33.2496 9.54771 33.4373L20.376 19.7209L30.4412 34Z" fill="#F6A728" />

          <Path d="M9.54771 33.4373C8.84217 33.2496 11.1205 22.1373 11.1205 22.1373C11.1205 22.1373 4 15.221 4 14.0191C10.3952 16.2458 20.376 19.7209 20.376 19.7209L9.54771 33.4373Z" fill="#FF9553" />
          <Path d="M9.54771 33.4373C8.84217 33.2496 11.1205 22.1373 11.1205 22.1373C11.1205 22.1373 4 15.221 4 14.0191C10.3952 16.2458 20.376 19.7209 20.376 19.7209L9.54771 33.4373Z" fill="#FCCE37" />
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