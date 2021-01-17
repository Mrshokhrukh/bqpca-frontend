// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import publicRoutes from './publicRoutes';
import dashboardRoutes from './dashboardRoutes';
import { useAuthStore } from '@/stores/authStore';

// Meta management function
function updateMetaTags(meta) {
  // Update title
  document.title = meta.title ? `${meta.title} | BQPCA System` : 'BQPCA System';

  // Update meta tags
  const metaTags = {
    description: meta.description || 'Bhutan Qualification & Professional Certification Authority - Official certification and accreditation management system',
    keywords: meta.keywords || 'BQPCA, certification, qualification, Bhutan, professional certification',
    'og:title': meta.title ? `${meta.title} | BQPCA System` : 'BQPCA System',
    'og:description': meta.description || 'Bhutan Qualification & Professional Certification Authority - Official certification and accreditation management system',
    'twitter:title': meta.title ? `${meta.title} | BQPCA System` : 'BQPCA System',
    'twitter:description': meta.description || 'Bhutan Qualification & Professional Certification Authority - Official certification and accreditation management system'
  };

  // Update each meta tag
  Object.keys(metaTags).forEach(key => {
    const elementId = `meta-${key}`;
    let element = document.getElementById(elementId);

    if (!element) {
      element = document.createElement('meta');
      element.id = elementId;

      if (key.startsWith('og:')) {
        element.setAttribute('property', key);
      } else if (key.startsWith('twitter:')) {
        element.setAttribute('name', key);
      } else {
        element.setAttribute('name', key);
      }

      document.head.appendChild(element);
    }

    element.setAttribute('content', metaTags[key]);
  });
}

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

// Combined navigation guard for authentication and meta updates
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Handle authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/unauthorized');
    return;
  }

  // Update meta tags
  if (to.meta) {
    updateMetaTags(to.meta);
  }

  next();
});

export default router;
