<!-- IndividualEcpfApplications.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <h2 class="text-2xl font-bold mb-4">New ECPF Establishment Applications</h2>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CID No.
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Firm Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact No.
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Application Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="application in applications" :key="application.cidNo" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img src="" class="h-8 w-8 rounded-full object-cover mr-3" alt="Applicant Photo">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ application.applicantName }}</div>
                    <div class="text-sm text-gray-500">{{ application.cidNo }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.cidNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.firmName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.contactNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(application.applicationStatus)">
                  {{ application.applicationStatus }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="viewApplication(application)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="applications.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No applications found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ecpf-application-modal
      :is-open="isModalOpen"
      :application="selectedApplication"
      :close-modal="closeModal"
      @update-verification="handleVerificationUpdate"
      @update-evaluation="handleEvaluationUpdate"
      @update-mou="handleMouUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EcpfApplicationModal from './modals/IndividualEcpfModal.vue'; // Import the modal component

// Mock Application Data (Replace with your actual data fetching logic)
const applications = ref([
  {
    cidNo: '12345678901',
    applicantName: 'Sonam Wangchuk',
    gender: 'Male',
    dateOfBirth: '1990-01-15',
    contactNo: '17123456',
    emailAddress: 'sonam@example.com',
    presentAddress: { officeNumber: '101', flatNo: 'A', buildingNo: 'XYZ Building', location: 'Thimphu', gewogThrom: 'Chang Gewog', dzongkhagThromde: 'Thimphu Thromde' },
    permanentAddress: { villageChiwog: 'Chang', gewog: 'Chang Gewog', dungkhag: '', dzongkhagThromde: 'Thimphu' },
    educationDetails: { qualification: 'Masters', instituteName: 'CST', universityName: 'RUB' },
    ecpfProposalDetails: { firmName: 'Tech Solutions ECPF', firmAddress: 'Norzin Lam', firmLocation: 'Thimphu', firmType: 'Independent' },
    purposeOfEstablishment: { vision: 'To provide quality counseling services.', mission: 'Empowering individuals through guidance.', objective: 'Reach 1000 clients in 3 years.' },
    humanResource: [{ position: 'Counselor', cid: '98765432109', fullName: 'Pema Dema', qualification: 'Bachelor in Psychology', contactNumber: '17654321', emailAddress: 'pema@example.com' }],
    financePlan: { details: 'Initial investment from personal savings.' },
    services: [{ category: 'Counseling', details: 'Individual and group counseling sessions.' }],
    swotAnalysis: { strengths: 'Experienced counselors', weaknesses: 'Limited initial funding', opportunities: 'Growing demand for mental health services', threats: 'Competition from established centers' },
    feeCharges: [{ breakup: 'Consultation Fee', description: 'Per session', amount: 500, totalAmount: 500 }],
    guarantorDetails: { fullName: 'Karma Dorji', cidNumber: '54321678901', relation: 'Brother', contactNumber: '17987654' },
    applicationStatus: 'Pending Review' // Example status
  },
  {
    cidNo: '98765432102',
    applicantName: 'Tashi Wangmo',
    firmName: 'Wellness Center',
    contactNo: '17456789',
    applicationStatus: 'Shortlisted', // Example status
    presentAddress: { officeNumber: '202', flatNo: 'B', buildingNo: 'PQR Building', location: 'Paro', gewogThrom: 'Dopshari Gewog', dzongkhagThromde: 'Paro Thromde' },
    permanentAddress: { villageChiwog: 'Dopshari', gewog: 'Dopshari Gewog', dungkhag: '', dzongkhagThromde: 'Paro' },
    educationDetails: { qualification: 'Masters in Counseling', instituteName: 'Paro College', universityName: 'Khesar Gyalpo University of Medical Sciences of Bhutan' },
    ecpfProposalDetails: { firmName: 'Wellness Center ECPF', firmAddress: 'Town Area', firmLocation: 'Paro', firmType: 'Collaboration' },
    purposeOfEstablishment: { vision: 'To be a leading wellness center.', mission: 'Promoting holistic wellbeing.', objective: 'Expand services to 3 Dzongkhags in 5 years.' },
    humanResource: [{ position: 'HR Manager', cid: '11223344556', fullName: 'Sangay Lhamo', qualification: 'MBA in HR', contactNumber: '17112233', emailAddress: 'sangay@example.com' }],
    financePlan: { details: 'Bank Loan and personal investment.' },
    services: [{ category: 'Yoga', details: 'Yoga and Meditation classes.' }],
    swotAnalysis: { strengths: 'Prime location', weaknesses: 'New in the market', opportunities: 'Growing health consciousness', threats: 'Economic downturn' },
    feeCharges: [{ breakup: 'Yoga Class Fee', description: 'Monthly', amount: 1500, totalAmount: 1500 }],
    guarantorDetails: { fullName: 'Dorji Phuntsho', cidNumber: '65432109876', relation: 'Friend', contactNumber: '17345678' },
  },
]);

const selectedApplication = ref(null);
const isModalOpen = ref(false);

const viewApplication = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const handleVerificationUpdate = (updateData) => {
  console.log('Verification Updated in Parent:', updateData);
  // Here you would typically update the application data in the `applications` ref
  // based on `updateData` (e.g., using CID to find the right application).
  // For mock data, you might need to find and update in the array.
  // In a real app, you'd likely refetch the applications list.
};
const handleEvaluationUpdate = (updateData) => {
  console.log('Evaluation Updated in Parent:', updateData);
  // Implement update logic similar to handleVerificationUpdate
};
const handleMouUpdate = (updateData) => {
  console.log('MoU Updated in Parent:', updateData);
  // Implement update logic similar to handleVerificationUpdate
};

const getStatusClasses = (status) => {
  return  [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending Review',
      'bg-green-100 text-green-800': status === 'Shortlisted',    // Adjust status names to match your data
      'bg-red-100 text-red-800': status === 'Rejected',         // Adjust status names to match your data
      'bg-blue-100 text-blue-800': status === 'Approved',          // Adjust status names to match your data
      'bg-gray-100 text-gray-800': status === 'Draft',            // Adjust status names to match your data
      // Add more status mappings as needed based on your applicationStatus values
    }
  ];
};

</script>