<template>
  <div class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Modal backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <!-- Certificate Content -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div id="certificate-content" class="relative bg-cover bg-center a4-page p-8"
            :style="{ backgroundImage: `url(${BackGround})` }">

            <!-- Header Section -->
            <header class="mb-8 border-b pb-4">
              <!-- Header Logos and Text Row -->
              <div class="flex w-full justify-between items-center mb-2">
                <!-- Left Logo -->
                <div class="relative h-40 w-40 overflow-hidden rounded-xl">
                  <img src="@/assets/rgob.png" alt="RGoB Logo" class="h-full w-full object-contain" />
                </div>

                <!-- Center Text -->
                <div class="flex flex-col items-center">
                  <span class="text-xl font-dzongkha leading-tight text-gray-700 text-center">
                    འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
                  </span>
                  <span class="text-xl font-semibold tracking-wide text-gray-700 text-center">
                    HIGHER EDUCATION QUALITY COUNCIL
                  </span>
                  <span class="text-md font-semibold tracking-wide text-gray-700 text-center">
                    Bhutan Qualifications and Professionals Certification Authority
                  </span>
                </div>

                <!-- Right Logo -->
                <div class="relative h-40 w-40 overflow-hidden rounded-xl">
                  <img src="@/assets/heqc-logo.png" alt="HEQC Logo" class="h-full w-full object-contain" />
                </div>
              </div>

              <!-- Reference Number and Date Row -->
              <div class="flex w-full justify-between mt-4">
                <div class="text-start">
                  <p class="text-md font-semibold text-gray-700">QEC No. {{ application.qec_number }}</p>
                </div>
                <div class="text-end">
                  <p class="text-md font-semibold text-gray-700">{{ formatDate(application.updated_at) }}</p>
                </div>
              </div>
            </header>

            <!-- Certificate Title -->
            <div class="text-center mb-6">
              <h2 class="text-xl font-bold text-gray-800 font-serif">
                Qualification Endorsement Certificate
              </h2>
            </div>

            <!-- Applicant and Qualification Details -->
            <div class="content-margins">
              <div class="mb-4">
                <div class="grid grid-cols-1 gap-y-2">
                  <div v-for="(field, index) in fields" :key="index">
                    <div class="grid grid-cols-2">
                      <div class="text-left pr-2 font-semibold text-gray-800">{{ field.label }}:</div>
                      <div class="text-left text-gray-700">{{ field.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Verification Statement -->
            <div class="mb-6 text-center italic text-gray-800">
              <p>"The above qualification has been verified as genuine and legitimate based on the procedure prescribed
                in the
                Guidelines for Recognition of Qualification and the provisions of the Bhutan Qualification Framework."
              </p>
            </div>

            <!-- Signature, Photo, and QR Section -->
            <div class="flex justify-between items-end mb-16">
              <!-- Signature Area -->
              <div v-if="eSignatureData" class="flex flex-col items-start">
                <img :src="eSignatureData.signature" alt="Signature" class="w-32 mb-1">
                <p class="font-bold text-gray-800">{{ eSignatureData.name }}</p>
                <p class="text-gray-800">{{ eSignatureData.designation }}</p>
              </div>

              <!-- QR Code (Centered) -->
              <div class="absolute left-1/2 transform -translate-x-1/2" style="bottom: 120px;">
                <VueQrcode :value="qrCodeData"
                  :options="{ width: 120, color: { dark: '#000', light: '#fff' }, margin: 0 }" />
              </div>

              <!-- Photo with Seals -->
              <div class="relative">
                <!-- Scaled up photo -->
                <div class="w-[158px] h-[204px] bg-white p-1 shadow-md rounded-sm overflow-hidden">
                  <img :src="application.passport_size_photo" alt="Passport Photo" class="w-full h-full object-cover">
                </div>

                <!-- Company Seal positioned on the left side of photo -->
                <div class="absolute -bottom-8 -left-20 w-[144px] h-[144px] opacity-70">
                  <img src="@/assets/heqc_seal.png" alt="Company Seal" class="w-full h-full object-contain">
                </div>
              </div>
            </div>

            <!-- Footer -->
            <footer class="absolute bottom-0 left-0 right-0 p-4">
              <!-- Second Copy Seal (Centered) -->
              <div v-if="application.is_second_copy"
                class="absolute left-1/2 transform -translate-x-1/2 -top-24 w-[168px] h-[168px] opacity-70">
                <img src="@/assets/SC_seal.png" alt="Second Copy Seal" class="w-full h-full object-contain">
              </div>


              <div class="text-center text-xs text-gray-600 mt-6">
                <p>This is an e-certificate generated digitally by the BQPCA system and is as valid as the original
                  copy.</p>
              </div>
            </footer>
          </div>
        </div>

        <!-- Modal Footer (Now with Download Button) -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="downloadPDF" type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            <PrinterIcon class="h-4 w-4 mr-2" />
            Download PDF
          </button>
          <button @click="$emit('close')" type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BackGround from '@/assets/paper-bg.jpeg';
import { PrinterIcon } from '@heroicons/vue/24/outline';
import { format } from 'date-fns';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { computed, ref, onMounted } from 'vue';
import html2pdf from 'html2pdf.js';
import apiServices from '@/services/services';  // Replace with your actual API import

const props = defineProps({
  application: {
    type: Object,
    required: true
  }
});

const eSignatureData = ref(null);

defineEmits(['close']);

// Fetch e-signature data
onMounted(async () => {
  try {
    const response = await apiServices.getESignature();
    if (response.data.results && response.data.results.length > 0) {
      const validSignature = response.data.results.find(result => result.status === true);
      if (validSignature) {
        eSignatureData.value = validSignature;
      }
    }
  } catch (error) {
    console.error("Error fetching e-signature:", error);
  }
});



const downloadPDF = () => {
  const element = document.getElementById('certificate-content');
  const opt = {
    margin: 0,
    filename: `certificate-${props.application.qec_number}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, useCORS: true,
      letterRendering: true,
    },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
};

const formatDate = (isoDateString) => {
  return isoDateString ? format(new Date(isoDateString), 'dd MMMM yyyy') : 'N/A';
};

const qrCodeData = computed(() => {
  const baseUrl = window.location.origin; // Gets the base URL dynamically
  return `${baseUrl}/certification-validity/search?service_type=roq&cert_number=${props.application.qec_number}`;
});

//for mapping of labels dynamically
const fields = computed(() => [
  { label: 'Name', value: props.application.applicants_name },
  { label: 'Qualification Name', value: props.application.qualification?.name || 'N/A' },
  { label: 'CID No', value: props.application.cid_no },
  { label: 'Mode of Study', value: props.application.type_of_course?.name || 'N/A' },
  { label: 'Registration No', value: props.application.student_id_no },
  { label: 'Year of Completion', value: props.application.year_of_completion },
  { label: 'Name of College', value: props.application.name_of_institute },
  { label: 'State/Country', value: props.application.country },
  { label: 'Name of University', value: props.application.name_of_university },
]);
</script>

<style scoped>
.background-image-class {
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.a4-page {
  /* width: 210mm; A4 width */
  height: 297mm;
  margin: 0 auto;
  position: relative;
  background-color: white;
  box-sizing: border-box;
}

.content-margins {
  padding-left: 20mm;
  padding-right: 20mm;
}
</style>
