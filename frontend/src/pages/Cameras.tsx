import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { camerasAPI } from '../services/api';
import { Plus, Video, Wifi, WifiOff, Edit, Trash2, Play, Square, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';

// Mock data for development
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

// Enhanced API functions with mock fallback
const enhancedCamerasAPI = {
  getCameras: async () => {
    try {
      // Try real API first
      return await camerasAPI.getCameras();
    } catch (error) {
      console.warn('Using mock camera data due to API error:', error);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCameras;
    }
  },

  getCameraStats: async () => {
    try {
      return await camerasAPI.getCameraStats();
    } catch (error) {
      console.warn('Using mock camera stats due to API error:', error);
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCameraStats;
    }
  },

  startCamera: async (cameraId: number) => {
    try {
      return await camerasAPI.startCamera(cameraId);
    } catch (error) {
      console.warn('Using mock start camera due to API error:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update mock data
      const camera = mockCameras.find(cam => cam.id === cameraId);
      if (camera) {
        camera.status = 'online';
        camera.is_active = true;
        camera.last_checked = new Date().toISOString();
      }
      
      return { success: true, message: 'Camera started successfully' };
    }
  },

  stopCamera: async (cameraId: number) => {
    try {
      return await camerasAPI.stopCamera(cameraId);
    } catch (error) {
      console.warn('Using mock stop camera due to API error:', error);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update mock data
      const camera = mockCameras.find(cam => cam.id === cameraId);
      if (camera) {
        camera.status = 'offline';
        camera.is_active = false;
        camera.last_checked = new Date().toISOString();
      }
      
      return { success: true, message: 'Camera stopped successfully' };
    }
  },

  createCamera: async (cameraData: any) => {
    try {
      return await camerasAPI.createCamera(cameraData);
    } catch (error) {
      console.warn('Using mock create camera due to API error:', error);
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
  }
};

const Cameras: React.FC = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCameraData, setNewCameraData] = useState({
    name: '',
    stream_url: '',
    location: ''
  });

  // Use enhanced API functions with mock fallbacks
  const { data: cameras, isLoading, refetch } = useQuery('cameras', enhancedCamerasAPI.getCameras);
  const { data: stats } = useQuery('camera-stats', enhancedCamerasAPI.getCameraStats);

  const startCameraMutation = useMutation(enhancedCamerasAPI.startCamera, {
    onSuccess: () => {
      queryClient.invalidateQueries('cameras');
      queryClient.invalidateQueries('camera-stats');
    }
  });

  const stopCameraMutation = useMutation(enhancedCamerasAPI.stopCamera, {
    onSuccess: () => {
      queryClient.invalidateQueries('cameras');
      queryClient.invalidateQueries('camera-stats');
    }
  });

  const createCameraMutation = useMutation(enhancedCamerasAPI.createCamera, {
    onSuccess: () => {
      queryClient.invalidateQueries('cameras');
      queryClient.invalidateQueries('camera-stats');
      setShowAddModal(false);
      setNewCameraData({ name: '', stream_url: '', location: '' });
    }
  });

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCameraData.name && newCameraData.stream_url && newCameraData.location) {
      createCameraMutation.mutate(newCameraData);
    }
  };

  const handleTestConnection = async (cameraId: number) => {
    const camera = cameras?.find((cam: any) => cam.id === cameraId);
    if (camera) {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Connection test for ${camera.name}: ${camera.status === 'online' ? 'SUCCESS' : 'FAILED'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Camera Systems</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and monitor all surveillance cameras</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => refetch()}
            className="btn btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Camera
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Cameras"
          value={stats?.total_cameras || 0}
          subtitle="All configured cameras"
          icon={Video}
          color="blue"
        />
        <StatsCard
          title="Active Cameras"
          value={stats?.active_cameras || 0}
          subtitle="Currently streaming"
          icon={Wifi}
          color="green"
        />
        <StatsCard
          title="Offline Cameras"
          value={stats?.offline_cameras || 0}
          subtitle="Connection issues"
          icon={WifiOff}
          color="red"
        />
        <StatsCard
          title="Detection Rate"
          value={`${stats?.detection_rate || 0}%`}
          subtitle="Successful recognitions"
          icon={Video}
          color="purple"
        />
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras?.map((camera: any) => (
          <div key={camera.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{camera.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    camera.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    camera.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {camera.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-2">{camera.location}</p>
              <p className="text-gray-500 text-xs font-mono mb-4 truncate" title={camera.stream_url}>
                {camera.stream_url}
              </p>

              {/* Camera Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200">
                {camera.status === 'online' ? (
                  <div className="text-center">
                    <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Live Stream</p>
                    <p className="text-gray-400 text-xs">Connected</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Offline</p>
                    <p className="text-gray-400 text-xs">No Connection</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Last detection:</span>
                <span className="font-medium">{camera.last_detection || 'Never'}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                {camera.status === 'online' ? (
                  <button
                    onClick={() => stopCameraMutation.mutate(camera.id)}
                    disabled={stopCameraMutation.isLoading}
                    className="btn btn-danger flex-1 text-sm"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    {stopCameraMutation.isLoading ? 'Stopping...' : 'Stop'}
                  </button>
                ) : (
                  <button
                    onClick={() => startCameraMutation.mutate(camera.id)}
                    disabled={startCameraMutation.isLoading}
                    className="btn btn-success flex-1 text-sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {startCameraMutation.isLoading ? 'Starting...' : 'Start'}
                  </button>
                )}
                <button className="btn btn-secondary flex-1 text-sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>

              {/* Test Connection Button */}
              <button 
                onClick={() => handleTestConnection(camera.id)}
                className="btn btn-secondary w-full mt-2 text-sm"
              >
                Test Connection
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Camera</h3>
            <form onSubmit={handleAddCamera}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camera Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCameraData.name}
                    onChange={(e) => setNewCameraData(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    placeholder="Main Gate Camera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCameraData.stream_url}
                    onChange={(e) => setNewCameraData(prev => ({ ...prev, stream_url: e.target.value }))}
                    className="input"
                    placeholder="rtsp://192.168.1.100:554/stream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCameraData.location}
                    onChange={(e) => setNewCameraData(prev => ({ ...prev, location: e.target.value }))}
                    className="input"
                    placeholder="Main Entrance"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  disabled={createCameraMutation.isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={createCameraMutation.isLoading}
                >
                  {createCameraMutation.isLoading ? 'Adding...' : 'Add Camera'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Video className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Development Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Using mock camera data. Cameras can be started, stopped, and new cameras can be added.
                All changes are stored in memory and will reset on page refresh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cameras;