<template>
  <div class="min-h-screen">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div v-if="institute" class="bg-white rounded-3xl shadow-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white relative">
          <!-- Institute Name (Large and Centered) -->
          <h1 class="text-4xl font-extrabold text-center mb-4">
            {{ institute.name_of_institution }}
          </h1>

          <!-- Website (if available, styled as a link) -->
          <p v-if="institute.website" class="text-center text-blue-100 hover:underline">
            <a
              :href="institute.website"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
              {{ institute.website }}
            </a>
          </p>

          <!-- Head of Institution (Subtle, smaller text) -->
          <p class="text-center text-sm mt-4 text-blue-200">
            Headed by: {{ institute.head_of_institution_name }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <!-- Left Column: Contact Information -->
          <div class="md:col-span-1">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Contact Information</h2>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600 font-medium">Address:</p>
                <p class="text-gray-800">
                  {{ institute.address }}, {{ institute.village }}, {{ institute.gewog }},
                  {{ institute.dzongkhag }}
                </p>
              </div>
              <div>
                <p class="text-gray-600 font-medium">Email:</p>
                <p class="text-gray-800 hover:text-blue-600">
                  <a :href="`mailto:${institute.head_of_institution_email}`">
                    {{ institute.head_of_institution_email }}</a
                  >
                </p>
              </div>
              <div>
                <p class="text-gray-600 font-medium">Phone:</p>
                <p class="text-gray-800">{{ institute.head_of_institution_phone_number }}</p>
              </div>
            </div>
          </div>

          <!-- Middle Column: Program Details -->
          <div class="md:col-span-1">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Program Overview</h2>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600 font-medium">Course:</p>
                <p class="text-gray-800">{{ institute.title_of_course }}</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium">Duration:</p>
                <p class="text-gray-800">{{ institute.course_duration }} Months</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium">Commencement Date:</p>
                <p class="text-gray-800">{{ formattedCommencementDate }}</p>
              </div>
              <div>
                <p class="text-gray-600 font-medium">Program Type:</p>
                <p class="text-gray-800">
                  {{ institute.type_of_programme === 'D' ? 'Diploma' : 'Other' }}
                </p>
                <!--  Handles 'D' for diploma. Add more as needed. -->
              </div>
            </div>
          </div>

          <!-- Right Column:  Status and Validity -->
          <div class="md:col-span-1">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Status & Validity</h2>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600 font-medium">Review Decision:</p>
                <p
                  :class="{
                    'text-green-600': institute.review_decision === 'Approved',
                    'text-yellow-600': institute.review_decision === 'Pending',
                    'text-red-600':
                      institute.review_decision !== 'Approved' &&
                      institute.review_decision !== 'Pending',
                    'font-semibold': true,
                  }"
                >
                  {{ institute.review_decision }}
                </p>
              </div>
              <div v-if="institute.valid_since && institute.valid_till">
                <p class="text-gray-600 font-medium">Valid From:</p>
                <p class="text-gray-800">{{ formattedValidSince }}</p>
                <p class="text-gray-600 font-medium">Valid Until:</p>
                <p class="text-gray-800">{{ formattedValidTill }}</p>
              </div>
              <div v-else class="text-gray-500 italic">Validity information not available.</div>
              <div>
                <p class="text-gray-600 font-medium">Remarks:</p>
                <p class="text-gray-800">{{ institute.remarks }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="bg-gray-50 p-8">
          <h2 class="text-2xl font-bold text-gray-700 mb-4">Supporting Documents</h2>
          <div v-if="institute.supporting_documents" class="mt-2">
            <a
              :href="institute.supporting_documents"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>

              View Document
            </a>
          </div>
          <p v-else class="text-gray-500 italic">No supporting documents available.</p>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-gray-600 text-xl">Loading institute profile...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const institute = ref(null)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const errorMessage = ref('')

const formattedCommencementDate = computed(() => {
  return institute.value?.commencement_date ? formatDate(institute.value.commencement_date) : 'N/A'
})

const formattedValidSince = computed(() => {
  return institute.value?.valid_since ? formatDate(institute.value.valid_since) : 'N/A'
})

const formattedValidTill = computed(() => {
  return institute.value?.valid_till ? formatDate(institute.value.valid_till) : 'N/A'
})

const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const fetchInstitute = async () => {
  try {
    const response = await apiServices.getEpcInstitutes()

    // Corrected validation check: Access 'results' through response.data
    if (
      !response ||
      !response.data ||
      !response.data.results ||
      !Array.isArray(response.data.results)
    ) {
      console.error("Error: Invalid API response. Expected 'results' array.", response)
      errorMessage.value = 'Failed to load institute data. Please try again later.'
      return
    }

    // Check if user and user.cid is available
    if (!user.value || !user.value.cid) {
      console.error('Error: User CID is not available.')
      errorMessage.value = 'User information is missing. Please log in again.'
      return
    }

    // Access 'results' through response.data
    institute.value = response.data.results.find((inst) => inst.CID === user.value.cid)

    // Check if the institute is found or not
    if (!institute.value) {
      console.error(
        `Institute with CID ${user.value.cid} not found in the API response`,
        response.data.results,
      )
      errorMessage.value = `Institute profile not found.`
      return
    }
  } catch (error) {
    console.error('Error fetching institutes:', error)
    // More specific error handling (same as before - no changes needed here)
    if (error.response) {
      console.error('Server Error:', error.response.status, error.response.data)
      errorMessage.value = `Server error (${error.response.status}). Please try again later.`
    } else if (error.request) {
      console.error('Network Error:', error.request)
      errorMessage.value = 'Network error. Please check your internet connection.'
    } else {
      console.error('Request Error:', error.message)
      errorMessage.value = 'An unexpected error occurred. Please try again.'
    }
  }
}

onMounted(() => {
  fetchInstitute()
})
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
