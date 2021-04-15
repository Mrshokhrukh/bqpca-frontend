<template>
  <Transition name="modal" appear>
    <div class="fixed z-50 inset-0 overflow-y-auto backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
        :class="{ 'scale-100 opacity-100': showModal, 'scale-95 opacity-0': !showModal }">
        <!-- Modal Header with Accent Border -->
        <div class="border-t-4 border-blue-500 rounded-t-xl"></div>

        <!-- Modal Content -->
        <div class="p-6">
          <!-- Icon and Title -->
          <div class="flex items-start mb-4">
            <div class="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
              <AlertCircleIcon class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900">Confirmation Required</h3>
              <p class="mt-2 text-gray-600">{{ message }}</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-200 my-4"></div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end gap-3">
            <button @click="$emit('cancel')"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button @click="confirm"
              class="px-5 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { AlertCircleIcon } from 'lucide-vue-next';

defineProps({
  message: {
    type: String,
    required: true
  }
});

const showModal = computed(() => true);
const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm', true);
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: all 0.3s ease-out;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95);
}
</style>
