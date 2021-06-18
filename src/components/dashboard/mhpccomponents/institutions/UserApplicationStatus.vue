<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">MHPC Application Dashboard</h1>

    <!-- Filters -->
    <div class="mb-6 bg-white shadow-md rounded-lg p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <input
          v-model="filters.cid"
          placeholder="Filter by CID"
          class="border rounded-md p-2 flex-1"
        />
        <input
          v-model="filters.instituteName"
          placeholder="Filter by Institute Name"
          class="border rounded-md p-2 flex-1"
        />
        <select v-model="filters.status" class="border rounded-md p-2">
          <option value="">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button
          @click="fetchApplications"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center text-gray-600">Loading applications...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>

    <!-- Applications List -->
    <div v-else-if="applications.length" class="space-y-6">
      <div v-for="app in applications" :key="app.id" class="bg-white shadow-md rounded-lg p-6">
        <!-- Institute Details -->
        <div class="mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-700">{{ app.name_of_institution }}</h2>
            <div>
              <button
                @click="editInstitute(app)"
                class="text-blue-600 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteInstitute(app.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
          <p class="text-gray-600">Applicant: {{ app.full_name }} (CID: {{ app.CID }})</p>
          <p class="text-gray-600">Location: {{ app.village }}, {{ app.gewog }}, {{ app.dzongkhag }}, {{ app.country }}</p>
          <p class="text-gray-600">Contact: {{ app.contact_no }} | {{ app.email_address }}</p>
          <p class="text-gray-600">Website: <a :href="app.website" target="_blank" class="text-blue-600 hover:underline">{{ app.website }}</a></p>
          <p class="text-gray-600">Head: {{ app.head_of_institution_name }} ({{ app.head_of_institution_gender }})</p>
          <p :class="app.do_dpr_review_decision === 'Approved' ? 'text-green-600' : 'text-red-600'">
            Status: {{ app.do_dpr_review_decision }}
          </p>
          <p class="text-gray-600">Payment: {{ app.is_payment_complete ? 'Complete' : 'Pending' }}</p>
          <p class="text-gray-600">Validity: {{ formatDate(app.valid_since) }} - {{ formatDate(app.valid_till) }}</p>
        </div>

        <!-- Programs Offered -->
        <div v-if="app.programs_offered_by_institute.length" class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-semibold text-gray-700">Programs Offered</h3>
            <button
              @click="openProgramModal(app.id)"
              class="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
            >
              Add Program
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="program in app.programs_offered_by_institute" :key="program.id" class="bg-gray-50 p-4 rounded-md">
              <p class="font-medium text-gray-700">{{ program.specific_program_title }} ({{ program.program_master.program_name }})</p>
              <p class="text-gray-600">Duration: {{ program.program_master.duration_years }} years</p>
              <p class="text-gray-600">Status: {{ program.status }}</p>
              <p class="text-gray-600">Payment: {{ program.is_payment_complete ? 'Complete' : 'Pending' }}</p>
              <a v-if="program.curriculum_document" :href="program.curriculum_document" target="_blank" class="text-blue-600 hover:underline">View Curriculum</a>
              <div class="mt-2">
                <button
                  @click="editProgram(program)"
                  class="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  @click="deleteProgram(program.id)"
                  class="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">No programs offered.</p>

        <!-- Teaching Centers -->
        <div v-if="app.teaching_centers.length" class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-semibold text-gray-700">Teaching Centers</h3>
            <button
              @click="openCenterModal(app.id)"
              class="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
            >
              Add Center
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="center in app.teaching_centers" :key="center.id" class="bg-gray-50 p-4 rounded-md">
              <p class="font-medium text-gray-700">{{ center.center_name }}</p>
              <p class="text-gray-600">Location: {{ center.center_location }}, {{ center.city_gewog }}, {{ center.state_dzongkhag }}</p>
              <p class="text-gray-600">Status: {{ center.tc_review_decision_display }}</p>
              <p class="text-gray-600">Physical Verification: {{ center.physical_verification_status_display }}</p>
              <p class="text-gray-600">Payment: {{ center.is_payment_complete ? 'Complete' : 'Pending' }}</p>
              <p class="text-gray-600">Validity: {{ formatDate(center.valid_since) }} - {{ formatDate(center.valid_till) }}</p>
              <a v-if="center.tc_report" :href="center.tc_report" target="_blank" class="text-blue-600 hover:underline">View Report</a>
              <div class="mt-2">
                <button
                  @click="editCenter(center)"
                  class="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  @click="deleteCenter(center.id)"
                  class="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-600">No teaching centers.</p>

        <!-- Teaching Hospitals -->
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Teaching Hospitals</h3>
          <p class="text-gray-600">No teaching hospitals registered.</p>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-600">No applications found.</p>

    <!-- Pagination -->
    <div v-if="pagination.next || pagination.previous" class="mt-6 flex justify-between">
      <button
        v-if="pagination.previous"
        @click="fetchApplications(pagination.previous)"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Previous
      </button>
      <button
        v-if="pagination.next"
        @click="fetchApplications(pagination.next)"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Next
      </button>
    </div>

    <!-- Modals for CRUD Operations -->
    <!-- Institute Modal -->
    <div v-if="showInstituteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">{{ editingInstitute ? 'Edit Institute' : 'Create Institute' }}</h2>
        <form @submit.prevent="saveInstitute">
          <input v-model="instituteForm.name_of_institution" placeholder="Institute Name" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="instituteForm.full_name" placeholder="Applicant Name" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="instituteForm.CID" placeholder="CID" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="instituteForm.email_address" placeholder="Email" class="border rounded-md p-2 w-full mb-2" type="email" required />
          <input v-model="instituteForm.contact_no" placeholder="Contact Number" class="border rounded-md p-2 w-full mb-2" required />
          <div class="flex justify-end gap-2">
            <button type="button" @click="showInstituteModal = false" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Program Modal -->
    <div v-if="showProgramModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">{{ editingProgram ? 'Edit Program' : 'Add Program' }}</h2>
        <form @submit.prevent="saveProgram">
          <input v-model="programForm.specific_program_title" placeholder="Program Title" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="programForm.program_master.program_name" placeholder="Program Name" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="programForm.program_master.duration_years" placeholder="Duration (Years)" class="border rounded-md p-2 w-full mb-2" type="number" required />
          <div class="flex justify-end gap-2">
            <button type="button" @click="showProgramModal = false" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Teaching Center Modal -->
    <div v-if="showCenterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">{{ editingCenter ? 'Edit Teaching Center' : 'Add Teaching Center' }}</h2>
        <form @submit.prevent="saveCenter">
          <input v-model="centerForm.center_name" placeholder="Center Name" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="centerForm.center_location" placeholder="Location" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="centerForm.city_gewog" placeholder="City/Gewog" class="border rounded-md p-2 w-full mb-2" required />
          <input v-model="centerForm.state_dzongkhag" placeholder="State/Dzongkhag" class="border rounded-md p-2 w-full mb-2" required />
          <div class="flex justify-end gap-2">
            <button type="button" @click="showCenterModal = false" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiServices from '@/services/services';

const applications = ref([]);
const pagination = ref({ next: null, previous: null });
const loading = ref(true);
const error = ref(null);
const filters = ref({ cid: '', instituteName: '', status: '' });

const showInstituteModal = ref(false);
const showProgramModal = ref(false);
const showCenterModal = ref(false);
const editingInstitute = ref(null);
const editingProgram = ref(null);
const editingCenter = ref(null);

const instituteForm = ref({
  name_of_institution: '',
  full_name: '',
  CID: '',
  email_address: '',
  contact_no: '',
});
const programForm = ref({
  institute: null,
  specific_program_title: '',
  program_master: { program_name: '', duration_years: 0 },
});
const centerForm = ref({
  institute: null,
  center_name: '',
  center_location: '',
  city_gewog: '',
  state_dzongkhag: '',
});

const fetchApplications = async (url = null) => {
  loading.value = true;
  try {
    const params = {};
    if (filters.value.cid) params.cid = filters.value.cid;
    if (filters.value.instituteName) params.name_of_institution = filters.value.instituteName;
    if (filters.value.status) params.do_dpr_review_decision = filters.value.status;

    const response = url
      ? await apiServices.getMhpcCogsWithUrl(url)
      : await apiServices.getMhpcCogs(params);
    applications.value = response.data.results;
    pagination.value = { next: response.data.next, previous: response.data.previous };
  } catch (err) {
    error.value = 'Failed to load applications. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
};

const editInstitute = (app) => {
  editingInstitute.value = app;
  instituteForm.value = {
    name_of_institution: app.name_of_institution,
    full_name: app.full_name,
    CID: app.CID,
    email_address: app.email_address,
    contact_no: app.contact_no,
  };
  showInstituteModal.value = true;
};

const saveInstitute = async () => {
  try {
    if (editingInstitute.value) {
      await apiServices.updateMhpcCogs(editingInstitute.value.id, instituteForm.value);
    } else {
      await apiServices.createMhpcCogs(instituteForm.value);
    }
    showInstituteModal.value = false;
    instituteForm.value = { name_of_institution: '', full_name: '', CID: '', email_address: '', contact_no: '' };
    editingInstitute.value = null;
    await fetchApplications();
  } catch (err) {
    error.value = 'Failed to save institute. Please try again.';
    console.error(err);
  }
};

const deleteInstitute = async (id) => {
  if (confirm('Are you sure you want to delete this institute?')) {
    try {
      await apiServices.deleteMhpcCogs(id);
      await fetchApplications();
    } catch (err) {
      error.value = 'Failed to delete institute. Please try again.';
      console.error(err);
    }
  }
};

const openProgramModal = (instituteId) => {
  programForm.value.institute = instituteId;
  programForm.value.specific_program_title = '';
  programForm.value.program_master = { program_name: '', duration_years: 0 };
  editingProgram.value = null;
  showProgramModal.value = true;
};

const editProgram = (program) => {
  editingProgram.value = program;
  programForm.value = {
    institute: program.institute.id,
    specific_program_title: program.specific_program_title,
    program_master: { ...program.program_master },
  };
  showProgramModal.value = true;
};

const saveProgram = async () => {
  try {
    if (editingProgram.value) {
      await apiServices.updateMhpcProgramOffered(editingProgram.value.id, programForm.value);
    } else {
      await apiServices.createMhpcProgramOffered(programForm.value);
    }
    showProgramModal.value = false;
    programForm.value = { institute: null, specific_program_title: '', program_master: { program_name: '', duration_years: 0 } };
    editingProgram.value = null;
    await fetchApplications();
  } catch (err) {
    error.value = 'Failed to save program. Please try again.';
    console.error(err);
  }
};

const deleteProgram = async (id) => {
  if (confirm('Are you sure you want to delete this program?')) {
    try {
      await apiServices.deleteMhpcProgramOffered(id);
      await fetchApplications();
    } catch (err) {
      error.value = 'Failed to delete program. Please try again.';
      console.error(err);
    }
  }
};

const openCenterModal = (instituteId) => {
  centerForm.value.institute = instituteId;
  centerForm.value.center_name = '';
  centerForm.value.center_location = '';
  centerForm.value.city_gewog = '';
  centerForm.value.state_dzongkhag = '';
  editingCenter.value = null;
  showCenterModal.value = true;
};

const editCenter = (center) => {
  editingCenter.value = center;
  centerForm.value = {
    institute: center.institute,
    center_name: center.center_name,
    center_location: center.center_location,
    city_gewog: center.city_gewog,
    state_dzongkhag: center.state_dzongkhag,
  };
  showCenterModal.value = true;
};

const saveCenter = async () => {
  try {
    if (editingCenter.value) {
      await apiServices.updateMhpcTeachingCenter(editingCenter.value.id, centerForm.value);
    } else {
      await apiServices.createMhpcTeachingCenter(centerForm.value);
    }
    showCenterModal.value = false;
    centerForm.value = { institute: null, center_name: '', center_location: '', city_gewog: '', state_dzongkhag: '' };
    editingCenter.value = null;
    await fetchApplications();
  } catch (err) {
    error.value = 'Failed to save teaching center. Please try again.';
    console.error(err);
  }
};

const deleteCenter = async (id) => {
  if (confirm('Are you sure you want to delete this teaching center?')) {
    try {
      await apiServices.deleteMhpcTeachingCenter(id);
      await fetchApplications();
    } catch (err) {
      error.value = 'Failed to delete teaching center. Please try again.';
      console.error(err);
    }
  }
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
/* Tailwind handles most styling, but you can add custom scoped styles if needed */
</style>