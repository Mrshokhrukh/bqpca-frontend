<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header Section -->
      <InstituteHeader
        :title="institute?.name_of_institution || 'Institute Profile'"
        :subtitle="
          institute ? `Headed by ${institute.head_of_institution_name}` : 'Loading details...'
        "
      />

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="flex justify-center items-center">
          <Loader class="animate-spin h-8 w-8 text-indigo-600" />
          <p class="ml-4 text-lg text-gray-600">Loading complete institute profile...</p>
        </div>
      </div>
      <div v-else-if="errorMessage" class="text-center py-20 bg-red-50 rounded-lg">
        <p class="text-red-700 font-medium">{{ errorMessage }}</p>
        <button
          @click="fetchProfileData"
          class="mt-4 btn btn-primary bg-red-600 hover:bg-red-700"
        >
          Retry
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="institute" class="mt-8">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.name"
              :class="[
                activeTab === tab.name
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              ]"
            >
              <component :is="tab.icon" class="inline-block h-5 w-5 mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="mt-8">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <h3 class="text-2xl font-bold text-gray-900">Institute Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem label="Head of Institution" :value="institute.head_of_institution_name" />
                  <InfoItem label="Head's Email" :value="institute.head_of_institution_email" is-email />
                  <InfoItem label="Head's Phone" :value="institute.head_of_institution_phone_number" />
                  <InfoItem label="Website" :value="institute.website" is-link />
                  <InfoItem label="Address" :value="fullAddress" class="md:col-span-2" />
                  <InfoItem label="Status" :value="institute.application_status_display" :value-class="getStatusClass(institute.application_status)" />
                  <InfoItem label="Validity" :value="`${formatDate(institute.valid_since)} to ${formatDate(institute.valid_till)}`" />
                </div>
              </div>
              <div class="space-y-6">
                <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <Users class="mx-auto h-10 w-10 text-indigo-500" />
                  <p class="mt-2 text-4xl font-bold text-gray-900">{{ faculty.length }}</p>
                  <p class="text-sm font-medium text-gray-500">Faculty Members</p>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <GraduationCap class="mx-auto h-10 w-10 text-indigo-500" />
                  <p class="mt-2 text-4xl font-bold text-gray-900">{{ programs.length }}</p>
                  <p class="text-sm font-medium text-gray-500">Education Programs</p>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <Building2 class="mx-auto h-10 w-10 text-indigo-500" />
                  <p class="mt-2 text-4xl font-bold text-gray-900">{{ teachingCenters.length }}</p>
                  <p class="text-sm font-medium text-gray-500">Teaching Centers</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Education Programs Tab -->
          <div v-if="activeTab === 'programs'" class="bg-white p-8 rounded-2xl shadow-lg">
             <h3 class="text-2xl font-bold text-gray-900 mb-6">Education Programs</h3>
             <div v-if="programs.length" class="space-y-4">
                <div v-for="program in programs" :key="program.id" class="border rounded-lg p-4 hover:bg-gray-50">
                    <p class="font-semibold text-lg text-gray-800">{{ program.specific_program_title }}</p>
                    <p class="text-sm text-gray-600">Master Program: {{ program.program_master.program_name }}</p>
                    <p class="text-sm text-gray-500">Status: <span :class="getStatusClass(program.status)">{{ program.status }}</span></p>
                </div>
             </div>
             <p v-else class="text-gray-500">No education programs found for this institute.</p>
          </div>

          <!-- Teaching Centers Tab -->
          <div v-if="activeTab === 'centers'" class="bg-white p-8 rounded-2xl shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Teaching Centers</h3>
            <div v-if="teachingCenters.length" class="space-y-4">
              <div v-for="center in teachingCenters" :key="center.id" class="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p class="font-semibold text-lg text-gray-800">{{ center.center_name }}</p>
                  <p class="text-sm text-gray-600">{{ center.center_location }}, {{ center.state_dzongkhag }}</p>
                  <p class="text-sm text-gray-500">Validity: {{ formatDate(center.valid_since) }} to {{ formatDate(center.valid_till) }}</p>
                </div>
                <span :class="getStatusClass(center.tc_review_decision)" class="px-3 py-1 text-xs font-medium rounded-full">{{ center.tc_review_decision }}</span>
              </div>
            </div>
            <p v-else class="text-gray-500">No teaching centers found for this institute.</p>
          </div>

          <!-- Faculty Tab -->
          <div v-if="activeTab === 'faculty'" class="bg-white p-8 rounded-2xl shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Faculty & Staff</h3>
            <div v-if="faculty.length" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="member in faculty" :key="member.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ member.faculty_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.designation }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.contact_no }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(member.date_of_joining) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="text-gray-500">No faculty or staff data found for this institute.</p>
          </div>

          <!-- CAPA Tab -->
          <div v-if="activeTab === 'capa'" class="bg-white p-8 rounded-2xl shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">CAPA Reports</h3>
            <div v-if="capas.length" class="space-y-4">
                <div v-for="capa in capas" :key="capa.id" class="border rounded-lg p-4 hover:bg-gray-50">
                    <div class="flex justify-between items-start">
                        <p class="font-semibold text-gray-800">{{ capa.observation_description }}</p>
                        <span :class="getStatusClass(capa.status)" class="px-3 py-1 text-xs font-medium rounded-full">{{ capa.status }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-2"><strong>Root Cause:</strong> {{ capa.root_cause }}</p>
                    <p class="text-sm text-gray-600"><strong>Corrective Action:</strong> {{ capa.capa }}</p>
                    <p class="text-sm text-gray-500 mt-2">Timeline: {{ formatDate(capa.implementation_timeline) }}</p>
                </div>
            </div>
            <p v-else class="text-gray-500">No CAPA reports found for this institute.</p>
          </div>

          <!-- Documents Tab -->
          <div v-if="activeTab === 'documents'" class="bg-white p-8 rounded-2xl shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Documents</h3>
            <div class="space-y-3">
                <DocumentLink :href="institute.institute_eoi_supporting_documents" label="EOI Supporting Document" />
                <DocumentLink :href="institute.do_dpr_report" label="DPR Report" />
                <!-- Add other document fields from the model here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import InfoItem from '@/components/common/MHPC/InfoItem.vue'
import DocumentLink from '@/components/common/MHPC/DocumentLink.vue'
import {
  Building2,
  GraduationCap,
  Home,
  Users,
  ClipboardCheck,
  FileText,
  Loader,
} from 'lucide-vue-next'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const institute = ref(null)
const programs = ref([])
const teachingCenters = ref([])
const faculty = ref([])
const capas = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const activeTab = ref('overview')

const tabs = [
  { name: 'overview', label: 'Overview', icon: Home },
  { name: 'programs', label: 'Education Programs', icon: GraduationCap },
  { name: 'centers', label: 'Teaching Centers', icon: Building2 },
  { name: 'faculty', label: 'Faculty', icon: Users },
  { name: 'capa', label: 'CAPA Reports', icon: ClipboardCheck },
  { name: 'documents', label: 'Documents', icon: FileText },
]

const fullAddress = computed(() => {
  if (!institute.value) return 'N/A'
  const parts = [
    institute.value.address,
    institute.value.village,
    institute.value.gewog,
    institute.value.dzongkhag,
  ]
  return parts.filter(Boolean).join(', ')
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusClass = (status) => {
  const s = status?.toLowerCase() || ''
  if (s.includes('approved') || s.includes('active') || s.includes('resolved')) return 'bg-green-100 text-green-800'
  if (s.includes('pending')) return 'bg-yellow-100 text-yellow-800'
  if (s.includes('rejected') || s.includes('inactive')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const fetchProfileData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const userCid = user.value?.cid
    if (!userCid) {
      throw new Error('User CID not found. Please log in again.')
    }

    // 1. Fetch main institute data
    const instituteResponse = await apiServices.getMhpcInstituteByCid(userCid)
    if (!instituteResponse.data?.results?.length) {
      throw new Error('Institute profile not found.')
    }
    institute.value = instituteResponse.data.results[0]
    const instituteId = institute.value.id

    // 2. Fetch related data in parallel
    const [
      programsResponse,
      centersResponse,
      facultyResponse,
      capaResponse,
    ] = await Promise.all([
      apiServices.getMhpcProgramsOffered({ institute: instituteId }),
      apiServices.getMhpcTeachingCenterByCid(userCid),
      apiServices.getMhpcTeachingFaculties(), // No institute filter available in API
      apiServices.getMhpcCapas(), // Filtered by user on backend
    ])

    programs.value = programsResponse.data?.results || []
    teachingCenters.value = centersResponse.data?.results || []
    capas.value = capaResponse.data?.results || []
    
    // Client-side filter for faculty as API doesn't support it
    const allFaculty = facultyResponse.data?.results || []
    faculty.value = allFaculty.filter(f => f.institute === instituteId)

  } catch (error) {
    console.error('Error fetching institute profile:', error)
    errorMessage.value = error.message || 'An unexpected error occurred.'
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProfileData()
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2 px-4 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
</style>
