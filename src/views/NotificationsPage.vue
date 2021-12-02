<template>
  <!-- Use a lighter background for the whole page -->
  <div class="min-h-screen bg-slate-50">
    <div class="px-4 py-8 mx-auto sm:px-6 lg:px-8">
      
      <!-- Page Header -->
      <header class="pb-6 mb-6 border-b border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
            <p class="mt-1 text-sm text-slate-500">
              Manage and view all your notifications in one place.
            </p>
          </div>
          <button
            @click="handleMarkAllAsRead"
            :disabled="!hasUnread"
            class="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-md shadow-sm bg-primary hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main>
        <!-- Loading State -->
        <div v-if="loading" class="py-24 text-center text-slate-500">
          <Loader2 class="w-10 h-10 mx-auto mb-3 animate-spin" />
          <p class="text-lg font-medium">Loading Notifications...</p>
        </div>

        <template v-else>
          <!-- Empty State -->
          <div v-if="sortedNotifications.length === 0" class="py-24 text-center bg-white border border-dashed rounded-lg border-slate-300">
            <BellOff class="w-12 h-12 mx-auto text-slate-400" />
            <h3 class="mt-4 text-lg font-semibold text-slate-800">No Notifications Yet</h3>
            <p class="mt-1 text-sm text-slate-500">When you get new notifications, they will show up here.</p>
          </div>

          <!-- Notifications List -->
          <div v-else class="space-y-3">
            <NotificationItem
              v-for="notification in sortedNotifications"
              :key="notification.id"
              :notification="notification"
              class="bg-white border rounded-lg shadow-sm border-slate-200"
              @click="handleNotificationClick"
            />
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import NotificationItem from '@/components/NotificationItem.vue'
import { BellOff, Loader2 } from 'lucide-vue-next'

// State
const notifications = ref([])
const loading = ref(true)
const authStore = useAuthStore()
const router = useRouter()

// Computed Properties
const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const hasUnread = computed(() => notifications.value.some(n => !n.read_status))

// --- METHODS ---

const fetchNotifications = async () => {
  loading.value = true
  try {
    // ***FIX***: Use 'username' for consistency with other components.
    // Your API seems to accept 'cid' but using 'username' is safer if that's what your authStore provides.
    const params = {
      cid: authStore.user.cid, // or authStore.user.cid if that is the correct field
      service_type: authStore.serviceType,
    }
    const response = await apiService.getNotifications(params)
    
    // ***CRITICAL FIX***: Map the API response to the format our component expects.
    notifications.value = (response.data.results || []).map(n => ({
      id: n.id,
      title: n.title, // API response doesn't have this, so it will be undefined. Our component handles this.
      message: n.message,
      link: n.link,
      created_at: n.created_at,
      // Convert API's "READ"/"UNREAD" status to a boolean `read_status`
      read_status: n.status === 'READ', 
      // Provide a default notification type if the API doesn't send one
      notification_type: n.notification_type || 'INFO', 
    }));

  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    notifications.value = [] // Clear notifications on error
  } finally {
    loading.value = false
  }
}

const handleNotificationClick = async (notification) => {
  if (!notification.read_status) {
    const found = notifications.value.find(n => n.id === notification.id);
    if(found) found.read_status = true;
    try {
      await apiService.markNotificationAsRead(notification.id)
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      if(found) found.read_status = false; 
    }
  }
  
  // if (notification.link) {
  //   router.push(notification.link)
  // }
}

const handleMarkAllAsRead = async () => {
  notifications.value.forEach(n => n.read_status = true)
  try {
     await apiService.markAllNotificationsAsRead({
        username: authStore.user.username,
        service_type: authStore.serviceType,
    })
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    fetchNotifications();
  }
}

// Lifecycle Hook
onMounted(fetchNotifications)
</script>