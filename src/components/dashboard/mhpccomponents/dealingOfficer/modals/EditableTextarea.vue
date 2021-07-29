<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="!isEditing"
      rows="3"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
    ></textarea>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  label: String,
  modelValue: String,
  isEditing: Boolean,
})

defineEmits(['update:modelValue'])
</script>
