<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Faculty Management"
      subtitle="Manage medical and academic faculty details and records for your institute."
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
            placeholder="Search faculty by name, ID, designation, type..."
            class="form-input pl-10"
          />
        </div>
        <button @click="openAddFacultyModal" type="button" class="btn btn-primary">
          <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          Add New Faculty
        </button>
      </div>

      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-lg border border-gray-200 py-16"
      >
        <Loader class="animate-spin text-indigo-600 w-12 h-12" />
        <p class="mt-4 text-lg font-medium text-gray-700">Loading faculty data...</p>
      </div>

      <div
        v-else-if="!isLoading && filteredFaculty.length === 0 && !searchQuery"
        class="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <UsersIcon class="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
        <h3 class="mt-4 text-xl font-semibold text-gray-800">No Faculty Members Found</h3>
        <p class="mt-2 text-sm text-gray-500">
          Get started by adding your first faculty member to the institute.
        </p>
        <div class="mt-6">
          <button @click="openAddFacultyModal" type="button" class="btn btn-primary">
            <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
            Add Faculty Member
          </button>
        </div>
      </div>

      <div
        v-else-if="!isLoading && filteredFaculty.length === 0 && searchQuery"
        class="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <DocumentMagnifyingGlassIcon class="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
        <h3 class="mt-4 text-xl font-semibold text-gray-800">No Matching Results</h3>
        <p class="mt-2 text-sm text-gray-500">
          No faculty members found for "<span class="font-medium">{{ searchQuery }}</span
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
                  <SortIndicator :column="'staff_name'" :current-column="sortColumn" :direction="sortDirection" />
                </th>
                <th @click="sortBy('designation')" scope="col" class="table-header-cell">
                  Designation
                  <SortIndicator :column="'designation'" :current-column="sortColumn" :direction="sortDirection" />
                </th>
                <th @click="sortBy('date_of_joining')" scope="col" class="table-header-cell">
                  Date of Joining
                  <SortIndicator :column="'date_of_joining'" :current-column="sortColumn" :direction="sortDirection" />
                </th>
                <th @click="sortBy('faculty_type')" scope="col" class="table-header-cell">
                  Faculty Type
                  <SortIndicator :column="'faculty_type'" :current-column="sortColumn" :direction="sortDirection" />
                </th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="faculty in filteredFaculty"
                :key="faculty.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ faculty.staff_name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span
                    v-if="faculty.designation"
                    :class="[
                      getDesignationPillClass(faculty.designation),
                      'px-2.5 py-1 text-xs font-semibold rounded-full leading-tight',
                    ]"
                  >
                    {{ faculty.designation }}
                  </span>
                   <span v-else class="text-gray-400 italic">N/A</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ formatDate(faculty.date_of_joining) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                  {{ faculty.faculty_type || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center items-center space-x-3">
                    <button @click="openViewFacultyModal(faculty)" class="text-gray-400 hover:text-indigo-600 transition-colors" title="View Details">
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button @click="openEditFacultyModal(faculty)" class="text-gray-400 hover:text-sky-600 transition-colors" title="Edit Faculty">
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                    <button @click="confirmDelete(faculty)" class="text-gray-400 hover:text-red-600 transition-colors" title="Delete Faculty">
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="totalFaculty > 0"
          class="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="fetchPreviousPage" :disabled="!hasPreviousPage" class="btn btn-outline text-sm">
              Previous
            </button>
            <button @click="fetchNextPage" :disabled="!hasNextPage" class="btn btn-outline text-sm">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span>
                to <span class="font-medium">{{ paginationEnd }}</span>
                of <span class="font-medium">{{ totalFaculty }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeModal" aria-hidden="true"></div>
        <div
          class="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog" aria-modal="true" :aria-labelledby="`modal-title-${modalMode}`" @click.stop
        >
          <div class="py-5 px-6 md:px-8 bg-gray-50 rounded-t-xl border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
            <div class="flex items-center">
              <div class="p-2 bg-indigo-100 rounded-lg mr-3">
                <UserPlusIcon v-if="modalMode === 'add'" class="w-6 h-6 text-indigo-600" aria-hidden="true" />
                <PencilSquareIcon v-else-if="modalMode === 'edit'" class="w-6 h-6 text-indigo-600" aria-hidden="true" />
                <EyeIcon v-else class="w-6 h-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <h2 :id="`modal-title-${modalMode}`" class="text-lg font-semibold text-gray-900">
                  {{ modalMode === 'add' ? 'Add New Faculty' : modalMode === 'edit' ? 'Edit Faculty Details' : 'View Faculty Details' }}
                </h2>
                <p class="text-xs text-gray-500">
                  {{ modalMode === 'add' ? 'Fill in the details to add a new faculty member.' : modalMode === 'edit' ? 'Update the information for this faculty member.' : 'Viewing faculty member information.' }}
                </p>
              </div>
            </div>
            <button @click="closeModal" class="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <span class="sr-only">Close</span>
              <XMarkIcon class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <form @submit.prevent="saveFaculty" class="p-6 md:p-8">
            <div class="space-y-6">
              <div>
                <label for="faculty_type" class="form-label">Faculty Type</label>
                <select
                  id="faculty_type"
                  v-model="form.faculty_type"
                  :disabled="modalMode === 'view' || (modalMode === 'edit' && form.id !== null)"
                  required
                  class="form-select"
                  @change="handleFacultyTypeChange"
                >
                  <option value="" disabled>Select Faculty Type</option>
                  <option value="medical">Medical</option>
                  <option value="academic">Academic</option>
                </select>
                <p v-if="validation.errors.faculty_type" class="mt-1 text-sm text-red-500">{{ validation.errors.faculty_type }}</p>
              </div>

              <div v-if="form.faculty_type === 'academic'">
                <AcademicFacultyForm
                  :form="form" @update:form="updateSharedForm" :mode="modalMode"
                  :errors="validation.errors"
                  :minYear="minYear" :currentYear="currentYear"
                  @show-notification="showNotification"
                />
                 <!-- qualificationOptions and courseTypeOptions removed from props -->
              </div>
              <div v-else-if="form.faculty_type === 'medical'">
                <MedicalFacultyForm
                  :form="form" @update:form="updateSharedForm" :mode="modalMode"
                  :errors="validation.errors"
                  @show-notification="showNotification"
                />
              </div>
              <div v-else class="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg">
                <InformationCircleIcon class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm">Please select a faculty type above to view or enter details.</p>
              </div>

              <div v-if="form.faculty_type" class="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button type="button" @click="closeModal" class="btn btn-outline w-full sm:w-auto mt-3 sm:mt-0">
                  {{ modalMode === 'view' ? 'Close' : 'Cancel' }}
                </button>
                <button v-if="modalMode !== 'view'" type="submit" :disabled="isSavingFaculty" class="btn btn-primary w-full sm:w-auto">
                  <span class="loader animate-spin h-5 w-5 mr-2 text-white" v-if="isSavingFaculty"></span>
                  <span>{{ isSavingFaculty ? 'Saving...' : modalMode === 'add' ? 'Add Faculty' : 'Update Faculty' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[60] flex items-center justify-center sm:p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="showDeleteModal = false" aria-hidden="true"></div>
        <div class="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 transform transition-all">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg font-semibold text-gray-900" id="modal-title-delete">Confirm Delete</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete faculty member
                  <span class="font-semibold text-gray-700">{{ facultyToDelete?.staff_name || 'Unknown' }}</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse sm:space-x-3 sm:space-x-reverse">
            <button type="button" @click="deleteFaculty" :disabled="isDeletingFaculty" class="btn btn-danger w-full sm:w-auto">
              <span class="loader animate-spin h-5 w-5 mr-2 text-white" v-if="isDeletingFaculty"></span>
              <span>{{ isDeletingFaculty ? 'Deleting...' : 'Delete' }}</span>
            </button>
            <button type="button" @click="showDeleteModal = false" :disabled="isDeletingFaculty" class="btn btn-outline w-full sm:w-auto mt-3 sm:mt-0">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive, h } from 'vue';
import apiServices from '@/services/services';
import AcademicFacultyForm from './AcademicFacultyForm.vue';
import MedicalFacultyForm from './MedicalFacultyForm.vue';
import { Loader } from 'lucide-vue-next';
import {
  MagnifyingGlassIcon, PlusIcon, EyeIcon, PencilSquareIcon, TrashIcon,
  ChevronLeftIcon, ChevronRightIcon, XMarkIcon, CheckCircleIcon, XCircleIcon,
  InformationCircleIcon, ExclamationTriangleIcon, UsersIcon,
  DocumentMagnifyingGlassIcon, UserPlusIcon,
} from '@heroicons/vue/24/outline';
// Assuming InstituteHeader is a global component or correctly imported elsewhere if needed.

const currentYear = new Date().getFullYear();
const minYear = currentYear - 70;

const SortIndicator = ({ column, currentColumn, direction }) => {
  return h('span', { class: 'ml-1 text-gray-400 text-xs' }, currentColumn === column ? (direction === 'asc' ? '↑' : '↓') : '↕');
};

const facultyList = ref([]);
const isLoading = ref(true);
const isSavingFaculty = ref(false);
const isDeletingFaculty = ref(false);
const searchQuery = ref('');
const sortColumn = ref('staff_name');
const sortDirection = ref('asc');
const currentPage = ref(1);
const nextPageUrl = ref(null);
const previousPageUrl = ref(null);
const totalFaculty = ref(0);
const pageSize = ref(10); // Or your desired page size

const institutePk = ref(null); // This needs to be set, e.g., from auth store or route params

const isModalVisible = ref(false);
const modalMode = ref(null); // 'add', 'edit', 'view'
const showDeleteModal = ref(false);
const facultyToDelete = ref(null);
// Removed qualificationOptions and courseTypeOptions as child component fetches them

const initialFormState = () => ({
  id: null,
  faculty_type: '', // 'academic' or 'medical'
  identifier: '', // Used for CID (academic) or Registration No (medical)
  application_profile_identifier: null, // For medical from BHMC
  // Shared fields (will be in form, but Academic/Medical might not use all)
  staff_name: '',
  nationality: '',
  date_of_birth: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  contact_no: '',
  email_address: '',
  passport_photo: null,
  passport_photo_name: '', // To keep track of existing photo
  designation: '', // Designation at *this* institute
  date_of_joining: new Date().toISOString().split('T')[0], // Date of joining *this* institute
  education_details: [], // Specific to academic
  cv: null,
  cv_name: '', // To keep track of existing CV
  // Medical specific (if not fetched directly into these fields by child component)
  registration_type: '', // For medical
  registration_date: '', // For medical
  expiry_date: '', // For medical
  // Other specific fields for medical or academic can be added if shared at this level
});

const form = ref(initialFormState());

const updateSharedForm = (newFormState) => {
  form.value = { ...form.value, ...newFormState }; // Merge to preserve faculty_type etc.
};


const validation = reactive({
  errors: {},
  rules: {
    faculty_type: (value) => (!value ? 'Faculty type is required.' : null),
    identifier: (value, facultyType) => {
      if (!value && facultyType) return 'Identifier (CID/Registration No.) is required.';
      if (facultyType === 'academic' && value && !/^\d{11}$/.test(value)) {
        return 'Academic faculty requires a valid 11-digit CID.';
      }
      // Add more specific validation for medical identifier if needed
      return null;
    },
    // Removed application_profile_identifier, registration_type, registration_date, expiry_date
    // as they are handled within MedicalFacultyForm
    nationality: (value, facultyType, isDataFetched) => (facultyType && !isDataFetched && !value && modalMode.value !== 'view' ? 'Nationality is required.' : null),
    staff_name: (value, facultyType) => (facultyType && !value ? 'Full Name is required.' : null),
    date_of_birth: (value, facultyType, isDataFetched) => (facultyType && !isDataFetched && !value && modalMode.value !== 'view' ? 'Date of birth is required.' : null),
    contact_no: (value, facultyType, isDataFetched) => {
      if (facultyType && !isDataFetched && !value && modalMode.value !== 'view') return 'Contact number is required.';
      if (facultyType && value && !/^\+?\d{7,15}$/.test(value)) return 'Enter a valid contact number (7-15 digits, optional +).';
      return null;
    },
    email_address: (value, facultyType, isDataFetched) => {
      if (facultyType && !isDataFetched && !value && modalMode.value !== 'view') return 'Email address is required.';
      if (facultyType && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
      return null;
    },
    passport_photo: (value, currentPhotoName, facultyType) => {
      if (facultyType && modalMode.value === 'add' && !value && !currentPhotoName)
        return 'Passport photo is required for new faculty.';
      return null;
    },
    designation: (value, facultyType) => (facultyType && !value ? 'Designation at institute is required.' : null),
    date_of_joining: (value, facultyType) => (facultyType && !value ? 'Date of joining at institute is required.' : null),
    cv: (value, currentCvName, facultyType) => {
      if (facultyType && modalMode.value === 'add' && !value && !currentCvName) return 'CV is required for new faculty.';
      return null;
    },
    // These address fields are primarily for Academic, Medical might fetch them.
    village: (value, facultyType, isDataFetched) => {
      if (facultyType === 'academic' && !isDataFetched && !value && modalMode.value !== 'view') return 'Village is required.';
      return null;
    },
    gewog: (value, facultyType, isDataFetched) => {
      if (facultyType === 'academic' && !isDataFetched && !value && modalMode.value !== 'view') return 'Gewog is required.';
      return null;
    },
    dzongkhag: (value, facultyType, isDataFetched) => {
      if (facultyType === 'academic' && !isDataFetched && !value && modalMode.value !== 'view') return 'Dzongkhag is required.';
      return null;
    },
  },
});

const validateForm = () => {
  validation.errors = {};
  let isValid = true;
  const facultyType = form.value.faculty_type;
  // isDataFetched should ideally come from the child form's state if it manages fetching
  const isPotentiallyDataFetchedByChild = form.value.isDataFetched; // Assuming child emits this


  for (const field in validation.rules) {
    let error;
    if (field === 'passport_photo') error = validation.rules[field](form.value[field], form.value.passport_photo_name, facultyType);
    else if (field === 'cv') error = validation.rules[field](form.value[field], form.value.cv_name, facultyType);
    // Fields common to both and not typically auto-fetched by child for basic entry
    else if (['staff_name', 'designation', 'date_of_joining', 'contact_no', 'email_address', 'nationality', 'date_of_birth', 'village', 'gewog', 'dzongkhag', 'identifier'].includes(field)) {
         error = validation.rules[field](form.value[field], facultyType, isPotentiallyDataFetchedByChild);
    } else {
        error = validation.rules[field](form.value[field], facultyType); // For faculty_type itself
    }


    if (error) { validation.errors[field] = error; isValid = false; }
  }

  // ** MODIFIED Education Details Validation **
  if (facultyType === 'academic' && modalMode.value !== 'view') {
    (form.value.education_details || []).forEach((edu, index) => {
      if (!edu.qualification_type_id) { validation.errors[`edu_qualification_type_${index}`] = 'Qualification Type is required'; isValid = false; }
      if (!edu.qualification_id) { validation.errors[`edu_qualification_name_${index}`] = 'Qualification Name is required'; isValid = false; }
      if (!edu.institute || String(edu.institute).trim() === '') { validation.errors[`edu_institute_${index}`] = 'Institute/University is required'; isValid = false; }
      const year = parseInt(edu.year_of_completion, 10);
      if (edu.year_of_completion === undefined || String(edu.year_of_completion).trim() === '' || isNaN(year)) {
        validation.errors[`edu_year_${index}`] = 'Year of completion is required and must be a number.'; isValid = false;
      } else if (year < minYear || year > currentYear) {
        validation.errors[`edu_year_${index}`] = `Year must be between ${minYear} and ${currentYear}`; isValid = false;
      }
    });
    if (!form.value.education_details || form.value.education_details.length === 0) {
      // Optionally add a general error if at least one education detail is required
      // validation.errors.education_general = "At least one education detail is required for academic faculty.";
      // isValid = false;
    }
  }
  console.log('Validation Ran. Errors:', JSON.parse(JSON.stringify(validation.errors)));
  return isValid;
};


const notification = ref({ show: false, type: 'info', title: '', message: '', timeoutId: null });

const filteredFaculty = computed(() => {
  if (!searchQuery.value.trim()) return facultyList.value;
  const query = searchQuery.value.toLowerCase();
  return facultyList.value.filter((faculty) =>
    (faculty.staff_name && faculty.staff_name.toLowerCase().includes(query)) ||
    (faculty.identifier && String(faculty.identifier).toLowerCase().includes(query)) || // Ensure identifier is string
    (faculty.designation && faculty.designation.toLowerCase().includes(query)) ||
    (faculty.faculty_type && faculty.faculty_type.toLowerCase().includes(query))
  );
});

const hasNextPage = computed(() => !!nextPageUrl.value);
const hasPreviousPage = computed(() => !!previousPageUrl.value);
const paginationStart = computed(() => totalFaculty.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value);
const paginationEnd = computed(() => {
  if (totalFaculty.value === 0) return 0;
  const end = (currentPage.value - 1) * pageSize.value + facultyList.value.length;
  return Math.min(end, totalFaculty.value);
});

const fetchInstitutePk = async () => {
  // TODO: Replace with actual logic to get institute PK
  // This could be from a store, route param, or another API call
  institutePk.value = 1; // Example: Hardcoded for now
  console.log('Institute PK set to:', institutePk.value);
  if (!institutePk.value) {
    console.error("CRITICAL: Institute PK could not be determined.");
    showNotification('error', 'System Error', 'Cannot identify the current institute. Please contact support.', 0);
  }
};

// Removed fetchDropdownOptions as child components handle their specific dropdowns

const fetchFaculty = async (page = 1) => {
  isLoading.value = true;
  try {
    // Ensure institutePk is available before fetching
    if (!institutePk.value) { // Always check for institutePk
        await fetchInstitutePk(); // Attempt to fetch it if not already set
        if (!institutePk.value) {
            showNotification('error', 'Configuration Error', 'Institute not identified. Cannot load faculty.');
            isLoading.value = false;
            return;
        }
    }
    const params = {
        page,
        search: searchQuery.value,
        limit: pageSize.value,
        institute: institutePk.value // Filter by institute
    };

    const response = await apiServices.getMhpcTeachingFaculties(params);
    if (response?.data) {
      facultyList.value = (response.data.results || []).map(f => ({
        ...f,
        staff_name: f.faculty_name || f.staff_name || 'N/A',
        identifier: f.faculty_id || f.registration_no || f.cid || '',
        application_profile_identifier: f.application_profile || null,
        faculty_type: f.faculty_type || (f.registration_no ? 'medical' : (f.cid ? 'academic' : 'unknown')),
        designation: f.designation || null,
        date_of_joining: f.date_of_joining || null,
        education_details: parseEducationDetails(f.education_details),
        cv_name: f.cv && typeof f.cv === 'string' ? f.cv.split('/').pop() : '',
        passport_photo_name: f.passport_photo && typeof f.passport_photo === 'string' ? f.passport_photo.split('/').pop() : '',
      }));
      totalFaculty.value = response.data.count || 0;
      nextPageUrl.value = response.data.next;
      previousPageUrl.value = response.data.previous;
      currentPage.value = page;
    } else {
      showNotification('error', 'Data Error', 'Failed to load faculty data or data format is incorrect.');
      facultyList.value = []; totalFaculty.value = 0;
    }
  } catch (error) {
    console.error('Error fetching faculty:', error);
    showNotification('error', 'Network Error', `Failed to connect to server: ${error.message}`);
    facultyList.value = []; totalFaculty.value = 0;
  } finally {
    isLoading.value = false;
  }
};


const extractPageNumber = (url) => {
  if (!url) return null;
  try {
    const pageParam = new URL(url).searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : null;
  } catch (e) { console.error('URL parse error:', e); return null; }
};

const fetchNextPage = () => {
  const pageNum = extractPageNumber(nextPageUrl.value);
  if (pageNum) fetchFaculty(pageNum);
  else if (hasNextPage.value) fetchFaculty(currentPage.value + 1); // Fallback if URL parsing fails but next is true
};

const fetchPreviousPage = () => {
  const pageNum = extractPageNumber(previousPageUrl.value);
  if (pageNum) fetchFaculty(pageNum);
  else if (hasPreviousPage.value && currentPage.value > 1) fetchFaculty(currentPage.value - 1); // Fallback
};


const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column; sortDirection.value = 'asc';
  }
  // Create a new sorted array to trigger reactivity properly
  facultyList.value = [...facultyList.value].sort((a, b) => {
    let valA = a[column]; let valB = b[column];

    if (valA == null && valB == null) return 0;
    if (valA == null) return sortDirection.value === 'asc' ? 1 : -1;
    if (valB == null) return sortDirection.value === 'asc' ? -1 : 1;

    if (column === 'date_of_joining') {
      // Ensure valid dates before comparing
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return sortDirection.value === 'asc' ? 1 : -1;
      if (isNaN(dateB)) return sortDirection.value === 'asc' ? -1 : 1;
      valA = dateA;
      valB = dateB;
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = String(valB).toLowerCase(); // Ensure valB is also string for comparison
    }
    // Handle numeric comparison if applicable
    if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection.value === 'asc' ? valA - valB : valB - valA;
    }

    return sortDirection.value === 'asc' ? (valA < valB ? -1 : (valA > valB ? 1 : 0)) : (valA > valB ? -1 : (valA < valB ? 1 : 0));
  });
};


const getDesignationPillClass = (designation) => {
  if (!designation) return 'bg-gray-100 text-gray-800';
  const d = designation.toLowerCase();
  if (d.includes('director') || d.includes('head') || d.includes('manager')) return 'bg-red-100 text-red-700';
  if (d.includes('professor')) return 'bg-purple-100 text-purple-700';
  if (d.includes('lecturer') || d.includes('teacher') || d.includes('instructor')) return 'bg-sky-100 text-sky-700';
  if (d.includes('assistant') || d.includes('associate')) return 'bg-yellow-100 text-yellow-700';
  if (d.includes('officer') || d.includes('coordinator')) return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if the date is valid. Invalid dates often result in NaN for getTime()
    if (isNaN(date.getTime())) {
      // Attempt to re-parse if it's a simple YYYY-MM-DD from input that might be treated as UTC by new Date()
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // new Date(year, monthIndex, day) - monthIndex is 0-based
        const reParsedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(reParsedDate.getTime())) {
          return reParsedDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        }
      }
      return 'Invalid Date'; // Original string was not a parsable date
    }
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    console.error('Date format error for:', dateString, e);
    return 'Invalid Date'; // Fallback for any other parsing errors
  }
};

const resetForm = () => {
  form.value = initialFormState();
  validation.errors = {};
};

const openAddFacultyModal = () => {
  resetForm();
  modalMode.value = 'add';
  isModalVisible.value = true;
};

const parseEducationDetails = (details) => {
  if (!details) return []; // Handle null or undefined
  if (typeof details === 'string') {
    try {
      const parsed = JSON.parse(details);
      // ** Ensure parsed details have the correct structure for AcademicFacultyForm **
      return Array.isArray(parsed) ? parsed.map(edu => ({
        qualification_type_id: edu.qualification_type_id || edu.type || '', // Map from old 'type' if necessary
        qualification_id: edu.qualification_id || edu.qualification || '', // Map from old 'qualification'
        institute: edu.institute || '',
        year_of_completion: edu.year_of_completion || ''
      })) : [];
    } catch (e) {
      console.error("Parsing education_details string failed:", e, "Details:", details);
      return [];
    }
  }
  // If already an array, map to ensure correct structure
  return Array.isArray(details) ? details.map(edu => ({
        qualification_type_id: edu.qualification_type_id || edu.type || '',
        qualification_id: edu.qualification_id || edu.qualification || '',
        institute: edu.institute || '',
        year_of_completion: edu.year_of_completion || ''
      })) : [];
};

const populateFormForModal = (faculty) => {
  const educationDetails = parseEducationDetails(faculty.education_details);
  form.value = {
    id: faculty.id,
    faculty_type: faculty.faculty_type || (faculty.registration_no ? 'medical' : (faculty.cid ? 'academic' : '')),
    identifier: faculty.faculty_id || faculty.registration_no || faculty.cid || '',
    application_profile_identifier: faculty.application_profile_identifier || faculty.application_profile || null,
    staff_name: faculty.faculty_name || faculty.staff_name || '',
    // Medical specific fields that might come from the main faculty list
    registration_type: faculty.registration_type || '',
    registration_date: faculty.registration_date || '',
    expiry_date: faculty.expiry_date || '',
    // Shared fields
    nationality: faculty.nationality || '',
    date_of_birth: faculty.date_of_birth || '',
    village: faculty.village || '',
    gewog: faculty.gewog || '',
    dzongkhag: faculty.dzongkhag || '',
    contact_no: faculty.contact_no || '',
    email_address: faculty.email_address || '',
    designation: faculty.designation || '', // Designation at *this* institute
    date_of_joining: faculty.date_of_joining || (modalMode.value === 'add' ? new Date().toISOString().split('T')[0] : ''),
    education_details: educationDetails, // Already parsed
    cv: null, // File objects are reset
    cv_name: faculty.cv_name || (faculty.cv && typeof faculty.cv === 'string' ? faculty.cv.split('/').pop() : ''),
    passport_photo: null, // File objects are reset
    passport_photo_name: faculty.passport_photo_name || (faculty.passport_photo && typeof faculty.passport_photo === 'string' ? faculty.passport_photo.split('/').pop() : ''),
  };
  validation.errors = {};
};

const openEditFacultyModal = (faculty) => {
  modalMode.value = 'edit';
  populateFormForModal(faculty);
  isModalVisible.value = true;
};

const openViewFacultyModal = (faculty) => {
  modalMode.value = 'view';
  populateFormForModal(faculty);
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  // Delay reset to allow modal fade-out animation
  setTimeout(() => {
    resetForm();
    modalMode.value = null;
  }, 300);
};


const handleFacultyTypeChange = () => {
  // Preserve only very basic fields if needed, or reset more thoroughly
  const { designation, date_of_joining, faculty_type: newFacultyType, staff_name, identifier } = form.value;
  resetForm(); // Resets to initialFormState which is mostly empty

  form.value = {
    ...initialFormState(), // Start fresh
    // Restore a few potentially common fields if desired, or let user re-enter
    staff_name,
    identifier,
    designation,
    date_of_joining: date_of_joining || new Date().toISOString().split('T')[0],
    faculty_type: newFacultyType,
    // ** MODIFIED: Initialize education_details with correct new fields **
    education_details: newFacultyType === 'academic' ? [{ qualification_type_id: '', qualification_id: '', institute: '', year_of_completion: '' }] : [],
  };
  validation.errors = {}; // Clear errors as the form structure changes
};


const saveFaculty = async () => {
  console.log('Current form state before validation:', JSON.parse(JSON.stringify(form.value)));
  if (!validateForm()) {
    console.log('Client-side validation failed. Errors:', JSON.parse(JSON.stringify(validation.errors)));
    showNotification('error', 'Validation Error', 'Please check the form for errors and try again.');
    return;
  }
  console.log('Client-side validation passed.');

  if (!institutePk.value) {
    showNotification('error', 'Configuration Error', 'Institute not identified. Cannot save faculty.', 0);
    console.error("Institute PK is missing. Aborting saveFaculty.");
    return;
  }

  isSavingFaculty.value = true;
  const formDataPayload = new FormData();

  formDataPayload.append('institute', institutePk.value); // Add institute PK

  // Append fields carefully
  Object.keys(form.value).forEach(key => {
    const value = form.value[key];

    if (key === 'cv' || key === 'passport_photo') {
      if (value instanceof File) { // Only append if it's a new file
        formDataPayload.append(key, value, value.name);
      }
      // If not a File, it means either no file or existing file (don't send for existing, API handles it)
    } else if (key === 'education_details') {
      // Ensure education_details is an array and stringify it
      const eduDetailsToSend = (Array.isArray(value) ? value : []).map(edu => ({
          qualification_type_id: edu.qualification_type_id,
          qualification_id: edu.qualification_id,
          institute: edu.institute,
          year_of_completion: edu.year_of_completion
      }));
      formDataPayload.append(key, JSON.stringify(eduDetailsToSend));
    } else if (key === 'identifier') {
      // API expects 'faculty_id', and conditionally 'cid' or 'registration_no'
      if (value) formDataPayload.append('faculty_id', value); // General identifier
      if (form.value.faculty_type === 'medical' && value) {
        formDataPayload.append('registration_no', value);
      } else if (form.value.faculty_type === 'academic' && value) {
        formDataPayload.append('cid', value);
      }
    } else if (key === 'staff_name') {
      // API expects 'faculty_name'
      if (value) formDataPayload.append('faculty_name', value);
    } else if (key === 'application_profile_identifier' && form.value.faculty_type === 'medical' && value) {
      // API expects 'application_profile'
      formDataPayload.append('application_profile', value);
    }
    // Exclude id, file name placeholders, and null/undefined values unless specifically handled
    else if (!['id', 'cv_name', 'passport_photo_name', 'isDataFetched'].includes(key) && value !== null && value !== undefined && value !== '') {
      formDataPayload.append(key, value);
    }
  });

  // Ensure faculty_type is appended if it's set
  if (form.value.faculty_type && !formDataPayload.has('faculty_type')) {
      formDataPayload.append('faculty_type', form.value.faculty_type);
  }

  // Log FormData contents (for debugging)
  console.log('FormData to be sent:');
  for (let [key, value] of formDataPayload.entries()) {
    console.log(key, value);
  }


  try {
    if (modalMode.value === 'add') {
      await apiServices.createMhpcTeachingFaculty(formDataPayload);
      showNotification('success', 'Faculty Added', `${form.value.staff_name || 'New Faculty'} has been successfully added.`);
    } else if (modalMode.value === 'edit' && form.value.id) {
      // For PATCH/PUT, some backends don't like 'institute' to be sent again if it's not changeable
      // Or they might expect only changed fields for PATCH.
      // The current setup sends all fields. Adjust if your API is strict.
      // If 'institute' is on formDataPayload and shouldn't be for update, you might remove it:
      // if (formDataPayload.has('institute')) formDataPayload.delete('institute');
      await apiServices.updateMhpcTeachingFaculty(form.value.id, formDataPayload);
      showNotification('success', 'Faculty Updated', `${form.value.staff_name}'s information has been updated.`);
    }
    fetchFaculty(modalMode.value === 'add' ? 1 : currentPage.value); // Refresh list
    closeModal();
  } catch (error) {
    console.error('Error saving faculty:', error.response?.data || error.message || error);
    let userFriendlyMessage = 'An unexpected error occurred while saving.';
    if (error.response?.data) {
        const errorData = error.response.data;
        const serverErrors = {};
        let messages = [];

        // Iterate over errorData to build messages and map to form fields
        Object.entries(errorData).forEach(([field, msgs]) => {
            const fieldNameReadable = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const msgArray = Array.isArray(msgs) ? msgs : [msgs];
            const joinedMessages = msgArray.map(m => typeof m === 'object' ? JSON.stringify(m) : m).join(', ');

            if (field === 'faculty_name') serverErrors['staff_name'] = joinedMessages;
            else if (field === 'faculty_id' || field === 'registration_no' || field === 'cid') serverErrors['identifier'] = joinedMessages;
            else if (field === 'application_profile') serverErrors['application_profile_identifier'] = joinedMessages;
            else if (field === 'education_details' && Array.isArray(msgArray)) {
                // Handle nested errors for education_details
                msgArray.forEach((eduError, index) => {
                    if (typeof eduError === 'object' && eduError !== null) {
                        Object.entries(eduError).forEach(([eduField, eduMsgs]) => {
                            const eduMsgArray = Array.isArray(eduMsgs) ? eduMsgs : [eduMsgs];
                            const eduJoined = eduMsgArray.join(', ');
                            if (eduField === 'qualification_type_id') serverErrors[`edu_qualification_type_${index}`] = eduJoined;
                            else if (eduField === 'qualification_id') serverErrors[`edu_qualification_name_${index}`] = eduJoined;
                            else serverErrors[`edu_${eduField}_${index}`] = eduJoined;
                            messages.push(`${fieldNameReadable} #${index + 1} ${eduField.replace(/_/g, ' ')}: ${eduJoined}`);
                        });
                    }
                });
            }
             else {
                 serverErrors[field] = joinedMessages; // Map other errors directly
            }
            if (field !== 'education_details') { // Avoid duplicating education detail messages
                messages.push(`${fieldNameReadable}: ${joinedMessages}`);
            }
        });
        validation.errors = { ...validation.errors, ...serverErrors };
        userFriendlyMessage = messages.join(' \n') || 'Please check the highlighted fields for errors.';
        if (messages.length === 0 && errorData.detail) { // Fallback for general detail error
            userFriendlyMessage = errorData.detail;
        }
    } else if (error.message) {
        userFriendlyMessage = error.message;
    }
    showNotification('error', 'Save Failed', userFriendlyMessage, 10000);
  } finally {
    isSavingFaculty.value = false;
  }
};


const confirmDelete = (faculty) => {
  facultyToDelete.value = faculty;
  showDeleteModal.value = true;
};

const deleteFaculty = async () => {
  if (!facultyToDelete.value || !facultyToDelete.value.id) return;
  isDeletingFaculty.value = true;
  try {
    await apiServices.deleteMhpcTeachingFaculty(facultyToDelete.value.id);
    showNotification('success', 'Faculty Deleted', `${facultyToDelete.value.staff_name} has been successfully deleted.`);
    // Optimistic UI update or fetch
    const newTotal = totalFaculty.value - 1;
    const newTotalPages = Math.ceil(newTotal / pageSize.value);

    if (facultyList.value.length === 1 && currentPage.value > 1 && currentPage.value > newTotalPages) {
      // If last item on a page (and not the first page), go to previous page
      fetchFaculty(currentPage.value - 1);
    } else {
      // Otherwise, refresh current page
      fetchFaculty(currentPage.value);
    }
    showDeleteModal.value = false;
    facultyToDelete.value = null;
  } catch (error) {
    console.error('Error deleting faculty:', error);
    showNotification('error', 'Delete Failed', `Failed to delete ${facultyToDelete.value.staff_name}.`);
  } finally {
    isDeletingFaculty.value = false;
  }
};


const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeoutId) clearTimeout(notification.value.timeoutId);
  notification.value = { show: true, type, title, message, timeoutId: null };

  // Auto-close logic
  if (duration > 0 && type !== 'error') { // Standard duration for non-errors
    notification.value.timeoutId = setTimeout(closeNotification, duration);
  } else if (duration > 0 && type === 'error') { // Potentially longer for errors, ensure it's at least a good amount
    notification.value.timeoutId = setTimeout(closeNotification, Math.max(duration, 10000)); // e.g. 10 seconds for errors
  }
  // If duration is 0 or less, it won't auto-close (e.g., for critical system errors)
};


const closeNotification = () => {
  notification.value.show = false;
  if (notification.value.timeoutId) {
    clearTimeout(notification.value.timeoutId);
    notification.value.timeoutId = null;
  }
};

watch(searchQuery, () => {
  currentPage.value = 1; // Reset to first page on new search
  fetchFaculty(1);
});


onMounted(async () => {
  await fetchInstitutePk(); // Ensure PK is available
  // Dropdown options are fetched by child components now
  if (institutePk.value) { // Only fetch faculty if institute is identified
    fetchFaculty();
  } else {
    isLoading.value = false; // Stop loading if institute cannot be identified
    // Notification about missing institute PK is handled in fetchInstitutePk
  }
});

</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input, .form-select { @apply block w-full rounded-md border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-150; }
.btn { @apply inline-flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-primary { @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500; }
.btn-outline { @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500; }
.btn-danger { @apply border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500; }
/* .btn-secondary { @apply border-transparent bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500; } */
.table-header-cell { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 select-none; }

.notification-slide-enter-active,
.notification-slide-leave-active { @apply transition-all duration-500 ease-out; }
.notification-slide-enter-from { @apply opacity-0 translate-x-full -translate-y-2 scale-95; }
.notification-slide-leave-to { @apply opacity-0 translate-x-full translate-y-2 scale-95; }

.modal-fade-enter-active,
.modal-fade-leave-active { @apply transition-all duration-300 ease-in-out; }
.modal-fade-enter-from,
.modal-fade-leave-to { @apply opacity-0; }
.modal-fade-enter-from .relative[role="dialog"],
.modal-fade-leave-to .relative[role="dialog"] { @apply scale-95 translate-y-5; }

.modal-enter-active, .modal-leave-active { @apply transition-opacity duration-300 ease-out; }
.modal-enter-from, .modal-leave-to { @apply opacity-0; }
.modal-enter-active .relative[role="dialog"], .modal-leave-active .relative[role="dialog"] { @apply transition-all duration-300 ease-out; }
.modal-enter-from .relative[role="dialog"], .modal-leave-to .relative[role="dialog"] { @apply opacity-0 scale-95 translate-y-4; }

.loader {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  /* Removed width and height, should be controlled by parent or specific usage */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>