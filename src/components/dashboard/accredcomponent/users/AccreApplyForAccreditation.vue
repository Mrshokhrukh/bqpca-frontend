```vue
<template>
  <div class="initial-application-form mx-auto my-10 p-6 bg-gray-50 rounded-lg shadow-xl">
    <h2 class="text-3xl font-extrabold text-center text-blue-700 mb-6">Initial Accreditation Application</h2>
    <p class="text-center text-gray-600 mb-8">Please complete all required sections as per Annexure IV.</p>

    <!-- Page Loading Indicator -->
    <div v-if="pageLoading" class="text-center py-12 bg-white rounded-lg shadow-md">
      <div class="animate-spin inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-4 text-xl text-gray-700">Loading application data and configurations...</p>
    </div>

    <!-- Error Messages -->
    <div v-if="!pageLoading && errors.general" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2">{{ errors.general }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" @click="errors.general = null">
        <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
    <div v-if="!pageLoading && errors.profile" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Heads Up!</strong>
      <span class="block sm:inline ml-2">{{ errors.profile }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" @click="errors.profile = null">
        <svg class="fill-current h-6 w-6 text-yellow-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>

    <!-- No Active Schedule Message -->
    <div v-if="!pageLoading && !activeSchedule.id && !application.id && !errors.general && !errors.profile" class="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-8 rounded-lg shadow-md text-center mb-10">
      <svg class="inline-block w-10 h-10 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h4 class="text-2xl font-semibold mb-3">No Active Application Schedule</h4>
      <p class="text-lg">There is currently no active accreditation application schedule. Please check back later or contact HEQC.</p>
    </div>

    <!-- Main Application Form -->
    <div v-if="!pageLoading && (activeSchedule.id || application.id)" class="space-y-8">
      <!-- Application Overview Section -->
      <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
        <div class="flex items-center text-blue-700 mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-xl font-semibold">Application Overview</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <label class="block text-sm font-medium text-gray-600">Name of HEI:</label>
            <p class="mt-1 text-lg text-gray-900 font-medium">{{ application.institute_profile_name_display || 'Loading...' }}</p>
            <input type="hidden" v-model="application.institute_profile" />
          </div>
          <div v-if="application.application_schedule_details">
            <label class="block text-sm font-medium text-gray-600">Application Schedule:</label>
            <p class="mt-1 text-lg text-gray-900 font-medium">
              {{ application.application_schedule_details.schedule_name }}
              <span class="block text-gray-500 text-sm mt-0.5">({{ application.application_schedule_details.from_date }} to {{ application.application_schedule_details.end_date }})</span>
            </p>
          </div>
          <div v-if="application.application_fee_category_details && application.fee_amount_payable !== null">
            <label class="block text-sm font-medium text-gray-600">Application Fee:</label>
            <p class="mt-1 text-lg text-gray-900 font-medium">
              Nu. {{ application.fee_amount_payable }}
              <span class="text-gray-500 text-sm">({{ application.application_fee_category_details.fee_category }})</span>
            </p>
          </div>
          <div v-if="application.id" class="col-span-full">
            <label class="block text-sm font-medium text-gray-600 mb-1">Application Status:</label>
            <span :class="['px-3 py-1.5 rounded-full text-sm font-semibold inline-flex items-center', statusBadgeClass(application.status)]" v-html="statusIconChar(application.status) + ' ' + (application.status_display || application.status)">
            </span>
          </div>
          <div class="col-span-full" v-if="application.id && application.isar_submission_deadline">
            <label class="block text-sm font-medium text-gray-600 mb-1">ISAR Submission Deadline:</label>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 inline-flex items-center">
              <span class="mr-1">📅</span>
              {{ application.isar_submission_deadline }}
            </span>
          </div>
        </div>
      </div>

      <!-- Accreditation Cycle Applying For (Dropdown) -->
      <fieldset class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <legend class="text-base font-semibold text-gray-800 px-3 py-1.5 bg-gray-100 rounded-full inline-flex items-center -ml-3 -mt-10 mb-4 shadow-sm">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          Accreditation Cycle Applying For <span class="text-red-500 ml-1">*</span>
        </legend>
        <div class="form-group">
          <select v-model="application.accreditation_cycle" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="" disabled>-- Select Cycle --</option>
            <option value="first">First Cycle</option>
            <option value="second">Second Cycle</option>
            <option value="third">Third Cycle</option>
            <option value="other">Other Cycle (Specify Below)</option>
          </select>
          <p v-if="errors.accreditation_cycle" class="text-red-600 text-sm mt-1 flex items-center">
            <span class="mr-1">⚠</span>
            {{ errors.accreditation_cycle.join ? errors.accreditation_cycle.join(', ') : errors.accreditation_cycle }}
          </p>
        </div>
        <div v-if="application.accreditation_cycle === 'other'" class="form-group mt-4">
          <label for="accreditation_cycle_other_specify" class="block text-sm font-medium text-gray-700">Specify Other Cycle <span class="text-red-500">*</span>:</label>
          <input type="text" id="accreditation_cycle_other_specify" v-model="application.accreditation_cycle_other_specify"
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <p v-if="errors.accreditation_cycle_other_specify" class="text-red-600 text-sm mt-1 flex items-center">
            <span class="mr-1">⚠</span>
            {{ errors.accreditation_cycle_other_specify.join ? errors.accreditation_cycle_other_specify.join(', ') : errors.accreditation_cycle_other_specify }}
          </p>
        </div>
      </fieldset>

      <!-- Part I: Document Checklist Section -->
      <fieldset class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <legend class="text-base font-semibold text-gray-800 px-3 py-1.5 bg-gray-100 rounded-full inline-flex items-center -ml-3 -mt-10 mb-4 shadow-sm">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Part I: Document Checklist
        </legend>
        <p class="text-gray-600 mb-6">Please upload all required supporting documents. Files should be clear and legible.</p>
        <div v-if="loadingChecklistTypes" class="text-center py-4 text-gray-600">
          <span class="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full mr-2"></span>
          Loading document types...
        </div>
        <div v-if="checklistDocumentTypes.length === 0 && !loadingChecklistTypes" class="bg-blue-50 text-blue-700 px-4 py-3 rounded relative text-center">
          <span class="mr-2">ℹ</span> No checklist document types found for "application" category. Please ensure they are configured or contact support.
        </div>
        <div v-for="docType in checklistDocumentTypes" :key="docType.id" class="mb-5">
          <label :for="'doc_type_' + docType.id" class="block text-sm font-medium text-gray-700 mb-2">
            {{ docType.name }}
            <span v-if="docType.is_required" class="text-red-500">*</span>
            <span v-if="docType.description" class="block text-gray-500 text-xs mt-1">({{ docType.description }})</span>
          </label>
          <div class="flex items-center space-x-2">
            <input type="file" :id="'doc_type_' + docType.id" @change="handleChecklistFileUpload($event, docType.id)"
                   :required="docType.is_required && !getExistingDocumentUrl(docType.id)"
                   class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            <a v-if="getExistingDocumentUrl(docType.id)" :href="getExistingDocumentUrl(docType.id)" target="_blank"
               class="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 inline-flex items-center truncate max-w-[150px] sm:max-w-[200px]"
               :title="'View Current: ' + getFileName(getExistingDocumentUrl(docType.id))">
              <span class="mr-2">📄</span> {{ getFileName(getExistingDocumentUrl(docType.id)) }}
            </a>
          </div>
          <p v-if="errors[`document_file_type_${docType.id}`]" class="text-red-600 text-sm mt-1 flex items-center">
            <span class="mr-1">⚠</span>
            {{ errors[`document_file_type_${docType.id}`].join ? errors[`document_file_type_${docType.id}`].join(', ') : errors[`document_file_type_${docType.id}`] }}
          </p>
        </div>
        <div class="mb-5" v-if="!checklistDocumentTypes.find(dt => dt.name && dt.name.toLowerCase().includes('receipt of the accreditation fee'))">
          <label for="payment_receipt_document_manual" class="block text-sm font-medium text-gray-700 mb-2">
            Receipt of the Accreditation Fee (if paid offline/manually uploaded):
          </label>
          <div class="flex items-center space-x-2">
            <input type="file" id="payment_receipt_document_manual" @change="handleFileUpload($event, 'payment_receipt_document')"
                   class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            <a v-if="application.payment_receipt_document_url" :href="application.payment_receipt_document_url" target="_blank"
               class="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 inline-flex items-center truncate max-w-[150px] sm:max-w-[200px]"
               :title="'View Current Receipt: ' + getFileName(application.payment_receipt_document_url)">
              <span class="mr-2">💳</span> {{ getFileName(application.payment_receipt_document_url) }}
            </a>
          </div>
          <p v-if="errors.payment_receipt_document" class="text-red-600 text-sm mt-1 flex items-center">
            <span class="mr-1">⚠</span>
            {{ errors.payment_receipt_document.join ? errors.payment_receipt_document.join(', ') : errors.payment_receipt_document }}
          </p>
        </div>
      </fieldset>

      <!-- Part II: Course/Programme Details Section -->
      <fieldset class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <legend class="text-base font-semibold text-gray-800 px-3 py-1.5 bg-gray-100 rounded-full inline-flex items-center -ml-3 -mt-10 mb-4 shadow-sm">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253"></path></svg>
          Part II: Course/Programme Details
        </legend>
        <p class="text-gray-600 mb-6">Add details for each course/programme for which accreditation is being sought.</p>
        <div v-if="application.application_courses.length === 0" class="bg-blue-50 text-blue-700 px-4 py-6 rounded-lg text-center mb-6">
          <span class="mr-2">💡</span> Click "Add New Course/Programme" to begin.
        </div>
        <div v-for="(course, index) in application.application_courses" :key="course.id || `new-${index}`" class="course-entry bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200 mb-6">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-blue-100">
            <h5 class="text-lg font-semibold text-blue-700">Course/Programme {{ index + 1 }}</h5>
            <button type="button" @click="removeCourseProgramme(index)"
                    class="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 inline-flex items-center">
              <span class="mr-1">🗑</span> Remove
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            <div class="col-span-full">
              <label :for="'course_title_' + index" class="block text-sm font-medium text-gray-700">Course/Programme Title <span class="text-red-500">*</span>:</label>
              <input type="text" :id="'course_title_' + index" v-model="course.course_programme_title" required
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <p v-if="errors[`application_courses_json.${index}.course_programme_title`]" class="text-red-600 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠</span>
                {{ errors[`application_courses_json.${index}.course_programme_title`].join(', ') }}
              </p>
            </div>
            <div>
              <label :for="'awarding_body_' + index" class="block text-sm font-medium text-gray-700">Awarding Body:</label>
              <input type="text" :id="'awarding_body_' + index" v-model="course.awarding_body"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <p v-if="errors[`application_courses_json.${index}.awarding_body`]" class="text-red-600 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠</span>
                {{ errors[`application_courses_json.${index}.awarding_body`].join(', ') }}
              </p>
            </div>
            <div>
              <label :for="'level_bqf_' + index" class="block text-sm font-medium text-gray-700">Level(S) as per BQF <span class="text-red-500">*</span>:</label>
              <input type="text" :id="'level_bqf_' + index" v-model="course.level_as_per_bqf" required
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <p v-if="errors[`application_courses_json.${index}.level_as_per_bqf`]" class="text-red-600 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠</span>
                {{ errors[`application_courses_json.${index}.level_as_per_bqf`].join(', ') }}
              </p>
            </div>
            <div>
              <label :for="'student_no_' + index" class="block text-sm font-medium text-gray-700">Current Student Number <span class="text-red-500">*</span>:</label>
              <input type="number" :id="'student_no_' + index" v-model.number="course.current_student_number" min="0" required
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <p v-if="errors[`application_courses_json.${index}.current_student_number`]" class="text-red-600 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠</span>
                {{ errors[`application_courses_json.${index}.current_student_number`].join(', ') }}
              </p>
            </div>
          </div>
        </div>
        <button type="button" @click="addCourseProgramme"
                class="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150 inline-flex items-center justify-center">
          <span class="mr-2">＋</span> Add New Course/Programme
        </button>
        <p v-if="errors.application_courses_json && (typeof errors.application_courses_json === 'string' || Array.isArray(errors.application_courses_json))" class="text-red-600 text-sm mt-3 flex items-center">
          <span class="mr-1">⚠</span>
          {{ Array.isArray(errors.application_courses_json) ? errors.application_courses_json.join(', ') : errors.application_courses_json }}
        </p>
      </fieldset>

      <!-- Action Buttons -->
      <div class="sticky bottom-0 bg-gray-100 px-6 py-4 rounded-b-lg shadow-inner border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 z-10">
        <button
          type="button"
          @click="saveDraft"
          :disabled="isSubmitting || (application.status && !['draft_initial', null, undefined].includes(application.status))"
          class="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSavingDraft" class="animate-spin mr-2 w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full"></span>
          <span v-else class="mr-2">💾</span>
          {{ application.id ? 'Update Draft' : 'Save Draft' }}
        </button>
        <button
          type="button"
          @click="handleFinalSubmitApplication"
          :disabled="isSubmitting || (application.status && !['draft_initial', null, undefined].includes(application.status))"
          class="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isProcessingSubmit" class="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          <span v-else class="mr-2">✅</span>
          Submit Application
        </button>
      </div>
      <p v-if="isSubmitting" class="text-center text-gray-500 text-sm mt-3 flex items-center justify-center">
        <span class="mr-2">⏳</span> Processing your request, please wait...
      </p>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="application.fee_amount_payable || 100"
      :showModal="showPaymentModal"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';

const toast = useToast();
const authStore = useAuthStore();

// Initial data structure for the application
const initialApplicationData = () => ({
  id: null,
  institute_profile: null,
  institute_profile_name_display: '',
  application_schedule: null,
  application_schedule_details: null,
  accreditation_cycle: '',
  accreditation_cycle_other_specify: '',
  application_fee_category: null,
  application_fee_category_details: null,
  fee_amount_payable: null,
  is_payment_complete: false,
  payment_id_gateway: '',
  payment_receipt_document: null,
  payment_receipt_document_url: null,
  status: 'draft_initial',
  status_display: 'Draft Initial Application',
  isar_submission_deadline: null,
  application_courses: [],
  checklistDocumentUploads: {},
  existing_application_documents: [],
});

// Reactive variables
const application = ref(initialApplicationData());
const activeSchedule = ref({});
const applicationFee = ref({});
const checklistDocumentTypes = ref([]);
const pageLoading = ref(true);
const loadingChecklistTypes = ref(false);
const isSubmitting = ref(false);
const isSavingDraft = ref(false);
const isProcessingSubmit = ref(false);
const errors = ref({});
const paymentModalRef = ref(null);
const showPaymentModal = ref(false);
const selectedApplicationForPayment = ref(null);

// Props definition
const props = defineProps({
  applicationIdProp: {
    type: [String, Number],
    default: null,
  },
});

// Methods
const statusBadgeClass = (statusKey) => {
  const mapping = {
    'draft_initial': 'bg-gray-200 text-gray-800 border border-gray-300',
    'pending_payment': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800 border border-blue-300',
    'initial_app_rejected': 'bg-red-100 text-red-800 border border-red-300',
    'initial_app_approved_awaiting_isar': 'bg-green-100 text-green-800 border border-green-300',
    'isar_submitted_heqc_review': 'bg-indigo-100 text-indigo-800 border border-indigo-300',
  };
  return mapping[statusKey] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const statusIconChar = (statusKey) => {
  const mapping = {
    'draft_initial': '🖊',
    'pending_payment': '💳',
    'initial_app_submitted_heqc_review': '⏳',
    'initial_app_rejected': '❌',
    'initial_app_approved_awaiting_isar': '✅',
    'isar_submitted_heqc_review': '📆',
  };
  return mapping[statusKey] || 'ℹ';
};

const fetchInitialDataMasters = async () => {
  loadingChecklistTypes.value = true;
  errors.value = {};
  activeSchedule.value = {};
  applicationFee.value = {};
  checklistDocumentTypes.value = [];

  try {
    const promises = [
      apiService.getActiveApplicationSchedule(),
      apiService.getDocumentTypesByCategory('application'),
      apiService.getFeeDetailsByName('Initial Accreditation Fee'),
    ];
    const [scheduleRes, docTypesRes, feeRes] = await Promise.all(promises);

    console.log("Active Schedule API Response:", scheduleRes);
    if (scheduleRes && scheduleRes.data) {
      if (scheduleRes.data.id) {
        activeSchedule.value = scheduleRes.data;
      } else if (Array.isArray(scheduleRes.data) && scheduleRes.data.length > 0 && scheduleRes.data[0].id) {
        activeSchedule.value = scheduleRes.data[0];
      }
    }

    console.log("Document Types API Response:", docTypesRes);
    if (docTypesRes && docTypesRes.data) {
      checklistDocumentTypes.value = docTypesRes.data.results || docTypesRes.data || [];
    }

    console.log("Fee Details API Response:", feeRes);
    if (feeRes && feeRes.data) {
      if (feeRes.data.results && Array.isArray(feeRes.data.results) && feeRes.data.results.length > 0) {
        applicationFee.value = feeRes.data.results[0];
      } else if (feeRes.data.id) {
        applicationFee.value = feeRes.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial master data:", error.response?.data || error.message || error);
    errors.value.general = "Could not load required configurations. Please try reloading or contact support.";
  } finally {
    loadingChecklistTypes.value = false;
  }
};

const initializeNewApplicationFromProfile = async () => {
  try {
    const profileRes = await apiService.getMyInstituteProfile();
    if (profileRes.data && profileRes.data.id) {
      application.value.institute_profile = profileRes.data.id;
      application.value.institute_profile_name_display = profileRes.data.name;
    } else {
      errors.value.profile = profileRes.data?.message || "Your institute profile is not available or incomplete. Please set up your profile first.";
    }

    if (activeSchedule.value && activeSchedule.value.id) {
      application.value.application_schedule = activeSchedule.value.id;
      application.value.application_schedule_details = { ...activeSchedule.value };
    }

    if (applicationFee.value && applicationFee.value.id) {
      application.value.application_fee_category = applicationFee.value.id;
      application.value.fee_amount_payable = applicationFee.value.fee_amount || 100;
      application.value.application_fee_category_details = { ...applicationFee.value };
    }
  } catch (error) {
    console.error("Error initializing new application from profile:", error.response?.data || error.message || error);
    errors.value.general = (errors.value.general ? errors.value.general + " " : "") + "Could not initialize application with profile data. " + (error.response?.data?.detail || '');
  }
};

const loadExistingApplication = async (id) => {
  isSubmitting.value = true;
  try {
    const response = await apiService.getAccreditationApplication(id);
    const appData = response.data;

    application.value = { ...initialApplicationData(), ...appData };
    application.value.id = appData.id;
    application.value.institute_profile_name_display = appData.institute_profile_details?.name || application.value.institute_profile_name_display || 'N/A';
    application.value.application_schedule_details = appData.application_schedule_details || application.value.application_schedule_details;
    application.value.application_fee_category_details = appData.application_fee_category_details || application.value.application_fee_category_details;
    application.value.status_display = appData.status_display || appData.status;
    application.value.application_courses = appData.application_courses || [];
    application.value.existing_application_documents = appData.application_documents || [];
    application.value.checklistDocumentUploads = {};
  } catch (error) {
    console.error(`Error loading application ${id}:`, error.response?.data || error);
    errors.value.general = "Failed to load existing application data. " + (error.response?.data?.detail || '');
  } finally {
    isSubmitting.value = false;
  }
};

const getFileName = (url) => {
  if (!url) return '';
  try { return decodeURIComponent(new URL(url).pathname.split('/').pop()); }
  catch (e) {
    console.warn("Error parsing URL for filename:", url, e);
    const segments = url.split('/');
    return segments.pop() || segments.pop() || 'file';
  }
};

const getExistingDocumentUrl = (docTypeId) => {
  const existingDoc = (application.value.existing_application_documents || []).find(
    doc => String(doc.document_type) === String(docTypeId) || String(doc.document_type_details?.id) === String(docTypeId)
  );
  return existingDoc ? existingDoc.document_file : null;
};

const handleChecklistFileUpload = (event, docTypeId) => {
  const file = event.target.files[0];
  if (file) {
    application.value.checklistDocumentUploads = {
      ...application.value.checklistDocumentUploads,
      [docTypeId]: file
    };
    if (errors.value[`document_file_type_${docTypeId}`]) {
      delete errors.value[`document_file_type_${docTypeId}`];
    }
  } else {
    const { [docTypeId]: _, ...rest } = application.value.checklistDocumentUploads;
    application.value.checklistDocumentUploads = rest;
  }
};

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0];
  application.value[fieldName] = file || null;
  if (file && application.value[`${fieldName}_url`]) {
    application.value[`${fieldName}_url`] = null;
  }
  if (errors.value[fieldName]) {
    delete errors.value[fieldName];
  }
};

const addCourseProgramme = () => {
  application.value.application_courses.push({
    course_programme_title: '', awarding_body: '', level_as_per_bqf: '', current_student_number: null,
  });
};

const removeCourseProgramme = (index) => { application.value.application_courses.splice(index, 1); };

const prepareApplicationFormData = () => {
  const formData = new FormData();
  if (application.value.institute_profile) formData.append('institute_profile', application.value.institute_profile);
  if (application.value.application_schedule) formData.append('application_schedule', application.value.application_schedule);
  formData.append('accreditation_cycle', application.value.accreditation_cycle);
  if (application.value.accreditation_cycle === 'other') {
    formData.append('accreditation_cycle_other_specify', application.value.accreditation_cycle_other_specify || '');
  } else if (Object.prototype.hasOwnProperty.call(application.value, 'accreditation_cycle_other_specify')) {
    formData.append('accreditation_cycle_other_specify', '');
  }
  if (application.value.application_fee_category) formData.append('application_fee_category', application.value.application_fee_category);
  if (application.value.fee_amount_payable !== null) formData.append('fee_amount_payable', application.value.fee_amount_payable);
  formData.append('application_courses_json', JSON.stringify(application.value.application_courses || []));
  for (const docTypeId in application.value.checklistDocumentUploads) {
    if (application.value.checklistDocumentUploads[docTypeId] instanceof File) {
      formData.append(`document_file_type_${docTypeId}`, application.value.checklistDocumentUploads[docTypeId]);
    }
  }
  if (application.value.payment_receipt_document instanceof File) {
    formData.append('payment_receipt_document', application.value.payment_receipt_document);
  }
  return formData;
};

const displayServerErrors = (errorData) => {
  const newErrors = {};
  if (typeof errorData === 'object' && errorData !== null) {
    for (const key in errorData) {
      const isFormField = Object.prototype.hasOwnProperty.call(application.value, key) ||
                          key.startsWith('document_file_type_') ||
                          key === 'application_courses_json';
      if (isFormField) {
        newErrors[key] = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
      } else if (key === 'non_field_errors' || key === 'detail') {
        newErrors.general = (newErrors.general ? newErrors.general + " " : "") + (Array.isArray(errorData[key]) ? errorData[key].join(' ') : errorData[key]);
      } else {
        newErrors[key] = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
      }
    }
    if (errorData.application_courses_json && Array.isArray(errorData.application_courses_json)) {
      errorData.application_courses_json.forEach((courseError, index) => {
        if (courseError && typeof courseError === 'object') {
          for (const field in courseError) {
            newErrors[`application_courses_json.${index}.${field}`] = courseError[field];
          }
        }
      });
    }
  } else if (typeof errorData === 'string') {
    newErrors.general = errorData;
  } else {
    newErrors.general = 'An unexpected error occurred during processing.';
  }
  errors.value = newErrors;
};

const saveDraft = async () => {
  if (!application.value.institute_profile) {
    toast.error("Institute profile is required to save a draft.");
    return;
  }
  isSubmitting.value = true;
  isSavingDraft.value = true;
  errors.value = {};
  const formData = prepareApplicationFormData();
  try {
    let response;
    if (application.value.id) response = await apiService.patchAccreditationApplication(application.value.id, formData);
    else response = await apiService.createAccreditationApplication(formData);
    await loadExistingApplication(response.data.id);
    toast.success('Application draft saved successfully!');
  } catch (error) {
    console.error("Error saving draft:", error.response?.data || error);
    displayServerErrors(error.response?.data || { general: 'Failed to save draft. Please check the form for errors and try again.' });
    toast.error('Could not save draft. Please check the form for error messages.');
  } finally {
    isSubmitting.value = false;
    isSavingDraft.value = false;
  }
};

const initiatePayment = (applicationData) => {
  if (applicationData) {
    selectedApplicationForPayment.value = applicationData;
    if (paymentModalRef.value) {
      paymentModalRef.value.openModal();
      showPaymentModal.value = true;
    } else {
      console.error('Payment modal reference is not available.');
      toast.error('Payment modal could not be opened.');
    }
  } else {
    toast.error('No application selected for payment.');
  }
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedApplicationForPayment.value = null;
};

const submitApplicationAfterPayment = async (applicationId) => {
  try {
    const paymentDataPayload = {};
    const finalSubmitResponse = await apiService.submitInitialApplication(applicationId, paymentDataPayload);
    await loadExistingApplication(finalSubmitResponse.data.id);
    toast.success(`Application submitted successfully! Status: ${application.value.status_display}.`);
  } catch (error) {
    console.error("Error during final application submission:", error.response?.data || error);
    displayServerErrors(error.response?.data || { general: 'An error occurred during final submission.' });
    toast.error(errors.value.general || 'Failed to complete submission process. Please check any error messages.');
  }
};

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedApplicationForPayment.value) {
    toast.error('No application selected for payment.');
    isSubmitting.value = false;
    isProcessingSubmit.value = false;
    return;
  }
  const user = authStore.user;
  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    toast.error('Missing user information. Please log in again or update your profile.');
    isSubmitting.value = false;
    isProcessingSubmit.value = false;
    return;
  }

  isSubmitting.value = true;
  const paymentId = paymentData.paymentHash;
  const applicationForPayment = selectedApplicationForPayment.value;

  try {
    const paymentInitiationFormData = new FormData();
    paymentInitiationFormData.append('refNo', paymentId);
    paymentInitiationFormData.append('serviceCode', '100194');
    paymentInitiationFormData.append('taxPayerName', user.cid);
    paymentInitiationFormData.append('taxPayerNo', user.cid);
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
    paymentInitiationFormData.append('totalPayableAmount', application.fee_amount_payable || 100);
    paymentInitiationFormData.append('description', 'Accreditation Institutions Fee');
    paymentInitiationFormData.append('mobileNo', user.contact_number);
    paymentInitiationFormData.append('payerEmail', user.email);
    paymentInitiationFormData.append('user', user.id);
    paymentInitiationFormData.append('payableAmount', application.fee_amount_payable || 100);
    paymentInitiationFormData.append('application_no', applicationForPayment.id);
    paymentInitiationFormData.append('app_type', 'accreditation_institutions_fee');

    await apiService.makePayment(paymentInitiationFormData);

    const updateFormData = new FormData();
    updateFormData.append('payment_id_gateway', paymentId);
    updateFormData.append('status', 'pending_payment');

    await apiService.patchAccreditationApplication(applicationForPayment.id, updateFormData);

    application.value.payment_id_gateway = paymentId;
    application.value.status = 'pending_payment';
    application.value.status_display = 'Pending Initial Application Fee Payment';

    toast.success(`Payment initiated (Ref: ${paymentId.substring(0, 8)}...). Submitting application...`);

    await loadExistingApplication(applicationForPayment.id);

    // Proceed with final submission
    await submitApplicationAfterPayment(applicationForPayment.id);

    // Close the payment modal
    closePaymentModal();
  } catch (error) {
    console.error('Payment handling error:', error.response || error.request || error);
    let errorMsg = 'An error occurred while processing the payment confirmation.';
    if (error.response?.data) {
      const detail = error.response.data.detail || JSON.stringify(error.response.data);
      errorMsg = `Payment API Error: ${detail}`;
    } else if (error.request) {
      errorMsg = 'Network Error: Could not reach the server to confirm payment.';
    }
    toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if the issue persists.`);
    application.value.status = 'draft_initial';
    closePaymentModal();
  } finally {
    isSubmitting.value = false;
    isProcessingSubmit.value = false;
  }
};

const handleFinalSubmitApplication = async () => {
  errors.value = {};
  let isValid = true;

  if (!application.value.institute_profile || !application.value.application_schedule) {
    errors.value.general = "Institute profile and an active application schedule are required.";
    isValid = false;
  }

  if (!application.value.accreditation_cycle) {
    errors.value.accreditation_cycle = ['Please select the accreditation cycle.'];
    isValid = false;
  }
  if (application.value.accreditation_cycle === 'other' && !application.value.accreditation_cycle_other_specify) {
    errors.value.accreditation_cycle_other_specify = ['Please specify the other cycle if selected.'];
    isValid = false;
  }

  checklistDocumentTypes.value.forEach(docType => {
    if (docType.is_required && !application.value.checklistDocumentUploads[docType.id] && !getExistingDocumentUrl(docType.id)) {
      errors.value[`document_file_type_${docType.id}`] = [`${docType.name} is a required document.`];
      isValid = false;
    }
  });

  if (!application.value.application_courses || application.value.application_courses.length === 0) {
    errors.value.application_courses_json = ['Please add at least one course/programme.'];
    isValid = false;
  } else {
    application.value.application_courses.forEach((course, index) => {
      let courseHasError = false;
      if (!course.course_programme_title) {
        errors.value[`application_courses_json.${index}.course_programme_title`] = ['Title is required.'];
        courseHasError = true;
      }
      if (!course.level_as_per_bqf) {
        errors.value[`application_courses_json.${index}.level_as_per_bqf`] = ['Level is required.'];
        courseHasError = true;
      }
      if (course.current_student_number === null || course.current_student_number < 0) {
        errors.value[`application_courses_json.${index}.current_student_number`] = ['Student number is required and must be 0 or more.'];
        courseHasError = true;
      }
      if (courseHasError) isValid = false;
    });
  }

  if (!isValid) {
    toast.error("Please correct the errors indicated on the form before submitting.");
    const firstErrorKey = Object.keys(errors.value)[0];
    if (firstErrorKey) {
      const errorElement = document.querySelector(`[id*="${firstErrorKey}"], [for*="${firstErrorKey}"]`);
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  if (!confirm("Are you sure you want to submit this application? You will be prompted to make a payment.")) {
    return;
  }

  isSubmitting.value = true;
  isProcessingSubmit.value = true;
  const formData = prepareApplicationFormData();
  try {
    let appResponse;
    if (application.value.id && (application.value.status === 'draft_initial' || !application.value.status)) {
      appResponse = await apiService.patchAccreditationApplication(application.value.id, formData);
    } else if (!application.value.id) {
      appResponse = await apiService.createAccreditationApplication(formData);
    } else {
      toast.error(`Application cannot be submitted in its current state (${application.value.status_display}). Please save as draft or check application status.`);
      isSubmitting.value = false;
      isProcessingSubmit.value = false;
      return;
    }
    const currentApplicationId = appResponse.data.id;
    await loadExistingApplication(currentApplicationId);
    initiatePayment(appResponse.data);
  } catch (error) {
    console.error("Error during application submission:", error.response?.data || error);
    displayServerErrors(error.response?.data || { general: 'An error occurred during submission.' });
    toast.error(errors.value.general || 'Failed to prepare application for payment. Please check any error messages.');
    isSubmitting.value = false;
    isProcessingSubmit.value = false;
  }
};

// Lifecycle Hook
onMounted(async () => {
  pageLoading.value = true;
  await fetchInitialDataMasters();
  if (props.applicationIdProp) {
    await loadExistingApplication(props.applicationIdProp);
  } else {
    await initializeNewApplicationFromProfile();
  }
  pageLoading.value = false;
});
</script>

<style scoped>
.fill-current {
  fill: currentColor;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

input[type="file"] {
  /* Tailwind handles most styling */
}

fieldset > legend {
  float: left;
  width: auto;
  padding: 0 0.5rem;
  margin-left: -0.5rem;
  font-size: 1em;
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
}
</style>
