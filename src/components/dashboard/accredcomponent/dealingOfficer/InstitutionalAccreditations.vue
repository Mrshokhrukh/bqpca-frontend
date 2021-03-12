<template>
  <div class="container mx-auto px-4 sm:px-8">
    <div class="py-8">
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Application ID
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Institution Name
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Program Name
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Submission Date
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in applications" :key="application.applicationId">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ application.applicationId }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ application.institutionName }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ application.programName }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ application.submissionDate }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight" :class="getStatusClass(application.status)">
                    <span aria-hidden class="absolute inset-0 bg-green-200 opacity-50 rounded-full" :class="getStatusBackgroundClass(application.status)"></span>
                    <span class="relative">{{ application.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button @click="openModal(application)" class="inline-block text-center py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md transition duration-200">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ApplicationModal
      :is-open="isModalOpen"
      :application="selectedApplication"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ApplicationModal from './AccreditationModal.vue'; // Import the modal component

const applications = ref([
  {
    applicationId: 'APP-2024-001',
    institutionName: 'University Alpha',
    programName: 'Bachelor of Science in Computing',
    submissionDate: '2024-08-15',
    status: 'Submitted',
    institutionProfile: {
      nameOfInstitution: 'University Alpha',
      addressLocation: '123 Main Street',
      gewogThrom: 'Thimphu Thromde',
      dzongkhagThrom: 'Thimphu',
      contactNumber: '17XXXXXXX',
      emailAddress: 'info@alpha.edu.bt',
      telephoneNumber: '+975 2 3XXXXX',
      yearOfEstablishment: '2000',
      typeOfInstitution: 'University',
      affiliatedTo: 'N/A',
      levelOfAutonomy: 'Full',
      sourceOfFunding: 'Government',
      totalArea: '50 acres',
      website: 'www.alpha.edu.bt'
    },
    pastAccreditationDetails: {
      accreditationRating: 'A',
      accreditationValidityDate: '2023-12-31'
    },
    headOfInstituteDetails: {
      name: 'Dr. Head Alpha',
      contactNumber: '17YYYYYYY',
      emailAddress: 'head@alpha.edu.bt'
    },
    iqaFocalDetails: {
      nameOfIqaFocal: 'Mr. IQA Focal',
      contactNumber: '17ZZZZZZZ',
      emailAddress: 'iqa@alpha.edu.bt'
    },
    academicActivities: 'Bachelor of Science - 200\nMaster of Arts - 100',
    studentDetails: {
      maleCount: 250,
      femaleCount: 150,
      totalCount: 400
    },
    financialResources: 'Annual Budget - $1,000,000',
    standards: [
      { standardName: 'Standard 1', keyAspectName: 'Curriculum Design', indicators: 'Indicators for Standard 1...', reportByInstitute: 'Report on Standard 1...' },
      { standardName: 'Standard 2', keyAspectName: 'Teaching and Learning', indicators: 'Indicators for Standard 2...', reportByInstitute: 'Report on Standard 2...' }
    ],
    supportingDocuments: [
      { name: 'Self-Assessment Report', url: '#' },
      { name: 'Institutional Profile Document', url: '#' }
    ]
  },
  {
    applicationId: 'APP-2024-002',
    institutionName: 'College Beta',
    programName: 'Master of Arts in Education',
    submissionDate: '2024-08-20',
    status: 'Under Review',
    institutionProfile: {
      nameOfInstitution: 'College Beta',
      addressLocation: '456 Elm Street',
      gewogThrom: 'Paro Thromde',
      dzongkhagThrom: 'Paro',
      contactNumber: '17AAAAAAA',
      emailAddress: 'info@beta.edu.bt',
      telephoneNumber: '+975 8 8XXXXX',
      yearOfEstablishment: '2010',
      typeOfInstitution: 'College',
      affiliatedTo: 'University XYZ',
      levelOfAutonomy: 'Partial',
      sourceOfFunding: 'Private',
      totalArea: '25 acres',
      website: 'www.beta.edu.bt'
    },
    pastAccreditationDetails: {
      accreditationRating: 'B+',
      accreditationValidityDate: '2022-06-30'
    },
    headOfInstituteDetails: {
      name: 'Dr. Head Beta',
      contactNumber: '17BBBBBBB',
      emailAddress: 'head@beta.edu.bt'
    },
    iqaFocalDetails: {
      nameOfIqaFocal: 'Ms. IQA Beta',
      contactNumber: '17CCCCCCC',
      emailAddress: 'iqa@beta.edu.bt'
    },
    academicActivities: 'Master of Arts - 120\nDiploma in Education - 80',
    studentDetails: {
      maleCount: 100,
      femaleCount: 100,
      totalCount: 200
    },
    financialResources: 'Annual Budget - $750,000',
    standards: [
      { standardName: 'Standard 1', keyAspectName: 'Governance and Leadership', indicators: 'Indicators for Standard 1...', reportByInstitute: 'Report on Standard 1...' },
      { standardName: 'Standard 3', keyAspectName: 'Student Support Services', indicators: 'Indicators for Standard 3...', reportByInstitute: 'Report on Standard 3...' }
    ],
    supportingDocuments: [
      { name: 'Quality Assurance Manual', url: '#' }
    ]
  },
  // ... add more application objects with the same structure
]);

const isModalOpen = ref(false);
const selectedApplication = ref({});

const openModal = (application) => {
  selectedApplication.value = application;
  console.log('selectedApplication:', selectedApplication.value); // Debugging line
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = {};
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Submitted': return 'text-blue-900';
    case 'Under Review': return 'text-yellow-900';
    case 'Assessor Assigned': return 'text-purple-900';
    case 'Site Visit Scheduled': return 'text-indigo-900';
    case 'Approved': return 'text-green-900';
    default: return 'text-gray-900';
  }
};
const getStatusBackgroundClass = (status) => {
  switch (status) {
    case 'Submitted': return 'bg-blue-200';
    case 'Under Review': return 'bg-yellow-200';
    case 'Assessor Assigned': return 'bg-purple-200';
    case 'Site Visit Scheduled': return 'bg-indigo-200';
    case 'Approved': return 'bg-green-200';
    default: return 'bg-gray-200';
  }
};

</script>