import React, { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Eye, Users, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';
import { useTranslation } from 'react-i18next';
import apiService, { Candidate } from '../lib/api';

const CandidatesDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [candidateType, setCandidateType] = useState<'all' | 'minister' | 'committee'>('all');
  
  // API state management
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);

  // Load translations from specific namespaces
  const { t, i18n } = useTranslation(['platform', 'candidate', 'common', 'candidateRequirements', 'positions', 'committees']);
  const currentLangIsRTL = i18n.dir() === 'rtl';

  // Fetch candidates on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiService.getCandidates();
        if (response.success && response.data) {
          setCandidates(response.data);
        } else {
          setCandidates([]);
        }
        
        // Check if we're using mock data by looking for mock indicators
        if (response.success && response.data) {
          const mock = response.data.length > 0 && response.data.some(c => c.id === '1');
          setIsUsingMockData(mock);
        } else {
          setIsUsingMockData(false);
        }
        
      } catch (err) {
        setError(t('common:errorOccurred'));
        console.error('Error fetching candidates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [t]);

  // --- Translation-dependent Data (Memoized) ---
  // These arrays now correctly use the `t` function to retrieve translated strings.
  const positions = useMemo(() => [
    t('positions:pm'), // Prime Minister
    t('positions:defense'), // Defense Minister
    t('positions:finance'), // Finance Minister
    t('positions:education'), // Education Minister
    t('positions:health'), // Health Minister
    t('positions:transport'), // Transportation Minister
    t('positions:justice'), // Justice Minister
    t('positions:housing'), // Housing Minister
    t('positions:internal_security'), // Interior Minister (mapped to internal security as per previous conversion)
    t('positions:foreign_affairs'), // Foreign Minister
    t('positions:science_technology'), // Energy Minister (mapped to science_technology as per previous conversion)
    t('positions:environment'), // Environment Minister
    t('positions:culture'), // Culture Minister
    t('positions:social_affairs'), // Immigration Minister (mapped to social_affairs as per previous conversion)
    t('positions:welfare'), // Welfare Minister
    t('positions:agriculture'), // Agriculture Minister
    t('positions:economy'), // Industry Minister (mapped to economy as per previous conversion)
    t('positions:social_affairs'), // Diaspora Minister (mapped to social_affairs as per previous conversion)
  ], [t]);

  const committees = useMemo(() => [
    t('committees:knesset'),
    t('committees:finance_committee'),
    t('committees:economy'),
    t('committees:foreign_defense'),
    t('committees:interior_env'),
    t('committees:internal_security_committee'),
    t('committees:religious_affairs_committee'), // Mapped from 'מיזמי תשתית לאומיים מיוחדים ושירותי דת יהודיים'
    t('committees:constitution_law'),
    t('committees:social_affairs_committee'), // Mapped from 'העלייה, הקליטה והתפוצות'
    t('committees:education_culture'),
    t('committees:labor_welfare'),
    t('committees:health_committee'),
    t('committees:finance_committee'), // Mapped from 'ענייני ביקורת המדינה'
    t('committees:labor_welfare'), // Mapped from 'קידום מעמד האישה ולשוויון מגדרי'
    t('committees:science_technology_committee'),
  ], [t]);

  const districts = useMemo(() => [
    t('candidateRequirements:districts.upperGalilee'),
    t('candidateRequirements:districts.lowerGalilee'),
    t('candidateRequirements:districts.haifa'),
    t('candidateRequirements:districts.sharon'),
    t('candidateRequirements:districts.gushDan'),
    t('candidateRequirements:districts.bneiBrak'),
    t('candidateRequirements:districts.westJerusalem'),
    t('candidateRequirements:districts.settlements'),
    t('candidateRequirements:districts.shfela'),
    t('candidateRequirements:districts.northernNegev'),
    t('candidateRequirements:districts.jordanValley'),
    t('candidateRequirements:districts.southernNegev'),
  ], [t]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.includes(searchTerm) ||
          candidate.position.includes(searchTerm) ||
          candidate.experience.includes(searchTerm);
      const matchesPosition = !selectedPosition || candidate.position === selectedPosition;
      const matchesDistrict = !selectedDistrict || candidate.district === selectedDistrict;
      const matchesType = candidateType === 'all' || candidate.type === candidateType;

      return matchesSearch && matchesPosition && matchesDistrict && matchesType;
    });
  }, [candidates, searchTerm, selectedPosition, selectedDistrict, candidateType]);

  const groupedCandidates = useMemo(() => {
    if (candidateType !== 'committee') return null;

    return districts.reduce((acc: Record<string, Candidate[]>, district) => {
      const districtCandidates = filteredCandidates.filter(c => c.district === district);
      if (districtCandidates.length > 0) {
        acc[district] = districtCandidates;
      }
      return acc;
    }, {} as Record<string, Candidate[]>);
  }, [candidateType, districts, filteredCandidates]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50" dir={currentLangIsRTL ? 'rtl' : 'ltr'}>
        <PlatformHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('common:loadingData')}</h2>
            <p className="text-gray-600">{t('common:pleaseWait')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50" dir={currentLangIsRTL ? 'rtl' : 'ltr'}>
        <PlatformHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('common:errorOccurred')}</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('common:tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50" dir={currentLangIsRTL ? 'rtl' : 'ltr'}>
        <PlatformHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mock Data Indicator */}
          {isUsingMockData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">{t('common:usingMockData')}</h4>
                  <p className="text-sm text-yellow-700">
                    {t('common:mockDataNote')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('platform:candidatesDirectory')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('platform:candidatesDirectoryDescription')}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    aria-label={t('platform:searchPlaceholder')}
                    placeholder={t('platform:searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                  aria-label={t('platform:candidateTypeFilter')}
                  value={candidateType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setCandidateType(e.target.value as 'all' | 'minister' | 'committee');
                    setSelectedPosition(''); // Clear position when type changes
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('platform:allCandidates')}</option>
                <option value="minister">{t('platform:ministerCandidates')}</option>
                <option value="committee">{t('platform:committeeCandidates')}</option>
              </select>

              {/* Position/Committee Filter */}
              <select
                  aria-label={t('platform:positionFilter')}
                  value={selectedPosition}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedPosition(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('platform:allPositions')}</option>
                {candidateType === 'committee'
                    ? committees.map(committee => (
                        <option key={committee} value={committee}>{committee}</option>
                    ))
                    : positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                    ))
                }
              </select>

              {/* District Filter */}
              <select
                  aria-label={t('platform:districtFilter')}
                  value={selectedDistrict}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedDistrict(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('platform:allDistricts')}</option>
                {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPosition('');
                    setSelectedDistrict('');
                    setCandidateType('all');
                  }}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                {t('platform:clearFilters')}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6" dir={currentLangIsRTL ? 'rtl' : 'ltr'}>
            <p className="text-gray-600">
              {t('platform:foundCandidates', { count: filteredCandidates.length })}
            </p>
          </div>

          {/* Candidates Display */}
          {candidateType === 'committee' && groupedCandidates ? (
              // Grouped by district for committee members
              <div className="space-y-8">
                {Object.entries(groupedCandidates).map(([district, candidates]) => (
                    <div key={district} className="bg-white rounded-2xl shadow-lg p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">{district}</h2>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {t('platform:candidatesCount', { count: candidates.length })}
                      </span>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.map((candidate) => (
                            <div key={candidate.id}
                                 className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col h-full">
                              <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                                <img
                                    src={candidate.image}
                                    alt={candidate.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                                  <p className="text-sm text-blue-600 font-medium">{candidate.position}</p>
                                </div>
                              </div>

                              <p className="text-gray-600 text-sm mb-4 flex-1">{candidate.experience}</p>

                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4 text-sm">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {candidate.match}% {t('candidate:match')}
                                </span>
                                  <span className="text-gray-500">{candidate.supporters} {t('candidate:supporters')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="font-medium">{candidate.rating}</span>
                                </div>
                              </div>

                              <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => navigate(`/candidate/${candidate.id}`)}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  {t('candidate:viewProfile')}
                                </button>
                                <button
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              // Regular grid for ministers or all candidates
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCandidates.map((candidate) => (
                    <div key={candidate.id}
                         className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                        <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-blue-600 font-medium">{candidate.position}</p>
                          <p className="text-xs text-gray-500">{candidate.district}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 flex-1">{candidate.experience}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {candidate.match}% {t('candidate:match')}
                        </span>
                          <span className="text-gray-500">{candidate.supporters} {t('candidate:supporters')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{candidate.rating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <button
                            onClick={() => navigate(`/candidate/${candidate.id}`)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {t('candidate:viewProfile')}
                        </button>
                        <button
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('platform:noCandidatesFound')}</h3>
                <p className="text-gray-600">{t('platform:tryChangingFilters')}</p>
              </div>
          )}

          <div className="mt-8 text-center">
            <button
                onClick={() => navigate('/platform')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common:back')}
            </button>
          </div>
        </div>
      </div>
  );
};

export default CandidatesDirectory;