import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Vote, BarChart, ArrowLeft, Phone, Mail, Calendar, MapPin, CheckCircle, Search } from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';
import { districts, settlements, getDistrictBySettlement, searchSettlements } from '../lib/districtData';
import { useTranslation, Trans } from 'react-i18next';
import RegistrationForm from '../components/RegistrationForm';

const PlatformEntry = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['platformEntry', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const [step, setStep] = useState(1);
  const [isMockMode, setIsMockMode] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [settlementSearch, setSettlementSearch] = useState('');
  const [filteredSettlements, setFilteredSettlements] = useState(settlements);
  const [showSettlementDropdown, setShowSettlementDropdown] = useState(false);

  // Check if user is already registered
  useEffect(() => {
    const isUserRegistered = localStorage.getItem('userRegistered') === 'true';
    if (isUserRegistered) {
      setStep(2); // Skip to platform selection
    }
  }, []);

  useEffect(() => {
    if (settlementSearch) {
      const filtered = searchSettlements(settlementSearch);
      setFilteredSettlements(filtered);
    } else {
      setFilteredSettlements(settlements.slice(0, 10)); // Show top 10 by default
    }
  }, [settlementSearch]);

  const handleRegistrationSuccess = (userId: string) => {
    localStorage.setItem('userRegistered', 'true');
    localStorage.setItem('userId', userId);
    setStep(2); // Move to platform selection
  };

  const handleRegistrationError = (error: string) => {
    setRegistrationError(error);
  };

  const navigateToSection = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const platformOptions = useMemo(() => [
    {
      icon: User,
      title: t('platformEntry:platformOptions.option1.title'),
      description: t('platformEntry:platformOptions.option1.description'),
      path: "/candidate-submission",
      color: "from-blue-500 to-blue-600",
      gradient: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      icon: Vote,
      title: t('platformEntry:platformOptions.option2.title'),
      description: t('platformEntry:platformOptions.option2.description'),
      path: "/team-builder",
      color: "from-green-500 to-green-600",
      gradient: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      icon: BarChart,
      title: t('platformEntry:platformOptions.option3.title'),
      description: t('platformEntry:platformOptions.option3.description'),
      path: "/data-visualization",
      color: "from-purple-500 to-purple-600",
      gradient: "bg-gradient-to-br from-purple-50 to-purple-100"
    }
  ], [t]);

  // If user is already registered, show platform selection directly
  const isUserRegistered = localStorage.getItem('userRegistered') === 'true';
  const userId = localStorage.getItem('userId');

  return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <PlatformHeader />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {step < 3 && !isUserRegistered && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">{t('platformEntry:secureEntryTag')}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {step === 1 ? t('platformEntry:registration.title') : t('platformEntry:questionnaire.mainTitle')}
                </h1>
                <p className="text-lg text-gray-600">
                  {step === 1 ? t('platformEntry:registration.subtitle') : t('platformEntry:questionnaire.subtitle')}
                </p>
              </div>
          )}

          {/* Step 1: Registration - Only show if not registered */}
          {step === 1 && !isUserRegistered && (
              <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
                {/* Mock Mode Toggle */}
                <div className="mb-6 text-center">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMockMode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setIsMockMode(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      {t('platformEntry:mockModeToggle')}
                    </span>
                  </label>
                </div>

                {/* Error Display */}
                {registrationError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm">{registrationError}</p>
                  </div>
                )}

                {/* Registration Form */}
                <RegistrationForm
                  onSuccess={handleRegistrationSuccess}
                  onError={handleRegistrationError}
                  isMockMode={isMockMode}
                />
              </div>
          )}

          {/* Step 2: Platform Selection - Show for registered users or after completion */}
          {(step === 2 || isUserRegistered) && (
              <div className="text-center">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full px-8 py-4 shadow-lg mb-6">
                    <CheckCircle className="w-8 h-8" />
                    <span className="font-bold text-xl">
                  {isUserRegistered ? t('platformEntry:welcomeBack', { name: t('platformEntry:user') }) : t('platformEntry:registrationComplete')}
                </span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {isUserRegistered ? t('platformEntry:chooseActionRegistered') : t('platformEntry:welcomeToPlatform')}
                  </h1>
                                    <p className="text-xl text-gray-600">
                    {isUserRegistered ? t('platformEntry:whatToDoToday') : t('platformEntry:chooseAction')}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {platformOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigateToSection(option.path)}
                            className={`group ${option.gradient} rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-white/50`}
                        >
                          <div className={`w-20 h-20 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <IconComponent className="w-10 h-10 text-white" />
                          </div>

                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {option.title}
                          </h3>

                          <p className="text-gray-700 leading-relaxed text-lg">
                            {option.description}
                          </p>

                          <div className="mt-6">
                            <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${option.color} text-white px-6 py-3 rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300`}>
                              <span>{t('platformEntry:platformOptions.startButton')}</span>
                              <ArrowLeft className={`w-5 h-5 ${rtl ? 'rtl:rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                            </div>
                          </div>
                        </div>
                    );
                  })}
                </div>

                <div className="mt-12">
                  <button
                      onClick={() => {
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto text-lg"
                  >
                    <ArrowLeft className={`w-5 h-5 ${rtl ? 'rtl:rotate-180' : ''}`} />
                    {t('common:backToHomePage')}
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default PlatformEntry;