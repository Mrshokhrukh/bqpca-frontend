<template>
  <div class="ecpf-application-form">
    <h2>ECPF Application Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input type="text" id="fullName" v-model="formData.fullName" class="form-control" required>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="formData.email" class="form-control" required>
      </div>

      <div class="form-group">
        <label for="applicationDate">Application Date</label>
        <input type="date" id="applicationDate" v-model="formData.applicationDate" class="form-control" required>
      </div>

      <button type="submit" class="btn btn-primary">Submit Application</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const formData = reactive({
  fullName: '',
  email: '',
  applicationDate: '',
});

const submitForm = () => {
  // Handle form submission logic here
  console.log('Form submitted:', formData);
}
</script>

<style scoped>
.ecpf-application-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}
</style>