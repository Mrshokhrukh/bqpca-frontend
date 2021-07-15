<template>
  <div class="space-y-8">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100/80">
      <div class="p-6 md:p-8">
        <h2 class="text-xl font-bold text-gray-800 pb-4 border-b border-gray-200 mb-6">
          Add Single Participant
        </h2>

        <div class="space-y-8">
          <div>
            <label for="cpdTask" class="block text-sm font-medium text-gray-700 mb-1.5">
              CPD Task <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="cpdTask"
                v-model="formData.cpdTask"
                class="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                aria-required="true"
              >
                <option value="" disabled>Select an approved CPD task...</option>
                <option v-for="task in processedCpdTasks" :key="task.id" :value="task.id">
                  {{ task.title }} - {{ task.activity_date }}
                </option>
                <option v-if="processedCpdTasks.length === 0 && cpdTasks.length > 0" disabled>
                  No approved tasks found for your provider.
                </option>
                <option v-if="cpdTasks.length === 0" disabled>No CPD tasks are available.</option>
              </select>
              <ChevronDownIcon
                class="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              />
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Only approved tasks associated with your provider will be shown.
            </p>
          </div>

          <div>
            <Combobox as="div" v-model="selectedParticipant">
              <ComboboxLabel class="block text-sm font-medium text-gray-700 mb-1.5">
                Participant <span class="text-red-500">*</span>
              </ComboboxLabel>
              <div class="relative">
                <ComboboxInput
                  class="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  @change="participantQuery = $event.target.value"
                  :display-value="
                    (participant) =>
                      participant
                        ? `${participant.full_name || participant.name} - ${participant.reg_no}`
                        : ''
                  "
                  placeholder="Search by name or registration no..."
                />
                <ComboboxButton
                  class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                >
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                <transition
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ComboboxOptions
                    v-if="filteredParticipants.length > 0"
                    class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    <ComboboxOption
                      v-for="participant in filteredParticipants"
                      :key="participant.id || participant.reg_no"
                      :value="participant"
                      as="template"
                      v-slot="{ active, selected }"
                    >
                      <li
                        :class="[
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                        ]"
                      >
                        <span :class="['block truncate', selected && 'font-semibold']">
                          {{ participant.full_name || participant.name }} - {{ participant.reg_no }}
                        </span>
                        <span
                          v-if="selected"
                          :class="[
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-blue-600',
                          ]"
                        >
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ComboboxOption>
                  </ComboboxOptions>
                </transition>
                <div
                  v-if="participantQuery && filteredParticipants.length === 0"
                  class="mt-2 text-sm text-gray-500"
                >
                  No participants found matching "{{ participantQuery }}".
                </div>
              </div>
            </Combobox>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/70 px-6 py-4 rounded-b-2xl">
        <FormActions
          submitLabel="Add Participant"
          :disabled="!isFormValid || props.isSubmitting"
          :isLoading="props.isSubmitting"
          @submit="submitForm"
          @reset="resetForm"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
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
})

const participantQuery = ref('')
const selectedParticipant = ref(null)

const processedCpdTasks = computed(() => {
  if (!props.cpdTasks || props.cpdTasks.length === 0) {
    return []
  }
  return props.cpdTasks
    .filter((taskApp) => {
      const isApproved =
        taskApp.application_status === 'APPROVED' ||
        String(taskApp.application_status).toUpperCase() === 'APPROVED'
      if (!isApproved) return false
      if (props.currentProviderCid && taskApp.cid_no !== props.currentProviderCid) {
        return false
      }
      return true
    })
    .map((taskApp) => ({
      id: taskApp.id,
      title: taskApp.title_of_cpd || 'Untitled Task',
      activity_date: taskApp.from_date || 'No date available',
    }))
})

const filteredParticipants = computed(() => {
  if (participantQuery.value === '') {
    return props.participants.slice(0, 100) // Limit initial list for performance
  }
  const query = participantQuery.value.toLowerCase()
  return props.participants.filter((p) => {
    const name = (p.full_name || p.name || '').toLowerCase()
    const regNo = (p.reg_no || '').toLowerCase()
    return name.includes(query) || regNo.includes(query)
  })
})

const isFormValid = computed(() => {
  return formData.cpdTask && selectedParticipant.value
})

function submitForm() {
  if (!isFormValid.value) return
  const payload = {
    cpd_task: formData.cpdTask,
    participant_reg_no: selectedParticipant.value.reg_no,
  }
  emit('submit', payload)
}

function resetForm() {
  formData.cpdTask = ''
  selectedParticipant.value = null
  participantQuery.value = ''
}

// Ensure selected participant is still valid if the main list changes
watch(
  () => props.participants,
  (newParticipants) => {
    if (
      selectedParticipant.value &&
      !newParticipants.some((p) => p.reg_no === selectedParticipant.value.reg_no)
    ) {
      selectedParticipant.value = null
    }
  },
  { deep: true },
)

// Expose resetForm for parent component access
defineExpose({ resetForm })
</script>
