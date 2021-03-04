<template>
  <Transition name="modal-fade">
    <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="payment-modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-200 bg-opacity-75"></div>
        </div>

        <!-- Modal container -->
        <div class="relative inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:scale-100 scale-95 border border-gray-200">

          <!-- Top gradient decoration -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <!-- Header Section -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900" id="payment-modal-title">
                BIRMS Payment Process
              </h3>
            </div>
            <button @click="closeModal" class="p-1 transition-colors duration-200 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content Section -->
          <div class="p-6 space-y-6">
            <!-- BIRMS Information Box -->
            <div class="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
              <h4 class="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment Process Information
              </h4>
              <ol class="space-y-3 text-sm">
                <li class="flex items-start">
                  <div class="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-medium mr-3">1</div>
                  <span class="text-gray-700">{{ isMobile ? 'Slide to initiate' : 'Click to initiate' }} payment process</span>
                </li>
                <li class="flex items-start">
                  <div class="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-medium mr-3">2</div>
                  <span class="text-gray-700">You'll receive a payment link from BIRMS via email</span>
                </li>
                <li class="flex items-start">
                  <div class="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-medium mr-3">3</div>
                  <span class="text-gray-700">Complete the payment through the BIRMS portal</span>
                </li>
              </ol>
            </div>

            <!-- Payment Details -->
            <div class="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600">Amount to Pay</span>
                <span class="text-xl font-bold text-gray-900">Nu. 1000.00</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                <span class="text-sm font-medium text-gray-600">Processing Fee</span>
                <span class="text-sm text-gray-500">Nu. 0.00</span>
              </div>
            </div>
          </div>

          <!-- Payment Controls Section -->
          <div class="p-6 space-y-4 bg-gray-50 border-t border-gray-200">
            <!-- Desktop Button -->
            <button
              v-if="!isMobile"
              type="button"
              class="w-full inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              @click="initiatePayment"
            >
              <span>Initiate Payment</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <!-- Mobile Slider -->
            <div
              v-else
              ref="slider"
              class="relative h-14 w-full rounded-full bg-gray-100 shadow-inner overflow-hidden"
              @mousedown="startSlide"
              @mousemove="updateSlide"
              @mouseup="endSlide"
              @mouseleave="endSlide"
              @touchstart="startSlide"
              @touchmove="updateSlide"
              @touchend="endSlide"
            >
              <!-- Slider Progress -->
              <div
                class="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                :style="{ width: `${slideProgress}%` }"
              ></div>

              <!-- Slider Thumb -->
              <div
                ref="sliderThumb"
                class="absolute inset-y-1 left-1 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300"
                :style="{ transform: `translateX(${slidePosition}px)` }"
                :class="{ 'cursor-grabbing': isSliding, 'ring-2 ring-offset-2 ring-blue-500': isSliding }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              <!-- Slider Text -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-medium transition-colors duration-200"
                      :class="slideProgress > 50 ? 'text-white' : 'text-gray-600'">
                  Slide to initiate payment
                </span>
              </div>
            </div>

            <!-- Cancel Button -->
            <button
              type="button"
              class="w-full inline-flex justify-center items-center px-6 py-3.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              @click="closeModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const isVisible = ref(false);
const isMobile = ref(false);
const isSliding = ref(false);
const slidePosition = ref(0);
const slideProgress = ref(0);
const maxSlideWidth = ref(0);
const startX = ref(0);
const slider = ref(null);
const sliderThumb = ref(null);

const emit = defineEmits(['payment-completed', 'close']);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const startSlide = (event) => {
  if (!isMobile.value) return;
  isSliding.value = true;
  startX.value = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
};

const updateSlide = (event) => {
  if (!isSliding.value || !isMobile.value) return;

  const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
  const diff = currentX - startX.value;
  const newPosition = Math.max(0, Math.min(maxSlideWidth.value, slidePosition.value + diff));

  slidePosition.value = newPosition;
  slideProgress.value = (newPosition / maxSlideWidth.value) * 100;
  startX.value = currentX;

  if (slideProgress.value >= 100) {
    initiatePayment();
  }
};

const endSlide = () => {
  if (!isSliding.value || !isMobile.value) return;

  isSliding.value = false;
  if (slideProgress.value < 100) {
    resetSlide();
  }
};

const resetSlide = () => {
  slidePosition.value = 0;
  slideProgress.value = 0;
  isSliding.value = false;
};

const initiatePayment = () => {
  const paymentHash = uuidv4();
  const paymentDone = true;

  emit('payment-completed', {
    paymentHash,
    paymentDone,
    status: 'initiated',
    message: 'Payment link will be sent to your email via BIRMS'
  });
  closeModal();
};

const openModal = () => {
  isVisible.value = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
};

const closeModal = () => {
  isVisible.value = false;
  resetSlide();
  document.body.style.overflow = ''; // Re-enable scrolling
  emit('close');
};

const updateMaxSlideWidth = () => {
  if (!isMobile.value || !slider.value || !sliderThumb.value) return;
  const sliderWidth = slider.value.offsetWidth;
  const thumbWidth = sliderThumb.value.offsetWidth;
  maxSlideWidth.value = sliderWidth - thumbWidth - 8;
};

onMounted(() => {
  checkMobile();
  updateMaxSlideWidth();
  window.addEventListener('resize', () => {
    checkMobile();
    updateMaxSlideWidth();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('resize', updateMaxSlideWidth);
  document.body.style.overflow = ''; // Ensure scrolling is re-enabled when component is destroyed
});

defineExpose({
  openModal
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
