<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Education Fair Registration</h1>
      <p class="text-gray-600">Register your ECPF for the upcoming education fair.</p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <!-- Current ECPF Details (Read-Only) -->
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

        <!-- Proposed Fair Details -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Proposed Fair Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fair Name</label>
              <input
                type="text"
                v-model="fairDetails.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fair Description</label>
              <textarea
                v-model="fairDetails.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fair Location</label>
              <input
                type="text"
                v-model="fairDetails.location"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </section>

        <!-- Representative Details -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Representative Details (Maximum 2)</h2>
          <div
            v-for="(rep, index) in representatives"
            :key="index"
            class="mb-4 p-4 border border-gray-200 rounded-md"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  v-model="rep.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Passport No.</label>
                <input
                  type="text"
                  v-model="rep.passportNo"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nationality</label>
                <select
                  v-model="rep.nationality"
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
                  v-model="rep.arrivalDate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Departure Date</label>
                <input
                  type="date"
                  v-model="rep.departureDate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CV of Representative</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    :value="rep.cvFileName ? rep.cvFileName : 'No file chosen'"
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
            </div>
            <button
              v-if="representatives.length > 1"
              type="button"
              @click="removeRepresentative(index)"
              class="mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="addRepresentative"
            :disabled="representatives.length >= 2"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Representative
          </button>
        </section>

        <!-- Participating Institute Details -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Participating Institute Details</h2>
          <div
            v-for="(institute, index) in participatingInstitutes"
            :key="index"
            class="mb-4 p-4 border border-gray-200 rounded-md"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Name of the Institution</label
                >
                <select
                  v-model="institute.instituteId"
                  @change="onInstituteSelect(index)"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Institution</option>
                  <option v-for="inst in availableInstitutes" :key="inst.id" :value="inst.id">
                    {{ inst.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  v-model="institute.location"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Zone/State</label>
                <input
                  type="text"
                  v-model="institute.zone"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  v-model="institute.country"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Institute Website</label>
                <input
                  type="text"
                  v-model="institute.website"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Contact (focal person)</label
                >
                <input
                  type="text"
                  v-model="institute.contact"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">College Affiliated to</label>
                <input
                  type="text"
                  v-model="institute.affiliation"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Type of University</label>
                <select
                  v-model="institute.universityType"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select Type</option>
                  <option v-for="type in universityTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Recognition Code (if any)</label
                >
                <input
                  type="text"
                  v-model="institute.recognitionCode"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Accredited By</label>
                <input
                  type="text"
                  v-model="institute.accreditedBy"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <!-- Course Offered Details -->
              <div
                v-for="(course, courseIndex) in institute.courses"
                :key="courseIndex"
                class="nested-form"
              >
                <label class="block text-sm font-medium text-gray-700"
                  >Course Offered (intend to admit student course only)</label
                >
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    v-model="course.name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <button
                    v-if="institute.courses.length > 1"
                    type="button"
                    @click="removeCourse(index, courseIndex)"
                    class="mt-2 px-2 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Remove Course
                  </button>
                </div>
              </div>
              <button
                type="button"
                @click="addCourse(index)"
                class="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Course
              </button>
              <div>
                <label class="block text-sm font-medium text-gray-700">Authorization Letter</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    :value="
                      institute.authorizationLetterFileName
                        ? institute.authorizationLetterFileName
                        : 'No file chosen'
                    "
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <input
                      type="file"
                      @change="handleAuthorizationUpload($event, index)"
                      class="hidden"
                    />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
              <button
                v-if="participatingInstitutes.length > 1"
                type="button"
                @click="removeInstitute(index)"
                class="mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Remove Institute
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="addInstitute"
            class="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Institute
          </button>
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
            Register for Fair
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const toast = useToast()

// --- Data ---
const ecpfDetails = reactive({
  // Replace with actual data fetching if needed from backend based on logged in ECPF
  name: 'Example ECPF', // Static example data, replace with dynamic data if needed
  location: 'Thimphu',
  proprietor: 'John Doe',
  cid: '1234567890',
  contactNo: '+975-17123456',
  email: 'john.doe@example.com',
})

const fairDetails = reactive({
  name: '',
  description: '',
  location: '',
})

const representatives = reactive([
  {
    name: '',
    passportNo: '',
    nationality: '',
    arrivalDate: '',
    departureDate: '',
    cvFile: null,
    cvFileName: null,
  }, // cvFile to store the actual file, cvFileName for display
])
const countryOptions = ref([])

const availableInstitutes = ref([])
const universityTypes = ref(['Public', 'Private', 'Deemed'])
const participatingInstitutes = reactive([
  {
    instituteId: '',
    location: '',
    zone: '',
    country: '',
    website: '',
    contact: '',
    affiliation: '',
    universityType: '',
    recognitionCode: '',
    courses: [{ name: '' }],
    accreditedBy: '',
    authorizationLetterFile: null, // Store the actual file
    authorizationLetterFileName: null, // Store filename for display
  },
])

const remarks = ref('')

// --- Methods ---

// Representatives
const addRepresentative = () => {
  if (representatives.length < 2) {
    representatives.push({
      name: '',
      passportNo: '',
      nationality: '',
      arrivalDate: '',
      departureDate: '',
      cvFile: null,
      cvFileName: null,
    })
  }
}

const removeRepresentative = (index) => {
  representatives.splice(index, 1)
}

const handleCvUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    representatives[index].cvFile = file // Store the file object
    representatives[index].cvFileName = file.name // Store file name for display
  } else {
    representatives[index].cvFileName = null
    representatives[index].cvFile = null
  }
}

//Institutes
const addInstitute = () => {
  participatingInstitutes.push({
    instituteId: '',
    location: '',
    zone: '',
    country: '',
    website: '',
    contact: '',
    affiliation: '',
    universityType: '',
    recognitionCode: '',
    courses: [{ name: '' }],
    accreditedBy: '',
    authorizationLetterFile: null,
    authorizationLetterFileName: null,
  })
}

const removeInstitute = (index) => {
  participatingInstitutes.splice(index, 1)
}

// Course
const addCourse = (instituteIndex) => {
  participatingInstitutes[instituteIndex].courses.push({ name: '' })
}

const removeCourse = (instituteIndex, courseIndex) => {
  participatingInstitutes[instituteIndex].courses.splice(courseIndex, 1)
}

const handleAuthorizationUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    participatingInstitutes[index].authorizationLetterFile = file // Store the file object
    participatingInstitutes[index].authorizationLetterFileName = file.name // Store filename for display
  } else {
    participatingInstitutes[index].authorizationLetterFileName = null
    participatingInstitutes[index].authorizationLetterFile = null
  }
}

// Inst selection

const onInstituteSelect = async (index) => {
  const instituteId = participatingInstitutes[index].instituteId
  if (!instituteId) {
    Object.assign(participatingInstitutes[index], {
      location: '',
      zone: '',
      country: '',
      website: '',
      contact: '',
      accreditedBy: '',
    })
    return
  }

  try {
    const instituteData = availableInstitutes.value.find((inst) => inst.id === instituteId)

    if (instituteData) {
      Object.assign(participatingInstitutes[index], {
        location: instituteData.location,
        zone: instituteData.zone,
        country: instituteData.country,
        website: instituteData.website,
        contact: instituteData.contact,
        accreditedBy: instituteData.accredited_by, // Assuming backend field is accredited_by
      })
    } else {
      toast.error('Institute details not found.')
    }
  } catch (error) {
    console.error('Error fetching institute details:', error)
    toast.error('Failed to fetch institute details.')
  }
}

const submitForm = async () => {
  // Basic validation - same as before
  if (!fairDetails.name || !fairDetails.location) {
    toast.error('Please fill in all required fair details.')
    return
  }
  if (representatives.some((rep) => !rep.name || !rep.passportNo || !rep.nationality)) {
    toast.error('Please fill in all required representative details.')
    return
  }
  if (
    participatingInstitutes.some(
      (inst) => !inst.instituteId || inst.courses.some((course) => !course.name),
    )
  ) {
    toast.error('Please fill in all required institute and course details.')
    return
  }

  const formData = new FormData()

  // Fair Details
  formData.append('fair_name', fairDetails.name) // Adjust field names to match backend
  formData.append('fair_description', fairDetails.description)
  formData.append('fair_location', fairDetails.location)

  // Representative Details
  representatives.forEach((rep, index) => {
    formData.append(`representatives[${index}][name]`, rep.name)
    formData.append(`representatives[${index}][passport_no]`, rep.passportNo) // Adjust field names
    formData.append(`representatives[${index}][nationality]`, rep.nationality)
    formData.append(`representatives[${index}][arrival_date]`, rep.arrivalDate)
    formData.append(`representatives[${index}][departure_date]`, rep.departureDate)
    if (rep.cvFile) {
      formData.append(`representatives[${index}][cv]`, rep.cvFile) // Send the file object
    }
  })

  // Participating Institute Details
  participatingInstitutes.forEach((inst, index) => {
    formData.append(`participating_institutes[${index}][institute_id]`, inst.instituteId) // Assuming you send institute_id
    formData.append(`participating_institutes[${index}][affiliation]`, inst.affiliation)
    formData.append(`participating_institutes[${index}][university_type]`, inst.universityType) // Adjust field names
    formData.append(`participating_institutes[${index}][recognition_code]`, inst.recognitionCode)
    inst.courses.forEach((course, courseIndex) => {
      formData.append(
        `participating_institutes[${index}][courses][${courseIndex}][name]`,
        course.name,
      )
    })
    if (inst.authorizationLetterFile) {
      formData.append(
        `participating_institutes[${index}][authorization_letter]`,
        inst.authorizationLetterFile,
      ) // Send file object
    }
  })

  // Remarks
  formData.append('remarks', remarks.value)

  try {
    // Fixed: Either don't assign the result to a variable, or use the variable
    await apiService.createEcpfEducationFair(formData) // Using await without storing the response

    toast.success('Successfully registered for the fair!')
    // Reset form or redirect as needed
    fairDetails.name = ''
    fairDetails.description = ''
    fairDetails.location = ''
    representatives.splice(0, representatives.length) // Clear representatives array
    representatives.push({
      name: '',
      passportNo: '',
      nationality: '',
      arrivalDate: '',
      departureDate: '',
      cvFile: null,
      cvFileName: null,
    }) // Add back initial representative
    participatingInstitutes.splice(0, participatingInstitutes.length) // Clear institutes
    participatingInstitutes.push({
      // Add back initial institute
      instituteId: '',
      location: '',
      zone: '',
      country: '',
      website: '',
      contact: '',
      affiliation: '',
      universityType: '',
      recognitionCode: '',
      courses: [{ name: '' }],
      accreditedBy: '',
      authorizationLetterFile: null,
      authorizationLetterFileName: null,
    })
    remarks.value = ''
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to register for the fair.')
    if (error.response) {
      console.log('Detailed error response:', error.response.data) // Log detailed error response for debugging
      toast.error(`Validation Error: ${JSON.stringify(error.response.data)}`) // Display validation errors if available
    }
  }
}

onMounted(async () => {
  try {
    // Fetch countries
    const countriesResponse = await apiService.getCountries()
    countryOptions.value = countriesResponse.data

    //Fetch Available institute
    const institutesResponse = await apiService.getAvailableInstitutes()
    availableInstitutes.value = institutesResponse.data
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error('Failed to load initial data.')
  }
})
</script>

<style scoped>
/* Add this if you want to visually separate nested form sections */
.nested-form {
  @apply ml-8; /* Indent nested forms */
}
</style>
