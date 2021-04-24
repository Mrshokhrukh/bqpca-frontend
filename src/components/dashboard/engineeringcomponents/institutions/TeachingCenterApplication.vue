<template>
  <div class="p-8 rounded-xl bg-gray-50">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">New Teaching Center Application</h2>

    <!-- Loading Overlay -->
     <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="text-white text-xl">Processing...</div>
        <!-- You can add a spinner here -->
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8" enctype="multipart/form-data">
      <!-- Proponent Details Section -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label for="trainingInstituteName" class="block text-sm font-medium text-gray-600">
              Training Institute Name <span class="text-red-500">*</span>
            </label>
            <select
              id="trainingInstituteName"
              v-model="formData.institute_id"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              :disabled="isLoading"
            >
              <option value="" disabled>Select Institute</option>
              <option
                v-for="institute in instituteOptions"
                :key="institute.value"
                :value="institute.value"
              >
                {{ institute.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-600"> Country </label>
            <input
              type="text"
              id="country"
              v-model="formData.proponent_country"
              disabled
              class="mt-2 block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md shadow-sm sm:text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-600">
              Dzongkhag/Throme
            </label>
            <input
              type="text"
              id="dzongkhag"
              v-model="formData.proponent_dzongkhag"
              disabled
              class="mt-2 block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md shadow-sm sm:text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label for="cityGewogProponent" class="block text-sm font-medium text-gray-600">
              City/Gewog
            </label>
            <input
              type="text"
              id="cityGewogProponent"
              v-model="formData.proponent_city_gewog"
              disabled
              class="mt-2 block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md shadow-sm sm:text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label for="addressLocation" class="block text-sm font-medium text-gray-600">
              Address/Location
            </label>
            <input
              type="text"
              id="addressLocation"
              v-model="formData.proponent_address"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="contactNo" class="block text-sm font-medium text-gray-600">
              Contact No.
            </label>
            <input
              type="text"
              id="contactNo"
              v-model="formData.proponent_contact_no"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="emailAddress" class="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="emailAddress"
              v-model="formData.proponent_email"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :disabled="isLoading"
            />
          </div>
        </div>
      </section>

      <!-- Teaching Center Details Section -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6">Proposal Details (Teaching Center Details)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label for="centerName" class="block text-sm font-medium text-gray-600">
              Center Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="centerName"
              v-model="formData.center_name"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="centerLocation" class="block text-sm font-medium text-gray-600">
              Center Location <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="centerLocation"
              v-model="formData.center_location"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="stateDzongkhag" class="block text-sm font-medium text-gray-600">
              State/Dzongkhag <span class="text-red-500">*</span>
            </label>
            <select
              id="stateDzongkhag"
              v-model="formData.state_dzongkhag"
              @change="formData.city_gewog = ''"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              :disabled="isLoading"
            >
              <option value="" disabled>Select Dzongkhag</option>
              <option
                v-for="dzongkhag in dzongkhagOptions"
                :key="dzongkhag.value"
                :value="dzongkhag.value"
              >
                {{ dzongkhag.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="cityGewogCenter" class="block text-sm font-medium text-gray-600">
              City/Gewog <span class="text-red-500">*</span>
            </label>
            <select
              id="cityGewogCenter"
              v-model="formData.city_gewog"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :disabled="!formData.state_dzongkhag || isLoading"
              required
            >
              <option value="" disabled>Select City/Gewog</option>
              <option v-for="city in cityGewogOptions" :key="city.value" :value="city.value">
                {{ city.label }}
              </option>
            </select>
             <p v-if="!formData.state_dzongkhag" class="mt-1 text-xs text-gray-500">Please select a Dzongkhag first.</p>
          </div>
          <div class="md:col-span-2">
            <label for="targetCategory" class="block text-sm font-medium text-gray-600">
              Target Category <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="targetCategory"
              v-model="formData.target_category"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              :disabled="isLoading"
            />
          </div>


          <div class="md:col-span-2"> 
            <label for="tcAttachments" class="block text-sm font-medium text-gray-600">
              Attachments (if any)
            </label>
            <input
              type="file"
              id="tcAttachments"
              ref="attachmentsInput"
              @change="handleAttachmentChange"
              multiple
              class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              :disabled="isLoading"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <p class="mt-1 text-sm text-gray-500">Attach relevant documents (e.g., infrastructure proof, faculty list). Max 5MB each.</p>
             <ul v-if="formData.tc_attachments && formData.tc_attachments.length > 0" class="mt-2 list-disc list-inside text-sm text-gray-600">
                <li v-for="file in formData.tc_attachments" :key="file.name">{{ file.name }}</li>
             </ul>
             <p v-else class="mt-2 text-xs text-gray-500 italic">No attachments selected.</p>
          </div>


          <div class="md:col-span-2">
            <label for="remarks" class="block text-sm font-medium text-gray-600">
              Remarks (General)
            </label>
            <textarea
              id="remarks"
              v-model="formData.remarks"
              rows="3"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               :disabled="isLoading"
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Declaration Section -->
      <div class="flex items-start p-6 bg-white rounded-lg shadow">
        <div class="flex items-center h-5">
          <input
            id="declaration"
            aria-describedby="declaration-description"
            type="checkbox"
            v-model="formData.declaration"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration <span class="text-red-500">*</span></label>
          <p id="declaration-description" class="text-gray-500">
            I hereby declare that the information provided above is true and correct to the best of
            my knowledge.
          </p>
        </div>
      </div>

      <!-- Action Buttons Section -->
      <div class="flex flex-col sm:flex-row justify-between items-center p-6 bg-white rounded-lg shadow gap-4">
         <div v-if="applicationId" class="text-sm text-gray-600">
          Application Status: <span class="font-semibold capitalize">{{ applicationStatus || 'Unknown' }}</span>
          <span v-if="applicationStatus === 'pending'">(Waiting for officer approval)</span>
          <span v-if="applicationStatus === 'rejected'">(Please revise and resubmit)</span>
          <span v-if="applicationStatus === 'approved'">(Approved, awaiting payment)</span>
          <span v-if="applicationStatus === 'paid'">(Payment Received)</span>
          <span v-if="applicationStatus === 'error'">(Error during submission/polling)</span>
          <!-- Draft status is not tracked via API -->
        </div>
         <div v-else class="text-sm text-gray-600">
            Fill the form and submit for approval or save as draft.
         </div>
        <div class="flex flex-wrap justify-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 w-full sm:w-auto">
           <button
            v-if="applicationStatus === 'approved'"
            type="button"
            class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            @click="openPaymentModal"
            :disabled="isLoading"
          >
            Make Payment
          </button>
          <button
            type="button"
            class="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out"
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            type="button"
            class="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition duration-150 ease-in-out"
            @click="saveDraft"
             :disabled="applicationStatus === 'pending' || applicationStatus === 'approved' || applicationStatus === 'paid'"
             :class="{ 'opacity-50 cursor-not-allowed': applicationStatus === 'pending' || applicationStatus === 'approved' || applicationStatus === 'paid' }"
             >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!formData.declaration || isLoading || applicationStatus === 'pending' || applicationStatus === 'approved' || applicationStatus === 'paid'"
            class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            :class="{ 'opacity-50 cursor-not-allowed': !formData.declaration || isLoading || applicationStatus === 'pending' || applicationStatus === 'approved' || applicationStatus === 'paid' }"
          >
            Submit
          </button>
        </div>
      </div>
    </form>

    <!-- Payment Modal -->
    <PaymentModal
      v-if="isPaymentModalOpen"
      @submit="handlePaymentSubmit"
      @cancel="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue';
import PaymentModal from '@/components/common/PaymentModal.vue'; // Adjust path if needed
import apiServices from '@/services/services'; // Ensure this path is correct
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags'; // Assuming your constant path
import { useToast } from 'vue-toastification';

// --- Refs for File Inputs ---
const attachmentsInput = ref(null);
// --- REMOVED: reportInput ref ---

// --- State ---
const instituteOptions = ref([]);
const allInstitutesDetails = ref([]);
const applicationId = ref(null);
const applicationStatus = ref(''); // pending, approved, rejected, paid, error, '' (initial/draft)
const isPaymentModalOpen = ref(false);
const isLoading = ref(false);
const toast = useToast();

// --- Form Data ---
const formData = ref({
  institute_id: '',
  proponent_country: 'Bhutan',
  proponent_dzongkhag: '',
  proponent_city_gewog: '',
  proponent_address: '',
  proponent_contact_no: '',
  proponent_email: '',
  center_name: '',
  center_location: '',
  city_gewog: '',           // Teaching Center Gewog
  state_dzongkhag: '',      // Teaching Center Dzongkhag
  target_category: '',
  tc_attachments: [],       // Holds File objects temporarily, NOT saved in draft
  remarks: '',              // General Remarks
  declaration: false,
  // --- REMOVED: tc_renewal_review_name, tc_review_summary, valid_till, tc_report, tc_remarks ---
});

// --- Computed Properties ---
// todayDate computed property is removed as valid_till field is removed

const dzongkhagOptions = computed(() =>
  bhutanDzongkhagsGewogs.map((item) => ({
    value: item.dzongkhag,
    label: item.dzongkhag,
  }))
);

const cityGewogOptions = computed(() => {
  if (!formData.value.state_dzongkhag) return [];
  const selectedDzongkhagData = bhutanDzongkhagsGewogs.find(
    (item) => item.dzongkhag === formData.value.state_dzongkhag
  );
  return selectedDzongkhagData
    ? selectedDzongkhagData.gewogs.map((gewog) => ({ value: gewog, label: gewog }))
    : [];
});

// --- Watchers ---
onMounted(async () => {
  isLoading.value = true;
  try {
    const institutesResponse = await apiServices.getEpcInstitutes();
    if (institutesResponse.data && institutesResponse.data.results) {
      const institutesArray = institutesResponse.data.results;
      allInstitutesDetails.value = institutesArray;
      instituteOptions.value = institutesArray.map((institute) => ({
        value: institute.id,
        label: institute.name_of_institution,
      }));
    } else {
      console.error('Unexpected API response structure for institutes:', institutesResponse.data);
      toast.error('Failed to load institute options.');
    }
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    toast.error('Failed to load initial dropdown options.');
  } finally {
    isLoading.value = false;
  }

  // Load draft from localStorage
  const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (savedDraft) {
    try {
      const parsedDraft = JSON.parse(savedDraft);
      // Assign saved values, EXCLUDING file fields
      Object.keys(parsedDraft).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
           // Explicitly skip file fields - they must be re-uploaded
           if (key !== 'tc_attachments') { // Only tc_attachments needs skipping now
               formData.value[key] = parsedDraft[key];
           }
        }
      });
      // Ensure file fields are reset correctly
      formData.value.tc_attachments = [];
      toast.info('Draft loaded. Please re-select any attachments if needed.', { timeout: 5000 });
    } catch (error) {
      console.error('Error loading draft:', error);
      clearDraft(); // Clear corrupted draft
      toast.error('Failed to load draft from local storage.');
    }
  }
});

// Watch for institute selection change
watch(() => formData.value.institute_id, (newInstituteId) => {
    const selectedInstituteDetails = allInstitutesDetails.value.find(
      (inst) => inst.id === newInstituteId
    );
    if (selectedInstituteDetails) {
      formData.value.proponent_country = selectedInstituteDetails.country || 'Bhutan';
      formData.value.proponent_dzongkhag = selectedInstituteDetails.dzongkhag || '';
      formData.value.proponent_city_gewog = selectedInstituteDetails.gewog || '';
      formData.value.proponent_address = selectedInstituteDetails.address || '';
      formData.value.proponent_contact_no = selectedInstituteDetails.contact_no || '';
      formData.value.proponent_email = selectedInstituteDetails.email_address || '';
    } else {
      // Reset proponent fields if selection is cleared or invalid
      formData.value.proponent_country = 'Bhutan';
      formData.value.proponent_dzongkhag = '';
      formData.value.proponent_city_gewog = '';
      formData.value.proponent_address = '';
      formData.value.proponent_contact_no = '';
      formData.value.proponent_email = '';
      if (newInstituteId) {
        console.warn(`Details not found for institute ID: ${newInstituteId}. Proponent fields cleared.`);
      }
    }
});

// Watch for application ID to poll status
let pollInterval = null;
watch(() => applicationId.value, (newId, oldId) => {
  if (pollInterval && (newId !== oldId || !newId)) { // Stop if ID changes or becomes null
    clearInterval(pollInterval);
    pollInterval = null;
    if (oldId) console.log(`Polling stopped for previous ID: ${oldId}`);
  }

  if (newId && ['pending', 'submitted'].includes(applicationStatus.value)) { // Only poll if ID exists and status is pollable
     const pollStatus = async () => {
        if (!applicationId.value) { // Safety check inside interval
           clearInterval(pollInterval); pollInterval = null; return;
        }
        try {
            console.log(`Polling status for App ID: ${applicationId.value}`);
            const response = await apiServices.getApplicationStatus(applicationId.value); // Ensure this API endpoint exists and returns status
            const newStatus = response.data?.status?.toLowerCase() || 'unknown'; // Adjust based on actual API response structure
            console.log(`Received status: ${newStatus}`);

            if (newStatus !== applicationStatus.value) {
                applicationStatus.value = newStatus;
            }

            // Stop polling if status is final (approved, rejected, paid, error, etc.)
            if (!['pending', 'submitted'].includes(applicationStatus.value)) {
                clearInterval(pollInterval); pollInterval = null;
                console.log(`Polling stopped for ${applicationId.value}. Final status: ${applicationStatus.value}`);
                 if (applicationStatus.value === 'approved') {
                   toast.info("Application approved! You can now proceed with payment.", { timeout: 6000 });
                } else if (applicationStatus.value === 'rejected') {
                   toast.warning("Application rejected. Please review the feedback, revise, and resubmit.", { timeout: 8000 });
                }
            }
        } catch (error) {
            console.error(`Error polling application status for ${applicationId.value}:`, error);
            applicationStatus.value = 'error'; // Indicate polling error
            toast.error("Error checking application status.", { timeout: 5000 });
            clearInterval(pollInterval); pollInterval = null;
        }
     };
     // Initial check immediately, then set interval
     pollStatus();
     pollInterval = setInterval(pollStatus, 15000); // Poll every 15 seconds
     console.log(`Polling started for App ID: ${newId}`);
  }
}, { immediate: false }); // Don't run immediately on mount, wait for an ID


// --- File Handlers ---
const handleAttachmentChange = (event) => {
  formData.value.tc_attachments = Array.from(event.target.files);
};

// --- REMOVED: handleReportFileChange ---

// --- Modal Handlers ---
const openPaymentModal = () => { isPaymentModalOpen.value = true; };
const closePaymentModal = () => { isPaymentModalOpen.value = false; };

// --- Draft Management Functions ---
const DRAFT_STORAGE_KEY = 'teachingCenterFormDraft';

const saveDraft = () => {
  if (applicationStatus.value === 'pending' || applicationStatus.value === 'approved' || applicationStatus.value === 'paid') return; // Prevent saving draft if submitted/approved
  try {
    const draftData = { ...formData.value };
    draftData.tc_attachments = []; // Don't save file objects
    // --- REMOVED: draftData.tc_report = null; ---

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    toast.success('Draft saved locally successfully!', { timeout: 3000 });
  } catch (error) {
      console.error("Error saving draft to local storage:", error);
      toast.error('Could not save draft locally. Storage might be full or unavailable.');
  }
};

const clearDraft = () => {
  try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      console.log('Local draft cleared.');
  } catch (error) {
      console.error("Error clearing draft from local storage:", error);
  }
};
// --- END: Draft Management Functions ---


// --- Form Actions ---
const handleSubmit = async () => {
  if (!formData.value.declaration) {
    toast.warning('Please agree to the declaration before submitting.', { timeout: 4000 });
    return;
  }
  // Updated Validation: Check only required fields according to the refined list
  if (!formData.value.institute_id || !formData.value.center_name || !formData.value.center_location || !formData.value.state_dzongkhag || !formData.value.city_gewog || !formData.value.target_category) {
        toast.error('Please fill in all required fields marked with *.');
        return;
    }

  isLoading.value = true;
  const payload = new FormData();

  // Append all simple fields
  Object.entries(formData.value).forEach(([key, value]) => {
    // Skip file fields, handle them separately
    if (key !== 'tc_attachments' && value !== null && value !== undefined) {
      payload.append(key, value);
    }
  });

  // Append attachments if any were selected
  if (formData.value.tc_attachments && formData.value.tc_attachments.length > 0) {
    formData.value.tc_attachments.forEach((file) => {
      // Ensure backend key matches 'tc_attachments' for multiple files
      payload.append('tc_attachments', file, file.name);
    });
  }
  // --- REMOVED: Appending tc_report ---

  console.log("Submitting FormData Payload:");
  for (let pair of payload.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
  }

  try {
    // Use the correct API service function for creating the teaching center proposal
    const response = await apiServices.createEpcTeachingCenter(payload); // Make sure this function exists and is correct

    toast.success(response.data.message || 'Application submitted successfully!');
    applicationId.value = response.data.id; // Store ID from response
    applicationStatus.value = response.data.status?.toLowerCase() || 'pending'; // Set status from response

    clearDraft(); // Clear local draft after successful submission

    // Optionally navigate away or reset form after a delay
    // setTimeout(() => { /* Navigate or further actions */ }, 1500);

  } catch (error) {
    console.error('Error submitting form:', error);
    let message = 'Error submitting application. Please try again.';
     if (error.response?.data) {
        if (typeof error.response.data === 'object') {
             // Try to format detailed errors if available
             const errors = Object.entries(error.response.data)
                .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                .join('; ');
            message = `Submission Failed: ${errors || JSON.stringify(error.response.data)}`;
        } else {
             message = `Submission Failed: ${error.response.data}`; // Handle plain string errors
        }
    } else if (error.request) {
        message = 'Submission Failed: No response from server.';
    } else if (error.message) {
         message = `Submission Failed: ${error.message}`;
    }
    toast.error(message, { timeout: 7000 });
    applicationStatus.value = 'error'; // Indicate submission error
  } finally {
      isLoading.value = false;
  }
};

const handlePaymentSubmit = async (paymentDetails) => {
    if (!applicationId.value) { toast.error("Missing Application ID for payment."); return; }
    if (!paymentDetails?.amount || !paymentDetails?.transaction_id) { toast.error("Invalid payment details."); return; }

    isLoading.value = true;
    try {
        // Ensure API service expects 'application_id' or adjusts payload key accordingly
        const paymentPayload = { application_id: applicationId.value, ...paymentDetails };
        await apiServices.submitPayment(paymentPayload); // Make sure this API endpoint exists and handles the payload
        toast.success('Payment submitted successfully!');
        closePaymentModal();
        applicationStatus.value = 'paid'; // Update status locally, or re-fetch status if needed
        // Optionally re-fetch status: await pollStatus(); // If pollStatus is refactored to be callable
    } catch (error) {
        console.error('Error submitting payment:', error);
        let message = 'Error submitting payment.';
        if (error.response?.data) {
            message += ` Details: ${JSON.stringify(error.response.data)}`;
        } else if (error.message) {
            message += ` ${error.message}`;
        }
        toast.error(message, { timeout: 6000 });
    } finally {
        isLoading.value = false;
    }
};

const resetForm = () => {
   // Reset only the fields present in the refined formData
   formData.value = {
    institute_id: '',
    proponent_country: 'Bhutan',
    proponent_dzongkhag: '',
    proponent_city_gewog: '',
    proponent_address: '',
    proponent_contact_no: '',
    proponent_email: '',
    center_name: '',
    center_location: '',
    city_gewog: '',
    state_dzongkhag: '',
    target_category: '',
    tc_attachments: [],
    remarks: '',
    declaration: false,
  };
  // Reset file input visually
  if (attachmentsInput.value) attachmentsInput.value.value = '';
  // --- REMOVED: Resetting reportInput ---

  // Reset application state
  applicationId.value = null;
  applicationStatus.value = '';
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }

  clearDraft(); // Clear local draft on reset
};

const handleCancel = () => {
   // Optional: Add confirmation dialog
   const confirmCancel = window.confirm("Are you sure you want to cancel? Any unsaved changes and the local draft will be lost.");
   if (confirmCancel) {
      resetForm();
      toast.info("Form cancelled and cleared.", { timeout: 3000 });
   }
};

// Cleanup polling interval on component unmount
onUnmounted(() => {
    if (pollInterval) {
        clearInterval(pollInterval);
        console.log("Cleared polling interval on unmount.");
    }
});

</script>

<style scoped>
/* Styles remain the same */
input:disabled, select:disabled, textarea:disabled {
    background-color: #f3f4f6; /* bg-gray-100 */
    cursor: not-allowed;
    color: #6b7280; /* text-gray-500 */
}
/* Custom file input button style */
input[type="file"]::-webkit-file-upload-button,
input[type="file"]::file-selector-button {
 @apply mr-4 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer transition duration-150 ease-in-out;
}
/* Style for disabled file input button */
input[type="file"]:disabled::-webkit-file-upload-button,
input[type="file"]:disabled::file-selector-button {
    cursor: not-allowed;
    opacity: 0.6;
}
/* Required field indicator */
.text-red-500 {
  color: #ef4444;
}
/* Ensure buttons handle disabled state visually */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.opacity-50 { opacity: 0.5; }
.cursor-not-allowed { cursor: not-allowed; }
</style>