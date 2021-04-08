<!-- src/components/CourseManagement.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6 md:p-8"> <!-- Container matching EOI form style -->
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Course Management</h3>

    <!-- Add Button -->
    <div class="mb-6">
      <button @click="handleAdd"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
         <!-- Plus Icon (Heroicons) -->
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 -ml-1">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
         </svg>
        Add New Course
      </button>
    </div>

    <!-- Course Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code (ID)</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="courseList.length === 0">
              <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">No courses found.</td>
          </tr>
          <tr v-for="course in courseList" :key="course.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ course.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ course.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ course.department }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ course.credits }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
              <div class="flex items-center justify-center space-x-2">
                 <!-- Edit Button -->
                 <button @click="handleEdit(course)" title="Edit Course"
                    class="inline-flex items-center justify-center rounded border border-transparent bg-yellow-100 p-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200">
                    <!-- Pencil Icon (Heroicons) -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                 </button>
                 <!-- Delete Button -->
                 <button @click="handleDelete(course.id)" title="Delete Course"
                    class="inline-flex items-center justify-center rounded border border-transparent bg-red-100 p-1.5 text-xs font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200">
                     <!-- Trash Icon (Heroicons) -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1H8.75zM10 4.5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5A.75.75 0 0110 4.5z" clip-rule="evenodd" />
                    </svg>
                 </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <SimpleModal :is-open="isModalOpen" :title="modalTitle" @close="closeModal">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label for="course-id" class="block text-sm font-medium text-gray-700 mb-1 required-label">Course Code (ID):</label>
          <input type="text" id="course-id" v-model="formData.id" required :disabled="!!currentCourseId"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
          <p v-if="currentCourseId" class="mt-1 text-xs text-gray-500">Course code cannot be changed after creation.</p>
        </div>
        <div>
          <label for="course-name" class="block text-sm font-medium text-gray-700 mb-1 required-label">Course Name:</label>
          <input type="text" id="course-name" v-model="formData.name" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>
        <div>
          <label for="course-department" class="block text-sm font-medium text-gray-700 mb-1 required-label">Department:</label>
          <!-- TODO: Replace with a select populated from Department Management -->
          <input type="text" id="course-department" v-model="formData.department" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>
         <div>
          <label for="course-credits" class="block text-sm font-medium text-gray-700 mb-1 required-label">Credits:</label>
          <input type="number" id="course-credits" v-model.number="formData.credits" required min="0"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
           <button type="button" @click="closeModal"
               class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
               Cancel
           </button>
           <button type="submit" :disabled="isSubmitting"
               class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50">
               {{ isSubmitting ? 'Saving...' : (currentCourseId ? 'Save Changes' : 'Add Course') }}
           </button>
        </div>
      </form>
    </SimpleModal>
  </div>
</template>

<script setup>
import { ref, computed, } from 'vue';
import SimpleModal from './SimpleModal.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

// --- MOCK DATA & STATE ---
const initialCourses = [
  { id: 'CS101', name: 'Introduction to Programming', department: 'Computer Science', credits: 3 },
  { id: 'MECH205', name: 'Thermodynamics I', department: 'Mechanical Engineering', credits: 4 },
  { id: 'EE301', name: 'Signals and Systems', department: 'Electrical Engineering', credits: 3 },
];
const getDefaultFormData = () => ({ id: '', name: '', department: '', credits: 0 });
const courseList = ref([...initialCourses]);
const isModalOpen = ref(false);
const currentCourseId = ref(null); // Store ID (course code) for editing
const formData = ref(getDefaultFormData());
const isSubmitting = ref(false);

// --- COMPUTED ---
const modalTitle = computed(() => (currentCourseId.value ? 'Edit Course' : 'Add New Course'));

// --- METHODS ---
const handleAdd = () => {
  currentCourseId.value = null;
  formData.value = getDefaultFormData();
  isModalOpen.value = true;
};

const handleEdit = (course) => {
  currentCourseId.value = course.id;
  formData.value = { ...course };
  isModalOpen.value = true;
};

const handleDelete = (courseId) => {
  if (confirm(`Are you sure you want to delete course ${courseId}?`)) {
    // TODO: API Call: DELETE /api/courses/{courseId}
    console.log('Deleting course ID:', courseId);
    courseList.value = courseList.value.filter(c => c.id !== courseId);
    toast.success(`Course ${courseId} deleted successfully.`);
  }
};

const handleSave = () => {
  isSubmitting.value = true;

  // Basic validation example
  if (!formData.value.id || !formData.value.name || !formData.value.department || formData.value.credits < 0) {
      toast.error("Please fill in all required fields correctly.");
      isSubmitting.value = false;
      return;
  }

  // Simulate API call
  setTimeout(() => {
    try {
        if (currentCourseId.value) {
          // --- Update ---
          // TODO: API Call: PUT /api/courses/{currentCourseId.value} with formData.value
          console.log('Updating course:', formData.value);
          const index = courseList.value.findIndex(c => c.id === currentCourseId.value);
          if (index !== -1) {
            courseList.value[index] = { ...formData.value };
          }
          toast.success(`Course ${currentCourseId.value} updated successfully.`);
        } else {
          // --- Add ---
          // Check if ID (course code) already exists
          if (courseList.value.some(c => c.id === formData.value.id)) {
              toast.error(`Course code ${formData.value.id} already exists!`);
              isSubmitting.value = false; // Allow user to correct
              return;
          }
          // TODO: API Call: POST /api/courses with formData.value
          const newCourse = { ...formData.value };
          console.log('Adding course:', newCourse);
          courseList.value.push(newCourse);
          toast.success(`Course ${newCourse.id} added successfully.`);
        }
        closeModal();
    } catch (error) {
        console.error("Error saving course:", error);
        toast.error("Failed to save course.");
    } finally {
        isSubmitting.value = false;
    }
  }, 500); // Simulate delay
};

const closeModal = () => {
  isModalOpen.value = false;
  // Resetting form on open (handleAdd/handleEdit) is usually enough
};

// --- LIFECYCLE ---
// onMounted(() => { /* Fetch courses if needed */ });

</script>

<!-- No <style scoped> block needed -->