<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Complaints Management</h1>

    <!-- Loading Indicator for main complaints list -->
    <div v-if="isLoading && !complaints.length" class="text-center py-10">
      <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <p class="mt-2 text-gray-600">Loading complaints...</p>
    </div>

    <!-- Complaints Table -->
    <div v-else-if="complaints.length > 0" class="bg-white shadow-lg rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Complaint ID</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted By</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Professional Name (Respondent)</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
              Filed</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="complaint in complaints" :key="complaint.id"
            class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{{ complaint.complaint_id }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{{ complaint.subject }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ complaint.submitted_by_name || 'N/A' }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ complaint.professional_name || (complaint.respondent_application ?
                complaint.respondent_application.full_name : 'N/A') }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span :class="getStatusClass(complaint.status)"
                class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ complaint.status }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(complaint.created_at) }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openCombinedModal(complaint)"
                class="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                title="View Details & Manage Complaint">
                View Details & Manage
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1"
        class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="fetchPaginatedComplaints(pagination.currentPage - 1)"
            :disabled="!pagination.previous || isLoading"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button @click="fetchPaginatedComplaints(pagination.currentPage + 1)"
            :disabled="!pagination.next || isLoading"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ pagination.totalItems > 0 ? (pagination.currentPage - 1) * pagination.perPage
                + 1 : 0 }}</span>
              to
              <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)
                }}</span>
              of
              <span class="font-medium">{{ pagination.totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="fetchPaginatedComplaints(pagination.currentPage - 1)"
                :disabled="!pagination.previous || isLoading"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Previous</span>
              </button>
              <button v-for="page in pagination.visiblePages" :key="page" @click="fetchPaginatedComplaints(page)"
                :class="['relative inline-flex items-center px-4 py-2 border text-sm font-medium', page === pagination.currentPage ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', isLoading ? 'disabled:opacity-50 disabled:cursor-not-allowed' : '']"
                :disabled="isLoading || page === '...'">
                {{ page }}
              </button>
              <button @click="fetchPaginatedComplaints(pagination.currentPage + 1)"
                :disabled="!pagination.next || isLoading"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Next</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!isLoading && complaints.length === 0" class="text-center py-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-2 text-gray-600">No complaints found.</p>
    </div>

    <!-- Combined Details, Link Respondent, and Status Modal -->
    <div v-if="showCombinedModal && selectedComplaint"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-20 px-4"
      @click.self="closeCombinedModal">
      <div class="relative mx-auto p-5 sm:p-6 border w-full max-w-3xl shadow-xl rounded-lg bg-white">
        <!-- Close button and Title -->
        <button @click="closeCombinedModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 class="text-xl lg:text-2xl leading-6 font-semibold text-gray-900 mb-6">Complaint: {{
          selectedComplaint.complaint_id }}</h3>

        <div class="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <!-- Section 1: Complaint Details -->
          <section>
            <h4 class="text-lg font-medium text-gray-800 mb-3 border-b pb-2">Complaint Information</h4>
            <div class="mt-2 text-sm text-gray-700 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <p><strong class="text-gray-600">Subject:</strong> {{ selectedComplaint.subject }}</p>
                <p><strong class="text-gray-600">Status:</strong> <span
                    :class="getStatusClass(selectedComplaint.status)"
                    class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">{{
                    selectedComplaint.status }}</span></p>
                <p><strong class="text-gray-600">Professional Name (Respondent):</strong>
                  {{ selectedComplaint.professional_name || (selectedComplaint.respondent_application ?
                    selectedComplaint.respondent_application.full_name : 'N/A') }}
                  <span v-if="selectedComplaint.respondent_application" class="text-xs text-gray-500">(System
                    Linked)</span>
                </p>
                <p><strong class="text-gray-600">Designation:</strong> {{ selectedComplaint.professional_designation ||
                  'N/A' }}</p>
                <p><strong class="text-gray-600">Category:</strong> {{ selectedComplaint.professional_category_name ||
                  'N/A' }}</p>
                <p><strong class="text-gray-600">Workplace:</strong> {{ selectedComplaint.professional_workplace ||
                  'N/A' }}</p>
                <p><strong class="text-gray-600">Incident Date:</strong> {{
                  formatDateTime(selectedComplaint.incident_datetime) }}</p>
                <p><strong class="text-gray-600">Complaint Type:</strong> <span class="capitalize">{{
                  selectedComplaint.complaint_type?.replace('_', ' ') || 'N/A' }}</span></p>
                <p><strong class="text-gray-600">Date Filed:</strong> {{ formatDate(selectedComplaint.created_at) }}</p>
                <p><strong class="text-gray-600">Last Updated:</strong> {{ formatDate(selectedComplaint.updated_at) }}
                </p>
                <p><strong class="text-gray-600">Assigned To:</strong>
                  <span v-if="selectedComplaint.assigned_to_details">
                    {{ selectedComplaint.assigned_to_details.first_name }} {{
                      selectedComplaint.assigned_to_details.last_name }}
                  </span>
                  <span v-else-if="selectedComplaint.assigned_to">User ID: {{ selectedComplaint.assigned_to }} (
                    Details Pending)</span>
                  <span v-else>Unassigned</span>
                </p>
              </div>
              <hr class="my-3">
              <div>
                <strong class="text-gray-600 block mb-1">Grievance Details:</strong>
                <div class="prose prose-sm max-w-none bg-gray-50 p-3 rounded-md min-h-[50px]">{{
                  selectedComplaint.grievance_details || 'No details provided.' }}</div>
              </div>
              <div v-if="selectedComplaint.attachment" class="mt-2">
                <strong class="text-gray-600">Attachment:</strong>
                <a :href="selectedComplaint.attachment" target="_blank"
                  class="ml-2 text-blue-600 hover:text-blue-800 hover:underline break-all">
                  {{ getFileName(selectedComplaint.attachment) }} <span class="text-xs">(Click to view/download)</span>
                </a>
              </div>
              <hr class="my-3">
              <p class="font-semibold text-gray-800">Submitter Information:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <p><strong class="text-gray-600">Name:</strong> {{ selectedComplaint.submitted_by_name || 'N/A' }}</p>
                <p><strong class="text-gray-600">Email:</strong> {{ selectedComplaint.submitted_by_email || 'N/A' }}</p>
                <p><strong class="text-gray-600">Contact:</strong> {{ selectedComplaint.submitted_by_contact_number ||
                  'N/A' }}</p>
                <p><strong class="text-gray-600">Address:</strong> {{ selectedComplaint.submitted_by_address || 'N/A' }}
                </p>
              </div>
              <div v-if="selectedComplaint.aggrieved_party_name || selectedComplaint.aggrieved_party_address">
                <hr class="my-3">
                <p class="font-semibold text-gray-800">Aggrieved Party Information (if different):</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <p><strong class="text-gray-600">Name:</strong> {{ selectedComplaint.aggrieved_party_name || 'N/A' }}
                  </p>
                  <p><strong class="text-gray-600">Address:</strong> {{ selectedComplaint.aggrieved_party_address ||
                    'N/A' }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 2: Link Respondent Professional -->
          <section class="pt-4">
            <h4 class="text-lg font-medium text-gray-800 mb-3 border-b pb-2">Link Respondent Professional</h4>
            <p class="text-sm text-gray-600 mb-2">Currently Linked Respondent:
              <strong class="text-gray-700">
                <span v-if="selectedComplaint.respondent_application">
                  {{ selectedComplaint.respondent_application.full_name ||
                    selectedComplaint.respondent_application.name }} ({{ 
                    selectedComplaint.respondent_application.email_address || 'No email' }})
                </span>
                <span v-else-if="selectedComplaint.professional_name && !selectedComplaint.respondent_application">
                  {{ selectedComplaint.professional_name }} (Manual entry, not linked to system record)
                </span>
                <span v-else>Not Linked / Not Identified in System</span>
              </strong>
            </p>
            <div class="space-y-3">
              <label for="respondentSearchableDropdown" class="block text-sm font-medium text-gray-700">Search and
                Select Respondent Professional from System</label>
              <div class="relative">
                <div class="relative">
                  <input type="text" id="respondentSearchableDropdown" v-model="respondentSearchQuery"
                    @input="debouncedFilterRespondents" @focus="isRespondentDropdownOpen = true"
                    @click="toggleRespondentDropdown"
                    :placeholder="selectedRespondentToLink ? `${selectedRespondentToLink.name} (${selectedRespondentToLink.email})` : 'Search by name or email...'"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    autocomplete="off" />
                  <button v-if="selectedRespondentToLink" @click="clearRespondentSelection"
                    class="absolute inset-y-0 right-8 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    title="Clear selection">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button @click="toggleRespondentDropdown"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
                    <svg class="h-5 w-5" :class="{ 'rotate-180': isRespondentDropdownOpen }"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 01-1.414-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div v-if="isRespondentDropdownOpen"
                  class="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg custom-scrollbar"
                  @click.stop>
                  <ul v-if="isLoadingLinkableRespondents" class="text-sm text-gray-500 py-2 px-3">Loading
                    professionals...</ul>
                  <ul v-else-if="filteredLinkableRespondents.length > 0" class="divide-y divide-gray-100">
                    <li v-for="prof in filteredLinkableRespondents" :key="prof.id" @click="selectRespondentToLink(prof)"
                      class="px-3 py-2 text-sm hover:bg-indigo-50 cursor-pointer"
                      :class="{ 'bg-indigo-100 font-semibold': selectedRespondentToLink?.id === prof.id }">
                      {{ prof.name }} ({{ prof.email }}) - <span class="text-xs text-gray-500">{{ prof.role ||
                        'Professional' }}</span>
                    </li>
                  </ul>
                  <ul v-else-if="respondentSearchQuery && !isLoadingLinkableRespondents"
                    class="text-sm text-gray-500 py-2 px-3">
                    No professionals found matching "{{ respondentSearchQuery }}".
                  </ul>
                  <ul
                    v-else-if="!respondentSearchQuery && allLinkableRespondents.length === 0 && !isLoadingLinkableRespondents"
                    class="text-sm text-gray-500 py-2 px-3">
                    No approved professionals found in the system.
                  </ul>
                </div>
              </div>
              <button @click="confirmLinkRespondent" :disabled="!selectedRespondentToLink || isSubmittingRespondentLink"
                class="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                {{ isSubmittingRespondentLink ? 'Linking...' : 'Confirm Link Respondent' }}
              </button>
            </div>
          </section>

          <!-- Section 3: Update Status -->
          <section class="pt-4">
            <h4 class="text-lg font-medium text-gray-800 mb-3 border-b pb-2">Update Status & Remarks</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="complaintStatus" class="block text-sm font-medium text-gray-700">New Status</label>
                <select v-model="selectedStatusNameForUpdate" id="complaintStatus"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option disabled value="">Select a status</option>
                  <option v-for="statusOpt in masterStatuses" :key="statusOpt.id" :value="statusOpt.name">{{
                    statusOpt.name }}</option>
                </select>
              </div>
              <div>
                <label for="remarks" class="block text-sm font-medium text-gray-700">Internal Remarks</label>
                <textarea v-model="complaintRemarks" id="remarks" rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  :placeholder="selectedComplaint.remarks ? 'Update remarks...' : 'Add remarks...'"></textarea>
              </div>
            </div>
            <button @click="confirmUpdateStatus"
              :disabled="!selectedStatusNameForUpdate || (selectedStatusNameForUpdate === selectedComplaint.status && complaintRemarks.trim() === (selectedComplaint.remarks || '').trim()) || isSubmittingStatusUpdate"
              class="mt-4 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
              {{ isSubmittingStatusUpdate ? 'Updating...' : 'Update Status & Remarks' }}
            </button>
          </section>
        </div>

        <!-- Modal Footer -->
        <div class="mt-8 pt-5 border-t border-gray-200 flex justify-end">
          <button @click="closeCombinedModal" type="button"
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Global Toast Message -->
    <div v-if="toast.message"
      :class="['fixed bottom-5 right-5 p-4 rounded-md shadow-lg text-white text-sm z-50', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']"
      role="alert">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import apiServices from '@/services/services'; // Adjust path as needed

const complaints = ref([]);
const isLoading = ref(true);
const selectedComplaint = ref(null);
const showCombinedModal = ref(false);

const masterStatuses = ref([]);
const selectedStatusNameForUpdate = ref('');
const complaintRemarks = ref('');

// For linking Respondent Professional
const respondentSearchQuery = ref('');
const allLinkableRespondents = ref([]);
const isLoadingLinkableRespondents = ref(false);
const selectedRespondentToLink = ref(null);
const isRespondentDropdownOpen = ref(false);
const isSubmittingRespondentLink = ref(false);

// For status update
const isSubmittingStatusUpdate = ref(false);

const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
  next: null,
  previous: null,
  visiblePages: computed(() => {
    const total = pagination.totalPages;
    if (total <= 1) return [];
    const current = pagination.currentPage;
    const delta = 1;
    const range = [];
    let l;
    range.push(1);
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (total > 1) range.push(total);

    const withDots = [];
    l = null;
    range.forEach(i => {
      if (l !== null) {
        if (i - l === 2) {
          withDots.push(l + 1);
        } else if (i - l > 2) {
          withDots.push('...');
        }
      }
      withDots.push(i);
      l = i;
    });
    return Array.from(new Set(withDots));
  })
});

const toast = reactive({
  message: '',
  type: 'success',
  timer: null
});

const showToast = (message, type = 'success', duration = 4000) => {
  toast.message = message;
  toast.type = type;
  if (toast.timer) clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { toast.message = ''; }, duration);
};

const fetchComplaints = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await apiServices.getComplaints({ page, per_page: pagination.perPage });
    complaints.value = response.data.results.map(c => ({
      ...c,
      status: c.status || 'Unknown' // Ensure status exists for styling
    }));
    pagination.totalItems = response.data.count;
    pagination.totalPages = Math.ceil(response.data.count / pagination.perPage);
    pagination.next = response.data.next;
    pagination.previous = response.data.previous;
    pagination.currentPage = page;
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    showToast('Failed to load complaints.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const fetchPaginatedComplaints = (pageNumber) => {
  if (pageNumber !== '...' && pageNumber >= 1 && pageNumber <= pagination.totalPages && pageNumber !== pagination.currentPage && !isLoading.value) {
    fetchComplaints(pageNumber);
  }
};

const fetchMasterStatuses = async () => {
  try {
    const response = await apiServices.getComplaintMasterStatuses();
    if (response.data && response.data.results) {
      masterStatuses.value = response.data.results.sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name));
    } else {
      showToast('Could not load status options.', 'error');
    }
  } catch (error) {
    console.error('Failed to fetch master statuses:', error);
    showToast('Error loading status options.', 'error');
  }
};

const fetchAllLinkableRespondents = async () => {
  isLoadingLinkableRespondents.value = true;
  allLinkableRespondents.value = [];
  try {
    const response = await apiServices.getMhpcNewApplications({ page_size: 1000 }); // Assuming this fetches Applications
    if (response.data && response.data.results) {
      const professionals = [];
      for (const app of response.data.results) {
        const applicationId = app.id;

        if (!applicationId) {
          console.warn(`Application object from API (reg no: ${app.registration_no || 'N/A'}) is missing a valid PK for linking. Skipping. Data:`, app);
          continue;
        }

        if (app.user_qualifications && app.user_qualifications.length > 0) {
          const primaryApprovedQualification = app.user_qualifications.find(
            uq => uq.is_primary_qualification && uq.endorsement_decision === "Approved"
          );
          const anyApprovedQualification = app.user_qualifications.find(
            uq => uq.endorsement_decision === "Approved"
          );
          const approvedQualification = primaryApprovedQualification || anyApprovedQualification;

          if (approvedQualification) {
            let professionalName = 'N/A';
            let professionalEmail = 'N/A';

            if (app.user && (app.user.first_name || app.user.last_name)) {
              professionalName = `${app.user.first_name || ''} ${app.user.last_name || ''}`.trim();
              professionalEmail = app.user.email || 'N/A';
            } else if (app.applicant_details && app.applicant_details.full_name) {
              professionalName = app.applicant_details.full_name;
              professionalEmail = app.applicant_details.email || 'N/A';
            } else if (app.full_name) {
              professionalName = app.full_name;
              professionalEmail = app.email_address || 'N/A';
            } else if (app.applicant_name) {
              professionalName = app.applicant_name;
            }
            if (professionalName === '' || professionalName === 'N/A') professionalName = `App ID ${applicationId}`;


            professionals.push({
              id: applicationId, // CRITICAL: This is the Application's PK
              name: professionalName,
              email: professionalEmail,
              role: approvedQualification.personnel_category_name ||
                approvedQualification.personnel_sub_category_name ||
                'Professional',
            });
          }
        }
      }
      allLinkableRespondents.value = professionals;
    } else {
      showToast('Error loading professionals list (no results).', 'error');
    }
  } catch (error) {
    console.error('Failed to fetch professionals for linking:', error);
    showToast('Error fetching professionals for linking.', 'error');
  } finally {
    isLoadingLinkableRespondents.value = false;
  }
};


const filteredLinkableRespondents = computed(() => {
  if (!respondentSearchQuery.value.trim()) return allLinkableRespondents.value;
  const query = respondentSearchQuery.value.toLowerCase();
  return allLinkableRespondents.value.filter(prof =>
  (prof.name?.toLowerCase().includes(query) ||
    prof.email?.toLowerCase().includes(query) ||
    prof.role?.toLowerCase().includes(query))
  );
});

let filterRespondentDebounceTimer;
const debouncedFilterRespondents = () => {
  clearTimeout(filterRespondentDebounceTimer);
  filterRespondentDebounceTimer = setTimeout(() => {
    // Filtering is handled by the computed property
  }, 300);
};

const openCombinedModal = async (complaint) => {
  isLoading.value = true;
  try {
    const response = await apiServices.getComplaintDetails(complaint.id);
    selectedComplaint.value = response.data;

    selectedStatusNameForUpdate.value = selectedComplaint.value.status || '';
    complaintRemarks.value = selectedComplaint.value.remarks || '';

    respondentSearchQuery.value = '';
    selectedRespondentToLink.value = null;
    isRespondentDropdownOpen.value = false;

    // Fetch linkable respondents if not already loaded or if a refresh is desired
    if (allLinkableRespondents.value.length === 0) {
      await fetchAllLinkableRespondents();
    }

    showCombinedModal.value = true;
  } catch (error) {
    console.error('Failed to fetch complaint details:', error);
    showToast('Error loading complaint details.', 'error');
    selectedComplaint.value = null;
  } finally {
    isLoading.value = false;
  }
};

const closeCombinedModal = () => {
  showCombinedModal.value = false;
  selectedComplaint.value = null;
  selectedStatusNameForUpdate.value = '';
  complaintRemarks.value = '';

  respondentSearchQuery.value = '';
  isRespondentDropdownOpen.value = false;
  selectedRespondentToLink.value = null;
};

const selectRespondentToLink = (professional) => {
  selectedRespondentToLink.value = professional;
  respondentSearchQuery.value = ''; // Clear search query to show selected in placeholder
  isRespondentDropdownOpen.value = false;
};

const clearRespondentSelection = () => {
  selectedRespondentToLink.value = null;
  respondentSearchQuery.value = '';
  isRespondentDropdownOpen.value = true; // Optionally re-open dropdown
};

const toggleRespondentDropdown = () => {
  isRespondentDropdownOpen.value = !isRespondentDropdownOpen.value;
  if (isRespondentDropdownOpen.value && allLinkableRespondents.value.length === 0 && !isLoadingLinkableRespondents.value) {
    fetchAllLinkableRespondents(); // Fetch if dropdown opens and list is empty
  }
};

const confirmLinkRespondent = async () => {
  if (!selectedComplaint.value || !selectedRespondentToLink.value) return;
  isSubmittingRespondentLink.value = true;
  try {
    const payload = {
      respondent_application: selectedRespondentToLink.value.id // This is Application PK
    };
    const updatedComplaintResponse = await apiServices.updateComplaint(selectedComplaint.value.id, payload);
    showToast(`Respondent '${selectedRespondentToLink.value.name}' linked to complaint.`, 'success');

    const index = complaints.value.findIndex(c => c.id === selectedComplaint.value.id);
    if (index !== -1) {
      complaints.value[index] = { ...complaints.value[index], ...updatedComplaintResponse.data };
    } else {
      await fetchComplaints(pagination.currentPage);
    }
    if (selectedComplaint.value) {
      selectedComplaint.value = { ...selectedComplaint.value, ...updatedComplaintResponse.data };
    }
    // Optionally clear selection after successful link
    // selectedRespondentToLink.value = null;
    // respondentSearchQuery.value = '';

  } catch (error) {
    console.error('Failed to link respondent to complaint:', error);
    const errorMsg = error.response?.data?.respondent_application?.[0] || error.response?.data?.detail || 'Failed to link respondent.';
    showToast(`Linking Error: ${errorMsg}`, 'error');
  } finally {
    isSubmittingRespondentLink.value = false;
  }
};

const confirmUpdateStatus = async () => {
  if (!selectedComplaint.value || !selectedStatusNameForUpdate.value) return;
  const statusChanged = selectedStatusNameForUpdate.value !== selectedComplaint.value.status;
  const remarksChanged = complaintRemarks.value.trim() !== (selectedComplaint.value.remarks || '').trim();

  if (!statusChanged && !remarksChanged) {
    showToast('No changes made to status or remarks.', 'info');
    return;
  }
  isSubmittingStatusUpdate.value = true;
  try {
    const payload = {
      status: selectedStatusNameForUpdate.value,
      remarks: complaintRemarks.value.trim() || null
    };
    const updatedComplaintResponse = await apiServices.updateComplaint(selectedComplaint.value.id, payload);
    showToast('Complaint status and/or remarks updated.', 'success');

    const index = complaints.value.findIndex(c => c.id === selectedComplaint.value.id);
    if (index !== -1) {
      complaints.value[index] = { ...complaints.value[index], ...updatedComplaintResponse.data };
    } else {
      await fetchComplaints(pagination.currentPage);
    }
    if (selectedComplaint.value) {
      selectedComplaint.value = { ...selectedComplaint.value, ...updatedComplaintResponse.data };
    }
  } catch (error) {
    console.error('Failed to update complaint status/remarks:', error);
    const errorMsg = error.response?.data?.detail || error.response?.data?.status?.[0] || 'Failed to update status/remarks.';
    showToast(`Update Error: ${errorMsg}`, 'error');
  } finally {
    isSubmittingStatusUpdate.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    console.error('Invalid date for formatDate:', dateString, e);
    return 'Invalid Date';
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    return new Date(dateTimeString).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    console.error('Invalid date/time for formatDateTime:', dateTimeString, e);
    return 'Invalid DateTime';
  }
};

const getFileName = (url) => {
  if (!url) return 'Attached File';
  try {
    return decodeURIComponent(url.substring(url.lastIndexOf('/') + 1));
  } catch (e) {
    console.error('Error extracting file name from URL:', url, e);
    return 'Attached File';
  }
};

const getStatusClass = (statusName) => {
  if (!statusName) return 'bg-gray-200 text-gray-800';
  const lowerStatus = statusName.toLowerCase();
  if (['submitted', 'registered', 'pending'].includes(lowerStatus)) return 'bg-blue-100 text-blue-800';
  if (lowerStatus === 'under review') return 'bg-yellow-100 text-yellow-800';
  if (lowerStatus === 'investigation') return 'bg-orange-100 text-orange-800';
  if (['resolved', 'closed', 'completed'].includes(lowerStatus)) return 'bg-green-100 text-green-800';
  if (lowerStatus === 'action pending') return 'bg-purple-100 text-purple-800';
  if (['rejected', 'unresolved', 'no action needed', 'escalated', 'withdrawn'].includes(lowerStatus)) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800'; // Default
};

onMounted(() => {
  fetchComplaints();
  fetchMasterStatuses();
  // fetchAllLinkableRespondents(); // Fetched on modal open if list is empty, or pre-fetch if desired
});
</script>

<style scoped>
.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  /* gray-400 */
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
  /* gray-500 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #e5e7eb;
  /* gray-200 */
  border-radius: 3px;
}

/* Ensure the modal content area has a defined height to make overflow-y work */
.max-h-\[80vh\] {
  max-height: 80vh;
}
</style>