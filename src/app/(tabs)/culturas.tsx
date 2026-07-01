import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { FontAwesome, FontAwesome5, Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import Pill from "../components/Pill";
import FloatingButton from "../components/FloatingButton";
import { API_BASE } from "@/constants/api";

export default function CulturasScreen() {
  const [culturas, setCulturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFiltro, setSelectedFiltro] = useState("Todas");
  const [selectedCulturaId, setSelectedCulturaId] = useState<number | null>(null);

  const fetchCulturas = async () => {
    try {
      setLoading(true);
      // Rota correta apontando para o seu APIRouter do backend
      const response = await fetch(`${API_BASE}/culturas/`);
      if (response.ok) {
      const data = await response.json();
      console.log("Culturas:", data);
      setCulturas(data);
      } else {
        Alert.alert("Erro", "Não foi possível carregar as culturas do servidor.");
      }
    } catch (error) {
      console.error("Erro ao buscar talhões", error);
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCulturas();
    }, [])
  );

  const handleDelete = (id: number, nome: string) => {
    const deleteCultura = async () => {
      try {
        const response = await fetch(`${API_BASE}/culturas/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Alert.alert("Sucesso", "Ciclo excluído.");
          fetchCulturas();
        } else {
          const errorData = await response.json().catch(() => ({}));
          Alert.alert("Erro", errorData.detail || "Não foi possível excluir o ciclo de cultivo.");
        }
      } catch (e) {
        Alert.alert("Erro", "Falha ao excluir.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja realmente excluir o ciclo ${nome}?`)) {
        deleteCultura();
      }
    } else {
      Alert.alert(
        "Excluir Ciclo de Cultivo",
        `Deseja realmente excluir o ciclo ${nome}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: deleteCultura,
          },
        ]
      );
    }
  };

  // Filtragem corrigida baseando-se estritamente na estrutura retornada por SELECT * FROM Cultura
  const filteredCulturas = (culturas || []).filter((item) => {
    // Mapeamento correto com fallback seguro para strings
    const cultura = item.nome ? String(item.nome).toLowerCase() : "";
    const safra = item.safra ? String(item.safra).toLowerCase() : "";

    const matchesSearch =
      cultura.includes(searchText.toLowerCase()) || safra.includes(searchText.toLowerCase());

    const matchesFiltro =
      selectedFiltro === "Todas" ||
      cultura.includes(selectedFiltro.toLowerCase()) ||
      safra.includes(selectedFiltro.toLowerCase());

    return matchesSearch && matchesFiltro;
  });

  // Como a tabela Cultura não possui o campo área, definimos valores simulados ou padronizados seguros
  const totalAreaPlantada = filteredCulturas.length * 50; // Exemplo de cálculo estático por ciclo para evitar quebras
  const activeCropsCount = filteredCulturas.length;

  return (
    <View style={styles.container}>
      <Header
        title="Culturas"
        icon={
          <TouchableOpacity onPress={() => Alert.alert("Filtro", "Filtre os ciclos de cultivo abaixo.")}>
            <FontAwesome name="filter" size={24} color="#565D6DFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconContainer}>
              <FontAwesome5 name="seedling" size={16} color="#22C358FF" />
            </View>
            <View style={styles.kpiTextContainer}>
              <Text style={styles.kpiLabel}>Culturas Ativas</Text>
              <Text style={styles.kpiValue}>{activeCropsCount}</Text>
              <Text style={styles.kpiSub}>No total</Text>
            </View>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconContainer, { backgroundColor: "#DBEAFE" }]}>
              <FontAwesome5 name="globe-americas" size={16} color="#2563EB" />
            </View>
            <View style={styles.kpiTextContainer}>
              <Text style={styles.kpiLabel}>Área Total Est.</Text>
              <Text style={styles.kpiValue}>{totalAreaPlantada} ha</Text>
              <Text style={styles.kpiSub}>Estimativa</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchBarContainer}>
          <FontAwesome5 name="search" size={18} color="#565D6DFF" />
          <TextInput
            placeholder="Buscar por nome ou safra..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          {["Todas", "Soja", "Milho", "Trigo"].map((filtro) => (
            <TouchableOpacity key={filtro} onPress={() => setSelectedFiltro(filtro)}>
              <Pill
                text={filtro}
                backgroundColor={selectedFiltro === filtro ? "#22C358FF" : "#E2E8F0"}
                textColor={selectedFiltro === filtro ? "#FFFFFF" : "#475569"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>CICLOS RECENTES</Text>
          <Text style={styles.resultsCount}>{filteredCulturas.length} resultados</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
        ) : filteredCulturas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum ciclo encontrado.</Text>
        ) : (
          filteredCulturas.map((item, index) => {
            const id = item[0];
            const cultura = item[1] ?? "Não informada";
            const safra = item[2] ?? "Não informada";

            const area = item[3] ?? 45;
            const status = item[4] ?? "Crescimento";
            const dataPlantio = item[5] ?? "";
            const rendimentoMedio = 65;
            const producaoEstimada = Math.round(area * rendimentoMedio);

            let statusBg = "#FFEFE6";
            let statusText = "#FF7C33";

            return (
              <View key={id || index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.cardTitle}>
                      {cultura} - ID #{id}
                    </Text>
                    <Text style={styles.cardSubtitle}>{safra}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                    <Text style={[styles.statusText, { color: statusText }]}>
                      {status}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailsRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Área Pad.</Text>
                      <Text style={styles.detailValue}>{area} ha</Text>
                    </View>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Plantio Est.</Text>
                      <Text style={styles.detailValue}>
                        {dataPlantio
                          ? dataPlantio.split("-").reverse().join("/")
                          : "Não informada"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Rendimento</Text>
                      <Text style={[styles.detailValue, { color: "#22C358FF" }]}>
                        {rendimentoMedio} sc/ha
                      </Text>
                    </View>
                    <View style={styles.detailCol}>
                      <Text style={styles.detailLabel}>Produção Est.</Text>
                      <Text style={[styles.detailValue, { color: "#16A34A" }]}>
                        {producaoEstimada.toLocaleString("pt-BR")} sc
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <View style={styles.actionIcons}>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert("Informações", `Cultura ID: ${id}\nNome: ${cultura}\nSafra: ${safra}`)
                      }
                      style={styles.iconBtn}
                    >
                      <Feather name="eye" size={18} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                          router.push({
                            pathname: "/new-cultura",
                            params: { culturaData: JSON.stringify(item) },
                          });
                        }}
                      style={styles.iconBtn}
                    >
                      <Feather name="edit-2" size={18} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(id, cultura)} style={styles.iconBtn}>
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setSelectedCulturaId(id)}
                    style={styles.atividadeBtn}
                  >
                    <Feather name="plus" size={14} color="#22C358FF" style={{ marginRight: 4 }} />
                    <Text style={styles.atividadeBtnText}>Atividade</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.footerEnd}>Fim da lista de ciclos</Text>
      </ScrollView>

      <FloatingButton onPress={() => router.push("/new-cultura")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  kpiContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  kpiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  kpiTextContainer: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginVertical: 1,
  },
  kpiSub: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "500",
  },
  searchBarContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1E293B",
  },
  pillsScroll: {
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  resultsCount: {
    fontSize: 12,
    color: "#94A3B8",
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  detailsGrid: {
    gap: 12,
    marginBottom: 14,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionIcons: {
    flexDirection: "row",
    gap: 14,
  },
  iconBtn: {
    padding: 4,
  },
  atividadeBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#22C358FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  atividadeBtnText: {
    color: "#22C358FF",
    fontSize: 12,
    fontWeight: "600",
  },
  footerEnd: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 20,
  },
});
