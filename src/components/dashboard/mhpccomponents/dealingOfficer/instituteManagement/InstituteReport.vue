<template>
  <div class="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-800">EOI/DPR Reports</h2>
            <p class="mt-1 text-sm text-slate-500">
              View, search, and filter submitted project proposals.
            </p>
          </div>
          <div class="flex-shrink-0">
            <svg
              class="h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08H4.123a48.424 48.424 0 00-1.123.08C1.845 4.01 1 4.973 1 6.108V18.75c0 1.242 1.007 2.25 2.25 2.25H6.75"
              />
            </svg>
          </div>
        </div>

        <div class="p-6 border-b border-slate-200 bg-slate-50">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-md font-semibold text-slate-700">Filter Reports</h3>
            <button
              @click="resetFilters"
              class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div class="space-y-1">
              <label for="searchFilter" class="block text-sm font-medium text-slate-600"
                >Applicant Name</label
              >
              <input
                type="text"
                id="searchFilter"
                v-model="filters.search"
                placeholder="Search by name..."
                class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div class="space-y-1">
              <label for="statusFilter" class="block text-sm font-medium text-slate-600"
                >Status</label
              >
              <select
                id="statusFilter"
                v-model="filters.status"
                class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div class="space-y-1">
              <label for="typeFilter" class="block text-sm font-medium text-slate-600">Type</label>
              <select
                id="typeFilter"
                v-model="filters.type"
                class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">All Types</option>
                <option value="EOI">EOI</option>
                <option value="DPR">DPR</option>
              </select>
            </div>
            <div class="space-y-1">
              <label for="regionFilter" class="block text-sm font-medium text-slate-600"
                >Region</label
              >
              <select
                id="regionFilter"
                v-model="filters.region"
                class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="">All Regions</option>
                <option value="Thimphu">Thimphu</option>
                <option value="Paro">Paro</option>
                <option value="Gelephu">Gelephu</option>
                 <option value="Punakha">Punakha</option>
              </select>
            </div>
            <div class="space-y-1">
              <label for="dateFrom" class="block text-sm font-medium text-slate-600"
                >Date From</label
              >
              <input
                type="date"
                id="dateFrom"
                v-model="filters.dateFrom"
                class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
            <div class="space-y-1">
              <label for="dateTo" class="block text-sm font-medium text-slate-600">Date To</label>
              <input
                type="date"
                id="dateTo"
                v-model="filters.dateTo"
                class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div class="p-6">
          <div v-if="isLoading" class="text-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-slate-500">Loading Reports...</p>
          </div>

          <div v-else-if="!paginatedReports.length" class="text-center py-16">
            <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-slate-900">No Reports Found</h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ reports.length === 0 ? "There are no reports to display." : "No reports match your current filters. Try adjusting them." }}
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Region</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date Submitted</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-for="report in paginatedReports" :key="report.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-slate-900">{{ report.name }}</div>
                    <div class="text-xs text-slate-500">ID: {{ report.id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ report.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ report.region }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ formatDate(report.dateSubmitted) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClasses(report.status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-none">
                      <span class="h-2 w-2 mr-2 rounded-full" :class="getStatusDotClasses(report.status)"></span>
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button @click="openReportModal(report)" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav v-if="totalPages > 1" class="mt-6 flex items-center justify-between border-t border-slate-200 px-4 pt-4" aria-label="Pagination">
              <div class="hidden sm:block">
                <p class="text-sm text-slate-600">
                  Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredReports.length) }}</span>
                  of <span class="font-medium">{{ filteredReports.length }}</span> results
                </p>
              </div>
              <div class="flex-1 flex justify-between sm:justify-end">
                <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50">
                  Previous
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50">
                  Next
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <ReportModal :isOpen="isReportModalOpen" :report="selectedReport" @close="closeReportModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ReportModal from './InstituteReportModal.vue';

// --- STATE MANAGEMENT ---
const reports = ref([]);
const isLoading = ref(false);
const initialFilters = {
  status: '',
  type: '',
  search: '',
  dateFrom: '',
  dateTo: '',
  region: '',
};
const filters = ref({ ...initialFilters });

const isReportModalOpen = ref(false);
const selectedReport = ref(null);

// --- PAGINATION STATE ---
const currentPage = ref(1);
const itemsPerPage = 10;

// --- API & DATA FETCHING ---
const fetchReports = async () => {
  isLoading.value = true;
  try {
    // This is where you would call your API.
    // I'm using a mock promise to simulate a network request.
    await new Promise(resolve => setTimeout(resolve, 1000));
    reports.value = [
       { id: 1, name: 'College of Medicine', type: 'EOI', dateSubmitted: '2025-06-01', status: 'Submitted', details: 'Initial EOI for a new medical college.', region: 'Thimphu' },
       { id: 2, name: 'Health Institute of Paro', type: 'DPR', dateSubmitted: '2025-05-15', status: 'Approved', details: 'Detailed project report for the expansion of the Paro Health Institute.', region: 'Paro' },
       { id: 3, name: 'Nursing School Thimphu', type: 'EOI', dateSubmitted: '2025-05-20', status: 'Rejected', details: 'Proposal for a new nursing school did not meet initial criteria.', region: 'Thimphu' },
       { id: 4, name: 'Pharmacy College Gelephu', type: 'DPR', dateSubmitted: '2025-04-30', status: 'Reviewed', details: 'DPR under final review for a new pharmacy college in Gelephu.', region: 'Gelephu' },
       { id: 5, name: 'Punakha Medical Research Center', type: 'EOI', dateSubmitted: '2025-06-05', status: 'Submitted', details: 'EOI for a specialized medical research facility.', region: 'Punakha' },
    ];
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    // You could add a toast notification here
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchReports();
});


// --- COMPUTED PROPERTIES ---
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const searchMatch = !filters.value.search || report.name.toLowerCase().includes(filters.value.search.toLowerCase());
    const statusMatch = !filters.value.status || report.status === filters.value.status;
    const typeMatch = !filters.value.type || report.type === filters.value.type;
    const regionMatch = !filters.value.region || report.region === filters.value.region;

    // Date filtering logic
    const submittedDate = new Date(report.dateSubmitted);
    submittedDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const dateFrom = filters.value.dateFrom ? new Date(filters.value.dateFrom) : null;
    if(dateFrom) dateFrom.setHours(0, 0, 0, 0);

    const dateTo = filters.value.dateTo ? new Date(filters.value.dateTo) : null;
    if(dateTo) dateTo.setHours(0, 0, 0, 0);

    const dateMatch = (!dateFrom || submittedDate >= dateFrom) && (!dateTo || submittedDate <= dateTo);

    return statusMatch && typeMatch && searchMatch && dateMatch && regionMatch;
  });
});

const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage));

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReports.value.slice(start, end);
});

// --- METHODS ---
const openReportModal = (report) => {
  selectedReport.value = report;
  isReportModalOpen.value = true;
};

const closeReportModal = () => {
  isReportModalOpen.value = false;
  selectedReport.value = null;
};

const resetFilters = () => {
  filters.value = { ...initialFilters };
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// --- PAGINATION METHODS ---
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// --- DYNAMIC STYLING ---
const getStatusClasses = (status) => {
  const styles = {
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Reviewed: 'bg-blue-100 text-blue-800',
    Submitted: 'bg-yellow-100 text-yellow-800',
  };
  return styles[status] || 'bg-slate-100 text-slate-800';
};

const getStatusDotClasses = (status) => {
  const styles = {
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    Reviewed: 'bg-blue-500',
    Submitted: 'bg-yellow-500',
  };
  return styles[status] || 'bg-slate-500';
};
</script>
