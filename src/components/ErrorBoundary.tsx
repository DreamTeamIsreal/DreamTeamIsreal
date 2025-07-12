/**
 * Enhanced Error Boundary Component
 * 
 * Provides comprehensive error handling with:
 * - Multilingual error messages
 * - User-friendly error displays
 * - Recovery options
 * - Error reporting capabilities
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { getCurrentLanguage, getLocalizedUIMessages } from '../lib/api-fixed';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
}

/**
 * Enhanced Error Boundary with multilingual support
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    };
  }

  /**
   * React lifecycle method - called when an error occurs
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      isRetrying: false
    };
  }

  /**
   * React lifecycle method - called after an error has been caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service (in production)
    this.reportError(error, errorInfo);
  }

  /**
   * Reports errors to monitoring service
   * In production, this would send to services like Sentry, LogRocket, etc.
   */
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In development, just log
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Boundary Report');
        console.error('Error:', error);
        console.error('Component Stack:', errorInfo.componentStack);
        console.error('Error Boundary Stack:', error.stack);
        console.groupEnd();
        return;
      }

      // In production, send to monitoring service
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  /**
   * Attempts to recover from the error by resetting state
   */
  private handleRetry = async () => {
    this.setState({ isRetrying: true });
    
    try {
      // Wait a bit to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false
      });
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      this.setState({ isRetrying: false });
    }
  };

  /**
   * Navigates to home page
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Gets error details for technical users
   */
  private getErrorDetails = () => {
    const { error, errorInfo } = this.state;
    if (!error || !errorInfo) return null;

    return {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    };
  };

  /**
   * Renders the error UI
   */
  private renderErrorUI = () => {
    const { isRetrying } = this.state;
    const messages = getLocalizedUIMessages();
    const currentLang = getCurrentLanguage();
    const isRTL = ['he', 'ar'].includes(currentLang);

    return (
      <div 
        className={`min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {messages.error || 'Something went wrong'}
            </h1>
            <p className="text-gray-600">
              {messages.errorDescription || 'An unexpected error occurred. Please try again or return to the home page.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              disabled={isRetrying}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isRetrying ? 'animate-pulse' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? (messages.retrying || 'Retrying...') : (messages.tryAgain || 'Try Again')}
            </button>

            <button
              onClick={this.handleGoHome}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              {messages.goHome || 'Go to Home'}
            </button>
          </div>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Technical Details (Dev Only)
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 overflow-auto max-h-40">
                <pre>{JSON.stringify(this.getErrorDetails(), null, 2)}</pre>
              </div>
            </details>
          )}

          {/* Help Text */}
          <p className="mt-6 text-xs text-gray-400">
            {messages.errorHelpText || 'If this problem persists, please contact support.'}
          </p>
        </div>
      </div>
    );
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided, otherwise use default error UI
      return fallback || this.renderErrorUI();
    }

    return children;
  }
}

export default ErrorBoundary;