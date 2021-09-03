import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApplicationStore = defineStore('application', () => {
  // State to hold the application data we want to edit
  const currentDraft = ref(null)

  // Action to set the draft data before navigating
  function setDraftForEditing(draftData) {
    currentDraft.value = draftData
  }

  // Action to clear the draft data after we've used it
  function clearDraft() {
    currentDraft.value = null
  }

  return {
    currentDraft,
    setDraftForEditing,
    clearDraft,
  }
})