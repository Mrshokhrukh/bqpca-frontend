<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Assessor Pool Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Assessor Profile' : 'Add New Assessor Profile' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="assessor" class="block text-sm font-medium text-slate-700 mb-1"
                    >Assessor</label
                  >
                  <select
                    id="assessor"
                    v-model="formData.assessor"
                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Assessor</option>
                    <!-- Add your assessor options here -->
                  </select>
                </div>
                <div>
                  <label
                    for="institution_profile"
                    class="block text-sm font-medium text-slate-700 mb-1"
                    >Institution Profile</label
                  >
                  <select
                    id="institution_profile"
                    v-model="formData.institution_profile"
                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Institution</option>
                    <!-- Add your institution options here -->
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1"
                    >Conflict of Interest</label
                  >
                  <div class="mt-2">
                    <label class="inline-flex items-center">
                      <input
                        type="checkbox"
                        v-model="formData.conflict_of_interest"
                        class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span class="ml-2 text-slate-700 text-sm"
                        >Yes, there is a conflict of interest</span
                      >
                    </label>
                  </div>
                </div>
                <div>
                  <label for="report" class="block text-sm font-medium text-slate-700 mb-1"
                    >Assessor's Report</label
                  >
                  <input
                    id="report"
                    type="file"
                    @change="handleFileUpload"
                    accept=".pdf"
                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
                </div>
              </div>

              <div>
                <label for="remarks" class="block text-sm font-medium text-slate-700 mb-1"
                  >Remarks</label
                >
                <textarea
                  id="remarks"
                  v-model="formData.remarks"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter remarks"
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Profile' : 'Add Profile' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right Column - Data Table -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Assessor Profiles List</h2>
              <span class="text-sm text-slate-500">
                {{ assessors.length }} Profile{{ assessors.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Assessors Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Assessor ID
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Institution ID
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Conflict of Interest
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Remarks
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Report
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr
                  v-for="assessor in assessors"
                  :key="assessor.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                    {{ assessor.assessor }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                    {{ assessor.institution_profile }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="{
                        'px-2 py-1 text-xs font-semibold rounded-full': true,
                        'bg-red-100 text-red-800': assessor.conflict_of_interest,
                        'bg-green-100 text-green-800': !assessor.conflict_of_interest,
                      }"
                    >
                      {{ assessor.conflict_of_interest ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-3 py-4 text-sm text-slate-700">
                    <p class="line-clamp-2">{{ assessor.remarks }}</p>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <a
                      v-if="assessor.assessors_report"
                      :href="assessor.assessors_report"
                      target="_blank"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View Report
                    </a>
                    <span v-else class="text-slate-500">No report</span>
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editAssessor(assessor)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(assessor.id)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="assessors.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-slate-500">
                    No assessors found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
            <button
              @click="currentPage > 1 && fetchAssessors(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage < totalPages && fetchAssessors(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="showDeleteModal" @update:open="showDeleteModal = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the assessor profile.
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel
              class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="showDeleteModal = false"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="deleteAssessor"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
        <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/services'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue'

// State
const assessors = ref([])
const formData = ref({
  assessor: '',
  institution_profile: '',
  conflict_of_interest: false,
  remarks: '',
  assessors_report: null,
})
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const errorMessage = ref('')

// Methods
const fetchAssessors = async (page = 1) => {
  try {
    const response = await api.getProfileAssessors()
    assessors.value = response.data.results
    totalPages.value = Math.ceil(response.data.count / 10) // Assuming 10 items per page
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching assessors:', error)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      errorMessage.value = 'File is too large. Maximum size is 5MB.';
      formData.value.assessors_report = null;
      event.target.value = ''; // Reset the file input
      return;
    }
    formData.value.assessors_report = file
    errorMessage.value = ''; // Clear error on successful selection
  }
}

const handleSubmit = async () => {
  try {
    const submitData = new FormData()
    for (const [key, value] of Object.entries(formData.value)) {
      if (value !== null) {
        submitData.append(key, value)
      }
    }

    if (isEditing.value) {
      await api.updateProfileAssessor(editingId.value, submitData)
    } else {
      await api.createProfileAssessor(submitData)
    }
    resetForm()
    fetchAssessors()
  } catch (error) {
    console.error('Error saving assessor:', error)
  }
}

const editAssessor = (assessor) => {
  formData.value = {
    assessor: assessor.assessor,
    institution_profile: assessor.institution_profile,
    conflict_of_interest: assessor.conflict_of_interest,
    remarks: assessor.remarks,
    assessors_report: null, // Reset file input
  }
  isEditing.value = true
  editingId.value = assessor.id
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  formData.value = {
    assessor: '',
    institution_profile: '',
    conflict_of_interest: false,
    remarks: '',
    assessors_report: null,
  }
  isEditing.value = false
  editingId.value = null
}

const confirmDelete = (id) => {
  deleteId.value = id
  showDeleteModal.value = true
}

const deleteAssessor = async () => {
  try {
    await api.deleteProfileAssessor(deleteId.value)
    showDeleteModal.value = false
    deleteId.value = null
    fetchAssessors()
  } catch (error) {
    console.error('Error deleting assessor:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchAssessors()
})
</script>

<style scoped></style>
