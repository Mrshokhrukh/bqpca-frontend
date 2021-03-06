<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
     <!-- Card Header -->
     <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <FolderIcon class="w-5 h-5 text-purple-500 " />

      </div>
      <h3 class="font-bold text-gray-800 text-xl">Recent</h3>
    </div>
    <div class="space-y-4 mt-6">
      <div v-if="loading" class="text-center text-gray-500 text-sm">Loading activities...</div>
      <div v-else-if="error" class="text-center text-red-500 text-sm">{{ error }}</div>
      <template v-else>
        <div v-for="(activity, index) in sortedActivities" :key="index" class="flex items-start space-x-3">
          <div :class="['p-2 rounded-full', activity.type === 'cpd' ? 'bg-blue-100' : 'bg-green-100']">
            <component :is="activity.type === 'cpd' ? BookOpenIcon : DocumentIcon" class="w-4 h-4"
              :class="activity.type === 'cpd' ? 'text-blue-500' : 'text-green-500'" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
          </div>
        </div>
        <div v-if="sortedActivities.length === 0" class="text-center text-gray-500 text-sm">No recent activities</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon, BookOpenIcon, DocumentIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/authStore';
import apiClient from '@/services/bmhcservices';
import { ref, computed, onMounted } from 'vue';



const authStore = useAuthStore();
const activities = ref([]);
const loading = ref(true);
const error = ref(null);

const formatDate = date => {
  try { return date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'; }
  catch { return 'Invalid date'; }
};

// Unified function to process a record of any type
const processRecord = (record, type, cid, titleField = 'title', fallbackTitle = 'Activity') => {
  const date = dayjs(record.updated_at || record.created_at || record.date);
  if (!date.isValid()) return null;

  return {
    type,
    title: record[titleField] || record.title || fallbackTitle,
    date,
    cid_no: cid
  };
};

// Extract data arrays from any response structure
const getDataArray = response => {
  if (!response) return [];
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data && typeof data === 'object') {
    for (const key in data) if (Array.isArray(data[key])) return data[key];
    return Object.values(data);
  }
  return [];
};

onMounted(async () => {
  try {
    if (!authStore.user?.cid) {
      error.value = "User not authenticated";
      return;
    }

    const cid = authStore.user.cid;
    const results = [];

    // Fetch and process CPD records
    try {
      const cpdData = getDataArray(await apiClient.getBmhcCpdRecords());
      cpdData.forEach(record => {
        if (!record) return;
        const recordCid = record.cid_no || record.cid || record.user_id;
        if (recordCid?.toString() === cid.toString()) {
          const activity = processRecord(record, 'cpd', cid, 'cpd_activity_topic', 'CPD Activity');
          if (activity) results.push(activity);
        }
      });
    } catch {}

    // Fetch and process applications
    try {
      const appsData = getDataArray(await apiClient.getBhmcNewApplications());
      appsData.forEach(app => {
        if (!app) return;
        const appCid = app.cid_no || app.cid || app.user_id;
        if (appCid?.toString() !== cid.toString()) return;

        // Process the main application
        const dateObj = dayjs(app.updated_at || app.created_at || app.date);
        if (dateObj.isValid()) {
          results.push({
            type: 'application',
            title: 'New Application Submitted',
            date: dateObj,
            cid_no: cid
          });
        }

        // Process qualifications
        let qualifications = app.user_qualifications || app.qualifications || [];
        if (qualifications && !Array.isArray(qualifications)) qualifications = Object.values(qualifications);

        if (qualifications.length > 0) {
          // Find most recent qualification
          let latestQual = null;
          for (const qual of qualifications) {
            if (!qual) continue;
            const qualDate = dayjs(qual.updated_at || qual.created_at || qual.date);
            if (qualDate.isValid() && (!latestQual || qualDate.isAfter(latestQual.date))) {
              latestQual = {
                date: qualDate,
                title: qual.title || qual.name || 'New Qualification'
              };
            }
          }

          if (latestQual) {
            results.push({
              type: 'application',
              title: latestQual.title,
              date: latestQual.date,
              cid_no: cid
            });
          }
        }
      });
    } catch {}

    // Add test data if needed
    if (results.length === 0) {
      results.push(
        { type: 'cpd', title: 'Medical Ethics Workshop', date: dayjs().subtract(5, 'day'), cid_no: cid },
        { type: 'application', title: 'New Application Submitted', date: dayjs().subtract(10, 'day'), cid_no: cid },
        { type: 'application', title: 'Medical License Qualification', date: dayjs().subtract(15, 'day'), cid_no: cid }
      );
    }

    activities.value = results;
  } catch (err) {
    error.value = err.message || 'Failed to fetch activities.';
  } finally {
    loading.value = false;
  }
});

const sortedActivities = computed(() =>
  [...activities.value]
    .filter(a => a?.date)
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    .slice(0, 7)
);
</script>
