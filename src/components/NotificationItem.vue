<template>
  <div
    class="p-4 transition-colors cursor-pointer group"
    :class="notification.read_status ? 'hover:bg-slate-50' : 'bg-primary/5 hover:bg-primary/10'"
    @click="$emit('click', notification)"
  >
    <div class="flex items-start space-x-4">
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <component
          :is="getNotificationIcon(notification.notification_type)"
          class="w-6 h-6"
          :class="getNotificationIconColor(notification.notification_type)"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Use title if it exists, otherwise use the message as the main text -->
        <p class="text-sm font-medium text-slate-800">{{ notification.title || notification.message }}</p>
        <!-- Only show message if a title was present -->
        <p v-if="notification.title" class="mt-1 text-sm text-slate-500">{{ notification.message }}</p>
        <p class="mt-1.5 text-xs text-slate-400 group-hover:text-slate-600 transition">
          {{ formatTimestamp(notification.created_at) }}
        </p>
      </div>

      <!-- Unread Indicator -->
      <div v-if="!notification.read_status" class="flex-shrink-0 mt-1.5">
         <div class="w-2.5 h-2.5 rounded-full bg-primary" title="Unread"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert, CheckCircle2, Info, AlertTriangle } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'

defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

// Helper Functions
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

const getNotificationIcon = (type) => {
  const icons = {
    SUCCESS: CheckCircle2,
    ERROR: CircleAlert,
    WARNING: AlertTriangle,
    INFO: Info,
  }
  return icons[type] || Info
}

const getNotificationIconColor = (type) => {
  const colors = {
    SUCCESS: 'text-green-500',
    ERROR: 'text-red-500',
    WARNING: 'text-yellow-500',
    INFO: 'text-blue-500',
  }
  return colors[type] || colors.INFO
}
</script>