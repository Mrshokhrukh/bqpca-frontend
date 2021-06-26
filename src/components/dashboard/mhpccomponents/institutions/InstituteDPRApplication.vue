<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          Detailed Project Report (DPR) Application
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div v-if="isLoading" class="text-center p-8">
        <p class="text-gray-600">Loading your application data...</p>
      </div>
      <div v-else-if="fetchError" class="p-4 bg-red-50 text-red-700 rounded-md">
        <h4 class="font-bold">Error</h4>
        <p>{{ fetchError }}</p>
      </div>

      <form v-else @submit.prevent="submitDprForm" class="space-y-6">
        <div class="p-4 bg-gray-50 rounded-lg border">
          <h4 class="text-base font-semibold text-gray-800 mb-4">
            Institution Information (from EOI)
          </h4>
          <div class="space-y-4">
            <div>
              <label
                for="name_of_institution_disabled"
                class="block text-sm font-medium text-gray-700"
                >Name of Institution</label
              >
              <input
                type="text"
                :value="formData.name_of_institution"
                id="name_of_institution_disabled"
                disabled
                class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-200"
              />
            </div>
            <div>
              <label for="cid_disabled" class="block text-sm font-medium text-gray-700"
                >Promoter's CID</label
              >
              <input
                type="text"
                :value="formData.CID"
                id="cid_disabled"
                disabled
                class="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-200"
              />
            </div>
          </div>
        </div>

        <hr class="my-6" />

        <h4 class="text-lg font-medium text-gray-800">DPR Details (Please fill all sections)</h4>

        <div>
          <label for="dpr_name" class="block text-sm font-medium text-gray-700"
            >DPR Name / Primary Course Title *</label
          >
          <input
            type="text"
            v-model="formData.dpr_name"
            id="dpr_name"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="executive_summary" class="block text-sm font-medium text-gray-700"
            >Executive Summary *</label
          >
          <textarea
            v-model="formData.executive_summary"
            id="executive_summary"
            rows="4"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="vision_mission_strategies" class="block text-sm font-medium text-gray-700"
            >Vision, Mission and Implementation Strategies *</label
          >
          <textarea
            v-model="formData.vision_mission_strategies"
            id="vision_mission_strategies"
            rows="5"
            required
            placeholder="Clearly mention strategies, envisaged obstacles, and how to overcome them."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="project_scheduling" class="block text-sm font-medium text-gray-700"
            >Project Scheduling, Implementation and Management *</label
          >
          <textarea
            v-model="formData.project_scheduling"
            id="project_scheduling"
            rows="5"
            required
            placeholder="Specify timelines, major milestones, projected student numbers, etc."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="gross_national_happiness" class="block text-sm font-medium text-gray-700"
            >Contribution to Gross National Happiness & Values *</label
          >
          <textarea
            v-model="formData.gross_national_happiness"
            id="gross_national_happiness"
            rows="5"
            required
            placeholder="How the institution will contribute to GNH, instill values, promote ICT, and quest for excellence."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="land_details" class="block text-sm font-medium text-gray-700"
            >Land Details *</label
          >
          <textarea
            v-model="formData.land_details"
            id="land_details"
            rows="3"
            required
            placeholder="Details of land as required by relevant rules and regulations."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="conceptual_master_plan" class="block text-sm font-medium text-gray-700"
            >Conceptual Master Plan *</label
          >
          <textarea
            v-model="formData.conceptual_master_plan"
            id="conceptual_master_plan"
            rows="5"
            required
            placeholder="Encompass all aspects of physical infrastructure (academic, residential, auditorium, dining, parking, playfields, etc.)."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="academic_plan" class="block text-sm font-medium text-gray-700"
            >Academic Plan/Profile *</label
          >
          <textarea
            v-model="formData.academic_plan"
            id="academic_plan"
            rows="6"
            required
            placeholder="Intent and purpose, academic character, justifications for programs (market trends, existing institutes), research facilities, etc."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="affiliation_details" class="block text-sm font-medium text-gray-700"
            >Affiliation Details *</label
          >
          <textarea
            v-model="formData.affiliation_details"
            id="affiliation_details"
            rows="4"
            required
            placeholder="Details on affiliation with a recognized university. Approach university for affiliation in the same academic year permission is granted."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="teaching_hospital_details" class="block text-sm font-medium text-gray-700"
            >Teaching Hospital Details (Mandatory for Medical/Health courses) *</label
          >
          <textarea
            v-model="formData.teaching_hospital_details"
            id="teaching_hospital_details"
            rows="4"
            required
            placeholder="Identification of teaching hospital for clinical skills. Cannot be shared for same program."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="research_policy" class="block text-sm font-medium text-gray-700"
            >Research Policy *</label
          >
          <textarea
            v-model="formData.research_policy"
            id="research_policy"
            rows="4"
            required
            placeholder="Policy to promote research activities by faculty, students, and the institution."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="human_resource" class="block text-sm font-medium text-gray-700"
            >Human Resource Plan *</label
          >
          <textarea
            v-model="formData.human_resource"
            id="human_resource"
            rows="5"
            required
            placeholder="Faculty recruitment, qualifications, future expansion, expatriate personnel."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="quality_assurance" class="block text-sm font-medium text-gray-700"
            >Quality Assurance System *</label
          >
          <textarea
            v-model="formData.quality_assurance"
            id="quality_assurance"
            rows="5"
            required
            placeholder="Internal and external QA mechanisms, policies, standards, and student achievement."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="governance_structure" class="block text-sm font-medium text-gray-700"
            >Governance Structure *</label
          >
          <textarea
            v-model="formData.governance_structure"
            id="governance_structure"
            rows="5"
            required
            placeholder="Proposed governance policy, organizational structure, committees, reporting arrangements."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="business_plan" class="block text-sm font-medium text-gray-700"
            >Business Plan *</label
          >
          <textarea
            v-model="formData.business_plan"
            id="business_plan"
            rows="5"
            required
            placeholder="Financial viability, source of funds, detailed project costing, financial analysis."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="project_cost_analysis" class="block text-sm font-medium text-gray-700"
            >Project Cost and Analysis *</label
          >
          <textarea
            v-model="formData.project_cost_analysis"
            id="project_cost_analysis"
            rows="5"
            required
            placeholder="Detailed costing for land, construction, equipment, etc. Fixed investment and working capital."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="facilities_student_services" class="block text-sm font-medium text-gray-700"
            >Facilities and Student Services *</label
          >
          <textarea
            v-model="formData.facilities_student_services"
            id="facilities_student_services"
            rows="5"
            required
            placeholder="Quality facilities, inclusive practices, library, ICT, counseling, etc."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="admission_policy" class="block text-sm font-medium text-gray-700"
            >Admission Policy and Scholarships *</label
          >
          <textarea
            v-model="formData.admission_policy"
            id="admission_policy"
            rows="4"
            required
            placeholder="Clear policy on admission, eligibility, selection, fees, and scholarships."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="service_conditions" class="block text-sm font-medium text-gray-700"
            >Service Conditions *</label
          >
          <textarea
            v-model="formData.service_conditions"
            id="service_conditions"
            rows="5"
            required
            placeholder="Clear policies on recruitment, professional development, remuneration, welfare."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="safety_security" class="block text-sm font-medium text-gray-700"
            >Safety and Security Plan *</label
          >
          <textarea
            v-model="formData.safety_security"
            id="safety_security"
            rows="4"
            required
            placeholder="Mechanisms for staff/student safety. Provisions for course continuation in case of closure."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="public_information_system" class="block text-sm font-medium text-gray-700"
            >Public Information System Plan *</label
          >
          <textarea
            v-model="formData.public_information_system"
            id="public_information_system"
            rows="4"
            required
            placeholder="Plan for transparency (fees, accreditation status, course details, etc.)."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label for="other_details_dpr" class="block text-sm font-medium text-gray-700"
            >Others *</label
          >
          <textarea
            v-model="formData.other_details_dpr"
            id="other_details_dpr"
            rows="4"
            required
            placeholder="Issues like market analysis, ownership, sustainability, enrolment projection, etc."
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div v-if="formError" class="text-red-600 text-sm p-3 bg-red-50 rounded-md">
          {{ formError }}
        </div>

        <div class="pt-4 flex justify-end gap-4 border-t mt-6">
          <button
            type="button"
            @click="closeModal"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit DPR' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'

const props = defineProps({
  isVisible: Boolean,
})
const emit = defineEmits(['close', 'application-submitted'])

const authStore = useAuthStore()
const toast = useToast()

const application = ref(null)
const isLoading = ref(true)
const fetchError = ref('')
const isSubmitting = ref(false)
const formError = ref('')
const formData = ref({})

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      fetchUserApplication()
    } else {
      // Reset state when modal is closed
      application.value = null
      formData.value = {}
      fetchError.value = ''
      formError.value = ''
    }
  }
)

watch(application, (newApp) => {
  if (newApp) {
    // Populate formData with existing data, ensuring new DPR fields are blank if null
    formData.value = {
      ...newApp,
      dpr_name: newApp.dpr_name || '',
      executive_summary: newApp.executive_summary || '',
      vision_mission_strategies: newApp.vision_mission_strategies || '',
      project_scheduling: newApp.project_scheduling || '',
      gross_national_happiness: newApp.gross_national_happiness || '',
      land_details: newApp.land_details || '',
      conceptual_master_plan: newApp.conceptual_master_plan || '',
      academic_plan: newApp.academic_plan || '',
      affiliation_details: newApp.affiliation_details || '',
      teaching_hospital_details: newApp.teaching_hospital_details || '',
      research_policy: newApp.research_policy || '',
      human_resource: newApp.human_resource || '',
      quality_assurance: newApp.quality_assurance || '',
      governance_structure: newApp.governance_structure || '',
      business_plan: newApp.business_plan || '',
      project_cost_analysis: newApp.project_cost_analysis || '',
      facilities_student_services: newApp.facilities_student_services || '',
      admission_policy: newApp.admission_policy || '',
      service_conditions: newApp.service_conditions || '',
      safety_security: newApp.safety_security || '',
      public_information_system: newApp.public_information_system || '',
      other_details_dpr: newApp.other_details_dpr || '',
    }
  }
})

const fetchUserApplication = async () => {
  if (!authStore.user?.cid) {
    fetchError.value = 'Cannot identify user. Please log in again.'
    toast.error(fetchError.value)
    return
  }

  isLoading.value = true
  fetchError.value = ''
  try {
    const response = await apiServices.getMhpcInstituteByCid(authStore.user.cid)
    if (response.data?.results?.length > 0) {
      application.value = response.data.results[0]
    } else {
      fetchError.value =
        'Could not find your initial EOI application record. Please contact support.'
      toast.error(fetchError.value)
    }
  } catch (error) {
    console.error('Error fetching application data in modal:', error)
    fetchError.value = 'Failed to load your application data.'
    toast.error(fetchError.value)
  } finally {
    isLoading.value = false
  }
}

const submitDprForm = async () => {
  formError.value = ''
  // Simple validation can be added here if needed

  isSubmitting.value = true
  try {
    // This is an UPDATE, so we use a PATCH request with only the changed DPR fields
    const payload = {
      dpr_name: formData.value.dpr_name,
      executive_summary: formData.value.executive_summary,
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
      // CRITICAL: Update the status to move the application to the next lifecycle stage
      application_status: 'DPR Submitted',
    }

    // Assumes an update method in apiServices that takes the application ID and the payload
    const response = await apiServices.patchMhpcInstitute(application.value.id, payload)
    emit('application-submitted', response.data)
  } catch (error) {
    console.error('Error submitting DPR update:', error)
    const apiErrors = error.response?.data
    if (apiErrors && typeof apiErrors === 'object') {
      formError.value = `Submission failed: ${Object.values(apiErrors).flat().join(' ')}`
    } else {
      formError.value = 'An unexpected error occurred during submission.'
    }
    toast.error(formError.value)
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>
