<template>
  <div class="w-full">
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Search and Filters -->
      <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-50">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[240px] relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input type="search" placeholder="Search applications..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              v-model="searchQuery" @input="handleSearch" />
          </div>
          <div class="flex gap-3">
            <select
              class="px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              v-model="selectedStatus">
              <option value="">All Status</option>
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ formatStatus(status) }}
              </option>
            </select>
            <button @click="resetFilters"
              class="px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-2">
              <RefreshCw class="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header.key"
                class="group px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                @click="sortBy(header.key)">
                <div class="flex items-center space-x-1">
                  <span>{{ header.label }}</span>
                  <div class="flex flex-col">
                    <ChevronUp class="h-3 w-3" :class="getSortIconClass(header.key, 'asc')" />
                    <ChevronDown class="h-3 w-3" :class="getSortIconClass(header.key, 'desc')" />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in sortedApplications" :key="application.id"
              class="hover:bg-blue-50 transition-colors duration-150">
              <!-- Applicant Details -->
              <td class="px-6 py-5">
                <div class="flex items-start space-x-4">
                  <div
                    class="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    {{ getInitials(application.applicants_name) }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ application.applicants_name }}</div>
                    <div class="text-sm text-gray-500 mt-1.5">
                      <div class="flex items-center space-x-2">
                        <Mail class="h-4 w-4 text-gray-400" />
                        <span>{{ application.email_address }}</span>
                      </div>
                      <div class="flex items-center space-x-2 mt-1">
                        <Phone class="h-4 w-4 text-gray-400" />
                        <span>{{ application.contact_no }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Course Details -->
              <td class="px-6 py-5">
                <div class="space-y-2">
                  <div class="text-sm font-medium text-gray-900">{{ application.course_title }}</div>
                  <div class="text-sm text-gray-500 mt-1.5">
                    <div class="flex items-center space-x-2">
                      <GraduationCap class="h-4 w-4 text-gray-400" />
                      <span>{{ application.name_of_institute }}</span>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <MapPin class="h-4 w-4 text-gray-400" />
                      <span>{{ application.country }}</span>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <Calendar class="h-4 w-4 text-gray-400" />
                      <span>{{ application.duration_of_course }} years</span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex flex-col space-y-2">
                  <span :class="getStatusClass(application.status)">
                    <span class="flex items-center">
                      <span class="h-2 w-2 rounded-full" :class="getStatusDotClass(application.status)"></span>
                      <span class="ml-2">{{ formatStatus(application.status) }}</span>
                    </span>
                  </span>
                  <span class="text-xs text-gray-500 flex items-center mt-1">
                    <Clock class="h-3.5 w-3.5 mr-1 text-gray-400" />
                    Updated: {{ formatDate(application.updated_at) }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-5 whitespace-nowrap text-right">
                <div class="flex justify-end">
                  <ActionButtons :status="application.status" :application="application" @action="handleAction" />
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="sortedApplications.length === 0">
              <td colspan="4" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center">
                  <Inbox class="h-12 w-12 text-gray-300 mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
                  <p class="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                  <button @click="resetFilters"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Reset filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ ((currentPage - 1) * perPage) + 1 }}</span> to
            <span class="font-medium">{{ Math.min(currentPage * perPage, totalResults) }}</span> of
            <span class="font-medium">{{ totalResults }}</span> results
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <select v-model="localPerPage"
                class="px-3 py-1.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="$emit('per-page-change', localPerPage)">
                <option :value="10">10 / page</option>
                <option :value="25">25 / page</option>
                <option :value="50">50 / page</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                Previous
              </button>
              <div class="flex items-center">
                <span v-for="page in displayedPages" :key="page"
                  class="cursor-pointer rounded-md w-8 h-8 flex items-center justify-center mx-1"
                  :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'"
                  @click="$emit('page-change', page)">
                  {{ page }}
                </span>
              </div>
              <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage * perPage >= totalResults"
                class="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Search,
  RefreshCw,
  Clock,
  Inbox
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore';
import ActionButtons from '@/components/common/ROQUserActionButtons.vue';

const props = defineProps({
  applications: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalResults: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    required: true
  }
});

const localPerPage = ref(props.perPage);

const emit = defineEmits(['page-change', 'per-page-change', 'search', 'filter', 'action']);

const searchQuery = ref('');
const selectedStatus = ref('');
const sortOrder = ref({ field: 'created_at', direction: 'desc' });
const authStore = useAuthStore();

const statusOptions = [
  'draft',
  'processing_payment',
  'applied',
  'processing',
  'under_review',
  'approved',
  'regretted',
  'reprocess',
  'reupload'
];

// Updated headers (removed ROQ columns)
const headers = [
  { key: 'applicant', label: 'Applicant Details' },
  { key: 'course', label: 'Course Information' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
];

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatStatus = (status) => {
  return status.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('');
};

const getStatusClass = (status) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 text-sm rounded-full font-medium';
  const statusClasses = {
    draft: 'bg-gray-100 text-gray-800',
    processing_payment: 'bg-blue-100 text-blue-800',
    applied: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    regretted: 'bg-red-100 text-red-800',
    reprocess: 'bg-orange-100 text-orange-800',
    reupload: 'bg-pink-100 text-pink-800'
  };
  return `${baseClasses} ${statusClasses[status] || ''}`;
};

const getStatusDotClass = (status) => {
  const statusClasses = {
    draft: 'bg-gray-600',
    processing_payment: 'bg-blue-600',
    applied: 'bg-blue-600',
    processing: 'bg-yellow-600',
    under_review: 'bg-purple-600',
    approved: 'bg-green-600',
    regretted: 'bg-red-600',
    reprocess: 'bg-orange-600',
    reupload: 'bg-pink-600'
  };
  return statusClasses[status] || '';
};

const getSortIconClass = (field, direction) => {
  return {
    'text-gray-400': sortOrder.value.field !== field,
    'text-blue-600': sortOrder.value.field === field && sortOrder.value.direction === direction,
  };
};

const sortBy = (field) => {
  if (sortOrder.value.field === field) {
    sortOrder.value.direction = sortOrder.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrder.value = { field, direction: 'asc' };
  }
};

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const handleAction = (action, application) => {
  emit('action', { action, application });
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  handleSearch();
};

// Calculate pagination numbers
const totalPages = computed(() => Math.ceil(props.totalResults / props.perPage));

const displayedPages = computed(() => {
  const maxPages = 5;
  const halfMaxPages = Math.floor(maxPages / 2);

  let startPage = Math.max(1, props.currentPage - halfMaxPages);
  const endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

const sortedApplications = computed(() => {
  // 1. Filter by user email only if the user's role is 'user'
  let filtered = props.applications;

  if (authStore.user && authStore.user.email && authStore.role === 'user') {
    filtered = filtered.filter(app => app.email_address === authStore.user.email);
  }

  // 2. Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(app =>
      app.applicants_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.email_address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.course_title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.name_of_institute.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.country.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // 3. Apply status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(app => app.status === selectedStatus.value);
  }

  // 4. Apply sorting
  return filtered.sort((a, b) => {
    const aValue = a[sortOrder.value.field];
    const bValue = b[sortOrder.value.field];
    const modifier = sortOrder.value.direction === 'asc' ? 1 : -1;

    // Handle date fields
    if (sortOrder.value.field === 'created_at' || sortOrder.value.field === 'updated_at') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (aDate < bDate) return -1 * modifier;
      if (aDate > bDate) return 1 * modifier;
      return 0;
    }

    // Handle other fields
    if (aValue < bValue) return -1 * modifier;
    if (aValue > bValue) return 1 * modifier;
    return 0;
  });
});
</script>

<style scoped>
/* Add responsive styles */
@media (max-width: 768px) {
  .flex-wrap {
    flex-wrap: wrap;
  }

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  th,
  td {
    text-align: left;
  }
}
</style>
