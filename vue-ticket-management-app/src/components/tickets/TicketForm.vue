<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <Label for="title">Title *</Label>
      <Input
        id="title"
        v-model="title"
        placeholder="Enter ticket title"
        :class="{ 'border-red-500': errors.title }"
        @input="errors.title = undefined"
      />
      <div v-if="errors.title" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle class="w-4 h-4" />
        <span>{{ errors.title }}</span>
      </div>
    </div>

    <div>
      <Label for="description">Description</Label>
      <Textarea
        id="description"
        v-model="description"
        placeholder="Enter ticket description (optional)"
        rows="4"
        maxlength="500"
      />
      <p class="text-xs text-slate-500 mt-1">
        {{ description.length }}/500 characters
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label for="status">Status *</Label>
        <Select
          id="status"
          v-model="status"
          :options="statusOptions"
          :class="{ 'border-red-500': errors.status }"
        />
        <div v-if="errors.status" class="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <AlertCircle class="w-4 h-4" />
          <span>{{ errors.status }}</span>
        </div>
      </div>

      <div>
        <Label for="priority">Priority</Label>
        <Select
          id="priority"
          v-model="priority"
          :options="priorityOptions"
        />
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <Button type="submit" class="flex-1">
        {{ ticket ? 'Update Ticket' : 'Create Ticket' }}
      </Button>
      <Button type="button" variant="outline" @click="$emit('cancel')" class="flex-1">
        Cancel
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { AlertCircle } from 'lucide-vue-next'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Label from '../ui/Label.vue'
import Textarea from '../ui/Textarea.vue'
import Select from '../ui/Select.vue'
import type { Ticket } from '../../lib/types'

interface Props {
  ticket?: Ticket | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { title: string; description: string; status: 'open' | 'in_progress' | 'closed'; priority: string }]
  cancel: []
}>()

const title = ref('')
const description = ref('')
const status = ref<'open' | 'in_progress' | 'closed'>('open')
const priority = ref('medium')
const errors = ref<{ title?: string; status?: string }>({})

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const validate = () => {
  const newErrors: { title?: string; status?: string } = {}

  if (!title.value.trim()) {
    newErrors.title = 'Title is required'
  } else if (title.value.length < 3) {
    newErrors.title = 'Title must be at least 3 characters'
  } else if (title.value.length > 100) {
    newErrors.title = 'Title must not exceed 100 characters'
  }

  if (!status.value) {
    newErrors.status = 'Status is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = () => {
  if (!validate()) {
    return
  }

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    status: status.value,
    priority: priority.value
  })
}

watch(() => props.ticket, (newTicket) => {
  if (newTicket) {
    title.value = newTicket.title
    description.value = newTicket.description || ''
    status.value = newTicket.status
    priority.value = newTicket.priority || 'medium'
  } else {
    title.value = ''
    description.value = ''
    status.value = 'open'
    priority.value = 'medium'
  }
}, { immediate: true })
</script>