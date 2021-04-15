<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Application Tracking</h1>

      <!-- Search Bar -->
      <div class="mb-6">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by Application ID..."
          class="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Application Type Cards (Summary View) -->
        <div
          v-for="(applicationType, index) in applicationTypes"
          :key="index"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <div
            class="px-4 py-5 sm:px-6 flex items-center justify-between cursor-pointer"
            @click="toggleApplicationType(applicationType)"
          >
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <component :is="applicationType.icon" class="w-5 h-5 mr-2 text-blue-500" />
              {{ applicationType.label }}
            </h3>
            <button class="text-gray-400 hover:text-gray-500 focus:outline-none">
              <ChevronUp v-if="applicationType.expanded" class="w-5 h-5" />
              <ChevronDown v-else class="w-5 h-5" />
            </button>
          </div>
          <div class="border-t border-gray-200">
            <div v-if="applicationType.expanded" class="px-4 py-3 sm:px-6">
              <!--Sub Item-->
              <template v-if="applicationType.expandable">
                <div
                  v-for="(subItem, subIndex) in applicationType.subItems"
                  :key="subIndex"
                  @click="setSelectedApplicationType(applicationType, subItem)"
                  :class="{
                    'bg-blue-50':
                      selectedApplicationType === applicationType.id &&
                      selectedSubApplicationType === subItem.id,
                    'cursor-pointer': true,
                  }"
                  class="hover:bg-gray-50 flex items-center justify-between mb-2 last:mb-0"
                >
                  <div class="flex items-center">
                    <Circle class="w-3 h-3 mr-3 text-gray-400" /><!---->
                    <span>{{ subItem.label }}</span>
                  </div>
                  <ChevronRight class="w-4 h-4 text-gray-400" />
                </div>
              </template>
              <div
                v-else
                @click="setSelectedApplicationType(applicationType)"
                :class="{
                  'bg-blue-50': selectedApplicationType === applicationType.id,
                  'cursor-pointer': true,
                }"
                class="hover:bg-gray-50 flex items-center justify-between"
              >
                <div class="flex items-center">
                  <template v-if="!applicationType.expandable">
                    <Circle class="w-3 h-3 mr-3 text-gray-400" /><!---->
                  </template>
                  <span>{{ applicationType.label }}</span>
                </div>
                <ChevronRight class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Detail View-->
      <Transition name="fade">
        <div v-if="selectedApplicationType" class="mt-8 bg-white rounded-lg shadow overflow-hidden">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <component :is="getSelectedTypeIcon" class="w-5 h-5 mr-2 text-blue-500" />
              {{ selectedApplicationTypeLabel }}
              <span v-if="selectedSubApplicationTypeLabel" class="text-gray-500 ml-2"
                >/ {{ selectedSubApplicationTypeLabel }}</span
              >
            </h3>
            <button
              @click="clearSelectedApplicationType"
              class="ml-auto text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="border-t border-gray-200">
            <div class="px-4 py-4 sm:px-6">
              <!-- Status Filters -->
              <div class="mb-4 flex space-x-4">
                <button
                  v-for="(status, statusIndex) in [
                    'All',
                    'Under Review',
                    'Approved',
                    'Rejected',
                    'Pending',
                    'Site Visit Scheduled',
                    'Visited & Verified',
                  ]"
                  :key="statusIndex"
                  @click="selectedStatus = status"
                  :class="{
                    'bg-blue-500 text-white': selectedStatus === status,
                    'bg-gray-100 hover:bg-gray-200 text-gray-700': selectedStatus !== status,
                  }"
                  class="px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {{ status }}
                </button>
              </div>

              <div v-if="filteredApplications.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Application ID
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applicant Name
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Applied Date
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Site Visit Date
                      </th>
                      <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="application in filteredApplications" :key="application.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ application.id }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ application.applicantName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span
                          :class="getStatusClass(1, application.status)"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        >
                          {{ application.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(application.appliedDate) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{
                          application.siteVisitDate ? formatDate(application.siteVisitDate) : '-'
                        }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <template v-if="shouldShowPaymentButton(application)">
                          <button
                            @click="openPaymentModal(application)"
                            class="text-green-600 hover:text-green-900 mr-2"
                          >
                            Make Payment
                          </button>
                        </template>
                        <a href="#" class="text-blue-600 hover:text-blue-900">View</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-gray-500 py-4">No applications found.</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Payment Modal  -->
      <PaymentModal ref="paymentModalRef" :amount="1000" @close="closePaymentModal" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import {
  FilePlus,
  ListChecks,
  RefreshCcw,
  Edit2,
  Users,
  Link,
  Briefcase,
  FileText,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Circle,
  X,
} from 'lucide-vue-next'
import PaymentModal from '@/components/common/PaymentModal.vue' // Import PaymentModal component

// --- Application Types ---
const applicationTypes = reactive([
  {
    id: 'newApplications',
    label: 'New Applications',
    icon: FilePlus,
    expandable: true,
    expanded: false,
    subItems: [
      { id: 'individualECPF', label: 'Individual ECPF' },
      { id: 'collaboratedECPF', label: 'Collaborated ECPF' },
      { id: 'newBranch', label: 'New Branch' },
    ],
  },
  { id: 'ecpfRenewal', label: 'ECPF Renewal', icon: ListChecks, expandable: false },
  { id: 'ecpfNameChange', label: 'ECPF Name Change', icon: RefreshCcw, expandable: false },
  { id: 'locationChange', label: 'Location Change', icon: Edit2, expandable: false },
  { id: 'changeInOwnership', label: 'Change in Ownership', icon: Users, expandable: false },
  { id: 'linkageEstablishment', label: 'Linkage Establishment', icon: Link, expandable: false },
  { id: 'educationFair', label: 'Education Fair', icon: Briefcase, expandable: false },
  {
    id: 'promotionalEvent',
    label: 'Promotional Event',
    icon: FileText,
    expandable: true,
    expanded: false,
    subItems: [
      { id: 'inHouseEvent', label: 'In-house Event' },
      { id: 'massMediaEvent', label: 'Mass Media Event' },
      { id: 'heiVisit', label: 'HEI Visit' },
    ],
  },
  // REMOVE Site Visits Category:
  // { id: 'siteVisits', label: 'Site Visits', icon: Briefcase, expandable: false },
])

// --- Application Counts (Placeholder Data)---
const applicationCounts = ref({}) //Keep it empty

// --- Detailed Application Data (Placeholder) ---
const applications = ref([
  // ECPF Renewal - Payment on Approved
  {
    id: 'REN-001',
    type: 'ecpfRenewal',
    applicantName: 'Edu Solutions',
    status: 'Approved',
    appliedDate: '2024-01-12',
  },

  // New ECPF Establishment - Payment on Visited & Verified
  {
    id: 'NEW-ECPF-001',
    type: 'newApplications',
    subType: 'individualECPF',
    applicantName: 'New ECPF Org',
    status: 'Visited & Verified',
    appliedDate: '2024-06-01',
    siteVisitDate: '2024-06-10',
  },

  // Collaborated ECPF - Payment on Visited & Verified
  {
    id: 'COL-ECPF-001',
    type: 'newApplications',
    subType: 'collaboratedECPF',
    applicantName: 'Collab ECPF Org',
    status: 'Visited & Verified',
    appliedDate: '2024-06-03',
    siteVisitDate: '2024-06-12',
  },

  // Branch ECPF - Payment on Visited & Verified
  {
    id: 'BRANCH-ECPF-001',
    type: 'newApplications',
    subType: 'newBranch',
    applicantName: 'Branch ECPF Org',
    status: 'Visited & Verified',
    appliedDate: '2024-06-05',
    siteVisitDate: '2024-06-15',
  },

  // Change in Ownership - Payment on Visited & Verified
  {
    id: 'OWN-001',
    type: 'changeInOwnership',
    applicantName: 'Ownership Change Org',
    status: 'Visited & Verified',
    appliedDate: '2024-06-07',
    siteVisitDate: '2024-06-18',
  },

  // ECPF Name Change - No Payment
  {
    id: 'NAM-001',
    type: 'ecpfNameChange',
    applicantName: 'Study Abroad',
    status: 'Under Review',
    appliedDate: '2024-03-14',
  },

  // Location Change - No Payment
  {
    id: 'LOC-001',
    type: 'locationChange',
    applicantName: 'Global Education',
    status: 'Approved',
    appliedDate: '2024-03-20',
  },

  // Linkage Establishment - No Payment
  {
    id: 'LINK-001',
    type: 'linkageEstablishment',
    applicantName: 'Study Abroad',
    status: 'Under Review',
    appliedDate: '2024-03-14',
  },

  // Education Fair - No Payment
  {
    id: 'EDU-001',
    type: 'educationFair',
    applicantName: 'Bhutan Education',
    status: 'Under Review',
    appliedDate: '2024-04-24',
  },

  // Promotional Event - No Payment
  {
    id: 'PRO-001',
    type: 'promotionalEvent',
    subType: 'inHouseEvent',
    applicantName: 'Study Abroad',
    status: 'Approved',
    appliedDate: '2024-03-14',
  },

  // REMOVE Site Visits Example Applications:
  // { id: 'SITE-001', type: 'siteVisits', applicantName: 'Visit Org 1', status: 'Site Visit Scheduled', appliedDate: '2024-05-01', siteVisitDate: '2024-05-15' },
  // { id: 'SITE-002', type: 'siteVisits', applicantName: 'Visit Org 2', status: 'Visited & Verified', appliedDate: '2024-05-05', siteVisitDate: '2024-05-18' },
  // { id: 'SITE-003', type: 'siteVisits', applicantName: 'Visit Org 3', status: 'Site Visit Scheduled', appliedDate: '2024-05-08', siteVisitDate: '2024-05-22' },
  // { id: 'SITE-004', type: 'siteVisits', applicantName: 'Visit Org 4', status: 'Visited & Verified', appliedDate: '2024-05-10', siteVisitDate: '2024-05-25' },
])

// --- Selected Application Type ---
const selectedApplicationType = ref(null)
const selectedSubApplicationType = ref(null)
const selectedStatus = ref('All') // Filter by status
const searchTerm = ref('') // Search term

// --- Payment Modal State ---
const paymentModalRef = ref(null) // Create a ref to access PaymentModal instance
const selectedApplicationForPayment = ref(null)

const getSelectedTypeIcon = computed(() => {
  const type = applicationTypes.find((appType) => appType.id === selectedApplicationType.value)
  if (type) {
    return type.icon
  }
  return null
})

// --- Computed Properties ---
const selectedApplicationTypeLabel = computed(() => {
  const type = applicationTypes.find((appType) => appType.id === selectedApplicationType.value)
  return type ? type.label : ''
})

const selectedSubApplicationTypeLabel = computed(() => {
  if (!selectedSubApplicationType.value) return null
  const type = applicationTypes.find((appType) => appType.id === selectedApplicationType.value)
  if (!type) return null
  const subType = type.subItems?.find((sub) => sub.id === selectedSubApplicationType.value)
  return subType ? subType.label : null
})

// Filtered applications based on selected type, sub-type, status, and search term
const filteredApplications = computed(() => {
  if (!selectedApplicationType.value) {
    return []
  }

  let filtered = applications.value.filter((app) => app.type === selectedApplicationType.value)

  if (selectedSubApplicationType.value) {
    filtered = filtered.filter((app) => app.subType === selectedSubApplicationType.value)
  }

  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter((app) => app.status === selectedStatus.value)
  }

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter((app) => app.id.toLowerCase().includes(term))
  }
  return filtered
})

// --- Helper Function for Status Classes ---
const getStatusClass = (count, type = 'blue') => {
  if (count === 0 && type === 'blue') return 'bg-gray-100 text-gray-800' // Important for zero counts
  const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
  switch (type) {
    case 'green':
    case 'Approved':
    case 'Visited & Verified': // NEW STATUS
      return `${base} bg-green-100 text-green-800`
    case 'red':
    case 'Rejected':
      return `${base} bg-red-100 text-red-800`
    case 'yellow':
    case 'Pending':
    case 'Site Visit Scheduled': // NEW STATUS
      return `${base} bg-yellow-100 text-yellow-800`
    case 'blue':
    case 'Under Review':
    default:
      return `${base} bg-blue-100 text-blue-800`
  }
}

//Date ফরম্যাট
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// --- Methods ---
const toggleApplicationType = (applicationType) => {
  applicationType.expanded = !applicationType.expanded
  //Close the detail view
  if (applicationType.expanded === false) {
    selectedApplicationType.value = null
    selectedSubApplicationType.value = null
  }
}

const setSelectedApplicationType = (applicationType, subItem = null) => {
  selectedApplicationType.value = applicationType.id
  selectedSubApplicationType.value = subItem ? subItem.id : null // Set sub-type if provided
  selectedStatus.value = 'All' // Reset status filter
  searchTerm.value = '' // Reset search term
}

const clearSelectedApplicationType = () => {
  selectedApplicationType.value = null
  selectedSubApplicationType.value = null
}

// --- Payment Modal Methods ---
const openPaymentModal = (application) => {
  console.log('openPaymentModal function called for application:', application.id)
  paymentModalRef.value.openModal() // Call the openModal method of PaymentModal using the ref
  selectedApplicationForPayment.value = application
}

const closePaymentModal = () => {
  // isVisible.value = false; // No need to control parent isVisible anymore
  selectedApplicationForPayment.value = null
}

// --- Method to determine if payment button should be shown ---
const shouldShowPaymentButton = (application) => {
  const paymentRequiredTypes = [
    'ecpfRenewal',
    'newApplications', // Covers: Individual, Collaborated, Branch ECPF
    'changeInOwnership',
  ]

  if (!paymentRequiredTypes.includes(application.type)) {
    return false // Payment not required for this application type
  }

  if (application.type === 'ecpfRenewal') {
    return application.status === 'Approved' // Payment for ECPF Renewal on 'Approved' status
  } else {
    return application.status === 'Visited & Verified' // Payment for other types on 'Visited & Verified'
  }
}

// --- Fetch Data on Mount (Replace with your API calls) ---
onMounted(async () => {
  //   try {
  //      // Fetch application types (if dynamic)
  //      // const appTypesResponse = await apiService.getApplicationTypes();
  //      // applicationTypes.value = appTypesResponse.data;

  //      // Fetch detailed application data
  //      const applicationsResponse = await apiService.getApplications(); // Replace with your API endpoint
  //      applications.value = applicationsResponse.data;

  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  calculateApplicationCounts()
})

// Calculate Application Counts
const calculateApplicationCounts = () => {
  const counts = {}

  for (const app of applications.value) {
    const typeId = app.type
    const subTypeId = app.subType
    const status = app.status

    // Initialize if not already present
    if (!counts[typeId]) {
      counts[typeId] = {
        UnderReview: 0,
        Approved: 0,
        Rejected: 0,
        Pending: 0,
        'Site Visit Scheduled': 0,
        'Visited & Verified': 0,
      } // Include new statuses
    }
    if (subTypeId && !counts[typeId][subTypeId]) {
      counts[typeId][subTypeId] = {
        UnderReview: 0,
        Approved: 0,
        Rejected: 0,
        Pending: 0,
        'Site Visit Scheduled': 0,
        'Visited & Verified': 0,
      } // Include new statuses
    }

    // Increment top-level count
    counts[typeId][status]++
    //increment sub item count
    if (subTypeId) {
      counts[typeId][subTypeId][status]++
    }
  }
  applicationCounts.value = counts
  // console.log(applicationCounts.value);
}
</script>

<style scoped>
/* Add any custom styles here, if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
