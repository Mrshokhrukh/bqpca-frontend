<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Counselor Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Your counselor application status.
      </p>
    </div>

    <!-- Results Section - Table Format -->
    <div class="max-w-7xl mx-auto">
      <!-- Results Table -->
      <div v-if="filteredApplications?.length > 0"
        class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100">
          <h3 class="text-lg font-bold text-gray-900">Your Applications</h3>
          <p class="text-sm text-gray-600 mt-1">Found {{ filteredApplications.length }} application(s)</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration #</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(record, index) in filteredApplications" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ record.application }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ record.counselling_title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
        record.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
          record.review_decision === 'Regretted' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-700'
      ]">
                    {{ record.review_decision }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="viewDetails(record)"
                    class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                    <Eye class="w-4 h-4 inline mr-1" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredApplications.length === 0 && !isLoading && !apiError"
        class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <div class="flex flex-col items-center">
          <FileSearch class="w-16 h-16 text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-700 mb-2">No Application Found</h3>
          <p class="text-gray-500">We couldn't find any counselor application for your account.</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
        <div class="flex flex-col items-center">
          <AlertTriangle class="w-16 h-16 text-red-400 mb-4" />
          <h3 class="text-lg font-medium text-red-700 mb-2">Error Retrieving Data</h3>
          <p class="text-red-500">There was a problem fetching your application details.</p>
          <p class="text-red-500 mt-1">Please try again later or contact support.</p>
        </div>
      </div>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Details Modal -->
  <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
        @click="showDetailsModal = false"></div>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div v-if="selectedRecord" class="bg-white">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                  Application Details
                </h3>
                <p class="text-sm text-gray-500 mt-1">Registration #{{ selectedRecord.application }}</p>
              </div>
              <div>
                <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                  <X class="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <!-- Status Badge -->
            <div class="mb-6 flex items-center">
              <span class="text-sm text-gray-500 mr-2">Application Status:</span>
              <span :class="[
        'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
        selectedRecord.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
          selectedRecord.review_decision === 'Regretted' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-700'
      ]">
                {{ selectedRecord.review_decision }}
              </span>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Personal Information -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <User class="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex items-start space-x-3">
                    <IdCard class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Full Name</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.full_name }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <CreditCard class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">CID Number</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.cid }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Users class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Gender</p>
                      <p class="text-sm font-semibold text-gray-900 capitalize">{{ selectedRecord.gender.toLowerCase()
                        }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Mail class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Email</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.email_address }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Phone class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Contact</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.contact_no }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Counselling Details -->
              <div class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                  <GraduationCap class="w-5 h-5 mr-2 text-blue-600" />
                  Counselling Details
                </h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex items-start space-x-3">
                    <BookOpen class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Title</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.counselling_title }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <FileText class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Details</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.counselling_details }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <ClipboardList class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Report</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.counselling_report }}</p>
                    </div>
                  </div>
                  <div v-if="selectedRecord.review_remarks" class="flex items-start space-x-3">
                    <MessageSquare class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Review Remarks</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.review_remarks }}</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <CheckSquare class="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p class="text-sm font-medium text-gray-500">Declaration</p>
                      <p class="text-sm font-semibold text-gray-900">{{ selectedRecord.declaration ?
        'Accepted' : 'Not Accepted' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attachment Section -->
            <div v-if="selectedRecord.Counselling_attachments && selectedRecord.Counselling_attachments.length > 0"
              class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <Paperclip class="w-5 h-5 mr-2 text-blue-600" />
                Supporting Documents
              </h4>
              <div class="space-y-3">
                <div v-for="attachment in selectedRecord.Counselling_attachments" :key="attachment.id"
                  class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <FileText class="w-5 h-5 text-red-500" />
                    <span class="text-sm text-gray-700">{{ getFileName(attachment.file) }}</span>
                  </div>
                  <a :href="attachment.file" target="_blank"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    <Download class="w-4 h-4 mr-1" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-3 flex justify-end">
            <button type="button" @click="showDetailsModal = false"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore';
import {
  FileText,
  IdCard,
  User,
  Users,
  CreditCard,
  GraduationCap,
  BookOpen,
  Download,
  FileSearch,
  AlertTriangle,
  Eye,
  X,
  Paperclip,
  CheckSquare,
  Phone,
  Mail,
  MessageSquare,
  ClipboardList
} from 'lucide-vue-next';

// State
const applications = ref([]);
const isLoading = ref(false);
const apiError = ref(false);
const showDetailsModal = ref(false);
const selectedRecord = ref(null);
const authStore = useAuthStore();


// Computed property for filtered applications
const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return [];
  }
  return applications.value.filter(app => app.cid === authStore.user.cid);
});


// Get file name from URL
const getFileName = (url) => {
  if (!url) return 'File';
  const parts = url.split('/');
  return parts[parts.length - 1];
};

// View details of a specific record
const viewDetails = (record) => {
  selectedRecord.value = record;
  showDetailsModal.value = true;
};

// Methods
const fetchCounselor = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await apiService.getBmhcCounsellors();
    if (response && response.data && response.data.results) {
      applications.value = response.data.results;
    } else {
      applications.value = [];
      console.error("API did not return an array in results:", response.data);
      apiError.value = true;
    }
  } catch (error) {
    console.error('Error fetching counselor applications:', error);
    applications.value = [];
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchCounselor();
})
</script>
