<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
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
              class="w-full max-w-7xl transform rounded-2xl bg-gray-50 text-left align-middle shadow-xl transition-all flex flex-col"
            >
              <div v-if="!application" class="p-12 text-center">
                <p>Loading application details...</p>
              </div>

              <div v-else class="flex flex-col max-h-[90vh]">
                <div
                  :class="[
                    'px-6 py-4 border-b shrink-0',
                    {
                      'bg-yellow-50 border-yellow-200': overallStatus === 'Pending',
                      'bg-green-50 border-green-200': overallStatus === 'Approved',
                      'bg-red-50 border-red-200': overallStatus === 'Regretted',
                    },
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <DialogTitle as="h3" class="text-xl font-semibold text-gray-800">
                      Application Details {{ isEditing ? '(Editing)' : '' }}
                    </DialogTitle>
                    <div class="flex items-center space-x-4">
                      <span
                        :class="[
                          'px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                          statusColorClass,
                        ]"
                      >
                        <Circle class="h-3 w-3" />
                        <span>{{ overallStatus }}</span>
                      </span>
                      <button @click="closeModalHandler" class="text-gray-400 hover:text-gray-600">
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="p-6 bg-white overflow-y-auto">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-1 space-y-6">
                      <div class="bg-white rounded-lg border border-gray-200 p-5">
                        <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                          <User class="mr-2 h-5 w-5 text-gray-500" />Applicant Info
                        </h4>
                        <div class="text-center mb-4">
                          <h5 v-if="!isEditing" class="text-xl font-bold text-gray-900">
                            {{ application.full_name }}
                          </h5>
                          <input
                            v-else
                            type="text"
                            v-model="editableApplication.full_name"
                            class="w-full text-center"
                          />
                          <p class="text-sm text-gray-500">ID: #{{ application.id }}</p>
                        </div>
                      </div>
                      <div class="bg-white rounded-lg border border-gray-200 p-5">
                        <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                          <Building class="mr-2 h-5 w-5 text-gray-500" />Institution Info
                        </h4>
                        <div class="space-y-4">
                          <div>
                            <label class="text-sm font-medium text-gray-600 flex items-center mb-1"
                              ><Info class="mr-2 h-4 w-4" />Proposed Name</label
                            >
                            <p v-if="!isEditing" class="text-sm text-gray-800">
                              {{ application.dpr_name || 'N/A' }}
                            </p>
                            <input
                              v-else
                              type="text"
                              v-model="editableApplication.dpr_name"
                              class="w-full text-sm"
                            />
                          </div>
                          <div>
                            <label class="text-sm font-medium text-gray-600 flex items-center mb-1"
                              ><Landmark class="mr-2 h-4 w-4" />Land Area</label
                            >
                            <p v-if="!isEditing" class="text-sm text-gray-800">
                              {{ application.land_details || 'N/A' }}
                            </p>
                            <input
                              v-else
                              type="text"
                              v-model="editableApplication.land_details"
                              class="w-full text-sm"
                            />
                          </div>
                          <div>
                            <label class="text-sm font-medium text-gray-600 flex items-center mb-1"
                              ><Target class="mr-2 h-4 w-4" />Vision & Mission</label
                            >
                            <p v-if="!isEditing" class="text-sm text-gray-800 break-words">
                              {{ application.vision_mission_strategies || 'N/A' }}
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.vision_mission_strategies"
                              class="w-full text-sm"
                              rows="4"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="lg:col-span-2 space-y-6">
                      <div
                        v-for="section in detailSections"
                        :key="section.title"
                        class="bg-white rounded-lg border border-gray-200 p-5"
                      >
                        <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                          <component :is="section.icon" class="mr-2 h-5 w-5 text-gray-500" />{{
                            section.title
                          }}
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            v-for="item in section.items"
                            :key="item.field"
                            class="bg-gray-50 p-3 rounded-md"
                          >
                            <label class="text-sm font-medium text-gray-600 flex items-center mb-2">
                              <component :is="item.icon" class="mr-2 h-4 w-4 text-gray-400" />
                              {{ item.label }}
                            </label>
                            <p v-if="!isEditing" class="text-sm text-gray-800 break-words">
                              {{ application[item.field] || 'N/A' }}
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication[item.field]"
                              rows="3"
                              class="w-full text-sm"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div class="bg-white rounded-lg border border-gray-200 p-5">
                        <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                          <Paperclip class="mr-2 h-5 w-5 text-gray-500" />Attached Documents
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-gray-50 p-3 rounded-md">
                            <label class="text-sm font-medium text-gray-600 block mb-2"
                              >Do DPR Report</label
                            >
                            <div v-if="!isEditing">
                              <a
                                v-if="application.do_dpr_report"
                                :href="application.do_dpr_report"
                                target="_blank"
                                class="text-blue-600 hover:underline text-sm flex items-center"
                                ><FileText class="mr-1 h-4 w-4" />View Document</a
                              >
                              <p v-else class="text-sm text-gray-500">No document uploaded.</p>
                            </div>
                            <div v-else>
                              <input
                                type="file"
                                @change="(e) => handleFileChange(e, 'do_dpr_report')"
                                accept=".pdf"
                                class="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                              />
                              <p v-if="fileNames.do_dpr_report" class="text-xs text-gray-600 mt-2">
                                Selected: {{ fileNames.do_dpr_report }}
                              </p>
                              <p
                                v-else-if="application.do_dpr_report"
                                class="text-xs text-gray-600 mt-2"
                              >
                                Current file is preserved.
                              </p>
                            </div>
                          </div>
                          <div class="bg-gray-50 p-3 rounded-md">
                            <label class="text-sm font-medium text-gray-600 block mb-2"
                              >EOI Supporting Documents</label
                            >
                            <div v-if="!isEditing">
                              <a
                                v-if="application.institute_eoi_supporting_documents"
                                :href="application.institute_eoi_supporting_documents"
                                target="_blank"
                                class="text-blue-600 hover:underline text-sm flex items-center"
                                ><FileText class="mr-1 h-4 w-4" />View Document</a
                              >
                              <p v-else class="text-sm text-gray-500">No document uploaded.</p>
                            </div>
                            <div v-else>
                              <input
                                type="file"
                                @change="
                                  (e) => handleFileChange(e, 'institute_eoi_supporting_documents')
                                "
                                accept=".pdf"
                                class="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                              />
                              <p
                                v-if="fileNames.institute_eoi_supporting_documents"
                                class="text-xs text-gray-600 mt-2"
                              >
                                Selected: {{ fileNames.institute_eoi_supporting_documents }}
                              </p>
                              <p
                                v-else-if="application.institute_eoi_supporting_documents"
                                class="text-xs text-gray-600 mt-2"
                              >
                                Current file is preserved.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 shrink-0">
                  <div class="flex justify-between items-center">
                    <div class="text-sm text-red-600">{{ errorMessage || saveError }}</div>
                    <div class="flex items-center space-x-3">
                      <button
                        @click="closeModalHandler"
                        class="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-100"
                      >
                        Close
                      </button>
                      <template v-if="!isEditing">
                        <button
                          v-if="overallStatus === 'Pending'"
                          @click="startEditing"
                          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          v-if="overallStatus === 'Pending'"
                          @click="startConfirmation('approve')"
                          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          v-if="overallStatus === 'Pending'"
                          @click="startConfirmation('Regretted')"
                          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Regret
                        </button>
                      </template>
                      <template v-else>
                        <button
                          @click="cancelEditing"
                          class="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          @click="saveChanges"
                          :disabled="isSaving"
                          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {{ isSaving ? 'Saving...' : 'Save Changes' }}
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="isConfirmingAction"
                class="absolute inset-0 z-20 flex items-center justify-center bg-black/40"
              >
                <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Confirm {{ confirmingAction === 'approve' ? 'Approval' : 'Regret' }}
                  </h3>
                  <label
                    for="confirmationMessage"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Message:</label
                  >
                  <textarea
                    id="confirmationMessage"
                    v-model="confirmationMessage"
                    rows="3"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md mb-4"
                  ></textarea>
                  <div class="flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="cancelConfirmation"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="confirmAction"
                      class="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm"
                      :class="{
                        'bg-green-600 hover:bg-green-700': confirmingAction === 'approve',
                        'bg-red-600 hover:bg-red-700': confirmingAction === 'Regretted',
                      }"
                    >
                      Confirm {{ confirmingAction === 'approve' ? 'Approval' : 'Regret' }}
                    </button>
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
  FileText,
  X,
  Circle,
  Paperclip,
  Calendar,
  Globe,
  Library,
  Hospital,
  ShieldCheck,
  Users,
  Landmark,
  Briefcase,
  FileCheck,
  Building,
  Target,
  Wallet,
  GraduationCap,
  LifeBuoy,
  Shield,
  Speaker,
  Info,
} from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import apiService from '@/services/services' // Assuming this path is correct
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  application: { type: Object, default: () => null },
})

const emit = defineEmits(['close', 'application-updated', 'approve', 'regretted'])

const isEditing = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const errorMessage = ref('')
const editableApplication = ref(null)

const fileNames = ref({
  do_dpr_report: '',
  institute_eoi_supporting_documents: '',
})
const selectedFiles = ref({
  do_dpr_report: null,
  institute_eoi_supporting_documents: null,
})

const isConfirmingAction = ref(false)
const confirmingAction = ref('')
const confirmationMessage = ref('')

const overallStatus = computed(() => props.application?.do_dpr_review_decision || 'Pending')

const statusColorClass = computed(() => ({
  'bg-yellow-100 text-yellow-800': overallStatus.value === 'Pending',
  'bg-green-100 text-green-800': overallStatus.value === 'Approved',
  'bg-red-100 text-red-800': overallStatus.value === 'Regretted',
}))

const detailSections = computed(() => [
  {
    title: 'Core Planning',
    icon: FileCheck,
    items: [
      { label: 'Project Scheduling', field: 'project_scheduling', icon: Calendar },
      { label: 'Gross National Happiness', field: 'gross_national_happiness', icon: Globe },
      { label: 'Conceptual Master Plan', field: 'conceptual_master_plan', icon: Landmark },
      { label: 'Business Plan', field: 'business_plan', icon: Briefcase },
    ],
  },
  {
    title: 'Academics & Research',
    icon: Library,
    items: [
      { label: 'Academic Plan', field: 'academic_plan', icon: GraduationCap },
      { label: 'Affiliation Details', field: 'affiliation_details', icon: Users },
      { label: 'Teaching Hospital', field: 'teaching_hospital_details', icon: Hospital },
      { label: 'Research Policy', field: 'research_policy', icon: FileText },
    ],
  },
  {
    title: 'Governance & Operations',
    icon: Landmark,
    items: [
      { label: 'Human Resources', field: 'human_resource', icon: Users },
      { label: 'Quality Assurance', field: 'quality_assurance', icon: ShieldCheck },
      { label: 'Governance Structure', field: 'governance_structure', icon: Building },
      { label: 'Project Cost Analysis', field: 'project_cost_analysis', icon: Wallet },
      { label: 'Service Conditions', field: 'service_conditions', icon: Briefcase },
    ],
  },
  {
    title: 'Student & Public Services',
    icon: LifeBuoy,
    items: [
      {
        label: 'Facilities & Student Services',
        field: 'facilities_student_services',
        icon: LifeBuoy,
      },
      { label: 'Admission & Scholarship Policy', field: 'admission_policy', icon: GraduationCap },
      { label: 'Safety & Security', field: 'safety_security', icon: Shield },
      { label: 'Public Information System', field: 'public_information_system', icon: Speaker },
      { label: 'Other Details', field: 'other_details_dpr', icon: Info },
    ],
  },
])

const handleFileChange = (event, field) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      event.target.value = '' // Clear the input
      return
    }
    selectedFiles.value[field] = file
    fileNames.value[field] = file.name
  }
}

const closeModalHandler = () => {
  if (isEditing.value) {
    cancelEditing()
  }
  if (isConfirmingAction.value) {
    cancelConfirmation()
  }
  emit('close')
}

const startEditing = () => {
  editableApplication.value = JSON.parse(JSON.stringify(props.application))
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editableApplication.value = null
  saveError.value = ''
  selectedFiles.value = { do_dpr_report: null, institute_eoi_supporting_documents: null }
  fileNames.value = { do_dpr_report: '', institute_eoi_supporting_documents: '' }
}

const saveChanges = async () => {
  isSaving.value = true
  saveError.value = ''

  const formData = new FormData()

  // Combine all editable fields into one list
  const allFields = [
    'full_name',
    'dpr_name',
    'land_details',
    'vision_mission_strategies',
    ...detailSections.value.flatMap((sec) => sec.items.map((item) => item.field)),
  ]

  // Append all fields from editableApplication to formData
  allFields.forEach((field) => {
    if (
      editableApplication.value[field] !== undefined &&
      editableApplication.value[field] !== null
    ) {
      formData.append(field, editableApplication.value[field])
    }
  })

  // Append files if they've been selected
  if (selectedFiles.value.do_dpr_report) {
    formData.append('do_dpr_report', selectedFiles.value.do_dpr_report)
  }
  if (selectedFiles.value.institute_eoi_supporting_documents) {
    formData.append(
      'institute_eoi_supporting_documents',
      selectedFiles.value.institute_eoi_supporting_documents
    )
  }

  try {
    const response = await apiService.patchMhpcInstitute(props.application.id, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    toast.success('Application Updated Successfully!')
    emit('application-updated', response.data)
    cancelEditing()
  } catch (error) {
    const errorMessageText = error.response?.data?.message || error.message || 'Unknown error'
    saveError.value = `Update failed: ${errorMessageText}`
    toast.error(saveError.value)
  } finally {
    isSaving.value = false
  }
}

const startConfirmation = (action) => {
  isConfirmingAction.value = true
  confirmingAction.value = action
}

const cancelConfirmation = () => {
  isConfirmingAction.value = false
  confirmingAction.value = ''
  confirmationMessage.value = ''
}

const confirmAction = async () => {
  try {
    const updateData = {
      do_dpr_review_decision: confirmingAction.value === 'approve' ? 'Approved' : 'Regretted',
      do_dpr_reason_if_rejected:
        confirmingAction.value === 'Regretted' ? confirmationMessage.value : '',
    }
    const response = await apiService.patchMhpcInstitute(props.application.id, updateData)

    toast.success(`Application ${updateData.do_dpr_review_decision} Successfully!`)
    emit('application-updated', response.data)
    closeModalHandler()
  } catch (error) {
    const errorMessageText = error.response?.data?.message || error.message || 'Unknown error'
    errorMessage.value = `Failed to ${confirmingAction.value} application: ${errorMessageText}`
    toast.error(errorMessage.value)
  } finally {
    cancelConfirmation()
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      // Reset all states when modal closes
      cancelEditing()
      cancelConfirmation()
      errorMessage.value = ''
      saveError.value = ''
    }
  }
)

watch(
  () => props.application,
  () => {
    if (isEditing.value) {
      // If the base application prop changes while editing, cancel the edit to avoid data conflicts
      cancelEditing()
    }
  },
  { deep: true }
)
</script>

<style scoped>
/* Scoped styles from your original component */
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

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='url'],
input[type='date'],
input[type='number'],
select,
textarea {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
         bg-white disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.bg-gray-50 input,
.bg-gray-50 select,
.bg-gray-50 textarea {
  @apply px-2 py-1;
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
