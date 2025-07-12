import React from 'react';
import { Lightbulb, Users, Vote, Shield, Target, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AboutIdea = () => {
  // Destructure t (translation function) and i18n (i18n instance) from useTranslation
  // 'aboutIdea' is the namespace where these translations reside.
  const { t, i18n } = useTranslation('aboutIdea');

  // Determine direction based on i18n's current language direction or your custom isRTL
  const rtl = i18n.dir() === 'rtl';

  const problems = [
    {
      title: t('problems.trustCrisis.title'),
      description: t('problems.trustCrisis.description'),
      icon: "😞"
    },
    {
      title: t('problems.instability.title'),
      description: t('problems.instability.description'),
      icon: "⚡"
    },
    {
      title: t('problems.misrepresentation.title'),
      description: t('problems.misrepresentation.description'),
      icon: "🗳️"
    },
    {
      title: t('problems.lackOfTransparency.title'),
      description: t('problems.lackOfTransparency.description'),
      icon: "🔒"
    }
  ];

  const solutions = [
    {
      icon: Vote,
      title: t('solutions.directElection.title'),
      description: t('solutions.directElection.description'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: t('solutions.regionalRepresentation.title'),
      description: t('solutions.regionalRepresentation.description'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: t('solutions.fullTransparency.title'),
      description: t('solutions.fullTransparency.description'),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Target,
      title: t('solutions.professionalism.title'),
      description: t('solutions.professionalism.description'),
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    t('benefits.stableGovernment'),
    t('benefits.fullTransparency'),
    t('benefits.increasedAccountability'),
    t('benefits.fairRepresentation'),
    t('benefits.governmentalProfessionalism'),
    t('benefits.strengthenedDemocracy')
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className={`py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50 ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-3 bg-purple-100 rounded-full px-6 py-3 mb-8">
                <Lightbulb className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">{t('hero.title')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                {t('hero.heading1')}
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('hero.heading2')}
              </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t('hero.description')}
              </p>
            </div>
          </section>

          {/* Problem Section */}
          <section className={`py-20 bg-white ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('problems.title')}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('problems.description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {problems.map((problem, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                      <div className="text-4xl mb-4">{problem.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{problem.title}</h3>
                      <p className="text-sm text-gray-600">{problem.description}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Solution Section */}
          <section className={`py-20 bg-gray-50 ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('solutions.title')}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {t('solutions.description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {solutions.map((solution, index) => {
                  const IconComponent = solution.icon;
                  return (
                      <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{solution.description}</p>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className={`py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">{t('benefits.title')}</h2>
                <p className="text-xl text-blue-100">{t('benefits.description')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <CheckCircle className="w-8 h-8 text-green-300 mx-auto mb-4" />
                      <span className="font-semibold">{benefit}</span>
                    </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default AboutIdea;