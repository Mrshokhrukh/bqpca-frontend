<template>
  <div
    :class="[
      'px-8 py-6 border-b relative overflow-hidden',
      {
        'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
        'bg-green-50 border-green-100': overallStatus === 'Approved',
        'bg-red-50 border-red-100': overallStatus === 'Regretted',
      },
    ]"
  >
    <div class="flex items-center justify-between relative z-10">
      <div class="flex items-center space-x-4">
        <div class="p-3 bg-white rounded-lg shadow-sm">
          <FileText class="h-7 w-7 text-gray-700" />
        </div>
        <div>
          <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
            Application Details
          </DialogTitle>
          <p class="text-sm text-gray-600 mt-1">Review and manage application information</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span
          :class="[
            'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
            {
              'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
              'bg-green-100 text-green-800': overallStatus === 'Approved',
              'bg-red-100 text-red-800': overallStatus === 'Regretted',
            },
          ]"
        >
          <Circle
            class="h-4 w-4"
            :class="{
              'text-yellow-500': overallStatus === 'Pending',
              'text-green-500': overallStatus === 'Approved',
              'text-red-500': overallStatus === 'Regretted',
            }"
          />
          <span>{{ overallStatus }}</span>
        </span>
        <button
          type="button"
          class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
          @click="$emit('close')"
        >
          <span class="sr-only">Close</span>
          <X class="h-6 w-6" />
        </button>
      </div>
    </div>
    <!-- Decorative pattern -->
    <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
      <div class="transform rotate-45">
        <FileText class="h-32 w-32" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { DialogTitle } from '@headlessui/vue'
import { FileText, Circle, X } from 'lucide-vue-next'

defineProps({
  overallStatus: String,
})
defineEmits(['close'])
</script>
