<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 shadow-md">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p class="text-gray-600">View your payment records for BMHC certifications, renewals, CPDs, and more.</p>
      </div>

      <!-- Filter & Search Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Search by Transaction ID -->
          <div>
            <label for="transaction-search" class="block text-sm font-medium text-gray-700">Search by Transaction ID</label>
            <div class="mt-1">
              <input id="transaction-search" v-model="transactionSearch" type="text" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Enter Transaction ID...">
            </div>
          </div>

          <!-- Payment Type Filter -->
          <div>
            <label for="payment-type-filter" class="block text-sm font-medium text-gray-700">Payment Type</label>
            <div class="mt-1">
              <select id="payment-type-filter" v-model="paymentTypeFilter" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="all">All Payment Types</option>
                <option value="certification">Certification</option>
                <option value="renewal">Renewal</option>
                <option value="cpd">CPD Activity</option>
                <option value="cogs">COGS Issuance</option>
                <!-- Add more types as needed -->
              </select>
            </div>
          </div>

          <!-- Date Range Filter -->
          <div>
            <label for="payment-date-range" class="block text-sm font-medium text-gray-700">Payment Date Range</label>
            <div class="mt-1 flex gap-2">
              <input id="date-start" v-model="dateRange.start" type="date" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md">
              <input id="date-end" v-model="dateRange.end" type="date" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Records Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (Nu.)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in filteredPayments" :key="record.transactionId">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.transactionId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.payerName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.paymentType }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.amount.toLocaleString('en-IN') }}</td> <!-- Formats amount as currency -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(record.paymentDate) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(record.status)}`">{{ record.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredPayments.length === 0" class="p-4 text-gray-500 text-center">
            No payment records found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

// Sample Payment Records (Bhutanese Context)
const paymentRecords = reactive([
  { transactionId: 'TXN-2024-001', payerName: 'Tenzin Wangdi', paymentType: 'certification', amount: 1000, paymentDate: '2024-01-15', status: 'Success' },
  { transactionId: 'TXN-2024-002', payerName: 'Dechen Choden', paymentType: 'renewal', amount: 5000, paymentDate: '2024-02-20', status: 'Success' },
  { transactionId: 'TXN-2024-003', payerName: 'Karma Dorji', paymentType: 'cpd', amount: 2500, paymentDate: '2024-03-10', status: 'Pending' },
  { transactionId: 'TXN-2024-004', payerName: 'Sonam Pelden', paymentType: 'certification', amount: 1000, paymentDate: '2024-04-05', status: 'Success' },
  { transactionId: 'TXN-2024-005', payerName: 'Tshering Lhamo', paymentType: 'renewal', amount: 5000, paymentDate: '2024-05-12', status: 'Success' },
  { transactionId: 'TXN-2024-006', payerName: 'Jigme Singye', paymentType: 'cogs', amount: 3000, paymentDate: '2024-06-01', status: 'Success' },
  { transactionId: 'TXN-2024-007', payerName: 'Pema Yangki', paymentType: 'cpd', amount: 2500, paymentDate: '2024-07-18', status: 'Success' },
  { transactionId: 'TXN-2024-008', payerName: 'Ugyen Dema', paymentType: 'renewal', amount: 5000, paymentDate: '2024-08-22', status: 'Failed' },
  { transactionId: 'TXN-2024-009', payerName: 'Sangay Tenzin', paymentType: 'certification', amount: 1000, paymentDate: '2024-09-07', status: 'Success' },
  { transactionId: 'TXN-2024-010', payerName: 'Yeshey Choden', paymentType: 'cpd', amount: 2500, paymentDate: '2024-10-03', status: 'Success' },
  { transactionId: 'TXN-2024-011', payerName: 'Rinchen Namgyal', paymentType: 'cogs', amount: 3000, paymentDate: '2024-11-11', status: 'Success' },
  { transactionId: 'TXN-2024-012', payerName: 'Leki Wangmo', paymentType: 'renewal', amount: 5000, paymentDate: '2024-12-25', status: 'Pending' },

  // Add more records as needed
]);

// Reactive State
const transactionSearch = ref('');
const paymentTypeFilter = ref('all');
const dateRange = reactive({ start: '', end: '' });

// Computed Property to Filter Payments
const filteredPayments = computed(() => {
  let payments = [...paymentRecords]; // Create a copy to avoid mutating the original

  // Filter by Transaction ID
  if (transactionSearch.value) {
    payments = payments.filter(record =>
      record.transactionId.toLowerCase().includes(transactionSearch.value.toLowerCase())
    );
  }

  // Filter by Payment Type
  if (paymentTypeFilter.value !== 'all') {
    payments = payments.filter(record => record.paymentType === paymentTypeFilter.value);
  }

  // Filter by Date Range
  if (dateRange.start && dateRange.end) {
    payments = payments.filter(record => {
      const paymentDate = new Date(record.paymentDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  return payments;
});


// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB'); // Bhutan often uses DD/MM/YYYY
};

const statusBadge = (status) => {
  const classes = {
    'Success': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Failed': 'bg-red-100 text-red-800',
    // Add more statuses as needed
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>