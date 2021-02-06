<template>
    <div>
      <label :for="inputId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        :disabled="disabled"
      />
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
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })
  
  const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
  
  defineEmits(['update:modelValue'])
  </script>