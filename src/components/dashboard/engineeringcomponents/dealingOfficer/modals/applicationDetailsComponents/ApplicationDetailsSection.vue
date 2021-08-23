<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-w-4xl mx-auto"
  >
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center space-x-3">
          <FileText class="h-6 w-6 text-blue-600" />
          <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
        </div>
        <div class="flex items-center space-x-2">
          <template v-if="!isEditing">
            <button
              @click="startEditing"
              class="btn-icon-subtle hover:bg-blue-50 transition-colors"
              title="Edit Details"
            >
              <Pencil class="h-5 w-5 text-blue-600 hover:text-blue-800" />
            </button>
          </template>
          <template v-else>
            <button
              @click="saveChanges"
              class="btn-icon-success hover:bg-green-50 transition-colors"
              title="Save Changes"
              :disabled="!validationState.isValid || isSaving"
            >
              <Check class="h-5 w-5 text-green-600 hover:text-green-800" />
            </button>
            <button
              @click="cancelEditing"
              class="btn-icon-subtle hover:bg-red-50 transition-colors"
              title="Cancel Editing"
              :disabled="isSaving"
            >
              <X class="h-5 w-5 text-gray-600 hover:text-red-800" />
            </button>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="grid grid-cols-2 gap-4">
          <detail-card
            icon="FileCheck"
            label="Registration Type"
            :value="application.registration_type_name"
          />
          <detail-card
            icon="Hash"
            label="Registration Number"
            :value="application.registration_no"
          />
          <detail-card
            icon="Calendar"
            label="Registration Date"
            :value="formatDate(application.registration_date)"
          />
          <detail-card
            icon="Clock"
            label="Expiry Date"
            :value="formatDate(application.expiry_date)"
          />
        </div>

        <div class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-600 mb-2">
              Select Qualification to Edit
            </label>
            <template v-if="isEditing">
              <select
                v-model="selectedQualificationId"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
                :disabled="isSaving"
              >
                <option value="" disabled>Select a Qualification</option>
                <option
                  v-for="qualification in application.user_qualifications"
                  :key="qualification.id"
                  :value="qualification.id"
                >
                  {{ qualification.qualification_name_display }}
                </option>
              </select>
            </template>
            <template v-else>
              <div class="text-gray-700 px-3 py-2">
                {{
                  selectedQualification
                    ? selectedQualification.qualification_name_display
                    : 'No Qualification Selected'
                }}
              </div>
            </template>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <button
              @click="togglePrimaryQualification"
              :disabled="!selectedQualification || !isEditing || isSaving"
              :class="{
                'bg-blue-500 text-white':
                  selectedQualification && selectedQualification.is_primary_qualification,
                'bg-gray-200 text-gray-700':
                  !isEditing ||
                  !selectedQualification ||
                  !selectedQualification.is_primary_qualification,
                'opacity-50 cursor-not-allowed': !selectedQualification || !isEditing || isSaving,
              }"
              class="w-full px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md"
            >
              {{
                selectedQualification && selectedQualification.is_primary_qualification
                  ? 'Unmark as Primary'
                  : 'Mark as Primary'
              }}
            </button>
          </div>
        </div>
      </div>

      <template v-if="selectedQualification">
        <div class="grid md:grid-cols-2 gap-x-4 gap-y-5 pt-4 border-t">
          <div class="flex flex-col space-y-1">
            <label class="block text-sm font-medium text-gray-600">
              Personnel Category
              <span v-if="validationState.missingFields.includes('Personnel Category')" class="text-red-500 font-bold ml-1">*</span>
            </label>
            <div class="text-sm">
              <template v-if="isEditing">
                <select
                  v-model="editableData.personnel_category"
                  class="form-select"
                  :class="{'form-invalid': isEditing && !editableData.personnel_category}"
                  :disabled="isSaving"
                >
                  <option value="" disabled>Select Category</option>
                  <option v-for="category in personnelCategories" :key="category.id" :value="category.id">
                    {{ category.category_name }}
                  </option>
                </select>
              </template>
              <template v-else>
                <p class="px-3 py-2 rounded-lg bg-gray-50">
                  {{ selectedCategoryName || 'N/A' }}
                </p>
              </template>
            </div>
          </div>

          <div class="flex flex-col space-y-1">
            <label class="block text-sm font-medium text-gray-600">
              Personnel Subcategory
              <span v-if="validationState.missingFields.includes('Personnel Subcategory')" class="text-red-500 font-bold ml-1">*</span>
            </label>
            <div class="text-sm">
              <template v-if="isEditing">
                 <select
                   v-model="editableData.personnel_sub_category"
                   class="form-select"
                   :class="{'form-invalid': isEditing && !editableData.personnel_sub_category}"
                   :disabled="isSaving"
                 >
                  <option value="" disabled>Select Subcategory</option>
                  <option v-for="subcategory in personnelSubcategories" :key="subcategory.id" :value="subcategory.id">
                    {{ subcategory.sub_category_name }}
                  </option>
                </select>
              </template>
              <template v-else>
                 <p class="px-3 py-2 rounded-lg bg-gray-50">
                  {{ selectedSubcategoryName || 'N/A' }}
                </p>
              </template>
            </div>
          </div>

           <div class="flex flex-col space-y-1">
            <label class="block text-sm font-medium text-gray-600">
              Practice Address
              <span v-if="validationState.missingFields.includes('Practice Address')" class="text-red-500 font-bold ml-1">*</span>
            </label>
            <div class="text-sm">
              <template v-if="isEditing">
                 <input
                  type="text"
                  v-model="editableData.practice_address"
                  class="form-input"
                  :class="{'form-invalid': isEditing && validationState.missingFields.includes('Practice Address')}"
                  placeholder="Enter Practice Address"
                  :disabled="isSaving"
                />
              </template>
              <template v-else>
                 <p class="px-3 py-2 rounded-lg bg-gray-50">
                  {{ selectedQualification.practice_address || 'N/A' }}
                </p>
              </template>
            </div>
          </div>

          <div class="flex flex-col space-y-1">
            <label class="block text-sm font-medium text-gray-600">
              Sector
              <span v-if="validationState.missingFields.includes('Sector')" class="text-red-500 font-bold ml-1">*</span>
            </label>
            <div class="text-sm">
              <template v-if="isEditing">
                 <select
                   v-model="editableData.select_sector"
                   class="form-select"
                   :class="{'form-invalid': isEditing && !editableData.select_sector}"
                   :disabled="isSaving"
                 >
                  <option value="" disabled>Select Sector</option>
                  <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                    {{ sector.name }}
                  </option>
                </select>
              </template>
              <template v-else>
                 <p class="px-3 py-2 rounded-lg bg-gray-50">
                  {{ selectedSectorName || 'N/A' }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="errorMessage || (isEditing && !validationState.isValid)"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2"
      >
        <AlertTriangle class="h-5 w-5 text-red-500" />
        <span>
          {{ errorMessage || (isEditing && !validationState.isValid ? `Cannot save: Please fill all required fields (${validationState.missingFields.join(', ')})` : '') }}
        </span>
      </div>

      <!-- Loading indicator during save -->
      <div v-if="isSaving" class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span>Saving changes...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { FileText, Pencil, Check, X, AlertTriangle } from 'lucide-vue-next'
import apiServices from '@/services/services'
import isEqual from 'lodash/isEqual'
import DetailCard from './DetailCard.vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  application: { type: Object, required: true },
  personnelCategories: { type: Array, default: () => [] },
  personnelSubcategories: { type: Array, default: () => [] },
  sectors: { type: Array, default: () => [] },
})

const emit = defineEmits(['update', 'validation-status-changed'])

const isEditing = ref(false)
const isSaving = ref(false) // Add loading state
const selectedQualificationId = ref(null)
const editableData = ref({})
const originalData = ref({})
const errorMessage = ref('')
const toast = useToast()

const selectedQualification = computed(() => {
  if (!selectedQualificationId.value) return null
  return props.application.user_qualifications.find((q) => q.id === selectedQualificationId.value)
})

const validationState = computed(() => {
  const missing = []
  if (!isEditing.value) return { isValid: true, missingFields: [] }

  const q = editableData.value
  if (!q) return { isValid: false, missingFields: ['Data'] }

  if (q.personnel_category === null || q.personnel_category === undefined || q.personnel_category === '') {
    missing.push('Personnel Category')
  }
  if (q.personnel_sub_category === null || q.personnel_sub_category === undefined || q.personnel_sub_category === '') {
    missing.push('Personnel Subcategory')
  }
  if (q.practice_address === null || q.practice_address === undefined || q.practice_address.trim() === '' || q.practice_address.trim().toLowerCase() === 'n/a') {
    missing.push('Practice Address')
  }
  if (q.select_sector === null || q.select_sector === undefined || q.select_sector === '') {
    missing.push('Sector')
  }

  return {
    isValid: missing.length === 0,
    missingFields: missing,
  }
})

const syncDataFromProp = () => {
  if (selectedQualification.value) {
    originalData.value = JSON.parse(JSON.stringify(selectedQualification.value))
    editableData.value = {
      ...originalData.value,
      practice_address: originalData.value.practice_address === 'N/A' ? '' : originalData.value.practice_address
    }
  } else {
    originalData.value = {}
    editableData.value = {}
  }
}

// Watch for the entire application prop to change from the parent
watch(() => props.application, async () => {
  const currentIdIsValid = props.application.user_qualifications.some(q => q.id === selectedQualificationId.value)

  if (!currentIdIsValid) {
    const primary = props.application.user_qualifications.find((q) => q.is_primary_qualification)
    selectedQualificationId.value = primary
      ? primary.id
      : props.application.user_qualifications[0]?.id || null
  }

  syncDataFromProp()
}, { deep: true, immediate: true })

// Watch for when the user MANUALLY selects a different qualification
watch(selectedQualificationId, () => {
  if (!isSaving.value) { // Don't reset during save operations
    syncDataFromProp()
    isEditing.value = false
  }
})

watch(validationState, (newStatus) => {
  emit('validation-status-changed', newStatus)
}, { deep: true, immediate: true })

const startEditing = () => {
  if (!selectedQualificationId.value) {
    errorMessage.value = 'Please select a qualification to edit.'
    toast.error(errorMessage.value)
    return
  }
  errorMessage.value = ''
  isEditing.value = true
  syncDataFromProp()
}

const cancelEditing = () => {
  if (isSaving.value) return // Prevent canceling during save

  isEditing.value = false
  isSaving.value = false
  syncDataFromProp()
  errorMessage.value = ''
}

const saveChanges = async () => {
  if (isSaving.value) return // Prevent double-save

  errorMessage.value = ''
  if (!validationState.value.isValid) {
    errorMessage.value = `Please fill all required fields: ${validationState.value.missingFields.join(', ')}`
    toast.error(errorMessage.value)
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
    toast.info('No changes to save.')
    return
  }

  isSaving.value = true

  try {
    const formData = new FormData()
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key]
        formData.append(key, value === null || value === undefined ? '' : value)
      }
    }

    await apiServices.patchEpcNewQualification(selectedQualificationId.value, formData)

    toast.success('Changes saved successfully.')

    // CRITICAL FIX: Update the actual application prop data with the new values
    // This ensures the frontend shows the updated data immediately
    if (selectedQualification.value) {
      // Update the qualification object directly with the new values
      Object.assign(selectedQualification.value, editableData.value)
    }

    // Update the original data to reflect the saved changes
    originalData.value = { ...editableData.value }

    // Exit edit mode after updating the data
    isEditing.value = false
    isSaving.value = false

    // Notify parent to refresh its data (for consistency)
    emit('update')

  } catch (error) {
    console.error('Error saving changes:', error)
    errorMessage.value = 'Failed to save changes.'
    toast.error(errorMessage.value)

    // Reset saving state on error
    isEditing.value = false
    isSaving.value = false
  }
}

const togglePrimaryQualification = async () => {
  if (!selectedQualificationId.value || !isEditing.value || isSaving.value) {
    if (!isEditing.value) {
      toast.info('Please click the Edit button first to change the primary qualification.');
    }
    return
  }

  errorMessage.value = ''
  isSaving.value = true

  try {
    const newValue = !selectedQualification.value.is_primary_qualification
    const formData = new FormData()
    formData.append('is_primary_qualification', newValue)
    await apiServices.patchEpcNewQualification(selectedQualificationId.value, formData)
    toast.success('Primary qualification updated.')

    // Update the local data immediately
    if (selectedQualification.value) {
      selectedQualification.value.is_primary_qualification = newValue
      // If this qualification is now primary, make sure others are not
      if (newValue) {
        props.application.user_qualifications.forEach(qual => {
          if (qual.id !== selectedQualificationId.value) {
            qual.is_primary_qualification = false
          }
        })
      }
    }

    // Update editable data to stay in sync
    editableData.value.is_primary_qualification = newValue
    originalData.value.is_primary_qualification = newValue

    // Exit saving state immediately after successful API call
    isSaving.value = false

    // Notify parent to refresh
    emit('update')

  } catch (error) {
    console.error('Error toggling primary qualification:', error)
    errorMessage.value = 'Failed to update primary qualification.'
    toast.error(errorMessage.value)
    isSaving.value = false
  }
}

const selectedCategoryName = computed(() => {
  if (!selectedQualification.value) return ''
  const categoryId = selectedQualification.value.personnel_category
  if (categoryId === null || categoryId === undefined) {
    return selectedQualification.value?.personnel_category_name || ''
  }
  const selected = props.personnelCategories.find((cat) => cat.id === parseInt(categoryId, 10))
  return selected ? selected.category_name : ''
})

const selectedSubcategoryName = computed(() => {
  if (!selectedQualification.value) return ''
  const subcategoryId = selectedQualification.value.personnel_sub_category
  if (subcategoryId === null || subcategoryId === undefined) {
    return selectedQualification.value?.personnel_sub_category_name || ''
  }
  const selected = props.personnelSubcategories.find((sub) => sub.id === parseInt(subcategoryId, 10))
  return selected ? selected.sub_category_name : ''
})

const selectedSectorName = computed(() => {
  if (!selectedQualification.value) return ''
  const sectorId = selectedQualification.value.select_sector
  if (sectorId === null || sectorId === undefined) {
    return selectedQualification.value?.select_sector_name || ''
  }
  const selected = props.sectors.find((sector) => sector.id === parseInt(sectorId, 10))
  return selected ? selected.name : ''
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}
</script>

<style scoped>
.btn-icon-subtle {
  @apply p-2 rounded-full hover:bg-gray-100 transition-colors;
}
.btn-icon-success {
  @apply p-2 rounded-full hover:bg-green-100 transition-colors;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
.form-select,
.form-input {
  @apply w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out;
}
.form-invalid {
  @apply border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500;
}
.form-select:disabled,
.form-input:disabled {
  @apply bg-gray-100 cursor-not-allowed opacity-50;
}
</style>