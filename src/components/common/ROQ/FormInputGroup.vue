<template>
  <div>
    <label :for="inputId" class="block text-sm font-medium text-slate-600 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <div
        v-if="icon && isEditing"
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
      >
        <component :is="lucideIcons[icon]" class="h-5 w-5 text-slate-400" aria-hidden="true" />
      </div>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :disabled="!isEditing"
        class="block w-full border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
        :class="[
          isEditing
            ? 'bg-white py-2.5'
            : 'bg-slate-50 text-slate-700 py-3 cursor-default border-slate-200',
          icon && isEditing ? 'pl-10' : 'px-3.5',
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as lucideIcons from 'lucide-vue-next' // Import all for dynamic :is

const props = defineProps({
  modelValue: [String, Number, Date],
  label: String,
  type: { type: String, default: 'text' },
  required: Boolean,
  isEditing: Boolean,
  icon: String, // Name of the lucide icon
})
defineEmits(['update:modelValue'])
const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script>
