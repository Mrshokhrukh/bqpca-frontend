<template>
  <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ capaId ? 'Edit CAPA' : 'Add CAPA' }} for {{ instituteName || 'Select Institute' }}
            </h3>
            <button @click="$emit('close')"
              class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400">
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Form content -->
          <!-- The @submit.prevent on the form will now handle the submission -->
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="px-6 pt-6 pb-4 max-h-[70vh] overflow-y-auto">
              <!-- Facility Details Section -->
              <div class="space-y-6">
                <h4 class="text-sm font-medium text-gray-700">Facility Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Name of Institute <span class="text-red-500">*</span>
                    </label>
                    <select v-model="capaForm.institute"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required>
                      <option value="" disabled>Select Institute</option>
                      <option v-for="inst in institutes" :key="inst.id" :value="inst.id">
                        {{ inst.name_of_institution }}
                      </option>
                    </select>
                    <div v-if="instituteError" class="text-red-500 text-xs mt-1">{{ instituteError }}</div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Name of Facility <span class="text-red-500">*</span>
                    </label>
                    <select v-model="capaForm.teaching_center"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required @change="updateAutoFields">
                      <option value="" disabled>Select Facility</option>
                      <option v-for="center in filteredTeachingCenters" :key="center.id" :value="center.id">
                        {{ center.center_name }}
                      </option>
                    </select>
                    <div v-if="facilityError" class="text-red-500 text-xs mt-1">{{ facilityError }}</div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Dzongkhag/Throme
                    </label>
                    <input type="text"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                      :value="capaForm.dzongkhag" readonly />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      City/Gewog
                    </label>
                    <input type="text"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                      :value="capaForm.city" readonly />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Address/Location
                    </label>
                    <input type="text"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                      :value="capaForm.address" readonly />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="inspection_from_date" class="block text-sm font-medium text-gray-700">
                      Inspection From Date <span class="text-red-500">*</span>
                    </label>
                    <input type="date" id="inspection_from_date" v-model="capaForm.inspection_from_date"
                      @change="updateImplementationTimeline"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required />
                  </div>
                  <div class="space-y-2">
                    <label for="inspection_to_date" class="block text-sm font-medium text-gray-700">
                      Inspection To Date <span class="text-red-500">*</span>
                    </label>
                    <input type="date" id="inspection_to_date" v-model="capaForm.inspection_to_date"
                      @change="updateImplementationTimeline"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required />
                  </div>
                </div>
              </div>

              <!-- Observation Details Section -->
              <div class="pt-2 border-t border-gray-200 space-y-6">
                <h4 class="text-sm font-medium text-gray-700">Observation Details</h4>
                <div class="space-y-2">
                  <label for="observation_description" class="block text-sm font-medium text-gray-700">
                    Observation Description <span class="text-red-500">*</span>
                  </label>
                  <textarea id="observation_description" v-model="capaForm.observation_description" rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required></textarea>
                </div>
                <div class="space-y-2">
                  <label for="root_cause" class="block text-sm font-medium text-gray-700">
                    Root Cause <span class="text-red-500">*</span>
                  </label>
                  <textarea id="root_cause" v-model="capaForm.root_cause" rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required></textarea>
                </div>
                <div class="space-y-2">
                  <label for="capa" class="block text-sm font-medium text-gray-700">
                    CAPA <span class="text-red-500">*</span>
                  </label>
                  <textarea id="capa" v-model="capaForm.capa" rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required></textarea>
                </div>
                <div class="space-y-2">
                  <label for="implementation_timeline" class="block text-sm font-medium text-gray-700">
                    Implementation Timeline <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="implementation_timeline" v-model="capaForm.implementation_timeline"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm" required
                    readonly />
                </div>
                <div class="space-y-2">
                  <label for="management_comment" class="block text-sm font-medium text-gray-700">
                    Management’s Comment
                  </label>
                  <textarea id="management_comment" v-model="capaForm.management_comment" rows="2"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"></textarea>
                </div>
                <!-- <div class="space-y-2">
                  <label for="remarks" class="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea id="remarks" v-model="capaForm.remarks" rows="2"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"></textarea>
                </div> -->
                <div class="space-y-2">
                  <label for="status" class="block text-sm font-medium text-gray-700">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <select id="status" v-model="capaForm.status"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required>
                    <option value="" disabled>Select Status</option>
                    <option value="P">Pending</option>
                    <option value="R">Resolved</option>
                    <option value="C">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 sm:flex sm:flex-row-reverse">
              <!-- ✅ FIX: Use type="submit". The form's @submit.prevent will call submitForm. -->
              <button v-if="capaId" type="submit"
                class="w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-5 py-2.5 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                Update CAPA
              </button>
              <!-- ✅ FIX: Use type="submit". The form's @submit.prevent will call submitForm. -->
              <button v-else type="submit"
                class="w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-5 py-2.5 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                Save CAPA
              </button>
              <!-- ✅ FIX: Use type="button" for secondary actions. -->
              <button v-if="!capaId" type="button" @click="addAnother"
                class="w-full inline-flex justify-center rounded-md border border-green-500 shadow-sm px-5 py-2.5 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                Add Another
              </button>
              <!-- ✅ FIX: Use type="button" for secondary actions. -->
              <button type="button" @click="$emit('close')"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
import { computed, ref, watch, nextTick } from 'vue'
import { XIcon } from 'lucide-vue-next'
// Assuming your service file is named 'services.js' or 'apiService.js'
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
    facilityError.value = teachingCenters.value.length ? '' : 'No facilities registered in the system'
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
  if (capaForm.value.institute) {
    const selectedInstituteId = String(capaForm.value.institute)
    filteredTeachingCenters.value = teachingCenters.value.filter(
      (center) => String(center.institute) === selectedInstituteId,
    )
  } else {
    filteredTeachingCenters.value = []
  }
  facilityError.value = filteredTeachingCenters.value.length
    ? ''
    : capaForm.value.institute
      ? 'No facilities available for selected institute'
      : 'Please select an institute to view facilities'

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

watch(() => props.show, (newValue) => {
  if (newValue) {
    Promise.all([fetchInstitutes(), fetchTeachingCenters()]).then(() => {
      if (props.capaId && props.capa) {
        prefillForm()
      } else {
        resetForm()
      }
    })
  }
})

watch(() => props.instituteId, (newValue) => {
  if (newValue !== capaForm.value.institute) {
    capaForm.value.institute = newValue || ''
    nextTick(() => {
      updateFilteredTeachingCenters()
      capaForm.value.teaching_center = ''
      updateAutoFields()
    })
  }
})

watch(() => capaForm.value.institute, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    capaForm.value.teaching_center = ''
    nextTick(() => {
      updateFilteredTeachingCenters()
      updateAutoFields()
    })
  }
})

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

const submitForm = () => {
  console.log("Vue's submitForm method called successfully!");

  const requiredFields = [
    'institute', 'teaching_center', 'inspection_from_date', 'inspection_to_date',
    'observation_description', 'root_cause', 'capa', 'status',
  ];
  const missingFields = requiredFields.filter(
    (field) => !capaForm.value[field]
  );

  if (missingFields.length > 0) {
    // Now this alert will show instead of the browser's default one.
    alert(`Please fill in all required fields marked with *: ${missingFields.join(', ')}`);
    return;
  }

  console.log('Form is valid. Submitting:', JSON.stringify(capaForm.value));
  if (props.capaId) {
    emit('update', { id: props.capaId, ...capaForm.value });
  } else {
    emit('save', capaForm.value);
  }
}

const addAnother = () => {
  const requiredFields = [
    'institute', 'teaching_center', 'inspection_from_date', 'inspection_to_date',
    'observation_description', 'root_cause', 'capa', 'status',
  ];
  const missingFields = requiredFields.filter(
    (field) => !capaForm.value[field]
  );

  if (missingFields.length > 0) {
    alert(`Please fill in all required fields before adding another: ${missingFields.join(', ')}`);
    return;
  }

  emit('save', capaForm.value);
  resetForm(true); // Reset form but keep the selected institute
}
</script>
