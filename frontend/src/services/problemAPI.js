import api from './api';

const BASE_URL = '/problems';

export const problemAPI = {
  // Problem endpoints
  getAllProblems: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getProblem: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  createProblem: async (problemData) => {
    const response = await api.post(BASE_URL, problemData);
    return response.data;
  },

  updateProblem: async (id, problemData) => {
    const response = await api.put(`${BASE_URL}/${id}`, problemData);
    return response.data;
  },

  deleteProblem: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Test case endpoints
  getTestCases: async (problemId) => {
    const response = await api.get(`${BASE_URL}/${problemId}/test-cases`);
    return response.data;
  },

  createTestCase: async (testCaseData) => {
    const response = await api.post(`${BASE_URL}/test-cases`, testCaseData);
    return response.data;
  },

  deleteTestCase: async (testCaseId) => {
    const response = await api.delete(`${BASE_URL}/test-cases/${testCaseId}`);
    return response.data;
  },

  // Submission endpoints
  createSubmission: async (submissionData) => {
    const response = await api.post(`${BASE_URL}/submissions`, submissionData);
    return response.data;
  },

  getSubmission: async (submissionId) => {
    const response = await api.get(`${BASE_URL}/submissions/${submissionId}`);
    return response.data;
  },

  getProblemSubmissions: async (problemId) => {
    const response = await api.get(`${BASE_URL}/${problemId}/submissions`);
    return response.data;
  }
};