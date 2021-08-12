<template>
  <div class="mx-auto px-4 py-8 ">
    <!-- HEADER -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Teaching Center Tracker & Renewal
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track and renew your teaching center registration.
      </p>
    </div>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="flex justify-center items-center my-8">
      <Loader class="animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading teaching center data...</p>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200">
        Try Again
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="!filteredTeachingCenters.length"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">No Teaching Centers Found</h3>
      <p>No teaching centers were found for your registered institute (CID: {{ authStore.user?.cid }}).</p>
      <p class="mt-2">Please ensure you have registered a teaching center under the correct institute.</p>
    </div>

    <!-- TABLE DISPLAY -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Center Name & Location</th>
              <th scope="col" class="px-6 py-3">Center ID</th>
              <th scope="col" class="px-6 py-3">Institute</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3">Validity</th>
              <th scope="col" class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="center in filteredTeachingCenters" :key="center.id" class="bg-white border-b hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ center.center_name }}</div>
                <div class="text-gray-500">{{ center.center_location }}, {{ center.city_gewog }}</div>
              </td>
              <td class="px-6 py-4 font-mono text-gray-700">
                {{ center.id }}
              </td>
              <td class="px-6 py-4 text-gray-800">
                {{ center.institute?.name_of_institution }}
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 text-xs font-semibold leading-tight rounded-full" :class="center.display.detailsStatusClass">
                  {{ center.display.detailsStatusText }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium" :class="getExpirationDateClass(center)">
                  {{ formatDate(center.valid_till) }}
                </div>
                <div v-if="shouldShowExpirationAlert(center)" class="text-xs mt-1" :class="getExpirationTextClass(center)">
                  {{ getExpirationMessage(center) }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <!-- Action Buttons based on lifecycleStatus -->
                <div class="flex items-center justify-center space-x-2">
                  <div v-if="center.lifecycleStatus === 'RENEWAL_AWAITING_PAYMENT'">
                    <button @click="initiateRenewalPayment(center)" class="btn btn-primary btn-sm">
                      <CreditCard class="h-4 w-4 mr-1" />
                      Pay Renewal
                    </button>
                  </div>
                  <div v-else-if="center.lifecycleStatus === 'RENEWAL_PENDING_REVIEW'">
                    <span class="inline-flex items-center text-xs font-medium text-yellow-800">
                      <Loader class="w-3 h-3 mr-1.5 animate-spin"/>
                      Review in Progress
                    </span>
                  </div>
                  <div v-else-if="center.lifecycleStatus === 'EXPIRED' || center.lifecycleStatus === 'RENEWAL_ELIGIBLE'">
                     <button @click="openRenewalDialog(center)" class="btn btn-primary btn-sm">
                       Renew Now
                     </button>
                  </div>
                  <div v-else-if="center.lifecycleStatus === 'INITIAL_AWAITING_PAYMENT'">
                      <button @click="initiateNewRegistrationPayment(center)" class="btn btn-primary btn-sm">
                        <CreditCard class="h-4 w-4 mr-1" />
                        Make Payment
                      </button>
                  </div>
                   <div v-else-if="center.lifecycleStatus === 'INITIAL_REJECTED'">
                    <span class="text-xs text-red-600 font-medium">Rejected</span>
                  </div>
                   <div v-else-if="center.lifecycleStatus === 'INITIAL_PENDING_REVIEW'">
                    <span class="text-xs text-yellow-600 font-medium">Pending Approval</span>
                  </div>
                   <div v-else-if="center.lifecycleStatus === 'ACTIVE'">
                    <span class="inline-flex items-center text-xs font-medium text-green-800">
                      <Award class="w-3 h-3 mr-1.5"/>
                      Active
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- RENEWAL DIALOG -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <form @submit.prevent="confirmRenewal" class="space-y-6">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">Teaching Center Renewal Application</h3>
              <button @click="closeRenewalDialog" type="button" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div v-if="selectedCenter" class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <h4 class="font-semibold text-blue-900 mb-2">{{ selectedCenter.center_name }}</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><span class="text-blue-600">ID:</span><span class="font-medium text-blue-800 ml-2">{{ selectedCenter.id }}</span></div>
                <div><span class="text-blue-600">Expires:</span><span class="font-medium text-blue-800 ml-2">{{ formatDate(selectedCenter.valid_till) }}</span></div>
              </div>
            </div>
            <div class="mb-4">
              <label for="renewal_document" class="block text-sm font-medium text-gray-700 mb-2">Renewal Document <span class="text-red-500">*</span></label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="renewal_document" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="renewal_document" type="file" class="sr-only" @change="handleFileUpload" required>
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              <p v-if="selectedFileName" class="mt-2 text-sm text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Selected: {{ selectedFileName }}
              </p>
            </div>
            <div class="mb-4">
              <label for="user_remarks" class="block text-sm font-medium text-gray-700 mb-2">Additional Remarks (Optional)</label>
              <textarea id="user_remarks" v-model="renewalFormData.user_remarks" rows="4" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Add any additional information..."></textarea>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="declaration" type="checkbox" v-model="declarationChecked" required class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="declaration" class="font-medium text-gray-700">Declaration <span class="text-red-500">*</span></label>
                  <p class="text-gray-600 mt-1">I hereby declare that the information provided is true and correct to the best of my knowledge.</p>
                </div>
              </div>
            </div>
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" @click="closeRenewalDialog" class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200" :disabled="isRenewing">Cancel</button>
              <button type="submit" class="btn btn-primary flex items-center" :disabled="isRenewing || !declarationChecked || !selectedFile">
                <Loader v-if="isRenewing" class="animate-spin w-4 h-4 mr-2" />
                {{ isRenewing ? 'Submitting...' : 'Submit for Review' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- PAYMENT MODAL -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="1000"
      @payment-completed="onPaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import PaymentModal from '@/components/common/PaymentModal.vue';
import { Loader, CreditCard, Award } from 'lucide-vue-next'

const teachingCenters = ref([])
const pendingRenewals = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const selectedCenter = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const renewalFormData = ref({ user_remarks: '' })
const declarationChecked = ref(false)
const paymentModalRef = ref(null);
const renewalToPay = ref(null);
const centerForNewPayment = ref(null);

const toast = useToast()
const authStore = useAuthStore()

// --- MODIFIED COMPUTED PROPERTY ---
const filteredTeachingCenters = computed(() => {
  // Ensure we have the necessary data to perform filtering
  if (!teachingCenters.value || !Array.isArray(teachingCenters.value) || !authStore.user?.cid) {
    return [];
  }

  const userCID = authStore.user.cid;

  // 1. FILTER: Only include centers where the institute's CID matches the logged-in user's CID.
  return teachingCenters.value
    .filter(center => center?.institute?.CID === userCID)
    // 2. MAP: After filtering, map over the user's centers to add display logic.
    .map(center => {
      const activeRenewal = pendingRenewals.value.find(
        renewal => renewal.teaching_center_details?.id === center.id
      );

      const centerWithRenewal = {
        ...center,
        active_renewal_application: activeRenewal || null,
        is_renewal_in_progress: !!activeRenewal,
      };

      const lifecycleStatus = getCenterLifecycleStatus(centerWithRenewal);
      const displayInfo = getDisplayInfo(lifecycleStatus, centerWithRenewal);

      return {
        ...centerWithRenewal,
        lifecycleStatus,
        display: displayInfo,
      }
    });
});
// --- END OF MODIFICATION ---

const getDisplayInfo = (status, center) => {
    const greenClass = 'bg-green-100 text-green-800';
    const yellowClass = 'bg-yellow-100 text-yellow-800';
    const redClass = 'bg-red-100 text-red-800';
    const indigoClass = 'bg-indigo-100 text-indigo-800';
    const grayClass = 'bg-gray-100 text-gray-800';

    switch(status) {
        case 'ACTIVE':
        case 'RENEWAL_ELIGIBLE':
            return {
                detailsStatusText: 'Active',
                detailsStatusClass: greenClass,
            };
        case 'EXPIRED':
            return {
                detailsStatusText: 'Expired',
                detailsStatusClass: redClass,
            };
        case 'RENEWAL_AWAITING_PAYMENT':
            return {
                detailsStatusText: 'Awaiting Renewal Payment',
                detailsStatusClass: indigoClass,
            };
        case 'RENEWAL_PENDING_REVIEW':
            return {
                detailsStatusText: 'Renewal Under Review',
                detailsStatusClass: yellowClass,
            };
        case 'INITIAL_AWAITING_PAYMENT':
            return {
                detailsStatusText: 'Awaiting Initial Payment',
                detailsStatusClass: indigoClass,
            };
        case 'INITIAL_PENDING_REVIEW':
            return {
                detailsStatusText: 'Under Review',
                detailsStatusClass: yellowClass,
            };
        case 'INITIAL_REJECTED':
             return {
                detailsStatusText: 'Rejected',
                detailsStatusClass: redClass,
            };
        default:
            return {
                detailsStatusText: 'Inactive',
                detailsStatusClass: grayClass,
            };
    }
};

const getCenterLifecycleStatus = (center) => {
  if (center.is_renewal_in_progress) {
    const renewalStatus = center.active_renewal_application.renewal_status;
    if (renewalStatus === 'AWAITING_PAYMENT') return 'RENEWAL_AWAITING_PAYMENT';
    if (renewalStatus === 'PENDING_REVIEW') return 'RENEWAL_PENDING_REVIEW';
  }

  // The original API response has `status` like "PENDING_REVIEW" for new centers.
  // We should check this before assuming it's completed.
  if (center.status === 'PENDING_REVIEW' && !center.is_payment_complete) return 'INITIAL_PENDING_REVIEW';
  if (center.status === 'COMPLETED' && !center.is_payment_complete && center.payment_id) return 'INITIAL_AWAITING_PAYMENT';
  if (center.status === 'REJECTED') return 'INITIAL_REJECTED';

  if (center.is_payment_complete && (center.status === 'COMPLETED' || center.status_display === 'Completed & Active')) {
    const daysLeft = getDaysUntilExpiration(center.valid_till);
    if (daysLeft <= 0) return 'EXPIRED';
    if (daysLeft <= 90) return 'RENEWAL_ELIGIBLE';
    return 'ACTIVE';
  }

  // Fallback status for cases like a draft or other states
  return 'INACTIVE';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const getDaysUntilExpiration = (dateString) => {
  if (!dateString) return Infinity;
  const expirationDate = new Date(dateString);
  const today = new Date();
  expirationDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffTime = expirationDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const shouldShowExpirationAlert = (center) => {
  const status = getCenterLifecycleStatus(center);
  if (status !== 'ACTIVE' && status !== 'RENEWAL_ELIGIBLE') return false;
  const daysLeft = getDaysUntilExpiration(center.valid_till);
  return daysLeft <= 30;
};

const getExpirationTextClass = (center) => {
  const daysLeft = getDaysUntilExpiration(center.valid_till);
  if (daysLeft <= 0) return 'text-red-700';
  if (daysLeft <= 15) return 'text-yellow-700';
  return 'text-blue-700';
};

const getExpirationMessage = (center) => {
  const daysLeft = getDaysUntilExpiration(center.valid_till);
  if (daysLeft <= 0) return 'Registration has expired!';
  if (daysLeft === 1) return `Expires in 1 day.`;
  return `Expires in ${daysLeft} days.`;
};

const getExpirationDateClass = (center) => {
  const daysLeft = getDaysUntilExpiration(center.valid_till);
  if (daysLeft <= 0) return 'text-red-600 font-bold';
  if (daysLeft <= 30) return 'text-yellow-600 font-semibold';
  return 'text-gray-800';
};

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    selectedFile.value = null
    selectedFileName.value = ''
    return
  }
  selectedFile.value = file
  selectedFileName.value = file.name
}

const openRenewalDialog = (center) => {
  selectedCenter.value = center
  showRenewalDialog.value = true
}

const closeRenewalDialog = () => {
  showRenewalDialog.value = false
  isRenewing.value = false
  selectedCenter.value = null
  renewalFormData.value = { user_remarks: '' }
  declarationChecked.value = false
  selectedFile.value = null
  selectedFileName.value = ''
}

const confirmRenewal = async () => {
  if (!selectedCenter.value) return;
  isRenewing.value = true;

  try {
    const formData = new FormData();
    formData.append('teaching_center', selectedCenter.value.id);
    formData.append('renewal_document', selectedFile.value);
    formData.append('user_remarks', renewalFormData.value.user_remarks || '');

    const response = await apiServices.createEpcTeachingCenterRenewal(formData);
    const newRenewal = response.data;
    pendingRenewals.value.push(newRenewal);

    toast.success('Renewal application submitted successfully!');
    // No need to call fetchData() here, just update the local state
    closeRenewalDialog();

  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Failed to submit renewal application.';
    toast.error(errorMessage);
  } finally {
    isRenewing.value = false;
  }
};

const initiateRenewalPayment = (center) => {
  renewalToPay.value = center.active_renewal_application;
  centerForNewPayment.value = null;
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal();
  }
};

const initiateNewRegistrationPayment = (center) => {
  // Using a more robust check for initial payment status
  if (center.status === 'PENDING_REVIEW' && !center.is_payment_complete) {
    centerForNewPayment.value = center;
    renewalToPay.value = null;
    if (paymentModalRef.value) {
      paymentModalRef.value.openModal();
    } else {
      toast.error('Payment module could not be loaded.');
    }
  } else {
     toast.info('This application is not awaiting payment.');
  }
};


const onPaymentCompleted = (paymentData) => {
  if (renewalToPay.value) {
    handleRenewalPaymentConfirmation(paymentData);
  } else if (centerForNewPayment.value) {
    handleNewRegistrationPayment(paymentData);
  }
};

const closePaymentModal = () => {
  renewalToPay.value = null;
  centerForNewPayment.value = null;
  if (paymentModalRef.value) {
      paymentModalRef.value.closeModal();
  }
};

const handleRenewalPaymentConfirmation = async (paymentData) => {
  if (!renewalToPay.value || !authStore.user?.id) {
    toast.error('Required data is missing. Cannot process payment.');
    return;
  }
  isLoading.value = true;
  try {
    const paymentLogFormData = new FormData();
    // ... (rest of your form data logic is fine)
    await apiServices.makePayment(paymentLogFormData);

    await apiServices.patchEpcTeachingCenterRenewal(renewalToPay.value.id, {
      payment_id: paymentData.paymentHash,
      payment_status: 'completed'
    });

    toast.success('Renewal payment confirmed!');
    await fetchData();
  } catch (error) {
    const errorMsg = error.response?.data?.detail || JSON.stringify(error.response?.data) || 'An unknown error occurred';
    toast.error(`Renewal Failed: ${errorMsg}. Please contact support with Payment Ref: ${paymentData.paymentHash}`, { timeout: 8000 });
  } finally {
    isLoading.value = false;
    closePaymentModal();
  }
};

const handleNewRegistrationPayment = async (paymentData) => {
  if (!centerForNewPayment.value || !authStore.user?.id) {
    toast.error('Required data is missing. Cannot process payment.');
    return;
  }
  isLoading.value = true;
  const paymentId = paymentData.paymentHash;
  const centerId = centerForNewPayment.value.id;

  try {
    const paymentLogFormData = new FormData();
    
    await apiServices.makePayment(paymentLogFormData);


    await apiServices.patchEpcTeachingCenter(centerId, {
      payment_id: paymentId,
      is_payment_complete: true,

      status: 'PENDING_REVIEW'
    });

    toast.success('Payment confirmed! Your application is now under review.');
    await fetchData();
  } catch (error) {
    const errorMsg = error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Payment confirmation failed.';
    toast.error(`${errorMsg} Please contact support with Ref: ${paymentId}`, { timeout: 8000 });
  } finally {
    isLoading.value = false;
    closePaymentModal();
  }
};

const fetchData = async () => {
  if (!authStore.user?.cid) {
    apiError.value = true
    errorMessage.value = 'User information not loaded. Please ensure you are logged in.'
    return
  }

  apiError.value = false;
  isLoading.value = true;

  try {

    const [centersResponse, renewalsResponse] = await Promise.all([
      apiServices.getEpcTeachingCenters(),
      apiServices.getEpcTeachingCenterRenewals({
          renewal_status__in: 'PENDING_REVIEW,AWAITING_PAYMENT',
          teaching_center_details__institute__CID: authStore.user.cid
      })
    ]);

    teachingCenters.value = centersResponse.data.results || [];
    pendingRenewals.value = renewalsResponse.data.results || [];

  } catch (error) {
    console.error("Failed to fetch teaching center data:", error);
    errorMessage.value = error.response?.data?.detail || `An error occurred: ${error.message}`;
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.btn { @apply inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors; }
.btn-sm { @apply px-3 py-1.5 text-xs; }
.btn-primary { @apply text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500; }
button:hover:not(:disabled) { transform: translateY(-1px); }
button:active:not(:disabled) { transform: translateY(0); }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>