<template>
  <div class="w-full mx-auto px-4 py-8">
    <InstituteHeader
      title="Institute Status"
      subtitle="View and manage your institute registration status"
      :show-actions="false"
    />

    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <div
      v-else-if="apiError"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Institute Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchInstituteData" class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Try Again
      </button>
    </div>

    <div
      v-else-if="!instituteData"
      class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">No Institute Found</h3>
      <p>You don't have any registered institute associated with your account.</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 relative">
              {{ instituteData.name_of_institution }}
              <span class="absolute -top-1 -right-4 h-3 w-3 rounded-full" :class="statusIndicatorClass"></span>
            </h3>
            <p class="text-gray-600">
              <span :class="statusTextColorClass">{{ mainStatusText }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- Renewal Window Not Yet Open -->
        <div v-if="!isRenewalWindowActive" class="mb-6 p-4 rounded-lg border border-green-400 bg-green-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg></div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-700">Renewal Not Yet Open</h3>
              <div class="mt-1 text-sm text-green-600">
                <p>Your institute registration is valid until {{ formattedExpirationDate }}. The renewal window will open 90 days before the expiration date. There is no action required at this time.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Expiration/Warning Banner -->
        <div v-if="isRenewalWindowActive && !isActive && instituteData.application_status.includes('Approved') && !isPaymentRequired" class="mb-6 p-4 rounded-lg border border-red-400 bg-red-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-700">{{ expirationWarningTitle }}</h3>
              <div class="mt-1 text-sm text-red-600">
                <p>Your institute registration is no longer active. Please renew immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Required Banner -->
        <div v-if="isRenewalWindowActive && isPaymentRequired" class="mb-6 p-4 rounded-lg border border-yellow-400 bg-yellow-50">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg></div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Payment Required</h3>
              <div class="mt-1 text-sm text-yellow-700">
                <p>Your renewal has been approved. Please complete the payment to view and print your new certificate.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div v-if="isRenewalWindowActive" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div><p class="text-xs text-gray-500">Overall Status</p><p class="text-sm font-medium" :class="reviewDecisionColorClass">{{ instituteData.application_status }}</p></div>
                <div><p class="text-xs text-gray-500">Valid From</p><p class="text-sm font-medium text-gray-800">{{ formattedActiveDate }}</p></div>
                <div><p class="text-xs text-gray-500">Valid Until</p><p class="text-sm font-medium" :class="expirationTextColorClass">{{ formattedExpirationDate }}</p></div>
                <div><p class="text-xs text-gray-500">Renewal Status</p><p class="text-sm font-medium" :class="renewalStatusColorClass">{{ renewalStatusDisplayText }}</p></div>
                <div><p class="text-xs text-gray-500">Payment Status</p><p class="text-sm font-medium" :class="paymentStatusColorClass">{{ paymentStatusDisplayText }}</p></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="isRenewalWindowActive" class="flex justify-end mt-8">
          <button
            v-if="showRenewButton"
            @click="showRenewalModal = true"
            title="Renew your expired institute registration"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mr-4"
          >
            Renew Expired Registration
          </button>
          <button
            v-if="isActive"
            @click="handleViewCertificateClick"
            :class="isPaymentRequired ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'"
            class="text-white font-semibold py-3 px-6 rounded-lg"
          >
            {{ isPaymentRequired ? 'Make Payment to View Certificate' : 'View Certificate' }}
          </button>
        </div>

        <!-- Renewal In Progress Banner -->
        <div v-if="isRenewalWindowActive && renewalIsSubmitted" class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          <h4 class="font-medium">Renewal In Progress</h4>
          <p class="mt-1 text-sm">Your renewal application is under review. You will be notified of the outcome.</p>
        </div>
      </div>
    </div>

    <!-- Modals and Popups -->
    <InstituteRenewalModal
      v-if="instituteData"
      :show="showRenewalModal"
      :institute="instituteData"
      @close="showRenewalModal = false"
      @renewal-submitted="handleRenewalSuccess"
    />

    <PaymentModal
      ref="paymentModalRef"
      :amount="100"
      @payment-completed="handlePaymentCompleted"
    />

    <div v-if="showCertificatePopup" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto print:hidden">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-5xl w-full h-5/6 overflow-y-auto">
        <div class="flex justify-between items-center mb-4 print:hidden">
          <h3 class="text-xl font-bold text-gray-900">Institute Certificate</h3>
          <button @click="closeCertificatePopup" class="text-gray-500 hover:text-gray-700"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div class="certificate-wrapper">
          <InstituteCertificate
            :instituteName="instituteData?.name_of_institution"
            :initialRegistrationDate="formatDateSafely(instituteData?.created_at)"
            :lastRenewalDate="formatDateSafely(instituteData?.updated_at)"
            :expiryDate="formattedExpirationDate"
          />
        </div>
        <div class="flex justify-end mt-4 print:hidden">
          <button @click="closeCertificatePopup" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded">Close</button>
          <button @click="printCertificate" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ml-4">Print Certificate</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiServices from '@/services/services';
import { useToast } from 'vue-toastification';

import { Loader } from 'lucide-vue-next';
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue';
import InstituteRenewalModal from './InstituteRenewalModal.vue';
import InstituteCertificate from './InstituteCertificate.vue';
import PaymentModal from '@/components/common/PaymentModal.vue';

// --- Component State ---
const instituteData = ref(null);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const showRenewalModal = ref(false);
const showCertificatePopup = ref(false);
const renewalIsSubmitted = ref(false);
const paymentModalRef = ref(null);

const authStore = useAuthStore();
const toast = useToast();
const userCid = computed(() => authStore.user?.cid || '');

// --- Helper Functions ---
const formatDateSafely = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// --- Computed Properties ---
const formattedActiveDate = computed(() => formatDateSafely(instituteData.value?.valid_since));
const formattedExpirationDate = computed(() => formatDateSafely(instituteData.value?.valid_till));

const daysUntilExpiration = computed(() => {
  if (!instituteData.value?.valid_till) return -9999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = new Date(instituteData.value.valid_till);
  if (isNaN(expirationDate.getTime())) return -9999;
  return Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
});

const isRenewalWindowActive = computed(() => {
    if (!instituteData.value?.valid_till) return false;
    return daysUntilExpiration.value <= 90;
});

const isActive = computed(() => instituteData.value?.is_active === true && daysUntilExpiration.value > 0);

const isPaymentRequired = computed(() => {
    if (!instituteData.value || !isActive.value) {
        return false;
    }
    const paidStatuses = ['Paid', 'Completed', 'processing_payment', 'SUCCESS'];
    return instituteData.value.application_status.includes('Approved') &&
           !paidStatuses.some(status => instituteData.value.payment_status?.includes(status));
});

const showRenewButton = computed(() => {
  if (!instituteData.value) {
    return false;
  }
  // The button should only appear if the registration is expired.
  const isExpired = !isActive.value;

  // The button should be hidden if a renewal is already in progress (either pending review or awaiting payment).
  const isRenewalInProgress = renewalIsSubmitted.value || isPaymentRequired.value;

  // Show the button ONLY if it's expired AND a renewal process is not already active.
  return isExpired && !isRenewalInProgress;
});

const renewalStatusDisplayText = computed(() => {
    if (renewalIsSubmitted.value) return 'Pending';
    return instituteData.value?.do_dpr_review_decision || 'Not Started';
});

const paymentStatusDisplayText = computed(() => {
    if (isPaymentRequired.value) return 'Pending Payment';
    return instituteData.value?.payment_status || 'N/A';
});

const mainStatusText = computed(() => {
  if (isPaymentRequired.value) return 'Approved - Pending Payment';
  if (instituteData.value?.application_status.includes('Approved') && !isActive.value) return 'Registration Expired';
  if (isActive.value) return 'Active Registration';
  if (renewalIsSubmitted.value) return 'Renewal In Progress';
  return instituteData.value?.application_status || 'Status Unknown';
});

const expirationWarningTitle = computed(() => {
  if (!isActive.value) return 'Registration Expired!';
  return 'Registration Renewal Recommended';
});

const statusIndicatorClass = computed(() => {
  if (isPaymentRequired.value) return 'bg-yellow-500 animate-pulse';
  if (renewalIsSubmitted.value) return 'bg-blue-500 animate-pulse';
  if (!isActive.value) return 'bg-red-500';
  if (daysUntilExpiration.value <= 30) return 'bg-orange-500';
  return 'bg-green-500';
});

const statusTextColorClass = computed(() => {
  if (isPaymentRequired.value) return 'text-yellow-600';
  if (!isActive.value && instituteData.value?.application_status.includes('Approved')) return 'text-red-600';
  if (renewalIsSubmitted.value) return 'text-blue-600';
  return 'text-green-600';
});

const expirationTextColorClass = computed(() => {
  if (daysUntilExpiration.value <= 0) return 'text-red-600 font-semibold';
  if (daysUntilExpiration.value <= 30) return 'text-orange-600';
  return 'text-gray-800';
});

const getDecisionColor = (decision) => {
  if (!decision) return 'text-gray-600';
  const lowerDecision = decision.toLowerCase();
  if (lowerDecision.includes('approved')) return 'text-green-600';
  if (lowerDecision.includes('pending payment')) return 'text-yellow-600';
  if (lowerDecision.includes('pending')) return 'text-yellow-600';
  if (lowerDecision.includes('rejected')) return 'text-red-600';
  return 'text-gray-600';
};

const reviewDecisionColorClass = computed(() => getDecisionColor(instituteData.value?.application_status));
const renewalStatusColorClass = computed(() => getDecisionColor(renewalStatusDisplayText.value));
const paymentStatusColorClass = computed(() => getDecisionColor(paymentStatusDisplayText.value));

// --- Methods ---
const fetchInstituteData = async () => {
  isLoading.value = true;
  apiError.value = false;
  renewalIsSubmitted.value = false;
  try {
    const response = await apiServices.getMhpcInstitutes();
    if (response?.data?.results?.length > 0) {
      instituteData.value = response.data.results.find(inst => inst.CID?.toLowerCase() === userCid.value.toLowerCase());
      if (!instituteData.value) {
        errorMessage.value = "No institute found for your account.";
      }
    } else {
      instituteData.value = null;
    }
  } catch (error) {
    apiError.value = true;
    errorMessage.value = 'An error occurred while fetching institute data.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleRenewalSuccess = () => {
  renewalIsSubmitted.value = true;
};

const openCertificatePopup = () => { showCertificatePopup.value = true; };
const closeCertificatePopup = () => { showCertificatePopup.value = false; };
const printCertificate = () => { window.print(); };

const handleViewCertificateClick = () => {
  if (isPaymentRequired.value) {
    initiatePayment();
  } else {
    openCertificatePopup();
  }
};

const initiatePayment = () => {
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal();
  } else {
    toast.error('Payment modal could not be opened.');
    console.error('Payment modal reference is not available.');
  }
};

const handlePaymentCompleted = async (paymentData) => {
  if (!instituteData.value) {
    toast.error('Institute data not found.');
    return;
  }
  const user = authStore.user;
  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    toast.error('Missing user information. Please log in again.');
    return;
  }

  isLoading.value = true;
  const paymentId = paymentData.paymentHash;

  try {
    const paymentGatewayFormData = new FormData();
    paymentGatewayFormData.append('refNo', paymentId);
    paymentGatewayFormData.append('serviceCode', '100251');
    paymentGatewayFormData.append('taxPayerName', instituteData.value.name_of_institution);
    paymentGatewayFormData.append('taxPayerNo', user.cid);
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid);
    paymentGatewayFormData.append('totalPayableAmount', 100);
    paymentGatewayFormData.append('description', 'MHPC Institute Renewal Fee');
    paymentGatewayFormData.append('mobileNo', user.contact_number);
    paymentGatewayFormData.append('payerEmail', user.email);
    paymentGatewayFormData.append('user', user.id);
    paymentGatewayFormData.append('payableAmount', 100);
    paymentGatewayFormData.append('application_no', instituteData.value.id);
    paymentGatewayFormData.append('app_type', 'mhpc_institute_renewal');

    await apiServices.makePayment(paymentGatewayFormData);

    const updateBackendFormData = new FormData();
    updateBackendFormData.append('payment_id', paymentId);
    updateBackendFormData.append('payment_status', 'processing_payment');

    await apiServices.patchMhpcInstitute(instituteData.value.id, updateBackendFormData);

    instituteData.value.payment_id = paymentId;
    instituteData.value.payment_status = 'processing_payment';

    toast.success(`Payment initiated (Ref: ${paymentId.substring(0, 8)}...). Your status will update shortly.`);

    setTimeout(() => {
        fetchInstituteData();
    }, 3000);

  } catch (error) {
    console.error('Payment completion handling error:', error);
    toast.error('An error occurred while confirming your payment. Please contact support.');
    if (instituteData.value) {
      instituteData.value.payment_status = 'failed';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchInstituteData);
</script>

<style scoped>
@media print {
  body * { visibility: hidden; }
  .certificate-wrapper, .certificate-wrapper * { visibility: visible; }
  .certificate-wrapper { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
  .print\:hidden { display: none !important; }
}
</style>