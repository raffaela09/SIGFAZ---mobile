import React, { useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Button from "../components/Button";
import Header from "../components/Header";
import Input from "../components/Input";
import { API_BASE } from "../../constants/api";

export default function Tab() {
  const params = useLocalSearchParams();
  const [talhaoId, setTalhaoId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [area, setArea] = useState("");
  const [cultura, setCultura] = useState("");
  const [dataPlantio, setDataPlantio] = useState("");
  const [maquinario, setMaquinario] = useState("");
  const [operador, setOperador] = useState("");

  const [insumos, setInsumos] = useState(["Fertilizante NPK", "Semente Soja RR"]);
  const [novoInsumo, setNovoInsumo] = useState("");
  const [mostraInputInsumo, setMostraInputInsumo] = useState(false);

  useEffect(() => {
    if (params.talhaoData) {
      try {
        const item = JSON.parse(params.talhaoData as string);
        setTalhaoId(item[0]);
        setArea(item[1]?.toString() || "");
        setCultura(item[2] || "");
        setNome(item[2] || `Talhão #${item[0]}`); 
        setMaquinario(item[6] || "");
        setOperador(item[7] || "");
      } catch (e) {
        console.error("Erro ao carregar dados do talhão", e);
      }
    }
  }, [params.talhaoData]);

  const adicionarInsumo = () => {
    if (novoInsumo.trim() !== "") {
      setInsumos([...insumos, novoInsumo.trim()]);
      setNovoInsumo("");
      setMostraInputInsumo(false);
    }
  };

  const removerInsumo = (indexToRemove: number) => {
    setInsumos(insumos.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    try {
      const payload = {
        area: parseFloat(area) || 0,
        tipoCultura: cultura || nome,
        idade: 0,
        volumeEstimado: 0,
        idFazenda: 1,
        maquinario: maquinario,
        operador: operador,
      };

      let API_URL = `${API_BASE}/talhoes/`;
      let method = "POST";
      
      if (talhaoId) {
        API_URL = `${API_BASE}/talhoes/${talhaoId}`;
        method = "PUT";
      }
      
      const response = await fetch(API_URL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Sucesso", talhaoId ? "Talhão atualizado com sucesso!" : "Talhão cadastrado com sucesso!");
        setNome("");
        setArea("");
        setCultura("");
        setDataPlantio("");
        setMaquinario("");
        setOperador("");
        router.push("/talhoes");
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert("Erro", "Falha ao salvar: " + JSON.stringify(errorData));
      }
    } catch (error: any) {
      Alert.alert("Erro de conexão", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={talhaoId ? "Editar Talhão" : "Novo Talhão"}
        icon={<Feather name="save" size={24} color="#22C358FF" />}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IDENTIFICAÇÃO DO TALHÃO</Text>
          <Input
            label="Nome do Talhão *"
            placeholder="Ex: Talhão Norte 01"
            labelIcon={<FontAwesome5 name="file-alt" size={14} color="#22C358FF" />}
            value={nome}
            onChangeText={setNome}
          />
          <View style={styles.inputWithSuffix}>
            <View style={{ flex: 1 }}>
              <Input
                label="Área Total *"
                placeholder="0.00"
                keyboardType="numeric"
                labelIcon={<FontAwesome5 name="ruler" size={14} color="#22C358FF" />}
                value={area}
                onChangeText={setArea}
              />
            </View>
            <Text style={styles.suffixText}>ha</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PLANEJAMENTO DE SAFRA</Text>

          <Input
            label="Cultura Plantada *"
            placeholder="Ex: Soja Safra 24/25"
            labelIcon={<FontAwesome5 name="seedling" size={14} color="#22C358FF" />}
            value={cultura}
            onChangeText={setCultura}
          />

          <Input
            label="Data de Plantio"
            placeholder="2024-10-15"
            labelIcon={<FontAwesome5 name="calendar-alt" size={14} color="#22C358FF" />}
            value={dataPlantio}
            onChangeText={setDataPlantio}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INSUMOS E RECURSOS</Text>

          <View style={styles.insumosContainer}>
            <View style={styles.labelContainer}>
              <FontAwesome5 name="tag" size={14} color="#22C358FF" />
              <Text style={styles.labelText}>Insumos Utilizados</Text>
            </View>

            <View style={styles.chipsBox}>
              <View style={styles.chipsRow}>
                {insumos.map((insumo, index) => (
                  <Chip key={index} text={insumo} onRemove={() => removerInsumo(index)} />
                ))}
                
                {!mostraInputInsumo ? (
                  <TouchableOpacity style={styles.addChip} onPress={() => setMostraInputInsumo(true)}>
                    <Text style={styles.addChipText}>+ Adicionar</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4, width: '100%'}}>
                    <TextInput 
                      style={{flex: 1, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: 'white'}}
                      placeholder="Novo insumo..."
                      value={novoInsumo}
                      onChangeText={setNovoInsumo}
                      autoFocus
                      onSubmitEditing={adicionarInsumo}
                    />
                    <TouchableOpacity onPress={adicionarInsumo} style={{marginLeft: 8, backgroundColor: '#22C358FF', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                      <Feather name="check" size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setMostraInputInsumo(false); setNovoInsumo(""); }} style={{marginLeft: 8, backgroundColor: '#EF4444', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
                      <Feather name="x" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={styles.helperText}>Selecione todos os defensivos e fertilizantes aplicados.</Text>
            </View>
          </View>

          <Input
            label="Maquinário"
            placeholder="Ex: Trator John Deere 7J"
            labelIcon={<FontAwesome5 name="tractor" size={14} color="#22C358FF" />}
            value={maquinario}
            onChangeText={setMaquinario}
          />
          <Input
            label="Operador Responsável"
            placeholder="Ex: João da Silva"
            labelIcon={<FontAwesome5 name="user" size={14} color="#22C358FF" />}
            value={operador}
            onChangeText={setOperador}
          />
        </View>

        <View style={styles.tipBox}>
          <Feather name="check" size={20} color="#334155" style={{ marginTop: 2 }} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.tipTitle}>Dica de Registro</Text>
            <Text style={styles.tipText}>
              Certifique-se de que a área informada corresponde ao mapeamento GPS do SIGFaz.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            style={styles.cancelBtn}
            onPress={() => {
              setNome("");
              setArea("");
              setCultura("");
              setDataPlantio("");
              setMaquinario("");
              setOperador("");
              router.back();
            }}
          />
          <Button
            title={talhaoId ? "Salvar Alterações" : "Salvar Talhão"}
            variant="primary"
            style={styles.saveBtn}
            onPress={handleSave}
          />
        </View>

      </ScrollView>
    </View>
  );
}

function Chip({ text, onRemove }: { text: string; onRemove?: () => void }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{text}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove}>
          <Feather name="x" size={14} color="#22C358FF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6B7280",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWithSuffix: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  suffixText: {
    position: "absolute",
    right: 16,
    top: 42,
    color: "#6B7280",
    fontWeight: "500",
  },
  mockSelectContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  mockSelectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#FFFFFF",
  },
  mockSelectText: {
    fontSize: 16,
    color: "#1F2937",
  },
  insumosContainer: {
    marginBottom: 20,
  },
  chipsBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipText: {
    color: "#22C358FF",
    fontSize: 12,
    fontWeight: "600",
  },
  addChip: {
    borderWidth: 1,
    borderColor: "#22C358FF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addChipText: {
    color: "#22C358FF",
    fontSize: 12,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 10,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  tipBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  },
});
