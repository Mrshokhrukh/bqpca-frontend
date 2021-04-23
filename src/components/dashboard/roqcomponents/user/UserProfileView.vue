<template>
    <div class="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Header with Cover Image & Avatar -->
        <div class="relative mb-8">
            <!-- Cover Image with Gradient Overlay -->
            <div class="h-60 w-full rounded-xl overflow-hidden relative">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"
                ></div>
                <div
                    class="absolute inset-0 bg-[url('/img/profile-cover.jpg')] bg-cover bg-center mix-blend-overlay"
                ></div>

                <!-- Profile Stats Overlay -->
                <div
                    class="absolute bottom-0 left-0 right-0 p-6 text-white flex items-center justify-between"
                >
                    <div class="flex items-center space-x-6">
                        <!-- Avatar -->
                        <div class="relative">
                            <div
                                class="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg border-4 border-white transform translate-y-8"
                            >
                                {{
                                    profileData.first_name
                                        ? profileData.first_name.charAt(0).toUpperCase()
                                        : 'U'
                                }}
                            </div>
                        </div>

                        <!-- User Name -->
                        <div class="pt-8">
                            <h1 class="text-2xl font-bold">
                                {{ profileData.first_name }} {{ profileData.last_name }}
                            </h1>
                            <div class="flex items-center mt-1 text-blue-100">
                                <Mail class="w-4 h-4 mr-1.5" />
                                <span class="text-sm">{{ profileData.email }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <button
                        @click="toggleEditMode"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-md"
                        :class="[
                            isEditing
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-white text-blue-600 hover:bg-blue-50',
                        ]"
                    >
                        <Edit v-if="!isEditing" class="w-4 h-4 mr-2" />
                        <X v-else class="w-4 h-4 mr-2" />
                        {{ isEditing ? 'Cancel Editing' : 'Edit Profile' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Column: Stats and Certificates -->
            <div class="lg:col-span-4 space-y-6">
                <!-- Stats Cards -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div class="p-6">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Profile Overview</h2>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div
                                class="bg-blue-50 p-5 rounded-xl flex flex-col justify-between h-full"
                            >
                                <div class="flex items-center text-blue-600">
                                    <Award class="w-5 h-5 mr-2" />
                                    <span class="font-medium">Certifications</span>
                                </div>
                                <div class="mt-2">
                                    <p class="text-3xl font-bold text-gray-800">
                                        {{ userCertificates.length }}
                                    </p>
                                    <p class="text-xs text-gray-500 mt-1">Total certifications</p>
                                </div>
                            </div>

                            <div
                                class="bg-green-50 p-5 rounded-xl flex flex-col justify-between h-full"
                            >
                                <div class="flex items-center text-green-600">
                                    <CheckCircle class="w-5 h-5 mr-2" />
                                    <span class="font-medium">Verified</span>
                                </div>
                                <div class="mt-2">
                                    <p class="text-3xl font-bold text-gray-800">
                                        {{
                                            userCertificates.filter((c) => c.status === 'Verified')
                                                .length
                                        }}
                                    </p>
                                    <p class="text-xs text-gray-500 mt-1">
                                        Approved certifications
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Details Mini Section -->
                        <div class="border-t border-gray-100 pt-4">
                            <h3
                                class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3"
                            >
                                Contact Details
                            </h3>
                            <div class="space-y-3">
                                <div class="flex items-start">
                                    <Phone class="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                                    <div>
                                        <p class="text-sm text-gray-500">Phone</p>
                                        <p class="text-sm font-medium text-gray-800">
                                            {{ profileData.contact_number || 'Not provided' }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <MapPin class="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                                    <div>
                                        <p class="text-sm text-gray-500">Location</p>
                                        <p class="text-sm font-medium text-gray-800">
                                            {{ profileData.dzongkhag }}, {{ profileData.gewog }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Certificates List -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div class="flex items-center justify-between p-6 border-b border-gray-100">
                        <div class="flex items-center">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-lg font-semibold text-gray-800">My Certifications</h3>
                        </div>
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                            {{ userCertificates.length }} Total
                        </span>
                    </div>

                    <div class="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                        <!-- Display Certificates -->
                        <div
                            v-for="cert in userCertificates"
                            :key="cert.id"
                            class="p-4 hover:bg-gray-50 transition-colors duration-150"
                        >
                            <div class="flex items-center justify-between">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start">
                                        <ScrollText
                                            class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                                        />
                                        <div>
                                            <h4 class="font-medium text-gray-800 text-sm truncate">
                                                {{ cert.title }}
                                            </h4>
                                            <p class="text-xs text-gray-500 mt-1">
                                                QEC:
                                                <span class="font-medium">{{
                                                    cert.qec_number
                                                }}</span>
                                            </p>
                                            <div class="flex items-center mt-2">
                                                <CalendarDays
                                                    class="w-3.5 h-3.5 text-gray-400 mr-1.5"
                                                />
                                                <span class="text-xs text-gray-500">{{
                                                    formatDate(cert.updated_at)
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span
                                    :class="[
                                        'px-2.5 py-1 rounded-full text-xs font-medium flex items-center',
                                        cert.status === 'Verified'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800',
                                    ]"
                                >
                                    <span
                                        :class="[
                                            'w-1.5 h-1.5 rounded-full mr-1',
                                            cert.status === 'Verified'
                                                ? 'bg-green-600'
                                                : 'bg-yellow-600',
                                        ]"
                                    ></span>
                                    {{ cert.status }}
                                </span>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="userCertificates.length === 0" class="p-8 text-center">
                            <div
                                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-4"
                            >
                                <FileX class="w-6 h-6" />
                            </div>
                            <h3 class="text-sm font-medium text-gray-900 mb-1">
                                No certificates found
                            </h3>
                            <p class="text-sm text-gray-500">
                                Your certification history will appear here
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Profile Information Forms -->
            <div class="lg:col-span-8">
                <form @submit.prevent="updateProfile" class="space-y-6">
                    <!-- Personal Information -->
                    <div
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div
                            class="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100"
                        >
                            <div class="flex items-center">
                                <User class="w-5 h-5 text-blue-500 mr-2" />
                                <h3 class="text-lg font-semibold text-gray-800">
                                    Personal Information
                                </h3>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- First Name -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >First Name <span class="text-red-500">*</span></label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.first_name }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.first_name"
                                            type="text"
                                            required
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <!-- Middle Name -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Middle Name</label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.middle_name || '-' }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.middle_name"
                                            type="text"
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <!-- Last Name -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Last Name <span class="text-red-500">*</span></label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.last_name }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.last_name"
                                            type="text"
                                            required
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <!-- Date of Birth -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Date of Birth</label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ formatDate(profileData.date_of_birth) }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.date_of_birth"
                                            type="date"
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <!-- Gender -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Gender</label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 capitalize"
                                    >
                                        {{ profileData.gender || '-' }}
                                    </div>
                                    <div v-else class="relative">
                                        <select
                                            v-model="profileData.gender"
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <div
                                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                        >
                                            <ChevronDown class="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Contact Number -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Contact Number <span class="text-red-500">*</span></label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.contact_number }}
                                    </div>
                                    <div v-else class="relative">
                                        <div
                                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                        >
                                            <Phone class="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            v-model="profileData.contact_number"
                                            type="tel"
                                            required
                                            class="block w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Location Information -->
                    <div
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div
                            class="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100"
                        >
                            <div class="flex items-center">
                                <MapPin class="w-5 h-5 text-blue-500 mr-2" />
                                <h3 class="text-lg font-semibold text-gray-800">
                                    Location Details
                                </h3>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Dzongkhag -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Dzongkhag <span class="text-red-500">*</span></label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.dzongkhag }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.dzongkhag"
                                            type="text"
                                            required
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <!-- Gewog -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Gewog <span class="text-red-500">*</span></label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.gewog }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.gewog"
                                            type="text"
                                            required
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <!-- Village -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1"
                                        >Village <span class="text-red-500">*</span></label
                                    >
                                    <div
                                        v-if="!isEditing"
                                        class="text-gray-800 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {{ profileData.village }}
                                    </div>
                                    <div v-else class="relative">
                                        <input
                                            v-model="profileData.village"
                                            type="text"
                                            required
                                            class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button (Only when editing) -->
                    <div v-if="isEditing" class="flex justify-end">
                        <button
                            type="submit"
                            :disabled="loading"
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                            <Save v-else class="w-5 h-5" />
                            <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import { storeToRefs } from 'pinia'
import {
    Mail,
    User,
    MapPin,
    Award,
    ScrollText,
    Edit,
    X,
    CheckCircle,
    Save,
    Loader2,
    Phone,
    ChevronDown,
    CalendarDays,
    FileX,
} from 'lucide-vue-next'

const toast = inject('toast')

const authStore = useAuthStore()
const { userId } = storeToRefs(authStore)
const loading = ref(false)
const isEditing = ref(false)

const userCid = authStore.user.cid

const profileData = ref({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    contact_number: '',
    gender: '',
    dzongkhag: '',
    gewog: '',
    village: '',
})

const allCertificates = ref([])

// Filtered certificates for the logged-in user
const userCertificates = computed(() => {
    const certificates = allCertificates.value || []

    if (!authStore.user || !authStore.user.email) {
        console.warn('User email is not available.')
        return []
    }

    return certificates
})

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

const toggleEditMode = () => {
    if (isEditing.value) {
        loadProfile() // Reset to original values
    }
    isEditing.value = !isEditing.value
}

const loadProfile = async () => {
    if (authStore.user) {
        profileData.value = { ...authStore.user, email: authStore.email }

        try {
            // Fetch certificates
            const certs = await apiService.getRecognitionOfQualification(userCid)
            allCertificates.value = certs.data
        } catch (error) {
            toast.error('Failed to load certificates')
            console.error('Error fetching certificates:', error)
        }
    } else {
        toast.error('User not logged in')
    }
}

const updateProfile = async () => {
    loading.value = true

    try {
        if (!userId.value) {
            toast.error('User ID is missing. Please log in again.')
            return
        }

        const updateData = {
            id: userId.value,
            first_name: profileData.value.first_name,
            middle_name: profileData.value.middle_name,
            last_name: profileData.value.last_name,
            date_of_birth: profileData.value.date_of_birth,
            contact_number: profileData.value.contact_number,
            gender: profileData.value.gender,
            dzongkhag: profileData.value.dzongkhag,
            gewog: profileData.value.gewog,
            village: profileData.value.village,
        }

        await apiService.updateProfile(updateData)
        await authStore.updateUserAfterFetch()

        toast.success('Profile updated successfully!')
        isEditing.value = false
    } catch (error) {
        console.error('Error updating profile:', error)
        const errorMessage =
            error.response?.data?.message || 'Failed to update profile. Please try again.'
        toast.error(errorMessage)
    } finally {
        loading.value = false
    }
}

onMounted(loadProfile)
</script>

<style scoped>
/* Enhance scrollbar for certificate list */
.max-h-\[500px\]::-webkit-scrollbar {
    width: 6px;
}

.max-h-\[500px\]::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 10px;
}

.max-h-\[500px\]::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

/* Animation for avatar on hover */
.transform:hover {
    transform: translateY(8px) scale(1.03);
}
</style>
