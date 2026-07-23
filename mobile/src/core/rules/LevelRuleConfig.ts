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
  | { type: "ordered-stars"; params: unknown }
  | { type: "avoid-zone"; params: unknown }
  | { type: "color-match"; params: unknown }