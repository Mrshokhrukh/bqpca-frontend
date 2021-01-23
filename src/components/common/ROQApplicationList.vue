<template>
  <div class="w-full">
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Search and Filters -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[240px]">
            <input type="search" placeholder="Search applications..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :value="searchQuery" @input="handleSearch" />
          </div>
          <div class="flex gap-2">
            <select class="px-4 py-2 rounded-lg border border-gray-300 bg-white" :value="selectedStatus"
              @change="handleFilter">
              <option value="">All Status</option>
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ formatStatus(status) }}
              </option>
            </select>
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
                    <ChevronUpIcon class="h-3 w-3" :class="getSortIconClass(header.key, 'asc')" />
                    <ChevronDownIcon class="h-3 w-3" :class="getSortIconClass(header.key, 'desc')" />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="!noResults">
              <tr v-for="application in sortedApplications" :key="application.id"
                class="hover:bg-gray-50 transition-colors duration-200">
                <!-- Applicant Details -->
                <td class="px-6 py-4">
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <UserIcon class="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.fullName }}
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        <div class="flex items-center space-x-2">
                          <EnvelopeIcon class="h-4 w-4" />
                          <span>{{ application.emailAddress }}</span>
                        </div>
                        <div class="flex items-center space-x-2 mt-1">
                          <PhoneIcon class="h-4 w-4" />
                          <span>{{ application.contactNumber }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Course Details -->
                <td class="px-6 py-4">
                  <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-900">
                      {{ application.courseTitle }}
                    </div>
                    <div class="text-sm text-gray-500">
                      <div class="flex items-center space-x-2">
                        <AcademicCapIcon class="h-4 w-4" />
                        <span>{{ application.nameOfInstitute }}</span>
                      </div>
                      <div class="flex items-center space-x-2 mt-1">
                        <MapPinIcon class="h-4 w-4" />
                        <span>{{ application.country }}</span>
                      </div>
                      <div class="flex items-center space-x-2 mt-1">
                        <CalendarIcon class="h-4 w-4" />
                        <span>{{ application.courseDuration }} years</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-2">
                    <span :class="getStatusClass(application.status)">
                      <span class="flex items-center">
                        <span class="h-2 w-2 rounded-full" :class="getStatusDotClass(application.status)"></span>
                        <span class="ml-2">{{
                          formatStatus(application.status)
                          }}</span>
                      </span>
                    </span>
                    <span class="text-xs text-gray-500">
                      Updated: {{ formatDate(application.updated_at) }}
                    </span>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <ActionButtons :application="application" @action="handleAction" :user-role="userRole" />
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="4" class="py-12 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ ((currentPage - 1) * perPage) + 1 }} to
            {{ Math.min(currentPage * perPage, totalResults) }} of
            {{ totalResults }} results
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <select v-model="localPerPage" class="px-3 py-1 rounded-md text-sm border border-gray-300"
                @change="$emit('per-page-change', localPerPage)">
                <option :value="10">10 / page</option>
                <option :value="25">25 / page</option>
                <option :value="50">50 / page</option>
              </select>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage * perPage >= totalResults"
                class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/vue/24/outline';
import ActionButtons from './ActionButtons.vue';

const props = defineProps({
  applications: {
    type: Array,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalResults: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  searchQuery: {
    type: String,
    default: ''
  },
  selectedStatus: {
    type: String,
    default: ''
  },
  noResults: {
    type: Boolean,
    default: false
  },
  userRole: {
    type: String,
    required: false,
    default: null
  }
});

const localPerPage = ref(props.perPage);

const emit = defineEmits(['page-change', 'per-page-change', 'action', 'search-query-change', 'status-filter-change']);


const sortOrder = ref({ field: 'id', direction: 'asc' });

const statusOptions = [
  'draft',
  'applied',
  'processing',
  'under_review',
  'approved',
  'regretted',
  'reprocess',
  'reupload',
];

const headers = [
  { key: 'applicant', label: 'Applicant Details' },
  { key: 'course', label: 'Course Information' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const formatDate = (date) => {
  if (!date) {
    return 'N/A'; // Handle cases with no date
  }
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return "Invalid Date"
  }

};

const formatStatus = (status) => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getStatusClass = (status) => {
  const baseClasses =
    'inline-flex items-center px-3 py-1 text-sm rounded-full font-medium';
  const statusClasses = {
    draft: 'bg-gray-100 text-gray-800',
    applied: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    regretted: 'bg-red-100 text-red-800',
    reprocess: 'bg-orange-100 text-orange-800',
    reupload: 'bg-indigo-100 text-indigo-800',
  };
  return `${baseClasses} ${statusClasses[status] || ''}`;
};

const getStatusDotClass = (status) => {
  const statusClasses = {
    draft: 'bg-gray-600',
    applied: 'bg-blue-600',
    processing: 'bg-yellow-600',
    under_review: 'bg-purple-600',
    approved: 'bg-green-600',
    regretted: 'bg-red-600',
    reprocess: 'bg-orange-600',
    reupload: 'bg-indigo-600',
  };
  return statusClasses[status] || '';
};

const getSortIconClass = (field, direction) => {
  return {
    'text-gray-400': sortOrder.value.field !== field,
    'text-blue-600':
      sortOrder.value.field === field && sortOrder.value.direction === direction,
  };
};

const sortBy = (field) => {
  if (sortOrder.value.field === field) {
    sortOrder.value.direction = sortOrder.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrder.value = { field, direction: 'asc' };
  }
};

const handleSearch = (event) => {
  emit('search-query-change', event.target.value)
};

const handleFilter = (event) => {
  emit('status-filter-change', event.target.value)
}

const handleAction = ({ action, application }) => {
  emit('action', { action, application });
};

const mappedApplications = computed(() => {
  return props.applications.map((app) => ({
    ...app,
    fullName: app.applicants_name,
    emailAddress: app.email_address,
    contactNumber: app.contact_no,
    courseTitle: app.course_title,
    nameOfInstitute: app.name_of_institute,
    country: app.country,
    courseDuration: app.duration_of_course,
  }));
});

const sortedApplications = computed(() => {
  let filtered = [...mappedApplications.value];

  // Apply sorting
  return filtered.sort((a, b) => {
    const aValue = a[sortOrder.value.field];
    const bValue = b[sortOrder.value.field];
    const modifier = sortOrder.value.direction === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * modifier;
    if (aValue > bValue) return 1 * modifier;
    return 0;
  });
});
</script>
