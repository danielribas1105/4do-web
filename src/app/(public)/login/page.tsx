"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

export default function LoginPage() {
   const { login, register, error } = useAuth()
   const [mode, setMode] = useState<"login" | "signup">("login")
   const [name, setName] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [submitting, setSubmitting] = useState(false)

   const handleSubmit = async () => {
      if (!email || !password) return
      setSubmitting(true)
      if (mode === "login") await login(email, password)
      else await register(email, password, name || undefined)
      setSubmitting(false)
   }

   return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
         <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,900&display=swap');
            * { font-family: 'DM Sans', sans-serif; }
         `}</style>
         <div className="w-full max-w-sm">
            <div className="flex flex-col items-center mb-8">
               <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl">✅</span>
               </div>
               <h1 className="text-2xl font-black text-zinc-900 tracking-tight">4Do</h1>
               <p className="text-sm text-zinc-400 font-medium mt-1">Faça o que importa.</p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
               <div className="flex border-b border-zinc-100">
                  {(["login", "signup"] as const).map((m) => (
                     <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                           mode === m
                              ? "text-zinc-900 border-b-2 border-zinc-900"
                              : "text-zinc-400 hover:text-zinc-600"
                        }`}
                     >
                        {m === "login" ? "Entrar" : "Criar conta"}
                     </button>
                  ))}
               </div>
               <div className="px-6 py-6 flex flex-col gap-3">
                  {mode === "signup" && (
                     <div>
                        <label className="text-xs font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider">
                           Nome (opcional)
                        </label>
                        <Input
                           type="text"
                           placeholder="Seu nome"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                        />
                     </div>
                  )}
                  <div>
                     <label className="text-xs font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider">
                        Email
                     </label>
                     <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                     />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-zinc-500 mb-1.5 block uppercase tracking-wider">
                        Senha
                     </label>
                     <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                     />
                  </div>
                  {error && (
                     <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                        <p className="text-xs text-red-600 font-medium">{error}</p>
                     </div>
                  )}
                  <Button
                     onClick={handleSubmit}
                     disabled={submitting || !email || !password}
                     className="w-full mt-1"
                  >
                     {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
                  </Button>
               </div>
            </div>
            <p className="text-center text-xs text-zinc-400 mt-6">
               Suas tarefas ficam sincronizadas em todos os dispositivos.
            </p>
         </div>
      </div>
   )
}
