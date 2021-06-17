<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Faculty Assignment</h2>

      <!-- Display Only Module/Program Info -->
      <div v-if="assignment" class="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">Assignment Context</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Program</label>
            <p class="text-gray-800 mt-0.5">{{ assignment.module?.semester?.program_name || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</label>
            <p class="text-gray-800 mt-0.5">
              {{ assignment.module?.semester?.name || 'N/A' }}
              <span v-if="assignment.module?.semester?.academic_year" class="text-gray-600 text-xs">
                (AY: {{ assignment.module.semester.academic_year }})
              </span>
            </p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Module</label>
            <p class="text-gray-800 mt-0.5">{{ assignment.module?.module_master?.module_name || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider">Module Code</label>
            <p class="text-gray-800 mt-0.5">{{ assignment.module?.module_master?.module_code || 'N/A' }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Faculty Dropdown -->
        <div>
          <label for="faculty" class="block text-sm font-medium text-gray-700">Assigned Faculty</label>
          <select
            id="faculty"
            v-model="formData.faculty_id"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :disabled="facultyList.length === 0 && !formData.faculty_id"
          >
            <option value="">Select Faculty</option>
            <option v-for="faculty in facultyList" :key="faculty.id" :value="faculty.id">
              {{ faculty.faculty_name }}
            </option>
          </select>
          <p v-if="facultyList.length === 0 && !formData.faculty_id" class="text-yellow-600 text-xs mt-1">Faculty list is unavailable. You may not be able to change faculty.</p>
          <p v-if="errors.faculty_id" class="text-red-500 text-sm mt-1">{{ errors.faculty_id }}</p>
        </div>

        <!-- Number of Students -->
        <div>
          <label for="student_count" class="block text-sm font-medium text-gray-700">Number of Students</label>
          <input
            id="student_count"
            v-model.number="formData.student_count"
            type="number"
            min="0"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter number of students"
          />
          <p v-if="errors.student_count" class="text-red-500 text-sm mt-1">{{ errors.student_count }}</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-8 flex justify-end space-x-3">
        <button
          @click="cancel"
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          @click="save"
          type="button"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  assignment: { type: Object, default: null },
  facultyList: { type: Array, required: true },
});

const emit = defineEmits(['close', 'save']);

const initialFormData = () => ({
  id: null,
  faculty_id: '',
  module_id: null,
  student_count: null, // Allow null to better handle empty input state
});

const formData = ref(initialFormData());
const errors = ref({});
const isSaving = ref(false);

watch(
  () => props.assignment,
  (newAssignment) => {
    errors.value = {}; // Reset errors when the assignment data changes
    if (newAssignment) {
      formData.value = {
        id: newAssignment.id,
        faculty_id: newAssignment.faculty?.id || '',
        module_id: newAssignment.module?.id,
        // Ensure student_count is a number or null; default to null if not provided or invalid type
        student_count: typeof newAssignment.module?.student_count === 'number'
                       ? newAssignment.module.student_count
                       : null,
      };
    } else {
      formData.value = initialFormData();
    }
  },
  { immediate: true, deep: true }
);

const validate = () => {
  errors.value = {};
  if (!formData.value.faculty_id) {
    errors.value.faculty_id = 'Please select a faculty member.';
  }

  const studentCount = formData.value.student_count;
  if (studentCount === null || studentCount === '' || Number(studentCount) < 0 || Number.isNaN(Number(studentCount))) {
    errors.value.student_count = 'Please enter a valid number of students (0 or greater).';
  }

  return Object.keys(errors.value).length === 0;
};

const save = () => {
  if (!validate()) return;
  isSaving.value = true;

  // Create a payload with the data parent component expects.
  // Ensure student_count is a number if it's valid, or send as is if API handles null.
  // Based on parent's PATCH for student_count, it expects a number.
  const payload = {
    ...formData.value,
    student_count: Number(formData.value.student_count), // Ensure it's a number
  };
  emit('save', payload);

  // isSaving ideally reset by parent or after promise resolution
  // For now, reset here. Parent closes modal which effectively stops this component.
  // isSaving.value = false; // Parent component will close the modal, making this less critical.
  // Let parent handle UI state changes post-save if needed, or if save fails.
};

const cancel = () => {
  emit('close');
};
</script>

<style scoped>
/* Tailwind handles most styling */
@keyframes fade-in-scale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in-scale {
  animation: fade-in-scale 0.3s forwards;
}
</style>