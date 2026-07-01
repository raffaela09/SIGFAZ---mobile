import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../Button";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button title="Cancelar" variant="outline" style={styles.btn} onPress={onCancel} />
            <Button title={confirmLabel} variant="primary" style={styles.btn} onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  box: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
  },
});
