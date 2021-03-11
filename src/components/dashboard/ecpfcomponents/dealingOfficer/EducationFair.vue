<template>
  <div class="education-fair">
    <h2>Education Fair Management</h2>
    <div class="fair-container">
      <!-- Form section -->
      <form @submit.prevent="submitFairDetails">
        <div class="form-group">
          <label>Fair Name</label>
          <input v-model="fairDetails.name" type="text" required>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input v-model="fairDetails.date" type="date" required>
        </div>
        <div class="form-group">
          <label>Location</label>
          <input v-model="fairDetails.location" type="text" required>
        </div>
        <button type="submit">Submit</button>
      </form>

      <!-- Display section -->
      <div class="fairs-list">
        <h3>Upcoming Fairs</h3>
        <ul>
          <li v-for="fair in fairs" :key="fair.id">
            {{ fair.name }} - {{ fair.date }} at {{ fair.location }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EducationFair',
  data() {
    return {
      fairDetails: {
        name: '',
        date: '',
        location: ''
      },
      fairs: []
    }
  },
  methods: {
    submitFairDetails() {
      // Add new fair to the list
      this.fairs.push({
        id: Date.now(),
        ...this.fairDetails
      })
      // Reset form
      this.fairDetails = {
        name: '',
        date: '',
        location: ''
      }
    }
  }
}
</script>

<style scoped>
.education-fair {
  padding: 20px;
}

.fair-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.fairs-list {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}
</style>
