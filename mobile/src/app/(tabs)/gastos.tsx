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
import { FontAwesome5, Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import Pill from "../components/Pill";
import FloatingButton from "../components/FloatingButton";

interface Custo {
  id: number;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
}

export default function GastosScreen() {
  const [loading, setLoading] = useState(true);
  const [custos, setCustos] = useState<Custo[]>([]);
  
  // Filtros
  const [searchText, setSearchText] = useState("");
  const [selectedFiltro, setSelectedFiltro] = useState("Todos");

  // Accordion de categorias dinâmico
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const fetchCustos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://192.168.1.117:8000/custos/");
      if (res.ok) {
        const data = await res.json();
        setCustos(data || []);
        
        // Inicializa o accordion abrindo a primeira categoria encontrada por padrão
        if (data && data.length > 0) {
          setExpandedCategories((prev) => ({
            [data[0].categoria]: true,
            ...prev
          }));
        }
      }
    } catch (e) {
      console.error("Erro ao buscar custos:", e);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCustos();
    }, [])
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleDeleteGasto = (id: number, descricao: string) => {
    Alert.alert(
      "Excluir Gasto",
      `Tem certeza que deseja excluir "${descricao}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.1.117:8000/custos/${id}`, {
                method: "DELETE",
              });
              if (response.ok) {
                Alert.alert("Sucesso", "Gasto excluído.");
                fetchCustos();
              } else {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert("Erro", errorData.detail || "Não foi possível excluir o gasto.");
              }
            } catch (e) {
              Alert.alert("Erro", "Falha de conexão.");
            }
          },
        },
      ]
    );
  };

  // Helper para padronizar estilização por Categoria
  const getCategoryConfig = (categoria: string) => {
    const catLower = categoria.toLowerCase();
    if (catLower.includes("fertilizante") || catLower.includes("insumo")) {
      return { icon: "seedling", bg: "#DCFCE7", color: "#16A34A" };
    }
    if (catLower.includes("combustível") || catLower.includes("óleo")) {
      return { icon: "gas-pump", bg: "#FFEFE6", color: "#FF7C33" };
    }
    if (catLower.includes("manutenção") || catLower.includes("oficina")) {
      return { icon: "tools", bg: "#F1F5F9", color: "#475569" };
    }
    return { icon: "tag", bg: "#E0F2FE", color: "#0369A1" }; // Default caso mude no POST
  };

  // Filtragem local dos lançamentos
  const filteredCustos = (custos || []).filter((c) => {
    const desc = c.descricao ? c.descricao.toLowerCase() : "";
    const cat = c.categoria ? c.categoria.toLowerCase() : "";
    const matchesSearch = desc.includes(searchText.toLowerCase()) || cat.includes(searchText.toLowerCase());

    if (selectedFiltro === "Todos") return matchesSearch;
    return matchesSearch && cat === selectedFiltro.toLowerCase();
  });

  // Lista de categorias únicas encontradas no banco para renderizar os blocos dinamicamente
  const categoriasUnicas = Array.from(new Set((custos || []).map((c) => c.categoria)));

  const totalPeriodo = (custos || []).reduce((acc, cur) => acc + (cur.valor || 0), 0);
  const custoMedioHa = totalPeriodo > 0 ? (totalPeriodo / 182.5) : 0;

  return (
    <View style={styles.container}>
      <Header
        title="Gastos"
        icon={
          <TouchableOpacity onPress={() => Alert.alert("Inbox", "Nenhuma notificação de gastos.")}>
            <Feather name="mail" size={24} color="#565D6DFF" />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* KPIs */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiHeader}>TOTAL DO PERÍODO</Text>
              <Text style={styles.kpiValue}>
                R$ {totalPeriodo.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.kpiSub, { color: "#16A34A" }]}>+12.5% vs mês anterior</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={styles.kpiHeader}>CUSTO MÉDIO / HA</Text>
              <Text style={styles.kpiValue}>
                R$ {custoMedioHa.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <Text style={styles.kpiSub}>Base: 182.5 ha</Text>
            </View>
          </View>

          {/* Busca */}
          <View style={styles.searchBarContainer}>
            <FontAwesome5 name="search" size={18} color="#565D6DFF" />
            <TextInput
              placeholder="Buscar por descrição ou categoria..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Filtros em Pills corrigidos para bater com o back */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pillsScroll}
            contentContainerStyle={{ gap: 10, paddingRight: 20 }}
          >
            {["Todos", "Fertilizantes", "Combustível", "Manutenção"].map((filtro) => (
              <TouchableOpacity key={filtro} onPress={() => setSelectedFiltro(filtro)}>
                <Pill
                  text={filtro}
                  backgroundColor={selectedFiltro === filtro ? "#22C358FF" : "#E2E8F0"}
                  textColor={selectedFiltro === filtro ? "#FFFFFF" : "#475569"}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Últimos Lançamentos */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ÚLTIMOS LANÇAMENTOS</Text>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </View>

          <View style={styles.launchList}>
            {filteredCustos.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum registro encontrado para o filtro.</Text>
            ) : (
              filteredCustos.map((c) => {
                const config = getCategoryConfig(c.categoria);
                return (
                  <View key={c.id} style={styles.launchCard}>
                    <View style={[styles.launchIconBox, { backgroundColor: config.bg }]}>
                      <FontAwesome5 name={config.icon} size={14} color={config.color} />
                    </View>
                    <View style={styles.launchContent}>
                      <View style={styles.launchTop}>
                        <Text style={styles.launchTitle} numberOfLines={1}>{c.descricao}</Text>
                        <Text style={styles.launchValue}>
                          R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                      <Text style={styles.launchMeta}>
                        {String(c.data || "").split("-").reverse().join("/")} • Fazenda Progresso • {c.categoria}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Resumo por Categoria Dinâmico mapeando o Banco de dados */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>RESUMO POR CATEGORIA</Text>

          {categoriasUnicas.map((cat) => {
            const config = getCategoryConfig(cat);
            const itensCategoria = (custos || []).filter(c => c.categoria === cat);
            const totalCategoria = itensCategoria.reduce((acc, cur) => acc + cur.valor, 0);
            const estaAberto = !!expandedCategories[cat];

            return (
              <View key={cat} style={styles.catCard}>
                <TouchableOpacity style={styles.catHeader} onPress={() => toggleCategory(cat)}>
                  <View style={styles.catHeaderLeft}>
                    <View style={[styles.catIconBox, { backgroundColor: config.bg }]}>
                      <FontAwesome5 name={config.icon} size={14} color={config.color} />
                    </View>
                    <View>
                      <Text style={styles.catTitle}>{cat}</Text>
                      <Text style={styles.catSub}>{itensCategoria.length} item(ns) na lista</Text>
                    </View>
                  </View>
                  <View style={styles.catHeaderRight}>
                    <Text style={styles.catValue}>
                      R$ {totalCategoria.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                    <Feather 
                      name={estaAberto ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#64748B" 
                      style={{ marginLeft: 10 }} 
                    />
                  </View>
                </TouchableOpacity>

                {estaAberto && (
                  <View style={styles.catDetailBox}>
                    {itensCategoria.map(c => (
                      <View key={c.id} style={styles.catDetailRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                          <Text style={styles.catDetailName} numberOfLines={1}>{c.descricao}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <Text style={styles.catDetailVal}>R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</Text>
                          <TouchableOpacity onPress={() => handleDeleteGasto(c.id, c.descricao)}>
                            <Feather name="trash-2" size={14} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <FloatingButton onPress={() => router.push("/new-gasto")} />
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
  kpiRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  kpiHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 10,
    color: "#64748B",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C358FF",
  },
  launchList: {
    gap: 12,
  },
  launchCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  launchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  launchContent: {
    flex: 1,
  },
  launchTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  launchTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
    flex: 1,
    marginRight: 10,
  },
  launchValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  launchMeta: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
    paddingVertical: 10,
  },
  catCard: {
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    overflow: "hidden",
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  catHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  catIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  catSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  catHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  catValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
  },
  catDetailBox: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
    padding: 12,
    gap: 8,
  },
  catDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  catDetailName: {
    fontSize: 12,
    color: "#475569",
    flex: 1,
    marginRight: 10,
  },
  catDetailVal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E293B",
  },
});
