import React from 'react';
import { Target, Scale, Eye, Zap, Globe, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const SystemOverview = () => {
  // Initialize useTranslation with the 'systemOverviewSection' namespace
  const { t, i18n } = useTranslation('systemOverviewSection');

  // Determine the text direction for RTL support using i18n.dir()
  const rtl = i18n.dir() === 'rtl';

  const principles = [
    {
      icon: Target,
      title: t('principles.directMandate.title'),
      description: t('principles.directMandate.description')
    },
    {
      icon: Scale,
      title: t('principles.professionalism.title'),
      description: t('principles.professionalism.description')
    },
    {
      icon: Eye,
      title: t('principles.transparency.title'),
      description: t('principles.transparency.description')
    },
    {
      icon: Zap,
      title: t('principles.stability.title'),
      description: t('principles.stability.description')
    },
    {
      icon: CheckCircle,
      title: t('principles.integrity.title'),
      description: t('principles.integrity.description')
    },
    {
      icon: Globe,
      title: t('principles.modernGovernance.title'),
      description: t('principles.modernGovernance.description')
    }
  ];

  return (
      // Apply dir attribute to the main section for RTL support
      <section id="overview" className="py-24 bg-white" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-6 py-3 mb-6">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">{t('heading.tagline')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('heading.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('heading.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                  <div
                      key={index}
                      className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {principle.description}
                    </p>

                    {/* Gradient border effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
};

export default SystemOverview;