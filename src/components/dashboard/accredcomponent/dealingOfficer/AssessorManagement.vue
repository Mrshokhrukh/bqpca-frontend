<template>
  <div class="container mx-auto px-4 sm:px-8">
    <div class="py-8">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Assessors Management</h2>
          <p class="text-gray-500 mt-1">Manage HEQC Assessors</p>
        </div>
        <div class="flex justify-end">
          <button @click="openAddModal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
            Add Assessor
          </button>
        </div>
      </div>

      <!-- Filter Input -->
      <div class="mb-4">
        <input
          type="text"
          v-model="filterText"
          placeholder="Filter assessors..."
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Qualification
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Specialisation
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="assessor in filteredAssessors" :key="assessor.cid" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-800">{{ assessor.cid }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-800">{{ assessor.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-800">{{ assessor.contactNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-800">{{ assessor.emailAddress }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-800">{{ assessor.qualification }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-800">{{ assessor.specialisation }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editAssessor(assessor)" class="text-indigo-600 hover:text-indigo-900 mr-2">
                    Edit
                  </button>
                  <button @click="viewAssessor(assessor)" class="text-blue-600 hover:text-blue-900 mr-2">
                    View
                  </button>
                  <button @click="deleteAssessor(assessor.cid)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredAssessors.length === 0 && assessors.length > 0" class="bg-white px-6 py-4 border-t border-gray-200 text-center">
            No assessors match your filter.
          </div>
          <div v-if="assessors.length === 0" class="bg-white px-6 py-4 border-t border-gray-200 text-center">
            No assessors added yet.
          </div>
        </div>
      </div>
    </div>

    <!-- Assessor Input Modal -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

        <!-- Modal Content -->
        <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveAssessor">
            <div class="bg-indigo-600 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">
                  {{ editingAssessor ? 'Edit Assessor' : 'Add New Assessor' }}
                </h3>
                <button @click="closeModal" type="button" class="text-white hover:text-gray-200 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-4">
              <!-- Personal Details Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3 text-left">Personal Details</h4> <!-- Added text-left -->
                <div class="grid grid-cols-1 gap-4"> <!-- Reduced gap for tighter layout -->
                  <div>
                    <label for="cid" class="block text-sm font-medium text-gray-700 text-left">CID</label> <!-- Added text-left -->
                    <input type="text" v-model="newAssessor.cid" id="cid" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"> <!-- Added text-left -->
                  </div>
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 text-left">Name</label> <!-- Added text-left -->
                    <input type="text" v-model="newAssessor.name" id="name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"> <!-- Added text-left -->
                  </div>
                </div>
              </div>

              <!-- Contact Information Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3 text-left">Contact Information</h4> <!-- Added text-left -->
                <div class="grid grid-cols-1 gap-4"> <!-- Reduced gap for tighter layout -->
                  <div>
                    <label for="contactNumber" class="block text-sm font-medium text-gray-700 text-left">Contact Number</label> <!-- Added text-left -->
                    <input type="text" v-model="newAssessor.contactNumber" id="contactNumber" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"> <!-- Added text-left -->
                  </div>
                  <div>
                    <label for="emailAddress" class="block text-sm font-medium text-gray-700 text-left">Email Address</label> <!-- Added text-left -->
                    <input type="email" v-model="newAssessor.emailAddress" id="emailAddress" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"> <!-- Added text-left -->
                  </div>
                </div>
              </div>

              <!-- Professional Details Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3 text-left">Professional Details</h4> <!-- Added text-left -->
                <div class="grid grid-cols-1 gap-4"> <!-- Reduced gap for tighter layout -->
                  <div>
                    <label for="qualification" class="block text-sm font-medium text-gray-700 text-left">Qualification</label> <!-- Added text-left -->
                    <select v-if="qualificationsList.length > 0" v-model="newAssessor.qualification" id="qualification" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"> <!-- Added text-left -->
                      <option value="">Select Qualification</option>
                      <option v-for="qual in qualificationsList" :key="qual" :value="qual">{{ qual }}</option>
                      <option value="other">Other (Specify)</option>
                    </select>
                    <input v-else type="text" v-model="newAssessor.qualification" id="qualification" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left" placeholder="Enter Qualification"> <!-- Added text-left -->
                    <input v-if="newAssessor.qualification === 'other'" type="text" v-model="newAssessor.otherQualification" placeholder="Specify Other Qualification" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"> <!-- Added text-left -->
                  </div>
                  <div>
                    <label for="specialisation" class="block text-sm font-medium text-gray-700 text-left">Relevant Experience/Specialisation</label> <!-- Added text-left -->
                    <textarea v-model="newAssessor.specialisation" id="specialisation" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left"></textarea> <!-- Added text-left -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="closeModal">
                Cancel
              </button>
              <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {{ editingAssessor ? 'Save Changes' : 'Save Assessor' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Assessor Modal -->
    <div v-if="isViewModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="view-modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeViewModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

        <!-- Modal Content -->
        <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-indigo-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-white" id="view-modal-title">
                View Assessor Details
              </h3>
              <button @click="closeViewModal" type="button" class="text-white hover:text-gray-200 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-4">
            <!-- Personal Details Card -->
            <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
              <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3 text-left">Personal Details</h4> <!-- Added text-left -->
              <div class="space-y-2 text-left"> <!-- Added text-left -->
                <div>
                  <p class="text-xs text-gray-500 text-left">CID</p> <!-- Added text-left -->
                  <p class="font-medium text-left">{{ viewedAssessor.cid }}</p> <!-- Added text-left -->
                </div>
                <div>
                  <p class="text-xs text-gray-500 text-left">Name</p> <!-- Added text-left -->
                  <p class="font-medium text-left">{{ viewedAssessor.name }}</p> <!-- Added text-left -->
                </div>
              </div>
            </div>

            <!-- Contact Information Card -->
            <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
              <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3 text-left">Contact Information</h4> <!-- Added text-left -->
              <div class="space-y-2 text-left"> <!-- Added text-left -->
                <div>
                  <p class="text-xs text-gray-500 text-left">Contact Number</p> <!-- Added text-left -->
                  <p class="font-medium text-left">{{ viewedAssessor.contactNumber || 'N/A' }}</p> <!-- Added text-left -->
                </div>
                <div>
                  <p class="text-xs text-gray-500 text-left">Email Address</p> <!-- Added text-left -->
                  <p class="font-medium text-left">{{ viewedAssessor.emailAddress || 'N/A' }}</p> <!-- Added text-left -->
                </div>
              </div>
            </div>

            <!-- Professional Details Card -->
            <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
              <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3 text-left">Professional Details</h4> <!-- Added text-left -->
              <div class="space-y-2 text-left"> <!-- Added text-left -->
                <div>
                  <p class="text-xs text-gray-500 text-left">Qualification</p> <!-- Added text-left -->
                  <p class="font-medium text-left">{{ viewedAssessor.qualification || 'N/A' }}</p> <!-- Added text-left -->
                </div>
                <div>
                  <p class="text-xs text-gray-500 text-left">Relevant Experience/Specialisation</p> <!-- Added text-left -->
                  <p class="font-medium text-left">{{ viewedAssessor.specialisation || 'N/A' }}</p> <!-- Added text-left -->
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end">
            <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="closeViewModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const assessors = ref([
  { cid: '12121212', name: 'Tenzin Wangchuk', contactNumber: '17XXXXXXX', emailAddress: 'tenzin@example.bt', qualification: 'PhD in Engineering', specialisation: 'Civil Engineering, Structural Design' },
  { cid: '34343434', name: 'Sonam Dema', contactNumber: '17YYYYYYY', emailAddress: 'sonam@example.bt', qualification: 'Master in Education', specialisation: 'Curriculum Development, Pedagogy' },
  { cid: '56565656', name: 'Jigme Dorji', contactNumber: '17ZZZZZZZ', emailAddress: 'jigme@example.bt', qualification: 'Bachelor in Computer Science', specialisation: 'Software Engineering, Database Management' },
]);

const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const newAssessor = ref({
  cid: '',
  name: '',
  contactNumber: '',
  emailAddress: '',
  qualification: '',
  otherQualification: '',
  specialisation: '',
});
const viewedAssessor = ref({});
const editingAssessor = ref(false);
const qualificationsList = ref(['PhD', 'Master', 'Bachelor', 'Diploma']);
const filterText = ref('');

const openAddModal = () => {
  editingAssessor.value = false;
  newAssessor.value = { cid: '', name: '', contactNumber: '', emailAddress: '', qualification: '', otherQualification: '', specialisation: '' };
  isModalOpen.value = true;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingAssessor.value = false;
  filterText.value = ''; // Clear filter when closing modal
};
const closeViewModal = () => {
  isViewModalOpen.value = false;
  viewedAssessor.value = {};
};

const saveAssessor = () => {
  if (editingAssessor.value) {
    const index = assessors.value.findIndex(assessor => assessor.cid === newAssessor.value.cid);
    if (index !== -1) {
      assessors.value.splice(index, 1, { ...newAssessor.value });
    }
    console.log('Assessor Updated:', newAssessor.value);
  } else {
    const qualificationToSave = newAssessor.value.qualification === 'other' ? newAssessor.value.otherQualification : newAssessor.value.qualification;
    const assessorToAdd = { ...newAssessor.value, qualification: qualificationToSave };
    assessors.value.push(assessorToAdd);
    console.log('New Assessor Saved:', assessorToAdd);
  }
  closeModal();
};

const editAssessor = (assessor) => {
  editingAssessor.value = true;
  newAssessor.value = { ...assessor, otherQualification: '' };
  if (!qualificationsList.value.includes(assessor.qualification) && assessor.qualification) {
      newAssessor.value.qualification = 'other';
      newAssessor.value.otherQualification = assessor.qualification;
  }
  openModal();
};
const viewAssessor = (assessor) => {
  viewedAssessor.value = { ...assessor };
  isViewModalOpen.value = true;
};

const deleteAssessor = (cid) => {
  if (confirm('Are you sure you want to delete this assessor?')) {
    assessors.value = assessors.value.filter(assessor => assessor.cid !== cid);
    console.log('Assessor Deleted:', cid);
  }
};

const filteredAssessors = computed(() => {
  const filter = filterText.value.toLowerCase();
  return assessors.value.filter(assessor => {
    return (
      assessor.name.toLowerCase().includes(filter) ||
      assessor.cid.toLowerCase().includes(filter) ||
      assessor.specialisation.toLowerCase().includes(filter) ||
      assessor.qualification.toLowerCase().includes(filter)
    );
  });
});
</script>