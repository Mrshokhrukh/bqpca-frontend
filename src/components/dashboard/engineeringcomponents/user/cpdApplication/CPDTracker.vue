<template>
  <div class="mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Track Your CPD Applications</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Monitor the status of your Continuing Professional Development submissions.
      </p>
    </div>

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
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="text-xl font-semibold text-red-700 mb-2">Data Retrieval Error</h3>
      <p class="text-red-600">We couldn't fetch your CPD records. Please try again later.</p>
    </div>

    <!-- No Applications State -->
    <div v-else-if="filteredApplications.length === 0 && userCpdParticipantRecords.length === 0"
      class="bg-white shadow-lg rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-blue-500 mb-4" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No CPD Records</h3>
      <p class="text-gray-600">You haven't submitted any CPD applications yet.</p>
    </div>

    <!-- Data Display Section -->
    <div v-else>
      <!-- Total Approved Credits -->
      <div class="bg-white shadow-lg rounded-xl p-6 mb-8 text-center border border-gray-200">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Total Approved Credits</h3>
        <p class="text-4xl font-extrabold text-blue-600 tracking-tight">
          {{ totalApprovedCredits }}
        </p>
        <p class="text-gray-500 mt-2">
          This is the sum of all your approved CPD credits.
        </p>
      </div>

      <!-- Applications List for SELF CPD-->
      <transition-group v-if="filteredApplications.length > 0" name="list" tag="div" class="space-y-6">
        <div v-for="(record, index) in filteredApplications" :key="index"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
          <!-- Header with Status and Credits -->
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2"> CPD Title: {{ record.title_of_cpd }}</h3>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">Registration No. # {{
                    record.registration_no_details.registration_no
                    ||
                    'N/A' }}</span>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <!-- Status Badge with Dynamic Coloring -->
                <span :class="[
                  record.review_status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : record.review_status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800',
                  'px-4 py-2 rounded-full text-sm font-medium shadow-sm',
                ]">
                  {{ record.review_status || 'Pending' }}
                </span>
                <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {{ record.cpd_credit }} Credits
                </span>
              </div>
            </div>
          </div>

          <!-- Detailed Information Grid -->
          <div class="p-6 grid md:grid-cols-2 gap-6">
            <!-- Personal Information Section -->
            <div class="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                <User class="w-6 h-6 mr-3 text-blue-600" />
                Personal Details
              </h4>
              <div class="space-y-3">
                <div class="flex items-center space-x-4">
                  <IdCard class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Full Name</p>
                    <p class="font-medium text-gray-900">
                      {{ record.full_name || authStore.fullName }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <CreditCard class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">CID Number</p>
                    <p class="font-medium text-gray-900">
                      {{ record.cid_no || authStore.user?.cid }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Users class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Completed Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(record.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>


            <!-- Activity Details Section -->
            <div class="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                <GraduationCap class="w-6 h-6 mr-3 text-blue-600" />
                Activity Insights
              </h4>
              <div class="space-y-3">
                <div class="flex items-center space-x-4">
                  <BookOpen class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Relevance to Profession</p>
                    <p class="font-medium text-gray-900">
                      {{ record.relevance_to_profession || 'Not specified' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Target class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Activity Type</p>
                    <p class="font-medium text-gray-900">
                      {{ record.type_of_cpd_activity_display || 'Not specified' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Calendar class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Submission Date</p>
                    <p class="font-medium text-gray-900">
                      {{ formatDate(record.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Remarks Section (if any) -->
          <div v-if="record.remark" class="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <MessageCircle class="w-5 h-5 mr-2 text-blue-600" />
              Reviewer Comments
            </h4>
            <p class="text-gray-700 italic">{{ record.remark }}</p>
          </div>

          <div class="bg-gray-100 p-6 flex items-center justify-between border-t">
            <div class="flex items-center space-x-3">
              <FileText class="w-6 h-6 text-blue-600" />
              <span class="font-medium text-gray-900">Supporting Document</span>
            </div>
            <a v-if="record.attachment" :href="record.attachment" target="_blank"
              class="group flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out">
              <Download class="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download
            </a>
            <span v-else class="text-gray-500 italic">No attachment available</span>
          </div>
        </div>
      </transition-group>

      <!-- Applications List for CPD -->
      <transition-group v-if="userCpdParticipantRecords.length > 0" name="list" tag="div" class="space-y-6 mt-6">
        <div v-for="({ participant, task }) in userCpdParticipantRecords" :key="participant.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  CPD Title: {{ task?.title_of_cpd || 'N/A' }}
                </h3>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">
                    Registration No. # {{ participant.participant_reg_no || 'N/A' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="[
                  participant.review_status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : participant.review_status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800',
                  'px-4 py-2 rounded-full text-sm font-medium shadow-sm',
                ]">
                  {{ participant.review_status || 'Pending' }}
                </span>
                <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {{ participant.cpd_credits || 0 }} Credits
                </span>
              </div>
            </div>
          </div>
          <!-- Details -->
          <div class="p-6 grid md:grid-cols-2 gap-6">

            <div class="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                <User class="w-6 h-6 mr-3 text-blue-600" />
                Personal Details
              </h4>
              <div class="space-y-3">
                <div class="flex items-center space-x-4">
                  <IdCard class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Full Name</p>
                    <p class="font-medium text-gray-900">{{ authStore.fullName || 'N/A' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <CreditCard class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">CID Number</p>
                    <p class="font-medium text-gray-900">{{ authStore.user?.cid || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Activity Insights -->
            <div class="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                <GraduationCap class="w-6 h-6 mr-3 text-blue-600" />
                Activity Insights
              </h4>
              <div class="space-y-3">
                <div class="flex items-center space-x-4">
                  <BookOpen class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Venue</p>
                    <p class="font-medium text-gray-900">{{ task?.venue || 'N/A' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Calendar class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">From Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(task?.from_date) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Calendar class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">To Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(task?.to_date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Remarks -->
          <div v-if="participant.review_remarks" class="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <MessageCircle class="w-5 h-5 mr-2 text-blue-600" />
              Reviewer Comments
            </h4>
            <p class="text-gray-700 italic">{{ participant.review_remarks }}</p>
          </div>
          <!-- Attachments -->
          <div class="bg-gray-100 p-6 flex items-center justify-between border-t">
            <div class="flex items-center space-x-3">
              <FileText class="w-6 h-6 text-blue-600" />
              <span class="font-medium text-gray-900">Course Document</span>
            </div>
            <a v-if="task?.course_document" :href="task.course_document" target="_blank"
              class="group flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out">
              <Download class="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download
            </a>
            <span v-else class="text-gray-500 italic">No document available</span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
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
  MessageCircle,
} from 'lucide-vue-next'

// State
const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const authStore = useAuthStore()
const learningMethods = ref([])
const cpdTaskParticipants = ref([])
const cpdTasks = ref([])

const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return []
  }

  return applications.value.filter(
    (app) => app.cid_no === authStore.user.cid && !app.is_draft
  )
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid Date'
  }
}

const fetchLearningMethods = async () => {
  try {
    const response = await apiServices.getEpcCpdTaskLearningMethods()

    if (response.data && response.data.results) {
      learningMethods.value = response.data.results.map((method) => ({
        id: method.id,
        name: method.name || method.description || `Method ${method.id}`,
      }))
    } else if (Array.isArray(response.data)) {
      learningMethods.value = response.data.map((method) => ({
        id: method.id,
        name: method.name || method.description || `Method ${method.id}`,
      }))
    }
  } catch (error) {
    console.error('Error fetching learning methods:', error)
    // Fallback values if API fails
    learningMethods.value = [
      { id: 1, name: 'Workshop' },
      { id: 2, name: 'Seminar' },
      { id: 3, name: 'Online Course' },
      { id: 4, name: 'Conference' },
    ]
  }
}

const fetchApplications = async () => {
  isLoading.value = true
  apiError.value = false

  try {
    const response = await apiServices.getEpcCpdRecordsByCid(authStore.user.cid)
    console.log('API Response okoko:', response)
    if (response.data && Array.isArray(response.data)) {
      applications.value = response.data
    } else if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else {
      applications.value = []
      apiError.value = true
    }


  } catch (error) {
    console.error('Error fetching CPD applications:', error)
    applications.value = []
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

const fetchCpdTaskParticipants = async () => {
  try {
    const response = await apiServices.getEpcCpdTaskParticipants()
    cpdTaskParticipants.value = response.data.results || []
  } catch (error) {
    console.error('Error fetching CPD task participants:', error)
  }
}

const fetchCpdTasks = async () => {
  try {
    const response = await apiServices.getEpcCpdTasks()
    cpdTasks.value = response.data.results || []
  } catch (error) {
    console.error('Error fetching CPD tasks:', error)
  }
}

const userRegistrationNo = computed(() => {
  return applications.value[0]?.registration_no_details?.registration_no || null
})

const userCpdParticipantRecords = computed(() => {
  if (!userRegistrationNo.value) return []
  return cpdTaskParticipants.value
    .filter(p => p.participant_reg_no === userRegistrationNo.value)
    .map(participant => {
      const task = cpdTasks.value.find(t => t.id === participant.cpd_task_id)

      const application = applications.value.find(
        app => app.registration_no_details?.registration_no === participant.participant_reg_no
      )
      return { participant, task, application }
    })
})

const totalApprovedCredits = computed(() => {
  const approvedSelfCpd = filteredApplications.value
    .filter(app => app.review_status === 'Approved')
    .reduce((total, app) => total + (app.cpd_credit || 0), 0);

  const approvedParticipantCpd = userCpdParticipantRecords.value
    .filter(({ participant }) => participant.review_status === 'Approved')
    .reduce((total, { participant }) => total + (participant.cpd_credits || 0), 0);

  return approvedSelfCpd + approvedParticipantCpd;
});

onMounted(async () => {
  await Promise.all([
    fetchApplications(),
    fetchLearningMethods(),
    fetchCpdTaskParticipants(),
    fetchCpdTasks(),
  ])
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

.list-leave-active {
  position: absolute;
}
</style>
