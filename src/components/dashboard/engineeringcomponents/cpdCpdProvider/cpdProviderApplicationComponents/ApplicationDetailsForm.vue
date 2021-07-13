<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="bg-blue-600 p-2 rounded-lg shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">CPD Application</h2>
          <p class="mt-1 text-sm text-gray-600">
            Please provide information about your Continuing Professional Development application
          </p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-8">
      <form @submit.prevent>
        <div class="mb-8">
          <h3
            class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Basic Information
          </h3>

          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Is CPD validated? <span class="text-red-500">*</span>
              </label>
              <div class="flex flex-wrap gap-4">
                <div class="relative">
                  <input
                    type="radio"
                    id="approvedYes"
                    value="true"
                    name="isApproved"
                    v-model="formData.isApproved"
                    class="sr-only peer"
                    @change="
                      () => {
                        validateInput()
                        emitUpdate()
                      }
                    "
                    aria-describedby="isApproved-error"
                  />
                  <label
                    for="approvedYes"
                    class="flex items-center px-5 py-3 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md hover:border-blue-300 hover:shadow-sm"
                    :class="{
                      'border-red-500': errors.isApproved,
                      'border-blue-500 bg-blue-50 shadow-md': formData.isApproved === 'true',
                    }"
                  >
                    <div
                      class="h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 transition-all duration-200"
                      :class="
                        formData.isApproved === 'true'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400 bg-white'
                      "
                    >
                      <div
                        v-if="formData.isApproved === 'true'"
                        class="w-2 h-2 bg-white rounded-full"
                      ></div>
                    </div>
                    <span
                      class="text-sm font-medium"
                      :class="formData.isApproved === 'true' ? 'text-blue-700' : 'text-gray-700'"
                      >Yes</span
                    >
                  </label>
                </div>
                <div class="relative">
                  <input
                    type="radio"
                    id="approvedNo"
                    value="false"
                    name="isApproved"
                    v-model="formData.isApproved"
                    class="sr-only peer"
                    @change="
                      () => {
                        validateInput()
                        emitUpdate()
                      }
                    "
                    aria-describedby="isApproved-error"
                  />
                  <label
                    for="approvedNo"
                    class="flex items-center px-5 py-3 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-md hover:border-blue-300 hover:shadow-sm"
                    :class="{
                      'border-red-500': errors.isApproved,
                      'border-blue-500 bg-blue-50 shadow-md': formData.isApproved === 'false',
                    }"
                  >
                    <div
                      class="h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 transition-all duration-200"
                      :class="
                        formData.isApproved === 'false'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400 bg-white'
                      "
                    >
                      <div
                        v-if="formData.isApproved === 'false'"
                        class="w-2 h-2 bg-white rounded-full"
                      ></div>
                    </div>
                    <span
                      class="text-sm font-medium"
                      :class="formData.isApproved === 'false' ? 'text-blue-700' : 'text-gray-700'"
                      >No</span
                    >
                  </label>
                </div>
              </div>
              <p
                v-if="errors.isApproved"
                id="isApproved-error"
                class="mt-1 text-xs text-red-500 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Please select whether the CPD is validated
              </p>
            </div>

            <div class="mb-5">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title of CPD <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="title"
                  v-model="formData.title"
                  placeholder="Enter the title of your CPD (e.g., Advanced Cardiac Life Support Training)"
                  :class="[
                    'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                    errors.title
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="handleInput('title')"
                  @blur="validateInput"
                  aria-describedby="title-error"
                />
              </div>
              <p
                v-if="errors.title"
                id="title-error"
                class="mt-1 text-xs text-red-500 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Title of CPD is required
              </p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h3
            class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Location & Timeframe
          </h3>

          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div class="mb-5">
              <label for="venue" class="block text-sm font-medium text-gray-700 mb-2">
                Venue <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="venue"
                  v-model="formData.venue"
                  placeholder="Enter venue location (e.g., Thimphu Conference Center)"
                  :class="[
                    'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                    errors.venue
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                  ]"
                  @input="handleInput('venue')"
                  @blur="validateInput"
                  aria-describedby="venue-error"
                />
              </div>
              <p
                v-if="errors.venue"
                id="venue-error"
                class="mt-1 text-xs text-red-500 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Venue is required
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="fromDate" class="block text-sm font-medium text-gray-700 mb-2">
                  From Date <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="fromDate"
                    v-model="formData.fromDate"
                    :min="today"
                    :class="[
                      'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                      errors.fromDate
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                    ]"
                    @change="
                      () => {
                        validateInput()
                        emitUpdate()
                      }
                    "
                    aria-describedby="fromDate-error"
                  />
                </div>
                <p
                  v-if="errors.fromDate"
                  id="fromDate-error"
                  class="mt-1 text-xs text-red-500 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  From Date is required
                </p>
              </div>

              <div>
                <label for="toDate" class="block text-sm font-medium text-gray-700 mb-2">
                  To Date <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="toDate"
                    v-model="formData.toDate"
                    :min="formData.fromDate || today"
                    :class="[
                      'w-full rounded-lg border shadow-sm pl-10 p-2.5',
                      errors.toDate
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                    ]"
                    @change="
                      () => {
                        validateInput()
                        emitUpdate()
                      }
                    "
                    aria-describedby="toDate-error"
                  />
                </div>
                <p
                  v-if="errors.toDate"
                  id="toDate-error"
                  class="mt-1 text-xs text-red-500 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ errors.toDate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="formData.isApproved === 'true'" class="mb-8">
          <h3
            class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Documentation
          </h3>

          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div>
              <label for="approvalLetter" class="block text-sm font-medium text-gray-700 mb-2">
                Attach Approval Letter <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="file"
                  id="approvalLetter"
                  @change="handleFileInput"
                  accept=".pdf"
                  class="hidden"
                  aria-describedby="approvalLetter-error"
                />
                <label
                  for="approvalLetter"
                  :class="[
                    'flex items-center justify-center w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200',
                    errors.approvalLetterFile ? 'border-red-500' : 'border-gray-300',
                  ]"
                >
                  <div class="space-y-1 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div class="flex text-sm text-gray-600 justify-center">
                      <span v-if="formData.approvalLetterFile" class="text-blue-600 font-medium">
                        {{ formData.approvalLetterFile.name }}
                      </span>
                      <span v-else class="text-gray-500"> Click to upload or drag and drop </span>
                    </div>
                    <p class="text-xs text-gray-500">PDF up to 5MB</p>
                  </div>
                </label>
              </div>
              <p
                v-if="errors.approvalLetterFile"
                id="approvalLetter-error"
                class="mt-1 text-xs text-red-500 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ errors.approvalLetterFile }}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  handleApprovalLetterUpload: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'update:valid', 'approval-change'])

const formData = ref({
  isApproved: props.application?.isApproved || null, // Initialize with prop or null
  title: props.application?.title || '',
  venue: props.application?.venue || '',
  fromDate: props.application?.fromDate || '',
  toDate: props.application?.toDate || '',
  approvalLetterFile: null, // This is local to the component for handling the file object
})

const errors = ref({
  isApproved: false,
  title: false,
  venue: false,
  fromDate: false,
  toDate: '', // Can be a string for more descriptive error
  approvalLetterFile: '', // Can be a string for more descriptive error
})

const today = computed(() => {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
})

// Validate all fields
const validateInput = () => {
  let hasError = false

  // Section 1: Basic Information
  errors.value.isApproved = formData.value.isApproved === null
  if (errors.value.isApproved) hasError = true

  // Title of CPD (Always required)
  errors.value.title = !formData.value.title.trim()
  if (errors.value.title) hasError = true

  // Venue (Always required)
  errors.value.venue = !formData.value.venue.trim()
  if (errors.value.venue) hasError = true

  // From Date (Always required)
  errors.value.fromDate = !formData.value.fromDate
  if (errors.value.fromDate) hasError = true

  // To Date (Always required, and must be after fromDate)
  if (!formData.value.toDate) {
    errors.value.toDate = 'To Date is required'
  } else if (
    formData.value.fromDate &&
    new Date(formData.value.toDate) < new Date(formData.value.fromDate)
  ) {
    errors.value.toDate = 'To Date cannot be before From Date'
  } else {
    errors.value.toDate = '' // No error
  }
  if (errors.value.toDate) hasError = true

  // Section 3: Documentation (Approval Letter - conditionally required)
  if (formData.value.isApproved === 'true') {
    if (!formData.value.approvalLetterFile && !errors.value.approvalLetterFile) {
      // check if no file AND no existing file-specific error
      errors.value.approvalLetterFile = 'Approval Letter is required'
    } else if (
      formData.value.approvalLetterFile &&
      errors.value.approvalLetterFile === 'Approval Letter is required'
    ) {
      // If file is present and only error was 'required', clear it. Other errors (type/size) persist.
      errors.value.approvalLetterFile = ''
    }
    if (errors.value.approvalLetterFile) hasError = true
  } else {
    // If isApproved is not 'true', approval letter is not required, so clear its error.
    errors.value.approvalLetterFile = ''
  }

  emit('update:valid', !hasError)
  return !hasError
}

// Handle text input with sanitization
const handleInput = (field) => {
  if (typeof formData.value[field] === 'string') {
    formData.value[field] = formData.value[field].trimStart()
  }
  validateInput() // This validates and emits 'update:valid'
  emitUpdate() // Emit the updated model value
}

// Handle file input
const handleFileInput = (event) => {
  const file = event.target.files?.[0]
  const inputElement = event.target

  if (file) {
    if (file.type !== 'application/pdf') {
      errors.value.approvalLetterFile = 'Please upload a PDF file.'
      formData.value.approvalLetterFile = null
      if (inputElement) inputElement.value = null // Reset file input
    } else if (file.size > 5 * 1024 * 1024) {
      // 5MB
      errors.value.approvalLetterFile = 'File size must be less than 5MB.'
      formData.value.approvalLetterFile = null
      if (inputElement) inputElement.value = null // Reset file input
    } else {
      formData.value.approvalLetterFile = file
      errors.value.approvalLetterFile = '' // Clear previous errors like "required" or "PDF only"
      props.handleApprovalLetterUpload(event) // Call the prop function to pass the event to parent
    }
  } else {
    // If no file is selected (e.g., user cancels file dialog)
    formData.value.approvalLetterFile = null
    // If the field was previously valid and now no file is selected,
    // validateInput will check if it's required and set error accordingly.
  }
  validateInput() // Re-validate to update overall form validity and error state for file input
  emitUpdate() // Emit update as isApproved state might affect parent's approvalLetter
}

// Emit updated form data
const emitUpdate = () => {
  const dataToEmit = {
    isApproved: formData.value.isApproved,
    title: formData.value.title.trim(),
    venue: formData.value.venue.trim(),
    fromDate: formData.value.fromDate,
    toDate: formData.value.toDate,
    // Note: approvalLetterFile itself is not directly part of the modelValue emitted here.
    // The parent component handles the actual file object through the `handleApprovalLetterUpload` prop.
    // However, the `isApproved` status, which is part of this emit, dictates if the parent expects that file.
  }
  emit('update:modelValue', dataToEmit)
}

// Watch for prop changes to re-initialize form data
watch(
  () => props.application,
  (newValue) => {
    // Update formData based on incoming props
    formData.value.isApproved =
      newValue.isApproved !== undefined ? String(newValue.isApproved) : null
    formData.value.title = newValue.title || ''
    formData.value.venue = newValue.venue || ''
    formData.value.fromDate = newValue.fromDate || ''
    formData.value.toDate = newValue.toDate || ''
    // formData.value.approvalLetterFile is managed locally and by the parent through prop.
    // If the parent passes a new approvalLetter file (e.g., when editing),
    // that should be handled by the parent updating its own state and potentially
    // re-rendering this component or providing a mechanism to clear/update the file input.
    // For now, we assume the parent manages the actual File object for `approvalLetter`.
    validateInput() // Validate after updating from props
  },
  { immediate: true, deep: true },
)

// Watch for isApproved changes to emit approval-change and manage conditional logic
watch(
  () => formData.value.isApproved,
  (newValue, oldValue) => {
    // Only proceed if the value has actually changed to avoid redundant operations
    if (newValue === oldValue && oldValue !== undefined && oldValue !== null && newValue !== null)
      return

    emit('approval-change', newValue) // Emit the change in approval status

    if (newValue !== 'true') {
      // If "No" is selected or it's unselected (null), clear the local approval letter file state
      formData.value.approvalLetterFile = null
      // Also, reset the file input element itself
      const fileInput = document.getElementById('approvalLetter')
      if (fileInput) {
        fileInput.value = null
      }
      // The error for approvalLetterFile will be cleared by validateInput if it's no longer required.
    }
    // The title, venue, and dates are always visible, so they are not cleared here.
    // Their validation status will be updated by validateInput.

    validateInput() // Re-validate the form
    emitUpdate() // Emit the updated model value
  },
  // { immediate: true } // Consider if immediate is needed here, might conflict with prop watcher
)
</script>
