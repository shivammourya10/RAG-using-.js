import axios from 'axios';
import config from '../config.js';

const API_BASE_URL = config.API_BASE_URL;

class APIService {
  constructor() {
    this.sessionId = null;
  }

  async uploadPDF(file) {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    this.sessionId = response.data.sessionId;
    return response.data;
  }

  async sendQuery(message) {
    if (!this.sessionId) {
      throw new Error('No active session. Please upload a PDF first.');
    }

    const response = await axios.post(`${API_BASE_URL}/query`, {
      sessionId: this.sessionId,
      message: message,
    });

    return response.data;
  }

  async resetSession() {
    if (this.sessionId) {
      await axios.post(`${API_BASE_URL}/reset`, {
        sessionId: this.sessionId,
      });
    }
    this.sessionId = null;
  }

  async getSessionInfo() {
    if (!this.sessionId) return null;

    try {
      const response = await axios.get(`${API_BASE_URL}/session/${this.sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session info:', error);
      return null;
    }
  }

  async healthCheck() {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
}

export default new APIService();
