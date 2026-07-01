import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

import Header from "./components/Header";
import Button from "./components/Button";
import Input from "./components/Input";

export default function NovaCultura() {
  const params = useLocalSearchParams();
  const [nome, setNome] = useState("");
  const [safra, setSafra] = useState("");
  const [status, setStatus] = useState("Plantio");
  const [dataPlantio, setDataPlantio] = useState("");
  const [area, setArea] = useState(""); // Campo crucial adicionado
  const [culturaId, setCulturaId] = useState<number | null>(null);

  useEffect(() => {
    if (!params.culturaData) return;

    try {
      const item = JSON.parse(params.culturaData as string);

      setCulturaId(item[0]);
      setNome(item[1] ?? "");
      setSafra(item[2] ?? "");
      setArea(item[3]?.toString() ?? "");
      setStatus(item[4] ?? "Plantio");
      setDataPlantio(item[5] ?? "");
    } catch (error) {
      console.error(error);
    }
  }, [params.culturaData]);

  const handleSave = async () => {
    if (!nome || !safra || !area) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios (Nome, Safra e Área).");
      return;
    }

    // Montando o payload estruturado
    const payload = {
      nome: nome,
      safra: safra,
      area: parseFloat(area) || 0,
      status: status,
      data_plantio: dataPlantio
    };

    try {
      // Alterado para usar POST ou PUT conforme presença de id
      let url = "http://localhost:8000/culturas/";
      let method = "POST";
      if (culturaId) {
        url = `http://localhost:8000/culturas/${culturaId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Sucesso", culturaId ? "Cultura atualizada com sucesso!" : "Cultura cadastrada com sucesso!");
        router.back();
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert("Erro", errorData.detail || "Não foi possível salvar no servidor.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Nova Cultura"
        icon={<Feather name="save" size={24} color="#22C358" />}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Input
          label="Nome da Cultura *"
          placeholder="Ex: Soja"
          value={nome}
          onChangeText={setNome}
          labelIcon={<FontAwesome5 name="seedling" size={14} color="#22C358" />}
        />

        <Input
          label="Área (Hectares) *"
          placeholder="Ex: 50"
          keyboardType="numeric"
          value={area}
          onChangeText={setArea}
          labelIcon={<FontAwesome5 name="globe-americas" size={14} color="#22C358" />}
        />

        <Input
          label="Safra *"
          placeholder="Ex: Safra 24/25"
          value={safra}
          onChangeText={setSafra}
          labelIcon={<FontAwesome5 name="calendar-alt" size={14} color="#22C358" />}
        />

        <Input
          label="Status"
          placeholder="Plantio, Crescimento, Colheita"
          value={status}
          onChangeText={setStatus}
          labelIcon={<FontAwesome5 name="leaf" size={14} color="#22C358" />}
        />

        <Input
          label="Data de Plantio"
          placeholder="AAAA-MM-DD (Ex: 2026-10-15)"
          value={dataPlantio}
          onChangeText={setDataPlantio}
          labelIcon={<FontAwesome5 name="calendar" size={14} color="#22C358" />}
        />

        <View style={styles.buttons}>
          <Button
            title="Cancelar"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.back()}
          />

          <Button
            title="Salvar Cultura"
            variant="primary"
            style={{ flex: 1 }}
            onPress={handleSave}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    padding: 20,
    gap: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
});
