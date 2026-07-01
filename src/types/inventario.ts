export interface Insumo {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
}

export interface Maquina {
  id: number;
  nome: string;
  tipo: string;
  marca: string;
  ano: number;
}

export const CATEGORIAS_INSUMO = ["Sementes", "Fertilizantes", "Defensivos"];
export const UNIDADES_INSUMO = ["kg", "L", "toneladas", "sacas"];
export const TIPOS_MAQUINA = ["Trator", "Colheitadeira", "Pulverizador", "Implemento"];

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function isEstoqueCritico(quantidade: number, unidade: string): boolean {
  if (unidade === "L") return quantidade < 50;
  if (unidade === "sacas") return quantidade < 20;
  return quantidade < 100;
}

export const INSUMOS_FALLBACK: Insumo[] = [
  { id: 1, nome: "Semente de Soja Brasmax", categoria: "Sementes", quantidade: 150, unidade: "sacas", preco_unitario: 280 },
  { id: 2, nome: "Adubo NPK 02-20-20", categoria: "Fertilizantes", quantidade: 5000, unidade: "kg", preco_unitario: 3.5 },
  { id: 3, nome: "Glifosato 480", categoria: "Defensivos", quantidade: 200, unidade: "L", preco_unitario: 45 },
];

export const MAQUINAS_FALLBACK: Maquina[] = [
  { id: 1, nome: "Trator Série 8R", tipo: "Trator", marca: "John Deere", ano: 2022 },
  { id: 2, nome: "Colheitadeira Axial-Flow", tipo: "Colheitadeira", marca: "Case IH", ano: 2021 },
];
