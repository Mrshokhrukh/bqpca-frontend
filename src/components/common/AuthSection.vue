<!-- src/components/AuthSection.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <!-- Auth Tabs -->
    <div class="flex border-b border-gray-200">
      <button @click="activeTab = 'login'" class="flex-1 py-4 px-6 text-center font-medium"
        :class="activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'">
        Login
      </button>
      <button @click="activeTab = 'register'" class="flex-1 py-4 px-6 text-center font-medium"
        :class="activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'">
        Register
      </button>
    </div>

    <div class="p-8">
      <!-- Login Section -->
      <div v-if="activeTab === 'login'" class="space-y-6">
        <!-- NDI Login Options -->
        <div class="space-y-4">
          <button @click="showQRCode = !showQRCode"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50">
            <img src="@/assets/ndi-logo.png" alt="NDI" class="h-5 w-5 mr-2" />
            Login with NDI QR Code
          </button>

          <!-- QR Code Display -->
          <div v-if="showQRCode" class="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-48 h-48 bg-white rounded-lg flex items-center justify-center shadow-inner">
              <QrCodeIcon class="w-32 h-32 text-gray-400" />
            </div>
            <p class="text-sm text-gray-600 text-center">Scan this QR code with your NDI app to login</p>
            <button @click="showQRCode = false" class="text-sm text-gray-500 hover:text-gray-700">
              Cancel QR Login
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <!-- Email Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" v-model="loginForm.email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" v-model="loginForm.password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input type="checkbox" v-model="loginForm.remember"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" class="text-sm text-primary hover:text-primary/90">Forgot password?</a>
          </div>
          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Sign in
          </button>
        </form>
      </div>

      <!-- Registration Section -->
      <div v-else class="space-y-6">
        <!-- NDI Registration Option -->
        <div class="space-y-4">
          <button @click="showRegisterQRCode = !showRegisterQRCode"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50">
            <img src="@/assets/ndi-logo.png" alt="NDI" class="h-5 w-5 mr-2" />
            Register with NDI QR Code
          </button>

          <!-- QR Code Display for Registration -->
          <div v-if="showRegisterQRCode" class="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-48 h-48 bg-white rounded-lg flex items-center justify-center shadow-inner">
              <QrCodeIcon class="w-32 h-32 text-gray-400" />
            </div>
            <p class="text-sm text-gray-600 text-center">Scan this QR code with your NDI app to register</p>
            <button @click="showRegisterQRCode = false" class="text-sm text-gray-500 hover:text-gray-700">
              Cancel QR Registration
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <!-- Registration Notice -->
        <div class="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div class="flex">
            <AlertTriangleIcon class="h-5 w-5 text-amber-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">Important Notice</h3>
              <div class="mt-2 text-sm text-amber-700">
                <p>This registration is for applicant/end-user accounts only. For admin or staff account registration,
                  please contact the BQPCA authority directly.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Updated Registration Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name Fields -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" v-model="registerForm.first_name" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Middle Name</label>
              <input type="text" v-model="registerForm.middle_name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" v-model="registerForm.last_name" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <!-- Gender Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="registerForm.gender" value="male"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span class="ml-2 text-gray-700">Male</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="registerForm.gender" value="female"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span class="ml-2 text-gray-700">Female</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="registerForm.gender" value="other"
                  class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                <span class="ml-2 text-gray-700">Other</span>
              </label>
            </div>
          </div>

          <!-- Date of Birth Picker -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div class="mt-1 relative">
              <input type="text" readonly :value="formattedDOB" @click="showDatePicker = true"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary cursor-pointer" />

              <!-- Custom Date Picker -->
              <div v-if="showDatePicker"
                class="absolute z-10 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <div class="flex justify-between items-center mb-4">
                  <button @click="adjustDate(-1, 'month')" class="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft class="h-5 w-5 text-gray-600" />
                  </button>
                  <div class="flex space-x-2">
                    <select v-model="datePickerMonth"
                      class="form-select text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                      <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
                    </select>
                    <select v-model="datePickerYear"
                      class="form-select text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                    </select>
                  </div>
                  <button @click="adjustDate(1, 'month')" class="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight class="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 gap-1">
                  <!-- Day headers -->
                  <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day"
                    class="text-center text-xs font-medium text-gray-500 p-1">
                    {{ day }}
                  </div>
                  <!-- Calendar days -->
                  <button v-for="date in calendarDates" :key="date.date" @click="selectDate(date)" :class="[
          'p-1 text-sm rounded-full hover:bg-gray-100 relative',
          date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
          isSelectedDate(date) ? 'bg-primary text-white hover:bg-primary/90' : '',
          isToday(date) ? 'font-bold' : ''
        ]">
                    {{ date.day }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- CID Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700">CID/Work Permit Number</label>
            <input type="number" v-model="registerForm.cid" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>

          <!-- Contact Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="tel" v-model="registerForm.contact_number" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" v-model="registerForm.email" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>

          <!-- Password Fields -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" v-model="registerForm.password" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" v-model="registerForm.confirm_password" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-center">
            <input type="checkbox" v-model="registerForm.terms" required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" class="text-primary hover:text-primary/90">Terms</a> and <a href="#"
                class="text-primary hover:text-primary/90">Privacy Policy</a>
            </label>
          </div>

          <button type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Create Account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { QrCode as QrCodeIcon, AlertTriangle as AlertTriangleIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services'

const props = defineProps({
  serviceType: {
    type: String,
    required: true,
  },
});

const toast = useToast();
const authStore = useAuthStore(); // Use the auth store

const activeTab = ref('login');
const showQRCode = ref(false);
const showRegisterQRCode = ref(false);
const showDatePicker = ref(false);

// Date picker state
const datePickerMonth = ref(new Date().getMonth());
const datePickerYear = ref(new Date().getFullYear());
const selectedDate = ref(null);

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 99 + i);

const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
  service_type: props.serviceType,
});

const registerForm = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: null,
  cid: '',
  contact_number: '',
  email: '',
  password: '',
  confirm_password: '',
  terms: false,
  service_type: props.serviceType,
});

// Date picker computed properties and methods
const calendarDates = computed(() => {
  const dates = []
  const firstDay = new Date(datePickerYear.value, datePickerMonth.value, 1)
  const lastDay = new Date(datePickerYear.value, datePickerMonth.value + 1, 0)

  // Add previous month's days
  const startPadding = firstDay.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(datePickerYear.value, datePickerMonth.value, -i)
    dates.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false
    })
  }

  // Add current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(datePickerYear.value, datePickerMonth.value, i)
    dates.push({
      date,
      day: i,
      isCurrentMonth: true
    })
  }

  // Add next month's days
  const endPadding = 42 - dates.length
  for (let i = 1; i <= endPadding; i++) {
    const date = new Date(datePickerYear.value, datePickerMonth.value + 1, i)
    dates.push({
      date,
      day: date.getDate(),
      isCurrentMonth: false
    })
  }

  return dates
})

const formattedDOB = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toISOString().split('T')[0];
})

const adjustDate = (amount, unit) => {
  if (unit === 'month') {
    const newDate = new Date(datePickerYear.value, datePickerMonth.value + amount, 1)
    datePickerMonth.value = newDate.getMonth()
    datePickerYear.value = newDate.getFullYear()
  }
}

const selectDate = (dateObj) => {
  selectedDate.value = dateObj.date;
  registerForm.date_of_birth = dateObj.date.toISOString().split('T')[0];
  showDatePicker.value = false;
};

const isSelectedDate = (dateObj) => {
  if (!selectedDate.value) return false
  return dateObj.date.toDateString() === selectedDate.value.toDateString()
}

const isToday = (dateObj) => {
  return dateObj.date.toDateString() === new Date().toDateString()
}

const handleLogin = async () => {
  try {
    await authStore.login({ ...loginForm, from: 'authSection' });
  } catch (error) {
    console.error(error);
  }
};

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirm_password) {
    toast.error('Passwords do not match');
    return;
  }

  try {
    const payload = {
      first_name: registerForm.first_name,
      middle_name: registerForm.middle_name,
      last_name: registerForm.last_name,
      gender: registerForm.gender,
      date_of_birth: registerForm.date_of_birth,
      cid: registerForm.cid,
      contact_number: registerForm.contact_number,
      email: registerForm.email,
      password: registerForm.password,
      confirm_password: registerForm.confirm_password,
      service_type: registerForm.service_type,
    };

    await apiService.register(payload);
    toast.success('Registration successful! Please login.');
    activeTab.value = 'login';
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};
</script>
