<template>
  <div class="initial-application-form container mt-4">
    <h3 class="mb-4">Initial Accreditation Application</h3>

    <div v-if="pageLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading application data and configurations...</p>
    </div>

    <!-- General errors displayed at the top -->
    <div v-if="!pageLoading && errors.general" class="alert alert-danger">{{ errors.general }}</div>
    <div v-if="!pageLoading && errors.profile" class="alert alert-warning">{{ errors.profile }}</div>


    <div v-if="!pageLoading && !activeSchedule.id && !application.id && !errors.general" class="alert alert-warning">
      There is currently no active accreditation application schedule. Please check back later or contact HEQC.
    </div>

    <form v-if="!pageLoading && (activeSchedule.id || application.id)" @submit.prevent="handleFinalSubmitApplication">
      <!-- Institute and Schedule Info -->
      <div class="card mb-3">
        <div class="card-header fw-bold">Application Overview</div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Institute Name:</label>
              <p class="form-control-plaintext ps-0">{{ application.institute_profile_name_display || 'Loading...' }}</p>
              <input type="hidden" v-model="application.institute_profile" />
            </div>
            <div class="col-md-6 mb-3" v-if="application.application_schedule_details">
              <label class="form-label">Application Schedule:</label>
              <p class="form-control-plaintext ps-0">
                {{ application.application_schedule_details.schedule_name }}
                ({{ application.application_schedule_details.from_date }} to {{ application.application_schedule_details.end_date }})
              </p>
            </div>
             <div class="col-md-6 mb-3" v-if="application.application_fee_category_details && application.fee_amount_payable !== null">
              <label class="form-label">Application Fee:</label>
              <p class="form-control-plaintext ps-0">
                Nu. {{ application.fee_amount_payable }} ({{ application.application_fee_category_details.fee_category }})
              </p>
            </div>
            <div class="col-12 mb-2" v-if="application.id">
              <label class="form-label d-block">Application Status:</label>
              <span :class="['badge fs-6', statusBadgeClass(application.status)]">
                {{ application.status_display || application.status }}
              </span>
            </div>
             <div class="col-12" v-if="application.id && application.isar_submission_deadline">
                <label class="form-label d-block">ISAR Submission Deadline (if initial app approved):</label>
                <span class="text-info">{{ application.isar_submission_deadline }}</span>
             </div>
          </div>
        </div>
      </div>

      <!-- Prerequisite for Accreditation -->
      <fieldset class="mb-3 p-3 border rounded">
        <legend class="w-auto px-2 h6">Prerequisite for Accreditation</legend>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="prereq_first_cycle" value="First Cycle" v-model="application.prerequisites_selection">
          <label class="form-check-label" for="prereq_first_cycle">First Cycle</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="prereq_second_cycle" value="Second Cycle" v-model="application.prerequisites_selection">
          <label class="form-check-label" for="prereq_second_cycle">Second Cycle</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="prereq_third_cycle" value="Third Cycle" v-model="application.prerequisites_selection">
          <label class="form-check-label" for="prereq_third_cycle">Third Cycle</label>
        </div>
        <small v-if="errors.prerequisites_confirmed" class="text-danger d-block mt-1">{{ errors.prerequisites_confirmed.join ? errors.prerequisites_confirmed.join(', ') : errors.prerequisites_confirmed }}</small>
      </fieldset>

      <!-- Accreditation Cycle (Matches Model) -->
      <fieldset class="mb-3 p-3 border rounded">
        <legend class="w-auto px-2 h6">Accreditation Cycle Applying For</legend>
        <div class="form-group">
          <select class="form-select" v-model="application.accreditation_cycle" required>
            <option value="" disabled>-- Select Cycle --</option>
            <option value="first">First Cycle</option>
            <option value="second">Second Cycle</option>
            <option value="third">Third Cycle</option>
            <option value="other">Other Cycle</option>
          </select>
          <small v-if="errors.accreditation_cycle" class="text-danger d-block mt-1">{{ errors.accreditation_cycle.join ? errors.accreditation_cycle.join(', ') : errors.accreditation_cycle }}</small>
        </div>
        <div v-if="application.accreditation_cycle === 'other'" class="form-group mt-2">
          <label for="accreditation_cycle_other_specify" class="form-label">Specify Other Cycle:</label>
          <input type="text" class="form-control" id="accreditation_cycle_other_specify" v-model="application.accreditation_cycle_other_specify">
          <small v-if="errors.accreditation_cycle_other_specify" class="text-danger d-block mt-1">{{ errors.accreditation_cycle_other_specify.join ? errors.accreditation_cycle_other_specify.join(', ') : errors.accreditation_cycle_other_specify }}</small>
        </div>
      </fieldset>

      <!-- Part 1: Checklist of Documents -->
      <fieldset class="mb-3 p-3 border rounded">
        <legend class="w-auto px-2 h6">Checklist of Documents to be Submitted</legend>
        <div v-if="loadingChecklistTypes" class="text-center">
            <div class="spinner-border spinner-border-sm text-muted" role="status"></div> Loading document types...
        </div>
        <div v-if="checklistDocumentTypes.length === 0 && !loadingChecklistTypes" class="alert alert-light">
            No specific checklist document types found for "application" category. Generic upload might be needed or configuration review.
        </div>
        <div v-for="docType in checklistDocumentTypes" :key="docType.id" class="form-group mb-3">
          <label :for="'doc_type_' + docType.id" class="form-label">{{ docType.name }}: <small class="text-muted">({{ docType.description || 'Upload required document' }})</small></label>
          <input type="file" class="form-control" :id="'doc_type_' + docType.id" @change="handleChecklistFileUpload($event, docType.id)">
          <div v-if="getExistingDocumentUrl(docType.id)" class="mt-1">
            Current File: <a :href="getExistingDocumentUrl(docType.id)" target="_blank" class="text-decoration-none">{{ getFileName(getExistingDocumentUrl(docType.id)) }}</a>
          </div>
          <small v-if="errors[`document_file_type_${docType.id}`]" class="text-danger d-block">{{ errors[`document_file_type_${docType.id}`].join ? errors[`document_file_type_${docType.id}`].join(', ') : errors[`document_file_type_${docType.id}`] }}</small>
        </div>
        <!-- For 'Receipt of accreditation fee' specifically if not in DocumentTypes -->
        <div class="form-group mb-3" v-if="!checklistDocumentTypes.find(dt => dt.name && dt.name.toLowerCase().includes('fee receipt'))">
            <label for="payment_receipt_document_manual" class="form-label">Receipt of the Accreditation Fee (if paid offline/manually uploaded):</label>
            <input type="file" class="form-control" id="payment_receipt_document_manual" @change="handleFileUpload($event, 'payment_receipt_document')">
             <div v-if="application.payment_receipt_document_url" class="mt-1">
                Current Receipt: <a :href="application.payment_receipt_document_url" target="_blank">{{ getFileName(application.payment_receipt_document_url) }}</a>
            </div>
            <small v-if="errors.payment_receipt_document" class="text-danger d-block">{{ errors.payment_receipt_document.join ? errors.payment_receipt_document.join(', ') : errors.payment_receipt_document }}</small>
        </div>
      </fieldset>

      <!-- Part II: Course/Programme Details -->
      <fieldset class="mb-3 p-3 border rounded">
        <legend class="w-auto px-2 h6">Course/Programme Details</legend>
        <div v-for="(course, index) in application.application_courses" :key="course.id || `new-${index}`" class="course-entry border p-3 mb-2 bg-light rounded shadow-sm">
          <h6 class="mb-3 text-primary">Course/Programme {{ index + 1 }}</h6>
          <div class="row g-3">
            <div class="col-md-12 form-group">
              <label :for="'course_title_' + index" class="form-label">Course/Programme Title:</label>
              <input type="text" class="form-control" :id="'course_title_' + index" v-model="course.course_programme_title" required>
               <small v-if="errors[`application_courses_json.${index}.course_programme_title`]" class="text-danger d-block mt-1">{{ errors[`application_courses_json.${index}.course_programme_title`].join(', ') }}</small>
            </div>
            <div class="col-md-6 form-group">
              <label :for="'awarding_body_' + index" class="form-label">Awarding Body:</label>
              <input type="text" class="form-control" :id="'awarding_body_' + index" v-model="course.awarding_body">
              <small v-if="errors[`application_courses_json.${index}.awarding_body`]" class="text-danger d-block mt-1">{{ errors[`application_courses_json.${index}.awarding_body`].join(', ') }}</small>
            </div>
            <div class="col-md-6 form-group">
              <label :for="'level_bqf_' + index" class="form-label">Level(S) as per BQF:</label>
              <input type="text" class="form-control" :id="'level_bqf_' + index" v-model="course.level_as_per_bqf" required>
              <small v-if="errors[`application_courses_json.${index}.level_as_per_bqf`]" class="text-danger d-block mt-1">{{ errors[`application_courses_json.${index}.level_as_per_bqf`].join(', ') }}</small>
            </div>
            <div class="col-md-6 form-group">
              <label :for="'student_no_' + index" class="form-label">Current Student Number:</label>
              <input type="number" class="form-control" :id="'student_no_' + index" v-model.number="course.current_student_number" min="0" required>
              <small v-if="errors[`application_courses_json.${index}.current_student_number`]" class="text-danger d-block mt-1">{{ errors[`application_courses_json.${index}.current_student_number`].join(', ') }}</small>
            </div>
             <div class="col-md-12 text-end">
                <button type="button" class="btn btn-danger btn-sm" @click="removeCourseProgramme(index)">
                    <i class="bi bi-trash"></i> Remove Course
                </button>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-outline-primary mt-2" @click="addCourseProgramme">
            <i class="bi bi-plus-circle"></i> Add Course/Programme
        </button>
        <small v-if="errors.application_courses_json && typeof errors.application_courses_json === 'string'" class="text-danger d-block mt-2">{{ errors.application_courses_json }}</small>
        <small v-if="errors.application_courses && typeof errors.application_courses === 'string'" class="text-danger d-block mt-2">{{ errors.application_courses }}</small>
        <small v-if="Array.isArray(errors.application_courses_json)" class="text-danger d-block mt-2">{{ errors.application_courses_json.join(', ') }}</small>
        <small v-if="Array.isArray(errors.application_courses)" class="text-danger d-block mt-2">{{ errors.application_courses.join(', ') }}</small>

      </fieldset>

      <!-- Actions -->
      <div class="mt-4 d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="saveDraft"
          :disabled="isSubmitting || (application.status && !['draft_initial', null, undefined].includes(application.status))"
        >
          <span v-if="isSavingDraft" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <i v-else class="bi bi-save"></i>
          {{ application.id ? 'Update Draft' : 'Save Draft' }}
        </button>
        <button
          type="submit"
          class="btn btn-success"
          :disabled="isSubmitting || (application.status && !['draft_initial', null, undefined].includes(application.status))"
        >
          <span v-if="isProcessingSubmit" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <i v-else class="bi bi-check-circle"></i>
          Submit Application & Proceed to Payment
        </button>
      </div>
       <p v-if="isSubmitting" class="text-center text-primary mt-3">Processing your request...</p>
    </form>
  </div>
</template>

<script>
import apiService from '@/services/services'; // Ensure this path is correct

const initialApplicationData = () => ({
  id: null,
  institute_profile: null,
  institute_profile_name_display: '',
  application_schedule: null,
  application_schedule_details: null,
  prerequisites_selection: [],
  prerequisites_confirmed: '[]', // Backend expects JSON string
  accreditation_cycle: '',
  accreditation_cycle_other_specify: '',
  application_fee_category: null,
  application_fee_category_details: null,
  fee_amount_payable: null,
  is_payment_complete: false,
  payment_id_gateway: '',
  payment_receipt_document: null,
  payment_receipt_document_url: null,
  status: 'draft_initial', // Default for new applications
  status_display: 'Draft Initial Application',
  isar_submission_deadline: null,
  application_courses: [],
  checklistDocumentUploads: {}, // { docTypeId: File }
  existing_application_documents: [], // { id, document_type, document_file (URL) }
});

export default {
  name: 'InitialApplicationForm',
  props: {
    applicationIdProp: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      application: initialApplicationData(),
      activeSchedule: {},
      applicationFee: {},
      checklistDocumentTypes: [],
      pageLoading: true,
      loadingChecklistTypes: false,
      isSubmitting: false,
      isSavingDraft: false,
      isProcessingSubmit: false,
      errors: {}, // { fieldName: ['Error message 1'], general: 'General error' }
    };
  },
  async created() {
    this.pageLoading = true;
    await this.fetchInitialDataMasters();
    if (this.applicationIdProp) {
      await this.loadExistingApplication(this.applicationIdProp);
    } else {
      // Only initialize new application if there's an active schedule or if it's allowed without one initially
      // The form visibility logic already handles this, so initialize regardless for data structure.
      // This will also populate schedule and fee if available from fetchInitialDataMasters
      await this.initializeNewApplicationFromProfile();
    }
    this.pageLoading = false;
  },
  methods: {
    statusBadgeClass(statusKey) {
      const mapping = {
        'draft_initial': 'bg-secondary',
        'pending_payment': 'bg-warning text-dark',
        'initial_app_submitted_heqc_review': 'bg-info text-dark',
        'initial_app_rejected': 'bg-danger',
        'initial_app_approved_awaiting_isar': 'bg-success',
        'isar_submitted_heqc_review': 'bg-primary',
        // Add more based on your AccreditationApplication model STATUS_CHOICES
      };
      return mapping[statusKey] || 'bg-light text-dark';
    },

    async fetchInitialDataMasters() {
      this.loadingChecklistTypes = true;
      this.errors = {}; // Clear previous errors
      this.activeSchedule = {}; // Explicitly reset
      this.applicationFee = {}; // Explicitly reset
      this.checklistDocumentTypes = []; // Explicitly reset

      try {
        const promises = [
          apiService.getActiveApplicationSchedule(),
          apiService.getDocumentTypesByCategory('application'), // Ensure 'application' is correct
          apiService.getFeeDetailsByName('Initial Accreditation Fee'), // Ensure 'Initial Accreditation Fee' is correct
        ];
        const [scheduleRes, docTypesRes, feeRes] = await Promise.all(promises);

        console.log("API response for active schedule:", scheduleRes);
        if (scheduleRes && scheduleRes.data) {
            console.log("Data from active schedule API:", scheduleRes.data);
            if (scheduleRes.data.id) {
                this.activeSchedule = scheduleRes.data;
                console.log("Active schedule set:", this.activeSchedule);
            } else if (Array.isArray(scheduleRes.data) && scheduleRes.data.length > 0 && scheduleRes.data[0].id) {
                this.activeSchedule = scheduleRes.data[0];
                console.warn("Active schedule API returned array, using first item:", this.activeSchedule);
            } else {
                this.activeSchedule = {};
                console.warn("Active schedule data from API not in expected format or lacked ID. Data:", scheduleRes.data);
            }
        } else {
            this.activeSchedule = {};
            console.warn("No data from active schedule API or unexpected response. Full response:", scheduleRes);
        }

        if (docTypesRes && docTypesRes.data) {
          this.checklistDocumentTypes = docTypesRes.data.results || docTypesRes.data || [];
        }
        if (!this.checklistDocumentTypes.length) {
            console.warn("No checklist document types for 'application' category.");
        }

        if (feeRes && feeRes.data) {
          if (feeRes.data.results && Array.isArray(feeRes.data.results) && feeRes.data.results.length > 0) {
              this.applicationFee = feeRes.data.results[0];
          } else if (feeRes.data.id) {
              this.applicationFee = feeRes.data;
          }
        }
        if (!this.applicationFee.id) {
            console.warn("No 'Initial Accreditation Fee' found.");
        }

      } catch (error) {
        console.error("Error fetching initial master data:", error.response?.data || error.message || error);
        this.errors.general = "Could not load required configurations (schedule, document types, fee). Please try reloading or contact support.";
        this.activeSchedule = {};
        this.applicationFee = {};
        this.checklistDocumentTypes = [];
      } finally {
        this.loadingChecklistTypes = false;
      }
    },

    async initializeNewApplicationFromProfile() {
      try {
        const profileRes = await apiService.getMyInstituteProfile();
        if (profileRes.data && profileRes.data.id) {
          this.application.institute_profile = profileRes.data.id;
          this.application.institute_profile_name_display = profileRes.data.name;
        } else {
          this.errors.profile = profileRes.data?.message || "Your institute profile is not available or incomplete. Please set up your profile first.";
          // Potentially stop if profile is absolutely mandatory before anything else
          // return;
        }

        if (this.activeSchedule && this.activeSchedule.id) {
          this.application.application_schedule = this.activeSchedule.id;
          this.application.application_schedule_details = { ...this.activeSchedule };
        } else {
           console.warn("Initializing new app: No active schedule found/set from masters.");
        }

        if (this.applicationFee && this.applicationFee.id) {
          this.application.application_fee_category = this.applicationFee.id;
          this.application.fee_amount_payable = this.applicationFee.fee_amount;
          this.application.application_fee_category_details = { ...this.applicationFee };
        } else {
            console.warn("Initializing new app: Application fee master not found/set from masters.");
        }
      } catch (error) {
        console.error("Error initializing new application from profile:", error.response?.data || error.message || error);
        this.errors.general = (this.errors.general ? this.errors.general + " " : "") + "Could not initialize application with profile data. " + (error.response?.data?.detail || '');
      }
    },

    async loadExistingApplication(id) {
      this.isSubmitting = true; // Use as general loading indicator
      try {
        const response = await apiService.getAccreditationApplication(id);
        const appData = response.data;

        // Map all fields
        Object.keys(this.application).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(appData, key)) {
                if (key === 'prerequisites_confirmed') {
                    try {
                        this.application.prerequisites_selection = JSON.parse(appData.prerequisites_confirmed || '[]');
                        if (!Array.isArray(this.application.prerequisites_selection)) {
                            this.application.prerequisites_selection = [];
                        }
                    } catch (e) {
                        console.warn("Invalid prerequisites_confirmed JSON:", appData.prerequisites_confirmed, e);
                        this.application.prerequisites_selection = [];
                    }
                } else {
                    this.application[key] = appData[key];
                }
            }
        });
        // Ensure some fields are initialized if not present in appData, or handle specifics
        this.application.id = appData.id; // Ensure ID is primary
        this.application.institute_profile_name_display = appData.institute_profile_details?.name || this.application.institute_profile_name_display || 'N/A';
        this.application.application_schedule_details = appData.application_schedule_details || this.application.application_schedule_details;
        this.application.application_fee_category_details = appData.application_fee_category_details || this.application.application_fee_category_details;
        this.application.status_display = appData.status_display || appData.status;

        this.application.application_courses = appData.application_courses || [];
        this.application.existing_application_documents = appData.application_documents || [];
        this.application.checklistDocumentUploads = {}; // Reset for re-uploads

      } catch (error) {
        console.error(`Error loading application ${id}:`, error.response?.data || error);
        this.errors.general = "Failed to load existing application data. " + (error.response?.data?.detail || '');
      } finally {
        this.isSubmitting = false;
      }
    },

    getFileName(url) {
      if (!url) return '';
      try { return decodeURIComponent(new URL(url).pathname.split('/').pop()); }
      catch (e) {
        console.warn("Invalid URL for file name extraction:", url, e);
        const segments = url.split('/');
        return segments.pop() || segments.pop() || 'file'; // Try to get the last segment
      }
    },

    getExistingDocumentUrl(docTypeId) {
      const existingDoc = (this.application.existing_application_documents || []).find(
        doc => String(doc.document_type) === String(docTypeId) || String(doc.document_type_details?.id) === String(docTypeId)
      );
      return existingDoc ? existingDoc.document_file : null;
    },

    handleChecklistFileUpload(event, docTypeId) {
      const file = event.target.files[0];
      if (file) {
        this.application.checklistDocumentUploads = {
            ...this.application.checklistDocumentUploads,
            [docTypeId]: file
        };
        // Clear specific error for this file type if it existed
        if(this.errors[`document_file_type_${docTypeId}`]) {
            delete this.errors[`document_file_type_${docTypeId}`];
        }
      } else { // File removed
        // eslint-disable-next-line no-unused-vars
        const { [docTypeId]: _, ...rest } = this.application.checklistDocumentUploads;
        this.application.checklistDocumentUploads = rest;
      }
      // To allow re-selecting the same file if needed (some browsers clear value, some don't)
      // event.target.value = null; // Can cause issues, test thoroughly
    },

    handleFileUpload(event, fieldName) {
      const file = event.target.files[0];
      this.application[fieldName] = file || null;
      if (file && this.application[`${fieldName}_url`]) {
        this.application[`${fieldName}_url`] = null; // Clear existing URL
      }
      // Clear specific error for this file if it existed
      if(this.errors[fieldName]) {
          delete this.errors[fieldName];
      }
    },

    addCourseProgramme() {
      this.application.application_courses.push({
        course_programme_title: '',
        awarding_body: '',
        level_as_per_bqf: '',
        current_student_number: null,
      });
    },

    removeCourseProgramme(index) {
      this.application.application_courses.splice(index, 1);
    },

    prepareApplicationFormData() {
      const formData = new FormData();

      if(this.application.institute_profile) formData.append('institute_profile', this.application.institute_profile);
      if(this.application.application_schedule) formData.append('application_schedule', this.application.application_schedule);

      formData.append('prerequisites_confirmed', JSON.stringify(this.application.prerequisites_selection || []));

      formData.append('accreditation_cycle', this.application.accreditation_cycle);
      if (this.application.accreditation_cycle === 'other') {
        formData.append('accreditation_cycle_other_specify', this.application.accreditation_cycle_other_specify || '');
      } else {
         formData.append('accreditation_cycle_other_specify', ''); // Send empty if not 'other'
      }

      if (this.application.application_fee_category) {
        formData.append('application_fee_category', this.application.application_fee_category);
      }
      // fee_amount_payable might be set by backend or frontend
      if (this.application.fee_amount_payable !== null && this.application.fee_amount_payable !== undefined) {
          formData.append('fee_amount_payable', this.application.fee_amount_payable);
      }
      // For draft, status is often managed by backend, or explicitly set if needed
      // formData.append('status', this.application.status || 'draft_initial');


      formData.append('application_courses_json', JSON.stringify(this.application.application_courses || []));

      for (const docTypeId in this.application.checklistDocumentUploads) {
        if (this.application.checklistDocumentUploads[docTypeId] instanceof File) {
          formData.append(`document_file_type_${docTypeId}`, this.application.checklistDocumentUploads[docTypeId]);
        }
      }

      if (this.application.payment_receipt_document instanceof File) {
        formData.append('payment_receipt_document', this.application.payment_receipt_document);
      }
      

      return formData;
    },
    displayServerErrors(errorData) {
        if (typeof errorData === 'object' && errorData !== null) {
            for (const key in errorData) {
                if (Object.prototype.hasOwnProperty.call(this.application, key) || key.startsWith('document_file_type_') || key === 'application_courses_json') {
                    this.errors[key] = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
                } else if (key === 'non_field_errors' || key === 'detail') {
                     this.errors.general = (this.errors.general ? this.errors.general + " " : "") + (Array.isArray(errorData[key]) ? errorData[key].join(' ') : errorData[key]);
                } else {
                     // For nested errors in application_courses_json, we'd need more specific parsing
                     // This is a simplified assignment for now.
                     this.errors[key] = Array.isArray(errorData[key]) ? errorData[key] : [errorData[key]];
                }
            }
            // Attempt to parse application_courses_json errors if they are structured
            if (errorData.application_courses_json && Array.isArray(errorData.application_courses_json)) {
                errorData.application_courses_json.forEach((courseError, index) => {
                    if (courseError && typeof courseError === 'object') {
                        for (const field in courseError) {
                            this.errors[`application_courses_json.${index}.${field}`] = courseError[field];
                        }
                    }
                });
            }


        } else if (typeof errorData === 'string') {
            this.errors.general = errorData;
        } else {
            this.errors.general = 'An unexpected error occurred.';
        }
    },

    async saveDraft() {
      if (!this.application.institute_profile) {
          alert("Institute profile is required to save a draft.");
          return;
      }
      this.isSubmitting = true;
      this.isSavingDraft = true;
      this.errors = {}; // Clear previous errors
      const formData = this.prepareApplicationFormData();

      try {
        let response;
        if (this.application.id) {
          response = await apiService.patchAccreditationApplication(this.application.id, formData);
        } else {
          response = await apiService.createAccreditationApplication(formData);
        }
        await this.loadExistingApplication(response.data.id); // Reload state
        alert('Application draft saved successfully!');
      } catch (error) {
        console.error("Error saving draft:", error.response?.data || error);
        this.displayServerErrors(error.response?.data || { general: 'Failed to save draft. Please check form for errors and try again.' });
        alert('Could not save draft. Please check the form for error messages.');
      } finally {
        this.isSubmitting = false;
        this.isSavingDraft = false;
      }
    },

    async handleFinalSubmitApplication() {
      this.errors = {}; // Clear previous errors
      // Client-side validation
      let isValid = true;
      if (!this.application.institute_profile || !this.application.application_schedule) {
          this.errors.general = "Cannot submit: Institute profile and an active application schedule are required.";
          isValid = false;
      }
      if (!this.application.prerequisites_selection || this.application.prerequisites_selection.length === 0) {
        this.errors.prerequisites_confirmed = ['Please select at least one prerequisite.'];
        isValid = false;
      }
       if (!this.application.accreditation_cycle) {
        this.errors.accreditation_cycle = ['Please select the accreditation cycle.'];
        isValid = false;
      }
      if (this.application.accreditation_cycle === 'other' && !this.application.accreditation_cycle_other_specify) {
        this.errors.accreditation_cycle_other_specify = ['Please specify the other cycle.'];
        isValid = false;
      }
      if (!this.application.application_courses || this.application.application_courses.length === 0) {
        this.errors.application_courses_json = ['Please add at least one course/programme.']; // Or this.errors.application_courses
        isValid = false;
      } else {
        this.application.application_courses.forEach((course, index) => {
            if(!course.course_programme_title) this.errors[`application_courses_json.${index}.course_programme_title`] = ['Title is required.'];
            if(!course.level_as_per_bqf) this.errors[`application_courses_json.${index}.level_as_per_bqf`] = ['Level is required.'];
            if(course.current_student_number === null || course.current_student_number < 0) this.errors[`application_courses_json.${index}.current_student_number`] = ['Student number is required and must be 0 or more.'];
            if (Object.keys(this.errors).some(k => k.startsWith(`application_courses_json.${index}`))) isValid = false;
        });
      }
      // Add more validations as needed for checklist documents if they are all mandatory


      if (!isValid) {
        alert("Please correct the errors on the form before submitting.");
        return;
      }

      if (!confirm("Are you sure you want to submit this application? You will proceed to payment confirmation after this step.")) {
          return;
      }

      this.isSubmitting = true;
      this.isProcessingSubmit = true;
      const formData = this.prepareApplicationFormData();
      try {
        let appResponse;
        if (this.application.id && (this.application.status === 'draft_initial' || !this.application.status) ) {
          appResponse = await apiService.patchAccreditationApplication(this.application.id, formData);
        } else if (!this.application.id) {
          appResponse = await apiService.createAccreditationApplication(formData);
        } else {
            alert(`Application cannot be submitted in its current state (${this.application.status_display}).`);
            this.isSubmitting = false;
            this.isProcessingSubmit = false;
            return;
        }
        // Use ID from appResponse for the next step.
        const currentApplicationId = appResponse.data.id;
        await this.loadExistingApplication(currentApplicationId); // Load the fully saved state

        // Now call the actual submission endpoint
        const paymentDataPayload = {
            // This structure depends on your backend `submitInitialApplication` endpoint.
            // It might be empty if the backend handles payment initiation/status internally on this call.
            // Or it could include payment method selection, etc., if that's part of this step.
            // For now, assuming it's minimal or backend-driven.
        };
        const finalSubmitResponse = await apiService.submitInitialApplication(currentApplicationId, paymentDataPayload);
        await this.loadExistingApplication(finalSubmitResponse.data.id); // Update with final status

        alert(`Application submitted successfully! Status: ${this.application.status_display}. Please follow payment instructions if any, or await HEQC review.`);
        // Optionally navigate: this.$router.push({ name: 'ApplicationDetails', params: { id: finalSubmitResponse.data.id } });

      } catch (error) {
        console.error("Error during final application submission:", error.response?.data || error);
        this.displayServerErrors(error.response?.data || { general: 'An error occurred during final submission or payment processing initiation.' });
        alert(this.errors.general || 'Failed to complete submission process. Please check error messages.');
      } finally {
        this.isSubmitting = false;
        this.isProcessingSubmit = false;
      }
    },
  },
};
</script>

<style scoped>
.initial-application-form {
  max-width: 900px;
  margin: auto;
}
.form-control-plaintext.ps-0 {
    padding-left: 0;
}
.course-entry h6 {
    font-size: 1.05rem;
}
.badge.fs-6 {
  font-size: 0.9rem !important;
}
.form-check-input {
  cursor: pointer;
}
.form-check-label {
  cursor: pointer;
}
</style>