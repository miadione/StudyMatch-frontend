export function isTokenExpired(token: string | null): boolean {
    if (!token) return true

    try {
        const parts = token.split('.')
        if (parts.length !== 3) return true

        const payload = parts[1]
        if (!payload) return true

        const decoded = JSON.parse(atob(payload))
        const expiry = decoded.exp * 1000

        return Date.now() > expiry
    } catch {
        return true
    }
}