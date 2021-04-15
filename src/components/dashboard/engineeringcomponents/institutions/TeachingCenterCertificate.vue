<template>
  <div class="certificate-container" ref="certificateRef">
    <!-- Certificate Header -->
    <div class="certificate-header">
      <div class="logo-container">
        <img src="../../../../assets/rgob.png" alt="BQPCA Logo" class="logo" />
      </div>
      <div class="certificate-title">
        <h2 class="text-center">Royal Government of Bhutan</h2>
        <h3 class="text-center">Engineering Professionals Council</h3>
        <h4 class="text-center">Bhutan Qualifications and Professionals Certification Authority</h4>
        <h5 class="text-center">Thimphu : Bhutan</h5>
      </div>
      <div class="logo-container">
        <img src="../../../../assets/engineering-logo.png" alt="EPC Logo" class="logo" />
      </div>
    </div>

    <!-- Certificate Title -->
    <div class="certificate-main-title">
      <h1 class="text-center text-blue-800">CERTIFICATE OF RECOGNITION</h1>
    </div>

    <!-- Certificate Content -->
    <div class="certificate-content">
      <div v-if="certType === 'teaching-center'">
        <div class="certificate-field">
          <p><strong>Name of the teaching center:</strong> {{ centerData.center_name }}</p>
        </div>
        <div class="certificate-field">
          <p>
            <strong>Date of initial registration:</strong> {{ formatDate(centerData.valid_since) }}
          </p>
        </div>
        <div class="certificate-field">
          <p><strong>Last renewal:</strong> {{ formatDate(centerData.last_renewal_date) }}</p>
        </div>
        <div class="certificate-field">
          <p><strong>Registration expiry date:</strong> {{ formatDate(centerData.valid_till) }}</p>
        </div>
        <div class="certificate-field">
          <p><strong>Teaching center allocated to:</strong> {{ centerData.institute_name }}</p>
        </div>
      </div>
      <div v-else>
        <div class="certificate-field">
          <p><strong>Name of the engineering institute:</strong> {{ centerData.institute_name }}</p>
        </div>
        <div class="certificate-field">
          <p>
            <strong>Date of initial registration:</strong> {{ formatDate(centerData.valid_since) }}
          </p>
        </div>
        <div class="certificate-field">
          <p><strong>Last renewal:</strong> {{ formatDate(centerData.last_renewal_date) }}</p>
        </div>
        <div class="certificate-field">
          <p><strong>Registration expiry date:</strong> {{ formatDate(centerData.valid_till) }}</p>
        </div>
        <div class="certificate-field">
          <p><strong>Programs registered:</strong> {{ centerData.target_category }}</p>
        </div>
      </div>

      <!-- Certificate Disclaimer -->
      <div class="certificate-disclaimer mt-6">
        <p>
          This certificate is valid for a period of five years from the date of issue unless
          suspended or revoked by the Council.
        </p>
      </div>

      <!-- Certificate Footer -->
      <div class="certificate-footer mt-4">
        <p>
          It is hereby certified that the above description of the name, registration number, and
          date of registration of the registered
          {{ certType === 'teaching-center' ? 'teaching center' : 'engineering institute' }} is a
          true copy of the entries in the register relating to the
          {{ certType === 'teaching-center' ? 'teaching center' : 'institute' }} named above.
        </p>
      </div>

      <!-- Signature Area -->
      <div class="signature-area mt-8">
        <div class="signature-box">
          <div class="signature-line"></div>
          <p class="text-center">Registrar</p>
          <p class="text-center">Engineering Professionals Council</p>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <p class="text-center">President</p>
          <p class="text-center">Engineering Professionals Council</p>
        </div>
      </div>

      <!-- Official Seal Area -->
      <div class="seal-area mt-8 text-center">
        <p>(Official Seal)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'

const props = defineProps({
  centerData: {
    type: Object,
    required: true,
  },
  certType: {
    type: String,
    default: 'teaching-center', // or 'engineering-institute'
    validator: (value) => ['teaching-center', 'engineering-institute'].includes(value),
  },
  showPrintButton: {
    type: Boolean,
    default: false,
  },
})

const certificateRef = ref(null)

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'N/A'
  }
}

// Export to PDF function
const exportToPDF = () => {
  if (!certificateRef.value) return

  const element = certificateRef.value
  const opt = {
    margin: 1,
    filename: `${props.certType === 'teaching-center' ? 'teaching-center' : 'engineering-institute'}-certificate.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
  }

  html2pdf().set(opt).from(element).save()
}

// Expose exportToPDF for parent components
defineExpose({ exportToPDF })
</script>

<style scoped>
.certificate-container {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 20mm;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  font-family: 'Times New Roman', Times, serif;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logo-container {
  width: 80px;
  height: 80px;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.certificate-title {
  text-align: center;
  flex-grow: 1;
}

.certificate-main-title {
  text-align: center;
  margin: 30px 0;
  color: #1e429f;
  border-bottom: 2px solid #1e429f;
  padding-bottom: 10px;
}

.certificate-content {
  margin-top: 40px;
}

.certificate-field {
  margin-bottom: 20px;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 5px;
}

.certificate-disclaimer {
  margin-top: 30px;
  font-size: 0.9em;
}

.certificate-footer {
  margin-top: 20px;
  font-size: 0.9em;
}

.signature-area {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
}

.signature-box {
  width: 40%;
  text-align: center;
}

.signature-line {
  border-top: 1px solid black;
  margin-bottom: 10px;
}

.seal-area {
  margin-top: 40px;
  font-style: italic;
}
</style>
