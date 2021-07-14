<template>
  <Transition name="modal-fade">
    <!-- The v-if="true" should be v-if="isVisible" or similar, controlled by a prop or local state -->
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
    >
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

      <div
        class="relative w-full max-w-3xl mx-4 my-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isNewApplication ? 'New CPD Application' : 'CPD Application Details' }}
          </h2>
          <button
            @click="closeModal"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <!-- Personal Details Section -->
          <section>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Personal Details
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Registration Number</label
                >
                <input
                  v-model="form.registrationNumber"
                  type="text"
                  readonly
                  class="form-input-readonly"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >CID/Identity Number</label
                >
                <input v-model="form.cidNumber" type="text" readonly class="form-input-readonly" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Full Name</label
                >
                <input v-model="form.fullName" type="text" readonly class="form-input-readonly" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Gender</label
                >
                <input
                  v-model="form.gender"
                  type="text"
                  readonly
                  class="form-input-readonly capitalize"
                />
              </div>
            </div>
          </section>

          <!-- CPD Details Section -->
          <section>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">CPD Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Title of CPD <span class="text-red-500">*</span></label
                >
                <input
                  v-model="form.cpdTitle"
                  type="text"
                  :readonly="!isEditable"
                  class="form-input"
                  :class="{ 'form-input-readonly': !isEditable }"
                />
                <span v-if="formErrors.cpdTitle" class="text-xs text-red-500">{{
                  formErrors.cpdTitle
                }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Relevance to Profession <span class="text-red-500">*</span></label
                >
                <input
                  v-model="form.relevance"
                  type="text"
                  :readonly="!isEditable"
                  class="form-input"
                  :class="{ 'form-input-readonly': !isEditable }"
                />
                <span v-if="formErrors.relevance" class="text-xs text-red-500">{{
                  formErrors.relevance
                }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Participation Category <span class="text-red-500">*</span></label
                >
                <select
                  v-model="form.participationCategory"
                  @change="form.participantSubCategory = null"
                  :disabled="!isEditable"
                  class="form-select"
                  :class="{ 'form-input-readonly pointer-events-none': !isEditable }"
                >
                  <option :value="null" disabled>Select category</option>
                  <option
                    v-for="cat in participationCategoriesMaster"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.participation_category_name }}
                  </option>
                </select>
                <span v-if="formErrors.participationCategory" class="text-xs text-red-500">{{
                  formErrors.participationCategory
                }}</span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Participant Sub-Category <span class="text-red-500">*</span></label
                >
                <select
                  v-model="form.participantSubCategory"
                  :disabled="
                    !form.participationCategory || filteredSubCategories.length === 0 || !isEditable
                  "
                  class="form-select"
                  :class="{ 'form-input-readonly pointer-events-none': !isEditable }"
                >
                  <option :value="null" disabled>
                    {{
                      !form.participationCategory
                        ? 'Select category first'
                        : filteredSubCategories.length === 0
                          ? 'No sub-categories'
                          : 'Select sub-category'
                    }}
                  </option>
                  <option
                    v-for="subCat in filteredSubCategories"
                    :key="subCat.id"
                    :value="subCat.id"
                  >
                    {{ subCat.participation_sub_category_name }}
                  </option>
                </select>
                <span v-if="formErrors.participantSubCategory" class="text-xs text-red-500">{{
                  formErrors.participantSubCategory
                }}</span>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Type of CPD Activity <span class="text-red-500">*</span></label
                >
                <select
                  v-model="form.activityType"
                  :disabled="!isEditable"
                  class="form-select"
                  :class="{ 'form-input-readonly pointer-events-none': !isEditable }"
                >
                  <option :value="null" disabled>Select activity type</option>
                  <option v-for="act in cpdActivitiesMaster" :key="act.id" :value="act.id">
                    {{ act.cpd_activity_name }}
                  </option>
                </select>
                <span v-if="formErrors.activityType" class="text-xs text-red-500">{{
                  formErrors.activityType
                }}</span>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Attachment</label
                >
                <input
                  type="file"
                  @change="handleFileUpload"
                  :disabled="!isEditable"
                  class="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                <div
                  v-if="form.attachmentName || (form.attachment && form.attachment.name)"
                  class="mt-1 text-sm text-gray-600 dark:text-gray-400"
                >
                  Current: {{ form.attachmentName || (form.attachment && form.attachment.name) }}
                  <a
                    v-if="form.attachmentUrl && !isNewApplication"
                    :href="form.attachmentUrl"
                    target="_blank"
                    class="text-blue-500 hover:underline ml-2"
                    >(View)</a
                  >
                </div>
                <span v-if="formErrors.attachment" class="text-xs text-red-500">{{
                  formErrors.attachment
                }}</span>
              </div>
            </div>
          </section>

          <!-- Review Section (BMHC/Dealing Officer Part) -->
          <!-- This section should only be visible/editable by a reviewer, not by the user creating/editing their own -->
          <section v-if="canReview">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Review & Award</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >CPD Credits Awarded</label
                >
                <input
                  v-model.number="form.cpdCredits"
                  type="number"
                  min="0"
                  step="0.5"
                  class="form-input"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Review Status</label
                >
                <select v-model="form.reviewStatus" class="form-select">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <!-- Or "Regretted" based on your system -->
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Remarks</label
                >
                <textarea v-model="form.remarks" rows="3" class="form-input"></textarea>
              </div>
            </div>
          </section>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 p-6 border-t dark:border-gray-700">
          <button @click="closeModal" class="btn-secondary">Cancel</button>
          <button v-if="!isNewApplication && canDelete" @click="handleDelete" class="btn-danger">
            Delete
          </button>
          <button @click="handleSave" class="btn-primary" :disabled="isSaving">
            <span
              v-if="isSaving"
              class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
            ></span>
            {{
              isSaving
                ? 'Saving...'
                : isNewApplication
                  ? 'Submit Application'
                  : form.reviewStatus === 'Approved' && canReview
                    ? 'Approve & Award'
                    : 'Save Changes'
            }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import apiServices from '@/services/services' // Adjust path as needed

const props = defineProps({
  modelValue: Boolean, // Used for v-model on the component
  application: {
    // This will be the participant object from the "Self CPD Applications" list
    type: Object,
    default: () => ({}),
  },
  isNewApplication: {
    // True if creating a new CPD record
    type: Boolean,
    default: false,
  },
  // Add a prop to determine if the review section should be active
  // This would typically be based on the user's role.
  canReview: {
    type: Boolean,
    default: false, // User submitting the form usually cannot review
  },
  canDelete: {
    type: Boolean,
    default: false, // e.g. only admin or owner can delete
  },
})

const emit = defineEmits([
  'update:modelValue',
  'save',
  'delete',
  'approve',
  'reject',
  'awardCredits',
])

const form = ref({})
const formErrors = ref({})
const isSaving = ref(false)

// Master Data
const participationCategoriesMaster = ref([])
const subCategoriesMaster = ref([])
const cpdActivitiesMaster = ref([])
const newAttachmentFile = ref(null) // To store the new file object

// Computed property to determine if CPD fields are editable
// They are editable if it's a new application OR if it's an existing one and the status is Pending (or user has specific edit rights)
const isEditable = computed(() => {
  return (
    props.isNewApplication ||
    (props.application &&
      (props.application.reviewStatus === 'Pending' || props.application.reviewStatus === null))
  )
  // Add more conditions if needed, e.g., based on user role
})

const initializeForm = (appData) => {
  // For new applications, user data might be pre-filled from authStore elsewhere
  // For this modal, we assume personal details are passed in `appData`
  form.value = {
    id: appData.id || null,
    registrationNumber:
      appData.registrationNumber ||
      (appData.rawItem?.registration_no ? String(appData.rawItem.registration_no) : 'N/A'), // from parent list
    cidNumber: appData.cidNumber || appData.rawItem?.cid_no || 'N/A',
    fullName: appData.fullName || appData.rawItem?.full_name || 'N/A',
    gender: appData.gender || appData.rawItem?.gender || 'N/A',

    cpdTitle: appData.cpdTitle || appData.rawItem?.title_of_cpd || '',
    relevance: appData.relevance || appData.rawItem?.relevance_to_profession || '',

    // Use the IDs for v-model with select elements
    participationCategory:
      appData.rawItem?.participation_category || appData.participation_category || null,
    participantSubCategory:
      appData.rawItem?.participant_sub_category || appData.participant_sub_category || null,
    activityType: appData.rawItem?.type_of_cpd_activity || appData.type_of_cpd_activity || null,

    attachment: null, // Will be handled by file input, don't bind directly to object
    attachmentName:
      appData.attachment?.name ||
      (appData.rawItem?.attachment ? appData.rawItem.attachment.split('/').pop() : null),
    attachmentUrl: appData.attachment?.url || appData.rawItem?.attachment || null,

    // Review fields
    cpdCredits:
      appData.cpdCredits ||
      (appData.rawItem?.cpd_credit === 0 ? 0 : appData.rawItem?.cpd_credit || 0), // Default to 0 or actual value
    reviewStatus: appData.reviewStatus || appData.rawItem?.review_status || 'Pending',
    remarks: appData.remarks || appData.rawItem?.remark || '',
  }
  newAttachmentFile.value = null // Reset file on init
}

watch(
  () => props.application,
  (newVal) => {
    if (newVal) {
      initializeForm(newVal)
    } else if (props.isNewApplication) {
      // Initialize with defaults for a new application
      // Personal details would typically be pre-filled based on logged-in user if this modal is for self-application
      initializeForm({
        reviewStatus: 'Pending',
        cpdCredits: 0, // Or a default from system settings
        // Populate registrationNumber, cidNumber, fullName, gender from authStore or a prop if new
      })
    }
  },
  { immediate: true, deep: true },
)

const filteredSubCategories = computed(() => {
  if (!form.value.participationCategory || !subCategoriesMaster.value.length) return []
  return subCategoriesMaster.value.filter(
    // The master data for sub-categories has 'participation_category_name' holding the ID of the parent category
    (sub) => String(sub.participation_category_name) === String(form.value.participationCategory),
  )
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      formErrors.value.attachment = 'File size exceeds 2MB.'
      newAttachmentFile.value = null
      event.target.value = '' // Clear file input
      return
    }
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      formErrors.value.attachment = 'Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX.'
      newAttachmentFile.value = null
      event.target.value = ''
      return
    }
    newAttachmentFile.value = file
    form.value.attachmentName = file.name // Show new file name
    delete formErrors.value.attachment
  }
}

const validateForm = () => {
  formErrors.value = {}
  let isValid = true
  if (!form.value.cpdTitle?.trim()) {
    formErrors.value.cpdTitle = 'Title is required.'
    isValid = false
  }
  if (!form.value.relevance?.trim()) {
    formErrors.value.relevance = 'Relevance is required.'
    isValid = false
  }
  if (!form.value.participationCategory) {
    formErrors.value.participationCategory = 'Category is required.'
    isValid = false
  }
  if (filteredSubCategories.value.length > 0 && !form.value.participantSubCategory) {
    formErrors.value.participantSubCategory = 'Sub-category is required.'
    isValid = false
  }
  if (!form.value.activityType) {
    formErrors.value.activityType = 'Activity type is required.'
    isValid = false
  }
  // Add other validations as needed, e.g., for attachment if new and required
  return isValid
}

const handleSave = async () => {
  if (!validateForm()) {
    // Optionally show a toast message for validation errors
    // toast.error("Please correct the errors in the form.");
    return
  }
  isSaving.value = true

  // Prepare payload for the API
  const payload = new FormData()
  payload.append('title_of_cpd', form.value.cpdTitle)
  payload.append('relevance_to_profession', form.value.relevance)
  payload.append('participation_category', form.value.participationCategory)
  if (form.value.participantSubCategory) {
    // Only append if a sub-category is selected/exists
    payload.append('participant_sub_category', form.value.participantSubCategory)
  }
  payload.append('type_of_cpd_activity', form.value.activityType)

  // These are typically set by the user if isNewApplication or editable by admin
  if (props.isNewApplication || props.canReview) {
    payload.append('cpd_credit', form.value.cpdCredits ?? 0) // Backend might auto-calculate if not provided by reviewer
    if (props.canReview) {
      // Only reviewer can change status and remarks directly for existing records
      payload.append('review_status', form.value.reviewStatus)
      payload.append('remark', form.value.remarks || '')
    }
  }

  // Append personal details (even if read-only, backend might need them for association)
  // For new self-application, these would come from logged-in user context
  if (props.isNewApplication) {
    // payload.append('registration_no', form.value.registrationNumber); // PK of registration
    // payload.append('cid_no', form.value.cidNumber);
    // payload.append('full_name', form.value.fullName);
    // payload.append('gender', form.value.gender);
    // For new applications, you'd get these from authStore ideally, or pass them as props.
    // The current form.registrationNumber is likely a display string, API needs PK.
    // This needs careful handling of where personal data for NEW records comes from.
    // Assuming for new, the backend associates with logged-in user or uses data from the ApplicationForm page.
  }

  if (newAttachmentFile.value) {
    payload.append('attachment', newAttachmentFile.value, newAttachmentFile.value.name)
  } else if (props.isNewApplication && !form.value.attachmentUrl) {
    // Potentially make attachment required for new applications
    // formErrors.value.attachment = "Attachment is required for new applications.";
    // isSaving.value = false;
    // return;
  }

  // Determine action based on context
  if (props.canReview && form.value.reviewStatus === 'Approved') {
    emit('approve', {
      participantId: form.value.id,
      remarks: form.value.remarks,
      credits: form.value.cpdCredits,
      payload,
    })
  } else if (props.canReview && form.value.reviewStatus === 'Rejected') {
    emit('reject', { participantId: form.value.id, remarks: form.value.remarks, payload })
  } else {
    // General save for new application or edits by user/admin
    emit('save', { id: form.value.id, isNew: props.isNewApplication, payload })
  }
  // closeModal(); // Emitting event should trigger close in parent
  isSaving.value = false // Reset after emit, parent handles actual async
}

const handleDelete = () => {
  // Confirmation can be handled in parent or here
  // if (confirm('Are you sure you want to delete this application?')) {
  emit('delete', form.value.id) // Emit ID for deletion
  // }
}

const closeModal = () => {
  emit('update:modelValue', false)
}

// Fetch Master Data on Mount
const fetchAllMasterDataForModal = async () => {
  try {
    const [categoriesRes, subCategoriesRes, activitiesRes] = await Promise.allSettled([
      apiServices.getMhpcMastersMHPCParticipationCategories(),
      apiServices.getMhpcMastersMhpcParticipationSubCategories(),
      apiServices.getMhpcMastersSingleCpdActivity(),
    ])

    const processMasterDataResponse = (response, refToUpdate, typeName) => {
      if (response.status === 'fulfilled') {
        const data = response.value?.data?.results || response.value?.results
        if (Array.isArray(data)) {
          refToUpdate.value = data
        } else {
          console.error(
            `Modal: Failed to load ${typeName} or unexpected structure:`,
            response.value,
          )
          refToUpdate.value = []
        }
      } else {
        console.error(`Modal: Error fetching ${typeName}:`, response.reason)
        refToUpdate.value = []
      }
    }

    processMasterDataResponse(
      categoriesRes,
      participationCategoriesMaster,
      'participation categories',
    )
    processMasterDataResponse(subCategoriesRes, subCategoriesMaster, 'sub-categories')
    processMasterDataResponse(activitiesRes, cpdActivitiesMaster, 'CPD activities')
  } catch (error) {
    console.error('Modal: General error fetching master data:', error)
    // Optionally show a toast/notification specific to the modal
  }
}

onMounted(() => {
  fetchAllMasterDataForModal()
  // Form initialization is handled by the watcher on `props.application`
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
/* Basic styling for form elements, assuming Tailwind utility classes */
.form-input,
.form-select {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}
.form-input-readonly {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 cursor-not-allowed;
}
.btn-primary {
  @apply px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50;
}
.btn-secondary {
  @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:focus:ring-offset-gray-900;
}
.btn-danger {
  @apply px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900;
}
</style>
