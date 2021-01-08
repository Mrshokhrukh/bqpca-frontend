import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    userRole: (state) => state.user?.role ?? 'guest',
  },

  actions: {
    async login(credentials) {
      try {
        // API call would go here
        this.user = { id: 1, name: 'Test User', role: 'applicant' }
        this.token = 'dummy-token'
        this.isAuthenticated = true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },
  },
})
