import axios from 'axios';
import mockData from '../data/mockData.json';

const API_BASE_URL = 'http://localhost:8000/api';
const USE_MOCK_DATA = true; // Set to false when backend is ready

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

// Mock API functions
const mockAPI = {
  getAllProjects: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData.projects;
  },

  getProjectById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const project = mockData.projects.find(p => p.id === parseInt(id));
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  },

  createProject: async (projectData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProject = {
      ...projectData,
      id: Math.max(...mockData.projects.map(p => p.id)) + 1
    };
    mockData.projects.push(newProject);
    return newProject;
  },

  updateProject: async (id, projectData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockData.projects.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    mockData.projects[index] = { ...mockData.projects[index], ...projectData };
    return mockData.projects[index];
  },

  deleteProject: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockData.projects.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    mockData.projects.splice(index, 1);
    return true;
  },

  getProjectsByStatus: async (status) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockData.projects.filter(p => p.project_status === status);
  }
};

export const projectsAPI = {
  // Get all projects
  getAllProjects: async () => {
    if (USE_MOCK_DATA) {
      return mockAPI.getAllProjects();
    }
    
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch projects: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    if (USE_MOCK_DATA) {
      return mockAPI.getProjectById(id);
    }
    
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Create new project
  createProject: async (projectData) => {
    if (USE_MOCK_DATA) {
      return mockAPI.createProject(projectData);
    }
    
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Update project
  updateProject: async (id, projectData) => {
    if (USE_MOCK_DATA) {
      return mockAPI.updateProject(id, projectData);
    }
    
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Delete project
  deleteProject: async (id) => {
    if (USE_MOCK_DATA) {
      return mockAPI.deleteProject(id);
    }
    
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.response?.data?.detail || error.message}`);
    }
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    if (USE_MOCK_DATA) {
      return mockAPI.getProjectsByStatus(status);
    }
    
    try {
      const response = await api.get(`/projects/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch projects by status: ${error.response?.data?.detail || error.message}`);
    }
  },
};

export default api;
