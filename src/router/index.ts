import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { isAuthenticated } from '@/services/authService'


// Lazy Loading für bessere Performance
const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const MainView = () => import('@/views/MainView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: () => import('@/views/ProfileEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/app',
    name: 'main',
    component: MainView,
    meta: { requiresAuth: true }
  },
  // Redirect alte Routes
  {
    path: '/users',
    redirect: '/app'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to: RouteLocationNormalized, _from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const isGuestOnly = to.meta.guest
  const authenticated = isAuthenticated()

  if (requiresAuth && !authenticated) {
    // Nicht eingeloggt → Login
    next({ name: 'login' })
  } else if (isGuestOnly && authenticated && to.name === 'login') {
    // Eingeloggt und will zu Login → App
    next({ name: 'main' })
  } else {
    next()
  }
})

export default router
