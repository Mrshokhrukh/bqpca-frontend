<template>
  <div>
    <!-- CID Holder or Non-CID Holder Selection -->
    <CIDSelection v-model="isCIDHolder" />

    <PaymentModal ref="paymentModal" @payment-completed="onPaymentCompleted" @close="onPaymentModalClose" />

    <form v-if="isCIDHolder !== null" @submit.prevent="handleSubmit" class="space-y-6 mt-6">
      <!-- Personal Information Section - CID Holders -->
      <div v-if="isCIDHolder" class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>

        <!-- Caution Message -->
        <div class="bg-yellow-100 border-l-4 border-yellow-500 rounded text-yellow-700 p-4 mb-4" role="alert">
          <p class="font-bold">Caution for CID Holders</p>
          <p>
            You are applying for your own certification using your CID.
            <b>Do not use information of other people.</b> Applying with other people's information will
            <b>overwrite your personal details in this system, and you will lose access.</b>
            Please ensure all information is your own.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CID No. -->
          <div class="relative">
            <label for="cid" class="block text-sm font-medium text-gray-700">CID No.</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="text" id="cid" v-model="form.cid_no" @input="handleCIDInput" maxlength="11"
                class="block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
                placeholder="Enter 11-digit CID" />
            </div>
          </div>

          <!-- Full Name -->
          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="full_name" v-model="form.applicants_name" readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="date" id="date_of_birth" v-model="form.date_of_birth" readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Contact Number -->
          <div>
            <label for="contact_number" class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input type="tel" id="contact_number" v-model="form.contact_no" pattern="[0-9]{8}" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
            <p class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
          </div>

          <!-- Email Address -->
          <div>
            <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email_address" v-model="form.email_address" :readonly="!!form.email_address" :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': !!form.email_address },
    ]" />
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <input type="text" id="gender" :value="genderDisplay" readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
            <input type="hidden" v-model="form.gender" />
          </div>

          <!-- Dzongkhag -->
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <input type="text" id="dzongkhag" v-model="form.dzongkhag" readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Gewog -->
          <div>
            <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
            <input type="text" id="gewog" v-model="form.gewog" readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Village -->
          <div>
            <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
            <input type="text" id="village" v-model="form.village" readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>
        </div>
      </div>

      <!-- Personal Information Section - Non-CID Holders -->
      <div v-else class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Full Name -->
          <div>
            <label for="full_name_non_cid" class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input type="text" id="full_name_non_cid" v-model="form.applicants_name" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="date_of_birth_non_cid" class="block text-sm font-medium text-gray-700 required">Date of
              Birth</label>
            <input type="date" id="date_of_birth_non_cid" v-model="form.date_of_birth" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Contact Number -->
          <div>
            <label for="contact_number_non_cid" class="block text-sm font-medium text-gray-700 required">Contact
              Number</label>
            <input type="tel" id="contact_number_non_cid" v-model="form.contact_no" pattern="[0-9]{8}" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
            <p class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
          </div>

          <!-- Email Address -->
          <div>
            <label for="email_address_non_cid" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email_address_non_cid" v-model="form.email_address" :readonly="!!form.email_address"
              :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': !!form.email_address },
    ]" />
          </div>

          <!-- Gender -->
          <div>
            <label for="gender_non_cid" class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select id="gender_non_cid" v-model="form.gender" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2">
              <option value="" disabled>Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <!-- Dzongkhag -->
          <div>
            <label for="dzongkhag_non_cid" class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
            <input type="text" id="dzongkhag_non_cid" v-model="form.dzongkhag" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Gewog -->
          <div>
            <label for="gewog_non_cid" class="block text-sm font-medium text-gray-700 required">Gewog</label>
            <input type="text" id="gewog_non_cid" v-model="form.gewog" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Village -->
          <div>
            <label for="village_non_cid" class="block text-sm font-medium text-gray-700 required">Village</label>
            <input type="text" id="village_non_cid" v-model="form.village" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>
        </div>
      </div>

      <EducationTypeSelection v-model="form.from_in_country" />
      <!-- Education Details Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">
          Education Details
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- Student ID No. -->
          <div class="relative">
            <label for="student_id_no" class="block text-sm font-medium text-gray-700 required">Student ID No.</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="text" id="student_id_no" v-model="form.student_id_no" required
                class="block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
              <button v-if="form.from_in_country" type="button" @click="fetchRUBData"
                :disabled="isLoadingRUB || !form.student_id_no"
                class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r-md border-l bg-gray-50 hover:bg-gray-100 focus:outline-none">
                <span class="text-sm text-gray-600" :class="{ 'opacity-50': isLoadingRUB || !form.student_id_no }">
                  {{ isLoadingRUB ? "Fetching..." : "Fetch RUB" }}
                </span>
              </button>
            </div>
          </div>


          <!-- Course Title -->
          <div>
            <label for="course_title" class="block text-sm font-medium text-gray-700 required">Course Title</label>
            <input type="text" id="course_title" v-model="form.course_title" required :readonly="form.from_in_country"
              :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': form.from_in_country },
    ]" />
          </div>

          <!-- Qualification -->
          <div>
            <label for="qualification" class="block text-sm font-medium text-gray-700 required">Qualification</label>
            <select id="qualification" v-model="form.qualification" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2">
              <option value="" disabled>Select Qualification</option>
              <option v-for="qual in qualificationOptions" :key="qual.value" :value="qual.value">
                {{ qual.label }}
              </option>
            </select>
          </div>

          <!-- Type of Course -->
          <div>
            <label for="type_of_course" class="block text-sm font-medium text-gray-700 required">Type of Course</label>
            <select id="type_of_course" v-model="form.type_of_course" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2">
              <option value="" disabled>Select Course Type</option>
              <option v-for="type in courseTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Duration of Course -->
          <div>
            <label for="duration_of_course" class="block text-sm font-medium text-gray-700 required">Duration of Course
              (Years)</label>
            <input type="number" id="duration_of_course" v-model="form.duration_of_course" min="1" max="10" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Name of Institute -->
          <div>
            <label for="name_of_institute" class="block text-sm font-medium text-gray-700 required">Name of
              Institute</label>
            <input type="text" id="name_of_institute" v-model="form.name_of_institute" required
              :readonly="form.from_in_country" :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': form.from_in_country },
    ]" />
          </div>

          <!-- Name of University -->
          <div>
            <label for="name_of_university" class="block text-sm font-medium text-gray-700 required">Name of
              University</label>
            <input type="text" id="name_of_university" v-model="form.name_of_university" required
              :readonly="form.from_in_country" :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': form.from_in_country },
    ]" />
          </div>



          <!-- Year of Completion -->
          <div>
            <label for="year_of_completion" class="block text-sm font-medium text-gray-700 required">Year of
              Completion</label>
            <input type="number" id="year_of_completion" v-model="form.year_of_completion" :min="minYear"
              :max="currentYear" required :readonly="form.from_in_country" :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': form.from_in_country },
    ]" />
          </div>

          <!-- Website -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
            <input type="url" id="website" v-model="form.website" placeholder="https://" pattern="https?://.+"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 required">Location</label>
            <input type="text" id="location" v-model="form.location" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 required">Country</label>
            <input type="text" id="country" v-model="form.country" required :readonly="form.from_in_country" :class="[
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
      { 'bg-gray-50': form.from_in_country },
    ]" />
          </div>
        </div>
      </div>

      <!-- Supporting Documents Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">
          Supporting Documents
        </h3>

        <div class="space-y-6">
          <!-- Degree Certificate -->
          <div v-if="!form.from_in_country">
            <label class="block text-sm font-medium text-gray-700 required">Degree Certificate</label>
            <div class="mt-2">
              <FileUpload v-model="form.degree_certificate" accept=".pdf" :max-size="5"
                :initial-file-name="initialData?.degree_certificate ? getFileNameFromUrl(initialData.degree_certificate) : ''"
                required />
              <p class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
            </div>
          </div>

          <!-- Academic Transcript -->
          <div v-if="!form.from_in_country">
            <label class="block text-sm font-medium text-gray-700 required">Academic Transcript</label>
            <div class="mt-2">
              <FileUpload v-model="form.academic_transcript" accept=".pdf" :max-size="5"
                :initial-file-name="initialData?.academic_transcript ? getFileNameFromUrl(initialData.academic_transcript) : ''"
                required />
              <p class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
            </div>
          </div>

          <!-- Passport Size Photo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required">Passport Size Photo</label>
            <div class="mt-2">
              <FileUpload v-model="form.passport_photo" accept=".jpg,.jpeg,.png,.webp" :max-size="2"
                :initial-file-name="initialData?.passport_size_photo ? getFileNameFromUrl(initialData.passport_size_photo) : ''"
                required />
              <p class="mt-1 text-sm text-gray-500">
                JPEG/PNG/WEBP only, max 2MB, passport format
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Remarks and Declaration Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        <!-- Remarks -->
        <div>
          <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea id="remarks" v-model="form.remarks" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"></textarea>
        </div>

        <!-- Declaration -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input type="checkbox" id="declaration" v-model="form.declaration" required
              class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700">Declaration</label>
            <p class="text-gray-500">
              I declare that all the information provided is true and accurate
              to the best of my knowledge.
            </p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button type="button" @click="$emit('close-modal')"
          class="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Cancel
        </button>
        <button type="button" @click="handleSaveAsDraft"
          class="px-6 py-3 border border-primary rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Save as Draft
        </button>
        <button type="button" @click="openPaymentModal" :disabled="!form.declaration || isSubmitting"
          class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isSubmitting ? "Submitting..." : "Submit" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import apiService from "@/services/services";
import FileUpload from "@/components/common/FileUpload.vue";
import { useToast } from "vue-toastification";
import PaymentModal from "@/components/common/PaymentModal.vue";
import CIDSelection from './CIDSelection.vue';
import EducationTypeSelection from './EducationTypeSelection.vue';

const { user } = useAuthStore();
const toast = useToast();
const authStore = useAuthStore(); // Get the authStore instance

const isLoadingDCRC = ref(false);
const isLoadingRUB = ref(false);
const isSubmitting = ref(false);
const currentYear = new Date().getFullYear();
const minYear = currentYear - 50;
const isCIDHolder = ref(null);

const qualificationOptions = ref([]);
const courseTypeOptions = ref([]);

const props = defineProps({
  initialData: Object,
  mode: { type: String, default: "create" },
});

const form = reactive({
  // Personal Information
  cid_no: props.initialData?.cid_no || "",
  applicants_name: props.initialData?.applicants_name || "",
  date_of_birth: props.initialData?.date_of_birth || "",
  contact_no: props.initialData?.contact_no || "",
  email_address: props.initialData?.email_address || user.email,
  gender: props.initialData?.gender || "",
  dzongkhag: props.initialData?.dzongkhag || "",
  gewog: props.initialData?.gewog || "",
  village: props.initialData?.village || "",

  // Education Details
  from_in_country: props.initialData?.from_in_country !== undefined ? props.initialData.from_in_country : null,
  course_title: props.initialData?.course_title || "",
  qualification: props.initialData?.qualification || "",
  type_of_course: props.initialData?.type_of_course || "",
  duration_of_course: props.initialData?.duration_of_course || "",
  name_of_institute: props.initialData?.name_of_institute || "",
  name_of_university: props.initialData?.name_of_university || "",
  student_id_no: props.initialData?.student_id_no || "",
  year_of_completion: props.initialData?.year_of_completion || "",
  website: props.initialData?.website || "",
  location: props.initialData?.location || "",
  country: props.initialData?.country || "",

  // Documents
  degree_certificate: null,
  academic_transcript: null,
  passport_photo: null,

  // Additional Fields
  remarks: props.initialData?.remarks || "",
  declaration: props.initialData?.declaration || false,
  is_payment_complete: props.initialData?.is_payment_complete || false,
  payment_id: props.initialData?.payment_id || null,
  status: props.initialData?.status || "applied",
});

const paymentModal = ref(null);

const openPaymentModal = () => {
  paymentModal.value.openModal();
};

const onPaymentModalClose = () => {
  console.log("Payment modal closed");
};

const onPaymentCompleted = (paymentData) => {
  form.is_payment_complete = false;
  form.payment_id = paymentData.paymentHash;
  form.status = "processing_payment";
  handleSubmitActual();
};

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(form.cid_no);
});

const genderDisplay = computed(() => {
  const genderMap = {
    M: "Male",
    F: "Female",
  };
  return genderMap[form.gender] || "";
});

watch(
  () => form.from_in_country,
  (newValue) => {
    if (newValue === true) {
      form.country = "Bhutan";
      form.course_title = "";
      form.qualification = "";
      form.type_of_course = "";
      form.duration_of_course = "";
      form.name_of_institute = "";
      form.name_of_university = "";
      form.year_of_completion = "";
      form.website = "";
      form.location = "";
      form.degree_certificate = null;
      form.academic_transcript = null;
    } else {
      form.country = "";
    }
  }
);

onMounted(async () => {
  try {
    const [qualificationsResponse, courseTypesResponse] = await Promise.all([
      apiService.getQualifications(),
      apiService.getTypesOfCourse(),
    ]);

    qualificationOptions.value = qualificationsResponse.data.results.map(
      (qual) => ({
        value: qual.id,
        label: qual.name,
      })
    );

    courseTypeOptions.value = courseTypesResponse.data.results.map((type) => ({
      value: type.id,
      label: type.name,
    }));
  } catch (error) {
    toast.error("Failed to fetch dropdown options", "error");
    console.error("Error fetching dropdown options:", error);
  }
});

const fetchDCRCData = async () => {
  //  const authStore = useAuthStore();  Removed: already defined
  const userId = authStore.userId;

  if (!isCIDValid.value) {
    toast.error("Please enter a valid 11-digit CID");
    return;
  }
  if (!userId) {
    toast.error("User is not logged in or user ID is unavailable.");
    return;
  }

  isLoadingDCRC.value = true;
  try {
    const response = await apiService.fetchCitizenDetails(form.cid_no, { params: { user_id: userId } });

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };

    Object.assign(form, {
      cid_no: response.data.cid_no,
      applicants_name: response.data.applicants_name,
      date_of_birth: formatDate(response.data.date_of_birth),
      gender: response.data.gender,
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village,
    });

    if (response.data.changes_saved) {
      toast.success("DCRC data fetched and user profile updated successfully");
    } else {
      toast.success("DCRC data fetched successfully");
    }

  } catch (error) {
    toast.error("Failed to fetch DCRC data");
    console.error("Error fetching DCRC data:", error);
  } finally {
    isLoadingDCRC.value = false;
  }
};

const fetchRUBData = async () => {
  isLoadingRUB.value = true;
  try {
    const response = await apiService.fetchRubDetails(form.cid_no, form.student_id_no);
    if (response.data) {

      form.name_of_institute = response.data.organisationName || '';
      form.name_of_university = "Royal University of Bhutan";
      form.course_title = response.data.programmeName || '';
      form.year_of_completion = response.data.passYear || '';
      form.website = response.data.website || 'https://rub.gov.bt';
      form.duration_of_course = response.data.duration || '';

      let courseTypeId = null;
      const newCourseTypeName = response.data.level;

      const existingCourseType = courseTypeOptions.value.find(type => type.label === newCourseTypeName);

      if (existingCourseType) {
        courseTypeId = existingCourseType.value;
      } else {
        try {
          const addCourseTypeResponse = await apiService.createTypeOfCourse({
            name: newCourseTypeName,
            definition: newCourseTypeName,
          });

          const newCourseType = addCourseTypeResponse.data;
          courseTypeId = newCourseType.id;

          courseTypeOptions.value.push({ value: newCourseType.id, label: newCourseType.name });

        } catch (addError) {
          console.error("Error adding course type:", addError);
          const errorMessage = addError.response?.data?.message || addError.message || "Unknown error";
          toast.error(`Failed to add course type "${newCourseTypeName}": ${errorMessage}`);
          isLoadingRUB.value = false;
          return;
        }
      }
      form.type_of_course = courseTypeId;
      toast.success("RUB data fetched successfully");
    } else {
      toast.error("No RUB data found for provided IDs.");
    }
  } catch (error) {
    console.error("Error fetching RUB data:", error);
    const errorMessage = error.response?.data?.message || error.message || "Unknown error";
    toast.error(`Failed to fetch RUB data: ${errorMessage}`);
  } finally {
    isLoadingRUB.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const handleSubmit = () => {
  if (form.declaration) {
    openPaymentModal();
  } else {
    toast.error("Please accept the declaration");
  }
};

const handleSaveAsDraft = async () => {
  form.status = "draft";
  await handleSubmitActual(true); // Pass a flag to indicate it's a draft
};

const handleSubmitActual = async (isDraft = false) => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();

    // Build FormData
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        let value = form[key];

        if (value instanceof File) {
          formData.append(key, value);
        }
        else if (key === 'date_of_birth') {
          formData.append(key, formatDate(value));
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
        else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    }

    // Only make the main request if it's not a draft, OR, if payment is complete.  Drafts should save even if no payment.
    if (!isDraft) {
      // Payment Request (only if not a draft)
      const paymentData = {
        platform: 'web',
        refNo: form.payment_id,  // Use the payment_id from the form
        taxPayerNo: form.cid_no,
        taxPayerDocumentNo: 'BAOW', //AGENCYCODE replaced with literal as per instructions
        payerEmail: form.email_address,
        mobileNo: form.contact_no,
        totalPayableAmount: 1000.00,
        serviceCode: 'BAOW',    //AGENCYCODE replaced with literal as per instructions
        description: 'Payment for ROQ',
        payableAmount: 1000.00,
        taxPayerName: form.applicants_name,
        application_no: form.payment_id, // Use payment_id, consistent with refNo
        app_type: 'ROQ',
        user_id: authStore.userId,
      };
      try {
        const paymentResponse = await apiService.makePayment(paymentData);
        console.log("Payment Response:", paymentResponse);

        //Check payment response status, if needed.

        if (paymentResponse.status !== 201 && paymentResponse.status !== 200) { // Check success
          throw new Error("Payment request failed"); // important - throw error to prevent main request.
        }

      } catch (paymentError) {
        console.error("Error making payment:", paymentError);
        toast.error("Payment request failed: " + (paymentError.response?.data?.message || paymentError.message));
        isSubmitting.value = false; // Reset before returning.
        return; // Stop execution if payment fails
      }
    }

    let response;
    if (props.mode === "edit") {
      response = await apiService.updateRecognitionOfQualification(
        props.initialData.id,
        formData
      );
      if (response.status === 200) {
        toast.success("Application updated successfully");
      }
    } else {
      response = await apiService.createRecognitionOfQualification(formData);
      if (response.status === 201) {
        if (isDraft) {
          toast.success("Application saved as draft");
        } else {
          toast.success("Application submitted successfully. Please check your email to complete the payment.");
          emit("application-submitted");
        }
      }
    }
    emit("submitted"); // Emit 'submitted' for both create and edit on success

  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error);
    const errorMessage =
      error.response?.data?.message || "Failed to save application";
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};

// Helper function to extract file name from URL
const getFileNameFromUrl = (url) => {
  if (!url) return '';
  return url.substring(url.lastIndexOf('/') + 1);
};

const emit = defineEmits([
  "application-submitted",
  "close-modal",
  "submitted",
]);

const handleCIDInput = (event) => {
  const input = event.target.value.replace(/\D/g, ''); // Remove non-digits
  form.cid_no = input.slice(0, 11); // Limit to 11 digits

  if (form.cid_no.length === 11) {
    fetchDCRCData();
  }
};
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
