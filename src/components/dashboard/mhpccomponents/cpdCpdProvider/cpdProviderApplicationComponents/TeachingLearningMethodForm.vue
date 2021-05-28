<!-- TeachingLearningMethodForm.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">Teaching & Learning Methods</h2>
      <p class="mt-1 text-sm text-gray-600">Specify the teaching methods and methodologies for the CPD program.</p>
    </div>

    <div class="p-6 space-y-8">
      <form @submit.prevent>
        <!-- Type of CPD -->
        <div class="mb-5">
          <label for="cpd-type" class="block text-sm font-medium text-gray-700 mb-2">
            Type of CPD <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select
              id="cpd-type"
              v-model="localTeachingMethod.type"
              :class="[
                'w-full rounded-lg border shadow-sm p-2.5',
                errors.type ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              ]"
              @change="emitUpdate"
              aria-describedby="cpd-type-error"
            >
              <option value="" disabled>Select CPD Type</option>
              <option v-for="option in cpdTypeOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <p v-if="errors.type" id="cpd-type-error" class="mt-1 text-xs text-red-500 flex items-center">
            {{ errors.type }}
          </p>
        </div>

        <!-- Methodologies -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Methodologies <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-white">
            <div
              v-for="methodology in methodologyOptions"
              :key="methodology.value"
              class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
            >
              <input
                :id="`methodology-${methodology.value}`"
                v-model="localSelectedMethodologies"
                :value="methodology.value"
                type="checkbox"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                @change="emitSelectedMethodologiesUpdate"
              />
              <label
                :for="`methodology-${methodology.value}`"
                class="text-sm text-gray-700 cursor-pointer flex-1 leading-5"
              >
                {{ methodology.text }}
              </label>
            </div>
          </div>
          <p v-if="errors.methodologies" class="mt-1 text-xs text-red-500 flex items-center">
            {{ errors.methodologies }}
          </p>
        </div>

        <!-- Expected Outcome -->
        <div class="mb-5">
          <label for="expected-outcome" class="block text-sm font-medium text-gray-700 mb-2">
            Expected Outcome <span class="text-red-500">*</span>
          </label>
          <textarea
            id="expected-outcome"
            v-model="localTeachingMethod.expectedOutcome"
            rows="4"
            placeholder="Describe the expected outcome of the CPD..."
            :class="[
              'w-full rounded-lg border shadow-sm p-2.5',
              errors.expectedOutcome ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ]"
            @input="emitUpdate"
            aria-describedby="expected-outcome-error"
          ></textarea>
          <p v-if="errors.expectedOutcome" id="expected-outcome-error" class="mt-1 text-xs text-red-500 flex items-center">
            {{ errors.expectedOutcome }}
          </p>
        </div>

        <!-- Teaching Methods -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Teaching Methods <span class="text-red-500">*</span>
          </label>
          <div v-for="(method, index) in localTeachingMethods" :key="index" class="mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  v-model="method.activity"
                  placeholder="Enter activity"
                  :class="[
                    'w-full rounded-lg border shadow-sm p-2.5',
                    errors.teachingMethods ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  ]"
                  @input="emitTeachingMethodsUpdate"
                />
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  v-model.number="method.duration"
                  min="0"
                  placeholder="Duration (hours)"
                  :class="[
                    'w-full rounded-lg border shadow-sm p-2.5',
                    errors.teachingMethods ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  ]"
                  @input="emitTeachingMethodsUpdate"
                />
                <button
                  v-if="localTeachingMethods.length > 1"
                  type="button"
                  @click="removeTeachingMethod(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            @click="addTeachingMethod"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add Teaching Method
          </button>
          <p v-if="errors.teachingMethods" class="mt-1 text-xs text-red-500 flex items-center">
            {{ errors.teachingMethods }}
          </p>
        </div>

        <!-- Total Hours -->
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Total Hours
          </label>
          <input
            type="text"
            :value="totalHours"
            disabled
            class="w-full rounded-lg border border-gray-300 shadow-sm p-2.5 bg-gray-100"
          />
        </div>

        <!-- Course Document -->
        <div class="mb-5">
          <label for="course-document" class="block text-sm font-medium text-gray-700 mb-2">
            Course Document <span class="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="course-document"
            @change="handleCourseDocumentUpload"
            accept=".pdf"
            class="hidden"
            aria-describedby="course-document-error"
          />
          <label
            for="course-document"
            :class="[
              'flex items-center justify-center w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200',
              errors.courseDocument ? 'border-red-500' : 'border-gray-300'
            ]"
          >
            <div class="space-y-1 text-center">
              <span v-if="courseDocument?.name" class="text-blue-600 font-medium">
                {{ courseDocument.name }}
              </span>
              <span v-else class="text-gray-500">
                Click to upload or drag and drop
              </span>
              <p class="text-xs text-gray-500">PDF up to 5MB</p>
            </div>
          </label>
          <p v-if="errors.courseDocument" id="course-document-error" class="mt-1 text-xs text-red-500 flex items-center">
            {{ errors.courseDocument }}
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch,  } from 'vue';

const props = defineProps({
  teachingMethod: {
    type: Object,
    required: true,
    default: () => ({ type: '', expectedOutcome: '' }),
  },
  cpdTypeOptions: {
    type: Array,
    default: () => [],
  },
  methodologyOptions: {
    type: Array,
    default: () => [],
  },
  selectedMethodologies: {
    type: Array,
    default: () => [],
  },
  teachingMethods: {
    type: Array,
    default: () => [{ activity: '', duration: null }],
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  courseDocument: {
    type: [File, null],
    default: null,
  },
  handleCourseDocumentUpload: {
    type: Function,
    required: true,
  },
  addTeachingMethod: {
    type: Function,
    required: true,
  },
  removeTeachingMethod: {
    type: Function,
    required: true,
  },
  calculateTotalHours: {
    type: Function,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  'update:teachingMethod',
  'update:selectedMethodologies',
  'update:teachingMethods',
]);

const localTeachingMethod = ref({
  type: props.teachingMethod.type || '',
  expectedOutcome: props.teachingMethod.expectedOutcome || '',
});
const localSelectedMethodologies = ref([...props.selectedMethodologies]);
const localTeachingMethods = ref(
  props.teachingMethods.length > 0
    ? props.teachingMethods.map((m) => ({ ...m }))
    : [{ activity: '', duration: null }]
);

watch(
  () => props.teachingMethod,
  (newValue) => {
    localTeachingMethod.value = {
      type: newValue.type || '',
      expectedOutcome: newValue.expectedOutcome || '',
    };
  },
  { deep: true }
);

watch(
  () => props.selectedMethodologies,
  (newValue) => {
    localSelectedMethodologies.value = [...newValue];
  },
  { deep: true }
);

watch(
  () => props.teachingMethods,
  (newValue) => {
    localTeachingMethods.value = newValue.length > 0
      ? newValue.map((m) => ({ ...m }))
      : [{ activity: '', duration: null }];
  },
  { deep: true }
);

const emitUpdate = () => {
  emit('update:teachingMethod', {
    type: localTeachingMethod.value.type.trim(),
    expectedOutcome: localTeachingMethod.value.expectedOutcome.trim(),
  });
};

const emitSelectedMethodologiesUpdate = () => {
  console.log('Emitting selectedMethodologies update:', localSelectedMethodologies.value);
  emit('update:selectedMethodologies', [...localSelectedMethodologies.value]);
};

const emitTeachingMethodsUpdate = () => {
  props.calculateTotalHours();
  emit('update:teachingMethods', localTeachingMethods.value.map((m) => ({
    activity: m.activity?.trim() || '',
    duration: Number(m.duration) || null,
  })));
};

const addTeachingMethod = () => {
  props.addTeachingMethod();
};

const removeTeachingMethod = (index) => {
  props.removeTeachingMethod(index);
};

const handleCourseDocumentUpload = (event) => {
  props.handleCourseDocumentUpload(event);
};
</script>