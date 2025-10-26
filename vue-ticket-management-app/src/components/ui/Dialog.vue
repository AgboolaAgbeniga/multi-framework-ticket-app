<template>
  <Teleport to="body">
    <TransitionRoot appear :show="open" as="template">
      <Dialog as="div" :class="cn('relative z-50', $attrs.class as string)" @close="$emit('close')">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" @click="$emit('close')" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-[calc(100%-2rem)] transform overflow-hidden rounded-lg bg-background text-left align-middle shadow-lg transition-all border sm:max-w-lg">
                <slot />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { cn } from './utils'

interface Props {
  open: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>