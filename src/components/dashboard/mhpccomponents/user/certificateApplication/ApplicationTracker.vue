<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-6 sm:py-8">
    <TrackerTabs :tabs="tabs" :currentTab="currentTab" @update:currentTab="handleTabChange" />

    <PageHeader :title="pageHeaderTitle" :subtitle="pageHeaderSubtitle">
      <template #icon>
        <ClipboardList class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <div v-if="isLoading" class="my-8 flex justify-center">
      <div class="flex flex-col items-center space-y-3">
        <svg
          class="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-600 font-medium">Loading your {{ loadingText }} data...</p>
      </div>
    </div>

    <div v-if="!isLoading">
      <NewApplicationsTracker
        v-if="currentTab === 'new' && newApplications.length > 0"
        :applications="newApplications"
        @open-certificate="openCertificateModal"
        @initiate-payment="handleInitiatePaymentEvent"
      />
      <RenewalApplicationsTracker
        v-if="currentTab === 'renewal' && renewalApplications.length > 0"
        :applications="renewalApplications"
        @open-certificate="openCertificateModal"
        @initiate-payment="handleInitiatePaymentEvent"
      />
      <AdditionalQualificationsTracker
        v-if="currentTab === 'additional' && additionalApplications.length > 0"
        :applications="additionalApplications"
        @open-certificate="openCertificateModal"
        @initiate-payment="handleInitiatePaymentEvent"
      />

      <div
        v-if="!apiError && currentDataIsEmpty"
        class="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-md"
      >
        <div class="flex flex-col items-center justify-center">
          <div class="p-3 bg-gray-100 rounded-full mb-3">
            <SearchX class="w-6 h-6 text-gray-400" />
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No {{ noResultsText }} Found
          </h3>
          <p class="text-gray-600 max-w-md mx-auto text-sm px-4">
            We couldn't find any {{ noResultsText.toLowerCase() }} matching your details.
          </p>
        </div>
      </div>

      <div
        v-if="apiError"
        class="text-center py-8 sm:py-12 bg-red-50 rounded-xl border border-red-200 shadow-md"
      >
        <div class="flex flex-col items-center justify-center">
          <div class="p-3 bg-red-100 rounded-full mb-3">
            <AlertTriangle class="w-6 h-6 text-red-500" />
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
          <p class="text-red-600 max-w-md mx-auto text-sm px-4">
            An error occurred while fetching your {{ loadingText }} data. Please try again later or
            contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>

    <CertificateModal
      :application="selectedCertificateData" @close="closeCertificateModal"
      :showModal="showCertificateModal"
    />

    <PaymentModal
      ref="paymentModalRef"
      :amount="1000"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services'
import CertificateModal from '@/components/common/MHPC/MHPCCertificateModal.vue' // Assuming it's in the same directory or adjust path
import PaymentModal from '@/components/common/PaymentModal.vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import TrackerTabs from './TrackerTabs.vue'
import NewApplicationsTracker from './NewApplicationsTracker.vue'
import RenewalApplicationsTracker from './RenewalApplicationsTracker.vue'
import AdditionalQualificationsTracker from './AdditionalQualificationsTracker.vue'

import { AlertTriangle, SearchX, ClipboardList } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()
const authStore = useAuthStore()

const newApplications = ref([])
const renewalApplications = ref([])
const additionalApplications = ref([])
const isLoading = ref(false)
const hasAttemptedFetch = ref(false)
const apiError = ref(false)
const showCertificateModal = ref(false)
const selectedCertificateData = ref(null)
const paymentModalRef = ref(null)
const selectedQualificationForPayment = ref(null)
const currentTab = ref('new')

const tabs = [
  { name: 'new', label: 'New Applications' },
  { name: 'renewal', label: 'Renewals' },
  { name: 'additional', label: 'Additional Qualifications' },
]

const userCid = computed(() => authStore.user?.cid)

const pageHeaderTitle = computed(() => {
  if (currentTab.value === 'new') return 'Track Your Application'
  if (currentTab.value === 'renewal') return 'Track Your Renewal'
  return 'Track Additional Qualifications'
})

const pageHeaderSubtitle = computed(() => {
  if (currentTab.value === 'new') return 'Your application status is displayed below.'
  if (currentTab.value === 'renewal') return 'Your renewal status is displayed below.'
  return 'Your additional qualifications status is displayed below.'
})

const loadingText = computed(() => {
  if (currentTab.value === 'new') return 'application'
  if (currentTab.value === 'renewal') return 'renewal'
  return 'additional qualifications'
})

const noResultsText = computed(() => {
  if (currentTab.value === 'new') return 'Applications'
  if (currentTab.value === 'renewal') return 'Renewals'
  return 'Additional Qualifications'
})

const currentDataIsEmpty = computed(() => {
  if (!hasAttemptedFetch.value) return false
  if (currentTab.value === 'new') return newApplications.value.length === 0
  if (currentTab.value === 'renewal') return renewalApplications.value.length === 0
  if (currentTab.value === 'additional') return additionalApplications.value.length === 0
  return true
})

const handleTabChange = (tabName) => {
  currentTab.value = tabName
}

const fetchNewApplications = async () => {
  if (!userCid.value) return;
  isLoading.value = true;
  apiError.value = false;
  try {
    const response = await apiService.getMhpcFullApplicationListByCid(userCid.value);
    if (response && response.data && response.data.results) {
      // Filter for applications that are NOT renewals AND have at least one PRIMARY qualification.
      newApplications.value = response.data.results.filter(app => {
        // Assuming 'is_renewal' is a flag on the application object from this endpoint if it can be a renewal.
        // If this endpoint *never* returns renewals, you might not need the !app.is_renewal check here.
        const isNotRenewal = !app.is_renewal; // Adjust if is_renewal flag is named differently or not present

        const hasPrimaryQualifications =
          app.user_qualifications &&
          app.user_qualifications.some(q => q.is_primary_qualification === true);

        return isNotRenewal && hasPrimaryQualifications;
      });
    } else {
      newApplications.value = [];
    }
  } catch (error) {
    console.error('Error fetching new applications:', error);
    newApplications.value = [];
    apiError.value = true;
    toast.error('Failed to load new application data.');
  } finally {
    isLoading.value = false;
  }
};

const fetchRenewalApplications = async () => {
  if (!userCid.value) return;
  isLoading.value = true;
  apiError.value = false;
  try {
    const response = await apiService.getMhpcRenewals(); // This endpoint specifically gets renewals
    if (response && response.data && response.data.results) {
      renewalApplications.value = response.data.results;
    } else {
      renewalApplications.value = [];
    }
  } catch (error) {
    console.error('Error fetching renewal applications:', error);
    renewalApplications.value = [];
    apiError.value = true;
    toast.error('Failed to load renewal data.');
  } finally {
    isLoading.value = false;
  }
};

const fetchAdditionalApplications = async () => {
  if (!userCid.value) return;
  isLoading.value = true;
  apiError.value = false;
  try {
    const response = await apiService.getMhpcFullApplicationListByCid(userCid.value);
    if (response && response.data && response.data.results) {
      // Filter for applications that are NOT renewals AND have at least one NON-PRIMARY qualification.
      additionalApplications.value = response.data.results.filter(app => {
        const isNotRenewal = !app.is_renewal; // Adjust if is_renewal flag is named differently or not present

        const hasNonPrimaryQualifications =
          app.user_qualifications &&
          app.user_qualifications.some(q => q.is_primary_qualification === false);

        return isNotRenewal && hasNonPrimaryQualifications;
      });
    } else {
      additionalApplications.value = [];
    }
  } catch (error) {
    console.error('Error fetching additional applications:', error);
    additionalApplications.value = [];
    apiError.value = true;
    toast.error('Failed to load additional qualifications data.');
  } finally {
    isLoading.value = false;
  }
};

const openCertificateModal = (application) => {
  selectedCertificateData.value = { results: [application] }
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedCertificateData.value = null
}

const handleInitiatePaymentEvent = ({ application, qualification }) => {
  initiatePayment(application, qualification)
}

const initiatePayment = (application, qualification) => {
  if (qualification) {
    selectedQualificationForPayment.value = qualification
    if (paymentModalRef.value) {
      paymentModalRef.value.openModal()
    } else {
      console.error('Payment modal reference is not available.')
      toast.error('Payment modal could not be opened.')
    }
  } else {
    toast.error('No specific qualification provided for payment.')
  }
}

const closePaymentModal = () => {
  selectedQualificationForPayment.value = null
}

const handlePaymentCompleted = async (paymentData) => {
  // 1. Initial Checks: Ensure an item is selected and user data is available.
  if (!selectedQualificationForPayment.value) {
    toast.error('No item selected for payment.');
    return;
  }
  const user = authStore.user;
  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    toast.error('Missing user information. Please log in again or update your profile.');
    return;
  }

  isLoading.value = true;
  const paymentId = paymentData.paymentHash;
  const itemForPayment = selectedQualificationForPayment.value;

  // 2. Differentiate between a Renewal and a regular Qualification.
  // We check for a field that only exists on Renewal objects.
  const isRenewal = Object.hasOwn(itemForPayment, 'renewal_status');

  try {
    // 3. Prepare Payment Gateway Data (This is generic for both types)
    const paymentInitiationFormData = new FormData();
    paymentInitiationFormData.append('refNo', paymentId);
    paymentInitiationFormData.append('serviceCode', '100196');
    paymentInitiationFormData.append('taxPayerName', user.cid);
    paymentInitiationFormData.append('taxPayerNo', user.cid);
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
    paymentInitiationFormData.append('totalPayableAmount', 1000);
    // Use a dynamic description based on the payment type
    paymentInitiationFormData.append(
      'description',
      isRenewal ? 'MHPC Renewal Fee' : 'MHPC Qualification Registration Fee'
    );
    paymentInitiationFormData.append('mobileNo', user.contact_number);
    paymentInitiationFormData.append('payerEmail', user.email);
    paymentInitiationFormData.append('user', user.id);
    paymentInitiationFormData.append('payableAmount', 1000);
    paymentInitiationFormData.append('application_no', itemForPayment.id);
    paymentInitiationFormData.append('app_type', 'specification_for_health_certification');

    // This call to the payment gateway is the same for both.
    await apiService.makePayment(paymentInitiationFormData);

    // Prepare the data to update our own backend.
    const updateFormData = new FormData();
    updateFormData.append('payment_id', paymentId);
    updateFormData.append('payment_status', 'processing_payment');

    // 4. Execute different logic based on whether it's a Renewal or not.
    if (isRenewal) {
      // --- LOGIC FOR RENEWAL ---
      const renewalId = itemForPayment.id;

      // Call the dedicated API endpoint for patching a Renewal
      await apiService.patchMhpcRenewal(renewalId, updateFormData);

      // Update the local state for immediate UI feedback
      const renewalIndex = renewalApplications.value.findIndex(r => r.id === renewalId);
      if (renewalIndex > -1) {
        renewalApplications.value[renewalIndex].payment_status = 'processing_payment';
        renewalApplications.value[renewalIndex].payment_id = paymentId;
      }

    } else {
      // --- LOGIC FOR NEW/ADDITIONAL QUALIFICATION ---
      const qualificationId = itemForPayment.id;

      // Call the API endpoint for patching a UserQualification
      await apiService.patchMhpcNewQualification(qualificationId, updateFormData);

      // Update the local state for immediate UI feedback
      // This helper function finds the qualification in any of the application lists.
      const updateLocalQualificationState = (appList) => {
        const app = appList.value.find(a => a.user_qualifications.some(q => q.id === qualificationId));
        if (app) {
          const qual = app.user_qualifications.find(q => q.id === qualificationId);
          if (qual) {
            qual.payment_id = paymentId;
            qual.payment_status = 'processing_payment';
          }
        }
      };
      updateLocalQualificationState(newApplications);
      updateLocalQualificationState(additionalApplications);
    }

    // 5. Final Success Handling
    // Update the object that the payment modal was using.
    itemForPayment.payment_id = paymentId;
    itemForPayment.payment_status = 'processing_payment';

    toast.success(`Payment initiated (Ref: ${paymentId.substring(0, 8)}...). Your application status will update shortly.`);

    // Refresh all data from the server to ensure consistency.
    await fetchAllData();

  } catch (error) {
    // 6. Centralized Error Handling
    console.error('Payment handling error:', error.response || error.request || error);
    let errorMsg = 'An error occurred while processing the payment confirmation.';
    if (error.response?.data) {
      const detail = error.response.data.detail || JSON.stringify(error.response.data);
      errorMsg = `Payment API Error: ${detail}`;
    } else if (error.request) {
      errorMsg = 'Network Error: Could not reach the server to confirm payment.';
    }
    toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if the issue persists.`);

    // Update status to failed on error
    if (selectedQualificationForPayment.value) {
      selectedQualificationForPayment.value.payment_status = 'failed';
    }
  } finally {
    // 7. Cleanup
    isLoading.value = false;
  }
};

const fetchAllData = async () => {
  isLoading.value = true
  apiError.value = false
  hasAttemptedFetch.value = false
  try {
    await Promise.all([
      fetchNewApplications(),
      fetchRenewalApplications(),
      fetchAdditionalApplications(),
    ])
  } catch (err) {
    console.error('Error during initial data fetch:', err)
    apiError.value = true
  } finally {
    isLoading.value = false
    hasAttemptedFetch.value = true
  }
}

onMounted(async () => {
  if (userCid.value) {
    await fetchAllData()
  } else {
    console.warn('User CID not available.')
    toast.warning('Please log in to view your application status.')
    apiError.value = true
    hasAttemptedFetch.value = true
    isLoading.value = false
  }
})
</script>

<style scoped>
button {
  cursor: pointer;
}

[v-if='isLoading'] {
  min-height: 200px; /* Ensure loading indicator is visible */
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-gradient-to-r.from-indigo-100 {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  --tw-gradient-from: #e0e7ff;
  --tw-gradient-to: rgba(224, 231, 255, 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to);
  --tw-gradient-via: #eff6ff;
  --tw-gradient-to: #e0e7ff;
}
</style>
