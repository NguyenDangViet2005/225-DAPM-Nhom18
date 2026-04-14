import apiClient from "@/configs/axiosClient";

export const hoatdongAPI = {
  // Get all activities with pagination
  getAllSchoolActivities: async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get("/hoat-dong-doan", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get activity by ID
  getActivityById: async (idHD) => {
    const response = await apiClient.get(`/hoat-dong-doan/${idHD}`);
    return response.data;
  },

  // Create new activity
  createActivity: async (activityData) => {
    const response = await apiClient.post("/hoat-dong-doan", activityData);
    return response.data;
  },

  // Update activity
  updateActivity: async (idHD, updateData) => {
    const response = await apiClient.put(`/hoat-dong-doan/${idHD}`, updateData);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (idHD) => {
    const response = await apiClient.delete(`/hoat-dong-doan/${idHD}`);
    return response.data;
  },

  // Get registrations for an activity
  getActivityRegistrations: async (idHD) => {
    const response = await apiClient.get(
      `/hoat-dong-doan/${idHD}/registrations`,
    );
    return response.data;
  },
};

export default hoatdongAPI;
