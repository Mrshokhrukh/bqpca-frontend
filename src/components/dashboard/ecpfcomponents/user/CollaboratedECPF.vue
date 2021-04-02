<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF in Collaboration with External Party</h1>
      <p class="text-gray-600">Please fill in the details below for ECPF establishment in collaboration.</p>
    </div>

    <!-- Loading/Error/Success Messages -->
    <div v-if="isLoading" class="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
      <p>Loading initial data...</p>
    </div>
    <div v-if="formMessage.text"
      :class="['mb-4 p-4 border rounded break-words', formMessage.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700']">
      <p>{{ formMessage.text }}</p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form v-if="!isLoading" @submit.prevent="submitForm" ref="formEl">

        <!-- Personal Information (Fetched from Auth Store) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input id="cid_no" type="text" v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant's Name:</label>
              <input id="applicant_name" type="text" v-model="formData.applicant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input id="gender" type="text" v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="date_of_birth" type="text" v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700">Contact No:<span
                  class="text-red-500">*</span></label>
              <input id="contact_no" type="tel" v-model="formData.contact_no" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address:<span
                  class="text-red-500">*</span></label>
              <input id="email_address" type="email" v-model="formData.email_address" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Residential/Present Address -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Fields remain the same -->
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700">Office Number:</label>
              <input id="office_number" type="text" v-model="formData.office_number"
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
              <label for="location" class="block text-sm font-medium text-gray-700">Location:<span
                  class="text-red-500">*</span></label>
              <select id="location" v-model="formData.location" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option disabled :value="null">-- Select Location --</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="gewog_throm" class="block text-sm font-medium text-gray-700">Gewog/Throm:<span
                  class="text-red-500">*</span></label>
              <select id="gewog_throm" v-model="formData.gewog_throm" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option disabled :value="null">-- Select Gewog/Throm --</option>
                <option v-for="gt in gewogThroms" :key="gt.id" :value="gt.id">{{ gt.name }}</option>
              </select>
            </div>
            <div>
              <label for="dzongkhag_thromde" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:<span
                  class="text-red-500">*</span></label>
              <select id="dzongkhag_thromde" v-model="formData.dzongkhag_thromde" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option disabled :value="null">-- Select Dzongkhag/Thromde --</option>
                <option v-for="dt in dzongkhagThromdes" :key="dt.id" :value="dt.id">{{ dt.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section class="mb-8">
          <!-- Fields remain the same -->
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Qualification:<span
                  class="text-red-500">*</span></label>
              <input id="qualification" type="text" v-model="formData.qualification" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="institute_name" class="block text-sm font-medium text-gray-700">Name of Institute:<span
                  class="text-red-500">*</span></label>
              <input id="institute_name" type="text" v-model="formData.institute_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="university_name" class="block text-sm font-medium text-gray-700">Name of University:<span
                  class="text-red-500">*</span></label>
              <input id="university_name" type="text" v-model="formData.university_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- ECPF in Collaboration Proposal Details -->
        <section class="mb-8">
          <!-- Fields remain the same -->
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">ECPF in Collaboration Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700">Existing ECPF
                Name:</label>
              <input id="existing_ecpf_name" type="text" v-model="formData.existing_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="existing_license_number" class="block text-sm font-medium text-gray-700">Existing License
                Number of ECPF:</label>
              <input id="existing_license_number" type="text" v-model="formData.existing_license_number"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="proposed_ecpf_name" class="block text-sm font-medium text-gray-700">Proposed Name of
                ECPF:<span class="text-red-500">*</span></label>
              <input id="proposed_ecpf_name" type="text" v-model="formData.proposed_ecpf_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_location" class="block text-sm font-medium text-gray-700">Proposed Location (if
                applicable):</label>
              <input id="proposed_location" type="text" v-model="formData.proposed_location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Details of External Party -->
        <section class="mb-8">
          <!-- Fields remain the same -->
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Details of External Party</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="collaborating_firm_name" class="block text-sm font-medium text-gray-700">Name of the
                Collaborating Firm:<span class="text-red-500">*</span></label>
              <input id="collaborating_firm_name" type="text" v-model="formData.collaborating_firm_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_country" class="block text-sm font-medium text-gray-700">External Party Based
                in (country):<span class="text-red-500">*</span></label>
              <select id="external_party_country" v-model="formData.external_party_country" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option disabled :value="null">-- Select Country --</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">{{ country.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="external_party_state" class="block text-sm font-medium text-gray-700">External Party Based in
                (State):<span class="text-red-500">*</span></label>
              <input id="external_party_state" type="text" v-model="formData.external_party_state" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="firm_registration_number" class="block text-sm font-medium text-gray-700">Firm’s Registration
                Number:<span class="text-red-500">*</span></label>
              <input id="firm_registration_number" type="text" v-model="formData.firm_registration_number" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proprietor_name" class="block text-sm font-medium text-gray-700">Name of the
                Proprietor:<span class="text-red-500">*</span></label>
              <input id="proprietor_name" type="text" v-model="formData.proprietor_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="nationality" class="block text-sm font-medium text-gray-700">Nationality:<span
                  class="text-red-500">*</span></label>
              <input id="nationality" type="text" v-model="formData.nationality" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="designation" class="block text-sm font-medium text-gray-700">Designation:<span
                  class="text-red-500">*</span></label>
              <input id="designation" type="text" v-model="formData.designation" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_email" class="block text-sm font-medium text-gray-700">Email Address:<span
                  class="text-red-500">*</span></label>
              <input id="external_party_email" type="email" v-model="formData.external_party_email" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_contact" class="block text-sm font-medium text-gray-700">Contact
                Number:<span class="text-red-500">*</span></label>
              <input id="external_party_contact" type="tel" v-model="formData.external_party_contact" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website:</label>
              <input id="website" type="url" v-model="formData.website" placeholder="https://example.com"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Collaboration Details -->
        <section class="mb-8">
          <!-- Field remains the same -->
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Collaboration Details<span class="text-red-500">*</span>
          </h2>
          <textarea v-model="formData.collaboration_details" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="5" placeholder="Explain the type of collaboration & other related details"></textarea>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <!-- Fields remain the same -->
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Supporting Documents</h2>
          <p class="text-sm text-gray-500 mb-4">Please upload required documents in PDF, JPG, PNG, DOC, or DOCX format.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="concern_letter" class="block text-sm font-medium text-gray-700">Concern/Authorization
                Letter:<span class="text-red-500">*</span></label>
              <input id="concern_letter" type="file" @change="handleFileUpload($event, 'concern_letter')" required
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('concern_letter')" class="text-xs text-gray-600 mt-1 block">Selected: {{
      getFileName('concern_letter') }}</span>
            </div>
            <div>
              <label for="passport_cv" class="block text-sm font-medium text-gray-700">Passport & CV of Proprietor of
                External Party:<span class="text-red-500">*</span></label>
              <input id="passport_cv" type="file" @change="handleFileUpload($event, 'passport_cv')" required
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('passport_cv')" class="text-xs text-gray-600 mt-1 block">Selected: {{
      getFileName('passport_cv') }}</span>
            </div>
            <div>
              <label for="external_party_license" class="block text-sm font-medium text-gray-700">License/Registration
                of External Party:<span class="text-red-500">*</span></label>
              <input id="external_party_license" type="file"
                @change="handleFileUpload($event, 'external_party_license')" required
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('external_party_license')" class="text-xs text-gray-600 mt-1 block">Selected: {{
      getFileName('external_party_license') }}</span>
            </div>
            <div>
              <label for="mou" class="block text-sm font-medium text-gray-700">Valid Signed MoU:<span
                  class="text-red-500">*</span></label>
              <input id="mou" type="file" @change="handleFileUpload($event, 'mou')" required
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('mou')" class="text-xs text-gray-600 mt-1 block">Selected: {{ getFileName('mou')
                }}</span>
            </div>
          </div>
        </section>

        <!-- Declaration -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Declaration<span class="text-red-500">*</span></h2>
          <div class="flex items-start space-x-3">
            <input type="checkbox" id="declaration_agree" v-model="declarationAgreed" required
              class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
            <label for="declaration_agree" class="text-sm text-gray-700">
              I hereby declare that the information provided is true and correct to the best of my knowledge and agree
              to the terms and conditions.
            </label>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
          <button type="button" @click="saveAsDraft" :disabled="isSubmitting"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button type="button" @click="editDraft" v-if="formData.isDraft" :disabled="isSubmitting"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Loading...' : 'Edit Draft' }}
          </button>
          <button type="submit" :disabled="!declarationAgreed || isSubmitting || formData.isDraft"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
      <div v-else class="text-center py-10">
        <p>Loading form data...</p>
        <!-- You could add a spinner here -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import apiServices from '@/services/services'; // Your API service
import { useAuthStore } from '@/stores/authStore'; // Your auth store

// --- Store Instance ---
const authStore = useAuthStore();

// --- State ---
const isLoading = ref(true); // Now covers initial data fetch too
const isSubmitting = ref(false);
const formMessage = reactive({ text: '', type: '' });
const formEl = ref(null);
const declarationAgreed = ref(false);

// --- Form Data ---
const getInitialFormData = () => ({
  // Auto-populated fields
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  // *** Fields to be populated by API call ***
  existing_ecpf_name: 'Loading...', // Initial placeholder
  existing_license_number: 'Loading...', // Initial placeholder
  // Editable fields
  contact_no: '',
  email_address: '', // Renamed from email for consistency if needed, or use formData.email
  office_number: '',
  flat_no: '',
  building_no: '',
  location: null,
  gewog_throm: null,
  dzongkhag_thromde: null,
  qualification: '',
  institute_name: '',
  university_name: '',
  proposed_ecpf_name: '', // This is for the *new* collaboration
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
  // Files
  concern_letter: null,
  passport_cv: null,
  external_party_license: null,
  mou: null,
  // Meta fields
  isDraft: false,
  draftId: null,
  declaration_agreed: false,
});

const formData = reactive(getInitialFormData());

// --- Master Data ---
const locations = ref([]);
const gewogThroms = ref([]);
const dzongkhagThromdes = ref([]);
const countries = ref([{ code: 'BT', name: 'Bhutan' }, { code: 'IN', name: 'India' }, /* ... more countries ... */]);

// --- Helper Functions ---
const setMessage = (text, type = 'error') => {
  formMessage.text = text;
  formMessage.type = type;
  window.scrollTo(0, 0);
};
const clearMessage = () => {
  formMessage.text = '';
  formMessage.type = '';
};
const getFileName = (fieldName) => {
  const file = formData[fieldName];
  return file instanceof File ? file.name : '';
};

// --- File Upload Handler ---
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0];
  formData[fieldName] = file || null;
  // Clear previous success messages when a file changes
  if (formMessage.type === 'success') {
    clearMessage();
  }
};

// --- Base64 Conversion --- (Keep as is)
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) { resolve(null); return; }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// --- Data Preparation (Assuming Base64) --- (Keep as is)
const prepareDataForSubmission = async (status = 'submitted') => {
  // ... (your existing implementation)
  const data = JSON.parse(JSON.stringify(formData));

  // Remove fields that shouldn't be sent directly if they are just for display
  delete data.existing_ecpf_name;
  delete data.existing_license_number;
  delete data.isDraft;
  delete data.draftId; // Assuming draftId isn't part of the collaboration payload itself

  // Add the original ECPF profile ID if needed by the backend
  // This depends on how your Collaboration model links back.
  // If it uses the logged-in user's profile implicitly, you might not need this.
  // If the Collaboration model has a ForeignKey to ECPFProfile, you might need
  // to fetch the profile ID during the initial load or pass the CID.
  // data.ecpf_profile_cid = authStore.user?.cid; // Example

  data.concern_letter = await toBase64(formData.concern_letter);
  data.passport_cv = await toBase64(formData.passport_cv);
  data.external_party_license = await toBase64(formData.external_party_license);
  data.mou = await toBase64(formData.mou);

  data.status = status; // Or maybe 'is_draft' boolean? Adjust based on backend
  data.declaration = declarationAgreed.value; // Assuming backend expects 'declaration'

  // Map frontend names to backend names if they differ
  data.email = formData.email_address; // Example if backend expects 'email'

  return data;
};


// --- Form Validation --- (Keep as is)
const validateForm = () => {
  // ... (your existing validation logic)
  clearMessage();
  let isValid = true;
  const errors = [];

  if (!formData.contact_no) errors.push('Contact Number is required.');
  if (!formData.email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
    errors.push('Please enter a valid personal Email Address.');
  }
  if (formData.location === null) errors.push("Please select a Location.");
  if (formData.gewog_throm === null) errors.push("Please select a Gewog/Throm.");
  if (formData.dzongkhag_thromde === null) errors.push("Please select a Dzongkhag/Thromde.");
  if (!formData.qualification) errors.push('Qualification is required.');
  if (!formData.institute_name) errors.push('Institute Name is required.');
  if (!formData.university_name) errors.push('University Name is required.');
  if (!formData.proposed_ecpf_name) errors.push('Proposed ECPF Name for collaboration is required.'); // Clarified label
  if (!formData.collaborating_firm_name) errors.push('Collaborating Firm Name is required.');
  if (formData.external_party_country === null) errors.push('External Party Country is required.');
  if (!formData.external_party_state) errors.push('External Party State is required.');
  if (!formData.firm_registration_number) errors.push("Firm's Registration Number is required.");
  if (!formData.proprietor_name) errors.push("Proprietor's Name is required.");
  if (!formData.nationality) errors.push("Nationality is required.");
  if (!formData.designation) errors.push("Designation is required.");
  if (!formData.external_party_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.external_party_email)) {
    errors.push("Please enter a valid Email Address for the external party.");
  }
  if (!formData.external_party_contact) errors.push("External Party Contact Number is required.");
  if (!formData.collaboration_details) errors.push("Collaboration Details are required.");

  // Check if files are present only if NOT loading a draft (where they might already exist on server)
  if (!formData.draftId) {
    if (!formData.concern_letter) errors.push("Concern/Authorization Letter is required.");
    if (!formData.passport_cv) errors.push("Passport & CV file is required.");
    if (!formData.external_party_license) errors.push("External Party License file is required.");
    if (!formData.mou) errors.push("Valid Signed MoU file is required.");
  }

  if (!declarationAgreed.value) errors.push('You must agree to the declaration to submit.');

  if (errors.length > 0) {
    setMessage(`Please fix the following errors:\n- ${errors.join('\n- ')}`);
    isValid = false;
  }
  return isValid;
};

// --- API Interaction ---

/** Fetch Master Data for Dropdowns */
const fetchMasterData = async () => {
  try {
    // Replace with actual API calls if needed
    // Example using promises for potential parallel fetching:
    // const [locRes, gtRes, dtRes] = await Promise.all([
    //     apiServices.getLocations(),
    //     apiServices.getGewogThroms(),
    //     apiServices.getDzongkhagThromdes()
    // ]);
    // locations.value = locRes.data;
    // gewogThroms.value = gtRes.data;
    // dzongkhagThromdes.value = dtRes.data;

    // Using static for now:
    locations.value = [{ id: 'loc1', name: 'Thimphu Central' }, { id: 'loc2', name: 'Paro Town' }, /* ... */];
    gewogThroms.value = [{ id: 'gt1', name: 'Chang Gewog' }, { id: 'gt2', name: 'Kawang Gewog' }, /* ... */];
    dzongkhagThromdes.value = [{ id: 'dt1', name: 'Thimphu Thromde' }, { id: 'dt2', name: 'Paro Dzongkhag' }, /* ... */];
    console.log("Master data loaded.");

  } catch (error) {
    console.error("Error fetching master data:", error);
    setMessage("Failed to load dropdown options. Please try refreshing.", "error");
    // Decide if this is critical - maybe allow form usage without dropdowns?
  }
};


/** Fetch details of the user's existing ECPF Profile using CID */
const fetchExistingEcpfProfile = async (cid) => {
  if (!cid) {
    console.warn("No CID provided to fetch ECPF profile.");
    formData.existing_ecpf_name = 'N/A';
    formData.existing_license_number = 'N/A';
    return; // Don't proceed if no CID
  }

  // Ensure the API service method exists
  if (typeof apiServices.getEcpfDetailsByCID !== 'function') {
    console.error("apiServices.getEcpfDetailsByCID method is not defined.");
    setMessage("Internal configuration error: Cannot fetch profile details.", "error");
    formData.existing_ecpf_name = 'Error';
    formData.existing_license_number = 'Error';
    return;
  }

  try {
    const response = await apiServices.getEcpfDetailsByCID(cid);
    if (response?.data) {
      console.log("Existing ECPF profile data received:", response.data);
      // --- Populate the relevant fields ---
      // Use 'proposed_firm_name' for Existing ECPF Name (based on available data)
      formData.existing_ecpf_name = response.data.proposed_firm_name || 'N/A';

      // Use 'complete_registration' for Existing License Number (assumption)
      formData.existing_license_number = response.data.complete_registration || 'N/A';
      // -------------------------------------

      // Optionally pre-fill other fields if they should match the profile
      // formData.qualification = response.data.qualification || '';
      // formData.institute_name = response.data.institute_name || '';
      // formData.university_name = response.data.university_name || '';
    } else {
      // Handle case where API returns success but no data unexpectedly
      console.warn("Received success status but no data for ECPF profile.");
      formData.existing_ecpf_name = 'Not Found';
      formData.existing_license_number = 'Not Found';
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`No existing ECPF profile found for CID: ${cid}`);
      formData.existing_ecpf_name = 'Not Found';
      formData.existing_license_number = 'Not Found';
      // Optionally inform the user more explicitly
      // setMessage("No existing ECPF profile record found for your CID.", "info");
    } else {
      console.error("Error fetching existing ECPF profile:", error);
      formData.existing_ecpf_name = 'Error Loading';
      formData.existing_license_number = 'Error Loading';
      // Show a warning, but don't necessarily block the form
      setMessage("Could not load your existing ECPF details. Please check your connection or contact support.", "error");
    }
  }
};

/** Submit the form data (Collaboration Request) */
const submitForm = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;
  clearMessage();
  console.log('Submitting ECPF collaboration application...');

  try {
    // Prepare data specifically for the COLLABORATION endpoint
    const dataToSubmit = await prepareDataForSubmission('submitted'); // Or map status based on backend

    let response;
    // *** IMPORTANT: Use the correct API endpoint for CREATING a Collaboration ***
    // Adjust 'createEcpfCollaboration' and 'updateEcpfCollaboration' as needed
    const apiCreateMethod = 'createEcpfCollaboration';
    const apiUpdateMethod = 'updateEcpfCollaboration'; // If updating drafts is supported for collaborations

    if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
      console.log(`Updating collaboration draft ID: ${formData.draftId}`);
      response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateMethod] === 'function') {
      console.log('Creating new collaboration.');
      response = await apiServices[apiCreateMethod](dataToSubmit);
    } else {
      throw new Error(`Required API method (${formData.draftId ? apiUpdateMethod : apiCreateMethod}) not found in apiServices.`);
    }

    // Check response status (adjust based on your API's success codes)
    if (response?.status === 200 || response?.status === 201) {
      setMessage('Collaboration application submitted successfully!', 'success');
      // Reset form AFTER successful submission
      resetForm(); // Consider if you want to preserve user details after submit
    } else {
      // Handle non-exception errors (e.g., API returns 400 with error details)
      const errorDetail = response?.data?.detail || 'Submission failed with unexpected status.';
      throw new Error(errorDetail);
    }
  } catch (error) {
    console.error('Error submitting collaboration form:', error);
    // Try to get specific error message from response data
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'An unknown error occurred during submission.');
    setMessage(`Submission failed: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
};


/** Save the form data as a draft (Collaboration Request) */
const saveAsDraft = async () => {
  isSubmitting.value = true;
  clearMessage();
  console.log('Saving collaboration as draft...');

  try {
    // Prepare data specifically for the COLLABORATION endpoint, marking as draft
    const dataToSubmit = await prepareDataForSubmission('draft'); // Or use a boolean like is_draft=true

    let response;
    // *** IMPORTANT: Use the correct API endpoint for SAVING/UPDATING a Collaboration Draft ***
    // Adjust method names as needed
    const apiCreateDraftMethod = 'saveEcpfCollaborationDraft';
    const apiUpdateDraftMethod = 'updateEcpfCollaborationDraft';

    if (formData.draftId && typeof apiServices[apiUpdateDraftMethod] === 'function') {
      console.log(`Updating collaboration draft ID: ${formData.draftId}`);
      response = await apiServices[apiUpdateDraftMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateDraftMethod] === 'function') {
      console.log('Saving new collaboration draft.');
      response = await apiServices[apiCreateDraftMethod](dataToSubmit);
    } else {
      throw new Error(`Required API method (${formData.draftId ? apiUpdateDraftMethod : apiCreateDraftMethod}) not found.`);
    }

    if (response?.status === 200 || response?.status === 201) {
      // If creating a new draft, store its ID from the response
      if (!formData.draftId && response?.data?.id) {
        formData.draftId = response.data.id;
        console.log(`Draft saved with new ID: ${formData.draftId}`);
      }
      formData.isDraft = true; // Mark the form state as representing a saved draft
      setMessage(`Collaboration saved as draft successfully. ${formData.draftId ? `(Draft ID: ${formData.draftId})` : ''}`, 'success');
    } else {
      const errorDetail = response?.data?.detail || 'Draft save failed with unexpected status.';
      throw new Error(errorDetail);
    }
  } catch (error) {
    console.error('Error saving collaboration draft:', error);
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'An unknown error occurred while saving draft.');
    setMessage(`Draft save failed: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
};


/** Load draft data from API (Collaboration Draft) */
const loadDraft = async (id) => {
  if (!id) return;
  isLoading.value = true; // Show loading indicator while fetching draft
  clearMessage();
  console.log(`Loading collaboration draft with ID: ${id}...`);

  // *** IMPORTANT: Use the correct API endpoint for GETTING a Collaboration Draft ***
  const apiGetDraftMethod = 'getEcpfCollaborationDraft'; // Adjust if needed

  if (typeof apiServices[apiGetDraftMethod] !== 'function') {
    setMessage(`Internal configuration error: Cannot load draft (method ${apiGetDraftMethod} missing).`, "error");
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiServices[apiGetDraftMethod](id);
    if (response?.data) {
      console.log("Draft data received:", response.data);

      // --- Populate Form ---
      // Reset files first, as we don't load base64 back into inputs
      formData.concern_letter = null;
      formData.passport_cv = null;
      formData.external_party_license = null;
      formData.mou = null;

      // Assign loaded data - this might overwrite initially populated user details, which is usually fine for a draft
      Object.assign(formData, response.data);

      // Restore meta fields
      formData.draftId = id;
      formData.isDraft = true; // Mark as loaded draft
      declarationAgreed.value = formData.declaration || false; // Use backend field name

      // Re-fetch profile details to ensure 'existing' fields are correct (optional, depends if draft includes them)
      // await fetchExistingEcpfProfile(formData.cid_no);

      setMessage(`Draft loaded (ID: ${id}). You can edit and save/submit.`, 'success');
    } else {
      throw new Error("Draft data not found or empty response.");
    }
  } catch (error) {
    console.error("Error loading collaboration draft:", error);
    setMessage(`Failed to load draft (ID: ${id}): ${error.message || 'Unknown error'}. Starting new form.`, "error");
    // Reset to a clean state if draft loading fails
    resetForm(); // This will re-trigger fetching user details if resetForm includes it
  } finally {
    isLoading.value = false;
  }
};

/** Allow editing of a loaded draft */
const editDraft = () => {
  if (formData.draftId) {
    formData.isDraft = false; // Unlock the form for submission
    setMessage("Draft unlocked for editing and final submission.", "success");
  }
};

/** Reset form to initial state */
const resetForm = () => {
  // Store details we want to preserve (like logged-in user info)
  const preservedDetails = {
    cid_no: formData.cid_no,
    applicant_name: formData.applicant_name,
    gender: formData.gender,
    date_of_birth: formData.date_of_birth,
    contact_no: formData.contact_no, // Preserve pre-filled contact/email
    email_address: formData.email_address,
    // Reset 'existing' fields, they will be re-fetched if needed
    existing_ecpf_name: 'Loading...',
    existing_license_number: 'Loading...',
  };

  // Get a fresh copy of the initial state
  const freshFormData = getInitialFormData();

  // Apply the fresh state, then re-apply preserved details
  Object.assign(formData, freshFormData, preservedDetails);

  // Reset meta states
  declarationAgreed.value = false;
  formData.draftId = null;
  formData.isDraft = false;
  clearMessage();

  // Clear file inputs visually
  if (formEl.value) {
    const fileInputs = formEl.value.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      // Check if the input exists before trying to clear it
      if (input) {
        input.value = '';
      }
    });
  }
  console.log("Form reset. User details preserved, file inputs cleared.");
};


// --- Lifecycle Hook ---
onMounted(async () => {
  isLoading.value = true;
  clearMessage();
  await authStore.initializeAuth(); // Wait for auth store initialization

  let userCid = null;

  // 1. Populate from Auth Store
  if (authStore.isAuthenticated && authStore.user) {
    // Map user details - **ADJUST KEYS based on your actual authStore.user object**
    formData.cid_no = authStore.user.cid || authStore.user.username || ''; // Prioritize 'cid'
    formData.applicant_name = authStore.user.fullName || authStore.user.name || '';
    formData.gender = authStore.user.gender || '';
    // Format date correctly if it comes from the store
    formData.date_of_birth = authStore.user.dateOfBirth ? new Date(authStore.user.dateOfBirth).toISOString().split('T')[0] : ''; // Example: YYYY-MM-DD
    formData.contact_no = authStore.user.contactNumber || authStore.user.phone || '';
    formData.email_address = authStore.user.email || '';

    userCid = formData.cid_no; // Get the CID for the next step
    console.log("Populated basic user details from auth store:", { cid: userCid, name: formData.applicant_name });
  } else {
    console.error("User not authenticated or user data unavailable in auth store.");
    setMessage("Authentication error. Please log in again.", "error");
    isLoading.value = false; // Stop loading
    // Consider redirecting to login page here
    // router.push('/login');
    return; // Don't proceed
  }

  // Use Promise.all to fetch master data and profile data concurrently
  try {
    const fetchPromises = [
      fetchMasterData() // Fetch dropdowns
    ];

    // Only fetch profile if we have a CID
    if (userCid) {
      fetchPromises.push(fetchExistingEcpfProfile(userCid));
    } else {
      formData.existing_ecpf_name = 'N/A (No CID)';
      formData.existing_license_number = 'N/A (No CID)';
    }

    await Promise.all(fetchPromises);
    console.log("Initial data fetching complete (Master Data and ECPF Profile).");

  } catch (error) {
    // Errors inside the functions should ideally be caught there,
    // but catch any Promise.all rejection just in case.
    console.error("Error during initial data fetching:", error);
    setMessage("Failed to load necessary initial data. Please refresh.", "error");
  }


  // 4. Check for Draft ID from URL AFTER fetching initial data
  const urlParams = new URLSearchParams(window.location.search);
  const draftIdFromUrl = urlParams.get('draftId');
  if (draftIdFromUrl) {
    console.log(`Draft ID found in URL: ${draftIdFromUrl}. Loading draft...`);
    await loadDraft(draftIdFromUrl); // loadDraft sets isLoading to false internally
  } else {
    formData.isDraft = false; // Ensure it's not marked as draft if no ID is present
    isLoading.value = false; // Loading finished if not loading a draft
  }

  // Final check if still loading (e.g., if draft loading failed)
  if (isLoading.value) {
    isLoading.value = false;
  }
});

</script>

<style scoped>
input:read-only,
input[readonly] {
  /* Style readonly fields */
  cursor: not-allowed;
  background-color: #f3f4f6;
  /* bg-gray-100 */
  opacity: 0.7;
}
</style>