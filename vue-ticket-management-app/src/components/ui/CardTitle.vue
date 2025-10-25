<template>
  <h4 :class="cn('leading-none', $attrs.class as string)">
    <slot />
  </h4>
</template>

<script setup lang="ts">
import { cn } from './utils'
</script>