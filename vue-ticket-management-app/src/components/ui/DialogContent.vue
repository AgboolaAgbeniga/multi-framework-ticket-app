<template>
  <div :class="cn('relative flex w-full flex-col rounded-lg border bg-background p-6 shadow-lg duration-200 gap-4 max-w-[calc(100%-2rem)] sm:max-w-lg', $attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from './utils'
</script>