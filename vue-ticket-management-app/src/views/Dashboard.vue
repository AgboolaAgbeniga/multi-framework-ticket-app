<template>
  <div class=" flex flex-col">
    <main class="flex-1 bg-slate-50 py-8">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 class="mb-2">Dashboard</h1>
            <p class="text-slate-600">
              Welcome back, {{ user?.name }}! Here's an overview of your tickets.
            </p>
          </div>
          <Button @click="$router.push('/tickets?new=true')" size="lg" class="shrink-0">
            <Ticket class="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <!-- Statistics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tickets"
            :value="stats.total"
            :icon="Ticket"
            icon-color="text-indigo-600"
            icon-bg-color="bg-indigo-100"
          />
          <StatCard
            title="Open Tickets"
            :value="stats.open"
            :icon="FolderOpen"
            icon-color="text-green-600"
            icon-bg-color="bg-green-100"
          />
          <StatCard
            title="In Progress"
            :value="stats.inProgress"
            :icon="Clock"
            icon-color="text-amber-600"
            icon-bg-color="bg-amber-100"
          />
          <StatCard
            title="Resolved"
            :value="stats.closed"
            :icon="CheckCircle"
            icon-color="text-slate-600"
            icon-bg-color="bg-slate-100"
          />
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card class="p-6 bg-linear-to-br from-indigo-500 to-purple-600 text-white">
            <h3 class="text-white font-bold">Quick Actions</h3>
            <p class="text-white/90 mb-4 text-sm">
              Get started by creating a new ticket or manage your existing ones.
            </p>
            <div class="flex flex-wrap">
              <Button
                v-if="stats.total > 0"
                variant="secondary"
                @click="$router.push('/tickets')"
                class="w-full"
              >
                <Clock class="w-4 h-4 mr-2" />
                View All {{ stats.total }} Tickets
              </Button>
            </div>
          </Card>

          <Card class="p-6 bg-linear-to-br from-slate-50 to-slate-100/80">
            <h3 class="font-bold">Status Overview</h3>
            <p v-if="stats.total === 0" class="text-slate-600 mb-4 text-sm">
              No tickets yet. Create your first one!
            </p>
            <p v-else class="text-slate-600 mb-4 text-sm">
              You have {{ statusSummary }}.
            </p>
            <Button
              v-if="stats.open > 0 || stats.inProgress > 0"
              variant="outline"
              size="sm"
              class="w-full"
              @click="$router.push('/tickets')"
            >
              <ArrowRight class="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Ticket, Clock, CheckCircle, FolderOpen, ArrowRight } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { apiGetStats } from '../lib/mockApi'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import StatCard from '../components/dashboard/StatCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const stats = ref({
  total: 0,
  open: 0,
  inProgress: 0,
  closed: 0
})

const statusSummary = computed(() => {
  if (stats.value.total === 0) return ''
  const parts: string[] = []
  if (stats.value.open > 0) parts.push(`${stats.value.open} open ${stats.value.open === 1 ? 'ticket' : 'tickets'}`)
  if (stats.value.inProgress > 0) parts.push(`${stats.value.inProgress} in progress`)
  if (stats.value.closed > 0) parts.push(`${stats.value.closed} resolved ${stats.value.closed === 1 ? 'ticket' : 'tickets'}`)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`
})

onMounted(async () => {
  try {
    const res = await apiGetStats()
    if (res.ok && res.data) {
      stats.value = res.data
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    }
  } catch (e) {
    console.error('Failed to load stats:', e)
  }
})
</script>