<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
              Assessors Management
            </h1>
            <p class="mt-2 text-gray-600 text-lg">
              Manage HEQC Assessors from the pool
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ assessors.length }} Total Assessors
            </div>
            <button
              @click="openAddModal"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add Assessor
            </button>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            v-model="filterText"
            placeholder="Search assessors by name, CID, email, or specialisation..."
            class="block w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
        <div v-if="filterText" class="mt-4 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Showing {{ filteredAssessors.length }} of {{ assessors.length }} assessors
          </p>
          <button
            @click="filterText = ''"
            class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear filter
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-16">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span class="text-gray-600 font-medium">Loading assessors...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredAssessors.length === 0" class="text-center py-16">
          <div class="mx-auto h-24 w-24 text-gray-300 mb-6">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ assessors.length === 0 ? 'No assessors yet' : 'No matching assessors' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ assessors.length === 0
              ? 'Get started by adding your first assessor to the pool.'
              : 'Try adjusting your search criteria or clear the filter.'
            }}
          </p>
          <button
            v-if="assessors.length === 0"
            @click="openAddModal"
            class="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add First Assessor
          </button>
        </div>

        <!-- Assessors Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Assessor Details
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Specialisation
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  CV
                </th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-50">
              <tr
                v-for="assessor in filteredAssessors"
                :key="assessor.id"
                class="hover:bg-blue-50 transition-all duration-200"
              >
                <!-- Assessor Details -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-12 w-12 flex-shrink-0">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                        <span class="text-lg font-bold text-white">
                          {{ assessor.name?.charAt(0)?.toUpperCase() || '?' }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-bold text-gray-900">{{ assessor.name }}</div>
                      <div class="text-sm text-gray-500 font-mono">{{ assessor.cid }}</div>
                    </div>
                  </div>
                </td>
                <!-- Contact Info -->
                <td class="px-6 py-6">
                  <div class="space-y-1">
                    <div class="text-sm text-gray-900">{{ assessor.email }}</div>
                    <div class="text-sm text-gray-500">{{ assessor.contact_number || 'N/A' }}</div>
                  </div>
                </td>
                <!-- Specialisation -->
                <td class="px-6 py-6">
                  <div class="max-w-xs">
                    <p class="text-sm text-gray-900 line-clamp-2" :title="assessor.relevant_experience_specialization">
                      {{ assessor.relevant_experience_specialization || 'N/A' }}
                    </p>
                  </div>
                </td>
                <!-- Status -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <span :class="[
                    assessor.is_active
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200',
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border'
                  ]">
                    <span :class="[
                      assessor.is_active ? 'bg-green-500' : 'bg-gray-400',
                      'w-2 h-2 rounded-full mr-2'
                    ]"></span>
                    {{ assessor.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <!-- CV Document -->
                <td class="px-6 py-6 whitespace-nowrap">
                  <a
                    v-if="assessor.cv_document_url"
                    :href="assessor.cv_document_url"
                    target="_blank"
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Download
                  </a>
                  <span v-else class="text-sm text-gray-400 italic">No CV uploaded</span>
                </td>
                <!-- Actions -->
                <td class="px-6 py-6 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editAssessor(assessor)"
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="triggerDeleteConfirmation(assessor)"
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Assessor Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
        <!-- Modal positioning -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!-- Modal content -->
        <div class="inline-block align-bottom bg-white rounded-2xl shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form @submit.prevent="saveAssessor">
            <!-- Modal header -->
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-bold text-white" id="modal-title">
                    {{ isEditing ? 'Edit Assessor' : 'Add New Assessor' }}
                  </h3>
                  <p class="text-indigo-100 text-sm mt-1">
                    {{ isEditing ? 'Update assessor information' : 'Add a new assessor to the pool' }}
                  </p>
                </div>
                <button
                  @click="closeModal"
                  type="button"
                  class="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal body -->
            <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- CID (Full Width) -->
                <div class="md:col-span-2">
                  <label for="cid" class="block text-sm font-semibold text-gray-700 mb-2">
                    CID *
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      :value="currentAssessor.cid"
                      @input="handleCIDInput"
                      id="cid"
                      required
                      maxlength="11"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 pr-10"
                      placeholder="Enter 11-digit CID to fetch details"
                    />
                    <div v-if="isFetchingCensusData" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Name -->
                <div class="md:col-span-1">
                  <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    v-model="currentAssessor.name"
                    id="name"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter full name"
                  />
                </div>

                <!-- Email -->
                <div class="md:col-span-1">
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    v-model="currentAssessor.email"
                    id="email"
                    required
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter email address"
                  />
                </div>

                <!-- Contact Number -->
                <div class="md:col-span-2">
                  <label for="contact_number" class="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    v-model="currentAssessor.contact_number"
                    id="contact_number"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter contact number"
                  />
                </div>

                <!-- Qualification -->
                <div class="md:col-span-2">
                  <label for="qualification" class="block text-sm font-semibold text-gray-700 mb-2">
                    Qualification
                  </label>
                  <input
                    type="text"
                    v-model="currentAssessor.qualification"
                    id="qualification"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter qualifications"
                  />
                </div>

                <!-- Specialisation -->
                <div class="md:col-span-2">
                  <label for="specialisation" class="block text-sm font-semibold text-gray-700 mb-2">
                    Relevant Experience/Specialisation
                  </label>
                  <textarea
                    v-model="currentAssessor.relevant_experience_specialization"
                    id="specialisation"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                    placeholder="Describe relevant experience and specialisation areas"
                  ></textarea>
                </div>

                <!-- CV Document -->
                <div class="md:col-span-2">
                  <label for="cv_document" class="block text-sm font-semibold text-gray-700 mb-2">
                    CV Document
                  </label>
                  <div class="relative">
                    <input
                      type="file"
                      @change="handleFileChange"
                      id="cv_document"
                      accept=".pdf,.doc,.docx"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  <p v-if="isEditing && currentAssessor.cv_document_url" class="text-xs text-gray-500 mt-2 p-3 bg-blue-50 rounded-lg">
                    <strong>Current file:</strong>
                    <a :href="currentAssessor.cv_document_url" target="_blank" class="text-indigo-600 hover:text-indigo-800 font-medium">
                      {{ currentAssessor.cv_document_url.split('/').pop() }}
                    </a>
                    <br>
                    Uploading a new file will replace the current one.
                  </p>
                </div>

                <!-- Status -->
                <div class="md:col-span-2">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="currentAssessor.is_active"
                      id="is_active"
                      class="h-5 w-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label for="is_active" class="ml-3 block text-sm font-semibold text-gray-700">
                      Active Status
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 ml-8">
                    Active assessors are available for assignment
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal footer -->
            <div class="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
              <button
                :disabled="isSubmitting"
                type="button"
                class="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                :disabled="isSubmitting"
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save Assessor') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isConfirmModalVisible" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="cancelDelete"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-2xl shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full overflow-hidden">
          <div class="bg-white px-6 pt-6 pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100 sm:mx-0">
                <svg class="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-xl font-bold text-gray-900" id="modal-title">
                  Delete Assessor
                </h3>
                <div class="mt-3">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to permanently delete <strong>'{{ assessorToDelete?.name }}'</strong>?
                    This action cannot be undone and will remove all associated data.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              @click="handleDeleteConfirmation"
              :disabled="isSubmitting"
              type="button"
              class="w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-red-600 text-base font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Deleting...' : 'Delete Assessor' }}
            </button>
            <button
              @click="cancelDelete"
              :disabled="isSubmitting"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-3 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore';

// --- Initialize Toast & Auth Store ---
const toast = useToast();
const authStore = useAuthStore();

// --- State Management ---
const assessors = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const isEditing = ref(false);
const filterText = ref('');

// --- State for the confirmation modal ---
const isConfirmModalVisible = ref(false);
const assessorToDelete = ref(null);

// --- State for Census Fetch ---
const isFetchingCensusData = ref(false);
const isCensusDataFetched = ref(false);

const initialAssessorState = {
  id: null,
  name: '',
  cid: '',
  contact_number: '',
  email: '',
  qualification: '',
  relevant_experience_specialization: '',
  cv_document: null,
  is_active: true,
};
const currentAssessor = ref({ ...initialAssessorState });
const selectedFile = ref(null);

// --- API Calls ---
onMounted(() => {
  loadAssessors();
});

async function loadAssessors() {
  isLoading.value = true;
  try {
    const response = await apiService.getMastersAssessorPools();
    assessors.value = response.data.results || response.data || [];
  } catch (error) {
    console.error('Failed to load assessors:', error);
    toast.error('Could not fetch assessor data. Please try again later.');
    assessors.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function saveAssessor() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const formData = new FormData();
  Object.keys(currentAssessor.value).forEach(key => {
    if (key !== 'cv_document' && key !== 'id' && key !== 'cv_document_url') {
      const value = currentAssessor.value[key];
      formData.append(key, value !== null ? value : '');
    }
  });

  if (selectedFile.value) {
    formData.append('cv_document', selectedFile.value);
  }

  try {
    if (isEditing.value) {
      await apiService.updateMastersAssessor(currentAssessor.value.id, formData);
      toast.success(`Assessor "${currentAssessor.value.name}" updated successfully.`);
    } else {
      await apiService.createMastersAssessor(formData);
      toast.success(`Assessor "${currentAssessor.value.name}" added successfully.`);
    }
    closeModal();
    await loadAssessors();
  } catch (error) {

    console.error('Failed to save assessor:', error.response?.data || error);
    const errorData = error.response?.data;
    let userMessage = 'An unexpected error occurred. Please try again.'; // Default message

    if (errorData) {
      const fieldErrors = [];

      if (errorData.cid) {
        fieldErrors.push('An assessor with this CID already exists.');
      }
      if (errorData.email) {
        fieldErrors.push('An assessor with this email already exists.');
      }
      if (fieldErrors.length > 0) {
        userMessage = fieldErrors.join(' ');
      }

      else if (errorData.detail) {
        userMessage = errorData.detail;
      }

      else {
        userMessage = 'Please review the form for errors and try again.';
      }
    }

    toast.error(userMessage);
  } finally {
    isSubmitting.value = false;
  }
}
// --- Delete Operations ---
function triggerDeleteConfirmation(assessor) {
  assessorToDelete.value = assessor;
  isConfirmModalVisible.value = true;
}

async function handleDeleteConfirmation() {
  if (!assessorToDelete.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await apiService.deleteMastersAssessor(assessorToDelete.value.id);
    toast.success(`Assessor "${assessorToDelete.value.name}" has been deleted.`);
    await loadAssessors();
  } catch (error) {
    const errorDetail = error.response?.data?.detail || "Could not delete the assessor.";
    console.error("Error during deletion:", error);
    toast.error(errorDetail, { timeout: 8000 });
  } finally {
    isSubmitting.value = false;
    cancelDelete();
  }
}

function cancelDelete() {
  isConfirmModalVisible.value = false;
  assessorToDelete.value = null;
}

// --- Modal Controls ---
function openAddModal() {
  isEditing.value = false;
  currentAssessor.value = { ...initialAssessorState };
  selectedFile.value = null;
  isCensusDataFetched.value = false;
  isModalOpen.value = true;
}

function editAssessor(assessor) {
  isEditing.value = true;
  currentAssessor.value = JSON.parse(JSON.stringify(assessor));
  selectedFile.value = null;
  isCensusDataFetched.value = false;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

// --- Watcher for CID changes ---
watch(() => currentAssessor.value.cid, (newCid, oldCid) => {
  if (isModalOpen.value && newCid !== oldCid && isCensusDataFetched.value) {
    currentAssessor.value.name = '';
    currentAssessor.value.email = '';
    currentAssessor.value.contact_number = '';
    isCensusDataFetched.value = false;
  }
});

// --- Census Data Fetching ---
async function handleCIDInput(event) {
  const input = event.target.value.replace(/\D/g, '');
  currentAssessor.value.cid = input.slice(0, 11);

  if (currentAssessor.value.cid.length < 11) {
    isCensusDataFetched.value = false;
  }

  if (currentAssessor.value.cid.length === 11) {
    await fetchCensusData();
  }
}

async function fetchCensusData() {
  if (isFetchingCensusData.value) return;

  const userId = authStore.userId;

  if (!userId) {
    toast.error("Authentication error: User ID not found. Please log in again.");
    return;
  }

  isFetchingCensusData.value = true;
  try {
    const response = await apiService.fetchCitizenDetails(
      currentAssessor.value.cid,
      { params: { user_id: userId } }
    );
    const data = response.data;

    if (data) {
      if (data.applicants_name) {
        currentAssessor.value.name = data.applicants_name;
      }
      if (data.email) {
        currentAssessor.value.email = data.email;
      }
      if (data.contact_no) {
        currentAssessor.value.contact_number = data.contact_no;
      }
      isCensusDataFetched.value = true;
      toast.success('Assessor details fetched successfully.');
    } else {
      isCensusDataFetched.value = false;
      toast.warning('No data found for this CID. Please enter details manually.');
    }
  } catch (error) {
    console.error('Failed to fetch census data:', error);
    const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Could not fetch data for this CID.';
    toast.error(errorMessage);
    isCensusDataFetched.value = false;
  } finally {
    isFetchingCensusData.value = false;
  }
}

// --- Event Handlers & Computed ---
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
}

const filteredAssessors = computed(() => {
  const validAssessors = assessors.value.filter(assessor => assessor);
  if (!filterText.value) {
    return validAssessors;
  }
  const filter = filterText.value.toLowerCase().trim();
  return validAssessors.filter((assessor) =>
    (assessor.name?.toLowerCase() || '').includes(filter) ||
    (assessor.cid?.toLowerCase() || '').includes(filter) ||
    (assessor.email?.toLowerCase() || '').includes(filter) ||
    (assessor.relevant_experience_specialization?.toLowerCase() || '').includes(filter)
  );
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>