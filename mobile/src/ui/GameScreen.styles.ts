import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  resetButton: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  resetText: {
    color: "white",
  },

  gameArea: {
    flex: 1,
  },

  bannerContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: 260,
  },

  modalTitle: {
    fontSize: 22,
    marginBottom: 10,
  },

  continueButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#22c55e",
    borderRadius: 10,
  },

  continueText: {
    color: "white",
    fontWeight: "bold",
  },
})
