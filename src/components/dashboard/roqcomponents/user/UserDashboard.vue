<template>
  <div>
    <StatsGrid :stats="userStats" />
    <div class="mt-8 space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Applications</h2>
        <ApplicationTable :applications="recentApplications" :current-page="currentPage"
          :total-results="totalApplications" :per-page="perPage" @page-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import StatsGrid from '@/components/dashboard/roqcomponents/user/StatsGrid.vue';
import ApplicationTable from '@/components/dashboard/roqcomponents/user/ApplicationsTable.vue';
import apiService from '@/services/services';

const { user } = useAuthStore();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(5);

const recentApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return applications.value.slice(start, end).map(app => ({
    id: app.id,
    date: app.date_of_birth,
    type: app.type_of_course,
    status: getApplicationStatus(app),
  }));
});

const totalApplications = computed(() => applications.value.length);

const userStats = computed(() => ({
  totalApplied: applications.value.length,
  totalApproved: applications.value.filter(app => app.chief_approved).length,
  totalRegretted: applications.value.filter(app =>
    app.dealing_officer_regret || app.chief_regret
  ).length,
  totalPending: applications.value.filter(app =>
    !app.chief_approved &&
    !app.dealing_officer_regret &&
    !app.chief_regret
  ).length
}));

const getApplicationStatus = (application) => {
  if (application.chief_approved) return 'Approved';
  if (application.chief_regret) return 'Regretted';
  if (application.dealing_officer_regret) return 'Regretted';
  return 'Pending';
};

const loadUserApplications = async () => {
  try {
    const response = await apiService.getRecognitions({
      email_address: user.email
    });
    applications.value = response.data.results;
  } catch (error) {
    console.error('Error loading applications:', error);
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

onMounted(() => {
  loadUserApplications();
});
</script>
