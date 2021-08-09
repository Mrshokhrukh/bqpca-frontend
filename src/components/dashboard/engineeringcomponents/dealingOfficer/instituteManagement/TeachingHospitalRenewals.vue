<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Center Renewal Applications</h1>
      <div class="flex flex-wrap items-center text-gray-600 gap-x-6 gap-y-2">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ renewalApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Approved: {{ approvedApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Rejected: {{ rejectedApplications.length }}
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-8 h-8" />
      <p class="ml-3 text-lg text-gray-600">Loading renewal applications...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchRenewalData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Try Again
      </button>
    </div>

    <!-- Applications Table -->
    <div v-else-if="renewalApplications.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Center / Institute</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Submitted On</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Review Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="renewal in renewalApplications" :key="renewal.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ renewal.teaching_center_details.center_name }}</div>
                <div class="text-xs text-gray-500">{{ renewal.teaching_center_details.institute.name_of_institution }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(renewal.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getPaymentStatusClass(renewal.payment_status)">
                  {{ renewal.payment_status_display }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(renewal.renewal_status)">
                  {{ renewal.renewal_status_display }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openDetailsModal(renewal)"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No applications message -->
    <div v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      <p class="text-gray-600">No teaching center renewal applications found.</p>
    </div>

    <!-- Redesigned Details Modal -->
    <div v-if="showDetailsModal && selectedRenewal"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[95vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Review Renewal Application</h3>
            <p class="text-sm text-gray-500">For: {{ selectedRenewal.teaching_center_details.center_name }}</p>
          </div>
          <button @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-grow p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column: Applicant & Center Details -->
          <div class="lg:col-span-2 space-y-8">
            <div>
              <h4 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Applicant's Submission</h4>
              <div class="space-y-4">
                <div class="flex items-start">
                  <FileTextIcon class="h-5 w-5 text-gray-400 mt-0.5" />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-800">Renewal Document</p>
                    <a :href="selectedRenewal.renewal_document" target="_blank"
                      class="text-blue-600 hover:text-blue-800 text-sm">View Submitted Document</a>
                  </div>
                </div>
                <div class="flex items-start">
                  <MessageSquareIcon class="h-5 w-5 text-gray-400 mt-0.5" />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-800">Applicant Remarks</p>
                    <p class="text-sm text-gray-600">{{ selectedRenewal.user_remarks || 'No remarks provided.' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Center Details</h4>
              <div class="space-y-4">
                <div class="flex items-start">
                  <Building2Icon class="h-5 w-5 text-gray-400 mt-0.5" />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-800">Institute</p>
                    <p class="text-sm text-gray-600">{{
                      selectedRenewal.teaching_center_details.institute.name_of_institution }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <CalendarClockIcon class="h-5 w-5 text-gray-400 mt-0.5" />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-800">Current Validity</p>
                    <p class="text-sm text-gray-600">{{ formatDate(selectedRenewal.teaching_center_details.valid_since)
                      }} to {{ formatDate(selectedRenewal.teaching_center_details.valid_till) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Officer's Action Panel -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-6">
            <h4 class="text-lg font-semibold text-gray-800">Action Panel</h4>

            <!-- Status Information -->
            <div class="space-y-4">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Payment Status</p>
                <p class="text-sm font-semibold flex items-center"
                  :class="isPaymentCompleted ? 'text-green-600' : 'text-yellow-600'">
                  <CircleCheckIcon v-if="isPaymentCompleted" class="h-4 w-4 mr-1.5" />
                  <CircleAlertIcon v-else class="h-4 w-4 mr-1.5" />
                  {{ selectedRenewal.payment_status_display }}
                </p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Review Status</p>
                <p class="text-sm font-semibold">{{ selectedRenewal.renewal_status_display }}</p>
              </div>
            </div>

            <!-- Officer Review Form (Only for Pending applications) -->
            <form @submit.prevent="submitReview" v-if="selectedRenewal.renewal_status === 'PENDING'"
              class="space-y-4 border-t pt-6">
              <div v-if="!isPaymentCompleted"
                class="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <p class="font-bold">Awaiting Payment</p>
                <p class="text-sm">Approval is disabled until the applicant completes the payment for this renewal.</p>
              </div>

              <div>
                <label for="reviewDecision" class="block text-sm font-medium text-gray-700">Decision</label>
                <select id="reviewDecision" v-model="reviewForm.renewal_status" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="REJECTED">Reject</option>
                  <option v-if="isPaymentCompleted" value="COMPLETED">Approve & Complete</option>
                </select>
              </div>

              <div>
                <label for="officerRemarks" class="block text-sm font-medium text-gray-700">
                  {{ reviewForm.renewal_status === 'REJECTED'
                    ? 'Reason for Rejection (Required)'
                    : 'Officer Remarks (Optional)' }}
                </label>
                <textarea id="officerRemarks" v-model="reviewForm.officer_remarks" rows="4"
                  :required="reviewForm.renewal_status === 'REJECTED'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>

              <div class="flex justify-end pt-2">
                <button type="submit"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                  :disabled="isSubmitting || (reviewForm.renewal_status === 'COMPLETED' && !isPaymentCompleted)">
                  {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
                </button>
              </div>
            </form>

            <!-- Display Previous Review Details -->
            <div v-else class="border-t pt-6">
              <h5 class="font-semibold text-gray-800 mb-2">Review Complete</h5>
              <div class="space-y-3 text-sm">
                <p><strong class="text-gray-600">Decision:</strong> {{ selectedRenewal.renewal_status_display }}</p>
                <p><strong class="text-gray-600">Remarks:</strong> {{ selectedRenewal.officer_remarks || 'N/A' }}</p>
                <p><strong class="text-gray-600">Reviewed By:</strong> {{ selectedRenewal.reviewed_by_details?.username
                  || 'N/A' }}</p>
                <p><strong class="text-gray-600">Reviewed At:</strong> {{ formatDate(selectedRenewal.reviewed_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import { Loader, FileTextIcon, MessageSquareIcon, Building2Icon, CalendarClockIcon, CircleCheckIcon, CircleAlertIcon } from 'lucide-vue-next';

const renewalApplications = ref([]);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const selectedRenewal = ref(null);
const showDetailsModal = ref(false);
const isSubmitting = ref(false);

const reviewForm = ref({
  renewal_status: '',
  officer_remarks: '',
});

const toast = useToast();

const pendingApplications = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'PENDING'));
const approvedApplications = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'COMPLETED'));
const rejectedApplications = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'REJECTED'));

const isPaymentCompleted = computed(() => {
  return selectedRenewal.value?.payment_status === 'completed';
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusClass = (status) => {
  return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
};

const openDetailsModal = (renewal) => {
  selectedRenewal.value = renewal;
  reviewForm.value = {
    renewal_status: isPaymentCompleted.value ? 'COMPLETED' : 'REJECTED',
    officer_remarks: renewal.officer_remarks || '',
  };
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedRenewal.value = null;
};

const submitReview = async () => {
  if (!selectedRenewal.value) return;

  if (reviewForm.value.renewal_status === 'REJECTED' && !reviewForm.value.officer_remarks.trim()) {
    toast.error('Reason for rejection is required.');
    return;
  }

  if (reviewForm.value.renewal_status === 'COMPLETED' && !isPaymentCompleted.value) {
    toast.error('Cannot approve an application that has not been paid.');
    return;
  }

  isSubmitting.value = true;
  try {
    const renewalId = selectedRenewal.value.id;
    const payload = {
      renewal_status: reviewForm.value.renewal_status,
      officer_remarks: reviewForm.value.officer_remarks,
    };
    await apiServices.patchEpcTeachingCenterRenewal(renewalId, payload);

    toast.success(`Renewal application has been ${reviewForm.value.renewal_status.toLowerCase()}.`);
    await fetchRenewalData();
    closeDetailsModal();
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error(error.response?.data?.detail || 'Failed to submit review.');
  } finally {
    isSubmitting.value = false;
  }
};

const fetchRenewalData = async () => {
  isLoading.value = true;
  apiError.value = false;
  try {
    const response = await apiServices.getEpcTeachingCenterRenewals();
    renewalApplications.value = response.data.results || [];
  } catch (error) {
    console.error('Error fetching renewal applications:', error);
    errorMessage.value = error.response?.data?.detail || 'Failed to load data.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchRenewalData);
</script>
