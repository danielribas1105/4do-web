import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QUADRANTS } from "@/constants/quadrants"
import { Task } from "@/types/other-types"
import { Quadrant } from "@/types/quadrants-config"
import { useEffect, useState } from "react"

// Module-level counter so it never resets between renders
let nextId = 100

interface TaskModalProps {
   open: boolean
   editTask?: Task | null
   defaultQuadrant: Quadrant
   onSave: (task: Task) => void
   onClose: () => void
}

export default function TaskModal({
   open,
   editTask,
   defaultQuadrant,
   onSave,
   onClose,
}: TaskModalProps) {
   const [title, setTitle] = useState(editTask?.title ?? "")
   const [notes, setNotes] = useState(editTask?.notes ?? "")
   const [quadrant, setQuadrant] = useState<Quadrant>(editTask?.quadrant ?? defaultQuadrant)

   // Sync state whenever the modal opens or the task being edited changes
   useEffect(() => {
      if (open) {
         setTitle(editTask?.title ?? "")
         setNotes(editTask?.notes ?? "")
         setQuadrant(editTask?.quadrant ?? defaultQuadrant)
      }
   }, [open, editTask, defaultQuadrant])

   const isEdit = !!editTask

   const handleSave = () => {
      if (!title.trim()) return
      onSave({
         id: editTask?.id ?? String(nextId++),
         title: title.trim(),
         notes: notes.trim(),
         quadrant,
         completed: editTask?.completed ?? false,
         createdAt: editTask?.createdAt ?? Date.now(),
      })
      onClose()
   }

   return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
         <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-2">
               <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-zinc-900">
                     {isEdit ? "Editar Tarefa" : "Nova Tarefa"}
                  </h2>
                  <button
                     onClick={onClose}
                     className="text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                     <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                     >
                        <path d="M18 6L6 18M6 6l12 12" />
                     </svg>
                  </button>
               </div>

               <div className="flex flex-col gap-3.5">
                  <div>
                     <label className="text-xs font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider">
                        Título
                     </label>
                     <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="O que precisa ser feito?"
                        autoFocus
                     />
                  </div>

                  <div>
                     <label className="text-xs font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider">
                        Notas
                     </label>
                     <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Detalhes opcionais..."
                        rows={2}
                     />
                  </div>

                  <div>
                     <label className="text-xs font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider">
                        Quadrante
                     </label>
                     <Select value={quadrant} onValueChange={(v) => setQuadrant(v as Quadrant)}>
                        <SelectTrigger className="w-full rounded-xl border-zinc-200 focus:ring-zinc-900/20">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {QUADRANTS.map((q) => (
                              <SelectItem key={q.id} value={q.id}>
                                 {q.icon} {q.tag} — {q.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>

            <div className="flex gap-2 px-6 py-4 mt-2 bg-zinc-50 border-t border-zinc-100">
               <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
               </Button>
               <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={!title.trim()}
                  className="flex-1"
               >
                  {isEdit ? "Salvar" : "Criar Tarefa"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   )
}
