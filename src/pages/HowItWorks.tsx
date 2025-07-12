import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Users, Vote, Shield, BarChart, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const HowItWorks = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['howItWorks', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const steps = [
    {
      number: "01",
      title: t('howItWorks:step1.title'),
      description: t('howItWorks:step1.description'),
      details: [
        t('howItWorks:step1.detail1'),
        t('howItWorks:step1.detail2'),
        t('howItWorks:step1.detail3'),
        t('howItWorks:step1.detail4')
      ],
      icon: Shield,
      color: "from-red-500 to-red-600"
    },
    {
      number: "02",
      title: t('howItWorks:step2.title'),
      description: t('howItWorks:step2.description'),
      details: [
        t('howItWorks:step2.detail1'),
        t('howItWorks:step2.detail2'),
        t('howItWorks:step2.detail3'),
        t('howItWorks:step2.detail4')
      ],
      icon: Vote,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "03",
      title: t('howItWorks:step3.title'),
      description: t('howItWorks:step3.description'),
      details: [
        t('howItWorks:step3.detail1'),
        t('howItWorks:step3.detail2'),
        t('howItWorks:step3.detail3'),
        t('howItWorks:step3.detail4')
      ],
      icon: BarChart,
      color: "from-green-500 to-green-600"
    },
    {
      number: "04",
      title: t('howItWorks:step4.title'),
      description: t('howItWorks:step4.description'),
      details: [
        t('howItWorks:step4.detail1'),
        t('howItWorks:step4.detail2'),
        t('howItWorks:step4.detail3'),
        t('howItWorks:step4.detail4')
      ],
      icon: Users,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const features = [
    {
      title: t('howItWorks:features.feature1.title'),
      description: t('howItWorks:features.feature1.description'),
      icon: "🔒"
    },
    {
      title: t('howItWorks:features.feature2.title'),
      description: t('howItWorks:features.feature2.description'),
      icon: "👁️"
    },
    {
      title: t('howItWorks:features.feature3.title'),
      description: t('howItWorks:features.feature3.description'),
      icon: "🎯"
    },
    {
      title: t('howItWorks:features.feature4.title'),
      description: t('howItWorks:features.feature4.description'),
      icon: "⚡"
    }
  ];

  const timeline = [
    { phase: t('howItWorks:timeline.step1.phase'), duration: t('howItWorks:timeline.step1.duration'), description: t('howItWorks:timeline.step1.description') },
    { phase: t('howItWorks:timeline.step2.phase'), duration: t('howItWorks:timeline.step2.duration'), description: t('howItWorks:timeline.step2.description') },
    { phase: t('howItWorks:timeline.step3.phase'), duration: t('howItWorks:timeline.step3.duration'), description: t('howItWorks:timeline.step3.description') },
    { phase: t('howItWorks:timeline.step4.phase'), duration: t('howItWorks:timeline.step4.duration'), description: t('howItWorks:timeline.step4.description') }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-3 bg-indigo-100 rounded-full px-6 py-3 mb-8">
                <Play className="w-6 h-6 text-indigo-600" />
                <span className="font-bold text-indigo-800">{t('howItWorks:hero.tag')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                {t('howItWorks:hero.titlePart1')}
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('howItWorks:hero.titlePart2')}
              </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
                {t('howItWorks:hero.description')}
              </p>

              <button
                  onClick={() => navigate('/platform')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg"
              >
                {t('howItWorks:hero.startButton')}
              </button>
            </div>
          </section>

          {/* Timeline Overview */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('howItWorks:timeline.title')}</h2>
                <p className="text-xl text-gray-600">{t('howItWorks:timeline.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {timeline.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.phase}</h3>
                      <div className="text-2xl font-black text-indigo-600 mb-2">{item.duration}</div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-3 bg-green-100 rounded-full px-6 py-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-800">{t('howItWorks:timeline.total')}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Steps */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('howItWorks:detailedSteps.title')}</h2>
                <p className="text-xl text-gray-600">{t('howItWorks:detailedSteps.subtitle')}</p>
              </div>

              <div className="space-y-20">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  const isEven = index % 2 === 0;

                  return (
                      <div key={index} className={`flex items-center gap-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-6">
                            <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-500">{t('howItWorks:detailedSteps.stepNumber', { number: step.number })}</div>
                              <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                            </div>
                          </div>

                          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {step.description}
                          </p>

                          <ul className={`space-y-3 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                            {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                  <span className="text-gray-700">{detail}</span>
                                </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex-1">
                          <div className={`bg-gradient-to-br ${step.color} rounded-3xl p-12 text-white`}>
                            <div className="text-center">
                              <div className="text-6xl font-black mb-4">{step.number}</div>
                              <div className="text-2xl font-bold mb-4">{step.title}</div>
                              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                                <IconComponent className="w-16 h-16 mx-auto mb-4" />
                                <p className="text-white/90">{t('howItWorks:cardGenericText')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('howItWorks:features.title')}</h2>
                <p className="text-xl text-gray-600">{t('howItWorks:features.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="text-center bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Flow */}
          <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">{t('howItWorks:processFlow.title')}</h2>
                <p className="text-xl text-indigo-100">{t('howItWorks:processFlow.subtitle')}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="font-bold">{t('howItWorks:processFlow.step1')}</div>
                </div>

                <ArrowRight className={`w-8 h-8 text-white/60 ${rtl ? 'rtl:rotate-180' : ''}`} />

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Vote className="w-8 h-8" />
                  </div>
                  <div className="font-bold">{t('howItWorks:processFlow.step2')}</div>
                </div>

                <ArrowRight className={`w-8 h-8 text-white/60 ${rtl ? 'rtl:rotate-180' : ''}`} />

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="w-8 h-8" />
                  </div>
                  <div className="font-bold">{t('howItWorks:processFlow.step3')}</div>
                </div>

                <ArrowRight className={`w-8 h-8 text-white/60 ${rtl ? 'rtl:rotate-180' : ''}`} />

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="font-bold">{t('howItWorks:processFlow.step4')}</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">{t('howItWorks:cta.title')}</h2>
              <p className="text-xl text-gray-600 mb-12">
                {t('howItWorks:cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                    onClick={() => navigate('/platform')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg"
                >
                  {t('howItWorks:cta.startButton')}
                </button>

                <button
                    onClick={() => navigate('/faq')}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg"
                >
                  {t('howItWorks:cta.faqButton')}
                </button>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default HowItWorks;