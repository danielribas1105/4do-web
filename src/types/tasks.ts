import { Quadrant } from "./quadrants-config"

// ── Matches TaskResponse from backend ──────────────────────────────────────
export interface Task {
   id: string // UUID as string
   title: string
   notes: string | null
   quadrant: Quadrant
   completed: boolean
   createdAt: string // ISO datetime from backend
   closedAt: string | null
   user_id: string // UUID as string
}

// ── Matches TaskCreate ──────────────────────────────────────────────────────
export interface TaskCreate {
   title: string
   notes?: string | null
   quadrant: Quadrant
   completed?: boolean
}

// ── Matches TaskUpdate (all optional) ──────────────────────────────────────
export interface TaskUpdate {
   title?: string
   notes?: string | null
   quadrant?: Quadrant
   completed?: boolean
   closedAt?: string | null
}

export type FilterType = "all" | "active" | "completed"
