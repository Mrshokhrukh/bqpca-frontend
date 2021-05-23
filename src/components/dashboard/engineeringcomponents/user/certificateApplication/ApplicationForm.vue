<template>
  <div class="mx-auto py-8">
    <!-- Existing Loading Overlay (unchanged) -->
    <div v-if="isLoadingExistingApplication"
      class="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Checking for existing application...</p>
      </div>
    </div>

    <!-- NEW: Redirect Overlay -->
    <div v-if="isRedirecting" class="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-pulse">
          <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Application Complete!</h3>
        <p class="text-gray-600 mb-4">Your application has already been submitted.</p>
        <p class="text-sm text-gray-500">Redirecting to your applications...</p>
      </div>
    </div>

    <!-- Confirmation Modal (unchanged) -->
    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-10 fixed inset-0 z-10 w-screen" @close="isConfirmationModalOpen = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                    @click="handleSubmitActual" :disabled="isSubmitting">
                    {{ isSubmitting ? (existingQualification ? 'Updating...' : 'Submitting...') : (existingQualification
                      ? 'Update Application' : 'Submit Application') }}
                  </button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="isConfirmationModalOpen = false" :disabled="isSubmitting">
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

      <!-- Progress indicator -->
      <div class="mb-4">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              stage >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600']">
              <svg v-if="stage > 1" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <span v-else>1</span>
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700">Personal Info</span>
          </div>

          <div :class="['w-8 h-0.5', stage >= 2 ? 'bg-blue-600' : 'bg-gray-300']"></div>

          <div class="flex items-center">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              stage >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600']">
              <svg v-if="stage > 2" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
              <span v-else>2</span>
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700">Qualification</span>
          </div>

          <div :class="['w-8 h-0.5', stage >= 3 ? 'bg-blue-600' : 'bg-gray-300']"></div>

          <div class="flex items-center">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              stage >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600']">
              3
            </div>
            <span class="ml-2 text-sm font-medium text-gray-700">Review</span>
          </div>
        </div>
      </div>

      <!-- UPDATED: Resume message with !isRedirecting condition -->
      <div v-if="existingApplication && !isRedirecting" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-blue-800">
              {{ existingQualification ? 'Resuming Your Application' : 'Continuing Your Application' }}
            </p>
            <p class="text-sm text-blue-600">
              {{ existingQualification
                ? 'We found your previous application with qualification details. You can review or make changes.'
                : 'Your personal information has been saved. Please complete the qualification details.'
              }}
            </p>
          </div>
        </div>
      </div>

      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
        information provided is accurate and up-to-date.
      </p>
    </div>

    <!-- UPDATED: Stage 1 Form with !isRedirecting condition -->
    <form @submit.prevent="handleNext" class="bg-white border rounded-xl shadow-sm p-6"
      v-if="stage === 1 && !isRedirecting">
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
              <div class="relative">
                <input v-model="localFormData.cid_no" type="number"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm pr-10"
                  placeholder="Enter 11-digit CID number" @input="fetchDCRCData"
                  :disabled="isLoadingDCRC || isLoadingExistingApplication" />

                <!-- Loading indicator for CID checking -->
                <div v-if="isLoadingExistingApplication" class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              </div>

              <!-- Status messages -->
              <div class="mt-1">
                <span v-if="isLoadingDCRC" class="text-sm text-blue-500">Fetching citizen details...</span>
                <span v-else-if="isLoadingExistingApplication" class="text-sm text-blue-500">Checking for existing
                  application...</span>
                <span v-else-if="existingApplication && isCIDValid" class="text-sm text-green-600">
                  ✓ Found existing application
                </span>
                <span v-else-if="errors.cid_no" class="text-sm text-red-500">{{ errors.cid_no }}</span>
              </div>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <input type="text" v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                readonly />
              <span v-if="errors.dzongkhag" class="text-sm text-red-500 mt-1">{{
                errors.dzongkhag
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Gewog</label>
              <input type="text" v-model="localFormData.gewog"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                readonly />
              <span v-if="errors.gewog" class="text-sm text-red-500 mt-1">{{ errors.gewog }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input type="text" v-model="localFormData.village"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                readonly />
              <span v-if="errors.village" class="text-sm text-red-500 mt-1">{{
                errors.village
              }}</span>
            </div>
          </template>

          <template v-else>
            <!-- Non-CID Fields -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Identity / Work Permit No</label>
              <input v-model="localFormData.workPermitNo" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="Identity / Work Permit No" />
              <span v-if="errors.workPermitNo" class="text-sm text-red-500 mt-1">{{
                errors.workPermitNo
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
              <select v-model="localFormData.nationality"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm">
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
              <select v-model="localFormData.country"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm">
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
              <input v-model="localFormData.state" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="State" />
              <span v-if="errors.state" class="text-sm text-red-500 mt-1">{{ errors.state }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input v-model="localFormData.city" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="City" />
              <span v-if="errors.city" class="text-sm text-red-500 mt-1">{{ errors.city }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
              <input v-model="localFormData.mobileNumber" type="tel"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="Mobile Number (e.g., 17xxxxxx)" />
              <span v-if="errors.mobileNumber" class="text-sm text-red-500 mt-1">{{
                errors.mobileNumber
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
              <input v-model="localFormData.email_address" type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm bg-gray-100"
                placeholder="Email Address" readonly />
              <span v-if="errors.email_address" class="text-sm text-red-500 mt-1">{{
                errors.email_address
              }}</span>
            </div>
          </template>

          <!-- Common Fields -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input v-model="localFormData.full_name" type="text" :class="[
              'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm',
              selectedType === 'cid' ? 'bg-gray-100' : '',
            ]" placeholder="Enter full name" :readonly="selectedType === 'cid'" />
            <span v-if="errors.full_name" class="text-sm text-red-500 mt-1">{{
              errors.full_name
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select v-model="localFormData.gender" :class="[
              'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm',
              selectedType === 'cid' ? 'bg-gray-100' : '',
            ]" :disabled="selectedType === 'cid'">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <span v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input type="date" v-model="localFormData.date_of_birth" :class="[
              'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm',
              selectedType === 'cid' ? 'bg-gray-100' : '',
            ]" :readonly="selectedType === 'cid'" />
            <span v-if="errors.date_of_birth" class="text-sm text-red-500 mt-1">{{
              errors.date_of_birth
            }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input v-model="localFormData.contact_no" type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              placeholder="Enter phone number (e.g. 17xxxxxx)" />
            <span v-if="errors.contact_no" class="text-sm text-red-500 mt-1">{{
              errors.contact_no
            }}</span>
          </div>
        </div>

        <!-- Passport Photo Section -->
        <div class="mt-12">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Passport Photo</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 required">Upload Passport Photo (Max 2MB,
                  JPG/PNG)</label>
                <input type="file" @change="handlePassportPhotoSelect"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".jpg,.jpeg,.png" />
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
          <button type="button" @click="$emit('back')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Back
          </button>
          <button type="submit"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            :disabled="isLoadingDCRC || isSubmitting || isLoadingExistingApplication">
            {{ isSubmitting ? (applicationId ? 'Updating...' : 'Saving...') : (applicationId ? 'Update & Continue' :
              'Next') }}
          </button>
        </div>

        <!-- Add a "Start New Application" button for cases where user wants to start fresh -->
        <div v-if="existingApplication && stage === 1" class="mt-4 text-center">
          <button type="button" @click="startNewApplication"
            class="text-sm text-gray-500 hover:text-gray-700 underline">
            Start a completely new application instead
          </button>
        </div>
      </div>
    </form>

    <!-- UPDATED: Stage 2 Form with !isRedirecting condition -->
    <form @submit.prevent="openConfirmationModal" class="bg-white border rounded-xl shadow-sm p-6"
      v-else-if="stage === 2 && !isRedirecting">
      <h3 class="text-lg font-semibold text-gray-900 my-4">
        Step 2: Engineering Qualification & Documents
      </h3>
      <!-- Qualification Details Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
              <select v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm">
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
              <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
              <select v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                :disabled="!localFormData.qualification_type">
                <option value="">Select Qualification Name</option>
                <option v-for="qualification in filteredQualifications" :key="qualification.id"
                  :value="qualification.id">
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
              <select v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm">
                <option value="">Select Institute/University</option>
                <option v-for="university in universities" :key="university.id" :value="university.id">
                  {{ university.institute_name }} ({{ university.university }},
                  {{ university.country }})
                </option>
              </select>
              <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Year of Completion</label>
              <input type="month" v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                placeholder="YYYY-MM" />
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
            <div v-for="(doc, index) in supportingDocuments" :key="index"
              class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg border border-gray-100">
              <div class="w-full sm:w-1/3">
                <label class="block text-xs font-medium text-gray-600 mb-1">Document Type<span
                    class="text-red-500">*</span></label>
                <select v-model="doc.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                  required>
                  <option value="">Select Type</option>
                  <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                    {{ type.document_name }}
                  </option>
                </select>
              </div>
              <div class="flex-1 w-full flex items-center space-x-2">
                <div class="flex-grow">
                  <label class="block text-xs font-medium text-gray-600 mb-1">Upload File<span
                      class="text-red-500">*</span></label>
                  <input type="file" @change="(e) => handleFileSelect(e, index)"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />
                  <!-- Display selected file names -->
                  <div v-if="doc.files && doc.files.length > 0" class="text-xs text-gray-600 mt-1">
                    Selected: {{doc.files.map((f) => f.name).join(', ')}}
                  </div>
                </div>
                <button v-if="supportingDocuments.length > 1" @click="removeDocument(index)" type="button"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors self-end mb-1">
                  <span class="sr-only">Remove</span>
                  ✕
                </button>
              </div>
            </div>

            <button type="button" @click="addDocument"
              class="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center text-sm">
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
            <textarea v-model="localFormData.remarks" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
              placeholder="Enter any additional remarks or comments (optional)"></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-100">
            <input id="declaration-checkbox" type="checkbox" v-model="localFormData.declaration"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="declaration-checkbox" class="text-sm text-gray-700">
              <span class="font-medium">
                I hereby declare that all the information provided above is true and correct to the
                best of my knowledge. I understand that any false statements may result in the
                rejection of my registration.</span>
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
        <button type="button" @click="stage = 1"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting">
          Back
        </button>
        <button type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          :disabled="!localFormData.declaration || isSubmitting">
          Submit Registration
        </button>
      </div>
    </form>

    <!-- NEW: Fallback content when no form should be shown -->
    <div v-else-if="!isLoadingExistingApplication && !isRedirecting"
      class="bg-white border rounded-xl shadow-sm p-6 text-center">
      <div class="py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Application</h3>
        <p class="text-gray-500">Please wait while we prepare your application form...</p>
      </div>
    </div>
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
const toast = useToast()

// ADD THESE NEW VARIABLES FIRST
const isLoadingExistingApplication = ref(false)
const existingApplication = ref(null)
const existingQualification = ref(null)

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
const errors = reactive({})
const isConfirmationModalOpen = ref(false)
const isSubmitting = ref(false)
const isLoadingDCRC = ref(false)
const isRedirecting = ref(false)
// DECLARE localFormData EARLY - BEFORE any functions that use it
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
  registration_date: null, // Set before API call
  expiry_date: null, // Set before API call
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: null, // Store as YYYY-MM string from input type=month
  application: null, // Will hold the ID from stage 1 submission
  registration_type: '',
  ...props.modelValue, // Spread props last to allow overriding defaults if needed
})

const supportingDocuments = ref([{ type: '', files: [], description: '' }]) // Start with one document row

// Computed properties (these need to come after localFormData)
const isCIDValid = computed(() => {
  return /^\d{11}$/.test(localFormData.cid_no)
})

const filteredQualifications = computed(() => {
  if (!localFormData.qualification_type) {
    return []
  }
  return qualifications.value.filter(
    qual => qual.qualification_type === Number(localFormData.qualification_type)
  )
})

// List of countries
const countries = ref([
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
])

// Helper functions
const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [], description: '' })
}

const removeDocument = (index) => {
  if (supportingDocuments.value.length > 1) {
    supportingDocuments.value.splice(index, 1)
    updateFormDocuments()
  } else {
    toast.warning('At least one document entry is required.')
  }
}

const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)
  delete errors.documents

  if (files.length === 0) {
    supportingDocuments.value[index].files = []
    updateFormDocuments()
    return
  }

  const file = files[0]

  if (file.size > 2 * 1024 * 1024) {
    errors.documents = `File "${file.name}" exceeds the 2MB size limit.`
    event.target.value = ''
    supportingDocuments.value[index].files = []
    toast.error(errors.documents)
    updateFormDocuments()
    return
  }
  supportingDocuments.value[index].files = [file]
  updateFormDocuments()
}

const updateFormDocuments = () => {
  const documents = supportingDocuments.value.reduce((acc, doc) => {
    if (doc.files && doc.files.length > 0 && doc.type) {
      acc.push({
        type: doc.type,
        files: doc.files,
        description: doc.description || '',
      })
    }
    return acc
  }, [])
  localFormData.documents = documents
  console.log('Updated localFormData.documents:', localFormData.documents)
}

// NOW define all the functions that use localFormData
const checkExistingApplication = async () => {
  if (props.selectedType === 'cid' && localFormData.cid_no && isCIDValid.value) {
    isLoadingExistingApplication.value = true
    try {
      const response = await apiService.getEpcApplicationsByCid(localFormData.cid_no)

      if (response.data && response.data.length > 0) {
        const applicationId = response.data[0].id || response.data[0].application_id
        const fullAppResponse = await apiService.getEpcNewApplication(applicationId)
        if (fullAppResponse.data) {
          existingApplication.value = fullAppResponse.data

          try {
            const qualResponse = await apiService.getEpcNewQualifications()
            if (qualResponse.data && qualResponse.data.results) {
              existingQualification.value = qualResponse.data.results.find(
                qual => qual.application === applicationId
              )
            }
          } catch (qualError) {
            console.log('No existing qualification found - this is okay')
          }

          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error checking existing applications:', error)
      return false
    } finally {
      isLoadingExistingApplication.value = false
    }
  } else if (props.selectedType !== 'cid') {
    try {
      isLoadingExistingApplication.value = true
      const allAppsResponse = await apiService.getEpcNewApplications()

      if (allAppsResponse.data && allAppsResponse.data.results) {
        const userApp = allAppsResponse.data.results.find(
          app => app.email_address === (user?.email || localFormData.email_address) && !app.cid_holder
        )

        if (userApp) {
          existingApplication.value = userApp

          try {
            const qualResponse = await apiService.getEpcNewQualifications()
            if (qualResponse.data && qualResponse.data.results) {
              existingQualification.value = qualResponse.data.results.find(
                qual => qual.application === userApp.id
              )
            }
          } catch (qualError) {
            console.log('No existing qualification found - this is okay')
          }

          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error checking existing applications for non-CID:', error)
      return false
    } finally {
      isLoadingExistingApplication.value = false
    }
  }

  return false
}

const populateFormFromExistingData = () => {
  if (!existingApplication.value) return

  const app = existingApplication.value

  localFormData.application = app.id
  applicationId.value = app.id
  localFormData.full_name = app.full_name || ''
  localFormData.email_address = app.email_address || ''
  localFormData.gender = app.gender || ''
  localFormData.date_of_birth = app.date_of_birth || ''
  localFormData.contact_no = app.contact_no || ''
  localFormData.nationality = app.nationality || ''
  localFormData.registration_type = app.registration_type || ''

  if (app.cid_holder) {
    localFormData.cid_no = app.cid_no || ''
    localFormData.dzongkhag = app.dzongkhag || ''
    localFormData.gewog = app.gewog || ''
    localFormData.village = app.village || ''
  } else {
    localFormData.workPermitNo = app.cid_no || ''
    localFormData.country = app.dzongkhag || ''
    localFormData.state = app.gewog || ''
    localFormData.city = app.village || ''
    localFormData.mobileNumber = app.mobile_number_non_bhutanese || ''
  }

  if (existingQualification.value) {
    const qual = existingQualification.value
    localFormData.qualification_type = qual.qualification_type || ''
    localFormData.qualification_name = qual.qualification_name || ''
    localFormData.institute = qual.institute_university || ''

    if (qual.completion_year) {
      localFormData.year_of_completion = `${qual.completion_year}-01`
    }

    localFormData.remarks = qual.remarks || ''
    localFormData.declaration = qual.declaration === 'True' || qual.declaration === true
  }
}

const determineStartingStage = () => {
  if (!existingApplication.value) {
    return 1 // No existing application, start from beginning
  }

  if (existingQualification.value) {
    // Both application and qualification exist
    // Check if it's already submitted or completed - redirect to my_applications
    if (existingQualification.value.is_active === true ||
      existingQualification.value.status === 'submitted' ||
      existingQualification.value.status === 'completed') {
      return 'redirect' // Special value to indicate we should redirect
    } else {
      return 2 // Qualification exists but not completed, continue from step 2
    }
  } else {
    return 2 // Application exists but no qualification, start from step 2
  }
}

// Update the showProgressMessage function to handle redirects
const showProgressMessage = (startingStage) => {
  switch (startingStage) {
    case 1:
      toast.info('Starting new application')
      break
    case 2:
      toast.success('Your personal information has been saved. Continuing with qualification details.')
      break
    case 'redirect':
      toast.success('Your application is already complete. Redirecting to your applications...')
      break
  }
}

// Add a new function to handle the redirect
const redirectToMyApplications = () => {
  setTimeout(() => {
    router.push('/admin/user/engineering_certification/my_applications')
  }, 1500) // Small delay to let user see the message
}

const startNewApplication = () => {
  if (confirm('Are you sure you want to start a new application? This will not affect your existing application, but you will create a separate one.')) {
    existingApplication.value = null
    existingQualification.value = null
    applicationId.value = null
    stage.value = 1

    const initialFormData = {
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
      cid_no: '',
      dzongkhag: '',
      gewog: '',
      village: '',
      contact_no: '',
      passport_photo: null,
      documents: [],
      remarks: '',
      declaration: false,
      registration_date: null,
      expiry_date: null,
      qualification_type: '',
      qualification_name: '',
      institute: '',
      year_of_completion: null,
      application: null,
      registration_type: '',
    }

    Object.assign(localFormData, initialFormData)

    const newRegistration = registrationTypes.value.find(
      type => type.name.toLowerCase() === 'new registration'
    )
    if (newRegistration) {
      localFormData.registration_type = newRegistration.id
    }

    supportingDocuments.value = [{ type: '', files: [], description: '' }]
    clearErrors()
    toast.info('Starting new application')
  }
}

// Validation functions
const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
}

const validateFormStageOne = () => {
  clearErrors()
  let isValid = true

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

  if (props.selectedType === 'cid') {
    if (!localFormData.cid_no) {
      errors.cid_no = 'CID is required'
      isValid = false
    } else if (!isCIDValid.value) {
      errors.cid_no = 'CID must be exactly 11 digits.'
      isValid = false
    }
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
      errors.mobileNumber = 'Invalid mobile number format (at least 8 digits expected).'
      isValid = false
    }
  }

  return isValid
}

const validateFormStageTwo = () => {
  clearErrors()
  let isValid = true

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
    const today = new Date()
    const completionDateParts = localFormData.year_of_completion.split('-')
    const completionDate = new Date(
      parseInt(completionDateParts[0], 10),
      parseInt(completionDateParts[1], 10) - 1,
      1,
    )
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    if (completionDate > startOfToday) {
      errors.year_of_completion = 'Completion date cannot be in the future.'
      isValid = false
    }
  }

  if (
    localFormData.documents.length === 0 &&
    supportingDocuments.value.length > 0 &&
    supportingDocuments.value.some((d) => d.type || (d.files && d.files.length > 0))
  ) {
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

  if (supportingDocuments.value.length > 0 && localFormData.documents.length === 0) {
    const firstDoc = supportingDocuments.value[0]
    if (firstDoc.type || (firstDoc.files && firstDoc.files.length > 0)) {
      errors.documents = 'Please complete document uploads (select type and file).'
      isValid = false
    }
  }

  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration.'
    isValid = false
  }

  return isValid
}

// Helper functions for API
const formatDateForInput = (dateString) => {
  if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return ''
  const [day, month, year] = dateString.split('/')
  return `${year}-${month}-${day}`
}

const formatDateForAPI = (date) => {
  if (!date || !(date instanceof Date)) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fetchDCRCData = async () => {
  if (props.selectedType !== 'cid' || !isCIDValid.value) {
    if (!existingApplication.value) {
      localFormData.full_name = ''
      localFormData.date_of_birth = ''
      localFormData.gender = ''
      localFormData.dzongkhag = ''
      localFormData.gewog = ''
      localFormData.village = ''
    }
    return
  }

  if (!userId) {
    toast.error('User session error. Please log in again.')
    return
  }

  clearErrors()
  isLoadingDCRC.value = true

  try {
    const response = await apiService.fetchCitizenDetails(localFormData.cid_no, {
      params: { user_id: userId },
    })

    if (response.data && response.data.applicants_name) {
      const genderMap = { F: 'female', M: 'male', O: 'other' }

      if (!existingApplication.value) {
        localFormData.full_name = response.data.applicants_name
        localFormData.date_of_birth = formatDateForInput(response.data.date_of_birth)
        localFormData.gender = genderMap[response.data.gender] || ''
        localFormData.dzongkhag = response.data.dzongkhag
        localFormData.gewog = response.data.gewog
        localFormData.village = response.data.village

        if (!localFormData.contact_no && response.data.mobile_number) {
          localFormData.contact_no = response.data.mobile_number
        }
      }

      toast.success('Citizen details fetched successfully')
    } else {
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
      errorMessage =
        error.response.data.error ||
        error.response.data.detail ||
        error.response.data.message ||
        errorMessage
    } else if (error.message) {
      errorMessage = error.message
    }
    toast.error(errorMessage)

    if (!existingApplication.value) {
      localFormData.full_name = ''
      localFormData.date_of_birth = ''
      localFormData.gender = ''
      localFormData.dzongkhag = ''
      localFormData.gewog = ''
      localFormData.village = ''
    }
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
      errors.passport_photo = 'File size exceeds 2MB limit.'
      toast.error(errors.passport_photo)
      event.target.value = ''
    } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
      localFormData.passport_photo = null
      errors.passport_photo = 'Invalid file type. Please upload JPG or PNG.'
      toast.error(errors.passport_photo)
      event.target.value = ''
    } else {
      localFormData.passport_photo = file
    }
  } else {
    localFormData.passport_photo = null
  }
}

const handleNext = async () => {
  if (!validateFormStageOne()) {
    toast.error('Please fix the errors in the form.')
    return
  }

  isSubmitting.value = true

  if (applicationId.value) {
    try {
      const apiFormData = new FormData()

      apiFormData.append('cid_holder', localFormData.cid_holder ? 'true' : 'false')
      apiFormData.append('nationality', localFormData.nationality)
      apiFormData.append('email_address', localFormData.email_address)
      apiFormData.append('full_name', localFormData.full_name)
      apiFormData.append('gender', localFormData.gender)
      apiFormData.append('date_of_birth', localFormData.date_of_birth)
      apiFormData.append('contact_no', localFormData.contact_no)
      apiFormData.append('registration_type', Number(localFormData.registration_type))

      if (localFormData.cid_holder) {
        apiFormData.append('cid_no', localFormData.cid_no)
        apiFormData.append('dzongkhag', localFormData.dzongkhag)
        apiFormData.append('gewog', localFormData.gewog)
        apiFormData.append('village', localFormData.village)
      } else {
        apiFormData.append('cid_no', localFormData.workPermitNo)
        apiFormData.append('dzongkhag', localFormData.country)
        apiFormData.append('gewog', localFormData.state)
        apiFormData.append('village', localFormData.city)
        apiFormData.append('mobile_number_non_bhutanese', localFormData.mobileNumber)
      }

      if (localFormData.passport_photo instanceof File) {
        apiFormData.append('passport_photo', localFormData.passport_photo)
      }

      await apiService.patchEpcNewApplication(applicationId.value, apiFormData)
      toast.success('Personal information updated successfully!')
      stage.value = 2

    } catch (error) {
      console.error('Error updating application:', error)
      let errorMessage = 'Failed to update personal information.'
      if (error.response && error.response.data) {
        const errors = error.response.data
        if (typeof errors === 'object') {
          errorMessage = Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
        }
      }
      toast.error(`Error: ${errorMessage}`)
    } finally {
      isSubmitting.value = false
    }
    return
  }

  // Original create logic if no existing application
  const apiFormData = new FormData()

  const today = new Date()
  const expiry = new Date(today)
  expiry.setFullYear(today.getFullYear() + 5)
  localFormData.registration_date = formatDateForAPI(today)
  localFormData.expiry_date = formatDateForAPI(expiry)

  apiFormData.append('cid_holder', localFormData.cid_holder ? 'true' : 'false')
  apiFormData.append('nationality', localFormData.nationality)
  apiFormData.append('email_address', localFormData.email_address)
  apiFormData.append('full_name', localFormData.full_name)
  apiFormData.append('gender', localFormData.gender)
  apiFormData.append('date_of_birth', localFormData.date_of_birth)
  apiFormData.append('contact_no', localFormData.contact_no)
  apiFormData.append('registration_type', Number(localFormData.registration_type))

  if (localFormData.registration_date)
    apiFormData.append('registration_date', localFormData.registration_date)
  if (localFormData.expiry_date)
    apiFormData.append('expiry_date', localFormData.expiry_date)

  if (localFormData.cid_holder) {
    apiFormData.append('cid_no', localFormData.cid_no)
    apiFormData.append('dzongkhag', localFormData.dzongkhag)
    apiFormData.append('gewog', localFormData.gewog)
    apiFormData.append('village', localFormData.village)
  } else {
    apiFormData.append('cid_no', localFormData.workPermitNo)
    apiFormData.append('dzongkhag', localFormData.country)
    apiFormData.append('gewog', localFormData.state)
    apiFormData.append('village', localFormData.city)
    apiFormData.append('mobile_number_non_bhutanese', localFormData.mobileNumber)
  }

  if (localFormData.passport_photo instanceof File) {
    apiFormData.append('passport_photo', localFormData.passport_photo)
  }

  console.log('Submitting Stage 1 Data:')
  for (let pair of apiFormData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
  }

  try {
    const response = await apiService.createEpcNewApplication(apiFormData)
    applicationId.value = response.data.id
    localFormData.application = applicationId.value

    toast.success('Step 1: Personal information saved successfully!')
    stage.value = 2
  } catch (error) {
    console.error('Error submitting personal information (Stage 1):', error)
    let errorMessage = 'Failed to save personal information.'
    if (error.response && error.response.data) {
      const errors = error.response.data
      if (typeof errors === 'object') {
        errorMessage = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')
      }
    }
    toast.error(`Error: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}

const openConfirmationModal = () => {
  if (validateFormStageTwo()) {
    isConfirmationModalOpen.value = true
  } else {
    toast.error('Please fix the errors in Step 2 before submitting.')
  }
}

const handleSubmitActual = async () => {
  isConfirmationModalOpen.value = false
  if (!validateFormStageTwo()) {
    toast.error('Validation failed. Cannot submit.')
    return
  }

  isSubmitting.value = true
  const apiFormData = new FormData()

  apiFormData.append('qualification_type', Number(localFormData.qualification_type))
  apiFormData.append('qualification_name', Number(localFormData.qualification_name))
  apiFormData.append('institute_university', Number(localFormData.institute))

  const completionYear = localFormData.year_of_completion
    ? new Date(localFormData.year_of_completion + '-01').getFullYear()
    : null
  if (completionYear) {
    apiFormData.append('completion_year', completionYear)
  }
  apiFormData.append('is_primary_qualification', 'True')
  apiFormData.append('application', localFormData.application)
  apiFormData.append('remarks', localFormData.remarks || '')
  apiFormData.append('declaration', localFormData.declaration ? 'True' : 'False')

  localFormData.documents.forEach((doc, index) => {
    if (doc.files && doc.files.length > 0 && doc.type) {
      doc.files.forEach((file) => {
        apiFormData.append(`attachments-${index}-file`, file)
        apiFormData.append(`attachments-${index}-file_type`, Number(doc.type))
      })
    }
  })

  console.log('Submitting Stage 2 Data (Qualification & Docs):')
  for (let pair of apiFormData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
  }

  try {
    if (existingQualification.value && existingQualification.value.id) {
      await apiService.patchEpcNewQualification(existingQualification.value.id, apiFormData)
      toast.success('Application updated successfully!')
    } else {
      await apiService.createEpcNewQualification(apiFormData)
      toast.success('Application submitted successfully!')
    }

    router.push("/admin/user/engineering_certification/dashboard")
  } catch (error) {
    console.error('Error submitting application (Stage 2):', error)
    let errorMessage = 'Application submission failed.'
    if (error.response && error.response.data) {
      const errors = error.response.data
      if (typeof errors === 'object') {
        errorMessage = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')
      }
    }
    toast.error(`Error: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}

// NOW define the watch functions - AFTER localFormData is declared
watch(() => localFormData.cid_no, async (newCid) => {
  if (props.selectedType === 'cid' && newCid && isCIDValid.value) {
    existingApplication.value = null
    existingQualification.value = null

    const hasExisting = await checkExistingApplication()

    if (hasExisting) {
      populateFormFromExistingData()
      const startingStage = determineStartingStage()

      if (startingStage === 'redirect') {
        showProgressMessage(startingStage)
        redirectToMyApplications()
        return
      }

      // Only change stage if we're currently on stage 1 and not redirecting
      if (stage.value === 1) {
        stage.value = startingStage
        showProgressMessage(startingStage)
      }
    }
  }
})

watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData })
  },
  { deep: true },
)

watch(() => localFormData.qualification_type, (newType) => {
  if (newType) {
    const currentQualStillValid = filteredQualifications.value.some(
      qual => qual.id === localFormData.qualification_name
    )

    if (!currentQualStillValid) {
      localFormData.qualification_name = ''
    }
  } else {
    localFormData.qualification_name = ''
  }
})

// Finally, the onMounted function
onMounted(async () => {
  try {
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

    const newRegistration = registrationTypes.value.find(
      type => type.name.toLowerCase() === 'new registration'
    )

    if (newRegistration) {
      localFormData.registration_type = newRegistration.id
      console.log('Auto-selected registration type:', newRegistration.name, newRegistration.id)
    }

    if (user && user.email) {
      localFormData.email_address = user.email
    }

    if (props.selectedType === 'cid') {
      localFormData.nationality = 'Bhutanese'
    }

    // For non-CID users, check for existing applications immediately
    if (props.selectedType !== 'cid') {
      const hasExistingApp = await checkExistingApplication()
      if (hasExistingApp) {
        populateFormFromExistingData()
        const startingStage = determineStartingStage()

        if (startingStage === 'redirect') {
          showProgressMessage(startingStage)
          redirectToMyApplications()
          return
        }

        stage.value = startingStage
        showProgressMessage(startingStage)
      }
    }

  } catch (error) {
    console.error('Error during initialization:', error)
    toast.error('Failed to fetch essential data. Please refresh or contact support.')
  }
})
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
  /* Tailwind red-500 */
}

/* Keep scrollbar styling if desired for specific elements, but not globally */
@supports (-webkit-appearance: none) {

  /* Apply to specific scrollable containers if needed, e.g., modal content */
  /* Example: .modal-scroll-content::-webkit-scrollbar { ... } */
  /* General scrollbar styling for elements using overflow-y-auto might still be useful */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px !important;
    /* Use !important sparingly */
    background: transparent !important;
  }
}

/* This might be needed for modal overlay scrolling issues, especially on iOS */
/* Targets the Headless UI Dialog container when it's fixed */
.fixed.inset-0.z-10.w-screen.overflow-y-auto {
  /* overflow: hidden !important; */
  /* Avoid hiding overflow on the main scroll container */
  -webkit-overflow-scrolling: touch;
}

/* Style adjustments for readonly/disabled inputs */
input[readonly],
select[disabled] {
  background-color: #f3f4f6;
  /* Tailwind gray-100 */
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
  -moz-appearance: textfield;
  /* Firefox */
}
</style>
