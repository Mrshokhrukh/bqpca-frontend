<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Institute Management</h1>
        <p class="text-gray-600">Manage EOIs, DPRs, CAPAs, and generate reports for institutes.</p>
      </div>

      <!-- Tabs for EOI, DPR, CAPA, Reports -->
      <div class="flex space-x-4 mb-6">
        <button @click="activeTab = 'eoi'" :class="tabClass('eoi')">EOI Submissions</button>
        <button @click="activeTab = 'dpr'" :class="tabClass('dpr')">DPR Submissions</button>
        <button @click="activeTab = 'capa'" :class="tabClass('capa')">CAPA Management</button>
        <button @click="activeTab = 'reports'" :class="tabClass('reports')">Reports</button>
      </div>

      <!-- EOI Submissions Tab -->
      <div v-if="activeTab === 'eoi'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">EOI Submissions</h2>
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute
                  Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EOI Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="institute in filteredEOIInstitutes" :key="institute.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.location }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(institute.eoiStatus)}`">{{
          institute.eoiStatus }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button @click="viewDetails(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                  <button @click="reviewEOI(institute)"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- DPR Submissions Tab -->
      <div v-if="activeTab === 'dpr'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">DPR Submissions</h2>
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute
                  Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPR Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="institute in filteredDPRInstitutes" :key="institute.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.location }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(institute.dprStatus)}`">{{
          institute.dprStatus }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button @click="viewDetails(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                  <button @click="downloadDPR(institute)"
                    class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Download</button>
                  <button @click="reviewDPR(institute)"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CAPA Management Tab -->
      <div v-if="activeTab === 'capa'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">CAPA Management</h2>
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute
                  Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending CAPA
                  Issues</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="institute in filteredCAPAInstitutes" :key="institute.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.location }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span v-if="institute.capaIssues && institute.capaIssues.length > 0">
                    {{ institute.capaIssues.filter(issue => issue.status === 'Pending').length }} Pending
                  </span>
                  <span v-else>No Issues</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <ul>
                    <li v-for="(issue, index) in institute.capaIssues" :key="index">
                      <span v-if="issue.status === 'Resolved'">
                        {{ issue.remarks || 'No remarks provided.' }}
                      </span>
                    </li>
                  </ul>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button @click="manageCAPA(institute)"
                    class="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Manage
                    CAPA</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reports Tab -->
      <div v-if="activeTab === 'reports'">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Reports</h2>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-md p-4 mb-6">
          <div class="flex items-center space-x-4">
            <input v-model="reportSearchQuery" type="text" placeholder="Search by institute name..."
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            <select v-model="reportFilterStatus"
              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button @click="exportReport"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Export
              Report</button>
          </div>
        </div>

        <!-- Report Table -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute
                  Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EOI Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPR Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending CAPA
                  Issues</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="institute in filteredReportInstitutes" :key="institute.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.location }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass(institute.eoiStatus)}`">{{
          institute.eoiStatus }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="statusClass(institute.dprStatus)">{{ institute.dprStatus }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span v-if="institute.capaIssues && institute.capaIssues.length > 0">
                    {{ institute.capaIssues.filter(issue => issue.status === 'Pending').length }} Pending
                  </span>
                  <span v-else>No Issues</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modals -->
      <InstituteViewDetailsModal v-if="selectedInstitute" :institute="selectedInstitute"
        @close="selectedInstitute = null" />
      <InstituteReviewApplicationModal v-if="reviewingInstitute" :institute="reviewingInstitute"
        @approve="handleApprove" @reject="handleReject" @close="reviewingInstitute = null" />
      <InstituteManageCapaModal v-if="capaInstitute" :institute="capaInstitute" @update-capa="updateCAPAIssues"
        @close="capaInstitute = null" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InstituteViewDetailsModal from '../modals/InstituteViewDetailsModal.vue';
import InstituteReviewApplicationModal from '../modals/InstituteReviewApplicationModal.vue';
import InstituteManageCapaModal from '../modals/InstituteManageCapaModal.vue';

const activeTab = ref('eoi'); // Default tab
const searchQuery = ref('');
const reportSearchQuery = ref('');
const reportFilterStatus = ref('');
const selectedInstitute = ref(null);
const reviewingInstitute = ref(null);
const capaInstitute = ref(null);

const institutes = ref([
  {
    id: 1,
    name: 'XYZ Institute',
    location: 'Thimphu',
    eoiStatus: 'Pending',
    dprStatus: 'Pending',
    capaIssues: [
      { description: 'Inadequate facilities', status: 'Pending', remarks: '', timestamp: '2023-10-01' },
    ],
    details: 'Details about XYZ Institute...',
    dprDocument: 'https://example.com/dpr1.pdf',
  },
  {
    id: 2,
    name: 'ABC Institute',
    location: 'Paro',
    eoiStatus: 'Approved',
    dprStatus: 'Pending',
    capaIssues: [],
    details: 'Details about ABC Institute...',
    dprDocument: 'https://example.com/dpr2.pdf',
  },
  {
    id: 3,
    name: 'DEF Institute',
    location: 'Phuentsholing',
    eoiStatus: 'Rejected',
    dprStatus: 'N/A',
    capaIssues: [
      { description: 'Staff training required', status: 'Resolved', remarks: 'Training completed on 2023-09-20.', timestamp: '2023-09-15', resolvedTimestamp: '2023-09-20' },
    ],
    details: 'Details about DEF Institute...',
  },
]);

const filteredEOIInstitutes = computed(() => {
  return institutes.value.filter((institute) =>
    institute.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredDPRInstitutes = computed(() => {
  return institutes.value.filter((institute) =>
    institute.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredCAPAInstitutes = computed(() => {
  return institutes.value.filter((institute) =>
    institute.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredReportInstitutes = computed(() => {
  return institutes.value
    .filter((institute) =>
      institute.name.toLowerCase().includes(reportSearchQuery.value.toLowerCase())
    )
    .filter((institute) =>
      reportFilterStatus.value
        ? institute.eoiStatus === reportFilterStatus.value || institute.dprStatus === reportFilterStatus.value
        : true
    );
});

const statusClass = (status) => {
  return {
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-red-100 text-red-800': status === 'Rejected',
  };
};

const viewDetails = (institute) => {
  selectedInstitute.value = institute;
};

const reviewEOI = (institute) => {
  reviewingInstitute.value = institute;
};

const reviewDPR = (institute) => {
  reviewingInstitute.value = institute;
};

const manageCAPA = (institute) => {
  capaInstitute.value = institute;
};

const updateCAPAIssues = (updatedIssues) => {
  const institute = institutes.value.find((inst) => inst.id === capaInstitute.value.id);
  if (institute) {
    institute.capaIssues = updatedIssues;
  }
};

const handleApprove = () => {
  if (reviewingInstitute.value.eoiStatus === 'Pending') {
    reviewingInstitute.value.eoiStatus = 'Approved';
  } else if (reviewingInstitute.value.dprStatus === 'Pending') {
    reviewingInstitute.value.dprStatus = 'Approved';
  }
  reviewingInstitute.value = null;
};

const handleReject = (reason) => {
  if (reviewingInstitute.value.eoiStatus === 'Pending') {
    reviewingInstitute.value.eoiStatus = 'Rejected';
  } else if (reviewingInstitute.value.dprStatus === 'Pending') {
    reviewingInstitute.value.dprStatus = 'Rejected';
  }
  reviewingInstitute.value.rejectionReason = reason; // Make sure this property exists in your institute objects
  reviewingInstitute.value = null;
};

const exportReport = () => {
  const filteredData = filteredReportInstitutes.value.map((institute) => ({
    name: institute.name,
    location: institute.location,
    eoiStatus: institute.eoiStatus,
    dprStatus: institute.dprStatus,
    pendingCAPA: institute.capaIssues.filter((issue) => issue.status === 'Pending').length,
  }));

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    filteredData
      .map((row) => Object.values(row).join(','))
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'institute_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up after download.
};

const tabClass = (tab) => {
  return activeTab.value === tab
    ? 'bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200'
    : 'bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200';
};

const downloadDPR = (institute) => {
  if (institute.dprDocument) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = institute.dprDocument;
    link.target = '_blank';
    link.download = `DPR_${institute.name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('DPR document not available for download');
  }
};
</script>
