import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#34D399", // Emerald 400 - closer to the vibrant green in the design
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#10B981", // Emerald 500
  },
  icon: {
    marginLeft: 8,
  },
});