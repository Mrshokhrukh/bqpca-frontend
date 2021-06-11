<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-12"
  >
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
          Add CPD Task Participant
        </h1>
        <div
          class="mt-4 h-1.5 w-24 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg"
        ></div>
      </div>

      <TabNavigation
        :activeTab="activeTab"
        @tab-change="handleTabChange"
        :disabled="isBulkUploading || isSingleSubmitting || isPhotoUploading"
        class="max-w-2xl mx-auto"
      />

      <div
        class="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/80"
      >
        <div class="p-6 md:p-10">
          <div v-if="isLoading" class="flex flex-col justify-center items-center py-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span class="mt-4 text-lg font-medium text-gray-700">Loading essential data...</span>
            <p class="text-sm text-gray-500">Please wait a moment.</p>
          </div>

          <div v-else>
            <SingleEntryForm
              v-show="activeTab === 'single'"
              ref="singleEntryFormRef"
              :cpdTasks="cpdTasksForSelection"
              :participants="participants"
              :current-provider-cid="currentProviderCid"
              :is-submitting="isSingleSubmitting"
              @submit="handleSingleSubmit"
              @cancel="cancel"
            />

            <BulkUploadForm
              v-show="activeTab === 'bulk'"
              ref="bulkUploadFormRef"
              :cpdTasks="cpdTasksForSelection"
              :current-provider-cid="currentProviderCid"
              :is-processing-upload="isBulkUploading"
              :preselected-task-id="preselectedTaskId"
              @submit="handleBulkSubmit"
              @cancel="cancel"
            />

            <AttendancePhotoForm
              v-show="activeTab === 'photo'"
              ref="attendancePhotoFormRef"
              :cpdTasks="cpdTasksForSelection"
              :current-provider-cid="currentProviderCid"
              :is-submitting="isPhotoUploading"
              @submit="handlePhotoSubmit"
              @cancel="cancel"
            />
          </div>
        </div>

        <div v-if="message || bulkUploadErrorList.length > 0" class="px-6 md:px-10 pb-8">
          <StatusMessage
            v-if="message"
            :message="message"
            :type="messageType"
            @close="clearMessage"
          />

          <div
            v-if="bulkUploadErrorList.length > 0 && activeTab === 'bulk'"
            class="mt-6 p-5 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
          >
            <h4 class="text-md font-bold text-red-800 mb-3">Bulk Upload Issues Detected:</h4>
            <ul class="list-disc list-inside text-sm text-red-700 space-y-2">
              <li v-for="(err, index) in bulkUploadErrorList" :key="index">
                <strong>Row {{ err.row }}</strong> (Reg No: {{ err.participant_reg_no || 'N/A' }}):
                <span class="font-medium">{{ err.error }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import TabNavigation from './TabNavigation.vue'
import SingleEntryForm from './SingleEntryForm.vue'
import BulkUploadForm from './BulkUploadForm.vue'
import AttendancePhotoForm from './AttendancePhotoForm.vue'
import StatusMessage from './StatusMessage.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const allCpdTasks = ref([])
const participants = ref([])
const currentProviderCid = ref(null)
const preselectedTaskId = ref(null)

const activeTab = ref('single')
const isLoading = ref(true)
const message = ref('')
const messageType = ref('')
const messageTimeoutId = ref(null)

const isSingleSubmitting = ref(false)
const isBulkUploading = ref(false)
const isPhotoUploading = ref(false)

const singleEntryFormRef = ref(null)
const bulkUploadFormRef = ref(null)
const attendancePhotoFormRef = ref(null)

const bulkUploadErrorList = ref([])

const cpdTasksForSelection = computed(() => {
  return allCpdTasks.value
    .filter((task) => {
      const isApproved =
        task.application_status === 'APPROVED' ||
        String(task.application_status).toUpperCase() === 'APPROVED'
      if (currentProviderCid.value) {
        return isApproved && String(task.cid_no).trim() === String(currentProviderCid.value).trim()
      }
      return isApproved
    })
    .sort((a, b) => (a.title_of_cpd || '').localeCompare(b.title_of_cpd || ''))
})

onMounted(async () => {
  if (route.query.add_participants === 'true' && route.query.id) {
    activeTab.value = 'bulk'
    preselectedTaskId.value = route.query.id
  }

  try {
    const userString = localStorage.getItem('user')
    if (userString) {
      const loggedInUser = JSON.parse(userString)
      currentProviderCid.value = loggedInUser?.cid || null
      if (!currentProviderCid.value) {
        console.warn("Logged in user data found, but 'cid' (Provider CID) is missing or null.")
        toast.warning('Provider CID not found. Some functionality may be limited.')
      }
    } else {
      console.warn('No user data found in localStorage. Provider CID cannot be determined.')
      toast.warning('User data not found. Please log in again.')
    }
  } catch (error) {
    console.error('Error retrieving or parsing user data for provider CID:', error)
    toast.error('Failed to load user data.')
  }

  await fetchData()
  console.log('Fetched data:', {
    cpdTasks: allCpdTasks.value,
    participants: participants.value,
    currentProviderCid: currentProviderCid.value,
    preselectedTaskId: preselectedTaskId.value,
  })
})

async function fetchData() {
  isLoading.value = true
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getMhpcCpdTask(),
      apiService.getMhpcCounsellors(),
    ])

    allCpdTasks.value = tasksResponse.data?.results || tasksResponse.data || []
    participants.value = participantsResponse.data?.results || participantsResponse.data || []

    if (allCpdTasks.value.length === 0) {
      toast.info('No CPD tasks found. Please create or approve tasks to add participants.')
    }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    showMessage('Failed to load essential data. Please try refreshing the page.', 'error')
    allCpdTasks.value = []
    participants.value = []
  } finally {
    isLoading.value = false
  }
}

function handleTabChange(newTab) {
  activeTab.value = newTab
}

watch(activeTab, (newTab, oldTab) => {
  clearMessage()
  bulkUploadErrorList.value = []

  if (oldTab === 'single' && singleEntryFormRef.value?.resetForm) {
    singleEntryFormRef.value.resetForm(false)
  }
  if (oldTab === 'bulk' && bulkUploadFormRef.value?.resetForm) {
    bulkUploadFormRef.value.resetForm(false)
  }
  if (oldTab === 'photo' && attendancePhotoFormRef.value?.resetForm) {
    attendancePhotoFormRef.value.resetForm(false)
  }
})

async function handleSingleSubmit(submissionData) {
  isSingleSubmitting.value = true
  clearMessage()
  bulkUploadErrorList.value = []
  try {
    await apiService.createMhpcCpdTaskParticipant(submissionData)
    showMessage('Participant added successfully!', 'success')
    if (singleEntryFormRef.value?.resetForm) {
      singleEntryFormRef.value.resetForm(false)
    }
  } catch (error) {
    console.error('Error submitting single participant:', error)
    let errorMessage = 'Failed to add participant.'
    if (error.response?.data) {
      const errors = error.response.data
      if (errors.detail) errorMessage = errors.detail
      else if (errors.error) errorMessage = errors.error
      else if (typeof errors === 'object' && !Array.isArray(errors)) {
        errorMessage = Object.entries(errors)
          .map(
            ([key, value]) =>
              `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join('; ')
      } else if (Array.isArray(errors)) errorMessage = errors.join('; ')
      else if (typeof errors === 'string') errorMessage = errors
    }
    showMessage(errorMessage, 'error')
  } finally {
    isSingleSubmitting.value = false
  }
}

async function handleBulkSubmit({ cpdTask, file }) {
  isBulkUploading.value = true
  clearMessage()
  bulkUploadErrorList.value = []

  const formDataToSend = new FormData()
  formDataToSend.append('cpd_task', cpdTask)
  formDataToSend.append('file', file)

  try {
    const response = await apiService.bulkCreateMhpcCpdTaskParticipants(formDataToSend)
    const responseData = response.data || {}
    const { created_count = 0, failed_count = 0, errors = [] } = responseData

    let finalMessage = ''
    let finalMessageType = ''

    if (created_count > 0) {
      finalMessage = `${created_count} participant(s) successfully processed.`
      finalMessageType = 'success'
      if (failed_count > 0 || errors.length > 0) {
        finalMessageType = 'warning'
        finalMessage += ` However,`
        if (failed_count > 0) finalMessage += ` ${failed_count} row(s) could not be processed.`
        if (errors.length > 0) {
          finalMessage += ` There were ${errors.length} issue(s) with specific rows.`
          bulkUploadErrorList.value = errors
        }
      } else {
        if (bulkUploadFormRef.value?.resetForm) {
          bulkUploadFormRef.value.resetForm(false)
        }
      }
    } else if (failed_count > 0 || errors.length > 0) {
      finalMessage = `CSV processed, but no participants were created.`
      finalMessageType = 'error'
      if (failed_count > 0) finalMessage += ` ${failed_count} row(s) could not be processed.`
      if (errors.length > 0) {
        finalMessage += ` There were ${errors.length} issue(s) with specific rows.`
        bulkUploadErrorList.value = errors
      }
    } else {
      finalMessage = 'CSV processed. No new participants were found or created from the file.'
      finalMessageType = 'info'
      if (bulkUploadFormRef.value?.resetForm) {
        bulkUploadFormRef.value.resetForm(false)
      }
    }
    showMessage(finalMessage.trim(), finalMessageType)
    console.log('Bulk upload response:', responseData)
  } catch (error) {
    console.error('Critical error during bulk upload:', error)
    let errorMessage =
      'Bulk upload failed. Please ensure the file format is correct and the CPD Task is valid.'
    let errors = []
    if (error.response?.data) {
      const responseData = error.response.data
      if (responseData.errors && Array.isArray(responseData.errors)) {
        errors = responseData.errors
        errorMessage = `${responseData.failed_count || 0} row(s) could not be processed.`
        bulkUploadErrorList.value = errors
      } else if (responseData.detail) {
        errorMessage = responseData.detail
      } else if (responseData.error) {
        errorMessage = responseData.error
      } else if (typeof responseData === 'object' && !Array.isArray(responseData)) {
        errorMessage = Object.entries(responseData)
          .map(
            ([key, value]) =>
              `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join('; ')
      } else if (typeof responseData === 'string') {
        errorMessage = responseData
      }
    }
    showMessage(errorMessage, 'error')
    console.log('Error response:', error.response?.data)
  } finally {
    isBulkUploading.value = false
  }
}

async function handlePhotoSubmit({ cpdTask, photo, description }) {
  isPhotoUploading.value = true
  clearMessage()
  bulkUploadErrorList.value = []
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('cpd_task', cpdTask)
    formDataToSend.append('attendance_photo', photo, photo.name)
    if (description) {
      formDataToSend.append('photo_description', description)
    }

    await apiService.uploadCpdTaskAttendancePhoto(formDataToSend)
    showMessage('Attendance photo uploaded successfully!', 'success')
    if (attendancePhotoFormRef.value?.resetForm) {
      attendancePhotoFormRef.value.resetForm(false)
    }
  } catch (error) {
    console.error('Error uploading attendance photo:', error)
    let errorMessage = 'Failed to upload attendance photo.'
    if (error.response?.data) {
      const errors = error.response.data
      if (errors.detail) errorMessage = errors.detail
      else if (errors.attendance_photo && Array.isArray(errors.attendance_photo))
        errorMessage = `Photo error: ${errors.attendance_photo.join(', ')}`
      else if (typeof errors === 'string') errorMessage = errors
      else if (typeof errors === 'object' && !Array.isArray(errors)) {
        errorMessage = Object.entries(errors)
          .map(
            ([key, value]) =>
              `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join('; ')
      } else if (Array.isArray(errors)) errorMessage = errors.join('; ')
    }
    showMessage(errorMessage, 'error')
  } finally {
    isPhotoUploading.value = false
  }
}

function cancel() {
  router.go(-1)
}

function showMessage(text, type = 'info', duration = 7000) {
  message.value = text
  messageType.value = type
  if (messageTimeoutId.value) clearTimeout(messageTimeoutId.value)
  messageTimeoutId.value = setTimeout(clearMessage, duration)
}

function clearMessage() {
  message.value = ''
  messageType.value = ''
  if (messageTimeoutId.value) {
    clearTimeout(messageTimeoutId.value)
    messageTimeoutId.value = null
  }
}
</script>
