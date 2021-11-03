<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <!-- Main Modal Overlay -->
      <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Main Modal Panel -->
          <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application" style="max-width: 60rem">
              <!-- Enhanced Status Banner -->
              <div :class="[
                'px-8 py-6 border-b relative overflow-hidden',
                modalStatusInfo.bannerClass, // Use computed banner class
              ]">
                <div class="flex items-center justify-between relative z-10">
                  <div class="flex items-center space-x-4">
                    <div class="p-3 bg-white rounded-lg shadow-sm">
                      <FileText class="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                        EOI Application Details
                        {{ isEditing ? '(Editing)' : '' }}
                      </DialogTitle>
                      <p class="text-sm text-gray-600 mt-1">
                        Review and manage EOI application information
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span :class="[
                      'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                      modalStatusInfo.pillClass, // Use computed pill class
                    ]">
                      <Circle class="h-4 w-4" :class="modalStatusInfo.iconClass" />
                      <span>{{ modalStatusInfo.displayText }}</span>
                    </span>
                    <button type="button"
                      class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                      @click="closeModal">
                      <span class="sr-only">Close</span>
                      <X class="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
                  <div class="transform rotate-45">
                    <FileText class="h-32 w-32" />
                  </div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <!-- Institute Information Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                          <User class="h-5 w-5 text-gray-500" />
                          <span>Institute Information</span>
                        </h4>
                        <div class="flex flex-col items-start space-y-4">
                          <div>
                            <h5 v-if="!isEditing" class="text-xl font-semibold text-gray-900">
                              {{ application.name_of_institution }}
                            </h5>
                            <input v-else type="text" v-model="editableApplication.name_of_institution"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                              placeholder="Institute Name" />
                          </div>
                          <div class="w-full grid grid-cols-1 gap-4 mt-4">
                            <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                              <MapPin class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span v-if="!isEditing" class="text-sm text-gray-600">{{
                                application.address
                              }}</span>
                              <input v-else type="text" v-model="editableApplication.address"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Address" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Contact Information Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                          <Contact class="h-5 w-5 text-gray-500" />
                          <span>Contact Information</span>
                        </h4>
                        <div class="space-y-4">
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Mail class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-sm text-gray-600">{{
                              application.email_address
                            }}</span>
                            <input v-else type="email" v-model="editableApplication.email_address"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Email Address" />
                          </div>
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Phone class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-sm text-gray-600">{{
                              application.contact_no
                            }}</span>
                            <input v-else type="tel" v-model="editableApplication.contact_no"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Contact Number" />
                          </div>
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <UserCircle class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <template v-if="!isEditing">
                              <span class="text-sm text-gray-600">
                                {{ application.village }}, {{ application.dzongkhag }}
                              </span>
                            </template>
                            <template v-else>
                              <div class="flex space-x-2 w-full">
                                <input type="text" v-model="editableApplication.village"
                                  class="w-1/2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Village" />
                                <input type="text" v-model="editableApplication.dzongkhag"
                                  class="w-1/2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Dzongkhag" />
                              </div>
                            </template>
                          </div>
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 flex-shrink-0"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span v-if="!isEditing" class="text-sm text-gray-600">{{
                              application.website || 'N/A'
                            }}</span>
                            <input v-else type="url" v-model="editableApplication.website"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Website URL" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                          <FileText class="h-5 w-5 text-gray-500" />
                          <span>Application Details</span>
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Applicant ID (CID)</p>
                            <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <FileCheck class="h-4 w-4 text-gray-400" />
                              <span>{{ application.CID }}</span>
                            </p>
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Program Type</p>
                            <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Hash class="h-4 w-4 text-gray-400" />
                              <span>{{ application.program_type?.program_name || 'N/A' }}</span>
                            </p>
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Date Submitted</p>
                            <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Calendar class="h-4 w-4 text-gray-400" />
                              <span>{{ formatDate(application.created_at) }}</span>
                            </p>
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg md:col-span-2">
                            <p class="text-sm font-medium text-gray-500">Supporting Documents</p>
                            <p class="text-sm text-gray-900 mt-2">
                              <a v-if="application.institute_eoi_supporting_documents"
                                :href="application.institute_eoi_supporting_documents" target="_blank"
                                class="text-blue-600 hover:underline flex items-center space-x-2">
                                <FileText class="h-4 w-4" />
                                <span>View Document</span>
                              </a>
                              <span v-else class="text-gray-500">No document uploaded</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="application && application.physical_verification_remarks"
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                          <h4 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
                            <ClipboardCheck class="h-5 w-5 text-gray-500" />
                            <span>Physical Verification</span>
                          </h4>
                          <button v-if="
                            modalStatusInfo.displayText === 'Pending Physical Verification' &&
                            !isEditingPhysicalVerification &&
                            !isEditing
                          " type="button"
                            class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-1"
                            @click="startEditingPhysicalVerification" :disabled="isSaving">
                            <Pencil class="h-3 w-3" />
                            <span>Update Details</span>
                          </button>
                        </div>

                        <div v-if="!isEditingPhysicalVerification" class="space-y-4">
                          <div>
                            <p class="text-sm font-medium text-gray-500">Verification Date</p>
                            <p class="text-sm text-gray-900 mt-1">
                              {{
                                application.physical_verification_date
                                  ? formatDate(application.physical_verification_date)
                                  : 'Not Scheduled'
                              }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Verification Status</p>
                            <p class="text-sm text-gray-900 mt-1">
                              <span :class="[
                                'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                                application.is_physical_verification
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800',
                              ]">
                                {{ application.is_physical_verification ? 'Completed' : 'Pending' }}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Remarks</p>
                            <p class="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                              {{
                                application.physical_verification_remarks || 'No remarks provided.'
                              }}
                            </p>
                          </div>
                        </div>

                        <form v-else @submit.prevent="savePhysicalVerificationDetails" class="space-y-4">
                          <div>
                            <label for="pv_date" class="block text-sm font-medium text-gray-700">Verification
                              Date</label>
                            <input type="date" id="pv_date" v-model="editablePhysicalVerificationDetails.date"
                              class="mt-1 block w-full" />
                          </div>
                          <div>
                            <label for="pv_remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
                            <textarea id="pv_remarks" rows="3" v-model="editablePhysicalVerificationDetails.remarks"
                              class="mt-1 block w-full" placeholder="Enter verification remarks..."></textarea>
                          </div>
                          <div class="flex items-center">
                            <input id="pv_is_verified" type="checkbox"
                              v-model="editablePhysicalVerificationDetails.is_verified"
                              class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                            <label for="pv_is_verified" class="ml-2 block text-sm text-gray-900">
                              Mark as Verified
                            </label>
                          </div>
                          <p v-if="physicalVerificationSaveError" class="text-sm text-red-600 mt-2">
                            {{ physicalVerificationSaveError }}
                          </p>
                          <div class="flex justify-end space-x-3 mt-4">
                            <button type="button"
                              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                              @click="cancelEditingPhysicalVerification" :disabled="isSaving">
                              Cancel
                            </button>
                            <button type="submit"
                              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
                              :disabled="isSaving">
                              {{ isSaving ? 'Saving...' : 'Save Verification Details' }}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Modal Footer -->
              <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                <div class="flex justify-between items-center">
                  <div v-if="errorMessage || saveError" class="text-sm text-red-600 flex items-center space-x-2">
                    <CircleAlert class="h-4 w-4" />
                    <span>{{ errorMessage || saveError }}</span>
                  </div>
                  <div v-else></div>

                  <div class="flex items-center space-x-4">
                    <button type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                      @click="closeModal">
                      <X class="h-4 w-4 mr-1.5" /> Close
                    </button>

                    <template v-if="!isEditing && !isEditingPhysicalVerification && !isEoiWorkflowFinalized">
                      <!-- Edit Application button -->
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
                        @click="startEditing" :disabled="isSaving">
                        <Pencil class="h-4 w-4 mr-1.5" /> Edit Application
                      </button>

                      <!-- Regret EOI button -->
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700"
                        @click="openPromptDialog('rejectEOI')" :disabled="isSaving">
                        <Ban class="h-4 w-4 mr-1.5" /> Regret EOI
                      </button>

                      <!-- Approve for Verification button -->
                      <button v-if="
                        application.application_status === 'EOI Submitted' ||
                        application.application_status === 'EOI Pending Review'
                      " type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
                        @click="openPromptDialog('approveToVerify')" :disabled="isSaving">
                        <ClipboardCheck class="h-4 w-4 mr-1.5" /> Approve for Verification
                      </button>

                      <!-- Finalize EOI Approval button -->
                      <button v-if="
                        application.application_status === 'EOI Pending Physical Verification' &&
                        application.is_physical_verification
                      " type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700"
                        @click="openPromptDialog('finalEOIApprove')" :disabled="isSaving">
                        <CheckCircle class="h-4 w-4 mr-1.5" /> Finalize EOI Approval
                      </button>
                    </template>

                    <template v-if="isEditing && !isEditingPhysicalVerification">
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
                        @click="cancelEditing" :disabled="isSaving">
                        <X class="h-4 w-4 mr-1.5" /> Cancel Edit
                      </button>
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
                        @click="saveChanges" :disabled="isSaving">
                        <Save class="h-4 w-4 mr-1.5" />
                        {{ isSaving ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <TransitionRoot appear :show="isPromptDialogOpen" as="template">
                <Dialog as="div" @close="cancelPromptAction" class="relative z-[100]">
                  <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                    leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-xs" />
                  </TransitionChild>
                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                      <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                          class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                            {{ promptTitle }}
                          </DialogTitle>
                          <div class="mt-4">
                            <label for="promptInput" class="block text-sm font-medium text-gray-700 mb-1">
                              {{ promptLabel }}
                            </label>
                            <textarea id="promptInput" v-model="promptInputText" rows="4"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              :placeholder="promptPlaceholder"></textarea>
                            <p v-if="promptErrorMessage" class="mt-2 text-sm text-red-600">
                              {{ promptErrorMessage }}
                            </p>
                          </div>
                          <div class="mt-6 flex justify-end space-x-3">
                            <button type="button"
                              class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                              @click="cancelPromptAction" :disabled="isSaving">
                              Cancel
                            </button>
                            <button type="button" :class="promptConfirmButtonClass" @click="confirmPromptAction"
                              :disabled="isSaving">
                              {{ isSaving ? 'Processing...' : promptConfirmButtonText }}
                            </button>
                          </div>
                        </DialogPanel>
                      </TransitionChild>
                    </div>
                  </div>
                </Dialog>
              </TransitionRoot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  User,
  UserCircle,
  Calendar,
  Contact,
  Mail,
  Phone,
  MapPin,
  FileText,
  FileCheck,
  Hash,
  CircleAlert,
  Circle,
  X,
  Pencil,
  Save,
  Ban,
  ClipboardCheck,
  CheckCircle,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import apiService from '@/services/services' // Adjust path
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'application-updated'])

const errorMessage = ref('')
const saveError = ref('')
const isEditing = ref(false)
const isSaving = ref(false)
const editableApplication = ref(null)
const selectedFile = ref(null)
const fileName = ref('')
const fileInputRef = ref(null) // Changed from fileInput

const isPromptDialogOpen = ref(false)
const promptActionType = ref('') // e.g., 'approveToVerify', 'rejectEOI', 'finalEOIApprove'
const promptInputText = ref('')
const promptErrorMessage = ref('')

const isEditingPhysicalVerification = ref(false)
const editablePhysicalVerificationDetails = ref({
  date: null,
  remarks: '',
  is_verified: false,
})
const physicalVerificationSaveError = ref('')

// --- Computed properties for Prompt Dialog (dynamic text and classes) ---
const promptTitle = computed(() => {
  switch (promptActionType.value) {
    case 'approveToVerify':
      return 'Confirm Approval for Physical Verification'
    case 'rejectEOI':
      return 'Confirm EOI Rejection' // Updated from 'reject'
    case 'finalEOIApprove':
      return 'Confirm Final EOI Approval'
    default:
      return 'Confirm Action'
  }
})

const promptLabel = computed(() => {


  switch (promptActionType.value) {
    case 'approveToVerify':
      return 'Approval Notes (Optional):'
    case 'rejectEOI':
      return 'Rejection Reason (Required):' // Updated from 'reject'
    case 'finalEOIApprove':
      return 'Final Approval Notes (Optional):'
    default:
      return 'Notes:'
  }
})

const promptPlaceholder = computed(() => {
  switch (promptActionType.value) {
    case 'approveToVerify':
      return 'Enter notes for moving to verification...'
    case 'rejectEOI':
      return 'Enter reason for rejection...' // Updated from 'reject'
    case 'finalEOIApprove':
      return 'Enter notes for final EOI approval...'
    default:
      return 'Enter details...'
  }
})

const promptConfirmButtonText = computed(() => {
  if (isSaving.value) return 'Processing...'
  switch (promptActionType.value) {
    case 'approveToVerify':
      return 'Confirm for Verification'
    case 'rejectEOI':
      return 'Confirm Rejection' // Updated from 'reject'
    case 'finalEOIApprove':
      return 'Confirm Final Approval'
    default:
      return 'Confirm'
  }
})

const promptConfirmButtonClass = computed(() => {
  let baseClass =
    'inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
  switch (promptActionType.value) {
    case 'approveToVerify':
      return `${baseClass} bg-green-600 hover:bg-green-700 focus:ring-green-500`
    case 'rejectEOI':
      return `${baseClass} bg-red-600 hover:bg-red-700 focus:ring-red-500` // Updated
    case 'finalEOIApprove':
      return `${baseClass} bg-teal-600 hover:bg-teal-700 focus:ring-teal-500`
    default:
      return `${baseClass} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`
  }
})

const isEoiWorkflowFinalized = computed(() => {
  if (!props.application?.application_status) return true
  const status = props.application.application_status
  const finalizedStatuses = [
    'EOI Approved',
    'EOI Rejected',
    'DPR Submitted',
    'DPR Pending Review',
    'DPR Approved',
    'DPR Rejected',
    'Payment Pending',
    'Fully Approved',
    'Final Rejected',
  ]
  return finalizedStatuses.includes(status)
})
// --- End Prompt Dialog Computed Properties ---

const validateApplicationIdentifier = () => {
  if (!props.application?.CID) {
    errorMessage.value = 'Invalid or missing application CID.'
    toast.error(errorMessage.value)
    return false
  }
  return true
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      selectedFile.value = null
      fileName.value = ''
      if (fileInputRef.value) fileInputRef.value.value = ''
      return
    }
    selectedFile.value = file
    fileName.value = file.name
  } else {
    selectedFile.value = null
    fileName.value = ''
  }
}

const closeModal = () => {
  if (isPromptDialogOpen.value) cancelPromptAction()
  if (isEditingPhysicalVerification.value) cancelEditingPhysicalVerification()
  if (isEditing.value) cancelEditing()
  emit('close')
}

const closeModalHandler = () => {
  closeModal()
}

const startEditing = () => {
  if (!validateApplicationIdentifier()) return
  if (isEditingPhysicalVerification.value) {
    toast.warning('Please save or cancel physical verification edits first.')
    return
  }
  editableApplication.value = JSON.parse(JSON.stringify(props.application))
  // editableApplication.value.type_of_programme = props.application.program_type?.program_name || ''
  delete editableApplication.value.program_type
  selectedFile.value = null
  fileName.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  isEditing.value = true
  saveError.value = ''
  errorMessage.value = ''
}

const cancelEditing = () => {
  editableApplication.value = null
  selectedFile.value = null
  fileName.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  isEditing.value = false
  saveError.value = ''
  errorMessage.value = ''
}

const saveChanges = async () => {
  if (!editableApplication.value || !validateApplicationIdentifier()) return
  isSaving.value = true
  saveError.value = ''

  try {
    const formData = new FormData()
    const fieldsToUpdate = [
      'name_of_institution',
      'address',
      'email_address',
      'contact_no',
      'village',
      'dzongkhag',
      'website',
      // 'type_of_programme',
      'head_of_institution_name',
      'head_of_institution_gender',
      'head_of_institution_phone_number',
      'head_of_institution_email',
      'dpr_name',
      'executive_summary',
      'remarks', // Removed 'declaration' if not typically edited here
    ]

    fieldsToUpdate.forEach((field) => {
      if (
        editableApplication.value[field] !== undefined &&
        editableApplication.value[field] !== null
      ) {
        formData.append(field, editableApplication.value[field])
      }
    })
    if (typeof editableApplication.value.declaration === 'boolean') {
      // Handle boolean specifically
      formData.append('declaration', editableApplication.value.declaration)
    }

    if (selectedFile.value) {
      formData.append('institute_eoi_supporting_documents', selectedFile.value)
    }

    const response = await apiService.patchMhpcInstitute(props.application.CID, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response && response.status === 200 && response.data) {
      toast.success('Application Updated Successfully!')
      emit('application-updated', response.data)
      isEditing.value = false
    } else {
      const serverError =
        response?.data?.detail ||
        response?.data?.message ||
        (response?.data
          ? JSON.stringify(response.data)
          : `Server responded with ${response?.status || 'unknown status'}`)
      saveError.value = `Failed to save changes: ${serverError}`
      toast.error(saveError.value)
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (error.response?.data ? JSON.stringify(error.response.data) : null) ||
      error.message ||
      'Unknown error during save'
    saveError.value = `Failed to save changes: ${errorMsg}`
    toast.error(saveError.value)
  } finally {
    isSaving.value = false
  }
}

const startEditingPhysicalVerification = () => {
  if (!props.application || isEditing.value) {
    if (isEditing.value) toast.warning('Please save or cancel main application edits first.')
    return
  }
  isEditingPhysicalVerification.value = true
  physicalVerificationSaveError.value = ''
  let pvDate = props.application.physical_verification_date
  if (pvDate) {
    try {
      pvDate = new Date(pvDate).toISOString().split('T')[0]
    } catch (e) {
      console.error(
        'Error parsing physical verification date:',
        props.application.physical_verification_date,
        e
      )
      pvDate = null // Fallback to null if parsing fails
    }
  }
  editablePhysicalVerificationDetails.value = {
    date: pvDate,
    remarks: props.application.physical_verification_remarks || '',
    is_verified: props.application.is_physical_verification || false,
  }
}

const cancelEditingPhysicalVerification = () => {
  isEditingPhysicalVerification.value = false
  physicalVerificationSaveError.value = ''
}

const savePhysicalVerificationDetails = async () => {
  // Changed to be called by form submit
  if (!props.application?.CID || !validateApplicationIdentifier()) {
    physicalVerificationSaveError.value = 'Application CID is missing.'
    toast.error(physicalVerificationSaveError.value)
    return
  }
  isSaving.value = true
  physicalVerificationSaveError.value = ''

  const payload = {
    physical_verification_date: editablePhysicalVerificationDetails.value.date || null,
    physical_verification_remarks: editablePhysicalVerificationDetails.value.remarks.trim() || '', // Ensure remarks is a string
    is_physical_verification: editablePhysicalVerificationDetails.value.is_verified,
  }

  try {
    const response = await apiService.patchMhpcInstitute(props.application.CID, payload, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (response && response.status === 200 && response.data) {
      toast.success('Physical verification details updated successfully!')
      emit('application-updated', response.data)
      isEditingPhysicalVerification.value = false
    } else {
      const serverError =
        response?.data?.detail ||
        response?.data?.message ||
        (response?.data
          ? JSON.stringify(response.data)
          : `Server responded with ${response?.status || 'unknown status'}`)
      physicalVerificationSaveError.value = `Failed to save: ${serverError}`
      toast.error(physicalVerificationSaveError.value)
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (error.response?.data ? JSON.stringify(error.response.data) : null) ||
      error.message ||
      'Unknown error'
    physicalVerificationSaveError.value = `Failed to save: ${errorMsg}`
    toast.error(physicalVerificationSaveError.value)
  } finally {
    isSaving.value = false
  }
}

const openPromptDialog = (action) => {
  if (isEditing.value || isEditingPhysicalVerification.value) {
    toast.warning('Please save or cancel current edits before proceeding.')
    return
  }
  if (!validateApplicationIdentifier()) return
  promptActionType.value = action
  promptInputText.value = ''
  promptErrorMessage.value = ''
  isPromptDialogOpen.value = true
}

const cancelPromptAction = () => {
  isPromptDialogOpen.value = false
  promptInputText.value = ''
  promptErrorMessage.value = ''
  promptActionType.value = '' // Reset action type
}

const confirmPromptAction = async () => {
  if (!validateApplicationIdentifier()) {
    toast.error('Cannot proceed: Application identifier is missing.')
    isPromptDialogOpen.value = false
    return
  }

  isSaving.value = true
  promptErrorMessage.value = ''
  let payload = {}
  let successMessage = ''
  let failureMessagePrefix = ''
  const notes = promptInputText.value.trim()

  switch (promptActionType.value) {
    case 'approveToVerify':
      payload = {
        application_status: 'EOI Pending Physical Verification',
        do_eoi_review_decision: 'Approved',
        remarks: notes || props.application.remarks,
        is_physical_verification: false,
        physical_verification_date: null,
        physical_verification_remarks: null,
      }
      if (notes && props.application.remarks)
        payload.remarks = `${props.application.remarks}\n\n[Verification Approval Notes]:\n${notes}`
      else if (notes) payload.remarks = `[Verification Approval Notes]:\n${notes}`
      successMessage = `Application ${props.application.CID} approved for physical verification!`
      failureMessagePrefix = 'Failed to approve for physical verification'
      break

    case 'rejectEOI':
      if (!notes) {
        promptErrorMessage.value = 'A reason is required to reject the EOI.'
        isSaving.value = false
        return
      }
      payload = {
        application_status: 'EOI Rejected',
        do_eoi_review_decision: 'Rejected',
        review_decision: 'Rejected',
        reason_if_rejected: notes,
      }
      successMessage = `EOI for application ${props.application.CID} has been rejected.`
      failureMessagePrefix = 'Failed to reject EOI'
      break

    case 'finalEOIApprove':
      payload = {
        application_status: 'EOI Approved',
        // review_decision: 'Approved', // Backend can handle based on status
        remarks: notes || props.application.remarks,
      }
      if (notes && props.application.remarks)
        payload.remarks = `${props.application.remarks}\n\n[Final EOI Approval Notes]:\n${notes}`
      else if (notes) payload.remarks = `[Final EOI Approval Notes]:\n${notes}`
      successMessage = `EOI for application ${props.application.CID} has been finalized and approved!`
      failureMessagePrefix = 'Failed to finalize EOI approval'
      break

    default:
      toast.error('Invalid action type.')
      isSaving.value = false
      return
  }

  try {
    const response = await apiService.patchMhpcInstitute(props.application.CID, payload, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (response && response.status === 200 && response.data) {
      toast.success(successMessage)
      emit('application-updated', response.data)
      cancelPromptAction()
    } else {
      const serverError =
        response?.data?.detail ||
        response?.data?.message ||
        (response?.data
          ? JSON.stringify(response.data)
          : `Server responded with ${response?.status || 'unknown status'}`)
      promptErrorMessage.value = `${failureMessagePrefix}: ${serverError}`
      toast.error(promptErrorMessage.value)
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (error.response?.data ? JSON.stringify(error.response.data) : null) ||
      error.message ||
      'Unknown error'
    promptErrorMessage.value = `${failureMessagePrefix}: ${errorMsg}`
    toast.error(promptErrorMessage.value)
  } finally {
    isSaving.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-T]/)
      if (parts.length >= 3) {
        const parsedDate = new Date(Date.UTC(parts[0], parseInt(parts[1], 10) - 1, parts[2]))
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          })
        }
      }
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Invalid Date'
  }
}

// THIS IS THE KEY COMPUTED PROPERTY FOR MODAL STATUS DISPLAY
const modalStatusInfo = computed(() => {
  const app = props.application
  if (!app || !app.application_status) {
    // Default for when application data might not be fully loaded yet
    return {
      displayText: 'Loading...',
      bannerClass: 'bg-gray-50 border-gray-100',
      pillClass: 'bg-gray-100 text-gray-800',
      iconClass: 'text-gray-500',
    }
  }

  const appStatus = app.application_status
  const isPVComplete = app.is_physical_verification // Relies on this boolean field

  let displayText = appStatus // Default to raw status
  let bannerClass = 'bg-yellow-50 border-yellow-100' // Default banner
  let pillClass = 'bg-yellow-100 text-yellow-800' // Default pill
  let iconClass = 'text-yellow-500' // Default icon

  if (appStatus === 'EOI Pending Physical Verification') {
    if (isPVComplete) {
      displayText = 'Physical Verification Completed'
      bannerClass = 'bg-teal-50 border-teal-100' // Teal for PV Completed banner
      pillClass = 'bg-teal-100 text-teal-800' // Teal for PV Completed pill
      iconClass = 'text-teal-500' // Teal for PV Completed icon
    } else {
      displayText = 'Pending Physical Verification'
      // Yellow is default, no change needed here for banner/pill/icon
    }
  } else if (
    appStatus === 'EOI Approved' ||
    appStatus === 'Fully Approved' ||
    appStatus === 'DPR Approved'
  ) {
    displayText = appStatus // Can be more specific if needed, e.g., 'EOI Approved'
    bannerClass = 'bg-green-50 border-green-100'
    pillClass = 'bg-green-100 text-green-800'
    iconClass = 'text-green-500'
  } else if (
    appStatus === 'EOI Rejected' ||
    appStatus === 'DPR Rejected' ||
    appStatus === 'Final Rejected'
  ) {
    displayText = appStatus // Can be 'Regretted' if preferred
    bannerClass = 'bg-red-50 border-red-100'
    pillClass = 'bg-red-100 text-red-800'
    iconClass = 'text-red-500'
  } else if (
    appStatus === 'EOI Submitted' ||
    appStatus === 'EOI Pending Review' ||
    appStatus === 'DPR Submitted' ||
    appStatus === 'DPR Pending Review' ||
    appStatus === 'Payment Pending'
  ) {
    displayText = appStatus
    // Yellow is default
  }
  // Add more specific status mappings here if needed, e.g., 'Draft'
  else if (appStatus === 'Draft') {
    displayText = 'Draft'
    bannerClass = 'bg-gray-100 border-gray-200' // Example for Draft
    pillClass = 'bg-gray-200 text-gray-700'
    iconClass = 'text-gray-400'
  }

  return { displayText, bannerClass, pillClass, iconClass }
})

// Watchers
watch(
  () => props.application,
  (newVal, oldVal) => {
    if (newVal && newVal.CID !== oldVal?.CID) {
      if (isEditing.value) cancelEditing()
      if (isPromptDialogOpen.value) cancelPromptAction()
      if (isEditingPhysicalVerification.value) cancelEditingPhysicalVerification()
      errorMessage.value = ''
      saveError.value = ''
    }
    if (newVal && !newVal.CID && props.isOpen) {
      errorMessage.value = 'Application data is missing its CID.'
    } else if (newVal?.CID) {
      errorMessage.value = '' // Clear error if CID becomes available
    }
  },
  { deep: true }
)

watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (!newIsOpen) {
      cancelEditing()
      cancelPromptAction()
      cancelEditingPhysicalVerification()
      errorMessage.value = ''
      saveError.value = ''
      physicalVerificationSaveError.value = ''
      promptErrorMessage.value = ''
      promptInputText.value = '' // Reset prompt text on close
    } else {
      // Reset non-persistent states when modal opens
      if (!isEditing.value && !isPromptDialogOpen.value && !isEditingPhysicalVerification.value) {
        editableApplication.value = null // Prepare for new data
        selectedFile.value = null
        fileName.value = ''
        if (fileInputRef.value) fileInputRef.value.value = ''
        // Reset PV details for a fresh edit session if needed, or rely on startEditingPV
        editablePhysicalVerificationDetails.value = { date: null, remarks: '', is_verified: false }
      }

      if (props.application && !props.application.CID) {
        errorMessage.value = 'Application data is missing its CID. Please close and retry.'
        toast.error(errorMessage.value)
      } else {
        errorMessage.value = ''
      }
    }
  }
)
</script>

<style scoped>
input[type='text'],
input[type='email'],
input[type='tel'],
input[type='url'],
input[type='date'],
textarea {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.bg-gray-50 input,
.bg-gray-50 textarea {
  @apply px-2 py-1;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
