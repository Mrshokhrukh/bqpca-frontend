<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8">
    <!-- Use the new PageHeader component -->
    <PageHeader
      title="Track Your CPD Application"
      subtitle="Review the status and details of your submitted CPD applications."
    >
      <template #icon>
        <ListChecks class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center space-y-4">
        <div class="w-24 h-24 bg-blue-200 rounded-full"></div>
        <div class="h-6 bg-blue-300 rounded w-64"></div>
        <div class="h-4 bg-blue-200 rounded w-48"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 class="text-xl font-semibold text-red-700 mb-2">Data Retrieval Error</h3>
      <p class="text-red-600">
        We couldn't fetch your CPD records or supporting data. Please try again later.
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredApplications.length === 0"
      class="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-blue-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No CPD Records</h3>
      <p class="text-gray-600">You haven't submitted any CPD applications yet.</p>
    </div>

    <!-- Application List -->
    <transition-group v-else name="list" tag="div" class="space-y-6">
      <div
        v-for="record in filteredApplications"
        :key="record.id"
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
      >
        <!-- Card Content Area -->
        <div class="p-6">
          <!-- Card Header Section -->
          <div
            class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 mb-4 border-b border-gray-100"
          >
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                <!-- Slightly smaller title -->
                {{ record.title_of_cpd || 'N/A' }}
              </h3>
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-500"
                  >Application ID #{{ record.registration_no || 'N/A' }}</span
                >
              </div>
            </div>

            <div class="flex items-center space-x-3 flex-shrink-0">
              <span
                :class="[
                  record.review_status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : record.review_status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800', // Default to Pending/Yellow
                  'px-3 py-1 rounded-full text-xs font-medium shadow-sm capitalize flex-shrink-0', // Smaller padding/text
                ]"
              >
                {{ record.review_status || 'Pending' }}
              </span>

              <span
                v-if="record.review_status === 'Approved'"
                class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex-shrink-0"
              >
                {{ record.cpd_credit || '0' }} Credits
              </span>
            </div>
          </div>

          <!-- Card Body Grid -->
          <div class="grid md:grid-cols-2 gap-x-6 gap-y-6">
            <!-- Personal Details Section -->
            <div class="space-y-4">
              <h4 class="text-base font-semibold text-gray-800 pb-2 flex items-center">
                <User class="w-5 h-5 mr-2 text-indigo-600" /> Personal Details
              </h4>
              <div class="space-y-3 pl-1">
                <div class="flex items-start space-x-3">
                  <IdCard class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p class="text-xs text-gray-500">Full Name</p>
                    <p class="font-medium text-gray-800 text-sm">{{ record.full_name || 'N/A' }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <CreditCard class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p class="text-xs text-gray-500">CID Number</p>
                    <p class="font-medium text-gray-800 text-sm">{{ record.cid_no || 'N/A' }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Users class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p class="text-xs text-gray-500">Gender</p>
                    <p class="font-medium text-gray-800 text-sm capitalize">
                      {{ record.gender ? record.gender.toLowerCase() : 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Insights Section -->
            <div class="space-y-4">
              <h4 class="text-base font-semibold text-gray-800 pb-2 flex items-center">
                <GraduationCap class="w-5 h-5 mr-2 text-indigo-600" /> Activity Insights
              </h4>
              <div class="space-y-3 pl-1">
                <div class="flex items-start space-x-3">
                  <BookOpen class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p class="text-xs text-gray-500">Activity Type</p>
                    <p class="font-medium text-gray-800 text-sm">
                      {{ getActivityTypeName(record.type_of_cpd_activity) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Target class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p class="text-xs text-gray-500">Relevance</p>
                    <p class="font-medium text-gray-800 text-sm">
                      {{ record.relevance_to_profession || 'N/A' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Calendar class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p class="text-xs text-gray-500">Submission Date</p>
                    <p class="font-medium text-gray-800 text-sm">
                      {{ formatDisplayDate(record.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attachment Section (No Download Button) -->
        <div class="border-t border-gray-200 mt-4 px-6 py-4">
          <div v-if="record.attachment" class="flex items-center space-x-3">
            <FileText class="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span class="font-medium text-gray-700 text-sm">Supporting Document Attached</span>
            <!-- Optional: Display filename if available and useful -->
            <!-- <span class="text-xs text-gray-500 italic ml-1">({{ getFileName(record.attachment) }})</span> -->
            <a
              :href="record.attachment"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800 hover:underline text-sm ml-auto font-medium"
            >
              View Document
            </a>
          </div>
          <div v-else class="flex items-center space-x-3 text-gray-500">
            <FileText class="w-5 h-5 flex-shrink-0" />
            <span class="text-sm italic">No supporting document attached.</span>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import {
  FileText,
  IdCard,
  User,
  Users,
  CreditCard,
  Calendar,
  GraduationCap,
  BookOpen,
  Target,
  ListChecks,
  // Download icon is no longer needed here unless used elsewhere
} from 'lucide-vue-next'

// --- State ---
const applications = ref([])
const cpdActivityTypesMasterList = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const authStore = useAuthStore()

// --- Computed Properties ---
const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    console.warn('User or User CID not available for filtering CPD records.')
    return []
  }
  const userCid = authStore.user.cid
  // Sort by creation date, newest first
  return applications.value
    .filter((app) => app.cid_no === userCid)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Added sorting
})

// --- Methods ---
const fetchCpdRecords = async () => {
  try {
    // Assuming pagination might exist, fetch all relevant records if needed
    // Adjust limit/offset or handle pagination if API supports it
    const response = await apiService.getMhpcCpdRecords({ limit: 1000 }) // Example: Fetch up to 1000 records
    if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results
      console.log(`Fetched ${applications.value.length} CPD records.`)
    } else {
      console.error('API did not return an array of results for CPD records:', response.data)
      applications.value = []
      apiError.value = true
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    applications.value = []
    apiError.value = true
  }
}

const fetchCpdActivityTypes = async () => {
  try {
    const response = await apiService.getMhpcMastersCpdActivities({ limit: 1000 }) // Fetch all types
    if (response.data && Array.isArray(response.data.results)) {
      cpdActivityTypesMasterList.value = response.data.results
      console.log(`Fetched ${cpdActivityTypesMasterList.value.length} CPD Activity Types.`)
    } else {
      console.error('API did not return an array of results for CPD Activity Types:', response.data)
      cpdActivityTypesMasterList.value = []
      // Decide if this error should block the whole page or just affect type name display
      // apiError.value = true; // Maybe not fatal?
    }
  } catch (error) {
    console.error('Error fetching CPD Activity Types:', error)
    cpdActivityTypesMasterList.value = []
    // apiError.value = true; // Maybe not fatal?
  }
}

const getActivityTypeName = (activityId) => {
  if (!activityId) return 'N/A'
  if (cpdActivityTypesMasterList.value.length === 0) {
    console.warn('CPD Activity Types list is empty, cannot map ID:', activityId)
    return `ID: ${activityId}` // Return ID if list isn't loaded
  }
  const activityType = cpdActivityTypesMasterList.value.find((type) => type.id === activityId)
  return activityType ? activityType.cpd_activity_name : `Unknown Type (ID: ${activityId})` // More informative fallback
}

const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    // More robust date formatting
    return new Intl.DateTimeFormat('en-GB', {
      // Example: Use UK format DD/MM/YYYY
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // Optional: Add time if needed
      // hour: '2-digit',
      // minute: '2-digit',
    }).format(new Date(dateString))
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

// Optional: Helper to get filename from URL
// const getFileName = (url) => {
//   if (!url) return '';
//   try {
//     const path = new URL(url).pathname;
//     return path.substring(path.lastIndexOf('/') + 1);
//   } catch (e) {
//     console.error("Error extracting filename from URL:", url, e);
//     return 'document'; // Fallback filename
//   }
// }

// --- Lifecycle Hook ---
onMounted(async () => {
  isLoading.value = true
  apiError.value = false // Reset error state on mount

  // Fetch data concurrently
  const results = await Promise.allSettled([fetchCpdRecords(), fetchCpdActivityTypes()])

  // Check if any critical fetch failed
  if (results[0].status === 'rejected') {
    // Check if fetching records failed
    apiError.value = true
  }
  // You might decide fetchCpdActivityTypes failing isn't critical enough to set apiError = true

  isLoading.value = false
})
</script>

<style scoped>
/* List Transition Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Slightly smaller translate */
}

/* Ensure icons align nicely */
.flex svg {
  flex-shrink: 0; /* Prevent icons from shrinking */
}

/* Consistent vertical alignment for icon/text pairs */
.flex.items-start > svg {
  margin-top: 0.125rem; /* Adjust as needed for alignment with text-sm */
}
</style>
