<template>
  <div class="p-4 w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-3xl font-serif font-bold text-slate-900">
        All ROQ Applications
      </h2>
      <button class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg
      hover:bg-blue-700 active:bg-blue-800
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transform transition-all duration-200 hover:scale-[1.02]
      shadow-sm hover:shadow" @click="handleApplicationSubmitted" :disabled="loading">
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
      </button>
    </div>

    <!-- Application Table with Loading State -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else class="w-full overflow-x-auto">
        <ApplicationList :applications="paginatedApplications" :current-page="currentPage"
          :total-results="filteredTotal" :per-page="perPage" @page-change="handlePageChange"
          @action="handleApplicationAction" @per-page-change="handlePerPageChange"
          @search-query-change="handleSearchChange" @status-filter-change="handleStatusChange"
          :no-results="filteredApplications.length === 0" user-role="chief" />
      </div>
    </div>

    <ApplicationModal :show-modal="showModal" :modal-type="modalType" :application="selectedApplication"
      @close="closeModal" @update="handleApplicationUpdate" />
    <RemarksModal :show-modal="showRemarksModal" :chief-remarks="selectedApplication.chief_remarks"
      :dealing-officer-remarks="selectedApplication.dealing_officer_remarks" @close="closeRemarksModal" />
    <!-- Add ViewCertificateModal -->
    <ViewCertificateModal v-if="modalType === 'viewCertificate'" :show-modal="showModal"
      :application="selectedApplication" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import ApplicationList from '@/components/common/ROQ/ROQAdminApplicationList.vue';
import ApplicationModal from '@/components/common/ROQ/ROQApplicationModal.vue';
import RemarksModal from '@/components/common/ROQ/ROQRemarksModal.vue';
import ViewCertificateModal from '@/components/common/ROQ/ROQViewCertificateModal.vue';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore';
import { RefreshCw } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';

const toast = useToast();
const { userId } = useAuthStore();

const noteText = ref('');
const qecNumber = ref('');
const showModal = ref(false);
const loading = ref(false);
const currentPage = ref(1);
const perPage = ref(10);
const applications = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedType = ref('');
const modalType = ref(null);
const selectedApplication = ref({});
const showRemarksModal = ref(false);
const error = ref(null);

// Computed Property for filtered Applications
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesType = selectedType.value
      ? app.type_of_course === selectedType.value
      : true;
    const matchesSearch = searchQuery.value
      ? Object.values(app).some((value) =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      : true;
    const isNotSecondCopy = !app.is_second_copy; // Exclude if is_second_copy is true
    const isNotDraft = app.status !== 'draft';
    const isNotApproved = app.status !== 'approved';

    return matchesType && matchesSearch && isNotSecondCopy && isNotDraft && isNotApproved;
  });
});

// Compute total for pagination
const filteredTotal = computed(() => filteredApplications.value.length);

// Get paginated data
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  return filteredApplications.value.slice(start, end);
});

// Reset pagination when filters change
watch([selectedStatus, selectedType, searchQuery], () => {
  currentPage.value = 1;
});

// Method for closing the modal and refreshing data
const handleApplicationSubmitted = async () => {
  if (loading.value) return; // Prevent multiple clicks

  showModal.value = false;
  loading.value = true;
  error.value = null;

  try {
    // Show a persistent loading toast
    const loadingToast = toast.info('Refreshing applications...', {
      timeout: false, // Prevent auto-dismissal
      closeButton: false, // Hide the close button
    });

    await loadData();
    await nextTick();

    toast.dismiss(loadingToast);
    toast.success('Applications refreshed successfully');
  } catch (err) {
    error.value = err;
    console.error('Failed to refresh applications:', err);
    toast.error('Failed to refresh applications. Please try again.');
  } finally {
    loading.value = false; // Ensure loading is reset
  }
};

// Load Data Function
const loadData = async () => {
  loading.value = true;
  try {
    const response = await apiService.getRecognitionOfQualifications({
      user_id: userId.value,
      status: "under_review",
      forward: true,
    });
    applications.value = response.data.results;
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
};

// Page Change Handler
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const handlePerPageChange = (newPerPage) => {
  perPage.value = newPerPage;
  currentPage.value = 1; // Reset to first page when per page changes
};

//search query change handler
const handleSearchChange = (newQuery) => {
  searchQuery.value = newQuery
}

//Status filter change
const handleStatusChange = (newStatus) => {
  selectedStatus.value = newStatus
}

const handleApplicationAction = ({ action, application }) => {
  if (action === 'regretReason') {
    selectedApplication.value = application;
    showRemarksModal.value = true;
    return;
  } else if (action === 'readDoRemarks') {
    selectedApplication.value = application;
    showRemarksModal.value = true;
    return;
  } else if (action === 'viewCertificate') {
    modalType.value = 'viewCertificate';
    selectedApplication.value = application;
    showModal.value = true;
    return;
  }
  else if (action === 'approve') {
    modalType.value = 'approve';
  }
  else {
    modalType.value = action;
  }
  selectedApplication.value = application;
  if (action === 'addNote') {
    noteText.value = application.chief_remarks
  }
  if (action === 'assignQEC') {
    qecNumber.value = application.qec_number
  }
  showModal.value = true;
};


const closeModal = () => {
  showModal.value = false;
  modalType.value = null;
  selectedApplication.value = {};
};

const closeRemarksModal = () => {
  showRemarksModal.value = false;
  selectedApplication.value = {};
};

const handleApplicationUpdate = async (updateData) => {
  loading.value = true;
  try {
    if (updateData.modal_action === 'addNote') {
      await apiService.patchRecognitionOfQualification(selectedApplication.value.id, {
        chief_remarks: updateData.remarks,
        modal_action: updateData.modal_action,
      })
    } else if (updateData.modal_action === 'regret') {
      await apiService.patchRecognitionOfQualification(selectedApplication.value.id, {
        chief_remarks: updateData.chief_remarks,
        status: updateData.status,
        modal_action: updateData.modal_action
      })
    }
    else if (updateData.modal_action === 'assignQEC') {
      await apiService.patchRecognitionOfQualification(selectedApplication.value.id, {
        qec_number: updateData.qec_number,
        status: updateData.status,
        modal_action: updateData.modal_action,
      })
    }
    else if (updateData.modal_action === 'approve') {
      await apiService.patchRecognitionOfQualification(selectedApplication.value.id, {
        status: updateData.status,
        modal_action: updateData.modal_action,
        qec_number: 'None',
      })
    }
    else {
      await apiService.updateRecognitionOfQualification(selectedApplication.value.id, updateData);
    }
    await loadData();
  } catch (e) {
    console.error('Error updating application:', e);
  } finally {
    loading.value = false;
    closeModal();
  }
};

onMounted(() => {
  loadData();
});
</script>
