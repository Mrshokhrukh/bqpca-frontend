<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="showModal"
      @click="handleBackdropClick"
      class="fixed z-50 inset-0 overflow-y-auto backdrop-blur-md bg-gray-900/75 flex items-start justify-center sm:py-12"
    >
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl m-4 max-h-[90vh] flex flex-col border border-gray-200/75"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 sm:p-3 rounded-xl shadow-sm" :class="headerColorClass">
              <component
                :is="modalIcons[modalType]"
                class="w-5 h-5 sm:w-6 sm:h-6"
                :class="headerIconClass"
              />
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800">{{ modalTitle }}</h3>
              <p v-if="modalDescription" class="text-xs sm:text-sm text-gray-500 mt-1">
                {{ modalDescription }}
              </p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="rounded-full p-2 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 group"
          >
            <XIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 sm:space-y-8">
          <!-- View or Edit Mode -->
          <div
            v-if="modalType === 'view' || modalType === 'viewCertificate' || modalType === 'edit'"
            class="space-y-6 sm:space-y-8"
          >
            <!-- QEC Number Display -->
            <div
              v-if="editableApplication.status === 'approved' && editableApplication.qec_number"
              class="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 sm:p-8 shadow-lg border border-green-200/50"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div class="p-3 bg-green-100 rounded-xl shadow-sm">
                  <HashIcon class="w-6 h-6 text-green-600" />
                </div>
                <h4 class="text-md sm:text-lg font-semibold text-green-800">QEC Number</h4>
              </div>
              <div
                class="bg-white/80 p-4 sm:p-6 rounded-xl border border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-3 sm:gap-4"
              >
                <span class="text-2xl sm:text-3xl font-bold text-green-700 tracking-wider">{{
                  editableApplication.qec_number
                }}</span>
                <div
                  class="flex items-center gap-2 text-green-700 bg-green-100 py-1.5 px-3.5 rounded-full text-sm"
                >
                  <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="font-medium">Verified</span>
                </div>
              </div>
            </div>

            <!-- Personal & Address Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <!-- Personal Information -->
              <div
                class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
              >
                <div class="flex items-center gap-3 sm:gap-4 mb-5">
                  <div class="p-2.5 sm:p-3 bg-blue-100/70 rounded-xl shadow-sm">
                    <UserIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 class="text-md sm:text-lg font-semibold text-gray-800">
                    Personal Information
                  </h4>
                </div>
                <div class="space-y-4">
                  <FormInputGroup
                    label="Applicant's Name"
                    v-model="editableApplication.applicants_name"
                    :is-editing="isEditing"
                    icon="User"
                  />
                  <FormInputGroup
                    label="CID Number"
                    v-model="editableApplication.cid_no"
                    :is-editing="isEditing"
                    icon="Hash"
                  />
                  <FormInputGroup
                    label="Date of Birth"
                    v-model="editableApplication.date_of_birth"
                    :is-editing="isEditing"
                    type="date"
                    icon="Calendar"
                  />
                  <FormSelectGroup
                    label="Gender"
                    v-model="editableApplication.gender"
                    :is-editing="isEditing"
                    :options="genders"
                  />
                  <FormInputGroup
                    label="Contact Number"
                    v-model="editableApplication.contact_no"
                    :is-editing="isEditing"
                    icon="Phone"
                  />
                  <FormInputGroup
                    label="Email Address"
                    v-model="editableApplication.email_address"
                    :is-editing="isEditing"
                    icon="Mail"
                  />
                </div>
              </div>

              <!-- Address Details & Passport Photo -->
              <div class="space-y-6 sm:space-y-8">
                <!-- Passport Photo -->
                <div
                  v-if="editableApplication.passport_size_photo"
                  class="bg-slate-50 rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
                >
                  <div
                    class="relative aspect-[3/4] max-h-[320px] w-full flex items-center justify-center bg-gray-100"
                  >
                    <img
                      :src="editableApplication.passport_size_photo"
                      alt="Passport Photo"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute top-3 right-3 sm:top-4 sm:right-4 bg-blue-100/80 backdrop-blur-sm rounded-full p-2.5 sm:p-3 shadow-md"
                    >
                      <CameraIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Education Details -->
            <div
              class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
            >
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="p-2.5 sm:p-3 bg-purple-100/70 rounded-xl shadow-sm">
                    <GraduationCapIcon class="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 class="text-md sm:text-lg font-semibold text-gray-800">Education Details</h4>
                </div>
              </div>
              <div class="space-y-4">
                <FormInputGroup
                  label="Course Title"
                  v-model="editableApplication.course_title"
                  :is-editing="isEditing"
                  icon="GraduationCap"
                />
                <FormInputGroup
                  label="Course Duration (years)"
                  v-model="editableApplication.duration_of_course"
                  :is-editing="isEditing"
                  type="number"
                  icon="Timer"
                />
                <FormInputGroup
                  label="Institute Name"
                  v-model="editableApplication.name_of_institute"
                  :is-editing="isEditing"
                  icon="School"
                />
                <FormInputGroup
                  label="University Name"
                  v-model="editableApplication.name_of_university"
                  :is-editing="isEditing"
                  icon="School"
                />
                <FormInputGroup
                  label="Location (Institute)"
                  v-model="editableApplication.location"
                  :is-editing="isEditing"
                  icon="MapPin"
                />
                <FormInputGroup
                  label="Country (Institute)"
                  v-model="editableApplication.country"
                  :is-editing="isEditing"
                  icon="MapPin"
                />

                <FormInputGroup
                  label="Student ID No."
                  v-model="editableApplication.student_id_no"
                  :is-editing="isEditing"
                  icon="Hash"
                />
                <FormInputGroup
                  label="Year of Completion"
                  v-model="editableApplication.year_of_completion"
                  :is-editing="isEditing"
                  icon="Calendar"
                />
                <FormInputGroup
                  label="Institute Website"
                  v-model="editableApplication.website"
                  :is-editing="isEditing"
                  icon="Globe"
                />
                <FormSelectGroup
                  label="Type of Course"
                  v-model="editableApplication.type_of_course_id"
                  :is-editing="isEditing"
                  :options="courseTypes"
                />
                <FormSelectGroup
                  label="Qualification Level"
                  v-model="editableApplication.qualification_id"
                  :is-editing="isEditing"
                  :options="qualifications"
                />
              </div>
            </div>

            <!-- Documents -->
            <div
              v-if="filteredDocuments.length > 0"
              class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="p-2.5 sm:p-3 bg-sky-100/70 rounded-xl shadow-sm">
                  <DocumentIcon class="w-5 h-5 text-sky-600" />
                </div>
                <h4 class="text-md sm:text-lg font-semibold text-gray-800">Uploaded Documents</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <a
                  v-for="doc in filteredDocuments"
                  :key="doc.key"
                  :href="editableApplication[doc.key]"
                  target="_blank"
                  class="group flex items-center p-3.5 sm:p-4 bg-white/80 rounded-lg border border-gray-200/80 hover:border-blue-400/70 hover:shadow-md transition-all duration-150"
                >
                  <div class="p-2 bg-sky-50 rounded-lg mr-3 sm:mr-4">
                    <FileIcon class="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm font-medium text-gray-800">{{ doc.label }}</p>
                  </div>
                  <div
                    class="inline-flex items-center shrink-0 px-3 py-1.5 text-xs sm:text-sm font-medium text-sky-700 bg-sky-100 group-hover:bg-sky-200/80 rounded-md transition-colors shadow-sm"
                  >
                    <EyeIcon class="w-3.5 h-3.5 mr-1.5" />
                    View
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Other Modal Types (Forms) -->
          <div v-else class="space-y-6 sm:space-y-8">
            <div v-if="modalType === 'addNote'" class="space-y-1.5">
              <label for="noteText" class="block text-sm font-medium text-gray-700">
                {{
                  userRole === 'chief'
                    ? 'Chief Remarks (Visible to DO and Applicant upon regret)'
                    : 'Dealing Officer Remarks (Visible to Chief)'
                }}
              </label>
              <div class="relative">
                <textarea
                  id="noteText"
                  v-model="noteText"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                  rows="5"
                  placeholder="Enter your note here..."
                ></textarea>
              </div>
            </div>
            <div v-if="modalType === 'addPrivateNote'" class="space-y-1.5">
              <label for="privateNoteText" class="block text-sm font-medium text-gray-700"
                >Private Note for Dealing Officer</label
              >
              <div class="relative">
                <textarea
                  id="privateNoteText"
                  v-model="privateNoteText"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                  rows="5"
                  placeholder="This note is only visible to the assigned dealing officer..."
                ></textarea>
              </div>
            </div>
            <div v-if="modalType === 'regret'" class="space-y-1.5">
              <label for="rejectionReason" class="block text-sm font-medium text-gray-700"
                >Rejection Reason</label
              >
              <div class="relative">
                <textarea
                  id="rejectionReason"
                  v-model="rejectionReason"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                  rows="5"
                  placeholder="Enter rejection reason here... This will be visible to the applicant."
                ></textarea>
              </div>
            </div>
            <div
              v-if="modalType === 'forward'"
              class="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-blue-50/70 rounded-xl border border-blue-200/80 shadow-sm"
            >
              <CircleAlert class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p class="text-blue-800 font-medium text-sm sm:text-base">
                  Are you sure you want to forward this application to the Chief?
                </p>
              </div>
            </div>
            <div
              v-if="modalType === 'approve'"
              class="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-green-50/70 rounded-xl border border-green-200/80 shadow-sm"
            >
              <CheckCircleIcon class="w-6 h-6 sm:w-8 sm:h-8 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p class="text-green-800 font-medium text-sm sm:text-base">
                  Are you sure you want to approve this application?
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-end gap-3 sm:gap-4 p-4 sm:p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
        >
          <button
            class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-150 shadow-sm"
            @click="closeModal"
          >
            <XIcon class="w-4 h-4 mr-1.5" />
            Cancel
          </button>
          <button
            v-if="modalType !== 'view' && modalType !== 'viewCertificate'"
            class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 shadow-sm"
            :class="
              modalType === 'edit'
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            "
            @click="handleModalAction"
            :disabled="isSaving"
          >
            <component :is="actionButtonIcon" class="w-4 h-4 mr-1.5" />
            {{
              isSaving
                ? 'Saving...'
                : modalType === 'forward'
                ? 'Forward'
                : modalType === 'approve'
                ? 'Approve'
                : 'Save Changes'
            }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import FormInputGroup from './FormInputGroup.vue'
import FormSelectGroup from './FormSelectGroup.vue'
import {
  User as UserIcon,
  MapPin as MapPinIcon,
  GraduationCap as GraduationCapIcon,
  FileText as DocumentIcon,
  File as FileIcon,
  Eye as EyeIcon,
  X as XIcon,
  ExternalLink as ExternalLinkIcon,
  CircleAlert,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  School as SchoolIcon,
  Globe as GlobeIcon,
  Timer as TimerIcon,
  Hash as HashIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  ArrowRight as ArrowRightIcon,
  Camera as CameraIcon,
  Send as SendIcon,
  Pencil as PencilIcon,
} from 'lucide-vue-next'

const props = defineProps({
  showModal: { type: Boolean, default: false },
  modalType: { type: String, default: null },
  application: { type: Object, required: true },
  userRole: { type: String, required: true },
})

const emit = defineEmits(['close', 'update'])
const toast = useToast()

const noteText = ref('')
const privateNoteText = ref('')
const rejectionReason = ref('')
const isSaving = ref(false)
const editableApplication = ref({})

const isEditing = computed(() => props.modalType === 'edit')

const qualifications = ref([])
const courseTypes = ref([])
const countries = ref([])
const genders = ref([
  { value: 'Male', text: 'Male' },
  { value: 'Female', text: 'Female' },
  { value: 'Other', text: 'Other' },
])

const headerColorClass = computed(
  () =>
    ({
      view: 'bg-blue-100/70',
      edit: 'bg-amber-100/70',
      addNote: 'bg-green-100/70',
      addPrivateNote: 'bg-indigo-100/70',
      forward: 'bg-indigo-100/70',
      regret: 'bg-red-100/70',
      approve: 'bg-green-100/70',
    }[props.modalType] || 'bg-gray-100/70')
)

const headerIconClass = computed(
  () =>
    ({
      view: 'text-blue-600',
      edit: 'text-amber-600',
      addNote: 'text-green-600',
      addPrivateNote: 'text-indigo-600',
      forward: 'text-indigo-600',
      regret: 'text-red-600',
      approve: 'text-green-600',
    }[props.modalType] || 'text-gray-600')
)

const modalTitle = computed(
  () =>
    ({
      view: 'View Application Details',
      edit: 'Edit Application Details',
      addNote: 'Add/Edit Remarks',
      addPrivateNote: 'Add Private Note for DO',
      forward: 'Forward Application',
      regret: 'Regret Application',
      approve: 'Approve Application',
    }[props.modalType] || 'Application Details')
)

const modalDescription = computed(
  () =>
    ({
      addNote:
        props.userRole === 'chief'
          ? 'These remarks are visible to the DO.'
          : 'These remarks are visible to the Chief.',
      addPrivateNote: 'This note will only be visible to the assigned dealing officer.',
    }[props.modalType] || '')
)

const modalIcons = {
  view: UserIcon,
  edit: PencilIcon,
  addNote: DocumentIcon,
  addPrivateNote: SendIcon,
  forward: ArrowRightIcon,
  regret: XIcon,
  approve: CheckCircleIcon,
}

const actionButtonIcon = computed(
  () =>
    ({
      forward: ArrowRightIcon,
      regret: XIcon,
      approve: CheckCircleIcon,
    }[props.modalType] || SaveIcon)
)

const documents = [
  { key: 'degree_certificate', label: 'Degree Certificate' },
  { key: 'academic_transcript', label: 'Academic Transcript' },
  { key: 'confirmation_document', label: 'Confirmation Document (Offer Letter)' },
  { key: 'second_copy_supporting_document', label: 'Second Copy Supporting Document' },
]

const filteredDocuments = computed(() =>
  documents.filter((doc) => editableApplication.value && editableApplication.value[doc.key])
)

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const handleModalAction = async () => {
  isSaving.value = true
  let payload = {}

  switch (props.modalType) {
    case 'edit':
      const originalApp = props.application
      const editedApp = editableApplication.value
      const changes = {}

      const fieldsToCompare = [
        'applicants_name',
        'cid_no',
        'date_of_birth',
        'gender',
        'contact_no',
        'email_address',
        'course_title',
        'duration_of_course',
        'name_of_institute',
        'name_of_university',
        'location',
        'country',
        'student_id_no',
        'year_of_completion',
        'website',
      ]

      fieldsToCompare.forEach((field) => {
        if (originalApp[field] !== editedApp[field]) {
          changes[field] = editedApp[field]
        }
      })

      if (originalApp.type_of_course?.id !== editedApp.type_of_course_id) {
        changes.type_of_course_id = editedApp.type_of_course_id
      }
      if (originalApp.qualification?.id !== editedApp.qualification_id) {
        changes.qualification_id = editedApp.qualification_id
      }

      if (Object.keys(changes).length === 0) {
        toast.info('No changes were made.')
        isSaving.value = false
        closeModal()
        return
      }
      payload = changes
      break
    case 'addNote':
      if (props.userRole === 'chief') {
        payload = { chief_remarks: noteText.value }
      } else if (props.userRole === 'dealing_officer') {
        payload = { dealing_officer_remarks: noteText.value }
      }
      break
    case 'addPrivateNote':
      if (props.userRole === 'chief') {
        payload = { chief_to_do_remarks: privateNoteText.value }
      }
      break
    case 'forward':
      payload = { forward: true, status: 'under_review' }
      break
    case 'regret':
      if (!rejectionReason.value.trim()) {
        toast.error('Rejection reason cannot be empty.')
        isSaving.value = false
        return
      }
      payload = { chief_remarks: rejectionReason.value, status: 'regretted' }
      break
    case 'approve':
      payload = { status: 'approved' }
      break
    default:
      isSaving.value = false
      return
  }

  emit('update', payload)
}

const closeModal = () => {
  noteText.value = ''
  privateNoteText.value = ''
  rejectionReason.value = ''
  isSaving.value = false
  emit('close')
}

async function fetchDropdownData() {
  try {
    // We only fetch the data we actually need and have endpoints for.
    const [qualsResponse, typesResponse] = await Promise.all([
      apiService.getQualifications(),
      apiService.getTypesOfCourse(),
    ])

    qualifications.value =
      qualsResponse.data?.results?.map((q) => ({ value: q.id, text: q.name })) || []
    courseTypes.value =
      typesResponse.data?.results?.map((t) => ({ value: t.id, text: t.name })) || []
  } catch (error) {
    toast.error('Failed to load necessary data for editing.')
    console.error(error)
  }
}

watch(
  () => props.application,
  (newApp) => {
    if (newApp && Object.keys(newApp).length) {
      editableApplication.value = JSON.parse(JSON.stringify(newApp))
      editableApplication.value.type_of_course_id = newApp.type_of_course?.id || null
      editableApplication.value.qualification_id = newApp.qualification?.id || null
    } else {
      editableApplication.value = {}
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      if (props.modalType === 'view' || props.modalType === 'edit' || props.modalType === 'viewCertificate') {
        fetchDropdownData()
      }
      if (props.modalType === 'addNote') {
        if (props.userRole === 'chief') {
          noteText.value = editableApplication.value.chief_remarks || ''
        } else if (props.userRole === 'dealing_officer') {
          noteText.value = editableApplication.value.dealing_officer_remarks || ''
        }
      }
      if (props.modalType === 'addPrivateNote') {
        privateNoteText.value = editableApplication.value.chief_to_do_remarks || ''
      }
      if (props.modalType === 'regret') {
        rejectionReason.value = editableApplication.value.chief_remarks || ''
      }
    }
  }
)

watch(
  () => editableApplication.value.country,
  (newCountry) => {
    if (newCountry && typeof newCountry === 'string' && newCountry.length > 0) {
      // Capitalize the first letter and keep the rest
      editableApplication.value.country = newCountry.charAt(0).toUpperCase() + newCountry.slice(1)
    }
  }
)
</script>
