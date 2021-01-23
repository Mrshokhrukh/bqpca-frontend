<template>
  <div class="max-w-1/2 mx-auto p-6 bg-white rounded-lg shadow">
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Applicant Details Section -->
      <div class="border rounded-lg p-4 space-y-4">
        <h2 class="text-xl font-bold">Applicant Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Registration Number</label>
            <input type="text" v-model="form.registrationNumber" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
            <input type="text" v-model="form.cidNumber" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" v-model="form.fullName" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Agency/Training Location</label>
            <input type="text" v-model="form.agency" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
        </div>
      </div>

      <!-- Application Details Section -->
      <div class="border rounded-lg p-4 space-y-4">
        <h2 class="text-xl font-bold">Application Details</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Is CPD approved?</label>
            <div class="mt-2 space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="form.isCpdApproved" :value="true" class="form-radio"/>
                <span class="ml-2">Yes</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="form.isCpdApproved" :value="false" class="form-radio"/>
                <span class="ml-2">No</span>
              </label>
            </div>
          </div>

          <div v-if="form.isCpdApproved" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Approval Type</label>
              <select v-model="form.approvalType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">Select approval type</option>
                <!-- Add options here -->
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Approval Letter</label>
              <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" class="mt-1 block w-full"/>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title of CPD</label>
              <input type="text" v-model="form.cpdTitle" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">From Date</label>
                <input type="date" v-model="form.fromDate" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">To Date</label>
                <input type="date" v-model="form.toDate" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button type="button" @click="saveDraft" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Save as Draft
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
        <button type="button" @click="cancel" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  // Applicant Details
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  agency: '',

  // Application Details
  isCpdApproved: false,
  approvalType: '',
  cpdTitle: '',
  venue: '',
  fromDate: '',
  toDate: '',

  // CPD Provider Details
  providingAgency: '',
  otherAgency: '',
  conductingReason: '',
  reasonDetails: '',

  // Resource Person Details
  resourcePersons: [],

  // Teaching Learning Method
  cpdType: '',
  methodologies: '',
  expectedOutcome: '',
  activity: '',
  durationHours: 0,
  credit: 0,

  // Participants Details
  participationCategory: '',
  participantSubCategory: '',
  numberOfParticipants: 0,
  relevance: '',
  attachments: []
})

const handleSubmit = async () => {
  try {
    // Add your submission logic here
    console.log('Form submitted:', form)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const saveDraft = () => {
  // Add your draft saving logic here
  console.log('Saving draft:', form)
}

const cancel = () => {
  // Add your cancel logic here
  console.log('Form cancelled')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  // Add your file handling logic here
  console.log('File uploaded:', file)
}

// Computed property for credit calculation based on hours
const calculateCredit = (hours) => {
  // Add your credit calculation logic here
  return hours // Placeholder calculation
}
</script>

<style scoped>
.form-radio {
  @apply h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500;
}

input[type="text"],
input[type="number"],
input[type="date"],
select,
textarea {
  @apply focus:ring-blue-500 focus:border-blue-500;
}
</style>
