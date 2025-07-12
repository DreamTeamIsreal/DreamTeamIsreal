import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import apiService from '../lib/api';

interface RegistrationFormData {
  israelId: string;
  email: string;
  mobilePhoneNumber: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dateOfBirth: string;
  city: string;
}

interface ValidationErrors {
  israelId?: string;
  email?: string;
  mobilePhoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  dateOfBirth?: string;
  city?: string;
}

interface RegistrationFormProps {
  onSuccess?: (userId: string) => void;
  onError?: (error: string) => void;
  isMockMode?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onError,
  isMockMode = false
}) => {
  const { t, i18n } = useTranslation(['registration', 'common']);
  const rtl = i18n.dir() === 'rtl';

  const [formData, setFormData] = useState<RegistrationFormData>({
    israelId: '',
    email: '',
    mobilePhoneNumber: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    city: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Real-time validation
  useEffect(() => {
    const newErrors: ValidationErrors = {};

    // Israel ID validation (9 digits)
    if (formData.israelId && !/^\d{9}$/.test(formData.israelId)) {
      newErrors.israelId = t('validation.invalidIsraelId');
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    // Phone validation (Israeli format)
    if (formData.mobilePhoneNumber && !/^05\d{8}$/.test(formData.mobilePhoneNumber)) {
      newErrors.mobilePhoneNumber = t('validation.invalidPhone');
    }

    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = t('validation.passwordTooShort');
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = t('validation.passwordComplexity');
      }
    }

    // Confirm password validation
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsDoNotMatch');
    }

    // Name validation
    if (formData.fullName && formData.fullName.trim().length < 2) {
      newErrors.fullName = t('validation.nameTooShort');
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 120) {
        newErrors.dateOfBirth = t('validation.invalidAge');
      }
    }

    // City validation
    if (formData.city && formData.city.trim().length < 2) {
      newErrors.city = t('validation.cityTooShort');
    }

    setErrors(newErrors);

    // Check if form is valid
    const hasAllRequiredFields = Object.values(formData).every(value => value.trim() !== '');
    const hasNoErrors = Object.keys(newErrors).length === 0;
    setIsValid(hasAllRequiredFields && hasNoErrors);
  }, [formData, t]);

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isMockMode) {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate success response
        const mockUserId = 'mock-user-' + Date.now();
        onSuccess?.(mockUserId);
      } else {
        // Real API call
        const response = await apiService.register({
          israelId: formData.israelId,
          email: formData.email,
          mobilePhoneNumber: formData.mobilePhoneNumber,
          password: formData.password,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          city: formData.city
        });

        if (response.success) {
          onSuccess?.(response.data?.userId || '');
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      return 'error';
    }
    if (formData[field as keyof RegistrationFormData]) {
      return 'success';
    }
    return 'neutral';
  };

  const renderFieldIcon = (field: keyof ValidationErrors) => {
    const status = getFieldStatus(field);
    
    if (status === 'error') {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (status === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Israel ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.israelId')} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.israelId}
              onChange={(e) => handleInputChange('israelId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('israelId') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('israelId') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder="123456789"
              maxLength={9}
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderFieldIcon('israelId')}
            </div>
          </div>
          {errors.israelId && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.israelId}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.fullName')} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('fullName') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('fullName') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder={t('fields.fullNamePlaceholder')}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderFieldIcon('fullName')}
            </div>
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.fullName}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.email')} *
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('email') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('email') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder="user@example.com"
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderFieldIcon('email')}
            </div>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.mobilePhone')} *
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formData.mobilePhoneNumber}
              onChange={(e) => handleInputChange('mobilePhoneNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('mobilePhoneNumber') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('mobilePhoneNumber') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder="0501234567"
              maxLength={10}
              dir="ltr"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderFieldIcon('mobilePhoneNumber')}
            </div>
          </div>
          {errors.mobilePhoneNumber && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.mobilePhoneNumber}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.dateOfBirth')} *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('dateOfBirth') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('dateOfBirth') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderFieldIcon('dateOfBirth')}
            </div>
          </div>
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.city')} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('city') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('city') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder={t('fields.cityPlaceholder')}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderFieldIcon('city')}
            </div>
          </div>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.city}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.password')} *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('password') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('password') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder="••••••••"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {t('validation.passwordRequirements')}
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.confirmPassword')} *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                getFieldStatus('confirmPassword') === 'error' 
                  ? 'border-red-300 bg-red-50' 
                  : getFieldStatus('confirmPassword') === 'success'
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300'
              }`}
              placeholder="••••••••"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
          isValid && !isSubmitting
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {isMockMode ? t('submittingMock') : t('submitting')}
          </div>
        ) : (
          t('submit')
        )}
      </button>

      {/* Mock Mode Indicator */}
      {isMockMode && (
        <div className="text-center">
          <p className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
            {t('mockModeIndicator')}
          </p>
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;