import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Globe, Users, HelpCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiService, { Candidate, QuizQuestion } from '../lib/api';

const MockDataDemo: FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  // Load generic translations
  const { t } = useTranslation(['common']);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'am', name: 'Հայերեն', flag: '🇦🇲' }
  ];

  const fetchMockData = async (lang: string) => {
    setIsLoading(true);
    try {
      // Set language in localStorage to simulate language change
      localStorage.setItem('i18nextLng', lang);
      
      // Fetch data (will return localized mock data)
      const [candidatesResponse, questionsResponse] = await Promise.all([
        apiService.getCandidates(),
        apiService.getQuizQuestions()
      ]);
      
      if (candidatesResponse.success && candidatesResponse.data) {
        setCandidates(candidatesResponse.data.slice(0, 2));
      } else {
        setCandidates([]);
      }

      if (questionsResponse.success && questionsResponse.data) {
        setQuestions(questionsResponse.data.slice(0, 2));
      } else {
        setQuestions([]);
      }
      setCurrentLang(lang);
    } catch (error) {
      console.error('Error fetching mock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMockData('en');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />
          {t('common:demoMode')}
        </h2>
        <p className="text-gray-600">
          {t('common:mockDataIndicator')}
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{t('common:languageChanged')}</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => fetchMockData(lang.code)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                currentLang === lang.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-300 text-gray-700'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-label={t('common:loading')} />
          <span className="ml-2 text-gray-600">{t('common:loadingData')}</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mock Candidates */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              {t('common:demoMode')} - {t('candidate:candidates')}
            </h3>
            <div className="space-y-3">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{candidate.name}</div>
                  <div className="text-sm text-blue-600">{candidate.position}</div>
                  <div className="text-xs text-gray-500 mt-1">{candidate.district}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {candidate.experience}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Quiz Questions */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              {t('common:demoMode')} - {t('common:questions')}
            </h3>
            <div className="space-y-3">
              {questions.map((question) => (
                <div key={question.id} className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {question.question}
                  </div>
                  <div className="text-xs text-purple-600">
                    Category: {question.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">{t('common:howItWorks') || 'How it works:'}</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {t('common:usingMockData')}</li>
          <li>• {t('common:mockDataIndicator')}</li>
          <li>• {t('common:demoMode')}</li>
          <li>• {t('common:liveData')}</li>
          <li>• {t('common:submitSuccess')}</li>
        </ul>
      </div>
    </div>
  );
};

export default MockDataDemo;