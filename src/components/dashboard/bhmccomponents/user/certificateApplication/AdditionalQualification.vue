<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 class="text-2xl font-bold mb-8 text-center text-gray-800">
                Additional Qualification Application
              </h2>

              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Qualification Type -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Qualification Type
                  </label>
                  <select
                    v-model="formData.qualificationType"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Qualification Type</option>
                    <option value="degree">Degree</option>
                    <option value="diploma">Diploma</option>
                    <option value="certificate">Certificate</option>
                  </select>
                </div>

                <!-- Institution Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    v-model="formData.institutionName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <!-- Completion Date -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    v-model="formData.completionDate"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <!-- Document Upload -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Upload Certificate
                  </label>
                  <input
                    type="file"
                    @change="handleFileUpload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    class="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                    required
                  />
                </div>

                <!-- Submit Button -->
                <div class="pt-5">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {{ loading ? 'Submitting...' : 'Submit Application' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const loading = ref(false)
const formData = ref({
  qualificationType: '',
  institutionName: '',
  completionDate: '',
  certificate: null
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB')
      event.target.value = ''
      return
    }
    formData.value.certificate = file
  }
}

const submitForm = async () => {
  try {
    loading.value = true

    // Create form data for file upload
    const submitData = new FormData()
    submitData.append('qualificationType', formData.value.qualificationType)
    submitData.append('institutionName', formData.value.institutionName)
    submitData.append('completionDate', formData.value.completionDate)
    submitData.append('certificate', formData.value.certificate)

    // TODO: Add your API call here
    // await axios.post('/api/additional-qualification', submitData)

    toast.success('Application submitted successfully')

    // Reset form
    formData.value = {
      qualificationType: '',
      institutionName: '',
      completionDate: '',
      certificate: null
    }

  } catch (error) {
    toast.error('Error submitting application')
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
