<template>
  <div>
    <label :for="selectId" class="block text-sm font-medium text-slate-600 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :disabled="!isEditing"
        class="block w-full px-3.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none text-sm"
        :class="[
          isEditing
            ? 'bg-white py-2.5'
            : 'bg-slate-50 text-slate-700 py-3 cursor-default border-slate-200',
        ]"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <div
        v-if="isEditing"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
      >
        <ChevronDown class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
const props = defineProps({
  modelValue: String,
  label: String,
  required: Boolean,
  isEditing: Boolean,
  options: Array, // e.g., [{ value: 'male', text: 'Male' }]
})
defineEmits(['update:modelValue'])
const selectId = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script>
