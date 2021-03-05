Modernized Vue 3 ECPF Change Request Forms

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">ECPF Change Request Forms</h1>

    <!-- Tab Navigation -->
    <div class="flex space-x-4 mb-6">
      <button v-for="form in forms" :key="form.id" @click="activeForm = form.id" :class="[
        'px-4 py-2 rounded-md transition-colors',
        activeForm === form.id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
      ]">
        {{ form.label }}
      </button>
    </div>

    <!-- Name Change Form -->
    <div v-if="activeForm === 'nameChange'" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">ECPF Name Change Request</h2>

      <div v-if="nameChange.currentECPFData" class="mb-6 space-y-2">
        <h3 class="font-medium">Current ECPF Details</h3>
        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
          <div v-for="(value, key) in nameChange.currentECPFData" :key="key">
            <span class="font-medium">{{ formatLabel(key) }}:</span> {{ value }}
          </div>
        </div>
      </div>

      <form @submit.prevent="nameChange.handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Proposed Name of ECPF
          </label>
          <input v-model="nameChange.formData.proposedName" type="text" required
            class="w-full rounded-md border-gray-300 shadow-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea v-model="nameChange.formData.remarks" class="w-full rounded-md border-gray-300 shadow-sm"
            rows="3" />
        </div>

        <div class="flex space-x-4">
          <button type="submit" :disabled="nameChange.isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {{ nameChange.isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
          <button type="button" @click="nameChange.handleEdit"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Edit
          </button>
          <button type="button" @click="nameChange.handleView"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            View
          </button>
        </div>

        <div v-if="nameChange.successMessage" class="text-green-600">
          {{ nameChange.successMessage }}
        </div>
        <div v-if="nameChange.errorMessage" class="text-red-600">
          {{ nameChange.errorMessage }}
        </div>
        <div v-if="nameChange.applicationStatus" class="mt-4">
          <h3 class="font-medium">Application Status:</h3>
          <p>{{ nameChange.applicationStatus }}</p>
        </div>
      </form>
    </div>

    <!-- Location Change Form -->
    <div v-if="activeForm === 'locationChange'" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">ECPF Location Change Request</h2>

      <div v-if="locationChange.currentECPFData" class="mb-6 space-y-2">
        <h3 class="font-medium">Current ECPF Details</h3>
        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
          <div v-for="(value, key) in locationChange.currentECPFData" :key="key">
            <span class="font-medium">{{ formatLabel(key) }}:</span> {{ value }}
          </div>
        </div>
      </div>

      <form @submit.prevent="locationChange.handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input v-model="locationChange.formData.location" type="text" required
            class="w-full rounded-md border-gray-300 shadow-sm" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Gewog/Throm
          </label>
          <select v-model="locationChange.formData.gewog" required class="w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select Gewog/Throm</option>
            <option v-for="option in locationChange.gewogOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Dzongkhag/Thromde
          </label>
          <select v-model="locationChange.formData.dzongkhag" required
            class="w-full rounded-md border-gray-300 shadow-sm">
            <option value="">Select Dzongkhag/Thromde</option>
            <option v-for="option in locationChange.dzongkhagOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea v-model="locationChange.formData.remarks" class="w-full rounded-md border-gray-300 shadow-sm"
            rows="3" />
        </div>

        <div class="flex space-x-4">
          <button type="submit" :disabled="locationChange.isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {{ locationChange.isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
          <button type="button" @click="locationChange.handleEdit"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Edit
          </button>
          <button type="button" @click="locationChange.handleView"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            View
          </button>
        </div>

        <div v-if="locationChange.successMessage" class="text-green-600">
          {{ locationChange.successMessage }}
        </div>
        <div v-if="locationChange.errorMessage" class="text-red-600">
          {{ locationChange.errorMessage }}
        </div>
        <div v-if="locationChange.applicationStatus" class="mt-4">
          <h3 class="font-medium">Application Status:</h3>
          <p>{{ locationChange.applicationStatus }}</p>
        </div>
      </form>
    </div>

    <!-- Ownership Change Form -->
    <div v-if="activeForm === 'ownershipChange'" class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">ECPF Ownership Change Request</h2>

      <div class="space-y-6">
        <!-- Current ECPF Details -->
        <section>
          <h3 class="font-medium mb-4">1. Current ECPF Details</h3>
          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div v-for="(value, key) in ownershipChange.currentECPFDetails" :key="key">
              <span class="font-medium">{{ formatLabel(key) }}:</span> {{ value }}
            </div>
          </div>
        </section>

        <!-- Personal Information -->
        <section>
          <h3 class="font-medium mb-4">2. Personal Information (New Applicants)</h3>
          <div class="space-y-4">
            <div class="flex space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  CID No.
                </label>
                <input v-model="ownershipChange.newApplicant.cidNo" type="text" required
                  class="w-full rounded-md border-gray-300 shadow-sm" @blur="ownershipChange.searchCID" />
              </div>
              <button type="button" @click="ownershipChange.searchCID"
                class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 self-end">
                Search
              </button>
            </div>

            <div v-if="ownershipChange.newApplicant.applicantName" class="grid grid-cols-2 gap-4">
              <div v-for="(value, key) in ownershipChange.newApplicant" :key="key">
                <span class="font-medium">{{ formatLabel(key) }}:</span> {{ value }}
              </div>
            </div>
          </div>
        </section>

        <!-- Institute Linkages -->
        <section>
          <h3 class="font-medium mb-4">3. Institute/Colleges/University Linkages</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-2">Name</th>
                  <th class="px-4 py-2">Location</th>
                  <th class="px-4 py-2">Country</th>
                  <th class="px-4 py-2">Recognition</th>
                  <th class="px-4 py-2">Approval</th>
                  <th class="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(linkage, index) in ownershipChange.linkages" :key="index">
                  <td class="px-4 py-2">
                    <input v-model="linkage.name" type="text" class="w-full rounded-md border-gray-300 shadow-sm" />
                  </td>
                  <td class="px-4 py-2">
                    <input v-model="linkage.location" type="text" class="w-full rounded-md border-gray-300 shadow-sm" />
                  </td>
                  <td class="px-4 py-2">
                    <input v-model="linkage.country" type="text" class="w-full rounded-md border-gray-300 shadow-sm" />
                  </td>
                  <td class="px-4 py-2">
                    <input type="file"
                      @change="event => ownershipChange.handleFileChange(event, linkage, 'recognition')"
                      class="w-full" />
                  </td>
                  <td class="px-4 py-2">
                    <input type="file" @change="event => ownershipChange.handleFileChange(event, linkage, 'approval')"
                      class="w-full" />
                  </td>
                  <td class="px-4 py-2">
                    <button type="button" @click="ownershipChange.deleteLinkage(index)"
                      class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button type="button" @click="ownershipChange.addLinkage"
            class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Add Linkage
          </button>
        </section>

        <div class="flex space-x-4">
          <button type="button" @click="ownershipChange.handleSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </button>
          <button type="button" @click="ownershipChange.viewApplication"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            View
          </button>
          <button type="button" @click="ownershipChange.editApplication"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Edit
          </button>
          <button type="button" @click="ownershipChange.cancelChanges"
            class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </button>
        </div>

        <div v-if="ownershipChange.successMessage" class="text-green-600">
          {{ ownershipChange.successMessage }}
        </div>
        <div v-if="ownershipChange.errorMessage" class="text-red-600">
          {{ ownershipChange.errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue';

export default {
  setup() {
    // Form navigation
    const forms = [
      { id: 'nameChange', label: 'Name Change' },
      { id: 'locationChange', label: 'Location Change' },
      { id: 'ownershipChange', label: 'Ownership Change' }
    ];
    const activeForm = ref('nameChange');

    // Utility function for formatting labels
    const formatLabel = (key) => {
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
    };

    // Name Change Form Logic
    const nameChange = reactive({
      currentECPFData: null,
      formData: {
        proposedName: '',
        remarks: ''
      },
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      applicationStatus: '',

      async fetchCurrentECPFData() {
        try {
          // Simulated API call
          const response = await new Promise(resolve => {
            setTimeout(() => {
              resolve({
                name: 'Existing ECPF Name',
                licenseNo: 'ECPF-12345',
                location: 'Existing Location',
                proprietor: 'Existing Proprietor',
                cid: '12345678901',
                contactNo: '9876543210',
                email: 'existing@example.com'
              });
            }, 500);
          });
          this.currentECPFData = response;
        } catch (error) {
          console.error('Error fetching ECPF data:', error);
          this.errorMessage = 'Failed to load ECPF details.';
        }
      },

      async handleSubmit() {
        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        try {
          // Simulated API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.successMessage = 'Name change request submitted successfully!';
          this.applicationStatus = 'Submitted for review.';
          this.formData.proposedName = '';
          this.formData.remarks = '';
        } catch (error) {
          console.error('Submission error:', error);
          this.errorMessage = 'Failed to submit request. Please try again.';
        } finally {
          this.isSubmitting = false;
        }
      },

      handleEdit() {
        // Implement edit functionality
        console.log('Edit functionality to be implemented');
      },

      handleView() {
        // Implement view functionality
        console.log('View functionality to be implemented');
      }
    });

    // Location Change Form Logic
    const locationChange = reactive({
      currentECPFData: null,
      formData: {
        location: '',
        gewog: '',
        dzongkhag: '',
        remarks: ''
      },
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      applicationStatus: '',
      gewogOptions: [
        { label: 'Gewog A', value: 'gewogA' },
        { label: 'Gewog B', value: 'gewogB' }
      ],
      dzongkhagOptions: [
        { label: 'Dzongkhag X', value: 'dzongkhagX' },
        { label: 'Dzongkhag Y', value: 'dzongkhagY' }
      ],

      async fetchCurrentECPFData() {
        try {
          // Simulated API call
          const response = await new Promise(resolve => {
            setTimeout(() => {
              resolve({
                name: 'Existing ECPF Name',
                location: 'Existing Location',
                proprietor: 'Existing Proprietor',
                cid: '12345678901',
                contactNo: '9876543210',
                email: 'existing@example.com'
              });
            }, 500);
          });
          this.currentECPFData = response;
        } catch (error) {
          console.error('Error fetching ECPF data:', error);
          this.errorMessage = 'Failed to load ECPF details.';
        }
      },

      async handleSubmit() {
        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        if (!this.formData.location || !this.formData.gewog || !this.formData.dzongkhag) {
          this.errorMessage = 'All fields are required.';
          this.isSubmitting = false;
          return;
        }

        try {
          // Simulated API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.successMessage = 'Location change request submitted successfully!';
          this.applicationStatus = 'Submitted for review.';
          this.formData.location = '';
          this.formData.gewog = '';
          this.formData.dzongkhag = '';
          this.formData.remarks = '';
        } catch (error) {
          console.error('Submission error:', error);
          this.errorMessage = 'Failed to submit request. Please try again.';
        } finally {
          this.isSubmitting = false;
        }
      },

      handleEdit() {
        // Implement edit functionality
        console.log('Edit functionality to be implemented');
      },

      handleView() {
        // Implement view functionality
        console.log('View functionality to be implemented');
      }
    });

    // Ownership Change Form Logic
    const ownershipChange = reactive({
      currentECPFDetails: {
        ecpfLicenseNo: 'Auto-generated',
        nameOfECPF: 'Auto-generated',
        proprietorOfECPF: 'Auto-generated',
        locationOfECPF: 'Auto-generated'
      },
      newApplicant: {
        cidNo: '',
        applicantName: '',
        gender: '',
        dateOfBirth: '',
        contactNo: '',
        emailAddress: '',
        officeNumber: '',
        flatNo: '',
        buildingNo: '',
        location: '',
        gewogThrom: '',
        dzongkhagThromde: '',
        villageChiwog: '',
        gewog: '',
        dungkhag: '',
        permanentDzongkhagThromde: '',
        courseQualification: '',
        nameOfInstitute: '',
        nameOfUniversity: ''
      },
      linkages: [],
      successMessage: '',
      errorMessage: '',
      applicationStatus: '',

      addLinkage() {
        this.linkages.push({
          name: '',
          location: '',
          country: '',
          recognition: null,
          approval: null
        });
      },

      deleteLinkage(index) {
        this.linkages.splice(index, 1);
      },

      handleFileChange(event, linkage, type) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            linkage[type] = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },

      async searchCID() {
        if (this.newApplicant.cidNo) {
          try {
            // Simulated API call
            const response = await new Promise(resolve => {
              setTimeout(() => {
                resolve({
                  applicantName: 'John Doe',
                  gender: 'Male',
                  dateOfBirth: '01/01/1990',
                  contactNo: '1234567890',
                  emailAddress: 'john.doe@example.com',
                  officeNumber: '123',
                  flatNo: '456',
                  buildingNo: '789',
                  location: 'City',
                  gewogThrom: 'Gewog',
                  dzongkhagThromde: 'Dzongkhag',
                  villageChiwog: 'Village',
                  gewog: 'Gewog',
                  dungkhag: 'Dungkhag',
                  permanentDzongkhagThromde: 'Dzongkhag',
                  courseQualification: 'Course',
                  nameOfInstitute: 'Institute',
                  nameOfUniversity: 'University'
                });
              }, 500);
            });

            Object.assign(this.newApplicant, response);
          } catch (error) {
            console.error('Error searching CID:', error);
            this.errorMessage = 'Error retrieving applicant data.';
          }
        }
      },

      async handleSubmit() {
        try {
          // Simulated API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.successMessage = 'Ownership change request submitted successfully!';
          this.applicationStatus = 'Submitted for review.';
        } catch (error) {
          console.error('Submission error:', error);
          this.errorMessage = 'Failed to submit request. Please try again.';
        }
      },

      viewApplication() {
        // Implement view functionality
        console.log('View functionality to be implemented');
      },

      editApplication() {
        // Implement edit functionality
        console.log('Edit functionality to be implemented');
      },

      cancelChanges() {
        // Implement cancel functionality
        console.log('Cancel functionality to be implemented');
      }
    });

    // Initialize data on component mount
    onMounted(() => {
      nameChange.fetchCurrentECPFData();
      locationChange.fetchCurrentECPFData();
      ownershipChange.addLinkage();
    });

    return {
      forms,
      activeForm,
      formatLabel,
      nameChange,
      locationChange,
      ownershipChange
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Add any additional component-specific styles here */
</style>
