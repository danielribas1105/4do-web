import { QUADRANTS } from "@/constants/quadrants"

export default function AboutPage() {
   return (
      <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center text-center gap-6">
         <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg">
            <span className="text-2xl">✅</span>
         </div>
         <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">4Do</h2>
            <p className="text-sm text-zinc-400 font-medium mt-1">Faça o que importa.</p>
         </div>
         <p className="text-sm text-zinc-600 leading-relaxed max-w-sm">
            Uma aplicação de gestão de tarefas baseada na Matriz de Eisenhower — o método comprovado
            para separar o urgente do importante e focar no que realmente faz a diferença.
         </p>
         <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {QUADRANTS.map((q) => (
               <div
                  key={q.id}
                  className="rounded-xl p-3 text-left"
                  style={{ background: q.bg, border: `1px solid ${q.border}` }}
               >
                  <div className="text-lg mb-1">{q.icon}</div>
                  <p className="text-xs font-bold" style={{ color: q.accent }}>
                     {q.tag}
                  </p>
                  <p className="text-xs font-semibold text-zinc-700">{q.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{q.subtitle}</p>
               </div>
            ))}
         </div>
      </div>
   )
}
