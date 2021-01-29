# MastersDecisionManager.vue

<template>
    <div class="p-6 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Masters Decision Management</h1>

        <!-- Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">
                {{ isEditing ? 'Edit Decision' : 'Add New Decision' }}
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Decision Name</label>
                    <input v-model="formData.decision_name" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter decision name" required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="formData.description" rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter decision description" required></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <button v-if="isEditing" type="button" @click="cancelEdit"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {{ isEditing ? 'Update' : 'Add' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="min-w-full overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Decision Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="decision in decisions" :key="decision.id">
                            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {{ decision.decision_name }}
                            </td>
                            <td class="px-6 py-4">
                                <p class="line-clamp-2">{{ decision.description }}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button @click="editDecision(decision)"
                                    class="text-blue-600 hover:text-blue-900 focus:outline-none">
                                    Edit
                                </button>
                                <button @click="confirmDelete(decision.id)"
                                    class="text-red-600 hover:text-red-900 focus:outline-none">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <tr v-if="decisions.length === 0">
                            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                                No decisions found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1"
                class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between">
                    <button @click="currentPage > 1 && fetchDecisions(currentPage - 1)" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        Previous
                    </button>
                    <button @click="currentPage < totalPages && fetchDecisions(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p class="text-gray-600 mb-6">Are you sure you want to delete this decision? This action cannot be
                    undone.</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button @click="deleteDecision"
                        class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/services'

// State
const decisions = ref([])
const formData = ref({
    decision_name: '',
    description: ''
})
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Methods
const fetchDecisions = async (page = 1) => {
    try {
        const response = await api.getMastersDecisions()
        decisions.value = response.data.results
        totalPages.value = Math.ceil(response.data.count / 10) // Assuming 10 items per page
        currentPage.value = page
    } catch (error) {
        console.error('Error fetching decisions:', error)
    }
}

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.updateMastersDecision(editingId.value, formData.value)
        } else {
            await api.createMastersDecision(formData.value)
        }
        resetForm()
        fetchDecisions()
    } catch (error) {
        console.error('Error saving decision:', error)
    }
}

const editDecision = (decision) => {
    formData.value = {
        decision_name: decision.decision_name,
        description: decision.description
    }
    isEditing.value = true
    editingId.value = decision.id
}

const cancelEdit = () => {
    resetForm()
}

const resetForm = () => {
    formData.value = {
        decision_name: '',
        description: ''
    }
    isEditing.value = false
    editingId.value = null
}

const confirmDelete = (id) => {
    deleteId.value = id
    showDeleteModal.value = true
}

const deleteDecision = async () => {
    try {
        await api.deleteMastersDecision(deleteId.value)
        showDeleteModal.value = false
        deleteId.value = null
        fetchDecisions()
    } catch (error) {
        console.error('Error deleting decision:', error)
    }
}

// Lifecycle
onMounted(() => {
    fetchDecisions()
})
</script>