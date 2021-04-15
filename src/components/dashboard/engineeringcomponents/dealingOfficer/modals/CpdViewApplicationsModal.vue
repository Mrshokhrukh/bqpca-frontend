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
              class="w-full max-w-8xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application"
            >
              <div class="relative">
                <!-- Enhanced Status Banner -->
                <div
                  :class="[
                    'px-8 py-6 border-b relative overflow-hidden',
                    {
                      'bg-yellow-50 border-yellow-100': application.status === 'Pending',
                      'bg-green-50 border-green-100': application.status === 'Approved',
                      'bg-red-50 border-red-100': application.status === 'Rejected',
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
                          Review and manage CPD application information
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span
                        :class="[
                          'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                          {
                            'bg-yellow-100 text-yellow-800': application.status === 'Pending',
                            'bg-green-100 text-green-800': application.status === 'Approved',
                            'bg-red-100 text-red-800': application.status === 'Rejected',
                          },
                        ]"
                      >
                        <Circle
                          class="h-4 w-4"
                          :class="{
                            'text-yellow-500': application.status === 'Pending',
                            'text-green-500': application.status === 'Approved',
                            'text-red-500': application.status === 'Rejected',
                          }"
                        />
                        <span>{{ application.status || 'Pending' }}</span>
                      </span>
                      <button
                        type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="$emit('close')"
                      >
                        <span class="sr-only">Close</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <!-- Decorative pattern -->
                  <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
                    <div class="transform rotate-45">
                      <FileText class="h-32 w-32" />
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="px-8 py-6 bg-white max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column -->
                    <div class="lg:col-span-1 space-y-6">
                      <!-- Personal Information Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Personal Information</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Badge class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">Registration Number</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.registrationNumber || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Hash class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">CID/Identity Number</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.cidNumber || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <User class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">Full Name</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.fullName || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <UserCircle class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">Gender</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.gender || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Attachment Preview Card (if applicable) -->
                      <div
                        v-if="application.attachment"
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <Paperclip class="h-5 w-5 text-gray-500" />
                            <span>Attachment</span>
                          </h4>
                          <div
                            class="p-4 bg-gray-50 rounded-lg flex flex-col items-center space-y-3"
                          >
                            <FileText class="h-12 w-12 text-gray-400" />
                            <p class="text-sm text-gray-900 text-center">
                              {{ application.attachment.name || 'Document' }}
                            </p>
                            <a
                              v-if="application.attachment.url"
                              :href="application.attachment.url"
                              target="_blank"
                              class="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- CPD Details Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <BookOpen class="h-5 w-5 text-gray-500" />
                            <span>CPD Details</span>
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Title of CPD</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <FileText class="h-4 w-4 text-gray-400" />
                                <span>{{ application.cpdTitle || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">
                                Relevance to Profession
                              </p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Link class="h-4 w-4 text-gray-400" />
                                <span>{{ application.relevance || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">
                                Participation Category
                              </p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Users class="h-4 w-4 text-gray-400" />
                                <span>{{
                                  application.participationCategory || 'Not provided'
                                }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">
                                Participant Sub-category
                              </p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <UserCheck class="h-4 w-4 text-gray-400" />
                                <span>{{
                                  application.participantSubCategory || 'Not provided'
                                }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Type of CPD Activity</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Activity class="h-4 w-4 text-gray-400" />
                                <span>{{ application.activityType || 'Not provided' }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Review Details Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <ClipboardCheck class="h-5 w-5 text-gray-500" />
                            <span>Review Details</span>
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">CPD Credits</p>
                              <div v-if="isEditing" class="mt-2">
                                <input
                                  v-model.number="editedApplication.cpdCredits"
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <p
                                v-else
                                class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                              >
                                <Award class="h-4 w-4 text-gray-400" />
                                <span>{{ application.cpdCredits || '0' }}</span>
                              </p>
                            </div>
                            <div v-if="application.remarks" class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Remarks</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <MessageSquare class="h-4 w-4 text-gray-400" />
                                <span>{{ application.remarks }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Review Action Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <CheckCircle class="h-5 w-5 text-gray-500" />
                            <span>Review Action</span>
                          </h4>

                          <!-- Approval Form -->
                          <div
                            v-if="showApprovalForm"
                            class="p-6 bg-green-50 rounded-xl border border-green-200 mb-4 transition-all"
                          >
                            <h5
                              class="text-base font-medium text-green-800 mb-4 flex items-center space-x-2"
                            >
                              <CheckCircle class="h-4 w-4 text-green-600" />
                              <span>Approve Application</span>
                            </h5>
                            <div class="space-y-4">
                              <div>
                                <label class="block text-sm font-medium text-gray-700"
                                  >Assigned CPD Credits <span class="text-red-600">*</span></label
                                >
                                <input
                                  v-model.number="approvalCredits"
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  class="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>
                              <div>
                                <label class="block text-sm font-medium text-gray-700"
                                  >Approval Notes</label
                                >
                                <textarea
                                  v-model="approvalMessage"
                                  rows="3"
                                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder="Enter any notes for approval..."
                                ></textarea>
                              </div>
                              <div class="flex justify-end space-x-3">
                                <button
                                  @click="showApprovalForm = false"
                                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  @click="approveApplication"
                                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                  Confirm Approval
                                </button>
                              </div>
                            </div>
                          </div>

                          <!-- Rejection Form -->
                          <div
                            v-if="showRejectionForm"
                            class="p-6 bg-red-50 rounded-xl border border-red-200 mb-4 transition-all"
                          >
                            <h5
                              class="text-base font-medium text-red-800 mb-4 flex items-center space-x-2"
                            >
                              <XCircle class="h-4 w-4 text-red-600" />
                              <span>Regret Application</span>
                            </h5>
                            <div class="space-y-4">
                              <div>
                                <label class="block text-sm font-medium text-gray-700"
                                  >Rejection Reason <span class="text-red-600">*</span></label
                                >
                                <textarea
                                  v-model="rejectionMessage"
                                  rows="3"
                                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                  placeholder="Please provide a reason for rejection..."
                                ></textarea>
                                <p
                                  v-if="rejectionError"
                                  class="mt-1 text-sm text-red-600 flex items-center"
                                >
                                  <AlertCircle class="h-3 w-3 mr-1" />
                                  {{ rejectionError }}
                                </p>
                              </div>
                              <div class="flex justify-end space-x-3">
                                <button
                                  @click="
                                    showRejectionForm = false
                                    rejectionError = ''
                                  "
                                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  @click="rejectApplication"
                                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                  Confirm Rejection
                                </button>
                              </div>
                            </div>
                          </div>

                          <!-- Action Buttons -->
                          <div
                            v-if="!showApprovalForm && !showRejectionForm && !isEditing"
                            class="flex items-center space-x-4"
                          >
                            <button
                              @click="
                                showApprovalForm = true
                                showRejectionForm = false
                              "
                              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
                            >
                              <CheckCircle class="h-4 w-4" />
                              <span>Approve Application</span>
                            </button>
                            <button
                              @click="
                                showRejectionForm = true
                                showApprovalForm = false
                              "
                              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center space-x-2"
                            >
                              <XCircle class="h-4 w-4" />
                              <span>Regret Application</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Footer -->
                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                      <button
                        @click="startEditing"
                        v-if="!isEditing"
                        class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                      >
                        <Pencil class="h-4 w-4" />
                        <span>Edit Credits</span>
                      </button>
                    </div>
                    <div class="flex items-center space-x-4">
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                        @click="$emit('close')"
                      >
                        <X class="h-4 w-4" />
                        <span>Close</span>
                      </button>

                      <button
                        v-if="isEditing"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                        @click="saveChanges"
                      >
                        <Check class="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
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
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Activity,
  AlertCircle,
  Award,
  Badge,
  BookOpen,
  // Calendar,
  Check,
  CheckCircle,
  Circle,
  ClipboardCheck,
  // FileCheck,
  FileText,
  Hash,
  Link,
  MessageSquare,
  Paperclip,
  Pencil,
  User,
  UserCheck,
  UserCircle,
  Users,
  X,
  XCircle,
} from 'lucide-vue-next'

const props = defineProps({
  application: {
    type: Object,
    required: true,
    default: () => ({
      registrationNumber: '',
      cidNumber: '',
      fullName: '',
      gender: '',
      cpdTitle: '',
      relevance: '',
      participationCategory: '',
      participantSubCategory: '',
      activityType: '',
      attachment: null,
      cpdCredits: 0,
      status: '',
      reviewStatus: '',
      remarks: '',
    }),
  },
})

const emit = defineEmits(['close', 'save', 'approve', 'reject'])

const isEditing = ref(false)
const editedApplication = ref({ ...props.application })
const showApprovalForm = ref(false)
const showRejectionForm = ref(false)
const approvalMessage = ref('')
const rejectionMessage = ref('')
const rejectionError = ref('')
const approvalCredits = ref(props.application?.cpdCredits || 0)

watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      editedApplication.value = { ...newApplication }
      approvalCredits.value = newApplication.cpdCredits || 0
    }
  },
)

const startEditing = () => {
  isEditing.value = true
  showApprovalForm.value = false
  showRejectionForm.value = false
}

const saveChanges = () => {
  emit('save', {
    ...editedApplication.value,
    id: props.application.id,
  })
  isEditing.value = false
}

const approveApplication = () => {
  if (approvalCredits.value < 0) {
    approvalCredits.value = 0
  }

  emit('approve', {
    id: props.application.id,
    cpdCredits: approvalCredits.value,
    remarks: approvalMessage.value || 'Application approved',
  })
  showApprovalForm.value = false
  approvalMessage.value = ''
  emit('close')
}

const rejectApplication = () => {
  if (!rejectionMessage.value.trim()) {
    rejectionError.value = 'Please provide a reason for rejection'
    return
  }

  emit('reject', {
    id: props.application.id,
    remarks: rejectionMessage.value,
  })
  showRejectionForm.value = false
  rejectionMessage.value = ''
  rejectionError.value = ''
  emit('close')
}
</script>

<style scoped>
/* Enhanced scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced card hover effects */
.rounded-xl {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status indicator animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
