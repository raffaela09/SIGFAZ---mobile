import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import Header from "../components/Header";
import Pill from "../components/Pill";
import MaquinaCard from "../components/MaquinaCard";
import Input from "../components/Input";
import Button from "../components/Button";
import DetailModal from "../components/DetailModal";
import ConfirmModal from "../components/ConfirmModal";
import { Maquina, TIPOS_MAQUINA } from "../../types/inventario";
import { API_BASE } from "../../constants/api";

const FILTROS = ["Todos", ...TIPOS_MAQUINA];

type FormState = {
  nome: string;
  tipo: string;
  marca: string;
  ano: string;
};

const emptyForm: FormState = {
  nome: "",
  tipo: "Trator",
  marca: "",
  ano: "",
};

export default function MaquinasScreen() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [viewItem, setViewItem] = useState<Maquina | null>(null);
  const [deleteItem, setDeleteItem] = useState<Maquina | null>(null);

  const fetchMaquinas = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await fetch(`${API_BASE}/maquinas/`);
      if (response.ok) {
        const data: Maquina[] = await response.json();
        setMaquinas(data);
      } else {
        throw new Error("Falha ao carregar máquinas");
      }
    } catch {
      setMaquinas([]);
      setApiError("Erro ao carregar máquinas.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMaquinas();
    }, [])
  );

  const filteredMaquinas = maquinas.filter((item) => {
    const searchLower = searchText.toLowerCase();
    const matchesSearch =
      item.nome.toLowerCase().includes(searchLower) ||
      item.marca.toLowerCase().includes(searchLower) ||
      item.tipo.toLowerCase().includes(searchLower);
    const matchesTipo = selectedTipo === "Todos" || item.tipo === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (item: Maquina) => {
    setEditingId(item.id);
    setForm({
      nome: item.nome,
      tipo: item.tipo,
      marca: item.marca,
      ano: String(item.ano),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      Alert.alert("Erro", "Informe o nome da máquina.");
      return;
    }
    if (!form.marca.trim()) {
      Alert.alert("Erro", "Informe a marca/modelo.");
      return;
    }
    const ano = parseInt(form.ano, 10);
    if (Number.isNaN(ano) || ano < 1950 || ano > new Date().getFullYear() + 1) {
      Alert.alert("Erro", "Informe um ano válido.");
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      marca: form.marca.trim(),
      ano,
    };

    setSaving(true);
    try {
      const url = editingId
        ? `${API_BASE}/maquinas/${editingId}`
        : `${API_BASE}/maquinas/`;
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalVisible(false);
        await fetchMaquinas();
        Alert.alert("Sucesso", editingId ? "Máquina atualizada!" : "Máquina cadastrada!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert("Erro", errorData.detail ?? "Não foi possível salvar a máquina.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a máquina.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    const item = deleteItem;
    setDeleteItem(null);

    try {
      const response = await fetch(`${API_BASE}/maquinas/${item.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchMaquinas();
      } else {
        Alert.alert("Erro", "Não foi possível excluir.");
      }
    } catch {
      Alert.alert("Erro", "Falha de conexão ao excluir.");
    }
  };

  const handleView = async (item: Maquina) => {
    try {
      const response = await fetch(`${API_BASE}/maquinas/${item.id}`);
      if (response.ok) {
        setViewItem(await response.json());
      } else {
        setViewItem(item);
      }
    } catch {
      setViewItem(item);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Gestão de Máquinas"
        icon={
          <TouchableOpacity onPress={openCreate}>
            <Feather name="plus-circle" size={24} color="#22C358FF" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {apiError && (
          <Text style={styles.offlineBanner}>{apiError}</Text>
        )}

        <Text style={styles.subtitle}>
          Controle sua frota, custos operacionais e cronograma de manutenção.
        </Text>

        <TouchableOpacity style={styles.newButton} onPress={openCreate}>
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Nova Máquina</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Total de Ativos</Text>
              <View style={styles.kpiIconBlue}>
                <FontAwesome5 name="tractor" size={14} color="#3B82F6" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{maquinas.length} Máquinas</Text>
          </View>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Tipos Cadastrados</Text>
              <View style={styles.kpiIconGreen}>
                <Feather name="check-circle" size={14} color="#22C358FF" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{new Set(maquinas.map((m) => m.tipo)).size} Tipos</Text>
          </View>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Ano Mais Recente</Text>
              <View style={styles.kpiIconYellow}>
                <Feather name="calendar" size={14} color="#F59E0B" />
              </View>
            </View>
            <Text style={styles.kpiValue}>
              {maquinas.length ? Math.max(...maquinas.map((m) => m.ano)) : "—"}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.viewText}>
          <FontAwesome5 name="search" size={20} color="#565D6DFF" />
          <TextInput
            placeholder="Buscar por nome, marca ou tipo..."
            style={styles.textBox}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => { setSearchText(""); setSelectedTipo("Todos"); }}
          >
            <Feather name="sliders" size={16} color="#374151" />
            <Text style={styles.filterBtnText}>Limpar Filtros</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.viewPill} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
          {FILTROS.map((tipo) => (
            <TouchableOpacity key={tipo} onPress={() => setSelectedTipo(tipo)}>
              <Pill
                text={tipo}
                backgroundColor={selectedTipo === tipo ? "#22C358FF" : "#E5E7EB"}
                textColor={selectedTipo === tipo ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.result}>
          <Text style={styles.titleResult}>RESULTADOS ({filteredMaquinas.length})</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
        ) : filteredMaquinas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma máquina encontrada.</Text>
        ) : (
          filteredMaquinas.map((item) => (
            <MaquinaCard
              key={item.id}
              nome={item.nome}
              modelo={item.marca}
              tipo={item.tipo}
              ano={item.ano}
              onView={() => handleView(item)}
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteItem(item)}
            />
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? "Editar Máquina" : "Nova Máquina"}</Text>
            <Input label="Nome *" placeholder="Ex: Trator Série 8R" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} />
            <Text style={styles.fieldLabel}>Tipo *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
              {TIPOS_MAQUINA.map((tipo) => (
                <TouchableOpacity key={tipo} onPress={() => setForm({ ...form, tipo })}>
                  <Pill text={tipo} backgroundColor={form.tipo === tipo ? "#22C358FF" : "#E5E7EB"} textColor={form.tipo === tipo ? "#FFF" : "#000"} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Input label="Marca / Modelo *" placeholder="Ex: John Deere" value={form.marca} onChangeText={(v) => setForm({ ...form, marca: v })} />
            <Input label="Ano *" placeholder="2024" keyboardType="numeric" value={form.ano} onChangeText={(v) => setForm({ ...form, ano: v })} />
            <View style={styles.modalActions}>
              <Button title="Cancelar" variant="outline" style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
              <Button title={saving ? "Salvando..." : "Salvar"} variant="primary" style={{ flex: 1 }} disabled={saving} onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>

      <DetailModal
        visible={viewItem !== null}
        title={viewItem?.nome ?? ""}
        lines={
          viewItem
            ? [
                `Tipo: ${viewItem.tipo}`,
                `Marca: ${viewItem.marca}`,
                `Ano: ${viewItem.ano}`,
              ]
            : []
        }
        onClose={() => setViewItem(null)}
      />

      <ConfirmModal
        visible={deleteItem !== null}
        title="Excluir Máquina"
        message={`Deseja excluir "${deleteItem?.nome}"?`}
        confirmLabel="Excluir"
        onCancel={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { alignItems: "center", gap: 16, paddingTop: 10, paddingBottom: 100 },
  offlineBanner: { width: "95%", backgroundColor: "#FEF3C7", color: "#92400E", padding: 10, borderRadius: 8, fontSize: 12, textAlign: "center" },
  subtitle: { width: "95%", fontSize: 14, color: "#6B7280", lineHeight: 20 },
  newButton: { width: "95%", backgroundColor: "#22C358FF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12 },
  newButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  kpiRow: { gap: 12, paddingHorizontal: 10 },
  kpiCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, width: 180, borderWidth: 1, borderColor: "#F1F5F9" },
  kpiHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  kpiLabel: { fontSize: 12, color: "#6B7280", flex: 1, marginRight: 8 },
  kpiIconBlue: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
  kpiIconGreen: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" },
  kpiIconYellow: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
  kpiValue: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  viewText: { width: "95%", backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", padding: 5, gap: 10, borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e1", paddingLeft: 10 },
  textBox: { flex: 1, backgroundColor: "#FFFFFF", paddingVertical: 8 },
  filterRow: { width: "95%" },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB", alignSelf: "flex-start" },
  filterBtnText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  viewPill: { width: "100%", paddingHorizontal: 10 },
  result: { width: "95%" },
  titleResult: { fontWeight: "bold", color: "rgb(107, 107, 107)" },
  emptyText: { marginTop: 20, color: "#6B7280" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 16 },
});
