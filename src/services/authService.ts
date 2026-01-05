import api from '@/api/api'
import type { User, LoginCredentials, RegisterData } from '@/types'

const TOKEN_KEY = 'token'

// Token Management
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
    return !!getToken()
}

// Auth Actions
export async function login(data: LoginCredentials): Promise<void> {
    const response = await api.post('/api/auth/login', data)

    if (response.data.token) {
        setToken(response.data.token)
    }
}

export async function register(data: RegisterData): Promise<User> {
    const response = await api.post('/api/auth/register', {
        ...data,
        role: data.role ?? 'USER'
    })
    return response.data
}

export function logout(): void {
    removeToken()
}

export async function getCurrentUser(): Promise<User> {
    const response = await api.get('/api/users/me')
    return response.data
}
