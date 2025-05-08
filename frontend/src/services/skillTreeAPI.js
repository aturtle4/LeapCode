// Skill Tree API service
import api from './api';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Simple cache implementation
const cache = {
  skillTrees: null,
  skillTreesTimestamp: null,
  skillTreeDetails: {},
  skillTreeDetailsTimestamp: {}
};

export const skillTreeAPI = {
  // Get all skill trees with caching
  getAllSkillTrees: async () => {
    try {
      // Check if we have cached data that's still valid
      const now = new Date().getTime();
      if (cache.skillTrees && cache.skillTreesTimestamp && 
          (now - cache.skillTreesTimestamp < CACHE_DURATION)) {
        console.log('Using cached skill trees data');
        return cache.skillTrees;
      }
      
      // If no valid cache, make the API call
      const response = await api.get('/skill-trees');
      
      // Update cache
      cache.skillTrees = response.data;
      cache.skillTreesTimestamp = now;
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to load skill trees' };
    }
  },

  // Get a specific skill tree by ID with caching
  getSkillTree: async (id) => {
    try {
      // Check if we have cached data for this specific tree
      const now = new Date().getTime();
      if (cache.skillTreeDetails[id] && cache.skillTreeDetailsTimestamp[id] &&
          (now - cache.skillTreeDetailsTimestamp[id] < CACHE_DURATION)) {
        console.log(`Using cached data for skill tree ${id}`);
        return cache.skillTreeDetails[id];
      }
      
      // If no valid cache, make the API call
      const response = await api.get(`/skill-trees/${id}`);
      
      // Update cache for this specific tree
      cache.skillTreeDetails[id] = response.data;
      cache.skillTreeDetailsTimestamp[id] = now;
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: `Failed to load skill tree ${id}` };
    }
  },

  // Create a new skill tree
  createSkillTree: async (skillTreeData) => {
    try {
      const response = await api.post('/skill-trees', skillTreeData);
      
      // Invalidate cache since we've added a new tree
      cache.skillTrees = null;
      cache.skillTreesTimestamp = null;
      
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
      
      // Invalidate cache for this specific tree and the list of trees
      cache.skillTreeDetails[id] = null;
      cache.skillTreeDetailsTimestamp[id] = null;
      cache.skillTrees = null;
      cache.skillTreesTimestamp = null;
      
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
      
      // Invalidate cache since we've deleted a tree
      cache.skillTreeDetails[id] = null;
      cache.skillTreeDetailsTimestamp[id] = null;
      cache.skillTrees = null;
      cache.skillTreesTimestamp = null;
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: `Failed to delete skill tree ${id}` };
    }
  }
};

export default skillTreeAPI;