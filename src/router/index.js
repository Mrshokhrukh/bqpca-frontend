import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from './publicRoutes';
import dashboardRoutes from './dashboardRoutes';
import { useAuthStore } from '@/stores/authStore'; // Import the authStore

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...dashboardRoutes,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/unauthorized');
  } else {
    next();
  }
});

export default router;
