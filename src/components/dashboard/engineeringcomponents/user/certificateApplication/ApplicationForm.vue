<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
    <PageHeader
      :title="selectedType === 'cid' ? 'CID Holder Registration' : 'Non-CID Holder Registration'"
    >
      <template #icon>
        <UserPlus class="w-6 h-6 text-indigo-600" />
      </template>
      <template #subtitle>
        Please fill in all required fields marked with an asterisk (<span class="text-red-600"
          >*</span
        >). Ensure all information provided is accurate and up-to-date.
      </template>
    </PageHeader>

    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-50" @close="isConfirmationModalOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div>
                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                  >
                    <svg
                      class="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Confirm Submission
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to submit the application? Please review all
                        information before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    @click="handleSubmitActual"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="isConfirmationModalOpen = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <form
      @submit.prevent="handleNext"
      class="bg-white border rounded-xl shadow-sm p-4 sm:p-6"
      v-if="stage === 1"
    >
      <h3 class="text-lg font-semibold text-gray-900 my-3">Step 1: Registration</h3>
      <div class="border-b border-gray-200 bg-gray-50 p-4 sm:p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p class="mt-1 text-sm text-gray-500">Basic details needed for registration</p>
      </div>

      <div class="p-4 sm:p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <template v-if="selectedType === 'cid'">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">CID No.</label>
              <input
                v-model="localFormData.cid_no"
                type="number"
                maxlength="11"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter 11-digit CID number"
                @input="fetchDCRCData"
              />
              <span v-if="errors.cid_no" class="text-xs text-red-500 mt-1">{{ errors.cid_no }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <input
                type="text"
                v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-100"
                readonly
              />
              <span v-if="errors.dzongkhag" class="text-xs text-red-500 mt-1">{{ errors.dzongkhag }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Gewog</label>
              <input
                type="text"
                v-model="localFormData.gewog"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-100"
                readonly
              />
              <span v-if="errors.gewog" class="text-xs text-red-500 mt-1">{{ errors.gewog }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input
                type="text"
                v-model="localFormData.village"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-100"
                readonly
              />
              <span v-if="errors.village" class="text-xs text-red-500 mt-1">{{ errors.village }}</span>
            </div>
          </template>

          <template v-else>
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
              <select
                v-model="localFormData.nationality"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">SELECT NATIONALITY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.nationality" class="text-xs text-red-500 mt-1">{{ errors.nationality }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
              <input
                v-model="localFormData.email_address"
                type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Email Address"
              />
              <span v-if="errors.email_address" class="text-xs text-red-500 mt-1">{{ errors.email_address }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Identity / Work Permit No</label>
              <input
                v-model="localFormData.workPermitNo"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Identity / Work Permit No"
              />
              <span v-if="errors.workPermitNo" class="text-xs text-red-500 mt-1">{{ errors.workPermitNo }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Country of Residence</label>
              <select
                v-model="localFormData.country"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">SELECT COUNTRY</option>
                <option v-for="countryItem in countries" :key="countryItem" :value="countryItem">
                  {{ countryItem }}
                </option>
              </select>
              <span v-if="errors.country" class="text-xs text-red-500 mt-1">{{ errors.country }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">City / Town</label>
              <input
                v-model="localFormData.city"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="City / Town"
              />
              <span v-if="errors.city" class="text-xs text-red-500 mt-1">{{ errors.city }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">State / Province</label>
              <input
                v-model="localFormData.state"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="State / Province"
              />
              <span v-if="errors.state" class="text-xs text-red-500 mt-1">{{ errors.state }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
              <input
                v-model="localFormData.mobileNumber"
                type="tel"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Mobile Number"
              />
              <span v-if="errors.mobileNumber" class="text-xs text-red-500 mt-1">{{ errors.mobileNumber }}</span>
            </div>
          </template>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input
              v-model="localFormData.full_name"
              type="text"
              :class="[
                'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2',
                { 'bg-gray-100': selectedType === 'cid' },
              ]"
              placeholder="Enter full name"
              :readonly="selectedType === 'cid'"
            />
            <span v-if="errors.full_name" class="text-xs text-red-500 mt-1">{{ errors.full_name }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select
              v-model="localFormData.gender"
              :class="[
                'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2',
                { 'bg-gray-100': selectedType === 'cid' },
              ]"
              :disabled="selectedType === 'cid'"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="O">Other</option>
            </select>
            <span v-if="errors.gender" class="text-xs text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input
              type="date"
              v-model="localFormData.date_of_birth"
              :class="[
                'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2',
                { 'bg-gray-100': selectedType === 'cid' },
              ]"
              :readonly="selectedType === 'cid'"
            />
            <span v-if="errors.date_of_birth" class="text-xs text-red-500 mt-1">{{ errors.date_of_birth }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number (for communication)</label>
            <input
              v-model="localFormData.contact_no"
              type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter phone number"
            />
            <span v-if="errors.contact_no" class="text-xs text-red-500 mt-1">{{ errors.contact_no }}</span>
          </div>
        </div>

        <div class="col-span-1 sm:col-span-2 mt-4 sm:mt-6">
          <label class="block text-sm font-medium text-gray-700 required">Registration Type</label>
          <div v-if="isLoadingMasters" class="mt-2 text-sm text-gray-500">
            Loading registration types...
          </div>
          <div v-else-if="!filteredRegistrationTypes.length" class="mt-2 text-sm text-yellow-600">
            No available registration types. Please ensure they are configured in the master list.
          </div>
          <div v-else class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              v-for="regType in filteredRegistrationTypes"
              :key="regType.id"
              @click="selectRegistrationType(regType.id)"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                localFormData.registration_type === regType.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ regType.name }}
            </button>
          </div>
          <span v-if="errors.registration_type" class="text-xs text-red-500 mt-1">{{ errors.registration_type }}</span>
        </div>

        <div class="mt-8">
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Passport Photo</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 required">Upload Passport Photo (JPG, PNG, max 2MB)</label>
                <input
                  type="file"
                  @change="handlePassportPhotoSelect"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".jpg,.jpeg,.png"
                />
                <span v-if="errors.passport_photo" class="text-xs text-red-500 mt-1">{{ errors.passport_photo }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('back')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back to Selection
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Next: Qualification</span>
          </button>
        </div>
      </div>
    </form>

    <form
      @submit.prevent="openConfirmationModal"
      class="bg-white border rounded-xl shadow-sm p-4 sm:p-6"
      v-else-if="stage === 2"
    >
      <h3 class="text-lg font-semibold text-gray-900 my-3">
        Step 2: Engineering Qualification & Documents
      </h3>

      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Qualification Details
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
              <select
                v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Select Qualification Type</option>
                <option v-for="qType in qualificationTypes" :key="qType.id" :value="qType.id">
                  {{ qType.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-xs text-red-500 mt-1">{{ errors.qualification_type }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
              <select
                v-model="localFormData.qualification_name"
                @change="localFormData.qualification_name !== 'OTHERS' ? (localFormData.other_qualification_name_specify = '') : ''"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Select Qualification Name</option>
                <option
                  v-for="qualification in qualifications"
                  :key="qualification.id"
                  :value="qualification.id"
                >
                  {{ qualification.qualification }}
                </option>
                <option value="OTHERS">Others (Please specify)</option>
              </select>
              <span v-if="errors.qualification_name && localFormData.qualification_name !== 'OTHERS'" class="text-xs text-red-500 mt-1">{{ errors.qualification_name }}</span>
            </div>

            <div class="col-span-1" v-if="localFormData.qualification_name === 'OTHERS'">
              <label class="block text-sm font-medium text-gray-700 required">Specify Qualification Name</label>
              <input
                v-model="localFormData.other_qualification_name_specify"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter your qualification name"
              />
              <span v-if="errors.other_qualification_name_specify" class="text-xs text-red-500 mt-1">{{ errors.other_qualification_name_specify }}</span>
            </div>

            <div :class="localFormData.qualification_name === 'OTHERS' ? 'col-span-2 sm:col-span-1' : 'col-span-1'">
              <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
              <select
                v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Select Institute/University</option>
                <option v-for="university in universities" :key="university.id" :value="university.id">
                  {{ university.country }}, {{ university.university }}, {{ university.institute_name }}
                </option>
              </select>
              <span v-if="errors.institute" class="text-xs text-red-500 mt-1">{{ errors.institute }}</span>
            </div>

            <div :class="localFormData.qualification_name === 'OTHERS' ? 'col-span-2 sm:col-span-1' : 'col-span-1'">
              <label class="block text-sm font-medium text-gray-700 required">Year of Completion (YYYY-MM)</label>
              <input
                type="month"
                v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="YYYY-MM"
              />
              <span v-if="errors.year_of_completion" class="text-xs text-red-500 mt-1">{{ errors.year_of_completion }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Supporting Documents</h3>
          <p class="text-sm text-gray-600 mb-1">
            Please upload all mandatory documents for your selected registration type. Document types available are from the master list. (Allowed: .pdf, .doc, .docx, .jpg, .jpeg, .png; Max 2MB per file)
          </p>
          <div v-if="currentRequiredDocNames.length > 0 && localFormData.registration_type" class="mt-2 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-sm font-medium text-blue-700">
              Mandatory documents for {{ getRegistrationTypeName(localFormData.registration_type) }}:
            </p>
            <ul class="list-disc list-inside text-xs text-blue-600 mt-1">
              <li v-for="docName in currentRequiredDocNames" :key="docName">{{ docName }}</li>
            </ul>
          </div>
          <p v-else-if="localFormData.registration_type && !isLoadingMasters && fetchedDocumentTypes.length > 0" class="text-xs text-gray-500 mt-1 mb-3">
            No specific mandatory documents are listed for {{ getRegistrationTypeName(localFormData.registration_type) }}. Please ensure all relevant documents are uploaded.
          </p>
          <p v-else-if="!isLoadingMasters && fetchedDocumentTypes.length === 0" class="text-xs text-yellow-600 mt-1 mb-3">
            Document types master list could not be loaded. Document selection may be affected.
          </p>
          <span v-if="errors.mandatory_documents" class="text-xs text-red-500 mt-1 block">{{ errors.mandatory_documents }}</span>

          <div class="space-y-3 mt-4">
            <div
              v-for="(doc, index) in supportingDocuments"
              :key="index"
              class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
            >
              <div class="w-full sm:w-1/3">
                <label :for="'doc_type_' + index" class="sr-only">Document Type {{ index + 1 }}</label>
                <select
                  :id="'doc_type_' + index"
                  v-model="doc.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                >
                  <option value="">Select Document Type</option>
                  <option v-for="docTypeOption in fetchedDocumentTypes" :key="docTypeOption.id" :value="docTypeOption.id">
                    {{ docTypeOption.document_name }}
                  </option>
                </select>
                <span v-if="errors[`document_type_${index}`]" class="text-xs text-red-500 mt-1">{{ errors[`document_type_${index}`] }}</span>
                <p v-if="!isLoadingMasters && fetchedDocumentTypes.length === 0 && index === 0" class="text-xs text-yellow-500 mt-1">
                  Document types list is empty.
                </p>
              </div>
              <div class="flex-1 flex items-center space-x-2">
                <label :for="'doc_file_' + index" class="sr-only">File for Document {{ index + 1 }}</label>
                <input
                  :id="'doc_file_' + index"
                  type="file"
                  @change="(e) => handleFileSelect(e, index)"
                  class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                />
                <button
                  @click="removeDocument(index)"
                  type="button"
                  class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  aria-label="Remove document"
                >
                  <span class="sr-only">Remove</span>
                  ✕
                </button>
              </div>
              <span v-if="errors[`document_file_${index}`]" class="text-xs text-red-500 mt-1 w-full sm:w-auto sm:flex-initial">{{ errors[`document_file_${index}`] }}</span>
            </div>

            <button
              type="button"
              @click="addDocument"
              class="mt-3 px-3 py-2 bg-blue-50 text-sm text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Another Document Type
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Declaration</h3>
        <div class="space-y-3">
          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
            <textarea
              id="remarks"
              v-model="localFormData.remarks"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
              placeholder="Enter any additional remarks or comments"
            ></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <input
              type="checkbox"
              id="declaration_checkbox"
              v-model="localFormData.declaration"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label for="declaration_checkbox" class="text-sm text-gray-700">
              I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false statements may result in the rejection of my registration. <span class="text-red-600">*</span>
            </label>
          </div>
          <span v-if="errors.declaration" class="text-xs text-red-500 mt-1">{{ errors.declaration }}</span>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          @click="stage = 1"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Back to Personal Info
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="isSubmitting || !localFormData.declaration"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit Registration</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import { UserPlus } from 'lucide-vue-next'

const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

const props = defineProps({
  selectedType: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'back'])

const stage = ref(1)
const applicationId = ref(null)
const isLoadingMasters = ref(true)

const fetchedDocumentTypes = ref([])
const supportingDocuments = ref([{ type: '', files: [] }])

const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [] })
}

const removeDocument = (index) => {
  supportingDocuments.value.splice(index, 1)
  updateFormDocuments()
}

const filteredRegistrationTypes = computed(() => {
  if (allRegistrationTypesFromAPI.value && allRegistrationTypesFromAPI.value.length > 0) {
    return allRegistrationTypesFromAPI.value
      .filter((rt) => {
        const nameLower = rt.name.toLowerCase()
        return !nameLower.includes('renewal') && !nameLower.includes('additional')
      })
      .map((rt) => ({ id: rt.id, name: rt.name }))
  }
  return []
})

const selectRegistrationType = (id) => {
  localFormData.registration_type = id
}

const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)
  const MAX_SIZE = 2 * 1024 * 1024
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']

  delete errors[`document_file_${index}`]

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      errors[`document_file_${index}`] = `File '${file.name}' exceeds 2MB. Max size is 2MB.`
      toast.error(errors[`document_file_${index}`])
      event.target.value = ''
      supportingDocuments.value[index].files = []
      updateFormDocuments()
      return
    }
    const fileExtension = ('.' + file.name.split('.').pop()).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      errors[`document_file_${index}`] =
        `File '${file.name}' has an invalid type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}.`
      toast.error(errors[`document_file_${index}`])
      event.target.value = ''
      supportingDocuments.value[index].files = []
      updateFormDocuments()
      return
    }
  }

  supportingDocuments.value[index].files = files
  updateFormDocuments()
}

const updateFormDocuments = () => {
  localFormData.documents = supportingDocuments.value
    .filter((doc) => doc.type && doc.files.length > 0)
    .map((doc) => ({
      type: doc.type,
      files: doc.files,
    }))
}

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

const qualificationTypes = ref([])
const qualifications = ref([])
const universities = ref([])
const allRegistrationTypesFromAPI = ref([])

const REGISTRATION_TYPE_KEYWORDS = {
  full: ['full'],
  provisional: ['provisional'],
  temporary: ['temporary'],
}

const MANDATORY_DOC_KEYWORDS = {
  provisional: [
    'graduation certificate',
    'provisional certificate',
    'course completion certificate',
    'marksheet',
    'internship completion',
    'class x',
    'class xii',
    'citizenship identity card',
    'security clearance',
    'recognition of qualification',
  ],
  temporary: [
    'graduation certificate',
    'work offer letter',
    'request letter',
    'passport copy',
    'visa copy',
    'permit copy',
  ],
}

onMounted(async () => {
  isLoadingMasters.value = true
  try {
    const responses = await Promise.all([
      apiService.getEpcMastersQualificationTypes(),
      apiService.getEpcMastersQualifications(),
      apiService.getEpcMastersUniversities(),
      apiService.getEpcMastersRegistrationTypes(),
      apiService.getEpcMastersDocumentTypes(),
    ])

    qualificationTypes.value = responses[0]?.data?.results || []
    qualifications.value = responses[1]?.data?.results || []
    universities.value = responses[2]?.data?.results || []
    allRegistrationTypesFromAPI.value = responses[3]?.data?.results || []
    fetchedDocumentTypes.value = responses[4]?.data?.results || []

    const fullType = filteredRegistrationTypes.value.find((rt) =>
      rt.name.toLowerCase().includes('full'),
    )
    if (fullType) {
      localFormData.registration_type = fullType.id
    } else if (filteredRegistrationTypes.value.length > 0) {
      localFormData.registration_type = filteredRegistrationTypes.value[0].id
    }
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error(
      'Failed to fetch master data. Some dropdowns or options may not populate correctly. Please try refreshing.',
    )
  } finally {
    isLoadingMasters.value = false
  }
})

const localFormData = reactive({
  ...props.modelValue,
  cid_holder: props.selectedType === 'cid',
  nationality: props.selectedType === 'cid' ? 'Bhutanese' : '',
  email_address: user?.email || '',
  workPermitNo: '',
  mobileNumber: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  city: '',
  state: '',
  country: '',
  contact_no: '',
  passport_photo: null,
  documents: [],
  remarks: '',
  declaration: false,
  payment_status: 'False',
  payment_id: null,
  registration_date: null,
  expiry_date: null,
  qualification_type: '',
  qualification_name: '',
  other_qualification_name_specify: '',
  institute: '',
  year_of_completion: null,
  is_active: 'False',
  application: null,
  registration_type: '',
})

const errors = reactive({})
const isConfirmationModalOpen = ref(false)
const isSubmitting = ref(false)
const toast = useToast()
const isLoadingDCRC = ref(false)

const getRegistrationTypeName = (typeId) => {
  const type = allRegistrationTypesFromAPI.value.find((rt) => rt.id === typeId)
  return type ? type.name : 'Selected Registration'
}

const getRegistrationTypeCategory = (typeId) => {
  const type = allRegistrationTypesFromAPI.value.find((rt) => rt.id === typeId)
  if (!type) return null
  const nameLower = type.name.toLowerCase()
  if (REGISTRATION_TYPE_KEYWORDS.full.some((keyword) => nameLower.includes(keyword))) {
    return 'full'
  } else if (
    REGISTRATION_TYPE_KEYWORDS.provisional.some((keyword) => nameLower.includes(keyword))
  ) {
    return 'provisional'
  } else if (REGISTRATION_TYPE_KEYWORDS.temporary.some((keyword) => nameLower.includes(keyword))) {
    return 'temporary'
  }
  return null
}

const currentMandatoryDocIds = computed(() => {
  const category = getRegistrationTypeCategory(localFormData.registration_type)
  if (category === 'full') {
    return fetchedDocumentTypes.value.map((dt) => dt.id)
  } else if (category === 'provisional' || category === 'temporary') {
    const keywords = MANDATORY_DOC_KEYWORDS[category]
    return fetchedDocumentTypes.value
      .filter((dt) => {
        const docNameLower = dt.document_name.toLowerCase()
        return keywords.some((keyword) => docNameLower.includes(keyword.toLowerCase()))
      })
      .map((dt) => dt.id)
  }
  return []
})

const currentRequiredDocNames = computed(() => {
  const mandatoryIds = currentMandatoryDocIds.value
  return fetchedDocumentTypes.value
    .filter((dt) => mandatoryIds.includes(dt.id))
    .map((dt) => dt.document_name)
})

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(localFormData.cid_no)
})

watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData })
  },
  { deep: true },
)

watch(
  () => localFormData.registration_type,
  () => {
    delete errors.mandatory_documents
    supportingDocuments.value.forEach((_, index) => {
      delete errors[`document_type_${index}`]
      delete errors[`document_file_${index}`]
    })
  },
)

const validateFormStageOne = () => {
  Object.keys(errors).forEach((key) => {
    if (
      !key.startsWith('document_') &&
      key !== 'mandatory_documents' &&
      key !== 'declaration' &&
      ![
        'qualification_type',
        'qualification_name',
        'other_qualification_name_specify',
        'institute',
        'year_of_completion',
      ].includes(key)
    ) {
      delete errors[key]
    }
  })
  let isValid = true

  if (!localFormData.full_name) {
    errors.full_name = 'Full name is required.'
    isValid = false
  }
  if (!localFormData.gender) {
    errors.gender = 'Gender is required.'
    isValid = false
  }
  if (!localFormData.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required.'
    isValid = false
  }
  if (!localFormData.contact_no) {
    errors.contact_no = 'Contact number is required.'
    isValid = false
  } else if (!/^\d{7,15}$/.test(localFormData.contact_no)) {
    errors.contact_no = 'Please enter a valid contact number (7-15 digits).'
    isValid = false
  }
  if (!localFormData.passport_photo) {
    errors.passport_photo = 'Passport photo is required.'
    isValid = false
  }
  if (!localFormData.registration_type) {
    errors.registration_type = 'Registration type is required.'
    isValid = false
  } else {
    const availableTypes = filteredRegistrationTypes.value.map((rt) => rt.id)
    if (!availableTypes.includes(localFormData.registration_type)) {
      errors.registration_type = 'Please select a valid registration type.'
      isValid = false
    }
  }
  if (props.selectedType === 'cid') {
    if (!localFormData.cid_no) {
      errors.cid_no = 'CID is required.'
      isValid = false
    } else if (!/^\d{11}$/.test(localFormData.cid_no)) {
      errors.cid_no = 'CID must be exactly 11 digits.'
      isValid = false
    }
    if (!localFormData.dzongkhag && isCIDValid.value)
      errors.dzongkhag = 'Dzongkhag should auto-fill; try re-entering CID.'
    if (!localFormData.gewog && isCIDValid.value)
      errors.gewog = 'Gewog should auto-fill; try re-entering CID.'
    if (!localFormData.village && isCIDValid.value)
      errors.village = 'Village should auto-fill; try re-entering CID.'
    if (
      (!localFormData.dzongkhag || !localFormData.gewog || !localFormData.village) &&
      isCIDValid.value
    )
      isValid = false
  } else {
    if (!localFormData.nationality) {
      errors.nationality = 'Nationality is required.'
      isValid = false
    }
    if (!localFormData.email_address) {
      errors.email_address = 'Email is required.'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(localFormData.email_address)) {
      errors.email_address = 'Please enter a valid email address.'
      isValid = false
    }
    if (!localFormData.workPermitNo) {
      errors.workPermitNo = 'Identity / Work permit number is required.'
      isValid = false
    }
    if (!localFormData.country) {
      errors.country = 'Country of residence is required.'
      isValid = false
    }
    if (!localFormData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required.'
      isValid = false
    } else {
      const bhutaneseMobilePattern = /^[17]\d{7}$/
      const internationalMobilePattern = /^\+?\d{7,15}$/
      if (
        localFormData.nationality === 'Bhutanese' &&
        !bhutaneseMobilePattern.test(localFormData.mobileNumber)
      ) {
        errors.mobileNumber = 'Bhutanese mobile numbers must be 8 digits and start with 1 or 7.'
        isValid = false
      } else if (
        localFormData.nationality !== 'Bhutanese' &&
        !internationalMobilePattern.test(localFormData.mobileNumber)
      ) {
        errors.mobileNumber = 'Please enter a valid mobile number (7-15 digits, can start with +).'
        isValid = false
      }
    }
  }
  return isValid
}

const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification type is required.'
    isValid = false
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification name is required.'
    isValid = false
  }
  if (
    localFormData.qualification_name === 'OTHERS' &&
    !localFormData.other_qualification_name_specify
  ) {
    errors.other_qualification_name_specify = 'Please specify the qualification name.'
    isValid = false
  }
  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required.'
    isValid = false
  }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of completion is required.'
    isValid = false
  }
  const mandatoryDocIds = currentMandatoryDocIds.value
  for (const docId of mandatoryDocIds) {
    const isUploaded = localFormData.documents.some(
      (uploadedDoc) => uploadedDoc.type === docId && uploadedDoc.files.length > 0,
    )
    if (!isUploaded) {
      const docName =
        fetchedDocumentTypes.value.find((dt) => dt.id === docId)?.document_name ||
        'Unknown Document'
      errors.mandatory_documents = `Missing mandatory document: "${docName}". Please upload all required documents.`
      isValid = false
      break
    }
  }
  supportingDocuments.value.forEach((doc, index) => {
    if (doc.files.length > 0 && !doc.type) {
      errors[`document_type_${index}`] = 'Please select a document type for the uploaded file(s).'
      isValid = false
    }
    if (doc.type && doc.files.length === 0) {
      const isMandatory = currentMandatoryDocIds.value.includes(doc.type)
      if (isMandatory) {
        const docName =
          fetchedDocumentTypes.value.find((dt) => dt.id === doc.type)?.document_name ||
          'Selected Document'
        errors[`document_file_${index}`] = `File missing for mandatory document type: ${docName}.`
        isValid = false
      } else {
        errors[`document_file_${index}`] =
          'Please upload file(s) for the selected document type or remove the row.'
        isValid = false
      }
    }
  })
  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration to proceed.'
    isValid = false
  }
  return isValid
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split('/')
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }
  return dateString
}

const fetchDCRCData = async () => {
  if (props.selectedType !== 'cid' || !isCIDValid.value) {
    localFormData.full_name = ''
    localFormData.date_of_birth = ''
    localFormData.gender = ''
    localFormData.dzongkhag = ''
    localFormData.gewog = ''
    localFormData.village = ''
    return
  }
  if (!user?.id) {
    toast.error('User ID is not available. Please ensure you are logged in.')
    return
  }
  isLoadingDCRC.value = true
  try {
    const response = await apiService.fetchCitizenDetails(localFormData.cid_no, {
      params: { user_id: user.id },
    })
    const genderMap = { F: 'female', M: 'male', O: 'O' }
    const data = response.data
    Object.assign(localFormData, {
      full_name: data.applicants_name || '',
      date_of_birth: data.date_of_birth ? formatDateForInput(data.date_of_birth) : '',
      gender: genderMap[data.gender] || '',
      dzongkhag: data.dzongkhag || '',
      gewog: data.gewog || '',
      village: data.village || '',
    })
    toast.success('Citizen details fetched successfully.')
  } catch (error) {
    console.error('Error fetching DCRC data:', error.response?.data || error.message)
    const errorMessage =
      error.response?.data?.error ||
      'Failed to fetch citizen details. Please enter details manually.'
    toast.error(errorMessage)
    localFormData.full_name = ''
    localFormData.date_of_birth = ''
    localFormData.gender = ''
    localFormData.dzongkhag = ''
    localFormData.gewog = ''
    localFormData.village = ''
  } finally {
    isLoadingDCRC.value = false
  }
}

const handlePassportPhotoSelect = (event) => {
  const file = event.target.files[0]
  delete errors.passport_photo
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      localFormData.passport_photo = null
      errors.passport_photo = 'File size exceeds 2MB. Please choose a smaller file.'
      toast.error(errors.passport_photo)
      event.target.value = ''
    } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type.toLowerCase())) {
      localFormData.passport_photo = null
      errors.passport_photo = 'Invalid file type. Please upload a JPG, JPEG, or PNG image.'
      toast.error(errors.passport_photo)
      event.target.value = ''
    } else {
      localFormData.passport_photo = file
    }
  } else {
    localFormData.passport_photo = null
  }
}

const formatDateForAPI = (dateInput) => {
  let dateObj
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    dateObj = dateInput
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput)
    if (isNaN(dateObj)) {
      console.error('Invalid date string provided to formatDateForAPI:', dateInput)
      return null
    }
  } else {
    console.error('Invalid date input provided to formatDateForAPI:', dateInput)
    return null
  }
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleNext = async () => {
  if (validateFormStageOne()) {
    isSubmitting.value = true
    const formDataStageOne = { ...localFormData }
    if (props.selectedType !== 'cid') {
      formDataStageOne.cid_no = formDataStageOne.workPermitNo
      formDataStageOne.village = formDataStageOne.city
      formDataStageOne.gewog = formDataStageOne.state
      formDataStageOne.dzongkhag = formDataStageOne.country
      delete formDataStageOne.city
      delete formDataStageOne.state
      delete formDataStageOne.workPermitNo
      delete formDataStageOne.mobileNumber
    }
    const fieldsToRemove = [
      'documents',
      'remarks',
      'declaration',
      'payment_status',
      'payment_id',
      'qualification_type',
      'qualification_name',
      'other_qualification_name_specify',
      'institute',
      'year_of_completion',
      'is_active',
      'application',
      'cid_holder',
    ]
    if (props.selectedType === 'cid') {
      delete formDataStageOne.mobileNumber
      delete formDataStageOne.country
    }
    fieldsToRemove.forEach((field) => delete formDataStageOne[field])
    const today = new Date()
    const expiry = new Date(today)
    expiry.setFullYear(today.getFullYear() + 5)
    formDataStageOne.registration_date = formatDateForAPI(today)
    formDataStageOne.expiry_date = formatDateForAPI(expiry)
    const apiFormData = new FormData()
    for (const key in formDataStageOne) {
      if (
        Object.prototype.hasOwnProperty.call(formDataStageOne, key) &&
        formDataStageOne[key] !== null &&
        formDataStageOne[key] !== undefined &&
        formDataStageOne[key] !== ''
      ) {
        if (key === 'passport_photo' && formDataStageOne[key] instanceof File) {
          apiFormData.append('passport_photo', formDataStageOne[key], formDataStageOne[key].name)
        } else {
          apiFormData.append(key, formDataStageOne[key])
        }
      }
    }
    apiFormData.append('applicant', user.id)
    apiFormData.append('is_draft', 'False')
    try {
      const response = await apiService.createEpcNewApplication(apiFormData)
      applicationId.value = response.data.id
      localFormData.application = response.data.id
      toast.success('Personal information saved successfully!')
      stage.value = 2
    } catch (error) {
      console.error('Error submitting personal information:', error.response?.data || error.message)
      const errorMessages = Object.entries(
        error.response?.data || { 'API Error': [error.message || 'Unknown error'] },
      )
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ')
      toast.error(`Failed to save personal information: ${errorMessages}`)
    } finally {
      isSubmitting.value = false
    }
  } else {
    toast.error('Please correct the errors in Step 1 before proceeding.')
  }
}

const openConfirmationModal = () => {
  updateFormDocuments()
  if (validateForm()) {
    isConfirmationModalOpen.value = true
  } else {
    toast.error('Please correct all errors and upload mandatory documents before submitting.')
  }
}

const handleSubmitActual = async () => {
  isConfirmationModalOpen.value = false
  updateFormDocuments()
  if (!validateForm()) {
    toast.error('Submission cancelled due to validation errors. Please review the form.')
    return
  }
  if (!localFormData.application) {
    toast.error(
      'Application ID is missing. Cannot submit qualification details. Please go back to Step 1.',
    )
    isSubmitting.value = false
    return
  }
  isSubmitting.value = true
  try {
    const qualificationFormData = new FormData()
    qualificationFormData.append('application', localFormData.application)
    if (localFormData.qualification_name === 'OTHERS') {
      qualificationFormData.append(
        'qualification_name_text',
        localFormData.other_qualification_name_specify,
      )
    } else {
      qualificationFormData.append('qualification_name', localFormData.qualification_name)
    }
    qualificationFormData.append('qualification_type', localFormData.qualification_type)
    qualificationFormData.append('institute_university', localFormData.institute)
    if (localFormData.year_of_completion && typeof localFormData.year_of_completion === 'string') {
      const year = localFormData.year_of_completion.split('-')[0]
      if (year && !isNaN(parseInt(year))) {
        qualificationFormData.append('completion_year', year)
      }
    }
    qualificationFormData.append('declaration', localFormData.declaration ? 'True' : 'False')
    qualificationFormData.append('remarks', localFormData.remarks || '')
    qualificationFormData.append('is_primary_qualification', 'True')
    localFormData.documents.forEach((doc) => {
      if (doc.files && doc.files.length > 0 && doc.type) {
        doc.files.forEach((fileObject) => {
          qualificationFormData.append(
            'user_qualification_attachment_files',
            fileObject,
            fileObject.name,
          )
          qualificationFormData.append('user_qualification_attachment_file_types', doc.type)
        })
      }
    })
    await apiService.createEpcNewQualification(qualificationFormData)
    toast.success('Registration submitted successfully!')
    emit('submit', { ...localFormData })
    router.push('/admin/user/engineering_certification/my_applications')
  } catch (error) {
    console.error(
      'Error submitting qualification and documents:',
      error.response?.data || error.message,
    )
    const errorMessages = Object.entries(
      error.response?.data || { 'API Error': [error.message || 'Unknown error'] },
    )
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return Object.entries(value)
            .map(
              ([nestedKey, nestedValue]) =>
                `${key}.${nestedKey}: ${
                  Array.isArray(nestedValue) ? nestedValue.join(', ') : nestedValue
                }`,
            )
            .join('; ')
        }
        return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
      })
      .join('; ')
    toast.error(`Submission failed: ${errorMessages}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}

.bg-gray-100[readonly] {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .text-sm {
    font-size: 0.8125rem;
  }

  .text-xs {
    font-size: 0.75rem;
  }
}
</style>