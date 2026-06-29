import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

// Se não usar TypeScript, pode ignorar esta interface e remover o ": TalhaoCardProps" lá embaixo
interface TalhaoCardProps {
  nome: string;
  area: string;
  coordenadas: string;
  status: string;
  cultura: string;
  estimativa: string;
  onEdit: () => void;
  onAtividade: () => void;
}

export default function TalhaoCard({
  nome,
  area,
  coordenadas,
  status,
  cultura,
  estimativa,
  onEdit,
  onAtividade,
}: TalhaoCardProps) {
  return (
    <View style={styles.card}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{nome}</Text>
          <Text style={styles.subtitle}>
            {area} • {coordenadas}
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Caixas de Informação */}
      <View style={styles.infoRow}>
        {/* Cultura */}
        <View style={styles.infoBox}>
          <View style={[styles.iconCircle, { backgroundColor: "#E6F4EA" }]}>
            <MaterialCommunityIcons name="sprout" size={20} color="#16A34A" />
          </View>
          <View>
            <Text style={styles.infoLabel}>CULTURA</Text>
            <Text style={styles.infoValue}>{cultura}</Text>
          </View>
        </View>

        {/* Estimativa */}
        <View style={styles.infoBox}>
          <View style={[styles.iconCircle, { backgroundColor: "#F3F4F6" }]}>
            <Feather name="bar-chart-2" size={20} color="#4B5563" />
          </View>
          <View>
            <Text style={styles.infoLabel}>ESTIMATIVA</Text>
            <Text style={styles.infoValue}>{estimativa}</Text>
          </View>
        </View>
      </View>

      {/* Linha Divisória */}
      <View style={styles.divider} />

      {/* Rodapé com Ações */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onEdit}>
          <Feather name="edit-2" size={16} color="#374151" />
          <Text style={styles.footerButtonText}>Editar</Text>
        </TouchableOpacity>

        <View style={styles.verticalDivider} />

        <TouchableOpacity style={styles.footerButton} onPress={onAtividade}>
          <Feather name="activity" size={16} color="#374151" />
          <Text style={styles.footerButtonText}>Atividade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
