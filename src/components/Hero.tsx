import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Users, Shield, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Hero = () => {
  const navigate = useNavigate();
  // Initialize useTranslation with the 'heroSection' namespace
  const { t, i18n } = useTranslation('heroSection');

  // Determine the text direction for RTL support using i18n.dir()
  const rtl = i18n.dir() === 'rtl';

  const navigateToPlatform = () => {
    navigate('/platform');
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      // Apply dir attribute to the main section for RTL support
      <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-12">
            {/* Main heading */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/50">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">{t('hero.tagline')}</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {t('hero.headingPart1')}
              </span>
                <br />
                <span className="text-gray-900">{t('hero.headingPart2')}</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* Key benefits */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('benefits.directElection.title')}</h3>
                <p className="text-gray-600">{t('benefits.directElection.description')}</p>
              </div>

              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('benefits.fullTransparency.title')}</h3>
                <p className="text-gray-600">{t('benefits.fullTransparency.description')}</p>
              </div>

              <div className="group">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('benefits.maximumEfficiency.title')}</h3>
                <p className="text-gray-600">{t('benefits.maximumEfficiency.description')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                  onClick={navigateToPlatform}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 font-bold text-xl shadow-2xl hover:shadow-3xl"
              >
              <span className="flex items-center gap-3">
                {t('cta.buildTeamButton')}
                {/* Apply rtl:rotate-180 for ArrowLeft icon to point right in RTL */}
                <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </span>
              </button>

              <button
                  onClick={scrollToFeatures}
                  className="group border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold text-xl"
              >
              <span className="flex items-center gap-3">
                {t('cta.learnMoreButton')}
                {/* Apply rtl:rotate-180 for ArrowLeft icon to point right in RTL */}
                <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">18</div>
                <div className="text-sm text-gray-600 font-medium">{t('stats.ministersLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-purple-600 mb-2">12</div>
                <div className="text-sm text-gray-600 font-medium">{t('stats.districtsLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-indigo-600 mb-2">100</div>
                <div className="text-sm text-gray-600 font-medium">{t('stats.matchingQuestionsLabel')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">15</div>
                <div className="text-sm text-gray-600 font-medium">{t('stats.knessetCommitteesLabel')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
  );
};

export default Hero;