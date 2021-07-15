<template>
  <div class="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <!-- Notification System -->
    <Transition name="notification">
      <div
        v-if="notification.show"
        :class="[
          'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
          notification.type === 'success'
            ? 'bg-green-50 border-l-4 border-green-500'
            : notification.type === 'error'
              ? 'bg-red-50 border-l-4 border-red-500'
              : 'bg-blue-50 border-l-4 border-blue-500',
        ]"
      >
        <!-- Notification Icon -->
        <div
          :class="[
            'flex-shrink-0 w-6 h-6',
            notification.type === 'success'
              ? 'text-green-500'
              : notification.type === 'error'
                ? 'text-red-500'
                : 'text-blue-500',
          ]"
        >
          <svg
            v-if="notification.type === 'success'"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else-if="notification.type === 'error'"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <!-- Notification Text -->
        <div class="ml-3">
          <h3
            :class="[
              'text-sm font-medium',
              notification.type === 'success'
                ? 'text-green-800'
                : notification.type === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800',
            ]"
          >
            {{ notification.title }}
          </h3>
          <p
            :class="[
              'text-sm mt-1',
              notification.type === 'success'
                ? 'text-green-700'
                : notification.type === 'error'
                  ? 'text-red-700'
                  : 'text-blue-700',
            ]"
          >
            {{ notification.message }}
          </p>
        </div>
        <!-- Notification Close Button -->
        <button @click="closeNotification" class="ml-4 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <div class="mx-auto w-full">
      <!-- Use DOPageHeader Component -->
      <DOPageHeader
        title="Manage CPD Providers"
        description="Add, view, and manage registered CPD providers."
        :show-controls="false"
        :search-query="searchQuery"
        @update:searchQuery="searchQuery = $event"
        search-placeholder="Search providers..."
        :filter-value="statusFilter"
        @update:filterValue="statusFilter = $event"
        :filter-options="statusFilterOptions"
      >
        <!-- Slot for custom actions like the Add Provider button -->
        <template #actions>
          <button
            @click="openAddProviderModal"
            class="inline-flex items-center bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium shadow-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 -ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Provider
          </button>
        </template>
      </DOPageHeader>

      <!-- Removed Old Header -->
      <!-- Removed Old Add Provider Button Section -->

      <!-- Search and Filter (Handled by DOPageHeader now) -->
      <!-- Add optional additional filters here if needed, separate from the header -->
      <!-- Example:
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
         <h3 class="text-lg font-medium text-gray-800 mb-3">Filters</h3>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
           </div>
      </div>
      -->

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm mt-6 border border-gray-200"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading providers...</span>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredProviders.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200 mt-6"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
        <h3 class="mt-2 text-base font-medium text-gray-900">No Providers Found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            providers.length > 0
              ? 'No providers match your current search.'
              : 'No CPD providers have been added yet.'
          }}
        </p>
        <div class="mt-6">
          <button
            type="button"
            @click="openAddProviderModal"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add New Provider
          </button>
        </div>
      </div>

      <!-- Providers Table Card -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mt-6">
        <!-- Removed inner heading "CPD Providers List" as it's redundant with page header -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Provider Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(provider, index) in paginatedProviders"
                :key="provider.id || index"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ provider.full_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ provider.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ provider.contact_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {{ provider.gender }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      provider.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ provider.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center space-x-3">
                    <button
                      @click="openEditProviderModal(provider)"
                      class="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit Provider"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="confirmDeleteProvider(provider)"
                      class="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Provider"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
          v-if="totalPages > 1"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredProviders.length }}</span> results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <span
                  aria-current="page"
                  class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ currentPage }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Provider Modal -->
      <div
        v-if="isAddProviderModalOpen"
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          ></span>
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
          >
            <div class="sm:flex sm:items-start w-full">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                  Add New CPD Provider
                </h3>
                <form @submit.prevent="submitProvider" class="space-y-4">
                  <!-- Basic Information -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="add-first-name" class="block text-sm font-medium text-gray-700"
                        >First Name <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-first-name"
                        type="text"
                        v-model="formData.first_name"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label for="add-middle-name" class="block text-sm font-medium text-gray-700"
                        >Middle Name</label
                      >
                      <input
                        id="add-middle-name"
                        type="text"
                        v-model="formData.middle_name"
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label for="add-last-name" class="block text-sm font-medium text-gray-700"
                        >Last Name <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-last-name"
                        type="text"
                        v-model="formData.last_name"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                  </div>

                  <!-- Gender & DOB -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Gender <span class="text-red-500">*</span></label
                      >
                      <select
                        id="add-gender"
                        v-model="formData.gender"
                        required
                        class="mt-1 block w-full form-select"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label for="add-dob" class="block text-sm font-medium text-gray-700"
                        >Date of Birth <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-dob"
                        type="date"
                        v-model="formData.date_of_birth"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="add-contact" class="block text-sm font-medium text-gray-700"
                        >Contact Number <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-contact"
                        type="tel"
                        v-model="formData.contact_number"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label for="add-email" class="block text-sm font-medium text-gray-700"
                        >Email <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-email"
                        type="email"
                        v-model="formData.email"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                  </div>

                  <!-- Password Fields -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="add-password" class="block text-sm font-medium text-gray-700"
                        >Password <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-password"
                        type="password"
                        v-model="formData.password"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label
                        for="add-confirm-password"
                        class="block text-sm font-medium text-gray-700"
                        >Confirm Password <span class="text-red-500">*</span></label
                      >
                      <input
                        id="add-confirm-password"
                        type="password"
                        v-model="formData.confirm_password"
                        required
                        class="mt-1 block w-full form-input"
                      />
                      <p
                        v-if="
                          formData.password &&
                          formData.confirm_password &&
                          formData.password !== formData.confirm_password
                        "
                        class="text-xs text-red-500 mt-1"
                      >
                        Passwords do not match.
                      </p>
                    </div>
                  </div>

                  <!-- Provider Specific (Removed cpdActivityTitle and venue as per API) -->

                  <!-- Modal Actions -->
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeAddProviderModal"
                      class="modal-cancel-button"
                    >
                      Cancel
                    </button>
                    <button type="submit" class="modal-confirm-button" :disabled="!isAddFormValid">
                      Add Provider
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Provider Modal -->
      <div
        v-if="isEditProviderModalOpen"
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="edit-modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          ></span>
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
          >
            <div class="sm:flex sm:items-start w-full">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="edit-modal-title">
                  Edit CPD Provider
                </h3>
                <form @submit.prevent="updateProvider" class="space-y-4">
                  <!-- Basic Information -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label for="edit-first-name" class="block text-sm font-medium text-gray-700"
                        >First Name <span class="text-red-500">*</span></label
                      >
                      <input
                        id="edit-first-name"
                        type="text"
                        v-model="editFormData.first_name"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label for="edit-middle-name" class="block text-sm font-medium text-gray-700"
                        >Middle Name</label
                      >
                      <input
                        id="edit-middle-name"
                        type="text"
                        v-model="editFormData.middle_name"
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label for="edit-last-name" class="block text-sm font-medium text-gray-700"
                        >Last Name <span class="text-red-500">*</span></label
                      >
                      <input
                        id="edit-last-name"
                        type="text"
                        v-model="editFormData.last_name"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                  </div>

                  <!-- Gender & DOB -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Gender <span class="text-red-500">*</span></label
                      >
                      <select
                        id="edit-gender"
                        v-model="editFormData.gender"
                        required
                        class="mt-1 block w-full form-select"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label for="edit-dob" class="block text-sm font-medium text-gray-700"
                        >Date of Birth <span class="text-red-500">*</span></label
                      >
                      <input
                        id="edit-dob"
                        type="date"
                        v-model="editFormData.date_of_birth"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="edit-contact" class="block text-sm font-medium text-gray-700"
                        >Contact Number <span class="text-red-500">*</span></label
                      >
                      <input
                        id="edit-contact"
                        type="tel"
                        v-model="editFormData.contact_number"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                    <div>
                      <label for="edit-email" class="block text-sm font-medium text-gray-700"
                        >Email <span class="text-red-500">*</span></label
                      >
                      <input
                        id="edit-email"
                        type="email"
                        v-model="editFormData.email"
                        required
                        class="mt-1 block w-full form-input"
                      />
                    </div>
                  </div>

                  <!-- Provider Specific (Removed as per API) -->

                  <!-- Modal Actions -->
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeEditProviderModal"
                      class="modal-cancel-button"
                    >
                      Cancel
                    </button>
                    <button type="submit" class="modal-confirm-button" :disabled="!isEditFormValid">
                      Update Provider
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="isDeleteConfirmModalOpen"
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="delete-confirm-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          ></span>
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          >
            <div>
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
              >
                <svg
                  class="h-6 w-6 text-red-600"
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="delete-confirm-title">
                  Delete Provider
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete provider "{{ providerToDelete?.full_name }}"?
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                @click="deleteProviderConfirmed"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                @click="closeDeleteConfirmModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Import the header

const toast = useToast()

// Notification state
const notification = ref({
  show: false,
  type: '', // 'success', 'error', 'info'
  title: '',
  message: '',
  timeout: null,
})

const isAddProviderModalOpen = ref(false)
const isEditProviderModalOpen = ref(false)
const isDeleteConfirmModalOpen = ref(false)
const editingProvider = ref(null) // Store the whole provider object being edited
const providerToDelete = ref(null) // Store the provider object to delete

const isLoading = ref(false)
const providers = ref([]) // Stores all fetched providers
const searchQuery = ref('') // For DOPageHeader search
const statusFilter = ref('') // For potential future filtering (value bound to DOPageHeader filterValue)

// Dummy options for header filter (adjust if needed later)
const statusFilterOptions = ref([
  { value: '', text: 'All Statuses' },
  { value: 'active', text: 'Active' },
  { value: 'inactive', text: 'Inactive' },
])

// Form state for adding
const formData = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'cme_cpd_provider',
  service_type: 'health_certification',
  // Provider specific fields removed as they seem handled by user registration
})

// Form state for editing
const editFormData = reactive({
  id: null, // Keep track of the ID
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  is_active: true, // Add status field if you need to edit it
  // Provider specific fields removed
})

// Validation computed properties
const isAddFormValid = computed(() => {
  return (
    formData.first_name &&
    formData.last_name &&
    formData.gender &&
    formData.date_of_birth &&
    formData.contact_number &&
    formData.email &&
    formData.password &&
    formData.confirm_password &&
    formData.password === formData.confirm_password
  )
})

const isEditFormValid = computed(() => {
  return (
    editFormData.first_name &&
    editFormData.last_name &&
    editFormData.gender &&
    editFormData.date_of_birth &&
    editFormData.contact_number &&
    editFormData.email
  )
})

// Filtered and Paginated Data
const filteredProviders = computed(() => {
  let filtered = providers.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.contact_number?.includes(query),
    )
  }
  if (statusFilter.value) {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter((p) => p.is_active === isActive)
  }
  return filtered
})

const currentPage = ref(1)
const pageSize = ref(10) // Number of items per page

const totalPages = computed(() => Math.ceil(filteredProviders.value.length / pageSize.value) || 1)
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value)
const paginationEnd = computed(() =>
  Math.min(paginationStart.value + pageSize.value, filteredProviders.value.length),
)

const paginatedProviders = computed(() => {
  return filteredProviders.value.slice(paginationStart.value, paginationEnd.value)
})

// Reset page when filters change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

// Methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const openAddProviderModal = () => {
  // Reset form data
  Object.keys(formData).forEach((key) => {
    if (!['role', 'service_type'].includes(key)) formData[key] = ''
  })
  isAddProviderModalOpen.value = true
}

const closeAddProviderModal = () => {
  isAddProviderModalOpen.value = false
}

const submitProvider = async () => {
  if (!isAddFormValid.value) {
    toast.error('Please fill all required fields and ensure passwords match.')
    return
  }

  try {
    isLoading.value = true // Indicate loading during submission
    // The payload contains user registration data, role indicates it's a provider
    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name || null, // Send null if empty
      last_name: formData.last_name,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      contact_number: formData.contact_number,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      role: formData.role,
      service_type: formData.service_type,
      is_active: true, // Assuming new providers are active by default
    }

    await apiService.register(payload) // Use the user registration endpoint
    await fetchProviders() // Refresh the providers list

    toast.success('Provider added successfully!')
    closeAddProviderModal()
  } catch (error) {
    console.error('Registration error:', error)
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Registration failed. Please try again.'
    toast.error(errorMsg)
  } finally {
    isLoading.value = false
  }
}

const openEditProviderModal = (provider) => {
  editingProvider.value = provider
  // Populate edit form data from the selected provider
  editFormData.id = provider.id
  editFormData.first_name = provider.first_name
  editFormData.middle_name = provider.middle_name || ''
  editFormData.last_name = provider.last_name
  editFormData.gender = provider.gender
  editFormData.date_of_birth = provider.date_of_birth // Ensure correct format if needed
  editFormData.contact_number = provider.contact_number
  editFormData.email = provider.email
  editFormData.is_active = provider.is_active
  // Reset other fields if they existed before
  // editFormData.cpdActivityTitle = provider.cpdActivityTitle || ''; // Removed
  // editFormData.venue = provider.venue || ''; // Removed

  isEditProviderModalOpen.value = true
}

const closeEditProviderModal = () => {
  isEditProviderModalOpen.value = false
  editingProvider.value = null
}

const updateProvider = async () => {
  if (!isEditFormValid.value || !editingProvider.value) {
    toast.error('Please fill all required fields.')
    return
  }

  try {
    isLoading.value = true
    // Use the user update endpoint (assuming PUT or PATCH on /users/{id}/)
    // Adjust the endpoint and payload based on your actual API structure
    const updatePayload = {
      first_name: editFormData.first_name,
      middle_name: editFormData.middle_name || null,
      last_name: editFormData.last_name,
      gender: editFormData.gender,
      date_of_birth: editFormData.date_of_birth,
      contact_number: editFormData.contact_number,
      email: editFormData.email,
      is_active: editFormData.is_active,
      // We don't update role or service type here usually
    }

    // Assuming your API service has a method like updateUser(id, payload)
    await apiService.updateUser(editingProvider.value.id, updatePayload)

    await fetchProviders() // Refresh list to show changes
    toast.success('Provider updated successfully!')
    closeEditProviderModal()
  } catch (error) {
    console.error('Update error:', error)
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Update failed. Please try again.'
    toast.error(errorMsg)
  } finally {
    isLoading.value = false
  }
}

const confirmDeleteProvider = (provider) => {
  providerToDelete.value = provider
  isDeleteConfirmModalOpen.value = true
}

const closeDeleteConfirmModal = () => {
  isDeleteConfirmModalOpen.value = false
  providerToDelete.value = null
}

const deleteProviderConfirmed = async () => {
  if (!providerToDelete.value) return

  try {
    isLoading.value = true
    // Assuming API service has a method like deleteUser(id)
    await apiService.deleteUser(providerToDelete.value.id)

    await fetchProviders() // Refresh list
    toast.success('Provider deleted successfully!')
  } catch (error) {
    console.error('Delete error:', error)
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Delete failed. Please try again.'
    toast.error(errorMsg)
  } finally {
    isLoading.value = false
    closeDeleteConfirmModal()
  }
}

// Load initial data
const fetchProviders = async () => {
  isLoading.value = true
  try {
    const response = await apiService.getAllUsers()

    if (response && response.data && Array.isArray(response.data.results)) {
      providers.value = response.data.results
        // 1. First, keep only users with the 'health_certification' service type.
        .filter((user) => user.service_type === 'health_certification')

        // 2. From that group, keep only users with the 'cme_cpd_provider' role.
        .filter((user) => user.role === 'cme_cpd_provider')

        // 3. Finally, format the remaining users for display.
        .map((user) => ({
          ...user,
          full_name: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`
            .replace(/\s+/g, ' ')
            .trim(),
        }))
    } else {
      console.error('Unexpected API response structure:', response)
      providers.value = []
    }
  } catch (error) {
    console.error('Error fetching providers:', error)
    toast.error('Failed to load providers. Please try again.')
    providers.value = []
  } finally {
    isLoading.value = false
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) clearTimeout(notification.value.timeout)
  notification.value.timeout = null
}

// Fetch providers when component mounts
onMounted(fetchProviders)
</script>

<style scoped>
/* Basic Input Styling */
.form-input,
.form-select {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  background-color: #ffffff; /* white */
  font-size: 0.875rem; /* 14px */
}
.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); /* ring-blue-500 */
}

/* Modal Button Styling */
.modal-confirm-button {
  display: inline-flex;
  justify-content: center;
  border-radius: 0.375rem; /* rounded-md */
  border: 1px solid transparent;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0.5rem 1rem; /* py-2 px-4 */
  background-color: #2563eb; /* bg-blue-600 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: white;
  transition: background-color 0.15s ease-in-out;
}
.modal-confirm-button:hover {
  background-color: #1d4ed8; /* hover:bg-blue-700 */
}
.modal-confirm-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 */
}
.modal-confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-cancel-button {
  display: inline-flex;
  justify-content: center;
  border-radius: 0.375rem; /* rounded-md */
  border: 1px solid #d1d5db; /* border-gray-300 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0.5rem 1rem; /* py-2 px-4 */
  background-color: white;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #374151; /* text-gray-700 */
  transition: background-color 0.15s ease-in-out;
}
.modal-cancel-button:hover {
  background-color: #f9fafb; /* hover:bg-gray-50 */
}
.modal-cancel-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */
}

/* Notification Animation */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Align text left in table cells by default */
td {
  text-align: left;
}
td:nth-child(5),
td:nth-child(6) {
  /* Status and Actions columns */
  text-align: center;
}
th {
  text-align: left;
}
th:nth-child(5),
th:nth-child(6) {
  /* Status and Actions headers */
  text-align: center;
}
</style>
