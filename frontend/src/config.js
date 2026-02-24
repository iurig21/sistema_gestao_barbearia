export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Returns the URL for a file. Handles both Cloudinary URLs (full) and legacy local paths.
 */
export function getFileUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `${API_URL}/uploads/${value}`;
}

