import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  rightLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    height: "100%",
  },
  rightIcon: {
    padding: 8,
    marginRight: -8,
  },
});
