import React from 'react';
import { Vote, Users2, Building, Shield, BarChart3, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const KeyFeatures = () => {
  // Initialize useTranslation with the 'keyFeaturesSection' namespace
  const { t, i18n } = useTranslation('keyFeaturesSection');

  // Determine the text direction for RTL support using i18n.dir()
  const rtl = i18n.dir() === 'rtl';

  const features = [
    {
      icon: Vote,
      title: t('features.newElectionSystem.title'),
      subtitle: t('features.newElectionSystem.subtitle'),
      description: t('features.newElectionSystem.description'),
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: Building,
      title: t('features.smallProfessionalGovernment.title'),
      subtitle: t('features.smallProfessionalGovernment.subtitle'),
      description: t('features.smallProfessionalGovernment.description'),
      color: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      icon: Shield,
      title: t('features.transparencyAccountability.title'),
      subtitle: t('features.transparencyAccountability.subtitle'),
      description: t('features.transparencyAccountability.description'),
      color: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: Users2,
      title: t('features.adaptedRegionalRepresentation.title'),
      subtitle: t('features.adaptedRegionalRepresentation.subtitle'),
      description: t('features.adaptedRegionalRepresentation.description'),
      color: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
    {
      icon: BarChart3,
      title: t('features.continuousEvaluation.title'),
      subtitle: t('features.continuousEvaluation.subtitle'),
      description: t('features.continuousEvaluation.description'),
      color: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100"
    },
    {
      icon: Smartphone,
      title: t('features.digitalPlatform.title'),
      subtitle: t('features.digitalPlatform.subtitle'),
      description: t('features.digitalPlatform.description'),
      color: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100"
    }
  ];

  return (
      // Apply dir attribute to the main section for RTL support
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-white" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-50 rounded-full px-6 py-3 mb-6">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">{t('heading.tagline')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('heading.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('heading.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                  <div
                      key={index}
                      className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/50`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-sm font-semibold text-blue-600 mb-4">
                      {feature.subtitle}
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Gradient border effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
};

export default KeyFeatures;