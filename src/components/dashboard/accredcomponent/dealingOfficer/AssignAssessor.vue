<template>
  <div class="container mx-auto px-4 sm:px-8">
    <div class="py-8">
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  User Name
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Verification Date
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Assign Assessor
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Send COI
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in verifiedUsers" :key="user.userId">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.userId }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.userName }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.verificationDate }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                    :class="getStatusClass(user.status)"
                  >
                    <span
                      aria-hidden
                      class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                      :class="getStatusBackgroundClass(user.status)"
                    ></span>
                    <span class="relative">{{ user.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    @click="openAssessorModal(user)"
                    class="inline-block text-center py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md transition duration-200"
                  >
                    {{ user.assessorAssigned ? 'Re-assign Assessor' : 'Assign Assessor' }}
                  </button>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    @click="sendCOI(user)"
                    :disabled="!user.assessorAssigned || user.coiSent"
                    class="inline-block text-center py-2 px-4 bg-green-500 hover:bg-green-700 text-white text-sm rounded-md transition duration-200"
                    :class="{
                      'opacity-50 cursor-not-allowed': !user.assessorAssigned || user.coiSent,
                    }"
                  >
                    {{ user.coiSent ? 'COI Sent' : 'Send COI' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Assessor Selection Modal -->
    <div
      v-if="isAssessorModalOpen"
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="closeAssessorModal"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Select Assessor
            </h3>
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                Choose an assessor from the list below to assign to user:
                <strong>{{ selectedUserForAssessor?.userName }}</strong
                >.
              </p>
              <ul class="mt-4 space-y-2">
                <li
                  v-for="assessor in availableAssessors"
                  :key="assessor.id"
                  class="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                  @click="confirmAssignAssessor(selectedUserForAssessor, assessor)"
                >
                  {{ assessor.name }}
                </li>
                <li v-if="availableAssessors.length === 0" class="text-sm text-gray-500">
                  No assessors available at the moment.
                </li>
              </ul>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeAssessorModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Simulate assessor pool
const assessorPool = ref([
  { id: 'assessor-1', name: 'Dr. Alice Johnson' },
  { id: 'assessor-2', name: 'Prof. Bob Williams' },
  { id: 'assessor-3', name: 'Dr. Charlie Brown' },
  { id: 'assessor-4', name: 'Dr. David Lee' },
  { id: 'assessor-5', name: 'Prof. Emily Davis' },
])

const verifiedUsers = ref([
  {
    userId: 'USER-001',
    userName: 'Institution A User',
    verificationDate: '2024-08-25',
    status: 'Verified',
    assessorAssigned: false,
    assessor: null,
    coiSent: false,
  },
  {
    userId: 'USER-002',
    userName: 'College B User',
    verificationDate: '2024-08-26',
    status: 'Assessor Assigned',
    assessor: { id: 'assessor-2', name: 'Prof. Bob Williams' }, // Example of pre-assigned assessor
    coiSent: false,
  },
  {
    userId: 'USER-003',
    userName: 'University C User',
    verificationDate: '2024-08-27',
    status: 'Verified',
    assessorAssigned: false,
    assessor: null,
    coiSent: false,
  },
  // ... more users
])

const isAssessorModalOpen = ref(false)
const selectedUserForAssessor = ref(null)
const availableAssessors = ref([]) // Store assessors to display in modal

const openAssessorModal = (user) => {
  selectedUserForAssessor.value = user
  // Get available assessors (excluding already assigned ones)
  availableAssessors.value = assessorPool.value.filter(
    (assessor) => !verifiedUsers.value.some((u) => u.assessor && u.assessor.id === assessor.id),
  )
  isAssessorModalOpen.value = true
}

const closeAssessorModal = () => {
  isAssessorModalOpen.value = false
  selectedUserForAssessor.value = null
  availableAssessors.value = [] // Clear assessors when modal closes
}

const confirmAssignAssessor = (user, assessor) => {
  if (user && assessor) {
    user.assessor = assessor
    user.assessorAssigned = true
    user.status = 'Assessor Assigned' // Update status
    console.log(`Assessor ${assessor.name} assigned to user ${user.userId}`)
    closeAssessorModal()
    // In a real application, you would likely update this on the server and refresh data
  }
}

const sendCOI = (user) => {
  if (user.assessorAssigned && !user.coiSent) {
    const confirmation = confirm(
      `Are you sure you want to send COI to ${user.userName} with assessor ${user.assessor.name}?`,
    )
    if (confirmation) {
      // Simulate sending COI with assessor information
      alert(`COI Sent to ${user.userName} with Assessor: ${user.assessor.name}`)
      user.coiSent = true
      user.status = 'COI Sent' // Update status
      console.log(`COI sent to user ${user.userId} with assessor ${user.assessor.name}`)
      // In a real application, you would trigger an actual email/notification sending process here
    }
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Verified':
      return 'text-blue-900'
    case 'Assessor Assigned':
      return 'text-purple-900'
    case 'COI Sent':
      return 'text-green-900'
    default:
      return 'text-gray-900'
  }
}
const getStatusBackgroundClass = (status) => {
  switch (status) {
    case 'Verified':
      return 'bg-blue-200'
    case 'Assessor Assigned':
      return 'bg-purple-200'
    case 'COI Sent':
      return 'bg-green-200'
    default:
      return 'bg-gray-200'
  }
}
</script>
