<template>
  <div class="initial-application-form mx-auto my-10 p-6 bg-gray-50 rounded-lg shadow-xl">
    <h2 class="text-3xl font-extrabold text-center text-blue-700 mb-6">Initial Accreditation Application</h2>
    <p class="text-center text-gray-600 mb-8">Please complete all required sections as per Annexure IV.</p>

    <!-- PAYMENT INTEGRATION: PaymentModal -->
    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      :closeOnSuccess="true"
      @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose"
    />

    <div v-if="pageLoading" class="text-center py-12 bg-white rounded-lg shadow-md">
      <div class="animate-spin inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-4 text-xl text-gray-700">Loading application data and configurations...</p>
    </div>

    <div v-if="!pageLoading && errors.general" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline ml-2">{{ errors.general }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" @click="errors.general = null">
        <X class="h-6 w-6 text-red-500" />
      </span>
    </div>
    <div v-if="!pageLoading && errors.profile" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Heads Up!</strong>
      <span class="block sm:inline ml-2">{{ errors.profile }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" @click="errors.profile = null">
        <X class="h-6 w-6 text-yellow-500" />
      </span>
    </div>

    <div v-if="!pageLoading && !activeSchedule.id && !application.id && !errors.general && !errors.profile" class="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-8 rounded-lg shadow-md text-center mb-10">
      <Info class="inline-block w-10 h-10 text-blue-500 mb-4" />
      <h4 class="text-2xl font-semibold mb-3">No Active Application Schedule</h4>
      <p class="text-lg">There is currently no active accreditation application schedule. Please check back later or contact HEQC.</p>
    </div>

    <div v-if="!pageLoading && (activeSchedule.id || application.id)" class="space-y-8">

      <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
        <div class="flex items-center text-blue-700 mb-4">
          <Info class="w-6 h-6 mr-2" />
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
            <span :class="['px-3 py-1.5 rounded-full text-sm font-semibold inline-flex items-center', statusBadgeClass(application.status)]">
              <component :is="statusIcon(application.status)" class="w-4 h-4 mr-2" />
              {{ application.status_display || application.status }}
            </span>
          </div>
          <div class="col-span-full" v-if="application.id && application.isar_submission_deadline">
            <label class="block text-sm font-medium text-gray-600 mb-1">ISAR Submission Deadline:</label>
            <span class="px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 inline-flex items-center">
              <Calendar class="w-4 h-4 mr-2" />
              {{ application.isar_submission_deadline }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="isFormLocked" class="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-8 rounded-lg shadow-md text-center">
        <CheckCircle2 class="mx-auto h-12 w-12 text-blue-400" />
        <h3 class="mt-4 text-2xl font-semibold text-blue-900">Application Submitted</h3>
        <p class="mt-2 text-base text-gray-700">
          This application has been submitted and is currently in the <strong>'{{ application.status_display }}'</strong> stage.
        </p>
        <p class="mt-6 text-sm text-gray-600">
          The form is now read-only and no further changes can be made. Please contact HEQC for any queries.
        </p>
      </div>

      <div v-else class="space-y-8">

        <fieldset class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <legend class="text-base font-semibold text-gray-800 px-3 py-1.5 bg-gray-100 rounded-full inline-flex items-center -ml-3 -mt-10 mb-4 shadow-sm">
            <ClipboardList class="w-5 h-5 mr-2 text-gray-500" />
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
              <AlertTriangle class="w-4 h-4 mr-1" />
              {{ errors.accreditation_cycle.join ? errors.accreditation_cycle.join(', ') : errors.accreditation_cycle }}
            </p>
          </div>
          <div v-if="application.accreditation_cycle === 'other'" class="form-group mt-4">
            <label for="accreditation_cycle_other_specify" class="block text-sm font-medium text-gray-700">Specify Other Cycle <span class="text-red-500">*</span>:</label>
            <input type="text" id="accreditation_cycle_other_specify" v-model="application.accreditation_cycle_other_specify"
                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <p v-if="errors.accreditation_cycle_other_specify" class="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle class="w-4 h-4 mr-1" />
              {{ errors.accreditation_cycle_other_specify.join ? errors.accreditation_cycle_other_specify.join(', ') : errors.accreditation_cycle_other_specify }}
            </p>
          </div>
        </fieldset>

        <fieldset class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <legend class="text-base font-semibold text-gray-800 px-3 py-1.5 bg-gray-100 rounded-full inline-flex items-center -ml-3 -mt-10 mb-4 shadow-sm">
            <FileCheck class="w-5 h-5 mr-2 text-gray-500" />
            Part I: Document Checklist
          </legend>
          <p class="text-gray-600 mb-6">Please upload all required supporting documents. Files should be clear and legible.</p>
          <div v-if="loadingChecklistTypes" class="text-center py-4 text-gray-600">
            <Loader2 class="animate-spin inline-block w-5 h-5 mr-2" />
            Loading document types...
          </div>
          <div v-if="checklistDocumentTypes.length === 0 && !loadingChecklistTypes" class="bg-blue-50 text-blue-700 px-4 py-3 rounded relative text-center">
            <Info class="w-5 h-5 inline-block mr-2" /> No checklist document types found for "application" category. Please ensure they are configured or contact support.
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
                <FileText class="w-4 h-4 mr-2" /> {{ getFileName(getExistingDocumentUrl(docType.id)) }}
              </a>
            </div>
            <p v-if="errors[`document_file_type_${docType.id}`]" class="text-red-600 text-sm mt-1 flex items-center">
              <AlertTriangle class="w-4 h-4 mr-1" />
              {{ errors[`document_file_type_${docType.id}`].join ? errors[`document_file_type_${docType.id}`].join(', ') : errors[`document_file_type_${docType.id}`] }}
            </p>
          </div>
        </fieldset>

        <fieldset class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <legend class="text-base font-semibold text-gray-800 px-3 py-1.5 bg-gray-100 rounded-full inline-flex items-center -ml-3 -mt-10 mb-4 shadow-sm">
            <BookOpen class="w-5 h-5 mr-2 text-gray-500" />
            Part II: Course/Programme Details
          </legend>
          <p class="text-gray-600 mb-6">Add details for each course/programme for which accreditation is being sought.</p>
          <div v-if="application.application_courses.length === 0" class="bg-blue-50 text-blue-700 px-4 py-6 rounded-lg text-center mb-6">
            <Lightbulb class="w-5 h-5 inline-block mr-2" /> Click "Add New Course/Programme" to begin.
          </div>
          <div v-for="(course, index) in application.application_courses" :key="course.id || `new-${index}`" class="course-entry bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200 mb-6">
            <div class="flex justify-between items-center mb-4 pb-2 border-b border-blue-100">
              <h5 class="text-lg font-semibold text-blue-700">Course/Programme {{ index + 1 }}</h5>
              <button type="button" @click="removeCourseProgramme(index)"
                      class="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150 inline-flex items-center">
                <Trash2 class="w-4 h-4 mr-1" /> Remove
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div class="col-span-full">
                <label :for="'course_title_' + index" class="block text-sm font-medium text-gray-700">Course/Programme Title <span class="text-red-500">*</span>:</label>
                <input type="text" :id="'course_title_' + index" v-model="course.course_programme_title" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <p v-if="errors[`application_courses_json.${index}.course_programme_title`]" class="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle class="w-4 h-4 mr-1" />
                  {{ errors[`application_courses_json.${index}.course_programme_title`].join(', ') }}
                </p>
              </div>
              <div>
                <label :for="'awarding_body_' + index" class="block text-sm font-medium text-gray-700">Awarding Body:</label>
                <input type="text" :id="'awarding_body_' + index" v-model="course.awarding_body"
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <p v-if="errors[`application_courses_json.${index}.awarding_body`]" class="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle class="w-4 h-4 mr-1" />
                  {{ errors[`application_courses_json.${index}.awarding_body`].join(', ') }}
                </p>
              </div>
              <div>
                <label :for="'level_bqf_' + index" class="block text-sm font-medium text-gray-700">Level(S) as per BQF <span class="text-red-500">*</span>:</label>
                <input type="text" :id="'level_bqf_' + index" v-model="course.level_as_per_bqf" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <p v-if="errors[`application_courses_json.${index}.level_as_per_bqf`]" class="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle class="w-4 h-4 mr-1" />
                  {{ errors[`application_courses_json.${index}.level_as_per_bqf`].join(', ') }}
                </p>
              </div>
              <div>
                <label :for="'student_no_' + index" class="block text-sm font-medium text-gray-700">Current Student Number <span class="text-red-500">*</span>:</label>
                <input type="number" :id="'student_no_' + index" v-model.number="course.current_student_number" min="0" required
                       class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <p v-if="errors[`application_courses_json.${index}.current_student_number`]" class="text-red-600 text-sm mt-1 flex items-center">
                  <AlertTriangle class="w-4 h-4 mr-1" />
                  {{ errors[`application_courses_json.${index}.current_student_number`].join(', ') }}
                </p>
              </div>
            </div>
          </div>
          <button type="button" @click="addCourseProgramme"
                  class="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150 inline-flex items-center justify-center">
            <Plus class="w-5 h-5 mr-2" /> Add New Course/Programme
          </button>
          <p v-if="errors.application_courses_json && (typeof errors.application_courses_json === 'string' || Array.isArray(errors.application_courses_json))" class="text-red-600 text-sm mt-3 flex items-center">
            <AlertTriangle class="w-4 h-4 mr-1" />
            {{ Array.isArray(errors.application_courses_json) ? errors.application_courses_json.join(', ') : errors.application_courses_json }}
          </p>
        </fieldset>

        <div class="sticky bottom-0 bg-gray-100 px-6 py-4 rounded-b-lg shadow-inner border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 z-10">
          <button
            type="button"
            @click="saveDraft"
            :disabled="isSubmitting"
            class="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isSavingDraft" class="animate-spin mr-2 w-5 h-5" />
            <Save v-else class="mr-2 w-5 h-5" />
            {{ application.id ? 'Update Draft' : 'Save Draft' }}
          </button>
          <button
            type="button"
            @click="handleFinalSubmitApplication"
            :disabled="isSubmitting"
            class="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isSubmitting" class="animate-spin mr-2 w-5 h-5" />
            <CheckCircle v-else class="mr-2 w-5 h-5" />
            {{ isSubmitting ? 'Processing...' : 'Submit Application' }}
          </button>
        </div>
        <p v-if="isSubmitting" class="text-center text-gray-500 text-sm mt-3 flex items-center justify-center">
          <Loader2 class="animate-spin mr-2 w-5 h-5" /> Processing your request, please wait...
        </p>
      </div>
    </div>


      <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" @click="handleCancelSubmission">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all" @click.stop>
        <div class="text-center">
          <HelpCircle class="mx-auto h-12 w-12 text-blue-500" />
          <h3 class="mt-2 text-lg font-semibold text-gray-900">Confirm Submission</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-600">
              Are you sure you want to submit this application? You will be prompted for payment.
            </p>
          </div>
        </div>
        <div class="mt-5 sm:mt-6 flex justify-center gap-4">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            @click="handleCancelSubmission"
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm"
            @click="handleConfirmSubmission"
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';
import {
  Info,
  X,
  CheckCircle2,
  ClipboardList,
  AlertTriangle,
  FileCheck,
  Loader2,
  FileText,
  BookOpen,
  Lightbulb,
  Trash2,
  Plus,
  Save,
  CheckCircle,
  HelpCircle,
  Calendar,
  Pencil,
  CreditCard,
  Clock,
  XCircle,
  Check,
} from 'lucide-vue-next';

const toast = useToast();
const authStore = useAuthStore();

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

const application = ref(initialApplicationData());
const activeSchedule = ref({});
const applicationFee = ref({});
const checklistDocumentTypes = ref([]);
const pageLoading = ref(true);
const loadingChecklistTypes = ref(false);
const isSubmitting = ref(false);
const isSavingDraft = ref(false);
const errors = ref({});
const paymentModal = ref(null);
const showConfirmationModal = ref(false);
const submissionInitiated = ref(false);

const props = defineProps({
  applicationIdProp: {
    type: [String, Number],
    default: null,
  },
});

const isFormLocked = computed(() => {
  const editableStatuses = ['draft_initial', null, undefined];
  return application.value.id && !editableStatuses.includes(application.value.status);
});

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

const statusIcon = (statusKey) => {
  const mapping = {
    'draft_initial': Pencil,
    'pending_payment': CreditCard,
    'initial_app_submitted_heqc_review': Clock,
    'initial_app_rejected': XCircle,
    'initial_app_approved_awaiting_isar': Check,
    'isar_submitted_heqc_review': Calendar,
  };
  return mapping[statusKey] || Info;
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

    if (scheduleRes?.data) {
      if (scheduleRes.data.id) {
        activeSchedule.value = scheduleRes.data;
      } else if (Array.isArray(scheduleRes.data) && scheduleRes.data.length > 0 && scheduleRes.data[0].id) {
        activeSchedule.value = scheduleRes.data[0];
      }
    }

    if (docTypesRes?.data) {
      checklistDocumentTypes.value = docTypesRes.data.results || docTypesRes.data || [];
    }

    if (feeRes?.data) {
      if (feeRes.data.results && Array.isArray(feeRes.data.results) && feeRes.data.results.length > 0) {
        applicationFee.value = feeRes.data.results[0];
      } else if (feeRes.data.id) {
        applicationFee.value = feeRes.data;
      }
    }
  } catch (error) {
    console.error("Error fetching initial master data:", error.response?.data || error.message || error);
    errors.value.general = "Could not load required configurations. Please try reloading or contact support.";
    toast.error(errors.value.general);
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
      toast.warning(errors.value.profile);
    }

    if (activeSchedule.value?.id) {
      application.value.application_schedule = activeSchedule.value.id;
      application.value.application_schedule_details = { ...activeSchedule.value };
    }

    if (applicationFee.value?.id) {
      application.value.application_fee_category = applicationFee.value.id;
      application.value.fee_amount_payable = 1000; // Set to 1000 for display consistency
      application.value.application_fee_category_details = { ...applicationFee.value };
    }
  } catch (error) {
    console.error("Error initializing new application from profile:", error.response?.data || error.message || error);
    errors.value.general = (errors.value.general ? errors.value.general + " " : "") + "Could not initialize application with profile data. " + (error.response?.data?.detail || '');
    toast.error("Could not initialize application with your profile data.");
  }
};

const loadExistingApplication = async (id) => {
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
    // Ensure fee amount is set for existing applications for display
    if (!application.value.fee_amount_payable) {
      application.value.fee_amount_payable = 1000;
    }
  } catch (error) {
    console.error(`Error loading application ${id}:`, error.response?.data || error);
    errors.value.general = "Failed to load existing application data. " + (error.response?.data?.detail || '');
    toast.error("Failed to load your application data.");
  }
};

const getFileName = (url) => {
  if (!url) return '';
  try { return decodeURIComponent(new URL(url).pathname.split('/').pop()); }
  catch (e) {
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
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      errors.value[`document_file_type_${docTypeId}`] = ['File is too large. Maximum size is 5MB.'];
      event.target.value = ''; // Reset file input
      return;
    }
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

  if (application.value.payment_id_gateway) formData.append('payment_id_gateway', application.value.payment_id_gateway);
  if (application.value.status) formData.append('status', application.value.status);

  formData.append('application_courses_json', JSON.stringify(application.value.application_courses || []));
  for (const docTypeId in application.value.checklistDocumentUploads) {
    if (application.value.checklistDocumentUploads[docTypeId] instanceof File) {
      formData.append(`document_file_type_${docTypeId}`, application.value.checklistDocumentUploads[docTypeId]);
    }
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

  application.value.status = 'draft_initial';
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

const onPaymentCompleted = (paymentData) => {
  // We do NOT explicitly call paymentModal.value.closeModal() here
  // because the modal itself will close due to the closeOnSuccess prop.

  submissionInitiated.value = true;
  application.value.is_payment_complete = false;
  application.value.payment_id_gateway = paymentData.paymentHash;
  application.value.status = 'pending_payment';
  handleSubmitActual();
};

const onPaymentModalClose = () => {
  console.log('Payment modal was closed.');
  if (!submissionInitiated.value) {
    isSubmitting.value = false;
  }
};

// ==========================================
// UPDATED SUBMISSION HANDLER
// ==========================================
const handleSubmitActual = async () => {
  isSubmitting.value = true;
  errors.value = {};
  let redirectUrl = null;

  // 1. OPEN NEW WINDOW IMMEDIATELY
  const paymentWindow = window.open('', '_blank');

  if (paymentWindow) {
      paymentWindow.document.write(`
        <html>
          <head><title>Processing Payment...</title></head>
          <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #f9fafb;">
            <h2 style="color: #2563eb;">Connecting to BIRMS...</h2>
            <p>Please wait while we redirect you to the secure payment gateway.</p>
          </body>
        </html>
      `);
  } else {
      toast.error("Popup blocker prevented payment.");
      isSubmitting.value = false;
      return;
  }

  const user = authStore.user;
  const paymentGatewayId = application.value.payment_id_gateway;

  try {
    // Step 1: Save application state
    const applicationFormData = prepareApplicationFormData();
    applicationFormData.set('status', 'pending_payment');

    let appResponse;
    if (application.value.id) {
      appResponse = await apiService.patchAccreditationApplication(application.value.id, applicationFormData);
    } else {
      appResponse = await apiService.createAccreditationApplication(applicationFormData);
    }

    // RELOAD to ensure we have the latest ID
    await loadExistingApplication(appResponse.data.id);
    const appId = application.value.id; // Get the ID (e.g., 62)

    // Step 2: Prepare Payment Payload
    const feeAmount = 1000.0;
    const paymentInitiationFormData = new FormData();

    // The Transaction Reference
    paymentInitiationFormData.append('refNo', paymentGatewayId);

    // --- THE FIX IS HERE ---
    // We send the Database ID (62) so the backend can find the record later
    paymentInitiationFormData.append('application_no', appId);
    // -----------------------

    paymentInitiationFormData.append('serviceCode', '102801');
    paymentInitiationFormData.append('taxPayerName', application.value.institute_profile_name_display);
    paymentInitiationFormData.append('taxPayerNo', user.cid);
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
    paymentInitiationFormData.append('totalPayableAmount', feeAmount.toFixed(2));
    paymentInitiationFormData.append('payableAmount', feeAmount.toFixed(2));
    paymentInitiationFormData.append('description', 'Accreditation Institutions Fee');
    paymentInitiationFormData.append('mobileNo', user.contact_number);
    paymentInitiationFormData.append('payerEmail', user.email);
    paymentInitiationFormData.append('user_id', user.id); // Note: Backend usually expects user_id, check serializer
    paymentInitiationFormData.append('app_type', 'accreditation_institutions_fee');

    // Ensure this points to the Payment Gateway ViewSet we fixed, NOT the one in accreditations
    const backendCallbackUrl = "http://localhost:8000/api/payment_gateway/payments/callback/";
    paymentInitiationFormData.append('returnUrl', backendCallbackUrl);

    // Call API
    const paymentResponse = await apiService.makePayment(paymentInitiationFormData);

    if (paymentResponse.data?.content?.redirectUrl) {
      redirectUrl = paymentResponse.data.content.redirectUrl;
      // Redirect
      if (paymentWindow) paymentWindow.location.href = redirectUrl;
    } else {
      throw new Error('Redirect URL not received.');
    }

  } catch (error) {
    if (paymentWindow) paymentWindow.close();
    console.error("Submission error:", error);
    toast.error('Failed to process submission.');
  } finally {
    isSubmitting.value = false;
    submissionInitiated.value = false;
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

  showConfirmationModal.value = true;
};

const handleConfirmSubmission = () => {
  showConfirmationModal.value = false;
  if (paymentModal.value) {
    isSubmitting.value = true;
    paymentModal.value.openModal();
  } else {
    toast.error("Payment modal is not available. Please refresh the page.");
  }
};

const handleCancelSubmission = () => {
  showConfirmationModal.value = false;
  toast.info("Submission cancelled.");
};

onMounted(async () => {
  pageLoading.value = true;
  try {
    await fetchInitialDataMasters();

    if (props.applicationIdProp) {
      await loadExistingApplication(props.applicationIdProp);
      return;
    }

    const user = authStore.user;
    if (user && user.cid) {
      const response = await apiService.getAccreditationApplications({ applicant_user__cid: user.cid });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const existingApplication = response.data.results[0];
        await loadExistingApplication(existingApplication.id);
      } else {
        await initializeNewApplicationFromProfile();
      }
    } else {
      errors.value.general = "Could not identify the current user. Please log in again.";
      toast.error(errors.value.general);
      await initializeNewApplicationFromProfile();
    }
  } catch (error) {
    console.error("Error during component mount:", error.response?.data || error);
    errors.value.general = "An error occurred while loading the application page. Please refresh.";
    toast.error(errors.value.general);
  } finally {
    pageLoading.value = false;
  }
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