<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
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
              class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
            >
              <!-- Header -->
              <div class="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-xl font-bold text-white">
                    Submit a Complaint
                  </DialogTitle>
                  <button
                    @click="closeModal"
                    class="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <XIcon class="w-6 h-6" />
                  </button>
                </div>
              </div>

              <!-- Form body -->
              <div class="max-h-[80vh] overflow-y-auto p-6">
                <form @submit.prevent="handleSubmitComplaint" class="space-y-6">
                  <!-- Progress indicator -->
                  <div class="mb-8">
                    <div class="w-full bg-gray-100 rounded-full h-2.5">
                      <div class="bg-red-500 h-2.5 rounded-full" :style="{ width: formProgress + '%' }"></div>
                    </div>
                  </div>

                  <!-- Professional Category -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <label for="professionalCategory" class="block text-sm font-medium text-gray-700 mb-1">
                      Professional Category <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="professionalCategory"
                      v-model="form.professionalCategory"
                      required
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      :class="{ 'border-red-500 ring-1 ring-red-500': errors.professionalCategory }"
                    >
                      <option disabled value="">Select a category</option>
                      <option v-for="category in professionalCategories" :key="category.id" :value="category.id">
                        {{ category.category_name }}
                      </option>
                    </select>
                    <p v-if="errors.professionalCategory" class="mt-1 text-xs text-red-600">{{ errors.professionalCategory }}</p>
                  </div>

                  <!-- Professional Details -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <User class="w-4 h-4 mr-2 text-red-500" />
                      Professional Involved
                    </h4>
                    <div class="space-y-4">
                      <div>
                        <label for="profName" class="block text-sm font-medium text-gray-700 mb-1">
                          Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="profName"
                          v-model="form.professionalDetails.name"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.profName }"
                        />
                        <p v-if="errors.profName" class="mt-1 text-xs text-red-600">{{ errors.profName }}</p>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="profDesignation" class="block text-sm font-medium text-gray-700 mb-1">
                            Designation <span class="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="profDesignation"
                            v-model="form.professionalDetails.designation"
                            required
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            :class="{ 'border-red-500 ring-1 ring-red-500': errors.profDesignation }"
                          />
                          <p v-if="errors.profDesignation" class="mt-1 text-xs text-red-600">{{ errors.profDesignation }}</p>
                        </div>
                        <div>
                          <label for="profWorkplace" class="block text-sm font-medium text-gray-700 mb-1">
                            Workplace <span class="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="profWorkplace"
                            v-model="form.professionalDetails.workplace"
                            required
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            :class="{ 'border-red-500 ring-1 ring-red-500': errors.profWorkplace }"
                          />
                          <p v-if="errors.profWorkplace" class="mt-1 text-xs text-red-600">{{ errors.profWorkplace }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Date and Time of Incident -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar class="w-4 h-4 mr-2 text-red-500" />
                      Incident Details
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label for="incidentDate" class="block text-sm font-medium text-gray-700 mb-1">
                          Date of Incident <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="incidentDate"
                          v-model="form.incidentDate"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.incidentDate }"
                        />
                        <p v-if="errors.incidentDate" class="mt-1 text-xs text-red-600">{{ errors.incidentDate }}</p>
                      </div>
                      <div>
                        <label for="incidentTime" class="block text-sm font-medium text-gray-700 mb-1">
                          Time of Incident <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          id="incidentTime"
                          v-model="form.incidentTime"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.incidentTime }"
                        />
                        <p v-if="errors.incidentTime" class="mt-1 text-xs text-red-600">{{ errors.incidentTime }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Grievance/Complaint -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText class="w-4 h-4 mr-2 text-red-500" />
                      Complaint Details
                    </h4>
                    <div>
                      <label for="grievance" class="block text-sm font-medium text-gray- نداشته
                      mb-1">
                        Grievance/Complaint Details <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        id="grievance"
                        v-model="form.grievance"
                        rows="4"
                        required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        :class="{ 'border-red-500 ring-1 ring-red-500': errors.grievance }"
                      ></textarea>
                      <p v-if="errors.grievance" class="mt-1 text-xs text-red-600">{{ errors.grievance }}</p>
                    </div>
                  </div>

                  <!-- Aggrieved Party Details -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <User class="w-4 h-4 mr-2 text-red-500" />
                      Aggrieved Party
                    </h4>
                    <div class="space-y-4">
                      <div>
                        <label for="aggrievedName" class="block text-sm font-medium text-gray-700 mb-1">
                          Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="aggrievedName"
                          v-model="form.aggrievedParty.name"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.aggrievedName }"
                        />
                        <p v-if="errors.aggrievedName" class="mt-1 text-xs text-red-600">{{ errors.aggrievedName }}</p>
                      </div>
                      <div>
                        <label for="aggrievedAddress" class="block text-sm font-medium text-gray-700 mb-1">
                          Address <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          id="aggrievedAddress"
                          v-model="form.aggrievedParty.address"
                          rows="2"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.aggrievedAddress }"
                        ></textarea>
                        <p v-if="errors.aggrievedAddress" class="mt-1 text-xs text-red-600">{{ errors.aggrievedAddress }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Attachment -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <Paperclip class="w-4 h-4 mr-2 text-red-500" />
                      Attachments
                    </h4>
                    <div>
                      <label for="attachment" class="block text-sm font-medium text-gray-700 mb-1">
                        Supporting Document (Optional PDF, max 5MB)
                      </label>
                      <input
                        type="file"
                        id="attachment"
                        ref="fileInput"
                        @change="handleFileChange"
                        accept=".pdf"
                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                      <p v-if="errors.attachment" class="mt-1 text-xs text-red-600">{{ errors.attachment }}</p>
                      <p v-if="attachmentName" class="mt-2 text-sm text-gray-600">
                        Selected file: {{ attachmentName }}
                      </p>
                    </div>
                  </div>

                  <!-- Submitted By Details -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <UserCircle class="w-4 h-4 mr-2 text-red-500" />
                      Your Information
                    </h4>
                    <div class="space-y-4">
                      <div>
                        <label for="submitterName" class="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="submitterName"
                          v-model="form.submittedBy.name"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.submitterName }"
                        />
                        <p v-if="errors.submitterName" class="mt-1 text-xs text-red-600">{{ errors.submitterName }}</p>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="submitterContact" class="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Phone class="h-4 w-4 text-gray-400" />
                              <span class="ml-2 text-gray-500">+975</span>
                            </div>
                            <input
                              type="tel"
                              id="submitterContact"
                              v-model="form.submittedBy.contactNumber"
                              required
                              maxlength="9"
                              pattern="\d{9}"
                              title="Please enter a 9-digit contact number"
                              class="block w-full pl-16 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                              :class="{ 'border-red-500 ring-1 ring-red-500': errors.submitterContact }"
                            />
                          </div>
                          <p v-if="errors.submitterContact" class="mt-1 text-xs text-red-600">{{ errors.submitterContact }}</p>
                        </div>
                        <div>
                          <label for="submitterEmail" class="block text-sm font-medium text-gray-700 mb-1">
                            Email Address <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Mail class="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="submitterEmail"
                              v-model="form.submittedBy.email"
                              required
                              class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                              :class="{ 'border-red-500 ring-1 ring-red-500': errors.submitterEmail }"
                            />
                          </div>
                          <p v-if="errors.submitterEmail" class="mt-1 text-xs text-red-600">{{ errors.submitterEmail }}</p>
                        </div>
                      </div>
                      <div>
                        <label for="submitterAddress" class="block text-sm font-medium text-gray-700 mb-1">
                          Your Address <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                          <div class="absolute top-3 left-3 pointer-events-none">
                            <MapPin class="h-4 w-4 text-gray-400" />
                          </div>
                          <textarea
                            id="submitterAddress"
                            v-model="form.submittedBy.address"
                            rows="2"
                            required
                            class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            :class="{ 'border-red-500 ring-1 ring-red-500': errors.submitterAddress }"
                          ></textarea>
                        </div>
                        <p v-if="errors.submitterAddress" class="mt-1 text-xs text-red-600">{{ errors.submitterAddress }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Captcha -->
                  <div class="bg-gray-50 p-5 rounded-lg">
                    <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                      <Shield class="w-4 h-4 mr-2 text-red-500" />
                      Verification
                    </h4>
                    <div class="flex items-center space-x-3">
                      <div class="flex-grow">
                        <label for="captcha" class="block text-sm font-medium text-gray-700 mb-1">
                          Solve: {{ captcha.num1 }} + {{ captcha.num2 }} = ? <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="captcha"
                          v-model="form.captchaAnswer"
                          required
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          :class="{ 'border-red-500 ring-1 ring-red-500': errors.captcha }"
                        />
                      </div>
                      <button
                        type="button"
                        @click="generateCaptcha"
                        class="p-2 text-sm text-red-600 hover:text-red-800 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
                      >
                        <RefreshCw class="w-5 h-5" />
                      </button>
                    </div>
                    <p v-if="errors.captcha" class="mt-1 text-xs text-red-600">{{ errors.captcha }}</p>
                  </div>

                  <!-- Action Buttons -->
                  <div class="sticky bottom-0 pt-4 pb-2 bg-white border-t border-gray-200">
                    <div class="flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closeModal"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        :disabled="isSubmitting"
                        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                      >
                        <Loader2 v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5" />
                        {{ isSubmitting ? 'Submitting...' : 'Submit Complaint' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import {
  XIcon,
  RefreshCw,
  Loader2,
  User,
  UserCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Paperclip,
  Calendar,
  Shield
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'complaint-submitted'])

const toast = useToast()
const fileInput = ref(null)
const attachmentName = ref('')

const initialFormState = () => ({
  professionalCategory: '',
  professionalDetails: {
    name: '',
    designation: '',
    workplace: '',
  },
  incidentDate: '',
  incidentTime: '',
  grievance: '',
  aggrievedParty: {
    name: '',
    address: '',
  },
  attachment: null,
  submittedBy: {
    name: '',
    contactNumber: '',
    email: '',
    address: '',
  },
  captchaAnswer: '',
})

const form = reactive(initialFormState())
const errors = reactive({})
const professionalCategories = ref([])
const captcha = reactive({ num1: 0, num2: 0, answer: 0 })
const isSubmitting = ref(false)

const formProgress = computed(() => {
  let filledFields = 0
  let totalFields = 12 // Increased due to separate date and time fields

  if (form.professionalCategory) filledFields++
  if (form.professionalDetails.name.trim()) filledFields++
  if (form.professionalDetails.designation.trim()) filledFields++
  if (form.professionalDetails.workplace.trim()) filledFields++
  if (form.incidentDate) filledFields++
  if (form.incidentTime) filledFields++
  if (form.grievance.trim()) filledFields++
  if (form.aggrievedParty.name.trim()) filledFields++
  if (form.aggrievedParty.address.trim()) filledFields++
  if (form.submittedBy.name.trim()) filledFields++
  if (form.submittedBy.contactNumber.trim() && /^\d{9}$/.test(form.submittedBy.contactNumber.trim())) filledFields++
  if (form.submittedBy.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submittedBy.email.trim())) filledFields++
  if (form.submittedBy.address.trim()) filledFields++
  if (form.captchaAnswer !== '' && parseInt(form.captchaAnswer) === captcha.answer) filledFields++

  return Math.round((filledFields / totalFields) * 100)
})

const generateCaptcha = () => {
  captcha.num1 = Math.floor(Math.random() * 10) + 1
  captcha.num2 = Math.floor(Math.random() * 10) + 1
  captcha.answer = captcha.num1 + captcha.num2
  form.captchaAnswer = ''
}

const fetchProfessionalCategories = async () => {
  try {
    const response = await apiService.getMhpcMastersPersonnelCategories()
    professionalCategories.value = response.data.results || response.data
  } catch (error) {
    console.error('Error fetching professional categories:', error)
    toast.error('Failed to load professional categories.')
  }
}

const resetForm = () => {
  Object.assign(form, initialFormState())
  Object.keys(errors).forEach(key => delete errors[key])
  generateCaptcha()
  attachmentName.value = ''
  nextTick(() => {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  })
}

const closeModal = () => {
  resetForm()
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
    if (professionalCategories.value.length === 0) {
      fetchProfessionalCategories()
    }
    generateCaptcha()
  }
})

const handleFileChange = (event) => {
  const files = event.target.files
  errors.attachment = ''

  if (files && files.length > 0) {
    const file = files[0]

    if (file.type !== 'application/pdf') {
      errors.attachment = 'Only PDF files are allowed.'
      attachmentName.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.attachment = 'File size must be less than 5MB.'
      attachmentName.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      return
    }

    attachmentName.value = file.name
    form.attachment = file
  } else {
    attachmentName.value = ''
    form.attachment = null
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (!form.professionalCategory) {
    errors.professionalCategory = 'Professional category is required.'
    isValid = false
  }
  if (!form.professionalDetails.name.trim()) {
    errors.profName = 'Professional\'s name is required.'
    isValid = false
  }
  if (!form.professionalDetails.designation.trim()) {
    errors.profDesignation = 'Professional\'s designation is required.'
    isValid = false
  }
  if (!form.professionalDetails.workplace.trim()) {
    errors.profWorkplace = 'Professional\'s workplace is required.'
    isValid = false
  }
  if (!form.incidentDate) {
    errors.incidentDate = 'Incident date is required.'
    isValid = false
  } else {
    const incidentDate = new Date(form.incidentDate)
    if (incidentDate > new Date()) {
      errors.incidentDate = 'Incident date cannot be in the future.'
      isValid = false
    }
  }
  if (!form.incidentTime) {
    errors.incidentTime = 'Incident time is required.'
    isValid = false
  }
  if (!form.grievance.trim()) {
    errors.grievance = 'Grievance details are required.'
    isValid = false
  }
  if (!form.aggrievedParty.name.trim()) {
    errors.aggrievedName = 'Aggrieved party name is required.'
    isValid = false
  }
  if (!form.aggrievedParty.address.trim()) {
    errors.aggrievedAddress = 'Aggrieved party address is required.'
    isValid = false
  }
  if (!form.submittedBy.name.trim()) {
    errors.submitterName = 'Your name is required.'
    isValid = false
  }
  if (!form.submittedBy.contactNumber.trim()) {
    errors.submitterContact = 'Your contact number is required.'
    isValid = false
  } else if (!/^\d{9}$/.test(form.submittedBy.contactNumber.trim())) {
    errors.submitterContact = 'Contact number must be 9 digits.'
    isValid = false
  }
  if (!form.submittedBy.email.trim()) {
    errors.submitterEmail = 'Your email is required.'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submittedBy.email.trim())) {
    errors.submitterEmail = 'Invalid email format.'
    isValid = false
  }
  if (!form.submittedBy.address.trim()) {
    errors.submitterAddress = 'Your address is required.'
    isValid = false
  }
  if (form.captchaAnswer === '' || parseInt(form.captchaAnswer) !== captcha.answer) {
    errors.captcha = 'Incorrect captcha answer.'
    isValid = false
  }

  return isValid
}

const handleSubmitComplaint = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form.')
    const firstErrorElement = document.querySelector('.border-red-500')
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true

  const formData = new FormData()
  formData.append('professional_category', form.professionalCategory)
  formData.append('professional_name', form.professionalDetails.name)
  formData.append('professional_designation', form.professionalDetails.designation)
  formData.append('professional_workplace', form.professionalDetails.workplace)
  formData.append('incident_date', form.incidentDate)
  formData.append('incident_time', form.incidentTime)
  formData.append('grievance_details', form.grievance)
  formData.append('aggrieved_party_name', form.aggrievedParty.name)
  formData.append('aggrieved_party_address', form.aggrievedParty.address)
  formData.append('submitted_by_name', form.submittedBy.name)
  formData.append('submitted_by_contact_number', `+975${form.submittedBy.contactNumber}`)
  formData.append('submitted_by_email', form.submittedBy.email)
  formData.append('submitted_by_address', form.submittedBy.address)

  if (form.attachment) {
    formData.append('attachment', form.attachment)
  }

  try {
    const response = await apiService.submitMhpcComplaint(formData)
    toast.success('Complaint submitted successfully!', {
      icon: '✅',
      timeout: 4000,
    })
    emit('complaint-submitted', response.data)
    closeModal()
  } catch (error) {
    console.error('Error submitting complaint:', error)
    toast.error(error.response?.data?.message || 'Failed to submit complaint. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (props.isOpen && professionalCategories.value.length === 0) {
    fetchProfessionalCategories()
    generateCaptcha()
  }
})
</script>

<style scoped>
/* Additional styling for improving the form appearance */
:deep(input:focus), :deep(select:focus), :deep(textarea:focus) {
  border-color: rgb(239 68 68);
  --tw-ring-color: rgb(239 68 68);
  --tw-ring-offset-width: 1px;
}

:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus) {
  box-shadow: 0 0 0px 1000px white inset;
}

/* Ensure error styling persists and remains visible */
:deep(.border-red-500) {
  border-color: rgb(239 68 68);
  outline: 1px solid rgb(239 68 68);
}

/* Improve scrollbar styling */
.max-h-\[80vh\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[80vh\]::-webkit-scrollbar-track {
  background-color: rgb(243 244 246);
  border-radius: 9999px;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb {
  background-color: rgb(209 213 219);
  border-radius: 9999px;
}

.max-h-\[80vh\]::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156 163 175);
}

/* Animate transitions */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.bg-gradient-to-r {
  animation: fadeIn 0.5s ease-in-out;
}
</style>