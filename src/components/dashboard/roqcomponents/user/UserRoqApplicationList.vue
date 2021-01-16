<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl font-serif font-bold text-slate-900">My Applications</h2>
      <button
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        @click="showModal = true">
        New Application
      </button>
    </div>

    <!-- Modal for New Application Form -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 shadow-xl max-w-3xl w-full relative">
        <button @click="showModal = false"
          class="absolute top-2 right-2 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300 transition-colors">x</button>
        <ApplicationForm @application-submitted="handleApplicationSubmitted" @close-modal="showModal = false" />
      </div>
    </div>

    <!-- Tabbed Navigation -->
    <div class="flex space-x-4 mb-4">
      <button v-for="tab in tabs" :key="tab.id" :class="{
        'px-4 py-2 rounded-md text-slate-600 hover:text-slate-900': true,
        'border-b-2 border-blue-600 font-bold': activeTab === tab.id,
      }" @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <!-- Application Table -->
    <ApplicationTable :applications="paginatedApplications" :current-page="currentPage" :total-results="filteredTotal"
      :per-page="perPage" @page-change="handlePageChange" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ApplicationForm from './ApplicationForm.vue';
import ApplicationTable from '@/components/dashboard/roqcomponents/ApplicationsTable.vue';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore';

const { user } = useAuthStore();
const showModal = ref(false);
const activeTab = ref('draft');
const currentPage = ref(1);
const perPage = ref(5);
const applications = ref([]);


const tabs = [
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'approved', label: 'Approved' },
  { id: 'suspended', label: 'Suspended' },
  { id: 'regretted', label: 'Regretted' },
];

// Computed Property for filtered Applications based on the activeTab
const filteredApplications = computed(() => {
  switch (activeTab.value) {
    case 'draft':
      return applications.value.filter(app => app.status === 'draft')
    case 'submitted':
      return applications.value.filter(app => app.status === 'submitted')
    case 'approved':
      return applications.value.filter(app => app.status === 'approved')
    case 'suspended':
      return applications.value.filter(app => app.status === 'suspended')
    case 'regretted':
      return applications.value.filter(app => app.status === 'regretted')
    default:
      return applications.value;
  }
})

// Compute total for pagination
const filteredTotal = computed(() => filteredApplications.value.length);

// Get paginated data
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  // Transform the data to match the table structure
  return filteredApplications.value.slice(start, end).map(app => ({
    id: app.id,
    date: app.date_of_birth,
    type: app.type_of_course,
    status: app.status,
  }));
});


// Method for closing the modal
const handleApplicationSubmitted = async () => {
  showModal.value = false
  await loadData()

}

// Load Data Function
const loadData = async () => {
  try {
    const response = await apiService.getRecognitions({
      email_address: user.email
    });
    applications.value = response.data.results
  } catch (error) {
    console.error('Error loading data:', error);
  }
}


// Page Change Handler
const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

onMounted(() => {
  loadData()
})
</script>