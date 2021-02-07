<template>
    <div class="certification-validity-container">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="bg-white shadow rounded-lg p-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">Certification Validity Check</h1>

                <div class="space-y-4">
                    <div class="form-group">
                        <label for="certificateNumber" class="block text-sm font-medium text-gray-700">
                            Certificate Number
                        </label>
                        <input type="text" id="certificateNumber" v-model="certificateNumber"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            placeholder="Enter certificate number" />
                    </div>

                    <button @click="validateCertificate"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Validate Certificate
                    </button>
                </div>

                <!-- Result Section -->
                <div v-if="validationResult !== null" class="mt-6 p-4 rounded-md" :class="resultClass">
                    <p class="text-sm">{{ validationMessage }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive state
const certificateNumber = ref('')
const validationResult = ref(null)
const validationMessage = ref('')

// Computed property for dynamic classes
const resultClass = computed(() => ({
    'bg-green-50 text-green-800': validationResult.value === true,
    'bg-red-50 text-red-800': validationResult.value === false
}))

// Methods
const validateCertificate = async () => {
    try {
        // This is a placeholder for your actual API call
        console.log('Validating certificate:', certificateNumber.value)

        // Placeholder validation logic
        if (certificateNumber.value) {
            validationResult.value = true
            validationMessage.value = 'Certificate is valid.'
        } else {
            validationResult.value = false
            validationMessage.value = 'Certificate is not valid.'
        }
    } catch (error) {
        console.error('Validation error:', error)
        validationResult.value = false
        validationMessage.value = 'Error occurred during validation. Please try again.'
    }
}

// Lifecycle hooks
onMounted(() => {
    console.log('CertificationValidityPage component mounted')
})
</script>

<style scoped>
.certification-validity-container {
    min-height: calc(100vh - 64px);
    /* Adjust based on your header height */
    background-color: #f3f4f6;
}

/* Add any additional custom styles here */
</style>