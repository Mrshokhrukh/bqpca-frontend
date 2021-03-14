<template>
  <div v-if="show" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Certificate of Accreditation
              </h3>
              <div class="mt-2 overflow-auto">
                <!-- Certificate Content -->
                <div class="certificate-container relative p-4 mx-auto" style="width: 800px; background-color: white;">
                  <!-- Yellow border with watermark background -->
                  <div class="absolute inset-0 border-8 border-yellow-400"></div>
                  <div class="absolute inset-2 border border-yellow-400"></div>

                  <!-- Content with proper spacing and layout -->
                  <div class="relative z-10 p-4">
                    <!-- Header with logos and title -->
                    <div class="flex justify-between items-start mb-6">
                      <img src="@/assets/rgob.png" alt="Bhutan Logo" class="w-16 h-16">
                      <div class="text-center flex-grow">
                        <!-- Bhutanese script - represented as image or proper Unicode -->
                        <div class="text-xl mb-1 bhutanese-script">དཔལ་ལྡན་འབྲུག་གཞུང་།</div>
                        <h1 class="text-xl font-bold tracking-wide">BHUTAN ACCREDITATION COUNCIL</h1>
                      </div>
                      <img src="@/assets/accred-logo.png" alt="BAC Logo" class="w-16 h-16">
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
          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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
</script>

<style scoped>
.certificate-container {
  font-family: 'Times New Roman', Times, serif;
  position: relative;
  aspect-ratio: 3/2;
}

/* Watermark background */
.certificate-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.9) 0px,
    rgba(255, 255, 255, 0.9) 20px,
    rgba(0, 0, 0, 0.05) 20px,
    rgba(0, 0, 0, 0.05) 22px
  );
  background-size: 100% 22px;
  z-index: -1;
}

/* Yellow border with inner border */
.certificate-container::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border: 1px solid #FFD700;
  z-index: -1;
}

.bhutanese-script {
  font-family: 'Jomolhari', 'Microsoft Himalaya', sans-serif;
}
</style>