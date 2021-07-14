<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>DPR Submission Form</h3>
        <button @click="closeModal" class="close-button">×</button>
      </div>

      <div class="modal-body">
        <div v-if="loadingInstituteData" class="loading-message">Loading form data...</div>
        <form @submit.prevent="handleSubmitDpr" v-if="!loadingInstituteData">
          <!-- Pre-filled/Reference Information -->
          <div class="form-section">
            <h4>Institution Information (from EOI)</h4>
            <div class="form-group">
              <label for="name_of_institution">Proposed Name of the College/institution *</label>
              <input
                type="text"
                id="name_of_institution"
                v-model="formData.name_of_institution"
                disabled
              />
            </div>
            <div class="form-group">
              <label for="cid">Promoter's CID *</label>
              <input type="text" id="cid" v-model="formData.CID" disabled />
            </div>
            <div class="form-group">
              <label for="dzongkhag">Proposed Dzongkhag *</label>
              <input type="text" id="dzongkhag" v-model="formData.dzongkhag" disabled />
            </div>
            <div class="form-group" v-if="formData.program_type_name">
              <label for="program_type_name">Program Type</label>
              <input
                type="text"
                id="program_type_name"
                v-model="formData.program_type_name"
                disabled
              />
            </div>
          </div>

          <!-- DPR Specific Details -->
          <div class="form-section">
            <h4>DPR Details</h4>
            <div class="form-group">
              <label for="dpr_name">DPR Name / Primary Course Title *</label>
              <input type="text" id="dpr_name" v-model="formData.dpr_name" required />
              <span v-if="errors.dpr_name" class="error-text">{{ errors.dpr_name }}</span>
            </div>
          </div>

          <!-- Head of Institution -->
          <div class="form-section">
            <h4>Head of Institution</h4>
            <div class="form-group">
              <label for="head_of_institution_name">Head of Institution Name *</label>
              <input
                type="text"
                id="head_of_institution_name"
                v-model="formData.head_of_institution_name"
                required
              />
            </div>
            <div class="form-group">
              <label for="head_of_institution_gender">Head of Institution Gender *</label>
              <select
                id="head_of_institution_gender"
                v-model="formData.head_of_institution_gender"
                required
              >
                <option disabled value="">Please select one</option>
                <option v-for="gender in genderOptions" :key="gender.value" :value="gender.value">
                  {{ gender.text }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="head_of_institution_email">Head of Institution Email *</label>
              <input
                type="email"
                id="head_of_institution_email"
                v-model="formData.head_of_institution_email"
                required
              />
            </div>
            <div class="form-group">
              <label for="head_of_institution_phone_number">Head of Institution Phone No *</label>
              <input
                type="tel"
                id="head_of_institution_phone_number"
                v-model="formData.head_of_institution_phone_number"
                required
              />
            </div>
          </div>

          <!-- Institution Contact & Address -->
          <div class="form-section">
            <h4>Institution Contact & Location</h4>
            <div class="form-group">
              <label for="contact_no">Institution Contact No *</label>
              <input type="tel" id="contact_no" v-model="formData.contact_no" required />
            </div>
            <div class="form-group">
              <label for="email_address">Institution Official Email Address *</label>
              <input type="email" id="email_address" v-model="formData.email_address" required />
            </div>
            <div class="form-group">
              <label for="gewog">Proposed Gewog</label>
              <input type="text" id="gewog" v-model="formData.gewog" />
            </div>
            <div class="form-group">
              <label for="village">Proposed Village</label>
              <input type="text" id="village" v-model="formData.village" />
            </div>
            <div class="form-group">
              <label for="address">Full Address *</label>
              <textarea id="address" rows="2" v-model="formData.address" required></textarea>
            </div>
          </div>

          <!-- Course & Summary -->
          <div class="form-section">
            <h4>Program and Summary</h4>
            <div class="form-group">
              <label for="commencement_date">Proposed Commencement Date *</label>
              <input
                type="date"
                id="commencement_date"
                v-model="formData.commencement_date"
                required
              />
            </div>
            <div class="form-group">
              <label for="course_duration">Course Duration (Months) *</label>
              <input
                type="number"
                id="course_duration"
                v-model="formData.course_duration"
                min="1"
                required
              />
            </div>
            <div class="form-group">
              <label for="executive_summary">Executive Summary *</label>
              <textarea
                id="executive_summary"
                rows="4"
                v-model="formData.executive_summary"
                required
              ></textarea>
            </div>
          </div>

          <!-- Detailed Project Proposal Sections -->
          <div class="form-section">
            <h4>Detailed Project Proposal</h4>
            <div v-for="section in dprDetailSections" :key="section.key" class="form-group">
              <label :for="section.key">{{ section.label }}</label>
              <textarea
                :id="section.key"
                :rows="section.rows"
                v-model="formData[section.key]"
                required
              ></textarea>
            </div>
          </div>

          <!-- Other Details & Declaration -->
          <div class="form-section">
            <h4>Other Information</h4>
            <div class="form-group">
              <label for="remarks">Overall Remarks (by Applicant)</label>
              <textarea id="remarks" v-model="formData.remarks" rows="3"></textarea>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="declaration" v-model="formData.declaration" required />
              <label for="declaration" class="checkbox-label"
                >I hereby declare that the information provided is true and correct. *</label
              >
            </div>
          </div>

          <div v-if="submissionError" class="error-message form-error-message">
            {{ submissionError }}
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="button-secondary">Cancel</button>
            <button type="submit" :disabled="isSubmitting" class="button-primary">
              {{ isSubmitting ? 'Submitting...' : 'Submit DPR' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiServices from '@/services/services' // Adjust path as needed
import { useToast } from 'vue-toastification'

const GENDER_OPTIONS = Object.freeze([
  { value: 'MALE', text: 'Male' },
  { value: 'FEMALE', text: 'Female' },
  { value: 'OTHERS', text: 'Others' },
])

const DPR_DETAIL_SECTIONS = Object.freeze([
  {
    key: 'vision_mission_strategies',
    label: 'Vision, Mission and Implementation Strategies *',
    rows: 5,
  },
  {
    key: 'project_scheduling',
    label: 'Project Scheduling, Implementation and Management *',
    rows: 5,
  },
  {
    key: 'gross_national_happiness',
    label: 'Contribution to Gross National Happiness & Values *',
    rows: 5,
  },
  { key: 'land_details', label: 'Land Details *', rows: 3 },
  { key: 'conceptual_master_plan', label: 'Conceptual Master Plan *', rows: 5 },
  { key: 'academic_plan', label: 'Academic Plan/Profile *', rows: 6 },
  { key: 'affiliation_details', label: 'Affiliation Details *', rows: 4 },
  {
    key: 'teaching_hospital_details',
    label: 'Teaching Hospital Details (Mandatory for Medical/Health courses) *',
    rows: 4,
  },
  { key: 'research_policy', label: 'Research Policy *', rows: 4 },
  { key: 'human_resource', label: 'Human Resource Plan *', rows: 5 },
  { key: 'quality_assurance', label: 'Quality Assurance System *', rows: 5 },
  { key: 'governance_structure', label: 'Governance Structure *', rows: 5 },
  { key: 'business_plan', label: 'Business Plan *', rows: 5 },
  { key: 'project_cost_analysis', label: 'Project Cost and Analysis *', rows: 5 },
  { key: 'facilities_student_services', label: 'Facilities and Student Services *', rows: 5 },
  { key: 'admission_policy', label: 'Admission Policy and Scholarships *', rows: 4 },
  { key: 'service_conditions', label: 'Service Conditions *', rows: 5 },
  { key: 'safety_security', label: 'Safety and Security Plan *', rows: 4 },
  { key: 'public_information_system', label: 'Public Information System Plan *', rows: 4 },
  { key: 'other_details_dpr', label: 'Others *', rows: 4 },
])

export default {
  name: 'DprSubmissionModal',
  props: {
    instituteId: {
      type: [String, Number],
      required: true,
    },
    instituteData: {
      // Contains existing data from the EOI stage
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: this.initializeFormData(),
      isSubmitting: false,
      submissionError: null,
      errors: {}, // For field-specific validation errors
      loadingInstituteData: false, // Could be true if we fetch fresh data, but using prop for now
      genderOptions: GENDER_OPTIONS,
      dprDetailSections: DPR_DETAIL_SECTIONS,
    }
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  watch: {
    instituteData: {
      handler() {
        this.formData = this.initializeFormData()
      },
      deep: true,
      immediate: true, // Initialize on component creation
    },
  },
  methods: {
    initializeFormData() {
      const initial = {
        // Pre-filled from EOI (mostly disabled or for reference)
        name_of_institution: this.instituteData.name_of_institution || '',
        CID: this.instituteData.CID || '',
        dzongkhag: this.instituteData.dzongkhag || '',
        program_type_name: this.instituteData.program_type?.name || '', // Assuming program_type is an object with a name property

        // DPR specific fields (editable/new, prefill if already exists on instituteData)
        dpr_name: this.instituteData.dpr_name || '',

        head_of_institution_name: this.instituteData.head_of_institution_name || '',
        head_of_institution_gender: this.instituteData.head_of_institution_gender || '',
        head_of_institution_email: this.instituteData.head_of_institution_email || '',
        head_of_institution_phone_number: this.instituteData.head_of_institution_phone_number || '',

        contact_no: this.instituteData.contact_no || '', // Institution contact, might be applicant's from EOI
        email_address: this.instituteData.email_address || '', // Institution email, might be applicant's from EOI
        gewog: this.instituteData.gewog || '',
        village: this.instituteData.village || '',
        address: this.instituteData.address || '',

        commencement_date: this.instituteData.commencement_date || null,
        course_duration: this.instituteData.course_duration || null,
        executive_summary: this.instituteData.executive_summary || '',

        remarks: this.instituteData.remarks || '',
        declaration: this.instituteData.declaration || false,
      }

      // Initialize DPR detail sections
      DPR_DETAIL_SECTIONS.forEach((section) => {
        initial[section.key] = this.instituteData[section.key] || ''
      })

      return initial
    },
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.formData.dpr_name) {
        this.errors.dpr_name = 'DPR Name is required.'
        isValid = false
      }
      // Add more specific validations as needed for other required fields
      // For brevity, relying on `required` attribute on inputs for now.
      // A more robust validation would check each required field here.
      if (!this.formData.declaration) {
        this.toast.error('You must agree to the declaration.')
        isValid = false
      }

      // Check all required textareas
      DPR_DETAIL_SECTIONS.forEach((section) => {
        if (!this.formData[section.key]) {
          this.errors[section.key] = `${section.label.replace(' *', '')} is required.`
          isValid = false
        }
      })
      // Basic check for other required fields
      const requiredFields = [
        'head_of_institution_name',
        'head_of_institution_gender',
        'head_of_institution_email',
        'head_of_institution_phone_number',
        'contact_no',
        'email_address',
        'address',
        'commencement_date',
        'course_duration',
        'executive_summary',
      ]
      requiredFields.forEach((field) => {
        if (!this.formData[field]) {
          this.errors[field] = `${field.replace(/_/g, ' ')} is required.` // Simple message
          isValid = false
        }
      })

      if (!isValid && !this.errors.dpr_name) {
        // If other errors exist but not dpr_name, show generic for now
        this.toast.error('Please fill all required (*) fields.')
      }
      return isValid
    },
    async handleSubmitDpr() {
      this.submissionError = null
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true

      // Construct payload - only send fields relevant for DPR update
      // Backend should ideally ignore fields it doesn't want updated (like CID, name_of_institution)
      const payload = {
        ...this.formData, // Send all form data
        application_status: 'DPR_SUBMITTED', // CRITICAL: Update status
      }

      // Remove fields that should not be sent or are display-only
      delete payload.program_type_name

      try {
        await apiServices.patchMhpcInstitute(this.instituteId, payload)
        this.$emit('dpr-submitted')
      } catch (err) {
        console.error('Error submitting DPR:', err)
        this.submissionError =
          err.response?.data?.detail || err.message || 'Failed to submit DPR. Please try again.'
        if (err.response?.data && typeof err.response.data === 'object') {
          // Handle specific field errors from backend if provided
          Object.keys(err.response.data).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
              this.$set(
                this.errors,
                key,
                err.response.data[key].join
                  ? err.response.data[key].join(', ')
                  : err.response.data[key],
              )
            }
          })
        }
      } finally {
        this.isSubmitting = false
      }
    },
    closeModal() {
      if (!this.isSubmitting) {
        this.$emit('close')
      }
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 0;
  border-radius: 8px;
  width: 90%;
  max-width: 800px; /* Adjust as needed */
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
.modal-header {
  padding: 15px 20px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.25em;
}
.close-button {
  background: none;
  border: none;
  font-size: 1.8em;
  cursor: pointer;
  color: #666;
}
.modal-body {
  padding: 20px;
  overflow-y: auto; /* Allows scrolling for long forms */
  flex-grow: 1;
}
.form-section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.form-section:last-child {
  border-bottom: none;
}
.form-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1em;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 5px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 0.9em;
  color: #555;
}
.form-group input[type='text'],
.form-group input[type='email'],
.form-group input[type='tel'],
.form-group input[type='date'],
.form-group input[type='number'],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.95em;
}
.form-group input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}
.form-group textarea {
  resize: vertical;
  min-height: 60px;
}
.checkbox-group {
  display: flex;
  align-items: center;
}
.checkbox-group input[type='checkbox'] {
  width: auto;
  margin-right: 10px;
}
.checkbox-label {
  font-weight: normal !important; /* Override label style */
  margin-bottom: 0 !important;
}
.error-text {
  color: red;
  font-size: 0.8em;
}
.form-error-message {
  padding: 10px;
  margin-bottom: 15px;
  background-color: #ffd2d2;
  border: 1px solid #d8000c;
  color: #d8000c;
  border-radius: 4px;
  text-align: center;
}
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ddd;
  text-align: right;
  background-color: #f0f0f0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.button-primary,
.button-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-left: 10px;
}
.button-primary {
  background-color: #007bff;
  color: white;
}
.button-primary:hover {
  background-color: #0056b3;
}
.button-primary:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.button-secondary {
  background-color: #6c757d;
  color: white;
}
.button-secondary:hover {
  background-color: #545b62;
}
.loading-message {
  text-align: center;
  padding: 20px;
}
</style>
