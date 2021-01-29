<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header Section -->
            <div class="mb-8">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-semibold text-gray-900">Appeal Reasons Management</h1>
                    <button @click="showForm = true"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        :disabled="isLoading">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Appeal Reason
                    </button>
                </div>
                <p class="mt-2 text-sm text-gray-600">Manage and organize appeal reasons for the system.</p>
            </div>

            <!-- Error Alert -->
            <div v-if="error" class="mb-6">
                <div class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">Error</h3>
                            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form -->
            <div v-if="showForm" class="mb-8">
                <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">
                            {{ editingReason ? 'Edit Appeal Reason' : 'Add New Appeal Reason' }}
                        </h3>
                        <form @submit.prevent="editingReason ? updateAppealReason() : createAppealReason()"
                            class="mt-5">
                            <div class="grid grid-cols-1 gap-6">
                                <div>
                                    <label for="appeal_name" class="block text-sm font-medium text-gray-700">
                                        Appeal Name
                                    </label>
                                    <input id="appeal_name" v-model="formData.appeal_name" type="text" required
                                        class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label for="description" class="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea id="description" v-model="formData.description" rows="3"
                                        class="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div class="mt-5 flex justify-end space-x-3">
                                <button type="button" @click="resetForm"
                                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    :disabled="isLoading">
                                    Cancel
                                </button>
                                <button type="submit"
                                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    :disabled="isLoading">
                                    {{ editingReason ? 'Update' : 'Create' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Appeal Name
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="isLoading">
                                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                                    <div class="flex justify-center items-center">
                                        <svg class="animate-spin h-5 w-5 text-indigo-600"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        <span class="ml-2">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else-if="appealReasons.length === 0">
                                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">
                                    No appeal reasons found
                                </td>
                            </tr>
                            <tr v-for="reason in appealReasons" :key="reason.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ reason.appeal_name }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-500">
                                    {{ reason.description }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="editReason(reason)"
                                        class="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none focus:underline">
                                        Edit
                                    </button>
                                    <button @click="deleteAppealReason(reason.id)"
                                        class="text-red-600 hover:text-red-900 focus:outline-none focus:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.count > 0" class="mt-5 flex items-center justify-between">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button v-if="pagination.previous" @click="changePage(pagination.currentPage - 1)"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </button>
                    <button v-if="pagination.next" @click="changePage(pagination.currentPage + 1)"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing page <span class="font-medium">{{ pagination.currentPage }}</span> of
                            <span class="font-medium">{{ totalPages() }}</span>
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button v-if="pagination.previous" @click="changePage(pagination.currentPage - 1)"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span class="sr-only">Previous</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button v-if="pagination.next" @click="changePage(pagination.currentPage + 1)"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span class="sr-only">Next</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/services'

// Data
const appealReasons = ref([])
const isLoading = ref(false)
const showForm = ref(false)
const editingReason = ref(null)

// Pagination
const pagination = ref({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1
})

// Form data
const formData = ref({
    appeal_name: '',
    description: ''
})

// Error handling
const error = ref(null)

// Fetch all appeal reasons with pagination
const fetchAppealReasons = async (page = 1) => {
    isLoading.value = true
    error.value = null
    try {
        const response = await api.getMastersAppealReasons()
        appealReasons.value = response.data.results
        pagination.value = {
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            currentPage: page
        }
    } catch (err) {
        error.value = 'Failed to fetch appeal reasons'
        console.error('Error:', err)
    } finally {
        isLoading.value = false
    }
}

// Create new appeal reason
const createAppealReason = async () => {
    isLoading.value = true
    error.value = null
    try {
        await api.createMastersAppealReason(formData.value)
        await fetchAppealReasons(pagination.value.currentPage)
        resetForm()
        showForm.value = false
    } catch (err) {
        error.value = 'Failed to create appeal reason'
        console.error('Error:', err)
    } finally {
        isLoading.value = false
    }
}

// Update appeal reason
const updateAppealReason = async () => {
    if (!editingReason.value) return

    isLoading.value = true
    error.value = null
    try {
        await api.updateMastersAppealReason(editingReason.value.id, formData.value)
        await fetchAppealReasons(pagination.value.currentPage)
        resetForm()
    } catch (err) {
        error.value = 'Failed to update appeal reason'
        console.error('Error:', err)
    } finally {
        isLoading.value = false
    }
}

// Delete appeal reason
const deleteAppealReason = async (id) => {
    if (!confirm('Are you sure you want to delete this appeal reason?')) return

    isLoading.value = true
    error.value = null
    try {
        await api.deleteMastersAppealReason(id)
        await fetchAppealReasons(pagination.value.currentPage)
    } catch (err) {
        error.value = 'Failed to delete appeal reason'
        console.error('Error:', err)
    } finally {
        isLoading.value = false
    }
}

// Handle page change
const changePage = async (page) => {
    await fetchAppealReasons(page)
}

// Helper functions
const editReason = (reason) => {
    editingReason.value = reason
    formData.value = {
        appeal_name: reason.appeal_name,
        description: reason.description
    }
    showForm.value = true
}

const resetForm = () => {
    formData.value = {
        appeal_name: '',
        description: ''
    }
    editingReason.value = null
    showForm.value = false
}

// Compute total pages
const totalPages = () => {
    return Math.ceil(pagination.value.count / 10)
}

// Lifecycle hooks
onMounted(() => {
    fetchAppealReasons()
})
</script>