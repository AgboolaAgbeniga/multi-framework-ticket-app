<template>
  <div :class="cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border', $attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from './utils'
</script>