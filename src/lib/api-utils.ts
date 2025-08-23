/**
 * API utilities for handling base URL and routing
 */

// Get the current base path from the browser URL
function getBasePath(): string {
  if (typeof window === 'undefined') {
    // Server-side: no base path needed for API routes
    return '';
  }
  
  // Client-side: detect if we're running under /tools/ prefix
  const pathname = window.location.pathname;
  if (pathname.startsWith('/tools/')) {
    return '/tools';
  }
  
  return '';
}

/**
 * Create API URL with proper base path
 */
export function apiUrl(path: string): string {
  const basePath = getBasePath();
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  return `${basePath}${path}`;
}

/**
 * Enhanced fetch with automatic API URL resolution
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const basePath = getBasePath()
  const urlWithBase = apiUrl(path)

  // Add default headers (don't overwrite provided headers)
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  }

  let res = await fetch(urlWithBase, defaultOptions)

  // Fallback: if we added a basePath and got 404 for an /api/ route, retry without prefix.
  if (res.status === 404 && basePath && urlWithBase.startsWith(`${basePath}/api/`)) {
    const barePath = path.startsWith('/') ? path : `/${path}`
    try {
      const retry = await fetch(barePath, defaultOptions)
      if (retry.ok) {
        return retry
      }
      // If retry not ok but different status, return retry; else keep original
      if (retry.status !== 404) return retry
    } catch (_) {
      // swallow retry errors; fall through to original response
    }
  }

  return res
}

// Export for backward compatibility and convenience
export { apiUrl as getApiUrl };
