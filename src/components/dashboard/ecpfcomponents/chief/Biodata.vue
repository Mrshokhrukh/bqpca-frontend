<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="biodata-container">
    <h2>Dealing Officer Biodata</h2>
    <div class="biodata-form">
      <div class="form-group">
        <label>Full Name:</label>
        <input v-model="officerData.fullName" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Employee ID:</label>
        <input v-model="officerData.employeeId" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Department:</label>
        <input v-model="officerData.department" type="text" class="form-control" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const officerData = reactive({
  fullName: '',
  employeeId: '',
  department: '',
})
</script>

<style scoped>
.biodata-container {
  padding: 20px;
}

.biodata-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
