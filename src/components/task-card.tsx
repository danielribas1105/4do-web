import { Task } from "@/types/other-types"
import { QuadrantConfig } from "@/types/quadrants-config"

interface TaskCardProps {
   task: Task
   quadrant: QuadrantConfig
   onToggle: (id: string) => void
   onEdit: (task: Task) => void
   onDelete: (id: string) => void
}

export default function TaskCard({ task, quadrant, onToggle, onEdit, onDelete }: TaskCardProps) {
   return (
      <div
         className={`group relative rounded-xl border p-3.5 transition-all duration-200 cursor-pointer
            hover:shadow-sm ${task.completed ? "opacity-60" : "hover:-translate-y-0.5"}`}
         style={{
            background: task.completed ? "#FAFAFA" : "white",
            borderColor: task.completed ? "#E5E7EB" : quadrant.border,
         }}
         onClick={() => onEdit(task)}
      >
         <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
               onClick={(e) => {
                  e.stopPropagation()
                  onToggle(task.id)
               }}
               className="mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all"
               style={{
                  borderColor: task.completed ? "#9CA3AF" : quadrant.accent,
                  background: task.completed ? "#9CA3AF" : "transparent",
               }}
            >
               {task.completed && <span className="text-white text-[9px] font-black">✓</span>}
            </button>

            <div className="flex-1 min-w-0">
               <p
                  className={`text-sm font-medium leading-snug ${
                     task.completed ? "line-through text-zinc-400" : "text-zinc-800"
                  }`}
               >
                  {task.title}
               </p>
               {task.notes && <p className="text-xs text-zinc-400 mt-1 truncate">{task.notes}</p>}
            </div>

            {/* Delete btn */}
            <button
               onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
               }}
               className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300 hover:text-red-400 shrink-0 p-0.5 rounded"
            >
               <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
               >
                  <path d="M18 6L6 18M6 6l12 12" />
               </svg>
            </button>
         </div>
      </div>
   )
}
