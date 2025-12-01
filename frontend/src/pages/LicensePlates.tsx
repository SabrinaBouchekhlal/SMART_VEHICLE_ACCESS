import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { platesAPI } from '../services/api';
import { Plus, Car, Shield, AlertTriangle, Search, Download, Trash2, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import toast from 'react-hot-toast';

// Mock data that will persist during the session
const initialMockPlates = [
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
];

const LicensePlates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'whitelist' | 'blacklist'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlateData, setNewPlateData] = useState({
    plate_number: '',
    vehicle_type: '',
    owner_name: '',
    description: '',
    is_whitelisted: false,
    is_blacklisted: false
  });
  
  // Use local state to manage plates
  const [localPlates, setLocalPlates] = useState(initialMockPlates);
  
  // Calculate stats from local data
  const stats = {
    total_plates: localPlates.length,
    authorized_plates: localPlates.filter(p => p.is_whitelisted).length,
    blacklisted_plates: localPlates.filter(p => p.is_blacklisted).length,
    detection_accuracy: 96.5
  };

  // Filter plates based on active tab and search term
  const filteredPlates = localPlates
    .filter((plate: any) => {
      // Tab filter
      if (activeTab === 'whitelist' && !plate.is_whitelisted) return false;
      if (activeTab === 'blacklist' && !plate.is_blacklisted) return false;
      return true;
    })
    .filter((plate: any) =>
      plate.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plate.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddPlate = (e: React.FormEvent, type: 'whitelist' | 'blacklist') => {
    e.preventDefault();
    
    if (!newPlateData.plate_number.trim()) {
      toast.error('Please enter a license plate number');
      return;
    }

    const newPlate = {
      id: Date.now(),
      plate_number: newPlateData.plate_number.trim().toUpperCase(),
      vehicle_type: newPlateData.vehicle_type.trim() || 'Unknown',
      owner_name: newPlateData.owner_name.trim() || 'Unknown',
      description: newPlateData.description.trim() || '',
      is_whitelisted: type === 'whitelist',
      is_blacklisted: type === 'blacklist',
      last_seen: 'Never'
    };

    // Add to local state
    setLocalPlates(prev => [...prev, newPlate]);
    
    setShowAddModal(false);
    setNewPlateData({
      plate_number: '',
      vehicle_type: '',
      owner_name: '',
      description: '',
      is_whitelisted: false,
      is_blacklisted: false
    });
    toast.success('License plate added successfully!');
  };

  const handleDeletePlate = (plateId: number) => {
    if (window.confirm('Are you sure you want to remove this license plate?')) {
      // Remove from local state
      setLocalPlates(prev => prev.filter(plate => plate.id !== plateId));
      toast.success('License plate removed successfully!');
    }
  };

  // ADDED: Status toggle function
  const handleToggleStatus = (plateId: number) => {
    setLocalPlates(prev => prev.map(plate => {
      if (plate.id === plateId) {
        // Toggle between whitelist and blacklist
        return {
          ...plate,
          is_whitelisted: !plate.is_whitelisted,
          is_blacklisted: !plate.is_blacklisted
        };
      }
      return plate;
    }));
    toast.success('License plate status updated!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredPlates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `license-plates-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Registry</h2>
          <p className="mt-1 text-sm text-gray-500">Manage whitelisted and blacklisted vehicles</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => {
              setNewPlateData(prev => ({ ...prev, is_whitelisted: true, is_blacklisted: false }));
              setShowAddModal(true);
            }}
            className="btn btn-success"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Whitelist
          </button>
          <button 
            onClick={() => {
              setNewPlateData(prev => ({ ...prev, is_whitelisted: false, is_blacklisted: true }));
              setShowAddModal(true);
            }}
            className="btn btn-danger"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Blacklist
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Vehicles"
          value={stats.total_plates}
          subtitle="All registered plates"
          icon={Car}
          color="blue"
        />
        <StatsCard
          title="Whitelisted"
          value={stats.authorized_plates}
          subtitle="Authorized vehicles"
          icon={Shield}
          color="green"
        />
        <StatsCard
          title="Blacklisted"
          value={stats.blacklisted_plates}
          subtitle="Restricted vehicles"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Detection Rate"
          value={`${stats.detection_accuracy}%`}
          subtitle="Recognition accuracy"
          icon={Car}
          color="purple"
        />
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  activeTab === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Vehicles
              </button>
              <button
                onClick={() => setActiveTab('whitelist')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  activeTab === 'whitelist'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Whitelist
              </button>
              <button
                onClick={() => setActiveTab('blacklist')}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  activeTab === 'blacklist'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Blacklist
              </button>
            </div>

            {/* Search and Export */}
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button 
                onClick={handleExport}
                className="btn btn-secondary"
                disabled={!filteredPlates || filteredPlates.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plates Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>License Plate</th>
                <th>Vehicle Type</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlates.map((plate: any) => (
                <tr key={plate.id} className="hover:bg-gray-50">
                  <td className="font-mono font-semibold">{plate.plate_number}</td>
                  <td className="text-gray-600">{plate.vehicle_type || 'Unknown'}</td>
                  <td className="text-gray-600">{plate.owner_name || 'Unknown'}</td>
                  <td>
                    <span className={`badge ${
                      plate.is_whitelisted 
                        ? 'badge-success' 
                        : plate.is_blacklisted 
                        ? 'badge-danger' 
                        : 'badge-warning'
                    }`}>
                      {plate.is_whitelisted ? 'Whitelisted' : plate.is_blacklisted ? 'Blacklisted' : 'Unknown'}
                    </span>
                  </td>
                  <td className="text-gray-600">{plate.last_seen || 'Never'}</td>
                  <td>
                    <div className="flex space-x-2">
                      {/* REMOVED: Edit button */}
                      {/* ADDED: Status toggle button */}
                      <button 
                        onClick={() => handleToggleStatus(plate.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4 inline mr-1" />
                        {plate.is_whitelisted ? 'Move to Blacklist' : 'Move to Whitelist'}
                      </button>
                      <button 
                        onClick={() => handleDeletePlate(plate.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlates.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No license plates found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first license plate to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Add Plate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add to {newPlateData.is_whitelisted ? 'Whitelist' : 'Blacklist'}
            </h3>
            <form onSubmit={(e) => handleAddPlate(e, newPlateData.is_whitelisted ? 'whitelist' : 'blacklist')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlateData.plate_number}
                    onChange={(e) => setNewPlateData(prev => ({ ...prev, plate_number: e.target.value.toUpperCase() }))}
                    className="input uppercase"
                    placeholder="ABC123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    value={newPlateData.vehicle_type}
                    onChange={(e) => setNewPlateData(prev => ({ ...prev, vehicle_type: e.target.value }))}
                    className="input"
                    placeholder="Sedan, SUV, Truck..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={newPlateData.owner_name}
                    onChange={(e) => setNewPlateData(prev => ({ ...prev, owner_name: e.target.value }))}
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newPlateData.description}
                    onChange={(e) => setNewPlateData(prev => ({ ...prev, description: e.target.value }))}
                    className="input"
                    placeholder="Additional information..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`btn ${newPlateData.is_whitelisted ? 'btn-success' : 'btn-danger'}`}
                >
                  Add to {newPlateData.is_whitelisted ? 'Whitelist' : 'Blacklist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicensePlates;