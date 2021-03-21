<!-- PaymentModule.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Payment Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Payment Management</h1>
      <div class="flex items-center space-x-4">
        <button @click="showPaymentModal('online')"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          New Online Payment
        </button>
        <button @click="showPaymentModal('manual')"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          New Manual Payment
        </button>
      </div>
    </div>

    <!-- Payment Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <select v-model="filterStatus" class="filter-input">
        <option value="all">All Statuses</option>
        <option v-for="status in paymentStatuses" :key="status" :value="status">{{ status }}</option>
      </select>
      <select v-model="filterType" class="filter-input">
        <option value="all">All Types</option>
        <option>Online</option>
        <option>Manual</option>
      </select>
      <input v-model="searchQuery" type="text" placeholder="Search transactions..." class="filter-input">
      <input type="date" v-model="filterDate" class="filter-input">
    </div>

    <!-- Payments Table -->
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="table-header">Transaction ID</th>
            <th class="table-header">Service Type</th>
            <th class="table-header">Amount</th>
            <th class="table-header">Payment Method</th>
            <th class="table-header">Status</th>
            <th class="table-header">Date</th>
            <th class="table-header">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="payment in filteredPayments" :key="payment.id">
            <td class="table-cell">{{ payment.transactionId }}</td>
            <td class="table-cell">{{ payment.serviceType }}</td>
            <td class="table-cell">Nu. {{ payment.amount }}</td>
            <td class="table-cell">
              <span :class="methodBadge(payment.method)">{{ payment.method }}</span>
            </td>
            <td class="table-cell">
              <span :class="statusBadge(payment.status)">{{ payment.status }}</span>
            </td>
            <td class="table-cell">{{ formatDate(payment.createdAt) }}</td>
            <td class="table-cell">
              <button v-if="payment.method === 'Manual' && payment.status === 'Pending Verification'"
                @click="verifyPayment(payment)" class="text-blue-500 hover:underline mr-2">
                Verify
              </button>
              <button @click="viewDetails(payment)" class="text-gray-600 hover:text-gray-900">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment Modal -->
    <PaymentModal v-if="showModal" :paymentType="selectedPaymentType" :existingPayment="selectedPayment"
      @submit="handlePaymentSubmit" @close="closeModal" />

    <!-- Payment Details Modal -->
    <PaymentDetailsModal v-if="selectedPayment" :payment="selectedPayment" @close="selectedPayment = null" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import PaymentModal from './modals/PaymentModal.vue';
import PaymentDetailsModal from './modals/PaymentDetailsModal.vue';

// Sample Data
const payments = ref([
  {
    id: 1,
    transactionId: 'PAY-2023-001',
    serviceType: 'Registration Fee',
    amount: 5000,
    method: 'Online',
    status: 'Completed',
    createdAt: '2023-01-05',
    referenceNumber: 'BANK-REF-001',
    paymentProof: null
  },
  {
    id: 2,
    transactionId: 'PAY-2023-002',
    serviceType: 'Renewal Fee',
    amount: 3000,
    method: 'Manual',
    status: 'Pending Verification',
    createdAt: '2023-02-10',
    referenceNumber: null,
    paymentProof: '/uploads/payment-proof.jpg'
  }
]);

// Reactive State
const filterStatus = ref('all');
const filterType = ref('all');
const searchQuery = ref('');
const filterDate = ref('');
const showModal = ref(false);
const selectedPaymentType = ref('online');
const selectedPayment = ref(null);

const paymentStatuses = [
  'Pending Verification',
  'Completed',
  'Failed',
  'Under Review',
  'Rejected'
];

// Computed Properties
const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    const matchesStatus = filterStatus.value === 'all' || payment.status === filterStatus.value;
    const matchesType = filterType.value === 'all' || payment.method === filterType.value;
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      payment.serviceType.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDate = !filterDate.value || payment.createdAt === filterDate.value;

    return matchesStatus && matchesType && matchesSearch && matchesDate;
  });
});

// Methods
const methodBadge = (method) => {
  return {
    'Online': 'bg-blue-100 text-blue-800',
    'Manual': 'bg-orange-100 text-orange-800'
  }[method] || 'bg-gray-100 text-gray-800';
};

const statusBadge = (status) => {
  return {
    'Completed': 'bg-green-100 text-green-800',
    'Pending Verification': 'bg-yellow-100 text-yellow-800',
    'Failed': 'bg-red-100 text-red-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB');
};

const showPaymentModal = (type) => {
  selectedPaymentType.value = type;
  selectedPayment.value = null;
  showModal.value = true;
};

const handlePaymentSubmit = (paymentData) => {
  if (paymentData.id) {
    // Update existing payment
    const index = payments.value.findIndex(p => p.id === paymentData.id);
    payments.value[index] = paymentData;
  } else {
    // Add new payment
    payments.value.push({
      id: payments.value.length + 1,
      ...paymentData,
      createdAt: new Date().toISOString().split('T')[0]
    });
  }
  closeModal();
};

const verifyPayment = (payment) => {
  selectedPayment.value = payment;
  showModal.value = true;
};

const viewDetails = (payment) => {
  selectedPayment.value = payment;
};

const closeModal = () => {
  showModal.value = false;
  selectedPayment.value = null;
};
</script>

<style scoped>
.filter-input {
  @apply w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

.status-badge {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}
</style>
