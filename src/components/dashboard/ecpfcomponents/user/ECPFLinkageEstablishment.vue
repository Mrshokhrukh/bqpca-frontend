<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Linkage Establishment</h1>
      <p class="text-gray-600">
        Submit details for establishing linkages with Higher Education Institutions (HEIs).
      </p>
    </div>


    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitApplication">
        <!-- ECPF Details (Read-Only) - Remains the same -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">ECPF Details (Read-Only)</h2>
          <div v-if="loadingEcpfDetails" class="text-center py-6">
            <div class="flex flex-col items-center space-y-2">
              <svg
                class="animate-spin h-6 w-6 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p class="text-gray-500 text-sm">Loading ECPF details...</p>
            </div>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of the ECPF</label>
              <input
                type="text"
                :value="ecpfDetails.name"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Proprietor of the ECPF</label>
              <input
                type="text"
                :value="ecpfDetails.proprietor"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID of the Proprietor</label>
              <input
                type="text"
                :value="ecpfDetails.cid"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location of ECPF</label>
              <input
                type="text"
                :value="ecpfDetails.location"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input
                type="text"
                :value="ecpfDetails.contactNo"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                :value="ecpfDetails.email"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </section>

        <!-- Institute Linkages Section - Updated Fields -->
        <div v-for="(linkage, index) in linkages" :key="index" class="mb-10 border-b pb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-700">
              Institute Linkage #{{ index + 1 }} Details
            </h2>
            <button
              v-if="linkages.length > 1"
              type="button"
              @click="removeLinkage(index)"
              class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name of HEI -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Name of HEI</label
              >
              <input
                type="text"
                v-model="linkage.name_of_hei"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <!-- Official Website -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Official Website</label
              >
              <input
                type="url"
                v-model="linkage.official_website"
                required
                placeholder="https://example.com"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field">Location</label>
              <input
                type="text"
                v-model="linkage.location"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <!-- Country -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field">Country</label>
              <select
                v-model="linkage.country"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option disabled value="">Select Country</option>
                <option v-for="c in countryOptions" :key="c.code" :value="c.code">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <!-- Year of Establishment -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Year of Establishment</label
              >
              <input
                type="number"
                v-model.number="linkage.year_of_establishment"
                required
                placeholder="YYYY"
                min="1000"
                :max="new Date().getFullYear()"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <!-- Recognised By -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Recognised By</label
              >
              <input
                type="text"
                v-model="linkage.recognised_by"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <!-- Note: Translation/Edit provision requires more complex UI implementation -->
            </div>
            <!-- Accredited By -->
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Accredited By</label
              >
              <input
                type="text"
                v-model="linkage.accreditated_by"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <!-- Note: Translation/Edit provision requires more complex UI implementation -->
            </div>
            <!-- Affiliation (Optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Affiliation to (if applicable)</label
              >
              <input
                type="text"
                v-model="linkage.affiliation"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <!-- Approval from professional bodies (Optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Approval from relevant professional bodies (if relevant)</label
              >
              <input
                type="text"
                v-model="linkage.professional_body_approval"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <!-- Report Document (Optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Report on visit / collaboration</label
              >
              <input
                type="file"
                @change="handleFileUpload($event, index, 'reportDoc')"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <span v-if="linkage.reportDocName" class="text-xs text-gray-600 mt-1 block">
                Selected: {{ linkage.reportDocName }}
              </span>
              <p class="mt-1 text-xs text-gray-500">Upload if available.</p>
            </div>

          </div>
        </div>


        <div class="mt-6 mb-8">
          <button
            type="button"
            @click="addLinkage"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add More Linkage
          </button>
        </div>


        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Program/Course Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Name of Programme</label
              >
              <input
                type="text"
                v-model="programDetails.name_of_programme"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field">Level</label>
              <input
                type="text"
                v-model="programDetails.level"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Minimum Credit</label
              >
              <input
                type="number"
                v-model.number="programDetails.minimum_credit"
                required
                min="0"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Qualification Type</label
              >
              <select
                v-model="programDetails.qualification_type"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option disabled value="">Select Qualification Type</option>
                <option v-for="q in qualificationTypes" :key="q.id" :value="q.id">
  {{ q.qualification_name }}
</option>
              </select>
            </div>

          </div>
        </section>

        <!-- Remarks (Overall Application) - Added -->
        <div class="mb-6">
          <label for="applicationRemarks" class="block text-sm font-medium text-gray-700"
            >Remarks (Optional)</label
          >
          <textarea
            id="applicationRemarks"
            v-model="applicationRemarks"
            rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter any overall remarks for this application"
          ></textarea>
        </div>

        <!-- Declaration -->
        <div class="mt-8 mb-6">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="declarationAccepted"
              class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 required-field">
              I hereby declare that the information provided is true and correct to the best of my
              knowledge.
            </span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="mt-10 flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelForm"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveApplicationAsDraft"
            :disabled="!atLeastOneLinkageIsValidForDraft() || loadingEcpfDetails"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!isFormValid() || loadingEcpfDetails"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Submit Application
          </button>
          <!-- Note: Payment redirection logic is not implemented here, needs clarification if required for this form -->
        </div>
      </form>
    </div>
    <!-- Existing Proposals Section (Optional) -->
    <section
      v-if="applicationIdToEdit"
      class="mt-10 bg-white rounded-xl p-8 shadow-sm border border-gray-100"
    >
      <h2 class="text-lg font-medium mb-4 text-gray-700">Manage Existing Linkage Proposals</h2>
      <p class="text-gray-500">
        Feature to view, edit, or delete existing draft proposals will be implemented here.
      </p>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { countryData } from '@/constants/countries.js'


const toast = useToast()
const authStore = useAuthStore()

const loadingEcpfDetails = ref(true)

const ecpfDetails = reactive({
  id: null,
  name: '',
  proprietor: '',
  cid: '',
  location: '',
  contactNo: '',
  email: '',
})

const props = defineProps({
  applicationIdToEdit: { type: String, default: null },
})

const linkages = ref([])
const countryOptions = ref([])
const declarationAccepted = ref(false)
const applicationRemarks = ref('') // Added state for overall remarks
const programDetails = reactive({
  name_of_programme: '',
  level: '',
  minimum_credit: null,
  qualification_type: '', // Will hold the selected ID
})
const qualificationTypes = ref([]) // For dropdown options

// --- Updated Linkage Object Structure based on new requirements ---
const createNewLinkageEntry = () => ({
  id: null,
  name_of_hei: '', // Required
  official_website: '', // Required
  location: '', // Required
  country: '', // Required
  year_of_establishment: null, // Required
  recognised_by: '', // Required Text
  accreditated_by: '', // Required Text
  affiliation: '', // Optional Text
  professional_body_approval: '', // Optional Text (NEW)
  reportDoc: null, // Optional File
  reportDocName: '', // Optional File Name
  // REMOVED: approvalDoc, approvalDocName, mouDoc, mouDocName, mou_validity
})
// --- End Updated Structure ---

const addLinkage = () => {
  linkages.value.push(createNewLinkageEntry())
}

const removeLinkage = (index) => {
  linkages.value.splice(index, 1)
}

onMounted(async () => {
  loadingEcpfDetails.value = true
  // Fetch ECPF Details (Existing logic)
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Authentication required.')
      ecpfDetails.id = null
    } else if (!authStore.user.cid) {
      toast.error('User CID not found.')
      ecpfDetails.id = null
    } else {
      const response = await apiService.getEcpfDetailsByCID(authStore.user.cid)
      const fetchedEcpfData = response.data
      if (fetchedEcpfData) {
        ecpfDetails.id = fetchedEcpfData.id
        ecpfDetails.name =
          fetchedEcpfData.institute_name ||
          fetchedEcpfData.name ||
          fetchedEcpfData.firm_name ||
          'N/A'
        const locationParts =
          [fetchedEcpfData.dzongkhag, fetchedEcpfData.gewog, fetchedEcpfData.village]
            .filter(Boolean)
            .join(', ') ||
          fetchedEcpfData.location ||
          'N/A'
        ecpfDetails.location = locationParts
        ecpfDetails.proprietor = fetchedEcpfData.proprietor_name || authStore.fullName || 'N/A'
        ecpfDetails.cid = fetchedEcpfData.cid || authStore.user.cid || 'N/A'
        ecpfDetails.contactNo = fetchedEcpfData.contact_no || authStore.contactNumber || 'N/A'
        ecpfDetails.email = fetchedEcpfData.email_address || authStore.email || 'N/A'
      } else {
        toast.error('Could not fetch ECPF details.')
        ecpfDetails.id = null
      }
    }
  } catch (error) {
    console.error('Error fetching ECPF:', error)
    toast.error('Failed ECPF load.')
    ecpfDetails.id = null
  } finally {
    loadingEcpfDetails.value = false
  }

  // Populate Country Options
  try {
    countryOptions.value = countryData
  } catch (error) {
    console.error('Error loading countries:', error)
    toast.error('Failed country load.')
    countryOptions.value = []
  }

  // Load qualification types for dropdown
  try {
  const res = await apiService.getMastersEcpfQualifications()
  qualificationTypes.value = res.data.results || []
} catch (error) {
  console.error('Error loading qualification types:', error)
  toast.error('Failed to load qualification types.')
  qualificationTypes.value = []
}

  // Initial setup
  if (props.applicationIdToEdit) {
    /* ... load draft logic ... */
  } else {
    if (linkages.value.length === 0) {
      addLinkage()
    }
  }
})

const handleFileUpload = (event, index, fieldPrefix) => {
  const file = event.target.files[0]
  const fileProp = `${fieldPrefix}`
  const nameProp = `${fieldPrefix}Name`
  if (file) {
    linkages.value[index][fileProp] = file
    linkages.value[index][nameProp] = file.name
  } else {
    linkages.value[index][fileProp] = null
    linkages.value[index][nameProp] = ''
  }
}

// --- Updated Validation based on new requirements ---
const isFormValid = () => {
  if (!declarationAccepted.value) return false
  if (linkages.value.length === 0) return false
  if (!ecpfDetails.id) {
    toast.error('ECPF Details not loaded. Cannot validate form.')
    return false
  }

  // Check each linkage against the *new* required fields
  return linkages.value.every(
    (link) =>
      link.name_of_hei &&
      link.official_website &&
      link.location &&
      link.country &&
      link.year_of_establishment && // Check if null/0 is allowed or needs specific handling
      link.recognised_by &&
      link.accreditated_by,
    // REMOVED Checks: approvalDoc, mouDoc, mou_validity
    // Optional fields (affiliation, professional_body_approval, reportDoc) are not checked here
  )
}

const atLeastOneLinkageIsValidForDraft = () => {
  if (linkages.value.length === 0) return false
  if (!ecpfDetails.id) return false
  // Draft is valid if at least one linkage has some basic info
  return linkages.value.some(
    (link) => link.name_of_hei || link.location || link.country || link.official_website,
  )
}
// --- End Updated Validation ---

const submitApplication = async () => {
  if (!ecpfDetails.id) {
    toast.error('ECPF Profile ID missing.')
    return
  }
  if (!isFormValid()) {
    // This now covers the declaration checkbox and required HEI fields
    toast.error('Please accept the declaration and fill all required fields for each linkage.')
    return
  }
  // --- ADDED: Validation for the Program/Course Details section ---
  if (
    !programDetails.name_of_programme ||
    !programDetails.level ||
    programDetails.minimum_credit === null || // Explicitly check for null
    !programDetails.qualification_type
  ) {
    toast.error('Please fill all required Program/Course Details fields.')
    return
  }

  let allSubmissionsSuccessful = true

  for (const [index, linkage] of linkages.value.entries()) {
    const formData = new FormData()

    // --- Append ECPF and Linkage Details (Your existing code) ---
    formData.append('ecpf_profile', ecpfDetails.id)
    formData.append('name_of_hei', linkage.name_of_hei)
    formData.append('official_website', linkage.official_website)
    formData.append('location', linkage.location)
    formData.append('country', linkage.country)
    if (linkage.year_of_establishment) {
      formData.append('year_of_establishment', linkage.year_of_establishment)
    }
    formData.append('recognised_by', linkage.recognised_by)
    formData.append('accreditated_by', linkage.accreditated_by)
    if (linkage.affiliation) {
      formData.append('affiliation', linkage.affiliation)
    }
    if (linkage.reportDoc) {
      formData.append('report', linkage.reportDoc)
    }
    if (applicationRemarks.value) {
      // NOTE: Your backend must be configured to handle a 'remarks' field
      // associated with the main linkage object.
      formData.append('remarks', applicationRemarks.value)
    }
    formData.append('status', 'submitted')

    // --- THE FIX: Append the Program/Course Details as a nested array object ---
    // The [0] tells the backend to create an array named 'courses' and put this object at index 0.
    formData.append('courses[0][name_of_programme]', programDetails.name_of_programme)
    formData.append('courses[0][level]', programDetails.level)
    formData.append('courses[0][minimum_credit]', programDetails.minimum_credit)
    formData.append('courses[0][qualification_type]', programDetails.qualification_type)
    // --- END OF FIX ---

    try {
      console.log(`Submitting Linkage ${index + 1}:`, Object.fromEntries(formData.entries())) // For debugging
      await apiService.createEcpfLinkageEstablishment(formData)
    } catch (error) {
      allSubmissionsSuccessful = false
      console.error(`Error submitting linkage for ${linkage.name_of_hei}:`, error)
      let errorMsg = `Failed to submit: ${linkage.name_of_hei}.`
      if (error.response && error.response.data) {
        // This formats backend validation errors nicely
        const backendErrors = Object.entries(error.response.data)
          .map(([field, messages]) => {
             // Handle nested course errors like "courses.0.name_of_programme"
             const cleanField = field.replace(/courses\.\d+\./, 'Course ');
             return `${cleanField}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          })
          .join('; ')
        errorMsg += backendErrors ? ` Details: ${backendErrors}` : ` ${error.response.data.detail || 'An unknown error occurred.'}`
      }
      toast.error(errorMsg, { timeout: 8000 })
      break // Stop processing further linkages if one fails
    }
  }

  if (allSubmissionsSuccessful) {
    toast.success('Application submitted successfully!')
    resetForm()
  } else {
    toast.warning('Submission process stopped due to an error. Please review the message.')
  }
}

const saveApplicationAsDraft = async () => {
  if (!ecpfDetails.id) {
    toast.error('ECPF Profile ID missing.')
    return
  }
  if (!atLeastOneLinkageIsValidForDraft()) {
    toast.error('Please provide identifying info (like a name) for at least one linkage to save a draft.')
    return
  }

  let allDraftsSuccessful = true

  for (const [index, linkage] of linkages.value.entries()) {
    // Skip saving completely empty linkage forms
    if (!linkage.name_of_hei && !linkage.location && !linkage.country && !linkage.official_website) {
      continue
    }

    const formData = new FormData()

    // --- Append ECPF and Linkage Details ---
    formData.append('ecpf_profile', ecpfDetails.id)
    formData.append('name_of_hei', linkage.name_of_hei || '')
    formData.append('official_website', linkage.official_website || '')
    formData.append('location', linkage.location || '')
    formData.append('country', linkage.country || '')
    if (linkage.year_of_establishment) {
      formData.append('year_of_establishment', linkage.year_of_establishment)
    }
    formData.append('recognised_by', linkage.recognised_by || '')
    formData.append('accreditated_by', linkage.accreditated_by || '')
    if (linkage.affiliation) {
      formData.append('affiliation', linkage.affiliation)
    }
    if (linkage.reportDoc) {
      formData.append('report', linkage.reportDoc)
    }
     if (applicationRemarks.value) {
      formData.append('remarks', applicationRemarks.value)
    }
    formData.append('status', 'draft')

    // --- THE FIX: Append any available Program/Course Details for the draft ---
    if (programDetails.name_of_programme) {
      formData.append('courses[0][name_of_programme]', programDetails.name_of_programme)
    }
    if (programDetails.level) {
      formData.append('courses[0][level]', programDetails.level)
    }
    if (programDetails.minimum_credit !== null) {
      formData.append('courses[0][minimum_credit]', programDetails.minimum_credit)
    }
    if (programDetails.qualification_type) {
      formData.append('courses[0][qualification_type]', programDetails.qualification_type)
    }
    // --- END OF FIX ---

    try {
      // The API endpoint should handle both create and update based on if an ID is sent
      // This assumes createEcpfLinkageEstablishment is the correct endpoint for both
      await apiService.createEcpfLinkageEstablishment(formData)
    } catch (error) {
      allDraftsSuccessful = false
      console.error(`Error saving draft for ${linkage.name_of_hei || 'Unnamed'}:`, error)
      toast.error(`Failed to save draft for ${linkage.name_of_hei || 'Unnamed'}. ${error.response?.data?.detail || ''}`)
      break
    }
  }

  if (allDraftsSuccessful) {
    toast.info('Application saved as draft successfully!')
  } else {
    toast.error('Some drafts failed to save.')
  }
}

const cancelForm = () => {
  const hasData =
    linkages.value.some(
      (l) =>
        l.name_of_hei ||
        l.official_website ||
        l.location ||
        l.country ||
        l.year_of_establishment ||
        l.recognised_by ||
        l.accreditated_by ||
        l.affiliation ||
        l.professional_body_approval ||
        l.reportDocName,
    ) || applicationRemarks.value // Check remarks too

  if (hasData || declarationAccepted.value) {
    if (confirm('Discard changes?')) {
      resetForm()
    }
  } else {
    resetForm()
  }
}

const resetForm = () => {
  linkages.value = []
  addLinkage() // Add one blank entry back
  declarationAccepted.value = false
  applicationRemarks.value = '' // Reset remarks
}
</script>

<style scoped>
.required-field::after {
  content: ' *';
  color: red;
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
</style>
