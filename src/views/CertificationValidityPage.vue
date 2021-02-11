<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Check Certification Validity</h2>
        <p class="mt-2 text-sm text-gray-600">Select the certification type and enter the certification ID</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="checkValidity">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="certification-type" class="sr-only">Certification Type</label>
            <select id="certification-type" v-model="certificationType"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm">
              <option value="" disabled>Select Certification Type</option>
              <option value="education">Education</option>
              <option value="engineering">Engineering</option>
              <option value="medical">Medical</option>
              <option value="roq">ROQ</option>
            </select>
          </div>
          <div>
            <label for="certification-id" class="sr-only">Certification ID</label>
            <input id="certification-id" v-model="certificationId" type="text" autocomplete="off" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Certification ID">
          </div>
        </div>
        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Check Validity
          </button>
        </div>
      </form>
      <div v-if="result && !result.valid" class="mt-6 text-center">
        <p class="text-lg font-medium text-red-600">{{ result.message }}</p>
      </div>
    </div>
  </div>

  <!-- Modal for valid certificate details -->
  <div v-if="result && result.valid" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
    role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Certificate Details</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Certification Type: {{ certificationType }}</p>
                <p class="text-sm text-gray-500">Certification ID: {{ certificationId }}</p>
                <p class="text-sm text-gray-500">Holder Name: {{ result.details.holderName }}</p>
                <p class="text-sm text-gray-500">Issue Date: {{ result.details.issueDate }}</p>
                <p class="text-sm text-gray-500">Expiry Date: {{ result.details.expiryDate }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button @click="closeModal" type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const certificationType = ref('');
const certificationId = ref('');
const result = ref(null);

const dummyData = {
  education: [
    { id: 'EDU123', holderName: 'Alice Smith', issueDate: '2021-01-01', expiryDate: '2023-01-01' },
    { id: 'EDU456', holderName: 'Bob Johnson', issueDate: '2022-01-01', expiryDate: '2024-01-01' }
  ],
  engineering: [
    { id: 'ENG123', holderName: 'Charlie Brown', issueDate: '2021-06-01', expiryDate: '2023-06-01' },
    { id: 'ENG456', holderName: 'David Wilson', issueDate: '2022-06-01', expiryDate: '2024-06-01' }
  ],
  medical: [
    { id: 'MED123', holderName: 'Eve Davis', issueDate: '2021-09-01', expiryDate: '2023-09-01' },
    { id: 'MED456', holderName: 'Frank Miller', issueDate: '2022-09-01', expiryDate: '2024-09-01' }
  ],
  roq: [
    { id: 'ROQ123', holderName: 'Grace Lee', issueDate: '2021-12-01', expiryDate: '2023-12-01' },
    { id: 'ROQ456', holderName: 'Henry Martin', issueDate: '2022-12-01', expiryDate: '2024-12-01' }
  ]
};

const checkValidity = () => {
  if (certificationType.value && certificationId.value) {
    const certificate = dummyData[certificationType.value].find(cert => cert.id === certificationId.value);
    if (certificate) {
      result.value = {
        valid: true,
        message: 'Certification is valid.',
        details: certificate
      };
    } else {
      result.value = {
        valid: false,
        message: 'Certification is invalid.'
      };
    }
  } else {
    result.value = {
      valid: false,
      message: 'Please select a certification type and enter a certification ID.'
    };
  }
};

const closeModal = () => {
  result.value = null;
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
