<!-- src/components/SimpleModal.vue -->
<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 px-4" @click.self="emit('close')">
        <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div v-if="isOpen" class="bg-white rounded-lg shadow-xl transform overflow-hidden max-w-lg w-full">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900">{{ title }}</h2>
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1 -mr-1">
                  <span class="sr-only">Close</span>
                  <!-- X Mark Icon (Heroicons) -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="px-6 py-5">
              <!-- Slot for modal content -->
              <slot></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Modal Title',
  },
});

const emit = defineEmits(['close']);
</script>

<!-- No <style scoped> block needed -->
