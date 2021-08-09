<template>
  <div
    v-if="showModal"
    class="fixed z-[60] inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
      >
        <div id="cogs-certificate-content" class="bg-white px-8 pt-6 pb-6 relative min-h-[842px]">
          <div
            class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
          >
            <img src="@/assets/engineering-logo.png" alt="Watermark" class="w-2/3 max-w-lg" />
          </div>

          <div class="flex justify-between items-center mb-6">
            <div class="w-28 h-28 flex items-center justify-center">
              <img src="@/assets/rgob.png" alt="BQPCA Logo" class="max-w-full max-h-full" />
            </div>
            <div class="text-center">
              <h1 class="text-xl font-bold">དཔལ་ལྡན་འབྲུག་གཞུང་།</h1>
              <h2 class="text-lg font-semibold">འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།</h2>
              <h3 class="text-md font-medium mt-1">བཟོ་རིག་ཁྱད་རིག་ཚོགས་སྡེ།</h3>
              <p class="text-sm">Royal Government of Bhutan</p>
              <p class="text-sm">BHUTAN QUALIFICATIONS AND PROFESSIONALS CERTIFICATION AUTHORITY</p>
              <p class="text-xs">Engineering Professionals Council</p>
            </div>
            <div class="w-28 h-28 flex items-center justify-center">
              <img
                src="@/assets/engineering-logo.png"
                alt="EPC Logo"
                class="max-w-full max-h-full"
              />
            </div>
          </div>

          <h2 class="text-xl font-bold text-center my-4 py-2">
            CERTIFICATE OF GOOD STANDING
          </h2>

          <div v-if="cogsData" class="mt-4 relative z-10">
            <div class="flex justify-between">
              <div class="w-3/4">
                <div class="grid grid-cols-[220px_1fr] gap-x-4 gap-y-3 text-base">
                  <div class="font-semibold">Name:</div>
                  <div>{{ cogsData.full_name }}</div>

                  <div class="font-semibold">Citizenship ID No.:</div>
                  <div>{{ cogsData.cid_no }}</div>

                  <div class="font-semibold">Registration No.:</div>
                  <div>{{ cogsData.registration_no || 'N/A' }}</div>

                  <div class="font-semibold">Date of Initial Registration:</div>
                  <div>N/A</div>

                  <div class="font-semibold">Registration Type:</div>
                  <div>Professional Engineer</div>

                  <div class="font-semibold">Qualification(s):</div>
                  <div>{{ cogsData.qualifications || 'Not specified' }}</div>

                  <div class="font-semibold">Date of Issue:</div>
                  <div>{{ formatDate(cogsData.updated_at) }}</div>

                  <div class="font-semibold">Valid Till:</div>
                  <div>{{ cogsData.valid_till ? formatDate(cogsData.valid_till) : 'N/A' }}</div>
                </div>
              </div>

              <div class="w-1/4 flex flex-col items-center">
                <div
                  class="h-40 w-36 border-2 border-gray-400 flex items-center justify-center bg-gray-100"
                >
                  <span v-if="!cogsData.passport_photo" class="text-gray-500">Photo</span>
                  <img
                    v-else
                    :src="cogsData.passport_photo"
                    alt="Passport Photo"
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div class="mt-10 px-4 text-base text-justify space-y-3">
              <p>
                It is hereby certified that the above information is a true copy of the entry in the
                register relating to the fully registered Engineering Professional named above and
                no disciplinary proceedings are against the professional.
              </p>
              <p>
                He/she has never been the subject of an inquiry by the Professional Ethics
                Committee.
              </p>
            </div>

            <div class="mt-16 px-4 flex justify-between items-end">
              <div class="text-center">
                <vue-qrcode
                  v-if="qrCodeData"
                  :value="qrCodeData"
                  :options="{ width: 110, margin: 1 }"
                />
                <p class="mt-2 text-xs text-gray-600">Scan to verify</p>
              </div>

              <div v-if="eSignature" class="text-center">
                <img :src="eSignature.signature" alt="Signature" class="h-16 mx-auto" />
                <div class="mt-2 text-sm border-t border-gray-500 pt-1">
                  <p class="font-bold">Director</p>
                  <p>Date: {{ formatDate(cogsData.updated_at) }}</p>
                </div>
              </div>
              <div v-else class="text-center h-24"></div>
            </div>

            <div class="mt-12 text-center text-xs text-gray-700">
              <p>
                The information contained in this certificate reflects the information held by
                Engineering Professionals Council as at the above date.
              </p>
            </div>
          </div>
          <p v-else class="py-16 text-center text-gray-500">Loading certificate details...</p>
        </div>

        <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            @click="downloadCertificate"
          >
            Download
          </button>
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// --- Imports ---
import { ref, onMounted, computed } from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import html2pdf from 'html2pdf.js'
import apiServices from '@/services/services'

// --- Props and Emits ---
const props = defineProps({
  cogsApplication: {
    type: Object,
    default: null,
  },
  showModal: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

// --- Component State ---
const eSignature = ref(null)

const cogsData = computed(() => props.cogsApplication)

// --- Lifecycle Hooks ---
onMounted(async () => {
  try {
    const response = await apiServices.getEpcMastersESignatures()
    if (response.data?.results?.length > 0) {
      // For this example, we take the first available signature
      eSignature.value = response.data.results[0]
    }
  } catch (error) {
    console.error('Failed to fetch e-signature:', error)
  }
})

// --- Methods ---
const closeModal = () => {
  emit('close')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-')
}

const qrCodeData = computed(() => {
  if (!cogsData.value) return ''
  const baseUrl = window.location.origin
  // CORRECTED: Was cogsData.value.registration_no?.registration_no
  const certIdentifier = cogsData.value.registration_no || cogsData.value.id
  return `${baseUrl}/verify-cogs?cert_number=${certIdentifier}`
})

const downloadCertificate = () => {
  const element = document.getElementById('cogs-certificate-content')
  // CORRECTED: Was cogsData.value?.registration_no?.registration_no
  const regNo = cogsData.value?.registration_no
  const id = cogsData.value?.id
  const filename = `cogs-certificate-${regNo || id || 'unknown'}.pdf`

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }

  html2pdf().from(element).set(opt).save()
}
</script>