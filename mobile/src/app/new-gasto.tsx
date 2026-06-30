import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Header from "./components/Header";
import Button from "./components/Button";
import Input from "./components/Input";

export default function NovoGasto() {
  const [categoria, setCategoria] = useState("Insumos");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  async function salvar() {
    if (!descricao || !valor) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.117:8000/custos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoria,
          descricao,
          valor: Number(valor),
          data,
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Gasto cadastrado.");
        router.back();
      } else {
        Alert.alert("Erro", "Não foi possível cadastrar.");
      }
    } catch {
      Alert.alert("Erro", "Falha de conexão.");
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title="Novo Gasto"
        icon={
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color="#565D6D" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.label}>Categoria</Text>

        <View style={styles.pills}>
          {["Insumos", "Combustível", "Manutenção"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.pill,
                categoria === item && styles.pillSelected,
              ]}
              onPress={() => setCategoria(item)}
            >
              <Text
                style={[
                  styles.pillText,
                  categoria === item && styles.pillTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Descrição"
          placeholder="Descrição do gasto"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Input
          label="Valor (R$)"
          placeholder="0.00"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        <Input
          label="Data"
          placeholder="AAAA-MM-DD"
          value={data}
          onChangeText={setData}
        />

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
            onPress={salvar}
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
    gap: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  pills: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  pill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  pillSelected: {
    backgroundColor: "#22C358",
    borderColor: "#22C358",
  },

  pillText: {
    color: "#374151",
    fontWeight: "600",
  },

  pillTextSelected: {
    color: "#FFF",
  },

  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
  },
});
