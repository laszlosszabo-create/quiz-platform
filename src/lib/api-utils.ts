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
  const url = apiUrl(path);
  
  // Add default headers
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };
  
  return fetch(url, defaultOptions);
}

// Export for backward compatibility and convenience
export { apiUrl as getApiUrl };
