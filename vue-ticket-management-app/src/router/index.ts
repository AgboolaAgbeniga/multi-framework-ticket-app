import { createRouter, createWebHistory } from 'vue-router'
import { getSession } from '../lib/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/Landing.vue')
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketManagement.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const session = getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !session) {
    next('/auth/login')
  } else {
    next()
  }
})

export default router