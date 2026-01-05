import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type {User, RegisterData, LoginCredentials} from '@/types'
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
  getCurrentUser,
  isAuthenticated, removeToken
} from '@/services/authService'

// ✅ State AUSSERHALB der Funktion = wird geteilt
const currentUser = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const router = useRouter()

  const isLoggedIn = computed(() => isAuthenticated())

  async function login(data: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      await loginService(data)
      await loadCurrentUser()  // ← User direkt nach Login laden
      return true
    } catch (e) {
      error.value = 'Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.'
      console.error('Login error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      removeToken()
      currentUser.value = null
      await registerService(data)
      return true
    } catch (e) {
      error.value = 'Registrierung fehlgeschlagen. Bitte versuche es erneut.'
      console.error('Register error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    logoutService()
    currentUser.value = null  // ← Reset beim Logout
    void router.push('/login')
  }

  async function loadCurrentUser(): Promise<void> {
    if (!isAuthenticated()) return

    // Nicht erneut laden wenn schon vorhanden
    if (currentUser.value) return

    try {
      currentUser.value = await getCurrentUser()
    } catch (e) {
      console.error('Fehler beim Laden des Users:', e)
      currentUser.value = null
    }
  }

  return {
    currentUser,
    loading,
    error,
    isLoggedIn,
    login,
    register,
    logout,
    loadCurrentUser
  }
}