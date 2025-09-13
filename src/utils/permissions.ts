// src/lib/permissions.ts
import type { Session } from "next-auth"

export function hasPermission(session: Session | null, codename: string) {
  return session?.group?.permissions?.some(
    (p) => p.codename === codename
  ) ?? false
}

export function hasRole(session: Session | null, role: string) {
  return session?.user?.role === role
}
