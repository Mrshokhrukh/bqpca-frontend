<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">
              Learning Hospital Applications
            </h1>
            <p class="text-sm text-gray-600"> and manage your teaching center applications</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div v-if="savedDraft" class="flex flex-col sm:flex-row gap-2">
              <button
                @click="openApplicationFormModal(true)"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Continue Draft
              </button>
              <button
                @click="discardDraft"
                class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Discard & Add New
              </button>
            </div>
            <button
              v-else
              @click="openApplicationFormModal(false)"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Hospital
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State (Initial) -->
    <div
      v-if="isLoading && !applications.length"
      class="bg-white shadow-sm border border-gray-200 rounded-lg p-12 text-center"
    >
      <div
        class="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-500 text-sm">Loading applications...</p>
    </div>

    <!-- Main Content -->
    <div v-if="!isLoading || applications.length" class="space-y-6">
      <!-- Filters Section -->
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search Input -->
          <div class="flex-1 relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search by center name or institution..."
              class="block w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Dzongkhag Filter -->
          <div class="w-full lg:w-48 relative">
            <select
              v-model="filterDzongkhag"
              class="block w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">All Dzongkhags</option>
              <option
                v-for="dzongkhag in dzongkhagOptionsForCenter"
                :key="dzongkhag.value"
                :value="dzongkhag.value"
              >
                {{ dzongkhag.label }}
              </option>
            </select>
            <svg
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <!-- Gewog Filter -->
          <div class="w-full lg:w-48 relative">
            <select
              v-model="filterGewog"
              :disabled="!filterDzongkhag"
              class="block w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">{{ filterDzongkhag ? 'All Gewogs' : 'Select Dzongkhag' }}</option>
              <option
                v-for="gewog in gewogOptionsForCenter"
                :key="gewog.value"
                :value="gewog.value"
              >
                {{ gewog.label }}
              </option>
            </select>
            <svg
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <!-- Loading Overlay -->
        <div v-if="isLoading && applications.length" class="relative">
          <div
            class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
          >
            <div
              class="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
            ></div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Table Header -->
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hospital Details
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Clinical Preceptors
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Data Rows -->
              <tr
                v-for="application in filteredApplications"
                :key="application.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- Hospital Details -->
                <td class="px-6 py-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 mb-1">
                        {{ application.center_name }}
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ application.institute_details?.name_of_institution || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="statusClass(application.tc_review_decision)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ application.tc_review_decision || 'Unknown' }}
                  </span>
                </td>

                <!-- Payment -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="paymentStatusClass(application.payment_status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ formatPaymentStatus(application.payment_status) }}
                  </span>
                </td>

                <!-- Clinical Preceptors -->
                <td class="px-6 py-4">
                  <div
                    v-if="
                      application.clinical_preceptors && application.clinical_preceptors.length > 0
                    "
                    class="space-y-2"
                  >
                    <div
                      v-for="preceptor in application.clinical_preceptors"
                      :key="preceptor.id"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">
                          {{ preceptor.name }}
                        </div>
                        <div v-if="preceptor.officer_remarks" class="text-xs text-gray-500 mt-1">
                          {{ preceptor.officer_remarks }}
                        </div>
                      </div>
                      <button
                        @click="confirmRemovePreceptor(preceptor, application)"
                        class="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="Remove Preceptor"
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
                  </div>
                  <div v-else class="text-sm text-gray-500">No preceptors assigned</div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col space-y-2">
                    <!-- Payment Button -->
                    <button
                      v-if="canMakePayment(application)"
                      @click="initiateTeachingCenterPayment(application)"
                      :disabled="isPaymentProcessing || isLoading"
                      class="inline-flex items-center px-3 py-1.5 border border-amber-300 text-amber-700 bg-amber-50 text-xs font-medium rounded hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Make Payment
                    </button>

                    <!-- Add Preceptor Button -->
                    <button
                      v-if="canAddPreceptor(application)"
                      @click="openAddPreceptorModal(application)"
                      :disabled="isLoading"
                      class="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 text-xs font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Preceptor
                    </button>

                    <!-- Certificate Button -->
                    <button
                      v-if="canDownloadCertificate(application)"
                      @click="openCertificateModal(application)"
                      class="inline-flex items-center px-3 py-1.5 border border-purple-300 text-purple-700 bg-purple-50 text-xs font-medium rounded hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Certificate
                    </button>

                    <!-- View Details Button -->
                    <button
                      @click="viewDetails(application)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white text-xs font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg
                        class="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!isLoading && filteredApplications.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <svg
                      class="w-12 h-12 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p class="text-gray-500 text-sm mb-2">No applications found</p>
                    <p v-if="searchQuery" class="text-gray-400 text-xs">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <teleport to="body">
      <transition
        name="modal"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isDetailsModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          @click.self="closeDetailsModal"
        >
          <div
            class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col"
          >
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200"
            >
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
                <p class="text-sm text-gray-600 mt-1">{{ selectedApplication?.center_name }}</p>
              </div>
              <button
                @click="closeDetailsModal"
                class="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="overflow-y-auto flex-1 px-6 py-6">
              <div v-if="selectedApplication" class="space-y-6">
                <!-- Institution Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h3 class="text-lg font-medium text-gray-900 mb-3">Institution Information</h3>
                  <p class="text-gray-700 font-medium">
                    {{
                      selectedApplication.institute_details?.name_of_institution || 'Not specified'
                    }}
                  </p>
                </div>

                <!-- Status Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Verification Status</label
                    >
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {{ selectedApplication.physical_verification_status_display || 'Pending' }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Report</label>
                    <div>
                      <a
                        v-if="selectedApplication.tc_report"
                        :href="selectedApplication.tc_report"
                        target="_blank"
                        class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <svg
                          class="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        View Report
                      </a>
                      <span v-else class="text-gray-500 italic">No report available</span>
                    </div>
                  </div>
                </div>

                <!-- Remarks -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Verification Remarks</label
                  >
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p class="text-gray-700 whitespace-pre-wrap">
                      {{
                        selectedApplication.physical_verification_remarks || 'No remarks provided.'
                      }}
                    </p>
                  </div>
                </div>

                <!-- Clinical Preceptors -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3"
                    >Clinical Preceptors</label
                  >
                  <div v-if="selectedApplication.clinical_preceptors?.length > 0" class="space-y-3">
                    <div
                      v-for="preceptor in selectedApplication.clinical_preceptors"
                      :key="preceptor.id"
                      class="flex items-center p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                      >
                        <svg
                          class="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ preceptor.name }}</p>
                        <p class="text-sm text-gray-600">Registration: {{ preceptor.reg_no }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-8">
                    <svg
                      class="w-12 h-12 text-gray-300 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p class="text-gray-500">No clinical preceptors assigned</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                @click="closeDetailsModal"
                class="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Preceptor Modal -->
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="isPreceptorModalOpen"
          class="fixed inset-0 z-[60] bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closePreceptorModal"
        >
          <ClinicalPreceptorModal
            :application-id="selectedApplicationForPreceptor?.id"
            :existing-preceptor-ids="
              selectedApplicationForPreceptor?.clinical_preceptors.map((p) => p.cid) || []
            "
            @close="closePreceptorModal"
            @submit-success="handlePreceptorSubmitSuccess"
          />
        </div>
      </transition>
    </teleport>

    <!-- Certificate Modal -->
    <teleport to="body">
      <transition name="modal-certificate-fade">
        <div
          v-if="showCertificateModal"
          class="fixed inset-0 z-[60] bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="closeCertificateModal"
        >
          <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold">Teaching Hospital Certificate</h3>
              <button @click="closeCertificateModal" class="p-2 rounded-full hover:bg-gray-200">
                <svg
                  class="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="overflow-y-auto flex-1">
              <TeachingCenterCertificate
                v-if="selectedCertificateData"
                ref="certificateComponentRef"
                :center-data="selectedCertificateData"
              />
            </div>
            <div class="p-4 bg-gray-100 border-t border-gray-200 flex justify-end space-x-4">
              <button
                @click="closeCertificateModal"
                class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                @click="downloadCertificate"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Application Form Modal -->
    <TeachingCenterApplication
      :is-open="isApplicationFormModalOpen"
      :draft-data="selectedApplication"
      @close="closeApplicationFormModal"
      @form-submitted="handleApplicationFormSubmitted"
      @draft-saved="handleDraftSaved"
    />

    <!-- Payment Modal -->
    <PaymentModal
      ref="teachingCenterPaymentModalRef"
      :amount="teaching_hospital_registration"
      @payment-completed="handleTeachingCenterPaymentCompleted"
      @close="closeTeachingCenterPaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { MagnifyingGlassIcon, ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/outline'
import apiServices from '@/services/services'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import ClinicalPreceptorModal from './modals/ClinicalPreceptorModal.vue'
import TeachingCenterApplication from './TeachingCenterApplicationModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import TeachingCenterCertificate from './TeachingCenterCertificate.vue'

const toast = useToast()
const authStore = useAuthStore()
const applications = ref([])
const searchQuery = ref('')
const filterDzongkhag = ref('')
const filterGewog = ref('')
const isPreceptorModalOpen = ref(false)
const selectedApplicationForPreceptor = ref(null)
const showCertificateModal = ref(false)
const selectedCertificateData = ref(null)
const certificateComponentRef = ref(null)
const isDetailsModalOpen = ref(false)
const selectedApplication = ref(null)
const isLoading = ref(false)
const isPaymentProcessing = ref(false)
const isApplicationFormModalOpen = ref(false)
// --- FIX 1: Change to ref ---
const teaching_hospital_registration = ref(100)
const teachingCenterPaymentModalRef = ref(null)
const selectedApplicationForPayment = ref(null)
const savedDraft = ref(null)
const DRAFT_KEY = 'teachingCenterApplicationDraft'
const expandedRemarksId = ref(null)
const REMARKS_TRUNCATE_LIMIT = 50

const dzongkhagOptionsForCenter = computed(() =>
  bhutanDzongkhagsGewogs.map((d) => ({ value: d.dzongkhag, label: d.dzongkhag }))
)

const gewogOptionsForCenter = computed(() => {
  if (!filterDzongkhag.value) return []
  const selected = bhutanDzongkhagsGewogs.find((d) => d.dzongkhag === filterDzongkhag.value)
  return selected ? selected.gewogs.map((g) => ({ value: g, label: g })) : []
})

watch(
  () => filterDzongkhag.value,
  () => {
    filterGewog.value = ''
  }
)

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) return []
  return applications.value.filter((app) => {
    const instituteName = app.institute_details?.name_of_institution || ''
    const matchesSearch =
      app.center_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      instituteName.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

const statusClass = (status) => {
  const s = status ? status.toLowerCase() : 'unknown'
  if (s === 'approved') return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'pending') return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  if (s === 'regretted' || s === 'rejected') return 'bg-red-100 text-red-700 border border-red-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}

const paymentStatusClass = (status) => {
  const s = status ? status.toLowerCase().replace(/_/g, ' ') : 'not paid'
  if (s === 'paid' || s === 'completed')
    return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'pending payment' || s === 'processing payment' || s === 'awaiting payment')
    return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  if (s === 'failed') return 'bg-red-100 text-red-700 border border-red-200'
  if (s === 'not paid') return 'bg-orange-100 text-orange-700 border border-orange-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}

const formatPaymentStatus = (status) => {
  if (!status) return 'Not Paid'
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const truncateText = (text, limit) => {
  if (text && text.length > limit) {
    return text.substring(0, limit) + '...'
  }
  return text
}

const toggleRemarks = (appId) => {
  if (expandedRemarksId.value === appId) {
    expandedRemarksId.value = null
  } else {
    expandedRemarksId.value = appId
  }
}

const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) return
  isLoading.value = true
  try {
    const response = await apiServices.getMhpcTeachingCenterByCid(authStore.user.cid)
    const fetchedApplications = response.data?.results || []

    if (Array.isArray(fetchedApplications)) {
      applications.value = fetchedApplications
    } else {
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
    toast.error('Failed to load applications.')
  } finally {
    isLoading.value = false
  }
}

const canMakePayment = (application) => {
  const decision = application.tc_review_decision?.toLowerCase()
  const status = application.payment_status
    ? application.payment_status.toLowerCase().replace(/ /g, '_')
    : 'not_paid'
  return decision === 'approved' && ['not_paid', 'failed', 'awaiting_payment'].includes(status)
}

const canAddPreceptor = (application) => {
  const status = application.payment_status ? application.payment_status.toLowerCase() : ''
  return (
    application.tc_review_decision?.toLowerCase() === 'approved' &&
    ['paid', 'completed'].includes(status)
  )
}

const canDownloadCertificate = (application) => {
  const status = application.payment_status ? application.payment_status.toLowerCase() : ''
  return (
    application.tc_review_decision?.toLowerCase() === 'approved' &&
    ['paid', 'completed'].includes(status) &&
    application.clinical_preceptors &&
    application.clinical_preceptors.length > 0
  )
}

const openApplicationFormModal = (loadDraft = false) => {
  if (loadDraft && savedDraft.value) {
    selectedApplication.value = savedDraft.value
  } else {
    selectedApplication.value = null
  }
  isApplicationFormModalOpen.value = true
}

const discardDraft = () => {
  if (confirm('Are you sure you want to discard the saved draft?')) {
    localStorage.removeItem(DRAFT_KEY)
    savedDraft.value = null
    openApplicationFormModal(false)
  }
}

const handleDraftSaved = (draftData) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
  savedDraft.value = draftData
  toast.info('Your application has been saved as a draft.')
  closeApplicationFormModal()
}

const openCertificateModal = (application) => {
  selectedCertificateData.value = {
    id: application.id,
    center_name: application.center_name,
    valid_since: application.valid_since || new Date().toISOString(),
    valid_till: application.valid_till || 'N/A',
    institute_name: application.institute_details?.name_of_institution || 'N/A',
    location: application.city_gewog + ', ' + application.state_dzongkhag,
    issue_date: application.updated_at || new Date().toISOString(),
  }
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedCertificateData.value = null
}

const downloadCertificate = () => {
  if (certificateComponentRef.value) {
    certificateComponentRef.value.exportToPDF()
  } else {
    toast.error('Could not generate PDF. Certificate component not ready.')
  }
}

const openAddPreceptorModal = (application) => {
  selectedApplicationForPreceptor.value = application
  isPreceptorModalOpen.value = true
}

const closePreceptorModal = () => {
  isPreceptorModalOpen.value = false
  selectedApplicationForPreceptor.value = null
}

const handlePreceptorSubmitSuccess = async () => {
  toast.success('Clinical Preceptor added successfully. Refreshing list...')
  closePreceptorModal()
  await fetchApplications()
}

const confirmRemovePreceptor = (preceptor, center) => {
  if (
    confirm(
      `Are you sure you want to remove the preceptor "${preceptor.name}" from ${center.center_name}?`
    )
  ) {
    removePreceptor(preceptor)
  }
}

const removePreceptor = async (preceptor) => {
  if (!preceptor.id) {
    toast.error('Preceptor ID not found.')
    return
  }
  isLoading.value = true
  try {
    await apiServices.deleteMhpcClinicalPreceptor(preceptor.id)
    toast.success('Preceptor removed successfully.')
    await fetchApplications()
  } catch (error) {
    console.error('Error removing preceptor:', error)
    toast.error('Failed to remove preceptor.')
  } finally {
    isLoading.value = false
  }
}

const viewDetails = (application) => {
  selectedApplication.value = application
  isDetailsModalOpen.value = true
}

const closeDetailsModal = () => {
  isDetailsModalOpen.value = false
  selectedApplication.value = null
}

const closeApplicationFormModal = () => {
  isApplicationFormModalOpen.value = false
  selectedApplication.value = null
}

const handleApplicationFormSubmitted = () => {
  closeApplicationFormModal()
  fetchApplications()
  localStorage.removeItem(DRAFT_KEY)
  savedDraft.value = null
  toast.success('Application submitted successfully!')
}

const initiateTeachingCenterPayment = (application) => {
  selectedApplicationForPayment.value = application
  if (teachingCenterPaymentModalRef.value) {
    teachingCenterPaymentModalRef.value.openModal()
  }
}

const closeTeachingCenterPaymentModal = () => {
  if (!isPaymentProcessing.value) {
    selectedApplicationForPayment.value = null
  }
}

const handleTeachingCenterPaymentCompleted = async (paymentData) => {
  if (!selectedApplicationForPayment.value) {
    toast.error('No application selected for payment.');
    return;
  }
  isPaymentProcessing.value = true;
  let redirectUrl = null;
  const user = authStore.user;
  const appToPay = selectedApplicationForPayment.value;
  const paymentId = paymentData.paymentHash;

  if (!user || !user.id || !user.cid || !user.email) {
    toast.error('User information is missing. Please log in again.');
    isPaymentProcessing.value = false;
    return;
  }

  // Step 1: Prepare payment data and call the payment gateway API to get a redirect URL.
  try {
    const paymentGatewayFormData = new FormData();
    // refNo should be a unique identifier for this payment attempt
    paymentGatewayFormData.append('refNo', paymentId);
    paymentGatewayFormData.append('serviceCode', '102829');
    paymentGatewayFormData.append('taxPayerName', appToPay.institute_details?.name_of_institution || user.cid);
    paymentGatewayFormData.append('taxPayerNo', user.cid);
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid);
    // Correctly use .value as teaching_hospital_registration is a ref
    paymentGatewayFormData.append('totalPayableAmount', teaching_hospital_registration.value);
    paymentGatewayFormData.append('payableAmount', teaching_hospital_registration.value);
    paymentGatewayFormData.append('description', 'MHPC Teaching Hospital Registration Fee');
    paymentGatewayFormData.append('mobileNo', user.contact_number || '17110000');
    paymentGatewayFormData.append('payerEmail', user.email);
    paymentGatewayFormData.append('user', user.id);
    // Pass the actual application ID so the backend knows which application to link
    paymentGatewayFormData.append('application_no', appToPay.id);
    paymentGatewayFormData.append('app_type', 'mhpc_teaching_hospital');

    const paymentResponse = await apiServices.makePayment(paymentGatewayFormData);

    if (paymentResponse.data?.content?.redirectUrl) {
      redirectUrl = paymentResponse.data.content.redirectUrl;
    } else {
      // This is crucial: if the URL isn't in the response, we must stop and report an error.
      console.error('Payment initiation response did not contain a redirectUrl:', paymentResponse.data);
      throw new Error('Redirect URL not received from the payment gateway.');
    }
  } catch (paymentError) {
    console.error('Error initiating payment:', paymentError);
    const errorMessage = paymentError.response?.data?.message || paymentError.message;
    toast.error(`Failed to initiate payment: ${errorMessage}`);
    isPaymentProcessing.value = false;
    if (teachingCenterPaymentModalRef.value) {
      teachingCenterPaymentModalRef.value.closeModal();
    }
    return; // Stop execution if payment initiation fails
  }

  // Step 2: If we successfully got a redirect URL, update our application's status in the backend.
  try {
    // This confirms that the payment process has started for this application.
    await apiServices.confirmTeachingCenterPayment(appToPay.id, { payment_id: paymentId });

    toast.success(
      'Payment initiated. Redirecting to payment gateway. A link may also be sent to your email.',
      { timeout: 8000 }
    );

    // Step 3: Redirect the user to the payment gateway page.
    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }

    // Refresh the local data to show the updated status (e.g., "Awaiting Payment").
    await fetchApplications();
  } catch (confirmError) {
    console.error('Error confirming payment status on our server:', confirmError);
    toast.error(
      'Failed to update application status after payment initiation. Please contact support.',
      { timeout: 8000 }
    );
    // Even if this part fails, we should still redirect the user to complete the payment.
    if (redirectUrl) {
      toast.info('You can still complete the payment at the redirected page.');
      window.open(redirectUrl, '_blank');
    }
  } finally {
    isPaymentProcessing.value = false;
    if (teachingCenterPaymentModalRef.value) {
      teachingCenterPaymentModalRef.value.closeModal();
    }
    closeTeachingCenterPaymentModal();
  }
};

onMounted(() => {
  fetchApplications()
  const draft = localStorage.getItem(DRAFT_KEY)
  if (draft) {
    savedDraft.value = JSON.parse(draft)
  }
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-certificate-fade-enter-active,
.modal-certificate-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-certificate-fade-enter-from,
.modal-certificate-fade-leave-to {
  opacity: 0;
}

.modal-certificate-fade-enter-active .bg-white,
.modal-certificate-fade-leave-active .bg-white {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.modal-certificate-fade-enter-from .bg-white,
.modal-certificate-fade-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>
