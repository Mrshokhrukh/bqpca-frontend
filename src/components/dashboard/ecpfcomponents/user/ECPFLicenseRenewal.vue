<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="w-full mx-auto px-4">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">ECPF Renewal</h1>
                <p class="text-gray-600">Manage and renew your ECPF license</p>
            </div>

            <!-- Main Card -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <!-- ECPF Selection - BR 4.1.1 -->
                <div class="mb-6">
                    <label for="ecpfType" class="block text-sm font-medium text-gray-700 mb-2">
                        Select ECPF Location
                    </label>
                    <select
                        id="ecpfType"
                        v-model="selectedECPFType"
                        class="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    >
                        <option value="" disabled>Choose a location...</option>
                        <option v-for="ecpf in filteredECPFList" :key="ecpf.id" :value="ecpf.id">
                            {{ ecpf.name }} ({{ ecpf.type }})
                        </option>
                    </select>
                </div>

                <!-- Ineligible Warning - BR 4.1.2 -->
                <div
                    v-if="renewalEligible === false"
                    class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg"
                >
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg
                                class="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">
                                Your license must be active for at least six months to renew. Please
                                apply for a new ECPF establishment instead.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Dealing Officer Section (when role is HEQC) -->
                <div
                    v-if="isHeqcOfficer && selectedECPFType"
                    class="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Verification Decision</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Decision
                            </label>
                            <select
                                v-model="verificationDecision"
                                class="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select decision</option>
                                <option
                                    v-for="decision in decisionOptions"
                                    :key="decision.value"
                                    :value="decision.value"
                                >
                                    {{ decision.label }}
                                </option>
                            </select>
                        </div>

                        <div v-if="verificationDecision === 'REJECT'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Rejection
                            </label>
                            <textarea
                                v-model="rejectionReason"
                                rows="3"
                                class="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <div v-if="verificationDecision === 'CORRECTIVE'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Corrective Measures Required
                            </label>
                            <div class="space-y-2">
                                <div v-for="(measure, index) in correctiveMeasures" :key="index">
                                    <input
                                        v-model="measure.requirement"
                                        class="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter corrective measure requirement"
                                    />
                                </div>
                                <button
                                    @click="addCorrectiveMeasure"
                                    class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    + Add Another Measure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Renewal Details -->
                <div v-if="selectedECPFType && renewalEligible" class="space-y-6">
                    <!-- Status Card -->
                    <div class="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <div class="text-sm text-gray-500">ECPF Status</div>
                            <div class="flex items-center space-x-2">
                                <div
                                    class="h-2.5 w-2.5 rounded-full"
                                    :class="
                                        selectedECPF.status === 'Active'
                                            ? 'bg-green-400'
                                            : 'bg-red-400'
                                    "
                                ></div>
                                <span class="font-medium">{{ selectedECPF.status }}</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-sm text-gray-500">Payment Advice #</div>
                            <div class="font-medium">
                                {{ selectedECPF.paymentAdviceNumber || 'Not Available' }}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-sm text-gray-500">Issue Date</div>
                            <div class="font-medium">{{ formatDate(selectedECPF.issueDate) }}</div>
                        </div>
                        <div class="space-y-2">
                            <div class="text-sm text-gray-500">Expiry Date</div>
                            <div class="font-medium">{{ formatDate(selectedECPF.expiryDate) }}</div>
                        </div>
                    </div>

                    <!-- Corrective Measures Response - BR 4.1.4 -->
                    <div v-if="selectedECPF.correctiveMeasures" class="space-y-4">
                        <h3 class="text-lg font-medium text-gray-900">
                            Corrective Measures Required
                        </h3>
                        <div class="space-y-4">
                            <div
                                v-for="(measure, index) in selectedECPF.correctiveMeasures"
                                :key="index"
                                class="bg-white border border-gray-200 rounded-lg p-4"
                            >
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    {{ measure.requirement }}
                                </label>
                                <input
                                    type="text"
                                    v-model="measure.response"
                                    class="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                    :placeholder="
                                        'Describe your response to ' +
                                        measure.requirement.toLowerCase()
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Payment Section - BR 4.1.3 -->
                    <div v-if="showPaymentSection" class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Payment Required</h3>
                        <p class="text-sm text-gray-600 mb-4">
                            Your application has been approved by HEQC. Please proceed with the
                            payment to complete the renewal process.
                        </p>
                        <button
                            @click="initiatePayment"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Proceed to Payment
                        </button>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            v-if="isHeqcOfficer"
                            @click="submitVerification"
                            :disabled="isSubmitting || !verificationDecision"
                            class="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Submit Verification
                        </button>

                        <button
                            v-else
                            @click="submitRenewal"
                            :disabled="isSubmitting || isSaving"
                            class="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg
                                v-if="isSubmitting"
                                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            <span>{{ isSubmitting ? 'Submitting...' : 'Submit Renewal' }}</span>
                        </button>

                        <button
                            @click="saveAsDraft"
                            :disabled="isSubmitting || isSaving"
                            class="flex-1 inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span>{{ isSaving ? 'Saving...' : 'Save as Draft' }}</span>
                        </button>
                    </div>
                </div>

                <!-- Status Messages -->
                <div class="mt-6 space-y-2">
                    <div
                        v-if="submitSuccess"
                        class="p-4 bg-green-50 rounded-lg text-green-700 text-sm"
                    >
                        Renewal submitted successfully!
                    </div>
                    <div
                        v-if="saveSuccess"
                        class="p-4 bg-green-50 rounded-lg text-green-700 text-sm"
                    >
                        Saved as draft successfully!
                    </div>
                    <div v-if="submitError" class="p-4 bg-red-50 rounded-lg text-red-700 text-sm">
                        Error submitting renewal: {{ submitError }}
                    </div>
                    <div v-if="saveError" class="p-4 bg-red-50 rounded-lg text-red-700 text-sm">
                        Error saving as draft: {{ saveError }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Constants
const VERIFICATION_DECISIONS = {
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    CORRECTIVE: 'CORRECTIVE',
}

// State Management
const selectedECPFType = ref('')
const isSubmitting = ref(false)
const isSaving = ref(false)
const submitSuccess = ref(false)
const saveSuccess = ref(false)
const submitError = ref(null)
const saveError = ref(null)
const userRole = ref('APPLICANT') // or 'HEQC'
const verificationDecision = ref('')
const rejectionReason = ref('')
const correctiveMeasures = ref([{ requirement: '' }])
const paymentInitiated = ref(false)

// Mock Data
const ecpfList = ref([
    {
        id: 1,
        name: 'ECPF Branch 1',
        type: 'Branch Office',
        issueDate: '2023-05-15T00:00:00.000Z',
        expiryDate: '2024-05-15T00:00:00.000Z',
        status: 'Active',
        paymentAdviceNumber: 'PA-2023-123',
        correctiveMeasures: null,
        heqcApproved: false,
        paymentRequired: false,
    },
    {
        id: 2,
        name: 'ECPF Main Office',
        type: 'Main Office',
        issueDate: '2024-06-01T00:00:00.000Z',
        expiryDate: '2025-06-01T00:00:00.000Z',
        status: 'Active',
        paymentAdviceNumber: 'PA-2024-456',
        correctiveMeasures: [
            { requirement: 'Update infrastructure plan', response: '' },
            { requirement: 'Revise HR policies', response: '' },
        ],
        heqcApproved: true,
        paymentRequired: true,
    },
    {
        id: 3,
        name: 'ECPF Branch 2',
        type: 'Branch Office',
        issueDate: '2022-12-01T00:00:00.000Z',
        expiryDate: '2023-12-01T00:00:00.000Z',
        status: 'Expired',
        paymentAdviceNumber: null,
        correctiveMeasures: null,
        heqcApproved: false,
        paymentRequired: false,
    },
])

// State Management
const currentUserBranch = ref(2) // This would come from user context

// Computed Properties
const isHeqcOfficer = computed(() => userRole.value === 'HEQC')

const filteredECPFList = computed(() => {
    // BR 4.1.1: Show branch office ECPF in dropdown
    if (isHeqcOfficer.value) {
        return ecpfList.value
    }
    // For regular users, show only their branch
    return ecpfList.value.filter(
        (ecpf) => ecpf.type === 'Branch Office' || ecpf.id === currentUserBranch.value
    )
})

const selectedECPF = computed(() => {
    return ecpfList.value.find((ecpf) => ecpf.id === selectedECPFType.value) || {}
})

const renewalEligible = computed(() => {
    // BR 4.1.2: Validate 6-month active license requirement
    if (!selectedECPFType.value) return null

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const issueDate = new Date(selectedECPF.value.issueDate)

    return issueDate <= sixMonthsAgo && selectedECPF.value.status === 'Active'
})

const showPaymentSection = computed(() => {
    // BR 4.1.3: Show payment section when HEQC approved
    return selectedECPF.value.heqcApproved && !paymentInitiated.value
})

// Methods
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid Date'
    }
}

const addCorrectiveMeasure = () => {
    correctiveMeasures.value.push({ requirement: '' })
}

const validateForm = () => {
    if (isHeqcOfficer.value) {
        if (!verificationDecision.value) {
            return 'Please select a verification decision'
        }
        if (
            verificationDecision.value === VERIFICATION_DECISIONS.REJECT &&
            !rejectionReason.value
        ) {
            return 'Please provide a reason for rejection'
        }
        if (
            verificationDecision.value === VERIFICATION_DECISIONS.CORRECTIVE &&
            (!correctiveMeasures.value.length ||
                correctiveMeasures.value.some((m) => !m.requirement))
        ) {
            return 'Please specify all corrective measures'
        }
    } else {
        if (selectedECPF.value.correctiveMeasures?.some((m) => !m.response)) {
            return 'Please respond to all corrective measures'
        }
    }
    return null
}

const submitVerification = async () => {
    const error = validateForm()
    if (error) {
        submitError.value = error
        return
    }

    isSubmitting.value = true
    submitSuccess.value = false
    submitError.value = null

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update ECPF state based on verification decision
        const ecpf = ecpfList.value.find((e) => e.id === selectedECPFType.value)
        if (ecpf) {
            switch (verificationDecision.value) {
                case VERIFICATION_DECISIONS.APPROVE:
                    ecpf.heqcApproved = true
                    ecpf.paymentRequired = true
                    ecpf.correctiveMeasures = null
                    break
                case VERIFICATION_DECISIONS.REJECT:
                    ecpf.heqcApproved = false
                    ecpf.correctiveMeasures = null
                    break
                case VERIFICATION_DECISIONS.CORRECTIVE:
                    ecpf.heqcApproved = false
                    ecpf.correctiveMeasures = correctiveMeasures.value
                    break
            }
        }

        submitSuccess.value = true
        verificationDecision.value = ''
        rejectionReason.value = ''
        correctiveMeasures.value = [{ requirement: '' }]
    } catch (error) {
        console.error('Error submitting verification:', error)
        submitError.value = 'Failed to submit verification. Please try again.'
    } finally {
        isSubmitting.value = false
    }
}

const submitRenewal = async () => {
    const error = validateForm()
    if (error) {
        submitError.value = error
        return
    }

    isSubmitting.value = true
    submitSuccess.value = false
    submitError.value = null

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        submitSuccess.value = true
    } catch (error) {
        console.error('Error submitting renewal:', error)
        submitError.value = 'Failed to submit renewal. Please try again.'
    } finally {
        isSubmitting.value = false
    }
}

const saveAsDraft = async () => {
    isSaving.value = true
    saveSuccess.value = false
    saveError.value = null

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        saveSuccess.value = true
    } catch (error) {
        console.error('Error saving draft:', error)
        saveError.value = 'Failed to save draft. Please try again.'
    } finally {
        isSaving.value = false
    }
}

const initiatePayment = async () => {
    try {
        // Simulate payment initialization
        await new Promise((resolve) => setTimeout(resolve, 1000))
        paymentInitiated.value = true
    } catch (error) {
        console.error('Error initiating payment:', error)
    }
}

// Lifecycle hooks
onMounted(() => {
    // Initialize any required data
    // This could include fetching user role, current branch, etc.
    currentUserBranch.value = 2 // This would come from user context
})

// Expose necessary properties and methods
defineExpose({
    selectedECPFType,
    selectedECPF,
    renewalEligible,
    isHeqcOfficer,
    submitSuccess,
    submitError,
    saveSuccess,
    saveError,
    formatDate,
    submitRenewal,
    saveAsDraft,
    submitVerification,
    initiatePayment,
})
</script>
