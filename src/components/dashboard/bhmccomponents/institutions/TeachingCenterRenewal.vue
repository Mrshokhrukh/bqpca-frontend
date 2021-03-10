<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Institute Renewal Application</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Proponent Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="cid" class="block text-sm font-medium text-gray-700">
              CID
            </label>
            <input type="text" id="cid" v-model="formData.proponentDetails.cid" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input type="text" id="fullName" v-model="formData.proponentDetails.fullName" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <input type="text" id="gender" v-model="formData.proponentDetails.gender" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="contactNoProponent" class="block text-sm font-medium text-gray-700">
              Contact No.
            </label>
            <input type="text" id="contactNoProponent" v-model="formData.proponentDetails.contactNo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="emailAddressProponent" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input type="email" id="emailAddressProponent" v-model="formData.proponentDetails.emailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </section>

      <!-- Institute Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Institute Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="institutionName" class="block text-sm font-medium text-gray-700">
              Name of Institution
            </label>
            <select id="institutionName" v-model="formData.instituteDetails.institutionName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="" disabled>Select Institution</option>
              <option v-for="institute in instituteOptions" :key="institute.value" :value="institute.value">
                {{ institute.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="countryInstitute" class="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input type="text" id="countryInstitute" v-model="formData.instituteDetails.country" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="gewogState" class="block text-sm font-medium text-gray-700">
              Gewog/State
            </label>
            <input type="text" id="gewogState" v-model="formData.instituteDetails.gewogState" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="chiwogDzongkhag" class="block text-sm font-medium text-gray-700">
              Dzongkhag/Thromde
            </label>
            <input type="text" id="chiwogDzongkhag" v-model="formData.instituteDetails.chiwogDzongkhag" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="teachingInstitute" class="block text-sm font-medium text-gray-700">
              Teaching Institute
            </label>
            <input type="text" id="teachingInstitute" v-model="formData.instituteDetails.teachingInstitute" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
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
            <label for="headGender" class="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <input type="text" id="headGender" v-model="formData.headInstitutionDetails.gender" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="headPhoneNumber" class="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input type="text" id="headPhoneNumber" v-model="formData.headInstitutionDetails.phoneNumber" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="headEmailAddress" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input type="email" id="headEmailAddress" v-model="formData.headInstitutionDetails.emailAddress" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
        </div>
      </section>

      <!-- Remarks -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Remarks</h3>
        <div>
          <label for="remarks" class="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea id="remarks" v-model="formData.remarks" rows="3"
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
        <button type="button" class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="handleSaveDraft">
          Save as Draft
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
import { ref, watch, onMounted } from 'vue';

const formData = ref({
  proponentDetails: {
    cid: '',
    fullName: '',
    gender: '',
    contactNo: '',
    emailAddress: '',
  },
  instituteDetails: {
    institutionName: '',
    country: 'Bhutan', // Auto-filled
    gewogState: '',     // Auto-filled
    chiwogDzongkhag: '', // Auto-filled (Corrected to Dzongkhag/Thromde)
    teachingInstitute: '', // Auto-filled
  },
  headInstitutionDetails: {
    name: '',
    gender: '',
    phoneNumber: '',
    emailAddress: '',
  },
  remarks: '',
  declaration: false,
});

// Placeholder data for dropdown - Replace with actual data fetching logic
const instituteOptions = ref([
  { label: 'Bhutan Medical and Health Council', value: 'bmhc' },
  { label: 'National Medical Services', value: 'nms' },
  { label: 'Other Institute', value: 'other' },
]);

// Placeholder data for auto-filling institute details and head details
const instituteDetailsData = ref({
  'bmhc': {
    country: 'Bhutan',
    gewogState: 'Thimphu Thromde',
    chiwogDzongkhag: 'Thimphu',
    teachingInstitute: 'Yes', // Or 'Registered Teaching Institute' if more descriptive
    headName: 'Dr. Example Head BMHC',
    headGender: 'Male',
    headPhoneNumber: '+(975) 2 XXX XXXX',
    headEmailAddress: 'head@bmhc.gov.bt',
  },
  'nms': {
    country: 'Bhutan',
    gewogState: 'Thimphu Thromde',
    chiwogDzongkhag: 'Thimphu',
    teachingInstitute: 'Yes', // Or 'Registered Teaching Institute'
    headName: 'Dr. Example Head NMS',
    headGender: 'Female',
    headPhoneNumber: '+(975) 2 YYY YYYY',
    headEmailAddress: 'head@nms.gov.bt',
  },
  // ... more data for other institutes
});

// Watch for changes in Institution Name to auto-fill details
watch(() => formData.value.instituteDetails.institutionName, (newValue) => {
  if (instituteDetailsData.value[newValue]) {
    const details = instituteDetailsData.value[newValue];
    formData.value.instituteDetails.country = details.country;
    formData.value.instituteDetails.gewogState = details.gewogState;
    formData.value.instituteDetails.chiwogDzongkhag = details.chiwogDzongkhag;
    formData.value.instituteDetails.teachingInstitute = details.teachingInstitute;

    formData.value.headInstitutionDetails.name = details.headName;
    formData.value.headInstitutionDetails.gender = details.headGender;
    formData.value.headInstitutionDetails.phoneNumber = details.headPhoneNumber;
    formData.value.headInstitutionDetails.emailAddress = details.headEmailAddress;
  } else if (newValue === 'other') {
    // Clear auto-filled institute and head details if 'Other Institute' is selected
    formData.value.instituteDetails.country = '';
    formData.value.instituteDetails.gewogState = '';
    formData.value.instituteDetails.chiwogDzongkhag = '';
    formData.value.instituteDetails.teachingInstitute = '';

    formData.value.headInstitutionDetails.name = '';
    formData.value.headInstitutionDetails.gender = '';
    formData.value.headInstitutionDetails.phoneNumber = '';
    formData.value.headInstitutionDetails.emailAddress = '';
  } else {
    // Clear fields if no institute is selected or selection is cleared
    formData.value.instituteDetails.country = '';
    formData.value.instituteDetails.gewogState = '';
    formData.value.instituteDetails.chiwogDzongkhag = '';
    formData.value.instituteDetails.teachingInstitute = '';

    formData.value.headInstitutionDetails.name = '';
    formData.value.headInstitutionDetails.gender = '';
    formData.value.headInstitutionDetails.phoneNumber = '';
    formData.value.headInstitutionDetails.emailAddress = '';
  }
});

const handleSubmit = () => {
  if (formData.value.declaration) {
    console.log('Institute Renewal Form submitted:', formData.value);
    // In a real application, you would send formData to your backend here for institute renewal.
    localStorage.removeItem('instituteRenewalDraft'); // Clear draft after submission
    alert('Form submitted successfully!'); // Basic feedback for submission
  } else {
    alert('Please declare that the information is correct before submitting.');
  }
};

const handleCancel = () => {
  console.log('Institute Renewal Form cancelled');
  localStorage.removeItem('instituteRenewalDraft'); // Clear draft if cancelled
  formData.value = resetFormData(); // Use reset function
  alert('Form cancelled and draft cleared.'); // Basic feedback for cancel
};

const handleSaveDraft = () => {
  localStorage.setItem('instituteRenewalDraft', JSON.stringify(formData.value));
  console.log('Institute Renewal Form saved as draft:', formData.value);
  alert('Form saved as draft!'); // Basic feedback for draft save
};

const loadDraftData = () => {
  const draft = localStorage.getItem('instituteRenewalDraft');
  if (draft) {
    formData.value = JSON.parse(draft);
    console.log('Draft data loaded:', formData.value);
    alert('Draft data loaded. You can continue editing.'); // Basic feedback for draft load
  }
};

const resetFormData = () => ({
  proponentDetails: {
    cid: '',
    fullName: '',
    gender: '',
    contactNo: '',
    emailAddress: '',
  },
  instituteDetails: {
    institutionName: '',
    country: 'Bhutan',
    gewogState: '',
    chiwogDzongkhag: '',
    teachingInstitute: '',
  },
  headInstitutionDetails: {
    name: '',
    gender: '',
    phoneNumber: '',
    emailAddress: '',
  },
  remarks: '',
  declaration: false,
});

onMounted(() => {
  loadDraftData(); // Load draft data when component is mounted
});
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>