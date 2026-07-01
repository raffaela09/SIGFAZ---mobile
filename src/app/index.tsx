import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Input from "./components/Input";
import Button from "./components/Button";
import { API_BASE } from "../constants/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      if (!email.trim() || !email.includes('@')) {
        Alert.alert("Erro", "Por favor, digite um e-mail válido.");
        return;
      }
      if (senha !== "123456") {
        Alert.alert("Acesso Negado", "A senha está incorreta. (Dica: tente 123456)");
        return;
      }

      const payload = { email, senha };
      const API_URL = `${API_BASE}/auth/login`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
      }
    } catch {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.watermarkContainer}>
            <MaterialCommunityIcons name="tractor" size={400} color="rgba(22, 163, 74, 0.03)" />
          </View>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoInnerSquare}>
                <MaterialCommunityIcons name="sprout" size={40} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Gestão inteligente para sua fazenda</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Usuário ou e-mail"
              placeholder="exemplo@sigfaz.com"
              leftIcon="user"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              leftIcon="lock"
              isPassword
              rightLabel="Esqueci a senha"
              onRightLabelPress={() => console.log("Esqueci a senha")}
              value={senha}
              onChangeText={setSenha}
            />

            <Button
              title="Entrar"
              variant="primary"
              rightIcon="chevron-right"
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem uma conta?</Text>
            <Button
              title="Criar conta agora"
              variant="outline"
              onPress={() => console.log("Criar conta")}
              style={styles.createAccountButton}
            />
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>VERSÃO 2.4.0 • SIGFAZ SYSTEM</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  watermarkContainer: {
    position: "absolute",
    top: 100,
    left: -150,
    zIndex: -1,
    opacity: 0.8,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoInnerSquare: {
    width: 64,
    height: 64,
    backgroundColor: "#34D399",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#A7F3D0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    marginBottom: 48,
  },
  loginButton: {
    marginTop: 16,
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 48,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  createAccountButton: {
    borderColor: "#A7F3D0",
    borderWidth: 1,
  },
  versionContainer: {
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    letterSpacing: 1,
  },
});
