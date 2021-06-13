<template>
  <div class="application-tracking max-w-7xl mx-auto p-4 md:p-6 bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Track Your Teaching Center Applications</h1>
      <button
        @click="openApplicationFormModal"
        class="mt-4 sm:mt-0 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Add New Center
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !applications.length" class="text-center py-8"> <!-- Show initial load spinner only if no apps -->
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <p class="text-gray-600 mt-2">Loading applications...</p>
    </div>

    <!-- Filters -->
    <div v-if="!isLoading || applications.length" class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div class="relative w-full sm:w-auto sm:flex-grow lg:flex-grow-0 lg:w-1/3">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by center name or location"
          class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm"
        />
        <MagnifyingGlassIcon class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      <div class="flex gap-2 sm:gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-40 md:w-48">
          <select
            v-model="filterDzongkhag"
            class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm appearance-none"
          >
            <option value="">All Dzongkhags</option>
            <option v-for="dzongkhag in dzongkhagOptionsForCenter" :key="dzongkhag.value" :value="dzongkhag.value">
              {{ dzongkhag.label }}
            </option>
          </select>
          <ChevronDownIcon class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <div class="relative w-full sm:w-40 md:w-48">
          <select
            v-model="filterGewog"
            class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-sm bg-gray-ify backdrop-blur-sm appearance-none"
            :disabled="!filterDzongkhag"
          >
            <option value="">{{ filterDzongkhag ? 'All Gewogs' : 'Select Dzongkhag' }}</option>
            <option v-for="gewog in gewogOptionsForCenter" :key="gewog.value" :value="gewog.value">
              {{ gewog.label }}
            </option>
          </select>
          <ChevronDownIcon class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div v-if="!isLoading || applications.length" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gradient-to-r from-indigo-50 to-purple-50">
          <tr>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Center Name</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valid Till</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading && applications.length" > <!-- Show spinner overlay on table if loading more -->
             <td colspan="6" class="text-center py-8 relative">
                <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                </div>
             </td>
          </tr>
          <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50/50 transition-colors duration-150">
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ application.center_name }}</td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">{{ application.center_location }} <span class="text-gray-400">({{ application.state_dzongkhag }}, {{ application.city_gewog }})</span></td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm">
              <span :class="statusClass(application.tc_review_decision)" class="px-2.5 py-1 rounded-full text-xs font-semibold leading-tight">
                {{ application.tc_review_decision || 'Unknown' }}
              </span>
            </td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm">
              <span :class="paymentStatusClass(application.payment_status)" class="px-2.5 py-1 rounded-full text-xs font-semibold leading-tight">
                {{ formatPaymentStatus(application.payment_status) }}
              </span>
            </td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(application.valid_till) }}</td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
              <button
                v-if="canMakePayment(application)"
                @click="initiateTeachingCenterPayment(application)"
                class="px-3 py-1.5 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 text-xs font-medium transition-colors"
                :disabled="isPaymentProcessing || isLoading"
              >
                Make Payment
              </button>
              <button
                v-if="canAddPreceptor(application)"
                @click="openAddPreceptorModal(application)"
                class="px-3 py-1.5 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 text-xs font-medium transition-colors"
              >
                Add Clinical Preceptor
              </button>
              <button
                @click="viewDetails(application)"
                class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md shadow-sm hover:bg-blue-200 text-xs font-medium transition-colors"
              >
                View Details
              </button>
            </td>
          </tr>
          <tr v-if="!isLoading && filteredApplications.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-gray-500 text-sm">
              <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                </svg>
                No applications found.
                <span v-if="searchQuery || filterDzongkhag || filterGewog" class="text-xs text-gray-400 mt-1">Try adjusting your filters or search.</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Clinical Preceptor Modal -->
    <ClinicalPreceptorModal
      v-if="isPreceptorModalOpen"
      :application-id="selectedApplicationForPreceptor?.id"
      @close="closePreceptorModal"
      @submit-success="handlePreceptorSubmitSuccess"
    />

    <!-- Application Details Modal -->
    <teleport to="body">
      <transition name="modal-details-fade">
        <div v-if="isDetailsModalOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeDetailsModal">
          <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div class="flex justify-between items-center pb-3 border-b">
              <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Application Details</h2>
              <button @click="closeDetailsModal" class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100" aria-label="Close modal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="space-y-4 mt-4 overflow-y-auto text-sm">
              <div v-if="selectedApplication">
                <div>
                  <label class="block font-semibold text-gray-700">Center Name:</label>
                  <p class="text-gray-600 mt-0.5">{{ selectedApplication.center_name }}</p>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700">Location:</label>
                  <p class="text-gray-600 mt-0.5">{{ selectedApplication.center_location }} ({{ selectedApplication.state_dzongkhag }}, {{ selectedApplication.city_gewog }})</p>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700">Status:</label>
                  <p :class="statusClass(selectedApplication.tc_review_decision)" class="inline-block px-3 py-1 rounded-full text-xs font-medium mt-0.5">
                    {{ selectedApplication.tc_review_decision || 'Unknown' }}
                  </p>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700">Payment Status:</label>
                  <p :class="paymentStatusClass(selectedApplication.payment_status)" class="inline-block px-3 py-1 rounded-full text-xs font-medium mt-0.5">
                    {{ formatPaymentStatus(selectedApplication.payment_status) }}
                  </p>
                </div>
                <div v-if="selectedApplication.payment_id">
                  <label class="block font-semibold text-gray-700">Payment ID:</label>
                  <p class="text-gray-600 mt-0.5">{{ formatPaymentId(selectedApplication.payment_id) }}</p>
                </div>
                <div>
                  <label class="block font-semibold text-gray-700">Valid Till:</label>
                  <p class="text-gray-600 mt-0.5">{{ formatDate(selectedApplication.valid_till) }}</p>
                </div>
              </div>
            </div>
            <div class="flex justify-end mt-6 pt-4 border-t">
              <button
                @click="closeDetailsModal"
                class="px-4 py-2 bg-slate-200 text-slate-700 rounded-md shadow-sm hover:bg-slate-300 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- New Teaching Center Application Modal -->
    <TeachingCenterApplication
      :is-open="isApplicationFormModalOpen"
      @close="closeApplicationFormModal"
      @form-submitted="handleApplicationFormSubmitted"
    />

    <!-- Generic Payment Modal for Teaching Center -->
    <PaymentModal
      ref="teachingCenterPaymentModalRef"
      :amount="teaching_hospital_registration"
      @payment-completed="handleTeachingCenterPaymentCompleted"
      @close="closeTeachingCenterPaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { MagnifyingGlassIcon, ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/outline';
import apiServices from '@/services/services';
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import ClinicalPreceptorModal from './modals/ClinicalPreceptorModal.vue';
import TeachingCenterApplication from './TeachingCenterApplicationModal.vue';
import PaymentModal from '@/components/common/PaymentModal.vue';

const toast = useToast();
const authStore = useAuthStore();
const applications = ref([]);
const searchQuery = ref('');
const filterDzongkhag = ref('');
const filterGewog = ref('');

const isPreceptorModalOpen = ref(false);
const selectedApplicationForPreceptor = ref(null);

const isDetailsModalOpen = ref(false);
const selectedApplication = ref(null);
const isLoading = ref(false);
const isPaymentProcessing = ref(false);

const isApplicationFormModalOpen = ref(false);

const teaching_hospital_registration = 100; // This is your fee amount
const teachingCenterPaymentModalRef = ref(null);
const selectedApplicationForPayment = ref(null);

const dzongkhagOptionsForCenter = computed(() => bhutanDzongkhagsGewogs.map(d => ({ value: d.dzongkhag, label: d.dzongkhag })));
const gewogOptionsForCenter = computed(() => {
  if (!filterDzongkhag.value) return [];
  const selected = bhutanDzongkhagsGewogs.find(d => d.dzongkhag === filterDzongkhag.value);
  return selected ? selected.gewogs.map(g => ({ value: g, label: g })) : [];
});

watch(() => filterDzongkhag.value, () => { filterGewog.value = ''; });

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) return [];
  return applications.value.filter((app) => {
    const appDzongkhag = app.state_dzongkhag || '';
    const appGewog = app.city_gewog || '';
    const matchesSearch =
      app.center_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.center_location?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      appDzongkhag.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      appGewog.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDzongkhag = filterDzongkhag.value ? appDzongkhag === filterDzongkhag.value : true;
    const matchesGewog = filterGewog.value ? appGewog === filterGewog.value : true;
    return matchesSearch && matchesDzongkhag && matchesGewog;
  });
});

const statusClass = (status) => {
  const s = status ? status.toLowerCase() : 'unknown';
  if (s === 'approved') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'pending') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  if (s === 'rejected') return 'bg-red-100 text-red-700 border border-red-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const paymentStatusClass = (status) => {
  const s = status ? status.toLowerCase() : 'not_paid';
  if (s === 'paid' || s === 'completed' || s === 'success') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'pending_payment' || s === 'processing_payment') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  if (s === 'failed') return 'bg-red-100 text-red-700 border border-red-200';
  if (s === 'not_paid') return 'bg-orange-100 text-orange-700 border border-orange-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const formatPaymentStatus = (status) => {
  if (!status || status.toLowerCase() === 'not_paid') return 'Not Paid';
  if (status.toLowerCase() === 'pending_payment') return 'Pending Payment';
  if (status.toLowerCase() === 'processing_payment') return 'Processing';
  if (status.toLowerCase() === 'paid' || status.toLowerCase() === 'completed' || status.toLowerCase() === 'success') return 'Paid';
  if (status.toLowerCase() === 'failed') return 'Failed';
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

const formatPaymentId = (id) => {
  if (!id) return 'N/A';
  return id.substring(0, 8) + '...';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
};

const fetchApplications = async () => {
  if (!authStore.userId) {
    console.warn('User not authenticated for fetching applications.');
    isLoading.value = false;
    applications.value = [];
    return;
  }
  isLoading.value = true;
  try {
    const response = await apiServices.getMhpcTeachingCenters(authStore.userId);
    let fetchedApplications = response.data?.results || response.data || [];
    if (!Array.isArray(fetchedApplications)) {
      console.error('Expected an array of applications, received:', fetchedApplications);
      fetchedApplications = [];
    } else {
      fetchedApplications = fetchedApplications.map(app => {
        let derivedPaymentStatus = 'not_paid'; // Default status

        const currentClientApp = applications.value.find(existing => existing.id === app.id);

        if (app.is_payment_complete) {
          derivedPaymentStatus = 'paid';
        } else if (app.payment_id) { // A payment has been initiated or recorded on the server
          if (currentClientApp && currentClientApp.payment_status === 'processing_payment' && !app.is_payment_complete) {
            derivedPaymentStatus = 'processing_payment';
          } else {
            derivedPaymentStatus = 'pending_payment'; // Server has payment_id, not complete -> pending
          }
        } else if (currentClientApp) { // No payment_id on server, check client state
            if (currentClientApp.payment_status === 'failed') {
                 derivedPaymentStatus = 'failed';
            } else if (currentClientApp.payment_status === 'processing_payment') {
                // Client thought it was processing, but server has no payment_id.
                // This could be a very early failure before payment_id was stored, or a race.
                // Reverting to 'pending_payment' or 'failed' might be safer than 'not_paid' if user interaction occurred.
                 derivedPaymentStatus = 'pending_payment'; // Or 'failed'
            }
            // If currentClientApp.payment_status was 'not_paid' or something else, and server has no payment_id, it remains 'not_paid' (default)
        }
        // 'not_paid' is the fallback.

        return {
          ...app,
          tc_review_decision: app.tc_review_decision || (app.is_draft ? 'Draft' : 'Pending'),
          payment_status: derivedPaymentStatus
        };
      });
    }
    applications.value = fetchedApplications;
  } catch (error) {
    console.error('Error fetching applications:', error.response?.data || error.message);
    toast.error('Failed to load applications. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const canMakePayment = (application) => {
  const status = application.payment_status ? application.payment_status.toLowerCase() : 'not_paid';
  return application.tc_review_decision?.toLowerCase() === 'approved' &&
         (status === 'not_paid' || status === 'failed' || status === 'pending_payment'); // Allow retry for pending
};

const initiateTeachingCenterPayment = (application) => {
  console.log('Initiating payment for application:', application);
  selectedApplicationForPayment.value = application;
  if (teachingCenterPaymentModalRef.value) {
    teachingCenterPaymentModalRef.value.openModal();
  } else {
    console.error('Teaching Center Payment modal reference is not available.');
    toast.error('Payment modal could not be opened.');
  }
};

const closeTeachingCenterPaymentModal = () => {
  console.log('Closing payment modal, selectedApplicationForPayment:', selectedApplicationForPayment.value);
  if (!isPaymentProcessing.value) {
    selectedApplicationForPayment.value = null;
  }
};

const handleTeachingCenterPaymentCompleted = async (paymentData) => {
  console.log('Payment completed with data:', paymentData);
  if (!selectedApplicationForPayment.value) {
    console.error('No application selected for payment.');
    toast.error('No application selected for payment. Please try again.');
    return;
  }
  const user = authStore.user;
  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    console.error('Missing user information:', user);
    toast.error('Missing user information for payment.');
    return;
  }

  isPaymentProcessing.value = true;
  isLoading.value = true;
  const paymentId = paymentData.paymentHash;
  const applicationToUpdate = { ...selectedApplicationForPayment.value };

  try {
    const appIndex = applications.value.findIndex(app => app.id === applicationToUpdate.id);
    if (appIndex > -1) {
      applications.value[appIndex].payment_id = paymentId;
      applications.value[appIndex].payment_status = 'processing_payment';
    }

    const paymentInitiationFormData = new FormData();
    paymentInitiationFormData.append('refNo', paymentId);
    paymentInitiationFormData.append('serviceCode', '100250');
    paymentInitiationFormData.append('taxPayerName', user.full_name || user.cid);
    paymentInitiationFormData.append('taxPayerNo', user.cid);
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
    paymentInitiationFormData.append('totalPayableAmount', teaching_hospital_registration.toString());
    paymentInitiationFormData.append('description', 'Teaching Hospital Registration');
    paymentInitiationFormData.append('mobileNo', user.contact_number);
    paymentInitiationFormData.append('payerEmail', user.email);
    paymentInitiationFormData.append('user', user.id.toString());
    paymentInitiationFormData.append('payableAmount', teaching_hospital_registration.toString());
    paymentInitiationFormData.append('application_no', applicationToUpdate.id.toString());
    paymentInitiationFormData.append('app_type', 'teaching_hospital_registration');

    console.log('Sending payment initiation data:', Object.fromEntries(paymentInitiationFormData));
    await apiServices.makePayment(paymentInitiationFormData);

    const updatePayload = new FormData();
    updatePayload.append('payment_id', paymentId);
    updatePayload.append('payment_status', 'processing_payment'); // Or derive from makePayment response if available
    await apiServices.patchMhpcTeachingCenter(applicationToUpdate.id, updatePayload);

    toast.success(`Payment initiated (Ref: ${paymentId.substring(0, 8)}...). Status will update shortly.`);
    await fetchApplications();

  } catch (error) {
    console.error('Teaching Center Payment handling error:', error.response || error.message);
    let errorMsg = 'An error occurred while processing the payment.';
    if (error.response?.data) {
      const errors = error.response.data;
      if (typeof errors === 'string') errorMsg += ` ${errors}`;
      else if (errors.message) errorMsg += ` ${errors.message}`;
      else if (errors.detail) errorMsg += ` ${errors.detail}`;
      else if (typeof errors === 'object') {
        const messages = Object.values(errors).flat().join(' ');
        if (messages) errorMsg += ` ${messages}`;
      }
    }
    toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if issue persists.`);

    const appIdx = applications.value.findIndex(app => app.id === applicationToUpdate.id);
    if (appIdx > -1 && applications.value[appIdx].payment_status !== 'paid') {
        applications.value[appIdx].payment_status = 'failed';
    }
  } finally {
    isLoading.value = false;
    isPaymentProcessing.value = false;
    selectedApplicationForPayment.value = null; // Clear regardless of outcome, as processing is done
  }
};

const canAddPreceptor = (application) => {
  const status = application.payment_status ? application.payment_status.toLowerCase() : '';
  return application.tc_review_decision?.toLowerCase() === 'approved' &&
         (status === 'paid' || status === 'completed' || status === 'success');
};

const openAddPreceptorModal = (application) => {
  selectedApplicationForPreceptor.value = application;
  isPreceptorModalOpen.value = true;
};

const closePreceptorModal = () => {
  isPreceptorModalOpen.value = false;
  selectedApplicationForPreceptor.value = null;
};

const handlePreceptorSubmitSuccess = (message) => {
  toast.success(message);
  closePreceptorModal();
  fetchApplications();
};

const viewDetails = (application) => {
  selectedApplication.value = application;
  isDetailsModalOpen.value = true;
};

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false;
  selectedApplication.value = null;
};

const openApplicationFormModal = () => {
  isApplicationFormModalOpen.value = true;
};

const closeApplicationFormModal = () => {
  isApplicationFormModalOpen.value = false;
};

const handleApplicationFormSubmitted = () => {
  closeApplicationFormModal();
  fetchApplications();
  toast.success('New teaching center application submitted successfully!');
};

onMounted(fetchApplications);
</script>

<style scoped>
.application-tracking {
  background: linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,248,252,0.8));
}
table th {
  @apply text-gray-500 font-medium;
}
select:focus, input[type="text"]:focus {
  box-shadow: 0 0 0 2px theme('colors.indigo.300');
}
.modal-details-fade-enter-active,
.modal-details-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.modal-details-fade-enter-from,
.modal-details-fade-leave-to {
  opacity: 0;
}
.modal-details-fade-enter-active .bg-white,
.modal-details-fade-leave-active .bg-white {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.modal-details-fade-enter-from .bg-white,
.modal-details-fade-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>