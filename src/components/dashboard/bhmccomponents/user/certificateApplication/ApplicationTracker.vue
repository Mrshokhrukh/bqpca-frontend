<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 mb-8 sm:mb-10">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-sm sm:text-base text-gray-600 text-center max-w-2xl mx-auto">
        Your application status is displayed below.
      </p>
    </div>

    <!-- Loading Indicator (Enhanced) -->
    <div v-if="isLoading" class="my-8 sm:my-12 flex justify-center">
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <div class="absolute inset-0 rounded-full animate-ping opacity-30 bg-blue-400 blur-sm"></div>
        </div>
        <p class="text-gray-600 font-medium">Loading your application data...</p>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="applications?.length > 0" class="space-y-8 sm:space-y-10">
      <div v-for="application in applications" :key="application.id"
        class="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <!-- Main Info Header -->
        <div class="relative bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <!-- Action Buttons - Responsive positioning -->
          <div
            class="absolute top-0 right-0 m-2 sm:m-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 z-10">
            <!-- View Certificate Button -->
            <button v-if="shouldShowViewCertificateButton(application)" @click="openCertificateModal(application)"
              class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md">
              <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span>View Certificate</span>
            </button>
          </div>

          <div class="p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 sm:gap-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl blur-md">
              </div>
              <img :src="application.passport_photo" :alt="application.full_name"
                class="h-24 w-24 sm:h-28 sm:w-28 relative rounded-xl object-cover ring-4 ring-white shadow-lg" />
            </div>

            <div class="flex-1 text-center">
              <div class="flex flex-col items-center gap-3 justify-center">
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900">{{ application.full_name }}</h3>
                <!--  Header Status Badge  -->
                <span
                  class="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium inline-flex items-center justify-center w-fit"
                  :class="isApplicationActive(application) ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'">
                  <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-1.5"
                    :class="isApplicationActive(application) ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div class="mt-4 flex flex-col items-center gap-3 text-gray-600 justify-center">
                <div
                  class="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                  <IdCard class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600" />
                  <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}: {{ application.cid_no }}</span>
                </div>
                <div
                  class="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                  <BarChart class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600" />
                  <span>Reg No: {{ application.registration_no }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Registration Info -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:px-6 sm:py-6 lg:px-8 bg-white border-b border-gray-100">
          <div
            class="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div class="mt-1 p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Phone class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-xs sm:text-sm font-semibold text-gray-900">Contact Information</p>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">{{ application.contact_no }}</p>
              <p class="text-xs sm:text-sm text-gray-600">{{ application.email_address }}</p>
            </div>
          </div>

          <div
            class="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div class="mt-1 p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-xs sm:text-sm font-semibold text-gray-900">Location</p>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">
                {{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}
              </p>
            </div>
          </div>

          <div
            class="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div class="mt-1 p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Calendar class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-xs sm:text-sm font-semibold text-gray-900">Registration Period</p>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">
                {{ new Date(application.registration_date).toLocaleDateString() }} -
                {{ new Date(application.expiry_date).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Qualifications Section -->
        <div class="p-4 sm:p-6 lg:p-8">
          <h4 class="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8 flex items-center">
            <div class="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
              <GraduationCap class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            Qualifications & Certifications
          </h4>

          <div class="grid grid-cols-1 gap-6 sm:gap-8">
            <div v-for="qualification in application.user_qualifications" :key="qualification.id"
              class="relative bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300">

              <!-- Qualification Header -->
              <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                <div class="space-y-1 sm:space-y-2">
                  <h5 class="text-lg sm:text-xl font-semibold text-gray-900">
                    {{ qualification.qualification_name_display }}
                  </h5>
                  <p class="text-xs sm:text-sm text-gray-600">
                    {{ qualification.institute_university_display }}
                  </p>
                </div>

                <!-- Review Status Timeline - Responsive Version -->
                <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto overflow-x-auto pb-2">
                  <div class="flex flex-row items-center min-w-max">
                    <!-- Application Review -->
                    <div class="flex flex-col items-center">
                      <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md"
                        :class="[
      qualification.application_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
        qualification.application_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
          'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    ]">
                        <CheckCircle v-if="qualification.application_review_status === 'Approved'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <XCircle v-else-if="qualification.application_review_status === 'Rejected'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <Clock v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <span class="text-xs font-medium mt-1 sm:mt-2 text-gray-700">Review</span>
                    </div>

                    <!-- Connecting Line -->
                    <div class="w-6 sm:w-8 h-0.5 bg-gray-200 mx-1"></div>

                    <!-- Physical Verification -->
                    <div class="flex flex-col items-center">
                      <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md"
                        :class="[
      qualification.physical_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
        qualification.physical_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
          'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    ]">
                        <CheckCircle v-if="qualification.physical_review_status === 'Approved'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <XCircle v-else-if="qualification.physical_review_status === 'Rejected'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <Clock v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <span class="text-xs font-medium mt-1 sm:mt-2 text-gray-700">Verify</span>
                    </div>

                    <!-- Connecting Line -->
                    <div class="w-6 sm:w-8 h-0.5 bg-gray-200 mx-1"></div>

                    <!-- Payment -->
                    <div class="flex flex-col items-center">
                      <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md"
                        :class="{
      'bg-green-100 text-green-700 ring-1 ring-green-200': qualification.payment_status === 'completed',
      'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'processing_payment',
      'bg-red-100 text-red-700 ring-1 ring-red-200': qualification.payment_status === 'failed',
      'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'pending',
    }">
                        <CheckCircle v-if="qualification.payment_status === 'completed'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <XCircle v-else-if="qualification.payment_status === 'failed'" class="w-4 h-4 sm:w-5 sm:h-5" />
                        <Clock v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <span class="text-xs font-medium mt-1 sm:mt-2 text-gray-700">Payment</span>
                    </div>

                    <!-- Connecting Line -->
                    <div class="w-6 sm:w-8 h-0.5 bg-gray-200 mx-1"></div>

                    <!-- Endorsement -->
                    <div class="flex flex-col items-center">
                      <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md"
                        :class="[
      qualification.endorsement_decision === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
        qualification.endorsement_decision === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
          'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    ]">
                        <CheckCircle v-if="qualification.endorsement_decision === 'Approved'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <XCircle v-else-if="qualification.endorsement_decision === 'Rejected'"
                          class="w-4 h-4 sm:w-5 sm:h-5" />
                        <Clock v-else class="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <span class="text-xs font-medium mt-1 sm:mt-2 text-gray-700">Endorse</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Qualification Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div
                  class="bg-blue-50 rounded-xl p-3 sm:p-5 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-2 sm:space-x-3">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                      <Building2 class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-xs sm:text-sm font-medium text-blue-700">Institute</p>
                      <p class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 sm:mt-2">{{
      qualification.institute_university_display
    }}</p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-indigo-50 rounded-xl p-3 sm:p-5 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-2 sm:space-x-3">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                      <GraduationCap class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p class="text-xs sm:text-sm font-medium text-indigo-700">Qualification Type</p>
                      <p class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 sm:mt-2">{{
        qualification.qualification_type_display }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-purple-50 rounded-xl p-3 sm:p-5 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-2 sm:space-x-3">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                      <CalendarCheck class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div>
                      <p class="text-xs sm:text-sm font-medium text-purple-700">Completion Year</p>
                      <p class="text-xs sm:text-sm font-semibold text-gray-900 mt-1 sm:mt-2">{{
      qualification.completion_year }}</p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-teal-50 rounded-xl p-3 sm:p-5 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-2 sm:space-x-3">
                    <div class="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                      <CreditCard class="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    </div>
                    <div>
                      <p class="text-xs sm:text-sm font-medium text-teal-700">Payment Status</p>
                      <div class="flex items-center space-x-2 mt-1 sm:mt-2">
                        <span
                          class="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium shadow-sm"
                          :class="{
      'bg-green-100 text-green-800 border border-green-200': qualification.payment_status === 'completed',
      'bg-red-100 text-red-800 border border-red-200': qualification.payment_status === 'failed',
      'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'processing_payment',
      'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'pending',
    }">
                          {{ qualification.payment_status === 'completed' ? 'Paid' : qualification.payment_status ===
      'processing_payment' ? 'Processing' : qualification.payment_status === 'failed' ? 'Failed' :
      'Pending' }}
                        </span>
                        <span v-if="qualification.payment_id" class="text-xs text-gray-500">
                          #{{ qualification.payment_id }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enhanced Payment Button with Pulsating Effect -->
              <div
                v-if="qualification.physical_review_status === 'Approved' && qualification.endorsement_decision === 'Pending' && qualification.payment_status !== 'completed' && qualification.payment_status !== 'processing_payment'"
                class="mt-6 flex justify-center sm:justify-start">
                <div class="relative group">
                  <!-- Pulsating border effect -->
                  <span
                    class="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg blur opacity-60 group-hover:opacity-80 animate-pulse"></span>
                  <button @click="initiatePayment(application, qualification)"
                    class="relative inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all shadow-lg group-hover:shadow-xl">
                    <span class="absolute inset-0 overflow-hidden rounded-lg">
                      <span
                        class="absolute inset-0 -translate-x-full hover:animate-shine bg-gradient-to-r from-yellow-400/0 via-yellow-400/70 to-yellow-400/0"></span>
                    </span>
                    <CreditCard class="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    <span class="font-medium">{{ getPaymentButtonText(application, qualification) }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message - Responsive -->
    <div v-else-if="hasSearched && !apiError"
      class="text-center py-12 sm:py-16 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
      <div class="flex flex-col items-center justify-center px-4">
        <div class="p-3 sm:p-4 bg-gray-100 rounded-full mb-4">
          <SearchX class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Applications Found</h3>
        <p class="text-sm sm:text-base text-gray-600 max-w-md mx-auto">We couldn't find any applications matching your
          search criteria.
          Please try again with different details.</p>
      </div>
    </div>

    <!-- API Error Message - Responsive -->
    <div v-else-if="apiError" class="text-center py-12 sm:py-16 bg-red-50 rounded-xl border border-red-200 shadow-md">
      <div class="flex flex-col items-center justify-center px-4">
        <div class="p-3 sm:p-4 bg-red-100 rounded-full mb-4">
          <AlertTriangle class="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
        <p class="text-sm sm:text-base text-red-600 max-w-md mx-auto">An error occurred while fetching your application
          data. Please try
          again later or contact support if the problem persists.</p>
      </div>
    </div>

    <!-- Certificate Modal -->
    <CertificateModal :qualification="selectedApplication" :showModal="showCertificateModal"
      @close="closeCertificateModal" />

    <!-- Payment Modal -->
    <PaymentModal ref="paymentModal" @payment-completed="handlePaymentCompleted" @close="closePaymentModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';  // Import onMounted and computed
import apiService from '@/services/services';
import CertificateModal from './CertificateModal.vue';
import PaymentModal from '@/components/common/PaymentModal.vue';
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
  AlertTriangle, SearchX
} from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const authStore = useAuthStore();

// State
const applications = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);
const apiError = ref(false);
const showCertificateModal = ref(false);
const selectedApplication = ref(null);
const paymentModal = ref(null); // Ref for PaymentModal
const selectedQualification = ref(null);

// Computed property for CID
const userCid = computed(() => {
  return authStore.user?.cid;
});


// Methods

const getPaymentButtonText = (application, qualification) => {
  //check for qualification first, if no qualification is passed, it checks the application
  if (qualification && qualification.payment_status === 'failed') {
    return 'Re-process Payment';
  } else {
    return 'Proceed to Payment';
  }
};

const fetchApplications = async () => {
  isLoading.value = true;
  apiError.value = false;
  hasSearched.value = true;

  try {
    let response;
    if (userCid.value) {
      response = await apiService.getFullApplicationListByCid(userCid.value);
    }


    if (response && response.data && response.data.results) {
      applications.value = response.data.results;
    } else {
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
    apiError.value = true;
    toast.error('Failed to load application data. Please check your connection or try again later.'); // Show a user-friendly error
  } finally {
    isLoading.value = false;
  }
};

const isApplicationActive = (application) => {
  return application.user_qualifications.some(
    (qualification) => qualification.endorsement_decision === 'Approved'
  );
};

const openCertificateModal = (application) => {
  selectedApplication.value = { results: [application] };
  showCertificateModal.value = true;
};

const closeCertificateModal = () => {
  showCertificateModal.value = false;
  selectedApplication.value = null;
};

const initiatePayment = (application, qualification) => {
  // Directly use the passed qualification
  if (qualification) {
    selectedQualification.value = qualification;
    paymentModal.value.openModal();
  } else {
    toast.error("No pending payment found for this qualification.");
  }
};
const shouldShowViewCertificateButton = (application) => {
  return application.user_qualifications.some(
    (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved'
  );
};

const closePaymentModal = () => {
  selectedQualification.value = null; // Reset on close
};

// New method to handle payment completion
const handlePaymentCompleted = async (paymentData) => {
  if (!selectedQualification.value) {
    toast.error("No qualification selected for payment.");
    return;
  }

  const qualificationId = selectedQualification.value.id;
  const paymentId = paymentData.paymentHash;
  const user = authStore.user; // Get user details for convenience

  // Check if required user data exists
  if (!user || !user.contact_number || !user.email || !user.cid) {
    toast.error("Missing user information. Please update your profile.");
    return;
  }

  try {
    isLoading.value = true;

    // 1. Initiate Payment (Actual payment processing) - Using FormData
    const paymentInitiationFormData = new FormData();
    paymentInitiationFormData.append('refNo', paymentId); // Corrected: Use paymentId as refNo
    paymentInitiationFormData.append('serviceCode', 'registration_fee_for_health_professional');
    paymentInitiationFormData.append('taxPayerName', user.cid);  // Corrected: Use user.cid
    paymentInitiationFormData.append('totalPayableAmount', 1000); // Use the actual amount
    paymentInitiationFormData.append('description', 'BHMC Qualification Registration Fee'); // Example description
    paymentInitiationFormData.append('mobileNo', user.contact_number); // Corrected: Use user.contact_number
    paymentInitiationFormData.append('payerEmail', user.email);  // Corrected: Use user.email
    paymentInitiationFormData.append('user', user.id); //Still send user ID for backend reference
    paymentInitiationFormData.append('amount', 1000); // Ensure 'amount' is still sent for clarity.

    // Make the payment *before* updating the qualification
    await apiService.makePayment(paymentInitiationFormData);

    // 2. Update BHMC Qualification (payment_id and status) - Using FormData
    const updateFormData = new FormData();
    updateFormData.append('payment_id', paymentId);
    updateFormData.append('payment_status', "processing_payment");

    await apiService.updateBhmcNewQualification(qualificationId, updateFormData);

    // 3. Local state update (optional)
    selectedQualification.value.payment_id = paymentId;
    selectedQualification.value.payment_status = "processing_payment";

    toast.success(`Payment initiated! ID: ${paymentId}. ${paymentData.message}`);

  } catch (error) {
    console.error("Payment update error:", error);
    if (error.response) {
      if (error.response.data) {
        if (error.response.data.detail) {
          toast.error('API Error: ' + error.response.data.detail);
        }
        else {
          toast.error('API Error: ' + JSON.stringify(error.response.data));
        }
      }
      else {
        toast.error('API Error: ' + error.response.statusText);
      }
    }
    else if (error.request) {
      toast.error('Network Error: No response from server');
    }

    else {
      toast.error('Payment request generated successfully, but there was an error confirming the payment. Contact us with the payment id for the next course of action: ' + paymentId);
    }
  } finally {
    isLoading.value = false;
    selectedQualification.value = null;
    fetchApplications();
  }
};


onMounted(() => {
  if (userCid.value) {
    fetchApplications();
  } else {
    console.warn('User CID not available.');
    toast.warning("Please log in to view your application status.");
    apiError.value = true; // Optionally set an error state
  }

});
</script>

<style scoped>
@keyframes shine {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  .animate-shine {
    animation: shine 1.5s infinite;
  }
</style>
