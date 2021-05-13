<template>
  <div class="w-full mx-auto px-4 py-8">
    <!-- Application Tracking Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Engineering CPD Application Tracking
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track the status of your Engineering CPD applications.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-lg text-gray-700">Loading applications...</span>
    </div>

    <!-- Error Message -->
    <div
      v-if="error && !loading"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative"
    >
      <p class="font-bold">Error loading applications</p>
      <p>{{ error }}</p>
      <button
        @click="fetchApplications"
        class="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm font-medium"
      >
        Retry
      </button>
    </div>

    <!-- Approved Applications Notice -->
    <div
      v-if="!loading && hasApprovedApplicationsWithoutParticipants"
      class="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg mb-6"
    >
      <div class="flex items-start">
        <div class="shrink-0">
          <svg
            class="h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium">Action Required: Add Participants</h3>
          <div class="mt-1 text-sm">
            <p>
              You have {{ approvedApplicationsWithoutParticipants.length }} approved Engineering CPD
              application(s) that need participants added. Click "Add Participants" under Actions to
              complete them.
            </p>
          </div>
          <div class="mt-2 text-right">
            <button
              v-if="approvedApplicationsWithoutParticipants.length > 0"
              @click="addParticipants(approvedApplicationsWithoutParticipants[0])"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50"
            >
              Add Participants (First)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !error && applications.length === 0"
      class="bg-gray-50 rounded-xl p-8 text-center mt-6"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
      <p class="mt-1 text-gray-500">You haven't submitted any Engineering CPD applications yet.</p>
      <button
        @click="createNewApplication"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create New Application
      </button>
    </div>

    <!-- Search and Filter Controls -->
    <div
      v-if="!loading && !error && applications.length > 0"
      class="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
    >
      <div class="relative w-full sm:w-auto">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          id="search"
          v-model="searchTerm"
          class="block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10"
          placeholder="Search Title or ID"
        />
      </div>

      <div class="flex items-center w-full sm:w-auto">
        <label for="statusFilter" class="mr-3 text-sm font-medium text-gray-700 shrink-0"
          >Status:</label
        >
        <select
          id="statusFilter"
          v-model="statusFilter"
          class="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">All Statuses</option>
          <option value="Needs Participants">Needs Participants</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
    </div>

    <!-- Application Table -->
    <div
      v-if="!loading && !error && applications.length > 0"
      class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title of CPD
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Submission Date
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Display message if filters result in no matches -->
          <tr v-if="filteredApplications.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">
              No applications match your current search/filter criteria.
            </td>
          </tr>
          <!-- Iterate over filtered applications -->
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            class="hover:bg-gray-50 transition-colors duration-150"
            :class="{
              'bg-blue-50 hover:bg-blue-100': isApprovedWithoutParticipants(application),
            }"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ application.id }}
            </td>
            <td
              class="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate"
              :title="application.title_of_cpd || ''"
            >
              {{ application.title_of_cpd || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(application.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                :class="[
                  'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getStatusClass(application),
                ]"
              >
                {{ getStatusText(application) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              <button
                @click="viewApplication(application)"
                title="View Details"
                class="text-blue-600 hover:text-blue-800 focus:outline-none transition duration-150 ease-in-out"
              >
                View
              </button>

              <button
                v-if="getStatusText(application) === 'Draft'"
                @click="editApplication(application)"
                title="Edit Draft"
                class="text-green-600 hover:text-green-800 focus:outline-none transition duration-150 ease-in-out"
              >
                Edit
              </button>

              <button
                v-if="isApprovedWithoutParticipants(application)"
                @click="addParticipants(application)"
                title="Add Participants"
                class="text-purple-600 hover:text-purple-800 focus:outline-none font-medium transition duration-150 ease-in-out"
              >
                Add Participants
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Application Button -->
    <div v-if="!loading && applications.length > 0" class="mt-6 flex justify-end">
      <button
        @click="createNewApplication"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
          />
        </svg>
        Create New Application
      </button>
    </div>

    <!-- Application View Modal -->
    <div
      v-if="showViewModal && selectedApplication"
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Modal content -->
      <div
        class="bg-white rounded-xl shadow-xl max-w-4xl w-full m-4 max-h-[95vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
      >
        <!-- Modal Header -->
        <div
          class="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl"
        >
          <h2 class="text-xl font-semibold text-gray-800" id="modal-title">
            Engineering CPD Application Details
          </h2>
          <button
            @click="closeViewModal"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            aria-label="Close modal"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6 overflow-y-auto">
          <!-- Status Banner (Needs Participants) -->
          <div
            v-if="isApprovedWithoutParticipants(selectedApplication)"
            class="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-r-lg"
            role="alert"
          >
            <div class="flex">
              <div class="py-1">
                <svg
                  class="fill-current h-6 w-6 text-blue-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-bold">Action Required: Add Participants</p>
                <p class="text-sm">
                  This application has been approved. Please add the participant details to complete
                  the process.
                </p>
                <div class="mt-2 text-right">
                  <button
                    @click="addParticipants(selectedApplication)"
                    class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50"
                  >
                    Add Participants Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Status Banner (Rejected) -->
          <div
            v-if="getStatusText(selectedApplication) === 'Rejected' && selectedApplication.feedback"
            class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-r-lg"
            role="alert"
          >
            <p class="font-bold">Application Rejected</p>
            <p class="text-sm mt-1"><strong>Reason:</strong> {{ selectedApplication.feedback }}</p>
          </div>

          <!-- Basic Info Section -->
          <div class="border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Basic Information
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Application ID</p>
                <p class="text-sm text-gray-800">{{ selectedApplication.id }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Status</p>
                <span
                  :class="[
                    'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getStatusClass(selectedApplication),
                  ]"
                >
                  {{ getStatusText(selectedApplication) }}
                </span>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Submitted On</p>
                <p class="text-sm text-gray-800">
                  {{ formatDate(selectedApplication.created_at) }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-xs font-medium text-gray-500 uppercase">Title of CPD</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.title_of_cpd || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Venue</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.venue || 'N/A' }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-xs font-medium text-gray-500 uppercase">Duration</p>
                <p class="text-sm text-gray-800">
                  {{ formatDateRange(selectedApplication.from_date, selectedApplication.to_date) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Applicant Details Section -->
          <div class="border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Applicant Details
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">Reg. Number</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.registration_no || 'N/A' }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-xs font-medium text-gray-500 uppercase">Full Name</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.full_name || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">CID Number</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.cid_no || 'N/A' }}
                </p>
              </div>
              <div class="sm:col-span-2">
                <p class="text-xs font-medium text-gray-500 uppercase">Agency/Location</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.proposed_training_location || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- CPD Details Section -->
          <div class="border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">CPD Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">CPD Credits</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.credit || '0' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase">No. of Participants</p>
                <p class="text-sm text-gray-800">
                  {{ selectedApplication.number_of_participants || '0' }}
                </p>
              </div>
              <div class="col-span-full">
                <p class="text-xs font-medium text-gray-500 uppercase">
                  Objective/Expected Outcome
                </p>
                <p class="text-sm text-gray-800 mt-1">
                  {{ selectedApplication.expected_outcome || 'N/A' }}
                </p>
              </div>
              <div class="col-span-full">
                <p class="text-xs font-medium text-gray-500 uppercase">Relevance to Profession</p>
                <p class="text-sm text-gray-800 mt-1">
                  {{ selectedApplication.relevance_to_topic || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Participants Section (if present) -->
          <div
            v-if="selectedApplication.participants && selectedApplication.participants.length > 0"
            class="border border-gray-200 p-4 rounded-lg"
          >
            <h3 class="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Participants ({{ selectedApplication.participants.length }})
            </h3>
            <div class="overflow-x-auto -mx-4 px-4">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reg No
                    </th>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Credits
                    </th>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(participant, index) in selectedApplication.participants"
                    :key="`participant-${participant.id || index}`"
                  >
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                      {{ participant.participant_reg_no || 'N/A' }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                      {{ participant.participant_name || 'N/A' }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                      {{ participant.cpd_credits || 'N/A' }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <span
                        :class="[
                          'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                          participant.review_status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : participant.review_status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800', // Default to Pending/Yellow
                        ]"
                      >
                        {{ participant.review_status || 'Pending' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- If no participants yet but needed -->
          <div
            v-else-if="isApprovedWithoutParticipants(selectedApplication)"
            class="border border-gray-200 p-4 rounded-lg text-center text-gray-500"
          >
            <p>Participant details have not been added yet.</p>
          </div>

          <!-- Reviewer Comments (if present and not rejected already shown) -->
          <div
            v-if="selectedApplication.feedback && getStatusText(selectedApplication) !== 'Rejected'"
            class="border border-gray-200 p-4 rounded-lg bg-yellow-50"
          >
            <h3 class="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
              Reviewer Comments / Feedback
            </h3>
            <p class="text-sm text-gray-800">{{ selectedApplication.feedback }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div
          class="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 bg-gray-50 rounded-b-xl"
        >
          <button
            @click="closeViewModal"
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
          >
            Close
          </button>
          <button
            v-if="getStatusText(selectedApplication) === 'Draft'"
            @click="editApplication(selectedApplication)"
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300"
          >
            Edit Application
          </button>
          <button
            v-if="isApprovedWithoutParticipants(selectedApplication)"
            @click="addParticipants(selectedApplication)"
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
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
import apiService from '@/services/services' // Corrected import path
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

// Reactive state
const applications = ref([])
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const statusFilter = ref('')
const showViewModal = ref(false)
const selectedApplication = ref(null)
// Example: Get provider identifier if needed for frontend filtering
// const providerIdentifier = computed(() => authStore.user?.registration_no || authStore.user?.cid);

// --- Status Logic ---

// Determines the user-facing status text
const getStatusText = (application) => {
  if (!application) return 'Unknown'

  if (application.is_draft) {
    return 'Draft'
  }
  // Use review_status as the primary indicator from backend
  switch (application.review_status) {
    case 'Pending':
      return 'Pending'
    case 'Rejected':
    case 'Regretted': // Allow for variations
      return 'Rejected'
    case 'Approved':
      // If approved, check if participants are missing
      if (!application.participants || application.participants.length === 0) {
        // You might want to check if number_of_participants > 0 as well,
        // but checking the array is usually sufficient
        return 'Needs Participants'
      } else {
        // Assumed 'Completed' if approved and participants array exists/is not empty
        // More complex logic could check if all participant statuses are final
        return 'Completed'
      }
    default:
      // If review_status is null, undefined, or unexpected, treat as Pending or Unknown
      console.warn(
        `Unknown review_status: ${application.review_status} for app ID: ${application.id}`,
      )
      return 'Unknown' // Or 'Pending' maybe?
  }
}

// Determines the Tailwind CSS classes for the status badge
const getStatusClass = (application) => {
  const status = getStatusText(application)
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'Needs Participants':
      return 'bg-blue-100 text-blue-800' // Distinct color for action needed
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Draft':
      return 'bg-gray-100 text-gray-800 border border-gray-300' // More distinct draft
    default: // Unknown
      return 'bg-gray-100 text-gray-800'
  }
}

// Specifically checks if status is 'Needs Participants'
const isApprovedWithoutParticipants = (application) => {
  return getStatusText(application) === 'Needs Participants'
}

// --- Computed Properties ---

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) return [] // Safety check

  const term = searchTerm.value.toLowerCase().trim()
  const statusTerm = statusFilter.value

  return applications.value.filter((app) => {
    // Match on Title or ID
    const titleMatch = app.title_of_cpd?.toLowerCase().includes(term)
    const idMatch = app.id?.toString().toLowerCase().includes(term)
    const searchMatch = term === '' || titleMatch || idMatch

    // Match on Status
    const statusMatch = statusTerm === '' || getStatusText(app) === statusTerm

    return searchMatch && statusMatch
  })
})

const approvedApplicationsWithoutParticipants = computed(() => {
  if (!Array.isArray(applications.value)) return []
  return applications.value.filter((app) => isApprovedWithoutParticipants(app))
})

const hasApprovedApplicationsWithoutParticipants = computed(() => {
  return approvedApplicationsWithoutParticipants.value.length > 0
})

// --- Data Fetching ---

const fetchApplications = async () => {
  loading.value = true
  error.value = null
  console.log('Fetching CPD Tasks using apiService...')
  try {
    // Using the imported apiService object
    const response = await apiService.getEpcCpdTasks()

    if (response.data && Array.isArray(response.data.results)) {
      // Assuming backend filters by logged-in provider automatically
      // If not, add frontend filtering here using providerIdentifier
      applications.value = response.data.results.sort(
        (a, b) =>
          // Sort by updated_at or created_at descending (newest first)
          new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at),
      )
      console.log(`Loaded ${applications.value.length} applications.`)
      // console.log('Sample Application Data:', applications.value.length > 0 ? applications.value[0] : 'N/A');
    } else {
      console.warn('No application data received or format is incorrect:', response.data)
      applications.value = []
      // Optional: Set a user-friendly message if response is ok but results are empty/null
      if (response.status === 200 && !response.data?.results) {
        error.value = 'No applications found for your account.'
      } else {
        error.value = 'Received invalid data format from server.'
      }
    }
  } catch (err) {
    console.error('Error fetching applications:', err)
    error.value =
      err.response?.data?.detail ||
      err.message ||
      'An unexpected error occurred while loading applications.'
    applications.value = []
    toast.error(`Error: ${error.value}`)
  } finally {
    loading.value = false
  }
}

// --- Helper Functions (Date Formatting) ---

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      // Check if date is valid
      console.warn(`Invalid date string received: ${dateString}`)
      return 'Invalid Date'
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.error(`Error formatting date: ${dateString}`, e)
    return 'Error'
  }
}

const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  // Handle N/A or error cases for either date
  if ([start, end].some((d) => ['N/A', 'Invalid Date', 'Error'].includes(d))) {
    return 'N/A'
  }
  return `${start} to ${end}`
}

// --- Actions ---

const viewApplication = async (application) => {
  console.log('Viewing application:', application.id)
  // Optionally fetch full details if the list view is partial
  // loadingModal.value = true; // Indicate loading within modal
  try {
    // Example: Fetch full data only if needed (uncomment if required)
    // const response = await apiService.getEpcCpdTask(application.id);
    // selectedApplication.value = response.data;

    // If list data is sufficient:
    selectedApplication.value = application
    showViewModal.value = true
  } catch (viewError) {
    console.error('Error fetching full application details:', viewError)
    toast.error('Could not load full application details.')
    selectedApplication.value = null // Clear selection on error
  } finally {
    // loadingModal.value = false;
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedApplication.value = null
}

const editApplication = (application) => {
  if (getStatusText(application) !== 'Draft') {
    toast.warning('Only applications in Draft status can be edited.')
    return
  }
  closeViewModal() // Close modal if open
  console.log('Navigating to edit application:', application.id)
  // Ensure the target route exists
  router.push(
    `/admin/cpd_cme_provider/engineering_certification/cpd_application_details?id=${application.id}`,
  )
}

const addParticipants = (application) => {
  // Double check status before navigating
  if (application.review_status !== 'Approved') {
    toast.error('This application must be Approved before adding participants.')
    console.warn(
      'Attempted to add participants to non-approved application:',
      application.id,
      application.review_status,
    )
    return
  }
  closeViewModal() // Close modal if open
  console.log('Navigating to add participants for application:', application.id)
  // Ensure the target route exists and handles the query param
  router.push(
    `/admin/cpd_cme_provider/engineering_certification/cpd_application_details?id=${application.id}&add_participants=true`,
  )
}

const createNewApplication = () => {
  console.log('Navigating to create new application form')
  // Ensure the target route exists
  router.push('/admin/cpd_cme_provider/engineering_certification/cpd_application_details')
}

// --- Lifecycle Hook ---

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
/* Optional: Add specific styles if needed */
/* Example: Style for the modal background */
.fixed.inset-0.bg-gray-900 {
  /* Add transition for smoother appearance */
  transition: opacity 0.3s ease-in-out;
}
/* Example: Style for the modal content scaling */
.fixed.inset-0 .bg-white {
  transition: transform 0.3s ease-in-out;
}
/* Add pointer cursor to table rows for better UX */
tbody tr {
  cursor: default; /* Default cursor */
}
tbody tr:hover {
  /* Indicate interactivity slightly beyond background color */
}
tbody button {
  cursor: pointer;
}

/* Ensure modal scroll works correctly */
.max-h-\[95vh\] {
  max-height: 95vh;
}
</style>
