<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header Section -->
      <InstituteHeader
        :title="institute?.name_of_institution || 'Institute Profile'"
        :subtitle="institute ? `Headed by ${institute.head_of_institution_name}` : 'Loading details...'"
      />

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <Loader class="animate-spin h-10 w-10 text-indigo-600" />
        <p class="ml-4 text-lg text-gray-700">Loading complete institute profile...</p>
      </div>

      <div v-else-if="errorMessage" class="text-center py-16 bg-red-50 rounded-xl border border-red-200">
        <p class="text-red-700 font-medium text-lg">{{ errorMessage }}</p>
        <button @click="fetchProfileData" class="mt-6 btn btn-primary bg-red-600 hover:bg-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.458-4.848 1 1 0 011.98.243 3.5 3.5 0 006.498 3.005 1 1 0 011.98.242zM10 3a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm-5.5 7.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" clip-rule="evenodd" />
          </svg>
          Retry
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="institute" class="mt-6">
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
                'group inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none',
              ]"
            >
              <component
                :is="tab.icon"
                :class="[
                  activeTab === tab.name ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                  'h-5 w-5 mr-2 transition-colors duration-200',
                ]"
              />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="mt-8">
          <transition name="fade" mode="out-in">
            <div :key="activeTab">
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Details Card -->
                <div class="lg:col-span-2 p-8 rounded-2xl shadow-sm bg-white border border-gray-200/80">
                  <div class="flex justify-between items-start mb-8">
                    <div>
                      <h3 class="text-2xl font-bold text-gray-800">Institute Details</h3>
                      <p class="text-gray-500 mt-1">General information and contact details.</p>
                    </div>
                    <div class="flex items-center space-x-2 flex-shrink-0">
                      <button v-if="!isEditing" @click="startEditing" class="btn btn-secondary">
                        <Pencil class="h-4 w-4 mr-2" /> Edit
                      </button>
                      <template v-else>
                        <button @click="cancelEdit" class="btn btn-secondary bg-gray-100 hover:bg-gray-200">Cancel</button>
                        <button @click="saveChanges" class="btn btn-primary" :disabled="isSaving">
                          <Loader v-if="isSaving" class="animate-spin h-5 w-5 mr-2" />
                          <Save v-else class="h-5 w-5 mr-2" /> Save
                        </button>
                      </template>
                    </div>
                  </div>

                  <!-- VIEW MODE: Field Block Design -->
                  <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldBlock icon="User" label="Head of Institution" :value="institute.head_of_institution_name" />
                    <FieldBlock icon="Mail" label="Head's Email" :value="institute.head_of_institution_email" is-email />
                    <FieldBlock icon="Hash" label="CID" :value="institute.CID" />
                    <FieldBlock icon="Phone" label="Head's Phone" :value="institute.head_of_institution_phone_number" />
                    <FieldBlock icon="Globe" label="Website" :value="institute.website" is-link class="md:col-span-2" />
                    <FieldBlock icon="MapPin" label="Address" :value="fullAddress" class="md:col-span-2" />
                  </div>

                  <!-- EDIT MODE: Stacked Form Design -->
                  <div v-else class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label for="head_name" class="form-label-stacked">Head of Institution</label>
                        <input type="text" v-model="editableInstitute.head_of_institution_name" id="head_name" class="form-input-stacked" />
                      </div>
                       <div>
                        <label for="head_email" class="form-label-stacked">Head's Email</label>
                        <input type="email" v-model="editableInstitute.head_of_institution_email" id="head_email" class="form-input-stacked" />
                      </div>
                      <div>
                        <label for="head_phone" class="form-label-stacked">Head's Phone</label>
                        <input type="text" v-model="editableInstitute.head_of_institution_phone_number" id="head_phone" class="form-input-stacked" />
                      </div>
                      <div>
                        <label for="website" class="form-label-stacked">Website</label>
                        <input type="url" v-model="editableInstitute.website" id="website" class="form-input-stacked" />
                      </div>
                      <div class="md:col-span-2">
                        <label for="address" class="form-label-stacked">Address</label>
                        <input type="text" v-model="editableInstitute.address" id="address" class="form-input-stacked" />
                      </div>
                      <div>
                        <label for="village" class="form-label-stacked">Village</label>
                        <input type="text" v-model="editableInstitute.village" id="village" class="form-input-stacked" />
                      </div>
                      <div>
                        <label for="gewog" class="form-label-stacked">Gewog</label>
                        <input type="text" v-model="editableInstitute.gewog" id="gewog" class="form-input-stacked" />
                      </div>
                      <div>
                        <label for="dzongkhag" class="form-label-stacked">Dzongkhag</label>
                        <input type="text" v-model="editableInstitute.dzongkhag" id="dzongkhag" class="form-input-stacked" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bento Grid Items -->
                <div class="space-y-6">
                  <div class="bento-card bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
                    <div class="flex justify-between items-center">
                      <p class="font-semibold text-gray-600">Application Status</p>
                      <span class="font-medium px-3 py-1 rounded-full text-sm" :class="getStatusClass(institute.application_status)">
                        {{ institute.application_status }}
                      </span>
                    </div>
                  </div>
                  <div class="bento-card bg-gradient-to-br from-slate-50 via-white to-slate-50">
                     <FieldBlock icon="Calendar" label="Validity Period" :value="`${formatDate(institute.valid_since)} to ${formatDate(institute.valid_till)}`" :is-inline="false" />
                  </div>
                  <div class="bento-card bg-white">
                    <div class="flex items-center space-x-5">
                        <div class="p-3 rounded-full bg-indigo-100">
                          <Users class="h-7 w-7 text-indigo-600" />
                        </div>
                        <div>
                          <p class="text-3xl font-bold text-gray-800">{{ faculty.length }}</p>
                          <p class="text-sm font-medium text-gray-500">Faculty Members</p>
                        </div>
                      </div>
                  </div>
                  <div class="bento-card bg-white">
                     <div class="flex items-center space-x-5">
                        <div class="p-3 rounded-full bg-sky-100">
                          <GraduationCap class="h-7 w-7 text-sky-600" />
                        </div>
                        <div>
                          <p class="text-3xl font-bold text-gray-800">{{ programs.length }}</p>
                          <p class="text-sm font-medium text-gray-500">Education Programs</p>
                        </div>
                      </div>
                  </div>
                   <div class="bento-card bg-white">
                     <div class="flex items-center space-x-5">
                        <div class="p-3 rounded-full bg-emerald-100">
                          <Building2 class="h-7 w-7 text-emerald-600" />
                        </div>
                         <div>
                          <p class="text-3xl font-bold text-gray-800">{{ teachingCenters.length }}</p>
                          <p class="text-sm font-medium text-gray-500">Training Centers</p>
                        </div>
                      </div>
                  </div>
                   <button v-if="institute.application_status?.toLowerCase().includes('approved')"
                      @click="openCertificateModal" class="w-full btn btn-primary">
                      View Certificate
                    </button>
                </div>
              </div>

              <!-- Education Programs Tab -->
              <div v-if="activeTab === 'programs'" class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">Education Programs</h3>
                <div v-if="programs.length" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div v-for="program in programs" :key="program.id" class="border rounded-lg p-5 hover:shadow-md hover:border-indigo-200 transition-shadow duration-200">
                    <p class="font-semibold text-lg text-gray-800">{{ program.specific_program_title }}</p>
                    <p class="text-sm text-gray-500 mt-1">Master Program: {{ program.program_master.program_name }}</p>
                    <div class="mt-4">
                        <span class="font-medium px-3 py-1 rounded-full text-xs" :class="getStatusClass(program.status)">{{ program.status }}</span>
                    </div>
                  </div>
                </div>
                <p v-else class="text-gray-500 text-center py-8">No education programs found for this institute.</p>
              </div>

              <!-- Training Centers Tab -->
              <div v-if="activeTab === 'centers'" class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">Training Centers</h3>
                <div v-if="teachingCenters.length" class="space-y-4">
                  <div v-for="center in teachingCenters" :key="center.id" class="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50/80 transition-colors duration-200">
                    <div>
                      <p class="font-semibold text-lg text-gray-800">{{ center.center_name }}</p>
                      <p class="text-sm text-gray-600 mt-1">{{ center.center_location }}, {{ center.state_dzongkhag }}</p>
                      <p class="text-sm text-gray-500 mt-2">Validity: {{ formatDate(center.valid_since) }} to {{ formatDate(center.valid_till) }}</p>
                    </div>
                     <span :class="getStatusClass(center.tc_review_decision)" class="px-3 py-1 text-xs font-medium rounded-full flex-shrink-0">{{ center.tc_review_decision }}</span>
                  </div>
                </div>
                <p v-else class="text-gray-500 text-center py-8">No teaching centers found for this institute.</p>
              </div>

              <!-- Faculty Tab -->
                <div v-if="activeTab === 'faculty'" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 class="text-2xl font-bold text-gray-800 mb-6 px-2">Faculty & Staff</h3>
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
                        <tr v-for="member in faculty" :key="member.id" class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ member.faculty_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.designation }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ member.contact_no }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(member.date_of_joining) }}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <p v-else class="text-gray-500 text-center py-8">No faculty or staff data found for this institute.</p>
                </div>


              <!-- CAPA Tab -->
              <div v-if="activeTab === 'capa'" class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">CAPA Reports</h3>
                <div v-if="capas.length" class="space-y-5">
                    <div v-for="capa in capas" :key="capa.id" class="border rounded-lg p-5 hover:shadow-md hover:border-indigo-200 transition-shadow duration-200">
                        <div class="flex justify-between items-start">
                        <p class="font-semibold text-gray-800 pr-4">{{ capa.observation_description }}</p>
                        <span :class="getStatusClass(capa.status)" class="px-3 py-1 text-xs font-medium rounded-full flex-shrink-0">{{ capa.status }}</span>
                        </div>
                        <div class="mt-4 space-y-2 text-sm">
                            <p><strong class="font-medium text-gray-600">Root Cause:</strong> <span class="text-gray-700">{{ capa.root_cause }}</span></p>
                            <p><strong class="font-medium text-gray-600">Corrective Action:</strong> <span class="text-gray-700">{{ capa.capa }}</span></p>
                        </div>
                        <p class="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        Timeline: {{ formatDate(capa.implementation_timeline) }}
                        </p>
                    </div>
                </div>
                <p v-else class="text-gray-500 text-center py-8">No CAPA reports found for this institute.</p>
              </div>

              <!-- Documents Tab -->
              <div v-if="activeTab === 'documents'" class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">Documents</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentLink :href="institute.institute_eoi_supporting_documents" label="EOI Supporting Document" />
                  <DocumentLink :href="institute.do_dpr_report" label="DPR Report" />
                  <!-- Add other document fields from the model here -->
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Certificate Modal -->
    <teleport to="body">
      <transition name="modal-certificate-fade">
        <div v-if="showCertificateModal" class="fixed inset-0 z-[60] bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeCertificateModal">
          <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
              <h3 class="text-lg font-semibold text-gray-800">Institute Certificate of Recognition</h3>
              <button @click="closeCertificateModal" class="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div class="overflow-y-auto flex-1 p-2">
              <TeachingCenterCertificate v-if="selectedCertificateData" ref="certificateComponentRef" :center-data="selectedCertificateData" cert-type="medical-institute"/>
            </div>
            <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
              <button @click="closeCertificateModal" class="btn btn-secondary">
                Close
              </button>
              <button @click="downloadCertificate" class="btn btn-primary">
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import FieldBlock from '@/components/common/MHPC/FieldBlock.vue' // NEW
import DocumentLink from '@/components/common/MHPC/DocumentLink.vue'
import TeachingCenterCertificate from './TeachingCenterCertificate.vue'
import {
  Building2,
  GraduationCap,
  Home,
  Users,
  ClipboardCheck,
  FileText,
  Loader,
  Pencil,
  Save,
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

// State for editing functionality
const isEditing = ref(false)
const isSaving = ref(false)
const editableInstitute = ref(null)

const showCertificateModal = ref(false)
const selectedCertificateData = ref(null)
const certificateComponentRef = ref(null)

const tabs = [
  { name: 'overview', label: 'Overview', icon: Home },
  { name: 'programs', label: 'Programs', icon: GraduationCap },
  { name: 'centers', label: 'Training Centers', icon: Building2 },
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
  if (s.includes('approved') || s.includes('active') || s.includes('resolved') || s.includes('completed'))
    return 'bg-green-100 text-green-800'
  if (s.includes('pending') || s.includes('submitted')) return 'bg-yellow-100 text-yellow-800'
  if (s.includes('rejected') || s.includes('inactive') || s.includes('closed')) return 'bg-red-100 text-red-800'
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

    const instituteResponse = await apiServices.getMhpcInstituteByCid(userCid)
    if (!instituteResponse.data?.results?.length) {
      throw new Error('No institute profile has been created for this account.')
    }
    institute.value = instituteResponse.data.results[0]
    const instituteId = institute.value.id
    const instituteCid = institute.value.CID;

    const [programsResponse, centersResponse, facultyResponse, capaResponse] = await Promise.all([
      apiServices.getMhpcProgramsOffered({ institute: instituteId }),
      apiServices.getMhpcTeachingCenterByCid(instituteCid),
      apiServices.getMhpcTeachingFaculties(),
      apiServices.getMhpcCapaByCid(instituteCid),
    ])

    programs.value = programsResponse.data?.results || []
    teachingCenters.value = centersResponse.data?.results || []
    capas.value = capaResponse.data?.results || []

    const allFaculty = facultyResponse.data?.results || []
    faculty.value = allFaculty.filter((f) => f.institute === instituteId)

  } catch (error) {
    console.error('Error fetching institute profile:', error);
    errorMessage.value = error.message || 'An unexpected error occurred while fetching profile data.'
    toast.error(errorMessage.value, { timeout: 6000 });
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  editableInstitute.value = JSON.parse(JSON.stringify(institute.value))
  isEditing.value = true
}

const cancelEdit = () => {
  editableInstitute.value = null
  isEditing.value = false
}

const saveChanges = async () => {
  if (!editableInstitute.value) return
  isSaving.value = true

  const payload = {
    head_of_institution_name: editableInstitute.value.head_of_institution_name,
    head_of_institution_email: editableInstitute.value.head_of_institution_email,
    head_of_institution_phone_number: editableInstitute.value.head_of_institution_phone_number,
    CID: editableInstitute.value.CID,
    website: editableInstitute.value.website,
    address: editableInstitute.value.address,
    village: editableInstitute.value.village,
    gewog: editableInstitute.value.gewog,
    dzongkhag: editableInstitute.value.dzongkhag,
  }

  try {
     const response = await apiServices.patchMhpcInstitute(institute.value.id, payload)
    institute.value = { ...institute.value, ...response.data }
    toast.success('Institute profile updated successfully!')
    isEditing.value = false
    editableInstitute.value = null
  } catch (error) {
    console.error('Error updating institute profile:', error.response)
    const errorMsg =
      error.response?.data?.detail ||
      (typeof error.response?.data === 'object' ? Object.values(error.response.data).join('; ') : null) ||
      'Failed to save changes. Please check the fields and try again.'
    toast.error(errorMsg, { timeout: 6000 })
  } finally {
    isSaving.value = false
  }
}


const openCertificateModal = () => {
  if (!institute.value) return;
  selectedCertificateData.value = {
    institute_name: institute.value.name_of_institution,
    valid_since: institute.value.valid_since,
    last_renewal_date: null,
    valid_till: institute.value.valid_till,
    target_category: 'Health Training Institute'
  };
  showCertificateModal.value = true;
};

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedCertificateData.value = null
}

const downloadCertificate = () => {
  if (certificateComponentRef.value) {
    certificateComponentRef.value.exportToPDF()
  }
}

onMounted(() => {
  fetchProfileData()
})

// Watch for route query changes to activate a specific tab
watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    const tabExists = tabs.some(t => t.name === newTab);
    if (tabExists) {
      activeTab.value = newTab;
    }
  }
}, { immediate: true });

</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2 px-4 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}

.btn-secondary {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.bento-card {
    @apply bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 transition-all duration-300 hover:shadow-md hover:border-gray-300/80 hover:scale-[1.02];
}

/* Clean, Stacked Form Styles */
.form-label-stacked {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}

.form-input-stacked {
  @apply block w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500;
}

/* Tab Content Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Certificate Modal Transition */
.modal-certificate-fade-enter-active,
.modal-certificate-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-certificate-fade-enter-from,
.modal-certificate-fade-leave-to {
  opacity: 0;
}
.modal-certificate-fade-enter-active .rounded-xl,
.modal-certificate-fade-leave-active .rounded-xl {
  transition: all 0.3s ease;
}
.modal-certificate-fade-enter-from .rounded-xl,
.modal-certificate-fade-leave-to .rounded-xl {
  transform: scale(0.95) translateY(20px);
}
</style>
