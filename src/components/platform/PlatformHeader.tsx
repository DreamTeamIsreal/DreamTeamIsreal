import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Menu, X, Bell, User, Vote, BarChart, Users, HelpCircle } from 'lucide-react'; // Import HelpCircle or another suitable icon for the quiz
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';

const PlatformHeader = () => {
    const { t, i18n } = useTranslation('platformHeader');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notificationCount] = useState(3);
    const isUserRegistered = localStorage.getItem('userRegistered') === 'true';
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const direction = i18n.dir();

    if (!i18n.isInitialized || !t) {
        return (
            <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50" dir={direction}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </header>
        );
    }

    const navigationItems = [
        { icon: User, label: t('navigation.candidateSubmission'), path: '/candidate-submission' },
        { icon: Vote, label: t('navigation.teamBuilder'), path: '/team-builder' },
        { icon: BarChart, label: t('navigation.dataVisualization'), path: '/data-visualization' },
        { icon: Users, label: t('navigation.candidatesDirectory'), path: '/candidates' },
        // --- NEW: Match Quiz Item ---
        { icon: HelpCircle, label: t('navigation.matchQuiz'), path: '/match-quiz' } // Added Match Quiz
    ];

    const handleNavigation = (path: string) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    const handleHomeNavigation = () => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <header
            className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50"
            dir={direction}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={handleHomeNavigation}
                    >
                        <div
                            className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Star className="w-7 h-7 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {t('headerTitle')}
                            </h1>
                            <p className="text-sm text-gray-600">{t('headerSubtitle')}</p>
                        </div>
                    </div>

                    {isUserRegistered && (
                        <nav className="hidden md:flex items-center gap-6">
                            {navigationItems.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                                    >
                                        <IconComponent className="w-5 h-5"/>
                                        {item.label}
                                    </button>
                                );
                            })}

                            <div className="relative">
                                <button
                                    className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                                    <Bell className="w-6 h-6"/>
                                    {notificationCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {t('notificationCount', {count: notificationCount})}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div
                                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200">
                                <div
                                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {userData.fullName?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {userData.fullName?.split(' ')[0] || t('user')}
                                </span>
                            </div>
                        </nav>
                    )}

                    <div className="flex items-center gap-4">
                        {!isUserRegistered && (
                            <button
                                onClick={() => handleNavigation('/platform')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                            >
                                {t('startNow')}
                            </button>
                        )}

                        <button
                            onClick={handleHomeNavigation}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                            <span className="hidden sm:block">{t('home')}</span>
                        </button>

                        {/* This is the general mobile control area */}
                        <div className="flex items-center gap-4">
                            <LanguageSelector /> {/* Place LanguageSelector here always for mobile */}
                            <button
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu Content (only appears when isMenuOpen is true and user is registered) */}
                {isMenuOpen && isUserRegistered && (
                    <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
                        <nav className="flex flex-col gap-2">
                            {navigationItems.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                                    >
                                        <IconComponent className="w-5 h-5"/>
                                        {item.label}
                                    </button>
                                );
                            })}

                            <div
                                className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 mt-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {userData.fullName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {userData.fullName || t('user')}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Bell className="w-5 h-5 text-gray-600"/>
                                    {notificationCount > 0 && (
                                        <span
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {notificationCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default PlatformHeader;