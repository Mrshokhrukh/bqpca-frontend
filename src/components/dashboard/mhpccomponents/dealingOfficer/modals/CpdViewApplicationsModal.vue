<template>
  <TransitionRoot appear :show="application !== null" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="div"
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
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="div"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application"
            >
              <div class="relative">
                <div
                  :class="[
                    'px-8 py-6 border-b relative overflow-hidden',
                    {
                      'bg-yellow-50 border-yellow-100':
                        application.application_status === 'SUBMITTED',
                      'bg-green-50 border-green-100':
                        application.application_status === 'APPROVED',
                      'bg-red-50 border-red-100': application.application_status === 'REGRETTED',
                    },
                  ]"
                >
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-4">
                      <div class="p-3 bg-white rounded-lg shadow-sm">
                        <FileText class="h-7 w-7 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                          CPD Application Details
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">
                          Application ID: {{ application.id }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span
                        :class="[
                          'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                          {
                            'bg-yellow-100 text-yellow-800':
                              application.application_status === 'SUBMITTED',
                            'bg-green-100 text-green-800':
                              application.application_status === 'APPROVED',
                            'bg-red-100 text-red-800':
                              application.application_status === 'REGRETTED',
                          },
                        ]"
                      >
                        <Circle
                          class="h-4 w-4"
                          :class="{
                            'text-yellow-500': application.application_status === 'SUBMITTED',
                            'text-green-500': application.application_status === 'APPROVED',
                            'text-red-500': application.application_status === 'REGRETTED',
                          }"
                        />
                        <span>{{ application.application_status || 'N/A' }}</span>
                      </span>
                      <button
                        type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="$emit('close')"
                      >
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="px-8 py-6 bg-white max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="space-y-6">
                      <InfoCard icon="User" title="Applicant Information">
                        <EditableInput
                          label="Full Name"
                          v-model="editableApplication.full_name"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          label="Registration No."
                          v-model="editableApplication.registration_no"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          label="CID Number"
                          v-model="editableApplication.cid_no"
                          :is-editing="isEditing"
                        />
                      </InfoCard>

                      <InfoCard icon="MapPin" title="Training Location & Dates">
                        <EditableInput
                          label="Proposed Location"
                          v-model="editableApplication.proposed_training_location"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          label="Venue"
                          v-model="editableApplication.venue"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          label="From Date"
                          v-model="editableApplication.from_date"
                          :is-editing="isEditing"
                          type="date"
                        />
                        <EditableInput
                          label="To Date"
                          v-model="editableApplication.to_date"
                          :is-editing="isEditing"
                          type="date"
                        />
                      </InfoCard>

                      <InfoCard icon="Briefcase" title="Provider & Justification">
                        <EditableInput
                          label="Providing Agency"
                          v-model="editableApplication.cpd_providing_agency.name"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          v-if="editableApplication.if_others_specify"
                          label="Other Agency Details"
                          v-model="editableApplication.if_others_specify"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          label="Reason for Conducting"
                          v-model="editableApplication.reason_for_conducting.name"
                          :is-editing="isEditing"
                        />
                        <EditableTextarea
                          label="Reason Details"
                          v-model="editableApplication.reason_for_details"
                          :is-editing="isEditing"
                        />
                      </InfoCard>
                    </div>

                    <div class="space-y-6">
                      <InfoCard icon="BookOpen" title="CPD Core Details">
                        <EditableTextarea
                          label="Title of CPD"
                          v-model="editableApplication.title_of_cpd"
                          :is-editing="isEditing"
                        />
                        <EditableInput
                          label="CPD Type"
                          v-model="editableApplication.type_of_cpd.cpd_activity_name"
                          :is-editing="isEditing"
                        />
                        <EditableTextarea
                          label="Expected Outcome"
                          v-model="editableApplication.expected_outcome"
                          :is-editing="isEditing"
                        />
                        <EditableTextarea
                          label="Relevance to Topic"
                          v-model="editableApplication.relevance_to_topic"
                          :is-editing="isEditing"
                        />
                        <div class="grid grid-cols-2 gap-4 pt-2">
                          <EditableInput
                            label="Duration"
                            v-model="editableApplication.duration_in_hours"
                            :is-editing="isEditing"
                            type="number"
                          />
                          <EditableInput
                            label="Credits"
                            v-model="editableApplication.credit"
                            :is-editing="isEditing"
                            type="number"
                          />
                        </div>
                      </InfoCard>

                      <InfoCard icon="ClipboardList" title="Learning Plan">
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">
                          Learning Activities
                        </h5>
                        <ul class="space-y-2 list-disc list-inside pl-1">
                          <li
                            v-for="method in application.learning_methods"
                            :key="method.id"
                            class="text-sm text-gray-800"
                          >
                            {{ method.activities }} -
                            <span class="font-medium">{{ method.duration }} hrs</span>
                          </li>
                          <li
                            v-if="!application.learning_methods?.length"
                            class="text-sm text-gray-500"
                          >
                            No learning methods listed.
                          </li>
                        </ul>
                        <hr class="my-4" />
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">
                          Teaching Methodologies
                        </h5>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="m in application.methodologies"
                            :key="m.id"
                            class="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full"
                          >
                            {{ m.methodology_name?.methodology_name }}
                          </span>
                          <p
                            v-if="!application.methodologies?.length"
                            class="text-sm text-gray-500"
                          >
                            No methodologies listed.
                          </p>
                        </div>
                      </InfoCard>

                      <InfoCard icon="Paperclip" title="Resources & Attachments">
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">Resource Persons</h5>
                        <ul class="space-y-3">
                          <li
                            v-for="resource in application.resources"
                            :key="resource.id"
                            class="text-sm"
                          >
                            <p class="font-medium text-gray-800">
                              {{ resource.resource_person_name }}
                            </p>
                            <p class="text-xs text-gray-500">
                              {{ resource.resource_person_reg_no }}
                            </p>
                            <a
                              :href="resource.document_supporting_expertise"
                              target="_blank"
                              class="text-xs text-blue-600 hover:underline mt-1 inline-block"
                              v-if="resource.document_supporting_expertise"
                              >View Expertise</a
                            >
                          </li>
                          <li v-if="!application.resources?.length" class="text-sm text-gray-500">
                            No resource persons listed.
                          </li>
                        </ul>
                        <hr class="my-4" />
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">Documents</h5>
                        <div class="space-y-2">
                          <a
                            v-if="application.course_document"
                            :href="application.course_document"
                            target="_blank"
                            class="flex items-center space-x-2 text-sm text-blue-600 hover:underline"
                          >
                            <Link class="h-4 w-4" />
                            <span>View Course Document</span>
                          </a>
                          <a
                            v-if="application.attachment"
                            :href="application.attachment"
                            target="_blank"
                            class="flex items-center space-x-2 text-sm text-blue-600 hover:underline"
                          >
                            <Link class="h-4 w-4" />
                            <span>View Additional Attachment</span>
                          </a>
                          <p
                            v-if="!application.course_document && !application.attachment"
                            class="text-sm text-gray-500"
                          >
                            No documents attached.
                          </p>
                        </div>

                        <div v-if="application.attendance_sheet_attachment">
                          <hr class="my-4" />
                          <h5 class="text-sm font-semibold text-gray-700 mb-2">
                            Attendance Sheet
                          </h5>
                          <div
                            class="relative group w-48 h-auto cursor-pointer rounded-lg overflow-hidden shadow-md border"
                            @click="openImageViewer(application.attendance_sheet_attachment)"
                          >
                            <img
                              :src="application.attendance_sheet_attachment"
                              alt="Attendance Sheet Thumbnail"
                              class="w-full object-cover"
                            />
                            <div
                              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center"
                            >
                              <Eye
                                class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                          </div>
                        </div>
                      </InfoCard>
                    </div>

                    <div class="space-y-6">
                      <InfoCard icon="Users" title="Target Audience">
                        <EditableInput
                          label="Number of Participants"
                          v-model="editableApplication.number_of_participants"
                          :is-editing="isEditing"
                          type="number"
                        />
                        <hr class="my-4" />
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">
                          Target Categories
                        </h5>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="cat in application.target_participant_categories"
                            :key="cat.id"
                            class="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                          >
                            {{ cat.category_name }}
                          </span>
                          <p
                            v-if="!application.target_participant_categories?.length"
                            class="text-sm text-gray-500"
                          >
                            No categories specified.
                          </p>
                        </div>
                        <hr class="my-4" />
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">
                          Target Sub-categories
                        </h5>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="sub in application.target_participant_subcategories"
                            :key="sub.id"
                            class="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                          >
                            {{ sub.sub_category_name }}
                          </span>
                          <p
                            v-if="!application.target_participant_subcategories?.length"
                            class="text-sm text-gray-500"
                          >
                            No sub-categories specified.
                          </p>
                        </div>
                      </InfoCard>

                      <InfoCard icon="ClipboardCheck" title="Review Status">
                        <EditableInput
                          label="Last Updated"
                          :value="formatDateTime(application.status_last_updated)"
                          :is-editing="false"
                        />
                        <EditableTextarea
                          label="Remarks"
                          v-model="editableApplication.status_remarks"
                          :is-editing="isEditing"
                        />
                      </InfoCard>

                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6"
                        ref="reviewActionCard"
                      >
                        <h4
                          class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                        >
                          <CheckCircle class="h-5 w-5 text-gray-500" />
                          <span>Review Action</span>
                        </h4>
                        <div class="flex flex-col gap-4">
                          <button
                            v-if="!isEditing"
                            type="button"
                            class="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-opacity"
                            :class="{
                              'opacity-50 cursor-not-allowed':
                                application.application_status !== 'SUBMITTED',
                            }"
                            :disabled="application.application_status !== 'SUBMITTED'"
                            @click="isEditing = true"
                          >
                            <Pencil class="h-5 w-5" />
                            Edit Application
                          </button>
                          <button
                            v-if="isEditing"
                            type="button"
                            class="w-full px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm flex items-center justify-center gap-2"
                            @click="saveChanges"
                          >
                            <Save class="h-5 w-5" />
                            Save Changes
                          </button>

                          <template v-if="!isEditing">
                            <button
                              v-if="
                                application.application_status === 'SUBMITTED' && !showApprovalForm
                              "
                              type="button"
                              class="w-full px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              @click="showApprovalForm = true"
                              :disabled="isEditing"
                            >
                              <CheckCircle class="h-5 w-5" />
                              Approve Application
                            </button>

                            <button
                              v-if="
                                application.application_status === 'SUBMITTED' && !showRejectionForm
                              "
                              type="button"
                              class="w-full px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              @click="showRejectionForm = true"
                              :disabled="isEditing"
                            >
                              <X class="h-5 w-5" />
                              Reject Application
                            </button>
                          </template>
                        </div>

                        <div
                          v-if="showApprovalForm"
                          class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
                        >
                          <label class="block text-sm font-medium text-gray-700 mb-2"
                            >Approval Remarks</label
                          >
                          <textarea
                            v-model="approvalMessage"
                            rows="2"
                            class="w-full rounded-md border-gray-300 p-2 mb-2"
                          ></textarea>
                          <label class="block text-sm font-medium text-gray-700 mb-2"
                            >Credits Awarded</label
                          >
                          <input
                            type="number"
                            v-model.number="approvalCredits"
                            min="0"
                            class="w-full rounded-md border-gray-300 p-2 mb-2"
                          />
                          <div class="flex gap-2 mt-2">
                            <button
                              type="button"
                              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                              @click="approveApplication"
                            >
                              Confirm Approve
                            </button>
                            <button
                              type="button"
                              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              @click="showApprovalForm = false"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div
                          v-if="showRejectionForm"
                          class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4"
                        >
                          <label class="block text-sm font-medium text-gray-700 mb-2"
                            >Rejection Reason</label
                          >
                          <textarea
                            v-model="rejectionMessage"
                            rows="2"
                            class="w-full rounded-md border-gray-300 p-2 mb-2"
                          ></textarea>
                          <p v-if="rejectionError" class="text-xs text-red-600 mb-2">
                            {{ rejectionError }}
                          </p>
                          <div class="flex gap-2 mt-2">
                            <button
                              type="button"
                              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                              @click="rejectApplication"
                            >
                              Confirm Reject
                            </button>
                            <button
                              type="button"
                              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              @click="showRejectionForm = false"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div
                          v-if="showCreditEditForm"
                          class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
                        >
                          <label class="block text-sm font-medium text-gray-700 mb-2"
                            >Update Awarded Credits</label
                          >
                          <input
                            type="number"
                            v-model.number="editableCredits"
                            min="0"
                            class="w-full rounded-md border-gray-300 p-2 mb-2"
                          />
                          <div class="flex gap-2 mt-2">
                            <button
                              type="button"
                              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              @click="saveCreditChanges"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              @click="showCreditEditForm = false"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="px-8 py-4 bg-gray-100 border-t border-gray-200 text-right">
                  <button
                    type="button"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2 ml-auto"
                    @click="$emit('close')"
                  >
                    <X class="h-4 w-4" />
                    <span>Close</span>
                  </button>
                </div>
              </div>

              <TransitionRoot appear :show="isImageViewerOpen" as="template">
                <Dialog as="div" @close="closeImageViewer" class="relative z-[60]">
                  <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                  >
                    <div class="fixed inset-0 bg-black/90" />
                  </TransitionChild>

                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
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
                          class="relative w-full max-w-5xl max-h-[90vh] transform transition-all"
                        >
                          <button
                            type="button"
                            class="absolute -top-12 sm:-top-4 sm:-right-12 z-10 p-2 text-white bg-gray-800/50 rounded-full hover:bg-gray-800/80 focus:outline-none transition-colors"
                            @click="closeImageViewer"
                          >
                            <X class="h-6 w-6" />
                          </button>
                          <img
                            :src="viewerImageUrl"
                            alt="Full size attendance sheet"
                            class="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                          />
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
import { ref, watch, nextTick, defineAsyncComponent, reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckCircle, X, Circle, Link, FileText, Pencil, Save, Eye } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

// Lazy load helper components for better performance
const InfoCard = defineAsyncComponent(() => import('./InfoCard.vue'))
const EditableInput = defineAsyncComponent(() => import('./EditableInput.vue'))
const EditableTextarea = defineAsyncComponent(() => import('./EditableTextarea.vue'))

const props = defineProps({
  application: {
    type: Object,
    default: () => null,
  },
  initialAction: {
    type: String, // Can be 'approve', 'reject', or null
    default: null,
  },
})

const emit = defineEmits(['close', 'approve', 'reject', 'save'])
const toast = useToast()

const isEditing = ref(false)
const editableApplication = reactive({})

const showApprovalForm = ref(false)
const showRejectionForm = ref(false)
const approvalMessage = ref('')
const rejectionMessage = ref('')
const rejectionError = ref('')
const approvalCredits = ref(0)
const reviewActionCard = ref(null) // Template ref for scrolling

const showCreditEditForm = ref(false)
const editableCredits = ref(0)

// State for the image viewer
const isImageViewerOpen = ref(false)
const viewerImageUrl = ref('')

// Methods to control the image viewer
const openImageViewer = (url) => {
  viewerImageUrl.value = url
  isImageViewerOpen.value = true
}

const closeImageViewer = () => {
  isImageViewerOpen.value = false
  viewerImageUrl.value = ''
}

watch(
  () => props.application,
  async (newApplication) => {
    if (newApplication) {
      // 1. Reset all form states when a new application is loaded
      isEditing.value = false
      Object.assign(editableApplication, JSON.parse(JSON.stringify(newApplication)))
      showApprovalForm.value = false
      showRejectionForm.value = false
      showCreditEditForm.value = false
      approvalMessage.value = ''
      rejectionMessage.value = ''
      rejectionError.value = ''
      approvalCredits.value = newApplication.credit || 0
      editableCredits.value = newApplication.credit || 0

      // Reset image viewer state on new application load
      closeImageViewer()

      // 2. Check for an initial action from the parent component
      if (props.initialAction === 'approve') {
        showApprovalForm.value = true
      } else if (props.initialAction === 'reject') {
        showRejectionForm.value = true
      }

      // 3. If an action was specified, wait for the DOM to update, then scroll
      if (props.initialAction) {
        await nextTick() // Ensures the v-if has rendered the element
        reviewActionCard.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  },
  { immediate: true, deep: true },
)



const saveChanges = () => {
  isEditing.value = false
  emit('save', editableApplication)
  toast.success('Changes saved successfully.')
}

const approveApplication = () => {
  if (approvalCredits.value < 0) {
    toast.error('Credits awarded cannot be negative.')
    return
  }
  emit('approve', {
    id: props.application.id,
    status_remarks: approvalMessage.value || 'Application approved.',
    credit: approvalCredits.value,
  })
  emit('close')
}

const rejectApplication = () => {
  if (!rejectionMessage.value.trim()) {
    rejectionError.value = 'Please provide a reason for rejection'
    toast.error('Please provide a reason for rejection.')
    return
  }
  emit('reject', {
    id: props.application.id,
    status_remarks: rejectionMessage.value,
  })
  emit('close')
}

const saveCreditChanges = () => {
  if (editableCredits.value < 0) {
    toast.error('Awarded credits cannot be negative.')
    return
  }
  emit('save', {
    id: props.application.id,
    credit: editableCredits.value,
  })
  toast.success('Credit changes saved successfully.')
  emit('close')
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
</script>