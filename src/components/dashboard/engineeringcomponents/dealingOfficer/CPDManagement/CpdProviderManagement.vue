<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">Manage CPD Providers</h2>
        <p class="text-xl text-gray-600">
          View, add, edit, and delete Continuing Professional Development providers.
        </p>
      </div>

      <!-- Add Provider Button -->
      <div class="flex justify-end mb-6">
        <button
          @click="openAddProviderModal"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
        >
          <svg
            class="-ml-1 mr-3 h-5 w-5"
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
          Add Provider
        </button>
      </div>

      <!-- Providers Table Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="px-6 py-5 sm:px-8 border-b border-gray-200">
          <h3 class="text-2xl leading-6 font-semibold text-gray-900">CPD Providers List</h3>
          <p class="mt-1 text-sm text-gray-500">A list of all registered CPD providers.</p>
        </div>
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
                  Contact Number
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
                  CPD Activity Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Venue
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="providers.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No providers found.
                </td>
              </tr>
              <tr
                v-for="(provider, index) in providers"
                :key="provider.id || index"
                class="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ `${provider.first_name || ''} ${provider.last_name || ''}`.trim() }}
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
                  {{ provider.cpdActivityTitle || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ provider.venue || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button
                      @click="openEditProviderModal(index)"
                      class="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteProvider(index)"
                      class="text-red-600 hover:text-red-900 transition-colors duration-150 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
          <!-- Background overlay -->
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          </span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <form @submit.prevent="submitProvider">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 class="text-xl leading-6 font-semibold text-gray-900 mb-6" id="modal-title">
                      Add New CPD Provider
                    </h3>
                    <div class="space-y-6">
                      <!-- Basic Information -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Personal Information
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                          <div>
                            <label
                              for="add-first-name"
                              class="block text-sm font-medium text-gray-700"
                              >First Name <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="add-first-name"
                              v-model="formData.first_name"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="add-middle-name"
                              class="block text-sm font-medium text-gray-700"
                              >Middle Name</label
                            >
                            <input
                              type="text"
                              id="add-middle-name"
                              v-model="formData.middle_name"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="add-last-name"
                              class="block text-sm font-medium text-gray-700"
                              >Last Name <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="add-last-name"
                              v-model="formData.last_name"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <!-- Gender Selection -->
                      <fieldset>
                        <legend class="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span class="text-red-500">*</span>
                        </legend>
                        <div class="flex items-center space-x-4">
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              v-model="formData.gender"
                              value="male"
                              required
                              name="add-gender"
                              class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span class="ml-2 text-gray-700">Male</span>
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              v-model="formData.gender"
                              value="female"
                              name="add-gender"
                              class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span class="ml-2 text-gray-700">Female</span>
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              v-model="formData.gender"
                              value="other"
                              name="add-gender"
                              class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span class="ml-2 text-gray-700">Other</span>
                          </label>
                        </div>
                      </fieldset>

                      <!-- Contact Information -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Contact Details
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label for="add-dob" class="block text-sm font-medium text-gray-700"
                              >Date of Birth <span class="text-red-500">*</span></label
                            >
                            <input
                              type="date"
                              id="add-dob"
                              v-model="formData.date_of_birth"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label for="add-contact" class="block text-sm font-medium text-gray-700"
                              >Contact Number <span class="text-red-500">*</span></label
                            >
                            <input
                              type="tel"
                              id="add-contact"
                              v-model="formData.contact_number"
                              required
                              placeholder="e.g., 09171234567"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <!-- Account Credentials -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Account Credentials
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label for="add-email" class="block text-sm font-medium text-gray-700"
                              >Email <span class="text-red-500">*</span></label
                            >
                            <input
                              type="email"
                              id="add-email"
                              v-model="formData.email"
                              required
                              autocomplete="email"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div></div>
                          <!-- Spacer -->
                          <div>
                            <label
                              for="add-password"
                              class="block text-sm font-medium text-gray-700"
                              >Password <span class="text-red-500">*</span></label
                            >
                            <input
                              type="password"
                              id="add-password"
                              v-model="formData.password"
                              required
                              autocomplete="new-password"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="add-confirm-password"
                              class="block text-sm font-medium text-gray-700"
                              >Confirm Password <span class="text-red-500">*</span></label
                            >
                            <input
                              type="password"
                              id="add-confirm-password"
                              v-model="formData.confirm_password"
                              required
                              autocomplete="new-password"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <!-- Provider Details -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Provider Activity Details
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label
                              for="add-cpd-title"
                              class="block text-sm font-medium text-gray-700"
                              >CPD Activity Title <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="add-cpd-title"
                              v-model="formData.cpdActivityTitle"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label for="add-venue" class="block text-sm font-medium text-gray-700"
                              >Venue <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="add-venue"
                              v-model="formData.venue"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition ease-in-out duration-150"
                >
                  Add Provider
                </button>
                <button
                  type="button"
                  @click="closeAddProviderModal"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition ease-in-out duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Provider Modal -->
      <div
        v-if="isEditProviderModalOpen"
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Background overlay -->
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          </span>
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <form @submit.prevent="updateProvider">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 class="text-xl leading-6 font-semibold text-gray-900 mb-6" id="modal-title">
                      Edit CPD Provider
                    </h3>
                    <div class="space-y-6">
                      <!-- Basic Information -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Personal Information
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                          <div>
                            <label
                              for="edit-first-name"
                              class="block text-sm font-medium text-gray-700"
                              >First Name <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="edit-first-name"
                              v-model="editFormData.first_name"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="edit-middle-name"
                              class="block text-sm font-medium text-gray-700"
                              >Middle Name</label
                            >
                            <input
                              type="text"
                              id="edit-middle-name"
                              v-model="editFormData.middle_name"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="edit-last-name"
                              class="block text-sm font-medium text-gray-700"
                              >Last Name <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="edit-last-name"
                              v-model="editFormData.last_name"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <!-- Gender Selection -->
                      <fieldset>
                        <legend class="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span class="text-red-500">*</span>
                        </legend>
                        <div class="flex items-center space-x-4">
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              v-model="editFormData.gender"
                              value="male"
                              required
                              name="edit-gender"
                              class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span class="ml-2 text-gray-700">Male</span>
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              v-model="editFormData.gender"
                              value="female"
                              name="edit-gender"
                              class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span class="ml-2 text-gray-700">Female</span>
                          </label>
                          <label class="inline-flex items-center">
                            <input
                              type="radio"
                              v-model="editFormData.gender"
                              value="other"
                              name="edit-gender"
                              class="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span class="ml-2 text-gray-700">Other</span>
                          </label>
                        </div>
                      </fieldset>

                      <!-- Contact Information -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Contact Details
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label for="edit-dob" class="block text-sm font-medium text-gray-700"
                              >Date of Birth <span class="text-red-500">*</span></label
                            >
                            <input
                              type="date"
                              id="edit-dob"
                              v-model="editFormData.date_of_birth"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="edit-contact"
                              class="block text-sm font-medium text-gray-700"
                              >Contact Number <span class="text-red-500">*</span></label
                            >
                            <input
                              type="tel"
                              id="edit-contact"
                              v-model="editFormData.contact_number"
                              required
                              placeholder="e.g., 09171234567"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>

                      <!-- Email (Often not editable or requires special handling) -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Account Email
                        </legend>
                        <div>
                          <label for="edit-email" class="block text-sm font-medium text-gray-700"
                            >Email <span class="text-red-500">*</span></label
                          >
                          <input
                            type="email"
                            id="edit-email"
                            v-model="editFormData.email"
                            required
                            autocomplete="email"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                            readonly
                          />
                          <p class="mt-1 text-xs text-gray-500">
                            Email cannot be changed directly. Contact support if needed.
                          </p>
                        </div>
                      </fieldset>

                      <!-- Provider Details -->
                      <fieldset>
                        <legend class="text-base font-medium text-gray-900 mb-2">
                          Provider Activity Details
                        </legend>
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label
                              for="edit-cpd-title"
                              class="block text-sm font-medium text-gray-700"
                              >CPD Activity Title <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="edit-cpd-title"
                              v-model="editFormData.cpdActivityTitle"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label for="edit-venue" class="block text-sm font-medium text-gray-700"
                              >Venue <span class="text-red-500">*</span></label
                            >
                            <input
                              type="text"
                              id="edit-venue"
                              v-model="editFormData.venue"
                              required
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition ease-in-out duration-150"
                >
                  Update Provider
                </button>
                <button
                  type="button"
                  @click="closeEditProviderModal"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition ease-in-out duration-150"
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

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services' // Ensure this path is correct

const toast = useToast()

const isAddProviderModalOpen = ref(false)
const isEditProviderModalOpen = ref(false)
const editingIndex = ref(null)
const editingProviderId = ref(null)

// --- Form Data for Adding ---
const initialFormData = {
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'cpd_cpd_provider',
  service_type: 'health_certification', // Ensure this is the correct default/required value
  // Provider specific fields (assuming they are part of initial registration)
  cpdActivityTitle: '',
  venue: '',
}
const formData = reactive({ ...initialFormData })

// --- Form Data for Editing ---
const initialEditFormData = {
  id: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  // NOTE: Password is NOT included in the edit form
  cpdActivityTitle: '',
  venue: '',
  // Role and service_type are usually not editable here
}
const editFormData = reactive({ ...initialEditFormData })

const providers = ref([]) // To store the list of providers

// --- Utility to extract error messages ---
const getErrorMessage = (error) => {
  let message = 'An unexpected error occurred. Please try again.'
  if (error.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') {
      message = data
    } else if (data.message) {
      message = data.message
    } else if (data.error) {
      message = data.error
    } else if (data.errors) {
      // Handle validation errors (Laravel style example)
      const messages = Object.values(data.errors).flat()
      message = messages.join(' ')
    } else if (Object.keys(data).length > 0) {
      // Fallback for other structured errors
      try {
        message = JSON.stringify(data)
      } catch {
        /* ignore serialization error */
      }
    }
  } else if (error.message) {
    message = error.message
  }
  return message
}

// --- Fetch Providers ---
const fetchProviders = async () => {
  try {
    console.log('Fetching providers...')
    // Pass filter parameter if your API supports it, otherwise filter below
    const response = await apiService.getAllUsers({ role: 'cpd_cpd_provider' })

    // Adjust based on your actual API response structure
    let fetchedUsers = []
    if (response?.data?.results && Array.isArray(response.data.results)) {
      fetchedUsers = response.data.results
    } else if (response?.data && Array.isArray(response.data)) {
      fetchedUsers = response.data
    } else {
      console.warn('Unexpected API response structure for providers:', response)
    }

    // Filter client-side if the API didn't filter by role
    providers.value = fetchedUsers.filter((user) => user.role === 'cpd_cpd_provider')

    console.log('Fetched providers:', providers.value)
    if (providers.value.length > 0) {
      console.log('Example provider object:', providers.value[0]) // Check structure
    }
  } catch (error) {
    console.error('Error fetching providers:', error)
    toast.error(`Failed to load providers: ${getErrorMessage(error)}`)
    providers.value = [] // Ensure providers is empty on failure
  }
}

// --- Add Modal ---
const openAddProviderModal = () => {
  // Reset form to initial state before opening
  Object.assign(formData, initialFormData)
  isAddProviderModalOpen.value = true
}

const closeAddProviderModal = () => {
  isAddProviderModalOpen.value = false
  // It's good practice to reset form on close as well
  Object.assign(formData, initialFormData)
}

// --- Add Provider Logic ---
const submitProvider = async () => {
  if (formData.password !== formData.confirm_password) {
    toast.error('Passwords do not match')
    return
  }
  if (!formData.gender) {
    toast.error('Please select a gender.')
    return
  }
  // Add any other frontend validation as needed

  try {
    // Construct the payload strictly based on what the register API expects
    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      contact_number: formData.contact_number,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      role: formData.role, // 'cpd_cpd_provider'
      service_type: formData.service_type, // 'health_certification'
      // Only include these if your registration endpoint handles them:
      cpdActivityTitle: formData.cpdActivityTitle,
      venue: formData.venue,
    }

    console.log('Submitting new provider payload:', payload)
    await apiService.register(payload) // Use the specific registration service method

    toast.success('Provider registration successful!')
    closeAddProviderModal()
    await fetchProviders() // Refresh the list after adding
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error Response:', error.response) // Log the full response
    toast.error(`Registration failed: ${getErrorMessage(error)}`)
  }
}

// --- Edit Modal ---
const openEditProviderModal = (index) => {
  const providerToEdit = providers.value[index]
  if (!providerToEdit || !providerToEdit.id) {
    console.error(
      'Cannot edit provider: Invalid data or missing ID at index',
      index,
      providerToEdit,
    )
    toast.error('Cannot load provider data for editing.')
    return
  }

  console.log('Editing provider data:', providerToEdit)
  editingIndex.value = index
  editingProviderId.value = providerToEdit.id

  // Populate edit form data safely, providing defaults for missing fields
  editFormData.id = providerToEdit.id
  editFormData.first_name = providerToEdit.first_name || ''
  editFormData.middle_name = providerToEdit.middle_name || ''
  editFormData.last_name = providerToEdit.last_name || ''
  editFormData.gender = providerToEdit.gender || ''
  // Ensure date is in YYYY-MM-DD format for input type="date"
  // Handle cases where date might be null or undefined
  editFormData.date_of_birth = providerToEdit.date_of_birth
    ? providerToEdit.date_of_birth.split('T')[0]
    : ''
  editFormData.contact_number = providerToEdit.contact_number || ''
  editFormData.email = providerToEdit.email || ''
  // Populate provider-specific fields
  editFormData.cpdActivityTitle = providerToEdit.cpdActivityTitle || ''
  editFormData.venue = providerToEdit.venue || ''

  isEditProviderModalOpen.value = true
}

const closeEditProviderModal = () => {
  isEditProviderModalOpen.value = false
  editingIndex.value = null
  editingProviderId.value = null
  // Reset edit form
  Object.assign(editFormData, initialEditFormData)
}

// --- Update Provider Logic ---
const updateProvider = async () => {
  if (!editingProviderId.value) {
    toast.error('Cannot update: Provider ID is missing.')
    return
  }
  if (!editFormData.gender) {
    toast.error('Please select a gender.')
    return
  }
  // Add any other frontend validation for edit form

  try {
    // Construct the payload with only the fields allowed for update by your API
    // **CRITICAL**: Match this to what your backend update endpoint expects
    const updatePayload = {
      first_name: editFormData.first_name,
      middle_name: editFormData.middle_name,
      last_name: editFormData.last_name,
      gender: editFormData.gender,
      date_of_birth: editFormData.date_of_birth, // Ensure format is correct if backend is strict
      contact_number: editFormData.contact_number,
      // email: editFormData.email, // Usually NOT included if non-editable
      // Include these only if your update endpoint handles them
      cpdActivityTitle: editFormData.cpdActivityTitle,
      venue: editFormData.venue,
      // Do NOT send passwords, role, service_type unless specifically allowed by the API
    }

    console.log(`Updating provider ID: ${editingProviderId.value} with payload:`, updatePayload)

    // *** Call your API update function ***
    await apiService.patchEpcCpdProvidingAgency(editingProviderId.value, updatePayload)

    toast.success('Provider updated successfully!')

    // Option 1: Update local data directly (more efficient)
    if (editingIndex.value !== null && providers.value[editingIndex.value]) {
      // Merge updated data back into the specific provider object in the list
      // Make sure the payload keys match the keys in your providers.value objects
      // Create a merged object to avoid modifying the original reactive object directly before assignment
      const updatedProviderData = { ...providers.value[editingIndex.value], ...updatePayload }
      providers.value[editingIndex.value] = updatedProviderData
      // OR if the API returns the full updated object:
      // providers.value[editingIndex.value] = response.data; // Assuming response has the data
    } else {
      // Fallback if index is lost or invalid: Re-fetch the whole list
      console.warn('Editing index was lost, re-fetching list.')
      await fetchProviders()
    }

    // Option 2: Re-fetch the entire list (simpler but less efficient)
    // await fetchProviders();

    closeEditProviderModal()
  } catch (error) {
    console.error('Update error:', error)
    console.error('Error Response:', error.response) // Log the full response
    toast.error(`Update failed: ${getErrorMessage(error)}`)
  }
}

// --- Delete Provider ---
const deleteProvider = async (index) => {
  const providerToDelete = providers.value[index]
  if (!providerToDelete || !providerToDelete.id) {
    console.error(
      'Cannot delete provider: Invalid data or missing ID at index',
      index,
      providerToDelete,
    )
    toast.error('Cannot identify provider to delete.')
    return
  }
  const providerId = providerToDelete.id
  const providerName =
    `${providerToDelete.first_name || ''} ${providerToDelete.last_name || ''}`.trim() ||
    `Provider ID ${providerId}`

  if (
    !confirm(
      `Are you sure you want to delete provider "${providerName}"? This action cannot be undone.`,
    )
  ) {
    return
  }

  try {
    console.log(`Attempting to delete provider ID: ${providerId}`)
    // *** Call your API delete function ***
    await apiService.deleteProvider(providerId)

    // Remove from local list *after* successful API call
    providers.value.splice(index, 1)
    toast.success(`Provider "${providerName}" deleted successfully!`)
  } catch (error) {
    console.error('Delete error:', error)
    console.error('Error Response:', error.response) // Log the full response
    toast.error(`Delete failed for "${providerName}": ${getErrorMessage(error)}`)
  }
}

// --- Fetch initial data when component mounts ---
onMounted(() => {
  fetchProviders()
})
</script>

<style scoped>
/* Add any component-specific styles here if needed */
/* Ensure radio buttons align nicely */
.form-radio {
  color: #4f46e5; /* Example primary color */
}
/* Style disabled/readonly inputs */
input:read-only {
  background-color: #f3f4f6; /* gray-100 */
  cursor: not-allowed;
}
</style>
