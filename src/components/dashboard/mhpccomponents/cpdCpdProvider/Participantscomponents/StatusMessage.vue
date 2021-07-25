<template>
  <transition name="fade">
    <div
      v-if="message"
      :class="[
        'mt-6 p-4 rounded-lg flex items-center',
        type === 'success'
          ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
          : 'bg-red-50 text-red-700 border-l-4 border-red-500',
      ]"
    >
      <component
        :is="type === 'success' ? CheckCircleIcon : ExclamationCircleIcon"
        class="h-5 w-5 mr-3"
      />
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value),
  },
})

defineEmits(['close'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
