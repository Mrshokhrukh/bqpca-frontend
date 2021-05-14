<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="bg-blue-600 p-2 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">CPD Application</h2>
          <p class="mt-1 text-sm text-gray-600">Please provide information about your Continuing Professional Development application</p>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="p-6 space-y-8">
      <form>
        <!-- First Section: Basic Information -->
        <div class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
                    v-model="formData.isApproved"
                    class="sr-only peer"
                  />
                  <label for="approvedYes" class="flex items-center px-5 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300">
                    <div class="h-4 w-4 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 mr-2">
                      <div v-if="formData.isApproved === 'true'" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-700">Yes</span>
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
                  />
                  <label for="approvedNo" class="flex items-center px-5 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300">
                    <div class="h-4 w-4 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 mr-2">
                      <div v-if="formData.isApproved === 'false'" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span class="text-sm font-medium text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Title of CPD -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title of CPD <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="title"
                  v-model="formData.title"
                  placeholder="Enter the title of your CPD"
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-10 p-2.5"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Second Section: Location & Dates -->
        <div class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location & Timeframe
          </h3>

          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <!-- Venue -->
            <div class="mb-5">
              <label for="venue" class="block text-sm font-medium text-gray-700 mb-2">
                Venue <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="venue"
                  v-model="formData.venue"
                  placeholder="Enter venue location"
                  class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-10 p-2.5"
                />
              </div>
            </div>

            <!-- Date Range -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- From Date -->
              <div>
                <label for="fromDate" class="block text-sm font-medium text-gray-700 mb-2">
                  From Date <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="fromDate"
                    v-model="formData.fromDate"
                    class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-10 p-2.5"
                  />
                </div>
              </div>

              <!-- To Date -->
              <div>
                <label for="toDate" class="block text-sm font-medium text-gray-700 mb-2">
                  To Date <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="toDate"
                    v-model="formData.toDate"
                    class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-10 p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Section: Documentation - Conditional -->
        <div v-if="formData.isApproved === 'true'" class="mb-8">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documentation
          </h3>

          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <!-- Approval Letter -->
            <div>
              <label for="approvalLetter" class="block text-sm font-medium text-gray-700 mb-2">
                Attach Approval Letter <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="file"
                  id="approvalLetter"
                  @change="handleApprovalLetterUpload"
                  accept=".pdf"
                  class="hidden"
                />
                <label
                  for="approvalLetter"
                  class="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="space-y-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <span v-if="formData.approvalLetterFile" class="text-blue-600 font-medium">
                        {{ formData.approvalLetterFile.name }}
                      </span>
                      <span v-else class="text-gray-500">
                        Click to upload or drag and drop
                      </span>
                    </div>
                    <p class="text-xs text-gray-500">PDF up to 5MB</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- No footer buttons as requested -->
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  application: Object,
  handleApprovalLetterUpload: Function,
})

const emit = defineEmits(['update:modelValue'])

const formData = ref({
  isApproved: props.application?.isApproved || null,
  title: props.application?.title || '',
  venue: props.application?.venue || '',
  fromDate: props.application?.fromDate || '',
  toDate: props.application?.toDate || '',
  approvalLetterFile: null,
  ...props.application,
})

watch(
  formData,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true },
)

watch(
  () => props.application,
  (newValue) => {
    formData.value = { ...formData.value, ...newValue }
  },
  { deep: true },
)
</script>