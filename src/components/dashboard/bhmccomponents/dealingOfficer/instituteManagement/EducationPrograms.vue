<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Education Programs</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ educationPrograms.length }}
        </span>
        <!-- Add status indicators here if needed, e.g., for pending/approved programs -->
      </div>
    </div>

    <!-- Search and Filter (if needed, implement similarly to Applications component) -->
    <!--
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input type="text" placeholder="Search programs..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="flex gap-4">
        <select
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>
    -->

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Course Title
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Commencement Date
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="program in educationPrograms" :key="program.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ program.institute }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ program.courseTitle }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ program.durationMonths }} Months</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(program.commencementDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(program.insReviewDecision)">
                  {{ getStatusText(program.insReviewDecision) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(program)"
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

    <!-- Pagination (if needed) -->
    <!--
    <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      </div>
    -->

    <EducationProgramDetailsModal :is-open="isModalOpen" :program-details="selectedProgram" @close-modal="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EducationProgramDetailsModal from '../modals/EducationProgramDetailsModal.vue'; // Adjust path if needed

// Static data for education programs (replace with your actual data or API call later)
const educationPrograms = ref([
  {
    id: 1,
    institute: 'Medical College of City X',
    courseTitle: 'Bachelor of Medicine',
    durationMonths: 60,
    commencementDate: '2024-09-15',
    instituteAttachments: 'link-to-attachments-1',
    remarks: 'Program focuses on general medicine.',
    insDeclaration: 'Declaration text 1',
    insRenewalReviewName: 'Reviewer 1',
    insReviewSummary: 'Summary of review 1',
    insReport: 'report-file-1.pdf',
    insReviewDecision: 'Approved',
    insReasonIfRejected: null,
    insRemarks: 'Approved after minor revisions.',
    isActive: true,
    validTill: '2029-09-15',
    paymentId: 'PAYID001',
    isPaymentComplete: true,
  },
  {
    id: 2,
    institute: 'University Health Sciences Y',
    courseTitle: 'Master of Surgery',
    durationMonths: 36,
    commencementDate: '2025-01-10',
    instituteAttachments: 'link-to-attachments-2',
    remarks: 'Specialization in surgical procedures.',
    insDeclaration: 'Declaration text 2',
    insRenewalReviewName: 'Reviewer 2',
    insReviewSummary: 'Summary of review 2',
    insReport: 'report-file-2.pdf',
    insReviewDecision: 'Pending',
    insReasonIfRejected: null,
    insRemarks: 'Under review by committee.',
    isActive: false,
    validTill: '2027-01-10',
    paymentId: 'PAYID002',
    isPaymentComplete: false,
  },
  {
    id: 3,
    institute: 'Institute of Advanced Medicine Z',
    courseTitle: 'PhD in Neuroscience',
    durationMonths: 48,
    commencementDate: '2024-11-01',
    instituteAttachments: 'link-to-attachments-3',
    remarks: 'Research-oriented program in neuroscience.',
    insDeclaration: 'Declaration text 3',
    insRenewalReviewName: 'Reviewer 3',
    insReviewSummary: 'Summary of review 3',
    insReport: 'report-file-3.pdf',
    insReviewDecision: 'Rejected',
    insReasonIfRejected: 'Did not meet research criteria.',
    insRemarks: 'Rejected due to insufficient research proposal.',
    isActive: false,
    validTill: null,
    paymentId: 'PAYID003',
    isPaymentComplete: true,
  },
]);

const isModalOpen = ref(false);
const selectedProgram = ref({});

const openModal = (program) => {
  selectedProgram.value = program;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProgram.value = {}; // Clear selected program data when closing
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusText = (decision) => {
  switch (decision) {
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    default:
      return 'Pending';
  }
};

const getStatusClasses = (decision) => {
  const status = getStatusText(decision);
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Rejected'
    }
  ];
};
</script>
