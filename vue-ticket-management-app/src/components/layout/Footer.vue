<template>
  <footer class="bg-slate-900 text-slate-300 mt-auto">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src="/logo_footer.png" alt="TicketFlex Logo" class="h-8 w-auto mb-4" />
          <p class="text-sm">
            Streamline your support workflow with our powerful ticket management system.
          </p>
        </div>

        <div>
          <h4 class="text-white mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/" class="hover:text-white transition-colors">Home</a></li>
            <li><a href="/auth/login" class="hover:text-white transition-colors">Login</a></li>
            <li><a href="/dashboard" class="hover:text-white transition-colors">Dashboard</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white mb-4">Contact</h4>
          <p class="text-sm">
            Email: hngsupport@ticketflex.com<br />
            Phone: (+234) 8105027009
          </p>
        </div>
      </div>

      <div class="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
        <p>&copy; {{ currentYear }} TicketFlex. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>