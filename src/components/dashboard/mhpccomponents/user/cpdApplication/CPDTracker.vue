<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8">
    <PageHeader
      title="Track Your CPD Application"
      subtitle="Review the status and details of your submitted CPD applications."
    >
      <template #icon>
        <ListChecks class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

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

    <div v-else>
      <div
        v-if="filteredApplications.length > 0"
        class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-8 shadow-sm"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <GraduationCap class="h-6 w-6 text-indigo-700" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-indigo-700">
              You have accumulated a total of
              <span class="font-bold text-lg">{{ totalCpdCredits }}</span> approved CPD credits.
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="filteredApplications.length === 0"
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

      <transition-group v-else name="list" tag="div" class="space-y-6">
        <div
          v-for="record in filteredApplications"
          :key="record.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="p-6">
            <div
              class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4 mb-4 border-b border-gray-100"
            >
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">
                  {{ record.title || 'N/A' }}
                </h3>
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-500"
                    >Application ID #{{ record.registrationNo || 'N/A' }}</span
                  >
                </div>
              </div>

              <div class="flex items-center space-x-3 flex-shrink-0">
                <span
                  :class="[
                    record.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : record.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800',
                    'px-3 py-1 rounded-full text-xs font-medium shadow-sm capitalize',
                  ]"
                >
                  {{ record.status ? record.status.toLowerCase() : 'Pending' }}
                </span>

                <span
                  v-if="record.status === 'APPROVED'"
                  class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex-shrink-0"
                >
                  {{ record.credits || '0' }} Credits
                </span>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-x-6 gap-y-6">
              <div class="space-y-4">
                <h4 class="text-base font-semibold text-gray-800 pb-2 flex items-center">
                  <User class="w-5 h-5 mr-2 text-indigo-600" /> Personal Details
                </h4>
                <div class="space-y-3 pl-1">
                  <div class="flex items-start space-x-3">
                    <IdCard class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p class="text-xs text-gray-500">Full Name</p>
                      <p class="font-medium text-gray-800 text-sm">{{ record.fullName || 'N/A' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <CreditCard class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p class="text-xs text-gray-500">CID Number</p>
                      <p class="font-medium text-gray-800 text-sm">{{ record.cidNo || 'N/A' }}</p>
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
                        {{ record.activityTypeName || 'N/A' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Target class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p class="text-xs text-gray-500">Relevance</p>
                      <p class="font-medium text-gray-800 text-sm">
                        {{ record.relevance || 'N/A' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Calendar class="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p class="text-xs text-gray-500">Submission/Event Date</p>
                      <p class="font-medium text-gray-800 text-sm">
                        {{ formatDisplayDate(record.date) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 mt-4 px-6 py-4">
            <div v-if="record.attachmentUrl" class="flex items-center space-x-3">
              <FileText class="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span class="font-medium text-gray-700 text-sm">Supporting Document Attached</span>
              <a
                :href="record.attachmentUrl"
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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useMhpcCpdStore } from '@/stores/mhpcCpdStore'
import { storeToRefs } from 'pinia'
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
  Download,
  MessageCircle
} from 'lucide-vue-next'

// State
const authStore = useAuthStore()
const cpdStore = useMhpcCpdStore()

const {
  allCpdRecords,
  isLoading,
  error: apiError,
  totalCpdCredits
} = storeToRefs(cpdStore)

const filteredApplications = computed(() => {
  if (!allCpdRecords.value) return []
  return allCpdRecords.value.filter(
    (record) => record.status && record.status.toLowerCase() !== 'draft',
  )
})

onMounted(() => {
  authStore.initializeAuth()
  cpdStore.fetchCpdRecords()
})

const formatDisplayDate = (dateString) => {
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
