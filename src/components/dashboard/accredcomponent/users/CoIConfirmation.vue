<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto p-6">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-t-xl p-8 mb-6"
        >
          <h2 class="text-3xl font-bold text-gray-900 text-center">
            Conflict of Interest Confirmation
          </h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">
            Review the assigned assessors and confirm the absence of any conflicts of interest for
            each assessor. You can declare a conflict, provide remarks, and upload supporting
            documents if necessary.
          </p>
        </div>

        <!-- Assessors List as Table -->
        <div class="p-8">
          <div v-if="loading" class="text-center text-gray-600 py-4">Loading assessors...</div>
          <div v-else-if="assessors.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Affiliation
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Specialization
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="assessor in assessors" :key="assessor.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ assessor.name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ assessor.affiliation }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ assessor.specialization }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <div v-if="assessor.coiStatus === 'Pending' || assessor.coiStatus === null">
                        <button
                          @click="confirmNoConflict(assessor)"
                          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors mr-2 text-xs"
                        >
                          No Conflict
                        </button>
                        <button
                          @click="declareConflict(assessor)"
                          class="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-md transition-colors text-xs"
                        >
                          Conflict
                        </button>
                      </div>
                      <div
                        v-else
                        class="text-sm text-gray-700"
                        :class="{
                          'text-green-600': assessor.coiStatus === 'No Conflict',
                          'text-red-600': assessor.coiStatus === 'Conflict',
                        }"
                      >
                        {{ assessor.coiStatus }} Confirmed
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center text-gray-600 py-4">
            No assessors assigned for this application yet.
          </div>
        </div>

        <!-- Conflict Details Section (moved outside table for better structure, but can be within table row if preferred) -->
        <div v-if="selectedAssessorForConflict" class="p-8 border-t mt-4 rounded-md bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            Declare Conflict of Interest for: {{ selectedAssessorForConflict.name }}
          </h3>

          <div class="mb-4">
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Remarks (Reason for Conflict):</label
            >
            <textarea
              id="remarks"
              v-model="selectedAssessorForConflict.conflictRemarks"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="supporting-doc" class="block text-sm font-medium text-gray-700"
              >Supporting Document (Optional):</label
            >
            <input
              type="file"
              id="supporting-doc"
              @change="handleFileUpload"
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div class="flex justify-end">
            <button
              @click="cancelConflictDeclaration"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors mr-2 text-sm"
            >
              Cancel
            </button>
            <button
              @click="submitConflictDeclaration"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
            >
              Submit Conflict Declaration
            </button>
          </div>
        </div>

        <!-- Confirmation Message -->
        <div v-if="coiConfirmationSubmitted" class="p-8 border-t text-center text-gray-700">
          <p>COI Confirmation Submitted Successfully!</p>
          <!-- You can display a summary of COI decisions here if needed -->
        </div>

        <!-- Submit All COI Confirmation Button -->
        <div
          v-if="assessors.length > 0 && !coiConfirmationSubmitted && !selectedAssessorForConflict"
          class="p-8 border-t"
        >
          <div class="flex justify-end">
            <button
              @click="submitAllCoiConfirmation"
              :disabled="!isCoiDecisionsMadeForAll"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': !isCoiDecisionsMadeForAll }"
            >
              Submit COI Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const assessors = ref([])
const loading = ref(true)
const selectedAssessorForConflict = ref(null) // To track which assessor's conflict details are being entered
const coiConfirmationSubmitted = ref(false)

const fetchAssessors = async () => {
  setTimeout(() => {
    assessors.value = [
      {
        id: 1,
        name: 'Dr. Alice Smith',
        affiliation: 'University A',
        specialization: 'Curriculum Development',
        coiStatus: null,
        conflictRemarks: '',
        supportingDocument: null,
      },
      {
        id: 2,
        name: 'Prof. Bob Johnson',
        affiliation: 'Consulting Firm B',
        specialization: 'Quality Assurance',
        coiStatus: null,
        conflictRemarks: '',
        supportingDocument: null,
      },
      {
        id: 3,
        name: 'Dr. Charlie Davis',
        affiliation: 'Research Institute C',
        specialization: 'Institutional Effectiveness',
        coiStatus: null,
        conflictRemarks: '',
        supportingDocument: null,
      },
    ]
    loading.value = false
  }, 500)
}

const confirmNoConflict = (assessor) => {
  assessor.coiStatus = 'No Conflict'
  assessor.conflictRemarks = '' // Clear remarks if any
  assessor.supportingDocument = null // Clear document if any
  selectedAssessorForConflict.value = null // Hide conflict details section if it was open
}

const declareConflict = (assessor) => {
  selectedAssessorForConflict.value = assessor
  // Initialize remarks and document if needed, or leave them to be entered.
}

const cancelConflictDeclaration = () => {
  selectedAssessorForConflict.value = null // Just close the conflict details section
}

const submitConflictDeclaration = () => {
  if (selectedAssessorForConflict.value) {
    selectedAssessorForConflict.value.coiStatus = 'Conflict'
    console.log(
      'Conflict declared for:',
      selectedAssessorForConflict.value.name,
      'Reason:',
      selectedAssessorForConflict.value.conflictRemarks,
      'Document:',
      selectedAssessorForConflict.value.supportingDocument,
    )
    selectedAssessorForConflict.value = null // Close the conflict details section after submission.
  }
}

const handleFileUpload = (event) => {
  if (selectedAssessorForConflict.value) {
    const file = event.target.files[0]
    selectedAssessorForConflict.value.supportingDocument = file // Store the File object
    // In a real application, you might want to upload the file immediately or handle it upon form submission.
    console.log('File uploaded:', file.name)
  }
}

const isCoiDecisionsMadeForAll = computed(() => {
  return assessors.value.every((assessor) => assessor.coiStatus !== null)
})

const submitAllCoiConfirmation = () => {
  if (isCoiDecisionsMadeForAll.value) {
    coiConfirmationSubmitted.value = true
    console.log('Final COI Confirmation Submitted:', assessors.value)
    // Here you would typically send the 'assessors.value' array with COI statuses, remarks, and documents to your backend.
  }
}

onMounted(fetchAssessors)
</script>
