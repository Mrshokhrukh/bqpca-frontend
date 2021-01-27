<template>
  <div class="dashboard">
    <h1>Dealing Officer Dashboard</h1>

    <!-- Stat Cards -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-icon">📄</div>
        <div class="stat-content">
          <h3>Pending Applications</h3>
          <p>{{ pendingApplicationsCount }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <h3>Upcoming Renewals</h3>
          <p>{{ upcomingRenewalsCount }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>CPD Compliance</h3>
          <p>{{ cpdCompliancePercentage }}%</p>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <h2>Quick Links</h2>
      <div class="links">
        <router-link to="/health_certification/applications" class="link">
          <div class="link-icon">📋</div>
          <span>Applications</span>
        </router-link>
        <router-link to="/health_certification/cpd" class="link">
          <div class="link-icon">📚</div>
          <span>CPD Management</span>
        </router-link>
        <router-link to="/health_certification/reports" class="link">
          <div class="link-icon">📈</div>
          <span>Reports</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <h2>Recent Activity</h2>
      <ul>
        <li v-for="activity in recentActivities" :key="activity.id">
          <span class="activity-icon">🔔</span>
          <span class="activity-text">{{ activity.text }}</span>
          <span class="activity-time">{{ activity.time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state for stat cards
const pendingApplicationsCount = ref(10)
const upcomingRenewalsCount = ref(5)
const cpdCompliancePercentage = ref(85)

// Reactive state for recent activities
const recentActivities = ref([
  { id: 1, text: 'New registration application received', time: '2 hours ago' },
  { id: 2, text: 'CPD activity approved', time: '5 hours ago' },
  { id: 3, text: 'Institute renewal application submitted', time: '1 day ago' },
])
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

/* Stat Cards */
.stat-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 24px;
  margin-right: 15px;
}

.stat-content h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.stat-content p {
  margin: 5px 0 0;
  font-size: 24px;
  font-weight: bold;
  color: #555;
}

/* Quick Links */
.quick-links {
  margin-bottom: 30px;
}

.quick-links h2 {
  margin-bottom: 15px;
  font-size: 20px;
  color: #333;
}

.links {
  display: flex;
  gap: 20px;
}

.link {
  flex: 1;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.link:hover {
  background: #e0e0e0;
}

.link-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.link span {
  font-size: 16px;
}

/* Recent Activity */
.recent-activity h2 {
  margin-bottom: 15px;
  font-size: 20px;
  color: #333;
}

.recent-activity ul {
  list-style: none;
  padding: 0;
}

.recent-activity li {
  background: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-icon {
  font-size: 18px;
  margin-right: 15px;
}

.activity-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.activity-time {
  font-size: 14px;
  color: #777;
}
</style>