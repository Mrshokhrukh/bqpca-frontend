<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-3xl sm:w-full max-h-[90vh] flex flex-col"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-xl leading-6 font-semibold text-gray-900">
          Manage Complaint: {{ localComplaint.id }}
        </h3>
      </div>

      <form @submit.prevent="handleSubmit" class="overflow-y-auto flex-grow">
        <div class="p-6 space-y-6">
          <div>
            <h4 class="text-md font-medium text-gray-700 mb-1">Complainant Details</h4>
            <p class="text-sm text-gray-600">
              <strong>Name:</strong> {{ localComplaint.complainantName }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Email:</strong> {{ localComplaint.complainantEmail }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Date Received:</strong> {{ formatDate(localComplaint.dateReceived) }}
            </p>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-700 mb-1">Complaint Information</h4>
            <p class="text-sm text-gray-600">
              <strong>Subject:</strong> {{ localComplaint.subject }}
            </p>
            <div class="mt-1">
              <p class="text-sm font-medium text-gray-600"><strong>Description:</strong></p>
              <p class="text-sm text-gray-500 whitespace-pre-wrap bg-gray-50 p-2 rounded-md">
                {{ localComplaint.description }}
              </p>
            </div>
          </div>

          <hr />

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700"
              >Update Status</label
            >
            <select
              id="status"
              v-model="localComplaint.status"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option v-for="status in complaintStatuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <div>
            <h4 class="text-md font-medium text-gray-700 mb-2">Assign Professionals Involved</h4>
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                v-model="professionalSearchQuery"
                placeholder="Search by CID or Reg. No."
                class="flex-grow p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              <button
                type="button"
                @click="searchProfessionals"
                :disabled="professionalSearchLoading"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {{ professionalSearchLoading ? 'Searching...' : 'Search' }}
              </button>
            </div>
            <div
              v-if="professionalSearchResults.length > 0"
              class="mt-2 border rounded-md max-h-40 overflow-y-auto"
            >
              <ul>
                <li
                  v-for="prof in professionalSearchResults"
                  :key="prof.id"
                  class="p-2 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span>{{ prof.name }} ({{ prof.registrationNumber }})</span>
                  <button
                    type="button"
                    @click="assignProfessional(prof)"
                    class="text-sm text-green-600 hover:text-green-800"
                    :disabled="isProfessionalAssigned(prof.id)"
                  >
                    {{ isProfessionalAssigned(prof.id) ? 'Assigned' : 'Assign' }}
                  </button>
                </li>
              </ul>
            </div>
            <div v-if="professionalSearchError" class="text-sm text-red-500 mt-1">
              {{ professionalSearchError }}
            </div>

            <div class="mt-3">
              <h5 class="text-sm font-medium text-gray-600 mb-1">Currently Assigned:</h5>
              <ul
                v-if="
                  localComplaint.professionalsInvolved &&
                  localComplaint.professionalsInvolved.length > 0
                "
                class="space-y-1"
              >
                <li
                  v-for="prof in localComplaint.professionalsInvolved"
                  :key="prof.id"
                  class="p-2 bg-gray-100 rounded-md flex justify-between items-center text-sm"
                >
                  <span>{{ prof.name }} ({{ prof.registrationNumber }})</span>
                  <button
                    type="button"
                    @click="removeProfessional(prof.id)"
                    class="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500 italic">No professionals assigned yet.</p>
            </div>
          </div>

          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Remarks (optional)</label
            >
            <textarea
              id="remarks"
              v-model="localComplaint.remarks"
              rows="3"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add any internal remarks or notes for the complainant if status changes..."
            ></textarea>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  complaint: Object,
  complaintStatuses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'updated'])

// --- Mock Professionals Data for Search ---
const allMockProfessionals = [
  { id: 'PROF001', name: 'Dr. Alice Wonderland', cid: 'CID111', registrationNumber: 'REG111' },
  { id: 'PROF002', name: 'Mr. Bob The Builder', cid: 'CID222', registrationNumber: 'REG222' },
  { id: 'PROF003', name: 'Ms. Carol Danvers', cid: 'CID333', registrationNumber: 'REG333' },
  { id: 'PROF004', name: 'Dr. Eve Adamson', cid: 'CID444', registrationNumber: 'REG444' },
  { id: 'PROF005', name: 'Prof. Zen Yoda', cid: 'CID555', registrationNumber: 'REG555' },
]

const mockSearchProfessionalsAPI = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve([])
        return
      }
      const lowerQuery = query.toLowerCase()
      const results = allMockProfessionals.filter(
        (p) =>
          p.cid.toLowerCase().includes(lowerQuery) ||
          p.registrationNumber.toLowerCase().includes(lowerQuery) ||
          p.name.toLowerCase().includes(lowerQuery),
      )
      resolve(JSON.parse(JSON.stringify(results)))
    }, 300)
  })
}

// Mock API call to update complaint
const updateComplaintAPI = async (complaintId, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API: Updating complaint ${complaintId} with data:`, data)
      // Simulate mapping complaint status to adverse record status
      let adverseStatus = data.adverseRecordStatus || 'Pending' // Keep existing if not changed
      if (data.status === 'Dismissed' || data.status === 'Resolved - No Action') {
        adverseStatus = 'Closed - No Adverse Finding'
      } else if (data.status === 'Resolved with Action') {
        adverseStatus = 'Adverse Finding - Action Taken'
      } else if (['Received', 'Pending Review'].includes(data.status)) {
        adverseStatus = 'Pending Initial Review'
      } else if (
        ['Under Investigation', 'Additional Info Requested', 'Appealed'].includes(data.status)
      ) {
        adverseStatus = 'Under Investigation/Review'
      }
      const updatedData = { ...data, adverseRecordStatus: adverseStatus }

      console.log(
        `API: Adverse record status for ${complaintId} updated to: ${updatedData.adverseRecordStatus}`,
      )

      if (data.status !== props.complaint.status && data.remarks) {
        console.log(
          `SIMULATING EMAIL to ${props.complaint.complainantEmail}: Status of your complaint ${complaintId} updated to ${data.status}. Remarks: ${data.remarks}`,
        )
        alert(
          `SIMULATING EMAIL to ${props.complaint.complainantEmail}:\nStatus: ${data.status}\nRemarks: ${data.remarks || 'N/A'}`,
        )
      } else if (data.status !== props.complaint.status) {
        console.log(
          `SIMULATING EMAIL to ${props.complaint.complainantEmail}: Status of your complaint ${complaintId} updated to ${data.status}.`,
        )
        alert(`SIMULATING EMAIL to ${props.complaint.complainantEmail}:\nStatus: ${data.status}`)
      }
      resolve({ ...props.complaint, ...updatedData }) // Return the merged updated complaint
    }, 500)
  })
}
// --- End Mock API & Data ---

const localComplaint = reactive({
  id: '',
  complainantName: '',
  complainantEmail: '',
  dateReceived: '',
  subject: '',
  description: '',
  status: '',
  professionalsInvolved: [],
  remarks: '',
  adverseRecordStatus: '',
})

const professionalSearchQuery = ref('')
const professionalSearchResults = ref([])
const professionalSearchLoading = ref(false)
const professionalSearchError = ref('')
const isSubmitting = ref(false)

watch(
  () => props.complaint,
  (newComplaint) => {
    if (newComplaint) {
      Object.assign(localComplaint, JSON.parse(JSON.stringify(newComplaint))) // Deep copy
      professionalSearchQuery.value = ''
      professionalSearchResults.value = []
      professionalSearchError.value = ''
    }
  },
  { immediate: true, deep: true },
)

const closeModal = () => {
  emit('close')
}

const searchProfessionals = async () => {
  if (!professionalSearchQuery.value.trim()) {
    professionalSearchResults.value = []
    professionalSearchError.value = ''
    return
  }
  professionalSearchLoading.value = true
  professionalSearchError.value = ''
  try {
    professionalSearchResults.value = await mockSearchProfessionalsAPI(
      professionalSearchQuery.value,
    )
    if (professionalSearchResults.value.length === 0) {
      professionalSearchError.value = 'No professionals found matching your query.'
    }
  } catch (err) {
    console.error('Error searching professionals:', err)
    professionalSearchError.value = 'Failed to search professionals.'
  } finally {
    professionalSearchLoading.value = false
  }
}

const assignProfessional = (prof) => {
  if (!localComplaint.professionalsInvolved) {
    localComplaint.professionalsInvolved = []
  }
  if (!localComplaint.professionalsInvolved.find((p) => p.id === prof.id)) {
    localComplaint.professionalsInvolved.push(prof)
  }
}

const removeProfessional = (profId) => {
  localComplaint.professionalsInvolved = localComplaint.professionalsInvolved.filter(
    (p) => p.id !== profId,
  )
}

const isProfessionalAssigned = (profId) => {
  return (
    localComplaint.professionalsInvolved &&
    localComplaint.professionalsInvolved.some((p) => p.id === profId)
  )
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Construct data to send
    const updatePayload = {
      status: localComplaint.status,
      remarks: localComplaint.remarks,
      // Send only IDs, assuming backend handles lookup or accepts full objects
      professionalsInvolvedIds: localComplaint.professionalsInvolved.map((p) => p.id),
      // The mock API will derive adverseRecordStatus, but in real scenario you might pass it
      // or the backend handles it based on complaint status
    }

    // In a real app, this would be `localComplaint.professionalsInvolved` if backend expects full objects
    // or just IDs. For the mock, we'll send the full objects and let the API mock handle it.
    const updatedComplaintData = await updateComplaintAPI(localComplaint.id, {
      ...localComplaint, // send the whole localComplaint for easier mock update
      // override with specific fields if API expects that
      status: localComplaint.status,
      remarks: localComplaint.remarks,
      professionalsInvolved: localComplaint.professionalsInvolved, // send full array
    })

    console.log('Complaint update submitted:', localComplaint)
    emit('updated', updatedComplaintData) // Emit the truly updated data from API response
  } catch (error) {
    console.error('Failed to update complaint:', error)
    alert('Error: Could not update complaint. ' + (error.message || ''))
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
/* Scoped styles if needed, Tailwind should cover most */
</style>
