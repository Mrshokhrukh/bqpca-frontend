<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
    <!-- Use the common PageHeader component -->
    <PageHeader :title="selectedType === 'cid' ? 'CID Holder Registration' : 'Non-CID Holder Registration'">
      <template #icon>
        <UserPlus class="w-6 h-6 text-indigo-600" />
      </template>
      <template #subtitle>
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>).
        Ensure all information provided is accurate and up-to-date.
      </template>
    </PageHeader>

    <!-- Confirmation Modal -->
    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-50" @close="isConfirmationModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Confirm Submission
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to submit the application? Please review all
                        information before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    @click="handleSubmitActual">
                    Confirm
                  </button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="isConfirmationModalOpen = false">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Step 1: Personal Information Form -->
    <form @submit.prevent="handleNext" class="bg-white border rounded-xl shadow-sm p-4 sm:p-6" v-if="stage === 1">
      <h3 class="text-lg font-semibold text-gray-900 my-3">Step 1: Registration</h3>
      <div class="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p class="mt-1 text-sm text-gray-500">Basic details needed for registration</p>
      </div>

      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- CID Holder Fields -->
          <template v-if="selectedType === 'cid'">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">CID No.</label>
              <input v-model="localFormData.cid_no" type="number" maxlength="11"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter CID number" @input="fetchDCRCData" />
              <span v-if="errors.cid_no" class="text-xs text-red-500 mt-1">{{
                errors.cid_no
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <input type="text" v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
              <span v-if="errors.dzongkhag" class="text-xs text-red-500 mt-1">{{
                errors.dzongkhag
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Gewog</label>
              <input type="text" v-model="localFormData.gewog"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
              <span v-if="errors.gewog" class="text-xs text-red-500 mt-1">{{ errors.gewog }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input type="text" v-model="localFormData.village"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
              <span v-if="errors.village" class="text-xs text-red-500 mt-1">{{
                errors.village
              }}</span>
            </div>
          </template>

          <!-- Non-CID Holder Fields -->
          <template v-else>
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
              <select v-model="localFormData.nationality"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">SELECT NATIONALITY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.nationality" class="text-xs text-red-500 mt-1">{{
                errors.nationality
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
              <input v-model="localFormData.email_address" type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Email Address" />
              <span v-if="errors.email_address" class="text-xs text-red-500 mt-1">{{
                errors.email_address
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Identity / Work Permit No</label>
              <input v-model="localFormData.workPermitNo" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Identity / Work Permit No" />
              <span v-if="errors.workPermitNo" class="text-xs text-red-500 mt-1">{{
                errors.workPermitNo
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Country</label>
              <select v-model="localFormData.country"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">SELECT COUNTRY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.country" class="text-xs text-red-500 mt-1">{{
                errors.country
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input v-model="localFormData.city" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="City" />
              <span v-if="errors.city" class="text-xs text-red-500 mt-1">{{ errors.city }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">State</label>
              <input v-model="localFormData.state" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="State" />
              <span v-if="errors.state" class="text-xs text-red-500 mt-1">{{ errors.state }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
              <input v-model="localFormData.mobileNumber" type="tel"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Mobile Number" />
              <span v-if="errors.mobileNumber" class="text-xs text-red-500 mt-1">{{
                errors.mobileNumber
              }}</span>
            </div>
          </template>

          <!-- Common Fields -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input v-model="localFormData.full_name" type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter full name" />
            <span v-if="errors.full_name" class="text-xs text-red-500 mt-1">{{
              errors.full_name
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select v-model="localFormData.gender"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="O">Other</option>
            </select>
            <span v-if="errors.gender" class="text-xs text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input type="date" v-model="localFormData.date_of_birth"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2" />
            <span v-if="errors.date_of_birth" class="text-xs text-red-500 mt-1">{{
              errors.date_of_birth
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input v-model="localFormData.contact_no" type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter phone number" />
            <span v-if="errors.contact_no" class="text-xs text-red-500 mt-1">{{
              errors.contact_no
            }}</span>
          </div>
        </div>
        <div class="col-span-1 sm:col-span-2"> <!-- Make it span full width for emphasis? Or col-span-1 -->
          <label class="block text-sm font-medium text-gray-700 required">Registration Type</label>
          <select v-model="localFormData.registration_type"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
            <option value="">Select Registration Type</option>
            <option v-for="regType in registrationTypes" :key="regType.id" :value="regType.id">
              {{ regType.name }} <!-- Assuming the type has 'id' and 'name' fields -->
            </option>
          </select>
          <span v-if="errors.registration_type" class="text-xs text-red-500 mt-1">{{
            errors.registration_type
          }}</span>
        </div>

        <!-- Passport Photo Section -->
        <div class="mt-8">
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Passport Photo</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 required">Upload Passport Photo</label>
                <input type="file" @change="handlePassportPhotoSelect"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".jpg,.jpeg,.png" />
                <span v-if="errors.passport_photo" class="text-xs text-red-500 mt-1">{{
                  errors.passport_photo
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-end space-x-3">
          <button type="button" @click="$emit('back')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Back to Previous Step
          </button>
          <button type="submit"
            class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </form>

    <!-- Step 2: Medical Institution Registration Form -->
    <form class="bg-white border rounded-xl shadow-sm p-4 sm:p-6" v-else-if="stage === 2">
      <h3 class="text-lg font-semibold text-gray-900 my-3">
        Step 2: Qualification & Document Upload
      </h3>

      <!-- Qualification Details Section -->
      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Qualification Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
              <select v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Qualification Type</option>
                <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                  {{ type.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-xs text-red-500 mt-1">{{
                errors.qualification_type
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
              <select v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Qualification Name</option>
                <option v-for="qualification in qualifications" :key="qualification.id" :value="qualification.id">
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-xs text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
              <select v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Institute/University</option>
                <option v-for="university in universities" :key="university.id" :value="university.id">
                  {{ university.country }}, {{ university.university }},
                  {{ university.institute_name }}
                </option>
              </select>
              <span v-if="errors.institute" class="text-xs text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Year of Completion</label>
              <input type="month" v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="YYYY" />
              <span v-if="errors.year_of_completion" class="text-xs text-red-500 mt-1">{{
                errors.year_of_completion
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Supporting Documents Section -->
      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Supporting Documents</h3>
          <div class="space-y-3">
            <div v-for="(doc, index) in supportingDocuments" :key="index"
              class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg border border-gray-100">
              <div class="w-full sm:w-1/3">
                <select v-model="doc.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm">
                  <option value="">Select Document Type</option>
                  <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                    {{ type.document_name }}
                  </option>
                </select>
              </div>
              <div class="flex-1 flex items-center space-x-2">
                <input type="file" @change="(e) => handleFileSelect(e, index)"
                  class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
                <button @click="removeDocument(index)" type="button"
                  class="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <span class="sr-only">Remove</span>
                  ✕
                </button>
              </div>
            </div>

            <button type="button" @click="addDocument"
              class="mt-3 px-3 py-2 bg-blue-50 text-sm text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center">
              <span class="mr-1.5">+</span>
              Add Another Document
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Required documents are graduation certificate, cid copy, security clarance, roq
            certificate, class 10, 12 and graduation marksheets.
          </p>
        </div>
      </div>

      <!-- Declaration Section -->
      <div class="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Declaration</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea v-model="localFormData.remarks" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
              placeholder="Enter any additional remarks or comments"></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <input type="checkbox" v-model="localFormData.declaration"
              class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label class="text-sm text-gray-700">
              I hereby declare that all the information provided above is true and correct to the
              best of my knowledge. I understand that any false statements may result in the
              rejection of my registration.
            </label>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-6 flex justify-end space-x-3">
        <button type="button" @click="stage = 1"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Back to Personal Information
        </button>
        <button type="button" @click="openConfirmationModal"
          class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors">
          Submit Registration
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue' // Import the common header
import { UserPlus } from 'lucide-vue-next' // Import an appropriate icon

const authStore = useAuthStore()
const userId = authStore.userId
const user = authStore.user
const router = useRouter()

const props = defineProps({
  selectedType: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'submit',
  'back',
  'create',
  'cancel',
  'view-checklist',
  'declare-code',
])

const stage = ref(1)
const applicationId = ref(null)

const fetchedDocumentTypes = ref([])

const supportingDocuments = ref([{ type: '', files: [], description: '' }])

const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [], description: '' })
}

const removeDocument = (index) => {
  supportingDocuments.value.splice(index, 1)
}

const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)
  if (files.some((file) => file.size > 2 * 1024 * 1024)) {
    errors.documents = 'File size should not exceed 2MB'
    return
  }
  supportingDocuments.value[index].files = files
  updateFormDocuments()
}

const updateFormDocuments = () => {
  const documents = supportingDocuments.value.reduce((acc, doc) => {
    if (doc.files.length > 0) {
      acc.push({
        type: doc.type,
        files: doc.files,
        description: doc.description,
      })
    }
    return acc
  }, [])
  localFormData.documents = documents
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
]

const qualificationTypes = ref([])
const qualifications = ref([])
const universities = ref([])
const registrationTypes = ref([]);

onMounted(async () => {
  try {
    const qualificationTypesResponse = await apiService.getMhpcMastersQualificationTypes()
    const qualificationsResponse = await apiService.getMhpcMastersQualifications()
    const universitiesResponse = await apiService.getMhpcMastersUniversities()
    const regTypesResponse = await apiService.getMhpcMastersRegistrationTypes();
    registrationTypes.value = regTypesResponse.data.results;
    qualificationTypes.value = qualificationTypesResponse.data.results
    qualifications.value = qualificationsResponse.data.results
    universities.value = universitiesResponse.data.results

    const documentTypesResponse = await apiService.getMhpcMastersDocumentTypes()
    fetchedDocumentTypes.value = documentTypesResponse.data.results
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error('Failed to fetch master data. Please try again.')
  }
})

const localFormData = reactive({
  ...props.modelValue,
  cid_holder: props.selectedType === 'cid',
  nationality: props.selectedType === 'cid' ? 'Bhutanese' : '',
  email_address: user.email,
  workPermitNo: '',
  mobileNumber: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  city: '',
  state: '',
  country: '',
  passport_photo: null,
  documents: [],
  remarks: '',
  declaration: false,
  payment_status: 'False',
  payment_id: null,
  registration_date: null,
  expiry_date: null,
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: null,
  is_active: 'False',
  application: null,
  registration_type: '',
})

const errors = reactive({})
const isConfirmationModalOpen = ref(false)
const isSubmitting = ref(false)
const toast = useToast()
const isLoadingDCRC = ref(false)

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(localFormData.cid_no)
})

watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData })
  },
  { deep: true },
)

const validateFormStageOne = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!localFormData.full_name) {
    errors.full_name = 'Full name is required'
    isValid = false
  }
  if (!localFormData.gender) {
    errors.gender = 'Gender is required'
    isValid = false
  }
  if (!localFormData.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required'
    isValid = false
  }
  if (!localFormData.contact_no) {
    errors.contact_no = 'Contact number is required'
    isValid = false
  }
  if (!localFormData.passport_photo) {
    errors.passport_photo = 'Passport photo is required'
    isValid = false
  }

  if (props.selectedType === 'cid') {
    if (!localFormData.cid_no) {
      errors.cid_no = 'CID is required'
      isValid = false
    } else if (localFormData.cid_no.length > 11) {
      errors.cid_no = 'CID must be no more than 11 digits.'
      isValid = false
    }

    if (!localFormData.dzongkhag) {
      errors.dzongkhag = 'Dzongkhag is required'
      isValid = false
    }
    if (!localFormData.village) {
      errors.village = 'Village is required'
      isValid = false
    }
  } else {
    if (!localFormData.nationality) {
      errors.nationality = 'Nationality is required'
      isValid = false
    }
    if (!localFormData.email_address) {
      errors.email_address = 'Email is required'
      isValid = false
    }
    if (!localFormData.workPermitNo) {
      errors.workPermitNo = 'Work permit number is required'
      isValid = false
    }
    if (!localFormData.country) {
      errors.country = 'Country is required'
      isValid = false
    }
    if (!localFormData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required'
      isValid = false
    } else if (localFormData.mobileNumber.length > 8) {
      errors.mobileNumber = 'Mobile number must be no more than 8 digits.'
      isValid = false
    } else if (!/^[17]/.test(localFormData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must start with 1 or 7.'
      isValid = false
    }
  }

  return isValid
}

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  // Stage 1 Validations (re-run just in case)
  if (!validateFormStageOne()) isValid = false;

  // Stage 2 Validations
  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required'
    isValid = false
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required'
    isValid = false
  }
  if (!localFormData.institute) {
    errors.institute = 'Institute is required'
    isValid = false
  }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required'
    isValid = false
  }

  // Document validation
  let documentsValid = true;
  supportingDocuments.value.forEach((doc, index) => {
    if (!doc.type) {
      toast.error(`Please select a document type for document ${index + 1}.`)
      documentsValid = false;
    }
    if (doc.files.length === 0) {
      toast.error(`Please select file(s) to upload for document ${index + 1}.`)
      documentsValid = false;
    }
  });
  if (!documentsValid) isValid = false;


  if (!localFormData.declaration) {
    toast.error('Please accept the declaration.')
    isValid = false
  }

  return isValid
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const [day, month, year] = dateString.split('/')
  return `${year}-${month}-${day}`
}

const fetchDCRCData = async () => {
  if (props.selectedType !== 'cid' || !isCIDValid.value) {
    return
  }

  if (!userId) {
    toast.error('User ID is not available. Please ensure you are logged in.')
    return
  }

  isLoadingDCRC.value = true
  try {
    const response = await apiService.fetchCitizenDetails(localFormData.cid_no, {
      params: { user_id: userId },
    })

    const genderMap = {
      F: 'female',
      M: 'male',
      O: 'O',
    }

    Object.assign(localFormData, {
      full_name: response.data.applicants_name,
      date_of_birth: formatDateForInput(response.data.date_of_birth),
      gender: genderMap[response.data.gender] || '',
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village,
      contact_no: response.data.mobile_number || localFormData.contact_no,
    })

    toast.success('DCRC data fetched successfully')
  } catch (error) {
    console.error('Error fetching DCRC data:', error)
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Failed to fetch DCRC data. Please enter details manually.')
    }

    localFormData.full_name = ''
    localFormData.date_of_birth = ''
    localFormData.gender = ''
    localFormData.dzongkhag = ''
    localFormData.gewog = ''
    localFormData.village = ''
    localFormData.contact_no = ''
  } finally {
    isLoadingDCRC.value = false
  }
}

const handlePassportPhotoSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.size <= 2 * 1024 * 1024) {
    localFormData.passport_photo = file
    errors.passport_photo = null
  } else {
    localFormData.passport_photo = null
    errors.passport_photo = 'File size should not exceed 2MB'
  }
}

const formatDateForAPI = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleNext = async () => {
  if (validateFormStageOne()) {
    const formDataStageOne = { ...localFormData }

    if (props.selectedType !== 'cid') {
      formDataStageOne.cid_no = formDataStageOne.workPermitNo
      formDataStageOne.village = formDataStageOne.city
      formDataStageOne.gewog = formDataStageOne.state
      formDataStageOne.dzongkhag = formDataStageOne.country

      delete formDataStageOne.city
      delete formDataStageOne.state
      delete formDataStageOne.country
      delete formDataStageOne.workPermitNo
    }

    // Remove fields not needed for the first API call
    delete formDataStageOne.documents
    delete formDataStageOne.remarks
    delete formDataStageOne.declaration
    delete formDataStageOne.payment_status
    delete formDataStageOne.payment_id
    delete formDataStageOne.qualification_type
    delete formDataStageOne.qualification_name
    delete formDataStageOne.institute
    delete formDataStageOne.year_of_completion
    delete formDataStageOne.is_active
    delete formDataStageOne.application
    // Keep registration_type

    const today = new Date()
    const expiry = new Date(today)
    expiry.setFullYear(today.getFullYear() + 5)

    formDataStageOne.registration_date = formatDateForAPI(today)
    formDataStageOne.expiry_date = formatDateForAPI(expiry)

    const apiFormData = new FormData()
    for (const key in formDataStageOne) {
      if (Object.prototype.hasOwnProperty.call(formDataStageOne, key)) {
        // Skip the original registration_type; we'll add its ID below
        if (key === 'registration_type') {
          continue;
        }
        if (key === 'passport_photo' && formDataStageOne[key] instanceof File) {
          apiFormData.append('passport_photo', formDataStageOne[key])
        } else if (formDataStageOne[key] !== null && formDataStageOne[key] !== undefined) {
          apiFormData.append(key, formDataStageOne[key])
        }
      }
    }

    // Add required fields with correct names
    apiFormData.append('applicant', user.id); // Assuming user.id holds the applicant's user ID
    apiFormData.append('registration_type', localFormData.registration_type); // Send the ID

    isSubmitting.value = true;
    try {
      const response = await apiService.createMhpcNewApplication(apiFormData)

      applicationId.value = response.data.id
      localFormData.application = response.data.id // Store the created application ID

      toast.success('Personal information saved!')
      stage.value = 2
    } catch (error) {
      console.error('Error submitting personal information:', error)
      if (error.response && error.response.data) {
        const errorMessages = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        toast.error(`Failed to save personal information: ${errorMessages}`);
      } else {
        toast.error('Failed to save personal information. An unknown error occurred.');
      }
    } finally {
      isSubmitting.value = false;
    }
  } else {
    toast.error("Please fix the errors in Step 1.")
  }
}


const openConfirmationModal = () => {
  if (validateForm()) { // Validate the *entire* form before showing confirmation
    isConfirmationModalOpen.value = true
  } else {
    toast.error("Please fix the errors in Step 2.")
  }
}

const handleSubmitActual = async () => {
  isConfirmationModalOpen.value = false
  if (!validateForm()) { // Double-check validation
    toast.error("Submission cancelled due to validation errors.")
    return;
  }

  isSubmitting.value = true

  try {
    const formData = new FormData();

    // --- Fields for UserQualification model ---
    formData.append('application', localFormData.application); // Ensure this has the ID from stage 1
    formData.append('qualification_name', localFormData.qualification_name);
    formData.append('qualification_type', localFormData.qualification_type);
    formData.append('institute_university', localFormData.institute);

    // Safely get year from 'YYYY-MM' format
    if (localFormData.year_of_completion && typeof localFormData.year_of_completion === 'string') {
      const year = localFormData.year_of_completion.split('-')[0];
      if (year && !isNaN(parseInt(year))) {
        formData.append('completion_year', year);
      } else {
        console.warn("Invalid year_of_completion format, cannot extract year:", localFormData.year_of_completion);
      }
    }

    formData.append('declaration', localFormData.declaration ? 'True' : 'False');
    formData.append('remarks', localFormData.remarks || '');
    formData.append('is_primary_qualification', 'True'); // Assuming this is the primary one for now

    // --- Handle Attachments ---
    updateFormDocuments(); // Ensure localFormData.documents is up-to-date
    localFormData.documents.forEach((doc, index) => {
      if (doc.files && doc.files.length > 0 && doc.type) {
        doc.files.forEach((file) => {
          // Use a consistent naming scheme expected by the backend
          formData.append(`attachments-${index}-file`, file, file.name); // Add filename
          formData.append(`attachments-${index}-document_type`, doc.type);
        });
      } else {
        console.warn(`Skipping document at index ${index} due to missing file or type.`);
      }
    });


    await apiService.createMhpcNewQualification(formData);

    toast.success('Registration submitted successfully!');
    emit('submit', localFormData); // Emit the final form data if needed
    router.push('/admin/user/health_certification/dashboard'); // Redirect

  } catch (error) {
    console.error('Error submitting qualification:', error);
    if (error.response && error.response.data) {
      const errorMessages = Object.entries(error.response.data)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      toast.error(`Qualification submission failed: ${errorMessages}`);
    } else {
      toast.error(`Qualification submission failed: ${error.message || 'Unknown error'}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
  /* Tailwind's red-500 */
}

/* Responsive text styles */
@media (max-width: 640px) {
  .text-sm {
    font-size: 0.8125rem;
    /* Slightly smaller than Tailwind's sm */
  }

  .text-xs {
    font-size: 0.75rem;
    /* Tailwind's xs */
  }
}

/* Remove body scrollbar styles that could conflict */
body {
  overflow-x: hidden;
}
</style>
