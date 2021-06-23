
<template>
  <teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
        aria-labelledby="payment-modal-title"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div
          class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-100"
        >
          <!-- Top gradient decoration -->
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
          ></div>

          <!-- Header Section -->
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <div class="flex items-center space-x-4">
              <div class="p-2 bg-blue-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900" id="payment-modal-title">
                BIRMS Payment Process
              </h3>
            </div>
            <button
              @click="closeModal"
              :disabled="isProcessing"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close payment modal"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content Section -->
          <div class="p-6 space-y-6 flex-grow overflow-y-auto">
            <!-- BIRMS Information Box -->
            <div
              class="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm"
            >
              <h4 class="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Payment Process Information
              </h4>
              <ol class="space-y-3 text-sm text-gray-700">
                <li class="flex items-start">
                  <div
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-medium mr-3"
                  >
                    1
                  </div>
                  <span
                    >{{ isMobile ? 'Slide to initiate' : 'Click to initiate' }} payment
                    process</span
                  >
                </li>
                <li class="flex items-start">
                  <div
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-medium mr-3"
                  >
                    2
                  </div>
                  <span>You'll receive a payment link from BIRMS via email</span>
                </li>
                <li class="flex items-start">
                  <div
                    class="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full text-blue-600 text-xs font-medium mr-3"
                  >
                    3
                  </div>
                  <span>Complete the payment through the BIRMS portal</span>
                </li>
              </ol>
            </div>

            <!-- Payment Details -->
            <div class="p-5 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">Amount to Pay</span>
                <span class="text-lg font-bold text-gray-900">Nu. {{ amount.toFixed(2) }}</span>
              </div>
            </div>
            <div v-if="errorMessage" class="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Payment Controls Section -->
          <div class="p-6 space-y-4 bg-gray-50 border-t border-gray-100">
            <!-- Desktop Button -->
            <button
              v-if="!isMobile"
              type="button"
              class="w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              @click="initiatePayment"
              :disabled="isProcessing"
            >
              <svg
                v-if="isProcessing"
                class="animate-spin h-5 w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              {{ isProcessing ? 'Processing...' : 'Initiate Payment' }}
              <svg
                v-if="!isProcessing"
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            <!-- Mobile Slider -->
            <div
              v-else
              ref="slider"
              class="relative h-12 w-full rounded-full bg-gray-100 shadow-inner overflow-hidden"
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
                class="absolute inset-y-1 left-1 h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300"
                :style="{ transform: `translateX(${slidePosition}px)` }"
                :class="{ 'cursor-grabbing ring-2 ring-offset-2 ring-blue-500': isSliding }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>

              <!-- Slider Text -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span
                  class="text-sm font-medium transition-colors duration-200"
                  :class="slideProgress > 50 ? 'text-white' : 'text-gray-600'"
                >
                  Slide to initiate payment
                </span>
              </div>
            </div>

            <!-- Cancel Button -->
            <button
              type="button"
              class="w-full flex justify-center items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              @click="closeModal"
              :disabled="isProcessing"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 text-gray-400"
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
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useToast } from 'vue-toastification'

const toast = useToast()

const isVisible = ref(false)
const isMobile = ref(false)
const isSliding = ref(false)
const isProcessing = ref(false)
const slidePosition = ref(0)
const slideProgress = ref(0)
const maxSlideWidth = ref(0)
const startX = ref(0)
const slider = ref(null)
const sliderThumb = ref(null)
const errorMessage = ref('')

defineProps({
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
})

const emit = defineEmits(['payment-completed', 'close'])

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const startSlide = (event) => {
  if (!isMobile.value) return
  isSliding.value = true
  startX.value = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
}

const updateSlide = (event) => {
  if (!isSliding.value || !isMobile.value) return

  const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX
  const diff = currentX - startX.value
  const newPosition = Math.max(0, Math.min(maxSlideWidth.value, slidePosition.value + diff))

  slidePosition.value = newPosition
  slideProgress.value = (newPosition / maxSlideWidth.value) * 100
  startX.value = currentX

  if (slideProgress.value >= 100) {
    initiatePayment()
  }
}

const endSlide = () => {
  if (!isSliding.value || !isMobile.value) return

  isSliding.value = false
  if (slideProgress.value < 100) {
    resetSlide()
  }
}

const resetSlide = () => {
  slidePosition.value = 0
  slideProgress.value = 0
  isSliding.value = false
}

const initiatePayment = async () => {
  isProcessing.value = true
  errorMessage.value = ''
  try {
    const paymentHash = uuidv4()
    const paymentDone = true // Replace with actual payment gateway logic

    emit('payment-completed', {
      paymentHash,
      paymentDone,
      status: 'initiated',
      message: 'Payment link will be sent to your email via BIRMS',
    })
    toast.success('Payment initiated successfully!')
    // Do not close modal here; let parent handle it
  } catch (error) {
    errorMessage.value = 'Failed to initiate payment. Please try again.'
    toast.error(errorMessage.value)
    console.error('Payment initiation error:', error)
  } finally {
    isProcessing.value = false
  }
}

const openModal = () => {
  isVisible.value = true
  errorMessage.value = ''
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  if (isProcessing.value) return // Prevent closing during processing
  isVisible.value = false
  resetSlide()
  document.body.style.overflow = ''
  emit('close')
}

const updateMaxSlideWidth = () => {
  if (!isMobile.value || !slider.value || !sliderThumb.value) return
  const sliderWidth = slider.value.offsetWidth
  const thumbWidth = sliderThumb.value.offsetWidth
  maxSlideWidth.value = sliderWidth - thumbWidth - 8
}

onMounted(() => {
  checkMobile()
  updateMaxSlideWidth()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('resize', updateMaxSlideWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('resize', updateMaxSlideWidth)
  document.body.style.overflow = ''
})

defineExpose({
  openModal,
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>
