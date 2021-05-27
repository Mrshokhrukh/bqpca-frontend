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

            <!-- Qualification Type (unchanged) -->
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

            <!-- Qualification Name with Add New Option -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
              <select v-model="qualificationNameSelection" @change="handleQualificationNameChange"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                :disabled="!localFormData.qualification_type">
                <option value="">Select Qualification Name</option>
                <option v-for="qualification in filteredQualifications" :key="qualification.id"
                  :value="qualification.id">
                  {{ qualification.qualification }}
                </option>
                <option value="add_new" class="text-blue-600 font-medium">+ Add New Qualification</option>
              </select>

              <!-- Show custom qualification input if "add_new" is selected -->
              <div v-if="qualificationNameSelection === 'add_new'" class="mt-2">
                <input v-model="newQualificationName" type="text" placeholder="Enter new qualification name"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                  maxlength="200" @input="delete errors.qualification_name" />
                <div class="mt-1">
                  <p class="text-xs text-blue-600">
                    This will be added to the system under "{{ getSelectedQualificationTypeName() }}" for future use
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ newQualificationName.length }}/200 characters
                  </p>
                </div>
              </div>

              <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <!-- Institute/University with Add New Option -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
              <select v-model="instituteSelection" @change="handleInstituteChange"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm">
                <option value="">Select Institute/University</option>
                <!-- UPDATED: Use helper function to display country names -->
                <option v-for="university in universities" :key="university.id" :value="university.id">
                  {{ getUniversityDisplayText(university) }}
                </option>
                <option value="add_new" class="text-blue-600 font-medium">+ Add New Institute/University</option>
              </select>

              <!-- Show custom institute inputs if "add_new" is selected -->
              <div v-if="instituteSelection === 'add_new'" class="mt-2 space-y-2">
                <div>
                  <input v-model="newInstitute.institute_name" type="text" placeholder="Institute/College Name"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                    maxlength="200" @input="delete errors.institute" />
                  <p class="text-xs text-gray-500 mt-1">
                    {{ (newInstitute.institute_name || '').length }}/200 characters
                  </p>
                </div>

                <div>
                  <input v-model="newInstitute.university" type="text" placeholder="University Name"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                    maxlength="200" @input="delete errors.institute" />
                  <p class="text-xs text-gray-500 mt-1">
                    {{ (newInstitute.university || '').length }}/200 characters
                  </p>
                </div>

                <!-- UPDATED: Country dropdown shows names but stores codes -->
                <div>
                  <select v-model="newInstitute.country"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 px-2 text-sm"
                    @change="delete errors.institute">
                    <option value="">Select Country</option>
                    <option v-for="country in countries" :key="country.code" :value="country.code">
                      {{ country.name }}
                    </option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">
                    Selected: {{ getCountryName(newInstitute.country) || 'None' }}
                  </p>
                </div>

                <!-- UPDATED: Preview shows country name but form stores country code -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p class="text-xs text-blue-700">
                    <strong>Preview:</strong> {{ newInstitute.institute_name || 'Institute Name' }}
                    ({{ newInstitute.university || 'University Name' }}, {{ getCountryName(newInstitute.country) ||
                      'Country' }})
                  </p>
                  <p class="text-xs text-blue-600 mt-1">This institute will be added to the system for future use</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Country code to be sent: {{ newInstitute.country || 'None selected' }}
                  </p>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p class="text-xs text-blue-700">
                    <strong>Preview:</strong> {{ newInstitute.institute_name || 'Institute Name' }}
                    ({{ newInstitute.university || 'University Name' }}, {{ newInstitute.country || 'Country' }})
                  </p>
                  <p class="text-xs text-blue-600 mt-1">This institute will be added to the system for future use</p>
                </div>
              </div>

              <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <!-- Year of Completion (unchanged) -->
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
      <!-- ENHANCED: Documents Section with Progress Indicator -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Supporting Documents (Max 2MB each) - All Required
            </h3>
            <!-- Progress indicator -->
            <div class="text-sm font-medium">
              <span :class="[
                'px-3 py-1 rounded-full text-xs',
                getDocumentValidationSummary().totalUploaded === getDocumentValidationSummary().totalRequired
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              ]">
                {{ getDocumentValidationSummary().totalUploaded }} / {{ getDocumentValidationSummary().totalRequired }}
                Complete
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-4">
            All document types listed below are <strong>mandatory</strong>. Please upload all required documents to
            proceed
            with your application.
          </p>

          <!-- Show missing documents summary if any -->
          <div v-if="getDocumentValidationSummary().missing.length > 0"
            class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-orange-700">
                  <strong>Missing Documents:</strong> {{ getDocumentValidationSummary().missing.join(', ') }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="(doc, index) in supportingDocuments" :key="index" :class="[
              'flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 rounded-lg border',
              doc.files && doc.files.length > 0
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-100'
            ]">
              <div class="w-full sm:w-1/3">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Document Type<span class="text-red-500">*</span>
                </label>
                <!-- Document type is read-only since it's pre-populated -->
                <div class="flex items-center">
                  <input type="text" :value="getDocumentTypeName(doc.type)"
                    class="block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 py-1 px-2 text-sm cursor-not-allowed"
                    readonly disabled />
                  <!-- Success indicator for uploaded documents -->
                  <div v-if="doc.files && doc.files.length > 0" class="ml-2">
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex-1 w-full">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Upload File<span class="text-red-500">*</span>
                </label>
                <input type="file" @change="(e) => handleFileSelect(e, index)"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" required />

                <!-- Display selected file names with success styling -->
                <div v-if="doc.files && doc.files.length > 0" class="text-xs text-green-700 mt-1 font-medium">
                  ✓ Selected: {{doc.files.map((f) => f.name).join(', ')}}
                </div>

                <!-- Show validation error for this specific document -->
                <div v-if="doc.error" class="text-xs text-red-500 mt-1">
                  {{ doc.error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Overall document validation error -->
          <div v-if="errors.documents" class="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errors.documents }}</p>
              </div>
            </div>
          </div>

          <!-- Success message when all documents are uploaded -->
          <div
            v-if="getDocumentValidationSummary().totalUploaded === getDocumentValidationSummary().totalRequired && getDocumentValidationSummary().totalRequired > 0"
            class="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700">
                  <strong>All required documents uploaded!</strong> You can now proceed with your application.
                </p>
              </div>
            </div>
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
      <!-- UPDATED: Form Actions with enhanced validation feedback -->
      <div class="mt-12 flex justify-end space-x-4">
        <button type="button" @click="stage = 1"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          :disabled="isSubmitting">
          Back
        </button>
        <button type="submit" :class="[
          'px-6 py-3 rounded-lg transition-colors text-white font-medium min-w-[200px]',
          (!localFormData.declaration || getDocumentValidationSummary().totalUploaded !== getDocumentValidationSummary().totalRequired || isSubmitting)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        ]"
          :disabled="!localFormData.declaration || getDocumentValidationSummary().totalUploaded !== getDocumentValidationSummary().totalRequired || isSubmitting">

          <div class="flex items-center justify-center space-x-2">
            <!-- Loading spinner -->
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>

            <!-- Button text based on state -->
            <span v-if="isSubmitting">
              {{ getSubmissionStatusText() }}
            </span>
            <span
              v-else-if="getDocumentValidationSummary().totalUploaded !== getDocumentValidationSummary().totalRequired">
              Upload All Documents ({{ getDocumentValidationSummary().missing.length }} Missing)
            </span>
            <span v-else-if="hasNewEntries()">
              Submit & Add New {{ getNewEntriesText() }}
            </span>
            <span v-else>
              Submit Registration
            </span>
          </div>
        </button>
      </div>

      <!-- Progress indicator for multi-step submission -->
      <div v-if="isSubmitting" class="mt-4 text-center">
        <div class="text-sm text-gray-600">
          {{ getSubmissionProgressText() }}
        </div>
        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: getSubmissionProgress() + '%' }"></div>
        </div>
      </div>

      <!-- Summary of what will be added -->
      <div v-if="hasNewEntries() && !isSubmitting" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-800 mb-2">New entries will be added to the system:</h4>
        <ul class="text-sm text-blue-700 space-y-1">
          <li v-if="hasNewQualification()" class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
            </svg>
            Qualification: <strong>{{ newQualificationName }}</strong> ({{ getSelectedQualificationTypeName() }})
          </li>
          <li v-if="hasNewInstitute()" class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
            </svg>
            Institute: <strong>{{ newInstitute.institute_name }}</strong>
            <span v-if="newInstitute.university">({{ newInstitute.university }}, {{ newInstitute.country }})</span>
          </li>
        </ul>
        <p class="text-xs text-blue-600 mt-2">These will be available for future applicants to select from.</p>
      </div>

      <!-- Validation summary when documents are missing -->
      <div v-if="getDocumentValidationSummary().missing.length > 0 && !isSubmitting" class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Please upload <strong>{{ getDocumentValidationSummary().missing.length }}</strong>
          remaining document{{ getDocumentValidationSummary().missing.length > 1 ? 's' : '' }}
          to enable submission.
        </p>
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

const qualificationNameSelection = ref('')
const instituteSelection = ref('')
const newQualificationName = ref('')
const newInstitute = reactive({
  institute_name: '',
  university: '',
  country: ''
})

// Track submission progress for better UX
const submissionStep = ref('')
const submissionProgress = ref(0)

// ADD these handler functions
const handleQualificationNameChange = () => {
  console.log('Qualification selection changed to:', qualificationNameSelection.value)

  // Clear previous errors
  delete errors.qualification_name

  if (qualificationNameSelection.value === 'add_new') {
    localFormData.qualification_name = 'add_new'
    newQualificationName.value = ''
  } else if (qualificationNameSelection.value) {
    // Store the actual ID as a number
    localFormData.qualification_name = Number(qualificationNameSelection.value)
    newQualificationName.value = ''
  } else {
    localFormData.qualification_name = ''
    newQualificationName.value = ''
  }

  console.log('localFormData.qualification_name set to:', localFormData.qualification_name)
}

const handleInstituteChange = () => {
  console.log('Institute selection changed to:', instituteSelection.value)

  // Clear previous errors
  delete errors.institute

  if (instituteSelection.value === 'add_new') {
    localFormData.institute = 'add_new'
    // Clear new institute data for fresh entry
    newInstitute.institute_name = ''
    newInstitute.university = ''
    newInstitute.country = ''
  } else if (instituteSelection.value) {
    // Store the actual ID as a number
    localFormData.institute = Number(instituteSelection.value)
    // Clear new institute data
    newInstitute.institute_name = ''
    newInstitute.university = ''
    newInstitute.country = ''
  } else {
    localFormData.institute = ''
    // Clear new institute data
    newInstitute.institute_name = ''
    newInstitute.university = ''
    newInstitute.country = ''
  }

  console.log('localFormData.institute set to:', localFormData.institute)
}

// ADD function to create new qualification in master data
// IMPROVED: Create functions with better error handling and debugging
const createNewQualification = async () => {
  try {
    // Ensure we're sending the data in the correct format
    const qualificationData = {
      qualification: newQualificationName.value.trim(),
      qualification_type: Number(localFormData.qualification_type)
    }

    console.log('Creating new qualification with data:', qualificationData)

    // Validate the data before sending
    if (!qualificationData.qualification || qualificationData.qualification.length < 3) {
      throw new Error('Qualification name must be at least 3 characters')
    }

    if (!qualificationData.qualification_type || isNaN(qualificationData.qualification_type)) {
      throw new Error('Valid qualification type is required')
    }

    // Use the API service to create the qualification
    const response = await apiService.createEpcMastersQualification(qualificationData)

    console.log('Create qualification response:', response)
    console.log('Response data:', response.data)

    if (response.data && response.data.id) {
      const newQualId = response.data.id

      // Add to local qualifications array for immediate use
      qualifications.value.push(response.data)

      console.log('Successfully created qualification with ID:', newQualId)
      toast.success(`New qualification "${newQualificationName.value}" added successfully!`)

      return newQualId
    } else {
      console.error('No ID in response:', response.data)
      throw new Error('Failed to create qualification - no ID returned')
    }
  } catch (error) {
    console.error('Error creating new qualification:', error)
    console.error('Error response:', error.response)

    let errorMessage = 'Failed to create new qualification.'

    // Handle different types of errors
    if (error.response && error.response.data) {
      const errors = error.response.data
      console.error('Backend errors:', errors)

      if (typeof errors === 'object') {
        // Handle field-specific errors
        errorMessage = Object.entries(errors)
          .map(([key, value]) => {
            const fieldName = key === 'qualification' ? 'Qualification name' :
              key === 'qualification_type' ? 'Qualification type' : key
            const errorText = Array.isArray(value) ? value.join(', ') : value
            return `${fieldName}: ${errorText}`
          })
          .join('; ')
      } else if (typeof errors === 'string') {
        errorMessage = errors
      }
    } else if (error.message) {
      errorMessage = error.message
    }

    toast.error(`Error creating qualification: ${errorMessage}`)
    throw error
  }
}

const createNewInstitute = async () => {
  try {
    // Prepare data with country code (not country name)
    const instituteData = {
      institute_name: newInstitute.institute_name.trim(),
      university: newInstitute.university.trim(),
      country: newInstitute.country // This is already the country code from the dropdown value
    }

    console.log('Creating new institute with data:', instituteData)
    console.log('Country code being sent:', instituteData.country)
    console.log('Country name (for display):', getCountryName(instituteData.country))

    // Validate that we have a country code (not name)
    if (!instituteData.country || instituteData.country.length > 3) {
      throw new Error('Invalid country selection. Please select a country from the dropdown.')
    }

    // Use your existing createEpcMastersUniversity method
    const response = await apiService.createEpcMastersUniversity(instituteData)

    console.log('Create institute response:', response)
    console.log('Response data:', response.data)

    if (response.data && response.data.id) {
      const newInstId = response.data.id

      // Add to local universities array for immediate use
      // Note: The response should contain the country code, which is what we want
      universities.value.push(response.data)

      console.log('Successfully created institute with ID:', newInstId)
      toast.success(`New institute "${newInstitute.institute_name}" added successfully!`)

      return newInstId
    } else {
      console.error('No ID in response:', response.data)
      throw new Error('Failed to create institute - no ID returned')
    }
  } catch (error) {
    console.error('Error creating new institute:', error)
    console.error('Error response:', error.response)

    let errorMessage = 'Failed to create new institute.'
    if (error.response && error.response.data) {
      const errors = error.response.data
      console.error('Backend errors:', errors)

      if (typeof errors === 'object') {
        errorMessage = Object.entries(errors)
          .map(([key, value]) => {
            const fieldName = key === 'institute_name' ? 'Institute name' :
              key === 'university' ? 'University name' :
                key === 'country' ? 'Country' : key
            const errorText = Array.isArray(value) ? value.join(', ') : value
            return `${fieldName}: ${errorText}`
          })
          .join('; ')
      } else if (typeof errors === 'string') {
        errorMessage = errors
      }
    }
    toast.error(`Error creating institute: ${errorMessage}`)
    throw error
  }
}

const validateNewQualification = () => {
  if (!newQualificationName.value || !newQualificationName.value.trim()) {
    return 'Please enter the new qualification name'
  }

  if (newQualificationName.value.trim().length < 3) {
    return 'Qualification name must be at least 3 characters'
  }

  if (newQualificationName.value.trim().length > 200) {
    return 'Qualification name must not exceed 200 characters'
  }

  // Check for duplicates in existing qualifications
  const existingQual = qualifications.value.find(q =>
    q.qualification.toLowerCase().trim() === newQualificationName.value.toLowerCase().trim() &&
    q.qualification_type === Number(localFormData.qualification_type)
  )

  if (existingQual) {
    return 'A qualification with this name already exists for the selected type'
  }

  return null
}

const validateNewInstitute = () => {
  if (!newInstitute.institute_name || !newInstitute.institute_name.trim()) {
    return 'Please enter the institute name'
  }

  if (!newInstitute.university || !newInstitute.university.trim()) {
    return 'Please enter the university name'
  }

  if (!newInstitute.country) {
    return 'Please select the country'
  }

  if (newInstitute.institute_name.trim().length < 3) {
    return 'Institute name must be at least 3 characters'
  }

  if (newInstitute.university.trim().length < 3) {
    return 'University name must be at least 3 characters'
  }

  if (newInstitute.institute_name.trim().length > 200) {
    return 'Institute name must not exceed 200 characters'
  }

  if (newInstitute.university.trim().length > 200) {
    return 'University name must not exceed 200 characters'
  }

  // Validate country code format (should be 2-3 character code)
  if (newInstitute.country.length > 3) {
    return 'Invalid country selection'
  }

  // Check for duplicates in existing universities
  // Note: existing universities should also have country codes, not names
  const existingUni = universities.value.find(u =>
    u.institute_name.toLowerCase().trim() === newInstitute.institute_name.toLowerCase().trim() &&
    u.university.toLowerCase().trim() === newInstitute.university.toLowerCase().trim() &&
    u.country === newInstitute.country // Compare country codes
  )

  if (existingUni) {
    return 'An institute with this name and university already exists'
  }

  return null
}

// ADD: Helper function to display existing universities with country names
const getUniversityDisplayText = (university) => {
  const countryName = getCountryName(university.country)
  return `${university.institute_name} (${university.university}, ${countryName})`
}

// Helper functions for the enhanced submit button
const getSubmissionStatusText = () => {
  switch (submissionStep.value) {
    case 'qualification':
      return 'Adding New Qualification...'
    case 'institute':
      return 'Adding New Institute...'
    case 'application':
      return existingQualification.value ? 'Updating Application...' : 'Submitting Application...'
    default:
      return 'Processing...'
  }
}

const getSubmissionProgressText = () => {
  switch (submissionStep.value) {
    case 'qualification':
      return 'Step 1: Creating new qualification in system'
    case 'institute':
      return hasNewQualification() ? 'Step 2: Creating new institute in system' : 'Step 1: Creating new institute in system'
    case 'application':
      const stepNum = (hasNewQualification() ? 1 : 0) + (hasNewInstitute() ? 1 : 0) + 1
      return `Step ${stepNum}: Submitting your application`
    default:
      return 'Processing your submission...'
  }
}

const getSubmissionProgress = () => {
  return submissionProgress.value
}

const hasNewEntries = () => {
  return hasNewQualification() || hasNewInstitute()
}

const hasNewQualification = () => {
  return localFormData.qualification_name === 'add_new'
}

const hasNewInstitute = () => {
  return localFormData.institute === 'add_new'
}

const getNewEntriesText = () => {
  const entries = []
  if (hasNewQualification()) entries.push('Qualification')
  if (hasNewInstitute()) entries.push('Institute')

  if (entries.length === 2) return 'Entries'
  return entries[0] || ''
}
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
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Brunei', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'East Timor', code: 'TL' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Greece', code: 'GR' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Ivory Coast', code: 'CI' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, North', code: 'KP' },
  { name: 'Korea, South', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Laos', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia', code: 'FM' },
  { name: 'Moldova', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montenegro', code: 'ME' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russia', code: 'RU' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Sudan', code: 'SS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syria', code: 'SY' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatican City', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }
])

// ADD these helper functions for country code conversion
const getCountryName = (countryCode) => {
  const country = countries.value.find(c => c.code === countryCode)
  return country ? country.name : countryCode
}

const getCountryCode = (countryName) => {
  const country = countries.value.find(c => c.name === countryName)
  return country ? country.code : countryName
}

// Helper functions
// const addDocument = () => {
//   supportingDocuments.value.push({ type: '', files: [], description: '' })
// }

// const removeDocument = (index) => {
//   if (supportingDocuments.value.length > 1) {
//     supportingDocuments.value.splice(index, 1)
//     updateFormDocuments()
//   } else {
//     toast.warning('At least one document entry is required.')
//   }
// }

const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files)

  // Clear previous errors
  supportingDocuments.value[index].error = null
  delete errors.documents

  if (files.length === 0) {
    supportingDocuments.value[index].files = []
    updateFormDocuments()
    return
  }

  const file = files[0]

  if (file.size > 2 * 1024 * 1024) {
    const errorMsg = `File "${file.name}" exceeds the 2MB size limit.`
    supportingDocuments.value[index].error = errorMsg
    event.target.value = ''
    supportingDocuments.value[index].files = []
    toast.error(errorMsg)
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
    console.log('Populating from existing qualification:', qual)

    localFormData.qualification_type = qual.qualification_type || ''

    // Handle existing qualification name
    if (qual.qualification_name) {
      const existingQual = qualifications.value.find(q => q.id === Number(qual.qualification_name))
      if (existingQual) {
        // Found in current list, set both form data and selection
        localFormData.qualification_name = Number(qual.qualification_name)
        qualificationNameSelection.value = String(qual.qualification_name)
        console.log('Found existing qualification:', existingQual.qualification)
      } else {
        // Not in current list, might be a new qualification that was created
        console.log('Qualification not found in current list, keeping ID:', qual.qualification_name)
        localFormData.qualification_name = Number(qual.qualification_name)
        qualificationNameSelection.value = String(qual.qualification_name)
      }
    }

    // Handle existing institute
    if (qual.institute_university) {
      const existingInstitute = universities.value.find(u => u.id === Number(qual.institute_university))
      if (existingInstitute) {
        // Found in current list, set both form data and selection
        localFormData.institute = Number(qual.institute_university)
        instituteSelection.value = String(qual.institute_university)
        console.log('Found existing institute:', existingInstitute.institute_name)
      } else {
        // Not in current list, might be a new institute that was created
        console.log('Institute not found in current list, keeping ID:', qual.institute_university)
        localFormData.institute = Number(qual.institute_university)
        instituteSelection.value = String(qual.institute_university)
      }
    }

    if (qual.completion_year) {
      localFormData.year_of_completion = `${qual.completion_year}-01`
    }

    localFormData.remarks = qual.remarks || ''
    localFormData.declaration = qual.declaration === 'True' || qual.declaration === true
  }

  // Re-initialize supporting documents to ensure all types are present
  if (fetchedDocumentTypes.value.length > 0) {
    initializeSupportingDocuments()
  }

  console.log('Form populated with existing data:', {
    qualification_name: localFormData.qualification_name,
    institute: localFormData.institute,
    qualificationNameSelection: qualificationNameSelection.value,
    instituteSelection: instituteSelection.value
  })
}

// ADD function to clear new entry data when switching back to existing options
const clearNewEntryData = () => {
  newQualificationName.value = ''
  newInstitute.institute_name = ''
  newInstitute.university = ''
  newInstitute.country = ''
}

// ADD function to reset form to clean state
const resetFormToCleanState = () => {
  qualificationNameSelection.value = ''
  instituteSelection.value = ''
  clearNewEntryData()

  // Reset form data to default values
  localFormData.qualification_name = ''
  localFormData.institute = ''
}

// ADD a helper function to handle document validation errors
const getDocumentValidationSummary = () => {
  const missingDocs = supportingDocuments.value
    .filter(doc => !doc.files || doc.files.length === 0)
    .map(doc => getDocumentTypeName(doc.type))

  const uploadedDocs = supportingDocuments.value
    .filter(doc => doc.files && doc.files.length > 0)
    .map(doc => getDocumentTypeName(doc.type))

  return {
    missing: missingDocs,
    uploaded: uploadedDocs,
    totalRequired: fetchedDocumentTypes.value.length,
    totalUploaded: uploadedDocs.length
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

//  this helper function for qualification
const getSelectedQualificationTypeName = () => {
  if (!localFormData.qualification_type) return 'Selected Type'
  const qualType = qualificationTypes.value.find(type => type.id === Number(localFormData.qualification_type))
  return qualType ? qualType.qualification_type_name : 'Selected Type'
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

// FIXED: validateFormStageTwo function with proper ID validation
const validateFormStageTwo = () => {
  clearErrors()
  let isValid = true

  // Clear individual document errors first
  supportingDocuments.value.forEach(doc => {
    doc.error = null
  })

  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required'
    isValid = false
  }

  // Validate qualification name
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required'
    isValid = false
  } else if (localFormData.qualification_name === 'add_new') {
    // Use the new validation function
    const qualError = validateNewQualification()
    if (qualError) {
      errors.qualification_name = qualError
      isValid = false
    }
  } else {
    // For existing qualifications, ensure it's a valid number
    const qualId = Number(localFormData.qualification_name)
    if (!qualId || isNaN(qualId)) {
      errors.qualification_name = 'Invalid qualification selection'
      isValid = false
    }
  }

  // Validate institute
  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required'
    isValid = false
  } else if (localFormData.institute === 'add_new') {
    // Use the new validation function
    const instError = validateNewInstitute()
    if (instError) {
      errors.institute = instError
      isValid = false
    }
  } else {
    // For existing institutes, ensure it's a valid number
    const instId = Number(localFormData.institute)
    if (!instId || isNaN(instId)) {
      errors.institute = 'Invalid institute selection'
      isValid = false
    }
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

  // Document validation
  const missingDocuments = []

  supportingDocuments.value.forEach((doc, index) => {
    if (!doc.files || doc.files.length === 0) {
      const docTypeName = getDocumentTypeName(doc.type)
      doc.error = `${docTypeName} is required`
      missingDocuments.push(docTypeName)
      isValid = false
    }
  })

  if (missingDocuments.length > 0) {
    errors.documents = `Missing required documents: ${missingDocuments.join(', ')}`
  }

  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration.'
    isValid = false
  }

  console.log('Validation result:', {
    isValid,
    qualification_name: localFormData.qualification_name,
    institute: localFormData.institute,
    hasNewQualification: hasNewQualification(),
    hasNewInstitute: hasNewInstitute(),
    errors: Object.keys(errors)
  })

  return isValid
}

const getDocumentTypeName = (typeId) => {
  const docType = fetchedDocumentTypes.value.find(type => type.id === typeId)
  return docType ? docType.document_name : 'Unknown Document Type'
}
const initializeSupportingDocuments = () => {
  if (fetchedDocumentTypes.value.length > 0) {
    supportingDocuments.value = fetchedDocumentTypes.value.map(docType => ({
      type: docType.id,
      files: [],
      description: '',
      error: null // For individual document validation errors
    }))
    console.log('Initialized supporting documents with all types:', supportingDocuments.value)
  }
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

// FIXED: handleSubmitActual function with proper ID handling
const handleSubmitActual = async () => {
  isConfirmationModalOpen.value = false
  if (!validateFormStageTwo()) {
    toast.error('Validation failed. Cannot submit.')
    return
  }

  isSubmitting.value = true
  submissionProgress.value = 0

  try {
    // Initialize with existing IDs if they are actual numbers
    let finalQualificationId = null
    let finalInstituteId = null

    // Set initial values - only use if they are actual numeric IDs, not "add_new"
    if (localFormData.qualification_name && localFormData.qualification_name !== 'add_new') {
      finalQualificationId = Number(localFormData.qualification_name)
    }

    if (localFormData.institute && localFormData.institute !== 'add_new') {
      finalInstituteId = Number(localFormData.institute)
    }

    // Calculate total steps needed
    let totalSteps = 1 // At least application submission
    let currentStep = 0

    if (hasNewQualification()) totalSteps++
    if (hasNewInstitute()) totalSteps++

    console.log('Starting submission process...')
    console.log('Has new qualification:', hasNewQualification())
    console.log('Has new institute:', hasNewInstitute())
    console.log('Initial qualification ID:', finalQualificationId)
    console.log('Initial institute ID:', finalInstituteId)

    // Step 1: Create new qualification if needed
    if (hasNewQualification()) {
      submissionStep.value = 'qualification'
      submissionProgress.value = (currentStep / totalSteps) * 100
      toast.info('Creating new qualification...')

      try {
        const newQualId = await createNewQualification()
        finalQualificationId = Number(newQualId) // Ensure it's a number
        console.log('Created new qualification with ID:', finalQualificationId)
        currentStep++
        submissionProgress.value = (currentStep / totalSteps) * 100
      } catch (error) {
        throw new Error(`Failed to create qualification: ${error.message}`)
      }
    }

    // Step 2: Create new institute if needed
    if (hasNewInstitute()) {
      submissionStep.value = 'institute'
      submissionProgress.value = (currentStep / totalSteps) * 100
      toast.info('Creating new institute...')

      try {
        const newInstId = await createNewInstitute()
        finalInstituteId = Number(newInstId) // Ensure it's a number
        console.log('Created new institute with ID:', finalInstituteId)
        currentStep++
        submissionProgress.value = (currentStep / totalSteps) * 100
      } catch (error) {
        throw new Error(`Failed to create institute: ${error.message}`)
      }
    }

    // Validate that we have valid IDs before proceeding
    if (!finalQualificationId || !finalInstituteId) {
      throw new Error('Missing required qualification or institute ID')
    }

    // Step 3: Prepare and submit the main application data
    submissionStep.value = 'application'
    submissionProgress.value = (currentStep / totalSteps) * 100

    const apiFormData = new FormData()

    // Add qualification data with proper numeric IDs
    apiFormData.append('qualification_type', Number(localFormData.qualification_type))
    apiFormData.append('qualification_name', finalQualificationId)
    apiFormData.append('institute_university', finalInstituteId)

    // Add completion year
    const completionYear = localFormData.year_of_completion
      ? new Date(localFormData.year_of_completion + '-01').getFullYear()
      : null
    if (completionYear) {
      apiFormData.append('completion_year', completionYear)
    }

    // Add other required fields
    apiFormData.append('is_primary_qualification', 'True')
    apiFormData.append('application', localFormData.application)
    apiFormData.append('remarks', localFormData.remarks || '')
    apiFormData.append('declaration', localFormData.declaration ? 'True' : 'False')

    // Add documents (your existing format)
    localFormData.documents.forEach((doc, index) => {
      if (doc.files && doc.files.length > 0 && doc.type) {
        doc.files.forEach((file) => {
          apiFormData.append(`attachments-${index}-file`, file)
          apiFormData.append(`attachments-${index}-file_type`, Number(doc.type))
        })
      }
    })

    console.log('Final submission data:')
    console.log('- Qualification Type:', Number(localFormData.qualification_type))
    console.log('- Qualification ID (final):', finalQualificationId)
    console.log('- Institute ID (final):', finalInstituteId)
    console.log('- Application ID:', localFormData.application)

    // Log FormData contents for debugging
    console.log('FormData contents:')
    for (let pair of apiFormData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
    }

    // Submit the main application using your existing endpoint
    toast.info('Submitting application...')
    if (existingQualification.value && existingQualification.value.id) {
      await apiService.patchEpcNewQualification(existingQualification.value.id, apiFormData)
      toast.success('Application updated successfully!')
    } else {
      await apiService.createEpcNewQualification(apiFormData)
      toast.success('Application submitted successfully!')
    }

    submissionProgress.value = 100

    // Navigate to dashboard after a brief delay to show completion
    setTimeout(() => {
      router.push("/admin/user/engineering_certification/dashboard")
    }, 1500)

  } catch (error) {
    console.error('Error during application submission:', error)
    let errorMessage = 'Application submission failed.'

    if (error.response && error.response.data) {
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
    isSubmitting.value = false
    submissionStep.value = ''
    submissionProgress.value = 0
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
      qual => qual.id === Number(qualificationNameSelection.value)
    )

    if (!currentQualStillValid && qualificationNameSelection.value !== 'add_new') {
      qualificationNameSelection.value = ''
      localFormData.qualification_name = ''
    }
  } else {
    qualificationNameSelection.value = ''
    localFormData.qualification_name = ''
    newQualificationName.value = ''
  }
})

// ADD watch for clearing new entries when switching back
watch(() => qualificationNameSelection.value, (newValue) => {
  if (newValue !== 'add_new') {
    newQualificationName.value = ''
  }
})

watch(() => instituteSelection.value, (newValue) => {
  if (newValue !== 'add_new') {
    newInstitute.institute_name = ''
    newInstitute.university = ''
    newInstitute.country = ''
  }
})

// ADD watch for clearing new entries when switching back
watch(() => qualificationNameSelection.value, (newValue) => {
  if (newValue !== 'add_new') {
    newQualificationName.value = ''
  }
})

watch(() => instituteSelection.value, (newValue) => {
  if (newValue !== 'add_new') {
    newInstitute.institute_name = ''
    newInstitute.university = ''
    newInstitute.country = ''
  }
})

// Finally, the onMounted function
// UPDATE the onMounted function
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

    // IMPORTANT: Initialize supporting documents AFTER fetching document types
    initializeSupportingDocuments()

    console.log('Master data fetched successfully')
    console.log('Qualification Types:', qualificationTypes.value)
    console.log('Qualifications:', qualifications.value)
    console.log('Universities:', universities.value)
    console.log('Document Types:', fetchedDocumentTypes.value)

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

    // Initialize selection variables to empty state
    qualificationNameSelection.value = ''
    instituteSelection.value = ''

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
