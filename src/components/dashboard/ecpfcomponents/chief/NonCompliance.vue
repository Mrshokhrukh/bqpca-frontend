<!-- Parent Component (e.g., App.vue or NonCompliancePage_ChiefView.vue) -->
<template>
  <div class="p-8 min-h-screen">
    <div class="mx-auto">
      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Non-Compliance Records - Chief View</h2>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" v-model.trim="searchQuery" class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by ECPF Name, Category, or Description...">
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select v-model="categoryFilter" class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Categories</option>
              <option v-for="category in issueCategories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Non-Compliance Records Table - Chief View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ECPF Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Branch ECPF
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date of Non-Compliance
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category of Issue
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Brief Description of Non-Compliance
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action Taken
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  View Details
                </th> <!-- Added View Details column -->
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.ecpfName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.branchEcpf || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.dateOfNonCompliance }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="getCategoryClasses(record.categoryOfIssue)">
                    {{ record.categoryOfIssue }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ record.nonComplianceDetails }}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ record.actionTaken }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="viewRecord(record.id)" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                </td> <!-- View Details Button -->
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No non-compliance records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- View Non-Compliance Record Modal/Section -->
      <div v-if="viewingRecord" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div class="bg-white p-8 rounded shadow-md">
          <h2 class="text-xl font-bold mb-4">Non-Compliance Record Details</h2>
          <p><strong>ECPF Name:</strong> {{ viewingRecord.ecpfName }}</p>
          <p v-if="viewingRecord.branchEcpf"><strong>Branch ECPF:</strong> {{ viewingRecord.branchEcpf }}</p>
          <p><strong>Date of Non-Compliance:</strong> {{ viewingRecord.dateOfNonCompliance }}</p>
          <p><strong>Non-Compliance Details:</strong> {{ viewingRecord.nonComplianceDetails }}</p>
          <p><strong>Category of Issue:</strong> {{ viewingRecord.categoryOfIssue }}</p>
          <p><strong>Action:</strong> {{ viewingRecord.action }}</p>
          <p><strong>Action Taken:</strong> {{ viewingRecord.actionTaken }}</p>
          <p><strong>Corrective Measures Required:</strong> {{ viewingRecord.correctiveMeasuresRequired }}</p>
          <p><strong>Corrected Action Report:</strong> {{ viewingRecord.correctedActionReport }}</p>
          <div class="flex justify-end mt-4">
            <button @click="closeViewRecord" class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Close</button>
          </div>
        </div>
      </div>

      <!-- NonCompliance Modal Component - REMOVED -->
      <!--
      <NonComplianceModal
        v-if="showModal"
        :is-open="showModal"
        :editing-record="editingRecord"
        @save-record="handleSaveRecord"
        @cancel-modal="closeModal"
      />
      -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// import NonComplianceModal from './modals/NonComplianceModal.vue'; // NonComplianceModal Component - REMOVED

// Mock Data (Replace with API calls in a real application)
const nonComplianceRecords = ref([
  { id: 1, ecpfName: 'ECPF 2', branchEcpf: null, dateOfNonCompliance: '2024-07-20', nonComplianceDetails: 'Minor environmental breach', categoryOfIssue: 'Environmental', action: 'Warning Letter', actionTaken: 'Issued Warning Letter', correctiveMeasuresRequired: 'Improve waste management', correctedActionReport: 'Report submitted and reviewed' },
  { id: 2, ecpfName: 'Main ECPF 1', branchEcpf: 'Branch B', dateOfNonCompliance: '2024-07-15', nonComplianceDetails: 'HR policy violation', categoryOfIssue: 'HR', action: 'Corrective Action Plan', actionTaken: 'Corrective Action Plan Submitted', correctiveMeasuresRequired: 'Revise HR policy and training', correctedActionReport: 'Policy revised, training scheduled' },
  // Add more mock data with dateOfNonCompliance
]);

// State for Modal Visibility and Data - SIMPLIFIED, only keep viewingRecord
const viewingRecord = ref(null);

// Search and Filter State
const searchQuery = ref('');
const categoryFilter = ref('');
const issueCategories = ref(['Environmental', 'Social', 'Governance', 'HR', 'Operational']);

// Filtered Records Computed Property
const filteredRecords = computed(() => {
  const search = searchQuery.value.toLowerCase();
  const category = categoryFilter.value;

  return nonComplianceRecords.value.filter(record => {
    const matchesSearch =
      record.ecpfName.toLowerCase().includes(search) ||
      (record.branchEcpf && record.branchEcpf.toLowerCase().includes(search)) ||
      record.dateOfNonCompliance.includes(search) ||
      record.categoryOfIssue.toLowerCase().includes(search) ||
      record.nonComplianceDetails.toLowerCase().includes(search) ||
      record.actionTaken.toLowerCase().includes(search);

    const matchesCategory = !category || record.categoryOfIssue === category;

    return matchesSearch && matchesCategory;
  });
});


// --- Functions - SIMPLIFIED, only keep viewRecord and closeViewRecord ---

const viewRecord = (id) => {
  viewingRecord.value = nonComplianceRecords.value.find(record => record.id === id);
};

const closeViewRecord = () => {
  viewingRecord.value = null;
};


const getCategoryClasses = (category) => {
  return  [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-blue-100 text-blue-800': category === 'Environmental',
      'bg-yellow-100 text-yellow-800': category === 'HR',
      'bg-green-100 text-green-800': category === 'Operational',
      'bg-red-100 text-red-800': category === 'Governance',
      'bg-purple-100 text-purple-800': category === 'Social',
    }
  ];
};

</script>

<style scoped>
/* Table styles - Keep as is */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.filters input[type="search"],
.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  font-weight: bold;
}


.status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: bold;
  color: black;
}

.bg-blue-100.text-blue-800 { /* Environmental */ }
.bg-yellow-100.text-yellow-800 { /* HR */ }
.bg-green-100.text-green-800 { /* Operational */ }
.bg-red-100.text-red-800 { /* Governance */ }
.bg-purple-100.text-purple-800 { /* Social */ }

</style>