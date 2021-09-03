<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col transform transition-all"
      >
        <div
          class="flex items-center justify-between p-5 bg-indigo-600 text-white border-b border-indigo-700"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 class="text-xl font-bold" id="modal-title">Add New CAPA Record</h3>
          </div>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label for="institute" class="block text-sm font-semibold text-gray-600 mb-2"
                >Institute <span class="text-red-500">*</span></label
              >
              <select id="institute" v-model="selectedInstituteId" class="form-select" required>
                <option disabled value="">Select an institute</option>
                <option v-for="inst in institutes" :key="inst.id" :value="inst.id">
                  {{ inst.name_of_institution }}
                </option>
              </select>
            </div>
            <div>
              <label for="teaching-center" class="block text-sm font-semibold text-gray-600 mb-2"
                >Training Center</label
              >
              <select
                id="teaching-center"
                v-model="capaForm.teaching_center_id"
                class="form-select"
                :disabled="!selectedInstituteId"
              >
                <option :value="null">For Institute Only (No Training Center)</option>
                <option v-for="tc in availableTeachingCenters" :key="tc.id" :value="tc.id">
                  {{ tc.center_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label for="from-date" class="block text-sm font-semibold text-gray-600 mb-2"
                >Inspection From <span class="text-red-500">*</span></label
              >
              <input
                type="date"
                id="from-date"
                v-model="capaForm.inspection_from_date"
                class="form-input"
                required
              />
            </div>
            <div>
              <label for="to-date" class="block text-sm font-semibold text-gray-600 mb-2"
                >Inspection To <span class="text-red-500">*</span></label
              >
              <input
                type="date"
                id="to-date"
                v-model="capaForm.inspection_to_date"
                class="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label for="observation" class="block text-sm font-semibold text-gray-600 mb-2"
              >Observation Description <span class="text-red-500">*</span></label
            >
            <textarea
              id="observation"
              v-model="capaForm.observation_description"
              rows="5"
              class="form-textarea"
              required
              placeholder="Clearly describe the finding or observation..."
            ></textarea>
          </div>

          <div>
            <label for="comment" class="block text-sm font-semibold text-gray-600 mb-2"
              >Management Comment</label
            >
            <textarea
              id="comment"
              v-model="capaForm.management_comment"
              rows="4"
              class="form-textarea"
              placeholder="Optional: Add management comments or immediate actions taken..."
            ></textarea>
          </div>
        </form>

        <div
          class="bg-gray-100 px-8 py-4 border-t border-gray-200 flex justify-end items-center space-x-4"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="submitForm"
            class="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 border border-transparent rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            <svg
              class="w-5 h-5 mr-2 -ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
              />
            </svg>
            Save CAPA
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  show: Boolean,
  institutes: { type: Array, default: () => [] },
  teachingCenters: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'save'])
const toast = useToast()

const initialFormState = {
  institute_id: null,
  teaching_center_id: null,
  inspection_from_date: '',
  inspection_to_date: '',
  observation_description: '',
  management_comment: '',
}

const capaForm = ref({ ...initialFormState })
const selectedInstituteId = ref('')

const availableTeachingCenters = computed(() => {
  if (!selectedInstituteId.value) return []
  return props.teachingCenters.filter(
    (tc) => tc.institute_details?.id === selectedInstituteId.value
  )
})

watch(selectedInstituteId, (newId) => {
  capaForm.value.institute_id = newId
  capaForm.value.teaching_center_id = null
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      capaForm.value = { ...initialFormState }
      selectedInstituteId.value = ''
    }
  }
)

const submitForm = () => {
  if (!capaForm.value.institute_id) {
    toast.error('Please select an institute.')
    return
  }

  const payload = { ...capaForm.value }

  if (!payload.teaching_center_id) {
    delete payload.teaching_center_id
  }

  emit('save', payload)
}
</script>

<style scoped>
/* Base styling for all form controls */
.form-input,
.form-select,
.form-textarea {
  @apply block w-full px-4 py-2.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg shadow-sm
         transition-colors duration-200 ease-in-out
         focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:border-indigo-500 focus:outline-none sm:text-sm;
}

/* Style for disabled state */
.form-select:disabled {
  @apply bg-gray-200 cursor-not-allowed opacity-70;
}

/* Specific styling for date input placeholder text */
.form-input[type='date']::-webkit-calendar-picker-indicator {
  @apply cursor-pointer;
}
.form-input[type='date']:required:invalid::-webkit-datetime-edit {
  color: theme('colors.gray.400');
}

/* Customize scrollbar for the form content area */
form::-webkit-scrollbar {
  width: 8px;
}
form::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
  border-radius: 10px;
}
form::-webkit-scrollbar-thumb {
  background: theme('colors.gray.400');
  border-radius: 10px;
}
form::-webkit-scrollbar-thumb:hover {
  background: theme('colors.gray.500');
}
</style>