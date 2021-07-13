<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="closeModal"
  >
    <div
      class="bg-gray-50 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      @click.stop
    >
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Configure Education Program</h2>
          <p v-if="currentInstituteName" class="text-sm text-gray-500">
            For institute:
            <span class="font-semibold text-indigo-600">{{ currentInstituteName }}</span>
          </p>
        </div>
        <button
          @click="closeModal"
          class="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="w-full mb-6">
        <div class="flex items-center">
          <template >
            <div v-for="(step, index) in steps" :key="step.id">
              <div
              class="flex items-center"
              :class="{ 'cursor-pointer': index < currentStep }"
              @click="setStep(index)"
            >
              <div
                class="flex items-center justify-center rounded-full h-8 w-8"
                :class="getStepClass(index)"
              >
                <Check v-if="index < currentStep" class="w-5 h-5 text-white" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div
                class="ml-3 text-sm font-medium"
                :class="currentStep >= index ? 'text-gray-700' : 'text-gray-400'"
              >
                {{ step.name }}
              </div>
            </div>
            <div
              v-if="index < steps.length - 1"
              class="flex-auto border-t-2 transition-all duration-500 mx-4"
              :class="currentStep > index ? 'border-indigo-600' : 'border-gray-300'"
            ></div>
            </div>
          </template>
        </div>
      </div>

      <div class="flex-grow overflow-y-auto -mr-4 pr-4 space-y-6">
        <div v-if="isLoadingMasters" class="flex flex-col items-center justify-center h-64">
          <LoaderCircle class="animate-spin w-12 h-12 text-indigo-600 mb-4" />
          <p class="text-gray-600">Loading configuration data...</p>
        </div>

        <div v-show="!isLoadingMasters && currentStep === 0">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Step 1: Select Program</h3>
          <p class="text-sm text-gray-500 mb-4">
            Choose an approved program offering to configure. This will be the foundation for the
            semesters and modules you add.
          </p>
          <div class="p-4 bg-white border rounded-lg">
            <label for="approvedProgramOffered" class="block text-sm font-medium text-gray-700 mb-1"
              >Approved Program Offering</label
            >
            <select
              id="approvedProgramOffered"
              v-model="formData.selectedProgramOfferedId"
              required
              class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
              :disabled="!props.currentUserInstituteId || approvedProgramsOffered.length === 0"
            >
              <option disabled value="">
                {{
                  approvedProgramsOffered.length === 0
                    ? 'No approved programs found'
                    : 'Select an Approved Program'
                }}
              </option>
              <option
                v-for="program in approvedProgramsOffered"
                :key="program.id"
                :value="program.id"
              >
                {{ program.program_master?.program_name || 'Unnamed Program' }}
                <span v-if="program.specific_program_title">
                  ({{ program.specific_program_title }})</span
                >
              </option>
            </select>
            <p
              v-if="!isLoadingMasters && approvedProgramsOffered.length === 0"
              class="text-xs text-red-500 mt-2"
            >
              No 'Approved' programs found for this institute. New configurations cannot be added.
            </p>
          </div>
        </div>

        <div v-show="!isLoadingMasters && currentStep === 1">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Step 2: Define Semesters</h3>
          <p class="text-sm text-gray-500 mb-4">
            Add the semesters or terms for this program configuration. You'll assign modules to
            these semesters in the next step.
          </p>
          <div class="p-4 bg-white border rounded-lg space-y-4">
            <div
              v-for="(semester, semIndex) in formData.semesters"
              :key="semIndex"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border"
            >
              <span class="text-gray-500 font-semibold">{{ semIndex + 1 }}</span>
              <input
                type="text"
                v-model="semester.name"
                placeholder="e.g., Year 1, Term 1"
                required
                class="flex-grow p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              <input
                type="number"
                v-model.number="semester.academicYear"
                placeholder="e.g., 2025"
                required
                min="2000"
                max="2100"
                class="w-32 p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              <button
                type="button"
                @click="removeSemester(semIndex)"
                class="p-2 text-red-500 hover:bg-red-100 rounded-full"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              @click="addSemester"
              class="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Plus class="w-4 h-4 mr-2" /> Add Semester
            </button>
          </div>
        </div>

        <div v-show="!isLoadingMasters && currentStep === 2">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Step 3: Assign Modules & Faculty</h3>
          <p class="text-sm text-gray-500 mb-4">
            For each semester, add the required modules, assign a faculty member, and specify the
            number of students.
          </p>
          <div class="space-y-3">
            <div
              v-for="(semester, semIndex) in formData.semesters"
              :key="semIndex"
              class="bg-white border rounded-lg overflow-hidden"
            >
              <div class="p-4 bg-gray-50 border-b">
                <h4 class="font-semibold text-gray-800">
                  Semester: {{ semester.name || `Semester ${semIndex + 1}` }} ({{
                    semester.academicYear
                  }})
                </h4>
              </div>
              <div class="p-4 space-y-4">
                <div
                  v-for="(moduleItem, modIndex) in semester.modules"
                  :key="modIndex"
                  class="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-dashed rounded-md relative"
                >
                  <button
                    type="button"
                    @click="removeModule(semIndex, modIndex)"
                    v-if="semester.modules.length > 1"
                    class="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  >
                    <X class="h-4 w-4" />
                  </button>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Module <span class="text-red-500">*</span></label
                    >
                    <select
                      v-model="moduleItem.moduleMasterId"
                      required
                      class="w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                    >
                      <option disabled value="">Select Module</option>
                      <option
                        v-for="modMaster in moduleMastersForDropdown"
                        :key="modMaster.id"
                        :value="modMaster.id"
                      >
                        {{ modMaster.module_name }}
                        {{ modMaster.module_code ? `(${modMaster.module_code})` : '' }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Faculty <span class="text-red-500">*</span></label
                    >
                    <select
                      v-model="moduleItem.facultyId"
                      required
                      class="w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                      :disabled="allFacultiesMaster.length === 0"
                    >
                      <option disabled value="">
                        {{ allFacultiesMaster.length === 0 ? 'No faculty' : 'Select Faculty' }}
                      </option>
                      <option
                        v-for="faculty in allFacultiesMaster"
                        :key="faculty.id"
                        :value="faculty.id"
                      >
                        {{ faculty.faculty_name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Students <span class="text-red-500">*</span></label
                    >
                    <input
                      type="number"
                      v-model.number="moduleItem.numberOfStudents"
                      min="1"
                      required
                      class="w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  @click="addModule(semIndex)"
                  class="flex items-center mt-2 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <Plus class="w-4 h-4 mr-1" /> Add Module to Semester
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center pt-6 mt-4 border-t border-gray-200">
        <button
          type="button"
          @click="prevStep"
          :disabled="currentStep === 0"
          class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          Back
        </button>
        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          @click="nextStep"
          :disabled="!isStepValid(currentStep)"
          class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
        <button
          v-else
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting || !isStepValid(currentStep)"
          class="flex items-center justify-center w-40 px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          <LoaderCircle v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2" />
          {{ isSubmitting ? 'Saving...' : 'Save Configuration' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import apiServices from '@/services/services';
import { useAuthStore } from '@/stores/authStore';
import { Check, X, Plus, Trash2, LoaderCircle } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';

const props = defineProps({
  isOpen: Boolean,
  currentUserInstituteId: [String, Number, null],
  currentInstituteName: [String, null],
});
const emit = defineEmits(['close', 'program-configured']);
const toast = useToast();

const isLoadingMasters = ref(false);
const isSubmitting = ref(false);
const approvedProgramsOffered = ref([]);
const moduleMastersForDropdown = ref([]);
const allFacultiesMaster = ref([]);

const authStore = useAuthStore();
const currentStep = ref(0);
const steps = [
  { id: 1, name: 'Program' },
  { id: 2, name: 'Semesters' },
  { id: 3, name: 'Modules' },
];

const getStepClass = index => {
  if (currentStep.value > index) return 'bg-green-600 text-white';
  if (currentStep.value === index) return 'bg-indigo-600 text-white scale-110';
  return 'bg-gray-200 text-gray-500';
};

const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++;
};
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};
const setStep = index => {
  if (isStepValid(index - 1)) currentStep.value = index;
};

const isStepValid = stepIndex => {
  switch (stepIndex) {
    case 0:
      return !!formData.value.selectedProgramOfferedId;
    case 1:
      return (
        formData.value.semesters.length > 0 &&
        formData.value.semesters.every(s => s.name && s.academicYear)
      );
    case 2:
      return formData.value.semesters.every(
        s =>
          s.modules.length > 0 &&
          s.modules.every(m => m.moduleMasterId && m.facultyId && m.numberOfStudents > 0)
      );
    default:
      return true;
  }
};

const fetchMasterData = async () => {
  if (!props.currentUserInstituteId) return;
  isLoadingMasters.value = true;
  try {
    const [programsRes, modulesRes, facultiesRes] = await Promise.all([
      apiServices.getMhpcProgramsOffered({
        institute: props.currentUserInstituteId,
        status: 'Approved',
        expand: 'program_master',
      }),
      apiServices.getMhpcModules(),
      apiServices.getMhpcTeachingFaculties({ institute: props.currentUserInstituteId }),
    ]);

    approvedProgramsOffered.value = (programsRes.data.results || []).sort((a, b) =>
      (a.program_master?.program_name || '').localeCompare(b.program_master?.program_name || '')
    );

    const rawModules = modulesRes.data.results || [];
    const uniqueMasters = new Map();
    rawModules.forEach(moduleInstance => {
      const master = moduleInstance.module_master;
      if (master && !uniqueMasters.has(master.id)) {
        uniqueMasters.set(master.id, master);
      }
    });
    moduleMastersForDropdown.value = Array.from(uniqueMasters.values()).sort((a, b) =>
      (a.module_name || '').localeCompare(b.module_name || '')
    );

    allFacultiesMaster.value = (facultiesRes.data.results || []).sort((a, b) =>
      (a.faculty_name || '').localeCompare(b.faculty_name || '')
    );
  } catch (error) {
    console.error('Failed to load master data:', error);
    toast.error('An error occurred while loading essential data.');
  } finally {
    isLoadingMasters.value = false;
  }
};

onMounted(() => {
  if (props.isOpen) fetchMasterData();
});
watch(
  () => props.isOpen,
  newVal => {
    if (newVal) {
      resetForm();
      fetchMasterData();
    }
  }
);

const initialFormData = () => ({ selectedProgramOfferedId: '', semesters: [] });
const formData = ref(initialFormData());

const createNewModule = () => ({ moduleMasterId: '', facultyId: '', numberOfStudents: 10 });
const createNewSemester = () => ({
  name: '',
  academicYear: new Date().getFullYear(),
  modules: [createNewModule()],
});

const addSemester = () => formData.value.semesters.push(createNewSemester());
const removeSemester = semIndex => formData.value.semesters.splice(semIndex, 1);

const addModule = semIndex => formData.value.semesters[semIndex]?.modules.push(createNewModule());
const removeModule = (semIndex, modIndex) => {
  if (formData.value.semesters[semIndex]?.modules.length > 1) {
    formData.value.semesters[semIndex].modules.splice(modIndex, 1);
  } else {
    toast.error('Each semester must have at least one module.');
  }
};

const closeModal = () => emit('close');
const resetForm = () => {
  formData.value = initialFormData();
  currentStep.value = 0;
};

const handleSubmit = async () => {
  if (!isStepValid(2)) {
    toast.error('Please ensure all fields are filled correctly before saving.');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      semesters: formData.value.semesters.map(semester => ({
        name: semester.name,
        academicYear: semester.academicYear,
        modules: semester.modules.map(moduleItem => ({
          moduleMasterId: moduleItem.moduleMasterId,
          facultyId: moduleItem.facultyId,
          numberOfStudents: moduleItem.numberOfStudents,
        })),
      })),
    };

    await apiServices.configureProgramForOffered(formData.value.selectedProgramOfferedId, payload);

    toast.success('Program configuration saved successfully!');
    emit('program-configured', { id: formData.value.selectedProgramOfferedId });
    closeModal();
  } catch (error) {
    console.error('Error saving program configuration:', error);
    toast.error(`Failed to save program configuration: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #a8a8a8;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>