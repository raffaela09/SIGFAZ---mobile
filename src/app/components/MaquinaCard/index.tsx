import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import styles from "./styles";

interface MaquinaCardProps {
  nome: string;
  modelo: string;
  tipo: string;
  ano: number;
  custoHora?: string;
  situacao?: "Operando" | "Manutenção" | "Inativo";
  operador?: string;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

const situacaoStyle = {
  Operando: styles.statusOperando,
  Manutenção: styles.statusManutencao,
  Inativo: styles.statusInativo,
};

export default function MaquinaCard({
  nome,
  modelo,
  tipo,
  ano,
  custoHora,
  situacao = "Operando",
  operador,
  onView,
  onEdit,
  onDelete,
}: MaquinaCardProps) {
  const initial = operador ? operador.charAt(0).toUpperCase() : "?";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.title}>{nome}</Text>
          <Text style={styles.subtitle}>{modelo}</Text>
        </View>
        <View style={styles.tipoPill}>
          <Text style={styles.tipoText}>{tipo}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ANO</Text>
          <Text style={styles.infoValue}>{ano}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>CUSTO / HORA</Text>
          <Text style={styles.infoValue}>{custoHora ?? "—"}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>SITUAÇÃO</Text>
          <Text style={[styles.infoValue, situacaoStyle[situacao]]}>{situacao}</Text>
        </View>
      </View>

      {operador && (
        <View style={styles.operadorRow}>
          <View style={styles.operadorAvatar}>
            <Text style={styles.operadorInitial}>{initial}</Text>
          </View>
          <Text style={styles.operadorNome}>{operador}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Pressable style={styles.footerButton} onPress={onView} android_ripple={{ color: "#E5E7EB" }}>
          <Feather name="eye" size={16} color="#374151" />
          <Text style={styles.footerButtonText}>Ver</Text>
        </Pressable>

        <View style={styles.verticalDivider} />

        <Pressable style={styles.footerButton} onPress={onEdit} android_ripple={{ color: "#E5E7EB" }}>
          <Feather name="edit-2" size={16} color="#374151" />
          <Text style={styles.footerButtonText}>Editar</Text>
        </Pressable>

        {onDelete && (
          <>
            <View style={styles.verticalDivider} />
            <Pressable style={styles.footerButton} onPress={onDelete} android_ripple={{ color: "#FEE2E2" }}>
              <Feather name="trash-2" size={16} color="#EF4444" />
              <Text style={[styles.footerButtonText, { color: "#EF4444" }]}>Excluir</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
