<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF in Collaboration with External Party</h1>
      <p class="text-gray-600">Please fill in the details below for ECPF establishment in collaboration.</p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm" ref="form">
        <!-- Personal Information (from Individual ECPF) -->
        <section class="mb-8">
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
        <!-- ECPF in Collaboration Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">ECPF in Collaboration Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700">Existing ECPF Name:</label>
              <input id="existing_ecpf_name" type="text" v-model="formData.existing_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="existing_license_number" class="block text-sm font-medium text-gray-700">Existing License
                Number of ECPF:</label>
              <input id="existing_license_number" type="text" v-model="formData.existing_license_number"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="proposed_ecpf_name" class="block text-sm font-medium text-gray-700">Proposed Name of
                ECPF:</label>
              <input id="proposed_ecpf_name" type="text" v-model="formData.proposed_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label for="proposed_location" class="block text-sm font-medium text-gray-700">Proposed Location (if applicable):</label>
                 <input id="proposed_location" type="text" v-model="formData.proposed_location" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Details of External Party -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Details of External Party</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="collaborating_firm_name" class="block text-sm font-medium text-gray-700">Name of the
                Collaborating Firm:</label>
              <input id="collaborating_firm_name" type="text" v-model="formData.collaborating_firm_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_country" class="block text-sm font-medium text-gray-700">External Party Based
                in (country):</label>
              <select id="external_party_country" v-model="formData.external_party_country"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="country in countries" :key="country.code" :value="country.code">{{ country.name }}</option>
              </select>
            </div>
            <div>
              <label for="external_party_state" class="block text-sm font-medium text-gray-700">External Party Based in
                (State):</label>
              <input id="external_party_state" type="text" v-model="formData.external_party_state"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="firm_registration_number" class="block text-sm font-medium text-gray-700">Firm’s Registration
                Number:</label>
              <input id="firm_registration_number" type="text" v-model="formData.firm_registration_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proprietor_name" class="block text-sm font-medium text-gray-700">Name of the
                Proprietor:</label>
              <input id="proprietor_name" type="text" v-model="formData.proprietor_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
               <label for="nationality" class="block text-sm font-medium text-gray-700">Nationality:</label>
                 <input id="nationality" type="text" v-model="formData.nationality" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="designation" class="block text-sm font-medium text-gray-700">Designation:</label>
              <input id="designation" type="text" v-model="formData.designation"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_email" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input id="external_party_email" type="email" v-model="formData.external_party_email"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_contact" class="block text-sm font-medium text-gray-700">Contact
                Number:</label>
              <input id="external_party_contact" type="number" v-model="formData.external_party_contact"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website:</label>
              <input id="website" type="text" v-model="formData.website"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Collaboration Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Collaboration Details</h2>
          <textarea v-model="formData.collaboration_details"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="5" placeholder="Explain the type of collaboration & other related details"></textarea>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Supporting Documents</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="concern_letter" class="block text-sm font-medium text-gray-700">Concern/Authorization
                Letter:</label>
              <input id="concern_letter" type="file" @change="handleFileUpload($event, 'concern_letter')"
                class="mt-1 block w-full">
            </div>
            <div>
              <label for="passport_cv" class="block text-sm font-medium text-gray-700">Passport & CV of Proprietor of
                External Party:</label>
              <input id="passport_cv" type="file" @change="handleFileUpload($event, 'passport_cv')"
                class="mt-1 block w-full">
            </div>
            <div>
              <label for="external_party_license" class="block text-sm font-medium text-gray-700">License/Registration
                of External Party:</label>
              <input id="external_party_license" type="file" @change="handleFileUpload($event, 'external_party_license')"
                class="mt-1 block w-full">
            </div>
            <div>
              <label for="mou" class="block text-sm font-medium text-gray-700">Valid Signed MoU:</label>
              <input id="mou" type="file" @change="handleFileUpload($event, 'mou')" class="mt-1 block w-full">
            </div>
          </div>
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
          <button type="submit" :disabled="formData.declaration !== 1"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50">
            Submit
          </button>
            <button type="button" @click="editDraft" v-if="formData.isDraft"
            class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200">
            Edit Draft
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; // Import your API service

const formData = ref({
    // --- Fields from Individual ECPF ---
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
    // --- ECPF in Collaboration Proposal Details ---
    existing_ecpf_name: '',  // Auto-populated
    existing_license_number: '', // Auto-populated
    proposed_ecpf_name: '',
    proposed_location: '',

    // --- Details of External Party ---
    collaborating_firm_name: '',
    external_party_country: null,
    external_party_state: '',
    firm_registration_number: '',
    proprietor_name: '',
    nationality: '',
    designation: '',
    external_party_email: '',
    external_party_contact: '',
    website: '',

    // --- Collaboration Details ---
    collaboration_details: '',

    // --- Supporting Documents ---
    concern_letter: null,
    passport_cv: null,
    external_party_license: null,
    mou: null,

    // --- Draft and Declaration ---
    isDraft: false,
    draftId: null,
    declaration: null, // Add declaration field
});

// Static master data (you can move the API calls back to fetchMasterData later)
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
const countries = ref([
  { code: 'BT', name: 'Bhutan' },
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  // ... more countries
]);

const declarationOptions = ref([
     { id: 1, name: 'Agree' },
     { id: 2, name: 'Not Agree' }
]);

// --- File Upload Handler ---
const handleFileUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
        formData.value[fieldName] = file;
    }
};

// --- Form Submission and Draft Operations ---
const submitForm = async () => {
    try {
        if (!validateForm()) {
            return;
        }
      const dataToSubmit = await prepareDataForSubmission();
        const response = await apiServices.createEcpfCollaboration(dataToSubmit); // Different API endpoint

        if (response.status === 201) {
            alert('Application submitted successfully!');
            resetForm();
            formData.value.isDraft = false; // Reset draft flag
            formData.value.draftId = null;
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
        let response;
      if(formData.value.draftId){
        //update the existing draft
        response = await apiServices.updateCollaborationEcpfDraft(formData.value.draftId, dataToSubmit);
      } else {
        //save as new draft
        response = await apiServices.saveCollaborationEcpfDraft(dataToSubmit);  // Different API endpoint
      }


    if (response.status === 200 || response.status === 201) {
      alert('Application saved as draft successfully!');
       formData.value.isDraft = true; // Set draft flag
      formData.value.draftId = response.data.id; // Assuming the API returns the draft ID
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
    // --- Collaboration-specific Validation ---
    if (!formData.value.proposed_ecpf_name) {
        alert('Proposed ECPF Name is required.');
        isValid = false;
    }
    if (!formData.value.collaborating_firm_name) {
        alert('Collaborating Firm Name is required.');
        isValid = false;
    }
    if (formData.value.external_party_country === null) {
        alert('Please select the country where the external party is based.');
        isValid = false;
    }
    if (!formData.value.proprietor_name) {
        alert("Proprietor Name is Required")
        isValid = false;
    }
    if (!formData.value.external_party_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.external_party_email)) {
        alert("Enter a valid email address for external party")
        isValid =  false;
    }
    if(!formData.value.external_party_contact){
        alert("External Party contact number is required")
        isValid = false;
    }
    if(!formData.value.collaboration_details){
        alert("Collaboration Details are required")
        isValid = false
    }
     if (formData.value.declaration !== 1) { // Check declaration
        alert('You must agree to the declaration to submit.');
        isValid = false;
    }
    return isValid;
};

// --- Data Preparation ---
const prepareDataForSubmission = async () => {
    const data = JSON.parse(JSON.stringify(formData.value));
     const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const convertFiles = async (data) => {
        //convert all the files
        if(data.concern_letter){
            data.concern_letter = await toBase64(data.concern_letter);
        }
        if(data.passport_cv){
            data.passport_cv = await toBase64(data.passport_cv);
        }
        if(data.external_party_license){
            data.external_party_license = await toBase64(data.external_party_license);
        }
        if(data.mou){
            data.mou = await toBase64(data.mou);
        }
      if (data.cv) {
          data.cv = await toBase64(data.cv);
      }
        return data;
    }
    return await convertFiles(data);
};

const editDraft = () => {
    if (formData.value.draftId) {
      formData.value.isDraft = false; // Allow editing
    // Ideally fetch the draft data using draftId. For now, we will edit on the existing data.
   }
};

// --- Fetch Master Data --- (Optional, for future API calls)
const fetchMasterData = async () => {
  try {
    // You can add API calls here later if needed
  } catch (error) {
    console.error("Error fetching master data:", error);
    alert("Failed to load master data.  Please refresh the page.");
  }
};

// --- Reset Form ---
const resetForm = () => {
    // Reset to initial values (including collaboration-specific fields)
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
    existing_ecpf_name: '',
    existing_license_number: '',
    proposed_ecpf_name: '',
    proposed_location: '',
    collaborating_firm_name: '',
    external_party_country: null,
    external_party_state: '',
    firm_registration_number: '',
    proprietor_name: '',
    nationality: '',
    designation: '',
    external_party_email: '',
    external_party_contact: '',
    website: '',
    collaboration_details: '',
    concern_letter: null,
    passport_cv: null,
    external_party_license: null,
    mou: null,
    isDraft: false,
    draftId: null,
    declaration: null,
    }));
};

const autoPopulate = async () => {
 // Example: Auto-populate existing ECPF details based on CID (you'll need an API for this)
    try {
      const cid = formData.value.cid_no;
        if (!cid) return;
         if (typeof apiServices.getUserByCID === 'function') {
             const userDetails = await apiServices.getUserByCID(cid);
              if (userDetails.data) {
                formData.value.applicant_name = userDetails.data.name;
                formData.value.gender = userDetails.data.gender;
                formData.value.date_of_birth = userDetails.data.dob;
                //  formData.value.existing_ecpf_name = ...; // Fetch from API
                // formData.value.existing_license_number = ...; // Fetch from API
              }
        } else {
          console.error("apiServices.getUserByCID is not a function");
        }
    } catch(error){
        console.error("Error auto-populating data:", error);
    }
};

watch(() => formData.value.cid_no, autoPopulate);

onMounted(() => {
  fetchMasterData();
    // Check if there's a draft ID in, for example, query parameters or local storage.
    // If so, fetch the draft data and populate the form.
    const urlParams = new URLSearchParams(window.location.search);
    const draftIdFromUrl = urlParams.get('draftId');

    if (draftIdFromUrl) {
        loadDraft(draftIdFromUrl);
    }
});

// Load draft data (example - adapt to your API)
const loadDraft = async (draftId) => {
    try {
        const response = await apiServices.getCollaborationEcpfDraft(draftId); //  fetch draft by ID
        if (response.status === 200) {
            // Populate formData with the draft data
            Object.assign(formData.value, response.data); // Use Object.assign
            formData.value.isDraft = true;
            formData.value.draftId = draftId;
        } else {
            console.error("Failed to load draft:", response);
            alert("Failed to load draft.");
        }
    } catch (error) {
        console.error("Error loading draft:", error);
        alert("Error loading draft.");
    }
};

</script>