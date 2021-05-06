<template>
    <div class="p-4 w-full">
        <!-- Header Section -->
        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
            <h2 class="text-3xl font-serif font-bold text-slate-900">My Applications</h2>
            <button
                class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                @click="showModal = true"
            >
                <span class="mr-2">+</span>
                New Application
            </button>
        </div>

        <!-- Modal for New Application Form -->
        <TransitionRoot appear :show="showModal" as="template">
            <Dialog as="div" @close="showModal = false" class="relative z-50">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel class="bg-white rounded-lg p-8 shadow-xl max-w-7xl relative">
                                <button
                                    @click="showModal = false"
                                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <span class="sr-only">Close</span>
                                    <XMarkIcon class="h-6 w-6" />
                                </button>
                                <ApplicationForm
                                    @application-submitted="handleApplicationSubmitted"
                                    @close-modal="showModal = false"
                                />
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Application Table with Loading State -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div
                v-else-if="filteredApplications.length === 0"
                class="py-12 text-center text-gray-500"
            >
                No applications found
            </div>
            <div v-else class="w-full overflow-x-auto">
                <ApplicationTable
                    :applications="paginatedApplications"
                    :current-page="currentPage"
                    :total-results="filteredTotal"
                    :per-page="perPage"
                    @page-change="handlePageChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ApplicationForm from './ApplicationForm.vue'
import ApplicationTable from '@/components/common/ROQ/ROQUserApplicationsList.vue'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'

const { user } = useAuthStore()
const showModal = ref(false)
const loading = ref(true)
const currentPage = ref(1)
const perPage = ref(5)
const applications = ref([])
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const sortOrder = ref({ field: 'created_at', direction: 'desc' })

const filteredApplications = computed(() => {
    const apps = Array.isArray(applications.value) ? applications.value : []
    return apps.filter((app) => {
        const matchesStatus = selectedStatus.value ? app.status === selectedStatus.value : true
        const matchesType = selectedType.value
            ? app.type_of_course?.name === selectedType.value
            : true
        const matchesSearch = searchQuery.value
            ? Object.values(app).some((value) =>
                  String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
              )
            : true
        const isNotSecondCopy = !app.is_second_copy

        return matchesStatus && matchesType && matchesSearch && isNotSecondCopy
    })
})

const sortedApplications = computed(() => {
    return [...filteredApplications.value].sort((a, b) => {
        const aValue = a[sortOrder.value.field]
        const bValue = b[sortOrder.value.field]
        const modifier = sortOrder.value.direction === 'asc' ? 1 : -1

        if (sortOrder.value.field === 'created_at' || sortOrder.value.field === 'updated_at') {
            const aDate = new Date(aValue)
            const bDate = new Date(bValue)
            if (aDate < bDate) return -1 * modifier
            if (aDate > bDate) return 1 * modifier
            return 0
        }

        if (aValue < bValue) return -1 * modifier
        if (aValue > bValue) return 1 * modifier
        return 0
    })
})

const filteredTotal = computed(() => sortedApplications.value.length)

const paginatedApplications = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return sortedApplications.value.slice(start, end)
})

watch([selectedStatus, selectedType, searchQuery], () => {
    currentPage.value = 1
})

const handleApplicationSubmitted = async () => {
    showModal.value = false
    loading.value = true
    try {
        await loadData()
        await nextTick()
        console.log('Applications updated:', applications.value)
    } catch (error) {
        console.error('Error refreshing data:', error)
    } finally {
        loading.value = false
    }
}

const loadData = async () => {
    loading.value = true
    try {
        console.log(user.cid)
        const response = await apiService.getRecognitionOfQualification(user.cid)
        console.log('API response:', response.data)
        applications.value = response.data // Assign the array directly
    } catch (error) {
        console.error('Error loading data:', error)
        applications.value = [] // Fallback to empty array
    } finally {
        loading.value = false
    }
}

const handlePageChange = (newPage) => {
    currentPage.value = newPage
}

onMounted(() => {
    loadData()
})
</script>
