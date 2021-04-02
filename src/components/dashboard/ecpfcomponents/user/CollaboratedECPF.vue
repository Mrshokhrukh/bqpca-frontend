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
      <p v-html="formMessage.text.replace(/\n/g, '<br />')"></p> <!-- Allow newlines in messages -->
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
                ECPF (Collaboration):<span class="text-red-500">*</span></label>
              <input id="proposed_ecpf_name" type="text" v-model="formData.proposed_ecpf_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_location" class="block text-sm font-medium text-gray-700">Proposed Location (if
                different):</label>
              <input id="proposed_location" type="text" v-model="formData.proposed_location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Details of External Party -->
        <section class="mb-8">
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
                in (Country):<span class="text-red-500">*</span></label>
              <select id="external_party_country" v-model="formData.external_party_country" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option disabled :value="null">-- Select Country --</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">{{ country.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="external_party_state" class="block text-sm font-medium text-gray-700">External Party Based in
                (State/Province):<span class="text-red-500">*</span></label>
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
                Proprietor/Contact Person:<span class="text-red-500">*</span></label>
              <input id="proprietor_name" type="text" v-model="formData.proprietor_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="nationality" class="block text-sm font-medium text-gray-700">Nationality (Proprietor):<span
                  class="text-red-500">*</span></label>
              <input id="nationality" type="text" v-model="formData.nationality" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="designation" class="block text-sm font-medium text-gray-700">Designation (Proprietor):<span
                  class="text-red-500">*</span></label>
              <input id="designation" type="text" v-model="formData.designation" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_email" class="block text-sm font-medium text-gray-700">Email Address (External
                Party):<span class="text-red-500">*</span></label>
              <input id="external_party_email" type="email" v-model="formData.external_party_email" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="external_party_contact" class="block text-sm font-medium text-gray-700">Contact
                Number (External Party):<span class="text-red-500">*</span></label>
              <input id="external_party_contact" type="tel" v-model="formData.external_party_contact" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website (Optional):</label>
              <input id="website" type="url" v-model="formData.website" placeholder="https://example.com"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Collaboration Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Collaboration Details<span class="text-red-500">*</span>
          </h2>
          <textarea v-model="formData.collaboration_details" required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="5" placeholder="Explain the type of collaboration, roles, responsibilities, duration, financial arrangements, etc."></textarea>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Supporting Documents</h2>
          <p class="text-sm text-gray-500 mb-4">Please upload required documents in PDF, JPG, PNG, DOC, or DOCX format.
            <span v-if="formData.draftId" class="text-orange-600 block">Note: If previously uploaded documents for this draft are correct, you do not need to re-upload them unless you want to replace them.</span>
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="concern_letter" class="block text-sm font-medium text-gray-700">Concern/Authorization
                Letter <span v-if="!formData.draftId" class="text-red-500">*</span>:</label>
              <input id="concern_letter" type="file" @change="handleFileUpload($event, 'concern_letter')" :required="!formData.draftId && !formData.concern_letter"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('concern_letter')" class="text-xs text-gray-600 mt-1 block">Selected: {{ getFileName('concern_letter') }}</span>
            </div>
            <div>
              <label for="passport_cv" class="block text-sm font-medium text-gray-700">Passport & CV of Proprietor (External Party) <span v-if="!formData.draftId" class="text-red-500">*</span>:</label>
              <input id="passport_cv" type="file" @change="handleFileUpload($event, 'passport_cv')" :required="!formData.draftId && !formData.passport_cv"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('passport_cv')" class="text-xs text-gray-600 mt-1 block">Selected: {{ getFileName('passport_cv') }}</span>
            </div>
            <div>
              <label for="external_party_license" class="block text-sm font-medium text-gray-700">License/Registration of External Party <span v-if="!formData.draftId" class="text-red-500">*</span>:</label>
              <input id="external_party_license" type="file"
                @change="handleFileUpload($event, 'external_party_license')" :required="!formData.draftId && !formData.external_party_license"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('external_party_license')" class="text-xs text-gray-600 mt-1 block">Selected: {{ getFileName('external_party_license') }}</span>
            </div>
            <div>
              <label for="mou" class="block text-sm font-medium text-gray-700">Valid Signed MoU/Agreement <span v-if="!formData.draftId" class="text-red-500">*</span>:</label>
              <input id="mou" type="file" @change="handleFileUpload($event, 'mou')" :required="!formData.draftId && !formData.mou"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500
                     file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getFileName('mou')" class="text-xs text-gray-600 mt-1 block">Selected: {{ getFileName('mou') }}</span>
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
              to abide by the relevant rules and regulations. I understand that any false information may lead to rejection or cancellation.
            </label>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
          <button type="button" @click="saveAsDraft" :disabled="isSubmitting"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting && formAction === 'draft'">Saving...</span>
            <span v-else>Save as Draft</span>
          </button>
           <!-- Edit Draft Button - Only shown if a draft is loaded -->
          <button type="button" @click="editDraft" v-if="formData.isDraft && !isEditingDraft" :disabled="isSubmitting"
             class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Edit Draft
           </button>
          <button type="submit" :disabled="!declarationAgreed || isSubmitting || (formData.isDraft && !isEditingDraft)"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting && formAction === 'submit'">Submitting...</span>
            <span v-else>{{ formData.draftId && isEditingDraft ? 'Update & Submit' : 'Submit Application' }}</span>
          </button>
        </div>
      </form>
      <div v-else class="text-center py-10">
        <!-- Simple spinner -->
         <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
         </div>
         <p class="mt-2 text-gray-600">Loading form data...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import apiServices from '@/services/services'; // Adjust path as needed
import { useAuthStore } from '@/stores/authStore'; // Adjust path as needed

// --- Store Instance ---
const authStore = useAuthStore();

// --- State ---
const isLoading = ref(true); // Covers initial data fetch
const isSubmitting = ref(false);
const formAction = ref(''); // To track 'submit' or 'draft' action for button text
const formMessage = reactive({ text: '', type: '' }); // 'error' or 'success'
const formEl = ref(null); // Ref for the form element to reset file inputs
const declarationAgreed = ref(false);
const isEditingDraft = ref(false); // Track if a loaded draft is being edited

// --- Form Data ---
const getInitialFormData = () => ({
  // Auto-populated fields (from auth)
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  // Fields populated by API call based on CID
  existing_ecpf_name: 'Loading...',
  existing_license_number: 'Loading...',
  // Editable personal/address fields
  contact_no: '',
  email_address: '',
  office_number: '',
  flat_no: '',
  building_no: '',
  location: null, // Dropdown ID
  gewog_throm: null, // Dropdown ID
  dzongkhag_thromde: null, // Dropdown ID
  // Editable education fields
  qualification: '',
  institute_name: '',
  university_name: '',
  // Editable collaboration proposal fields
  proposed_ecpf_name: '',
  proposed_location: '',
  // Editable external party fields
  collaborating_firm_name: '',
  external_party_country: null, // Dropdown code
  external_party_state: '',
  firm_registration_number: '',
  proprietor_name: '',
  nationality: '',
  designation: '',
  external_party_email: '',
  external_party_contact: '',
  website: '',
  // Collaboration details
  collaboration_details: '',
  // Files (will hold File objects)
  concern_letter: null,
  passport_cv: null,
  external_party_license: null,
  mou: null,
  // Meta fields for internal state management
  isDraft: false, // Is the current form data representing a saved draft?
  draftId: null, // ID of the saved draft, if loaded
  declaration: false, // Backend field name for declaration checkbox
});

const formData = reactive(getInitialFormData());

// --- Master Data ---
const locations = ref([]);
const gewogThroms = ref([]);
const dzongkhagThromdes = ref([]);
// Example static countries list - fetch from API if needed
const countries = ref([
    { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
    { code: 'AS', name: 'American Samoa' }, { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' },
    { code: 'AI', name: 'Anguilla' }, { code: 'AQ', name: 'Antarctica' }, { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AW', name: 'Aruba' },
    { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' }, { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' }, { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' }, { code: 'BJ', name: 'Benin' }, { code: 'BM', name: 'Bermuda' },
    { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' }, { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' }, { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'BN', name: 'Brunei Darussalam' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' }, { code: 'KH', name: 'Cambodia' }, { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' }, { code: 'CV', name: 'Cape Verde' }, { code: 'KY', name: 'Cayman Islands' },
    { code: 'CF', name: 'Central African Republic' }, { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' }, { code: 'CX', name: 'Christmas Island' }, { code: 'CC', name: 'Cocos (Keeling) Islands' },
    { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo, The Democratic Republic of the' }, { code: 'CK', name: 'Cook Islands' },
    { code: 'CR', name: 'Costa Rica' }, { code: 'CI', name: 'Cote D\'Ivoire' }, { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' }, { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' }, { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' }, { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' }, { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' }, { code: 'ET', name: 'Ethiopia' }, { code: 'FK', name: 'Falkland Islands (Malvinas)' },
    { code: 'FO', name: 'Faroe Islands' }, { code: 'FJ', name: 'Fiji' }, { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' }, { code: 'GF', name: 'French Guiana' }, { code: 'PF', name: 'French Polynesia' },
    { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' }, { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' }, { code: 'GH', name: 'Ghana' }, { code: 'GI', name: 'Gibraltar' },
    { code: 'GR', name: 'Greece' }, { code: 'GL', name: 'Greenland' }, { code: 'GD', name: 'Grenada' },
    { code: 'GP', name: 'Guadeloupe' }, { code: 'GU', name: 'Guam' }, { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' }, { code: 'HN', name: 'Honduras' }, { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran, Islamic Republic Of' }, { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: 'Korea, Democratic People\'S Republic of' }, { code: 'KR', name: 'Korea, Republic of' },
    { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Lao People\'S Democratic Republic' },
    { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libyan Arab Jamahiriya' }, { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'MO', name: 'Macao' },
    { code: 'MK', name: 'Macedonia, The Former Yugoslav Republic of' }, { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Marshall Islands' },
    { code: 'MQ', name: 'Martinique' }, { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' },
    { code: 'YT', name: 'Mayotte' }, { code: 'MX', name: 'Mexico' }, { code: 'FM', name: 'Micronesia, Federated States of' },
    { code: 'MD', name: 'Moldova, Republic of' }, { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' },
    { code: 'MS', name: 'Montserrat' }, { code: 'MA', name: 'Morocco' }, { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' }, { code: 'AN', name: 'Netherlands Antilles' },
    { code: 'NC', name: 'New Caledonia' }, { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' }, { code: 'NG', name: 'Nigeria' }, { code: 'NU', name: 'Niue' },
    { code: 'NF', name: 'Norfolk Island' }, { code: 'MP', name: 'Northern Mariana Islands' }, { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' }, { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestinian Territory, Occupied' }, { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' },
    { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' }, { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' }, { code: 'RE', name: 'Reunion' }, { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russian Federation' }, { code: 'RW', name: 'Rwanda' }, { code: 'SH', name: 'Saint Helena' },
    { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' }, { code: 'PM', name: 'Saint Pierre and Miquelon' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' }, { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' },
    { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' }, { code: 'SZ', name: 'Swaziland' }, { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syrian Arab Republic' }, { code: 'TW', name: 'Taiwan, Province of China' },
    { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania, United Republic of' }, { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' }, { code: 'TK', name: 'Tokelau' },
    { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' }, { code: 'TM', name: 'Turkmenistan' }, { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' }, { code: 'US', name: 'United States' },
    { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' }, { code: 'VU', name: 'Vanuatu' },
     { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Viet Nam' }, { code: 'VG', name: 'Virgin Islands, British' },
     { code: 'VI', name: 'Virgin Islands, U.S.' }, { code: 'WF', name: 'Wallis and Futuna' }, { code: 'EH', name: 'Western Sahara' },
     { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' }
]);

// --- Helper Functions ---
const setMessage = (text, type = 'error') => {
  formMessage.text = text;
  formMessage.type = type;
  // Scroll to top to make message visible
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearMessage = () => {
  formMessage.text = '';
  formMessage.type = '';
};

const getFileName = (fieldName) => {
  const file = formData[fieldName];
  // Check if it's a File object (meaning a new file was selected)
  if (file instanceof File) {
    return file.name;
  }
  // If loading a draft, the field might hold a URL or placeholder string from the backend
  // In this simple case, we don't show a name for existing files unless re-selected.
  // You could enhance this to show the original filename if the backend provides it.
  return '';
};

// --- File Upload Handler ---
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0];
  if (file) {
    formData[fieldName] = file;
  } else {
    // If the user cancels file selection, keep the existing value (could be null or a previous file)
    // Or set to null explicitly if desired: formData[fieldName] = null;
  }
  // Clear previous success messages when a file potentially changes
  if (formMessage.type === 'success') {
    clearMessage();
  }
   // If editing a draft, mark that changes are being made
   if (formData.isDraft) {
     isEditingDraft.value = true;
   }
};

// --- Base64 Conversion ---
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file || !(file instanceof File)) { // Only convert actual File objects
       resolve(null); // Return null if no file or not a File object (e.g., URL from draft)
       return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); // result includes data: L;base64,
    reader.onerror = (error) => reject(error);
  });

// --- Data Preparation ---
const prepareDataForSubmission = async (status = 'submitted') => {
  const data = JSON.parse(JSON.stringify(formData)); // Deep copy

  // Remove fields not needed by the backend or handled separately
  delete data.existing_ecpf_name; // Only for display
  delete data.existing_license_number; // Only for display
  delete data.isDraft;
  // Keep draftId if updating an existing draft, remove otherwise? Depends on API.
  // Assuming the API endpoint itself implies the ID for updates, so remove it from payload:
   // delete data.draftId; // Keep it if API needs it in payload for update

  // Convert files to Base64 *only if they are File objects* (newly uploaded)
  // If the field holds a URL/string from a loaded draft, don't try to convert it.
  data.concern_letter = formData.concern_letter instanceof File ? await toBase64(formData.concern_letter) : null; // Send null if not a new file
  data.passport_cv = formData.passport_cv instanceof File ? await toBase64(formData.passport_cv) : null;
  data.external_party_license = formData.external_party_license instanceof File ? await toBase64(formData.external_party_license) : null;
  data.mou = formData.mou instanceof File ? await toBase64(formData.mou) : null;

  // Map frontend state to backend field names if they differ
  data.email = formData.email_address; // Example mapping
  // Ensure the backend keys for address parts match if different from formData keys
  // e.g., data.dzongkhag = formData.dzongkhag_thromde;

  // Add submission status and declaration
  data.status = status; // 'submitted' or 'draft'
  data.declaration = declarationAgreed.value;

  // Remove null file fields if backend expects them to be absent rather than null
   Object.keys(data).forEach(key => {
       if (key.includes('_letter') || key.includes('_cv') || key.includes('_license') || key.includes('_mou')) {
            if (data[key] === null) {
                // Option 1: Remove the key if null
                 delete data[key];
                // Option 2: Keep it as null (depends on backend requirement)
            }
        }
   });


  console.log("Data prepared for submission:", data);
  return data;
};


// --- Form Validation ---
const validateForm = (isDraftSave = false) => {
  clearMessage();
  let isValid = true;
  const errors = [];

  // --- Required Fields (Always Required, unless saving draft maybe?) ---
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
  if (!formData.proposed_ecpf_name) errors.push('Proposed ECPF Name (Collaboration) is required.');
  if (!formData.collaborating_firm_name) errors.push('Collaborating Firm Name is required.');
  if (formData.external_party_country === null) errors.push('External Party Country is required.');
  if (!formData.external_party_state) errors.push('External Party State/Province is required.');
  if (!formData.firm_registration_number) errors.push("Firm's Registration Number is required.");
  if (!formData.proprietor_name) errors.push("Proprietor/Contact Person's Name is required.");
  if (!formData.nationality) errors.push("Proprietor's Nationality is required.");
  if (!formData.designation) errors.push("Proprietor's Designation is required.");
  if (!formData.external_party_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.external_party_email)) {
    errors.push("Please enter a valid Email Address for the external party.");
  }
  if (!formData.external_party_contact) errors.push("External Party Contact Number is required.");
  if (!formData.collaboration_details) errors.push("Collaboration Details are required.");

  // --- Conditional Requirements (Not needed for Draft Save) ---
  if (!isDraftSave) {
     // File checks: Required only if NOT loading/saving a draft OR if it's null/not a File
     const checkFile = (field, name) => {
          // Required if it's a new submission OR if it's a draft being submitted AND no file exists (null/undefined)
          if (!formData.draftId || (formData.draftId && !formData[field])) {
              if (!formData[field]) { // Check if null or undefined
                errors.push(`${name} is required.`);
              }
          }
     };

     checkFile('concern_letter', 'Concern/Authorization Letter');
     checkFile('passport_cv', 'Passport & CV file');
     checkFile('external_party_license', 'External Party License file');
     checkFile('mou', 'Valid Signed MoU/Agreement file');

    // Declaration check: Only required for final submission
    if (!declarationAgreed.value) {
      errors.push('You must agree to the declaration to submit the application.');
    }
  }

  if (errors.length > 0) {
    setMessage(`Please fix the following errors:\n- ${errors.join('\n- ')}`);
    isValid = false;
  }
  return isValid;
};

// --- API Interaction ---

/** Fetch Master Data for Dropdowns */
const fetchMasterData = async () => {
  console.log("Fetching master data...");
  try {
    // --- Replace with actual API calls ---
    // Example:
    // const [locRes, gtRes, dtRes] = await Promise.all([
    //     apiServices.getLocations(),
    //     apiServices.getGewogThroms(),
    //     apiServices.getDzongkhagThromdes()
    // ]);
    // locations.value = locRes.data;
    // gewogThroms.value = gtRes.data;
    // dzongkhagThromdes.value = dtRes.data;
    // --- Using static mock data for now ---
    locations.value = [ { id: 'loc_thim_central', name: 'Thimphu Central' }, { id: 'loc_paro_town', name: 'Paro Town' }, { id: 'loc_pbhutan_ind_park', name: 'Phuentsholing Industrial Park'}];
    gewogThroms.value = [{ id: 'gt_chang', name: 'Chang Gewog' }, { id: 'gt_kawang', name: 'Kawang Gewog' }, { id: 'gt_geylephug_throm', name: 'Geylephug Thromde' }];
    dzongkhagThromdes.value = [{ id: 'dt_thim_throm', name: 'Thimphu Thromde' }, { id: 'dt_paro_dzong', name: 'Paro Dzongkhag' }, { id: 'dt_sarpang', name: 'Sarpang Dzongkhag' }];
    // --- End Mock Data ---
    console.log("Master data loaded successfully.");
  } catch (error) {
    console.error("Error fetching master data:", error);
    setMessage("Failed to load dropdown options. Some fields may not work correctly.", "error");
    // Depending on severity, you might want to prevent form submission
  }
};


/** Fetch details of the user's existing ECPF Profile using CID */
const fetchExistingEcpfProfile = async (cid) => {
  if (!cid) {
    console.warn("No CID provided to fetch ECPF profile.");
    formData.existing_ecpf_name = 'N/A (No CID)';
    formData.existing_license_number = 'N/A (No CID)';
    return;
  }

  console.log(`Fetching existing ECPF profile for CID: ${cid}...`);
  // *** Replace with your actual API service method ***
  const apiMethod = 'getEcpfDetailsByCID';
  if (typeof apiServices[apiMethod] !== 'function') {
    console.error(`apiServices.${apiMethod} method is not defined.`);
    setMessage(`Internal configuration error: Cannot fetch profile details (method ${apiMethod} missing).`, "error");
    formData.existing_ecpf_name = 'Config Error';
    formData.existing_license_number = 'Config Error';
    return;
  }

  try {
    // const response = await apiServices.getEcpfDetailsByCID(cid);
    // --- Mock Response (Replace with actual API call) ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const mockResponse = {
       status: 200, // or 404
       data: { // Provide mock data ONLY if status is 200
         proposed_firm_name: "Bhutan Consulting Group", // Mock existing name
         complete_registration: "ECPF-2023-00123", // Mock existing license
         // qualification: "MBA", // Optionally pre-fill other fields
         // institute_name: "Gedu College",
         // university_name: "Royal University of Bhutan"
       }
     };
    // Use mockResponse if API fails or for testing
    const response = mockResponse; // Replace with actual API call result in production
    // --- End Mock Response ---

    if (response?.status === 200 && response?.data) {
      console.log("Existing ECPF profile data received:", response.data);
      // Adjust field names based on your actual API response
      formData.existing_ecpf_name = response.data.proposed_firm_name || 'N/A';
      formData.existing_license_number = response.data.complete_registration || 'N/A';
      // Optionally pre-fill other related fields if needed and not overridden by draft later
      // if (!formData.qualification) formData.qualification = response.data.qualification || '';
      // etc...
    } else if (response?.status === 404) {
       console.warn(`No existing ECPF profile found for CID: ${cid}`);
       formData.existing_ecpf_name = 'Not Found';
       formData.existing_license_number = 'Not Found';
       // Optionally inform user: setMessage("No existing ECPF profile found.", "info");
    } else {
      // Handle other non-404 API success statuses without expected data
      console.warn("Received success status but no data or unexpected format for ECPF profile.", response);
      formData.existing_ecpf_name = 'Data Unavailable';
      formData.existing_license_number = 'Data Unavailable';
    }
  } catch (error) {
    // Handle network errors or non-200/404 responses
    if (error.response && error.response.status === 404) {
      console.warn(`No existing ECPF profile found for CID: ${cid} (Caught 404).`);
      formData.existing_ecpf_name = 'Not Found';
      formData.existing_license_number = 'Not Found';
    } else {
      console.error("Error fetching existing ECPF profile:", error);
      formData.existing_ecpf_name = 'Error Loading';
      formData.existing_license_number = 'Error Loading';
      setMessage("Could not load your existing ECPF details. Please check connection or contact support.", "error");
    }
  }
};

/** Submit the form data (Collaboration Request) */
const submitForm = async () => {
  formAction.value = 'submit'; // For button text
  if (!validateForm(false)) { // Full validation for submission
     isSubmitting.value = false; // Ensure spinner stops if validation fails early
     return;
  }
  isSubmitting.value = true;
  clearMessage();
  console.log('Submitting ECPF collaboration application...');

  try {
    const dataToSubmit = await prepareDataForSubmission('submitted');

    // *** Replace with your actual API service method names ***
    const apiCreateMethod = 'createEcpfCollaboration';
    const apiUpdateMethod = 'updateEcpfCollaboration'; // Or maybe same as draft update?

    let response;
    if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
      console.log(`Updating and submitting collaboration from draft ID: ${formData.draftId}`);
      // If backend needs draftId in payload, add it back in prepareDataForSubmission or here
      // dataToSubmit.draftId = formData.draftId;
      response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateMethod] === 'function') {
      console.log('Creating and submitting new collaboration.');
      response = await apiServices[apiCreateMethod](dataToSubmit);
    } else {
      throw new Error(`Required API method (${formData.draftId ? apiUpdateMethod : apiCreateMethod}) not found in apiServices.`);
    }

    // --- Mock Response (Remove in production) ---
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    // const mockSubmitResponse = { status: 201, data: { message: "Success", id: formData.draftId || Date.now() } };
    const mockSubmitResponse = { status: 400, data: { detail: "Validation Error: Proposed name already exists." } }; // Example error
    response = mockSubmitResponse;
    // --- End Mock ---

    // Check response status (e.g., 200 OK, 201 Created)
    if (response?.status === 200 || response?.status === 201) {
      setMessage('Collaboration application submitted successfully!', 'success');
      resetForm(); // Reset form to initial state after successful submission
      // Optionally redirect user: router.push('/dashboard');
    } else {
      // Handle non-exception errors from API (e.g., validation errors)
      const errorDetail = response?.data?.detail || JSON.stringify(response?.data) || 'Submission failed with an unexpected status.';
      throw new Error(errorDetail);
    }
  } catch (error) {
    console.error('Error submitting collaboration form:', error);
    const errorMsg = error.response?.data ? (error.response.data.detail || JSON.stringify(error.response.data)) : (error.message || 'An unknown error occurred during submission.');
    setMessage(`Submission failed: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
    formAction.value = '';
  }
};

/** Save the form data as a draft (Collaboration Request) */
const saveAsDraft = async () => {
  formAction.value = 'draft'; // For button text
  // Optional: Perform minimal validation for draft save (e.g., only check if key fields exist)
  // if (!validateForm(true)) { // Pass true to skip non-essential validation
  //    isSubmitting.value = false;
  //    return;
  // }
  isSubmitting.value = true;
  clearMessage();
  console.log('Saving collaboration as draft...');

  try {
    const dataToSubmit = await prepareDataForSubmission('draft');

    // *** Replace with your actual API service method names ***
    const apiCreateDraftMethod = 'saveEcpfCollaborationDraft';
    const apiUpdateDraftMethod = 'updateEcpfCollaborationDraft'; // Use this if updating existing draft

    let response;
    if (formData.draftId && typeof apiServices[apiUpdateDraftMethod] === 'function') {
      console.log(`Updating collaboration draft ID: ${formData.draftId}`);
      // dataToSubmit.draftId = formData.draftId; // If needed in payload
      response = await apiServices[apiUpdateDraftMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateDraftMethod] === 'function') {
      console.log('Saving new collaboration draft.');
      response = await apiServices[apiCreateDraftMethod](dataToSubmit);
    } else {
      throw new Error(`Required API method (${formData.draftId ? apiUpdateDraftMethod : apiCreateDraftMethod}) not found.`);
    }

    // --- Mock Response (Remove in production) ---
     await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
     const newDraftId = formData.draftId || `draft_${Date.now()}`;
     const mockDraftResponse = { status: 200, data: { message: "Draft saved", id: newDraftId } };
     response = mockDraftResponse;
    // --- End Mock ---


    if (response?.status === 200 || response?.status === 201) {
      const savedDraftId = response?.data?.id;
      if (savedDraftId) {
        formData.draftId = savedDraftId; // Store the ID from the response
        console.log(`Draft ${formData.draftId ? 'updated' : 'saved'} with ID: ${savedDraftId}`);
      }
      formData.isDraft = true; // Mark the form state as representing a saved draft
      isEditingDraft.value = false; // After saving, it's no longer in 'edit draft' mode
      setMessage(`Collaboration saved as draft successfully. ${savedDraftId ? `(Draft ID: ${savedDraftId})` : ''}`, 'success');
      // Optional: Update URL to include draftId?
      // history.pushState({}, '', `?draftId=${savedDraftId}`);
    } else {
      const errorDetail = response?.data?.detail || JSON.stringify(response?.data) || 'Draft save failed with unexpected status.';
      throw new Error(errorDetail);
    }
  } catch (error) {
    console.error('Error saving collaboration draft:', error);
    const errorMsg = error.response?.data ? (error.response.data.detail || JSON.stringify(error.response.data)) : (error.message || 'An unknown error occurred while saving draft.');
    setMessage(`Draft save failed: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
    formAction.value = '';
  }
};


/** Load draft data from API (Collaboration Draft) */
const loadDraft = async (id) => {
  if (!id) return;
  isLoading.value = true; // Use main loading indicator
  clearMessage();
  console.log(`Loading collaboration draft with ID: ${id}...`);

  // *** Replace with your actual API service method name ***
  const apiGetDraftMethod = 'getEcpfCollaborationDraft';

  if (typeof apiServices[apiGetDraftMethod] !== 'function') {
    setMessage(`Internal configuration error: Cannot load draft (method ${apiGetDraftMethod} missing).`, "error");
    isLoading.value = false;
    return;
  }

  try {
     //const response = await apiServices[apiGetDraftMethod](id);
     // --- Mock Draft Data (Replace with actual API call) ---
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
      const mockDraftData = {
        // cid_no: "11201005411", // Should match logged in user ideally
        // applicant_name: "Test User Draft", // Might differ slightly
        // gender: "female",
        // date_of_birth: "1990-05-15",
        contact_no: "17889900",
        email_address: "draft.user@example.com",
        office_number: "Off-01",
        flat_no: "F-12",
        building_no: "Bldg-C",
        location: "loc_paro_town", // Match ID from master data
        gewog_throm: "gt_chang",
        dzongkhag_thromde: "dt_paro_dzong",
        qualification: "Masters in Collaboration Studies",
        institute_name: "Draft Institute",
        university_name: "Draft University",
        proposed_ecpf_name: "Collaborative Solutions Inc.",
        proposed_location: "Paro IT Park",
        collaborating_firm_name: "External Experts LLC",
        external_party_country: "US", // Match code from countries list
        external_party_state: "California",
        firm_registration_number: "EXT-REG-5678",
        proprietor_name: "John Doe",
        nationality: "American",
        designation: "CEO",
        external_party_email: "john.doe@externalexperts.com",
        external_party_contact: "+1-555-1234",
        website: "https://externalexperts.com",
        collaboration_details: "Detailed plan for joint venture project X.",
        // --- File fields from backend might be URLs or just flags indicating presence ---
        concern_letter: "/uploads/drafts/concern_abc.pdf", // Example URL or identifier
        passport_cv: true, // Example boolean flag
        external_party_license: "/uploads/drafts/license_xyz.jpg",
        mou: null, // Example where MoU wasn't uploaded in draft
        // ---
        declaration: false, // Declaration status from draft
        // existing_ecpf_name and existing_license_number will be fetched separately
      };
      const mockDraftResponse = { status: 200, data: mockDraftData }; // Or 404
      const response = mockDraftResponse;
     // --- End Mock Draft Data ---

    if (response?.status === 200 && response.data) {
      console.log("Draft data received:", response.data);

      // --- Populate Form ---
      // 1. Preserve initially fetched user details & existing ECPF info
      const preserved = {
         cid_no: formData.cid_no,
         applicant_name: formData.applicant_name,
         gender: formData.gender,
         date_of_birth: formData.date_of_birth,
         existing_ecpf_name: formData.existing_ecpf_name,
         existing_license_number: formData.existing_license_number,
      };

      // 2. Reset files first (inputs cannot be populated with URLs/flags)
      resetFileInputs();
      formData.concern_letter = response.data.concern_letter || null; // Keep URL/flag if backend provides it
      formData.passport_cv = response.data.passport_cv || null;
      formData.external_party_license = response.data.external_party_license || null;
      formData.mou = response.data.mou || null;

      // 3. Assign loaded draft data OVER the initial state, EXCEPT preserved fields
      const draftData = response.data;
      Object.keys(formData).forEach(key => {
          if (!(key in preserved) && key in draftData) {
              // Special handling for dropdowns - ensure the value exists in the options
              if (key === 'location' && locations.value.some(o => o.id === draftData[key])) {
                 formData[key] = draftData[key];
              } else if (key === 'gewog_throm' && gewogThroms.value.some(o => o.id === draftData[key])) {
                  formData[key] = draftData[key];
              } else if (key === 'dzongkhag_thromde' && dzongkhagThromdes.value.some(o => o.id === draftData[key])) {
                 formData[key] = draftData[key];
              } else if (key === 'external_party_country' && countries.value.some(o => o.code === draftData[key])) {
                 formData[key] = draftData[key];
              // Handle other fields directly
              } else if (!['concern_letter', 'passport_cv', 'external_party_license', 'mou'].includes(key)) {
                formData[key] = draftData[key] !== undefined ? draftData[key] : getInitialFormData()[key];
              }
          } else if (!(key in preserved)) {
              // If a field exists in formData but not in draftData, reset it to initial default
              formData[key] = getInitialFormData()[key];
          }
      });

      // 4. Restore preserved fields
      Object.assign(formData, preserved);


      // 5. Restore meta fields & declaration state
      formData.draftId = id;
      formData.isDraft = true;
      isEditingDraft.value = false; // Start in non-editing mode after load
      declarationAgreed.value = response.data.declaration || false; // Use backend field name 'declaration'

      setMessage(`Draft loaded (ID: ${id}). Click 'Edit Draft' to make changes and submit, or 'Save as Draft' to update the draft.`, 'success');
    } else if (response?.status === 404) {
         throw new Error(`Draft with ID ${id} not found.`);
    } else {
         throw new Error("Draft data not found or received in unexpected format.");
    }
  } catch (error) {
    console.error("Error loading collaboration draft:", error);
    setMessage(`Failed to load draft (ID: ${id}): ${error.message || 'Unknown error'}. Displaying a new form.`, "error");
    // Reset to a clean state if draft loading fails
    resetForm(); // This will re-trigger fetching user details
  } finally {
    isLoading.value = false; // Loading finished
  }
};

/** Allow editing of a loaded draft */
const editDraft = () => {
  if (formData.draftId && formData.isDraft) {
    isEditingDraft.value = true; // Enable submit button, potentially change its text
    formData.isDraft = false; // Temporarily mark as not a draft internally for button logic
    setMessage("Draft unlocked. You can now edit and submit the application.", "info");
  }
};

/** Reset form to initial state, preserving logged-in user details */
const resetForm = () => {
  console.log("Resetting form...");
  // Store details we want to preserve (fetched initially)
  const preservedDetails = {
    cid_no: formData.cid_no, // Keep CID from auth
    applicant_name: formData.applicant_name, // Keep Name from auth
    gender: formData.gender, // Keep Gender from auth
    date_of_birth: formData.date_of_birth, // Keep DoB from auth
    contact_no: formData.contact_no, // Keep initially populated contact
    email_address: formData.email_address, // Keep initially populated email
    // Reset 'existing' fields; they should be re-fetched if needed or were static display
    existing_ecpf_name: formData.existing_ecpf_name, // Keep fetched existing name
    existing_license_number: formData.existing_license_number, // Keep fetched existing license
  };

  // Get a fresh copy of the initial state
  const freshFormData = getInitialFormData();

  // Apply the fresh state, then re-apply preserved details
  Object.assign(formData, freshFormData, preservedDetails);

  // Reset meta states
  declarationAgreed.value = false;
  formData.draftId = null;
  formData.isDraft = false;
  isEditingDraft.value = false;
  clearMessage();

  // Clear file inputs visually
  resetFileInputs();

  console.log("Form reset. User/Existing ECPF details preserved, other fields cleared.");
};

/** Helper to reset file input elements */
const resetFileInputs = () => {
    if (formEl.value) {
        const fileInputs = formEl.value.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
        if (input) {
            input.value = ''; // Clears the selected file visually
        }
        });
    }
    // Also reset the formData properties for files (important!)
    formData.concern_letter = null;
    formData.passport_cv = null;
    formData.external_party_license = null;
    formData.mou = null;
};


// --- Lifecycle Hook ---
onMounted(async () => {
  isLoading.value = true;
  clearMessage();

  try {
    // 1. Initialize Auth Store & Get User Details
    await authStore.initializeAuth(); // Wait for potential async init

    let userCid = null;

    if (authStore.isAuthenticated && authStore.user) {
      console.log("Auth Store User Data:", JSON.parse(JSON.stringify(authStore.user))); // Log safely

      // Populate from Auth Store Getters
      formData.cid_no = authStore.username || ''; // Assuming username is CID
      userCid = formData.cid_no;
      formData.applicant_name = authStore.fullName || '';
      formData.gender = authStore.gender || '';
      if (authStore.dateOfBirth) {
        try {
          const dob = new Date(authStore.dateOfBirth);
          if (!isNaN(dob.getTime())) {
            formData.date_of_birth = dob.toISOString().split('T')[0]; // YYYY-MM-DD
          } else { formData.date_of_birth = ''; }
        } catch { formData.date_of_birth = ''; }
      } else { formData.date_of_birth = ''; }
      formData.contact_no = authStore.contactNumber || '';
      formData.email_address = authStore.email || '';

      console.log("Populated basic user details from auth store.");

    } else {
      console.error("User not authenticated or user data unavailable.");
      setMessage("Authentication error. Please log in again.", "error");
      isLoading.value = false;
      // Potentially redirect to login: router.push('/login');
      return; // Stop execution if not authenticated
    }

    // 2. Fetch Master Data and Existing ECPF Profile Concurrently
    const fetchPromises = [fetchMasterData()];
    if (userCid) {
      fetchPromises.push(fetchExistingEcpfProfile(userCid));
    } else {
      console.warn("Cannot fetch existing profile - CID missing.");
      formData.existing_ecpf_name = 'N/A (No CID)';
      formData.existing_license_number = 'N/A (No CID)';
    }
    await Promise.all(fetchPromises);
    console.log("Initial data fetching complete (Master Data, Existing Profile).");

    // 3. Check for Draft ID from URL AFTER initial data is ready
    const urlParams = new URLSearchParams(window.location.search);
    const draftIdFromUrl = urlParams.get('draftId');

    if (draftIdFromUrl) {
      console.log(`Draft ID found in URL: ${draftIdFromUrl}. Loading draft...`);
      // loadDraft sets isLoading to false internally
      await loadDraft(draftIdFromUrl);
    } else {
      // If not loading a draft, mark loading as complete now
      isLoading.value = false;
    }

  } catch (error) {
    // Catch any unhandled errors during the setup phase
    console.error("Error during component mount:", error);
    setMessage(`An error occurred during initialization: ${error.message}. Please try refreshing.`, "error");
    isLoading.value = false; // Ensure loading indicator stops
  } finally {
     // Final check in case some path didn't set isLoading to false
     if(isLoading.value){
        isLoading.value = false;
     }
  }
});

</script>

<style scoped>
input:read-only,
input[readonly],
input.cursor-not-allowed {
  cursor: not-allowed;
  background-color: #f3f4f6; /* bg-gray-100 */
  opacity: 0.7;
}

/* Style disabled buttons */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Style file input button */
input[type="file"]::file-selector-button {
    /* You can style the button part of the file input here if needed */
    /* Example: */
    /* background-color: #eff6ff; */
    /* color: #1d4ed8; */
    /* padding: 0.5rem 1rem; */
    /* border: none; */
    /* border-radius: 0.375rem; */
    /* cursor: pointer; */
    /* font-weight: 600; */
    /* font-size: 0.875rem; */
    /* margin-right: 1rem; */
}
</style>