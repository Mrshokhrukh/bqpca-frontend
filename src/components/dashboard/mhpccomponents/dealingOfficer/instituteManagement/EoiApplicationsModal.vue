<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <!-- Main Modal Overlay -->
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Main Modal Panel -->
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application"
              style="max-width: 60rem;"
            >
              <!-- Enhanced Status Banner -->
              <div
                :class="[
                  'px-8 py-6 border-b relative overflow-hidden',
                  {
                    'bg-yellow-50 border-yellow-100': overallStatus === 'Pending' || overallStatus === 'Pending Physical Verification',
                    'bg-green-50 border-green-100': overallStatus === 'Approved',
                    'bg-red-50 border-red-100': overallStatus === 'Regretted',
                  },
                ]"
              >
                <div class="flex items-center justify-between relative z-10">
                  <div class="flex items-center space-x-4">
                    <div class="p-3 bg-white rounded-lg shadow-sm">
                      <FileText class="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                        EOI Application Details
                        {{ isEditing ? '(Editing)' : '' }}
                      </DialogTitle>
                      <p class="text-sm text-gray-600 mt-1">
                        Review and manage EOI application information
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span
                      :class="[
                        'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                        {
                          'bg-yellow-100 text-yellow-800': overallStatus === 'Pending' || overallStatus === 'Pending Physical Verification',
                          'bg-green-100 text-green-800': overallStatus === 'Approved',
                          'bg-red-100 text-red-800': overallStatus === 'Regretted',
                        },
                      ]"
                    >
                      <Circle
                        class="h-4 w-4"
                        :class="{
                          'text-yellow-500': overallStatus === 'Pending' || overallStatus === 'Pending Physical Verification',
                          'text-green-500': overallStatus === 'Approved',
                          'text-red-500': overallStatus === 'Regretted',
                        }"
                      />
                      <span>{{ overallStatus }}</span>
                    </span>
                    <button
                      type="button"
                      class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                      @click="closeModal"
                    >
                      <span class="sr-only">Close</span>
                      <X class="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
                  <div class="transform rotate-45">
                    <FileText class="h-32 w-32" />
                  </div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <!-- Institute Information Card -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-6">
                        <h4
                          class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                        >
                          <User class="h-5 w-5 text-gray-500" />
                          <span>Institute Information</span>
                        </h4>
                        <div class="flex flex-col items-start space-y-4">
                          <!-- Name -->
                          <div>
                            <h5 v-if="!isEditing" class="text-xl font-semibold text-gray-900">
                              {{ application.name_of_institution }}
                            </h5>
                            <input
                              v-else
                              type="text"
                              v-model="editableApplication.name_of_institution"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                              placeholder="Institute Name"
                            />
                          </div>
                          <!-- Address -->
                          <div class="w-full grid grid-cols-1 gap-4 mt-4">
                            <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                              <UserCircle class="h-4 w-4 text-gray-400 flex-shrink-0" /> <!-- Changed to UserCircle as MapPin is for location -->
                              <span v-if="!isEditing" class="text-sm text-gray-600">{{
                                application.address
                              }}</span>
                              <input
                                v-else
                                type="text"
                                v-model="editableApplication.address"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Address"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Contact Information Card -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-6">
                        <h4
                          class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                        >
                          <Contact class="h-5 w-5 text-gray-500" />
                          <span>Contact Information</span>
                        </h4>
                        <div class="space-y-4">
                          <!-- Email -->
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Mail class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-sm text-gray-600">{{
                              application.email_address
                            }}</span>
                            <input
                              v-else
                              type="email"
                              v-model="editableApplication.email_address"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Email Address"
                            />
                          </div>
                          <!-- Phone -->
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Phone class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-sm text-gray-600">{{
                              application.contact_no
                            }}</span>
                            <input
                              v-else
                              type="tel"
                              v-model="editableApplication.contact_no"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Contact Number"
                            />
                          </div>
                          <!-- Location -->
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <template v-if="!isEditing">
                              <span class="text-sm text-gray-600">
                                {{ application.village }},
                                {{ application.dzongkhag }}
                              </span>
                            </template>
                            <template v-else>
                              <div class="flex space-x-2 w-full">
                                <input
                                  type="text"
                                  v-model="editableApplication.village"
                                  class="w-1/2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Village"
                                />
                                <input
                                  type="text"
                                  v-model="editableApplication.dzongkhag"
                                  class="w-1/2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Dzongkhag"
                                />
                              </div>
                            </template>
                          </div>
                          <!-- Website -->
                          <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                             <UserCircle class="h-4 w-4 text-gray-400 flex-shrink-0" /> <!-- Or Globe icon -->
                            <span v-if="!isEditing" class="text-sm text-gray-600">{{
                              application.website || 'N/A'
                            }}</span>
                            <input
                              v-else
                              type="url"
                              v-model="editableApplication.website"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Website URL"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Application Details Card -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-6">
                        <h4
                          class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                        >
                          <FileText class="h-5 w-5 text-gray-500" />
                          <span>Application Details</span>
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <!-- Application ID (CID) -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Applicant ID (CID)</p>
                            <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <FileCheck class="h-4 w-4 text-gray-400" />
                              <span>{{ application.CID }}</span>
                            </p>
                          </div>
                          <!-- Program Type -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Program Type</p>
                            <template v-if="!isEditing">
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Hash class="h-4 w-4 text-gray-400" />
                                <span>{{ application.program_type?.program_name || 'N/A' }}</span>
                              </p>
                            </template>
                            <template v-else>
                              <input
                                type="text"
                                v-model="editableApplication.type_of_programme"
                                class="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Program Type Name"
                              />
                            </template>
                          </div>
                          <!-- Date Submitted -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Date Submitted</p>
                            <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Calendar class="h-4 w-4 text-gray-400" />
                              <span>{{ formatDate(application.created_at) }}</span>
                            </p>
                          </div>

                          <!-- Supporting Documents -->
                          <div class="p-4 bg-gray-50 rounded-lg md:col-span-2">
                            <p class="text-sm font-medium text-gray-500">Supporting Documents</p>
                            <template v-if="!isEditing">
                              <p class="text-sm text-gray-900 mt-2">
                                <a
                                  v-if="application.institute_eoi_supporting_documents"
                                  :href="application.institute_eoi_supporting_documents"
                                  target="_blank"
                                  class="text-blue-600 hover:underline flex items-center space-x-2"
                                >
                                  <FileText class="h-4 w-4" />
                                  <span>View Document</span>
                                </a>
                                <span v-else class="text-gray-500">No document uploaded</span>
                              </p>
                            </template>
                            <template v-else>
                              <div class="mt-2">
                                <input
                                  type="file"
                                  ref="fileInput"
                                  @change="handleFileChange"
                                  accept=".pdf"
                                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p v-if="fileName" class="text-sm text-gray-600 mt-2">
                                  Selected: {{ fileName }}
                                </p>
                                <p
                                  v-else-if="
                                    application.institute_eoi_supporting_documents &&
                                    editableApplication &&
                                    !selectedFile
                                  "
                                  class="text-sm text-gray-600 mt-2"
                                >
                                  Current:
                                  <a
                                    :href="application.institute_eoi_supporting_documents"
                                    target="_blank"
                                    class="text-blue-600 hover:underline"
                                    >Existing Document</a
                                  >
                                </p>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Physical Verification Card -->
                    <div
                      v-if="application"
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                          <h4 class="text-lg font-medium text-gray-900 flex items-center space-x-2">
                            <ClipboardCheck class="h-5 w-5 text-gray-500" />
                            <span>Physical Verification</span>
                          </h4>
                          <button
                            v-if="overallStatus === 'Pending Physical Verification' && !isEditingPhysicalVerification && !isEditing"
                            type="button"
                            class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-1"
                            @click="startEditingPhysicalVerification"
                            :disabled="isSaving"
                          >
                            <Pencil class="h-3 w-3" />
                            <span>Update Details</span>
                          </button>
                        </div>

                        <div v-if="!isEditingPhysicalVerification" class="space-y-4">
                          <div>
                            <p class="text-sm font-medium text-gray-500">Verification Date</p>

                            <p class="text-sm text-gray-900 mt-1">
                              {{ application.physical_verification_date ? formatDate(application.physical_verification_date) : 'Not Scheduled' }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Verification Status</p>
                            <p class="text-sm text-gray-900 mt-1">
                              <span
                                :class="[
                                  'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                                  application.is_physical_verification ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                ]"
                              >
                                {{ application.is_physical_verification ? 'Completed' : 'Pending' }}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-gray-500">Remarks</p>
                            <p class="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                              {{ application.physical_verification_remarks || 'No remarks provided.' }}
                            </p>
                          </div>
                        </div>

                        <div v-else class="space-y-4">
                          <div>
                            <label for="pv_date" class="block text-sm font-medium text-gray-700">Verification Date</label>
                            <input
                              type="date"
                              id="pv_date"
                              v-model="editablePhysicalVerificationDetails.date"
                              class="mt-1 block w-full"
                            />
                          </div>
                          <div>
                            <label for="pv_remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
                            <textarea
                              id="pv_remarks"
                              rows="3"
                              v-model="editablePhysicalVerificationDetails.remarks"
                              class="mt-1 block w-full"
                              placeholder="Enter verification remarks..."
                            ></textarea>
                          </div>
                          <div class="flex items-center">
                            <input
                              id="pv_is_verified"
                              type="checkbox"
                              v-model="editablePhysicalVerificationDetails.is_verified"
                              class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label for="pv_is_verified" class="ml-2 block text-sm text-gray-900">
                              Mark as Verified
                            </label>
                          </div>
                          <p v-if="physicalVerificationSaveError" class="text-sm text-red-600 mt-2">{{ physicalVerificationSaveError }}</p>
                          <div class="flex justify-end space-x-3 mt-4">
                            <button
                              type="button"
                              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                              @click="cancelEditingPhysicalVerification"
                              :disabled="isSaving"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
                              @click="savePhysicalVerificationDetails"
                              :disabled="isSaving"
                            >
                              {{ isSaving ? 'Saving...' : 'Save Verification Details' }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <!-- Main Modal Footer -->
              <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                <div class="flex justify-between items-center">
                  <div
                    v-if="errorMessage || saveError"
                    class="text-sm text-red-600 flex items-center space-x-2"
                  >
                    <CircleAlert class="h-4 w-4" />
                    <span>{{ errorMessage || saveError }}</span>
                  </div>
                  <div v-else></div> <!-- Placeholder for spacing -->

                  <div class="flex items-center space-x-4">
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="closeModal"
                    >
                      <X class="h-4 w-4" />
                      <span>Close</span>
                    </button>

                    <template v-if="!isEditing && !isEditingPhysicalVerification">
                       <button
                        v-if="overallStatus === 'Pending' || overallStatus === 'Pending Physical Verification'"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="startEditing"
                        :disabled="isSaving"
                      >
                        <Pencil class="h-4 w-4" />
                        <span>Edit Application</span>
                      </button>

                      <button
                        v-if="overallStatus === 'Pending' || overallStatus === 'Pending Physical Verification'"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="openPromptDialog('reject')"
                        :disabled="isSaving"
                      >
                        <Ban class="h-4 w-4" />
                        <span>Regret Application</span>
                      </button>

                      <button
                        v-if="overallStatus === 'Pending'"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="openPromptDialog('approveToVerify')"
                        :disabled="isSaving"
                      >
                        <Circle class="h-4 w-4" /> <!-- Consider ArrowRightCircle for 'proceed' -->
                        <span>Approve for Verification</span>
                      </button>

                      <button
                        v-if="overallStatus === 'Pending Physical Verification' && application?.is_physical_verification"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="openPromptDialog('finalEOIApprove')"
                        :disabled="isSaving"
                      >
                        <CheckCircle class="h-4 w-4" />
                        <span>Finalize EOI Approval</span>
                      </button>
                    </template>

                    <template v-if="isEditing && !isEditingPhysicalVerification">
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="cancelEditing"
                        :disabled="isSaving"
                      >
                        <X class="h-4 w-4" />
                        <span>Cancel Edit</span>
                      </button>
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="saveChanges"
                        :disabled="isSaving"
                      >
                        <Save class="h-4 w-4" />
                        <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Nested Prompt Dialog for Approval/Rejection -->
              <TransitionRoot appear :show="isPromptDialogOpen" as="template">
                <Dialog as="div" @close="cancelPromptAction" class="relative z-[100]">
                  <TransitionChild
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                  >
                    <div class="fixed inset-0 bg-black/60 backdrop-blur-xs" />
                  </TransitionChild>

                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                      <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                      >
                        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                           <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                            {{
                              promptActionType === 'approveToVerify' ? 'Confirm Approval for Physical Verification' :
                              promptActionType === 'reject' ? 'Confirm Rejection' :
                              promptActionType === 'finalEOIApprove' ? 'Confirm Final EOI Approval' : 'Confirm Action'
                            }}
                          </DialogTitle>
                          <div class="mt-4">
                            <label
                              for="promptInput"
                              class="block text-sm font-medium text-gray-700 mb-1"
                            >
                              {{
                                promptActionType === 'approveToVerify' ? 'Approval Notes (Optional):' :
                                promptActionType === 'reject' ? 'Rejection Reason (Required):' :
                                promptActionType === 'finalEOIApprove' ? 'Final Approval Notes (Optional):' : 'Notes:'
                              }}
                            </label>
                            <textarea
                              id="promptInput"
                              v-model="promptInputText"
                              rows="4"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              :placeholder="
                                promptActionType === 'approveToVerify' ? 'Enter notes for moving to verification...' :
                                promptActionType === 'reject' ? 'Enter reason for rejection...' :
                                promptActionType === 'finalEOIApprove' ? 'Enter notes for final EOI approval...' : 'Enter details...'
                              "
                            ></textarea>
                            <p v-if="promptErrorMessage" class="mt-2 text-sm text-red-600">
                              {{ promptErrorMessage }}
                            </p>
                          </div>

                          <div class="mt-6 flex justify-end space-x-3">
                            <button
                              type="button"
                              class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              @click="cancelPromptAction"
                              :disabled="isSaving"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              :class="[
                                'inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                                promptActionType === 'approveToVerify' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                                promptActionType === 'reject' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                                promptActionType === 'finalEOIApprove' ? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                              ]"
                              @click="confirmPromptAction"
                              :disabled="isSaving"
                            >
                              {{
                                isSaving ? 'Processing...' :
                                (
                                  promptActionType === 'approveToVerify' ? 'Confirm for Verification' :
                                  promptActionType === 'reject' ? 'Confirm Rejection' :
                                  promptActionType === 'finalEOIApprove' ? 'Confirm Final Approval' : 'Confirm'
                                )
                              }}
                            </button>
                          </div>
                        </DialogPanel>
                      </TransitionChild>
                    </div>
                  </div>
                </Dialog>
              </TransitionRoot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  User, UserCircle, Calendar, Contact, Mail, Phone, MapPin, FileText, FileCheck, Hash,
  CircleAlert, Circle, X, Pencil, Save, Ban, ClipboardCheck, CheckCircle // Added ClipboardCheck, CheckCircle
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'application-updated'])

const errorMessage = ref('')
const saveError = ref('')
const isEditing = ref(false)
const isSaving = ref(false)
const editableApplication = ref(null)
const selectedFile = ref(null)
const fileName = ref('')
const fileInput = ref(null)

// --- State for Nested Prompt Dialog ---
const isPromptDialogOpen = ref(false)
const promptActionType = ref(null) // 'approveToVerify', 'reject', 'finalEOIApprove'
const promptInputText = ref('')
const promptErrorMessage = ref('')

// --- State for Physical Verification Editing ---
const isEditingPhysicalVerification = ref(false)
const editablePhysicalVerificationDetails = ref({
  date: null,
  remarks: '',
  is_verified: false,
})
const physicalVerificationSaveError = ref('')

const validateApplicationIdentifier = () => {
  if (!props.application?.CID) {
    errorMessage.value = 'Invalid or missing application CID.'
    toast.error(errorMessage.value);
    return false
  }
  const cid = String(props.application.CID)
  if (!cid.trim()) {
    errorMessage.value = 'Application CID is empty or invalid.'
    toast.error(errorMessage.value);
    return false
  }
  errorMessage.value = ''
  return true
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      selectedFile.value = null
      fileName.value = ''
      if (fileInput.value) fileInput.value.value = ''
      return
    }
    selectedFile.value = file
    fileName.value = file.name
  } else {
    selectedFile.value = null
    fileName.value = ''
  }
}

const closeModal = () => { // For X button click
  if (isPromptDialogOpen.value) cancelPromptAction();
  if (isEditingPhysicalVerification.value) cancelEditingPhysicalVerification();
  if (isEditing.value) cancelEditing();
  emit('close');
}

const closeModalHandler = () => { // For Dialog @close (Esc/Overlay)
  // If a prompt is open, its own @close="cancelPromptAction" should handle Esc/overlay for it.
  // This handler is for the main dialog. If it's called, attempt to clean up and close.
  if (isPromptDialogOpen.value) cancelPromptAction(); // Ensure prompt closes if its own handler didn't stop event
  if (isEditingPhysicalVerification.value) cancelEditingPhysicalVerification();
  if (isEditing.value) cancelEditing();
  emit('close');
}


const startEditing = () => {
  if (!validateApplicationIdentifier()) return
  if (isEditingPhysicalVerification.value) {
    toast.warning('Please save or cancel physical verification edits first.');
    return;
  }
  errorMessage.value = ''
  saveError.value = ''
  editableApplication.value = JSON.parse(JSON.stringify(props.application))
  editableApplication.value.type_of_programme = props.application.program_type?.program_name || ''
  delete editableApplication.value.institute_eoi_supporting_documents
  delete editableApplication.value.program_type // We only edit the name as text
  selectedFile.value = null
  fileName.value = ''
  if (fileInput.value) fileInput.value.value = ''
  isEditing.value = true
}

const cancelEditing = () => {
  editableApplication.value = null
  selectedFile.value = null
  fileName.value = ''
  if (fileInput.value) fileInput.value.value = ''
  isEditing.value = false
  saveError.value = ''
  errorMessage.value = ''
}

const saveChanges = async () => {
  if (!editableApplication.value || !validateApplicationIdentifier()) return
  isSaving.value = true
  saveError.value = ''
  errorMessage.value = ''

  try {
    const formData = new FormData()
    const fieldsToUpdate = [
      'name_of_institution', 'address', 'email_address', 'contact_no',
      'village', 'dzongkhag', 'website', 'type_of_programme',
    ]

    fieldsToUpdate.forEach((field) => {
      if (editableApplication.value[field] !== undefined && editableApplication.value[field] !== null) {
        formData.append(field, editableApplication.value[field])
      }
    })

    if (selectedFile.value) {
      formData.append('institute_eoi_supporting_documents', selectedFile.value)
    }

    const response = await apiService.patchMhpcInstitute(
      props.application.CID,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    if (response && response.status === 200 && response.data) {
      toast.success('Application Updated Successfully!')
      emit('application-updated', response.data)
      isEditing.value = false
      selectedFile.value = null
      fileName.value = ''
      if (fileInput.value) fileInput.value.value = ''
    } else {
      const serverError = response?.data?.detail || response?.data?.message || `Server responded with ${response?.status || 'unknown status'}`
      saveError.value = `Failed to save changes: ${serverError}`
      toast.error(saveError.value)
    }
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Unknown error during save'
    saveError.value = `Failed to save changes: ${errorMsg}`
    toast.error(saveError.value)
  } finally {
    isSaving.value = false
  }
}

// --- Physical Verification Methods ---
const startEditingPhysicalVerification = () => {
  if (!props.application || isEditing.value) {
    if(isEditing.value) toast.warning('Please save or cancel main application edits first.');
    return;
  }
  isEditingPhysicalVerification.value = true;
  physicalVerificationSaveError.value = '';
  let pvDate = props.application.physical_verification_date;
  if (pvDate) {
      try {
          pvDate = new Date(pvDate).toISOString().split('T')[0];
      } catch (e) {
        console.error("Error parsing physical verification date:", e);

          console.error("Invalid date format for physical verification date:", props.application.physical_verification_date);
          pvDate = null;
          console.error("Error formatting physical verification date for input: ", props.application.physical_verification_date);
      }
  }
  editablePhysicalVerificationDetails.value = {
    date: pvDate || null,
    remarks: props.application.physical_verification_remarks || '',
    is_verified: props.application.is_physical_verification || false,
  };
};

const cancelEditingPhysicalVerification = () => {
  isEditingPhysicalVerification.value = false;
  physicalVerificationSaveError.value = '';
  // Reset editable details if necessary, or they'll be overwritten on next edit
};

const savePhysicalVerificationDetails = async () => {
  if (!props.application?.CID || !validateApplicationIdentifier()) {
    physicalVerificationSaveError.value = 'Application CID is missing.';
    toast.error(physicalVerificationSaveError.value);
    return;
  }
  isSaving.value = true;
  physicalVerificationSaveError.value = '';

  const payload = {
    physical_verification_date: editablePhysicalVerificationDetails.value.date || null,
    physical_verification_remarks: editablePhysicalVerificationDetails.value.remarks.trim() || null,
    is_physical_verification: editablePhysicalVerificationDetails.value.is_verified,
  };

  try {
    const response = await apiService.patchMhpcInstitute(
      props.application.CID,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response && response.status === 200 && response.data) {
      toast.success('Physical verification details updated successfully!');
      emit('application-updated', response.data);
      isEditingPhysicalVerification.value = false;
    } else {
      const serverError = response?.data?.detail || response?.data?.message || `Server responded with ${response?.status || 'unknown status'}`;
      physicalVerificationSaveError.value = `Failed to save: ${serverError}`;
      toast.error(physicalVerificationSaveError.value);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Unknown error';
    physicalVerificationSaveError.value = `Failed to save: ${errorMsg}`;
    toast.error(physicalVerificationSaveError.value);
  } finally {
    isSaving.value = false;
  }
};
// --- End Physical Verification Methods ---


const openPromptDialog = (actionType) => {
  if (isEditing.value) {
    toast.warning('Please save or cancel main edits before proceeding.');
    return;
  }
  if (isEditingPhysicalVerification.value) {
    toast.warning('Please save or cancel physical verification edits first.');
    return;
  }
  if (!validateApplicationIdentifier()) return;
  promptActionType.value = actionType;
  promptInputText.value = '';
  promptErrorMessage.value = '';
  isPromptDialogOpen.value = true;
}

const cancelPromptAction = () => {
  isPromptDialogOpen.value = false;
  promptInputText.value = '';
  promptErrorMessage.value = '';
  promptActionType.value = null;
}

const confirmPromptAction = async () => {
  if (!validateApplicationIdentifier()) {
    toast.error("Cannot proceed: Application identifier is missing.");
    isPromptDialogOpen.value = false; // Close prompt if fundamental error
    return;
  }

  isSaving.value = true;
  promptErrorMessage.value = '';

  let payload = {};
  let successMessage = '';
  let failureMessagePrefix = '';

  const notes = promptInputText.value.trim();

  if (promptActionType.value === 'approveToVerify') {
    payload = {
      application_status: 'EOI Pending Physical Verification',
      remarks: notes || props.application.remarks, // Keep existing remarks if no new notes or append
    };
    if (notes) payload.remarks = (props.application.remarks ? props.application.remarks + '\n\n[Verification Approval Notes]:\n' : '[Verification Approval Notes]:\n') + notes;

    successMessage = `Application ${props.application.CID} approved for physical verification!`;
    failureMessagePrefix = 'Failed to approve for physical verification';

  } else if (promptActionType.value === 'reject') {
    if (!notes) { // 'notes' here is the rejection reason
      promptErrorMessage.value = 'A reason is required to reject the application.';
      isSaving.value = false;
      return;
    }
    payload = {
      application_status: 'EOI Rejected',
      reason_if_rejected: notes,
    };
    successMessage = `Application ${props.application.CID} has been successfully rejected.`;
    failureMessagePrefix = 'Failed to reject application';

  } else if (promptActionType.value === 'finalEOIApprove') {
    payload = {
      application_status: 'EOI Approved',
      remarks: notes || props.application.remarks, // Similar remark handling
    };
    if (notes) payload.remarks = (props.application.remarks ? props.application.remarks + '\n\n[Final EOI Approval Notes]:\n' : '[Final EOI Approval Notes]:\n') + notes;

    successMessage = `EOI for application ${props.application.CID} has been successfully approved!`;
    failureMessagePrefix = 'Failed to finalize EOI approval';
  } else {
    console.error("Invalid promptActionType:", promptActionType.value);
    toast.error("Invalid action type.");
    isSaving.value = false;
    return;
  }

  try {
    const response = await apiService.patchMhpcInstitute(
      props.application.CID,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response && response.status === 200 && response.data) {
      toast.success(successMessage);
      emit('application-updated', response.data);
      cancelPromptAction(); // Close prompt
      // closeModal(); // Don't auto-close main modal, let user review updated status
    } else {
      const serverError = response?.data?.detail || response?.data?.message || `Server responded with ${response?.status || 'unknown status'}`;
      promptErrorMessage.value = `${failureMessagePrefix}: ${serverError}`;
      toast.error(promptErrorMessage.value);
    }
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.response?.data?.message || error.message || 'Unknown error';
    promptErrorMessage.value = `${failureMessagePrefix}: ${errorMsg}`;
    toast.error(promptErrorMessage.value);
  } finally {
    isSaving.value = false;
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Check if it's already just a date part (YYYY-MM-DD) which input type="date" might produce
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      try {
        // Create a date object interpreting the input as UTC to avoid timezone shifts
        // for date-only strings. Then format it in UTC.
        const dateObj = new Date(Date.UTC(year, month - 1, day));
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            timeZone: 'UTC' // Crucial: Format in UTC
        });
      } catch (e) {
          console.error("Error formatting YYYY-MM-DD date:", dateString, e);
          return 'Invalid Date';
      }
  }

  // Handle full ISO date strings or other formats (assuming they might have timezone info)
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      // More robust fallback for potentially malformed date strings that aren't YYYY-MM-DD
      const parts = dateString.split(/[-T:. ]/);
      if (parts.length >= 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        // Attempt to parse as UTC if it looks like a date without time
        const fallbackDate = new Date(Date.UTC(y, m, d));
        if (!isNaN(fallbackDate.getTime())) {
          return fallbackDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
          });
        }
      }
      return 'Invalid Date';
    }
    // For full date-time strings, toLocaleDateString without timeZone option
    // will format in the user's local timezone.
    // If you always want UTC for these too, add timeZone: 'UTC' here as well.
    // However, for timestamps like 'created_at', local time might be preferred.
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid Date';
  }
}

const overallStatus = computed(() => {
  const status = props.application?.application_status || 'Pending'
  const statusMap = {
    'Draft': 'Draft',
    'EOI Submitted': 'Pending',
    'EOI Pending Review': 'Pending',
    'EOI Pending Physical Verification': 'Pending Physical Verification', // Key status
    'EOI Approved': 'Approved',
    'EOI Rejected': 'Regretted',
    'DPR Submitted': 'DPR Submitted',
    'DPR Pending Review': 'DPR Pending Review',
    'DPR Approved': 'DPR Approved',
    'DPR Rejected': 'DPR Rejected',
    'Payment Pending': 'Payment Pending',
    'Fully Approved': 'Fully Approved',
    'Final Rejected': 'Final Rejected',
  }
  return statusMap[status] || 'Pending' // Default to Pending if status unknown
})

watch(() => props.application, (newVal, oldVal) => {
  if (newVal?.CID !== oldVal?.CID || !newVal) { // Reset if application changes or becomes null
    if (isEditing.value) cancelEditing();
    if (isPromptDialogOpen.value) cancelPromptAction();
    if (isEditingPhysicalVerification.value) cancelEditingPhysicalVerification();
  }
  if (newVal && !newVal.CID) {
    errorMessage.value = 'Application data is missing its CID.';
  } else if (newVal?.CID && errorMessage.value.includes('missing its CID')) {
    errorMessage.value = '';
  }
}, { deep: true, immediate: true })

watch(() => props.isOpen, (newIsOpen) => {
  if (!newIsOpen) {
    if (isEditing.value) cancelEditing();
    if (isPromptDialogOpen.value) cancelPromptAction();
    if (isEditingPhysicalVerification.value) cancelEditingPhysicalVerification();
    errorMessage.value = '';
    saveError.value = '';
    physicalVerificationSaveError.value = '';
    promptErrorMessage.value = '';
    promptInputText.value = '';
  } else {
    // Reset states that should not persist across modal openings if not tied to specific app
    if (!isEditing.value && !isPromptDialogOpen.value && !isEditingPhysicalVerification.value) {
        editableApplication.value = null;
        selectedFile.value = null;
        fileName.value = '';
        if (fileInput.value) fileInput.value.value = '';

        editablePhysicalVerificationDetails.value = { date: null, remarks: '', is_verified: false };
        promptInputText.value = '';
        promptErrorMessage.value = '';
    }

    if (props.application && !props.application.CID) {
      errorMessage.value = 'Application data is missing its CID.';
    } else {
      errorMessage.value = '';
    }
  }
})
</script>

<style scoped>
input[type='text'],
input[type='email'],
input[type='tel'],
input[type='url'],
input[type='date'], /* Added date for styling */
textarea {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
         bg-white disabled:bg-gray-100 disabled:cursor-not-allowed;
}
.bg-gray-50 input, .bg-gray-50 textarea { /* Styles for inputs inside bg-gray-50 sections */
  @apply px-2 py-1; /* Slightly less padding */
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.whitespace-pre-wrap {
  white-space: pre-wrap; /* To respect newlines in remarks */
}
</style>