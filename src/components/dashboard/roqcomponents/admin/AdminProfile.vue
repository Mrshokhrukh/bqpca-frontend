<template>
  <div>
    <UserProfile :user="userData" />
  </div>
</template>

<script setup>
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
