<template>
  <Card class="p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-slate-600 text-sm mb-1">{{ title }}</p>
        <p class="text-3xl">{{ value }}</p>
      </div>
      <div :class="`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`">
        <component :is="icon" :class="`w-6 h-6 ${iconColor}`" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue'

interface Props {
  title: string
  value: number
  icon: any
  iconColor: string
  iconBgColor: string
}

defineProps<Props>()
</script>