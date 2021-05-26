<!-- TeachingMethodForm.vue -->
<template>
  <div class="bg-gray-50 rounded-lg p-6 mb-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
      Teaching & Learning Method
    </h3>

    <!-- CPD Type Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Type of CPD <span class="text-red-500">*</span>
      </label>
      <select v-model="localTeachingMethod.type" @change="updateTeachingMethod"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required>
        <option value="">Select CPD Type</option>
        <option v-for="option in cpdTypeOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>

    <!-- Teaching Methodologies - Checkboxes -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        Teaching Methodologies <span class="text-red-500">*</span>
      </label>
      <div v-if="isLoading" class="text-gray-500 text-sm">
        Loading methodologies...
      </div>
      <div v-else-if="methodologyOptions.length === 0" class="text-gray-500 text-sm">
        No methodologies available
      </div>
      <div v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-white">
        <div v-for="methodology in methodologyOptions" :key="methodology.value"
          class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
          <input :id="`methodology-${methodology.value}`" v-model="localSelectedMethodologies"
            :value="methodology.value" type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            @change="updateSelectedMethodologies" />
          <label :for="`methodology-${methodology.value}`"
            class="text-sm text-gray-700 cursor-pointer flex-1 leading-5">
            {{ methodology.text }}
          </label>
        </div>
      </div>
      <div v-if="localSelectedMethodologies.length > 0" class="mt-2">
        <p class="text-sm text-gray-600">
          Selected: {{ localSelectedMethodologies.length }} methodologies
        </p>
        <div class="flex flex-wrap gap-1 mt-1">
          <span v-for="methodologyId in localSelectedMethodologies" :key="methodologyId"
            class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {{ getMethodologyName(methodologyId) }}
            <button @click="removeMethodology(methodologyId)" class="ml-1 text-blue-600 hover:text-blue-800 font-bold">
              ×
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Selection Buttons -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button @click="selectAll" type="button"
          class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          :disabled="isLoading || methodologyOptions.length === 0">
          Select All
        </button>
        <button @click="clearAll" type="button"
          class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          :disabled="isLoading || methodologyOptions.length === 0">
          Clear All
        </button>
        <button @click="selectCommon" type="button"
          class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          :disabled="isLoading || methodologyOptions.length === 0">
          Select Common
        </button>
      </div>
    </div>

    <!-- Learning Activities -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <label class="block text-sm font-medium text-gray-700">
          Learning Activities <span class="text-red-500">*</span>
        </label>
        <button @click="addTeachingMethod" type="button"
          class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          :disabled="isLoading">
          + Add Activity
        </button>
      </div>

      <div v-if="!localTeachingMethods.length"
        class="text-center py-6 bg-white rounded-md border border-dashed border-gray-300">
        <p class="text-gray-500">No activities added yet</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="(method, index) in localTeachingMethods" :key="index"
          class="flex gap-3 items-center p-3 bg-white border border-gray-200 rounded-md">
          <div class="flex-1">
            <input v-model="method.activity" @input="updateTeachingMethods" type="text"
              placeholder="Learning Activity Name"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required />
          </div>
          <div class="w-32">
            <input v-model.number="method.duration" @input="updateTeachingMethods" type="number" placeholder="Hours"
              min="0.5" step="0.5"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required />
          </div>
          <button v-if="localTeachingMethods.length > 1" @click="removeTeachingMethod(index)" type="button"
            class="px-2 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Remove
          </button>
        </div>
      </div>

      <div v-if="totalHours > 0" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p class="text-sm text-blue-800 font-medium">
          Total Hours: {{ totalHours }} | Total Credits: {{ totalHours }}
        </p>
      </div>
    </div>

    <!-- Expected Outcome -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Objective & Expected Outcome <span class="text-red-500">*</span>
      </label>
      <textarea v-model="localTeachingMethod.expectedOutcome" @input="updateTeachingMethod" rows="4"
        placeholder="Describe the objectives and expected outcomes of the CPD program..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required></textarea>
    </div>

    <!-- Course Document Upload -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Course Document <span class="text-red-500">*</span>
      </label>
      <div class="flex items-center space-x-3">
        <input @change="handleCourseDocumentUpload" type="file" accept=".pdf"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <div v-if="courseDocumentFile" class="text-sm text-green-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
          Uploaded
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-1">
        Upload PDF file (max 5MB) containing course curriculum, syllabus, or training materials
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  teachingMethod: {
    type: Object,
    required: true,
    default: () => ({ type: '', expectedOutcome: '' })
  },
  selectedMethodologies: {
    type: Array,
    default: () => []
  },
  teachingMethods: {
    type: Array,
    default: () => [],
    validator: (value) => Array.isArray(value)
  },
  cpdTypeOptions: {
    type: Array,
    default: () => []
  },
  methodologyOptions: {
    type: Array,
    default: () => []
  },
  totalHours: {
    type: Number,
    default: 0
  },
  courseDocumentFile: {
    type: [File, null],
    default: null
  },
  handleCourseDocumentUpload: {
    type: Function,
    required: true
  },
  addTeachingMethod: {
    type: Function,
    required: true
  },
  removeTeachingMethod: {
    type: Function,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:teachingMethod',
  'update:selectedMethodologies',
  'update:teachingMethods'
]);

// Local reactive copies
const localTeachingMethod = ref({ ...props.teachingMethod });
const localSelectedMethodologies = ref([...props.selectedMethodologies]);
const localTeachingMethods = ref(Array.isArray(props.teachingMethods) ? [...props.teachingMethods] : []);

// Watch for prop changes
watch(() => props.teachingMethod, (newVal) => {
  localTeachingMethod.value = { ...newVal };
}, { deep: true });

watch(() => props.selectedMethodologies, (newVal) => {
  localSelectedMethodologies.value = Array.isArray(newVal) ? [...newVal] : [];
}, { deep: true });

watch(() => props.teachingMethods, (newVal) => {
  localTeachingMethods.value = Array.isArray(newVal) ? [...newVal] : [];
}, { deep: true });

// Methods
const updateTeachingMethod = () => {
  emit('update:teachingMethod', localTeachingMethod.value);
};

const updateSelectedMethodologies = () => {
  emit('update:selectedMethodologies', localSelectedMethodologies.value);
};

const updateTeachingMethods = () => {
  if (!Array.isArray(localTeachingMethods.value)) {
    localTeachingMethods.value = [];
  }
  emit('update:teachingMethods', localTeachingMethods.value);
};

const getMethodologyName = (methodologyId) => {
  const methodology = props.methodologyOptions.find(m => m.value === methodologyId);
  return methodology ? methodology.text : `ID: ${methodologyId}`;
};

const removeMethodology = (methodologyId) => {
  const index = localSelectedMethodologies.value.indexOf(methodologyId);
  if (index > -1) {
    localSelectedMethodologies.value.splice(index, 1);
    updateSelectedMethodologies();
  }
};

// Quick selection methods
const selectAll = () => {
  localSelectedMethodologies.value = props.methodologyOptions.map(m => m.value);
  updateSelectedMethodologies();
};

const clearAll = () => {
  localSelectedMethodologies.value = [];
  updateSelectedMethodologies();
};

const selectCommon = () => {
  const commonMethodologyNames = [
    'lecture',
    'discussion',
    'case study',
    'workshop',
    'demonstration',
    'presentation'
  ];

  const commonMethodologies = props.methodologyOptions.filter(m =>
    commonMethodologyNames.some(common =>
      m.text.toLowerCase().includes(common.toLowerCase())
    )
  );

  localSelectedMethodologies.value = commonMethodologies.map(m => m.value);
  updateSelectedMethodologies();
};

const handleCourseDocumentUpload = (event) => {
  props.handleCourseDocumentUpload(event);
};

// Initialize
onMounted(() => {
  localTeachingMethod.value = { ...props.teachingMethod };
  localSelectedMethodologies.value = Array.isArray(props.selectedMethodologies)
    ? [...props.selectedMethodologies]
    : [];
  localTeachingMethods.value = Array.isArray(props.teachingMethods)
    ? [...props.teachingMethods]
    : [];
  console.log('teachingMethods prop:', props.teachingMethods); // Debug
});
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

input[type="checkbox"]:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

.inline-block {
  transition: all 0.2s ease-in-out;
}

.inline-block:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>