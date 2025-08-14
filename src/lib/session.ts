/**
 * Session management utilities for client-side tracking
 */

/**
 * Generate a unique client token for session tracking
 */
export function generateClientToken(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `client_${timestamp}_${random}`
}

/**
 * Get or create client token from localStorage
 */
export function getClientToken(): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return generateClientToken()
  }
  
  const storageKey = 'quiz_client_token'
  let token = localStorage.getItem(storageKey)
  
  if (!token) {
    token = generateClientToken()
    localStorage.setItem(storageKey, token)
  }
  
  return token
}

/**
 * Clear client token (for logout or reset)
 */
export function clearClientToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('quiz_client_token')
  }
}

/**
 * Check if client token is expired (older than 24 hours)
 */
export function isClientTokenExpired(token: string): boolean {
  try {
    const parts = token.split('_')
    if (parts.length !== 3 || parts[0] !== 'client') {
      return true
    }
    
    const timestamp = parseInt(parts[1])
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    
    return (now - timestamp) > maxAge
  } catch {
    return true
  }
}

/**
 * Get or refresh client token (create new if expired)
 */
export function getValidClientToken(): string {
  const token = getClientToken()
  
  if (isClientTokenExpired(token)) {
    clearClientToken()
    return getClientToken()
  }
  
  return token
}
