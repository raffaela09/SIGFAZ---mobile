import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import styles from "./styles";

interface InsumoCardProps {
  nome: string;
  tipo: string;
  estoque: string;
  custoUnitario: string;
  fornecedor?: string;
  lote?: string;
  validade?: string;
  estoqueCritico?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InsumoCard({
  nome,
  tipo,
  estoque,
  custoUnitario,
  fornecedor,
  lote,
  validade,
  estoqueCritico = false,
  onView,
  onEdit,
  onDelete,
}: InsumoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{nome}</Text>
        <View style={styles.tipoPill}>
          <Text style={styles.tipoText}>{tipo}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ESTOQUE ATUAL</Text>
          <Text style={[styles.infoValue, estoqueCritico && styles.estoqueCritico]}>
            {estoque}
          </Text>
          {estoqueCritico && (
            <Text style={styles.alertaEstoque}>ESTOQUE CRÍTICO</Text>
          )}
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>CUSTO UNITÁRIO</Text>
          <Text style={styles.infoValue}>{custoUnitario}</Text>
        </View>
      </View>

      {(fornecedor || lote || validade) && (
        <View style={styles.fornecedorRow}>
          {fornecedor ? <Text style={styles.fornecedorText}>{fornecedor}</Text> : <View />}
          {(lote || validade) && (
            <Text style={styles.loteText}>
              {[lote, validade].filter(Boolean).join(" · ")}
            </Text>
          )}
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

        <View style={styles.verticalDivider} />

        <Pressable style={styles.footerButton} onPress={onDelete} android_ripple={{ color: "#FEE2E2" }}>
          <Feather name="trash-2" size={16} color="#EF4444" />
          <Text style={[styles.footerButtonText, { color: "#EF4444" }]}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}
