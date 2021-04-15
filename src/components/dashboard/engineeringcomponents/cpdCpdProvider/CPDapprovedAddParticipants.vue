<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Add Engineering CPD Task Participant
      <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
    </h1>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div class="flex border-b border-gray-200">
        <button
          @click="activeTab = 'single'"
          :class="[
            'flex-1 py-3 font-medium text-center focus:outline-none transition-colors',
            activeTab === 'single'
              ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
          ]"
        >
          <UserIcon class="h-5 w-5 inline-block mr-2" />
          Single Entry
        </button>
        <button
          @click="activeTab = 'bulk'"
          :class="[
            'flex-1 py-3 font-medium text-center focus:outline-none transition-colors',
            activeTab === 'bulk'
              ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
          ]"
        >
          <UsersIcon class="h-5 w-5 inline-block mr-2" />
          Bulk Upload
        </button>
        <button
          @click="activeTab = 'photo'"
          :class="[
            'flex-1 py-3 font-medium text-center focus:outline-none transition-colors',
            activeTab === 'photo'
              ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
          ]"
        >
          <CameraIcon class="h-5 w-5 inline-block mr-2" />
          Attendance Photo
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
      <!-- Single Entry Tab -->
      <div v-if="activeTab === 'single'" class="space-y-6">
        <!-- Credits Section -->
        <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
          <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
            Credits Templates
          </h2>

          <div class="mb-6">
            <label for="cpdCreditsTemplate" class="block text-sm font-medium text-gray-700 mb-2">
              CPD Credits Template <span class="text-gray-500 text-xs italic">(Optional)</span>
            </label>
            <select
              id="cpdCreditsTemplate"
              v-model="formData.cpdCreditsTemplate"
              @change="applyCreditsTemplate"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              aria-label="CPD Credits Template Options"
            >
              <option value="">Select template (optional)</option>
              <option value="symposium">Symposium - 2 Credits</option>
              <option value="workshop">Workshop - 3 Credits</option>
              <option value="conference">Conference - 5 Credits</option>
            </select>
            <p class="mt-1 text-sm text-gray-500">
              Choose a template for pre-filled CPD credits or enter manually below
            </p>
          </div>

          <div>
            <label for="cpdCredits" class="block text-sm font-medium text-gray-700 mb-2">
              CPD Credits <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="cpdCredits"
              v-model.number="formData.cpdCredits"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              placeholder="Enter CPD credits"
              aria-required="true"
            />
            <div class="flex space-x-2 mb-1">
              <button
                v-for="credit in [1, 2, 3, 5]"
                :key="credit"
                @click="formData.cpdCredits = credit"
                class="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm font-medium"
              >
                {{ credit }}
              </button>
            </div>
            <p class="text-sm text-gray-500">Specify the CPD credits earned by the participant</p>
          </div>
        </div>

        <!-- Review & Endorsement Section -->
        <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
          <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
            Review & Endorsement
          </h2>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Review Column -->
            <div class="space-y-6">
              <div>
                <label for="reviewStatus" class="block text-sm font-medium text-gray-700 mb-2">
                  Review Status <span class="text-red-500">*</span>
                </label>
                <select
                  id="reviewStatus"
                  v-model="formData.reviewStatus"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                  aria-required="true"
                  aria-label="Review Status"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <p class="mt-1 text-sm text-gray-500">Current status of the review process</p>
              </div>

              <div>
                <label for="reviewRemarks" class="block text-sm font-medium text-gray-700 mb-2">
                  Review Remarks <span class="text-gray-500 text-xs italic">(Optional)</span>
                </label>
                <textarea
                  id="reviewRemarks"
                  v-model="formData.reviewRemarks"
                  rows="3"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                  placeholder="Add review remarks (if any)"
                  aria-label="Review Remarks"
                ></textarea>
                <p class="mt-1 text-sm text-gray-500">Any notes or comments from the reviewer</p>
              </div>
            </div>

            <!-- Endorsement Column -->
            <div class="space-y-6">
              <div>
                <label
                  for="endorsementDecision"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Endorsement Decision <span class="text-red-500">*</span>
                </label>
                <select
                  id="endorsementDecision"
                  v-model="formData.endorsementDecision"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                  aria-required="true"
                  aria-label="Endorsement Decision"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <p class="mt-1 text-sm text-gray-500">Final decision on endorsement</p>
              </div>

              <div>
                <label
                  for="endorsementRemarks"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Endorsement Remarks <span class="text-gray-500 text-xs italic">(Optional)</span>
                </label>
                <textarea
                  id="endorsementRemarks"
                  v-model="formData.endorsementRemarks"
                  rows="3"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                  placeholder="Add endorsement remarks (if any)"
                  aria-label="Endorsement Remarks"
                ></textarea>
                <p class="mt-1 text-sm text-gray-500">
                  Additional notes regarding the endorsement decision
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Task & Participant Section -->
        <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
          <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
            Task & Participant Selection
          </h2>

          <div class="space-y-6">
            <div>
              <label for="cpdTask" class="block text-sm font-medium text-gray-700 mb-2">
                CPD Task <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="cpdTask"
                  v-model="formData.cpdTask"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                  aria-required="true"
                  aria-label="CPD Task"
                >
                  <option value="">Select a CPD task</option>
                  <option v-for="task in cpdTasks" :key="task.id" :value="task.id">
                    {{ task.title }}
                  </option>
                </select>
                <MagnifyingGlassIcon
                  class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Select the CPD task this participant is associated with
              </p>
            </div>

            <div>
              <label for="participantRegNo" class="block text-sm font-medium text-gray-700 mb-2">
                Participant <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="participantRegNo"
                  v-model="formData.participantRegNo"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                  aria-required="true"
                  aria-label="Participant Registration Number"
                >
                  <option value="">Select a participant</option>
                  <option
                    v-for="participant in participants"
                    :key="participant.id"
                    :value="participant.reg_no"
                  >
                    {{ participant.full_name }} - {{ participant.reg_no }}
                  </option>
                </select>
                <MagnifyingGlassIcon
                  class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Choose the participant from the registered list
              </p>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="mt-8 flex justify-between items-center">
          <button
            @click="cancel"
            class="text-gray-600 hover:text-gray-800 hover:underline font-medium"
          >
            Cancel
          </button>
          <div class="flex space-x-4">
            <button
              @click="resetForm"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 font-medium"
            >
              Reset
            </button>
            <button
              @click="submitForm"
              class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center"
            >
              <CheckCircleIcon class="h-5 w-5 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Upload Tab -->
      <div v-if="activeTab === 'bulk'" class="space-y-6">
        <div class="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
          <h3 class="font-medium text-green-700 flex items-center mb-2">
            <InformationCircleIcon class="h-5 w-5 mr-2" />
            Bulk Upload Instructions
          </h3>
          <p class="text-sm text-green-600">
            Upload a CSV file with participant details. The file should include columns for:
            participant_reg_no, cpd_credits, review_status, and endorsement_decision.
          </p>
          <a href="#" class="text-sm text-green-700 underline mt-2 inline-block">
            Download CSV template
          </a>
        </div>

        <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
          <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
            Upload Participants CSV
          </h2>

          <div class="space-y-6">
            <div>
              <label for="bulkCpdTask" class="block text-sm font-medium text-gray-700 mb-2">
                CPD Task <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="bulkCpdTask"
                  v-model="bulkFormData.cpdTask"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                  aria-required="true"
                  aria-label="CPD Task"
                >
                  <option value="">Select a CPD task</option>
                  <option v-for="task in cpdTasks" :key="task.id" :value="task.id">
                    {{ task.title }}
                  </option>
                </select>
                <MagnifyingGlassIcon
                  class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Select the CPD task for all participants in this upload
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Participants CSV File <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
                :class="{ 'border-green-300 bg-green-50': csvFile }"
              >
                <div class="space-y-1 text-center">
                  <DocumentIcon
                    class="mx-auto h-12 w-12 text-gray-400"
                    :class="{ 'text-green-500': csvFile }"
                  />
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="csv-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span v-if="!csvFile">Upload a CSV file</span>
                      <span v-else>{{ csvFile.name }}</span>
                      <input
                        id="csv-upload"
                        name="csv-upload"
                        type="file"
                        class="sr-only"
                        accept=".csv"
                        @change="handleCSVUpload"
                      />
                    </label>
                    <p v-if="!csvFile" class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">CSV up to 10MB</p>
                </div>
              </div>
              <div v-if="csvFile" class="mt-2 flex justify-end">
                <button
                  @click="csvFile = null"
                  class="text-sm text-red-500 hover:text-red-700 flex items-center"
                >
                  <TrashIcon class="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Upload Actions -->
        <div class="mt-8 flex justify-between items-center">
          <button
            @click="cancel"
            class="text-gray-600 hover:text-gray-800 hover:underline font-medium"
          >
            Cancel
          </button>
          <div class="flex space-x-4">
            <button
              @click="resetBulkForm"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 font-medium"
            >
              Reset
            </button>
            <button
              @click="submitBulkForm"
              class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center"
              :disabled="!csvFile || !bulkFormData.cpdTask"
              :class="{ 'opacity-50 cursor-not-allowed': !csvFile || !bulkFormData.cpdTask }"
            >
              <CheckCircleIcon class="h-5 w-5 mr-2" />
              Upload Participants
            </button>
          </div>
        </div>
      </div>

      <!-- Attendance Photo Tab -->
      <div v-if="activeTab === 'photo'" class="space-y-6">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
          <h3 class="font-medium text-blue-700 flex items-center mb-2">
            <InformationCircleIcon class="h-5 w-5 mr-2" />
            Attendance Photo Upload
          </h3>
          <p class="text-sm text-blue-600">
            Upload photos as evidence of attendance for CPD task participants. You can upload a
            single photo that will be attached to the selected CPD task.
          </p>
        </div>

        <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
          <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
            Upload Attendance Photo
          </h2>

          <div class="space-y-6">
            <div>
              <label for="photoCpdTask" class="block text-sm font-medium text-gray-700 mb-2">
                CPD Task <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="photoCpdTask"
                  v-model="photoFormData.cpdTask"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                  aria-required="true"
                  aria-label="CPD Task"
                >
                  <option value="">Select a CPD task</option>
                  <option v-for="task in cpdTasks" :key="task.id" :value="task.id">
                    {{ task.title }}
                  </option>
                </select>
                <MagnifyingGlassIcon
                  class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">
                Select the CPD task this photo is associated with
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Attendance Photo <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
                :class="{ 'border-blue-300 bg-blue-50': photoFile }"
              >
                <div class="space-y-1 text-center">
                  <div v-if="photoPreview" class="mx-auto h-48 w-auto mb-3">
                    <img
                      :src="photoPreview"
                      alt="Attendance preview"
                      class="h-full mx-auto object-cover rounded-lg"
                    />
                  </div>
                  <CameraIcon
                    v-else
                    class="mx-auto h-12 w-12 text-gray-400"
                    :class="{ 'text-blue-500': photoFile }"
                  />
                  <div class="flex text-sm text-gray-600">
                    <label
                      for="photo-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span v-if="!photoFile">Upload attendance photo</span>
                      <span v-else>{{ photoFile.name }}</span>
                      <input
                        id="photo-upload"
                        name="photo-upload"
                        type="file"
                        class="sr-only"
                        accept="image/*"
                        @change="handlePhotoUpload"
                      />
                    </label>
                    <p v-if="!photoFile" class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <div v-if="photoFile" class="mt-2 flex justify-end">
                <button
                  @click="removePhoto"
                  class="text-sm text-red-500 hover:text-red-700 flex items-center"
                >
                  <TrashIcon class="h-4 w-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>

            <div>
              <label for="photoDescription" class="block text-sm font-medium text-gray-700 mb-2">
                Photo Description <span class="text-gray-500 text-xs italic">(Optional)</span>
              </label>
              <textarea
                id="photoDescription"
                v-model="photoFormData.description"
                rows="3"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                placeholder="Add a description for this photo (e.g., 'Group photo of Workshop participants, March 12, 2025')"
                aria-label="Photo Description"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">
                Provide context or details about this attendance photo
              </p>
            </div>
          </div>
        </div>

        <!-- Photo Upload Actions -->
        <div class="mt-8 flex justify-between items-center">
          <button
            @click="cancel"
            class="text-gray-600 hover:text-gray-800 hover:underline font-medium"
          >
            Cancel
          </button>
          <div class="flex space-x-4">
            <button
              @click="resetPhotoForm"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 font-medium"
            >
              Reset
            </button>
            <button
              @click="submitPhotoForm"
              class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center"
              :disabled="!photoFile || !photoFormData.cpdTask"
              :class="{ 'opacity-50 cursor-not-allowed': !photoFile || !photoFormData.cpdTask }"
            >
              <CheckCircleIcon class="h-5 w-5 mr-2" />
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      <!-- Status Messages -->
      <transition name="fade">
        <div
          v-if="message"
          :class="[
            'mt-6 p-4 rounded-lg flex items-center',
            messageType === 'success'
              ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
              : 'bg-red-50 text-red-700 border-l-4 border-red-500',
          ]"
        >
          <component
            :is="messageType === 'success' ? CheckCircleIcon : ExclamationCircleIcon"
            class="h-5 w-5 mr-3"
          />
          {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon,
  CameraIcon,
  DocumentIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const cpdTasks = ref([])
const participants = ref([])
const message = ref('')
const messageType = ref('')
const activeTab = ref('single') // 'single', 'bulk', or 'photo'
const csvFile = ref(null)
const photoFile = ref(null)
const photoPreview = ref('')

const formData = reactive({
  cpdCreditsTemplate: '',
  cpdCredits: 0,
  reviewStatus: 'pending',
  reviewRemarks: '',
  endorsementDecision: 'pending',
  endorsementRemarks: '',
  cpdTask: '',
  participantRegNo: '',
})

const bulkFormData = reactive({
  cpdTask: '',
})

const photoFormData = reactive({
  cpdTask: '',
  description: '',
})

onMounted(fetchData)

async function fetchData() {
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getEpcCpdTasks(),
      apiService.getEpcCounsellors(),
    ])

    // Add null checks and ensure we get arrays even if the API returns unexpected data
    cpdTasks.value = tasksResponse?.data?.results || tasksResponse?.data || []
    participants.value = participantsResponse?.data?.results || participantsResponse?.data || []

    console.log('Loaded tasks:', cpdTasks.value)
    console.log('Loaded participants:', participants.value)
  } catch (error) {
    console.error('Error fetching data:', error)
    showMessage('Failed to load data. Please try again.', 'error')
  }
}

function applyCreditsTemplate() {
  const templates = {
    symposium: 2,
    workshop: 3,
    conference: 5,
  }

  formData.cpdCredits = templates[formData.cpdCreditsTemplate] || 0
}

function handleCSVUpload(event) {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    csvFile.value = file
  } else {
    showMessage('Please upload a valid CSV file.', 'error')
    event.target.value = ''
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    photoFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    showMessage('Please upload a valid image file.', 'error')
    event.target.value = ''
  }
}

function removePhoto() {
  photoFile.value = null
  photoPreview.value = ''
}

async function submitForm() {
  if (!validateForm()) return

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('cpd_credits', formData.cpdCredits)
    formDataToSend.append('review_status', formData.reviewStatus)
    formDataToSend.append('review_remarks', formData.reviewRemarks)
    formDataToSend.append('endorsement_decision', formData.endorsementDecision)
    formDataToSend.append('endorsement_remarks', formData.endorsementRemarks)
    formDataToSend.append('cpd_task', formData.cpdTask)
    formDataToSend.append('participant_reg_no', formData.participantRegNo)

    await apiService.createEpcCpdTaskParticipant(formDataToSend)

    showMessage('Participant added successfully!', 'success')
    resetForm()
  } catch (error) {
    console.error('Error submitting form:', error)
    showMessage('Failed to add participant. Please try again.', 'error')
  }
}

async function submitBulkForm() {
  if (!csvFile.value || !bulkFormData.cpdTask) {
    showMessage('Please select a CPD task and upload a CSV file.', 'error')
    return
  }

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('cpd_task', bulkFormData.cpdTask)
    formDataToSend.append('participants_csv', csvFile.value)

    await apiService.bulkCreateEpcCpdTaskParticipants(formDataToSend)

    showMessage('Participants uploaded successfully!', 'success')
    resetBulkForm()
  } catch (error) {
    console.error('Error uploading participants:', error)
    showMessage('Failed to upload participants. Please check your CSV file and try again.', 'error')
  }
}

async function submitPhotoForm() {
  if (!photoFile.value || !photoFormData.cpdTask) {
    showMessage('Please select a CPD task and upload a photo.', 'error')
    return
  }

  try {
    // Create FormData for file upload
    const formDataToSend = new FormData()
    formDataToSend.append('cpd_task', photoFormData.cpdTask)
    formDataToSend.append('attendance_photo', photoFile.value)

    if (photoFormData.description) {
      formDataToSend.append('photo_description', photoFormData.description)
    }

    await apiService.uploadEpcCpdTaskAttendancePhoto(formDataToSend)

    showMessage('Attendance photo uploaded successfully!', 'success')
    resetPhotoForm()
  } catch (error) {
    console.error('Error uploading photo:', error)
    showMessage('Failed to upload attendance photo. Please try again.', 'error')
  }
}

function validateForm() {
  if (!formData.cpdCredits) {
    showMessage('Please enter CPD credits', 'error')
    return false
  }

  if (!formData.cpdTask) {
    showMessage('Please select a CPD task', 'error')
    return false
  }

  if (!formData.participantRegNo) {
    showMessage('Please select a participant', 'error')
    return false
  }

  return true
}

function resetForm() {
  Object.assign(formData, {
    cpdCreditsTemplate: '',
    cpdCredits: 0,
    reviewStatus: 'pending',
    reviewRemarks: '',
    endorsementDecision: 'pending',
    endorsementRemarks: '',
    cpdTask: '',
    participantRegNo: '',
  })
}

function resetBulkForm() {
  bulkFormData.cpdTask = ''
  csvFile.value = null
}

function resetPhotoForm() {
  photoFormData.cpdTask = ''
  photoFormData.description = ''
  removePhoto()
}

function cancel() {
  router.go(-1)
}

function showMessage(text, type) {
  message.value = text
  messageType.value = type
  setTimeout(() => (message.value = ''), 4000)
}
</script>
