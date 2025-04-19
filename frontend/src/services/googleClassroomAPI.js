// Google Classroom API service
import api from './api';

export const googleClassroomAPI = {
  // Get all classrooms for the authenticated user
  getClassrooms: async () => {
    try {
      const response = await api.get('/google-classroom/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to load classrooms' };
    }
  },

  // Get a specific classroom by ID
  getClassroom: async (classroomId) => {
    try {
      const response = await api.get(`/google-classroom/${classroomId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to load classroom' };
    }
  },

  // Connect a skill tree to a Google Classroom
  linkSkillTreeToClassroom: async (skillTreeId, classroomId) => {
    try {
      const response = await api.post('/google-classroom/link', {
        skill_tree_id: skillTreeId,
        classroom_id: classroomId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to link skill tree to classroom' };
    }
  },
  
  // Remove connection between a skill tree and its Google Classroom
  unlinkSkillTreeFromClassroom: async (skillTreeId) => {
    try {
      const response = await api.delete(`/google-classroom/skill-tree/${skillTreeId}/link`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to unlink skill tree from classroom' };
    }
  },
  
  // Get Google Classroom associated with a skill tree
  getClassroomForSkillTree: async (skillTreeId) => {
    try {
      const response = await api.get(`/google-classroom/skill-tree/${skillTreeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get associated classroom' };
    }
  },

  // Authorize Google Classroom (OAuth)
  getAuthUrl: async () => {
    try {
      const response = await api.get('/google-classroom/auth');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get Google Classroom auth URL' };
    }
  },

  // Open Google Classroom in new window
  openClassroom: (classroomUrl) => {
    window.open(classroomUrl, '_blank');
  }
};

export default googleClassroomAPI;