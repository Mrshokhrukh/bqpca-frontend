import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from './publicRoutes';
import dashboardRoutes from './dashboardRoutes';

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

// Navigation guard for authentication (Simplified for demonstration)
router.beforeEach((to, from, next) => {
    // Simulate an authentication check
    const isAuthenticated = true;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/admin/login');
    } else {
        next();
    }
});

export default router;
