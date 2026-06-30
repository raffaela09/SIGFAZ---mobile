import { Text, View } from "react-native";
import styles from "./styles";

interface PillProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export default function Pill({
  text,
  backgroundColor = "#E5E7EB", // Cor de fundo padrão se nenhuma for passada
  textColor = "#000000", // Cor do texto padrão
  borderColor,
}: PillProps) {
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor },
        // Se uma cor de borda for passada, adiciona a cor e a espessura da borda
        borderColor ? { borderColor: borderColor, borderWidth: 1 } : null,
      ]}
    >
      <Text style={{ color: textColor }}>{text}</Text>
    </View>
  );
}
