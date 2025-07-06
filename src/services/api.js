import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const projectsAPI = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    try {
      const response = await api.get(`/projects/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch projects by status: ${error.response?.data?.detail || error.message}`);
    }
  },
};

export default api;
