export type StartPointParams = {
  pointId: string
}

export type EndPointParams = {
  pointId: string
}

export type MinStarsParams = {
  qty: number
}

export type OrderedStarsParams = {
  order: string[]
}

export type AvoidZoneParams = {
  zone: { x: number; y: number; width: number; height: number }
}

export type LevelRuleConfig =
  | { type: "visit-count" }
  | { type: "no-backtrack" }
  | { type: "start-point"; params: StartPointParams }
  | { type: "end-point"; params: EndPointParams }
  | { type: "min-stars"; params: MinStarsParams }
  | { type: "ordered-stars"; params: OrderedStarsParams }
  | { type: "avoid-zone"; params: AvoidZoneParams }
  | { type: "color-match" }

export type LevelRuleType = LevelRuleConfig["type"]

// -------------------------
// RULE TYPE GROUPS
// -------------------------
export const DEFAULT_RULE_TYPES: Set<LevelRuleType> = new Set([
  "visit-count",
  "no-backtrack",
])

export const ADDITIONNAL_RULE_TYPES: Set<LevelRuleType> = new Set([
  "start-point",
  "end-point",
  "min-stars",
  "ordered-stars",
  "avoid-zone",
  "color-match",
])