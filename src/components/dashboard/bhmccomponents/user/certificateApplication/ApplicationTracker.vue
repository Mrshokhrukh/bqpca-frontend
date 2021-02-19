<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Search your application status by CID/Work Permit Number.
      </p>
    </div>

    <!-- Search Section -->
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
          <div class="absolute top-0 right-0 m-4">
            <button @click="openCertificateModal(application)"
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
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="application.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ application.is_active ? 'Active' : 'Inactive' }}
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

        <!-- Qualifications -->
        <div class="p-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GraduationCap class="w-5 h-5 mr-2 text-blue-600" />
            Qualifications
          </h4>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="qualification in application.user_qualifications" :key="qualification.id"
              class="relative bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-200 transition-all duration-300">
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <h5 class="text-lg font-semibold text-gray-900">
                      {{ qualification.qualification_name_display }}
                    </h5>
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="qualification.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                      {{ qualification.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="{
            'bg-green-100 text-green-800': qualification.application_review_status === 'Approved',
            'bg-yellow-100 text-yellow-800': qualification.application_review_status === 'Pending',
            'bg-red-100 text-red-800': qualification.application_review_status === 'Rejected'
          }">
                  {{ qualification.application_review_status }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="flex items-center space-x-2">
                  <Building2 class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-700">Institute</p>
                    <p class="text-sm text-gray-900">{{ qualification.institute_university_display }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <GraduationCap class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-700">Qualification Type</p>
                    <p class="text-sm text-gray-900">{{ qualification.qualification_type_display }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <CalendarCheck class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-700">Completion Year</p>
                    <p class="text-sm text-gray-900">{{ qualification.completion_year }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <CreditCard class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-700">Payment Status</p>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="qualification.is_payment_complete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ qualification.is_payment_complete ? 'Paid' : 'Pending' }}
                      </span>
                      <span v-if="qualification.payment_id" class="text-xs text-gray-500">
                        ID: {{ qualification.payment_id }}
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

    <!-- No Results Message -->
    <div v-else-if="hasSearched && !apiError" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">No applications found matching your search.</p>
    </div>


    <!-- Certificate Modal -->
    <div v-if="showCertificateModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
      role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
          @click="closeCertificateModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Certificate
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <!--  Display certificate details here. You'll need to adjust based on your actual certificate data. -->
                    Certificate details for {{ selectedQualification?.remarks }}
                  </p>
                  <!-- Example: If you had a certificate URL -->
                  <!-- <img v-if="selectedQualification && selectedQualification.certificateUrl" :src="selectedQualification.certificateUrl" alt="Certificate" class="mt-4 max-w-full" /> -->
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeCertificateModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '@/services/services';
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
      response = await apiService.getBhmcNewApplications(searchQuery.value); //consider changing api
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

const openCertificateModal = (qualification) => {
  selectedQualification.value = qualification;
  showCertificateModal.value = true;
};

const closeCertificateModal = () => {
  showCertificateModal.value = false;
  selectedQualification.value = null;
};

</script>
