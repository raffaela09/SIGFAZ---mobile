import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import InsumoCard from "../components/InsumoCard";
import Input from "../components/Input";
import Button from "../components/Button";
import DetailModal from "../components/DetailModal";
import ConfirmModal from "../components/ConfirmModal";
import {
  CATEGORIAS_INSUMO,
  UNIDADES_INSUMO,
  Insumo,
  formatCurrency,
  isEstoqueCritico,
} from "../../types/inventario";
import { API_BASE } from "../../constants/api";

const PAGE_SIZE = 5;
const FILTROS = ["Todos", ...CATEGORIAS_INSUMO];

type FormState = {
  nome: string;
  categoria: string;
  quantidade: string;
  unidade: string;
  preco_unitario: string;
};

const emptyForm: FormState = {
  nome: "",
  categoria: "Fertilizantes",
  quantidade: "",
  unidade: "kg",
  preco_unitario: "",
};

export default function InsumosScreen() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("Todos");
  const [page, setPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [viewItem, setViewItem] = useState<Insumo | null>(null);
  const [deleteItem, setDeleteItem] = useState<Insumo | null>(null);

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const response = await fetch(`${API_BASE}/insumos/`);
      if (response.ok) {
        const data: Insumo[] = await response.json();
        setInsumos(data);
      } else {
        throw new Error("Falha ao carregar insumos");
      }
    } catch {
      setInsumos([]);
      setApiError("Erro ao carregar insumos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInsumos();
    }, [])
  );

  const filteredInsumos = insumos.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchText.toLowerCase());
    const matchesTipo = selectedTipo === "Todos" || item.categoria === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInsumos.length / PAGE_SIZE));
  const paginatedInsumos = filteredInsumos.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const valorTotal = insumos.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  const estoqueBaixo = insumos.filter((i) => isEstoqueCritico(i.quantidade, i.unidade)).length;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (item: Insumo) => {
    setEditingId(item.id);
    setForm({
      nome: item.nome,
      categoria: item.categoria,
      quantidade: String(item.quantidade),
      unidade: item.unidade,
      preco_unitario: String(item.preco_unitario),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      Alert.alert("Erro", "Informe o nome do insumo.");
      return;
    }
    const quantidade = parseFloat(form.quantidade);
    const preco = parseFloat(form.preco_unitario.replace(",", "."));
    if (Number.isNaN(quantidade) || quantidade < 0) {
      Alert.alert("Erro", "Informe uma quantidade válida.");
      return;
    }
    if (Number.isNaN(preco) || preco < 0) {
      Alert.alert("Erro", "Informe um preço unitário válido.");
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      categoria: form.categoria,
      quantidade,
      unidade: form.unidade,
      preco_unitario: preco,
    };

    setSaving(true);
    try {
      const url = editingId
        ? `${API_BASE}/insumos/${editingId}`
        : `${API_BASE}/insumos/`;
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalVisible(false);
        await fetchInsumos();
        Alert.alert("Sucesso", editingId ? "Insumo atualizado!" : "Insumo cadastrado!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert("Erro", errorData.detail ?? "Não foi possível salvar o insumo.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o insumo.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    const item = deleteItem;
    setDeleteItem(null);

    try {
      const response = await fetch(`${API_BASE}/insumos/${item.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchInsumos();
      } else {
        Alert.alert("Erro", "Não foi possível excluir.");
      }
    } catch {
      Alert.alert("Erro", "Falha de conexão ao excluir.");
    }
  };

  const handleView = async (item: Insumo) => {
    try {
      const response = await fetch(`${API_BASE}/insumos/${item.id}`);
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
        title="Insumos"
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
          Gerencie seu estoque de sementes, fertilizantes e defensivos.
        </Text>

        <TouchableOpacity style={styles.newButton} onPress={openCreate}>
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.newButtonText}>Novo Insumo</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Valor Total em Estoque</Text>
              <View style={styles.kpiIconGreen}>
                <FontAwesome5 name="dollar-sign" size={14} color="#22C358FF" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{formatCurrency(valorTotal)}</Text>
          </View>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Itens com Estoque Baixo</Text>
              <View style={styles.kpiIconYellow}>
                <Feather name="alert-triangle" size={14} color="#F59E0B" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{String(estoqueBaixo).padStart(2, "0")}</Text>
          </View>
          <View style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Total de Itens</Text>
              <View style={styles.kpiIconGreen}>
                <Feather name="package" size={14} color="#22C358FF" />
              </View>
            </View>
            <Text style={styles.kpiValue}>{insumos.length}</Text>
          </View>
        </ScrollView>

        <View style={styles.viewText}>
          <FontAwesome5 name="search" size={20} color="#565D6DFF" />
          <TextInput
            placeholder="Buscar insumo por nome..."
            style={styles.textBox}
            value={searchText}
            onChangeText={(t) => { setSearchText(t); setPage(0); }}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.viewPill} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
          {FILTROS.map((tipo) => (
            <TouchableOpacity key={tipo} onPress={() => { setSelectedTipo(tipo); setPage(0); }}>
              <Pill
                text={tipo}
                backgroundColor={selectedTipo === tipo ? "#22C358FF" : "#E5E7EB"}
                textColor={selectedTipo === tipo ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.result}>
          <Text style={styles.titleResult}>
            Mostrando {paginatedInsumos.length} de {filteredInsumos.length} insumos
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
        ) : filteredInsumos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum insumo encontrado.</Text>
        ) : (
          paginatedInsumos.map((item) => (
            <InsumoCard
              key={item.id}
              nome={item.nome}
              tipo={item.categoria}
              estoque={`${item.quantidade} ${item.unidade}`}
              custoUnitario={formatCurrency(item.preco_unitario)}
              estoqueCritico={isEstoqueCritico(item.quantidade, item.unidade)}
              onView={() => handleView(item)}
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteItem(item)}
            />
          ))
        )}

        {filteredInsumos.length > PAGE_SIZE && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.paginationBtn, page === 0 && styles.paginationBtnDisabled]}
              disabled={page === 0}
              onPress={() => setPage((p) => Math.max(0, p - 1))}
            >
              <Text style={styles.paginationBtnText}>Anterior</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>{page + 1} / {totalPages}</Text>
            <TouchableOpacity
              style={[styles.paginationBtn, styles.paginationBtnActive, page >= totalPages - 1 && styles.paginationBtnDisabled]}
              disabled={page >= totalPages - 1}
              onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              <Text style={[styles.paginationBtnText, { color: "#FFFFFF" }]}>Próximo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? "Editar Insumo" : "Novo Insumo"}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Input label="Nome do Insumo *" placeholder="Ex: Fertilizante NPK" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} />
              <Text style={styles.fieldLabel}>Categoria *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
                {CATEGORIAS_INSUMO.map((cat) => (
                  <TouchableOpacity key={cat} onPress={() => setForm({ ...form, categoria: cat })}>
                    <Pill text={cat} backgroundColor={form.categoria === cat ? "#22C358FF" : "#E5E7EB"} textColor={form.categoria === cat ? "#FFF" : "#000"} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Input label="Quantidade *" placeholder="0" keyboardType="numeric" value={form.quantidade} onChangeText={(v) => setForm({ ...form, quantidade: v })} />
              <Text style={styles.fieldLabel}>Unidade *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
                {UNIDADES_INSUMO.map((u) => (
                  <TouchableOpacity key={u} onPress={() => setForm({ ...form, unidade: u })}>
                    <Pill text={u} backgroundColor={form.unidade === u ? "#22C358FF" : "#E5E7EB"} textColor={form.unidade === u ? "#FFF" : "#000"} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Input label="Preço Unitário (R$) *" placeholder="0.00" keyboardType="decimal-pad" value={form.preco_unitario} onChangeText={(v) => setForm({ ...form, preco_unitario: v })} />
            </ScrollView>
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
                `Categoria: ${viewItem.categoria}`,
                `Estoque: ${viewItem.quantidade} ${viewItem.unidade}`,
                `Preço unitário: ${formatCurrency(viewItem.preco_unitario)}`,
                `Valor em estoque: ${formatCurrency(viewItem.quantidade * viewItem.preco_unitario)}`,
                isEstoqueCritico(viewItem.quantidade, viewItem.unidade)
                  ? "Estoque crítico"
                  : "Estoque normal",
              ]
            : []
        }
        onClose={() => setViewItem(null)}
      />

      <ConfirmModal
        visible={deleteItem !== null}
        title="Excluir Insumo"
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
  kpiCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, width: 200, borderWidth: 1, borderColor: "#F1F5F9" },
  kpiHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  kpiLabel: { fontSize: 12, color: "#6B7280", flex: 1, marginRight: 8 },
  kpiIconGreen: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" },
  kpiIconYellow: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
  kpiValue: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  viewText: { width: "95%", backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", padding: 5, gap: 10, borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e1", paddingLeft: 10 },
  textBox: { flex: 1, backgroundColor: "#FFFFFF", paddingVertical: 8 },
  viewPill: { width: "100%", paddingHorizontal: 10 },
  result: { width: "95%" },
  titleResult: { fontWeight: "600", color: "#6B7280", fontSize: 13 },
  emptyText: { marginTop: 20, color: "#6B7280" },
  pagination: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 20 },
  paginationBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" },
  paginationBtnActive: { backgroundColor: "#22C358FF", borderColor: "#22C358FF" },
  paginationBtnDisabled: { opacity: 0.4 },
  paginationBtnText: { fontWeight: "600", color: "#374151" },
  pageInfo: { color: "#6B7280", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 16 },
});
