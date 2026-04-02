import { Task } from "@/types/other-types"

export const INITIAL_TASKS: Task[] = [
   {
      id: "1",
      title: "Revisar relatório trimestral",
      notes: "Deadline amanhã cedo",
      quadrant: "Q1",
      completed: false,
      createdAt: Date.now(),
   },
   {
      id: "2",
      title: "Planejar estratégia Q3",
      notes: "Reunião com o time na próxima semana",
      quadrant: "Q2",
      completed: false,
      createdAt: Date.now(),
   },
   {
      id: "3",
      title: "Responder emails pendentes",
      notes: "",
      quadrant: "Q3",
      completed: true,
      createdAt: Date.now(),
   },
   {
      id: "4",
      title: "Reorganizar desktop",
      notes: "",
      quadrant: "Q4",
      completed: false,
      createdAt: Date.now(),
   },
   {
      id: "5",
      title: "Corrigir bug crítico em produção",
      notes: "Afeta pagamentos",
      quadrant: "Q1",
      completed: false,
      createdAt: Date.now(),
   },
   {
      id: "6",
      title: "Estudar TypeScript avançado",
      notes: "Livro na fila de leitura",
      quadrant: "Q2",
      completed: false,
      createdAt: Date.now(),
   },
]
