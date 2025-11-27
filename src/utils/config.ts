/**
 * Get the base URL for the application
 * In production (GitHub Pages), it uses the repository path
 * In development, it uses the root path
 */
export function getBaseUrl(): string {
  // Check if we're in production (GitHub Pages)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // GitHub Pages production
    if (hostname === 'tiburonmartillo.github.io') {
      return 'https://tiburonmartillo.github.io/club_de_lectura';
    }
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }
  
  // Default fallback
  return 'https://tiburonmartillo.github.io/club_de_lectura';
}

/**
 * Get the redirect URL for authentication callbacks
 */
export function getAuthRedirectUrl(): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/auth/callback`;
}

