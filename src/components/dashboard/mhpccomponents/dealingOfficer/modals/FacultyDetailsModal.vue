<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-xl font-bold text-gray-800">Faculty Details</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">×</button>
      </div>

      <!-- Modal Body -->
      <div v-if="editableFaculty" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <!-- Displaying Faculty Information -->
          <div class="col-span-1">
            <h4 class="font-semibold text-gray-700 mb-2">Personal Information</h4>
            <dl class="space-y-2 text-sm">
              <div><dt class="font-medium text-gray-500">Name</dt><dd class="text-gray-900">{{ editableFaculty.faculty_name }}</dd></div>
              <div><dt class="font-medium text-gray-500">CID / Reg. No.</dt><dd class="text-gray-900">{{ editableFaculty.cid || editableFaculty.registration_no || 'N/A' }}</dd></div>
              <div><dt class="font-medium text-gray-500">Contact</dt><dd class="text-gray-900">{{ editableFaculty.contact_no }}</dd></div>
            </dl>
          </div>
          <div class="col-span-1">
            <h4 class="font-semibold text-gray-700 mb-2">Professional Information</h4>
            <dl class="space-y-2 text-sm">
              <div><dt class="font-medium text-gray-500">Type</dt><dd class="text-gray-900 capitalize">{{ editableFaculty.faculty_type }}</dd></div>
              <div><dt class="font-medium text-gray-500">Designation</dt><dd class="text-gray-900">{{ editableFaculty.designation }}</dd></div>
              <div><dt class="font-medium text-gray-500">Date of Joining</dt><dd class="text-gray-900">{{ formatDate(editableFaculty.date_of_joining) }}</dd></div>
              <div v-if="editableFaculty.cv"><dt class="font-medium text-gray-500">CV</dt><dd><a :href="editableFaculty.cv" target="_blank" class="text-blue-600 hover:underline">View Document</a></dd></div>
            </dl>
          </div>

          <!-- Remarks Section for Dealing Officer -->
          <div class="md:col-span-2 mt-4">
            <label for="officer_remarks" class="block text-sm font-bold text-gray-800 mb-1">Officer Remarks (Optional)</label>
            <textarea
              id="officer_remarks"
              v-model="editableFaculty.officer_remarks"
              rows="4"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Add internal remarks here..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end items-center p-4 bg-gray-50 border-t">
        <button @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
        <button
          @click="saveRemarks"
          :disabled="isSaving"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
        >
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ isSaving ? 'Saving...' : 'Save Remarks' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'

const props = defineProps({
  isVisible: Boolean,
  faculty: Object,
})

const emit = defineEmits(['close', 'update'])

const toast = useToast()
const isSaving = ref(false)

// Create a local, deep-copy of the prop to avoid direct mutation
const editableFaculty = ref(null)

watch(() => props.faculty, (newVal) => {
  if (newVal) {
    editableFaculty.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true, deep: true })

const closeModal = () => {
  if (!isSaving.value) {
    emit('close')
  }
}

const saveRemarks = async () => {
  if (!editableFaculty.value) return

  isSaving.value = true
  try {
    // We only need to send the field that is being changed
    const payload = {
      officer_remarks: editableFaculty.value.officer_remarks || ''
    }
    const response = await apiServices.patchMhpcTeachingFaculty(editableFaculty.value.id, payload)

    toast.success('Faculty remarks updated successfully.')
    emit('update', response.data) // Send the full updated object back to the parent
    emit('close')

  } catch (error) {
    console.error('Error updating faculty remarks:', error)
    toast.error(error.response?.data?.detail || 'Failed to save remarks.')
  } finally {
    isSaving.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>