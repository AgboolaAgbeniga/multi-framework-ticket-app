<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-[1440px] mx-auto">
        <div class="max-w-md mx-auto">
          <div class="text-center mb-8">
            <h1 class="mb-2">Welcome Back</h1>
            <p class="text-slate-600">
              Login to manage your tickets
            </p>
          </div>

          <Card class="p-6 sm:p-8 shadow-lg">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  v-model="email"
                  :class="{ 'border-red-500': errors.email }"
                  @input="clearError('email')"
                />
                <div v-if="errors.email" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  <span>{{ errors.email }}</span>
                </div>
              </div>

              <div>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  v-model="password"
                  :class="{ 'border-red-500': errors.password }"
                  @input="clearError('password')"
                />
                <div v-if="errors.password" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  <span>{{ errors.password }}</span>
                </div>
              </div>

              <Button
                type="submit"
                class="w-full"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </Button>

              <div class="text-center text-sm">
                <span class="text-slate-600">Don't have an account? </span>
                <router-link to="/auth/signup" class="text-primary hover:underline">
                  Sign up
                </router-link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useAuthStore } from '../stores/auth'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref<{ email?: string; password?: string }>({})
const isLoading = ref(false)

const clearError = (field: string) => {
  if (errors.value[field as keyof typeof errors.value]) {
    errors.value[field as keyof typeof errors.value] = undefined
  }
}

const validate = () => {
  const newErrors: { email?: string; password?: string } = {}

  if (!email.value) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    newErrors.email = 'Email is invalid'
  }

  if (!password.value) {
    newErrors.password = 'Password is required'
  } else if (password.value.length < 6) {
    newErrors.password = 'Password must be at least 6 characters'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) {
    toast.error('Please fix the form errors')
    return
  }

  isLoading.value = true

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const result = await authStore.login(email.value, password.value)
  isLoading.value = false

  if (result.success) {
    toast.success(`Welcome back, ${authStore.user?.name}!`)
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } else {
    toast.error(result.error || 'Login failed')
    errors.value = { email: result.error }
  }
}
</script>