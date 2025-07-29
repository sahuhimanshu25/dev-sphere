import jwt from "jsonwebtoken"

// Middleware to verify JWT tokens in API routes
export function verifyToken(handler) {
  return async (req, res) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "")

      if (!token) {
        return res.status(401).json({
          error: "Access denied. No token provided.",
          code: "NO_TOKEN",
        })
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded

      return handler(req, res)
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired. Please login again.",
          code: "TOKEN_EXPIRED",
        })
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "Invalid token.",
          code: "INVALID_TOKEN",
        })
      }

      return res.status(500).json({
        error: "Internal server error.",
        code: "SERVER_ERROR",
      })
    }
  }
}

// Middleware to verify admin role
export function verifyAdmin(handler) {
  return verifyToken(async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied. Admin privileges required.",
        code: "INSUFFICIENT_PERMISSIONS",
      })
    }

    return handler(req, res)
  })
}

// Middleware to verify user owns resource
export function verifyOwnership(handler, getResourceUserId) {
  return verifyToken(async (req, res) => {
    try {
      const resourceUserId = await getResourceUserId(req)

      if (req.user.id !== resourceUserId && req.user.role !== "admin") {
        return res.status(403).json({
          error: "Access denied. You can only access your own resources.",
          code: "OWNERSHIP_REQUIRED",
        })
      }

      return handler(req, res)
    } catch (error) {
      return res.status(500).json({
        error: "Error verifying resource ownership.",
        code: "OWNERSHIP_VERIFICATION_ERROR",
      })
    }
  })
}

// Rate limiting middleware
const rateLimitMap = new Map()

export function rateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    message = "Too many requests, please try again later.",
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options

  return (handler) => {
    return async (req, res) => {
      const identifier = req.user?.id || req.ip || "anonymous"
      const now = Date.now()
      const windowStart = now - windowMs

      // Clean up old entries
      for (const [key, requests] of rateLimitMap.entries()) {
        rateLimitMap.set(
          key,
          requests.filter((time) => time > windowStart),
        )
        if (rateLimitMap.get(key).length === 0) {
          rateLimitMap.delete(key)
        }
      }

      // Get current requests for this identifier
      const requests = rateLimitMap.get(identifier) || []
      const recentRequests = requests.filter((time) => time > windowStart)

      if (recentRequests.length >= maxRequests) {
        return res.status(429).json({
          error: message,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
        })
      }

      // Add current request
      recentRequests.push(now)
      rateLimitMap.set(identifier, recentRequests)

      // Execute handler
      const originalJson = res.json
      let requestSuccessful = true

      res.json = function (data) {
        requestSuccessful = res.statusCode < 400
        return originalJson.call(this, data)
      }

      try {
        const result = await handler(req, res)

        // Remove request from count if it should be skipped
        if ((skipSuccessfulRequests && requestSuccessful) || (skipFailedRequests && !requestSuccessful)) {
          const currentRequests = rateLimitMap.get(identifier) || []
          currentRequests.pop() // Remove the last added request
          rateLimitMap.set(identifier, currentRequests)
        }

        return result
      } catch (error) {
        // Remove request from count if failed requests should be skipped
        if (skipFailedRequests) {
          const currentRequests = rateLimitMap.get(identifier) || []
          currentRequests.pop()
          rateLimitMap.set(identifier, currentRequests)
        }
        throw error
      }
    }
  }
}

// CORS middleware for API routes
export function cors(options = {}) {
  const {
    origin = process.env.FRONTEND_URL || "http://localhost:3001",
    methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders = ["Content-Type", "Authorization"],
    credentials = true,
  } = options

  return (handler) => {
    return async (req, res) => {
      // Set CORS headers
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Access-Control-Allow-Methods", methods.join(", "))
      res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "))
      res.setHeader("Access-Control-Allow-Credentials", credentials)

      // Handle preflight requests
      if (req.method === "OPTIONS") {
        res.status(200).end()
        return
      }

      return handler(req, res)
    }
  }
}

// Combine multiple middlewares
export function combineMiddlewares(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}
