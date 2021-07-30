<script>
export default {
  name: 'ReportsDashboard',
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">EPC Applications & Reports</h1>
      <div class="flex gap-4">
        <!-- Modified Export Button for CSV -->
        <button @click="exportToCSV" class="btn-primary" :disabled="isLoading || !reportData.length || isLoadingExport">
          <span v-if="isLoadingExport" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          📄 Export CSV
        </button>
        <!-- Removed Excel/PDF Buttons -->
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="mb-6">
      <label for="report-type" class="filter-label">Select Application / Report Type</label>
      <select id="report-type" v-model="activeReport" class="report-type-selector" @change="handleReportTypeChange">
        <option value="" disabled>-- Select a Report Type --</option>
        <optgroup label="Applications">
          <option value="new_applications">New Applications</option>
          {/*
          <option value="additional_applications">Additional Applications</option>
          API function missing */}
          <option value="renewal_applications">Renewal Applications</option>
        </optgroup>
        <optgroup label="CoGS">
          <option value="cogs_management">CoGS Management</option>
        </optgroup>
        <optgroup label="CPD Management">
          <option value="cpd_review">CPD Applications Review</option>
          {/*
          <option value="cpd_self_assessed">Self Assessed CPD Applications</option>
          API function missing */}
        </optgroup>
        <optgroup label="Institute Management">
          {/*
          <option value="eoi_applications">EOI Applications</option>
          API function missing */} {/*
          <option value="dpr_applications">DPR Applications</option>
          API function missing */}
          <option value="capa_management">CAPA Management</option>
        </optgroup>

      </select>
    </div>

    <!-- Filters -->
    <div v-if="activeReport"
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Global Search -->
      <div>
        <label for="global-search" class="filter-label">Global Search</label>
        <input id="global-search" v-model="filters.search" type="text" class="filter-input"
          placeholder="Search across fields..." @input="debouncedFetchData" />
      </div>

      <!-- Date Range -->
      <div>
        <label class="filter-label">Date Range (Created/Submitted)</label>
        <div class="flex gap-2">
          <input v-model="filters.startDate" type="date" class="filter-input" @change="fetchData()"
            :max="filters.endDate || undefined" />
          <input v-model="filters.endDate" type="date" class="filter-input" @change="fetchData()"
            :min="filters.startDate || undefined" />
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status-filter" class="filter-label">Status</label>
        <select id="status-filter" v-model="filters.status" class="filter-input" @change="fetchData()"
          :disabled="!statusOptions.length">
          <option value="">All Statuses</option>
          <option v-if="!statusOptions.length" value="" disabled>No statuses for this type</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <!-- Clear Filters Button -->
      <div class="flex items-end">
        <button @click="clearFilters" class="btn-secondary w-full">Clear Filters</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !isLoadingExport" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      <p class="ml-4 text-gray-600">Loading Report Data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center shadow">
      <p class="text-red-800 font-semibold text-lg">Failed to Load Report</p>
      <p class="text-red-700 mt-2">{{ error }}</p>
      <button @click="fetchData()"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 text-sm font-medium">
        <i class="fas fa-redo mr-1"></i> Try Again
      </button>
    </div>

    <!-- Initial State (No Report Selected) -->
    <div v-else-if="!activeReport" class="text-center py-16 text-gray-500">
      <i class="fas fa-info-circle fa-2x mb-3"></i>
      <p>Please select a report type above to get started.</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!reportData.length && !isLoading"
      class="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No Data Found</h3>
      <p class="mt-1 text-sm text-gray-500">
        No records match the current report type and selected filters.
      </p>
      <p v-if="filters.search || filters.startDate || filters.endDate || filters.status"
        class="mt-2 text-sm text-gray-500">
        Try adjusting or clearing your filters.
      </p>
    </div>

    <!-- Report Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th v-for="header in activeHeaders" :key="header.key" scope="col" class="table-header group"
              :class="{ 'cursor-pointer hover:bg-gray-200': header.sortable }"
              @click="header.sortable ? handleSort(header.key) : null">
              <div class="flex items-center justify-between">
                <span>{{ header.label }}</span>
                <template v-if="header.sortable">
                  <span class="ml-2 text-gray-400 group-hover:text-gray-600">
                    <i :class="[
                      'fas',
                      sortBy === header.key ||
                        (header.backendSortKey && sortBy === header.backendSortKey)
                        ? sortOrder === 'asc'
                          ? 'fa-sort-up text-gray-700'
                          : 'fa-sort-down text-gray-700'
                        : 'fa-sort',
                    ]"></i>
                  </span>
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in reportData" :key="item.id || `report-item-${index}`"
            class="hover:bg-gray-50 transition duration-150">
            <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
              <template v-if="header.isStatusColumn">
                <span :class="statusBadge(getNestedValue(item, header.key))">
                  {{ getNestedValue(item, header.key) ?? 'N/A' }}
                </span>
              </template>
              <template v-else-if="header.type === 'date'">
                {{ formatDate(getNestedValue(item, header.key)) }}
              </template>
              <template v-else-if="header.type === 'datetime'">
                {{ formatDate(getNestedValue(item, header.key), 'datetime') }}
              </template>
              <template v-else-if="header.type === 'currency'">
                {{ formatCurrency(getNestedValue(item, header.key)) }}
              </template>
              <template v-else-if="header.linkTo && getNestedValue(item, header.key)">
                <router-link :to="header.linkTo(item)" class="text-blue-600 hover:underline">
                  {{ getNestedValue(item, header.key) ?? 'N/A' }}
                </router-link>
              </template>
              <template v-else>
                {{ getNestedValue(item, header.key) ?? 'N/A' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && !error && reportData.length && activeReport"
      class="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="text-sm text-gray-700 mb-2 sm:mb-0">
        Showing <span class="font-medium">{{ totalItems > 0 ? startIndex + 1 : 0 }}</span> to
        <span class="font-medium">{{ Math.min(endIndex + 1, totalItems) }}</span>
        of <span class="font-medium">{{ totalItems }}</span> results
      </div>
      <div v-if="totalPages > 1" class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">
          <i class="fas fa-chevron-left mr-1 text-xs"></i> Previous
        </button>
        <span class="px-4 py-1 text-sm font-medium text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading" class="pagination-btn">
          Next <i class="fas fa-chevron-right ml-1 text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import debounce from 'lodash/debounce'
import Papa from 'papaparse'
import apiServices from '@/services/services'


const toast = useToast()

const ITEMS_PER_PAGE = 10
const activeReport = ref('')
const reportData = ref([])
const isLoading = ref(false)
const isLoadingExport = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalItems = ref(0)
const sortBy = ref('')
const sortOrder = ref('asc')
const registrationTypes = ref([])
const additionalQualificationTypeId = ref(null)

const filters = reactive({
  search: '',
  startDate: '',
  endDate: '',
  status: '',
})

// --- Keep the headers definition object ---
const headers = {
  new_applications: [
    { key: 'application_id', label: 'App ID', sortable: true, backendSortKey: 'id' },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true },
    { key: 'application_type', label: 'Type', sortable: true },
    { key: 'submission_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'status', label: 'Status', sortable: true, isStatusColumn: true },

  ],
  additional_applications: [
    { key: 'application_id', label: 'App ID', sortable: true },
    { key: 'original_reg_no', label: 'Original Reg #', sortable: true },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true },
    { key: 'request_type', label: 'Request', sortable: true },
    { key: 'submitted_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'status', label: 'Status', sortable: true, isStatusColumn: true },
  ],
  renewal_applications: [
    { key: 'renewal_id', label: 'Renewal ID', sortable: true, backendSortKey: 'id' },
    {
      key: 'registration_no',
      label: 'Reg Number',
      sortable: true,
      backendSortKey: 'user_qualification.registration_no',
    },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true },
    {
      key: 'renewal_status',
      label: 'Status',
      sortable: true,
      isStatusColumn: true,
      backendSortKey: 'renewal_review_status',
    },
    { key: 'expiry_date', label: 'Current Expiry', type: 'date', sortable: true },
    { key: 'new_expiry_date', label: 'New Expiry', type: 'date', sortable: true },
    {
      key: 'applied_date',
      label: 'Applied On',
      type: 'date',
      sortable: true,
      backendSortKey: 'created_at',
    },
  ],
  cogs_management: [
    { key: 'cogs_number', label: 'CoGS Number', sortable: true, backendSortKey: 'registration_no' },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true, backendSortKey: 'full_name' },
    { key: 'department_name', label: 'Department', sortable: true },
    {
      key: 'issuance_date',
      label: 'Issued On',
      type: 'date',
      sortable: true,
      backendSortKey: 'created_at',
    },
    { key: 'payment_status', label: 'Payment', sortable: true, isStatusColumn: true },
    {
      key: 'endorsement_status',
      label: 'Status',
      sortable: true,
      isStatusColumn: true,
      backendSortKey: 'endorsement_decision',
    },
  ],
  cpd_review: [
    { key: 'cpd_title', label: 'Activity Name', sortable: true, backendSortKey: 'title' },
    { key: 'provider_name', label: 'Provider', sortable: true },
    { key: 'cpd_credits', label: 'Credits', sortable: true, backendSortKey: 'credit_value' },
    { key: 'start_date', label: 'Start Date', type: 'date', sortable: true },
    { key: 'end_date', label: 'End Date', type: 'date', sortable: true },
    {
      key: 'review_status',
      label: 'Status',
      sortable: true,
      isStatusColumn: true,
      backendSortKey: 'is_approved',
    },
  ],
  cpd_self_assessed: [
    { key: 'application_id', label: 'App ID', sortable: true },
    { key: 'applicant_reg_no', label: 'Applicant Reg #', sortable: true },
    { key: 'activity_title', label: 'Activity', sortable: true },
    { key: 'claimed_credits', label: 'Claimed Credits', sortable: true },
    { key: 'submission_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'assessment_status', label: 'Status', sortable: true, isStatusColumn: true },
  ],
  eoi_applications: [
    { key: 'eoi_id', label: 'EOI ID', sortable: true },
    { key: 'institute_name', label: 'Institute Name', sortable: true },
    { key: 'program_name', label: 'Program', sortable: true },
    { key: 'submission_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'eoi_status', label: 'Status', sortable: true, isStatusColumn: true },
  ],
  dpr_applications: [
    { key: 'dpr_id', label: 'DPR ID', sortable: true },
    { key: 'institute_name', label: 'Institute Name', sortable: true },
    { key: 'project_title', label: 'Project Title', sortable: true },
    { key: 'submission_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'dpr_status', label: 'Status', sortable: true, isStatusColumn: true },
  ],
  capa_management: [
    { key: 'capa_id', label: 'CAPA ID', sortable: true },
    { key: 'related_entity', label: 'Related To (Inst/App)', sortable: true },
    { key: 'issue_description', label: 'Issue', sortable: false },
    { key: 'assigned_date', label: 'Assigned', type: 'date', sortable: true },
    { key: 'due_date', label: 'Due Date', type: 'date', sortable: true },
    { key: 'capa_status', label: 'Status', sortable: true, isStatusColumn: true },
  ],


}

const apiMethods = {
  new_applications: {
    fetch: apiServices.getEpcNewApplications,
    transform: (data) => ({
      ...data,
      application_id: data.id ?? 'N/A',
      applicant_name: data.full_name ?? data.applicant?.full_name ?? 'N/A',
      application_type: data.registration_type_name ?? 'N/A',
      submission_date: data.created_at ?? data.submitted_on ?? null,
      status: data.is_active ?? data.current_step ?? 'N/A',
      assigned_officer: data.officer?.name ?? 'Unassigned',
    }),
  },
  additional_applications: {
    fetch: apiServices.getEpcNewQualifications,
    transform: (data) => ({
      ...data,
      application_id: data.id ?? 'N/A',
      original_reg_no: data.application_display?.registration_no ?? 'N/A',
      applicant_name: data.application_display?.full_name ?? 'N/A',
      request_type: registrationTypes.value.find(rt => rt.id === data.registration_type)?.name ?? 'N/A',
      submitted_date: data.created_at ?? null,
      status: data.application_review_status ?? 'N/A',
    }),
  },
  renewal_applications: {
    fetch: apiServices.getEpcRenewals,
    transform: (data) => ({
      ...data,
      renewal_id: data.id ?? 'N/A',
      registration_no: data.application.registration_no ?? 'N/A',
      applicant_name: data.application.full_name ?? 'N/A',
      renewal_status: data.renewal_review_status ?? 'N/A',
      expiry_date: data.new_expiry_date ?? null,
      new_expiry_date: data.new_expiry_date ?? null,
      applied_date: data.created_at ?? null,
    }),
  },
  cogs_management: {
    fetch: apiServices.getEpcCogs,
    transform: (data) => ({
      ...data,
      cogs_number: data.registration_no || (data.id ? `COGS-${data.id}` : 'N/A'),
      applicant_name: data.full_name ?? data.applicant?.name ?? 'N/A',
      department_name: data.department?.name ?? 'N/A',
      issuance_date: data.cogs_approved_date ?? data.created_at ?? null,
      payment_status: data.payment_status ?? (data.is_payment_complete ? 'Paid' : 'Unpaid'),
      endorsement_status: data.endorsement_decision ?? data.review_status ?? 'N/A',
    }),
  },
  cpd_review: {
    fetch: apiServices.getEpcCpdTasks,
    transform: (data) => ({
      ...data,
      cpd_title: data.title_of_cpd ?? data.title ?? 'N/A',
      provider_name: data.full_name ?? 'N/A',
      cpd_credits: data.credit ?? data.credit_value ?? 0,
      start_date: data.from_date ?? data.start_date ?? null,
      end_date: data.to_date ?? data.end_date ?? null,
      review_status:
        data.status ??
        (data.is_approved === true
          ? 'Approved'
          : data.is_approved === false
            ? 'Rejected'
            : 'Pending'),
    }),
  },
  cpd_self_assessed: {
    fetch: apiServices.getEpcCpdRecords,
    transform: (data) => ({
      ...data,
      application_id: data?.id ?? 'N/A',
      applicant_reg_no: data?.registration_no ?? 'N/A',
      activity_title: data.title_of_cpd ?? 'N/A',
      claimed_credits: data.cpd_credit ?? 0,
      submission_date: data.submitted_at ?? data.created_at ?? null,
      assessment_status: data.review_status ?? 'N/A',
    }),
  },
  eoi_applications: {
    fetch: apiServices.getEpcInstitutes,
    transform: (data) => ({
      ...data,
      eoi_id: data.id ?? 'N/A',
      institute_name: data.name_of_institution ?? 'N/A',
      program_name: data.type_of_programme ?? 'N/A',
      submission_date: data.commencement_date ?? data.created_at ?? null,
      eoi_status: data.review_decision ?? 'N/A',
    }),
  },
  dpr_applications: {
    fetch: apiServices.getEpcInstitutes,
    transform: (data) => ({
      ...data,
      dpr_id: data.id ?? 'N/A',
      institute_name: data.name_of_institution ?? 'N/A',
      project_title: data.dpr_name ?? 'N/A',
      submission_date: data.valid_since ?? data.created_at ?? null,
      dpr_status: data.do_dpr_review_decision ?? 'N/A',
    }),
  },
  capa_management: {
    fetch: apiServices.getEpcCapas,
    transform: (data) => ({
      ...data,
      capa_id: data.id ?? 'N/A',
      related_entity: data.institute?.name_of_institution ?? data.related_object_id ?? 'N/A',
      issue_description: data.root_cause ?? 'N/A',
      assigned_date: data.inspection_from_date ?? null,
      due_date: data.inspection_to_date ?? null,
      capa_status: data.status_display ?? 'N/A',
    }),
  },
}

const activeHeaders = computed(() => headers[activeReport.value] || [])
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
const endIndex = computed(() =>
  Math.min(startIndex.value + ITEMS_PER_PAGE - 1, totalItems.value - 1),
)

const statusOptions = computed(() => {
  const optionsMap = {
    new_applications: [
      { value: 'Pending Review', label: 'Pending Review' },
      { value: 'Under Review', label: 'Under Review' },
      { value: 'Queried', label: 'Queried' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ],
    additional_applications: [
      /* Define statuses */
    ],
    renewal_applications: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Processing', label: 'Processing' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
      { value: 'Queried', label: 'Queried' },
    ],
    cogs_management: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Endorsed', label: 'Endorsed' },
      { value: 'Rejected', label: 'Rejected' },
      { value: 'Issued', label: 'Issued' },
    ],
    cpd_review: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ],
    cpd_self_assessed: [
      /* Define statuses */
    ],
    eoi_applications: [
      /* Define statuses */
    ],
    dpr_applications: [
      /* Define statuses */
    ],
    capa_management: [
      { value: 'Open', label: 'Open' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Pending Verification', label: 'Pending Verification' },
      { value: 'Closed', label: 'Closed' },
      { value: 'Overdue', label: 'Overdue' },
    ],

  }
  return optionsMap[activeReport.value] || []
})

const getNestedValue = (obj, path) => {
  if (!path || typeof path !== 'string') return obj
  try {
    if (!path.includes('.')) {
      return obj?.[path]
    }
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  } catch (error) {
    console.warn(`Could not get nested value for path "${path}" from object:`, obj, error)
    return undefined
  }
}

const fetchData = async (isExport = false) => {
  if (!activeReport.value) {
    reportData.value = []
    totalItems.value = 0
    error.value = null
    isLoading.value = false
    return
  }
  // Reset isLoadingExport only when it's a normal fetch, not during an export process
  if (!isExport) {
    isLoading.value = true
    isLoadingExport.value = false
  }
  error.value = null

  const currentApiMethod = apiMethods[activeReport.value]
  if (!currentApiMethod || !currentApiMethod.fetch) {
    const reportLabel = activeReport.value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
    error.value = `Report type "${reportLabel}" is not configured correctly (API fetch function missing).`
    toast.error(error.value, { timeout: 6000 })
    reportData.value = []
    totalItems.value = 0
    isLoading.value = false
    isLoadingExport.value = false
    return
  }

  const sortHeader = activeHeaders.value.find((h) => h.key === sortBy.value)
  const backendSortKey = sortHeader?.backendSortKey || sortBy.value

  try {
    const params = {
      page: currentPage.value,
      page_size: ITEMS_PER_PAGE,
      ordering: backendSortKey
        ? `${sortOrder.value === 'desc' ? '-' : ''}${backendSortKey}`
        : undefined,
      search: filters.search || undefined,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
      status: filters.status || undefined,
    }
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key])

    const response = await currentApiMethod.fetch(params)

    if (response.data && Array.isArray(response.data.results)) {
      let results = response.data.results;
      if (activeReport.value === 'additional_applications' && additionalQualificationTypeId.value) {
        results = results.filter(
          (item) => item.registration_type === additionalQualificationTypeId.value
        )
      }

      reportData.value = results.map((item, index) => {
        try {
          return currentApiMethod.transform ? currentApiMethod.transform(item) : item
        } catch (transformError) {
          console.error(`Transform Error (Item ${index}):`, transformError, 'Raw item:', item)
          return {
            ...item,
            transformation_error: true,
            id: item?.id || `transform-error-${Date.now()}-${index}`,
          }
        }
      })
      totalItems.value = response.data.count ?? 0
    } else {
      console.warn('API response error:', response.data)
      reportData.value = []
      totalItems.value = 0
    }
  } catch (err) {
    console.error(`Fetch Error ${activeReport.value}:`, err.response?.data || err.message || err)
    const reportLabel = activeReport.value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
    error.value = `Failed to load ${reportLabel} data. ${err.response?.data?.detail || err.message || 'Try again.'}`
    toast.error(error.value, { timeout: 5000 })
    reportData.value = []
    totalItems.value = 0
  } finally {
    if (!isExport) {
      isLoading.value = false
    }
  }
}
const debouncedFetchData = debounce(() => fetchData(false), 500)

const handleSort = (key) => {
  const header = activeHeaders.value.find((h) => h.key === key)
  if (!header?.sortable) return
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
  fetchData()
}

const handleReportTypeChange = () => {
  currentPage.value = 1
  sortBy.value = ''
  sortOrder.value = 'asc'
  filters.search = ''
  filters.startDate = ''
  filters.endDate = ''
  filters.status = ''
  reportData.value = []
  totalItems.value = 0
  error.value = null
  isLoading.value = false
  isLoadingExport.value = false /
    fetchData()
}

const clearFilters = () => {
  filters.search = ''
  filters.startDate = ''
  filters.endDate = ''
  filters.status = ''
  currentPage.value = 1
  sortBy.value = ''
  sortOrder.value = 'asc'
  fetchData()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}

const fetchAllData = async () => {
  if (!activeReport.value) return []
  const currentApiMethod = apiMethods[activeReport.value]
  if (!currentApiMethod || !currentApiMethod.fetch) {
    const reportLabel = activeReport.value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
    toast.error(`Export config error for ${reportLabel}.`, { timeout: 4000, id: 'export-toast' })
    return []
  }

  const allData = []
  let currentPageForExport = 1
  let hasMore = true
  const EXPORT_PAGE_SIZE = 100
  const reportLabel = activeReport.value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const loadingToastId = toast.info(`Preparing export: ${reportLabel}...`, {
    timeout: false,
    closeButton: false,
    icon: 'fas fa-spinner fa-spin',
    id: 'export-toast',
  })
  // isLoadingExport state is managed by the calling function (exportToCSV)

  const sortHeader = activeHeaders.value.find((h) => h.key === sortBy.value)
  const backendSortKey = sortHeader?.backendSortKey || sortBy.value

  while (hasMore) {
    const params = {
      page: currentPageForExport,
      page_size: EXPORT_PAGE_SIZE,
      ordering: backendSortKey
        ? `${sortOrder.value === 'desc' ? '-' : ''}${backendSortKey}`
        : undefined,
      search: filters.search || undefined,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
      status: filters.status || undefined,
    }
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key])
    try {
      // Pass true to indicate this fetch is part of an export
      const response = await currentApiMethod.fetch(params) // No need for isExport=true here, API call is the same
      if (response.data && Array.isArray(response.data.results)) {
        const transformedData = response.data.results.map((item, index) => {
          try {
            return currentApiMethod.transform ? currentApiMethod.transform(item) : item
          } catch (transformError) {
            console.error(
              `Export Transform Error (Item ${index}):`,
              transformError,
              'Raw item:',
              item,
            )
            return {
              ...item,
              transformation_error: true,
              id: item?.id || `export-error-${allData.length + index}`,
            }
          }
        })
        allData.push(...transformedData)
        hasMore =
          !!response.data.next ||
          (response.data.results.length === EXPORT_PAGE_SIZE &&
            (response.data.count ? allData.length < response.data.count : true))
        currentPageForExport++
        toast.update(
          loadingToastId,
          {
            content: `Fetched ${allData.length} of approx ${response.data.count || 'many'} records...`,
          },
          true,
        )
      } else {
        console.warn('Export fetch error:', response.data)
        hasMore = false
      }
    } catch (err) {
      console.error('Export fetchAllData error:', err.response?.data || err.message || err)
      toast.dismiss(loadingToastId)
      toast.error('Error fetching data for export.', { timeout: 5000 })
      throw err // Re-throw to be caught by exportToCSV
    }
  }
  toast.dismiss(loadingToastId)
  if (allData.length === 0) {
    toast.warning('No data found to export.', { timeout: 3000 })
  }
  return allData
}

const exportToCSV = async () => {
  if (isLoadingExport.value) return // Prevent multiple clicks
  isLoadingExport.value = true
  const reportLabel = activeReport.value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  try {
    const allRawData = await fetchAllData()
    // fetchAllData handles the "no data" warning, so just return if empty
    if (!allRawData || allRawData.length === 0) {
      return
    }

    // 1. Prepare Headers (Use labels from activeHeaders)
    const csvHeader = activeHeaders.value.map((header) => header.label)

    // 2. Prepare Body Data (Format based on type, handle nulls, use getNestedValue)
    const csvBody = allRawData.map((item) => {
      return activeHeaders.value.map((header) => {
        const value = getNestedValue(item, header.key)
        let csvValue = ''

        if (value === null || value === undefined) {
          csv
        } else if (header.type === 'date') {
          const formatted = formatDate(value)
          csvValue = formatted === '-' ? '' : formatted
        } else if (header.type === 'datetime') {
          const formatted = formatDate(value, 'datetime')
          csvValue = formatted === '-' ? '' : formatted
        } else if (header.type === 'currency') {
          const num = Number(value)
          csvValue = !isNaN(num) ? num.toString() : ''

        } else if (typeof value === 'object') {
          csvValue = JSON.stringify(value)
        } else {
          csvValue = String(value)
        }

        return csvValue
      })
    })

    const csvData = [csvHeader, ...csvBody]

    const csvString = Papa.unparse(csvData)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const fileName = `${reportLabel}_Report_${formatDate(new Date(), 'yyyy-mm-dd')}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click() // Trigger download
    document.body.removeChild(link) // Clean up
    URL.revokeObjectURL(url) // Free up memory

    toast.success('CSV export successful!', { timeout: 3000 })
  } catch (err) {
    console.error('CSV Export process failed:', err)
    if (!toast.isActive('export-toast')) {
      toast.error('CSV export failed. Check console for details.', { timeout: 4000 })
    }
  } finally {
    isLoadingExport.value = false
  }
}

// --- formatDate, formatCurrency, statusBadge remain the same ---
const formatDate = (dateString, format = 'default') => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    if (format === 'yyyy-mm-dd') {
      const y = date.getFullYear()
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const d = date.getDate().toString().padStart(2, '0')
      return `${y}-${m}-${d}`
    }
    if (format === 'datetime') {
      return date
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(',', '')
    }
    // Default format (DD/MM/YYYY)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (e) {
    console.error('Date format error:', e)
    return '-'
  }
}

const formatCurrency = (value) => {
  const num = Number(value)
  if (value === null || value === undefined || isNaN(num)) return '-'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BTN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  } catch (e) {
    console.warn('Currency format warning:', e)
    return `BTN ${num.toFixed(2)}`
  }
}

const statusBadge = (status) => {
  const lowerStatus = String(status ?? '')
    .toLowerCase()
    .trim()
    .replace(/_/g, ' ')
  let base = 'px-2.5 py-0.5 rounded-full text-xs font-medium inline-block whitespace-nowrap border'
  if (
    lowerStatus.includes('approved') ||
    lowerStatus === 'paid' ||
    lowerStatus === 'active' ||
    lowerStatus === 'completed' ||
    lowerStatus === 'accepted' ||
    lowerStatus === 'endorsed' ||
    lowerStatus === 'issued' ||
    lowerStatus === 'closed'
  )
    return `${base} bg-green-100 text-green-800 border-green-200`
  if (
    lowerStatus.includes('pending') ||
    lowerStatus.includes('processing') ||
    lowerStatus === 'unpaid' ||
    lowerStatus.includes('submitted') ||
    lowerStatus.includes('review') ||
    lowerStatus.includes('assessment') ||
    lowerStatus === 'open' ||
    lowerStatus === 'in progress'
  )
    return `${base} bg-yellow-100 text-yellow-800 border-yellow-200`
  if (lowerStatus.includes('queried') || lowerStatus === 'pending verification')
    return `${base} bg-blue-100 text-blue-800 border-blue-200`
  if (
    lowerStatus.includes('rejected') ||
    lowerStatus.includes('cancelled') ||
    lowerStatus === 'declined'
  )
    return `${base} bg-red-100 text-red-800 border-red-200`
  if (lowerStatus.includes('expired') || lowerStatus === 'inactive' || lowerStatus === 'overdue')
    return `${base} bg-gray-200 text-gray-800 border-gray-300`
  if (lowerStatus === 'n/a' || lowerStatus === 'draft' || lowerStatus === 'not applied')
    return `${base} bg-gray-100 text-gray-500 border-gray-200`
  return `${base} bg-gray-100 text-gray-700 border-gray-200`
}

onMounted(() => {
  console.log('ECP Reports Dashboard Mounted. Please select a report type.')
})
</script>

<style scoped>
/* --- Keep existing styles --- */
.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.filter-input,
.report-type-selector {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #fff;
  font-size: 0.875rem;
  color: #111827;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.filter-input:disabled,
.report-type-selector:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.filter-input::placeholder {
  color: #9ca3af;
}

.filter-input:focus,
.report-type-selector:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.table-header {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.table-cell {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.table-cell a {
  text-decoration: none;
}

.table-cell a:hover {
  text-decoration: underline;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition:
    background-color 0.2s ease-in-out,
    opacity 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn i.fas {
  margin-right: 0.5rem;
  font-size: 0.875em;
}

.btn span.mr-2 {
  display: inline-flex;
  align-items: center;
}

/* --- Add or modify button styles as needed --- */
.btn-primary {
  @apply btn bg-blue-500 text-white;
}

.btn-primary:hover:not(:disabled) {
  @apply bg-blue-600 shadow-md;
}

.btn-primary:disabled {
  @apply bg-blue-500;
}

.btn-success {
  @apply btn bg-green-500 text-white;
}

.btn-success:hover:not(:disabled) {
  @apply bg-green-600 shadow-md;
}

.btn-success:disabled {
  @apply bg-green-500;
}

.btn-danger {
  @apply btn bg-red-500 text-white;
}

.btn-danger:hover:not(:disabled) {
  @apply bg-red-600 shadow-md;
}

.btn-danger:disabled {
  @apply bg-red-500;
}

.btn-secondary {
  @apply btn bg-gray-500 text-white;
}

.btn-secondary:hover:not(:disabled) {
  @apply bg-gray-600 shadow-md;
}

.btn-secondary:disabled {
  @apply bg-gray-500;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  transition:
    background-color 0.2s,
    border-color 0.2s;
  display: inline-flex;
  align-items: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f9fafb;
}

.pagination-btn i {
  font-size: 0.75rem;
}

optgroup {
  font-weight: 700;
  font-style: italic;
  color: #1f2937;
  background-color: #f3f4f6;
  padding: 4px 0;
}
</style>
