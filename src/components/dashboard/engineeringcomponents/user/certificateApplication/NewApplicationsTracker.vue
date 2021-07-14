<template>
    <div class="space-y-6" role="main" aria-label="New Applications">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
            <div v-for="n in 2" :key="`skeleton-${n}`" class="animate-pulse">
                <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div class="bg-gray-200 h-32"></div>
                    <div class="p-6 space-y-4">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div class="grid grid-cols-4 gap-3">
                            <div v-for="i in 4" :key="`skeleton-card-${i}`" class="h-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="hasError" class="text-center py-12">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading applications</h3>
            <p class="mt-1 text-sm text-gray-500">There was a problem loading your application data.</p>
            <div class="mt-6">
                <button type="button" @click="$emit('retry')"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Try again
                </button>
            </div>
        </div>

        <!-- Applications List -->
        <div v-else-if="validApplications.length > 0" class="space-y-6">
            <div v-for="application in validApplications" :key="`application-${application.id}`"
                class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
                role="article" :aria-labelledby="`app-title-${application.id}`">
                <!-- Header Section -->
                <div
                    class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-gray-200">
                    <!-- Action Button -->
                    <div class="absolute top-0 right-0 m-2 sm:m-4 flex space-x-2 z-10">
                        <button v-if="shouldShowViewCertificateButton(application)"
                            @click="handleOpenCertificate(application)"
                            class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            :aria-label="`View certificate for ${application.full_name}`">
                            <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" aria-hidden="true" />
                            <span>View Certificate</span>
                        </button>
                    </div>

                    <!-- User Information -->
                    <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div class="relative flex-shrink-0">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl blur-md">
                            </div>
                            <img :src="application.passport_photo" :alt="`Profile photo of ${application.full_name}`"
                                class="h-20 w-20 sm:h-24 sm:w-24 relative rounded-xl object-cover ring-4 ring-white shadow-lg"
                                @error="handleImageError" loading="lazy" />
                        </div>

                        <div class="flex-1 text-center sm:text-left">
                            <div
                                class="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                                <h3 :id="`app-title-${application.id}`"
                                    class="text-xl sm:text-2xl font-bold text-gray-900">
                                    {{ application.full_name }}
                                </h3>
                                <span
                                    class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center w-fit mx-auto sm:mx-0"
                                    :class="getActiveStatusClass(application)"
                                    :aria-label="`Application status: ${getActiveStatusText(application)}`">
                                    <span class="w-2 h-2 rounded-full mr-1.5"
                                        :class="isApplicationActive(application) ? 'bg-green-500' : 'bg-red-500'"
                                        aria-hidden="true"></span>
                                    {{ getActiveStatusText(application) }}
                                </span>
                            </div>

                            <div
                                class="mt-3 flex flex-col sm:flex-row items-center gap-2 text-gray-600 justify-center sm:justify-start">
                                <div
                                    class="flex items-center px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-100">
                                    <IdCard class="w-4 h-4 mr-1 text-blue-600" aria-hidden="true" />
                                    <span>
                                        {{ application.cid_holder ? 'CID' : 'Work Permit' }}:
                                        {{ application.cid_no }}
                                    </span>
                                </div>
                                <div
                                    class="flex items-center px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-100">
                                    <BarChart class="w-4 h-4 mr-1 text-blue-600" aria-hidden="true" />
                                    <span>Reg No: {{ application.registration_no }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact and Location Information -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-white border-b border-gray-100">
                    <div
                        class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                        <div class="mt-1 p-1.5 bg-blue-100 rounded-lg">
                            <Phone class="w-4 h-4 text-blue-600" aria-hidden="true" />
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Contact Information</p>
                            <p class="text-xs text-gray-600 mt-1">{{ application.contact_no }}</p>
                            <p class="text-xs text-gray-600">{{ application.email_address }}</p>
                        </div>
                    </div>

                    <div
                        class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                        <div class="mt-1 p-1.5 bg-blue-100 rounded-lg">
                            <MapPin class="w-4 h-4 text-blue-600" aria-hidden="true" />
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Location</p>
                            <p class="text-xs text-gray-600 mt-1">
                                {{ formatLocation(application) }}
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                        <div class="mt-1 p-1.5 bg-blue-100 rounded-lg">
                            <Calendar class="w-4 h-4 text-blue-600" aria-hidden="true" />
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Registration Period</p>
                            <p class="text-xs text-gray-600 mt-1">
                                {{ getQualificationDateRange(application) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Qualifications Section -->
                <div class="p-4 sm:p-6">
                    <h4 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                        <div class="p-1.5 bg-blue-100 rounded-lg mr-2">
                            <GraduationCap class="w-4 h-4 text-blue-600" aria-hidden="true" />
                        </div>
                        Qualifications & Certifications
                    </h4>

                    <div class="grid grid-cols-1 gap-6">
                        <div v-for="qualification in getPrimaryQualifications(application)"
                            :key="`qualification-${qualification.id}`"
                            class="relative bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300"
                            role="region" :aria-labelledby="`qual-title-${qualification.id}`">
                            <!-- Qualification Header -->
                            <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-4 sm:mb-6 gap-4">
                                <div class="space-y-1">
                                    <h5 :id="`qual-title-${qualification.id}`"
                                        class="text-lg font-semibold text-gray-900">
                                        {{ qualification.qualification_name_display }}
                                    </h5>
                                    <p class="text-gray-600 text-xs">
                                        {{ qualification.institute_university_display }}
                                    </p>
                                </div>

                                <!-- Progress Tracker -->
                                <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto">
                                    <div class="flex flex-col sm:flex-row items-center" role="progressbar"
                                        :aria-valuenow="getProgressValue(qualification)" aria-valuemin="0"
                                        aria-valuemax="4" :aria-valuetext="getProgressText(qualification)">
                                        <!-- Review Step -->
                                        <div class="flex flex-col items-center mb-2 sm:mb-0">
                                            <span
                                                class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                                :class="getStepClass(qualification.application_review_status)"
                                                :aria-label="`Review status: ${qualification.application_review_status}`">
                                                <component :is="getStepIcon(qualification.application_review_status)"
                                                    class="w-4 h-4" aria-hidden="true" />
                                            </span>
                                            <span class="text-xs font-medium mt-1 text-gray-700">Review</span>
                                        </div>

                                        <div class="hidden sm:block w-6 h-0.5 bg-gray-200" aria-hidden="true"></div>
                                        <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1" aria-hidden="true"></div>

                                        <!-- Verify Step -->
                                        <div class="flex flex-col items-center mb-2 sm:mb-0">
                                            <span
                                                class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                                :class="getStepClass(qualification.physical_review_status)"
                                                :aria-label="`Verification status: ${qualification.physical_review_status}`">
                                                <component :is="getStepIcon(qualification.physical_review_status)"
                                                    class="w-4 h-4" aria-hidden="true" />
                                            </span>
                                            <span class="text-xs font-medium mt-1 text-gray-700">Verify</span>
                                        </div>

                                        <div class="hidden sm:block w-6 h-0.5 bg-gray-200" aria-hidden="true"></div>
                                        <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1" aria-hidden="true"></div>

                                        <!-- Payment Step -->
                                        <div class="flex flex-col items-center mb-2 sm:mb-0">
                                            <span
                                                class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                                :class="getPaymentStepClass(qualification.payment_status)"
                                                :aria-label="`Payment status: ${qualification.payment_status}`">
                                                <component :is="getPaymentStepIcon(qualification.payment_status)"
                                                    class="w-4 h-4" aria-hidden="true" />
                                            </span>
                                            <span class="text-xs font-medium mt-1 text-gray-700">Payment</span>
                                        </div>

                                        <div class="hidden sm:block w-6 h-0.5 bg-gray-200" aria-hidden="true"></div>
                                        <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1" aria-hidden="true"></div>

                                        <!-- Endorse Step -->
                                        <div class="flex flex-col items-center">
                                            <span
                                                class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                                :class="getStepClass(qualification.endorsement_decision)"
                                                :aria-label="`Endorsement status: ${qualification.endorsement_decision}`">
                                                <component :is="getStepIcon(qualification.endorsement_decision)"
                                                    class="w-4 h-4" aria-hidden="true" />
                                            </span>
                                            <span class="text-xs font-medium mt-1 text-gray-700">Endorse</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Qualification Details Grid -->
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div
                                    class="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                                    <div class="flex items-start space-x-2">
                                        <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Building2 class="w-4 h-4 text-blue-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-blue-700">Institute</p>
                                            <p class="text-xs font-semibold text-gray-900 mt-1 line-clamp-2">
                                                {{ qualification.institute_university_display }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="bg-indigo-50 rounded-lg p-3 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                                    <div class="flex items-start space-x-2">
                                        <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                            <GraduationCap class="w-4 h-4 text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-indigo-700">Qualification</p>
                                            <p class="text-xs font-semibold text-gray-900 mt-1 line-clamp-2">
                                                {{ qualification.qualification_type_display }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="bg-purple-50 rounded-lg p-3 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                                    <div class="flex items-start space-x-2">
                                        <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                            <CalendarCheck class="w-4 h-4 text-purple-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-purple-700">Completion</p>
                                            <p class="text-xs font-semibold text-gray-900 mt-1">
                                                {{ qualification.completion_year }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="bg-teal-50 rounded-lg p-3 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                                    <div class="flex items-start space-x-2">
                                        <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                            <CreditCard class="w-4 h-4 text-teal-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-teal-700">Payment</p>
                                            <div class="flex items-center space-x-1 mt-1">
                                                <span
                                                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm"
                                                    :class="getPaymentStatusClass(qualification.payment_status)">
                                                    {{ getPaymentStatusText(qualification.payment_status) }}
                                                </span>
                                                <span v-if="qualification.payment_id"
                                                    class="text-xs text-gray-500 truncate"
                                                    :title="`Payment ID: ${qualification.payment_id}`">
                                                    #{{ qualification.payment_id.substring(0, 8) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Action Button -->
                            <button v-if="shouldShowPaymentButton(qualification)"
                                @click="handleInitiatePayment(application, qualification)"
                                class="relative mt-3 inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                :class="{ 'animate-border-pulse': qualification.payment_status !== 'failed' }"
                                :disabled="isProcessingPayment"
                                :aria-label="`${getPaymentButtonText(qualification)} for ${qualification.qualification_name_display}`">
                                <div class="absolute inset-0 border-2 border-transparent animate-border-pulse pointer-events-none"
                                    aria-hidden="true"></div>
                                <CreditCard class="w-3 h-3 mr-1.5" aria-hidden="true" />
                                <span>{{ getPaymentButtonText(qualification) }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <FileText class="h-6 w-6 text-gray-400" />
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p class="mt-1 text-sm text-gray-500">You don't have any new applications at this time.</p>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
    FileText,
    IdCard,
    BarChart,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Building2,
    CalendarCheck,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-vue-next'

// Props with comprehensive validation
const props = defineProps({
    applications: {
        type: Array,
        required: true,
        default: () => [],
        validator: (value) => {
            if (!Array.isArray(value)) return false
            return value.every(app =>
                app &&
                typeof app === 'object' &&
                app.id &&
                app.full_name
            )
        }
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    hasError: {
        type: Boolean,
        default: false
    }
})

// Emits with validation
const emit = defineEmits({
    'open-certificate': (application) => {
        return application && typeof application === 'object' && application.id
    },
    'initiate-payment': (payload) => {
        return payload &&
            payload.application &&
            payload.qualification &&
            typeof payload === 'object'
    },
    'retry': () => true
})

// Reactive state
const isProcessingPayment = ref(false)

// Computed properties for better performance
const validApplications = computed(() => {
    return props.applications.filter(app =>
        app &&
        app.id &&
        app.full_name &&
        Array.isArray(app.user_qualifications)
    )
})

// Utility functions
const isApplicationActive = (application) => {
    try {
        return Boolean(application?.is_active)
    } catch (error) {
        console.warn('Error checking application active status:', error)
        return false
    }
}

const getActiveStatusClass = (application) => {
    return isApplicationActive(application)
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-red-100 text-red-800 border border-red-200'
}

const getActiveStatusText = (application) => {
    return isApplicationActive(application) ? 'Active' : 'Inactive'
}

const shouldShowViewCertificateButton = (application) => {
    try {
        return application?.user_qualifications?.some(
            (q) => q?.is_primary_qualification && q?.endorsement_decision === 'Approved'
        ) ?? false
    } catch (error) {
        console.warn('Error checking certificate button visibility:', error)
        return false
    }
}

const getPrimaryQualifications = (application) => {
    try {
        return application?.user_qualifications?.filter(q =>
            q?.is_primary_qualification === true
        ) ?? []
    } catch (error) {
        console.warn('Error filtering primary qualifications:', error)
        return []
    }
}

const formatLocation = (application) => {
    try {
        const parts = [
            application?.village,
            application?.gewog,
            application?.dzongkhag
        ].filter(Boolean)

        return parts.length > 0 ? parts.join(', ') : 'N/A'
    } catch (error) {
        console.warn('Error formatting location:', error)
        return 'N/A'
    }
}

const getQualificationDateRange = (application) => {
    try {
        // Get the first primary qualification and use its dates
        const primaryQualification = application?.user_qualifications?.find(q =>
            q?.is_primary_qualification === true
        )

        if (primaryQualification?.registration_date && primaryQualification?.expiry_date) {
            const startDate = new Date(primaryQualification.registration_date).toLocaleDateString()
            const endDate = new Date(primaryQualification.expiry_date).toLocaleDateString()
            return `${startDate} - ${endDate}`
        }

        // Fallback to application dates if qualification dates are not available
        if (application?.registration_date && application?.expiry_date) {
            const startDate = new Date(application.registration_date).toLocaleDateString()
            const endDate = new Date(application.expiry_date).toLocaleDateString()
            return `${startDate} - ${endDate}`
        }

        return 'N/A'
    } catch (error) {
        console.warn('Error getting qualification date range:', error)
        return 'N/A'
    }
}

// Status and progress utilities
const getStepClass = (status) => {
    const statusMap = {
        'Approved': 'bg-green-100 text-green-700 ring-1 ring-green-200',
        'Rejected': 'bg-red-100 text-red-700 ring-1 ring-red-200',
        'Pending': 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
}

const getStepIcon = (status) => {
    const iconMap = {
        'Approved': CheckCircle,
        'Rejected': XCircle,
        'Pending': Clock
    }
    return iconMap[status] || Clock
}

const getPaymentStepClass = (status) => {
    const statusMap = {
        'completed': 'bg-green-100 text-green-700 ring-1 ring-green-200',
        'processing_payment': 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
        'failed': 'bg-red-100 text-red-700 ring-1 ring-red-200',
        'pending': 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'
}

const getPaymentStepIcon = (status) => {
    const iconMap = {
        'completed': CheckCircle,
        'failed': XCircle,
        'processing_payment': Clock,
        'pending': Clock
    }
    return iconMap[status] || Clock
}

const getPaymentStatusClass = (status) => {
    const statusMap = {
        'completed': 'bg-green-100 text-green-800 border border-green-200',
        'failed': 'bg-red-100 text-red-800 border border-red-200',
        'processing_payment': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
    return statusMap[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

const getPaymentStatusText = (status) => {
    const textMap = {
        'completed': 'Paid',
        'processing_payment': 'Processing',
        'failed': 'Failed',
        'pending': 'Pending'
    }
    return textMap[status] || 'Unknown'
}

const shouldShowPaymentButton = (qualification) => {
    try {
        return qualification?.physical_review_status === 'Approved' &&
            qualification?.endorsement_decision === 'Pending' &&
            qualification?.payment_status !== 'completed' &&
            qualification?.payment_status !== 'processing_payment'
    } catch (error) {
        console.warn('Error checking payment button visibility:', error)
        return false
    }
}

const getPaymentButtonText = (qualification) => {
    try {
        return qualification?.payment_status === 'failed'
            ? 'Re-process Payment'
            : 'Proceed to Payment'
    } catch (error) {
        console.warn('Error getting payment button text:', error)
        return 'Proceed to Payment'
    }
}

const getProgressValue = (qualification) => {
    try {
        let progress = 0
        if (qualification?.application_review_status === 'Approved') progress++
        if (qualification?.physical_review_status === 'Approved') progress++
        if (qualification?.payment_status === 'completed') progress++
        if (qualification?.endorsement_decision === 'Approved') progress++
        return progress
    } catch (error) {
        console.warn('Error calculating progress value:', error)
        return 0
    }
}

const getProgressText = (qualification) => {
    try {
        const progress = getProgressValue(qualification)
        return `Step ${progress} of 4 completed`
    } catch (error) {
        console.warn('Error getting progress text:', error)
        return 'Progress unknown'
    }
}

// Event handlers with error handling
const handleOpenCertificate = async (application) => {
    try {
        if (!application?.id) {
            throw new Error('Invalid application data')
        }
        emit('open-certificate', application)
    } catch (error) {
        console.error('Error opening certificate:', error)
        // You might want to show a toast notification here
    }
}

const handleInitiatePayment = async (application, qualification) => {
    try {
        if (!application?.id || !qualification?.id) {
            throw new Error('Invalid application or qualification data')
        }

        if (isProcessingPayment.value) {
            return // Prevent double submission
        }

        isProcessingPayment.value = true
        emit('initiate-payment', { application, qualification })
    } catch (error) {
        console.error('Error initiating payment:', error)
        // You might want to show a toast notification here
    } finally {
        // Reset processing state after a short delay to prevent rapid clicks
        setTimeout(() => {
            isProcessingPayment.value = false
        }, 2000)
    }
}

const handleImageError = (event) => {
    try {
        // Replace with placeholder image on error
        event.target.src = '/images/placeholder-avatar.png'
        event.target.alt = 'Profile photo unavailable'
    } catch (error) {
        console.warn('Error handling image error:', error)
    }
}

// Expose functions for testing
defineExpose({
    isApplicationActive,
    shouldShowViewCertificateButton,
    getQualificationDateRange,
    formatLocation
})
</script>

<style scoped>
@keyframes border-pulse {

    0%,
    100% {
        border-color: rgba(20, 184, 166, 0.3);
        transform: scale(1);
    }

    50% {
        border-color: rgba(6, 182, 212, 0.6);
        transform: scale(1.05);
    }
}

.animate-border-pulse {
    animation: border-pulse 2s ease-in-out infinite;
    border-radius: 0.5rem;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Loading animation */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Ensure good contrast for accessibility */
@media (prefers-reduced-motion: reduce) {

    .animate-border-pulse,
    .animate-pulse {
        animation: none;
    }

    .transition-all {
        transition: none;
    }
}

/* Focus visible for better keyboard navigation */
.focus-within\:ring-2:focus-within {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .bg-gradient-to-r {
        background: solid;
    }

    .shadow-md {
        box-shadow: 0 0 0 1px currentColor;
    }
}
</style>