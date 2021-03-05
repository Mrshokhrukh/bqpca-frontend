<template>
  <div class="bg-gray-50 rounded-lg p-4 flex items-start space-x-3">
    <component :is="iconComponents[icon]" class="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
    <div>
      <p class="text-xs font-medium text-gray-500">{{ label }}</p>
      <p class="text-sm text-gray-900 mt-1">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  FileCheck, Hash, Calendar, Clock, FileText
} from 'lucide-vue-next'

defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: 'N/A'
  }
})

const iconComponents = {
  FileCheck,
  Hash,
  Calendar,
  Clock,
  FileText
}
</script>
