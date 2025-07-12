import React from 'react';
import { Award, FileText, Eye, DollarSign, Shield, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CandidateShowcase = () => {
  // Initialize useTranslation with the 'candidateShowcase' namespace
  const { t, i18n } = useTranslation('candidateShowcase');

  // Determine the text direction for RTL support
  const rtl = i18n.dir() === 'rtl';

  const transparencyFeatures = [
    {
      icon: Award,
      title: t('requirements.policeApproval.title'),
      description: t('requirements.policeApproval.description')
    },
    {
      icon: DollarSign,
      title: t('requirements.assetDeclaration.title'),
      description: t('requirements.assetDeclaration.description')
    },
    {
      icon: Shield,
      title: t('requirements.conflictOfInterest.title'),
      description: t('requirements.conflictOfInterest.description')
    },
    {
      icon: FileText,
      title: t('requirements.fiveYearPlan.title'),
      description: t('requirements.fiveYearPlan.description')
    },
    {
      icon: Clock,
      title: t('requirements.annualPlan.title'),
      description: t('requirements.annualPlan.description')
    },
    {
      icon: Eye,
      title: t('requirements.cv.title'),
      description: t('requirements.cv.description')
    }
  ];

  // Sample candidate data (assuming these are dynamic and might not be directly translated via i18n keys)
  const sampleCandidate = {
    name: "דר' שרה לוי", // Name is typically not translated
    position: "מועמדת לשר החינוך", // This might come from a translated source or be a key itself
    experience: "15 שנות ניסיון בחינוך",
    education: "דוקטורט במדעי החינוך, אוניברסיטת תל אביב",
    vision: "מערכת חינוך שמכשירה לעתיד",
    achievements: [
      t('sampleCandidate.achievements.item1'),
      t('sampleCandidate.achievements.item2'),
      t('sampleCandidate.achievements.item3')
    ]
  };

  return (
      // Apply dir attribute to the main section for RTL support
      <section id="candidates" className="py-20 bg-gray-50" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('heading.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('heading.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Transparency Requirements */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {t('requirements.title')}
              </h3>

              <div className="grid gap-4">
                {transparencyFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                      <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                  );
                })}
              </div>

              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">{t('requirements.importantNote.title')}</h4>
                <p className="text-blue-800 text-sm">
                  {t('requirements.importantNote.description')}
                </p>
              </div>
            </div>

            {/* Sample Candidate Profile */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    {/* Assuming the initial is the first letter of the name */}
                    <span className="text-2xl font-bold">{sampleCandidate.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{sampleCandidate.name}</h3>
                    <p className="text-blue-100">{sampleCandidate.position}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('sampleCandidate.sections.professionalBackground')}</h4>
                  <p className="text-gray-600">{sampleCandidate.experience}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('sampleCandidate.sections.education')}</h4>
                  <p className="text-gray-600">{sampleCandidate.education}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('sampleCandidate.sections.vision')}</h4>
                  <p className="text-gray-600">{sampleCandidate.vision}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('sampleCandidate.sections.keyAchievements')}</h4>
                  <div className="space-y-2">
                    {sampleCandidate.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 text-sm">{achievement}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">{t('sampleCandidate.stats.match')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">{t('sampleCandidate.stats.supporters')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.8</div>
                    <div className="text-sm text-gray-600">{t('sampleCandidate.stats.rating')}</div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  {t('sampleCandidate.viewFullPlanButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default CandidateShowcase;