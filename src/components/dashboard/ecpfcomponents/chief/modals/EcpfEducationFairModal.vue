<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full w-full transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Application Header -->
              <div
                v-if="application"
                class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                      {{ application.ecpfName || 'Education Fair Application' }}
                    </h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.cid }}</p>
                  </div>
                  <div class="space-x-2">
                    <button
                      @click="showEditModal = true"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon class="h-4 w-4 mr-2" />
                      Edit Application
                    </button>
                    <button
                      v-if="application.chiefDecision === 'approved'"
                      @click="previewApprovalLetter"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <DocumentTextIcon class="h-4 w-4 mr-2" />
                      Preview Approval Letter
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <!-- Current Details of ECPF -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-blue-100 p-2 rounded-md">
                            <DocumentDuplicateIcon class="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Current Details of ECPF</h4>
                        </div>
                        <p>
                          <strong>ECPF Name:</strong>
                          {{ application.ecpfName || 'N/A' }}
                        </p>
                        <p>
                          <strong>Location:</strong>
                          {{ application.ecpfLocation || 'N/A' }}
                        </p>
                        <p>
                          <strong>Name of Proprietor:</strong>
                          {{ application.proprietorName || 'N/A' }}
                        </p>
                        <p>
                          <strong>CID:</strong>
                          {{ application.cid || 'N/A' }}
                        </p>
                        <p>
                          <strong>Contact No.:</strong>
                          {{ application.contactNo || 'N/A' }}
                        </p>
                        <p>
                          <strong>Email Address:</strong>
                          {{ application.emailAddress || 'N/A' }}
                        </p>
                      </div>
                    </div>

                    <!-- Proposed Fair Details -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-indigo-100 p-2 rounded-md">
                            <DocumentTextIcon class="h-5 w-5 text-indigo-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Proposed Fair Details</h4>
                        </div>
                        <p>
                          <strong>Fair Name:</strong>
                          {{ application.fairName || 'N/A' }}
                        </p>
                        <p>
                          <strong>Fair Description:</strong>
                          {{ application.fairDescription || 'N/A' }}
                        </p>
                        <p>
                          <strong>Fair Location:</strong>
                          {{ application.fairLocation || 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Representative Details Section -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-green-100 p-2 rounded-md">
                            <UserIcon class="h-5 w-5 text-green-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Representative Details</h4>
                        </div>

                        <div
                          v-if="
                            application.representatives && application.representatives.length > 0
                          "
                          class="space-y-4"
                        >
                          <div
                            v-for="(rep, index) in application.representatives"
                            :key="index"
                            class="border p-4 rounded-md mb-4"
                          >
                            <h5 class="font-medium text-gray-700 mb-2">
                              Representative {{ index + 1 }}
                            </h5>
                            <p>
                              <strong>Name:</strong>
                              {{ rep.name || 'N/A' }}
                            </p>
                            <p>
                              <strong>Passport No:</strong>
                              {{ rep.passportNo || 'N/A' }}
                            </p>
                            <p>
                              <strong>Nationality:</strong>
                              {{ rep.nationality || 'N/A' }}
                            </p>
                            <p>
                              <strong>Arrival Date:</strong>
                              {{ rep.arrivalDate || 'N/A' }}
                            </p>
                            <p>
                              <strong>Departure Date:</strong>
                              {{ rep.departureDate || 'N/A' }}
                            </p>
                            <p>
                              <strong>CV of Representative:</strong>
                              <button class="text-indigo-600 hover:text-indigo-800">View</button>
                            </p>
                          </div>
                        </div>
                        <div v-else>
                          <p class="text-center py-6 text-gray-500 italic">
                            No Representative Details Available.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Participating Institute Details Section -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <AcademicCapIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">
                            Participating Institute Details
                          </h4>
                        </div>

                        <div
                          v-if="application.institutes && application.institutes.length > 0"
                          class="space-y-4"
                        >
                          <div
                            v-for="(institute, index) in application.institutes"
                            :key="index"
                            class="border p-4 rounded-md mb-4"
                          >
                            <h5 class="font-medium text-gray-700 mb-2">
                              Institute {{ index + 1 }}
                            </h5>
                            <p>
                              <strong>Name of the Institution:</strong>
                              {{ institute.institutionName || 'N/A' }}
                            </p>
                            <p>
                              <strong>Location:</strong>
                              {{ institute.location || 'N/A' }}
                            </p>
                            <p>
                              <strong>Zone/State:</strong>
                              {{ institute.zoneState || 'N/A' }}
                            </p>
                            <p>
                              <strong>Country:</strong>
                              {{ institute.country || 'N/A' }}
                            </p>
                            <p>
                              <strong>Institute Website:</strong>
                              {{ institute.website || 'N/A' }}
                            </p>
                            <p>
                              <strong>Contact (focal person):</strong>
                              {{ institute.contactPerson || 'N/A' }}
                            </p>
                            <p>
                              <strong>College Affiliated to:</strong>
                              {{ institute.affiliatedCollege || 'N/A' }}
                            </p>
                            <p>
                              <strong>Type of University:</strong>
                              {{ institute.universityType || 'N/A' }}
                            </p>
                            <p>
                              <strong>Recognition Code (if any):</strong>
                              {{ institute.recognitionCode || 'N/A' }}
                            </p>
                            <p>
                              <strong>Course Offered Details:</strong>
                              {{ institute.courseDetails || 'N/A' }}
                            </p>
                            <p>
                              <strong>Accredited By:</strong>
                              {{ institute.accreditedBy || 'N/A' }}
                            </p>
                            <p>
                              <strong>Authorization Letter:</strong>
                              <button class="text-indigo-600 hover:text-indigo-800">View</button>
                            </p>
                            <p>
                              <strong>Remarks:</strong>
                              {{ institute.remarks || 'N/A' }}
                            </p>
                          </div>
                        </div>
                        <div v-else>
                          <p class="text-center py-6 text-gray-500 italic">
                            No Participating Institute Details Available.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Chief Decision Form -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-yellow-100 p-2 rounded-md">
                            <CheckBadgeIcon class="h-5 w-5 text-yellow-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Chief Decision</h4>
                        </div>
                        <div class="mt-2 space-y-4">
                          <div>
                            <label
                              for="chiefDecision"
                              class="block text-sm font-medium text-gray-700"
                              >Decision:</label
                            >
                            <select
                              id="chiefDecision"
                              v-model="verificationForm.verificationDecision"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="">Select Decision</option>
                              <option value="approved">Approved</option>
                              <option value="regretted">Regretted</option>
                            </select>
                          </div>
                          <div v-if="verificationForm.verificationDecision === 'regretted'">
                            <label
                              for="regretReason"
                              class="block text-sm font-medium text-gray-700"
                              >Reason (if regretted):</label
                            >
                            <textarea
                              id="regretReason"
                              v-model="verificationForm.regretReason"
                              rows="2"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>
                          <div v-if="verificationForm.verificationDecision === 'approved'">
                            <label
                              for="conditionText"
                              class="block text-sm font-medium text-gray-700"
                              >Condition (if approved):</label
                            >
                            <textarea
                              id="conditionText"
                              v-model="verificationForm.conditionText"
                              rows="2"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>
                          <div>
                            <label for="remarksText" class="block text-sm font-medium text-gray-700"
                              >Remarks:</label
                            >
                            <textarea
                              id="remarksText"
                              v-model="verificationForm.remarksText"
                              rows="2"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer buttons -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModal"
                >
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="submitDecision"
                >
                  Submit Decision
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Edit Modal -->
  <Dialog :open="showEditModal" @close="showEditModal = false" class="relative z-50">
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <DialogPanel
          class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all overflow-y-scroll max-h-[90vh]"
        >
          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Edit Education Fair Application
          </DialogTitle>
          <div class="mt-2 space-y-6">
            <p class="text-sm text-gray-500">Modify all sections of the application below.</p>

            <!-- Edit ECPF Details -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">ECPF Details</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="editEcpfName" class="block text-sm font-medium text-gray-700 mb-1"
                    >ECPF Name:</label
                  >
                  <input
                    type="text"
                    id="editEcpfName"
                    v-model="editForm.ecpfName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label for="editLocation" class="block text-sm font-medium text-gray-700 mb-1"
                    >Location:</label
                  >
                  <input
                    type="text"
                    id="editLocation"
                    v-model="editForm.ecpfLocation"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    for="editProprietorName"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Name of Proprietor:</label
                  >
                  <input
                    type="text"
                    id="editProprietorName"
                    v-model="editForm.proprietorName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label for="editCid" class="block text-sm font-medium text-gray-700 mb-1"
                    >CID:</label
                  >
                  <input
                    type="text"
                    id="editCid"
                    v-model="editForm.cid"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label for="editContactNo" class="block text-sm font-medium text-gray-700 mb-1"
                    >Contact No.:</label
                  >
                  <input
                    type="text"
                    id="editContactNo"
                    v-model="editForm.contactNo"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label for="editEmailAddress" class="block text-sm font-medium text-gray-700 mb-1"
                    >Email Address:</label
                  >
                  <input
                    type="email"
                    id="editEmailAddress"
                    v-model="editForm.emailAddress"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Edit Proposed Fair Details -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Proposed Fair Details</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="editFairName" class="block text-sm font-medium text-gray-700 mb-1"
                    >Fair Name:</label
                  >
                  <input
                    type="text"
                    id="editFairName"
                    v-model="editForm.fairName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    for="editFairDescription"
                    class="block text-sm font-medium text-gray-700 mb-1"
                    >Fair Description:</label
                  >
                  <textarea
                    id="editFairDescription"
                    v-model="editForm.fairDescription"
                    rows="2"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div>
                  <label for="editFairLocation" class="block text-sm font-medium text-gray-700 mb-1"
                    >Fair Location:</label
                  >
                  <input
                    type="text"
                    id="editFairLocation"
                    v-model="editForm.fairLocation"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Edit Representative Details Section -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Representative Details</h4>
              <p class="text-sm text-gray-500 mb-2">
                Edit the representative details below. You can add, modify, or delete
                representatives.
              </p>

              <template v-if="editForm.representatives && editForm.representatives.length > 0">
                <div
                  v-for="(rep, index) in editForm.representatives"
                  :key="index"
                  class="border rounded-md p-4 mb-4"
                >
                  <h5 class="font-medium text-gray-700 mb-2">Representative {{ index + 1 }}</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        :for="`editRepName-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Name:</label
                      >
                      <input
                        type="text"
                        :id="`editRepName-${index}`"
                        v-model="rep.name"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editPassportNo-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Passport No:</label
                      >
                      <input
                        type="text"
                        :id="`editPassportNo-${index}`"
                        v-model="rep.passportNo"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editNationality-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Nationality:</label
                      >
                      <input
                        type="text"
                        :id="`editNationality-${index}`"
                        v-model="rep.nationality"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editArrivalDate-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Arrival Date:</label
                      >
                      <input
                        type="date"
                        :id="`editArrivalDate-${index}`"
                        v-model="rep.arrivalDate"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editDepartureDate-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Departure Date:</label
                      >
                      <input
                        type="date"
                        :id="`editDepartureDate-${index}`"
                        v-model="rep.departureDate"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editRepCV-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >CV of Representative:</label
                      >
                      <input
                        type="file"
                        :id="`editRepCV-${index}`"
                        @change="(event) => handleRepCVUpload(event, index)"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span v-if="rep.cvFileName" class="text-gray-500 text-sm mt-1 block"
                        >Current File: {{ rep.cvFileName }}</span
                      >
                    </div>
                  </div>
                  <button
                    @click="removeRepresentative(index)"
                    type="button"
                    class="mt-2 inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                  >
                    Remove Representative
                  </button>
                </div>
              </template>
              <button
                @click="addRepresentative"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
              >
                Add Representative
              </button>
            </div>

            <!-- Edit Participating Institute Details Section -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">Participating Institute Details</h4>
              <p class="text-sm text-gray-500 mb-2">
                Edit the participating institute details below. You can add, modify, or delete
                institutes.
              </p>

              <template v-if="editForm.institutes && editForm.institutes.length > 0">
                <div
                  v-for="(institute, index) in editForm.institutes"
                  :key="index"
                  class="border rounded-md p-4 mb-4"
                >
                  <h5 class="font-medium text-gray-700 mb-2">Institute {{ index + 1 }}</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        :for="`editInstitutionName-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Name of the Institution:</label
                      >
                      <input
                        type="text"
                        :id="`editInstitutionName-${index}`"
                        v-model="institute.institutionName"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editLocationInstitute-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Location:</label
                      >
                      <input
                        type="text"
                        :id="`editLocationInstitute-${index}`"
                        v-model="institute.location"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editZoneState-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Zone/State:</label
                      >
                      <input
                        type="text"
                        :id="`editZoneState-${index}`"
                        v-model="institute.zoneState"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editCountry-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Country:</label
                      >
                      <input
                        type="text"
                        :id="`editCountry-${index}`"
                        v-model="institute.country"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editWebsite-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Institute Website:</label
                      >
                      <input
                        type="url"
                        :id="`editWebsite-${index}`"
                        v-model="institute.website"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editContactPerson-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Contact (focal person):</label
                      >
                      <input
                        type="text"
                        :id="`editContactPerson-${index}`"
                        v-model="institute.contactPerson"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editAffiliatedCollege-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >College Affiliated to:</label
                      >
                      <input
                        type="text"
                        :id="`editAffiliatedCollege-${index}`"
                        v-model="institute.affiliatedCollege"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editUniversityType-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Type of University:</label
                      >
                      <input
                        type="text"
                        :id="`editUniversityType-${index}`"
                        v-model="institute.universityType"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editRecognitionCode-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Recognition Code (if any):</label
                      >
                      <input
                        type="text"
                        :id="`editRecognitionCode-${index}`"
                        v-model="institute.recognitionCode"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editCourseDetails-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Course Offered Details:</label
                      >
                      <textarea
                        :id="`editCourseDetails-${index}`"
                        v-model="institute.courseDetails"
                        rows="2"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      ></textarea>
                    </div>
                    <div>
                      <label
                        :for="`editAccreditedByInstitute-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Accredited By:</label
                      >
                      <input
                        type="text"
                        :id="`editAccreditedByInstitute-${index}`"
                        v-model="institute.accreditedBy"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        :for="`editAuthorizationLetter-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Authorization Letter:</label
                      >
                      <input
                        type="file"
                        :id="`editAuthorizationLetter-${index}`"
                        @change="(event) => handleAuthorizationLetterUpload(event, index)"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span
                        v-if="institute.authorizationLetterName"
                        class="text-gray-500 text-sm mt-1 block"
                        >Current File: {{ institute.authorizationLetterName }}</span
                      >
                    </div>
                    <div>
                      <label
                        :for="`editRemarksInstitute-${index}`"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Remarks:</label
                      >
                      <textarea
                        :id="`editRemarksInstitute-${index}`"
                        v-model="institute.remarks"
                        rows="2"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    @click="removeInstitute(index)"
                    type="button"
                    class="mt-2 inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                  >
                    Remove Institute
                  </button>
                </div>
              </template>
              <button
                @click="addInstitute"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
              >
                Add Institute
              </button>
            </div>

            <div class="mt-6 flex justify-between">
              <button
                type="button"
                @click="deleteApplication"
                class="rounded-md px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
              >
                Delete Application
              </button>
              <div class="space-x-2">
                <button
                  type="button"
                  @click="showEditModal = false"
                  class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="saveFullEdit"
                  class="rounded-md px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, reactive, watch } from 'vue'
import {
  UserIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  PencilIcon,
  XMarkIcon,
  AcademicCapIcon,
  // CheckCircleIcon, // Removed as dialogs are removed
  // XCircleIcon,   // Removed as dialogs are removed
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits([
  'close',
  'update-decision',
  'edit-application',
  'delete-application',
  'preview-approval-letter',
])

const closeModal = () => {
  emit('close')
}

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
  conditionText: '',
  remarksText: '',
})

const showEditModal = ref(false)

// Full Edit Form Data
const editForm = reactive({
  ecpfName: '',
  ecpfLocation: '',
  proprietorName: '',
  cid: '',
  contactNo: '',
  emailAddress: '',
  fairName: '',
  fairDescription: '',
  fairLocation: '',
  representatives: [],
  institutes: [],
})

const submitDecision = () => {
  emit('update-decision', {
    applicationId: props.application.id,
    decisionData: verificationForm.value,
  })
  closeModal()
}

const previewApprovalLetter = () => {
  emit('preview-approval-letter', {
    applicationId: props.application.id,
  })
  // closeModal(); // Decide if you want to close modal after preview or not
}

const saveFullEdit = () => {
  const formData = new FormData()

  // Append basic fields from editForm
  for (const key in editForm) {
    if (['representatives', 'institutes'].includes(key)) continue // Handle these separately
    formData.append(key, editForm[key] || '')
  }

  // Handle Representatives
  editForm.representatives.forEach((rep, index) => {
    formData.append(`representatives[${index}][name]`, rep.name || '')
    formData.append(`representatives[${index}][passportNo]`, rep.passportNo || '')
    formData.append(`representatives[${index}][nationality]`, rep.nationality || '')
    formData.append(`representatives[${index}][arrivalDate]`, rep.arrivalDate || '')
    formData.append(`representatives[${index}][departureDate]`, rep.departureDate || '')
    if (rep.cvFile) {
      formData.append(`representatives[${index}][cvFile]`, rep.cvFile)
    }
  })
  formData.append('representatives', JSON.stringify(editForm.representatives)) // Send array structure for backend processing

  // Handle Institutes
  editForm.institutes.forEach((institute, index) => {
    formData.append(`institutes[${index}][institutionName]`, institute.institutionName || '')
    formData.append(`institutes[${index}][location]`, institute.location || '')
    formData.append(`institutes[${index}][zoneState]`, institute.zoneState || '')
    formData.append(`institutes[${index}][country]`, institute.country || '')
    formData.append(`institutes[${index}][website]`, institute.website || '')
    formData.append(`institutes[${index}][contactPerson]`, institute.contactPerson || '')
    formData.append(`institutes[${index}][affiliatedCollege]`, institute.affiliatedCollege || '')
    formData.append(`institutes[${index}][universityType]`, institute.universityType || '')
    formData.append(`institutes[${index}][recognitionCode]`, institute.recognitionCode || '')
    formData.append(`institutes[${index}][courseDetails]`, institute.courseDetails || '')
    formData.append(`institutes[${index}][accreditedBy]`, institute.accreditedBy || '')
    formData.append(`institutes[${index}][remarks]`, institute.remarks || '')
    if (institute.authorizationLetterFile) {
      formData.append(
        `institutes[${index}][authorizationLetterFile]`,
        institute.authorizationLetterFile,
      )
    }
  })
  formData.append('institutes', JSON.stringify(editForm.institutes)) // Send array structure for backend processing

  emit('edit-application', {
    applicationId: props.application.id,
    data: formData,
  })
  showEditModal.value = false
}

const deleteApplication = () => {
  if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
    emit('delete-application', {
      applicationId: props.application.id,
    })
    showEditModal.value = false
    closeModal()
  }
}

// Representative Edit Functions
const addRepresentative = () => {
  editForm.representatives.push({
    name: '',
    passportNo: '',
    nationality: '',
    arrivalDate: '',
    departureDate: '',
    cvFile: null,
    cvFileName: '',
  })
}

const removeRepresentative = (index) => {
  editForm.representatives.splice(index, 1)
}
const handleRepCVUpload = (event, index) => {
  const file = event.target.files[0]
  editForm.representatives[index].cvFile = file
  editForm.representatives[index].cvFileName = file ? file.name : ''
}

// Institute Edit Functions
const addInstitute = () => {
  editForm.institutes.push({
    institutionName: '',
    location: '',
    zoneState: '',
    country: '',
    website: '',
    contactPerson: '',
    affiliatedCollege: '',
    universityType: '',
    recognitionCode: '',
    courseDetails: '',
    accreditedBy: '',
    authorizationLetterFile: null,
    authorizationLetterName: '',
    remarks: '',
  })
}

const removeInstitute = (index) => {
  editForm.institutes.splice(index, 1)
}
const handleAuthorizationLetterUpload = (event, index) => {
  const file = event.target.files[0]
  editForm.institutes[index].authorizationLetterFile = file
  editForm.institutes[index].authorizationLetterName = file ? file.name : ''
}

watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      verificationForm.value.verificationDecision = newApplication.chiefDecision || '' // Assuming backend field is chiefDecision
      verificationForm.value.regretReason = newApplication.regretReasonChief || '' // Assuming backend field is regretReasonChief
      verificationForm.value.conditionText = newApplication.conditionChief || '' // Assuming backend field is conditionChief
      verificationForm.value.remarksText = newApplication.chiefRemarks || '' // Assuming backend field is chiefRemarks

      // Initialize Edit Form
      editForm.ecpfName = newApplication.ecpfName || ''
      editForm.ecpfLocation = newApplication.ecpfLocation || ''
      editForm.proprietorName = newApplication.proprietorName || ''
      editForm.cid = newApplication.cid || ''
      editForm.contactNo = newApplication.contactNo || ''
      editForm.emailAddress = newApplication.emailAddress || ''
      editForm.fairName = newApplication.fairName || ''
      editForm.fairDescription = newApplication.fairDescription || ''
      editForm.fairLocation = newApplication.fairLocation || ''
      editForm.representatives = newApplication.representatives
        ? newApplication.representatives.map((rep) => ({
            ...rep,
            cvFile: null,
            cvFileName: rep.cvFileName || '',
          }))
        : [] // Initialize files to null
      editForm.institutes = newApplication.institutes
        ? newApplication.institutes.map((inst) => ({
            ...inst,
            authorizationLetterFile: null,
            authorizationLetterName: inst.authorizationLetterName || '',
          }))
        : [] // Initialize files to null
    }
  },
  { immediate: true },
)
</script>
