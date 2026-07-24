// AdditionnalRuleBadge.styles.ts
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: "relative",
    width: 56,
    height: 56,
  },

  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  subBadgeContainer: {
    position: "absolute",
    minWidth: 28,
    height: 27,
    left: 6,
    top: 48,
  },

  subBadge: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#FF8F20",
    borderRadius: 20,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  subBadgeHighlight: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    left: "17%",
    top: "10%",
    backgroundColor: "#FFFFFF",
  },

  subBadgeGlow: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    left: "70%",
    top: "18%",
    backgroundColor: "#FFFFFF",
    opacity: 0.6,
  },

  subBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7A3E00",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 24,
    maxWidth: "80%",
  },

  modalIconContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
  },

  modalDescription: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
  },
})