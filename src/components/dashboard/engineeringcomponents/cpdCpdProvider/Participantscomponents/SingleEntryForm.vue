<!-- SingleEntryForm.vue -->
<template>
  <div class="space-y-6">
    <!-- CPD Task Selection Section -->
    <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
      <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
        CPD Task & Participant Selection
      </h2>

      <div class="space-y-6">
        <div>
          <label for="cpdTask" class="block text-sm font-medium text-gray-700 mb-2">
            CPD Task <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select
              id="cpdTask"
              v-model="formData.cpdTask"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
              aria-required="true"
              aria-label="CPD Task"
            >
              <option value="">Select a CPD task</option>
              <!-- FIXED: Use processedCpdTasks with correct field mapping -->
              <option v-for="task in processedCpdTasks" :key="task.id" :value="task.id">
                {{ task.title }} - {{ task.activity_date }}
              </option>
              <option v-if="processedCpdTasks.length === 0 && cpdTasks.length > 0" disabled>
                No approved tasks found for your provider.
              </option>
              <option v-if="cpdTasks.length === 0" disabled>No CPD tasks available.</option>
            </select>
            <MagnifyingGlassIcon
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Select an approved CPD task associated with your provider.
          </p>
        </div>

        <div>
          <label for="participantRegNo" class="block text-sm font-medium text-gray-700 mb-2">
            Participant <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="flex space-x-2">
              <div class="flex-grow">
                <select
                  id="participantRegNo"
                  v-model="formData.participantRegNo"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                  aria-required="true"
                  aria-label="Participant Registration Number"
                >
                  <option value="">Select a participant</option>
                  <!-- FIXED: Handle different possible field names for registration number -->
                  <option
                    v-for="participant in participants"
                    :key="participant.id || participant.registration_no || participant.reg_no"
                    :value="getParticipantRegNo(participant)"
                  >
                    {{ getParticipantName(participant) }} - {{ getParticipantRegNo(participant) }}
                  </option>
                  <option v-if="participants.length === 0" disabled>
                    No participants available to select.
                  </option>
                </select>
              </div>
              <button
                @click="searchParticipantModal = true"
                type="button"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <MagnifyingGlassIcon class="h-5 w-5" />
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Choose the participant from the registered list of users.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <FormActions
      submitLabel="Add Participant to Task"
      :disabled="!isFormValid || isSubmitting"
      :is-submitting="isSubmitting"
      @submit="submitForm"
      @reset="resetForm"
      @cancel="$emit('cancel')"
    />

    <!-- Participant Search Modal -->
    <div
      v-if="searchParticipantModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold">Search Participant</h3>
          <p class="text-sm text-gray-500">Enter registration number or name to search</p>
        </div>
        <div class="p-4">
          <div class="flex space-x-2 mb-4">
            <input
              type="text"
              v-model="participantSearch"
              class="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              placeholder="Search by name or registration number"
              @keyup.enter="searchParticipantsInModal"
            />
            <button
              @click="searchParticipantsInModal"
              type="button"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Search
            </button>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reg No
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="participant in filteredParticipantsForModal"
                  :key="participant.id || getParticipantRegNo(participant)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">{{ getParticipantName(participant) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ getParticipantRegNo(participant) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="selectParticipantFromModal(participant)"
                      type="button"
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Select
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredParticipantsForModal.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                    No participants found. Try a different search term or ensure participants are
                    loaded.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="p-4 border-t flex justify-end space-x-3">
          <button
            @click="searchParticipantModal = false"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue'

const props = defineProps({
  cpdTasks: {
    type: Array,
    default: () => [],
  },
  participants: {
    type: Array,
    default: () => [],
  },
  currentProviderCid: {
    type: String,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',
  participantRegNo: '',
})

// For participant search modal
const searchParticipantModal = ref(false)
const participantSearch = ref('')
const filteredParticipantsForModal = ref([])

// FIXED: Helper functions to handle different field name variations
function getParticipantName(participant) {
  return participant.full_name || participant.name || 'Unknown Name'
}

function getParticipantRegNo(participant) {
  return participant.registration_no || participant.reg_no || participant.registrationNo || ''
}

// FIXED: Updated to use correct field names from your API data
const processedCpdTasks = computed(() => {
  if (!props.cpdTasks || props.cpdTasks.length === 0) {
    return []
  }

  return props.cpdTasks
    .filter((taskApp) => {
      // Condition 1: Application must be approved
      const isApproved = taskApp.is_cpd_approved === true
      if (!isApproved) return false

      // Condition 2: Must belong to the current provider (if currentProviderCid is specified)
      if (props.currentProviderCid && taskApp.cid_no !== props.currentProviderCid) {
        return false
      }

      return true
    })
    .map((taskApp) => ({
      id: taskApp.id,
      // FIXED: Use 'title' instead of 'title_of_cpd' based on your API data
      title: taskApp.title || taskApp.title_of_cpd || 'Untitled Task',
      // FIXED: Use 'from_date' which exists in your data
      activity_date: taskApp.from_date || taskApp.start_date || 'No date available',
    }))
})

const isFormValid = computed(() => {
  return !!(formData.cpdTask && formData.participantRegNo)
})

function searchParticipantsInModal() {
  if (!participantSearch.value.trim()) {
    filteredParticipantsForModal.value = props.participants
    return
  }
  const search = participantSearch.value.toLowerCase()
  filteredParticipantsForModal.value = props.participants.filter((p) => {
    const name = getParticipantName(p).toLowerCase()
    const regNo = getParticipantRegNo(p).toLowerCase()
    return name.includes(search) || regNo.includes(search)
  })
}

function selectParticipantFromModal(participant) {
  formData.participantRegNo = getParticipantRegNo(participant)
  searchParticipantModal.value = false
}

function submitForm() {
  if (!isFormValid.value) {
    return
  }

  const payload = {
    cpd_task: parseInt(formData.cpdTask), // Ensure it's a number
    participant_reg_no: formData.participantRegNo,
  }

  emit('submit', payload)
}

function resetForm(clearSelection = true) {
  if (clearSelection) {
    formData.cpdTask = ''
    formData.participantRegNo = ''
  }
  participantSearch.value = ''
  if (props.participants) {
    filteredParticipantsForModal.value = [...props.participants]
  } else {
    filteredParticipantsForModal.value = []
  }
}

// Initialize filteredParticipantsForModal for the search modal
watch(
  () => props.participants,
  (newVal) => {
    filteredParticipantsForModal.value = newVal ? [...newVal] : []
  },
  { immediate: true, deep: true },
)

// Watch for changes in processedCpdTasks
watch(
  () => processedCpdTasks.value,
  (newProcessedTasks) => {
    if (formData.cpdTask && !newProcessedTasks.some((task) => task.id == formData.cpdTask)) {
      formData.cpdTask = ''
    }
  },
)

// Watch for changes in participants
watch(
  () => props.participants,
  (newParticipants) => {
    if (
      formData.participantRegNo &&
      !newParticipants.some((p) => getParticipantRegNo(p) === formData.participantRegNo)
    ) {
      formData.participantRegNo = ''
    }
  },
  { deep: true },
)

// Expose resetForm method to parent component
defineExpose({
  resetForm,
})
</script>
