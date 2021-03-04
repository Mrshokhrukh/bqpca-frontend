<template>

  <PaymentModal ref="paymentModal" @payment-completed="onPaymentCompleted" @close="onPaymentModalClose" />
  <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm p-6">
    <!-- Step Header -->
    <h3 class="text-lg font-semibold text-gray-900 my-4">Addition Qualification Registration</h3>

    <!-- Application Selection -->
    <div class="mb-6">
      <label for="application" class="block text-sm font-medium text-gray-700 required">Your Application:</label>

      <!-- Option 1: Using an <input type="text"> (Recommended) -->
      <input type="text" id="application"
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        :value="applications.length === 1 ? `${applications[0].registration_no} - ${applications[0].full_name}` : ''"
        readonly required />

      <p v-if="applications.length > 1" class="mt-1 text-gray-700">
        <input type="text" id="application"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          :value="`${application.registration_no} - ${application.full_name}`" readonly required
          v-for="application in applications" :key="application.id" v-show="application.cid === authStore.user?.cid" />
      </p>

      <span v-if="errors.application" class="text-sm text-red-500 mt-1">{{ errors.application }}</span>
    </div>

    <div class="mt-12">
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Details</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
            <select v-model="localFormData.qualification_type"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">Select Qualification Type</option>
              <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                {{ type.qualification_type_name }}
              </option>
            </select>
            <span v-if="errors.qualification_type" class="text-sm text-red-500 mt-1">{{
    errors.qualification_type
  }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
            <select v-model="localFormData.qualification_name"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">Select Qualification Name</option>
              <option v-for="qualification in qualifications" :key="qualification.id" :value="qualification.id">
                {{ qualification.qualification }}
              </option>
            </select>
            <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
    errors.qualification_name
  }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
            <select v-model="localFormData.institute"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">Select Institute/University</option>
              <option v-for="university in universities" :key="university.id" :value="university.id">
                {{ university.country }}, {{ university.university }}, {{ university.institute_name }}
              </option>
            </select>
            <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{ errors.institute }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Year of Completion</label>
            <input type="month" v-model="localFormData.year_of_completion"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="YYYY" />
            <span v-if="errors.year_of_completion" class="text-sm text-red-500 mt-1">{{
    errors.year_of_completion
  }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Section with new design -->
    <div class="mt-12">
      <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
        <div class="space-y-4">
          <div v-for="(doc, index) in supportingDocuments" :key="index"
            class="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-100">
            <div class="w-1/3">
              <select v-model="doc.type"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                <option value="">Select Document Type</option>
                <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                  {{ type.document_name }}
                </option>
              </select>
            </div>
            <div class="flex-1 flex items-center space-x-2">
              <input type="file" @change="(e) => handleFileSelect(e, index)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
              <button @click="removeDocument(index)" type="button"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <span class="sr-only">Remove</span>
                ✕
              </button>
            </div>
          </div>

          <button type="button" @click="addDocument"
            class="mt-4 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center">
            <span class="mr-2">+</span>
            Add Another Document
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Required documents are graduation certificate, cid copy, security clarance, roq certificate, class 10, 12
          and graduation marksheets.
        </p>
      </div>
    </div>

    <!-- Declaration Section -->
    <div class="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea v-model="localFormData.remarks" rows="3"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter any additional remarks or comments"></textarea>
        </div>

        <div class="flex items-start space-x-3 bg-white p-4 rounded-lg">
          <input type="checkbox" v-model="localFormData.declaration"
            class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label class="text-sm text-gray-700">
            I hereby declare that all the information provided above is true and correct to the best of my
            knowledge.
            I understand that any false statements may result in the rejection of my registration.
          </label>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="mt-12 flex justify-end space-x-4">
      <button type="button" @click="$emit('back')"
        class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
        Back to Previous Step
      </button>
      <button type="button" @click="handleSubmit"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Submit Registration
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';


defineProps({
  selectedType: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['back', 'submit']);

const toast = useToast();
const authStore = useAuthStore();
const paymentModal = ref(null);

const isSubmitting = ref(false);
const applications = ref([]);
// const selectedApplication = ref('');  <-- Remove this line
const qualificationTypes = ref([]);
const qualifications = ref([]);
const universities = ref([]);
const errors = reactive({});
const fetchedDocumentTypes = ref([]);

const localFormData = reactive({
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: '',
  remarks: '',
  declaration: false,
  documents: [],
  application: '', // Add application field
  payment_id: null, //for payment
});



// Fetch applications
const fetchApplications = async () => {
  try {
    const cid = authStore.user?.cid;
    if (!cid) {
      toast.error("CID not found.  Please ensure you are logged in.");
      return;
    }
    const response = await apiService.getApplicationsByCid(cid);
    applications.value = response.data;

    // Set the application ID in localFormData *if* we have one application
    if (applications.value.length === 1) {
      localFormData.application = applications.value[0].id;
    } else if (applications.value.length > 1) {
      applications.value.forEach((application) => {
        if (application.cid === authStore.user?.cid) {
          localFormData.application = application.id
        }
      })
    } else {
      // Handle the case where no applications are found.
      errors.application = "No application found for this user.";
    }

  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch applications.");
    console.error("Error fetching applications:", error);
    errors.application = "Failed to fetch application."; // Set error message
  }
};

const supportingDocuments = ref([
  { type: '', files: [] }, // Initial document
]);

const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [] });
};

const removeDocument = (index) => {
  supportingDocuments.value.splice(index, 1);
};

const handleFileSelect = (event, index) => {
  const files = event.target.files;
  if (files.length > 0) {
    // Clear any existing files first
    supportingDocuments.value[index].files = [];

    // Add all selected files
    for (let i = 0; i < files.length; i++) {
      supportingDocuments.value[index].files.push(files[i]);
    }
  }
};

//format date
const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// Form Validation
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
  let isValid = true;

  // No need to check selectedApplication.value anymore
  // if (!selectedApplication.value) {
  //   errors.application = "Please select an application.";
  //   isValid = false;
  // }

  if (!localFormData.application) {
    errors.application = "Application information is missing.";
    isValid = false;
  }
  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required';
    isValid = false;
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required';
    isValid = false;
  }
  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required';
    isValid = false;
  }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required';
    isValid = false;
  }

  if (!localFormData.declaration) {
    toast.error("Please agree to the declaration.");
    isValid = false;
  }

  // Validate documents
  supportingDocuments.value.forEach((doc, index) => {
    if (!doc.type) {
      toast.error(`Please select a document type for document ${index + 1}.`);
      isValid = false;
    }
    if (doc.files.length === 0) {
      toast.error(`Please select file(s) to upload for document ${index + 1}.`)
      isValid = false;
    }
  })

  if (!isValid) {
    toast.error("Please correct the errors in the form.");
  }

  return isValid;
};

// Form Submission with payment
const openPaymentModal = () => {
  paymentModal.value.openModal();
};

const onPaymentCompleted = (paymentData) => {
  localFormData.is_payment_complete = false;
  localFormData.payment_id = paymentData.paymentHash;
  handleSubmitActual();
};

const onPaymentModalClose = () => {
  console.log("Modal closed");
};
const handleSubmit = async () => {
  if (validateForm()) {
    openPaymentModal();
  }
};

const handleSubmitActual = async () => {
  isSubmitting.value = true;
  try {
    // Create the FormData object
    const formData = new FormData();

    // Add all the regular fields to FormData
    formData.append('completion_year', new Date(localFormData.year_of_completion).getFullYear());
    formData.append('declaration', 'True');
    formData.append('remarks', localFormData.remarks);
    formData.append('registration_date', formatDateForAPI(new Date()));
    formData.append('expiry_date', formatDateForAPI(new Date(new Date().setFullYear(new Date().getFullYear() + 5))));
    formData.append('is_payment_complete', 'True'); //payment is completed.
    formData.append('payment_id', localFormData.payment_id);
    formData.append('is_active', 'False');
    formData.append('application', localFormData.application); // Use localFormData.application
    formData.append('qualification_name', localFormData.qualification_name);
    formData.append('qualification_type', localFormData.qualification_type);
    formData.append('institute_university', localFormData.institute);

    // Handle file attachments
    localFormData.documents.forEach((doc, index) => {
      if (doc.files && doc.files.length > 0) {
        doc.files.forEach(file => {
          formData.append(`attachments-${index}-file`, file);
          formData.append(`attachments-${index}-file_type`, doc.type);
        });
      }
    });

    // Handle file attachments for supportingDocuments
    supportingDocuments.value.forEach((doc, index) => {
      if (doc.files && doc.files.length > 0) {
        doc.files.forEach((file) => {
          formData.append(`attachments-${index}-file`, file);
        });
        formData.append(`attachments-${index}-file_type`, doc.type);
      }
    });


    // Send everything in a single request
    await apiService.createBhmcNewQualification(formData);

    toast.success('Application submitted successfully!');
    // showSuccessModal.value = true;
    emit('submit', formData);
  } catch (error) {
    console.error('Error submitting application:', error);
    toast.error(`Application submission failed: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};


onMounted(async () => {
  fetchApplications();
  try {
    const qualificationTypesResponse = await apiService.getMastersQualificationTypes();
    const qualificationsResponse = await apiService.getBmhCMastersQualifications();
    const universitiesResponse = await apiService.getMastersUniversities();

    qualificationTypes.value = qualificationTypesResponse.data.results;
    qualifications.value = qualificationsResponse.data.results;
    universities.value = universitiesResponse.data.results;

    //Fetch Document Types
    const documentTypesResponse = await apiService.getMastersDocumentTypes();
    fetchedDocumentTypes.value = documentTypesResponse.data.results;

  } catch (error) {
    console.error('Error fetching master data:', error);
    toast.error('Failed to fetch master data.  Please try again.');
  }
});
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
