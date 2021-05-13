<template>
  <div class="mx-auto py-8">
    <!-- Confirmation Modal -->
    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog
        as="div"
        class="relative z-10 fixed inset-0 z-10 w-screen"
        @close="isConfirmationModalOpen = false"
      >
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

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                    :disabled="isSubmitting"
                  >
                    {{ isSubmitting ? 'Submitting...' : 'Confirm' }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="isConfirmationModalOpen = false"
                    :disabled="isSubmitting"
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

    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        {{ selectedType === 'cid' ? 'CID Holder Registration' : 'Non-CID Holder Registration' }}
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (<span class="text-red-600"
          >*</span
        >). Ensure all information provided is accurate and up-to-date.
      </p>
    </div>

    <form
      @submit.prevent="handleNext"
      class="bg-white border rounded-xl shadow-sm p-6"
      v-if="stage === 1"
    >
      <h3 class="text-lg font-semibold text-gray-900 my-4">Step 1: Personal Information</h3>
      <!-- Form Sections -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Details</h3>
        <p class="mt-1 text-sm text-gray-500">Basic details needed for registration</p>
      </div>

      <div class="p-6">
        <!-- Personal Information Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <!-- Dynamic Fields based on type -->
          <template v-if="selectedType === 'cid'">
            <!-- CID Fields -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">CID No.</label>
              <input
                v-model="localFormData.cid_no"
                type="number"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="Enter 11-digit CID number"
                @input="fetchDCRCData"
                :disabled="isLoadingDCRC"
              />
              <!-- Simple loading indicator -->
              <span v-if="isLoadingDCRC" class="text-sm text-blue-500 mt-1"
                >Fetching details...</span
              >
              <span v-if="errors.cid_no" class="text-sm text-red-500 mt-1">{{
                errors.cid_no
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <input
                type="text"
                v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                readonly
              />
              <span v-if="errors.dzongkhag" class="text-sm text-red-500 mt-1">{{
                errors.dzongkhag
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Gewog</label>
              <input
                type="text"
                v-model="localFormData.gewog"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                readonly
              />
              <span v-if="errors.gewog" class="text-sm text-red-500 mt-1">{{ errors.gewog }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input
                type="text"
                v-model="localFormData.village"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                readonly
              />
              <span v-if="errors.village" class="text-sm text-red-500 mt-1">{{
                errors.village
              }}</span>
            </div>
          </template>

          <template v-else>
            <!-- Non-CID Fields -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Identity / Work Permit No</label
              >
              <input
                v-model="localFormData.workPermitNo"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="Identity / Work Permit No"
              />
              <span v-if="errors.workPermitNo" class="text-sm text-red-500 mt-1">{{
                errors.workPermitNo
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
              <select
                v-model="localFormData.nationality"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              >
                <option value="">SELECT NATIONALITY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.nationality" class="text-sm text-red-500 mt-1">{{
                errors.nationality
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Country</label>
              <select
                v-model="localFormData.country"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              >
                <option value="">SELECT COUNTRY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.country" class="text-sm text-red-500 mt-1">{{
                errors.country
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">State</label>
              <input
                v-model="localFormData.state"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="State"
              />
              <span v-if="errors.state" class="text-sm text-red-500 mt-1">{{ errors.state }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input
                v-model="localFormData.city"
                type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="City"
              />
              <span v-if="errors.city" class="text-sm text-red-500 mt-1">{{ errors.city }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
              <input
                v-model="localFormData.mobileNumber"
                type="tel"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="Mobile Number (e.g., 17xxxxxx)"
              />
              <span v-if="errors.mobileNumber" class="text-sm text-red-500 mt-1">{{
                errors.mobileNumber
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
              <input
                v-model="localFormData.email_address"
                type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                placeholder="Email Address"
                readonly
              />
              <span v-if="errors.email_address" class="text-sm text-red-500 mt-1">{{
                errors.email_address
              }}</span>
            </div>
          </template>

          <!-- Common Fields -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input
              v-model="localFormData.full_name"
              type="text"
              :class="[
                'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm',
                selectedType === 'cid' ? 'bg-gray-100' : '',
              ]"
              placeholder="Enter full name"
              :readonly="selectedType === 'cid'"
            />
            <span v-if="errors.full_name" class="text-sm text-red-500 mt-1">{{
              errors.full_name
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select
              v-model="localFormData.gender"
              :class="[
                'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm',
                selectedType === 'cid' ? 'bg-gray-100' : '',
              ]"
              :disabled="selectedType === 'cid'"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <span v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input
              type="date"
              v-model="localFormData.date_of_birth"
              :class="[
                'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm',
                selectedType === 'cid' ? 'bg-gray-100' : '',
              ]"
              :readonly="selectedType === 'cid'"
            />
            <span v-if="errors.date_of_birth" class="text-sm text-red-500 mt-1">{{
              errors.date_of_birth
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input
              v-model="localFormData.contact_no"
              type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              placeholder="Enter phone number (e.g. 17xxxxxx)"
            />
            <span v-if="errors.contact_no" class="text-sm text-red-500 mt-1">{{
              errors.contact_no
            }}</span>
          </div>

          <!-- Registration Type Field -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required"
              >Registration Type</label
            >
            <select
              v-model="localFormData.registration_type"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
            >
              <option value="">Select Registration Type</option>
              <option v-for="regType in registrationTypes" :key="regType.id" :value="regType.id">
                {{ regType.name }}
              </option>
            </select>
            <span v-if="errors.registration_type" class="text-sm text-red-500 mt-1">{{
              errors.registration_type
            }}</span>
          </div>
        </div>

        <!-- Passport Photo Section -->
        <div class="mt-12">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Passport Photo</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Upload Passport Photo (Max 2MB, JPG/PNG)</label
                >
                <input
                  type="file"
                  @change="handlePassportPhotoSelect"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".jpg,.jpeg,.png"
                />
                <span v-if="errors.passport_photo" class="text-sm text-red-500 mt-1">{{
                  errors.passport_photo
                }}</span>
                <!-- Display selected file name -->
                <p v-if="localFormData.passport_photo" class="text-sm text-gray-600 mt-1">
                  Selected: {{ localFormData.passport_photo.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="mt-12 flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('back')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            :disabled="isLoadingDCRC || isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Next' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Stage 2 Form -->
    <form
      @submit.prevent="openConfirmationModal"
      class="bg-white border rounded-xl shadow-sm p-6"
      v-else-if="stage === 2"
    >
      <h3 class="text-lg font-semibold text-gray-900 my-4">
        Step 2: Engineering Qualification & Documents
      </h3>
      <!-- Qualification Details Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Qualification Type</label
              >
              <select
                v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              >
                <option value="">Select Qualification Type</option>
                <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                  {{ type.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-sm text-red-500 mt-1">{{
                errors.qualification_type
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Qualification Name</label
              >
              <select
                v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              >
                <option value="">Select Qualification Name</option>
                <option
                  v-for="qualification in qualifications"
                  :key="qualification.id"
                  :value="qualification.id"
                >
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Institute/University</label
              >
              <select
                v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              >
                <option value="">Select Institute/University</option>
                <option
                  v-for="university in universities"
                  :key="university.id"
                  :value="university.id"
                >
                  {{ university.institute_name }} ({{ university.university }},
                  {{ university.country }})
                </option>
              </select>
              <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Year of Completion</label
              >
              <input
                type="month"
                v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="YYYY-MM"
              />
              <span class="text-xs text-gray-500">Select month and year</span>
              <span v-if="errors.year_of_completion" class="text-sm text-red-500 mt-1">{{
                errors.year_of_completion
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Supporting Documents (Max 2MB each)
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            Attach required documents: Graduation Certificate, CID/Work Permit, Security Clearance
            (if applicable), ROQ Certificate (if applicable), Class 10 Marksheet, Class 12
            Marksheet, Graduation Marksheet.
          </p>
          <div class="space-y-4">
            <div
              v-for="(doc, index) in supportingDocuments"
              :key="index"
              class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg border border-gray-100"
            >
              <div class="w-full sm:w-1/3">
                <label class="block text-xs font-medium text-gray-600 mb-1"
                  >Document Type<span class="text-red-500">*</span></label
                >
                <select
                  v-model="doc.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                  required
                >
                  <option value="">Select Type</option>
                  <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                    {{ type.document_name }}
                  </option>
                </select>
              </div>
              <div class="flex-1 w-full flex items-center space-x-2">
                <div class="flex-grow">
                  <label class="block text-xs font-medium text-gray-600 mb-1"
                    >Upload File<span class="text-red-500">*</span></label
                  >
                  <input
                    type="file"
                    @change="(e) => handleFileSelect(e, index)"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                  <!-- Display selected file names -->
                  <div v-if="doc.files && doc.files.length > 0" class="text-xs text-gray-600 mt-1">
                    Selected: {{ doc.files.map((f) => f.name).join(', ') }}
                  </div>
                </div>
                <button
                  v-if="supportingDocuments.length > 1"
                  @click="removeDocument(index)"
                  type="button"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors self-end mb-1"
                >
                  <span class="sr-only">Remove</span>
                  ✕
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="addDocument"
              class="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center text-sm"
            >
              <span class="mr-2 text-lg">+</span>
              Add Another Document
            </button>
            <span v-if="errors.documents" class="block text-sm text-red-500 mt-1">{{
              errors.documents
            }}</span>
          </div>
        </div>
      </div>

      <!-- Declaration Section -->
      <div class="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              v-model="localFormData.remarks"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              placeholder="Enter any additional remarks or comments (optional)"
            ></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-100">
            <input
              id="declaration-checkbox"
              type="checkbox"
              v-model="localFormData.declaration"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label for="declaration-checkbox" class="text-sm text-gray-700">
              <span class="font-medium">
                I hereby declare that all the information provided above is true and correct to the
                best of my knowledge. I understand that any false statements may result in the
                rejection of my registration.</span
              >
              <span class="text-red-500">*</span>
            </label>
          </div>
          <span v-if="errors.declaration" class="text-sm text-red-500 mt-1">{{
            errors.declaration
          }}</span>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="mt-12 flex justify-end space-x-4">
        <button
          type="button"
          @click="stage = 1"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting"
        >
          Back
        </button>
        <button
          type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          :disabled="!localFormData.declaration || isSubmitting"
        >
          Submit Registration
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

const authStore = useAuthStore()
const userId = authStore.userId
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
const registrationTypes = ref([])
const fetchedDocumentTypes = ref([])
const qualificationTypes = ref([])
const qualifications = ref([])
const universities = ref([])

const supportingDocuments = ref([{ type: '', files: [], description: '' }]) // Start with one document row

const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [], description: '' })
}

const removeDocument = (index) => {
  if (supportingDocuments.value.length > 1) {
    // Prevent removing the last one
    supportingDocuments.value.splice(index, 1)
    updateFormDocuments() // Update main form data when removing
  } else {
    toast.warning('At least one document entry is required.')
  }
}

const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)
  // Reset error
  delete errors.documents

  if (files.length === 0) {
    supportingDocuments.value[index].files = []
    updateFormDocuments()
    return // No file selected
  }

  const file = files[0] // Assuming single file upload per row for simplicity now

  if (file.size > 2 * 1024 * 1024) {
    errors.documents = `File "${file.name}" exceeds the 2MB size limit.`
    event.target.value = '' // Clear the input
    supportingDocuments.value[index].files = [] // Clear files in state
    toast.error(errors.documents)
    updateFormDocuments()
    return
  }
  supportingDocuments.value[index].files = [file] // Store as an array even if single
  updateFormDocuments()
}

const updateFormDocuments = () => {
  // Filter out rows that might have a type selected but no file, or vice versa if needed
  // For now, just map valid entries (where a file exists)
  const documents = supportingDocuments.value.reduce((acc, doc) => {
    if (doc.files && doc.files.length > 0 && doc.type) {
      // Ensure both type and file exist
      acc.push({
        type: doc.type,
        files: doc.files, // This is an array of files (currently just one per row)
        description: doc.description || '', // Add description if needed later
      })
    }
    return acc
  }, [])
  localFormData.documents = documents
  console.log('Updated localFormData.documents:', localFormData.documents)
}

// List of countries (full list)
const countries = ref([
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
])

onMounted(async () => {
  try {
    // Parallel fetching
    const [regTypesResponse, qualTypesResponse, qualsResponse, unisResponse, docTypesResponse] =
      await Promise.all([
        apiService.getEpcMastersRegistrationTypes(),
        apiService.getEpcMastersQualificationTypes(),
        apiService.getEpcMastersQualifications(),
        apiService.getEpcMastersUniversities(),
        apiService.getEpcMastersDocumentTypes(),
      ])

    registrationTypes.value = regTypesResponse.data.results || []
    qualificationTypes.value = qualTypesResponse.data.results || []
    qualifications.value = qualsResponse.data.results || []
    universities.value = unisResponse.data.results || []
    fetchedDocumentTypes.value = docTypesResponse.data.results || []

    console.log('Master data fetched successfully')
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error('Failed to fetch essential master data. Please refresh or contact support.')
  }
  // Pre-fill email from auth store
  if (user && user.email) {
    localFormData.email_address = user.email
  }
  // Set default nationality for CID holders
  if (props.selectedType === 'cid') {
    localFormData.nationality = 'Bhutanese'
  }
})

const localFormData = reactive({
  cid_holder: props.selectedType === 'cid',
  nationality: '', // Will be set in onMounted
  email_address: '', // Will be set in onMounted
  workPermitNo: '',
  mobileNumber: '', // Non-CID mobile
  full_name: '',
  gender: '',
  date_of_birth: '',
  city: '', // Non-CID address
  state: '', // Non-CID address
  country: '', // Non-CID address
  cid_no: '',
  dzongkhag: '',
  gewog: '',
  village: '',
  contact_no: '', // General contact (can be same as mobile for non-cid)
  passport_photo: null,
  documents: [], // Will hold { type: id, files: [File], description: '' }
  remarks: '',
  declaration: false,
  // payment_status: 'Pending', // Status likely set by backend
  // payment_id: null, // Set by backend/payment gateway
  registration_date: null, // Set before API call
  expiry_date: null, // Set before API call
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: null, // Store as YYYY-MM string from input type=month
  // is_active: false, // Set by backend
  application: null, // Will hold the ID from stage 1 submission
  registration_type: '',
  ...props.modelValue, // Spread props last to allow overriding defaults if needed
})

const errors = reactive({})
const isConfirmationModalOpen = ref(false)
const isSubmitting = ref(false)
const toast = useToast()
const isLoadingDCRC = ref(false)

// Computed property for CID validation (basic length check)
const isCIDValid = computed(() => {
  return /^\d{11}$/.test(localFormData.cid_no)
})

// Watch for changes in localFormData to emit update
watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData })
  },
  { deep: true },
)

// --- Validation Functions ---

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
}

const validateFormStageOne = () => {
  clearErrors()
  let isValid = true

  // Common fields
  if (!localFormData.full_name) {
    errors.full_name = 'Full name is required'
    isValid = false
  }
  if (!localFormData.gender) {
    errors.gender = 'Gender is required'
    isValid = false
  }
  if (!localFormData.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required'
    isValid = false
  }
  if (!localFormData.contact_no) {
    errors.contact_no = 'Contact number is required'
    isValid = false
  } else if (!/^[17]\d{7}$/.test(localFormData.contact_no)) {
    errors.contact_no = 'Contact number must be 8 digits starting with 1 or 7.'
    isValid = false
  }
  if (!localFormData.passport_photo) {
    errors.passport_photo = 'Passport photo is required'
    isValid = false
  }
  if (!localFormData.registration_type) {
    errors.registration_type = 'Registration type is required'
    isValid = false
  }

  // Type-specific fields
  if (props.selectedType === 'cid') {
    if (!localFormData.cid_no) {
      errors.cid_no = 'CID is required'
      isValid = false
    } else if (!isCIDValid.value) {
      errors.cid_no = 'CID must be exactly 11 digits.'
      isValid = false
    }
    // DCRC fetched fields validation (should be auto-filled)
    if (!localFormData.dzongkhag) {
      errors.dzongkhag = 'Dzongkhag is required (fetch from DCRC)'
      isValid = false
    }
    if (!localFormData.gewog) {
      errors.gewog = 'Gewog is required (fetch from DCRC)'
      isValid = false
    }
    if (!localFormData.village) {
      errors.village = 'Village is required (fetch from DCRC)'
      isValid = false
    }
  } else {
    // Non-CID
    if (!localFormData.workPermitNo) {
      errors.workPermitNo = 'Identity / Work Permit No is required'
      isValid = false
    }
    if (!localFormData.nationality) {
      errors.nationality = 'Nationality is required'
      isValid = false
    }
    if (!localFormData.country) {
      errors.country = 'Country is required'
      isValid = false
    }
    // Email is read-only from store, less critical to validate here but could check format
    if (!localFormData.email_address) {
      errors.email_address = 'Email address is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email_address)) {
      errors.email_address = 'Invalid email format'
      isValid = false
    }

    if (!localFormData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required'
      isValid = false
    } else if (!/^\d{8,}$/.test(localFormData.mobileNumber)) {
      // Allow more than 8 for international? Adjust as needed.
      errors.mobileNumber = 'Invalid mobile number format (at least 8 digits expected).'
      isValid = false
    }
    // Optional fields: city, state - no validation for now
  }

  return isValid
}

const validateFormStageTwo = () => {
  // Assumes stage 1 is already valid
  clearErrors() // Clear previous errors specific to stage 2
  let isValid = true

  // Qualification details
  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required'
    isValid = false
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required'
    isValid = false
  }
  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required'
    isValid = false
  }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required'
    isValid = false
  } else {
    // Optional: Check if the date is not in the future
    const today = new Date()
    // Ensure correct date parsing: YYYY-MM needs a day part
    const completionDateParts = localFormData.year_of_completion.split('-')
    const completionDate = new Date(
      parseInt(completionDateParts[0], 10),
      parseInt(completionDateParts[1], 10) - 1,
      1,
    ) // Year, Month (0-indexed), Day

    // Get today's date at the beginning of the day for fair comparison
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    // Check if completion month is after the current month
    if (completionDate > startOfToday) {
      errors.year_of_completion = 'Completion date cannot be in the future.'
      isValid = false
    }
  }

  // Documents Validation
  if (
    localFormData.documents.length === 0 &&
    supportingDocuments.value.length > 0 &&
    supportingDocuments.value.some((d) => d.type || (d.files && d.files.length > 0))
  ) {
    // This case means rows exist with partial data but no valid file/type combos were added
    errors.documents = 'Please select a document type and upload a file for each document entry.'
    isValid = false
  } else if (
    supportingDocuments.value.some((doc) => doc.type && (!doc.files || doc.files.length === 0))
  ) {
    errors.documents = 'Please upload a file for the selected document type(s).'
    isValid = false
  } else if (
    supportingDocuments.value.some((doc) => !doc.type && doc.files && doc.files.length > 0)
  ) {
    errors.documents = 'Please select a document type for the uploaded file(s).'
    isValid = false
  }
  // Check if essential document types are present (example using names - adapt if using IDs)
  /* // This check can be complex and depends on exact document names/IDs
   const requiredDocTypes = ['Graduation Certificate', 'CID', 'Work Permit', 'Class 10 Marksheet', 'Class 12 Marksheet', 'Graduation Marksheet']; // Example names
   const uploadedDocTypeIds = localFormData.documents.map(doc => doc.type);
   const uploadedDocTypeNames = fetchedDocumentTypes.value
          .filter(dt => uploadedDocTypeIds.includes(dt.id))
          .map(dt => dt.document_name);

   const missingDocs = requiredDocTypes.filter(reqDocName =>
      !uploadedDocTypeNames.some(upName => upName.toLowerCase().includes(reqDocName.toLowerCase()))
   );

   if (missingDocs.length > 0) {
       // Be careful with CID/Work Permit logic - only one might be needed depending on selectedType
       // errors.documents = `Missing required documents: ${missingDocs.join(', ')}`;
       // isValid = false; // Decide if this should block submission or just warn
       console.warn("Missing required documents:", missingDocs);
   }
   */

  // Simplified check: Ensure at least one *valid* document combo is uploaded if rows exist
  if (supportingDocuments.value.length > 0 && localFormData.documents.length === 0) {
    // Check if the first row has any data entered, if so, it's an incomplete entry
    const firstDoc = supportingDocuments.value[0]
    if (firstDoc.type || (firstDoc.files && firstDoc.files.length > 0)) {
      errors.documents = 'Please complete document uploads (select type and file).'
      isValid = false
    }
  }

  // Declaration
  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration.'
    isValid = false
  }

  return isValid
}

// --- API Interaction ---

const formatDateForInput = (dateString) => {
  // Expects DD/MM/YYYY from API
  if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return ''
  const [day, month, year] = dateString.split('/')
  return `${year}-${month}-${day}` // Format for <input type="date">
}

// --- *** Helper Function: Format Date for API *** ---
const formatDateForAPI = (date) => {
  // Input: Date object
  if (!date || !(date instanceof Date)) return null // Check if it's a valid Date object
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // YYYY-MM-DD format for API
}
// --- *** End Helper Function *** ---

const fetchDCRCData = async () => {
  if (props.selectedType !== 'cid' || !isCIDValid.value) {
    // Clear DCRC fields if CID becomes invalid or changes significantly
    localFormData.full_name = ''
    localFormData.date_of_birth = ''
    localFormData.gender = ''
    localFormData.dzongkhag = ''
    localFormData.gewog = ''
    localFormData.village = ''
    // Don't clear contact_no automatically, user might have entered it manually
    return
  }

  if (!userId) {
    toast.error('User session error. Please log in again.')
    return
  }

  clearErrors() // Clear previous errors
  isLoadingDCRC.value = true
  try {
    // Include user_id as query parameter as expected by the backend
    const response = await apiService.fetchCitizenDetails(localFormData.cid_no, {
      params: { user_id: userId },
    })

    if (response.data && response.data.applicants_name) {
      // Check if data is valid
      const genderMap = { F: 'female', M: 'male', O: 'other' }

      localFormData.full_name = response.data.applicants_name
      localFormData.date_of_birth = formatDateForInput(response.data.date_of_birth)
      localFormData.gender = genderMap[response.data.gender] || ''
      localFormData.dzongkhag = response.data.dzongkhag
      localFormData.gewog = response.data.gewog
      localFormData.village = response.data.village
      // Update contact number only if it's currently empty and DCRC provides one
      if (!localFormData.contact_no && response.data.mobile_number) {
        localFormData.contact_no = response.data.mobile_number
      }
      toast.success('Citizen details fetched successfully')
    } else {
      // Handle cases where API returns 200 OK but no valid data (e.g., CID not found but not a 404)
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          'Citizen not found or invalid data received.',
      )
    }
  } catch (error) {
    console.error('Error fetching DCRC data:', error)
    let errorMessage = 'Failed to fetch DCRC data. Please enter details manually.'
    if (error.response && error.response.data) {
      // Try to extract specific error message from backend response
      errorMessage =
        error.response.data.error ||
        error.response.data.detail ||
        error.response.data.message ||
        errorMessage
    } else if (error.message) {
      errorMessage = error.message // Use error message if available (e.g., from new Error thrown above)
    }
    toast.error(errorMessage)

    // Clear fields on error to force manual entry
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
  // Reset error
  delete errors.passport_photo

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      localFormData.passport_photo = null
      errors.passport_photo = 'File size exceeds 2MB limit.'
      toast.error(errors.passport_photo)
      event.target.value = '' // Clear the input
    } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
      localFormData.passport_photo = null
      errors.passport_photo = 'Invalid file type. Please upload JPG or PNG.'
      toast.error(errors.passport_photo)
      event.target.value = '' // Clear the input
    } else {
      localFormData.passport_photo = file
    }
  } else {
    localFormData.passport_photo = null // No file selected
  }
}

// --- Form Submission Logic ---

const handleNext = async () => {
  // Stage 1 Submission
  if (!validateFormStageOne()) {
    toast.error('Please fix the errors in the form.')
    return
  }

  isSubmitting.value = true // Indicate processing starts
  const apiFormData = new FormData()

  // Set dates before creating FormData
  const today = new Date()
  const expiry = new Date(today)
  expiry.setFullYear(today.getFullYear() + 5) // Example: 5 year expiry
  localFormData.registration_date = formatDateForAPI(today) // Use the helper function
  localFormData.expiry_date = formatDateForAPI(expiry) // Use the helper function

  // Map localFormData to API expected fields for Stage 1
  apiFormData.append('cid_holder', localFormData.cid_holder ? 'true' : 'false')
  apiFormData.append('nationality', localFormData.nationality)
  apiFormData.append('email_address', localFormData.email_address)
  apiFormData.append('full_name', localFormData.full_name)
  apiFormData.append('gender', localFormData.gender)
  apiFormData.append('date_of_birth', localFormData.date_of_birth) // Should be YYYY-MM-DD
  apiFormData.append('contact_no', localFormData.contact_no)
  apiFormData.append('registration_type', Number(localFormData.registration_type))

  // Append dates if required by the application creation endpoint
  if (localFormData.registration_date)
    apiFormData.append('registration_date', localFormData.registration_date)
  if (localFormData.expiry_date) apiFormData.append('expiry_date', localFormData.expiry_date)

  // Add CID or Non-CID specific fields
  if (localFormData.cid_holder) {
    apiFormData.append('cid_no', localFormData.cid_no)
    apiFormData.append('dzongkhag', localFormData.dzongkhag)
    apiFormData.append('gewog', localFormData.gewog)
    apiFormData.append('village', localFormData.village)
  } else {
    // Use workPermitNo as cid_no for Non-CID as discussed (confirm API expectation)
    apiFormData.append('cid_no', localFormData.workPermitNo) // Or a different field if API expects 'workPermitNo' directly
    apiFormData.append('dzongkhag', localFormData.country) // Map country to dzongkhag
    apiFormData.append('gewog', localFormData.state) // Map state to gewog
    apiFormData.append('village', localFormData.city) // Map city to village
    apiFormData.append('mobile_number_non_bhutanese', localFormData.mobileNumber) // Add specific field if backend has it
  }

  // Add passport photo file
  if (localFormData.passport_photo instanceof File) {
    apiFormData.append('passport_photo', localFormData.passport_photo)
  }

  // Log FormData contents before sending (for debugging)
  console.log('Submitting Stage 1 Data:')
  for (let pair of apiFormData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
  }

  try {
    const response = await apiService.createEpcNewApplication(apiFormData)
    applicationId.value = response.data.id // Store the created application ID
    localFormData.application = applicationId.value // Link for stage 2

    toast.success('Step 1: Personal information saved successfully!')
    stage.value = 2 // Move to the next stage
  } catch (error) {
    console.error('Error submitting personal information (Stage 1):', error)
    let errorMessage = 'Failed to save personal information.'
    if (error.response && error.response.data) {
      // Flatten potential nested errors
      const errors = error.response.data
      if (typeof errors === 'object') {
        errorMessage = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')
      } else if (typeof errors === 'string') {
        errorMessage = errors
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    toast.error(`Error: ${errorMessage}`)
  } finally {
    isSubmitting.value = false // Indicate processing ends
  }
}

const openConfirmationModal = () => {
  // Run Stage 2 validation before showing modal
  if (validateFormStageTwo()) {
    isConfirmationModalOpen.value = true
  } else {
    toast.error('Please fix the errors in Step 2 before submitting.')
  }
}

const handleSubmitActual = async () => {
  // Stage 2 Submission (Qualification & Docs)
  isConfirmationModalOpen.value = false // Close modal immediately
  if (!validateFormStageTwo()) {
    // Double check validation
    toast.error('Validation failed. Cannot submit.')
    return
  }

  isSubmitting.value = true
  const apiFormData = new FormData()

  // Add Qualification details
  apiFormData.append('qualification_type', Number(localFormData.qualification_type))
  apiFormData.append('qualification_name', Number(localFormData.qualification_name))
  apiFormData.append('institute_university', Number(localFormData.institute))
  // Format YYYY-MM to just YYYY for completion_year if API expects integer year
  const completionYear = localFormData.year_of_completion
    ? new Date(localFormData.year_of_completion + '-01').getFullYear() // Extract year
    : null
  if (completionYear) {
    apiFormData.append('completion_year', completionYear)
  }
  apiFormData.append('is_primary_qualification', 'True') // Assuming this is the primary

  // Add link to the application created in Stage 1
  apiFormData.append('application', localFormData.application)

  // Add other required fields for the qualification endpoint (confirm with backend)
  apiFormData.append('remarks', localFormData.remarks || '')
  apiFormData.append('declaration', localFormData.declaration ? 'True' : 'False') // Send as string 'True'/'False'

  // Add dates again *if* the qualification endpoint requires them (seems redundant, but keeping as per user request)
  // Re-calculate them just in case (though they should be in localFormData from stage 1)
  // const today = new Date();
  // const expiry = new Date(today);
  // expiry.setFullYear(today.getFullYear() + 5);
  // const regDateAPI = formatDateForAPI(today); // Use the helper function
  // const expDateAPI = formatDateForAPI(expiry); // Use the helper function
  // if (regDateAPI) apiFormData.append('registration_date', regDateAPI);
  // if (expDateAPI) apiFormData.append('expiry_date', expDateAPI);
  // Consider removing the date additions above if the backend correctly links qualification via 'application' ID

  // Add other fields potentially expected by the qualification endpoint
  // apiFormData.append('payment_status', 'pending'); // Status likely set by backend
  // apiFormData.append('payment_id', ''); // Usually set after payment
  // apiFormData.append('is_active', 'False'); // Backend likely controls activation

  // Append attachments (documents) using the expected format `attachments-{index}-key`
  localFormData.documents.forEach((doc, index) => {
    if (doc.files && doc.files.length > 0 && doc.type) {
      doc.files.forEach((file) => {
        // Although we handle one file per row currently, loop in case it changes
        apiFormData.append(`attachments-${index}-file`, file)
        apiFormData.append(`attachments-${index}-file_type`, Number(doc.type)) // Ensure type is number
        // Add description if the API expects it per file
        // apiFormData.append(`attachments-${index}-description`, doc.description || '');
      })
    }
  })

  // Log FormData contents before sending (for debugging)
  console.log('Submitting Stage 2 Data (Qualification & Docs):')
  for (let pair of apiFormData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
  }

  try {
    // Call the API endpoint for creating qualification/submitting documents
    await apiService.createEpcNewQualification(apiFormData)

    toast.success('Application submitted successfully!')
    // Redirect to dashboard or a success page
    router.push({ name: 'EngCertUserDashboard' }) // Use named route
  } catch (error) {
    console.error('Error submitting application (Stage 2):', error)
    let errorMessage = 'Application submission failed.'
    if (error.response && error.response.data) {
      const errors = error.response.data
      if (typeof errors === 'object') {
        // Try to extract specific field errors or fallback to general message
        let fieldErrors = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')
        errorMessage = fieldErrors || errors.detail || errors.message || JSON.stringify(errors)
      } else if (typeof errors === 'string') {
        errorMessage = errors
      }
      // Specific check for attachment errors if backend provides detailed info
      if (errorMessage.toLowerCase().includes('attachment')) {
        errorMessage =
          'Error processing attachments. Please check file types/sizes and try again. Details: ' +
          errorMessage
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    toast.error(`Error: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444; /* Tailwind red-500 */
}

/* Keep scrollbar styling if desired for specific elements, but not globally */
@supports (-webkit-appearance: none) {
  /* Apply to specific scrollable containers if needed, e.g., modal content */
  /* Example: .modal-scroll-content::-webkit-scrollbar { ... } */
  /* General scrollbar styling for elements using overflow-y-auto might still be useful */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px !important; /* Use !important sparingly */
    background: transparent !important;
  }
}

/* This might be needed for modal overlay scrolling issues, especially on iOS */
/* Targets the Headless UI Dialog container when it's fixed */
.fixed.inset-0.z-10.w-screen.overflow-y-auto {
  /* overflow: hidden !important; */ /* Avoid hiding overflow on the main scroll container */
  -webkit-overflow-scrolling: touch;
}

/* Style adjustments for readonly/disabled inputs */
input[readonly],
select[disabled] {
  background-color: #f3f4f6; /* Tailwind gray-100 */
  cursor: not-allowed;
  opacity: 0.7;
}
/* Hide number input spinners */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
