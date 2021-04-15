<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <!-- Modal Container -->
        <div
          class="relative bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all"
          @click.stop
        >
          <!-- Modal Header with Icon -->
          <div class="p-6 pb-2">
            <div class="flex items-center space-x-3 mb-2">
              <div class="p-2 bg-blue-50 rounded-lg">
                <UserCheck class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900">Confirm Registration Type</h3>
            </div>

            <!-- Selection Info -->
            <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p class="text-sm text-gray-600 mb-2">You have selected:</p>
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white rounded-lg border border-gray-200">
                  <UserCircle v-if="selectedType === 'CID Holder'" class="w-5 h-5 text-blue-600" />
                  <Users v-else class="w-5 h-5 text-blue-600" />
                </div>
                <span class="font-medium text-gray-900">{{ selectedType }}</span>
              </div>
            </div>

            <!-- Information Text -->
            <p class="mt-4 text-sm text-gray-600 leading-relaxed">
              Please confirm your selection. This will determine the registration form fields and
              required documents.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="p-6 pt-2 flex flex-col sm:flex-row-reverse gap-3">
            <button
              class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors flex items-center justify-center space-x-2"
              @click="$emit('proceed')"
            >
              <span>Confirm Selection</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            <button
              class="w-full sm:w-auto px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-colors flex items-center justify-center space-x-2"
              @click="$emit('close')"
            >
              <XCircle class="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>

          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg p-1"
            @click="$emit('close')"
          >
            <span class="sr-only">Close</span>
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { UserCheck, UserCircle, Users, ArrowRight, XCircle, X } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  selectedType: String,
})

defineEmits(['close', 'proceed'])
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
