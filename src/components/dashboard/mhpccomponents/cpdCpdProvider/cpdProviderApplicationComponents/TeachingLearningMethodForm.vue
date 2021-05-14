// TeachingLearningMethodForm.vue
<template>
  <div class="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 flex items-center">
        <span class="inline-block mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </span>
        Teaching & Learning Method
      </h3>
      <p class="mt-2 text-sm text-gray-600">Complete the details about your teaching approach and learning activities.</p>
    </div>

    <!-- Form Content -->
    <div class="p-6 space-y-8">
      <!-- Section 1: Basic Information -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Basic Information
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type of CPD -->
          <div>
            <label for="typeCPD" class="block text-sm font-medium text-gray-700 mb-1">
              Type of CPD <span class="text-red-500">*</span>
            </label>
            <select
              id="typeCPD"
              :value="teachingMethod.type"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-white transition-colors duration-200"
            >
              <option value="" disabled>Select Type</option>
              <option v-for="type in cpdTypeOptions" :key="type.value" :value="type.value">
                {{ type.text }}
              </option>
            </select>
          </div>

          <!-- Course Document -->
          <div>
            <label for="courseDocument" class="block text-sm font-medium text-gray-700 mb-1">
              Course Document <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type="file"
                id="courseDocument"
                @change="handleCourseDocumentUpload"
                class="hidden"
              />
              <label
                for="courseDocument"
                class="cursor-pointer flex items-center justify-center w-full text-sm text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {{ courseDocument ? courseDocument.name : 'Upload Document' }}
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Accepted file format: PDF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      <!-- Section 2: Methodologies -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          Teaching Methodologies
        </h4>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="method in methodologyOptions"
            :key="method.value"
            class="relative"
          >
            <input
              type="checkbox"
              :id="'method-' + method.value"
              :model-value="selectedMethodologies"
              :value="method.value"
              class="peer absolute h-0 w-0 opacity-0"
            />
            <label
              :for="'method-' + method.value"
              class="flex items-center p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-colors duration-200"
            >
              <div class="h-4 w-4 mr-2 rounded border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500">
                <svg v-show="selectedMethodologies.includes(method.value)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm text-gray-700">{{ method.text }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Section 3: Expected Outcome -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Objective & Expected Outcome
        </h4>

        <div>
          <textarea
            id="expectedOutcome"
            :value="teachingMethod.expectedOutcome"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white transition-colors duration-200"
            rows="4"
            placeholder="Describe the expected outcomes and learning objectives..."
          ></textarea>
        </div>
      </div>

      <!-- Section 4: Learning Activities -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Learning Activities and Duration
        </h4>

        <div class="space-y-4">
          <div v-if="teachingMethods.length === 0" class="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300">
            <p class="text-gray-500">No activities added yet</p>
            <button
              @click="addTeachingMethod"
              class="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
            >
              Add Your First Activity
            </button>
          </div>

          <div v-for="(method, index) in teachingMethods" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-200">
            <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Activity <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="method.activity"
                  placeholder="Enter activity name"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
              </div>
              <div class="md:w-1/3">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  v-model.number="method.duration"
                  @input="calculateTotalHours"
                  min="0"
                  step="0.5"
                  placeholder="0.0"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
              </div>
              <div class="flex items-end">
                <button
                  @click="removeTeachingMethod(index)"
                  class="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Remove activity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <button
              v-if="teachingMethods.length > 0"
              @click="addTeachingMethod"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Activity
            </button>

            <div class="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <p class="text-sm text-blue-800 font-medium">Total Hours: <span class="text-lg font-semibold">{{ totalHours }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          class="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  teachingMethod: Object,
  cpdTypeOptions: Array,
  methodologyOptions: Array,
  teachingMethods: Array,
  selectedMethodologies: Array,
  totalHours: Number,
  courseDocument: Object,
  handleCourseDocumentUpload: Function,
  addTeachingMethod: Function,
  removeTeachingMethod: Function,
  calculateTotalHours: Function,
})
</script>