import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20, // Borda um pouco mais arredondada
    padding: 24, // Aumentamos o padding geral (era 16)
    marginVertical: 12,
    width: "95%", // Garante que ocupe o espaço legal na tela
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
  },
  title: {
    fontSize: 22, // Título maior (era 18)
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15, // Subtítulo maior (era 13)
    color: "#6B7280",
  },
  statusPill: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    gap: 16, // Mais espaço entre as duas caixas (era 12)
    marginTop: 24, // Mais espaço do cabeçalho
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12, // Caixa mais gordinha (era 12)
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 44, // Círculo do ícone maior (era 36)
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 11, // Label um pouco mais legível (era 10)
    fontWeight: "bold",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15, // Valores de destaque bem maiores (era 15)
    color: "#111827",
    fontWeight: "500",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20, // Mais respiro antes dos botões
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
    gap: 10,
    paddingVertical: 8, // Botões com área de clique maior
  },
  footerButtonText: {
    fontSize: 14, // Fonte do botão maior (era 14)
    color: "#374151",
    fontWeight: "600", // Peso um pouco maior para destacar
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
});

export default styles;
