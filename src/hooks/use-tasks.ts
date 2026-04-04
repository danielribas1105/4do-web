import { tasksApi } from "@/lib/api"
import { AuthUser } from "@/types/auth"
import { Quadrant } from "@/types/quadrants-config"
import { FilterType, Task, TaskCreate, TaskUpdate } from "@/types/tasks"
import { useCallback, useEffect, useState } from "react"

const BACKUP_KEY = "4do:last-backup"
const BACKUP_INTERVAL_DAYS = 7

function daysSince(iso: string) {
   return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export function useTasks(user: AuthUser | null) {
   const [tasks, setTasks] = useState<Task[]>([])
   const [loading, setLoading] = useState(false)
   const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)
   const [backupSuggestion, setBackupSuggestion] = useState(false)

   useEffect(() => {
      if (!user) {
         setTasks([])
         return
      }
      setLoading(true)
      tasksApi
         .list()
         .then(setTasks)
         .catch(console.error)
         .finally(() => setLoading(false))

      const last = localStorage.getItem(BACKUP_KEY)
      if (last) {
         setLastBackupDate(last)
         if (daysSince(last) >= BACKUP_INTERVAL_DAYS) setBackupSuggestion(true)
      }
   }, [user])

   const addTask = useCallback(async (data: TaskCreate) => {
      const created = await tasksApi.create(data)
      setTasks((prev) => [created, ...prev])
   }, [])

   const updateTask = useCallback(async (id: string, data: TaskUpdate) => {
      const updated = await tasksApi.update(id, data)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
   }, [])

   const deleteTask = useCallback(async (id: string) => {
      await tasksApi.delete(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
   }, [])

   const toggleComplete = useCallback(
      async (id: string) => {
         const task = tasks.find((t) => t.id === id)
         if (!task) return
         await updateTask(id, { completed: !task.completed })
      },
      [tasks, updateTask],
   )

   const clearCompleted = useCallback(async () => {
      const completed = tasks.filter((t) => t.completed)
      await Promise.all(completed.map((t) => tasksApi.delete(t.id)))
      setTasks((prev) => prev.filter((t) => !t.completed))
   }, [tasks])

   const getFiltered = useCallback(
      (quadrantId: Quadrant, filter: FilterType): Task[] =>
         tasks.filter((t) => {
            if (t.quadrant !== quadrantId) return false
            if (filter === "active") return !t.completed
            if (filter === "completed") return t.completed
            return true
         }),
      [tasks],
   )

   const exportBackup = useCallback(() => {
      const blob = new Blob(
         [
            JSON.stringify(
               { version: "1.0.0", createdAt: new Date().toISOString(), tasks },
               null,
               2,
            ),
         ],
         { type: "application/json" },
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `4do-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      const now = new Date().toISOString()
      localStorage.setItem(BACKUP_KEY, now)
      setLastBackupDate(now)
      setBackupSuggestion(false)
   }, [tasks])

   const importBackup = useCallback((): Promise<boolean> => {
      return new Promise((resolve) => {
         const input = document.createElement("input")
         input.type = "file"
         input.accept = "application/json"
         input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) return resolve(false)
            try {
               const { tasks: imported }: { tasks: Task[] } = JSON.parse(await file.text())
               const created = await Promise.all(
                  imported.map((t) =>
                     tasksApi.create({
                        title: t.title,
                        notes: t.notes,
                        quadrant: t.quadrant,
                        completed: t.completed,
                     }),
                  ),
               )
               setTasks(created)
               resolve(true)
            } catch (e) {
               console.error(e)
               resolve(false)
            }
         }
         input.oncancel = () => resolve(false)
         input.click()
      })
   }, [])

   const dismissBackupSuggestion = useCallback(() => setBackupSuggestion(false), [])

   return {
      tasks,
      loading,
      lastBackupDate,
      backupSuggestion,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      clearCompleted,
      getFiltered,
      exportBackup,
      importBackup,
      dismissBackupSuggestion,
   }
}
