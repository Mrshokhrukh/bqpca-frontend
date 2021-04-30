<template>
  <div class="cpd-management">
    <!-- Navigation Tabs -->
    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Tab Content -->
    <div class="tab-content">
      <component :is="currentTabComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CreateApplication from './CpdCreateApplication.vue'
import ReviewApplication from './CpdApplicationReview.vue'
import ManageProviders from './CpdProviderManagement.vue'
import AwardCredits from './SelfCpdManagement.vue'
import Reports from './CpdReports.vue'

// Reactive state
const currentTab = ref('reviewApplication') // Default tab

// Tabs configuration
const tabs = [
  { id: 'createApplication', label: 'Create Application' },
  { id: 'reviewApplication', label: 'Review Application' },
  { id: 'manageProviders', label: 'Manage Providers' },
  { id: 'awardCredits', label: 'Award Credits' },
  { id: 'reports', label: 'Reports' },
]

// Dynamic component based on the current tab
const currentTabComponent = computed(() => {
  switch (currentTab.value) {
    case 'createApplication':
      return CreateApplication
    case 'reviewApplication':
      return ReviewApplication
    case 'manageProviders':
      return ManageProviders
    case 'awardCredits':
      return AwardCredits
    case 'reports':
      return Reports
    default:
      return ReviewApplication // Default to Review Application
  }
})
</script>

<style scoped>
.cpd-management {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:hover {
  background-color: #ddd;
}

.tab-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
