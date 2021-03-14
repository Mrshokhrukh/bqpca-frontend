<template>
  <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen text-center sm:block">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
        <div class="bg-white sm:p-0">
          <div class="sm:flex sm:items-start">
            <div class="mt-0 text-center sm:mt-0 sm:ml-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 sr-only" id="modal-title">  <!-- Screen Reader Only Title -->
                Certificate of Accreditation
              </h3>
              <div class="mt-0 overflow-auto p-6"> <!-- Added padding outside certificate -->
                <!-- Certificate Content -->
                <div ref="certificateElement" class="certificate-container relative mx-auto" style="width: 100%; aspect-ratio: 16/9; background-color: white;">
                  <!-- Yellow border with margin -->
                  <div class="absolute inset-4 border-8 border-yellow-400"></div>

                  <!-- Content with proper spacing and layout -->
                  <div class="relative z-10 p-12 m-4">  <!-- Increased padding inside the border -->
                    <!-- Header with logos and title -->
                    <div class="flex justify-between items-start mb-8">
                      <img src="@/assets/rgob.png" alt="Bhutan Logo" class="w-24 h-24"> <!-- Increased logo size -->
                      <div class="text-center flex-grow mx-6"> <!-- Added margin for spacing -->
                        <!-- Bhutanese script - represented as image or proper Unicode -->
                        <div class="text-xl mb-1 bhutanese-script">དཔལ་ལྡན་འབྲུག་གཞུང་།</div>
                        <h1 class="text-xl font-bold tracking-wide">BHUTAN ACCREDITATION COUNCIL</h1>
                      </div>
                      <img src="@/assets/accred-logo.png" alt="BAC Logo" class="w-24 h-24"> <!-- Increased logo size -->
                    </div>

                    <!-- Certificate number -->
                    <p class="text-center text-sm mt-2 mb-4">Accreditation Certificate No. BAC/___/AC</p>

                    <!-- Certificate title -->
                    <h2 class="text-center font-bold text-xl italic mb-6">Certificate of Accreditation</h2>

                    <!-- Certificate text -->
                    <p class="text-center text-lg mb-4">This is to certify that</p>
                    <p class="text-center font-bold text-xl mb-4">{{ certificateData.institutionName }}</p>
                    <p class="text-center text-lg mb-2">is accredited by the</p>
                    <p class="text-center font-bold text-xl mb-6">Bhutan Accreditation Council</p>
                    <p class="text-center text-lg mb-12">
                      with Grade <span class="font-bold">{{ certificateData.grade }}</span>
                      & is valid until <span class="font-bold">{{ certificateData.validUntil }}</span>
                    </p>

                    <!-- Date and signature -->
                    <div class="flex justify-between items-end mt-8">
                      <div class="text-left">
                        <p>Date: <span class="underline">{{ formattedDate }}</span></p>
                      </div>
                      <div class="text-right">
                        <p class="mb-8">___________________</p>
                        <p>Chairperson</p>
                        <p>Bhutan Accreditation Council</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="downloadPDF"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download Certificate
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
import { computed, ref } from 'vue';
import html2pdf from 'html2pdf.js';

const certificateElement = ref(null);

const props = defineProps({
  show: Boolean,
  certificateData: {
    type: Object,
    default: () => ({
      institutionName: '',
      grade: '',
      validUntil: '',
      date: ''
    })
  }
});

const emit = defineEmits(['close']);

const formattedDate = computed(() => {
  if(!props.certificateData.date) return '';
  return new Date(props.certificateData.date).toLocaleDateString();
});

const closeModal = () => {
  emit('close');
};

const downloadPDF = () => {
  if (!certificateElement.value) return;

  const element = certificateElement.value;
  const filename = `${props.certificateData.institutionName.replace(/\s+/g, '_')}_Certificate.pdf`;

  const opt = {
    margin:       0,
    filename:     filename,
    image:        { type: 'jpeg', quality: 1 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: [297, 167], orientation: 'landscape' } // Approximately 16:9 ratio
  };

  // Process the HTML and save as PDF
  html2pdf().set(opt).from(element).save();
};
</script>

<style scoped>
.certificate-container {
  font-family: 'Times New Roman', Times, serif;
  position: relative;
  max-width: 1200px;
}

/* Watermark background with dense horizontal text */
.certificate-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='25%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='rgba(0,128,128,0.15)' font-family='Times New Roman'%3EBhutan Accreditation Council%3C/text%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 40px; /* Smaller size for more repetition */
  z-index: 0;
  pointer-events: none;
}

.bhutanese-script {
  font-family: 'Jomolhari', 'Microsoft Himalaya', sans-serif;
}
</style>