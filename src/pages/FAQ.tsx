import React, {useState} from 'react';
import type { ChangeEvent } from 'react';
import {useNavigate} from 'react-router-dom';
import {HelpCircle, ChevronDown, ChevronUp, Search} from 'lucide-react';
import {useTranslation, Trans} from 'react-i18next'; // Import useTranslation and Trans
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ = () => {
    const navigate = useNavigate();
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const {t, i18n} = useTranslation(['faq', 'common']); // Use 'faq' and 'common' namespaces for FAQ component
    const currentLangIsRTL = i18n.dir() === 'rtl'; // Determine if the current language is RTL

    // If you want to show a loading state for translations (useful if using lazy loading)
    if (!i18n.isInitialized || !t) { // Check if i18n is initialized and t function is available
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p>{t('common:loadingData')}</p>
            </div>
        );
    }


    const faqCategories = [
        {
            title: t('general.title'), // Use t() function
            questions: [
                {
                    question: t('general.q1.question'),
                    answer: t('general.q1.answer'),
                },
                {
                    question: t('general.q2.question'),
                    answer: t('general.q2.answer'),
                },
                {
                    question: t('general.q3.question'),
                    answer: t('general.q3.answer'),
                },
            ],
        },
        // Other categories...
    ];

    const allQuestions = faqCategories.flatMap((category, categoryIndex) =>
        category.questions.map((q, questionIndex) => ({
            ...q,
            categoryTitle: category.title,
            id: categoryIndex * 100 + questionIndex,
        }))
    );

    const filteredQuestions = searchTerm
        ? allQuestions.filter(
            (q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : allQuestions;

    const toggleQuestion = (id: number) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <div className={`min-h-screen bg-white ${currentLangIsRTL ? 'rtl' : 'ltr'}`}>
            <Header/>

            <div className="pt-20">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
                    <div
                        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${currentLangIsRTL ? 'text-right' : 'text-left'}`}>
                        <div className="inline-flex items-center gap-3 bg-orange-100 rounded-full px-6 py-3 mb-8">
                            <HelpCircle className="w-6 h-6 text-orange-600"/>
                            <span className="font-bold text-orange-800">{t('hero.title')}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                            {t('hero.heading1')}
                            <br/>
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {t('hero.heading2')}
              </span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
                            {t('hero.description')}
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search
                                className={`absolute ${currentLangIsRTL ? 'left-4' : 'right-4'} top-4 w-6 h-6 text-gray-400`}/>
                            <input
                                type="text"
                                placeholder={t('hero.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className={`w-full ${currentLangIsRTL ? 'pl-14 pr-6' : 'pr-14 pl-6'} py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg`}
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {searchTerm ? (
                            // Search Results
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                    {/* Using t() with interpolation for search results title */}
                                    {t('searchResults.title', {searchTerm, count: filteredQuestions.length})}
                                </h2>
                                <div className="space-y-4">
                                    {filteredQuestions.map((item) => (
                                        <div key={item.id}
                                             className="border border-gray-200 rounded-2xl overflow-hidden">
                                            <button
                                                onClick={() => toggleQuestion(item.id)}
                                                aria-expanded={openQuestion === item.id}
                                                className={`w-full px-8 py-6 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between ${currentLangIsRTL ? 'text-right' : 'text-left'}`}
                                            >
                                                <div className="flex-1">
                                                    <div className="text-sm text-orange-600 font-medium mb-1">
                                                        {item.categoryTitle}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {item.question}
                                                    </h3>
                                                </div>
                                                {openQuestion === item.id ? (
                                                    <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0"/>
                                                ) : (
                                                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0"/>
                                                )}
                                            </button>
                                            {openQuestion === item.id && (
                                                <div className="px-8 pb-6 bg-gray-50">
                                                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Categories View
                            <div className="space-y-12">
                                {faqCategories.map((category, categoryIndex) => (
                                    <div key={categoryIndex}>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                            {category.title}
                                        </h2>
                                        <div className="space-y-4">
                                            {category.questions.map((item, questionIndex) => {
                                                const id = categoryIndex * 100 + questionIndex;
                                                return (
                                                    <div key={id}
                                                         className="border border-gray-200 rounded-2xl overflow-hidden">
                                                        <button
                                                            onClick={() => toggleQuestion(id)}
                                                            aria-expanded={openQuestion === id}
                                                            className={`w-full px-8 py-6 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between ${currentLangIsRTL ? 'text-right' : 'text-left'}`}
                                                        >
                                                            <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                                                {item.question}
                                                            </h3>
                                                            {openQuestion === id ? (
                                                                <ChevronUp
                                                                    className="w-6 h-6 text-gray-400 flex-shrink-0"/>
                                                            ) : (
                                                                <ChevronDown
                                                                    className="w-6 h-6 text-gray-400 flex-shrink-0"/>
                                                            )}
                                                        </button>
                                                        {openQuestion === id && (
                                                            <div className="px-8 pb-6 bg-gray-50">
                                                                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-20 bg-gradient-to-br from-orange-600 to-red-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold mb-8">{t('contact.cta.title')}</h2>
                        <p className="text-xl text-orange-100 mb-12">{t('contact.cta.description')}</p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={() => navigate('/contact')}
                                className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-lg"
                            >
                                {t('contact.cta.contactButton')}
                            </button>

                            <button
                                onClick={() => navigate('/support')}
                                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300 font-bold text-lg"
                            >
                                {t('contact.cta.supportButton')}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <Footer/>
        </div>
    );
};

export default FAQ;