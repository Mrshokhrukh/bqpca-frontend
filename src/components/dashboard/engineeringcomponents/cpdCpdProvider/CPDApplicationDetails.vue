<template>
  <div class="mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <FormHeader />
    <LoadingOverlay :loading="loading" />

    <div class="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mt-6">
      <!-- Display Validation Errors -->
      <AlertMessage
        :messages="validationErrors"
        type="error"
        v-if="validationErrors.length > 0"
        class="mb-6"
      />
      <!-- Display Success Message -->
      <AlertMessage
        :messages="[successMessage]"
        type="success"
        v-if="successMessage"
        class="mb-6"
      />

      <!-- Applicant Details Section -->
      <FormSection title="Applicant Details" description="Verify your personal information.">
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700"
            >CID No./Identity/Work Permit No.</label
          >
          <input
            type="text"
            v-model="applicant.cidNumber"
            readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
          />
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            v-model="applicant.fullName"
            readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
          />
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700"
            >Agency/Training Location <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            v-model="applicant.agencyTrainingLocation"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>
      </FormSection>

      <!-- Application Details Section -->
      <FormSection
        title="Application Details"
        description="Provide information about your CPD application."
      >
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700"
            >Is CPD approved? <span class="text-red-500">*</span></label
          >
          <div class="mt-1 flex items-center">
            <div class="mr-4">
              <input
                type="radio"
                id="approvedYes"
                value="true"
                v-model="application.isApproved"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label for="approvedYes" class="ml-2 block text-sm text-gray-700">Yes</label>
            </div>
            <div>
              <input
                type="radio"
                id="approvedNo"
                value="false"
                v-model="application.isApproved"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label for="approvedNo" class="ml-2 block text-sm text-gray-700">No</label>
            </div>
          </div>
        </div>
        <div v-if="application.isApproved === 'true'" class="col-span-1">
          <label for="approvalLetter" class="block text-sm font-medium text-gray-700"
            >Attach Approval Letter <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            id="approvalLetter"
            @change="handleFileUpload($event, approvalLetter)"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
        </div>
        <template v-if="application.isApproved === 'false'">
          <div class="col-span-1">
            <label for="title" class="block text-sm font-medium text-gray-700"
              >Title of CPD <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="title"
              v-model="application.title"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-1">
            <label for="venue" class="block text-sm font-medium text-gray-700"
              >Venue <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="venue"
              v-model="application.venue"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-1">
            <label for="fromDate" class="block text-sm font-medium text-gray-700"
              >From Date <span class="text-red-500">*</span></label
            >
            <input
              type="date"
              id="fromDate"
              v-model="application.fromDate"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-1">
            <label for="toDate" class="block text-sm font-medium text-gray-700"
              >To Date <span class="text-red-500">*</span></label
            >
            <input
              type="date"
              id="toDate"
              v-model="application.toDate"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </template>
      </FormSection>

      <!-- CPD Providers Details Section -->
      <FormSection
        title="CPD Providers Details (Host)"
        description="Information about the CPD provider."
      >
        <div class="col-span-1">
          <label for="providingAgency" class="block text-sm font-medium text-gray-700"
            >CPD Providing Agency <span class="text-red-500">*</span></label
          >
          <select
            id="providingAgency"
            v-model.number="cpdProvider.agency"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">Select Agency</option>
            <option v-for="agency in agencyOptions" :key="agency.value" :value="agency.value">
              {{ agency.text }} (ID: {{ agency.value }})
            </option>
            <option value="other">Other</option>
          </select>
          <p v-if="agencyOptions.length === 0" class="mt-1 text-sm text-red-600">
            No agencies found. Please try refreshing the page.
          </p>
        </div>
        <div v-if="cpdProvider.agency === 'other'" class="col-span-1">
          <label for="otherAgency" class="block text-sm font-medium text-gray-700"
            >Specify Other Agency <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="otherAgency"
            v-model="cpdProvider.otherAgency"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>
        <div class="col-span-1">
          <label for="reasonConducting" class="block text-sm font-medium text-gray-700"
            >Reason for Conducting <span class="text-red-500">*</span></label
          >
          <select
            id="reasonConducting"
            v-model.number="cpdProvider.reason"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">Select Reason</option>
            <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">
              {{ reason.text }}
            </option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="reasonDetails" class="block text-sm font-medium text-gray-700"
            >Reason Details <span class="text-red-500">*</span></label
          >
          <textarea
            id="reasonDetails"
            v-model="cpdProvider.reasonDetails"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"
          ></textarea>
        </div>
      </FormSection>

      <!-- Resource Persons Details Section -->
      <FormSection
        title="Resource Persons Details"
        description="Details about the resource persons."
      >
        <div class="col-span-2">
          <div
            v-for="(person, personIndex) in resourcePersons"
            :key="personIndex"
            class="mb-6 p-4 border rounded-lg"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Registration Number <span class="text-red-500">*</span></label
                >
                <select
                  v-model="person.regNo"
                  @change="fetchResourcePersonDetails(person)"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  <option value="">Select Registration Number</option>
                  <option
                    v-for="reg in userRegistrations"
                    :key="reg.registration_no"
                    :value="reg.registration_no"
                  >
                    {{ reg.registration_no }} - {{ reg.full_name }}
                  </option>
                </select>
                <p v-if="userRegistrations.length === 0" class="mt-1 text-sm text-red-600">
                  No users found. Please ensure there are registered users in the system.
                </p>
              </div>
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  v-model="person.name"
                  readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
                />
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                v-if="personIndex > 0"
                @click="removeResourcePerson(personIndex)"
                class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
          <div class="flex justify-start mb-6">
            <button
              @click="addResourcePerson"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Resource Person
            </button>
          </div>
          <div class="col-span-1">
            <label for="certificates" class="block text-sm font-medium text-gray-700"
              >Document supporting expertise of CPD <span class="text-red-500">*</span></label
            >
            <input
              type="file"
              id="certificates"
              @change="handleFileUpload($event, resourcePersonCertificate)"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
          </div>
        </div>
      </FormSection>

      <!-- Teaching Learning Method Section -->
      <FormSection
        title="Teaching Learning Method"
        description="Details about the teaching and learning method."
      >
        <div class="col-span-1">
          <label for="typeCPD" class="block text-sm font-medium text-gray-700"
            >Type of CPD <span class="text-red-500">*</span></label
          >
          <select
            id="typeCPD"
            v-model.number="teachingMethod.type"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">Select Type</option>
            <option v-for="type in cpdTypeOptions" :key="type.value" :value="type.value">
              {{ type.text }}
            </option>
          </select>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700"
            >Methodologies <span class="text-red-500">*</span></label
          >
          <div class="mt-2">
            <div
              v-for="method in methodologyOptions"
              :key="method.value"
              class="flex items-center mb-2"
            >
              <input
                type="checkbox"
                :id="'method-' + method.value"
                v-model="selectedMethodologies"
                :value="method.value"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="'method-' + method.value" class="ml-2 block text-sm text-gray-700">{{
                method.text
              }}</label>
            </div>
          </div>
        </div>
        <div class="col-span-1">
          <label for="expectedOutcome" class="block text-sm font-medium text-gray-700"
            >Objective/Expected Outcome <span class="text-red-500">*</span></label
          >
          <textarea
            id="expectedOutcome"
            v-model="teachingMethod.expectedOutcome"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"
          ></textarea>
        </div>
        <div class="col-span-2">
          <h4 class="text-md font-medium mb-2">Learning Activities and Duration</h4>
          <div v-for="(method, index) in teachingMethods" :key="index" class="flex space-x-4 mb-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700"
                >Activity <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="method.activity"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700"
                >Duration in Hours <span class="text-red-500">*</span></label
              >
              <input
                type="number"
                v-model.number="method.duration"
                @input="calculateTotalHours"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              />
            </div>
            <button
              @click="removeTeachingMethod(index)"
              class="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Remove
            </button>
          </div>
          <button
            @click="teachingMethods.push({ activity: '', duration: null })"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add New Row
          </button>
          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="font-medium">Total Hours: {{ totalHours }}</p>
            <p>Calculated CPD Credits: {{ calculatedCredits }}</p>
          </div>
        </div>
        <div class="col-span-1">
          <label for="courseDocument" class="block text-sm font-medium text-gray-700">
            Resource Materials/Presentations (Please upload the documents within the permissible
            file size limit and email any remaining files to cpd@bqpca.gov.bt)
            <span class="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="courseDocument"
            @change="handleFileUpload($event, courseDocument)"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
        </div>
      </FormSection>

      <!-- Participants Details Section -->
      <FormSection title="Participants Details" description="Details about the participants.">
        <div class="col-span-1">
          <label for="participationCategory" class="block text-sm font-medium text-gray-700"
            >Participation Category <span class="text-red-500">*</span></label
          >
          <select
            id="participationCategory"
            v-model.number="participantDetails.category"
            @change="loadSubcategories"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">Select Category</option>
            <option
              v-for="category in participationCategoryOptions"
              :key="category.value"
              :value="category.value"
            >
              {{ category.text }}
            </option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="participantSubcategory" class="block text-sm font-medium text-gray-700"
            >Participant sub-category <span class="text-red-500">*</span></label
          >
          <select
            id="participantSubcategory"
            v-model.number="participantDetails.subcategory"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">Select Sub-Category</option>
            <option
              v-for="subcategory in filteredSubcategories"
              :key="subcategory.value"
              :value="subcategory.value"
            >
              {{ subcategory.text }}
            </option>
          </select>
        </div>
        <div class="col-span-1">
          <label for="numberParticipants" class="block text-sm font-medium text-gray-700"
            >Number of Participants <span class="text-red-500">*</span></label
          >
          <input
            type="number"
            id="numberParticipants"
            v-model.number="participantDetails.number"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>
        <div class="col-span-1">
          <label for="relevanceProfession" class="block text-sm font-medium text-gray-700"
            >Relevance to profession <span class="text-red-500">*</span></label
          >
          <textarea
            id="relevanceProfession"
            v-model="participantDetails.relevance"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"
          ></textarea>
        </div>
      </FormSection>

      <!-- Approved CPD Section -->
      <FormSection
        v-if="isCpdApproved"
        title="Add Participants (After Approval)"
        description="Add participants after CPD approval."
      >
        <div class="col-span-2">
          <div
            v-for="(participant, index) in participants"
            :key="index"
            class="mb-6 p-4 border rounded-xl"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">RegNo</label>
                <input
                  type="text"
                  v-model="participant.regNo"
                  @blur="fetchParticipantName(participant)"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  v-model="participant.name"
                  readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
                />
              </div>
            </div>
            <div class="mt-2 flex justify-end">
              <button
                @click="removeParticipant(index)"
                class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
          <button
            @click="addParticipant"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add More
          </button>
          <div class="mt-6">
            <label for="attendanceSheet" class="block text-sm font-medium text-gray-700"
              >Attendance Sheet <span class="text-red-500">*</span></label
            >
            <input
              type="file"
              id="attendanceSheet"
              @change="handleFileUpload($event, attendanceSheet)"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
          </div>
          <div class="mt-6">
            <label for="attachment" class="block text-sm font-medium text-gray-700"
              >Attachment <span class="text-red-500">*</span></label
            >
            <input
              type="file"
              id="attachment"
              @change="handleFileUpload($event, attachment)"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
          </div>
        </div>
      </FormSection>

      <!-- Form Actions -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button
          @click="saveDraft"
          :disabled="loading"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save as Draft
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
        <button
          @click="cancelForm"
          :disabled="loading"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show-confirmation="showConfirmation"
      :loading="loading"
      :confirm-submit="confirmSubmit"
      @update:showConfirmation="showConfirmation = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

// Import utility components
import FormHeader from './cpdProviderApplicationComponents/FormHeader.vue'
import LoadingOverlay from './cpdProviderApplicationComponents/LoadingOverlay.vue'
import AlertMessage from './cpdProviderApplicationComponents/AlertMessage.vue'
import ConfirmationModal from './cpdProviderApplicationComponents/ConfirmationModal.vue'
import FormSection from './cpdProviderApplicationComponents/FormSection.vue'

const authStore = useAuthStore()
const toast = useToast()

// --- Reactive States ---
const loading = ref(false)
const showConfirmation = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const userRegistrations = ref([])

// --- Form Data Sections ---
const applicant = reactive({
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  agencyTrainingLocation: '',
})
const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
})
const cpdProvider = reactive({ agency: '', otherAgency: '', reason: '', reasonDetails: '' })
const resourcePersons = ref([{ regNo: '', name: '' }])
const resourcePersonCertificate = ref(null)
const teachingMethod = reactive({ type: '', expectedOutcome: '' })
const selectedMethodologies = ref([])
const teachingMethods = ref([{ activity: '', duration: null }])
const totalHours = ref(0)
const calculatedCredits = ref(0)
const courseDocument = ref(null)
const participantDetails = reactive({ category: '', subcategory: '', number: null, relevance: '' })
const participants = ref([])
const isCpdApproved = ref(false)
const approvalLetter = ref(null)
const attendanceSheet = ref(null)
const attachment = ref(null)

// --- Options for Dropdowns ---
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([])

// --- Computed Property for Filtered Subcategories ---
const filteredSubcategories = computed(() => {
  if (!participantDetails.category) return []
  const selectedParentCategoryId = parseInt(participantDetails.category, 10)
  if (isNaN(selectedParentCategoryId)) return []
  return participantSubcategoryOptions.value.filter((subcategory) => {
    const subcategoryParentId = parseInt(subcategory.categoryId, 10)
    return subcategoryParentId === selectedParentCategoryId
  })
})

// --- Methods ---
const toggleApprovedFields = () => {
  const approved = application.isApproved === 'true'
  isCpdApproved.value = approved
  if (approved) {
    application.title = ''
    application.venue = ''
    application.fromDate = ''
    application.toDate = ''
    courseDocument.value = null
  } else {
    participants.value = []
    approvalLetter.value = null
    attendanceSheet.value = null
    attachment.value = null
  }
}

const handleFileUpload = (event, targetRef, maxSizeMB = 5, allowedType = 'application/pdf') => {
  const file = event.target.files[0]
  const maxSize = maxSizeMB * 1024 * 1024
  if (file) {
    if (file.type === allowedType && file.size <= maxSize) {
      targetRef.value = file
    } else {
      toast.error(`Invalid file. Please upload a PDF no larger than ${maxSizeMB}MB.`)
      targetRef.value = null
      event.target.value = ''
    }
  } else {
    targetRef.value = null
  }
}

const fetchDetailsByRegNo = (item) => {
  if (!item.regNo) {
    item.name = ''
    return
  }
  const foundUser = userRegistrations.value.find((u) => u.registration_no === item.regNo)
  if (foundUser) {
    item.name = foundUser.full_name
  } else {
    item.name = 'Reg# not found'
    toast.warning(`Name for Reg# ${item.regNo} not found. Please verify the number.`, {
      timeout: 5000,
    })
  }
}

const fetchResourcePersonDetails = (person) => fetchDetailsByRegNo(person)
const fetchParticipantName = (participant) => fetchDetailsByRegNo(participant)

const addResourcePerson = () => resourcePersons.value.push({ regNo: '', name: '' })
const removeResourcePerson = (index) => {
  if (resourcePersons.value.length > 1) {
    resourcePersons.value.splice(index, 1)
  } else {
    toast.info('At least one resource person is usually required.')
    resourcePersons.value[0] = { regNo: '', name: '' }
  }
}

const removeTeachingMethod = (index) => {
  if (teachingMethods.value.length > 1) {
    teachingMethods.value.splice(index, 1)
  } else {
    toast.info('At least one teaching method/activity is required.')
    teachingMethods.value[0] = { activity: '', duration: null }
  }
  calculateTotalHours()
}

const addParticipant = () => participants.value.push({ regNo: '', name: '' })
const removeParticipant = (index) => participants.value.splice(index, 1)

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    const duration = Number(method.duration)
    return sum + (isNaN(duration) || duration < 0 ? 0 : duration)
  }, 0)
  calculatedCredits.value = totalHours.value
}

const loadSubcategories = () => {
  participantDetails.subcategory = ''
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  loading.value = true
  validationErrors.value = []
  successMessage.value = ''

  applicant.cidNumber = authStore.user?.cid || ''
  applicant.fullName =
    [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name]
      .filter(Boolean)
      .join(' ') || 'N/A'
  applicant.registrationNumber = authStore.user?.registration_number || ''
  if (!applicant.registrationNumber) {
    console.warn('Registration number missing from auth store.')
  }

  await Promise.all([fetchUserRegistrations(), loadDropdownOptions()])

  isCpdApproved.value = application.isApproved === 'true'
  calculateTotalHours()

  loading.value = false
  console.log('Component mounted and initial data loaded.')
})

// --- Watchers ---
watch(
  () => application.isApproved,
  () => {
    console.log('Watcher: application.isApproved changed to', application.isApproved)
    toggleApprovedFields()
  }
)

watch(
  () => participantDetails.category,
  (newCategory) => {
    console.log('Watcher: participantDetails.category changed to', newCategory)
    participantDetails.subcategory = ''
  }
)

watch(
  teachingMethods,
  () => {
    calculateTotalHours()
  },
  { deep: true }
)

// --- Stubbed Methods ---
async function fetchUserRegistrations() {
  // TODO: Implement actual API call
  userRegistrations.value = []
}
async function loadDropdownOptions() {
  // TODO: Implement actual API call
  agencyOptions.value = []
  reasonOptions.value = []
  cpdTypeOptions.value = []
  methodologyOptions.value = []
  participationCategoryOptions.value = []
  participantSubcategoryOptions.value = []
}
</script>
