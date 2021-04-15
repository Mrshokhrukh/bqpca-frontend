<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Course Details</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-if="!loading && !error" class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Title
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commencement
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="course in courses" :key="course.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ course.course_title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ course.duration_in_months }} months</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(course.commencement_date) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                'bg-green-100 text-green-800': course.is_active,
                'bg-red-100 text-red-800': !course.is_active,
              }">
                {{ course.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openViewModal(course)" class="text-blue-600 hover:text-blue-900">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Modal -->
    <div v-if="viewModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Course Details</h3>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <!-- Course Details -->
            <div class="sm:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-2">Basic Information</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Course Title</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourse.course_title }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Duration</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedCourse.duration_in_months }} months
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Commencement Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.commencement_date) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span :class="{
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                      'bg-green-100 text-green-800': selectedCourse.is_active,
                      'bg-red-100 text-red-800': !selectedCourse.is_active,
                    }">
                      {{ selectedCourse.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Dates -->
            <div class="sm:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-2">Validity Period</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Valid Since</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.valid_since) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Valid Till</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.valid_till) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Created At</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.created_at) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.updated_at) }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Additional Information -->
            <div class="sm:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-2">Additional Information</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Remarks</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourse.remarks || 'N/A' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Institute Declaration</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedCourse.ins_declaration ? 'Yes' : 'No' }}
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Review Decision</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedCourse.ins_review_decision || 'N/A' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="closeViewModal" type="button"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import services from '@/services/services.js'

const courses = ref([])
const loading = ref(true)
const error = ref(null)
const viewModalOpen = ref(false)
const selectedCourse = ref(null)

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Fetch courses
const fetchCourses = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await services.getEpcCourseDetails()

    // The actual courses are in response.data.results
    courses.value = response.data.results
  } catch (err) {
    error.value = 'Failed to fetch courses. Please try again later.'
    console.error('Error fetching courses:', err)
  } finally {
    loading.value = false
  }
}

// Open view modal
const openViewModal = (course) => {
  selectedCourse.value = course
  viewModalOpen.value = true
}

// Close view modal
const closeViewModal = () => {
  viewModalOpen.value = false
  selectedCourse.value = null
}

// Fetch courses when component mounts
onMounted(() => {
  fetchCourses()
})
</script>
