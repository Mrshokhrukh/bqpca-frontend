<template>
  <div v-if="renewalMessage" class="mb-32 bg-green-300 h-16 text-center rounded ">{{ renewalMessage }}</div>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
    <div
      v-for="(item, index) in stats"
      :key="index"
      @click="item.onClick && item.onClick()"
      class="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div class="flex items-center space-x-4">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-full"
          :class="item.bgColor"
        >
          <component :is="item.icon" class="w-6 h-8 text-white text-center" />
        </div>
        <div>
          <h4 class="text-gray-600 font-semibold">{{ item.label }}</h4>
          <p class="text-xl font-bold text-gray-800">{{ item.count }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for Applications -->
  <div
    v-if="selectedApplications.length > 0"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-1/2 max-w-8xl max-h-[160vh] overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          {{ modalTitle }}
        </h2>
        <button
          @click="selectedApplications = []"
          class="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>

      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left p-2">Name</th>
            <th class="text-left p-2">Type</th>
            <th class="text-left p-2">Date</th>
            <th class="text-left p-2">Status</th>
            <th class="text-left p-2">Remarks</th>
            <th class="text-left p-2" v-if="modalTitle === 'Rejected Applications'">Visit</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="app in selectedApplications"
            :key="app.name"
            class="border-b last:border-b-0"
          >
            <td class="p-2">{{ app.name }}</td>
            <td class="p-2">{{ app.type }}</td>
            <td class="p-2">{{ app.date }}</td>
            <td class="p-2">{{ app.status }}</td>
            <td class="p-2">{{ app.remarks }}</td>
            <td class="p-2" v-if="app.status === 'reject'">
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded"
                @click="visitApplication(app)"
              >
                Visit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, CheckCircle, XCircle } from 'lucide-vue-next'
import dayjs from 'dayjs'

const router = useRouter()

const userDetail = {
  id: 3,
  username: "dtoby",
  application: {
    name: "Application",
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
}

const applications = [
  {
    name: userDetail.application.name,
    type: "Application",
    date: userDetail.application.registerDate,
    status: userDetail.application.status,
    remarks: userDetail.application.rejectRemarks || "Approved",
  },
  {
    name: userDetail.cpdApplication.name,
    type: "CPD",
    date: userDetail.cpdApplication.date,
    status: userDetail.cpdApplication.status,
    remarks: userDetail.cpdApplication.rejectRemarks,
  }
]

const selectedApplications = ref([])
const modalTitle = ref('')
const renewalMessage = ref('')

const getStatusCount = (status) =>
  applications.filter(app => app.status === status).length

const stats = [
  {
    icon: FileText,
    label: 'Credit Score',
    count: userDetail.creditScore,
    bgColor: 'bg-blue-500',
  },
  {
    icon: CheckCircle,
    label: 'Approved',
    count: getStatusCount('approved'),
    bgColor: 'bg-green-500',
    onClick: () => {
      selectedApplications.value = applications.filter(app => app.status === 'approved')
      modalTitle.value = 'Approved Applications'
    }
  },
  {
    icon: XCircle,
    label: 'Rejected',
    count: getStatusCount('reject'),
    bgColor: 'bg-red-500',
    onClick: () => {
      selectedApplications.value = applications.filter(app => app.status === 'reject')
      modalTitle.value = 'Rejected Applications'
    }
  },
]

// Check for expiration
const checkExpiration = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  if (storedUser && storedUser.username === userDetail.username) {
    const registerDate = dayjs(userDetail.application.registerDate)
    const currentDate = dayjs()
    const expirationDate = registerDate.add(5, 'year')
    const warningDate = expirationDate.subtract(3, 'month')

    if (currentDate.isAfter(expirationDate)) {
      renewalMessage.value = 'Application has expired.'
    } else if (currentDate.isAfter(warningDate)) {
      renewalMessage.value = 'Application is about to expire. Please renew.'
    } else {
      renewalMessage.value = ''
    }
  }
}

const visitApplication = (app) => {
  if (app.type === 'CPD' && app.status === 'reject') {
    window.location.href = 'http://localhost:5173/admin/user/health_certification/cpd'
  } else if (app.type === 'Application' && app.status === 'reject') {
    window.location.href = 'http://localhost:5173/admin/user/health_certification/practitioner_reg_and_cert/registration'
  }
}

onMounted(() => {
  checkExpiration()
})
</script>
