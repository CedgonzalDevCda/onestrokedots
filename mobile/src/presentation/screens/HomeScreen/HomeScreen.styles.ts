import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  banner: {
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 4,
  },

  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  title: {
    fontSize: 40,
    fontStyle: "italic",
    fontWeight: "600", // semibold
    color: "#FFFFFF",
  },

  noAdsBtn: {
    position: "absolute",
    left: 0,
    bottom: 100,

    width: 120,
    height: 80,

    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,

    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  price: {
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "600",
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },

  squareButton: {
    width: 134,
    height: 134,
    backgroundColor: "#1E293B",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#1E293B",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
});
