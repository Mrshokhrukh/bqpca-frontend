<template>
  <div class="relative bg-cover bg-center shadow-xl p-8 print:shadow-none background-image-class"
    :style="{ backgroundImage: `url(${BackGround})` }">
    <!-- Header with Logo and Agency Name -->
    <div class="flex flex-col items-center mb-6 print:mb-4">
      <!-- Logo and Agency Name Section -->
      <div class="flex items-center w-full justify-center space-x-4 ">
        <div class="relative h-48 w-48 overflow-hidden rounded-xl shadow-none">
          <img src="@/assets/rgob.png" alt="BQPCA Crest" class="h-full w-full object-contain print:shadow-none" />
          <div class="absolute inset-0 ring-1 ring-gray-200 rounded-xl"></div>
        </div>
        <div class="flex flex-col space-y-0.5">
          <span class="text-2xl font-dzongkha leading-tight text-gray-700">
            འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
          </span>
          <span class="text-2xl font-semibold tracking-wide text-gray-700">
            Bhutan Qualifications and Professionals Certification Authority
          </span>
        </div>
      </div>

      <!-- Reference Number -->
      <div class="w-full text-start mt-2">
        <p class="text-md font-semibold text-gray-700">Ref No: {{ application.qec_number }}</p>
      </div>
    </div>

    <!-- Certificate Title -->
    <div class="text-center mb-8 print:mb-4">
      <h2 class="text-3xl font-bold text-gray-800 font-serif print:text-2xl">
        Recognition of Qualification
      </h2>
      <p class="text-lg text-gray-700 mt-2 print:text-base">
        Official Certification Document
      </p>
    </div>

    <!-- Applicant and Qualification Details -->
    <div class="grid grid-cols-2 gap-4 mb-6 print:mb-3">
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">Name:</p>
        <p class="text-gray-700 print:text-xs">{{ application.applicants_name }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">CID:</p>
        <p class="text-gray-700 print:text-xs">{{ application.cid_no }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">Student ID:</p>
        <p class="text-gray-700 print:text-xs">{{ application.student_id_no }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">Qualification Name:</p>
        <p class="text-gray-700 print:text-xs">{{ application.qualification?.name || 'N/A' }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">Mode of Study:</p>
        <p class="text-gray-700 print:text-xs">{{ application.type_of_course?.name || 'N/A' }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">Year of Completion:</p>
        <p class="text-gray-700 print:text-xs">{{ application.year_of_completion }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">College Name:</p>
        <p class="text-gray-700 print:text-xs">{{ application.name_of_institute }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">University Name:</p>
        <p class="text-gray-700 print:text-xs">{{ application.name_of_university }}</p>
      </div>
      <div>
        <p class="font-semibold text-gray-800 mb-1 print:text-sm">State/Country:</p>
        <p class="text-gray-700 print:text-xs">{{ application.country }}</p>
      </div>
    </div>

    <!-- Verification Statement -->
    <div class="mb-8 text-center italic text-gray-800 print:mb-4 print:text-sm">
      <p>"The above qualification has been verified as genuine and legitimate based on the procedure prescribed in the
        Guidelines for Recognition of Qualification and the provisions of the Bhutan Qualification Framework."</p>
    </div>

    <!-- Footer Section with Photo, Seal, and Signature -->
    <div class="relative flex justify-between items-end print:items-center">
      <!-- Passport Photo with White Border and Shadow -->
      <div class="relative">
        <div
          class="w-[132px] h-[170px] bg-white p-1 shadow-md rounded-sm overflow-hidden print:w-[132px] print:h-[170px]">
          <img :src="application.passport_size_photo" alt="Passport Photo" class="w-full h-full object-cover">
        </div>

        <!-- Company Seal Partially Overlapping -->
        <div class="absolute -bottom-8 -right-20 w-[132px] h-[132px] print:w-[132px] print:h-[132px] opacity-70">
          <img src="@/assets/company_seal.png" alt="Company Seal" class="w-full h-full object-contain">
        </div>
      </div>

      <!-- Sign and Seal (Right) -->
      <div class="text-right print:text-left">
        <div class="mb-4 print:mb-2">
          <img src="@/assets/chairman_sign.png" alt="Chairman Sign" class="w-36 print:w-36 inline-block">
        </div>
        <div class="print:mb-1">
          <img src="@/assets/chairman_seal.png" alt="Chairman Seal" class="w-28 -top-8 print:w-28 inline-block">
        </div>
        <p class="font-bold text-gray-800 print:text-sm">
          Chairman,<br>Bhutan Accreditation Council
        </p>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="text-center text-xs text-gray-600 mt-8 print:mt-4 print:text-[0.6rem]">
      <p>This is an e-certificate generated digitally by the BQPCA system and is as valid as the original copy.</p>
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
</template>

<script setup>
import BackGround from '@/assets/paper-bg.jpeg';
import { PrinterIcon } from '@heroicons/vue/24/outline';

defineProps({
  application: {
    type: Object,
    required: true
  }
});

const printCertificate = () => {
  window.print();
};
</script>

<style scoped>
.background-image-class {
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

@media print {

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

  .print\:mt-8 {
    margin-top: 0.5cm !important;
  }

  .print\:text-3xl {
    font-size: 1.5em !important;
    /* Adjust as needed */
  }

  .print\:text-lg {
    font-size: 1em !important;
    /* Adjust as needed */
  }

  .print\:text-sm {
    font-size: 0.8em !important;
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
    /* Adjust as needed */
  }

  .print\:h-12 {
    height: 0.8cm !important;
    /* Adjust as needed */
  }

  .print\:h-16 {
    height: 1.2cm !important;
    /* Adjust as needed */
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
