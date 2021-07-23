<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto p-6">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-t-xl p-8 mb-6"
        >
          <h2 class="text-3xl font-bold text-gray-900 text-center">Accreditation Result Input</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">
            Enter the accreditation decision, grade, key findings by selecting from Standards, Key
            Aspects, and Indicators, and upload the assessor's report.
          </p>
        </div>

        <div class="p-8">
          <form @submit.prevent="handleSubmit">
            <!-- Accreditation Decision -->
            <div class="mb-6">
              <label for="accreditationDecision" class="block text-sm font-medium text-gray-700"
                >Accreditation Decision</label
              >
              <select
                id="accreditationDecision"
                v-model="formData.accreditationDecision"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">-- Select Decision --</option>
                <option value="Approved">Approved</option>
                <option value="Not Approved">Not Approved</option>
              </select>
            </div>

            <!-- Grade (if Approved) -->
            <div v-if="formData.accreditationDecision === 'Approved'" class="mb-6">
              <label for="grade" class="block text-sm font-medium text-gray-700"
                >Grade / Rating (if Approved)</label
              >
              <select
                id="grade"
                v-model="formData.grade"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">-- Select Grade --</option>
                <option v-for="grade in grades" :key="grade.value" :value="grade.value">
                  {{ grade.label }}
                </option>
              </select>
            </div>

            <!-- Validity Date (if Approved) -->
            <div v-if="formData.accreditationDecision === 'Approved'" class="mb-6">
              <label for="validityDate" class="block text-sm font-medium text-gray-700"
                >Validity Date (if Approved)</label
              >
              <input
                type="date"
                id="validityDate"
                v-model="formData.validityDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Assessor's Report Upload -->
            <div class="mb-6">
              <label for="assessorReportFile" class="block text-sm font-medium text-gray-700"
                >Upload Assessor's Report</label
              >
              <input
                type="file"
                id="assessorReportFile"
                @change="handleFileUpload"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p v-if="formData.assessorReportFile" class="mt-1 text-sm text-gray-500">
                Selected file: {{ formData.assessorReportFile.name }}
              </p>
            </div>

            <!-- Findings from Assessor's Report (Dropdowns) -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">
                Key Findings from Assessor's Report
              </h3>

              <div class="mb-4">
                <label for="standard" class="block text-sm font-medium text-gray-700"
                  >Standard</label
                >
                <select
                  id="standard"
                  v-model="formData.standard"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select Standard --</option>
                  <option
                    v-for="standard in standards"
                    :key="standard.value"
                    :value="standard.value"
                  >
                    {{ standard.label }}
                  </option>
                </select>
              </div>

              <div class="mb-4">
                <label for="keyAspect" class="block text-sm font-medium text-gray-700"
                  >Key Aspect</label
                >
                <select
                  id="keyAspect"
                  v-model="formData.keyAspect"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select Key Aspect --</option>
                  <option
                    v-for="keyAspect in keyAspects"
                    :key="keyAspect.value"
                    :value="keyAspect.value"
                  >
                    {{ keyAspect.label }}
                  </option>
                </select>
              </div>

              <div>
                <label for="indicator" class="block text-sm font-medium text-gray-700"
                  >Indicator</label
                >
                <select
                  id="indicator"
                  v-model="formData.indicator"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select Indicator --</option>
                  <option
                    v-for="indicator in indicators"
                    :key="indicator.value"
                    :value="indicator.value"
                  >
                    {{ indicator.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Reason (if Not Approved) -->
            <div v-if="formData.accreditationDecision === 'Not Approved'" class="mb-6">
              <label for="rejectionReason" class="block text-sm font-medium text-gray-700"
                >Reason for Not Accredited</label
              >
              <textarea
                id="rejectionReason"
                v-model="formData.rejectionReason"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 sm:text-sm"
              ></textarea>
            </div>

            <!-- Remarks (if Any) -->
            <div class="mb-6">
              <label for="remarks" class="block text-sm font-medium text-gray-700"
                >Remarks (if Any)</label
              >
              <textarea
                id="remarks"
                v-model="formData.remarks"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 sm:text-sm"
              ></textarea>
            </div>

            <div class="border-t border-gray-200 pt-5">
              <div class="flex justify-end">
                <button
                  type="button"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Results
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiService from '@/services/accreditationservices'

const applicationId = ref(1) // Placeholder: Replace with actual application ID
const assessorId = ref(1) // Placeholder: Replace with actual assessor ID

// Mock data for grades, standards, key aspects, indicators (replace with actual data fetching)
const grades = ref([
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Satisfactory', label: 'Satisfactory' },
  { value: 'Needs Improvement', label: 'Needs Improvement' },
])

const standards = ref([
  { value: 'Standard1', label: 'Standard 1: Mission and Goals' },
  { value: 'Standard2', label: 'Standard 2: Curriculum and Instruction' },
  { value: 'Standard3', label: 'Standard 3: Faculty and Staff' },
  // ... more standards
])

const keyAspects = ref([
  { value: 'KeyAspect1A', label: 'Key Aspect 1.A: Clarity of Mission' },
  { value: 'KeyAspect1B', label: 'Key Aspect 1.B: Alignment of Goals' },
  { value: 'KeyAspect2A', label: 'Key Aspect 2.A: Curriculum Design' },
  // ... more key aspects
])

const indicators = ref([
  { value: 'Indicator1Ai', label: 'Indicator 1.A.i: Mission Statement is Publicly Available' },
  { value: 'Indicator1Aii', label: 'Indicator 1.A.ii: Mission Statement is Regularly Reviewed' },
  { value: 'Indicator2Ai', label: 'Indicator 2.A.i: Curriculum is Regularly Updated' },
  // ... more indicators
])

const formData = ref({
  accreditationDecision: '',
  grade: '',
  validityDate: null,
  assessorReportFile: null,
  standard: '',
  keyAspect: '',
  indicator: '',
  rejectionReason: '',
  remarks: '',
})

const handleFileUpload = (event) => {
  formData.value.assessorReportFile = event.target.files[0]
}

const handleSubmit = async () => {
  if (!formData.value.assessorReportFile) {
    alert('Please upload an assessor report file.')
    return
  }

  const data = new FormData()
  data.append('application', applicationId.value)
  data.append('assessor', assessorId.value)
  data.append('report_file', formData.value.assessorReportFile)
  data.append('remarks', formData.value.remarks)

  try {
    await apiService.uploadAssessorReport(data)
    alert('Assessor report submitted successfully!')
    // Optionally, reset form or navigate
  } catch (error) {
    console.error('Error submitting assessor report:', error)
    alert('Failed to submit assessor report. Please try again.')
  }
}
</script>
