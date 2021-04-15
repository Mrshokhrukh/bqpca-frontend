<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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

    <!-- Header Card -->
    <div class="mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Award CPD Credits</h1>
        <div class="flex mt-4 space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Total Participants: {{ participants.length }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Awarded Credits: {{ totalCreditsAwarded }}</span>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div class="relative flex-grow">
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
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search by name, registration number or activity..."
          />
        </div>
        <select
          v-model="statusFilter"
          class="w-full md:w-64 block pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading participants...</span>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredParticipants.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-base font-medium text-gray-900">No participants found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            participants.length > 0
              ? 'No participants match your current filters.'
              : 'No CPD participants have been submitted for review.'
          }}
        </p>
      </div>

      <!-- Participants Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Participant Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Registration Number
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPD Activity
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Awarded Credits
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
                v-for="participant in paginatedParticipants"
                :key="participant.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.fullName }}</div>
                  <div class="text-xs text-gray-500">{{ participant.cidNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ participant.registrationNumber }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ participant.cpdTitle }}</div>
                  <div class="text-xs text-gray-500">{{ participant.activityType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ participant.cpdCredits || 0 }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      getStatusColor(participant.reviewStatus),
                      'px-2 py-1 text-xs font-medium rounded-full',
                    ]"
                  >
                    {{ participant.reviewStatus || 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openAwardModal(participant)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Award Credits
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredParticipants.length }}</span> results
              </p>
            </div>
            <div class="flex">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="[
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
                ]"
              >
                <svg
                  class="h-5 w-5 mr-2"
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
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                  'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
                ]"
              >
                Next
                <svg
                  class="h-5 w-5 ml-2"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Award Modal -->
    <Transition name="modal-fade">
      <div v-if="isAwardModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeAwardModal"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 m-4 transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog"
          aria-labelledby="modal-title"
          @click.stop
        >
          <!-- Header with close button and status -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
              <div class="text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
                  CPD Application Details
                </h2>
                <p class="text-sm text-gray-500">Review and award CPD credits</p>
              </div>
            </div>

            <!-- Status indicator -->
            <div class="flex items-center gap-2">
              <div
                v-if="selectedParticipant?.reviewStatus"
                class="px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                :class="{
                  'bg-green-100 text-green-800': selectedParticipant?.reviewStatus === 'Approved',
                  'bg-yellow-100 text-yellow-800': selectedParticipant?.reviewStatus === 'Pending',
                  'bg-red-100 text-red-800': selectedParticipant?.reviewStatus === 'Rejected',
                }"
              >
                <span
                  v-if="selectedParticipant?.reviewStatus === 'Approved'"
                  class="w-2 h-2 bg-green-500 rounded-full"
                ></span>
                <span
                  v-else-if="selectedParticipant?.reviewStatus === 'Pending'"
                  class="w-2 h-2 bg-yellow-500 rounded-full"
                ></span>
                <span v-else class="w-2 h-2 bg-red-500 rounded-full"></span>
                {{ selectedParticipant?.reviewStatus || 'Pending' }}
              </div>

              <!-- Close button -->
              <button @click="closeAwardModal" class="text-gray-400 hover:text-gray-600">
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
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-8">
              <!-- Personal Information -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg
                    class="w-5 h-5 text-gray-600"
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
                  <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" stroke-width="2" />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Registration Number</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.registrationNumber }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">CID/Identity Number</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.cidNumber }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
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
                      <span class="text-sm font-medium text-gray-500">Full Name</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.fullName }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
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
                      <span class="text-sm font-medium text-gray-500">Gender</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.gender }}</p>
                  </div>
                </div>
              </div>

              <!-- Attachment -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">Attachment</h3>
                </div>

                <div
                  v-if="selectedParticipant?.attachment"
                  class="p-4 bg-gray-100 rounded-lg flex items-center justify-between"
                >
                  <div class="flex items-start gap-3">
                    <svg
                      class="w-8 h-8 text-gray-400"
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
                    <span class="text-sm text-gray-600 break-all">
                      {{ selectedParticipant.attachment.url.split('/').pop() }}
                    </span>
                  </div>
                  <a
                    :href="selectedParticipant.attachment.url"
                    target="_blank"
                    class="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    View Document
                  </a>
                </div>
                <div v-else class="text-sm text-gray-500">No attachment available</div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-8">
              <!-- CPD Details -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg
                    class="w-5 h-5 text-gray-600"
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
                  <h3 class="text-lg font-medium text-gray-900">CPD Details</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Title of CPD</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.cpdTitle }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Relevance to Profession</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.relevance }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
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
                      <span class="text-sm font-medium text-gray-500">Participation Category</span>
                    </div>
                    <p class="text-gray-900 ml-6">
                      {{ selectedParticipant?.participationCategory }}
                    </p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
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
                      <span class="text-sm font-medium text-gray-500"
                        >Participant Sub-category</span
                      >
                    </div>
                    <p class="text-gray-900 ml-6">
                      {{ selectedParticipant?.participantSubCategory }}
                    </p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Type of CPD Activity</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.activityType }}</p>
                  </div>
                </div>
              </div>

              <!-- Review Details -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">Review Details</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Current CPD Credits</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.cpdCredits || 0 }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Remarks</span>
                    </div>
                    <p class="text-gray-900 ml-6">
                      {{ selectedParticipant?.remarks || 'No remarks' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Award Credits Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Award Credits</h3>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label for="credits" class="block text-sm font-medium text-gray-700 mb-2">
                  Number of Credits to Award
                </label>
                <div class="relative">
                  <input
                    id="credits"
                    v-model.number="creditScore"
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    class="block w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.0"
                  />
                </div>
                <div v-if="creditError" class="mt-1 text-red-500 text-sm">
                  {{ creditError }}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="closeAwardModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              <button
                @click="awardCredits"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Award Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'

// State
const participants = ref([])
const selectedParticipant = ref(null)
const isAwardModalVisible = ref(false)
const creditScore = ref(0)
const creditError = ref('')
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('All')
const currentPage = ref(1)
const pageSize = ref(10)

// Notification state
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null,
})

// Computed properties
const totalCreditsAwarded = computed(() => {
  return participants.value.reduce((total, p) => total + (p.cpdCredits || 0), 0)
})

// Filter participants based on search query and status filter
const filteredParticipants = computed(() => {
  let filtered = participants.value

  // Apply status filter if not "All"
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter((p) => p.reviewStatus === statusFilter.value)
  }

  // Apply search filter if there's a search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(query) ||
        p.registrationNumber?.toString().includes(query) ||
        p.cpdTitle?.toLowerCase().includes(query),
    )
  }

  return filtered
})

// Pagination logic
const totalPages = computed(() => {
  return Math.ceil(filteredParticipants.value.length / pageSize.value) || 1
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const paginationEnd = computed(() => {
  return Math.min(paginationStart.value + pageSize.value, filteredParticipants.value.length)
})

const paginatedParticipants = computed(() => {
  return filteredParticipants.value.slice(paginationStart.value, paginationEnd.value)
})

// Methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Reset pagination when filters change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

const showNotification = (type, title, message, duration = 5000) => {
  // Clear any existing timeout
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }

  // Set notification values
  notification.value = {
    show: true,
    type,
    title,
    message,
    timeout: null,
  }

  // Auto close after duration
  if (duration > 0) {
    notification.value.timeout = setTimeout(() => {
      closeNotification()
    }, duration)
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
    notification.value.timeout = null
  }
}

const getStatusColor = (status) => {
  return (
    {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800'
  )
}

const openAwardModal = (participant) => {
  selectedParticipant.value = participant
  isAwardModalVisible.value = true
  creditScore.value = 0 // Reset credit score
  creditError.value = '' // Reset any previous errors
}

const closeAwardModal = () => {
  isAwardModalVisible.value = false
  // Reset after the modal transition
  setTimeout(() => {
    selectedParticipant.value = null
    creditScore.value = 0
  }, 300)
}

const awardCredits = () => {
  creditError.value = '' // Clear any previous error
  if (creditScore.value <= 0) {
    creditError.value = 'Please enter a valid credit score greater than 0.'
    return // Prevent awarding non-positive credits
  }
  if (!selectedParticipant.value || selectedParticipant.value.id === undefined) {
    console.error('Selected participant is invalid or has no ID.')
    return // Exit if no participant is selected or ID is missing
  }

  const updatedCredits = (selectedParticipant.value.cpdCredits || 0) + creditScore.value

  // Prepare the updated data object
  const updatedData = {
    cpd_credit: updatedCredits,
    review_status: 'Approved', // Set status to Approved when awarding credits
  }

  // Show loading state
  isLoading.value = true

  // Make the API call to update the participant's credits
  apiServices
    .patchMhpcCpdRecord(selectedParticipant.value.id, updatedData)
    .then(() => {
      const participantIndex = participants.value.findIndex(
        (p) => p.id === selectedParticipant.value.id,
      )
      if (participantIndex !== -1) {
        // Create updated participant object with merged data
        const updatedParticipant = {
          ...participants.value[participantIndex],
          cpdCredits: updatedCredits,
          reviewStatus: 'Approved', // Update status in UI
        }
        // Replace the old participant data with updated data
        participants.value.splice(participantIndex, 1, updatedParticipant)
      }

      showNotification(
        'success',
        'Credits Awarded',
        `Successfully awarded ${creditScore.value} credits to ${selectedParticipant.value.fullName} and marked as Approved.`,
      )

      closeAwardModal() // Close the modal after successful update
    })
    .catch((error) => {
      console.error('Error updating CPD credits:', error)
      showNotification(
        'error',
        'Failed to Award Credits',
        'There was an error processing your request. Please try again.',
      )
    })
    .finally(() => {
      isLoading.value = false
    })
}

// Fetch data on component mount
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await apiServices.getMhpcCpdRecords()
    console.log('API Response:', response)

    if (response && response.data && response.data.results) {
      participants.value = response.data.results.map((item) => ({
        id: item.id,
        fullName: item.full_name,
        registrationNumber: item.registration_no,
        cpdTitle: item.title_of_cpd,
        cpdCredits: item.cpd_credit, // Existing credits
        cidNumber: item.cid_no,
        gender: item.gender,
        relevance: item.relevance_to_profession,
        participationCategory: item.participation_category?.participation_category_name,
        participantSubCategory: item.participant_sub_category?.participation_sub_category_name,
        activityType: item.type_of_cpd_activity?.cpd_activity_name,
        attachment: item.attachment ? { url: item.attachment } : null,
        reviewStatus: item.review_status,
        remarks: item.remark,
      }))
    } else {
      console.error('Error fetching CPD records: Unexpected response format', response)
      participants.value = []
      showNotification('error', 'Data Loading Failed', 'Could not retrieve participant records.')
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    participants.value = []
    showNotification(
      'error',
      'Connection Error',
      'Failed to connect to the server. Please try again later.',
    )
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
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

/* Modal Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
