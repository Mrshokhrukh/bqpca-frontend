<template>
    <div class="w-full mx-auto px-4 py-8">
        <!-- Header Section -->
        <div
            class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10"
        >
            <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Your EOI Applications</h2>
            <p class="text-gray-600 text-center max-w-2xl mx-auto">
                View all your Expression of Interest applications
            </p>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-center my-8">
            <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
        </div>

        <!-- Results Section -->
        <div v-else-if="applications?.length > 0" class="space-y-6">
            <div
                v-for="application in applications"
                :key="application.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors"
            >
                <div class="p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">
                                {{ application.name_of_institution }}
                                <span
                                    :class="[
                                        'ml-2 px-2 py-1 text-xs rounded-full',
                                        getStatusColor(application.review_decision),
                                    ]"
                                >
                                    {{ application.review_decision }}
                                </span>
                            </h3>
                            <p class="text-sm text-gray-500 mb-4">CID: {{ application.CID }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-900">Course Details</p>
                            <p class="text-sm text-gray-500">{{ application.title_of_course }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div>
                            <p class="text-sm font-medium text-gray-900">Contact Details</p>
                            <p class="text-sm text-gray-500">{{ application.contact_no }}</p>
                            <p class="text-sm text-gray-500">{{ application.email_address }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Location</p>
                            <p class="text-sm text-gray-500">
                                {{ application.dzongkhag }}, {{ application.gewog }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-900">Course Start Date</p>
                            <p class="text-sm text-gray-500">
                                {{ new Date(application.commencement_date).toLocaleDateString() }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-6">
                                <div>
                                    <p class="text-sm font-medium text-gray-900">Program Type</p>
                                    <p class="text-sm text-gray-600">
                                        {{
                                            application.type_of_programme === 'D'
                                                ? 'Diploma'
                                                : 'Bachelor'
                                        }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">Duration</p>
                                    <p class="text-sm text-gray-600">
                                        {{ application.course_duration }} months
                                    </p>
                                </div>
                                <div v-if="application.review_decision === 'Rejected'">
                                    <p class="text-sm font-medium text-gray-900">
                                        Rejection Reason
                                    </p>
                                    <p class="text-sm text-red-600">
                                        {{ application.reason_if_rejected }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Message for Approved Applications -->
                    <div
                        v-if="application.review_decision === 'Approved'"
                        class="mt-4 p-4 bg-green-100 text-green-700 rounded-lg"
                    >
                        Now you can proceed to DRP Application
                    </div>
                </div>
            </div>
        </div>

        <!-- No Results Message -->
        <div
            v-else-if="!isLoading && !apiError"
            class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
        >
            <p class="text-gray-600">You don't have any EOI applications in the system.</p>
        </div>
        <div
            v-else-if="apiError"
            class="text-center py-12 bg-red-100 rounded-xl border border-red-200"
        >
            <p class="text-red-600">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'

// State
const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')

// Get auth store and user information
const authStore = useAuthStore()

// Methods
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved':
            return 'bg-green-100 text-green-700'
        case 'Rejected':
            return 'bg-red-100 text-red-700'
        case 'Pending':
            return 'bg-yellow-100 text-yellow-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const fetchApplications = async () => {
    if (!authStore.user || !authStore.user.cid) {
        errorMessage.value = 'User information not available. Please log in again.'
        apiError.value = true
        return
    }

    isLoading.value = true
    apiError.value = false
    errorMessage.value = ''

    try {
        const response = await apiServices.getMhpcInstitutes()

        if (response && response.data && response.data.results) {
            // Filter applications based on user's CID from auth store
            const userCid = authStore.user.cid
            const userApplications = response.data.results.filter(
                (app) => app.CID.toLowerCase() === userCid.toLowerCase()
            )

            applications.value = userApplications
        } else {
            applications.value = []
        }
    } catch (error) {
        console.error('Error fetching EOI applications:', error)
        applications.value = []
        apiError.value = true
        errorMessage.value =
            error.response?.data?.message || 'Error fetching your applications. Please try again.'
    } finally {
        isLoading.value = false
    }
}

// Fetch applications on component mount
onMounted(fetchApplications)
</script>
