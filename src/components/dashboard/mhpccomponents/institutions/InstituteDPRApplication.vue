<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Detailed Project Proposal (DPR)"
      subtitle="Complete and submit your proposal for establishing a Medical and Health Educational Institution."
      :show-actions="false"
    />

    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] mt-8">
      <Loader class="animate-spin text-indigo-600 w-12 h-12" />
      <p class="mt-4 text-lg font-medium text-gray-700">Loading Application Status...</p>
    </div>

    <div v-else-if="apiError" class="mt-8 text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-sm">
        <p class="text-red-700 text-lg font-medium">{{ initialErrorMsg || 'An error occurred' }}</p>
        <p class="text-red-600 text-sm mt-2">Please try refreshing the page or contact support.</p>
    </div>

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

    <div v-else-if="reviewDecision === 'PendingEOI'" class="max-w-3xl mx-auto mt-8">
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-md" role="alert">
        <div class="flex items-start">
          <ClockIcon class="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-semibold text-lg text-yellow-800">EOI Application Pending</p>
            <p class="mt-2 text-yellow-700">
              Your Expression of Interest (EOI) application is currently under review.
              You can prepare your DPR details below and save as a draft. Submission will be
              enabled once your EOI is approved.
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
            <p class="font-semibold text-lg text-blue-800">No EOI Submitted</p>
            <p class="mt-2 text-blue-700">
              No Expression of Interest (EOI) application was found for your account.
              Please submit an EOI before proceeding with a DPR.
            </p>
          </div>
        </div>
      </div>
    </div>


    <form
      v-if="reviewDecision === 'Approved' || reviewDecision === 'PendingDPR'"
      @submit.prevent="handleSubmit"
      class="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden mt-8"
    >
      <div
        v-for="(section, sectionIndex) in formSections"
        :key="section.id"
        class="form-section"
      >
        <div
          :class="[
            'section-header',
            sectionIndex === 0 ? '' : 'border-t border-gray-200',
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
              :class="{ 'required-label': field.required }"
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
              :required="field.required"
              :disabled="field.disabled || (isSubmitting && field.type !== 'file')"
            />
            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.id"
              v-model="formData[field.modelKey]"
              :rows="field.rows || 4"
              class="form-textarea"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="isSubmitting"
            ></textarea>
            <div v-else-if="field.type === 'file'" class="mt-1">
              <input
                :type="field.type"
                :id="field.id"
                ref="fileInputs"
                @change="handleFileUpload(field.modelKey, $event)"
                :accept="field.accept || '.pdf,.doc,.docx,.jpg,.png'"
                class="form-file-input"
                :disabled="isSubmitting"
              />
              <div v-if="formData[field.modelKey] || formData[field.modelKey + '_filename']" class="mt-2 text-sm">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                    <p class="text-gray-700 truncate flex-grow">
                        <PaperClipIcon class="w-4 h-4 inline mr-1.5 text-gray-400" />
                        <span class="font-medium">Current:</span> {{ getFileName(formData[field.modelKey]) || formData[field.modelKey + '_filename'] }}
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
        <p v-if="reviewDecision === 'PendingDPR'" class="mb-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md border border-yellow-200 text-center">
            Your EOI application is pending review. You can save this DPR as a draft.
            Submission will be enabled once your EOI is approved.
        </p>
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
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import { Loader } from 'lucide-vue-next'

import {
    BuildingOfficeIcon, DocumentTextIcon, LightBulbIcon, CalendarDaysIcon, SparklesIcon, MapPinIcon,
    PuzzlePieceIcon, AcademicCapIcon, LinkIcon, HeartIcon, BeakerIcon, UsersIcon, ShieldCheckIcon,
    CogIcon, BriefcaseIcon, ChartBarIcon, HomeModernIcon, TicketIcon, UserGroupIcon, LockClosedIcon,
    InformationCircleIcon, QuestionMarkCircleIcon, ExclamationTriangleIcon, ClockIcon,
    ArrowDownTrayIcon, PaperAirplaneIcon, PaperClipIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()

const instituteName = ref('')
const isSubmitting = ref(false)
const instituteId = ref(null)
const reviewDecision = ref('')
const eoiRejectionReason = ref('')
const isLoading = ref(true)
const apiError = ref(false)
const initialErrorMsg = ref('')
const fileInputs = ref([])

const formData = ref({
    dpr_name: '', executive_summary: '', institute_eoi_supporting_documents: null,
    institute_dpr_remarks: '', do_dpr_review_report: '', do_dpr_review_summary: '',
    do_dpr_report: null, vision_mission_strategies: '', project_scheduling: '',
    gross_national_happiness: '', land_details: '', conceptual_master_plan: '',
    academic_plan: '', affiliation_details: '', teaching_hospital: '', research_policy: '',
    human_resource: '', quality_assurance: '', governance_structure: '', business_plan: '',
    project_cost_analysis: '', facilities_student_services: '', admission_policy: '',
    service_conditions: '', safety_security: '', public_information_system: '', other_details: '',
    institute_eoi_supporting_documents_filename: '', do_dpr_report_filename: '',
})

const formSections = computed(() => [
    { id: 'collegeDetails', title: '1. College/Institution Details', description: 'Details of the proposed institution.', icon: BuildingOfficeIcon, fields: [ { id: 'institutionName', label: 'Proposed Name (from EOI):', staticModel: instituteName.value, type: 'text', disabled: true, placeholder: 'Institution Name', fullWidth: true } ] },
    { id: 'dprDetails', title: '2. DPR Specifics', description: 'Core details and documents for this DPR.', icon: DocumentTextIcon, fields: [ { id: 'dprName', label: 'DPR Name:', modelKey: 'dpr_name', type: 'text', required: true, placeholder: 'e.g., DPR for Establishment of [Institution Name]', fullWidth: true }, { id: 'institute_eoi_supporting_documents', label: 'EOI Supporting Documents:', modelKey: 'institute_eoi_supporting_documents', type: 'file', accept: '.pdf,.doc,.docx', hint: 'Attach relevant documents supporting your EOI (if any new/updated).' }, { id: 'institute_dpr_remarks', label: 'Institute DPR Remarks:', modelKey: 'institute_dpr_remarks', type: 'textarea', placeholder: 'Any remarks regarding this DPR submission.', fullWidth: true }, { id: 'do_dpr_review_report', label: 'DPR Review Report (Desk Officer):', modelKey: 'do_dpr_review_report', type: 'textarea', placeholder: 'For Desk Officer use, if applicable.', fullWidth: true }, { id: 'do_dpr_review_summary', label: 'DPR Review Summary (Desk Officer):', modelKey: 'do_dpr_review_summary', type: 'textarea', placeholder: 'For Desk Officer use, if applicable.', fullWidth: true }, { id: 'do_dpr_report', label: 'DPR Report (Desk Officer):', modelKey: 'do_dpr_report', type: 'file', accept: '.pdf,.doc,.docx', hint: 'Final DPR report document from Desk Officer, if applicable.' } ] },
    { id: 'visionMission', title: '3. Vision, Mission, and Implementation Strategies', description: "Outline the institution's core philosophy and execution plan.", icon: LightBulbIcon, fields: [ { id: 'vision_mission_strategies', label: 'Vision, Mission & Strategies:', modelKey: 'vision_mission_strategies', type: 'textarea', rows: 5, required: true, placeholder: "Describe the institution's vision, mission, and key implementation strategies.", fullWidth: true } ] },
    { id: 'projectScheduling', title: '4. Project Scheduling, Implementation, and Management', description: 'Detail the project timeline and management approach.', icon: CalendarDaysIcon, fields: [ { id: 'project_scheduling', label: 'Project Schedule & Management:', modelKey: 'project_scheduling', type: 'textarea', rows: 5, required: true, placeholder: 'Provide a detailed project schedule, implementation plan, and management structure.', fullWidth: true } ] },
    { id: 'gnhValues', title: '5. Values of Gross National Happiness', description: 'How the institution aligns with and promotes GNH values.', icon: SparklesIcon, fields: [ { id: 'gross_national_happiness', label: 'Contribution to GNH:', modelKey: 'gross_national_happiness', type: 'textarea', rows: 5, required: true, placeholder: 'Describe how the institution will contribute to the pillars of Gross National Happiness.', fullWidth: true } ] },
    { id: 'landDetails', title: '6. Land', description: 'Information regarding the land for the institution.', icon: MapPinIcon, fields: [ { id: 'land_details', label: 'Land Details:', modelKey: 'land_details', type: 'textarea', placeholder: 'Provide details as required by relevant land regulations (e.g., location, area, ownership, clearance status).', fullWidth: true } ] },
    { id: 'masterPlan', title: '7. Conceptual Master Plan', description: 'The overall physical layout and infrastructure plan.', icon: PuzzlePieceIcon, fields: [ { id: 'conceptual_master_plan', label: 'Master Plan Description:', modelKey: 'conceptual_master_plan', type: 'textarea', rows: 5, required: true, placeholder: 'Describe the conceptual master plan, including all aspects of physical infrastructure (buildings, labs, libraries, hostels, etc.).', hint: 'Include all aspects of the physical infrastructure.', fullWidth: true } ] },
    { id: 'academicPlan', title: '8. Academic Plan/Profile', description: 'The educational character and programs of the institute.', icon: AcademicCapIcon, fields: [ { id: 'academic_plan', label: 'Academic Plan:', modelKey: 'academic_plan', type: 'textarea', rows: 5, required: true, placeholder: 'Describe the intent and purpose of the institute in terms of its academic character, proposed courses, curriculum framework, and teaching methodologies.', fullWidth: true } ] },
    { id: 'affiliation', title: '9. Affiliation', description: 'Details of affiliation with a recognized university.', icon: LinkIcon, fields: [ { id: 'affiliation_details', label: 'Affiliation Details:', modelKey: 'affiliation_details', type: 'textarea', placeholder: 'Provide details on the affiliation of the training institute with a recognized university (e.g., name of university, status of affiliation).', fullWidth: true } ] },
    { id: 'teachingHospital', title: '10. Teaching Hospital', description: 'Arrangements for a teaching hospital.', icon: HeartIcon, fields: [ { id: 'teaching_hospital', label: 'Teaching Hospital Details:', modelKey: 'teaching_hospital', type: 'textarea', placeholder: 'Provide details on the teaching hospital arrangement (e.g., own hospital, MoU with existing hospital, capacity).', fullWidth: true } ] },
    { id: 'researchPolicy', title: '11. Research Policy', description: "The institution's policy on research activities.", icon: BeakerIcon, fields: [ { id: 'research_policy', label: 'Research Policy:', modelKey: 'research_policy', type: 'textarea', placeholder: 'Outline the research policy of the institution, including focus areas, funding, and ethical guidelines.', fullWidth: true } ] },
    { id: 'humanResource', title: '12. Human Resource', description: 'Plan for staffing and human resource management.', icon: UsersIcon, fields: [ { id: 'human_resource', label: 'Human Resource Plan:', modelKey: 'human_resource', type: 'textarea', placeholder: 'Describe the human resource plan, including faculty recruitment, staff roles, qualifications, and development programs.', fullWidth: true } ] },
    { id: 'qualityAssurance', title: '13. Quality Assurance System', description: 'Mechanisms for ensuring educational quality.', icon: ShieldCheckIcon, fields: [ { id: 'quality_assurance', label: 'Quality Assurance System:', modelKey: 'quality_assurance', type: 'textarea', placeholder: 'Provide details on the quality assurance system (e.g., internal reviews, external accreditation, student feedback mechanisms).', fullWidth: true } ] },
    { id: 'governanceStructure', title: '14. Governance Structure', description: 'The organizational and administrative framework.', icon: CogIcon, fields: [ { id: 'governance_structure', label: 'Governance Structure:', modelKey: 'governance_structure', type: 'textarea', placeholder: 'Describe the governance structure (e.g., governing body, academic council, administrative hierarchy, roles and responsibilities).', fullWidth: true } ] },
    { id: 'businessPlan', title: '15. Business Plan', description: 'Financial projections and sustainability plan.', icon: BriefcaseIcon, fields: [ { id: 'business_plan', label: 'Business Plan:', modelKey: 'business_plan', type: 'textarea', placeholder: 'Provide details on the business plan, including financial projections, funding sources, revenue streams, and sustainability model.', fullWidth: true } ] },
    { id: 'projectCost', title: '16. Project Cost and Analysis', description: 'Detailed breakdown of project costs and financial analysis.', icon: ChartBarIcon, fields: [ { id: 'project_cost_analysis', label: 'Project Cost & Analysis:', modelKey: 'project_cost_analysis', type: 'textarea', placeholder: 'Provide a detailed project cost breakdown and financial viability analysis.', fullWidth: true } ] },
    { id: 'facilitiesServices', title: '17. Facilities and Student Services', description: 'Amenities and support services for students.', icon: HomeModernIcon, fields: [ { id: 'facilities_student_services', label: 'Facilities & Student Services:', modelKey: 'facilities_student_services', type: 'textarea', placeholder: 'Describe available facilities (library, labs, sports) and student support services (counseling, career guidance, healthcare).', fullWidth: true } ] },
    { id: 'admissionPolicy', title: '18. Admission Policy and Scholarships', description: 'Criteria for admission and scholarship programs.', icon: TicketIcon, fields: [ { id: 'admission_policy', label: 'Admission Policy & Scholarships:', modelKey: 'admission_policy', type: 'textarea', placeholder: 'Detail the admission policy, eligibility criteria, selection process, and any scholarship programs.', fullWidth: true } ] },
    { id: 'serviceConditions', title: '19. Service Conditions', description: 'Terms of employment for staff.', icon: UserGroupIcon, fields: [ { id: 'service_conditions', label: 'Service Conditions:', modelKey: 'service_conditions', type: 'textarea', placeholder: 'Outline the service conditions for employees, including contracts, benefits, and grievance redressal.', fullWidth: true } ] },
    { id: 'safetySecurity', title: '20. Safety and Security', description: 'Measures to ensure a safe campus environment.', icon: LockClosedIcon, fields: [ { id: 'safety_security', label: 'Safety & Security Measures:', modelKey: 'safety_security', type: 'textarea', placeholder: 'Describe safety and security measures for students, staff, and assets (e.g., campus security, emergency protocols, OHS).', fullWidth: true } ] },
    { id: 'publicInfoSystem', title: '21. Public Information System', description: 'How information is disseminated to the public.', icon: InformationCircleIcon, fields: [ { id: 'public_information_system', label: 'Public Information System:', modelKey: 'public_information_system', type: 'textarea', placeholder: 'Describe the system for providing public information (e.g., website, prospectus, RTI compliance).', fullWidth: true } ] },
    { id: 'otherDetails', title: '22. Others', description: 'Any other relevant information.', icon: QuestionMarkCircleIcon, fields: [ { id: 'other_details', label: 'Other Relevant Information:', modelKey: 'other_details', type: 'textarea', placeholder: 'Include any other details or documents pertinent to the DPR not covered elsewhere.', fullWidth: true } ] },
])

onMounted(async () => {
    isLoading.value = true
    apiError.value = false
    initialErrorMsg.value = ''

    const userString = localStorage.getItem('user')
    if (!userString) {
        initialErrorMsg.value = 'User session not found. Please log in again.'
        apiError.value = true
        isLoading.value = false
        toast.error(initialErrorMsg.value)
        router.push('/login')
        return
    }

    let userObject
    try {
        userObject = JSON.parse(userString)
    } catch (error) {
        console.error('Error parsing user session data:', error)
        initialErrorMsg.value = 'Invalid user session data. Please try again.'
        apiError.value = true
        isLoading.value = false
        toast.error(initialErrorMsg.value)
        return
    }

    if (!userObject?.cid) {
        initialErrorMsg.value = 'User CID not found in session data.'
        apiError.value = true
        isLoading.value = false
        toast.error(initialErrorMsg.value)
        return
    }
    const userCID = userObject.cid

    try {
        const response = await apiService.getMhpcInstitutes({ params: { CID: userCID } })
        const institutes = response.data?.results || response.data

        if (!Array.isArray(institutes) || institutes.length === 0) {
            reviewDecision.value = 'NotSubmitted'
            isLoading.value = false;
            return;
        }

        const matchedInstitute = institutes.find((institute) => institute.CID === userCID)

        if (!matchedInstitute) {
            reviewDecision.value = 'NotSubmitted'
            isLoading.value = false
            return
        }

        instituteId.value = matchedInstitute.id
        instituteName.value = matchedInstitute.name_of_institution || 'N/A'
        eoiRejectionReason.value = matchedInstitute.reason_if_rejected || ''

        if (matchedInstitute.review_decision === 'Pending') {
            reviewDecision.value = 'PendingDPR' // EOI is pending, allow DPR draft
        } else {
            reviewDecision.value = matchedInstitute.review_decision // Approved, Regretted
        }

        if (reviewDecision.value === 'Approved' || reviewDecision.value === 'PendingDPR') {
            await fetchDprData()
        }
    } catch (error) {
        console.error('Error fetching EOI application status:', error)
        initialErrorMsg.value = 'Failed to load EOI application status. Please try again.'
        apiError.value = true
        toast.error(initialErrorMsg.value)
    } finally {
        isLoading.value = false
    }
})

const fetchDprData = async () => {
    if (!instituteId.value) return
    try {
        const response = await apiService.getMhpcInstitute(instituteId.value)
        if (response.data) {
            const dprData = response.data
            Object.keys(formData.value).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(dprData, key) &&
                    key !== 'institute_eoi_supporting_documents' && key !== 'do_dpr_report' &&
                    !key.endsWith('_filename')) {
                    formData.value[key] = dprData[key] === null ? '' : dprData[key];
                }
            })
            formData.value.institute_eoi_supporting_documents_filename = getFileName(dprData.institute_eoi_supporting_documents) || ''
            formData.value.do_dpr_report_filename = getFileName(dprData.do_dpr_report) || ''
        }
    } catch (error) {
        console.error('Error fetching existing DPR data:', error)
        toast.error('Could not load existing DPR data.')
    }
}

const getFileName = (fileData) => {
    if (fileData instanceof File) {
        return fileData.name
    }
    if (typeof fileData === 'string' && fileData.trim() !== '') {
        try {
            const url = new URL(fileData)
            const pathname = url.pathname
            return pathname.substring(pathname.lastIndexOf('/') + 1)
        } catch (e) {
            console.error('Error parsing file URL:', e)
            return fileData.substring(fileData.lastIndexOf('/') + 1)
        }
    }
    return ''
}

const handleFileUpload = (modelKey, event) => {
    const file = event.target.files[0]
    if (file) {
        formData.value[modelKey] = file
        formData.value[modelKey + '_filename'] = file.name
    } else {
        formData.value[modelKey] = null
        formData.value[modelKey + '_filename'] = ''
    }
}

const clearFile = (modelKey, inputId) => {
    formData.value[modelKey] = null
    formData.value[modelKey + '_filename'] = ''

    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = '';
    }
}


const prepareSubmitData = () => {
    const submitData = new FormData()
    Object.keys(formData.value).forEach((key) => {
        if (key.endsWith('_filename')) return

        const value = formData.value[key]
        if (value !== null && value !== undefined) {
            if (value instanceof File) {
                submitData.append(key, value, value.name)
            } else if (typeof value === 'string' && value.trim() !== '') {
                submitData.append(key, value)
            } else if (typeof value === 'number') {
                submitData.append(key, value.toString())
            }
        }
    })
    return submitData
}

const commonSubmitLogic = async (isDraft) => {
    if (!instituteId.value) {
        toast.error('Institute ID is missing. Cannot proceed.')
        return
    }
    if (!isDraft && reviewDecision.value !== 'Approved') {
        toast.error('Your EOI application is not yet approved. DPR cannot be submitted.')
        return
    }
    if (reviewDecision.value === 'Regretted') {
        toast.error('EOI was regretted. Cannot save draft or submit DPR.')
        return;
    }
    if (!formData.value.dpr_name.trim() && !isDraft) {
        toast.error('DPR Name is required for submission.')
        return
    }

    isSubmitting.value = true
    const dataToSubmit = prepareSubmitData()

    try {
        const response = await apiService.patchMhpcInstitute(instituteId.value, dataToSubmit)
        if (response.status >= 200 && response.status < 300) {
            toast.success(isDraft ? 'Draft saved successfully!' : 'DPR submitted successfully!')
            if (!isDraft) {
                setTimeout(() => {
                    router.push('/admin/institutions/health_certification/dashboard')
                }, 1500)
            } else {
                await fetchDprData()
            }
        } else {
            toast.error(`Failed to ${isDraft ? 'save draft' : 'submit DPR'}. Server responded with status: ${response.status}`)
        }
    } catch (error) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.error || `An unexpected error occurred while ${isDraft ? 'saving draft' : 'submitting'}.`
        toast.error(errorMsg, { timeout: 7000 })
    } finally {
        isSubmitting.value = false
    }
}

const handleSubmit = () => commonSubmitLogic(false)
const handleSaveDraft = () => commonSubmitLogic(true)

</script>

<style scoped>
.required-label::after {
    content: ' *';
    color: #dc2626;
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
.form-section:first-child > .section-header {
    @apply rounded-t-2xl;
}
.section-content {
    @apply p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6;
}
</style>
