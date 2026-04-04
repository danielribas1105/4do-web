"use client"

import QuadrantPanel from "@/components/quadrant-panel"
import TaskModal from "@/components/task-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QUADRANTS } from "@/constants/quadrants"
import { useAuth } from "@/hooks/use-auth"
import { useTasks } from "@/hooks/use-tasks"
import { useState } from "react"
import { FilterType, Task, TaskCreate, TaskUpdate } from "@/types/tasks"
import { Quadrant } from "@/types/quadrants-config"
import LoginPage from "@/app/(public)/login/page"
import SettingsPage from "../settings/page"
import AboutPage from "../about/page"
type Tab = "matrix" | "settings" | "about"

export default function MainPage() {
   const { user, loading: authLoading, logout } = useAuth()
   const {
      tasks,
      loading: tasksLoading,
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
   } = useTasks(user)

   const [activeTab, setActiveTab] = useState<Tab>("matrix")
   const [filter, setFilter] = useState<FilterType>("active")
   const [modalOpen, setModalOpen] = useState(false)
   const [editingTask, setEditingTask] = useState<Task | null>(null)
   const [defaultQ, setDefaultQ] = useState<Quadrant>("Q1")

   if (authLoading) {
      return (
         <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                  <span className="text-lg">✅</span>
               </div>
               <p className="text-sm text-zinc-400 font-medium">Carregando...</p>
            </div>
         </div>
      )
   }

   if (!user) return <LoginPage />

   const openNew = (quadrant: Quadrant) => {
      setEditingTask(null)
      setDefaultQ(quadrant)
      setModalOpen(true)
   }

   const openEdit = (task: Task) => {
      setEditingTask(task)
      setDefaultQ(task.quadrant)
      setModalOpen(true)
   }

   // TaskModal calls onSave with a Task shape — we map to TaskCreate/TaskUpdate
   const handleSave = async (task: Task) => {
      if (editingTask) {
         const update: TaskUpdate = {
            title: task.title,
            notes: task.notes,
            quadrant: task.quadrant,
            completed: task.completed,
         }
         await updateTask(editingTask.id, update)
      } else {
         const create: TaskCreate = {
            title: task.title,
            notes: task.notes,
            quadrant: task.quadrant,
            completed: task.completed,
         }
         await addTask(create)
      }
   }

   const activeCount = tasks.filter((t) => !t.completed).length
   const completedCount = tasks.filter((t) => t.completed).length

   const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
      {
         id: "matrix",
         label: "Matriz",
         icon: (
            <svg
               width="14"
               height="14"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
            >
               <rect x="3" y="3" width="7" height="7" rx="1" />
               <rect x="14" y="3" width="7" height="7" rx="1" />
               <rect x="3" y="14" width="7" height="7" rx="1" />
               <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
         ),
      },
      {
         id: "settings",
         label: "Config",
         icon: (
            <svg
               width="14"
               height="14"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
            >
               <circle cx="12" cy="12" r="3" />
               <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
         ),
      },
      {
         id: "about",
         label: "Sobre",
         icon: (
            <svg
               width="14"
               height="14"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
            >
               <circle cx="12" cy="12" r="10" />
               <line x1="12" y1="8" x2="12" y2="12" />
               <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
         ),
      },
   ]

   return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
         <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,900&display=swap');
            * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
            ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
         `}</style>

         {/* HEADER */}
         <header className="bg-white border-b border-zinc-100 sticky top-0 z-40 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
               <div className="flex items-center gap-2.5 shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                     <span className="text-sm">✅</span>
                  </div>
                  <span className="text-base font-black text-zinc-900 tracking-tight">4Do</span>
               </div>

               <nav className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1 shrink-0">
                  {TABS.map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                           activeTab === tab.id
                              ? "bg-white text-zinc-900 shadow-sm"
                              : "text-zinc-500 hover:text-zinc-700"
                        }`}
                     >
                        {tab.icon}
                        {tab.label}
                     </button>
                  ))}
               </nav>

               <div className="flex-1" />

               <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="default">
                     {activeCount} ativa{activeCount !== 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="default">
                     {completedCount} concluída{completedCount !== 1 ? "s" : ""}
                  </Badge>
               </div>

               <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-400 truncate max-w-35">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                     Sair
                  </Button>
               </div>

               <Button
                  variant="default"
                  size="sm"
                  onClick={() => openNew("Q1")}
                  className="shrink-0"
               >
                  <svg
                     width="13"
                     height="13"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="3"
                  >
                     <path d="M12 5v14M5 12h14" />
                  </svg>
                  Nova Tarefa
               </Button>
            </div>
         </header>

         {/* MAIN */}
         <main className="flex-1 overflow-auto">
            {activeTab === "matrix" && (
               <div className="max-w-6xl mx-auto px-6 py-6">
                  {tasksLoading ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                           <div key={i} className="h-48 rounded-2xl bg-zinc-100 animate-pulse" />
                        ))}
                     </div>
                  ) : (
                     <>
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                                 Filtrar:
                              </span>
                              {(
                                 [
                                    { value: "all", label: "Todas" },
                                    { value: "active", label: "Ativas" },
                                    { value: "completed", label: "Concluídas" },
                                 ] as { value: FilterType; label: string }[]
                              ).map((f) => (
                                 <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                       filter === f.value
                                          ? "bg-zinc-900 text-white"
                                          : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                                    }`}
                                 >
                                    {f.label}
                                 </button>
                              ))}
                           </div>
                           <div className="hidden md:flex flex-col items-end gap-0.5">
                              <span className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase">
                                 ↑ IMPORTANTE ↓
                              </span>
                              <span className="text-[10px] text-zinc-300 font-bold tracking-widest uppercase">
                                 ← NÃO URGENTE · URGENTE →
                              </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {QUADRANTS.map((q) => (
                              <QuadrantPanel
                                 key={q.id}
                                 quadrant={q}
                                 tasks={getFiltered(q.id, filter)}
                                 onAddTask={openNew}
                                 onToggle={toggleComplete}
                                 onEdit={openEdit}
                                 onDelete={deleteTask}
                              />
                           ))}
                        </div>
                     </>
                  )}
               </div>
            )}

            {activeTab === "settings" && (
               <SettingsPage
                  tasks={tasks}
                  lastBackupDate={lastBackupDate}
                  backupSuggestion={backupSuggestion}
                  onClearCompleted={clearCompleted}
                  onExport={exportBackup}
                  onImport={importBackup}
                  onDismissBackup={dismissBackupSuggestion}
               />
            )}

            {activeTab === "about" && <AboutPage />}
         </main>

         <TaskModal
            key={modalOpen ? (editingTask?.id ?? "new") : "closed"}
            open={modalOpen}
            onClose={() => {
               setModalOpen(false)
               setEditingTask(null)
            }}
            editTask={editingTask}
            defaultQuadrant={defaultQ}
            onSave={handleSave}
         />
      </div>
   )
}
