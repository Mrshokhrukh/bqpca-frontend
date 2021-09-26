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
      <div v-if="currentTab === 'new_renewal'" class="space-y-6">
        <NewApplicationsTracker
          v-if="newApplications.length > 0"
          :applications="newApplications"
          @open-certificate="openCertificateModal"
          @initiate-payment="initiatePayment($event.qualification)"
        />
        <RenewalApplicationsTracker
          v-if="renewalApplications.length > 0"
          :applications="renewalApplications"
          @open-certificate="openCertificateModal"
          @initiate-payment="initiatePayment($event)"
        />
      </div>

      <AdditionalQualificationsTracker
        v-if="currentTab === 'additional' && additionalApplications.length > 0"
        :applications="additionalApplications"
        @open-certificate="openCertificateModal"
        @initiate-payment="initiatePayment($event.qualification)"
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
      :application="selectedCertificateData"
      @close="closeCertificateModal"
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
import { ref, onMounted, computed, watch } from 'vue';
import apiService from '@/services/services';
import CertificateModal from '@/components/common/MHPC/MHPCCertificateModal.vue';
import PaymentModal from '@/components/common/PaymentModal.vue';
import PageHeader from '@/components/common/MHPC/PageHeader.vue';
import TrackerTabs from './TrackerTabs.vue';
import NewApplicationsTracker from './NewApplicationsTracker.vue';
import RenewalApplicationsTracker from './RenewalApplicationsTracker.vue';
import AdditionalQualificationsTracker from './AdditionalQualificationsTracker.vue';

import { AlertTriangle, SearchX, ClipboardList } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const authStore = useAuthStore();

const newApplications = ref([]);
const renewalApplications = ref([]);
const additionalApplications = ref([]);
const isLoading = ref(false);
const hasAttemptedFetch = ref(false);
const apiError = ref(false);
const showCertificateModal = ref(false);
const selectedCertificateData = ref(null);
const paymentModalRef = ref(null);
const itemForPayment = ref(null);

const currentTab = ref('new_renewal');
const tabs = [
  { name: 'new_renewal', label: 'New Applications & Renewals' },
  { name: 'additional', label: 'Additional Qualifications' },
];

const userCid = computed(() => authStore.user?.cid);

const pageHeaderTitle = computed(() => {
  return currentTab.value === 'new_renewal'
    ? 'Track Your Applications & Renewals'
    : 'Track Additional Qualifications';
});

const pageHeaderSubtitle = computed(() => {
  return currentTab.value === 'new_renewal'
    ? 'Your application and renewal statuses are displayed below.'
    : 'Your additional qualifications status is displayed below.';
});

const loadingText = computed(() => {
  return currentTab.value === 'new_renewal' ? 'application and renewal' : 'additional qualifications';
});

const noResultsText = computed(() => {
  return currentTab.value === 'new_renewal' ? 'Applications or Renewals' : 'Additional Qualifications';
});

const currentDataIsEmpty = computed(() => {
  if (!hasAttemptedFetch.value) return false;
  if (currentTab.value === 'new_renewal') {
    return newApplications.value.length === 0 && renewalApplications.value.length === 0;
  }
  if (currentTab.value === 'additional') {
    return additionalApplications.value.length === 0;
  }
  return true;
});

const handleTabChange = (tabName) => {
  currentTab.value = tabName;
};

const fetchNewApplications = async () => {
  if (!userCid.value) return;
  try {
    const response = await apiService.getMhpcFullApplicationListByCid(userCid.value);
    newApplications.value = response.data.results?.filter(app => app.user_qualifications?.some(q => q.is_primary_qualification)) || [];
  } catch (error) {
    console.error('Error fetching new applications:', error);
    apiError.value = true;
  }
};

const fetchRenewalApplications = async () => {
  if (!userCid.value) return;
  try {
    const response = await apiService.getMhpcRenewals(userCid.value);
    renewalApplications.value = response.data.results || response.data || [];
  } catch (error) {
    console.error('Error fetching renewal applications:', error);
    apiError.value = true;
  }
};

const fetchAdditionalApplications = async () => {
  if (!userCid.value) return;
  try {
    const response = await apiService.getMhpcFullApplicationListByCid(userCid.value);
    additionalApplications.value = response.data.results?.filter(app => app.user_qualifications?.some(q => !q.is_primary_qualification)) || [];
  } catch (error) {
    console.error('Error fetching additional applications:', error);
    apiError.value = true;
  }
};

const openCertificateModal = (application) => {
  selectedCertificateData.value = application;
  showCertificateModal.value = true;
};

const closeCertificateModal = () => {
  showCertificateModal.value = false;
  selectedCertificateData.value = null;
};

const initiatePayment = (paymentItem) => {
  if (paymentItem && paymentItem.id) {
    itemForPayment.value = paymentItem;
    if (paymentModalRef.value) {
      paymentModalRef.value.openModal();
    } else {
      toast.error('Payment modal could not be opened.');
    }
  } else {
    toast.error('No specific item provided for payment.');
  }
};

const closePaymentModal = () => {
  itemForPayment.value = null;
};

const handlePaymentCompleted = async (paymentData) => {
  if (!itemForPayment.value) {
    toast.error('No item selected for payment.');
    return;
  }

  isLoading.value = true;
  const paymentId = paymentData.paymentHash;
  const currentItem = itemForPayment.value;
  const isRenewal = Object.prototype.hasOwnProperty.call(currentItem, 'renewal_status');

  try {
    const updateFormData = new FormData();
    updateFormData.append('payment_id', paymentId);
    updateFormData.append('payment_status', 'completed');

    if (isRenewal) {
      await apiService.confirmProfessionalRenewalPayment(currentItem.id, { payment_id: paymentId });
    } else {
      await apiService.patchMhpcNewQualification(currentItem.id, updateFormData);
    }

    toast.success('Payment confirmed successfully! Your application will be updated shortly.');
    await fetchAllData();
  } catch (error) {
    console.error('Payment handling error:', error);
    toast.error('An error occurred while confirming the payment.');
  } finally {
    isLoading.value = false;
    if (paymentModalRef.value) {
      paymentModalRef.value.closeModal();
    }
  }
};

const fetchAllData = async () => {
  isLoading.value = true;
  apiError.value = false;
  hasAttemptedFetch.value = false;
  try {
    await Promise.all([
      fetchNewApplications(),
      fetchRenewalApplications(),
      fetchAdditionalApplications(),
    ]);
  } catch (err) {
    console.error('Error during initial data fetch:', err);
    apiError.value = true;
  } finally {
    isLoading.value = false;
    hasAttemptedFetch.value = true;
  }
};

watch(userCid, (newCid) => {
  if (newCid) {
    fetchAllData();
  }
}, { immediate: true });

onMounted(() => {
  if (!userCid.value) {
    toast.warning('Please log in to view your application status.');
    apiError.value = true;
    hasAttemptedFetch.value = true;
  }
});
</script>

<style scoped>
/* Your styles here */
</style>
