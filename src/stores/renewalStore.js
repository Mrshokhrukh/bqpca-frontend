import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import apiService from '@/services/services'
import { useAuthStore } from './authStore'
import { useHealthCertificationStore } from './mhpcNavigationStore'
// ❗ 1. IMPORT THE CENTRALIZED CPD STORE
import { useMhpcCpdStore } from './mhpcCpdStore'

// Import icons needed for CPD getters
import { CheckCircle, AlertTriangle, Info } from 'lucide-vue-next'

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)

export const useRenewalStore = defineStore('renewal', () => {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  const healthStore = useHealthCertificationStore()
  // ❗ 2. CREATE AN INSTANCE OF THE CPD STORE
  const mhpcCpdStore = useMhpcCpdStore()

  // ## STATE ##
  const isLoading = ref(true)
  const isSubmitting = ref(false)
  const loadError = ref('')

  const formData = ref({
    cid_no: '',
    full_name: '',
    gender: '',
    date_of_birth: '',
    contact_no: '',
    email_address: '',
    village: '',
    gewog: '',
    dzongkhag: '',
    registration_date: '',
    expiry_date: '',
    id: null,
    is_active: false,
    qualification_id_to_renew: null,
  })

  const complaints = ref([])
  const isComplaintsLoading = ref(false)
  const complaintsLoadError = ref('')

  const supervisionApplications = ref([])
  const isSupervisionLoading = ref(false)
  const supervisionLoadError = ref('')

  // ❗ 3. REMOVED REDUNDANT CPD STATE (it now lives in mhpcCpdStore)
  // const cpdRecords = ref([])
  // const isCpdLoading = ref(false)
  // const cpdLoadError = ref('')

  // ## GETTERS (COMPUTED) ##
  const expiryDate = computed(() => (formData.value.expiry_date ? dayjs(formData.value.expiry_date) : null))
  const hasExpired = computed(() => (expiryDate.value ? expiryDate.value.isBefore(dayjs(), 'day') : false))
  const isExpiringWithin3Months = computed(() => {
    if (!expiryDate.value || hasExpired.value) return false
    return expiryDate.value.isBetween(dayjs(), dayjs().add(3, 'month'), 'day', '[]')
  })

  const renewalType = computed(() => (hasExpired.value ? 're-registration' : 'renewal'))

  const pageHeaderTitle = computed(() => {
    return renewalType.value === 're-registration'
      ? 'Re-registration Application'
      : 'Renewal Application'
  })

  const pageHeaderSubtitle = computed(() => {
    const baseSubtitle =
      'Please review your personal details, CPD scores, and other requirements to ensure your eligibility for '
    return baseSubtitle + (renewalType.value === 're-registration' ? 're-registration.' : 'renewal.')
  })

  const hasUnresolvedComplaints = computed(() => {
    if (isComplaintsLoading.value || complaintsLoadError.value) return true
    if (!complaints.value || complaints.value.length === 0) return false
    const blockingStatuses = ['Submitted', 'Registered', 'Under Review', 'Investigation', 'Action Pending']
    return complaints.value.some(c => c.is_blocking_applications === true || blockingStatuses.includes(c.status))
  })

  const meetsSupervisionRequirements = computed(() => {
    if (!authStore.user?.is_counselor) return true
    if (isSupervisionLoading.value || supervisionLoadError.value || supervisionApplications.value.length === 0) return false
    return supervisionApplications.value.some(s => s.status === 'Approved')
  })

  const isEligibleForRenewal = computed(() => {
    if (isLoading.value || loadError.value || !formData.value.qualification_id_to_renew || !expiryDate.value?.isValid()) return false
    if (hasUnresolvedComplaints.value || (authStore.user?.is_counselor && !meetsSupervisionRequirements.value)) return false
    return isExpiringWithin3Months.value || hasExpired.value
  })

  const renewalEligibilityMessage = computed(() => {
    if (hasUnresolvedComplaints.value) return 'Renewal is blocked due to one or more unresolved complaints.'
    if (authStore.user?.is_counselor && !meetsSupervisionRequirements.value) return 'Renewal is blocked: Counselors require an approved supervision record.'
    if (!(isExpiringWithin3Months.value || hasExpired.value)) return 'Your qualification is not within the eligible renewal period (expiring in 3 months or expired).'
    if (!formData.value.qualification_id_to_renew) return 'No valid primary qualification found for renewal.'
    return 'Not eligible for renewal. Please review all requirements.'
  })

  const getNewExpiryDate = computed(() => {
    if (!expiryDate.value) return dayjs().add(5, 'year').toDate()
    const baseDate = hasExpired.value ? dayjs() : expiryDate.value
    return baseDate.add(5, 'year').toDate()
  })

  // --- CPD GETTERS (Now using mhpcCpdStore) ---

  // ❗ 4. UPDATED GETTERS to use the centralized CPD store's data
  const getTotalCpdPoints = computed(() => mhpcCpdStore.totalCpdCredits)

  const cpdStatus = computed(() => {
    // This logic remains the same, but now it's based on the new total points
    const points = getTotalCpdPoints.value
    if (points >= 30) return 'met'
    if (points > 0) return 'below_minimum'
    return 'none'
  })

  const cpdMessage = computed(() => {
    const points = getTotalCpdPoints.value
    switch (cpdStatus.value) {
      case 'met':
        return `Good job! You have ${points} CPD points, meeting or exceeding the recommended 30 points.`
      case 'below_minimum':
        return `Warning: Your CPD score is ${points} points. While you can still proceed with ${renewalType.value}, we encourage improving your score.`
      case 'none':
        return `Warning: You have 0 approved CPD points. You can still proceed with ${renewalType.value}, but acquiring points is highly recommended.`
      default:
        return 'Checking your CPD score status...'
    }
  })

  // These computed properties for UI styling are kept here for the renewal component's specific needs.
  const cpdIcon = computed(() => {
    switch (cpdStatus.value) {
      case 'met': return CheckCircle
      case 'below_minimum':
      case 'none': return AlertTriangle
      default: return Info
    }
  })

  const cpdCardClass = computed(() => cpdStatus.value === 'met' ? 'bg-green-100' : 'bg-yellow-100')
  const cpdIconClass = computed(() => cpdStatus.value === 'met' ? 'text-green-600' : 'text-yellow-600')
  const cpdProgressClass = computed(() => cpdStatus.value === 'met' ? 'bg-green-500' : 'bg-yellow-500')
  const cpdTextClass = computed(() => cpdStatus.value === 'met' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800')
  const cpdMessageBgClass = computed(() => cpdStatus.value === 'met' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800')
  const cpdMessageIconColor = computed(() => cpdStatus.value === 'met' ? 'text-green-500' : 'text-yellow-500')


  // ## ACTIONS ##
  // ❗ 5. REMOVED fetchCpdRecords action. It's now handled by mhpcCpdStore.

  async function fetchComplaints(userCid) {
    isComplaintsLoading.value = true
    complaintsLoadError.value = ''
    try {
      const response = await apiService.getComplaints({ respondent_cid: userCid })
      complaints.value = response.data?.results || response.data || []
    } catch (error) {
      console.error('Error fetching complaints:', error)
      complaintsLoadError.value = 'Failed to load complaints data.'
    } finally {
      isComplaintsLoading.value = false
    }
  }

  async function fetchSupervisionApplications(userCid) {
    isSupervisionLoading.value = true
    supervisionLoadError.value = ''
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
      supervisionApplications.value = [{ id: 'sup001', supervisor_name: 'Dr. Emily Carter', application_date: '2022-08-15', expiry_date: '2024-08-14', status: 'Approved' }]
    } catch (error) {
      console.error('Error fetching supervision applications:', error)
      supervisionLoadError.value = 'Failed to load supervision data.'
    } finally {
      isSupervisionLoading.value = false
    }
  }

  async function initialize() {
    isLoading.value = true
    loadError.value = ''
    try {
      await healthStore.initialize()
      if (healthStore.visibleMenus.hasRenewalInProgress) {
        isLoading.value = false;
        return;
      }

      const userCid = authStore.user?.cid
      if (!userCid) throw new Error('User not found. Please log in.')

      const response = await apiService.getMhpcFullApplicationListByCid(userCid)
      const applications = response.data?.results || response.data || []
      if (applications.length === 0) throw new Error('No existing application found.')

      applications.sort((a, b) => (dayjs(b.expiry_date).isAfter(dayjs(a.expiry_date)) ? 1 : -1))
      const latestApplication = applications.find(app => app.is_active) || applications[0]
      if (!latestApplication) throw new Error('Could not find a suitable application record.')

      const detailsResponse = await apiService.getMhpcNewApplication(latestApplication.id)
      const qualifications = detailsResponse.data?.user_qualifications || []
      const primaryQualification = qualifications.find(q => q.is_primary_qualification) || qualifications[0]
      if (!primaryQualification?.expiry_date) throw new Error('Could not find a valid primary qualification for renewal.')

      formData.value = {
        ...formData.value,
        ...latestApplication,
        expiry_date: primaryQualification.expiry_date,
        registration_date: primaryQualification.registration_date,
        is_active: primaryQualification.is_active,
        qualification_id_to_renew: primaryQualification.id,
      }

      // ❗ 6. MODIFIED to call the centralized mhpcCpdStore's fetch action
      const dataPromises = [
        mhpcCpdStore.fetchCpdRecords(), // Use the new store's action
        fetchComplaints(userCid)
      ]
      if (authStore.user?.is_counselor) {
        dataPromises.push(fetchSupervisionApplications(userCid))
      }
      await Promise.all(dataPromises)

    } catch (error) {
      console.error('Error initializing renewal page:', error)
      loadError.value = error.message || 'Failed to load renewal data.'
    } finally {
      isLoading.value = false
    }
  }

  async function submitRenewal(payload) {
    isSubmitting.value = true
    try {
      const renewalPayload = {
        user_qualification: formData.value.qualification_id_to_renew,
        proposed_expiry_date: dayjs(getNewExpiryDate.value).format('YYYY-MM-DD'),
        renewal_remarks: payload.remarks || '',
      }

      const response = await apiService.createMhpcRenewal(renewalPayload)
      if (response.data?.id) {
        toast.success(`${renewalType.value === 're-registration' ? 'Re-registration' : 'Renewal'} submitted successfully!`)
        await healthStore.initialize()
        router.push('/admin/user/health_certification/my_applications')
      } else {
        throw new Error('Invalid response from server.')
      }
    } catch (error) {
      let errorMessage = 'Failed to submit renewal application.'
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          if (error.response.data.error) {
            errorMessage = error.response.data.error
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail
          } else {
            const errors = Object.values(error.response.data).flat()
            if (errors.length > 0) {
              errorMessage = errors.join(' ')
            }
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your network connection.'
      } else {
        errorMessage = error.message
      }
      toast.error(errorMessage)
      console.error('Renewal Submission Error:', error.response || error)
    } finally {
      isSubmitting.value = false
    }
  }

  // ❗ 7. UPDATED the return object
  return {
    // State
    isLoading,
    isSubmitting,
    loadError,
    formData,
    complaints,
    isComplaintsLoading,
    complaintsLoadError,
    supervisionApplications,
    isSupervisionLoading,
    supervisionLoadError,
    // Getters
    hasExpired,
    isExpiringWithin3Months,
    renewalType,
    pageHeaderTitle,
    pageHeaderSubtitle,
    hasUnresolvedComplaints,
    meetsSupervisionRequirements,
    isEligibleForRenewal,
    renewalEligibilityMessage,
    getNewExpiryDate,
    getTotalCpdPoints,
    cpdStatus,
    cpdMessage,
    cpdIcon,
    cpdCardClass,
    cpdIconClass,
    cpdProgressClass,
    cpdTextClass,
    cpdMessageBgClass,
    cpdMessageIconColor,
    // Actions
    initialize,
    submitRenewal,
  }
})
