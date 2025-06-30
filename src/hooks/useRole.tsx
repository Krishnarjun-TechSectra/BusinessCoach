"use client"

import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useRoleAccess(requiredRoles: string[], redirectTo = "/unauthorized") {
  const { user, loading, hasAnyRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && !hasAnyRole(requiredRoles)) {
      router.push(redirectTo)
    }
  }, [user, loading, hasAnyRole, requiredRoles, redirectTo, router])

  return {
    hasAccess: user ? hasAnyRole(requiredRoles) : false,
    loading,
    user,
  }
}
