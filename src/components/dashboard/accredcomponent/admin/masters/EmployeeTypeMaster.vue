# EmployeeTypeManager.vue

<template>
    <div class="p-6 w-full mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Employee Type Management</h1>

        <!-- Success/Error Notifications -->
        <div
            v-if="notification.show"
            :class="{
                'fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 max-w-md': true,
                'bg-green-50 text-green-800 border border-green-200':
                    notification.type === 'success',
                'bg-red-50 text-red-800 border border-red-200': notification.type === 'error',
            }"
        >
            <div class="flex items-center justify-between">
                <p>{{ notification.message }}</p>
                <button @click="clearNotification" class="ml-4 text-gray-500 hover:text-gray-700">
                    ×
                </button>
            </div>
        </div>

        <!-- Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">
                {{ isEditing ? 'Edit Employee Type' : 'Add New Employee Type' }}
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Employee Type Name</label
                    >
                    <input
                        v-model="formData.employee_type_name"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter employee type name"
                        required
                        :maxlength="100"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        v-model="formData.description"
                        rows="4"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter type description"
                        required
                        :maxlength="500"
                    ></textarea>
                    <p class="text-sm text-gray-500 mt-1">
                        {{ formData.description.length }}/500 characters
                    </p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        v-if="isEditing"
                        type="button"
                        @click="cancelEdit"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :disabled="isLoading"
                    >
                        <span v-if="isLoading" class="inline-flex items-center">
                            <svg
                                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {{ isEditing ? 'Updating...' : 'Adding...' }}
                        </span>
                        <span v-else>{{ isEditing ? 'Update' : 'Add' }}</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Search and Filter -->
            <div class="p-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search employee types..."
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @input="handleSearch"
                    />
                    <div class="ml-4">
                        <select
                            v-model="sortBy"
                            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @change="handleSort"
                        >
                            <option value="employee_type_name">Sort by Name</option>
                            <option value="created_at">Sort by Date</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="min-w-full overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="toggleSort('employee_type_name')"
                            >
                                Type Name
                                <span v-if="sortBy === 'employee_type_name'">
                                    {{ sortDesc ? '↓' : '↑' }}
                                </span>
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="isLoading && !types.length">
                            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                                Loading...
                            </td>
                        </tr>
                        <tr v-else-if="filteredTypes.length === 0">
                            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
                                No employee types found
                            </td>
                        </tr>
                        <tr v-for="type in filteredTypes" :key="type.id">
                            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {{ type.employee_type_name }}
                            </td>
                            <td class="px-6 py-4">
                                <p class="line-clamp-2">{{ type.description }}</p>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"
                            >
                                <button
                                    @click="editType(type)"
                                    class="text-blue-600 hover:text-blue-900 focus:outline-none"
                                    :disabled="isLoading"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="confirmDelete(type.id)"
                                    class="text-red-600 hover:text-red-900 focus:outline-none"
                                    :disabled="isLoading"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div
                v-if="totalPages > 1"
                class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            >
                <div class="flex-1 flex justify-between items-center">
                    <button
                        @click="currentPage > 1 && fetchTypes(currentPage - 1)"
                        :disabled="currentPage === 1 || isLoading"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 || isLoading }"
                    >
                        Previous
                    </button>
                    <span class="text-sm text-gray-700">
                        Page {{ currentPage }} of {{ totalPages }}
                    </span>
                    <button
                        @click="currentPage < totalPages && fetchTypes(currentPage + 1)"
                        :disabled="currentPage === totalPages || isLoading"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{
                            'opacity-50 cursor-not-allowed':
                                currentPage === totalPages || isLoading,
                        }"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
            v-if="showDeleteModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        >
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p class="text-gray-600 mb-6">
                    Are you sure you want to delete this employee type? This action cannot be
                    undone.
                </p>
                <div class="flex justify-end space-x-3">
                    <button
                        @click="showDeleteModal = false"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        :disabled="isLoading"
                    >
                        Cancel
                    </button>
                    <button
                        @click="deleteType"
                        class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        :disabled="isLoading"
                    >
                        <span v-if="isLoading">Deleting...</span>
                        <span v-else>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import api from '@/services/services'

// State
const types = ref([])
const searchQuery = ref('')
const formData = ref({
    employee_type_name: '',
    description: '',
})
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const sortBy = ref('employee_type_name')
const sortDesc = ref(false)
const notification = ref({
    show: false,
    type: 'success',
    message: '',
    timeout: null,
})

// Computed
const filteredTypes = computed(() => {
    let filtered = [...types.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            (type) =>
                type.employee_type_name.toLowerCase().includes(query) ||
                type.description.toLowerCase().includes(query)
        )
    }

    // Sort
    filtered.sort((a, b) => {
        const modifier = sortDesc.value ? -1 : 1
        return a[sortBy.value] > b[sortBy.value] ? modifier : -modifier
    })

    return filtered
})

// Methods
const fetchTypes = async (page = 1) => {
    try {
        isLoading.value = true
        const response = await api.getMastersEmployeeTypes()
        types.value = response.data.results
        totalPages.value = Math.ceil(response.data.count / 10)
        currentPage.value = page
    } catch (error) {
        showNotification('Error loading employee types', 'error')
    } finally {
        isLoading.value = false
    }
}

const handleSearch = () => {
    currentPage.value = 1
}

const handleSort = () => {
    currentPage.value = 1
}

const toggleSort = (field) => {
    if (sortBy.value === field) {
        sortDesc.value = !sortDesc.value
    } else {
        sortBy.value = field
        sortDesc.value = false
    }
}

const showNotification = (message, type = 'success') => {
    if (notification.value.timeout) {
        clearTimeout(notification.value.timeout)
    }
    notification.value = {
        show: true,
        type,
        message,
        timeout: setTimeout(() => {
            notification.value.show = false
        }, 3000),
    }
}

const clearNotification = () => {
    notification.value.show = false
    if (notification.value.timeout) {
        clearTimeout(notification.value.timeout)
    }
}

const handleSubmit = async () => {
    try {
        isLoading.value = true
        if (isEditing.value) {
            await api.updateMastersEmployeeType(editingId.value, formData.value)
            showNotification('Employee type updated successfully')
        } else {
            await api.createMastersEmployeeType(formData.value)
            showNotification('Employee type created successfully')
        }
        resetForm()
        fetchTypes()
    } catch (error) {
        showNotification(error.response?.data?.message || 'Error saving employee type', 'error')
    } finally {
        isLoading.value = false
    }
}

const editType = (type) => {
    formData.value = {
        employee_type_name: type.employee_type_name,
        description: type.description,
    }
    isEditing.value = true
    editingId.value = type.id
}

const cancelEdit = () => {
    resetForm()
}

const resetForm = () => {
    formData.value = {
        employee_type_name: '',
        description: '',
    }
    isEditing.value = false
    editingId.value = null
}

const confirmDelete = (id) => {
    deleteId.value = id
    showDeleteModal.value = true
}

const deleteType = async () => {
    try {
        isLoading.value = true
        await api.deleteMastersEmployeeType(deleteId.value)
        showDeleteModal.value = false
        deleteId.value = null
        showNotification('Employee type deleted successfully')
        fetchTypes()
    } catch (error) {
        showNotification(error.response?.data?.message || 'Error deleting employee type', 'error')
    } finally {
        isLoading.value = false
    }
}

// Cleanup on component unmount
onBeforeUnmount(() => {
    if (notification.value.timeout) {
        clearTimeout(notification.value.timeout)
    }
})

// Lifecycle
onMounted(() => {
    fetchTypes()
})

// Watch for search query changes
watch(searchQuery, () => {
    handleSearch()
})
</script>
