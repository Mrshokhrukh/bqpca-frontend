<template>
  <div class="mx-auto px-4 py-8 h-full flex flex-col">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Additional Qualification</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Add an additional qualification to your existing registration. All information provided will be reviewed and
        verified.
      </p>
    </div>

    <!-- Confirmation Modal -->
    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-50" @close="isConfirmationModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
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
                        Are you sure you want to submit this additional qualification? Please review all
                        information before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    :disabled="isSubmitting" @click="handleSubmitActual">
                    {{ isSubmitting ? 'Submitting...' : 'Submit Additional Qualification' }}
                  </button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    :disabled="isSubmitting" @click="isConfirmationModalOpen = false">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm p-6 flex-1 overflow-y-auto">
      <!-- Step Header -->
      <h3 class="text-lg font-semibold text-gray-900 my-4">Additional Qualification Registration</h3>

      <!-- Application Selection -->
      <div class="mb-6">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Primary Application</h3>
          <div class="bg-white p-4 rounded-lg border border-gray-100">
            <label for="application" class="block text-sm font-medium text-gray-700 mb-2">
              Primary Registration:
            </label>
            <input type="text" id="application"
              class="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 py-2 px-3 text-sm" :value="applications.length >= 1
                  ? `${applications[0].registration_no} - ${applications[0].full_name}`
                  : 'Loading or No Application Found...'
                " readonly disabled />
            <p class="text-xs text-gray-500 mt-1">
              This additional qualification will be linked to your primary registration above.
            </p>
          </div>
          <span v-if="errors.application" class="text-sm text-red-500 mt-1 block">{{
            errors.application
          }}</span>
        </div>
      </div>

      <!-- Qualification Details Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

            <!-- Qualification Type -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
              <select v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                @change="onQualificationTypeChange">
                <option value="">Select Qualification Type</option>
                <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                  {{ type.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-sm text-red-500 mt-1">{{
                errors.qualification_type
              }}</span>
            </div>

            <!-- Qualification Name -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
              <select v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                :disabled="!localFormData.qualification_type">
                <option value="">Select Qualification Name</option>
                <option v-for="qualification in filteredQualifications" :key="qualification.id"
                  :value="qualification.id">
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <!-- Institute/University -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
              <select v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm">
                <option value="">Select Institute/University</option>
                <option v-for="university in universities" :key="university.id" :value="university.id">
                  {{ getUniversityDisplayText(university) }}
                </option>
              </select>
              <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <!-- Year of Completion -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Year of Completion</label>
              <input type="month" v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="YYYY-MM" />
              <span class="text-xs text-gray-500">Select month and year</span>
              <span v-if="errors.year_of_completion" class="text-sm text-red-500 mt-1">{{
                errors.year_of_completion
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Supporting Documents (Max 2MB each) - All Required
            </h3>
            <!-- Progress indicator -->
            <div class="text-sm font-medium">
              <span :class="[
                'px-3 py-1 rounded-full text-xs',
                getDocumentValidationSummary().totalUploaded === getDocumentValidationSummary().totalRequired
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              ]">
                {{ getDocumentValidationSummary().totalUploaded }} / {{ getDocumentValidationSummary().totalRequired }}
                Complete
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-4">
            All document types listed below are <strong>mandatory</strong>. Please upload all required documents to
            proceed with your additional qualification application.
          </p>

          <!-- Show missing documents summary if any -->
          <div v-if="getDocumentValidationSummary().missing.length > 0"
            class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-orange-700">
                  <strong>Missing Documents:</strong> {{ getDocumentValidationSummary().missing.join(', ') }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="(doc, index) in supportingDocuments" :key="index" :class="[
              'flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 rounded-lg border',
              doc.files && doc.files.length > 0
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-100'
            ]">
              <div class="w-full sm:w-1/3">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Document Type<span class="text-red-500">*</span>
                </label>
                <!-- Document type is pre-populated and read-only -->
                <div class="flex items-center">
                  <input type="text" :value="getDocumentTypeName(doc.type)"
                    class="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 py-1 px-2 text-sm cursor-not-allowed"
                    readonly disabled />
                  <!-- Success indicator for uploaded documents -->
                  <div v-if="doc.files && doc.files.length > 0" class="ml-2">
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex-1 w-full">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Upload File<span class="text-red-500">*</span>
                </label>
                <input type="file" @change="(e) => handleFileSelect(e, index)"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />

                <!-- Display selected file names with success styling -->
                <div v-if="doc.files && doc.files.length > 0" class="text-xs text-green-700 mt-1 font-medium">
                  ✓ Selected: {{doc.files.map((f) => f.name).join(', ')}}
                </div>

                <!-- Show validation error for this specific document -->
                <div v-if="doc.error" class="text-xs text-red-500 mt-1">
                  {{ doc.error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Overall document validation error -->
          <div v-if="errors.documents" class="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errors.documents }}</p>
              </div>
            </div>
          </div>

          <!-- Success message when all documents are uploaded -->
          <div
            v-if="getDocumentValidationSummary().totalUploaded === getDocumentValidationSummary().totalRequired && getDocumentValidationSummary().totalRequired > 0"
            class="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700">
                  <strong>All required documents uploaded!</strong> You can now proceed with your application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Declaration Section -->
      <div class="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea v-model="localFormData.remarks" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              placeholder="Enter any additional remarks or comments (optional)"></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-100">
            <input id="declaration-checkbox" type="checkbox" v-model="localFormData.declaration"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="declaration-checkbox" class="text-sm text-gray-700">
              <span class="font-medium">
                I hereby declare that all the information provided above is true and correct to the
                best of my knowledge. I understand that any false statements may result in the
                rejection of my additional qualification application.</span>
              <span class="text-red-500">*</span>
            </label>
          </div>
          <span v-if="errors.declaration" class="text-sm text-red-500 mt-1">{{
            errors.declaration
          }}</span>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="mt-12 flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button type="button" @click="$emit('back')"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting">
          Back
        </button>
        <button type="submit" :class="[
          'px-6 py-3 rounded-lg transition-colors text-white font-medium min-w-[200px]',
          (!localFormData.declaration || getDocumentValidationSummary().totalUploaded !== getDocumentValidationSummary().totalRequired || isSubmitting)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        ]"
          :disabled="!localFormData.declaration || getDocumentValidationSummary().totalUploaded !== getDocumentValidationSummary().totalRequired || isSubmitting">
          <div class="flex items-center justify-center space-x-2">
            <!-- Loading spinner -->
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>

            <!-- Button text based on state -->
            <span v-if="isSubmitting">
              Submitting Additional Qualification...
            </span>
            <span
              v-else-if="getDocumentValidationSummary().totalUploaded !== getDocumentValidationSummary().totalRequired">
              Upload All Documents ({{ getDocumentValidationSummary().missing.length }} Missing)
            </span>
            <span v-else>
              Submit Additional Qualification
            </span>
          </div>
        </button>
      </div>

      <!-- Validation summary when documents are missing -->
      <div v-if="getDocumentValidationSummary().missing.length > 0 && !isSubmitting" class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Please upload <strong>{{ getDocumentValidationSummary().missing.length }}</strong>
          remaining document{{ getDocumentValidationSummary().missing.length > 1 ? 's' : '' }}
          to enable submission.
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps({
  selectedType: {
    type: String,
  },
  modelValue: {
    type: Object,
  },
})

const emit = defineEmits(['back', 'submit'])

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const applications = ref([])
const qualificationTypes = ref([])
const qualifications = ref([])
const universities = ref([])
const registrationTypes = ref([])
const errors = reactive({})
const fetchedDocumentTypes = ref([])
const isConfirmationModalOpen = ref(false)

// List of countries for country code to name conversion
const countries = ref([
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'East Timor', code: 'TL' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Ivory Coast', code: 'CI' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, North', code: 'KP' },
  { name: 'Korea, South', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia', code: 'FM' },
  { name: 'Moldova', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Sudan', code: 'SS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatican City', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }
])

// Form data with hidden registration_type field
const localFormData = reactive({
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: '',
  remarks: '',
  declaration: false,
  application: '',
  registration_type: '', // Hidden field that will be set to "Additional Certificate"
  is_primary_qualification: false, // This is additional, not primary
})

// Store documents separately for easier management (initialize as empty, will be populated from API)
const supportingDocuments = ref([])

// Computed properties
const filteredQualifications = computed(() => {
  if (!localFormData.qualification_type) {
    return []
  }
  return qualifications.value.filter(
    qual => qual.qualification_type === Number(localFormData.qualification_type)
  )
})

// Helper function to get country name from code
const getCountryName = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country ? country.name : countryCode || 'Unknown'
}

// Helper function to display university with country name instead of code
const getUniversityDisplayText = (university) => {
  const countryName = getCountryName(university.country)
  return `${university.institute_name} (${university.university}, ${countryName})`
}

// Helper function to get document type name
const getDocumentTypeName = (typeId) => {
  const docType = fetchedDocumentTypes.value.find(type => type.id === typeId)
  return docType ? docType.document_name : 'Unknown Document Type'
}

// Document validation summary
const getDocumentValidationSummary = () => {
  const missingDocs = supportingDocuments.value
    .filter(doc => !doc.files || doc.files.length === 0)
    .map(doc => getDocumentTypeName(doc.type))

  const uploadedDocs = supportingDocuments.value
    .filter(doc => doc.files && doc.files.length > 0)
    .map(doc => getDocumentTypeName(doc.type))

  return {
    missing: missingDocs,
    uploaded: uploadedDocs,
    totalRequired: fetchedDocumentTypes.value.length,
    totalUploaded: uploadedDocs.length
  }
}

// Initialize supporting documents based on fetched document types
const initializeSupportingDocuments = () => {
  if (fetchedDocumentTypes.value.length > 0) {
    supportingDocuments.value = fetchedDocumentTypes.value.map(docType => ({
      type: docType.id,
      files: [],
      error: null
    }))
    console.log('Initialized supporting documents with all types:', supportingDocuments.value)
  }
}

// Fetch user's primary application
const fetchApplications = async () => {
  delete errors.application
  try {
    const cid = authStore.user?.cid
    if (!cid) {
      toast.error('User CID not found. Please log in again.')
      errors.application = 'User information is missing.'
      return
    }

    const response = await apiService.getApplicationWithCid(cid)

    if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else {
      console.error('Unexpected API response structure:', response.data)
      applications.value = []
      errors.application = 'Failed to parse application data.'
      toast.error('Could not retrieve application information.')
      return
    }

    console.log('Fetched applications (results array):', applications.value)

    if (applications.value.length === 1) {
      localFormData.application = applications.value[0].id
      console.log('Assigned application ID:', localFormData.application)
    } else if (applications.value.length > 1) {
      localFormData.application = applications.value[0].id
      console.warn('Multiple applications found, using the first one:', applications.value[0])
      toast.info('Multiple applications found. Using the primary one.')
    } else {
      errors.application = 'No existing application found for this user.'
      console.log('No applications found in the results array.')
      toast.error(
        'No existing primary application found. Please complete primary registration first.',
      )
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch your application details.')
    console.error('Error fetching applications:', error)
    errors.application = 'Failed to fetch application details.'
    applications.value = []
  }
}

// Handle qualification type change to filter qualifications
const onQualificationTypeChange = () => {
  localFormData.qualification_name = '' // Reset qualification name when type changes
}

// Handle file selection for documents
const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)

  // Clear previous errors
  supportingDocuments.value[index].error = null
  delete errors.documents

  if (files.length === 0) {
    supportingDocuments.value[index].files = []
    return
  }

  const file = files[0]

  if (file.size > 2 * 1024 * 1024) {
    const errorMsg = `File "${file.name}" exceeds the 2MB size limit.`
    supportingDocuments.value[index].error = errorMsg
    event.target.value = ''
    supportingDocuments.value[index].files = []
    toast.error(errorMsg)
    return
  }

  supportingDocuments.value[index].files = [file]
}

// Helper to format date as YYYY-MM-DD
const formatDateForAPI = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Form validation
const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  // Clear individual document errors first
  supportingDocuments.value.forEach(doc => {
    doc.error = null
  })

  if (!localFormData.application) {
    errors.application = 'Application information is missing or could not be loaded.'
    isValid = false
  }

  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required.'
    isValid = false
  }

  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required.'
    isValid = false
  }

  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required.'
    isValid = false
  }

  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required.'
    isValid = false
  } else {
    const today = new Date()
    const completionDateParts = localFormData.year_of_completion.split('-')
    const completionDate = new Date(
      parseInt(completionDateParts[0], 10),
      parseInt(completionDateParts[1], 10) - 1,
      1,
    )
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    if (completionDate > startOfToday) {
      errors.year_of_completion = 'Completion date cannot be in the future.'
      isValid = false
    }
  }

  // Document validation
  const missingDocuments = []

  supportingDocuments.value.forEach((doc, index) => {
    if (!doc.files || doc.files.length === 0) {
      const docTypeName = getDocumentTypeName(doc.type)
      doc.error = `${docTypeName} is required`
      missingDocuments.push(docTypeName)
      isValid = false
    }
  })

  if (missingDocuments.length > 0) {
    errors.documents = `Missing required documents: ${missingDocuments.join(', ')}`
  }

  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration.'
    isValid = false
  }

  if (!isValid) {
    toast.error('Please review the form and correct the indicated errors.')
  }

  return isValid
}

// Handle form submission attempt -> Show confirmation modal
const handleSubmit = (event) => {
  event.preventDefault()
  if (validateForm()) {
    isConfirmationModalOpen.value = true
  }
}

// Actual submission logic after confirmation
const handleSubmitActual = async () => {
  if (isSubmitting.value) return

  isConfirmationModalOpen.value = false
  isSubmitting.value = true

  try {
    // Prepare FormData
    const formData = new FormData()

    // Extract year from YYYY-MM format
    const completionYear = localFormData.year_of_completion
      ? new Date(localFormData.year_of_completion + '-01').getFullYear()
      : null

    // Append standard fields
    formData.append('completion_year', String(completionYear))
    formData.append('declaration', localFormData.declaration ? 'True' : 'False')
    formData.append('remarks', localFormData.remarks || '')
    formData.append('registration_date', formatDateForAPI(new Date()))
    formData.append(
      'expiry_date',
      formatDateForAPI(new Date(new Date().setFullYear(new Date().getFullYear() + 5))),
    )
    formData.append('payment_id', '')
    formData.append('is_active', 'False')
    formData.append('is_primary_qualification', 'False') // This is additional qualification
    formData.append('application', String(localFormData.application))
    formData.append('qualification_name', String(localFormData.qualification_name))
    formData.append('qualification_type', String(localFormData.qualification_type))
    formData.append('institute_university', String(localFormData.institute))
    
    // Add the hidden registration_type for "Additional Certificate"
    formData.append('registration_type', String(localFormData.registration_type))

    // Append file attachments
    supportingDocuments.value.forEach((doc, index) => {
      if (doc.type && doc.files && doc.files.length > 0) {
        formData.append(`attachments-${index}-file_type`, String(doc.type))
        doc.files.forEach((file) => {
          formData.append(`attachments-${index}-file`, file, file.name)
        })
      }
    })

    console.log('Submitting Additional Qualification FormData:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    const response = await apiService.createEpcNewQualification(formData)

    if (response.status === 201 || response.status === 200) {
      toast.success('Additional Qualification submitted successfully!')
      emit('submit', response.data)
      router.push('/admin/user/engineering_certification/my_applications')
    } else {
      console.warn('Submission response status:', response.status, response.data)
      toast.warning(`Submission completed with status: ${response.status}`)
      router.push('/admin/user/engineering_certification/my_applications')
    }
  } catch (error) {
    console.error('Error submitting additional qualification:', error)
    
    if (error.response && error.response.data) {
      const responseData = error.response.data
      let errorMessage = 'Submission failed. '
      
      if (typeof responseData === 'object') {
        Object.keys(responseData).forEach((field) => {
          if (Array.isArray(responseData[field])) {
            errors[field] = responseData[field].join(', ')
            errorMessage += `${field}: ${errors[field]} `
          } else {
            errorMessage += `${field}: ${responseData[field]} `
          }
        })
        
        if (Object.keys(errors).length > 0) {
          toast.error('Please correct the errors highlighted by the server.')
        } else {
          toast.error(errorMessage || 'An unknown server error occurred.')
        }
      } else {
        toast.error(
          `Submission failed: ${responseData.message || responseData.detail || 'Unknown server error'}`,
        )
      }
    } else {
      toast.error(`Submission failed: ${error.message || 'Network error'}`)
    }
  } finally {
    isSubmitting.value = false
  }
}

// Fetch master data on component mount
onMounted(async () => {
  // Fetch primary application first
  await fetchApplications()

  try {
    // Fetch all master data concurrently
    const [
      qualificationTypesResponse,
      qualificationsResponse,
      universitiesResponse,
      documentTypesResponse,
      registrationTypesResponse,
    ] = await Promise.all([
      apiService.getEpcMastersQualificationTypes(),
      apiService.getEpcMastersQualifications(),
      apiService.getEpcMastersUniversities(),
      apiService.getEpcMastersDocumentTypes(),
      apiService.getEpcMastersRegistrationTypes(),
    ])

    // Assign results
    qualificationTypes.value = qualificationTypesResponse.data?.results || []
    qualifications.value = qualificationsResponse.data?.results || []
    universities.value = universitiesResponse.data?.results || []
    fetchedDocumentTypes.value = documentTypesResponse.data?.results || []
    registrationTypes.value = registrationTypesResponse.data?.results || []

    // Find and set the "Additional Certificate" registration type
    const additionalCertificateType = registrationTypes.value.find(
      type => type.name.toLowerCase().includes('additional') || 
              type.name.toLowerCase().includes('certificate')
    )
    
    if (additionalCertificateType) {
      localFormData.registration_type = additionalCertificateType.id
      console.log('Set registration_type to Additional Certificate:', additionalCertificateType)
    } else {
      console.warn('Additional Certificate registration type not found')
      // Fallback - you might want to handle this case
      toast.warning('Additional Certificate registration type not found. Please contact support.')
    }

    // Initialize supporting documents with all required document types
    initializeSupportingDocuments()

    console.log('Master data fetched successfully.')
    console.log('Registration types:', registrationTypes.value)
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error('Failed to load necessary selection options. Please refresh or try again later.')
  }
})
</script>

<style scoped>
/* Required field indicator */
.required::after {
  content: ' *';
  color: #ef4444;
  /* Tailwind red-500 */
  margin-left: 2px;
}

/* Basic scrollbar styling for the form container if needed */
.overflow-y-auto {
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: #a0aec0 #e2e8f0;
  /* Firefox: thumb track */
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 4px;
  border: 2px solid #e2e8f0;
}
</style>
