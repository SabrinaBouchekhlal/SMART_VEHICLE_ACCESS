import React from 'react';
import { Cpu, Database, Wifi, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface SystemHealthProps {
  health: {
    status: 'healthy' | 'warning' | 'error';
    components: {
      database: { status: 'healthy' | 'degraded' | 'down'; latency?: number };
      redis: { status: 'healthy' | 'degraded' | 'down'; memory_usage?: number };
      cameras: { status: 'healthy' | 'degraded' | 'down'; active_cameras?: number };
      processing: { status: 'healthy' | 'degraded' | 'down'; queue_size?: number };
    };
    uptime: string;
    last_check: string;
  };
}

const SystemHealth: React.FC<SystemHealthProps> = ({ health }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-700 bg-green-100';
      case 'degraded':
        return 'text-yellow-700 bg-yellow-100';
      case 'down':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const components = [
    {
      name: 'Database',
      icon: Database,
      status: health.components.database.status,
      details: health.components.database.latency ? `Latency: ${health.components.database.latency}ms` : 'No data'
    },
    {
      name: 'Redis Cache',
      icon: Shield,
      status: health.components.redis.status,
      details: health.components.redis.memory_usage ? `Memory: ${health.components.redis.memory_usage}%` : 'No data'
    },
    {
      name: 'Cameras',
      icon: Wifi,
      status: health.components.cameras.status,
      details: health.components.cameras.active_cameras ? `${health.components.cameras.active_cameras} active` : 'No data'
    },
    {
      name: 'AI Processing',
      icon: Cpu,
      status: health.components.processing.status,
      details: health.components.processing.queue_size ? `Queue: ${health.components.processing.queue_size}` : 'No data'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`flex items-center justify-between p-4 rounded-lg ${
        health.status === 'healthy' ? 'bg-green-50 border border-green-200' :
        health.status === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          {getStatusIcon(health.status)}
          <div className="ml-3">
            <h4 className="text-sm font-medium">
              System Status: <span className="capitalize">{health.status}</span>
            </h4>
            <p className="text-sm text-gray-600">
              Uptime: {health.uptime} • Last check: {new Date(health.last_check).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {components.map((component) => {
          const IconComponent = component.icon;
          return (
            <div key={component.name} className="card hover:shadow-md transition-shadow duration-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{component.name}</p>
                      <p className="text-xs text-gray-500">{component.details}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                    {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">98.2%</p>
          <p className="text-gray-600">Detection Accuracy</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">0.8s</p>
          <p className="text-gray-600">Avg Processing Time</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;