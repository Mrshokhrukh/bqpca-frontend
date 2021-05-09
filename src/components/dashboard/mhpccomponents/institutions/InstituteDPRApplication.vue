<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Detailed Project Report (DPR)"
      subtitle="Complete and submit your report for establishing a Medical and Health Educational Institution."
      :show-actions="false"
    />

    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] mt-8">
      <Loader class="animate-spin text-indigo-600 w-12 h-12" />
      <p class="mt-4 text-lg font-medium text-gray-700">Loading Application Status & DPR Data...</p>
    </div>

    <div v-else-if="apiError" class="mt-8 text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-sm">
        <p class="text-red-700 text-lg font-medium">{{ initialErrorMsg || 'An error occurred loading DPR application data.' }}</p>
        <p class="text-red-600 text-sm mt-2">Please try refreshing the page. If the problem persists, contact support.</p>
        <p v-if="debugErrorDetails" class="text-xs text-red-400 mt-1">Debug: {{ debugErrorDetails }}</p>
    </div>

    <!-- EOI Status Messages -->
    <div v-else-if="reviewDecision === 'Regretted'" class="max-w-3xl mx-auto mt-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 shadow-md" role="alert">
        <div class="flex items-start">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-lg text-red-800">EOI Application Regretted</p>
            <p class="mt-2 text-red-700">
              Your Expression of Interest (EOI) application was not approved. You cannot submit a
              Detailed Project Report (DPR) at this time.
            </p>
            <p v-if="eoiRejectionReason" class="mt-1 text-sm text-red-600">
              Reason: {{ eoiRejectionReason }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="reviewDecision === 'NotSubmitted'" class="max-w-3xl mx-auto mt-8">
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md" role="alert">
        <div class="flex items-start">
          <InformationCircleIcon class="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-lg text-blue-800">No EOI Submitted or Found</p>
            <p class="mt-2 text-blue-700">
              No matching Expression of Interest (EOI) application was found for your account (CID: {{ userCIDForDisplay }}).
              Please submit an EOI before proceeding with a DPR.
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- End EOI Status Messages -->


    <!-- DPR Form (shown if EOI is Approved or PendingDPR) -->
    <form
      v-if="!isLoading && !apiError && (reviewDecision === 'Approved' || reviewDecision === 'PendingDPR')"
      @submit.prevent="handleSubmit"
      class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden mt-8"
    >
      <div v-if="reviewDecision === 'PendingDPR'" class="p-4 bg-yellow-50 border-b border-yellow-200 text-center">
          <div class="flex items-center justify-center">
            <ClockIcon class="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
            <p class="text-sm text-yellow-800 font-medium">
              Your EOI application is currently under review. You can prepare your DPR details below and save as a draft.
              Submission will be enabled once your EOI is approved.
            </p>
          </div>
      </div>

      <div
        v-for="(section, sectionIndex) in formSections"
        :key="section.id"
        class="form-section"
      >
        <div
          :class="[
            'section-header',
            sectionIndex === 0 && reviewDecision !== 'PendingDPR' ? '' : 'border-t border-gray-200',
          ]"
        >
          <component
            :is="section.icon"
            class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ section.title }}</h3>
            <p v-if="section.description" class="mt-1 text-xs text-gray-500">
              {{ section.description }}
            </p>
          </div>
        </div>

        <div class="section-content">
          <div
            v-for="field in section.fields"
            :key="field.id"
            :class="field.fullWidth ? 'md:col-span-2' : ''"
          >
            <label
              :for="field.id"
              class="form-label"
              :class="{ 'required-label': field.required && reviewDecision === 'Approved' }"
            >
              {{ field.label }}
            </label>
            <input
              v-if="['text', 'email', 'number'].includes(field.type)"
              :type="field.type"
              :id="field.id"
              :value="field.modelKey ? formData[field.modelKey] : field.staticModel"
              @input="field.modelKey ? (formData[field.modelKey] = $event.target.value) : null"
              class="form-input"
              :placeholder="field.placeholder"
              :required="field.required && reviewDecision === 'Approved'"
              :disabled="field.disabled || isSubmitting"
            />
            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.id"
              v-model="formData[field.modelKey]"
              :rows="field.rows || 4"
              class="form-textarea"
              :placeholder="field.placeholder"
              :required="field.required && reviewDecision === 'Approved'"
              :disabled="isSubmitting"
            ></textarea>
            <div v-else-if="field.type === 'file'" class="mt-1">
              <input
                :type="field.type"
                :id="field.id"
                :ref="el => { if (el) fileInputs[field.id] = el }"
                @change="handleFileUpload(field.modelKey, $event)"
                :accept="field.accept || '.pdf,.doc,.docx,.jpg,.png'"
                class="form-file-input"
                :disabled="isSubmitting"
              />
              <div v-if="formData[field.modelKey + '_filename'] || (typeof formData[field.modelKey] === 'string' && formData[field.modelKey])" class="mt-2 text-sm">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                    <p class="text-gray-700 truncate flex-grow">
                        <PaperClipIcon class="w-4 h-4 inline mr-1.5 text-gray-400" />
                        <span class="font-medium">Current:</span>
                        <a v-if="typeof formData[field.modelKey] === 'string' && formData[field.modelKey].startsWith('http')"
                           :href="formData[field.modelKey]" target="_blank" class="text-blue-600 hover:underline">
                            {{ getFileName(formData[field.modelKey]) }}
                        </a>
                        <span v-else>
                            {{ formData[field.modelKey + '_filename'] || getFileName(formData[field.modelKey]) }}
                        </span>
                    </p>
                    <button
                        type="button"
                        @click="clearFile(field.modelKey, field.id)"
                        class="ml-2 text-red-600 hover:text-red-800 font-medium text-xs"
                        :disabled="isSubmitting"
                    >
                        Clear
                    </button>
                </div>
              </div>
            </div>
            <p v-if="field.hint" class="text-gray-500 text-xs mt-1.5">
              <em>{{ field.hint }}</em>
            </p>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            @click="handleSaveDraft"
            class="btn btn-outline w-full sm:w-auto"
            :disabled="isSubmitting || reviewDecision === 'Regretted'"
          >
            <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            class="btn btn-primary w-full sm:w-auto"
            :disabled="isSubmitting || reviewDecision !== 'Approved'"
          >
            <PaperAirplaneIcon
              v-if="!isSubmitting"
              class="w-5 h-5 mr-2 transform -rotate-45"
            />
            <Loader v-else class="animate-spin h-5 w-5 mr-2 text-white" />
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
         <p v-if="formError" class="mt-4 text-sm text-red-600 text-center">{{ formError }}</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services' // Assuming services.js is now the correct path
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue' // Adjust path
import { Loader } from 'lucide-vue-next' // Assuming lucide is used

import {
    BuildingOfficeIcon, DocumentTextIcon, LightBulbIcon, CalendarDaysIcon, SparklesIcon, MapPinIcon,
    PuzzlePieceIcon, AcademicCapIcon, LinkIcon, HeartIcon, BeakerIcon, UsersIcon, ShieldCheckIcon,
    CogIcon, BriefcaseIcon, ChartBarIcon, HomeModernIcon, TicketIcon, UserGroupIcon, LockClosedIcon,
    InformationCircleIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon, ClockIcon,
    ArrowDownTrayIcon, PaperAirplaneIcon, PaperClipIcon,
} from '@heroicons/vue/24/outline' // Ensure path is correct or you use these

const router = useRouter()
const toast = useToast()

const instituteName = ref('')
const isSubmitting = ref(false)
const instituteId = ref(null)
const reviewDecision = ref('') // Possible values: 'Approved', 'Regretted', 'PendingDPR', 'NotSubmitted'
const eoiRejectionReason = ref('')
const isLoading = ref(true)
const apiError = ref(false)
const initialErrorMsg = ref('')
const debugErrorDetails = ref(''); // For more detailed error messages in UI if needed
const userCIDForDisplay = ref(''); // To show user's CID in "NotSubmitted" message
const formError = ref('');


const fileInputs = ref({}); // Changed to object for dynamic refs by field.id

const formData = ref({
    dpr_name: '', // From EOI, if available, else user input
    executive_summary: '',
    institute_eoi_supporting_documents: null, // File object or URL string
    institute_eoi_supporting_documents_filename: '', // For displaying name of new/existing file
    institute_dpr_remarks: '',
    // Desk Officer fields - likely read-only or not for user input on this form
    // do_dpr_review_report: '', // Text area
    // do_dpr_review_summary: '', // Text area
    do_dpr_report: null, // File object or URL string for the MAIN DPR document
    do_dpr_report_filename: '', // For displaying name
    // --- Core DPR Sections ---
    vision_mission_strategies: '',
    project_scheduling: '',
    gross_national_happiness: '',
    land_details: '',
    conceptual_master_plan: '',
    academic_plan: '',
    affiliation_details: '',
    teaching_hospital: '',
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
    other_details: '',
})

const formSections = computed(() => [
    { id: 'collegeDetails', title: '1. College/Institution Details', description: 'Details of the proposed institution.', icon: BuildingOfficeIcon, fields: [ { id: 'institutionNameDisplay', label: 'Proposed Name (from EOI):', staticModel: instituteName.value || 'Loading...', type: 'text', disabled: true, placeholder: 'Institution Name', fullWidth: true } ] },
    { id: 'dprDetails', title: '2. DPR Specifics', description: 'Core details and documents for this DPR.', icon: DocumentTextIcon, fields: [
        { id: 'dprNameInput', label: 'DPR Proposed Name:', modelKey: 'dpr_name', type: 'text', required: true, placeholder: 'e.g., DPR for Establishment of [Institution Name]', fullWidth: true },
        { id: 'eoiDocsFile', label: 'EOI Supporting Documents (Optional Update):', modelKey: 'institute_eoi_supporting_documents', type: 'file', accept: '.pdf', hint: 'Upload if you have new/updated EOI documents. Max 5MB.' },
        // { id: 'dprRemarksInput', label: 'Institute DPR Remarks:', modelKey: 'institute_dpr_remarks', type: 'textarea', placeholder: 'Any remarks regarding this DPR submission.', fullWidth: true },
    ]},
    { id: 'visionMission', title: '3. Vision, Mission, and Implementation Strategies', icon: LightBulbIcon, fields: [ { id: 'visionMissionText', label: 'Vision, Mission & Strategies:', modelKey: 'vision_mission_strategies', type: 'textarea', rows: 5, required: true, placeholder: "Describe...", fullWidth: true } ] },
    { id: 'projectScheduling', title: '4. Project Scheduling, Implementation, and Management', icon: CalendarDaysIcon, fields: [ { id: 'projectSchedulingText', label: 'Project Schedule & Management:', modelKey: 'project_scheduling', type: 'textarea', rows: 5, required: true, placeholder: 'Provide a detailed project schedule...', fullWidth: true } ] },
    { id: 'gnhValues', title: '5. Values of Gross National Happiness', icon: SparklesIcon, fields: [ { id: 'gnhText', label: 'Contribution to GNH:', modelKey: 'gross_national_happiness', type: 'textarea', rows: 5, required: true, placeholder: 'Describe how...', fullWidth: true } ] },
    { id: 'landDetails', title: '6. Land', icon: MapPinIcon, fields: [ { id: 'landDetailsText', label: 'Land Details:', modelKey: 'land_details', type: 'textarea', placeholder: 'Provide details as required...', fullWidth: true, required: true } ] },
    { id: 'masterPlan', title: '7. Conceptual Master Plan', icon: PuzzlePieceIcon, fields: [ { id: 'masterPlanText', label: 'Master Plan Description:', modelKey: 'conceptual_master_plan', type: 'textarea', rows: 5, required: true, placeholder: 'Describe the conceptual master plan...', fullWidth: true } ] },
    { id: 'academicPlan', title: '8. Academic Plan/Profile', icon: AcademicCapIcon, fields: [ { id: 'academicPlanText', label: 'Academic Plan:', modelKey: 'academic_plan', type: 'textarea', rows: 5, required: true, placeholder: 'Describe the intent and purpose...', fullWidth: true } ] },
    { id: 'affiliation', title: '9. Affiliation', icon: LinkIcon, fields: [ { id: 'affiliationText', label: 'Affiliation Details:', modelKey: 'affiliation_details', type: 'textarea', placeholder: 'Provide details on the affiliation...', fullWidth: true } ] },
    { id: 'teachingHospital', title: '10. Teaching Hospital', icon: HeartIcon, fields: [ { id: 'teachingHospitalText', label: 'Teaching Hospital Details:', modelKey: 'teaching_hospital', type: 'textarea', placeholder: 'Provide details on the teaching hospital...', fullWidth: true } ] },
    { id: 'researchPolicy', title: '11. Research Policy', icon: BeakerIcon, fields: [ { id: 'researchPolicyText', label: 'Research Policy:', modelKey: 'research_policy', type: 'textarea', placeholder: 'Outline the research policy...', fullWidth: true } ] },
    { id: 'humanResource', title: '12. Human Resource', icon: UsersIcon, fields: [ { id: 'hrText', label: 'Human Resource Plan:', modelKey: 'human_resource', type: 'textarea', required: true, placeholder: 'Describe the human resource plan...', fullWidth: true } ] },
    { id: 'qualityAssurance', title: '13. Quality Assurance System', icon: ShieldCheckIcon, fields: [ { id: 'qaText', label: 'Quality Assurance System:', modelKey: 'quality_assurance', type: 'textarea', required: true, placeholder: 'Provide details on the quality assurance system...', fullWidth: true } ] },
    { id: 'governanceStructure', title: '14. Governance Structure', icon: CogIcon, fields: [ { id: 'governanceText', label: 'Governance Structure:', modelKey: 'governance_structure', type: 'textarea', required: true, placeholder: 'Describe the governance structure...', fullWidth: true } ] },
    { id: 'businessPlan', title: '15. Business Plan', icon: BriefcaseIcon, fields: [ { id: 'businessPlanText', label: 'Business Plan:', modelKey: 'business_plan', type: 'textarea', required: true, placeholder: 'Provide details on the business plan...', fullWidth: true } ] },
    { id: 'projectCost', title: '16. Project Cost and Analysis', icon: ChartBarIcon, fields: [ { id: 'projectCostText', label: 'Project Cost & Analysis:', modelKey: 'project_cost_analysis', type: 'textarea', required: true, placeholder: 'Provide a detailed project cost breakdown...', fullWidth: true } ] },
    { id: 'facilitiesServices', title: '17. Facilities and Student Services', icon: HomeModernIcon, fields: [ { id: 'facilitiesText', label: 'Facilities & Student Services:', modelKey: 'facilities_student_services', type: 'textarea', placeholder: 'Describe available facilities...', fullWidth: true } ] },
    { id: 'admissionPolicy', title: '18. Admission Policy and Scholarships', icon: TicketIcon, fields: [ { id: 'admissionPolicyText', label: 'Admission Policy & Scholarships:', modelKey: 'admission_policy', type: 'textarea', required: true, placeholder: 'Detail the admission policy...', fullWidth: true } ] },
    { id: 'serviceConditions', title: '19. Service Conditions', icon: UserGroupIcon, fields: [ { id: 'serviceConditionsText', label: 'Service Conditions:', modelKey: 'service_conditions', type: 'textarea', placeholder: 'Outline the service conditions...', fullWidth: true } ] },
    { id: 'safetySecurity', title: '20. Safety and Security', icon: LockClosedIcon, fields: [ { id: 'safetyText', label: 'Safety & Security Measures:', modelKey: 'safety_security', type: 'textarea', placeholder: 'Describe safety and security measures...', fullWidth: true } ] },
    { id: 'publicInfoSystem', title: '21. Public Information System', icon: InformationCircleIcon, fields: [ { id: 'publicInfoText', label: 'Public Information System:', modelKey: 'public_information_system', type: 'textarea', placeholder: 'Describe the system for providing public information...', fullWidth: true } ] },
    { id: 'otherDetails', title: '22. Other Relevant Information', description: 'Attach your primary DPR document here. Other details can be noted below.', icon: QuestionMarkCircleIcon, fields: [
        { id: 'mainDprReportFile', label: 'Main DPR Document (Required for Submission):', modelKey: 'do_dpr_report', type: 'file', accept: '.pdf', hint: 'Upload your main DPR document. Max 10MB.', required: true },
        { id: 'otherDetailsText', label: 'Other Narrative Details:', modelKey: 'other_details', type: 'textarea', placeholder: 'Include any other details or documents pertinent to the DPR not covered elsewhere.', fullWidth: true }
    ]},
])

onMounted(async () => {
    isLoading.value = true
    apiError.value = false
    initialErrorMsg.value = ''
    debugErrorDetails.value = '';

    const userString = localStorage.getItem('user')
    if (!userString) {
        initialErrorMsg.value = 'User session not found. Please log in again.'
        apiError.value = true; isLoading.value = false; toast.error(initialErrorMsg.value); router.push('/login');
        return
    }

    let userObject
    try {
        userObject = JSON.parse(userString)
    } catch (error) {
        initialErrorMsg.value = 'Invalid user session data. Please log in again.';
        debugErrorDetails.value = `Error parsing user JSON: ${error.message}`;
        apiError.value = true; isLoading.value = false; toast.error(initialErrorMsg.value);
        return
    }

    if (!userObject?.cid) {
        initialErrorMsg.value = 'User CID not found in session data. Cannot proceed.';
        apiError.value = true; isLoading.value = false; toast.error(initialErrorMsg.value);
        return
    }
    const userCID = userObject.cid
    userCIDForDisplay.value = userCID; // For display purposes

    try {
        console.log(`Fetching institutes for CID: ${userCID}`);
        const response = await apiService.getMhpcInstitutes({ params: { CID: userCID } })
        console.log('Initial institute list response:', response);

        const institutes = response.data?.results || (Array.isArray(response.data) ? response.data : []);

        if (!Array.isArray(institutes) || institutes.length === 0) {
            console.log('No institutes found for this CID. Setting reviewDecision to NotSubmitted.');
            reviewDecision.value = 'NotSubmitted'
            isLoading.value = false;
            return;
        }

        const matchedInstitute = institutes[0];

        if (!matchedInstitute || !matchedInstitute.id) {
            console.log('Matched institute is invalid or missing ID. Setting reviewDecision to NotSubmitted.');
            reviewDecision.value = 'NotSubmitted'
            initialErrorMsg.value = 'Could not identify a valid EOI application for your account.';
            apiError.value = true;
            isLoading.value = false;
            return
        }

        instituteId.value = matchedInstitute.id
        console.log(`Institute ID found and set in onMounted: ${instituteId.value}`); // DEBUG
        instituteName.value = matchedInstitute.name_of_institution || 'N/A'
        eoiRejectionReason.value = matchedInstitute.reason_if_rejected || ''

        if (matchedInstitute.review_decision === 'Approved') {
            reviewDecision.value = 'Approved'
        } else if (matchedInstitute.review_decision === 'Regretted') {
            reviewDecision.value = 'Regretted'
        } else if (matchedInstitute.review_decision === 'Pending') {
            reviewDecision.value = 'PendingDPR'
        } else {
            console.warn(`Unexpected EOI review_decision: ${matchedInstitute.review_decision}. Defaulting to NotSubmitted or error.`);
            reviewDecision.value = 'NotSubmitted';
            initialErrorMsg.value = `Your EOI application has an unclear status (${matchedInstitute.review_decision || 'Unknown'}). Cannot proceed with DPR.`;
        }

        console.log(`EOI review decision set to: ${reviewDecision.value}`);

        if (reviewDecision.value === 'Approved' || reviewDecision.value === 'PendingDPR') {
            console.log('EOI status allows fetching/editing DPR. Calling fetchDprData...');
            await fetchDprData();
        }

    } catch (error) {
        console.error('Error during initial EOI/DPR status check:', error);
        initialErrorMsg.value = 'Failed to load your EOI/DPR application status.';
        if (error.response) {
            debugErrorDetails.value = `Server error: ${error.response.status} - ${JSON.stringify(error.response.data?.detail || error.response.data)}`;
            initialErrorMsg.value += ` Details: ${error.response.data?.detail || 'Server error'}`;
        } else {
            debugErrorDetails.value = `Network or client-side error: ${error.message}`;
        }
        apiError.value = true;
        toast.error(initialErrorMsg.value, {timeout: 7000});
    } finally {
        isLoading.value = false;
    }
})

const fetchDprData = async () => {
    console.log(`fetchDprData called with instituteId: ${instituteId.value}`); // DEBUG
    if (!instituteId.value) {
        console.warn('fetchDprData called without instituteId. Aborting.');
        toast.error('Cannot load DPR data: Institute identifier is missing.');
        apiError.value = true;
        initialErrorMsg.value = 'Failed to identify the institute for loading DPR data.';
        return;
    }

    console.log(`fetchDprData: Fetching DPR details for institute ID: ${instituteId.value}`);
    try {
        const response = await apiService.getMhpcInstitute(instituteId.value);
        console.log('fetchDprData: Response from getMhpcInstitute:', response);
        if (response.data) {
            const dprData = response.data;
            Object.keys(formData.value).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(dprData, key)) {
                    if (key === 'institute_eoi_supporting_documents' || key === 'do_dpr_report') {
                        if (typeof dprData[key] === 'string' && dprData[key]) {
                            formData.value[key] = dprData[key];
                            formData.value[key + '_filename'] = getFileName(dprData[key]);
                        } else {
                            formData.value[key] = null;
                            formData.value[key + '_filename'] = '';
                        }
                    } else if (!key.endsWith('_filename')) {
                        formData.value[key] = dprData[key] === null ? '' : dprData[key];
                    }
                }
            });
            if (dprData.name_of_institution) {
                instituteName.value = dprData.name_of_institution;
            }
            if (Object.keys(dprData).some(k => Object.hasOwn(formData.value, k) && dprData[k] !== null && dprData[k] !== '')) {
              toast.info('Loaded existing DPR data draft.', {timeout: 2000});
            } else {
              toast.info('No DPR data to load. Ready for new entry.', {timeout: 2000});
            }
        } else {
          console.warn('fetchDprData: No data in response for getMhpcInstitute, though request was successful.');
        }
    } catch (error) {
        console.error(`Error fetching existing DPR data for institute ID ${instituteId.value}:`, error);
        if (error.response && error.response.status === 404) {
            toast.info('No existing DPR data found for this EOI. You can start a new DPR draft.', {timeout: 4000});
            debugErrorDetails.value = `404 Not Found when fetching DPR detail for ID ${instituteId.value}. This is okay if it's a new DPR. Detail: ${JSON.stringify(error.response.data)}`;
        } else {
            const detail = error.response?.data?.detail || 'Could not load existing DPR data draft.';
            toast.error(detail, {timeout: 5000});
            initialErrorMsg.value = `Error loading DPR draft: ${detail}`;
            debugErrorDetails.value = `Error fetching DPR detail: ${error.message}. Response: ${JSON.stringify(error.response?.data)}`;
            // Consider not setting apiError to true if EOI is approved to allow new DPR submission
            // apiError.value = true;
        }
    }
}

const getFileName = (fileData) => {
    if (fileData instanceof File) {
        return fileData.name;
    }
    if (typeof fileData === 'string' && fileData.trim() !== '') {
        try {
            if (fileData.startsWith('http://') || fileData.startsWith('https://')) {
                const url = new URL(fileData);
                const pathname = url.pathname;
                return decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1));
            } else {
                return decodeURIComponent(fileData.substring(fileData.lastIndexOf('/') + 1));
            }
        } catch (e) {
            console.warn('Error parsing file URL/path:', fileData, e);
            return decodeURIComponent(fileData.substring(fileData.lastIndexOf('/') + 1));
        }
    }
    return '';
}

const handleFileUpload = (modelKey, event) => {
    const file = event.target.files[0];
    if (file) {
        if (modelKey === 'do_dpr_report' || modelKey === 'institute_eoi_supporting_documents') {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload PDF files only for DPR and EOI documents.');
                event.target.value = '';
                return;
            }
        }
        if (file.size > 5 * 1024 * 1024 && (modelKey === 'institute_eoi_supporting_documents')) {
            toast.error('EOI document file size should not exceed 5MB.');
            event.target.value = '';
            return;
        }
        if (file.size > 10 * 1024 * 1024 && (modelKey === 'do_dpr_report')) {
            toast.error('Main DPR document file size should not exceed 10MB.');
            event.target.value = '';
            return;
        }

        formData.value[modelKey] = file;
        formData.value[modelKey + '_filename'] = file.name;
    }
}

const clearFile = (modelKey, inputId) => {
    formData.value[modelKey] = null;
    formData.value[modelKey + '_filename'] = '';

    if (fileInputs.value[inputId]) {
      fileInputs.value[inputId].value = '';
    }
}


const prepareSubmitData = () => {
    const submitData = new FormData();
    console.log('Preparing data for submission (raw formData.value):', JSON.parse(JSON.stringify(formData.value)));

    Object.keys(formData.value).forEach((key) => {
        if (key.endsWith('_filename')) return;

        const value = formData.value[key];

        if (value instanceof File) {
            submitData.append(key, value, value.name);
            console.log(`Appended file for ${key}: ${value.name}`);
        } else if (value !== null && value !== undefined && value !== '') {
             submitData.append(key, value);
             console.log(`Appended value for ${key}: ${value}`);
        } else if (value === null || value === '') {
            // Explicitly send empty string for cleared/empty fields if backend expects this
            // This ensures that if a field was previously set and is now cleared,
            // the backend updates it to null or empty.
            // Otherwise, if not sent, PATCH might ignore it (no change).
            submitData.append(key, '');
            console.log(`Appended empty string for ${key} (was null or empty)`);
        }
    });

    // For debugging FormData contents:
    // console.log("FormData contents before submission:");
    // for (let pair of submitData.entries()) {
    //   console.log(pair[0]+ ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
    // }
    return submitData;
}

const commonSubmitLogic = async (isDraft) => {
    console.log(`commonSubmitLogic called with instituteId: ${instituteId.value}`); // DEBUG
    formError.value = '';
    if (!instituteId.value) {
        toast.error('Critical Error: Institute ID is missing. Cannot proceed.');
        formError.value = 'Your application session is invalid. Please refresh.';
        return;
    }

    if (!isDraft && reviewDecision.value === 'Approved') {
        if (!formData.value.dpr_name.trim()) {
            toast.error('DPR Proposed Name is required for submission.');
            formError.value = 'DPR Proposed Name is required.';
            return;
        }
        const mainDprDocProvided = (typeof formData.value.do_dpr_report === 'string' && formData.value.do_dpr_report) || (formData.value.do_dpr_report instanceof File);
        if (!mainDprDocProvided) {
            toast.error('Main DPR Document is required for submission.');
            formError.value = 'Main DPR Document is required.';
            return;
        }
    }

    if (reviewDecision.value === 'Regretted') {
        toast.error('EOI was regretted. Cannot save draft or submit DPR.');
        return;
    }

    isSubmitting.value = true;
    const dataToSubmit = prepareSubmitData();

    // Example: Add a flag if it's a draft, if backend expects it
    // if (isDraft) {
    //    dataToSubmit.append('status', 'DRAFT_DPR'); // Or some other field
    // } else if (reviewDecision.value === 'Approved') {
    //    dataToSubmit.append('status', 'SUBMITTED_DPR'); // Example status field
    // }

    console.log(`Submitting to patchMhpcInstitute with ID: ${instituteId.value}`);
    // Log FormData content before sending (for environments that support it well)
    // for(var pair of dataToSubmit.entries()) {
    //    console.log(pair[0]+ ', '+ pair[1]);
    // }

    try {
        const response = await apiService.patchMhpcInstitute(instituteId.value, dataToSubmit);
        console.log('Response from patchMhpcInstitute:', response);

        if (response.status >= 200 && response.status < 300) {
            toast.success(isDraft ? 'DPR Draft Saved Successfully!' : 'DPR Submitted Successfully!');

            // Update formData with response data, especially for file URLs
            if (response.data) {
                Object.keys(formData.value).forEach((key) => {
                    if (Object.prototype.hasOwnProperty.call(response.data, key)) {
                         if (key === 'institute_eoi_supporting_documents' || key === 'do_dpr_report') {
                            if (typeof response.data[key] === 'string' && response.data[key]) {
                                formData.value[key] = response.data[key];
                                formData.value[key + '_filename'] = getFileName(response.data[key]);
                            }
                         } else if (!key.endsWith('_filename')) {
                            formData.value[key] = response.data[key] === null ? '' : response.data[key];
                         }
                    }
                });
            }

            if (!isDraft) {
                setTimeout(() => {
                    router.push('/admin/institutions/health_certification/dashboard');
                }, 1500);
            }
        } else {
            const errorDetail = response.data?.detail || `Server responded with status: ${response.status}`;
            toast.error(`Failed to ${isDraft ? 'save draft' : 'submit DPR'}. ${errorDetail}`);
            formError.value = `Submission failed: ${errorDetail}`;
            debugErrorDetails.value = `PATCH response not OK: ${response.status}, ${JSON.stringify(response.data)}`;
        }
    } catch (error) {
        console.error(`Error during ${isDraft ? 'saving draft' : 'submitting DPR'}:`, error);
        let errorMsg = `An unexpected error occurred.`;
        if (error.response) {
            // Try to get a more specific error message from the response
            const responseData = error.response.data;
            if (typeof responseData === 'string') {
                errorMsg = responseData;
            } else if (responseData && typeof responseData === 'object') {
                // Concatenate all error messages if it's an object of arrays/strings
                errorMsg = Object.values(responseData)
                    .map(err => Array.isArray(err) ? err.join(', ') : err)
                    .join('; ') || `Server error (${error.response.status}). Please try again.`;
            } else {
                errorMsg = `Server error (${error.response.status}). Please try again.`;
            }
             debugErrorDetails.value = `PATCH error: ${error.response.status}, ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
            errorMsg = "No response from server. Check your network connection.";
            debugErrorDetails.value = "PATCH error: No response from server.";
        } else {
            errorMsg = error.message;
            debugErrorDetails.value = `PATCH error: ${error.message}`;
        }
        toast.error(errorMsg, { timeout: 7000 });
        formError.value = `Error: ${errorMsg}`;
    } finally {
        isSubmitting.value = false;
    }
}

const handleSubmit = () => commonSubmitLogic(false);
const handleSaveDraft = () => commonSubmitLogic(true);

</script>

<style scoped>
.required-label::after {
    content: ' *';
    color: #dc2626; /* Tailwind's red-600 */
    margin-left: 2px;
}

.form-input,
.form-textarea {
    @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.form-file-input {
    @apply block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed;
}
.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1.5;
}

.btn {
    @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-primary {
    @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
    @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.section-header {
    @apply flex items-start py-5 px-6 md:px-8 bg-gray-50;
}
.form-section:first-child > .section-header:not(.border-t) { /* Avoid double border if first section also has a top message */
    @apply rounded-t-2xl;
}
.section-content {
    @apply p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6;
}
</style>