<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" @click.self="closeModal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 no-print">
    <!-- Modal Panel -->
    <div v-if="application" class="bg-gray-100 rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">

        <!-- Modal Header with Controls (will not be printed) -->
        <div class="p-4 bg-white border-b sticky top-0 z-20 flex justify-between items-center no-print">
            <h2 class="text-xl font-bold text-gray-800">Accreditation Certificate Preview</h2>
            <div>
                 <button
                  @click="downloadCertificate"
                  class="bg-green-600 text-white px-5 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors mr-2"
                >
                  Download PDF
                </button>

                <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">×</button>
            </div>
        </div>

        <!-- Certificate Display Area -->
        <div class="p-2 sm:p-6">
            <div ref="certificatePrintArea" class="certificate-container bg-white font-serif text-gray-800">
              <div class="relative border-2 border-gray-700 p-6 sm:p-10">

                <!-- Decorative Corner Images -->
                <img :src="cornerTopLeft" alt="Top Left Border" class="absolute top-0 left-0 w-24 h-24 object-contain">
                <img :src="cornerTopRight" alt="Top Right Border" class="absolute top-0 right-0 w-24 h-24 object-contain">
                <img :src="cornerBottomLeft" alt="Bottom Left Border" class="absolute bottom-0 left-0 w-24 h-24 object-contain">
                <img :src="cornerBottomRight" alt="Bottom Right Border" class="absolute bottom-0 right-0 w-24 h-24 object-contain">


                <!-- Certificate Content -->
                <div class="relative z-10">
                  <header class="mb-4">
                    <!-- === LOGOS & TITLES SECTION === -->
                    <div class="text-center my-4 sm:my-6">
                      <!-- LOGOS -->
                      <div class="flex justify-around items-center px-4 sm:px-8 mb-2">
                        <img :src="rgobLogo" alt="Royal Government of Bhutan Logo" class="h-20 sm:h-24 w-auto object-contain">
                        <img :src="sherigLogo" alt="Ministry of Education and Skills Development Logo" class="h-20 sm:h-24 w-auto object-contain">
                        <img :src="accredLogo" alt="BQPCA Accreditation Logo" class="h-20 sm:h-24 w-auto object-contain">
                      </div>
                      <p class="text-base sm:text-lg font-semibold mt-2 mb-4">འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།</p>
                      <div class="inline-block">
                        <h2 class="text-base sm:text-lg font-semibold uppercase tracking-wider">
                          Bhutan Qualifications and Professionals Certification Authority
                        </h2>
                        <div class="h-px border-b-4 border-double border-gray-700 mt-1"></div>
                      </div>

                    </div>
                  </header>

                  <!-- Certificate Number -->
                  <div class="mt-4 sm:mt-6 text-left">
                     <p class="text-sm font-semibold">Accreditation Certificate No. {{ application.application_reference_no || 'N/A' }}</p>
                  </div>

                  <main class="text-center my-8 sm:my-10">
                    <h1 class="text-3xl sm:text-4xl font-bold uppercase tracking-widest mb-8 sm:mb-10">
                      Certificate of Accreditation
                    </h1>
                    <p class="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                      This is to certify that
                      <span class="font-bold text-xl sm:text-2xl block my-3">{{ application.institute_profile_details.name }}</span>
                      is accredited by the
                      <span class="font-semibold block mt-1">Higher Education Quality Council,</span>
                      <span class="font-semibold block mt-2">Bhutan Qualifications and Professionals Certification Authority</span>
                      with <span class="font-bold">{{ application.final_grade_awarded_details.rating_category_name }}</span> and is valid until {{ formattedValidityDate }}.
                    </p>
                  </main>

                  <!-- === FOOTER - RESTRUCTURED TO 3 COLUMNS === -->
                  <footer class="mt-16 sm:mt-24">
                    <div class="flex justify-between items-end">
                      <!-- Left: Date -->
                      <div class="text-left">
                        <p><span class="font-semibold">Date:</span> {{ formattedIssueDate }}</p>
                      </div>

                      <!-- Middle: Director -->
                      <div class="text-center">
                          <div class="border-b-2 border-gray-600 w-48 mb-1"></div>
                          <p class="font-semibold">Director</p>
                      </div>

                      <!-- Right: Seal -->
                      <div class="text-right">
                         <div v-if="application.seal_url" class="h-24 w-24 sm:h-28 sm:w-28 inline-block">
                            <img :src="application.seal_url" alt="Official Seal" class="h-full w-full">
                         </div>
                         <div v-else class="h-24 w-24 sm:h-28 sm:w-28 bg-gray-200 rounded-full flex items-center justify-center inline-block">
                              <span class="text-xs text-gray-500">Seal</span>
                         </div>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// === LOGO & CORNER IMPORTS ===
import rgobLogo from '@/assets/rgob.png';
import sherigLogo from '@/assets/sherig-logo.png';
import accredLogo from '@/assets/accred-logo.png';
import cornerTopLeft from '@/assets/corner_top_left.png';
import cornerTopRight from '@/assets/corner_top_right.png';
import cornerBottomLeft from '@/assets/corner_bottom_left.png';
import cornerBottomRight from '@/assets/corner_bottom_right.png';


const props = defineProps({
  isOpen: { type: Boolean, required: true },
  application: { type: Object, default: null },
});
const emit = defineEmits(['close']);
const certificatePrintArea = ref(null);
const closeModal = () => emit('close');

const formattedIssueDate = computed(() => {
  if (!props.application?.accreditation_validity_from) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(props.application.accreditation_validity_from).toLocaleDateString('en-GB', options);
});

const formattedValidityDate = computed(() => {
    if (!props.application?.accreditation_validity_to) return '';
    const [year, month, day] = props.application.accreditation_validity_to.split('-');
    return `${day}.${month}.${year}`;
});

const downloadCertificate = () => {
    if (!certificatePrintArea.value) {
        console.error("Certificate area not found for download.");
        return;
    }
    const appName = props.application.institute_profile_details.name || 'Certificate';
    const filename = `Accreditation-Certificate-${appName.replace(/ /g, '_')}.pdf`;
    html2canvas(certificatePrintArea.value, {
        scale: 2,
        useCORS: true,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    });
};
</script>

<style>
/* Print-specific styles */
@media print {
  body { background-color: white !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .no-print { display: none !important; }
  .certificate-container { padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; width: 100%; height: 100%; }
  .max-w-6xl { max-width: 100% !important; }
  @page { size: A4 landscape; margin: 0; }
}
</style>