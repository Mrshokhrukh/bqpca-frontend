<template>
    <div v-if="isOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Application Details
                </h3>

                <div class="mt-5 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label for="proposedName" class="block text-sm font-medium text-gray-700">Proposed Name:</label>
                    <input type="text" id="proposedName" v-model="localApplication.proposedName" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode">
                  </div>

                  <div>
                    <label for="landArea" class="block text-sm font-medium text-gray-700">Land Area (sq. ft):</label>
                    <input type="number" id="landArea" v-model="localApplication.landArea" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode">
                  </div>

                  <div class="sm:col-span-2">
                    <label for="visionMission" class="block text-sm font-medium text-gray-700">Vision, Mission, and Implementation Strategies:</label>
                    <textarea id="visionMission" v-model="localApplication.visionMission" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="projectScheduling" class="block text-sm font-medium text-gray-700">Project Scheduling, Implementation, and Management:</label>
                    <textarea id="projectScheduling" v-model="localApplication.projectScheduling" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="grossNationalHappiness" class="block text-sm font-medium text-gray-700">Values of Gross National Happiness:</label>
                    <textarea id="grossNationalHappiness" v-model="localApplication.grossNationalHappiness" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                   <div class="sm:col-span-2">
                    <label for="conceptualMasterPlan" class="block text-sm font-medium text-gray-700">Conceptual Master Plan:</label>
                    <textarea id="conceptualMasterPlan" v-model="localApplication.conceptualMasterPlan" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="academicPlan" class="block text-sm font-medium text-gray-700">Academic Plan/Profile:</label>
                    <textarea id="academicPlan" v-model="localApplication.academicPlan" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                   <div>
                    <label for="affiliationDetails" class="block text-sm font-medium text-gray-700">Affiliation Details:</label>
                    <input type="text" id="affiliationDetails" v-model="localApplication.affiliationDetails" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode">
                  </div>

                  <div>
                    <label for="teachingHospitalDetails" class="block text-sm font-medium text-gray-700">Teaching Hospital Details:</label>
                    <input type="text" id="teachingHospitalDetails" v-model="localApplication.teachingHospitalDetails" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode">
                  </div>

                   <div class="sm:col-span-2">
                    <label for="researchPolicyDetails" class="block text-sm font-medium text-gray-700">Research Policy Details:</label>
                    <textarea id="researchPolicyDetails" v-model="localApplication.researchPolicyDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="humanResourcesDetails" class="block text-sm font-medium text-gray-700">Human Resources Details:</label>
                    <textarea id="humanResourcesDetails" v-model="localApplication.humanResourcesDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="qualityAssuranceSystemDetails" class="block text-sm font-medium text-gray-700">Quality Assurance System Details:</label>
                    <textarea id="qualityAssuranceSystemDetails" v-model="localApplication.qualityAssuranceSystemDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="governanceStructureDetails" class="block text-sm font-medium text-gray-700">Governance Structure Details:</label>
                    <textarea id="governanceStructureDetails" v-model="localApplication.governanceStructureDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="businessPlanDetails" class="block text-sm font-medium text-gray-700">Business Plan Details:</label>
                    <textarea id="businessPlanDetails" v-model="localApplication.businessPlanDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="projectCostAnalysisDetails" class="block text-sm font-medium text-gray-700">Project Cost and Analysis Details:</label>
                    <textarea id="projectCostAnalysisDetails" v-model="localApplication.projectCostAnalysisDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="facilitiesStudentServicesDetails" class="block text-sm font-medium text-gray-700">Facilities and Student Services Details:</label>
                    <textarea id="facilitiesStudentServicesDetails" v-model="localApplication.facilitiesStudentServicesDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="admissionPolicyScholarshipsDetails" class="block text-sm font-medium text-gray-700">Admission Policy and Scholarships Details:</label>
                    <textarea id="admissionPolicyScholarshipsDetails" v-model="localApplication.admissionPolicyScholarshipsDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="serviceConditionsDetails" class="block text-sm font-medium text-gray-700">Service Conditions Details:</label>
                    <textarea id="serviceConditionsDetails" v-model="localApplication.serviceConditionsDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="safetySecurityDetails" class="block text-sm font-medium text-gray-700">Safety and Security Details:</label>
                    <textarea id="safetySecurityDetails" v-model="localApplication.safetySecurityDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="publicInformationSystemDetails" class="block text-sm font-medium text-gray-700">Public Information System Details:</label>
                    <textarea id="publicInformationSystemDetails" v-model="localApplication.publicInformationSystemDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>

                  <div class="sm:col-span-2">
                    <label for="otherDetails" class="block text-sm font-medium text-gray-700">Other Details:</label>
                    <textarea id="otherDetails" v-model="localApplication.otherDetails" rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" :disabled="!isEditMode"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <template v-if="!isEditMode">
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" @click="enterEditMode">
                Edit
              </button>
            </template>
            <template v-else>
              <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" @click="save">
                Save
              </button>
            </template>

            <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" @click="close">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    isOpen: Boolean,
    application: Object,
  });

  const emit = defineEmits(['close', 'save']);

  const isEditMode = ref(false);

  const localApplication = ref(props.application ? { ...props.application } : {});

  watch(() => props.application, (newApplication) => {
    localApplication.value = newApplication ? { ...newApplication } : {};
    isEditMode.value = false; // Reset edit mode when a new application is opened
  });

  const close = () => {
    emit('close');
  };

  const enterEditMode = () => {
    isEditMode.value = true;
  };

  const save = () => {
    emit('save', localApplication.value.id, localApplication.value);
    isEditMode.value = false; // Exit edit mode after saving
  };
  </script>
