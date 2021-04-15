<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Application Header -->
              <div
                v-if="application"
                class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                      ECPF Ownership Change Application
                    </h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.cidNo }}</p>
                  </div>

                  <!-- Edit Button -->
                  <div>
                    <button
                      type="button"
                      class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      @click="toggleEditMode"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v5h-5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <!-- Current ECPF Details -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-blue-100 p-2 rounded-md">
                            <DocumentDuplicateIcon class="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Current ECPF Details</h4>
                        </div>
                        <p>
                          <strong>ECPF License No.:</strong>
                          {{ applicationData['ECPF License No.'] || 'N/A' }}
                        </p>
                        <p>
                          <strong>Name of the ECPF:</strong>
                          {{ applicationData['Name of the ECPF'] || 'N/A' }}
                        </p>
                        <p>
                          <strong>Proprietor of the ECPF:</strong>
                          {{ applicationData['Proprietor of the ECPF'] || 'N/A' }}
                        </p>
                        <p>
                          <strong>Location of ECPF:</strong>
                          {{ applicationData['Location of ECPF'] || 'N/A' }}
                        </p>
                      </div>
                    </div>

                    <!-- Personal Information (New Applicants) -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-indigo-100 p-2 rounded-md">
                            <UserIcon class="h-5 w-5 text-indigo-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Applicant Information</h4>
                        </div>
                        <p>
                          <strong>CID No.:</strong>
                          <input
                            v-if="isEditing"
                            type="text"
                            v-model="applicationData['CID No.']"
                            class="mt-0.5 ml-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md inline-block"
                          />
                          <span v-else>{{ applicationData['CID No.'] || 'N/A' }}</span>
                        </p>
                        <p>
                          <strong>Applicant's Name:</strong>
                          {{ applicationData['Applicants Name'] || 'N/A' }}
                        </p>
                        <p><strong>Gender:</strong> {{ applicationData['Gender'] || 'N/A' }}</p>
                        <p>
                          <strong>Date of Birth:</strong>
                          {{ applicationData['Date of Birth'] || 'N/A' }}
                        </p>
                        <p>
                          <strong>Contact No.:</strong>
                          {{ applicationData['Contact No.'] || 'N/A' }}
                        </p>
                        <p>
                          <strong>Email Address:</strong>
                          {{ applicationData['Email Address'] || 'N/A' }}
                        </p>
                      </div>
                    </div>

                    <!-- Residential/Present Address -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <MapPinIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">
                            Residential/Present Address
                          </h4>
                        </div>
                        <p>
                          <strong>Office Number:</strong>
                          {{ applicationData['Office Number'] || 'N/A' }}
                        </p>
                        <p><strong>Flat No.:</strong> {{ applicationData['Flat No.'] || 'N/A' }}</p>
                        <p>
                          <strong>Building No.:</strong>
                          {{ applicationData['Building No.'] || 'N/A' }}
                        </p>
                        <p><strong>Location:</strong> {{ applicationData['Location'] || 'N/A' }}</p>
                        <p>
                          <strong>Gewog/Throm:</strong>
                          {{ applicationData['Gewog/Throm'] || 'N/A' }}
                        </p>
                        <p>
                          <strong>Dzongkhag/Thromde:</strong>
                          {{ applicationData['Dzongkhag/Thromde'] || 'N/A' }}
                        </p>
                      </div>
                    </div>

                    <!-- Permanent Address -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-amber-100 p-2 rounded-md">
                            <MapPinIcon class="h-5 w-5 text-amber-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Permanent Address</h4>
                        </div>
                        <p>
                          <strong>Village/Chiwog:</strong>
                          {{ applicationData['Village/Chiwog'] || 'N/A' }}
                        </p>
                        <p><strong>Gewog:</strong> {{ applicationData['Gewog'] || 'N/A' }}</p>
                        <p><strong>Dungkhag:</strong> {{ applicationData['Dungkhag'] || 'N/A' }}</p>
                        <p>
                          <strong>Dzongkhag/Thromde:</strong>
                          {{ applicationData['Dzongkhag/Thromde'] || 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Application Details Section -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-green-100 p-2 rounded-md">
                            <DocumentTextIcon class="h-5 w-5 text-green-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Application Details</h4>
                        </div>

                        <!-- Tab Navigation (New) -->
                        <div class="border-b border-gray-200 mb-6">
                          <nav class="-mb-px flex space-x-6">
                            <button
                              v-for="(tab, index) in tabs"
                              :key="index"
                              @click="activeTab = tab.id"
                              class="py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap"
                              :class="[
                                activeTab === tab.id
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              ]"
                            >
                              {{ tab.name }}
                            </button>
                          </nav>
                        </div>

                        <!-- Education Tab -->
                        <div v-if="activeTab === 'education'" class="space-y-4">
                          <p><strong>Education Details:</strong></p>
                          <p>
                            Course/Qualification:
                            {{ applicationData['Course/Qualification'] || 'N/A' }}
                          </p>
                          <p>
                            Name of Institute: {{ applicationData['Name of Institute'] || 'N/A' }}
                          </p>
                          <p>
                            Name of University: {{ applicationData['Name of University'] || 'N/A' }}
                          </p>
                        </div>

                        <!-- Proposal Tab -->
                        <div v-if="activeTab === 'proposal'" class="space-y-4">
                          <p><strong>Proposal for Change in Ownership of ECPF Details:</strong></p>
                          <p>
                            <strong>Name of the Proposed Firm:</strong>
                            <input
                              v-if="isEditing"
                              type="text"
                              v-model="applicationData['Name of the Proposed Firm']"
                              class="mt-0.5 ml-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md inline-block"
                            />
                            <span v-else>{{
                              applicationData['Name of the Proposed Firm'] || 'N/A'
                            }}</span>
                          </p>
                          <p>
                            <strong>Address of the Proposed Firm:</strong>
                            <input
                              v-if="isEditing"
                              type="text"
                              v-model="applicationData['Address of the Proposed Firm']"
                              class="mt-0.5 ml-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md inline-block"
                            />
                            <span v-else>{{
                              applicationData['Address of the Proposed Firm'] || 'N/A'
                            }}</span>
                          </p>
                          <p>
                            <strong>Location of the Proposed Firm:</strong>
                            <input
                              v-if="isEditing"
                              type="text"
                              v-model="applicationData['Location of the Proposed Firm']"
                              class="mt-0.5 ml-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md inline-block"
                            />
                            <span v-else>{{
                              applicationData['Location of the Proposed Firm'] || 'N/A'
                            }}</span>
                          </p>
                        </div>

                        <!-- Linkages Tab -->
                        <div v-if="activeTab === 'linkages'" class="space-y-4">
                          <p><strong>Institute/Colleges/University Linkages:</strong></p>
                          <p>
                            Name of Colleges/University/institute:
                            {{ applicationData['Name of Colleges/University/institute'] || 'N/A' }}
                          </p>
                          <p>Location: {{ applicationData['Linkage Location'] || 'N/A' }}</p>
                          <p>Country: {{ applicationData['Linkage Country'] || 'N/A' }}</p>
                          <p>
                            Recognition/Accreditation:
                            {{ applicationData['Recognition/Accreditation'] || 'N/A' }}
                          </p>
                          <p>
                            Approval from University:
                            {{ applicationData['Approval from University'] || 'N/A' }}
                          </p>
                        </div>

                        <!-- Documents Tab -->
                        <div v-if="activeTab === 'documents'" class="space-y-4">
                          <p><strong>Supporting Documents:</strong></p>
                          <p>
                            CV of the Applicant:
                            <button class="text-indigo-600 hover:text-indigo-800">View</button>
                          </p>
                          <p>
                            CV & Certificate of Counsellors:
                            <button class="text-indigo-600 hover:text-indigo-800">View</button>
                          </p>
                          <p>
                            CID of Guarantor:
                            <button class="text-indigo-600 hover:text-indigo-800">View</button>
                          </p>
                          <p>
                            Proposal Details:
                            <button class="text-indigo-600 hover:text-indigo-800">View</button>
                          </p>
                          <p>
                            Declaration:
                            <button class="text-indigo-600 hover:text-indigo-800">View</button>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Application Status & Chief Actions -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-gray-100 p-2 rounded-md">
                            <ListBulletIcon class="h-5 w-5 text-gray-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">
                            Application Status & Chief Actions
                          </h4>
                        </div>

                        <!-- Shortlisting Review Section -->
                        <div class="mb-6 p-4 border border-gray-200 rounded-md">
                          <div class="flex items-center mb-2">
                            <div class="bg-yellow-100 p-2 rounded-md mr-2">
                              <ListBulletIcon class="h-5 w-5 text-yellow-600" />
                            </div>
                            <h5 class="font-semibold text-gray-900">Shortlisting Review</h5>
                          </div>

                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label
                                for="shortlistedStatus"
                                class="block text-sm font-medium text-gray-700"
                                >Shortlisting Status</label
                              >
                              <select
                                id="shortlistedStatus"
                                v-model="shortlistingDecision"
                                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              >
                                <option value="">-- Select --</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                            <div v-if="shortlistingDecision === 'rejected'">
                              <label
                                for="regretReasonShortlist"
                                class="block text-sm font-medium text-gray-700"
                                >Rejection Reason (Shortlisting)</label
                              >
                              <textarea
                                id="regretReasonShortlist"
                                v-model="regretReasonShortlist"
                                rows="2"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                              ></textarea>
                            </div>
                          </div>

                          <div class="flex justify-end space-x-2">
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              @click="cancelShortlisting"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              @click="saveShortlisting"
                            >
                              Save Shortlisting
                            </button>
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              @click="notifyApplicantShortlisting"
                              :disabled="isNotifiedShortlisting"
                            >
                              Notify Applicant
                            </button>
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              @click="viewApplication"
                            >
                              View Application
                            </button>
                          </div>
                        </div>

                        <!-- Evaluation/Presentation Section -->
                        <div class="mb-6 p-4 border border-gray-200 rounded-md">
                          <div class="flex items-center mb-2">
                            <div class="bg-orange-100 p-2 rounded-md mr-2">
                              <PresentationChartLineIcon class="h-5 w-5 text-orange-600" />
                            </div>
                            <h5 class="font-semibold text-gray-900">
                              Evaluation/Presentation Review
                            </h5>
                          </div>

                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label
                                for="evaluationDecision"
                                class="block text-sm font-medium text-gray-700"
                                >Evaluation Decision</label
                              >
                              <select
                                id="evaluationDecision"
                                v-model="evaluationDecision"
                                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              >
                                <option value="">-- Select --</option>
                                <option value="approved">Approve</option>
                                <option value="regret">Reject</option>
                              </select>
                            </div>
                            <div v-if="evaluationDecision === 'regret'">
                              <label
                                for="regretReasonEval"
                                class="block text-sm font-medium text-gray-700"
                                >Rejection Reason (Evaluation)</label
                              >
                              <textarea
                                id="regretReasonEval"
                                v-model="regretReasonEval"
                                rows="2"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                              ></textarea>
                            </div>
                            <div v-if="evaluationDecision === 'approved'">
                              <label
                                for="approveDecisionText"
                                class="block text-sm font-medium text-gray-700"
                                >Approval Remarks</label
                              >
                              <textarea
                                id="approveDecisionText"
                                v-model="approveDecisionText"
                                rows="2"
                                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                              ></textarea>
                            </div>
                          </div>

                          <div class="flex justify-end space-x-2">
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              @click="cancelEvaluation"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              @click="saveEvaluation"
                            >
                              Save Evaluation
                            </button>
                          </div>
                        </div>

                        <!-- MoU & Undertaking Signing Section -->
                        <div class="mb-6 p-4 border border-gray-200 rounded-md">
                          <div class="flex items-center mb-2">
                            <div class="bg-teal-100 p-2 rounded-md mr-2">
                              <DocumentCheckIcon class="h-5 w-5 text-teal-600" />
                            </div>
                            <h5 class="font-semibold text-gray-900">
                              MoU & Undertaking Finalization
                            </h5>
                          </div>

                          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label
                                for="mouSignedDate"
                                class="block text-sm font-medium text-gray-700"
                                >MoU Signed Date</label
                              >
                              <input
                                type="date"
                                id="mouSignedDate"
                                v-model="mouSignedDate"
                                class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label
                                for="mouExpiryDate"
                                class="block text-sm font-medium text-gray-700"
                                >MoU Expiry Date</label
                              >
                              <input
                                type="date"
                                id="mouExpiryDate"
                                v-model="mouExpiryDate"
                                class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div></div>
                          </div>

                          <div class="flex justify-end">
                            <button
                              type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              @click="completeRegistration"
                            >
                              Complete Registration
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer buttons -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModal"
                >
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, watch } from 'vue'
import {
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ListBulletIcon,
  PresentationChartLineIcon,
  DocumentCheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: Object,
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const applicationData = ref({})
const activeTab = ref('proposal')
const isEditing = ref(false) // Track if chief is in edit mode

// Shortlisting Section Data
const shortlistingDecision = ref('')
const regretReasonShortlist = ref('')
const isNotifiedShortlisting = ref(false) // Example to disable after notification

// Evaluation Section Data
const evaluationDecision = ref('')
const regretReasonEval = ref('')
const approveDecisionText = ref('')

// MoU Section Data
const mouSignedDate = ref('')
const mouExpiryDate = ref('')

watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      // Simulate fetching detailed application data. In real scenario, fetch from API using application ID.
      applicationData.value = {
        'ECPF License No.': 'ECPF-2023-123',
        'Name of the ECPF': newApplication.firmName,
        'Proprietor of the ECPF': 'Old Proprietor Name',
        'Location of ECPF': 'Thimphu',
        'CID No.': newApplication.cidNo,
        'Applicants Name': newApplication.applicantName,
        Gender: 'Male',
        'Date of Birth': '1990-01-15',
        'Contact No.': newApplication.contactNo,
        'Email Address': 'sonam@example.com',
        'Office Number': '101',
        'Flat No.': 'A',
        'Building No.': 'XYZ Building',
        Location: 'Thimphu',
        'Gewog/Throm': 'Chang Gewog',
        'Dzongkhag/Thromde': 'Thimphu Thromde',
        'Village/Chiwog': 'Chang Gewog',
        Gewog: 'Chang Gewog',
        Dungkhag: '',
        'Permanent Dzongkhag/Thromde': 'Thimphu Thromde',
        'Course/Qualification': 'Counseling Psychology',
        'Name of Institute': 'Institute of Wellbeing',
        'Name of University': 'Bhutan University',
        'Name of the Proposed Firm': 'New Firm Name ECPF',
        'Address of the Proposed Firm': 'New Firm Address',
        'Location of the Proposed Firm': 'Paro',
        'Name of Colleges/University/institute': 'College of Medical Sciences',
        'Linkage Location': 'Thimphu',
        'Linkage Country': 'Bhutan',
        'Recognition/Accreditation': 'Accredited',
        'Approval from University': 'Approved',
        // ... populate other fields as needed based on requirements and sample data
      }
    } else {
      applicationData.value = {}
    }
  },
)

// Tab data
const tabs = ref([
  { id: 'proposal', name: 'Proposal' },
  { id: 'education', name: 'Education' },
  { id: 'linkages', name: 'Linkages' },
  { id: 'documents', name: 'Documents' },
])

// Edit Mode Functionality
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    // Actions to perform when edit mode is enabled (if any)
    console.log('Edit mode enabled')
  } else {
    // Actions to perform when edit mode is disabled (e.g., save changes)
    console.log('Edit mode disabled, saving changes (simulated)')
    // In real scenario, you would send the updated applicationData.value to the backend to save.
  }
}

// Shortlisting Section Methods
const saveShortlisting = () => {
  console.log('Shortlisting Saved:', {
    decision: shortlistingDecision.value,
    regretReason: regretReasonShortlist.value,
  })
  // In real scenario, API call to save shortlisting decision
}

const cancelShortlisting = () => {
  shortlistingDecision.value = ''
  regretReasonShortlist.value = ''
  console.log('Shortlisting Cancelled')
}

const notifyApplicantShortlisting = () => {
  console.log('Notify Applicant - Shortlisting')
  isNotifiedShortlisting.value = true // Disable buttons after notification
  // In real scenario, API call to notify applicant
}

const viewApplication = () => {
  console.log('View Application')
  // In real scenario, logic to view application details (could be already viewing)
}

// Evaluation Section Methods
const saveEvaluation = () => {
  console.log('Evaluation Saved:', {
    decision: evaluationDecision.value,
    regretReason: regretReasonEval.value,
    approveText: approveDecisionText.value,
  })
  // In real scenario, API call to save evaluation decision and notify applicant if approved
  if (evaluationDecision.value === 'approved') {
    alert('Applicant notified to proceed with payment (Simulated)') // Replace with actual notification logic
  }
}

const cancelEvaluation = () => {
  evaluationDecision.value = ''
  regretReasonEval.value = ''
  approveDecisionText.value = ''
  console.log('Evaluation Cancelled')
}

// MoU Section Methods
const completeRegistration = () => {
  console.log('Registration Completed', {
    mouSignedDate: mouSignedDate.value,
    mouExpiryDate: mouExpiryDate.value,
  })
  alert('Registration Completed and Registered Number Generated (Simulated)')
  // In real scenario, API call to complete registration and generate registered number
}
</script>
