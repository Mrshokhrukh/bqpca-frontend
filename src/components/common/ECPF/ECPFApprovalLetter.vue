<template>
  <div class="letter-container p-8 border rounded shadow-md bg-white">
    <div class="letterhead mb-8">
      <p class="font-bold text-xl">
        [Bhutan Qualifications and Professionals Certification Authority (BQPCA) Letterhead]
      </p>
      <hr class="border-t border-gray-400" />
    </div>

    <div class="date mb-4 text-right">Date: {{ dateOfIssuance }}</div>

    <div class="addressee mb-4">
      To:<br />
      {{ ecpfName }}<br />
      {{ ecpfAddress }}
    </div>

    <div class="subject mb-6 font-bold">Subject: {{ subject }}</div>

    <div class="approval-body mb-6">
      <p>
        This letter is to inform <strong>{{ ecpfName }}</strong> that your application for
        {{ activityDetails }} has been <strong>approved</strong> by the Bhutan Qualifications and
        Professionals Certification Authority (BQPCA).
      </p>

      <div v-if="conditions && conditions.length > 0" class="conditions mt-4">
        <p>This approval is granted subject to the following conditions:</p>
        <ul class="list-disc pl-5 mt-2">
          <li v-for="(condition, index) in conditions" :key="index">{{ condition }}</li>
        </ul>
      </div>

      <p v-if="enclosedDocument" class="mt-4">
        A {{ enclosedDocument }} is enclosed for your reference.
      </p>

      <p class="mt-4">
        Please ensure that you comply with all relevant regulations and guidelines during the
        aforementioned activity.
      </p>
    </div>

    <div class="closing">
      <p>We wish you success in your endeavors.</p>
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
  ecpfName: String,
  ecpfAddress: String,
  subject: String,
  activityDetails: String,
  conditions: {
    type: Array,
    default: () => [],
  },
  enclosedDocument: String,
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
