const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/LandingPage.vue'),
    meta: {
      title: 'Home',
      description:
        'Welcome to Bhutan Qualification & Professional Certification Authority - Your gateway to professional certification and accreditation in Bhutan',
      keywords: 'BQPCA, home, certification, Bhutan, qualification',
    },
  },
  {
    path: '/admin/login',
    component: () => import('@/views/admin/BQPCAAdminLogin.vue'),
    meta: {
      title: 'Admin Login',
      description: 'BQPCA System administrator login portal',
      keywords: 'admin login, BQPCA admin, administrator',
    },
  },
  {
    path: '/super-admin/login',
    component: () => import('@/views/admin/SuperAdminLogin.vue'),
    meta: {
      title: 'Super Admin Login',
      description: 'BQPCA System super administrator login portal',
      keywords: 'super admin login, BQPCA super admin',
    },
  },
  {
    path: '/roq',
    name: 'roq',
    component: () => import('@/views/services/RoQPage.vue'),
    meta: {
      title: 'Registry of Qualifications',
      description: 'Explore the Registry of Qualifications (RoQ) service provided by BQPCA',
      keywords: 'RoQ, qualifications registry, Bhutan qualifications',
    },
  },
  {
    path: '/ecpf',
    name: 'ecpf',
    component: () => import('@/views/services/ECPFPage.vue'),
    meta: {
      title: 'ECPF Service',
      description: 'Engineering, Construction and Production Firms certification services',
      keywords: 'ECPF, engineering firms, construction firms, production firms',
    },
  },
  {
    path: '/accreditation',
    name: 'accreditation',
    component: () => import('@/views/services/AccreditationPage.vue'),
    meta: {
      title: 'Accreditation Services',
      description: 'Professional accreditation services provided by BQPCA',
      keywords: 'accreditation, professional certification, BQPCA accreditation',
    },
  },
  {
    path: '/engineering',
    name: 'engineering',
    component: () => import('@/views/services/EngineeringPage.vue'),
    meta: {
      title: 'Engineering Services',
      description: 'Engineering certification and qualification services',
      keywords: 'engineering certification, engineering qualifications, BQPCA engineering',
    },
  },
  {
    path: '/mhpc',
    name: 'mhpc',
    component: () => import('@/views/services/MHPCPage.vue'),
    meta: {
      title: 'MHPC Services',
      description: 'Bhutan Medical and Health Council certification services',
      keywords: 'MHPC, medical certification, health council, healthcare professionals',
    },
  },
  {
    path: '/certification-validity',
    name: 'CertificationValidityPage',
    component: () => import('@/views/CertificationValidityPage.vue'),
    meta: {
      title: 'Certification Validity Check',
      description: 'Check the validity of professional certifications issued by BQPCA',
      keywords: 'certification validity, verify certification, BQPCA verification',
    },
  },
  {
    path: '/certification-validity/search', // The route for the search with parameters
    name: 'CertificationValiditySearchPage',
    component: () => import('@/views/CertificationValidityPage.vue'), // Use the SAME component
    meta: {
      title: 'Certification Validity Check - Search',
      description: 'Search results for certification validity check',
      keywords: 'certification validity search, BQPCA search results',
    },
    props: (route) => ({
      service_type: route.query.service_type,
      cert_number: route.query.cert_number,
    }),
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/Unauthorized.vue'),
    meta: {
      title: 'Unauthorized Access',
      description: 'Unauthorized access - Please login with appropriate credentials',
      keywords: 'unauthorized, access denied, login required',
    },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
      keywords: '404, not found, error page',
    },
    props: (route) => ({ attempted: route.query.attempted }),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      return {
        path: '/404',
        query: { attempted: to.fullPath }
      }
    },
  },
]

export default publicRoutes
