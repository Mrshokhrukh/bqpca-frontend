<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Your application status is displayed below.
      </p>
    </div>

    <!-- Loading Indicator (Optional) -->
    <div v-if="isLoading" class="mt-4 flex justify-center">
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
        <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></span>
        <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></span>
      </div>
    </div>


    <!-- Results Section -->
    <div v-if="applications?.length > 0" class="space-y-6">
      <div v-for="application in applications" :key="application.id"
        class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-blue-200 transition-all duration-300">
        <!-- Main Info Header -->
        <div class="relative">
          <!-- Moved button inside loop, added v-if -->
          <div class="absolute top-0 right-0 m-4 flex space-x-2">
            <!-- Awaiting Payment Button -->
            <button
              v-if="application.user_qualifications.some(q => q.physical_review_status === 'Approved' && q.endorsement_decision === 'Pending')"
              @click="initiatePayment(application)"
              class="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-sm animate-pulse">
              <CreditCard class="w-4 h-4 mr-2" />
              <span>Awaiting Payment, Proceed to Payment</span>
            </button>
            <!-- View Certificate Button -->
            <button v-if="application.user_qualifications.some(q => q.endorsement_decision === 'Approved')"
              @click="openCertificateModal(application)"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <FileText class="w-4 h-4 mr-2" />
              <span>View Certificate</span>
            </button>
          </div>
          <div class="p-6 flex items-start space-x-6">
            <img :src="application.passport_photo" :alt="application.full_name"
              class="h-24 w-24 rounded-lg object-cover ring-2 ring-white shadow-md" />
            <div class="flex-1 pt-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-xl font-bold text-gray-900">{{ application.full_name }}</h3>
                <!--  Header Status Logic  -->
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="isApplicationActive(application) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="mt-2 flex items-center space-x-4 text-gray-600">
                <div class="flex items-center">
                  <IdCard class="w-4 h-4 mr-2" />
                  <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}: {{ application.cid_no }}</span>
                </div>
                <div class="flex items-center">
                  <BarChart class="w-4 h-4 mr-2" />
                  <span>Reg No: {{ application.registration_no }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Registration Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-4 bg-gray-50 border-y border-gray-200">
          <div class="flex items-start space-x-3">
            <div class="mt-1">
              <Phone class="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Contact</p>
              <p class="text-sm text-gray-600">{{ application.contact_no }}</p>
              <p class="text-sm text-gray-600">{{ application.email_address }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="mt-1">
              <MapPin class="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Location</p>
              <p class="text-sm text-gray-600">
                {{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="mt-1">
              <Calendar class="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Registration Period</p>
              <p class="text-sm text-gray-600">
                {{ new Date(application.registration_date).toLocaleDateString() }} -
                {{ new Date(application.expiry_date).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Qualifications Section -->
        <div class="p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <GraduationCap class="w-5 h-5 mr-2 text-blue-600" />
            Qualifications & Certifications
          </h4>

          <div class="grid grid-cols-1 gap-6">
            <div v-for="qualification in application.user_qualifications" :key="qualification.id"
              class="relative bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">

              <!-- Qualification Header -->
              <div class="flex items-start justify-between mb-6">
                <div class="space-y-2">
                  <h5 class="text-xl font-semibold text-gray-900">
                    {{ qualification.qualification_name_display }}
                  </h5>
                  <p class="text-gray-600 text-sm">
                    {{ qualification.institute_university_display }}
                  </p>
                </div>

                <!-- Review Status Timeline -->
                <div class="flex items-center space-x-2">
                  <div class="flex items-center">
                    <div class="relative flex items-center">
                      <!-- Application Review -->
                      <div class="flex flex-col items-center">
                        <span class="w-8 h-8 rounded-full flex items-center justify-center" :class="[
      qualification.application_review_status === 'Approved' ? 'bg-green-100 text-green-700' :
        qualification.application_review_status === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
    ]">
                          <CheckCircle v-if="qualification.application_review_status === 'Approved'" class="w-5 h-5" />
                          <XCircle v-else-if="qualification.application_review_status === 'Rejected'" class="w-5 h-5" />
                          <Clock v-else class="w-5 h-5" />
                        </span>
                        <span class="text-xs font-medium mt-1 text-gray-600">Review</span>
                      </div>

                      <!-- Connecting Line -->
                      <div class="w-8 h-0.5 bg-gray-200"></div>

                      <!-- Physical Verification -->
                      <div class="flex flex-col items-center">
                        <span class="w-8 h-8 rounded-full flex items-center justify-center" :class="[
      qualification.physical_review_status === 'Approved' ? 'bg-green-100 text-green-700' :
        qualification.physical_review_status === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
    ]">
                          <CheckCircle v-if="qualification.physical_review_status === 'Approved'" class="w-5 h-5" />
                          <XCircle v-else-if="qualification.physical_review_status === 'Rejected'" class="w-5 h-5" />
                          <Clock v-else class="w-5 h-5" />
                        </span>
                        <span class="text-xs font-medium mt-1 text-gray-600">Verify</span>
                      </div>

                      <!-- Connecting Line -->
                      <div class="w-8 h-0.5 bg-gray-200"></div>

                      <!-- Payment -->
                      <div class="flex flex-col items-center">
                        <span class="w-8 h-8 rounded-full flex items-center justify-center" :class="[
      qualification.is_payment_complete ? 'bg-green-100 text-green-700' :
        'bg-yellow-100 text-yellow-700'
    ]">
                          <CheckCircle v-if="qualification.is_payment_complete" class="w-5 h-5" />
                          <Clock v-else class="w-5 h-5" />
                        </span>
                        <span class="text-xs font-medium mt-1 text-gray-600">Payment</span>
                      </div>


                      <!-- Connecting Line -->
                      <div class="w-8 h-0.5 bg-gray-200"></div>

                      <!-- Endorsement -->
                      <div class="flex flex-col items-center">
                        <span class="w-8 h-8 rounded-full flex items-center justify-center" :class="[
      qualification.endorsement_decision === 'Approved' ? 'bg-green-100 text-green-700' :
        qualification.endorsement_decision === 'Rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
    ]">
                          <CheckCircle v-if="qualification.endorsement_decision === 'Approved'" class="w-5 h-5" />
                          <XCircle v-else-if="qualification.endorsement_decision === 'Rejected'" class="w-5 h-5" />
                          <Clock v-else class="w-5 h-5" />
                        </span>
                        <span class="text-xs font-medium mt-1 text-gray-600">Endorse</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Qualification Details Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <Building2 class="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Institute</p>
                      <p class="text-sm font-semibold text-gray-900 mt-1">{{ qualification.institute_university_display
                        }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <GraduationCap class="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Qualification Type</p>
                      <p class="text-sm font-semibold text-gray-900 mt-1">{{ qualification.qualification_type_display }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <CalendarCheck class="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Completion Year</p>
                      <p class="text-sm font-semibold text-gray-900 mt-1">{{ qualification.completion_year }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start space-x-3">
                    <CreditCard class="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Payment Status</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="qualification.is_payment_complete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          {{ qualification.is_payment_complete ? 'Paid' : 'Pending' }}
                        </span>
                        <span v-if="qualification.payment_id" class="text-xs text-gray-500">
                          #{{ qualification.payment_id }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- No Results Message -->
    <div v-else-if="hasSearched && !apiError" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">No applications found.</p>
    </div>
    <!-- API Error Message -->
    <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
      <p class="text-red-600">An error occurred while fetching your application. Please try again later.</p>
    </div>

    <!-- Certificate Modal -->
    <CertificateModal :qualification="selectedApplication" :showModal="showCertificateModal"
      @close="closeCertificateModal" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';  // Import onMounted and computed
import apiService from '@/services/services';
import CertificateModal from './CertificateModal.vue';
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

// Computed property for CID
const userCid = computed(() => {
  return authStore.user?.cid;
});


// Methods
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

//New function for payment
const initiatePayment = (application) => {
  //Implement Payment
  console.log("Payment initiated:", application)
  toast.info('Payment processing not yet implemented');
}


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
