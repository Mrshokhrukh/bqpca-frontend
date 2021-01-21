<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" aria-labelledby="payment-modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
      </div>

      <div class="relative inline-block w-full max-w-md p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl sm:scale-100 scale-95">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900" id="payment-modal-title">
              Complete Payment
            </h3>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content Section -->
        <div class="space-y-6">
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-600">Amount to Pay</span>
              <span class="text-lg font-semibold text-gray-900">Nu. 1000.00</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-600">Processing Fee</span>
              <span class="text-sm text-gray-500">Nu. 0.00</span>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-sm text-gray-500">
              Your payment will be processed securely. Click "Pay Now" to complete your transaction.
            </p>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure 256-bit encryption</span>
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div class="mt-8 space-y-3">
          <button
            type="button"
            class="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            @click="pay"
          >
            <span class="mr-2">Pay Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            type="button"
            class="w-full inline-flex justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const isVisible = ref(false);
const emit = defineEmits(['payment-completed', 'close']);

const openModal = () => {
  isVisible.value = true;
};

const closeModal = () => {
  isVisible.value = false;
  emit('close');
};

const pay = () => {
  // Generate a unique payment hash
  const paymentHash = uuidv4();
  // Simulate payment success
  const paymentDone = true;
  emit('payment-completed', { paymentHash, paymentDone });
  closeModal();
};

defineExpose({
  openModal
});
</script>
