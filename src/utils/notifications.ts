/**
 * Notification Utility for DreamTeamIsrael Platform
 * 
 * Provides a clean replacement for alert() calls with better UX.
 * This utility handles notifications without complex React dependencies.
 * 
 * Features:
 * - Replace alert() with proper notifications
 * - Localized messages support
 * - Different notification types
 * - Auto-dismiss functionality
 * - Stack management
 */

// ================================
// TYPES AND INTERFACES
// ================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  type?: NotificationType;
  duration?: number; // in milliseconds, 0 for no auto-dismiss
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  dismissible?: boolean;
}

interface NotificationElement {
  id: string;
  element: HTMLElement;
  timeoutId?: number;
}

// ================================
// NOTIFICATION MANAGER CLASS
// ================================

class SimpleNotificationManager {
  private notifications: Map<string, NotificationElement> = new Map();
  private container: HTMLElement | null = null;
  private nextId = 1;

  /**
   * Initialize the notification container
   */
  private ensureContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
        max-width: 400px;
      `;
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  /**
   * Get notification colors based on type
   */
  private getNotificationStyles(type: NotificationType): string {
    const baseStyles = `
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      pointer-events: auto;
      transform: translateX(100%);
      transition: all 0.3s ease;
      border-left: 4px solid;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 14px;
      line-height: 1.4;
    `;

    const typeStyles = {
      success: `
        border-left-color: #10b981;
        background: #f0fdf4;
        color: #064e3b;
      `,
      error: `
        border-left-color: #ef4444;
        background: #fef2f2;
        color: #7f1d1d;
      `,
      warning: `
        border-left-color: #f59e0b;
        background: #fffbeb;
        color: #78350f;
      `,
      info: `
        border-left-color: #3b82f6;
        background: #eff6ff;
        color: #1e3a8a;
      `
    };

    return baseStyles + typeStyles[type];
  }

  /**
   * Get icon for notification type
   */
  private getIcon(type: NotificationType): string {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || 'ℹ';
  }

  /**
   * Create notification HTML element
   */
  private createNotificationElement(
    message: string, 
    type: NotificationType, 
    dismissible: boolean
  ): { notification: HTMLElement; closeButton?: HTMLElement } {
    const notification = document.createElement('div');
    notification.style.cssText = this.getNotificationStyles(type);

    const icon = document.createElement('div');
    icon.style.cssText = `
      font-size: 16px;
      font-weight: bold;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    icon.textContent = this.getIcon(type);

    const content = document.createElement('div');
    content.style.cssText = 'flex: 1; min-width: 0;';
    content.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(content);

    if (dismissible) {
      const closeButton = document.createElement('button');
      closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: opacity 0.2s;
      `;
      closeButton.innerHTML = '×';
      closeButton.title = 'Dismiss';
      closeButton.addEventListener('mouseenter', () => {
        closeButton.style.opacity = '1';
      });
      closeButton.addEventListener('mouseleave', () => {
        closeButton.style.opacity = '0.7';
      });

      notification.appendChild(closeButton);
      return { notification, closeButton };
    }

    return { notification };
  }

  /**
   * Show a notification
   */
  show(message: string, options: NotificationOptions = {}): string {
    const {
      type = 'info',
      duration = 5000,
      dismissible = true
    } = options;

    const container = this.ensureContainer();
    const id = `notification-${this.nextId++}`;

    const { notification, closeButton } = this.createNotificationElement(message, type, dismissible);

    // Add to container
    container.appendChild(notification);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Setup auto-dismiss
    let timeoutId: number | undefined;
    if (duration > 0) {
      timeoutId = window.setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    // Setup manual dismiss
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.remove(id);
      });
    }

    // Store notification
    this.notifications.set(id, {
      id,
      element: notification,
      timeoutId
    });

    return id;
  }

  /**
   * Remove a notification
   */
  remove(id: string): void {
    const notificationData = this.notifications.get(id);
    if (!notificationData) return;

    const { element, timeoutId } = notificationData;

    // Clear timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Animate out
    element.style.transform = 'translateX(100%)';
    element.style.opacity = '0';

    // Remove from DOM after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.notifications.delete(id);

      // Clean up container if empty
      if (this.notifications.size === 0 && this.container) {
        this.container.style.display = 'none';
      }
    }, 300);
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications.forEach((_, id) => {
      this.remove(id);
    });
  }

  /**
   * Convenience methods for different types
   */
  success(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { 
      ...options, 
      type: 'error',
      duration: options?.duration ?? 0 // Errors don't auto-dismiss by default
    });
  }

  warning(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options?: Omit<NotificationOptions, 'type'>): string {
    return this.show(message, { ...options, type: 'info' });
  }
}

// ================================
// SINGLETON INSTANCE
// ================================

export const notifications = new SimpleNotificationManager();

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Enhanced replacement for window.alert()
 * Use this to replace alert() calls throughout the app
 */
export const showAlert = (
  message: string, 
  type: NotificationType = 'info'
): string => {
  return notifications.show(message, { type });
};

/**
 * Show success notification
 */
export const showSuccess = (message: string): string => {
  return notifications.success(message);
};

/**
 * Show error notification
 */
export const showError = (message: string): string => {
  return notifications.error(message);
};

/**
 * Show warning notification
 */
export const showWarning = (message: string): string => {
  return notifications.warning(message);
};

/**
 * Show info notification
 */
export const showInfo = (message: string): string => {
  return notifications.info(message);
};

/**
 * Clear all notifications
 */
export const clearNotifications = (): void => {
  notifications.clear();
};

// ================================
// GLOBAL ALERT REPLACEMENT
// ================================

/**
 * Override the global alert function for better UX
 * This can be called during app initialization
 */
export const replaceGlobalAlert = (): void => {
  if (typeof window !== 'undefined') {
    const originalAlert = window.alert;
    
    window.alert = (message?: any) => {
      console.warn('alert() called - consider using notifications.show() instead');
      const messageStr = String(message || '');
      notifications.info(messageStr, { duration: 0 });
    };

    // Store original for restoration if needed
    (window as any).__originalAlert = originalAlert;
  }
};

/**
 * Restore the original alert function
 */
export const restoreGlobalAlert = (): void => {
  if (typeof window !== 'undefined' && (window as any).__originalAlert) {
    window.alert = (window as any).__originalAlert;
    delete (window as any).__originalAlert;
  }
};

// ================================
// USAGE EXAMPLES
// ================================

/*
// Basic usage
notifications.success('Operation completed successfully!');
notifications.error('Something went wrong.');
notifications.warning('Please check your input.');
notifications.info('Welcome to the platform!');

// Custom duration
notifications.show('This will disappear in 3 seconds', { 
  type: 'info', 
  duration: 3000 
});

// Persistent notification (won't auto-dismiss)
notifications.show('Important: Read this carefully', { 
  type: 'warning', 
  duration: 0 
});

// Replace alert() calls
showAlert('This replaces alert()');
showSuccess('Success message');
showError('Error message');

// Clear all notifications
clearNotifications();
*/