<!-- src/components/modals/UserDetailsModal.vue -->
<template>
  <transition name="modal-fade">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        style="max-height: 90vh; display: flex; flex-direction: column"
      >
        <!-- Increased modal height and flex layout -->
        <!-- Header -->
        <div class="relative px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <span v-if="isEditing" class="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                />
                <path
                  fill-rule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-else class="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ isEditing ? 'Edit User Record' : 'User Details' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <div
            class="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Loading user details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-6">
          <div class="bg-red-50 rounded-lg p-4 flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-red-700">{{ error }}</p>
          </div>
          <div class="flex justify-center mt-6">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <!-- User Data Content -->
        <div v-else-if="user" class="p-6" style="overflow-y: auto">
          <!-- Content scrollable area -->
          <div class="max-h-[none] pr-1 space-y-6">
            <!-- Removed max-h limit here -->
            <!-- User Information Section -->
            <div class="bg-gray-50 rounded-xl p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                User Information
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    v-model="user.full_name"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <!-- CID Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">CID Number</label>
                  <input
                    type="text"
                    v-model="user.cid_no"
                    readonly
                    class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-600"
                  />
                </div>

                <!-- Gender -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <div class="relative">
                    <select
                      v-model="user.gender"
                      :disabled="!isEditing"
                      class="appearance-none w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      :class="{ 'bg-gray-100': !isEditing }"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    >
                      <svg
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Date of Birth -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    v-model="user.date_of_birth"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <!-- Contact Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                  <input
                    type="text"
                    v-model="user.contact_no"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <div class="relative">
                    <select
                      v-model="user.status"
                      :disabled="!isEditing"
                      class="appearance-none w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      :class="{ 'bg-gray-100': !isEditing }"
                    >
                      <option>Verified</option>
                      <option>Pending</option>
                      <option>Agreed</option>
                    </select>
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    >
                      <svg
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Qualifications Section -->
            <div v-if="user.user_qualifications && user.user_qualifications.length > 0">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
                  />
                </svg>
                Qualifications
              </h3>

              <div class="space-y-4">
                <div
                  v-for="(qualification, qIndex) in user.user_qualifications"
                  :key="qIndex"
                  class="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Qualification</p>
                      <p class="font-medium text-gray-800">
                        {{ qualification.qualification_name_display }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Institution</p>
                      <p class="font-medium text-gray-800">
                        {{ qualification.institute_university_display }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Completion Year</p>
                      <p class="font-medium text-gray-800">{{ qualification.completion_year }}</p>
                    </div>
                  </div>

                  <!-- Attachments -->
                  <div
                    v-if="
                      qualification.user_qualification_attachments &&
                      qualification.user_qualification_attachments.length > 0
                    "
                    class="mt-4 pt-4 border-t border-gray-200"
                  >
                    <h4 class="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 01-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Attachments
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        v-for="(attachment, aIndex) in qualification.user_qualification_attachments"
                        :key="aIndex"
                        :href="attachment.file"
                        target="_blank"
                        class="flex items-center p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="text-sm">{{ attachment.file_type_name }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Action Buttons -->
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              v-if="isEditing"
              @click="saveChanges"
              class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Save Changes
            </button>
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {{ isEditing ? 'Cancel' : 'Close' }}
            </button>
          </div>
        </div>

        <!-- No User Found State -->
        <div v-else class="p-6 flex flex-col items-center justify-center">
          <div class="bg-yellow-50 p-4 rounded-lg w-full">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-yellow-500 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-yellow-700">No user details found.</p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import apiServices from '@/services/services'

const props = defineProps({
  showModal: Boolean,
  isEditing: Boolean,
  selectedRecord: Object,
  userId: Number,
})

const emit = defineEmits(['close', 'update'])

const user = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchUserDetails = async (cid) => {
  loading.value = true
  error.value = null
  user.value = null

  try {
    const response = await apiServices.getMhpcFullApplicationListByCid(cid)

    if (Array.isArray(response.data.results) && response.data.results.length > 0) {
      const userData = response.data.results.find((data) => data.cid_no === cid)
      if (userData) {
        user.value = userData
      } else {
        error.value = 'User details not found for the given CID.'
      }
    } else {
      error.value = 'No user details found.'
    }
  } catch (err) {
    console.error('Error fetching user details:', err)
    error.value = 'Failed to fetch user details. Please try again later.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.selectedRecord,
  (newRecord) => {
    if (newRecord && newRecord.cid) {
      fetchUserDetails(newRecord.cid)
    } else {
      user.value = null
    }
  },
  { deep: true },
)

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal && props.selectedRecord && props.selectedRecord.cid) {
      fetchUserDetails(props.selectedRecord.cid)
    }
  },
  { immediate: true },
)

const closeModal = () => {
  emit('close')
  user.value = null
  error.value = null
}

const saveChanges = async () => {
  if (user.value && props.userId) {
    loading.value = true

    const userDataToUpdate = {
      full_name: user.value.full_name,
      gender: user.value.gender,
      contact_no: user.value.contact_no,
      date_of_birth: user.value.date_of_birth,
      status: user.value.status,
    }

    try {
      await apiServices.patchUser(props.userId, userDataToUpdate)
      emit('update')
      closeModal()
    } catch (err) {
      console.error('Failed to update user data:', err)
      error.value = 'Failed to save changes. Please try again.'
    } finally {
      loading.value = false
    }
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
