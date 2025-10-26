<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
    <Sonner />
  </div>
</template>

<script setup lang="ts">
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import Sonner from './components/ui/Sonner.vue'
</script>