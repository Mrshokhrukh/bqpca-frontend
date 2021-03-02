<template>
  <div class="user-profile">
    <div class="profile-container">
      <div class="profile-header">
        <h2>User Profile</h2>
      </div>
      <div class="profile-content">
        <div class="profile-info">
          <div class="info-group">
            <label>Full Name:</label>
            <input v-model="userProfile.fullName" type="text" />
          </div>
          <div class="info-group">
            <label>Email:</label>
            <input v-model="userProfile.email" type="email" />
          </div>
          <div class="info-group">
            <label>Phone:</label>
            <input v-model="userProfile.phone" type="tel" />
          </div>
          <div class="info-group">
            <label>Department:</label>
            <input v-model="userProfile.department" type="text" />
          </div>
        </div>
        <div class="profile-actions">
          <button @click="saveProfile" class="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfileComponent',
  data() {
    return {
      userProfile: {
        fullName: '',
        email: '',
        phone: '',
        department: ''
      }
    }
  },
  methods: {
    saveProfile() {
      // Implement save logic here
      console.log('Saving profile:', this.userProfile)
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.profile-content {
  padding: 20px;
}

.info-group {
  margin-bottom: 15px;
}

.info-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.info-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.profile-actions {
  margin-top: 20px;
  text-align: right;
}

.save-btn {
  padding: 8px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #45a049;
}
</style>
