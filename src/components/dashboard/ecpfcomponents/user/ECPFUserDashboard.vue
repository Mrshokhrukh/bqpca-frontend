<template>
  <div class="bg-gray-900 text-white min-h-screen p-6">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Application Status Card -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 lg:col-span-2">
        <h2 class="text-2xl font-semibold mb-4">My Applications</h2>
        <div v-if="applications.length > 0">
          <div v-for="app in applications" :key="app.id" class="mb-4 border-b border-gray-700 pb-4 last:border-none">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-medium">{{ app.type }}</h3>
                <p class="text-sm text-gray-400">Submitted: {{ app.submittedDate }}</p>
              </div>
              <span :class="getStatusClass(app.status)">{{ app.status }}</span>
            </div>
            <p v-if="app.actionRequired" class="text-orange-400 text-sm mt-1">{{ app.actionRequired }}</p>
            <button @click="viewApplicationDetails(app.id)" class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              View Details
            </button>
          </div>
        </div>
        <div v-else class="text-gray-400">No applications submitted yet.</div>
      </div>

      <!-- Upcoming Deadlines/Events Card -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Important Dates & Events</h2>
        <div v-if="events.length > 0">
          <div v-for="event in events" :key="event.id" class="mb-4 flex items-center">
            <div class="mr-4">
              <span class="text-sm text-gray-400">{{ event.date }}</span><br/>
              <span class="text-sm text-gray-400">{{ event.time }}</span>
            </div>
            <div>
                <div class="flex flex-row items-center">
                    <component :is="getEventIcon(event.type)" class="w-5 h-5 mr-2 text-gray-400"></component>
                    <h3 class="text-lg font-medium">{{ event.type }}</h3>
                </div>
                <p class="text-sm text-gray-400">{{ event.description }}</p>
                <a v-if="event.link" :href="event.link" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">More Details</a>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-400">No upcoming deadlines or events.</div>
      </div>


      <!-- Notifications Card -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2">
        <h2 class="text-2xl font-semibold mb-4">Notifications</h2>
        <div v-if="notifications.length > 0">
            <div v-for="notification in notifications" :key="notification.id"
                 class="mb-4 border-b border-gray-700 pb-2 last:border-none flex items-start">
                <component :is="getNotificationIcon(notification.type)" class="w-5 h-5 mr-2 mt-1 text-gray-400"></component>
                <div>
                    <p class="text-sm text-gray-400">{{ notification.timestamp }}</p>
                    <p :class="getNotificationClass(notification.type)">{{ notification.message }}</p>
                    <a v-if="notification.link" :href="notification.link" class="text-blue-400 hover:underline">View</a>
                </div>
            </div>
          <button @click="markAllAsRead" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Mark All as Read</button>
        </div>
        <div v-else class="text-gray-400">No new notifications.</div>
      </div>



      <!-- Quick Actions Card -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Quick Links</h2>
        <div class="grid grid-cols-1 gap-4">
          <button @click="startNewApplication" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Start New Application
          </button>
           <button  v-if="showRenewButton" @click="renewECPF" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Renew ECPF
          </button>
          <button @click="changeNameLocation" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Change Name/Location
          </button>

            <button @click="goToStudentManagement" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                Student Management
            </button>

            <button @click="goToHRBioData" class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>

                HR Bio Data
            </button>
          <button @click="contactSupport" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Contact Support
          </button>
        </div>
      </div>

        <!-- Help and Resources -->
        <div class="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">Help & Support</h2>
            <div class="space-y-4">
                <div>
                    <h3 class="text-lg font-medium cursor-pointer" @click="toggleFAQ">
                        FAQ
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="{'rotate-180': showFAQ}" class="w-4 h-4 inline-block ml-1 transition-transform">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </h3>

                    <div v-if="showFAQ" class="mt-2 text-gray-300">
                        <details v-for="(faq, index) in faqs" :key="index" class="mb-2">
                            <summary class="cursor-pointer">{{ faq.question }}</summary>
                            <p class="mt-1 ml-4">{{ faq.answer }}</p>
                        </details>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-medium">Contact Information</h3>
                    <p class="text-gray-300">Email: <a href="mailto:support@example.com" class="text-blue-400">support@example.com</a></p>
                    <p class="text-gray-300">Phone: +1 (555) 123-4567</p>
                </div>
                <div>
                    <h3 class="text-lg font-medium">Tutorials/Guides</h3>
                    <ul class="list-disc list-inside text-gray-300">
                        <li><a href="#" class="text-blue-400 hover:underline">Application Process Guide</a></li>
                        <li><a href="#" class="text-blue-400 hover:underline">Video Tutorial: Submitting Your Application</a></li>
                    </ul>
                </div>
                <!-- Live Chat (Optional - Placeholder) -->
                <button v-if="liveChatAvailable" @click="openLiveChat" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                    Start Live Chat
                </button>
            </div>
        </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    CalendarIcon, BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon,
   
    UsersIcon,  DocumentTextIcon
} from '@heroicons/vue/24/outline'; //Import Heroicons


const applications = ref([]);
const events = ref([]);
const notifications = ref([]);
const faqs = ref([
    { question: "How do I submit an application?", answer: "Go to the 'New Application' section and choose the application type." },
    { question: "What is the deadline for the ECPF renewal?", answer: "The deadline is typically on [Date], but check the 'Important Dates' section for the exact date." },
    { question: "How can I change my registered location?", answer: "You can request a location change through the 'Change Name/Location' option." },
    {question: "How to manage students", answer: "By going on the student menagement you can modify and manage students"},
    {question: "How to manage HR Bio Data", answer: "By going on HR Bio Data option you can add, modify and manage HR Bio Data."}
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
            { id: 4, type: "New Branch", submittedDate: '2024-01-15', status: 'Draft', actionRequired: null}
        ];
         // Check if any application is close to renewal
        const today = new Date();
        const renewalThreshold = new Date();
        renewalThreshold.setDate(today.getDate() + 30); // Show renew button if within 30 days of "renewal".

         applications.value.forEach(app => {
            //This is just a placeholder to simulate renewal time
            const renewalDate = new Date(app.submittedDate);
            renewalDate.setFullYear(renewalDate.getFullYear() + 1);
            if(renewalDate <= renewalThreshold && app.status === 'Approved'){
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



const getStatusClass = (status) => {
  switch (status) {
    case 'Draft': return 'bg-gray-600 text-white px-2 py-1 rounded text-xs';
    case 'Submitted': return 'bg-blue-600 text-white px-2 py-1 rounded text-xs';
    case 'Under Review': return 'bg-yellow-600 text-white px-2 py-1 rounded text-xs';
    case 'Approved': return 'bg-green-600 text-white px-2 py-1 rounded text-xs';
    case 'Rejected': return 'bg-red-600 text-white px-2 py-1 rounded text-xs';
    case 'Action Required': return 'bg-orange-600 text-white px-2 py-1 rounded text-xs';
    default: return 'bg-gray-500 text-white px-2 py-1 rounded text-xs';
  }
};

//Notification icon
const getNotificationIcon = (type) => {
    switch (type) {
        case 'success': return CheckCircleIcon;
        case 'warning': return ExclamationTriangleIcon;
        case 'info': return InformationCircleIcon;
        default: return BellIcon;
    }
}

//Event Icon
const getEventIcon = (type) => {
    switch(type){
        case 'ECPF Renewal Deadline': return CalendarIcon;
        case 'Education Fair': return UsersIcon;
        case 'HEI Visit': return DocumentTextIcon;
        default: return CalendarIcon;
    }
}

const getNotificationClass = (type) => {
    switch(type){
        case 'success': return 'text-green-400';
        case 'warning': return 'text-yellow-400';
        case 'info': return 'text-blue-400';
        default: return '';
    }
}


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