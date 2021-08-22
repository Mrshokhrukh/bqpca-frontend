<template>
  <!-- Your entire <template> section remains unchanged. -->
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">EPC Applications & Reports</h1>
      <div class="flex gap-4">
        <button @click="exportToCSV" class="btn-primary" :disabled="isLoading || !reportData.length || isLoadingExport">
          <span v-if="isLoadingExport" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          📄 Export CSV
        </button>
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="mb-6">
      <label for="report-type" class="filter-label">Select Application / Report Type</label>
      <select id="report-type" v-model="activeReport" class="report-type-selector" @change="handleReportTypeChange">
        <option value="" disabled>-- Select a Report Type --</option>
        <optgroup label="Applications">
          <option value="new_applications">New Applications</option>
          <option value="additional_applications">Additional Applications</option>
          <option value="renewal_applications">Renewal Applications</option>
        </optgroup>
        <optgroup label="CoGS">
          <option value="cogs_management">CoGS Management</option>
        </optgroup>
        <optgroup label="CPD Management">
          <option value="cpd_review">CPD Applications Review</option>
          <option value="cpd_self_assessed">Self Assessed CPD Applications</option>
        </optgroup>
        <optgroup label="Institute Management">
          <option value="eoi_applications">EOI Applications</option>
          <option value="dpr_applications">DPR Applications</option>
          <option value="capa_management">CAPA Management</option>
        </optgroup>
      </select>
    </div>

    <!-- Filters -->
    <div v-if="activeReport"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">

      <!-- Global Search -->
      <div>
        <label for="global-search" class="filter-label">Global Search</label>
        <input id="global-search" v-model="filters.search" type="text" class="filter-input"
          placeholder="Search across fields..." @input="debouncedFetchData" />
      </div>

      <!-- Date Range -->
      <div>
        <label class="filter-label">Date Range (Created/Submitted)</label>
        <div class="grid grid-cols-2 gap-2">
          <input v-model="filters.startDate" type="date" class="filter-input" @change="applyFilters"
            :max="filters.endDate || undefined" />
          <input v-model="filters.endDate" type="date" class="filter-input" @change="applyFilters"
            :min="filters.startDate || undefined" />
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status-filter" class="filter-label">Status</label>
        <select id="status-filter" v-model="filters.status" class="filter-input" @change="applyFilters"
          :disabled="!statusOptions.length">
          <option value="">All Statuses</option>
          <option v-if="!statusOptions.length" value="" disabled>No statuses for this type</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <div class="flex items-end">
        <button @click="clearFilters" class="btn-secondary w-full h-[42px]">Clear Filters</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !isLoadingExport" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      <p class="ml-4 text-gray-600">Loading Report Data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center shadow">
      <p class="text-red-800 font-semibold text-lg">Failed to Load Report</p>
      <p class="text-red-700 mt-2">{{ error }}</p>
      <button @click="fetchData()"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 text-sm font-medium">
        <i class="fas fa-redo mr-1"></i> Try Again
      </button>
    </div>

    <!-- Initial State (No Report Selected) -->
    <div v-else-if="!activeReport" class="text-center py-16 text-gray-500">
      <i class="fas fa-info-circle fa-2x mb-3"></i>
      <p>Please select a report type above to get started.</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!reportData.length && !isLoading"
      class="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No Data Found</h3>
      <p class="mt-1 text-sm text-gray-500">
        No records match the current report type and selected filters.
      </p>
    </div>

    <!-- Report Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th v-for="header in activeHeaders" :key="header.key" scope="col" class="table-header group"
              :class="{ 'cursor-pointer hover:bg-gray-200': header.sortable }"
              @click="header.sortable ? handleSort(header.key) : null">
              <div class="flex items-center justify-between">
                <span>{{ header.label }}</span>
                <template v-if="header.sortable">
                  <span class="ml-2 text-gray-400 group-hover:text-gray-600">
                    <i :class="[
                      'fas',
                      sortBy === header.key || (header.backendSortKey && sortBy === header.backendSortKey)
                        ? sortOrder === 'asc'
                          ? 'fa-sort-up text-gray-700'
                          : 'fa-sort-down text-gray-700'
                        : 'fa-sort',
                    ]"></i>
                  </span>
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in reportData" :key="item.id || `report-item-${index}`"
            class="hover:bg-gray-50 transition duration-150">
            <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
              <template v-if="header.isStatusColumn">
                <span :class="statusBadge(getNestedValue(item, header.key))">
                  {{ getNestedValue(item, header.key) ?? 'N/A' }}
                </span>
              </template>
              <template v-else-if="header.type === 'date'">
                {{ formatDate(getNestedValue(item, header.key)) }}
              </template>
              <template v-else>
                {{ getNestedValue(item, header.key) ?? 'N/A' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && !error && reportData.length && activeReport"
      class="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="text-sm text-gray-700 mb-2 sm:mb-0">
        Showing <span class="font-medium">{{ (currentPage - 1) * ITEMS_PER_PAGE + 1 }}</span> to
        <span class="font-medium">{{ Math.min(currentPage * ITEMS_PER_PAGE, totalItems) }}</span>
        of <span class="font-medium">{{ totalItems }}</span> results
      </div>
      <div v-if="totalPages > 1" class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">
          <i class="fas fa-chevron-left mr-1 text-xs"></i> Previous
        </button>
        <span class="px-4 py-1 text-sm font-medium text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading" class="pagination-btn">
          Next <i class="fas fa-chevron-right ml-1 text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import debounce from 'lodash/debounce';
import Papa from 'papaparse';
// Corrected import path assuming services.js is in src/services
import apiServices from '@/services/services.js';

const toast = useToast();

const ITEMS_PER_PAGE = 10;
const activeReport = ref('');
const reportData = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
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

const headers = {
  new_applications: [
    { key: 'id', label: 'App ID', sortable: true },
    { key: 'full_name', label: 'Applicant Name', sortable: true },
    { key: 'registration_no', label: 'Reg Number', sortable: true },
    { key: 'created_at', label: 'Submitted', type: 'date', sortable: true },
    { key: 'status', label: 'Status', isStatusColumn: true, sortable: false },
  ],
  additional_applications: [
    { key: 'id', label: 'App ID', sortable: true },
    { key: 'application_display.registration_no', label: 'Original Reg #', sortable: true, backendSortKey: 'application__registration_no' },
    { key: 'application_display.full_name', label: 'Applicant Name', sortable: true, backendSortKey: 'application__full_name' },
    { key: 'created_at', label: 'Submitted', type: 'date', sortable: true },
    { key: 'application_review_status', label: 'Status', sortable: true, isStatusColumn: true },
  ],
  renewal_applications: [
    { key: 'id', label: 'Renewal ID', sortable: true },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true, backendSortKey: 'application__full_name' },
    { key: 'registration_no', label: 'Reg Number', sortable: true, backendSortKey: 'application__registration_no' },
    { key: 'renewal_review_status', label: 'Status', isStatusColumn: true, sortable: true },
    { key: 'current_expiry', label: 'Current Expiry', type: 'date', sortable: false },
    { key: 'new_expiry_date', label: 'New Expiry', type: 'date', sortable: true },
    { key: 'created_at', label: 'Applied On', type: 'date', sortable: true },
  ],
  cogs_management: [
    { key: 'id', label: 'CoGS ID', sortable: true },
    { key: 'full_name', label: 'Applicant Name', sortable: true },
    { key: 'department.name', label: 'Department', sortable: true, backendSortKey: 'department__name' },
    { key: 'created_at', label: 'Issued On', type: 'date', sortable: true },
    { key: 'payment_status', label: 'Payment', isStatusColumn: true, sortable: true },
    { key: 'endorsement_decision', label: 'Status', isStatusColumn: true, sortable: true },
  ],
  cpd_review: [
    { key: 'id', label: 'Task ID', sortable: true },
    { key: 'title_of_cpd', label: 'Activity Name', sortable: true },
    { key: 'full_name', label: 'Provider', sortable: true },
    { key: 'credit', label: 'Credits', sortable: true },
    { key: 'from_date', label: 'Start Date', type: 'date', sortable: true },
    { key: 'to_date', label: 'End Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', isStatusColumn: true, sortable: true },
  ],
  cpd_self_assessed: [
    { key: 'id', label: 'Record ID', sortable: true },
    { key: 'registration_no.registration_no', label: 'Applicant Reg #', sortable: true, backendSortKey: 'registration_no__registration_no' },
    { key: 'title_of_cpd', label: 'Activity', sortable: true },
    { key: 'cpd_credit', label: 'Claimed Credits', sortable: true },
    { key: 'created_at', label: 'Submitted', type: 'date', sortable: true },
    { key: 'review_status', label: 'Status', isStatusColumn: true, sortable: true },
  ],
  eoi_applications: [
    { key: 'id', label: 'EOI ID', sortable: true },
    { key: 'name_of_institution', label: 'Institute Name', sortable: true },
    { key: 'title_of_course', label: 'Program', sortable: true },
    { key: 'created_at', label: 'Submitted', type: 'date', sortable: true },
    { key: 'review_decision', label: 'Status', isStatusColumn: true, sortable: true },
  ],
  dpr_applications: [
    { key: 'id', label: 'DPR ID', sortable: true },
    { key: 'name_of_institution', label: 'Institute Name', sortable: true },
    { key: 'dpr_name', label: 'Project Title', sortable: true },
    { key: 'created_at', label: 'Submitted', type: 'date', sortable: true },
    { key: 'do_dpr_review_decision', label: 'Status', isStatusColumn: true, sortable: true },
  ],
  capa_management: [
    { key: 'id', label: 'CAPA ID', sortable: true },
    { key: 'institute.name_of_institution', label: 'Institute', sortable: true, backendSortKey: 'institute__name_of_institution' },
    { key: 'root_cause', label: 'Issue', sortable: false },
    { key: 'inspection_from_date', label: 'Assigned', type: 'date', sortable: true },
    { key: 'inspection_to_date', label: 'Due Date', type: 'date', sortable: true },
    { key: 'status_display', label: 'Status', isStatusColumn: true, backendSortKey: 'status', sortable: true },
  ],
};

// =======================================================================
// === THIS IS THE ONLY CHANGE IN THE SCRIPT =============================
// =======================================================================
const apiMethods = {
  new_applications: {
    fetch: apiServices.getEpcNewApplications,
    transform: (data) => ({ ...data, status: data.is_active ? 'Approved' : (data.user_qualifications?.[0]?.application_review_status || 'Pending Review') }),
  },
  additional_applications: {
    // CORRECTED: Point this to the new, dedicated API service function.
    fetch: apiServices.getEpcAdditionalQualificationsReport,
    transform: (data) => data,
  },
  renewal_applications: {
    fetch: apiServices.getEpcRenewals,
    transform: (data) => ({ ...data, applicant_name: data.application?.full_name ?? 'N/A', registration_no: data.application?.registration_no ?? 'N/A', current_expiry: data.user_qualification_display?.split(' - ').pop() }),
  },
  cogs_management: { fetch: apiServices.getEpcCogs, transform: (data) => data },
  cpd_review: { fetch: apiServices.getEpcCpdTasks, transform: (data) => data },
  cpd_self_assessed: { fetch: apiServices.getEpcCpdRecords, transform: (data) => data },
  eoi_applications: { fetch: apiServices.getEpcInstitutes, transform: (data) => data },
  dpr_applications: { fetch: apiServices.getEpcInstitutes, transform: (data) => data },
  capa_management: { fetch: apiServices.getEpcCapas, transform: (data) => data },
};
// =======================================================================
// =======================================================================


const statusOptions = computed(() => {
  const optionsMap = {
    new_applications: [ { value: 'Pending Review', label: 'Pending Review' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' } ],
    additional_applications: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Regretted', label: 'Regretted' } ],
    renewal_applications: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Regretted', label: 'Regretted' } ],
    cogs_management: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Regretted', label: 'Regretted' } ],
    cpd_review: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }, { value: 'Draft', label: 'Draft' } ],
    cpd_self_assessed: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' } ],
    eoi_applications: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' } ],
    dpr_applications: [ { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' } ],
    capa_management: [ { value: 'P', label: 'Pending' }, { value: 'R', label: 'Resolved' } ],
  };
  return optionsMap[activeReport.value] || [];
});

const activeHeaders = computed(() => headers[activeReport.value] || []);
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE));

const getNestedValue = (obj, path) => {
  if (!path || typeof path !== 'string') return obj;
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  } catch (error) {
    console.warn(`Could not get nested value for path "${path}"`, obj);
    return undefined;
  }
};

const fetchData = async () => {
  if (!activeReport.value) {
    reportData.value = [];
    totalItems.value = 0;
    return;
  }
  isLoading.value = true;
  error.value = null;
  const currentApiMethod = apiMethods[activeReport.value];
  if (!currentApiMethod?.fetch) {
    error.value = `Report type "${activeReport.value}" is not configured correctly.`;
    toast.error(error.value);
    isLoading.value = false;
    return;
  }

  const sortHeader = activeHeaders.value.find((h) => h.key === sortBy.value);
  const backendSortKey = sortHeader?.backendSortKey || sortBy.value;

  try {
    const params = {
      page: currentPage.value,
      page_size: ITEMS_PER_PAGE,
      ordering: backendSortKey ? `${sortOrder.value === 'desc' ? '-' : ''}${backendSortKey}` : undefined,
      search: filters.search || undefined,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
      status: filters.status || undefined,
    };
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

    const response = await currentApiMethod.fetch(params);
    if (response.data && Array.isArray(response.data.results)) {
      reportData.value = response.data.results.map(item => currentApiMethod.transform ? currentApiMethod.transform(item) : item);
      totalItems.value = response.data.count ?? 0;
    } else {
      reportData.value = [];
      totalItems.value = 0;
    }
  } catch (err) {
    error.value = `Failed to load data. ${err.response?.data?.detail || err.message}`;
    toast.error(error.value);
    reportData.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  fetchData();
};

const debouncedFetchData = debounce(applyFilters, 500);

const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1;
  fetchData();
};

const handleReportTypeChange = () => {
  currentPage.value = 1;
  sortBy.value = '';
  sortOrder.value = 'asc';
  Object.assign(filters, { search: '', startDate: '', endDate: '', status: '' });
  reportData.value = [];
  totalItems.value = 0;
  error.value = null;
  fetchData();
};

const clearFilters = () => {
  Object.assign(filters, { search: '', startDate: '', endDate: '', status: '' });
  sortBy.value = '';
  sortOrder.value = 'asc';
  currentPage.value = 1;
  fetchData();
};

const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchData(); } };
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchData(); } };

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.error('Date format error:', e);
    return '-';
  }
};

const statusBadge = (status) => {
  const lowerStatus = String(status ?? '').toLowerCase().trim().replace(/_/g, ' ');
  let base = 'px-2.5 py-0.5 rounded-full text-xs font-medium inline-block whitespace-nowrap border';
  if (lowerStatus.includes('approved') || lowerStatus === 'paid' || lowerStatus === 'active' || lowerStatus === 'completed' || lowerStatus === 'resolved') return `${base} bg-green-100 text-green-800 border-green-200`;
  if (lowerStatus.includes('pending') || lowerStatus.includes('review') || lowerStatus === 'p') return `${base} bg-yellow-100 text-yellow-800 border-yellow-200`;
  if (lowerStatus.includes('rejected') || lowerStatus.includes('regretted')) return `${base} bg-red-100 text-red-800 border-red-200`;
  return `${base} bg-gray-100 text-gray-700 border-gray-200`;
};

// --- Export logic (no changes needed) ---
const exportToCSV = async () => {
    if (isLoading.value || !reportData.value.length) {
        toast.warning("No data to export or data is still loading.");
        return;
    }
    isLoadingExport.value = true;
    try {
        const allData = [];
        const totalExportPages = Math.ceil(totalItems.value / 100); // Fetch in chunks of 100
        toast.info(`Exporting ${totalItems.value} records. This may take a moment...`, { timeout: 5000 });

        const currentApiMethod = apiMethods[activeReport.value];
        const sortHeader = activeHeaders.value.find((h) => h.key === sortBy.value);
        const backendSortKey = sortHeader?.backendSortKey || sortBy.value;

        for (let page = 1; page <= totalExportPages; page++) {
            const params = {
                page,
                page_size: 100,
                ordering: backendSortKey ? `${sortOrder.value === 'desc' ? '-' : ''}${backendSortKey}` : undefined,
                search: filters.search || undefined,
                start_date: filters.startDate || undefined,
                end_date: filters.endDate || undefined,
                status: filters.status || undefined,
            };
            Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);

            const response = await currentApiMethod.fetch(params);
            const transformedData = response.data.results.map(item => currentApiMethod.transform ? currentApiMethod.transform(item) : item);
            allData.push(...transformedData);
        }

        const dataForCsv = allData.map(item => {
            const row = {};
            activeHeaders.value.forEach(header => {
                const value = getNestedValue(item, header.key);
                row[header.label] = header.type === 'date' ? formatDate(value) : (value ?? 'N/A');
            });
            return row;
        });

        const csv = Papa.unparse(dataForCsv);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const filename = `${activeReport.value}_${new Date().toISOString().slice(0,10)}.csv`;
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Export completed successfully!");

    } catch (err) {
        console.error("Export failed:", err);
        toast.error(`Export failed. ${err.response?.data?.detail || err.message}`);
    } finally {
        isLoadingExport.value = false;
    }
};

</script>

<style scoped>
/* All your existing styles are correct and do not need to be changed. */
.filter-label { display: block; font-size: 0.875rem; font-weight: 500; color: #4b5563; margin-bottom: 0.25rem; }
.filter-input, .report-type-selector { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: #fff; font-size: 0.875rem; color: #111827; transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
.filter-input:disabled, .report-type-selector:disabled { background-color: #f3f4f6; cursor: not-allowed; }
.filter-input::placeholder { color: #9ca3af; }
.filter-input:focus, .report-type-selector:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); }
.table-header { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; background-color: #f9fafb; border-bottom: 2px solid #e5e7eb; white-space: nowrap; }
.table-cell { padding: 1rem 1.5rem; font-size: 0.875rem; color: #374151; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out; border: none; cursor: pointer; white-space: nowrap; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
.btn-primary { @apply btn bg-blue-500 text-white; }
.btn-primary:hover:not(:disabled) { @apply bg-blue-600 shadow-md; }
.btn-secondary { @apply btn bg-gray-500 text-white; }
.btn-secondary:hover:not(:disabled) { @apply bg-gray-600 shadow-md; }
.pagination-btn { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: #fff; color: #374151; font-size: 0.875rem; transition: background-color 0.2s, border-color 0.2s; display: inline-flex; align-items: center; }
.pagination-btn:hover:not(:disabled) { background-color: #f9fafb; border-color: #9ca3af; }
.pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
optgroup { font-weight: 700; font-style: italic; color: #1f2937; background-color: #f3f4f6; padding: 4px 0; }
</style>