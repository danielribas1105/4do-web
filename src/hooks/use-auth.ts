import { authApi, tokenStore } from "@/lib/api"
import { AuthUser } from "@/types/auth"
import { useCallback, useEffect, useState } from "react"

interface UseAuthReturn {
   user: AuthUser | null
   loading: boolean
   error: string | null
   login: (email: string, password: string) => Promise<boolean>
   register: (email: string, password: string, name?: string) => Promise<boolean>
   logout: () => void
}

export function useAuth(): UseAuthReturn {
   const [user, setUser] = useState<AuthUser | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const token = tokenStore.get()
      if (!token) {
         setLoading(false)
         return
      }
      authApi
         .me()
         .then(setUser)
         .catch(() => tokenStore.clear())
         .finally(() => setLoading(false))
   }, [])

   const login = useCallback(async (email: string, password: string): Promise<boolean> => {
      setError(null)
      try {
         const { access_token } = await authApi.login(email, password)
         tokenStore.set(access_token)
         setUser(await authApi.me())
         return true
      } catch (e) {
         setError(e instanceof Error ? e.message : "Erro ao fazer login")
         return false
      }
   }, [])

   const register = useCallback(
      async (email: string, password: string, name?: string): Promise<boolean> => {
         setError(null)
         try {
            await authApi.register(email, password, name)
            return login(email, password)
         } catch (e) {
            setError(e instanceof Error ? e.message : "Erro ao criar conta")
            return false
         }
      },
      [login],
   )

   const logout = useCallback(() => {
      tokenStore.clear()
      setUser(null)
   }, [])

   return { user, loading, error, login, register, logout }
}
