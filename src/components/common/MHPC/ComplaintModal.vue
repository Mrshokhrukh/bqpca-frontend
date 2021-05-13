<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalAndReset" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="flex items-center text-xl sm:text-2xl font-semibold leading-6 text-slate-900 mb-2"
              >
                <MessageCircleWarning class="w-7 h-7 text-orange-500 mr-3 shrink-0" />
                Submit a Complaint
              </DialogTitle>

              <p class="text-slate-500 text-sm mb-6">
                Please provide details about your complaint. Fields marked with
                <span class="text-red-500">*</span> are required.
              </p>

              <form @submit.prevent="handleSubmitComplaint" class="space-y-8">
                <!-- Section: Complaint Type -->
                <div class="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <h4 class="font-medium text-slate-800 mb-4 flex items-center">
                    <ClipboardList class="w-5 h-5 text-orange-500 mr-2" />
                    Complaint Information
                  </h4>

                  <div class="space-y-4">
                    <div>
                      <label
                        for="professionalCategory"
                        class="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Professional Category <span class="text-red-500">*</span>
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <ClipboardList class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <select
                          id="professionalCategory"
                          name="professionalCategory"
                          v-model="complaintForm.professionalCategory"
                          required
                          class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        >
                          <option value="" disabled>Select category...</option>
                          <option
                            v-for="category in professionalCategories"
                            :key="category.value"
                            :value="category.value"
                          >
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                      <p v-if="formErrors.professionalCategory" class="mt-1 text-xs text-red-600">
                        {{ formErrors.professionalCategory }}
                      </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          for="complaintType"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Type of Complaint</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <ListFilter class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <select
                            id="complaintType"
                            name="complaintType"
                            v-model="complaintForm.complaintType"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          >
                            <option value="">Select type...</option>
                            <option value="malpractice">Medical Malpractice</option>
                            <option value="misconduct">Professional Misconduct</option>
                            <option value="negligence">Negligence</option>
                            <option value="service_quality">Service Quality/Ethics</option>
                            <option value="communication">Communication Issue</option>
                            <option value="billing">Billing/Fees Issue</option>
                            <option value="facility_standards">Facility Standards</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          for="incidentDatetime"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Date and Time of Incident</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <CalendarDays class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="datetime-local"
                            name="incidentDatetime"
                            id="incidentDatetime"
                            v-model="complaintForm.incidentDatetime"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label for="subject" class="block text-sm font-medium text-slate-700 mb-1">
                        Subject of Complaint <span class="text-red-500">*</span>
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <AlertTriangle class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          v-model="complaintForm.subject"
                          required
                          class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          placeholder="e.g., Regarding misdiagnosis on [Date]"
                        />
                      </div>
                      <p v-if="formErrors.subject" class="mt-1 text-xs text-red-600">
                        {{ formErrors.subject }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Section: Your Information -->
                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 class="font-medium text-slate-800 mb-4 flex items-center">
                    <User class="w-5 h-5 text-slate-600 mr-2" />
                    Your Information
                  </h4>

                  <div class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          for="submittedByName"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Your Name</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <User class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            name="submittedByName"
                            id="submittedByName"
                            v-model="complaintForm.submittedByName"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            placeholder="e.g., John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          for="submittedByEmail"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Your Email</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <Mail class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="email"
                            name="submittedByEmail"
                            id="submittedByEmail"
                            v-model="complaintForm.submittedByEmail"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            placeholder="e.g., you@example.com"
                          />
                        </div>
                        <p v-if="formErrors.submittedByEmail" class="mt-1 text-xs text-red-600">
                          {{ formErrors.submittedByEmail }}
                        </p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          for="submittedByContactNumber"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Your Contact Number</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <Phone class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="tel"
                            name="submittedByContactNumber"
                            id="submittedByContactNumber"
                            v-model="complaintForm.submittedByContactNumber"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            placeholder="e.g., 17XXXXXX (8 or 9 digits)"
                          />
                        </div>
                        <p
                          v-if="formErrors.submittedByContactNumber"
                          class="mt-1 text-xs text-red-600"
                        >
                          {{ formErrors.submittedByContactNumber }}
                        </p>
                      </div>

                      <div>
                        <label
                          for="submittedByAddress"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Your Address</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <MapPin class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            name="submittedByAddress"
                            id="submittedByAddress"
                            v-model="complaintForm.submittedByAddress"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            placeholder="e.g., 123 Main Street, Thimphu"
                          />
                        </div>
                      </div>
                    </div>

                    <div v-if="!showAggrievedSection" class="pt-2">
                      <button
                        type="button"
                        @click="showAggrievedSection = true"
                        class="text-sm text-orange-600 hover:text-orange-700 flex items-center"
                      >
                        <span class="mr-1"
                          >+ Add aggrieved party information (if different from you)</span
                        >
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Section: Aggrieved Party (Collapsible) -->
                <div
                  v-if="showAggrievedSection"
                  class="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="font-medium text-slate-800 flex items-center">
                      <User class="w-5 h-5 text-slate-600 mr-2" />
                      Aggrieved Party Information
                    </h4>
                    <button
                      type="button"
                      @click="showAggrievedSection = false"
                      class="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Hide section
                    </button>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label
                        for="aggrievedPartyName"
                        class="block text-sm font-medium text-slate-700 mb-1"
                        >Name of Aggrieved Party</label
                      >
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <User class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="aggrievedPartyName"
                          id="aggrievedPartyName"
                          v-model="complaintForm.aggrievedPartyName"
                          class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          placeholder="e.g., Jane Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        for="aggrievedPartyAddress"
                        class="block text-sm font-medium text-slate-700 mb-1"
                        >Address of Aggrieved Party</label
                      >
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <MapPin class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          name="aggrievedPartyAddress"
                          id="aggrievedPartyAddress"
                          v-model="complaintForm.aggrievedPartyAddress"
                          class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          placeholder="e.g., 456 Oak Avenue, Thimphu"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section: Professional/Institution Information -->
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 class="font-medium text-slate-800 mb-4 flex items-center">
                    <component :is="professionalNameIcon" class="w-5 h-5 text-blue-500 mr-2" />
                    {{
                      complaintForm.professionalCategory === 'institution'
                        ? 'Institution Information'
                        : 'Professional Information'
                    }}
                  </h4>

                  <div class="space-y-4">
                    <div>
                      <label
                        for="professionalName"
                        class="block text-sm font-medium text-slate-700 mb-1"
                      >
                        {{
                          complaintForm.professionalCategory === 'institution'
                            ? 'Institution Name'
                            : "Professional's Name"
                        }}
                        <span class="text-red-500">*</span>
                      </label>
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <component
                            :is="professionalNameIcon"
                            class="h-5 w-5 text-slate-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="text"
                          name="professionalName"
                          id="professionalName"
                          v-model="complaintForm.professionalName"
                          required
                          class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          :placeholder="professionalNamePlaceholder"
                        />
                      </div>
                      <p v-if="formErrors.professionalName" class="mt-1 text-xs text-red-600">
                        {{ formErrors.professionalName }}
                      </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div v-if="complaintForm.professionalCategory !== 'institution'">
                        <label
                          for="professionalDesignation"
                          class="block text-sm font-medium text-slate-700 mb-1"
                          >Professional's Designation</label
                        >
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <Briefcase class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            name="professionalDesignation"
                            id="professionalDesignation"
                            v-model="complaintForm.professionalDesignation"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            placeholder="e.g., Cardiologist, Senior Nurse"
                          />
                        </div>
                      </div>

                      <div
                        :class="{
                          'sm:col-span-2': complaintForm.professionalCategory === 'institution',
                        }"
                      >
                        <label
                          for="professionalWorkplace"
                          class="block text-sm font-medium text-slate-700 mb-1"
                        >
                          {{ professionalWorkplaceLabel }}
                        </label>
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <MapPin class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            name="professionalWorkplace"
                            id="professionalWorkplace"
                            v-model="complaintForm.professionalWorkplace"
                            class="block w-full rounded-md border-slate-300 pl-10 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            :placeholder="professionalWorkplacePlaceholder"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section: Complaint Details -->
                <div>
                  <h4 class="font-medium text-slate-800 mb-4 flex items-center">
                    <AlertTriangle class="w-5 h-5 text-orange-500 mr-2" />
                    Complaint Details
                  </h4>

                  <div class="space-y-4">
                    <div>
                      <label
                        for="grievanceDetails"
                        class="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Grievance Details <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        id="grievanceDetails"
                        name="grievanceDetails"
                        rows="5"
                        v-model="complaintForm.grievanceDetails"
                        required
                        class="block w-full rounded-md border-slate-300 shadow-sm py-2.5 px-3.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder="Provide a detailed description: events, dates, times, locations, individuals involved..."
                      ></textarea>
                      <p v-if="formErrors.grievanceDetails" class="mt-1 text-xs text-red-600">
                        {{ formErrors.grievanceDetails }}
                      </p>
                    </div>

                    <div>
                      <label for="attachment" class="block text-sm font-medium text-slate-700 mb-1"
                        >Attach Evidence (Optional, PDF up to 5MB)</label
                      >
                      <div
                        class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <div class="space-y-1 text-center">
                          <Paperclip class="mx-auto h-10 w-10 text-slate-400" />
                          <div class="flex text-sm text-slate-600">
                            <label
                              for="attachment"
                              class="relative cursor-pointer rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2"
                            >
                              <span>Upload a file</span>
                              <input
                                id="attachment"
                                name="attachment"
                                type="file"
                                accept=".pdf"
                                class="sr-only"
                                @change="handleFileChange"
                                ref="fileInputRef"
                              />
                            </label>
                            <p class="pl-1">or drag and drop</p>
                          </div>
                          <p class="text-xs text-slate-500">
                            {{ attachmentStatusText }}
                          </p>
                        </div>
                      </div>
                      <p v-if="formErrors.attachment" class="mt-1 text-xs text-red-600">
                        {{ formErrors.attachment }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="pt-4 flex flex-col sm:flex-row-reverse sm:items-center sm:justify-start gap-3"
                >
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="inline-flex w-full sm:w-auto justify-center items-center rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      v-if="isLoading"
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
                    <Send v-else class="w-5 h-5 mr-2 shrink-0" />
                    {{ isLoading ? 'Submitting...' : 'Submit Complaint' }}
                  </button>
                  <button
                    type="button"
                    @click="closeModalAndReset"
                    :disabled="isLoading"
                    class="inline-flex w-full sm:w-auto justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import {
  MessageCircleWarning,
  User,
  Mail,
  AlertTriangle,
  Send,
  Phone,
  Building,
  CalendarDays,
  ClipboardList,
  Paperclip,
  Briefcase,
  MapPin,
  UserCheck,
  ListFilter,
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_FILE_TYPES = ['application/pdf']
const CONTACT_NUMBER_PATTERN = /^\d{8,9}$/
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

const props = defineProps({
  isOpen: Boolean,
  professionalCategories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'complaint-submitted'])

const toast = useToast()
const fileInputRef = ref(null)
const showAggrievedSection = ref(false)

const getInitialFormState = () => ({
  professionalCategory: '',
  submittedByName: '',
  submittedByEmail: '',
  submittedByContactNumber: '',
  submittedByAddress: '',
  aggrievedPartyName: '',
  aggrievedPartyAddress: '',
  professionalName: '',
  professionalDesignation: '',
  professionalWorkplace: '',
  subject: '',
  incidentDatetime: '',
  complaintType: '',
  grievanceDetails: '',
  attachment: null,
})

const getInitialFormErrorsState = () => ({
  professionalCategory: '',
  submittedByEmail: '',
  submittedByContactNumber: '',
  professionalName: '',
  subject: '',
  grievanceDetails: '',
  attachment: '',
})

const complaintForm = reactive(getInitialFormState())
const formErrors = reactive(getInitialFormErrorsState())
const isLoading = ref(false)

const professionalNameIcon = computed(() =>
  complaintForm.professionalCategory === 'institution' ? Building : UserCheck,
)

const professionalNamePlaceholder = computed(() =>
  complaintForm.professionalCategory === 'institution'
    ? 'e.g., City Hospital'
    : 'e.g., Dr. Jane Smith',
)

const professionalWorkplaceLabel = computed(() =>
  complaintForm.professionalCategory === 'institution'
    ? 'Location/Address of Institution'
    : "Professional's Workplace",
)

const professionalWorkplacePlaceholder = computed(() =>
  complaintForm.professionalCategory === 'institution'
    ? 'e.g., Main Town, Thimphu'
    : 'e.g., JDWNRH, City Clinic',
)

const attachmentStatusText = computed(() =>
  complaintForm.attachment ? complaintForm.attachment.name : `PDF up to ${MAX_FILE_SIZE_MB}MB`,
)

const resetForm = () => {
  Object.assign(complaintForm, getInitialFormState())
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  Object.assign(formErrors, getInitialFormErrorsState())
  showAggrievedSection.value = false
}

const closeModalAndReset = () => {
  if (isLoading.value) return
  resetForm()
  emit('close')
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  formErrors.attachment = ''

  if (!file) {
    complaintForm.attachment = null
    return
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    formErrors.attachment = `File size must not exceed ${MAX_FILE_SIZE_MB}MB.`
  } else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    formErrors.attachment = 'Invalid file type. Only PDF is allowed.'
  }

  if (formErrors.attachment) {
    complaintForm.attachment = null
    if (fileInputRef.value) fileInputRef.value.value = ''
    toast.error(formErrors.attachment)
    return
  }
  complaintForm.attachment = file
}

const validateField = (
  field,
  value,
  errorMessage,
  condition = !value || (typeof value === 'string' && !value.trim()),
) => {
  if (condition) {
    formErrors[field] = errorMessage
    return false
  }
  return true
}

const validateForm = () => {
  Object.assign(formErrors, getInitialFormErrorsState())
  let isValid = true

  isValid &&= validateField(
    'professionalCategory',
    complaintForm.professionalCategory,
    'Professional category is required.',
  )
  isValid &&= validateField(
    'professionalName',
    complaintForm.professionalName,
    "Professional's/Institution's name is required.",
  )
  isValid &&= validateField('subject', complaintForm.subject, 'Subject is required.')
  isValid &&= validateField(
    'grievanceDetails',
    complaintForm.grievanceDetails,
    'Grievance details are required.',
  )

  if (complaintForm.submittedByEmail && !EMAIL_PATTERN.test(complaintForm.submittedByEmail)) {
    formErrors.submittedByEmail = 'Please enter a valid email address.'
    isValid = false
  }

  if (
    complaintForm.submittedByContactNumber &&
    !CONTACT_NUMBER_PATTERN.test(complaintForm.submittedByContactNumber.replace(/\s/g, ''))
  ) {
    formErrors.submittedByContactNumber = 'Contact number must be 8 or 9 digits.'
    isValid = false
  }

  if (formErrors.attachment) {
    // Re-check after file handling
    isValid = false
  }

  return isValid
}

const appendFormDataIfPresent = (formData, key, value, processValue = (v) => v) => {
  if (value) {
    formData.append(key, processValue(value))
  }
}

const handleSubmitComplaint = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form.')
    return
  }

  isLoading.value = true

  const formData = new FormData()
  formData.append('professional_category', complaintForm.professionalCategory)
  formData.append('professional_name', complaintForm.professionalName)
  formData.append('subject', complaintForm.subject)
  formData.append('grievance_details', complaintForm.grievanceDetails)

  if (complaintForm.professionalCategory !== 'institution') {
    appendFormDataIfPresent(
      formData,
      'professional_designation',
      complaintForm.professionalDesignation,
    )
  }
  appendFormDataIfPresent(formData, 'professional_workplace', complaintForm.professionalWorkplace)
  appendFormDataIfPresent(formData, 'submitted_by_name', complaintForm.submittedByName)
  appendFormDataIfPresent(formData, 'submitted_by_email', complaintForm.submittedByEmail)
  appendFormDataIfPresent(
    formData,
    'submitted_by_contact_number',
    complaintForm.submittedByContactNumber,
    (v) => v.replace(/\s/g, ''),
  )
  appendFormDataIfPresent(formData, 'submitted_by_address', complaintForm.submittedByAddress)
  appendFormDataIfPresent(formData, 'aggrieved_party_name', complaintForm.aggrievedPartyName)
  appendFormDataIfPresent(formData, 'aggrieved_party_address', complaintForm.aggrievedPartyAddress)
  appendFormDataIfPresent(formData, 'incident_datetime', complaintForm.incidentDatetime)
  appendFormDataIfPresent(formData, 'complaint_type', complaintForm.complaintType)
  appendFormDataIfPresent(formData, 'attachment', complaintForm.attachment)
  formData.append('status', 'Submitted')

  try {
    await apiService.submitMhpcComplaint(formData)
    toast.success('Complaint submitted successfully.')
    emit('complaint-submitted')
    closeModalAndReset()
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to submit complaint. Please try again.'
    toast.error(errorMessage)
    console.error('Complaint submission error:', error.response?.data || error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  },
)

watch(
  () => complaintForm.professionalCategory,
  (newVal, oldVal) => {
    if (newVal === 'institution') {
      complaintForm.professionalDesignation = ''
    }
    if (newVal !== oldVal) {
      formErrors.professionalName = '' // Clear error on category change
    }
  },
)
</script>

<style scoped>
.required-field::after {
  content: '*';
  color: #ef4444;
  margin-left: 0.25rem;
}
</style>
