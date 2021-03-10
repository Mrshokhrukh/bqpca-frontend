<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Profiles</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ instituteProfiles.length }}
        </span>
        <!-- Add status indicators here if needed -->
      </div>
    </div>

    <!-- Search and Filter (if needed, implement similarly to Applications component) -->
    <!--
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input type="text" placeholder="Search institutes..."
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
                Institution Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CID
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Dzongkhag
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
            <tr v-for="institute in instituteProfiles" :key="institute.cid" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ institute.name_of_institution }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ institute.cid }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ institute.dzongkhag }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(institute.do_dpr_review_decision)">
                  <!-- Adjust status field as needed -->
                  {{ getStatusText(institute.do_dpr_review_decision) }} <!-- Adjust status field as needed -->
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(institute)"
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

    <InstituteProfileDetailsModal :is-open="isModalOpen" :institute-details="selectedInstitute"
      @close-modal="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InstituteProfileDetailsModal from '../modals/InstituteProfileDetailsModal.vue'; // Adjust path if needed

// Static data for institute profiles (replace with your actual data or API call later)
const instituteProfiles = ref([
  {
    cid: '12121212121',
    full_name: 'Dr. Pema Wangchuk',
    gender: 'Male',
    contact_no: '17171717',
    email_address: 'pema@example.com',
    name_of_institution: 'Bhutan Medical Institute',
    country: 'Bhutan',
    gewog: 'Thimphu Gewog',
    dzongkhag: 'Thimphu',
    village: 'Changangkha',
    address: 'Norzin Lam',
    chiwog: 'Chang',
    teaching_institute: 'Yes',
    title_of_course: 'MBBS',
    course_duration: '60 Months',
    commencement_date: '2024-08-15',
    type_of_programme: 'Degree',
    supporting_documents: 'link-to-docs-1',
    remarks: 'Premier medical institute in Bhutan.',
    declaration: 'Institute declares compliance.',
    review_decision: 'Approved',
    reason_if_rejected: null,
    website: 'www.bmi.bt',
    head_of_institution_name: 'Dr. Karma Tenzin',
    head_of_institution_gender: 'Male',
    head_of_institution_phone_number: '17777777',
    head_of_institution_email: 'karma.tenzin@bmi.bt',
    dpr_name: 'DPR Report 2023',
    executive_summary: 'Comprehensive DPR summary.',
    institute_eoi_supporting_documents: 'link-to-eoi-docs-1',
    institute_dpr_remarks: 'DPR submitted and under review.',
    do_dpr_review_report: 'dpr-review-report-1.pdf',
    do_dpr_review_summary: 'Summary of DPR review.',
    do_dpr_report: 'dpr-report-final-1.pdf',
    do_dpr_review_decision: 'Pending',
    do_dpr_reason_if_rejected: null,
    is_active: true,
    payment_id: 'PAYID004',
    is_payment_complete: true,
    is_physical_verification: true,
    vision_mission_implementation_strategies: 'Vision and mission outlined.',
    project_scheduling_implementation_management: 'Project schedule detailed.',
    values_of_gross_national_happiness: 'GNH values integrated.',
    land: 'Land details provided.',
    conceptual_master_plan: 'Master plan available.',
    academic_plan_profile: 'Academic profile detailed.',
    affiliation: 'Affiliated with KU.',
    teaching_hospital: 'Yes, own teaching hospital.',
    research_policy: 'Research policy in place.',
    human_resource: 'HR plan detailed.',
    quality_assurance_system: 'QA system implemented.',
    governance_structure: 'Clear governance structure.',
    business_plan: 'Business plan available.',
    project_cost_and_analysis: 'Cost analysis provided.',
    facilities_and_student_services: 'Facilities and services listed.',
    admission_policy_and_scholarships: 'Admission policy and scholarships detailed.',
    service_conditions: 'Service conditions defined.',
    safety_and_security: 'Safety and security measures in place.',
    public_information_system: 'Public info system described.',
    others: 'Other relevant information.',
  },
  {
    cid: '23232323232',
    name_of_institution: 'Royal Institute of Health',
    dzongkhag: 'Paro',
    do_dpr_review_decision: 'Approved',
    // ... more institute data
  },
  {
    cid: '34343434343',
    name_of_institution: 'Eastern Medical College',
    dzongkhag: 'Trashigang',
    do_dpr_review_decision: 'Rejected',
    // ... more institute data
  },
]);

const isModalOpen = ref(false);
const selectedInstitute = ref({});

const openModal = (institute) => {
  selectedInstitute.value = institute;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedInstitute.value = {}; // Clear selected institute data when closing
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
