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
    <div v-else-if="allCpdRecords.length === 0"
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
          {{ totalCpdCredits }}
        </p>
        <p class="text-gray-500 mt-2">
          This is the sum of all your approved CPD credits.
        </p>
      </div>

      <!-- Applications List for SELF CPD-->
      <transition-group v-if="selfCpdRecords.length > 0" name="list" tag="div" class="space-y-6">
        <div v-for="record in selfCpdRecords" :key="record.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
          <!-- Header with Status and Credits -->
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2"> CPD Title: {{ record.title }}</h3>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">Registration No. # {{ record.details.registrationNo || 'N/A' }}</span>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <!-- Status Badge with Dynamic Coloring -->
                <span :class="[
                  record.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : record.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800',
                  'px-4 py-2 rounded-full text-sm font-medium shadow-sm',
                ]">
                  {{ record.status || 'Pending' }}
                </span>
                <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {{ record.credits }} Credits
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
                      {{ authStore.fullName }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <CreditCard class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">CID Number</p>
                    <p class="font-medium text-gray-900">
                      {{ authStore.user?.cid }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Users class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Completed Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(record.date) }}</p>
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
                      {{ record.details.relevance || 'Not specified' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Target class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Activity Type</p>
                    <p class="font-medium text-gray-900">
                      {{ record.details.activityType || 'Not specified' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Calendar class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">Submission Date</p>
                    <p class="font-medium text-gray-900">
                      {{ formatDate(record.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Remarks Section (if any) -->
          <div v-if="record.remarks" class="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <MessageCircle class="w-5 h-5 mr-2 text-blue-600" />
              Reviewer Comments
            </h4>
            <p class="text-gray-700 italic">{{ record.remarks }}</p>
          </div>

          <div class="bg-gray-100 p-6 flex items-center justify-between border-t">
            <div class="flex items-center space-x-3">
              <FileText class="w-6 h-6 text-blue-600" />
              <span class="font-medium text-gray-900">Supporting Document</span>
            </div>
            <a v-if="record.attachmentUrl" :href="record.attachmentUrl" target="_blank"
              class="group flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out">
              <Download class="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download
            </a>
            <span v-else class="text-gray-500 italic">No attachment available</span>
          </div>
        </div>
      </transition-group>

      <!-- Applications List for EVENT CPD -->
      <transition-group v-if="eventCpdRecords.length > 0" name="list" tag="div" class="space-y-6 mt-6">
        <div v-for="record in eventCpdRecords" :key="record.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  CPD Title: {{ record.title || 'N/A' }}
                </h3>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-600">
                    Registration No. # {{ record.details.registrationNo || 'N/A' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="[
                  record.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : record.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800',
                  'px-4 py-2 rounded-full text-sm font-medium shadow-sm',
                ]">
                  {{ record.status || 'Pending' }}
                </span>
                <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  {{ record.credits || 0 }} Credits
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
                    <p class="font-medium text-gray-900">{{ record.details.venue || 'N/A' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Calendar class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">From Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(record.details.fromDate) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <Calendar class="w-6 h-6 text-gray-500" />
                  <div>
                    <p class="text-xs text-gray-600">To Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(record.details.toDate) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Remarks -->
          <div v-if="record.remarks" class="px-6 py-4 bg-blue-50 border-t border-blue-100">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
              <MessageCircle class="w-5 h-5 mr-2 text-blue-600" />
              Reviewer Comments
            </h4>
            <p class="text-gray-700 italic">{{ record.remarks }}</p>
          </div>
          <!-- Attachments -->
          <div class="bg-gray-100 p-6 flex items-center justify-between border-t">
            <div class="flex items-center space-x-3">
              <FileText class="w-6 h-6 text-blue-600" />
              <span class="font-medium text-gray-900">Course Document</span>
            </div>
            <a v-if="record.attachmentUrl" :href="record.attachmentUrl" target="_blank"
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
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useEpcCpdStore } from '@/stores/epcCpdStore'
import { storeToRefs } from 'pinia'
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
const authStore = useAuthStore()
const cpdStore = useEpcCpdStore()

const { 
  allCpdRecords,
  isLoading, 
  error: apiError, 
  totalCpdCredits 
} = storeToRefs(cpdStore)

const selfCpdRecords = computed(() => allCpdRecords.value.filter(r => r.type === 'SELF'))
const eventCpdRecords = computed(() => allCpdRecords.value.filter(r => r.type === 'EVENT'))

onMounted(() => {
  authStore.initializeAuth()
  cpdStore.fetchCpdRecords()
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
</script>

<style scoped>
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