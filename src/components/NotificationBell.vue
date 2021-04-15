<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleNotifications"
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
      class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '@/stores/authStore'; // Import your authStore
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
import apiService from '@/services/services' // If you have an apiService setup (recommended)

// State
const notifications = ref([])
const showNotifications = ref(false)
const loading = ref(false)
const socket = ref(null)
const router = useRouter()
// const authStore = useAuthStore(); // Use authStore

// **Service Type Mapping**
// const serviceTypeMap = {
//   roq: 'recognition_of_qualification',
//   ecpf: 'education_consultancy_placement_firm',
//   accreditation: 'specification_for_institute_accrediation',
//   engineering: 'specification_for_engineering_certification',
//   engineering_certification: 'specification_for_engineering_certification',
//   health_certification: 'specification_for_health_certification',
// };

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

const hasUnread = computed(() => unreadCount.value > 0)

// WebSocket Setup
// const setupWebSocket = () => {
//   if (!authStore.serviceType) {
//     console.warn("Service type not available. WebSocket not initialized.");
//     return;
//   }

//   const backendAppName = serviceTypeMap[authStore.serviceType];

//   if (!backendAppName) {
//     console.error(`No backend app name mapping found for service type: ${authStore.serviceType}`);
//     return; // Or handle the error appropriately, maybe default to a public channel
//   }

//   const wsChannel = backendAppName.replace(/_/g, '_'); // backend app names are already good for channel. if not replace with '-' to '_'
//   const wsUrl = `ws://127.0.0.1:8000/ws/notifications/${wsChannel}/`;
//   socket.value = new WebSocket(wsUrl);

//   socket.value.onmessage = () => {
//     fetchNotifications(); // Re-fetch notifications when any event occurs
//   };

//   socket.value.onclose = () => {
//     // Attempt to reconnect after 30 minutes
//     setTimeout(setupWebSocket, 1800000);
//   };

//   socket.value.onerror = (error) => {
//     console.error('WebSocket error:', error);
//   };
// };

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value && !notifications.value.length) {
    fetchNotifications()
  }
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    // **Fetch notifications using API - No email needed if backend uses token auth**
    const response = await apiService.getNotificationn()
    notifications.value = response.data || [] // Assuming your API response has 'results' array
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    // Handle error appropriately, maybe show a toast notification to the user
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id) => {
  try {
    await apiService.markNotificationAsRead(id)
    const notification = notifications.value.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await apiService.markAllNotificationsAsRead()
    notifications.value = notifications.value.map((n) => ({ ...n, read: true }))
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
  if (notification.link) {
    router.push(notification.link)
  }
  showNotifications.value = false
}

const viewAllNotifications = () => {
  router.push('/notifications')
  showNotifications.value = false
}

// Helper Functions (remain the same)
const formatTimestamp = (timestamp) => {
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

// Lifecycle Hooks
onMounted(() => {
  // Initialize auth first to get serviceType reliably
  // authStore.initializeAuth(); // Make sure auth is initialized
  // if (authStore.serviceType) {
  //   setupWebSocket();
  // } else {
  console.warn('Service type not yet available on mount. WebSocket setup deferred.')
})

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.close()
  }
})
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
