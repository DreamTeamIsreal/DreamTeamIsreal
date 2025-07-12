// src/pages/MatchQuiz.tsx
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle } from 'lucide-react';
import apiService, { QuizQuestion, QuizAnswer } from '../lib/api';

interface MatchQuizProps {
    /**
     * Called when the user completes the quiz. The callback receives the map of answers
     * where the key is the question id and the value is the selected rating (1-5).
     */
    onQuizComplete?: (answers: Record<string, number>) => void;
}

const buildQuestionsFromTranslation = (t: any, i18n: any): QuizQuestion[] => {
    // Get the raw resource for the current language
    const lang = i18n.language;
    const resource = i18n.getResourceBundle(lang, 'questionnaire');
    if (!resource || !resource.questions) return [];
    const questions: QuizQuestion[] = [];
    for (const category of Object.keys(resource.questions)) {
        const sectionQuestions = resource.questions[category];
        for (const qKey of Object.keys(sectionQuestions)) {
            questions.push({
                id: `${category}.${qKey}`,
                question: sectionQuestions[qKey],
                category,
                key: `questions.${category}.${qKey}`,
                weight: 1
            });
        }
    }
    return questions;
};

const MatchQuiz: FC<MatchQuizProps> = ({ onQuizComplete }: MatchQuizProps) => {
    const { t, i18n } = useTranslation(['questionnaire']);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [quizInternalCompleted, setQuizInternalCompleted] = useState(false);
    // API state management
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUsingMockData, setIsUsingMockData] = useState(false);
    const currentLangIsRTL = i18n.dir() === 'rtl';

    // Fetch quiz questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await apiService.getQuizQuestions();
                if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                    setQuestions(response.data);
                } else {
                    // Fallback to local translation
                    setQuestions(buildQuestionsFromTranslation(t, i18n));
                }
                // Check if we're using mock data
                const isMock = !!(response.data && response.data.length > 0 && response.data[0].id === '1');
                setIsUsingMockData(isMock);
            } catch (err) {
                // Fallback to local translation
                setQuestions(buildQuestionsFromTranslation(t, i18n));
                setError('Failed to load quiz questions from server, using local questions.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [i18n.language]);

    useEffect(() => {
        document.documentElement.setAttribute('dir', currentLangIsRTL ? 'rtl' : 'ltr');
        return () => {
            document.documentElement.removeAttribute('dir');
        };
    }, [currentLangIsRTL]);

    // Group questions by category (using API data structure)
    const sections = questions.reduce((acc: Record<string, QuizQuestion[]>, question) => {
        const category = question.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(question);
        return acc;
    }, {});

    const sectionKeys = Object.keys(sections);
    const currentSectionQuestions = sections[sectionKeys[currentSectionIndex]] || [];

    const handleAnswerChange = (questionId: string, value: number) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: value
        }));
    };

    const submitQuizAnswers = async () => {
        try {
            setIsSubmitting(true);
            // Convert answers to API format
            const submission = {
                answers: Object.entries(answers).map(([questionId, answer]): QuizAnswer => ({
                    questionId,
                    answer: answer as number
                }))
            };
            await apiService.submitQuizAnswers(submission);
            console.log('Quiz answers submitted successfully');
        } catch (err) {
            console.error('Error submitting quiz answers:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToNextSection = async () => {
        // Check if all questions in the current section are answered
        const allAnsweredInCurrentSection = currentSectionQuestions.every((q: QuizQuestion) => answers[q.id] !== undefined);
        if (!allAnsweredInCurrentSection) {
            alert(t('questionnaire:pleaseAnswerAllQuestions'));
            return;
        }
        if (currentSectionIndex < sectionKeys.length - 1) {
            setCurrentSectionIndex(currentSectionIndex + 1);
            window.scrollTo(0, 0);
        } else {
            setQuizInternalCompleted(true);
            // Submit answers to API
            await submitQuizAnswers();
            // Call the callback prop to pass answers to the parent
            if (onQuizComplete) {
                onQuizComplete(answers);
            }
        }
    };

    const goToPreviousSection = () => {
        if (currentSectionIndex > 0) {
            setCurrentSectionIndex(currentSectionIndex - 1);
            window.scrollTo(0, 0);
        }
    };

    const totalSections = sectionKeys.length;
    const progressPercentage = totalSections > 0 ? ((currentSectionIndex + 1) / totalSections) * 100 : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600 mb-4" />
                <span className="text-gray-600 text-lg">{t('quiz.loading', 'Loading quiz...')}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
                <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
                <span className="text-red-600 text-lg">{error}</span>
            </div>
        );
    }

    // The MatchQuiz component itself will no longer render PlatformHeader/Footer
    // as it's now nested within CandidateSubmission which already renders them.
    return (
        <div className={`py-8 px-4 sm:px-6 lg:px-8 ${currentLangIsRTL ? 'rtl' : 'ltr'}`}>
            {quizInternalCompleted ? (
                <div className="bg-white rounded-3xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('quiz.completionTitle')}</h2>
                    <p className="text-lg text-gray-600">{t('quiz.completionMessage')}</p>
                    {/* No navigation buttons here, parent handles moving to the next step */}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-8"> {/* Removed shadow-xl as parent container has it */}
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>{t('questionnaire:progress', {
                                current: currentSectionIndex + 1,
                                total: totalSections
                            })}</span>
                            <span>{Math.round(progressPercentage)}% {t('questionnaire:completed')}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                                style={{width: `${progressPercentage}%`}}
                            />
                        </div>
                    </div>

                    {/* Quiz Title and Instructions (Can be removed if parent provides general intro) */}
                    <div className="text-center mb-8">
                        {/* Assuming the main title/description for the quiz is provided by CandidateSubmission */}
                        {/* <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('quiz.title')}</h1>
                        <p className="text-lg text-gray-600">{t('quiz.instructions')}</p> */}
                    </div>

                    <hr className="my-8 border-gray-200"/>

                    {/* Current Section Title */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                        {t(`sections.${sectionKeys[currentSectionIndex]}`)}
                    </h2>

                    {/* Rating Scale Reference */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center text-gray-700">
                        <p className="font-semibold mb-2">{t('ratings.heading')}</p>
                        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 list-none p-0 m-0">
                            <li><span className="font-bold text-red-600">1</span> - {t('ratings.1')}</li>
                            <li><span className="font-bold text-orange-600">2</span> - {t('ratings.2')}</li>
                            <li><span className="font-bold text-gray-600">3</span> - {t('ratings.3')}</li>
                            <li><span className="font-bold text-blue-600">4</span> - {t('ratings.4')}</li>
                            <li><span className="font-bold text-green-600">5</span> - {t('ratings.5')}</li>
                        </ul>
                    </div>

                    <div className="questions-list space-y-8">
                        {currentSectionQuestions.map((question) => (
                            <div key={question.id} className="question-item bg-gray-50 rounded-xl p-6 shadow-sm">
                                <p className="text-lg font-semibold text-gray-800 mb-4 text-center">{t(question.key)}</p>
                                <div className="radio-group grid gap-4">
                                    {[
                                        { value: 1, label: t('ratings.1'), color: 'from-red-500 to-red-600' },
                                        { value: 2, label: t('ratings.2'), color: 'from-orange-500 to-orange-600' },
                                        { value: 3, label: t('ratings.3'), color: 'from-gray-500 to-gray-600' },
                                        { value: 4, label: t('ratings.4'), color: 'from-blue-500 to-blue-600' },
                                        { value: 5, label: t('ratings.5'), color: 'from-green-500 to-green-600' }
                                    ].map(option => (
                                        <label
                                            key={option.value}
                                            className={`
                                                w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                                                transform hover:scale-102 shadow-sm hover:shadow-lg
                                                ${answers[question.id] === option.value
                                                ? `border-transparent bg-gradient-to-r ${option.color} text-white`
                                                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                            }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={option.value}
                                                checked={answers[question.id] === option.value}
                                                onChange={() => handleAnswerChange(question.id, option.value)}
                                                className="sr-only"
                                            />
                                            <div className={`flex items-center ${currentLangIsRTL ? 'flex-row-reverse justify-between' : 'justify-between'}`}>
                                                <span className="font-bold text-xl opacity-50">{option.value}</span>
                                                <span className="font-medium text-lg">{option.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons for MatchQuiz itself */}
                    <div className="navigation-buttons flex justify-between mt-10 gap-4">
                        {currentSectionIndex > 0 && (
                            <button
                                onClick={goToPreviousSection}
                                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold shadow-md"
                            >
                                {t('quiz.previousSection')}
                            </button>
                        )}
                        <button
                            onClick={goToNextSection}
                            className={`flex-1 ${currentSectionIndex === 0 ? 'ml-auto' : ''}
                                    bg-gradient-to-r from-blue-600 to-purple-600 text-white
                                    px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700
                                    transition-all duration-300 font-semibold shadow-lg hover:shadow-xl
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500`}
                            disabled={currentSectionQuestions.some(q => answers[q.id] === undefined)}
                        >
                            {currentSectionIndex < sectionKeys.length - 1 ? t('quiz.nextSection') : t('quiz.finishQuiz')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchQuiz;
