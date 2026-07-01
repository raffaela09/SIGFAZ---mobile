import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { API_BASE } from '../../constants/api';

export default function Tab() {
  const [dashboardData, setDashboardData] = useState({
    areaTotal: 0,
    producaoEst: 0,
    graficoProdutividade: [30, 25, 40, 35, 50, 60],
    graficoCustos: [
      { nome: "Sementes", valor: 40 },
      { nome: "Fertil.", valor: 80 },
      { nome: "Mão Obra", valor: 50 },
      { nome: "Combust.", valor: 30 }
    ]
  });

  useFocusEffect(
    useCallback(() => {
      fetch(`${API_BASE}/dashboard/`)
        .then(res => res.json())
        .then(data => setDashboardData(data))
        .catch(err => console.log('Erro ao buscar dashboard:', err));
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBox}>
            <FontAwesome5 name="seedling" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Olá, Fazendeiro!</Text>
          <Text style={styles.greetingSubtitle}>Aqui está o resumo da Fazenda Progresso.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INDICADORES CHAVE</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver Todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.kpiContainer}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiCardHeader}>
                <View style={styles.kpiIconContainer}>
                  <FontAwesome5 name="map" size={16} color="#22C358FF" />
                </View>
                <View style={styles.kpiTag}>
                  <Text style={styles.kpiTagText}>+2%</Text>
                </View>
              </View>
              <Text style={styles.kpiLabel}>Área Total</Text>
              <Text style={styles.kpiValue}>{dashboardData.areaTotal} ha</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiCardHeader}>
                <View style={styles.kpiIconContainer}>
                  <FontAwesome5 name="seedling" size={16} color="#22C358FF" />
                </View>
                <View style={styles.kpiTag}>
                  <Text style={styles.kpiTagText}>+5%</Text>
                </View>
              </View>
              <Text style={styles.kpiLabel}>Produção Est.</Text>
              <Text style={styles.kpiValue}>{dashboardData.producaoEst} t</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACESSO RÁPIDO</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/talhoes')}>
              <View style={styles.quickAccessIcon}>
                <FontAwesome5 name="truck" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.quickAccessText}>Talhões</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/maquinas')}>
              <View style={styles.quickAccessIcon}>
                <FontAwesome5 name="box" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.quickAccessText}>Máquinas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/insumos')}>
              <View style={styles.quickAccessIcon}>
                <FontAwesome5 name="seedling" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.quickAccessText}>Insumos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/new')}>
              <View style={styles.quickAccessIcon}>
                <FontAwesome5 name="plus" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.quickAccessText}>Novo Talhão</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ANÁLISE DE DESEMPENHO</Text>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Produtividade</Text>
                <Text style={styles.chartSubtitle}>Evolução mensal (ton)</Text>
              </View>
              <Text style={styles.chartValuePos}>+15%</Text>
            </View>
            <View style={styles.chartMock}>
              <View style={styles.lineChartMock}>
                {dashboardData.graficoProdutividade.map((val: number, idx: number) => (
                  <View key={idx} style={[styles.barMock, { height: val, backgroundColor: '#4ade80' }]} />
                ))}
              </View>
              <View style={styles.chartXAxis}>
                <Text style={styles.chartXAxisText}>Fev</Text>
                <Text style={styles.chartXAxisText}>Mar</Text>
                <Text style={styles.chartXAxisText}>Abr</Text>
                <Text style={styles.chartXAxisText}>Mai</Text>
                <Text style={styles.chartXAxisText}>Jun</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Distribuição de Custos</Text>
                <Text style={styles.chartSubtitle}>Por categoria (R$ mil)</Text>
              </View>
            </View>
            <View style={styles.chartMock}>
              <View style={styles.barChartMock}>
                {dashboardData.graficoCustos.map((item, idx: number) => (
                  <View key={idx} style={styles.barColumn}>
                    <View style={[styles.bar, { height: item.valor }]} />
                    <Text style={styles.chartXAxisText}>{item.nome}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ALERTAS RECENTES</Text>
            <View style={styles.badgeDanger}>
              <Text style={styles.badgeDangerText}>2 Críticos</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.alertCard} onPress={() => router.push('/insumos')}>
            <View style={styles.alertIconBox}>
              <Feather name="alert-triangle" size={16} color="#1F2937" />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>Estoque Baixo: Fertilizante NPK</Text>
                <Text style={styles.alertTime}>Hoje,{'\n'}09:45</Text>
              </View>
              <Text style={styles.alertText}>Verifique o status no módulo de inventário.</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.alertCard} onPress={() => router.push('/maquinas')}>
            <View style={styles.alertIconBox}>
              <Feather name="alert-triangle" size={16} color="#1F2937" />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>Manutenção Pendente: Trator</Text>
                <Text style={styles.alertTime}>Ontem,{'\n'}17:20</Text>
              </View>
              <Text style={styles.alertText}>Verifique o status no módulo de inventário.</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBox: {
    backgroundColor: '#22C358FF',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#22C358FF',
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 160,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kpiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kpiTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#22C358FF',
  },
  kpiLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C358FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chartValuePos: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  chartMock: {
    alignItems: 'center',
  },
  lineChartMock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  barMock: {
    width: 30,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.6,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  barChartMock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: 120,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: 36,
    backgroundColor: '#4ade80',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 12,
  },
  chartXAxisText: {
    fontSize: 10,
    color: '#6B7280',
  },
  badgeDanger: {
    backgroundColor: '#F87171',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDangerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIconBox: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
    marginRight: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  alertTime: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  alertText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
