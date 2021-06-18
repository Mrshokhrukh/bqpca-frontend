<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Add New DPR Application</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- ... other form fields ... -->
        <div>
          <label for="institutionName" class="block text-sm font-medium text-gray-700">Proposed Name of the College/institution *</label>
          <input type="text" v-model="formData.name_of_institution" id="institutionName" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <p class="mt-1 text-xs text-gray-500">Avoid using “Royal”, “National”, etc. Final name subject to approval by Registrar of Companies.</p>
        </div>

        <div>
          <label for="cid" class="block text-sm font-medium text-gray-700">Promoter's CID *</label>
          <input type="text" v-model="formData.CID" id="cid" required :placeholder="authStore.user?.cid || 'Enter CID'" disabled
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50">
        </div>

        <div>
          <label for="dprName" class="block text-sm font-medium text-gray-700">DPR Name / Primary Course Title *</label>
          <input type="text" v-model="formData.dpr_name" id="dprName" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="headName" class="block text-sm font-medium text-gray-700">Head of Institution Name *</label>
              <input type="text" v-model="formData.head_of_institution_name" id="headName" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label for="headEmail" class="block text-sm font-medium text-gray-700">Head of Institution Email *</label>
              <input type="email" v-model="formData.head_of_institution_email" id="headEmail" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
        </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="contactNo" class="block text-sm font-medium text-gray-700">Institution Contact No *</label>
              <input type="tel" v-model="formData.contact_no" id="contactNo" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label for="emailAddress" class="block text-sm font-medium text-gray-700">Institution Official Email Address *</label>
              <input type="email" v-model="formData.email_address" id="emailAddress" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Proposed Dzongkhag *</label>
                <select v-model="formData.dzongkhag" id="dzongkhag" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="" disabled>Select Dzongkhag</option>
                    <option v-for="dzo in dzongkhagOptions" :key="dzo" :value="dzo">{{ dzo }}</option>
                </select>
            </div>
            <div>
                <label for="gewog" class="block text-sm font-medium text-gray-700">Proposed Gewog</label>
                <input type="text" v-model="formData.gewog" id="gewog"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
        </div>

        <div>
          <label for="commencementDate" class="block text-sm font-medium text-gray-700">Proposed Commencement Date *</label>
          <input type="date" v-model="formData.commencement_date" id="commencementDate" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                <label for="programType" class="block text-sm font-medium text-gray-700">Type of Programme *</label>
                <select v-model="formData.type_of_programme" id="programType" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="" disabled>Select Type</option>
                    <option v-if="isLoadingProgramTypes" value="" disabled>Loading types...</option>
                    <option v-else-if="programTypesError" value="" disabled>{{ programTypesError }}</option>

                    <option v-for="programMaster in programMasterOptions" :key="programMaster.id" :value="programMaster.id">
                        {{ programMaster.program_name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="courseDuration" class="block text-sm font-medium text-gray-700">Course Duration (Months) *</label>
                <input type="number" v-model.number="formData.course_duration" id="courseDuration" required min="1"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
        </div>

        <div>
          <label for="executiveSummary" class="block text-sm font-medium text-gray-700">Executive Summary *</label>
          <textarea v-model="formData.executive_summary" id="executiveSummary" rows="4" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <hr class="my-8 border-gray-300">
        <h4 class="text-lg font-medium text-gray-800 mb-4">Detailed Project Proposal Sections</h4>

        <div>
          <label for="visionMissionStrategies" class="block text-sm font-medium text-gray-700">Vision, Mission and Implementation Strategies *</label>
          <textarea v-model="formData.vision_mission_strategies" id="visionMissionStrategies" rows="5" required
                    placeholder="Clearly mention strategies, envisaged obstacles, and how to overcome them."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="projectSchedulingManagement" class="block text-sm font-medium text-gray-700">Project Scheduling, Implementation and Management *</label>
          <textarea v-model="formData.project_scheduling_management" id="projectSchedulingManagement" rows="5" required
                    placeholder="Specify timelines, major milestones, projected student numbers, etc."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="gnhValues" class="block text-sm font-medium text-gray-700">Contribution to Gross National Happiness & Values *</label>
          <textarea v-model="formData.gnh_values_ict_excellence" id="gnhValues" rows="5" required
                    placeholder="How the institution will contribute to GNH, instill values, promote ICT, and quest for excellence."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="landDetails" class="block text-sm font-medium text-gray-700">Land Details *</label>
          <textarea v-model="formData.land_details" id="landDetails" rows="3" required
                    placeholder="Details of land as required by relevant rules and regulations."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="conceptualMasterPlan" class="block text-sm font-medium text-gray-700">Conceptual Master Plan *</label>
          <textarea v-model="formData.conceptual_master_plan" id="conceptualMasterPlan" rows="5" required
                    placeholder="Encompass all aspects of physical infrastructure (academic, residential, auditorium, dining, parking, playfields, etc.). Note: No shift systems for multiple institutions on one premise."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="academicPlanProfile" class="block text-sm font-medium text-gray-700">Academic Plan/Profile *</label>
          <textarea v-model="formData.academic_plan_profile" id="academicPlanProfile" rows="6" required
                    placeholder="Intent and purpose, academic character, justifications for programs (market trends, existing institutes), research facilities, credit transfer plans, part-time/exchange programs, internship plans, in-campus recruitment potential."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="affiliationDetails" class="block text-sm font-medium text-gray-700">Affiliation Details *</label>
          <textarea v-model="formData.affiliation_details" id="affiliationDetails" rows="4" required
                    placeholder="Details on affiliation with a recognized university. Approach university for affiliation in the same academic year permission is granted."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="teachingHospitalDetails" class="block text-sm font-medium text-gray-700">Teaching Hospital Details (Mandatory for Medical/Health courses) *</label>
          <textarea v-model="formData.teaching_hospital_details" id="teachingHospitalDetails" rows="4" required
                    placeholder="Identification of teaching hospital for clinical skills. Cannot be shared for same program. Signed agreements with MoH/University for clinical facilities."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="researchPolicy" class="block text-sm font-medium text-gray-700">Research Policy *</label>
          <textarea v-model="formData.research_policy" id="researchPolicy" rows="4" required
                    placeholder="Policy to promote research activities by faculty, students, and the institution."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="humanResourcePlan" class="block text-sm font-medium text-gray-700">Human Resource Plan *</label>
          <textarea v-model="formData.human_resource_plan" id="humanResourcePlan" rows="5" required
                    placeholder="Faculty recruitment (teaching/non-teaching), relevant qualifications (at least one level higher than course taught), research/publication/consultancy encouragement, number required, future expansion, expatriate personnel."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="qualityAssuranceSystem" class="block text-sm font-medium text-gray-700">Quality Assurance System *</label>
          <textarea v-model="formData.quality_assurance_system" id="qualityAssuranceSystem" rows="5" required
                    placeholder="Internal QA mechanism, provision for external QA. Evidence of clear description of academic quality, standards, policies, expectations, and student achievement."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="governanceStructure" class="block text-sm font-medium text-gray-700">Governance Structure *</label>
          <textarea v-model="formData.governance_structure" id="governanceStructure" rows="5" required
                    placeholder="Proposed governance policy, organizational structure (Board of Directors, committees, TORs), reporting arrangements, delegations, inter-relationships. Section on planning, stakeholder coordination, resource mobilization."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="businessPlan" class="block text-sm font-medium text-gray-700">Business Plan *</label>
          <textarea v-model="formData.business_plan" id="businessPlan" rows="5" required
                    placeholder="Financial viability, promoter's capacity to sustain operations, financial indicators, source of funds (equity/debt), detailed project costing, financial analysis, projected tuition levels. Management and administrative systems, policies, procedures timeline."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="projectCostAnalysis" class="block text-sm font-medium text-gray-700">Project Cost and Analysis *</label>
          <textarea v-model="formData.project_cost_analysis" id="projectCostAnalysis" rows="5" required
                    placeholder="Detailed project costing (land, site dev, civil construction, infrastructure, equipment, pollution control, technical know-how, pre-operating expenses, contingencies, FX if any). Fixed investment and working capital."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="facilitiesStudentServices" class="block text-sm font-medium text-gray-700">Facilities and Student Services *</label>
          <textarea v-model="formData.facilities_student_services" id="facilitiesStudentServices" rows="5" required
                    placeholder="Mechanisms for enhancing student learning outcomes: quality facilities, inclusive practices, learning/information resources (library, infirmary, ICT), support services (cafeteria, transport, counseling)."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="admissionPolicyScholarships" class="block text-sm font-medium text-gray-700">Admission Policy and Scholarships *</label>
          <textarea v-model="formData.admission_policy_scholarships" id="admissionPolicyScholarships" rows="4" required
                    placeholder="Clear policy on admission, eligibility criteria, selection procedures, fee structure, scholarship provisions."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="serviceConditions" class="block text-sm font-medium text-gray-700">Service Conditions *</label>
          <textarea v-model="formData.service_conditions" id="serviceConditions" rows="5" required
                    placeholder="Clear policies on recruitment, professional development, remuneration (PF, retirement benefits), leave, staff welfare, student representation, other support services."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="safetySecurityPlan" class="block text-sm font-medium text-gray-700">Safety and Security Plan *</label>
          <textarea v-model="formData.safety_security_plan" id="safetySecurityPlan" rows="4" required
                    placeholder="Mechanisms for staff and student safety/security. Provisions for course continuation by learners in case of unforeseen college closure."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="publicInformationSystem" class="block text-sm font-medium text-gray-700">Public Information System Plan *</label>
          <textarea v-model="formData.public_information_system" id="publicInformationSystem" rows="4" required
                    placeholder="Plan to create/maintain a system for transparency (student fees, licensing/accreditation status, course details, etc.)."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="otherDetails" class="block text-sm font-medium text-gray-700">Others *</label>
          <textarea v-model="formData.other_details" id="otherDetails" rows="4" required
                    placeholder="Issues like market analysis, ownership, sustainability, enrolment projection (beginning & onwards), approvals from respective organizations, etc., supported by justifications."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <!-- ... other form fields and submission button ... -->

        <div v-if="formError" class="text-red-600 text-sm p-3 bg-red-50 rounded-md">
            {{ formError }}
        </div>

        <div class="pt-4 flex justify-end gap-4">
          <button type="button" @click="closeModal"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" :disabled="isSubmitting"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services'; // Ensure this path is correct

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits(['close', 'application-submitted']);

const authStore = useAuthStore();
const toast = useToast();

const initialFormData = () => ({
  name_of_institution: '',
  CID: authStore.user?.cid || '',
  dpr_name: '',
  head_of_institution_name: '',
  head_of_institution_email: '',
  contact_no: '',
  email_address: '',
  dzongkhag: '',
  gewog: '',
  commencement_date: '',
  type_of_programme: '', 
  course_duration: null,
  executive_summary: '',
  vision_mission_strategies: '',
  project_scheduling_management: '',
  gnh_values_ict_excellence: '',
  land_details: '',
  conceptual_master_plan: '',
  academic_plan_profile: '',
  affiliation_details: '',
  teaching_hospital_details: '',
  research_policy: '',
  human_resource_plan: '',
  quality_assurance_system: '',
  governance_structure: '',
  business_plan: '',
  project_cost_analysis: '',
  facilities_student_services: '',
  admission_policy_scholarships: '',
  service_conditions: '',
  safety_security_plan: '',
  public_information_system: '',
  other_details: '',
  do_dpr_review_decision: 'Submitted',
  is_payment_complete: false,
});

const formData = ref(initialFormData());
const isSubmitting = ref(false);
const formError = ref('');

const dzongkhagOptions = [
  'Bumthang', 'Chukha', 'Dagana', 'Gasa', 'Haa', 'Lhuntse', 'Mongar', 'Paro',
  'Pemagatshel', 'Punakha', 'Samdrup Jongkhar', 'Samtse', 'Sarpang', 'Thimphu',
  'Trashigang', 'Trashiyangtse', 'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang',
];

// For Program Master Options
const programMasterOptions = ref([]);
const isLoadingProgramTypes = ref(false);
const programTypesError = ref('');

const fetchProgramMasters = async () => {
  isLoadingProgramTypes.value = true;
  programTypesError.value = '';
  try {
    const response = await apiServices.getMhpcProgramMasters();
    // Assuming the API returns data in a structure like:
    // response.data or response.data.results = [{ id: 1, code: 'D', name: 'Diploma' }, { id: 2, code: 'B', name: 'Bachelor' }, ...]
    // Adjust based on your actual API response structure
    if (response.data && Array.isArray(response.data.results)) {
        programMasterOptions.value = response.data.results;
    } else if (response.data && Array.isArray(response.data)) { // If API directly returns an array
        programMasterOptions.value = response.data;
    } else {
        programMasterOptions.value = [];
        console.warn('Unexpected program types API response structure:', response.data);
        programTypesError.value = 'Could not load program types (unexpected format).';
    }
  } catch (error) {
    console.error('Error fetching program masters:', error);
    programTypesError.value = 'Failed to load program types.';
    toast.error(programTypesError.value);
    programMasterOptions.value = []; // Clear options on error
  } finally {
    isLoadingProgramTypes.value = false;
  }
};

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    formData.value = initialFormData();
    formError.value = '';
    if (authStore.user?.cid) {
        formData.value.CID = authStore.user.cid;
    }
    // Fetch program masters when modal becomes visible
    if (programMasterOptions.value.length === 0) { // Fetch only if not already loaded
        fetchProgramMasters();
    }
  }
});

const closeModal = () => {
  emit('close');
};

const submitForm = async () => {
  formError.value = '';
  if (!formData.value.CID && authStore.user?.cid) {
    formData.value.CID = authStore.user.cid;
  } else if (!formData.value.CID) {
    formError.value = 'CID is missing. Please ensure you are logged in correctly.';
    toast.error(formError.value);
    return;
  }

  const requiredNewFields = [
    'vision_mission_strategies', 'project_scheduling_management', 'gnh_values_ict_excellence',
    'land_details', 'conceptual_master_plan', 'academic_plan_profile', 'affiliation_details',
    'teaching_hospital_details', 'research_policy', 'human_resource_plan', 'quality_assurance_system',
    'governance_structure', 'business_plan', 'project_cost_analysis', 'facilities_student_services',
    'admission_policy_scholarships', 'service_conditions', 'safety_security_plan',
    'public_information_system', 'other_details'
  ];

  for (const field of requiredNewFields) {
    // Check if formData.value[field] exists and is not just whitespace
    if (!formData.value[field] || String(formData.value[field]).trim() === '') {
        const labelElement = document.querySelector(`label[for="${field.replace(/_([a-z])/g, (g) => g[1].toUpperCase())}"]`);
        const fieldName = labelElement ? labelElement.textContent.replace(/\s*\*$/, '').trim() : field.replace(/_/g, ' ');
        formError.value = `${fieldName} is required. Please fill in all sections.`;
        toast.error(formError.value);
        return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = { ...formData.value };

    // TODO: Replace with your actual API call:
    // const response = await apiServices.createYourDprApplicationEndpoint(payload);
    console.log('Submitting DPR Application:', payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResponse = { data: { ...payload, id: Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } };

    emit('application-submitted', mockResponse.data);
    // closeModal(); // Parent will close it
  } catch (error) {
    console.error('Error submitting DPR application:', error);
    formError.value = error.response?.data?.message || error.message || 'Failed to submit application. Please try again.';
    toast.error(formError.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>