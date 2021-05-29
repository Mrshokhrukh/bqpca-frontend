```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <InstituteHeader
        :title="institute?.name_of_institution || 'Institute Profile'"
        :subtitle="
          institute
            ? `Headed by ${institute.head_of_institution_name}`
            : 'Loading institute details...'
        "
      />

      <!-- Main Content -->
      <div v-if="institute" class="space-y-8">
        <!-- Overview Card -->
        <div class="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">{{ institute.name_of_institution }}</h2>
              <p v-if="institute.website" class="mt-2 text-indigo-600 hover:underline">
                <a
                  :href="institute.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center"
                >
                  <GlobeAltIcon class="w-5 h-5 mr-2" />
                  {{ institute.website }}
                </a>
              </p>
            </div>
            <div class="flex items-center gap-4">
              <span
                :class="{
                  'bg-green-100 text-green-800': institute.do_dpr_review_decision === 'Approved',
                  'bg-yellow-100 text-yellow-800': institute.do_dpr_review_decision === 'Pending',
                  'bg-red-100 text-red-800':
                    institute.do_dpr_review_decision !== 'Approved' &&
                    institute.do_dpr_review_decision !== 'Pending',
                }"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ institute.do_dpr_review_decision }}
              </span>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Contact Information -->
          <div class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-600">Address</dt>
                <dd class="text-gray-800">
                  {{ institute.address }},
                  {{ institute.village ? `${institute.village}, ` : '' }}
                  {{ institute.gewog ? `${institute.gewog}, ` : '' }}
                  {{ institute.dzongkhag }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Email</dt>
                <dd>
                  <a
                    :href="`mailto:${institute.head_of_institution_email}`"
                    class="text-indigo-600 hover:underline"
                  >
                    {{ institute.head_of_institution_email }}
                  </a>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Phone</dt>
                <dd class="text-gray-800">{{ institute.head_of_institution_phone_number }}</dd>
              </div>
            </dl>
          </div>

          <!-- Program Details -->
          <div class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Program Overview</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-600">Course</dt>
                <dd class="text-gray-800">{{ institute.title_of_course || 'N/A' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Duration</dt>
                <dd class="text-gray-800">{{ institute.course_duration ? `${institute.course_duration} Months` : 'N/A' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Commencement Date</dt>
                <dd class="text-gray-800">{{ formattedCommencementDate }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Program Type</dt>
                <dd class="text-gray-800">
                  {{
                    institute.type_of_programme === 'D'
                      ? 'Diploma'
                      : institute.type_of_programme === 'B'
                        ? 'Bachelor'
                        : institute.type_of_programme || 'N/A'
                  }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Status & Validity -->
          <div class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Status & Validity</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-600">Valid From</dt>
                <dd class="text-gray-800">{{ formattedValidSince }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Valid Until</dt>
                <dd class="text-gray-800">{{ formattedValidTill }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-600">Remarks</dt>
                <dd class="text-gray-800">{{ institute.institute_dpr_remarks || 'None' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Teaching Centers Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Associated Teaching Centers</h3>
          <div v-if="teachingCenters.length > 0" class="space-y-4">
            <div
              v-for="center in teachingCenters"
              :key="center.id"
              class="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 hover:shadow-md"
            >
              <div>
                <h4 class="text-lg font-medium text-gray-800">{{ center.center_name }}</h4>
                <p class="text-sm text-gray-600">
                  Location: {{ center.center_location }}, {{ center.state_dzongkhag }}
                </p>
                <p v-if="center.tc_remarks" class="text-sm text-gray-600">
                  Remarks: {{ center.tc_remarks }}
                </p>
                <p class="text-sm text-gray-600">
                  Valid: {{ formatDate(center.valid_since) }} - {{ formatDate(center.valid_till) }}
                </p>
                <div v-if="center.tc_attachments || center.tc_report" class="mt-2 flex gap-4">
                  <a
                    v-if="center.tc_attachments"
                    :href="center.tc_attachments"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-indigo-600 hover:underline flex items-center text-sm"
                  >
                    <DocumentIcon class="w-4 h-4 mr-1" />
                    Attachments
                  </a>
                  <a
                    v-if="center.tc_report"
                    :href="center.tc_report"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-indigo-600 hover:underline flex items-center text-sm"
                  >
                    <DocumentIcon class="w-4 h-4 mr-1" />
                    Report
                  </a>
                </div>
              </div>
              <div>
                <span
                  :class="{
                    'bg-green-100 text-green-800': center.tc_review_decision === 'Approved',
                    'bg-yellow-100 text-yellow-800': center.tc_review_decision === 'Pending',
                    'bg-red-100 text-red-800':
                      center.tc_review_decision !== 'Approved' &&
                      center.tc_review_decision !== 'Pending',
                  }"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ center.tc_review_decision }}
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 italic">No associated teaching centers registered.</p>
        </div>

        <!-- Supporting Documents Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Supporting Documents</h3>
          <div
            v-if="
              institute.supporting_documents ||
              institute.institute_eoi_supporting_documents ||
              institute.do_dpr_report
            "
            class="space-y-2"
          >
            <a
              v-if="institute.supporting_documents"
              :href="institute.supporting_documents"
              target="_blank"
              rel="noopener noreferrer"
              class="text-indigo-600 hover:underline flex items-center"
            >
              <DocumentIcon class="w-5 h-5 mr-2" />
              EoI Supporting Document
            </a>
            <a
              v-if="institute.institute_eoi_supporting_documents"
              :href="institute.institute_eoi_supporting_documents"
              target="_blank"
              rel="noopener noreferrer"
              class="text-indigo-600 hover:underline flex items-center"
            >
              <DocumentIcon class="w-5 h-5 mr-2" />
              Additional EoI Document
            </a>
            <a
              v-if="institute.do_dpr_report"
              :href="institute.do_dpr_report"
              target="_blank"
              rel="noopener noreferrer"
              class="text-indigo-600 hover:underline flex items-center"
            >
              <DocumentIcon class="w-5 h-5 mr-2" />
              DPR Report
            </a>
          </div>
          <p v-else class="text-gray-500 italic">No supporting documents available.</p>
        </div>
      </div>

      <!-- Loading or Error State -->
      <div v-else-if="errorMessage" class="text-center py-12">
        <p class="text-red-600 text-xl">{{ errorMessage }}</p>
        <button
          @click="fetchInstitute"
          class="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-150"
        >
          Retry
        </button>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-gray-600 text-xl">Loading institute profile...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue';
import { GlobeAltIcon, DocumentIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const institute = ref(null);
const teachingCenters = ref([]);
const errorMessage = ref('');
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const toast = useToast();

// Computed properties for formatted dates
const formattedCommencementDate = computed(() => {
  return institute.value?.commencement_date
    ? formatDate(institute.value.commencement_date)
    : 'N/A';
});

const formattedValidSince = computed(() => {
  return institute.value?.valid_since ? formatDate(institute.value.valid_since) : 'N/A';
});

const formattedValidTill = computed(() => {
  return institute.value?.valid_till ? formatDate(institute.value.valid_till) : 'N/A';
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Fetch institute data
const fetchInstitute = async () => {
  errorMessage.value = ''; // Clear previous errors
  institute.value = null; // Reset institute data
  teachingCenters.value = []; // Reset teaching centers

  try {
    const instituteId = route.params.id || route.params.cid || user.value?.cid || '1';
    if (!instituteId) {
      errorMessage.value = 'Institute ID or CID is not available.';
      toast.error(errorMessage.value);
      return;
    }

    const response = await apiServices.getMhpcInstitute(instituteId);
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    let instituteData = null;

    // Case 1: Handle direct array response
    if (Array.isArray(response.data)) {
      if (response.data.length === 0) {
        errorMessage.value = `No institute found for the identifier: ${instituteId}.`;
        toast.info(errorMessage.value);
        return;
      }
      instituteData = response.data[0]; // Take the first institute
    }
    // Case 2: Handle object with 'results' property
    else if (response.data && 'results' in response.data) {
      if (!Array.isArray(response.data.results) || response.data.results.length === 0) {
        errorMessage.value = `No institute found for the identifier: ${instituteId}.`;
        toast.info(errorMessage.value);
        return;
      }
      instituteData = response.data.results[0]; // Take the first institute
    }
    // Case 3: Handle single object response
    else if (response.data && typeof response.data === 'object') {
      // Verify the object has expected properties to ensure it's valid institute data
      if (!response.data.id || !response.data.CID) {
        throw new Error(`Invalid institute data: Missing required fields (id or CID)`);
      }
      instituteData = response.data; // Use the object directly
    }
    // Case 4: Invalid response format
    else {
      throw new Error(`Invalid API response format: ${JSON.stringify(response.data)}`);
    }

    // Authorization check
    if (user.value?.cid && instituteData.CID !== user.value.cid) {
      if (instituteId === user.value.cid) {
        errorMessage.value = `Data Mismatch: Fetched institute (CID: ${instituteData.CID}) does not match your requested CID (${user.value.cid}).`;
        toast.error(errorMessage.value);
        return;
      }
      // Allow viewing other profiles if instituteId wasn't user CID
    }

    // Assign data
    institute.value = instituteData;
    teachingCenters.value = instituteData.teaching_centers || [];

  } catch (error) {
    console.error('Error fetching institute:', error);
    institute.value = null;
    teachingCenters.value = [];
    errorMessage.value = error.message || 'An unexpected error occurred. Please try again.';
    toast.error(errorMessage.value);
  }
};

onMounted(() => {
  fetchInstitute();
});
</script>

<style scoped>
/* No additional styles needed, Tailwind CSS handles everything */
</style>
```