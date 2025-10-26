<template>
  <Toaster
    theme="light"
    class="toaster group"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    }"
  />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>