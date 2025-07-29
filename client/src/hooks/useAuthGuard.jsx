"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

// Main auth guard hook with flexible options
export function useAuthGuard(options = {}) {
  const {
    requireAuth = false,
    requireAdmin = false,
    requireRole = null,
    redirectTo = "/login",
    publicOnly = false,
    showToast = true,
  } = options

  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  const { isAuthorized: authStatus, userData, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (loading) return

    setIsChecking(false)

    // Public only routes (login, register)
    if (publicOnly) {
      if (authStatus) {
        router.push("/")
        return
      }
      setIsAuthorized(true)
      return
    }

    // Routes that require authentication
    if (requireAuth || requireAdmin || requireRole) {
      if (!authStatus) {
        if (showToast) {
          toast.error("Please login to access this page")
        }
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`)
        return
      }

      // Check admin requirement
      if (requireAdmin && userData?.role !== "admin") {
        if (showToast) {
          toast.error("Admin access required")
        }
        router.push("/")
        return
      }

      // Check specific role requirement
      if (requireRole && userData?.role !== requireRole) {
        if (showToast) {
          toast.error(`${requireRole} access required`)
        }
        router.push("/")
        return
      }

      setIsAuthorized(true)
      return
    }

    // No restrictions
    setIsAuthorized(true)
  }, [authStatus, userData, loading, requireAuth, requireAdmin, requireRole, redirectTo, publicOnly, showToast, router])

  return {
    isAuthorized,
    isChecking: loading || isChecking,
    user: userData,
  }
}

// Convenience hooks for common use cases
export function useRequireAuth(redirectTo = "/login") {
  return useAuthGuard({ requireAuth: true, redirectTo })
}

export function useRequireAdmin(redirectTo = "/") {
  return useAuthGuard({ requireAdmin: true, redirectTo })
}

export function useRequireRole(role, redirectTo = "/") {
  return useAuthGuard({ requireRole: role, redirectTo })
}

export function usePublicOnly(redirectTo = "/") {
  return useAuthGuard({ publicOnly: true, redirectTo })
}

// Hook for checking permissions without redirecting
export function usePermissions() {
  const { userData, isAuthorized } = useSelector((state) => state.auth)

  const hasRole = (role) => {
    return isAuthorized && userData?.role === role
  }

  const hasAnyRole = (roles) => {
    return isAuthorized && roles.includes(userData?.role)
  }

  const isAdmin = () => {
    return hasRole("admin")
  }

  const isModerator = () => {
    return hasRole("moderator")
  }

  const canAccess = (resource) => {
    if (!isAuthorized) return false

    // Define resource permissions
    const permissions = {
      admin_panel: ["admin"],
      moderation: ["admin", "moderator"],
      user_management: ["admin"],
      content_management: ["admin", "moderator"],
    }

    const requiredRoles = permissions[resource]
    return requiredRoles ? hasAnyRole(requiredRoles) : true
  }

  return {
    isAuthenticated: isAuthorized,
    user: userData,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    canAccess,
  }
}
