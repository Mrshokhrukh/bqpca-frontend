<template>
    <div class="manage-providers">
      <!-- Add Provider Card -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Add CPD Provider</h2>
        </div>
        <div class="card-content">
          <form @submit.prevent="submitProvider" class="provider-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Provider Name</label>
                <div class="input-with-icon">
                  <i class="fas fa-user"></i>
                  <input 
                    v-model="formData.providerName" 
                    type="text" 
                    placeholder="Enter provider name"
                    required 
                  />
                </div>
              </div>
  
              <div class="form-group">
                <label>Contact Information</label>
                <div class="input-with-icon">
                  <i class="fas fa-phone"></i>
                  <input 
                    v-model="formData.contactInfo" 
                    type="text" 
                    placeholder="Enter contact details"
                    required 
                  />
                </div>
              </div>
  
              <div class="form-group">
                <label>CPD Activity Title</label>
                <div class="input-with-icon">
                  <i class="fas fa-book"></i>
                  <input 
                    v-model="formData.cpdActivityTitle" 
                    type="text" 
                    placeholder="Enter activity title"
                    required 
                  />
                </div>
              </div>
  
              <div class="form-group">
                <label>Venue</label>
                <div class="input-with-icon">
                  <i class="fas fa-map-marker-alt"></i>
                  <input 
                    v-model="formData.venue" 
                    type="text" 
                    placeholder="Enter venue"
                    required 
                  />
                </div>
              </div>
  
              <div class="form-group">
                <label>From Date</label>
                <div class="input-with-icon">
                  <i class="fas fa-calendar"></i>
                  <input 
                    v-model="formData.fromDate" 
                    type="date" 
                    required 
                  />
                </div>
              </div>
  
              <div class="form-group">
                <label>To Date</label>
                <div class="input-with-icon">
                  <i class="fas fa-calendar"></i>
                  <input 
                    v-model="formData.toDate" 
                    type="date" 
                    required 
                  />
                </div>
              </div>
            </div>
  
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-plus"></i> Add Provider
            </button>
          </form>
        </div>
      </div>
  
      <!-- Providers Table Card -->
      <div class="card mt-6">
        <div class="card-header">
          <h2 class="card-title">CPD Providers List</h2>
        </div>
        <div class="card-content">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Provider Name</th>
                  <th>Contact Information</th>
                  <th>CPD Activity Title</th>
                  <th>Venue</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(provider, index) in providers" :key="index">
                  <td>{{ provider.providerName }}</td>
                  <td>{{ provider.contactInfo }}</td>
                  <td>{{ provider.cpdActivityTitle }}</td>
                  <td>{{ provider.venue }}</td>
                  <td>{{ provider.fromDate }}</td>
                  <td>{{ provider.toDate }}</td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editProvider(index)" class="btn btn-edit">
                        <i class="fas fa-edit"></i> Edit
                      </button>
                      <button @click="deleteProvider(index)" class="btn btn-delete">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const formData = reactive({
    providerName: '',
    contactInfo: '',
    cpdActivityTitle: '',
    venue: '',
    fromDate: '',
    toDate: ''
  })
  
  const providers = ref([
    {
      providerName: 'ABC Training Institute',
      contactInfo: 'contact@abctraining.com',
      cpdActivityTitle: 'Workshop on Microbiology',
      venue: 'Conference Hall A',
      fromDate: '2023-11-01',
      toDate: '2023-11-03'
    },
    {
      providerName: 'XYZ Seminars',
      contactInfo: 'info@xyzseminars.com',
      cpdActivityTitle: 'ISO Standards Seminar',
      venue: 'Online',
      fromDate: '2023-12-10',
      toDate: '2023-12-12'
    }
  ])
  
  const submitProvider = () => {
    providers.value.push({ ...formData })
    // Reset form
    Object.keys(formData).forEach(key => formData[key] = '')
  }
  
  const editProvider = (index) => {
    const provider = providers.value[index]
    Object.keys(formData).forEach(key => formData[key] = provider[key])
    providers.value.splice(index, 1)
  }
  
  const deleteProvider = (index) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      providers.value.splice(index, 1)
    }
  }
  </script>
  
  <style scoped>
  .manage-providers {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .card-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #4a5568;
  }
  
  .input-with-icon {
    position: relative;
  }
  
  .input-with-icon i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #718096;
  }
  
  .input-with-icon input {
    width: 100%;
    padding: 10px 10px 10px 35px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: border-color 0.2s;
  }
  
  .input-with-icon input:focus {
    border-color: #4299e1;
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
  
  .btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  
  .btn i {
    font-size: 0.9em;
  }
  
  .btn-primary {
    background-color: #4299e1;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #3182ce;
  }
  
  .btn-edit {
    background-color: #48bb78;
    color: white;
    border: none;
    margin-right: 8px;
  }
  
  .btn-edit:hover {
    background-color: #38a169;
  }
  
  .btn-delete {
    background-color: #f56565;
    color: white;
    border: none;
  }
  
  .btn-delete:hover {
    background-color: #e53e3e;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th,
  .table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .table th {
    background-color: #f7fafc;
    font-weight: 600;
    color: #4a5568;
  }
  
  .table tr:hover {
    background-color: #f7fafc;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .mt-6 {
    margin-top: 1.5rem;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
      justify-content: center;
    }
  }
  </style>