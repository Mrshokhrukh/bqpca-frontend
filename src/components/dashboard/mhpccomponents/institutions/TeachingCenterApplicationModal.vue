<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <div
          class="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-xl shadow-2xl w-full max-w-5xl mx-auto my-8 max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            class="flex items-center justify-between p-5 md:p-6 border-b border-slate-200/70 rounded-t-xl bg-white/50 sticky top-0 z-10"
          >
            <h3
              id="modal-title"
              class="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              New Teaching Hospital Application
            </h3>
            <button
              @click="handleCancel"
              class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 -m-1.5 rounded-full hover:bg-slate-200/70"
              aria-label="Close modal"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="p-5 md:p-8 overflow-y-auto flex-grow">
            <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10 opacity-50">
              <div
                class="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-2xl"
              ></div>
              <div
                class="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-2xl"
              ></div>
              <div
                class="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-full blur-2xl"
              ></div>
            </div>

            <div class="text-center mb-8 relative">
              <div class="relative p-2">
                <div
                  class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-sm transform hover:scale-105 transition-transform duration-300"
                >
                  <AcademicCapIcon class="w-8 h-8 text-white" />
                </div>
                <p class="text-md text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Complete the form below to apply. Required fields are marked with an asterisk.
                </p>
              </div>
            </div>

            <div
              v-if="isShowingSuccessMessage"
              class="mb-8 p-4 md:p-6 bg-gradient-to-r from-green-400/30 to-emerald-600/30 border-2 border-green-500/50 rounded-2xl shadow-xl text-center backdrop-blur-md"
            >
              <div
                class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-md ring-4 ring-white/50"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3
                class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-2"
              >
                Application Submitted!
              </h3>
              <p class="text-slate-700 leading-relaxed max-w-xl mx-auto text-sm">
                Your application has been received. You will be notified once reviewed. This dialog
                will close shortly.
              </p>
            </div>

            <form
              v-if="!isShowingSuccessMessage"
              @submit.prevent="handleFormSubmit"
              class="space-y-6"
              enctype="multipart/form-data"
            >
              <div class="group relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-lg"
                ></div>
                <div
                  class="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div
                    class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-6 py-4 border-b border-indigo-100/50"
                  >
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                      >
                        <BuildingOffice2Icon class="w-5 h-5 text-white" />
                      </div>
                      <div class="ml-4">
                        <h3
                          class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                        >
                          Proponent Details
                        </h3>
                        <p class="text-slate-500 mt-0.5 text-xs">Information about the Institute</p>
                      </div>
                    </div>
                  </div>
                  <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                    <div class="lg:col-span-2">
                      <label for="modal-trainingInstituteName" class="form-label required-label">
                        Institute Name
                      </label>
                      <div class="relative">
                        <select
                          id="modal-trainingInstituteName"
                          v-model="formData.institute_id"
                          class="form-select"
                          required
                          :disabled="isLoadingOptions"
                        >
                          <option value="" disabled>
                            {{ isLoadingOptions ? 'Loading institutes...' : 'Select Institute' }}
                          </option>
                          <option
                            v-for="institute in instituteOptions"
                            :key="institute.value"
                            :value="institute.value"
                          >
                            {{ institute.label }}
                          </option>
                        </select>
                        <div
                          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                        >
                          <svg
                            class="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label for="modal-country" class="form-label">Country</label>
                      <input
                        type="text"
                        id="modal-country"
                        v-model="formData.country"
                        disabled
                        class="form-input disabled-input"
                      />
                    </div>
                    <div>
                      <label for="modal-dzongkhag" class="form-label">Dzongkhag/Thromde</label>
                      <input
                        type="text"
                        id="modal-dzongkhag"
                        v-model="formData.dzongkhag"
                        disabled
                        class="form-input disabled-input"
                      />
                    </div>
                    <div>
                      <label for="modal-cityGewogProponent" class="form-label">City/Gewog</label>
                      <input
                        type="text"
                        id="modal-cityGewogProponent"
                        v-model="formData.cityGewog"
                        disabled
                        class="form-input disabled-input"
                      />
                    </div>
                    <div>
                      <label for="modal-addressLocation" class="form-label">Address/Location</label>
                      <input
                        type="text"
                        id="modal-addressLocation"
                        v-model="formData.addressLocation"
                        class="form-input"
                        placeholder="Enter address or location"
                      />
                    </div>
                    <div>
                      <label for="modal-contactNo" class="form-label">Contact No.</label>
                      <input
                        type="text"
                        id="modal-contactNo"
                        v-model="formData.contactNo"
                        class="form-input"
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div>
                      <label for="modal-emailAddress" class="form-label">Email Address</label>
                      <input
                        type="email"
                        id="modal-emailAddress"
                        v-model="formData.emailAddress"
                        class="form-input"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="group relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-lg"
                ></div>
                <div
                  class="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div
                    class="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100/50"
                  >
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                      >
                        <AcademicCapIcon class="w-5 h-5 text-white" />
                      </div>
                      <div class="ml-4">
                        <h3
                          class="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"
                        >
                          Teaching Hospital Details
                        </h3>
                        <p class="text-slate-500 mt-0.5 text-xs">
                          Specifics of the proposed teaching center
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label for="modal-centerName" class="form-label required-label"
                        >Teaching Hospital Name</label
                      >
                      <input
                        type="text"
                        id="modal-centerName"
                        v-model="formData.center_name"
                        class="form-input"
                        required
                        placeholder="Enter center name"
                      />
                    </div>
                    <div>
                      <label for="modal-centerLocation" class="form-label required-label"
                        >Hospital Location</label
                      >
                      <input
                        type="text"
                        id="modal-centerLocation"
                        v-model="formData.center_location"
                        class="form-input"
                        required
                        placeholder="Enter center location"
                      />
                    </div>
                    <div>
                      <label for="modal-stateDzongkhag" class="form-label required-label"
                        >State/Dzongkhag</label
                      >
                      <div class="relative">
                        <select
                          id="modal-stateDzongkhag"
                          v-model="formData.state_dzongkhag"
                          class="form-select"
                          required
                        >
                          <option value="" disabled>Select Dzongkhag</option>
                          <option
                            v-for="dzongkhag in dzongkhagOptionsForCenter"
                            :key="dzongkhag.value"
                            :value="dzongkhag.value"
                          >
                            {{ dzongkhag.label }}
                          </option>
                        </select>
                        <div
                          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                        >
                          <svg
                            class="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label for="modal-cityGewogCenter" class="form-label required-label"
                        >City/Gewog</label
                      >
                      <div class="relative">
                        <select
                          id="modal-cityGewogCenter"
                          v-model="formData.city_gewog"
                          class="form-select"
                          required
                          :disabled="!formData.state_dzongkhag"
                        >
                          <option value="" disabled>
                            {{
                              !formData.state_dzongkhag
                                ? 'Select Dzongkhag first'
                                : 'Select City/Gewog'
                            }}
                          </option>
                          <option
                            v-for="city in gewogOptionsForCenter"
                            :key="city.value"
                            :value="city.value"
                          >
                            {{ city.label }}
                          </option>
                        </select>
                        <div
                          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                        >
                          <svg
                            class="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label for="modal-targetCategory" class="form-label required-label"
                        >Target Category</label
                      >
                      <input
                        type="text"
                        id="modal-targetCategory"
                        v-model="formData.target_category"
                        class="form-input"
                        required
                        placeholder="Enter target category"
                      />
                    </div>
                    <div class="lg:col-span-2">
                      <label for="modal-remarks" class="form-label">Remarks (General)</label>
                      <textarea
                        id="modal-remarks"
                        v-model="formData.remarks"
                        rows="2"
                        class="form-textarea"
                        placeholder="Enter general remarks..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="group relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-lg"
                ></div>
                <div
                  class="relative bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl shadow-sm p-6 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div class="flex items-start space-x-3">
                    <div class="flex items-center h-5 mt-0.5">
                      <input
                        id="modal-declaration"
                        aria-describedby="modal-declaration-description"
                        type="checkbox"
                        v-model="formData.declaration"
                        class="w-4 h-4 text-emerald-600 bg-white border-2 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 focus:ring-offset-1 transition-all duration-200 hover:border-emerald-400"
                        required
                      />
                    </div>
                    <div class="flex-1">
                      <label
                        for="modal-declaration"
                        class="block text-md font-semibold text-slate-700 required-label mb-1"
                      >
                        Declaration
                      </label>
                      <p
                        id="modal-declaration-description"
                        class="text-slate-600 leading-relaxed text-sm"
                      >
                        I hereby declare that the information provided is true and correct...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sticky bottom-0 bg-gradient-to-t from-indigo-100 via-blue-50/80 to-transparent pb-5 md:pb-8 px-5 md:px-8 -mx-5 md:-mx-8 rounded-b-xl"
              >
                <button
                  type="button"
                  @click="handleCancel"
                  class="btn btn-outline w-full sm:w-auto order-last sm:order-first"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>

                <button
                  type="button"
                  @click="handleSaveDraft"
                  class="btn btn-draft w-full sm:w-auto"
                  :disabled="isSubmitting"
                >
                  <Loader v-if="isSubmittingDraft" class="animate-spin w-4 h-4 mr-2" />
                  <svg
                    v-else
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {{ isSubmittingDraft ? 'Saving...' : 'Save as Draft' }}
                </button>

                <button
                  type="submit"
                  :disabled="!formData.declaration || isSubmitting || isSubmittingDraft"
                  class="btn btn-primary w-full sm:w-auto"
                >
                  <Loader v-if="isSubmitting" class="animate-spin w-4 h-4 mr-2 text-white" />
                  <svg
                    v-else
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
                </button>
              </div>
            </form>

            <PaymentModal
              ref="paymentModalRef"
              :amount="MHPC_TEACHING_CENTER_FEE"
              @payment-completed="onPaymentCompleted"
              @close="onPaymentModalClose"
            />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import apiServices from '@/services/services'

import PaymentModal from '@/components/common/PaymentModal.vue'
import { BuildingOffice2Icon, AcademicCapIcon } from '@heroicons/vue/24/outline'
import { Loader } from 'lucide-vue-next'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: Boolean,
  draftData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'form-submitted', 'draft-saved'])
const toast = useToast()

const isLoadingOptions = ref(true)
const isSubmitting = ref(false)
const isSubmittingDraft = ref(false)
const paymentModalRef = ref(null)
const authStore = useAuthStore()

const MHPC_TEACHING_CENTER_FEE = 100

const isShowingSuccessMessage = ref(false)

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
  remarks: '',
  declaration: false,
}

const formData = ref({ ...initialFormData })
const instituteOptions = ref([])

const dzongkhagOptionsForCenter = computed(() => {
  return bhutanDzongkhagsGewogs.map((d) => ({
    value: d.dzongkhag,
    label: d.dzongkhag,
  }))
})

const gewogOptionsForCenter = computed(() => {
  if (!formData.value.state_dzongkhag) {
    return []
  }
  const selectedDzongkhag = bhutanDzongkhagsGewogs.find(
    (d) => d.dzongkhag === formData.value.state_dzongkhag,
  )
  return selectedDzongkhag ? selectedDzongkhag.gewogs.map((g) => ({ value: g, label: g })) : []
})

watch(
  () => formData.value.state_dzongkhag,
  (newDzongkhag) => {
    if (newDzongkhag) {
      formData.value.city_gewog = ''
    }
  },
)

const fetchInstituteOptions = async () => {
  isLoadingOptions.value = true
  try {
    const institutesResponse = await apiServices.getMhpcInstituteByCid(authStore.user.cid)
    const institutesArray = institutesResponse.data?.results || institutesResponse.data || []

    if (!Array.isArray(institutesArray)) {
      console.error(
        'Error fetching institute options: Expected an array but received:',
        institutesArray,
      )
      instituteOptions.value = []
    } else if (institutesArray.length === 0) {
      instituteOptions.value = [
        { value: '', label: 'No institute found for your user ID', disabled: true },
      ]
    } else {
      instituteOptions.value = institutesArray.map((institute) => ({
        value: institute.id,
        label: institute.name_of_institution,
        data: institute,
      }))
      // Automatically select the institute if there's only one
      if (instituteOptions.value.length === 1) {
        formData.value.institute_id = instituteOptions.value[0].value
      }
    }
  } catch (error) {
    console.error('Error fetching institute options:', error.response || error.message || error)
    instituteOptions.value = []
  } finally {
    isLoadingOptions.value = false
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
      isShowingSuccessMessage.value = false
      if (props.draftData) {
        formData.value = { ...initialFormData, ...props.draftData }
      } else {
        resetForm()
      }
      if (instituteOptions.value.length === 0) {
        fetchInstituteOptions()
      }
    } else {
      setTimeout(() => {
        const anyModalOpen = document.querySelector(
          '.fixed.inset-0.z-50[style*="display: block"], .fixed.inset-0.z-50.modal-fade-enter-active',
        )
        if (!anyModalOpen) {
          document.body.style.overflow = ''
        }
      }, 150)
    }
  },
)

onMounted(() => {
  if (props.isOpen) {
    fetchInstituteOptions()
    document.body.style.overflow = 'hidden'
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
  },
)

const resetForm = () => {
  formData.value = { ...initialFormData }
  const formElement = document.querySelector('form[enctype="multipart/form-data"]')
  if (formElement) {
    const fileInputs = formElement.querySelectorAll('input[type="file"]')
    fileInputs.forEach((input) => {
      if (input) input.value = ''
    })
  }
  formData.value.declaration = false
}

const createPayload = (isDraft = false) => {
  const formPayload = new FormData()
  const dataToSubmit = { ...formData.value }

  if (isDraft) {
    dataToSubmit.is_draft = true
  } else {
    if (Object.hasOwn(dataToSubmit, 'is_draft')) {
      delete dataToSubmit.is_draft
    }
  }

  Object.keys(dataToSubmit).forEach((key) => {
    if (key === 'payment_id') return

    const value = dataToSubmit[key]

    if (value !== null && value !== undefined) {
      const backendKey = key === 'institute_id' ? 'institute' : key
      if (typeof value === 'boolean') {
        formPayload.append(backendKey, value.toString())
      } else {
        formPayload.append(backendKey, value)
      }
    }
  })
  return formPayload
}

const validateForm = () => {
  if (!formData.value.institute_id) {
    toast.error('Please select Teaching Hospital Name.')
    return false
  }
  if (!formData.value.center_name.trim()) {
    toast.error('Please enter Teaching Hospital Name.')
    return false
  }
  if (!formData.value.center_location.trim()) {
    toast.error('Please enter Hospital Location.')
    return false
  }
  if (!formData.value.state_dzongkhag) {
    toast.error('Please select State/Dzongkhag for the center.')
    return false
  }
  if (!formData.value.city_gewog) {
    toast.error('Please select City/Gewog for the center.')
    return false
  }
  if (!formData.value.target_category.trim()) {
    toast.error('Please enter Target Category.')
    return false
  }
  if (!formData.value.declaration) {
    toast.error('Please accept the declaration.')
    return false
  }
  return true
}

const handleFormSubmit = async () => {
  if (isSubmitting.value) {
    console.warn('Form submission already in progress. Ignoring additional attempt.')
    return
  }
  if (!validateForm()) {
    return
  }
  isSubmitting.value = true

  try {
    const formPayloadForApp = createPayload(false)
    if (authStore.userId) {
      formPayloadForApp.append('applicant_user_id', authStore.userId)
    }
    console.log('Submitting teaching center application:', Object.fromEntries(formPayloadForApp))
    await apiServices.createMhpcTeachingCenter(formPayloadForApp)

    // Clear draft from localStorage on successful submission
    const draftKey = `draft-teachingCenter-${authStore.user.id}`
    localStorage.removeItem(draftKey)

    isShowingSuccessMessage.value = true
    setTimeout(() => {
      emit('form-submitted')
    }, 3000)
  } catch (error) {
    console.error(
      'Error during submission process:',
      error.response?.data || error.message || error,
    )
    let errorMessage = 'Error submitting application. '
    if (error.response?.data) {
      const errors = error.response.data
      if (typeof errors === 'string') {
        errorMessage += errors
      } else if (typeof errors === 'object') {
        const messages = Object.entries(errors)
          .map(([key, value]) => {
            const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
            return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`
          })
          .join('\n')
        if (messages) errorMessage += `Details:\n${messages}`
        else if (errors.detail) errorMessage += errors.detail
        else errorMessage += 'An unexpected error occurred.'
      } else {
        errorMessage += 'An unexpected error occurred.'
      }
    } else {
      errorMessage += error.message || 'An unexpected network or server error occurred.'
    }
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed.')
}

const onPaymentCompleted = async ({ paymentHash }) => {
  console.log('Payment completed with hash:', paymentHash)
}

const handleCancel = () => {
  emit('close')
}

const handleSaveDraft = () => {
  if (!formData.value.institute_id || !formData.value.center_name.trim()) {
    toast.info('Please provide at least Teaching Hospital Name and Hospital Name to save a draft.')
    return
  }

  const draftData = {
    ...formData.value,
    version: (props.draftData?.version || 0) + 1,
    savedAt: new Date().toISOString(),
  }

  const draftKey = `draft-teachingCenter-${authStore.user.id}`
  localStorage.setItem(draftKey, JSON.stringify(draftData))
  toast.success('Draft saved successfully!')
  emit('draft-saved')
  emit('close')
}
</script>

<style scoped>
/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .relative, /* Target the dialog box for scale transition */
.modal-fade-leave-active .relative {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* Form Elements - Styles from original form, slightly adapted for modal if needed */
.form-label {
  @apply block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide;
}

.required-label::after {
  content: ' *';
  @apply text-rose-500 ml-0.5;
}

.form-input,
.form-select,
.form-textarea {
  @apply block w-full rounded-lg border-0 bg-white/60 backdrop-blur-sm px-3 py-2.5 text-slate-900 shadow-md ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-0 transition-all duration-300 hover:shadow-sm hover:ring-slate-300/50 text-sm;
}

.disabled-input {
  @apply bg-slate-100/80 text-slate-500 cursor-not-allowed ring-slate-100;
}

/* .form-file-input class is kept for potential future use or consistency, though no file inputs currently use it */
.form-file-input {
  @apply block w-full text-xs text-slate-600 bg-white/60 backdrop-blur-sm rounded-lg border-0 shadow-md ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-sm hover:ring-slate-300/50 focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-0
    file:mr-3 file:py-2.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-indigo-50 file:to-purple-50 file:text-indigo-700 file:shadow-sm
    hover:file:from-indigo-100 hover:file:to-purple-100 hover:file:shadow-md file:transition-all file:duration-300 cursor-pointer;
}

.form-select {
  @apply appearance-none cursor-pointer;
}

.btn {
  @apply inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105 active:scale-95;
}

.btn-primary {
  @apply bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40 focus:ring-indigo-500/50;
}

.btn-outline {
  @apply bg-white/80 backdrop-blur-sm text-slate-700 ring-1 ring-slate-200 shadow-slate-200/50 hover:bg-slate-50/80 hover:ring-slate-300 hover:shadow-slate-300/50 focus:ring-slate-400/50;
}

.btn-draft {
  @apply bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 hover:shadow-amber-500/40 focus:ring-amber-500/50;
}

.form-textarea::-webkit-scrollbar {
  @apply w-1.5;
}
.form-textarea::-webkit-scrollbar-track {
  @apply bg-slate-100 rounded-full;
}
.form-textarea::-webkit-scrollbar-thumb {
  @apply bg-slate-300 rounded-full hover:bg-slate-400;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  @apply shadow-sm ring-2 ring-indigo-500/50;
}
</style>
