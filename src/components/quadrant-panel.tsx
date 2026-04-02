import { Task } from "@/types/other-types"
import { Quadrant, QuadrantConfig } from "@/types/quadrants-config"
import TaskCard from "./task-card"

interface QuadrantPanelProps {
   quadrant: QuadrantConfig
   tasks: Task[]
   onAddTask: (quadrantId: Quadrant) => void
   onToggle: (id: string) => void
   onEdit: (task: Task) => void
   onDelete: (id: string) => void
}

export default function QuadrantPanel({
   quadrant,
   tasks,
   onAddTask,
   onToggle,
   onEdit,
   onDelete,
}: QuadrantPanelProps) {
   const activeTasks = tasks.filter((t) => !t.completed)

   return (
      <div
         className="flex flex-col rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md"
         style={{ borderColor: quadrant.border, background: quadrant.bg }}
      >
         {/* Header */}
         <div
            className="px-4 pt-4 pb-3 flex items-center justify-between"
            style={{ borderBottom: `1.5px solid ${quadrant.border}` }}
         >
            <div className="flex items-center gap-2.5">
               <span className="text-xl leading-none">{quadrant.icon}</span>
               <div>
                  <div className="flex items-center gap-2">
                     <span
                        className="text-xs font-black tracking-widest uppercase"
                        style={{ color: quadrant.accent }}
                     >
                        {quadrant.tag}
                     </span>
                     <h3 className="text-sm font-bold text-zinc-800">{quadrant.label}</h3>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                     {quadrant.subtitle}
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               {activeTasks.length > 0 && (
                  <span
                     className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                     style={{ background: quadrant.accent, color: "white" }}
                  >
                     {activeTasks.length}
                  </span>
               )}
               <button
                  onClick={() => onAddTask(quadrant.id as Quadrant)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ background: quadrant.accent, color: "white" }}
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
               </button>
            </div>
         </div>

         {/* Tasks */}
         <div className="p-3 flex flex-col gap-2 min-h-20">
            {tasks.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-5 text-center">
                  <p className="text-xs text-zinc-400 font-medium">Nenhuma tarefa aqui</p>
                  <button
                     onClick={() => onAddTask(quadrant.id as Quadrant)}
                     className="mt-2 text-xs font-semibold transition-colors"
                     style={{ color: quadrant.accent }}
                  >
                     + Adicionar
                  </button>
               </div>
            ) : (
               tasks.map((task) => (
                  <TaskCard
                     key={task.id}
                     task={task}
                     quadrant={quadrant}
                     onToggle={onToggle}
                     onEdit={onEdit}
                     onDelete={onDelete}
                  />
               ))
            )}
         </div>
      </div>
   )
}
