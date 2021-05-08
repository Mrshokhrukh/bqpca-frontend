<template>
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
        <InstituteHeader
            title="New Teaching Center Application"
            subtitle="Complete the form below to apply for a new teaching center."
            :show-actions="false"
        />

        <form
            @submit.prevent="handleSubmit"
            class="mt-8 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
            enctype="multipart/form-data"
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
                            Information about the training institute applying.
                        </p>
                    </div>
                </div>
                <div class="section-content">
                    <div>
                        <label for="trainingInstituteName" class="form-label required-label"
                            >Training Institute Name</label
                        >
                        <select
                            id="trainingInstituteName"
                            v-model="formData.institute_id"
                            class="form-select"
                            required
                            :disabled="isLoadingOptions"
                        >
                            <option value="" disabled>
                                {{
                                    isLoadingOptions ? 'Loading institutes...' : 'Select Institute'
                                }}
                            </option>
                            <option
                                v-for="institute in instituteOptions"
                                :key="institute.value"
                                :value="institute.value"
                            >
                                {{ institute.label }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="country" class="form-label">Country</label>
                        <input
                            type="text"
                            id="country"
                            v-model="formData.country"
                            disabled
                            class="form-input bg-gray-100"
                        />
                    </div>
                    <div>
                        <label for="dzongkhag" class="form-label">Dzongkhag/Thromde</label>
                        <input
                            type="text"
                            id="dzongkhag"
                            v-model="formData.dzongkhag"
                            disabled
                            class="form-input bg-gray-100"
                        />
                    </div>
                    <div>
                        <label for="cityGewogProponent" class="form-label">City/Gewog</label>
                        <input
                            type="text"
                            id="cityGewogProponent"
                            v-model="formData.cityGewog"
                            disabled
                            class="form-input bg-gray-100"
                        />
                    </div>
                    <div>
                        <label for="addressLocation" class="form-label">Address/Location</label>
                        <input
                            type="text"
                            id="addressLocation"
                            v-model="formData.addressLocation"
                            class="form-input"
                        />
                    </div>
                    <div>
                        <label for="contactNo" class="form-label">Contact No.</label>
                        <input
                            type="text"
                            id="contactNo"
                            v-model="formData.contactNo"
                            class="form-input"
                        />
                    </div>
                    <div>
                        <label for="emailAddress" class="form-label">Email Address</label>
                        <input
                            type="email"
                            id="emailAddress"
                            v-model="formData.emailAddress"
                            class="form-input"
                        />
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="section-header border-t border-gray-200">
                    <AcademicCapIcon
                        class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Teaching Center Details</h3>
                        <p class="mt-1 text-xs text-gray-500">
                            Specifics of the proposed teaching center.
                        </p>
                    </div>
                </div>
                <div class="section-content">
                    <div>
                        <label for="centerName" class="form-label required-label"
                            >Center Name</label
                        >
                        <input
                            type="text"
                            id="centerName"
                            v-model="formData.center_name"
                            class="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label for="centerLocation" class="form-label required-label"
                            >Center Location</label
                        >
                        <input
                            type="text"
                            id="centerLocation"
                            v-model="formData.center_location"
                            class="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label for="cityGewogCenter" class="form-label required-label"
                            >City/Gewog</label
                        >
                        <select
                            id="cityGewogCenter"
                            v-model="formData.city_gewog"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select City/Gewog</option>
                            <option
                                v-for="city in cityGewogOptions"
                                :key="city.value"
                                :value="city.value"
                            >
                                {{ city.label }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="stateDzongkhag" class="form-label required-label"
                            >State/Dzongkhag</label
                        >
                        <select
                            id="stateDzongkhag"
                            v-model="formData.state_dzongkhag"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select Dzongkhag</option>
                            <option
                                v-for="dzongkhag in dzongkhagOptions"
                                :key="dzongkhag.value"
                                :value="dzongkhag.value"
                            >
                                {{ dzongkhag.label }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="targetCategory" class="form-label required-label"
                            >Target Category</label
                        >
                        <input
                            type="text"
                            id="targetCategory"
                            v-model="formData.target_category"
                            class="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label for="tcRenewalReviewName" class="form-label required-label"
                            >Renewal Review Name</label
                        >
                        <input
                            type="text"
                            id="tcRenewalReviewName"
                            v-model="formData.tc_renewal_review_name"
                            class="form-input"
                            required
                        />
                    </div>
                    <div class="md:col-span-2">
                        <label for="tcReviewSummary" class="form-label required-label"
                            >Review Summary</label
                        >
                        <textarea
                            id="tcReviewSummary"
                            v-model="formData.tc_review_summary"
                            rows="3"
                            class="form-textarea"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label for="validTill" class="form-label required-label">Valid Till</label>
                        <input
                            type="date"
                            id="validTill"
                            v-model="formData.valid_till"
                            class="form-input"
                            required
                            :min="todayDate"
                        />
                    </div>
                    <div>
                        <label for="paymentId" class="form-label required-label">Payment ID</label>
                        <input
                            type="text"
                            id="paymentId"
                            v-model="formData.payment_id"
                            class="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label for="tcAttachments" class="form-label required-label"
                            >Attachments</label
                        >
                        <input
                            type="file"
                            id="tcAttachments"
                            @change="handleAttachmentChange"
                            multiple
                            required
                            class="form-file-input"
                        />
                        <p class="mt-1.5 text-xs text-gray-500">
                            Attach relevant documents. Multiple files can be selected.
                        </p>
                    </div>
                    <div>
                        <label for="tcReportFile" class="form-label required-label"
                            >Report File</label
                        >
                        <input
                            type="file"
                            id="tcReportFile"
                            @change="handleReportFileChange"
                            class="form-file-input"
                            required
                        />
                        <p class="mt-1.5 text-xs text-gray-500">Attach the main report file.</p>
                    </div>
                    <div class="md:col-span-2">
                        <label for="tcRemarks" class="form-label required-label"
                            >Teaching Center Remarks</label
                        >
                        <textarea
                            id="tcRemarks"
                            v-model="formData.tc_remarks"
                            rows="3"
                            class="form-textarea"
                            required
                        ></textarea>
                    </div>
                    <div class="md:col-span-2">
                        <label for="remarks" class="form-label">Remarks (General)</label>
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
                            aria-describedby="declaration-description"
                            type="checkbox"
                            v-model="formData.declaration"
                            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div class="ml-3 text-sm">
                        <label for="declaration" class="font-medium text-gray-700 required-label"
                            >Declaration</label
                        >
                        <p id="declaration-description" class="text-gray-500 text-xs">
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
                    class="btn btn-outline border-yellow-400 text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500 w-full sm:w-auto"
                >
                    Save as Draft
                </button>
                <button
                    type="submit"
                    :disabled="!formData.declaration || isSubmitting"
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
import { ref, watch, onMounted, computed } from 'vue'
import apiServices from '@/services/services'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import { BuildingOffice2Icon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import { Loader } from 'lucide-vue-next' // Assuming you use lucide for loader

const isLoadingOptions = ref(true)
const isSubmitting = ref(false)

const formData = ref({
    institute_id: '',
    country: 'Bhutan',
    dzongkhag: '',
    cityGewog: '',
    addressLocation: '',
    contactNo: '',
    emailAddress: '',
    center_name: '',
    center_location: '',
    city_gewog: '',
    state_dzongkhag: '',
    target_category: '',
    tc_attachments: null,
    tc_report: null,
    remarks: '',
    tc_remarks: '',
    tc_renewal_review_name: '',
    tc_review_summary: '',
    valid_till: '',
    payment_id: '',
    declaration: false,
})

const instituteOptions = ref([])
const cityGewogOptions = ref([
    { value: 'Thimphu Thromde', label: 'Thimphu Thromde' },
    { value: 'Changzamtog', label: 'Changzamtog' },
    { value: 'Motithang', label: 'Motithang' },
    { value: 'Paro Thromde', label: 'Paro Thromde' },
    { value: 'Phuentsholing Thromde', label: 'Phuentsholing Thromde' },
])
const dzongkhagOptions = ref([
    { value: 'Thimphu', label: 'Thimphu' },
    { value: 'Paro', label: 'Paro' },
    { value: 'Chukha', label: 'Chukha (Phuentsholing)' },
    { value: 'Haa', label: 'Haa' },
])

const todayDate = computed(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
})

onMounted(async () => {
    isLoadingOptions.value = true
    try {
        const institutesResponse = await apiServices.getMhpcInstitutes()
        const institutesArray = institutesResponse.data?.results || []
        instituteOptions.value = institutesArray.map((institute) => ({
            value: institute.id,
            label: institute.name_of_institution,
            data: institute,
        }))
    } catch (error) {
        console.error('Error fetching institute options:', error)
        alert('Failed to load institute options. Please check the console.')
    } finally {
        isLoadingOptions.value = false
    }
})

watch(
    () => formData.value.institute_id,
    (newValue) => {
        const selectedInstituteFull = instituteOptions.value.find((inst) => inst.value === newValue)
        if (selectedInstituteFull && selectedInstituteFull.data) {
            const instData = selectedInstituteFull.data
            formData.value.country = instData.country || 'Bhutan'
            formData.value.dzongkhag = instData.dzongkhag || ''
            formData.value.cityGewog = instData.gewog || ''
            formData.value.addressLocation = instData.location || ''
            formData.value.contactNo = instData.contact_no || ''
            formData.value.emailAddress = instData.email_address || ''
        } else {
            formData.value.country = 'Bhutan'
            formData.value.dzongkhag = ''
            formData.value.cityGewog = ''
            formData.value.addressLocation = ''
            formData.value.contactNo = ''
            formData.value.emailAddress = ''
        }
    }
)

const handleAttachmentChange = (event) => {
    formData.value.tc_attachments = event.target.files
}

const handleReportFileChange = (event) => {
    formData.value.tc_report = event.target.files[0]
}

const resetForm = () => {
    formData.value = {
        institute_id: '',
        country: 'Bhutan',
        dzongkhag: '',
        cityGewog: '',
        addressLocation: '',
        contactNo: '',
        emailAddress: '',
        center_name: '',
        center_location: '',
        city_gewog: '',
        state_dzongkhag: '',
        target_category: '',
        tc_attachments: null,
        tc_report: null,
        remarks: '',
        tc_remarks: '',
        tc_renewal_review_name: '',
        tc_review_summary: '',
        valid_till: '',
        payment_id: '',
        declaration: false,
    }
    const fileInputs = document.querySelectorAll('input[type="file"]')
    fileInputs.forEach((input) => (input.value = ''))
}

const handleSubmit = async () => {
    if (!formData.value.declaration) {
        alert('Please declare that the information is correct before submitting.')
        return
    }
    isSubmitting.value = true
    const formPayload = new FormData()
    Object.keys(formData.value).forEach((key) => {
        if (key === 'tc_attachments' && formData.value.tc_attachments) {
            for (let i = 0; i < formData.value.tc_attachments.length; i++) {
                formPayload.append('tc_attachments', formData.value.tc_attachments[i])
            }
        } else if (key === 'tc_report' && formData.value.tc_report) {
            formPayload.append('tc_report', formData.value.tc_report)
        } else if (formData.value[key] !== null && formData.value[key] !== undefined) {
            formPayload.append(key, formData.value[key])
        }
    })

    try {
        await apiServices.createMhpcTeachingCenter(formPayload)
        alert('Application submitted successfully!')
        resetForm()
    } catch (error) {
        console.error('Error submitting form:', error.response || error)
        alert('Error submitting application. Please check the console for details.')
    } finally {
        isSubmitting.value = false
    }
}

const handleCancel = () => {
    resetForm()
}

const handleSaveDraft = async () => {
    isSubmitting.value = true
    const draftPayload = { ...formData.value, is_draft: true }

    const formPayload = new FormData()
    Object.keys(draftPayload).forEach((key) => {
        if (key === 'tc_attachments' && draftPayload.tc_attachments) {
            for (let i = 0; i < draftPayload.tc_attachments.length; i++) {
                formPayload.append('tc_attachments', draftPayload.tc_attachments[i])
            }
        } else if (key === 'tc_report' && draftPayload.tc_report) {
            formPayload.append('tc_report', draftPayload.tc_report)
        } else if (draftPayload[key] !== null && draftPayload[key] !== undefined) {
            formPayload.append(key, draftPayload[key])
        }
    })

    try {
        await apiServices.createMhpcTeachingCenter(formPayload)
        alert('Draft saved successfully!')
    } catch (error) {
        console.error('Error saving draft:', error.response || error)
        alert('Error saving draft. Please check the console for details.')
    } finally {
        isSubmitting.value = false
    }
}
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
