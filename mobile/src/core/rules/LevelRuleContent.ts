import { LevelRuleType } from "./LevelRuleConfig"

// -------------------------
// RULE DESCRIPTIONS
// -------------------------
export const RULE_DESCRIPTIONS: Record<LevelRuleType, string> = {
  "visit-count": "Chaque point ne peut être traversé qu'un nombre limité de fois.",
  "no-backtrack": "Il est interdit de revenir sur un segment déjà emprunté.",
  "start-point": "Le tracé doit obligatoirement commencer à ce point précis.",
  "end-point": "Le tracé doit obligatoirement se terminer à ce point précis.",
  "min-stars": "Un nombre minimum d'étoiles doit être collecté pour valider le niveau.",
  "ordered-stars": "Les étoiles doivent être collectées dans un ordre précis.",
  "avoid-zone": "Une zone du plateau doit être évitée par le tracé.",
  "color-match": "Les couleurs des segments doivent correspondre entre elles.",
}

// -------------------------
// RULE LABELS (courts, pour badges)
// -------------------------
export const RULE_LABELS: Record<LevelRuleType, string> = {
  "visit-count": "Visites",
  "no-backtrack": "Sans retour",
  "start-point": "Départ",
  "end-point": "Arrivée",
  "min-stars": "Étoiles min.",
  "ordered-stars": "Ordre",
  "avoid-zone": "Zone interdite",
  "color-match": "Couleurs",
}