import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { platesAPI } from '../services/api';
import { Search, Download, Clock, Camera, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Detections: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: recentDetections, isLoading } = useQuery(
    'recent-detections',
    () => platesAPI.getRecentDetections({ limit: 50, hours: 24 })
  );

  const filteredDetections = recentDetections?.filter((detection: any) =>
    detection.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detection.camera_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h2 className="text-2xl font-bold text-gray-900">Live Monitor</h2>
          <p className="mt-1 text-sm text-gray-500">Real-time license plate detection monitoring</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search detections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="btn btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </button>
        </div>
      </div>

      {/* Live Camera Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera 1 */}
        <div className="bg-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Main Gate Camera</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">LIVE</span>
            </div>
          </div>
          <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">Live RTSP Stream</p>
                <p className="text-gray-500 text-sm mt-1">rtsp://gate-camera.local</p>
              </div>
            </div>
            {/* Plate detection overlay */}
            <div className="absolute top-1/3 left-1/4 w-32 h-8 border-2 border-green-400 rounded">
              <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded">
                1234 ABC ✓ 95%
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-semibold">Active - Detecting</p>
            </div>
            <div>
              <p className="text-gray-400">Last Detection</p>
              <p className="font-semibold">2 minutes ago</p>
            </div>
          </div>
        </div>

        {/* Camera 2 */}
        <div className="bg-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Parking Entrance</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">LIVE</span>
            </div>
          </div>
          <div className="aspect-video bg-gray-700 rounded-lg mb-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">Live RTSP Stream</p>
                <p className="text-gray-500 text-sm mt-1">rtsp://parking-camera.local</p>
              </div>
            </div>
            {/* Plate detection overlay */}
            <div className="absolute top-1/3 left-2/5 w-36 h-8 border-2 border-red-400 rounded">
              <div className="absolute -top-8 left-0 bg-red-500 text-white px-2 py-1 text-xs rounded">
                5678 XYZ ✗ 88%
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-semibold">Active - Detecting</p>
            </div>
            <div>
              <p className="text-gray-400">Last Detection</p>
              <p className="font-semibold">5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Log */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Live Detection Log</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Last 24 hours
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredDetections?.map((detection: any) => (
              <div
                key={detection.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                  detection.status === 'authorized' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      detection.status === 'authorized' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {detection.status === 'authorized' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{detection.plate_number}</p>
                      <p className="text-sm text-gray-600">
                        {detection.camera_name} • {detection.confidence}% confidence
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${
                      detection.status === 'authorized' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {detection.status === 'authorized' ? 'Authorized' : 'Denied'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(detection.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!filteredDetections || filteredDetections.length === 0) && (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No detections found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search terms' : 'Camera detections will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detections;