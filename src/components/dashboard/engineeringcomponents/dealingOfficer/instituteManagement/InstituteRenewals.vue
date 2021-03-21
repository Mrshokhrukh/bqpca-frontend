<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Renewal Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ institutes.length }}
        </span>
        <span class="flex items-center ml-4">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ getPendingCount() }}
        </span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Course Title
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Valid Till
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="institute in institutes" :key="institute.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ institute.name_of_institution }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ institute.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ institute.title_of_course }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(institute.review_decision)">
                  {{ institute.review_decision }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(institute.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="handleApprove(institute)" :disabled="institute.review_decision !== 'Pending'" :class="[
                    'font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200',
                    institute.review_decision === 'Pending'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
                    Approve
                  </button>
                  <button @click="handleRegret(institute)" :disabled="institute.review_decision !== 'Pending'" :class="[
                    'font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200',
                    institute.review_decision === 'Pending'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]">
                    Regret
                  </button>
                  <button @click="openModal(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="institutes.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                No renewal applications found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination (if needed) -->
    <div v-if="institutes.length > 0"
      class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="text-sm text-gray-600">
        Showing {{ institutes.length }} results
      </div>
    </div>

    <InstituteRenewalApplicationDetailsModal :is-open="isModalOpen" :application-details="selectedInstitute"
      @close-modal="closeModal" @approve-application="handleApprove(selectedInstitute)"
      @regret-application="handleRegret(selectedInstitute)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification'; // Import toast (you may need to install this)
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'; // Adjust path if needed

// Services
import apiService from '@/services/services';

const toast = useToast();
// Initialize as an empty array to prevent filter errors
const institutes = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const selectedInstitute = ref({});

// Fetch institutes on component mount
onMounted(async () => {
  try {
    await fetchInstitutes();
  } catch (error) {
    console.error('Error fetching institutes:', error);
    toast.error('Failed to load institute applications');
  } finally {
    isLoading.value = false;
  }
});

const fetchInstitutes = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.getBmhcInstitutes();
    console.log('API Response:', response); // Debug response structure

    // Check the structure of the response
    if (Array.isArray(response)) {
      institutes.value = response;
    } else if (response.data && Array.isArray(response.data)) {
      institutes.value = response.data;
    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
      institutes.value = response.data.results;
    } else {
      console.error('Unexpected API response format:', response);
      institutes.value = []; // Fallback to empty array
      toast.error('Unexpected data format received from server');
    }
  } catch (error) {
    console.error('Error fetching institutes:', error);
    toast.error('Failed to load institute applications');
    institutes.value = []; // Ensure it's an array even on error
  } finally {
    isLoading.value = false;
  }
};

const openModal = (institute) => {
  selectedInstitute.value = institute;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedInstitute.value = {}; // Clear selected application data when closing
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const handleApprove = async (institute) => {
  if (institute.review_decision !== 'Pending') return;

  try {
    const currentDate = new Date();
    const validTill = new Date();
    validTill.setFullYear(validTill.getFullYear() + 1);

    // Update the institute status with is_active set to true
    const updatedData = {
      review_decision: 'Approved',
      do_dpr_review_decision: 'Approved', // Set both review fields
      is_active: true, // This is the missing key field
      valid_since: currentDate.toISOString().split('T')[0],
      valid_till: validTill.toISOString().split('T')[0],
    };

    await apiService.patchBmhcInstitute(institute.id, updatedData);

    // Rest of your code remains the same
    await fetchInstitutes();
    toast.success(`Approved renewal application for: ${institute.name_of_institution}`);
    if (isModalOpen.value) {
      closeModal();
    }
  } catch (error) {
    console.error('Error approving institute:', error);
    toast.error('Failed to approve application');
  }
};

const handleRegret = async (institute) => {
  if (institute.review_decision !== 'Pending') return;

  try {
    // Get rejection reason from user (you might want to add a prompt or modal for this)
    const reason = prompt('Please enter reason for regretting application:');
    if (reason === null) return; // User cancelled

    // Update the institute status
    const updatedData = {
      review_decision: 'Regretted', // Changed from 'Rejected' to 'Regretted'
      reason_if_rejected: reason || 'No reason provided',
    };

    await apiService.patchBmhcInstitute(institute.id, updatedData);

    // Refresh the institutes list
    await fetchInstitutes();

    // Show success message
    toast.success(`Regretted renewal application for: ${institute.name_of_institution}`);

    // Close modal if open
    if (isModalOpen.value) {
      closeModal();
    }
  } catch (error) {
    console.error('Error regretting institute:', error);
    toast.error('Failed to regret application');
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
    case 'Regretted': // Changed from 'Rejected' to 'Regretted'
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
    case 'Pending':
    default:
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
  }
};

const getPendingCount = () => {
  // Add safety check to ensure institutes.value is an array
  if (!Array.isArray(institutes.value)) {
    console.error('institutes.value is not an array:', institutes.value);
    return 0;
  }
  return institutes.value.filter(institute => institute.review_decision === 'Pending').length;
};
</script>