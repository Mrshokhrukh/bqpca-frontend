<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Student Enrolled</h1>
      <p class="text-gray-600">Please fill in the details below for Student Enrollment.</p>
    </div>
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm" ref="studentForm">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="student_ecpf_name" class="block text-sm font-medium text-gray-700">ECPF Name:</label>
              <input id="student_ecpf_name" type="text" v-model="formData.ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled />
            </div>
            <div>
              <label for="student_branch_ecpf" class="block text-sm font-medium text-gray-700">Branch ECPF:</label>
              <select id="student_branch_ecpf" v-model="formData.branch_ecpf"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Branch</option>
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                  {{ branch.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Institute Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="student_institute"
                class="block text-sm font-medium text-gray-700">Institute/College/University:</label>
              <select id="student_institute" v-model="formData.institute"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Institute</option>
                <option v-for="institute in institutes" :key="institute.id" :value="institute.id">
                  {{ institute.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="student_state_city" class="block text-sm font-medium text-gray-700">State/City:</label>
              <input id="student_state_city" type="text" v-model="formData.state_city"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled />
            </div>
            <div>
              <label for="student_country" class="block text-sm font-medium text-gray-700">Country:</label>
              <input id="student_country" type="text" v-model="formData.country"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled />
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Student Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="student_cid_passport" class="block text-sm font-medium text-gray-700">CID/Passport:</label>
              <input id="student_cid_passport" type="text" v-model="formData.cid_passport" @blur="searchAndValidateCID"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <p v-if="cidValidationError" class="text-red-500 text-xs mt-1">
                {{ cidValidationError }}
              </p>
            </div>
            <div>
              <label for="student_full_name" class="block text-sm font-medium text-gray-700">Full Name:</label>
              <input id="student_full_name" type="text" v-model="formData.full_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="student_date_of_birth" type="date" v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <select id="student_gender" v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label for="student_current_occupation" class="block text-sm font-medium text-gray-700">Current
                Occupation:</label>
              <input id="student_current_occupation" type="text" v-model="formData.current_occupation"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_email_address" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input id="student_email_address" type="email" v-model="formData.email_address" @blur="validateEmail"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <p v-if="emailValidationError" class="text-red-500 text-xs mt-1">
                {{ emailValidationError }}
              </p>
            </div>
            <div>
              <label for="student_course_full_name" class="block text-sm font-medium text-gray-700">Course (full
                name):</label>
              <input id="student_course_full_name" type="text" v-model="formData.course_full_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_programme_level" class="block text-sm font-medium text-gray-700">Programme
                Level:</label>
              <input id="student_programme_level" type="text" v-model="formData.programme_level"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_programme_type" class="block text-sm font-medium text-gray-700">Programme
                Type:</label>
              <select id="student_programme_type" v-model="formData.programme_type"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Programme Type</option>
                <option value="TVET">TVET</option>
                <option value="Higher">Higher</option>
              </select>
            </div>
            <div>
              <label for="student_programme_duration" class="block text-sm font-medium text-gray-700">Programme Duration
                (in Year):</label>
              <input id="student_programme_duration" type="number" v-model="formData.programme_duration"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_course_start_date" class="block text-sm font-medium text-gray-700">Course Start
                Date:</label>
              <input id="student_course_start_date" type="date" v-model="formData.course_start_date"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_course_end_date" class="block text-sm font-medium text-gray-700">Course End
                Date:</label>
              <input id="student_course_end_date" type="date" v-model="formData.course_end_date"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="student_dependent_number" class="block text-sm font-medium text-gray-700">Number of
                Dependents:</label>
              <input id="student_dependent_number" type="number" v-model="formData.dependent_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <!-- Conditional Guardian Details -->
            <template v-if="isMinor">
              <div>
                <label for="student_guardian_contact" class="block text-sm font-medium text-gray-700">Contact of
                  Guardian:</label>
                <input id="student_guardian_contact" type="number" v-model="formData.guardian_contact"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label for="student_guardian_email" class="block text-sm font-medium text-gray-700">Email of
                  Guardian:</label>
                <input id="student_guardian_email" type="email" v-model="formData.guardian_email"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </template>

            <div>
              <!-- <label for="student_b2b_ecpf" class="block text-sm font-medium text-gray-700">Name of ECPF with linkage
                (if processed through B2B):</label> -->
              <select id="student_b2b_ecpf" v-model="formData.b2b_ecpf"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select ECPF</option>
                <option v-for="ecpf in ecpfs" :key="ecpf.id" :value="ecpf.id">
                  {{ ecpf.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <div class="flex justify-end space-x-4">
          <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import apiServices from '@/services/services' //  the correct path

// --- Form Data ---
const formData = ref({
  ecpf_name: '',
  branch_ecpf: null,
  institute: null,
  state_city: '',
  country: '',
  cid_passport: '',
  full_name: '',
  date_of_birth: '',
  gender: '',
  current_occupation: '',
  email_address: '',
  course_full_name: '',
  programme_level: '',
  programme_type: null,
  programme_duration: '',
  course_start_date: '',
  course_end_date: '',
  dependent_number: '',
  guardian_contact: '',
  guardian_email: '',
  b2b_ecpf: null,
})

const emailValidationError = ref('')
const cidValidationError = ref('')

// --- Master Data ---
const branches = ref([])
const institutes = ref([])
const ecpfs = ref([])

// --- Computed Properties ---
const isMinor = computed(() => {
  if (!formData.value.date_of_birth) return false
  const dob = new Date(formData.value.date_of_birth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age < 18
})

// --- Emits ---
const emit = defineEmits(['student-data-submitted']) // Emit event

// --- Functions ---
const fetchMasterData = async () => {
  try {
    //  API calls here.  Example:
    // const branchResponse = await apiServices.getBranches();
    // branches.value = branchResponse.data;
    branches.value = [
      // Placeholder data
      { id: 'b1', name: 'Branch 1' },
      { id: 'b2', name: 'Branch 2' },
    ]
    institutes.value = [
      // Placeholder
      { id: 'i1', name: 'Institute 1' },
      { id: 'i2', name: 'Institute 2' },
    ]
    ecpfs.value = [
      // Placeholder
      { id: 'e1', name: 'ECPF A' },
      { id: 'e2', name: 'ECPF B' },
    ]
  } catch (error) {
    console.error('Error fetching master data:', error)
    alert('Failed to load master data. Please refresh the page.')
  }
}

const submitForm = async () => {
  if (!validateForm()) return

  try {
    const dataToSubmit = prepareDataForSubmission() // No await needed
    const response = await apiServices.submitStudentData(dataToSubmit) //  API

    if (response.status === 201) {
      alert('Student data submitted successfully!')
      emit('student-data-submitted') // Emit event
      resetForm()
    } else {
      alert('An error occurred while submitting student data.')
      console.error('API Error:', response)
    }
  } catch (error) {
    alert('An unexpected error occurred.')
    console.error('Student Submission Error:', error)
  }
}

const prepareDataForSubmission = () => {
  return { ...formData.value } // Simple copy (no files)
}

const validateForm = () => {
  let isValid = true

  if (!formData.value.ecpf_name) {
    alert('ECPF Name is required.')
    isValid = false
  }
  if (!formData.value.institute) {
    alert('Institute is required.')
    isValid = false
  }
  if (!formData.value.cid_passport) {
    alert('CID/Passport is required.')
    isValid = false
  }
  if (cidValidationError.value) {
    alert('CID/Passport is already being used by another ECPF firm')
    isValid = false
  }
  if (!formData.value.full_name) {
    alert('Full Name is required.')
    isValid = false
  }
  if (!formData.value.date_of_birth) {
    alert('Date of Birth is required.')
    isValid = false
  }
  if (!formData.value.gender) {
    alert('gender is required')
    isValid = false
  }
  if (!formData.value.email_address || emailValidationError.value) {
    alert('Please enter a valid Email Address.')
    isValid = false
  }
  if (!formData.value.course_full_name) {
    alert('Course Full Name is required.')
    isValid = false
  }
  if (!formData.value.programme_type) {
    alert('Programme Type is required.')
    isValid = false
  }
  if (!formData.value.programme_duration) {
    alert('Programme Duration is required.')
    isValid = false
  }
  if (!formData.value.course_start_date) {
    alert('Course Start Date is required.')
    isValid = false
  }
  if (!formData.value.course_end_date) {
    alert('Course End Date is required.')
    isValid = false
  }
  if (isMinor.value) {
    if (!formData.value.guardian_contact) {
      alert('Guardian Contact is required for minors.')
      isValid = false
    }
    if (!formData.value.guardian_email) {
      alert('Guardian Email is required for minors.')
      isValid = false
    }
  }

  return isValid
}

const resetForm = () => {
  formData.value = {
    ecpf_name: '',
    branch_ecpf: null,
    institute: null,
    state_city: '',
    country: '',
    cid_passport: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    current_occupation: '',
    email_address: '',
    course_full_name: '',
    programme_level: '',
    programme_type: null,
    programme_duration: '',
    course_start_date: '',
    course_end_date: '',
    dependent_number: '',
    guardian_contact: '',
    guardian_email: '',
    b2b_ecpf: null,
  }
  emailValidationError.value = ''
  cidValidationError.value = ''
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailValidationError.value = emailRegex.test(formData.value.email_address)
    ? ''
    : 'Invalid email format.'
}

const searchAndValidateCID = async () => {
  const cid = formData.value.cid_passport
  if (!cid) {
    cidValidationError.value = 'CID/Passport is required'
    return
  }

  try {
    // 1. Try to get user details (from census/passport DB)
    const userDetails = await apiServices.getStudentByCidOrPassport(cid) //  API
    if (userDetails.data) {
      formData.value.full_name = userDetails.data.name
      formData.value.date_of_birth = userDetails.data.dob
      formData.value.gender = userDetails.data.gender
    }

    // 2. Check for duplicates within ECPF
    const isDuplicate = await apiServices.isCidDuplicateWithinEcpf({
      cid: cid,
      ecpfId: formData.value.ecpf_name, //  ECPF ID
      formType: 'student', //  form type
    })

    cidValidationError.value = isDuplicate
      ? 'This CID/Passport is already registered with this ECPF.'
      : ''
  } catch (error) {
    console.error('Error during CID/Passport search/validation:', error)
    cidValidationError.value = 'Error validating CID/Passport.'
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchMasterData()
  //  ECPF name (replace with your actual logic to get the logged-in ECPF)
  const loggedInEcpf = { id: 'ecpf123', name: 'Demo ECPF' } // Example
  formData.value.ecpf_name = loggedInEcpf.name
})

// --- Watchers ---
watch(
  () => formData.value.cid_passport,
  (newCidPassport) => {
    if (newCidPassport) {
      searchAndValidateCID()
    }
  },
)

watch(
  () => formData.value.institute,
  async (newInstituteId) => {
    if (newInstituteId) {
      try {
        const instituteDetails = await apiServices.getInstituteDetails(newInstituteId) // your API service
        if (instituteDetails.data) {
          formData.value.state_city = instituteDetails.data.state_city
          formData.value.country = instituteDetails.data.country
        }
      } catch (error) {
        console.error('Error fetching institute details', error)
      }
    } else {
      //reset the auto populated values
      formData.value.state_city = ''
      formData.value.country = ''
    }
  },
)
</script>
