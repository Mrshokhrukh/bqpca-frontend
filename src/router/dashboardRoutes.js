// dashboardRoutes.js
const dashboardRoutes = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/AdminDashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      // Super Admin Routes
      {
        path: 'super-admin',
        props: { userRole: 'superAdmin' },
        children: [
          // child routes
        ],
      },
      // RoQ Module Routes
      {
        path: 'roq',
        props: { userRole: 'admin', userModule: 'RoQ' },
        children: [
          {
            path: '',
            name: 'roq-dashboard',
            component: () => import('@/views/admin/ROQ/Dashboard.vue'),
          },

        ],
      },
      // ECPF Module Routes
      {
        path: 'ecpf',
        props: { userRole: 'admin', userModule: 'ECPF' },
        children: [
          {
            path: '',
            name: 'roq-dashboard',
            component: () => import('@/views/admin/ECPF/Dashboard.vue'),
          },
        ],
      },
      // Accreditation Module Routes
      {
        path: 'accreditation',
        props: { userRole: 'admin', userModule: 'Accreditation' },
        children: [
          // child routes
        ],
      },
      // Engineering Module Routes
      {
        path: 'engineering',
        props: { userRole: 'admin', userModule: 'Engineering' },
        children: [
          // child routes
        ],
      },
      // BMHC Module Routes
      {
        path: 'bmhc',
        props: { userRole: 'admin', userModule: 'BMHC' },
        children: [
          // child routes
        ],
      },
    ],
  },
];

export default dashboardRoutes;
