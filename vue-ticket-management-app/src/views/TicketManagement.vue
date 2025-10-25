<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 bg-slate-50 py-8">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 class="mb-2">Ticket Management</h1>
            <p class="text-slate-600">
              Create, view, edit, and manage your support tickets
            </p>
          </div>
          <Button @click="openCreateForm">
            <Plus class="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <!-- Filter -->
        <div class="mb-6 flex items-center gap-3">
          <Filter class="w-5 h-5 text-slate-500" />
          <Select v-model="filterStatus" :options="filterOptions" class="w-[200px]" />
          <span class="text-sm text-slate-600">
            Showing {{ filteredTickets.length }} ticket{{ filteredTickets.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Tickets Grid -->
        <div v-if="filteredTickets.length === 0" class="text-center py-12">
          <p class="text-slate-600 mb-4">
            {{ filterStatus === 'all'
               ? 'No tickets yet. Create your first ticket to get started!'
               : `No ${filterStatus.replace('_', ' ')} tickets found.` }}
          </p>
          <Button v-if="filterStatus === 'all'" @click="openCreateForm">
            <Plus class="w-4 h-4 mr-2" />
            Create First Ticket
          </Button>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TicketCard
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            :ticket="ticket"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </main>

    <!-- Create/Edit Dialog -->
    <Dialog :open="isFormOpen" @close="closeForm">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {{ selectedTicket ? 'Edit Ticket' : 'Create New Ticket' }}
          </DialogTitle>
          <DialogDescription>
            {{ selectedTicket
               ? 'Update the ticket details below.'
               : 'Fill in the details to create a new ticket.' }}
          </DialogDescription>
        </DialogHeader>
        <TicketForm
          :ticket="selectedTicket"
          @submit="selectedTicket ? handleUpdate : handleCreate"
          @cancel="closeForm"
        />
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="isDeleteDialogOpen" @close="cancelDelete">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the ticket "{{ ticketToDelete?.title }}".
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div class="flex gap-3 pt-4">
          <Button variant="outline" @click="cancelDelete" class="flex-1">
            Cancel
          </Button>
          <Button @click="confirmDelete" variant="destructive" class="flex-1">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Plus, Filter } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { apiGetTickets, apiCreateTicket, apiUpdateTicket, apiDeleteTicket } from '../lib/mockApi'
import type { Ticket } from '../lib/types'
import Button from '../components/ui/Button.vue'
import Select from '../components/ui/Select.vue'
import Dialog from '../components/ui/Dialog.vue'
import DialogContent from '../components/ui/DialogContent.vue'
import DialogHeader from '../components/ui/DialogHeader.vue'
import DialogTitle from '../components/ui/DialogTitle.vue'
import DialogDescription from '../components/ui/DialogDescription.vue'
import TicketCard from '../components/tickets/TicketCard.vue'
import TicketForm from '../components/tickets/TicketForm.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const tickets = ref<Ticket[]>([])
const filterStatus = ref(route.query.status as string || 'all')
const isFormOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const selectedTicket = ref<Ticket | null>(null)
const ticketToDelete = ref<Ticket | null>(null)

const filterOptions = [
  { value: 'all', label: 'All Tickets' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
]

const filteredTickets = computed(() => {
  if (filterStatus.value === 'all') {
    return tickets.value
  }
  return tickets.value.filter(t => t.status === filterStatus.value)
})

const loadTickets = async () => {
  if (!authStore.isAuthenticated) return

  try {
    const res = await apiGetTickets()
    if (res.ok && Array.isArray(res.data)) {
      tickets.value = res.data as unknown as Ticket[]
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    }
  } catch (e) {
    console.error('Failed to load tickets:', e)
  }
}

const openCreateForm = () => {
  selectedTicket.value = null
  isFormOpen.value = true
}

const closeForm = () => {
  isFormOpen.value = false
  selectedTicket.value = null
}

const handleCreate = async (data: { title: string; description: string; status: 'open' | 'in_progress' | 'closed'; priority: string }) => {
  try {
    const res = await apiCreateTicket(data)
    if (res.ok) {
      await loadTickets()
      closeForm()
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    }
  } catch (e) {
    console.error('Failed to create ticket:', e)
  }
}

const handleEdit = (ticket: Ticket) => {
  selectedTicket.value = ticket
  isFormOpen.value = true
}

const handleUpdate = async (data: { title: string; description: string; status: 'open' | 'in_progress' | 'closed'; priority: string }) => {
  if (!selectedTicket.value) return

  try {
    const res = await apiUpdateTicket(selectedTicket.value.id, data)
    if (res.ok) {
      await loadTickets()
      closeForm()
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    }
  } catch (e) {
    console.error('Failed to update ticket:', e)
  }
}

const handleDelete = (ticket: Ticket) => {
  ticketToDelete.value = ticket
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (!ticketToDelete.value) return

  try {
    const res = await apiDeleteTicket(ticketToDelete.value.id)
    if (res.ok && res.data) {
      await loadTickets()
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    }
  } catch (e) {
    console.error('Failed to delete ticket:', e)
  } finally {
    cancelDelete()
  }
}

const cancelDelete = () => {
  isDeleteDialogOpen.value = false
  ticketToDelete.value = null
}

watch(() => route.query.new, (newVal) => {
  if (newVal === 'true') {
    openCreateForm()
  }
})

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }

  loadTickets()

  // Handle query parameters
  if (route.query.new === 'true') {
    openCreateForm()
  }
})
</script>