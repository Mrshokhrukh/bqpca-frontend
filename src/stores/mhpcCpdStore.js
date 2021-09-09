import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/services'
import { useAuthStore } from './authStore'

export const useMhpcCpdStore = defineStore('mhpcCpd', () => {
  const selfCpdRecords = ref([])
  const participantRecords = ref([])

  const isLoading = ref(false)
  const error = ref(null)

  async function fetchCpdRecords() {
    if (isLoading.value) return

    const authStore = useAuthStore()
    if (!authStore.user?.cid) {
      console.warn('No user or CID found, cannot fetch MHPC CPD records.')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const [selfResponse, participantResponse] = await Promise.all([
        apiService.getMhpcCpdRecordsByCid(authStore.user.cid),
        apiService.getMhpcCpdTaskParticipantsByCid(authStore.user.cid)
      ])

      selfCpdRecords.value = selfResponse.data?.results || selfResponse.data || []
      // ❗ CORRECTED TYPO HERE
      participantRecords.value = participantResponse.data?.results || participantResponse.data || []

    } catch (e) {
      console.error('Failed to fetch one or more MHPC CPD record types:', e)
      error.value = 'Could not load all MHPC CPD data.'
    } finally {
      isLoading.value = false
    }
  }

  const allCpdRecords = computed(() => {
    // --- SELF RECORDS (from 'list my cpd') ---
    const processedSelfRecords = (selfCpdRecords.value || []).map((record) => ({
      id: `self-${record.id}`,
      title: record.title_of_cpd,
      status: (record.review_status || 'Pending').toUpperCase(),
      credits: record.cpd_credit || 0,
      date: record.created_at,
      type: 'SELF',
      attachmentUrl: record.attachment,
      remarks: record.remark,
      fullName: record.full_name,
      cidNo: record.cid_no,
      gender: record.gender,
      registrationNo: record.registration_no,
      activityTypeName: record.type_of_cpd_activity_display,
      relevance: record.relevance_to_profession
    }))

    // --- PARTICIPANT RECORDS (from 'participant api') ---
    const processedParticipantRecords = (participantRecords.value || []).map((p) => ({
      id: `participant-${p.id}`,
      title: p.cpd_task?.title_of_cpd || 'Event/Task CPD',
      status: (p.cpd_task?.application_status || 'Pending').toUpperCase(),
      credits: p.cpd_credits_for_participant_value || 0,
      date: p.cpd_task?.from_date || p.cpd_task?.created_at,
      type: 'EVENT',
      attachmentUrl: p.cpd_task?.course_document,
      remarks: p.cpd_task?.status_remarks,
      fullName: p.participant_name,
      cidNo: 'N/A',
      gender: 'N/A',
      registrationNo: p.participant_reg_no,
      activityTypeName: p.cpd_task?.type_of_cpd?.cpd_activity_name || 'Event Participation',
      relevance: p.cpd_task?.relevance_to_topic || 'N/A'
    }))

    return [...processedSelfRecords, ...processedParticipantRecords].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
  })

  const totalCpdCredits = computed(() => {
    return allCpdRecords.value
      .filter((record) => record.status === 'APPROVED')
      .reduce((sum, record) => sum + (record.credits || 0), 0)
  })

  const statusCounts = computed(() => {
    return allCpdRecords.value.reduce((counts, record) => {
      const status = record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  });

  return {
    allCpdRecords,
    isLoading,
    error,
    fetchCpdRecords,
    totalCpdCredits,
    statusCounts,
  }
})
