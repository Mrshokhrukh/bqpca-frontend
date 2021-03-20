<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Branch ECPF Establishment</h1>
      <p class="text-gray-600">Please fill in the details below for branch ECPF establishment.</p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <!-- Personal Information (from Individual ECPF) -->
        <section class="mb-8">
          <!-- ... (Personal Information Fields - Same as Individual ECPF) ... -->
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input id="cid_no" type="text" v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant's Name:</label>
              <input id="applicant_name" type="text" v-model="formData.applicant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input id="gender" type="text" v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="date_of_birth" type="text" v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700">Contact No:</label>
              <input id="contact_no" type="number" v-model="formData.contact_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input id="email_address" type="email" v-model="formData.email_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Residential/Present Address (from Individual ECPF) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700">Office Number:</label>
              <input id="office_number" type="number" v-model="formData.office_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="flat_no" class="block text-sm font-medium text-gray-700">Flat No:</label>
              <input id="flat_no" type="text" v-model="formData.flat_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="building_no" class="block text-sm font-medium text-gray-700">Building No:</label>
              <input id="building_no" type="text" v-model="formData.building_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">Location:</label>
              <select id="location" v-model="formData.location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="gewog_throm" class="block text-sm font-medium text-gray-700">Gewog/Throm:</label>
              <select id="gewog_throm" v-model="formData.gewog_throm"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="gt in gewogThroms" :key="gt.id" :value="gt.id">{{ gt.name }}</option>
              </select>
            </div>
            <div>
              <label for="dzongkhag_thromde" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:</label>
              <select id="dzongkhag_thromde" v-model="formData.dzongkhag_thromde"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="dt in dzongkhagThromdes" :key="dt.id" :value="dt.id">{{ dt.name }}</option>
              </select>
            </div>
          </div>
        </section>
        <!-- Education Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Qualification:</label>
              <input id="qualification" type="text" v-model="formData.qualification"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="institute_name" class="block text-sm font-medium text-gray-700">Name of Institute:</label>
              <input id="institute_name" type="text" v-model="formData.institute_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="university_name" class="block text-sm font-medium text-gray-700">Name of University:</label>
              <input id="university_name" type="text" v-model="formData.university_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Permanent Address -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Permanent Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="village_chiwog" class="block text-sm font-medium text-gray-700">Village/Chiwog:</label>
              <input id="village_chiwog" type="text" v-model="formData.village_chiwog" disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog:</label>
              <input id="gewog" type="text" v-model="formData.gewog" disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="dungkhag" class="block text-sm font-medium text-gray-700">Dungkhag:</label>
              <input id="dungkhag" type="text" v-model="formData.dungkhag" disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="dzongkhag_thromde_perm" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:</label>
              <input id="dzongkhag_thromde_perm" type="text" v-model="formData.dzongkhag_thromde_perm" disabled
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Branch ECPF Establishment Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Branch ECPF Establishment Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700">Name of the Existing
                ECPF:</label>
              <input id="existing_ecpf_name" type="text" v-model="formData.existing_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_firm_address" class="block text-sm font-medium text-gray-700">Address of the Proposed
                Firm:</label>
              <input id="proposed_firm_address" type="text" v-model="formData.proposed_firm_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_firm_location" class="block text-sm font-medium text-gray-700">Location of the
                Proposed Firm:</label>
              <select id="proposed_firm_location" v-model="formData.proposed_firm_location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="firm_type" class="block text-sm font-medium text-gray-700">Type of Firm:</label>
              <select id="firm_type" v-model="formData.firm_type"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="type in firmTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Infrastructure -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Infrastructure</h2>
          <div v-for="(infra, index) in formData.infrastructure" :key="index"
            class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 border-b pb-4">
            <div>
              <label :for="`particulars_${index}`" class="block text-sm font-medium text-gray-700">Particulars:</label>
              <select :id="`particulars_${index}`" v-model="infra.particulars"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option v-for="item in infrastructureOptions" :key="item.id" :value="item.id">{{ item.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`description_${index}`" class="block text-sm font-medium text-gray-700">Description:</label>
              <input :id="`description_${index}`" type="text" v-model="infra.description"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`quantity_${index}`" class="block text-sm font-medium text-gray-700">Quantity:</label>
              <input :id="`quantity_${index}`" type="number" v-model="infra.quantity"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`remarks_${index}`" class="block text-sm font-medium text-gray-700">Remarks:</label>
              <input :id="`remarks_${index}`" type="text" v-model="infra.remarks"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <button type="button" @click="removeInfrastructure(index)" class="text-red-600 hover:text-red-800 self-end">Remove</button>
          </div>
          <button type="button" @click="addInfrastructure"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add More
          </button>
        </section>

        <!-- Human Resource -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Human Resource</h2>
          <div v-for="(hr, index) in formData.humanResources" :key="index"
            class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 border-b pb-4">
            <div>
              <label :for="`position_${index}`" class="block text-sm font-medium text-gray-700">Position:</label>
              <select :id="`position_${index}`" v-model="hr.position"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option v-for="pos in positionOptions" :key="pos.id" :value="pos.id">{{ pos.name }}</option>
              </select>
            </div>
            <div>
              <label :for="`cid_${index}`" class="block text-sm font-medium text-gray-700">CID:</label>
              <input :id="`cid_${index}`" type="text" v-model="hr.cid"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`full_name_${index}`" class="block text-sm font-medium text-gray-700">Full Name:</label>
              <input :id="`full_name_${index}`" type="text" v-model="hr.full_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`qualification_${index}`" class="block text-sm font-medium text-gray-700">Qualification:</label>
              <select :id="`qualification_${index}`" v-model="hr.qualification"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option v-for="qual in qualificationOptions" :key="qual.id" :value="qual.id">{{ qual.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`contact_number_${index}`" class="block text-sm font-medium text-gray-700">Contact Number:</label>
              <input :id="`contact_number_${index}`" type="number" v-model="hr.contact_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`email_address_${index}`" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input :id="`email_address_${index}`" type="email" v-model="hr.email_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`cv_certificates_${index}`" class="block text-sm font-medium text-gray-700">CV &
                Certificates:</label>
              <input :id="`cv_certificates_${index}`" type="file"
                @change="handleFileUpload($event, 'humanResources', index, 'cv_certificates')" class="mt-1 block w-full">
            </div>
            <button type="button" @click="removeHumanResource(index)" class="text-red-600 hover:text-red-800 self-end">Remove</button>
          </div>
          <button type="button" @click="addHumanResource"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add More
          </button>
        </section>

        <!-- Declaration -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Declaration</h2>
          <div>
            <label for="declaration" class="block text-sm font-medium text-gray-700">Declaration:</label>
            <select id="declaration" v-model="formData.declaration"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option v-for="declarationOption in declarationOptions" :key="declarationOption.id"
                :value="declarationOption.id">{{ declarationOption.name }}</option>
            </select>
          </div>
        </section>

        <div class="flex justify-end space-x-4">
          <button type="button" @click="saveAsDraft"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200">
            Save as Draft
          </button>
          <button type="submit" :disabled="formData.declaration === null"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiServices from '@/services/services';

const formData = ref({
  // ... (Fields from Individual ECPF) ...
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  contact_no: '',
  email_address: '',
  office_number: '',
  flat_no: '',
  building_no: '',
  location: null,
  gewog_throm: null,
  dzongkhag_thromde: null,
  qualification: '',
  institute_name: '',
  university_name: '',

  // Permanent Address
  village_chiwog: '',
  gewog: '',
  dungkhag: '',
  dzongkhag_thromde_perm: '',

  // Branch ECPF Establishment Proposal Details
  existing_ecpf_name: '',
  proposed_firm_address: '',
  proposed_firm_location: null,
  firm_type: null,

  // Infrastructure
  infrastructure: [],

  // Human Resource
  humanResources: [],

  // Declaration
  declaration: null, // Must be selected to enable submit
});

// Static master data (for now)
const locations = ref([
  { id: 'loc1', name: 'Thimphu' },
  { id: 'loc2', name: 'Paro' },
  { id: 'loc3', name: 'Punakha' },
]);
const gewogThroms = ref([
  { id: 'gt1', name: 'Thimphu Gewog 1' },
  { id: 'gt2', name: 'Thimphu Gewog 2' },
  { id: 'gt3', name: 'Paro Gewog 1' },
]);
const dzongkhagThromdes = ref([
  { id: 'dt1', name: 'Thimphu Thromde' },
  { id: 'dt2', name: 'Paro Thromde' },
]);

const firmTypes = ref([
  { id: 'ft1', name: 'Independent' },
  { id: 'ft2', name: 'Collaboration' }
]);
const infrastructureOptions = ref([
  { id: 'io1', name: 'Room' },
  { id: 'io2', name: 'Computer' },
  { id: 'io3', name: 'Table' },
]);
const positionOptions = ref([
  { id: 'po1', name: 'Counselor' },
  { id: 'po2', name: 'HR Manager' },
  { id: 'po3', name: 'Accountant' }
]);
const qualificationOptions = ref([
  { id: 'qo1', name: 'Masters' },
  { id: 'qo2', name: 'Bachelors' },
  { id: 'qo3', name: 'Diploma' },
]);

const declarationOptions = ref([
  { id: 1, name: 'Agree' },
  { id: 2, name: 'Not Agree' }
]);

// --- Add/Remove Functions ---
const addInfrastructure = () => {
  formData.value.infrastructure.push({
    particulars: null,
    description: '',
    quantity: null,
    remarks: ''
  });
};
const removeInfrastructure = (index) => {
  formData.value.infrastructure.splice(index, 1);
};

const addHumanResource = () => {
  formData.value.humanResources.push({
    position: null,
    cid: '',
    full_name: '',
    qualification: null,
    contact_number: '',
    email_address: '',
    cv_certificates: null // Store the File object here
  });
};

const removeHumanResource = (index) => {
  formData.value.humanResources.splice(index, 1);
};

// --- File Upload Handler ---
const handleFileUpload = (event, fieldName, index, fileKey) => {
  const file = event.target.files[0];
  if (!file) return;

  if (fieldName === 'humanResources') {
    formData.value.humanResources[index][fileKey] = file;
  } // You can extend this for other file fields if needed
};


// --- Form Submission and Draft ---
const submitForm = async () => {
  try {
    if (!validateForm()) {
      return;
    }
    const dataToSubmit = await prepareDataForSubmission();
    const response = await apiServices.submitBranchEcpfApplication(dataToSubmit);

    if (response.status === 201) {
      alert('Application submitted successfully!');
      resetForm();
    } else {
      alert('An error occurred while submitting the application.');
      console.error("API Error:", response);
    }
  } catch (error) {
    alert('An unexpected error occurred.');
    console.error("Submission Error:", error);
  }
};

const saveAsDraft = async () => {
  try {
    const dataToSubmit = await prepareDataForSubmission();
    const response = await apiServices.saveBranchEcpfDraft(dataToSubmit);  // Different API endpoint

    if (response.status === 200 || response.status === 201) { // Adjust status codes as needed
      alert('Application saved as draft successfully!');
      // Optionally, you might want to update the form with an ID
    } else {
      alert('An error occurred while saving the draft.');
      console.error("API Error:", response);
    }
  } catch (error) {
    alert('An unexpected error occurred.');
    console.error("Draft Save Error:", error);
  }
};


// --- Validation Function ---
const validateForm = () => {
  let isValid = true;

  // --- Individual ECPF Validations (Example) ---
  if (!formData.value.contact_no) {
    alert('Contact Number is required.');
    isValid = false;
  }
  if (!formData.value.email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email_address)) {
    alert('Please enter a valid Email Address.');
    isValid = false;
  }
  if (formData.value.location === null) {
    alert("Please select a Location");
    isValid = false;
  }

  // --- Branch-specific Validations ---
  if (!formData.value.existing_ecpf_name) {
    alert('Existing ECPF Name is required.');
    isValid = false;
  }
  if (!formData.value.proposed_firm_address) {
    alert('Proposed Firm Address is required.');
    isValid = false;
  }
  if (formData.value.proposed_firm_location === null) {
    alert('Proposed Firm Location is required.');
    isValid = false;
  }
  // Validate Infrastructure
  for (const infra of formData.value.infrastructure) {
    if (infra.particulars === null || infra.description === '' || infra.quantity === null) {
      alert('Please fill in all infrastructure details.');
      isValid = false;
      break; // Exit the loop if any item is invalid
    }
    if (infra.particulars === 'io1' && infra.quantity < 2) { // Assuming 'io1' is 'Room'
      alert('At least two rooms are required.');
      isValid = false;
      break;
    }
  }

  // Validate Human Resources (at least one counselor)
  let hasCounselor = false;
  const counselorPositions = new Set(); //to track counselor and prevent duplicates

  for (const hr of formData.value.humanResources) {
    if (!hr.position || !hr.cid || !hr.full_name || !hr.qualification || !hr.contact_number || !hr.email_address) {
      alert('Please fill in all human resource details.');
      isValid = false;
      break;
    }

    if (hr.position === 'po1') { // Assuming 'po1' is 'Counselor'
      hasCounselor = true;

      // Check for duplicate counselors
      if (counselorPositions.has(hr.cid)) {
        alert('Duplicate counselor CID found.');
        isValid = false;
        break;
      }
      counselorPositions.add(hr.cid);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hr.email_address)) {
      alert('Please enter a valid email address for the human resource.');
      isValid = false;
      break; // Exit loop on error
    }
  }

  if (!hasCounselor) {
    alert('At least one Counselor is required.');
    isValid = false;
  }

  return isValid;
};

// --- Data Preparation ---
const prepareDataForSubmission = async () => {
  const rawData = JSON.parse(JSON.stringify(formData.value)); // Deep copy

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const convertFiles = async (data) => {
    // Human Resources files
    if (data.humanResources && Array.isArray(data.humanResources)) {
      for (const hr of data.humanResources) {
        if (hr.cv_certificates) {
          hr.cv_certificates = await toBase64(hr.cv_certificates);
        }
      }
    }
    return data;
  };

  let backendData = await convertFiles(rawData);

  // *** IMPORTANT: ADJUST THIS DATA MAPPING TO MATCH YOUR BACKEND API EXPECTATIONS ***
  const submissionData = {
    applicant_cid: backendData.cid_no,
    fullName: backendData.applicant_name,
    gender: backendData.gender,
    dob: backendData.date_of_birth,
    contactNumber: backendData.contact_no,
    email: backendData.email_address,
    presentAddress: {
      officeNumber: backendData.office_number,
      flatNo: backendData.flat_no,
      buildingNo: backendData.building_no,
      locationId: backendData.location, // Assuming backend uses IDs for locations
      gewogThromId: backendData.gewog_throm,
      dzongkhagThromdeId: backendData.dzongkhag_thromde,
    },
    educationDetails: {
      qualification: backendData.qualification,
      instituteName: backendData.institute_name,
      universityName: backendData.university_name,
    },
    permanentAddress: {
      villageChiwog: backendData.village_chiwog,
      gewog: backendData.gewog,
      dungkhag: backendData.dungkhag,
      dzongkhagThromde: backendData.dzongkhag_thromde_perm,
    },
    branchProposal: {
      existingEcpfName: backendData.existing_ecpf_name,
      proposedFirmAddress: backendData.proposed_firm_address,
      proposedFirmLocationId: backendData.proposed_firm_location,
      firmTypeId: backendData.firm_type,
    },
    infrastructure: backendData.infrastructure.map(infra => ({
      particularsId: infra.particulars,
      description: infra.description,
      quantity: infra.quantity,
      remarks: infra.remarks,
    })),
    humanResources: backendData.humanResources.map(hr => ({
      positionId: hr.position,
      cid: hr.cid,
      fullName: hr.full_name,
      qualificationId: hr.qualification,
      contactNumber: hr.contact_number,
      email: hr.email_address,
      cvCertificates: hr.cv_certificates, // Assuming base64 encoded file is okay
    })),
    declarationId: backendData.declaration,
    // ... Add other fields based on your backend API requirements
  };

  return submissionData;
};


// --- Fetch Master Data --- (Optional, for future API calls)
const fetchMasterData = async () => {
  try {
    // No API calls for master data since we're using static data for now.
    // You can add API calls back in here later, if necessary.
  } catch (error) {
    console.error("Error fetching master data:", error);
    alert("Failed to load master data.  Please refresh the page.");
  }
};
const autoPopulate = async () => {
  try {
    const cid = formData.value.cid_no;
    if (!cid) return;

    if (typeof apiServices.getUserByCID === 'function') {
      const userDetails = await apiServices.getUserByCID(cid);

      if (userDetails && userDetails.data) {
        // Auto-populate basic details
        formData.value.applicant_name = userDetails.data.name;
        formData.value.gender = userDetails.data.gender;
        formData.value.date_of_birth = userDetails.data.dob;

        // Auto-populate Permanent Address (if available in the response)
        formData.value.village_chiwog = userDetails.data.village || '';  // Use empty string as fallback
        formData.value.gewog = userDetails.data.gewog || '';
        formData.value.dungkhag = userDetails.data.dungkhag || '';
        formData.value.dzongkhag_thromde_perm = userDetails.data.dzongkhag || '';
      }
    } else {
      console.error("apiServices.getUserByCID is not a function");
    }
  } catch (error) {
    console.error("Error auto-populating data:", error);
    alert("Could not auto-populate user details."); // Provide user feedback
  }
};
// --- Reset Form ---
const resetForm = () => {
  formData.value = JSON.parse(JSON.stringify({
    cid_no: '',
    applicant_name: '',
    gender: '',
    date_of_birth: '',
    contact_no: '',
    email_address: '',
    office_number: '',
    flat_no: '',
    building_no: '',
    location: null,
    gewog_throm: null,
    dzongkhag_thromde: null,
    qualification: '',
    institute_name: '',
    university_name: '',
    village_chiwog: '',
    gewog: '',
    dungkhag: '',
    dzongkhag_thromde_perm: '',
    existing_ecpf_name: '',
    proposed_firm_address: '',
    proposed_firm_location: null,
    firm_type: null,
    infrastructure: [],
    humanResources: [],
    declaration: null,
  }));
};

watch(() => formData.value.cid_no, autoPopulate);

onMounted(() => {
  fetchMasterData(); // Call fetchMasterData on mount
  // Initialize infrastructure and humanResources with one empty item each for better UI
  if (formData.value.infrastructure.length === 0) {
    addInfrastructure();
  }
  if (formData.value.humanResources.length === 0) {
    addHumanResource();
  }
});

</script>