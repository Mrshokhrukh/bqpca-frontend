<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
    <!-- Component-specific Loading Overlay -->
    <div v-if="localLoading"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="mt-3 text-sm font-medium text-gray-700">Saving changes...</p>
      </div>
    </div>

    <div class="p-6">
      <!-- Header with Edit Button -->
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <ClipboardCheck class="h-5 w-5 text-gray-500" />
          <span>Application Review Status</span>
        </h4>
        <button v-if="!isEditing" @click="startEditing"
          class="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="localLoading || props.isLoading">
          <Pencil class="h-4 w-4" />
        </button>
        <div v-else>
          <button @click="saveChanges"
            class="text-green-600 hover:text-green-800 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="localLoading || props.isLoading">
            <Check class="h-4 w-4" />
          </button>
          <button @click="cancelEditing"
            class="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="localLoading || props.isLoading">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Enhanced Payment Status Section -->
      <div class="p-4 bg-gray-50 rounded-lg mb-6">
        <h5 class="text-lg font-medium text-gray-900 mb-3">Payment Status</h5>
        <div class="flex items-center space-x-3">
          <span :class="[
            'w-3 h-3 rounded-full',
            currentPaymentStatus === 'pending'
              ? 'bg-yellow-400'
              : currentPaymentStatus === 'processing payment'
                ? 'bg-blue-400'
                : currentPaymentStatus === 'completed'
                  ? 'bg-green-400'
                  : currentPaymentStatus === 'failed'
                    ? 'bg-red-400'
                    : 'bg-gray-300',
          ]">
          </span>
          <span class="text-sm font-medium" :class="[
            currentPaymentStatus === 'pending'
              ? 'text-yellow-600'
              : currentPaymentStatus === 'processing payment'
                ? 'text-blue-600'
                : currentPaymentStatus === 'completed'
                  ? 'text-green-600'
                  : currentPaymentStatus === 'failed'
                    ? 'text-red-600'
                    : 'text-gray-600',
          ]">
            {{
              currentPaymentStatus === 'pending'
                ? 'Pending'
                : currentPaymentStatus === 'processing payment'
                  ? 'Processing Payment'
                  : currentPaymentStatus === 'completed'
                    ? 'Completed'
                    : currentPaymentStatus === 'failed'
                      ? 'Failed'
                      : props.qualification.payment_status || 'Unknown'
            }}
          </span>
        </div>
      </div>

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
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="localLoading || props.isLoading">
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approve Documents</option>
              <option value="Regretted">Regret Documents</option>
            </select>
            <textarea v-if="editableData.application_review_status === 'Regretted'"
              v-model="editableData.application_review_remark" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              rows="3" :disabled="localLoading || props.isLoading"></textarea>
          </div>
        </div>

        <!-- Physical Review (Edit) -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Physical Verification</h5>
            <select v-model="editableData.physical_review_status"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="localLoading || props.isLoading">
              <option value="Pending">Pending Verification</option>
              <option value="Approved">Verify Documents</option>
              <option value="Regretted">Regret Verification</option>
            </select>
            <textarea v-if="editableData.physical_review_status === 'Regretted'"
              v-model="editableData.physical_review_remark" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              rows="3" :disabled="localLoading || props.isLoading"></textarea>
          </div>
        </div>

        <!-- Endorsement (Edit) -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">
              Final Endorsement
              <span v-if="currentPaymentStatus !== 'completed'" class="text-sm text-red-500 ml-2">
                {{
                  currentPaymentStatus === 'processing payment'
                    ? '(Payment in progress)'
                    : currentPaymentStatus === 'failed'
                      ? '(Payment failed)'
                      : '(Requires payment completion)'
                }}
              </span>
            </h5>
            <select v-model="editableData.endorsement_decision"
              :disabled="localLoading || props.isLoading || currentPaymentStatus !== 'completed'" :class="[
                'w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                {
                  'opacity-50 cursor-not-allowed':
                    localLoading || props.isLoading || currentPaymentStatus !== 'completed',
                },
              ]">
              <option value="Pending">Pending Decision</option>
              <option value="Approved">Endorse Application</option>
              <option value="Regretted">Regret Application</option>
            </select>
            <textarea v-if="editableData.endorsement_decision === 'Regretted'"
              v-model="editableData.endorsement_remarks"
              :disabled="localLoading || props.isLoading || currentPaymentStatus !== 'completed'"
              placeholder="Provide rejection reason..." :class="[
                'mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                {
                  'opacity-50 cursor-not-allowed':
                    localLoading || props.isLoading || currentPaymentStatus !== 'completed',
                },
              ]" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Error Message Display -->
      <div v-if="errorMessage && !localLoading && !props.isLoading" class="text-red-500 text-sm mt-4">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { ClipboardCheck, Pencil, Check, X } from 'lucide-vue-next'
import apiServices from '@/services/services'
import isEqual from 'lodash/isEqual'

const props = defineProps({
  qualification: {
    type: Object,
    required: true,
  },
  applicationId: {
    type: Number,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },

  mainApplicationPaymentStatus: {
    type: String,
    default: 'pending',
  },
})

const emit = defineEmits(['update'])

const isEditing = ref(false)
const editableData = ref({})
const originalData = ref({})
const errorMessage = ref('')
const localLoading = ref(false)

const currentPaymentStatus = computed(() => {
  if (props.mainApplicationPaymentStatus?.toLowerCase() === 'completed') {
    return 'completed'
  }
  if (props.qualification.payment_status?.toLowerCase() === 'completed') {
    return 'completed'
  }

  return props.qualification.payment_status?.toLowerCase() || 'pending'
})

onMounted(() => {
  originalData.value = JSON.parse(JSON.stringify(props.qualification))
  editableData.value = JSON.parse(JSON.stringify(props.qualification))
})

watch(
  () => props.qualification,
  (newVal) => {
    if (!isEditing.value) {
      originalData.value = JSON.parse(JSON.stringify(newVal))
      editableData.value = JSON.parse(JSON.stringify(newVal))
    }
  },
  { deep: true },
)

const startEditing = () => {
  if (localLoading.value || props.isLoading) return
  isEditing.value = true
  editableData.value = JSON.parse(JSON.stringify(originalData.value))
  errorMessage.value = ''
}

const cancelEditing = () => {
  if (localLoading.value || props.isLoading) return
  isEditing.value = false
  editableData.value = JSON.parse(JSON.stringify(originalData.value))
  errorMessage.value = ''
}

const saveChanges = async () => {
  if (localLoading.value || props.isLoading) return

  errorMessage.value = ''

  localLoading.value = true

  if (!props.qualification.id) {
    console.error('Qualification ID is missing.')
    errorMessage.value = 'Qualification details are missing.'
    localLoading.value = false
    return
  }
  const changedFields = {}
  for (const key in editableData.value) {
    if (!isEqual(editableData.value[key], originalData.value[key])) {
      changedFields[key] = editableData.value[key]
    }
  }

  if (Object.keys(changedFields).length === 0) {
    isEditing.value = false
    localLoading.value = false
    return
  }

  try {
    const formData = new FormData()
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key]
        formData.append(key, value === null || value === undefined ? '' : value)
      }
    }

    console.log('Sending PATCH data:', Object.fromEntries(formData.entries()))

    await apiServices.patchEpcNewQualification(props.qualification.id, formData)
    originalData.value = JSON.parse(JSON.stringify(editableData.value))
    isEditing.value = false
    emit('update')
  } catch (error) {
    console.error('Error saving changes:', error)
    errorMessage.value = error.response?.data?.message || 'Failed to save changes.'
  } finally {
    localLoading.value = false
  }
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-400'
    case 'approved':
      return 'bg-green-400'
    case 'regretted':
      return 'bg-red-400'
    default:
      return 'bg-gray-300'
  }
}
</script>
