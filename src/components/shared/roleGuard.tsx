"use client"

import { useAuth } from "@/context/authContext"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, loading, hasAnyRole } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>
  }

  if (!user) {
    return fallback || <div className="text-center p-4">Please sign in to access this content.</div>
  }

  if (!hasAnyRole(allowedRoles)) {
    return fallback || <div className="text-center p-4">You don't have permission to access this content.</div>
  }

  return <>{children}</>
}
