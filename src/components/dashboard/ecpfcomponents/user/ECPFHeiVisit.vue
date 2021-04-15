<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">HEI Visit Promotion Registration</h1>
      <p class="text-gray-600">Register for an HEI visit promotional event.</p>
    </div>
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <!-- Event Type -->
        <section class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Promotional Event Type</label>
              <input
                type="text"
                v-model="eventType"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </section>
        <!-- Current ECPF Details -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Current ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
              <input
                type="text"
                :value="ecpfDetails.name"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                :value="ecpfDetails.location"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
              <input
                type="text"
                :value="ecpfDetails.proprietor"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID</label>
              <input
                type="text"
                :value="ecpfDetails.cid"
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

        <!-- Proposed Promotion Event - HEI Visit -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">
            Proposed Promotion Event - HEI Visit
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Institute</label>
              <select
                v-model="selectedInstitute"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>Select an institute</option>
                <option
                  v-for="institute in availableInstitutes"
                  :key="institute.id"
                  :value="institute.id"
                >
                  {{ institute.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Programme Detail (visit detail)</label
              >
              <input
                type="text"
                v-model="eventDetails.programDetail"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                v-model="eventDetails.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Purpose</label>
              <input
                type="text"
                v-model="eventDetails.purpose"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                v-model="eventDetails.fromDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                v-model="eventDetails.toDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Others (specify)</label>
              <input
                type="text"
                v-model="eventDetails.others"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Supporting Document</label>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  :value="
                    eventDetails.supportingDocument
                      ? eventDetails.supportingDocument
                      : 'No file chosen'
                  "
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <input type="file" @change="handleSupportingDocumentUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Remarks -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Remarks</h2>
          <textarea
            v-model="remarks"
            rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </section>

        <!-- Submit Button -->
        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Register Event
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services' // Import your API service

const toast = useToast()

const eventType = ref('HEI Visit') // Set the fixed event type

// --- Data ---
const ecpfDetails = reactive({
  // Replace with actual data fetching if needed
  name: 'Example ECPF', // Replace with actual ECPF data source
  location: 'Thimphu',
  proprietor: 'John Doe',
  cid: '1234567890',
  contactNo: '+975-17123456',
  email: 'john.doe@example.com',
})

const selectedInstitute = ref('') // Single institute selection
const availableInstitutes = ref([]) // Array to hold institutes fetched from API

const eventDetails = reactive({
  programDetail: '',
  description: '',
  purpose: '',
  fromDate: '',
  toDate: '',
  others: '',
  supportingDocument: null, // Store filename (you might need to handle file upload differently based on backend)
})

const remarks = ref('')
const supportingDocFile = ref(null)

// --- Methods ---
const handleSupportingDocumentUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    eventDetails.supportingDocument = file.name // Store the filename for display
    supportingDocFile.value = file // Store the File object for later upload
  } else {
    eventDetails.supportingDocument = null
    supportingDocFile.value = null
  }
}

const submitForm = async () => {
  // Basic validation
  if (!selectedInstitute.value) {
    toast.error('Please select an institute.')
    return
  }

  if (!eventDetails.fromDate || !eventDetails.toDate) {
    toast.error('Please select both from and to dates.')
    return
  }

  if (eventDetails.fromDate > eventDetails.toDate) {
    toast.error('From Date cannot be greater than To Date.')
    return
  }

  const formData = new FormData() // Use FormData to handle file uploads
  formData.append('event_type', eventType.value) // Assuming backend expects 'event_type'
  formData.append('ecpf_name', ecpfDetails.name) // Assuming backend expects 'ecpf_name' and so on for other ecpfDetails
  formData.append('ecpf_location', ecpfDetails.location)
  formData.append('ecpf_proprietor', ecpfDetails.proprietor)
  formData.append('ecpf_cid', ecpfDetails.cid)
  formData.append('ecpf_contact_no', ecpfDetails.contactNo)
  formData.append('ecpf_email', ecpfDetails.email)
  formData.append('institute_id', selectedInstitute.value) // Assuming backend expects 'institute_id'
  formData.append('program_detail', eventDetails.programDetail)
  formData.append('description', eventDetails.description)
  formData.append('purpose', eventDetails.purpose)
  formData.append('from_date', eventDetails.fromDate) // Ensure dates are in correct format if needed
  formData.append('to_date', eventDetails.toDate)
  formData.append('others', eventDetails.others)
  formData.append('remarks', remarks.value)
  if (supportingDocFile.value) {
    formData.append('supporting_document', supportingDocFile.value) // 'supporting_document' is the field name backend expects
  }

  console.log('Submitting form data:', Object.fromEntries(formData.entries())) // Log FormData content for debugging

  // API call
  try {
    const response = await apiServices.createEcpfPromotionalHeiVisit(formData)
    console.log('Registration successful:', response.data)
    toast.success('HEI visit promotion registered successfully!')
    // Reset form or redirect as needed
    // Reset form example:
    selectedInstitute.value = ''
    eventDetails.programDetail = ''
    eventDetails.description = ''
    eventDetails.purpose = ''
    eventDetails.fromDate = ''
    eventDetails.toDate = ''
    eventDetails.others = ''
    eventDetails.supportingDocument = null
    supportingDocFile.value = null
    remarks.value = ''
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to register the HEI visit promotion.')
    if (error.response) {
      console.error('Error details:', error.response.data) // Log detailed error from backend
      toast.error(`Error: ${error.response.data.message || 'Please check the form data'}`) // Display backend error message if available
    }
  }
}

onMounted(async () => {
  try {
    const response = await apiServices.getInstitutes()
    availableInstitutes.value = response.data // Assuming response.data is an array of institutes
  } catch (error) {
    console.error('Error fetching institutes:', error)
    toast.error('Failed to load institutes.')
  }
})
</script>
