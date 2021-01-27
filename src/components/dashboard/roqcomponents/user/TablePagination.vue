<template>
  <div class="px-4 py-3 border-t border-gray-200">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-700">
        Showing {{ startIndex }} to {{ visibleEndIndex }} of {{ totalResults }} results
      </p>
      <div class="flex space-x-2">
        <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === 1"
          @click="$emit('page-change', currentPage - 1)">
          Previous
        </button>
        <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage >= totalPages"
          @click="$emit('page-change', currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalResults: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    default: 10,
  },
});

defineEmits(['page-change']);

const startIndex = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1;
});

const visibleEndIndex = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.totalResults);
});

const totalPages = computed(() => {
  return Math.ceil(props.totalResults / props.perPage);
});
</script>
