import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import UserView from "@/views/UserView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
        path:'/users',
        name: 'users',
        component:UserView,
    },

  ],
})

export default router
