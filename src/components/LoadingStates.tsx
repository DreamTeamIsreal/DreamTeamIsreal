/**
 * Loading States Component
 * 
 * Provides consistent, multilingual loading indicators throughout the app
 * Includes various loading states for different use cases
 */

import React from 'react';
import { getCurrentLanguage, getLocalizedUIMessages } from '../lib/api-fixed';

// ================================
// LOADING COMPONENT INTERFACES
// ================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface LoadingMessageProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

interface CandidateSkeletonProps {
  count?: number;
}

// ================================
// LOADING SPINNER COMPONENT
// ================================

/**
 * Simple, animated loading spinner
 * Works without external icon dependencies
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

// ================================
// LOADING MESSAGE COMPONENT  
// ================================

/**
 * Loading message with optional spinner
 * Automatically uses localized text
 */
export const LoadingMessage: React.FC<LoadingMessageProps> = ({
  message,
  showSpinner = true,
  className = ''
}) => {
  const messages = getLocalizedUIMessages();
  const currentLang = getCurrentLanguage();
  const isRTL = ['he', 'ar'].includes(currentLang);
  const displayMessage = message || messages.loading || 'Loading...';

  return (
    <div 
      className={`flex items-center gap-3 ${isRTL ? 'rtl' : 'ltr'} ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {showSpinner && <LoadingSpinner size="sm" />}
      <span className="text-gray-600">{displayMessage}</span>
    </div>
  );
};

// ================================
// SKELETON LOADING COMPONENT
// ================================

/**
 * Skeleton loading placeholder
 * Better perceived performance than spinners
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = false
}) => {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width: widthStyle, height: heightStyle }}
      role="status"
      aria-label="Loading content"
    />
  );
};

// ================================
// CANDIDATE CARD SKELETON
// ================================

/**
 * Skeleton loading for candidate cards
 * Matches the actual candidate card layout
 */
export const CandidateSkeleton: React.FC<CandidateSkeletonProps> = ({ 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          {/* Profile Image */}
          <div className="flex items-center gap-4">
            <Skeleton width={64} height={64} rounded className="flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton width="70%" height={20} />
              <Skeleton width="50%" height={16} />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <Skeleton width="100%" height={16} />
            <Skeleton width="85%" height={16} />
            <Skeleton width="60%" height={16} />
          </div>

          {/* Match Score */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Skeleton width={80} height={20} />
            <Skeleton width={60} height={32} rounded />
          </div>
        </div>
      ))}
    </>
  );
};

// ================================
// FULL PAGE LOADING
// ================================

/**
 * Full page loading overlay
 * Used for major page transitions
 */
export const FullPageLoading: React.FC<{ message?: string }> = ({ message }) => {
  const messages = getLocalizedUIMessages();
  const currentLang = getCurrentLanguage();
  const isRTL = ['he', 'ar'].includes(currentLang);
  const displayMessage = message || messages.loading || 'Loading...';

  return (
    <div 
      className={`fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 text-lg font-medium">{displayMessage}</p>
      </div>
    </div>
  );
};

// ================================
// QUIZ QUESTION SKELETON
// ================================

/**
 * Skeleton loading for quiz questions
 */
export const QuizQuestionSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
      {/* Question Number */}
      <Skeleton width={100} height={20} />
      
      {/* Question Text */}
      <div className="space-y-3">
        <Skeleton width="100%" height={24} />
        <Skeleton width="80%" height={24} />
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton width={20} height={20} rounded />
            <Skeleton width="60%" height={18} />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-100">
        <Skeleton width={80} height={40} />
        <Skeleton width={80} height={40} />
      </div>
    </div>
  );
};

// ================================
// LOADING STATES FOR DATA LISTS
// ================================

/**
 * Loading state for data tables or lists
 */
export const ListLoadingState: React.FC<{ 
  rows?: number;
  message?: string;
}> = ({ rows = 5, message }) => {
  const messages = getLocalizedUIMessages();
  const displayMessage = message || messages.loading || 'Loading...';

  return (
    <div className="space-y-4">
      {/* Loading Message */}
      <LoadingMessage message={displayMessage} />
      
      {/* Skeleton Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Skeleton width={40} height={40} rounded />
            <div className="flex-1 space-y-2">
              <Skeleton width="40%" height={16} />
              <Skeleton width="70%" height={14} />
            </div>
            <Skeleton width={60} height={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ================================
// BUTTON LOADING STATE
// ================================

/**
 * Loading state for buttons
 * Maintains button size while showing loading
 */
export const ButtonLoading: React.FC<{
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
}> = ({ children, isLoading, className = '', disabled = false }) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center gap-2 transition-all ${
        isLoading ? 'cursor-not-allowed opacity-70' : ''
      } ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// ================================
// EXPORTS
// ================================

export default {
  LoadingSpinner,
  LoadingMessage,
  Skeleton,
  CandidateSkeleton,
  FullPageLoading,
  QuizQuestionSkeleton,
  ListLoadingState,
  ButtonLoading
};