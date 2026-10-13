import axios from 'axios';
import {
  ApiResponse,
  AuthResponse,
  Emergency,
  Incident,
  CommunityPost,
  Journey,
  Notification,
  AuditLog,
  User,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safelink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('safelink_token');
        localStorage.removeItem('safelink_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data;
  },
  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: string;
    badgeNumber?: string;
    department?: string;
  }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};

// Emergency Endpoints
export const emergencyApi = {
  triggerSos: async (payload: { latitude: number; longitude: number; address?: string; triggerReason?: string }) => {
    const res = await api.post<ApiResponse<Emergency>>('/emergencies/sos', payload);
    return res.data;
  },
  getMyEmergencies: async () => {
    const res = await api.get<ApiResponse<Emergency[]>>('/emergencies/my');
    return res.data;
  },
  getActiveEmergencies: async () => {
    const res = await api.get<ApiResponse<Emergency[]>>('/emergencies/active');
    return res.data;
  },
  getAllEmergencies: async () => {
    const res = await api.get<ApiResponse<Emergency[]>>('/emergencies/all');
    return res.data;
  },
  updateStatus: async (id: number, payload: { status: string; responseNotes?: string }) => {
    const res = await api.patch<ApiResponse<Emergency>>(`/emergencies/${id}/status`, payload);
    return res.data;
  },
};

// Incident Endpoints
export const incidentApi = {
  create: async (payload: {
    title: string;
    description: string;
    category: string;
    severity: string;
    latitude: number;
    longitude: number;
    approximateAddress?: string;
    anonymous: boolean;
  }) => {
    const res = await api.post<ApiResponse<Incident>>('/incidents', payload);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get<ApiResponse<Incident[]>>('/incidents');
    return res.data;
  },
  getVerified: async () => {
    const res = await api.get<ApiResponse<Incident[]>>('/incidents/verified');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Incident>>(`/incidents/${id}`);
    return res.data;
  },
  review: async (id: number, payload: { status: string; severity?: string; officialNotes?: string }) => {
    const res = await api.patch<ApiResponse<Incident>>(`/incidents/${id}/review`, payload);
    return res.data;
  },
};

// Community Endpoints
export const communityApi = {
  createPost: async (payload: {
    title: string;
    content: string;
    category: string;
    locationName?: string;
    latitude?: number;
    longitude?: number;
    anonymous: boolean;
  }) => {
    const res = await api.post<ApiResponse<CommunityPost>>('/community/posts', payload);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get<ApiResponse<CommunityPost[]>>('/community/posts');
    return res.data;
  },
  confirmPost: async (id: number) => {
    const res = await api.post<ApiResponse<CommunityPost>>(`/community/posts/${id}/confirm`);
    return res.data;
  },
  reviewPost: async (id: number, payload: { status: string; note: string }) => {
    const res = await api.patch<ApiResponse<CommunityPost>>(`/community/posts/${id}/review`, payload);
    return res.data;
  },
};

// Journey Endpoints
export const journeyApi = {
  startJourney: async (payload: {
    originName: string;
    destinationName: string;
    startLatitude: number;
    startLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
    expectedDurationMinutes: number;
    companionModeEnabled?: boolean;
    shareWithGuardians?: boolean;
  }) => {
    const res = await api.post<ApiResponse<Journey>>('/journeys', payload);
    return res.data;
  },
  getMyJourneys: async () => {
    const res = await api.get<ApiResponse<Journey[]>>('/journeys/my');
    return res.data;
  },
  getCompanions: async () => {
    const res = await api.get<ApiResponse<Journey[]>>('/journeys/companions');
    return res.data;
  },
  updateLocation: async (id: number, coords: { latitude: number; longitude: number }) => {
    const res = await api.patch<ApiResponse<Journey>>(`/journeys/${id}/location`, coords);
    return res.data;
  },
  completeJourney: async (id: number) => {
    const res = await api.post<ApiResponse<Journey>>(`/journeys/${id}/complete`);
    return res.data;
  },
};

// Notification Endpoints
export const notificationApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Notification[]>>('/notifications');
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data;
  },
  markRead: async (id: number) => {
    const res = await api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
    return res.data;
  },
};

// Guardian Specific
export const guardianApi = {
  getWards: async () => {
    const res = await api.get<ApiResponse<User[]>>('/guardian/wards');
    return res.data;
  },
  getWardEmergencies: async () => {
    const res = await api.get<ApiResponse<Emergency[]>>('/guardian/active-emergencies');
    return res.data;
  },
  getWardJourneys: async () => {
    const res = await api.get<ApiResponse<Journey[]>>('/guardian/active-journeys');
    return res.data;
  },
};

// Audit Logs
export const auditApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<AuditLog[]>>('/audit-logs');
    return res.data;
  },
};

export default api;
