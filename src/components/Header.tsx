import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Star } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation(['platform', 'nav']);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const direction = i18n.dir(); // Get the current text direction

  if (!i18n.isInitialized || !t) {
    return (
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 z-50" dir={direction}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="md:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </header>
    );
  }

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 z-50" dir={direction}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {t('platform:title')}
                </h1>
                <p className="text-xs text-gray-600">{t('platform:subtitle')}</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button
                  onClick={() => scrollToSection('overview')}
                  className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                {t('nav:overview')}
              </button>
              <button
                  onClick={() => scrollToSection('features')}
                  className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                {t('nav:features')}
              </button>
              <button
                  onClick={() => scrollToSection('platform')}
                  className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                {t('nav:platform')}
              </button>
              <button
                  onClick={() => scrollToSection('candidates')}
                  className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                {t('nav:candidates')}
              </button>
              <LanguageSelector />
              <button
                  onClick={() => navigate('/platform')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                {t('nav:start')}
              </button>
            </nav>

            <div className="md:hidden flex items-center gap-4">
              <NotificationBell />
              <LanguageSelector />
              <button
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
                <nav className="flex flex-col gap-4">
                  <button
                      onClick={() => scrollToSection('overview')}
                      className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    {t('nav:overview')}
                  </button>
                  <button
                      onClick={() => scrollToSection('features')}
                      className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    {t('nav:features')}
                  </button>
                  <button
                      onClick={() => scrollToSection('platform')}
                      className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    {t('nav:platform')}
                  </button>
                  <button
                      onClick={() => scrollToSection('candidates')}
                      className={`text-gray-700 hover:text-blue-600 transition-colors font-medium ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    {t('nav:candidates')}
                  </button>
                  <button
                      onClick={() => navigate('/platform')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg text-center"
                  >
                    {t('nav:start')}
                  </button>
                </nav>
              </div>
          )}
        </div>
      </header>
  );
};

export default Header;