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
              <option v-for="task in cpdTasks" :key="task.id" :value="task.id">
                {{ task.title || 'Untitled Task' }} - {{ task.activity_date || 'No date' }}
              </option>
            </select>
            <MagnifyingGlassIcon
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Select the CPD task this participant is associated with
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
                  <option
                    v-for="participant in participants"
                    :key="participant.id || participant.reg_no"
                    :value="participant.reg_no"
                  >
                    {{ participant.full_name || participant.name }} - {{ participant.reg_no }}
                  </option>
                </select>
              </div>
              <button
                @click="searchParticipantModal = true"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <MagnifyingGlassIcon class="h-5 w-5" />
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Choose the participant from the registered list
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <FormActions
      submitLabel="Submit"
      :disabled="!isFormValid"
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
              @keyup.enter="searchParticipants"
            />
            <button
              @click="searchParticipants"
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
                <tr v-for="(participant, index) in filteredParticipants" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ participant.full_name || participant.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ participant.reg_no }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="selectParticipant(participant)"
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Select
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredParticipants.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                    No participants found. Try a different search term.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="p-4 border-t flex justify-end space-x-3">
          <button
            @click="searchParticipantModal = false"
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
import apiService from '@/services/services'

const props = defineProps({
  cpdTasks: {
    type: Array,
    default: () => [],
  },
  participants: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',
  participantRegNo: '',
})

// For participant search
const searchParticipantModal = ref(false)
const participantSearch = ref('')
const filteredParticipants = ref([])

const isFormValid = computed(() => {
  return formData.cpdTask && formData.participantRegNo
})

function searchParticipants() {
  if (!participantSearch.value.trim()) {
    filteredParticipants.value = props.participants
    return
  }

  const search = participantSearch.value.toLowerCase()
  filteredParticipants.value = props.participants.filter((p) => {
    const name = (p.full_name || p.name || '').toLowerCase()
    const regNo = (p.reg_no || '').toLowerCase()
    return name.includes(search) || regNo.includes(search)
  })
}

function selectParticipant(participant) {
  formData.participantRegNo = participant.reg_no
  searchParticipantModal.value = false
}

async function submitForm() {
  if (!isFormValid.value) return

  try {
    // Prepare the payload according to the expected API format
    const payload = {
      cpd_task: formData.cpdTask,
      participant_reg_no: formData.participantRegNo,
    }

    const response = await apiService.createMhpcCpdTaskParticipant(payload)

    emit('submit', response.data)
    resetForm()
  } catch (error) {
    console.error('Error submitting participant:', error)
    alert('Failed to add participant. Please try again.')
  }
}

function resetForm() {
  Object.assign(formData, {
    cpdTask: '',
    participantRegNo: '',
  })
}

// Initialize filtered participants
watch(
  () => props.participants,
  (newVal) => {
    filteredParticipants.value = newVal
  },
  { immediate: true },
)
</script>
