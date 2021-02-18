<template>
    <div class="container mx-auto p-4">
      <InstitutionalAccreditation @open-application-form="openApplicationForm" />
  
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
  import ApplicationForm from './ApplicationForm.vue';
 
  export default {
    components: {
      ApplicationForm,
     
    },
    setup() {
      const assessorPool = ref(['Dr. Jane Doe', 'Prof. John Smith', 'Dr. Alice Brown']);
      const showApplicationForm = ref(false);
      const selectedApplication = ref(null);
  
      const openApplicationForm = (application) => {
        selectedApplication.value = { ...application };
        showApplicationForm.value = true;
      };
  
      const closeApplicationForm = () => {
        showApplicationForm.value = false;
        selectedApplication.value = null;
      };
  
      const saveApplicationData = (updatedApplication) => {
        // Implement your data saving logic here (e.g., API call)
        console.log('Saving application data:', updatedApplication);
        closeApplicationForm();
      };
  
      return {
        assessorPool,
        showApplicationForm,
        selectedApplication,
        openApplicationForm,
        closeApplicationForm,
        saveApplicationData
      };
    }
  };
  </script>