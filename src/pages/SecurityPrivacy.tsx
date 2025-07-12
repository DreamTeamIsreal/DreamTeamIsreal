import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server, Key, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const SecurityPrivacy = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['securityPrivacy', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const securityFeatures = [
    {
      icon: Lock,
      title: t('securityPrivacy:securityFeatures.feature1.title'),
      description: t('securityPrivacy:securityFeatures.feature1.description'),
      details: [
        t('securityPrivacy:securityFeatures.feature1.detail1'),
        t('securityPrivacy:securityFeatures.feature1.detail2'),
        t('securityPrivacy:securityFeatures.feature1.detail3'),
        t('securityPrivacy:securityFeatures.feature1.detail4')
      ]
    },
    {
      icon: Key,
      title: t('securityPrivacy:securityFeatures.feature2.title'),
      description: t('securityPrivacy:securityFeatures.feature2.description'),
      details: [
        t('securityPrivacy:securityFeatures.feature2.detail1'),
        t('securityPrivacy:securityFeatures.feature2.detail2'),
        t('securityPrivacy:securityFeatures.feature2.detail3'),
        t('securityPrivacy:securityFeatures.feature2.detail4')
      ]
    },
    {
      icon: Server,
      title: t('securityPrivacy:securityFeatures.feature3.title'),
      description: t('securityPrivacy:securityFeatures.feature3.description'),
      details: [
        t('securityPrivacy:securityFeatures.feature3.detail1'),
        t('securityPrivacy:securityFeatures.feature3.detail2'),
        t('securityPrivacy:securityFeatures.feature3.detail3'),
        t('securityPrivacy:securityFeatures.feature3.detail4')
      ]
    },
    {
      icon: Eye,
      title: t('securityPrivacy:securityFeatures.feature4.title'),
      description: t('securityPrivacy:securityFeatures.feature4.description'),
      details: [
        t('securityPrivacy:securityFeatures.feature4.detail1'),
        t('securityPrivacy:securityFeatures.feature4.detail2'),
        t('securityPrivacy:securityFeatures.feature4.detail3'),
        t('securityPrivacy:securityFeatures.feature4.detail4')
      ]
    }
  ];

  const complianceStandards = [
    {
      name: "ISO 27001",
      description: t('securityPrivacy:complianceStandards.standard1.description')
    },
    {
      name: "GDPR",
      description: t('securityPrivacy:complianceStandards.standard2.description')
    },
    {
      name: t('securityPrivacy:complianceStandards.standard3.name'),
      description: t('securityPrivacy:complianceStandards.standard3.description')
    },
    {
      name: "SOC 2 Type II",
      description: t('securityPrivacy:complianceStandards.standard4.description')
    }
  ];

  const dataProtection = [
    {
      phase: t('securityPrivacy:dataProtectionLifecycle.phase1.phase'),
      description: t('securityPrivacy:dataProtectionLifecycle.phase1.description'),
      measures: [
        t('securityPrivacy:dataProtectionLifecycle.phase1.measure1'),
        t('securityPrivacy:dataProtectionLifecycle.phase1.measure2'),
        t('securityPrivacy:dataProtectionLifecycle.phase1.measure3')
      ]
    },
    {
      phase: t('securityPrivacy:dataProtectionLifecycle.phase2.phase'),
      description: t('securityPrivacy:dataProtectionLifecycle.phase2.description'),
      measures: [
        t('securityPrivacy:dataProtectionLifecycle.phase2.measure1'),
        t('securityPrivacy:dataProtectionLifecycle.phase2.measure2'),
        t('securityPrivacy:dataProtectionLifecycle.phase2.measure3')
      ]
    },
    {
      phase: t('securityPrivacy:dataProtectionLifecycle.phase3.phase'),
      description: t('securityPrivacy:dataProtectionLifecycle.phase3.description'),
      measures: [
        t('securityPrivacy:dataProtectionLifecycle.phase3.measure1'),
        t('securityPrivacy:dataProtectionLifecycle.phase3.measure2'),
        t('securityPrivacy:dataProtectionLifecycle.phase3.measure3')
      ]
    },
    {
      phase: t('securityPrivacy:dataProtectionLifecycle.phase4.phase'),
      description: t('securityPrivacy:dataProtectionLifecycle.phase4.description'),
      measures: [
        t('securityPrivacy:dataProtectionLifecycle.phase4.measure1'),
        t('securityPrivacy:dataProtectionLifecycle.phase4.measure2'),
        t('securityPrivacy:dataProtectionLifecycle.phase4.measure3')
      ]
    }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                {t('common:backToHomePage')}
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-6 py-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-blue-800">{t('securityPrivacy:hero.tag')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t('securityPrivacy:hero.title')}
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('securityPrivacy:hero.description')}
                </p>
              </div>
            </div>
          </section>

          {/* Security Promise */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-white text-center">
                <Shield className="w-20 h-20 mx-auto mb-8" />
                <h2 className="text-3xl font-bold mb-6">{t('securityPrivacy:securityPromise.title')}</h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  {t('securityPrivacy:securityPromise.description')}
                </p>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('securityPrivacy:securityFeatures.mainTitle')}</h2>
                <p className="text-lg text-gray-600">{t('securityPrivacy:securityFeatures.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {securityFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                      <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                        <ul className={`space-y-3 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                          {feature.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">{detail}</span>
                              </li>
                          ))}
                        </ul>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Data Protection Lifecycle */}
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('securityPrivacy:dataProtectionLifecycle.title')}</h2>
                <p className="text-lg text-gray-600">{t('securityPrivacy:dataProtectionLifecycle.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {dataProtection.map((phase, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{phase.phase}</h3>
                      <p className="text-gray-600 mb-4">{phase.description}</p>
                      <div className="space-y-2">
                        {phase.measures.map((measure, measureIndex) => (
                            <div key={measureIndex} className="bg-gray-50 rounded-lg px-3 py-2">
                              <span className="text-sm text-gray-700">{measure}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('securityPrivacy:complianceStandards.title')}</h2>
                <p className="text-lg text-gray-600">{t('securityPrivacy:complianceStandards.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {complianceStandards.map((standard, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{standard.name}</h3>
                        <p className="text-gray-600 text-sm">{standard.description}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Security Measures */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('securityPrivacy:additionalSecurityMeasures.title')}</h2>
              </div>

              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('securityPrivacy:additionalSecurityMeasures.monitoring.title')}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('securityPrivacy:additionalSecurityMeasures.monitoring.continuousMonitoring.title')}</h4>
                      <ul className={`space-y-2 text-gray-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.continuousMonitoring.item1')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.continuousMonitoring.item2')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.continuousMonitoring.item3')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.continuousMonitoring.item4')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('securityPrivacy:additionalSecurityMeasures.monitoring.accessControl.title')}</h4>
                      <ul className={`space-y-2 text-gray-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.accessControl.item1')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.accessControl.item2')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.accessControl.item3')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.monitoring.accessControl.item4')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.title')}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.emergencyPlan.title')}</h4>
                      <ul className={`space-y-2 text-gray-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.emergencyPlan.item1')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.emergencyPlan.item2')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.emergencyPlan.item3')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.emergencyPlan.item4')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.reportingAndTransparency.title')}</h4>
                      <ul className={`space-y-2 text-gray-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.reportingAndTransparency.item1')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.reportingAndTransparency.item2')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.reportingAndTransparency.item3')}</li>
                        <li>{t('securityPrivacy:additionalSecurityMeasures.incidentResponse.reportingAndTransparency.item4')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* User Guidelines */}
          <section className="py-16 bg-yellow-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start gap-4 mb-8">
                <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('securityPrivacy:userGuidelines.title')}</h2>
                  <p className="text-gray-700 mb-6">
                    {t('securityPrivacy:userGuidelines.subtitle')}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t('securityPrivacy:userGuidelines.whatToDo.title')}</h3>
                  <ul className={`space-y-3 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatToDo.item1')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatToDo.item2')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatToDo.item3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatToDo.item4')}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">{t('securityPrivacy:userGuidelines.whatNotToDo.title')}</h3>
                  <ul className={`space-y-3 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatNotToDo.item1')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatNotToDo.item2')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatNotToDo.item3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">{t('securityPrivacy:userGuidelines.whatNotToDo.item4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="py-16 bg-gradient-to-br from-blue-600 to-green-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">{t('securityPrivacy:contact.title')}</h2>
              <p className="text-lg text-blue-100 mb-8">
                {t('securityPrivacy:contact.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                    onClick={() => navigate('/contact')}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg"
                >
                  {t('securityPrivacy:contact.contactUsButton')}
                </button>

                <a
                    href="mailto:security@dreamteam.gov.il"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-bold text-lg"
                >
                  security@dreamteam.gov.il
                </a>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default SecurityPrivacy;