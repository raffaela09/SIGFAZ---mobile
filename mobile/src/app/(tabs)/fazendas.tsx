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
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { FontAwesome, FontAwesome5, Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import Pill from "../components/Pill";
import FloatingButton from "../components/FloatingButton";

interface Fazenda {
  id: number;
  nome: string;
  localizacao: string;
  areaTotal?: number;
  area_total_hectares?: number;
  status: string;
}

export default function FazendasScreen() {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFiltro, setSelectedFiltro] = useState("Todos");

  const fetchFazendas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.1.117:8000/fazendas/");
      if (response.ok) {
        const data = await response.json();
        setFazendas(data);
      }
    } catch (error) {
      console.error("Erro ao buscar fazendas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFazendas();
    }, [])
  );

  // Agora envia os dados atuais da fazenda via parâmetros de rota para a tela de edição
  const handleEdit = (fazenda: Fazenda) => {
    router.push({
      pathname: "/new-fazenda",
      params: {
        id: fazenda.id,
        nome: fazenda.nome,
        localizacao: fazenda.localizacao,
        areaTotal: fazenda.areaTotal || fazenda.area_total_hectares || 0,
        status: fazenda.status,
      },
    });
  };

  const handleDelete = (id: number, nomeFazenda: string) => {
    Alert.alert(
      "Excluir Fazenda",
      `Tem certeza que deseja excluir a ${nomeFazenda}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.117:8000/fazendas/${id}`, {
                method: "DELETE",
              });
              if (response.ok) {
                Alert.alert("Sucesso", "Fazenda excluída.");
                fetchFazendas();
              } else {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert("Erro", errorData.detail || "Não foi possível excluir a fazenda.");
              }
            } catch (e) {
              Alert.alert("Erro", "Falha de conexão.");
            }
          },
        },
      ]
    );
  };

  // Filtragem local
  const filteredFazendas = (fazendas || []).filter((f) => {
    const matchesSearch = f.nome.toLowerCase().includes(searchText.toLowerCase());
    if (selectedFiltro === "Todos") return matchesSearch;
    if (selectedFiltro === "Ativas") return matchesSearch && f.status === "Ativa";
    if (selectedFiltro === "Inativas") return matchesSearch && f.status === "Inativa";
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Fazendas"
        icon={
          <TouchableOpacity onPress={() => Alert.alert("Filtro", "Filtre suas fazendas abaixo.")}>
            <FontAwesome name="filter" size={24} color="#565D6DFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Barra de Busca */}
        <View style={styles.searchBarContainer}>
          <FontAwesome5 name="search" size={18} color="#565D6DFF" />
          <TextInput
            placeholder="Buscar fazenda pelo nome..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filtros em Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={{ gap: 10, paddingRight: 20 }}
        >
          {["Todos", "Ativas", "Inativas", "Por região"].map((filtro) => (
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
          <Text style={styles.resultsTitle}>RESULTADOS ({filteredFazendas.length})</Text>
          <Text style={styles.mapLink}>Ver mapa</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
        ) : filteredFazendas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma fazenda encontrada.</Text>
        ) : (
          filteredFazendas.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{item.nome}</Text>
                  <Text style={styles.cardCoords}>{item.localizacao}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: (item.status || "Ativa") === "Ativa" ? "#DCFCE7" : "#FEE2E2" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: (item.status || "Ativa") === "Ativa" ? "#16A34A" : "#DC2626" },
                    ]}
                  >
                    {item.status || "Ativa"}
                  </Text>
                </View>
              </View>

              {/* Grid de Informações */}
              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>ÁREA TOTAL</Text>
                    <View style={styles.infoValueRow}>
                      <FontAwesome5 name="map-marked-alt" size={14} color="#22C358FF" style={{ marginRight: 6 }} />
                      <Text style={styles.infoValue}>{(item.areaTotal || item.area_total_hectares || 0).toLocaleString("pt-BR")} ha</Text>
                    </View>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>TALHÕES</Text>
                    <Text style={styles.infoValue}>{item.id === 1 ? "12" : item.id === 2 ? "8" : "24"}</Text>
                  </View>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>CULTURAS</Text>
                    <Text style={styles.infoValue}>{item.id === 1 ? "Soja, Milho" : item.id === 2 ? "Algodão" : "Trigo, Sorgo"}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>REND. MÉDIO</Text>
                    <Text style={styles.infoValue}>{item.id === 1 ? "65 sc/ha" : item.id === 2 ? "280 @/ha" : "52 sc/ha"}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Botões de Ação */}
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                  <Feather name="edit-2" size={16} color="#475569" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Editar</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => Alert.alert("Atividades", `Gerenciando atividades da fazenda ${item.nome}`)}
                >
                  <Feather name="activity" size={16} color="#475569" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Atividade</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.nome)}>
                  <Feather name="trash-2" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                  <Text style={[styles.actionBtnText, { color: "#EF4444" }]}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={styles.footerInfo}>exibindo {filteredFazendas.length} de {fazendas.length} fazendas</Text>
        <TouchableOpacity style={styles.loadMoreBtn} onPress={fetchFazendas}>
          <Text style={styles.loadMoreText}>Carregar mais fazendas</Text>
        </TouchableOpacity>
      </ScrollView>

      <FloatingButton onPress={() => router.push("/new-fazenda")} />
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
    paddingBottom: 120,
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
  mapLink: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#22C358FF",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  cardCoords: {
    fontSize: 12,
    color: "#64748B",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  infoGrid: {
    marginBottom: 14,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94A3B8",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E2E8F0",
  },
  footerInfo: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 10,
    marginBottom: 16,
  },
  loadMoreBtn: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "white",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
});
