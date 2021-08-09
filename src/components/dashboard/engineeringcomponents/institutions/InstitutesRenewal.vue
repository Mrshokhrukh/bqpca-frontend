<template>
  <div class="mx-auto px-4 py-8">
    <!-- Page Header (Your original design) -->
    <div class="bg-gray-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Institute Registration Status
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        View and manage your engineering institute registration.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Institute Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchInstituteAndCapaData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Try Again
      </button>
    </div>

    <!-- No Institute Found -->
    <div v-else-if="!instituteData" class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">No Institutes Found</h3>
      <p>No engineering institutes are associated with your account.</p>
    </div>

    <!-- Institute Card (Your original design) -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Institute Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 relative">
              {{ instituteData.name_of_institution }}
              <!-- Status Indicator -->
              <span v-if="isExpiringSoon || isExpired"
                :class="['absolute -top-1 -right-1 h-3 w-3 rounded-full', { 'bg-yellow-500': isExpiringSoon && !isExpired, 'bg-red-500': isExpired }]"></span>
            </h3>
            <p class="text-gray-600">{{ registrationStatusText }}</p>
          </div>
        </div>
      </div>

      <!-- Institute Details -->
      <div class="p-6">
        <!-- Expiration Alert -->
        <div v-if="isExpired" class="mb-6 p-4 rounded-lg border border-red-400 bg-red-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-700">Registration Expired!</h3>
              <p class="mt-1 text-sm text-gray-600">
                Your engineering institute registration expired on {{ formattedExpirationDate }}. Please renew immediately to restore your registration status.
              </p>
            </div>
          </div>
        </div>
        <!-- Expiration Soon Alert -->
        <div v-else-if="isExpiringSoon" class="mb-6 p-4 rounded-lg border border-yellow-400 bg-yellow-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-700">Registration Expiring Soon!</h3>
              <p class="mt-1 text-sm text-gray-600">
                Your engineering institute registration will expire on {{ formattedExpirationDate }}. Please renew to maintain your active status.
              </p>
            </div>
          </div>
        </div>

        <!-- Institute Information (Your original design) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Registration Status</p>
                  <p class="text-sm font-medium" :class="{ 'text-red-600': isExpired, 'text-yellow-600': isExpiringSoon && !isExpired, 'text-green-600': !isExpired && !isExpiringSoon }">
                    {{ registrationStatusText }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid From</p>
                  <p class="text-sm font-medium text-gray-800">{{ formattedActiveDate }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid Until</p>
                  <p class="text-sm font-medium" :class="{ 'text-red-600': isExpired, 'text-yellow-600': isExpiringSoon && !isExpired }">
                    {{ formattedExpirationDate }}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Institute Information</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Contact Person</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.full_name }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Location</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.dzongkhag }}, {{ instituteData.gewog }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Contact</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.contact_no }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.email_address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Renew Button Section (Your original design) -->
        <div class="mt-8">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Ready to Renew?</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Restore your engineering institute's active status by renewing your registration now. The renewal fee is Nu. 1,000.
                </p>
              </div>
            </div>
          </div>

          <!-- CAPA PENDING MESSAGE -->
          <div v-if="isCapaPending" class="text-center mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
            Can't renew as a CAPA on {{ instituteData.name_of_institution }} is not Resolved.
          </div>

          <div class="flex justify-center">
            <button @click="openRenewalDialog" :disabled="isCapaPending" :class="['group relative font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md transform transition-all duration-200',
              { 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 hover:scale-[1.02] hover:shadow-lg': !isCapaPending },
              { 'bg-gray-400 text-gray-700 cursor-not-allowed': isCapaPending }
            ]">
              <div class="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-spin" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                Renew Registration
                <span v-if="isExpired" class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Expired</span>
                <span v-else-if="isExpiringSoon" class="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Expiring</span>
              </div>
            </button>
          </div>

          <p class="text-center text-sm text-gray-500 mt-4">
            Your renewal will be valid for one year from the date of approval.
          </p>
        </div>
      </div>
    </div>

    <!-- Renewal Confirmation Dialog -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Institute Renewal</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to renew your engineering institute registration? You will be
          prompted to make a payment to complete the renewal process.
        </p>
        <div v-if="isRenewing" class="flex items-center justify-center mb-4">
          <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
          <p class="ml-2">Processing...</p>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeRenewalDialog"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing">
            Cancel
          </button>
          <button @click="initiatePayment"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal ref="paymentModal" :amount="100000" @payment-completed="handlePaymentCompleted" @close="closePaymentModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { Loader } from 'lucide-vue-next';

// --- STATE MANAGEMENT ---
const instituteData = ref(null);
const isCapaPending = ref(false);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const showRenewalDialog = ref(false);
const isRenewing = ref(false);
const paymentModal = ref(null);

const authStore = useAuthStore();
const toast = useToast();

// --- COMPUTED PROPERTIES ---
const userCid = computed(() => authStore.user?.cid || '');

const expirationStatus = computed(() => {
  if (!instituteData.value?.valid_till) return { isExpired: false, isExpiringSoon: false };

  const expirationDate = new Date(instituteData.value.valid_till);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);

  const isExpired = expirationDate < today;
  const isExpiringSoon = !isExpired && expirationDate <= ninetyDaysFromNow;

  return { isExpired, isExpiringSoon };
});

const isExpired = computed(() => expirationStatus.value.isExpired);
const isExpiringSoon = computed(() => expirationStatus.value.isExpiringSoon);

const registrationStatusText = computed(() => {
  if (isExpired.value) return 'Expired';
  if (isExpiringSoon.value) return 'Expiring Soon';
  if (instituteData.value?.is_active) return 'Active';
  return 'Inactive';
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formattedActiveDate = computed(() => formatDate(instituteData.value?.valid_since));
const formattedExpirationDate = computed(() => formatDate(instituteData.value?.valid_till));

// --- METHODS ---
const fetchInstituteAndCapaData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  apiError.value = false;
  isCapaPending.value = false;

  try {
    const instituteResponse = await apiServices.getEpcInstitutes();
    instituteData.value = instituteResponse.data?.results?.find(
      (inst) => inst.CID.toLowerCase() === userCid.value.toLowerCase()
    ) || null;

    if (instituteData.value) {
      const capaResponse = await apiServices.getEpcCapas();
      const pendingCapa = capaResponse.data?.results?.find(capa =>
        capa.institute?.id === instituteData.value.id && capa.status === 'P'
      );
      isCapaPending.value = !!pendingCapa;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = error.response?.data?.detail || 'An error occurred while fetching your institute data.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const openRenewalDialog = () => { showRenewalDialog.value = true; };
const closeRenewalDialog = () => { showRenewalDialog.value = false; };
const closePaymentModal = () => { isRenewing.value = false; };

const initiatePayment = () => {
  if (!instituteData.value) {
    toast.error('No institute data available for payment.');
    closeRenewalDialog();
    return;
  }
  isRenewing.value = true;
  paymentModal.value.openModal();
  closeRenewalDialog();
};

const handlePaymentCompleted = async (paymentData) => {
  if (!instituteData.value) {
    toast.error('Institute data is not available. Cannot proceed.');
    isRenewing.value = false;
    return;
  }

  const user = authStore.user;
  if (!user?.id) {
    toast.error('User information is missing. Cannot proceed.');
    isRenewing.value = false;
    return;
  }

  isRenewing.value = true;
  isLoading.value = true;

  try {
    // Step 1: Log the payment for auditing.
    const paymentLogFormData = new FormData();
    paymentLogFormData.append('refNo', paymentData.paymentHash);
    paymentLogFormData.append('serviceCode', '100196');
    paymentLogFormData.append('taxPayerName', instituteData.value.full_name || user.cid);
    paymentLogFormData.append('taxPayerNo', user.cid);
    paymentLogFormData.append('taxPayerDocumentNo', user.cid);
    paymentLogFormData.append('totalPayableAmount', 100000);
    paymentLogFormData.append('payableAmount', 100000);
    paymentLogFormData.append('description', `Renewal fee for Institute: ${instituteData.value.name_of_institution}`);
    paymentLogFormData.append('mobileNo', instituteData.value.contact_no || 'NA');
    paymentLogFormData.append('payerEmail', instituteData.value.email_address || 'NA');
    paymentLogFormData.append('user', user.id);
    paymentLogFormData.append('application_no', instituteData.value.id);
    paymentLogFormData.append('app_type', 'engineering_institute_renewal');
    await apiServices.makePayment(paymentLogFormData);

    // Step 2: Create the dedicated Institute Renewal record. THIS IS THE CORRECT LOGIC.
    const renewalFormData = new FormData();
    renewalFormData.append('institute', instituteData.value.id);
    renewalFormData.append('payment_id', paymentData.paymentHash);
    renewalFormData.append('payment_status', 'completed');
    renewalFormData.append('payment_date', new Date().toISOString());
    renewalFormData.append('renewal_status', 'PENDING_REVIEW');
    renewalFormData.append('user_remarks', 'Payment completed online, awaiting review and approval.');

    // Call the NEW, correct API service function
    await apiServices.createEpcInstituteRenewal(renewalFormData);

    toast.success('Renewal application submitted successfully! Your application is now pending review.');

    // Refetch data to update the UI
    await fetchInstituteAndCapaData();

  } catch (error) {
    console.error('Renewal process failed:', error);
    const apiErrorMsg = error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message;
    toast.error(
      `Renewal Failed: ${apiErrorMsg}. Please contact support with Payment Ref: ${paymentData.paymentHash}`,
      { timeout: 10000 }
    );
  } finally {
    isLoading.value = false;
    isRenewing.value = false;
  }
};

// --- LIFECYCLE HOOK ---
onMounted(fetchInstituteAndCapaData);
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>