import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    width: "95%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    flex: 1,
    marginRight: 8,
  },
  tipoPill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tipoText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  estoqueCritico: {
    color: "#EF4444",
  },
  alertaEstoque: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "bold",
    marginTop: 2,
  },
  fornecedorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  fornecedorText: {
    fontSize: 13,
    color: "#6B7280",
  },
  loteText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    minHeight: 44,
  },
  footerButtonText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
  },
});

export default styles;
