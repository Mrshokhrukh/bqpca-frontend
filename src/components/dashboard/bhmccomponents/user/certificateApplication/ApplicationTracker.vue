<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section (Same as before) -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Search your application status by CID/Work Permit Number.
      </p>
    </div>

    <!-- Search Section (Same as before) -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="max-w-xl mx-auto">
        <div class="flex space-x-4 mb-4">
          <button @click="searchType = 'id'" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium flex-1',
            searchType === 'id'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            CID/Work Permit Number
          </button>
        </div>

        <div class="flex space-x-4">
          <input v-model="searchQuery" type="text"
            class="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            :placeholder="searchType === 'id' ? 'Enter CID or Work Permit number' : 'Enter Application ID (e.g., c44df22e-53cf-4486-9)'" />
          <button @click="handleSearch"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            :disabled="isLoading">
            <Loader v-if="isLoading" class="animate-spin mr-2" />
            {{ isLoading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="applications?.length > 0" class="space-y-6">
      <div v-for="application in applications" :key="application.id"
        class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-blue-200 transition-all duration-300">
        <!-- Main Info Header -->
        <div class="relative">
          <!-- Moved button inside loop, added v-if -->
          <div class="absolute top-0 right-0 m-4">
            <button v-if="application.user_qualifications.length > 0"
              @click="openCertificateModal(application.user_qualifications[0])"
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

        <!-- Contact & Registration Info (Same as before) -->
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
    <!-- No Results Message (Same as before)-->
    <div v-else-if="hasSearched && !apiError" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">No applications found matching your search.</p>
    </div>

    <!-- Certificate Modal (Using the new component) -->
    <CertificateModal :qualification="selectedQualification" :showModal="showCertificateModal"
      @close="closeCertificateModal" />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '@/services/services';
import CertificateModal from './CertificateModal.vue'; // Import the modal
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
  Loader,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-vue-next';

// State
const applications = ref([]);
const searchQuery = ref('');
const searchType = ref('id');
const isLoading = ref(false);
const hasSearched = ref(false);
const apiError = ref(false);
const showCertificateModal = ref(false);
const selectedQualification = ref(null);

// Methods
const fetchApplications = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    let response;
    if (searchType.value === 'id') {
      response = await apiService.getFullApplicationListByCid(searchQuery.value);
    } else {
      response = await apiService.getBhmcNewApplications(searchQuery.value);
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
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  hasSearched.value = true;
  await fetchApplications();
};

//  Helper function for header status
const isApplicationActive = (application) => {
  return application.user_qualifications.some(
    (qualification) => qualification.endorsement_decision === 'Approved'
  );
};

const openCertificateModal = (qualification) => {
  selectedQualification.value = qualification;
  showCertificateModal.value = true;

};

const closeCertificateModal = () => {
  showCertificateModal.value = false;
  selectedQualification.value = null;

};

</script>
