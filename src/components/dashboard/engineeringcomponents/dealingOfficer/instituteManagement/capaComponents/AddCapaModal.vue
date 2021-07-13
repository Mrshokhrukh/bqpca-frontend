<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-gray-50 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
        >
          <!-- Header -->
          <div class="bg-white px-6 py-5 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                  {{ capaId ? 'Edit Corrective Action' : 'Add Corrective Action' }}
                </h3>
                <p v-if="instituteName" class="mt-1 text-sm text-indigo-600 font-medium">
                  For: {{ instituteName }}
                </p>
              </div>
              <button
                @click="$emit('close')"
                class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">Close</span>
                <XIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Form content -->
          <form @submit.prevent="submitForm">
            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div class="lg:grid lg:grid-cols-5 lg:gap-8">
                <!-- Left Column: Context -->
                <div class="lg:col-span-2 space-y-6">
                  <fieldset>
                    <legend class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        class="h-5 w-5 mr-2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M4.555 5.168A7.5 7.5 0 0112 3a7.5 7.5 0 017.445 2.168l-2.522 2.522a3 3 0 10-4.242 4.242l-2.523 2.523A7.5 7.5 0 014.555 5.168z"
                        />
                        <path
                          d="M14.445 14.832A7.5 7.5 0 018 17a7.5 7.5 0 01-7.445-2.168l2.522-2.522a3 3 0 104.242-4.242l2.523-2.523A7.5 7.5 0 0114.445 14.832z"
                        />
                      </svg>
                      Facility & Inspection
                    </legend>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Institute <span class="text-red-500">*</span></label
                        >
                        <select
                          v-model="capaForm.institute"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                          required
                        >
                          <option v-if="isLoadingInstitutes" disabled value="">
                            Loading institutes...
                          </option>
                          <option v-else value="" disabled>Select an Institute</option>
                          <option v-for="inst in institutes" :key="inst.id" :value="inst.id">
                            {{ inst.name_of_institution }}
                          </option>
                        </select>
                        <div v-if="instituteError" class="text-red-500 text-xs mt-1">
                          {{ instituteError }}
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700"
                          >Facility <span class="text-red-500">*</span></label
                        >
                        <select
                          v-model="capaForm.teaching_center"
                          @change="updateAutoFields"
                          :disabled="isLoadingFacilities || !capaForm.institute"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed p-2"
                          required
                        >
                          <option v-if="isLoadingFacilities" disabled value="">
                            Loading facilities...
                          </option>
                          <option v-else-if="!capaForm.institute" disabled value="">
                            Select institute first
                          </option>
                          <option v-else value="" disabled>Select a Facility</option>
                          <option
                            v-for="center in filteredTeachingCenters"
                            :key="center.id"
                            :value="center.id"
                          >
                            {{ center.center_name }}
                          </option>
                        </select>
                        <div v-if="facilityError" class="text-red-500 text-xs mt-1">
                          {{ facilityError }}
                        </div>
                      </div>
                      <div class="border-t border-gray-200 pt-4 space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-500"
                            >Dzongkhag/Throme</label
                          ><input
                            type="text"
                            :value="capaForm.dzongkhag"
                            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500">City/Gewog</label
                          ><input
                            type="text"
                            :value="capaForm.city"
                            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-500"
                            >Address/Location</label
                          ><input
                            type="text"
                            :value="capaForm.address"
                            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm cursor-not-allowed"
                            disabled
                          />
                        </div>
                      </div>
                      <div
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-4"
                      >
                        <div>
                          <label
                            for="inspection_from_date"
                            class="block text-sm font-medium text-gray-700"
                            >Inspection From <span class="text-red-500">*</span></label
                          ><input
                            type="date"
                            id="inspection_from_date"
                            v-model="capaForm.inspection_from_date"
                            @change="updateImplementationTimeline"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label
                            for="inspection_to_date"
                            class="block text-sm font-medium text-gray-700"
                            >Inspection To <span class="text-red-500">*</span></label
                          ><input
                            type="date"
                            id="inspection_to_date"
                            v-model="capaForm.inspection_to_date"
                            @change="updateImplementationTimeline"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <!-- Right Column: Details -->
                <div class="lg:col-span-3 mt-6 lg:mt-0 space-y-6">
                  <fieldset>
                    <legend class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        class="h-5 w-5 mr-2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Observation & Action Plan
                    </legend>
                    <div class="space-y-4">
                      <div>
                        <label
                          for="observation_description"
                          class="block text-sm font-medium text-gray-700"
                          >Observation Description <span class="text-red-500">*</span></label
                        ><textarea
                          id="observation_description"
                          v-model="capaForm.observation_description"
                          rows="4"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label for="root_cause" class="block text-sm font-medium text-gray-700"
                          >Root Cause <span class="text-red-500">*</span></label
                        ><textarea
                          id="root_cause"
                          v-model="capaForm.root_cause"
                          rows="4"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label for="capa" class="block text-sm font-medium text-gray-700"
                          >Corrective & Preventive Action (CAPA)
                          <span class="text-red-500">*</span></label
                        ><textarea
                          id="capa"
                          v-model="capaForm.capa"
                          rows="4"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        ></textarea>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            for="implementation_timeline"
                            class="block text-sm font-medium text-gray-500"
                            >Implementation Timeline</label
                          ><input
                            type="text"
                            id="implementation_timeline"
                            v-model="capaForm.implementation_timeline"
                            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 sm:text-sm cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <div>
                          <label for="status" class="block text-sm font-medium text-gray-700"
                            >Status <span class="text-red-500">*</span></label
                          ><select
                            id="status"
                            v-model="capaForm.status"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value="" disabled>Select Status</option>
                            <option value="P">Pending</option>
                            <option value="R">Resolved</option>
                            <option value="C">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label
                          for="management_comment"
                          class="block text-sm font-medium text-gray-700"
                          >Management’s Comment</label
                        ><textarea
                          id="management_comment"
                          v-model="capaForm.management_comment"
                          rows="2"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="bg-gray-100 px-6 py-4 border-t border-gray-200 sm:flex sm:flex-row-reverse rounded-b-2xl"
            >
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2.5 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                <span v-if="isLoading">Saving...</span>
                <span v-else>{{ capaId ? 'Update CAPA' : 'Save CAPA' }}</span>
              </button>
              <button
                v-if="!capaId"
                type="button"
                @click="addAnother"
                :disabled="isLoading"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2.5 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Add Another
              </button>
              <button
                type="button"
                @click="$emit('close')"
                :disabled="isLoading"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { XIcon } from 'lucide-vue-next'
import apiService from '@/services/services'

const props = defineProps({
  show: Boolean,
  instituteId: [Number, String],
  instituteName: String,
  capaId: [Number, String],
  capa: Object,
})

const emit = defineEmits(['close', 'save', 'update'])

const institutes = ref([])
const teachingCenters = ref([])
const filteredTeachingCenters = ref([])
const instituteError = ref('')
const facilityError = ref('')
const isLoadingInstitutes = ref(false)
const isLoadingFacilities = ref(false)
const isLoading = ref(false)

const capaForm = ref({
  institute: props.instituteId || '',
  teaching_center: '',
  dzongkhag: '',
  city: '',
  address: '',
  inspection_from_date: '',
  inspection_to_date: '',
  observation_description: '',
  root_cause: '',
  capa: '',
  implementation_timeline: '',
  management_comment: '',
  remarks: '',
  status: 'P',
})

const fetchInstitutes = async () => {
  isLoadingInstitutes.value = true
  try {
    const response = await apiService.getEpcInstitutes()
    const data = response.data.results || response.data || []
    institutes.value = data.map((item) => ({
      id: item.id || item.institute_id,
      name_of_institution: item.name_of_institution || item.name || item.institute_name,
    }))
    instituteError.value = institutes.value.length ? '' : 'No institutes registered in the system'
    nextTick(() => {
      updateFilteredTeachingCenters()
    })
  } catch (error) {
    console.error('Error fetching institutes:', error)
    instituteError.value = 'Failed to load institutes. Please try again.'
  } finally {
    isLoadingInstitutes.value = false
  }
}

const fetchTeachingCenters = async () => {
  isLoadingFacilities.value = true
  try {
    const response = await apiService.getEpcTeachingCenters()
    const data = response?.data?.results || response?.data || []
    teachingCenters.value = data
      .map((item) => {
        const instituteId = item.institute?.id || item.institute_id || null
        return {
          id: item.id,
          center_name: item.center_name || 'Unnamed Center',
          institute: instituteId,
          dzongkhag: item.state_dzongkhag || 'N/A',
          city: item.city_gewog || 'N/A',
          address: item.center_location || 'N/A',
        }
      })
      .filter((center) => center.id != null)
    nextTick(() => {
      updateFilteredTeachingCenters()
    })
  } catch (error) {
    console.error('Error fetching or processing teaching centers:', error)
    facilityError.value = 'Failed to load facilities. Please check console.'
    teachingCenters.value = []
  } finally {
    isLoadingFacilities.value = false
  }
}

const updateFilteredTeachingCenters = () => {
  facilityError.value = ''
  if (capaForm.value.institute) {
    const selectedInstituteId = String(capaForm.value.institute)
    filteredTeachingCenters.value = teachingCenters.value.filter(
      (center) => String(center.institute) === selectedInstituteId,
    )
    if (filteredTeachingCenters.value.length === 0 && !isLoadingFacilities.value) {
      facilityError.value = 'No facilities found for this institute.'
    }
  } else {
    filteredTeachingCenters.value = []
  }

  if (
    capaForm.value.teaching_center &&
    !filteredTeachingCenters.value.some((tc) => tc.id === capaForm.value.teaching_center)
  ) {
    capaForm.value.teaching_center = ''
    updateAutoFields()
  }
}

const updateAutoFields = () => {
  const selectedId = capaForm.value.teaching_center
  if (!selectedId) {
    capaForm.value.dzongkhag = ''
    capaForm.value.city = ''
    capaForm.value.address = ''
    return
  }
  const selectedCenter = teachingCenters.value.find((center) => center.id == selectedId)
  if (selectedCenter) {
    capaForm.value.dzongkhag = selectedCenter.dzongkhag ?? 'N/A'
    capaForm.value.city = selectedCenter.city ?? 'N/A'
    capaForm.value.address = selectedCenter.address ?? 'N/A'
  } else {
    capaForm.value.dzongkhag = ''
    capaForm.value.city = ''
    capaForm.value.address = ''
  }
}

const resetForm = (keepInstitute = false) => {
  const instituteToKeep = keepInstitute ? capaForm.value.institute : props.instituteId || ''
  capaForm.value = {
    institute: instituteToKeep,
    teaching_center: '',
    dzongkhag: '',
    city: '',
    address: '',
    inspection_from_date: '',
    inspection_to_date: '',
    observation_description: '',
    root_cause: '',
    capa: '',
    implementation_timeline: '',
    management_comment: '',
    remarks: '',
    status: 'P',
  }
  nextTick(() => {
    updateFilteredTeachingCenters()
    updateAutoFields()
    updateImplementationTimeline()
  })
}

const prefillForm = () => {
  if (props.capa && props.capaId) {
    capaForm.value = { ...props.capa }
    nextTick(() => {
      updateFilteredTeachingCenters()
      updateAutoFields()
      updateImplementationTimeline()
    })
  } else {
    resetForm()
  }
}

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      Promise.all([fetchInstitutes(), fetchTeachingCenters()]).then(() => {
        if (props.capaId && props.capa) {
          prefillForm()
        } else {
          resetForm()
        }
      })
    }
  },
)

watch(
  () => props.instituteId,
  (newValue) => {
    if (newValue !== capaForm.value.institute) {
      capaForm.value.institute = newValue || ''
    }
  },
)

watch(
  () => capaForm.value.institute,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      capaForm.value.teaching_center = ''
      nextTick(() => {
        updateFilteredTeachingCenters()
        updateAutoFields()
      })
    }
  },
)

const updateImplementationTimeline = () => {
  if (capaForm.value.inspection_from_date && capaForm.value.inspection_to_date) {
    const fromDate = new Date(capaForm.value.inspection_from_date)
    const toDate = new Date(capaForm.value.inspection_to_date)
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || toDate < fromDate) {
      capaForm.value.implementation_timeline = 'Invalid date range'
      return
    }
    const timeDiff = toDate.getTime() - fromDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
    capaForm.value.implementation_timeline = `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`
  } else {
    capaForm.value.implementation_timeline = ''
  }
}

const submitForm = async () => {
  const requiredFields = [
    'institute',
    'teaching_center',
    'inspection_from_date',
    'inspection_to_date',
    'observation_description',
    'root_cause',
    'capa',
    'status',
  ]
  const missingFields = requiredFields.filter((field) => !capaForm.value[field])

  if (missingFields.length > 0) {
    alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
    return
  }

  isLoading.value = true
  try {
    if (props.capaId) {
      await emit('update', { id: props.capaId, ...capaForm.value })
    } else {
      await emit('save', capaForm.value)
    }
  } catch (error) {
    console.error('Submission failed:', error)
    alert('There was an error saving the CAPA. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const addAnother = async () => {
  const requiredFields = [
    'institute',
    'teaching_center',
    'inspection_from_date',
    'inspection_to_date',
    'observation_description',
    'root_cause',
    'capa',
    'status',
  ]
  const missingFields = requiredFields.filter((field) => !capaForm.value[field])
  if (missingFields.length > 0) {
    alert(`Please fill in all required fields before adding another: ${missingFields.join(', ')}`)
    return
  }

  isLoading.value = true
  try {
    await emit('save', capaForm.value)
    resetForm(true)
  } catch (error) {
    console.error('Submission failed:', error)
    alert('There was an error saving the CAPA. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>
