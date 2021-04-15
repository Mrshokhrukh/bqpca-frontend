<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">BMHC Reports Dashboard</h1>
      <div class="flex gap-4">
        <button @click="exportToExcel" class="btn-success" :disabled="isLoading">
          <span v-if="isLoading" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          📄 Export Excel
        </button>
        <button @click="exportToPDF" class="btn-danger" :disabled="isLoading">
          <span v-if="isLoading" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          📄 Export PDF
        </button>
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="mb-6">
      <select v-model="activeReport" class="report-type-selector" @change="handleReportTypeChange">
        <option v-for="report in reportTypes" :key="report.value" :value="report.value">
          {{ report.label }}
        </option>
      </select>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <!-- Global Search -->
      <div>
        <label class="filter-label">Global Search</label>
        <input v-model="filters.search" type="text" class="filter-input" placeholder="Search..."
          @input="debouncedFetchData">
      </div>

      <!-- Date Range -->
      <div>
        <label class="filter-label">Date Range</label>
        <div class="flex gap-2">
          <input v-model="filters.startDate" type="date" class="filter-input" @change="fetchData">
          <input v-model="filters.endDate" type="date" class="filter-input" @change="fetchData">
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="filter-label">Status</label>
        <select v-model="filters.status" class="filter-input" @change="fetchData">
          <option value="">All Statuses</option>
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="text-red-600 underline mt-2">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!reportData.length" class="bg-white rounded-lg shadow p-8 text-center">
      <p class="text-gray-500">No data available for the selected filters</p>
    </div>

    <!-- Report Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in activeHeaders" :key="header.key" class="table-header">
              <div class="flex items-center">
                {{ header.label }}
                <template v-if="header.sortable">
                  <button @click="handleSort(header.key)" class="ml-1 focus:outline-none">
                    <i :class="[
                      'fas',
                      sortBy === header.key
                        ? sortOrder === 'asc'
                          ? 'fa-sort-up'
                          : 'fa-sort-down'
                        : 'fa-sort'
                    ]"></i>
                  </button>
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in reportData" :key="item.id">
            <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
              <template v-if="header.key === 'status'">
                <span :class="statusBadge(item[header.key])">
                  {{ item[header.key] }}
                </span>
              </template>
              <template v-else-if="header.type === 'date'">
                {{ formatDate(item[header.key]) }}
              </template>
              <template v-else-if="header.type === 'currency'">
                {{ formatCurrency(item[header.key]) }}
              </template>
              <template v-else>
                {{ item[header.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <div class="text-sm text-gray-700">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }}
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading" class="pagination-btn">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import bmhcServices from '@/services/bmhcservices';

const toast = useToast();

// Constants
const ITEMS_PER_PAGE = 10;

const reportTypes = [
  { label: 'Registrations', value: 'registrations' },
  { label: 'Renewals', value: 'renewals' },
  { label: 'CPD Activities', value: 'cpd' },
  { label: 'CoGS Issuance', value: 'cogs' },
];

const headers = {
  registrations: [
    { key: 'registration_no', label: 'Reg Number', sortable: true },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true },
    { key: 'registration_type', label: 'Type', sortable: true },
    { key: 'registration_date', label: 'Reg Date', type: 'date', sortable: true },
    { key: 'expiry_date', label: 'Expiry Date', type: 'date', sortable: true },
    { key: 'application_review_status', label: 'Status', sortable: true },
    { key: 'payment_status', label: 'Payment Status', sortable: true }
  ],
  renewals: [
    { key: 'id', label: 'Renewal ID', sortable: true },
    { key: 'user_qualification.registration_no', label: 'Reg Number', sortable: true },
    { key: 'renewal_review_status', label: 'Status', sortable: true },
    { key: 'new_expiry_date', label: 'New Expiry Date', type: 'date', sortable: true },
    { key: 'created_at', label: 'Renewal Date', type: 'date', sortable: true }
  ],
  cpd: [
    { key: 'title_of_cpd', label: 'Activity Name', sortable: true },
    { key: 'credit', label: 'Credits', sortable: true },
    { key: 'number_of_participants', label: 'Participants', sortable: true },
    { key: 'from_date', label: 'Start Date', type: 'date', sortable: true },
    { key: 'to_date', label: 'End Date', type: 'date', sortable: true },
    { key: 'is_cpd_approved', label: 'Status', sortable: true }
  ],
  cogs: [
    { key: 'registration_no', label: 'CoGS Number', sortable: true },
    { key: 'full_name', label: 'Applicant Name', sortable: true },
    { key: 'cogs_approved_date', label: 'Issuance Date', type: 'date', sortable: true },
    { key: 'review_status', label: 'Status', sortable: true }
  ]
};

// Reactive State
const activeReport = ref('registrations');
const reportData = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalItems = ref(0);
const sortBy = ref('');
const sortOrder = ref('asc');

const filters = reactive({
  search: '',
  startDate: '',
  endDate: '',
  status: '',
});

// Computed Properties
const activeHeaders = computed(() => headers[activeReport.value]);
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE));
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);
const endIndex = computed(() => Math.min(startIndex.value + ITEMS_PER_PAGE, totalItems.value));

// API mapping object for different report types
const apiMethods = {
  registrations: {
    fetch: bmhcServices.getMhpcNewQualifications,
    transform: (data) => ({
      ...data,
      applicant_name: data.application?.full_name,
      payment_status: data.is_payment_complete ? 'Paid' : 'Unpaid'
    })
  },
  renewals: {
    fetch: bmhcServices.getMhpcRenewals,
    transform: (data) => ({
      ...data,
      renewal_id: `REN-${data.id}`
    })
  },
  cpd: {
    fetch: bmhcServices.getMhpcNewQualifications,
    transform: (data) => ({
      ...data,
      status: data.is_cpd_approved ? 'Approved' : 'Pending'
    })
  },
  cogs: {
    fetch: bmhcServices.getMhpcCogs,
    transform: (data) => ({
      ...data,
      cogs_number: `COGS-${data.registration_no}`
    })
  }
};

// Methods
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const params = {
      page: currentPage.value,
      page_size: ITEMS_PER_PAGE,
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
      search: filters.search,
      status: filters.status,
      ...filters.startDate && { start_date: filters.startDate },
      ...filters.endDate && { end_date: filters.endDate }
    };

    const response = await apiMethods[activeReport.value].fetch(params);

    reportData.value = response.data.results.map(item =>
      apiMethods[activeReport.value].transform(item)
    );
    totalItems.value = response.data.count;

  } catch (err) {
    error.value = 'Error fetching data. Please try again.';
    toast.error(error.value);
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Debounced search
const debouncedFetchData = debounce(fetchData, 300);

// Event Handlers
const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
  fetchData();
};

const handleReportTypeChange = () => {
  currentPage.value = 1;
  sortBy.value = '';
  sortOrder.value = 'asc';
  filters.search = '';
  filters.status = '';
  fetchData();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};

// Export Functions
const exportToExcel = async () => {
  try {
    isLoading.value = true;
    // Fetch all data for export
    const allData = await fetchAllData();

    const ws = XLSX.utils.json_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    // Generate and download Excel file
    XLSX.writeFile(wb, `${activeReport.value}_report_${formatDate(new Date())}.xlsx`);
    toast.success('Report exported successfully');
  } catch (err) {
    console.error('Export error:', err);
    toast.error('Failed to export report');
  } finally {
    isLoading.value = false;
  }
};

const exportToPDF = async () => {
  try {
    isLoading.value = true;
    const allData = await fetchAllData();

    const doc = new jsPDF();
    doc.setFont('helvetica');

    // Add title
    doc.setFontSize(16);
    doc.text(`${activeReport.value.toUpperCase()} Report`, 14, 15);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 25);

    // Create table
    const headers = activeHeaders.value.map(header => header.label);
    const data = allData.map(item =>
      activeHeaders.value.map(header => {
        const value = getNestedValue(item, header.key);
        if (header.type === 'date') {
          return formatDate(value);
        }
        return value?.toString() || '';
      })
    );

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`${activeReport.value}_report_${formatDate(new Date())}.pdf`);
    toast.success('Report exported successfully');
  } catch (err) {
    console.error('Export error:', err);
    toast.error('Failed to export report');
  } finally {
    isLoading.value = false;
  }
};

// Utility Functions
const fetchAllData = async () => {
  const allData = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const params = {
      page,
      page_size: 100, // Fetch in larger chunks for export
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
      search: filters.search,
      status: filters.status,
      ...filters.startDate && { start_date: filters.startDate },
      ...filters.endDate && { end_date: filters.endDate }
    };

    try {
      const response = await apiMethods[activeReport.value].fetch(params);
      const transformedData = response.data.results.map(item =>
        apiMethods[activeReport.value].transform(item)
      );
      allData.push(...transformedData);

      hasMore = response.data.next !== null;
      page++;
    } catch (err) {
      console.error('Error fetching all data:', err);
      throw err;
    }
  }

  return allData;
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatCurrency = (value) => {
  if (!value) return '-';
  return new Intl.NumberFormat('en-BT', {
    style: 'currency',
    currency: 'BTN'
  }).format(value);
};

const statusBadge = (status) => {
  const classes = {
    'Active': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Expired': 'bg-gray-100 text-gray-800'
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-800'}`;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

// Status options based on report type
const statusOptions = computed(() => {
  const options = {
    registrations: ['Pending', 'Approved', 'Rejected'],
    renewals: ['Pending', 'Approved', 'Rejected'],
    cpd: ['Pending', 'Approved', 'Rejected'],
    cogs: ['Pending', 'Approved', 'Rejected', 'Expired']
  };
  return options[activeReport.value] || [];
});

// Watch for filter changes
watch([activeReport], () => {
  handleReportTypeChange();
});

// Initialize data on mount
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.filter-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
}

.filter-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.table-header {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-cell {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #111827;
}

.btn-success {
  display: flex;
  align-items: center;
  background-color: #10B981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-success:hover:not(:disabled) {
  background-color: #059669;
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  display: flex;
  align-items: center;
  background-color: #EF4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background-color: #DC2626;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  background-color: white;
  transition: background-color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #F9FAFB;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.report-type-selector {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.report-type-selector:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>
