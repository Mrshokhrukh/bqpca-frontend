<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Staff Management"
      subtitle="Manage institute staff details and records for your institute."
      :show-actions="false"
    />

    <Transition name="notification-slide">
      <div
        v-if="notification.show"
        class="fixed top-20 right-4 sm:right-6 lg:right-8 p-4 rounded-xl shadow-lg flex items-start z-[100] max-w-sm w-full"
        :class="{
          'bg-green-50 border-green-300': notification.type === 'success',
          'bg-red-50 border-red-300': notification.type === 'error',
          'bg-sky-50 border-sky-300': notification.type === 'info',
          'bg-yellow-50 border-yellow-300': notification.type === 'warning',
        }"
      >
        <div class="flex-shrink-0">
          <CheckCircleIcon
            v-if="notification.type === 'success'"
            class="h-6 w-6 text-green-500"
            aria-hidden="true"
          />
          <XCircleIcon
            v-else-if="notification.type === 'error'"
            class="h-6 w-6 text-red-500"
            aria-hidden="true"
          />
          <InformationCircleIcon
            v-else-if="notification.type === 'info'"
            class="h-6 w-6 text-sky-500"
            aria-hidden="true"
          />
          <ExclamationTriangleIcon
            v-else-if="notification.type === 'warning'"
            class="h-6 w-6 text-yellow-500"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p
            class="text-sm font-semibold"
            :class="{
              'text-green-800': notification.type === 'success',
              'text-red-800': notification.type === 'error',
              'text-sky-800': notification.type === 'info',
              'text-yellow-800': notification.type === 'warning',
            }"
          >
            {{ notification.title }}
          </p>
          <p
            class="mt-1 text-sm"
            :class="{
              'text-green-700': notification.type === 'success',
              'text-red-700': notification.type === 'error',
              'text-sky-700': notification.type === 'info',
              'text-yellow-700': notification.type === 'warning',
            }"
          >
            {{ notification.message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="closeNotification"
            class="inline-flex rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-1"
            :class="{
              'text-green-600 hover:bg-green-100 focus:ring-green-500 focus:ring-offset-green-50':
                notification.type === 'success',
              'text-red-600 hover:bg-red-100 focus:ring-red-500 focus:ring-offset-red-50':
                notification.type === 'error',
              'text-sky-600 hover:bg-sky-100 focus:ring-sky-500 focus:ring-offset-sky-50':
                notification.type === 'info',
              'text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-500 focus:ring-offset-yellow-50':
                notification.type === 'warning',
            }"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Transition>

    <div class="mt-8">
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div class="relative flex-grow md:max-w-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search staff by name, designation, department..."
            class="form-input pl-10"
          />
        </div>
        <button @click="openAddStaffModal" type="button" class="btn btn-primary">
          <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          Add New Staff
        </button>
      </div>

      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 py-16"
      >
        <Loader class="animate-spin text-indigo-600 w-12 h-12" />
        <p class="mt-4 text-lg font-medium text-gray-700">Loading staff data...</p>
      </div>

      <div
        v-else-if="!isLoading && filteredStaff.length === 0 && !searchQuery"
        class="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <UsersIcon class="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
        <h3 class="mt-4 text-xl font-semibold text-gray-800">No Staff Members Found</h3>
        <p class="mt-2 text-sm text-gray-500">
          Get started by adding your first staff member to the institute.
        </p>
        <div class="mt-6">
          <button @click="openAddStaffModal" type="button" class="btn btn-primary">
            <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            Add Staff Member
          </button>
        </div>
      </div>

      <div
        v-else-if="!isLoading && filteredStaff.length === 0 && searchQuery"
        class="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <DocumentMagnifyingGlassIcon class="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
        <h3 class="mt-4 text-xl font-semibold text-gray-800">No Matching Results</h3>
        <p class="mt-2 text-sm text-gray-500">
          No staff members found for "<span class="font-medium">{{ searchQuery }}</span
          >". Try a different search term.
        </p>
        <div class="mt-6">
          <button @click="searchQuery = ''" type="button" class="btn btn-outline">
            Clear Search
          </button>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th @click="sortBy('staff_name')" scope="col" class="table-header-cell">
                  Name
                  <SortIndicator
                    :column="'staff_name'"
                    :current-column="sortColumn"
                    :direction="sortDirection"
                  />
                </th>
                <th @click="sortBy('designation')" scope="col" class="table-header-cell">
                  Designation
                  <SortIndicator
                    :column="'designation'"
                    :current-column="sortColumn"
                    :direction="sortDirection"
                  />
                </th>
                <th @click="sortBy('date_of_joining')" scope="col" class="table-header-cell">
                  Date of Joining
                  <SortIndicator
                    :column="'date_of_joining'"
                    :current-column="sortColumn"
                    :direction="sortDirection"
                  />
                </th>
                <th @click="sortBy('department')" scope="col" class="table-header-cell">
                  Department
                  <SortIndicator
                    :column="'department'"
                    :current-column="sortColumn"
                    :direction="sortDirection"
                  />
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="staff in filteredStaff"
                :key="staff.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ staff.staff_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span
                    :class="[
                      getDesignationPillClass(staff.designation),
                      'px-2.5 py-1 text-xs font-semibold rounded-full leading-tight',
                    ]"
                  >
                    {{ staff.designation }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ formatDate(staff.date_of_joining) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ getDepartmentName(staff.department) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center items-center space-x-3">
                    <button
                      @click="openViewStaffModal(staff)"
                      class="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="openEditStaffModal(staff)"
                      class="text-gray-400 hover:text-sky-600 transition-colors"
                      title="Edit Staff"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="confirmDelete(staff)"
                      class="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Staff"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="totalStaff > 0"
          class="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="fetchPreviousPage"
              :disabled="!hasPreviousPage"
              class="btn btn-outline text-sm"
            >
              Previous
            </button>
            <button @click="fetchNextPage" :disabled="!hasNextPage" class="btn btn-outline text-sm">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ totalStaff }}</span> results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="fetchPreviousPage"
                  :disabled="!hasPreviousPage"
                  class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  @click="fetchNextPage"
                  :disabled="!hasNextPage"
                  class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="isModalVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="closeModal"
          aria-hidden="true"
        ></div>
        <div
          class="relative w-full max-w-xl bg-white rounded-xl shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`modal-title-${modalMode}`"
          @click.stop
        >
          <div
            class="py-5 px-6 md:px-8 bg-gray-50 rounded-t-xl border-b border-gray-200 flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="p-2 bg-indigo-100 rounded-lg mr-3">
                <UserPlusIcon
                  v-if="modalMode === 'add'"
                  class="w-6 h-6 text-indigo-600"
                  aria-hidden="true"
                />
                <PencilSquareIcon
                  v-else-if="modalMode === 'edit'"
                  class="w-6 h-6 text-indigo-600"
                  aria-hidden="true"
                />
                <EyeIcon v-else class="w-6 h-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <h2 :id="`modal-title-${modalMode}`" class="text-lg font-semibold text-gray-900">
                  {{
                    modalMode === 'add'
                      ? 'Add New Staff'
                      : modalMode === 'edit'
                        ? 'Edit Staff Details'
                        : 'View Staff Details'
                  }}
                </h2>
                <p class="text-xs text-gray-500">
                  {{
                    modalMode === 'add'
                      ? 'Fill in the details to add a new staff member.'
                      : modalMode === 'edit'
                        ? 'Update the information for this staff member.'
                        : 'Viewing staff member information.'
                  }}
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <form @submit.prevent="saveStaff" class="p-6 md:p-8">
            <div class="space-y-6">
              <div>
                <label for="staff_name" class="form-label">Staff Name</label>
                <input
                  type="text"
                  id="staff_name"
                  v-model="form.staff_name"
                  :disabled="modalMode === 'view'"
                  required
                  class="form-input"
                />
              </div>
              <div>
                <label for="designation" class="form-label">Designation</label>
                <input
                  type="text"
                  id="designation"
                  v-model="form.designation"
                  :disabled="modalMode === 'view'"
                  required
                  class="form-input"
                />
              </div>
              <div>
                <label for="date_of_joining" class="form-label">Date of Joining</label>
                <input
                  type="date"
                  id="date_of_joining"
                  v-model="form.date_of_joining"
                  :disabled="modalMode === 'view'"
                  required
                  class="form-input"
                />
              </div>
              <div>
                <label for="department" class="form-label">Department</label>
                <select
                  id="department"
                  v-model="form.department_id"
                  :disabled="modalMode === 'view'"
                  required
                  class="form-select"
                >
                  <option disabled value="">Select a department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
            </div>

            <div
              class="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0"
            >
              <button type="button" @click="closeModal" class="btn btn-outline w-full sm:w-auto">
                {{ modalMode === 'view' ? 'Close' : 'Cancel' }}
              </button>
              <button
                v-if="modalMode !== 'view'"
                type="submit"
                :disabled="isSavingStaff"
                class="btn btn-primary w-full sm:w-auto"
              >
                <Loader v-if="isSavingStaff" class="animate-spin h-5 w-5 mr-2 text-white" />
                {{
                  isSavingStaff ? 'Saving...' : modalMode === 'add' ? 'Add Staff' : 'Update Staff'
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="showDeleteModal = false"
          aria-hidden="true"
        ></div>
        <div
          class="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 m-4 transform transition-all"
          @click.stop
        >
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title-delete">
                Confirm Deletion
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete staff member
                  <span class="font-semibold text-gray-700">{{ staffToDelete?.staff_name }}</span
                  >? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div
            class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-reverse sm:space-x-3"
          >
            <button
              type="button"
              @click="deleteStaff"
              :disabled="isDeletingStaff"
              class="btn bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white w-full sm:w-auto"
            >
              <Loader v-if="isDeletingStaff" class="animate-spin h-5 w-5 mr-2 text-white" />
              {{ isDeletingStaff ? 'Deleting...' : 'Delete' }}
            </button>
            <button
              type="button"
              @click="showDeleteModal = false"
              :disabled="isDeletingStaff"
              class="btn btn-outline w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import { Loader } from 'lucide-vue-next'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  DocumentMagnifyingGlassIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'

const SortIndicator = (props) => {
  if (props.currentColumn === props.column) {
    return props.direction === 'asc' ? '↑' : '↓'
  }
  return ''
}
SortIndicator.props = ['column', 'currentColumn', 'direction']

const staffList = ref([])
const isLoading = ref(true)
const isSavingStaff = ref(false)
const isDeletingStaff = ref(false)
const searchQuery = ref('')
const sortColumn = ref('staff_name')
const sortDirection = ref('asc')
const currentPage = ref(1)
const nextPageUrl = ref(null)
const previousPageUrl = ref(null)
const totalStaff = ref(0)
const pageSize = ref(10)

const isModalVisible = ref(false)
const modalMode = ref(null)

const form = ref({
  id: null,
  staff_name: '',
  designation: '',
  date_of_joining: '',
  department_id: '',
})

const showDeleteModal = ref(false)
const staffToDelete = ref(null)
const departments = ref([])

const fetchDepartments = async () => {
  try {
    const response = await apiServices.getMhpcInstituteDepartments()
    if (response?.data) {
      const results = response.data.results || response.data
      if (Array.isArray(results)) {
        departments.value = results.map((dept) => ({
          id: dept.id,
          name: dept.department_name,
        }))
      } else {
        departments.value = []
        showNotification('warning', 'Data Format', 'Received departments in an unexpected format.')
      }
    } else {
      departments.value = []
    }
  } catch (error) {
    console.error('Error fetching departments:', error)
    showNotification(
      'error',
      'Error Loading Departments',
      'Failed to load department data. Please ensure the institute has registered departments.',
    )
    departments.value = []
  }
}

const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeoutId: null,
})

const filteredStaff = computed(() => {
  if (!searchQuery.value.trim()) return staffList.value

  const query = searchQuery.value.toLowerCase()
  return staffList.value.filter((staff) => {
    const deptName = getDepartmentName(staff.department).toLowerCase()
    return (
      staff.staff_name.toLowerCase().includes(query) ||
      staff.designation.toLowerCase().includes(query) ||
      deptName.includes(query)
    )
  })
})

const hasNextPage = computed(() => !!nextPageUrl.value)
const hasPreviousPage = computed(() => !!previousPageUrl.value)

const paginationStart = computed(() => {
  if (totalStaff.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value
})

const paginationEnd = computed(() => {
  if (totalStaff.value === 0) return 0
  return Math.min(paginationStart.value + pageSize.value, totalStaff.value)
})

const fetchStaff = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await apiServices.getMhpcInstituteStaff({ page, search: searchQuery.value })
    if (response?.data) {
      staffList.value = response.data.results || []
      totalStaff.value = response.data.count || 0
      nextPageUrl.value = response.data.next
      previousPageUrl.value = response.data.previous
      currentPage.value = page

      if (staffList.value.length > 0) {
        const params = new URLSearchParams(nextPageUrl.value || previousPageUrl.value || '')
        const limit = params.get('limit') || staffList.value.length
        pageSize.value = parseInt(limit, 10) || staffList.value.length || 10
      } else if (totalStaff.value === 0 && searchQuery.value === '') {
        // This is initial load and no staff exists, no special notification needed here.
      }
    } else {
      showNotification('error', 'Error Loading Data', 'Failed to load staff data from the server.')
      staffList.value = []
      totalStaff.value = 0
    }
  } catch (error) {
    console.error('Error fetching staff:', error)
    showNotification(
      'error',
      'Network Error',
      'Failed to connect to the server. Please check your connection.',
    )
    staffList.value = []
    totalStaff.value = 0
  } finally {
    isLoading.value = false
  }
}

const extractPageNumber = (urlValue) => {
  if (!urlValue) return null
  try {
    const url = new URL(urlValue)
    const pageParam = url.searchParams.get('page')
    return pageParam ? parseInt(pageParam) : null
  } catch (e) {
    console.error('Could not parse page URL', e)
    return null
  }
}

const fetchNextPage = () => {
  const nextPageNum = extractPageNumber(nextPageUrl.value)
  if (nextPageNum) {
    fetchStaff(nextPageNum)
  } else if (hasNextPage.value) {
    fetchStaff(currentPage.value + 1)
  }
}

const fetchPreviousPage = () => {
  const prevPageNum = extractPageNumber(previousPageUrl.value)
  if (prevPageNum) {
    fetchStaff(prevPageNum)
  } else if (hasPreviousPage.value && currentPage.value > 1) {
    fetchStaff(currentPage.value - 1)
  } else if (previousPageUrl.value !== null && currentPage.value > 1) {
    fetchStaff(1) // Fallback for APIs that might return a non-null previous URL for page 2 without `?page=1`
  }
}

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }

  staffList.value.sort((a, b) => {
    let valA = a[column]
    let valB = b[column]

    if (column === 'department') {
      valA = getDepartmentName(a.department)
      valB = getDepartmentName(b.department)
    } else if (column === 'date_of_joining') {
      valA = new Date(a.date_of_joining).getTime()
      valB = new Date(b.date_of_joining).getTime()
    }

    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
}

const getDepartmentName = (departmentId) => {
  const department = departments.value.find((d) => d.id === departmentId)
  return department ? department.name : 'N/A'
}

const getDesignationPillClass = (designation) => {
  if (!designation) return 'bg-gray-100 text-gray-800'
  const d = designation.toLowerCase()
  if (d.includes('director') || d.includes('head') || d.includes('manager'))
    return 'bg-red-100 text-red-700'
  if (d.includes('professor')) return 'bg-purple-100 text-purple-700'
  if (d.includes('lecturer') || d.includes('teacher') || d.includes('instructor'))
    return 'bg-sky-100 text-sky-700'
  if (d.includes('assistant') || d.includes('associate')) return 'bg-yellow-100 text-yellow-700'
  if (d.includes('officer') || d.includes('coordinator')) return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'Invalid Date'
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    staff_name: '',
    designation: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    department_id: '',
  }
}

const openAddStaffModal = () => {
  resetForm()
  modalMode.value = 'add'
  isModalVisible.value = true
}

const openEditStaffModal = (staff) => {
  form.value = {
    id: staff.id,
    staff_name: staff.staff_name,
    designation: staff.designation,
    date_of_joining: staff.date_of_joining,
    department_id: staff.department,
  }
  modalMode.value = 'edit'
  isModalVisible.value = true
}

const openViewStaffModal = (staff) => {
  form.value = {
    id: staff.id,
    staff_name: staff.staff_name,
    designation: staff.designation,
    date_of_joining: staff.date_of_joining,
    department_id: staff.department,
  }
  modalMode.value = 'view'
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  setTimeout(() => {
    resetForm()
    modalMode.value = null
  }, 300)
}

const saveStaff = async () => {
  if (
    !form.value.staff_name.trim() ||
    !form.value.designation.trim() ||
    !form.value.date_of_joining ||
    !form.value.department_id
  ) {
    showNotification(
      'error',
      'Validation Error',
      'Please fill out all required fields, including Department.',
    )
    return
  }

  isSavingStaff.value = true
  const payload = { ...form.value }
  if (modalMode.value === 'add') delete payload.id

  try {
    if (modalMode.value === 'add') {
      await apiServices.createMhpcInstituteStaff(payload)
      showNotification(
        'success',
        'Staff Added',
        `${payload.staff_name} has been successfully added.`,
      )
    } else if (modalMode.value === 'edit') {
      await apiServices.updateMhpcInstituteStaff(form.value.id, payload)
      showNotification(
        'success',
        'Staff Updated',
        `${payload.staff_name}'s information has been successfully updated.`,
      )
    }
    fetchStaff(currentPage.value)
    closeModal()
  } catch (error) {
    console.error('Error saving staff:', error)
    let errorMessage = 'An unexpected error occurred while saving staff information.'
    if (error.response?.data) {
      const errors = error.response.data
      const messages = Object.entries(errors).map(
        ([field, msgs]) =>
          `${field.replace(/_/g, ' ')}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`,
      )
      if (messages.length > 0) errorMessage = messages.join('; ')
    }
    showNotification('error', 'Save Failed', errorMessage)
  } finally {
    isSavingStaff.value = false
  }
}

const confirmDelete = (staff) => {
  staffToDelete.value = staff
  showDeleteModal.value = true
}

const deleteStaff = async () => {
  if (!staffToDelete.value) return

  isDeletingStaff.value = true
  try {
    await apiServices.deleteMhpcInstituteStaff(staffToDelete.value.id)
    showNotification(
      'success',
      'Staff Deleted',
      `${staffToDelete.value.staff_name} has been successfully deleted.`,
    )

    const remainingOnPage = staffList.value.length - 1
    if (remainingOnPage === 0 && currentPage.value > 1) {
      fetchStaff(currentPage.value - 1)
    } else {
      fetchStaff(currentPage.value)
    }
    showDeleteModal.value = false
    staffToDelete.value = null
  } catch (error) {
    console.error('Error deleting staff:', error)
    showNotification(
      'error',
      'Delete Failed',
      'There was an error deleting the staff member. They might be associated with other records.',
    )
  } finally {
    isDeletingStaff.value = false
  }
}

const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeoutId) {
    clearTimeout(notification.value.timeoutId)
  }
  notification.value = { show: true, type, title, message, timeoutId: null }
  if (duration > 0) {
    notification.value.timeoutId = setTimeout(closeNotification, duration)
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeoutId) {
    clearTimeout(notification.value.timeoutId)
    notification.value.timeoutId = null
  }
}

watch(searchQuery, () => {
  fetchStaff(1)
})

onMounted(() => {
  fetchDepartments()
  fetchStaff(1)
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.form-input,
.form-select,
.form-textarea {
  @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.table-header-cell {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 select-none;
}
.table-header-cell span {
  @apply ml-1 text-indigo-600;
}

.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.notification-slide-enter-from {
  opacity: 0;
  transform: translate(100%, -20px) scale(0.8);
}
.notification-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95) translateY(20px);
}
</style>
