<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-6">
    <!-- Header Section -->
    <div class="mb-6 space-y-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">BMHC Capa Management</h1>

        <div class="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <!-- Search Box -->
          <div class="relative">
            <input
              v-model.trim="searchQuery"
              type="text"
              placeholder="Search institutes..."
              class="pl-10 pr-4 py-2.5 w-full md:w-64 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <span class="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon class="w-5 h-5" />
            </span>
          </div>

          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="py-2.5 px-4 text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="R">Resolved</option>
            <option value="P">Pending</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <Loader2Icon class="w-10 h-10 animate-spin text-blue-500" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <CircleAlert class="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gray-50">
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Institute Name
            </th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              CAPAs
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="institute in displayedInstitutes" :key="institute.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ institute.name_of_institution }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="openAddCapaModal(institute.id)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <PlusIcon class="w-4 h-4 mr-1.5" />
                Add CAPA
              </button>
            </td>
            <td class="px-6 py-4">
              <!-- Display CAPAs for this institute -->
              <div v-if="instituteCapas[institute.id] && instituteCapas[institute.id].length" class="space-y-3">
                <div v-for="capa in instituteCapas[institute.id]" :key="capa.id"
                  class="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div class="flex items-center justify-between p-3 border-b bg-gray-50">
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-medium text-gray-700">CAPA #{{ capa.id }}</span>
                      <span
                        :class="[
                          getStatusClass(capa.status),
                          'px-2.5 py-0.5 rounded-full text-xs font-medium'
                        ]"
                      >
                        {{ getStatusText(capa.status) }}
                      </span>
                    </div>
                    <button
                      @click="deleteCapa(capa.id)"
                      class="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                      title="Delete CAPA"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                  <div class="p-3 bg-white">
                    <details class="text-sm">
                      <summary class="cursor-pointer py-1 font-medium text-blue-600 hover:text-blue-800">
                        View Details
                      </summary>
                      <div class="mt-3 space-y-2 text-gray-700">
                        <p><span class="font-medium text-gray-800">Observation:</span> {{ capa.observation_description }}</p>
                        <p><span class="font-medium text-gray-800">Root Cause:</span> {{ capa.root_cause }}</p>
                        <p><span class="font-medium text-gray-800">CAPA:</span> {{ capa.capa }}</p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 italic">
                No CAPAs for this institute.
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!displayedInstitutes.length && !isLoading" class="text-center py-16 px-4">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <InboxIcon class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900">No Institutes Found</h3>
        <p class="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          No institutes match your current search criteria. Try adjusting your filters or search terms.
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-between items-center py-4 px-6 border-t border-gray-200 bg-gray-50">
        <div class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeftIcon class="w-4 h-4 mr-1" />
            Prev
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next
            <ChevronRightIcon class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Modal for Add/Edit CAPA -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showCapaModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" @click="closeCapaModal"></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <!-- Modal header -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">
                Add CAPA for Institute #{{ selectedInstituteId }}
              </h3>
              <button @click="closeCapaModal" class="rounded-full p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                <XIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Modal body -->
            <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
              <form @submit.prevent="saveCapa" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Inspection Dates -->
                <div>
                  <label for="inspection_from_date" class="block text-sm font-medium text-gray-700">
                    Inspection From Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="inspection_from_date"
                    v-model="capaForm.inspection_from_date"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label for="inspection_to_date" class="block text-sm font-medium text-gray-700">
                    Inspection To Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="inspection_to_date"
                    v-model="capaForm.inspection_to_date"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <!-- Observation Description -->
                <div class="md:col-span-2">
                  <label for="observation_description" class="block text-sm font-medium text-gray-700">
                    Observation Description <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="observation_description"
                    v-model="capaForm.observation_description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  ></textarea>
                </div>

                <!-- Root Cause -->
                <div class="md:col-span-2">
                  <label for="root_cause" class="block text-sm font-medium text-gray-700">
                    Root Cause <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="root_cause"
                    v-model="capaForm.root_cause"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  ></textarea>
                </div>

                <!-- CAPA -->
                <div class="md:col-span-2">
                  <label for="capa" class="block text-sm font-medium text-gray-700">
                    CAPA <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="capa"
                    v-model="capaForm.capa"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  ></textarea>
                </div>

                <!-- Implementation Timeline -->
                <div>
                  <label for="implementation_timeline" class="block text-sm font-medium text-gray-700">
                    Implementation Timeline <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="implementation_timeline"
                    v-model="capaForm.implementation_timeline"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <!-- Status -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    v-model="capaForm.status"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="R">Resolved</option>
                    <option value="P">Pending</option>
                  </select>
                </div>

                <!-- Management Comment -->
                <div class="md:col-span-2">
                  <label for="management_comment" class="block text-sm font-medium text-gray-700">
                    Management Comment
                  </label>
                  <textarea
                    id="management_comment"
                    v-model="capaForm.management_comment"
                    rows="2"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <!-- DO Remarks -->
                <div>
                  <label for="DO_remarks" class="block text-sm font-medium text-gray-700">
                    DO Remarks
                  </label>
                  <textarea
                    id="DO_remarks"
                    v-model="capaForm.DO_remarks"
                    rows="2"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <!-- User Remarks -->
                <div>
                  <label for="user_remarks" class="block text-sm font-medium text-gray-700">
                    User Remarks
                  </label>
                  <textarea
                    id="user_remarks"
                    v-model="capaForm.user_remarks"
                    rows="2"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </form>
            </div>

            <!-- Modal footer -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                @click="saveCapa"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save CAPA
              </button>
              <button
                type="button"
                @click="closeCapaModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Loader2Icon,
  SearchIcon,
  CircleAlert,
  InboxIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-vue-next'
import services from '@/services/services'

// State
const institutes = ref([])
const capas = ref([])
const instituteCapas = ref({})
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showCapaModal = ref(false)
const selectedInstituteId = ref(null)

// Form
const capaForm = ref({
  inspection_from_date: '',
  inspection_to_date: '',
  observation_description: '',
  root_cause: '',
  capa: '',
  implementation_timeline: '',
  management_comment: '',
  DO_remarks: '',
  user_remarks: '',
  status: 'P',
})

// Computed Properties
const filteredInstitutes = computed(() => {
  let filtered = institutes.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(institute =>
      institute.name_of_institution.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalPages = computed(() =>
  Math.ceil(filteredInstitutes.value.length / itemsPerPage.value)
)

const displayedInstitutes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInstitutes.value.slice(start, end)
})

// Helper Functions
const getStatusClass = (status) => {
  const classes = {
    P: 'bg-yellow-100 text-yellow-800',
    R: 'bg-green-100 text-green-800',
    A: 'bg-blue-100 text-blue-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    P: 'Pending',
    R: 'Resolved',
    A: 'Approved',
  }
  return statusTexts[status] || 'Unknown'
}

// API Functions
const fetchInstitutes = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await services.getBmhcInstitutes()
    institutes.value = response.data.results
  } catch (err) {
    error.value = 'Failed to load institutes. Please try again later.'
    console.error('Error fetching institutes:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchCapas = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await services.getBmhcCapas()
    capas.value = response.data.results
    processCapas()
  } catch (err) {
    error.value = 'Failed to load CAPAs. Please try again later.'
    console.error('Error fetching CAPAs:', err)
  } finally {
    isLoading.value = false
  }
}

const processCapas = () => {
  instituteCapas.value = {}

  const filteredCapas = statusFilter.value
    ? capas.value.filter(capa => capa.status === statusFilter.value)
    : capas.value

  filteredCapas.forEach(capa => {
    if (!instituteCapas.value[capa.institute]) {
      instituteCapas.value[capa.institute] = []
    }
    instituteCapas.value[capa.institute].push(capa)
  })
}

// Modal Functions
const openAddCapaModal = (instituteId) => {
  selectedInstituteId.value = instituteId
  resetCapaForm()
  showCapaModal.value = true
}

const closeCapaModal = () => {
  showCapaModal.value = false
  selectedInstituteId.value = null
}

const resetCapaForm = () => {
  capaForm.value = {
    inspection_from_date: '',
    inspection_to_date: '',
    observation_description: '',
    root_cause: '',
    capa: '',
    implementation_timeline: '',
    management_comment: '',
    DO_remarks: '',
    user_remarks: '',
    status: 'P',
  }
}

// CRUD Operations
const saveCapa = async () => {
  try {
    await services.createBmhcCapa({
      ...capaForm.value,
      institute: selectedInstituteId.value,
    })

    await fetchCapas()
    closeCapaModal()
  } catch (err) {
    console.error('Error saving CAPA:', err)
    error.value = 'Failed to save CAPA. Please try again.'
  }
}

const deleteCapa = async (id) => {
  if (confirm('Are you sure you want to delete this CAPA?')) {
    try {
      await services.deleteBmhcCapa(id)
      await fetchCapas()
    } catch (err) {
      console.error('Error deleting CAPA:', err)
      error.value = 'Failed to delete CAPA. Please try again.'
    }
  }
}

// Watchers
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
  processCapas()
})

// Lifecycle Hooks
onMounted(() => {
  fetchInstitutes()
  fetchCapas()
})
</script>

<style scoped>
/* Modal Transition Styles */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(-20px)
}
</style>
