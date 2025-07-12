import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['privacyPolicy', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const dataTypes = [
    {
      icon: UserCheck,
      title: t('privacyPolicy:dataCollection.dataTypes.personalInfo.title'),
      items: [
        t('privacyPolicy:dataCollection.dataTypes.personalInfo.item1'),
        t('privacyPolicy:dataCollection.dataTypes.personalInfo.item2'),
        t('privacyPolicy:dataCollection.dataTypes.personalInfo.item3'),
        t('privacyPolicy:dataCollection.dataTypes.personalInfo.item4')
      ]
    },
    {
      icon: Lock,
      title: t('privacyPolicy:dataCollection.dataTypes.contactInfo.title'),
      items: [
        t('privacyPolicy:dataCollection.dataTypes.contactInfo.item1'),
        t('privacyPolicy:dataCollection.dataTypes.contactInfo.item2'),
        t('privacyPolicy:dataCollection.dataTypes.contactInfo.item3')
      ]
    },
    {
      icon: Database,
      title: t('privacyPolicy:dataCollection.dataTypes.politicalInfo.title'),
      items: [
        t('privacyPolicy:dataCollection.dataTypes.politicalInfo.item1'),
        t('privacyPolicy:dataCollection.dataTypes.politicalInfo.item2'),
        t('privacyPolicy:dataCollection.dataTypes.politicalInfo.item3')
      ]
    },
    {
      icon: Eye,
      title: t('privacyPolicy:dataCollection.dataTypes.technicalInfo.title'),
      items: [
        t('privacyPolicy:dataCollection.dataTypes.technicalInfo.item1'),
        t('privacyPolicy:dataCollection.dataTypes.technicalInfo.item2'),
        t('privacyPolicy:dataCollection.dataTypes.technicalInfo.item3'),
        t('privacyPolicy:dataCollection.dataTypes.technicalInfo.item4')
      ]
    }
  ];

  const protectionMeasures = [
    {
      title: t('privacyPolicy:protectionMeasures.measures.measure1.title'),
      description: t('privacyPolicy:protectionMeasures.measures.measure1.description')
    },
    {
      title: t('privacyPolicy:protectionMeasures.measures.measure2.title'),
      description: t('privacyPolicy:protectionMeasures.measures.measure2.description')
    },
    {
      title: t('privacyPolicy:protectionMeasures.measures.measure3.title'),
      description: t('privacyPolicy:protectionMeasures.measures.measure3.description')
    },
    {
      title: t('privacyPolicy:protectionMeasures.measures.measure4.title'),
      description: t('privacyPolicy:protectionMeasures.measures.measure4.description')
    }
  ];

  const userRights = [
    t('privacyPolicy:userRights.rightsList.right1'),
    t('privacyPolicy:userRights.rightsList.right2'),
    t('privacyPolicy:userRights.rightsList.right3'),
    t('privacyPolicy:userRights.rightsList.right4'),
    t('privacyPolicy:userRights.rightsList.right5'),
    t('privacyPolicy:userRights.rightsList.right6')
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                {t('common:backToHomePage')}
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-green-100 rounded-full px-6 py-3 mb-6">
                  <Shield className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-800">{t('privacyPolicy:hero.tag')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t('privacyPolicy:hero.title')}
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('privacyPolicy:hero.description')}
                </p>

                <div className="mt-6 text-sm text-gray-500">
                  {t('privacyPolicy:hero.lastUpdate')}
                </div>
              </div>
            </div>
          </section>

          {/* Data Collection */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('privacyPolicy:dataCollection.title')}</h2>
                <p className="text-lg text-gray-600">{t('privacyPolicy:dataCollection.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dataTypes.map((type, index) => {
                  const IconComponent = type.icon;
                  return (
                      <div key={index} className="bg-gray-50 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{type.title}</h3>
                        <ul className={`space-y-2 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                          {type.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                {item}
                              </li>
                          ))}
                        </ul>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('privacyPolicy:howWeUseData.title')}</h2>
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('privacyPolicy:howWeUseData.purposes.title')}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('privacyPolicy:howWeUseData.purposes.platformServices.title')}</h4>
                      <ul className={`space-y-2 text-gray-600 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        <li>{t('privacyPolicy:howWeUseData.purposes.platformServices.item1')}</li>
                        <li>{t('privacyPolicy:howWeUseData.purposes.platformServices.item2')}</li>
                        <li>{t('privacyPolicy:howWeUseData.purposes.platformServices.item3')}</li>
                        <li>{t('privacyPolicy:howWeUseData.purposes.platformServices.item4')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('privacyPolicy:howWeUseData.purposes.serviceImprovement.title')}</h4>
                      <ul className={`space-y-2 text-gray-600 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        <li>{t('privacyPolicy:howWeUseData.purposes.serviceImprovement.item1')}</li>
                        <li>{t('privacyPolicy:howWeUseData.purposes.serviceImprovement.item2')}</li>
                        <li>{t('privacyPolicy:howWeUseData.purposes.serviceImprovement.item3')}</li>
                        <li>{t('privacyPolicy:howWeUseData.purposes.serviceImprovement.item4')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-2">{t('privacyPolicy:howWeUseData.privacyCommitment.title')}</h3>
                      <p className="text-blue-800">
                        {t('privacyPolicy:howWeUseData.privacyCommitment.paragraph')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Protection Measures */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('privacyPolicy:protectionMeasures.title')}</h2>
                <p className="text-lg text-gray-600">{t('privacyPolicy:protectionMeasures.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {protectionMeasures.map((measure, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{measure.title}</h3>
                      <p className="text-gray-600 text-sm">{measure.description}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('privacyPolicy:userRights.title')}</h2>
                <p className="text-lg text-gray-600">{t('privacyPolicy:userRights.subtitle')}</p>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('privacyPolicy:userRights.yourRightsAsUsers.title')}</h3>
                    <ul className="space-y-4">
                      {userRights.map((right, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            <span className="text-gray-700">{right}</span>
                          </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('privacyPolicy:userRights.howToExerciseRights.title')}</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('privacyPolicy:userRights.howToExerciseRights.platform.title')}</h4>
                        <p className="text-sm text-gray-600">{t('privacyPolicy:userRights.howToExerciseRights.platform.description')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('privacyPolicy:userRights.howToExerciseRights.directContact.title')}</h4>
                        <p className="text-sm text-gray-600">{t('privacyPolicy:userRights.howToExerciseRights.directContact.description')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{t('privacyPolicy:userRights.howToExerciseRights.responseTime.title')}</h4>
                        <p className="text-sm text-gray-600">{t('privacyPolicy:userRights.howToExerciseRights.responseTime.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">{t('privacyPolicy:contact.title')}</h2>
              <p className="text-lg text-green-100 mb-8">
                {t('privacyPolicy:contact.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                    onClick={() => navigate('/contact')}
                    className="bg-white text-green-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg"
                >
                  {t('privacyPolicy:contact.contactUsButton')}
                </button>

                <a
                    href="mailto:privacy@dreamteam.gov.il"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 font-bold text-lg"
                >
                  privacy@dreamteam.gov.il
                </a>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default PrivacyPolicy;