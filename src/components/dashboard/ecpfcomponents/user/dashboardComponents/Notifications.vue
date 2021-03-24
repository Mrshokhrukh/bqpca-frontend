<!-- eslint-disable vue/multi-word-component-names -->
<!-- ./dashboardComponents/Notifications.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-xl p-6 col-span-1 md:col-span-2 border border-gray-100 transition-all duration-300">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center">
        <span class="mr-3 bg-indigo-100 text-indigo-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </span>
        Notifications
      </h2>
      <div class="flex items-center">
        <span v-if="unreadCount > 0"
          class="bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
        <div class="relative">
          <button class="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <transition-group name="notification-list" tag="div" v-if="notifications.length > 0">
      <div v-for="notification in sortedNotifications" :key="notification.id"
        class="mb-4 hover:bg-gray-50 p-3 rounded-lg transition-all duration-200 relative group"
        :class="notification.read ? 'opacity-75' : ''">
        <div class="flex items-start">
          <div class="mr-3 mt-1">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="getNotificationBackground(notification.type)">
              <component :is="getNotificationIcon(notification.type)" class="w-4 h-4"
                :class="getNotificationIconColor(notification.type)" />
            </div>
          </div>

          <div class="flex-1">
            <div class="flex justify-between">
              <p class="text-sm font-medium" :class="getNotificationClass(notification.type)">
                {{ notification.message }}
              </p>
              <button v-if="!notification.read" @click="$emit('mark-read', notification.id)"
                class="text-gray-400 hover:text-gray-600 focus:outline-none invisible group-hover:visible transition-all"
                title="Mark as read">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <div class="flex items-center mt-1">
              <span class="text-xs text-gray-500">{{ formatTimestamp(notification.timestamp) }}</span>
              <span v-if="isNew(notification.timestamp)"
                class="ml-2 bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">New</span>
            </div>

            <div class="mt-2 flex" v-if="notification.link">
              <a :href="notification.link"
                class="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                <span>View</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <div v-else
      class="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <p class="text-gray-500 font-medium">No new notifications</p>
      <p class="text-gray-400 text-sm mt-1">We'll notify you when something important happens</p>
    </div>

    <div class="mt-6 flex justify-between items-center" v-if="notifications.length > 0">
      <button @click="$emit('mark-all-read')"
        class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        Mark All as Read
      </button>

      <button @click="$emit('view-all')"
        class="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center">
        View All
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, ShieldExclamationIcon
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
});

 defineEmits(['mark-all-read', 'mark-read', 'view-all']);

// Calculate the number of unread notifications
const unreadCount = computed(() => {
  return props.notifications.filter(notification => !notification.read).length;
});

// Sort notifications by timestamp (newest first)
const sortedNotifications = computed(() => {
  return [...props.notifications].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
});

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircleIcon;
    case 'warning': return ExclamationTriangleIcon;
    case 'info': return InformationCircleIcon;
    case 'error': return ShieldExclamationIcon;
    default: return BellIcon;
  }
};

const getNotificationBackground = (type) => {
  switch (type) {
    case 'success': return 'bg-green-100';
    case 'warning': return 'bg-yellow-100';
    case 'info': return 'bg-blue-100';
    case 'error': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
};

const getNotificationIconColor = (type) => {
  switch (type) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'info': return 'text-blue-600';
    case 'error': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getNotificationClass = (type) => {
  switch (type) {
    case 'success': return 'text-green-700';
    case 'warning': return 'text-yellow-700';
    case 'info': return 'text-blue-700';
    case 'error': return 'text-red-700';
    default: return 'text-gray-700';
  }
};

// Format timestamp to a more readable format
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  }
};

// Check if notification is new (less than 1 hour old)
const isNew = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  return diffInMinutes < 60;
};
</script>

<style scoped>
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.5s ease;
}

.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>