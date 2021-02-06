<template>
    <div class="container">
      <h1>HR Management Dashboard</h1>
  
      <!-- Employee Form -->
      <div class="form-container">
        <h2>Add/Edit Employee</h2>
        <div>
          <label for="employeeName">Employee Name:</label>
          <input type="text" id="employeeName" v-model="employeeForm.employeeName" />
        </div>
        <div>
          <label for="employeeId">Employee ID:</label>
          <input type="text" id="employeeId" v-model="employeeForm.employeeId" />
        </div>
        <div>
          <label for="employeeDepartment">Department:</label>
          <select id="employeeDepartment" v-model="employeeForm.department">
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label for="employeeDesignation">Designation:</label>
          <input type="text" id="employeeDesignation" v-model="employeeForm.designation" />
        </div>
        <div>
          <label for="employeeEmail">Email:</label>
          <input type="email" id="employeeEmail" v-model="employeeForm.email" />
        </div>
        <div>
          <label for="employeePhone">Phone:</label>
          <input type="tel" id="employeePhone" v-model="employeeForm.phone" />
        </div>
  
        <button @click="saveEmployee">Save Employee</button>
        <button @click="resetForm">Reset Form</button>
      </div>
  
      <!-- Employee List -->
      <div class="data-display">
        <h2>Employee List</h2>
        <table v-if="employees.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.employeeId">
              <td>{{ employee.employeeName }}</td>
              <td>{{ employee.employeeId }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.designation }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.phone }}</td>
              <td>
                <button @click="editEmployee(employee)">Edit</button>
                <button @click="deleteEmployee(employee.employeeId)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No employees added yet.</p>
      </div>
<!--   
      Display Submitted Data (For Testing)
      <div v-if="submittedData">
        <h2>Submitted Data:</h2>
        <pre>{{ submittedData }}</pre> -->
      <!-- </div> -->
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  //import { v4 as uuidv4 } from 'uuid'; // Import UUID generator - Commenting out for now, dummy data uses fixed IDs
  
  export default {
    name: 'HRDashboard',
    setup() {
      const employees = ref([ // Dummy data for initial employee list
        {
          employeeName: 'Alice Smith',
          employeeId: 'AS001',
          department: 'HR',
          designation: 'HR Manager',
          email: 'alice.smith@example.com',
          phone: '123-456-7890',
        },
        {
          employeeName: 'Bob Johnson',
          employeeId: 'BJ002',
          department: 'IT',
          designation: 'Software Engineer',
          email: 'bob.johnson@example.com',
          phone: '987-654-3210',
        },
        {
          employeeName: 'Charlie Brown',
          employeeId: 'CB003',
          department: 'Marketing',
          designation: 'Marketing Specialist',
          email: 'charlie.brown@example.com',
          phone: '555-123-4567',
        },
      ]);
  
      const employeeForm = ref({
        employeeName: '',
        employeeId: '',
        department: 'HR',
        designation: '',
        email: '',
        phone: '',
      });
  
      const submittedData = ref(null);
  
      const saveEmployee = () => {
      submittedData.value = { ...employeeForm.value };
      console.log('Employee Form Data:', employeeForm.value);

      if (!employeeForm.value.employeeName || !employeeForm.value.employeeId) {
        alert('Name and ID are required!');
        return;
      }
       const existingEmployeeIndex = employees.value.findIndex(
        (employee) => employee.employeeId === employeeForm.value.employeeId
      );

      if (existingEmployeeIndex > -1) {
        // Check for duplicate *new* IDs when editing
        if (!confirm("This Employee ID already exists. Are you sure you want to update this employee?")) {
            return; // Prevent overwrite if user cancels
        }
        employees.value[existingEmployeeIndex] = { ...employeeForm.value };


      } else {
           const duplicateIdIndex = employees.value.findIndex(emp => emp.employeeId === employeeForm.value.employeeId);
            if (duplicateIdIndex !== -1) {
                alert("Employee ID already exists. Please enter a unique ID.");
                return; // Stop saving if duplicate ID
            }
        employees.value.push({ ...employeeForm.value });
      }

      resetForm();
    };
  
      const editEmployee = (employee) => {
        employeeForm.value = { ...employee };
      };
  
      const deleteEmployee = (employeeId) => {
        employees.value = employees.value.filter((employee) => employee.employeeId !== employeeId);
      };
  
      const resetForm = () => {
        employeeForm.value = {
          employeeName: '',
          employeeId: '',
          department: 'HR',
          designation: '',
          email: '',
          phone: '',
        };
      };
  
      onMounted(() => {
        // Optional: Simulate an API call to load initial data if you were fetching from an API
  
      });
  
      return {
        employees,
        employeeForm,
        submittedData,
        saveEmployee,
        editEmployee,
        deleteEmployee,
        resetForm,
      };
    },
  };
  </script>
  
  <style scoped>
  /* ... (same styles as before) ... */
  
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-container {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select,
  textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    background-color: #3271a5;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  button:hover {
    background-color: #46a2da;
  }
  
  .data-display {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  </style>