import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSession, login as authLogin, signup as authSignup, logout as authLogout } from '../lib/auth'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(getSession())

  const isAuthenticated = computed(() => session.value !== null)
  const user = computed(() => session.value)

  const login = async (email: string, password: string) => {
    const result = authLogin(email, password)
    if (result.success) {
      session.value = result.session
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const signup = async (email: string, password: string, name?: string) => {
    const result = authSignup(email, password, name)
    if (result.success) {
      session.value = result.session
      return { success: true }
    }
    return { success: false, error: result.error }
  }

  const logout = () => {
    authLogout()
    session.value = null
  }

  const refreshSession = () => {
    session.value = getSession()
  }

  return {
    session,
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    refreshSession
  }
})