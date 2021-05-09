<template>
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
        <InstituteHeader
            title="Teaching Center Tracker & Renewal"
            subtitle="Track and renew your teaching center registrations"
            :show-actions="false"
        />

        <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] mt-8">
            <Loader class="animate-spin text-indigo-600 w-10 h-10" />
            <p class="mt-4 text-lg font-medium text-gray-700">Loading teaching center data...</p>
        </div>

        <div
            v-else-if="apiError"
            class="mt-8 text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-sm"
        >
            <p class="text-red-700 text-lg font-medium">{{ errorMessage }}</p>
            <p class="text-red-600 text-sm mt-2">
                Please try refreshing the page or contact support.
            </p>
            <button
                @click="fetchData"
                class="mt-6 btn btn-outline border-red-300 text-red-700 hover:bg-red-100 focus:ring-red-500"
            >
                Try Again
            </button>
        </div>

        <div
            v-else-if="!filteredTeachingCenters.length"
            class="mt-8 text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
            <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    vector-effect="non-scaling-stroke"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No Teaching Centers Found</h3>
            <p class="mt-1 text-sm text-gray-500">
                No teaching centers associated with your institute are currently registered.
            </p>
            <p class="mt-1 text-sm text-gray-500">
                Please register a teaching center to view and manage it here.
            </p>
        </div>

        <div v-else class="space-y-8 mt-8">
            <div
                v-for="center in filteredTeachingCenters"
                :key="center.id"
                class="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
            >
                <div class="p-6 md:p-8">
                    <div class="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 mb-1">
                                {{ center.center_name }}
                            </h3>
                            <p class="text-sm text-gray-500 flex items-center space-x-2">
                                <span>{{
                                    center.is_active
                                        ? 'Active Registration'
                                        : 'Registration Inactive'
                                }}</span>
                                <span class="text-gray-300">•</span>
                                <span
                                    :class="[
                                        'px-2.5 py-0.5 text-xs font-medium rounded-full',
                                        isRenewal(center)
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800',
                                    ]"
                                >
                                    {{ isRenewal(center) ? 'Renewal Cycle' : 'New Application' }}
                                </span>
                            </p>
                        </div>
                        <div class="text-right text-sm">
                            <p class="text-gray-500">Center ID</p>
                            <p class="font-medium text-gray-800">{{ center.id }}</p>
                        </div>
                    </div>

                    <div
                        v-if="center.is_active && getDaysUntilExpiration(center) <= 90"
                        class="mb-6 p-4 rounded-lg flex items-start"
                        :class="[
                            getDaysUntilExpiration(center) <= 0
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : getDaysUntilExpiration(center) <= 30
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200',
                        ]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 flex-shrink-0 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <div class="ml-3">
                            <h3 class="text-sm font-semibold">
                                {{
                                    getDaysUntilExpiration(center) <= 0
                                        ? 'Registration Expired!'
                                        : getDaysUntilExpiration(center) <= 30
                                        ? 'Registration Expiring Soon!'
                                        : 'Registration Renewal Recommended'
                                }}
                            </h3>
                            <p class="mt-1 text-xs">
                                {{
                                    getDaysUntilExpiration(center) <= 0
                                        ? 'Your teaching center registration has expired. Please renew immediately.'
                                        : `Expires in ${getDaysUntilExpiration(
                                              center
                                          )} days (${formatDate(
                                              center.valid_till
                                          )}). Please renew to maintain status.`
                                }}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                Registration Details
                            </h4>
                            <InfoItem
                                label="Status"
                                :value="center.is_active ? 'Active' : 'Pending'"
                                :valueClass="
                                    center.is_active ? 'text-green-600' : 'text-yellow-600'
                                "
                            />
                            <InfoItem label="Valid From" :value="formatDate(center.valid_since)">
                                <button
                                    v-if="!center.valid_since && center.is_active"
                                    @click="setDefaultDates(center)"
                                    class="ml-2 text-xs text-indigo-600 hover:underline"
                                >
                                    Set Default
                                </button>
                            </InfoItem>
                            <InfoItem
                                label="Valid Until"
                                :value="formatDate(center.valid_till)"
                                :valueClass="getExpirationTextClass(center)"
                            />
                            <InfoItem
                                label="Review Decision"
                                :value="center.tc_review_decision || 'N/A'"
                                :valueClass="getReviewDecisionClass(center.tc_review_decision)"
                            />
                        </div>

                        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h4 class="text-sm font-semibold text-gray-700 mb-2">
                                Center Information
                            </h4>
                            <InfoItem label="Institute" :value="center.institute_name" />
                            <InfoItem
                                label="Location"
                                :value="`${center.center_location}, ${center.state_dzongkhag}`"
                            />
                            <InfoItem label="City/Gewog" :value="center.city_gewog" />
                            <InfoItem label="Target Category" :value="center.target_category" />
                        </div>
                    </div>

                    <div
                        v-if="center.payment_id"
                        class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                        <h4 class="text-sm font-semibold text-gray-700 mb-2">
                            Payment Information
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            <InfoItem label="Payment ID" :value="center.payment_id" />
                            <InfoItem
                                label="Payment Status"
                                :value="center.is_payment_complete ? 'Completed' : 'Pending'"
                                :valueClass="
                                    center.is_payment_complete
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                "
                            />
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-100">
                        <div
                            v-if="isRenewalInProgress(center)"
                            class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm"
                        >
                            <h4 class="font-semibold">Renewal In Progress</h4>
                            <p class="mt-1">
                                Your renewal application is under review. You will be notified upon
                                completion.
                            </p>
                        </div>
                        <div
                            v-else-if="!center.is_active && center.tc_review_decision === 'Pending'"
                            class="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm"
                        >
                            <h4 class="font-semibold">Application In Progress</h4>
                            <p class="mt-1">
                                Your application is under review. You will be notified upon
                                completion.
                            </p>
                        </div>
                        <div
                            v-else-if="
                                center.tc_review_decision === 'Rejected' &&
                                center.tc_reason_if_rejected
                            "
                            class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                        >
                            <h4 class="font-semibold">Application Rejected</h4>
                            <p class="mt-1">Reason: {{ center.tc_reason_if_rejected }}</p>
                            <button
                                @click="openRenewalDialog(center)"
                                class="mt-3 btn btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500 text-xs"
                            >
                                Apply Again
                            </button>
                        </div>

                        <div class="flex justify-end items-center space-x-3 mt-4">
                            <button
                                v-if="center.is_active"
                                @click="openCertificateDialog(center)"
                                class="btn btn-outline"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                View Certificate
                            </button>
                            <button
                                v-if="
                                    center.is_active &&
                                    getDaysUntilExpiration(center) <= 90 &&
                                    !isRenewalInProgress(center) &&
                                    center.tc_review_decision !== 'Rejected'
                                "
                                @click="openRenewalDialog(center)"
                                class="btn btn-primary"
                                :class="{
                                    'animate-pulse bg-orange-500 hover:bg-orange-600':
                                        getDaysUntilExpiration(center) <= 30,
                                }"
                            >
                                Renew Center
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showRenewalDialog"
            class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
            <div
                class="bg-white rounded-xl shadow-xl p-6 md:p-8 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <h3 class="text-xl font-bold text-gray-900 mb-6">
                    Teaching Center Renewal Application
                </h3>
                <form @submit.prevent="confirmRenewal" class="space-y-6">
                    <div v-if="selectedCenter" class="space-y-4">
                        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p class="text-sm font-medium text-gray-700">
                                Center Name:
                                <span class="font-normal text-gray-900">{{
                                    selectedCenter.center_name
                                }}</span>
                            </p>
                            <p class="text-sm font-medium text-gray-700">
                                Location:
                                <span class="font-normal text-gray-900">{{
                                    selectedCenter.center_location
                                }}</span>
                            </p>
                        </div>

                        <div>
                            <label for="attachments" class="form-label"
                                >Attachments (Optional)</label
                            >
                            <input
                                type="file"
                                id="attachments"
                                @change="handleFileUpload"
                                class="form-file-input"
                            />
                            <p v-if="selectedFileName" class="mt-1.5 text-xs text-green-600">
                                Selected: {{ selectedFileName }}
                            </p>
                        </div>

                        <div>
                            <label for="remarks" class="form-label">Remarks</label>
                            <textarea
                                id="remarks"
                                v-model="renewalFormData.remarks"
                                rows="3"
                                class="form-textarea"
                            ></textarea>
                        </div>

                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    id="declaration"
                                    type="checkbox"
                                    v-model="renewalFormData.tc_declaration"
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
                                    I hereby declare that the information provided is true and
                                    correct.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="isRenewing"
                        class="flex items-center justify-center text-sm text-indigo-600"
                    >
                        <Loader class="animate-spin h-5 w-5 mr-2" />
                        Processing renewal...
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            @click="closeRenewalDialog"
                            class="btn btn-outline"
                            :disabled="isRenewing"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                            :disabled="isRenewing || !renewalFormData.tc_declaration"
                        >
                            Submit Renewal
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <CertificateDialog
            v-if="showCertificateDialog"
            :show="showCertificateDialog"
            :center-data="selectedCenter"
            :cert-type="'teaching-center'"
            @close="closeCertificateDialog"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'
import CertificateDialog from './CertificateDialog.vue'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import InfoItem from '@/components/common/MHPC/InfoItem.vue'

const teachingCenters = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const selectedCenter = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const showCertificateDialog = ref(false)

const renewalFormData = ref({
    tc_attachments: null,
    remarks: '',
    tc_declaration: false,
})

const toast = useToast()
const authStore = useAuthStore()

const filteredTeachingCenters = computed(() => {
    if (!authStore.user?.cid || !Array.isArray(teachingCenters.value)) {
        return []
    }
    const userCidLower = authStore.user.cid.toLowerCase()
    return teachingCenters.value.filter(
        (center) =>
            center.institute_details && center.institute_details.CID?.toLowerCase() === userCidLower
    )
})

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    } catch (e) {
        console.error('Error formatting date:', e)
        return 'Invalid Date'
    }
}

const getDaysUntilExpiration = (center) => {
    if (!center.valid_till) return 0
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const expirationDate = new Date(center.valid_till)
        expirationDate.setHours(0, 0, 0, 0)
        const timeDiff = expirationDate.getTime() - today.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
    } catch (e) {
        console.error('Error calculating days until expiration:', e)
        return 0
    }
}

const isRenewalInProgress = (center) => {
    return center.tc_review_decision === 'Pending' && !center.is_active && isRenewal(center)
}

const isRenewal = (center) => {
    if (!center.created_at || !center.valid_since) return false

    const firstValidSince = new Date(center.valid_since)
    const today = new Date()

    const diffInMilliseconds = today - firstValidSince
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24)

    return diffInDays > 30
}

const getExpirationTextClass = (center) => {
    if (!center.valid_till) return 'text-gray-800'
    const days = getDaysUntilExpiration(center)
    if (days <= 0) return 'text-red-600 font-semibold'
    if (days <= 30) return 'text-orange-600 font-semibold'
    return 'text-gray-800'
}

const getReviewDecisionClass = (decision) => {
    if (decision === 'Approved') return 'text-green-600 font-semibold'
    if (decision === 'Pending') return 'text-yellow-600 font-semibold'
    if (decision === 'Rejected') return 'text-red-600 font-semibold'
    return 'text-gray-600'
}

const setDefaultDates = async (center) => {
    if (!center?.id) {
        toast.error('Teaching center data not available.')
        return
    }
    try {
        const today = new Date()
        const oneYearFromNow = new Date(today)
        oneYearFromNow.setFullYear(today.getFullYear() + 1)

        const validSince = today.toISOString().split('T')[0]
        const validTill = oneYearFromNow.toISOString().split('T')[0]

        await apiServices.patchMhpcTeachingCenter(center.id, {
            valid_since: validSince,
            valid_till: validTill,
        })

        const centerIndex = teachingCenters.value.findIndex((c) => c.id === center.id)
        if (centerIndex !== -1) {
            teachingCenters.value[centerIndex] = {
                ...teachingCenters.value[centerIndex],
                valid_since: validSince,
                valid_till: validTill,
            }
        }
        toast.success('Default dates set successfully!')
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to set default dates.')
    }
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        selectedFileName.value = file.name
    } else {
        selectedFile.value = null
        selectedFileName.value = ''
    }
}

const openRenewalDialog = (center) => {
    selectedCenter.value = { ...center }
    renewalFormData.value = { tc_attachments: null, remarks: '', tc_declaration: false }
    selectedFile.value = null
    selectedFileName.value = ''
    showRenewalDialog.value = true
}

const closeRenewalDialog = () => {
    showRenewalDialog.value = false
    selectedCenter.value = null
}

const confirmRenewal = async () => {
    if (!selectedCenter.value || !renewalFormData.value.tc_declaration) {
        toast.error(
            !selectedCenter.value ? 'No center selected.' : 'Please accept the declaration.'
        )
        return
    }
    isRenewing.value = true
    try {
        const currentValidTill = new Date(selectedCenter.value.valid_till || Date.now())
        const newValidSince = new Date(currentValidTill)
        newValidSince.setDate(newValidSince.getDate() + 1)

        const newValidTill = new Date(newValidSince)
        newValidTill.setFullYear(newValidSince.getFullYear() + 1)

        const formDataPayload = new FormData()
        formDataPayload.append('tc_review_decision', 'Pending')
        formDataPayload.append('is_payment_complete', false)
        formDataPayload.append('is_active', false)
        formDataPayload.append('remarks', renewalFormData.value.remarks || '')
        formDataPayload.append('tc_declaration', renewalFormData.value.tc_declaration)
        formDataPayload.append('valid_since', newValidSince.toISOString().split('T')[0])
        formDataPayload.append('valid_till', newValidTill.toISOString().split('T')[0])
        if (selectedFile.value) {
            formDataPayload.append('tc_attachments', selectedFile.value)
        }

        await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, formDataPayload)

        await fetchData()
        toast.success('Teaching center renewal initiated successfully!')
        closeRenewalDialog()
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to initiate renewal.')
    } finally {
        isRenewing.value = false
    }
}

const fetchData = async () => {
    isLoading.value = true
    apiError.value = false
    try {
        const response = await apiServices.getMhpcTeachingCenters()
        teachingCenters.value = response.data?.results || []
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Error fetching data. Please try again.'
        apiError.value = true
    } finally {
        isLoading.value = false
    }
}

const openCertificateDialog = (center) => {
    selectedCenter.value = center
    showCertificateDialog.value = true
}

const closeCertificateDialog = () => {
    showCertificateDialog.value = false
    selectedCenter.value = null
}

onMounted(fetchData)
</script>

<style scoped>
.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
}
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
.btn {
    @apply inline-flex items-center justify-center rounded-lg border py-2 px-4 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-primary {
    @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
    @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
</style>
