/**
 * API Hooks - Frontend integration with backend
 * Provides easy-to-use hooks for React components
 */

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// ==================== DOCUMENT HOOKS ====================

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/documents', { params: filters });
      setDocuments(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocument = useCallback(async (id) => {
    try {
      const response = await apiClient.get(`/documents/${id}`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching document:', err);
    }
  }, []);

  const downloadDocument = useCallback(async (id) => {
    try {
      await apiClient.post(`/documents/${id}/download`);
      // Trigger actual file download
      window.location.href = `/files/${id}`;
    } catch (err) {
      setError(err.message);
      console.error('Error downloading document:', err);
    }
  }, []);

  const getPopularDocuments = useCallback(async () => {
    try {
      const response = await apiClient.get('/documents/trending/popular');
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching popular documents:', err);
    }
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    getDocument,
    downloadDocument,
    getPopularDocuments
  };
};

// ==================== QUESTION PAPER HOOKS ====================

export const useQuestionPapers = () => {
  const [papers, setPapers] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestionPapers = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/question-papers', { params: filters });
      setPapers(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching question papers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuestionPaper = useCallback(async (id) => {
    try {
      const response = await apiClient.get(`/question-papers/${id}`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching question paper:', err);
    }
  }, []);

  const analyzeQuestionPatterns = useCallback(async (semester) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/question-papers/analyze/${semester}`);
      setAnalysis(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing question patterns:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    papers,
    analysis,
    loading,
    error,
    fetchQuestionPapers,
    getQuestionPaper,
    analyzeQuestionPatterns
  };
};

// ==================== NOTIFICATION HOOKS ====================

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (userId, unreadOnly = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/notifications', {
        params: { userId, unread: unreadOnly }
      });
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotification = useCallback(async (notificationData) => {
    try {
      const response = await apiClient.post('/notifications', notificationData);
      setNotifications(prev => [response.data.data, ...prev]);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating notification:', err);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const sendExamReminder = useCallback(async (reminderData) => {
    try {
      const response = await apiClient.post('/notifications/exam-reminder', reminderData);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error sending exam reminder:', err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    createNotification,
    markAsRead,
    sendExamReminder
  };
};

// ==================== SHARING HOOKS ====================

export const useSharing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shareDocument = useCallback(async (shareData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/share/document', shareData);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error sharing document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const shareQuestionPaper = useCallback(async (shareData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/share/question-paper', shareData);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error sharing question paper:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReceivedShares = useCallback(async (userId) => {
    try {
      const response = await apiClient.get(`/share/received/${userId}`);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching received shares:', err);
    }
  }, []);

  return {
    loading,
    error,
    shareDocument,
    shareQuestionPaper,
    getReceivedShares
  };
};

// ==================== ANALYTICS HOOKS ====================

export const useAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDocumentStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/stats/documents');
      setStats(response.data.stats);
      return response.data.stats;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching document stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getExamStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/stats/exams');
      setStats(response.data.stats);
      return response.data.stats;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching exam stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    getDocumentStats,
    getExamStats
  };
};

// ==================== HEALTH CHECK ====================

export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/health');
      setIsHealthy(response.data.status === 'ok');
      return response.data;
    } catch (err) {
      setIsHealthy(false);
      console.error('API Health check failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isHealthy, loading, checkHealth };
};

export default {
  useDocuments,
  useQuestionPapers,
  useNotifications,
  useSharing,
  useAnalytics,
  useHealthCheck
};
