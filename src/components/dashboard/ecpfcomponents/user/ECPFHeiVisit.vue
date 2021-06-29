<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
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
              <input type="text" v-model="eventType" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>
        <!-- Current ECPF Details -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Current ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
              <input type="text" :value="ecpfDetails.name" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" :value="ecpfDetails.location" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
              <input type="text" :value="ecpfDetails.proprietor" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID</label>
              <input type="text" :value="ecpfDetails.cid" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input type="text" :value="ecpfDetails.contactNo" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" :value="ecpfDetails.email" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>

        <hr class="my-8" />

        <!-- Proposed Promotion Event - HEI Visit -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">
            Proposed Promotion Event - HEI Visit
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Institute</label>
              <select v-model="selectedInstitute"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>Select an institute</option>
                <option v-for="institute in availableInstitutes" :key="institute.id" :value="institute.id">
                  {{ institute.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Programme Detail (visit detail)</label>
              <input type="text" v-model="eventDetails.programDetail"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="eventDetails.description" rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Purpose</label>
              <input type="text" v-model="eventDetails.purpose"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">From Date</label>
              <input type="date" v-model="eventDetails.fromDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">To Date</label>
              <input type="date" v-model="eventDetails.toDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Others (specify)</label>
              <input type="text" v-model="eventDetails.others"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Authorization Letter</label>
              <div class="flex items-center space-x-2">
                <input type="text" :value="eventDetails.supportingDocument
                  ? eventDetails.supportingDocument
                  : 'No file chosen'
                  " readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleSupportingDocumentUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- NEW: Add Representative Button -->
        <!-- Representatives List -->
        <div class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Representatives</h2>
          <div v-for="(rep, index) in representatives" :key="rep.id" class="mb-6 p-4 border rounded-lg bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" v-model="rep.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Passport No.</label>
                <input type="text" v-model="rep.passport_no"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nationality</label>
                <input type="text" v-model="rep.nationality"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Arrival Date</label>
                <input type="date" v-model="rep.arrival_date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Departure Date</label>
                <input type="date" v-model="rep.departure_date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CV</label>
                <div class="flex items-center space-x-2">
                  <input type="text" :value="rep.cv_filename ? rep.cv_filename : 'No file chosen'" readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <input type="file" @change="event => handleCvUpload(event, index)" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">ID Document</label>
                <div class="flex items-center space-x-2">
                  <input type="text" :value="rep.id_doc_filename ? rep.id_doc_filename : 'No file chosen'" readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <input type="file" @change="event => handleIdDocUpload(event, index)" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Authorization Letter</label>
                <div class="flex items-center space-x-2">
                  <input type="text" :value="rep.auth_letter_filename ? rep.auth_letter_filename : 'No file chosen'"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <input type="file" @change="event => handleAuthLetterUpload(event, index)" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button type="button" @click="removeRepresentative(index)"
                class="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                v-if="representatives.length > 1">
                Remove
              </button>
            </div>
          </div>
          <button type="button" @click="addRepresentative"
            class="w-full px-6 py-3 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 border-2 border-dashed border-green-700 hover:border-green-800">
            + Add Another Representative
          </button>
        </div>
        <!-- Remarks -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Remarks</h2>
          <textarea v-model="remarks" rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </section>

        <!-- Submit Button -->
        <div class="mt-6 flex justify-end">
          <button type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
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
import apiService from '@/services/ecpfServices.js' // Assuming your API service is here

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
const countryOptions = ref([]) // Array to hold country options

const eventDetails = reactive({
  programDetail: '',
  description: '',
  purpose: '',
  fromDate: '',
  toDate: '',
  others: '',
})

const remarks = ref('')

// --- NEW: Dynamic Data for multiple representatives ---
let nextRepId = 1
const createNewRepresentative = () => ({
  id: nextRepId++,
  name: '',
  passport_no: '',
  nationality: '',
  arrival_date: '',
  departure_date: '',
  cv_filename: '',
  cv_file: null,
  id_doc_filename: '',
  id_doc_file: null,
  auth_letter_filename: '',
  auth_letter_file: null,
})

const representatives = reactive([createNewRepresentative()])

// --- Representative Management Methods ---
const addRepresentative = () => {
  representatives.push(createNewRepresentative())
}

const removeRepresentative = (index) => {
  if (representatives.length > 1) {
    representatives.splice(index, 1)
  } else {
    toast.warning('You must have at least one representative.')
  }
}

// --- File Handlers ---
const handleCvUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    representatives[index].cv_filename = file.name
    representatives[index].cv_file = file
  }
}

const handleIdDocUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    representatives[index].id_doc_filename = file.name
    representatives[index].id_doc_file = file
  }
}

const handleAuthLetterUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    representatives[index].auth_letter_filename = file.name
    representatives[index].auth_letter_file = file
  }
}

// --- Form Submission ---
const submitForm = async () => {
  // Basic validation
  if (!selectedInstitute.value) {
    toast.error('Please select an institute.')
    return
  }
  if (!eventDetails.fromDate || !eventDetails.toDate) {
    toast.error('Please select both an event start and end date.')
    return
  }
  for (const [index, rep] of representatives.entries()) {
    if (!rep.name || !rep.passport_no || !rep.nationality) {
      toast.error(`Please fill in all required details for Representative #${index + 1}.`)
      return
    }
  }

  const formData = new FormData()

  // Append ECPF and Event details
  formData.append('ecpf_details', JSON.stringify(ecpfDetails)) // Sending as a JSON string
  formData.append('institute_id', selectedInstitute.value)
  formData.append('event_details', JSON.stringify(eventDetails)) // Sending as a JSON string
  formData.append('remarks', remarks.value)

  // Append Representative details and files
  // Note: Backend needs to be able to parse this structure
  representatives.forEach((rep, index) => {
    formData.append(`representatives[${index}][name]`, rep.name)
    formData.append(`representatives[${index}][passport_no]`, rep.passport_no)
    formData.append(`representatives[${index}][nationality]`, rep.nationality)
    formData.append(`representatives[${index}][arrival_date]`, rep.arrival_date)
    formData.append(`representatives[${index}][departure_date]`, rep.departure_date)
    if (rep.cv_file) {
      formData.append(`representatives[${index}][cv]`, rep.cv_file, rep.cv_filename)
    }
    if (rep.id_doc_file) {
      formData.append(`representatives[${index}][id_document]`, rep.id_doc_file, rep.id_doc_filename)
    }
    if (rep.auth_letter_file) {
      formData.append(`representatives[${index}][auth_letter]`, rep.auth_letter_file, rep.auth_letter_filename)
    }
  })

  console.log('Submitting form data:', Object.fromEntries(formData.entries()))

  // API call
  try {
    const response = await apiService.createEcpfPromotionalHeiVisit(formData)
    console.log('Registration successful:', response.data)
    toast.success('HEI visit promotion registered successfully!')
    // Reset form or redirect as needed
    // Reset form example:
    selectedInstitute.value = ''
    Object.assign(eventDetails, { programDetail: '', description: '', purpose: '', fromDate: '', toDate: '', others: '' })
    representatives.splice(0, representatives.length, createNewRepresentative())
    remarks.value = ''

  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to register the HEI visit promotion.')
    if (error.response) {
      console.error('Error details:', error.response.data)
      toast.error(`Error: ${JSON.stringify(error.response.data)}`)
    }
  }
}

// Fetch initial data on component mount
onMounted(async () => {
  try {
    const [institutesResponse, countriesResponse, ecpfResponse] = await Promise.all([
      apiService.getMasterInstitutesCollegesUniversities(),
      apiService.getCountries(),
      apiService.getEcpfDetails()
    ]);

    availableInstitutes.value = institutesResponse.data.results
    countryOptions.value = countriesResponse.data

    if (ecpfResponse.data) {
      Object.assign(ecpfDetails, ecpfResponse.data)
    } else {
      toast.error('Failed to load ECPF details.')
    }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    toast.error('Failed to load required data. Please refresh the page.')
  }
})
</script>
