<template>
  <div class="certificate-print-wrapper bg-gray-200 p-8">
    <div class="certificate-container" ref="certificateRef">
      <div class="certificate-double-border">
        <div class="certificate-main-content">
          <div class="certificate-header">
            <div class="logo-container">
              <img src="../../../../assets/rgob.png" alt="RGoB Logo" class="logo" />
            </div>
            <div class="certificate-title">
              <h2 class="text-2xl font-bold">Royal Government of Bhutan</h2>
              <h3 class="text-xl">Medical and Health Professionals Council</h3>
              <h4 class="text-lg">Bhutan Qualifications and Professionals Certification Authority</h4>
              <h5 class="text-md">Thimphu : Bhutan</h5>
            </div>
            <div class="logo-container">
              <img src="../../../../assets/mhpc-logo.png" alt="MHPC Logo" class="logo" />
            </div>
          </div>

          <div class="certificate-main-title my-8">
            <h1 class="text-4xl font-bold tracking-wider">CERTIFICATE OF RECOGNITION</h1>
          </div>

          <div class="certificate-body-content">
            <div v-if="certType === 'teaching-center'" class="space-y-4">
              <p><strong>Name of the teaching hospital:</strong> {{ centerData.center_name }}</p>
              <p><strong>Date of initial registration:</strong> {{ formatDate(centerData.valid_since) }}</p>
              <p><strong>Last renewal:</strong> {{ formatDate(centerData.last_renewal_date) }}</p>
              <p><strong>Registration expiry date:</strong> {{ formatDate(centerData.valid_till) }}</p>
              <p><strong>Teaching hospital allocated to:</strong> {{ centerData.institute_name }}</p>
            </div>
            <div v-else class="space-y-4">
              <p><strong>Name of the medical and health institute:</strong> {{ centerData.institute_name }}</p>
              <p><strong>Date of initial registration:</strong> {{ formatDate(centerData.valid_since) }}</p>
              <p><strong>Last renewal:</strong> {{ formatDate(centerData.last_renewal_date) }}</p>
              <p><strong>Registration expiry date:</strong> {{ formatDate(centerData.valid_till) }}</p>
              <p><strong>Programs registered:</strong> {{ centerData.target_category }}</p>
            </div>

            <div class="certificate-disclaimer mt-10">
              <p>This certificate is valid for a period of one year from the date of issue unless suspended or revoked by the Council.</p>
            </div>

            <div class="certificate-footer mt-6">
              <p>It is hereby certified that the above description of the name, registration number, and date of registration of the registered {{ certType === 'teaching-center' ? 'teaching hospital' : 'Medical and Health institute' }} is a true copy of the entries in the register relating to the {{ certType === 'teaching-center' ? 'teaching hospital' : 'institute' }} named above.</p>
            </div>

            <div class="signature-area mt-16 flex justify-between items-center">
              <div class="signature-box text-center">
                <div class="signature-line"></div>
                <p class="font-semibold">Registrar</p>
                <p>Medical and Health Professionals Council</p>
              </div>
              <div class="seal-area">
                <div class="seal">
                  <span class="seal-star">★</span>
                  <span class="seal-text">Official Seal</span>
                </div>
              </div>
              <div class="signature-box text-center">
                <div class="signature-line"></div>
                <p class="font-semibold">President</p>
                <p>Medical and Health Professionals Council</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'

// For best results, add these fonts to your project's main index.html:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Source+Serif+Pro:wght@400;700&display=swap" rel="stylesheet">


const props = defineProps({
  centerData: {
    type: Object,
    required: true,
  },
  certType: {
    type: String,
    default: 'teaching-center',
    validator: (value) => ['teaching-center', 'medical-institute'].includes(value),
  },
})

const certificateRef = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long', // Using 'long' month for a more formal look
      year: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'N/A'
  }
}

const exportToPDF = () => {
  if (!certificateRef.value) return

  const element = certificateRef.value
  const opt = {
    margin: 0,
    filename: `${props.certType === 'teaching-center' ? 'teaching-hospital' : 'medical-institute'}-certificate.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale: 4, // Higher scale for better resolution
      useCORS: true,
      dpi: 300,
      letterRendering: true,
    },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }

  html2pdf().set(opt).from(element).save()
}

defineExpose({ exportToPDF })
</script>

<style scoped>
/* Define a professional color palette */
:root {
  --color-navy: #1e429f;
  --color-gold: #c09a58;
  --color-crimson: #a91e2c;
  --color-dark-text: #2c3e50;
  --color-body-text: #485460;
  --color-light-gray: #f1f2f6;
  --color-background: #ffffff;
}

.certificate-container {
  font-family: 'Source Serif Pro', serif;
  background: var(--color-background);
  width: 210mm; /* A4 width */
  height: 297mm; /* A4 height */
  margin: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  color: var(--color-dark-text);
  box-sizing: border-box;
}

/* A more elegant double border */
.certificate-double-border {
  border: 10px solid var(--color-navy);
  flex-grow: 1;
  margin: 15px;
  padding: 5px;
  display: flex;
  /* IMPROVEMENT: Removed background-image for a plain look */
  background-color: #fafafa;
}

.certificate-main-content {
  border: 2px solid var(--color-gold);
  flex-grow: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* IMPROVEMENT: Added for watermark positioning */
  position: relative;
  z-index: 0;
}

/* IMPROVEMENT: Added watermark using the MHPC logo */
.certificate-main-content::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background-image: url('../../../../assets/mhpc-logo.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 0.07;
  z-index: -1;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  /* Position header content above the watermark */
  position: relative;
  z-index: 1;
}
.logo-container {
  /* IMPROVEMENT: Made logos bigger */
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}
.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.certificate-title h2, .certificate-title h3 {
  font-family: 'EB Garamond', serif;
  font-weight: 700;
}
.certificate-title h2 { font-size: 1.6rem; }
.certificate-title h3 { font-size: 1.3rem; margin-top: 0.25rem; }
.certificate-title h4 { font-size: 1.1rem; margin-top: 0.25rem; color: var(--color-body-text); }
.certificate-title h5 { font-size: 1rem; color: #7f8c8d; }

.certificate-main-title {
  text-align: center;
  /* Position title content above the watermark */
  position: relative;
  z-index: 1;
}
.certificate-main-title h1 {
  font-family: 'EB Garamond', serif;
  color: var(--color-navy);
  /* IMPROVEMENT: Made the main title slightly smaller */
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.certificate-body-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-body-text);
  /* Position body content above the watermark */
  position: relative;
  z-index: 1;
}
.certificate-body-content strong {
  color: var(--color-dark-text);
  font-weight: 700;
}

.certificate-disclaimer {
  text-align: center;
  font-style: italic;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.certificate-footer {
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.6;
}

.signature-area {
  align-items: flex-end; /* Align to the bottom of the items */
}

.signature-box {
  color: var(--color-dark-text);
}
.signature-box .font-semibold {
  font-weight: 700;
  margin-top: 0.25rem;
}
.signature-line {
  border-top: 1px solid #777;
  width: 220px;
  margin: 0 auto 0.5rem;
}

/* Enhanced CSS-based Seal */
.seal-area {
  width: 130px;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.seal {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: var(--color-crimson);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  border: 4px solid var(--color-gold);
  box-shadow: 0 0 5px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.2);
}
.seal::before, .seal::after {
    content: '';
    position: absolute;
    top: -9px; left: -9px;
    right: -9px; bottom: -9px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-image: repeating-conic-gradient(var(--color-crimson) 0deg 5deg, transparent 5deg 10deg) 20;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
}
.seal-star {
  font-size: 3rem;
  color: var(--color-gold);
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  line-height: 1;
}
.seal-text {
  position: absolute;
  font-size: 0.6rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  bottom: 22px;
  color: rgba(255,255,255,0.8);
}

/* Utility classes from original code if needed */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-md { font-size: 1rem; line-height: 1.5rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.tracking-wider { letter-spacing: 0.05em; }
.mt-10 { margin-top: 2.5rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-16 { margin-top: 4rem; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; }
.space-y-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(1rem * (1 - var(--tw-space-y-reverse))); margin-bottom: calc(1rem * var(--tw-space-y-reverse)); }
.flex { display: flex; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.text-center { text-align: center; }
</style>
