// Resolve image URLs to the correct backend origin
// In production, images are served from the Render backend
// In local dev, they're served via Vite proxy from localhost:3000

const API_BASE = import.meta.env.VITE_API_URL || '';

export function resolveImageUrl(path: string): string {
    if (!path) return '';

    // Already a full URL (e.g. from external CDN)
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // In production, VITE_API_URL is like "https://avtosotuv-api.onrender.com/api"
    // We need just the origin: "https://avtosotuv-api.onrender.com"
    if (API_BASE) {
        // Strip the /api suffix to get the base origin
        const origin = API_BASE.replace(/\/api\/?$/, '');
        return `${origin}${path}`;
    }

    // Local dev: relative path works because Vite proxies /uploads
    return path;
}
