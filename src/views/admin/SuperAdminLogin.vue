<!-- src/views/admin/SuperAdminLogin.vue -->
<template>
    <div
        class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div class="text-center">
                <h2 class="text-3xl font-serif font-bold text-slate-900">Super Admin Portal</h2>
                <p class="mt-2 text-sm text-slate-600">Access the main administrative dashboard</p>
            </div>

            <div class="mt-8 space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-slate-700"
                        >Email address</label
                    >
                    <input
                        v-model="email"
                        type="email"
                        id="email"
                        class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="super.admin@bqpca.gov.bt"
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-slate-700"
                        >Password</label
                    >
                    <div class="mt-1 relative">
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            id="password"
                            class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            @click="showPassword = !showPassword"
                            type="button"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <EyeIcon v-if="!showPassword" class="h-5 w-5 text-slate-400" />
                            <EyeOffIcon v-else class="h-5 w-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            type="checkbox"
                            id="remember-me"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <label for="remember-me" class="ml-2 block text-sm text-slate-700"
                            >Remember me</label
                        >
                    </div>

                    <div class="text-sm">
                        <a href="#" class="font-medium text-blue-600 hover:text-blue-500"
                            >Forgot password?</a
                        >
                    </div>
                </div>

                <div>
                    <button
                        @click="handleLogin"
                        :disabled="!isFormValid"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const isFormValid = computed(() => {
    return email.value && password.value
})

const handleLogin = async () => {
    try {
        console.log('Processing super admin login:', {
            email: email.value,
        })
        // Add your login logic here
    } catch (error) {
        console.error('Login error:', error)
    }
}
</script>
