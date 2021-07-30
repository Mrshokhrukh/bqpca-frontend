<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full transform transition-all">
      <h3 class="text-xl font-bold text-gray-900 mb-2">Renew Institute Registration</h3>

      <div v-if="institute" class="p-3 bg-gray-50 rounded-lg mb-6 border border-gray-200">
        <p class="text-sm font-medium text-gray-800">{{ institute.name_of_institution }}</p>
        <p class="text-xs text-gray-500">
          Current Validity Expires On: {{ formatDateSafely(institute.valid_till) }}
        </p>
      </div>

      <p class="text-sm text-gray-500 mb-6">
        To initiate the renewal process, please upload a supporting document and add any relevant remarks.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- File Upload -->
          <div>
            <label for="renewal-document" class="block text-sm font-medium text-gray-700">
              Renewal Document <span class="text-red-500">*</span>
            </label>
            <div
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div class="space-y-1 text-center">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label
                    for="renewal-document"
                    class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="renewal-document"
                      name="renewal-document"
                      type="file"
                      class="sr-only"
                      @change="handleFileChange"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">PDF, DOC, JPG, etc. up to 5MB</p>
              </div>
            </div>
            <p v-if="fileName" class="mt-2 text-sm text-green-600">File selected: {{ fileName }}</p>
            <p v-if="fileError" class="mt-2 text-sm text-red-600">{{ fileError }}</p>
          </div>

          <!-- Remarks -->
          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Remarks (Optional)</label
            >
            <textarea
              id="remarks"
              v-model="remarks"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Add any relevant remarks for the reviewing officer..."
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!renewalFile || isSubmitting"
          >
            <Loader v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5" />
            {{ isSubmitting ? 'Submitting...' : 'Submit Renewal Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  institute: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'renewal-submitted'])

const toast = useToast()
const renewalFile = ref(null)
const fileName = ref('')
const remarks = ref('')
const isSubmitting = ref(false)
const fileError = ref('')

const formatDateSafely = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  fileError.value = ''
  if (!file) {
    renewalFile.value = null
    fileName.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    fileError.value = 'File is too large. Maximum size is 5MB.'
    renewalFile.value = null
    fileName.value = ''
    event.target.value = '' 
    return
  }
  renewalFile.value = file
  fileName.value = file.name
}

const handleSubmit = async () => {
  if (!renewalFile.value) {
    fileError.value = 'Please select a document to upload.'
    return
  }
  isSubmitting.value = true
  fileError.value = ''

  const formData = new FormData()

  formData.append('renewal_document', renewalFile.value)


  formData.append('user_remarks', remarks.value)


  try {

    await apiServices.createInstituteRenewal(props.institute.CID, formData)

    toast.success('Renewal application submitted successfully!')
    emit('renewal-submitted')
    emit('close')
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      (Array.isArray(error.response?.data) && error.response.data[0]) ||
      'Failed to submit renewal application. Please try again.'
    toast.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}
</script>