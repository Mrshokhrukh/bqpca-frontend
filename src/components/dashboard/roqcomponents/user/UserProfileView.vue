<template>
  <div class="min-h-screen">
    <div class="w-full max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header with Cover Image & Avatar -->
      <div class="relative mb-16">
        <!-- Cover Image -->
        <div
          class="h-64 sm:h-72 md:h-80 w-full rounded-xl overflow-hidden shadow-lg relative group"
        >
          <!-- Subtle Pattern Background -->
          <div class="absolute inset-0 bg-blue-600 opacity-90">
            <svg
              class="absolute inset-0 h-full w-full text-blue-500 opacity-20"
              fill="currentColor"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100,0 C155.228475,0 200,44.771525 200,100 C200,155.228475 155.228475,200 100,200 C44.771525,200 0,155.228475 0,100 C0,44.771525 44.771525,0 100,0 Z M100,180 C144.18278,180 180,144.18278 180,100 C180,55.81722 144.18278,20 100,20 C55.81722,20 20,55.81722 20,100 C20,144.18278 55.81722,180 100,180 Z"
                fill-rule="evenodd"
              />
            </svg>
          </div>
          <div
            class="absolute inset-0 bg-cover bg-center mix-blend-soft-light opacity-30 transition-transform duration-500 group-hover:scale-105"
            style="
              background-image: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80');
            "
          ></div>

          <!-- User Info Overlay -->
          <div
            class="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col sm:flex-row items-center justify-between"
          >
            <div class="flex items-center space-x-5">
              <!-- Avatar with Border Animation -->
              <div class="relative group/avatar">
                <div
                  class="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-xl border-4 border-white transform -translate-y-10 sm:-translate-y-12 ring-4 ring-blue-500/30 group-hover/avatar:ring-blue-500/50 transition-all duration-300"
                >
                  {{
                    profileData.first_name ? profileData.first_name.charAt(0).toUpperCase() : 'U'
                  }}
                  <span v-if="profileData.last_name" class="opacity-70">{{
                    profileData.last_name.charAt(0).toUpperCase()
                  }}</span>
                </div>
                <!-- Edit Avatar Icon (Placeholder for functionality) -->
                <button
                  v-if="isEditing"
                  class="absolute bottom-0 right-0 mb-1 mr-1 p-1.5 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-100 transition-colors"
                >
                  <Camera size="16" />
                </button>
              </div>

              <!-- User Name & Email -->
              <div class="pt-0 sm:pt-4 text-center sm:text-left">
                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
                  {{ profileData.first_name }} {{ profileData.last_name }}
                </h1>
                <div class="flex items-center mt-1.5 text-blue-100 opacity-90">
                  <Mail class="w-4 h-4 mr-2" />
                  <span class="text-sm">{{ profileData.email }}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <button
              @click="toggleEditMode"
              class="mt-4 sm:mt-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :class="[
                isEditing
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-blue-700 hover:bg-blue-50',
              ]"
            >
              <Edit3 v-if="!isEditing" class="w-4 h-4 mr-2" />
              <XCircle v-else class="w-4 h-4 mr-2" />
              {{ isEditing ? 'Cancel Editing' : 'Edit Profile' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <!-- Left Column: Profile Completeness, Stats and Certificates -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Profile Completeness -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80">
            <div class="p-5">
              <h2 class="text-lg font-semibold text-slate-700 mb-3">Profile Completeness</h2>
              <div class="w-full bg-slate-200 rounded-full h-2.5 mb-1">
                <div
                  class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: profileCompleteness + '%' }"
                ></div>
              </div>
              <p class="text-xs text-slate-500 text-right">{{ profileCompleteness }}% Complete</p>
              <p v-if="profileCompleteness < 100" class="mt-2 text-xs text-slate-500">
                Fill in all required fields to complete your profile.
              </p>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80">
            <div class="p-5">
              <h2 class="text-lg font-semibold text-slate-700 mb-4">Overview</h2>
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl flex flex-col justify-between h-full shadow-inner"
                >
                  <div class="flex items-center text-blue-600">
                    <Award class="w-5 h-5 mr-2" />
                    <span class="font-medium text-sm">Certifications</span>
                  </div>
                  <div class="mt-1">
                    <p class="text-3xl font-bold text-slate-800">{{ userCertificates.length }}</p>
                  </div>
                </div>
                <div
                  class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl flex flex-col justify-between h-full shadow-inner"
                >
                  <div class="flex items-center text-green-600">
                    <CheckCircle class="w-5 h-5 mr-2" />
                    <span class="font-medium text-sm">Verified</span>
                  </div>
                  <div class="mt-1">
                    <p class="text-3xl font-bold text-slate-800">{{ verifiedCertificatesCount }}</p>
                  </div>
                </div>
              </div>
              <div class="border-t border-slate-200/80 mt-5 pt-4">
                <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                  Contact
                </h3>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <PhoneCall class="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p class="text-xs text-slate-500">Phone</p>
                      <p class="text-sm font-medium text-slate-700">
                        {{ profileData.contact_number || 'Not set' }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <MapPin class="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p class="text-xs text-slate-500">Location</p>
                      <p class="text-sm font-medium text-slate-700">
                        {{ locationString || 'Not set' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificates List -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80">
            <div class="flex items-center justify-between p-5 border-b border-slate-200/80">
              <div class="flex items-center">
                <Award class="w-5 h-5 text-blue-600 mr-2" />
                <h3 class="text-lg font-semibold text-slate-700">My Certifications</h3>
              </div>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >{{ userCertificates.length }}</span
              >
            </div>
            <div
              class="divide-y divide-slate-200/80 max-h-[400px] overflow-y-auto custom-scrollbar"
            >
              <div
                v-for="cert in userCertificates"
                :key="cert.id"
                class="p-4 hover:bg-slate-50/70 transition-colors duration-150 group/cert"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start">
                      <div class="p-2 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                        <ScrollText class="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4
                          class="font-semibold text-slate-800 text-sm truncate group-hover/cert:text-blue-600 transition-colors"
                        >
                          {{ cert.title }}
                        </h4>
                        <p class="text-xs text-slate-500 mt-0.5">
                          QEC: <span class="font-medium">{{ cert.qec_number }}</span>
                        </p>
                        <p class="text-xs text-slate-500 mt-0.5">
                          Issued: <span class="font-medium">{{ formatDate(cert.updated_at) }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm',
                      statusBadgeClass(cert.status),
                    ]"
                  >
                    <span
                      :class="['w-2 h-2 rounded-full mr-1.5', statusDotClass(cert.status)]"
                    ></span>
                    {{ cert.status }}
                  </span>
                </div>
              </div>
              <div v-if="userCertificates.length === 0" class="p-10 text-center">
                <div
                  class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4"
                >
                  <FileX2 class="w-8 h-8" />
                </div>
                <h3 class="text-md font-semibold text-slate-700 mb-1">No Certificates Yet</h3>
                <p class="text-sm text-slate-500">
                  Your certifications will appear here once added.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Profile Information Forms -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Personal Information Section -->
          <section class="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
            <header
              class="px-6 py-4 bg-gradient-to-r from-slate-50 to-white/50 border-b border-slate-200/80 flex items-center"
            >
              <UserCircle2 class="w-5 h-5 text-blue-600 mr-2.5" />
              <h3 class="text-lg font-semibold text-slate-700">Personal Information</h3>
            </header>
            <div class="p-6">
              <Transition name="form-fade" mode="out-in">
                <div v-if="!isEditing" class="space-y-4">
                  <ProfileDetailItem
                    label="Full Name"
                    :value="
                      `${profileData.first_name} ${profileData.middle_name || ''} ${profileData.last_name}`
                        .replace(/\s+/g, ' ')
                        .trim()
                    "
                  />
                  <ProfileDetailItem
                    label="Date of Birth"
                    :value="formatDate(profileData.date_of_birth) || 'Not set'"
                  />
                  <ProfileDetailItem
                    label="Gender"
                    :value="
                      profileData.gender
                        ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)
                        : 'Not set'
                    "
                  />
                  <ProfileDetailItem
                    label="Contact Number"
                    :value="profileData.contact_number || 'Not set'"
                    icon="PhoneCall"
                  />
                </div>
                <form
                  v-else
                  @submit.prevent="updateProfile"
                  class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
                >
                  <FormInputGroup
                    label="First Name"
                    required
                    :isEditing="isEditing"
                    v-model="profileData.first_name"
                  />
                  <FormInputGroup
                    label="Middle Name"
                    :isEditing="isEditing"
                    v-model="profileData.middle_name"
                  />
                  <FormInputGroup
                    label="Last Name"
                    required
                    :isEditing="isEditing"
                    v-model="profileData.last_name"
                  />
                  <FormInputGroup
                    label="Date of Birth"
                    type="date"
                    :isEditing="isEditing"
                    v-model="profileData.date_of_birth"
                  />
                  <FormSelectGroup
                    label="Gender"
                    :isEditing="isEditing"
                    v-model="profileData.gender"
                    :options="genderOptions"
                  />
                  <FormInputGroup
                    label="Contact Number"
                    type="tel"
                    required
                    :isEditing="isEditing"
                    v-model="profileData.contact_number"
                    icon="PhoneCall"
                  />
                </form>
              </Transition>
            </div>
          </section>

          <!-- Location Information Section -->
          <section class="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
            <header
              class="px-6 py-4 bg-gradient-to-r from-slate-50 to-white/50 border-b border-slate-200/80 flex items-center"
            >
              <MapPin class="w-5 h-5 text-blue-600 mr-2.5" />
              <h3 class="text-lg font-semibold text-slate-700">Location Details</h3>
            </header>
            <div class="p-6">
              <Transition name="form-fade" mode="out-in">
                <div v-if="!isEditing" class="space-y-4">
                  <ProfileDetailItem
                    label="Dzongkhag"
                    :value="profileData.dzongkhag || 'Not set'"
                  />
                  <ProfileDetailItem label="Gewog" :value="profileData.gewog || 'Not set'" />
                  <ProfileDetailItem label="Village" :value="profileData.village || 'Not set'" />
                </div>
                <form
                  v-else
                  @submit.prevent="updateProfile"
                  class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5"
                >
                  <FormInputGroup
                    label="Dzongkhag"
                    required
                    :isEditing="isEditing"
                    v-model="profileData.dzongkhag"
                  />
                  <FormInputGroup
                    label="Gewog"
                    required
                    :isEditing="isEditing"
                    v-model="profileData.gewog"
                  />
                  <FormInputGroup
                    label="Village"
                    required
                    :isEditing="isEditing"
                    v-model="profileData.village"
                  />
                </form>
              </Transition>
            </div>
          </section>

          <!-- Account Settings Section (Placeholder) -->
          <section class="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
            <header
              class="px-6 py-4 bg-gradient-to-r from-slate-50 to-white/50 border-b border-slate-200/80 flex items-center"
            >
              <ShieldCheck class="w-5 h-5 text-blue-600 mr-2.5" />
              <h3 class="text-lg font-semibold text-slate-700">Account Settings</h3>
            </header>
            <div class="p-6 space-y-4">
              <ProfileDetailItem
                label="Email Address"
                :value="profileData.email"
                icon="Mail"
                :isStatic="true"
              />
              <div class="pt-2">
                <button
                  type="button"
                  @click="showChangePasswordModal = true"
                  class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <LockKeyhole class="w-4 h-4 mr-1.5" /> Change Password
                </button>
              </div>
            </div>
          </section>

          <!-- Submit Button (Only when editing) -->
          <div v-if="isEditing" class="flex justify-end mt-8">
            <button
              @click="updateProfile"
              :disabled="loading"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2.5 transform hover:-translate-y-0.5"
            >
              <LoaderCircle v-if="loading" class="w-5 h-5 animate-spin" />
              <Save v-else class="w-5 h-5" />
              <span>{{ loading ? 'Saving Changes...' : 'Save All Changes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Change Password Modal (Placeholder) -->
    <ChangePasswordModal v-if="showChangePasswordModal" @close="showChangePasswordModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import { useAuthStore } from '@/stores/authStore' // Adjust path if needed
import apiService from '@/services/services' // Adjust path if needed
import { storeToRefs } from 'pinia'
import {
  Mail,
  UserCircle2,
  MapPin,
  Award,
  ScrollText,
  Edit3,
  XCircle,
  CheckCircle,
  LockKeyhole,
  Save,
  LoaderCircle,
  PhoneCall,
  FileX2,
  Camera,
  ShieldCheck,
} from 'lucide-vue-next'

// Assuming you have these components or will create them
import FormInputGroup from '@/components/common/ROQ/FormInputGroup.vue'
import FormSelectGroup from '@/components/common/ROQ/FormSelectGroup.vue'
import ProfileDetailItem from '@/components/common/ROQ/ProfileDetailItem.vue'
import ChangePasswordModal from '@/components/common/ROQ/ChangePasswordModal.vue'

const toast = inject('toast')
const authStore = useAuthStore()
const { userId } = storeToRefs(authStore) // user for initial data
const loading = ref(false)
const isEditing = ref(false)
const showChangePasswordModal = ref(false)

const profileData = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  date_of_birth: '',
  contact_number: '',
  gender: '',
  dzongkhag: '',
  gewog: '',
  village: '',
})

const allCertificates = ref([])
const userCertificates = computed(() => allCertificates.value || []) // Simplified, assuming API fetches user-specific

const genderOptions = ref([
  { value: '', text: 'Select Gender' },
  { value: 'male', text: 'Male' },
  { value: 'female', text: 'Female' },
  { value: 'other', text: 'Other' },
])

const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  // Ensure it's a valid date before formatting to avoid "Invalid Date"
  if (isNaN(date.getTime())) return dateString // or null or 'Invalid Date'
  return date.toISOString().split('T')[0] // For 'yyyy-MM-dd' format suitable for <input type="date">
}

const toggleEditMode = () => {
  if (isEditing.value) {
    // If cancelling, revert to original fetched data
    setProfileDataFromAuthStore()
  }
  isEditing.value = !isEditing.value
}

const setProfileDataFromAuthStore = () => {
  if (authStore.user) {
    profileData.value = {
      first_name: authStore.user.first_name || '',
      middle_name: authStore.user.middle_name || '',
      last_name: authStore.user.last_name || '',
      email: authStore.user.email || '', // Assuming email is part of user object
      date_of_birth: formatDate(authStore.user.date_of_birth), // Ensure 'yyyy-MM-dd'
      contact_number: authStore.user.contact_number || '',
      gender: authStore.user.gender || '',
      dzongkhag: authStore.user.dzongkhag || '',
      gewog: authStore.user.gewog || '',
      village: authStore.user.village || '',
    }
  }
}

const loadProfile = async () => {
  loading.value = true
  setProfileDataFromAuthStore() // Set initial data from store

  // Fetch additional data like certificates if user is logged in
  if (authStore.user && authStore.user.cid) {
    try {
      const certsResponse = await apiService.getRecognitionOfQualification(authStore.user.cid)
      allCertificates.value = certsResponse.data || []
    } catch (error) {
      toast.error('Failed to load certificates.')
      console.error('Error fetching certificates:', error)
    }
  } else if (!authStore.user) {
    toast.error('User not logged in or user data incomplete.')
  }
  loading.value = false
}

const updateProfile = async () => {
  if (!isEditing.value) return
  loading.value = true
  try {
    if (!userId.value) {
      toast.error('User ID is missing. Please log in again.')
      return
    }
    // Exclude email from update payload if it's not meant to be updatable by user here
    const { ...updatePayload } = profileData.value

    await apiService.updateProfile({ id: userId.value, ...updatePayload })
    await authStore.updateUserAfterFetch() // Refresh store user data
    setProfileDataFromAuthStore() // Update local form data from refreshed store
    toast.success('Profile updated successfully!')
    isEditing.value = false
  } catch (error) {
    console.error('Error updating profile:', error)
    const errorMessage =
      error.response?.data?.message || error.response?.data || 'Failed to update profile.'
    let messages = []
    if (typeof errorMessage === 'object') {
      for (const key in errorMessage) {
        messages.push(
          `${key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: ${errorMessage[
            key
          ].join(', ')}`,
        )
      }
      toast.error(messages.join('\n'), { timeout: 7000 })
    } else {
      toast.error(errorMessage)
    }
  } finally {
    loading.value = false
  }
}

const profileCompleteness = computed(() => {
  const requiredFields = [
    'first_name',
    'last_name',
    'email',
    'contact_number',
    'dzongkhag',
    'gewog',
    'village',
  ]
  let completedFields = 0
  requiredFields.forEach((field) => {
    if (profileData.value[field] && profileData.value[field].trim() !== '') {
      completedFields++
    }
  })
  return Math.round((completedFields / requiredFields.length) * 100)
})

const verifiedCertificatesCount = computed(() => {
  return userCertificates.value.filter((c) => c.status === 'Verified').length
})

const locationString = computed(() => {
  const parts = [
    profileData.value.village,
    profileData.value.gewog,
    profileData.value.dzongkhag,
  ].filter(Boolean)
  return parts.join(', ') || 'Not set'
})

const statusMapping = {
  Verified: { badge: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-500' },
  Pending: {
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500',
  },
  Rejected: { badge: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500' },
  default: { badge: 'bg-slate-100 text-slate-700 border border-slate-200', dot: 'bg-slate-500' },
}

const statusBadgeClass = (status) => (statusMapping[status] || statusMapping.default).badge
const statusDotClass = (status) => (statusMapping[status] || statusMapping.default).dot

onMounted(loadProfile)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db; /* Tailwind gray-400 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af; /* Tailwind gray-500 */
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.form-fade-enter-to,
.form-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
