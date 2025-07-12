import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Vote, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CallToAction = () => {
  const navigate = useNavigate();
  // Initialize useTranslation with the 'ctaSection' namespace
  const { t, i18n } = useTranslation('ctaSection');

  // Determine the text direction for RTL support
  const rtl = i18n.dir() === 'rtl';

  const navigateToPlatform = () => {
    navigate('/platform');
  };

  // Translate the labels within the stats array
  const stats = [
    { number: "18", label: t('stats.ministersLabel'), icon: Users },
    { number: "12", label: t('stats.districtsLabel'), icon: Vote },
    { number: "100", label: t('stats.matchingQuestionsLabel'), icon: Star },
    { number: "15", label: t('stats.knessetCommitteesLabel'), icon: Users }
  ];

  return (
      // Apply dir attribute to the main section for RTL support
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white">{t('hero.tagline')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('hero.heading')}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                    <div className="text-blue-100 font-medium">{stat.label}</div>
                  </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
                onClick={navigateToPlatform}
                className="group bg-white text-blue-600 px-10 py-5 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 font-bold text-xl shadow-2xl"
            >
            <span className="flex items-center gap-3">
              {t('buttons.buildTeam')}
              {/* Apply rtl:rotate-180 for ArrowLeft icon to point right in RTL */}
              <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </span>
            </button>

            <button className="group border-2 border-white text-white px-10 py-5 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-bold text-xl">
            <span className="flex items-center gap-3">
              {t('buttons.downloadDocument')}
              {/* Apply rtl:rotate-180 for ArrowLeft icon to point right in RTL */}
              <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </span>
            </button>
          </div>

          {/* Additional info */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">{t('info.interestedTitle')}</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                {t('info.interestedDescription')}
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                {t('info.readMoreIdea')}
                {/* Apply rtl:rotate-180 for ArrowLeft icon to point right in RTL */}
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">{t('community.joinTitle')}</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                {t('community.joinDescription')}
              </p>
              <div className="flex gap-3">
                <input
                    type="email"
                    placeholder={t('community.emailPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm"
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  {t('community.subscribeButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default CallToAction;