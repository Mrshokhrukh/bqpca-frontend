<template>
  <div class="bg-white border rounded-xl shadow-sm p-6">
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">Add Participants</h3>
      <p class="mt-1 text-sm text-gray-500">Add participants to this approved CPD activity.</p>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex items-center">
          <svg
            class="animate-spin h-8 w-8 text-green-600 mr-3"
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
          <p class="text-lg font-medium text-gray-700">Processing your request...</p>
        </div>
      </div>
    </div>

    <!-- Error Messages -->
    <div
      v-if="validationErrors.length > 0"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-6"
    >
      <h3 class="font-bold">Please fix the following errors:</h3>
      <ul class="list-disc pl-5 mt-2">
        <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mt-6"
    >
      <p class="font-bold">{{ successMessage }}</p>
    </div>

    <div class="p-8">
      <!-- Application Information Summary -->
      <div v-if="cpdApplication" class="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900 mb-2">Application Details</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium text-gray-700">Title:</span>
            {{ cpdApplication.title_of_cpd }}
          </div>
          <div>
            <span class="font-medium text-gray-700">CPD Credits:</span>
            {{ calculatedCredits }}
          </div>
          <div>
            <span class="font-medium text-gray-700">Venue:</span>
            {{ cpdApplication.venue }}
          </div>
          <div>
            <span class="font-medium text-gray-700">Dates:</span>
            {{ formatDate(cpdApplication.from_date) }} to {{ formatDate(cpdApplication.to_date) }}
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h4 class="font-medium text-gray-900">Participants List</h4>
          <div class="text-sm text-gray-600">Total participants: {{ participants.length }}</div>
        </div>

        <div
          v-for="(participant, index) in participants"
          :key="index"
          class="mb-6 p-4 border rounded-lg"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- RegNo -->
            <div class="col-span-1">
              <label :for="`regNo-${index}`" class="block text-sm font-medium text-gray-700">
                Registration Number <span class="text-red-600">*</span>
              </label>
              <input
                type="text"
                :id="`regNo-${index}`"
                v-model="participant.regNo"
                @blur="fetchParticipantDetails(participant)"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
              />
            </div>

            <!-- Name -->
            <div class="col-span-1">
              <label :for="`name-${index}`" class="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                :id="`name-${index}`"
                v-model="participant.name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 bg-gray-50"
                readonly
              />
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              @click="removeParticipant(index)"
              class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            @click="addParticipant"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Participant
          </button>

          <!-- CSV Upload -->
          <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-600">Or import via CSV:</span>
            <input
              type="file"
              id="csv-import"
              accept=".csv"
              @change="handleCsvImport"
              class="text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div class="mt-6">
          <label for="attendanceSheet" class="block text-sm font-medium text-gray-700">
            Attendance Sheet <span class="text-red-600">*</span>
          </label>
          <input
            type="file"
            id="attendanceSheet"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            @change="handleAttendanceSheetUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <p class="text-xs text-gray-500 mt-1">
            Accepted file formats: PDF, DOC, DOCX, JPG, JPEG, PNG (max 5MB)
          </p>
          <div v-if="attendanceSheetName" class="mt-2 text-sm text-green-600">
            Selected file: {{ attendanceSheetName }}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 flex justify-end space-x-4 p-8">
      <button
        type="button"
        @click="handleSaveDraft"
        :disabled="loading"
        class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        Save as Draft
      </button>
      <button
        type="button"
        @click="handleSubmit"
        :disabled="loading"
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        Submit
      </button>
      <button
        type="button"
        @click="handleCancel"
        :disabled="loading"
        class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiservice from '@/services/mhpcservices'

const props = defineProps({
  cpdId: {
    type: Number,
    required: true,
  },
  calculatedCredits: {
    type: Number,
    default: 0,
  },
})

const router = useRouter()
const toast = useToast()

// Local state
const participants = ref([{ regNo: '', name: '' }])
const attendanceSheet = ref(null)
const attendanceSheetName = ref('')
const loading = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const cpdApplication = ref(null)

// Methods
const fetchParticipantDetails = async (participant) => {
  if (!participant.regNo || participant.regNo.trim() === '') return

  try {
    loading.value = true

    // Try to fetch participant details from API
    const response = await apiservice.getMhpcApplicationsByCid('')

    if (response.data && Array.isArray(response.data)) {
      // Try to find a matching registration
      const match = response.data.find((app) => app.registration_no === participant.regNo)

      if (match) {
        participant.name = match.full_name || 'Unknown'
      } else {
        // If not found, allow manual entry
        const manualName = prompt(
          `Participant with registration number ${participant.regNo} not found. Please enter the name manually:`,
        )
        if (manualName) {
          participant.name = manualName
        } else {
          participant.name = ''
          toast.warning('No name provided for participant')
        }
      }
    }
  } catch (error) {
    console.error('Error fetching participant details:', error)
    toast.error('Failed to fetch participant details')

    // Allow manual entry
    const manualName = prompt(
      `Failed to fetch details for registration number ${participant.regNo}. Please enter the name manually:`,
    )
    if (manualName) {
      participant.name = manualName
    } else {
      participant.name = ''
    }
  } finally {
    loading.value = false
  }
}

const addParticipant = () => {
  participants.value.push({ regNo: '', name: '' })
}

const removeParticipant = (index) => {
  participants.value.splice(index, 1)

  // Make sure we always have at least one participant row
  if (participants.value.length === 0) {
    addParticipant()
  }
}

const handleAttendanceSheetUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type and size
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ]

  if (!validTypes.includes(file.type)) {
    toast.error('Please upload a valid file (PDF, DOC, DOCX, JPG, JPEG, or PNG)')
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB')
    event.target.value = ''
    return
  }

  attendanceSheet.value = file
  attendanceSheetName.value = file.name
}

const handleCsvImport = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.type !== 'text/csv' && file.name.split('.').pop().toLowerCase() !== 'csv') {
    toast.error('Please upload a CSV file')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csvData = e.target.result
      const lines = csvData.split('\n')

      // Check for header row and remove it
      const headerRow = lines[0].toLowerCase()
      const startIndex =
        headerRow.includes('reg') ||
        headerRow.includes('registration') ||
        headerRow.includes('name')
          ? 1
          : 0

      const importedParticipants = []

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split(',')
        if (columns.length >= 1) {
          const regNo = columns[0].trim()
          const name = columns.length > 1 ? columns[1].trim() : ''

          if (regNo) {
            importedParticipants.push({ regNo, name })
          }
        }
      }

      if (importedParticipants.length > 0) {
        // Replace empty participants list or append to existing
        if (participants.value.length === 1 && !participants.value[0].regNo) {
          participants.value = importedParticipants
        } else {
          participants.value = [...participants.value, ...importedParticipants]
        }

        toast.success(`Imported ${importedParticipants.length} participants from CSV`)

        // Fetch details for participants with missing names
        importedParticipants.forEach((participant) => {
          if (participant.regNo && !participant.name) {
            fetchParticipantDetails(participant)
          }
        })
      } else {
        toast.error('No valid participant data found in the CSV file')
      }
    } catch (error) {
      console.error('Error parsing CSV:', error)
      toast.error('Error parsing CSV file. Please check the format.')
    }
  }

  reader.readAsText(file)
  event.target.value = '' // Clear the input
}

const validateForm = () => {
  validationErrors.value = []

  // Check if there are participants
  if (participants.value.length === 0) {
    validationErrors.value.push('At least one participant is required')
  }

  // Check if all participants have registration numbers and names
  const invalidParticipants = participants.value.filter((p) => !p.regNo || !p.name)
  if (invalidParticipants.length > 0) {
    validationErrors.value.push('All participants must have registration numbers and names')
  }

  // Check if attendance sheet is uploaded
  if (!attendanceSheet.value) {
    validationErrors.value.push('Attendance sheet is required')
  }

  return validationErrors.value.length === 0
}

const prepareFormData = (isDraft = false) => {
  const formData = new FormData()

  // CPD ID
  formData.append('cpd_task', props.cpdId)

  // Participants as JSON string
  const participantsData = participants.value
    .filter((p) => p.regNo && p.name)
    .map((p) => ({
      participant_reg_no: p.regNo,
      participant_name: p.name,
      cpd_credits: props.calculatedCredits,
      review_status: 'Pending',
    }))

  formData.append('participants', JSON.stringify(participantsData))

  // Attendance sheet
  if (attendanceSheet.value) {
    formData.append('attendance_sheet', attendanceSheet.value)
  }

  // Draft status
  formData.append('is_draft', isDraft)

  return formData
}

const handleSaveDraft = async () => {
  try {
    loading.value = true

    // Minimum validation for draft
    if (participants.value.length === 0 || participants.value.every((p) => !p.regNo)) {
      toast.warning('Please add at least one participant with a registration number')
      return
    }

    const formData = prepareFormData(true)

    // Call API to save participants as draft
    await apiservice.patchMhpcCpdTask(props.cpdId, formData)

    toast.success('Participants saved as draft!')
    successMessage.value = 'Participants saved as draft successfully!'

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('Error saving participants as draft:', error)
    toast.error('Failed to save participants as draft')

    // Handle API error messages
    if (error.response && error.response.data) {
      const errorData = error.response.data
      handleApiErrors(errorData)
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    const formData = prepareFormData(false)

    // Call API to submit participants
    await apiservice.patchMhpcCpdTask(props.cpdId, formData)

    toast.success('Participants submitted successfully!')
    successMessage.value = 'Participants submitted successfully! Redirecting to tracker...'

    // Navigate back to tracker after short delay
    setTimeout(() => {
      router.push('/admin/cpd_cpd_provider/health_certification/cpd_application_tracker')
    }, 2000)
  } catch (error) {
    console.error('Error submitting participants:', error)
    toast.error('Failed to submit participants')

    // Handle API error messages
    if (error.response && error.response.data) {
      const errorData = error.response.data
      handleApiErrors(errorData)
    }
  } finally {
    loading.value = false
  }
}

const handleApiErrors = (errorData) => {
  const errorMessages = []

  // Extract error messages from the response
  if (typeof errorData === 'object') {
    Object.keys(errorData).forEach((key) => {
      const value = errorData[key]
      if (Array.isArray(value)) {
        value.forEach((msg) => errorMessages.push(`${key}: ${msg}`))
      } else if (typeof value === 'string') {
        errorMessages.push(`${key}: ${value}`)
      } else if (typeof value === 'object') {
        Object.keys(value).forEach((subKey) => {
          const subValue = value[subKey]
          if (Array.isArray(subValue)) {
            subValue.forEach((msg) => errorMessages.push(`${key}.${subKey}: ${msg}`))
          } else if (typeof subValue === 'string') {
            errorMessages.push(`${key}.${subKey}: ${subValue}`)
          }
        })
      }
    })
  }

  if (errorMessages.length > 0) {
    validationErrors.value = errorMessages
  }
}

const handleCancel = () => {
  router.push('/admin/cpd_cpd_provider/health_certification/cpd_application_tracker')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// Fetch the CPD application details when component mounts
onMounted(async () => {
  if (props.cpdId) {
    try {
      loading.value = true
      const response = await apiservice.getMhpcCpdTaskById(props.cpdId)

      if (response.data) {
        cpdApplication.value = response.data

        // If there are participants already, load them
        if (response.data.participants && response.data.participants.length > 0) {
          participants.value = response.data.participants.map((p) => ({
            regNo: p.participant_reg_no,
            name: p.participant_name,
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching CPD application:', error)
      toast.error('Failed to load CPD application details')
    } finally {
      loading.value = false
    }
  }
})
</script>
