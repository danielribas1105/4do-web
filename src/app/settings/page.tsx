import { Button } from "@/components/ui/button"
import { Task } from "@/types/other-types"

interface SettingsPageProps {
   tasks: Task[]
   onClearCompleted: () => void
}

export default function SettingsPage({ tasks, onClearCompleted }: SettingsPageProps) {
   const completed = tasks.filter((t) => t.completed).length

   return (
      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-4">
         <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
               <h3 className="text-sm font-bold text-zinc-800">Tarefas</h3>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
               <div>
                  <p className="text-sm font-medium text-zinc-700">Limpar concluídas</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                     {completed} tarefa{completed !== 1 ? "s" : ""} concluída
                     {completed !== 1 ? "s" : ""}
                  </p>
               </div>
               <Button
                  variant="destructive"
                  size="sm"
                  onClick={onClearCompleted}
                  disabled={completed === 0}
               >
                  Limpar
               </Button>
            </div>
         </div>

         <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
               <h3 className="text-sm font-bold text-zinc-800">Backup</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-zinc-700">Exportar dados</p>
                     <p className="text-xs text-zinc-400 mt-0.5">
                        Baixar JSON com todas as tarefas
                     </p>
                  </div>
                  <Button variant="outline" size="sm">
                     Exportar
                  </Button>
               </div>
               <div className="h-px bg-zinc-100" />
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-zinc-700">Importar backup</p>
                     <p className="text-xs text-zinc-400 mt-0.5">Restaurar de arquivo JSON</p>
                  </div>
                  <Button variant="outline" size="sm">
                     Importar
                  </Button>
               </div>
            </div>
         </div>
      </div>
   )
}
