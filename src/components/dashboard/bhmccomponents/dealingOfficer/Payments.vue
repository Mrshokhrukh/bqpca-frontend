<template>
  <div class="bg-gray-50 min-h-screen p-4 md:p-6">
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Table Header -->
      <div class="px-4 py-3 bg-blue-500 text-white flex items-center justify-between">
        <h2 class="font-semibold text-lg md:text-xl">Transaction History</h2>
        <!-- Add any header actions here if needed -->
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-center">
        <p>Loading transactions...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 text-center text-red-600">
        <p>Error loading transactions: {{ error }}</p>
      </div>

      <!-- Transaction Table -->
      <div v-else-if="transactions.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Account
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To Account
              </th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <!-- Add more columns as needed -->
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                {{ transaction.transactionId }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                {{ formatDate(transaction.dateTime) }}
              </td>
              <td class="px-3 py-2 text-sm text-gray-700">
                {{ transaction.description }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm font-medium"
                :class="transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'">
                {{ formatCurrency(transaction.amount) }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                {{ transaction.fromAccount }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                {{ transaction.toAccount }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap text-sm">
                <span :class="getStatusClasses(transaction.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ transaction.status }}
                </span>
              </td>
              <!-- Add more cells as needed -->
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-8 text-center">
        <p class="text-gray-500">No transactions available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { format, parseISO } from 'date-fns'; // date-fns for date formatting

// Sample Transaction Data (Replace with your API call)
const transactions = ref([]);
const isLoading = ref(false);
const error = ref(null);

onMounted(async () => {
  await fetchTransactions();
});

async function fetchTransactions() {
  isLoading.value = true;
  error.value = null;
  try {
    // Simulate API call (replace with your actual API call)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    transactions.value = getSampleTransactions(); // Replace with API data
  } catch (err) {
    error.value = 'Failed to load transactions.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

function getSampleTransactions() {
  return [
    {
      id: 1,
      transactionId: 'TXN12345',
      dateTime: '2024-01-20T10:30:00',
      description: 'Transfer to John Doe',
      amount: 150.00,
      fromAccount: 'Savings-123',
      toAccount: 'Checking-456',
      status: 'Successful',
      type: 'debit' // 'debit' or 'credit' for styling amount
    },
    {
      id: 2,
      transactionId: 'TXN67890',
      dateTime: '2024-01-19T15:45:00',
      description: 'Salary Credit',
      amount: 2500.00,
      fromAccount: 'Employer',
      toAccount: 'Savings-123',
      status: 'Successful',
      type: 'credit'
    },
    {
      id: 3,
      transactionId: 'TXN11223',
      dateTime: '2024-01-18T09:00:00',
      description: 'Online Payment - Amazon',
      amount: 75.50,
      fromAccount: 'Savings-123',
      toAccount: 'Amazon',
      status: 'Pending',
      type: 'debit'
    },
    // ... more transactions
  ];
}

function formatDate(dateTimeString) {
  const date = parseISO(dateTimeString);
  return format(date, 'MMM d, yyyy h:mm a'); // Example format, customize as needed
}

function formatCurrency(amount) {
  return `Nu ${amount.toFixed(2)}`; // Example currency and formatting
}

function getStatusClasses(status) {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'Successful':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'Pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'Failed':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
}
</script>

<style scoped>
/* Optional: You can add custom styles here if needed */
</style>