<template>
  <div :class="cn('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', $attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from './utils'
</script>