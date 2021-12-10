<template>
  <div class="w-full mx-auto px-4 py-8">
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Your EOI Applications</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        View all your Expression of Interest applications
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
    </div>

    <div v-else-if="applications?.length > 0" class="space-y-6">
      <div
        v-for="application in applications"
        :key="application.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ application.name_of_institution }}
                <span
                  :class="[
                    'ml-2 px-2 py-1 text-xs rounded-full',
                    getStatusColor(application.review_decision),
                  ]"
                >
                  {{ application.review_decision }}
                </span>
              </h3>
              <p class="text-sm text-gray-500 mb-4">CID: {{ application.CID }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Course Details</p>
              <p class="text-sm text-gray-500">{{ application.title_of_course }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <p class="text-sm font-medium text-gray-900">Contact Details</p>
              <p class="text-sm text-gray-500">{{ application.contact_no }}</p>
              <p class="text-sm text-gray-500">{{ application.email_address }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Location</p>
              <p class="text-sm text-gray-500">
                {{ application.dzongkhag }}, {{ application.gewog }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Course Start Date</p>
              <p class="text-sm text-gray-500">
                {{ new Date(application.commencement_date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div>
                  <p class="text-sm font-medium text-gray-900">Program Type</p>
                  <p class="text-sm text-gray-600">
                    {{ application.type_of_programme === 'D' ? 'Diploma' : 'Bachelor' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Duration</p>
                  <p class="text-sm text-gray-600">{{ application.course_duration }} months</p>
                </div>
                <div v-if="application.review_decision === 'Rejected' || application.review_decision === 'Regretted'">
                  <p class="text-sm font-medium text-gray-900">Rejection Reason</p>
                  <p class="text-sm text-red-600">
                    {{ application.reason_if_rejected }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-2">
                <!-- Reapply Button (for rejected/regretted applications) -->
                <button
                  v-if="canReapply(application)"
                  @click="handleReapply(application)"
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reapply
                </button>

                <!-- View Details Button (Optional) -->
                <button
                  @click="viewApplicationDetails(application)"
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Details
                </button>
              </div>
            </div>
          </div>

          <!-- Approved Status Message -->
          <div
            v-if="application.review_decision === 'Approved'"
            class="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center justify-between"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Your EOI is approved! You can now proceed to DPR Application</span>
            </div>
            <button
              @click="goToDPRApplication(application)"
              class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Apply for DPR
            </button>
          </div>

          <!-- Rejected Status Message -->
          <div
            v-if="canReapply(application)"
            class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span class="text-yellow-700">Your application was rejected. You can submit a new application with corrected information.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!isLoading && !apiError"
      class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
    >
      <div class="mb-6">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-600 mb-2">You don't have any EOI applications yet.</p>
        <p class="text-gray-500 text-sm mb-6">Start by submitting an Expression of Interest application.</p>
        <button
          @click="goToNewApplication"
          class="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Submit New EOI Application
        </button>
      </div>
    </div>
    <div v-else-if="apiError" class="text-center py-12 bg-red-100 rounded-xl border border-red-200">
      <p class="text-red-600">{{ errorMessage }}</p>
      <button
        @click="fetchApplications"
        class="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')

// Helper function to check if user can reapply
const canReapply = (application) => {
  const rejectedStatuses = ['Rejected', 'Regretted'];
  return rejectedStatuses.includes(application.review_decision);
}

// Method to handle reapply
const handleReapply = (application) => {
  if (canReapply(application)) {
    // Store the rejected/regretted application ID for reference
    sessionStorage.setItem('rejectedApplicationId', application.id);
    sessionStorage.setItem('rejectedApplicationStatus', application.review_decision);

    // Navigate to EOI application form with reapply context
    router.push({
      path: '/admin/institutions/engineering_certification/apply_for_eoi',
      query: {
        reapply: 'true',
        rejected_app_id: application.id,
        status: application.review_decision.toLowerCase()
      }
    })
  }
}

// Optional: View application details
const viewApplicationDetails = (application) => {
  // You can implement a modal or separate page for detailed view
  console.log('View details for application:', application)
  // Example: router.push(`/application/${application.id}`)
}

// Optional: Go to DPR application
const goToDPRApplication = (application) => {
  // Navigate to DPR application form
  router.push(`/admin/institutions/engineering_certification/apply_for_dpr?institute_id=${application.id}`)
}

// Optional: Go to new application
const goToNewApplication = () => {
  router.push('/admin/institutions/engineering_certification/apply_for_eoi')
}

// Update getStatusColor to handle Regretted status
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-700'
    case 'Rejected':
    case 'Regretted':
      return 'bg-red-100 text-red-700'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Method to fetch applications from the API
const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    return
  }

  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    const response = await apiServices.getEpcInstitutes()

    if (response && response.data && response.data.results) {
      const userCid = authStore.user.cid
      const userApplications = response.data.results.filter((app) => {
        return app.CID?.toLowerCase() === userCid.toLowerCase()
      })

      applications.value = userApplications
    }
  } catch (error) {
    console.error('Error fetching EOI applications:', error)
    applications.value = []
    apiError.value = true
    errorMessage.value =
      error.response?.data?.message ||
      'An error occurred while fetching your applications. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchApplications)
</script>