<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Add New Education Program</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isLoadingMasters" class="text-center py-4">Loading master data...</div>
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="currentInstituteName" class="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
            <p class="text-sm font-medium text-gray-700">Adding Program for Institute:</p>
            <p class="text-lg font-semibold text-indigo-700">{{ currentInstituteName }}</p>
        </div>

        <div>
          <label for="programMaster" class="block text-sm font-medium text-gray-700 mb-1">Program</label>
          <select
            id="programMaster"
            v-model="formData.programMasterId"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option disabled value="">Select a Program</option>
            <option v-for="program in programsMaster" :key="program.id" :value="program.id">
              {{ program.program_name }} {{ program.code ? '(' + program.code + ')' : '' }}
            </option>
          </select>
        </div>

        <div>
          <label for="numberOfSemesters" class="block text-sm font-medium text-gray-700 mb-1">Number of Semesters</label>
          <input
            type="number"
            id="numberOfSemesters"
            v-model.number="formData.numberOfSemesters"
            min="1"
            max="12"
            required
            @input="updateSemesters"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div v-if="formData.numberOfSemesters > 0" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700 mt-4 border-b pb-2">Semester Details</h3>
          <div v-for="(semester, semIndex) in formData.semesters" :key="semIndex" class="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3">
            <h4 class="text-md font-semibold text-gray-700">Semester {{ semIndex + 1 }}</h4>

            <div>
              <label :for="`semester-name-${semIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Semester Name (e.g., Fall 2024)</label>
              <input type="text" :id="`semester-name-${semIndex}`" v-model="semester.name" placeholder="Semester Name" required
                     class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"/>
            </div>
             <div>
              <label :for="`semester-acad-year-${semIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Academic Year (e.g., 2024)</label>
              <input type="number" :id="`semester-acad-year-${semIndex}`" v-model.number="semester.academicYear" placeholder="Academic Year" required
                     class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"/>
            </div>

            <div v-for="(moduleItem, modIndex) in semester.modules" :key="modIndex" class="p-3 border border-dashed border-gray-300 rounded bg-white space-y-2">
              <div class="flex justify-between items-center">
                <h5 class="text-sm font-medium text-gray-600">Module {{ modIndex + 1 }}</h5>
                <button type="button" @click="removeModule(semIndex, modIndex)" v-if="semester.modules.length > 1"
                        class="text-red-500 hover:text-red-700 text-xs">Remove Module</button>
              </div>

              <div>
                <label :for="`module-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Module Definition</label>
                <select :id="`module-${semIndex}-${modIndex}`" v-model="moduleItem.moduleMasterId" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs">
                  <option disabled value="">Select Module Definition</option>
                  <option v-for="modMaster in moduleMastersForDropdown" :key="modMaster.id" :value="modMaster.id">
                    {{ modMaster.module_name }} {{ modMaster.module_code ? `(${modMaster.module_code})` : '' }}
                  </option>
                </select>
              </div>

              <div>
                <label :for="`faculty-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Assign Faculty</label>
                <select :id="`faculty-${semIndex}-${modIndex}`" v-model="moduleItem.facultyId" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs">
                  <option disabled value="">Select Faculty</option>
                  <option v-for="faculty in filteredFacultiesMaster" :key="faculty.id" :value="faculty.id">
                    {{ faculty.faculty_name }} {{ faculty.faculty_id ? `(${faculty.faculty_id})` : ''}}
                  </option>
                </select>
              </div>

              <div>
                <label :for="`students-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Number of Students</label>
                <input type="number" :id="`students-${semIndex}-${modIndex}`" v-model.number="moduleItem.numberOfStudents" min="1" required
                       class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"/>
              </div>
            </div>
            <button type="button" @click="addModule(semIndex)"
                    class="mt-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Add Module to Semester {{ semIndex + 1 }}
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button type="button" @click="closeModal" :disabled="isSubmitting"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancel</button>
          <button type="submit" :disabled="isSubmitting || !props.currentUserInstituteId"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {{ isSubmitting ? 'Adding...' : 'Add Program' }}
          </button>
        </div>
        <p v-if="!props.currentUserInstituteId && isOpen" class="text-xs text-red-500 text-center mt-2">
            Cannot add program: Institute information is missing.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import apiServices from '@/services/services'; // Ensure this path is correct

const props = defineProps({
  isOpen: Boolean,
  currentUserInstituteId: [String, Number, null],
  currentInstituteName: [String, null],
});

const emit = defineEmits(['close', 'program-added']);

const isLoadingMasters = ref(false);
const isSubmitting = ref(false);

const programsMaster = ref([]);
const moduleMastersForDropdown = ref([]);
const allFacultiesMaster = ref([]);

const fetchMasterData = async () => {
  isLoadingMasters.value = true;
  try {
    const [programsRes, moduleMastersRes, facultiesRes] = await Promise.all([
      apiServices.getMhpcProgramMasters(),
      apiServices.getMhpcModuleMasters ? apiServices.getMhpcModuleMasters() : apiServices.getMhpcModules(), // Adapt as needed
      apiServices.getMhpcTeachingFaculties(),
    ]);

    programsMaster.value = programsRes.data.results || programsRes.data || [];

    const rawMasters = moduleMastersRes.data.results || moduleMastersRes.data;
    if (rawMasters && rawMasters.length > 0 && rawMasters[0].module_master && typeof rawMasters[0].module_master === 'object') {
        const uniqueModuleMastersMap = new Map();
        if (Array.isArray(rawMasters)) {
            rawMasters.forEach(moduleInstance => {
            if (moduleInstance.module_master && moduleInstance.module_master.id) {
              if (!uniqueModuleMastersMap.has(moduleInstance.module_master.id)) {
                uniqueModuleMastersMap.set(moduleInstance.module_master.id, moduleInstance.module_master);
              }
            }
          });
        }
        moduleMastersForDropdown.value = Array.from(uniqueModuleMastersMap.values());
    } else if (Array.isArray(rawMasters)) {
        moduleMastersForDropdown.value = rawMasters;
    } else {
        moduleMastersForDropdown.value = [];
    }

    if (moduleMastersForDropdown.value.length > 0) {
      moduleMastersForDropdown.value.sort((a, b) => (a.module_name || '').localeCompare(b.module_name || ''));
    }

    allFacultiesMaster.value = (facultiesRes.data.results || facultiesRes.data) || [];

  } catch (error) {
    console.error('Error fetching master data:', error);
    alert('Failed to load master data. Please check console for details and try again.');
  } finally {
    isLoadingMasters.value = false;
  }
};

const filteredFacultiesMaster = computed(() => {
    if (!props.currentUserInstituteId || !allFacultiesMaster.value || allFacultiesMaster.value.length === 0) return [];
    return allFacultiesMaster.value.filter(faculty => String(faculty.institute) === String(props.currentUserInstituteId));
});

onMounted(() => {
  if (props.isOpen) {
    fetchMasterData();
  }
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Fetch master data if it hasn't been fetched or is empty
    if (programsMaster.value.length === 0 || moduleMastersForDropdown.value.length === 0 || allFacultiesMaster.value.length === 0) {
      fetchMasterData();
    }
    // Reset form when modal opens anew
    resetForm();
  }
});

const initialFormData = () => ({
  programMasterId: '',
  numberOfSemesters: 1,
  semesters: [], // Will be populated by updateSemesters
});
const formData = ref(initialFormData());

const createNewModule = () => ({
  moduleMasterId: '',
  facultyId: '',
  numberOfStudents: 10, // Default value
});

const createNewSemester = (index) => ({
  name: `Semester ${index + 1}`, // Default name
  academicYear: new Date().getFullYear(), // Default academic year
  modules: [createNewModule()], // Each new semester starts with one module
});

const updateSemesters = () => {
  const numSems = Number(formData.value.numberOfSemesters) || 0;
  if (numSems < 0) { // Prevent negative numbers although min="1" should handle this
      formData.value.numberOfSemesters = 0;
      formData.value.semesters = [];
      return;
  }
  const currentSemsCount = formData.value.semesters.length;

  if (numSems > currentSemsCount) {
    for (let i = currentSemsCount; i < numSems; i++) {
      formData.value.semesters.push(createNewSemester(i));
    }
  } else if (numSems < currentSemsCount) {
    formData.value.semesters.splice(numSems);
  }
};

// Initialize semesters based on default numberOfSemesters when component is effectively ready
// and also watch numberOfSemesters for changes.
watch(() => formData.value.numberOfSemesters, updateSemesters, { immediate: true });


const addModule = (semIndex) => {
  if (formData.value.semesters[semIndex]) {
    formData.value.semesters[semIndex].modules.push(createNewModule());
  }
};

const removeModule = (semIndex, modIndex) => {
  if (formData.value.semesters[semIndex] && formData.value.semesters[semIndex].modules.length > 1) {
    formData.value.semesters[semIndex].modules.splice(modIndex, 1);
  } else {
    alert("Each semester must have at least one module.");
  }
};

const closeModal = () => {
  emit('close');
  // Consider resetting form on close if desired, or do it on open (as currently done in watch isOpen)
  // resetForm();
};

const handleSubmit = async () => {
  if (!props.currentUserInstituteId) {
    alert('Cannot submit: Institute information is missing.'); return;
  }
  if (!formData.value.programMasterId) {
    alert('Please select a Program.'); return;
  }
  if (formData.value.numberOfSemesters <= 0) {
     alert('Number of Semesters must be at least 1.'); return;
  }

  isSubmitting.value = true;
  let createdProgramOfferedId = null;

  try {
    const programOfferedPayload = {
      institute_id: props.currentUserInstituteId,
      program_master_id: formData.value.programMasterId,
      status: 'Pending', // Or your desired default status
      teaching_center: null, // Or provide if applicable
    };
    console.log("Program Offered Payload:", JSON.stringify(programOfferedPayload, null, 2));
    const programOfferedResponse = await apiServices.createMhpcProgramOffered(programOfferedPayload);

    if (!programOfferedResponse || !programOfferedResponse.data || programOfferedResponse.data.id === undefined) {
      throw new Error('Failed to create program offered or ID is missing in response.');
    }
    createdProgramOfferedId = programOfferedResponse.data.id;
    console.log(`Created Program Offered with ID: ${createdProgramOfferedId}`);

    for (let semIndex = 0; semIndex < formData.value.semesters.length; semIndex++) {
      const semesterData = formData.value.semesters[semIndex];
      if (!semesterData.name || !semesterData.name.trim()) {
        throw new Error(`Semester Name is required for Semester ${semIndex + 1}.`);
      }
      if (!semesterData.academicYear || semesterData.academicYear < 1900 || semesterData.academicYear > 2100) {
         throw new Error(`A valid Academic Year (e.g., 2024) is required for Semester ${semIndex + 1}.`);
      }

      const semesterPayload = {
        program_offered: createdProgramOfferedId,
        semester_number: semIndex + 1,
        name: semesterData.name,
        academic_year: semesterData.academicYear,
        // start_date and end_date could be added if your form collects them
      };
      console.log(`Semester ${semIndex + 1} Payload:`, JSON.stringify(semesterPayload, null, 2));
      const semesterResponse = await apiServices.createMhpcSemester(semesterPayload);

      if (!semesterResponse || !semesterResponse.data || semesterResponse.data.id === undefined) {
        throw new Error(`Failed to create semester ${semIndex + 1} or ID is missing in response.`);
      }
      const createdSemesterId = semesterResponse.data.id;
      console.log(`Created Semester ${semIndex + 1} with ID: ${createdSemesterId}`);

      for (const moduleItem of semesterData.modules) {
        if (!moduleItem.moduleMasterId) {
          throw new Error(`Module Definition is required for a module in Semester ${semIndex + 1}.`);
        }
        if (!moduleItem.facultyId) {
           throw new Error(`Faculty assignment is required for a module in Semester ${semIndex + 1}.`);
        }
        if (moduleItem.numberOfStudents === null || moduleItem.numberOfStudents === undefined || moduleItem.numberOfStudents <= 0) {
          throw new Error(`Number of Students must be greater than 0 for a module in Semester ${semIndex + 1}.`);
        }

        // --- CORRECTED PAYLOAD KEYS FOR MODULE ---
        const modulePayload = {
          module_master_direct_id: moduleItem.moduleMasterId,
          semester_id: createdSemesterId,
          student_count: moduleItem.numberOfStudents,
        };
        console.log(`Module Payload (for Sem ${semIndex + 1}):`, JSON.stringify(modulePayload, null, 2));
        const moduleResponse = await apiServices.createMhpcModule(modulePayload);

        if (!moduleResponse || !moduleResponse.data || moduleResponse.data.id === undefined) {
          throw new Error(`Failed to create module or ID is missing in response for Semester ${semIndex + 1}.`);
        }
        const createdModuleId = moduleResponse.data.id;
        console.log(`Created Module with ID: ${createdModuleId}`);

        const assignmentPayload = {
          module: createdModuleId, // Or module_id depending on your FacultyAssignment serializer
          faculty: moduleItem.facultyId, // Or faculty_id
          // is_primary_instructor and teaching_hours could be added if form collects them
        };
        console.log("Faculty Assignment Payload:", JSON.stringify(assignmentPayload, null, 2));
        await apiServices.createMhpcFacultyAssignment(assignmentPayload);
      }
    }

    alert('Program and all related details added successfully!');
    emit('program-added', programOfferedResponse.data); // Emit with the main program offered data
    // resetForm(); // Already called on modal open if that's the desired behavior
    closeModal();

  } catch (error) {
    console.error('Error adding program:', error.response?.data || error.message);
    let errorMessage = 'Failed to add program.';
    if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
            errorMessage += '\nDetails:\n';
            for (const key in errors) {
                // If the error for a field is an array, join it. Otherwise, use as is.
                const errorDetail = Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key];
                errorMessage += `${key}: ${errorDetail}\n`;
            }
        } else if (typeof errors === 'string') {
            errorMessage += ` Server: ${errors}`;
        }
    } else if (error.message) {
        errorMessage = error.message; // Use the direct error message if no response data
    }
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = initialFormData();
  // updateSemesters will be called automatically due to the watch on formData.value.numberOfSemesters
};

</script>

<style scoped>
/* Your existing styles */
.max-h-\[90vh\]::-webkit-scrollbar { width: 8px; }
.max-h-\[90vh\]::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.max-h-\[90vh\]::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover { background: #555; }
</style>