<template>
  <div v-if="showModal" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Modal backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="relative bg-cover bg-center shadow-xl p-8 print:shadow-none background-image-class a4-page"
            :style="{ backgroundImage: `url(${BackGround})` }">
            <!-- Header with Logos and Agency Name -->
            <div class="flex flex-col items-center mb-4 print:mb-2">
              <!-- Header Logos and Text Row -->
              <div class="flex w-full justify-between items-center mb-2">
                <!-- Left Logo -->
                <div class="relative h-40 w-40 overflow-hidden rounded-xl shadow-none print:h-16 print:w-16">
                  <img src="@/assets/rgob.png" alt="RGoB Logo"
                    class="h-full w-full object-contain print:shadow-none" />
                  <div class="absolute inset-0 ring-1 ring-gray-200 rounded-xl"></div>
                </div>

                <!-- Center Text -->
                <div class="flex flex-col items-center">
                  <span class="text-xl font-dzongkha leading-tight text-gray-700 text-center print:text-lg">
                    འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
                  </span>
                  <span class="text-xl font-semibold tracking-wide text-gray-700 text-center print:text-lg">
                    HIGHER EDUCATION QUALITY COUNCIL
                  </span>
                  <span class="text-md font-semibold tracking-wide text-gray-700 text-center print:text-lg">
                    Bhutan Qualifications and Professionals Certification Authority
                  </span>
                </div>

                <!-- Right Logo -->
                <div class="relative h-40 w-40 overflow-hidden rounded-xl shadow-none print:h-16 print:w-16">
                  <img src="@/assets/heqc-logo.png" alt="HEQC Logo"
                    class="h-full w-full object-contain print:shadow-none" />
                  <div class="absolute inset-0 ring-1 ring-gray-200 rounded-xl"></div>
                </div>
              </div>

              <!-- Reference Number and Date Row -->
              <div class="flex w-full justify-between mt-2 print:mt-1">
                <div class="text-start">
                  <p class="text-md font-semibold text-gray-700 print:text-sm">QEC No. {{ application.qec_number }}</p>
                </div>
                <div class="text-end">
                  <p class="text-md font-semibold text-gray-700 print:text-sm">{{ formatDate(application.date_of_approval) }}</p>
                </div>
              </div>
            </div>

            <!-- Certificate Title -->
            <div class="text-center mb-6 print:mb-3">
              <h2 class="text-xl font-bold text-gray-800 font-serif print:text-xl">
                Qualification Endorsement Certificate
              </h2>
            </div>

            <!-- Applicant and Qualification Details -->
            <div class="mb-4 print:mb-2">
              <div class="grid grid-cols-1 gap-y-2">
                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Name:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.applicants_name }}</div>
                  </div>
                </div>
                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Qualification Name:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.qualification?.name || 'N/A' }}</div>
                  </div>
                </div>

                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">CID No:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.cid_no }}</div>
                  </div>
                </div>
                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Mode of Study:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.type_of_course?.name || 'N/A' }}</div>
                  </div>
                </div>

                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Registration No:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.student_id_no }}</div>
                  </div>
                </div>
                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Year of Completion:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.year_of_completion }}</div>
                  </div>
                </div>

                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Name of College:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.name_of_institute }}</div>
                  </div>
                </div>
                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">State/Country:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.country }}</div>
                  </div>
                </div>
                <div>
                  <div class="grid grid-cols-2">
                    <div class="text-left pr-2 font-semibold text-gray-800 print:text-sm">Name of University:</div>
                    <div class="text-left text-gray-700 print:text-xs">{{ application.name_of_university }}</div>
                  </div>
                </div>
              </div>
            </div>


            <!-- Verification Statement -->
            <div class="mb-6 text-center italic text-gray-800 print:mb-3 print:text-sm">
              <p>"The above qualification has been verified as genuine and legitimate based on the procedure prescribed
                in the
                Guidelines for Recognition of Qualification and the provisions of the Bhutan Qualification Framework."
              </p>
            </div>

            <!-- Footer Section with Photo, Seal, and Signature -->
            <div class="relative flex justify-between items-end print:items-center">
              <!-- Sign and Seal (Left - now signature only) -->
              <div class="text-left print:text-right">
                <div class="mb-4 print:mb-2">
                  <img src="@/assets/chairman_sign.png" alt="Chairman Sign" class="w-32 print:w-24 inline-block">
                </div>
                <p class="font-bold text-gray-800 print:text-sm">
                  Bhutan Accreditation Council
                </p>
              </div>

              <!-- Passport Photo with White Border and Shadow (Right) -->
              <div class="relative">
                <div
                  class="w-[132px] h-[170px] bg-white p-1 shadow-md rounded-sm overflow-hidden print:w-[110px] print:h-[140px]">
                  <img :src="application.passport_size_photo" alt="Passport Photo" class="w-full h-full object-cover">
                </div>

                <!-- Company Seal Partially Overlapping -->
                <div
                  class="absolute -bottom-8 -right-20 w-[120px] h-[120px] print:w-[100px] print:h-[100px] opacity-70">
                  <img src="@/assets/heqc_seal.png" alt="Company Seal" class="w-full h-full object-contain">
                </div>
                <div v-if="application.is_second_copy"
                  class="absolute -bottom-24 -right-20 w-[120px] h-[120px] print:w-[100px] print:h-[100px] opacity-70">
                  <img src="@/assets/SC_seal.png" alt="Second Copy Seal" class="w-full h-full object-contain">
                </div>
              </div>

              <!-- QR Code -->
              <div class="text-right">
                <qrcode-vue :value="qrCodeData" :size="100" level="H" class="print:w-20 print:h-20"></qrcode-vue>
              </div>
            </div>

            <!-- Footer Note -->
            <div class="text-center text-xs text-gray-600 mt-6 print:mt-3 print:text-[0.6rem]">
              <p>This is an e-certificate generated digitally by the BQPCA system and is as valid as the original copy.
              </p>
            </div>

            <!-- Print Button (inside the certificate, for printing just the certificate) -->
            <div class="absolute bottom-4 right-4 print:hidden">
              <button @click="printCertificate"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <PrinterIcon class="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="$emit('close')" type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
import QrcodeVue from 'qrcode.vue';
import { computed } from 'vue';

const props = defineProps({
  showModal: Boolean,
  application: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const printCertificate = () => {
  window.print();
};

const formatDate = (isoDateString) => {
  if (!isoDateString) return 'N/A'; // Handle null or undefined dates
  try {
    const formattedDate = format(new Date(isoDateString), 'dd MMMM yyyy');
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A'; // Return N/A in case of error
  }
};

const qrCodeData = computed(() => {
  const baseUrl = 'http://localhost:5173';
  return `${baseUrl}/certification-validity/search?service_type=roq&cert_number=${props.application.qec_number}`;
});
</script>

<style scoped>
.background-image-class {
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
.a4-page {
    height: 297mm;
    margin: 0 auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

@media print {
  body {
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .a4-page {
        box-shadow: none; /* Remove shadow in print */
    }

  /* Hide close button during print */
  .print\:hidden {
    display: none !important;
  }

  /* Adjust padding and margins for print */
  .print\:p-8 {
    padding: 0.5cm !important;
  }

  .print\:mb-8 {
    margin-bottom: 0.5cm !important;
  }

  .print\:mb-6 {
    margin-bottom: 0.3cm !important;
  }

  .print\:mb-4 {
    margin-bottom: 0.2cm !important;
  }

  .print\:mt-8 {
    margin-top: 0.5cm !important;
  }
  .print\:mt-2 {
    margin-top: 0.1cm !important;
  }
  .print\:mt-1 {
    margin-top: 0.05cm !important;
  }


  .print\:text-2xl {
    font-size: 1.3em !important; /* Slightly smaller for print */
  }

  .print\:text-xl {
    font-size: 1.1em !important;
  }

  .print\:text-lg {
    font-size: 1.0em !important;
    /* Adjust as needed */
  }

  .print\:text-sm {
    font-size: 0.9em !important;
    /* Adjust as needed */
  }

  .print\:text-xs {
    font-size: 0.7em !important;
    /* Adjust as needed */
  }

  .print\:w-24 {
    width: 2cm !important;
    /* Adjust as needed */
  }

  .print\:h-24 {
    height: 2cm !important;
    /* Adjust as needed */
  }
  .print\:w-32 {
    width: 3cm !important;
  }

  .print\:w-20 {
    width: 1.5cm !important;
    /* Adjust as needed */
  }

  .print\:h-20 {
    height: 1.5cm !important;
    /* Adjust as needed */
  }

  .print\:w-16 {
    width: 1.2cm !important;
    /* Adjust as needed */
  }

  .print\:h-16 {
    height: 1.2cm !important;
  }

  .print\:h-12 {
    height: 0.8cm !important;
    /* Adjust as needed */
  }

  .print\:h-16 {
    height: 1.2cm !important;
  }

  .print\:h-8 {
    height: 0.6cm !important;
    /* Adjust as needed */
  }

  .print\:h-10 {
    height: 0.7cm !important;
    /* Adjust as needed */
  }

  .print\:text-\[0\.6rem\] {
    font-size: 0.6rem !important;
  }
}
</style>
