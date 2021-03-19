<template>
  <!-- Use a simpler v-if for the entire modal -->
  <div v-if="application" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

      <!-- Certificate Container -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Certificate Content -->
        <div id="certificate-content" class="bg-white px-8 pt-8 pb-6 relative min-h-[842px]">
          <!-- A4 proportions -->
          <!-- Watermark -->
          <div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <img src="@/assets/engineering-logo.png" alt="Watermark" class="w-2/3 max-w-xl" />
          </div>

          <!-- Header Section -->
          <div class="flex justify-between items-start mb-8">
            <!-- Left Logo -->
            <div class="text-center w-32">
              <img src="@/assets/rgob.png" alt="RGOB Logo" class="h-24 mx-auto" />
              <p class="mt-2 text-sm font-semibold">BQPCA</p>
            </div>

            <!-- Center Title -->
            <div class="text-center flex-1 px-8">
              <h3 class="text-lg font-medium text-gray-900 leading-7">
                Royal Government of Bhutan<br />
                Engineering Professionals Council<br />
                Bhutan Qualifications and Professionals Certification<br />
                Authority<br />
                Thimphu : Bhutan
              </h3>
              <h2 class="text-2xl font-bold text-blue-900 mt-6">CERTIFICATE OF REGISTRATION</h2>
            </div>

            <!-- Right Logo -->
            <div class="text-center w-32">
              <img src="@/assets/engineering-logo.png" alt="EPC Logo" class="h-24 mx-auto" />
              <p class="mt-2 text-sm font-semibold">EPC</p>
            </div>
          </div>

          <!-- Main Content -->
          <div class="mt-8 relative">
            <!-- Certificate Details Grid -->
            <div class="grid grid-cols-[200px_1fr] gap-y-4 text-sm px-12">
              <div class="font-semibold">Name:</div>
              <div>{{ application.full_name }}</div>

              <div class="font-semibold">Citizenship ID No.:</div>
              <div>{{ application.cid_no }}</div>

              <div class="font-semibold">Registration No.:</div>
              <div>{{ application.registration_no }}</div>

              <div class="font-semibold">Category:</div>
              <div>Engineering Professional</div>

              <div class="font-semibold">Sub-category:</div>
              <div>{{ getSubcategory() }}</div>

              <div class="font-semibold">Date of Initial Registration:</div>
              <div>{{ formatDate(application.registration_date) }}</div>

              <div class="font-semibold">Registration Expiry Date:</div>
              <div>{{ formatDate(application.expiry_date) }}</div>

              <div class="font-semibold">Registration Status:</div>
              <div>Registered</div>

              <div class="font-semibold">Registration Type:</div>
              <div>{{ application.registration_type || 'Full Registration' }}</div>

              <div class="font-semibold">Qualification(s):</div>
              <div class="space-y-1">
                <div v-for="qual in getQualifications()" :key="qual.id">
                  {{ qual.qualification_type_display || 'Engineering' }} | {{ qual.qualification_name || qual.qualification_name_display || 'Engineering Degree' }} | {{
                    qual.completion_year || formatYearOnly(qual.completion_date)
                  }}
                </div>
              </div>
            </div>

            <!-- Passport Photo -->
            <div class="absolute top-0 right-12">
              <img v-if="getProfilePhoto()" :src="getProfilePhoto()" alt="Passport Photo"
                class="h-32 w-32 object-cover rounded-md border-2 border-gray-300 shadow-sm" />
            </div>

            <!-- Certificate Text -->
            <div class="mt-8 px-12 space-y-4 text-sm">
              <p>Valid till the expiry date until and unless suspend/revoked or de-registered by the Council.</p>
              <p class="text-justify">
                It is hereby certified that the above description of the name, registration number, and date of
                registration
                of the registered Engineering Professional is a true copy of the entries in the register relating
                to the professional named above.
              </p>
            </div>

            <!-- Footer Section -->
            <div class="mt-12 px-12 flex justify-between items-end">
              <!-- Signature Section -->
              <div>
                <img v-if="getSignature()" :src="getSignature()" alt="Signature" class="h-16" />
                <div class="mt-2 text-sm">
                  <p class="font-medium">Lobzang Thapke</p>
                  <p>Director</p>
                  <p class="mt-1">Dated: {{ formatDate(getDateIssued()) }}</p>
                </div>
              </div>

              <!-- QR Code -->
              <div class="text-center">
                <vue-qrcode :value="qrCodeData" :options="{
                  width: 100,
                  margin: 1,
                  color: {
                    dark: '#000000',
                    light: '#ffffff'
                  }
                }" class="border-4 border-gray-200 rounded-md p-2" />
                <p class="mt-2 text-xs text-gray-600">Scan to verify</p>
              </div>
            </div>

            <!-- Disclaimer -->
            <p class="mt-8 text-sm text-gray-600 text-center px-12">
              The information contained in this certificate reflects the information held by Engineering Professionals Council as at the above dated.
            </p>

          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
          <button type="button"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            @click="downloadCertificate">
            Download
          </button>
          <button type="button"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  application: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const qrCodeData = computed(() => {
  const baseUrl = window.location.origin;
  return props.application
    ? `${baseUrl}/certification-validity/search?service_type=engineering_certification&cert_number=${props.application.registration_no}`
    : '';
});

// Handle different data structures
const getQualifications = () => {
  if (!props.application) return [];
  
  // Check for results array (from API)
  if (props.application.results && Array.isArray(props.application.results) && props.application.results[0]) {
    const app = props.application.results[0];
    return app.user_qualifications || [];
  }
  
  // Direct qualifications array
  if (props.application.user_qualifications && Array.isArray(props.application.user_qualifications)) {
    return props.application.user_qualifications;
  }
  
  return [];
};

const getSubcategory = () => {
  const qualifications = getQualifications();
  if (qualifications.length > 0 && qualifications[0].category) {
    return qualifications[0].category;
  }
  
  // Attempt to determine from qualification name
  if (qualifications.length > 0 && qualifications[0].qualification_name) {
    const name = qualifications[0].qualification_name.toLowerCase();
    if (name.includes('civil')) return 'Civil Engineer';
    if (name.includes('electrical')) return 'Electrical Engineer';
    if (name.includes('mechanical')) return 'Mechanical Engineer';
    if (name.includes('computer')) return 'Computer Engineer';
    if (name.includes('architecture')) return 'Architect';
  }
  
  return 'Engineer';
};

const getProfilePhoto = () => {
  if (!props.application) return null;
  
  // Check different possible locations for the photo
  if (props.application.results && props.application.results[0]) {
    return props.application.results[0].passport_photo || props.application.results[0].profile_photo_url;
  }
  
  return props.application.passport_photo || props.application.profile_photo_url;
};

const getSignature = () => {
  const qualifications = getQualifications();
  if (qualifications.length > 0 && qualifications[0].e_signature) {
    return qualifications[0].e_signature;
  }
  
  if (props.application.results && props.application.results[0] && props.application.results[0].e_signature) {
    return props.application.results[0].e_signature;
  }
  
  return null;
};

const getDateIssued = () => {
  if (!props.application) return new Date().toISOString();
  
  const qualifications = getQualifications();
  if (qualifications.length > 0 && qualifications[0].updated_at) {
    return qualifications[0].updated_at;
  }
  
  if (props.application.results && props.application.results[0]) {
    const app = props.application.results[0];
    return app.approved_date || app.updated_at || app.created_at;
  }
  
  return props.application.approved_date || props.application.updated_at || props.application.created_at || new Date().toISOString();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');
};

const formatYearOnly = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

const downloadCertificate = () => {
  const element = document.getElementById('certificate-content');
  const opt = {
    margin: 0,
    filename: `engineering_certification_${props.application.registration_no || 'certificate'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
};
</script>
