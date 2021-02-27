<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">EOI Applications</h1>
      </div>
      <div>
        <button
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          @click="handleApplicationSubmitted" :disabled="loading">
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
          {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search by App ID or Institute Name..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Application Table with Loading State -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Application ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Program Type
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Submitted
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="eoi in filteredEois" :key="eoi.applicationId" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ eoi.applicationId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ eoi.instituteName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ eoi.programType }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(eoi.dateSubmitted) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(eoi)">
                  {{ eoi.status }}
                  <span v-if="eoi.status === 'Rejected' && eoi.rejectionReason">
                    (Reason: {{ eoi.rejectionReason }})
                  </span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(eoi)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span v-if="eoi.approvalNotes">{{ eoi.approvalNotes }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- EOI Application Modal -->
    <EoiApplicationModal :isOpen="isModalOpen" :application="selectedEoi" @close="closeModal" @approve="approveEoi"
      @reject="rejectEoi" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import EoiApplicationModal from './EoiApplicationsModal.vue'

const toast = useToast();

const eois = ref([]);
const isModalOpen = ref(false);
const selectedEoi = ref(null);
const loading = ref(false);
const searchQuery = ref('');

onMounted(async () => {
  // Fetch EOIs from API here (replace with your actual API call)
  // Example data (same as before, for demonstration)
  eois.value = [
    {
      applicationId: 'AP100',
      instituteName: 'Test Institute',
      instituteAddress: 'Some Address',
      correspondenceAddress: 'Corr Address',
      location: 'Some Location',
      phoneOffice: '123-456-7890',
      mobile: '987-654-3210',
      fax: 'N/A',
      email: 'test@example.com',
      webpage: 'www.example.com',
      courseTitle: 'Medical Course',
      duration: '4 years',
      proposedDate: '2024-12-01',
      programType: 'Bachelor',
      dateSubmitted: '10/10/2024',
      status: 'Submitted',
    },
    {
      applicationId: 'AP101',
      instituteName: 'Test Institute 2',
      instituteAddress: 'Another Address',
      correspondenceAddress: 'Another Corr Address',
      location: 'Another Location',
      phoneOffice: '111-222-3333',
      mobile: '444-555-6666',
      fax: 'N/A',
      email: 'test2@example.com',
      webpage: 'www.example2.com',
      courseTitle: 'Nursing Program',
      duration: '3 years',
      proposedDate: '2025-01-15',
      programType: 'Diploma',
      dateSubmitted: '10/10/2024',
      status: 'Approved',
    },
  ];
});

const openModal = (eoi) => {
  selectedEoi.value = { ...eoi }; // Create a copy to avoid direct mutation
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEoi.value = null; // Clear the selected EOI after closing.  Important!
};

const approveEoi = (eoi) => {
  const index = eois.value.findIndex((e) => e.applicationId === eoi.applicationId);
  if (index !== -1) {
    const notes = prompt('Enter approval notes:');
    if (notes !== null) {
      // Use spread operator to create a new object and update the array reactively
      eois.value = [
        ...eois.value.slice(0, index),
        { ...eois.value[index], status: 'Approved', approvalNotes: notes },
        ...eois.value.slice(index + 1),
      ];
      closeModal();
      toast.success("Application approved successfully!"); //added toast messages
    } else {
      toast.error("Approval notes are required.");
    }
  }
};

const rejectEoi = (eoi) => {
  const index = eois.value.findIndex((e) => e.applicationId === eoi.applicationId);
  if (index !== -1) {
    const reason = prompt('Enter rejection reason:');
    if (reason !== null) {
      // Use spread operator to create a new object and update the array reactively
      eois.value = [
        ...eois.value.slice(0, index),
        { ...eois.value[index], status: 'Rejected', rejectionReason: reason },
        ...eois.value.slice(index + 1),
      ];
      closeModal();
      toast.success("Application rejected."); //added toast messages
    } else {
      toast.error("Rejection reason is required.");
    }
  }
};

const handleApplicationSubmitted = async () => {
  if (loading.value) return;

  loading.value = true;
  toast.info('Refreshing application list', {
    timeout: 2000,
  });
  // Simulate an API call (replace with your actual API call)
  try {
    //  const response = await fetch('/api/eois');
    //  eois.value = await response.json();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    toast.success('Application List refreshed', {
      timeout: 2000,
    });
  } catch (error) {
    toast.error('Failed to refresh application list'); //added error handling
    console.error('Error refreshing applications:', error);
  } finally {
    loading.value = false;
  }
};

const filteredEois = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return eois.value.filter((eoi) => {
    return (
      String(eoi.applicationId).toLowerCase().includes(query) ||
      eoi.instituteName.toLowerCase().includes(query)
    );
  });
});

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'Invalid Date';
  }
};

const getStatusClasses = (eoi) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': eoi.status === 'Submitted',
      'bg-green-100 text-green-800': eoi.status === 'Approved',
      'bg-red-100 text-red-800': eoi.status === 'Rejected',
    },
  ];
};
</script>

<style scoped>
/* Tailwind styles - no need for custom styles, Tailwind classes are used */
</style>
