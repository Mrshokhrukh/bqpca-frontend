<template>
  <div class="payment-history">
    <h2 class="payment-history__title">ECPF Payment History</h2>

    <!-- Search and Filter Section -->
    <div class="payment-history__filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search transactions..."
        class="payment-history__search"
      />
      <select v-model="filterStatus" class="payment-history__filter">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
    </div>

    <!-- Payment History Table -->
    <table class="payment-history__table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Transaction ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in filteredPayments" :key="payment.id">
          <td>{{ formatDate(payment.date) }}</td>
          <td>{{ payment.transactionId }}</td>
          <td>{{ formatAmount(payment.amount) }}</td>
          <td>
            <span :class="['status', payment.status]">
              {{ payment.status }}
            </span>
          </td>
          <td>{{ payment.description }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="payment-history__pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data (replace with actual API call)
const payments = ref([
  {
    id: 1,
    date: '2023-07-01',
    transactionId: 'TRX001',
    amount: 1000,
    status: 'completed',
    description: 'Monthly contribution',
  },
  // Add more sample data...
])

// Computed properties
const filteredPayments = computed(() => {
  return payments.value.filter((payment) => {
    const matchesSearch = payment.transactionId
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value ? payment.status === filterStatus.value : true
    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredPayments.value.length / itemsPerPage)
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
</script>

<style scoped>
.payment-history {
  padding: 20px;
}

.payment-history__title {
  margin-bottom: 20px;
}

.payment-history__filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.payment-history__search,
.payment-history__filter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.payment-history__table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.payment-history__table th,
.payment-history__table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status.completed {
  background-color: #e6ffe6;
  color: #008000;
}

.status.pending {
  background-color: #fff3e6;
  color: #ff8c00;
}

.status.failed {
  background-color: #ffe6e6;
  color: #ff0000;
}

.payment-history__pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}

button {
  padding: 8px 16px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
