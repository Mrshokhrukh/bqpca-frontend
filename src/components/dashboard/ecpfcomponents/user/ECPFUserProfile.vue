<template>
    <div class="user-profile">
        <h2>User Profile</h2>
        <div class="profile-container">
            <div class="profile-section">
                <div class="avatar">
                    <img :src="userAvatar" alt="User avatar" @error="handleImageError">
                </div>
                <div class="user-info">
                    <h3>{{ userName }}</h3>
                    <p>{{ userEmail }}</p>
                    <p>{{ userRole }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const userName = ref('John Doe')
const userEmail = ref('john.doe@example.com')
const userRole = ref('User')
const userAvatar = ref('/path/to/default/avatar.png')

const handleImageError = (e) => {
    e.target.src = '/path/to/fallback/avatar.png'
}
</script>

<style scoped>
.user-profile {
    padding: 20px;
}

.profile-container {
    max-width: 800px;
    margin: 0 auto;
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}

.avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info {
    flex: 1;
}

h2 {
    margin-bottom: 20px;
}

h3 {
    margin: 0 0 10px 0;
}

p {
    margin: 5px 0;
    color: #666;
}
</style>
