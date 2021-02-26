<!-- ApplicationLists.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Application List</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ filteredApplications.length }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingCount }}
        </span>
      </div>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search by App ID or Name..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Application Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Application ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Submitted
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in filteredApplications" :key="application.id"
              class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ application.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ application.applicantName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(application.dateSubmitted) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(application)">
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openApplication(application)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ApplicationModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeApplication"
      @save="saveApplication" @approve="approveApplication" @reject="rejectApplication" />

    <ConfirmationModal :isOpen="isConfirmationOpen" :actionType="confirmationAction"
      :application="confirmationApplication" @close="closeConfirmation" @confirm="processAction" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ApplicationModal from './DprModal.vue';
import ConfirmationModal from './DprConfirmationModal.vue';

const applications = ref([
  { id: 1, applicantName: 'John Doe', dateSubmitted: '2023-10-26', status: 'Pending', details: 'Some long description', proposedName: 'Test University', landArea: 1000, visionMission: 'test', projectScheduling: 'Test', grossNationalHappiness: 'Test', conceptualMasterPlan: 'Test', academicPlan: 'Test', affiliationDetails: 'Test', teachingHospitalDetails: 'Test', researchPolicyDetails: 'Test', humanResourcesDetails: 'Test', qualityAssuranceSystemDetails: 'Test', governanceStructureDetails: 'Test', businessPlanDetails: 'Test', projectCostAnalysisDetails: 'Test', facilitiesStudentServicesDetails: 'Test', admissionPolicyScholarshipsDetails: 'Test', serviceConditionsDetails: 'Test', safetySecurityDetails: 'Test', publicInformationSystemDetails: 'Test', otherDetails: 'Test' },
  { id: 2, applicantName: 'Jane Smith', dateSubmitted: '2023-10-25', status: 'Approved', details: 'Another long description', proposedName: 'Test University', landArea: 1000, visionMission: 'test', projectScheduling: 'Test', grossNationalHappiness: 'Test', conceptualMasterPlan: 'Test', academicPlan: 'Test', affiliationDetails: 'Test', teachingHospitalDetails: 'Test', researchPolicyDetails: 'Test', humanResourcesDetails: 'Test', qualityAssuranceSystemDetails: 'Test', governanceStructureDetails: 'Test', businessPlanDetails: 'Test', projectCostAnalysisDetails: 'Test', facilitiesStudentServicesDetails: 'Test', admissionPolicyScholarshipsDetails: 'Test', serviceConditionsDetails: 'Test', safetySecurityDetails: 'Test', publicInformationSystemDetails: 'Test', otherDetails: 'Test' },
  { id: 3, applicantName: 'Peter Jones', dateSubmitted: '2023-10-24', status: 'Rejected', details: 'Yet another long description', proposedName: 'Test University', landArea: 1000, visionMission: 'test', projectScheduling: 'Test', grossNationalHappiness: 'Test', conceptualMasterPlan: 'Test', academicPlan: 'Test', affiliationDetails: 'Test', teachingHospitalDetails: 'Test', researchPolicyDetails: 'Test', humanResourcesDetails: 'Test', qualityAssuranceSystemDetails: 'Test', governanceStructureDetails: 'Test', businessPlanDetails: 'Test', projectCostAnalysisDetails: 'Test', facilitiesStudentServicesDetails: 'Test', admissionPolicyScholarshipsDetails: 'Test', serviceConditionsDetails: 'Test', safetySecurityDetails: 'Test', publicInformationSystemDetails: 'Test', otherDetails: 'Test' },
  { id: 4, applicantName: 'Ali Khan', dateSubmitted: '2023-10-23', status: 'Pending', details: 'Another long description', proposedName: 'Test University', landArea: 1000, visionMission: 'test', projectScheduling: 'Test', grossNationalHappiness: 'Test', conceptualMasterPlan: 'Test', academicPlan: 'Test', affiliationDetails: 'Test', teachingHospitalDetails: 'Test', researchPolicyDetails: 'Test', humanResourcesDetails: 'Test', qualityAssuranceSystemDetails: 'Test', governanceStructureDetails: 'Test', businessPlanDetails: 'Test', projectCostAnalysisDetails: 'Test', facilitiesStudentServicesDetails: 'Test', admissionPolicyScholarshipsDetails: 'Test', serviceConditionsDetails: 'Test', safetySecurityDetails: 'Test', publicInformationSystemDetails: 'Test', otherDetails: 'Test' },
]);

const isModalOpen = ref(false);
const selectedApplication = ref(null);
const isConfirmationOpen = ref(false);
const confirmationAction = ref('');
const confirmationApplication = ref(null);
const searchQuery = ref('');

const openApplication = (application) => {
  selectedApplication.value = { ...application };
  isModalOpen.value = true;
};

const closeApplication = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const saveApplication = (applicationId, updatedApplication) => {
  console.log("Saving application", applicationId, "with updates:", updatedApplication);
  const application = applications.value.find(app => app.id === applicationId);
  if (application) {
    Object.assign(application, updatedApplication);
    closeApplication();
  }
};

const openConfirmation = (action, application) => {
  confirmationAction.value = action;
  confirmationApplication.value = application;
  isConfirmationOpen.value = true;
};

const closeConfirmation = () => {
  isConfirmationOpen.value = false;
  confirmationAction.value = '';
  confirmationApplication.value = null;
};

const processAction = (applicationId, message, actionType) => {
  console.log(`Performing ${actionType} on application ${applicationId} with message: ${message}`);
  const applicationIndex = applications.value.findIndex(app => app.id === applicationId);

  if (applicationIndex !== -1) {
    applications.value[applicationIndex] = {
      ...applications.value[applicationIndex],
      status: actionType === 'approve' ? 'Approved' : 'Rejected'
    };
    closeConfirmation();
    closeApplication(); // Close the main application modal after approval/rejection
  } else {
    console.error(`Application with ID ${applicationId} not found.`);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const filteredApplications = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return applications.value.filter(application => {
    return String(application.id).includes(query) || application.applicantName.toLowerCase().includes(query);
  });
});

const getStatusClasses = (application) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': application.status === 'Pending',
      'bg-green-100 text-green-800': application.status === 'Approved',
      'bg-red-100 text-red-800': application.status === 'Rejected'
    }
  ];
};

const pendingCount = computed(() => {
  return filteredApplications.value.filter(app => app.status === 'Pending').length;
});

const approveApplication = (application) => {
  openConfirmation('approve', application);
};

const rejectApplication = (application) => {
  openConfirmation('reject', application);
};
</script>
