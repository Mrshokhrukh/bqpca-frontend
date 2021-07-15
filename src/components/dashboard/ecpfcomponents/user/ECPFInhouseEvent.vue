<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">In-House Event Registration</h1>
      <p class="text-gray-600">
        Register for one or more in-house promotional events, with one institute and one
        representative per event.
      </p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <!-- Current ECPF Details (Remains the same) -->
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

        <!-- Spacer -->
        <hr class="my-8" />

        <!-- NEW: Repeating section for each Institute -->
        <div
          v-for="(instituteEvent, index) in instituteEvents"
          :key="instituteEvent.id"
          class="mb-6 p-6 border border-gray-300 rounded-xl relative bg-gray-50/50"
        >
          <!-- Block Header with Remove Button -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">Institute & Event #{{ index + 1 }}</h2>
            <button
              v-if="instituteEvents.length > 1"
              type="button"
              @click="removeInstituteEvent(index)"
              class="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>

          <!-- Proposed In-House Event Details -->
          <section class="mb-8">
            <h3 class="text-lg font-medium mb-4 text-gray-700">Proposed In-House Event Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Institute</label>
                <select
                  v-model="instituteEvent.instituteId"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Institute</option>
                  <option
                    v-for="institute in availableInstitutes"
                    :key="institute.id"
                    :value="institute.id"
                  >
                    {{ institute.InstituteCollegeUniversityName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Event Name</label>
                <input
                  type="text"
                  v-model="instituteEvent.eventDetails.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Event Description</label>
                <textarea
                  v-model="instituteEvent.eventDetails.description"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Event Purpose</label>
                <input
                  type="text"
                  v-model="instituteEvent.eventDetails.purpose"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Event Location</label>
                <input
                  type="text"
                  v-model="instituteEvent.eventDetails.location"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </section>

          <!-- Representative Details (One per institute) -->
          <section>
            <h3 class="text-lg font-medium mb-4 text-gray-700">Representative Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  v-model="instituteEvent.representative.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Passport No.</label>
                <input
                  type="text"
                  v-model="instituteEvent.representative.passport_no"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nationality</label>
                <select
                  v-model="instituteEvent.representative.nationality"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Nationality</option>
                  <option
                    v-for="country in countryOptions"
                    :key="country.code"
                    :value="country.code"
                  >
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Arrival Date</label>
                <input
                  type="date"
                  v-model="instituteEvent.representative.arrival_date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Departure Date</label>
                <input
                  type="date"
                  v-model="instituteEvent.representative.departure_date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CV of Representative</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    :value="instituteEvent.representative.cv || 'No file chosen'"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <input type="file" @change="handleCvUpload($event, index)" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Passport copy or Identification Document</label
                >
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    :value="instituteEvent.representative.affiliation_letter || 'No file chosen'"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <input
                      type="file"
                      @change="handleAffiliationLetterUpload($event, index)"
                      class="hidden"
                    />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Authorization Letter</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    :value="instituteEvent.representative.authorization_letter || 'No file chosen'"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <input
                      type="file"
                      @change="handleAuthorizationLetterUpload($event, index)"
                      class="hidden"
                    />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- NEW: Add Institute Button -->
        <div class="mt-8 mb-8">
          <button
            type="button"
            @click="addInstituteEvent"
            class="w-full px-6 py-3 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 border-2 border-dashed border-green-700 hover:border-green-800"
          >
            + Add Another Institute
          </button>
        </div>

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
            class="px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Register All Events
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/ecpfServices.js'

const toast = useToast()

// --- Static Data ---
const ecpfDetails = reactive({
  name: '',
  location: '',
  proprietor: '',
  cid: '',
  contactNo: '',
  email: '',
})
const availableInstitutes = ref([])
const countryOptions = ref([])
const remarks = ref('')

// --- NEW: Dynamic Data for multiple institutes ---
let nextInstituteId = 1
const createNewInstituteEvent = () => ({
  id: nextInstituteId++,
  instituteId: '',
  eventDetails: { name: '', description: '', purpose: '', location: '' },
  representative: {
    name: '',
    passport_no: '',
    nationality: '',
    arrival_date: '',
    departure_date: '',
    cv: '',
    affiliation_letter: '',
    authorization_letter: '',
  },
})

const instituteEvents = reactive([createNewInstituteEvent()])

// --- Methods ---

// Institute & Event Management
const addInstituteEvent = () => {
  instituteEvents.push(createNewInstituteEvent())
}

const removeInstituteEvent = (index) => {
  if (instituteEvents.length > 1) {
    instituteEvents.splice(index, 1)
  } else {
    toast.warning('You must register at least one institute.')
  }
}

// File Handlers (updated to work with the new data structure)
const handleCvUpload = (event, index) => {
  const file = event.target.files[0]
  instituteEvents[index].representative.cv = file ? file.name : ''
}

const handleAffiliationLetterUpload = (event, index) => {
  const file = event.target.files[0]
  instituteEvents[index].representative.affiliation_letter = file ? file.name : ''
}
const handleAuthorizationLetterUpload = (event, index) => {
  const file = event.target.files[0]
  instituteEvents[index].representative.authorization_letter = file ? file.name : ''
}

// Form Submission (updated to handle the array of events)
const submitForm = async () => {
  // Basic validation loop
  for (const [index, event] of instituteEvents.entries()) {
    if (!event.instituteId || !event.eventDetails.name || !event.eventDetails.location) {
      toast.error(`Please fill in all required event details for Institute #${index + 1}.`)
      return
    }
    if (
      !event.representative.name ||
      !event.representative.passport_no ||
      !event.representative.nationality
    ) {
      toast.error(`Please fill in all required representative details for Institute #${index + 1}.`)
      return
    }
  }

  // NOTE: The payload structure is now different.
  // Your backend API will need to be adjusted to accept an array of 'events'.
  const payload = {
    ecpf_details: ecpfDetails,
    events: instituteEvents.map((event) => ({
      institute: event.instituteId,
      event_details: event.eventDetails,
      representative: event.representative,
    })),
    remarks: remarks.value,
  }

  console.log('Submitting form:', payload)

  // API call
  try {
    // You might need a new API endpoint or to update the existing one for this payload
    await apiService.createEcpfPromotionalInhouseEvent(payload)
    toast.success('In-house events registered successfully!')

    // Reset form to its initial state
    instituteEvents.splice(0, instituteEvents.length, createNewInstituteEvent())
    remarks.value = ''
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to register the in-house events.')
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
      apiService.getEcpfDetails(),
    ])

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
