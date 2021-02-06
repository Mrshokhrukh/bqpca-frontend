<template>
    <div>
      <label :for="textareaId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <textarea
        :id="textareaId"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        rows="4"
      ></textarea>
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
      type: String,
      default: ''
    }
  })
  
  const textareaId = computed(() => `textarea-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
  
  defineEmits(['update:modelValue'])
  </script>