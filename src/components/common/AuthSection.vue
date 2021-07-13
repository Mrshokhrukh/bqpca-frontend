<!-- src/components/AuthSection.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <!-- Auth Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        @click="activeTab = 'login'"
        class="flex-1 py-4 px-6 text-center font-medium"
        :class="
          activeTab === 'login'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        Login
      </button>
      <button
        @click="activeTab = 'register'"
        class="flex-1 py-4 px-6 text-center font-medium"
        :class="
          activeTab === 'register'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        Register
      </button>
    </div>

    <div class="p-8">
      <!-- Login Section -->
      <div v-if="activeTab === 'login'" class="space-y-6">
        <!-- NDI Login Button -->
        <div class="space-y-4">
          <button
            @click="openNdiLoginModal"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
          >
            <img src="@/assets/ndi-logo.png" alt="NDI" class="h-5 w-5 mr-2" />
            Login with NDI
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <!-- Email Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              v-model="loginForm.email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              v-model="loginForm.password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="loginForm.remember"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" class="text-sm text-primary hover:text-primary/90">Forgot password?</a>
          </div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign in
          </button>
        </form>
      </div>

      <!-- Registration Section -->
      <div v-else class="space-y-6">
        <!-- Registration Notice -->
        <div class="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div class="flex">
            <AlertTriangleIcon class="h-5 w-5 text-amber-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">Important Notice</h3>
              <div class="mt-2 text-sm text-amber-700">
                <p>
                  This registration is for applicant/end-user accounts only. For admin or staff
                  account registration, please contact the BQPCA authority directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Updated Registration Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name Fields -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                v-model="registerForm.first_name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                type="text"
                v-model="registerForm.middle_name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                v-model="registerForm.last_name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- Gender Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="registerForm.gender"
                  value="male"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-gray-700">Male</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="registerForm.gender"
                  value="female"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-gray-700">Female</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="registerForm.gender"
                  value="other"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-gray-700">Other</span>
              </label>
            </div>
          </div>

          <!-- Date of Birth Picker -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div class="mt-1 relative">
              <input
                type="text"
                readonly
                :value="formattedDOB"
                @click="showDatePicker = true"
                placeholder="YYYY-MM-DD"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary cursor-pointer"
              />

              <!-- Custom Date Picker -->
              <div
                v-if="showDatePicker"
                class="absolute z-10 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
                @click.stop
              >
                <div class="flex justify-between items-center mb-4">
                  <button @click="adjustDate(-1, 'month')" class="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft class="h-5 w-5 text-gray-600" />
                  </button>
                  <div class="flex space-x-2">
                    <select
                      v-model="datePickerMonth"
                      class="form-select text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option v-for="(month, index) in months" :key="index" :value="index">
                        {{ month }}
                      </option>
                    </select>
                    <select
                      v-model="datePickerYear"
                      class="form-select text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                    </select>
                  </div>
                  <button @click="adjustDate(1, 'month')" class="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight class="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 gap-1">
                  <!-- Day headers -->
                  <div
                    v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
                    :key="day"
                    class="text-center text-xs font-medium text-gray-500 p-1"
                  >
                    {{ day }}
                  </div>
                  <!-- Calendar days -->
                  <button
                    v-for="date in calendarDates"
                    :key="date.date.toISOString()"
                    @click="selectDate(date)"
                    :disabled="!date.isCurrentMonth"
                    :class="[
                      'p-1 text-sm rounded-full hover:bg-gray-100 relative disabled:opacity-50 disabled:cursor-not-allowed',
                      date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                      isSelectedDate(date) ? 'bg-primary text-white hover:bg-primary/90' : '',
                      isToday(date) && !isSelectedDate(date)
                        ? 'font-bold border border-gray-300'
                        : '',
                    ]"
                  >
                    {{ date.day }}
                  </button>
                </div>
                <button
                  @click="showDatePicker = false"
                  class="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <!-- CID Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >CID/Work Permit/Passport Number</label
            >
            <input
              type="text"
              v-model="registerForm.cid"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Contact Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              v-model="registerForm.contact_number"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              v-model="registerForm.email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Password Fields -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                v-model="registerForm.password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                v-model="registerForm.confirm_password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="registerForm.terms"
              required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" class="text-primary hover:text-primary/90">Terms</a> and
              <a href="#" class="text-primary hover:text-primary/90">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>

    <!-- NDI Login Modal -->
    <NdiModal v-if="isNdiModalOpen" @close="isNdiModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import {
  // QrCodeIcon, // No longer needed as QR code is removed
  AlertTriangle as AlertTriangleIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import NdiModal from './NdiModal.vue' // Import the NDI Modal

const props = defineProps({
  serviceType: {
    type: String,
    required: true,
  },
})

const toast = useToast()
const authStore = useAuthStore() // Use the auth store

const activeTab = ref('login')
// const showQRCode = ref(false) // Removed
// const showRegisterQRCode = ref(false); // Removed
const showDatePicker = ref(false)
const isNdiModalOpen = ref(false) // State for NDI Modal visibility

// Date picker state
const datePickerMonth = ref(new Date().getMonth())
const datePickerYear = ref(new Date().getFullYear())
const selectedDate = ref(null) // Stores the full Date object

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Generate years (e.g., last 100 years from current)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 100 }, (_, i) => currentYear - i) // Descending order might be better

const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
  service_type: props.serviceType,
})

const registerForm = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: null, // Will store YYYY-MM-DD string
  cid: '',
  contact_number: '',
  email: '',
  password: '',
  confirm_password: '',
  terms: false,
  service_type: props.serviceType,
})

// --- Date Picker Logic ---

// Helper function to format date as YYYY-MM-DD using local parts
const formatLocalDate = (date) => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calendarDates = computed(() => {
  const dates = []
  const firstDayOfMonth = new Date(datePickerYear.value, datePickerMonth.value, 1)
  const lastDayOfMonth = new Date(datePickerYear.value, datePickerMonth.value + 1, 0)

  // Start day of the week (0=Sun, 1=Mon, ...)
  const startDayOfWeek = firstDayOfMonth.getDay()

  // Days from previous month
  const lastDayOfPrevMonth = new Date(datePickerYear.value, datePickerMonth.value, 0)
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = lastDayOfPrevMonth.getDate() - i
    const date = new Date(datePickerYear.value, datePickerMonth.value - 1, day)
    dates.push({ date, day, isCurrentMonth: false })
  }

  // Days of current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(datePickerYear.value, datePickerMonth.value, day)
    dates.push({ date, day, isCurrentMonth: true })
  }

  // Days from next month to fill the grid (usually 42 cells = 6 rows * 7 days)
  const gridCells = 42 // Or 35 if you prefer 5 rows sometimes
  let nextMonthDay = 1
  while (dates.length < gridCells) {
    const date = new Date(datePickerYear.value, datePickerMonth.value + 1, nextMonthDay)
    dates.push({ date, day: nextMonthDay, isCurrentMonth: false })
    nextMonthDay++
  }

  return dates.slice(0, gridCells) // Ensure we don't exceed the grid size needed
})

// Use the helper function for display
const formattedDOB = computed(() => {
  return formatLocalDate(selectedDate.value)
})

const adjustDate = (amount, unit) => {
  if (unit === 'month') {
    const currentDate = new Date(datePickerYear.value, datePickerMonth.value, 1)
    currentDate.setMonth(currentDate.getMonth() + amount)
    datePickerMonth.value = currentDate.getMonth()
    datePickerYear.value = currentDate.getFullYear()
  }
}

const selectDate = (dateObj) => {
  if (!dateObj.isCurrentMonth) return // Don't allow selecting dates from other months easily
  selectedDate.value = dateObj.date // Store the full Date object
  registerForm.date_of_birth = formatLocalDate(dateObj.date) // Store the correct YYYY-MM-DD string
  showDatePicker.value = false
}

const isSelectedDate = (dateObj) => {
  if (!selectedDate.value) return false
  // Compare year, month, and day
  return (
    dateObj.date.getFullYear() === selectedDate.value.getFullYear() &&
    dateObj.date.getMonth() === selectedDate.value.getMonth() &&
    dateObj.date.getDate() === selectedDate.value.getDate()
  )
}

const isToday = (dateObj) => {
  const today = new Date()
  return (
    dateObj.date.getFullYear() === today.getFullYear() &&
    dateObj.date.getMonth() === today.getMonth() &&
    dateObj.date.getDate() === today.getDate()
  )
}

// Close date picker if clicking outside
const handleClickOutside = (event) => {
  // Find the date picker input and the picker div itself
  const inputElement = event.target.closest('input[readonly]')
  const pickerElement = event.target.closest('.absolute.z-10')

  // If the click is not on the input or inside the picker, close it
  if (!inputElement && !pickerElement && showDatePicker.value) {
    showDatePicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// --- NDI Modal Logic ---
const openNdiLoginModal = () => {
  isNdiModalOpen.value = true
}

// --- Form Handlers (Login/Register) ---

const handleLogin = async () => {
  try {
    await authStore.login({ ...loginForm, from: 'authSection' })
    // Success navigation/handling is likely within authStore.login
  } catch (error) {
    console.error('Login error:', error)
    const response = error.response || {}
    const data = response.data || {}
    const status = response.status

    if (
      data.non_field_errors &&
      Array.isArray(data.non_field_errors) &&
      data.non_field_errors.length > 0
    ) {
      const errorMsg = data.non_field_errors[0]
      if (errorMsg.includes('Unable to log in with provided credentials')) {
        toast.error('Invalid email or password. Please check your credentials.')
      } else {
        toast.error(errorMsg)
      }
    } else if (status === 401) {
      toast.error('Invalid email or password. Please check your credentials.')
    } else if (status === 404) {
      toast.error('Account not found. Please check your email or register.')
    } else if (status === 400) {
      if (data.email) {
        toast.error(`Email error: ${data.email[0]}`)
      } else if (data.password) {
        toast.error(`Password error: ${data.password[0]}`)
      } else {
        toast.error('Invalid login information. Please check your details.')
      }
    } else if (error.message && error.message.includes('Network Error')) {
      toast.error('Cannot connect to the server. Please check your internet connection.')
    } else {
      toast.error('Login failed. Please try again.')
    }
  }
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirm_password) {
    toast.error('Passwords do not match')
    return
  }
  // Add validation for date of birth if needed
  if (!registerForm.date_of_birth) {
    toast.error('Please select your Date of Birth.')
    return
  }

  try {
    // Payload already contains the formatted date_of_birth string
    const payload = {
      first_name: registerForm.first_name,
      middle_name: registerForm.middle_name,
      last_name: registerForm.last_name,
      gender: registerForm.gender,
      date_of_birth: registerForm.date_of_birth, // Use the pre-formatted string
      cid: registerForm.cid,
      contact_number: registerForm.contact_number,
      email: registerForm.email,
      password: registerForm.password,
      confirm_password: registerForm.confirm_password, // Send confirmation for potential backend validation
      service_type: registerForm.service_type,
    }

    await apiService.register(payload)
    toast.success('Registration successful! Please login.')
    activeTab.value = 'login'
    // Optionally clear the registration form
    Object.keys(registerForm).forEach((key) => {
      if (key !== 'service_type')
        registerForm[key] = key === 'terms' ? false : key === 'date_of_birth' ? null : ''
    })
    selectedDate.value = null // Clear selected date object too
  } catch (error) {
    console.error('Registration error:', error)
    const response = error.response || {}
    const data = response.data || {}
    const status = response.status

    // Improved error message handling from backend
    let errorMessage = 'Registration failed. Please check your details and try again.' // Default message

    if (status === 400) {
      // Concatenate all field errors for a more informative message
      const fieldErrors = Object.entries(data)
        .map(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            // Make field name more readable
            const readableField = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
            return `${readableField}: ${messages[0]}` // Show first error message per field
          }
          return null
        })
        .filter((msg) => msg !== null)
        .join('. ')

      if (fieldErrors) {
        errorMessage = fieldErrors
      } else if (data.non_field_errors && data.non_field_errors.length > 0) {
        errorMessage = data.non_field_errors[0]
      }
    } else if (status === 409) {
      // Conflict (e.g., email/CID exists)
      errorMessage = 'An account with this email or CID already exists.'
    } else if (error.message && error.message.includes('Network Error')) {
      errorMessage = 'Cannot connect to the server. Please check your internet connection.'
    } else if (status >= 500) {
      errorMessage = 'Server error during registration. Please try again later.'
    }

    toast.error(errorMessage)
  }
}
</script>

<style scoped>
/* Add any specific styles if needed */
.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
