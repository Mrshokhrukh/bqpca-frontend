// ApplicationDashboard.vue
<script setup>
import { ref, computed } from 'vue'
import Modal from '../modals/Modal.vue'

// State management
const filters = ref({
  type: '',
  search: '',
})

const applications = ref([
  {
    id: 1001,
    name: 'John Doe',
    type: 'registration',
    date: '2023-10-01',
    status: 'pending',
    documents: [
      { name: 'CID Copy' },
      { name: 'Graduation Certificate' },
      { name: 'Security Clearance' },
    ],
    remarks: '',
    reviewStatus: 'approve',
  },
  {
    id: 1002,
    name: 'Jane Smith',
    type: 'renewal',
    date: '2023-10-02',
    status: 'pending',
    documents: [{ name: 'CID Copy' }, { name: 'Graduation Certificate' }],
    remarks: '',
    reviewStatus: 'approve',
  },
])

// Modal states
const showActionModal = ref(false)
const showDocumentModal = ref(false)
const showCertificateModal = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const selectedDocument = ref(null)
const selectedApplication = ref(null)

// Computed
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesType = !filters.value.type || app.type === filters.value.type
    const matchesSearch =
      !filters.value.search ||
      app.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      app.id.toString().includes(filters.value.search)
    return matchesType && matchesSearch
  })
})

// Methods
const viewDocument = (doc, app) => {
  selectedDocument.value = doc
  selectedApplication.value = app
  modalTitle.value = 'View Document'
  modalMessage.value = `Viewing ${doc.name} for ${app.name}`
  showDocumentModal.value = true
}

const endorseApplication = (app) => {
  app.status = app.reviewStatus === 'approve' ? 'approved' : 'rejected'
  modalTitle.value = `Application ${app.reviewStatus === 'approve' ? 'Approved' : 'Rejected'}`
  modalMessage.value = `Application ${app.id} has been ${app.status}`
  showActionModal.value = true
}

const generateCertificate = (app) => {
  selectedApplication.value = app
  modalTitle.value = 'Generate Certificate'
  modalMessage.value = `Certificate generated successfully for ${app.name}`
  showCertificateModal.value = true
}

const getStatusClass = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'pending',
    'bg-green-100 text-green-800': status === 'approved',
    'bg-red-100 text-red-800': status === 'rejected',
  }
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Filters and Search -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <select
        v-model="filters.type"
        class="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Types</option>
        <option value="registration">Registration</option>
        <option value="renewal">Renewal</option>
        <option value="cogs">CoGS</option>
      </select>
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search by name or CID"
        class="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
      />
    </div>

    <!-- Applications Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="w-full table-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Type</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Documents</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
            <th class="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="app in filteredApplications"
            :key="app.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="p-3 text-sm text-gray-700">{{ app.id }}</td>
            <td class="p-3 text-sm text-gray-700">{{ app.name }}</td>
            <td class="p-3 text-sm text-gray-700">
              <span class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                {{ app.type }}
              </span>
            </td>
            <td class="p-3 text-sm text-gray-700">{{ app.date }}</td>
            <td class="p-3 text-sm text-gray-700">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(app.status)"
              >
                {{ app.status }}
              </span>
            </td>
            <td class="p-3 text-sm text-gray-700">
              <ul class="space-y-1">
                <li v-for="doc in app.documents" :key="doc.name">
                  <button
                    @click="viewDocument(doc, app)"
                    class="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {{ doc.name }}
                  </button>
                </li>
              </ul>
            </td>
            <td class="p-3 text-sm text-gray-700">
              <textarea
                v-model="app.remarks"
                placeholder="Enter remarks"
                class="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </td>
            <td class="p-3 text-sm text-gray-700">
              <div class="flex items-center gap-2">
                <select
                  v-model="app.reviewStatus"
                  class="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Regret</option>
                </select>
                <button
                  @click="endorseApplication(app)"
                  class="px-3 py-1.5 rounded-lg transition-colors"
                  :class="
                    app.reviewStatus === 'approve'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  "
                >
                  Endorse
                </button>
                <button
                  @click="generateCertificate(app)"
                  class="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Certificate
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <Modal
      v-if="showActionModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showActionModal = false"
    />

    <Modal
      v-if="showDocumentModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showDocumentModal = false"
    />

    <Modal
      v-if="showCertificateModal"
      :title="modalTitle"
      :message="modalMessage"
      @close="showCertificateModal = false"
    />
  </div>
</template>
