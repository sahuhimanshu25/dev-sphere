"use client"

import { useAuthGuard } from "@/hooks/useAuthGuard"
import Loader from "@/components/ui/Loader"

// Higher-order component for authentication
export function withAuth(WrappedComponent, options = {}) {
  const AuthenticatedComponent = (props) => {
    const { isAuthorized, isChecking } = useAuthGuard(options)

    if (isChecking) {
      return <Loader fullScreen text="Checking authentication..." />
    }

    if (!isAuthorized) {
      return null // Redirect will be handled by useAuthGuard
    }

    return <WrappedComponent {...props} />
  }

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`

  return AuthenticatedComponent
}

// HOC that requires authentication
export function withRequireAuth(WrappedComponent, redirectTo = "/login") {
  return withAuth(WrappedComponent, { requireAuth: true, redirectTo })
}

// HOC that requires admin role
export function withRequireAdmin(WrappedComponent, redirectTo = "/") {
  return withAuth(WrappedComponent, { requireAdmin: true, redirectTo })
}

// HOC that requires specific role
export function withRequireRole(role, redirectTo = "/") {
  return (WrappedComponent) => {
    return withAuth(WrappedComponent, { requireRole: role, redirectTo })
  }
}

// HOC for public-only pages (login, register)
export function withPublicOnly(WrappedComponent, redirectTo = "/") {
  return withAuth(WrappedComponent, { publicOnly: true, redirectTo })
}

// HOC with custom auth logic
export function withCustomAuth(WrappedComponent, authCheck) {
  const CustomAuthComponent = (props) => {
    const authResult = authCheck()

    if (authResult.isLoading) {
      return <Loader fullScreen text="Checking permissions..." />
    }

    if (!authResult.isAuthorized) {
      return authResult.fallback || null
    }

    return <WrappedComponent {...props} />
  }

  CustomAuthComponent.displayName = `withCustomAuth(${WrappedComponent.displayName || WrappedComponent.name})`

  return CustomAuthComponent
}
