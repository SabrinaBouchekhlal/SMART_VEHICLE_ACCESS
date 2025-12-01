import axios from 'axios';
import toast from 'react-hot-toast';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const isDevelopment = process.env.NODE_ENV === 'development';
const shouldUseMock = !process.env.REACT_APP_API_URL || 
                     process.env.REACT_APP_API_URL.includes('localhost');

// Mock API flag - more reliable detection
export const IS_MOCK_MODE = isDevelopment && shouldUseMock;

// Mock data
const mockCameras = [
  {
    id: 1,
    name: 'Main Gate Camera',
    stream_url: 'rtsp://192.168.1.100:554/stream',
    stream_type: 'rtsp',
    location: 'Main Entrance',
    is_active: true,
    status: 'online',
    last_checked: new Date().toISOString(),
    last_detection: '2 minutes ago',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Parking Entrance',
    stream_url: 'rtsp://192.168.1.101:554/stream',
    stream_type: 'rtsp',
    location: 'Parking Area',
    is_active: true,
    status: 'online',
    last_checked: new Date().toISOString(),
    last_detection: '5 minutes ago',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Service Gate',
    stream_url: 'rtsp://192.168.1.102:554/stream',
    stream_type: 'rtsp',
    location: 'Service Area',
    is_active: true,
    status: 'online',
    last_checked: new Date().toISOString(),
    last_detection: '12 minutes ago',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Back Entrance',
    stream_url: 'rtsp://192.168.1.103:554/stream',
    stream_type: 'rtsp',
    location: 'Rear Access',
    is_active: false,
    status: 'offline',
    last_checked: new Date(Date.now() - 2 * 3600000).toISOString(),
    last_detection: '2 hours ago',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Loading Bay',
    stream_url: 'rtsp://192.168.1.104:554/stream',
    stream_type: 'rtsp',
    location: 'Loading Dock',
    is_active: true,
    status: 'online',
    last_checked: new Date().toISOString(),
    last_detection: '8 minutes ago',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Emergency Exit',
    stream_url: 'rtsp://192.168.1.105:554/stream',
    stream_type: 'rtsp',
    location: 'Emergency Exit',
    is_active: false,
    status: 'offline',
    last_checked: new Date(Date.now() - 1 * 3600000).toISOString(),
    last_detection: '1 hour ago',
    created_at: '2024-01-01T00:00:00Z'
  }
];

const mockCameraStats = {
  total_cameras: 6,
  active_cameras: 4,
  offline_cameras: 2,
  detection_rate: 96.5
};

const mockDashboardStats = {
  total_cameras: 6,
  active_cameras: 4,
  total_plates: 245,
  authorized_plates: 230,
  detections_today: 47,
  detections_this_hour: 8,
  blacklisted_plates: 15
};

const mockPlateStats = {
  total_plates: 245,
  authorized_plates: 230,
  blacklisted_plates: 15,
  detection_accuracy: 96.5
};

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 5000, // Shorter timeout for faster mock fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add mock header for development
    if (IS_MOCK_MODE) {
      config.headers['X-Mock-Mode'] = 'true';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with mock fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If in mock mode and it's a network error, we'll handle it in the API functions
    if (IS_MOCK_MODE && (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED')) {
      // Don't show error for mock mode, just let it fall through
      error.isMockFallback = true;
      return Promise.reject(error);
    }
    
    // Handle real API errors
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      delete api.defaults.headers.common['Authorization'];
      
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status >= 400) {
      const message = error.response?.data?.detail || 'Request failed';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API functions with automatic mock fallback
const createApiWithMockFallback = <T>(realApiCall: () => Promise<T>, mockData: T, mockDelay: number = 500) => {
  return async (): Promise<T> => {
    if (IS_MOCK_MODE) {
      // Always use mock in development mode
      await new Promise(resolve => setTimeout(resolve, mockDelay));
      return mockData;
    }
    
    try {
      return await realApiCall();
    } catch (error: any) {
      if (error.isMockFallback || error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        console.warn('Using mock data due to API error:', error.message);
        await new Promise(resolve => setTimeout(resolve, mockDelay));
        return mockData;
      }
      throw error;
    }
  };
};

/**
 * Enhanced Authentication API with mock fallback - SIMPLIFIED ROLES
 */
export const authAPI = {
  login: async (username: string, password: string) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Login attempt:', username, password); // Debug log
      
      // Demo users with proper error handling
      const demoUsers = {
        'admin': { 
          id: 1, 
          username: 'admin', 
          email: 'admin@svasystem.com', 
          role: 'admin' as const,
          password: 'admin123'
        },
        'operator': { 
          id: 2, 
          username: 'operator', 
          email: 'operator@svasystem.com', 
          role: 'operator' as const,
          password: 'operator123'
        }
      };
      
      // Case-insensitive username matching
      const normalizedUsername = username.toLowerCase().trim();
      const user = demoUsers[normalizedUsername as keyof typeof demoUsers];
      
      console.log('Found user:', user); // Debug log
      
      if (user) {
        console.log('Password check:', user.password, 'vs', password); // Debug log
      }
      
      if (user && user.password === password) {
        console.log('Login successful for:', user.role); // Debug log
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          last_login: new Date().toISOString()
        };
        
        localStorage.setItem('access_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        return {
          access_token: mockToken,
          token_type: 'bearer',
          user: userData
        };
      }
      
      // NEW ERROR MESSAGE - completely different to identify the source
      throw new Error(`Login failed. Try: admin/admin123 OR operator/operator123`);
    }
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  getCurrentUser: async () => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the actual logged-in user from localStorage
      const userDataStr = localStorage.getItem('user_data');
      if (userDataStr) {
        return JSON.parse(userDataStr);
      }
      
      // Fallback to admin if no user data found
      return {
        id: 1,
        username: 'admin',
        email: 'admin@svasystem.com',
        role: 'admin',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        last_login: new Date().toISOString()
      };
    }
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          return JSON.parse(userDataStr);
        }
        throw new Error('No user data found');
      }
      throw error;
    }
  },

  logout: async () => {
    if (IS_MOCK_MODE) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      return;
    }
    await api.post('/auth/logout');
  },
};

/**
 * Enhanced Cameras API with mock fallback
 */
export const camerasAPI = {
  getCameras: async (params?: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCameras;
    }
    
    try {
      const response = await api.get('/cameras', { params });
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return mockCameras;
      }
      throw error;
    }
  },

  getCameraStats: createApiWithMockFallback(
    () => api.get('/cameras/stats/summary').then(r => r.data),
    mockCameraStats
  ),

  startCamera: async (cameraId: number) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const camera = mockCameras.find(cam => cam.id === cameraId);
      if (camera) {
        camera.status = 'online';
        camera.is_active = true;
        camera.last_checked = new Date().toISOString();
      }
      return { success: true, message: 'Camera started successfully' };
    }
    
    await api.post(`/cameras/${cameraId}/start`);
    return { success: true, message: 'Camera started successfully' };
  },

  stopCamera: async (cameraId: number) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const camera = mockCameras.find(cam => cam.id === cameraId);
      if (camera) {
        camera.status = 'offline';
        camera.is_active = false;
        camera.last_checked = new Date().toISOString();
      }
      return { success: true, message: 'Camera stopped successfully' };
    }
    
    await api.post(`/cameras/${cameraId}/stop`);
    return { success: true, message: 'Camera stopped successfully' };
  },

  createCamera: async (cameraData: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCamera = {
        id: Math.max(...mockCameras.map(c => c.id)) + 1,
        ...cameraData,
        status: 'online' as const,
        is_active: true,
        last_detection: 'Never',
        created_at: new Date().toISOString(),
        last_checked: new Date().toISOString()
      };
      mockCameras.push(newCamera);
      return newCamera;
    }
    
    const response = await api.post('/cameras', cameraData);
    return response.data;
  },

  // Keep other camera methods for real API
  getCamera: (cameraId: number) => api.get(`/cameras/${cameraId}`).then(r => r.data),
  updateCamera: (cameraId: number, cameraData: any) => 
    api.put(`/cameras/${cameraId}`, cameraData).then(r => r.data),
  deleteCamera: (cameraId: number) => api.delete(`/cameras/${cameraId}`),
};

/**
 * Enhanced Dashboard API with mock fallback - FIXED PARAMETERS
 */
export const dashboardAPI = {
  getStats: createApiWithMockFallback(
    () => api.get('/dashboard/stats').then(r => r.data),
    mockDashboardStats
  ),

  getSystemHealth: createApiWithMockFallback(
    () => api.get('/dashboard/health').then(r => r.data),
    {
      status: 'healthy',
      components: {
        database: { status: 'healthy', latency: 12 },
        redis: { status: 'healthy', memory_usage: 45 },
        cameras: { status: 'healthy', active_cameras: 4 },
        processing: { status: 'healthy', queue_size: 2 }
      },
      uptime: '45 days',
      last_check: new Date().toISOString()
    }
  ),

  // FIXED: Accept parameters but ignore them in mock mode
  getRecentDetections: async (params?: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 1,
          plate_number: 'ABC123',
          camera_name: 'Main Gate',
          confidence: 95,
          status: 'authorized' as const,
          timestamp: new Date().toISOString(),
          vehicle_type: 'Sedan',
          location: 'Main Entrance'
        },
        {
          id: 2,
          plate_number: 'XYZ789',
          camera_name: 'Parking Entrance',
          confidence: 88,
          status: 'denied' as const,
          timestamp: new Date().toISOString(),
          vehicle_type: 'SUV',
          location: 'Parking Area'
        },
        {
          id: 3,
          plate_number: 'DEF456',
          camera_name: 'Service Gate',
          confidence: 92,
          status: 'authorized' as const,
          timestamp: new Date(Date.now() - 300000).toISOString(),
          vehicle_type: 'Truck',
          location: 'Service Area'
        },
        {
          id: 4,
          plate_number: 'GHI012',
          camera_name: 'Main Gate',
          confidence: 78,
          status: 'authorized' as const,
          timestamp: new Date(Date.now() - 600000).toISOString(),
          vehicle_type: 'Van',
          location: 'Main Entrance'
        }
      ];
    }
    
    try {
      const response = await api.get('/dashboard/recent-detections', { params });
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return [];
      }
      throw error;
    }
  },

  // FIXED: Accept parameters but ignore them in mock mode
  getDetectionTrends: async (params?: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        daily_detections: [
          { date: 'Jan 10', authorized: 45, denied: 3, total: 48 },
          { date: 'Jan 11', authorized: 52, denied: 5, total: 57 },
          { date: 'Jan 12', authorized: 48, denied: 2, total: 50 },
          { date: 'Jan 13', authorized: 67, denied: 8, total: 75 },
          { date: 'Jan 14', authorized: 58, denied: 4, total: 62 },
          { date: 'Jan 15', authorized: 73, denied: 6, total: 79 },
          { date: 'Jan 16', authorized: 65, denied: 3, total: 68 },
        ]
      };
    }
    
    try {
      const response = await api.get('/dashboard/detection-trends', { params });
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return { daily_detections: [] };
      }
      throw error;
    }
  },
};

/**
 * Enhanced Plates API with mock fallback - FIXED PARAMETERS
 */
/**
 * Enhanced Plates API with mock fallback - FIXED WITH PROPER MOCK IMPLEMENTATION
 */
export const platesAPI = {
  // FIXED: Accept parameters but handle filtering in mock mode
  getPlates: async (params?: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPlates = [
        {
          id: 1,
          plate_number: 'ABC123',
          vehicle_type: 'Sedan',
          owner_name: 'John Doe',
          is_whitelisted: true,
          is_blacklisted: false,
          last_seen: '2 hours ago',
          description: 'Company Vehicle'
        },
        {
          id: 2,
          plate_number: 'XYZ789',
          vehicle_type: 'SUV',
          owner_name: 'Unknown',
          is_whitelisted: false,
          is_blacklisted: true,
          last_seen: '1 hour ago',
          description: 'Suspicious Vehicle'
        },
        {
          id: 3,
          plate_number: 'DEF456',
          vehicle_type: 'Hatchback',
          owner_name: 'Jane Smith',
          is_whitelisted: true,
          is_blacklisted: false,
          last_seen: '30 minutes ago',
          description: 'Employee Vehicle'
        },
        {
          id: 4,
          plate_number: 'GHI789',
          vehicle_type: 'Motorcycle',
          owner_name: 'Unknown',
          is_whitelisted: false,
          is_blacklisted: true,
          last_seen: '5 minutes ago',
          description: 'Stolen Vehicle'
        },
        {
          id: 5,
          plate_number: 'JKL012',
          vehicle_type: 'Truck',
          owner_name: 'Bob Wilson',
          is_whitelisted: true,
          is_blacklisted: false,
          last_seen: '15 minutes ago',
          description: 'Delivery Vehicle'
        }
      ];

      // Filter based on parameters if provided
      let filteredPlates = mockPlates;
      
      if (params?.is_authorized !== undefined) {
        filteredPlates = filteredPlates.filter(plate => 
          params.is_authorized ? plate.is_whitelisted : !plate.is_whitelisted
        );
      }
      
      if (params?.is_blacklisted !== undefined) {
        filteredPlates = filteredPlates.filter(plate => 
          params.is_blacklisted ? plate.is_blacklisted : !plate.is_blacklisted
        );
      }

      return filteredPlates;
    }
    
    try {
      const response = await api.get('/plates', { params });
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return [];
      }
      throw error;
    }
  },

  getPlateStats: createApiWithMockFallback(
    () => api.get('/plates/stats/summary').then(r => r.data),
    mockPlateStats
  ),

  // FIXED: Proper mock implementation for createPlate
  createPlate: async (plateData: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a new ID
      const newId = Math.max(...[
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
      ].map(p => p.id)) + 1;
      
      const newPlate = {
        id: newId,
        plate_number: plateData.plate_number,
        vehicle_type: plateData.vehicle_type || 'Unknown',
        owner_name: plateData.owner_name || 'Unknown',
        is_whitelisted: plateData.is_whitelisted || false,
        is_blacklisted: plateData.is_blacklisted || false,
        last_seen: 'Never',
        description: plateData.description || ''
      };
      
      // In a real app, this would be saved to a database
      // For mock, we'll just return the new plate
      console.log('Mock: Created new plate:', newPlate);
      
      return newPlate;
    }
    
    try {
      const response = await api.post('/plates', plateData);
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        // Fallback mock creation
        const newId = Date.now();
        return {
          id: newId,
          ...plateData,
          last_seen: 'Never'
        };
      }
      throw error;
    }
  },

  // FIXED: Proper mock implementation for deletePlate
  deletePlate: async (plateId: number) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Mock: Deleted plate with ID:', plateId);
      
      // In a real app, this would delete from database
      // For mock, we'll just return success
      return { success: true, message: 'Plate deleted successfully' };
    }
    
    try {
      const response = await api.delete(`/plates/${plateId}`);
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return { success: true, message: 'Plate deleted successfully (mock)' };
      }
      throw error;
    }
  },

  // FIXED: Proper mock implementation for updatePlate
  updatePlate: async (plateId: number, plateData: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      console.log('Mock: Updated plate', plateId, 'with data:', plateData);
      
      // Return the updated plate data
      return {
        id: plateId,
        ...plateData
      };
    }
    
    try {
      const response = await api.put(`/plates/${plateId}`, plateData);
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return { id: plateId, ...plateData };
      }
      throw error;
    }
  },

  // FIXED: Accept parameters but ignore them in mock mode
  getRecentDetections: async (params?: any) => {
    if (IS_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: 1,
          plate_number: 'ABC123',
          camera_name: 'Main Gate',
          confidence: 95,
          status: 'authorized' as const,
          timestamp: new Date().toISOString(),
          vehicle_type: 'Sedan',
          location: 'Main Entrance'
        },
        {
          id: 2,
          plate_number: 'XYZ789',
          camera_name: 'Parking Entrance',
          confidence: 88,
          status: 'denied' as const,
          timestamp: new Date().toISOString(),
          vehicle_type: 'SUV',
          location: 'Parking Area'
        }
      ];
    }
    
    try {
      const response = await api.get('/plates/detections/recent', { params });
      return response.data;
    } catch (error: any) {
      if (error.isMockFallback) {
        return [];
      }
      throw error;
    }
  },
};

// Export mock mode status
export const getApiStatus = () => ({
  isMockMode: IS_MOCK_MODE,
  baseUrl: API_BASE_URL,
  environment: process.env.NODE_ENV
});