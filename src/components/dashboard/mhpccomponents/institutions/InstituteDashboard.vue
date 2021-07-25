<template>
  <div class="p-4 sm:p-4 lg:p-4 bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <Loader class="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
        <p class="mt-4 text-lg font-medium text-gray-600">Loading Your Dashboard...</p>
      </div>
    </div>

    <!-- No Institute Found State -->
    <div v-else-if="noInstituteFound" class="flex items-center justify-center h-screen">
      <div class="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        <Building2 class="mx-auto h-16 w-16 text-indigo-400" />
        <h2 class="mt-6 text-2xl font-bold text-gray-900">Welcome to BQPCA</h2>
        <p class="mt-2 text-gray-600">
          To get started, you need to register your institute. This will unlock your dashboard and all management features.
        </p>
        <button @click="redirectToRegistration" class="mt-8 btn btn-primary w-full">
          <PlusCircle class="mr-2 h-5 w-5" />
          Register Your Institute
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 bg-red-50 rounded-2xl shadow-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertTriangle class="h-8 w-8 text-red-400" />
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-bold text-red-800">Oops! Something went wrong.</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else-if="institute" class="space-y-8">
      <!-- Header -->
      <header>
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">{{ institute.name_of_institution }}</h1>
        <p class="mt-1 text-lg text-gray-600">Welcome back to your dashboard.</p>
      </header>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Overall Status" :value="institute.application_status_display" :icon="ShieldCheck" icon-color="text-blue-600" />
        <KPICard title="Active Programs" :value="programs.length" :icon="GraduationCap" icon-color="text-indigo-600" />
        <KPICard title="Teaching Centers" :value="teachingCenters.length" :icon="Hospital" icon-color="text-green-600" />
        <KPICard title="Faculty Members" :value="faculty.length" :icon="Users" icon-color="text-purple-600" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ActionButton label="New Program" :icon="PlusCircle" @click="navigateToAction('/programs')" />
              <ActionButton label="Manage Faculty" :icon="Users" @click="navigateToAction('/faculty')" />
              <ActionButton label="View CAPAs" :icon="ClipboardCheck" @click="navigateToAction('/capa')" />
              <ActionButton label="Renew Institute" :icon="RefreshCw" @click="renewInstitute" :is-primary="true" />
            </div>
          </div>

          <!-- Tabbed Content -->
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-6" aria-label="Tabs">
                <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" :class="[activeTab === tab.name ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm']">
                  {{ tab.label }}
                </button>
              </nav>
            </div>
            <div class="mt-6">
              <div v-if="activeTab === 'programs'">
                <ul v-if="programs.length" class="space-y-3">
                  <li v-for="program in programs" :key="program.id" class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span class="font-medium text-gray-800">{{ program.specific_program_title }}</span>
                    <span :class="getStatusClass(program.status)" class="px-3 py-1 text-xs font-semibold rounded-full">{{ program.status }}</span>
                  </li>
                </ul>
                <p v-else class="text-gray-500">No programs offered.</p>
              </div>
               <div v-if="activeTab === 'centers'">
                <ul v-if="teachingCenters.length" class="space-y-3">
                  <li v-for="center in teachingCenters" :key="center.id" class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span class="font-medium text-gray-800">{{ center.center_name }}</span>
                    <span :class="getStatusClass(center.tc_review_decision)" class="px-3 py-1 text-xs font-semibold rounded-full">{{ center.tc_review_decision }}</span>
                  </li>
                </ul>
                <p v-else class="text-gray-500">No teaching centers found.</p>
              </div>
              <div v-if="activeTab === 'capa'">
                <ul v-if="capas.length" class="space-y-3">
                  <li v-for="capa in capas" :key="capa.id" class="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <span class="font-medium text-gray-800 truncate pr-4">{{ capa.observation_description }}</span>
                    <span :class="getStatusClass(capa.status)" class="px-3 py-1 text-xs font-semibold rounded-full">{{ capa.status }}</span>
                  </li>
                </ul>
                <p v-else class="text-gray-500">No CAPA reports found.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar Column -->
        <div class="space-y-8">
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Institute Validity</h3>
            <div v-if="institute.is_active" class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Valid From</span>
                <span class="font-medium text-gray-800">{{ formatDate(institute.valid_since) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Valid Until</span>
                <span class="font-medium text-gray-800">{{ formatDate(institute.valid_till) }}</span>
              </div>
              <div class="pt-3">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: validityPercentage + '%' }"></div>
                  </div>
                  <p class="text-xs text-center mt-1 text-gray-500">{{ daysUntilExpiration }} days remaining</p>
              </div>
            </div>
            <div v-else class="text-center py-4">
                <p class="text-gray-600 font-medium">Institute is currently inactive.</p>
                <p class="text-sm text-gray-500">Complete registration or renewal to activate.</p>
            </div>
          </div>
           <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Contact Person</h3>
            <div class="flex items-center space-x-4">
                <div class="bg-indigo-100 p-3 rounded-full">
                    <UserCircle class="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                    <p class="font-bold text-gray-800">{{ institute.head_of_institution_name }}</p>
                    <p class="text-sm text-gray-500">{{ institute.head_of_institution_email }}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'
import {
  Loader,
  Building2,
  PlusCircle,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
  Hospital,
  Users,
  ClipboardCheck,
  RefreshCw,
  UserCircle,
  FileText
} from 'lucide-vue-next'

// Reusable Components (assuming they are created)
const KPICard = {
  props: ['title', 'value', 'icon', 'iconColor'],
  template: `
    <div class="bg-white p-5 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div :class="[iconColor, 'bg-opacity-10', 'p-3 rounded-full']">
        <component :is="icon" :size="28" />
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
    </div>
  `,
  components: { ShieldCheck, GraduationCap, Hospital, Users }
}

const ActionButton = {
  props: ['label', 'icon', 'isPrimary'],
  template: `
    <button :class="[isPrimary ? 'btn-primary' : 'btn-secondary']" class="w-full">
      <component :is="icon" class="h-5 w-5 mr-2" />
      <span>{{ label }}</span>
    </button>
  `,
  components: { PlusCircle, Users, ClipboardCheck, RefreshCw }
}

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const institute = ref(null)
const programs = ref([])
const teachingCenters = ref([])
const faculty = ref([])
const capas = ref([])
const loading = ref(true)
const error = ref(null)
const noInstituteFound = ref(false)
const activeTab = ref('programs')

const tabs = [
  { name: 'programs', label: 'Programs' },
  { name: 'centers', label: 'Teaching Centers' },
  { name: 'capa', label: 'CAPA Reports' },
]

const fetchInstituteData = async () => {
  const userCid = authStore.user?.cid
  if (!userCid) {
    error.value = 'User not authenticated.'
    loading.value = false
    return
  }

  try {
    const response = await apiServices.getMhpcInstituteByCid(userCid)
    if (response.data?.results?.length > 0) {
      institute.value = response.data.results[0]
      await fetchRelatedData(institute.value.id, userCid)
    } else {
      noInstituteFound.value = true
    }
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to fetch institute data.'
    console.error(error.value)
  } finally {
    loading.value = false
  }
}

const fetchRelatedData = async (instituteId, userCid) => {
  try {
    const [programsRes, centersRes, facultyRes, capasRes] = await Promise.all([
      apiServices.getMhpcProgramsOffered({ institute: instituteId }),
      apiServices.getMhpcTeachingCenterByCid(userCid),
      apiServices.getMhpcTeachingFaculties(),
      apiServices.getMhpcCapas(),
    ])
    programs.value = programsRes.data?.results || []
    teachingCenters.value = centersRes.data?.results || []
    capas.value = capasRes.data?.results || []
    faculty.value = (facultyRes.data?.results || []).filter(f => f.institute === instituteId)
  } catch (err) {
    toast.error('Failed to load some dashboard details.')
    console.error('Error fetching related data:', err)
  }
}

const redirectToRegistration = () => router.push('/admin/institutions/health_certification/track_eoi')
const navigateToAction = (path) => router.push(`/admin/institutions/health_certification${path}`)
const renewInstitute = () => toast.info('Institute renewal feature coming soon!')

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getStatusClass = (status) => {
  const s = status?.toLowerCase() || ''
  if (s.includes('approved') || s.includes('active') || s.includes('resolved')) return 'bg-green-100 text-green-800'
  if (s.includes('pending')) return 'bg-yellow-100 text-yellow-800'
  if (s.includes('rejected') || s.includes('inactive')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const daysBetween = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
}

const validityPercentage = computed(() => {
    if (!institute.value?.valid_since || !institute.value?.valid_till) return 0
    const totalDuration = daysBetween(institute.value.valid_since, institute.value.valid_till)
    if (totalDuration <= 0) return 100
    const elapsed = daysBetween(institute.value.valid_since, new Date())
    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
})

const daysUntilExpiration = computed(() => {
    if (!institute.value?.valid_till) return 0
    return Math.max(0, daysBetween(new Date(), institute.value.valid_till))
})

onMounted(fetchInstituteData)
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-secondary {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
</style>
