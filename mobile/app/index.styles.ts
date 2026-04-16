import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
  },

  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    fontSize: 12,
    color: "#fff",
  },

  burger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  burgerText: {
    fontSize: 20,
  },

  title: {
    fontSize: 40,
    fontStyle: "italic",
    fontWeight: "500", // ✅ medium
    color: "#FFFFFF",
    marginBottom: 20,

    textShadowColor: "rgba(45, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  touchText: {
    marginTop: 30,
    fontSize: 16,
    color: "#fff",
  },
});
