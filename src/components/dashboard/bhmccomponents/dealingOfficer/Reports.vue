<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">BMHC Reports Dashboard</h1>
      <div class="flex gap-4">
        <button @click="exportToExcel" class="btn-success">
          📄 Export Excel
        </button>
        <button @click="exportToPDF" class="btn-danger">
          📄 Export PDF
        </button>
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="mb-6">
      <select v-model="activeReport" class="report-type-selector">
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
        <input v-model="globalSearch" type="text" class="filter-input" placeholder="Search...">
      </div>

      <!-- Date Range -->
      <div>
        <label class="filter-label">Date Range</label>
        <div class="flex gap-2">
          <input v-model="dateRange.start" type="date" class="filter-input">
          <input v-model="dateRange.end" type="date" class="filter-input">
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="filter-label">Status</label>
        <select v-model="statusFilter" class="filter-input">
          <option value="all">All Statuses</option>
          <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>

      <!-- Type-Specific Filters -->
      <div v-if="activeReport === 'registrations'">
        <label class="filter-label">Registration Type</label>
        <select v-model="registrationTypeFilter" class="filter-input">
          <option value="all">All Types</option>
          <option>Full</option>
          <option>Temporary</option>
        </select>
      </div>
    </div>

    <!-- Report Table -->
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in activeHeaders" :key="header.key" class="table-header">
              <div class="flex items-center">
                {{ header.label }}
                <input v-if="header.filterable" 
                  v-model="columnFilters[header.key]"
                  type="text" 
                  class="column-filter-input"
                  :placeholder="`Filter ${header.label}`">
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in paginatedData" :key="item.id">
            <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
              <template v-if="header.key === 'status'">
                <span :class="statusBadge(item[header.key])">{{ item[header.key] }}</span>
              </template>
              <template v-else-if="header.key.includes('Date')">
                {{ formatDate(item[header.key]) }}
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
        Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }}
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="pagination.currentPage === 1" class="pagination-btn">
          Previous
        </button>
        <button @click="nextPage" :disabled="pagination.currentPage >= lastPage" class="pagination-btn">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';


const reports = reactive({
  registrations: [
    { id: 1, regNumber: 'BMHC-2023-001', applicantName: 'Dr. Sonam Wangchuk', type: 'Full', 
      regDate: '2023-01-15', expiryDate: '2028-01-15', status: 'Active', paymentStatus: 'Paid' },
    { id: 2, regNumber: 'BMHC-2023-002', applicantName: 'Dr. Dechen Zangmo', type: 'Temporary', 
      regDate: '2023-02-20', expiryDate: '2024-02-20', status: 'Pending', paymentStatus: 'Unpaid' },
    // Add more registration data...
  ],

  renewals: [
    { id: 1, renewalId: 'REN-2023-001', regNumber: 'BMHC-2018-005', cpdCredits: 45, 
      renewalDate: '2023-03-10', paymentAmount: 5000, status: 'Approved' },
    { id: 2, renewalId: 'REN-2023-002', regNumber: 'BMHC-2019-012', cpdCredits: 32, 
      renewalDate: '2023-04-15', paymentAmount: 5000, status: 'Pending' },
    // Add more renewal data...
  ],

  cpd: [
    { id: 1, activityId: 'CPD-2023-001', activityName: 'Advanced Cardiac Life Support', 
      credits: 15, participants: 25, activityDate: '2023-05-10', status: 'Approved' },
    { id: 2, activityId: 'CPD-2023-002', activityName: 'Modern Dental Practices', 
      credits: 10, participants: 15, activityDate: '2023-06-20', status: 'Pending' },
    // Add more CPD data...
  ],

  cogs: [
    { id: 1, cogsNumber: 'COGS-2023-001', applicantName: 'Dr. Karma Dorji', 
      issuanceDate: '2023-03-01', validUntil: '2024-03-01', status: 'Issued' },
    { id: 2, cogsNumber: 'COGS-2023-002', applicantName: 'Dr. Pema Choden', 
      issuanceDate: null, validUntil: null, status: 'Under Review' },
    // Add more CoGS data...
  ],

  payments: [
    { id: 1, transactionId: 'PAY-2023-001', amount: 5000, 
      paymentDate: '2023-01-05', status: 'Success', method: 'Online' },
    { id: 2, transactionId: 'PAY-2023-002', amount: 3000, 
      paymentDate: '2023-02-10', status: 'Pending', method: 'Manual' },
    // Add more payment data...
  ]
});

const reportTypes = [
  { label: 'Registrations', value: 'registrations' },
  { label: 'Renewals', value: 'renewals' },
  { label: 'CPD Activities', value: 'cpd' },
  { label: 'CoGS Issuance', value: 'cogs' },
  { label: 'Payments', value: 'payments' }
];

const headers = {
  registrations: [
    { key: 'regNumber', label: 'Reg Number', filterable: true },
    { key: 'applicantName', label: 'Applicant Name', filterable: true },
    { key: 'type', label: 'Type', filterable: true },
    { key: 'regDate', label: 'Reg Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'status', label: 'Status', filterable: true },
    { key: 'paymentStatus', label: 'Payment Status' }
  ],
  renewals: [
    { key: 'renewalId', label: 'Renewal ID', filterable: true },
    { key: 'regNumber', label: 'Reg Number', filterable: true },
    { key: 'cpdCredits', label: 'CPD Credits' },
    { key: 'renewalDate', label: 'Renewal Date' },
    { key: 'paymentAmount', label: 'Amount' },
    { key: 'status', label: 'Status', filterable: true }
  ],
  cpd: [
    { key: 'activityId', label: 'Activity ID', filterable: true },
    { key: 'activityName', label: 'Activity Name', filterable: true },
    { key: 'credits', label: 'Credits' },
    { key: 'participants', label: 'Participants' },
    { key: 'activityDate', label: 'Date' },
    { key: 'status', label: 'Status', filterable: true }
  ],
  cogs: [
    { key: 'cogsNumber', label: 'CoGS Number', filterable: true },
    { key: 'applicantName', label: 'Applicant Name', filterable: true },
    { key: 'issuanceDate', label: 'Issuance Date' },
    { key: 'validUntil', label: 'Valid Until' },
    { key: 'status', label: 'Status', filterable: true }
  ],
  payments: [
    { key: 'transactionId', label: 'Transaction ID', filterable: true },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentDate', label: 'Date' },
    { key: 'method', label: 'Method', filterable: true },
    { key: 'status', label: 'Status', filterable: true }
  ]
};

// Reactive State
const activeReport = ref('registrations');
const globalSearch = ref('');
const dateRange = reactive({ start: '', end: '' });
const statusFilter = ref('all');
const columnFilters = reactive({});
const registrationTypeFilter = ref('all');
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

// Computed Properties
const activeHeaders = computed(() => headers[activeReport.value]);

const filteredData = computed(() => {
  let data = reports[activeReport.value];
  
  // Apply filters
  data = data.filter(item => {
    const matchesColumnFilters = Object.entries(columnFilters).every(([key, value]) => {
      if (!value) return true;
      return String(item[key]).toLowerCase().includes(value.toLowerCase());
    });

    const matchesGlobalSearch = !globalSearch.value || 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(globalSearch.value.toLowerCase())
      );

    const matchesDateRange = (!dateRange.start || !dateRange.end) || (
      new Date(item.date) >= new Date(dateRange.start) &&
      new Date(item.date) <= new Date(dateRange.end)
    );

    const matchesStatus = statusFilter.value === 'all' || 
      item.status === statusFilter.value;

    const matchesRegistrationType = registrationTypeFilter.value === 'all' ||
      item.type === registrationTypeFilter.value;

    return matchesColumnFilters && matchesGlobalSearch && 
           matchesDateRange && matchesStatus && matchesRegistrationType;
  });

  return data;
});

const paginatedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const end = start + pagination.perPage;
  return filteredData.value.slice(start, end);
});

watch(filteredData, (newValue) => {
  pagination.total = newValue.length;
});

const statusOptions = computed(() => {
  const statuses = new Set();
  reports[activeReport.value].forEach(item => statuses.add(item.status));
  return Array.from(statuses);
});

const statusBadge = (status) => {
  const classes = {
    'Active': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-blue-100 text-blue-800',
    'Issued': 'bg-purple-100 text-purple-800',
    'Success': 'bg-green-100 text-green-800',
    'Under Review': 'bg-orange-100 text-orange-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB');
};

// Pagination
const lastPage = computed(() => Math.ceil(pagination.total / pagination.perPage));
const prevPage = () => pagination.currentPage > 1 && pagination.currentPage--;
const nextPage = () => pagination.currentPage < lastPage.value && pagination.currentPage++;

// Export Functions
const exportToExcel = () => console.log('Exporting to Excel...');
const exportToPDF = () => console.log('Exporting to PDF...');
</script>

<style scoped>
.filter-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.filter-input {
  @apply w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

.btn-success {
  @apply flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors;
}

.btn-danger {
  @apply flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors;
}

.pagination-btn {
  @apply px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.column-filter-input {
  @apply ml-2 p-1 text-xs border rounded w-24 focus:ring-1 focus:ring-blue-500;
}

.report-type-selector {
  @apply block w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>