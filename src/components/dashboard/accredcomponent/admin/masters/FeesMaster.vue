# FeesMaster.vue

<template>
    <div class="p-4">
        <div class="mb-6">
            <h2 class="text-2xl font-bold">Fee Management</h2>
            <p class="text-gray-600">Manage fee categories and amounts</p>
        </div>

        <!-- Fee Form -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Fee' : 'Add New Fee' }}</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Fee Category</label>
                    <input v-model="form.category" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <input v-model="form.description" type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Amount (Nu.)</label>
                    <input v-model="form.amount" type="number" min="0" step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required />
                </div>

                <div class="flex justify-end space-x-2">
                    <button type="button" @click="resetForm"
                        class="px-4 py-2 border rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm hover:bg-blue-700">
                        {{ isEditing ? 'Update' : 'Save' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Fee List -->
        <div class="bg-white rounded-lg shadow">
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-4">Fee List</h3>

                <!-- Search -->
                <div class="mb-4">
                    <input v-model="searchQuery" type="text" placeholder="Search fees..."
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount (Nu.)
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="fee in filteredFees" :key="fee.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">{{ fee.category }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ fee.description }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ fee.amount.toFixed(2) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button @click="editFee(fee)" class="text-blue-600 hover:text-blue-900 mr-3">
                                    Edit
                                </button>
                                <button @click="deleteFee(fee.id)" class="text-red-600 hover:text-red-900">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredFees.length === 0">
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                No fees found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Form state
const form = ref({
    category: '',
    description: '',
    amount: null
});

const isEditing = ref(false);
const editingId = ref(null);
const searchQuery = ref('');

// Mock data - replace with actual API calls
const fees = ref([
    {
        id: 1,
        category: 'Registration',
        description: 'Initial registration fee',
        amount: 1000.00
    },
    {
        id: 2,
        category: 'Renewal',
        description: 'Annual renewal fee',
        amount: 500.00
    },
]);

// Computed property for filtered fees
const filteredFees = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return fees.value.filter(fee =>
        fee.category.toLowerCase().includes(query) ||
        fee.description.toLowerCase().includes(query) ||
        fee.amount.toString().includes(query)
    );
});

// Form handlers
const resetForm = () => {
    form.value = {
        category: '',
        description: '',
        amount: null
    };
    isEditing.value = false;
    editingId.value = null;
};

const handleSubmit = () => {
    if (isEditing.value) {
        // Update existing fee
        const index = fees.value.findIndex(f => f.id === editingId.value);
        if (index !== -1) {
            fees.value[index] = {
                ...fees.value[index],
                ...form.value
            };
        }
    } else {
        // Add new fee
        fees.value.push({
            id: Date.now(), // temporary ID generation
            ...form.value
        });
    }
    resetForm();
};

const editFee = (fee) => {
    form.value = { ...fee };
    isEditing.value = true;
    editingId.value = fee.id;
};

const deleteFee = (id) => {
    if (confirm('Are you sure you want to delete this fee?')) {
        fees.value = fees.value.filter(fee => fee.id !== id);
    }
};
</script>