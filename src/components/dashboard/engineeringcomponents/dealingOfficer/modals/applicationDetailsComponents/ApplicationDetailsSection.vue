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
              :disabled="!validationState.isValid"
            >
              <Check class="h-5 w-5 text-green-600 hover:text-green-800" />
            </button>
            <button
              @click="cancelEditing"
              class="btn-icon-subtle hover:bg-red-50 transition-colors"
              title="Cancel Editing"
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
              :disabled="!selectedQualification || !isEditing"
              :class="{
                'bg-blue-500 text-white':
                  selectedQualification && selectedQualification.is_primary_qualification,
                'bg-gray-200 text-gray-700':
                  !isEditing ||
                  !selectedQualification ||
                  !selectedQualification.is_primary_qualification,
                'opacity-50 cursor-not-allowed': !selectedQualification || !isEditing,
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
                <select v-model="editableData.personnel_category" class="form-select" :class="{'form-invalid': isEditing && !editableData.personnel_category}">
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
                 <select v-model="editableData.personnel_sub_category" class="form-select" :class="{'form-invalid': isEditing && !editableData.personnel_sub_category}">
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
                 <select v-model="editableData.select_sector" class="form-select" :class="{'form-invalid': isEditing && !editableData.select_sector}">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
  if (!selectedQualification.value) {
    return { isValid: false, missingFields: [] }
  }
  const q = editableData.value // Use editableData for validation during editing

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

watch(validationState, (newStatus) => {
  emit('validation-status-changed', newStatus)
}, { deep: true, immediate: true })

watch(selectedQualification, (newVal) => {
  if (newVal) {
    originalData.value = JSON.parse(JSON.stringify(newVal))
    editableData.value = {
      ...newVal,
      practice_address: newVal.practice_address === 'N/A' ? '' : newVal.practice_address
    }
  } else {
    originalData.value = {}
    editableData.value = {}
  }
  isEditing.value = false
}, { deep: true })

watch(() => props.application, (newVal) => {
  if (newVal && newVal.user_qualifications) {
    const primary = newVal.user_qualifications.find((q) => q.is_primary_qualification)
    selectedQualificationId.value = primary
      ? primary.id
      : newVal.user_qualifications[0]?.id || null
  }
}, { deep: true, immediate: true })

const startEditing = () => {
  if (!selectedQualificationId.value) {
    errorMessage.value = 'Please select a qualification to edit.'
    toast.error(errorMessage.value)
    return
  }
  errorMessage.value = ''
  isEditing.value = true
  editableData.value = {
    ...originalData.value,
    practice_address: originalData.value.practice_address === 'N/A' ? '' : originalData.value.practice_address
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editableData.value = { ...originalData.value }
  errorMessage.value = ''
}

const saveChanges = async () => {
  errorMessage.value = ''
  if (!selectedQualificationId.value) {
    errorMessage.value = 'Please select a qualification to edit.'
    toast.error(errorMessage.value)
    return
  }
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

  try {
    const formData = new FormData()
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key]
        formData.append(key, value === null || value === undefined ? '' : value)
      }
    }

    await apiServices.patchEpcNewQualification(selectedQualificationId.value, formData)
    isEditing.value = false
    toast.success('Changes saved successfully.')
    emit('update')
  } catch (error) {
    console.error('Error saving changes:', error)
    errorMessage.value = 'Failed to save changes.'
    toast.error(errorMessage.value)
  }
}

const togglePrimaryQualification = async () => {
  if (!selectedQualificationId.value) {
    errorMessage.value = 'Please select a qualification first.'
    toast.error(errorMessage.value)
    return
  }
  errorMessage.value = ''
  try {
    const newValue = !selectedQualification.value.is_primary_qualification
    const formData = new FormData()
    formData.append('is_primary_qualification', newValue)
    await apiServices.patchEpcNewQualification(selectedQualificationId.value, formData)
    toast.success('Primary qualification updated.')
    emit('update')
  } catch (error) {
    console.error('Error toggling primary qualification:', error)
    errorMessage.value = 'Failed to update primary qualification.'
    toast.error(errorMessage.value)
  }
}

const selectedCategoryName = computed(() => {
  if (!selectedQualification.value || !selectedQualification.value.personnel_category) {
    return ''
  }
  const categoryId = parseInt(selectedQualification.value.personnel_category, 10)
  const selected = props.personnelCategories.find((cat) => cat.id === categoryId)
  return selected ? selected.category_name : ''
})

const selectedSubcategoryName = computed(() => {
  if (!selectedQualification.value || !selectedQualification.value.personnel_sub_category) {
    return ''
  }
  const subcategoryId = parseInt(selectedQualification.value.personnel_sub_category, 10)
  const selected = props.personnelSubcategories.find((sub) => sub.id === subcategoryId)
  return selected ? selected.sub_category_name : ''
})

const selectedSectorName = computed(() => {
  if (!selectedQualification.value || !selectedQualification.value.select_sector) {
    return ''
  }
  const sectorId = parseInt(selectedQualification.value.select_sector, 10)
  const selected = props.sectors.find((sector) => sector.id === sectorId)
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
</style>