/**
 * Normalize image URLs to ensure they work correctly
 * If the URL is relative (starts with /static), prepend the API base URL
 */
export const normalizeImageUrl = (url) => {
  if (!url) return url
  
  // If it's already an absolute URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If it's a relative URL (starts with /static), prepend API base URL
  if (url.startsWith('/static') || url.startsWith('/api')) {
    const API_BASE_URL = import.meta.env.VITE_API_URL || ''
    // If API_BASE_URL is empty, we're in production and should use relative URLs
    // Otherwise, prepend the API base URL
    return API_BASE_URL ? `${API_BASE_URL}${url}` : url
  }
  
  // For any other relative URLs, return as is (they should work)
  return url
}

