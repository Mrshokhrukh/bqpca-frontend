<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">CPD Provider Profile</h2>
        <p class="text-xl text-gray-600">View and update your personal and CPD activity details.</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div class="px-6 py-5 sm:px-8 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-2xl leading-6 font-semibold text-gray-900">Profile Details</h3>
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </button>
          <div v-else class="flex space-x-3">
            <button
              @click="saveProfile"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <button
              @click="cancelEditing"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
        <div class="px-6 py-5 sm:px-8">
          <div v-if="!isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- View Mode -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ profile.first_name }} {{ profile.middle_name || '' }} {{ profile.last_name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <p class="mt-1 text-sm text-gray-900 capitalize">
                {{ profile.gender || 'Not Provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(profile.date_of_birth) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact Number</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ profile.contact_number || 'Not Provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <p class="mt-1 text-sm text-gray-900">{{ profile.email || 'Not Provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Registration Number</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ profile.registration_number || 'Not Provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID/Identity No.</label>
              <p class="mt-1 text-sm text-gray-900">{{ profile.cid_number || 'Not Provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Agency/Training Location</label
              >
              <p class="mt-1 text-sm text-gray-900">
                {{ profile.agency_location || 'Not Provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CPD Activity Title</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ profile.cpd_activity_title || 'Not Provided' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Venue</label>
              <p class="mt-1 text-sm text-gray-900">{{ profile.venue || 'Not Provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">From Date</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(profile.from_date) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">To Date</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(profile.to_date) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Type of CPD</label>
              <p class="mt-1 text-sm text-gray-900">{{ profile.cpd_type || 'Not Provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Reason for Conducting</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ profile.reason_for_conducting || 'Not Provided' }}
              </p>
            </div>
          </div>
          <form v-else @submit.prevent="saveProfile" class="space-y-6">
            <!-- Edit Mode -->
            <fieldset>
              <legend class="text-base font-medium text-gray-900 mb-2">Personal Information</legend>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div>
                  <label for="first_name" class="block text-sm font-medium text-gray-700"
                    >First Name <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    id="first_name"
                    v-model="profile.first_name"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="middle_name" class="block text-sm font-medium text-gray-700"
                    >Middle Name</label
                  >
                  <input
                    type="text"
                    id="middle_name"
                    v-model="profile.middle_name"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="last_name" class="block text-sm font-medium text-gray-700"
                    >Last Name <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    id="last_name"
                    v-model="profile.last_name"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div class="sm:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Gender <span class="text-red-500">*</span></label
                  >
                  <div class="flex items-center space-x-4">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        v-model="profile.gender"
                        value="male"
                        required
                        name="gender"
                        class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span class="ml-2 text-gray-700">Male</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        v-model="profile.gender"
                        value="female"
                        name="gender"
                        class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span class="ml-2 text-gray-700">Female</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        v-model="profile.gender"
                        value="other"
                        name="gender"
                        class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span class="ml-2 text-gray-700">Other</span>
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend class="text-base font-medium text-gray-900 mb-2">Contact Details</legend>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label for="date_of_birth" class="block text-sm font-medium text-gray-700"
                    >Date of Birth <span class="text-red-500">*</span></label
                  >
                  <input
                    type="date"
                    id="date_of_birth"
                    v-model="profile.date_of_birth"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="contact_number" class="block text-sm font-medium text-gray-700"
                    >Contact Number <span class="text-red-500">*</span></label
                  >
                  <input
                    type="tel"
                    id="contact_number"
                    v-model="profile.contact_number"
                    required
                    placeholder="e.g., 09171234567"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend class="text-base font-medium text-gray-900 mb-2">Account Credentials</legend>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700"
                    >Email <span class="text-red-500">*</span></label
                  >
                  <input
                    type="email"
                    id="email"
                    v-model="profile.email"
                    required
                    readonly
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm"
                  />
                  <p class="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend class="text-base font-medium text-gray-900 mb-2">
                Identification Details
              </legend>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label for="registration_number" class="block text-sm font-medium text-gray-700"
                    >Registration Number</label
                  >
                  <input
                    type="text"
                    id="registration_number"
                    v-model="profile.registration_number"
                    readonly
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label for="cid_number" class="block text-sm font-medium text-gray-700"
                    >CID/Identity No.</label
                  >
                  <input
                    type="text"
                    id="cid_number"
                    v-model="profile.cid_number"
                    readonly
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label for="agency_location" class="block text-sm font-medium text-gray-700"
                    >Agency/Training Location</label
                  >
                  <input
                    type="text"
                    id="agency_location"
                    v-model="profile.agency_location"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend class="text-base font-medium text-gray-900 mb-2">CPD Activity Details</legend>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label for="cpd_activity_title" class="block text-sm font-medium text-gray-700"
                    >CPD Activity Title <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    id="cpd_activity_title"
                    v-model="profile.cpd_activity_title"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="venue" class="block text-sm font-medium text-gray-700"
                    >Venue <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    id="venue"
                    v-model="profile.venue"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="from_date" class="block text-sm font-medium text-gray-700"
                    >From Date</label
                  >
                  <input
                    type="date"
                    id="from_date"
                    v-model="profile.from_date"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="to_date" class="block text-sm font-medium text-gray-700"
                    >To Date</label
                  >
                  <input
                    type="date"
                    id="to_date"
                    v-model="profile.to_date"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label for="cpd_type" class="block text-sm font-medium text-gray-700"
                    >Type of CPD</label
                  >
                  <select
                    id="cpd_type"
                    v-model="profile.cpd_type"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="course">Course</option>
                    <option value="conference">Conference</option>
                  </select>
                </div>
                <div>
                  <label for="reason_for_conducting" class="block text-sm font-medium text-gray-700"
                    >Reason for Conducting</label
                  >
                  <select
                    id="reason_for_conducting"
                    v-model="profile.reason_for_conducting"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Reason</option>
                    <option value="professional_development">Professional Development</option>
                    <option value="skill_enhancement">Skill Enhancement</option>
                    <option value="certification">Certification</option>
                    <option value="networking">Networking</option>
                  </select>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      <!-- Password Management Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="px-6 py-5 sm:px-8 border-b border-gray-200">
          <h3 class="text-2xl leading-6 font-semibold text-gray-900">Password Management</h3>
          <p class="mt-1 text-sm text-gray-500">View or update your account password.</p>
        </div>
        <div class="px-6 py-5 sm:px-8">
          <div class="flex items-center space-x-4 mb-6">
            <label class="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="currentPassword"
              readonly
              class="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <div v-if="isChangingPassword" class="space-y-4">
            <div>
              <label for="new-password" class="block text-sm font-medium text-gray-700"
                >New Password <span class="text-red-500">*</span></label
              >
              <input
                type="password"
                id="new-password"
                v-model="newPassword"
                required
                class="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="confirm-new-password" class="block text-sm font-medium text-gray-700"
                >Confirm New Password <span class="text-red-500">*</span></label
              >
              <input
                type="password"
                id="confirm-new-password"
                v-model="confirmNewPassword"
                required
                class="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="submitPasswordChange"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save New Password
              </button>
              <button
                type="button"
                @click="cancelPasswordChange"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
          <button
            v-else
            type="button"
            @click="isChangingPassword = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services' // Adjust path as needed

const toast = useToast()

// Profile data
const profile = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  cpd_activity_title: '',
  venue: '',
  registration_number: '',
  cid_number: '',
  agency_location: '',
  from_date: '',
  to_date: '',
  cpd_type: '',
  reason_for_conducting: '',
})

// Password management
const currentPassword = ref('P@ssw0rd123') // Set by dealing officer
const showPassword = ref(false)
const isChangingPassword = ref(false)
const newPassword = ref('')
const confirmNewPassword = ref('')

// Editing state
const isEditing = ref(false)
const originalProfile = reactive({}) // Store original data for cancel

// Fetch profile data
const fetchProfile = async () => {
  try {
    console.log('Fetching provider profile...')
    const response = await apiService.getProviderProfile() // Adjust to your API endpoint
    const data = response?.data || {}
    // Populate fields from dealing officer input
    profile.first_name = data.first_name || ''
    profile.middle_name = data.middle_name || ''
    profile.last_name = data.last_name || ''
    profile.gender = data.gender || ''
    profile.date_of_birth = data.date_of_birth ? data.date_of_birth.split('T')[0] : ''
    profile.contact_number = data.contact_number || ''
    profile.email = data.email || ''
    profile.cpd_activity_title = data.cpd_activity_title || ''
    profile.venue = data.venue || ''
    // Additional fields
    profile.registration_number = data.registration_number || ''
    profile.cid_number = data.cid_number || ''
    profile.agency_location = data.agency_location || ''
    profile.from_date = data.from_date ? data.from_date.split('T')[0] : ''
    profile.to_date = data.to_date ? data.to_date.split('T')[0] : ''
    profile.cpd_type = data.cpd_type || ''
    profile.reason_for_conducting = data.reason_for_conducting || ''
    // Password
    currentPassword.value = data.password || 'P@ssw0rd123'
    // Store original data
    Object.assign(originalProfile, profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    toast.error(`Failed to load profile: ${getErrorMessage(error)}`)
  }
}

// Format date for display
const formatDate = (date) => {
  if (!date) return 'Not Provided'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Start editing
const startEditing = () => {
  isEditing.value = true
}

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false
  Object.assign(profile, originalProfile) // Restore original data
}

// Save profile changes
const saveProfile = async () => {
  if (
    !profile.first_name ||
    !profile.last_name ||
    !profile.gender ||
    !profile.date_of_birth ||
    !profile.contact_number ||
    !profile.email ||
    !profile.cpd_activity_title ||
    !profile.venue
  ) {
    toast.error('Please fill all required fields.')
    return
  }
  try {
    const payload = {
      first_name: profile.first_name,
      middle_name: profile.middle_name,
      last_name: profile.last_name,
      gender: profile.gender,
      date_of_birth: profile.date_of_birth,
      contact_number: profile.contact_number,
      email: profile.email,
      cpd_activity_title: profile.cpd_activity_title,
      venue: profile.venue,
      agency_location: profile.agency_location,
      from_date: profile.from_date,
      to_date: profile.to_date,
      cpd_type: profile.cpd_type,
      reason_for_conducting: profile.reason_for_conducting,
    }
    console.log('Saving profile with payload:', payload)
    await apiService.updateProviderProfile(payload) // Adjust to your API endpoint
    toast.success('Profile updated successfully!')
    isEditing.value = false
    Object.assign(originalProfile, profile) // Update original data
  } catch (error) {
    console.error('Error saving profile:', error)
    toast.error(`Failed to save profile: ${getErrorMessage(error)}`)
  }
}

// Handle password change
const submitPasswordChange = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    toast.error('New passwords do not match')
    return
  }
  if (!newPassword.value) {
    toast.error('Please enter a new password')
    return
  }
  try {
    const payload = {
      password: newPassword.value,
      confirm_password: confirmNewPassword.value,
    }
    await apiService.changePassword(payload) // Adjust to your API endpoint
    currentPassword.value = newPassword.value
    toast.success('Password updated successfully!')
    cancelPasswordChange()
  } catch (error) {
    console.error('Password change error:', error)
    toast.error(`Failed to update password: ${getErrorMessage(error)}`)
  }
}

const cancelPasswordChange = () => {
  isChangingPassword.value = false
  newPassword.value = ''
  confirmNewPassword.value = ''
}

// Error message utility
const getErrorMessage = (error) => {
  let message = 'An unexpected error occurred. Please try again.'
  if (error.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') {
      message = data
    } else if (data.message) {
      message = data.message
    } else if (data.error) {
      message = data.error
    } else if (data.errors) {
      const messages = Object.values(data.errors).flat()
      message = messages.join(' ')
    } else if (Object.keys(data).length > 0) {
      try {
        message = JSON.stringify(data)
      } catch {
        /* ignore */
      }
    }
  } else if (error.message) {
    message = error.message
  }
  return message
}

// Initialize data on mount
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
/* Ensure consistent styling */
input:read-only,
select:read-only {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
.form-radio {
  color: #4f46e5;
}
</style>
