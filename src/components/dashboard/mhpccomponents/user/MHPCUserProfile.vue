<template>
  <div class="w-full mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div
      class="mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80"
    >
      <div class="relative">
        <div
          class="h-36 w-36 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl"
        >
          <img
            v-if="previewUrl || authStore.user?.passport_photo || authStore.user?.profile_photo_url"
            :src="previewUrl || authStore.user?.passport_photo || authStore.user?.profile_photo_url"
            alt="Profile photo"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-5xl font-thin text-gray-500">{{
            getInitials(authStore.fullName)
          }}</span>
        </div>
        <label
          for="photo-upload"
          class="absolute bottom-1 right-1 bg-blue-600 rounded-full p-3 text-white cursor-pointer shadow-md hover:bg-blue-700 transition transform hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
          <input
            id="photo-upload"
            type="file"
            @change="handleFileUpload"
            class="hidden"
            accept="image/*"
          />
        </label>
      </div>

      <div class="text-center md:text-left flex-grow">
        <h1 class="text-4xl font-extrabold text-gray-800">{{ authStore.fullName }}</h1>
        <p class="text-gray-500 text-xl mt-1">{{ authStore.user?.cid || 'No CID' }}</p>
        <div class="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
          <span
            class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800"
          >
            {{ authStore.gender }}
          </span>
          <span
            class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-800"
          >
            {{ formatDate(authStore.dateOfBirth) }}
          </span>
        </div>
      </div>

      <div class="ml-auto hidden md:block">
        <button
          @click="isEditing = !isEditing"
          class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          <span v-if="!isEditing">Edit Profile</span>
          <span v-else>View Profile</span>
        </button>
      </div>
    </div>

    <div class="mb-8">
      <nav class="flex space-x-2 bg-gray-200/80 p-1.5 rounded-lg">
        <button
          @click="isEditing = false"
          class="flex-1 text-center whitespace-nowrap py-3 px-4 font-semibold text-sm rounded-md transition-all duration-300"
          :class="
            !isEditing
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:bg-gray-300/60 hover:text-gray-800'
          "
        >
          Personal Information
        </button>
        <button
          @click="isEditing = true"
          class="flex-1 text-center whitespace-nowrap py-3 px-4 font-semibold text-sm rounded-md transition-all duration-300"
          :class="
            isEditing
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:bg-gray-300/60 hover:text-gray-800'
          "
        >
          Update Profile
        </button>
      </nav>
    </div>

    <div class="md:hidden mb-6 flex justify-end">
      <button
        @click="isEditing = !isEditing"
        class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
      >
        <span v-if="!isEditing">Edit Profile</span>
        <span v-else>View Profile</span>
      </button>
    </div>

    <div
      v-if="!isEditing"
      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-8">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">
            Personal Details
          </h3>
          <dl class="space-y-5">
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">CID No./Identity/Work Permit No.</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ authStore.user?.cid || 'Not provided' }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Full Name</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ authStore.fullName || 'Not provided' }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Gender</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ authStore.gender || 'Not provided' }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ formatDate(authStore.dateOfBirth) || 'Not provided' }}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">
            Location & Contact
          </h3>
          <dl class="space-y-5">
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Village</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ authStore.village || 'Not provided' }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Gewog</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ authStore.gewog || 'Not provided' }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Dzongkhag</dt>
              <dd class="mt-1 text-gray-900 font-medium text-lg">
                {{ authStore.dzongkhag || 'Not provided' }}
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-sm font-medium text-gray-500">Contact Information</dt>
              <dd class="mt-2 space-y-3">
                <div class="flex items-center space-x-3 text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span class="font-medium text-gray-800">{{
                    authStore.user?.contact_number || 'No contact number'
                  }}</span>
                </div>
                <div class="flex items-center space-x-3 text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="font-medium text-gray-800">{{
                    authStore.user?.email || 'No email address'
                  }}</span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="bg-gray-50/50 p-8 border-t border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Work Information</h3>
        <dl>
          <div class="flex flex-col">
            <dt class="text-sm font-medium text-gray-500">Work Address [Practice]</dt>
            <dd class="mt-1 text-gray-900 font-medium text-lg">
              {{ authStore.user?.work_address || 'Not specified' }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div
      v-else
      class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden"
    >
      <form @submit.prevent="saveProfile" class="p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-8">Update Your Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label for="contactNumber" class="block text-sm font-medium text-gray-700"
              >Contact No.</label
            >
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <input
                type="number"
                name="contactNumber"
                id="contactNumber"
                v-model="profileForm.contactNumber"
                class="pl-12 py-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label for="emailAddress" class="block text-sm font-medium text-gray-700"
              >Email Address</label
            >
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="emailAddress"
                id="emailAddress"
                v-model="profileForm.emailAddress"
                class="pl-12 py-3 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div class="md:col-span-2">
            <label for="passportPhoto" class="block text-sm font-medium text-gray-700"
              >Passport Format Photo</label
            >
            <div class="mt-2 flex items-center gap-5">
              <div class="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="Preview"
                  class="h-full w-full object-cover"
                />
                <div v-else class="h-full w-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <label
                for="file-upload"
                class="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <span>Change Photo</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  class="sr-only"
                  @change="handleFileUpload"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <div>
            <label for="workAddress" class="block text-sm font-medium text-gray-700"
              >Work Address [Practice]</label
            >
            <input
              type="text"
              id="workAddress"
              name="workAddress"
              v-model="profileForm.workAddress"
              class="mt-1 block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            />
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelEdit"
            class="bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const isEditing = ref(false)
const previewUrl = ref(null)

const profileForm = ref({
  contactNumber: authStore.user?.contact_number || '',
  emailAddress: authStore.user?.email || '',
  passportPhoto: null,
  workAddress: authStore.user?.work_address || '', // Use free text for work address
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileForm.value.passportPhoto = file

    // Create preview URL
    previewUrl.value = URL.createObjectURL(file)
  }
}

const saveProfile = async () => {
  try {
    // Basic validation
    if (!profileForm.value.contactNumber || !profileForm.value.emailAddress) {
      toast.error('Contact Number and Email Address are required.')
      return
    }

    if (!isValidEmail(profileForm.value.emailAddress)) {
      toast.error('Please enter a valid email address.')
      return
    }

    const formData = new FormData()
    formData.append('contact_number', profileForm.value.contactNumber)
    formData.append('email', profileForm.value.emailAddress)
    if (profileForm.value.passportPhoto) {
      formData.append('passport_photo', profileForm.value.passportPhoto)
    }
    formData.append('work_address', profileForm.value.workAddress || '') // Use free text

    // Call the API to update the profile
    const response = await apiService.updateProfile(authStore.userId, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Update the authStore with the fresh data from the response
    authStore.user = response.data
    localStorage.setItem('user', JSON.stringify(response.data))
    // If a new passport photo is present, update previewUrl
    if (response.data.passport_photo) {
      previewUrl.value = response.data.passport_photo
    } else {
      previewUrl.value = null
    }

    toast.success('Profile updated successfully!')
    isEditing.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error(error.response?.data?.message || 'Failed to update profile.')
  }
}

const cancelEdit = () => {
  // Reset form data
  profileForm.value = {
    contactNumber: authStore.user?.contact_number || '',
    emailAddress: authStore.user?.email || '',
    passportPhoto: null,
    workAddress: authStore.user?.work_address || '' // Use free text
  }

  // Clear preview
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }

  // Switch back to view mode
  isEditing.value = false
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
