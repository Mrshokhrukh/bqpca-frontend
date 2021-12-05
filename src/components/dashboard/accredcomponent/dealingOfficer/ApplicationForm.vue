<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      Application Details - {{ application.institute_name }}
    </h2>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Institution Profile -->
        <div class="border p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold text-lg mb-4 text-gray-700">Institution Profile</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="institutionName">Name of Institution:</label>
              <select v-model="formData.institutionName" id="institutionName" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing">
                <option value="Institution1">Institution 1</option>
                <option value="Institution2">Institution 2</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="address">Address/Location:</label>
              <input v-model="formData.address" type="text" id="address" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="contactNumber">Contact Number:</label>
              <input v-model="formData.contactNumber" type="number" id="contactNumber" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="emailAddress">Email Address:</label>
              <input v-model="formData.emailAddress" type="text" id="emailAddress" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="telephoneNumber">Telephone Number:</label>
              <input v-model="formData.telephoneNumber" type="number" id="telephoneNumber" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="yearEstablished">Year of Establishment:</label>
              <input v-model="formData.yearEstablished" type="number" id="yearEstablished" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="institutionType">Type of Institution:</label>
              <select v-model="formData.institutionType" id="institutionType" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing">
                <option value="Constituent">Constituent</option>
                <option value="Affiliated">Affiliated</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="affiliatedTo">Affiliated to, if relevant:</label>
              <input v-model="formData.affiliatedTo" type="text" id="affiliatedTo" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="levelOfAutonomy">Level of Autonomy (if affiliated):</label>
              <input v-model="formData.levelOfAutonomy" type="text" id="levelOfAutonomy" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="sourceOfFunding">Source of funding:</label>
              <select v-model="formData.sourceOfFunding" id="sourceOfFunding" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing">
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Donor">Donor</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="totalArea">Total area (in acres):</label>
              <input v-model="formData.totalArea" type="number" id="totalArea" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="website">Website:</label>
              <input v-model="formData.website" type="text" id="website" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            </div>
          </div>
        </div>

        <!-- Standards -->
        <div class="border p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold text-lg mb-4 text-gray-700">Standards</h3>
          <button v-if="isEditing" @click="addStandard"
            :disabled="isAddingStandard"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isAddingStandard" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
            <span v-else class="flex items-center">
              <Plus class="w-4 h-4 mr-2" />
              Add Standard
            </span>
          </button>
        </div>

        <!-- Supporting Documents -->
        <div class="border p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold text-lg mb-4 text-gray-700">Supporting Documents</h3>
          <div class="mb-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="supportingDocument">Supporting Document:</label>
            <input type="file" id="supportingDocument" @change="handleSupportingDocumentUpload" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
            <span v-if="formData.supportingDocumentName" class="text-sm text-gray-500">Selected file: {{ formData.supportingDocumentName }}</span>
          </div>
          <div class="mb-2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="supportingDocumentRemarks">Remarks (if any):</label>
            <textarea v-model="formData.supportingDocumentRemarks" id="supportingDocumentRemarks" rows="2" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing"></textarea>
          </div>
          <button v-if="isEditing" @click="addSupportingDocument"
            :disabled="isAddingSupportingDocument"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isAddingSupportingDocument" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
            <span v-else class="flex items-center">
              <Plus class="w-4 h-4 mr-2" />
              Add Supporting Document
            </span>
          </button>
        </div>

      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Past Accreditation Details -->
        <div class="border p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold text-lg mb-4 text-gray-700">Past Accreditation Details</h3>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="accreditationRating">Accreditation Rating:</label>
            <input v-model="formData.accreditationRating" type="text" id="accreditationRating" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="accreditationValidity">Accreditation Validity:</label>
            <input v-model="formData.accreditationValidity" type="date" id="accreditationValidity" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
        </div>

        <!-- Details of the Head of the Institute -->
        <div class="border p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold text-lg mb-4 text-gray-700">Details of the Head of the Institute</h3>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="headName">Name:</label>
            <input v-model="formData.headName" type="text" id="headName" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="headContactNumber">Contact Number:</label>
            <input v-model="formData.headContactNumber" type="number" id="headContactNumber" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="headEmailAddress">Email Address:</label>
            <input v-model="formData.headEmailAddress" type="text" id="headEmailAddress" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
        </div>

        <!-- Name of the IQA Focal -->
        <div class="border p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold text-lg mb-4 text-gray-700">Name of the IQA Focal</h3>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="iqaFocalName">Name:</label>
            <input v-model="formData.iqaFocalName" type="text" id="iqaFocalName" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="iqaFocalContactNumber">Contact Number:</label>
            <input v-model="formData.iqaFocalContactNumber" type="number" id="iqaFocalContactNumber" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="iqaFocalEmailAddress">Email Address:</label>
            <input v-model="formData.iqaFocalEmailAddress" type="text" id="iqaFocalEmailAddress" class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :disabled="!isEditing" />
          </div>
        </div>

      </div>

    </div>

    <!-- Buttons -->
    <div class="flex justify-end mt-6 space-x-4">
      <button @click="closeModal"
        :disabled="isSaving || isSubmitting || isSavingDraft"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
        <X class="w-4 h-4 mr-2" />
        Cancel
      </button>
      <button v-if="isEditing" @click="saveAsDraft"
        :disabled="isSavingDraft || isSaving || isSubmitting"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center">
        <span v-if="isSavingDraft" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
        <span v-else class="flex items-center">
          <Save class="w-4 h-4 mr-2" />
          Save as Draft
        </span>
      </button>
      <button v-if="!isEditing" @click="enableEditing"
        :disabled="isSaving || isSubmitting || isSavingDraft"
        class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
        <Edit class="w-4 h-4 mr-2" />
        Edit
      </button>
      <button v-if="isEditing" @click="saveData"
        :disabled="isSaving || isSavingDraft || isSubmitting"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center">
        <span v-if="isSaving" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
        <span v-else class="flex items-center">
          <Check class="w-4 h-4 mr-2" />
          Save
        </span>
      </button>
      <button @click="viewApplication"
        :disabled="isSaving || isSubmitting || isSavingDraft"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
        <Eye class="w-4 h-4 mr-2" />
        View
      </button>
      <button @click="submitApplication"
        :disabled="isSubmitting || isSaving || isSavingDraft"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center">
        <span v-if="isSubmitting" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </span>
        <span v-else class="flex items-center">
          <Send class="w-4 h-4 mr-2" />
          Submit
        </span>
      </button>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { Plus, X, Save, Edit, Check, Eye, Send } from 'lucide-vue-next'

const toast = useToast()

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  assessorPool: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'save'])

const isEditing = ref(false) // Track whether the form is in edit mode

// Loading states
const isSaving = ref(false)
const isSavingDraft = ref(false)
const isSubmitting = ref(false)
const isAddingStandard = ref(false)
const isAddingSupportingDocument = ref(false)

const formData = reactive({
  // Institution Profile
  institutionName: props.application.institutionName || '',
  address: props.application.address || '',
  contactNumber: props.application.contactNumber || '',
  emailAddress: props.application.emailAddress || '',
  telephoneNumber: props.application.telephoneNumber || '',
  yearEstablished: props.application.yearEstablished || '',
  institutionType: props.application.institutionType || '',
  affiliatedTo: props.application.affiliatedTo || '',
  levelOfAutonomy: props.application.levelOfAutonomy || '',
  sourceOfFunding: props.application.sourceOfFunding || '',
  totalArea: props.application.totalArea || '',
  website: props.application.website || '',

  // Past Accreditation Details
  accreditationRating: props.application.accreditationRating || '',
  accreditationValidity: props.application.accreditationValidity || '',

  // Details of the Head of the Institute
  headName: props.application.headName || '',
  headContactNumber: props.application.headContactNumber || '',
  headEmailAddress: props.application.headEmailAddress || '',

  // Name of the IQA Focal
  iqaFocalName: props.application.iqaFocalName || '',
  iqaFocalContactNumber: props.application.iqaFocalContactNumber || '',
  iqaFocalEmailAddress: props.application.iqaFocalEmailAddress || '',

  // Current Academic Activities (in numbers)
  numberOfDepartments: props.application.numberOfDepartments || '',
  qualificationCategory: props.application.qualificationCategory || '',
  numberOfProgrammes: props.application.numberOfProgrammes || '',
  numberOfProgrammesWithElective: props.application.numberOfProgrammesWithElective || '',
  numberOfProgrammeThroughMixedMode: props.application.numberOfProgrammeThroughMixedMode || '',

  // Teaching Staff (in numbers)
  facultyF: props.application.facultyF || '',
  facultyM: props.application.facultyM || '',

  // New Review, Assessor, Site Visit, Results
  reviewDecision: props.application.reviewDecision || '',
  reviewRemark: props.application.reviewRemark || '',
  assessorName: props.application.assessorName || '',
  siteVisitName: props.application.siteVisitName || '',
  startDate: props.application.startDate || '',
  endDate: props.application.endDate || '',
  siteVisitRemarks: props.application.siteVisitRemarks || '',
  accreditationDecision: props.application.accreditationDecision || '',
  grade: props.application.grade || '',
  validity: props.application.validity || '',
  assessorsReport: null,
  assessorsReportName: props.application.assessorsReportName || null,
  reason: props.application.reason || '',
  resultRemarks: props.application.resultRemarks || '',

  // Non-Teaching Staff (in numbers)
  technicalMale: props.application.technicalMale || '',
  technicalFemale: props.application.technicalFemale || '',
  supportingDocumentName: props.application.supportingDocumentName || null,
  supportingDocumentRemarks: props.application.supportingDocumentRemarks || '',
})

// Watch for changes in props.application to update formData
watch(
  () => props.application,
  (newApplication) => {
    // Institution Profile
    formData.institutionName = newApplication.institutionName || ''
    formData.address = newApplication.address || ''
    formData.contactNumber = newApplication.contactNumber || ''
    formData.emailAddress = newApplication.emailAddress || ''
    formData.telephoneNumber = newApplication.telephoneNumber || ''
    formData.yearEstablished = newApplication.yearEstablished || ''
    formData.institutionType = newApplication.institutionType || ''
    formData.affiliatedTo = newApplication.affiliatedTo || ''
    formData.levelOfAutonomy = newApplication.levelOfAutonomy || ''
    formData.sourceOfFunding = newApplication.sourceOfFunding || ''
    formData.totalArea = newApplication.totalArea || ''
    formData.website = newApplication.website || ''

    // Past Accreditation Details
    formData.accreditationRating = newApplication.accreditationRating || ''
    formData.accreditationValidity = newApplication.accreditationValidity || ''

    // Details of the Head of the Institute
    formData.headName = newApplication.headName || ''
    formData.headContactNumber = newApplication.headContactNumber || ''
    formData.headEmailAddress = newApplication.headEmailAddress || ''

    // Name of the IQA Focal
    formData.iqaFocalName = newApplication.iqaFocalName || ''
    formData.iqaFocalContactNumber = newApplication.iqaFocalContactNumber || ''
    formData.iqaFocalEmailAddress = newApplication.iqaFocalEmailAddress || ''

    // Current Academic Activities (in numbers)
    formData.numberOfDepartments = newApplication.numberOfDepartments || ''
    formData.qualificationCategory = newApplication.qualificationCategory || ''
    formData.numberOfProgrammes = newApplication.numberOfProgrammes || ''
    formData.numberOfProgrammesWithElective = newApplication.numberOfProgrammesWithElective || ''
    formData.numberOfProgrammeThroughMixedMode =
      newApplication.numberOfProgrammeThroughMixedMode || ''

    // Teaching Staff (in numbers)
    formData.facultyF = newApplication.facultyF || ''
    formData.facultyM = newApplication.facultyM || ''

    // New Review, Assessor, Site Visit, Results
    formData.reviewDecision = newApplication.reviewDecision || ''
    formData.reviewRemark = newApplication.reviewRemark || ''
    formData.assessorName = newApplication.assessorName || ''
    formData.siteVisitName = newApplication.siteVisitName || ''
    formData.startDate = newApplication.startDate || ''
    formData.endDate = newApplication.endDate || ''
    formData.siteVisitRemarks = newApplication.siteVisitRemarks || ''
    formData.accreditationDecision = newApplication.accreditationDecision || ''
    formData.grade = newApplication.grade || ''
    formData.validity = newApplication.validity || ''
    formData.assessorsReportName = newApplication.assessorsReportName || null
    formData.reason = newApplication.reason || ''
    formData.resultRemarks = newApplication.resultRemarks || ''

    // Non-Teaching Staff (in numbers)
    formData.technicalMale = newApplication.technicalMale || ''
    formData.technicalFemale = newApplication.technicalFemale || ''
  },
  { immediate: true, deep: true }, // Run the watcher immediately and watch for deep changes
)

const handleSupportingDocumentUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File is too large. Maximum size is 5MB.');
      formData.supportingDocumentName = null;
      event.target.value = ''; // Reset the file input
      return;
    }
    formData.supportingDocumentName = file.name;
    // You might want to store the file object itself if you plan to upload it
    // e.g., formData.supportingDocumentFile = file;
  }
}

const closeModal = () => {
  emit('close')
}

const saveData = async () => {
  isSaving.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const payload = {
      ...props.application, // Keep the original application data
      ...formData, // Override with form data
    }
    emit('save', payload)
    isEditing.value = false // Disable editing after saving
    toast.success('Data saved successfully!')
  } catch (error) {
    toast.error('Failed to save data. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const enableEditing = () => {
  isEditing.value = true // Enable editing mode
}

const saveAsDraft = async () => {
  isSavingDraft.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Your actual draft saving logic here
    const draftPayload = {
      ...formData,
      status: 'draft'
    }
    // emit('save-draft', draftPayload)

    toast.success('Application saved as draft!')
  } catch (error) {
    toast.error('Failed to save draft. Please try again.')
  } finally {
    isSavingDraft.value = false
  }
}

const submitApplication = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Your actual submission logic here
    const submitPayload = {
      ...formData,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    }
    // emit('submit', submitPayload)

    toast.success('Application submitted successfully!')
  } catch (error) {
    toast.error('Failed to submit application. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const viewApplication = () => {
  isEditing.value = false
  //Implement what happens with the view application, maybe display or something
  toast.info('Viewing application...')
}

const addStandard = async () => {
  isAddingStandard.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Your actual add standard logic here
    // e.g., emit('add-standard', { standardData })

    toast.success('Standard added successfully!')
  } catch (error) {
    toast.error('Failed to add standard. Please try again.')
  } finally {
    isAddingStandard.value = false
  }
}

const addSupportingDocument = async () => {
  isAddingSupportingDocument.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Your actual add supporting document logic here
    // e.g., emit('add-supporting-document', { documentData })

    toast.success('Supporting document added successfully!')
  } catch (error) {
    toast.error('Failed to add supporting document. Please try again.')
  } finally {
    isAddingSupportingDocument.value = false
  }
}
</script>

<style scoped>
/* Add spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions for buttons */
button {
  transition: all 0.3s ease;
}

/* Ensure consistent button sizing */
button span {
  display: flex;
  align-items: center;
}
</style>