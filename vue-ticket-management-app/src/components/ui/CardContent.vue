<template>
  <div :class="cn('px-6 [&:last-child]:pb-6', $attrs.class as string)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from './utils'
</script>