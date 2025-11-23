import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import UserView from "@/views/UserView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/api/auth/register',
      name: 'register',
      component: RegisterView,
    },
    {
        path:'/users',
        name: 'user',
        component:UserView,
    },

  ],
})

export default router
