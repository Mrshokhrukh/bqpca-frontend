<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      Application Details - {{ application.institute_name }}
    </h2>

    <!-- Institution Profile -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Institution Profile</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="institutionName"
          >Name of Institution:</label
        >
        <select
          v-model="formData.institutionName"
          id="institutionName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        >
          <option value="Institution1">Institution 1</option>
          <option value="Institution2">Institution 2</option>
          <!-- Add more institutions -->
        </select>
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address"
          >Address/Location:</label
        >
        <input
          v-model="formData.address"
          type="text"
          id="address"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <!-- Gewog, Dzongkhag, Contact Number, etc. - Add similar input fields here -->
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="contactNumber"
          >Contact Number:</label
        >
        <input
          v-model="formData.contactNumber"
          type="number"
          id="contactNumber"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>

      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="emailAddress"
          >Email Address:</label
        >
        <input
          v-model="formData.emailAddress"
          type="text"
          id="emailAddress"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="telephoneNumber"
          >Telephone Number:</label
        >
        <input
          v-model="formData.telephoneNumber"
          type="number"
          id="telephoneNumber"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>

      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="yearEstablished"
          >Year of Establishment:</label
        >
        <input
          v-model="formData.yearEstablished"
          type="number"
          id="yearEstablished"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="institutionType"
          >Type of Institution:</label
        >
        <select
          v-model="formData.institutionType"
          id="institutionType"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        >
          <option value="Constituent">Constituent</option>
          <option value="Affiliated">Affiliated</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="affiliatedTo"
          >Affiliated to, if relevant:</label
        >
        <input
          v-model="formData.affiliatedTo"
          type="text"
          id="affiliatedTo"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="levelOfAutonomy"
          >Level of Autonomy (if affiliated):</label
        >
        <input
          v-model="formData.levelOfAutonomy"
          type="text"
          id="levelOfAutonomy"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="sourceOfFunding"
          >Source of funding:</label
        >
        <select
          v-model="formData.sourceOfFunding"
          id="sourceOfFunding"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        >
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="Donor">Donor</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="totalArea"
          >Total area (in acres):</label
        >
        <input
          v-model="formData.totalArea"
          type="number"
          id="totalArea"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="website">Website:</label>
        <input
          v-model="formData.website"
          type="text"
          id="website"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Past Accreditation Details -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Past Accreditation Details</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="accreditationRating"
          >Accreditation Rating:</label
        >
        <input
          v-model="formData.accreditationRating"
          type="text"
          id="accreditationRating"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="accreditationValidity"
          >Accreditation Validity:</label
        >
        <input
          v-model="formData.accreditationValidity"
          type="date"
          id="accreditationValidity"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Details of the Head of the Institute -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Details of the Head of the Institute</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="headName">Name:</label>
        <input
          v-model="formData.headName"
          type="text"
          id="headName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="headContactNumber"
          >Contact Number:</label
        >
        <input
          v-model="formData.headContactNumber"
          type="number"
          id="headContactNumber"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="headEmailAddress"
          >Email Address:</label
        >
        <input
          v-model="formData.headEmailAddress"
          type="text"
          id="headEmailAddress"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Name of the IQA Focal -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Name of the IQA Focal</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="iqaFocalName">Name:</label>
        <input
          v-model="formData.iqaFocalName"
          type="text"
          id="iqaFocalName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="iqaFocalContactNumber"
          >Contact Number:</label
        >
        <input
          v-model="formData.iqaFocalContactNumber"
          type="number"
          id="iqaFocalContactNumber"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="iqaFocalEmailAddress"
          >Email Address:</label
        >
        <input
          v-model="formData.iqaFocalEmailAddress"
          type="text"
          id="iqaFocalEmailAddress"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Current Academic Activities (in numbers) -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Current Academic Activities (in numbers)</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="numberOfDepartments"
          >Number of Departments:</label
        >
        <input
          v-model="formData.numberOfDepartments"
          type="number"
          id="numberOfDepartments"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="qualificationCategory"
          >Qualification Category:</label
        >
        <select
          v-model="formData.qualificationCategory"
          id="qualificationCategory"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        >
          <option value="Category1">Category 1</option>
          <option value="Category2">Category 2</option>
          <!-- Add more categories -->
        </select>
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="numberOfProgrammes"
          >Number of Programmes:</label
        >
        <button
          v-if="isEditing"
          @click="addProgram"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Programme
        </button>
      </div>
      <div class="mb-2">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="numberOfProgrammesWithElective"
          >Number of Programmes with elective:</label
        >
        <input
          v-model="formData.numberOfProgrammesWithElective"
          type="number"
          id="numberOfProgrammesWithElective"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="numberOfProgrammeThroughMixedMode"
          >Number of Programme through Mixed mode:</label
        >
        <input
          v-model="formData.numberOfProgrammeThroughMixedMode"
          type="number"
          id="numberOfProgrammeThroughMixedMode"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
    </div>

    <!-- Teaching Staff (in numbers) -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Teaching Staff (in numbers)</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="facultyF"
          >Number of Faculty (F):</label
        >
        <input
          v-model="formData.facultyF"
          type="number"
          id="facultyF"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="facultyM"
          >Number of Faculty (M):</label
        >
        <input
          v-model="formData.facultyM"
          type="number"
          id="facultyM"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <!-- Add similar input fields for other categories of teaching staff -->
    </div>

    <!-- Non-Teaching Staff (in numbers) -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Non-Teaching Staff (in numbers)</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="technicalMale"
          >Technical Male:</label
        >
        <input
          v-model="formData.technicalMale"
          type="number"
          id="technicalMale"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="technicalFemale"
          >Technical Female:</label
        >
        <input
          v-model="formData.technicalFemale"
          type="number"
          id="technicalFemale"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
      </div>
      <!-- Add similar input fields for other categories of non-teaching staff -->
    </div>

    <!-- Standards -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Standards</h3>
      <!-- Dynamically generate form fields for standards based on data from master -->
      <button
        v-if="isEditing"
        @click="addStandard"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Standard
      </button>
    </div>

    <!-- Supporting Documents -->
    <div class="mb-4 border p-4 rounded">
      <h3 class="font-semibold mb-2">Supporting Documents</h3>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="supportingDocument"
          >Supporting Document:</label
        >
        <input
          type="file"
          id="supportingDocument"
          @change="handleSupportingDocumentUpload"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        />
        <span v-if="formData.supportingDocumentName" class="text-sm text-gray-500"
          >Selected file: {{ formData.supportingDocumentName }}</span
        >
      </div>
      <div class="mb-2">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="supportingDocumentRemarks"
          >Remarks (if any):</label
        >
        <textarea
          v-model="formData.supportingDocumentRemarks"
          id="supportingDocumentRemarks"
          rows="2"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :disabled="!isEditing"
        ></textarea>
      </div>
      <button
        v-if="isEditing"
        @click="addSupportingDocument"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Add Supporting Document
      </button>
    </div>

    <!-- Add review, assessor, site visit and results from before-->

    <!-- Buttons -->
    <div class="flex justify-end">
      <button
        @click="closeModal"
        class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Cancel
      </button>
      <button
        v-if="isEditing"
        @click="saveAsDraft"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Save as Draft
      </button>
      <button
        v-if="!isEditing"
        @click="enableEditing"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Edit
      </button>
      <button
        v-if="isEditing"
        @click="saveData"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        Save
      </button>
      <button
        @click="viewApplication"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        View
      </button>
      <button
        @click="submitApplication"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

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
  formData.supportingDocumentName = file.name
}

const closeModal = () => {
  emit('close')
}

const saveData = () => {
  const payload = {
    ...props.application, // Keep the original application data
    ...formData, // Override with form data
  }
  emit('save', payload)
  isEditing.value = false // Disable editing after saving
}

const enableEditing = () => {
  isEditing.value = true // Enable editing mode
}
const saveAsDraft = () => {
  alert('saving')
}
const submitApplication = () => {
  alert('saving')
}

const viewApplication = () => {
  isEditing.value = false
  //Implement what happens with the view appication, maybe display or smth
}

const addProgram = () => {}
// const addAssessor = () => {
//   //logic to do
// }

// const addSiteVisit = () => {
//   //logic to do
// }
// const addResult = () => {
//   //logic to do
// }
const addStandard = () => {
  //logic to do
}
const addSupportingDocument = () => {
  //logic to do
}
</script>
