<template>
  <div
    class="application-tracking mx-auto p-4 md:p-6 bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg"
  >
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8">
      <h1
        class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
      >
        Track Your Learning Hospital Applications
      </h1>
      <div v-if="savedDraft" class="flex items-center space-x-4">
        <button
          @click="openApplicationFormModal(true)"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Load Draft and Continue
        </button>
        <button
          @click="discardDraft"
          class="px-4 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Discard Draft and Add New
        </button>
      </div>
      <button
        v-else
        @click="openApplicationFormModal(false)"
        class="mt-4 sm:mt-0 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Add New Hospital
      </button>
    </div>

    <div v-if="isLoading && !applications.length" class="text-center py-8">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <p class="text-gray-600 mt-2">Loading applications...</p>
    </div>

    <div
      v-if="!isLoading || applications.length"
      class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
    >
      <div class="relative w-full sm:w-auto sm:flex-grow lg:flex-grow-0 lg:w-1/3">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by center name or location"
          class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm"
        />
        <MagnifyingGlassIcon
          class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        />
      </div>
      <div class="flex gap-2 sm:gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-40 md:w-48">
          <select
            v-model="filterDzongkhag"
            class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm appearance-none"
          >
            <option value="">All Dzongkhags</option>
            <option
              v-for="dzongkhag in dzongkhagOptionsForCenter"
              :key="dzongkhag.value"
              :value="dzongkhag.value"
            >
              {{ dzongkhag.label }}
            </option>
          </select>
          <ChevronDownIcon
            class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          />
        </div>
        <div class="relative w-full sm:w-40 md:w-48">
          <select
            v-model="filterGewog"
            class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm appearance-none"
            :disabled="!filterDzongkhag"
          >
            <option value="">{{ filterDzongkhag ? 'All Gewogs' : 'Select Dzongkhag' }}</option>
            <option v-for="gewog in gewogOptionsForCenter" :key="gewog.value" :value="gewog.value">
              {{ gewog.label }}
            </option>
          </select>
          <ChevronDownIcon
            class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          />
        </div>
      </div>
    </div>

    <div
      v-if="!isLoading || applications.length"
      class="overflow-x-auto bg-white rounded-lg shadow"
    >
      <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gradient-to-r from-indigo-50 to-purple-50">
          <tr>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hospital Name</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Status</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Clinical Preceptor</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valid Till</th>
            <th class="px-4 py-3 md:px-6 md:py-3 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading && applications.length">
            <td colspan="7" class="text-center py-8 relative">
              <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              </div>
            </td>
          </tr>
          <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50/50 transition-colors duration-150">
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ application.center_name }}</td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">
              {{ application.center_location }}
              <span class="text-gray-400">({{ application.state_dzongkhag }}, {{ application.city_gewog }})</span>
            </td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm">
              <span :class="statusClass(application.tc_review_decision)" class="px-2.5 py-1 rounded-full text-xs font-semibold leading-tight">{{ application.tc_review_decision || 'Unknown' }}</span>
            </td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm">
              <span :class="paymentStatusClass(application.payment_status)" class="px-2.5 py-1 rounded-full text-xs font-semibold leading-tight">{{ formatPaymentStatus(application.payment_status) }}</span>
            </td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">{{ application.preceptorName || 'N/A' }}</td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(application.valid_till) }}</td>
            <td class="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
              <button v-if="canMakePayment(application)" @click="initiateTeachingCenterPayment(application)" class="px-3 py-1.5 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 text-xs font-medium transition-colors" :disabled="isPaymentProcessing || isLoading">Make Payment</button>
              <button v-if="canAddPreceptor(application) && !application.isPreceptorAdded" @click="openAddPreceptorModal(application)" class="px-3 py-1.5 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 text-xs font-medium transition-colors" :disabled="isLoading">Add Clinical Preceptor</button>
              <button v-if="application.isPreceptorAdded && canRemovePreceptor(application)" @click="confirmRemovePreceptor(application)" class="px-3 py-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 text-xs font-medium transition-colors" :disabled="isLoading">Remove Preceptor</button>
              <button v-if="canDownloadCertificate(application)" @click="openCertificateModal(application)" class="px-3 py-1.5 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 text-xs font-medium transition-colors">View Certificate</button>
              <button @click="viewDetails(application)" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md shadow-sm hover:bg-blue-200 text-xs font-medium transition-colors">View Details</button>
            </td>
          </tr>
          <tr v-if="!isLoading && filteredApplications.length === 0">
            <td colspan="7" class="px-6 py-10 text-center text-gray-500 text-sm">
              <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                No applications found.
                <span v-if="searchQuery || filterDzongkhag || filterGewog" class="text-xs text-gray-400 mt-1">Try adjusting your filters or search.</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- All Modals are here -->
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="isPreceptorModalOpen" class="fixed inset-0 z-[60] bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closePreceptorModal">
          <ClinicalPreceptorModal :application-id="selectedApplicationForPreceptor?.id" @close="closePreceptorModal" @submit-success="handlePreceptorSubmitSuccess" />
        </div>
      </transition>
    </teleport>

    <teleport to="body">
      <transition name="modal-certificate-fade">
        <div v-if="showCertificateModal" class="fixed inset-0 z-[60] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeCertificateModal">
          <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div class="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold">Teaching Hospital Certificate</h3>
              <button @click="closeCertificateModal" class="p-2 rounded-full hover:bg-gray-200">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div class="overflow-y-auto flex-1">
              <TeachingCenterCertificate v-if="selectedCertificateData" ref="certificateComponentRef" :center-data="selectedCertificateData" />
            </div>
            <div class="p-4 bg-gray-100 border-t border-gray-200 flex justify-end space-x-4">
              <button @click="closeCertificateModal" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Close</button>
              <button @click="downloadCertificate" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Download as PDF</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Other modals remain unchanged -->
    <TeachingCenterApplication :is-open="isApplicationFormModalOpen" :draft-data="selectedApplication" @close="closeApplicationFormModal" @form-submitted="handleApplicationFormSubmitted" @draft-saved="handleDraftSaved" />
    <PaymentModal ref="teachingCenterPaymentModalRef" :amount="teaching_hospital_registration" @payment-completed="handleTeachingCenterPaymentCompleted" @close="closeTeachingCenterPaymentModal" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { MagnifyingGlassIcon, ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/outline'
import apiServices from '@/services/services'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import ClinicalPreceptorModal from './modals/ClinicalPreceptorModal.vue'
import TeachingCenterApplication from './TeachingCenterApplicationModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import TeachingCenterCertificate from './TeachingCenterCertificate.vue'

// All state variables...
const toast = useToast()
const authStore = useAuthStore()
const applications = ref([])
const searchQuery = ref('')
const filterDzongkhag = ref('')
const filterGewog = ref('')
const isPreceptorModalOpen = ref(false)
const selectedApplicationForPreceptor = ref(null)
const showCertificateModal = ref(false)
const selectedCertificateData = ref(null)
const certificateComponentRef = ref(null)
const isDetailsModalOpen = ref(false)
const selectedApplication = ref(null)
const isLoading = ref(false)
const isPaymentProcessing = ref(false)
const isApplicationFormModalOpen = ref(false)
const teaching_hospital_registration = 100
const teachingCenterPaymentModalRef = ref(null)
const selectedApplicationForPayment = ref(null)
const savedDraft = ref(null)

// All computed properties and watchers...
const dzongkhagOptionsForCenter = computed(() =>
  bhutanDzongkhagsGewogs.map((d) => ({ value: d.dzongkhag, label: d.dzongkhag })),
)
const gewogOptionsForCenter = computed(() => {
  if (!filterDzongkhag.value) return []
  const selected = bhutanDzongkhagsGewogs.find((d) => d.dzongkhag === filterDzongkhag.value)
  return selected ? selected.gewogs.map((g) => ({ value: g, label: g })) : []
})
watch(() => filterDzongkhag.value, () => { filterGewog.value = '' })

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) return []
  return applications.value.filter((app) => {
    const appDzongkhag = app.state_dzongkhag || ''
    const appGewog = app.city_gewog || ''
    const matchesSearch =
      app.center_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.center_location?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      appDzongkhag.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      appGewog.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.preceptorName?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDzongkhag = filterDzongkhag.value ? appDzongkhag === filterDzongkhag.value : true
    const matchesGewog = filterGewog.value ? appGewog === filterGewog.value : true
    return matchesSearch && matchesDzongkhag && matchesGewog
  })
})

// All formatting and class functions...
const statusClass = (status) => {
  const s = status ? status.toLowerCase() : 'unknown'
  if (s === 'approved') return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'pending') return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  if (s === 'regretted' || s === 'rejected') return 'bg-red-100 text-red-700 border border-red-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}
const paymentStatusClass = (status) => {
  const s = status ? status.toLowerCase().replace(/_/g, ' ') : 'not paid'
  if (s === 'paid' || s === 'completed' || s === 'success') return 'bg-green-100 text-green-700 border border-green-200'
  if (s === 'pending payment' || s === 'processing payment' || s === 'awaiting payment') return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  if (s === 'failed') return 'bg-red-100 text-red-700 border border-red-200'
  if (s === 'not paid') return 'bg-orange-100 text-orange-700 border border-orange-200'
  return 'bg-gray-100 text-gray-700 border border-gray-200'
}
const formatPaymentStatus = (status) => {
  if (!status) return 'Not Paid'
  return status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
}

const fetchPreceptorDetails = async (teachingCenterId) => {
  if (!teachingCenterId) return null
  try {
    const params = { teaching_center: teachingCenterId }
    const response = await apiServices.getMhpcClinicalPreceptors(params)
    const preceptors = response.data?.results || []
    if (preceptors.length > 0) {
      return { name: preceptors[0].name, id: preceptors[0].id }
    }
    return null
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      console.error(`Error fetching preceptor details for TC ${teachingCenterId}:`, error)
    }
    return null
  }
}

const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) return
  isLoading.value = true
  try {
    const response = await apiServices.getMhpcTeachingCenterByCid(authStore.user.cid)
    let fetchedApplications = response.data?.results || []

    if (Array.isArray(fetchedApplications)) {
      applications.value = await Promise.all(
        fetchedApplications.map(async (app) => {
          const preceptorInfo = await fetchPreceptorDetails(app.id)
          return {
            ...app,
            tc_review_decision: app.tc_review_decision || 'Pending',
            payment_status: app.payment_status || 'not_paid',
            isPreceptorAdded: !!preceptorInfo,
            preceptorName: preceptorInfo ? preceptorInfo.name : null,
            preceptorId: preceptorInfo ? preceptorInfo.id : null,
          }
        })
      )
    } else {
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
    toast.error('Failed to load applications.')
  } finally {
    isLoading.value = false
  }
}

// All condition-checking functions (can... functions)
const canMakePayment = (application) => {
  const decision = application.tc_review_decision?.toLowerCase()
  const status = application.payment_status ? application.payment_status.toLowerCase().replace(/ /g, '_') : 'not_paid'
  return decision === 'approved' && ['not_paid', 'failed', 'pending_payment', 'awaiting_payment'].includes(status)
}

const canAddPreceptor = (application) => {
  const status = application.payment_status ? application.payment_status.toLowerCase() : ''
  return application.tc_review_decision?.toLowerCase() === 'approved' && ['paid', 'completed', 'success'].includes(status)
}

const canRemovePreceptor = (application) => {
  return application.isPreceptorAdded
}

// *** THIS IS THE CORRECTED LOGIC ***
// Certificate visibility is independent of the preceptor.
const canDownloadCertificate = (application) => {
  const status = application.payment_status ? application.payment_status.toLowerCase() : ''
  return (
    application.tc_review_decision?.toLowerCase() === 'approved' &&
    ['paid', 'completed', 'success'].includes(status)
    // The check for `application.isPreceptorAdded` has been removed.
  )
}

// All event handler functions (handle... and open/close modal functions)
const openCertificateModal = (application) => {
  selectedCertificateData.value = {
    id: application.id,
    center_name: application.center_name,
    valid_since: application.physical_verification_date || application.valid_since || new Date().toISOString(),
    valid_till: application.valid_till,
    institute_name: application.institute_details?.name_of_institution || 'N/A',
    location: `${application.center_location || ''}, ${application.city_gewog || ''}, ${application.state_dzongkhag || ''}`.replace(/, $/, '').replace(/^, /, ''),
    issue_date: application.physical_verification_date || new Date().toISOString(),
  }
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedCertificateData.value = null
}

const downloadCertificate = () => {
  if (certificateComponentRef.value) {
    certificateComponentRef.value.exportToPDF()
  } else {
    toast.error('Could not generate PDF. Certificate component not ready.')
  }
}

const openAddPreceptorModal = (application) => {
  selectedApplicationForPreceptor.value = application
  isPreceptorModalOpen.value = true
}

const handlePreceptorSubmitSuccess = async () => {
  toast.success('Clinical Preceptor added successfully. Refreshing list...')
  closePreceptorModal()
  await fetchApplications()
}
// ... other handlers like removePreceptor, viewDetails, etc. are unchanged ...
const closePreceptorModal = () => { isPreceptorModalOpen.value = false; selectedApplicationForPreceptor.value = null; };
const confirmRemovePreceptor = (application) => { if (confirm(`Are you sure you want to remove the preceptor "${application.preceptorName}" for ${application.center_name}?`)) { removePreceptor(application) } };
const removePreceptor = async (application) => { if (!application.preceptorId) { toast.error('Preceptor ID not found.'); return; } isLoading.value = true; try { await apiServices.deleteMhpcClinicalPreceptor(application.preceptorId); toast.success('Preceptor removed successfully.'); await fetchApplications(); } catch (error) { toast.error('Failed to remove preceptor.'); } finally { isLoading.value = false; } };
const viewDetails = (application) => { selectedApplication.value = application; isDetailsModalOpen.value = true; };
const closeDetailsModal = () => { isDetailsModalOpen.value = false; selectedApplication.value = null; };
const closeApplicationFormModal = () => { isApplicationFormModalOpen.value = false; };
const handleApplicationFormSubmitted = () => { closeApplicationFormModal(); fetchApplications(); toast.success('Application submitted successfully!'); };
const initiateTeachingCenterPayment = (application) => { selectedApplicationForPayment.value = application; if (teachingCenterPaymentModalRef.value) { teachingCenterPaymentModalRef.value.openModal(); } };
const closeTeachingCenterPaymentModal = () => { if (!isPaymentProcessing.value) { selectedApplicationForPayment.value = null; } };
const handleTeachingCenterPaymentCompleted = async (paymentData) => { /* ... unchanged payment logic ... */ };

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.application-tracking {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(245, 248, 252, 0.8));
}

table th {
  @apply text-gray-500 font-medium;
}

select:focus,
input[type='text']:focus {
  box-shadow: 0 0 0 2px theme('colors.indigo.300');
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-details-fade-enter-active,
.modal-details-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-details-fade-enter-from,
.modal-details-fade-leave-to {
  opacity: 0;
}

.modal-details-fade-enter-active .bg-white,
.modal-details-fade-leave-active .bg-white {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.modal-details-fade-enter-from .bg-white,
.modal-details-fade-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* NEW: Certificate Modal Transition */
.modal-certificate-fade-enter-active,
.modal-certificate-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.modal-certificate-fade-enter-from,
.modal-certificate-fade-leave-to {
  opacity: 0;
}

.modal-certificate-fade-enter-active .bg-white,
.modal-certificate-fade-leave-active .bg-white {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.modal-certificate-fade-enter-from .bg-white,
.modal-certificate-fade-leave-to .bg-white {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>