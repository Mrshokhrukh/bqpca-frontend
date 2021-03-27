<template>
  <div class="mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Your application status is displayed below.
      </p>
    </div>

    <!-- Loading Indicator (Improved) -->
    <div v-if="isLoading" class="my-12 flex justify-center">
      <div class="flex flex-col items-center space-y-4">
        <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="text-gray-600 font-medium">Loading your application data...</p>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="applications?.length > 0" class="space-y-10">
      <div v-for="application in applications" :key="application.id"
        class="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <!-- Main Info Header -->
        <div class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-gray-200">
          <!-- Action Buttons -->
          <div class="absolute top-0 right-0 m-4 flex space-x-3 z-10">

            <!-- View Certificate Button -->
            <button v-if="shouldShowViewCertificateButton(application)" @click="openCertificateModal(application)"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md">
              <FileText class="w-4 h-4 mr-2" />
              <span>View Certificate</span>
            </button>
          </div>

          <div class="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl blur-md">
              </div>
              <img :src="application.passport_photo" :alt="application.full_name"
                class="h-28 w-28 relative rounded-xl object-cover ring-4 ring-white shadow-lg" />
            </div>

            <div class="flex-1 text-center md:text-left">
              <div class="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                <h3 class="text-2xl font-bold text-gray-900">{{ application.full_name }}</h3>
                <!--  Header Status Badge  -->
                <span
                  class="px-4 py-1 rounded-full text-sm font-medium inline-flex items-center justify-center w-fit mx-auto md:mx-0"
                  :class="isApplicationActive(application) ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'">
                  <span class="w-2 h-2 rounded-full mr-1.5"
                    :class="isApplicationActive(application) ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div
                class="mt-4 flex flex-col md:flex-row items-center gap-4 text-gray-600 justify-center md:justify-start">
                <div class="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <IdCard class="w-5 h-5 mr-2 text-blue-600" />
                  <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}: {{ application.cid_no }}</span>
                </div>
                <div class="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <BarChart class="w-5 h-5 mr-2 text-blue-600" />
                  <span>Reg No: {{ application.registration_no }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Registration Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-6 bg-white border-b border-gray-100">
          <div
            class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div class="mt-1 p-2 bg-blue-100 rounded-lg">
              <Phone class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Contact Information</p>
              <p class="text-sm text-gray-600 mt-1">{{ application.contact_no }}</p>
              <p class="text-sm text-gray-600">{{ application.email_address }}</p>
            </div>
          </div>

          <div
            class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div class="mt-1 p-2 bg-blue-100 rounded-lg">
              <MapPin class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Location</p>
              <p class="text-sm text-gray-600 mt-1">
                {{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}
              </p>
            </div>
          </div>

          <div
            class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div class="mt-1 p-2 bg-blue-100 rounded-lg">
              <Calendar class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">Registration Period</p>
              <p class="text-sm text-gray-600 mt-1">
                {{ new Date(application.registration_date).toLocaleDateString() }} -
                {{ new Date(application.expiry_date).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Qualifications Section -->
        <div class="p-8">
          <h4 class="text-xl font-semibold text-gray-900 mb-8 flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg mr-3">
              <GraduationCap class="w-5 h-5 text-blue-600" />
            </div>
            Qualifications & Certifications
          </h4>

          <div class="grid grid-cols-1 gap-8">
            <div v-for="qualification in application.user_qualifications" :key="qualification.id"
              class="relative bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-xl transition-all duration-300">

              <!-- Qualification Header -->
              <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
                <div class="space-y-2">
                  <h5 class="text-xl font-semibold text-gray-900">
                    {{ qualification.qualification_name_display }}
                  </h5>
                  <p class="text-gray-600 text-sm">
                    {{ qualification.institute_university_display }}
                  </p>
                </div>

                <!-- Review Status Timeline - Responsive Version -->
                <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto">
                  <div class="flex flex-col sm:flex-row items-center">
                    <!-- Application Review -->
                    <div class="flex flex-col items-center mb-4 sm:mb-0">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md" :class="[
      qualification.application_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
        qualification.application_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
          'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    ]">
                        <CheckCircle v-if="qualification.application_review_status === 'Approved'" class="w-5 h-5" />
                        <XCircle v-else-if="qualification.application_review_status === 'Rejected'" class="w-5 h-5" />
                        <Clock v-else class="w-5 h-5" />
                      </span>
                      <span class="text-xs font-medium mt-2 text-gray-700">Review</span>
                    </div>

                    <!-- Connecting Line -->
                    <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                    <div class="sm:hidden h-6 w-0.5 bg-gray-200 my-1"></div>

                    <!-- Physical Verification -->
                    <div class="flex flex-col items-center mb-4 sm:mb-0">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md" :class="[
      qualification.physical_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
        qualification.physical_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
          'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    ]">
                        <CheckCircle v-if="qualification.physical_review_status === 'Approved'" class="w-5 h-5" />
                        <XCircle v-else-if="qualification.physical_review_status === 'Rejected'" class="w-5 h-5" />
                        <Clock v-else class="w-5 h-5" />
                      </span>
                      <span class="text-xs font-medium mt-2 text-gray-700">Verify</span>
                    </div>

                    <!-- Connecting Line -->
                    <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                    <div class="sm:hidden h-6 w-0.5 bg-gray-200 my-1"></div>

                    <!-- Payment -->
                    <div class="flex flex-col items-center mb-4 sm:mb-0">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md" :class="{
      'bg-green-100 text-green-700 ring-1 ring-green-200': qualification.payment_status === 'completed',
      'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'processing_payment',
      'bg-red-100 text-red-700 ring-1 ring-red-200': qualification.payment_status === 'failed',
      'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'pending',
    }">
                        <CheckCircle v-if="qualification.payment_status === 'completed'" class="w-5 h-5" />
                        <XCircle v-else-if="qualification.payment_status === 'failed'" class="w-5 h-5" />
                        <Clock v-else class="w-5 h-5" />
                      </span>
                      <span class="text-xs font-medium mt-2 text-gray-700">Payment</span>
                    </div>

                    <!-- Connecting Line -->
                    <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                    <div class="sm:hidden h-6 w-0.5 bg-gray-200 my-1"></div>

                    <!-- Endorsement -->
                    <div class="flex flex-col items-center">
                      <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md" :class="[
      qualification.endorsement_decision === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' :
        qualification.endorsement_decision === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' :
          'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
    ]">
                        <CheckCircle v-if="qualification.endorsement_decision === 'Approved'" class="w-5 h-5" />
                        <XCircle v-else-if="qualification.endorsement_decision === 'Rejected'" class="w-5 h-5" />
                        <Clock v-else class="w-5 h-5" />
                      </span>
                      <span class="text-xs font-medium mt-2 text-gray-700">Endorse</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Qualification Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  class="bg-blue-50 rounded-xl p-5 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <Building2 class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-blue-700">Institute</p>
                      <p class="text-sm font-semibold text-gray-900 mt-2">{{ qualification.institute_university_display
                        }}</p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-indigo-50 rounded-xl p-5 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <GraduationCap class="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-indigo-700">Qualification Type</p>
                      <p class="text-sm font-semibold text-gray-900 mt-2">{{ qualification.qualification_type_display }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-purple-50 rounded-xl p-5 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <CalendarCheck class="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-purple-700">Completion Year</p>
                      <p class="text-sm font-semibold text-gray-900 mt-2">{{ qualification.completion_year }}</p>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-teal-50 rounded-xl p-5 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                  <div class="flex items-start space-x-3">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                      <CreditCard class="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-teal-700">Payment Status</p>
                      <div class="flex items-center space-x-2 mt-2">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                          :class="{
      'bg-green-100 text-green-800 border border-green-200': qualification.payment_status === 'completed',
      'bg-red-100 text-red-800 border border-red-200': qualification.payment_status === 'failed',
      'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'processing_payment', // Correct Order
      'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'pending',  // Correct Order
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

              <button
                v-if="qualification.physical_review_status === 'Approved' && qualification.endorsement_decision === 'Pending' && qualification.payment_status !== 'completed' && qualification.payment_status !== 'processing_payment'"
                @click="initiatePayment(application, qualification)"
                class="relative mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg overflow-hidden"
                :class="{ 'animate-pulse': qualification.payment_status !== 'failed' }">
                <!-- Animated Border Effect -->
                <div class="absolute inset-0 border-4 border-transparent animate-border-pulse pointer-events-none">
                </div>

                <CreditCard class="w-4 h-4 mr-2" />
                <span>{{ getPaymentButtonText(application, qualification) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-else-if="hasSearched && !apiError"
      class="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 shadow-md">
      <div class="flex flex-col items-center justify-center">
        <div class="p-4 bg-gray-100 rounded-full mb-4">
          <SearchX class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Applications Found</h3>
        <p class="text-gray-600 max-w-md mx-auto">We couldn't find any applications matching your search criteria.
          Please try again with different details.</p>
      </div>
    </div>

    <!-- API Error Message -->
    <div v-else-if="apiError" class="text-center py-16 bg-red-50 rounded-xl border border-red-200 shadow-md">
      <div class="flex flex-col items-center justify-center">
        <div class="p-4 bg-red-100 rounded-full mb-4">
          <AlertTriangle class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
        <p class="text-red-600 max-w-md mx-auto">An error occurred while fetching your application data. Please try
          again later or contact support if the problem persists.</p>
      </div>
    </div>

    <!-- Certificate Modal -->
    <CertificateModal :qualification="selectedApplication" :showModal="showCertificateModal"
      @close="closeCertificateModal" />

    <!-- Payment Modal -->
    <PaymentModal ref="paymentModal" :amount="1000" @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal" />

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
      response = await apiService.getEpcFullApplicationListByCid(userCid.value);
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
    paymentInitiationFormData.append('refNo', paymentId);
    paymentInitiationFormData.append('serviceCode', 'registration_fee_for_health_professional');
    paymentInitiationFormData.append('taxPayerName', user.cid);
    paymentInitiationFormData.append('taxPayerNo', user.cid);
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
    paymentInitiationFormData.append('totalPayableAmount', 1000);
    paymentInitiationFormData.append('description', 'BHMC Qualification Registration Fee');
    paymentInitiationFormData.append('mobileNo', user.contact_number);
    paymentInitiationFormData.append('payerEmail', user.email);
    paymentInitiationFormData.append('user', user.id);
    paymentInitiationFormData.append('payableAmount', 1000);
    paymentInitiationFormData.append('application_no', selectedQualification.value.id);
    paymentInitiationFormData.append('app_type', 'specification_for_health_certification');

    // Make the payment *before* updating the qualification
    await apiService.makePayment(paymentInitiationFormData);

    // 2. Update BHMC Qualification (payment_id and status) - Using FormData
    const updateFormData = new FormData();
    updateFormData.append('payment_id', paymentId);
    updateFormData.append('payment_status', "processing_payment");

    await apiService.patchEpcNewQualification(qualificationId, updateFormData);

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
@keyframes border-pulse {

  0%,
  100% {
    border-color: rgba(20, 184, 166, 0.3);
    /* Teal with opacity */
    transform: scale(1);
  }

  50% {
    border-color: rgba(6, 182, 212, 0.6);
    /* Cyan with higher opacity */
    transform: scale(1.05);
  }
}

.animate-border-pulse {
  animation: border-pulse 2s ease-in-out infinite;
  border-radius: 0.5rem;
  /* Match the button's rounded-lg */
}
</style>
