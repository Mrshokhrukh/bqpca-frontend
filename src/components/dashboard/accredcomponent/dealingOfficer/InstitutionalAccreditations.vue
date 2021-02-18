<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Institutional Accreditation Applications</h1>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left">Application ID</th>
            <th class="px-4 py-2 text-left">Institute Name</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.application_id" class="hover:bg-gray-50">
            <td class="border px-4 py-2">{{ application.application_id }}</td>
            <td class="border px-4 py-2">{{ application.institute_name }}</td>
            <td class="border px-4 py-2">{{ application.status }}</td>
            <td class="border px-4 py-2">
              <button @click="viewApplication(application)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View/Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Application Form Modal -->
    <div v-if="showApplicationForm" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <ApplicationForm
            :application="selectedApplication"
            :assessorPool="assessorPool"
            @close="closeApplicationForm"
            @save="saveApplicationData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import ApplicationForm from './ApplicationForm.vue'; // Adjust path if necessary

export default {
  components: {
    ApplicationForm
  },
  setup() {
    // Example Application Data (replace with your actual data source)
    const applications = ref([
      { application_id: 'APP001', institute_name: 'University of Example', status: 'Submitted' },
      { application_id: 'APP002', institute_name: 'College of Science', status: 'In Review' },
      { application_id: 'APP003', institute_name: 'Tech Institute', status: 'Site Visit Scheduled' }
    ]);

    const assessorPool = ref(['Dr. Jane Doe', 'Prof. John Smith', 'Dr. Alice Brown']);
    const showApplicationForm = ref(false);
    const selectedApplication = ref(null);

    const viewApplication = (application) => {
      selectedApplication.value = { ...application };
      showApplicationForm.value = true;
    };

    const closeApplicationForm = () => {
      showApplicationForm.value = false;
      selectedApplication.value = null;
    };

    const saveApplicationData = (updatedApplication) => {
      // Find the application in the list and update it (in a real application, update the database)
      const index = applications.value.findIndex(app => app.application_id === updatedApplication.application_id);
      if (index !== -1) {
        applications.value[index] = { ...updatedApplication };
      }

      // Implement your data saving logic here (e.g., API call)
      console.log('Saving application data:', updatedApplication);
      closeApplicationForm();
    };

    return {
      applications,
      assessorPool,
      showApplicationForm,
      selectedApplication,
      viewApplication,
      closeApplicationForm,
      saveApplicationData
    };
  }
};
</script>