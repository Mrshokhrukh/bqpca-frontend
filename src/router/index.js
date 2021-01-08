// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import RoQPage from '@/views/services/RoQPage.vue'
import ECPFPage from '@/views/services/ECPFPage.vue'
import AccreditationPage from '@/views/services/AccreditationPage.vue'
import EngineeringPage from '@/views/services/EngineeringPage.vue'
import BMHCPage from '@/views/services/BMHCPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/roq',
      name: 'roq',
      component: RoQPage
    },
    {
      path: '/ecpf',
      name: 'ecpf',
      component: ECPFPage
    },
    {
      path: '/accreditation',
      name: 'accreditation',
      component: AccreditationPage
    },
    {
      path: '/engineering',
      name: 'engineering',
      component: EngineeringPage
    },
    {
      path: '/bmhc',
      name: 'bmhc',
      component: BMHCPage
    }
  ]
})

export default router
