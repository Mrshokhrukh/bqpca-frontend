<template>
  <div class="p-8 rounded-xl bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 border-b pb-3 flex items-center">
      <FileText class="w-8 h-8 mr-3 text-indigo-600" />
      EPC New Educational Programme Application
    </h2>

    <div v-if="isLoading" class="flex justify-center items-center my-16 bg-white p-10 rounded-xl shadow-sm">
      <Loader class="inline-block animate-spin text-indigo-600 w-8 h-8" />
      <p class="ml-3 text-lg text-gray-600">Loading institute data...</p>
    </div>
    <div v-else-if="apiError" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg mb-8 shadow-sm">
      <div class="flex">
        <AlertCircle class="w-6 h-6 mr-3" />
        <div>
          <p class="font-medium">Error:</p>
          <p class="mt-1">{{ errorMessage }}</p>
          <p class="mt-2 text-sm">Please try again later or contact support.</p>
        </div>
      </div>
    </div>
    <div v-else-if="!userInstitute && !isLoading" class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-6 rounded-lg mb-8 shadow-sm">
      <div class="flex">
        <AlertTriangle class="w-6 h-6 mr-3" />
        <div>
          <p class="font-medium">No institute information found</p>
          <p class="mt-2">Please ensure you have registered your institute before applying for a new educational program.</p>
        </div>
      </div>
    </div>

    <div v-else>
      <section class="p-6 bg-white rounded-xl shadow-md" id="statusTableSection">
        <div class="flex justify-between items-center mb-6 border-b pb-3">
          <h3 class="text-xl font-semibold text-gray-700 flex items-center">
            <ListIcon class="w-5 h-5 mr-2 text-indigo-500" />
            Your Applications
          </h3>
          <button @click="showFormModal" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusCircle class="w-5 h-5 mr-2" />
            Add New Programme
          </button>
        </div>

        <div class="mb-6">
          <label for="searchApplication" class="block text-sm font-medium text-gray-600 mb-2">Search Applications</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input type="text" id="searchApplication" v-model.trim="searchQuery" placeholder="Enter proposal title or application ID..." class="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <p class="mt-1 text-xs text-gray-500">Search by proposal title or application ID</p>
        </div>

        <div v-if="isTableLoading" class="flex justify-center items-center py-10">
          <Loader class="inline-block animate-spin text-indigo-600 w-6 h-6" />
          <p class="ml-3 text-gray-600">Loading applications...</p>
        </div>
        <div v-else-if="tableApiError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
          <AlertOctagonIcon class="w-6 h-6 mx-auto mb-2" />
          <p>Could not load application status. Please try again later.</p>
        </div>
        <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposal Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Till</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredApplications.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
                  <FolderIcon class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div v-if="searchQuery">No applications match your search criteria.</div>
                  <div v-else>No educational programme applications found.</div>
                </td>
              </tr>
              <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{{ application.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ application.proposal_title || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(application)" class="px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit">
                    <span class="w-2 h-2 rounded-full mr-1.5" :class="getApprovalStatusDotClass(application)"></span>
                    {{ getApprovalStatusText(application) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ application.valid_till ? new Date(application.valid_till).toLocaleDateString() : 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button class="btn-action-view" @click.stop="loadApplication(application.id, false)">
                    <EyeIcon class="w-4 h-4 mr-1" /> View
                  </button>
                  <button v-if="application.is_draft" class="btn-action-edit" @click.stop="loadApplication(application.id, true)">
                    <EditIcon class="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button v-if="application.review_decision === 'Approved' && !application.is_payment_complete" @click.stop="initiatePayment(application)" class="btn btn-primary">
                    <CreditCard class="h-4 w-4 mr-1.5" /> Make Payment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="isFormModalVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" @click.self="closeFormModal">
      <div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full m-4">
        <div class="flex justify-between items-center border-b p-6">
          <h3 class="text-2xl font-bold text-gray-800 flex items-center">
            <ClipboardIcon class="w-7 h-7 mr-3 text-indigo-600" />
            {{ formModalTitle }}
          </h3>
          <button @click="closeFormModal" class="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <XIcon class="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div class="p-8 max-h-[80vh] overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <section class="p-6 bg-white rounded-xl shadow transition-shadow hover:shadow-md">
              <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-2 flex items-center"><BuildingIcon class="w-5 h-5 mr-2 text-indigo-500" /> Proponent Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600">Training Institute Name</label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700 font-medium">{{ userInstitute.name_of_institution || 'N/A' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600"> Country </label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.country || 'N/A' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600"> Dzongkhag/Throme </label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.dzongkhag || 'N/A' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600"> City/Gewog </label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.gewog || 'N/A' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600"> Address/Location </label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.address || 'N/A' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600"> Contact No. </label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.contact_no || 'N/A' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600"> Email Address </label>
                  <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.email_address || 'N/A' }}</div>
                </div>
              </div>
            </section>

            <section class="p-6 bg-white rounded-xl shadow transition-shadow hover:shadow-md">
              <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-2 flex items-center"><UserIcon class="w-5 h-5 mr-2 text-indigo-500" /> Head of Institution Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div><label class="block text-sm font-medium text-gray-600"> Name </label><div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.head_of_institution_name || 'N/A' }}</div></div>
                <div><label class="block text-sm font-medium text-gray-600"> Mobile Number </label><div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.head_of_institution_phone_number || 'N/A' }}</div></div>
                <div><label class="block text-sm font-medium text-gray-600"> Email Address </label><div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.head_of_institution_email || 'N/A' }}</div></div>
              </div>
            </section>

            <section class="p-6 bg-white rounded-xl shadow transition-shadow hover:shadow-md">
              <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-2 flex items-center"><GlobeIcon class="w-5 h-5 mr-2 text-indigo-500" /> Website</h3>
              <div><label class="block text-sm font-medium text-gray-600"> Website URL </label><div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">{{ userInstitute.website || 'N/A' }}</div></div>
            </section>

            <section class="p-6 bg-white rounded-xl shadow-md border border-indigo-100">
              <h3 class="text-xl font-semibold text-indigo-700 mb-6 border-b border-indigo-100 pb-2 flex items-center"><ClipboardIcon class="w-5 h-5 mr-2 text-indigo-500" /> Proposal Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label for="proposalTitle" class="block text-sm font-medium text-gray-700">Proposal Title <span class="text-red-500">*</span></label>
                  <input type="text" id="proposalTitle" v-model.trim="formData.proposal_title" required :class="['mt-2 block w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.proposal_title ? 'border-red-500' : 'border-gray-300']" placeholder="Enter proposal title" />
                  <p v-if="validationErrors.proposal_title" class="mt-1 text-sm text-red-600 flex items-center"><AlertCircle class="w-4 h-4 mr-1" />{{ validationErrors.proposal_title[0] }}</p>
                </div>
                <div>
                  <label for="duration" class="block text-sm font-medium text-gray-700">Duration (in months) <span v-if="!formData.is_draft" class="text-red-500">*</span></label>
                  <input type="number" id="duration" v-model.number="formData.duration_months" :required="!formData.is_draft" min="1" :class="['mt-2 block w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.duration_months ? 'border-red-500' : 'border-gray-300']" placeholder="Enter duration" />
                  <p v-if="validationErrors.duration_months" class="mt-1 text-sm text-red-600 flex items-center"><AlertCircle class="w-4 h-4 mr-1" />{{ validationErrors.duration_months[0] }}</p>
                </div>
                <div>
                  <label for="commencementDate" class="block text-sm font-medium text-gray-700">Commencement Date <span v-if="!formData.is_draft" class="text-red-500">*</span></label>
                  <input type="date" id="commencementDate" v-model="formData.commencement_date" :required="!formData.is_draft" :min="todayDate" :class="['mt-2 block w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.commencement_date ? 'border-red-500' : 'border-gray-300']" />
                  <p v-if="validationErrors.commencement_date" class="mt-1 text-sm text-red-600 flex items-center"><AlertCircle class="w-4 h-4 mr-1" />{{ validationErrors.commencement_date[0] }}</p>
                </div>
                <div>
                  <label for="attachments" class="block text-sm font-medium text-gray-700">Attachments (if any)</label>
                  <div class="mt-2 flex items-center">
                    <label for="attachments" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <div class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm flex items-center hover:bg-gray-50 w-full"><UploadIcon class="w-5 h-5 mr-2 text-indigo-500" /><span>Choose file</span></div>
                      <input type="file" id="attachments" @change="handleFileUpload" class="sr-only" />
                    </label>
                  </div>
                  <p class="mt-2 text-xs text-gray-500 flex items-center"><InfoIcon class="w-4 h-4 mr-1 text-gray-400" /> Max file size: 5MB. Allowed types: PDF, DOC, DOCX, JPG, PNG.</p>
                  <p v-if="selectedFileName" class="mt-2 text-sm text-green-700 font-medium flex items-center"><CheckCircleIcon class="w-4 h-4 mr-1" /> Selected: {{ selectedFileName }}</p>
                  <p v-if="validationErrors.proposal_attachment" class="mt-1 text-sm text-red-600 flex items-center"><AlertCircle class="w-4 h-4 mr-1" />{{ validationErrors.proposal_attachment[0] }}</p>
                </div>
              </div>
              <div class="mt-6 md:col-span-2">
                <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
                <textarea id="remarks" v-model="formData.remarks" rows="4" class="mt-2 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add any additional comments or notes here..."></textarea>
                <p v-if="validationErrors.remarks" class="mt-1 text-sm text-red-600 flex items-center"><AlertCircle class="w-4 h-4 mr-1" />{{ validationErrors.remarks[0] }}</p>
              </div>
            </section>

            <div class="flex items-start p-6 bg-white rounded-xl shadow border-l-4 border-indigo-400">
              <div class="flex items-center h-5 mt-1"><input id="declaration" type="checkbox" v-model="formData.ins_declaration" :required="!formData.is_draft" class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded" /></div>
              <div class="ml-3 text-sm">
                <label for="declaration" class="font-medium text-gray-700 text-base">Declaration <span v-if="!formData.is_draft" class="text-red-500">*</span></label>
                <p class="text-gray-500 mt-1">I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.</p>
                <p v-if="validationErrors.ins_declaration" class="mt-1 text-sm text-red-600 flex items-center"><AlertCircle class="w-4 h-4 mr-1" />{{ validationErrors.ins_declaration[0] }}</p>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-6 border-t mt-8 items-center bg-gray-50 -m-8 p-6 rounded-b-xl">
              <button type="button" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center" @click="handleCancel" :disabled="isSubmitting"><XIcon class="w-4 h-4 mr-2" /> Cancel</button>
              <button type="button" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center" @click="handleSaveDraft" :disabled="isSubmitting">
                <SaveIcon class="w-4 h-4 mr-2" /><Loader v-if="isSubmitting && draftSaveInProgress" class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" />{{ isSubmitting && draftSaveInProgress ? 'Saving...' : 'Save as Draft' }}
              </button>
              <button type="submit" :disabled="isSubmitting || !formData.ins_declaration" class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !formData.ins_declaration }">
                <SendIcon class="w-4 h-4 mr-2" /><Loader v-if="isSubmitting && !draftSaveInProgress" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />{{ isSubmitting && !draftSaveInProgress ? 'Submitting...' : 'Submit Application' }}
              </button>
            </div>

            <div v-if="validationErrors.detail || typeof validationErrors === 'string'" class="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <AlertOctagonIcon class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" /><p>{{ validationErrors.detail || validationErrors }}</p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showViewModal && selectedApplication" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" @click.self="closeViewModal">
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full m-4">
          <div class="flex justify-between items-center border-b p-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                <FileText class="w-7 h-7 mr-3 text-indigo-600" />
                Application Details
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Viewing Application ID:
                <span class="font-semibold text-indigo-600">{{ selectedApplication.id }}</span>
              </p>
            </div>
            <button @click="closeViewModal" class="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <XIcon class="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div class="p-8 max-h-[70vh] overflow-y-auto space-y-8">
            <section>
              <h4 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center">
                <ClipboardIcon class="w-5 h-5 mr-2" />
                Application Summary
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                <div>
                  <label class="block font-medium text-gray-500">Institute Name</label>
                  <p class="mt-1 text-gray-900 font-semibold">
                    {{ selectedApplication?.training_institute_details?.name_of_institution || 'N/A' }}
                  </p>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Submitted On</label>
                  <p class="mt-1 text-gray-900">
                    {{ selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleDateString() : 'N/A' }}
                  </p>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Approval Status</label>
                  <div class="mt-1">
                    <span :class="getStatusClass(selectedApplication)" class="px-3 py-1 text-xs font-bold leading-5 rounded-full">
                      {{ getApprovalStatusText(selectedApplication) }}
                    </span>
                  </div>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Program Validity</label>
                  <p class="mt-1 text-gray-900">
                    {{ selectedApplication.valid_till ? new Date(selectedApplication.valid_till).toLocaleDateString() : 'Not yet applicable' }}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h4 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b flex items-center">
                <UserIcon class="w-5 h-5 mr-2" />
                Your Submission Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                <div class="md:col-span-2">
                  <label class="block font-medium text-gray-500">Proposal Title</label>
                  <p class="mt-1 text-gray-900 font-semibold">
                    {{ selectedApplication.proposal_title || 'N/A' }}
                  </p>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Duration (Months)</label>
                  <p class="mt-1 text-gray-900">{{ selectedApplication.duration_months || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Proposed Commencement</label>
                  <p class="mt-1 text-gray-900">
                    {{ selectedApplication.commencement_date ? new Date(selectedApplication.commencement_date).toLocaleDateString() : 'N/A' }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="block font-medium text-gray-500">Your Remarks</label>
                  <p class="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md border min-h-[60px]">
                    {{ selectedApplication.remarks || 'No remarks provided.' }}
                  </p>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Your Proposal Attachment</label>
                  <div class="mt-1">
                    <a v-if="selectedApplication.proposal_attachment" :href="selectedApplication.proposal_attachment" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
                      <PaperclipIcon class="w-4 h-4 mr-1" />
                      View Attachment
                    </a>
                    <span v-else class="text-gray-500">No attachment</span>
                  </div>
                </div>
                <div>
                  <label class="block font-medium text-gray-500">Declaration</label>
                  <p class="mt-1 font-semibold" :class="selectedApplication.ins_declaration ? 'text-green-600' : 'text-red-600'">
                    {{ selectedApplication.ins_declaration ? 'Agreed' : 'Not Agreed' }}
                  </p>
                </div>
              </div>
            </section>

            <section class="bg-gray-50/70 p-6 rounded-lg border">
              <h4 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                <UserCheckIcon class="w-5 h-5 mr-2 text-gray-600" />
                Official Review
              </h4>
              <div class="space-y-5 text-sm">
                <div>
                  <label class="block font-medium text-gray-500">Review Summary</label>
                  <p class="mt-1 text-gray-900">
                    {{ selectedApplication.ins_review_summary || 'No summary available yet.' }}
                  </p>
                </div>

                <div v-if="selectedApplication.review_decision === 'Regretted' || selectedApplication.review_decision === 'Rejected'">
                  <label class="block font-medium text-red-600">Reason for Rejection</label>
                  <p class="mt-1 p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
                    {{ selectedApplication.reason_if_rejected || 'No reason specified.' }}
                  </p>
                </div>

                <div>
                  <label class="block font-medium text-gray-500">Dealing Officer Report</label>
                  <div class="mt-1">
                    <a v-if="selectedApplication.review_report_upload" :href="selectedApplication.review_report_upload" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold">
                      <PaperclipIcon class="w-4 h-4 mr-1" />
                      View Report
                    </a>
                    <span v-else class="text-gray-500">No report uploaded yet</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="flex justify-end p-6 border-t bg-gray-50/50">
            <button @click="closeViewModal" class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Close
            </button>
          </div>
        </div>
      </div>

    <PaymentModal ref="paymentModalRef" :amount="1000" @payment-completed="handlePaymentCompleted" @close="closePaymentModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import PaymentModal from '@/components/common/PaymentModal.vue';
import { Loader, Search, EditIcon, EyeIcon, FileText, BuildingIcon, UserIcon, GlobeIcon, ClipboardIcon, AlertCircle, AlertTriangle, UploadIcon, InfoIcon, CheckCircleIcon, XIcon, SaveIcon, SendIcon, AlertOctagonIcon, ListIcon, FolderIcon, UserCheckIcon, PaperclipIcon, CreditCard, Award, PlusCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const isFormModalVisible = ref(false)
const showViewModal = ref(false)
const formModalTitle = ref('Add New Programme Application')
const userInstitute = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const draftSaveInProgress = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const validationErrors = ref({})
const selectedFile = ref(null)
const selectedFileName = ref('')
const formData = ref({
  id: null,
  proposal_title: '',
  duration_months: null,
  commencement_date: '',
  remarks: '',
  ins_declaration: false,
  proposal_attachment: null,
  ins_review_decision: 'Pending',
  is_active: true,
  training_institute: null,
  institute_name: '',
  is_draft: false,
})

const selectedApplication = ref({})
const submittedApplications = ref([])
const isTableLoading = ref(false)
const tableApiError = ref(false)
const searchQuery = ref('')
const paymentModalRef = ref(null);
const selectedAppForPayment = ref(null);

// --- MODIFIED COMPUTED PROPERTY ---
const filteredApplications = computed(() => {
  // Guard clauses to prevent errors before data is loaded
  if (!submittedApplications.value || !authStore.user?.cid) {
    return [];
  }

  const userCID = authStore.user.cid;

  // 1. Filter by the current user's CID first.
  // Note the new API structure: app -> training_institute_details -> CID
  const userApps = submittedApplications.value.filter(app =>
    app.training_institute_details?.CID === userCID
  );

  // 2. Then, filter by the search query on the user's applications.
  if (!searchQuery.value) {
    return userApps;
  }
  const lowerSearch = searchQuery.value.toLowerCase();
  return userApps.filter(app =>
    (app.proposal_title?.toLowerCase().includes(lowerSearch) || String(app.id).includes(lowerSearch))
  );
});
// --- END OF MODIFICATION ---

const todayDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
})

const userCid = computed(() => authStore.user?.cid || '')

const resetForm = () => {
  formData.value = {
    id: null, proposal_title: '', duration_months: null, commencement_date: '', remarks: '', ins_declaration: false,
    proposal_attachment: null, ins_review_decision: 'Pending', is_active: true, is_draft: false,
    training_institute: userInstitute.value?.id || null, institute_name: userInstitute.value?.name_of_institution || '',
  };
  selectedFile.value = null;
  selectedFileName.value = '';
  validationErrors.value = {};
  if (document.getElementById('attachments')) {
    document.getElementById('attachments').value = null;
  }
}

const showFormModal = () => {
  resetForm();
  formModalTitle.value = 'Add New Programme Application';
  isFormModalVisible.value = true;
};

const closeFormModal = () => {
  isFormModalVisible.value = false;
};

const handleCancel = () => {
  if (confirm('Are you sure? Any unsaved changes will be lost.')) {
    closeFormModal();
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedApplication.value = {}
}

const fetchInstituteData = async () => {
  isLoading.value = true;
  apiError.value = false;
  try {
    // This call is fine, it correctly finds the user's specific institute for the form.
    const response = await apiService.getEpcInstitutes();
    const foundInstitute = response.data.results.find(inst => inst.CID?.toLowerCase() === userCid.value.toLowerCase());
    if (foundInstitute) {
      userInstitute.value = foundInstitute;
      // Now fetch applications after we know the institute exists
      await fetchSubmittedApplications();
    } else {
      userInstitute.value = null;
      errorMessage.value = 'No approved training institute found for your account.';
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
    errorMessage.value = 'An error occurred while fetching your institute data.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const fetchSubmittedApplications = async () => {
  isTableLoading.value = true;
  tableApiError.value = false;
  try {
    // --- MODIFICATION ---
    // Fetch all programs and let the client-side filter do the work.
    // This is more robust if the backend filter isn't working as expected.
    const response = await apiService.getEpcNewEducationPrograms();
    submittedApplications.value = response.data.results || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    tableApiError.value = true;
  } finally {
    isTableLoading.value = false;
  }
};

const loadApplication = async (applicationId, forEditing = false) => {
  try {
    const response = await apiService.getEpcNewEducationProgram(applicationId);
    const app = response.data;
    if (forEditing && app.is_draft) {
      resetForm();
      formData.value = {
        id: app.id,
        proposal_title: app.proposal_title || '',
        duration_months: app.duration_months || null,
        commencement_date: app.commencement_date || '',
        remarks: app.remarks || '',
        ins_declaration: app.ins_declaration || false,
        is_draft: app.is_draft || false,
        training_institute: app.training_institute || userInstitute.value.id,
        institute_name: userInstitute.value.name_of_institution || '',
      };
      selectedFileName.value = app.proposal_attachment ? app.proposal_attachment.split('/').pop() : '';
      formModalTitle.value = `Editing Draft (ID: ${app.id})`;
      isFormModalVisible.value = true;
      toast.info('Draft loaded for editing.');
    } else {
      selectedApplication.value = { ...app };
      showViewModal.value = true;
    }
  } catch (error) {
    console.error('Error loading application:', error);
    toast.error('An error occurred while loading the application.');
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size exceeds 5MB limit.');
    event.target.value = '';
    return;
  }
  selectedFile.value = file;
  selectedFileName.value = file.name;
};

const validateForm = (isDraft = false) => {
  validationErrors.value = {};
  const errors = {};
  if (!formData.value.proposal_title?.trim()) errors.proposal_title = ['Proposal title is required'];
  if (!isDraft) {
    if (!formData.value.duration_months || formData.value.duration_months <= 0) errors.duration_months = ['Duration must be a positive number'];
    if (!formData.value.commencement_date) errors.commencement_date = ['Commencement date is required'];
    if (new Date(formData.value.commencement_date) < new Date(todayDate.value)) errors.commencement_date = ['Commencement date cannot be in the past'];
    if (!formData.value.ins_declaration) errors.ins_declaration = ['You must accept the declaration'];
  }
  if (Object.keys(errors).length > 0) {
    validationErrors.value = errors;
    return false;
  }
  return true;
};

const prepareFormData = (isDraft) => {
  const submissionData = new FormData();
  Object.keys(formData.value).forEach(key => {
    if (key === 'proposal_attachment' || key === 'id') return;
    const value = formData.value[key];
    if (value !== null && value !== undefined) {
      submissionData.append(key, typeof value === 'boolean' ? (value ? 'true' : 'false') : value);
    }
  });
  submissionData.set('is_draft', isDraft ? 'true' : 'false');
  if (selectedFile.value) {
    submissionData.append('proposal_attachment', selectedFile.value, selectedFile.value.name);
  }
  return submissionData;
};

const submitOrSave = async (isDraft) => {
  const action = isDraft ? 'save' : 'submit';
  const actioning = isDraft ? 'Saving' : 'Submitting';

  if (!validateForm(isDraft)) {
    toast.error(`Please correct the errors before ${actioning}.`);
    return;
  }

  isSubmitting.value = true;
  if(isDraft) draftSaveInProgress.value = true;
  validationErrors.value = {};

  try {
    const finalFormData = prepareFormData(isDraft);
    if (formData.value.id) {
      await apiService.updateEpcNewEducationProgram(formData.value.id, finalFormData);
      toast.success(`Application updated and ${action}ed successfully!`);
    } else {
      await apiService.createEpcNewEducationProgram(finalFormData);
      toast.success(`Application ${action}ed successfully!`);
    }
    closeFormModal();
    await fetchSubmittedApplications();
  } catch (error) {
    console.error(`Error ${actioning} form:`, error);
    if (error.response?.data) {
      validationErrors.value = error.response.data.errors || error.response.data;
      toast.error(`${actioning.charAt(0).toUpperCase() + actioning.slice(1)} failed. Please review the errors.`);
    } else {
      toast.error(`An unexpected error occurred during ${action}.`);
    }
  } finally {
    isSubmitting.value = false;
    if(isDraft) draftSaveInProgress.value = false;
  }
};

const handleSubmit = () => submitOrSave(false);
const handleSaveDraft = () => submitOrSave(true);

const initiatePayment = (app) => {
  selectedAppForPayment.value = app;
  paymentModalRef.value?.openModal();
};

const closePaymentModal = () => {
  selectedAppForPayment.value = null;
};

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedAppForPayment.value) return toast.error('No application selected for payment.');
  const user = authStore.user;
  if (!user?.cid) return toast.error('User information is missing. Please log in again.');

  isSubmitting.value = true;
  const paymentId = paymentData.paymentHash;
  const appToPay = selectedAppForPayment.value;

  try {
    const paymentGatewayFormData = new FormData();
    paymentGatewayFormData.append('refNo', paymentId);
    paymentGatewayFormData.append('serviceCode', '100197');
    paymentGatewayFormData.append('taxPayerName', appToPay.training_institute_details?.name_of_institution || user.cid);
    paymentGatewayFormData.append('taxPayerNo', user.cid);
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid);
    paymentGatewayFormData.append('totalPayableAmount', 1000 * 100);
    paymentGatewayFormData.append('payableAmount', 1000 * 100);
    paymentGatewayFormData.append('description', `Fee for Education Programme: ${appToPay.proposal_title}`);
    paymentGatewayFormData.append('mobileNo', appToPay.training_institute_details?.contact_no || 'NA');
    paymentGatewayFormData.append('payerEmail', appToPay.training_institute_details?.email_address || 'NA');
    paymentGatewayFormData.append('user', user.id);
    paymentGatewayFormData.append('application_no', appToPay.id);
    paymentGatewayFormData.append('app_type', 'epc_new_education_program');
    await apiService.makePayment(paymentGatewayFormData);

    // Only patch the necessary fields to complete the payment
    const updatePayload = {
        payment_id: paymentId,
        is_payment_complete: true,
    };

    await apiService.patchEpcNewEducationProgram(appToPay.id, updatePayload);

    toast.success(`Payment confirmed. Your application is updated.`);
    await fetchSubmittedApplications();
  } catch (error) {
    console.error('Payment handling error:', error);
    toast.error(`Payment confirmation failed: ${error.response?.data?.detail || 'Please contact support.'}`);
  } finally {
    isSubmitting.value = false;
    closePaymentModal();
  }
};

const getApprovalStatusText = (app) => {
  if (app.is_draft) return 'Draft';
  if (app.review_decision === 'Approved' && app.is_payment_complete) return 'Completed';
  if (app.review_decision === 'Approved' && !app.is_payment_complete) return 'Payment Pending';
  return app.review_decision || 'Submitted';
};

const getApprovalStatusDotClass = (app) => {
  if (app.review_decision === 'Approved' && app.is_payment_complete) return 'bg-green-500';
  if (app.review_decision === 'Approved' && !app.is_payment_complete) return 'bg-blue-500';
  if (app.review_decision === 'Rejected' || app.review_decision === 'Regretted') return 'bg-red-500';
  if (app.is_draft || app.review_decision === 'Pending' || app.review_decision === 'Under Review') return 'bg-yellow-500';
  return 'bg-gray-500';
};

const getStatusClass = (app) => {
  if (app.is_draft) return 'bg-yellow-100 text-yellow-800';

  const status = app.review_decision?.toLowerCase();
  const isPaid = app.is_payment_complete;

  if (status === 'approved') {
    return isPaid ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  }

  switch (status) {
    case 'rejected': case 'regretted': case 'failed': return 'bg-red-100 text-red-800';
    case 'pending': case 'under review': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

onMounted(fetchInstituteData);
</script>

<style scoped>
label span.text-red-500 { margin-left: 2px; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.border-red-500 { border-color: #ef4444; }
.border-red-500:focus { border-color: #ef4444; box-shadow: 0 0 0 1px #ef4444; }
.btn { @apply inline-flex items-center justify-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors; }
.btn-primary { @apply text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500; }
.btn-success { @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500; }
.btn-action-view, .btn-action-edit { @apply text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-xs px-2 py-1 rounded-md hover:bg-indigo-50; }
</style>