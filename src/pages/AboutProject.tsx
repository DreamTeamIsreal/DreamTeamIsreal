import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Users, Shield, Zap, Globe, Star, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AboutProject = () => {
  const navigate = useNavigate();
  // Destructure t (translation function) and i18n (i18n instance) from useTranslation
  // 'aboutProject' is the namespace where these translations reside.
  const { t, i18n } = useTranslation('aboutProject');

  // Determine direction based on i18n's current language direction or your custom isRTL
  // Using i18n.dir() is generally preferred if react-i18next manages direction.
  const rtl = i18n.dir() === 'rtl';

  const principles = [
    {
      icon: Target,
      title: t('principles.directMandate.title'),
      description: t('principles.directMandate.description')
    },
    {
      icon: Shield,
      title: t('principles.transparency.title'),
      description: t('principles.transparency.description')
    },
    {
      icon: Users,
      title: t('principles.professionalism.title'),
      description: t('principles.professionalism.description')
    },
    {
      icon: Zap,
      title: t('principles.stability.title'),
      description: t('principles.stability.description')
    }
  ];

  const timeline = [
    { year: "2024", title: t('timeline.2024.title'), description: t('timeline.2024.description') },
    { year: "2025", title: t('timeline.2025.title'), description: t('timeline.2025.description') },
    { year: "2026", title: t('timeline.2026.title'), description: t('timeline.2026.description') },
    { year: "2027", title: t('timeline.2027.title'), description: t('timeline.2027.description') },
    { year: "2028", title: t('timeline.2028.title'), description: t('timeline.2028.description') }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className={`py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-6 py-3 mb-8">
                <Star className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">{t('hero.title')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                {t('hero.heading1')}
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.heading2')}
              </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t('hero.description')}
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className={`py-20 bg-white ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">{t('mission.title')}</h2>
                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                    <p>{t('mission.description1')}</p>
                    <p>{t('mission.description2')}</p>
                    <p>{t('mission.description3')}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-black text-blue-600 mb-2">18</div>
                      <div className="text-sm text-gray-600">{t('mission.stats.ministers')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-purple-600 mb-2">12</div>
                      <div className="text-sm text-gray-600">{t('mission.stats.districts')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-600 mb-2">100</div>
                      <div className="text-sm text-gray-600">{t('mission.stats.questions')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-orange-600 mb-2">15</div>
                      <div className="text-sm text-gray-600">{t('mission.stats.committees')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Principles Section */}
          <section className={`py-20 bg-gray-50 ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('principles.title')}</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('principles.description')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {principles.map((principle, index) => {
                  const IconComponent = principle.icon;
                  return (
                      <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{principle.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className={`py-20 bg-white ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('timeline.title')}</h2>
                <p className="text-xl text-gray-600">{t('timeline.description')}</p>
              </div>

              <div className="space-y-8">
                {timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">{item.year}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className={`py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold mb-8">{t('team.title')}</h2>
              <p className="text-xl text-blue-100 mb-12 leading-relaxed">{t('team.description')}</p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t('team.stateExperts.title')}</h3>
                  <p className="text-blue-100 text-sm">{t('team.stateExperts.description')}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t('team.techExperts.title')}</h3>
                  <p className="text-blue-100 text-sm">{t('team.techExperts.description')}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{t('team.socialActivists.title')}</h3>
                  <p className="text-blue-100 text-sm">{t('team.socialActivists.description')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={`py-20 bg-gray-50 ${rtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">{t('cta.title')}</h2>
              <p className="text-xl text-gray-600 mb-12">{t('cta.description')}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                    onClick={() => navigate('/platform')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg"
                >
                  {t('cta.joinPlatform')}
                </button>

                <button
                    onClick={() => navigate('/contact')}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg"
                >
                  {t('cta.contactUs')}
                </button>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default AboutProject;