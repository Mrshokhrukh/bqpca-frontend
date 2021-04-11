// Child Component: ROQAdminApplicationList.vue
<template>
  <div class="w-full">
    <div class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex flex-wrap items-center gap-5">
          <div class="flex-1 min-w-[240px] relative">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
            <input type="search" placeholder="Search applications..."
              class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              :value="searchQuery" @input="handleSearch" />
          </div>
          <div class="flex gap-4">
            <div class="relative">
              <select
                class="pl-4 pr-10 py-3 rounded-lg border border-gray-200 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] shadow-sm transition-all duration-200"
                :value="selectedStatus" @change="handleFilter">
                <option value="">All Status</option>
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ formatStatus(status) }}
                </option>
              </select>
              <ChevronDown
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <div class="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <table class="min-w-full divide-y divide-gray-200 table-fixed border-collapse">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <template v-for="header in headers" :key="header.key">
                   <th v-if="header.visible"
                      class="group px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-200"
                      @click="sortBy(header.key)">
                      <div class="flex items-center space-x-1">
                        <span>{{ header.label }}</span>
                         <div v-if="header.sortable" class="flex flex-col">
                           <ChevronUp class="h-3 w-3" :class="getSortIconClass(header.key, 'asc')" />
                           <ChevronDown class="h-3 w-3" :class="getSortIconClass(header.key, 'desc')" />
                         </div>
                      </div>
                   </th>
                 </template>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <template v-if="!noResults">
                <tr v-for="application in sortedApplications" :key="application.id"
                  class="hover:bg-blue-50 transition-all duration-200">
                  <td class="px-6 py-5">
                    <div class="flex items-start space-x-4">
                      <div
                        class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <User class="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-gray-900">
                          {{ application.fullName }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1.5">
                          <div class="flex items-center space-x-2">
                            <Mail class="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                            <span class="truncate max-w-[200px]">{{ application.emailAddress }}</span>
                          </div>
                          <div class="flex items-center space-x-2 mt-1.5">
                            <Phone class="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                            <span>{{ application.contactNumber }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-5">
                    <div class="space-y-2">
                      <div class="text-sm font-semibold text-gray-900 truncate max-w-[240px]">
                        {{ application.courseTitle }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1.5">
                        <div class="flex items-center space-x-2 truncate max-w-[240px]">
                          <GraduationCap class="h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                          <span class="truncate">{{ application.nameOfInstitute }}</span>
                        </div>
                        <div class="flex items-center space-x-2 mt-1.5">
                          <MapPin class="h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                          <span>{{ application.country }}</span>
                        </div>
                        <div class="flex items-center space-x-2 mt-1.5">
                          <Calendar class="h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                          <span>{{ application.courseDuration }} years</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-5 whitespace-nowrap">
                    <div class="flex flex-col space-y-3">
                      <span :class="getStatusClass(application.status)">
                        <span class="flex items-center">
                          <span class="h-2.5 w-2.5 rounded-full" :class="getStatusDotClass(application.status)"></span>
                          <span class="ml-2">{{ formatStatus(application.status) }}</span>
                        </span>
                      </span>
                      <span class="text-xs text-gray-500 flex items-center gap-1.5">
                        <Clock class="h-3.5 w-3.5 text-gray-400" />
                        {{ formatDate(application.updated_at) }}
                      </span>
                    </div>
                  </td>

                  <td v-if="showRoqStatusColumn" class="px-6 py-5 whitespace-nowrap">
                    <div class="flex flex-col items-center space-y-2 min-h-[60px]">
                      <template v-if="shouldShowRoqSendButton(application)">
                        <button @click="handleRoqStatusUpdate(application)"
                                :disabled="isSendingStatus[application.id]"
                                :class="[
                                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 w-full justify-center',
                                  'bg-blue-600 text-white hover:bg-blue-700',
                                  (isSendingStatus[application.id]) && 'opacity-50 cursor-wait'
                                ]">
                          <template v-if="isSendingStatus[application.id]">
                            <Loader2 class="h-4 w-4 animate-spin" /> Sending...
                          </template>
                          <template v-else>
                            <Mail class="h-4 w-4" /> Send Status Email
                          </template>
                        </button>
                      </template>
                      <template v-else-if="application.roq_status_letter">
                          <div :class="[
                              'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-full justify-center',
                              'bg-green-100 text-green-800 cursor-not-allowed'
                              ]">
                              <CheckCircle class="h-4 w-4" /> Email Sent
                          </div>
                          <span v-if="application.roq_status_letter_sent_date"
                                class="text-xs text-gray-500 flex items-center gap-1.5">
                            <Clock class="h-3.5 w-3.5 text-gray-400" />
                            {{ formatDate(application.roq_status_letter_sent_date) }}
                          </span>
                      </template>
                      <template v-else>
                         <div class="w-full h-[40px]"></div>
                      </template>
                    </div>
                  </td>

                  <td v-if="showRegretColumn" class="px-6 py-5 whitespace-nowrap">
                     <div class="flex flex-col items-center space-y-2 min-h-[60px]">
                        <template v-if="shouldShowRegretSendButton(application)">
                          <button @click="handleRegretLetterSend(application)"
                            :disabled="isSendingRegret[application.id]"
                            :class="[
                              'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 w-full justify-center',
                              'bg-red-600 text-white hover:bg-red-700',
                              (isSendingRegret[application.id]) && 'opacity-50 cursor-wait'
                            ]">
                             <template v-if="isSendingRegret[application.id]">
                              <Loader2 class="h-4 w-4 animate-spin" /> Sending...
                            </template>
                             <template v-else>
                              <Mail class="h-4 w-4" /> Send Regret Email
                            </template>
                          </button>
                        </template>
                         <template v-else-if="application.roq_regret_letter">
                             <div :class="[
                                 'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-full justify-center',
                                 'bg-green-100 text-green-800 cursor-not-allowed'
                                 ]">
                                 <CheckCircle class="h-4 w-4" /> Email Sent
                             </div>
                            <span v-if="application.roq_regret_letter_sent_date"
                                  class="text-xs text-gray-500 flex items-center gap-1.5">
                              <Clock class="h-3.5 w-3.5 text-gray-400" />
                              {{ formatDate(application.roq_regret_letter_sent_date) }}
                            </span>
                         </template>
                         <template v-else>
                            <div class="w-full h-[40px]"></div>
                         </template>
                     </div>
                  </td>

                  <td class="px-6 py-5 whitespace-nowrap text-right">
                    <ActionButtons :application="application" @action="handleAction" :user-role="userRole" />
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td :colspan="visibleHeadersCount" class="py-20 text-center">
                    <div class="flex flex-col items-center">
                      <div class="bg-gray-50 p-6 rounded-full mb-4">
                        <FileSearch class="h-14 w-14 text-blue-400" />
                      </div>
                      <p class="text-gray-700 text-lg font-medium">No applications found</p>
                      <p class="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div class="px-6 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 font-medium">
            Showing <span class="text-blue-600">{{ totalResults > 0 ? ((currentPage - 1) * perPage) + 1 : 0 }}</span> to
            <span class="text-blue-600">{{ Math.min(currentPage * perPage, totalResults) }}</span> of
            <span class="text-blue-600">{{ totalResults }}</span> results
          </div>
          <div class="flex items-center space-x-5">
            <div class="flex items-center space-x-2">
              <div class="relative">
                <select v-model="localPerPage"
                  class="pl-3 pr-8 py-2 rounded-lg text-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none shadow-sm transition-all duration-200"
                  @change="$emit('per-page-change', localPerPage)">
                  <option :value="10">10 / page</option>
                  <option :value="25">25 / page</option>
                  <option :value="50">50 / page</option>
                </select>
                <ChevronDown
                  class="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-blue-500 h-3.5 w-3.5 pointer-events-none" />
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-all duration-200">
                <ChevronLeft class="h-4 w-4 text-blue-500" />
                Previous
              </button>
              <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage * perPage >= totalResults"
                class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-all duration-200">
                Next
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue';
import { useToast } from "vue-toastification";
import apiServices from '@/services/services';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Search,
  FileSearch,
  Loader2,
  CheckCircle
} from 'lucide-vue-next';
import ActionButtons from './ROQAdminActionButtons.vue';

const props = defineProps({
  applications: { type: Array, required: true },
  currentPage: { type: Number, required: true },
  totalResults: { type: Number, required: true },
  perPage: { type: Number, required: true },
  searchQuery: { type: String, default: '' },
  selectedStatus: { type: String, default: '' },
  noResults: { type: Boolean, default: false },
  userRole: { type: String, required: false, default: null }
});

const localPerPage = ref(props.perPage);
const emit = defineEmits(['page-change', 'per-page-change', 'action', 'search-query-change', 'status-filter-change', 'refresh']);
const toast = useToast();
const sortOrder = ref({ field: 'updated_at', direction: 'desc' });

const isSendingStatus = reactive({});
const isSendingRegret = reactive({});

const statusOptions = [
  'draft',
  'processing_payment',
  'applied',
  'processing',
  'under_review',
  'approved',
  'regretted',
  'reprocess',
  'reupload',
];

const mappedApplications = computed(() => {
  return props.applications.map((app) => ({
    ...app,
    id: app.id,
    fullName: app.applicants_name,
    emailAddress: app.email_address,
    contactNumber: app.contact_no,
    courseTitle: app.course_title,
    nameOfInstitute: app.name_of_institute,
    country: app.country,
    courseDuration: app.duration_of_course,
    status: app.status,
    updated_at: app.updated_at,
    created_at: app.created_at,
    roq_status_letter: app.roq_status_letter,
    roq_status_letter_sent_date: app.roq_status_letter_sent_date,
    roq_regret_letter: app.roq_regret_letter,
    roq_regret_letter_sent_date: app.roq_regret_letter_sent_date,
  }));
});

const sortedApplications = computed(() => {
  let filtered = [...mappedApplications.value];
  return filtered.sort((a, b) => {
    let aValue, bValue;

    switch (sortOrder.value.field) {
      case 'applicant':
        aValue = a.fullName?.toLowerCase() || '';
        bValue = b.fullName?.toLowerCase() || '';
        break;
      case 'course':
        aValue = a.courseTitle?.toLowerCase() || '';
        bValue = b.courseTitle?.toLowerCase() || '';
        break;
      case 'updated_at':
      case 'created_at':
        aValue = a[sortOrder.value.field] ? new Date(a[sortOrder.value.field]).getTime() : 0;
        bValue = b[sortOrder.value.field] ? new Date(b[sortOrder.value.field]).getTime() : 0;
        break;
      case 'status':
        aValue = a.status?.toLowerCase() || '';
        bValue = b.status?.toLowerCase() || '';
         break;
      default:
        aValue = a[sortOrder.value.field];
        bValue = b[sortOrder.value.field];
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    }

    const modifier = sortOrder.value.direction === 'asc' ? 1 : -1;

    if (aValue < bValue) return -1 * modifier;
    if (aValue > bValue) return 1 * modifier;

    // Secondary sort by updated_at descending if primary values are equal
    const aDate = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const bDate = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    if (aDate < bDate) return 1; // Secondary sort descending
    if (aDate > bDate) return -1;

    return 0;
  });
});

const calculateMonthsAgo = (dateString) => {
    if (!dateString) return Infinity;
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.4375);
        return diffMonths;
    } catch {
        return Infinity;
    }
};

const shouldShowRoqSendButton = (application) => {
    if (application.status !== 'processing' || application.roq_status_letter) {
        return false;
    }
    const monthsAgo = calculateMonthsAgo(application.updated_at);
    return monthsAgo >= 1 && monthsAgo < 2;
};

const shouldShowRegretSendButton = (application) => {
     if (application.status !== 'processing' || application.roq_regret_letter) {
        return false;
    }
    const monthsAgo = calculateMonthsAgo(application.updated_at);
    return monthsAgo >= 2;
};

// Computed properties to control column visibility
const showRoqStatusColumn = computed(() => {
  return props.userRole === 'dealing_officer' &&
         sortedApplications.value.some(app => shouldShowRoqSendButton(app) || app.roq_status_letter);
});

const showRegretColumn = computed(() => {
  return props.userRole === 'dealing_officer' &&
         sortedApplications.value.some(app => shouldShowRegretSendButton(app) || app.roq_regret_letter);
});

const headers = computed(() => {
  const baseHeaders = [
    { key: 'applicant', label: 'Applicant Details', visible: true, sortable: true },
    { key: 'course', label: 'Course Information', visible: true, sortable: true },
    { key: 'status', label: 'Status', visible: true, sortable: true },
    { key: 'roq_status', label: 'ROQ Status', visible: showRoqStatusColumn.value, sortable: false },
    { key: 'roq_regret', label: 'Regret Letter', visible: showRegretColumn.value, sortable: false },
    { key: 'actions', label: 'Actions', visible: true, sortable: false }
  ];
  return baseHeaders;
});

const visibleHeadersCount = computed(() => {
    return headers.value.filter(h => h.visible).length;
});


const formatDate = (date) => {
  if (!date) return 'Not available';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatStatus = (status) => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getStatusClass = (status) => {
  const baseClasses = 'inline-flex items-center px-3.5 py-1.5 text-xs rounded-full font-medium shadow-sm';
  const statusClasses = {
    draft: 'bg-gray-100 text-gray-800',
    processing_payment: 'bg-gray-100 text-gray-800',
    applied: 'bg-blue-100 text-blue-800',
    processing: 'bg-amber-100 text-amber-800',
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
    draft: 'bg-gray-500',
    processing_payment: 'bg-gray-500',
    applied: 'bg-blue-500',
    processing: 'bg-amber-500',
    under_review: 'bg-purple-500',
    approved: 'bg-green-500',
    regretted: 'bg-red-500',
    reprocess: 'bg-orange-500',
    reupload: 'bg-indigo-500',
  };
  return statusClasses[status] || '';
};

const getSortIconClass = (field, direction) => {
  return {
    'text-gray-400': sortOrder.value.field !== field || sortOrder.value.direction !== direction,
    'text-blue-600': sortOrder.value.field === field && sortOrder.value.direction === direction,
    'opacity-30': sortOrder.value.field !== field
  };
};

const handleRoqStatusUpdate = async (application) => {
  if (isSendingStatus[application.id]) return;
  isSendingStatus[application.id] = true;

  try {
    await apiServices.sendStatusUpdate(application.id, {
      roq_status_letter: true,
      roq_status_letter_sent_date: new Date().toISOString()
    });
    toast.success(`Status email update marked as sent for ${application.fullName}.`);
    emit('refresh');
  } catch (error) {
    console.error('Failed to send ROQ status update:', error);
    const errorMsg = error.response?.data?.detail || `Failed to mark status email as sent for ${application.fullName}.`;
    toast.error(errorMsg);
  } finally {
     isSendingStatus[application.id] = false;
  }
};

const handleRegretLetterSend = async (application) => {
  if (isSendingRegret[application.id]) return;
  isSendingRegret[application.id] = true;

  try {
    await apiServices.sendRegretLetter(application.id, {
      roq_regret_letter: true,
      roq_regret_letter_sent_date: new Date().toISOString(),
      status: 'regretted'
    });
    toast.success(`Regret email update marked as sent for ${application.fullName}.`);
    emit('refresh');
  } catch (error) {
    console.error('Failed to send regret letter:', error);
     const errorMsg = error.response?.data?.detail || `Failed to mark regret email as sent for ${application.fullName}.`;
    toast.error(errorMsg);
  } finally {
     isSendingRegret[application.id] = false;
  }
};

const sortBy = (field) => {
   const headerConfig = headers.value.find(h => h.key === field);
   if (!headerConfig || !headerConfig.sortable) return; // Only sort if header is sortable

  if (sortOrder.value.field === field) {
    sortOrder.value.direction = sortOrder.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrder.value = { field, direction: 'asc' };
  }
};

const handleSearch = (event) => {
  emit('search-query-change', event.target.value);
};

const handleFilter = (event) => {
  emit('status-filter-change', event.target.value);
};

const handleAction = ({ action, application }) => {
  emit('action', { action, application });
};

watch(() => props.perPage, (newVal) => {
  localPerPage.value = newVal;
});

watch(() => props.applications, () => {
    // Reset sending status when applications list changes to avoid stale states
    Object.keys(isSendingStatus).forEach(key => delete isSendingStatus[key]);
    Object.keys(isSendingRegret).forEach(key => delete isSendingRegret[key]);
}, { deep: true });
</script>
