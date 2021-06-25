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
        <div>
          <label for="name_of_institution" class="block text-sm font-medium text-gray-700">Proposed Name of the College/institution *</label>
          <input type="text" v-model="formData.name_of_institution" id="name_of_institution" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <p class="mt-1 text-xs text-gray-500">Avoid using “Royal”, “National”, etc. Final name subject to approval by Registrar of Companies.</p>
        </div>

        <div>
          <label for="cid" class="block text-sm font-medium text-gray-700">Promoter's CID *</label>
          <input type="text" v-model="formData.CID" id="cid" required :placeholder="authStore.user?.cid || 'Enter CID'" disabled
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50">
        </div>

        <div>
          <label for="dpr_name" class="block text-sm font-medium text-gray-700">DPR Name / Primary Course Title *</label>
          <input type="text" v-model="formData.dpr_name" id="dpr_name" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="head_of_institution_name" class="block text-sm font-medium text-gray-700">Head of Institution Name *</label>
              <input type="text" v-model="formData.head_of_institution_name" id="head_of_institution_name" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label for="head_of_institution_email" class="block text-sm font-medium text-gray-700">Head of Institution Email *</label>
              <input type="email" v-model="formData.head_of_institution_email" id="head_of_institution_email" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
        </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700">Institution Contact No *</label>
              <input type="tel" v-model="formData.contact_no" id="contact_no" required
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">Institution Official Email Address *</label>
              <input type="email" v-model="formData.email_address" id="email_address" required
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
            <label for="address" class="block text-sm font-medium text-gray-700">Full Address *</label>
            <textarea v-model="formData.address" id="address" rows="2" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>


        <div>
          <label for="commencement_date" class="block text-sm font-medium text-gray-700">Proposed Commencement Date *</label>
          <input type="date" v-model="formData.commencement_date" id="commencement_date" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                <label for="program_type_id" class="block text-sm font-medium text-gray-700">Type of Programme *</label>
                <select v-model="formData.program_type_id" id="program_type_id" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option :value="null" disabled>Select Type</option>
                    <option v-if="isLoadingProgramTypes" :value="null" disabled>Loading types...</option>
                    <option v-else-if="programTypesError" :value="null" disabled>{{ programTypesError }}</option>
                    <option v-for="programMaster in programMasterOptions" :key="programMaster.id" :value="programMaster.id">
                        {{ programMaster.program_name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="course_duration" class="block text-sm font-medium text-gray-700">Course Duration (Months) *</label>
                <input type="number" v-model.number="formData.course_duration" id="course_duration" required min="1"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
        </div>

        <div>
          <label for="executive_summary" class="block text-sm font-medium text-gray-700">Executive Summary *</label>
          <textarea v-model="formData.executive_summary" id="executive_summary" rows="4" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <hr class="my-8 border-gray-300">
        <h4 class="text-lg font-medium text-gray-800 mb-4">Detailed Project Proposal Sections</h4>

        <div>
          <label for="vision_mission_strategies" class="block text-sm font-medium text-gray-700">Vision, Mission and Implementation Strategies *</label>
          <textarea v-model="formData.vision_mission_strategies" id="vision_mission_strategies" rows="5" required
                    placeholder="Clearly mention strategies, envisaged obstacles, and how to overcome them."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="project_scheduling" class="block text-sm font-medium text-gray-700">Project Scheduling, Implementation and Management *</label>
          <textarea v-model="formData.project_scheduling" id="project_scheduling" rows="5" required
                    placeholder="Specify timelines, major milestones, projected student numbers, etc."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="gross_national_happiness" class="block text-sm font-medium text-gray-700">Contribution to Gross National Happiness & Values *</label>
          <textarea v-model="formData.gross_national_happiness" id="gross_national_happiness" rows="5" required
                    placeholder="How the institution will contribute to GNH, instill values, promote ICT, and quest for excellence."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="land_details" class="block text-sm font-medium text-gray-700">Land Details *</label>
          <textarea v-model="formData.land_details" id="land_details" rows="3" required
                    placeholder="Details of land as required by relevant rules and regulations."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="conceptual_master_plan" class="block text-sm font-medium text-gray-700">Conceptual Master Plan *</label>
          <textarea v-model="formData.conceptual_master_plan" id="conceptual_master_plan" rows="5" required
                    placeholder="Encompass all aspects of physical infrastructure (academic, residential, auditorium, dining, parking, playfields, etc.). Note: No shift systems for multiple institutions on one premise."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="academic_plan" class="block text-sm font-medium text-gray-700">Academic Plan/Profile *</label>
          <textarea v-model="formData.academic_plan" id="academic_plan" rows="6" required
                    placeholder="Intent and purpose, academic character, justifications for programs (market trends, existing institutes), research facilities, credit transfer plans, part-time/exchange programs, internship plans, in-campus recruitment potential."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="affiliation_details" class="block text-sm font-medium text-gray-700">Affiliation Details *</label>
          <textarea v-model="formData.affiliation_details" id="affiliation_details" rows="4" required
                    placeholder="Details on affiliation with a recognized university. Approach university for affiliation in the same academic year permission is granted."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="teaching_hospital_details" class="block text-sm font-medium text-gray-700">Teaching Hospital Details (Mandatory for Medical/Health courses) *</label>
          <textarea v-model="formData.teaching_hospital_details" id="teaching_hospital_details" rows="4" required
                    placeholder="Identification of teaching hospital for clinical skills. Cannot be shared for same program. Signed agreements with MoH/University for clinical facilities."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="research_policy" class="block text-sm font-medium text-gray-700">Research Policy *</label>
          <textarea v-model="formData.research_policy" id="research_policy" rows="4" required
                    placeholder="Policy to promote research activities by faculty, students, and the institution."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="human_resource" class="block text-sm font-medium text-gray-700">Human Resource Plan *</label>
          <textarea v-model="formData.human_resource" id="human_resource" rows="5" required
                    placeholder="Faculty recruitment (teaching/non-teaching), relevant qualifications (at least one level higher than course taught), research/publication/consultancy encouragement, number required, future expansion, expatriate personnel."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="quality_assurance" class="block text-sm font-medium text-gray-700">Quality Assurance System *</label>
          <textarea v-model="formData.quality_assurance" id="quality_assurance" rows="5" required
                    placeholder="Internal QA mechanism, provision for external QA. Evidence of clear description of academic quality, standards, policies, expectations, and student achievement."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="governance_structure" class="block text-sm font-medium text-gray-700">Governance Structure *</label>
          <textarea v-model="formData.governance_structure" id="governance_structure" rows="5" required
                    placeholder="Proposed governance policy, organizational structure (Board of Directors, committees, TORs), reporting arrangements, delegations, inter-relationships. Section on planning, stakeholder coordination, resource mobilization."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="business_plan" class="block text-sm font-medium text-gray-700">Business Plan *</label>
          <textarea v-model="formData.business_plan" id="business_plan" rows="5" required
                    placeholder="Financial viability, promoter's capacity to sustain operations, financial indicators, source of funds (equity/debt), detailed project costing, financial analysis, projected tuition levels. Management and administrative systems, policies, procedures timeline."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="project_cost_analysis" class="block text-sm font-medium text-gray-700">Project Cost and Analysis *</label>
          <textarea v-model="formData.project_cost_analysis" id="project_cost_analysis" rows="5" required
                    placeholder="Detailed project costing (land, site dev, civil construction, infrastructure, equipment, pollution control, technical know-how, pre-operating expenses, contingencies, FX if any). Fixed investment and working capital."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="facilities_student_services" class="block text-sm font-medium text-gray-700">Facilities and Student Services *</label>
          <textarea v-model="formData.facilities_student_services" id="facilities_student_services" rows="5" required
                    placeholder="Mechanisms for enhancing student learning outcomes: quality facilities, inclusive practices, learning/information resources (library, infirmary, ICT), support services (cafeteria, transport, counseling)."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="admission_policy" class="block text-sm font-medium text-gray-700">Admission Policy and Scholarships *</label>
          <textarea v-model="formData.admission_policy" id="admission_policy" rows="4" required
                    placeholder="Clear policy on admission, eligibility criteria, selection procedures, fee structure, scholarship provisions."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="service_conditions" class="block text-sm font-medium text-gray-700">Service Conditions *</label>
          <textarea v-model="formData.service_conditions" id="service_conditions" rows="5" required
                    placeholder="Clear policies on recruitment, professional development, remuneration (PF, retirement benefits), leave, staff welfare, student representation, other support services."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="safety_security" class="block text-sm font-medium text-gray-700">Safety and Security Plan *</label>
          <textarea v-model="formData.safety_security" id="safety_security" rows="4" required
                    placeholder="Mechanisms for staff and student safety/security. Provisions for course continuation by learners in case of unforeseen college closure."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="public_information_system" class="block text-sm font-medium text-gray-700">Public Information System Plan *</label>
          <textarea v-model="formData.public_information_system" id="public_information_system" rows="4" required
                    placeholder="Plan to create/maintain a system for transparency (student fees, licensing/accreditation status, course details, etc.)."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label for="other_details_dpr" class="block text-sm font-medium text-gray-700">Others *</label>
          <textarea v-model="formData.other_details_dpr" id="other_details_dpr" rows="4" required
                    placeholder="Issues like market analysis, ownership, sustainability, enrolment projection (beginning & onwards), approvals from respective organizations, etc., supported by justifications."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>

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
import apiServices from '@/services/services';

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits(['close', 'application-submitted']);

const authStore = useAuthStore();
const toast = useToast();

const initialFormData = () => ({
  name_of_institution: '',
  CID: authStore.user?.cid || '',
  full_name: authStore.user?.first_name ? `${authStore.user.first_name} ${authStore.user.last_name || ''}`.trim() : '', // Promoter's full name from auth user
  gender: authStore.user?.gender || '', // Promoter's gender from auth user, ensure your User model has this
  // Promoter's contact_no and email_address are usually taken from their user profile,
  // The 'contact_no' and 'email_address' below are for the *institution*

  // Institution Details
  contact_no: '', // Institution contact
  email_address: '', // Institution email
  dzongkhag: '',
  gewog: '',
  village: '',
  address: '',
  // website: '', // Optional

  // Head of Institution
  head_of_institution_name: '',
  head_of_institution_gender: '', // Add a select if needed: choices=GenderChoices.choices
  head_of_institution_phone_number: '',
  head_of_institution_email: '',

  // DPR Fields
  dpr_name: '',
  executive_summary: '',
  commencement_date: '',
  program_type_id: null,
  course_duration: null,

  // DPR Text Sections (matching Django model field names)
  vision_mission_strategies: '',
  project_scheduling: '',
  gross_national_happiness: '',
  land_details: '',
  conceptual_master_plan: '',
  academic_plan: '',
  affiliation_details: '',
  teaching_hospital_details: '',
  research_policy: '',
  human_resource: '',
  quality_assurance: '',
  governance_structure: '',
  business_plan: '',
  project_cost_analysis: '',
  facilities_student_services: '',
  admission_policy: '',
  service_conditions: '',
  safety_security: '',
  public_information_system: '',
  other_details_dpr: '',

  remarks: '', // Applicant's overall remarks if you have this field in form
  declaration: false, // If you have a declaration checkbox
});

const formData = ref(initialFormData());
const isSubmitting = ref(false);
const formError = ref('');

const dzongkhagOptions = [
  'Bumthang', 'Chukha', 'Dagana', 'Gasa', 'Haa', 'Lhuntse', 'Mongar', 'Paro',
  'Pemagatshel', 'Punakha', 'Samdrup Jongkhar', 'Samtse', 'Sarpang', 'Thimphu',
  'Trashigang', 'Trashiyangtse', 'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang',
];

const programMasterOptions = ref([]);
const isLoadingProgramTypes = ref(false);
const programTypesError = ref('');

const fetchProgramMasters = async () => {
  isLoadingProgramTypes.value = true;
  programTypesError.value = '';
  try {
    const response = await apiServices.getMhpcProgramMasters();
    if (response.data && (Array.isArray(response.data.results) || Array.isArray(response.data))) {
        const sourceArray = Array.isArray(response.data.results) ? response.data.results : response.data;
        programMasterOptions.value = sourceArray.map(pm => ({
            id: pm.id,
            program_name: pm.name || pm.program_name // Adjust based on your ProgramMaster API response
        }));
    } else {
        programMasterOptions.value = [];
        console.warn('Unexpected program types API response structure:', response.data);
        programTypesError.value = 'Could not load program types (format issue).';
    }
  } catch (error) {
    console.error('Error fetching program masters:', error);
    programTypesError.value = 'Failed to load program types.';
    toast.error(programTypesError.value);
    programMasterOptions.value = [];
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
        formData.value.full_name = authStore.user?.first_name ? `${authStore.user.first_name} ${authStore.user.last_name || ''}`.trim() : '';
        // formData.value.gender = authStore.user?.gender || ''; // If your user model has gender
    }
    if (programMasterOptions.value.length === 0 && !isLoadingProgramTypes.value) {
        fetchProgramMasters();
    }
  }
});

const closeModal = () => {
  emit('close');
};

const submitForm = async () => {
  formError.value = '';
  if (!formData.value.CID) {
    formError.value = 'Promoter CID is missing. Please ensure you are logged in correctly.';
    toast.error(formError.value);
    return;
  }

  const criticalFields = {
    name_of_institution: "Proposed Name of the College/institution",
    dpr_name: "DPR Name / Primary Course Title",
    head_of_institution_name: "Head of Institution Name",
    head_of_institution_email: "Head of Institution Email",
    contact_no: "Institution Contact No",
    email_address: "Institution Official Email Address",
    dzongkhag: "Proposed Dzongkhag",
    address: "Full Address",
    commencement_date: "Proposed Commencement Date",
    program_type_id: "Type of Programme",
    course_duration: "Course Duration",
    executive_summary: "Executive Summary",
    vision_mission_strategies: "Vision, Mission and Implementation Strategies",
    project_scheduling: "Project Scheduling, Implementation and Management",
    gross_national_happiness: "Contribution to Gross National Happiness & Values",
    land_details: "Land Details",
    conceptual_master_plan: "Conceptual Master Plan",
    academic_plan: "Academic Plan/Profile",
    affiliation_details: "Affiliation Details",
    teaching_hospital_details: "Teaching Hospital Details",
    research_policy: "Research Policy",
    human_resource: "Human Resource Plan",
    quality_assurance: "Quality Assurance System",
    governance_structure: "Governance Structure",
    business_plan: "Business Plan",
    project_cost_analysis: "Project Cost and Analysis",
    facilities_student_services: "Facilities and Student Services",
    admission_policy: "Admission Policy and Scholarships",
    service_conditions: "Service Conditions",
    safety_security: "Safety and Security Plan",
    public_information_system: "Public Information System Plan",
    other_details_dpr: "Others",
  };

  for (const [fieldKey, fieldName] of Object.entries(criticalFields)) {
    if (!formData.value[fieldKey] || (typeof formData.value[fieldKey] === 'string' && String(formData.value[fieldKey]).trim() === '')) {
      formError.value = `${fieldName} is required.`;
      toast.error(formError.value);
      // Scroll to the field if possible
      const fieldElement = document.getElementById(fieldKey);
      if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          fieldElement.focus();
      }
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = {
        CID: formData.value.CID,
        full_name: formData.value.full_name, // Promoter's full name
        gender: formData.value.gender, // Promoter's gender (ensure this exists on user or is collected)
        // Promoter's contact_no & email_address are usually part of the User model,
        // and 'applicant_user' ForeignKey links them.
        // So, no need to send them separately if backend uses request.user.

        name_of_institution: formData.value.name_of_institution,
        country: 'BT', // Defaulting country as per your model
        gewog: formData.value.gewog,
        dzongkhag: formData.value.dzongkhag,
        village: formData.value.village,
        address: formData.value.address,
        // website: formData.value.website, // Optional

        program_type: formData.value.program_type_id, // Send the ID

        head_of_institution_name: formData.value.head_of_institution_name,
        head_of_institution_gender: formData.value.head_of_institution_gender, // Ensure choices match backend
        head_of_institution_phone_number: formData.value.head_of_institution_phone_number,
        head_of_institution_email: formData.value.head_of_institution_email,

        contact_no: formData.value.contact_no, // Institution contact
        email_address: formData.value.email_address, // Institution email

        dpr_name: formData.value.dpr_name,
        executive_summary: formData.value.executive_summary,
        // commencement_date: formData.value.commencement_date, // Field missing in model

        vision_mission_strategies: formData.value.vision_mission_strategies,
        project_scheduling: formData.value.project_scheduling,
        gross_national_happiness: formData.value.gross_national_happiness,
        land_details: formData.value.land_details,
        conceptual_master_plan: formData.value.conceptual_master_plan,
        academic_plan: formData.value.academic_plan,
        affiliation_details: formData.value.affiliation_details,
        teaching_hospital_details: formData.value.teaching_hospital_details,
        research_policy: formData.value.research_policy,
        human_resource: formData.value.human_resource,
        quality_assurance: formData.value.quality_assurance,
        governance_structure: formData.value.governance_structure,
        business_plan: formData.value.business_plan,
        project_cost_analysis: formData.value.project_cost_analysis,
        facilities_student_services: formData.value.facilities_student_services,
        admission_policy: formData.value.admission_policy,
        service_conditions: formData.value.service_conditions,
        safety_security: formData.value.safety_security,
        public_information_system: formData.value.public_information_system,
        other_details_dpr: formData.value.other_details_dpr,

        // remarks: formData.value.remarks, // If collected
        // declaration: formData.value.declaration, // If collected
    };
    // Add course_duration if it's part of the Institute model directly or related model
    // For now, assuming it's not directly on Institute, but you might want to send it
    // if your ProgramMaster or another related model stores it, or if your API handles it.
    // If it is on Institute, add: course_duration: formData.value.course_duration,

    // Remove commencement_date if not in model, otherwise add:
     payload.commencement_date = formData.value.commencement_date;


    const response = await apiServices.createMhpcInstitute(payload);
    emit('application-submitted', response.data);
  } catch (error) {
    console.error('Error submitting DPR application:', error);
    if (error.response && error.response.data) {
        const errors = error.response.data;
        let errorMessage = "Submission failed: ";
        if (typeof errors === 'object' && errors !== null) {
            const fieldErrorMessages = Object.entries(errors).map(([field, messages]) => {
                const messageText = Array.isArray(messages) ? messages.join(' ') : String(messages);
                return `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${messageText}`;
            });
            errorMessage += fieldErrorMessages.join('; ');
        } else {
            errorMessage += String(errors.detail || errors.message || 'Please check your input.');
        }
        formError.value = errorMessage;
    } else {
        formError.value = error.message || 'An unknown error occurred during submission.';
    }
    toast.error(formError.value);
  } finally {
    isSubmitting.value = false;
  }
};
</script>