<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen">
    <div class="text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
        CPD Application Tracking
      </h1>
      <p class="mt-3 max-w-2xl mx-auto text-lg text-slate-500">
        Monitor the status and progress of all your submitted applications in one place.
      </p>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-lg font-medium text-slate-600">Loading Applications...</p>
    </div>

    <div v-if="error" class="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-200">
      <div class="mx-auto h-12 w-12 text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 class="mt-3 text-2xl font-bold text-slate-800">An Error Occurred</h3>
      <p class="mt-2 text-slate-500">{{ error }}</p>
      <button
        @click="fetchApplications"
        class="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Retry
      </button>
    </div>

    <div v-if="!loading && !error" class="space-y-8">
      <div
        v-if="hasApprovedApplicationsWithoutParticipants"
        class="bg-white border-l-4 border-yellow-400 p-5 rounded-r-lg shadow-md"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-base font-bold text-yellow-800">Action Required</h3>
            <p class="mt-1 text-sm text-yellow-700">
              You have {{ approvedApplicationsWithoutParticipants.length }} approved CPD
              application(s) ready for participant enrollment.
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="applications.length === 0"
        class="bg-white rounded-2xl shadow-lg p-12 text-center border"
      >
        <div class="mx-auto h-16 w-16 text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-2xl font-bold text-slate-800">No Applications Yet</h3>
        <p class="mt-2 text-slate-500">
          It looks like you haven't created any CPD applications. Get started now!
        </p>
        <button
          @click="createNewApplication"
          class="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Now
        </button>
      </div>

      <div v-if="applications.length > 0" class="bg-white rounded-2xl shadow-lg border">
        <div class="p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="relative w-full md:w-auto">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              v-model="searchTerm"
              class="block w-full md:w-80 pl-10 pr-4 py-2.5 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Search by title or ID..."
            />
          </div>
          <div class="relative w-full md:w-auto">
            <select
              v-model="statusFilter"
              class="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved (Overall)</option>
              <option value="Needs Participants">Needs Participants</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Draft">Draft</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div v-if="filteredApplications.length === 0" class="text-center p-12">
          <div class="mx-auto h-16 w-16 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l4 4m0-4l-4 4"
              />
            </svg>
          </div>
          <h3 class="mt-4 text-2xl font-bold text-slate-800">No Matches Found</h3>
          <p class="mt-2 text-slate-500">
            No applications match your current search and filter combination.
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  CPD Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Submission Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="application in filteredApplications"
                :key="application.id"
                class="hover:bg-slate-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {{ application.id }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-700 max-w-sm">
                  <div class="truncate font-medium">{{ application.title_of_cpd || 'N/A' }}</div>
                  <div class="text-xs text-slate-500">
                    {{ application.is_cpd_approved ? 'Approved CPD' : 'New CPD' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ formatDate(application.created_at || application.status_last_updated) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="[
                      'px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full',
                      getStatusClass(application),
                    ]"
                  >
                    {{ getComprehensiveStatus(application) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                  <button
                    @click="viewApplication(application)"
                    class="text-slate-600 hover:text-slate-900"
                  >
                    View
                  </button>
                  <button
                    v-if="getComprehensiveStatus(application) === 'Draft'"
                    @click="editApplication(application)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    v-if="isApprovedWithoutParticipants(application)"
                    @click="addParticipants(application)"
                    class="text-green-600 hover:text-green-900 font-bold"
                  >
                    Add Participants
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 border-t flex justify-end">
          <button
            @click="createNewApplication"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Application
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showViewModal && selectedApplication"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeViewModal"
    >
      <div class="bg-slate-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div
          class="flex-shrink-0 px-6 py-5 border-b border-slate-200 flex justify-between items-center"
        >
          <h2 class="text-xl font-bold text-slate-800">Application Details</h2>
          <button
            @click="closeViewModal"
            class="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-grow p-6 space-y-6 overflow-y-auto">
          <div
            v-for="(section, s_idx) in modalSections"
            :key="s_idx"
            class="bg-white p-5 rounded-xl border border-slate-200"
          >
            <h3 class="text-lg font-bold text-slate-800 mb-4 border-b pb-3">{{ section.title }}</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 text-sm">
              <div v-for="(item, i_idx) in section.items" :key="i_idx" :class="item.span">
                <dt class="font-semibold text-slate-500">{{ item.label }}</dt>
                <dd class="mt-1 text-slate-900">
                  <span v-if="!item.type || item.type === 'text'">
                    {{ item.value }}
                  </span>

                  <span
                    v-else-if="item.type === 'badge' && item.value"
                    :class="item.class"
                    class="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full"
                  >
                    {{ item.value }}
                  </span>

                  <ul v-else-if="item.type === 'list' && item.value?.length" class="space-y-1">
                    <li
                      v-for="(listItem, l_idx) in item.value"
                      :key="l_idx"
                      class="list-disc list-inside"
                    >
                      {{ item.accessor(listItem) }}
                    </li>
                  </ul>

                  <a
                    v-else-if="item.type === 'link' && item.value"
                    :href="item.value"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    View Document
                  </a>

                  <span v-else class="text-slate-400">N/A</span>
                </dd>
              </div>
            </dl>

            <div
              v-if="
                section.title === 'Resource Persons' &&
                selectedApplication.resources &&
                selectedApplication.resources.length > 0 &&
                selectedApplication.resources[0].resource_person_name
              "
              class="mt-4 -mx-5"
            >
              <table class="min-w-full">
                <thead class="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th class="px-5 py-3 text-left font-semibold">Name</th>
                    <th class="px-5 py-3 text-left font-semibold">Reg No.</th>
                    <th class="px-5 py-3 text-left font-semibold">Expertise Doc</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 text-sm">
                  <tr v-for="resource in selectedApplication.resources" :key="resource.id">
                    <td class="px-5 py-3">{{ resource.resource_person_name || 'N/A' }}</td>
                    <td class="px-5 py-3">{{ resource.resource_person_reg_no || 'N/A' }}</td>
                    <td class="px-5 py-3">
                      <a
                        v-if="resource.document_supporting_expertise"
                        :href="resource.document_supporting_expertise"
                        target="_blank"
                        class="text-blue-600 hover:underline"
                        >View Document</a
                      >
                      <span v-else class="text-slate-400">Not Provided</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="
                section.title === 'Registered Participants' &&
                selectedApplication.participants &&
                selectedApplication.participants.length > 0
              "
              class="mt-4 -mx-5"
            >
              <table class="min-w-full">
                <thead class="bg-slate-50 text-xs text-slate-500 uppercase">
                  <tr>
                    <th class="px-5 py-3 text-left font-semibold">Name</th>
                    <th class="px-5 py-3 text-left font-semibold">Reg No.</th>
                    <th class="px-5 py-3 text-left font-semibold">CPD Credits</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 text-sm">
                  <tr v-for="participant in selectedApplication.participants" :key="participant.id">
                    <td class="px-5 py-3">{{ participant.participant_name || 'N/A' }}</td>
                    <td class="px-5 py-3">{{ participant.participant_reg_no || 'N/A' }}</td>
                    <td class="px-5 py-3">{{ participant.cpd_credits || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          class="flex-shrink-0 bg-white/70 backdrop-blur-sm px-6 py-4 border-t border-slate-200 flex justify-end space-x-3"
        >
          <button
            @click="closeViewModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Close
          </button>
          <button
            v-if="getComprehensiveStatus(selectedApplication) === 'Draft'"
            @click="editApplication(selectedApplication)"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Application
          </button>
          <button
            v-if="isApprovedWithoutParticipants(selectedApplication)"
            @click="addParticipants(selectedApplication)"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
          >
            Add Participants
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiServices from '@/services/services' // Your existing API service
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore' // Import your auth store

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore() // Initialize the auth store

// --- STATE ---
const applications = ref([])
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const statusFilter = ref('')
const showViewModal = ref(false)
const selectedApplication = ref(null)

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
  if (!dateString) return null
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return dateString
  }
}

const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (!start || !end) return null
  return `${start} to ${end}`
}

const isApprovedWithoutParticipants = (application) => {
  return (
    application?.application_status === 'APPROVED' &&
    (!application.participants || application.participants.length === 0)
  )
}

const getComprehensiveStatus = (application) => {
  if (!application) return 'N/A'
  if (application.is_draft) return 'Draft'

  const statusMap = {
    SUBMITTED: 'Pending',
    UNDER_REVIEW: 'Pending',
    PENDING_CLARIFICATION: 'Pending',
    APPROVED: 'Approved',
    REGRETTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
  }
  const mappedStatus = statusMap[application.application_status] || 'Pending'

  if (mappedStatus === 'Approved') {
    return isApprovedWithoutParticipants(application) ? 'Needs Participants' : 'Completed'
  }
  return mappedStatus
}

const getStatusClass = (application) => {
  const status = getComprehensiveStatus(application)
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'Needs Participants':
      return 'bg-yellow-100 text-yellow-800'
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    case 'Pending':
      return 'bg-blue-100 text-blue-800'
    case 'Draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}

// --- MAIN API CALL ---
const fetchApplications = async () => {
  const userCid = authStore.user?.cid
  if (!userCid) {
    error.value = 'Could not find user information. Please log in again.'
    applications.value = []
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null
    const response = await apiServices.getMhpcCpdTaskByCid(userCid)

    if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results
      if (response.data.results.length === 0) {
        error.value = 'No applications found for your account.'
      }
    } else {
      applications.value = []
    }
  } catch (err) {
    console.error('Error fetching applications:', err)
    applications.value = []
    if (err.response && err.response.status === 404) {
      error.value = 'No applications found for your account.'
    } else {
      error.value = err.message || 'An unknown error occurred while loading applications.'
    }
  } finally {
    loading.value = false
  }
}

// --- COMPUTED PROPERTIES ---
const modalSections = computed(() => {
  if (!selectedApplication.value) return []
  const app = selectedApplication.value

  return [
    {
      title: 'Key Information',
      items: [
        { label: 'Application ID', value: app.id, type: 'text', span: 'sm:col-span-1' },
        {
          label: 'Status',
          value: getComprehensiveStatus(app),
          type: 'badge',
          class: getStatusClass(app),
          span: 'sm:col-span-2',
        },
        { label: 'CPD Title', value: app.title_of_cpd, type: 'text', span: 'sm:col-span-3' },
        { label: 'Applicant Name', value: app.full_name, type: 'text', span: 'sm:col-span-1' },
        { label: 'Applicant CID', value: app.cid_no, type: 'text', span: 'sm:col-span-1' },
        {
          label: 'Registration No',
          value: app.registration_no,
          type: 'text',
          span: 'sm:col-span-1',
        },
      ],
    },
    {
      title: 'Dates & Location',
      items: [
        {
          label: 'Training Dates',
          value: formatDateRange(app.from_date, app.to_date),
          type: 'text',
          span: 'sm:col-span-1',
        },
        {
          label: 'Duration (Hours)',
          value: app.duration_in_hours,
          type: 'text',
          span: 'sm:col-span-1',
        },
        {
          label: 'Proposed Location',
          value: app.proposed_training_location,
          type: 'text',
          span: 'sm:col-span-1',
        },
        { label: 'Venue Details', value: app.venue, type: 'text', span: 'sm:col-span-3' },
      ],
    },
    {
      title: 'CPD Details',
      items: [
        {
          label: 'CPD Type',
          value: app.type_of_cpd?.cpd_activity_name,
          type: 'text',
          span: 'sm:col-span-1',
        },
        { label: 'CPD Credits', value: app.credit, type: 'text', span: 'sm:col-span-1' },
        {
          label: 'Participants',
          value: app.number_of_participants,
          type: 'text',
          span: 'sm:col-span-1',
        },
        {
          label: 'Reason for Conducting',
          value: app.reason_for_conducting?.name,
          type: 'text',
          span: 'sm:col-span-3',
        },
        {
          label: 'Expected Outcome',
          value: app.expected_outcome,
          type: 'text',
          span: 'sm:col-span-3',
        },
        {
          label: 'Relevance to Topic',
          value: app.relevance_to_topic,
          type: 'text',
          span: 'sm:col-span-3',
        },
      ],
    },
    {
      title: 'Teaching & Learning',
      items: [
        {
          label: 'Methodologies',
          value: app.methodologies,
          type: 'list',
          accessor: (item) => item.methodology_name?.methodology_name,
          span: 'sm:col-span-1',
        },
        {
          label: 'Learning Methods',
          value: app.learning_methods,
          type: 'list',
          accessor: (item) => `${item.activities} (${item.duration} hrs)`,
          span: 'sm:col-span-1',
        },
      ],
    },
    {
      title: 'Resource Persons',
      items:
        app.resources?.length > 0
          ? []
          : [
              {
                label: '',
                value: 'No resource persons listed for this application.',
                type: 'text',
                span: 'sm:col-span-3',
              },
            ],
    },
    {
      title: 'Attachments',
      items: [
        {
          label: 'Course Document',
          value: app.course_document,
          type: 'link',
          span: 'sm:col-span-1',
        },
        {
          label: 'Attendance Sheet',
          value: app.attendance_sheet_attachment,
          type: 'link',
          span: 'sm:col-span-1',
        },
        { label: 'Other Attachments', value: app.attachment, type: 'link', span: 'sm:col-span-1' },
      ],
    },
    {
      title: 'Registered Participants',
      items:
        app.participants?.length > 0
          ? []
          : [
              {
                label: '',
                value: 'No participants listed for this application.',
                type: 'text',
                span: 'sm:col-span-3',
              },
            ],
    },
    {
      title: 'Administrative Details',
      items: [
        {
          label: 'CPD Providing Agency',
          value: app.cpd_providing_agency?.name,
          type: 'text',
          span: 'sm:col-span-2',
        },
        {
          label: 'Last Updated',
          value: formatDate(app.status_last_updated),
          type: 'text',
          span: 'sm:col-span-1',
        },
        {
          label: 'Reviewer Remarks',
          value: app.status_remarks,
          type: 'text',
          span: 'sm:col-span-3',
        },
      ],
    },
  ]
})

const filteredApplications = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  const statusTerm = statusFilter.value

  if (!applications.value) return []

  return applications.value.filter((app) => {
    const appComprehensiveStatus = getComprehensiveStatus(app)

    const titleMatch = app.title_of_cpd ? app.title_of_cpd.toLowerCase().includes(term) : false
    const idMatch = app.id ? app.id.toString().toLowerCase().includes(term) : false
    const searchCriteriaMet = term === '' || titleMatch || idMatch

    if (!searchCriteriaMet) return false

    let statusFilterMet = true
    if (statusTerm) {
      if (statusTerm === 'Approved') {
        statusFilterMet = app.application_status === 'APPROVED'
      } else {
        statusFilterMet = appComprehensiveStatus === statusTerm
      }
    }

    if (!statusFilterMet) return false

    if (appComprehensiveStatus === 'Draft' && !app.title_of_cpd) {
      if (term === '' && statusTerm !== 'Draft') {
        return false
      }
    }

    return true
  })
})

const approvedApplicationsWithoutParticipants = computed(() => {
  if (!applications.value) return []
  return applications.value.filter((app) => isApprovedWithoutParticipants(app))
})

const hasApprovedApplicationsWithoutParticipants = computed(() => {
  return approvedApplicationsWithoutParticipants.value.length > 0
})

// --- EVENT HANDLERS ---
const viewApplication = (application) => {
  selectedApplication.value = application
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedApplication.value = null
}

const editApplication = (application) => {
  showViewModal.value = false
  toast.info('Navigating to edit application...')
  router.push(
    `/admin/cme_cpd_provider/health_certification/cpd_application_details?id=${application.id}`,
  )
}

const addParticipants = (application) => {
  if (showViewModal.value) {
    showViewModal.value = false
  }
  if (application.application_status !== 'APPROVED') {
    toast.error('Participants can only be added to applications with an "Approved" status.')
    return
  }
  toast.info('Navigating to add participants...')
  router.push(`/admin/cme_cpd_provider/health_certification/cpd_approved_add_participants`)
}

const createNewApplication = () => {
  toast.info('Navigating to create a new application...')
  router.push('/admin/cme_cpd_provider/health_certification/cpd_application_details')
}

// --- LIFECYCLE HOOK ---
onMounted(() => {
  fetchApplications()
})
</script>
