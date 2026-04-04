import { AuthUser, TokenResponse } from "@/types/auth"
import { Task, TaskCreate, TaskUpdate } from "@/types/tasks"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

// ── Token management ────────────────────────────────────────────────────────
const TOKEN_KEY = "4do:token"

export const tokenStore = {
   get: (): string | null => localStorage.getItem(TOKEN_KEY),
   set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
   clear: () => localStorage.removeItem(TOKEN_KEY),
}

// ── Base fetch with auth header ─────────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
   const token = tokenStore.get()

   const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
         ...options.headers,
      },
   })

   if (res.status === 401) {
      tokenStore.clear()
      window.location.href = "/login"
      throw new Error("Unauthorized")
   }

   if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }))
      throw new Error(error.detail ?? "API error")
   }

   // 204 No Content
   if (res.status === 204) return undefined as T

   return res.json() as Promise<T>
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
   login: async (email: string, password: string): Promise<TokenResponse> => {
      // FastAPI OAuth2 expects form data for /auth/login
      const res = await fetch(`${BASE_URL}/auth/login`, {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: new URLSearchParams({ username: email, password }),
      })
      if (!res.ok) {
         const error = await res.json().catch(() => ({ detail: "Credenciais inválidas" }))
         throw new Error(error.detail ?? "Login failed")
      }
      return res.json()
   },

   register: async (email: string, password: string, name?: string): Promise<AuthUser> =>
      apiFetch<AuthUser>("/auth/register", {
         method: "POST",
         body: JSON.stringify({ email, password, name }),
      }),

   me: async (): Promise<AuthUser> => apiFetch<AuthUser>("/user/me"),
}

// ── Tasks ───────────────────────────────────────────────────────────────────
export const tasksApi = {
   list: (): Promise<Task[]> => apiFetch<Task[]>("/tasks/"),

   create: (data: TaskCreate): Promise<Task> =>
      apiFetch<Task>("/tasks/create", {
         method: "POST",
         body: JSON.stringify(data),
      }),

   update: (id: string, data: TaskUpdate): Promise<Task> =>
      apiFetch<Task>(`/tasks/${id}`, {
         method: "PUT",
         body: JSON.stringify(data),
      }),

   delete: (id: string): Promise<void> => apiFetch<void>(`/tasks/${id}`, { method: "DELETE" }),
}
