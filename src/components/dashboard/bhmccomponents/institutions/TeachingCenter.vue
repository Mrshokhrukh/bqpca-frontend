<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">New Teaching Center Application</h2>

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

      <!-- Proposal Details (Teaching Center Details) -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Teaching Center Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="centerName" class="block text-sm font-medium text-gray-700">
              Center Name
            </label>
            <input type="text" id="centerName" v-model="formData.proposalDetails.centerName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="centerLocation" class="block text-sm font-medium text-gray-700">
              Center Location
            </label>
            <input type="text" id="centerLocation" v-model="formData.proposalDetails.centerLocation"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="cityGewogCenter" class="block text-sm font-medium text-gray-700">
              City/Gewog
            </label>
            <select id="cityGewogCenter" v-model="formData.proposalDetails.cityGewog"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="" disabled>Select City/Gewog</option>
              <option v-for="city in cityGewogOptions" :key="city.value" :value="city.value">
                {{ city.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="stateDzongkhag" class="block text-sm font-medium text-gray-700">
              State/Dzongkhag
            </label>
            <select id="stateDzongkhag" v-model="formData.proposalDetails.stateDzongkhag"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="" disabled>Select Dzongkhag</option>
              <option v-for="dzongkhag in dzongkhagOptions" :key="dzongkhag.value" :value="dzongkhag.value">
                {{ dzongkhag.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="targetCategory" class="block text-sm font-medium text-gray-700">
              Target Category
            </label>
            <input type="text" id="targetCategory" v-model="formData.proposalDetails.targetCategory"
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
  proposalDetails: {
    centerName: '',
    centerLocation: '',
    cityGewog: '',
    stateDzongkhag: '',
    targetCategory: '',
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

const cityGewogOptions = ref([
  { label: 'Thimphu Thromde', value: 'thimphu' },
  { label: 'Babesa Gewog', value: 'babesa' },
  { label: 'Chang Gewog', value: 'chang' },
  // ... more options
]);

const dzongkhagOptions = ref([
  { label: 'Thimphu', value: 'thimphu_dzongkhag' },
  { label: 'Paro', value: 'paro' },
  { label: 'Punakha', value: 'punakha' },
  // ... more options
]);

// Watch for changes in Training Institute to auto-fill proponent details
watch(() => formData.value.proponentDetails.trainingInstituteName, (newValue) => {
  if (newValue === 'rihs') {
    formData.value.proponentDetails.country = 'Bhutan';
    formData.value.proponentDetails.dzongkhag = 'Thimphu';
    formData.value.proponentDetails.cityGewog = 'Thimphu Thromde';
    formData.value.proponentDetails.addressLocation = 'Thimphu, Bhutan'; // Example address
    formData.value.proponentDetails.contactNo = '+(975) 2 322057'; // Example contact
    formData.value.proponentDetails.emailAddress = 'info@rihs.edu.bt'; // Example email
  } else if (newValue === 'kgumsb') {
    formData.value.proponentDetails.country = 'Bhutan';
    formData.value.proponentDetails.dzongkhag = 'Thimphu';
    formData.value.proponentDetails.cityGewog = 'Thimphu Thromde';
    formData.value.proponentDetails.addressLocation = 'Thimphu, Bhutan'; // Example address
    formData.value.proponentDetails.contactNo = '+(975) 2 330556'; // Example contact
    formData.value.proponentDetails.emailAddress = 'info@kgumsb.edu.bt'; // Example email
  } else if (newValue === 'other') {
    // Clear auto-filled fields if 'Other Institute' is selected
    formData.value.proponentDetails.country = '';
    formData.value.proponentDetails.dzongkhag = '';
    formData.value.proponentDetails.cityGewog = '';
    formData.value.proponentDetails.addressLocation = '';
    formData.value.proponentDetails.contactNo = '';
    formData.value.proponentDetails.emailAddress = '';
  } else {
    // Handle default case or no selection
    formData.value.proponentDetails.country = '';
    formData.value.proponentDetails.dzongkhag = '';
    formData.value.proponentDetails.cityGewog = '';
    formData.value.proponentDetails.addressLocation = '';
    formData.value.proponentDetails.contactNo = '';
    formData.value.proponentDetails.emailAddress = '';
  }
});


const handleSubmit = () => {
  if (formData.value.declaration) {
    console.log('Form submitted:', formData.value);
    // In a real application, you would send formData to your backend here.
  } else {
    alert('Please declare that the information is correct before submitting.');
  }
};

const handleCancel = () => {
  console.log('Form cancelled');
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
    proposalDetails: {
      centerName: '',
      centerLocation: '',
      cityGewog: '',
      stateDzongkhag: '',
      targetCategory: '',
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
