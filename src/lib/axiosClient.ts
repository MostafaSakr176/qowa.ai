// src/lib/axiosClient.ts
import axios from "axios"
import { getSession, signOut } from "next-auth/react"

const api = axios.create({
  baseURL: "https://api.qowa.ai",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add access token before every request
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (!session?.accessToken) {


    // Sign out and redirect to login page
    if (typeof window !== "undefined") {
        signOut({
          callbackUrl: `/en/auth/login`,
        });
      }

  }

  config.headers?.set("Authorization", `Bearer ${session?.accessToken}`)

  return config
})

export default api