<template>
  <div class="p-4">
    <!-- Header with Export Button -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-900">Chief's Report</h1>
      <button @click="downloadReport"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <i class="pi pi-download mr-2"></i>
        Export Report
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div v-for="(stat, index) in statsArray" :key="index"
        class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
          <component :is="stat.icon" class="w-4 h-4 text-gray-500" />
        </div>
        <p class="text-2xl font-bold">{{ stat.value }}</p>
        <p class="text-sm text-gray-500">{{ stat.trend }}</p>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select v-model="dateRange"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="Search applications..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <i class="pi pi-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                @click="sortBy(header.key)">
                {{ header.label }}
                <i v-if="sortKey === header.key"
                  :class="['pi', sortOrder === 'asc' ? 'pi-sort-up' : 'pi-sort-down', 'ml-1']">
                </i>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in paginatedData" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ app.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ app.applicant_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(app.submission_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ app.dealing_officer }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(app.status)">
                  {{ app.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ app.qec_number || '-' }}</td>
              <td class="px-6 py-4">
                <div class="truncate max-w-xs" :title="app.dealing_officer_remarks">
                  {{ app.dealing_officer_remarks || '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="truncate max-w-xs" :title="app.chief_remarks">
                  {{ app.chief_remarks || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ calculateProcessingDays(app) }} days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
          </div>
          <div class="flex gap-2">
            <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''">
              Previous
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { Clock, CheckCircle, XCircle, ClipboardList } from 'lucide-vue-next';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import apiService from '@/services/services';

const toast = useToast();

// Table headers configuration
const tableHeaders = [
  { key: 'id', label: 'Application ID' },
  { key: 'applicant_name', label: 'Applicant Name' },
  { key: 'submission_date', label: 'Submission Date' },
  { key: 'dealing_officer', label: 'Dealing Officer' },
  { key: 'status', label: 'Status' },
  { key: 'qec_number', label: 'QEC Number' },
  { key: 'dealing_officer_remarks', label: 'DO Remarks' },
  { key: 'chief_remarks', label: 'Chief Remarks' },
  { key: 'processing_time', label: 'Processing Time' }
];

// State
const applications = ref([]);
const searchQuery = ref('');
const dateRange = ref('all');
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref('submission_date');
const sortOrder = ref('desc');

// Computed properties
const stats = computed(() => {
  const total = applications.value.length;
  const approved = applications.value.filter(app => app.status === 'approved').length;
  const regretted = applications.value.filter(app => app.status === 'regretted').length;
  const pending = applications.value.filter(app =>
    app.status !== 'approved' && app.status !== 'regretted'
  ).length;

  return {
    total,
    approved,
    regretted,
    pending,
    approvalRate: total ? ((approved / total) * 100).toFixed(1) : 0
  };
});

const statsArray = computed(() => [
  {
    label: 'Total Reviews',
    value: stats.value.total,
    icon: ClipboardList,
    trend: 'All applications'
  },
  {
    label: 'Pending Review',
    value: stats.value.pending,
    icon: Clock,
    trend: 'Awaiting decision'
  },
  {
    label: 'Approved',
    value: stats.value.approved,
    icon: CheckCircle,
    trend: `${stats.value.approvalRate}% approval rate`
  },
  {
    label: 'Regretted',
    value: stats.value.regretted,
    icon: XCircle,
    trend: `${(100 - stats.value.approvalRate).toFixed(1)}% regret rate`
  }
]);

const dateRangeFilter = computed(() => {
  const now = new Date();
  switch (dateRange.value) {
    case 'today':
      return { start: subDays(now, 1), end: now };
    case 'week':
      return { start: startOfWeek(now), end: now };
    case 'month':
      return { start: startOfMonth(now), end: now };
    case 'year':
      return { start: startOfYear(now), end: now };
    default:
      return null;
  }
});

const filteredData = computed(() => {
  let filtered = [...applications.value];

  // Date range filter
  if (dateRangeFilter.value) {
    filtered = filtered.filter(app => {
      const appDate = new Date(app.submission_date);
      return isWithinInterval(appDate, dateRangeFilter.value);
    });
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app =>
      String(app.id).toLowerCase().includes(query) ||
      app.applicant_name?.toLowerCase().includes(query) ||
      app.dealing_officer?.toLowerCase().includes(query) ||
      app.status?.toLowerCase().includes(query) ||
      app.qec_number?.toLowerCase().includes(query) ||
      app.dealing_officer_remarks?.toLowerCase().includes(query) ||
      app.chief_remarks?.toLowerCase().includes(query)
    );
  }

  // Sort
  return filtered.sort((a, b) => {
    let aValue = a[sortKey.value];
    let bValue = b[sortKey.value];

    if (sortKey.value === 'submission_date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length));
const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value));

// Methods
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const calculateProcessingDays = (application) => {
  const submissionDate = new Date(application.submission_date);
  const completionDate = application.completion_date ?
    new Date(application.completion_date) : new Date();
  const diffTime = Math.abs(completionDate - submissionDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const getStatusClass = (status) => {
  const classes = {
    approved: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    regretted: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    processing: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
  };
  return classes[status] || 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
};

const downloadReport = () => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Chief\'s Applications Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 32);

  // Add statistics
  doc.setFontSize(16);
  doc.text('Summary Statistics', 14, 45);
  doc.setFontSize(12);
  let yPos = 55;
  Object.entries(stats.value).forEach(([key, value]) => {
    if (key !== 'approvalRate') {
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 14, yPos);
      yPos += 10;
    }
  });
  doc.text(`Approval Rate: ${stats.value.approvalRate}%`, 14, yPos);

  // Add applications table
  doc.autoTable({
    startY: yPos + 20,
    head: [['ID', 'Applicant', 'Submission Date', 'Dealing Officer', 'Status', 'QEC Number', 'DO Remarks', 'Chief Remarks', 'Processing Time']],
    body: applications.value.map(app => [
      app.id,
      app.applicant_name,
      formatDate(app.submission_date),
      app.dealing_officer,
      app.status,
      app.qec_number || '-',
      app.dealing_officer_remarks || '-',
      app.chief_remarks || '-',
      `${calculateProcessingDays(app)} days`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 35 },
      7: { cellWidth: 35 },
      8: { cellWidth: 20 }
    },
    styles: { overflow: 'linebreak' }
  });

  // Save the PDF
  doc.save(`chief_applications_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  toast.success('Report downloaded successfully');
};

// Fetch Data
const fetchApplications = async () => {
  try {
    loading.value = true;
    const response = await apiService.getRecognitionOfQualifications({
      status: "under_review",
      forward: true
    });
    applications.value = response.data.results;
  } catch (error) {
    console.error('Error fetching applications:', error);
    toast.error('Failed to load applications');
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>