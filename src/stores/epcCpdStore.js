// stores/epcCpdStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/services'
import { useAuthStore } from './authStore'

export const useEpcCpdStore = defineStore('epcCpd', () => {
  // Raw data from API
  const selfCpdRecords = ref([])
  const participantRecords = ref([])
  const cpdTasks = ref([])

  const isLoading = ref(false)
  const error = ref(null)

  async function fetchCpdRecords() {
    if (isLoading.value) return

    const authStore = useAuthStore()
    if (!authStore.user?.cid) {
      console.warn('No user or CID found, cannot fetch CPD records.')
      return
    }
    if (!authStore.userRegistrationNo) {
      await authStore.fetchAndSetRegistrationNo()
    }

    isLoading.value = true
    error.value = null

    try {
      const [selfResponse, participantResponse, tasksResponse] = await Promise.all([
        apiService.getEpcCpdRecordsByCid(authStore.user.cid),
        apiService.getEpcCpdTaskParticipantsByCid(authStore.user.cid), // Use the new filtered endpoint
        apiService.getEpcCpdTasks(),
      ])

      selfCpdRecords.value = selfResponse.data?.results || selfResponse.data || []
      participantRecords.value = participantResponse.data?.results || participantResponse.data || []
      cpdTasks.value = tasksResponse.data?.results || []
    } catch (e) {
      console.error('Failed to fetch one or more CPD record types:', e)
      error.value = 'Could not load all CPD data.'
    } finally {
      isLoading.value = false
    }
  }

  const allCpdRecords = computed(() => {
    const authStore = useAuthStore()

    // Process self-applied CPDs
    const processedSelfRecords = (selfCpdRecords.value || [])
      .map(record => ({
        id: `self-${record.id}`,
        title: record.title_of_cpd,
        status: record.review_status || 'Pending',
        credits: record.cpd_credit || 0,
        date: record.created_at,
        type: 'SELF',
        attachmentUrl: record.attachment,
        remarks: record.remark,
        details: {
          relevance: record.relevance_to_profession,
          activityType: record.type_of_cpd_activity_display,
          registrationNo: record.registration_no_details?.registration_no,
        }
      }));

    // Process participant CPDs
    const userRegNo = authStore.userRegistrationNo?.trim()
    const processedParticipantRecords = (participantRecords.value || [])
      .filter(p => p.participant_reg_no?.trim() === userRegNo)
      .map(participant => {
        const task = cpdTasks.value.find(t => t.id === participant.cpd_task_id)
        return {
          id: `participant-${participant.id}`,
          title: task?.title_of_cpd || 'Event/Task CPD',
          status: participant.review_status || 'Pending',
          credits: participant.cpd_credits || 0,
          date: task?.created_at || participant.created_at,
          type: 'EVENT',
          attachmentUrl: task?.course_document,
          remarks: participant.review_remarks,
          details: {
            venue: task?.venue,
            fromDate: task?.from_date,
            toDate: task?.to_date,
            registrationNo: participant.participant_reg_no,
          }
        }
      });

    return [...processedSelfRecords, ...processedParticipantRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  const totalCpdCredits = computed(() => {
    return allCpdRecords.value
      .filter(record => record.status === 'Approved')
      .reduce((sum, record) => sum + (record.credits || 0), 0)
  })

  // Exposing cpdRecords for backward compatibility with StatCards if needed, but encouraging use of allCpdRecords
  const cpdRecords = allCpdRecords;

  return {
    // State
    cpdRecords, // Keep for compatibility, it's now an alias for allCpdRecords
    allCpdRecords,
    isLoading,
    error,
    // Actions
    fetchCpdRecords,
    // Getters
    totalCpdCredits,
  }
})