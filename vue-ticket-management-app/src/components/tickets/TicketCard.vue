<template>
  <Card class="p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="mb-2">{{ ticket.title }}</h3>
        <div class="flex flex-wrap gap-2">
          <Badge variant="outline" :class="statusInfo.className">
            {{ statusInfo.label }}
          </Badge>
          <Badge v-if="priorityInfo" variant="outline" :class="priorityInfo.className">
            {{ priorityInfo.label }}
          </Badge>
        </div>
      </div>
    </div>

    <p
      v-if="ticket.description"
      class="text-slate-600 text-sm mb-4 overflow-hidden"
      :style="{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }"
    >
      {{ ticket.description }}
    </p>

    <div class="flex items-center justify-between pt-4 border-t border-slate-100">
      <div class="flex flex-col gap-1 text-sm text-slate-500">
        <div class="flex items-center gap-1" :title="getDetailedDateTime(ticket.createdAt)">
          <Clock class="w-4 h-4" />
          <span>Created {{ formatDateTime(ticket.createdAt) }}</span>
        </div>
        <div
          v-if="ticket.updatedAt && ticket.updatedAt !== ticket.createdAt"
          class="flex items-center gap-1"
          :title="getDetailedDateTime(ticket.updatedAt)"
        >
          <Clock class="w-4 h-4 text-primary" />
          <span class="text-primary">
            Updated {{ formatDateTime(ticket.updatedAt) }}
          </span>
        </div>
      </div>

      <div class="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          @click="$emit('edit', ticket)"
        >
          <Edit class="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          @click="$emit('delete', ticket)"
          class="text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <Trash2 class="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Edit, Trash2, Clock } from 'lucide-vue-next'
import Card from '../ui/Card.vue'
import Badge from '../ui/Badge.vue'
import Button from '../ui/Button.vue'
import { formatDateTime, getDetailedDateTime } from '../../lib/dateUtils'
import type { Ticket } from '../../lib/types'

interface Props {
  ticket: Ticket
}

const props = defineProps<Props>()

defineEmits<{
  edit: [ticket: Ticket]
  delete: [ticket: Ticket]
}>()

const statusConfig = {
  open: { label: 'Open', className: 'bg-green-100 text-green-800 border-green-200' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-800 border-slate-200' }
}

const priorityConfig = {
  low: { label: 'Low', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  medium: { label: 'Medium', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  high: { label: 'High', className: 'bg-red-100 text-red-800 border-red-200' }
}

const statusInfo = computed(() => statusConfig[props.ticket.status as keyof typeof statusConfig])
const priorityInfo = computed(() => props.ticket.priority ? priorityConfig[props.ticket.priority as keyof typeof priorityConfig] : null)
</script>