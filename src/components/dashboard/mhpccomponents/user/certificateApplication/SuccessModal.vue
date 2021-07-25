<!-- SuccessModal.vue -->
<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md transform">
        <div class="p-6">
          <div class="flex flex-col items-center text-center">
            <!-- Success Icon -->
            <div class="rounded-full bg-green-100 p-3 mb-4">
              <svg
                class="h-8 w-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
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
            </div>

            <!-- Title -->
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Application Submitted Successfully!
            </h3>

            <!-- Message -->
            <p class="text-gray-600 mb-6">
              Thank you for your submission. Your application has been received.
            </p>

            <!-- Countdown -->
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <svg
                class="animate-spin h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
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
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Redirecting in {{ countdown }} seconds...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  seconds: {
    type: Number,
    default: 5,
  },
  onComplete: {
    type: Function,
    default: () => {},
  },
})

defineEmits(['update:modelValue'])

const countdown = ref(props.seconds)
let timer = null

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      countdown.value = props.seconds
      startCountdown()
    } else {
      clearInterval(timer)
    }
  },
  { immediate: true },
)

const startCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      props.onComplete()
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
