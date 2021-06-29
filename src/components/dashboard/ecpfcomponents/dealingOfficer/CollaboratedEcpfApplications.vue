<template>
  <div class="p-8 min-h-screen">
    <div class="mx-auto">
      <!-- Header with stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Total Applications</p>
              <p class="text-xl font-bold text-gray-800">{{ applications.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending</p>
              <p class="text-xl font-bold text-gray-800">{{ pendingCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Approved</p>
              <p class="text-xl font-bold text-gray-800">{{ approvedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Rejected</p>
              <p class="text-xl font-bold text-gray-800">{{ rejectedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Collaboration Applications</h2>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" v-model="searchQuery"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, ECPF, or external party..." />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select v-model="statusFilter"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select id="sortBy" v-model="sortBy"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="applicantName">Applicant Name</option>
              <option value="status">Status</option>
              <option value="ecpfName">ECPF Name</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Proposed ECPF Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  External Party
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="application in filteredApplications" :key="application.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3">
                      {{ getInitials(application.ecpf_profile_name) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.ecpf_profile_name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.proposed_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.external_party_state }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(getDecisionName(application.dealing_officer_decision))">
                    {{ getDecisionName(application.dealing_officer_decision) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="viewApplication(application.id)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                      View
                    </button>
                    <button @click="forwardApplication(application.id)"
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                      Forward
                    </button>
                    <!-- Removed Approve and Reject buttons from here -->
                  </div>
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No applications found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <!-- Application Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModalWithoutDataReset" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex justify-between items-center mb-4">
                  <DialogTitle as="h3" class="text-2xl font-semibold leading-6 text-gray-900">
                    ECPF Collaboration Application Details
                  </DialogTitle>
                  <button v-if="!isEditing" @click="enableEditing"
                    class="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="text-lg font-medium text-gray-800 mb-3">ECPF Information</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Existing ECPF Name</label>
                        <input type="text" v-model="editingApplication.ecpf_profile_name" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Existing License Number</label>
                        <input type="text" v-model="editingApplication.existing_license_number" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Proposed ECPF Name</label>
                        <input type="text" v-model="editingApplication.proposed_name" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Proposed Location</label>
                        <input type="text" v-model="editingApplication.proposed_location" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 class="text-lg font-medium text-gray-800 mb-3">Collaboration Details</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Name of Collaborating Firm</label>
                        <input type="text" v-model="editingApplication.collaborating_firm_name" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Country</label>
                        <input type="text" v-model="editingApplication.external_party_country" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">State</label>
                        <input type="text" v-model="editingApplication.external_party_state" :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Firm Registration Number</label>
                        <input type="text" v-model="editingApplication.external_firm_registration_number"
                          :disabled="!isEditing"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h4 class="text-lg font-medium text-gray-800 mb-3">
                    External Party Contact Details
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
                      <input type="text" v-model="editingApplication.proprietor_name" :disabled="!isEditing"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nationality</label>
                      <input type="text" v-model="editingApplication.nationality" :disabled="!isEditing"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Designation</label>
                      <input type="text" v-model="editingApplication.designation" :disabled="!isEditing"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" v-model="editingApplication.email" :disabled="!isEditing"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input type="tel" v-model="editingApplication.contact_number" :disabled="!isEditing"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Website</label>
                      <input type="url" v-model="editingApplication.website" :disabled="!isEditing"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h4 class="text-lg font-medium text-gray-800 mb-3">Collaboration Description</h4>
                  <textarea v-model="editingApplication.collaboration_details" :disabled="!isEditing" rows="3"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h4 class="text-lg font-medium text-gray-800 mb-3">Supporting Documents</h4>
                  <div v-if="isEditing"
                    class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-white">
                    <div class="space-y-1 text-center">
                      <!-- ... SVG and upload logic ... -->
                    </div>
                  </div>
                  <div v-else class="space-y-2">
                    <div v-if="editingApplication.concern_authorization_letter"
                      class="flex items-center p-2 bg-white rounded border border-gray-200">
                      <a :href="editingApplication.concern_authorization_letter" target="_blank"
                        class="text-sm text-blue-600 hover:text-blue-800">Authorization Letter</a>
                    </div>
                    <div v-if="editingApplication.passport_cv"
                      class="flex items-center p-2 bg-white rounded border border-gray-200">
                      <a :href="editingApplication.passport_cv" target="_blank"
                        class="text-sm text-blue-600 hover:text-blue-800">Passport/CV</a>
                    </div>
                    <div v-if="editingApplication.license_registration"
                      class="flex items-center p-2 bg-white rounded border border-gray-200">
                      <a :href="editingApplication.license_registration" target="_blank"
                        class="text-sm text-blue-600 hover:text-blue-800">License/Registration</a>
                    </div>
                    <div v-if="editingApplication.valid_mou"
                      class="flex items-center p-2 bg-white rounded border border-gray-200">
                      <a :href="editingApplication.valid_mou" target="_blank"
                        class="text-sm text-blue-600 hover:text-blue-800">Valid MoU</a>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button v-if="isEditing" type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="saveChanges">
                    Save Changes
                  </button>
                  <button v-if="!isEditing" @click="approveDirectly(editingApplication)"
                    class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Approve
                  </button>
                  <button v-if="!isEditing" @click="rejectDirectly(editingApplication)"
                    class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Reject
                  </button>
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="closeModal">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Regret Message Modal -->
    <TransitionRoot appear :show="isRegretModalOpen" as="template">
      <Dialog as="div" @close="closeRegretModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">Reject Application
                </DialogTitle>
                <div class="mb-4">
                  <p class="text-sm text-gray-500 mb-2">
                    Please provide a reason for rejecting this application:
                  </p>
                  <textarea v-model="regretMessage" rows="4"
                    class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter reason for rejecting..."></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="confirmRegret">
                    Confirm Rejection
                  </button>
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="closeRegretModal">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import apiServices from '@/services/services' // Import apiServices


const applications = ref([]) // Initialize as empty array
const isModalOpen = ref(false)
const isEditing = ref(false)
const isRegretModalOpen = ref(false)
const editingApplication = ref({})
const regretMessage = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('applicantName')

const decisions = ref([])
let initialApplicationState = null

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEcpfCollaborations()
    if (response.status === 200) {
      applications.value = response.data.results
    } else {
      alert('Failed to load applications.')
      console.error('Error fetching applications:', response)
    }
  } catch (error) {
    alert('Error loading applications.')
    console.error('Error fetching applications:', error)
  }
}

const fetchDecisions = async () => {
  try {
    const response = await apiServices.getMastersEcpfDecisions()
    if (response.status === 200) {
      decisions.value = response.data.results
    }
  } catch (error) {
    console.error('Error fetching decisions:', error)
  }
}

onMounted(() => {
  // Fetch decisions first so the helper function works correctly from the start
  fetchDecisions().then(() => {
    fetchApplications()
  })
})

const viewApplication = async (applicationId) => {
  try {
    const response = await apiServices.getEcpfCollaboration(applicationId)
    if (response.status === 200) {
      editingApplication.value = response.data
      initialApplicationState = JSON.parse(JSON.stringify(response.data)); // Deep copy to prevent mutation issues
      isModalOpen.value = true
      isEditing.value = false
    } else {
      alert('Failed to load application details.')
      console.error('Error fetching application details:', response)
    }
  } catch (error) {
    alert('Error loading application details.')
    console.error('Error fetching application details:', error)
  }
}

const enableEditing = () => {
  isEditing.value = true
}

const forwardApplication = async (applicationId) => {
  try {
    const response = await apiServices.patchEcpfCollaboration(applicationId, {
      status: 'In Review',
    }) // Assuming 'In Review' is a valid status name for this action
    if (response.status === 200) {
      await fetchApplications(); // Refetch to get the latest state
      alert(`Application forwarded for review.`)
    } else {
      alert('Failed to forward application.')
      console.error('Error forwarding application:', response)
    }
  } catch (error) {
    alert('Error forwarding application.')
    console.error('Error forwarding application:', error)
  }
}

// *** MODIFIED FUNCTION ***
const approveDirectly = async (application) => {
  try {
    const approvedDecision = decisions.value.find(d => d.decision_name === 'Approved');
    if (!approvedDecision) {
      alert('Could not find the "Approved" decision status. Please check configuration.');
      return;
    }

    // Payload now updates the correct field `dealing_officer_decision`
    const payload = {
      dealing_officer_decision: approvedDecision.id
    };

    const response = await apiServices.patchEcpfCollaboration(application.id, payload);

    if (response.status === 200) {
      await fetchApplications(); // Refetch to get the latest state
      alert(`Application approved successfully.`);
      closeModal();
    } else {
      alert('Failed to approve application.');
      console.error('Error approving application:', response);
    }
  } catch (error) {
    alert('Error approving application.');
    console.error('Error approving application:', error);
  }
}

const rejectDirectly = () => {
  isRegretModalOpen.value = true
}

// *** MODIFIED FUNCTION ***
const confirmRegret = async () => {
  if (!regretMessage.value.trim()) {
    alert('Please provide a reason for rejection.');
    return;
  }
  try {
    const rejectDecision = decisions.value.find(d => d.decision_name === 'Reject');
    if (!rejectDecision) {
      alert('Could not find the "Reject" decision status. Please check configuration.');
      return;
    }

    // Payload now updates the correct fields: `dealing_officer_decision` and `dealing_officer_regret_reason`
    const payload = {
      dealing_officer_decision: rejectDecision.id,
      dealing_officer_regret_reason: regretMessage.value
    };

    const response = await apiServices.patchEcpfCollaboration(editingApplication.value.id, payload);

    if (response.status === 200) {
      await fetchApplications(); // Refetch to get the latest state
      alert(`Application rejected successfully.`);
      closeRegretModal();
      closeModal();
    } else {
      alert('Failed to reject application.');
      console.error('Error rejecting application:', response);
    }
  } catch (error) {
    alert('Error rejecting application.');
    console.error('Error rejecting application:', error);
  }
}


const saveChanges = async () => {
  try {
    const response = await apiServices.updateEcpfCollaboration(
      editingApplication.value.id,
      editingApplication.value,
    )
    if (response.status === 200) {
      await fetchApplications(); // Refetch to get the latest state
      alert(`Changes saved successfully for application: ${editingApplication.value.ecpf_profile_name}`)
      closeModal()
      isEditing.value = false
    } else {
      alert('Failed to save changes.')
      console.error('Error saving changes:', response)
    }
  } catch (error) {
    alert('Error saving changes.')
    console.error('Error saving changes:', error)
  }
}

const uploadDocument = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!editingApplication.value.supportingDocuments) {
      editingApplication.value.supportingDocuments = []
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      editingApplication.value.supportingDocuments.push({
        name: file.name,
        data: e.target.result,
      })
    }
    reader.readAsDataURL(file)
    alert(`Document ${file.name} added to application. Remember to Save Changes to persist.`)
  }
}

const closeModalWithoutDataReset = () => {
  isModalOpen.value = false
}

const closeModal = () => {
  isModalOpen.value = false
  isEditing.value = false
  regretMessage.value = ''
  editingApplication.value = {}
  initialApplicationState = null
}

const closeRegretModal = () => {
  isRegretModalOpen.value = false
  regretMessage.value = ''
}

// Helper to get decision name by ID
const getDecisionName = (decisionId) => {
  // Handles null or undefined decisionId, defaulting to 'Pending'
  if (!decisionId) return 'Pending'
  const found = decisions.value.find(d => d.id === decisionId)
  // If an ID is present but not found in the list, it's safer to show a specific status
  return found ? found.decision_name : 'Unknown Status'
}

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) {
    return []
  }

  let filtered = [...applications.value]

  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (app) =>
        app.ecpf_profile_name?.toLowerCase().includes(searchTerm) ||
        app.proposed_name?.toLowerCase().includes(searchTerm) ||
        app.external_party_state?.toLowerCase().includes(searchTerm)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((app) => getDecisionName(app.dealing_officer_decision) === statusFilter.value)
  }

  if (sortBy.value === 'applicantName') {
    filtered.sort((a, b) => (a.ecpf_profile_name || '').localeCompare(b.ecpf_profile_name || ''))
  } else if (sortBy.value === 'status') {
    filtered.sort((a, b) => getDecisionName(a.dealing_officer_decision).localeCompare(getDecisionName(b.dealing_officer_decision)))
  } else if (sortBy.value === 'ecpfName') {
    filtered.sort((a, b) =>
      (a.proposed_name || '').localeCompare(b.proposed_name || '')
    )
  }

  return filtered
})


const pendingCount = computed(() => {
  if (!Array.isArray(applications.value)) return 0
  return applications.value.filter((app) => getDecisionName(app.dealing_officer_decision) === 'Pending').length
})
const approvedCount = computed(() => {
  if (!Array.isArray(applications.value)) return 0
  return applications.value.filter((app) => getDecisionName(app.dealing_officer_decision) === 'Approved').length
})
const rejectedCount = computed(() => {
  if (!Array.isArray(applications.value)) return 0
  return applications.value.filter((app) => getDecisionName(app.dealing_officer_decision) === 'Reject').length // Changed to 'Reject' to match API
})

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const getStatusClasses = (status) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-blue-100 text-blue-800': status === 'In Review',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Reject' || status === 'Rejected', // Handles both 'Reject' and 'Rejected'
    },
  ]
}

watch(isModalOpen, (newVal) => {
  if (!newVal && isEditing.value && initialApplicationState) {
    // If modal is closed while in edit mode, revert changes to prevent accidental data modification
    editingApplication.value = JSON.parse(JSON.stringify(initialApplicationState));
  }
});
</script>
