<template>
  <div>
    <!-- The label for the input field. It connects to the input via the 'for' attribute. -->
    <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <!-- A red asterisk is shown if the field is required -->
      <span v-if="required" class="text-red-500"> *</span>
    </label>

    <!-- The main input element -->
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :required="required"
      :readonly="readonly"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 p-3',
        { 'bg-gray-100 cursor-not-allowed': readonly },
      ]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// This defines all the properties (props) that the component can accept from its parent.
const props = defineProps({
  // The 'v-model' value passed from the parent component.
  modelValue: {
    type: [String, Number],
    default: '',
  },
  // The text displayed in the label.
  label: {
    type: String,
    required: true,
  },
  // The input type (e.g., 'text', 'email', 'number').
  type: {
    type: String,
    default: 'text',
  },
  // Whether the input is required.
  required: {
    type: Boolean,
    default: false,
  },
  // Whether the input should be read-only.
  readonly: {
    type: Boolean,
    default: false,
  },
  // Placeholder text for the input.
  placeholder: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])

// Creates a unique ID for the input field based on its label to connect them for accessibility.
const inputId = computed(() => {
  return `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`
})
</script>
