<template>
  <div class="p-6">
    <!-- Page Header -->
    <h1 class="text-2xl font-bold mb-6">Institute Management</h1>

    <!-- Tabs for EOI, DPR, CAPA, Reports -->
    <div class="flex space-x-4 mb-6">
      <button
        @click="activeTab = 'eoi'"
        :class="tabClass('eoi')"
      >
        EOI Submissions
      </button>
      <button
        @click="activeTab = 'dpr'"
        :class="tabClass('dpr')"
      >
        DPR Submissions
      </button>
      <button
        @click="activeTab = 'capa'"
        :class="tabClass('capa')"
      >
        CAPA Management
      </button>
      <button
        @click="activeTab = 'reports'"
        :class="tabClass('reports')"
      >
        Reports
      </button>
    </div>

    <!-- EOI Submissions Tab -->
    <div v-if="activeTab === 'eoi'">
      <h2 class="text-xl font-bold mb-4">EOI Submissions</h2>
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Institute Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">EOI Status</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="institute in filteredEOIInstitutes"
              :key="institute.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ institute.name }}</td>
              <td class="px-6 py-4">{{ institute.location }}</td>
              <td class="px-6 py-4">
                <span :class="statusClass(institute.eoiStatus)">{{ institute.eoiStatus }}</span>
              </td>
              <td class="px-6 py-4 space-x-2">
                <button
                  @click="viewDetails(institute)"
                  class="text-blue-500 hover:underline"
                >
                  View
                </button>
                <button
                  @click="reviewEOI(institute)"
                  class="text-green-500 hover:underline"
                >
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- DPR Submissions Tab -->
<div v-if="activeTab === 'dpr'">
  <h2 class="text-xl font-bold mb-4">DPR Submissions</h2>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <table class="min-w-full">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Institute Name</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">DPR Status</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="institute in filteredDPRInstitutes"
          :key="institute.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-6 py-4">{{ institute.name }}</td>
          <td class="px-6 py-4">{{ institute.location }}</td>
          <td class="px-6 py-4">
            <span :class="statusClass(institute.dprStatus)">{{ institute.dprStatus }}</span>
          </td>
          <td class="px-6 py-4 space-x-2">
            <button
              @click="viewDetails(institute)"
              class="text-blue-500 hover:underline"
            >
              View
            </button>
            <button
              @click="downloadDPR(institute)"
              class="text-purple-500 hover:underline"
            >
              Download
            </button>
            <button
              @click="reviewDPR(institute)"
              class="text-green-500 hover:underline"
            >
              Review
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    <!-- CAPA Management Tab -->
    <div v-if="activeTab === 'capa'">
      <h2 class="text-xl font-bold mb-4">CAPA Management</h2>
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Institute Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pending CAPA Issues</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="institute in filteredCAPAInstitutes"
              :key="institute.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ institute.name }}</td>
              <td class="px-6 py-4">{{ institute.location }}</td>
              <td class="px-6 py-4">
                <span v-if="institute.capaIssues && institute.capaIssues.length > 0">
                  {{ institute.capaIssues.filter(issue => issue.status === 'Pending').length }} Pending
                </span>
                <span v-else>No Issues</span>
              </td>
              <td class="px-6 py-4">
                <ul>
                  <li v-for="(issue, index) in institute.capaIssues" :key="index">
                    <span v-if="issue.status === 'Resolved'">
                      {{ issue.remarks || 'No remarks provided.' }}
                    </span>
                  </li>
                </ul>
              </td>
              <td class="px-6 py-4 space-x-2">
                <button
                  @click="manageCAPA(institute)"
                  class="text-yellow-500 hover:underline"
                >
                  Manage CAPA
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reports Tab -->
    <div v-if="activeTab === 'reports'">
      <h2 class="text-xl font-bold mb-4">Reports</h2>

      <!-- Filters -->
      <div class="mb-6 flex items-center space-x-4">
        <input
          v-model="reportSearchQuery"
          type="text"
          placeholder="Search by institute name..."
          class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="reportFilterStatus"
          class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          @click="exportReport"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Export Report
        </button>
      </div>

      <!-- Report Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Institute Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">EOI Status</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">DPR Status</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pending CAPA Issues</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="institute in filteredReportInstitutes"
              :key="institute.id"
              class="border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ institute.name }}</td>
              <td class="px-6 py-4">{{ institute.location }}</td>
              <td class="px-6 py-4">
                <span :class="statusClass(institute.eoiStatus)">{{ institute.eoiStatus }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="statusClass(institute.dprStatus)">{{ institute.dprStatus }}</span>
              </td>
              <td class="px-6 py-4">
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
    <InstituteViewDetailsModal
      v-if="selectedInstitute"
      :institute="selectedInstitute"
      @close="selectedInstitute = null"
    />
    <InstituteReviewApplicationModal
      v-if="reviewingInstitute"
      :institute="reviewingInstitute"
      @approve="handleApprove"
      @reject="handleReject"
      @close="reviewingInstitute = null"
    />
    <InstituteManageCapaModal
      v-if="capaInstitute"
      :institute="capaInstitute"
      @update-capa="updateCAPAIssues"
      @close="capaInstitute = null"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import InstituteViewDetailsModal from './modals/InstituteViewDetailsModal.vue';
import InstituteReviewApplicationModal from './modals/InstituteReviewApplicationModal.vue';
import InstituteManageCapaModal from './modals/InstituteManageCapaModal.vue';

export default {
  name: 'InstituteManagement',
  components: {
    InstituteViewDetailsModal,
    InstituteReviewApplicationModal,
    InstituteManageCapaModal,
  },
  setup() {
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
      },
      {
        id: 2,
        name: 'ABC Institute',
        location: 'Paro',
        eoiStatus: 'Approved',
        dprStatus: 'Pending',
        capaIssues: [],
        details: 'Details about ABC Institute...',
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
        'text-green-500': status === 'Approved',
        'text-yellow-500': status === 'Pending',
        'text-red-500': status === 'Rejected',
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
      reviewingInstitute.value.rejectionReason = reason;
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
    };

    const tabClass = (tab) => {
      return activeTab.value === tab
        ? 'bg-blue-500 text-white px-4 py-2 rounded-lg'
        : 'bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300';
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

    return {
      activeTab,
      searchQuery,
      reportSearchQuery,
      reportFilterStatus,
      selectedInstitute,
      reviewingInstitute,
      capaInstitute,
      institutes,
      filteredEOIInstitutes,
      filteredDPRInstitutes,
      filteredCAPAInstitutes,
      filteredReportInstitutes,
      statusClass,
      viewDetails,
      reviewEOI,
      reviewDPR,
      manageCAPA,
      updateCAPAIssues,
      handleApprove,
      handleReject,
      exportReport,
      tabClass,
      downloadDPR,
    };
  },
};
</script>