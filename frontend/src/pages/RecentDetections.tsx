import React from 'react';
import { CheckCircle, XCircle, Clock, Camera } from 'lucide-react';

interface Detection {
  id: number;
  plate_number: string;
  camera_name: string;
  confidence: number;
  status: 'authorized' | 'denied' | 'unknown';
  timestamp: string;
  vehicle_type?: string;
  location?: string;
}

interface RecentDetectionsProps {
  detections: Detection[];
}

const RecentDetections: React.FC<RecentDetectionsProps> = ({ detections }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authorized':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authorized':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'authorized':
        return 'Authorized';
      case 'denied':
        return 'Denied';
      default:
        return 'Unknown';
    }
  };

  if (!detections || detections.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No recent detections</p>
        <p className="text-gray-400 text-sm mt-1">
          Camera detections will appear here in real-time
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {detections.map((detection) => (
        <div
          key={detection.id}
          className="p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                detection.status === 'authorized' ? 'bg-green-100' : 
                detection.status === 'denied' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                {getStatusIcon(detection.status)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-900 font-mono">
                    {detection.plate_number}
                  </p>
                  {detection.vehicle_type && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {detection.vehicle_type}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {detection.camera_name}
                  {detection.location && ` • ${detection.location}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: <span className="font-medium">{detection.confidence}%</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(detection.status)}`}>
                {getStatusText(detection.status)}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(detection.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentDetections;