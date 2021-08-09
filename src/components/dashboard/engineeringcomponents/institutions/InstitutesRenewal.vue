<template>
  <div class="mx-auto px-4 py-8">
    <div class="bg-gray-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Institute Registration Status
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        View and manage your engineering institute registration.
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Institute Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchInstituteAndCapaData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Try Again
      </button>
    </div>

    <div v-else-if="!instituteData" class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">No Institutes Found</h3>
      <p>No engineering institutes are associated with your account.</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 relative">
              {{ instituteData.name_of_institution }}
              <span v-if="isExpiringSoon || isExpired"
                :class="['absolute -top-1 -right-1 h-3 w-3 rounded-full', { 'bg-yellow-500': isExpiringSoon && !isExpired, 'bg-red-500': isExpired }]"></span>
            </h3>
            <p class="text-gray-600">{{ registrationStatusText }}</p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- RENEWAL PENDING ALERT (highest priority) -->
        <div v-if="isRenewalPending" class="mb-6 p-4 rounded-lg border border-blue-400 bg-blue-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-700">Renewal in Progress</h3>
              <p class="mt-1 text-sm text-gray-600">
                Your renewal application has been submitted and is currently <strong>{{ instituteData.pending_renewal_status
                }}</strong>. You will be notified once the review is complete.
              </p>
            </div>
          </div>
        </div>
        
        <!-- EXPIRATION ALERTS (shown only if not pending) -->
        <div v-else-if="isExpired" class="mb-6 p-4 rounded-lg border border-red-400 bg-red-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-700">Registration Expired!</h3>
              <p class="mt-1 text-sm text-gray-600">
                Your registration expired on {{ formattedExpirationDate }}. Please renew immediately.
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="isExpiringSoon" class="mb-6 p-4 rounded-lg border border-yellow-400 bg-yellow-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-700">Registration Expiring Soon!</h3>
              <p class="mt-1 text-sm text-gray-600">
                Your registration will expire in {{ daysUntilExpiration }} days on {{ formattedExpirationDate }}. Please renew to maintain active status.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Registration Status</p>
                  <p class="text-sm font-medium"
                    :class="{ 'text-red-600': isExpired, 'text-yellow-600': isExpiringSoon && !isExpired, 'text-green-600': !isExpired && !isExpiringSoon && !isRenewalPending, 'text-blue-600': isRenewalPending }">
                    {{ registrationStatusText }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid From</p>
                  <p class="text-sm font-medium text-gray-800">{{ formattedActiveDate }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid Until</p>
                  <p class="text-sm font-medium"
                    :class="{ 'text-red-600': isExpired, 'text-yellow-600': isExpiringSoon && !isExpired }">
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

        <div class="mt-8">
          <!-- *** MODIFICATION: Logic to show EITHER the renewal button OR the info message *** -->
          <div v-if="isRenewalWindowOpen">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Ready to Renew?</h3>
                  <p class="mt-1 text-sm text-gray-600">
                    Restore your engineering institute's active status by renewing your registration now.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="isCapaPending" class="text-center mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
              Can't renew as a CAPA on {{ instituteData.name_of_institution }} is not Resolved.
            </div>

            <div class="flex justify-center">
              <!-- *** MODIFICATION: Updated :disabled logic *** -->
              <button @click="openRenewalDialog" :disabled="isCapaPending || isRenewalPending" :class="['group relative font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md transform transition-all duration-200',
                { 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 hover:scale-[1.02] hover:shadow-lg': !isCapaPending && !isRenewalPending },
                { 'bg-gray-400 text-gray-700 cursor-not-allowed': isCapaPending || isRenewalPending }
              ]">
                <div v-if="isRenewalPending" class="flex items-center justify-center">
                  Renewal Pending...
                </div>
                <div v-else class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-spin"
                    viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd" />
                  </svg>
                  Renew Registration
                  <span v-if="isExpired" class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Expired</span>
                  <span v-else-if="isExpiringSoon" class="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Expiring</span>
                </div>
              </button>
            </div>
          </div>
          
          <!-- *** MODIFICATION: This block shows when it's TOO EARLY to renew *** -->
          <div v-else class="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 class="font-medium text-gray-800">Renewal Window Not Open</h4>
            <p class="text-sm text-gray-600 mt-1">
              You can renew your registration starting 90 days before it expires. Please check back later.
            </p>
          </div>

          <p class="text-center text-sm text-gray-500 mt-4">
            The renewal fee is Nu. 1,000. Your renewal will be valid for one year from the date of approval.
          </p>
        </div>
      </div>
    </div>

    <!-- MODALS AND DIALOGS (No changes needed here) -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Institute Renewal</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to renew your engineering institute registration? You will be
          prompted to make a payment to complete the renewal process.
        </p>
        <div class="flex justify-end space-x-4">
          <button @click="closeRenewalDialog"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancel
          </button>
          <button @click="initiatePayment"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>

    <PaymentModal ref="paymentModal" :amount="100000" @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { Loader } from 'lucide-vue-next';

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

const userCid = computed(() => authStore.user?.cid || '');

const isRenewalPending = computed(() => !!instituteData.value?.pending_renewal_status);

const expirationStatus = computed(() => {
  if (!instituteData.value?.valid_till) {
    return { isExpired: false, isExpiringSoon: false, daysUntil: null };
  }

  const expirationDate = new Date(instituteData.value.valid_till);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date

  // Calculate difference in time
  const timeDiff = expirationDate.getTime() - today.getTime();
  // Calculate difference in days
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const isExpired = dayDiff < 0;
  const isExpiringSoon = !isExpired && dayDiff <= 90;

  return { isExpired, isExpiringSoon, daysUntil: dayDiff };
});

const isExpired = computed(() => expirationStatus.value.isExpired);
const isExpiringSoon = computed(() => expirationStatus.value.isExpiringSoon);
const daysUntilExpiration = computed(() => expirationStatus.value.daysUntil);

// *** MODIFICATION: New computed property to control button visibility ***
const isRenewalWindowOpen = computed(() => {
  if (!instituteData.value) return false;
  // The user can renew if it's expired OR if it's expiring soon.
  return isExpired.value || isExpiringSoon.value;
});

const registrationStatusText = computed(() => {
  if (isRenewalPending.value) {
    return instituteData.value.pending_renewal_status;
  }
  if (isExpired.value) return 'Expired';
  if (isExpiringSoon.value) return `Expiring in ${daysUntilExpiration.value} days`;
  if (instituteData.value?.is_active) return 'Active';
  return 'Inactive';
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formattedActiveDate = computed(() => formatDate(instituteData.value?.valid_since));
const formattedExpirationDate = computed(() => formatDate(instituteData.value?.valid_till));

// --- METHODS (No changes needed in methods) ---
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
  if (paymentModal.value) {
    paymentModal.value.openModal();
  } else {
    toast.error("Payment module failed to load. Please refresh and try again.");
  }
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
  isLoading.value = true;
  isRenewing.value = true;
  try {
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
    const renewalFormData = new FormData();
    renewalFormData.append('institute', instituteData.value.id);
    renewalFormData.append('payment_id', paymentData.paymentHash);
    renewalFormData.append('payment_status', 'completed');
    renewalFormData.append('payment_date', new Date().toISOString());
    renewalFormData.append('renewal_status', 'PENDING_REVIEW');
    renewalFormData.append('user_remarks', 'Payment completed online, awaiting review and approval.');
    await apiServices.createEpcInstituteRenewal(renewalFormData);
    toast.success('Renewal application submitted successfully! Your application is now pending review.');
    await fetchInstituteAndCapaData();
  } catch (error) {
    console.error('Renewal process failed:', error);
    const apiErrorMsg = error.response?.data?.detail || JSON.stringify(error.response?.data) || 'An unknown error occurred';
    toast.error(
      `Renewal Failed: ${apiErrorMsg}. Please contact support with Payment Ref: ${paymentData.paymentHash}`,
      { timeout: 10000 }
    );
  } finally {
    isLoading.value = false;
    isRenewing.value = false;
  }
};

onMounted(fetchInstituteAndCapaData);
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>