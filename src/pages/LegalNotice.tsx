import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Building, AlertTriangle, FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const LegalNotice = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['legalNotice', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                {t('common:backToHomePage')}
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-red-100 rounded-full px-6 py-3 mb-6">
                  <Scale className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-red-800">{t('legalNotice:hero.tag')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t('legalNotice:hero.title')}
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('legalNotice:hero.description')}
                </p>

                <div className="mt-6 text-sm text-gray-500">
                  {t('legalNotice:hero.lastUpdate')}
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-12">
                {/* Company Info */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Building className="w-8 h-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">{t('legalNotice:companyInfo.title')}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">{t('legalNotice:companyInfo.generalInfo.title')}</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>{t('legalNotice:companyInfo.generalInfo.companyName')}</strong></p>
                        <p><strong>{t('legalNotice:companyInfo.generalInfo.companyNumber')}</strong></p>
                        <p><strong>{t('legalNotice:companyInfo.generalInfo.authorizedDealerNumber')}</strong></p>
                        <p><strong>{t('legalNotice:companyInfo.generalInfo.status')}</strong></p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">{t('legalNotice:companyInfo.officialAddress.title')}</h3>
                      <div className="space-y-2 text-gray-700">
                        <p>{t('legalNotice:companyInfo.officialAddress.street')}</p>
                        <p>{t('legalNotice:companyInfo.officialAddress.cityZip')}</p>
                        <p>{t('legalNotice:companyInfo.officialAddress.country')}</p>
                        <p><strong>{t('legalNotice:companyInfo.officialAddress.phone')}</strong></p>
                        <p><strong>{t('legalNotice:companyInfo.officialAddress.email')}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('legalNotice:legalStatus.title')}</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      {t('legalNotice:legalStatus.paragraph1')}
                    </p>
                    <p>
                      {t('legalNotice:legalStatus.paragraph2')}
                    </p>
                  </div>
                </div>

                {/* Disclaimers */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                    <h2 className="text-2xl font-bold text-gray-900">{t('legalNotice:disclaimers.title')}</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t('legalNotice:disclaimers.generalResponsibility.title')}</h3>
                      <p className="text-gray-700">
                        {t('legalNotice:disclaimers.generalResponsibility.paragraph')}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t('legalNotice:disclaimers.userContent.title')}</h3>
                      <p className="text-gray-700">
                        {t('legalNotice:disclaimers.userContent.paragraph')}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">{t('legalNotice:disclaimers.politicalDecisions.title')}</h3>
                      <p className="text-gray-700">
                        {t('legalNotice:disclaimers.politicalDecisions.paragraph')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Intellectual Property */}
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('legalNotice:intellectualProperty.title')}</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      {t('legalNotice:intellectualProperty.paragraph1')}
                    </p>
                    <p>
                      {t('legalNotice:intellectualProperty.paragraph2')}
                    </p>
                    <p>
                      {t('legalNotice:intellectualProperty.paragraph3')}
                    </p>
                  </div>
                </div>

                {/* Governing Law */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('legalNotice:governingLaw.title')}</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      {t('legalNotice:governingLaw.paragraph1')}
                    </p>
                    <p>
                      {t('legalNotice:governingLaw.paragraph2')}
                    </p>
                  </div>
                </div>

                {/* Updates */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('legalNotice:updates.title')}</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      {t('legalNotice:updates.paragraph1')}
                    </p>
                    <p>
                      {t('legalNotice:updates.paragraph2')}
                    </p>
                    <p>
                      {t('legalNotice:updates.paragraph3')}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">{t('legalNotice:contact.title')}</h2>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      {t('legalNotice:contact.description')}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{t('legalNotice:contact.legalAdvisor.title')}</h3>
                        <p className="text-gray-700">{t('legalNotice:contact.legalAdvisor.name')}</p>
                        <p className="text-gray-700">{t('legalNotice:contact.legalAdvisor.email')}</p>
                        <p className="text-gray-700">{t('legalNotice:contact.legalAdvisor.phone')}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{t('legalNotice:contact.responseTime.title')}</h3>
                        <p className="text-gray-700">{t('legalNotice:contact.responseTime.hours')}</p>
                        <p className="text-gray-700">{t('legalNotice:contact.responseTime.responsePeriod')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default LegalNotice;