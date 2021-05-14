<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
    <PageHeader :title="selectedType === 'cid' ? 'CID Holder Registration' : 'Non-CID Holder Registration'">
      <template #icon>
        <UserPlus class="w-6 h-6 text-indigo-600" />
      </template>
      <template #subtitle>
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
        information provided is accurate and up-to-date.
      </template>
    </PageHeader>

    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-50" @close="isConfirmationModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    @click="handleSubmitActual">
                    Confirm
                  </button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="isConfirmationModalOpen = false">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <form @submit.prevent="handleNext" class="bg-white border rounded-xl shadow-sm p-4 sm:p-6" v-if="stage === 1">
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
              <input v-model="localFormData.cid_no" type="number" maxlength="11"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Enter 11-digit CID number" @input="fetchDCRCData" />
              <span v-if="errors.cid_no" class="text-xs text-red-500 mt-1">{{
                errors.cid_no
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <input type="text" v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-100"
                readonly />
              <span v-if="errors.dzongkhag" class="text-xs text-red-500 mt-1">{{
                errors.dzongkhag
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Gewog</label>
              <input type="text" v-model="localFormData.gewog"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-100"
                readonly />
              <span v-if="errors.gewog" class="text-xs text-red-500 mt-1">{{ errors.gewog }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input type="text" v-model="localFormData.village"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-100"
                readonly />
              <span v-if="errors.village" class="text-xs text-red-500 mt-1">{{
                errors.village
              }}</span>
            </div>
          </template>

          <template v-else>
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
              <select v-model="localFormData.nationality"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">SELECT NATIONALITY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.nationality" class="text-xs text-red-500 mt-1">{{
                errors.nationality
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
              <input v-model="localFormData.email_address" type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Email Address" />
              <span v-if="errors.email_address" class="text-xs text-red-500 mt-1">{{
                errors.email_address
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Identity / Work Permit No</label>
              <input v-model="localFormData.workPermitNo" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Identity / Work Permit No" />
              <span v-if="errors.workPermitNo" class="text-xs text-red-500 mt-1">{{
                errors.workPermitNo
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Country of Residence</label>
              <select v-model="localFormData.country"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">SELECT COUNTRY</option>
                <option v-for="countryItem in countries" :key="countryItem" :value="countryItem">
                  {{ countryItem }}
                </option>
              </select>
              <span v-if="errors.country" class="text-xs text-red-500 mt-1">{{
                errors.country
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">City / Town</label>
              <input v-model="localFormData.city" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="City / Town" />
              <span v-if="errors.city" class="text-xs text-red-500 mt-1">{{ errors.city }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">State / Province</label>
              <input v-model="localFormData.state" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="State / Province" />
              <span v-if="errors.state" class="text-xs text-red-500 mt-1">{{ errors.state }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
              <input v-model="localFormData.mobileNumber" type="tel"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Mobile Number" />
              <span v-if="errors.mobileNumber" class="text-xs text-red-500 mt-1">{{
                errors.mobileNumber
              }}</span>
            </div>
          </template>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input v-model="localFormData.full_name" type="text"
              :class="['mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2', { 'bg-gray-100': selectedType === 'cid' }]"
              placeholder="Enter full name" :readonly="selectedType === 'cid'" />
            <span v-if="errors.full_name" class="text-xs text-red-500 mt-1">{{
              errors.full_name
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select v-model="localFormData.gender"
              :class="['mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2', { 'bg-gray-100': selectedType === 'cid' }]"
              :disabled="selectedType === 'cid'">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="O">Other</option>
            </select>
            <span v-if="errors.gender" class="text-xs text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input type="date" v-model="localFormData.date_of_birth"
              :class="['mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2', { 'bg-gray-100': selectedType === 'cid' }]"
              :readonly="selectedType === 'cid'" />
            <span v-if="errors.date_of_birth" class="text-xs text-red-500 mt-1">{{
              errors.date_of_birth
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number (for communication)</label>
            <input v-model="localFormData.contact_no" type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter phone number" />
            <span v-if="errors.contact_no" class="text-xs text-red-500 mt-1">{{
              errors.contact_no
            }}</span>
          </div>
        </div>

        <div class="col-span-1 sm:col-span-2 mt-4 sm:mt-6">
          <label class="block text-sm font-medium text-gray-700 required">Registration Type</label>
          <div class="mt-2 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <div v-for="regType in displayRegistrationTypes" :key="regType.id" class="flex items-center">
              <input :id="'reg_type_' + regType.id" v-model="localFormData.registration_type" :value="regType.id"
                type="radio" name="registration_type_radio"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
              <label :for="'reg_type_' + regType.id" class="ml-2 block text-sm text-gray-900 capitalize">
                {{ regType.name }}
              </label>
            </div>
          </div>
          <div v-if="!displayRegistrationTypes.length && !isLoadingMasters" class="mt-2 text-sm text-yellow-600">
            Could not load specific registration types. Defaulting to Full Registration.
          </div>
          <div v-if="isLoadingMasters" class="mt-2 text-sm text-gray-500">Loading registration types...</div>
          <span v-if="errors.registration_type" class="text-xs text-red-500 mt-1">{{
            errors.registration_type
          }}</span>
        </div>


        <div class="mt-8">
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Passport Photo</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 required">Upload Passport Photo (JPG, PNG, max
                  2MB)</label>
                <input type="file" @change="handlePassportPhotoSelect"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".jpg,.jpeg,.png" />
                <span v-if="errors.passport_photo" class="text-xs text-red-500 mt-1">{{
                  errors.passport_photo
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <button type="button" @click="$emit('back')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Back to Selection
          </button>
          <button type="submit"
            class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="isSubmitting">
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Next: Qualification</span>
          </button>
        </div>
      </div>
    </form>

    <form @submit.prevent="openConfirmationModal" class="bg-white border rounded-xl shadow-sm p-4 sm:p-6"
      v-else-if="stage === 2">
      <h3 class="text-lg font-semibold text-gray-900 my-3">
        Step 2: Qualification & Document Upload
      </h3>

      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Qualification Details
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
              <select v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Qualification Type</option>
                <option v-for="qType in qualificationTypes" :key="qType.id" :value="qType.id">
                  {{ qType.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-xs text-red-500 mt-1">{{
                errors.qualification_type
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
              <select v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Qualification Name</option>
                <option v-for="qualification in qualifications" :key="qualification.id" :value="qualification.id">
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-xs text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
              <select v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Institute/University</option>
                <option v-for="university in universities" :key="university.id" :value="university.id">
                  {{ university.country }}, {{ university.university }},
                  {{ university.institute_name }}
                </option>
              </select>
              <span v-if="errors.institute" class="text-xs text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Year of Completion (YYYY-MM)</label>
              <input type="month" v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="YYYY-MM" />
              <span v-if="errors.year_of_completion" class="text-xs text-red-500 mt-1">{{
                errors.year_of_completion
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Supporting Documents
          </h3>
          <p class="text-sm text-gray-600 mb-1">
            Please upload all mandatory documents for your selected registration type.
            Document types available are from the master list.
            (Allowed: .pdf, .doc, .docx, .jpg, .jpeg, .png; Max 2MB per file)
          </p>
          <div v-if="currentRequiredDocNames.length > 0"
            class="mt-2 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p class="text-sm font-medium text-blue-700">Mandatory documents for {{ localFormData.registration_type ===
              FULL_REGISTRATION_ID ? 'Full Registration' : (localFormData.registration_type ===
                PROVISIONAL_REGISTRATION_ID
                ? 'Provisional Registration' : 'Temporary Registration') }}:</p>
            <ul class="list-disc list-inside text-xs text-blue-600 mt-1">
              <li v-for="docName in currentRequiredDocNames" :key="docName">{{ docName }}</li>
            </ul>
          </div>
          <p v-else-if="!isLoadingMasters && fetchedDocumentTypes.length > 0" class="text-xs text-gray-500 mt-1 mb-3">No
            specific mandatory documents are listed for this registration type. Please ensure all relevant documents are
            uploaded.</p>
          <p v-else-if="!isLoadingMasters && fetchedDocumentTypes.length === 0"
            class="text-xs text-yellow-600 mt-1 mb-3">
            Document types master list could not be loaded. Document selection may be affected.</p>
          <span v-if="errors.mandatory_documents" class="text-xs text-red-500 mt-1 block">{{ errors.mandatory_documents
            }}</span>


          <div class="space-y-3 mt-4">
            <div v-for="(doc, index) in supportingDocuments" :key="index"
              class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <div class="w-full sm:w-1/3">
                <label :for="'doc_type_' + index" class="sr-only">Document Type {{ index + 1 }}</label>
                <select :id="'doc_type_' + index" v-model="doc.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm">
                  <option value="">Select Document Type</option>
                  <option v-for="docTypeOption in fetchedDocumentTypes" :key="docTypeOption.id"
                    :value="docTypeOption.id">
                    {{ docTypeOption.document_name }}
                  </option>
                </select>
                <span v-if="errors[`document_type_${index}`]" class="text-xs text-red-500 mt-1">{{
                  errors[`document_type_${index}`] }}</span>
                <p v-if="!isLoadingMasters && fetchedDocumentTypes.length === 0 && index === 0"
                  class="text-xs text-yellow-500 mt-1">
                  Document types list is empty.
                </p>
              </div>
              <div class="flex-1 flex items-center space-x-2">
                <label :for="'doc_file_' + index" class="sr-only">File for Document {{ index + 1 }}</label>
                <input :id="'doc_file_' + index" type="file" @change="(e) => handleFileSelect(e, index)"
                  class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
                <button @click="removeDocument(index)" type="button"
                  class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  aria-label="Remove document">
                  <span class="sr-only">Remove</span>
                  ✕
                </button>
              </div>
              <span v-if="errors[`document_file_${index}`]"
                class="text-xs text-red-500 mt-1 w-full sm:w-auto sm:flex-initial">{{ errors[`document_file_${index}`]
                }}</span>
            </div>

            <button type="button" @click="addDocument"
              class="mt-3 px-3 py-2 bg-blue-50 text-sm text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
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
            <textarea id="remarks" v-model="localFormData.remarks" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
              placeholder="Enter any additional remarks or comments"></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <input type="checkbox" id="declaration_checkbox" v-model="localFormData.declaration"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="declaration_checkbox" class="text-sm text-gray-700">
              I hereby declare that all the information provided above is true and correct to the
              best of my knowledge. I understand that any false statements may result in the
              rejection of my registration. <span class="text-red-600">*</span>
            </label>
          </div>
          <span v-if="errors.declaration" class="text-xs text-red-500 mt-1">{{ errors.declaration }}</span>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button type="button" @click="stage = 1"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Back to Personal Info
        </button>
        <button type="submit"
          class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="isSubmitting || !localFormData.declaration">
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
// const userId = authStore.userId // Not directly used, user.id is used
const user = authStore.user
const router = useRouter()

const props = defineProps({
  selectedType: { // 'cid' or 'non-cid'
    type: String,
    required: true,
  },
  modelValue: { // For v-model binding if this component is used with it
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'submit', // Emitted on successful final submission
  'back',   // Emitted when user clicks "Back to Selection" in stage 1
])

const stage = ref(1) // Controls which form stage is visible (1 or 2)
const applicationId = ref(null) // Stores the ID of the application created in stage 1
const isLoadingMasters = ref(true); // Tracks loading state for master data

const fetchedDocumentTypes = ref([]) // Master list of all possible document types {id, document_name}
const supportingDocuments = ref([{ type: '', files: [] }]) // Array for user's document uploads. Removed 'description' as it's not used.

// Adds a new empty row for document upload
const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [] }) // Removed 'description'
}

// Removes a document upload row by its index
const removeDocument = (index) => {
  supportingDocuments.value.splice(index, 1)
  updateFormDocuments() // Update localFormData.documents after removal
}

// Handles file selection for a specific document row
const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

  delete errors[`document_file_${index}`]; // Clear previous error for this file input

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      errors[`document_file_${index}`] = `File '${file.name}' exceeds 2MB. Max size is 2MB.`;
      toast.error(errors[`document_file_${index}`]);
      event.target.value = '';
      supportingDocuments.value[index].files = [];
      updateFormDocuments();
      return;
    }
    const fileExtension = ('.' + file.name.split('.').pop()).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      errors[`document_file_${index}`] = `File '${file.name}' has an invalid type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}.`;
      toast.error(errors[`document_file_${index}`]);
      event.target.value = '';
      supportingDocuments.value[index].files = [];
      updateFormDocuments();
      return;
    }
  }

  supportingDocuments.value[index].files = files
  updateFormDocuments() // Update localFormData.documents with the new files
}

// Prepares the `localFormData.documents` array for submission
const updateFormDocuments = () => {
  localFormData.documents = supportingDocuments.value
    .filter(doc => doc.type && doc.files.length > 0)
    .map(doc => ({
      type: doc.type, // This is the document_type_id
      files: doc.files,
    }));
}

// Static list of countries for dropdowns
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
]

// Refs for master data dropdowns
const qualificationTypes = ref([])
const qualifications = ref([])
const universities = ref([])
const allRegistrationTypesFromAPI = ref([]) // Holds all registration types fetched from API

// --- Registration Type IDs ---
const FULL_REGISTRATION_ID = 2;
const PROVISIONAL_REGISTRATION_ID = 3;
const TEMPORARY_REGISTRATION_ID = 4;

// --- Configuration for Required Documents ---
// IMPORTANT: Values in arrays MUST EXACTLY MATCH `document_name` from your `fetchedDocumentTypes` master list.
const REQUIRED_DOCS_CONFIG = {
  [FULL_REGISTRATION_ID]: [
    "Declaration of the Code of Professional Fidelity signed on Legal Stamp",
    "Graduation Certificate (Master/degree/diploma/certificate)",
    "Provisional or Course Completion Certificate",
    "Marksheet (Master/degree/diploma/certificate)",
    "Internship completion certificate",
    "Class X and XII pass certificates",
    "Class X and XII statement of marks",
    "Citizenship identity card",
    "Valid Security clearance",
    "Recognition of Qualification Certificate"
  ],
  [PROVISIONAL_REGISTRATION_ID]: [ // Replace with actual document_names from your master
    "Graduation Certificate (Master/degree/diploma/certificate)",
    "Provisional or Course Completion Certificate",
    "Citizenship identity card",
    // e.g., "Medical Fitness Certificate"
  ],
  [TEMPORARY_REGISTRATION_ID]: [ // Replace with actual document_names from your master
    "Graduation Certificate (Master/degree/diploma/certificate)",
    "Work Offer Letter", // This needs to be an exact match to a document_name in fetchedDocumentTypes
    "Request Letter from Sponsoring Body", // This also needs to be an exact match
    // e.g., "Passport Copy"
  ],
};

// Computed property to get the registration types to display in radio buttons
const displayRegistrationTypes = computed(() => {
  if (allRegistrationTypesFromAPI.value && allRegistrationTypesFromAPI.value.length > 0) {
    const relevantTypeIds = [FULL_REGISTRATION_ID, PROVISIONAL_REGISTRATION_ID, TEMPORARY_REGISTRATION_ID];
    const relevantTypes = allRegistrationTypesFromAPI.value.filter(rt => relevantTypeIds.includes(rt.id));
    return relevantTypes.map(rt => ({ id: rt.id, name: rt.name.toLowerCase() }));
  }
  // Fallback if API data isn't as expected or not loaded
  return [
    { id: FULL_REGISTRATION_ID, name: 'full registration' },
    { id: PROVISIONAL_REGISTRATION_ID, name: 'provisional' },
    { id: TEMPORARY_REGISTRATION_ID, name: 'temporary registration' },
  ];
});

// Fetch master data when component is mounted
onMounted(async () => {
  isLoadingMasters.value = true;
  try {
    const responses = await Promise.all([
      apiService.getMhpcMastersQualificationTypes(),
      apiService.getMhpcMastersQualifications(),
      apiService.getMhpcMastersUniversities(),
      apiService.getMhpcMastersRegistrationTypes(), // Fetches ALL registration types
      apiService.getMhpcMastersDocumentTypes()
    ]);

    qualificationTypes.value = responses[0]?.data?.results || [];
    qualifications.value = responses[1]?.data?.results || [];
    universities.value = responses[2]?.data?.results || [];
    allRegistrationTypesFromAPI.value = responses[3]?.data?.results || [];
    fetchedDocumentTypes.value = responses[4]?.data?.results || [];

    // Ensure default registration_type is valid after fetching
    const availableRegTypeIds = allRegistrationTypesFromAPI.value.map(rt => rt.id);
    if (!availableRegTypeIds.includes(localFormData.registration_type)) { // If current default isn't in fetched list
      if (availableRegTypeIds.includes(FULL_REGISTRATION_ID)) { // Prioritize Full Reg ID
        localFormData.registration_type = FULL_REGISTRATION_ID;
      } else if (displayRegistrationTypes.value.length > 0) { // Fallback to first relevant type
        localFormData.registration_type = displayRegistrationTypes.value[0].id;
      }
      // If displayRegistrationTypes is also empty, it keeps the hardcoded FULL_REGISTRATION_ID
    }

  } catch (error) {
    console.error('Error fetching master data:', error);
    toast.error('Failed to fetch master data. Some dropdowns or options may not populate correctly. Please try refreshing.');
  } finally {
    isLoadingMasters.value = false;
  }
});

// Reactive form data object
const localFormData = reactive({
  ...props.modelValue, // Spread initial values from prop
  cid_holder: props.selectedType === 'cid',
  nationality: props.selectedType === 'cid' ? 'Bhutanese' : '',
  email_address: user?.email || '',
  workPermitNo: '',
  mobileNumber: '', // For non-CID holders
  full_name: '',
  gender: '',
  date_of_birth: '',
  city: '',
  state: '',
  country: '', // For non-CID, country of residence
  contact_no: '', // Main contact number for communication
  passport_photo: null,
  documents: [], // Stores { type: ID, files: [File, ...] } for submission
  remarks: '',
  declaration: false,
  // Fields related to application status/details, usually set by backend
  payment_status: 'False',
  payment_id: null,
  registration_date: null,
  expiry_date: null,
  // Qualification fields
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: null, // Expected format YYYY-MM
  is_active: 'False', // Default status
  application: null, // Will hold the application ID from stage 1
  registration_type: FULL_REGISTRATION_ID, // Default to Full Registration ID
});

const errors = reactive({}) // For storing form validation errors
const isConfirmationModalOpen = ref(false) // Controls visibility of submission confirmation modal
const isSubmitting = ref(false) // Tracks submission process state
const toast = useToast() // For displaying notifications
const isLoadingDCRC = ref(false) // Tracks DCRC data fetching state

// Computed property for the list of mandatory document names for the current registration type
const currentRequiredDocNames = computed(() => {
  return REQUIRED_DOCS_CONFIG[localFormData.registration_type] || [];
});

// Computed property to check if CID is valid (11 digits)
const isCIDValid = computed(() => {
  return /^\d{11}$/.test(localFormData.cid_no)
})

// Watch for changes in localFormData to emit update to parent (if using v-model)
watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData })
  },
  { deep: true },
)

// Watch for changes in registration_type to clear document-related errors
watch(() => localFormData.registration_type, () => {
  delete errors.mandatory_documents;
  supportingDocuments.value.forEach((_, index) => { // Clear individual row errors
    delete errors[`document_type_${index}`];
    delete errors[`document_file_${index}`];
  });
});


// Validates the first stage of the form
const validateFormStageOne = () => {
  // Clear previous non-document errors from stage 1
  Object.keys(errors).forEach((key) => {
    if (!key.startsWith('document_') && key !== 'mandatory_documents' && key !== 'declaration' &&
      !['qualification_type', 'qualification_name', 'institute', 'year_of_completion'].includes(key)) {
      delete errors[key];
    }
  });
  let isValid = true

  if (!localFormData.full_name) { errors.full_name = 'Full name is required.'; isValid = false; }
  if (!localFormData.gender) { errors.gender = 'Gender is required.'; isValid = false; }
  if (!localFormData.date_of_birth) { errors.date_of_birth = 'Date of birth is required.'; isValid = false; }

  if (!localFormData.contact_no) {
    errors.contact_no = 'Contact number is required.'; isValid = false;
  } else if (!/^\d{7,15}$/.test(localFormData.contact_no)) {
    errors.contact_no = 'Please enter a valid contact number (7-15 digits).'; isValid = false;
  }

  if (!localFormData.passport_photo) { errors.passport_photo = 'Passport photo is required.'; isValid = false; }
  if (!localFormData.registration_type) { errors.registration_type = 'Registration type is required.'; isValid = false; }

  if (props.selectedType === 'cid') {
    if (!localFormData.cid_no) { errors.cid_no = 'CID is required.'; isValid = false; }
    else if (!/^\d{11}$/.test(localFormData.cid_no)) { errors.cid_no = 'CID must be exactly 11 digits.'; isValid = false; }

    if (!localFormData.dzongkhag && isCIDValid.value) errors.dzongkhag = 'Dzongkhag should auto-fill; try re-entering CID.';
    if (!localFormData.gewog && isCIDValid.value) errors.gewog = 'Gewog should auto-fill; try re-entering CID.';
    if (!localFormData.village && isCIDValid.value) errors.village = 'Village should auto-fill; try re-entering CID.';
    if ((!localFormData.dzongkhag || !localFormData.gewog || !localFormData.village) && isCIDValid.value) isValid = false;

  } else { // Non-CID Holder
    if (!localFormData.nationality) { errors.nationality = 'Nationality is required.'; isValid = false; }
    if (!localFormData.email_address) {
      errors.email_address = 'Email is required.'; isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(localFormData.email_address)) {
      errors.email_address = 'Please enter a valid email address.'; isValid = false;
    }
    if (!localFormData.workPermitNo) { errors.workPermitNo = 'Identity / Work permit number is required.'; isValid = false; }
    if (!localFormData.country) { errors.country = 'Country of residence is required.'; isValid = false; }

    if (!localFormData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required.'; isValid = false;
    } else {
      const bhutaneseMobilePattern = /^[17]\d{7}$/;
      const internationalMobilePattern = /^\+?\d{7,15}$/;
      if (localFormData.nationality === 'Bhutanese' && !bhutaneseMobilePattern.test(localFormData.mobileNumber)) {
        errors.mobileNumber = 'Bhutanese mobile numbers must be 8 digits and start with 1 or 7.'; isValid = false;
      } else if (localFormData.nationality !== 'Bhutanese' && !internationalMobilePattern.test(localFormData.mobileNumber)) {
        errors.mobileNumber = 'Please enter a valid mobile number (7-15 digits, can start with +).'; isValid = false;
      }
    }
  }
  return isValid;
}

// Validates the entire form (both stages)
const validateForm = () => {
  if (!validateFormStageOne()) return false; // Validate stage 1 first

  // Clear previous stage 2 specific errors
  delete errors.qualification_type;
  delete errors.qualification_name;
  delete errors.institute;
  delete errors.year_of_completion;
  delete errors.mandatory_documents;
  delete errors.declaration;
  supportingDocuments.value.forEach((_, index) => { // Clear individual row errors
    delete errors[`document_type_${index}`];
    delete errors[`document_file_${index}`];
  });

  let isValid = true;

  if (!localFormData.qualification_type) { errors.qualification_type = 'Qualification Type is required.'; isValid = false; }
  if (!localFormData.qualification_name) { errors.qualification_name = 'Qualification Name is required.'; isValid = false; }
  if (!localFormData.institute) { errors.institute = 'Institute/University is required.'; isValid = false; }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required (YYYY-MM format).'; isValid = false;
  } else {
    const currentFullDate = new Date();
    const currentYear = currentFullDate.getFullYear();
    const currentMonth = currentFullDate.getMonth() + 1;
    const [yearStr, monthStr] = localFormData.year_of_completion.split('-');
    const completionYear = parseInt(yearStr);
    const completionMonth = parseInt(monthStr);

    if (isNaN(completionYear) || isNaN(completionMonth) || completionMonth < 1 || completionMonth > 12 || yearStr.length !== 4 || monthStr.length !== 2) {
      errors.year_of_completion = 'Invalid year/month format (YYYY-MM).'; isValid = false;
    } else if (completionYear > currentYear || (completionYear === currentYear && completionMonth > currentMonth)) {
      errors.year_of_completion = 'Year of completion cannot be in the future.'; isValid = false;
    }
  }

  // Mandatory Document Validation
  const requiredDocNamesForCurrentRegType = REQUIRED_DOCS_CONFIG[localFormData.registration_type] || [];
  if (fetchedDocumentTypes.value.length > 0) { // Only validate if master list is loaded
    for (const requiredDocName of requiredDocNamesForCurrentRegType) {
      const docTypeFromMaster = fetchedDocumentTypes.value.find(dt => dt.document_name === requiredDocName);
      if (!docTypeFromMaster) {
        console.warn(`Configuration mismatch: Document name "${requiredDocName}" not found in fetchedDocumentTypes.`);
        errors.mandatory_documents = `Configuration error for document: ${requiredDocName}. Please contact support.`;
        isValid = false; break;
      }
      const isUploaded = localFormData.documents.some( // Check against processed localFormData.documents
        uploadedDoc => uploadedDoc.type === docTypeFromMaster.id && uploadedDoc.files.length > 0
      );
      if (!isUploaded) {
        errors.mandatory_documents = `Missing mandatory document: "${requiredDocName}". Please upload all required documents.`;
        isValid = false; break;
      }
    }
  } else if (requiredDocNamesForCurrentRegType.length > 0 && !isLoadingMasters.value) {
    // If master list failed to load but mandatory docs are configured, flag an issue.
    errors.mandatory_documents = "Could not verify document list due to a loading error. Please refresh or contact support.";
    isValid = false;
  }


  // Validate individual document rows (type selected if files are present, files present if type selected)
  supportingDocuments.value.forEach((doc, index) => {
    if (doc.files.length > 0 && !doc.type) {
      errors[`document_type_${index}`] = 'Please select a document type for the uploaded file(s).';
      isValid = false;
    }
    // If a type is selected, a file should be present, especially if it's a mandatory one (covered above)
    // For optional, if user adds a row and selects type, they should upload.
    if (doc.type && doc.files.length === 0) {
      const selectedDocName = fetchedDocumentTypes.value.find(fdt => fdt.id === doc.type)?.document_name;
      const isMandatory = currentRequiredDocNames.value.includes(selectedDocName);
      if (isMandatory) { // Stricter for mandatory types if somehow missed by above check
        errors[`document_file_${index}`] = `File missing for mandatory document type: ${selectedDocName}.`;
        isValid = false;
      } else { // For optional, if type is chosen, file is expected
        errors[`document_file_${index}`] = 'Please upload file(s) for the selected document type or remove the row.';
        isValid = false;
      }
    }
  });

  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration to proceed.';
    // toast.error(errors.declaration); // Toast can be repetitive if also shown in form
    isValid = false;
  }

  return isValid;
}

// Formats date from DD/MM/YYYY (DCRC) to YYYY-MM-DD (input[type=date])
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return dateString; // Return as is if not in expected format
}

// Fetches citizen details from DCRC API
const fetchDCRCData = async () => {
  if (props.selectedType !== 'cid' || !isCIDValid.value) {
    localFormData.full_name = '';
    localFormData.date_of_birth = '';
    localFormData.gender = '';
    localFormData.dzongkhag = '';
    localFormData.gewog = '';
    localFormData.village = '';
    return;
  }

  if (!user?.id) {
    toast.error('User ID is not available. Please ensure you are logged in.');
    return;
  }

  isLoadingDCRC.value = true;
  try {
    const response = await apiService.fetchCitizenDetails(localFormData.cid_no, {
      params: { user_id: user.id },
    });

    const genderMap = { F: 'female', M: 'male', O: 'O' };
    const data = response.data;

    Object.assign(localFormData, {
      full_name: data.applicants_name || '',
      date_of_birth: data.date_of_birth ? formatDateForInput(data.date_of_birth) : '',
      gender: genderMap[data.gender] || '',
      dzongkhag: data.dzongkhag || '',
      gewog: data.gewog || '',
      village: data.village || '',
    });
    toast.success('Citizen details fetched successfully.');
  } catch (error) {
    console.error('Error fetching DCRC data:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.error || 'Failed to fetch citizen details. Please enter details manually.';
    toast.error(errorMessage);
    localFormData.full_name = '';
    localFormData.date_of_birth = '';
    localFormData.gender = '';
    localFormData.dzongkhag = '';
    localFormData.gewog = '';
    localFormData.village = '';
  } finally {
    isLoadingDCRC.value = false;
  }
}

// Handles passport photo selection and validation
const handlePassportPhotoSelect = (event) => {
  const file = event.target.files[0];
  delete errors.passport_photo; // Clear previous error

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      localFormData.passport_photo = null;
      errors.passport_photo = 'File size exceeds 2MB. Please choose a smaller file.';
      toast.error(errors.passport_photo);
      event.target.value = '';
    } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type.toLowerCase())) {
      localFormData.passport_photo = null;
      errors.passport_photo = 'Invalid file type. Please upload a JPG, JPEG, or PNG image.';
      toast.error(errors.passport_photo);
      event.target.value = '';
    } else {
      localFormData.passport_photo = file;
    }
  } else {
    localFormData.passport_photo = null; // No file selected or selection cancelled
  }
}

// Formats a Date object or parsable date string to YYYY-MM-DD for API
const formatDateForAPI = (dateInput) => {
  let dateObj;
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput);
    if (isNaN(dateObj)) {
      console.error("Invalid date string provided to formatDateForAPI:", dateInput);
      return null;
    }
  } else {
    console.error("Invalid date input provided to formatDateForAPI:", dateInput);
    return null;
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Handles submission of Stage 1 form
const handleNext = async () => {
  if (validateFormStageOne()) {
    isSubmitting.value = true;
    const formDataStageOne = { ...localFormData };

    if (props.selectedType !== 'cid') {
      formDataStageOne.cid_no = formDataStageOne.workPermitNo;
      formDataStageOne.village = formDataStageOne.city;
      formDataStageOne.gewog = formDataStageOne.state;
      formDataStageOne.dzongkhag = formDataStageOne.country;

      delete formDataStageOne.city;
      delete formDataStageOne.state;
      // formDataStageOne.country is now dzongkhag
      delete formDataStageOne.workPermitNo;
      delete formDataStageOne.mobileNumber; // Non-CID specific mobile
    }

    // Fields not part of the MhpcNewApplication model
    const fieldsToRemove = [
      'documents', 'remarks', 'declaration', 'payment_status', 'payment_id',
      'qualification_type', 'qualification_name', 'institute',
      'year_of_completion', 'is_active', 'application', 'cid_holder',
    ];
    if (props.selectedType === 'cid') {
      delete formDataStageOne.mobileNumber; // Remove if CID holder
      delete formDataStageOne.country; // Remove if CID holder (country of residence)
    }
    fieldsToRemove.forEach(field => delete formDataStageOne[field]);

    const today = new Date();
    const expiry = new Date(today);
    expiry.setFullYear(today.getFullYear() + 5);

    formDataStageOne.registration_date = formatDateForAPI(today);
    formDataStageOne.expiry_date = formatDateForAPI(expiry);

    const apiFormData = new FormData();
    for (const key in formDataStageOne) {
      if (Object.prototype.hasOwnProperty.call(formDataStageOne, key) &&
        formDataStageOne[key] !== null && formDataStageOne[key] !== undefined && formDataStageOne[key] !== '') {
        if (key === 'passport_photo' && formDataStageOne[key] instanceof File) {
          apiFormData.append('passport_photo', formDataStageOne[key], formDataStageOne[key].name);
        } else {
          apiFormData.append(key, formDataStageOne[key]);
        }
      }
    }

    apiFormData.append('applicant', user.id);
    apiFormData.append('is_draft', 'False');

    try {
      const response = await apiService.createMhpcNewApplication(apiFormData);
      applicationId.value = response.data.id;
      localFormData.application = response.data.id;
      toast.success('Personal information saved successfully!');
      stage.value = 2;
    } catch (error) {
      console.error('Error submitting personal information:', error.response?.data || error.message);
      const errorMessages = Object.entries(error.response?.data || { 'API Error': [error.message || 'Unknown error'] })
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      toast.error(`Failed to save personal information: ${errorMessages}`);
    } finally {
      isSubmitting.value = false;
    }
  } else {
    toast.error('Please correct the errors in Step 1 before proceeding.');
  }
}

// Opens the confirmation modal after validating Stage 2
const openConfirmationModal = () => {
  updateFormDocuments(); // Ensure localFormData.documents is up-to-date
  if (validateForm()) { // Validates both stages
    isConfirmationModalOpen.value = true;
  } else {
    toast.error('Please correct all errors and upload mandatory documents before submitting.');
  }
}

// Handles the actual final submission (Stage 2 data)
const handleSubmitActual = async () => {
  isConfirmationModalOpen.value = false;
  updateFormDocuments(); // Ensure documents are current and correctly structured in localFormData.documents

  if (!validateForm()) {
    toast.error('Submission cancelled due to validation errors. Please review the form.');
    return;
  }

  if (!localFormData.application) {
    toast.error("Application ID is missing. Cannot submit qualification details. Please go back to Step 1.");
    isSubmitting.value = false;
    return;
  }

  isSubmitting.value = true;
  try {
    const qualificationFormData = new FormData();

    // Append non-file fields for UserQualification model
    qualificationFormData.append('application', localFormData.application);
    qualificationFormData.append('qualification_name', localFormData.qualification_name);
    qualificationFormData.append('qualification_type', localFormData.qualification_type);
    qualificationFormData.append('institute_university', localFormData.institute);

    if (localFormData.year_of_completion && typeof localFormData.year_of_completion === 'string') {
      const year = localFormData.year_of_completion.split('-')[0];
      if (year && !isNaN(parseInt(year))) {
        qualificationFormData.append('completion_year', year);
      }
    }

    qualificationFormData.append('declaration', localFormData.declaration ? 'True' : 'False');
    qualificationFormData.append('remarks', localFormData.remarks || '');
    qualificationFormData.append('is_primary_qualification', 'True');

    // --- Handle Attachments (Supporting Documents) ---
    console.log("Preparing attachments for submission. localFormData.documents:", JSON.stringify(localFormData.documents.map(d => ({ type: d.type, files: d.files.map(f => f.name) }))));

    localFormData.documents.forEach((doc) => { // No docIndex needed for flat arrays if backend handles order
      if (doc.files && doc.files.length > 0 && doc.type) {
        doc.files.forEach((fileObject) => {
          // MODIFIED: Using flat array naming convention
          // The key 'user_qualification_attachment_files' will be sent multiple times, once for each file.
          // The key 'user_qualification_attachment_file_types' will be sent multiple times, once for each corresponding type.
          // The backend must be able to collect these into lists and associate them by order.
          qualificationFormData.append('user_qualification_attachment_files', fileObject, fileObject.name);
          qualificationFormData.append('user_qualification_attachment_file_types', doc.type);

          console.log(`Appending to FormData: user_qualification_attachment_files = ${fileObject.name}, user_qualification_attachment_file_types = ${doc.type}`);
        });
      } else {
        console.warn(`Skipping document entry due to missing file or type. Type: ${doc.type}, Files: ${doc.files?.length}`);
      }
    });

    // Log the entire FormData just before sending for thorough inspection
    console.log("Final Qualification FormData to be sent:");
    for (let pair of qualificationFormData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}, Size: ${pair[1].size}` : pair[1]));
    }

    await apiService.createMhpcNewQualification(qualificationFormData);

    toast.success('Registration submitted successfully!');
    emit('submit', { ...localFormData });
    router.push('/admin/user/health_certification/dashboard');
  } catch (error) {
    console.error('Error submitting qualification and documents:', error.response?.data || error.message);
    const errorMessages = Object.entries(error.response?.data || { 'API Error': [error.message || 'Unknown error'] })
      .map(([key, value]) => {
        // Attempt to flatten nested errors, especially for attachments
        if (typeof value === 'object' && value !== null) {
          return Object.entries(value).map(([nestedKey, nestedValue]) =>
            `${key}.${nestedKey}: ${Array.isArray(nestedValue) ? nestedValue.join(', ') : nestedValue}`
          ).join('; ');
        }
        return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
      })
      .join('; ');
    toast.error(`Submission failed: ${errorMessages}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
  /* Tailwind's red-500 */
}

/* Make readonly fields visually distinct */
.bg-gray-100[readonly] {
  background-color: #f3f4f6;
  /* Tailwind's gray-100 */
  cursor: not-allowed;
}


@media (max-width: 640px) {
  .text-sm {
    font-size: 0.8125rem;
    /* Slightly smaller than Tailwind's sm */
  }

  .text-xs {
    font-size: 0.75rem;
    /* Tailwind's xs */
  }
}
</style>
