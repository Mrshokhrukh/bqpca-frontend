<template>
  <!-- Main modal container with backdrop -->
  <div
    v-if="isOpen"
    @click.self="close"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
    aria-labelledby="certificate-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full m-4 transform transition-transform duration-300 scale-95"
      :class="{ 'scale-100': isOpen }"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 id="certificate-title" class="text-xl font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Certificate Preview
        </h2>
        <button @click="close" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label="Close modal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Certificate Content Area (for display and PDF generation) -->
      <div class="p-8 bg-gray-50 max-h-[70vh] overflow-y-auto">
        <div ref="certificateContent" id="certificate-content" class="bg-white p-10 border-2 border-gray-800 shadow-lg relative font-sans text-gray-800" style="width: 210mm; min-height: 297mm; margin: auto;">
          <!-- Watermark in the background -->
          <div class="absolute inset-0 flex items-center justify-center z-0 opacity-10 pointer-events-none">
            <img src="@/assets/mhpc-logo.png" alt="Watermark" class="w-2/3 max-w-xl" />
          </div>

          <!-- Certificate content rendered on top of the watermark -->
          <div class="relative z-10 flex flex-col h-full">
            <!-- Header Section with Logos and Titles -->
            <header class="flex justify-between items-start mb-6">
              <div class="text-center w-32">
                 <img src="@/assets/rgob.png" alt="RGOB Logo" class="h-24 mx-auto" />
                <p class="text-xs font-semibold mt-1">BQPCA</p>
              </div>
              <div class="text-center max-w-md">
                <h1 class="text-sm font-bold">Royal Government of Bhutan</h1>
                <h2 class="text-lg font-bold">Medical and Health Professionals Council</h2>
                <h3 class="text-sm">Bhutan Qualifications and Professionals Certification Authority</h3>
                <p class="text-xs mt-1">Thimphu : Bhutan</p>
              </div>
              <div class="text-center w-32">
                 <img src="@/assets/mhpc-logo.png" alt="MHPC Logo" class="h-24 mx-auto" />
                <p class="text-xs font-semibold mt-1">MHPC</p>
              </div>
            </header>

            <!-- Main Title -->
            <div class="text-center my-8">
              <h4 class="text-2xl font-bold text-blue-800 tracking-wider">CERTIFICATE OF GOOD STANDING</h4>
            </div>

            <!-- Main Content Grid -->
            <div class="flex justify-between items-start">
              <div class="grid grid-cols-[max-content,1fr] gap-x-4 gap-y-3 text-sm w-4/5">
                <div class="font-bold">Registration No.</div>
                <div>: {{ application.registration_no || 'N/A' }}</div>

                <div class="font-bold">Date of Issue</div>
                <div>: {{ issueDate }}</div>

                <div class="font-bold">Valid Till</div>
                <div>: {{ validTillDate }}</div>

                <div class="font-bold">Name</div>
                <div>: {{ application.full_name || 'N/A' }}</div>

                <div class="font-bold">Citizenship ID No.</div>
                <div>: {{ application.cid_no || 'N/A' }}</div>

                <div class="font-bold">Date of Registration</div>
                <div>: {{ registrationDate }}</div>

                <div class="font-bold">Qualification(s) and dates thereof</div>
                <div>: {{ application.department?.name || 'Not Specified' }}</div>

                <div class="font-bold">Registration Type</div>
                <div>: Full Registration</div>

                <div class="font-bold">Remarks</div>
                <div>: {{ application.endorsement_decision || 'N/A' }}</div>
              </div>

              <!-- Applicant Photo -->
              <div class="w-1/5 flex flex-col items-center">
                 <img
                    v-if="application.passport_photo"
                    :src="application.passport_photo"
                    alt="Passport Photo"
                    class="w-32 h-40 object-cover rounded-md border-2 border-gray-300 shadow-sm"
                  />
                <div v-else class="w-32 h-40 border-2 border-gray-400 bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-400 text-xs">Photo</span>
                </div>
              </div>
            </div>

            <!-- Certification Text -->
            <div class="mt-10 text-sm italic">
              <p>I hereby certify that the above information is a true copy of the entry in the register relating to the fully registered medical and health professional named above and no disciplinary proceedings are against the professional. He/she has never been the subject of an inquiry by the Professional Ethics Committee.</p>
            </div>

            <!-- Footer Section with Signature and QR Code -->
            <footer class="mt-auto pt-16">
              <div class="flex justify-between items-end">
                <!-- Left side: Signature and Director Info -->
                <div>
                  <img v-if="directorSignature" :src="directorSignature" alt="Director's Signature" class="h-12 w-auto mb-2" />
                  <div class="text-sm">
                    <p class="font-bold">{{ directorName }}</p>
                    <p>{{ directorDesignation }}</p>
                    <p>Dated: {{ issueDate }}</p>
                  </div>
                </div>

                <!-- Right side: QR Code -->
                <div class="text-center">
                  <vue-qrcode
                    :value="qrCodeData"
                    :options="{ width: 112, margin: 1, color: { dark: '#000000', light: '#ffffff' } }"
                    class="border-4 border-gray-200 rounded-md p-1"
                  />
                  <p class="mt-1 text-xs text-gray-600">Scan to verify</p>
                </div>
              </div>

              <!-- Final Note below the signature/QR code line -->
              <div class="mt-8 text-xs text-gray-600">
                <p>Note: The entry in the register reproduce above shows the name, date of full registration and qualification of the professional to whom it relates.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <!-- Modal Footer with Actions -->
      <div class="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
        <button @click="close" class="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Close</button>
        <button @click="downloadPDF" class="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import html2pdf from 'html2pdf.js';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import apiServices from '@/services/services';

// Component props to accept isOpen state and application data
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  application: { type: Object, default: null },
});

// Emits a 'close' event to the parent component
const emit = defineEmits(['close']);
const certificateContent = ref(null);
const directorName = ref('Dr. Ugyen Tshewang');
const directorDesignation = ref('Director');
const directorSignature = ref(null);

onMounted(async () => {
  try {
    const response = await apiServices.getMhpcMastersESignatures();
    if (response.data?.results?.length) {
      const activeDirector = response.data.results.find(dir => dir.status === true) || response.data.results[0];
      directorName.value = activeDirector.name;
      directorDesignation.value = activeDirector.designation;
      directorSignature.value = activeDirector.signature;
    }
  } catch (error) {
    console.error('Failed to fetch director signature:', error);
  }
});


const close = () => {
  emit('close');
};

// Helper function to format dates to DD-MM-YYYY
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};

// Computed properties to derive dates from the application object
const issueDate = computed(() => formatDate(props.application?.updated_at));
const registrationDate = computed(() => formatDate(props.application?.created_at));

const validTillDate = computed(() => {
  if (!props.application?.updated_at) return 'N/A';
  try {
    const date = new Date(props.application.updated_at);
    date.setFullYear(date.getFullYear() + 1); // Add one year for validity
    return formatDate(date);
  } catch (e) {
    console.error("Error calculating validity date:", e);
    return 'Invalid Date';
  }
});

// Computed property for QR Code data
const qrCodeData = computed(() => {
  if (!props.application) return '';
  const baseUrl = window.location.origin;
  return `${baseUrl}/certification-validity/search?service_type=cogs&cert_number=${props.application.registration_no}`;
});

// Function to trigger PDF download using html2pdf.js
const downloadPDF = () => {
  const element = document.getElementById('certificate-content');
  if (!element || !props.application) {
    console.error("Certificate content or application data is missing.");
    return;
  }

  const options = {
    margin: 0,
    filename: `COGS_${props.application.full_name.replace(/\s/g, '_')}_${props.application.registration_no}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().from(element).set(options).save();
};
</script>

<style scoped>
.scale-95 { transform: scale(0.95); }
.scale-100 { transform: scale(1); }
</style>
