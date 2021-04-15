<template>
  <div class="certificate-container">
    <div class="certificate">
      <!-- Header with logos -->
      <div class="header">
        <div class="logo">
          <img
            src=".@/assets/rgob.png"
            alt="BQPCA Logo"
            onerror="this.style.display='none'; this.parentNode.classList.add('logo-placeholder'); this.parentNode.textContent='BQPCA';"
          />
        </div>
        <div class="title-container">
          <h2>Royal Government of Bhutan</h2>
          <h3>Engineering Professional Council</h3>
          <h4>Bhutan Qualifications and Professionals Certification Authority</h4>
          <p>Thimphu : Bhutan</p>
        </div>
        <div class="logo">
          <img
            src=".@/assets/epc-logo.png"
            alt="EPC Logo"
            onerror="this.style.display='none'; this.parentNode.classList.add('logo-placeholder'); this.parentNode.textContent='EPC';"
          />
        </div>
      </div>

      <!-- Certificate title -->
      <h1 class="certificate-title">CERTIFICATE OF RECOGNITION</h1>

      <!-- Certificate content -->
      <div class="certificate-content">
        <div class="certificate-field">
          <p>
            Name of the engineering institute: <span>{{ instituteName }}</span>
          </p>
        </div>
        <div class="certificate-field">
          <p>
            Date of initial registration: <span>{{ initialRegistrationDate }}</span>
          </p>
        </div>
        <div class="certificate-field">
          <p>
            Last renewal: <span>{{ lastRenewalDate }}</span>
          </p>
        </div>
        <div class="certificate-field">
          <p>
            Registration expiry date: <span>{{ expiryDate }}</span>
          </p>
        </div>
        <div class="certificate-field">
          <p>
            Programs registered: <span>{{ programs }}</span>
          </p>
        </div>

        <div class="certificate-note">
          <p>
            This certificate is valid for a period of five years from the date of issue unless
            suspended or revoked by the Council.
          </p>
        </div>

        <div class="certificate-footer">
          <p>
            It is hereby certified that the above description of the name, registration number, and
            date of registration of the registered Engineering institute is a true copy of the
            entries in the register relating to the institute named above
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  instituteName: {
    type: String,
    required: true,
  },
  initialRegistrationDate: {
    type: String,
    default: '-',
  },
  lastRenewalDate: {
    type: String,
    default: '-',
  },
  expiryDate: {
    type: String,
    required: true,
  },
  programs: {
    type: String,
    default: '-',
  },
})
</script>

<style scoped>
.certificate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.certificate {
  width: 210mm;
  /* A4 width */
  min-height: 297mm;
  /* A4 height */
  padding: 40px;
  border: 5px solid #1a4b8c;
  background-color: white;
  position: relative;
  font-family: 'Times New Roman', Times, serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  max-width: 100%;
  max-height: 100%;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #333;
}

.title-container {
  text-align: center;
}

.title-container h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.title-container h3 {
  font-size: 20px;
  margin-bottom: 5px;
}

.title-container h4 {
  font-size: 16px;
  margin-bottom: 5px;
}

.title-container p {
  font-size: 14px;
}

.certificate-title {
  text-align: center;
  font-size: 32px;
  color: #1a4b8c;
  margin: 40px 0;
}

.certificate-content {
  margin-top: 60px;
}

.certificate-field {
  margin-bottom: 20px;
}

.certificate-field p {
  font-size: 18px;
  line-height: 1.6;
}

.certificate-field span {
  font-weight: bold;
  text-decoration: underline;
}

.certificate-note {
  margin-top: 40px;
  font-style: italic;
}

.certificate-footer {
  margin-top: 40px;
  line-height: 1.6;
}

@media print {
  .certificate {
    border: 5px solid #1a4b8c !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
