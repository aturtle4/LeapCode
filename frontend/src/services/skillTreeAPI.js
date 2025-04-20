// Skill Tree API service
import api from './api';

export const skillTreeAPI = {
  // Get all skill trees
  getAllSkillTrees: async () => {
    try {
      const response = await api.get('/skill-trees');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to load skill trees' };
    }
  },

  // Get a specific skill tree by ID
  getSkillTree: async (id) => {
    try {
      const response = await api.get(`/skill-trees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: `Failed to load skill tree ${id}` };
    }
  },

  // Create a new skill tree
  createSkillTree: async (skillTreeData) => {
    try {
      const response = await api.post('/skill-trees', skillTreeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create skill tree' };
    }
  },

  // Update an existing skill tree
  updateSkillTree: async (id, skillTreeData) => {
    try {
      console.log('Updating skill tree with data:', JSON.stringify(skillTreeData, null, 2));
      const response = await api.put(`/skill-trees/${id}`, skillTreeData);
      console.log('Skill tree update response:', JSON.stringify(response.data, null, 2));
      
      // Verify nodes are in the response
      if (response.data && !response.data.nodes && skillTreeData.nodes) {
        console.error('Nodes missing from response but present in request');
        // Add the nodes back to the response if missing
        response.data.nodes = skillTreeData.nodes;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating skill tree:', error);
      throw error.response?.data || { detail: `Failed to update skill tree ${id}` };
    }
  },

  // Delete a skill tree
  deleteSkillTree: async (id) => {
    try {
      const response = await api.delete(`/skill-trees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: `Failed to delete skill tree ${id}` };
    }
  }
};

export default skillTreeAPI;