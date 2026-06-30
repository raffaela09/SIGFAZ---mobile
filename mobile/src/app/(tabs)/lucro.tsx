import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import Header from "../components/Header";

export default function LucroScreen() {
  const [loading, setLoading] = useState(true);
  const [resumoFinanceiro, setResumoFinanceiro] = useState<any>(null);

  const fetchResumo = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://192.168.1.117:8000/relatorios/resumo");
      if (res.ok) {
        const data = await res.json();
        setResumoFinanceiro(data);
      }
    } catch (e) {
      console.error("Erro ao buscar resumo de lucro:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResumo();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        title="Lucro"
        icon={
          <TouchableOpacity onPress={() => Alert.alert("Inbox", "Nenhuma notificação financeira.")}>
            <Feather name="mail" size={24} color="#565D6DFF" />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <ActivityIndicator size="large" color="#22C358FF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* KPI Grid (2x2) */}
          <View style={styles.kpiGrid}>
            <View style={styles.kpiGridRow}>
              <View style={styles.kpiGridCard}>
                <View style={styles.kpiGridHeader}>
                  <Text style={styles.kpiGridLabel}>RECEITA EST.</Text>
                  <FontAwesome5 name="arrow-up" size={10} color="#16A34A" />
                </View>
                <Text style={styles.kpiGridVal}>
                  R$ {(resumoFinanceiro?.receitaTotal || 1240000).toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}
                </Text>
                <Text style={styles.kpiGridTrend}>+12% vs safra anterior</Text>
              </View>

              <View style={styles.kpiGridCard}>
                <View style={styles.kpiGridHeader}>
                  <Text style={styles.kpiGridLabel}>CUSTO TOTAL</Text>
                  <FontAwesome5 name="arrow-up" size={10} color="#EF4444" />
                </View>
                <Text style={styles.kpiGridVal}>
                  R$ {(resumoFinanceiro?.custoTotal || 842000).toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}
                </Text>
                <Text style={styles.kpiGridTrend}>+8% de inflação insumos</Text>
              </View>
            </View>

            <View style={styles.kpiGridRow}>
              <View style={styles.kpiGridCard}>
                <View style={styles.kpiGridHeader}>
                  <Text style={styles.kpiGridLabel}>LUCRO EST.</Text>
                  <FontAwesome5 name="arrow-up" size={10} color="#16A34A" />
                </View>
                <Text style={styles.kpiGridVal}>
                  R$ {(resumoFinanceiro?.lucroEstimado || 398000).toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}
                </Text>
                <Text style={styles.kpiGridTrend}>+15% de rentabilidade</Text>
              </View>

              <View style={styles.kpiGridCard}>
                <View style={styles.kpiGridHeader}>
                  <Text style={styles.kpiGridLabel}>MARGEM %</Text>
                  <FontAwesome5 name="arrow-up" size={10} color="#16A34A" />
                </View>
                <Text style={styles.kpiGridVal}>{resumoFinanceiro?.margemLucro || 32.1}%</Text>
                <Text style={styles.kpiGridTrend}>+2.4% margem líquida</Text>
              </View>
            </View>
          </View>

          {/* Gráfico Receita vs Custo */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Fluxo: Receita vs Custo</Text>
            <Text style={styles.chartSub}>Projeção dos últimos 4 meses (R$)</Text>

            <View style={styles.barChartWrapper}>
              {resumoFinanceiro?.graficoFluxo?.meses.map((m: string, idx: number) => {
                const rec = resumoFinanceiro.graficoFluxo.receitas[idx];
                const cust = resumoFinanceiro.graficoFluxo.custos[idx];
                const maxVal = Math.max(...resumoFinanceiro.graficoFluxo.receitas, ...resumoFinanceiro.graficoFluxo.custos);
                const recHeight = (rec / maxVal) * 120;
                const custHeight = (cust / maxVal) * 120;

                return (
                  <View key={m} style={styles.chartBarCol}>
                    <View style={styles.barsGroup}>
                      <View style={[styles.barSingle, { height: recHeight, backgroundColor: "#22C358FF" }]} />
                      <View style={[styles.barSingle, { height: custHeight, backgroundColor: "#2563EB" }]} />
                    </View>
                    <Text style={styles.xAxisLabel}>{m}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: "#22C358FF" }]} />
                <Text style={styles.legendText}>Receita</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendIndicator, { backgroundColor: "#2563EB" }]} />
                <Text style={styles.legendText}>Custo</Text>
              </View>
            </View>
          </View>

          {/* Insights Financeiros */}
          <View style={styles.insightBox}>
            <View style={styles.insightIconBox}>
              <FontAwesome5 name="lightbulb" size={18} color="#059669" />
            </View>
            <View style={styles.insightTextWrapper}>
              <Text style={styles.insightTitle}>OTIMIZAÇÃO DE CUSTOS</Text>
              <Text style={styles.insightBody}>
                Redução de 5% no diesel prevista ao centralizar o agendamento de maquinários na Safra 24.
              </Text>
            </View>
          </View>

          {/* Performance por Cultura */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PERFORMANCE POR CULTURA</Text>
            <Text style={styles.seeAll}>Ver todos</Text>
          </View>

          <View style={styles.perfList}>
            {resumoFinanceiro?.performanceCultura.map((p: any) => (
              <View key={p.cultura} style={styles.perfCard}>
                <View style={styles.perfHeader}>
                  <View style={styles.perfTitleRow}>
                    <View style={styles.perfIcon}>
                      <FontAwesome5 name="seedling" size={12} color="#16A34A" />
                    </View>
                    <View>
                      <Text style={styles.perfName}>{p.cultura}</Text>
                      <Text style={styles.perfMeta}>
                        {p.fazenda} • {p.area} ha • Rev: R$ {p.receita.toLocaleString("pt-BR", { notation: "compact" })}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.perfLucro}>+R$ {p.lucro.toLocaleString("pt-BR", { notation: "compact" })}</Text>
                    <Text style={styles.perfMargin}>{p.margem}% margem</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
  kpiGrid: {
    gap: 12,
    marginBottom: 20,
  },
  kpiGridRow: {
    flexDirection: "row",
    gap: 12,
  },
  kpiGridCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  kpiGridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kpiGridLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  kpiGridVal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginVertical: 4,
  },
  kpiGridTrend: {
    fontSize: 9,
    color: "#64748B",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
  },
  chartSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 16,
  },
  barChartWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 140,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 8,
  },
  chartBarCol: {
    alignItems: "center",
  },
  barsGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  barSingle: {
    width: 14,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  xAxisLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 6,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#475569",
  },
  insightBox: {
    flexDirection: "row",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  insightIconBox: {
    marginRight: 10,
  },
  insightTextWrapper: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#065F46",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  insightBody: {
    fontSize: 12,
    color: "#065F46",
    lineHeight: 18,
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
  perfList: {
    gap: 12,
  },
  perfCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  perfHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perfTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  perfIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  perfName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
  },
  perfMeta: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  perfLucro: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16A34A",
    textAlign: "right",
  },
  perfMargin: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "right",
    marginTop: 2,
  },
});
