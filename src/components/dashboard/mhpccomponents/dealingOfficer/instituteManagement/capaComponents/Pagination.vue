<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    v-if="totalPages > 1"
    class="flex justify-between items-center py-4 px-6 border-t border-gray-200 bg-gray-50"
  >
    <div class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</div>
    <div class="flex space-x-2">
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ChevronLeftIcon class="w-4 h-4 mr-1" />
        Prev
      </button>
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
        <ChevronRightIcon class="w-4 h-4 ml-1" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

defineEmits(['page-change'])
</script>
