// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      email: string
      role: string
    }
    group?: {
      id: string
      name: string
      permissions: {
        id: number
        codename: string
      }[]
    }
    expires: string
    accessToken: string
    refreshToken: string
  }

  interface User {
    email: string
    role: string
    accessToken: string
    refreshToken: string
  }

  interface JWT {
    email?: string
    role?: string
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: string
  }
}
