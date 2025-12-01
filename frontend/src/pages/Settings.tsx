import React, { useState } from 'react';
import { Save, Download, Activity, Shield, Bell, Cpu, Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    systemName: 'Smart Vehicle Access System',
    detectionSensitivity: 75,
    autoUpdates: true,
    dataRetention: '180',
    auditLogging: true,
    confidenceThreshold: 80,
    manualReview: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Configure system parameters and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <SettingsIcon className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  value={settings.systemName}
                  onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detection Sensitivity
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.detectionSensitivity}
                  onChange={(e) => handleSettingChange('detectionSensitivity', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoUpdates"
                  checked={settings.autoUpdates}
                  onChange={(e) => handleSettingChange('autoUpdates', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoUpdates" className="ml-2 text-sm text-gray-700">
                  Enable automatic updates
                </label>
              </div>
            </div>
          </div>

          {/* OCR Correction Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <Cpu className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">OCR Correction Settings</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-correct Confidence Threshold
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={settings.confidenceThreshold}
                  onChange={(e) => handleSettingChange('confidenceThreshold', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>80%</span>
                  <span>95%</span>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manualReview"
                  checked={settings.manualReview}
                  onChange={(e) => handleSettingChange('manualReview', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="manualReview" className="ml-2 text-sm text-gray-700">
                  Enable manual review for low-confidence reads
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Retention Period
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                  className="input"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auditLogging"
                  checked={settings.auditLogging}
                  onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="auditLogging" className="ml-2 text-sm text-gray-700">
                  Enable audit logging
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Information */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">System Information</h3>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">v2.3.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Update</span>
                  <span className="font-medium">2024-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium">45 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database Size</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
            </div>
            <div className="card-body space-y-3">
              <button className="btn btn-primary w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
              <button className="btn btn-secondary w-full">
                <Download className="w-4 h-4 mr-2" />
                Backup Configuration
              </button>
              <button className="btn btn-success w-full">
                <Activity className="w-4 h-4 mr-2" />
                System Diagnostics
              </button>
              <button className="btn btn-danger w-full">
                <Shield className="w-4 h-4 mr-2" />
                Emergency Lockdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;