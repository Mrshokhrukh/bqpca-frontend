```vue
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4 text-center">
        <!-- Background Overlay -->
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
          v-if="!isApproveDialogOpen && !isRejectDialogOpen"
        >
          <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <!-- Modal Panel -->
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
          <DialogPanel class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 text-left align-middle shadow-2xl transition-all max-h-[95vh]">
            <div v-if="transformedApplication" class="flex flex-col max-h-[95vh]">
              <!-- Header / Status Banner -->
              <div :class="['px-4 py-3 sm:px-8 sm:py-5 border-b relative overflow-hidden flex-shrink-0', getStatusBannerClasses(overallStatus)]">
                <div class="flex items-center justify-between relative z-10">
                  <div class="flex items-center space-x-4">
                    <div class="p-3 bg-white rounded-lg shadow-sm"> <FileText class="h-7 w-7 text-gray-700" /> </div>
                    <div>
                      <DialogTitle as="h3" class="text-lg sm:text-2xl font-semibold text-gray-900"> DPR Application Details </DialogTitle>
                      <p class="text-xs sm:text-sm text-gray-600 mt-1"> Review DPR application information (ID: #{{ transformedApplication.id }}) </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3 sm:space-x-4">
                    <span :class="['px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium inline-flex items-center space-x-2 shadow-sm', getStatusBadgeClasses(overallStatus)]" style="z-index: 11">
                      <Circle :class="['h-3 w-3 sm:h-3.5 sm:w-3.5', getStatusCircleClasses(overallStatus)]" />
                      <span>{{ overallStatus }}</span>
                    </span>
                    <!-- New Edit Button -->
                    <button
                      v-if="!isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="startEditing"
                    >
                      <Pencil class="h-4 w-4" />

                    </button>
                    <button
                      type="button"
                      class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                      @click="closeModalHandler"
                    >
                      <span class="sr-only">Close</span>
                      <X class="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <!-- Decorative pattern -->
                <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
                  <div class="transform rotate-45">
                    <FileText class="h-32 w-32" />
                    <button v-if="!isEditing" type="button" class="p-2 text-blue-600 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center" @click="startEditing" title="Edit Application"> <Pencil class="h-4 w-4" /> </button>
                    <button type="button" class="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400" @click="closeModalHandler" title="Close"> <span class="sr-only">Close</span> <X class="h-5 w-5 sm:h-6 sm:w-6" /> </button>
                  </div>
                </div>
              </div>

              <!-- Main Scrollable Content -->
              <div class="px-4 py-4 sm:px-8 sm:py-6 bg-white overflow-y-auto flex-grow">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-4 sm:space-y-5">
                    <!-- Proponent Details Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2"> <Info class="h-5 w-5 text-gray-500" /> <span>Proponent Details</span> </h4>
                      <div class="space-y-3 text-sm">
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">CID:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.cid || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Full Name:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.fullName || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Gender:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.gender || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Contact:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{ transformedApplication.contactNo || 'N/A' }}</span>
                          <input v-else type="text" v-model="editedApplication.contactNo" class="form-input w-3/5 text-sm py-1">
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Email:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800 break-all">{{ transformedApplication.emailAddress || 'N/A' }}</span>
                          <input v-else type="email" v-model="editedApplication.emailAddress" class="form-input w-3/5 text-sm py-1">
                        </div>
                      </div>
                    </div>

                    <!-- Institute Details Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2"> <MapPin class="h-5 w-5 text-gray-500" /> <span>Institute Details</span> </h4>
                      <div class="space-y-3 text-sm">
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Institution:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.nameOfInstitution || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Country:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.country || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Gewog/State:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.gewog || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Chiwog:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.chiwog || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Teaching Institute:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.teachingInstitute || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Course Title:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.titleOfCourse || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Course Duration:</span>
                          <span class="w-3/5 text-gray-800">{{ transformedApplication.courseDuration || 'N/A' }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Commencement:</span>
                          <span class="w-3/5 text-gray-800">{{ formatDate(transformedApplication.commencementDate) }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Programme Type:</span>
                          <span class="w-3/5 text-gray-800">{{ mapProgramType(transformedApplication.typeOfProgramme) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Head of Institution Details Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2"> <User class="h-5 w-5 text-gray-500" /> <span>Head of Institution</span> </h4>
                      <div class="space-y-3 text-sm">
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Name:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{ transformedApplication.headName || 'N/A' }}</span>
                          <input v-else type="text" v-model="editedApplication.headName" class="form-input w-3/5 text-sm py-1">
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Gender:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{ transformedApplication.headGender || 'N/A' }}</span>
                          <input v-else type="text" v-model="editedApplication.headGender" class="form-input w-3/5 text-sm py-1">
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Phone:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{ transformedApplication.headPhone || 'N/A' }}</span>
                          <input v-else type="text" v-model="editedApplication.headPhone" class="form-input w-3/5 text-sm py-1">
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Email:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800 break-all">{{ transformedApplication.headEmail || 'N/A' }}</span>
                          <input v-else type="email" v-model="editedApplication.headEmail" class="form-input w-3/5 text-sm py-1">
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-4 sm:space-y-5">
                    <!-- DPR Details Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2"> <ClipboardList class="h-5 w-5 text-gray-500" /> <span>DPR Details</span> </h4>
                      <div class="space-y-4 text-sm">
                        <div class="flex flex-col sm:flex-row">
                          <span class="w-full sm:w-2/5 font-medium text-gray-500 mb-1 sm:mb-0">DPR Name:</span>
                          <span v-if="!isEditing" class="w-full sm:w-3/5 text-gray-800">{{ transformedApplication.dprName || 'N/A' }}</span>
                          <input v-else type="text" v-model="editedApplication.dprName" class="form-input w-full sm:w-3/5 text-sm py-1">
                        </div>
                        <div class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Executive Summary:</span>
                          <p v-if="!isEditing" class="text-gray-800 whitespace-pre-wrap">{{ transformedApplication.executiveSummary || 'N/A' }}</p>
                          <textarea v-else v-model="editedApplication.executiveSummary" rows="3" class="form-input w-full text-sm py-1"></textarea>
                        </div>
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Supporting Docs (PDF only)</label>
                          <div v-if="isEditing" class="mt-1">
                            <input type="file" accept="application/pdf" @change="handleFileUpload($event, 'supportingDocuments')" class="file-input">
                            <a v-if="!filesToUpload.supportingDocuments && transformedApplication.supportingDocuments" :href="transformedApplication.supportingDocuments" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 inline-block">View current</a>
                          </div>
                          <a v-else-if="transformedApplication.supportingDocuments" :href="transformedApplication.supportingDocuments" target="_blank" class="text-sm text-blue-600 hover:underline">View Document</a>
                          <span v-else class="text-sm text-gray-500 italic">Not available</span>
                        </div>
                        <div class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Remarks:</span>
                          <p v-if="!isEditing" class="text-gray-800 whitespace-pre-wrap">{{ transformedApplication.remarks || 'N/A' }}</p>
                          <textarea v-else v-model="editedApplication.remarks" rows="3" class="form-input w-full text-sm py-1"></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- DPR Review Stage Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2"> <MessageSquare class="h-5 w-5 text-gray-500" /> <span>DPR Review Stage</span> </h4>
                      <div class="space-y-4 text-sm">
                        <div class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">DPR Review Report:</span>
                          <p v-if="!isEditing" class="text-gray-800 whitespace-pre-wrap">{{ transformedApplication.dprReviewReport || 'N/A' }}</p>
                          <textarea v-else v-model="editedApplication.dprReviewReport" rows="3" class="form-input w-full text-sm py-1"></textarea>
                        </div>
                        <div class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Review Summary:</span>
                          <p v-if="!isEditing" class="text-gray-800 whitespace-pre-wrap">{{ transformedApplication.reviewSummary || 'N/A' }}</p>
                          <textarea v-else v-model="editedApplication.reviewSummary" rows="3" class="form-input w-full text-sm py-1"></textarea>
                        </div>
                        <div>
                          <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Review Report Upload (PDF only)</label>
                          <div v-if="isEditing" class="mt-1">
                            <input type="file" accept="application/pdf" @change="handleFileUpload($event, 'reviewReportUpload')" class="file-input">
                            <a v-if="!filesToUpload.reviewReportUpload && transformedApplication.reviewReportUpload" :href="transformedApplication.reviewReportUpload" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 inline-block">View current</a>
                          </div>
                          <a v-else-if="transformedApplication.reviewReportUpload" :href="transformedApplication.reviewReportUpload" target="_blank" class="text-sm text-blue-600 hover:underline">View Document</a>
                          <span v-else class="text-sm text-gray-500 italic">Not available</span>
                        </div>
                        <div class="flex flex-col sm:flex-row">
                          <span class="w-full sm:w-2/5 font-medium text-gray-500 mb-1 sm:mb-0">Review Decision:</span>
                          <span v-if="!isEditing" class="w-full sm:w-3/5 text-gray-800">{{ transformedApplication.dprReviewDecision || 'Pending' }}</span>
                          <select v-else v-model="editedApplication.dprReviewDecision" class="form-input w-full sm:w-3/5 text-sm py-1">
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Regretted">Regretted</option>
                          </select>
                        </div>
                        <div v-if="overallStatus === 'Regretted' || (isEditing && editedApplication.dprReviewDecision === 'Regretted')" class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Reason for Regret:</span>
                          <p v-if="!isEditing" class="text-gray-800 whitespace-pre-wrap">{{ transformedApplication.reasonIfRejected || 'N/A' }}</p>
                          <textarea v-else v-model="editedApplication.reasonIfRejected" rows="3" class="form-input w-full text-sm py-1"></textarea>
                        </div>
                        <div class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Remarks:</span>
                          <p v-if="!isEditing" class="text-gray-800 whitespace-pre-wrap">{{ transformedApplication.reviewRemarks || 'N/A' }}</p>
                          <textarea v-else v-model="editedApplication.reviewRemarks" rows="3" class="form-input w-full text-sm py-1"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 sm:px-8 sm:py-4 bg-gray-100 border-t border-gray-200 flex-shrink-0">
                <div class="flex justify-between items-center">
                  <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2 flex-grow mr-4"> <CircleAlert class="h-4 w-4 flex-shrink-0" /> <span>{{ errorMessage }}</span> </div>
                  <div v-else class="flex-grow"></div>
                  <div class="flex items-center space-x-3">
                    <template v-if="isEditing">
                      <button type="button" class="btn btn-primary" @click="saveChanges" :disabled="isSaving"> <Save class="h-4 w-4" /> <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span> </button>
                      <button type="button" class="btn btn-secondary" @click="cancelEditing" :disabled="isSaving"> <X class="h-4 w-4" /> <span>Cancel</span> </button>
                    </template>
                    <template v-if="!isEditing && overallStatus === 'Pending'">
                      <button type="button" class="btn btn-success" @click="openApproveDialog"> <Check class="h-4 w-4" /> <span>Approve</span> </button>
                      <button type="button" class="btn btn-danger" @click="openRejectDialog"> <XCircle class="h-4 w-4" /> <span>Regret</span> </button>
                    </template>
                    <button v-if="!isEditing && overallStatus !== 'Pending'" type="button" class="btn btn-secondary" @click="closeModalHandler"> <X class="h-4 w-4" /> <span>Close</span> </button>
                  </div>
                </div>
              </div>

              <!-- Custom Approve Dialog -->
              <TransitionRoot appear :show="isApproveDialogOpen" as="template">
                <Dialog as="div" @close="cancelApproval" class="relative z-[60]">
                  <!-- Backdrop -->
                  <div class="fixed inset-0 bg-black/50" />

                  <!-- Full screen container -->
                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                      <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                        <div class="mb-5 text-center">
                          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                            <Check class="h-7 w-7 text-green-600" />
                          </div>
                          <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 mt-4">
                            Approve DPR Application
                          </DialogTitle>
                          <p class="mt-2 text-sm text-gray-500">
                            Please provide any notes or comments for this approval
                          </p>
                        </div>

                        <div class="mt-4">
                          <label for="approval-notes" class="block text-sm font-medium text-gray-700 mb-2">
                            Approval Notes
                          </label>
                          <textarea
                            id="approval-notes"
                            v-model="approvalNotes"
                            rows="4"
                            class="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm p-3"
                            placeholder="Enter your approval notes here..."
                          ></textarea>
                        </div>

                        <div class="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            @click="cancelApproval"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            @click="confirmApproval"
                          >
                            <Check class="w-4 h-4 mr-1.5" />
                            Approve
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              </TransitionRoot>

              <!-- Custom Reject Dialog -->
              <TransitionRoot appear :show="isRejectDialogOpen" as="template">
                <Dialog as="div" @close="cancelRejection" class="relative z-[60]">
                  <!-- Backdrop -->
                  <div class="fixed inset-0 bg-black/50" />

                  <!-- Full screen container -->
                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                      <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                        <div class="mb-5 text-center">
                          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <XCircle class="h-7 w-7 text-red-600" />
                          </div>
                          <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 mt-4">
                            Regret DPR Application
                          </DialogTitle>
                          <p class="mt-2 text-sm text-gray-500">
                            Please provide a reason for rejecting this application
                          </p>
                        </div>

                        <div class="mt-4">
                          <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rejection <span class="text-red-500">*</span>
                          </label>
                          <textarea
                            id="rejection-reason"
                            v-model="rejectionReason"
                            rows="4"
                            class="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-3"
                            placeholder="Please provide a reason for rejecting this application..."
                          ></textarea>
                          <p v-if="rejectionError" class="mt-1 text-xs text-red-600">{{ rejectionError }}</p>
                        </div>

                        <div class="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            @click="cancelRejection"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            :disabled="!rejectionReason.trim()"
                            :class="[
                              'inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
                              rejectionReason.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'
                            ]"
                            @click="confirmRejection"
                          >
                            <XCircle class="w-4 h-4 mr-1.5" />
                            Regret
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              </TransitionRoot>

              <!-- Success Notification -->
              <Transition
                enter="transform transition ease-in-out duration-500"
                enter-from="translate-y-full opacity-0"
                enter-to="translate-y-0 opacity-100"
                leave="transform transition ease-in-out duration-500"
                leave-from="translate-y-0 opacity-100"
                leave-to="translate-y-full opacity-0"
              >
                <div
                  v-if="showSuccess"
                  class="fixed bottom-6 right-6 flex items-center p-4 mb-4 shadow-lg rounded-lg z-[100]"
                  :class="[
                    successType === 'approve' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
                    successType === 'reject' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
                    'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                  ]"
                >
                  <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg mr-3"
                    :class="[
                      successType === 'approve' ? 'bg-green-200 text-green-600' :
                      successType === 'reject' ? 'bg-red-200 text-red-600' :
                      'bg-blue-200 text-blue-600'
                    ]"
                  >
                    <Check v-if="successType === 'approve'" class="w-5 h-5" />
                    <XCircle v-else-if="successType === 'reject'" class="w-5 h-5" />
                    <Save v-else class="w-5 h-5" />
                  </div>
                  <div class="ml-3 text-sm font-medium mr-8">{{ successMessage }}</div>
                  <button
                    type="button"
                    class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 items-center justify-center"
                    :class="[
                      successType === 'approve' ? 'bg-green-200 text-green-600 hover:bg-green-300 focus:ring-green-400' :
                      successType === 'reject' ? 'bg-red-200 text-red-600 hover:bg-red-300 focus:ring-red-400' :
                      'bg-blue-200 text-blue-600 hover:bg-blue-300 focus:ring-blue-400'
                    ]"
                    @click="closeSuccessNotification"
                  >
                    <span class="sr-only">Close</span>
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </Transition>
            </div>

            <div v-else class="p-10 text-center text-gray-500">
              Loading application details or application not found...
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import {
  MapPin, FileText, Circle, X, Pencil, Save, Check, XCircle,
  Info, MessageSquare, ClipboardList, CircleAlert, User
} from 'lucide-vue-next';
import apiService from '@/services/services';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  application: { type: Object, default: () => null },
});

const emit = defineEmits(['close', 'save', 'approve', 'regretted']);

const isEditing = ref(false);
const editedApplication = ref({});
const errorMessage = ref('');
const isSaving = ref(false);
const filesToUpload = ref({});

// Dialog and notification states
const isApproveDialogOpen = ref(false);
const isRejectDialogOpen = ref(false);
const approvalNotes = ref('');
const rejectionReason = ref('');
const rejectionError = ref('');

// Success notification state
const showSuccess = ref(false);
const successMessage = ref('');
const successType = ref('');
const successTimeoutId = ref(null);

// Transform snake_case JSON keys to camelCase
const transformedApplication = computed(() => {
  if (!props.application) return null;
  return {
    id: props.application.id,
    cid: props.application.CID,
    fullName: props.application.full_name,
    gender: props.application.gender,
    contactNo: props.application.contact_no,
    emailAddress: props.application.email_address,
    nameOfInstitution: props.application.name_of_institution,
    country: props.application.country,
    gewog: props.application.gewog,
    chiwog: props.application.chiwog,
    teachingInstitute: props.application.teaching_institute,
    titleOfCourse: props.application.title_of_course,
    courseDuration: props.application.course_duration,
    commencementDate: props.application.commencement_date,
    typeOfProgramme: props.application.type_of_programme,
    supportingDocuments: props.application.supporting_documents,
    remarks: props.application.remarks,
    headName: props.application.head_of_institution_name,
    headGender: props.application.head_of_institution_gender,
    headPhone: props.application.head_of_institution_phone_number,
    headEmail: props.application.head_of_institution_email,
    dprName: props.application.dpr_name,
    executiveSummary: props.application.executive_summary,
    dprReviewReport: props.application.do_dpr_review_report,
    reviewSummary: props.application.do_dpr_review_summary,
    reviewReportUpload: props.application.do_dpr_report,
    dprReviewDecision: props.application.do_dpr_review_decision,
    reasonIfRejected: props.application.reason_if_rejected,
    reviewRemarks: props.application.institute_dpr_remarks,
  };
});

const overallStatus = computed(() => {
  return transformedApplication.value?.dprReviewDecision || 'Pending';
});

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.application) {
    isEditing.value = false;
    errorMessage.value = '';
    isSaving.value = false;
    isApproveDialogOpen.value = false;
    isRejectDialogOpen.value = false;
    rejectionError.value = '';
    filesToUpload.value = {};
    showSuccess.value = false; // Reset notification state when modal opens
  }
});

const startEditing = () => {
  if (!transformedApplication.value) return;
  editedApplication.value = JSON.parse(JSON.stringify(transformedApplication.value));
  const fields = [
    'contactNo', 'emailAddress', 'headName', 'headGender', 'headPhone', 'headEmail',
    'dprName', 'executiveSummary', 'remarks', 'dprReviewReport', 'reviewSummary',
    'dprReviewDecision', 'reasonIfRejected', 'reviewRemarks'
  ];
  fields.forEach(field => {
    if (editedApplication.value[field] === null || editedApplication.value[field] === undefined) {
      editedApplication.value[field] = '';
    }
  });
  filesToUpload.value = {};
  isEditing.value = true;
  errorMessage.value = '';
};

const cancelEditing = () => {
  isEditing.value = false;
  errorMessage.value = '';
  filesToUpload.value = {};
};

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.type !== 'application/pdf') {
      errorMessage.value = 'Please upload a PDF file.';
      return;
    }
    filesToUpload.value[fieldName] = file;
    console.log(`Staged file for ${fieldName}:`, file.name);
  } else {
    delete filesToUpload.value[fieldName];
    console.log(`Removed staged file for ${fieldName}`);
  }
};

// Helper function to show success notification
const showSuccessNotification = (message, type) => {
  console.log('showSuccessNotification called with message:', message);
  successMessage.value = message;
  successType.value = type;
  showSuccess.value = true;

  // Auto-hide the notification after 7 seconds
  if (successTimeoutId.value) {
    clearTimeout(successTimeoutId.value);
  }
  successTimeoutId.value = setTimeout(() => {
    console.log('Hiding success notification');
    showSuccess.value = false;
  }, 7000);
};

// Function to close success notification
const closeSuccessNotification = () => {
  console.log('Closing success notification manually');
  showSuccess.value = false;
  if (successTimeoutId.value) {
    clearTimeout(successTimeoutId.value);
  }
};

const saveChanges = async () => {
  if (!transformedApplication.value?.id || !isEditing.value) return;
  isSaving.value = true;
  errorMessage.value = '';

  try {
    const formData = new FormData();
    const fieldMap = {
      contactNo: 'contact_no',
      emailAddress: 'email_address',
      headName: 'head_of_institution_name',
      headGender: 'head_of_institution_gender',
      headPhone: 'head_of_institution_phone_number',
      headEmail: 'head_of_institution_email',
      dprName: 'dpr_name',
      executiveSummary: 'executive_summary',
      remarks: 'remarks',
      dprReviewReport: 'do_dpr_review_report',
      reviewSummary: 'do_dpr_review_summary',
      dprReviewDecision: 'do_dpr_review_decision',
      reasonIfRejected: 'reason_if_rejected',
      reviewRemarks: 'institute_dpr_remarks',
      supportingDocuments: 'supporting_documents',
      reviewReportUpload: 'do_dpr_report',
    };

    // Identify changed non-file fields
    const nonFileFields = [
      'contactNo', 'emailAddress', 'headName', 'headGender', 'headPhone', 'headEmail',
      'dprName', 'executiveSummary', 'remarks', 'dprReviewReport', 'reviewSummary',
      'dprReviewDecision', 'reasonIfRejected', 'reviewRemarks'
    ];
    const changedFields = {};
    for (const key of nonFileFields) {
      const originalValue = transformedApplication.value[key];
      const editedValue = editedApplication.value[key];
      // Compare values, accounting for null/undefined cases
      if (editedValue !== originalValue && !(editedValue === '' && originalValue == null)) {
        changedFields[key] = editedValue;
      }
    }

    // Append changed non-file fields
    for (const key in changedFields) {
      if (changedFields[key] !== null && changedFields[key] !== undefined) {
        const apiKey = fieldMap[key] || key;
        formData.append(apiKey, changedFields[key]);
        console.log(`Appending changed field: ${apiKey} = ${changedFields[key]}`);
      }
    }

    // Append file fields only if new files are uploaded
    for (const fieldName in filesToUpload.value) {
      if (filesToUpload.value[fieldName] instanceof File) {
        const apiFieldName = fieldMap[fieldName] || fieldName;
        formData.append(apiFieldName, filesToUpload.value[fieldName], filesToUpload.value[fieldName].name);
        console.log(`Appending file for ${apiFieldName}:`, filesToUpload.value[fieldName].name);
      }
    }

    // Debug: Log FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(`FormData entry: ${key} =`, value);
    }

    // Check if there are any fields to send
    if (formData.entries().next().done && Object.keys(filesToUpload.value).length === 0) {
      console.log('No changes detected, skipping API call');
      isEditing.value = false;
      showSuccessNotification('No changes to save.', 'edit');
      return;
    }

    await apiService.patchEpcInstitute(transformedApplication.value.id, formData);
    console.log('Save successful');

    // Show success notification before emitting save event
    console.log('Triggering success notification');
    showSuccessNotification('Successfully edited', 'edit');
    console.log('Success notification state:', showSuccess.value);

    // Exit edit mode and emit save event
    isEditing.value = false;
    emit('save');
  } catch (error) {
    console.error('Error updating application:', error);
    let apiErrorMsg = 'Failed to save changes.';
    if (error.response?.data) {
      const errors = Object.values(error.response.data).flat();
      apiErrorMsg = errors.join(' ') || apiErrorMsg;
    } else if (error.message) {
      apiErrorMsg = error.message;
    }
    errorMessage.value = `Save failed: ${apiErrorMsg}`;
  } finally {
    isSaving.value = false;
  }
};

const closeModalHandler = () => {
  if (isEditing.value) {
    if (JSON.stringify(editedApplication.value) !== JSON.stringify(transformedApplication.value) || Object.keys(filesToUpload.value).length > 0) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        cancelEditing();
        emit('close');
      }
    } else {
      cancelEditing();
      emit('close');
    }
  } else {
    emit('close');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return 'Invalid Date';
  }
};

const mapProgramType = (code) => {
  const programMap = {
    'D': 'Diploma',
    'B': 'Bachelor',
    'M': 'Masters',
    'P': 'PhD',
  };
  return programMap[code] || code || 'N/A';
};

// Functions for custom approval/rejection dialogs
const openApproveDialog = () => {
  console.log('Opening approve dialog');
  try {
    approvalNotes.value = '';
    isApproveDialogOpen.value = true;
  } catch (error) {
    console.error('Error opening approve dialog:', error);
    errorMessage.value = 'Failed to open approve dialog.';
  }
};

const openRejectDialog = () => {
  console.log('Opening reject dialog');
  try {
    rejectionReason.value = '';
    rejectionError.value = '';
    isRejectDialogOpen.value = true;
  } catch (error) {
    console.error('Error opening reject dialog:', error);
    errorMessage.value = 'Failed to open reject dialog.';
  }
};

const cancelApproval = () => {
  isApproveDialogOpen.value = false;
  approvalNotes.value = '';
};

const cancelRejection = () => {
  isRejectDialogOpen.value = false;
  rejectionReason.value = '';
  rejectionError.value = '';
};

const confirmApproval = async () => {
  if (!transformedApplication.value?.id) return;

  try {
    const updateData = {
      do_dpr_review_decision: 'Approved',
      institute_dpr_remarks: approvalNotes.value.trim() || 'Application approved',
    };

    await apiService.patchEpcInstitute(transformedApplication.value.id, updateData);
    console.log('DPR approval successful');

    emit('approve', {...transformedApplication.value, ...updateData});
    isApproveDialogOpen.value = false;

    // Show custom success notification
    showSuccessNotification(
      `DPR application approved successfully. Notification sent to ${transformedApplication.value.nameOfInstitution}.`,
      'approve'
    );
  } catch (error) {
    console.error('Error approving DPR:', error);
    let apiErrorMsg = 'Failed to approve application.';
    if (error.response?.data) {
      apiErrorMsg = Object.values(error.response.data).flat().join(' ') || apiErrorMsg;
    } else if (error.message) {
      apiErrorMsg = error.message;
    }
    errorMessage.value = `Error: ${apiErrorMsg}`;
  }
};

const confirmRejection = async () => {
  if (!rejectionReason.value.trim()) {
    rejectionError.value = 'Reason for regret is required.';
    return;
  }

  if (!transformedApplication.value?.id) return;

  try {
    const updateData = {
      do_dpr_review_decision: 'Regretted',
      reason_if_rejected: rejectionReason.value.trim(),
    };

    await apiService.patchEpcInstitute(transformedApplication.value.id, updateData);
    console.log('DPR rejection successful');

    emit('regretted', {...transformedApplication.value, ...updateData});
    isRejectDialogOpen.value = false;

    // Show custom success notification
    showSuccessNotification(
      `DPR application has been regretted. Notification sent to ${transformedApplication.value.nameOfInstitution}.`,
      'reject'
    );
  } catch (error) {
    console.error('Error rejecting DPR:', error);
    let apiErrorMsg = 'Failed to regret application.';
    if (error.response?.data) {
      apiErrorMsg = Object.values(error.response.data).flat().join(' ') || apiErrorMsg;
    } else if (error.message) {
      apiErrorMsg = error.message;
    }
    rejectionError.value = `Error: ${apiErrorMsg}`;
  }
};

const getStatusBannerClasses = (status) => ({
  'bg-green-50 border-green-200': status === 'Approved',
  'bg-red-50 border-red-200': status === 'Regretted',
  'bg-yellow-50 border-yellow-200': status === 'Pending',
});

const getStatusBadgeClasses = (status) => ({
  'bg-green-100 text-green-800': status === 'Approved',
  'bg-red-100 text-red-800': status === 'Regretted',
  'bg-yellow-100 text-yellow-800': status === 'Pending',
});

const getStatusCircleClasses = (status) => ({
  'text-green-500': status === 'Approved',
  'text-red-500': status === 'Regretted',
  'text-yellow-500': status === 'Pending',
});
</script>

<style scoped>
.form-input {
  @apply block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100;
}
.file-input {
  @apply block w-full text-xs text-gray-600 file:mr-3 file:py-1 file:px-2
         file:rounded-md file:border-0 file:text-xs file:font-semibold
         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer;
}
.btn {
  @apply inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50;
}
.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}
.btn-secondary {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500;
}
.btn-success {
  @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500;
}
.btn-danger {
  @apply text-white bg-red-600 hover:bg-red-700 focus:ring-red-500;
}
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') transparent;
}
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.300');
  border-radius: 3px;
}
.dialog-panel {
  position: relative;
  z-index: 1000;
  isolation: isolate;
  background: white !important;
  opacity: 1 !important;
}
</style>
```
