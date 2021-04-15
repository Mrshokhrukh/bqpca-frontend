<template>
  <div class="payment-history">
    <h2 class="text-2xl font-semibold mb-4">Payment History</h2>

    <!-- Search and Filter Section -->
    <div class="mb-4 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search payments..."
        class="p-2 border rounded"
      />
      <select v-model="statusFilter" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Payment Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Date</th>
            <th class="py-2 px-4 border-b">Reference No.</th>
            <th class="py-2 px-4 border-b">Amount</th>
            <th class="py-2 px-4 border-b">Status</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in filteredPayments" :key="payment.id">
            <td class="py-2 px-4 border-b">{{ payment.date }}</td>
            <td class="py-2 px-4 border-b">{{ payment.referenceNo }}</td>
            <td class="py-2 px-4 border-b">${{ payment.amount }}</td>
            <td class="py-2 px-4 border-b">
              <span :class="getStatusClass(payment.status)">
                {{ payment.status }}
              </span>
            </td>
            <td class="py-2 px-4 border-b">
              <button
                @click="viewDetails(payment.id)"
                class="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const statusFilter = ref('')
const payments = ref([
  {
    id: 1,
    date: '2023-11-01',
    referenceNo: 'REF001',
    amount: 1500.0,
    status: 'completed',
  },
  {
    id: 2,
    date: '2023-11-02',
    referenceNo: 'REF002',
    amount: 2300.0,
    status: 'pending',
  },
  // Add more sample data as needed
])

const filteredPayments = computed(() => {
  return payments.value.filter((payment) => {
    const matchesSearch = payment.referenceNo
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === '' || payment.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  return (
    {
      completed: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600',
    }[status] || ''
  )
}

const viewDetails = (paymentId) => {
  // Implement view details logic
  console.log('Viewing details for payment:', paymentId)
}
</script>

<style scoped>
.payment-history {
  padding: 1.5rem;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  text-align: left;
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #f5f5f5;
}
</style>
