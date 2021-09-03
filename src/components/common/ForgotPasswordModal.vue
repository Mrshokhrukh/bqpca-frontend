<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md transform transition-all">
          <!-- Modal Card -->
          <div class="bg-white rounded-lg shadow-xl border border-gray-100">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ emailSent ? 'Check Your Email' : 'Reset Password' }}
              </h3>
              <button
                @click="closeModal"
                class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="px-6 py-6">
              <Transition name="fade" mode="out-in">
                <!-- Form State -->
                <form v-if="!emailSent" @submit.prevent="handlePasswordResetRequest" key="form">
                  <div class="space-y-5">
                    <p class="text-sm text-gray-600">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        v-model="email"
                        required
                        placeholder="Enter your email"
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm
                               placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:border-blue-500 transition-colors duration-200"
                      />
                    </div>

                    <button
                      type="submit"
                      :disabled="isLoading"
                      class="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                             focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed
                             text-white font-medium rounded-md transition-colors duration-200"
                    >
                      <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                           fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
                    </button>
                  </div>
                </form>

                <!-- Success State -->
                <div v-else key="success" class="space-y-5">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Reset link sent!</p>
                      <p class="text-sm text-gray-500">Check your email for further instructions</p>
                    </div>
                  </div>

                  <div class="bg-gray-50 rounded-md p-3">
                    <p class="text-sm text-gray-700">
                      We sent a password reset link to <span class="font-medium">{{ email }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Don't see it? Check your spam folder.
                    </p>
                  </div>

                  <button
                    @click="closeModal"
                    class="w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium
                           rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2
                           focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Done
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

const props = defineProps({
  isVisible: { type: Boolean, required: true },
});

const emit = defineEmits(['close']);

const toast = useToast();
const email = ref('');
const emailSent = ref(false);
const isLoading = ref(false);

const handlePasswordResetRequest = async () => {
  isLoading.value = true;
  try {
    await apiService.passwordResetRequest(email.value);
    emailSent.value = true;
    toast.success('Password reset link sent! Check your email.');
  } catch (error) {
    console.error('Password reset request error:', error);
    toast.error('Failed to send reset link. Please check the email address.');
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  email.value = '';
  emailSent.value = false;
  isLoading.value = false;
  emit('close');
};
</script>

<style scoped>
/* Modal animations */
.modal-enter-active, .modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Content fade transition */
.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
