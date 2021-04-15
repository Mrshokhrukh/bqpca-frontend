<template>
  <div class="ecpf-verification">
    <h2 class="mb-4">ECPF Verification</h2>
    <div class="verification-container">
      <div class="verification-form">
        <!-- Add your verification form content here -->
        <form @submit.prevent="handleSubmit">
          <div class="form-group mb-3">
            <label for="applicationId">Application ID</label>
            <input
              type="text"
              id="applicationId"
              v-model="formData.applicationId"
              class="form-control"
            />
          </div>
          <div class="form-group mb-3">
            <label for="status">Verification Status</label>
            <select v-model="formData.status" class="form-control" id="status">
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  applicationId: '',
  status: 'pending',
})

const handleSubmit = () => {
  // Add your form submission logic here
  console.log('Form submitted:', formData)
}
</script>

<style scoped>
.ecpf-verification {
  padding: 20px;
}

.verification-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
