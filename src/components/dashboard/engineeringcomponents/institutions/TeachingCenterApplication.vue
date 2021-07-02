<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl">
      </div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl">
      </div>
    </div>

    <div class="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      <div class="text-center mb-12 relative">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm"></div>
        <div class="relative p-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <AcademicCapIcon class="w-10 h-10 text-white" />
          </div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            New Teaching Center Application
          </h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Complete the form below to apply for a new teaching center. All required fields are marked with an asterisk.
          </p>
        </div>
      </div>
      <div v-if="isShowingSuccessMessage"
        class="mb-10 p-6 bg-gradient-to-r from-green-400/30 to-emerald-600/30 border-2 border-green-500/50 rounded-3xl shadow-xl text-center backdrop-blur-md">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-5 shadow-md ring-4 ring-white/50">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3
          class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-3">
          Application Submitted Successfully!
        </h3>
        <p class="text-slate-700 leading-relaxed max-w-xl mx-auto text-md">
          Your application for a new teaching center has been received. You will be notified once it has been reviewed
          and approved by the dealing officer. After approval, you will be able to proceed with the payment. Thank you.
        </p>
      </div>

      <form v-if="!isShowingSuccessMessage" @submit.prevent="handleFormSubmit" class="space-y-8"
        enctype="multipart/form-data">
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl">
          </div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
            <!-- Section Header -->
            <div
              class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-8 py-6 border-b border-indigo-100/50">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <BuildingOffice2Icon class="w-6 h-6 text-white" />
                </div>
                <div class="ml-6">
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Proponent Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">
                    Information about the training institute applying
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Content -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Training Institute Name -->
              <div class="lg:col-span-2">
                <label for="trainingInstituteName" class="form-label required-label">
                  Training Institute Name
                </label>
                <div class="relative">
                  <select id="trainingInstituteName" v-model="formData.institute_id" class="form-select" required
                    :disabled="isLoadingOptions">
                    <option value="" disabled>
                      {{ isLoadingOptions ? 'Loading institutes...' : 'Select Institute' }}
                    </option>
                    <option v-for="institute in instituteOptions" :key="institute.value" :value="institute.value">
                      {{ institute.label }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Country -->
              <div>
                <label for="country" class="form-label">Country</label>
                <input type="text" id="country" v-model="formData.country" disabled class="form-input disabled-input" />
              </div>

              <!-- Dzongkhag -->
              <div>
                <label for="dzongkhag" class="form-label">Dzongkhag/Thromde</label>
                <input type="text" id="dzongkhag" v-model="formData.dzongkhag" disabled
                  class="form-input disabled-input" />
              </div>

              <!-- City/Gewog -->
              <div>
                <label for="cityGewogProponent" class="form-label">City/Gewog</label>
                <input type="text" id="cityGewogProponent" v-model="formData.cityGewog" disabled
                  class="form-input disabled-input" />
              </div>

              <!-- Address/Location -->
              <div>
                <label for="addressLocation" class="form-label">Address/Location</label>
                <input type="text" id="addressLocation" v-model="formData.addressLocation" class="form-input"
                  placeholder="Enter address or location" />
              </div>

              <!-- Contact No -->
              <div>
                <label for="contactNo" class="form-label">Contact No.</label>
                <input type="text" id="contactNo" v-model="formData.contactNo" class="form-input"
                  placeholder="Enter contact number" />
              </div>

              <!-- Email Address -->
              <div>
                <label for="emailAddress" class="form-label">Email Address</label>
                <input type="email" id="emailAddress" v-model="formData.emailAddress" class="form-input"
                  placeholder="Enter email address" />
              </div>
            </div>
          </div>
        </div>

        <!-- Teaching Center Details Section -->
        <div class="group relative">
          <!-- Animated border -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl">
          </div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-100/50">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <AcademicCapIcon class="w-6 h-6 text-white" />
                </div>
                <div class="ml-6">
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Teaching Center Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">
                    Specifics of the proposed teaching center
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Content -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Center Name -->
              <div>
                <label for="centerName" class="form-label required-label">Center Name</label>
                <input type="text" id="centerName" v-model="formData.center_name" class="form-input" required
                  placeholder="Enter center name" />
              </div>

              <!-- Center Location -->
              <div>
                <label for="centerLocation" class="form-label required-label">Center Location</label>
                <input type="text" id="centerLocation" v-model="formData.center_location" class="form-input" required
                  placeholder="Enter center location" />
              </div>

              <!-- State/Dzongkhag -->
              <div>
                <label for="stateDzongkhag" class="form-label required-label">State/Dzongkhag</label>
                <div class="relative">
                  <select id="stateDzongkhag" v-model="formData.state_dzongkhag" class="form-select" required>
                    <option value="" disabled>Select Dzongkhag</option>
                    <option v-for="dzongkhag in dzongkhagOptionsForCenter" :key="dzongkhag.value"
                      :value="dzongkhag.value">
                      {{ dzongkhag.label }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- City/Gewog -->
              <div>
                <label for="cityGewogCenter" class="form-label required-label">City/Gewog</label>
                <div class="relative">
                  <select id="cityGewogCenter" v-model="formData.city_gewog" class="form-select" required
                    :disabled="!formData.state_dzongkhag">
                    <option value="" disabled>
                      {{ !formData.state_dzongkhag ? 'Select Dzongkhag first' : 'Select City/Gewog' }}
                    </option>
                    <option v-for="city in gewogOptionsForCenter" :key="city.value" :value="city.value">
                      {{ city.label }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Target Category -->
              <div>
                <label for="targetCategory" class="form-label required-label">Target Category</label>
                <input type="text" id="targetCategory" v-model="formData.target_category" class="form-input" required
                  placeholder="Enter target category" />
              </div>





              <!-- Valid Till -->
              <div>
                <label for="validTill" class="form-label required-label">Valid Till</label>
                <input type="date" id="validTill" v-model="formData.valid_till" class="form-input" required
                  :min="todayDate" />
              </div>

              <!-- Attachments -->
              <div class="lg:col-span-2">
                <label for="tcAttachments" class="form-label required-label">Attachments</label>
                <div class="relative">
                  <input type="file" id="tcAttachments" @change="handleAttachmentChange" multiple required
                    class="form-file-input" />
                  <p class="mt-2 text-sm text-slate-500 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Attach relevant documents. Multiple files can be selected.
                  </p>
                </div>
              </div>


              <!-- Teaching Center Remarks -->
              <div class="lg:col-span-2">
                <label for="tcRemarks" class="form-label required-label">Teaching Center Remarks</label>
                <textarea id="tcRemarks" v-model="formData.tc_remarks" rows="4" class="form-textarea" required
                  placeholder="Enter teaching center remarks..."></textarea>
              </div>

              <!-- General Remarks -->
              <div class="lg:col-span-2">
                <label for="remarks" class="form-label">Remarks (General)</label>
                <textarea id="remarks" v-model="formData.remarks" rows="3" class="form-textarea"
                  placeholder="Enter general remarks..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl">
          </div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm p-8 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
            <div class="flex items-start space-x-4">
              <div class="flex items-center h-6 mt-1">
                <input id="declaration" aria-describedby="declaration-description" type="checkbox"
                  v-model="formData.declaration"
                  class="w-5 h-5 text-emerald-600 bg-white border-2 border-slate-300 rounded-md focus:ring-emerald-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:border-emerald-400"
                  required />
              </div>
              <div class="flex-1">
                <label for="declaration" class="block text-lg font-semibold text-slate-700 required-label mb-2">
                  Declaration
                </label>
                <p id="declaration-description" class="text-slate-600 leading-relaxed">
                  I hereby declare that the information provided above is true and correct to the best of my knowledge.
                  I understand that any false information may result in the rejection of this application.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
          <button type="button" @click="handleCancel"
            class="btn btn-outline w-full sm:w-auto order-last sm:order-first">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>

          <button type="button" @click="handleSaveDraft" class="btn btn-draft w-full sm:w-auto"
            :disabled="isSubmitting">
            <Loader v-if="isSubmittingDraft" class="animate-spin w-5 h-5 mr-2" />
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {{ isSubmittingDraft ? 'Saving Draft...' : 'Save as Draft' }}
          </button>

          <button type="submit" :disabled="!formData.declaration || isSubmitting || isSubmittingDraft"
            class="btn btn-primary w-full sm:w-auto">
            <Loader v-if="isSubmitting" class="animate-spin w-5 h-5 mr-2 text-white" />
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>

      <PaymentModal ref="paymentModalRef" :amount="EPC_TEACHING_CENTER_FEE" @payment-completed="onPaymentCompleted"
        @close="onPaymentModalClose" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import apiServices from '@/services/services'

import PaymentModal from '@/components/common/PaymentModal.vue'
import { BuildingOffice2Icon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import { Loader } from 'lucide-vue-next'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'
import { useAuthStore } from '@/stores/authStore'

const isLoadingOptions = ref(true)
const isSubmitting = ref(false)
const isSubmittingDraft = ref(false)
const paymentModalRef = ref(null)
const authStore = useAuthStore()

const EPC_TEACHING_CENTER_FEE = 100

const isShowingSuccessMessage = ref(false);

const initialFormData = {
  institute_id: '',
  country: 'Bhutan',
  dzongkhag: '',
  cityGewog: '',
  addressLocation: '',
  contactNo: '',
  emailAddress: '',
  center_name: '',
  center_location: '',
  city_gewog: '',
  state_dzongkhag: '',
  target_category: '',
  tc_attachments: null,
  tc_report: null,
  remarks: '',
  tc_remarks: '',
  tc_renewal_review_name: '',
  tc_review_summary: '',
  valid_till: '',
  declaration: false,
}

const formData = ref({ ...initialFormData })
const instituteOptions = ref([])

const dzongkhagOptionsForCenter = computed(() => {
  return bhutanDzongkhagsGewogs.map(d => ({
    value: d.dzongkhag,
    label: d.dzongkhag,
  }))
})

const gewogOptionsForCenter = computed(() => {
  if (!formData.value.state_dzongkhag) {
    return []
  }
  const selectedDzongkhag = bhutanDzongkhagsGewogs.find(
    (d) => d.dzongkhag === formData.value.state_dzongkhag
  )
  return selectedDzongkhag
    ? selectedDzongkhag.gewogs.map((g) => ({ value: g, label: g }))
    : []
})

watch(() => formData.value.state_dzongkhag, (newDzongkhag) => {
  if (newDzongkhag) {
    formData.value.city_gewog = ''
  }
})

const todayDate = computed(() => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

onMounted(async () => {
  isLoadingOptions.value = true
  try {
    const institutesResponse = await apiServices.getEpcInstitutes()
    const institutesArray = institutesResponse.data?.results || institutesResponse.data || []

    if (!Array.isArray(institutesArray)) {
      console.error('Error fetching institute options: Expected an array but received:', institutesArray);
      instituteOptions.value = [];
      alert('Failed to load institute options: Unexpected data format. Please check console.');
    } else {
      instituteOptions.value = institutesArray.map((institute) => ({
        value: institute.id,
        label: institute.name_of_institution,
        data: institute,
      }));
    }
  } catch (error) {
    console.error('Error fetching institute options:', error.response || error.message || error);
    instituteOptions.value = [];
    alert('Failed to load institute options. Please check the console for details and try refreshing the page.')
  } finally {
    isLoadingOptions.value = false
  }
})

watch(
  () => formData.value.institute_id,
  (newValue) => {
    const selectedInstituteFull = instituteOptions.value.find((inst) => inst.value === newValue)
    if (selectedInstituteFull && selectedInstituteFull.data) {
      const instData = selectedInstituteFull.data
      formData.value.country = instData.country || 'Bhutan'
      formData.value.dzongkhag = instData.dzongkhag || ''
      formData.value.cityGewog = instData.gewog || ''
      formData.value.addressLocation = instData.address || instData.location || ''
      formData.value.contactNo = instData.contact_no || ''
      formData.value.emailAddress = instData.email_address || ''
    } else {
      formData.value.country = 'Bhutan'
      formData.value.dzongkhag = ''
      formData.value.cityGewog = ''
      formData.value.addressLocation = ''
      formData.value.contactNo = ''
      formData.value.emailAddress = ''
    }
  }
)

const handleAttachmentChange = (event) => {
  formData.value.tc_attachments = event.target.files
}



const resetForm = () => {
  formData.value = { ...initialFormData }
  const fileInputs = document.querySelectorAll('input[type="file"]')
  fileInputs.forEach((input) => {
    const inputElement = input
    if (inputElement) inputElement.value = ''
  })
  formData.value.declaration = false;
}

const createPayload = (isDraft = false) => {
  const formPayload = new FormData();
  const dataToSubmit = { ...formData.value };

  if (isDraft) {
    dataToSubmit.is_draft = true;
  } else {
    if (Object.hasOwn(dataToSubmit, 'is_draft')) {
      delete dataToSubmit.is_draft;
    }
  }

  Object.keys(dataToSubmit).forEach((key) => {
    const value = dataToSubmit[key];


    if (key === 'tc_attachments' && value) {
      if (value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          formPayload.append('tc_attachments', value[i]);
        }
      }
    }

    else if (value !== null && value !== undefined && value !== '') {

      let backendKey = key;
      if (key === 'institute_id') {
        backendKey = 'institute_id';
      }

      if (typeof value === 'boolean') {
        formPayload.append(backendKey, value.toString());
      } else {
        formPayload.append(backendKey, value);
      }
    }
  });


  if (!formPayload.has('payment_id')) {
    formPayload.append('payment_id', '');
  }

  return formPayload;
}


const validateForm = () => {
  if (!formData.value.institute_id) { alert('Please select Training Institute Name.'); return false; }
  if (!formData.value.center_name.trim()) { alert('Please enter Center Name.'); return false; }
  if (!formData.value.center_location.trim()) { alert('Please enter Center Location.'); return false; }
  if (!formData.value.state_dzongkhag) { alert('Please select State/Dzongkhag for the center.'); return false; }
  if (!formData.value.city_gewog) { alert('Please select City/Gewog for the center.'); return false; }
  if (!formData.value.target_category.trim()) { alert('Please enter Target Category.'); return false; }
  if (!formData.value.valid_till) { alert('Please select Valid Till date.'); return false; }
  if (!formData.value.tc_attachments || formData.value.tc_attachments.length === 0) { alert('Please attach required documents.'); return false; }
  if (!formData.value.tc_remarks.trim()) { alert('Please enter Teaching Center Remarks.'); return false; }
  if (!formData.value.declaration) { alert('Please accept the declaration.'); return false; }
  return true;
}

const handleFormSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  isSubmitting.value = true;
  isShowingSuccessMessage.value = false;

  try {
    const formPayloadForApp = createPayload(false);

    if (authStore.userId) {
      formPayloadForApp.append('user_id', authStore.userId);
    }
    await apiServices.createEpcTeachingCenter(formPayloadForApp);

    isShowingSuccessMessage.value = true;
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Error during submission process:', error.response?.data || error.message || error);
    let errorMessage = 'Error submitting application. ';
    if (error.response?.data) {
      const errors = error.response.data;
      if (typeof errors === 'string') {
        errorMessage += errors;
      } else if (typeof errors === 'object') {
        const messages = Object.entries(errors).map(([key, value]) => {
          const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
        }).join('\n');
        if (messages) errorMessage += `Details:\n${messages}`;
        else if (errors.detail) errorMessage += errors.detail;
        else errorMessage += 'An unexpected error occurred. Please check the console for more details.'
      } else {
        errorMessage += 'An unexpected error occurred. Please check the console for more details.'
      }
    } else {
      errorMessage += error.message || 'An unexpected network or server error occurred. Please check the console for details.';
    }
    alert(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}
const onPaymentModalClose = () => {

  console.log('Payment modal closed.');
}

const onPaymentCompleted = async ({ paymentHash }) => {
  console.log('Payment completed with hash:', paymentHash);
}


const handleCancel = () => {
  if (confirm('Are you sure you want to cancel and reset the form? All unsaved changes will be lost.')) {
    resetForm();
    isShowingSuccessMessage.value = false;
  }
}

const handleSaveDraft = async () => {
  if (!formData.value.institute_id || !formData.value.center_name.trim()) {
    alert('Please provide at least Training Institute Name and Center Name to save a draft.');
    return;
  }
  isSubmittingDraft.value = true;
  const formPayload = createPayload(true);
  if (authStore.userId) {
    formPayload.append('user_id', authStore.userId);
  }
  try {

    await apiServices.createEpcTeachingCenter(formPayload)
    alert('Draft saved successfully!')
  } catch (error) {
    console.error('Error saving draft:', error.response?.data || error.message || error)
    let errorMessage = 'Error saving draft. ';

    if (error.response?.data) {
      const errors = error.response.data;
      if (typeof errors === 'string') {
        errorMessage += errors;
      } else if (typeof errors === 'object') {
        const messages = Object.entries(errors).map(([key, value]) => {
          const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
        }).join('\n');
        if (messages) errorMessage += `Details:\n${messages}`;
        else if (errors.detail) errorMessage += errors.detail;
        else errorMessage += 'An unexpected error occurred. Please check the console for more details.'
      } else {
        errorMessage += 'An unexpected error occurred. Please check the console for more details.'
      }
    } else {
      errorMessage += error.message || 'An unexpected network or server error occurred. Please check the console for details.';
    }
    alert(errorMessage);
  } finally {
    isSubmittingDraft.value = false
  }
}
</script>
