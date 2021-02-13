<template>
  <div
    class="mt-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img src="@/assets/rgob.png" alt="BQPCA Logo" class="h-40 w-40" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900">BQPCA Certification Verification</h1>
        <p class="mt-2 text-lg text-gray-600">
          Verify the authenticity of professional certifications issued by the Bhutan Qualifications and Professional
          Certification Authority
        </p>
      </div>

      <!-- Normal Mode -->
      <div v-if="!isSearchMode" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-8">
          <!-- Step 1: Service Selection -->
          <div v-if="!selectedService" class="space-y-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Select Service Type</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(details, key) in certificationTypeDetails" :key="key"
                class="p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md" :class="[
        'border-gray-200 hover:border-blue-200'
      ]" @click="selectService(key)">
                <div class="flex items-start space-x-4">
                  <div class="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <component :is="details.icon" class="w-6 h-6" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ details.label }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ details.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Certificate ID Input -->
          <div v-else class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Enter Certificate ID</h2>
              <button @click="resetSelection"
                class="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                <ArrowLeftIcon class="w-4 h-4" />
                <span>Change Service</span>
              </button>
            </div>

            <div class="flex items-center space-x-4 mb-6 p-4 bg-blue-50 rounded-lg">
              <component :is="certificationTypeDetails[selectedService].icon" class="w-6 h-6 text-blue-600" />
              <div>
                <h3 class="font-medium text-gray-900">
                  {{ certificationTypeDetails[selectedService].label }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ certificationTypeDetails[selectedService].description }}
                </p>
              </div>
            </div>

            <form @submit.prevent="checkValidity" class="space-y-6">
              <div class="relative">
                <input v-model="certificationId" type="text"
                  class="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Certification ID (e.g., EDU123)" required />
                <div class="absolute right-4 top-3 text-gray-400">
                  <SearchIcon class="w-6 h-6" />
                </div>
              </div>

              <button type="submit"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                :disabled="isLoading">
                <Loader2Icon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
                <span>{{ isLoading ? 'Verifying...' : 'Verify Certification' }}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Search Mode -->
      <div v-if="isSearchMode" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-8">
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <Loader2Icon class="w-8 h-8 animate-spin text-blue-600" />
            <span class="ml-2 text-gray-600">Loading results...</span>
          </div>

          <div v-else-if="result && result.valid && result.details" class="space-y-8">
            <!-- Certificate Header -->
            <div class="border-b pb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <AwardIcon class="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 class="text-3xl font-bold text-gray-900">{{ result.details ? result.details.applicants_name :
        'Name Loading...' }}</h3>
                    <div class="flex items-center space-x-2 mt-1">
                      <span class="text-sm text-gray-500">QEC: {{ result.details ? result.details.qec_number : 'QEC Loading...' }}</span>
                      <span class="text-gray-300">|</span>
                      <span class="text-sm text-gray-500">CID: {{ result.details ? result.details.cid_no : 'CID Loading...' }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <span class="px-4 py-2 rounded-full text-sm font-semibold"
                    :class="result.details && result.details.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ result.details ? (result.details.status ? result.details.status.toString().toUpperCase() :
        'Status Loading...') : 'Status Loading...' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Personal Information -->
              <div class="bg-gray-50 rounded-xl p-6 space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <UserIcon class="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Date of Birth</span>
                    <span class="text-sm font-medium">{{ formatDate(result.details.date_of_birth) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Gender</span>
                    <span class="text-sm font-medium">{{ result.details.gender }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Contact</span>
                    <span class="text-sm font-medium">{{ result.details.contact_no }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Email</span>
                    <span class="text-sm font-medium">{{ result.details.email_address }}</span>
                  </div>
                </div>
              </div>

              <!-- Academic Information -->
              <div class="bg-gray-50 rounded-xl p-6 space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <GraduationCapIcon class="w-5 h-5 text-blue-600" />
                  <span>Academic Information</span>
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Course</span>
                    <span class="text-sm font-medium">{{ result.details.course_title }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Duration</span>
                    <span class="text-sm font-medium">{{ result.details.duration_of_course }} years</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Student ID</span>
                    <span class="text-sm font-medium">{{ result.details.student_id_no }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Completion Year</span>
                    <span class="text-sm font-medium">{{ result.details.year_of_completion }}</span>
                  </div>
                </div>
              </div>

              <!-- Institution Information -->
              <div class="bg-gray-50 rounded-xl p-6 space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <BuildingIcon class="w-5 h-5 text-blue-600" />
                  <span>Institution Details</span>
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">University</span>
                    <span class="text-sm font-medium">{{ result.details.name_of_university }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Institute</span>
                    <span class="text-sm font-medium">{{ result.details.name_of_institute }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Location</span>
                    <span class="text-sm font-medium">{{ result.details.location }}, {{ result.details.country }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Website</span>
                    <a :href="result.details.website" target="_blank"
                      class="text-sm text-blue-600 hover:underline">Visit Website</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPinIcon class="w-5 h-5 text-blue-600" />
                <span>Address Information</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                  <span class="text-sm text-gray-500">Dzongkhag</span>
                  <p class="font-medium">{{ result.details.dzongkhag }}</p>
                </div>
                <div class="space-y-2">
                  <span class="text-sm text-gray-500">Gewog</span>
                  <p class="font-medium">{{ result.details.gewog }}</p>
                </div>
                <div class="space-y-2">
                  <span class="text-sm text-gray-500">Village</span>
                  <p class="font-medium">{{ result.details.village }}</p>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <InfoIcon class="w-5 h-5 text-blue-600" />
                <span>Additional Information</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <span class="text-sm text-gray-500">Second Copy</span>
                  <p class="font-medium">{{ result.details.is_second_copy ? 'Yes' : 'No' }}</p>
                </div>
                <div class="space-y-2">
                  <span class="text-sm text-gray-500">From In Country</span>
                  <p class="font-medium">{{ result.details.from_in_country ? 'Yes' : 'No' }}</p>
                </div>
              </div>
            </div>

            <!-- Verification Stamp -->
            <div class="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-4 rounded-lg">
              <ShieldCheckIcon class="w-6 h-6" />
              <span class="text-sm font-medium">Verified by BQPCA Digital Verification System</span>
            </div>
          </div>

          <div v-else-if="result && !result.valid" class="text-center py-12">
            <div class="mx-auto h-16 w-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangleIcon class="h-8 w-8 text-red-600" />
            </div>
            <h3 class="mt-4 text-xl font-medium text-gray-900">Invalid Certification</h3>
            <p class="mt-2 text-gray-500">{{ result.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiServices from '@/services/services';
import {
  Search as SearchIcon,
  Award as AwardIcon,
  ShieldCheck as ShieldCheckIcon,
  AlertTriangle as AlertTriangleIcon,
  Loader2 as Loader2Icon,
  User as UserIcon,
  GraduationCap as GraduationCapIcon,
  Building as BuildingIcon,
  MapPin as MapPinIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  Wrench as WrenchIcon,
  Stethoscope as StethoscopeIcon,
  ScrollText as ScrollTextIcon,
  ArrowLeft as ArrowLeftIcon,
} from 'lucide-vue-next';

// Reactive state
const selectedService = ref('');
const certificationId = ref('');
const result = ref(null);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const isSearchActive = ref(false);

// Computed
const isSearchMode = computed(() => {
  console.log('route.path:', route.path, 'isSearchActive:', isSearchActive.value); // ADD THIS LINE
  return route.path === '/certification-validity/search' || isSearchActive.value;
});

// Constants
const certificationTypeDetails = {
  education: {
    icon: SchoolIcon,
    label: 'Education Certification',
    description: 'Verify academic qualifications and teaching certifications'
  },
  engineering: {
    icon: WrenchIcon,
    label: 'Engineering Certification',
    description: 'Validate professional engineering licenses and qualifications'
  },
  medical: {
    icon: StethoscopeIcon,
    label: 'Medical Certification',
    description: 'Check medical practice licenses and specializations'
  },
  roq: {
    icon: ScrollTextIcon,
    label: 'ROQ Certification',
    description: 'Verify Recognition of Prior Learning and other qualifications'
  }
};

// Methods
const formatDate = (dateString) => {
  console.log('formatDate called with:', dateString); // ADD THIS LINE
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const selectService = (service) => {
  selectedService.value = service;
};

const resetSelection = () => {
  selectedService.value = '';
  certificationId.value = '';
};

const checkValidity = async () => {
  const serviceType = selectedService.value || route.query.service_type;
  const certNumber = certificationId.value || route.query.cert_number;

  if (serviceType && certNumber) {
    isLoading.value = true;
    result.value = null;

    try {
      const response = await apiServices.verifyCertificate({
        service_type: serviceType,
        cert_number: certNumber,
      });

      // Correctly map API response fields
      result.value = {
        valid: response.data.valid,
        message: response.data?.message || 'Verification completed',
        details: response.data.details // Access nested details
      };

      // Update router only if not already in search mode
      if (!isSearchMode.value) {
        await router.push({
          path: '/certification-validity/search',
          query: { service_type: serviceType, cert_number: certNumber },
        });
      }

      isSearchActive.value = true;
    } catch (error) {
      console.error('API call failed:', error);
      result.value = {
        valid: false,
        message: 'Failed to verify certification. Please try again later.',
      };
    } finally {
      isLoading.value = false;
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  if (route.query.service_type && route.query.cert_number) {
    isSearchActive.value = true;
    checkValidity();
  }
});
</script>
