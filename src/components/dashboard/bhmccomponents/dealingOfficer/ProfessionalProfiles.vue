<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-md">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Search Records</h1>
        <p class="text-gray-600">Find and manage professional records within the system.</p>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div class="mb-4 flex justify-end">
          <button @click="resetFilters"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
            Reset Filters
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Registration Date Range -->
          <div>
            <label for="reg-from" class="block text-sm font-medium text-gray-700">Registration From</label>
            <div class="mt-1">
              <input id="reg-from" type="date" v-model="filters.regFrom"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>
          <div>
            <label for="reg-to" class="block text-sm font-medium text-gray-700">Registration To</label>
            <div class="mt-1">
              <input id="reg-to" type="date" v-model="filters.regTo"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>

          <!-- Search by Name -->
          <div>
            <label for="name-search" class="block text-sm font-medium text-gray-700">Search by Name</label>
            <div class="mt-1">
              <input id="name-search" type="text" v-model="filters.name"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter name...">
            </div>
          </div>

          <!-- CID/Work Permit/Passport No. -->
          <div>
            <label for="cid-search" class="block text-sm font-medium text-gray-700">CID/Work Permit/Passport No.</label>
            <div class="mt-1">
              <input id="cid-search" type="text" v-model="filters.cid"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter CID/Work Permit/Passport No....">
            </div>
          </div>

          <!-- Gender -->
          <div>
            <label for="gender-filter" class="block text-sm font-medium text-gray-700">Gender</label>
            <div class="mt-1">
              <select id="gender-filter" v-model="filters.gender"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="">All</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label for="category-filter" class="block text-sm font-medium text-gray-700">Category</label>
            <div class="mt-1">
              <select id="category-filter" v-model="filters.category"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="">All</option>
                <option>University</option>
                <option>Sector</option>
              </select>
            </div>
          </div>

          <!-- Sub Category -->
          <div>
            <label for="sub-category-filter" class="block text-sm font-medium text-gray-700">Sub Category</label>
            <div class="mt-1">
              <select id="sub-category-filter" v-model="filters.subCategory"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="">All</option>
                <option>Qualification Type</option>
              </select>
            </div>
          </div>

          <!-- Health Facility -->
          <div>
            <label for="health-facility-filter" class="block text-sm font-medium text-gray-700">Health Facility</label>
            <div class="mt-1">
              <select id="health-facility-filter" v-model="filters.healthFacility"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="">All</option>
                <option>Hospital</option>
                <option>Clinic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div class="bg-white rounded-xl shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Ref. No.
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Reg. Dt.
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Name
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  CID/Permit</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Gender
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Category
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Facility
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status
                </th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(record, index) in filteredRecords" :key="record.cid">
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatDate(record.regDate) }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 truncate">{{ record.name }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ record.cid }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ record.gender === 'M' ? 'Male' :
            'Female' }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ record.category }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 truncate">{{ record.healthFacility }}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm">
                  <span
                    :class="`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(record.status)}`">
                    {{ record.status }}
                  </span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm space-x-1">
                  <button @click="viewRecord(record)"
                    class="inline-flex items-center p-1 text-blue-600 hover:text-blue-800">
                    <span class="sr-only">View</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="editRecord(record)"
                    class="inline-flex items-center p-1 text-green-600 hover:text-green-800">
                    <span class="sr-only">Edit</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteRecord(record.cid)"
                    class="inline-flex items-center p-1 text-red-600 hover:text-red-800">
                    <span class="sr-only">Delete</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredRecords.length === 0" class="p-4 text-gray-500 text-center">
          No matching records found.
        </div>
      </div>

      <!-- View/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <span class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            @click="closeModal">×</span>
          <h2 class="text-xl font-bold text-gray-900 mb-4">{{ isEditing ? 'Edit Record' : 'View Record' }}</h2>
          <div v-if="selectedRecord" class="space-y-4">
            <div>
              <label for="modal-reg-date" class="block text-sm font-medium text-gray-700">Registration Date:</label>
              <div class="mt-1">
                <input id="modal-reg-date" type="date" v-model="selectedRecord.regDate" :readonly="!isEditing"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
              </div>
            </div>
            <div>
              <label for="modal-name" class="block text-sm font-medium text-gray-700">Full Name:</label>
              <div class="mt-1">
                <input id="modal-name" type="text" v-model="selectedRecord.name" :readonly="!isEditing"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
              </div>
            </div>
            <div>
              <label for="modal-cid" class="block text-sm font-medium text-gray-700">CID Number:</label>
              <div class="mt-1">
                <input id="modal-cid" type="text" v-model="selectedRecord.cid" :readonly="!isEditing"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
              </div>
            </div>
            <div>
              <label for="modal-gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <div class="mt-1">
                <select id="modal-gender" v-model="selectedRecord.gender" :disabled="!isEditing"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label for="modal-status" class="block text-sm font-medium text-gray-700">Status:</label>
              <div class="mt-1">
                <select id="modal-status" v-model="selectedRecord.status" :disabled="!isEditing"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Agreed</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button v-if="isEditing" @click="saveChanges"
                class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Save
                Changes</button>
              <button @click="closeModal"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface ProfessionalRecord {
  regDate: string;
  name: string;
  cid: string;
  gender: string;
  category: string;
  healthFacility: string;
  status: string;
}

const filters = ref({
  regFrom: '',
  regTo: '',
  name: '',
  cid: '',
  gender: '',
  category: '',
  subCategory: '',
  healthFacility: ''
});

const records = ref<ProfessionalRecord[]>([
  {
    regDate: '2023-01-05',
    name: 'Jampel Kuenga',
    cid: '11107000996',
    gender: 'M',
    category: 'University',
    healthFacility: 'National Hospital',
    status: 'Verified'
  },
  {
    regDate: '2023-02-10',
    name: 'Wangkok Dorji',
    cid: '10905001085',
    gender: 'M',
    category: 'Sector',
    healthFacility: 'Central Clinic',
    status: 'Pending'
  },
  {
    regDate: '2023-03-15',
    name: 'Takering Zangmo Tamang',
    cid: '11809000127',
    gender: 'F',
    category: 'University',
    healthFacility: 'Private Clinic',
    status: 'Agreed'
  },
  {
    regDate: '2023-04-20',
    name: 'Bodha Kumar Rai',
    cid: '11206001118',
    gender: 'M',
    category: 'Sector',
    healthFacility: 'Community Health Center',
    status: 'Verified'
  },
  {
    regDate: '2023-05-25',
    name: 'Pem Chezom',
    cid: '11308002635',
    gender: 'F',
    category: 'University',
    healthFacility: 'National Hospital',
    status: 'Agreed'
  },
  {
    regDate: '2023-06-01',
    name: 'Yangchen Lhamo',
    cid: '1151404502',
    gender: 'F',
    category: 'Sector',
    healthFacility: 'Central Clinic',
    status: 'Pending'
  },
  {
    regDate: '2023-07-07',
    name: 'Soman Yangchen',
    cid: '10709005003',
    gender: 'F',
    category: 'University',
    healthFacility: 'Private Clinic',
    status: 'Verified'
  },
  {
    regDate: '2023-08-15',
    name: 'Daw Doji Doya',
    cid: '11206003641',
    gender: 'M',
    category: 'Sector',
    healthFacility: 'Community Health Center',
    status: 'Agreed'
  },
  {
    regDate: '2023-09-20',
    name: 'Kinley Wangmo',
    cid: '11911004567',
    gender: 'F',
    category: 'University',
    healthFacility: 'National Hospital',
    status: 'Pending'
  },
  {
    regDate: '2023-10-25',
    name: 'Tshewang Norbu',
    cid: '12012005555',
    gender: 'M',
    category: 'Sector',
    healthFacility: 'Central Clinic',
    status: 'Verified'
  },
  {
    regDate: '2023-11-30',
    name: 'Dechen Zangmo',
    cid: '12113006666',
    gender: 'F',
    category: 'University',
    healthFacility: 'Private Clinic',
    status: 'Agreed'
  },
  {
    regDate: '2023-12-05',
    name: 'Karma Dorji',
    cid: '12214007777',
    gender: 'M',
    category: 'Sector',
    healthFacility: 'Community Health Center',
    status: 'Pending'
  },
  {
    regDate: '2024-01-10',
    name: 'Sonam Choden',
    cid: '12315008888',
    gender: 'F',
    category: 'University',
    healthFacility: 'National Hospital',
    status: 'Verified'
  },
  {
    regDate: '2024-02-15',
    name: 'Nima Wangchuk',
    cid: '12416009999',
    gender: 'M',
    category: 'Sector',
    healthFacility: 'Central Clinic',
    status: 'Verified'
  }
]);

const showModal = ref(false);
const isEditing = ref(false);
const selectedRecord = ref<ProfessionalRecord | null>(null);

const filteredRecords = computed(() => {
  return records.value.filter(record => {
    const regDate = new Date(record.regDate);
    const from = filters.value.regFrom ? new Date(filters.value.regFrom) : null;
    const to = filters.value.regTo ? new Date(filters.value.regTo) : null;

    return (
      (!from || regDate >= from) &&
      (!to || regDate <= to) &&
      (!filters.value.name || record.name.toLowerCase().includes(filters.value.name.toLowerCase())) &&
      (!filters.value.cid || record.cid.includes(filters.value.cid)) &&
      (!filters.value.gender || record.gender === filters.value.gender) &&
      (!filters.value.category || record.category === filters.value.category) &&
      (!filters.value.healthFacility || record.healthFacility === filters.value.healthFacility)
    );
  });
});

const statusClass = (status: string) => ({
  'bg-green-100 text-green-800': status === 'Verified',
  'bg-yellow-100 text-yellow-800': status === 'Pending',
  'bg-blue-100 text-blue-800': status === 'Agreed'
});

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Filter reset functionality
const resetFilters = () => {
  filters.value = {
    regFrom: '',
    regTo: '',
    name: '',
    cid: '',
    gender: '',
    category: '',
    subCategory: '',
    healthFacility: ''
  };
};

const viewRecord = (record: ProfessionalRecord) => {
  selectedRecord.value = { ...record };
  isEditing.value = false;
  showModal.value = true;
};

const editRecord = (record: ProfessionalRecord) => {
  selectedRecord.value = { ...record };
  isEditing.value = true;
  showModal.value = true;
};

const deleteRecord = (cid: string) => {
  if (confirm('Are you sure you want to delete this record?')) {
    records.value = records.value.filter(record => record.cid !== cid);
  }
};

const saveChanges = () => {
  if (selectedRecord.value) {
    const index = records.value.findIndex(r => r.cid === selectedRecord.value?.cid);
    if (index !== -1) {
      records.value[index] = { ...selectedRecord.value };
    }
    closeModal();
  }
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  selectedRecord.value = null;
};
</script>
