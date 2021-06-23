<template>
  <div class="education-program-management p-4 md:p-8 bg-gray-50 min-h-screen">
    <div class="mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Education Program Master Management</h1>
      </header>

      <div class="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Search Input -->
        <div class="relative w-full sm:w-72">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search program masters by name"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
          />
        </div>
        <!-- Add Program Button -->
        <button
          @click="openAddProgramModal"
          class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 inline-block mr-2 -ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Add New Program Master
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && !programs.length" class="text-center py-10">
        <svg
          class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-600">Loading program masters...</p>
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        role="alert"
      >
        <p class="font-bold">Error</p>
        <p>{{ error }}</p>
      </div>

      <!-- Programs Table -->
      <div
        v-if="!isLoading || programs.length"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Program Master Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration (Years)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!isLoading && filteredPrograms.length === 0 && !error">
                <td
                  colspan="4"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No program masters found.
                  {{
                    searchQuery
                      ? 'Try adjusting your search.'
                      : 'Click "Add New Program Master" to create one.'
                  }}
                </td>
              </tr>
              <tr
                v-for="program in filteredPrograms"
                :key="program.id"
                class="hover:bg-gray-50 transition ease-in-out duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ program.name }}
                </td>
                <td
                  class="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-md"
                  :title="program.description"
                >
                  <span class="truncate-multiline">{{ program.description }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ program.duration_years ?? 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                  <button
                    @click="openEditProgramModal(program)"
                    class="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                    title="Edit Program Master"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 inline-block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    @click="confirmDeleteProgram(program.id)"
                    class="text-red-600 hover:text-red-900 focus:outline-none"
                    title="Delete Program Master"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 inline-block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Program Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeModal">
            <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
          </div>

          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          </span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <form @submit.prevent="handleModalSubmit">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <svg
                      class="h-6 w-6 text-indigo-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                      {{ modalTitle }}
                    </h3>
                    <div class="mt-4 space-y-4">
                      <div v-if="modalError" class="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                        {{ modalError }}
                      </div>
                      <div>
                        <label for="programName" class="block text-sm font-medium text-gray-700"
                          >Program Master Name <span class="text-red-500">*</span></label
                        >
                        <input
                          type="text"
                          id="programName"
                          v-model.trim="modalForm.name"
                          required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          :class="{ 'border-red-500': modalFormErrors.name }"
                        />
                        <p v-if="modalFormErrors.name" class="mt-1 text-xs text-red-500">
                          {{ modalFormErrors.name }}
                        </p>
                      </div>
                      <div>
                        <label
                          for="programDescription"
                          class="block text-sm font-medium text-gray-700"
                          >Description <span class="text-red-500">*</span></label
                        >
                        <textarea
                          id="programDescription"
                          v-model.trim="modalForm.description"
                          required
                          rows="4"
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          :class="{ 'border-red-500': modalFormErrors.description }"
                        ></textarea>
                        <p v-if="modalFormErrors.description" class="mt-1 text-xs text-red-500">
                          {{ modalFormErrors.description }}
                        </p>
                      </div>
                      <div>
                        <label for="programDuration" class="block text-sm font-medium text-gray-700"
                          >Duration (Years) <span class="text-red-500">*</span></label
                        >
                        <input
                          type="number"
                          id="programDuration"
                          v-model.number="modalForm.duration_years"
                          required
                          min="0"
                          step="0.5"
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          :class="{ 'border-red-500': modalFormErrors.duration_years }"
                        />
                        <p v-if="modalFormErrors.duration_years" class="mt-1 text-xs text-red-500">
                          {{ modalFormErrors.duration_years }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{
                    isSubmitting
                      ? 'Saving...'
                      : modalForm.id
                      ? 'Save Changes'
                      : 'Create Program Master'
                  }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isSubmitting"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiServices from '@/services/services' // Ensure this path is correct

export default {
  name: 'EducationProgramManagement',
  data() {
    return {
      programs: [],
      searchQuery: '',
      isModalOpen: false,
      modalTitle: 'Add New Program Master',
      modalForm: { id: null, name: '', description: '', duration_years: null },
      modalFormErrors: { name: null, description: null, duration_years: null },
      isLoading: false,
      isSubmitting: false,
      error: null,
      modalError: null,
    }
  },
  computed: {
    filteredPrograms() {
      if (!this.searchQuery) {
        return this.programs
      }
      return this.programs.filter(
        (program) =>
          program.name && program.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
  },
  methods: {
    async fetchPrograms() {
      this.isLoading = true
      this.error = null
      try {
        const response = await apiServices.getMhpcProgramMasters()
        console.log('Full API response object for getMhpcProgramMasters:', response)

        let programsArray = []
        if (response && Array.isArray(response.data)) {
          programsArray = response.data
        } else if (response && response.data && Array.isArray(response.data.results)) {
          programsArray = response.data.results
        } else if (response && response.data && Array.isArray(response.data.data)) {
          programsArray = response.data.data
        } else if (response && response.data && Array.isArray(response.data.items)) {
          programsArray = response.data.items
        } else if (response && Array.isArray(response)) {
          programsArray = response
        } else {
          console.error(
            'Fetched program master data is not in a recognized array format:',
            response
          )
          this.error =
            'Failed to load program masters: Unexpected data format from server. Check console for details.'
          this.programs = []
          this.isLoading = false
          return
        }

        this.programs = programsArray.map((program) => {
          console.log('Raw program master object from API:', program)
          return {
            id: program.id,
            name: program.name ?? program.program_name ?? 'Unnamed Program',
            description: program.description ?? program.program_description ?? 'No Description',
            duration_years: program.duration_years ?? null,
          }
        })
      } catch (err) {
        console.error('Error fetching program masters:', err)
        let errorMessage = 'Failed to load program masters.'
        if (err.response && err.response.data) {
          errorMessage += ` Server: ${JSON.stringify(
            err.response.data.detail || err.response.data.message || err.response.data
          )}`
        } else if (err.message) {
          errorMessage += ` Details: ${err.message}`
        }
        this.error = errorMessage
        this.programs = []
      } finally {
        this.isLoading = false
      }
    },

    openAddProgramModal() {
      this.modalTitle = 'Add New Program Master'
      this.modalForm = { id: null, name: '', description: '', duration_years: null }
      this.modalFormErrors = { name: null, description: null, duration_years: null }
      this.isModalOpen = true
      this.modalError = null
      this.error = null
    },

    openEditProgramModal(program) {
      this.modalTitle = 'Edit Program Master'
      this.modalForm = { ...program }
      this.modalFormErrors = { name: null, description: null, duration_years: null }
      this.isModalOpen = true
      this.modalError = null
      this.error = null
    },

    validateModalForm() {
      this.modalFormErrors = { name: null, description: null, duration_years: null }
      let isValid = true
      if (!this.modalForm.name || this.modalForm.name.trim() === '') {
        this.modalFormErrors.name = 'Program Master name is required.'
        isValid = false
      }
      if (!this.modalForm.description || this.modalForm.description.trim() === '') {
        this.modalFormErrors.description = 'Description is required.'
        isValid = false
      }
      if (
        this.modalForm.duration_years === null ||
        this.modalForm.duration_years === '' ||
        this.modalForm.duration_years < 0
      ) {
        this.modalFormErrors.duration_years =
          'Duration is required and must be a non-negative number.'
        isValid = false
      }
      return isValid
    },

    async handleModalSubmit() {
      if (!this.validateModalForm()) {
        return
      }
      this.isSubmitting = true
      this.modalError = null
      this.modalFormErrors = { name: null, description: null, duration_years: null }

      const payload = {
        program_name: this.modalForm.name,
        description: this.modalForm.description,
        duration_years: this.modalForm.duration_years,
      }
      console.log('Payload sent to API:', payload)

      try {
        if (this.modalForm.id) {
          await apiServices.updateMhpcProgramMaster(this.modalForm.id, payload)
        } else {
          await apiServices.createMhpcProgramMaster(payload)
        }
        this.closeModal()
        await this.fetchPrograms()
      } catch (err) {
        console.error('Error saving program master:', err)
        console.error('API error response:', err.response)
        let submissionError = `Failed to ${this.modalForm.id ? 'update' : 'create'} program master.`
        if (err.response && err.response.data) {
          const backendErrors = err.response.data
          if (typeof backendErrors === 'object') {
            if (backendErrors.program_name && Array.isArray(backendErrors.program_name)) {
              this.modalFormErrors.name = backendErrors.program_name.join(' ')
            }
            if (backendErrors.description && Array.isArray(backendErrors.description)) {
              this.modalFormErrors.description = backendErrors.description.join(' ')
            }
            if (backendErrors.duration_years && Array.isArray(backendErrors.duration_years)) {
              this.modalFormErrors.duration_years = backendErrors.duration_years.join(' ')
            }
            let generalMessages = []
            if (backendErrors.detail) generalMessages.push(backendErrors.detail)
            if (backendErrors.message) generalMessages.push(backendErrors.message)
            for (const key in backendErrors) {
              if (
                !['program_name', 'description', 'duration_years', 'detail', 'message'].includes(
                  key
                ) &&
                Array.isArray(backendErrors[key])
              ) {
                generalMessages.push(`${key}: ${backendErrors[key].join(', ')}`)
              } else if (
                !['program_name', 'description', 'duration_years', 'detail', 'message'].includes(
                  key
                )
              ) {
                generalMessages.push(`${key}: ${backendErrors[key]}`)
              }
            }
            if (generalMessages.length > 0) {
              submissionError += ` ${generalMessages.join('; ')}`
            } else if (
              !this.modalFormErrors.name &&
              !this.modalFormErrors.description &&
              !this.modalFormErrors.duration_years
            ) {
              submissionError += ` Server error: ${JSON.stringify(backendErrors)}`
            }
          } else {
            submissionError += ` Server said: ${backendErrors}`
          }
        } else if (err.message) {
          submissionError += ` Details: ${err.message}`
        }
        this.modalError = submissionError
      } finally {
        this.isSubmitting = false
      }
    },

    confirmDeleteProgram(id) {
      if (
        window.confirm(
          'Are you sure you want to delete this program master? This action cannot be undone.'
        )
      ) {
        this.deleteProgram(id)
      }
    },

    async deleteProgram(id) {
      this.error = null
      try {
        await apiServices.deleteMhpcProgramMaster(id)
        await this.fetchPrograms()
      } catch (err) {
        console.error('Error deleting program master:', err)
        let deleteError = 'Failed to delete program master.'
        if (
          err.response &&
          err.response.data &&
          (err.response.data.detail || err.response.data.message)
        ) {
          deleteError += ` Server said: ${err.response.data.detail || err.response.data.message}`
        } else if (err.message) {
          deleteError += ` Details: ${err.message}`
        }
        this.error = deleteError
      }
    },

    closeModal() {
      this.isModalOpen = false
      this.modalForm = { id: null, name: '', description: '', duration_years: null }
      this.modalFormErrors = { name: null, description: null, duration_years: null }
      this.modalError = null
    },
  },
  mounted() {
    this.fetchPrograms()
  },
}
</script>

<style scoped>
.education-program-management {
  /* Main container already has padding via Tailwind */
}

/* Custom scrollbar for table (optional) */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* For multi-line truncation with ellipsis */
.truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.5em;
  line-height: 1.25em;
}
</style>
