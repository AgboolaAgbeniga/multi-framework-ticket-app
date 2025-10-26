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
           @submit="handleFormSubmit"
           @cancel="closeForm"
         />
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="isDeleteDialogOpen">
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the ticket "{{ ticketToDelete?.title }}".
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" @click="cancelDelete" class="flex-1">
            Cancel
          </Button>
          <Button @click="confirmDelete" variant="destructive" class="flex-1 hover:bg-red-700">
            Delete
          </Button>
        </div>
      </DialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Plus, Filter } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
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
import AlertDialog from '../components/ui/AlertDialog.vue'
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
      console.log('Attempting to show success toast for ticket creation')
      toast.success('Ticket created successfully!')
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    } else {
      console.log('Attempting to show error toast for ticket creation:', res.error)
      toast.error(res.error || 'Failed to create ticket')
    }
  } catch (e) {
    console.error('Failed to create ticket:', e)
    console.log('Attempting to show error toast for ticket creation catch')
    toast.error('Failed to create ticket')
  }
}

const handleEdit = (ticket: Ticket) => {
  selectedTicket.value = ticket
  isFormOpen.value = true
}

const handleFormSubmit = async (data: { title: string; description: string; status: 'open' | 'in_progress' | 'closed'; priority: string }) => {
  if (selectedTicket.value) {
    await handleUpdate(data)
  } else {
    await handleCreate(data)
  }
}

const handleUpdate = async (data: { title: string; description: string; status: 'open' | 'in_progress' | 'closed'; priority: string }) => {
  if (!selectedTicket.value) return

  console.log('Updating ticket:', selectedTicket.value.id, 'with data:', data)

  try {
    const res = await apiUpdateTicket(selectedTicket.value.id, data)
    console.log('Update response:', res)
    if (res.ok) {
      await loadTickets()
      closeForm()
      console.log('Attempting to show success toast for ticket update')
      toast.success('Ticket updated successfully!')
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    } else {
      console.log('Attempting to show error toast for ticket update:', res.error)
      toast.error(res.error || 'Failed to update ticket')
    }
  } catch (e) {
    console.error('Failed to update ticket:', e)
    console.log('Attempting to show error toast for ticket update catch')
    toast.error('Failed to update ticket')
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
      console.log('Attempting to show success toast for ticket deletion')
      toast.success('Ticket deleted successfully!')
    } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
      authStore.logout()
      router.push('/auth/login')
    } else {
      console.log('Attempting to show error toast for ticket deletion:', res.error)
      toast.error(res.error || 'Failed to delete ticket')
    }
  } catch (e) {
    console.error('Failed to delete ticket:', e)
    console.log('Attempting to show error toast for ticket deletion catch')
    toast.error('Failed to delete ticket')
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
  loadTickets()

  // Handle query parameters
  if (route.query.new === 'true') {
    openCreateForm()
  }
})
</script>