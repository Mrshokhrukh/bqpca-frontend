<template>
  <div class="hei-visit">
    <h2>HEI Visit Details</h2>
    <div class="visit-form">
      <div class="form-group">
        <label>Visit Date:</label>
        <input type="date" v-model="visitDate" />
      </div>
      <div class="form-group">
        <label>Institution Name:</label>
        <input type="text" v-model="institutionName" />
      </div>
      <div class="form-group">
        <label>Visit Purpose:</label>
        <textarea v-model="visitPurpose"></textarea>
      </div>
      <button @click="submitVisit" class="submit-btn">Submit Visit Report</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeiVisit',
  data() {
    return {
      visitDate: '',
      institutionName: '',
      visitPurpose: ''
    }
  },
  methods: {
    submitVisit() {
      // Handle visit submission logic here
      console.log({
        date: this.visitDate,
        institution: this.institutionName,
        purpose: this.visitPurpose
      })
    }
  }
}
</script>

<style scoped>
.hei-visit {
  padding: 20px;
}

.visit-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>
