<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-auto"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-5xl w-full h-5/6 flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900">Certificate of Recognition</h3>
        <div class="flex space-x-2">
          <button
            @click="printCertificate"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <span class="flex items-center">
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </span>
          </button>
          <button
            @click="downloadPDF"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <span class="flex items-center">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </span>
          </button>
          <button
            @click="$emit('close')"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <span class="flex items-center">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </span>
          </button>
        </div>
      </div>

      <div class="flex-grow overflow-auto">
        <TeachingCenterCertificate
          ref="certificateRef"
          :center-data="centerData"
          :cert-type="certType"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TeachingCenterCertificate from './TeachingCenterCertificate.vue'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  centerData: {
    type: Object,
    required: true,
  },
  certType: {
    type: String,
    default: 'teaching-center', // or 'medical-institute'
  },
})

defineEmits(['close'])

const certificateRef = ref(null)

// Print certificate function
const printCertificate = () => {
  const printContent = document.createElement('iframe')
  printContent.style.position = 'absolute'
  printContent.style.width = '0'
  printContent.style.height = '0'
  printContent.style.left = '-9999px'
  document.body.appendChild(printContent)

  const certificateHtml = certificateRef.value.$el.outerHTML
  const styles = Array.from(document.styleSheets)
    .filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin))
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n')
      } catch {
        console.warn('Cannot access stylesheet rules')
        return ''
      }
    })
    .join('\n')

  printContent.contentDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Recognition</title>
          <style>${styles}</style>
        </head>
        <body>
          ${certificateHtml}
        </body>
      </html>
    `)

  printContent.contentDocument.close()
  printContent.contentWindow.focus()
  printContent.contentWindow.print()

  // Remove the iframe after printing
  setTimeout(() => {
    document.body.removeChild(printContent)
  }, 500)
}

// Download as PDF function
const downloadPDF = () => {
  if (certificateRef.value) {
    certificateRef.value.exportToPDF()
  }
}
</script>
