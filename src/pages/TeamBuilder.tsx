import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {User, ArrowLeft, Check, AlertCircle} from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';
// Import useTranslation from react-i18next
import {useTranslation} from 'react-i18next';
import apiService from '../lib/api';

const TeamBuilder = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0); // 0 = questionnaire, 1 = selection
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // ----------------------------------------------------------
    // Type Definitions
    // ----------------------------------------------------------
    interface Candidate {
        id: number;
        name: string;
        position: string;
        experience: string;
        match: number;
        supporters: number;
        rating: number;
        image: string;
    }

    // ----------------------------------------------------------
    // Component state
    // ----------------------------------------------------------
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<number, number>>({});
    const [selectedCandidates, setSelectedCandidates] = useState<Record<string, Candidate>>({});
    const [hasExistingSelections, setHasExistingSelections] = useState(false);
    const [userDistrict, setUserDistrict] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectionErrors, setSelectionErrors] = useState<Record<string, string>>({});
    const [lastSelectedPosition, setLastSelectedPosition] = useState<string>('');

    // Refs for smooth scrolling
    const positionTabsRef = useRef<HTMLDivElement | null>(null);
    const candidateCardsRef = useRef<HTMLDivElement | null>(null);
    const errorRef = useRef<HTMLDivElement | null>(null);

    // Use the useTranslation hook, specifying the 'teamBuilder' namespace
    const {
        t,
        i18n
    } = useTranslation([
        'candidate',
        'committees',
        'dataViz',
        'positions',
        'teamBuilder',
        'questions',
        'sections',
        'summary',
        'questionnaire',
        'existingSelections',
        'saveMessages',
        'common' // Added to access shared strings such as "loading" and "pleaseWait"
    ]);
    const rtl = i18n.dir() === 'rtl';

    // Positions and Committees using t() for titles
    const positions = [
        {id: 'pm', title: t('candidate:forMinister') + ' - ' + t('positions:pm'), icon: '🏛️', category: 'government'},
        {
            id: 'defense',
            title: t('candidate:forMinister') + ' - ' + t('positions:defense'),
            icon: '🛡️',
            category: 'security'
        },
        {
            id: 'finance',
            title: t('candidate:forMinister') + ' - ' + t('positions:finance'),
            icon: '💰',
            category: 'economy'
        },
        {
            id: 'education',
            title: t('candidate:forMinister') + ' - ' + t('positions:education'),
            icon: '📚',
            category: 'education'
        },
        {
            id: 'health',
            title: t('candidate:forMinister') + ' - ' + t('positions:health'),
            icon: '🏥',
            category: 'health'
        },
        {
            id: 'transport',
            title: t('candidate:forMinister') + ' - ' + t('positions:transport'),
            icon: '🚗',
            category: 'transport'
        },
        {
            id: 'justice',
            title: t('candidate:forMinister') + ' - ' + t('positions:justice'),
            icon: '⚖️',
            category: 'justice'
        },
        {
            id: 'housing',
            title: t('candidate:forMinister') + ' - ' + t('positions:housing'),
            icon: '🏠',
            category: 'housing'
        },
        {
            id: 'environment',
            title: t('candidate:forMinister') + ' - ' + t('positions:environment'),
            icon: '🌍',
            category: 'environment'
        },
        {
            id: 'culture',
            title: t('candidate:forMinister') + ' - ' + t('positions:culture'),
            icon: '🎭',
            category: 'culture'
        },
        {
            id: 'welfare',
            title: t('candidate:forMinister') + ' - ' + t('positions:welfare'),
            icon: '🤝',
            category: 'welfare'
        },
        {
            id: 'foreign_affairs',
            title: t('candidate:forMinister') + ' - ' + t('positions:foreign_affairs'),
            icon: '🌐',
            category: 'government'
        },
        {
            id: 'agriculture',
            title: t('candidate:forMinister') + ' - ' + t('positions:agriculture'),
            icon: '🌾',
            category: 'economy'
        },
        {
            id: 'tourism',
            title: t('candidate:forMinister') + ' - ' + t('positions:tourism'),
            icon: '✈️',
            category: 'economy'
        },
        {
            id: 'science_technology',
            title: t('candidate:forMinister') + ' - ' + t('positions:science_technology'),
            icon: '🔬',
            category: 'education'
        },
        {
            id: 'social_affairs',
            title: t('candidate:forMinister') + ' - ' + t('positions:social_affairs'),
            icon: '👥',
            category: 'welfare'
        },
        {
            id: 'religious_affairs',
            title: t('candidate:forMinister') + ' - ' + t('positions:religious_affairs'),
            icon: '⛪',
            category: 'government'
        },
        {
            id: 'internal_security',
            title: t('candidate:forMinister') + ' - ' + t('positions:internal_security'),
            icon: '🚓',
            category: 'security'
        }
    ];

    const committees = [
        {
            id: 'knesset',
            title: t('candidate:forCommittee') + ' ' + t('committees:knesset'),
            icon: '🏛️',
            category: 'government'
        },
        {
            id: 'finance_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:finance_committee'),
            icon: '💰',
            category: 'economy'
        },
        {
            id: 'economy',
            title: t('candidate:forCommittee') + ' ' + t('committees:economy'),
            icon: '📈',
            category: 'economy'
        },
        {
            id: 'foreign_defense',
            title: t('candidate:forCommittee') + ' ' + t('committees:foreign_defense'),
            icon: '🛡️',
            category: 'security'
        },
        {
            id: 'interior_env',
            title: t('candidate:forCommittee') + ' ' + t('committees:interior_env'),
            icon: '🌱',
            category: 'environment'
        },
        {
            id: 'education_culture',
            title: t('candidate:forCommittee') + ' ' + t('committees:education_culture'),
            icon: '🎓',
            category: 'education'
        },
        {
            id: 'health_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:health_committee'),
            icon: '🏥',
            category: 'health'
        },
        {
            id: 'labor_welfare',
            title: t('candidate:forCommittee') + ' ' + t('committees:labor_welfare'),
            icon: '🤝',
            category: 'welfare'
        },
        {
            id: 'constitution_law',
            title: t('candidate:forCommittee') + ' ' + t('committees:constitution_law'),
            icon: '⚖️',
            category: 'justice'
        },
        {
            id: 'science_technology_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:science_technology_committee'),
            icon: '🔬',
            category: 'education'
        },
        {
            id: 'agriculture_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:agriculture_committee'),
            icon: '🌾',
            category: 'economy'
        },
        {
            id: 'tourism_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:tourism_committee'),
            icon: '✈️',
            category: 'economy'
        },
        {
            id: 'social_affairs_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:social_affairs_committee'),
            icon: '👥',
            category: 'welfare'
        },
        {
            id: 'religious_affairs_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:religious_affairs_committee'),
            icon: '⛪',
            category: 'government'
        },
        {
            id: 'internal_security_committee',
            title: t('candidate:forCommittee') + ' ' + t('committees:internal_security_committee'),
            icon: '🚓',
            category: 'security'
        }
    ];

    const allPositions = [...positions, ...committees];

    // TAB STATE ----------------------------------------------------------------
    const [activePositionId, setActivePositionId] = useState<string>(allPositions[0]?.id ?? '');
    const [reviewMode, setReviewMode] = useState(false);

    // Get user data from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.district) {
            setUserDistrict(userData.district);
        }

        const fetchDraft = async () => {
            try {
                setIsLoading(true);
                const selections = await apiService.getTeamDraft();
                if (selections && Object.keys(selections).length) {
                    setSelectedCandidates(selections);
                    setHasExistingSelections(true);
                    setCurrentStep(1); // Skip questionnaire if already has selections
                }
            } catch (error) {
                console.warn('Error fetching draft:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDraft();
    }, []);

    // Smooth scroll to position tab when active position changes
    useEffect(() => {
        if (activePositionId && positionTabsRef.current) {
            const activeTab = positionTabsRef.current.querySelector(`[data-position-id="${activePositionId}"]`);
            if (activeTab) {
                activeTab.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activePositionId]);

    // Scroll to error when validation errors occur
    useEffect(() => {
        if (Object.keys(selectionErrors).length > 0 && errorRef.current) {
            errorRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [selectionErrors]);

    // Add a loading state check for translations
    if (!i18n.isInitialized || !t) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PlatformHeader/> {/* PlatformHeader should also handle its own loading */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">
                        {t('common:loadingData')}
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 animate-pulse">
                        {t('common:pleaseWait')}
                    </p>
                </div>
            </div>
        );
    }

    /**
     * Returns the list of candidates available for the given position id.
     * In a real implementation this would query the backend; for now we map
     * minister positions to the minister mock list and committee positions to
     * the committee mock list.
     */
    const getCandidatesForPosition = (posId: string) => {
        const isMinister = positions.some(p => p.id === posId);
        return isMinister ? mockCandidates : mockCommitteeCandidates;
    };

    const mockCandidates = [
        {
            id: 1,
            name: 'דר\' שרה לוי',
            position: t('candidate:forMinister') + ' - ' + t('positions:education'),
            experience: t('candidate:experienceEducation'),
            match: 92,
            supporters: 1247,
            rating: 4.8,
            image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        },
        {
            id: 2,
            name: 'פרופ\' דוד כהן',
            position: t('candidate:forMinister') + ' - ' + t('positions:health'),
            experience: t('candidate:experienceHealth'),
            match: 88,
            supporters: 2156,
            rating: 4.9,
            image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        },
        {
            id: 3,
            name: 'עו"ד מירי אברהם',
            position: t('candidate:forMinister') + ' - ' + t('positions:justice'),
            experience: t('candidate:experienceJustice'),
            match: 85,
            supporters: 987,
            rating: 4.7,
            image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        },
        {
            id: 4,
            name: 'מהנדס רון ישראלי',
            position: t('candidate:forMinister') + ' - ' + t('positions:transport'),
            experience: t('candidate:experienceTransport'),
            match: 79,
            supporters: 1543,
            rating: 4.6,
            image: 'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        }
    ];

    const mockCommitteeCandidates = [
        {
            id: 5,
            name: 'עו"ד משה דוד',
            position: t('candidate:forCommittee') + ' ' + t('committees:knesset'),
            experience: t('candidate:experienceKnesset'),
            match: 91,
            supporters: 876,
            rating: 4.5,
            image: 'https://images.pexels.com/photos/3785084/pexels-photo-3785084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        },
        {
            id: 6,
            name: 'כלכלנית שרה לוי',
            position: t('candidate:forCommittee') + ' ' + t('committees:finance_committee'),
            experience: t('candidate:experienceEconomy'),
            match: 87,
            supporters: 1234,
            rating: 4.7,
            image: 'https://images.pexels.com/photos/3760267/pexels-photo-3760267.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        }
    ];

    const selectCandidate = async (positionId: string, candidate: Candidate) => {
        try {
            setIsLoading(true);
            setSelectionErrors({});

            // Determine selection type based on position
            const selectionType = positions.some(p => p.id === positionId) ? 'minister' : 'committee';

            // Call the new API method
            const response = await apiService.selectCandidate({
                positionId,
                candidateId: candidate.id.toString(),
                selectionType
            });

            if (response.success) {
                setSelectedCandidates(prev => ({
                    ...prev,
                    [positionId]: candidate
                }));
                setLastSelectedPosition(positionId);
                
                // Clear any previous errors for this position
                setSelectionErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[positionId];
                    return newErrors;
                });

                // Show success feedback
                setTimeout(() => {
                    setLastSelectedPosition('');
                }, 2000);
            } else {
                setSelectionErrors(prev => ({
                    ...prev,
                    [positionId]: response.message || 'Failed to save selection'
                }));
            }
        } catch (error) {
            console.error('Error selecting candidate:', error);
            setSelectionErrors(prev => ({
                ...prev,
                [positionId]: 'Network error. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const completeTeamBuilding = () => {
        localStorage.setItem('teamSelections', JSON.stringify(selectedCandidates));
        localStorage.setItem('questionnaireAnswers', JSON.stringify(questionnaireAnswers));
        alert(t('saveTeamSuccess')); // Use t() for alert message
        navigate('/data-visualization');
    };

    const isUserRegistered = localStorage.getItem('userRegistered') === 'true';

    if (!isUserRegistered) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PlatformHeader/>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {t('common:error')} {/* Assuming 'common' namespace for general errors */}
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        {t('registrationRequired')}
                    </p>
                    <button
                        onClick={() => navigate('/platform')}
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
                    >
                        {t('startRegistration')}
                    </button>
                </div>
            </div>
        );
    }

    // Helpers for prev/next navigation
    const currentIdx = allPositions.findIndex(p => p.id === activePositionId);
    const prevPosition = currentIdx > 0 ? allPositions[currentIdx - 1] : null;
    const nextPosition = currentIdx < allPositions.length - 1 ? allPositions[currentIdx + 1] : null;

    return (
        <div className={`min-h-screen bg-gray-50 ${rtl ? 'rtl' : 'ltr'}`}>
            <PlatformHeader/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {t('teamBuilder:title')}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {currentStep === 0 ? t('teamBuilder:questionnaire') : t('teamBuilder:candidateSelection')}
                    </p>
                    {userDistrict && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
                            <span
                                className="text-blue-800 font-medium">{t('dataViz:yourDistrict')}: {userDistrict}</span>
                        </div>
                    )}
                </div>

                {/* Error display */}
                {Object.keys(selectionErrors).length > 0 && (
                    <div ref={errorRef} className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-red-800 mb-2">
                            <AlertCircle className="w-5 h-5" />
                            <h3 className="font-semibold">{t('common:errorsOccurred')}</h3>
                        </div>
                        <ul className="space-y-1">
                            {Object.entries(selectionErrors).map(([positionId, error]) => {
                                const position = allPositions.find(p => p.id === positionId);
                                return (
                                    <li key={positionId} className="text-red-700 text-sm">
                                        <strong>{position?.title || positionId}:</strong> {error}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Show existing selections option */}
                {hasExistingSelections && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-bold text-blue-900 mb-4">{t('existingSelections:title')}</h3>
                        <p className="text-blue-800 mb-4">
                            {t('existingSelections:description')}
                        </p>
                    </div>
                )}

                {/* Selection Step with position tabs */}
                {!reviewMode && currentStep === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
                        {/* Tabs */}
                        <div ref={positionTabsRef} className="overflow-x-auto flex gap-2 pb-6">
                            {allPositions.map((pos) => (
                                <button
                                    key={pos.id}
                                    data-position-id={pos.id}
                                    onClick={() => setActivePositionId(pos.id)}
                                    className={`whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                                        activePositionId === pos.id
                                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:scale-102'
                                    } ${selectionErrors[pos.id] ? 'border-red-300 bg-red-50' : ''}`}
                                >
                                    <span className="text-xl">{pos.icon}</span>
                                    {pos.title}
                                    {selectedCandidates[pos.id] && (
                                        <Check className="w-4 h-4 ml-1" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Candidate list for active tab */}
                        <div ref={candidateCardsRef} className="grid md:grid-cols-2 gap-6 mt-4">
                            {getCandidatesForPosition(activePositionId).map((candidate) => {
                                const isSelected = selectedCandidates[activePositionId]?.id === candidate.id;
                                const isRecentlySelected = lastSelectedPosition === activePositionId && isSelected;
                                
                                return (
                                    <div
                                        key={candidate.id}
                                        role="button"
                                        aria-label={t('selectCandidates:selectCandidate', { name: candidate.name })}
                                        onClick={() => selectCandidate(activePositionId, candidate)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 flex gap-4 ${
                                            isSelected
                                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                        } ${isRecentlySelected ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={candidate.image}
                                                alt={candidate.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-gray-900">{candidate.name}</h5>
                                            <p className="text-sm text-gray-600">{candidate.experience}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs">
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    {candidate.match}% {t('candidate:match')}
                                                </span>
                                                <span className="text-gray-500">{candidate.supporters} {t('candidate:supporters')}</span>
                                                <span className="text-gray-500">⭐ {candidate.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">{t('common:saving')}</span>
                            </div>
                        )}

                        {/* Prev / Next position buttons */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                disabled={!prevPosition}
                                onClick={() => prevPosition && setActivePositionId(prevPosition.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${prevPosition ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                ← {prevPosition ? prevPosition.title : t('common:previous')}
                            </button>

                            <button
                                disabled={!nextPosition}
                                onClick={() => nextPosition && setActivePositionId(nextPosition.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${nextPosition ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                {nextPosition ? nextPosition.title : t('common:next')} →
                            </button>
                        </div>

                        {/* Review button */}
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setReviewMode(true)}
                                disabled={Object.keys(selectedCandidates).length < allPositions.length || isLoading}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {t('summary:reviewButton', 'Review Team')}
                            </button>
                        </div>
                    </div>
                )}

                {/* REVIEW SUMMARY PAGE */}
                {reviewMode && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            {t('summary:reviewTitle', 'Review & Confirm Your Team')}
                        </h2>

                        <div className="space-y-4 mb-8">
                            {allPositions.map((pos) => {
                                const cand = selectedCandidates[pos.id];
                                return (
                                    <div key={pos.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{pos.icon}</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{pos.title}</p>
                                                {cand ? (
                                                    <p className="text-sm text-gray-600">{cand.name}</p>
                                                ) : (
                                                    <p className="text-sm text-red-600">{t('summary:notSelected', 'Not selected')}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setActivePositionId(pos.id); setReviewMode(false); }}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            {t('summary:change', 'Change')}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setReviewMode(false)}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                {t('common:back', 'Back')}
                            </button>

                            <button
                                onClick={completeTeamBuilding}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                {t('summary:confirm', 'Save Dream Team')}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/platform')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        {t('common:back')} {/* Assuming 'common' namespace for general "back" text */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamBuilder;