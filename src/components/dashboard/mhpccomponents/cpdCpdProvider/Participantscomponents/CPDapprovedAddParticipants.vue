<template>
  <div class="w-full min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
          Upload Participant Data
        </h1>
        <p class="mt-3 text-lg text-gray-600">
          Upload participant lists or attendance photos for your CPD tasks.
        </p>
      </div>

      <TabNavigation
        :tabs="tabs"
        :activeTab="activeTab"
        @tab-change="handleTabChange"
        :disabled="isBulkUploading || isPhotoUploading"
        class="max-w-xl mx-auto"
      />

      <div class="mt-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <div class="p-6 md:p-10">
          <div v-if="isLoading" class="flex flex-col justify-center items-center py-12 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="mt-4 text-lg font-medium text-gray-700">Loading Essential Data...</span>
            <p class="text-sm text-gray-500">Please wait a moment.</p>
          </div>

          <div v-else>
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
import BulkUploadForm from './BulkUploadForm.vue'
import AttendancePhotoForm from './AttendancePhotoForm.vue'
import StatusMessage from './StatusMessage.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const allCpdTasks = ref([])
const currentProviderCid = ref(null)
const preselectedTaskId = ref(null)

// Set the default active tab to 'bulk'
const activeTab = ref('bulk')
const isLoading = ref(true)
const message = ref('')
const messageType = ref('')
const messageTimeoutId = ref(null)

const isBulkUploading = ref(false)
const isPhotoUploading = ref(false)

const bulkUploadFormRef = ref(null)
const attendancePhotoFormRef = ref(null)

const bulkUploadErrorList = ref([])

// Define the available tabs for the TabNavigation component
const tabs = [
  { id: 'bulk', name: 'Bulk Upload' },
  { id: 'photo', name: 'Attendance Photo' },
]

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
  // If routing here to add participants, ensure the bulk tab is active.
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
        toast.warning('Provider CID not found. Some functionality may be limited.')
      }
    } else {
      toast.warning('User data not found. Please log in again.')
    }
  } catch (error) {
    console.error('Error retrieving user data for provider CID:', error)
    toast.error('Failed to load user data.')
  }

  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    // We no longer need to fetch all participants for single entry
    const tasksResponse = await apiService.getMhpcCpdTask()
    allCpdTasks.value = tasksResponse.data?.results || tasksResponse.data || []

    if (allCpdTasks.value.length === 0) {
      toast.info('No CPD tasks found. Please create or approve tasks to add participants.')
    }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    showMessage('Failed to load essential data. Please try refreshing the page.', 'error')
    allCpdTasks.value = []
  } finally {
    isLoading.value = false
  }
}

function handleTabChange(newTab) {
  activeTab.value = newTab
}

// Watch for tab changes to reset forms
watch(activeTab, (newTab, oldTab) => {
  clearMessage()
  bulkUploadErrorList.value = []

  if (oldTab === 'bulk' && bulkUploadFormRef.value?.resetForm) {
    bulkUploadFormRef.value.resetForm(false)
  }
  if (oldTab === 'photo' && attendancePhotoFormRef.value?.resetForm) {
    attendancePhotoFormRef.value.resetForm(false)
  }
})

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
      } else if (bulkUploadFormRef.value?.resetForm) {
        bulkUploadFormRef.value.resetForm(false)
      }
    } else if (failed_count > 0 || errors.length > 0) {
      finalMessage = 'CSV processed, but no participants were created.'
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
  } catch (error) {
    console.error('Critical error during bulk upload:', error)
    let errorMessage =
      'Bulk upload failed. Please ensure the file format is correct and the CPD Task is valid.'
    if (error.response?.data) {
      const responseData = error.response.data
      if (responseData.errors && Array.isArray(responseData.errors)) {
        errorMessage = `${responseData.failed_count || 0} row(s) could not be processed.`
        bulkUploadErrorList.value = responseData.errors
      } else if (responseData.detail) {
        errorMessage = responseData.detail
      } else if (responseData.error) {
        errorMessage = responseData.error
      } else if (typeof responseData === 'string') {
        errorMessage = responseData
      }
    }
    showMessage(errorMessage, 'error')
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
      else errorMessage = 'An unexpected error occurred.'
    }
    showMessage(errorMessage, 'error')
  } finally {
    isPhotoUploading.value = false
  }
}

function cancel() {
  router.go(-1)
}

function showMessage(text, type = 'info', duration = 8000) {
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
