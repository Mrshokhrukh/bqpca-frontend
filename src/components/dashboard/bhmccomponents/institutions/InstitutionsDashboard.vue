<template>
    <div class="space-y-6">
      <!-- Provider Profile Banner -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="bg-purple-100 p-4 rounded-full">
              <Building2 class="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ providerDetail.name }}</h2>
              <p class="text-gray-600">Provider ID: {{ providerDetail.id }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus class="w-4 h-4" />
              <span>New Program</span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Key Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="(stat, index) in keyStats" :key="index" 
             class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div class="flex items-center space-x-3">
            <div :class="[
              'p-2 rounded-full',
              stat.bgColor
            ]">
              <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
            </div>
            <div>
              <p class="text-gray-600 text-sm">{{ stat.label }}</p>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
          <div class="mt-2">
            <span :class="[
              'text-sm',
              stat.trend > 0 ? 'text-green-600' : 'text-red-600'
            ]">
              {{ stat.trend > 0 ? '+' : ''}}{{ stat.trend }}% from last month
            </span>
          </div>
        </div>
      </div>
  
      <!-- Active Programs and Analytics -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Active Programs -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-semibold text-lg">Active Programs</h3>
            <button class="text-purple-600 text-sm hover:text-purple-700">View All</button>
          </div>
          <div class="space-y-4">
            <div v-for="program in activePrograms" :key="program.id" 
                 class="border-b last:border-0 pb-4 last:pb-0">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ program.title }}</h4>
                  <p class="text-sm text-gray-500">{{ program.date }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="flex items-center text-sm text-gray-600">
                      <Users class="w-4 h-4 mr-1" />
                      {{ program.participants }} enrolled
                    </span>
                    <span class="flex items-center text-sm text-gray-600">
                      <Award class="w-4 h-4 mr-1" />
                      {{ program.credits }} CPD credits
                    </span>
                  </div>
                </div>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs',
                  program.status === 'In Progress' ? 'bg-green-100 text-green-800' : 
                  program.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                ]">
                  {{ program.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Monthly Analytics -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-semibold text-lg mb-6">Monthly Analytics</h3>
          <div class="space-y-4">
            <div v-for="metric in monthlyMetrics" :key="metric.label" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ metric.label }}</span>
                <span class="font-medium">{{ metric.value }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2">
                <div class="h-2 rounded-full"
                     :class="metric.color"
                     :style="{ width: `${metric.percentage}%` }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Recent Activities and Upcoming Schedule -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Activities -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-semibold text-lg mb-4">Recent Activities</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" 
                 class="flex items-start space-x-3">
              <div :class="[
                'p-2 rounded-full',
                activity.type === 'approval' ? 'bg-green-100' : 
                activity.type === 'submission' ? 'bg-blue-100' : 
                'bg-purple-100'
              ]">
                <component 
                  :is="activity.icon" 
                  class="w-4 h-4"
                  :class="activity.type === 'approval' ? 'text-green-500' : 
                         activity.type === 'submission' ? 'text-blue-500' : 
                         'text-purple-500'"
                />
              </div>
              <div>
                <p class="text-sm font-medium">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Upcoming Schedule -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-semibold text-lg mb-4">Upcoming Schedule</h3>
          <div class="space-y-4">
            <div v-for="event in upcomingSchedule" :key="event.id" 
                 class="flex items-start space-x-3">
              <div class="bg-gray-100 p-2 rounded text-center min-w-[3rem]">
                <span class="text-sm font-bold block">{{ event.day }}</span>
                <span class="text-xs text-gray-600">{{ event.month }}</span>
              </div>
              <div>
                <h4 class="font-medium">{{ event.title }}</h4>
                <p class="text-sm text-gray-600">{{ event.time }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                    {{ event.duration }}
                  </span>
                  <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                    {{ event.participants }} registered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { 
    Building2, 
    Users, 
    Award,
    Calendar,
    TrendingUp,
    UserCheck,
    Plus,
    CheckCircle,
    FileText,
  } from 'lucide-vue-next';
  
  const providerDetail = {
    id: "CPD001",
    name: "Medical Training Institute",
    status: "Accredited"
  };
  
  const keyStats = [
    {
      label: "Total Programs",
      value: "24",
      trend: 15,
      icon: Calendar,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      label: "Active Participants",
      value: "847",
      trend: 8,
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    },
    {
      label: "Credits Awarded",
      value: "2,456",
      trend: 12,
      icon: Award,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500'
    },
    {
      label: "Success Rate",
      value: "94%",
      trend: 5,
      icon: TrendingUp,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500'
    }
  ];
  
  const activePrograms = [
    {
      id: 1,
      title: "Advanced Medical Ethics Workshop",
      date: "Feb 15 - Mar 15, 2024",
      participants: 45,
      credits: 15,
      status: "In Progress"
    },
    {
      id: 2,
      title: "Clinical Leadership Seminar",
      date: "Mar 20 - Apr 20, 2024",
      participants: 32,
      credits: 20,
      status: "Upcoming"
    },
    {
      id: 3,
      title: "Patient Safety Guidelines 2024",
      date: "Feb 1 - Feb 28, 2024",
      participants: 58,
      credits: 10,
      status: "Pending Review"
    }
  ];
  
  const monthlyMetrics = [
    {
      label: "Program Completion Rate",
      value: "92%",
      percentage: 92,
      color: "bg-green-500"
    },
    {
      label: "Participant Satisfaction",
      value: "88%",
      percentage: 88,
      color: "bg-blue-500"
    },
    {
      label: "Assessment Pass Rate",
      value: "95%",
      percentage: 95,
      color: "bg-purple-500"
    }
  ];
  
  const recentActivities = [
    {
      id: 1,
      type: "approval",
      icon: CheckCircle,
      title: "New program approved: Emergency Medicine Update",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "submission",
      icon: FileText,
      title: "Submitted completion certificates for Medical Ethics Workshop",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "enrollment",
      icon: UserCheck,
      title: "15 new participants enrolled in Clinical Leadership",
      time: "1 day ago"
    }
  ];
  
  const upcomingSchedule = [
    {
      id: 1,
      day: "15",
      month: "FEB",
      title: "Medical Ethics Workshop - Day 1",
      time: "9:00 AM - 4:00 PM",
      duration: "7 hours",
      participants: 45
    },
    {
      id: 2,
      day: "20",
      month: "FEB",
      title: "Clinical Assessment Training",
      time: "10:00 AM - 2:00 PM",
      duration: "4 hours",
      participants: 32
    },
    {
      id: 3,
      day: "25",
      month: "FEB",
      title: "Healthcare Leadership Seminar",
      time: "1:00 PM - 5:00 PM",
      duration: "4 hours",
      participants: 28
    }
  ];
  </script>