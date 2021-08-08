<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="!isEditing"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
    />
  </div>
</template>

<script setup>

defineProps({
  label: String,
  modelValue: [String, Number],
  isEditing: Boolean,
  type: {
    type: String,
    default: 'text',
  },
})

defineEmits(['update:modelValue'])
</script>
