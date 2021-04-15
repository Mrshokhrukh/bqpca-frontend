<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
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
                <!-- Enhanced Status Banner -->
                <div
                  :class="[
                    'px-8 py-6 border-b relative overflow-hidden',
                    {
                      'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
                      'bg-green-50 border-green-100': overallStatus === 'Approved',
                      'bg-red-50 border-red-100': overallStatus === 'Regretted',
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
                          EOI Application Details {{ isEditing ? '(Editing)' : '' }}
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">
                          Review and manage EOI application information
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span
                        :class="[
                          'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                          {
                            'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
                            'bg-green-100 text-green-800': overallStatus === 'Approved',
                            'bg-red-100 text-red-800': overallStatus === 'Regretted',
                          },
                        ]"
                      >
                        <Circle
                          class="h-4 w-4"
                          :class="{
                            'text-yellow-500': overallStatus === 'Pending',
                            'text-green-500': overallStatus === 'Approved',
                            'text-red-500': overallStatus === 'Regretted',
                          }"
                        />
                        <span>{{ overallStatus }}</span>
                      </span>
                      <button
                        type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="closeModal"
                      >
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
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Institute Information</span>
                          </h4>
                          <div class="flex flex-col items-start space-y-4">
                            <!-- Name -->
                            <div>
                              <h5
                                v-if="!isEditing"
                                class="text-xl font-semibold text-gray-900"
                              >
                                {{ application.name_of_institution }}
                              </h5>
                              <input
                                v-else
                                type="text"
                                v-model="editableApplication.name_of_institution"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                                placeholder="Institute Name"
                              />
                            </div>
                            <!-- Address -->
                            <div class="w-full grid grid-cols-1 gap-4 mt-4">
                              <div
                                class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg"
                              >
                                <UserCircle class="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span v-if="!isEditing" class="text-sm text-gray-600">{{
                                  application.address
                                }}</span>
                                <input
                                  v-else
                                  type="text"
                                  v-model="editableApplication.address"
                                  class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Address"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Contact Information Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <Contact class="h-5 w-5 text-gray-500" />
                            <span>Contact Information</span>
                          </h4>
                          <div class="space-y-4">
                            <!-- Email -->
                            <div
                              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <Mail class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span v-if="!isEditing" class="text-sm text-gray-600">{{
                                application.email_address
                              }}</span>
                              <input
                                v-else
                                type="email"
                                v-model="editableApplication.email_address"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Email Address"
                              />
                            </div>
                            <!-- Phone -->
                            <div
                              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <Phone class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span v-if="!isEditing" class="text-sm text-gray-600">{{
                                application.contact_no
                              }}</span>
                              <input
                                v-else
                                type="tel"
                                v-model="editableApplication.contact_no"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Contact Number"
                              />
                            </div>
                            <!-- Location -->
                            <div
                              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <MapPin class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <template v-if="!isEditing">
                                <span class="text-sm text-gray-600">
                                  {{ application.village }}, {{ application.dzongkhag }}
                                </span>
                              </template>
                              <template v-else>
                                <div class="flex space-x-2 w-full">
                                  <input
                                    type="text"
                                    v-model="editableApplication.village"
                                    class="w-1/2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Village"
                                  />
                                  <input
                                    type="text"
                                    v-model="editableApplication.dzongkhag"
                                    class="w-1/2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Dzongkhag"
                                  />
                                </div>
                              </template>
                            </div>
                            <!-- Website -->
                            <div
                              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <UserCircle class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span v-if="!isEditing" class="text-sm text-gray-600">{{
                                application.website
                              }}</span>
                              <input
                                v-else
                                type="url"
                                v-model="editableApplication.website"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Website URL"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- Application Details Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <FileText class="h-5 w-5 text-gray-500" />
                            <span>Application Details</span>
                          </h4>
                          <div class="grid grid-cols-2 gap-6">
                            <!-- Application ID -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Application ID</p>
                              <p
                                class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                              >
                                <FileCheck class="h-4 w-4 text-gray-400" />
                                <span>{{ application.CID }}</span>
                              </p>
                            </div>
                            <!-- Program Type -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Program Type</p>
                              <template v-if="!isEditing">
                                <p
                                  class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                                >
                                  <Hash class="h-4 w-4 text-gray-400" />
                                  <span>{{ application.type_of_programme }}</span>
                                </p>
                              </template>
                              <template v-else>
                                <input
                                  type="text"
                                  v-model="editableApplication.type_of_programme"
                                  class="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Program Type"
                                />
                              </template>
                            </div>
                            <!-- Date Submitted -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Date Submitted</p>
                              <p
                                class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                              >
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.created_at) }}</span>
                              </p>
                            </div>
                            <!-- Proposed Date -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Proposed Date</p>
                              <template v-if="!isEditing">
                                <p
                                  class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                                >
                                  <Clock class="h-4 w-4 text-gray-400" />
                                  <span>{{
                                    formatDate(application.commencement_date)
                                  }}</span>
                                </p>
                              </template>
                              <template v-else>
                                <input
                                  type="date"
                                  v-model="editableCommencementDate"
                                  class="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                              </template>
                            </div>
                            <!-- Course Title -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Course Title</p>
                              <template v-if="!isEditing">
                                <p class="text-sm text-gray-900 mt-2">
                                  <span>{{ application.title_of_course }}</span>
                                </p>
                              </template>
                              <template v-else>
                                <input
                                  type="text"
                                  v-model="editableApplication.title_of_course"
                                  class="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Course Title"
                                />
                              </template>
                            </div>
                            <!-- Duration -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Duration</p>
                              <template v-if="!isEditing">
                                <p class="text-sm text-gray-900 mt-2">
                                  <span>{{ application.course_duration }}</span>
                                </p>
                              </template>
                              <template v-else>
                                <input
                                  type="text"
                                  v-model="editableApplication.course_duration"
                                  class="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Course Duration"
                                />
                              </template>
                            </div>
                            <!-- Supporting Documents -->
                            <div class="p-4 bg-gray-50 rounded-lg col-span-2">
                              <p class="text-sm font-medium text-gray-500">
                                Supporting Documents
                              </p>
                              <template v-if="!isEditing">
                                <p class="text-sm text-gray-900 mt-2">
                                  <a
                                    v-if="application.supporting_documents"
                                    :href="application.supporting_documents"
                                    target="_blank"
                                    class="text-blue-600 hover:underline flex items-center space-x-2"
                                  >
                                    <FileText class="h-4 w-4" />
                                    <span>View Document</span>
                                  </a>
                                  <span v-else class="text-gray-500"
                                    >No document uploaded</span
                                  >
                                </p>
                              </template>
                              <template v-else>
                                <div class="mt-2">
                                  <input
                                    type="file"
                                    ref="fileInput"
                                    @change="handleFileChange"
                                    accept=".pdf"
                                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                  <p v-if="fileName" class="text-sm text-gray-600 mt-2">
                                    Selected: {{ fileName }}
                                  </p>
                                  <p
                                    v-else-if="application.supporting_documents"
                                    class="text-sm text-gray-600 mt-2"
                                  >
                                    Current:
                                    <a
                                      :href="application.supporting_documents"
                                      target="_blank"
                                      class="text-blue-600 hover:underline"
                                      >Existing Document</a
                                    >
                                  </p>
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Footer with Edit/Save/Cancel -->
                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div
                      v-if="errorMessage || saveError"
                      class="text-sm text-red-600 flex items-center space-x-2"
                    >
                      <CircleAlert class="h-4 w-4" />
                      <span>{{ errorMessage || saveError }}</span>
                    </div>
                    <div v-else></div>

                    <div class="flex items-center space-x-4">
                      <!-- Close Button -->
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="closeModal"
                      >
                        <X class="h-4 w-4" />
                        <span>Close</span>
                      </button>

                      <!-- View Mode Buttons -->
                      <template v-if="!isEditing">
                        <button
                          v-if="overallStatus === 'Pending'"
                          type="button"
                          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                          @click="startEditing"
                          :disabled="isSaving"
                        >
                          <Pencil class="h-4 w-4" />
                          <span>Edit</span>
                        </button>

                        <button
                          v-if="overallStatus === 'Pending'"
                          type="button"
                          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                          @click="rejectApplication"
                          :disabled="isSaving"
                        >
                          <span>Regret Application</span>
                        </button>

                        <button
                          v-if="overallStatus === 'Pending'"
                          type="button"
                          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                          @click="approveApplication"
                          :disabled="isSaving"
                        >
                          <span>Approve Application</span>
                        </button>
                      </template>

                      <!-- Edit Mode Buttons -->
                      <template v-if="isEditing">
                        <button
                          type="button"
                          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                          @click="cancelEditing"
                          :disabled="isSaving"
                        >
                          <Ban class="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          type="button"
                          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                          @click="saveChanges"
                          :disabled="isSaving"
                        >
                          <Save class="h-4 w-4" />
                          <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
                        </button>
                      </template>
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
  Clock,
  CircleAlert,
  Circle,
  X,
  Pencil,
  Save,
  Ban,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
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

// Handle file input change
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      selectedFile.value = null
      fileName.value = ''
      event.target.value = ''
      return
    }
    selectedFile.value = file
    fileName.value = file.name
  } else {
    selectedFile.value = null
    fileName.value = ''
  }
}

// Format date for input
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const offset = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.getTime() - offset)
    return adjustedDate.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error formatting date for input:', error)
    return ''
  }
}

const editableCommencementDate = computed({
  get() {
    return editableApplication.value
      ? formatDateForInput(editableApplication.value.commencement_date)
      : ''
  },
  set(newValue) {
    if (editableApplication.value) {
      editableApplication.value.commencement_date = newValue
    }
  },
})

const closeModal = () => {
  if (isEditing.value) {
    cancelEditing()
  }
  emit('close')
}

const closeModalHandler = () => {
  if (isEditing.value) {
    cancelEditing()
  }
  emit('close')
}

const startEditing = () => {
  errorMessage.value = ''
  saveError.value = ''
  editableApplication.value = JSON.parse(JSON.stringify(props.application))
  delete editableApplication.value.supporting_documents
  selectedFile.value = null
  fileName.value = ''
  isEditing.value = true
}

const cancelEditing = () => {
  editableApplication.value = null
  selectedFile.value = null
  fileName.value = ''
  isEditing.value = false
  saveError.value = ''
}

const saveChanges = async () => {
  if (!editableApplication.value) return

  isSaving.value = true
  saveError.value = ''
  errorMessage.value = ''

  try {
    const formData = new FormData()
    const fields = [
      'name_of_institution',
      'address',
      'email_address',
      'contact_no',
      'village',
      'dzongkhag',
      'website',
      'type_of_programme',
      'title_of_course',
      'course_duration',
      'commencement_date',
    ]

    fields.forEach((field) => {
      if (editableApplication.value[field] !== undefined) {
        formData.append(field, editableApplication.value[field])
      }
    })

    if (selectedFile.value) {
      formData.append('supporting_documents', selectedFile.value)
    }

    const response = await apiService.patchMhpcInstitute(props.application.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response && response.status === 200 && response.data) {
      toast.success('Application Updated Successfully!')
      emit('application-updated', response.data)
      isEditing.value = false
      editableApplication.value = null
      selectedFile.value = null
      fileName.value = ''
    } else {
      saveError.value = 'Failed to save changes. Unexpected response.'
    }
  } catch (error) {
    console.error('Error saving application changes:', error)
    saveError.value = `Failed to save changes: ${
      error.response?.data?.message || error.message || 'Unknown error'
    }`
    toast.error(`Update failed: ${saveError.value}`)
  } finally {
    isSaving.value = false
  }
}

const approveApplication = async () => {
  if (isEditing.value) {
    toast.warning('Please save or cancel edits before approving.')
    return
  }

  const notes = prompt('Enter approval notes:')
  if (!notes) return

  errorMessage.value = ''
  try {
    const response = await apiService.patchMhpcInstitute(props.application.id, {
      review_decision: 'Approved',
      approvalNotes: notes,
    })

    if (response && response.status === 200 && response.data) {
      emit('application-updated', response.data)
      toast.success('Application Approved!')
      closeModal()
    } else {
      errorMessage.value = 'Failed to approve application.'
      toast.error(errorMessage.value)
    }
  } catch (error) {
    console.error('Error approving application:', error)
    errorMessage.value = `Failed to approve application: ${
      error.response?.data?.message || error.message || 'Unknown error'
    }`
    toast.error(errorMessage.value)
  }
}

const rejectApplication = async () => {
  if (isEditing.value) {
    toast.warning('Please save or cancel edits before regretting.')
    return
  }

  const reason = prompt('Enter rejection reason:')
  if (!reason) return

  errorMessage.value = ''
  try {
    const response = await apiService.patchMhpcInstitute(props.application.id, {
      review_decision: 'Regretted',
      reason_if_rejected: reason,
    })

    if (response && response.status === 200 && response.data) {
      emit('application-updated', response.data)
      toast.success('Application Regretted!')
      closeModal()
    } else {
      errorMessage.value = 'Failed to regret application.'
      toast.error(errorMessage.value)
    }
  } catch (error) {
    console.error('Error regretting application:', error)
    errorMessage.value = `Failed to regret application: ${
      error.response?.data?.message || error.message || 'Unknown error'
    }`
    toast.error(errorMessage.value)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

const overallStatus = computed(() => {
  return props.application.review_decision || 'Pending'
})

watch(() => props.isOpen, (newVal) => {
  if (!newVal && isEditing.value) {
    cancelEditing()
  }
})
watch(
  () => props.application,
  () => {
    if (isEditing.value) {
      cancelEditing()
    }
  },
  { deep: true }
)
</script>

<style scoped>
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="url"],
input[type="date"],
textarea {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
         bg-white disabled:bg-gray-100 disabled:cursor-not-allowed;
}
.bg-gray-50 input {
  @apply px-2 py-1;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
