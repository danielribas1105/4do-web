import { QuadrantConfig } from "@/types/quadrants-config"

export const QUADRANTS: QuadrantConfig[] = [
   {
      id: "Q1",
      label: "Fazer Agora",
      subtitle: "Urgente + Importante",
      icon: "🔥",
      accent: "#EF4444",
      bg: "#FEF2F2",
      border: "#FECACA",
      tag: "Q1",
   },
   {
      id: "Q2",
      label: "Agendar",
      subtitle: "Não Urgente + Importante",
      icon: "🎯",
      accent: "#3B82F6",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      tag: "Q2",
   },
   {
      id: "Q3",
      label: "Delegar",
      subtitle: "Urgente + Não Importante",
      icon: "⚡",
      accent: "#F59E0B",
      bg: "#FFFBEB",
      border: "#FDE68A",
      tag: "Q3",
   },
   {
      id: "Q4",
      label: "Eliminar",
      subtitle: "Não Urgente + Não Importante",
      icon: "🗑",
      accent: "#6B7280",
      bg: "#F9FAFB",
      border: "#E5E7EB",
      tag: "Q4",
   },
]
