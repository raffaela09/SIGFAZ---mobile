import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Header from "./components/Header";
import Input from "./components/Input";
import Button from "./components/Button";

export default function NewFazendaScreen() {
  const params = useLocalSearchParams();

  const editing = !!params.id;

  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [areaTotal, setAreaTotal] = useState("");
  const [status, setStatus] = useState("Ativa");

  useEffect(() => {
    if (editing) {
      setNome(String(params.nome || ""));
      setLocalizacao(String(params.localizacao || ""));
      setAreaTotal(String(params.areaTotal || ""));
      setStatus(String(params.status || "Ativa"));
    }
  }, []);

  async function handleSalvar() {
    if (!nome || !localizacao || !areaTotal) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const payload = {
      nome,
      localizacao,
      areaTotal: Number(areaTotal),
      area_total_hectares: Number(areaTotal),
      status,
    };

    try {
      const response = await fetch(
        editing
          ? `http://192.168.1.117:8000/fazendas/${params.id}`
          : "http://192.168.1.117:8000/fazendas/",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      Alert.alert(
        "Sucesso",
        editing
          ? "Fazenda atualizada!"
          : "Fazenda cadastrada!"
      );

      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a fazenda.");
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title={editing ? "Editar Fazenda" : "Nova Fazenda"}
        icon={
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color="#475569" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="Nome da Fazenda"
          placeholder="Ex.: Fazenda Boa Esperança"
          value={nome}
          onChangeText={setNome}
        />

        <Input
          label="Localização"
          placeholder="Cidade / Estado"
          value={localizacao}
          onChangeText={setLocalizacao}
        />

        <Input
          label="Área Total (ha)"
          placeholder="Ex.: 350"
          keyboardType="numeric"
          value={areaTotal}
          onChangeText={setAreaTotal}
        />

        <Text style={styles.label}>Status</Text>

        <View style={styles.statusContainer}>
          {["Ativa", "Inativa"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.statusButton,
                status === item && styles.statusSelected,
              ]}
              onPress={() => setStatus(item)}
            >
              <Text
                style={[
                  styles.statusText,
                  status === item && { color: "#FFF" },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttons}>
          <Button
            title="Cancelar"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.back()}
          />

          <Button
            title="Salvar"
            variant="primary"
            style={{ flex: 1 }}
            onPress={handleSalvar}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },

  statusContainer: {
    flexDirection: "row",
    gap: 12,
  },

  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  statusSelected: {
    backgroundColor: "#22C358",
    borderColor: "#22C358",
  },

  statusText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },

  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
});
