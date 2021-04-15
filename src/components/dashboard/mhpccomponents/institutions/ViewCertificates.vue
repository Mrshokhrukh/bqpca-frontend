<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">View Certificate</h2>

    <div class="bg-white border rounded-xl shadow-sm p-6" v-if="certificateDetails">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>

      <p class="text-gray-700">
        <strong>Certificate Number:</strong> {{ certificateDetails.certificateNumber }}
      </p>
      <p class="text-gray-700">
        <strong>Applicant Name:</strong> {{ certificateDetails.applicantName }}
      </p>
      <p class="text-gray-700">
        <strong>Institution:</strong> {{ certificateDetails.institutionName }}
      </p>
      <p class="text-gray-700"><strong>Issued Date:</strong> {{ certificateDetails.issuedDate }}</p>

      <div class="mt-8 flex justify-center">
        <button
          @click="downloadCertificate"
          class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Download Certificate
        </button>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Certificate Preview</h3>
        <!-- Certificate Preview (Optional) -->
        <div id="certificate-preview" class="border border-gray-300 rounded-md p-4">
          <!-- This is where a dynamic certificate preview could go (e.g., using a canvas) -->
          <p class="text-gray-500 italic text-center">Certificate preview will appear here.</p>
        </div>
      </div>
    </div>

    <div class="bg-white border rounded-xl shadow-sm p-6" v-else>
      <p class="text-gray-700">
        Please enter your Application Number to retrieve your Certificate.
      </p>
      <div class="mt-4">
        <label for="applicationNumber" class="block text-sm font-medium text-gray-700"
          >Application Number:</label
        >
        <input
          type="text"
          id="applicationNumber"
          v-model="applicationNumber"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="Enter Application Number"
        />
      </div>
      <div class="flex justify-end mt-4">
        <button
          @click="getCertificateDetails"
          class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Retrieve Certificate
        </button>
      </div>
      <!-- Display Application Status -->
      <div v-if="!certificateDetails && status" class="mt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Details:</h3>
        <div class="bg-gray-50 border rounded-lg p-4">
          <template>
            <p class="text-gray-700">
              Status: <span class="font-semibold">{{ status }}</span>
            </p>
          </template>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative"
        role="alert"
      >
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf' // Import jsPDF

const certificateDetails = ref(null)
const applicationNumber = ref('')
const errorMessage = ref('')
const status = ref('')

const getCertificateDetails = async () => {
  try {
    // Replace with your actual API call to fetch certificate details
    const response = await simulateApiCall(applicationNumber.value) // Replace with your API endpoint
    if (response) {
      certificateDetails.value = response
      status.value = null
    } else {
      errorMessage.value = 'Certificate not found for this Application Number.'
      certificateDetails.value = null
      status.value = 'Certificate not found for this Application Number.'
    }
  } catch (error) {
    console.error('Error fetching certificate details:', error)
    errorMessage.value = 'Failed to fetch certificate details. Please try again later.'
    certificateDetails.value = null
  }
}

const simulateApiCall = async (applicationNumber) => {
  // Simulate an API call with a delay and some fake data
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Dummy certificate data (replace with your actual data)
  if (applicationNumber === 'DPR-2024-001') {
    return {
      certificateNumber: 'CERT-2024-001',
      applicantName: 'John Doe',
      institutionName: 'Example Medical College',
      issuedDate: '2024-10-27',
    }
  } else {
    status.value = 'Pending'
  }

  return null // Certificate not found
}

const downloadCertificate = () => {
  if (!certificateDetails.value) {
    alert('No certificate to download!')
    return
  }

  // Simple certificate generation using jsPDF
  const doc = new jsPDF()

  // Certificate header
  doc.setFontSize(22)
  doc.setTextColor(40)
  doc.text('Certificate of Approval', 105, 20, null, null, 'center')

  // Certificate details
  doc.setFontSize(16)
  doc.text(`Certificate Number: ${certificateDetails.value.certificateNumber}`, 20, 40)
  doc.text(`Applicant Name: ${certificateDetails.value.applicantName}`, 20, 50)
  doc.text(`Institution: ${certificateDetails.value.institutionName}`, 20, 60)
  doc.text(`Issued Date: ${certificateDetails.value.issuedDate}`, 20, 70)

  // Signature area
  doc.setFontSize(12)
  doc.text('Authorized Signature', 150, 90)
  doc.line(150, 95, 190, 95) // Signature line

  // Footer
  doc.setFontSize(10)
  doc.text('Issued by [Your Authority]', 105, 290, null, null, 'center')

  // Save the PDF
  doc.save('certificate.pdf')
}
</script>
