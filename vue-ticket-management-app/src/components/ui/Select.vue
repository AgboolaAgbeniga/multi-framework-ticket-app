<template>
  <Listbox v-model="selectedValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="relative">
      <ListboxButton
        :class="cn(
          'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-input-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          $attrs.class as string
        )"
      >
        <span v-if="selectedValue">{{ getLabel(selectedValue) }}</span>
        <span v-else class="text-muted-foreground">{{ placeholder }}</span>
        <ChevronDown class="h-4 w-4 opacity-50" />
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions class="absolute z-50 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          <ListboxOption
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            v-slot="{ active, selected }"
            as="template"
          >
            <li
              :class="cn(
                'relative cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none',
                active && 'bg-accent text-accent-foreground',
                selected && 'font-medium'
              )"
            >
              {{ option.label }}
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from './utils'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue?: string
  options: Option[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})

const getLabel = (value: string) => {
  const option = props.options.find(opt => opt.value === value)
  return option?.label || value
}
</script>