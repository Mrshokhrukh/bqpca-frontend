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
          class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ capaId ? 'Edit CAPA' : 'Add CAPA' }} for {{ instituteName || 'Select Institute' }}
            </h3>
            <button
              @click="$emit('close')"
              class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Form content -->
          <div class="px-6 pt-6 pb-4 max-h-[70vh] overflow-y-auto">
            <form @submit.prevent="submitForm" class="space-y-6">
              <!-- Facility Details Section -->
              <div class="space-y-6">
                <h4 class="text-sm font-medium text-gray-700">Facility Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="institute" class="block text-sm font-medium text-gray-700">
                      Name of Institute <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="institute"
                      v-model="capaForm.institute"
                      @change="updateTeachingCenters"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required
                      :disabled="isLoadingInstitutes"
                    >
                      <option value="" disabled>Select Institute</option>
                      <option v-if="isLoadingInstitutes" disabled>Loading...</option>
                      <option v-for="inst in institutes" :key="inst.id" :value="inst.id">
                        {{ inst.name_of_institution }}
                      </option>
                    </select>
                    <p v-if="instituteError" class="text-red-500 text-sm">{{ instituteError }}</p>
                  </div>
                  <div class="space-y-2">
                    <label for="teaching_center" class="block text-sm font-medium text-gray-700">
                      Name of Facility <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="teaching_center"
                      v-model="capaForm.center_name"
                      @change="updateAutoFields"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required
                      :disabled="isLoadingFacilities"
                    >
                      <option value="" disabled>Select Facility</option>
                      <option v-if="isLoadingFacilities" disabled>Loading...</option>
                      <option v-for="center in filteredTeachingCenters" :key="center.id" :value="center.id">
                        {{ center.center_name }}
                      </option>
                    </select>
                    <p v-if="facilityError" class="text-red-500 text-sm">{{ facilityError }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label for="dzongkhag" class="block text-sm font-medium text-gray-700">
                      Dzongkhag/Throme
                    </label>
                    <input
                      type="text"
                      id="dzongkhag"
                      v-model="capaForm.dzongkhag"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                      readonly
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="city" class="block text-sm font-medium text-gray-700">
                      City/Gewog
                    </label>
                    <input
                      type="text"
                      id="city"
                      v-model="capaForm.city"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                      readonly
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="address" class="block text-sm font-medium text-gray-700">
                      Address/Location
                    </label>
                    <input
                      type="text"
                      id="address"
                      v-model="capaForm.address"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                      readonly
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="inspection_from_date" class="block text-sm font-medium text-gray-700">
                      Inspection From Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="inspection_from_date"
                      v-model="capaForm.inspection_from_date"
                      @change="updateImplementationTimeline"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="inspection_to_date" class="block text-sm font-medium text-gray-700">
                      Inspection To Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="inspection_to_date"
                      v-model="capaForm.inspection_to_date"
                      @change="updateImplementationTimeline"
                      class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      required
                    />
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
                  <textarea
                    id="observation_description"
                    v-model="capaForm.observation_description"
                    rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required
                  ></textarea>
                </div>
                <div class="space-y-2">
                  <label for="root_cause" class="block text-sm font-medium text-gray-700">
                    Root Cause <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="root_cause"
                    v-model="capaForm.root_cause"
                    rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required
                  ></textarea>
                </div>
                <div class="space-y-2">
                  <label for="capa" class="block text-sm font-medium text-gray-700">
                    CAPA <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="capa"
                    v-model="capaForm.capa"
                    rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required
                  ></textarea>
                </div>
                <div class="space-y-2">
                  <label for="implementation_timeline" class="block text-sm font-medium text-gray-700">
                    Implementation Timeline <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="implementation_timeline"
                    v-model="capaForm.implementation_timeline"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm bg-gray-100 sm:text-sm"
                    required
                    readonly
                  />
                </div>
                <div class="space-y-2">
                  <label for="management_comment" class="block text-sm font-medium text-gray-700">
                    Management’s Comment
                  </label>
                  <textarea
                    id="management_comment"
                    v-model="capaForm.management_comment"
                    rows="2"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  ></textarea>
                </div>
                <div class="space-y-2">
                  <label for="remarks" class="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea
                    id="remarks"
                    v-model="capaForm.remarks"
                    rows="2"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  ></textarea>
                </div>
                <div class="space-y-2">
                  <label for="status" class="block text-sm font-medium text-gray-700">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    v-model="capaForm.status"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="P">Pending</option>
                    <option value="R">Resolved</option>
                    <option value="C">Cancelled</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 sm:flex sm:flex-row-reverse">
            <button
              v-if="capaId"
              type="button"
              @click="submitForm"
              class="w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-5 py-2.5 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update CAPA
            </button>
            <button
              v-else
              type="button"
              @click="submitForm"
              class="w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-5 py-2.5 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save CAPA
            </button>
            <button
              v-if="!capaId"
              type="button"
              @click="addAnother"
              class="w-full inline-flex justify-center rounded-md border border-green-500 shadow-sm px-5 py-2.5 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Add Another
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch,  nextTick } from 'vue'
import { XIcon } from 'lucide-vue-next'
// Import the service layer, NOT the raw apiClient instance
// Assuming your service file is named 'services.js' or 'apiService.js'
// and is located at '@/services/services' as seen in authStore.js
import apiService from '@/services/services' // <--- CHANGE THIS IMPORT

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
  status: '',
})

const fetchInstitutes = async () => {
  isLoadingInstitutes.value = true
  try {
    // Use the imported apiService object and its method
    console.log('Fetching institutes from /epc/epc-institutes/ using apiService.getEpcInstitutes')
    const response = await apiService.getEpcInstitutes() // <--- USE apiService HERE
    console.log('Institutes API response:', response)
    console.log('Institutes raw data:', response.data)
    const data = response.data.results || response.data || []
    institutes.value = data.map(item => ({
      id: item.id || item.institute_id,
      name_of_institution: item.name_of_institution || item.name || item.institute_name,
    }))
    instituteError.value = institutes.value.length ? '' : 'No institutes registered in the system'
    console.log('Processed institutes:', institutes.value)
    nextTick(() => {
      updateFilteredTeachingCenters()
    })
  } catch (error) {
    console.error('Error fetching institutes:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    })
    instituteError.value = 'Failed to load institutes. Please try again or contact support.'
     // Check if the error indicates the method still doesn't exist
    if (error instanceof TypeError && error.message.includes('is not a function')) {
       console.error(`*** The method 'getEpcInstitutes' might be missing or named differently in your service file ('@/services/services.js') ***`);
       instituteError.value = 'Configuration error: Cannot find function to load institutes.';
    }
  } finally {
    isLoadingInstitutes.value = false
  }
}

const fetchTeachingCenters = async () => {
  isLoadingFacilities.value = true;
  try {
    console.log('Fetching teaching centers from /epc/epc-teaching-centers/ using apiService.getEpcTeachingCenters');
    // Assuming apiService.getEpcTeachingCenters correctly fetches the payload you provided
    const response = await apiService.getEpcTeachingCenters();
    console.log('Teaching Centers API response:', response);
    console.log('Teaching Centers raw data:', response.data);

    // Ensure response.data and response.data.results exist
    const data = response?.data?.results || response?.data || [];
    console.log('Data to be mapped:', data);

    teachingCenters.value = data.map(item => {
        // --- CORRECTIONS START ---
        // Extract institute ID safely
        const instituteId = item.institute?.id || item.institute_id || null; // Get ID from object or fallback

        // Use correct field names from payload
        const dzongkhag = item.state_dzongkhag || 'N/A';
        const city = item.city_gewog || 'N/A';
        const address = item.center_location || 'N/A';


        // Log each mapped item for debugging
        const mappedItem = {
            id: item.id, // Prefer direct 'id' if available
            center_name: item.center_name || 'Unnamed Center', // Prefer direct 'center_name'
            institute: instituteId, // Assign the extracted ID
            dzongkhag: dzongkhag,
            city: city,
            address: address,
        };
        console.log('Mapped Teaching Center Item:', mappedItem);
        return mappedItem;
    }).filter(center => center.id != null); // Ensure items have an ID

    facilityError.value = teachingCenters.value.length ? '' : 'No facilities registered in the system';
    console.log('Processed teaching centers:', teachingCenters.value);

    // Trigger UI update AFTER processing is complete
    nextTick(() => {
      updateFilteredTeachingCenters(); // This should now work correctly
    });

  } catch (error) {
    console.error('Error fetching or processing teaching centers:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    facilityError.value = 'Failed to load facilities. Please check console or contact support.';
    if (error instanceof TypeError && error.message.includes('is not a function')) {
       console.error(`*** The method 'getEpcTeachingCenters' might be missing or named differently in your service file ('@/services/services.js') ***`);
       facilityError.value = 'Configuration error: Cannot find function to load facilities.';
    }
    teachingCenters.value = []; // Clear array on error
  } finally {
    isLoadingFacilities.value = false;
  }
};
const updateFilteredTeachingCenters = () => {
  console.log('Updating filtered teaching centers. Selected institute:', capaForm.value.institute)
  if (capaForm.value.institute) {
    // Ensure comparison works even if IDs are numbers or strings
    const selectedInstituteId = String(capaForm.value.institute);
    filteredTeachingCenters.value = teachingCenters.value.filter(
      (center) => String(center.institute) === selectedInstituteId
    )
  } else {
    // Show all teaching centers if no institute is selected (or filter based on user role/permissions if needed)
     filteredTeachingCenters.value = []; // Or teachingCenters.value if you want to show all initially
  }
  facilityError.value = filteredTeachingCenters.value.length
    ? ''
    : capaForm.value.institute
      ? 'No facilities available for selected institute'
      : 'Please select an institute to view facilities' // Updated message
  console.log('Filtered teaching centers:', filteredTeachingCenters.value)
  // If the previously selected teaching center is no longer valid, reset it
  if (capaForm.value.teaching_center && !filteredTeachingCenters.value.some(tc => tc.id === capaForm.value.teaching_center)) {
    capaForm.value.teaching_center = '';
    updateAutoFields(); // Reset dependent fields
  }
}

const updateAutoFields = () => {
  console.log('--- updateAutoFields triggered ---');
  const selectedId = capaForm.value.teaching_center;
  console.log('Searching for teaching_center ID:', selectedId, `(Type: ${typeof selectedId})`);
  // Log the entire array structure to verify keys just before searching
  console.log('Current teachingCenters array:', JSON.parse(JSON.stringify(teachingCenters.value)));

  if (selectedId === null || selectedId === undefined || selectedId === '') {
      console.log('No valid teaching_center ID selected. Clearing fields.');
      capaForm.value.dzongkhag = '';
      capaForm.value.city = '';
      capaForm.value.address = '';
      return; // Exit early
  }

  const selectedCenter = teachingCenters.value.find(
    // Use == for type flexibility unless strict comparison is needed and types are guaranteed
    (center) => center.id == selectedId
  );

  console.log('Result of find:', selectedCenter ? JSON.parse(JSON.stringify(selectedCenter)) : '<<< CENTER NOT FOUND >>>');

  if (selectedCenter) {
    // *** CRITICAL STEP: Check if selectedCenter HAS the properties you expect ***
    console.log('Found center. Checking properties:');
    console.log(` - selectedCenter.dzongkhag:`, selectedCenter.dzongkhag);
    console.log(` - selectedCenter.city:`, selectedCenter.city);
    console.log(` - selectedCenter.address:`, selectedCenter.address);

    // Assign values, ensuring fallback if property is missing or nullish
    capaForm.value.dzongkhag = selectedCenter.dzongkhag ?? 'N/A'; // Use ?? (nullish coalescing)
    capaForm.value.city = selectedCenter.city ?? 'N/A';
    capaForm.value.address = selectedCenter.address ?? 'N/A';

    console.log('Assigned Dzongkhag:', capaForm.value.dzongkhag);
    console.log('Assigned City:', capaForm.value.city);
    console.log('Assigned Address:', capaForm.value.address);
  } else {
    console.log('No center found matching ID. Clearing fields.');
    capaForm.value.dzongkhag = '';
    capaForm.value.city = '';
    capaForm.value.address = '';
  }
  console.log('--- updateAutoFields finished ---');
};

const resetForm = (keepInstitute = false) => { // Added option to keep institute
  const instituteToKeep = keepInstitute ? capaForm.value.institute : (props.instituteId || '');
  capaForm.value = {
    institute: instituteToKeep, // Keep institute if needed (e.g., for 'Add Another')
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
    status: '', // Default to empty or 'P' (Pending)? Decide based on requirements.
  }
  nextTick(() => {
    updateFilteredTeachingCenters() // This will filter based on instituteToKeep
    updateAutoFields()
    updateImplementationTimeline(); // Reset timeline too
  })
}

const prefillForm = () => {
  if (props.capa && props.capaId) {
    capaForm.value = {
      institute: props.capa.institute || props.instituteId || '',
      teaching_center: props.capa.teaching_center || '',
      // dzongkhag, city, address should ideally be re-fetched/validated based on teaching_center,
      // but prefilling from props.capa is a fallback.
      dzongkhag: props.capa.dzongkhag || '',
      city: props.capa.city || '',
      address: props.capa.address || '',
      inspection_from_date: props.capa.inspection_from_date || '',
      inspection_to_date: props.capa.inspection_to_date || '',
      observation_description: props.capa.observation_description || '',
      root_cause: props.capa.root_cause || '',
      capa: props.capa.capa || '',
      implementation_timeline: props.capa.implementation_timeline || '',
      management_comment: props.capa.management_comment || '',
      remarks: props.capa.remarks || '',
      status: props.capa.status || '',
    }
    nextTick(() => {
       // Crucial: Ensure teaching centers for the prefilled institute are loaded and filtered *before* setting teaching_center
       updateFilteredTeachingCenters();
       // Find the center again to populate dzongkhag/city/address accurately if possible
       const selectedCenter = teachingCenters.value.find(
          (center) => center.id === capaForm.value.teaching_center
       );
       if (selectedCenter) {
           capaForm.value.dzongkhag = selectedCenter.dzongkhag || 'N/A';
           capaForm.value.city = selectedCenter.city || 'N/A';
           capaForm.value.address = selectedCenter.address || 'N/A';
       } else if (capaForm.value.teaching_center) {
           // If center ID exists but not found in list (maybe inactive?), keep props data but log warning
           console.warn(`Prefilled teaching center ID ${capaForm.value.teaching_center} not found in current list.`);
       } else {
           // If no teaching_center was in props.capa, reset derived fields
           capaForm.value.dzongkhag = '';
           capaForm.value.city = '';
           capaForm.value.address = '';
       }
       updateImplementationTimeline(); // Update timeline based on prefilled dates
    })
  } else {
      resetForm(); // Ensure form is reset if props are invalid
  }
}


watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      console.log('Modal opened. Props:', props)
      // Fetch data every time modal opens to ensure freshness,
      // OR fetch only if data is not already loaded (more efficient)
      // Let's fetch every time for simplicity here, but consider caching/checking length
      Promise.all([fetchInstitutes(), fetchTeachingCenters()]).then(() => {
          // Now that data is fetched, prefill or reset
          if (props.capaId && props.capa) {
             prefillForm()
          } else {
             resetForm()
          }
      });
    }
  }
)

watch(
  () => props.instituteId,
  (newValue, oldValue) => {
      if (newValue !== oldValue && props.show) { // Update only if modal is shown and ID actually changes
          console.log('instituteId prop changed:', newValue);
          capaForm.value.institute = newValue || '';
          // No need to reset the whole form, just update filters and dependent fields
          nextTick(() => {
              updateFilteredTeachingCenters();
              // Reset teaching center if the institute changed
              capaForm.value.teaching_center = '';
              updateAutoFields();
          });
      }
  }
)

watch(
  () => capaForm.value.institute,
  (newValue, oldValue) => {
     // Avoid infinite loops or unnecessary resets if the change was triggered by the prop watch
    if (newValue !== oldValue && newValue !== props.instituteId) {
        console.log('Selected institute changed via dropdown:', newValue)
        // When user manually changes institute dropdown, reset facility selection
        capaForm.value.teaching_center = ''
        nextTick(() => {
          updateFilteredTeachingCenters()
          updateAutoFields()
        })
    }
  }
)

// Fetch initial data on mount *only if needed* (e.g., if modal could be shown initially without user action)
// Generally, fetching inside the `watch` for `props.show` is better for modals.
// onMounted(() => {
//   console.log('Component mounted. Initial props:', props);
//   // You might not need to fetch here if the modal starts hidden
//   // fetchInstitutes();
//   // fetchTeachingCenters();
// });

const updateImplementationTimeline = () => {
  if (capaForm.value.inspection_from_date && capaForm.value.inspection_to_date) {
    const fromDate = new Date(capaForm.value.inspection_from_date)
    const toDate = new Date(capaForm.value.inspection_to_date)

    // Basic date validation
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        capaForm.value.implementation_timeline = 'Invalid date(s)';
        return;
    }
     if (toDate < fromDate) {
        capaForm.value.implementation_timeline = 'End date before start date';
        return;
     }

    const timeDiff = toDate.getTime() - fromDate.getTime()
    // Calculate difference in days (inclusive of start and end date)
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
    capaForm.value.implementation_timeline = `${daysDiff} day${daysDiff !== 1 ? 's' : ''}` // Pluralize 'day'
  } else {
    capaForm.value.implementation_timeline = ''
  }
}

const submitForm = () => {
  // Add basic form validation here if needed before emitting
  // e.g., check required fields
  const requiredFields = [
      'institute', 'teaching_center', 'inspection_from_date', 'inspection_to_date',
      'observation_description', 'root_cause', 'capa', 'status'
  ];
  const missingFields = requiredFields.filter(field => !capaForm.value[field]);

  if (missingFields.length > 0) {
      // Optionally, use a toast notification or highlight fields
      console.error('Form validation failed. Missing fields:', missingFields);
      alert(`Please fill in all required fields marked with *: ${missingFields.join(', ')}`);
      return; // Stop submission
  }

  console.log('Submitting form:', capaForm.value)
  if (props.capaId) {
    emit('update', { id: props.capaId, ...capaForm.value })
  } else {
    emit('save', capaForm.value)
  }
  // Optionally close the modal after successful save/update
  // emit('close');
}

const addAnother = () => {
   // Add basic form validation here too before saving
  const requiredFields = [
      'institute', 'teaching_center', 'inspection_from_date', 'inspection_to_date',
      'observation_description', 'root_cause', 'capa', 'status'
  ];
  const missingFields = requiredFields.filter(field => !capaForm.value[field]);

  if (missingFields.length > 0) {
      console.error('Form validation failed. Missing fields:', missingFields);
      alert(`Please fill in all required fields marked with *: ${missingFields.join(', ')}`);
      return; // Stop submission
  }

  console.log('Saving current CAPA and preparing for another:', capaForm.value)
  emit('save', capaForm.value)
  // Reset form, but keep the selected institute
  resetForm(true);
}
</script>