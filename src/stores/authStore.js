// authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToast()
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const registrationNo = ref(localStorage.getItem('registrationNo') || null)
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
      fullNameString += ` ${middleName}`
    }
    fullNameString += ` ${lastName}`

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
  const cid = computed(() => user.value?.cid || null)
  const userRegistrationNo = computed(() => registrationNo.value)

  const initializeAuth = () => {
    try {
      accessToken.value = localStorage.getItem('accessToken') || null
      refreshToken.value = localStorage.getItem('refreshToken') || null
      user.value = JSON.parse(localStorage.getItem('user')) || null
      registrationNo.value = localStorage.getItem('registrationNo') || null
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  }

  const fetchAndSetRegistrationNo = async () => {
    if (!cid.value) {
      console.warn('Cannot fetch registration number: User CID is not available.')
      return
    }

    try {
      const response = await apiService.getEpcNewApplications()
      const applications = response.data.results
      const userApplication = applications.find(
        (app) => String(app.cid_no).trim() === String(cid.value).trim(),
      )

      console.log('User CID from store:', cid.value)
      console.log('Found Application:', userApplication)

      if (userApplication && userApplication.registration_no) {
        console.log('Setting registrationNo in localStorage:', userApplication.registration_no)
        registrationNo.value = userApplication.registration_no
        localStorage.setItem('registrationNo', userApplication.registration_no)
      } else {
        console.warn(
          'No matching application or registration number found. Clearing from localStorage.',
        )
        registrationNo.value = null
        localStorage.removeItem('registrationNo')
      }
    } catch (error) {
      console.error('Error fetching EPC applications:', error)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await apiService.login({
        email: credentials.email,
        password: credentials.password,
        service_type: credentials.service_type,
      })
      accessToken.value = response.data.access
      refreshToken.value = response.data.refresh
      user.value = response.data.user
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(user.value))
      await fetchAndSetRegistrationNo()
      if (credentials.from === 'authSection') {
        if (
          user.value.role !== 'user' &&
          user.value.role !== 'cme_cpd_provider' &&
          user.value.role !== 'institutions'
        ) {
          toast.error(
            'Admin/Internal role access is not permitted from the previous page. Please login from here',
          )
          logout()
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
          logout()
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
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    registrationNo.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('registrationNo')
    toast.success('Logged out successfully!')
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
      setNewAccessToken(response.data.access)
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
        const currentTokens = {
          access: accessToken.value,
          refresh: refreshToken.value,
        }
        user.value = {
          ...response.data,
          access_token: currentTokens.access,
          refresh_token: currentTokens.refresh,
        }

        localStorage.setItem('user', JSON.stringify(user.value))
        await fetchAndSetRegistrationNo()

        toast.success('User details updated successfully')
      }
    } catch (error) {
      console.error('Error updating user details:', error)
      toast.error('Failed to update user details. Please try again.')
      if (error.response?.status === 401) {
        logout()
      }
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
    cid,
    userRegistrationNo,
    login,
    logout,
    initializeAuth,
    refreshAccessToken,
    updateUserAfterFetch,
    setNewAccessToken,
    fetchAndSetRegistrationNo,
  }
})
