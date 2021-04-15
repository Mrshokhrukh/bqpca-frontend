<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Create CPD Application</h2>
        <p class="text-gray-600">Complete the form below to submit your CPD application</p>
      </div>

      <form @submit.prevent="submitApplication" class="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <!-- Personal Details Section -->
        <div class="bg-gray-50 p-4 rounded-md">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <CheckCircle class="w-5 h-5 mr-2 text-blue-500" />
            Personal Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                v-model="registrationNumber"
                type="text"
                readonly
                class="mt-1 bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >CID No./Identity/Work Permit No.</label
              >
              <input
                v-model="cidNumber"
                type="text"
                readonly
                class="mt-1 bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                v-model="fullName"
                type="text"
                readonly
                class="mt-1 bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <input
                v-model="gender"
                type="text"
                readonly
                class="mt-1 bg-gray-100 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- CPD Details Section -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-700 flex items-center">
            <CheckCircle class="w-5 h-5 mr-2 text-blue-500" />
            CPD Details
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Title of CPD</label>
              <input
                v-model="title"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter CPD title"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Relevance to Profession</label>
              <textarea
                v-model="relevance"
                rows="4"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe how this CPD is relevant to your profession"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Participation Category</label>
              <select
                v-model="participationCategory"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Online Course">Online Course</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Participant Sub-Category</label
              >
              <select
                v-model="participantSubCategory"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select sub-category</option>
                <option value="Beginner">Beginner</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Type of CPD Activity</label>
              <select
                v-model="cpdActivityType"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select activity type</option>
                <option value="Training">Training</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Duration (in hours)</label>
              <input
                v-model="duration"
                type="number"
                required
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Credits</label>
              <input
                v-model="credits"
                type="number"
                required
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700">Attachment</label>
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              >
                <div class="space-y-1 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label
                      class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input type="file" @change="handleFileUpload" required class="sr-only" />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="saveDraft"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle } from 'lucide-vue-next'

const registrationNumber = ref('PMLT165')
const cidNumber = ref('CID123456')
const fullName = ref('Doji Ishering')
const gender = ref('Male')
const title = ref('')
const relevance = ref('')
const participationCategory = ref('')
const participantSubCategory = ref('')
const cpdActivityType = ref('')
const duration = ref(0)
const credits = ref(0)
const file = ref(null)

const submitApplication = () => {
  alert('Application submitted successfully!')
}

const saveDraft = () => {
  alert('Application saved as draft.')
}

const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}
</script>

<style scoped>
.create-application {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>
