<template>
  <div class="schedule-management container mx-auto mt-8 p-6 bg-gray-50 shadow-lg rounded-lg">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-semibold text-blue-700">Accreditation Schedule Management</h3>
      <button
        @click="openScheduleModal()"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2">
          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
        Add New Schedule
      </button>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="text-center my-10">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      <p class="mt-3 text-gray-600">Loading schedules...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Table of Schedules -->
    <div v-if="!isLoading && schedules.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Currently Running</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="schedule in schedules" :key="schedule.id" class="hover:bg-gray-50" :class="{'bg-blue-50': isCurrentlyActive(schedule) && schedule.is_active}">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ schedule.schedule_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(schedule.from_date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(schedule.end_date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  schedule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                ]"
              >
                {{ schedule.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <svg v-if="isCurrentlyActive(schedule) && schedule.is_active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-green-500 inline-block" title="Currently Running & Active">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.002-5.5a.75.75 0 00-.326-1.061z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="isCurrentlyActive(schedule) && !schedule.is_active" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-yellow-500 inline-block" title="Within Date Range but Inactive">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 5.168A.75.75 0 008 5.75v3.493l.149-.065a.75.75 0 00.302-1.232L9.555 5.168zM10 12.5a.75.75 0 00-.75-.75H7.757a.75.75 0 000 1.5H9.25V14a.75.75 0 001.5 0v-1.5z" clip-rule="evenodd" />
                </svg>
                 <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6 text-gray-400 inline-block" title="Not Currently Running">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
                </svg>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button @click="openScheduleModal(schedule)" class="text-indigo-600 hover:text-indigo-900" title="Edit Schedule">
                Edit
              </button>
              <button
                @click="toggleScheduleActive(schedule)"
                :class="schedule.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'"
                :title="schedule.is_active ? 'Set to Inactive' : 'Set to Active'"
              >
                {{ schedule.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!isLoading && schedules.length === 0 && !error" class="text-center py-10 bg-white rounded-lg shadow">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-400 mx-auto mb-3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12v-.008zM15 12h.008v.008H15v-.008zM15 15h.008v.008H15v-.008zM9 12h.008v.008H9v-.008zM9 15h.008v.008H9v-.008z" />
      </svg>
      <p class="text-gray-500">No accreditation schedules found. Click "Add New Schedule" to create one.</p>
    </div>

    <!-- Custom Schedule Form Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div @click="closeModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveSchedule">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ currentSchedule.id ? 'Edit Accreditation Schedule' : 'Add New Accreditation Schedule' }}
                  </h3>
                  <div class="mt-4">
                    <div v-if="modalError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 text-sm" role="alert">
                      <p>{{ modalError }}</p>
                    </div>
                    <div class="mb-4">
                      <label for="schedule_name_modal" class="block text-sm font-medium text-gray-700">Schedule Name <span class="text-red-500">*</span></label>
                      <input type="text" id="schedule_name_modal" v-model.trim="currentSchedule.schedule_name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label for="from_date_modal" class="block text-sm font-medium text-gray-700">From Date <span class="text-red-500">*</span></label>
                        <input type="date" id="from_date_modal" v-model="currentSchedule.from_date" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" @change="validateDates">
                      </div>
                      <div>
                        <label for="end_date_modal" class="block text-sm font-medium text-gray-700">End Date <span class="text-red-500">*</span></label>
                        <input type="date" id="end_date_modal" v-model="currentSchedule.end_date" required :min="currentSchedule.from_date" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" @change="validateDates">
                      </div>
                    </div>
                    <div class="flex items-start mb-4">
                      <div class="flex items-center h-5">
                        <input id="is_active_modal" type="checkbox" v-model="currentSchedule.is_active" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="is_active_modal" class="font-medium text-gray-700">Set this schedule as active</label>
                        <p class="text-gray-500 text-xs">Only one schedule should be active and within its date range for new applications.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="isSaving"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ currentSchedule.id ? 'Save Changes' : 'Create Schedule' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/services'; // Ensure this path is correct

const initialScheduleState = () => ({
  id: null,
  schedule_name: '',
  from_date: new Date().toISOString().split('T')[0],
  end_date: null,
  is_active: true,
});

export default {
  name: 'ScheduleManagementTailwind',
  data() {
    return {
      schedules: [],
      currentSchedule: initialScheduleState(),
      isLoading: false,
      isSaving: false,
      error: null,
      modalError: null,
      showModal: false, // Controls custom modal visibility
    };
  },
  mounted() {
    this.fetchSchedules();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }; // Ensure UTC for consistency
      return new Date(dateString + 'T00:00:00Z').toLocaleDateString(undefined, options);
    },
    isCurrentlyActive(schedule) {
      if (!schedule.from_date || !schedule.end_date) return false;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Normalize today to UTC start of day
      const fromDate = new Date(schedule.from_date + 'T00:00:00Z');
      const endDate = new Date(schedule.end_date + 'T00:00:00Z');
      return fromDate <= today && endDate >= today;
    },
    async fetchSchedules() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.getMastersApplicationDurations(); 
        this.schedules = response.data.results || response.data;
      } catch (err) {
        console.error("Error fetching schedules:", err.response?.data || err.message);
        this.error = "Failed to load accreditation schedules. " + (err.response?.data?.detail || err.message);
      } finally {
        this.isLoading = false;
      }
    },
    openScheduleModal(schedule = null) {
      this.modalError = null;
      if (schedule) {
        this.currentSchedule = JSON.parse(JSON.stringify(schedule)); // Deep copy
      } else {
        this.currentSchedule = initialScheduleState();
      }
      this.showModal = true;
      // Prevent body scroll when modal is open
      document.body.classList.add('overflow-hidden');
    },
    closeModal() {
      this.showModal = false;
      this.currentSchedule = initialScheduleState();
      document.body.classList.remove('overflow-hidden');
    },
    validateDates() {
      this.modalError = null;
      if (this.currentSchedule.from_date && this.currentSchedule.end_date) {
        if (new Date(this.currentSchedule.end_date) < new Date(this.currentSchedule.from_date)) {
          this.modalError = "End date cannot be before the start date.";
          return false;
        }
      }
      return true;
    },
    async saveSchedule() {
      if (!this.validateDates()) return;

      this.isSaving = true;
      this.modalError = null;
      const payload = { ...this.currentSchedule };

      try {
        if (payload.id) {
          await apiService.updateApplicationSchedule(payload.id, payload);
        } else {
          await apiService.createMastersApplicationDuration(payload); 
        }
        this.closeModal();
        await this.fetchSchedules();
      } catch (err) {
        console.error("Error saving schedule:", err.response?.data || err.message);
        const errorData = err.response?.data;
        if (errorData && typeof errorData === 'object') {
            this.modalError = Object.values(errorData).map(e => Array.isArray(e) ? e.join(', ') : e).join('; ');
        } else {
            this.modalError = "Failed to save schedule. " + (errorData?.detail || err.message);
        }
      } finally {
        this.isSaving = false;
      }
    },
    async toggleScheduleActive(schedule) {
      const action = schedule.is_active ? 'deactivate' : 'activate';
      if (!confirm(`Are you sure you want to ${action} the schedule "${schedule.schedule_name}"?`)) {
        return;
      }
      this.isLoading = true; // Use for table-level operations
      try {
        await apiService.patchApplicationSchedule(schedule.id, { is_active: !schedule.is_active });
        await this.fetchSchedules();
      } catch (err) {
        console.error(`Error ${action}ing schedule:`, err.response?.data || err.message);
        this.error = `Failed to ${action} schedule. ` + (err.response?.data?.detail || err.message);
      } finally {
        this.isLoading = false;
      }
    },
    // confirmDeleteSchedule(scheduleId) { ... } // Implement if needed
  },
};
</script>

<style scoped>
/* Add any specific styles here if needed, but primarily rely on Tailwind classes */
/* For the modal background scroll lock */
body.overflow-hidden {
  overflow: hidden;
}
</style>