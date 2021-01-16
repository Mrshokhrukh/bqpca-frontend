<template>
  <div>
<<<<<<< Updated upstream
    <!-- Show loading state -->
    <div v-if="isLoading">Loading user profile...</div>

    <!-- Show error message -->
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Display user profile -->
    <UserProfile v-if="userProfile" :user="userProfile" />
=======
    <UserProfile :user="userData" />
>>>>>>> Stashed changes
  </div>
</template>

<script setup>
<<<<<<< Updated upstream
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import UserProfile from '@/components/common/UserProfile.vue';

// Initialize stores
const authStore = useAuthStore();
const userProfileStore = useUserProfileStore();

// Reactive state
const isLoading = ref(false);
const error = ref(null);
const userProfile = computed(() => userProfileStore.userProfile);

// Fetch user profile on component mount
onMounted(async () => {
  const userId = authStore.userId;

  if (userId) {
    isLoading.value = true;
    await userProfileStore.fetchUserProfile(userId);
    isLoading.value = userProfileStore.isLoading;
    error.value = userProfileStore.error;

    // Log the userProfile to verify the data
    console.log('User Profile Data:', userProfileStore.userProfile);
  } else {
    error.value = 'User ID not found. Please log in again.';
  }
});
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
</style>
=======
import UserProfile from '@/components/common/UserProfile.vue';

// Define the user data in the parent component
const userData = {
  personalInfo: {
    name: "John Doe",
    role: "Frontend Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    dateOfBirth: "1985-08-25",
    nationality: "American",
    languages: ["English", "German"]
  },
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Harvard University",
      year: "2003-2007",
      description: "Specialized in Web Development"
    }
  ],
  qualifications: [
    {
      name: "Certified Web Developer",
      issuer: "W3Schools",
      year: "2020",
      validUntil: "2025"
    }
  ],
  skills: [
    { name: "JavaScript", level: "Expert" },
    { name: "React", level: "Advanced" },
    { name: "CSS", level: "Advanced" }
  ],
  experience: [
    {
      role: "Frontend Developer",
      company: "WebTech Inc.",
      period: "2015 - Present",
      description: "Developing and maintaining the company's main website.",
      technologies: ["React", "JavaScript", "CSS"]
    }
  ]
};
</script>
>>>>>>> Stashed changes
