<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" @click.stop>
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Configure Education Program Details</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingMasters" class="text-center py-10">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mb-4"></div>
        <p class="text-gray-600">Loading configuration data...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Institute Banner -->
        <div v-if="currentInstituteName" class="p-3 bg-indigo-50 border border-indigo-200 rounded-md">
            <p class="text-sm font-medium text-gray-700">Configuring Program for Institute:</p>
            <p class="text-lg font-semibold text-indigo-700">{{ currentInstituteName }}</p>
        </div>

        <!-- Program Selection Dropdown -->
        <div>
          <label for="approvedProgramOffered" class="block text-sm font-medium text-gray-700 mb-1">Select Approved Program to Configure</label>
          <select
            id="approvedProgramOffered"
            v-model="formData.selectedProgramOfferedId"
            required
            @change="handleProgramSelectionChange"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
            :disabled="!props.currentUserInstituteId || approvedProgramsOffered.length === 0"
          >
            <option disabled value="">
                {{ approvedProgramsOffered.length === 0 ? 'No approved programs found' : 'Select an Approved Program' }}
            </option>
            <option v-for="program in approvedProgramsOffered" :key="program.id" :value="program.id">
              {{ program.program_master?.program_name || 'Unnamed Program' }}
              <span v-if="program.specific_program_title"> ({{ program.specific_program_title }})</span>
              <span v-if="program.teaching_center_details?.name_of_teaching_center"> - [{{ program.teaching_center_details.name_of_teaching_center }}]</span>
            </option>
          </select>
           <p v-if="!isLoadingMasters && props.currentUserInstituteId && approvedProgramsOffered.length === 0" class="text-xs text-red-500 mt-1">
            No 'Approved' programs found for this institute. New configurations cannot be added.
          </p>
        </div>

        <!-- Number of Semesters Input -->
        <div>
          <label for="numberOfSemesters" class="block text-sm font-medium text-gray-700 mb-1">Number of Semesters to Add</label>
          <input
            type="number"
            id="numberOfSemesters"
            v-model.number="formData.numberOfSemesters"
            min="0"
            max="12"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
            :disabled="!formData.selectedProgramOfferedId"
          />
        </div>

        <!-- Dynamically Generated Semester Forms -->
        <div v-if="formData.semesters.length > 0" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700 mt-4 border-b pb-2">Semester Details</h3>
          <div v-for="(semester, semIndex) in formData.semesters" :key="semIndex" class="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3">
            <h4 class="text-md font-semibold text-gray-700">Semester {{ semIndex + 1 }}</h4>

            <!-- Semester Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label :for="`semester-name-${semIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Semester Name <span class="text-red-500">*</span></label>
                <input type="text" :id="`semester-name-${semIndex}`" v-model="semester.name" placeholder="e.g., Fall 2024, Year 1 Term 1" required
                       class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs"/>
              </div>
               <div>
                <label :for="`semester-acad-year-${semIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Academic Year <span class="text-red-500">*</span></label>
                <input type="number" :id="`semester-acad-year-${semIndex}`" v-model.number="semester.academicYear" placeholder="e.g., 2024" required min="2000" max="2100"
                       class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs"/>
              </div>
            </div>

            <!-- Dynamically Generated Module Forms -->
            <div v-for="(moduleItem, modIndex) in semester.modules" :key="modIndex" class="p-3 border border-dashed border-gray-300 rounded bg-white space-y-2">
              <div class="flex justify-between items-center">
                <h5 class="text-sm font-medium text-gray-600">Module {{ modIndex + 1 }}</h5>
                <button type="button" @click="removeModule(semIndex, modIndex)" v-if="semester.modules.length > 1"
                        class="text-red-500 hover:text-red-700 text-xs font-semibold">Remove Module</button>
              </div>

              <!-- Module Fields -->
              <div>
                <label :for="`module-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Module Definition <span class="text-red-500">*</span></label>
                <select :id="`module-${semIndex}-${modIndex}`" v-model="moduleItem.moduleMasterId" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs">
                  <option disabled value="">Select Module</option>
                  <option v-for="modMaster in moduleMastersForDropdown" :key="modMaster.id" :value="modMaster.id">
                    {{ modMaster.module_name }} {{ modMaster.module_code ? `(${modMaster.module_code})` : '' }}
                  </option>
                </select>
              </div>

              <div>
                <label :for="`faculty-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Assign Faculty <span class="text-red-500">*</span></label>
                <select :id="`faculty-${semIndex}-${modIndex}`" v-model="moduleItem.facultyId" required class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs" :disabled="allFacultiesMaster.length === 0">
                  <option disabled value="">{{ allFacultiesMaster.length === 0 ? 'No faculty available' : 'Select Faculty' }}</option>
                  <option v-for="faculty in allFacultiesMaster" :key="faculty.id" :value="faculty.id">
                    {{ faculty.faculty_name }} {{ faculty.faculty_id ? `(${faculty.faculty_id})` : ''}}
                  </option>
                </select>
              </div>

              <div>
                <label :for="`students-${semIndex}-${modIndex}`" class="block text-xs font-medium text-gray-600 mb-1">Number of Students <span class="text-red-500">*</span></label>
                <input type="number" :id="`students-${semIndex}-${modIndex}`" v-model.number="moduleItem.numberOfStudents" min="1" required
                       class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs"/>
              </div>
            </div>
            <button type="button" @click="addModule(semIndex)"
                    class="mt-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              Add Another Module
            </button>
          </div>
        </div>

        <!-- Form Actions/Footer -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button type="button" @click="closeModal" :disabled="isSubmitting"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
          <button type="submit" :disabled="isSubmitting || !formData.selectedProgramOfferedId || formData.semesters.length === 0"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Saving...' : 'Save Configuration' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
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
const moduleMastersForDropdown = ref([]);
const allFacultiesMaster = ref([]);
const allTeachingCentersMaster = ref([]);

const fetchMasterData = async () => {
  if (!props.currentUserInstituteId) return;
  isLoadingMasters.value = true;
  try {
    const [programsRes, centersRes, modulesRes, facultiesRes] = await Promise.allSettled([
      apiServices.getMhpcProgramsOffered({ institute: props.currentUserInstituteId, status: 'Approved' }),
      apiServices.getMhpcTeachingCenters(),
      apiServices.getMhpcModuleMasters ? apiServices.getMhpcModuleMasters() : apiServices.getMhpcModules(),
      apiServices.getMhpcTeachingFaculties()
    ]);

    allTeachingCentersMaster.value = centersRes.status === 'fulfilled' ? (centersRes.value.data.results || centersRes.value.data || []) : [];

    if (programsRes.status === 'fulfilled') {
        const programs = programsRes.value.data.results || programsRes.value.data || [];
        approvedProgramsOffered.value = programs.map(p => ({
            ...p,
            teaching_center_details: allTeachingCentersMaster.value.find(tc => tc.id === p.teaching_center)
        })).sort((a,b) => (a.program_master?.program_name || '').localeCompare(b.program_master?.program_name || ''));
    }

    if (modulesRes.status === 'fulfilled') {
        const rawMasters = modulesRes.value.data.results || modulesRes.value.data || [];
        const uniqueMasters = new Map();
        rawMasters.forEach(item => {
            const master = item.module_master || item;
            if (master?.id && !uniqueMasters.has(master.id)) {
                uniqueMasters.set(master.id, master);
            }
        });
        moduleMastersForDropdown.value = Array.from(uniqueMasters.values()).sort((a, b) => (a.module_name || '').localeCompare(b.module_name || ''));
    }

    allFacultiesMaster.value = facultiesRes.status === 'fulfilled' ? (facultiesRes.value.data.results || facultiesRes.value.data || []).sort((a, b) => (a.faculty_name || '').localeCompare(b.faculty_name || '')) : [];

  } catch (error) {
    console.error('Failed to load master data:', error);
    alert('An error occurred while loading essential data. Please try again.');
  } finally {
    isLoadingMasters.value = false;
  }
};

onMounted(() => { if (props.isOpen) fetchMasterData(); });
watch(() => props.isOpen, (newVal) => { if (newVal) { resetForm(); fetchMasterData(); } });

const initialFormData = () => ({ selectedProgramOfferedId: '', numberOfSemesters: 0, semesters: [] });
const formData = ref(initialFormData());

const createNewModule = () => ({ moduleMasterId: '', facultyId: '', numberOfStudents: 10 });
const createNewSemester = (index) => ({ name: `Semester ${index + 1}`, academicYear: new Date().getFullYear(), modules: [createNewModule()] });

const updateSemesters = () => {
  const targetSems = Math.max(0, Number(formData.value.numberOfSemesters) || 0);
  const currentSemsCount = formData.value.semesters.length;
  if (targetSems > currentSemsCount) {
    for (let i = currentSemsCount; i < targetSems; i++) formData.value.semesters.push(createNewSemester(i));
  } else if (targetSems < currentSemsCount) {
    formData.value.semesters.splice(targetSems);
  }
};
watch(() => formData.value.numberOfSemesters, updateSemesters);

const handleProgramSelectionChange = () => { formData.value.numberOfSemesters = 1; updateSemesters(); };
const addModule = (semIndex) => formData.value.semesters[semIndex]?.modules.push(createNewModule());
const removeModule = (semIndex, modIndex) => {
  if (formData.value.semesters[semIndex]?.modules.length > 1) {
    formData.value.semesters[semIndex].modules.splice(modIndex, 1);
  } else {
    alert("Each semester must have at least one module.");
  }
};
const closeModal = () => emit('close');
const resetForm = () => { formData.value = initialFormData(); };

const handleSubmit = async () => {
  if (!formData.value.selectedProgramOfferedId || formData.value.semesters.length === 0) {
    alert('Please select a program and add at least one semester.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      program_offered_id: formData.value.selectedProgramOfferedId,
      semesters: formData.value.semesters.map((semester, semIndex) => {
        if (!semester.name?.trim() || !semester.academicYear) {
          throw new Error(`Semester ${semIndex + 1} is missing a name or academic year.`);
        }
        return {
          name: semester.name,
          academic_year: semester.academicYear,
          modules: semester.modules.map((moduleItem) => {
            if (!moduleItem.moduleMasterId || !moduleItem.facultyId || !moduleItem.numberOfStudents) {
              throw new Error(`A module in Semester ${semIndex + 1} is missing a required field.`);
            }
            return {
              module_master_id: moduleItem.moduleMasterId,
              faculty_id: moduleItem.facultyId,
              student_count: moduleItem.numberOfStudents,
            };
          }),
        };
      }),
    };

    // This assumes you have a new endpoint for this bulk operation
    await apiServices.createFullProgramConfiguration(payload);

    alert('Program configuration saved successfully!');
    emit('program-configured', { id: formData.value.selectedProgramOfferedId });
    closeModal();
  } catch (error) {
    console.error('Error saving program configuration:', error.response?.data || error.message);
    let errorMessage = 'Failed to save program configuration.';
    if (error.response?.data) {
        const errors = error.response.data;
        errorMessage += '\n' + (typeof errors === 'object' ? JSON.stringify(errors, null, 2) : String(errors));
    } else if (error.message) {
        errorMessage = error.message;
    }
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom scrollbar for better aesthetics */
.max-h-\[90vh\]::-webkit-scrollbar { width: 8px; }
.max-h-\[90vh\]::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.max-h-\[90vh\]::-webkit-scrollbar-thumb { background: #a8a8a8; border-radius: 10px; }
.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover { background: #555; }
</style>