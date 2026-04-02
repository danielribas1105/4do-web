import { Quadrant } from "./quadrants-config"

export interface Task {
   id: string
   title: string
   notes?: string
   quadrant: Quadrant
   completed: boolean
   createdAt: number
   completedAt?: number
   dueDate?: string
   tags?: string[]
}

export interface BackupMetadata {
   version: string
   createdAt: string
   taskCount: number
   tasks: Task[]
}

export type FilterType = "all" | "active" | "completed"
export type ViewMode = "matrix" | "list"
