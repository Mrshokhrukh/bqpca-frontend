// src/services/services.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Consolidated interceptors (removed duplicates)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle FormData content type automatically
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await authStore.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default {
  // User authentication
  register(userData) {
    return apiClient.post('/users/register/', userData);
  },
  login(credentials) {
    return apiClient.post('/users/login/', credentials);
  },

  // Decision CRUD operations
  getDecisions() {
    return apiClient.get('/masters/roq-decisions/')
  },
  getDecision(id) {
    return apiClient.get(`/masters/roq-decisions/${id}/`)
  },
  createDecision(decisionData) {
    return apiClient.post('/masters/roq-decisions/', decisionData)
  },
  updateDecision(id, decisionData) {
    return apiClient.put(`/masters/roq-decisions/${id}/`, decisionData)
  },
  patchDecision(id, decisionData) {
    return apiClient.patch(`/masters/roq-decisions/${id}/`, decisionData)
  },
  deleteDecision(id) {
    return apiClient.delete(`/masters/roq-decisions/${id}/`)
  },

  // Learning Types CRUD operations
  getLearningTypes() {
    return apiClient.get('/masters/roq-learning-types/')
  },
  getLearningType(id) {
    return apiClient.get(`/masters/roq-learning-types/${id}/`)
  },
  createLearningType(learningTypeData) {
    return apiClient.post('/masters/roq-learning-types/', learningTypeData)
  },
  updateLearningType(id, learningTypeData) {
    return apiClient.put(`/masters/roq-learning-types/${id}/`, learningTypeData)
  },
  deleteLearningType(id) {
    return apiClient.delete(`/masters/roq-learning-types/${id}/`)
  },

  // Qualifications CRUD operations
  getQualifications() {
    return apiClient.get('/masters/roq-qualifications/')
  },
  getQualification(id) {
    return apiClient.get(`/masters/roq-qualifications/${id}/`)
  },
  createQualification(qualificationData) {
    return apiClient.post('/masters/roq-qualifications/', qualificationData)
  },
  updateQualification(id, qualificationData) {
    return apiClient.put(`/masters/roq-qualifications/${id}/`, qualificationData)
  },
  deleteQualification(id) {
    return apiClient.delete(`/masters/roq-qualifications/${id}/`)
  },

  // Reasons for Issue of Second Copy CRUD operations
  getReasonsForIssueOfSecondCopy() {
    return apiClient.get('/masters/roq-reasons-for-issue-of-second-copy/')
  },
  getReasonForIssueOfSecondCopy(id) {
    return apiClient.get(`/masters/roq-reasons-for-issue-of-second-copy/${id}/`)
  },
  createReasonForIssueOfSecondCopy(reasonData) {
    return apiClient.post('/masters/roq-reasons-for-issue-of-second-copy/', reasonData)
  },
  updateReasonForIssueOfSecondCopy(id, reasonData) {
    return apiClient.put(`/masters/roq-reasons-for-issue-of-second-copy/${id}/`, reasonData)
  },
  deleteReasonForIssueOfSecondCopy(id) {
    return apiClient.delete(`/masters/roq-reasons-for-issue-of-second-copy/${id}/`)
  },

  // Types of Course CRUD operations
  getTypesOfCourse() {
    return apiClient.get('/masters/roq-types-of-course/')
  },
  getTypeOfCourse(id) {
    return apiClient.get(`/masters/roq-types-of-course/${id}/`)
  },
  createTypeOfCourse(courseTypeData) {
    return apiClient.post('/masters/roq-types-of-course/', courseTypeData)
  },
  updateTypeOfCourse(id, courseTypeData) {
    return apiClient.put(`/masters/roq-types-of-course/${id}/`, courseTypeData)
  },
  deleteTypeOfCourse(id) {
    return apiClient.delete(`/masters/roq-types-of-course/${id}/`)
  },

  // Fetch user details by user_id
  getUserDetails(userId) {
    return apiClient.get(`/users/users/${userId}/`);
  },

  // Recognition of Qualifications endpoints (enhanced for file uploads)
  getRecognitionOfQualifications(params) {
    return apiClient.get('/recognitions/recognition-of-qualifications/', { params });
  },
  getRecognitionOfQualification(id) {
    return apiClient.get(`/recognitions/recognition-of-qualifications/${id}/`);
  },
  createRecognitionOfQualification(formData) {
    return apiClient.post('/recognitions/recognition-of-qualifications/', formData);
  },
  updateRecognitionOfQualification(id, formData) {
    return apiClient.put(`/recognitions/recognition-of-qualifications/${id}/`, formData);
  },
  patchRecognitionOfQualification(id, updates) {
    return apiClient.patch(`/recognitions/recognition-of-qualifications/${id}/`, updates);
  },
  deleteRecognitionOfQualification(id) {
    return apiClient.delete(`/recognitions/recognition-of-qualifications/${id}/`);
  },

  fetchCitizenDetails(cid) {
    return apiClient.get(`/users/fetch-citizen-details/${cid}/`);
  },

  // File upload helper
  uploadFile(url, formData) {
    return apiClient.post(url, formData);
  }
};
