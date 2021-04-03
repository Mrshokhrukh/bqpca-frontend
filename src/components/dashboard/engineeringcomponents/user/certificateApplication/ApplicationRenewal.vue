<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Container with padding -->
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-sm">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        EPC Registration Renewal
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Review your current registration details. Renewal results in a 12-month validity extension from the submission
        date.
      </p>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-gray-600">Loading your registration data...</p>
    </div>

    <!-- Error Message -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-6 my-6 shadow-sm">
      <div class="flex">
        <div class="flex-shrink-0 pt-0.5">
          <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-base font-semibold text-red-800">Error Loading Data</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ loadError }}</p>
          </div>
          <div class="mt-4">
            <button type="button" @click="fetchApplicationData"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0115.357-2m0 0H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Form Card -->
    <div v-else-if="formData.id" class="bg-white border rounded-xl shadow-lg overflow-hidden">
      <!-- Personal Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 px-6 py-5 rounded-t-xl">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">Current Registration Details</h3>
        <p class="mt-1 text-sm text-gray-500">Please review your information. These details are based on your existing
          registration.</p>
      </div>

      <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        
        <div> <label class="block text-sm font-medium text-gray-700">CID No.</label> <input type="text"
            :value="formData.cid" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600" />
        </div>
        <div> <label class="block text-sm font-medium text-gray-700">Full Name</label> <input type="text"
            :value="formData.full_name" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600" />
        </div>
        <div> <label class="block text-sm font-medium text-gray-700">Gender</label> <input type="text"
            :value="formData.gender" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600" />
        </div>
        <div> <label class="block text-sm font-medium text-gray-700">Date of Birth</label> <input type="text"
            :value="formattedDob" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600" />
        </div>
        <div> <label class="block text-sm font-medium text-gray-700">Contact Number</label> <input type="text"
            :value="formData.contact_number" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600" />
        </div>
        <div> <label class="block text-sm font-medium text-gray-700">Email Address</label> <input type="text"
            :value="formData.email || 'N/A'" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600" />
        </div>
        <div class="md:col-span-2 lg:col-span-3"> <label class="block text-sm font-medium text-gray-700">Permanent
            Address</label> <input type="text" :value="permanentAddress" disabled
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 bg-gray-100 cursor-not-allowed text-gray-600"
            placeholder="Village, Gewog, Dzongkhag" /> </div>
        <div class="md:col-span-2 lg:col-span-3 mt-4">
          <div
            :class="['rounded-lg p-5 border', hasExpired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200']">
            <h4 :class="['text-base font-semibold mb-3', hasExpired ? 'text-red-800' : 'text-green-800']">Registration
              Status</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div> <span class="block text-gray-500">Reg. Number</span> <span
                  class="font-medium text-gray-800 text-base">{{ registrationDetails.registration_no || 'N/A' }}</span>
              </div>
              <div> <span class="block text-gray-500">Registration Date</span> <span
                  class="font-medium text-gray-800 text-base">{{
                    formatDisplayDate(registrationDetails.registration_date) }}</span> </div>
              <div> <span class="block text-gray-500">Expiry Date</span> <span
                  :class="['font-medium text-base', hasExpired ? 'text-red-700' : 'text-green-700']"> {{
                    formatDisplayDate(registrationDetails.expiry_date) }} <span v-if="hasExpired"
                    class="ml-1 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full font-semibold align-middle">Expired</span>
                  <span v-else
                    class="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-semibold align-middle">Active</span>
                </span> </div>
            </div>
          </div>
        </div>
      </div>

     
      <div class="border-t border-gray-200 bg-white px-6 sm:px-8 py-6">
        <template v-if="hasExpired">
          <h3 class="text-lg font-semibold text-gray-900 text-red-700">Renewal Required</h3>
          <p class="mt-1 text-sm text-gray-600">Your registration has expired. Complete the declaration and submit to
            apply for renewal (12 months validity from submission).</p>
          <div class="mt-5"> <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks
              (Optional)</label> <textarea id="remarks" v-model="remarks" rows="3" :disabled="isSubmitting"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter any additional information or remarks."></textarea> </div>
          <div class="mt-6">
            <div class="relative flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div class="flex h-6 items-center"> <input id="declaration" type="checkbox" v-model="declaration"
                  :disabled="isSubmitting" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <div class="text-sm leading-6"> <label for="declaration"
                  class="font-medium text-gray-900">Declaration</label>
                <p class="text-gray-600"> I hereby declare that all the information provided is true and correct. I
                  understand that any false statements may result in rejection. </p>
              </div>
            </div>
            <p v-if="!declaration && formAttempted" class="mt-2 text-sm text-red-600"> You must agree to the declaration
              to submit the renewal. </p>
          </div>
        </template>
        <div v-else class="text-center py-8 px-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"> <svg
              class="h-7 w-7 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg> </div>
          <h3 class="text-2xl font-bold text-green-800">Your Registration is Active</h3>
          <p class="mt-2 text-base text-green-700"> Your EPC registration is currently valid until <strong
              class="font-semibold">{{ formatDisplayDate(registrationDetails.expiry_date) }}</strong>. </p>
          <p class="mt-3 text-sm text-gray-600"> No action is required at this time. </p>
        </div>
      </div>

    
      <div class="border-t border-gray-200 bg-gray-50 px-6 py-5 flex justify-end space-x-4 rounded-b-xl">
        <button type="button" @click="handleCancel" :disabled="isSubmitting"
          class="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {{ hasExpired ? 'Cancel Renewal' : 'Back to Dashboard' }} </button>
        <button v-if="hasExpired" type="button" @click="handleSubmit" :disabled="isSubmitting || !declaration"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg> {{ isSubmitting ? 'Submitting...' : 'Submit Renewal Application' }} </button>
      </div>
    </div>

    <!-- Message if no active application found remains the same -->
    <div v-else-if="!isLoading && !loadError && !formData.id"
      class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No Active Registration Found</h3>
      <p class="mt-1 text-sm text-gray-500"> We could not find an active EPC registration associated with your account.
      </p>
      <div class="mt-6"> <router-link to="/admin/user/engineering_certification/apply_epc"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Apply for New Registration </router-link> </div>
    </div>

    <TransitionRoot as="template" :show="showConfirmation">
      <Dialog as="div" class="relative z-50" @close="closeConfirmationModal">
        <TransitionChild as="div" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="div" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <DialogPanel class="px-4 pb-4 pt-5 sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"> <svg
                      class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg> </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900"> Confirm Renewal
                      Submission
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500"> You are about to submit your renewal application. This action
                        cannot
                        be undone after confirmation. </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"> <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50"
                    :disabled="isSubmitting" @click="confirmSubmit"> {{ isSubmitting ? 'Processing...' : 'Confirm &  Submit'}} </button> <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0 disabled:opacity-50"
                    :disabled="isSubmitting" @click="closeConfirmationModal"> Cancel </button> </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services'; // Adjust path if necessary
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore'; // Adjust path if necessary
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

// Reactive variables and setup
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const formData = ref({ id: null, cid: '', full_name: '', gender: '', date_of_birth: '', contact_number: '', email: '', permanent_village: '', permanent_gewog: '', permanent_dzongkhag: '' });
const registrationDetails = ref({ registration_date: '', expiry_date: '', registration_no: '' });
const showConfirmation = ref(false);
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref('');
const declaration = ref(false);
const remarks = ref('');
const formAttempted = ref(false);

// Computed Properties
const formattedDob = computed(() => formatDisplayDate(formData.value.date_of_birth));
const hasExpired = computed(() => {
  if (!registrationDetails.value.expiry_date) return false;
  try {
    const expiryDate = new Date(registrationDetails.value.expiry_date);
    const today = new Date(); today.setHours(0, 0, 0, 0); expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today;
  } catch { return false; }
});
const permanentAddress = computed(() => {
  const parts = [formData.value.permanent_village, formData.value.permanent_gewog, formData.value.permanent_dzongkhag].filter(Boolean);
  return parts.join(', ') || 'N/A';
});

// Lifecycle Hook
onMounted(async () => { await fetchApplicationData(); });

// Methods
const fetchApplicationData = async () => {
  isLoading.value = true; loadError.value = ''; formData.value = { id: null }; registrationDetails.value = {};
  try {
    const cid = authStore.user?.cid; if (!cid) { throw new Error('User authentication error.'); }
    console.log(`Fetching application data for CID: ${cid}`);
    const response = await apiService.getApplicationWithCid(cid);
    console.log("API Response:", response);
    let activeApplication = null; const results = response.data?.results || response.data;
    if (Array.isArray(results)) {
      activeApplication = results.find(app => (app.cid_no === cid || app.cid === cid) && app.is_active === true);
      if (!activeApplication && results.length > 0) { const userApps = results.filter(app => app.cid_no === cid || app.cid === cid); if (userApps.length > 0) activeApplication = userApps[0]; }
    } else if (typeof results === 'object' && results !== null && (results.cid_no === cid || results.cid === cid)) { activeApplication = results; }

    if (!activeApplication) { console.warn(`No active application found for CID: ${cid}`); formData.value.id = null; }
    else {
      console.log('Active application found:', activeApplication);
      formData.value = { id: activeApplication.id, cid: activeApplication.cid_no || activeApplication.cid, full_name: activeApplication.full_name, gender: activeApplication.gender, date_of_birth: activeApplication.date_of_birth, contact_number: activeApplication.contact_no || activeApplication.contact_number, email: activeApplication.email_address || activeApplication.email, permanent_village: activeApplication.village || activeApplication.permanent_village, permanent_gewog: activeApplication.gewog || activeApplication.permanent_gewog, permanent_dzongkhag: activeApplication.dzongkhag || activeApplication.permanent_dzongkhag };
      if (!activeApplication.registration_no || !activeApplication.expiry_date) {
        console.warn("Fetched application missing reg details. Trying fallback."); await fetchLatestRenewalDetails(activeApplication.id);
        if (!registrationDetails.value.registration_no || !registrationDetails.value.expiry_date) { throw new Error("Could not determine current registration expiry details."); }
      } else {
        registrationDetails.value = { registration_date: activeApplication.registration_date || '', expiry_date: activeApplication.expiry_date, registration_no: activeApplication.registration_no };
        if (!registrationDetails.value.registration_date) { await fetchLatestRenewalDetails(activeApplication.id); }
      }
    }
  } catch (error) {
    console.error('Error in fetchApplicationData:', error); loadError.value = error.message || 'An unexpected error occurred.'; formData.value = { id: null }; registrationDetails.value = {};
  } finally { isLoading.value = false; }
};

const fetchLatestRenewalDetails = async (applicationId) => {
  try {
    console.log(`Fetching renewal details fallback for app ID: ${applicationId}`);
    const renewalsResponse = await apiService.getEpcRenewals();
    let renewals = renewalsResponse.data?.results || renewalsResponse.data || [];
    const userRenewals = renewals.filter(renewal => renewal.application === applicationId);
    if (userRenewals.length > 0) { userRenewals.sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date)); const latestRenewal = userRenewals[0]; console.log("Latest renewal fallback found:", latestRenewal); if (!registrationDetails.value.registration_no) registrationDetails.value.registration_no = latestRenewal.registration_no; if (!registrationDetails.value.registration_date) registrationDetails.value.registration_date = latestRenewal.registration_date; if (!registrationDetails.value.expiry_date) registrationDetails.value.expiry_date = latestRenewal.expiry_date; }
    else { console.log("No renewal records found for fallback."); }
  } catch (error) { console.error('Error fetching renewal details fallback:', error); }
}

const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A'; try { const date = new Date(dateString); if (isNaN(date.getTime())) return 'Invalid Date'; return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date); } catch { return dateString; }
};
const formatDateForAPI = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) { return null; } const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, '0'); const day = String(date.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`;
};
const handleSubmit = () => {
  if (!hasExpired.value) { toast.info("Your registration is still active."); return; } formAttempted.value = true; if (!declaration.value) { toast.warning('Please review and agree to the declaration.'); return; } showConfirmation.value = true;
};

const confirmSubmit = async () => {
  if (isSubmitting.value) return; isSubmitting.value = true;
  try {
    const today = new Date(); const newExpiryDate = new Date(today); newExpiryDate.setMonth(today.getMonth() + 12); // Add 12 months
    const formattedNewExpiry = formatDateForAPI(newExpiryDate); const formattedToday = formatDateForAPI(today);
    if (!formattedNewExpiry || !formattedToday) { toast.error("Date calculation error."); isSubmitting.value = false; showConfirmation.value = false; return; }

    const renewalData = {
      application: formData.value.id, registration_no: registrationDetails.value.registration_no || `TEMP-${formData.value.cid}`,
      registration_date: formattedToday, new_expiry_date: formattedNewExpiry, // Use correct field name
      remarks: remarks.value || null, status: 'Pending',
    };
    console.log("Submitting Renewal Data:", renewalData);
    await apiService.createEpcRenewal(renewalData);
    toast.success('Renewal application submitted!');
    router.push('/admin/user/engineering_certification/dashboard');
  } catch (error) {
    console.error('Error submitting renewal:', error);
    const errorMsg = error.response?.data?.new_expiry_date?.[0] || error.response?.data?.detail || error.response?.data?.message || error.message || 'Submission failed.';
    toast.error(`Submission Failed: ${errorMsg}`); showConfirmation.value = false;
  } finally { isSubmitting.value = false; }
};

const closeConfirmationModal = () => { if (!isSubmitting.value) { showConfirmation.value = false; } }
const handleCancel = () => { router.push('/admin/user/engineering_certification/dashboard'); };

</script>

<style scoped>
input:disabled {
  cursor: not-allowed;
  background-color: #f3f4f6;
  opacity: 0.7;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>