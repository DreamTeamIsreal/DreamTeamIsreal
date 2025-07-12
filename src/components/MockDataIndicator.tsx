/**
 * Mock Data Indicator Component
 * 
 * Shows a user-friendly notification when the app is using mock data
 * instead of real API responses. Provides localized messages and 
 * clear visual indicators for better UX.
 */

import { useState, useEffect } from 'react';
import { getCurrentLanguage, getLocalizedUIMessages } from '../lib/api-fixed';

// ================================
// COMPONENT INTERFACES
// ================================

interface MockDataIndicatorProps {
  /** Whether to show the indicator */
  isVisible: boolean;
  /** Custom message to display */
  message?: string;
  /** Position of the indicator */
  position?: 'top' | 'bottom';
  /** Whether the indicator can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Custom className */
  className?: string;
}

interface MockDataBadgeProps {
  /** Whether to show the badge */
  show: boolean;
  /** Custom text for the badge */
  text?: string;
  /** Badge variant */
  variant?: 'warning' | 'info';
}

// ================================
// MOCK DATA INDICATOR COMPONENT
// ================================

/**
 * Main Mock Data Indicator Component
 * Shows a notification bar when mock data is being used
 */
export const MockDataIndicator: React.FC<MockDataIndicatorProps> = ({
  isVisible,
  message,
  position = 'top',
  dismissible = true,
  onDismiss,
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Get localized messages
  const messages = getLocalizedUIMessages();
  const currentLang = getCurrentLanguage();
  const isRTL = ['he', 'ar'].includes(currentLang);
  
  // Use custom message or default localized message
  const displayMessage = message || messages.mockDataNote || 
    'The backend server is not available. Showing sample data.';

  // Handle dismiss action
  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsDismissed(true);
      onDismiss?.();
    }, 300);
  };

  // Reset dismissed state when visibility changes
  useEffect(() => {
    if (isVisible && isDismissed) {
      setIsDismissed(false);
      setIsAnimating(false);
    }
  }, [isVisible, isDismissed]);

  // Don't render if not visible or dismissed
  if (!isVisible || isDismissed) {
    return null;
  }

  const positionClasses = position === 'top' 
    ? 'top-0' 
    : 'bottom-0';

  return (
    <div
      className={`fixed left-0 right-0 ${positionClasses} z-40 transition-transform duration-300 ${
        isAnimating ? 'transform -translate-y-full' : ''
      } ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Icon and Message */}
          <div className="flex items-center gap-3">
            {/* Warning Icon (CSS-based, no external dependencies) */}
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            
            {/* Message */}
            <div className="flex-1">
              <p className="text-yellow-800 text-sm font-medium">
                {displayMessage}
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 rounded-md hover:bg-yellow-100"
              aria-label={messages.dismiss || 'Dismiss'}
              title={messages.dismiss || 'Dismiss'}
            >
              {/* X icon (CSS-based) */}
              <div className="w-4 h-4 relative">
                <span className="absolute inset-0 flex items-center justify-center text-lg leading-none">
                  ×
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ================================
// MOCK DATA BADGE COMPONENT
// ================================

/**
 * Small badge indicator for mock data
 * Can be used inline with other components
 */
export const MockDataBadge: React.FC<MockDataBadgeProps> = ({
  show,
  text,
  variant = 'warning'
}) => {
  if (!show) return null;

  const messages = getLocalizedUIMessages();
  const currentLang = getCurrentLanguage();
  const isRTL = ['he', 'ar'].includes(currentLang);
  
  const displayText = text || messages.usingMockData || 'Sample Data';
  
  const variantClasses = {
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
        variantClasses[variant]
      } ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Dot indicator */}
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
      }`} />
      {displayText}
    </span>
  );
};

// ================================
// HOOK FOR MANAGING MOCK DATA STATE
// ================================

/**
 * Custom hook for managing mock data indicator state
 * Automatically detects when mock data is being used
 */
export const useMockDataIndicator = () => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [mockDataMessage, setMockDataMessage] = useState<string>('');

  /**
   * Call this when an API response indicates mock data usage
   */
  const showMockDataIndicator = (message?: string) => {
    const messages = getLocalizedUIMessages();
    setMockDataMessage(message || messages.mockDataNote || 'Using sample data');
    setShowIndicator(true);
  };

  /**
   * Hide the mock data indicator
   */
  const hideMockDataIndicator = () => {
    setShowIndicator(false);
  };

  /**
   * Check if a response indicates mock data usage
   */
  const checkForMockData = (response: any) => {
    if (response?.isUsingMockData) {
      showMockDataIndicator(response.message);
      return true;
    }
    return false;
  };

  return {
    showIndicator,
    mockDataMessage,
    showMockDataIndicator,
    hideMockDataIndicator,
    checkForMockData
  };
};

// ================================
// MOCK DATA STATUS COMPONENT
// ================================

/**
 * Status component showing current data source
 * Useful for admin/debug interfaces
 */
export const MockDataStatus: React.FC<{
  isUsingMockData: boolean;
  className?: string;
}> = ({ isUsingMockData, className = '' }) => {
  const messages = getLocalizedUIMessages();
  const currentLang = getCurrentLanguage();
  const isRTL = ['he', 'ar'].includes(currentLang);

  const statusConfig = isUsingMockData 
    ? {
        color: 'yellow',
        text: messages.usingMockData || 'Mock Data',
        icon: '⚠️'
      }
    : {
        color: 'green', 
        text: messages.liveData || 'Live Data',
        icon: '✅'
      };

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
        isUsingMockData 
          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
          : 'bg-green-50 text-green-700 border-green-200'
      } ${className} ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <span>{statusConfig.icon}</span>
      <span className="font-medium">{statusConfig.text}</span>
    </div>
  );
};

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Utility function to create a mock data aware fetch wrapper
 */
export const createMockDataAwareFetch = () => {
  const { checkForMockData } = useMockDataIndicator();
  
  return async (fetchFn: () => Promise<any>) => {
    try {
      const response = await fetchFn();
      checkForMockData(response);
      return response;
    } catch (error) {
      // If fetch fails, we're likely using mock data
      checkForMockData({ isUsingMockData: true });
      throw error;
    }
  };
};

// ================================
// EXPORTS
// ================================

export default MockDataIndicator;