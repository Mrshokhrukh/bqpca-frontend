<template>
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
        <InstituteHeader
            title="Course Management"
            subtitle="Add, view, and manage educational courses for registered institutes."
            :show-actions="false"
        />

        <div class="mt-8">
            <div class="flex justify-end mb-6">
                <button @click="openAddModal" type="button" class="btn btn-primary">
                    <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
                    Add New Course
                </button>
            </div>

            <div
                v-if="pageError"
                class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm"
            >
                <div class="flex">
                    <div class="flex-shrink-0">
                        <XCircleIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-semibold text-red-800">Operation Failed</h3>
                        <p class="mt-1 text-sm text-red-700">{{ pageError }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <CorsTableView />
            </div>
        </div>

        <Transition name="modal-fade">
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    @click="closeModal"
                    aria-hidden="true"
                ></div>

                <div
                    class="relative w-full max-w-xl bg-white rounded-xl shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="isEditing ? 'modal-title-edit' : 'modal-title-add'"
                    @click.stop
                >
                    <div
                        class="py-5 px-6 md:px-8 bg-gray-50 rounded-t-xl border-b border-gray-200 flex items-center justify-between"
                    >
                        <div class="flex items-center">
                            <div class="p-2 bg-indigo-100 rounded-lg mr-3">
                                <AcademicCapIcon
                                    class="w-6 h-6 text-indigo-600"
                                    aria-hidden="true"
                                />
                            </div>
                            <div>
                                <h2
                                    :id="isEditing ? 'modal-title-edit' : 'modal-title-add'"
                                    class="text-lg font-semibold text-gray-900"
                                >
                                    {{ isEditing ? 'Edit Course' : 'Add New Course' }}
                                </h2>
                                <p class="text-xs text-gray-500">
                                    {{
                                        isEditing
                                            ? 'Update the details for this course.'
                                            : 'Fill in the details to propose a new course.'
                                    }}
                                </p>
                            </div>
                        </div>
                        <button
                            @click="closeModal"
                            class="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <span class="sr-only">Close</span>
                            <XMarkIcon class="w-6 h-6" aria-hidden="true" />
                        </button>
                    </div>

                    <form @submit.prevent="submitCourse" class="p-6 md:p-8">
                        <div
                            v-if="modalError"
                            class="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700"
                        >
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div class="ml-2">
                                    {{ modalError }}
                                </div>
                            </div>
                        </div>

                        <div class="space-y-5">
                            <div>
                                <label for="courseName" class="form-label required-label"
                                    >Course Name</label
                                >
                                <input
                                    type="text"
                                    id="courseName"
                                    v-model="formState.courseName"
                                    required
                                    class="form-input"
                                    :aria-describedby="
                                        fieldErrors.courseName ? 'courseName-error' : null
                                    "
                                />
                                <p
                                    v-if="fieldErrors.courseName"
                                    id="courseName-error"
                                    class="form-error-message"
                                >
                                    {{ fieldErrors.courseName }}
                                </p>
                            </div>

                            <div>
                                <label for="institute" class="form-label required-label"
                                    >Institute</label
                                >
                                <select
                                    id="institute"
                                    v-model="formState.selectedInstitute"
                                    required
                                    :disabled="isLoadingInstitutes"
                                    class="form-select"
                                    :aria-describedby="
                                        fieldErrors.selectedInstitute ? 'institute-error' : null
                                    "
                                >
                                    <option disabled value="">
                                        {{
                                            isLoadingInstitutes
                                                ? 'Loading institutes...'
                                                : 'Please select an institute'
                                        }}
                                    </option>
                                    <option
                                        v-for="institute in institutes"
                                        :key="institute.id"
                                        :value="institute.id"
                                    >
                                        {{ institute.name }}
                                    </option>
                                    <option
                                        v-if="
                                            !isLoadingInstitutes &&
                                            institutes.length === 0 &&
                                            !pageError
                                        "
                                        disabled
                                        value=""
                                    >
                                        No institutes available or registered.
                                    </option>
                                    <option
                                        v-if="
                                            !isLoadingInstitutes &&
                                            institutes.length === 0 &&
                                            pageError
                                        "
                                        disabled
                                        value=""
                                    >
                                        Could not load institutes.
                                    </option>
                                </select>
                                <p
                                    v-if="fieldErrors.selectedInstitute"
                                    id="institute-error"
                                    class="form-error-message"
                                >
                                    {{ fieldErrors.selectedInstitute }}
                                </p>
                            </div>

                            <div>
                                <label for="courseTitle" class="form-label required-label"
                                    >Course Title</label
                                >
                                <input
                                    type="text"
                                    id="courseTitle"
                                    v-model="formState.courseTitle"
                                    required
                                    class="form-input"
                                    :aria-describedby="
                                        fieldErrors.courseTitle ? 'courseTitle-error' : null
                                    "
                                />
                                <p
                                    v-if="fieldErrors.courseTitle"
                                    id="courseTitle-error"
                                    class="form-error-message"
                                >
                                    {{ fieldErrors.courseTitle }}
                                </p>
                            </div>

                            <div>
                                <label for="duration" class="form-label required-label"
                                    >Duration (months)</label
                                >
                                <input
                                    type="number"
                                    id="duration"
                                    v-model.number="formState.duration"
                                    required
                                    min="1"
                                    class="form-input"
                                    :aria-describedby="
                                        fieldErrors.duration ? 'duration-error' : null
                                    "
                                />
                                <p
                                    v-if="fieldErrors.duration"
                                    id="duration-error"
                                    class="form-error-message"
                                >
                                    {{ fieldErrors.duration }}
                                </p>
                            </div>

                            <div>
                                <label for="commencementDate" class="form-label required-label"
                                    >Commencement Date</label
                                >
                                <input
                                    type="date"
                                    id="commencementDate"
                                    v-model="formState.commencementDate"
                                    required
                                    class="form-input"
                                    :min="todayDate"
                                    :aria-describedby="
                                        fieldErrors.commencementDate
                                            ? 'commencementDate-error'
                                            : null
                                    "
                                />
                                <p
                                    v-if="fieldErrors.commencementDate"
                                    id="commencementDate-error"
                                    class="form-error-message"
                                >
                                    {{ fieldErrors.commencementDate }}
                                </p>
                            </div>

                            <div>
                                <label for="attachments" class="form-label"
                                    >Institute Attachments (Optional)</label
                                >
                                <input
                                    type="file"
                                    id="attachments"
                                    @change="handleFileUpload"
                                    class="form-file-input"
                                    :aria-describedby="
                                        fieldErrors.attachments ? 'attachments-error' : null
                                    "
                                />
                                <p
                                    v-if="formState.attachmentFile"
                                    class="mt-1.5 text-xs text-green-600"
                                >
                                    Selected: {{ formState.attachmentFile.name }}
                                </p>
                                <p
                                    v-if="fieldErrors.attachments"
                                    id="attachments-error"
                                    class="form-error-message"
                                >
                                    {{ fieldErrors.attachments }}
                                </p>
                            </div>

                            <div>
                                <label for="remarks" class="form-label">Remarks</label>
                                <textarea
                                    id="remarks"
                                    v-model="formState.remarks"
                                    rows="3"
                                    class="form-textarea"
                                ></textarea>
                            </div>

                            <div class="pt-2">
                                <div class="flex items-start">
                                    <div class="flex items-center h-5">
                                        <input
                                            id="declaration"
                                            type="checkbox"
                                            v-model="formState.declaration"
                                            required
                                            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label
                                            for="declaration"
                                            class="font-medium text-gray-700 required-label"
                                            >Declaration</label
                                        >
                                        <p class="text-gray-500 text-xs">
                                            I hereby declare that the information provided is true
                                            and correct to the best of my knowledge.
                                        </p>
                                    </div>
                                </div>
                                <p v-if="fieldErrors.declaration" class="form-error-message">
                                    {{ fieldErrors.declaration }}
                                </p>
                            </div>
                        </div>

                        <div
                            class="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0"
                        >
                            <button
                                type="button"
                                @click="closeModal"
                                class="btn btn-outline w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                :disabled="isSubmitting || !formState.declaration"
                                class="btn btn-primary w-full sm:w-auto"
                            >
                                <Loader
                                    v-if="isSubmitting"
                                    class="animate-spin h-5 w-5 mr-2 text-white"
                                />
                                {{
                                    isSubmitting
                                        ? 'Submitting...'
                                        : isEditing
                                        ? 'Update Course'
                                        : 'Submit Course'
                                }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import apiServices from '@/services/services.js'
import CorsTableView from '@/components/dashboard/mhpccomponents/institutions/CourseTableView.vue'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import { Loader } from 'lucide-vue-next'
import { PlusIcon, XMarkIcon, AcademicCapIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const isLoadingInstitutes = ref(false)
const institutes = ref([])
const pageError = ref(null)
const modalError = ref(null)
const fieldErrors = reactive({})

const formState = reactive({
    id: null,
    courseName: '',
    selectedInstitute: '',
    courseTitle: '',
    duration: null,
    commencementDate: '',
    attachmentFile: null,
    remarks: '',
    declaration: false,
})

const todayDate = computed(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
})

const resetForm = () => {
    formState.id = null
    formState.courseName = ''
    formState.selectedInstitute = ''
    formState.courseTitle = ''
    formState.duration = null
    formState.commencementDate = ''
    formState.attachmentFile = null
    formState.remarks = ''
    formState.declaration = false
    isEditing.value = false
    modalError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])

    const fileInput = document.getElementById('attachments')
    if (fileInput) {
        fileInput.value = ''
    }
}

const openAddModal = () => {
    resetForm()
    isEditing.value = false
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const fetchInstitutes = async () => {
    isLoadingInstitutes.value = true
    pageError.value = null
    institutes.value = []
    try {
        const response = await apiServices.getMhpcInstitutes()
        let rawInstituteList = []

        if (response?.data?.results && Array.isArray(response.data.results)) {
            rawInstituteList = response.data.results
        } else if (response?.data && Array.isArray(response.data)) {
            rawInstituteList = response.data
        } else if (Array.isArray(response)) {
            rawInstituteList = response
        } else {
            pageError.value = 'Failed to load institutes: Unexpected data format from server.'
            isLoadingInstitutes.value = false
            return
        }

        institutes.value = rawInstituteList
            .filter((inst) => inst && inst.id && inst.name_of_institution)
            .map((inst) => ({
                id: inst.id,
                name: inst.name_of_institution,
            }))

        if (institutes.value.length === 0 && !pageError.value) {
            pageError.value =
                'No institutes are currently registered or available for selection. Please ensure institutes are added before creating courses.'
        }
    } catch (err) {
        console.error('Error fetching institutes:', err)
        pageError.value = `Failed to load institutes: ${
            err.message || 'Network error'
        }. Please try again later.`
        institutes.value = []
    } finally {
        isLoadingInstitutes.value = false
    }
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        formState.attachmentFile = file
    } else {
        formState.attachmentFile = null
    }
}

const validateForm = () => {
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])
    let isValid = true

    if (!formState.courseName.trim()) {
        fieldErrors.courseName = 'Course name is required.'
        isValid = false
    }
    if (!formState.selectedInstitute) {
        fieldErrors.selectedInstitute = 'Please select an institute.'
        isValid = false
    }
    if (!formState.courseTitle.trim()) {
        fieldErrors.courseTitle = 'Course title is required.'
        isValid = false
    }
    if (formState.duration === null || formState.duration <= 0) {
        fieldErrors.duration = 'Duration must be a positive number.'
        isValid = false
    }
    if (!formState.commencementDate) {
        fieldErrors.commencementDate = 'Commencement date is required.'
        isValid = false
    } else if (new Date(formState.commencementDate) < new Date(todayDate.value)) {
        fieldErrors.commencementDate = 'Commencement date cannot be in the past.'
        isValid = false
    }
    if (!formState.declaration) {
        fieldErrors.declaration = 'You must accept the declaration.'
        modalError.value = 'Please accept the declaration to proceed.'
        isValid = false
    }
    return isValid
}

const submitCourse = async () => {
    modalError.value = null
    Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])

    if (!validateForm()) {
        if (!fieldErrors.declaration) {
            modalError.value = modalError.value || 'Please correct the errors highlighted below.'
        }
        return
    }

    isSubmitting.value = true

    const formDataPayload = new FormData()
    formDataPayload.append('course_name', formState.courseName)
    formDataPayload.append('institute', formState.selectedInstitute)
    formDataPayload.append('course_title', formState.courseTitle)
    if (formState.duration !== null) {
        formDataPayload.append('duration_in_months', formState.duration)
    }
    formDataPayload.append('commencement_date', formState.commencementDate)
    formDataPayload.append('remarks', formState.remarks)
    formDataPayload.append('ins_declaration', formState.declaration)

    if (formState.attachmentFile) {
        formDataPayload.append(
            'institute_attachments',
            formState.attachmentFile,
            formState.attachmentFile.name
        )
    }

    formDataPayload.append('is_active', true) // Default, or make it configurable
    formDataPayload.append('ins_review_decision', 'Pending') // Default status

    try {
        if (isEditing.value && formState.id) {
            // await apiServices.updateMhpcCourseDetail(formState.id, formDataPayload)
            alert('Course updated successfully! (Functionality to be fully implemented)')
        } else {
            await apiServices.createMhpcCourseDetail(formDataPayload)
            alert('Course submitted successfully!')
        }
        closeModal()
        // Consider refreshing CorsTableView, e.g., by emitting an event or if it fetches on its own
    } catch (err) {
        console.error('Error submitting course:', err)
        if (
            err.response?.data &&
            typeof err.response.data === 'object' &&
            err.response.status === 400
        ) {
            const errors = err.response.data
            const errorKeyMapping = {
                course_name: 'courseName',
                institute: 'selectedInstitute',
                course_title: 'courseTitle',
                duration_in_months: 'duration',
                commencement_date: 'commencementDate',
                institute_attachments: 'attachments',
                remarks: 'remarks',
                ins_declaration: 'declaration',
            }
            let unhandledErrors = []
            for (const apiKey in errors) {
                if (errors[apiKey] && Array.isArray(errors[apiKey]) && errors[apiKey].length > 0) {
                    const formKey = errorKeyMapping[apiKey]
                    if (formKey) {
                        fieldErrors[formKey] = errors[apiKey][0]
                    } else {
                        unhandledErrors.push(`${apiKey.replace(/_/g, ' ')}: ${errors[apiKey][0]}`)
                    }
                } else if (typeof errors[apiKey] === 'string') {
                    const formKey = errorKeyMapping[apiKey]
                    if (formKey) {
                        fieldErrors[formKey] = errors[apiKey]
                    } else {
                        unhandledErrors.push(`${apiKey.replace(/_/g, ' ')}: ${errors[apiKey]}`)
                    }
                }
            }
            if (unhandledErrors.length > 0) {
                modalError.value = `Please correct the following: ${unhandledErrors.join('; ')}`
            } else if (Object.keys(fieldErrors).length > 0) {
                modalError.value = 'Please correct the errors highlighted below.'
            } else {
                modalError.value = 'An unknown validation error occurred.'
            }
        } else {
            modalError.value = `Failed to submit course: ${
                err.response?.data?.detail || err.message || 'Unknown server error'
            }`
        }
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    fetchInstitutes()
})
</script>

<style scoped>
.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.required-label::after {
    content: ' *';
    color: #dc2626; /* text-red-600 */
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

.btn {
    @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed;
}
.btn-primary {
    @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
    @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-enter-from .relative, /* Target the modal panel for scale/translate */
.modal-fade-leave-to .relative {
    transform: scale(0.95) translateY(20px);
}
</style>
