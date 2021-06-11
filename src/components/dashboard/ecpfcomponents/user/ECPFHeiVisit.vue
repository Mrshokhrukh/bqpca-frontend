<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">HEI Representative Visit Promotion Registration</h1>
      <p class="text-gray-600">Register a promotional visit for one or more representatives from a single institute.</p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
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
          <h2 class="text-2xl font-semibold mb-6 text-gray-800">
            Proposed Promotion Event Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Institute</label>
              <select v-model="selectedInstitute"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Select an institute</option>
                <option v-for="institute in availableInstitutes" :key="institute.id" :value="institute.id">
                  {{ institute.InstituteCollegeUniversityName }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Programme Detail (Visit Detail)</label>
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
              <label class="block text-sm font-medium text-gray-700">Others (Specify)</label>
              <input type="text" v-model="eventDetails.others"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Event Start Date</label>
              <input type="date" v-model="eventDetails.fromDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Event End Date</label>
              <input type="date" v-model="eventDetails.toDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>

        <hr class="my-8" />

        <!-- NEW: Repeating section for each Representative -->
        <div v-for="(representative, index) in representatives" :key="representative.id"
          class="mb-6 p-6 border border-gray-300 rounded-xl relative bg-gray-50/50">

          <!-- Block Header with Remove Button -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">Representative #{{ index + 1 }}</h2>
            <button v-if="representatives.length > 1" type="button" @click="removeRepresentative(index)"
              class="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Remove
            </button>
          </div>

          <!-- Representative Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" v-model="representative.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Passport No.</label>
              <input type="text" v-model="representative.passport_no"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nationality</label>
              <select v-model="representative.nationality"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Select Nationality</option>
                <option v-for="country in countryOptions" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Arrival Date</label>
              <input type="date" v-model="representative.arrival_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Departure Date</label>
              <input type="date" v-model="representative.departure_date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CV of Representative</label>
              <div class="flex items-center space-x-2">
                <input type="text" :value="representative.cv_filename || 'No file chosen'" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleCvUpload($event, index)" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Passport copy or Identification Document</label>
              <div class="flex items-center space-x-2">
                <input type="text" :value="representative.id_doc_filename || 'No file chosen'" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleIdDocUpload($event, index)" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Authorization Letter</label>
              <div class="flex items-center space-x-2">
                <input type="text" :value="representative.auth_letter_filename || 'No file chosen'" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleAuthLetterUpload($event, index)" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- NEW: Add Representative Button -->
        <div class="mt-8 mb-8">
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
            class="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
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

// --- Static Data ---
const ecpfDetails = reactive({ name: '', location: '', proprietor: '', cid: '', contactNo: '', email: '' })
const availableInstitutes = ref([])
const countryOptions = ref([])
const remarks = ref('')

// --- Event Data ---
const selectedInstitute = ref('')
const eventDetails = reactive({
  programDetail: '',
  description: '',
  purpose: '',
  fromDate: '',
  toDate: '',
  others: '',
})

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
    // Ensure you have an API endpoint that can handle this FormData structure
    await apiService.createEcpfPromotionalHeiVisit(formData)
    toast.success('HEI Representative Visit promotion registered successfully!')

    // Reset form to initial state
    selectedInstitute.value = ''
    Object.assign(eventDetails, { programDetail: '', description: '', purpose: '', fromDate: '', toDate: '', others: '' })
    representatives.splice(0, representatives.length, createNewRepresentative())
    remarks.value = ''

  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to register the promotion.')
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
