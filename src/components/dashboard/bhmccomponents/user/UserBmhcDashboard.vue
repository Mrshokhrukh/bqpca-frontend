<template>
  <div class="space-y-6">
    <!-- Profile Summary -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center space-x-4">
        <div class="bg-blue-100 p-4 rounded-full">
          <User class="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ userDetail.username }}</h2>
          <p class="text-gray-600">Registration No: {{ userDetail.id }}</p>
        </div>
        <div class="ml-auto" v-if="renewalMessage">
          <div
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium',
              renewalMessage.includes('expire')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800',
            ]"
          >
            {{ renewalMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Credit Score with Progress -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="bg-blue-100 p-2 rounded-full">
              <Award class="w-5 h-5 text-blue-500" />
            </div>
            <h3 class="font-semibold">CPD Credits</h3>
          </div>
          <span class="text-sm text-gray-500">Annual Target</span>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Progress</span>
            <span>{{ userDetail.creditScore }}/50 points</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-500 h-2.5 rounded-full"
              :style="{ width: `${(userDetail.creditScore / 50) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- License Status -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-green-100 p-2 rounded-full">
            <FileText class="w-5 h-5 text-green-500" />
          </div>
          <h3 class="font-semibold">License Status</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Valid Until</span>
            <span class="text-sm font-medium"
              >{{ formatDate(userDetail.application.date) }}</span
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Status</span>
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                userDetail.application.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ userDetail.application.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Application History -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-purple-100 p-2 rounded-full">
            <Clock class="w-5 h-5 text-purple-500" />
          </div>
          <h3 class="font-semibold">Application History</h3>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm">Approved</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {{ getStatusCount("approved") }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm">Pending Review</span>
            <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              {{ getStatusCount("pending") }}
            </span>
          </div>
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="showRejected"
          >
            <span class="text-sm">Rejected</span>
            <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
              {{ getStatusCount("reject") }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities and Upcoming Deadlines -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Recent Activities -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold mb-4">Recent Activities</h3>
        <div class="space-y-4">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="flex items-start space-x-3"
          >
            <div
              :class="[
                'p-2 rounded-full',
                activity.type === 'cpd' ? 'bg-blue-100' : 'bg-green-100',
              ]"
            >
              <component
                :is="activity.type === 'cpd' ? BookOpen : FileText"
                class="w-4 h-4"
                :class="
                  activity.type === 'cpd' ? 'text-blue-500' : 'text-green-500'
                "
              />
            </div>
            <div>
              <p class="text-sm font-medium">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold mb-4">Upcoming Deadlines</h3>
        <div class="space-y-4">
          <div
            v-for="(deadline, index) in upcomingDeadlines"
            :key="index"
            class="flex items-start space-x-3"
          >
            <div class="bg-red-100 p-2 rounded-full">
              <AlertCircle class="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ deadline.title }}</p>
              <p class="text-xs text-gray-500">Due: {{ deadline.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications Modal -->
    <div
      v-if="selectedApplications.length > 0"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-3/4 max-h-[80vh] overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ modalTitle }}</h2>
          <button @click="selectedApplications = []" class="text-gray-500 hover:text-gray-700">
            <XCircle class="w-6 h-6" />
          </button>
        </div>

        <table class="w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="text-left p-3">Name</th>
              <th class="text-left p-3">Type</th>
              <th class="text-left p-3">Date</th>
              <th class="text-left p-3">Status</th>
              <th class="text-left p-3">Remarks</th>
              <th class="text-left p-3" v-if="modalTitle === 'Rejected Applications'">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="app in selectedApplications"
              :key="app.name"
              class="border-b hover:bg-gray-50"
            >
              <td class="p-3">{{ app.name }}</td>
              <td class="p-3">{{ app.type }}</td>
              <td class="p-3">{{ formatDate(app.date) }}</td>
              <td class="p-3">
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    app.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : app.status === 'reject'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ app.status }}
                </span>
              </td>
              <td class="p-3">{{ app.remarks }}</td>
              <td class="p-3" v-if="app.status === 'reject'">
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600"
                  @click="visitApplication(app)"
                >
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  FileText,
  XCircle,
  Award,
  Clock,
  BookOpen,
  AlertCircle,
  User,
} from "lucide-vue-next";
import dayjs from "dayjs";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

// Access auth store and its reactive properties
const authStore = useAuthStore();
const { user, userId } = storeToRefs(authStore);

// Reactive refs for data
const applications = ref([]);
const recentActivities = ref([]);
const upcomingDeadlines = ref([]);
const selectedApplications = ref([]);
const modalTitle = ref("");
const renewalMessage = ref("");

const userDetail = ref({
  id: null,
  username: "",
  specialization: "",
  application: {
    name: "",
    date: "",
    registerDate: "",
    status: "",
    rejectRemarks: "",
  },
  cpdApplication: {
    name: "",
    date: "",
    status: "",
    rejectRemarks: "",
  },
  creditScore: 0,
});

// Computed property to format date
const formatDate = (date) => {
  return dayjs(date).format("MMM DD, YYYY");
};

// Function to get the count of applications with a specific status
const getStatusCount = (status) =>
  applications.value.filter((app) => app.status === status).length;

// Function to show rejected applications in the modal
const showRejected = () => {
  selectedApplications.value = applications.value.filter(
    (app) => app.status === "reject"
  );
  modalTitle.value = "Rejected Applications";
};

// Function to visit an application
const visitApplication = (app) => {
  if (app.type === "CPD" && app.status === "reject") {
    window.location.href = "/admin/user/health_certification/cpd";
  } else if (app.type === "License" && app.status === "reject") {
    window.location.href =
      "/admin/user/health_certification/practitioner_reg_and_cert/registration";
  }
};

const fetchDashboardData = async () => {
  // Using dummy data
  userDetail.value = {
    id: userId.value,
    username: user.value.username,
    specialization: "General Medicine",
    application: {
      name: "Medical License",
      date: "2024-03-01",
      registerDate: "2020-05-01",
      status: "approved",
      rejectRemarks: "",
    },
    cpdApplication: {
      name: "CPD",
      date: "2024-05-15",
      status: "reject",
      rejectRemarks: "Insufficient CPD points",
    },
    creditScore: 15,
  };

  applications.value = [
    {
      name: userDetail.value.application.name,
      type: "License",
      date: userDetail.value.application.registerDate,
      status: userDetail.value.application.status,
      remarks: userDetail.value.application.rejectRemarks || "Approved",
    },
    {
      name: userDetail.value.cpdApplication.name,
      type: "CPD",
      date: userDetail.value.cpdApplication.date,
      status: userDetail.value.cpdApplication.status,
      remarks: userDetail.value.cpdApplication.rejectRemarks,
    },
  ];

  recentActivities.value = [
    {
      type: "cpd",
      title: "Completed Online Medical Ethics Course",
      date: "2024-02-01",
    },
    {
      type: "license",
      title: "License Renewal Submitted",
      date: "2024-01-15",
    },
    {
      type: "cpd",
      title: "Attended Medical Conference",
      date: "2024-01-10",
    },
  ];

  upcomingDeadlines.value = [
    {
      title: "CPD Points Target",
      date: "2024-12-31",
    },
    {
      title: "License Renewal",
      date: "2025-05-01",
    },
  ];
};

const checkExpiration = () => {
  // Removed `storedUser` check, using the store directly
  if (user.value && user.value.username === userDetail.value.username) {
    const registerDate = dayjs(userDetail.value.application.registerDate);
    const currentDate = dayjs();
    const expirationDate = registerDate.add(5, "year");
    const warningDate = expirationDate.subtract(3, "month");

    if (currentDate.isAfter(expirationDate)) {
      renewalMessage.value = "License has expired";
    } else if (currentDate.isAfter(warningDate)) {
      renewalMessage.value = "License expires in less than 3 months";
    }
  }
};

onMounted(() => {
  fetchDashboardData(); // Fetch the data from api
  checkExpiration();
});
</script>