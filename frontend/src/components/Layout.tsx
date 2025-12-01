import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'; // Add Outlet
import { useAuth } from '../hooks/useAuth';
import { 
  Camera, 
  Car, 
  Eye, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  Shield,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode; // Make children optional
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    
    { name: 'Live Monitor', href: '/detections', icon: Eye, roles: ['viewer', 'operator', 'admin'] },
    { name: 'Camera Systems', href: '/cameras', icon: Camera, roles: ['admin'] },
    { name: 'Vehicle Registry', href: '/plates', icon: Car, roles: ['admin'] },
    { name: 'System Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || 'viewer')
  );
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Get current page title from filtered navigation
  const currentPage = filteredNavigation.find(item => isActive(item.href));

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'linear-gradient(to bottom, #1e3a8a, #1e40af)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-white border-opacity-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-white font-bold text-lg">SVA</span>
              </div>
            </div>

            {/* Navigation - Use filteredNavigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {filteredNavigation.map((item) => { // Changed from navigation to filteredNavigation
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${active
                        ? 'bg-white bg-opacity-10 text-white border-l-4 border-white'
                        : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10 border-l-4 border-transparent'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-white border-opacity-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user?.username}
                  </p>
                  <p className="text-blue-200 text-xs truncate capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-blue-200 hover:text-white transition-colors duration-200 flex-shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center min-w-0">
                <button
                  type="button"
                  className="lg:hidden -ml-2 mr-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {currentPage?.name || 'Dashboard'} {/* Use currentPage */}
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Smart Vehicle Access System
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700 text-sm font-medium">System Online</span>
                </div>
                
                <button className="relative w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content - Use Outlet for nested routes */}
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            <Outlet /> {/* This renders the nested route components */}
            {children} {/* Keep children for backward compatibility */}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;