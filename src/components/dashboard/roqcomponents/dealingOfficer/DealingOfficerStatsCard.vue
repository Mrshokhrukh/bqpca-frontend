<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Pending -->
    <div
      class="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow duration-300"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Pending</p>
          <p class="mt-2 text-3xl font-bold text-yellow-600">{{ pending }}</p>
          <p class="mt-2 text-sm text-slate-600">Total submissions</p>
        </div>
        <div class="bg-blue-100 p-3 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Under Review-->
    <div
      class="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow duration-300"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Under Review</p>
          <p class="mt-2 text-3xl font-bold text-blue-600">{{ underReview }}</p>
          <div class="mt-2 flex items-center text-sm text-blue-600">
            <span>Successfully processed</span>
          </div>
        </div>
        <div class="bg-green-100 p-3 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- QEC Issued-->
    <div
      class="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow duration-300"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">QEC Issued</p>
          <p class="mt-2 text-3xl font-bold text-green-600">{{ qecIssued }}</p>
          <div class="mt-2 flex items-center text-sm text-green-600">
            <span>Awaiting review</span>
          </div>
        </div>
        <div class="bg-yellow-100 p-3 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Suspend-->
    <div
      class="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow duration-300"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Suspend</p>
          <p class="mt-2 text-3xl font-bold text-red-600">{{ suspend }}</p>
          <div class="mt-2 flex items-center text-sm text-red-600">
            <span>Not approved</span>
          </div>
        </div>
        <div class="bg-red-100 p-3 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
    <!-- Regretted-->
    <div
      class="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow duration-300"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-600">Regretted</p>
          <p class="mt-2 text-3xl font-bold text-gray-800">{{ regretted }}</p>
          <div class="mt-2 flex items-center text-sm text-g-600">
            <span>Not approved</span>
          </div>
        </div>
        <div class="bg-red-100 p-3 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
name: 'DealingOffcierStatsCard',
  defineProps({
    pending: {
      type: Number,
      required: true,
    },
    underReview: {
      type: Number,
      required: true,
    },
    qecIssued: {
      type: Number,
      required: true,
    },
    regretted: {
      type: Number,
      required: true,
    },
    suspend: {
      type: Number,
      required: true,
    },
  })
</script>
