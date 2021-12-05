<template>
  <div v-if="centerData" class="bg-gray-50 p-4">
    <div id="certificate-content-to-print" class="bg-white px-8 pt-8 pb-6 relative a4-size shadow-lg">
      <!-- Watermark -->
      <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img src="@/assets/mhpc-logo.png" alt="Watermark" class="w-2/3 max-w-xl" />
      </div>

      <!-- Header Section -->
      <div class="flex justify-between items-start mb-8">
        <div class="text-center w-32">
          <img src="@/assets/rgob.png" alt="RGOB Logo" class="h-24 mx-auto" />
          <p class="mt-2 text-sm font-semibold">BQPCA</p>
        </div>
        <div class="text-center flex-1 px-8">
          <h3 class="text-lg font-medium text-gray-900 leading-7">
            Royal Government of Bhutan<br />
            Medical and Health Professionals Council<br />
            Bhutan Qualifications and Professionals Certification Authority<br />
            Thimphu : Bhutan
          </h3>
          <h2 class="text-2xl font-bold text-blue-900 mt-6">Teaching Institute CERTIFICATE</h2>
        </div>
        <div class="text-center w-32">
          <img src="@/assets/mhpc-logo.png" alt="MHPC Logo" class="h-24 mx-auto" />
          <p class="mt-2 text-sm font-semibold">MHPC</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="mt-16 relative text-center">
        <p class="text-lg text-gray-700">This is to certify that</p>
        <h1 class="text-3xl font-bold text-blue-900 my-4">{{ centerData.center_name }}</h1>
        <p class="text-md text-gray-600">{{ centerData.location }}</p>
        <p class="text-justify text-md mt-10 px-12 leading-relaxed">
          having fulfilled the requirements prescribed by the Medical and Health Professionals Council (MHPC), is hereby granted this certificate of recognition as a Teaching Institute for health professionals.
        </p>

        <div class="grid grid-cols-[200px_1fr] gap-y-4 text-left text-sm mt-10 px-16">
          <div class="font-semibold">Certificate No.:</div>
          <div>{{ certificateNumber }}</div>

          <div class="font-semibold">Parent Institution:</div>
          <div>{{ centerData.institute_name }}</div>

          <div class="font-semibold">Date of Issue:</div>
          <div>{{ formatDate(centerData.valid_since) }}</div>

          <div class="font-semibold">Valid Till:</div>
          <div>{{ formatDate(centerData.valid_till) }}</div>
        </div>
      </div>

      <div class="mt-20 px-12 flex justify-between items-end">
        <div>
          <img v-if="directorSignature" :src="directorSignature" alt="Signature" class="h-16" />
          <div class="mt-2 text-sm">
            <p class="font-medium">{{ directorName }}</p>
            <p>{{ directorDesignation }}</p>
            <p class="mt-1">
              Dated: {{ formatDate(centerData.issue_date) }}
            </p>
          </div>
        </div>

        <div class="text-center">
          <vue-qrcode
            :value="qrCodeData"
            :options="{ width: 100, margin: 1, color: { dark: '#000000', light: '#ffffff' } }"
            class="border-4 border-gray-200 rounded-md p-2"
          />
          <p class="mt-2 text-xs text-gray-600">Scan to verify</p>
        </div>
      </div>

      <p class="mt-12 text-sm text-gray-600 text-center px-12">
        This certificate is valid until the expiry date, unless suspended or revoked by the Council.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, defineExpose } from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import html2pdf from 'html2pdf.js'
import apiServices from '@/services/services'

const props = defineProps({
  centerData: {
    type: Object,
    required: true,
  },
})

const directorName = ref('Loading...')
const directorDesignation = ref('...')
const directorSignature = ref(null)

onMounted(async () => {
  try {
    const response = await apiServices.getMhpcMastersESignatures()
    if (response.data?.results?.length) {
      const activeDirector = response.data.results.find(dir => dir.status === true) || response.data.results[0]
      directorName.value = activeDirector.name
      directorDesignation.value = activeDirector.designation
      directorSignature.value = activeDirector.signature
    }
  } catch (error) {
    console.error('Error fetching director information:', error)
    directorName.value = 'N/A'
  }
})

const certificateNumber = computed(() => {
  return `THC-${String(props.centerData.id).padStart(4, '0')}`
})

const qrCodeData = computed(() => {
  if (!props.centerData) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/certificate-validity/search?type=teaching_hospital&cert_number=${certificateNumber.value}`
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const exportToPDF = () => {
  if (!props.centerData) return
  const element = document.getElementById('certificate-content-to-print')
  const opt = {
    margin: 0,
    filename: `teaching_hospital_certificate_${certificateNumber.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }
  html2pdf().from(element).set(opt).save()
}

defineExpose({ exportToPDF })
</script>

<style scoped>
.a4-size {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>