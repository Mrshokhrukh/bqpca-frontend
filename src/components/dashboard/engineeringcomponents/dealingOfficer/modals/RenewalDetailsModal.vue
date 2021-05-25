<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        @click="closeModal"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

      <div
        class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900" id="modal-headline">
              EPC Renewal Application
              {{
                application && application.renewal_status !== 'Pending' ? '(Already Processed)' : ''
              }}
              <span v-if="application?.renewal_id" class="text-sm font-normal text-gray-500 ml-2"
                >(ID: {{ application.renewal_id }})</span
              >
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="application" class="p-6">
          <div
            v-if="application.renewal_status && application.renewal_status !== 'Pending'"
            class="mb-6"
          >
            <div
              class="inline-flex items-center px-4 py-2 rounded-full"
              :class="getRenewalStatusClasses(application.renewal_status)"
            >
              <span class="text-sm font-medium">
                Renewal Status: {{ application.renewal_status }}
              </span>
              <span v-if="application.created_at" class="ml-2 text-xs text-opacity-75">
                (Submitted on {{ formatDate(application.created_at) }})
              </span>
            </div>
          </div>

          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Applicant Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Name</span>
                <span class="font-medium text-gray-900">{{ application.full_name || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">CID Number</span>
                <span class="font-medium text-gray-900">{{ application.cid_no || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Registration Number</span>
                <span class="font-medium text-gray-900">{{
                  application.registration_no || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Registration Date</span>
                <span class="font-medium text-gray-900">{{
                  formatDate(application.registration_date)
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Current Expiry Date</span>
                <span class="font-medium text-gray-900">{{
                  formatDate(application.current_registration_expiry_date)
                }}</span>
              </div>
              <div v-if="application.new_expiry_date" class="flex flex-col">
                <span class="text-sm text-gray-500">New Expiry Date</span>
                <span class="font-medium text-gray-900">{{
                  formatDate(application.new_expiry_date)
                }}</span>
              </div>
            </div>
          </div>

          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Qualification Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Qualification</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.qualification_name_display || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Qualification Type</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.qualification_type_display || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Institute/University</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.institute_university_display || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Personnel Category</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.personnel_category_name || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Personnel Sub-Category</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.personnel_sub_category_name || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Sector</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.select_sector_name || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Completion Year</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.completion_year || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Practice Address</span>
                <span class="font-medium text-gray-900">{{
                  getPrimaryQualification(application)?.practice_address || 'N/A'
                }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Qualification Status</span>
                <span
                  v-if="getPrimaryQualification(application)?.endorsement_decision"
                  :class="
                    getQualificationStatusClasses(
                      getPrimaryQualification(application).endorsement_decision
                    )
                  "
                  class="inline-flex px-2 py-1 rounded text-xs"
                >
                  {{ getPrimaryQualification(application).endorsement_decision }}
                </span>
                <span v-else class="font-medium text-gray-900">N/A</span>
              </div>
            </div>
          </div>

          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Attachments</h4>
            <div
              v-if="
                getPrimaryQualification(application)?.user_qualification_attachments?.length > 0
              "
            >
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="attachment in getPrimaryQualification(application)
                    .user_qualification_attachments"
                  :key="attachment.id"
                  class="py-3 flex justify-between items-center"
                >
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ attachment.file_type_name || 'Attachment' }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Uploaded: {{ formatDate(attachment.uploaded_at) }}
                    </p>
                  </div>
                  <a
                    :href="attachment.file"
                    target="_blank"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No attachments available for the primary qualification.
            </div>
          </div>

          <!-- CPD/CME Credits Section -->
          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">CPD/CME Credits</h4>
            <div v-if="isCpdLoading" class="text-center py-4">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
              ></div>
              <p class="mt-2 text-sm text-gray-600">Loading CPD records...</p>
            </div>
            <div v-else-if="cpdLoadError" class="text-red-500 text-sm">{{ cpdLoadError }}</div>
            <div v-else>
              <p class="text-sm text-gray-700">
                Total Approved CPD Points: {{ getTotalCpdPoints }} (Minimum 60 recommended)
              </p>
              <ul v-if="cpdRecords.length > 0" class="mt-2 list-disc list-inside">
                <li
                  v-for="record in cpdRecords.slice(0, 5)"
                  :key="record.id"
                  class="text-sm text-gray-700"
                >
                  {{ record.title_of_cpd || 'Untitled' }} - {{ record.cpd_credit || 0 }} points ({{
                    formatDate(record.created_at)
                  }})
                </li>
              </ul>
              <p v-else class="text-sm text-gray-700">No approved CPD records found.</p>
            </div>
          </div>

          <div
            v-if="application.renewal_status && application.renewal_status !== 'Pending'"
            class="mb-8 p-6 bg-white rounded-lg border border-gray-200"
          >
            <h4 class="text-lg font-medium text-gray-900 mb-4">Renewal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Review Status</span>
                <span
                  :class="getStatusTagClass(application.renewal_review_status)"
                  class="mt-1 inline-flex px-2 py-1 rounded text-xs"
                >
                  {{ application.renewal_review_status || 'N/A' }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Endorsement Decision</span>
                <span
                  :class="getStatusTagClass(application.renewal_status)"
                  class="mt-1 inline-flex px-2 py-1 rounded text-xs"
                >
                  {{ application.renewal_status || 'N/A' }}
                </span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm text-gray-500">Review Remarks</span>
                <span class="font-medium text-gray-900">{{
                  application.renewal_review_remarks || 'No remarks'
                }}</span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm text-gray-500">Endorsement Remarks</span>
                <span class="font-medium text-gray-900">{{
                  application.endorsement_remarks || 'No remarks'
                }}</span>
              </div>
            </div>
          </div>

          <div
            class="mb-8 p-6 bg-white rounded-lg border border-gray-200"
            v-if="application.renewal_status === 'Pending'"
          >
            <h4 class="text-lg font-medium text-gray-900 mb-4">Process EPC Renewal</h4>
            <div class="mb-6">
              <label
                for="renewal_review_status"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Status <span class="text-red-500">*</span>
              </label>
              <select
                id="renewal_review_status"
                v-model="reviewForm.renewal_review_status"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Regretted">Regretted</option>
              </select>
            </div>

            <div class="mb-6">
              <label
                for="renewal_review_remarks"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Review Remarks
              </label>
              <textarea
                id="renewal_review_remarks"
                v-model="reviewForm.renewal_review_remarks"
                rows="3"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your remarks here..."
              ></textarea>
            </div>

            <div class="mb-6" v-if="reviewForm.renewal_review_status === 'Approved'">
              <label for="new_expiry_date" class="block text-sm font-medium text-gray-700 mb-2">
                New Expiry Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="new_expiry_date"
                v-model="reviewForm.new_expiry_date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div class="mb-6">
              <label
                for="renewal_endorsement_decision"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Endorsement Decision <span class="text-red-500">*</span>
              </label>
              <select
                id="renewal_endorsement_decision"
                v-model="reviewForm.renewal_endorsement_decision"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Regretted">Regretted</option>
              </select>
            </div>

            <div class="mb-6">
              <label for="endorsement_remarks" class="block text-sm font-medium text-gray-700 mb-2">
                Endorsement Remarks
              </label>
              <textarea
                id="endorsement_remarks"
                v-model="reviewForm.endorsement_remarks"
                rows="3"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your endorsement remarks here..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-8">
            <button
              @click="closeModal"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              v-if="application.renewal_status === 'Pending'"
              @click="submitRenewalUpdate"
              :disabled="isSubmitting"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
              {{ isSubmitting ? 'Processing...' : 'Update EPC Renewal' }}
            </button>
          </div>
        </div>

        <div v-else class="p-6 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
          ></div>
          <p class="mt-2 text-sm text-gray-600">Loading details...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import apiServices from '@/services/services' // Assuming this provides patchEpcRenewal and patchEpcNewQualification
// import apiClient from '@/services/apiClient'; // Keep if used elsewhere or for the optional application status update
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
  // These props might not be directly used in the script logic shown, but are kept for completeness if the template uses them
  personnelCategories: {
    type: Array,
    default: () => [],
  },
  personnelSubcategories: {
    type: Array,
    default: () => [],
  },
  sectors: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'update'])
const toast = useToast()
const isSubmitting = ref(false)

// State for additional fields
const cpdRecords = ref([])
const isCpdLoading = ref(false)
const cpdLoadError = ref('')

const reviewForm = ref({
  renewal_review_status: 'Pending',
  renewal_review_remarks: '',
  new_expiry_date: null,
  renewal_endorsement_decision: 'Pending',
  endorsement_remarks: '',
})

const getPrimaryQualification = (app) => {
  if (app && Array.isArray(app.user_qualifications) && app.user_qualifications.length > 0) {
    const primaryQual = app.user_qualifications.find((q) => q && q.is_primary_qualification === true)
    if (primaryQual) {
      return primaryQual
    }
    // If no primary qualification found, return the first qualification
    return app.user_qualifications[0]
  }
  return null
}

// Fetch CPD Records
const fetchCpdRecords = async (cid) => {
  if (!cid) return
  isCpdLoading.value = true
  cpdLoadError.value = ''
  try {
    const response = await apiServices.getEpcCpdRecordsByCid(cid)
    cpdRecords.value = response.data.filter((record) => record.review_status === 'Approved') || []
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    cpdLoadError.value = 'Failed to load CPD records.'
  } finally {
    isCpdLoading.value = false
  }
}

// Computed property for total CPD points
const getTotalCpdPoints = computed(() => {
  return cpdRecords.value.reduce((total, record) => total + (record.cpd_credit || 0), 0)
})

// Watch application prop to fetch data and initialize form
watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      const cid = newApplication.cid_no
      fetchCpdRecords(cid)

      let defaultNewExpiryDate = null
      if (newApplication.current_registration_expiry_date) {
        try {
          const currentExpiry = new Date(newApplication.current_registration_expiry_date)
          if (!isNaN(currentExpiry.getTime())) {
            currentExpiry.setFullYear(currentExpiry.getFullYear() + 3)
            defaultNewExpiryDate = currentExpiry.toISOString().split('T')[0]
          }
        } catch (e) {
          console.error('Error parsing current_registration_expiry_date:', newApplication.current_registration_expiry_date, e)
        }
      }
      if (!defaultNewExpiryDate) { // Fallback if current_registration_expiry_date is invalid or missing
        const today = new Date()
        today.setFullYear(today.getFullYear() + 3)
        defaultNewExpiryDate = today.toISOString().split('T')[0]
      }

      reviewForm.value = {
        renewal_review_status: newApplication.renewal_review_status || 'Pending',
        renewal_review_remarks: newApplication.renewal_review_remarks || '',
        new_expiry_date: newApplication.new_expiry_date || defaultNewExpiryDate, // Prefill from application.new_expiry_date if already processed
        renewal_endorsement_decision: newApplication.renewal_endorsement_decision || newApplication.renewal_status || 'Pending',
        endorsement_remarks: newApplication.endorsement_remarks || '',
      }
    } else {
      // Reset form if application becomes null
      reviewForm.value = {
        renewal_review_status: 'Pending',
        renewal_review_remarks: '',
        new_expiry_date: null,
        renewal_endorsement_decision: 'Pending',
        endorsement_remarks: '',
      }
      cpdRecords.value = [] // Clear CPD records too
    }
  },
  { immediate: true, deep: true }
)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A' // Invalid date string
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'N/A'
  }
}

const getQualificationStatusClasses = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted',
    'bg-gray-100 text-gray-800': !['Pending', 'Approved', 'Regretted'].includes(status),
  }
}

const getRenewalStatusClasses = (status) => {
  // Same logic as qualification status for now
  return getQualificationStatusClasses(status)
}

const getStatusTagClass = (status) => {
  return getRenewalStatusClasses(status)
}

const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const submitRenewalUpdate = async () => {
  if (!props.application || props.application.renewal_id == null) {
    toast.error('EPC renewal data is missing or invalid.')
    return
  }

  if (reviewForm.value.renewal_review_status === 'Approved' && !reviewForm.value.new_expiry_date) {
    toast.error('New expiry date is required when approving the renewal review.')
    return
  }
  if (!reviewForm.value.renewal_review_status || !reviewForm.value.renewal_endorsement_decision) {
    toast.error('Review Status and Endorsement Decision are required.')
    return
  }

  isSubmitting.value = true
  try {
    // Data for the EnggRenewal record
    const renewalPatchData = {
      renewal_review_status: reviewForm.value.renewal_review_status,
      renewal_review_remarks: reviewForm.value.renewal_review_remarks || '',
      renewal_endorsement_decision: reviewForm.value.renewal_endorsement_decision,
      endorsement_remarks: reviewForm.value.endorsement_remarks || '',
    }

    // Add new_expiry_date to renewalPatchData only if review_status is Approved
    // This pertains to the EnggRenewal.new_expiry_date field
    if (reviewForm.value.renewal_review_status === 'Approved' && reviewForm.value.new_expiry_date) {
      renewalPatchData.new_expiry_date = reviewForm.value.new_expiry_date
    }

    const renewalId = props.application.renewal_id

    // Step 1: Update the renewal record (EnggRenewal model)
    await apiServices.patchEpcRenewal(renewalId, renewalPatchData)

    // Step 2: If renewal ENDORSEMENT decision is "Approved", update the PRIMARY QUALIFICATION's expiry date and status
    if (reviewForm.value.renewal_endorsement_decision === 'Approved' && reviewForm.value.new_expiry_date) {
      const primaryQualification = getPrimaryQualification(props.application)

      if (primaryQualification && primaryQualification.id) {
        const qualificationId = primaryQualification.id

        // Data for patching the EnggUserQualification record
        const qualificationUpdateData = {
          expiry_date: reviewForm.value.new_expiry_date, // This sets EnggUserQualification.expiry_date
          is_active: true,
          // Include other fields for qualification if needed, but be specific.
          // Sending minimal data is best for PATCH.
        }

        try {
          // Use the service method for patching qualifications.
          // Assumes apiServices.patchEpcNewQualification sends data correctly (e.g., as multipart/form-data)
          // and the backend EnggUserQualification serializer handles it.
          await apiServices.patchEpcNewQualification(qualificationId, qualificationUpdateData)
        } catch (qualError) {
          console.error('Error updating primary qualification:', qualError)
          const errorDetail = qualError.response?.data ? JSON.stringify(qualError.response.data) : qualError.message
          toast.warning(`Renewal record updated, but failed to update primary qualification: ${errorDetail}. Please check manually.`)
          // Continue to emit update and show success for renewal, as the renewal record itself was updated.
        }
      } else {
        toast.warning('Renewal record updated, but primary qualification could not be identified for update. Please check manually.')
      }
    }

    toast.success('EPC renewal process updated successfully.')
    emit('update') // To refresh parent list or state
    // closeModal(); // Optionally close modal on success, if not done by parent
  } catch (error) {
    console.error('Error updating EPC renewal process:', error)
    const errorMsg = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message || 'Unknown error'
    toast.error(`Failed to update EPC renewal: ${errorMsg}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
