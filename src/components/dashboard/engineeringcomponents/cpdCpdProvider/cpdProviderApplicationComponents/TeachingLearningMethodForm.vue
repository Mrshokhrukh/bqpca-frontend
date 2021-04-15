//8. TeachingLearningMethodForm.vue
<template>
  <div>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">Teaching Learning Method</h3>
      <p class="mt-1 text-sm text-gray-500">Details about the teaching and learning method.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Type of CPD -->
      <div class="col-span-1">
        <label for="typeCPD" class="block text-sm font-medium text-gray-700"
          >Type of CPD <span class="text-red-500">*</span></label
        >
        <select
          id="typeCPD"
          :value="teachingMethod.type"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">Select Type</option>
          <option v-for="type in cpdTypeOptions" :key="type.value" :value="type.value">
            {{ type.text }}
          </option>
        </select>
      </div>

      <!-- Methodologies -->
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-700"
          >Methodologies <span class="text-red-500">*</span></label
        >
        <div class="mt-2">
          <div
            v-for="method in methodologyOptions"
            :key="method.value"
            class="flex items-center mb-2"
          >
            <input
              type="checkbox"
              :id="'method-' + method.value"
              :model-value="selectedMethodologies"
              :value="method.value"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label :for="'method-' + method.value" class="ml-2 block text-sm text-gray-700">{{
              method.text
            }}</label>
          </div>
        </div>
      </div>

      <!-- Expected Outcome -->
      <div class="col-span-1">
        <label for="expectedOutcome" class="block text-sm font-medium text-gray-700">
          Objective/Expected Outcome <span class="text-red-500">*</span>
        </label>
        <textarea
          id="expectedOutcome"
          :value="teachingMethod.expectedOutcome"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          rows="4"
        ></textarea>
      </div>

      <!-- Activity and Duration in Hours -->
      <div class="col-span-2">
        <h4 class="text-md font-medium mb-2">Learning Activities and Duration</h4>
        <div v-for="(method, index) in teachingMethods" :key="index" class="flex space-x-4 mb-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700"
              >Activity <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              v-model="method.activity"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700"
              >Duration in Hours <span class="text-red-500">*</span></label
            >
            <input
              type="number"
              v-model.number="method.duration"
              @input="calculateTotalHours"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <button
            @click="removeTeachingMethod(index)"
            class="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Remove
          </button>
        </div>
        <button
          @click="addTeachingMethod"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add New Row
        </button>

        <div class="mt-4 p-3 bg-blue-50 rounded-lg">
          <p class="font-medium">Total Hours: {{ totalHours }}</p>
          <p>Calculated CPD Credits: {{ calculatedCredits }}</p>
        </div>
      </div>

      <!-- Course Document -->
      <div class="col-span-1">
        <label for="courseDocument" class="block text-sm font-medium text-gray-700"
          >Course Document <span class="text-red-500">*</span></label
        >
        <input
          type="file"
          id="courseDocument"
          @change="handleCourseDocumentUpload"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
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
  calculatedCredits: Number,
  courseDocument: Object, // File object
  handleCourseDocumentUpload: Function,
  addTeachingMethod: Function,
  removeTeachingMethod: Function,
  calculateTotalHours: Function,
})
</script>
