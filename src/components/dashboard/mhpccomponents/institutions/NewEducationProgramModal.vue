<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Configure Education Program Details</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isLoadingMasters" class="text-center py-4">Loading master data...</div>
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="currentInstituteName" class="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
            <p class="text-sm font-medium text-gray-700">Configuring Program for Institute:</p>
            <p class="text-lg font-semibold text-indigo-700">{{ currentInstituteName }}</p>
        </div>

        <div>
          <label for="approvedProgramOffered" class="block text-sm font-medium text-gray-700 mb-1">Select Approved Program to Configure</label>
          <select
            id="approvedProgramOffered"
            v-model="formData.selectedProgramOfferedId"
            required
            @change="handleProgramSelectionChange"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :disabled="isLoadingMasters || !props.currentUserInstituteId || approvedProgramsOffered.length === 0"
          >
            <option disabled value="">Select an Approved Program</option>
            <option v-for="program in approvedProgramsOffered" :key="program.id" :value="program.id">
              {{ program.program_master?.program_name || 'Unnamed Program Master' }}
              {{ program.specific_program_title ? `(${program.specific_program_title})` : '' }}
              {{ program.program_master?.code ? `[Code: ${program.program_master.code}]` : '' }}
              (Teaching Center: {{ program.teaching_center_details?.name_of_teaching_center || program.teaching_center || 'N/A' }})
            </option>
          </select>
           <p v-if="!isLoadingMasters && props.currentUserInstituteId && approvedProgramsOffered.length === 0" class="text-xs text-red-500 mt-1">
            No 'Approved' programs found for this institute to configure.
          </p>
        </div>

        <div v-if="selectedProgramDetails" class="mt-2 mb-4 p-2 bg-gray-100 border border-gray-200 rounded-md text-xs">
            <p><strong>Selected Program Master:</strong> {{ selectedProgramDetails.program_master?.program_name || 'N/A' }}</p>
            <p><strong>Specific Title:</strong> {{ selectedProgramDetails.specific_program_title || 'N/A' }}</p>
            <p><strong>Teaching Center:</strong> {{ selectedProgramDetails.teaching_center_details?.name_of_teaching_center || selectedProgramDetails.teaching_center || 'N/A' }}</p>
        </div>


        <div>
          <label for="numberOfSemesters" class="block text-sm font-medium text-gray-700 mb-1">Number of Semesters to Add</label>
          <input
            type="number"
            id="numberOfSemesters"
            v-model.number="formData.numberOfSemesters"
            min="1"
            max="12"
            required
            @input="updateSemesters"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :disabled="!formData.selectedProgramOfferedId"
          />
        </div>

        <div v-if="formData.numberOfSemesters > 0 && formData.selectedProgramOfferedId" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700 mt-4 border-b pb-2">Semester Details</h3>
          <div v-for="(semester, semIndex) in formData.semesters" :key="semIndex" class="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3">
            <h4 class="text-md font-semibold text-gray-700">Semester {{ semIndex + 1 }} (New)</h4>

            <div>
              <label :for="`semester-name-${semIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Semester Name (e.g., Fall 2024, Year 1 Term 1)</label>
              <input type="text" :id="`semester-name-${semIndex}`" v-model="semester.name" placeholder="Unique Semester Name" required
                     class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"/>
            </div>
             <div>
              <label :for="`semester-acad-year-${semIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Academic Year (e.g., 2024)</label>
              <input type="number" :id="`semester-acad-year-${semIndex}`" v-model.number="semester.academicYear" placeholder="Academic Year" required min="1900" max="2100"
                     class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"/>
            </div>

            <div v-for="(moduleItem, modIndex) in semester.modules" :key="modIndex" class="p-3 border border-dashed border-gray-300 rounded bg-white space-y-2">
              <div class="flex justify-between items-center">
                <h5 class="text-sm font-medium text-gray-600">Module {{ modIndex + 1 }}</h5>
                <button type="button" @click="removeModule(semIndex, modIndex)" v-if="semester.modules.length > 1"
                        class="text-red-500 hover:text-red-700 text-xs">Remove Module</button>
              </div>

              <div>
                <label :for="`module-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Module Definition (Select Existing Module Master)</label>
                <select :id="`module-${semIndex}-${modIndex}`" v-model="moduleItem.moduleMasterId" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs">
                  <option disabled value="">Select Module Definition</option>
                  <option v-for="modMaster in moduleMastersForDropdown" :key="modMaster.id" :value="modMaster.id">
                    {{ modMaster.module_name }} {{ modMaster.module_code ? `(${modMaster.module_code})` : '' }}
                  </option>
                </select>
              </div>

              <div>
                <label :for="`faculty-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Assign Faculty (Select Existing Faculty)</label>
                <select :id="`faculty-${semIndex}-${modIndex}`" v-model="moduleItem.facultyId" required
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                        :disabled="allFacultiesMaster.length === 0">
                  <option disabled value="">Select Faculty</option>
                  <option v-for="faculty in allFacultiesMaster" :key="faculty.id" :value="faculty.id">
                    {{ faculty.faculty_name }} {{ faculty.faculty_id ? `(${faculty.faculty_id})` : ''}}
                  </option>
                </select>
                <p v-if="!isLoadingMasters && allFacultiesMaster.length === 0" class="text-xs text-red-500 mt-1">
                    No faculties found in the system. Please add faculties first.
                </p>
              </div>

              <div>
                <label :for="`students-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Number of Students for this Module Instance</label>
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
          <button type="submit" :disabled="isSubmitting || !props.currentUserInstituteId || !formData.selectedProgramOfferedId || approvedProgramsOffered.length === 0"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ isSubmitting ? 'Saving Details...' : 'Save Program Configuration' }}
          </button>
        </div>
        <p v-if="!props.currentUserInstituteId && isOpen" class="text-xs text-red-500 text-center mt-2">
            Cannot configure program: Institute information is missing.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import apiServices from '@/services/services';

const props = defineProps({
  isOpen: Boolean,
  currentUserInstituteId: [String, Number, null],
  currentInstituteName: [String, null],
});

const emit = defineEmits(['close', 'program-configured']);

const isLoadingMasters = ref(false);
const isSubmitting = ref(false);

const approvedProgramsOffered = ref([]);
const moduleMastersForDropdown = ref([]); // These are ModuleMaster (blueprints)
const allFacultiesMaster = ref([]); // These are TeachingFacultyDetails
const allTeachingCentersMaster = ref([]);

const selectedProgramDetails = computed(() => {
    if (!formData.value.selectedProgramOfferedId) return null;
    return approvedProgramsOffered.value.find(p => p.id === formData.value.selectedProgramOfferedId);
});

const fetchMasterData = async () => {
  if (!props.currentUserInstituteId && props.isOpen) {
    console.warn("Cannot fetch approved programs: currentUserInstituteId is missing.");
    approvedProgramsOffered.value = [];
  }
  isLoadingMasters.value = true;
  try {
    const fetchPromises = [];

    if (props.currentUserInstituteId) {
      fetchPromises.push(
        apiServices.getMhpcProgramsOffered({ institute: props.currentUserInstituteId, status: 'Approved' })
          .then(res => {
            const programs = res.data.results || res.data || [];
            approvedProgramsOffered.value = programs.sort((a, b) => {
                const nameA = a.program_master?.program_name || a.specific_program_title || '';
                const nameB = b.program_master?.program_name || b.specific_program_title || '';
                return nameA.localeCompare(nameB);
              });
          })
          .catch(err => {
            console.error('Error fetching approved programs offered:', err);
            approvedProgramsOffered.value = [];
          })
      );
    } else {
      approvedProgramsOffered.value = [];
    }

    fetchPromises.push(
        apiServices.getMhpcTeachingCenters()
        .then(res => {
            allTeachingCentersMaster.value = res.data.results || res.data || [];
        })
        .catch(err => {
            console.error('Error fetching teaching centers:', err);
            allTeachingCentersMaster.value = [];
        })
    );

    // Fetch ModuleMaster records (blueprints)
    fetchPromises.push(
      (apiServices.getMhpcModuleMasters ? apiServices.getMhpcModuleMasters() : apiServices.getMhpcModules()) // Assuming this gets ModuleMaster definitions
        .then(moduleMastersRes => {
          const rawMasters = moduleMastersRes.data.results || moduleMastersRes.data;
            // This logic tries to get unique ModuleMaster from a list that might contain Module instances
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
            } else if (Array.isArray(rawMasters)) { // If the endpoint directly returns ModuleMaster list
                moduleMastersForDropdown.value = rawMasters;
            } else {
                moduleMastersForDropdown.value = [];
            }
            if (moduleMastersForDropdown.value.length > 0) {
                moduleMastersForDropdown.value.sort((a, b) => (a.module_name || '').localeCompare(b.module_name || ''));
            }
        })
        .catch(err => {
          console.error('Error fetching module master definitions:', err);
          moduleMastersForDropdown.value = [];
        })
    );

    // Fetch TeachingFacultyDetails records
    fetchPromises.push(
      apiServices.getMhpcTeachingFaculties()
        .then(facultiesRes => {
          allFacultiesMaster.value = (facultiesRes.data.results || facultiesRes.data || [])
            .sort((a,b) => (a.faculty_name || '').localeCompare(b.faculty_name || ''));
        })
        .catch(err => {
          console.error('Error fetching teaching faculties:', err);
          allFacultiesMaster.value = [];
        })
    );

    await Promise.allSettled(fetchPromises);

    // After all data is fetched, especially allTeachingCentersMaster, re-map approvedProgramsOffered for display
    if (approvedProgramsOffered.value.length > 0 && allTeachingCentersMaster.value.length > 0) {
        approvedProgramsOffered.value = approvedProgramsOffered.value.map(p => ({
            ...p,
            teaching_center_details: p.teaching_center && typeof p.teaching_center === 'number'
                ? allTeachingCentersMaster.value.find(tc => tc.id === p.teaching_center)
                : (p.teaching_center && typeof p.teaching_center === 'object' ? p.teaching_center : { id: p.teaching_center, name_of_teaching_center: `ID: ${p.teaching_center}`})
        }));
    }

  } catch (error) {
    console.error('General error in fetchMasterData setup:', error);
    alert('Failed to load some essential configuration data. Please try again.');
  } finally {
    isLoadingMasters.value = false;
  }
};

onMounted(() => {
  if (props.isOpen) {
    fetchMasterData();
  }
});

watch(() => props.isOpen, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    if (props.currentUserInstituteId) {
        fetchMasterData();
    } else {
        approvedProgramsOffered.value = [];
        moduleMastersForDropdown.value = [];
        allFacultiesMaster.value = [];
        allTeachingCentersMaster.value = [];
    }
    resetForm();
  }
});

watch(() => props.currentUserInstituteId, (newInstituteId, oldInstituteId) => {
  if (props.isOpen && newInstituteId && newInstituteId !== oldInstituteId) {
    fetchMasterData();
    resetForm();
  } else if (props.isOpen && !newInstituteId) {
    approvedProgramsOffered.value = [];
    resetForm();
  }
});

const initialFormData = () => ({
  selectedProgramOfferedId: '',
  numberOfSemesters: 1, // Default to adding at least one semester
  semesters: [],
});
const formData = ref(initialFormData());

const handleProgramSelectionChange = () => {
    // Reset semester configuration when a new program is selected
    formData.value.numberOfSemesters = 1; // Or 0 if you want them to explicitly set it
    updateSemesters(); // This will initialize/clear semesters array
};

const createNewModule = () => ({
  moduleMasterId: '', // Will hold ID of selected ModuleMaster
  facultyId: '',      // Will hold ID of selected TeachingFacultyDetails
  numberOfStudents: 10, // Default
});

const createNewSemester = (index) => ({
  name: `Semester ${index + 1}`, // Default name, user should ideally make this unique per program-year
  academicYear: new Date().getFullYear(),
  modules: [createNewModule()],
});

const updateSemesters = () => {
  const numSems = Number(formData.value.numberOfSemesters) || 0;
  if (numSems < 0) { // Should be prevented by min="1" on input
      formData.value.numberOfSemesters = 1;
      // Fallthrough to ensure at least one semester if input was invalid negative
  }
  // Ensure a positive number, defaulting to 1 if needed and was 0 or less
  const targetSems = Math.max(1, numSems);
  if (formData.value.numberOfSemesters !== targetSems && numSems > 0) { // numSems > 0 check for initial call
      formData.value.numberOfSemesters = targetSems; // Correct the model if input was invalid (e.g. 0)
  }


  const currentSemsCount = formData.value.semesters.length;

  if (targetSems > currentSemsCount) {
    for (let i = currentSemsCount; i < targetSems; i++) {
      formData.value.semesters.push(createNewSemester(i));
    }
  } else if (targetSems < currentSemsCount) {
    formData.value.semesters.splice(targetSems);
  }
   // If targetSems is 0 and currentSemsCount > 0, splice will empty it.
   // If targetSems is 1 and currentSemsCount is 0, it will add one.
};

// Initialize semesters based on default numberOfSemesters when component is effectively ready
// and also watch numberOfSemesters for changes.
watch(() => formData.value.numberOfSemesters, updateSemesters, { immediate: false });
// Call it once when form is reset or program changes
// updateSemesters is called by handleProgramSelectionChange and resetForm

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
};

const handleSubmit = async () => {
  if (!props.currentUserInstituteId) {
    alert('Cannot submit: Institute information is missing.'); return;
  }
  if (!formData.value.selectedProgramOfferedId) {
    alert('Please select an Approved Program Offering to configure.'); return;
  }
  if (formData.value.numberOfSemesters <= 0) {
     alert('Number of Semesters must be at least 1.'); return;
  }

  isSubmitting.value = true;
  const programOfferedToConfigureId = formData.value.selectedProgramOfferedId;

  try {
    for (let semIndex = 0; semIndex < formData.value.semesters.length; semIndex++) {
      const semesterData = formData.value.semesters[semIndex];
      if (!semesterData.name || !semesterData.name.trim()) {
        throw new Error(`Semester Name is required for Semester ${semIndex + 1}. Please provide a unique name for this program and academic year.`);
      }
      if (!semesterData.academicYear || semesterData.academicYear < 1900 || semesterData.academicYear > 2100) {
         throw new Error(`A valid Academic Year (e.g., 2024) is required for Semester ${semIndex + 1}.`);
      }

      // Payload for creating a Semester record
      const semesterPayload = {
        program_offered: programOfferedToConfigureId,
        semester_number: semIndex + 1, // Or manage this based on existing semesters if appending
        name: semesterData.name,
        academic_year: semesterData.academicYear,
      };
      console.log(`Semester ${semIndex + 1} Payload:`, JSON.stringify(semesterPayload, null, 2));
      const semesterResponse = await apiServices.createMhpcSemester(semesterPayload);

      if (!semesterResponse || !semesterResponse.data || semesterResponse.data.id === undefined) {
        throw new Error(`Failed to create semester ${semIndex + 1} or ID is missing in response.`);
      }
      const createdSemesterId = semesterResponse.data.id; // ID of the NEWLY CREATED Semester record
      console.log(`Created Semester ${semIndex + 1} with ID: ${createdSemesterId}`);

      for (const moduleItem of semesterData.modules) {
        if (!moduleItem.moduleMasterId) throw new Error(`Module Definition (ModuleMaster) required for Semester ${semIndex + 1}.`);
        if (!moduleItem.facultyId) throw new Error(`Faculty assignment required for Semester ${semIndex + 1}.`);
        if (moduleItem.numberOfStudents <= 0) throw new Error(`Number of Students > 0 required for Semester ${semIndex + 1}.`);

        // Payload for creating a Module instance, linking to an EXISTING ModuleMaster
        const modulePayload = {
          module_master_direct_id: moduleItem.moduleMasterId, // ID of the selected ModuleMaster
          semester_id: createdSemesterId,                     // ID of the newly created Semester
          student_count: moduleItem.numberOfStudents
          // CRITICAL: DO NOT SEND module_name, module_code, etc. here,
          // as we are linking to an existing ModuleMaster via module_master_direct_id.
          // Your backend ModuleSerializer should handle this distinction.
        };
        console.log(`Module Payload (for Sem ${semIndex + 1}):`, JSON.stringify(modulePayload, null, 2));
        const moduleResponse = await apiServices.createMhpcModule(modulePayload);

        if (!moduleResponse || !moduleResponse.data || moduleResponse.data.id === undefined) {
          throw new Error(`Failed to create module instance or ID is missing for Semester ${semIndex + 1}.`);
        }
        const createdModuleInstanceId = moduleResponse.data.id; // ID of the NEWLY CREATED Module record
        console.log(`Created Module instance with ID: ${createdModuleInstanceId}`);

        // Payload for creating the ModuleFacultyAssignment junction record
        const assignmentPayload = {
          module_id: createdModuleInstanceId,
          faculty_id: moduleItem.facultyId,       
        };
        console.log("Faculty Assignment Payload:", JSON.stringify(assignmentPayload, null, 2));
        await apiServices.createMhpcFacultyAssignment(assignmentPayload);
      }
    }

    alert('Program configuration (semesters and modules) saved successfully!');
    emit('program-configured', { id: programOfferedToConfigureId });
    closeModal();

  } catch (error) {
    console.error('Error saving program configuration:', error.response?.data || error.message);
    let errorMessage = 'Failed to save program configuration.';

    if (error.response?.data?.non_field_errors) {
        const nfe = error.response.data.non_field_errors;
        if (Array.isArray(nfe) && nfe.some(e => e.includes("must make a unique set") && e.includes("program_offered, name, academic_year"))) {
            errorMessage = "Error: A semester with the same name and academic year already exists for this program offering. Please use a unique semester name or adjust the academic year for the conflicting semester(s).";
        }
    } else if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
            errorMessage += '\nDetails:\n';
            for (const key in errors) {
                const errorDetail = Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key];
                errorMessage += `${key}: ${errorDetail}\n`;
            }
        } else if (typeof errors === 'string') {
            errorMessage += ` Server: ${errors}`;
        }
    } else if (error.message) {
        errorMessage = error.message;
    }
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = initialFormData();
  // When form resets, initialize semesters based on default numberOfSemesters
  if (formData.value.numberOfSemesters > 0) {
      updateSemesters();
  }
};

</script>

<style scoped>
/* Your existing styles */
.max-h-\[90vh\]::-webkit-scrollbar { width: 8px; }
.max-h-\[90vh\]::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.max-h-\[90vh\]::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover { background: #555; }
</style>