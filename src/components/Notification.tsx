/**
 * Notification System Component
 * 
 * Provides a modern, accessible notification system to replace alert() calls.
 * Features:
 * - Auto-dismiss with configurable duration
 * - Multiple notification types (success, error, warning, info)
 * - RTL language support
 * - Localized messages
 * - Stack management for multiple notifications
 * - Accessibility features (screen reader support)
 * - Smooth animations and transitions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// ================================
// TYPES AND INTERFACES
// ================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // Duration in milliseconds, 0 for no auto-dismiss
  actions?: NotificationAction[];
  dismissible?: boolean;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  style?: 'primary' | 'secondary';
}

interface NotificationItemProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
  isRTL: boolean;
}

// ================================
// NOTIFICATION MANAGER (SINGLETON)
// ================================

class NotificationManager {
  private listeners: Set<(notifications: NotificationData[]) => void> = new Set();
  private notifications: NotificationData[] = [];

  /**
   * Subscribe to notification updates
   */
  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of updates
   */
  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  /**
   * Add a new notification
   */
  add(notification: Omit<NotificationData, 'id'>): string {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const fullNotification: NotificationData = {
      id,
      duration: 5000, // Default 5 seconds
      dismissible: true,
      ...notification,
    };

    this.notifications.push(fullNotification);
    this.notify();

    // Auto-dismiss if duration is set
    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, fullNotification.duration);
    }

    return id;
  }

  /**
   * Remove a notification by ID
   */
  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  /**
   * Clear all notifications
   */
  clear() {
    this.notifications = [];
    this.notify();
  }

  /**
   * Show success notification
   */
  success(message: string, options?: Partial<NotificationData>) {
    return this.add({ type: 'success', message, ...options });
  }

  /**
   * Show error notification
   */
  error(message: string, options?: Partial<NotificationData>) {
    return this.add({ 
      type: 'error', 
      message, 
      duration: 0, // Errors don't auto-dismiss by default
      ...options 
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, options?: Partial<NotificationData>) {
    return this.add({ type: 'warning', message, ...options });
  }

  /**
   * Show info notification
   */
  info(message: string, options?: Partial<NotificationData>) {
    return this.add({ type: 'info', message, ...options });
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// ================================
// INDIVIDUAL NOTIFICATION COMPONENT
// ================================

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onDismiss, 
  isRTL 
}) => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Animation effect
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle dismiss with exit animation
   */
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Match CSS transition duration
  }, [notification.id, onDismiss]);

  /**
   * Get notification icon based on type
   */
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  /**
   * Get notification colors based on type
   */
  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          button: 'hover:bg-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          button: 'hover:bg-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          button: 'hover:bg-yellow-100'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          button: 'hover:bg-blue-100'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          button: 'hover:bg-gray-100'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`
        max-w-sm w-full border rounded-lg shadow-lg p-4 mb-3
        transform transition-all duration-300 ease-in-out
        ${colors.bg} ${colors.text}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 
          isRTL ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
      role="alert"
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Icon */}
        <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${colors.icon}`}>
          <span className="text-lg font-bold" aria-hidden="true">
            {getIcon()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-semibold text-sm mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-sm">
            {notification.message}
          </p>

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className={`mt-3 flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`
                    px-3 py-1 text-xs font-medium rounded transition-colors
                    ${action.style === 'primary' 
                      ? `${colors.icon} bg-white border` 
                      : `${colors.text} ${colors.button}`
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {notification.dismissible && (
          <button
            onClick={handleDismiss}
            className={`
              flex-shrink-0 w-6 h-6 flex items-center justify-center
              rounded transition-colors ${colors.button}
            `}
            aria-label={t('dismiss')}
            title={t('dismiss')}
          >
            <span className="text-lg leading-none" aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ================================
// MAIN NOTIFICATION CONTAINER
// ================================

export const NotificationContainer: React.FC = () => {
  const { i18n } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const isRTL = i18n.dir() === 'rtl';

  // Subscribe to notification updates
  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-4 z-50 pointer-events-none
        ${isRTL ? 'left-4' : 'right-4'}
      `}
      aria-live="polite"
      aria-label="Notifications"
    >
      <div className="space-y-2 pointer-events-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={notificationManager.remove.bind(notificationManager)}
            isRTL={isRTL}
          />
        ))}
      </div>
    </div>
  );
};

// ================================
// UTILITY HOOKS
// ================================

/**
 * Hook for easy notification usage in components
 */
export const useNotifications = () => {
  const { t } = useTranslation('common');

  return {
    // Basic notification methods
    success: (message: string, options?: Partial<NotificationData>) => 
      notificationManager.success(message, options),
    
    error: (message: string, options?: Partial<NotificationData>) => 
      notificationManager.error(message, options),
    
    warning: (message: string, options?: Partial<NotificationData>) => 
      notificationManager.warning(message, options),
    
    info: (message: string, options?: Partial<NotificationData>) => 
      notificationManager.info(message, options),

    // Localized convenience methods
    showSuccess: (translationKey?: string) => 
      notificationManager.success(t(translationKey || 'submitSuccess')),
    
    showError: (translationKey?: string) => 
      notificationManager.error(t(translationKey || 'submitError')),
    
    showSaveSuccess: () => 
      notificationManager.success(t('saveSuccess')),
    
    showSaveError: () => 
      notificationManager.error(t('saveError')),

    // Management methods
    clear: () => notificationManager.clear(),
    remove: (id: string) => notificationManager.remove(id),

    // Replace alert() with proper notification
    alert: (message: string, type: NotificationType = 'info') => {
      console.warn('Using notification.alert() - consider using specific type methods');
      return notificationManager.add({ type, message });
    }
  };
};

// ================================
// REPLACEMENT FOR ALERT()
// ================================

/**
 * Global replacement for window.alert()
 * Use this to gradually replace alert() calls throughout the app
 */
export const showAlert = (
  message: string, 
  type: NotificationType = 'info',
  options?: Partial<NotificationData>
) => {
  return notificationManager.add({ type, message, ...options });
};

export default NotificationContainer;