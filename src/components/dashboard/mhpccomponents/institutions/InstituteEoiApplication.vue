<template>
  <Transition name="modal-eoi-form">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[100] p-4"
      @click.self="closeModal"
    >
      <!-- click.self to close only on overlay click -->

      <div class="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10"
        >
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Expression of Interest Application</h3>
            <p class="text-sm text-gray-500">
              Complete the form to submit your institute's EoI for MHPC accreditation.
            </p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="overflow-y-auto flex-grow p-6 md:p-8">
          <!-- Main Form Content -->
          <form @submit.prevent="confirmSubmission" class="space-y-12">
            <!-- Sections -->

            <section
              v-for="section in sections"
              :key="section.refKey"
              :ref="(el) => (sectionRefs[section.refKey] = el)"
              class="space-y-8 pt-6 border-t border-gray-100 first:border-t-0 first:pt-0"
            >
              <div class="flex items-center justify-between pb-3 mb-6 border-b border-gray-100">
                <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
                  <component :is="section.icon" class="w-6 h-6 mr-3 text-indigo-600" />
                  {{ section.title }}
                </h2>
                <button
                  v-if="section.collapsible"
                  type="button"
                  @click="toggleSectionVisibility(section.refKey)"
                  class="text-indigo-600 hover:text-indigo-800"
                >
                  <ChevronUpIcon
                    class="w-5 h-5 transform transition-transform"
                    :class="{ 'rotate-180': !sectionVisibility[section.refKey] }"
                  />
                </button>
              </div>

              <div
                v-if="!section.collapsible || sectionVisibility[section.refKey]"
                class="space-y-8"
              >
                <!-- Basic Information -->
                <template v-if="section.refKey === 'basicInfo'">
                  <div class="grid gap-6 md:grid-cols-2">
                    <div>
                      <label for="CID" class="form-label required-label flex items-center">
                        License Number/CID
                        <InformationCircleIcon
                          class="w-4 h-4 text-gray-400 cursor-help"
                          title="Your Institute License Number"
                        />
                      </label>
                      <input
                        type="text"
                        id="CID"
                        v-model="formData.CID"
                        class="form-input"
                        disabled
                        aria-describedby="CID-error"
                      />
                      <p v-if="validationErrors.CID" class="form-error" id="CID-error">
                        {{ validationErrors.CID }}
                      </p>
                    </div>
                    <div>
                      <label for="full_name" class="form-label required-label">Full Name</label>
                      <input
                        type="text"
                        id="full_name"
                        v-model="formData.full_name"
                        class="form-input"
                        disabled
                        aria-describedby="full_name-error"
                      />
                      <p v-if="validationErrors.full_name" class="form-error" id="full_name-error">
                        {{ validationErrors.full_name }}
                      </p>
                    </div>
                    <!-- <div>
                      <label for="gender" class="form-label">Gender</label>
                      <input
                        id="gender"
                        v-model="formData.gender"
                        class="form-input"
                        disabled
                        aria-describedby="gender-error"
                      />
                      <p v-if="validationErrors.gender" class="form-error" id="gender-error">
                        {{ validationErrors.gender }}
                      </p>
                    </div> -->
                    <!-- <div>
                      <label for="contact_no" class="form-label">Contact Number</label>
                      <input
                        type="tel"
                        id="contact_no"
                        v-model="formData.contact_no"
                        class="form-input"
                        disabled
                        aria-describedby="contact_no-error"
                      />
                      <p
                        v-if="validationErrors.contact_no"
                        class="form-error"
                        id="contact_no-error"
                      >
                        {{ validationErrors.contact_no }}
                      </p>
                    </div> -->
                    <div>
                      <label for="email_address" class="form-label">Email Address</label>
                      <input
                        type="email"
                        id="email_address"
                        v-model="formData.email_address"
                        class="form-input"
                        disabled
                        aria-describedby="email_address-error"
                      />
                      <p
                        v-if="validationErrors.email_address"
                        class="form-error"
                        id="email_address-error"
                      >
                        {{ validationErrors.email_address }}
                      </p>
                    </div>
                  </div>
                </template>

                <!-- Institution Details -->
                <template v-if="section.refKey === 'institutionDetails'">
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="md:col-span-2">
                      <label for="name_of_institution" class="form-label required-label"
                        >Name of Institution</label
                      >
                      <input
                        type="text"
                        id="name_of_institution"
                        v-model="formData.name_of_institution"
                        class="form-input"
                        @input="debounceValidateField('name_of_institution')"
                        aria-describedby="name_of_institution-error"
                      />
                      <p
                        v-if="validationErrors.name_of_institution"
                        class="form-error"
                        id="name_of_institution-error"
                      >
                        {{ validationErrors.name_of_institution }}
                      </p>
                    </div>
                    <div>
                      <label for="dzongkhag" class="form-label required-label">Dzongkhag</label>
                      <select
                        id="dzongkhag"
                        v-model="formData.dzongkhag"
                        class="form-select"
                        @change="debounceValidateField('dzongkhag')"
                        aria-describedby="dzongkhag-error"
                      >
                        <option value="">Select Dzongkhag</option>
                        <option
                          v-for="dzongkhag_option in dzongkhagOptions"
                          :key="dzongkhag_option"
                          :value="dzongkhag_option"
                        >
                          {{ dzongkhag_option }}
                        </option>
                      </select>
                      <p v-if="validationErrors.dzongkhag" class="form-error" id="dzongkhag-error">
                        {{ validationErrors.dzongkhag }}
                      </p>
                    </div>
                    <div>
                      <label for="gewog" class="form-label"
                        >Gewog <span class="text-gray-400">(Optional)</span></label
                      >
                      <input
                        type="text"
                        id="gewog"
                        v-model="formData.gewog"
                        class="form-input"
                        aria-describedby="gewog-error"
                      />
                      <p v-if="validationErrors.gewog" class="form-error" id="gewog-error">
                        {{ validationErrors.gewog }}
                      </p>
                    </div>
                    <div>
                      <label for="village" class="form-label"
                        >Village <span class="text-gray-400">(Optional)</span></label
                      >
                      <input
                        type="text"
                        id="village"
                        v-model="formData.village"
                        class="form-input"
                        aria-describedby="village-error"
                      />
                      <p v-if="validationErrors.village" class="form-error" id="village-error">
                        {{ validationErrors.village }}
                      </p>
                    </div>
                    <div>
                      <label for="chiwog" class="form-label"
                        >Chiwog <span class="text-gray-400">(Optional)</span></label
                      >
                      <input
                        type="text"
                        id="chiwog"
                        v-model="formData.chiwog"
                        class="form-input"
                        aria-describedby="chiwog-error"
                      />
                      <p v-if="validationErrors.chiwog" class="form-error" id="chiwog-error">
                        {{ validationErrors.chiwog }}
                      </p>
                    </div>
                    <div class="md:col-span-2">
                      <label for="address" class="form-label required-label">Address</label>
                      <textarea
                        id="address"
                        v-model="formData.address"
                        class="form-textarea"
                        rows="3"
                        @input="debounceValidateField('address')"
                        aria-describedby="address-error"
                      ></textarea>
                      <p v-if="validationErrors.address" class="form-error" id="address-error">
                        {{ validationErrors.address }}
                      </p>
                    </div>
                    <div>
                      <label for="website" class="form-label"
                        >Website <span class="text-gray-400">(Optional)</span></label
                      >
                      <input
                        type="url"
                        id="website"
                        v-model="formData.website"
                        class="form-input"
                        @input="debounceValidateField('website')"
                        aria-describedby="website-error"
                      />
                      <p v-if="validationErrors.website" class="form-error" id="website-error">
                        {{ validationErrors.website }}
                      </p>
                    </div>
                  </div>
                </template>

                <!-- Course Details -->
                <template v-if="section.refKey === 'courseDetails'">
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="md:col-span-2 flex flex-col md:flex-row gap-6">
                      <div class="flex-1">
                        <label for="title_of_course" class="form-label required-label"
                          >Title of Course</label
                        >
                        <input
                          type="text"
                          id="title_of_course"
                          v-model="formData.title_of_course"
                          class="form-input"
                          @input="debounceValidateField('title_of_course')"
                          aria-describedby="title_of_course-error"
                        />
                        <p
                          v-if="validationErrors.title_of_course"
                          class="form-error"
                          id="title_of_course-error"
                        >
                          {{ validationErrors.title_of_course }}
                        </p>
                      </div>
                      <div class="flex-1">
                        <label for="teaching_institute" class="form-label required-label"
                          >Teaching Hospital</label
                        >
                        <input
                          type="text"
                          id="teaching_institute"
                          v-model="formData.teaching_institute"
                          class="form-input"
                          @input="debounceValidateField('teaching_institute')"
                          aria-describedby="teaching_institute-error"
                        />
                        <p
                          v-if="validationErrors.teaching_institute"
                          class="form-error"
                          id="teaching_institute-error"
                        >
                          {{ validationErrors.teaching_institute }}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label for="course_duration" class="form-label required-label"
                        >Course Duration (in months)</label
                      >
                      <input
                        type="number"
                        id="course_duration"
                        v-model="formData.course_duration"
                        min="1"
                        max="120"
                        class="form-input"
                        @input="debounceValidateField('course_duration')"
                        aria-describedby="course_duration-error"
                      />
                      <p
                        v-if="validationErrors.course_duration"
                        class="form-error"
                        id="course_duration-error"
                      >
                        {{ validationErrors.course_duration }}
                      </p>
                    </div>
                    <div>
                      <label for="commencement_date" class="form-label required-label"
                        >Commencement Date</label
                      >
                      <input
                        type="date"
                        id="commencement_date"
                        v-model="formData.commencement_date"
                        class="form-input"
                        @input="debounceValidateField('commencement_date')"
                        aria-describedby="commencement_date-error"
                      />
                      <p
                        v-if="validationErrors.commencement_date"
                        class="form-error"
                        id="commencement_date-error"
                      >
                        {{ validationErrors.commencement_date }}
                      </p>
                    </div>
                    <div class="md:col-span-2">
                      <label for="type_of_programme" class="form-label required-label"
                        >Type of Program</label
                      >
                      <select
                        id="type_of_programme"
                        v-model="formData.type_of_programme"
                        class="form-select"
                        @change="debounceValidateField('type_of_programme')"
                        aria-describedby="type_of_programme-error"
                      >
                        <option value="">Select Program Type</option>
                        <option
                          v-for="option in programMasterOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <p
                        v-if="validationErrors.type_of_programme"
                        class="form-error"
                        id="type_of_programme-error"
                      >
                        {{ validationErrors.type_of_programme }}
                      </p>
                    </div>
                    <div class="md:col-span-2">
                      <label for="supporting_documents" class="form-label">
                        Supporting Documents
                        <span class="text-gray-400">(PDF, DOC, DOCX, max 5MB)</span>
                      </label>
                      <div class="mt-1 flex items-center">
                        <input
                          type="file"
                          id="supporting_documents"
                          @change="handleFileUpload($event, 'supporting_documents')"
                          accept=".pdf,.doc,.docx"
                          class="form-file-input"
                          aria-describedby="supporting_documents-error"
                        />
                        <button
                          v-if="formData.supporting_documents"
                          type="button"
                          @click="clearFile('supporting_documents')"
                          class="ml-3 text-sm text-red-600 hover:text-red-800"
                        >
                          Clear
                        </button>
                      </div>
                      <p
                        v-if="
                          formData.supporting_documents &&
                          typeof formData.supporting_documents === 'object'
                        "
                        class="text-xs text-gray-500 mt-1"
                      >
                        Selected: {{ formData.supporting_documents.name }}
                      </p>
                      <p
                        v-if="validationErrors.supporting_documents"
                        class="form-error"
                        id="supporting_documents-error"
                      >
                        {{ validationErrors.supporting_documents }}
                      </p>
                    </div>
                    <div class="md:col-span-2">
                      <label for="remarks" class="form-label"
                        >Remarks <span class="text-gray-400">(Optional)</span></label
                      >
                      <textarea
                        id="remarks"
                        v-model="formData.remarks"
                        class="form-textarea"
                        rows="3"
                        aria-describedby="remarks-error"
                      ></textarea>
                      <p v-if="validationErrors.remarks" class="form-error" id="remarks-error">
                        {{ validationErrors.remarks }}
                      </p>
                    </div>
                  </div>
                </template>

                <!-- Teaching Hospital Details -->
                <template v-if="section.refKey === 'teachingHospitalDetails'">
                  <div class="grid gap-6 md:grid-cols-2">
                    <div class="md:col-span-2">
                      <label for="teaching_hospital_name" class="form-label"
                        >Teaching Hospital Name</label
                      >
                      <input
                        type="text"
                        id="teaching_hospital_name"
                        v-model="formData.teaching_hospital_name"
                        class="form-input"
                        @input="debounceValidateField('teaching_hospital_name')"
                        aria-describedby="teaching_hospital_name-error"
                      />
                      <p
                        v-if="validationErrors.teaching_hospital_name"
                        class="form-error"
                        id="teaching_hospital_name-error"
                      >
                        {{ validationErrors.teaching_hospital_name }}
                      </p>
                    </div>
                    <div>
                      <label for="teaching_hospital_location" class="form-label"
                        >Location (Dzongkhag)</label
                      >
                      <select
                        id="teaching_hospital_location"
                        v-model="formData.teaching_hospital_location"
                        class="form-select"
                        @change="debounceValidateField('teaching_hospital_location')"
                        aria-describedby="teaching_hospital_location-error"
                      >
                        <option value="">Select Dzongkhag</option>
                        <option
                          v-for="dzongkhag_option in dzongkhagOptions"
                          :key="dzongkhag_option"
                          :value="dzongkhag_option"
                        >
                          {{ dzongkhag_option }}
                        </option>
                      </select>
                      <p
                        v-if="validationErrors.teaching_hospital_location"
                        class="form-error"
                        id="teaching_hospital_location-error"
                      >
                        {{ validationErrors.teaching_hospital_location }}
                      </p>
                    </div>
                  </div>
                </template>

                <!-- Head of Institution Details -->
                <template v-if="section.refKey === 'headOfInstitutionDetails'">
                  <div class="grid gap-6 md:grid-cols-2">
                    <div>
                      <label for="head_of_institution_name" class="form-label required-label"
                        >Name</label
                      >
                      <input
                        type="text"
                        id="head_of_institution_name"
                        v-model="formData.head_of_institution_name"
                        class="form-input"
                        @input="debounceValidateField('head_of_institution_name')"
                        aria-describedby="head_of_institution_name-error"
                      />
                      <p
                        v-if="validationErrors.head_of_institution_name"
                        class="form-error"
                        id="head_of_institution_name-error"
                      >
                        {{ validationErrors.head_of_institution_name }}
                      </p>
                    </div>
                    <div>
                      <label for="head_of_institution_gender" class="form-label required-label"
                        >Gender</label
                      >
                      <select
                        id="head_of_institution_gender"
                        v-model="formData.head_of_institution_gender"
                        class="form-select"
                        @change="debounceValidateField('head_of_institution_gender')"
                        aria-describedby="head_of_institution_gender-error"
                      >
                        <option value="">Select Gender</option>
                        <option
                          v-for="option in genderOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <p
                        v-if="validationErrors.head_of_institution_gender"
                        class="form-error"
                        id="head_of_institution_gender-error"
                      >
                        {{ validationErrors.head_of_institution_gender }}
                      </p>
                    </div>
                    <div>
                      <label
                        for="head_of_institution_phone_number"
                        class="form-label required-label"
                        >Phone Number</label
                      >
                      <input
                        type="tel"
                        id="head_of_institution_phone_number"
                        v-model="formData.head_of_institution_phone_number"
                        class="form-input"
                        @input="debounceValidateField('head_of_institution_phone_number')"
                        aria-describedby="head_of_institution_phone_number-error"
                      />
                      <p
                        v-if="validationErrors.head_of_institution_phone_number"
                        class="form-error"
                        id="head_of_institution_phone_number-error"
                      >
                        {{ validationErrors.head_of_institution_phone_number }}
                      </p>
                    </div>
                    <div>
                      <label for="head_of_institution_email" class="form-label required-label"
                        >Email</label
                      >
                      <input
                        type="email"
                        id="head_of_institution_email"
                        v-model="formData.head_of_institution_email"
                        class="form-input"
                        @input="debounceValidateField('head_of_institution_email')"
                        aria-describedby="head_of_institution_email-error"
                      />
                      <p
                        v-if="validationErrors.head_of_institution_email"
                        class="form-error"
                        id="head_of_institution_email-error"
                      >
                        {{ validationErrors.head_of_institution_email }}
                      </p>
                    </div>
                  </div>
                </template>

                <!-- Declaration -->
                <template v-if="section.refKey === 'declaration'">
                  <div class="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                    <p class="text-sm text-gray-700 mb-4">
                      I/We certify that the information provided in this application is true,
                      complete, and accurate to the best of my knowledge. I realize that any false,
                      fictitious, or fraudulent statements may be subjected to administrative
                      penalties. I am fully aware and understand the process and requirements of
                      relevant agencies.
                    </p>
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        id="declaration"
                        v-model="formData.declaration"
                        class="form-checkbox"
                        @change="debounceValidateField('declaration')"
                        aria-describedby="declaration-error"
                      />
                      <label for="declaration" class="ml-2 text-sm font-medium text-gray-800">
                        I agree to the above declaration
                      </label>
                    </div>
                    <p
                      v-if="validationErrors.declaration"
                      class="form-error"
                      id="declaration-error"
                    >
                      {{ validationErrors.declaration }}
                    </p>
                  </div>
                </template>
              </div>
            </section>

            <!-- Form Actions -->
            <div
              class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100"
            >
              <div class="flex gap-3 flex-wrap">
                <button type="button" @click="resetForm" class="btn btn-outline">
                  <ArrowPathIcon class="w-5 h-5 mr-2" /> Reset
                </button>
                <button type="button" @click="previewForm" class="btn btn-outline">
                  <EyeIcon class="w-5 h-5 mr-2" /> Preview
                </button>
              </div>
              <div class="flex gap-3 flex-wrap">
                <button type="button" @click="saveDraft" class="btn btn-secondary">
                  <InboxArrowDownIcon class="w-5 h-5 mr-2" /> Save Draft
                </button>
                <button
                  type="button"
                  @click="confirmSubmission"
                  :disabled="isSubmitting || Object.keys(validationErrors).length > 0"
                  class="btn btn-primary"
                >
                  <PaperAirplaneIcon v-if="!isSubmitting" class="w-5 h-5 mr-2" />
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
                </button>
              </div>
            </div>
          </form>
        </div>
        <!-- End Modal Body -->

        <!-- Internal Modals (Confirmation and Preview) - these are part of the form, so they remain inside -->
        <!-- Confirmation Modal -->
        <Transition name="internal-modal-confirm">
          <!-- Unique name for transition -->
          <div
            v-if="showConfirmModal"
            class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[150] p-4"
          >
            <!-- Higher z-index -->
            <div class="bg-white rounded-lg p-6 md:p-8 shadow-xl max-w-md w-full">
              <div class="flex items-start justify-between">
                <h3 class="text-xl font-semibold text-gray-900 mb-1">Confirm Submission</h3>
                <button @click="showConfirmModal = false" class="text-gray-400 hover:text-gray-600">
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
              <p class="text-sm text-gray-600 my-6">
                Are you sure you want to submit the EoI application? Please ensure all details are
                correct, as changes may not be possible after submission.
              </p>
              <div class="flex justify-end gap-4">
                <button type="button" @click="showConfirmModal = false" class="btn btn-outline">
                  Cancel
                </button>
                <button type="button" @click="processActualSubmission" class="btn btn-primary">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Preview Modal -->
        <Transition name="internal-modal-preview">
          <!-- Unique name for transition -->
          <div
            v-if="showPreviewModal"
            class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[150] p-4"
          >
            <!-- Higher z-index -->
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900">Form Preview</h3>
                <button @click="showPreviewModal = false" class="text-gray-400 hover:text-gray-600">
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
              <div class="p-6 space-y-6 overflow-y-auto flex-grow">
                <div
                  v-for="section_preview in sections.filter((s) => s.fields)"
                  :key="section_preview.refKey"
                  class="pb-4 mb-4 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <h4 class="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
                    <component :is="section_preview.icon" class="w-5 h-5 mr-2" />
                    {{ section_preview.title }}
                  </h4>
                  <dl class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <template v-for="(field, key) in section_preview.fields">
                      <div
                        v-if="
                          (formData[key] !== undefined &&
                            formData[key] !== '' &&
                            formData[key] !== null) ||
                          (key === 'supporting_documents' && formData.supporting_documents)
                        "
                        :key="key"
                        class="sm:col-span-1 break-words"
                      >
                        <dt class="text-sm font-medium text-gray-500">
                          {{ field.label }}
                        </dt>
                        <dd v-if="key === 'supporting_documents'" class="text-sm text-gray-900">
                          <template v-if="formData.supporting_documents instanceof File">
                            {{ formData.supporting_documents.name }}
                          </template>
                          <template
                            v-else-if="
                              typeof formData.supporting_documents === 'string' &&
                              formData.supporting_documents.length > 0
                            "
                          >
                            {{ formData.supporting_documents }}
                            <!-- Handles string name from draft or if API returns just name -->
                          </template>
                          <template
                            v-else-if="
                              formData.supporting_documents && formData.supporting_documents.name
                            "
                          >
                            {{ formData.supporting_documents.name }}
                            <!-- Handles if it's an object with a name property but not a File instance -->
                          </template>
                          <template v-else> Not provided </template>
                        </dd>
                        <dd v-else-if="key === 'declaration'" class="text-sm text-gray-900">
                          {{ formData.declaration ? 'Agreed' : 'Not Agreed' }}
                        </dd>
                        <dd v-else-if="key === 'type_of_programme'" class="text-sm text-gray-900">
                          {{ getProgramLabel(formData.type_of_programme) || 'Not provided' }}
                        </dd>
                        <dd v-else class="text-sm text-gray-900">
                          {{ formData[key] || 'Not provided' }}
                        </dd>
                      </div>
                    </template>
                  </dl>
                </div>
              </div>
              <div class="flex justify-end gap-4 p-6 border-t border-gray-200">
                <button type="button" @click="showPreviewModal = false" class="btn btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <!-- End Modal Container -->
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'

import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import debounce from 'lodash/debounce'
import apiServices from '@/services/services'
// InstituteHeader is removed from template, so import might not be needed unless used elsewhere in script
// import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue';

import {
  UserCircleIcon,
  BuildingOffice2Icon,
  BookOpenIcon,
  HeartIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  InboxArrowDownIcon,
  PaperAirplaneIcon,
  ChevronUpIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// Props and Emits for modal functionality
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'application-submitted'])

// Initialize dependencies

const toast = useToast()
const authStore = useAuthStore()

// Form data
const formData = ref({
  CID: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',
  name_of_institution: '',
  country: 'BT',
  dzongkhag: '',
  gewog: '',
  village: '',
  chiwog: '',
  address: '',
  website: '',
  title_of_course: '',
  teaching_institute: '',
  course_duration: null,
  commencement_date: '',
  type_of_programme: '', // This will hold Program Master ID
  supporting_documents: null,
  remarks: '',
  teaching_hospital_name: '',
  teaching_hospital_location: '',
  head_of_institution_name: '',
  head_of_institution_gender: '',
  head_of_institution_phone_number: '',
  head_of_institution_email: '',
  declaration: false,
  review_decision: 'Pending',
  reason_if_rejected: '',
})

// State management
const isSubmitting = ref(false)
const validationErrors = ref({})
const showConfirmModal = ref(false) // For internal confirmation
const showPreviewModal = ref(false) // For internal preview
const sectionRefs = reactive({})
const programMasterOptions = ref([]) // For program type dropdown

// Sections configuration (remains largely the same)
const sections = ref([
  {
    title: 'Basic Information',
    refKey: 'basicInfo',
    icon: UserCircleIcon,
    fields: {
      CID: { label: 'License Number' },
      full_name: { label: 'Full Name' },
      gender: { label: 'Gender' },
      contact_no: { label: 'Contact Number' },
      email_address: { label: 'Email Address' },
    },
  },
  {
    title: 'Institution Details',
    refKey: 'institutionDetails',
    icon: BuildingOffice2Icon,
    fields: {
      name_of_institution: { label: 'Name of Institution' },
      dzongkhag: { label: 'Dzongkhag' },
      gewog: { label: 'Gewog' },
      village: { label: 'Village' },
      chiwog: { label: 'Chiwog' },
      address: { label: 'Address' },
      website: { label: 'Website' },
    },
  },
  {
    title: 'Course Details',
    refKey: 'courseDetails',
    icon: BookOpenIcon,
    fields: {
      title_of_course: { label: 'Title of Course' },
      course_duration: { label: 'Course Duration (months)' },
      commencement_date: { label: 'Commencement Date' },
      type_of_programme: { label: 'Type of Programme' },
      supporting_documents: { label: 'Supporting Documents' },
      remarks: { label: 'Remarks' },
    },
  },
  {
    title: 'Teaching Hospital Details',
    refKey: 'teachingHospitalDetails',
    icon: HeartIcon,
    collapsible: true,
    fields: {
      teaching_hospital_name: { label: 'Teaching Hospital Name' },
      teaching_hospital_location: { label: 'Location (Dzongkhag)' },
    },
  },
  {
    title: 'Head of Institution',
    refKey: 'headOfInstitutionDetails',
    icon: AcademicCapIcon,
    fields: {
      head_of_institution_name: { label: 'Name' },
      head_of_institution_gender: { label: 'Gender' },
      head_of_institution_phone_number: { label: 'Phone Number' },
      head_of_institution_email: { label: 'Email' },
    },
  },
  {
    title: 'Declaration',
    refKey: 'declaration',
    icon: CheckCircleIcon,
    fields: { declaration: { label: 'Declaration Agreed' } },
  },
])

const sectionVisibility = reactive(
  sections.value
    .filter((s) => s.collapsible)
    .reduce((acc, curr) => {
      acc[curr.refKey] = curr.refKey === 'teachingHospitalDetails' ? false : true
      return acc
    }, {}),
)

const toggleSectionVisibility = (refKey) => {
  sectionVisibility[refKey] = !sectionVisibility[refKey]
}

// Options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
]
// programTypeOptions is removed, will be fetched
const dzongkhagOptions = [
  'Bumthang',
  'Chukha',
  'Dagana',
  'Gasa',
  'Haa',
  'Lhuntse',
  'Mongar',
  'Paro',
  'Pemagatshel',
  'Punakha',
  'Samdrup Jongkhar',
  'Samtse',
  'Sarpang',
  'Thimphu',
  'Trashigang',
  'Trashiyangtse',
  'Trongsa',
  'Tsirang',
  'Wangdue Phodrang',
  'Zhemgang',
]

// Validation rules (largely same, type_of_programme checked for presence)
const validateField = (field) => {
  const errors = {}
  const value = formData.value[field]
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+975\d{8}$|^\d{8}$/
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  const today = new Date().toISOString().split('T')[0]

  const required = (val, msg) => (!val ? msg : null)
  const minLength = (val, len, msg) => (val && val.length < len ? msg : null)

  switch (field) {
    case 'CID':
      errors.CID = required(value, 'License No is required.')
      break
    case 'full_name':
      errors.full_name =
        required(value, 'Full name is required.') ||
        minLength(value, 3, 'Full name must be at least 3 characters.')
      break
    // Gender is now optional
    // case 'gender': errors.gender = required(value, 'Gender is required.'); break;
    case 'contact_no':
      if (value && !phoneRegex.test(value))
        errors.contact_no = 'Enter a valid Bhutanese phone number (e.g., +97517xxxxxx or 17xxxxxx).'
      break
    case 'email_address':
      errors.email_address =
        required(value, 'Email is required.') ||
        (!emailRegex.test(value) ? 'Enter a valid email address.' : null)
      break
    case 'name_of_institution':
      errors.name_of_institution =
        required(value, 'Institution name is required.') ||
        minLength(value, 3, 'Institution name must be at least 3 characters.')
      break
    case 'dzongkhag':
      errors.dzongkhag = required(value, 'Dzongkhag is required.')
      break
    case 'address':
      errors.address =
        required(value, 'Address is required.') ||
        minLength(value, 10, 'Address must be at least 10 characters.')
      break
    case 'website':
      if (value && !urlRegex.test(value))
        errors.website = 'Enter a valid URL (e.g., https://example.com).'
      break
    case 'title_of_course':
      errors.title_of_course =
        required(value, 'Course title is required.') ||
        minLength(value, 3, 'Course title must be at least 3 characters.')
      break
    case 'teaching_institute':
      errors.teaching_institute =
        required(value, 'Teaching institution is required.') ||
        minLength(value, 3, 'Must be at least 3 characters.')
      break
    case 'course_duration':
      errors.course_duration =
        required(value, 'Course duration is required.') ||
        (value < 1 || value > 120 ? 'Duration must be 1-120 months.' : null)
      break
    case 'commencement_date':
      errors.commencement_date =
        required(value, 'Commencement date is required.') ||
        (value < today ? 'Date must be today or in the future.' : null)
      break
    case 'type_of_programme':
      errors.type_of_programme = required(value, 'Program type is required.')
      break // Will check if an ID is selected
    case 'supporting_documents':
      if (value && value instanceof File) {
        if (value.size > 5 * 1024 * 1024) errors.supporting_documents = 'File size max 5MB.'
        else if (
          ![
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(value.type)
        )
          errors.supporting_documents = 'Only PDF, DOC, DOCX allowed.'
      }
      break
    case 'head_of_institution_name':
      errors.head_of_institution_name =
        required(value, 'Head of institution name is required.') ||
        minLength(value, 3, 'Must be at least 3 characters.')
      break
    case 'head_of_institution_gender':
      errors.head_of_institution_gender = required(value, 'Gender is required.')
      break
    case 'head_of_institution_phone_number':
      errors.head_of_institution_phone_number =
        required(value, 'Phone number is required.') ||
        (!phoneRegex.test(value) ? 'Enter a valid Bhutanese phone number.' : null)
      break
    case 'head_of_institution_email':
      errors.head_of_institution_email =
        required(value, 'Email is required.') ||
        (!emailRegex.test(value) ? 'Enter a valid email address.' : null)
      break
    case 'teaching_hospital_name':
      if (value && minLength(value, 3, 'Hospital name must be at least 3 characters.'))
        errors.teaching_hospital_name = 'Hospital name must be at least 3 characters.'
      if (value && !formData.value.teaching_hospital_location)
        errors.teaching_hospital_location = 'Location is required if hospital name is provided.'
      break
    case 'teaching_hospital_location':
      if (formData.value.teaching_hospital_name && !value)
        errors.teaching_hospital_location = 'Location is required if hospital name is provided.'
      break
    case 'declaration':
      if (!value) errors.declaration = 'You must agree to the declaration.'
      break
  }
  for (const key in errors) {
    if (errors[key] === null) delete errors[key]
  }
  return errors
}

const validateForm = () => {
  const allErrors = {}
  sections.value.forEach((section) => {
    if (section.fields) {
      Object.keys(section.fields).forEach((fieldKey) => {
        if (
          section.collapsible &&
          !sectionVisibility[section.refKey] &&
          fieldKey !== 'declaration'
        ) {
          if (validationErrors.value[fieldKey]) delete validationErrors.value[fieldKey]
          return
        }
        const fieldErrors = validateField(fieldKey)
        Object.assign(allErrors, fieldErrors)
      })
    }
  })
  validationErrors.value = allErrors
  return Object.keys(allErrors).length === 0
}

const debounceValidateField = debounce((field) => {
  const errors = validateField(field)
  if (Object.keys(errors).length > 0) {
    validationErrors.value = { ...validationErrors.value, ...errors }
  } else {
    const newErrors = { ...validationErrors.value }
    delete newErrors[field]
    validationErrors.value = newErrors
  }
  if (props.modelValue) {
    // Only autosave if modal is open and form is active
    autoSaveDraft()
  }
}, 500)

// File upload handler
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    formData.value[fieldName] = file
    debounceValidateField(fieldName)
  } else {
    formData.value[fieldName] = null
  }
}

const clearFile = (fieldName) => {
  formData.value[fieldName] = null
  const fileInput = document.getElementById(fieldName)
  if (fileInput) fileInput.value = ''
  debounceValidateField(fieldName)
}

// Form submission flow
const confirmSubmission = () => {
  if (!validateForm()) {
    toast.error('Please fix the errors in the form.')
    const firstErrorKey = Object.keys(validationErrors.value)[0]
    if (firstErrorKey) {
      const errorElement =
        document.getElementById(`${firstErrorKey}-error`) || document.getElementById(firstErrorKey)
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  showConfirmModal.value = true // Show internal confirmation modal
}

// Actual submission logic, called by the internal confirmation modal
const processActualSubmission = async () => {
  if (!validateForm()) {
    // Re-validate, though confirmSubmission should have done it
    toast.error('Please fix the errors in the form before submitting.')
    showConfirmModal.value = false
    return
  }
  isSubmitting.value = true
  showConfirmModal.value = false

  const submitData = new FormData()
  Object.keys(formData.value).forEach((key) => {
    const value = formData.value[key]
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'supporting_documents' && value instanceof File) {
        submitData.append(key, value)
      } else if (key === 'course_duration' && value) {
        submitData.append(key, parseInt(value))
      } else if (key === 'declaration' && typeof value === 'boolean') {
        submitData.append(key, value.toString())
      } else if (key === 'type_of_programme' && value) {
        // Ensure selected program ID is sent
        submitData.append(key, value)
      } else if (!(value instanceof File) && key !== 'type_of_programme') {
        // General case, avoid double-adding type_of_programme
        submitData.append(key, value)
      }
    }
  })

  try {
    const response = await apiServices.createMhpcInstitute(submitData)
    if (response.data) {
      toast.success('Application submitted successfully!')
      clearDraft()
      emit('application-submitted') // Notify parent
      emit('update:modelValue', false) // Close this modal
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    let message = 'Error submitting application. Please try again.'
    if (error.response?.data) {
      const apiErrors = error.response.data
      if (typeof apiErrors === 'object') {
        message = Object.entries(apiErrors)
          .map(([field, msg]) => {
            let errorMsg = Array.isArray(msg) ? msg.join(', ') : msg
            if (typeof errorMsg === 'object') {
              errorMsg = Object.values(errorMsg).flat().join(', ')
            }
            return `${field}: ${errorMsg}`
          })
          .join('; ')
      } else {
        message = apiErrors
      }
    }
    toast.error(message, { timeout: 7000 })
  } finally {
    isSubmitting.value = false
  }
}

// Draft management
const getDraftKey = () => {
  const userId = authStore.user?.id
  if (!userId) return null
  return `eoiFormDraft_${userId}`
}

const saveDraft = () => {
  const draftKey = getDraftKey()
  if (!draftKey) {
    toast.error('You must be logged in to save a draft.')
    return
  }

  const draftData = { ...formData.value }
  if (draftData.supporting_documents instanceof File) {
    draftData.supporting_documents_name = draftData.supporting_documents.name
    delete draftData.supporting_documents
  }

  localStorage.setItem(draftKey, JSON.stringify(draftData))
  toast.info('Draft saved successfully!', { timeout: 2000 })
}

const clearDraft = () => {
  const draftKey = getDraftKey()
  if (draftKey) {
    localStorage.removeItem(draftKey)
  }
}

const resetForm = () => {
  const basicInfoKeys = ['CID', 'full_name', 'gender', 'contact_no', 'email_address', 'village']
  const preservedData = {}
  basicInfoKeys.forEach((key) => (preservedData[key] = formData.value[key]))

  const defaultFormData = {
    CID: '',
    full_name: '',
    gender: '',
    contact_no: '',
    email_address: '',
    name_of_institution: '',
    country: 'BT',
    dzongkhag: '',
    gewog: '',
    village: '',
    chiwog: '',
    address: '',
    website: '',
    title_of_course: '',
    teaching_institute: '',
    course_duration: null,
    commencement_date: '',
    type_of_programme: '',
    supporting_documents: null,
    remarks: '',
    teaching_hospital_name: '',
    teaching_hospital_location: '',
    head_of_institution_name: '',
    head_of_institution_gender: '',
    head_of_institution_phone_number: '',
    head_of_institution_email: '',
    declaration: false,
    review_decision: 'Pending',
    reason_if_rejected: '',
  }

  formData.value = { ...defaultFormData }
  Object.assign(formData.value, preservedData)

  validationErrors.value = {}
  clearDraft()
  const fileInput = document.getElementById('supporting_documents')
  if (fileInput) fileInput.value = ''
  toast.success('Form reset successfully!')
}

// Preview form
const previewForm = () => {
  if (!validateForm() && Object.keys(validationErrors.value).length > 0) {
    toast.warn('Please fix validation errors before previewing.')
    return
  }
  showPreviewModal.value = true
}

const getProgramLabel = (programId) => {
  const program = programMasterOptions.value.find((p) => p.value === programId)
  return program ? program.label : programId
}

// Auto-fill form
const autoFillForm = () => {
  const user = authStore.user || JSON.parse(localStorage.getItem('user'))
  if (user) {
    formData.value.CID = user.cid || ''
    formData.value.full_name =
      `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`.trim() || ''
    formData.value.gender = user.gender || ''
    formData.value.contact_no = user.contact_number || ''
    formData.value.email_address = user.email || ''
    formData.value.village = user.village || ''
  }
}

// Fetch program master data for dropdown
const fetchProgramMasters = async () => {
  try {
    const response = await apiServices.getMhpcProgramMasters()
    if (response.data && Array.isArray(response.data.results)) {
      programMasterOptions.value = response.data.results.map((pm) => ({
        value: pm.id,
        label: pm.program_name,
      }))
    } else if (response.data && Array.isArray(response.data)) {
      programMasterOptions.value = response.data.map((pm) => ({
        value: pm.id,
        label: pm.program_name,
      }))
    } else {
      console.warn('Program masters data not in expected format:', response.data)
      programMasterOptions.value = []
      toast.warn('Could not load program types from server.')
    }
  } catch (error) {
    console.error('Error fetching program masters:', error)
    toast.error('Failed to load program types.')
    programMasterOptions.value = []
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
}

// Lifecycle hooks
onMounted(() => {
  autoFillForm()
  fetchProgramMasters()

  const draftKey = getDraftKey()
  if (draftKey) {
    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        const basicInfoKeys = [
          'CID',
          'full_name',
          'gender',
          'contact_no',
          'email_address',
          'village',
        ]
        basicInfoKeys.forEach((key) => {
          if (formData.value[key] && !parsedDraft[key]) {
            parsedDraft[key] = formData.value[key]
          }
        })

        Object.keys(parsedDraft).forEach((key) => {
          if (key !== 'supporting_documents') {
            formData.value[key] = parsedDraft[key]
          }
        })
        toast.info('Previously saved draft has been loaded.', { timeout: 3000 })
      } catch (error) {
        console.error('Error loading draft:', error)
        clearDraft()
      }
    }
  }
})

onBeforeUnmount(() => {
  debounceValidateField.cancel()
})
</script>

<style scoped>
/* Main Modal Transition */
.modal-eoi-form-enter-active,
.modal-eoi-form-leave-active {
  transition: opacity 0.3s ease;
}
.modal-eoi-form-enter-from,
.modal-eoi-form-leave-to {
  opacity: 0;
}
.modal-eoi-form-enter-active .bg-white, /* Targets the modal content box */
.modal-eoi-form-leave-active .bg-white {
  transition: all 0.3s ease;
  transform-origin: center;
}
.modal-eoi-form-enter-from .bg-white,
.modal-eoi-form-leave-to .bg-white {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* Transitions for Internal Modals (Confirm, Preview) */
.internal-modal-confirm-enter-active,
.internal-modal-confirm-leave-active,
.internal-modal-preview-enter-active,
.internal-modal-preview-leave-active {
  transition: opacity 0.3s ease;
}
.internal-modal-confirm-enter-from,
.internal-modal-confirm-leave-to,
.internal-modal-preview-enter-from,
.internal-modal-preview-leave-to {
  opacity: 0;
}
.internal-modal-confirm-enter-active .bg-white,
.internal-modal-confirm-leave-active .bg-white,
.internal-modal-preview-enter-active .bg-white,
.internal-modal-preview-leave-active .bg-white {
  transition: all 0.3s ease;
  transform-origin: center;
}
.internal-modal-confirm-enter-from .bg-white,
.internal-modal-confirm-leave-to .bg-white,
.internal-modal-preview-enter-from .bg-white,
.internal-modal-preview-leave-to .bg-white {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* Form Element Styles (copied from original) */
.required-label::after {
  content: ' *';
  color: #dc2626;
  margin-left: 2px;
}
.form-input,
.form-select,
.form-textarea {
  @apply block w-full rounded-lg border-gray-200 shadow-sm px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-150;
}
.form-textarea {
  @apply resize-none;
}
.form-select {
  @apply pr-10;
}
.form-checkbox {
  @apply h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded;
}
.form-file-input {
  @apply block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}
.form-error {
  @apply text-red-600 text-xs mt-1;
}
.form-label {
  @apply flex block text-sm font-medium text-gray-700 mb-1.5 gap-1;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-secondary {
  @apply border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
</style>
