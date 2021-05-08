<template>
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
        <InstituteHeader
            title="New Educational Programme Application"
            subtitle="Complete the form to apply for a new educational programme for your institute."
            :show-actions="false"
        />

        <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] mt-8">
            <Loader class="animate-spin text-indigo-600 w-10 h-10" />
            <p class="mt-4 text-lg font-medium text-gray-700">Loading institute data...</p>
        </div>

        <div
            v-else-if="apiError || (!userInstitute && !isLoading)"
            class="mt-8 text-center py-16 rounded-2xl border shadow-sm"
            :class="apiError ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'"
        >
            <InformationCircleIcon
                v-if="!userInstitute"
                class="mx-auto h-12 w-12"
                :class="apiError ? 'text-red-400' : 'text-yellow-400'"
            />
            <ExclamationTriangleIcon v-else class="mx-auto h-12 w-12 text-red-400" />
            <h3
                class="mt-2 text-lg font-medium"
                :class="apiError ? 'text-red-900' : 'text-yellow-900'"
            >
                {{ apiError ? 'Error Loading Data' : 'Institute Information Not Found' }}
            </h3>
            <p class="mt-1 text-sm" :class="apiError ? 'text-red-700' : 'text-yellow-700'">
                {{ errorMessage }}
            </p>
            <p v-if="!userInstitute && !apiError" class="mt-1 text-sm text-yellow-700">
                Please ensure your institute is registered before applying for a new educational
                programme.
            </p>
        </div>

        <form
            v-else
            @submit.prevent="handleSubmit"
            class="mt-8 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
        >
            <div class="form-section">
                <div class="section-header">
                    <BuildingOffice2Icon
                        class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Proponent Details</h3>
                        <p class="mt-1 text-xs text-gray-500">
                            Information about your registered institute.
                        </p>
                    </div>
                </div>
                <div class="section-content">
                    <ReadOnlyField
                        label="Training Institute Name"
                        :value="userInstitute.name_of_institution"
                    />
                    <ReadOnlyField label="Country" :value="userInstitute.country" />
                    <ReadOnlyField label="Dzongkhag/Thromde" :value="userInstitute.dzongkhag" />
                    <ReadOnlyField label="City/Gewog" :value="userInstitute.gewog" />
                    <ReadOnlyField label="Address/Location" :value="userInstitute.address" />
                    <ReadOnlyField label="Contact No." :value="userInstitute.contact_no" />
                    <ReadOnlyField label="Email Address" :value="userInstitute.email_address" />
                </div>
            </div>

            <div class="form-section">
                <div class="section-header border-t border-gray-200">
                    <UserCircleIcon
                        class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">
                            Head of Institution Details
                        </h3>
                        <p class="mt-1 text-xs text-gray-500">
                            Contact information for the head of the institute.
                        </p>
                    </div>
                </div>
                <div class="section-content">
                    <ReadOnlyField label="Name" :value="userInstitute.head_of_institution_name" />
                    <ReadOnlyField
                        label="Mobile Number"
                        :value="userInstitute.head_of_institution_phone_number"
                    />
                    <ReadOnlyField
                        label="Email Address"
                        :value="userInstitute.head_of_institution_email"
                    />
                </div>
            </div>

            <div class="form-section">
                <div class="section-header border-t border-gray-200">
                    <GlobeAltIcon
                        class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Website</h3>
                    </div>
                </div>
                <div class="section-content md:grid-cols-1">
                    <ReadOnlyField label="Website" :value="userInstitute.website || 'N/A'" />
                </div>
            </div>

            <div class="form-section">
                <div class="section-header border-t border-gray-200">
                    <DocumentTextIcon
                        class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Proposal Details</h3>
                        <p class="mt-1 text-xs text-gray-500">
                            Information about the proposed educational programme.
                        </p>
                    </div>
                </div>
                <div class="section-content">
                    <div>
                        <label for="proposalTitle" class="form-label required-label"
                            >Proposal Title</label
                        >
                        <input
                            type="text"
                            id="proposalTitle"
                            v-model="formData.course_title"
                            required
                            class="form-input"
                        />
                        <p v-if="validationErrors.course_title" class="form-error-message">
                            {{ validationErrors.course_title }}
                        </p>
                    </div>
                    <div>
                        <label for="duration" class="form-label required-label"
                            >Duration (in months)</label
                        >
                        <input
                            type="number"
                            id="duration"
                            v-model.number="formData.duration_in_months"
                            required
                            min="1"
                            class="form-input"
                        />
                        <p v-if="validationErrors.duration_in_months" class="form-error-message">
                            {{ validationErrors.duration_in_months }}
                        </p>
                    </div>
                    <div>
                        <label for="commencementDate" class="form-label required-label"
                            >Commencement Date</label
                        >
                        <input
                            type="date"
                            id="commencementDate"
                            v-model="formData.commencement_date"
                            required
                            class="form-input"
                            :min="todayDate"
                        />
                        <p v-if="validationErrors.commencement_date" class="form-error-message">
                            {{ validationErrors.commencement_date }}
                        </p>
                    </div>
                    <div>
                        <label for="attachments" class="form-label">Attachments (Optional)</label>
                        <input
                            type="file"
                            id="attachments"
                            @change="handleFileUpload"
                            class="form-file-input"
                        />
                        <p class="mt-1.5 text-xs text-gray-500">
                            You can attach relevant documents here.
                        </p>
                        <p v-if="selectedFileName" class="mt-1.5 text-xs text-green-600">
                            Selected: {{ selectedFileName }}
                        </p>
                    </div>
                    <div class="md:col-span-2">
                        <label for="remarks" class="form-label">Remarks</label>
                        <textarea
                            id="remarks"
                            v-model="formData.remarks"
                            rows="3"
                            class="form-textarea"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div class="p-6 md:p-8 border-t border-gray-200">
                <div class="flex items-start">
                    <div class="flex items-center h-5">
                        <input
                            id="declaration"
                            type="checkbox"
                            v-model="formData.ins_declaration"
                            required
                            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                    </div>
                    <div class="ml-3 text-sm">
                        <label for="declaration" class="font-medium text-gray-700 required-label"
                            >Declaration</label
                        >
                        <p class="text-gray-500 text-xs">
                            I hereby declare that the information provided above is true and correct
                            to the best of my knowledge.
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="p-6 md:p-8 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
                <button
                    type="button"
                    @click="handleCancel"
                    class="btn btn-outline w-full sm:w-auto"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    @click="handleSaveDraft"
                    :disabled="isSubmitting"
                    class="btn btn-outline border-yellow-400 text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500 w-full sm:w-auto"
                >
                    Save as Draft
                </button>
                <button
                    type="submit"
                    :disabled="isSubmitting || !formData.ins_declaration"
                    class="btn btn-primary w-full sm:w-auto"
                >
                    <Loader v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2 text-white" />
                    {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import ReadOnlyField from '@/components/common/MHPC/ReadOnlyField.vue' // Assuming you create this
import {
    BuildingOffice2Icon,
    UserCircleIcon,
    GlobeAltIcon,
    DocumentTextIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const userInstitute = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const validationErrors = ref({})
const selectedFileName = ref('')
const selectedFile = ref(null)

const formData = ref({
    course_title: '',
    duration_in_months: null,
    commencement_date: '',
    institute_attachments: null,
    remarks: '',
    ins_declaration: false,
    ins_renewal_review_name: '',
    ins_review_summary: '',
    ins_report: '',
    ins_review_decision: 'Pending',
    ins_reason_if_rejected: '',
    ins_remarks: '',
    is_active: true,
    institute: null,
    institute_name: '',
})

const userCid = computed(() => authStore.user?.cid || '')

const todayDate = computed(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
})

const fetchInstituteData = async () => {
    if (!userCid.value) {
        errorMessage.value = 'User information not available. Please log in again.'
        apiError.value = true
        isLoading.value = false
        return
    }
    isLoading.value = true
    apiError.value = false
    errorMessage.value = ''
    try {
        const response = await apiServices.getMhpcInstitutes({ params: { CID: userCid.value } })
        if (response.data?.results?.length > 0) {
            userInstitute.value = response.data.results[0]
            formData.value.institute = userInstitute.value.id
            formData.value.institute_name = userInstitute.value.name_of_institution
        } else {
            errorMessage.value =
                'No institute found for your CID. Please register your institute first.'
            userInstitute.value = null
        }
    } catch (error) {
        console.error('Error fetching institute data:', error)
        errorMessage.value =
            error.response?.data?.message || 'Error fetching institute data. Please try again.'
        apiError.value = true
    } finally {
        isLoading.value = false
    }
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        selectedFileName.value = file.name
        formData.value.institute_attachments = file
    } else {
        selectedFile.value = null
        selectedFileName.value = ''
        formData.value.institute_attachments = null
    }
}

const validateForm = () => {
    const errors = {}
    if (!formData.value.course_title.trim()) errors.course_title = 'Proposal title is required'
    if (!formData.value.duration_in_months || formData.value.duration_in_months <= 0)
        errors.duration_in_months = 'Duration must be a positive number'
    if (!formData.value.commencement_date)
        errors.commencement_date = 'Commencement date is required'
    else if (new Date(formData.value.commencement_date) < new Date(todayDate.value))
        errors.commencement_date = 'Commencement date cannot be in the past'

    validationErrors.value = errors
    return Object.keys(errors).length === 0
}

const prepareFormData = (isDraft = false) => {
    const submissionData = new FormData()
    Object.keys(formData.value).forEach((key) => {
        if (key === 'institute_attachments' && selectedFile.value) {
            submissionData.append(key, selectedFile.value)
        } else if (
            key !== 'institute_attachments' &&
            formData.value[key] !== null &&
            formData.value[key] !== undefined
        ) {
            submissionData.append(key, formData.value[key])
        }
    })
    if (isDraft) {
        submissionData.set('ins_review_decision', 'Draft')
    } else {
        submissionData.set('ins_review_decision', 'Pending')
    }
    submissionData.set('duration_in_months', Number(formData.value.duration_in_months) || 0)
    return submissionData
}

const handleSubmit = async () => {
    if (!validateForm() || !formData.value.ins_declaration) {
        toast.error(
            !formData.value.ins_declaration
                ? 'Please accept the declaration'
                : 'Please correct the errors in the form'
        )
        return
    }
    isSubmitting.value = true
    try {
        const submissionData = prepareFormData(false)
        await apiServices.createMhpcCourseDetail(submissionData)
        toast.success('Educational programme application submitted successfully!')
        router.push('/mhpc/course-applications')
    } catch (error) {
        console.error('Error submitting form:', error.response || error)
        validationErrors.value = error.response?.data?.errors || {}
        toast.error(
            error.response?.data?.message || 'Failed to submit application. Please try again.'
        )
    } finally {
        isSubmitting.value = false
    }
}

const handleSaveDraft = async () => {
    isSubmitting.value = true
    try {
        const draftData = prepareFormData(true)
        await apiServices.createMhpcCourseDetail(draftData)
        toast.success('Draft saved successfully!')
    } catch (error) {
        console.error('Error saving draft:', error.response || error)
        toast.error(error.response?.data?.message || 'Failed to save draft. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

const handleCancel = () => {
    router.go(-1)
}

onMounted(fetchInstituteData)
</script>

<style scoped>
.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.required-label::after {
    content: ' *';
    color: #dc2626;
    margin-left: 2px;
}
.form-input,
.form-select,
.form-textarea {
    @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.form-file-input {
    @apply block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed;
}
.form-error-message {
    @apply mt-1.5 text-xs text-red-600;
}

.readonly-field-container {
    @apply mt-1;
}
.readonly-field-value {
    @apply block w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-md shadow-sm sm:text-sm text-gray-700;
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
.section-content {
    @apply p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6;
}
</style>
