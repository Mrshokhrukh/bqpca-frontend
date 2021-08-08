<template>
  <div class="mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Program Applications</h2>
        <p class="text-gray-600">Track all submitted education program applications</p>
      </div>
      <button
        @click="openProgramFormModal()"
        class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Add New Education Program
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-600">Loading applications...</span>
    </div>
    <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
      <p class="text-red-800">{{ error }}</p>
    </div>
    <div v-else-if="applications.length === 0" class="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-md">
      <p class="text-gray-800">No program applications found.</p>
    </div>

    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Application ID</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Institute</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Program Title</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Teaching Center</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">App Status</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Payment Status</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Submission Date</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 border-b text-gray-800">{{ app.id }}</td>
            <td class="py-3 px-4 border-b text-gray-800">{{ app.institute?.name_of_institution || 'N/A' }}</td>
            <td class="py-3 px-4 border-b text-gray-800">{{ app.specific_program_title || 'N/A' }}</td>
            <td class="py-3 px-4 border-b text-gray-800">{{ app.teaching_center?.center_name || 'N/A' }}</td>
            <td class="py-3 px-4 border-b">
              <span :class="getStatusClass(app.status)">
                {{ app.status_display || app.status || 'Unknown' }}
              </span>
            </td>
            <td class="py-3 px-4 border-b text-gray-800 align-middle">
              <button
                v-if="showMakePaymentButton(app)"
                @click.stop="initiateNewProgramPayment(app)"
                class="text-green-600 hover:text-green-800 font-medium text-xs px-2 py-1 border border-green-500 rounded hover:bg-green-50 whitespace-nowrap"
              >
                Make Payment
              </button>
              <template v-else>
                <span :class="getPaymentStatusClass(app.payment_status)">
                    {{ app.payment_status_display || app.payment_status || 'N/A' }}
                </span>
                <span v-if="app.payment_id" class="text-xs text-gray-500 block">(Ref: {{ app.payment_id.substring(0,8) }}...)</span>
              </template>
            </td>
            <td class="py-3 px-4 border-b text-gray-800">
              {{ formatDate(app.created_at) }}
            </td>
            <td class="py-3 px-4 border-b text-gray-800">
              <div class="flex items-center space-x-2">
                <button @click.stop="openViewApplicationModal(app)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border border-blue-200">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  View
                </button>
                <button v-if="canEditApplication(app)" @click="openProgramFormModal(app)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 border border-amber-200">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Edit
                </button>
                <button v-if="canDeleteApplication(app)" @click.stop="promptDeleteApplication(app)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isProgramFormModalOpen" class="modal-form fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4" @click.self="handleProgramFormModalClose">
        <div class="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-900">{{ applicationForEditing ? 'Edit Education Program' : 'Offer New Education Program' }}</h2>
                <button @click="handleProgramFormModalClose" class="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
            </div>
            <div class="p-6">
                <ApplyNewEducationProgram :applicationToEdit="applicationForEditing" @close="handleProgramFormModalClose" @program-saved="refreshDataAndCloseForm" ref="applyProgramForm"/>
            </div>
        </div>
    </div>
    <ViewApplicationModal v-if="isViewModalOpen && applicationForViewing" :isVisible="isViewModalOpen" :application="applicationForViewing" :teachingCenterNameProp="applicationForViewing.teaching_center?.center_name || 'N/A'" @close="closeViewApplicationModal"/>
    <ConfirmDialog v-if="isConfirmDeleteModalOpen && applicationForDeleting" :isVisible="isConfirmDeleteModalOpen" title="⚠️ Confirm Deletion" :message="`Are you sure you want to permanently delete '${applicationForDeleting?.specific_program_title || applicationForDeleting?.id}'?`" @confirm="executeDeleteApplication" @cancel="closeConfirmDeleteModal"/>
    <PaymentModal ref="paymentModalRef" :amount="paymentAmount" serviceName="MHPC New Education Program Registration" @payment-completed="handleNewProgramPaymentCompleted" @close="closePaymentModal"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import ApplyNewEducationProgram from './ApplyNewEducationProgram.vue';
import ViewApplicationModal from './modals/ViewApplicationModal.vue';
import ConfirmDialog from './modals/ConfirmDialog.vue';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const authStore = useAuthStore();
const applications = ref([]);
const loading = ref(true);
const error = ref(null);

const isProgramFormModalOpen = ref(false);
const applicationForEditing = ref(null);
const applyProgramForm = ref(null);
const isViewModalOpen = ref(false);
const applicationForViewing = ref(null);
const isConfirmDeleteModalOpen = ref(false);
const applicationForDeleting = ref(null);
const paymentModalRef = ref(null);
const applicationForPayment = ref(null);
const paymentAmount = ref(100);

const fetchApplications = async () => {
  loading.value = true;
  error.value = null;
  try {
    const user = authStore.user;
    if (!user || !user.cid) {
        throw new Error('User CID not found. Cannot fetch applications.');
    }
    const response = await apiServices.getMhpcProgramsOffered({ cid: user.cid });
    applications.value = response.data.results || response.data || [];
  } catch (err) {
    console.error('Error fetching program applications:', err);
    error.value = err.message || 'Failed to load program applications.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) { return 'Invalid Date'; }
};

const getStatusClass = (status) => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (status) {
    case 'PENDING_REVIEW': return `${baseClass} bg-gray-100 text-gray-800`;
    case 'UNDER_REVIEW': return `${baseClass} bg-yellow-100 text-yellow-800`;
    case 'AWAITING_PAYMENT': return `${baseClass} bg-sky-100 text-sky-800`;
    case 'ACTIVE': return `${baseClass} bg-green-100 text-green-800`;
    case 'REJECTED': return `${baseClass} bg-red-100 text-red-800`;
    default: return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

const getPaymentStatusClass = (paymentStatus) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (paymentStatus) {
        case 'PAID': return `${baseClass} bg-green-100 text-green-800`;
        case 'AWAITING': return `text-yellow-600 text-xs font-medium`;
        case 'PENDING': return `${baseClass} bg-yellow-100 text-yellow-800`;
        case 'FAILED': return `${baseClass} bg-red-100 text-red-800`;
        case 'NA': return `text-gray-500 text-xs`;
        default: return `text-gray-500 text-xs`;
    }
};

const showMakePaymentButton = (app) => {
    return app.status === 'AWAITING_PAYMENT' && app.payment_status !== 'PAID';
};

const canEditApplication = (app) => {
    return ['PENDING_REVIEW', 'REJECTED'].includes(app.status);
};

const canDeleteApplication = (app) => {
    return ['PENDING_REVIEW', 'REJECTED'].includes(app.status);
};

const openProgramFormModal = (app = null) => {
  applicationForEditing.value = app ? { ...app } : null;
  isProgramFormModalOpen.value = true;
};

const handleProgramFormModalClose = () => {
  isProgramFormModalOpen.value = false;
  applicationForEditing.value = null;
};

const refreshDataAndCloseForm = () => {
  handleProgramFormModalClose();
  fetchApplications();
};

const openViewApplicationModal = (app) => {
  applicationForViewing.value = { ...app };
  isViewModalOpen.value = true;
};

const closeViewApplicationModal = () => {
  isViewModalOpen.value = false;
  applicationForViewing.value = null;
};

const promptDeleteApplication = (app) => {
  applicationForDeleting.value = { ...app };
  isConfirmDeleteModalOpen.value = true;
};

const closeConfirmDeleteModal = () => {
  isConfirmDeleteModalOpen.value = false;
  applicationForDeleting.value = null;
};

const executeDeleteApplication = async () => {
  if (!applicationForDeleting.value) return;
  const loadingToast = toast.info('Deleting application...', { timeout: false });
  try {
    await apiServices.deleteMhpcProgramOffered(applicationForDeleting.value.id);
    toast.dismiss(loadingToast);
    toast.success(`Application "${applicationForDeleting.value.specific_program_title || applicationForDeleting.value.id}" deleted.`);
    await fetchApplications();
  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error(err.response?.data?.detail || 'Failed to delete application.');
  } finally {
    closeConfirmDeleteModal();
  }
};

const initiateNewProgramPayment = (app) => {
  applicationForPayment.value = { ...app };
  paymentAmount.value = 100;
  paymentModalRef.value.openModal();
};

const closePaymentModal = () => {
  applicationForPayment.value = null;
};

const handleNewProgramPaymentCompleted = async (paymentData) => {
  // 1. Initial Checks: Ensure an item is selected for payment.
  if (!applicationForPayment.value) {
    toast.error('No application selected for payment.');
    return;
  }

  const user = authStore.user;
  if (!user || !user.email || !user.cid || !user.id) {
    toast.error('Missing user information. Please log in again or update your profile.');
    return;
  }

  const loadingToast = toast.info('Connecting to payment gateway...', { timeout: false });
  const appToPay = applicationForPayment.value;
  const paymentId = paymentData.paymentHash;

  try {
    // 2. Build FormData for the Payment Gateway
    const paymentGatewayFormData = new FormData();
    paymentGatewayFormData.append('refNo', paymentId);
    // Use the correct service code for this specific service
    paymentGatewayFormData.append('serviceCode', '100249');
    paymentGatewayFormData.append('taxPayerName', user.cid);
    paymentGatewayFormData.append('taxPayerNo', user.cid);
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid);
    // Use the dynamic paymentAmount from the component's state
    paymentGatewayFormData.append('totalPayableAmount', paymentAmount.value);
    paymentGatewayFormData.append('description', 'MHPC New Education Program Registration');
    paymentGatewayFormData.append('mobileNo', user?.contact_number || '17890123');
    paymentGatewayFormData.append('payerEmail', user.email);
    paymentGatewayFormData.append('user', user.id);
    paymentGatewayFormData.append('payableAmount', paymentAmount.value);
    paymentGatewayFormData.append('application_no', appToPay.id);
    // Use the correct app_type
    paymentGatewayFormData.append('app_type', 'specification_for_health_certification');

    // 3. Call the Payment Gateway API
    await apiServices.makePayment(paymentGatewayFormData);
    toast.dismiss(loadingToast);
    toast.info('Payment successful. Recording transaction...', { timeout: false });

    // 4. Call YOUR Backend to Record the Payment
    // This now calls the specific, secure endpoint for this program type
    await apiServices.recordMhpcProgramPayment(appToPay.id, {
      payment_id: paymentId
    });

    toast.dismiss(loadingToast);
    toast.success(`Payment for program "${appToPay.specific_program_title}" recorded successfully.`);

    // 5. Refresh the list to show the new "Active" status
    await fetchApplications();

  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('Payment handling error:', error.response || error.request || error);
    const errorMsg = error.response?.data?.error || 'Failed to complete payment process. Please contact support.';
    toast.error(`Error: ${errorMsg}`);

    // Visually update the status to 'Failed' on error for immediate user feedback
    const appInList = applications.value.find(a => a.id === appToPay.id);
    if (appInList) {
        appInList.payment_status = 'FAILED';
    }

  } finally {
    // 6. Cleanup
    paymentModalRef.value.closeModal();
    applicationForPayment.value = null;
  }
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.modal-form {
  z-index: 50 !important;
}
</style>