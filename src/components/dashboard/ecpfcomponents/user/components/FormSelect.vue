<template>
    <div>
      <label :for="selectId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <select
        :id="selectId"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select an option</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  })
  
  const selectId = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
  
  defineEmits(['update:modelValue'])
  </script>