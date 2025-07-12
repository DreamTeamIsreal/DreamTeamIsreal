import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, UserCheck, FileText, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const PlatformDemo = () => {
  // Initialize useTranslation with the 'platformDemoSection' namespace
  const { t, i18n } = useTranslation('platformDemoSection');

  // Determine the text direction for RTL support using i18n.dir()
  const rtl = i18n.dir() === 'rtl';

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'security',
      icon: Lock,
      title: t('steps.security.title'),
      description: t('steps.security.description'),
      features: [
        t('steps.security.features.feature1'),
        t('steps.security.features.feature2'),
        t('steps.security.features.feature3'),
        t('steps.security.features.feature4')
      ],
      color: "from-red-500 to-red-600"
    },
    {
      id: 'candidates',
      icon: UserCheck,
      title: t('steps.candidates.title'),
      description: t('steps.candidates.description'),
      features: [
        t('steps.candidates.features.feature1'),
        t('steps.candidates.features.feature2'),
        t('steps.candidates.features.feature3'),
        t('steps.candidates.features.feature4')
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 'voting',
      icon: FileText,
      title: t('steps.voting.title'),
      description: t('steps.voting.description'),
      features: [
        t('steps.voting.features.feature1'),
        t('steps.voting.features.feature2'),
        t('steps.voting.features.feature3'),
        t('steps.voting.features.feature4')
      ],
      color: "from-green-500 to-green-600"
    },
    {
      id: 'results',
      icon: BarChart,
      title: t('steps.results.title'),
      description: t('steps.results.description'),
      features: [
        t('steps.results.features.feature1'),
        t('steps.results.features.feature2'),
        t('steps.results.features.feature3'),
        t('steps.results.features.feature4')
      ],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const currentStep = steps[activeStep];
  const IconComponent = currentStep.icon;

  return (
      // Apply dir attribute to the main section for RTL support
      <section id="platform" className="py-20 bg-white" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('heading.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('heading.description')}
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 bg-gray-100 rounded-full p-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                    <button
                        key={step.id}
                        onClick={() => setActiveStep(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                            activeStep === index
                                ? 'bg-white shadow-md text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      <StepIcon className="w-5 h-5" />
                      <span className="hidden sm:block font-medium">{step.title}</span>
                    </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentStep.color} rounded-2xl flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {currentStep.title}
                </h3>

                <p className="text-lg text-gray-600">
                  {currentStep.description}
                </p>
              </div>

              <div className="space-y-3">
                {currentStep.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {/* For RTL, ChevronRight should point left, so it needs to be rotated */}
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                  {t('navigationButtons.previous')}
                </button>
                <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {t('navigationButtons.next')}
                  {/* For RTL, ChevronLeft should point right, so it needs to be rotated */}
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className={`bg-gradient-to-br ${currentStep.color} rounded-3xl p-8 shadow-2xl`}>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                      <h4 className="text-white font-bold text-xl">{t('demoInterface.title')}</h4>
                    </div>

                    {activeStep === 0 && (
                        <div className="space-y-3">
                          <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                              <span className="text-white">{t('demoInterface.security.item1')}</span>
                            </div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                              <span className="text-white">{t('demoInterface.security.item2')}</span>
                            </div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                              <span className="text-white">{t('demoInterface.security.item3')}</span>
                            </div>
                          </div>
                        </div>
                    )}

                    {activeStep === 1 && (
                        <div className="space-y-3">
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.candidates.name', { name: "יוסי כהן" })}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.candidates.position', { position: "שר החינוך" })}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.candidates.experience', { years: 15 })}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.candidates.policeApproval')}</span>
                          </div>
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div className="space-y-3">
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.voting.question', { current: 1, total: 100, topic: "התקציב לחינוך" })}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.voting.match', { percentage: 87 })}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.voting.recommendedCandidate', { name: "יוסי כהן" })}</span>
                          </div>
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="space-y-3">
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.results.districtParticipation', { district: "תל אביב", percentage: 45 })}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.results.leadingTeam')}</span>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <span className="text-white text-sm">{t('demoInterface.results.realtimeUpdate')}</span>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default PlatformDemo;