<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">New Educational Programme Application</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Proponent Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="trainingInstituteName" class="block text-sm font-medium text-gray-700">
              Training Institute Name
            </label>
            <select id="trainingInstituteName" v-model="formData.proponentDetails.trainingInstituteName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="" disabled>Select Institute</option>
              <option v-for="institute in instituteOptions" :key="institute.value" :value="institute.value">
                {{ institute.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input type="text" id="country" v-model="formData.proponentDetails.country" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">
              Dzongkhag/Throme
            </label>
            <input type="text" id="dzongkhag" v-model="formData.proponentDetails.dzongkhag" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="cityGewogProponent" class="block text-sm font-medium text-gray-700">
              City/Gewog
            </label>
            <input type="text" id="cityGewogProponent" v-model="formData.proponentDetails.cityGewog" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="addressLocation" class="block text-sm font-medium text-gray-700">
              Address/Location
            </label>
            <input type="text" id="addressLocation" v-model="formData.proponentDetails.addressLocation"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="contactNo" class="block text-sm font-medium text-gray-700">
              Contact No.
            </label>
            <input type="text" id="contactNo" v-model="formData.proponentDetails.contactNo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="emailAddress" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input type="email" id="emailAddress" v-model="formData.proponentDetails.emailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </section>

      <!-- Head of Institution Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Head of Institution Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="headName" class="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input type="text" id="headName" v-model="formData.headInstitutionDetails.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="headMobileNo" class="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input type="text" id="headMobileNo" v-model="formData.headInstitutionDetails.mobileNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="headEmailAddress" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input type="email" id="headEmailAddress" v-model="formData.headInstitutionDetails.emailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </section>

      <!-- Website -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Website</h3>
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input type="text" id="website" v-model="formData.website"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </section>

      <!-- Proposal Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Proposal Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="proposalTitle" class="block text-sm font-medium text-gray-700">
              Proposal Title
            </label>
            <input type="text" id="proposalTitle" v-model="formData.proposalDetails.proposalTitle"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">
              Duration (in months)
            </label>
            <input type="number" id="duration" v-model="formData.proposalDetails.duration"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="commencementDate" class="block text-sm font-medium text-gray-700">
              Commencement Date
            </label>
            <input type="date" id="commencementDate" v-model="formData.proposalDetails.commencementDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="attachments" class="block text-sm font-medium text-gray-700">
              Attachments (if any)
            </label>
            <input type="file" id="attachments" multiple
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <p class="mt-1 text-sm text-gray-500" id="file_input_help">You can attach relevant documents here.</p>
          </div>
        </div>
        <div>
          <label for="remarks" class="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea id="remarks" v-model="formData.proposalDetails.remarks" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
      </section>

      <!-- Declaration -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input id="declaration" aria-describedby="declaration-description" type="checkbox"
            v-model="formData.declaration"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration</label>
          <p id="declaration-description" class="text-gray-500">
            I hereby declare that the information provided above is true and correct to the best of my knowledge.
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-4">
        <button type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="handleCancel">
          Cancel
        </button>
        <button type="submit" :disabled="!formData.declaration"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :class="{ 'opacity-50 cursor-not-allowed': !formData.declaration }">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const formData = ref({
  proponentDetails: {
    trainingInstituteName: '',
    country: 'Bhutan', // Auto-filled
    dzongkhag: '',     // Auto-filled
    cityGewog: '',     // Auto-filled
    addressLocation: '', // Auto-filled, editable
    contactNo: '',     // Auto-filled, editable
    emailAddress: '',    // Auto-filled, editable
  },
  headInstitutionDetails: {
    name: '',           // Auto-filled, editable
    mobileNumber: '',   // Auto-filled, editable
    emailAddress: '',  // Auto-filled, editable
  },
  website: '',
  proposalDetails: {
    proposalTitle: '',
    duration: null,
    commencementDate: null,
    attachments: null, // Handle file uploads if needed
    remarks: '',
  },
  declaration: false,
});

// Placeholder data for dropdowns - Replace with actual data fetching logic
const instituteOptions = ref([
  { label: 'Royal Institute of Health Sciences', value: 'rihs' },
  { label: 'Khesar Gyalpo University of Medical Sciences of Bhutan', value: 'kgumsb' },
  { label: 'Other Institute', value: 'other' },
]);

// Placeholder data for Head of Institution Details (replace with actual data source)
const headOfInstitutionData = ref({
  'rihs': {
    name: 'Dr. Tashi Wangchuk', // Example Head Name for RIHS
    mobileNumber: '+(975) 17XXXXXXX', // Example Mobile for RIHS
    emailAddress: 'head@rihs.edu.bt', // Example Email for RIHS
  },
  'kgumsb': {
    name: 'Dr. Sonam Jamtsho', // Example Head Name for KGUMSB
    mobileNumber: '+(975) 17YYYYYYY', // Example Mobile for KGUMSB
    emailAddress: 'head@kgumsb.edu.bt', // Example Email for KGUMSB
  },
  // ... more data for other institutes
});


// Watch for changes in Training Institute to auto-fill proponent and head details
watch(() => formData.value.proponentDetails.trainingInstituteName, (newValue) => {
  if (newValue === 'rihs') {
    formData.value.proponentDetails.country = 'Bhutan';
    formData.value.proponentDetails.dzongkhag = 'Thimphu';
    formData.value.proponentDetails.cityGewog = 'Thimphu Thromde';
    formData.value.proponentDetails.addressLocation = 'Thimphu, Bhutan'; // Example address
    formData.value.proponentDetails.contactNo = '+(975) 2 322057'; // Example contact
    formData.value.proponentDetails.emailAddress = 'info@rihs.edu.bt'; // Example email

    // Auto-fill Head of Institution Details for RIHS
    formData.value.headInstitutionDetails.name = headOfInstitutionData.value['rihs'].name;
    formData.value.headInstitutionDetails.mobileNumber = headOfInstitutionData.value['rihs'].mobileNumber;
    formData.value.headInstitutionDetails.emailAddress = headOfInstitutionData.value['rihs'].emailAddress;

  } else if (newValue === 'kgumsb') {
    formData.value.proponentDetails.country = 'Bhutan';
    formData.value.proponentDetails.dzongkhag = 'Thimphu';
    formData.value.proponentDetails.cityGewog = 'Thimphu Thromde';
    formData.value.proponentDetails.addressLocation = 'Thimphu, Bhutan'; // Example address
    formData.value.proponentDetails.contactNo = '+(975) 2 330556'; // Example contact
    formData.value.proponentDetails.emailAddress = 'info@kgumsb.edu.bt'; // Example email

    // Auto-fill Head of Institution Details for KGUMSB
    formData.value.headInstitutionDetails.name = headOfInstitutionData.value['kgumsb'].name;
    formData.value.headInstitutionDetails.mobileNumber = headOfInstitutionData.value['kgumsb'].mobileNumber;
    formData.value.headInstitutionDetails.emailAddress = headOfInstitutionData.value['kgumsb'].emailAddress;

  } else if (newValue === 'other') {
    // Clear auto-filled proponent and head details if 'Other Institute' is selected
    formData.value.proponentDetails.country = '';
    formData.value.proponentDetails.dzongkhag = '';
    formData.value.proponentDetails.cityGewog = '';
    formData.value.proponentDetails.addressLocation = '';
    formData.value.proponentDetails.contactNo = '';
    formData.value.proponentDetails.emailAddress = '';

    formData.value.headInstitutionDetails.name = '';
    formData.value.headInstitutionDetails.mobileNumber = '';
    formData.value.headInstitutionDetails.emailAddress = '';

  } else {
    // Handle default case or no selection for institute
    formData.value.proponentDetails.country = '';
    formData.value.proponentDetails.dzongkhag = '';
    formData.value.proponentDetails.cityGewog = '';
    formData.value.proponentDetails.addressLocation = '';
    formData.value.proponentDetails.contactNo = '';
    formData.value.proponentDetails.emailAddress = '';

    formData.value.headInstitutionDetails.name = '';
    formData.value.headInstitutionDetails.mobileNumber = '';
    formData.value.headInstitutionDetails.emailAddress = '';
  }
});


const handleSubmit = () => {
  if (formData.value.declaration) {
    console.log('New Educational Programme Form submitted:', formData.value);
    // In a real application, you would send formData to your backend here for new program application.
  } else {
    alert('Please declare that the information is correct before submitting.');
  }
};

const handleCancel = () => {
  console.log('New Educational Programme Form cancelled');
  // Reset form data or handle cancel action as needed
  formData.value = {
    proponentDetails: {
      trainingInstituteName: '',
      country: 'Bhutan',
      dzongkhag: '',
      cityGewog: '',
      addressLocation: '',
      contactNo: '',
      emailAddress: '',
    },
    headInstitutionDetails: {
      name: '',
      mobileNumber: '',
      emailAddress: '',
    },
    website: '',
    proposalDetails: {
      proposalTitle: '',
      duration: null,
      commencementDate: null,
      attachments: null,
      remarks: '',
    },
    declaration: false,
  };
};
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
