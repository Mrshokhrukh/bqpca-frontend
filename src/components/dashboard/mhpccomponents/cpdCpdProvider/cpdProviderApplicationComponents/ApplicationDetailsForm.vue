<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <!-- ... header content ... -->
       <div>
          <h2 class="text-xl font-bold text-gray-900">CPD Application Details</h2>
          <p class="mt-1 text-sm text-gray-600">Provide core details about the CPD program.</p>
        </div>
    </div>

    <!-- Form Content -->
    <div class="p-6 space-y-8">
      <form @submit.prevent>
        <!-- First Section: Basic Information -->
        <div class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            <!-- ... icon ... -->
            Basic Information
          </h3>

          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <!-- Validation Question -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Is CPD validated by KGUMSB or International Organization? <span class="text-red-500">*</span>
              </label>
              <div class="flex flex-wrap gap-4">
                <div class="relative">
                  <input
                    type="radio"
                    id="approvedYes"
                    value="true"
                    name="isApproved"
                    v-model="localFormData.isApproved"
                    class="sr-only peer"
                    @change="handleIsApprovedChange"
                    aria-describedby="app-isApproved-error"
                  />
                  <label
                    for="approvedYes"
                    class="flex items-center px-5 py-3 bg-white border rounded-lg cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300"
                    :class="{ 'border-red-500': props.errors && props.errors.isApproved }"
                  >
                    <!-- ... radio button visual ... -->
                    <span class="text-sm font-medium text-gray-700">Yes</span>
                  </label>
                </div>
                <div class="relative">
                  <input
                    type="radio"
                    id="approvedNo"
                    value="false"
                    name="isApproved"
                    v-model="localFormData.isApproved"
                    class="sr-only peer"
                    @change="handleIsApprovedChange"
                    aria-describedby="app-isApproved-error"
                  />
                  <label
                    for="approvedNo"
                    class="flex items-center px-5 py-3 bg-white border rounded-lg cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300"
                    :class="{ 'border-red-500': props.errors && props.errors.isApproved }"
                  >
                    <!-- ... radio button visual ... -->
                    <span class="text-sm font-medium text-gray-700">No</span>
                  </label>
                </div>
              </div>
              <p v-if="props.errors && props.errors.isApproved" id="app-isApproved-error" class="mt-1 text-xs text-red-500 flex items-center">
                <!-- ... error icon ... -->
                {{ props.errors.isApproved }}
              </p>
            </div>

            <!-- Title of CPD - Always Visible -->
            <div class="mb-5">
              <label for="app-title" class="block text-sm font-medium text-gray-700 mb-2">
                Title of CPD <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <!-- ... icon ... -->
                <input
                  type="text"
                  id="app-title"
                  v-model="localFormData.title"
                  placeholder="Enter the title of your CPD"
                  :class="[
                    'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                    props.errors && props.errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  ]"
                  @input="emitFieldUpdate('title', $event.target.value)"
                  aria-describedby="app-title-error"
                />
              </div>
              <p v-if="props.errors && props.errors.title" id="app-title-error" class="mt-1 text-xs text-red-500 flex items-center">
                <!-- ... error icon ... -->
                {{ props.errors.title }}
              </p>
            </div>
          </div>
        </div>

        <!-- Second Section: Location & Dates - Always Visible -->
        <div class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            <!-- ... icon ... -->
            Location & Timeframe
          </h3>
          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <!-- Venue -->
            <div class="mb-5">
              <label for="app-venue" class="block text-sm font-medium text-gray-700 mb-2">
                Venue <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <!-- ... icon ... -->
                <input
                  type="text"
                  id="app-venue"
                  v-model="localFormData.venue"
                  placeholder="Enter venue location"
                  :class="[
                    'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                    props.errors && props.errors.venue ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  ]"
                  @input="emitFieldUpdate('venue', $event.target.value)"
                  aria-describedby="app-venue-error"
                />
              </div>
              <p v-if="props.errors && props.errors.venue" id="app-venue-error" class="mt-1 text-xs text-red-500 flex items-center">
                <!-- ... error icon ... -->
                {{ props.errors.venue }}
              </p>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- From Date -->
              <div>
                <label for="app-fromDate" class="block text-sm font-medium text-gray-700 mb-2">
                  From Date <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <!-- ... icon ... -->
                  <input
                    type="date"
                    id="app-fromDate"
                    v-model="localFormData.fromDate"
                    :min="today"
                    :class="[
                      'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                      props.errors && props.errors.fromDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    ]"
                    @change="emitFieldUpdate('fromDate', $event.target.value)"
                    aria-describedby="app-fromDate-error"
                  />
                </div>
                <p v-if="props.errors && props.errors.fromDate" id="app-fromDate-error" class="mt-1 text-xs text-red-500 flex items-center">
                  <!-- ... error icon ... -->
                 {{ props.errors.fromDate }}
                </p>
              </div>

              <!-- To Date -->
              <div>
                <label for="app-toDate" class="block text-sm font-medium text-gray-700 mb-2">
                  To Date <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <!-- ... icon ... -->
                  <input
                    type="date"
                    id="app-toDate"
                    v-model="localFormData.toDate"
                    :min="localFormData.fromDate || today"
                    :class="[
                      'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                      props.errors && props.errors.toDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    ]"
                    @change="emitFieldUpdate('toDate', $event.target.value)"
                    aria-describedby="app-toDate-error"
                  />
                </div>
                <p v-if="props.errors && props.errors.toDate" id="app-toDate-error" class="mt-1 text-xs text-red-500 flex items-center">
                  <!-- ... error icon ... -->
                  {{ props.errors.toDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Section: Documentation - Conditional -->
        <div v-if="localFormData.isApproved === 'true'" class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            <!-- ... icon ... -->
            Documentation
          </h3>
          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <!-- Approval Letter -->
            <div>
              <label for="app-approvalLetter" class="block text-sm font-medium text-gray-700 mb-2">
                Attach Approval Letter <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="file"
                  id="app-approvalLetter"
                  @change="handleLocalFileInput" 
                  accept=".pdf"
                  class="hidden"
                  aria-describedby="app-approvalLetter-error"
                />
                <label
                  for="app-approvalLetter"
                  :class="[
                    'flex items-center justify-center w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200',
                    props.errors && props.errors.approvalLetterFile ? 'border-red-500' : 'border-gray-300'
                  ]"
                >
                  <!-- ... file upload visual (icon, text) ... -->
                   <div class="space-y-1 text-center">
                    <!-- ... svg icon ... -->
                    <div class="flex text-sm text-gray-600 justify-center">
                      <span v-if="localApprovalLetterFileName" class="text-blue-600 font-medium"> <!-- Use local state for display -->
                        {{ localApprovalLetterFileName }}
                      </span>
                      <span v-else class="text-gray-500">
                        Click to upload or drag and drop
                      </span>
                    </div>
                    <p class="text-xs text-gray-500">PDF up to 5MB</p>
                  </div>
                </label>
              </div>
              <p v-if="props.errors && props.errors.approvalLetterFile" id="app-approvalLetter-error" class="mt-1 text-xs text-red-500 flex items-center">
                <!-- ... error icon ... -->
                {{ props.errors.approvalLetterFile }}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  application: { // Data passed from parent
    type: Object,
    required: true,
    default: () => ({
      isApproved: null, // Or 'false' as a default string
      title: '',
      venue: '',
      fromDate: '',
      toDate: '',
      // approvalLetter: null, // The actual File object for approvalLetter is handled by parent
    })
  },
  handleApprovalLetterUpload: { // Function from parent to handle the actual file upload
    type: Function,
    required: true,
  },
  errors: { // Errors object from parent
    type: Object,
    default: () => ({})
    // Expected structure: { isApproved: 'Msg', title: 'Msg', venue: 'Msg', fromDate: 'Msg', toDate: 'Msg', approvalLetterFile: 'Msg' }
  }
});

const emit = defineEmits(['update:modelValue', 'approval-change']);

// Local reactive state for v-model bindings
const localFormData = ref({
  isApproved: props.application?.isApproved === true ? 'true' : (props.application?.isApproved === false ? 'false' : null),
  title: props.application?.title || '',
  venue: props.application?.venue || '',
  fromDate: props.application?.fromDate || '',
  toDate: props.application?.toDate || '',
  // No approvalLetterFile here; parent manages the actual file. This component just triggers the upload.
});

const localApprovalLetterFileName = ref(''); // To display the name of the selected file

const today = computed(() => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset*60*1000));
  return localDate.toISOString().split('T')[0];
});

// Watch for prop changes to re-initialize local form data
watch(
  () => props.application,
  (newValue) => {
    if (newValue) {
      localFormData.value.isApproved = newValue.isApproved === true ? 'true' : (newValue.isApproved === false ? 'false' : null);
      localFormData.value.title = newValue.title || '';
      localFormData.value.venue = newValue.venue || '';
      localFormData.value.fromDate = newValue.fromDate || '';
      localFormData.value.toDate = newValue.toDate || '';
    }
     // If parent passes an approvalLetter prop (e.g., a File object from a previous load),
    // you might want to display its name.
    if (newValue && newValue.approvalLetter && newValue.approvalLetter.name) {
        localApprovalLetterFileName.value = newValue.approvalLetter.name;
    } else if (!newValue || !newValue.approvalLetter){ // Clear if prop doesn't have it
        localApprovalLetterFileName.value = '';
    }
  },
  { immediate: true, deep: true }
);

// Watch for local isApproved changes to emit 'approval-change'
// and clear approval letter if "No" is selected.
watch(
  () => localFormData.value.isApproved,
  (newValue, oldValue) => {
    // Emit only if the value actually changed
    if (newValue !== oldValue) {
      emit('approval-change', newValue === 'true'); // Emit boolean
      emitUpdate(); // Emit the whole model update

      if (newValue !== 'true') {
        localApprovalLetterFileName.value = ''; // Clear displayed file name
        // Parent's handleApprovalLetterUpload should be called with null/empty event if file needs to be cleared in parent
        const fileInput = document.getElementById('app-approvalLetter');
        if (fileInput) fileInput.value = null; // Reset the file input
         // If parent manages the actual file object for approvalLetter,
        // you might need to inform parent to clear it.
        // This is typically done by parent reacting to isApproved=false
        // or by calling handleApprovalLetterUpload with a null event/file.
        // For now, parent's `toggleApprovedFields` handles clearing `approvalLetter.value`.
      }
    }
  }
);

// Emit updated form data for a specific field or the whole model
const emitUpdate = () => {
  const dataToEmit = {
    isApproved: localFormData.value.isApproved === 'true', // Convert to boolean for parent
    title: localFormData.value.title.trim(),
    venue: localFormData.value.venue.trim(),
    fromDate: localFormData.value.fromDate,
    toDate: localFormData.value.toDate,
    // approvalLetter is handled by parent via handleApprovalLetterUpload
  };
  emit('update:modelValue', dataToEmit);
};

// Generic handler to emit updates when text fields change
const emitFieldUpdate = (field, value) => {
  if (typeof localFormData.value[field] === 'string' && typeof value === 'string') {
    localFormData.value[field] = value.trimStart();
  } else {
     localFormData.value[field] = value;
  }
  emitUpdate();
};

// Handle 'isApproved' radio button change specifically
const handleIsApprovedChange = (event) => {
    localFormData.value.isApproved = event.target.value;
    // The watcher for localFormData.value.isApproved will handle emitting.
};

// Handle file input locally and then call parent's handler
const handleLocalFileInput = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    // Basic local validation for immediate feedback (parent will do full validation)
    if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      localApprovalLetterFileName.value = file.name;
      props.handleApprovalLetterUpload(event); // Call parent's handler
    } else {
      localApprovalLetterFileName.value = 'Invalid file'; // Or some error indicator
      // Call parent handler with the event so parent can show the error from its validation
      props.handleApprovalLetterUpload(event);
      event.target.value = null; // Reset file input as it's invalid
    }
  } else {
    localApprovalLetterFileName.value = '';
    props.handleApprovalLetterUpload(event); // Call parent with empty event
  }
  // No need to call emitUpdate() here for the file itself, parent manages the file.
  // Parent's `validateForm` will set the `approvalLetterFile` error if needed.
};

</script>