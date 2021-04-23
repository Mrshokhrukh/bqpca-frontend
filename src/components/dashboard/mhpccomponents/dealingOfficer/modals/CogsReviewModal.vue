<template>
    <Transition name="modal-fade">
        <div
            v-if="isOpen"
            class="fixed z-50 inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div class="relative w-full w-full mx-auto">
                <div class="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div
                        class="bg-blue-50 px-8 py-5 border-b border-blue-100 flex justify-between items-center"
                    >
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">
                                {{ isEditing ? 'Edit' : 'View' }} Application Details
                            </h2>
                            <div class="flex items-center mt-1 space-x-2">
                                <span class="text-sm font-medium text-gray-600"
                                    >Registration No:</span
                                >
                                <span
                                    class="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full"
                                >
                                    {{ application.registration_no }}
                                </span>
                            </div>
                        </div>
                        <button
                            @click="closeModal"
                            class="rounded-full p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                        >
                            <XIcon class="w-6 h-6" />
                        </button>
                    </div>

                    <div class="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div class="mb-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <h3
                                class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                            >
                                <ClipboardIcon class="w-5 h-5 text-blue-500" />
                                Application Progress
                            </h3>
                            <div class="flex items-center justify-between w-full">
                                <div class="flex flex-col items-center text-center">
                                    <div
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center',
                                            getTimelineStepClass(application.review_status),
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
                                <div class="flex-1 h-1 mx-2 bg-gray-200 relative">
                                    <div
                                        :class="[
                                            'absolute top-0 left-0 h-full',
                                            getTimelineBarClass(application.review_status),
                                        ]"
                                    ></div>
                                </div>
                                <div class="flex flex-col items-center text-center">
                                    <div
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center',
                                            getTimelineStepClass(
                                                application.endorsement_decision,
                                                application.review_status === 'Approved'
                                            ),
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
                                <div class="flex-1 h-1 mx-2 bg-gray-200 relative">
                                    <div
                                        :class="[
                                            'absolute top-0 left-0 h-full',
                                            getTimelineBarClass(
                                                application.endorsement_decision,
                                                application.is_payment_complete
                                            ),
                                        ]"
                                    ></div>
                                </div>
                                <div class="flex flex-col items-center text-center">
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
                            <div class="lg:col-span-7 space-y-6">
                                <div
                                    class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                                >
                                    <h3
                                        class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                                    >
                                        <UserIcon class="w-5 h-5 text-blue-500" /> Applicant Details
                                        <span
                                            v-if="isEditing"
                                            class="text-xs font-normal text-orange-600"
                                            >(Editing core details - use caution)</span
                                        >
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Full Name</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.full_name"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.full_name || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >CID No</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.cid_no"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.cid_no || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Gender</label
                                            >
                                            <select
                                                v-if="isEditing"
                                                v-model="editableApplication.gender"
                                                class="modal-input"
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Others</option>
                                            </select>
                                            <span v-else class="modal-display-text">{{
                                                application.gender || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Contact Number</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="tel"
                                                v-model="editableApplication.contact_number"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.contact_number || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Email Address</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="email"
                                                v-model="editableApplication.email_address"
                                                class="modal-input"
                                            />
                                            <a
                                                v-else
                                                :href="'mailto:' + application.email_address"
                                                class="text-sm text-blue-600 hover:underline"
                                                >{{ application.email_address || 'N/A' }}</a
                                            >
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Address</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.address"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.address || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >PO Box</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.po_box"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.po_box || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >ZIP Code</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.zip_code"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.zip_code || 'N/A'
                                            }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                                >
                                    <h3
                                        class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                                    >
                                        <BuildingIcon class="w-5 h-5 text-blue-500" /> Workplace
                                        Details
                                        <span
                                            v-if="isEditing"
                                            class="text-xs font-normal text-orange-600"
                                            >(Editing names only)</span
                                        >
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Agency</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.agency_name"
                                                class="modal-input"
                                                placeholder="Enter agency name"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.agency?.name || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Department</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.department_name"
                                                class="modal-input"
                                                placeholder="Enter department name"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.department?.name || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Workplace</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.workplace_name"
                                                class="modal-input"
                                                placeholder="Enter workplace name"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.workplace?.name || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Supervisor Name</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.supervisor_name"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.supervisor_name || 'N/A'
                                            }}</span>
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Supervisor Designation</label
                                            >
                                            <input
                                                v-if="isEditing"
                                                type="text"
                                                v-model="editableApplication.supervisor_designation"
                                                class="modal-input"
                                            />
                                            <span v-else class="modal-display-text">{{
                                                application.supervisor_designation || 'N/A'
                                            }}</span>
                                        </div>
                                        <div class="md:col-span-2">
                                            <label
                                                class="block text-sm font-medium text-gray-500 mb-1"
                                                >Reason for Application</label
                                            >
                                            <textarea
                                                v-if="isEditing"
                                                v-model="editableApplication.reason_for_application"
                                                rows="3"
                                                class="modal-input"
                                            ></textarea>
                                            <p v-else class="text-base text-gray-900 mt-1">
                                                {{ application.reason_for_application || 'N/A' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="lg:col-span-5">
                                <div
                                    class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6"
                                >
                                    <h3
                                        class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"
                                    >
                                        <ClipboardIcon class="w-5 h-5 text-blue-500" /> Review &
                                        Actions
                                    </h3>

                                    <div class="mb-4">
                                        <label
                                            for="reviewStatus"
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >Review Status</label
                                        >
                                        <select
                                            v-if="isEditing"
                                            id="reviewStatus"
                                            v-model="editableApplication.review_status"
                                            class="modal-input"
                                        >
                                            <option>Pending</option>
                                            <option>Approved</option>
                                            <option>Rejected</option>
                                        </select>
                                        <div v-else class="rounded-lg bg-gray-50 p-3">
                                            <div class="flex justify-between items-center">
                                                <span class="text-sm font-medium text-gray-700"
                                                    >Current Status</span
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
                                        </div>
                                        <label
                                            for="reviewRemark"
                                            class="block text-sm font-medium text-gray-700 mt-2 mb-1"
                                            >Review Remark</label
                                        >
                                        <textarea
                                            v-if="isEditing"
                                            id="reviewRemark"
                                            v-model="editableApplication.review_remark"
                                            rows="3"
                                            placeholder="Enter review remarks..."
                                            class="modal-input"
                                        ></textarea>
                                        <p v-else class="modal-display-text-block">
                                            {{ application.review_remark || 'No remarks' }}
                                        </p>
                                    </div>

                                    <div class="mb-6">
                                        <label
                                            for="endorsementDecision"
                                            class="block text-sm font-medium text-gray-700 mb-1"
                                            >Endorsement Decision</label
                                        >
                                        <select
                                            v-if="isEditing"
                                            id="endorsementDecision"
                                            v-model="editableApplication.endorsement_decision"
                                            class="modal-input"
                                        >
                                            <option>Pending</option>
                                            <option>Approved</option>
                                            <option>Rejected</option>
                                        </select>
                                        <div v-else class="rounded-lg bg-gray-50 p-3">
                                            <div class="flex justify-between items-center">
                                                <span class="text-sm font-medium text-gray-700"
                                                    >Current Decision</span
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
                                        </div>
                                        <label
                                            for="endorsementRemark"
                                            class="block text-sm font-medium text-gray-700 mt-2 mb-1"
                                            >Endorsement Remark</label
                                        >
                                        <textarea
                                            v-if="isEditing"
                                            id="endorsementRemark"
                                            v-model="editableApplication.endorsement_remark"
                                            rows="3"
                                            placeholder="Enter endorsement remarks..."
                                            class="modal-input"
                                        ></textarea>
                                        <p v-else class="modal-display-text-block">
                                            {{ application.endorsement_remark || 'No remarks' }}
                                        </p>
                                    </div>

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
                                                application.payment_id || 'N/A'
                                            }}</span>
                                        </p>
                                    </div>

                                    <div class="mt-6 space-y-3">
                                        <template v-if="isEditing">
                                            <div class="flex gap-3">
                                                <button
                                                    @click="saveChanges"
                                                    class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                                >
                                                    <CheckCircleIcon class="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </button>
                                                <button
                                                    @click="cancelEdit"
                                                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <button
                                                @click="enterEditMode"
                                                class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                            >
                                                <PencilIcon class="w-4 h-4 mr-2" />
                                                Edit Application Details
                                            </button>
                                        </template>
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
import { ref, reactive, watch, defineProps, defineEmits } from 'vue'
import {
    XIcon,
    UserIcon,
    BuildingIcon,
    ClipboardIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon, // Import PencilIcon
} from 'lucide-vue-next'

// --- Props & Emits ---
const props = defineProps({
    application: {
        type: Object,
        required: true,
        default: () => ({}), // Provide default empty object
    },
    isOpen: {
        // Prop to control visibility from parent
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close', 'update'])

// --- State ---
const isEditing = ref(false) // Controls edit mode
const editableApplication = reactive({}) // Local reactive copy for editing

// --- Methods ---

// Helper to get status CSS classes
const getStatusClass = (status) => {
    const classes = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800' // Default
}

// Helper for timeline step appearance
const getTimelineStepClass = (status, previousStepApproved = true) => {
    if (!previousStepApproved) return 'bg-gray-100 text-gray-700'
    if (status === 'Approved') return 'bg-green-100 text-green-700'
    if (status === 'Rejected') return 'bg-red-100 text-red-700'
    if (previousStepApproved && status !== 'Approved' && status !== 'Rejected')
        return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
}

// Helper for timeline bar appearance
const getTimelineBarClass = (status, nextStepActiveOrComplete = false) => {
    if (status === 'Approved' && nextStepActiveOrComplete) return 'bg-green-500 w-full'
    if (status === 'Approved') return 'bg-green-500 w-1/2'
    if (status === 'Rejected') return 'bg-red-500 w-full'
    if (status === 'Pending') return 'bg-blue-500 w-1/2'
    return 'bg-gray-200 w-0'
}

// Initialize the editable copy when entering edit mode
const initializeEditableData = () => {
    // Applicant Details
    editableApplication.full_name = props.application.full_name || ''
    editableApplication.cid_no = props.application.cid_no || ''
    editableApplication.gender = props.application.gender || 'Others' // Default if needed
    editableApplication.contact_number = props.application.contact_number || ''
    editableApplication.email_address = props.application.email_address || ''
    editableApplication.address = props.application.address || ''
    editableApplication.po_box = props.application.po_box || ''
    editableApplication.zip_code = props.application.zip_code || ''

    // Workplace Details (Editing names, might not update relations)
    editableApplication.agency_name = props.application.agency?.name || ''
    editableApplication.department_name = props.application.department?.name || ''
    editableApplication.workplace_name = props.application.workplace?.name || ''
    editableApplication.supervisor_name = props.application.supervisor_name || ''
    editableApplication.supervisor_designation = props.application.supervisor_designation || ''
    editableApplication.reason_for_application = props.application.reason_for_application || ''

    // Review & Endorsement
    editableApplication.review_status = props.application.review_status || 'Pending'
    editableApplication.review_remark = props.application.review_remark || ''
    editableApplication.endorsement_decision = props.application.endorsement_decision || 'Pending'
    editableApplication.endorsement_remark = props.application.endorsement_remark || ''

    // Add any other fields you want editable
    console.log('Editable data initialized:', JSON.parse(JSON.stringify(editableApplication))) // Log deep copy
}

// Enter edit mode
const enterEditMode = () => {
    console.log('Entering edit mode. Initial data:', props.application)
    initializeEditableData() // Populate local state
    isEditing.value = true
}

// Cancel edit mode
const cancelEdit = () => {
    console.log('Cancelling edit mode.')
    isEditing.value = false
    // Resetting editableApplication is not strictly needed as it's repopulated on entering edit mode
}

// Save changes made in edit mode
const saveChanges = () => {
    console.log(
        'Attempting to save changes. Current editable data:',
        JSON.parse(JSON.stringify(editableApplication))
    )
    const changedData = {}

    // Compare editable fields with original prop data - Check ALL fields made editable
    // Applicant Details (Use caution editing these)
    if (editableApplication.full_name !== (props.application.full_name || ''))
        changedData.full_name = editableApplication.full_name
    if (editableApplication.cid_no !== (props.application.cid_no || ''))
        changedData.cid_no = editableApplication.cid_no
    if (editableApplication.gender !== (props.application.gender || 'Others'))
        changedData.gender = editableApplication.gender
    if (editableApplication.contact_number !== (props.application.contact_number || ''))
        changedData.contact_number = editableApplication.contact_number
    if (editableApplication.email_address !== (props.application.email_address || ''))
        changedData.email_address = editableApplication.email_address
    if (editableApplication.address !== (props.application.address || ''))
        changedData.address = editableApplication.address
    if (editableApplication.po_box !== (props.application.po_box || ''))
        changedData.po_box = editableApplication.po_box
    if (editableApplication.zip_code !== (props.application.zip_code || ''))
        changedData.zip_code = editableApplication.zip_code

    // Workplace Details (Names only - backend might need IDs)
    if (editableApplication.agency_name !== (props.application.agency?.name || ''))
        changedData.agency_name = editableApplication.agency_name // Sending name, not ID
    if (editableApplication.department_name !== (props.application.department?.name || ''))
        changedData.department_name = editableApplication.department_name // Sending name, not ID
    if (editableApplication.workplace_name !== (props.application.workplace?.name || ''))
        changedData.workplace_name = editableApplication.workplace_name // Sending name, not ID
    if (editableApplication.supervisor_name !== (props.application.supervisor_name || ''))
        changedData.supervisor_name = editableApplication.supervisor_name
    if (
        editableApplication.supervisor_designation !==
        (props.application.supervisor_designation || '')
    )
        changedData.supervisor_designation = editableApplication.supervisor_designation
    if (
        editableApplication.reason_for_application !==
        (props.application.reason_for_application || '')
    )
        changedData.reason_for_application = editableApplication.reason_for_application

    // Review & Endorsement
    if (editableApplication.review_status !== (props.application.review_status || 'Pending'))
        changedData.review_status = editableApplication.review_status
    if (editableApplication.review_remark !== (props.application.review_remark || ''))
        changedData.review_remark = editableApplication.review_remark
    if (
        editableApplication.endorsement_decision !==
        (props.application.endorsement_decision || 'Pending')
    )
        changedData.endorsement_decision = editableApplication.endorsement_decision
    if (editableApplication.endorsement_remark !== (props.application.endorsement_remark || ''))
        changedData.endorsement_remark = editableApplication.endorsement_remark

    // --- End of comparisons ---

    if (Object.keys(changedData).length > 0) {
        console.log('Emitting update with payload:', changedData)
        emit('update', changedData) // Emit only changed data
    } else {
        console.log('No changes detected.')
        // Optionally show a message that no changes were made or just exit edit mode
    }
    isEditing.value = false // Exit edit mode after saving or if no changes
}

// Close the modal (emits close event)
const closeModal = () => {
    // Reset editing state if modal is closed while editing
    if (isEditing.value) {
        isEditing.value = false
    }
    emit('close')
}

// --- Watchers ---
// Reset edit mode if the application prop changes externally
watch(
    () => props.application,
    (newApplication, oldApplication) => {
        // Only react if the application ID actually changes or if it's a new object instance
        if (newApplication?.id !== oldApplication?.id || newApplication !== oldApplication) {
            console.log('Application prop changed:', newApplication)
            if (isEditing.value) {
                console.log('Prop changed while editing, cancelling edit mode.')
                cancelEdit()
            }
        }
    },
    { deep: true }
)

// Initialize/reset edit mode based on isOpen prop
watch(
    () => props.isOpen,
    (newIsOpen) => {
        if (!newIsOpen) {
            isEditing.value = false // Ensure edit mode is off when modal closes
        }
        // No need to initialize editableApplication here, enterEditMode does that
    },
    { immediate: true }
)
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* Shared input styles */
.modal-input {
    @apply block w-full text-base rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
    /* Add padding */
    padding: 0.5rem 0.75rem;
    /* py-2 px-3 equivalent */
}

textarea.modal-input {
    min-height: 6rem;
    /* Give textareas some default height */
}

/* Shared display text styles */
.modal-display-text {
    @apply text-base text-gray-900 block;
    /* Ensure it's a block for layout */
    padding: 0.5rem 0.75rem;
    /* Match input padding */
    min-height: calc(1.5rem + 1rem + 2px);
    /* Match input height (line-height + padding + border) */
    line-height: 1.5rem;
    /* sm:text-sm line height */
}

.modal-display-text-block {
    /* For paragraphs that replace textareas */
    @apply text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-100 block;
    min-height: 6rem;
    /* Match textarea rows=3 approx */
}

/* Add focus styles for accessibility */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 2px solid #3b82f6;
    /* blue-500 */
    outline-offset: 1px;
    border-color: transparent !important;
    /* Hide default border on focus */
}

/* Ensure labels have margin below */
label {
    margin-bottom: 0.25rem;
    /* mb-1 */
}
</style>
