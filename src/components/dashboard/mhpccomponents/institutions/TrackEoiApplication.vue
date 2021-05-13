<template>
  <div class="w-full mx-auto px-6 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Your EOI Applications"
      subtitle="View and manage all your Expression of Interest applications"
      :show-actions="false"
    />

    <div v-if="isLoading" class="flex justify-center my-12">
      <Loader class="inline-block animate-spin text-indigo-600 w-8 h-8" />
    </div>

    <div v-else-if="applications?.length > 0" class="space-y-8">
      <div
        v-for="application in applications"
        :key="application.id"
        class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
      >
        <div class="p-8">
          <div class="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center">
                {{ application.name_of_institution }}
                <span
                  :class="[
                    'ml-3 px-3 py-1 text-sm font-medium rounded-full',
                    getStatusColor(application.review_decision),
                  ]"
                >
                  {{ application.review_decision }}
                </span>
              </h3>
              <p class="text-sm text-gray-500">CID: {{ application.CID }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">Course Details</p>
              <p class="text-sm text-gray-600">{{ application.title_of_course }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <div>
              <p class="text-sm font-semibold text-gray-900">Contact Details</p>
              <p class="text-sm text-gray-600">{{ application.contact_no }}</p>
              <p class="text-sm text-gray-600">{{ application.email_address }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Location</p>
              <p class="text-sm text-gray-600">
                {{ application.dzongkhag }}, {{ application.gewog }}
              </p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Course Start Date</p>
              <p class="text-sm text-gray-600">
                {{ new Date(application.commencement_date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center space-x-8">
                <div>
                  <p class="text-sm font-semibold text-gray-900">Program Type</p>
                  <p class="text-sm text-gray-600">
                    {{ application.type_of_programme === 'D' ? 'Diploma' : 'Bachelor' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">Duration</p>
                  <p class="text-sm text-gray-600">{{ application.course_duration }} months</p>
                </div>
                <div v-if="application.review_decision === 'Rejected'">
                  <p class="text-sm font-semibold text-gray-900">Rejection Reason</p>
                  <p class="text-sm text-red-600">
                    {{ application.reason_if_rejected }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="application.review_decision === 'Approved'"
            class="mt-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200"
          >
            Congratulations! You can now proceed to DRP Application.
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!isLoading && !apiError"
      class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <p class="text-gray-600 text-lg">No EOI applications found in the system.</p>
    </div>
    <div
      v-else-if="apiError"
      class="text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-sm"
    >
      <p class="text-red-600 text-lg">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'

const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800'
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    isLoading.value = false
    return
  }

  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    const response = await apiServices.getMhpcInstitutes()

    if (response && response.data && Array.isArray(response.data.results)) {
      const userCid = authStore.user.cid
      applications.value = response.data.results.filter(
        (app) => app.CID && app.CID.toLowerCase() === userCid.toLowerCase(),
      )
    } else {
      applications.value = []
      if (response && response.data && !Array.isArray(response.data.results)) {
        console.warn('Expected results to be an array, but received:', response.data.results)
      }
    }
  } catch (error) {
    console.error('Error fetching EOI applications:', error)
    applications.value = []
    apiError.value = true
    errorMessage.value =
      error.response?.data?.message || 'Error fetching your applications. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchApplications)
</script>
