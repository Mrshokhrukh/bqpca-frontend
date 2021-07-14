<template>
  <div class="text-center py-16 px-4">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
      <InboxIcon class="w-8 h-8 text-gray-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900">No Institutes Found</h3>
    <p class="mt-2 text-sm text-gray-500 max-w-md mx-auto">
      No institutes match your current search criteria. Try adjusting your filters or search terms.
    </p>
  </div>
</template>

<script setup>
import { InboxIcon } from 'lucide-vue-next'
</script>
