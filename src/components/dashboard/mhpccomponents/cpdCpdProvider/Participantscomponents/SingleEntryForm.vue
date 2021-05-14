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
              <!-- Uses processedCpdTasks for filtering -->
              <option v-for="task in processedCpdTasks" :key="task.id" :value="task.id">
                {{ task.title }} - {{ task.activity_date }}
              </option>
              <option v-if="processedCpdTasks.length === 0 && cpdTasks.length > 0" disabled>
                No approved tasks found for your provider.
              </option>
              <option v-if="cpdTasks.length === 0" disabled>
                No CPD tasks available.
              </option>
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
                  <!-- participants prop should be the list of all users -->
                  <option
                    v-for="participant in participants"
                    :key="participant.id || participant.reg_no"
                    :value="participant.reg_no"
                  >
                    {{ participant.full_name || participant.name }} - {{ participant.reg_no }}
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg No</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="participant in filteredParticipantsForModal" :key="participant.id || participant.reg_no">
                  <td class="px-6 py-4 whitespace-nowrap">{{ participant.full_name || participant.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ participant.reg_no }}</td>
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
                    No participants found. Try a different search term or ensure participants are loaded.
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
import FormActions from './FormActions.vue' // Assuming this is a generic actions component

const props = defineProps({
  cpdTasks: { // Raw list of CPD Provider Applications
    type: Array,
    default: () => [],
  },
  participants: { // List of ALL potential participants (users)
    type: Array,
    default: () => [],
  },
  currentProviderCid: { // CID of the logged-in provider
    type: String,
    default: null,
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',          // Will store the ID of the selected CpdProviderApplication
  participantRegNo: '', // Will store the reg_no of the selected participant
})

// For participant search modal
const searchParticipantModal = ref(false)
const participantSearch = ref('')
const filteredParticipantsForModal = ref([])

// Computed property to filter and map CPD tasks for the dropdown
const processedCpdTasks = computed(() => {
  if (!props.cpdTasks || props.cpdTasks.length === 0) {
    return [];
  }
  return props.cpdTasks
    .filter(taskApp => {
      // Condition 1: Application must be approved
      const isApproved = taskApp.is_cpd_approved === true;
      if (!isApproved) return false;

      // Condition 2: Must belong to the current provider (if currentProviderCid is specified)
      // The CpdProviderApplication object has 'cid_no' which should be the provider's CID.
      if (props.currentProviderCid && taskApp.cid_no !== props.currentProviderCid) {
        return false;
      }
      // If currentProviderCid is null (e.g., admin), all approved tasks are shown.
      // You might want to adjust this if a provider context is ALWAYS required.
      // For now, if props.currentProviderCid is null/empty, this specific filter by CID is skipped.
      // However, the is_cpd_approved filter still applies.

      return true; // Passed all filters
    })
    .map(taskApp => ({
      id: taskApp.id, // ID of the CpdProviderApplication
      title: taskApp.title_of_cpd || 'Untitled Task',
      activity_date: taskApp.from_date || 'No date available'
    }));
});

const isFormValid = computed(() => {
  return formData.cpdTask && formData.participantRegNo;
});

function searchParticipantsInModal() {
  if (!participantSearch.value.trim()) {
    filteredParticipantsForModal.value = props.participants; // Show all if search is empty
    return;
  }
  const search = participantSearch.value.toLowerCase();
  filteredParticipantsForModal.value = props.participants.filter((p) => {
    const name = (p.full_name || p.name || '').toLowerCase();
    const regNo = (p.reg_no || '').toLowerCase();
    return name.includes(search) || regNo.includes(search);
  });
}

function selectParticipantFromModal(participant) {
  formData.participantRegNo = participant.reg_no;
  searchParticipantModal.value = false;
}

function submitForm() {
  if (!isFormValid.value) return;
  const payload = {
    cpd_task: formData.cpdTask, // This is the ID of the CpdProviderApplication
    participant_reg_no: formData.participantRegNo,
  };
  emit('submit', payload); // Emit the payload for the parent to handle
}

function resetForm() {
  formData.cpdTask = '';
  formData.participantRegNo = '';
  participantSearch.value = '';
  // Re-initialize modal participants if needed, or let it be handled by next open
  if (props.participants) {
      filteredParticipantsForModal.value = [...props.participants];
  } else {
      filteredParticipantsForModal.value = [];
  }
}

// Initialize filteredParticipantsForModal for the search modal when participants prop changes or on mount
watch(
  () => props.participants,
  (newVal) => {
    filteredParticipantsForModal.value = newVal ? [...newVal] : [];
  },
  { immediate: true, deep: true } // deep true if participants array contains objects that might change
);

// Watch for changes in cpdTasks to ensure processedCpdTasks updates,
// and if the selected cpdTask is no longer valid, reset it.
watch(() => processedCpdTasks.value, (newProcessedTasks) => {
    if (formData.cpdTask && !newProcessedTasks.some(task => task.id === formData.cpdTask)) {
        formData.cpdTask = ''; // Reset if current selection is no longer valid
    }
});

// Watch for changes in participants to ensure selected participantRegNo is still valid.
watch(() => props.participants, (newParticipants) => {
    if (formData.participantRegNo && !newParticipants.some(p => p.reg_no === formData.participantRegNo)) {
        formData.participantRegNo = ''; // Reset if current selection is no longer valid
    }
}, { deep: true });

</script>