<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <h1 class="text-2xl font-bold mb-6">Dealing Officer Dashboard</h1>

    <!-- Tabs for EOI, DPR, and CAPA -->
    <div class="flex space-x-4 mb-6">
      <button
        @click="activeTab = 'eoi'"
        :class="{
          'bg-blue-500 text-white': activeTab === 'eoi',
          'bg-white text-gray-700': activeTab !== 'eoi',
        }"
        class="px-4 py-2 rounded-md"
      >
        EOI Applications
      </button>
      <button
        @click="activeTab = 'dpr'"
        :class="{
          'bg-blue-500 text-white': activeTab === 'dpr',
          'bg-white text-gray-700': activeTab !== 'dpr',
        }"
        class="px-4 py-2 rounded-md"
      >
        DPR Applications
      </button>
      <button
        @click="activeTab = 'capa'"
        :class="{
          'bg-blue-500 text-white': activeTab === 'capa',
          'bg-white text-gray-700': activeTab !== 'capa',
        }"
        class="px-4 py-2 rounded-md"
      >
        CAPA Management
      </button>
    </div>

    <!-- EOI Applications -->
    <div v-if="activeTab === 'eoi'" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">EOI Applications</h2>
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Applicant Name</th>
            <th class="p-2">Institute Name</th>
            <th class="p-2">Status</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(eoi, index) in eoiApplications" :key="index" class="border-b">
            <td class="p-2">{{ eoi.applicantName }}</td>
            <td class="p-2">{{ eoi.instituteName }}</td>
            <td class="p-2">
              <span :class="statusClass(eoi.status)">{{ eoi.status }}</span>
            </td>
            <td class="p-2 flex space-x-2">
              <button
                @click="viewEOIDetails(eoi)"
                class="bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                View
              </button>
              <button
                @click="approveApplication(eoi, 'eoi')"
                class="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Approve
              </button>
              <button
                @click="openRejectModal(eoi, 'eoi')"
                class="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DPR Applications -->
    <div v-if="activeTab === 'dpr'" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">DPR Applications</h2>
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Institute Name</th>
            <th class="p-2">Head of Institute</th>
            <th class="p-2">Status</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dpr, index) in dprApplications" :key="index" class="border-b">
            <td class="p-2">{{ dpr.instituteName }}</td>
            <td class="p-2">{{ dpr.headOfInstitute }}</td>
            <td class="p-2">
              <span :class="statusClass(dpr.status)">{{ dpr.status }}</span>
            </td>
            <td class="p-2 flex space-x-2">
              <button
                @click="viewDPRDetails(dpr)"
                class="bg-blue-500 text-white px-3 py-1 rounded-md"
              >
                View
              </button>
              <button
                @click="approveApplication(dpr, 'dpr')"
                class="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Approve
              </button>
              <button
                @click="openRejectModal(dpr, 'dpr')"
                class="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CAPA Management -->
    <div v-if="activeTab === 'capa'" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">CAPA Management</h2>

      <!-- CAPA Issues Table -->
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Institute Name</th>
            <th class="p-2">Issue Description</th>
            <th class="p-2">Status</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(capa, index) in capaIssues" :key="index" class="border-b">
            <td class="p-2">{{ capa.instituteName }}</td>
            <td class="p-2">{{ capa.issueDescription }}</td>
            <td class="p-2">
              <span :class="statusClass(capa.status)">{{ capa.status }}</span>
            </td>
            <td class="p-2">
              <button
                @click="openCAPAModal(capa)"
                class="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Resolve
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Resolved CAPA Issues Report -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-4">Resolved CAPA Issues</h3>
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-200">
              <th class="p-2">Institute Name</th>
              <th class="p-2">Issue Description</th>
              <th class="p-2">Resolved Remarks</th>
              <th class="p-2">Resolved Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(capa, index) in resolvedCAPAIssues" :key="index" class="border-b">
              <td class="p-2">{{ capa.instituteName }}</td>
              <td class="p-2">{{ capa.issueDescription }}</td>
              <td class="p-2">{{ capa.resolveRemarks }}</td>
              <td class="p-2">{{ capa.resolvedDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-1/3">
        <h2 class="text-xl font-semibold mb-4">Reject Application</h2>
        <textarea
          v-model="rejectionMessage"
          placeholder="Enter reason for rejection"
          class="w-full p-2 border rounded-md mb-4"
        ></textarea>
        <div class="flex justify-end space-x-4">
          <button
            @click="rejectApplication"
            class="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Confirm Reject
          </button>
          <button
            @click="closeRejectModal"
            class="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- CAPA Resolve Modal -->
    <div v-if="showCAPAModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-1/3">
        <h2 class="text-xl font-semibold mb-4">Resolve CAPA Issue</h2>
        <p class="mb-4"><strong>Institute Name:</strong> {{ selectedCAPA.instituteName }}</p>
        <p class="mb-4"><strong>Issue Description:</strong> {{ selectedCAPA.issueDescription }}</p>
        <textarea
          v-model="resolveRemarks"
          placeholder="Enter remarks for resolution"
          class="w-full p-2 border rounded-md mb-4"
        ></textarea>
        <div class="flex justify-end space-x-4">
          <button
            @click="resolveCAPA"
            class="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Resolve
          </button>
          <button
            @click="closeCAPAModal"
            class="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state
const activeTab = ref('eoi') // Default to EOI tab

const eoiApplications = ref([
  {
    id: 1,
    applicantName: 'John Doe',
    instituteName: 'ABC Institute',
    status: 'Pending',
  },
  {
    id: 2,
    applicantName: 'Jane Smith',
    instituteName: 'XYZ Institute',
    status: 'Approved',
  },
])

const dprApplications = ref([
  {
    id: 1,
    instituteName: 'ABC Institute',
    headOfInstitute: 'John Doe',
    status: 'Pending',
  },
  {
    id: 2,
    instituteName: 'XYZ Institute',
    headOfInstitute: 'Jane Smith',
    status: 'Rejected',
  },
])

const capaIssues = ref([
  {
    id: 1,
    instituteName: 'ABC Institute',
    issueDescription: 'Incomplete documentation for accreditation',
    status: 'Pending',
  },
  {
    id: 2,
    instituteName: 'XYZ Institute',
    issueDescription: 'Laboratory equipment not up to standard',
    status: 'Pending',
  },
])

const resolvedCAPAIssues = ref([
  {
    id: 3,
    instituteName: 'DEF Institute',
    issueDescription: 'Delayed submission of annual reports',
    status: 'Resolved',
    resolveRemarks: 'Reports submitted and verified by the board.',
    resolvedDate: '2023-10-01',
  },
])

const showRejectModal = ref(false)
const showCAPAModal = ref(false)
const rejectionMessage = ref('')
const resolveRemarks = ref('')
const selectedApplication = ref(null)
const selectedType = ref(null) // 'eoi' or 'dpr'
const selectedCAPA = ref(null)

// Methods
const statusClass = (status) => {
  return {
    'text-green-500': status === 'Approved' || status === 'Resolved',
    'text-red-500': status === 'Rejected',
    'text-yellow-500': status === 'Pending',
  }
}

const viewEOIDetails = (eoi) => {
  alert(`Viewing EOI Details for: ${eoi.instituteName}`)
}

const viewDPRDetails = (dpr) => {
  alert(`Viewing DPR Details for: ${dpr.instituteName}`)
}

const approveApplication = (application, type) => {
  if (type === 'eoi') {
    const eoi = eoiApplications.value.find((eoi) => eoi.id === application.id)
    if (eoi) eoi.status = 'Approved'
  } else if (type === 'dpr') {
    const dpr = dprApplications.value.find((dpr) => dpr.id === application.id)
    if (dpr) dpr.status = 'Approved'
  }
  alert('Application approved successfully!')
}

const openRejectModal = (application, type) => {
  selectedApplication.value = application
  selectedType.value = type
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectionMessage.value = ''
  selectedApplication.value = null
  selectedType.value = null
}

const rejectApplication = () => {
  if (selectedType.value === 'eoi') {
    const eoi = eoiApplications.value.find((eoi) => eoi.id === selectedApplication.value.id)
    if (eoi) eoi.status = 'Rejected'
  } else if (selectedType.value === 'dpr') {
    const dpr = dprApplications.value.find((dpr) => dpr.id === selectedApplication.value.id)
    if (dpr) dpr.status = 'Rejected'
  }
  alert(`Rejection Reason: ${rejectionMessage.value}`)
  closeRejectModal()
}

const openCAPAModal = (capa) => {
  selectedCAPA.value = capa
  showCAPAModal.value = true
}

const closeCAPAModal = () => {
  showCAPAModal.value = false
  selectedCAPA.value = null
  resolveRemarks.value = ''
}

const resolveCAPA = () => {
  if (resolveRemarks.value.trim() === '') {
    alert('Please enter remarks for resolution.')
    return
  }

  // Update the selected CAPA issue
  selectedCAPA.value.status = 'Resolved'
  selectedCAPA.value.resolveRemarks = resolveRemarks.value
  selectedCAPA.value.resolvedDate = new Date().toLocaleDateString()

  // Move the resolved issue to the resolvedCAPAIssues array
  resolvedCAPAIssues.value.push({ ...selectedCAPA.value })

  // Remove the resolved issue from the capaIssues array
  capaIssues.value = capaIssues.value.filter((capa) => capa.id !== selectedCAPA.value.id)

  // Close the modal
  closeCAPAModal()
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>