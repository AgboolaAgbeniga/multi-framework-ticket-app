<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <button
            @click="$router.push('/')"
            class="hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="TicketFlex Logo" class="h-8 w-auto" />
          </button>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <template v-if="session">
            <Button
              variant="ghost"
              @click="$router.push('/dashboard')"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              @click="$router.push('/tickets')"
            >
              Tickets
            </Button>
            <div class="flex items-center gap-3">
              <span class="text-sm text-slate-600">
                {{ session.name }}
              </span>
              <Button
                variant="outline"
                size="sm"
                @click="handleLogout"
              >
                <LogOut class="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </template>
          <template v-else>
            <Button
              variant="ghost"
              @click="$router.push('/auth/login')"
            >
              Login
            </Button>
            <Button
              @click="$router.push('/auth/signup')"
            >
              Get Started
            </Button>
          </template>
        </nav>

        <!-- Mobile menu button -->
        <button
          class="md:hidden p-2"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
        <template v-if="session">
          <div class="flex flex-col gap-2">
            <span class="px-3 py-2 text-sm text-slate-600">
              {{ session.name }}
            </span>
            <Button
              variant="ghost"
              class="justify-start"
              @click="navigateTo('/dashboard')"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              class="justify-start"
              @click="navigateTo('/tickets')"
            >
              Tickets
            </Button>
            <Button
              variant="outline"
              class="justify-start"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-2">
            <Button
              variant="ghost"
              class="justify-start"
              @click="navigateTo('/auth/login')"
            >
              Login
            </Button>
            <Button
              class="justify-start"
              @click="navigateTo('/auth/signup')"
            >
              Get Started
            </Button>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Menu, X } from 'lucide-vue-next'
import { getSession, logout } from '../../lib/auth'
import Button from '../ui/Button.vue'

const router = useRouter()
const session = computed(() => getSession())
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  logout()
  mobileMenuOpen.value = false
  router.push('/')
}

const navigateTo = (path: string) => {
  router.push(path)
  mobileMenuOpen.value = false
}
</script>