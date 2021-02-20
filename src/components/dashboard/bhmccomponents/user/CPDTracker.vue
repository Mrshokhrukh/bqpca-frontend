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
    <div class="max-w-3xl mx-auto">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-8">
        <!-- Search Container -->
        <div class="relative">
          <!-- Search Icon Overlay -->
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-blue-500" />
          </div>

          <!-- Main Search Input -->
          <input v-model="searchQuery" type="text" class="w-full pl-12 pr-32 py-4 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-blue-100
                 text-gray-900 placeholder-gray-500 text-lg
                 shadow-sm transition-all duration-200
                 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none
                 hover:border-blue-200"
            :placeholder="searchType === 'id' ? 'Enter CID or Work Permit number' : 'Enter Application ID'" />

          <!-- Search Button (Absolutely Positioned) -->
          <div class="absolute inset-y-1.5 right-1.5">
            <button @click="handleSearch" :disabled="isLoading" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg
                   shadow-sm transition-all duration-200
                   hover:bg-blue-700 hover:shadow-md
                   disabled:bg-blue-400 disabled:cursor-not-allowed
                   flex items-center space-x-2">
              <Loader v-if="isLoading" class="animate-spin w-4 h-4" />
              <span class="font-medium">{{ isLoading ? 'Searching...' : 'Search' }}</span>
            </button>
          </div>
        </div>

        <!-- Search Type Indicator -->
        <div class="mt-4 flex items-center justify-between text-sm">
          <div class="flex items-center space-x-2">
            <IdCard class="w-4 h-4 text-blue-500" />
            <span class="text-gray-600 font-medium">Searching by:</span>
            <span class="text-blue-600 font-semibold">CID/Work Permit Number</span>
          </div>

          <!-- Search Tips -->
          <div class="flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-help group relative">
            <HelpCircle class="w-4 h-4 mr-1" />
            <span>Search Tips</span>

            <!-- Tooltip -->
            <div class="absolute bottom-full right-0 mb-2 w-64 hidden group-hover:block">
              <div class="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs">
                <ul class="space-y-1">
                  <li>• Enter your complete ID number</li>
                  <li>• Ensure there are no extra spaces</li>
                  <li>• Numbers only for Work Permit</li>
                </ul>
                <div class="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Searches (Optional) -->
        <div v-if="recentSearches?.length" class="mt-6 pt-4 border-t border-blue-100">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-gray-600 font-medium">Recent Searches</span>
            <button @click="clearRecentSearches" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-for="search in recentSearches" :key="search" @click="setSearch(search)" class="px-3 py-1 text-sm bg-white rounded-full border border-gray-200
                   text-gray-600 hover:border-blue-300 hover:text-blue-600
                   transition-colors flex items-center space-x-1">
              <Clock class="w-3 h-3" />
              <span>{{ search }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Indicator (Optional) -->
      <div v-if="isLoading" class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></span>
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
            <button v-if="application.user_qualifications.length > 0" @click="openCertificateModal(application)"
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
      <p class="text-gray-600">No applications found matching your search.</p>
    </div>

    <!-- Certificate Modal -->
    <CertificateModal :qualification="selectedApplication" :showModal="showCertificateModal"
      @close="closeCertificateModal" />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '@/services/services';
import CertificateModal from './certificateApplication/CertificateModal.vue';
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
  Clock,
  Search, HelpCircle, Trash2,
} from 'lucide-vue-next';

// State
const applications = ref([]);
const searchQuery = ref('');
const searchType = ref('id');
const isLoading = ref(false);
const hasSearched = ref(false);
const apiError = ref(false);
const showCertificateModal = ref(false);
const selectedApplication = ref(null);
const recentSearches = ref(['11506002491', '21703001234']);

const clearRecentSearches = () => {
  recentSearches.value = [];
};

// Methods
const fetchApplications = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    let response;
    if (searchType.value === 'id') {
      response = await apiService.getBmhcCpdRecordsByCid(searchQuery.value);
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

const setSearch = (search) => {
  searchQuery.value = search;
  handleSearch();
};

const isApplicationActive = (application) => {
  return application.user_qualifications.some(
    (qualification) => qualification.endorsement_decision === 'Approved'
  );
};

const openCertificateModal = (application) => {
  selectedApplication.value = { results: [application] }; // Pass the entire application
  showCertificateModal.value = true;
};

const closeCertificateModal = () => {
  showCertificateModal.value = false;
  selectedApplication.value = null; // Reset the selected application
};
</script>
