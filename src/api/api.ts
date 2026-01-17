import axios from 'axios'
import router from '@/router'
import { isTokenExpired } from '@/utils/tokenUtils'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        // Login/Register brauchen keinen Token
        const isAuthEndpoint = config.url?.includes('/auth/')

        if (!isAuthEndpoint && isTokenExpired(token)) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            if (router.currentRoute.value.path !== '/login') {
                void router.push('/login')
            }
            return Promise.reject(new Error('Token expired'))
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 403) {
            console.warn('Token abgelaufen oder ungültig - Logout')
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            if (router.currentRoute.value.path !== '/login') {
                void router.push('/login')
            }
        }

        return Promise.reject(error)
    }
)

export default api