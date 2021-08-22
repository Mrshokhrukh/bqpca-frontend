// authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToast()

  // State (remains largely the same)

  // State (remains largely the same)
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const userRegistrationNo = ref(localStorage.getItem('registrationNo') || null)

  // Getters (remains largely the same)
  const isAuthenticated = computed(() => !!accessToken.value)
  const userId = computed(() => user.value?.id || null)
  const serviceType = computed(() => user.value?.service_type || null)
  const role = computed(() => user.value?.role || null)
  const email = computed(() => user.value?.email || null)
  const username = computed(() => user.value?.username || null)
  const fullName = computed(() => {
    const firstName = user.value?.first_name || ''
    const middleName = user.value?.middle_name || ''
    const lastName = user.value?.last_name || ''

    let fullNameString = firstName
    if (middleName) {
      fullNameString += ' ' + middleName
    }
    fullNameString += ' ' + lastName

    fullNameString = fullNameString.trim()

    return fullNameString || null
  })
  const dzongkhag = computed(() => user.value?.dzongkhag || null)
  const gewog = computed(() => user.value?.gewog || null)
  const village = computed(() => user.value?.village || null)
  const dateOfBirth = computed(() => user.value?.date_of_birth || null)
  const contactNumber = computed(() => user.value?.contact_number || null)
  const gender = computed(() => user.value?.gender || null)
  const isCounselor = computed(() => user.value?.is_counselor || false)
  const isStaff = computed(() => user.value?.is_staff || false)
  const isSuperuser = computed(() => user.value?.is_superuser || false)
  const isActive = computed(() => user.value?.is_active || false)

  // Fetch and set tokens from localStorage
  // Fetch and set tokens from localStorage
  const initializeAuth = () => {
    try {
      accessToken.value = localStorage.getItem('accessToken') || null
      refreshToken.value = localStorage.getItem('refreshToken') || null
      user.value = JSON.parse(localStorage.getItem('user')) || null
      userRegistrationNo.value = localStorage.getItem('registrationNo') || null
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  }
  const fetchAndSetRegistrationNo = async () => {
    if (!user.value?.cid) {
      console.warn('Cannot fetch registration number: User CID is not available.')
      return
    }

    try {
      const response = await apiService.getEpcApplicationsByCid(user.value.cid)
      if (response.data && response.data.length > 0) {
        const regNo = response.data[0]?.registration_no
        if (regNo) {
          // Update the state
          userRegistrationNo.value = regNo
          // Save to localStorage for persistence across page reloads
          localStorage.setItem('registrationNo', regNo)
        }
      }
    } catch (err) {
      console.error('Failed to fetch and set EPC registration number:', err)
      // Throw the error so the calling component's try...catch block can handle it
      throw err
    }
  }

  // Actions
  const login = async (credentials) => {
    try {
      const response = await apiService.login({
        email: credentials.email,
        password: credentials.password,
        service_type: credentials.service_type,
      })

      // Update state

      // Update state
      accessToken.value = response.data.access
      refreshToken.value = response.data.refresh
      user.value = response.data.user

      // Save to localStorage

      // Save to localStorage
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(user.value))

      if (user.value.service_type === 'engineering_certification') {
        try {
          const applicationsResponse = await apiService.getEpcApplicationsByCid(user.value.cid)
          if (applicationsResponse.data && applicationsResponse.data.length > 0) {
            const userApplication = applicationsResponse.data[0]
            if (userApplication.registration_no) {
              localStorage.setItem('registrationNo', userApplication.registration_no)
            }
          }
        } catch (err) {
          console.error('Failed to fetch EPC applications:', err)
        }
      }

      // Role-based redirection logic
      if (credentials.from === 'authSection') {
        if (
          user.value.role !== 'user' &&
          user.value.role !== 'cme_cpd_provider' &&
          user.value.role !== 'institutions'
        ) {
          toast.error(
            'Admin/Internal role access is not permitted from the previous page. Please login from here',
          )
          // Clear state and storage
          accessToken.value = null
          refreshToken.value = null
          user.value = null
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          // Clear state and storage
          accessToken.value = null
          refreshToken.value = null
          user.value = null
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          router.push('/admin/login')
          return
        }
      } else if (credentials.from === 'adminLogin') {
        if (
          user.value.role === 'user' ||
          user.value.role === 'cme_cpd_provider' ||
          user.value.role === 'institutions'
        ) {
          toast.error('User role access is not permitted from the previous page.')
          // Clear state and storage
          accessToken.value = null
          refreshToken.value = null
          user.value = null
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          // Clear state and storage
          accessToken.value = null
          refreshToken.value = null
          user.value = null
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          router.push('/')
          return
        }
      }

      // Log the redirect route
      const redirectRoute = `/admin/${user.value.role}/${user.value.service_type}/dashboard`
      toast.success('Login successful!')
      router.push(redirectRoute)
    } catch (error) {
      console.error(error.response?.data?.message || 'Login failed. Please try again.')
      throw error
    }
  }

  const logout = () => {
    // Clear state
    // Clear state
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    userRegistrationNo.value = null

    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('registrationNo')

    toast.success('Logged out successfully!')

    // Force a full page reload to reset all component states

    // Force a full page reload to reset all component states
    window.location.href = '/'
  }

  const setNewAccessToken = (token) => {
    console.log('Setting new access token in store.')
    accessToken.value = token
    localStorage.setItem('accessToken', token)
  }

  const refreshAccessToken = async () => {
    try {
      const response = await apiService.refreshToken(refreshToken.value)
      return response.data.access
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      throw error
    }
  }

  const updateUserAfterFetch = async () => {
    if (!userId.value) {
      console.warn('Cannot update user: User ID is not available.')
      return
    }
    try {
      const response = await apiService.getUserDetails(userId.value)
      if (response.data) {
        // Preserve the existing tokens while updating user data
        // Preserve the existing tokens while updating user data
        const currentTokens = {
          access: accessToken.value,
          refresh: refreshToken.value,
        }

        // Update user data

        // Update user data
        user.value = {
          ...response.data,
          // Ensure critical auth-related fields are preserved
          // Ensure critical auth-related fields are preserved
          access_token: currentTokens.access,
          refresh_token: currentTokens.refresh,
        }

        localStorage.setItem('user', JSON.stringify(user.value))
        toast.success('User details updated successfully')
      }
    } catch (error) {
      console.error('Error updating user details:', error)
      // Don't logout on error, just show error message
      // Don't logout on error, just show error message
      toast.error('Failed to update user details. Please try again.')
      // Only logout if it's an authentication error (401)
      // Only logout if it's an authentication error (401)
      if (error.response?.status === 401) {
        logout()
      }
    }
  }

  const loginWithNdi = async (threadId) => {
    try {
      const response = await apiService.ndiLoginFinalize(threadId)

      // The logic here is nearly identical to the successful email login
      // 1. Update state
      accessToken.value = response.data.access
      refreshToken.value = response.data.refresh
      user.value = response.data.user

      // 2. Save to localStorage
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(user.value))

      // 3. Fetch related application data if necessary (e.g., registrationNo)
      if (user.value.service_type === 'engineering_certification') {
        await fetchAndSetRegistrationNo()
      }

      // 4. Role-based redirection logic
      // NOTE: We assume NDI login from AuthSection is always for non-admin roles
      if (
        user.value.role !== 'user' &&
        user.value.role !== 'cme_cpd_provider' &&
        user.value.role !== 'institutions'
      ) {
        toast.error('Admin/Internal role access is not permitted via NDI on this page.')
        // Clear everything and force redirect to admin login
        logout()
        router.push('/admin/login')
        return
      }

      const redirectRoute = `/admin/${user.value.role}/${user.value.service_type}/dashboard`
      toast.success('NDI Login successful!')
      router.push(redirectRoute)

    } catch (error) {
      console.error('NDI Login Finalization Error:', error)
      const errorMessage = error.response?.data?.error || 'NDI login failed. Please try again.'
      toast.error(errorMessage)
      throw error // Re-throw the error so the component knows it failed
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    userId,
    isAuthenticated,
    serviceType,
    role,
    email,
    username,
    fullName,
    dzongkhag,
    gewog,
    village,
    dateOfBirth,
    contactNumber,
    gender,
    isCounselor,
    isStaff,
    isSuperuser,
    isActive,
    login,
    logout,
    initializeAuth,
    refreshAccessToken,
    updateUserAfterFetch,
    setNewAccessToken,
    userRegistrationNo,
    fetchAndSetRegistrationNo,
    loginWithNdi,
  }
})


