<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
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

    <!-- Loading / Error / No Data States -->
    <div v-if="loading || loadingTeachingCenters" class="flex justify-center items-center py-8">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-600">
        {{ loading ? 'Loading applications...' : 'Loading supporting data...' }}
      </span>
    </div>
    <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
      <p class="text-red-800">{{ error }}</p>
    </div>
    <div v-else-if="applications.length === 0" class="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-md">
      <p class="text-gray-800">No program applications found.</p>
    </div>

    <!-- Applications Table -->
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
            <td class="py-3 px-4 border-b text-gray-800">{{ getTeachingCenterName(app.teaching_center) || 'N/A' }}</td>
            <td class="py-3 px-4 border-b">
              <span :class="getStatusClass(app.status)">
                {{ app.status || 'Unknown' }}
              </span>
            </td>
            <!-- PAYMENT STATUS COLUMN -->
            <td class="py-3 px-4 border-b text-gray-800 align-middle">
              <button
                v-if="showMakePaymentButton(app)"
                @click.stop="initiateNewProgramPayment(app)"
                class="text-green-600 hover:text-green-800 font-medium text-xs px-2 py-1 border border-green-500 rounded hover:bg-green-50 whitespace-nowrap"
                title="Make Payment for Program"
              >
                Make Payment
              </button>
              <template v-else>
                <span :class="getPaymentStatusClass(app)">
                    {{ formatPaymentStatus(app) }}
                </span>
                <span v-if="app.payment_id && app.is_payment_complete" class="text-xs text-gray-500 block">(Ref: {{ app.payment_id.substring(0,8) }}...)</span>
              </template>
            </td>
            <!-- END PAYMENT STATUS COLUMN -->
            <td class="py-3 px-4 border-b text-gray-800">
              {{ formatDate(app.created_at) }}
            </td>
            <!-- ENHANCED ACTIONS COLUMN -->
            <td class="py-3 px-4 border-b text-gray-800">
              <div class="flex items-center space-x-2">
                <!-- View Button -->
                <button
                  @click.stop="openViewApplicationModal(app)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 transition-colors"
                  title="View Application Details"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View
                </button>

                <!-- Edit Button -->
                <button
                  v-if="canEditApplication(app)"
                  @click="openProgramFormModal(app)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 border border-amber-200 transition-colors"
                  title="Edit Application"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>

                <!-- Delete Button - Enhanced with better visibility -->
                <button
                  v-if="canDeleteApplication(app)"
                  @click.stop="promptDeleteApplication(app)"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 transition-colors"
                  title="Delete Application"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Delete
                </button>

                <!-- Show message when delete is not available -->
                <span
                  v-if="!canDeleteApplication(app) && (app.status?.toLowerCase() === 'active' || app.is_payment_complete)"
                  class="text-xs text-gray-400 italic"
                  title="Cannot delete active or paid applications"
                >
                  Cannot delete
                </span>
              </div>
            </td>
            <!-- END ENHANCED ACTIONS COLUMN -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Add/Edit Education Program Form -->
    <div
      v-if="isProgramFormModalOpen"
      class="modal-form fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
      @click.self="handleProgramFormModalClose"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ applicationForEditing ? 'Edit Education Program' : 'Offer New Education Program' }}
          </h2>
          <button
            @click="handleProgramFormModalClose"
            class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div class="p-6">
          <ApplyNewEducationProgram
            :applicationToEdit="applicationForEditing"
            @close="handleProgramFormModalClose"
            @program-saved="refreshDataAndCloseForm"
            ref="applyProgramForm"
          />
        </div>
      </div>
    </div>

    <!-- View Application Modal -->
    <ViewApplicationModal
      v-if="isViewModalOpen && applicationForViewing"
      :isVisible="isViewModalOpen"
      :application="applicationForViewing"
      :teachingCenterNameProp="getTeachingCenterName(applicationForViewing?.teaching_center)"
      @close="closeViewApplicationModal"
    />

    <!-- Enhanced Confirm Delete Modal -->
    <ConfirmDialog
      v-if="isConfirmDeleteModalOpen && applicationForDeleting"
      :isVisible="isConfirmDeleteModalOpen"
      title="⚠️ Confirm Deletion"
      :message="`Are you sure you want to permanently delete the program application '${applicationForDeleting?.specific_program_title || applicationForDeleting?.id}'?\n\nThis action cannot be undone and will remove all associated data.`"
      confirmButtonText="Yes, Delete"
      cancelButtonText="Cancel"
      confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
      cancelButtonClass="bg-gray-300 hover:bg-gray-400 text-gray-800"
      @confirm="executeDeleteApplication"
      @cancel="closeConfirmDeleteModal"
    />

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="paymentAmount"
      serviceName="MHPC New Education Program Registration"
      @payment-completed="handleNewProgramPaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
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
const allTeachingCenters = ref([]);
const loading = ref(true);
const loadingTeachingCenters = ref(true);
const error = ref(null);

// Modal states
const isProgramFormModalOpen = ref(false);
const applicationForEditing = ref(null);
const applyProgramForm = ref(null);

const isViewModalOpen = ref(false);
const applicationForViewing = ref(null);

const isConfirmDeleteModalOpen = ref(false);
const applicationForDeleting = ref(null);

// Payment Modal related
const paymentModalRef = ref(null);
const applicationForPayment = ref(null);
const paymentAmount = ref(100);

const fetchAllData = async () => {
  loading.value = true;
  loadingTeachingCenters.value = true;
  error.value = null;
  try {
    await fetchAllTeachingCenters();
    await fetchApplications();
  } catch (err) {
    console.error('Error fetching data:', err);
    // Error already logged by individual fetch functions
  } finally {
    loading.value = false;
    loadingTeachingCenters.value = false;
  }
};

const fetchAllTeachingCenters = async () => {
  try {
    const response = await apiServices.getMhpcTeachingCenters();
    allTeachingCenters.value = response.data.results || response.data || [];
  } catch (err) {
    console.error('Error fetching teaching centers:', err);
    error.value = 'Failed to load teaching center data.';
    toast.error(error.value);
  }
};

const fetchApplications = async () => {
  try {
    const response = await apiServices.getMhpcProgramsOffered();
    applications.value = (response.data.results || response.data || []).map(app => ({
        ...app,
        status: app.status || 'Unknown',
        payment_id: app.payment_id || null,
        is_payment_complete: typeof app.is_payment_complete === 'boolean' ? app.is_payment_complete : false,
    }));
  } catch (err) {
    console.error('Error fetching program applications:', err);
    error.value = 'Failed to load program applications. Please try again later.';
    toast.error(error.value);
  }
};


const getTeachingCenterName = (tcId) => {
  if (!tcId || !allTeachingCenters.value.length) return 'N/A';
  const center = allTeachingCenters.value.find(tc => tc.id === tcId);
  return center ? `${center.center_name} (${center.center_location || 'N/A'})` : `ID: ${tcId}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Invalid date format:', dateString, e);
    return 'Invalid Date';
  }
};

const getStatusClass = (status) => {
  const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
  switch (status?.toLowerCase()) {
    case 'pending': return `${baseClass} bg-yellow-100 text-yellow-800`;
    case 'approved': return `${baseClass} bg-sky-100 text-sky-800`;
    case 'rejected': return `${baseClass} bg-red-100 text-red-800`;
    case 'active': return `${baseClass} bg-green-100 text-green-800`;
    default: return `${baseClass} bg-gray-100 text-gray-800`;
  }
};

const formatPaymentStatus = (app) => {
    if (app.is_payment_complete) {
        return 'Paid';
    }
    if (app.status?.toLowerCase() === 'approved' && !app.is_payment_complete) {
        return 'Payment Due';
    }
    if (app.status?.toLowerCase() === 'active') {
        return 'Paid';
    }
    return 'N/A';
};

const getPaymentStatusClass = (app) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    if (app.is_payment_complete) {
        return `${baseClass} bg-green-100 text-green-800`;
    }
    if (app.status?.toLowerCase() === 'approved' && !app.is_payment_complete) {
        return `text-yellow-600 text-xs font-medium`;
    }
    if (app.status?.toLowerCase() === 'active') {
        return `${baseClass} bg-green-100 text-green-800`;
    }
    return `text-gray-500 text-xs`;
};

// --- Action Button Visibility Logic ---
const showMakePaymentButton = (app) => {
    return app.status?.toLowerCase() === 'approved' && !app.is_payment_complete;
};

const canEditApplication = (app) => {
    const appStatusLower = app.status?.toLowerCase();
    if (appStatusLower === 'pending' || appStatusLower === 'rejected') {
        return true;
    }
    if (appStatusLower === 'approved' && !app.is_payment_complete) {
        return true;
    }
    return false;
};

// Enhanced delete logic - more permissive for demonstration
const canDeleteApplication = (app) => {
    const appStatusLower = app.status?.toLowerCase();

    // Allow deletion for pending and rejected applications
    if (appStatusLower === 'pending' || appStatusLower === 'rejected') {
        return true;
    }

    // Allow deletion for approved applications that haven't been paid
    if (appStatusLower === 'approved' && !app.is_payment_complete) {
        return true;
    }

    // Restrict deletion for active/paid applications
    if (appStatusLower === 'active' || app.is_payment_complete) {
        return false;
    }

    return false;
};


// --- Program Form Modal (Add/Edit) ---
const openProgramFormModal = async (app = null) => {
  applicationForEditing.value = app ? { ...app } : null;
  isProgramFormModalOpen.value = true;
  await nextTick();
  if (applyProgramForm.value) {
    if (app && applyProgramForm.value.initializeForEdit) {
      applyProgramForm.value.initializeForEdit(applicationForEditing.value);
    } else if (!app && applyProgramForm.value.initializeForNew) {
      applyProgramForm.value.initializeForNew();
    } else if (!app && applyProgramForm.value.resetForm) {
       applyProgramForm.value.resetForm();
    }
  }
};

const handleProgramFormModalClose = () => {
  isProgramFormModalOpen.value = false;
  applicationForEditing.value = null;
  if (applyProgramForm.value && applyProgramForm.value.resetForm) {
    applyProgramForm.value.resetForm();
  }
};

const refreshDataAndCloseForm = () => {
  handleProgramFormModalClose();
  fetchAllData();
};

// --- View Application Modal ---
const openViewApplicationModal = (app) => {
  applicationForViewing.value = { ...app };
  isViewModalOpen.value = true;
};

const closeViewApplicationModal = () => {
  isViewModalOpen.value = false;
  applicationForViewing.value = null;
};

// --- Enhanced Delete Application Logic ---
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

  const loadingToast = toast.info('Deleting application...', {
    timeout: false,
    closeOnClick: false,
    draggable: false
  });

  try {
    await apiServices.deleteMhpcProgramOffered(applicationForDeleting.value.id);

    toast.dismiss(loadingToast);
    toast.success(`Application "${applicationForDeleting.value.specific_program_title || applicationForDeleting.value.id}" deleted successfully.`, {
      timeout: 5000
    });

    await fetchAllData();
  } catch (err) {
    toast.dismiss(loadingToast);
    console.error('Error deleting program application:', err);

    let errorMessage = 'Failed to delete application.';
    if (err.response?.data?.detail) {
      errorMessage = err.response.data.detail;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    toast.error(`Delete Error: ${errorMessage}`, {
      timeout: 8000
    });
  } finally {
    closeConfirmDeleteModal();
  }
};

// --- Payment Logic ---
const initiateNewProgramPayment = (app) => {
  if (!authStore.isAuthenticated || !authStore.user) {
    toast.error('You must be logged in to make a payment.');
    return;
  }
  applicationForPayment.value = { ...app };
  paymentAmount.value = 100;
  if (paymentModalRef.value && typeof paymentModalRef.value.openModal === 'function') {
    paymentModalRef.value.openModal();
  } else {
    toast.error('Payment system is currently unavailable. Please try again later.');
    console.error('PaymentModal ref or openModal method is not available.');
  }
};

const closePaymentModal = () => {
  if (applicationForPayment.value) {
      console.log('Payment modal closed manually or after completion.');
  }
  applicationForPayment.value = null;
};

const handleNewProgramPaymentCompleted = async (paymentData) => {
  if (!applicationForPayment.value) {
    toast.error('No application selected for payment processing.');
    return;
  }
  if (!authStore.isAuthenticated || !authStore.user) {
    toast.error('User not authenticated. Please log in.');
    return;
  }

  const user = authStore.user;
  const appToPay = applicationForPayment.value;
  const paymentId = paymentData.paymentHash;

  try {
    const instituteId = appToPay.institute?.id || authStore.user.institute_id || user.id;
    const instituteName = appToPay.institute?.name_of_institution || authStore.user.organization_name || user.name || 'N/A';

    const paymentGatewayFormData = new FormData();
    paymentGatewayFormData.append('refNo', paymentId);
    paymentGatewayFormData.append('serviceCode', '100249');
    paymentGatewayFormData.append('taxPayerName', instituteName);
    paymentGatewayFormData.append('taxPayerNo', String(instituteId));
    paymentGatewayFormData.append('taxPayerDocumentNo', String(instituteId));
    paymentGatewayFormData.append('totalPayableAmount', paymentAmount.value);
    paymentGatewayFormData.append('description', `MHPC Edu Program: ${appToPay.specific_program_title.substring(0, 50)}`);
    paymentGatewayFormData.append('mobileNo', user.contact_number || '0000000000');
    paymentGatewayFormData.append('payerEmail', user.email || 'no-reply@example.com');
    paymentGatewayFormData.append('user', String(user.id));
    paymentGatewayFormData.append('payableAmount', paymentAmount.value);
    paymentGatewayFormData.append('application_no', String(appToPay.id));
    paymentGatewayFormData.append('app_type', 'mhpc_education_program');

    await apiServices.makePayment(paymentGatewayFormData);

    const programUpdateFormData = new FormData();
    programUpdateFormData.append('payment_id', paymentId);
    programUpdateFormData.append('is_payment_complete', true);
    // Optionally:
    // programUpdateFormData.append('status', 'Active');

    await apiServices.patchMhpcProgramOffered(appToPay.id, programUpdateFormData);

    toast.success(`Payment for program "${appToPay.specific_program_title}" (Ref: ${paymentId.substring(0, 8)}...) recorded.`);

    await fetchAllData();

  } catch (error) {
    console.error('Error processing new program payment:', error);
    let errorMsg = 'Failed to process payment for the education program.';
    if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === 'object' && serverErrors !== null) {
            errorMsg = Object.entries(serverErrors)
                .map(([key, val]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(val) ? val.join(', ') : val}`)
                .join('; ') || JSON.stringify(serverErrors);
        } else if (serverErrors?.detail || serverErrors?.message) {
             errorMsg = serverErrors.detail || serverErrors.message;
        } else {
            errorMsg = JSON.stringify(serverErrors);
        }
    } else if (error.request) {
      errorMsg = 'Network Error: Could not reach the server to confirm payment.';
    }
    toast.error(`Payment Error: ${errorMsg}. Contact support with payment ref ${paymentId ? paymentId.substring(0,8) : 'N/A'} if issue persists.`);
  } finally {
    if (paymentModalRef.value && typeof paymentModalRef.value.closeModal === 'function') {
        paymentModalRef.value.closeModal();
    }
    applicationForPayment.value = null;
  }
};


onMounted(() => {
  fetchAllData();
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