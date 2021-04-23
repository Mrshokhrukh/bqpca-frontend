<!-- eslint-disable vue/require-toggle-inside-transition -->
<template>
    <Transition name="modal">
        <div
            class="fixed z-50 inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div class="relative w-full w-full mx-auto">
                <!-- Modal Content -->
                <div class="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                    <!-- Modal Header -->
                    <div
                        class="bg-blue-50 px-8 py-5 border-b border-blue-100 flex justify-between items-center"
                    >
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Application Details</h2>
                            <div class="flex items-center mt-1 space-x-2">
                                <span class="text-sm font-medium text-gray-600"
                                    >Registration No:</span
                                >
                                <span
                                    class="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
                                    >{{ application.registration_no }}</span
                                >
                            </div>
                        </div>
                        <button
                            @click="closeModal"
                            class="rounded-full p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                        >
                            <XIcon class="w-6 h-6" />
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="px-6 py-6 max-h-[calc(100vh-140px)] overflow-y-auto">
                        <!-- Status Timeline -->
                        <div class="mb-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3
                                class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                            >
                                <ClipboardIcon class="w-5 h-5 text-blue-500" />
                                Application Progress
                            </h3>
                            <div class="flex items-center justify-between w-full">
                                <div class="flex flex-col items-center">
                                    <div
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center',
                                            application.review_status === 'Approved'
                                                ? 'bg-green-100 text-green-700'
                                                : application.review_status === 'Rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700',
                                        ]"
                                    >
                                        <CheckCircleIcon
                                            v-if="application.review_status === 'Approved'"
                                            class="w-6 h-6"
                                        />
                                        <XCircleIcon
                                            v-else-if="application.review_status === 'Rejected'"
                                            class="w-6 h-6"
                                        />
                                        <span v-else>1</span>
                                    </div>
                                    <span class="text-sm font-medium mt-2">Review</span>
                                    <span
                                        :class="[
                                            'text-xs mt-1 px-2 py-1 rounded-full',
                                            getStatusClass(application.review_status),
                                        ]"
                                        >{{ application.review_status }}</span
                                    >
                                </div>
                                <div class="w-1/4 h-1 bg-gray-200 relative">
                                    <div
                                        :class="[
                                            'absolute top-0 left-0 h-full',
                                            application.review_status === 'Approved'
                                                ? 'bg-green-500 w-full'
                                                : application.review_status === 'Rejected'
                                                ? 'bg-red-500 w-full'
                                                : 'bg-blue-500 w-1/2',
                                        ]"
                                    ></div>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center',
                                            application.endorsement_decision === 'Approved'
                                                ? 'bg-green-100 text-green-700'
                                                : application.endorsement_decision === 'Rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-gray-100 text-gray-700',
                                        ]"
                                    >
                                        <CheckCircleIcon
                                            v-if="application.endorsement_decision === 'Approved'"
                                            class="w-6 h-6"
                                        />
                                        <XCircleIcon
                                            v-else-if="
                                                application.endorsement_decision === 'Rejected'
                                            "
                                            class="w-6 h-6"
                                        />
                                        <span v-else>2</span>
                                    </div>
                                    <span class="text-sm font-medium mt-2">Endorsement</span>
                                    <span
                                        :class="[
                                            'text-xs mt-1 px-2 py-1 rounded-full',
                                            getStatusClass(application.endorsement_decision),
                                        ]"
                                        >{{ application.endorsement_decision }}</span
                                    >
                                </div>
                                <div class="w-1/4 h-1 bg-gray-200 relative">
                                    <div
                                        :class="[
                                            'absolute top-0 left-0 h-full',
                                            application.endorsement_decision === 'Approved' &&
                                            application.is_payment_complete
                                                ? 'bg-green-500 w-full'
                                                : application.endorsement_decision === 'Approved'
                                                ? 'bg-green-500 w-1/2'
                                                : application.endorsement_decision === 'Rejected'
                                                ? 'bg-red-500 w-full'
                                                : 'bg-gray-200',
                                        ]"
                                    ></div>
                                </div>
                                <div class="flex flex-col items-center">
                                    <div
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center',
                                            application.is_payment_complete
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700',
                                        ]"
                                    >
                                        <CheckCircleIcon
                                            v-if="application.is_payment_complete"
                                            class="w-6 h-6"
                                        />
                                        <span v-else>3</span>
                                    </div>
                                    <span class="text-sm font-medium mt-2">Payment</span>
                                    <span
                                        :class="[
                                            'text-xs mt-1 px-2 py-1 rounded-full',
                                            application.is_payment_complete
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800',
                                        ]"
                                        >{{
                                            application.is_payment_complete ? 'Paid' : 'Pending'
                                        }}</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <!-- Left Column: Applicant & Workplace Details -->
                            <div class="lg:col-span-8 space-y-6">
                                <!-- Applicant Details Card -->
                                <div
                                    class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                                >
                                    <h3
                                        class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                                    >
                                        <UserIcon class="w-5 h-5 text-blue-500" />
                                        Applicant Details
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-4">
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Full Name</span
                                                >
                                                <span class="text-base font-medium text-gray-900">{{
                                                    application.full_name
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >CID No</span
                                                >
                                                <span class="text-base text-gray-900">{{
                                                    application.cid_no
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Gender</span
                                                >
                                                <span class="text-base text-gray-900">{{
                                                    application.gender
                                                }}</span>
                                            </div>
                                        </div>
                                        <div class="space-y-4">
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Contact Info</span
                                                >
                                                <div class="flex items-center mt-1">
                                                    <span class="text-base text-gray-900">{{
                                                        application.contact_number
                                                    }}</span>
                                                </div>
                                                <div class="flex items-center mt-1">
                                                    <span class="text-sm text-blue-600">{{
                                                        application.email_address
                                                    }}</span>
                                                </div>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Address</span
                                                >
                                                <span class="text-base text-gray-900">{{
                                                    application.address
                                                }}</span>
                                                <div class="flex space-x-4 mt-1">
                                                    <span class="text-sm text-gray-600"
                                                        >PO Box: {{ application.po_box }}</span
                                                    >
                                                    <span class="text-sm text-gray-600"
                                                        >ZIP: {{ application.zip_code }}</span
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Workplace Details Card -->
                                <div
                                    class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                                >
                                    <h3
                                        class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                                    >
                                        <BuildingIcon class="w-5 h-5 text-blue-500" />
                                        Workplace Details
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-4">
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Agency</span
                                                >
                                                <span class="text-base font-medium text-gray-900">{{
                                                    application.agency?.name || 'N/A'
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Department</span
                                                >
                                                <span class="text-base text-gray-900">{{
                                                    application.department?.name || 'N/A'
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Workplace</span
                                                >
                                                <span class="text-base text-gray-900">{{
                                                    application.workplace?.name || 'N/A'
                                                }}</span>
                                            </div>
                                        </div>
                                        <div class="space-y-4">
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Supervisor</span
                                                >
                                                <span class="text-base font-medium text-gray-900">{{
                                                    application.supervisor_name
                                                }}</span>
                                                <span class="text-sm text-gray-600">{{
                                                    application.supervisor_designation
                                                }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-sm font-medium text-gray-500"
                                                    >Application Reason</span
                                                >
                                                <div class="p-3 bg-gray-50 rounded-lg mt-1">
                                                    <span class="text-base text-gray-900">{{
                                                        application.reason_for_application
                                                    }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column: Status & Review Actions -->
                            <div class="lg:col-span-4">
                                <div
                                    class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6"
                                >
                                    <h3
                                        class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                                    >
                                        <ClipboardIcon class="w-5 h-5 text-blue-500" />
                                        Review & Actions
                                    </h3>

                                    <!-- Review Status -->
                                    <div class="rounded-lg bg-gray-50 p-4 mb-4">
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm font-medium text-gray-700"
                                                >Review Status</span
                                            >
                                            <span
                                                :class="[
                                                    'px-3 py-1 rounded-full text-xs font-medium',
                                                    getStatusClass(application.review_status),
                                                ]"
                                            >
                                                {{ application.review_status }}
                                            </span>
                                        </div>
                                        <p
                                            v-if="application.review_remark"
                                            class="mt-2 text-sm text-gray-700 p-2 bg-white rounded border border-gray-100"
                                        >
                                            {{ application.review_remark }}
                                        </p>
                                        <p v-else class="mt-2 text-sm italic text-gray-500">
                                            No remarks
                                        </p>
                                    </div>

                                    <!-- Endorsement Status -->
                                    <div class="rounded-lg bg-gray-50 p-4 mb-4">
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm font-medium text-gray-700"
                                                >Endorsement</span
                                            >
                                            <span
                                                :class="[
                                                    'px-3 py-1 rounded-full text-xs font-medium',
                                                    getStatusClass(
                                                        application.endorsement_decision
                                                    ),
                                                ]"
                                            >
                                                {{ application.endorsement_decision }}
                                            </span>
                                        </div>
                                        <p
                                            v-if="application.endorsement_remark"
                                            class="mt-2 text-sm text-gray-700 p-2 bg-white rounded border border-gray-100"
                                        >
                                            {{ application.endorsement_remark }}
                                        </p>
                                        <p v-else class="mt-2 text-sm italic text-gray-500">
                                            No remarks
                                        </p>
                                    </div>

                                    <!-- Payment Status -->
                                    <div class="rounded-lg bg-gray-50 p-4 mb-6">
                                        <div class="flex justify-between items-center">
                                            <span class="text-sm font-medium text-gray-700"
                                                >Payment Status</span
                                            >
                                            <span
                                                :class="[
                                                    'px-3 py-1 rounded-full text-xs font-medium',
                                                    application.is_payment_complete
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800',
                                                ]"
                                            >
                                                {{
                                                    application.is_payment_complete
                                                        ? 'Paid'
                                                        : 'Pending'
                                                }}
                                            </span>
                                        </div>
                                        <p
                                            v-if="application.is_payment_complete"
                                            class="mt-2 text-sm text-gray-600"
                                        >
                                            Payment ID:
                                            <span class="font-medium">{{
                                                application.payment_id
                                            }}</span>
                                        </p>
                                    </div>

                                    <!-- Remark Input Fields -->
                                    <div class="space-y-4">
                                        <div>
                                            <label
                                                for="reviewRemark"
                                                class="block text-sm font-medium text-gray-700 mb-1"
                                                >Review Remark</label
                                            >
                                            <textarea
                                                id="reviewRemark"
                                                v-model="reviewRemark"
                                                rows="2"
                                                placeholder="Enter review remarks here..."
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label
                                                for="endorsementRemark"
                                                class="block text-sm font-medium text-gray-700 mb-1"
                                                >Endorsement Remark</label
                                            >
                                            <textarea
                                                id="endorsementRemark"
                                                v-model="endorsementRemark"
                                                rows="2"
                                                placeholder="Enter endorsement remarks here..."
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <!-- Action Buttons - Two step structure -->
                                    <div class="mt-6 space-y-3">
                                        <div class="grid grid-cols-2 gap-3">
                                            <button
                                                @click="
                                                    handleReviewAction('Approved', 'review_status')
                                                "
                                                class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                            >
                                                <CheckCircleIcon class="w-4 h-4 mr-2" />
                                                Approve Review
                                            </button>
                                            <button
                                                @click="
                                                    handleReviewAction('Regretted', 'review_status')
                                                "
                                                class="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium text-red-700 bg-white rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                            >
                                                <XCircleIcon class="w-4 h-4 mr-2" />
                                                Regret Review
                                            </button>
                                        </div>
                                        <div class="grid grid-cols-2 gap-3">
                                            <button
                                                @click="
                                                    handleReviewAction(
                                                        'Approved',
                                                        'endorsement_decision'
                                                    )
                                                "
                                                class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                            >
                                                <CheckCircleIcon class="w-4 h-4 mr-2" />
                                                Approve Endorsement
                                            </button>
                                            <button
                                                @click="
                                                    handleReviewAction(
                                                        'Regretted',
                                                        'endorsement_decision'
                                                    )
                                                "
                                                class="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium text-red-700 bg-white rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                            >
                                                <XCircleIcon class="w-4 h-4 mr-2" />
                                                Regret Endorsement
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
    XIcon,
    UserIcon,
    BuildingIcon,
    ClipboardIcon,
    CheckCircleIcon,
    XCircleIcon,
} from 'lucide-vue-next'

const props = defineProps({
    application: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['close', 'update'])
const reviewRemark = ref('')
const endorsementRemark = ref('')

const getStatusClass = (status) => {
    const classes = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
        Processing: 'bg-blue-100 text-blue-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

const closeModal = () => {
    emit('close')
}

const handleReviewAction = (action, field) => {
    let updateData = {}

    if (field === 'review_status') {
        updateData = {
            review_status: action,
            review_remark: reviewRemark.value,
        }
    } else if (field === 'endorsement_decision') {
        updateData = {
            endorsement_decision: action,
            endorsement_remark: endorsementRemark.value,
        }
    }
    emit('update', updateData)
}

// Watch for changes in the application prop to update local remarks
watch(
    () => props.application,
    (newApplication) => {
        reviewRemark.value = newApplication.review_remark || ''
        endorsementRemark.value = newApplication.endorsement_remark || ''
    },
    { deep: true }
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
