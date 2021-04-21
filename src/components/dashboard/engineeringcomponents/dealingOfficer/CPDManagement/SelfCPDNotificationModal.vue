<template>
  <Transition name="notification">
    <div
      v-if="notification.show"
      :class="[
        'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
        notification.type === 'success'
          ? 'bg-green-50 border-l-4 border-green-500'
          : notification.type === 'error'
            ? 'bg-red-50 border-l-4 border-red-500'
            : 'bg-blue-50 border-l-4 border-blue-500',
      ]"
    >
      <div
        :class="[
          'flex-shrink-0 w-6 h-6',
          notification.type === 'success'
            ? 'text-green-500'
            : notification.type === 'error'
              ? 'text-red-500'
              : 'text-blue-500',
        ]"
      >
        <svg
          v-if="notification.type === 'success'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          v-else-if="notification.type === 'error'"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="ml-3">
        <h3
          :class="[
            'text-sm font-medium',
            notification.type === 'success'
              ? 'text-green-800'
              : notification.type === 'error'
                ? 'text-red-800'
                : 'text-blue-800',
          ]"
        >
          {{ notification.title }}
        </h3>
        <p
          :class="[
            'text-sm mt-1',
            notification.type === 'success'
              ? 'text-green-700'
              : notification.type === 'error'
                ? 'text-red-700'
                : 'text-blue-700',
          ]"
        >
          {{ notification.message }}
        </p>
      </div>
      <button @click="$emit('close-notification')" class="ml-4 text-gray-500 hover:text-gray-600">
        <span class="sr-only">Close</span>
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

defineEmits(['close-notification'])
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
