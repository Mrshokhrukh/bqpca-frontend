<template>
  <div class="p-4 sm:p-6 md:p-8 lg:p-12 min-h-screen">
    <div class="mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

      <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-white">
        <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
        <p class="mt-6 text-xl font-semibold text-gray-700">Loading Institute Data...</p>
      </div>

      <div v-else-if="noInstituteFound" class="text-center py-16 sm:py-24 px-6 bg-white rounded-b-2xl">
        <div class="mx-auto max-w-lg bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-inner">
          <FileX2 class="mx-auto h-20 w-20 text-blue-400" aria-hidden="true" />
          <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">Get Started</h2>
          <p class="mt-4 text-lg leading-7 text-gray-600">
            It appears you have not registered an institute with your account yet. To view your dashboard, please register an institute first.
          </p>
          <button @click="redirectToRegistration" type="button" class="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300 ease-in-out hover:scale-105 transform">
            <PlusCircle class="mr-2 h-5 w-5" aria-hidden="true" />
            Register an Institute
          </button>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-8 rounded-b-2xl shadow-md" role="alert">
        <div class="flex items-start">
          <div class="py-1">
            <AlertCircle :size="32" class="text-red-500 mr-4 flex-shrink-0" />
          </div>
          <div>
            <p class="font-bold text-xl">Error Loading Institute!</p>
            <p class="text-lg mt-1">{{ error }}</p>
            <p class="text-sm text-red-600 mt-2">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </div>

      <div v-else-if="institute" class="space-y-10 p-6 sm:p-8 md:p-10 lg:p-12">
        <header class="pb-8 border-b-2 border-gray-200">
          <h1 class="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {{ institute.name_of_institution }}
          </h1>
          <p class="text-lg text-gray-600 mt-2">Institute Dashboard <span class="font-mono text-sm opacity-80">(Application ID: {{ institute.id }})</span></p>
        </header>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 shadow-lg rounded-xl flex items-center space-x-4 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform">
            <div class="p-4 bg-blue-50 rounded-full">
              <FileText :size="32" class="text-blue-600" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">EOI/DPR Status</h3>
              <p :class="statusClass(institute.do_dpr_review_decision, false, true)" class="text-3xl font-bold mt-1">
                {{ institute.do_dpr_review_decision || 'N/A' }}
              </p>
            </div>
          </div>
          <div class="bg-white p-6 shadow-lg rounded-xl flex items-center space-x-4 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform">
            <div class="p-4 bg-indigo-50 rounded-full">
              <GraduationCap :size="32" class="text-indigo-600" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Programs Offered</h3>
              <p class="text-3xl font-bold text-indigo-700 mt-1">{{ institute.programs_offered_by_institute?.length || 0 }}</p>
            </div>
          </div>
          <div class="bg-white p-6 shadow-lg rounded-xl flex items-center space-x-4 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform">
            <div class="p-4 bg-green-50 rounded-full">
              <Hospital :size="32" class="text-green-600" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Teaching Hospitals</h3>
              <p class="text-3xl font-bold text-green-700 mt-1">{{ institute.teaching_centers?.length || 0 }}</p>
            </div>
          </div>
          <div class="bg-white p-6 shadow-lg rounded-xl flex items-center space-x-4 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform">
            <div class="p-4 bg-purple-50 rounded-full">
              <Users :size="32" class="text-purple-600" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500">Teaching Faculties</h3>
              <p v-if="loadingFaculties" class="text-xl text-gray-500 mt-1 animate-pulse">Loading...</p>
              <p v-else class="text-3xl font-bold text-purple-700 mt-1">{{ teachingFaculties.length }}</p>
            </div>
          </div>
        </div>

        

        <div class="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
          <h2 class="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">Institute Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Applicant CID</dt>
              <dd class="text-gray-900 text-lg font-medium">{{ institute.CID }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Applicant Full Name</dt>
              <dd class="text-gray-900 text-lg font-medium">{{ institute.full_name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Contact No.</dt>
              <dd class="text-gray-900 text-lg font-medium">{{ institute.contact_no }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address</dt>
              <dd class="text-blue-600 hover:underline text-lg font-medium">{{ institute.email_address }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Website</dt>
              <dd>
                <a :href="institute.website" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium">
                  {{ institute.website || 'N/A' }}
                </a>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Head of Institution</dt>
              <dd class="text-gray-900 text-lg font-medium">{{ institute.head_of_institution_name }} ({{ institute.head_of_institution_gender }})</dd>
            </div>
            <div class="md:col-span-2 lg:col-span-3">
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Address</dt>
              <dd class="text-gray-900 text-lg font-medium">{{ institute.address }}, {{ institute.village }}, {{ institute.chiwog }}, {{ institute.gewog }}, {{ institute.dzongkhag }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Validity Period</dt>
              <dd class="text-gray-900 text-lg font-medium">{{ formatDate(institute.valid_since) }} to {{ formatDate(institute.valid_till) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Complete</dt>
              <dd>
                <span :class="institute.is_payment_complete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-4 py-1 text-sm font-semibold rounded-full shadow-sm">
                  {{ institute.is_payment_complete ? 'Yes' : 'No' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Physical Verification</dt>
              <dd>
                <span :class="institute.is_physical_verification ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-4 py-1 text-sm font-semibold rounded-full shadow-sm">
                  {{ institute.is_physical_verification ? 'Verified' : 'Pending' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Institute Active</dt>
              <dd>
                <span :class="institute.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-4 py-1 text-sm font-semibold rounded-full shadow-sm">
                  {{ institute.is_active ? 'Yes' : 'No' }}
                </span>
              </dd>
            </div>
          </dl>
        </div>



        <div class="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
          <h2 class="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">Programs Offered by Institute ({{ institute.programs_offered_by_institute?.length || 0 }})</h2>
          <div v-if="institute.programs_offered_by_institute?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="program in institute.programs_offered_by_institute" :key="program.id"
                 class="border border-blue-200 p-6 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all duration-300 bg-blue-50/20">
              <h3 class="font-bold text-2xl text-blue-800 mb-2">{{ program.program_master?.program_name || 'N/A' }}</h3>
              <p class="text-md text-gray-700 mb-1"><span class="font-medium">Specific Title:</span> {{ program.specific_program_title || 'N/A' }}</p>
              <p class="text-md text-gray-700 mb-1"><span class="font-medium">Duration:</span> {{ program.program_master?.duration_years || 'N/A' }} years</p>
              <p class="text-md mb-3">
                <span class="font-medium">Status:</span> <span :class="statusClass(program.status, true)" class="font-semibold text-sm">{{ program.status || 'N/A' }}</span>
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <a v-if="program.curriculum_validation_letter" :href="program.curriculum_validation_letter" target="_blank"
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  <FileText :size="16" class="mr-2" /> View Validation Letter
                </a>
                <a v-if="program.curriculum_document" :href="program.curriculum_document" target="_blank"
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  <FileText :size="16" class="mr-2" /> View Curriculum Doc
                </a>
              </div>
              <p v-if="program.status_remarks" class="text-sm text-gray-600 mt-4 pt-3 border-t border-gray-200">
                <span class="font-semibold">Remarks:</span> {{ program.status_remarks }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8 text-lg">No programs offered by this institute yet.</p>
        </div>



        <div class="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
          <h2 class="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">All Available Programs in System ({{ allPrograms.length }})</h2>
          <div v-if="loadingAllPrograms" class="text-center py-10">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p class="mt-4 text-lg text-gray-600">Loading All Programs...</p>
          </div>
          <div v-else-if="errorAllPrograms" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-5 rounded text-base" role="alert">
            <div class="flex items-center">
              <AlertCircle :size="20" class="mr-3" /> Error loading programs: {{ errorAllPrograms }}
            </div>
          </div>
          <div v-else-if="allPrograms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="program in allPrograms" :key="program.id"
                 class="border border-indigo-200 p-6 rounded-xl hover:shadow-lg hover:border-indigo-400 transition-all duration-300 bg-indigo-50/20">
              <h3 class="font-bold text-xl text-indigo-800 mb-2">
                {{ program.program_master?.program_name || program.program_name || program.specific_program_title || 'N/A' }}
              </h3>
              <p v-if="program.specific_program_title && (program.program_master?.program_name || program.program_name) !== program.specific_program_title" class="text-md text-gray-700 mb-1">
                <span class="font-medium">Specific Title:</span> {{ program.specific_program_title }}
              </p>
              <p v-if="program.program_level_display" class="text-md text-gray-700 mb-1"><span class="font-medium">Level:</span> {{ program.program_level_display }}</p>
              <p v-if="program.duration_value && program.duration_unit_display" class="text-md text-gray-700 mb-1">
                <span class="font-medium">Duration:</span> {{ program.duration_value }} {{ program.duration_unit_display }}
              </p>
              <p v-else-if="program.program_master?.duration_years" class="text-md text-gray-700 mb-1">
                <span class="font-medium">Duration:</span> {{ program.program_master.duration_years }} years
              </p>
              <p v-if="program.status" class="text-md mt-2">
                <span class="font-medium">Status:</span> <span :class="statusClass(program.status, true)" class="font-semibold text-sm">{{ program.status }}</span>
              </p>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8 text-lg">No programs found in the system.</p>
        </div>



        <div class="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
          <h2 class="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">Teaching Hospitals ({{ institute.teaching_centers?.length || 0 }})</h2>
          <div v-if="institute.teaching_centers?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="center in institute.teaching_centers" :key="center.id"
                 class="border border-green-200 p-6 rounded-xl hover:shadow-lg hover:border-green-400 transition-all duration-300 bg-green-50/20">
              <h3 class="font-bold text-2xl text-green-800 mb-2">{{ center.center_name }}</h3>
              <p class="text-md text-gray-700 mb-3"><span class="font-medium">Location:</span> {{ center.center_location }} ({{center.city_gewog}}, {{ center.state_dzongkhag }})</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-2 text-md">
                <p><span class="font-medium">Status:</span> <span :class="statusClass(center.tc_review_decision_display, true)" class="font-semibold text-sm">{{ center.tc_review_decision_display || 'N/A' }}</span></p>
                <p><span class="font-medium">Verification:</span> <span :class="statusClass(center.physical_verification_status_display, true)" class="font-semibold text-sm">{{ center.physical_verification_status_display || 'N/A' }}</span></p>
                <p><span class="font-medium">Active:</span> <span :class="statusClass(center.is_active ? 'Active' : 'Inactive', true)" class="font-semibold text-sm">{{ center.is_active ? 'Yes' : 'No' }}</span></p>
                <p class="text-gray-600"><span class="font-medium">Valid:</span> {{ formatDate(center.valid_since) }} to {{ formatDate(center.valid_till) }}</p>
              </div>
              <a v-if="center.tc_attachments" :href="center.tc_attachments" target="_blank"
                 class="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200">
                <FileText :size="16" class="mr-2" /> View Attachments
              </a>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8 text-lg">No teaching hospitals associated with this institute yet.</p>
        </div>



        <div class="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
          <h2 class="text-3xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">CAPA (Corrective & Preventive Actions) ({{ capas.length }})</h2>
          <div v-if="loadingCapas" class="text-center py-10">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p class="mt-4 text-lg text-gray-600">Loading CAPA Data...</p>
          </div>
          <div v-else-if="errorCapas" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-5 rounded text-base" role="alert">
            <div class="flex items-center">
              <AlertCircle :size="20" class="mr-3" /> Error loading CAPA data: {{ errorCapas }}
            </div>
          </div>
          <div v-else-if="capas.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="capa in capas" :key="capa.id"
                 class="border border-orange-200 p-6 rounded-xl hover:shadow-lg hover:border-orange-400 transition-all duration-300 bg-orange-50/20">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-2xl text-orange-800">{{ capa.capa_type || 'CAPA' }}</h3>
                <span :class="statusClass(capa.status, true)" class="font-semibold text-sm">{{ capa.status || 'N/A' }}</span>
              </div>
              <p class="text-md text-gray-700 mb-2"><span class="font-medium">Description:</span> {{ capa.description || 'No description provided.' }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 text-md">
                <p><span class="font-medium">Due Date:</span> {{ formatDate(capa.due_date) }}</p>
                <p><span class="font-medium">Assigned To:</span> {{ capa.assigned_to || 'N/A' }}</p>
                <p><span class="font-medium">Closed:</span>
                  <span :class="capa.is_closed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-0.5 text-xs font-semibold rounded-full">
                    {{ capa.is_closed ? 'Yes' : 'No' }}
                  </span>
                </p>
                <p class="text-gray-600 text-sm">Created: {{ formatDate(capa.date_created) }}</p>
              </div>
              </div>
          </div>
          <p v-else class="text-gray-500 text-center py-8 text-lg">No CAPA records found for this institute.</p>
        </div>

      </div>

      <!-- <div v-else class="text-center py-24 text-gray-600 bg-white rounded-2xl shadow-xl">
        <Info :size="64" class="text-gray-400 mx-auto mb-6" />
        <p class="text-3xl font-semibold">No Institute Data Found</p>
        <p class="text-lg mt-3 max-w-xl mx-auto">This could be because no institute is associated with your account or there was an issue fetching the data. Please try again later or contact support.</p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // Adjust the path as necessary
import apiService from '@/services/services' // Ensure this path is correct
import {
  FileText,
  GraduationCap,
  Hospital,
  Users,
  AlertCircle,
  FileX2,       // New: Import for fallback icon
  PlusCircle    // New: Import for button icon
} from 'lucide-vue-next'

const router = useRouter()

// Main institute data
const institute = ref(null)
const loading = ref(true)
const error = ref(null)
const noInstituteFound = ref(false) // New: State for when no institute is registered
const user = useAuthStore().user

// Other reactive states (unchanged)
const teachingFaculties = ref([])
const loadingFaculties = ref(false)
const errorFaculties = ref(null)

const allPrograms = ref([])
const loadingAllPrograms = ref(false)
const errorAllPrograms = ref(null)

const capas = ref([])
const loadingCapas = ref(false)
const errorCapas = ref(null)


const fetchInstituteData = async () => {
  // Ensure user is authenticated before proceeding
  const userCid = user?.cid || user?.CID;
  if (!userCid) {
    error.value = "User CID not found. Please log in again.";
    loading.value = false;
    return;
  }

  // Reset state for a new fetch request
  loading.value = true;
  error.value = null;
  noInstituteFound.value = false;
  institute.value = null; // Also good to reset the main data holder

  try {
    const response = await apiService.getMhpcInstituteByCid(userCid);

    // Check if 'results' is a non-empty array
    if (response.data && Array.isArray(response.data.results) && response.data.results.length > 0) {
      // The institute data is the first object in the 'results' array
      const instituteData = response.data.results[0];
      institute.value = instituteData;

      // Ensure nested arrays exist before trying to access them
      // You can set default empty arrays if they are null or undefined
      if (!Array.isArray(institute.value.programs_offered_by_institute)) {
        institute.value.programs_offered_by_institute = [];
      }
      if (!Array.isArray(institute.value.teaching_centers)) {
        institute.value.teaching_centers = [];
      }

      // If we have a valid institute, fetch related data
      if (institute.value.id) {
        // Use Promise.all to fetch related data concurrently for better performance
        await Promise.all([
          fetchTeachingFaculties(institute.value.id),
          fetchCapas(institute.value.id)
        ]);
      }
    } else {
      // This block handles cases where the API returns a response with an empty 'results' array
      console.warn('No institute found for this user in the API response.');
      noInstituteFound.value = true;
    }
  } catch (err) {
    const errorDetail = err.response?.data?.detail || '';

    // Specific check for a "not found" message from the API
    if (errorDetail.includes('No Institute matches the given CID')) {
      console.warn('API returned a "No Institute" detail message.');
      noInstituteFound.value = true;
    } else {
      // Handle other potential network or server errors
      console.error('Error fetching institute data:', err);
      error.value = errorDetail || err.message || 'An unexpected error occurred while loading institute data.';
    }
  } finally {
    // This will always run, ensuring the loading state is turned off
    loading.value = false;
  }
};

const redirectToRegistration = () => {
  router.push('/admin/institutions/health_certification/track_eoi');
};

const fetchTeachingFaculties = async (instituteId) => {
  if (!instituteId) return;
  loadingFaculties.value = true
  errorFaculties.value = null
  try {
    const response = await apiService.getMhpcTeachingFaculties({ institute: instituteId })
    if (response.data && response.data.results) {
      teachingFaculties.value = response.data.results;
    } else if (Array.isArray(response.data)) {
        teachingFaculties.value = response.data;
    } else {
      console.warn('No teaching faculties in results or unexpected format for count:', response.data)
      teachingFaculties.value = [];
    }
  } catch (err) {
    console.error('Error fetching teaching faculties for count:', err)
    errorFaculties.value = err.response?.data?.detail || err.message || 'Failed to load teaching faculties.'
    teachingFaculties.value = [];
  } finally {
    loadingFaculties.value = false
  }
}

// New: Fetch CAPA data
const fetchCapas = async (instituteId) => {
  if (!instituteId) return;
  loadingCapas.value = true;
  errorCapas.value = null;
  try {
    const response = await apiService.getMhpcCapas({ institute: instituteId });
    if (response.data && response.data.results) {
      capas.value = response.data.results;
    } else if (Array.isArray(response.data)) {
      capas.value = response.data;
    } else {
      console.warn('No CAPA data in results or unexpected format:', response.data);
      capas.value = [];
    }
  } catch (err) {
    console.error('Error fetching CAPA data:', err);
    errorCapas.value = err.response?.data?.detail || err.message || 'Failed to load CAPA data.';
    capas.value = [];
  } finally {
    loadingCapas.value = false;
  }
};


const fetchAllProgramsOffered = async () => {
  loadingAllPrograms.value = true;
  errorAllPrograms.value = null;
  try {
    const response = await apiService.getMhpcProgramsOffered();
    if (response.data && response.data.results) {
      allPrograms.value = response.data.results;
    } else if (Array.isArray(response.data)) {
      allPrograms.value = response.data;
    } else {
      console.warn('No "all programs" in results or unexpected format:', response.data);
      allPrograms.value = [];
    }
  } catch (err) {
    console.error('Error fetching all programs offered:', err);
    errorAllPrograms.value = err.response?.data?.detail || err.message || 'Failed to load all available programs.';
  } finally {
    loadingAllPrograms.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const datePart = dateString.split('T')[0]; // Handles datetime strings
  try {
    return new Date(datePart).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
}

const statusClass = (status, isBadge = false, isKpi = false) => {
  if (!status) {
    const defaultClasses = isBadge ? 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold' : 'text-gray-500';
    return isKpi ? `${defaultClasses} text-2xl font-bold mt-1` : defaultClasses;
  }
  const lowerStatus = String(status).toLowerCase();
  // Base classes for badges
  const badgeClasses = 'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap';
  // Base classes for KPI numbers
  const kpiTextClasses = 'font-bold mt-1';

  let color = 'gray'; // Default color

  if (lowerStatus.includes('approved') || lowerStatus.includes('verified') || lowerStatus.includes('physically verified') || lowerStatus.includes('active') || lowerStatus.includes('complete') || lowerStatus.includes('closed')) {
    color = 'green';
  } else if (lowerStatus.includes('pending') || lowerStatus.includes('submitted') || lowerStatus.includes('review') || lowerStatus.includes('in progress') || lowerStatus.includes('open')) {
    color = 'yellow';
  } else if (lowerStatus.includes('rejected') || lowerStatus.includes('not verified') || lowerStatus.includes('inactive')) {
    color = 'red';
  } else if (lowerStatus.includes('n/a') || lowerStatus.includes('not required')) {
     color = 'blue';
  }

  if (isBadge) {
    return `bg-${color}-100 text-${color}-800 ${badgeClasses}`;
  } else if (isKpi) {
    return `text-${color}-700 ${kpiTextClasses}`; // Use a darker shade for KPIs
  }
  return `text-${color}-700`; // Default text color if not badge or KPI
}


onMounted(() => {
  fetchInstituteData();
  fetchAllProgramsOffered();
})
</script>

<style scoped>
/* Scoped styles can be used for more specific, non-Tailwind adjustments if necessary */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
