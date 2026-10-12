// Resolve a file in /public against Vite's base path ("/sudo-ayesh/").
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
