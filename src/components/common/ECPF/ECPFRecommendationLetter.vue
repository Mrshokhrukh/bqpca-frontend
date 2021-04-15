<template>
  <div class="letter-container p-8 border rounded shadow-md bg-white">
    <div class="letterhead mb-8">
      <p class="font-bold text-xl">
        [Bhutan Qualifications and Professionals Certification Authority (BQPCA) Letterhead]
      </p>
      <hr class="border-t border-gray-400" />
    </div>

    <div class="date mb-4 text-right">Date: {{ dateOfIssuance }}</div>

    <div class="addressee mb-4">To: {{ addressee }}</div>

    <div class="subject mb-6 font-bold">Subject: {{ subject }}</div>

    <div class="recommendation-body mb-6">
      <p>
        This letter serves as a formal recommendation from the Bhutan Qualifications and
        Professionals Certification Authority (BQPCA) for the application submitted by
        <strong>{{ applicantName }}</strong> regarding {{ purpose }}.
      </p>
      <p class="mt-4">
        Having reviewed the submitted proposal and supporting documentation, BQPCA confirms that
        <strong>{{ applicantName }}</strong> has met the necessary {{ keyCriteria }}.
      </p>
      <p class="mt-4">
        Therefore, BQPCA recommends that the relevant authorities consider granting
        {{ specificRequest }}.
      </p>
    </div>

    <div class="closing">
      <p>For any further inquiries, please do not hesitate to contact us.</p>
      <p class="mt-8">Sincerely,</p>
      <div class="signature mt-4">
        <p>
          <strong>{{ authorizingOfficerName }}</strong>
        </p>
        <p>{{ authorizingOfficerTitle }}</p>
        <p>[Signature]</p>
        <hr class="w-32 border-t border-gray-400" />
        <!-- Placeholder for Signature -->
      </div>
      <div class="contact-info mt-4">
        <p>[Contact Information of BQPCA]</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dateOfIssuance: String,
  addressee: String,
  subject: String,
  applicantName: String,
  purpose: String,
  keyCriteria: String,
  specificRequest: String,
  authorizingOfficerName: String,
  authorizingOfficerTitle: String,
})
</script>

<style scoped>
.letter-container {
  font-family: sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

.letterhead {
  text-align: center;
}

.date,
.addressee {
  text-align: left;
}

.subject {
  text-align: center;
}

.closing {
  text-align: left;
}

.signature {
  margin-top: 20px;
}

.contact-info {
  margin-top: 10px;
  font-size: 0.9em;
  color: gray;
}
</style>
