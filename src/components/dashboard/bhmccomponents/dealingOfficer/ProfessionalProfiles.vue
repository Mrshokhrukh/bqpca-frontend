<template>
  <div class="container">
    <h1>Search Records</h1>
    
    <!-- Search Filters -->
    <div class="filters-section">
      <div class="filter-actions">
        <button class="reset-btn" @click="resetFilters">Reset Filters</button>
      </div>
      
      <div class="filter-row">
        <div class="filter-group">
          <label>Registration From</label>
          <input type="date" v-model="filters.regFrom">
        </div>
        <div class="filter-group">
          <label>Registration To</label>
          <input type="date" v-model="filters.regTo">
        </div>
        <div class="filter-group">
          <label>Search by name</label>
          <input type="text" v-model="filters.name">
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-group">
          <label>CID/Work Permit/Passport No.</label>
          <input type="text" v-model="filters.cid">
        </div>
        <div class="filter-group">
          <label>GENDER</label>
          <select v-model="filters.gender">
            <option value="">All</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      <div class="category-filters">
        <div class="filter-group">
          <label>CATEGORY</label>
          <select v-model="filters.category">
            <option value="">All</option>
            <option>University</option>
            <option>Sector</option>
          </select>
        </div>
        <div class="filter-group">
          <label>SUB CATEGORY</label>
          <select v-model="filters.subCategory">
            <option value="">All</option>
            <option>Qualification Type</option>
          </select>
        </div>
        <div class="filter-group">
          <label>HEALTH FACILITY</label>
          <select v-model="filters.healthFacility">
            <option value="">All</option>
            <option>Hospital</option>
            <option>Clinic</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results Table -->
    <table class="records-table">
      <thead>
        <tr>
          <th>REF. No.</th>
          <th>Reg. Dt.</th>
          <th>Personnel Name</th>
          <th>CID/Work Permit/Passport No.</th>
          <th>Gender</th>
          <th>Category</th>
          <th>Health Facility</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in filteredRecords" :key="record.cid">
          <td>{{ index + 1 }}</td>
          <td>{{ formatDate(record.regDate) }}</td>
          <td>{{ record.name }}</td>
          <td>{{ record.cid }}</td>
          <td>{{ record.gender }}</td>
          <td>{{ record.category }}</td>
          <td>{{ record.healthFacility }}</td>
          <td :class="statusClass(record.status)">{{ record.status }}</td>
          <td>
            <button class="view-btn" @click="viewRecord(record)">View</button>
            <button class="edit-btn" @click="editRecord(record)">✓ Edit</button>
            <button class="delete-btn" @click="deleteRecord(record.cid)">✗ Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- View/Edit Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ isEditing ? 'Edit Record' : 'View Record' }}</h2>
        <div v-if="selectedRecord" class="modal-fields">
          <div class="modal-field">
            <label>Registration Date:</label>
            <input v-model="selectedRecord.regDate" type="date" :readonly="!isEditing">
          </div>
          <div class="modal-field">
            <label>Full Name:</label>
            <input v-model="selectedRecord.name" :readonly="!isEditing">
          </div>
          <div class="modal-field">
            <label>CID Number:</label>
            <input v-model="selectedRecord.cid" :readonly="!isEditing">
          </div>
          <div class="modal-field">
            <label>Gender:</label>
            <select v-model="selectedRecord.gender" :disabled="!isEditing">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div class="modal-field">
            <label>Status:</label>
            <select v-model="selectedRecord.status" :disabled="!isEditing">
              <option>Verified</option>
              <option>Pending</option>
              <option>Agreed</option>
            </select>
          </div>
          <div v-if="isEditing" class="modal-actions">
            <button class="save-btn" @click="saveChanges">Save Changes</button>
            <button class="cancel-btn" @click="closeModal">Cancel</button>
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
      (!filters.value.gender || record.gender === filters.value.gender.charAt(0)) &&
      (!filters.value.category || record.category === filters.value.category) &&
      (!filters.value.healthFacility || record.healthFacility === filters.value.healthFacility)
    );
  });
});

const statusClass = (status: string) => ({
  'verified': status === 'Verified',
  'pending': status === 'Pending',
  'agreed': status === 'Agreed'
});

const formatDate = (dateString: string) => {
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

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filters-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-actions {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-end;
}

.reset-btn {
  background-color: #666;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #555;
}

.filter-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.category-filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.filter-group input, 
.filter-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-top: 20px;
}

.records-table th, 
.records-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.records-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  margin: 2px;
  cursor: pointer;
  color: white;
}

.view-btn { background-color: #4CAF50; }
.edit-btn { background-color: #2196F3; }
.delete-btn { background-color: #f44336; }

.verified { color: #4CAF50; font-weight: bold; }
.pending { color: #FF9800; font-weight: bold; }
.agreed { color: #2196F3; font-weight: bold; }

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 500px;
  position: relative;
}

.close {
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 28px;
  cursor: pointer;
  color: #666;
}

.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.modal-field label {
  font-weight: 500;
  color: #444;
}

.modal-field input,
.modal-field select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn {
  background-color: #4CAF50;
  padding: 8px 20px;
}

.cancel-btn {
  background-color: #666;
  padding: 8px 20px;
}
</style>