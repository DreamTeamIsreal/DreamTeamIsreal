import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import apiService from '../lib/api';

interface HealthStatus {
  isHealthy: boolean;
  message: string;
  version: string;
  timestamp?: string;
  isUsingMockData: boolean;
}

const ApiHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<HealthStatus>({
    isHealthy: false,
    message: 'Checking...',
    version: 'Unknown',
    isUsingMockData: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.healthCheck();
        
        const isUsingMock = response.message.includes('Mock') || response.version.includes('mock');
        
        setStatus({
          isHealthy: response.success,
          message: response.message,
          version: response.version,
          timestamp: new Date().toISOString(),
          isUsingMockData: isUsingMock
        });
      } catch (error) {
        setStatus({
          isHealthy: false,
          message: 'Connection failed - using mock data fallback',
          version: 'Mock fallback',
          isUsingMockData: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 animate-spin text-gray-500" />;
    }
    
    if (status.isHealthy && !status.isUsingMockData) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (status.isUsingMockData) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isLoading) return 'bg-gray-50 border-gray-200';
    if (status.isHealthy && !status.isUsingMockData) return 'bg-green-50 border-green-200';
    if (status.isUsingMockData) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking API...';
    if (status.isHealthy && !status.isUsingMockData) return 'API Connected';
    if (status.isUsingMockData) return 'Using Mock Data';
    return 'API Disconnected';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor()} transition-colors duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">API Status</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="mt-3 text-sm text-gray-700">
        <p><strong>Message:</strong> {status.message}</p>
        <p><strong>Version:</strong> {status.version}</p>
        {status.timestamp && (
          <p><strong>Last Check:</strong> {new Date(status.timestamp).toLocaleTimeString()}</p>
        )}
        {status.isUsingMockData && (
          <div className="mt-2 p-2 bg-yellow-100 rounded text-yellow-800">
            <p className="text-xs">
              <strong>Note:</strong> The backend API is not available. The application is running with 
              mock data for demonstration purposes. All data shown is sample data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiHealthCheck;