<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center transition-colors duration-200 group p-2 rounded-md hover:bg-indigo-50"
  >
    <FileText class="w-5 h-5 mr-2 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
    <span class="text-sm font-medium">{{ label }}</span>
  </a>
</template>

<script setup>
import { FileText } from 'lucide-vue-next'

defineProps({
  href: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>
