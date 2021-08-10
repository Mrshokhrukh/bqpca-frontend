<!-- src/components/common/NdiModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
    <div
      class="bg-white px-6 rounded-2xl shadow-2xl w-full max-w-[400px] transform transition-all duration-300 scale-100 relative"
      :style="{ border: '3px solid #5AC994', fontFamily: 'Inter, sans-serif' }">
      <!-- Header -->
      <div class="mt-6 flex justify-between items-center mb-6">
        <div class="flex items-center justify-center w-full">
          <h3 class="text-lg font-bold text-center">
            <span v-if="!isMobile">Scan with </span>
            <span v-else>Login with </span>
            <span :style="{ color: '#5AC994' }">Bhutan NDI</span> Wallet
          </h3>
        </div>
        <button @click="closeModal"
          class="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bhutan-green focus:ring-opacity-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Deep Link Button -->
      <div v-if="isMobile && deepLinkUrl" class="mb-6">
        <button @click="openDeepLink"
          class="w-full py-2.5 bg-bhutan-green text-white rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-bhutan-green focus:ring-opacity-50 font-medium"
          :style="{ backgroundColor: '#5AC994', color: '#FFFFFF' }">
          Open Bhutan NDI Wallet
        </button>
        <div class="flex items-center my-6">
          <div class="flex-grow border-t border-gray-200"></div>
          <div class="px-4 text-gray-500 text-sm">OR</div>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>
      </div>

      <!-- QR Code Display -->
      <div class="flex flex-col items-center justify-center mb-6">
        <div v-if="isLoadingQr"
          class="flex items-center justify-center w-52 h-52 border-2 rounded-xl bg-white shadow-md"
          :style="{ borderColor: '#5AC994' }">
          <div class="flex flex-col items-center">
            <svg class="animate-spin h-10 w-10 mb-2" :style="{ color: '#5AC994' }" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <p class="font-medium text-base" :style="{ color: '#5AC994' }">Generating QR Code...</p>
          </div>
        </div>
        <div v-else-if="qrCodeData" class="p-1 border-2 rounded-xl bg-white shadow-md relative"
          :style="{ borderColor: '#5AC994' }">
          <img :src="qrCodeData" alt="NDI QR Code" class="w-52 h-52" />
          <div v-if="showNdiLogoInQr" class="absolute inset-0 flex items-center justify-center">
            <div class="bg-white rounded-full">
              <img src="@/assets/ndi-logo.png" alt="NDI Logo Overlay" class="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <!-- Status/Error Message -->
      <div v-if="ndiStatus === 'rejected' || ndiErrorMessage"
        class="text-center mb-5 p-3 bg-red-50 rounded-lg border border-red-200">
        <div class="flex items-center justify-center text-red-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">
            {{
              ndiErrorMessage ||
              (ndiStatus === 'rejected'
                ? 'Proof request was rejected. Please try again.'
                : 'An error occurred.')
            }}
          </span>
        </div>
        <button @click="tryAgain"
          class="w-full py-2.5 bg-bhutan-green text-white rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-bhutan-green focus:ring-opacity-50 font-medium"
          :style="{ backgroundColor: '#5AC994', color: '#FFFFFF' }">
          Try Again
        </button>
      </div>

      <!-- Instructions Section -->
      <div v-if="ndiStatus !== 'error' && ndiStatus !== 'rejected'" class="mb-4 p-6 rounded-xl">
        <div class="space-y-2.5 text-gray-600 mb-6">
          <div class="flex items-start">
            <div class="flex items-center justify-center bg-opacity-10 w-5 h-5 rounded-full mr-2 flex-shrink-0">
              1.
            </div>
            <p class="text-sm">Open the Bhutan NDI Wallet on your phone</p>
          </div>
          <div class="flex items-start">
            <div class="flex items-center justify-center bg-opacity-10 w-5 h-5 rounded-full mr-2 flex-shrink-0">
              2.
            </div>
            <div class="text-sm">
              <span class="inline-flex items-center">
                Tap the Scan button
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-2 inline-block flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke-width="2" />
                  <path d="M7 7h3v3H7z M14 7h3v3h-3z M7 14h3v3H7z" stroke-width="2" />
                </svg>
              </span>
              located on the menu bar and scan the QR code
            </div>
          </div>
        </div>
        <div class="flex justify-center">
          <a href="https://www.youtube.com/@BhutanNDI" target="_blank"
            class="flex items-center justify-center text-bhutan-green border-2 border-bhutan-green font-medium py-2 px-5 rounded-full hover:bg-gray-100 hover:text-bhutan-green transition-colors focus:outline-none focus:ring-2 focus:ring-bhutan-green focus:ring-opacity-50 w-full max-w-xs text-sm"
            :style="{ color: '#5AC994', borderColor: '#5AC994' }">
            Watch Video Guide
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ms-4" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
                clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Download/Support Section -->
      <div class="pt-1">
        <div class="text-center text-gray-500 mb-2 font-medium text-sm">
          Don't have the Bhutan NDI Wallet? <span class="text-bhutan-green">Download Now!</span>
        </div>
        <div class="flex justify-center space-x-5 mb-6">
          <a href="https://play.google.com/store/search?q=bhutan+ndi&c=apps&hl=en_IN&gl=US&pli=1" target="_blank"
            class="hover:scale-105 transition-transform focus:outline-none">
            <img src="@/assets/google.png" alt="Google Play" class="h-10" />
          </a>
          <a href="https://apps.apple.com/in/app/bhutan-ndi/id1645493166" target="_blank"
            class="hover:scale-105 transition-transform focus:outline-none">
            <img src="@/assets/apple.png" alt="App Store" class="h-10 scale-150" />
          </a>
        </div>
        <div class="text-center text-bhutan-green mb-2 font-medium text-sm">Get Support</div>
        <div class="flex justify-center items-center space-x-5 mb-6">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:ndifeedback@dhi.bt"
              class="text-gray-600 hover:text-bhutan-green hover:underline text-sm">ndifeedback@dhi.bt</a>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="text-gray-600 text-sm">1199</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  username: { type: String, required: false },
  actionType: { type: String, required: true }, // 'login' or 'registration'
  showNdiLogoInQr: { type: Boolean, default: true },
})

const emit = defineEmits(['close', 'ndi-login-success', 'ndi-registration-success'])
const isMobile = ref(false)
const qrCodeData = ref('')
const deepLinkUrl = ref('') // Store Deep Link URL
const isLoadingQr = ref(false)
const ndiStatus = ref('idle') // idle, loading, scanning, rejected, success, error
const ndiErrorMessage = ref('')
let pollingInterval
let threadId = ref('')
const toast = useToast()

const generateQrCode = async () => {
  isLoadingQr.value = true
  ndiStatus.value = 'loading'
  ndiErrorMessage.value = ''

  try {
    const response = await apiService.generateNdiQrCode({ username: props.username })
    if (response.status >= 200 && response.status < 300 && response.data) {
      qrCodeData.value = response.data.qr_code_url
      deepLinkUrl.value = response.data.deep_link_url || '' // Expect backend to return this
      threadId.value = response.data.thread_id
      if (!threadId.value) throw new Error('Thread ID not received from backend')
      ndiStatus.value = 'scanning'
      startPolling()
    } else {
      throw new Error(response.data?.error || 'Invalid response from server.')
    }
  } catch (error) {
    console.error('Error generating NDI QR code:', error)
    ndiErrorMessage.value = error.message || 'Failed to generate QR code. Please try again.'
    ndiStatus.value = 'error'
    toast.error(ndiErrorMessage.value)
  } finally {
    isLoadingQr.value = false
  }
}

const startPolling = () => {
  clearInterval(pollingInterval)
  const POLLING_TIMEOUT = 5 * 60 * 1000 // 5 minutes
  const startTime = Date.now()

  pollingInterval = setInterval(async () => {
    if (Date.now() - startTime > POLLING_TIMEOUT) {
      clearInterval(pollingInterval)
      ndiStatus.value = 'error'
      ndiErrorMessage.value = 'Authentication timed out. Please try again.'
      toast.error(ndiErrorMessage.value)
      return
    }

    try {
      const response = await apiService.verifyNdiProof({ thread_id: threadId.value })

      if (response.data.status === 'pending') {
        ndiStatus.value = 'scanning'
      } else if (response.data.status === 'completed') {
        clearInterval(pollingInterval)
        ndiStatus.value = 'success'

        if (props.actionType === 'login') {
          emit('ndi-login-success', threadId.value)
        } else if (props.actionType === 'registration') {
          // Wrap the registration callback logic in its own try...catch
          try {
            const ndiDataResponse = await apiService.ndiRegistrationCallback({
              thread_id: threadId.value,
            })
            // console.log('NDI Data Response:', ndiDataResponse)
            if (
              ndiDataResponse.status === 200 &&
              ndiDataResponse.data.cid_number &&
              ndiDataResponse.data.full_name
            ) {
              emit('ndi-registration-success', {
                cid: ndiDataResponse.data.cid_number,
                fullName: ndiDataResponse.data.full_name,
              })
            } else {
              throw new Error(
                `Failed to retrieve NDI data. Status: ${ndiDataResponse.status}, Error: ${ndiDataResponse.data.error || 'Unknown error'}`,
              )
            }
          } catch (registrationError) {
            console.error('Error in registration callback:', registrationError)
            clearInterval(pollingInterval)
            ndiStatus.value = 'error'
            ndiErrorMessage.value = `Error during registration callback: ${registrationError.message}`
            toast.error(ndiErrorMessage.value)
            return // Important: Exit the interval callback
          }
        }
      } else if (response.data.status === 'rejected') {
        clearInterval(pollingInterval)
        ndiStatus.value = 'rejected'
        ndiErrorMessage.value = 'Proof request was rejected. Please try again.'
        toast.error(ndiErrorMessage.value)
      } else if (response.data.error) {
        clearInterval(pollingInterval)
        ndiStatus.value = 'error'
        ndiErrorMessage.value = `NDI error: ${response.data.error}` // More context
        toast.error(ndiErrorMessage.value)
      }
    } catch (verifyProofError) {
      console.error('Error polling NDI proof status:', verifyProofError)
      clearInterval(pollingInterval)
      ndiStatus.value = 'error'
      ndiErrorMessage.value = `Error checking verification status: ${verifyProofError.message}` // Include error message
      toast.error(ndiErrorMessage.value)
    }
  }, 3000)
}

const closeModal = () => {
  emit('close')
  qrCodeData.value = ''
  deepLinkUrl.value = ''
  ndiStatus.value = 'idle'
  ndiErrorMessage.value = ''
  clearInterval(pollingInterval)
  threadId.value = ''
}

const tryAgain = () => {
  generateQrCode()
}

const openDeepLink = () => {
  if (deepLinkUrl.value) {
    window.location.href = deepLinkUrl.value
    ndiStatus.value = 'scanning' // Keep polling active
  } else {
    ndiStatus.value = 'error'
    ndiErrorMessage.value = 'Deep Link not available. Please use QR code.'
    toast.error(ndiErrorMessage.value)
  }
}

onMounted(() => {
  generateQrCode()
  isMobile.value = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
})

onUnmounted(() => {
  clearInterval(pollingInterval)
})
</script>

<style scoped>
/* Animation for the scanning line */
@keyframes qrScanLine {
  0% {
    top: 0;
    opacity: 0.75;
  }

  50% {
    top: 100%;
    opacity: 0.25;
  }

  100% {
    top: 0;
    opacity: 0.75;
  }
}

.animate-qrScanLine {
  animation: qrScanLine 2s linear infinite;
}

/* Define bhutan-green color class to use in component */
.bg-bhutan-green {
  background-color: #5ac994;
}

.text-bhutan-green {
  color: #5ac994;
}

.border-bhutan-green {
  border-color: #5ac994;
}

.focus\:ring-bhutan-green:focus {
  --tw-ring-color: #5ac994;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .p-8 {
    padding: 1.25rem;
  }

  .max-w-\[500px\] {
    width: calc(100% - 2rem);
    max-width: 100%;
    margin: 0 1rem;
  }

  .w-64,
  .h-64 {
    width: 50vw;
    height: 50vw;
    max-width: 200px;
    max-height: 200px;
  }

  .space-x-6 {
    gap: 1rem;
  }

  .h-12 {
    height: 2.5rem;
  }

  .text-xl {
    font-size: 1.1rem;
  }

  .text-lg {
    font-size: 1rem;
  }

  .p-5 {
    padding: 1rem;
  }

  .rounded-xl {
    border-radius: 0.75rem;
  }

  /* Mobile header specific modifications */
  .mt-8 {
    margin-top: 1.5rem;
  }

  .mb-8 {
    margin-bottom: 1.5rem;
  }
}
</style>
