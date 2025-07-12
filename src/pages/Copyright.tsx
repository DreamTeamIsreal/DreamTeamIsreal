import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copyright as CopyrightIcon, Shield, FileText, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Copyright = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('copyright'); // Initialize useTranslation hook
  const rtl = i18n.dir() === 'rtl'; // Determine if current language is RTL

  const copyrightItems = [
    {
      category: t('protectedContent.categories.softwareAndCode.title'),
      items: [
        t('protectedContent.categories.softwareAndCode.items.0'),
        t('protectedContent.categories.softwareAndCode.items.1'),
        t('protectedContent.categories.softwareAndCode.items.2'),
        t('protectedContent.categories.softwareAndCode.items.3')
      ]
    },
    {
      category: t('protectedContent.categories.contentAndDesign.title'),
      items: [
        t('protectedContent.categories.contentAndDesign.items.0'),
        t('protectedContent.categories.contentAndDesign.items.1'),
        t('protectedContent.categories.contentAndDesign.items.2'),
        t('protectedContent.categories.contentAndDesign.items.3')
      ]
    },
    {
      category: t('protectedContent.categories.methodology.title'),
      items: [
        t('protectedContent.categories.methodology.items.0'),
        t('protectedContent.categories.methodology.items.1'),
        t('protectedContent.categories.methodology.items.2'),
        t('protectedContent.categories.methodology.items.3')
      ]
    },
    {
      category: t('protectedContent.categories.documents.title'),
      items: [
        t('protectedContent.categories.documents.items.0'),
        t('protectedContent.categories.documents.items.1'),
        t('protectedContent.categories.documents.items.2'),
        t('protectedContent.categories.documents.items.3')
      ]
    }
  ];

  const thirdPartyLicenses = [
    {
      name: "React",
      license: "MIT License",
      purpose: t('thirdPartyLicenses.licenses.0.purpose')
    },
    {
      name: "Tailwind CSS",
      license: "MIT License",
      purpose: t('thirdPartyLicenses.licenses.1.purpose')
    },
    {
      name: "Lucide React",
      license: "ISC License",
      purpose: t('thirdPartyLicenses.licenses.2.purpose')
    },
    {
      name: "Supabase",
      license: "Apache 2.0",
      purpose: t('thirdPartyLicenses.licenses.3.purpose')
    }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                {t('backButton')}
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-purple-100 rounded-full px-6 py-3 mb-6">
                  <CopyrightIcon className="w-6 h-6 text-purple-600" />
                  <span className="font-bold text-purple-800">{t('hero.tagline')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t('hero.title')}
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('hero.description')}
                </p>

                <div className="mt-6 text-sm text-gray-500">
                  {t('hero.copyrightNotice')}
                </div>
              </div>
            </div>
          </section>

          {/* Main Copyright Notice */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-8 mb-12">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-purple-900 mb-4">{t('copyrightNoticeSection.title')}</h2>
                    <div className="space-y-4 text-purple-800">
                      <p>
                        {t('copyrightNoticeSection.paragraph1')}
                      </p>
                      <p>
                        {t('copyrightNoticeSection.paragraph2')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protected Content */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('protectedContent.title')}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {copyrightItems.map((category, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
                        <ul className={`space-y-3 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                          {category.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>
              </div>

              {/* Usage Rights */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('allowedUsageRights.title')}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">{t('allowedUsageRights.personalUse.title')}</h3>
                    <ul className={`space-y-2 text-gray-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                      <li>{t('allowedUsageRights.personalUse.items.0')}</li>
                      <li>{t('allowedUsageRights.personalUse.items.1')}</li>
                      <li>{t('allowedUsageRights.personalUse.items.2')}</li>
                      <li>{t('allowedUsageRights.personalUse.items.3')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">{t('allowedUsageRights.academicUse.title')}</h3>
                    <ul className={`space-y-2 text-gray-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                      <li>{t('allowedUsageRights.academicUse.items.0')}</li>
                      <li>{t('allowedUsageRights.academicUse.items.1')}</li>
                      <li>{t('allowedUsageRights.academicUse.items.2')}</li>
                      <li>{t('allowedUsageRights.academicUse.items.3')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prohibited Uses */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('prohibitedUses.title')}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">{t('prohibitedUses.commercialUse.title')}</h3>
                        <ul className={`space-y-2 text-red-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                          <li>{t('prohibitedUses.commercialUse.items.0')}</li>
                          <li>{t('prohibitedUses.commercialUse.items.1')}</li>
                          <li>{t('prohibitedUses.commercialUse.items.2')}</li>
                          <li>{t('prohibitedUses.commercialUse.items.3')}</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">{t('prohibitedUses.modificationAndDistribution.title')}</h3>
                        <ul className={`space-y-2 text-red-700 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                          <li>{t('prohibitedUses.modificationAndDistribution.items.0')}</li>
                          <li>{t('prohibitedUses.modificationAndDistribution.items.1')}</li>
                          <li>{t('prohibitedUses.modificationAndDistribution.items.2')}</li>
                          <li>{t('prohibitedUses.modificationAndDistribution.items.3')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third Party Licenses */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('thirdPartyLicenses.title')}</h2>
                <p className="text-gray-700 mb-6">
                  {t('thirdPartyLicenses.description')}
                </p>
                <div className="space-y-4">
                  {thirdPartyLicenses.map((license, index) => (
                      <div key={index} className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{license.name}</h3>
                            <p className="text-sm text-gray-600">{license.purpose}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {license.license}
                      </span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* DMCA Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dmcaNotice.title')}</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    {t('dmcaNotice.paragraph1')}
                  </p>
                  <ul className={`space-y-2 ${rtl ? 'list-none pr-6' : 'list-disc pl-6'}`}>
                    <li>{t('dmcaNotice.items.0')}</li>
                    <li>{t('dmcaNotice.items.1')}</li>
                    <li>{t('dmcaNotice.items.2')}</li>
                    <li>{t('dmcaNotice.items.3')}</li>
                    <li>{t('dmcaNotice.items.4')}</li>
                  </ul>
                  <p>
                    {t('dmcaNotice.emailPrefix')} <strong>{t('dmcaNotice.emailAddress')}</strong>
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FileText className="w-8 h-8 text-gray-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{t('licenseRequests.title')}</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {t('licenseRequests.description')}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('licenseRequests.licensingAndPartnerships.title')}</h3>
                      <p className="text-gray-700">{t('licenseRequests.licensingAndPartnerships.email')}</p>
                      <p className="text-gray-700">{t('licenseRequests.licensingAndPartnerships.phone')}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t('licenseRequests.responseTime.title')}</h3>
                      <p className="text-gray-700">{t('licenseRequests.responseTime.standard')}</p>
                      <p className="text-gray-700">{t('licenseRequests.responseTime.urgent')}</p>
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

export default Copyright;