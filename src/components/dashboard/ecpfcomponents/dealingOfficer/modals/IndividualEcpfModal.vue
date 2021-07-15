<!-- EcpfApplicationModal.vue (Template Part) -->
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
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
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
              class="w-full w-full transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Application Header -->
              <div
                v-if="application"
                class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <!-- Use proposed_firm_name -->
                    <h2 class="text-2xl font-bold tracking-tight">
                      {{ application.proposed_firm_name || 'Application Details' }}
                    </h2>
                    <!-- Use cid_no -->
                    <p class="mt-1 text-white/90">CID No: {{ application.cid_no }}</p>
                  </div>

                  <!-- Status Indicator -->
                  <div class="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span class="flex items-center">
                      <span class="h-3 w-3 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                      <!-- Use the corrected computed status getter -->
                      <span class="font-medium">{{ derivedApplicationStatus }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <!-- Personal Information -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-blue-100 p-2 rounded-md">
                            <UserIcon class="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Personal Information</h4>
                        </div>
                        <!-- Corrected field names -->
                        <p>
                          <strong>CID No.:</strong>
                          {{ application.cid_no }}
                        </p>
                        <p>
                          <strong>Applicant's Name:</strong>
                          {{ application.applicants_name }}
                        </p>
                        <p>
                          <strong>Gender:</strong>
                          {{ application.gender }}
                        </p>
                        <p>
                          <strong>Date of Birth:</strong>
                          {{ formatDate(application.date_of_birth) }}
                        </p>
                        <!-- Format date -->
                        <p>
                          <strong>Contact No.:</strong>
                          {{ application.contact_no }}
                        </p>
                        <p>
                          <strong>Email Address:</strong>
                          {{ application.email }}
                        </p>
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-indigo-100 p-2 rounded-md">
                            <MapPinIcon class="h-5 w-5 text-indigo-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Contact Information</h4>
                        </div>
                        <p><strong>Present Address:</strong></p>
                        <!-- Corrected: Access directly from application, use snake_case -->
                        <p>Office Number: {{ application.office_number }}</p>
                        <p>Flat No: {{ application.flat_no }}</p>
                        <p>Building No: {{ application.building_no }}</p>
                        <p>Location: {{ application.location }}</p>
                        <p>Gewog/Throm: {{ application.gewog_throm }}</p>
                        <p>
                          Dzongkhag/Thromde:
                          {{ application.dzongkhag_thromde }}
                        </p>
                        <br />
                        <p><strong>Permanent Address:</strong></p>
                        <!-- Corrected: Access directly from application, use snake_case -->
                        <p>
                          Village/Chiwog:
                          {{ application.permanent_village }}
                        </p>
                        <p>Gewog: {{ application.permanent_gewog }}</p>
                        <p>Dungkhag: {{ application.permanent_dungkhag }}</p>
                        <p>
                          Dzongkhag/Thromde:
                          {{ application.permanent_dzongkhag }}
                        </p>
                      </div>
                    </div>

                    <!-- Timeline Card (Corrected based on available data) -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <ClockIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Application Timeline</h4>
                        </div>
                        <div class="space-y-4">
                          <!-- Assuming mou_sign_date represents creation/submission -->
                          <div class="relative pl-6 pb-4 border-l-2 border-green-500">
                            <div
                              class="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-green-500"
                            ></div>
                            <p class="text-sm font-medium text-green-600">
                              Application Submitted/MoU Signed
                            </p>
                            <p class="text-xs text-gray-500">
                              {{ formatDate(application.mou_sign_date || new Date()) }}
                            </p>
                          </div>
                          <!-- Add more timeline events if relevant data exists in API -->
                        </div>
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

                        <div class="border-b border-gray-200 mb-6">
                          <nav class="-mb-px flex space-x-6 overflow-x-auto">
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
                          <!-- Corrected: Access directly from application, use snake_case -->
                          <p>
                            Qualification:
                            {{ application.qualification }}
                          </p>
                          <p>
                            Institute Name:
                            {{ application.institute_name }}
                          </p>
                          <p>
                            University Name:
                            {{ application.university_name }}
                          </p>
                        </div>

                        <!-- Proposal Tab -->
                        <div v-if="activeTab === 'proposal'" class="space-y-4">
                          <p><strong>ECPF Proposal Details:</strong></p>
                          <!-- Corrected: Access directly from application, use snake_case -->
                          <p>
                            Firm Name:
                            {{ application.proposed_firm_name }}
                          </p>
                          <p>Firm Address: {{ application.firm_address }}</p>
                          <p>
                            Firm Location:
                            {{ application.firm_location }}
                          </p>
                          <p>
                            Firm Type:
                            {{ firmTypeName }}
                          </p>
                          <!-- Adjust logic for type_of_firm -->

                          <div class="mt-6">
                            <p>
                              <strong>Purpose of Establishment:</strong>
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                              <!-- Corrected: Access directly from application, use snake_case -->
                              <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h5 class="text-yellow-800 font-medium mb-2">Vision</h5>
                                <p class="text-sm text-gray-700">
                                  {{ application.vision }}
                                </p>
                              </div>
                              <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h5 class="text-blue-800 font-medium mb-2">Mission</h5>
                                <p class="text-sm text-gray-700">
                                  {{ application.mission }}
                                </p>
                              </div>
                              <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h5 class="text-green-800 font-medium mb-2">Objective</h5>
                                <p class="text-sm text-gray-700">
                                  {{ application.objective }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- HR Tab - Remove or adapt if data becomes available -->
                        <div v-if="activeTab === 'hr'" class="space-y-4">
                          <p class="text-center py-6 text-gray-500 italic">
                            Human Resources Information Not Available.
                          </p>
                        </div>

                        <!-- Finance & Services Tab -->
                        <div v-if="activeTab === 'finance'" class="space-y-4">
                          <p><strong>Finance Plan:</strong></p>
                          <!-- Corrected: Access directly from application, use snake_case -->
                          <div class="bg-white rounded-lg border border-gray-200 p-4">
                            <p>{{ application.finance_plan }}</p>
                          </div>

                          <p><strong>Services:</strong></p>
                          <p class="text-center py-6 text-gray-500 italic">
                            Services Information Not Available.
                          </p>
                        </div>

                        <!-- SWOT Tab -->
                        <div v-if="activeTab === 'swot'" class="space-y-4">
                          <p><strong>SWOT Analysis:</strong></p>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Corrected: Access directly from application, use snake_case -->
                            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h5 class="text-green-800 font-medium mb-2">Strengths</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.strengths }}
                              </p>
                            </div>
                            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                              <h5 class="text-red-800 font-medium mb-2">Weaknesses</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.weaknesses }}
                              </p>
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h5 class="text-blue-800 font-medium mb-2">Opportunities</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.opportunities }}
                              </p>
                            </div>
                            <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <h5 class="text-orange-800 font-medium mb-2">Threats</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.threats }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <!-- Fees & Guarantor Tab -->
                        <div v-if="activeTab === 'fees'" class="space-y-4">
                          <p><strong>Fee & Charges:</strong></p>
                          <p class="text-center py-6 text-gray-500 italic">
                            Fee Charges Information Not Available.
                          </p>

                          <p><strong>Guarantor Details:</strong></p>
                          <!-- Corrected: Access directly from application, use snake_case -->
                          <div
                            class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <p>
                              <span class="text-gray-600">Full Name:</span>
                              {{ application.guarantor_name }}
                            </p>
                            <p>
                              <span class="text-gray-600">CID Number:</span>
                              {{ application.guarantor_cid }}
                            </p>
                            <p>
                              <span class="text-gray-600">Relation:</span>
                              {{ application.guarantor_relation }}
                            </p>
                            <p>
                              <span class="text-gray-600">Contact Number:</span>
                              {{ application.guarantor_contact }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Decision Forms (Keep as is - they use local refs) -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <!-- Verification Decision -->
                      <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <CheckBadgeIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Verification Decision</h4>
                        </div>
                        <div class="mt-2">
                          <label
                            for="verificationDecision"
                            class="block text-sm font-medium text-gray-700"
                            >Verification Decision:</label
                          >
                          <select
                            id="verificationDecision"
                            v-model="verificationForm.verificationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Decision</option>
                            <option value="Pending Review">Pending Review</option>
                            <!-- Match parent component status -->
                            <option value="Regret">Regret</option>
                            <!-- Use 'Regret' if that's the API value -->
                          </select>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'Regret'" class="mt-2">
                          <label for="regretReason" class="block text-sm font-medium text-gray-700"
                            >Regret Reason:</label
                          >
                          <textarea
                            id="regretReason"
                            v-model="verificationForm.regretReason"
                            rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                        <div class="mt-4 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            @click="saveVerificationDecision('Pending Review')"
                          >
                            <!-- Emit the correct status -->
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Accept for Review
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="confirmRejectVerification"
                          >
                            <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>

                      <!-- Evaluation Decision -->
                      <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center mb-4">
                          <div class="bg-amber-100 p-2 rounded-md">
                            <DocumentCheckIcon class="h-5 w-5 text-amber-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Presentation Decision</h4>
                          <!-- Renamed to match API field -->
                        </div>
                        <div class="mt-2">
                          <label
                            for="evaluationDecision"
                            class="block text-sm font-medium text-gray-700"
                            >Presentation Decision:</label
                          >
                          <select
                            id="evaluationDecision"
                            v-model="evaluationForm.evaluationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Decision</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <!-- Match parent component status -->
                            <option value="Regret">Regret</option>
                          </select>
                        </div>
                        <div v-if="evaluationForm.evaluationDecision === 'Regret'" class="mt-2">
                          <label
                            for="evaluationRegretReason"
                            class="block text-sm font-medium text-gray-700"
                            >Regret Reason:</label
                          >
                          <textarea
                            id="evaluationRegretReason"
                            v-model="evaluationForm.regretReason"
                            rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                        <div class="mt-4 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            @click="saveEvaluationDecision('Shortlisted')"
                          >
                            <!-- Emit the correct status -->
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Shortlist
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="confirmRejectEvaluation"
                          >
                            <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- MoU & Undertaking Signing Form (Keep as is - uses local refs) -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-green-100 p-2 rounded-md">
                            <DocumentDuplicateIcon class="h-5 w-5 text-green-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">
                            MoU & Undertaking Signing
                          </h4>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <!-- Form fields remain the same -->
                          <div>
                            <label for="licenseName" class="block text-sm font-medium text-gray-700"
                              >License Name:</label
                            >
                            <input
                              type="text"
                              id="licenseName"
                              v-model="mouForm.licenseName"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="licenseNumber"
                              class="block text-sm font-medium text-gray-700"
                              >License Number:</label
                            >
                            <input
                              type="text"
                              id="licenseNumber"
                              v-model="mouForm.licenseNumber"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="licenseValidity"
                              class="block text-sm font-medium text-gray-700"
                              >License Validity (Years):</label
                            >
                            <input
                              type="number"
                              id="licenseValidity"
                              v-model="mouForm.licenseValidity"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label for="mouSignDate" class="block text-sm font-medium text-gray-700"
                              >MoU Sign Date:</label
                            >
                            <input
                              type="date"
                              id="mouSignDate"
                              v-model="mouForm.mouSignDate"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="mouValidityDate"
                              class="block text-sm font-medium text-gray-700"
                              >MoU Validity Date:</label
                            >
                            <input
                              type="date"
                              id="mouValidityDate"
                              v-model="mouForm.mouValidityDate"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div class="mt-6 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-6 py-2 font-semibold text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                            @click="completeRegistrationHandler"
                          >
                            <DocumentArrowDownIcon class="h-4 w-4 inline-block mr-1" />
                            Complete Registration
                          </button>
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
import { ref, computed, watch } from 'vue' // Import watch
import {
  UserIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
  firmTypes: {
    type: Array,
    default: () => [],
  },
})

const firmTypeName = computed(() => {
  if (!props.application || !props.application.type_of_firm) return 'Not specified'

  const firmType = props.firmTypes.find((type) => type.id === props.application.type_of_firm)
  return firmType ? firmType.type_of_firm : `Type ${props.application.type_of_firm}`
})

const emit = defineEmits(['close-modal', 'update-verification', 'update-evaluation', 'update-mou'])

const activeTab = ref('proposal') // Default to proposal tab

const closeModal = () => {
  emit('close-modal')
}

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
})

const evaluationForm = ref({
  evaluationDecision: '', // Corresponds to 'presentation_decision'
  regretReason: '', // Corresponds to 'presentation_regret_reason'
})

const mouForm = ref({
  licenseName: '', // Not directly in API, maybe map from firm name?
  licenseNumber: '', // Not in API
  licenseValidity: null, // Not in API
  mouSignDate: '', // Corresponds to 'mou_sign_date'
  mouValidityDate: '', // Corresponds to 'mou_validity_date'
})

// Watch for application prop changes to pre-fill forms
watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      verificationForm.value.verificationDecision = newApplication.verification_decision || ''
      verificationForm.value.regretReason = newApplication.regret_reason || '' // Assuming regret_reason is for verification

      evaluationForm.value.evaluationDecision = newApplication.presentation_decision || ''
      evaluationForm.value.regretReason = newApplication.presentation_regret_reason || ''

      // Pre-fill MoU form - adjust if needed
      mouForm.value.licenseName = newApplication.proposed_firm_name || '' // Example mapping
      mouForm.value.mouSignDate = newApplication.mou_sign_date
        ? newApplication.mou_sign_date.substring(0, 10)
        : '' // Format YYYY-MM-DD
      mouForm.value.mouValidityDate = newApplication.mou_validity_date
        ? newApplication.mou_validity_date.substring(0, 10)
        : '' // Format YYYY-MM-DD
      // mouForm.value.licenseNumber = ''; // Set if available
      // mouForm.value.licenseValidity = null; // Set if available
    } else {
      // Reset forms if application is null
      verificationForm.value = { verificationDecision: '', regretReason: '' }
      evaluationForm.value = { evaluationDecision: '', regretReason: '' }
      mouForm.value = {
        licenseName: '',
        licenseNumber: '',
        licenseValidity: null,
        mouSignDate: '',
        mouValidityDate: '',
      }
    }
  },
  { immediate: true },
) // Run immediately when the component mounts

const saveVerificationDecision = (decisionStatus) => {
  // Emit data using API field names
  const payload = {
    id: props.application.id, // Use the application ID
    verification_decision: verificationForm.value.verificationDecision || decisionStatus, // Use selected value or passed status
    regret_reason:
      verificationForm.value.verificationDecision === 'Regret'
        ? verificationForm.value.regretReason
        : '',
  }
  console.log('Emitting update-verification:', payload)
  emit('update-verification', payload)
  closeModal()
}

const confirmRejectVerification = () => {
  if (verificationForm.value.verificationDecision !== 'Regret') {
    verificationForm.value.verificationDecision = 'Regret' // Set decision before confirming
  }
  if (confirm('Are you sure you want to reject this verification?')) {
    saveVerificationDecision('Regret')
  }
}

const saveEvaluationDecision = (decisionStatus) => {
  // Emit data using API field names
  const payload = {
    id: props.application.id, // Use the application ID
    presentation_decision: evaluationForm.value.evaluationDecision || decisionStatus, // Use selected value or passed status
    presentation_regret_reason:
      evaluationForm.value.evaluationDecision === 'Regret' ? evaluationForm.value.regretReason : '',
  }
  emit('update-evaluation', payload)
  closeModal()
}

const confirmRejectEvaluation = () => {
  if (evaluationForm.value.evaluationDecision !== 'Regret') {
    evaluationForm.value.evaluationDecision = 'Regret' // Set decision before confirming
  }
  if (confirm('Are you sure you want to reject this presentation decision?')) {
    saveEvaluationDecision('Regret')
  }
}

const completeRegistrationHandler = () => {
  completeRegistration()
}

const completeRegistration = () => {
  // Emit data using API field names where possible
  const payload = {
    id: props.application.id, // Use the application ID
    mou_sign_date: mouForm.value.mouSignDate,
    mou_validity_date: mouForm.value.mouValidityDate,
  }
  emit('update-mou', payload)
  closeModal()
}

// Helper function for formatting dates (handles null/undefined)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    // Extract only the date part if it includes time/timezone
    const datePart = dateString.split('T')[0]
    const date = new Date(datePart)
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' } // Use UTC to avoid timezone shifts affecting the date part
    return date.toLocaleDateString(undefined, options)
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

// Corrected Computed property to get Application Status based on API fields
const derivedApplicationStatus = computed(() => {
  if (!props.application) return 'Loading...'

  if (props.application.chief_decision === 'Approved') return 'Approved'
  if (props.application.chief_decision === 'Regret') return 'Rejected (Chief)'
  if (props.application.presentation_decision === 'Shortlisted') return 'Shortlisted'
  if (props.application.presentation_decision === 'Regret') return 'Rejected (Presentation)'
  if (props.application.verification_decision === 'Pending Review') return 'Pending Review'
  if (props.application.verification_decision === 'Regret') return 'Rejected (Verification)'
  if (props.application.is_draft) return 'Draft'

  // Fallback status
  return 'Submitted' // Or 'Pending Review' / 'New' depending on your logic
})

// Tab data (Adjust if removing tabs like HR/Services/Fees)
const tabs = ref([
  { id: 'proposal', name: 'Proposal' },
  { id: 'education', name: 'Education' },
  // { id: 'hr', name: 'HR' }, // Comment out if data not available
  { id: 'finance', name: 'Finance Plan' }, // Renamed for clarity
  { id: 'swot', name: 'SWOT' },
  { id: 'fees', name: 'Guarantor' }, // Renamed as Fees data isn't available
])
</script>
