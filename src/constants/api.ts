import { Platform } from "react-native";

function resolveApiBase(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return Platform.OS === "web" ? "http://localhost:8000" : "http://192.168.1.117:8000";
}

export const API_BASE = resolveApiBase();
