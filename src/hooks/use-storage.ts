import { useCallback, useEffect, useState } from "react"
import { BackupMetadata, Task } from "@/types/other-types"

const STORAGE_KEY = "4do:tasks"
const BACKUP_METADATA_KEY = "4do:last-backup"
const BACKUP_INTERVAL_DAYS = 7
const APP_VERSION = "1.0.0"

function loadFromStorage<T>(key: string): T | null {
   try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
   } catch {
      return null
   }
}

function saveToStorage<T>(key: string, value: T): void {
   try {
      localStorage.setItem(key, JSON.stringify(value))
   } catch (e) {
      console.error("Error writing to localStorage:", e)
   }
}

function daysSince(isoString: string): number {
   const then = new Date(isoString).getTime()
   const now = Date.now()
   return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

export function useStorage() {
   const [tasks, setTasks] = useState<Task[]>([])
   const [loading, setLoading] = useState(true)
   const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)
   const [backupSuggestion, setBackupSuggestion] = useState(false)

   // Load on mount
   useEffect(() => {
      const storedTasks = loadFromStorage<Task[]>(STORAGE_KEY)
      if (storedTasks) setTasks(storedTasks)

      const lastBackup = loadFromStorage<string>(BACKUP_METADATA_KEY)
      if (lastBackup) {
         setLastBackupDate(lastBackup)
         if (daysSince(lastBackup) >= BACKUP_INTERVAL_DAYS) {
            setBackupSuggestion(true)
         }
      }

      setLoading(false)
   }, [])

   const saveTasks = useCallback((updated: Task[]) => {
      saveToStorage(STORAGE_KEY, updated)
      setTasks(updated)
   }, [])

   const addTask = useCallback(
      (task: Task) => {
         saveTasks([task, ...tasks])
      },
      [tasks, saveTasks],
   )

   const updateTask = useCallback(
      (updated: Task) => {
         saveTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
      },
      [tasks, saveTasks],
   )

   const deleteTask = useCallback(
      (id: string) => {
         saveTasks(tasks.filter((t) => t.id !== id))
      },
      [tasks, saveTasks],
   )

   const toggleComplete = useCallback(
      (id: string) => {
         saveTasks(
            tasks.map((t) =>
               t.id !== id
                  ? t
                  : {
                       ...t,
                       completed: !t.completed,
                       completedAt: !t.completed ? Date.now() : undefined,
                    },
            ),
         )
      },
      [tasks, saveTasks],
   )

   // Export: triggers a .json file download in the browser
   const exportBackup = useCallback(() => {
      try {
         const backup: BackupMetadata = {
            version: APP_VERSION,
            createdAt: new Date().toISOString(),
            taskCount: tasks.length,
            tasks,
         }
         const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
         const url = URL.createObjectURL(blob)
         const a = document.createElement("a")
         a.href = url
         a.download = `4do-backup-${new Date().toISOString().split("T")[0]}.json`
         a.click()
         URL.revokeObjectURL(url)

         const now = new Date().toISOString()
         saveToStorage(BACKUP_METADATA_KEY, now)
         setLastBackupDate(now)
         setBackupSuggestion(false)
         return true
      } catch (e) {
         console.error("Error exporting backup:", e)
         return false
      }
   }, [tasks])

   // Import: opens a file picker and reads the JSON
   const importBackup = useCallback((): Promise<boolean> => {
      return new Promise((resolve) => {
         const input = document.createElement("input")
         input.type = "file"
         input.accept = "application/json"
         input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return resolve(false)
            try {
               const text = await file.text()
               const backup: BackupMetadata = JSON.parse(text)
               if (!backup.tasks || !Array.isArray(backup.tasks)) {
                  throw new Error("Arquivo de backup inválido")
               }
               saveTasks(backup.tasks)
               resolve(true)
            } catch (e) {
               console.error("Error importing backup:", e)
               resolve(false)
            }
         }
         // Resolve false if user cancels without picking
         input.oncancel = () => resolve(false)
         input.click()
      })
   }, [saveTasks])

   const dismissBackupSuggestion = useCallback(() => {
      setBackupSuggestion(false)
   }, [])

   return {
      tasks,
      loading,
      lastBackupDate,
      backupSuggestion,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      exportBackup,
      importBackup,
      dismissBackupSuggestion,
   }
}
