<template>
  <div v-if="showModal" class="fixed z-[60] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

      <!-- Certificate Container -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Certificate Content -->
        <div id="cogs-certificate-content" class="bg-white px-8 pt-8 pb-6 relative min-h-[842px]">
          <!-- Watermark -->
          <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img src="@/assets/engineering-logo.png" alt="Watermark" class="w-2/3 max-w-xl" />
          </div>

          <!-- Header Section -->
          <div class="flex justify-between items-start mb-8">
            <div class="text-center w-32">
              <img src="@/assets/rgob.png" alt="RGOB Logo" class="h-24 mx-auto" />
              <p class="mt-2 text-sm font-semibold">BQPCA</p>
            </div>
            <div class="text-center flex-1 px-8">
              <h3 class="text-xl font-medium text-gray-900 leading-tight mb-4">
                དཔལ་ལྡན་འབྲུག་གཞུང་།<br />
                བཟོ་རིག་ཁྱད་རིག་ཚོགས་སྡེ།<br />
                འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།<br />
                ཐིམ་ཕུག : འབྲུག།
              </h3>
              <h3 class="text-lg font-medium text-gray-900 leading-7">
                Royal Government of Bhutan<br />
                Engineering Professionals Council<br />
                Bhutan Qualifications and Professionals Certification Authority<br />
                Thimphu : Bhutan
              </h3>
              <h2 class="text-2xl font-bold text-blue-900 mt-6">CERTIFICATE OF GOOD STANDING</h2>
            </div>
            <div class="text-center w-32">
              <img src="@/assets/engineering-logo.png" alt="EPC Logo" class="h-24 mx-auto" />
              <p class="mt-2 text-sm font-semibold">EPC</p>
            </div>
          </div>

          <!-- Main Content -->
          <div v-if="cogsData" class="mt-8 relative">
            <!-- Certificate Details Grid -->
            <div class="grid grid-cols-[200px_1fr] gap-y-4 text-sm px-12">
              <div class="font-semibold">Name:</div>
              <div>{{ cogsData.full_name }}</div>
              <div class="font-semibold">Citizenship ID No.:</div>
              <div>{{ cogsData.cid_no }}</div>
              <div class="font-semibold">Registration No.:</div>
              <div>{{ cogsData.registration_no?.registration_no || 'N/A' }}</div>
              <div class="font-semibold">Gender:</div>
              <div>{{ formatGender(cogsData.gender) }}</div>
              <div class="font-semibold">Professional Status:</div>
              <div>Registered Professional Engineer</div>
              <div class="font-semibold">Workplace/Agency:</div>
              <div>{{ getWorkplaceInfo(cogsData) }}</div>
              <div class="font-semibold">Supervisor:</div>
              <div>{{ cogsData.supervisor_name }} ({{ cogsData.supervisor_designation }})</div>
              <div class="font-semibold">Contact Information:</div>
              <div>{{ cogsData.contact_number }} | {{ cogsData.email_address }}</div>
              <div class="font-semibold">Certificate Issued Date:</div>
              <div>{{ formatDate(cogsData.cogs_approved_date || cogsData.created_at) }}</div>
              <div class="font-semibold">Certificate Status:</div>
              <div class="text-green-600 font-medium">{{ formatStatus(cogsData.endorsement_decision) }}</div>
            </div>

            <!-- Passport Photo -->
            <!-- <div class="absolute top-0 right-12">
              <img v-if="cogsData.registration_no?.passport_photo" :src="cogsData.registration_no.passport_photo"
                alt="Passport Photo" class="h-32 w-32 object-cover rounded-md border-2 border-gray-300 shadow-sm" />
              <div v-else
                class="h-32 w-32 bg-gray-200 rounded-md border-2 border-gray-300 flex items-center justify-center">
                <span class="text-gray-500 text-xs">No Photo</span>
              </div>
            </div> -->

            <!-- Certificate Statement -->
            <div class="mt-8 px-12 space-y-4 text-sm">
              <p class="text-center text-lg font-medium text-gray-800 mb-6">
                TO WHOM IT MAY CONCERN
              </p>
              <p class="text-justify leading-6">
                This is to certify that <strong>{{ cogsData.full_name }}</strong>
                (Registration No: <strong>{{ cogsData.registration_no?.registration_no || 'N/A' }}</strong>)
                is a registered professional engineer with the Engineering Professional Council of Bhutan
                and is in good standing with no disciplinary actions or professional misconduct recorded
                against this professional as of the date of this certificate.
              </p>
              <p class="text-justify leading-6">
                The above-mentioned professional is authorized to practice engineering in their
                area of competence and maintains active registration status with the
                Engineering Professional Council of Bhutan.
              </p>
              <p class="text-justify leading-6">
                <strong>Purpose:</strong> {{ cogsData.reason_for_application || 'Professional verification' }}
              </p>
            </div>

            <!-- Footer Section -->
            <div class="mt-12 px-12 flex justify-between items-end">

              <div v-if="eSignature">
                <img :src="eSignature.signature" alt="Signature" class="h-16" />
                <div class="mt-2 text-sm">
                  <p class="font-medium">{{ eSignature.name }}</p>
                  <p>{{ eSignature.designation }}</p>
                  <p class="mt-1">
                    Dated: {{ formatDate(eSignature.updated_at) }}
                  </p>
                </div>
              </div>

              <!-- QR Code -->
              <div class="text-center">
                <vue-qrcode :value="qrCodeData" :options="{
                  width: 100,
                  margin: 1,
                  color: { dark: '#000000', light: '#ffffff' },
                }" class="border-4 border-gray-200 rounded-md p-2" />
                <p class="mt-2 text-xs text-gray-600">Scan to verify</p>
              </div>
            </div>

            <!-- Disclaimer -->
            <div class="mt-8 px-12 space-y-2 text-xs text-gray-600">
              <p class="text-center font-medium">VALIDITY AND DISCLAIMER</p>
              <p class="text-justify">
                This Certificate of Good Standing is valid as of the date of issuance and reflects
                the professional status at the time of issue. For current status verification,
                please contact the Engineering Professional Council of Bhutan or scan the QR code above.
              </p>
            </div>
          </div>
          <!-- Loading State -->
          <p v-else class="py-16 text-center text-gray-500">Loading certificate details...</p>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
          <button type="button"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            @click="downloadCertificate">
            Download
          </button>
          <button type="button"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// --- Corrected Imports ---
import { ref, onMounted, computed } from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import html2pdf from 'html2pdf.js'
import apiServices from '@/services/services'

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

// --- Correctly scoped logic ---
const emit = defineEmits(['close'])
const eSignature = ref(null)

const closeModal = () => {
  emit('close')
}

const cogsData = computed(() => {
  return props.cogsApplication
})

onMounted(async () => {
  try {
    const response = await apiServices.getEpcMastersESignatures()
    if (response.data?.results?.length > 0) {
      eSignature.value = response.data.results[0]
    }
  } catch (error) {
    console.error('Failed to fetch e-signature:', error)
  }
})

const getWorkplaceInfo = (cogs) => {
  if (!cogs) return 'Not specified'
  const parts = []
  if (cogs.agency?.name) parts.push(cogs.agency.name)
  if (cogs.department?.name) parts.push(cogs.department.name)
  if (cogs.workplace?.name) parts.push(cogs.workplace.name)
  return parts.length > 0 ? parts.join(' - ') : 'Not specified'
}

const formatGender = (gender) => {
  if (!gender) return 'Not specified'
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
}

const formatStatus = (status) => {
  if (!status) return 'Pending'
  return status === 'Approved' ? 'Valid and Active' : status
}

const qrCodeData = computed(() => {
  const baseUrl = window.location.origin
  if (!cogsData.value) return ''
  const certIdentifier = cogsData.value.registration_no?.registration_no || cogsData.value.id
  return `${baseUrl}/verify-cogs?cert_number=${certIdentifier}`
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-')
}

const downloadCertificate = () => {
  const element = document.getElementById('cogs-certificate-content')
  const regNo = cogsData.value?.registration_no?.registration_no
  const id = cogsData.value?.id
  const filename = `cogs_certificate_${regNo || id || 'unknown'}.pdf`

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }

  html2pdf().from(element).set(opt).save()
}
</script>
