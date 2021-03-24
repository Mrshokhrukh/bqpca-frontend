<!-- Parent Component: src/views/DashboardView.vue -->
<template>
  <div class="min-h-screen p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MyApplications :applications="applications" @view-details="viewApplicationDetails" />
      <ImportantDatesAndEvents :events="events" />
      <Notifications :notifications="notifications" @mark-all-read="markAllAsRead" />
      <QuickLinks @start-new-application="startNewApplication" @renew-ecpf="renewECPF"
        @change-name-location="changeNameLocation" @contact-support="contactSupport"
        :show-renew-button="showRenewButton" @go-to-student-management="goToStudentManagement"
        @go-to-hr-bio-data="goToHRBioData" />
      <HelpAndSupport :faqs="faqs" :show-faq="showFAQ" :live-chat-available="liveChatAvailable" @toggle-faq="toggleFAQ"
        @open-live-chat="openLiveChat" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MyApplications from './dashboardComponents/MyApplications.vue';
import ImportantDatesAndEvents from './dashboardComponents/ImportantDatesAndEvents.vue';
import Notifications from './dashboardComponents/Notifications.vue';
import QuickLinks from './dashboardComponents/QuickLinks.vue';
import HelpAndSupport from './dashboardComponents/HelpAndSupport.vue';


const applications = ref([]);
const events = ref([]);
const notifications = ref([]);
const faqs = ref([
  { question: "How do I submit an application?", answer: "Go to the 'New Application' section and choose the application type." },
  { question: "What is the deadline for the ECPF renewal?", answer: "The deadline is typically on [Date], but check the 'Important Dates' section for the exact date." },
  { question: "How can I change my registered location?", answer: "You can request a location change through the 'Change Name/Location' option." },
  { question: "How to manage students", answer: "By going on the student menagement you can modify and manage students" },
  { question: "How to manage HR Bio Data", answer: "By going on HR Bio Data option you can add, modify and manage HR Bio Data." }
]);
const showFAQ = ref(false);
const liveChatAvailable = ref(false); // Set to true if live chat is implemented.
const showRenewButton = ref(false);

// Simulated data fetching (replace with actual API calls)
onMounted(() => {
  // Simulate fetching applications
  setTimeout(() => {
    applications.value = [
      { id: 1, type: 'Individual ECPF', submittedDate: '2023-10-26', status: 'Submitted', actionRequired: null },
      { id: 2, type: 'Collaborated ECPF', submittedDate: '2023-10-15', status: 'Approved', actionRequired: null },
      { id: 3, type: 'Individual ECPF', submittedDate: '2023-11-10', status: 'Action Required', actionRequired: 'Upload Missing Document' },
      { id: 4, type: "New Branch", submittedDate: '2024-01-15', status: 'Draft', actionRequired: null }
    ];
    // Check if any application is close to renewal
    const today = new Date();
    const renewalThreshold = new Date();
    renewalThreshold.setDate(today.getDate() + 30); // Show renew button if within 30 days of "renewal".

    applications.value.forEach(app => {
      //This is just a placeholder to simulate renewal time
      const renewalDate = new Date(app.submittedDate);
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
      if (renewalDate <= renewalThreshold && app.status === 'Approved') {
        showRenewButton.value = true;
      }
    })
  }, 500);

  // Simulate fetching events
  setTimeout(() => {
    events.value = [
      { id: 1, date: '2023-11-15', time: '10:00 AM', type: 'ECPF Renewal Deadline', description: 'Last day to submit your renewal application.', link: '#' },
      { id: 2, date: '2023-11-20', time: '9:00 AM - 5:00 PM', type: 'Education Fair', description: 'Meet with representatives from various institutions.', link: 'https://example.com/education-fair' },
      { id: 3, date: '2023-12-01', time: '2:00 PM', type: 'HEI Visit', description: 'Visit our campus and learn more about our programs.', link: '#' },
    ];
  }, 750);

  //Simulate fetching notifications
  setTimeout(() => {
    notifications.value = [
      { id: 1, timestamp: '2 hours ago', message: 'Your application has been approved!', type: 'success', link: '#' },
      { id: 2, timestamp: 'Yesterday', message: 'Reminder: ECPF Renewal due in 7 days.', type: 'warning', link: '#' },
      { id: 3, timestamp: '3 days ago', message: 'New document request for your application.', type: 'info', link: '#' },
    ];
  }, 250)
});



const viewApplicationDetails = (id) => {
  //  Implement navigation to application details page.
  alert(`Viewing details for application ID: ${id}`); // Replace with actual routing
};

const startNewApplication = () => {
  // Implement navigation to new application page.
  alert('Starting new application...'); // Replace with actual routing
};

const renewECPF = () => {
  // Implement navigation to renewal page.
  alert('Redirecting to ECPF renewal page...'); // Replace with actual routing
};

const changeNameLocation = () => {
  // Implement navigation to change name/location page.
  alert('Redirecting to change name/location page...'); // Replace with actual routing
};

const contactSupport = () => {
  // Implement opening a contact form or showing contact information.
  alert('Opening contact form...'); // Replace with actual implementation
};

const markAllAsRead = () => {
  notifications.value = [];
}
const toggleFAQ = () => {
  showFAQ.value = !showFAQ.value;
}

const openLiveChat = () => {
  alert('Starting live chat... (Placeholder)');
}

const goToStudentManagement = () => {
  alert("Redirecting to Student Management page")
}

const goToHRBioData = () => {
  alert("Redirecting to HR Bio Data page")
}
</script>