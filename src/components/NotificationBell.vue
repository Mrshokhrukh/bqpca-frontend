<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click.stop="toggleNotifications"
      class="relative p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
    >
      <Bell
        class="h-6 w-6 text-slate-600 transition-transform duration-200 group-hover:rotate-12"
        :class="{ 'text-primary': hasUnread }"
      />

      <!-- Notification Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium text-white bg-primary rounded-full"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notification Panel -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-[99999999]"
      v-click-outside="() => (showNotifications = false)"
    >
      <!-- Header -->
      <div
        class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between"
      >
        <h3 class="font-medium text-slate-800">Notifications</h3>
        <button
          @click="markAllAsRead"
          class="text-xs text-primary hover:text-primary-dark transition-colors"
          :disabled="!hasUnread"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notification List -->
      <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
        <div v-if="loading" class="p-4 text-center text-slate-500">
          <Loader2 class="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading notifications...
        </div>

        <template v-else>
          <div v-if="notifications.length === 0" class="p-8 text-center text-slate-500">
            <BellOff class="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>

          <template v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50/50': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 mt-1">
                  <component
                    :is="getNotificationIcon(notification.type)"
                    class="h-5 w-5"
                    :class="getNotificationIconColor(notification.type)"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900">{{ notification.title }}</p>
                  <p class="text-sm text-slate-500 mt-0.5">{{ notification.message }}</p>
                  <p class="text-xs text-slate-400 mt-1">
                    {{ formatTimestamp(notification.timestamp) }}
                  </p>
                </div>
                <button
                  v-if="!notification.read"
                  @click.stop="markAsRead(notification.id)"
                  class="p-1 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <Check class="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
          </template>
        </template>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center">
        <button
          class="text-sm text-primary hover:text-primary-dark transition-colors"
          @click="viewAllNotifications"
        >
          View all notifications
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Bell,
  BellOff,
  Loader2,
  Check,
  CircleAlert,
  CheckCircle2,
  Info,
  AlertTriangle,
} from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import apiService from '@/services/services'

// State
const notifications = ref([])
const showNotifications = ref(false)
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
let pollingInterval = null // To hold the interval ID

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter((n) => n.status === 'UNREAD').length
})

const hasUnread = computed(() => unreadCount.value > 0)

// --- NEW POLLING LOGIC ---
const fetchNotifications = async () => {
  if (!authStore.isAuthenticated) {
    return
  }

  loading.value = true
  try {
    const params = {
      cid: authStore.user.cid, // 'username' holds the CID
      service_type: authStore.user.service_type,
    }
    const response = await apiService.getNotifications(params)
    notifications.value = response.data.results || []
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
  } finally {
    loading.value = false
  }
}

const startPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
  fetchNotifications()
  pollingInterval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
}

const stopPolling = () => {
  clearInterval(pollingInterval)
}

// Watch for route changes to trigger a fetch
watch(
  () => route.fullPath,
  () => {
    fetchNotifications()
  }
)

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  if (authStore.isAuthenticated) {
    startPolling()
  }
})

onBeforeUnmount(() => {
  stopPolling()
})

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchNotifications() // Fetch fresh data when opening
  }
}

const markAsRead = async (id) => {
  try {
    await apiService.markNotificationAsRead(id)
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.status = 'READ'
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await apiService.markAllNotificationsAsRead()
    notifications.value.forEach((n) => (n.status = 'READ'))
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

const handleNotificationClick = (notification) => {
  if (notification.status !== 'READ') {
    markAsRead(notification.id)
  }
  if (notification.link) {
    router.push(notification.link)
  }
  showNotifications.value = false
}

const viewAllNotifications = () => {
  router.push('/admin/notifications') // Assuming you will create this page
  showNotifications.value = false
}

// Helper Functions
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

const getNotificationIcon = (type) => {
  const icons = {
    success: CheckCircle2,
    error: CircleAlert,
    warning: AlertTriangle,
    info: Info,
  }
  return icons[type] || Info
}

const getNotificationIconColor = (type) => {
  const colors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }
  return colors[type] || colors.info
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
</style>
