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
                      'bg-green-50 border-green-100': application.application_status === 'APPROVED',
                      'bg-red-50 border-red-100': application.application_status === 'REJECTED',
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
                              application.application_status === 'REJECTED',
                          },
                        ]"
                      >
                        <Circle
                          class="h-4 w-4"
                          :class="{
                            'text-yellow-500': application.application_status === 'SUBMITTED',
                            'text-green-500': application.application_status === 'APPROVED',
                            'text-red-500': application.application_status === 'REJECTED',
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
                        <InfoItem label="Full Name" :value="application.full_name" />
                        <InfoItem label="Registration No." :value="application.registration_no" />
                        <InfoItem label="CID Number" :value="application.cid_no" />
                      </InfoCard>

                      <InfoCard icon="MapPin" title="Training Location & Dates">
                        <InfoItem
                          label="Proposed Location"
                          :value="application.proposed_training_location"
                        />
                        <InfoItem label="Venue" :value="application.venue" />
                        <InfoItem label="From Date" :value="formatDate(application.from_date)" />
                        <InfoItem label="To Date" :value="formatDate(application.to_date)" />
                      </InfoCard>

                      <InfoCard icon="Briefcase" title="Provider & Justification">
                        <InfoItem
                          label="Providing Agency"
                          :value="application.cpd_providing_agency?.name"
                        />
                        <InfoItem
                          v-if="application.if_others_specify"
                          label="Other Agency Details"
                          :value="application.if_others_specify"
                        />
                        <InfoItem
                          label="Reason for Conducting"
                          :value="application.reason_for_conducting?.name"
                        />
                        <InfoItem
                          label="Reason Details"
                          :value="application.reason_for_details"
                          :is-long-text="true"
                        />
                      </InfoCard>
                    </div>

                    <div class="space-y-6">
                      <InfoCard icon="BookOpen" title="CPD Core Details">
                        <InfoItem
                          label="Title of CPD"
                          :value="application.title_of_cpd"
                          :is-long-text="true"
                        />
                        <InfoItem
                          label="CPD Type"
                          :value="application.type_of_cpd?.cpd_activity_name"
                        />
                        <InfoItem
                          label="Expected Outcome"
                          :value="application.expected_outcome"
                          :is-long-text="true"
                        />
                        <InfoItem
                          label="Relevance to Topic"
                          :value="application.relevance_to_topic"
                          :is-long-text="true"
                        />
                        <div class="grid grid-cols-2 gap-4 pt-2">
                          <InfoItem
                            label="Duration"
                            :value="`${application.duration_in_hours} hours`"
                          />
                          <InfoItem label="Credits" :value="application.credit" />
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
                      </InfoCard>
                    </div>

                    <div class="space-y-6">
                      <InfoCard icon="Users" title="Target Audience">
                        <InfoItem
                          label="Number of Participants"
                          :value="application.number_of_participants"
                        />
                        <hr class="my-4" />
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">Target Categories</h5>
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
                        <InfoItem
                          label="Last Updated"
                          :value="formatDateTime(application.status_last_updated)"
                        />
                        <InfoItem
                          label="Remarks"
                          :value="application.status_remarks"
                          :is-long-text="true"
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
                            v-if="application.application_status === 'SUBMITTED' && !showApprovalForm"
                            type="button"
                            class="w-full px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm flex items-center justify-center gap-2"
                            @click="showApprovalForm = true"
                          >
                            <CheckCircle class="h-5 w-5" />
                            Approve Application
                          </button>

                          <button
                            v-if="
                              application.application_status === 'SUBMITTED' && !showRejectionForm
                            "
                            type="button"
                            class="w-full px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center justify-center gap-2"
                            @click="showRejectionForm = true"
                          >
                            <X class="h-5 w-5" />
                            Reject Application
                          </button>

                          <button
                            v-if="application.application_status === 'APPROVED' && !showCreditEditForm"
                            type="button"
                            class="w-full px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center justify-center gap-2"
                            @click="showCreditEditForm = true"
                          >
                            <Pencil class="h-5 w-5" />
                            Edit Awarded Credits
                          </button>
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, nextTick, defineAsyncComponent } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
// NEW: Imported Pencil icon
import { CheckCircle, X, Circle, Link, FileText, Pencil } from 'lucide-vue-next'

// Lazy load helper components for better performance
const InfoCard = defineAsyncComponent(() => import('./InfoCard.vue'))
const InfoItem = defineAsyncComponent(() => import('./InfoItem.vue'))

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

// MODIFIED: Added 'save' for better practice
const emit = defineEmits(['close', 'approve', 'reject', 'save'])

const showApprovalForm = ref(false)
const showRejectionForm = ref(false)
const approvalMessage = ref('')
const rejectionMessage = ref('')
const rejectionError = ref('')
const approvalCredits = ref(0)
const reviewActionCard = ref(null) // Template ref for scrolling

// NEW: State for the credit editing form
const showCreditEditForm = ref(false)
const editableCredits = ref(0)

// MODIFIED: Watcher now resets and initializes state for the new form
watch(
  () => props.application,
  async (newApplication) => {
    if (newApplication) {
      // 1. Reset all form states when a new application is loaded
      showApprovalForm.value = false
      showRejectionForm.value = false
      showCreditEditForm.value = false // NEW: Reset edit form visibility
      approvalMessage.value = ''
      rejectionMessage.value = ''
      rejectionError.value = ''
      approvalCredits.value = newApplication.credit || 0
      editableCredits.value = newApplication.credit || 0 // NEW: Initialize editable credits

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

const approveApplication = () => {
  if (approvalCredits.value < 0) return
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
    return
  }
  emit('reject', {
    id: props.application.id,
    status_remarks: rejectionMessage.value,
  })
  emit('close')
}

// NEW: Method to handle saving credit changes
const saveCreditChanges = () => {
  if (editableCredits.value < 0) return
  emit('save', {
    id: props.application.id,
    credit: editableCredits.value,
  })
  emit('close')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
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
