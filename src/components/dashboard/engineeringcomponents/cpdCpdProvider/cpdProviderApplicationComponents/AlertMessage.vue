// 3. AlertMessage.vue
<template>
  <div v-if="messages.length > 0" :class="alertClass">
    <h3 v-if="type === 'error'" class="font-bold">Please fix the following errors:</h3>
    <ul v-if="type === 'error'" class="list-disc pl-5 mt-2">
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
    <p v-else>{{ messages[0] }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'error', // or 'success'
  },
})

const alertClass = computed(() => {
  return props.type === 'error'
    ? 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
    : 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'
})
</script>
