<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <!-- Tabs Navigation - ENHANCED -->
      <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-6 sm:space-x-8" aria-label="Tabs">
              <button
                  v-for="tab in tabs"
                  :key="tab.name"
                  @click="currentTab = tab.name"
                  :class="[
                      currentTab === tab.name
                          ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-4 sm:px-6 border-b-2 font-medium text-base rounded-t-lg transition-all duration-200'
                  ]"
              >
                  {{ tab.label }}
              </button>
          </nav>
      </div>

      <!-- Use the common PageHeader component -->
      <PageHeader
          :title="currentTab === 'new' ? 'Track Your Application' : currentTab === 'renewal' ? 'Track Your Renewal' : 'Track Additional Qualifications'"
          :subtitle="currentTab === 'new' ? 'Your application status is displayed below.' : currentTab === 'renewal' ? 'Your renewal status is displayed below.' : 'Your additional qualifications status is displayed below.'"
      >
          <template #icon>
              <ClipboardList class="w-6 h-6 text-indigo-600" />
          </template>
      </PageHeader>

      <!-- Loading Indicator (Improved) -->
      <div v-if="isLoading" class="my-8 flex justify-center">
           <div class="flex flex-col items-center space-y-3">
               <svg
                   class="animate-spin h-8 w-8 text-blue-600"
                   xmlns="http://www.w3.org/2000/svg"
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
               <p class="text-gray-600 font-medium">Loading your {{ currentTab === 'new' ? 'application' : currentTab === 'renewal' ? 'renewal' : 'additional qualifications' }} data...</p>
           </div>
      </div>

      <!-- Results Section -->
      <!-- Added !isLoading check to prevent showing old data while loading new tab -->
      <div v-if="!isLoading && currentApplications?.length > 0" class="space-y-6">
           <div
               v-for="application in currentApplications"
               :key="application.id"
               class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
           >
               <!-- Main Info Header -->
               <div
                   class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-gray-200"
               >
                   <!-- Action Buttons -->
                   <div class="absolute top-0 right-0 m-2 sm:m-4 flex space-x-2 z-10">
                       <!-- View Certificate Button -->
                       <button
                           v-if="shouldShowViewCertificateButton(application)"
                           @click="openCertificateModal(application)"
                           class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
                       >
                           <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                           <span>View Certificate</span>
                       </button>
                   </div>

                   <div
                       class="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4"
                   >
                       <div class="relative">
                           <div
                               class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl blur-md"
                           ></div>
                           <img
                               :src="application.passport_photo"
                               :alt="application.full_name"
                               class="h-20 w-20 sm:h-24 sm:w-24 relative rounded-xl object-cover ring-4 ring-white shadow-lg"
                           />
                       </div>

                       <div class="flex-1 text-center sm:text-left">
                           <div
                               class="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start"
                           >
                               <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
                                   {{ application.full_name }}
                               </h3>
                               <!--  Header Status Badge  -->
                               <span
                                   class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center w-fit mx-auto sm:mx-0"
                                   :class="
                                       isApplicationActive(application)
                                           ? 'bg-green-100 text-green-800 border border-green-200'
                                           : 'bg-red-100 text-red-800 border border-red-200'
                                   "
                               >
                                   <span
                                       class="w-2 h-2 rounded-full mr-1.5"
                                       :class="
                                           isApplicationActive(application)
                                               ? 'bg-green-500'
                                               : 'bg-red-500'
                                       "
                                   ></span>
                                   {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                               </span>
                           </div>

                           <div
                               class="mt-3 flex flex-col sm:flex-row items-center gap-2 text-gray-600 justify-center sm:justify-start"
                           >
                               <div
                                   class="flex items-center px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-100"
                               >
                                   <IdCard class="w-4 h-4 mr-1 text-blue-600" />
                                   <span
                                       >{{ application.cid_holder ? 'CID' : 'Work Permit' }}:
                                       {{ application.cid_no }}</span
                                   >
                               </div>
                               <div
                                   class="flex items-center px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-100"
                               >
                                   <BarChart class="w-4 h-4 mr-1 text-blue-600" />
                                   <span>Reg No: {{ application.registration_no }}</span>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               <!-- Contact & Registration Info -->
               <div
                   class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-white border-b border-gray-100"
               >
                   <div
                       class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                   >
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
                       class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                   >
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
                       class="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
                   >
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

               <!-- Qualifications Section -->
               <div class="p-4 sm:p-6">
                   <h4
                       class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center"
                   >
                       <div class="p-1.5 bg-blue-100 rounded-lg mr-2">
                           <GraduationCap class="w-4 h-4 text-blue-600" />
                       </div>
                       Qualifications & Certifications
                   </h4>

                   <div class="grid grid-cols-1 gap-6">
                       <div
                           v-for="qualification in application.user_qualifications"
                           :key="qualification.id"
                           class="relative bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300"
                       >
                           <!-- Qualification Header -->
                           <div
                               class="flex flex-col lg:flex-row lg:items-start justify-between mb-4 sm:mb-6 gap-4"
                           >
                               <div class="space-y-1">
                                   <h5 class="text-lg font-semibold text-gray-900">
                                       {{ qualification.qualification_name_display }}
                                   </h5>
                                   <p class="text-gray-600 text-xs">
                                       {{ qualification.institute_university_display }}
                                   </p>
                               </div>

                               <!-- Review Status Timeline - Responsive Version -->
                               <div
                                   class="flex items-center justify-center lg:justify-end w-full lg:w-auto"
                               >
                                   <div class="flex flex-col sm:flex-row items-center">
                                       <!-- Application Review -->
                                       <div class="flex flex-col items-center mb-2 sm:mb-0">
                                           <span
                                               class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                               :class="[
                                                   qualification.application_review_status ===
                                                   'Approved'
                                                       ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                                                       : qualification.application_review_status ===
                                                         'Rejected'
                                                       ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                                                       : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                                               ]"
                                           >
                                               <CheckCircle
                                                   v-if="
                                                       qualification.application_review_status ===
                                                       'Approved'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <XCircle
                                                   v-else-if="
                                                       qualification.application_review_status ===
                                                       'Rejected'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <Clock v-else class="w-4 h-4" />
                                           </span>
                                           <span class="text-xs font-medium mt-1 text-gray-700"
                                               >Review</span
                                           >
                                       </div>

                                       <!-- Connecting Line -->
                                       <div class="hidden sm:block w-6 h-0.5 bg-gray-200"></div>
                                       <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1"></div>

                                       <!-- Physical Verification -->
                                       <div class="flex flex-col items-center mb-2 sm:mb-0">
                                           <span
                                               class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                               :class="[
                                                   qualification.physical_review_status ===
                                                   'Approved'
                                                       ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                                                       : qualification.physical_review_status ===
                                                         'Rejected'
                                                       ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                                                       : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                                               ]"
                                           >
                                               <CheckCircle
                                                   v-if="
                                                       qualification.physical_review_status ===
                                                       'Approved'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <XCircle
                                                   v-else-if="
                                                       qualification.physical_review_status ===
                                                       'Rejected'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <Clock v-else class="w-4 h-4" />
                                           </span>
                                           <span class="text-xs font-medium mt-1 text-gray-700"
                                               >Verify</span
                                           >
                                       </div>

                                       <!-- Connecting Line -->
                                       <div class="hidden sm:block w-6 h-0.5 bg-gray-200"></div>
                                       <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1"></div>

                                       <!-- Payment -->
                                       <div class="flex flex-col items-center mb-2 sm:mb-0">
                                           <span
                                               class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                               :class="{
                                                   'bg-green-100 text-green-700 ring-1 ring-green-200':
                                                       qualification.payment_status ===
                                                       'completed',
                                                   'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200':
                                                       qualification.payment_status ===
                                                       'processing_payment',
                                                   'bg-red-100 text-red-700 ring-1 ring-red-200':
                                                       qualification.payment_status === 'failed',
                                                   'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200':
                                                       qualification.payment_status === 'pending',
                                               }"
                                           >
                                               <CheckCircle
                                                   v-if="
                                                       qualification.payment_status === 'completed'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <XCircle
                                                   v-else-if="
                                                       qualification.payment_status === 'failed'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <Clock v-else class="w-4 h-4" />
                                           </span>
                                           <span class="text-xs font-medium mt-1 text-gray-700"
                                               >Payment</span
                                           >
                                       </div>

                                       <!-- Connecting Line -->
                                       <div class="hidden sm:block w-6 h-0.5 bg-gray-200"></div>
                                       <div class="sm:hidden h-4 w-0.5 bg-gray-200 my-1"></div>

                                       <!-- Endorsement -->
                                       <div class="flex flex-col items-center">
                                           <span
                                               class="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                               :class="[
                                                   qualification.endorsement_decision ===
                                                   'Approved'
                                                       ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                                                       : qualification.endorsement_decision ===
                                                         'Rejected'
                                                       ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                                                       : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
                                               ]"
                                           >
                                               <CheckCircle
                                                   v-if="
                                                       qualification.endorsement_decision ===
                                                       'Approved'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <XCircle
                                                   v-else-if="
                                                       qualification.endorsement_decision ===
                                                       'Rejected'
                                                   "
                                                   class="w-4 h-4"
                                               />
                                               <Clock v-else class="w-4 h-4" />
                                           </span>
                                           <span class="text-xs font-medium mt-1 text-gray-700"
                                               >Endorse</span
                                           >
                                       </div>
                                   </div>
                               </div>
                           </div>

                           <!-- Qualification Details Grid -->
                           <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                               <div
                                   class="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                               >
                                   <div class="flex items-start space-x-2">
                                       <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                           <Building2 class="w-4 h-4 text-blue-600" />
                                       </div>
                                       <div>
                                           <p class="text-xs font-medium text-blue-700">
                                               Institute
                                           </p>
                                           <p
                                               class="text-xs font-semibold text-gray-900 mt-1 line-clamp-2"
                                           >
                                               {{ qualification.institute_university_display }}
                                           </p>
                                       </div>
                                   </div>
                               </div>

                               <div
                                   class="bg-indigo-50 rounded-lg p-3 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md"
                               >
                                   <div class="flex items-start space-x-2">
                                       <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                           <GraduationCap class="w-4 h-4 text-indigo-600" />
                                       </div>
                                       <div>
                                           <p class="text-xs font-medium text-indigo-700">
                                               Qualification
                                           </p>
                                           <p
                                               class="text-xs font-semibold text-gray-900 mt-1 line-clamp-2"
                                           >
                                               {{ qualification.qualification_type_display }}
                                           </p>
                                       </div>
                                   </div>
                               </div>

                               <div
                                   class="bg-purple-50 rounded-lg p-3 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md"
                               >
                                   <div class="flex items-start space-x-2">
                                       <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                           <CalendarCheck class="w-4 h-4 text-purple-600" />
                                       </div>
                                       <div>
                                           <p class="text-xs font-medium text-purple-700">
                                               Completion
                                           </p>
                                           <p class="text-xs font-semibold text-gray-900 mt-1">
                                               {{ qualification.completion_year }}
                                           </p>
                                       </div>
                                   </div>
                               </div>

                               <div
                                   class="bg-teal-50 rounded-lg p-3 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md"
                               >
                                   <div class="flex items-start space-x-2">
                                       <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                           <CreditCard class="w-4 h-4 text-teal-600" />
                                       </div>
                                       <div>
                                           <p class="text-xs font-medium text-teal-700">Payment</p>
                                           <div class="flex items-center space-x-1 mt-1">
                                               <span
                                                   class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm"
                                                   :class="{
                                                       'bg-green-100 text-green-800 border border-green-200':
                                                           qualification.payment_status ===
                                                           'completed',
                                                       'bg-red-100 text-red-800 border border-red-200':
                                                           qualification.payment_status ===
                                                           'failed',
                                                       'bg-yellow-100 text-yellow-800 border border-yellow-200':
                                                           qualification.payment_status ===
                                                           'processing_payment',
                                                       'bg-yellow-100 text-yellow-800 border border-yellow-200':
                                                           qualification.payment_status ===
                                                           'pending',
                                                   }"
                                               >
                                                   {{
                                                       qualification.payment_status === 'completed'
                                                           ? 'Paid'
                                                           : qualification.payment_status ===
                                                             'processing_payment'
                                                           ? 'Processing'
                                                           : qualification.payment_status ===
                                                             'failed'
                                                           ? 'Failed'
                                                           : 'Pending'
                                                   }}
                                               </span>
                                               <span
                                                   v-if="qualification.payment_id"
                                                   class="text-xs text-gray-500 truncate"
                                               >
                                                   #{{ qualification.payment_id.substring(0, 8) }}
                                               </span>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>

                           <button
                               v-if="
                                   qualification.physical_review_status === 'Approved' &&
                                   qualification.endorsement_decision === 'Pending' &&
                                   qualification.payment_status !== 'completed' &&
                                   qualification.payment_status !== 'processing_payment'
                               "
                               @click="initiatePayment(application, qualification)"
                               class="relative mt-3 inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md overflow-hidden"
                               :class="{
                                   'animate-pulse': qualification.payment_status !== 'failed',
                               }"
                           >
                               <!-- Animated Border Effect -->
                               <div
                                   class="absolute inset-0 border-2 border-transparent animate-border-pulse pointer-events-none"
                               ></div>

                               <CreditCard class="w-3 h-3 mr-1.5" />
                               <span>{{ getPaymentButtonText(application, qualification) }}</span>
                           </button>
                       </div>
                   </div>
               </div>
           </div>
      </div>

      <!-- No Results Message -->
       <!-- Added !isLoading check -->
      <div
          v-else-if="!isLoading && hasSearched && !apiError && currentApplications?.length === 0"
          class="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-md"
      >
           <div class="flex flex-col items-center justify-center">
               <div class="p-3 bg-gray-100 rounded-full mb-3">
                   <SearchX class="w-6 h-6 text-gray-400" />
               </div>
               <h3 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                   No {{ currentTab === 'new' ? 'Applications' : currentTab === 'renewal' ? 'Renewals' : 'Additional Qualifications' }} Found
               </h3>
               <p class="text-gray-600 max-w-md mx-auto text-sm px-4">
                   We couldn't find any {{ currentTab === 'new' ? 'applications' : currentTab === 'renewal' ? 'renewals' : 'additional qualifications' }} matching your details.
               </p>
           </div>
      </div>

      <!-- API Error Message -->
       <!-- Added !isLoading check -->
      <div
          v-else-if="!isLoading && apiError"
          class="text-center py-8 sm:py-12 bg-red-50 rounded-xl border border-red-200 shadow-md"
      >
           <div class="flex flex-col items-center justify-center">
               <div class="p-3 bg-red-100 rounded-full mb-3">
                   <AlertTriangle class="w-6 h-6 text-red-500" />
               </div>
               <h3 class="text-lg sm:text-xl font-semibold text-red-700 mb-2">
                   Error Loading Data
               </h3>
               <p class="text-red-600 max-w-md mx-auto text-sm px-4">
                   An error occurred while fetching your {{ currentTab === 'new' ? 'application' : currentTab === 'renewal' ? 'renewal' : 'additional qualifications' }} data. Please try again later
                   or contact support if the problem persists.
               </p>
           </div>
      </div>

      <!-- Certificate Modal -->
      <CertificateModal
          :qualification="selectedApplication"
          :showModal="showCertificateModal"
          @close="closeCertificateModal"
      />

      <!-- Payment Modal -->
      <PaymentModal
          ref="paymentModal"
          :amount="1000"
          @payment-completed="handlePaymentCompleted"
          @close="closePaymentModal"
      />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue' // Removed watch
import apiService from '@/services/services'
import CertificateModal from './CertificateModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
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
  AlertTriangle,
  SearchX,
  ClipboardList,
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()
const authStore = useAuthStore()

// State
const newApplications = ref([])
const renewalApplications = ref([])
const additionalApplications = ref([])
const isLoading = ref(false) // Initialize loading as false
const hasSearched = ref(false) // Tracks if a fetch has been attempted for the *initial* load
const apiError = ref(false)
const showCertificateModal = ref(false)
const selectedApplication = ref(null)
const paymentModal = ref(null)
const selectedQualification = ref(null)
const currentTab = ref('new') // Default tab

// Tabs configuration
const tabs = [
  { name: 'new', label: 'New Applications' },
  { name: 'renewal', label: 'Renewals' },
  { name: 'additional', label: 'Additional Qualifications' },
]

// Computed property for CID
const userCid = computed(() => {
  return authStore.user?.cid
})

// Computed property to determine which applications to display
const currentApplications = computed(() => {
  // Ensure isLoading is false before showing data for the selected tab
  // This prevents flashing old data when switching tabs if loading takes time
  if (isLoading.value) {
      return []; // Return empty array while loading
  }
  if (currentTab.value === 'new') return newApplications.value
  if (currentTab.value === 'renewal') return renewalApplications.value
  if (currentTab.value === 'additional') return additionalApplications.value
  return [] // Default
})

// --- Methods ---

const getPaymentButtonText = (application, qualification) => {
  if (qualification && qualification.payment_status === 'failed') {
      return 'Re-process Payment'
  } else {
      return 'Proceed to Payment'
  }
}

// Fetch New Applications
const fetchNewApplications = async () => {
  isLoading.value = true // Set loading true for this specific fetch
  apiError.value = false // Reset error status potentially set by other fetches
  // Note: hasSearched is set globally in onMounted after initial fetches attempt
  try {
      let response
      if (userCid.value) {
          response = await apiService.getMhpcFullApplicationListByCid(userCid.value)
      }

      if (response && response.data && response.data.results) {
          newApplications.value = response.data.results.filter(app => !app.is_renewal && !app.is_additional)
      } else {
          newApplications.value = []
      }
  } catch (error) {
      console.error('Error fetching new applications:', error)
      newApplications.value = []
      apiError.value = true // Set error flag
      toast.error('Failed to load new application data.') // Specific error toast
  } finally {
       // Only set loading false after *this specific* fetch is done
       // Global loading state might be complex if fetches run concurrently
       // Simplest approach: let onMounted manage global loading
       // For now: Assume fetches are sequential or manage loading carefully
       isLoading.value = false
  }
}

// Fetch Renewal Applications
const fetchRenewalApplications = async () => {
  isLoading.value = true
  apiError.value = false
  try {
      let response
      if (userCid.value) {
          response = await apiService.getMhpcRenewals()
      }

      if (response && response.data && response.data.results) {
          renewalApplications.value = response.data.results
      } else {
          renewalApplications.value = []
      }
  } catch (error) {
      console.error('Error fetching renewal applications:', error)
      renewalApplications.value = []
      apiError.value = true
      toast.error('Failed to load renewal data.')
  } finally {
      isLoading.value = false
  }
}

// Fetch Additional Applications (Restored to original structure)
const fetchAdditionalApplications = async () => {
  isLoading.value = true
  apiError.value = false
  try {
      let response
      if (userCid.value) {
          response = await apiService.getMhpcFullApplicationListByCid(userCid.value)
      }

      if (response && response.data && response.data.results) {
          additionalApplications.value = response.data.results.filter(app => app.is_additional)
      } else {
          additionalApplications.value = []
      }
  } catch (error) {
      console.error('Error fetching additional applications:', error)
      additionalApplications.value = []
      apiError.value = true
      toast.error('Failed to load additional qualifications data.')
  } finally {
      isLoading.value = false
  }
}


const isApplicationActive = (application) => {
  return application.user_qualifications?.some(
      (qualification) => qualification.endorsement_decision === 'Approved'
  ) ?? false
}

const openCertificateModal = (application) => {
  selectedApplication.value = { results: [application] }
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedApplication.value = null
}

const initiatePayment = (application, qualification) => {
  if (qualification) {
      selectedQualification.value = qualification
      if (paymentModal.value) {
        paymentModal.value.openModal()
      } else {
        console.error("Payment modal reference is not available.");
        toast.error("Payment modal could not be opened.");
      }
  } else {
      toast.error('No specific qualification provided for payment.')
  }
}

const shouldShowViewCertificateButton = (application) => {
  return application.user_qualifications?.some(
      (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved'
  ) ?? false
}

const closePaymentModal = () => {
  selectedQualification.value = null // Clear selection when modal closes
}

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedQualification.value) {
      toast.error('No qualification selected for payment.')
      return
  }

  const qualificationId = selectedQualification.value.id
  const paymentId = paymentData.paymentHash
  const user = authStore.user

  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
      toast.error('Missing user information. Please update your profile.')
      return
  }

  const paymentProcessing = ref(false); // Local loading state for this action

  try {
      paymentProcessing.value = true;
      isLoading.value = true; // Use global loading indicator during payment processing

      const paymentInitiationFormData = new FormData()
      paymentInitiationFormData.append('refNo', paymentId)
      paymentInitiationFormData.append('serviceCode', '100196')
      paymentInitiationFormData.append('taxPayerName', user.cid)
      paymentInitiationFormData.append('taxPayerNo', user.cid)
      paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
      paymentInitiationFormData.append('totalPayableAmount', 1000)
      paymentInitiationFormData.append('description', 'MHPC Qualification Registration Fee')
      paymentInitiationFormData.append('mobileNo', user.contact_number)
      paymentInitiationFormData.append('payerEmail', user.email)
      paymentInitiationFormData.append('user', user.id)
      paymentInitiationFormData.append('payableAmount', 1000)
      paymentInitiationFormData.append('application_no', selectedQualification.value.id)
      paymentInitiationFormData.append('app_type', 'specification_for_health_certification')

      await apiService.makePayment(paymentInitiationFormData)

      const updateFormData = new FormData()
      updateFormData.append('payment_id', paymentId)
      updateFormData.append('payment_status', 'processing_payment')

      await apiService.patchMhpcNewQualification(qualificationId, updateFormData)

       // --- Update Local State ---
       // Find the correct application list based on currentTab or qualification type
       let targetAppList;
       if (selectedQualification.value.application_type === 'renewal') { // Assuming qualification has type info
            targetAppList = renewalApplications;
       } else if (selectedQualification.value.application_type === 'additional') {
            targetAppList = additionalApplications;
       } else {
            targetAppList = newApplications;
       }

       // Find the application within the correct list
        // Need application ID on qualification, or find based on qualification ID structure if possible
       const app = targetAppList.value.find(a => a.user_qualifications.some(q => q.id === qualificationId));

       if (app) {
            const qualIndex = app.user_qualifications.findIndex(q => q.id === qualificationId);
            if (qualIndex > -1) {
                 app.user_qualifications[qualIndex].payment_id = paymentId;
                 app.user_qualifications[qualIndex].payment_status = 'processing_payment';
            }
       } else {
            // Fallback if application not found easily - refresh all data later
            console.warn("Could not find application in local state to update payment status directly.");
       }
        // Update the selectedQualification ref directly as well for immediate feedback if needed
        selectedQualification.value.payment_id = paymentId;
        selectedQualification.value.payment_status = 'processing_payment';
       // --- End Update Local State ---


      toast.success(`Payment initiated (Ref: ${paymentId.substring(0,8)}...). Status: Processing.`)

       // Refresh data after processing
       // Call individual fetches again to ensure UI consistency
       await fetchNewApplications();
       await fetchRenewalApplications();
       await fetchAdditionalApplications(); // Ensure this is called

  } catch (error) {
      console.error('Payment handling error:', error.response || error.request || error)
      let errorMsg = 'An error occurred while processing the payment confirmation.'
       if (error.response?.data) {
            const detail = error.response.data.detail || JSON.stringify(error.response.data)
            errorMsg = `Payment API Error: ${detail}`;
       } else if (error.request) {
           errorMsg = 'Network Error: Could not reach the server to confirm payment.';
       }
        toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if issue persists.`);
        // Optionally revert local state status here if needed
        if (selectedQualification.value) {
            selectedQualification.value.payment_status = 'failed'; // Example revert
        }

  } finally {
      paymentProcessing.value = false;
      isLoading.value = false; // Stop global loading indicator
      // selectedQualification.value = null // Keep selectedQualification until modal is closed by user?
  }
}

// Lifecycle Hook
onMounted(async () => { // Make onMounted async
  if (userCid.value) {
      isLoading.value = true; // Set loading true before starting fetches
      apiError.value = false; // Reset error state
      hasSearched.value = false; // Reset search state

      try {
          // Run fetches sequentially or in parallel
          // Sequential example:
          // await fetchNewApplications();
          // await fetchRenewalApplications();
          // await fetchAdditionalApplications();

          // Parallel example (potentially faster, but error handling needs care):
           await Promise.all([
               fetchNewApplications(), // Call the restored functions
               fetchRenewalApplications(),
               fetchAdditionalApplications()
           ]);

      } catch (err) {
          // This catch block might be less useful if individual fetches handle their own errors
          // and set apiError.value = true
          console.error("Error during initial data fetch:", err);
          apiError.value = true; // Ensure error state is set if Promise.all fails
      } finally {
          isLoading.value = false; // Set loading false after all fetches complete or fail
          hasSearched.value = true; // Mark that initial search attempt has completed
      }
  } else {
      console.warn('User CID not available.');
      toast.warning('Please log in to view your application status.');
      apiError.value = true; // Set error state as data cannot be loaded
      hasSearched.value = true; // Mark search as 'attempted' even though it failed due to missing CID
      isLoading.value = false; // Ensure loading is false
  }
});

</script>

<style scoped>
@keyframes border-pulse {
  0%,
  100% {
      border-color: rgba(20, 184, 166, 0.3);
      transform: scale(1);
  }

  50% {
      border-color: rgba(6, 182, 212, 0.6);
      transform: scale(1.05);
  }
}

.animate-border-pulse {
  animation: border-pulse 2s ease-in-out infinite;
  border-radius: 0.5rem;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure buttons are clickable */
button {
    cursor: pointer;
}

/* Improve loading state visibility */
[v-if="isLoading"] {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Style adjustments for clarity */
.bg-gradient-to-r.from-indigo-100 {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
    --tw-gradient-from: #e0e7ff; /* indigo-100 */
    --tw-gradient-to: rgba(224, 231, 255, 0);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to);
    --tw-gradient-via: #eff6ff; /* blue-50 */
    --tw-gradient-to: #e0e7ff; /* indigo-100 */
}
</style>