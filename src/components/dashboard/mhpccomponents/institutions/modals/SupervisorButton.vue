<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Add Supervisor</h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="(supervisor, index) in supervisors" :key="index" class="mb-6 border-b pb-4">
          <div class="mb-4">
            <label for="regNo" class="block text-sm font-semibold text-gray-700 mb-2">Reg No</label>
            <input
              type="text"
              id="regNo"
              v-model="supervisor.regNo"
              @input="fetchProfessionalDetails(index)"
              required
              class="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
              placeholder="Enter Reg No"
              list="regNoOptions"
            />
            <datalist id="regNoOptions">
              <option v-for="pro in activeProfessionals" :key="pro.reg_no" :value="pro.reg_no">
                {{ pro.reg_no }} ({{ pro.full_name }})
              </option>
            </datalist>
          </div>
          <div class="mb-4">
            <label for="cid" class="block text-sm font-semibold text-gray-700 mb-2">CID</label>
            <input
              type="text"
              id="cid"
              v-model="supervisor.cid"
              @input="fetchProfessionalDetails(index)"
              required
              class="block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
              placeholder="Enter CID"
            />
          </div>
          <div class="mb-4">
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              v-model="supervisor.name"
              disabled
              class="block w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 text-sm"
              placeholder="Auto-filled"
            />
          </div>
          <div class="mb-4">
            <label for="qualification" class="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
            <input
              type="text"
              id="qualification"
              v-model="supervisor.qualification"
              disabled
              class="block w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 text-sm"
              placeholder="Auto-filled"
            />
          </div>
          <button
            v-if="index > 0"
            type="button"
            @click="removeSupervisor(index)"
            class="px-3 py-1 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors text-sm"
          >
            Remove
          </button>
        </div>
        <button
          type="button"
          @click="addSupervisor"
          class="w-full px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 transition-colors mb-4"
        >
          Add More
        </button>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
          >
            Save Supervisors
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiServices from '@/services/services';

// Props
const props = defineProps({
  applicationId: {
    type: Number,
    required: true,
  },
});

// Emits
const emit = defineEmits(['close', 'submit-success']);

// State
const supervisors = ref([{ regNo: '', cid: '', name: '', qualification: '' }]);
const activeProfessionals = ref([]);

// Fetch active professionals on mount
const fetchActiveProfessionals = async () => {
  try {
    const response = await apiServices.getActiveProfessionals(); // Assumed endpoint
    activeProfessionals.value = response.data || [];
  } catch (error) {
    console.error('Error fetching active professionals:', error.response?.data || error.message);
    alert('Failed to load active professionals.');
  }
};

// Fetch professional details based on CID or Reg No
const fetchProfessionalDetails = async (index) => {
  const supervisor = supervisors.value[index];
  if (!supervisor.regNo && !supervisor.cid) {
    supervisor.name = '';
    supervisor.qualification = '';
    return;
  }
  try {
    const response = await apiServices.getProfessionalDetails({
      reg_no: supervisor.regNo || '',
      cid: supervisor.cid || '',
    });
    const details = response.data;
    supervisor.name = details.full_name || '';
    supervisor.qualification = details.qualification || '';
  } catch (error) {
    console.error('Error fetching professional details:', error.response?.data || error.message);
    supervisor.name = 'Not found';
    supervisor.qualification = 'Not found';
    alert('Failed to fetch professional details. Please check CID or Reg No.');
  }
};

// Add a new supervisor form
const addSupervisor = () => {
  supervisors.value.push({ regNo: '', cid: '', name: '', qualification: '' });
};

// Remove a supervisor form
const removeSupervisor = (index) => {
  supervisors.value.splice(index, 1);
};

// Handle form submission
const handleSubmit = async () => {
  const validSupervisors = supervisors.value.filter(s => s.name && s.qualification);
  if (validSupervisors.length === 0) {
    alert('Please add at least one valid supervisor.');
    return;
  }
  try {
    for (const supervisor of validSupervisors) {
      await apiServices.addSupervisor({
        name: supervisor.name,
        email: '', // Placeholder, update if email is required
        contact: '', // Placeholder, update if contact is required
        teaching_center_id: props.applicationId,
        reg_no: supervisor.regNo,
        cid: supervisor.cid,
        qualification: supervisor.qualification,
      });
    }
    emit('submit-success', 'Supervisors added successfully!');
    closeModal();
  } catch (error) {
    console.error('Error adding supervisors:', error.response?.data || error.message);
    alert('Failed to add supervisors. Please try again.');
  }
};

// Close modal and reset form
const closeModal = () => {
  supervisors.value = [{ regNo: '', cid: '', name: '', qualification: '' }];
  emit('close');
};

// Initialize data on mount
onMounted(() => {
  fetchActiveProfessionals();
});

// Watch for changes in regNo or cid to trigger fetching details
watch(
  () => supervisors.value,
  (newSupervisors) => {
    newSupervisors.forEach((supervisor, index) => {
      if (supervisor.regNo || supervisor.cid) {
        fetchProfessionalDetails(index);
      }
    });
  },
  { deep: true }
);
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>