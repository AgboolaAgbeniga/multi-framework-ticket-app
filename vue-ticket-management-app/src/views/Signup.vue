<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-[1440px] mx-auto">
        <div class="max-w-md mx-auto">
          <div class="text-center mb-8">
            <h1 class="mb-2">Create Account</h1>
            <p class="text-slate-600">
              Get started with TicketFlex today
            </p>
          </div>

          <Card class="p-6 sm:p-8 shadow-lg">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <Label for="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  v-model="name"
                  :class="{ 'border-red-500': errors.name }"
                  @input="errors.name = undefined"
                />
                <div v-if="errors.name" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  <span>{{ errors.name }}</span>
                </div>
              </div>

              <div>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  v-model="email"
                  :class="{ 'border-red-500': errors.email }"
                  @input="errors.email = undefined"
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
                  @input="errors.password = undefined"
                />
                <div v-if="errors.password" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  <span>{{ errors.password }}</span>
                </div>
              </div>

              <div>
                <Label for="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  v-model="confirmPassword"
                  :class="{ 'border-red-500': errors.confirmPassword }"
                  @input="errors.confirmPassword = undefined"
                />
                <div v-if="errors.confirmPassword" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle class="w-4 h-4" />
                  <span>{{ errors.confirmPassword }}</span>
                </div>
              </div>

              <Button
                type="submit"
                class="w-full"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </Button>

              <div class="text-center text-sm">
                <span class="text-slate-600">Already have an account? </span>
                <router-link to="/auth/login" class="text-indigo-600 hover:underline">
                  Login
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
import { useAuthStore } from '../stores/auth'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<{
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}>({})
const isLoading = ref(false)

const validate = () => {
  const newErrors: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  } = {}

  if (!name.value) {
    newErrors.name = 'Name is required'
  } else if (name.value.length < 2) {
    newErrors.name = 'Name must be at least 2 characters'
  }

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

  if (!confirmPassword.value) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (password.value !== confirmPassword.value) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) {
    return
  }

  isLoading.value = true

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const result = await authStore.signup(email.value, password.value, name.value)
  isLoading.value = false

  if (result.success) {
    router.push('/auth/login')
  } else {
    errors.value = { email: result.error }
  }
}
</script>