<template>
    <div class="bg-gray-50 py-6 sm:py-8">
        <div class="w-full mx-auto px-4 sm:px-6">
            <!-- Header -->
            <div
                class="bg-gradient-to-r from-indigo-200 via-blue-100 to-indigo-200 rounded-xl p-5 sm:p-7 mb-8 shadow-sm"
            >
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">
                    Certificate of Good Standing (CoGS) Application
                </h2>
                <p class="text-sm sm:text-base text-gray-700 text-center max-w-2xl mx-auto">
                    Please fill in all required fields marked with an asterisk (<span
                        class="text-red-600 font-medium"
                        >*</span
                    >). Ensure all information provided is accurate and up-to-date.
                </p>
            </div>

            <!-- Main Form -->
            <form @submit.prevent="submitForm" class="space-y-8">
                <!-- Hidden Fields (Prefilled from Auth Store) -->
                <input type="hidden" v-model="form.registration_no" />
                <input type="hidden" v-model="form.cid_no" />
                <input type="hidden" v-model="form.full_name" />
                <input type="hidden" v-model="form.gender" />

                <!-- Supervisor Details Section -->
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 border-b">
                        <div class="flex items-center space-x-3 sm:space-x-4">
                            <div
                                class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm"
                            >
                                1
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-bold text-gray-900">
                                    Supervisor Details
                                </h3>
                                <p class="mt-1 text-xs sm:text-sm text-gray-600">
                                    Information about your supervisor
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 sm:p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            <!-- Supervisor Name -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 required"
                                    >Supervisor's Name</label
                                >
                                <input
                                    type="text"
                                    v-model="form.supervisor_name"
                                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter supervisor's name"
                                />
                                <span
                                    v-if="errors.supervisor_name"
                                    class="text-xs text-red-500 block"
                                    >{{ errors.supervisor_name }}</span
                                >
                            </div>

                            <!-- Supervisor Designation -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 required"
                                    >Supervisor's Designation</label
                                >
                                <input
                                    type="text"
                                    v-model="form.supervisor_designation"
                                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter supervisor's designation"
                                />
                                <span
                                    v-if="errors.supervisor_designation"
                                    class="text-xs text-red-500 block"
                                    >{{ errors.supervisor_designation }}</span
                                >
                            </div>

                            <!-- Agency -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 required"
                                    >Agency</label
                                >
                                <Listbox v-model="form.agency">
                                    <div class="relative">
                                        <ListboxButton
                                            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left"
                                        >
                                            <span class="block truncate">{{
                                                selectedAgencyName || 'Select Agency'
                                            }}</span>
                                            <span
                                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                            >
                                                <ChevronDownIcon
                                                    class="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </ListboxButton>
                                        <transition
                                            leave-active-class="transition duration-100 ease-in"
                                            leave-from-class="opacity-100"
                                            leave-to-class="opacity-0"
                                        >
                                            <ListboxOptions
                                                class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                                            >
                                                <ListboxOption
                                                    v-for="agency in agencyOptions"
                                                    :key="agency.id"
                                                    :value="agency.id"
                                                    v-slot="{ active, selected }"
                                                >
                                                    <div
                                                        :class="[
                                                            active
                                                                ? 'text-white bg-blue-600'
                                                                : 'text-gray-900',
                                                            'cursor-default select-none relative py-2 pl-10 pr-4',
                                                        ]"
                                                    >
                                                        <span
                                                            :class="[
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal',
                                                                'block truncate',
                                                            ]"
                                                        >
                                                            {{ agency.name }}
                                                        </span>
                                                        <span
                                                            v-if="selected"
                                                            :class="[
                                                                active
                                                                    ? 'text-white'
                                                                    : 'text-blue-600',
                                                                'absolute inset-y-0 left-0 flex items-center pl-3',
                                                            ]"
                                                        >
                                                            <CheckIcon
                                                                class="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </div>
                                                </ListboxOption>
                                            </ListboxOptions>
                                        </transition>
                                    </div>
                                </Listbox>
                                <span v-if="errors.agency" class="text-xs text-red-500 block">{{
                                    errors.agency
                                }}</span>
                            </div>

                            <!-- Supervisor Contact Number -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 required"
                                    >Supervisor's Contact Number</label
                                >
                                <input
                                    type="tel"
                                    v-model="form.contact_number"
                                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter supervisor's contact number"
                                />
                                <span
                                    v-if="errors.contact_number"
                                    class="text-xs text-red-500 block"
                                    >{{ errors.contact_number }}</span
                                >
                            </div>

                            <!-- Supervisor Email Address -->
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700 required"
                                    >Supervisor's Email Address</label
                                >
                                <input
                                    type="email"
                                    v-model="form.email_address"
                                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter supervisor's email address"
                                />
                                <span
                                    v-if="errors.email_address"
                                    class="text-xs text-red-500 block"
                                    >{{ errors.email_address }}</span
                                >
                            </div>

                            <!-- Reason for Application -->
                            <div class="space-y-2 md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 required"
                                    >Reason for Application</label
                                >
                                <textarea
                                    v-model="form.reason_for_application"
                                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    rows="3"
                                    placeholder="Enter reason for application"
                                ></textarea>
                                <span
                                    v-if="errors.reason_for_application"
                                    class="text-xs text-red-500 block"
                                    >{{ errors.reason_for_application }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recipient Details Section -->
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 border-b">
                        <div class="flex items-center space-x-3 sm:space-x-4">
                            <div
                                class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm"
                            >
                                2
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-bold text-gray-900">
                                    Recipient Details
                                </h3>
                                <p class="mt-1 text-xs sm:text-sm text-gray-600">
                                    Information about the certificate recipient
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 sm:p-6">
                        <!-- Recipient Toggle -->
                        <div class="mb-5 sm:mb-6">
                            <div class="flex items-center">
                                <Switch
                                    v-model="isRecipientSelf"
                                    class="relative inline-flex items-center mr-3"
                                >
                                    <span class="sr-only">Toggle recipient</span>
                                    <div
                                        :class="[
                                            isRecipientSelf ? 'bg-blue-600' : 'bg-gray-200',
                                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                                        ]"
                                    >
                                        <span
                                            :class="[
                                                isRecipientSelf ? 'translate-x-6' : 'translate-x-1',
                                                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-1',
                                            ]"
                                        />
                                    </div>
                                </Switch>
                                <span class="text-sm font-medium text-gray-900">{{
                                    isRecipientSelf ? 'Self' : 'Other Recipient'
                                }}</span>
                                <span class="ml-2 text-xs text-gray-500"
                                    >(Toggle to change recipient type)</span
                                >
                            </div>
                        </div>

                        <!-- Other Recipient Form -->
                        <TransitionRoot as="template" :show="!isRecipientSelf">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <!-- Recipient Name -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700 required"
                                        >Recipient's Name</label
                                    >
                                    <input
                                        type="text"
                                        v-model="form.recipient_name"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter recipient's name"
                                    />
                                    <span
                                        v-if="errors.recipient_name"
                                        class="text-xs text-red-500 block"
                                        >{{ errors.recipient_name }}</span
                                    >
                                </div>

                                <!-- Recipient Contact Number -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700 required"
                                        >Recipient's Contact Number</label
                                    >
                                    <input
                                        type="tel"
                                        v-model="form.recipient_contact_number"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter recipient's contact number"
                                    />
                                    <span
                                        v-if="errors.recipient_contact_number"
                                        class="text-xs text-red-500 block"
                                        >{{ errors.recipient_contact_number }}</span
                                    >
                                </div>

                                <!-- Recipient Email -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700 required"
                                        >Recipient's Email</label
                                    >
                                    <input
                                        type="email"
                                        v-model="form.recipient_email"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter recipient's email address"
                                    />
                                    <span
                                        v-if="errors.recipient_email"
                                        class="text-xs text-red-500 block"
                                        >{{ errors.recipient_email }}</span
                                    >
                                </div>

                                <!-- Recipient Address -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700 required"
                                        >Recipient's Address</label
                                    >
                                    <input
                                        type="text"
                                        v-model="form.address"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter recipient's full address"
                                    />
                                    <span
                                        v-if="errors.address"
                                        class="text-xs text-red-500 block"
                                        >{{ errors.address }}</span
                                    >
                                </div>

                                <!-- Recipient PO Box -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700"
                                        >Recipient's PO. Box</label
                                    >
                                    <input
                                        type="text"
                                        v-model="form.po_box"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter recipient's PO Box (optional)"
                                    />
                                    <span v-if="errors.po_box" class="text-xs text-red-500 block">{{
                                        errors.po_box
                                    }}</span>
                                </div>

                                <!-- Recipient Zip Code -->
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-gray-700"
                                        >Recipient's Zip code</label
                                    >
                                    <input
                                        type="text"
                                        v-model="form.zip_code"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter recipient's zip code (optional)"
                                    />
                                    <span
                                        v-if="errors.zip_code"
                                        class="text-xs text-red-500 block"
                                        >{{ errors.zip_code }}</span
                                    >
                                </div>
                            </div>
                        </TransitionRoot>
                    </div>
                </div>

                <!-- Declaration Section -->
                <div
                    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 border-b">
                        <div class="flex items-center space-x-3 sm:space-x-4">
                            <div
                                class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm"
                            >
                                3
                            </div>
                            <div>
                                <h3 class="text-lg sm:text-xl font-bold text-gray-900">
                                    Declaration
                                </h3>
                                <p class="mt-1 text-xs sm:text-sm text-gray-600">
                                    Please read and agree to the terms
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 sm:p-6">
                        <div class="bg-blue-50 p-4 rounded-lg mb-4">
                            <p class="text-sm text-gray-700">
                                By submitting this form, I declare that all information provided is
                                true and accurate to the best of my knowledge.
                            </p>
                        </div>
                        <div class="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                v-model="form.declaration"
                                id="declarationCheckbox"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 mt-0.5"
                            />
                            <label for="declarationCheckbox" class="text-sm text-gray-700">
                                I declare that the information provided is true and accurate.
                                <button
                                    type="button"
                                    @click="openTermsModal"
                                    class="text-blue-600 hover:underline font-medium ml-1"
                                >
                                    Read Full Terms & Conditions
                                </button>
                            </label>
                        </div>
                        <span v-if="errors.declaration" class="text-xs text-red-500 block mt-1">
                            {{ errors.declaration }}
                        </span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-4 mt-8">
                    <button
                        type="button"
                        @click="cancelForm"
                        class="px-5 py-2.5 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        :disabled="!form.declaration"
                        :class="[
                            form.declaration
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-300 cursor-not-allowed text-white',
                            'px-5 py-2.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                        ]"
                    >
                        Submit Application
                    </button>
                </div>
            </form>

            <!-- Success message -->
            <div v-if="message" :class="['mt-4 p-4 rounded-lg', messageClass]">
                {{ message }}
            </div>

            <!-- Terms Modal -->
            <TransitionRoot as="template" :show="showTermsModal">
                <Dialog
                    as="div"
                    class="fixed z-50 inset-0 overflow-y-auto"
                    @close="closeTermsModal"
                >
                    <div
                        class="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0"
                    >
                        <TransitionChild
                            as="template"
                            enter="ease-out duration-300"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="ease-in duration-200"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <DialogOverlay
                                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            />
                        </TransitionChild>

                        <span
                            class="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        ></span>

                        <TransitionChild
                            as="template"
                            enter="ease-out duration-300"
                            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leave-from="opacity-100 translate-y-0 sm:scale-100"
                            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div
                                class="relative inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
                            >
                                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div class="sm:flex sm:items-start">
                                        <div
                                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                                        >
                                            <DocumentTextIcon
                                                class="h-6 w-6 text-blue-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div
                                            class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full"
                                        >
                                            <DialogTitle
                                                as="h3"
                                                class="text-lg leading-6 font-medium text-gray-900"
                                            >
                                                Terms and Conditions
                                            </DialogTitle>
                                            <div class="mt-4 prose prose-sm text-gray-500">
                                                <p>
                                                    By submitting this application for a Certificate
                                                    of Good Standing, I hereby declare that:
                                                </p>
                                                <ol class="list-decimal pl-5 space-y-2 mt-2">
                                                    <li>
                                                        All information provided in this application
                                                        is true, accurate, and complete to the best
                                                        of my knowledge.
                                                    </li>
                                                    <li>
                                                        I understand that providing false
                                                        information may result in the rejection of
                                                        my application and possible legal
                                                        consequences.
                                                    </li>
                                                    <li>
                                                        I authorize the relevant authorities to
                                                        verify the information provided in this
                                                        application.
                                                    </li>
                                                    <li>
                                                        I agree to comply with all applicable laws,
                                                        regulations, and professional standards
                                                        related to the Certificate of Good Standing.
                                                    </li>
                                                    <li>
                                                        I understand that the Certificate of Good
                                                        Standing may be revoked if any information
                                                        provided is found to be false or misleading.
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                                >
                                    <button
                                        type="button"
                                        class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        @click="closeTermsModal"
                                    >
                                        I Understand
                                    </button>
                                    <button
                                        type="button"
                                        class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        @click="closeTermsModal"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </TransitionChild>
                    </div>
                </Dialog>
            </TransitionRoot>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Switch,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
    registration_no: '',
    cid_no: '',
    full_name: '',
    gender: '',
    reason_for_application: '',
    supervisor_name: '',
    supervisor_designation: '',
    agency: null,
    contact_number: '',
    email_address: '',
    recipient_name: '',
    recipient_contact_number: '',
    recipient_email: '',
    address: '',
    po_box: '',
    zip_code: '',
    declaration: false,
})

const errors = reactive({})
const isRecipientSelf = ref(true)
const showTermsModal = ref(false)
const agencyOptions = ref([])
const message = ref('')
const messageClass = ref('')

const fetchRegistrationNumber = async (cid) => {
    try {
        const response = await apiService.getMhpcApplicationsByCid(cid)
        if (response.data && response.data.length > 0) {
            return response.data[0].registration_no
        }
        return null
    } catch (error) {
        toast.error('Failed to fetch registration number: ' + error.message)
        console.error('Error fetching registration number:', error)
        return null
    }
}

const fetchMasterData = async () => {
    try {
        const agenciesResponse = await apiService.getMhpcMastersCogsAgencies()
        agencyOptions.value = agenciesResponse.data.results
    } catch (error) {
        toast.error('Failed to fetch master data: ' + error.message)
        console.error('Error fetching master data:', error)
    }
}

onMounted(async () => {
    if (authStore.user) {
        form.cid_no = authStore.user.cid
        form.full_name = authStore.user.middle_name
            ? `${authStore.user.first_name} ${authStore.user.middle_name} ${authStore.user.last_name}`
            : `${authStore.user.first_name} ${authStore.user.last_name}`
        form.gender = authStore.user.gender
        form.user_contact_number = authStore.user.contact_number
        form.user_email = authStore.user.email

        const registrationNumber = await fetchRegistrationNumber(form.cid_no)
        if (registrationNumber) {
            form.registration_no = registrationNumber
        }
        await fetchMasterData()
    }
    updateRecipientDetails()
})

const validateForm = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    let isValid = true

    if (!form.reason_for_application) {
        errors.reason_for_application = 'Reason for Application is required'
        isValid = false
    }
    if (!form.supervisor_name) {
        errors.supervisor_name = 'Supervisor Name is required'
        isValid = false
    }
    if (!form.supervisor_designation) {
        errors.supervisor_designation = 'Supervisor Designation is required'
        isValid = false
    }
    if (!form.agency) {
        errors.agency = 'Agency is required'
        isValid = false
    }
    if (!form.contact_number) {
        errors.contact_number = 'Supervisor Contact Number is required'
        isValid = false
    } else if (!/^\d{8,12}$/.test(form.contact_number)) {
        errors.contact_number = 'Please enter a valid contact number (8-12 digits)'
        isValid = false
    }
    if (!form.email_address) {
        errors.email_address = 'Supervisor Email is required'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_address)) {
        errors.email_address = 'Please enter a valid email address'
        isValid = false
    }

    if (!isRecipientSelf.value) {
        if (!form.recipient_name) {
            errors.recipient_name = 'Recipient Name is required'
            isValid = false
        }
        if (!form.recipient_contact_number) {
            errors.recipient_contact_number = 'Recipient Contact Number is required'
            isValid = false
        } else if (!/^\d{8,12}$/.test(form.recipient_contact_number)) {
            errors.recipient_contact_number = 'Please enter a valid contact number (8-12 digits)'
            isValid = false
        }
        if (!form.recipient_email) {
            errors.recipient_email = 'Recipient Email is required'
            isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipient_email)) {
            errors.recipient_email = 'Please enter a valid email address'
            isValid = false
        }
        if (!form.address) {
            errors.address = 'Recipient Address is required'
            isValid = false
        }
    }
    if (!form.declaration) {
        errors.declaration = 'You must agree to the declaration before submitting.'
        isValid = false
    }
    return isValid
}

const submitForm = async () => {
    if (validateForm()) {
        try {
            // Show loading indicator or disable button here if needed
            const requestData = {
                registration_no: form.registration_no,
                cid_no: form.cid_no,
                full_name: form.full_name,
                gender: form.gender,
                reason_for_application: form.reason_for_application,
                supervisor_name: form.supervisor_name,
                supervisor_designation: form.supervisor_designation,
                agency: form.agency,
                department: null,
                workplace: null,
                contact_number: form.contact_number,
                email_address: form.email_address,
                recipient_name: isRecipientSelf.value ? form.full_name : form.recipient_name,
                recipient_contact_number: isRecipientSelf.value
                    ? form.user_contact_number
                    : form.recipient_contact_number,
                recipient_email: isRecipientSelf.value ? form.user_email : form.recipient_email,
                address: isRecipientSelf.value ? '' : form.address,
                po_box: isRecipientSelf.value ? '' : form.po_box,
                zip_code: isRecipientSelf.value ? '' : form.zip_code,
                declaration: form.declaration,
                review_status: 'Pending',
                review_remark: '',
                endorsement_decision: 'Pending',
                endorsement_remark: '',
                is_payment_complete: false,
                payment_id: '',
                is_active: true,
            }

            const response = await apiService.createMhpcCogs(requestData)

            if (response.status === 201) {
                toast.success('Application submitted successfully!')
                // Show success message
                message.value = 'Your application has been submitted successfully!'
                messageClass.value = 'bg-green-100 text-green-800 border border-green-200'

                // Redirect after a short delay
                setTimeout(() => {
                    router.push('/admin/user/health_certification/dashboard')
                }, 2000)
            } else {
                toast.error('An unexpected error occurred. Please try again.')
                console.error('Unexpected response status:', response.status)
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            if (error.response) {
                console.error('Error data:', error.response.data)
                console.error('Error status:', error.response.status)

                // Handle validation errors from the server
                if (error.response.status === 400 && error.response.data) {
                    const serverErrors = error.response.data

                    // Map server errors to form errors
                    Object.keys(serverErrors).forEach((key) => {
                        if (key in errors) {
                            errors[key] = Array.isArray(serverErrors[key])
                                ? serverErrors[key][0]
                                : serverErrors[key]
                        }
                    })

                    toast.error('Please correct the errors in the form.')
                } else {
                    toast.error(
                        `Server error: ${error.response.status} - ${
                            error.response.data.detail || 'See console for details'
                        }`
                    )
                }
            } else if (error.request) {
                toast.error(
                    'No response received from the server. Please check your network connection.'
                )
            } else {
                toast.error('An error occurred: ' + error.message)
            }
        }
    } else {
        toast.error('Please correct the errors in the form.')
        // Scroll to the first error
        const firstError = document.querySelector('.text-red-500')
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }
}

const cancelForm = () => {
    // Show confirmation dialog
    if (formHasValues()) {
        if (!confirm('Are you sure you want to cancel? All form data will be lost.')) {
            return
        }
    }

    Object.assign(form, {
        registration_no: '',
        cid_no: '',
        full_name: '',
        gender: '',
        reason_for_application: '',
        supervisor_name: '',
        supervisor_designation: '',
        agency: null,
        contact_number: '',
        email_address: '',
        recipient_name: '',
        recipient_contact_number: '',
        recipient_email: '',
        address: '',
        po_box: '',
        zip_code: '',
        declaration: false,
    })

    isRecipientSelf.value = true
    Object.keys(errors).forEach((key) => delete errors[key])

    message.value = 'Form has been cleared.'
    messageClass.value = 'bg-blue-100 text-blue-800 border border-blue-200'
    setTimeout(() => {
        message.value = ''
        messageClass.value = ''
    }, 3000)
}

// Helper function to check if form has any values
const formHasValues = () => {
    return (
        form.reason_for_application ||
        form.supervisor_name ||
        form.supervisor_designation ||
        form.agency ||
        form.contact_number ||
        form.email_address ||
        (!isRecipientSelf.value &&
            (form.recipient_name ||
                form.recipient_contact_number ||
                form.recipient_email ||
                form.address ||
                form.po_box ||
                form.zip_code))
    )
}

const updateRecipientDetails = () => {
    if (isRecipientSelf.value && authStore.user) {
        form.recipient_name = authStore.user.fullName || form.full_name
        form.recipient_contact_number =
            authStore.user.contactNumber || authStore.user.contact_number
        form.recipient_email = authStore.user.email
        form.address = ''
        form.po_box = ''
        form.zip_code = ''
    } else if (!isRecipientSelf.value) {
        form.recipient_name = ''
        form.recipient_contact_number = ''
        form.recipient_email = ''
        form.address = ''
        form.po_box = ''
        form.zip_code = ''
    }
}

watch(isRecipientSelf, updateRecipientDetails)

const openTermsModal = () => {
    showTermsModal.value = true
}

const closeTermsModal = () => {
    showTermsModal.value = false
}

const selectedAgencyName = computed(() => {
    const agency = agencyOptions.value.find((a) => a.id === form.agency)
    return agency ? agency.name : ''
})
</script>

<style scoped>
.required::after {
    content: ' *';
    color: #ef4444;
    font-weight: bold;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

input:hover,
textarea:hover,
select:hover {
    border-color: #93c5fd;
}

/* Animation for form sections */
.bg-white {
    transition: all 0.3s ease-in-out;
}

.bg-white:hover {
    transform: translateY(-2px);
}

/* Responsive text sizes */
@media (max-width: 640px) {
    .text-sm {
        font-size: 0.8125rem;
    }
    .text-xs {
        font-size: 0.75rem;
    }
}
</style>
