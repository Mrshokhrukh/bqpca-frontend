<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- 1. Header Section -->
    <header class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Training Institutes Report</h1>
      <p class="text-gray-500 mt-1">Browse, filter, and export a detailed list of all training institutes.</p>
    </header>

    <!-- 2. Filters Section -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Filters</h2>
        <button @click="resetFilters" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          Reset Filters
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Main Search Filter -->
        <div>
          <label for="search" class="filter-label">Search</label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            class="filter-input"
            placeholder="Institute, Focal, CID, Reviewer..."
          />
        </div>

        <!-- Application Status Filter -->
        <div>
          <label for="status" class="filter-label">Application Status</label>
          <select id="status" v-model="filters.application_status" class="filter-input">
            <option v-for="opt in CONFIG.statusFilterOptions" :key="opt.value" :value="opt.value">
              {{ opt.text }}
            </option>
          </select>
        </div>

        <!-- Is Active Filter -->
        <div>
          <label for="is_active" class="filter-label">Active Status</label>
          <select id="is_active" v-model="filters.is_active" class="filter-input">
            <option :value="null">All</option>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <!-- Dzongkhag Filter -->
        <div>
          <label for="dzongkhag" class="filter-label">Dzongkhag</label>
          <input id="dzongkhag" v-model="filters.dzongkhag" type="text" class="filter-input" placeholder="e.g., Thimphu" />
        </div>

        <!-- Date Range Filter for Last Updated -->
        <div class="sm:col-span-2 lg:col-span-2">
          <label class="filter-label">Last Updated Range</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <input v-model="filters.updated_at_start" type="date" class="filter-input" />
            <input v-model="filters.updated_at_end" type="date" class="filter-input" />
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Report Table Section (No changes here) -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <!-- Loading, Error, Empty States -->
      <div v-if="isLoading" class="p-6 text-center text-gray-500">Loading report data...</div>
      <div v-else-if="error" class="p-6 text-center text-red-500 bg-red-50 rounded-lg m-4">
        <p class="font-semibold">An Error Occurred</p>
        <p>{{ error }}</p>
        <button @click="fetchData()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Try Again</button>
      </div>
      <div v-else-if="!reportData.length" class="p-6 text-center text-gray-500">
        <p class="font-semibold">No Results Found</p>
        <p>Try adjusting your filters to find what you're looking for.</p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header.key" scope="col" class="table-header" :class="{ 'cursor-pointer hover:bg-gray-100': header.sortable }" @click="header.sortable ? handleSort(header.key) : null">
                <div class="flex items-center">
                  <span>{{ header.label }}</span>
                  <span v-if="header.sortable && sortBy === header.key" class="ml-1">
                    <svg v-if="sortOrder === 'asc'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
                    <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in reportData" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td v-for="header in tableHeaders" :key="header.key" class="table-cell">
                <span v-if="header.type === 'status'" :class="statusBadge(item.application_status_display)">{{ item.application_status_display || 'N/A' }}</span>
                <span v-else-if="header.type === 'boolean'"><span :class="booleanBadge(item[header.key])">{{ item[header.key] ? 'Yes' : 'No' }}</span></span>
                <span v-else-if="header.type === 'date'">{{ formatDate(item[header.key]) }}</span>
                <span v-else>{{ item[header.key] ?? 'N/A' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 4. Pagination (No changes here) -->
      <div v-if="!isLoading && !error && reportData.length" class="p-4 flex justify-between items-center">
         <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * PAGE_SIZE + 1 }}</span>
            to <span class="font-medium">{{ Math.min(currentPage * PAGE_SIZE, totalItems) }}</span>
            of <span class="font-medium">{{ totalItems }}</span> results
        </p>
        <div class="flex gap-2">
            <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">Prev</button>
            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No changes in the <script> block
import { ref, reactive, watch, onMounted, computed } from 'vue';
import apiServices from '@/services/services';

const CONFIG = {
  apiMethod: apiServices.getInstituteReport,
  statusFilterOptions: [
    { value: '', text: 'All Statuses' },
    { value: 'EOI_PENDING', text: 'EOI - Pending Review' },
    { value: 'EOI_APPROVED', text: 'EOI - Approved' },
    { value: 'EOI_REJECTED', text: 'EOI - Rejected' },
    { value: 'DPR_PENDING', text: 'DPR - Pending Review' },
    { value: 'FULLY_APPROVED', text: 'Fully Approved' },
    { value: 'FINAL_REJECTED', text: 'Final Rejected' },
  ],
};
const tableHeaders = [
  { key: 'name_of_institution', label: 'Institute Name', sortable: true },
  { key: 'application_status_display', label: 'Current Status', type: 'status', sortable: true },
  { key: 'do_eoi_review_decision', label: 'EOI Decision', sortable: false },
  { key: 'eoi_reviewed_by_name', label: 'EOI Reviewer', sortable: false },
  { key: 'do_dpr_review_decision', label: 'DPR Decision', sortable: false },
  { key: 'dpr_reviewed_by_name', label: 'DPR Reviewer', sortable: false },
  { key: 'is_active', label: 'Active', type: 'boolean', sortable: true },
  { key: 'full_name', label: 'Focal Person', sortable: false },
  { key: 'contact_no', label: 'Contact', sortable: false },
  { key: 'valid_till', label: 'Valid Till', type: 'date', sortable: true },
  { key: 'updated_at', label: 'Last Updated', type: 'date', sortable: true },
];
const PAGE_SIZE = 10;
const reportData = ref([]);
const isLoading = ref(false);
const error = ref(null);
const totalItems = ref(0);
const currentPage = ref(1);
const sortBy = ref('updated_at');
const sortOrder = ref('desc');
const initialFilters = { search: '', application_status: '', dzongkhag: '', is_active: null, updated_at_start: '', updated_at_end: '' };
const filters = reactive({ ...initialFilters });
const totalPages = computed(() => Math.ceil(totalItems.value / PAGE_SIZE));
const fetchData = async () => { isLoading.value = true; error.value = null; try { const params = { page: currentPage.value, page_size: PAGE_SIZE, ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : null, ...filters }; Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]); const response = await CONFIG.apiMethod(params); if (response?.data?.results) { reportData.value = response.data.results; totalItems.value = response.data.count || 0; } else { throw new Error("Received invalid data structure from the server."); } } catch (err) { console.error("Failed to fetch institute report:", err); error.value = 'Could not load report data. Please check your connection and try again.'; reportData.value = []; totalItems.value = 0; } finally { isLoading.value = false; }};
const handleSort = (key) => { if (sortBy.value === key) { sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'; } else { sortBy.value = key; sortOrder.value = 'desc'; } fetchData(); };
const handlePageChange = (newPage) => { if (newPage > 0 && newPage <= totalPages.value) { currentPage.value = newPage; fetchData(); }};
const resetFilters = () => { Object.assign(filters, initialFilters); };
watch(filters, () => { currentPage.value = 1; fetchData(); }, { deep: true });
onMounted(() => { fetchData(); });
const formatDate = (dateString) => { if (!dateString) return 'N/A'; return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); };
const booleanBadge = (value) => value ? 'badge-green' : 'badge-red';
const statusBadge = (status) => { const statusMap = { 'Fully Approved': 'badge-green', 'EOI Submitted': 'badge-blue', 'DPR Submitted': 'badge-yellow', 'Final Rejected': 'badge-red', 'default': 'badge-gray' }; return statusMap[status] || statusMap.default; };
</script>

<style scoped>
/* No changes in the <style> block */
.filter-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
.filter-input { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
.filter-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 1px #2563eb; }
.table-header { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; }
.table-cell { padding: 1rem 1rem; font-size: 0.875rem; color: #374151; white-space: nowrap; }
.pagination-button { padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: white; font-weight: 500; }
.pagination-button:hover:not(:disabled) { background-color: #f9fafb; }
.pagination-button:disabled { opacity: 0.5; cursor: not-allowed; }
.badge-green, .badge-red, .badge-blue, .badge-yellow, .badge-gray { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
.badge-green { background-color: #d1fae5; color: #065f46; }
.badge-red { background-color: #fee2e2; color: #991b1b; }
.badge-blue { background-color: #dbeafe; color: #1e40af; }
.badge-yellow { background-color: #fef3c7; color: #92400e; }
.badge-gray { background-color: #f3f4f6; color: #374151; }
</style>