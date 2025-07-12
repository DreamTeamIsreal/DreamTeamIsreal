import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const TermsOfService = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['termsOfService', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const sections = [
    {
      title: t('termsOfService:section1.title'),
      content: [
        t('termsOfService:section1.item1'),
        t('termsOfService:section1.item2'),
        t('termsOfService:section1.item3'),
        t('termsOfService:section1.item4')
      ]
    },
    {
      title: t('termsOfService:section2.title'),
      content: [
        t('termsOfService:section2.item1'),
        t('termsOfService:section2.item2'),
        t('termsOfService:section2.item3'),
        t('termsOfService:section2.item4')
      ]
    },
    {
      title: t('termsOfService:section3.title'),
      content: [
        t('termsOfService:section3.item1'),
        t('termsOfService:section3.item2'),
        t('termsOfService:section3.item3'),
        t('termsOfService:section3.item4')
      ]
    },
    {
      title: t('termsOfService:section4.title'),
      content: [
        t('termsOfService:section4.item1'),
        t('termsOfService:section4.item2'),
        t('termsOfService:section4.item3'),
        t('termsOfService:section4.item4')
      ]
    },
    {
      title: t('termsOfService:section5.title'),
      content: [
        t('termsOfService:section5.item1'),
        t('termsOfService:section5.item2'),
        t('termsOfService:section5.item3'),
        t('termsOfService:section5.item4')
      ]
    },
    {
      title: t('termsOfService:section6.title'),
      content: [
        t('termsOfService:section6.item1'),
        t('termsOfService:section6.item2'),
        t('termsOfService:section6.item3'),
        t('termsOfService:section6.item4')
      ]
    },
    {
      title: t('termsOfService:section7.title'),
      content: [
        t('termsOfService:section7.item1'),
        t('termsOfService:section7.item2'),
        t('termsOfService:section7.item3'),
        t('termsOfService:section7.item4')
      ]
    },
    {
      title: t('termsOfService:section8.title'),
      content: [
        t('termsOfService:section8.item1'),
        t('termsOfService:section8.item2'),
        t('termsOfService:section8.item3'),
        t('termsOfService:section8.item4')
      ]
    }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                {t('common:backToHomePage')}
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-6 py-3 mb-6">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <span className="font-bold text-gray-800">{t('termsOfService:hero.tag')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t('termsOfService:hero.title')}
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('termsOfService:hero.description')}
                </p>

                <div className="mt-6 text-sm text-gray-500">
                  {t('termsOfService:hero.lastUpdate')}
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-12">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">{t('termsOfService:importantNotice.title')}</h3>
                    <p className="text-yellow-700 text-sm">
                      {t('termsOfService:importantNotice.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="space-y-12">
                  {sections.map((section, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          {section.title}
                        </h2>
                        <ul className={`space-y-4 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                          {section.content.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                <p className="text-gray-700">{item}</p>
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-16 bg-blue-50 border border-blue-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4">{t('termsOfService:contactSection.title')}</h3>
                <p className="text-blue-800 mb-6">
                  {t('termsOfService:contactSection.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                      onClick={() => navigate('/contact')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    {t('termsOfService:contactSection.contactButton')}
                  </button>
                  <a
                      href="mailto:legal@dreamteam.gov.il"
                      className="border border-blue-300 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors font-semibold text-center"
                  >
                    legal@dreamteam.gov.il
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default TermsOfService;