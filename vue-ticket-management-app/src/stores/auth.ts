import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiLogin, apiSignup, apiLogout, getCurrentUser } from '../lib/mockApi'
import type { AuthToken } from '../lib/types'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthToken['user'] | null>(getCurrentUser())

  const isAuthenticated = computed(() => session.value !== null)
  const user = computed(() => session.value)

  const login = async (email: string, password: string) => {
    const result = await apiLogin(email, password)
    if (result.ok && result.data) {
      session.value = result.data.user
      return { success: true }
    }
    return { success: false, error: result.error || 'Login failed' }
  }

  const signup = async (email: string, password: string, name?: string) => {
    const result = await apiSignup(email, password, name || '')
    if (result.ok && result.data) {
      // After signup, user needs to login
      return { success: true }
    }
    return { success: false, error: result.error || 'Signup failed' }
  }

  const logout = () => {
    apiLogout()
    session.value = null
  }

  const refreshSession = () => {
    session.value = getCurrentUser()
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