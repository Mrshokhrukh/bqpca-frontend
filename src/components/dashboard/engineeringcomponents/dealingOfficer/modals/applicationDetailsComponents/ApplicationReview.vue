<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <!-- Header with Edit Button -->
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <ClipboardCheck class="h-5 w-5 text-gray-500" />
          <span>Application Review Status</span>
        </h4>
        <button v-if="!isEditing" @click="startEditing" class="text-blue-600 hover:text-blue-800">
          <Pencil class="h-4 w-4" />
        </button>
        <div v-else>
          <button @click="saveChanges" class="text-green-600 hover:text-green-800 mr-2">
            <Check class="h-4 w-4" />
          </button>
          <button @click="cancelEditing" class="text-gray-600 hover:text-gray-800">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Corrected Payment Status Section -->
      <div class="p-4 bg-gray-50 rounded-lg mb-6">
        <h5 class="text-lg font-medium text-gray-900 mb-3">Payment Status</h5>
        <div class="flex items-center space-x-3">
          <!-- Status Indicator Dot -->
          <span :class="[
            'w-3 h-3 rounded-full',
            // Use the prop value here
            props.qualification.payment_status === 'pending'
              ? 'bg-yellow-400' // Pending = Yellow
              : props.qualification.payment_status === 'completed' // Match API value (like 'completed')
                ? 'bg-green-400' // Completed = Green
                : 'bg-gray-300', // Default/Unknown = Gray
          ]">
          </span>
          <!-- Status Text -->
          <span class="text-sm font-medium capitalize" :class="[
            // Use the prop value here
            props.qualification.payment_status === 'pending'
              ? 'text-yellow-600'
              : props.qualification.payment_status === 'completed' // Match API value
                ? 'text-green-600'
                : 'text-gray-600',
          ]">
            <!-- Display the actual status from the prop, or 'Unknown' if null/undefined -->
            {{ props.qualification.payment_status || 'Unknown' }}
          </span>
        </div>
      </div>
      <!-- End of Corrected Payment Status Section -->

      <!-- Display Mode -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" v-if="!isEditing">
        <!-- Application Review (Display) -->
        <div class="space-y-2">
          <h6 class="text-sm font-medium text-gray-700">Document Review</h6>
          <div class="flex items-center space-x-2">
            <span :class="[
              'w-2 h-2 rounded-full',
              getStatusClass(editableData.application_review_status),
            ]"></span>
            <span class="text-sm text-gray-600">{{ editableData.application_review_status }}</span>
          </div>
          <p v-if="editableData.application_review_remark" class="text-sm text-gray-500 mt-1">
            {{ editableData.application_review_remark }}
          </p>
        </div>

        <!-- Physical Review (Display) -->
        <div class="space-y-2">
          <h6 class="text-sm font-medium text-gray-700">Physical Verification</h6>
          <div class="flex items-center space-x-2">
            <span :class="['w-2 h-2 rounded-full', getStatusClass(editableData.physical_review_status)]"></span>
            <span class="text-sm text-gray-600">{{ editableData.physical_review_status }}</span>
          </div>
          <p v-if="editableData.physical_review_remark" class="text-sm text-gray-500 mt-1">
            {{ editableData.physical_review_remark }}
          </p>
        </div>

        <!-- Endorsement (Display) -->
        <div class="space-y-2">
          <h6 class="text-sm font-medium text-gray-700">Final Endorsement</h6>
          <div class="flex items-center space-x-2">
            <span :class="['w-2 h-2 rounded-full', getStatusClass(editableData.endorsement_decision)]"></span>
            <span class="text-sm text-gray-600">{{ editableData.endorsement_decision }}</span>
          </div>
          <p v-if="editableData.endorsement_remarks" class="text-sm text-gray-500 mt-1">
            {{ editableData.endorsement_remarks }}
          </p>
        </div>
      </div>

      <!-- Editing Mode -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" v-else>
        <!-- Application Review (Edit) -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Document Review</h5>
            <select v-model="editableData.application_review_status"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approve Documents</option>
              <option value="Regretted">Regret Documents</option>
            </select>
            <textarea v-if="editableData.application_review_status === 'Regretted'"
              v-model="editableData.application_review_remark" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"></textarea>
          </div>
        </div>

        <!-- Physical Review (Edit) -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Physical Verification</h5>
            <select v-model="editableData.physical_review_status"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending Verification</option>
              <option value="Approved">Verify Documents</option>
              <option value="Regretted">Regret Verification</option>
            </select>
            <textarea v-if="editableData.physical_review_status === 'Regretted'"
              v-model="editableData.physical_review_remark" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"></textarea>
          </div>
        </div>

        <!-- Endorsement (Edit) -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Final Endorsement</h5>
            <select v-model="editableData.endorsement_decision"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending Decision</option>
              <option value="Approved">Endorse Application</option>
              <option value="Regretted">Regret Application</option>
            </select>
            <textarea v-if="editableData.endorsement_decision === 'Regretted'"
              v-model="editableData.endorsement_remarks" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Error Message Display -->
      <div v-if="errorMessage" class="text-red-500 text-sm mt-4">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ClipboardCheck, Pencil, Check, X } from 'lucide-vue-next'
import apiServices from '@/services/services' // Assuming this path is correct
import isEqual from 'lodash/isEqual' // Make sure lodash is installed

const props = defineProps({
  qualification: {
    type: Object,
    required: true,
  },
  // applicationId is defined but not used in this specific component logic,
  // but kept as it might be needed elsewhere or by the parent.
  applicationId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update'])

const isEditing = ref(false)
const editableData = ref({})
const originalData = ref({})
const errorMessage = ref('')
// Removed the local paymentStatus ref as we'll use the prop directly

// Initialize state when component mounts
onMounted(() => {
  // Use JSON parse/stringify for a deep clone to avoid modifying the prop directly
  originalData.value = JSON.parse(JSON.stringify(props.qualification))
  editableData.value = { ...originalData.value } // Start editable data with a copy
})

// Watch for changes in the incoming qualification prop
watch(
  () => props.qualification,
  (newVal) => {
    // Update both original and editable data if the prop changes externally
    originalData.value = JSON.parse(JSON.stringify(newVal))
    // Reset editable data only if not currently editing to avoid overwriting user input
    if (!isEditing.value) {
      editableData.value = { ...originalData.value }
    }
  },
  { deep: true }, // Use deep watch for nested object changes
)

const startEditing = () => {
  isEditing.value = true
  // Ensure editableData is a fresh copy of the *current* originalData when editing starts
  editableData.value = JSON.parse(JSON.stringify(originalData.value))
}

const cancelEditing = () => {
  isEditing.value = false
  // Reset editableData back to the unmodified original data
  editableData.value = JSON.parse(JSON.stringify(originalData.value))
  errorMessage.value = '' // Clear any previous errors
}

const saveChanges = async () => {
  errorMessage.value = '' // Clear previous errors
  if (!props.qualification || !props.qualification.id) {
    console.error('Qualification ID is missing.')
    errorMessage.value = 'Cannot save changes: Qualification details are missing.'
    return
  }

  // Find only the fields that have actually changed
  const changedFields = {}
  for (const key in editableData.value) {
    // Check if the key exists in originalData and if the values are different
    if (
      Object.prototype.hasOwnProperty.call(originalData.value, key) &&
      !isEqual(editableData.value[key], originalData.value[key])
    ) {
      // Specific handling for remarks: if status changes away from 'Regretted', clear the remark
      if (key === 'application_review_status' && editableData.value[key] !== 'Regretted') {
        if (editableData.value.application_review_remark !== originalData.value.application_review_remark) {
          changedFields.application_review_remark = '' // Clear remark explicitly if status changed
        }
      } else if (key === 'physical_review_status' && editableData.value[key] !== 'Regretted') {
        if (editableData.value.physical_review_remark !== originalData.value.physical_review_remark) {
          changedFields.physical_review_remark = ''
        }
      } else if (key === 'endorsement_decision' && editableData.value[key] !== 'Regretted') {
        if (editableData.value.endorsement_remarks !== originalData.value.endorsement_remarks) {
          changedFields.endorsement_remarks = ''
        }
      }

      // Add the changed field
      changedFields[key] = editableData.value[key]

      // If status is 'Regretted' but remark is empty, don't send empty remark unless it was changed from non-empty
      if (key.endsWith('_remark') && editableData.value[key.replace('_remark', '_status')] !== 'Regretted') {
        // If the corresponding status is NOT 'Regretted', ensure we send an empty remark if it was cleared
        if (originalData.value[key] !== '' && changedFields[key] === '') {
          // keep changedFields[key] = '';
        } else if (changedFields[key] === '') {
          // If remark is empty and status is not Regretted, don't send the empty remark unless it was explicitly cleared
          delete changedFields[key];
        }
      }


    } else if (
      // Handle cases where a key exists in editableData but not originalData (less common)
      !Object.prototype.hasOwnProperty.call(originalData.value, key) &&
      editableData.value[key] != null // Check for non-null/undefined new values
    ) {
      changedFields[key] = editableData.value[key]
    }
  }


  // If no fields were actually changed, just exit edit mode
  if (Object.keys(changedFields).length === 0) {
    isEditing.value = false
    return
  }

  // Prepare data for API (using FormData is good practice for potential file uploads later)
  try {
    const formData = new FormData()
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key]
        // Handle null/undefined values by sending an empty string, adjust if API expects nulls
        formData.append(key, value === null || value === undefined ? '' : value)
      }
    }

    // Log the data being sent for debugging
    console.log('Sending PATCH data:', Object.fromEntries(formData.entries()));

    // Make the API call
    // Ensure the service function signature matches (ID, data)
    await apiServices.patchEpcNewQualification(props.qualification.id, formData)

    // Update the local 'originalData' baseline to the new saved state
    originalData.value = JSON.parse(JSON.stringify(editableData.value))

    isEditing.value = false // Exit editing mode on success
    emit('update') // Notify parent component that an update occurred
  } catch (error) {
    console.error('Error saving changes:', error)
    // Provide more specific error feedback if possible (e.g., from error.response.data)
    errorMessage.value = `Failed to save changes: ${error.message || 'Please try again.'}`
    // Optionally revert editableData back to originalData on failure, or let user retry
    // editableData.value = JSON.parse(JSON.stringify(originalData.value));
  }
}

// Helper function to get status CSS class for display mode
const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-400' // Yellow for pending
    case 'Approved':
      return 'bg-green-400' // Green for approved
    case 'Regretted':
      return 'bg-red-400' // Red for regretted
    default:
      return 'bg-gray-300' // Gray for unknown/other
  }
}
</script>
