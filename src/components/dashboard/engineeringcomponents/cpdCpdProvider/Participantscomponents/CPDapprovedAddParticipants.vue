<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Add CPD Task Participant
      <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
    </h1>

    <!-- Tab Navigation -->
    <TabNavigation
      :activeTab="activeTab"
      @tab-change="handleTabChange"
      :disabled="isBulkUploading || isSingleSubmitting || isPhotoUploading"
    />

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8 mt-6">
      <!-- Loading indicator for initial data fetch -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span class="ml-2 text-gray-600">Loading data...</span>
      </div>

      <!-- Tab Content -->
      <SingleEntryForm
        v-show="!isLoading && activeTab === 'single'"
        ref="singleEntryFormRef"
        :cpdTasks="cpdTasksForSelection"
        :participants="participants"
        :current-provider-cid="currentProviderCid"
        :is-submitting="isSingleSubmitting"
        @submit="handleSingleSubmit"
        @cancel="cancel"
      />

      <BulkUploadForm
        v-show="!isLoading && activeTab === 'bulk'"
        ref="bulkUploadFormRef"
        :cpdTasks="cpdTasksForSelection"
        :current-provider-cid="currentProviderCid"
        :is-processing-upload="isBulkUploading"
        :preselected-task-id="preselectedTaskId"
        @submit="handleBulkSubmit"
        @cancel="cancel"
      />

      <AttendancePhotoForm
        v-show="!isLoading && activeTab === 'photo'"
        ref="attendancePhotoFormRef"
        :cpdTasks="cpdTasksForSelection"
        :current-provider-cid="currentProviderCid"
        :is-submitting="isPhotoUploading"
        @submit="handlePhotoSubmit"
        @cancel="cancel"
      />

      <!-- Status Message -->
      <StatusMessage
        v-if="message"
        :message="message"
        :type="messageType"
        @close="clearMessage"
        class="mt-6"
      />

      <!-- Detailed Bulk Upload Errors -->
      <div
        v-if="bulkUploadErrorList.length > 0 && activeTab === 'bulk'"
        class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md"
      >
        <h4 class="text-md font-semibold text-red-700 mb-2">Bulk Upload Issues:</h4>
        <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
          <li v-for="(err, index) in bulkUploadErrorList" :key="index">
            Row {{ err.row }} (Reg No: {{ err.participant_reg_no || 'N/A' }}): {{ err.error }}
          </li>
        </ul>
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
  const filtered = allCpdTasks.value
    .filter((task) => {
      const isApproved = task.is_cpd_approved === true

      if (currentProviderCid.value) {
        const matches =
          isApproved && String(task.cid_no).trim() === String(currentProviderCid.value).trim()
        return matches
      }
      return isApproved
    })
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''))

  return filtered
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
        toast.warning('Provider CID not found. Some functionality may be limited.')
      }
    } else {
      toast.warning('User data not found. Please log in again.')
    }
  } catch (error) {
    console.error('Error retrieving or parsing user data for provider CID:', error)
    toast.error('Failed to load user data.')
  }

  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getEpcCpdTasks(),
      apiService.getEpcFullApplicationListByCid(''),
    ])

    allCpdTasks.value = tasksResponse.data?.results || tasksResponse.data || []
    participants.value = participantsResponse.data?.results || participantsResponse.data || []

    if (allCpdTasks.value.length === 0) {
      toast.info('No CPD tasks found. Please create or approve tasks to add participants.')
    } else if (cpdTasksForSelection.value.length === 0) {
      toast.warning(
        'No approved CPD tasks found for your provider ID. Check if tasks are approved and your CID matches.',
      )
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
    const response = await apiService.createEpcCpdTaskParticipant(submissionData)

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
              `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`,
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
    const response = await apiService.bulkCreateEpcCpdTaskParticipants(formDataToSend)
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
              `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`,
          )
          .join('; ')
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
    // Create FormData for the PATCH request
    const formDataToSend = new FormData()
    formDataToSend.append('attendance_sheet_attachment', photo, photo.name)

    // Add description as a separate field if provided
    if (description) {
      formDataToSend.append('photo_description', description)
    }

    // Use PATCH to update only the attendance_sheet_attachment field
    await apiService.patchEpcCpdTask(cpdTask, formDataToSend)
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
      else if (
        errors.attendance_sheet_attachment &&
        Array.isArray(errors.attendance_sheet_attachment)
      )
        errorMessage = `Photo error: ${errors.attendance_sheet_attachment.join(', ')}`
      else if (typeof errors === 'string') errorMessage = errors
      else if (typeof errors === 'object' && !Array.isArray(errors)) {
        errorMessage = Object.entries(errors)
          .map(
            ([key, value]) =>
              `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`,
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
