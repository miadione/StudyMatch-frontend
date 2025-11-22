import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import UserView from "@/views/UserView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BACKEND_BASE_URL),
  routes: [
    {
      path: '/api/auth/register',
      name: 'register',
      component: RegisterView,
    },
    {
        path:'/',
        name: 'user',
        component:UserView,
    },

  ],
})

export default router
