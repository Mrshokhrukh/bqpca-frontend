<template>
  <Transition name="modal-fade">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop with modern blur effect -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <!-- Modal with improved animations and styling -->
      <div
        class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 m-4 transform transition-all"
        role="dialog" aria-labelledby="modal-title" @click.stop>
        <!-- Modern close button -->
        <button @click="closeModal"
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          aria-label="Close modal">
          <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Enhanced header section -->
        <div class="mb-8">
          <h2 id="modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">
            Award CPD Credits
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the number of credits to award to the user
          </p>
        </div>

        <!-- Improved form with better validation -->
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="space-y-2">
            <label for="credits" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Credits
            </label>
            <div class="relative">
              <input id="credits" v-model.number="credits" type="number" step="0.5" min="0" required
                class="block w-full px-4 py-3 rounded-xl border-2 bg-transparent transition-all duration-200 ease-in-out
                         focus:ring-2 focus:ring-offset-2 focus:outline-none
                         dark:text-white placeholder-gray-400
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" :class="{
      'border-gray-200 hover:border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:hover:border-gray-600': !error,
      'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700': error
    }" placeholder="0.0">
              <!-- Credit indicator -->
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                credits
              </div>
            </div>
            <TransitionGroup name="error-fade">
              <p v-if="error" key="error" class="text-sm text-red-500 mt-1 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ error }}
              </p>
            </TransitionGroup>
          </div>

          <!-- Enhanced button group -->
          <div class="flex gap-4 mt-8">
            <button type="button" @click="closeModal" class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700
                       text-gray-700 dark:text-gray-300 font-medium
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                       transition-all duration-200">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium
                       hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition-all duration-200">
              Award Credits
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

// Define props and emits
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'award'])

// Reactive state
const credits = ref(0)
const error = ref('')

// Watch for changes in `isVisible` prop
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    credits.value = 0
    error.value = ''
  }
})

// Handle form submission
const handleSubmit = () => {
  if (credits.value <= 0) {
    error.value = 'Please enter a valid number of credits'
    return
  }

  emit('award', credits.value)
  closeModal()
}

// Close the modal
const closeModal = () => {
  emit('close')
}
</script>
<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
