<template>
  <div class="space-y-6">
    <div v-for="application in applications" :key="application.id"
      class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-gray-200">
        <div class="absolute top-0 right-0 m-2 sm:m-4 flex space-x-2 z-10">
          <button v-if="shouldShowViewCertificateButton(application)" @click="$emit('open-certificate', application)"
            class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md">
            <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span>View Certificate</span>
          </button>
        </div>

        <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl blur-md"></div>
            <img :src="application.passport_photo" :alt="application.full_name"
              class="h-20 w-20 sm:h-24 sm:w-24 relative rounded-xl object-cover ring-4 ring-white shadow-lg" />
          </div>

          <div class="flex-1 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ application.full_name }}
              </h3>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center w-fit mx-auto sm:mx-0"
                :class="{
                  'bg-green-100 text-green-800 border border-green-200': getExpiryStatus(application.expiry_date) === 'ACTIVE',
                  'bg-yellow-100 text-yellow-800 border border-yellow-200': getExpiryStatus(application.expiry_date) === 'EXPIRING_SOON',
                  'bg-red-100 text-red-800 border border-red-200': getExpiryStatus(application.expiry_date) === 'EXPIRED'
                }">
                <span class="w-2 h-2 rounded-full mr-1.5" :class="{
                  'bg-green-500': getExpiryStatus(application.expiry_date) === 'ACTIVE',
                  'bg-yellow-500': getExpiryStatus(application.expiry_date) === 'EXPIRING_SOON',
                  'bg-red-500': getExpiryStatus(application.expiry_date) === 'EXPIRED'
                }"></span>
                {{ getExpiryStatus(application.expiry_date) }}
              </span>
            </div>

            <div
              class="mt-3 flex flex-col sm:flex-row items-center gap-2 text-gray-600 justify-center sm:justify-start">
              <div class="flex items-center px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-100">
                <IdCard class="w-4 h-4 mr-1 text-blue-600" />
                <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}:
                  {{ application.cid_no }}</span>
              </div>
              <div class="flex items-center px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-100">
                <BarChart class="w-4 h-4 mr-1 text-blue-600" />
                <span>Reg No: {{ application.registration_no }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-white border-b border-gray-100">
        <div
          class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
          <div class="mt-1 p-1.5 bg-blue-100 rounded-lg">
            <Phone class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-900">Contact Information</p>
            <p class="text-xs text-gray-600 mt-1">{{ application.contact_no }}</p>
            <p class="text-xs text-gray-600">{{ application.email_address }}</p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
          <div class="mt-1 p-1.5 bg-blue-100 rounded-lg">
            <MapPin class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-900">Location</p>
            <p class="text-xs text-gray-600 mt-1">
              {{ application.village }}, {{ application.gewog }},
              {{ application.dzongkhag }}
            </p>
          </div>
        </div>

        <div
          class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
          <div class="mt-1 p-1.5 bg-blue-100 rounded-lg">
            <Calendar class="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-900">Registration Period</p>
            <p class="text-xs text-gray-600 mt-1">
              {{ new Date(application.registration_date).toLocaleDateString() }} -
              {{ new Date(application.expiry_date).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-6">
        <h4 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <div class="p-1.5 bg-blue-100 rounded-lg mr-2">
            <GraduationCap class="w-4 h-4 text-blue-600" />
          </div>
          Qualifications & Certifications
        </h4>

        <div class="grid grid-cols-1 gap-6">
          <div v-for="qualification in application.user_qualifications.filter(
            (q) => q.is_primary_qualification === true,
          )" :key="qualification.id"
            class="relative bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-4 sm:mb-6 gap-4">
              <div class="space-y-1">
                <h5 class="text-lg font-semibold text-gray-900">
                  {{ qualification.actual_qualification_name_display }}
                </h5>
                <p class="text-gray-600 text-xs">
                  {{ qualification.institute_university_display }}
                </p>
              </div>

              <!-- Status tracker -->
              <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto">
                <div class="flex flex-col sm:flex-row items-center">
                  <div class="flex flex-col items-center mb-2 sm:mb-0">
                    <span class="w-8 h-8 rounded-full flex items-center justify-center shadow-md" :class="[
                      qualification.application_review_status === 'Approved'
                        ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                        : qualification.application_review_status === 'Regretted'
                          ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                          : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                    ]">
                      <CheckCircle v-if="qualification.application_review_status === 'Approved'" class="w-4 h-4" />
                      <XCircle v-else-if="qualification.application_review_status === 'Regretted'" class="w-4 h-4" />
                      <Clock v-else class="w-4 h-4" />
                    </span>
                    <span class="text-xs font-medium mt-1 text-gray-700">Review</span>
                  </div>

                  <div class="hidden sm:block w-6 h-0.5 bg-gray-200"></div>
                  <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1"></div>

                  <div class="flex flex-col items-center mb-2 sm:mb-0">
                    <span class="w-8 h-8 rounded-full flex items-center justify-center shadow-md" :class="[
                      qualification.physical_review_status === 'Approved'
                        ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                        : qualification.physical_review_status === 'Regretted'
                          ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                          : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                    ]">
                      <CheckCircle v-if="qualification.physical_review_status === 'Approved'" class="w-4 h-4" />
                      <XCircle v-else-if="qualification.physical_review_status === 'Regretted'" class="w-4 h-4" />
                      <Clock v-else class="w-4 h-4" />
                    </span>
                    <span class="text-xs font-medium mt-1 text-gray-700">Verify</span>
                  </div>

                  <div class="hidden sm:block w-6 h-0.5 bg-gray-200"></div>
                  <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1"></div>

                  <div class="flex flex-col items-center mb-2 sm:mb-0">
                    <span class="w-8 h-8 rounded-full flex items-center justify-center shadow-md" :class="{
                      'bg-green-100 text-green-700 ring-1 ring-green-200':
                        qualification.payment_status === 'completed',
                      'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200':
                        qualification.payment_status === 'processing_payment',
                      'bg-red-100 text-red-700 ring-1 ring-red-200':
                        qualification.payment_status === 'failed',
                      'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200':
                        qualification.payment_status === 'pending',
                    }">
                      <CheckCircle v-if="qualification.payment_status === 'completed'" class="w-4 h-4" />
                      <XCircle v-else-if="qualification.payment_status === 'failed'" class="w-4 h-4" />
                      <Clock v-else class="w-4 h-4" />
                    </span>
                    <span class="text-xs font-medium mt-1 text-gray-700">Payment</span>
                  </div>

                  <div class="hidden sm:block w-6 h-0.5 bg-gray-200"></div>
                  <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1"></div>

                  <div class="flex flex-col items-center">
                    <span class="w-8 h-8 rounded-full flex items-center justify-center shadow-md" :class="[
                      qualification.endorsement_decision === 'Approved'
                        ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                        : qualification.endorsement_decision === 'Regretted'
                          ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                          : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                    ]">
                      <CheckCircle v-if="qualification.endorsement_decision === 'Approved'" class="w-4 h-4" />
                      <XCircle v-else-if="qualification.endorsement_decision === 'Regretted'" class="w-4 h-4" />
                      <Clock v-else class="w-4 h-4" />
                    </span>
                    <span class="text-xs font-medium mt-1 text-gray-700">Endorse</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                class="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-2">
                  <div class="p-1.5 bg-white rounded-lg shadow-sm">
                    <Building2 class="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-700">Institute</p>
                    <p class="text-xs font-semibold text-gray-900 mt-1 line-clamp-2">
                      {{ qualification.institute_university_display }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="bg-indigo-50 rounded-lg p-3 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-2">
                  <div class="p-1.5 bg-white rounded-lg shadow-sm">
                    <GraduationCap class="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-indigo-700">Qualification</p>
                    <p class="text-xs font-semibold text-gray-900 mt-1 line-clamp-2">
                      {{ qualification.qualification_type_display }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="bg-purple-50 rounded-lg p-3 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-2">
                  <div class="p-1.5 bg-white rounded-lg shadow-sm">
                    <CalendarCheck class="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-purple-700">Completion</p>
                    <p class="text-xs font-semibold text-gray-900 mt-1">
                      {{ qualification.completion_year }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="bg-teal-50 rounded-lg p-3 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-2">
                  <div class="p-1.5 bg-white rounded-lg shadow-sm">
                    <CreditCard class="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-teal-700">Payment</p>
                    <div class="flex items-center space-x-1 mt-1">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm"
                        :class="{
                          'bg-green-100 text-green-800 border border-green-200':
                            qualification.payment_status === 'completed',
                          'bg-red-100 text-red-800 border border-red-200':
                            qualification.payment_status === 'failed',
                          'bg-yellow-100 text-yellow-800 border border-yellow-200':
                            qualification.payment_status === 'processing_payment',
                          'bg-yellow-100 text-yellow-800 border border-yellow-200':
                            qualification.payment_status === 'pending',
                        }">
                        {{
                          qualification.payment_status === 'completed'
                            ? 'Paid'
                            : qualification.payment_status === 'processing_payment'
                              ? 'Processing'
                              : qualification.payment_status === 'failed'
                                ? 'Failed'
                                : 'Pending'
                        }}
                      </span>
                      <span v-if="qualification.payment_id" class="text-xs text-gray-500 truncate">
                        #{{ qualification.payment_id.substring(0, 8) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ✅ ADD THIS NEW BUTTON FOR RENEWAL -->
            <button v-if="['EXPIRED', 'EXPIRING_SOON'].includes(getExpiryStatus(application.expiry_date))"
              @click="initiateRenewal(qualification)"
              class="relative mt-3 inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md">
              <CalendarClock class="w-3 h-3 mr-1.5" />
              <span>Initiate Renewal</span>
            </button>

            <!-- Your existing payment button for NEW applications -->
            <button v-if="
              qualification.physical_review_status === 'Approved' &&
              qualification.endorsement_decision === 'Pending' &&
              qualification.payment_status !== 'completed' &&
              qualification.payment_status !== 'processing_payment'
            " @click="$emit('initiate-payment', { application, qualification })"
              class="relative mt-3 inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md overflow-hidden"
              :class="{
                'animate-border-pulse': qualification.payment_status !== 'failed',
              }">
              <div class="absolute inset-0 border-2 border-transparent animate-border-pulse pointer-events-none"></div>
              <CreditCard class="w-3 h-3 mr-1.5" />
              <span>{{ getPaymentButtonText(application, qualification) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  FileText,
  IdCard,
  BarChart,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building2,
  CalendarCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  CalendarClock, // <-- Import the new icon
} from 'lucide-vue-next'
import apiService from '@/services/services' // Make sure this path is correct
import { useToast } from 'vue-toastification'

const toast = useToast()

defineProps({
  applications: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open-certificate', 'initiate-payment', 'renewal-initiated'])

const isApplicationActive = (application) => {
  // An application is considered active if its primary qualification is active.
  const primaryQual = application.user_qualifications?.find((q) => q.is_primary_qualification)
  return primaryQual?.current_status === 'ACTIVE'
}

// Utility to check expiry status
function getExpiryStatus(expiryDate) {
  if (!expiryDate) return 'Unknown'
  const today = new Date()
  const exp = new Date(expiryDate)
  if (exp < today) return 'EXPIRED'
  // Check if within 3 months (90 days)
  const threeMonthsFromNow = new Date(today)
  threeMonthsFromNow.setMonth(today.getMonth() + 3)
  if (exp <= threeMonthsFromNow) return 'EXPIRING_SOON'
  return 'ACTIVE'
}
const shouldShowViewCertificateButton = (application) => {
  return (
    application.user_qualifications?.some(
      (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved',
    ) ?? false
  )
}

const getPaymentButtonText = (application, qualification) => {
  if (qualification && qualification.payment_status === 'failed') {
    return 'Re-process Payment'
  } else {
    return 'Proceed to Payment'
  }
}

// Method to handle the new "Initiate Renewal" button click
const initiateRenewal = async (qualification) => {
  if (!confirm('Are you sure you want to start the renewal process for this qualification?')) {
    return
  }
  try {
    // This calls the backend action to create a new Renewal object
    await apiService.initiateMhpcQualificationRenewal(qualification.id)
    toast.success(
      'Renewal process has been successfully initiated! You can now track it in the Renewal section.',
    )
    // Emit an event to tell the parent component to refresh all data
    emit('renewal-initiated')
  } catch (error) {
    console.error('Error initiating renewal:', error)
    const errorMsg = error.response?.data?.error || 'Failed to start the renewal process.'
    toast.error(errorMsg)
  }
}
</script>

<style scoped>
@keyframes border-pulse {

  0%,
  100% {
    border-color: rgba(20, 184, 166, 0.3);
    /* teal-500 with opacity */
    transform: scale(1);
  }

  50% {
    border-color: rgba(6, 182, 212, 0.6);
    /* cyan-600 with opacity */
    transform: scale(1.05);
  }
}

.animate-border-pulse {
  animation: border-pulse 2s ease-in-out infinite;
  border-radius: 0.5rem;
  /* Match button's rounded-lg */
}

/* autoprefixer: off */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>