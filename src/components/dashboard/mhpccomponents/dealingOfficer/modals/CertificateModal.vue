<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
    @click.self="close"
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full m-4 transform transition-transform duration-300 scale-95" :class="{ 'scale-100': isOpen }">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Certificate of Good Standing</h2>
        <button @click="close" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-6" ref="certificateContent">
        <div v-if="application" class="space-y-4">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-indigo-600">CERTIFICATE</h3>
            <p class="text-gray-500">This is to certify that</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-serif text-gray-800">{{ application.full_name }}</p>
            <p class="text-sm text-gray-600 mt-1">Registration No: {{ application.registration_no }}</p>
          </div>
          <div class="text-center my-6">
            <p class="text-gray-700">has been granted the Certificate of Good Standing.</p>
            <p class="text-sm text-gray-500">This certificate is a placeholder and for demonstration purposes only.</p>
          </div>
        </div>
        <div v-else class="text-center py-8">
            <p class="text-gray-500">No application data available.</p>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
        <button
          @click="close"
          class="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Close
        </button>
         <button
          @click="downloadCertificate"
          class="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition-all duration-200"
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  application: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])
const certificateContent = ref(null)

const close = () => {
  emit('close')
}

const downloadCertificate = () => {
  if (!certificateContent.value || !props.application) return

  const element = certificateContent.value
  const worker = html2pdf()
  const options = {
    margin: 1,
    filename: `COGS_${props.application.full_name.replace(/ /g, '_')}_${props.application.registration_no}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }

  worker.from(element).set(options).save()
}
</script>

<style scoped>
.scale-95 {
  transform: scale(0.95);
}
.scale-100 {
  transform: scale(1);
}
</style>
