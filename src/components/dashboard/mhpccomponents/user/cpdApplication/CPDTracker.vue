<template>
  <div class="w-full mx-auto px-4 py-8">
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Track Your CPD Application</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">Your CPD application status.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center space-y-4">
        <div class="w-24 h-24 bg-blue-200 rounded-full"></div>
        <div class="h-6 bg-blue-300 rounded w-64"></div>
        <div class="h-4 bg-blue-200 rounded w-48"></div>
      </div>
    </div>

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

    <div
      v-else-if="filteredApplications.length === 0"
      class="bg-white shadow-lg rounded-xl p-8 text-center"
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

    <transition-group v-else name="list" tag="div" class="space-y-6">
      <div
        v-for="record in filteredApplications"
        :key="record.id"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
          <div
            class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0"
          >
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ record.title_of_cpd || 'N/A' }}
              </h3>
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-600"
                  >Application ID #{{ record.registration_no || 'N/A' }}</span
                >
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <span
                :class="[
                  record.review_status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : record.review_status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800', // Default to Pending/Yellow
                  'px-4 py-2 rounded-full text-sm font-medium shadow-sm capitalize', // Added capitalize
                ]"
              >
                {{ record.review_status || 'Pending' }}
              </span>

              <span
                v-if="record.review_status === 'Approved'"
                class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
              >
                {{ record.cpd_credit || '0' }} Credits
              </span>
            </div>
          </div>
        </div>

        <div class="p-6 grid md:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
              <User class="w-5 h-5 mr-2 text-blue-600" /> Personal Details
            </h4>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <IdCard class="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div>
                  <p class="text-xs text-gray-600">Full Name</p>
                  <p class="font-medium text-gray-900">{{ record.full_name || 'N/A' }}</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <CreditCard class="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div>
                  <p class="text-xs text-gray-600">CID Number</p>
                  <p class="font-medium text-gray-900">{{ record.cid_no || 'N/A' }}</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <Users class="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div>
                  <p class="text-xs text-gray-600">Gender</p>
                  <p class="font-medium text-gray-900 capitalize">
                    {{ record.gender ? record.gender.toLowerCase() : 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
              <GraduationCap class="w-5 h-5 mr-2 text-blue-600" /> Activity Insights
            </h4>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <BookOpen class="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div>
                  <p class="text-xs text-gray-600">Activity Type</p>
                  <p class="font-medium text-gray-900">
                    {{ getActivityTypeName(record.type_of_cpd_activity) }}
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <Target class="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div>
                  <p class="text-xs text-gray-600">Relevance</p>
                  <p class="font-medium text-gray-900">
                    {{ record.relevance_to_profession || 'N/A' }}
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <Calendar class="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div>
                  <p class="text-xs text-gray-600">Submission Date</p>
                  <p class="font-medium text-gray-900">
                    {{ formatDisplayDate(record.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="record.attachment"
          class="bg-gray-100 p-6 flex items-center justify-between border-t"
        >
          <div class="flex items-center space-x-3">
            <FileText class="w-5 h-5 text-blue-600" />
            <span class="font-medium text-gray-900 text-sm">Supporting Document</span>
          </div>
          <a
            :href="record.attachment"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-sm"
          >
            <Download class="w-4 h-4 mr-2 group-hover:animate-bounce" /> Download
          </a>
        </div>
        <div v-else class="bg-gray-100 p-6 flex items-center justify-start border-t">
          <div class="flex items-center space-x-3 text-gray-500">
            <FileText class="w-5 h-5" />
            <span class="text-sm italic">No supporting document attached.</span>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/services/services' // Assuming path is correct
import { useAuthStore } from '@/stores/authStore' // Assuming path is correct
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
  Download,
} from 'lucide-vue-next' // Ensure lucide-vue-next is installed

// --- State ---
const applications = ref([]) // Holds raw CPD records fetched from API
const cpdActivityTypesMasterList = ref([]) // Holds the master list of Activity Types {id, cpd_activity_name}
const isLoading = ref(false) // Tracks loading state for API calls
const apiError = ref(false) // Tracks if an API error occurred
const authStore = useAuthStore() // Access user data

// --- Computed Properties ---

// Filter applications to show only those belonging to the logged-in user
const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    console.warn('User or User CID not available for filtering CPD records.')
    return [] // Return empty if user or cid is not available
  }
  const userCid = authStore.user.cid
  return applications.value.filter((app) => app.cid_no === userCid)
})

// --- Methods ---

// Fetch CPD Records for the user
const fetchCpdRecords = async () => {
  try {
    const response = await apiService.getMhpcCpdRecords() // Endpoint to get CPD records
    if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results
      console.log(`Fetched ${applications.value.length} CPD records.`)
    } else {
      console.error('API did not return an array of results for CPD records:', response.data)
      applications.value = []
      apiError.value = true // Indicate an issue with data format
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    applications.value = [] // Reset on error
    apiError.value = true // Set error flag
  }
}

// Fetch Master List of CPD Activity Types
const fetchCpdActivityTypes = async () => {
  try {
    const response = await apiService.getMhpcMastersCpdActivities() // Use the correct service method
    if (response.data && Array.isArray(response.data.results)) {
      cpdActivityTypesMasterList.value = response.data.results
      console.log(`Fetched ${cpdActivityTypesMasterList.value.length} CPD Activity Types.`)
    } else {
      console.error('API did not return an array of results for CPD Activity Types:', response.data)
      cpdActivityTypesMasterList.value = []
      // Optionally set apiError=true if this list is critical
    }
  } catch (error) {
    console.error('Error fetching CPD Activity Types:', error)
    cpdActivityTypesMasterList.value = []
    // Optionally set apiError=true if this list is critical
    apiError.value = true // Set error if master list fails, as names can't be shown
  }
}

// Lookup function to get Activity Type Name from ID
const getActivityTypeName = (activityId) => {
  if (!activityId || cpdActivityTypesMasterList.value.length === 0) {
    return activityId || 'N/A' // Return ID or N/A if list not loaded or ID missing
  }
  // Find the activity type object in the master list
  const activityType = cpdActivityTypesMasterList.value.find((type) => type.id === activityId)
  // Return the name if found, otherwise return the ID as fallback
  return activityType ? activityType.cpd_activity_name : `Unknown ID: ${activityId}`
}

// Helper function to format dates for display
const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

// --- Lifecycle Hook ---
onMounted(async () => {
  isLoading.value = true
  apiError.value = false // Reset error on mount

  // Fetch both CPD records and the master list concurrently
  await Promise.allSettled([
    fetchCpdRecords(),
    fetchCpdActivityTypes(), // Fetch the activity types master list
  ])

  isLoading.value = false // Set loading to false after all fetches attempt
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
  transform: translateY(30px);
}

/* Optional: Style for absolute positioning during leave transition */
/* .list-leave-active {
  position: absolute;
  width: 100%; /* Adjust as needed */
/* } */

/* Ensure icons align nicely with text */
.flex svg {
  flex-shrink: 0;
  /* Prevent icons from shrinking */
}
</style>
