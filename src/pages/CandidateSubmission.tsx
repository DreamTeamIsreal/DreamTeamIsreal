import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Upload, Check, ArrowLeft, ArrowRight, Users, Award, Camera, HelpCircle } from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';
import { useTranslation } from 'react-i18next';
import MatchQuiz from './MatchQuiz';
import apiService from '../lib/api';

const CandidateSubmission = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [candidateType, setCandidateType] = useState('');
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    position: '',
    committee: '',
    experience: '',
    education: '',
    vision: '',

    // Documents
    policeRecord: null,
    wealthDeclaration: null,
    conflictOfInterest: null,
    cv: null,
    profileImage: null,

    // Plans
    fiveYearPlan: '',
    vision2048: '',
    yearlyPlan: '',

    // Additional
    videoUrl: '',
    customQuestion: '',

    // Match Quiz Answers
    matchQuizAnswers: {} // New state to store quiz answers
  });

  const { t, i18n } = useTranslation(['candidateSubmission', 'common']);
  const rtl = i18n.dir() === 'rtl';

  const positions = [
    t('positions.primeMinister'),
    t('positions.ministerOfDefense'),
    t('positions.ministerOfFinance'),
    t('positions.ministerOfEducation'),
    t('positions.ministerOfHealth'),
    t('positions.ministerOfTransport'),
    t('positions.ministerOfJustice'),
    t('positions.ministerOfHousingAndConstruction'),
    t('positions.ministerOfInterior'),
    t('positions.ministerOfForeignAffairs'),
    t('positions.ministerOfEnergy'),
    t('positions.ministerOfEnvironmentalProtection'),
    t('positions.ministerOfCultureAndSport'),
    t('positions.ministerOfAliyahAndIntegration'),
    t('positions.ministerOfWelfare'),
    t('positions.ministerOfAgriculture'),
    t('positions.ministerOfIndustryAndTrade'),
    t('positions.ministerOfDiaspora')
  ];

  const committees = [
    t('committees.knessetCommittee'),
    t('committees.financeCommittee'),
    t('committees.economyCommittee'),
    t('committees.foreignAffairsAndDefenseCommittee'),
    t('committees.interiorAndEnvironmentalProtectionCommittee'),
    t('committees.internalSecurityCommittee'),
    t('committees.specialNationalInfrastructureProjectsAndJewishReligiousServicesCommittee'),
    t('committees.constitutionLawAndJusticeCommittee'),
    t('committees.aliyahAbsorptionAndDiasporaAffairsCommittee'),
    t('committees.educationCultureAndSportCommittee'),
    t('committees.laborAndWelfareCommittee'),
    t('committees.healthCommittee'),
    t('committees.stateControlCommittee'),
    t('committees.advancementOfWomenAndGenderEqualityCommittee'),
    t('committees.scienceAndTechnologyCommittee')
  ];

  // Define steps with the new quiz step
  const steps = [
    { number: 1, title: t('steps.typeOfCandidacy'), icon: Users },
    { number: 2, title: t('steps.personalDetails'), icon: User },
    { number: 3, title: t('steps.requiredDocuments'), icon: FileText },
    { number: 4, title: t('steps.workPlans'), icon: Award },
    { number: 5, title: t('steps.matchQuiz'), icon: HelpCircle }, // New step for the Match Quiz
    { number: 6, title: t('steps.submissionComplete'), icon: Check } // Final step shifted
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  // Callback function to receive quiz answers
  const handleQuizComplete = (quizAnswers: Record<string, number>) => {
    setFormData(prev => ({
      ...prev,
      matchQuizAnswers: quizAnswers
    }));
    nextStep(); // Move to the next step (submission complete) after quiz
  };

  const nextStep = () => {
    // Total number of steps now matches steps.length
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepare candidate data for API submission
      const candidateData = {
        name: formData.fullName,
        type: candidateType as 'minister' | 'committee',
        position: candidateType === 'minister' ? formData.position : formData.committee,
        experience: formData.experience,
        education: formData.education,
        vision: formData.vision,
        plans: candidateType === 'minister' ? {
          fiveYearPlan: formData.fiveYearPlan,
          vision2048: formData.vision2048,
          yearlyPlan: formData.yearlyPlan
        } : {
          yearlyPlan: formData.yearlyPlan
        },
        videoUrl: formData.videoUrl,
        // Note: File uploads would need special handling in a real implementation
        documents: {
          cv: formData.cv ? 'uploaded' : undefined,
          policeRecord: formData.policeRecord ? 'uploaded' : undefined,
          wealthDeclaration: formData.wealthDeclaration ? 'uploaded' : undefined,
          conflictOfInterest: formData.conflictOfInterest ? 'uploaded' : undefined
        }
      };

      const response = await apiService.submitCandidateApplication(candidateData);
      
      if (response.success) {
        alert(t('submissionSuccessAlert'));
        navigate('/platform');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(t('common:submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUserRegistered = localStorage.getItem('userRegistered') === 'true';

  if (!isUserRegistered) {
    return (
        <div className={`min-h-screen bg-gray-50 ${rtl ? 'rtl' : 'ltr'}`}>
          <PlatformHeader />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('notRegistered.title')}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('notRegistered.description')}
            </p>
            <button
                onClick={() => navigate('/platform')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              {t('notRegistered.startButton')}
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${rtl ? 'rtl' : 'ltr'}`}>
        <PlatformHeader />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('mainHeading.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('mainHeading.description')}
            </p>
          </div>

          {/* Progress Steps - MODIFIED FOR RTL */}
          <div className="flex justify-center mb-12">
            <div className={`flex items-center justify-between w-full max-w-4xl ${rtl ? 'flex-row-reverse' : ''}`}>
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                    <React.Fragment key={step.number}>
                      <div className="flex flex-col items-center flex-shrink-0 text-center">
                        <div className={`flex items-center justify-center w-14 h-14 rounded-full border-3 transition-all duration-300 ${
                            isCompleted ? 'bg-green-500 border-green-500 text-white shadow-lg' :
                                isActive ? 'bg-blue-500 border-blue-500 text-white shadow-lg scale-110' :
                                    'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isCompleted ? <Check className="w-7 h-7" /> : <IconComponent className="w-7 h-7" />}
                        </div>
                        <div className={`mt-3 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] mx-auto">
                            {t('steps.stepNumber', { number: step.number })}
                          </div>
                          <div className="text-xs whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] mx-auto">
                            {step.title}
                          </div>
                        </div>
                      </div>
                      {/* Connecting line - Only render if not the last step */}
                      {index < steps.length - 1 && (
                          <div className={`flex-1 h-1 ${rtl ? 'ml-2' : 'mr-2'} rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                          // The mx-2 was changed to conditional ml-2 or mr-2
                          // This might be the culprit. Let's try removing it entirely and relying on flex-1 and justify-between
                          // OR keeping mx-2 as it applies margin to both sides
                      )}
                    </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Step 1: Candidate Type Selection */}
            {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <Users className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('step1.title')}</h2>
                    <p className="text-lg text-gray-600">{t('step1.description')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div
                        onClick={() => setCandidateType('minister')}
                        className={`p-8 rounded-2xl border-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            candidateType === 'minister'
                                ? 'border-blue-500 bg-blue-50 shadow-xl'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                        }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('step1.ministerCard.title')}</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {t('step1.ministerCard.description')}
                        </p>
                      </div>
                    </div>

                    <div
                        onClick={() => setCandidateType('committee')}
                        className={`p-8 rounded-2xl border-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            candidateType === 'committee'
                                ? 'border-green-500 bg-green-50 shadow-xl'
                                : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                        }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('step1.committeeCard.title')}</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {t('step1.committeeCard.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('step2.title')}</h2>
                    <p className="text-lg text-gray-600">{t('step2.description')}</p>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="text-center mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t('step2.profileImage.label')} *
                    </label>
                    <div className="flex flex-col items-center">
                      <label htmlFor="profile-image-upload" className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group">
                        {formData.profileImage ? (
                            <img
                                src={URL.createObjectURL(formData.profileImage)}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="text-center">
                              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                              <p className="text-xs text-gray-500">{t('step2.profileImage.uploadText')}</p>
                            </div>
                        )}
                        <input
                            id="profile-image-upload"
                            type="file"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileUpload('profileImage', e.target.files?.[0] || null)}
                            className="hidden"
                            accept="image/*"
                        />
                      </label>
                      <p className="text-xs text-gray-500">{t('step2.profileImage.requirements')}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('step2.fullName.label')} *
                      </label>
                      <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t('step2.fullName.placeholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {candidateType === 'minister' ? t('step2.desiredPosition.label') : t('step2.desiredCommittee.label')} *
                      </label>
                      <select
                          value={candidateType === 'minister' ? formData.position : formData.committee}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange(candidateType === 'minister' ? 'position' : 'committee', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">{candidateType === 'minister' ? t('step2.desiredPosition.placeholder') : t('step2.desiredCommittee.placeholder')}</option>
                        {(candidateType === 'minister' ? positions : committees).map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('step2.professionalExperience.label')} *
                    </label>
                    <textarea
                        value={formData.experience}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('experience', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('step2.professionalExperience.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('step2.education.label')} *
                    </label>
                    <textarea
                        value={formData.education}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('education', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('step2.education.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('step2.personalVision.label')} *
                    </label>
                    <textarea
                        value={formData.vision}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('vision', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('step2.personalVision.placeholder')}
                    />
                  </div>
                </div>
            )}

            {/* Step 3: Required Documents */}
            {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('step3.title')}</h2>
                    <p className="text-lg text-gray-600">{t('step3.description')}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      { key: 'policeRecord', title: t('step3.documents.policeRecord'), required: true },
                      { key: 'wealthDeclaration', title: t('step3.documents.wealthDeclaration'), required: true },
                      { key: 'conflictOfInterest', title: t('step3.documents.conflictOfInterest'), required: true },
                      { key: 'cv', title: t('step3.documents.cv'), required: true }
                    ].map((doc) => (
                        <div key={doc.key} className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {doc.title} {doc.required && '*'}
                          </label>
                          <label htmlFor={`file-upload-${doc.key}`} className="border-2 border-dashed border-gray-300 rounded-xl p-6 lg:p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors cursor-pointer group h-56">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
                            <p className="text-sm text-gray-600 mb-2">{t('step3.uploadArea.dragDrop')}</p>
                            <p className="text-xs text-gray-500">{t('step3.uploadArea.fileTypes')}</p>
                            <input
                                id={`file-upload-${doc.key}`}
                                type="file"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">{t('step3.importantNotes.title')}</h4>
                    <ul className={`text-sm text-blue-800 space-y-2 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                      <li>{t('step3.importantNotes.note1')}</li>
                      <li>{t('step3.importantNotes.note2')}</li>
                      <li>{t('step3.importantNotes.note3')}</li>
                      <li>{t('step3.importantNotes.note4')}</li>
                    </ul>
                  </div>
                </div>
            )}

            {/* Step 4: Work Plans (only for ministers) */}
            {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {candidateType === 'minister' ? t('step4.ministerTitle') : t('step4.committeeTitle')}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {candidateType === 'minister'
                          ? t('step4.ministerDescription')
                          : t('step4.committeeDescription')}
                    </p>
                  </div>

                  {candidateType === 'minister' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('step4.fiveYearPlan.label')} *
                          </label>
                          <textarea
                              value={formData.fiveYearPlan}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('fiveYearPlan', e.target.value)}
                              rows={6}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder={t('step4.fiveYearPlan.placeholder')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('step4.vision2048.label')} *
                          </label>
                          <textarea
                              value={formData.vision2048}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('vision2048', e.target.value)}
                              rows={6}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder={t('step4.vision2048.placeholder')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('step4.yearlyPlan.label')} *
                          </label>
                          <textarea
                              value={formData.yearlyPlan}
                              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('yearlyPlan', e.target.value)}
                              rows={6}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder={t('step4.yearlyPlan.placeholder')}
                          />
                        </div>
                      </>
                  ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('step4.committeeWorkPlan.label')} *
                        </label>
                        <textarea
                            value={formData.yearlyPlan}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('yearlyPlan', e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={t('step4.committeeWorkPlan.placeholder')}
                        />
                      </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('step4.videoLink.label')}
                    </label>
                    <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('videoUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('step4.videoLink.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('step4.customQuestion.label')}
                    </label>
                    <textarea
                        value={formData.customQuestion}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('customQuestion', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t('step4.customQuestion.placeholder')}
                    />
                  </div>
                </div>
            )}

            {/* Step 5: Match Quiz */}
            {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('step5.quizTitle')}</h2>
                    <p className="text-lg text-gray-600">{t('step5.quizDescription')}</p>
                  </div>
                  {/* The MatchQuiz component will manage its own UI and navigation within itself */}
                  {/* Pass a callback function to MatchQuiz to receive the answers and advance the step */}
                  <MatchQuiz onQuizComplete={handleQuizComplete} />
                </div>
            )}

            {/* Step 6: Completion */}
            {currentStep === 6 && (
                <div className="text-center space-y-8">
                  <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-16 h-16 text-white" />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900">{t('step6.title')}</h2> {/* Adjusted translation key */}

                  <div className={`bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto ${rtl ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-bold text-gray-900 mb-6 text-xl">{t('step6.summary.title')}</h3>
                    <div className="space-y-3 text-gray-700">
                      <p><span className="font-medium">{t('step6.summary.name')}:</span> {formData.fullName}</p>
                      <p><span className="font-medium">{t('step6.summary.candidacyType')}:</span> {candidateType === 'minister' ? t('step6.summary.minister') : t('step6.summary.committeeMember')}</p>
                      <p><span className="font-medium">{candidateType === 'minister' ? t('step6.summary.position') : t('step6.summary.committee')}:</span> {candidateType === 'minister' ? formData.position : formData.committee}</p>
                      <p><span className="font-medium">{t('step6.summary.profileImage')}:</span> {formData.profileImage ? t('step6.summary.uploaded') : t('step6.summary.notUploaded')}</p>
                      <p><span className="font-medium">{t('step6.summary.documents')}:</span> {[formData.policeRecord, formData.wealthDeclaration, formData.conflictOfInterest, formData.cv].filter(Boolean).length}/4 {t('step6.summary.uploadedCount')}</p>
                      {/* Display number of quiz answers */}
                      <p><span className="font-medium">{t('step6.summary.quizCompleted')}:</span> {Object.keys(formData.matchQuizAnswers).length > 0 ? t('step6.summary.yes') : t('step6.summary.no')}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto">
                    <p className="text-blue-800 leading-relaxed">
                      {t('step6.submissionInfo.part1')} {/* Adjusted translation key */}
                      {candidateType === 'minister' && t('step6.submissionInfo.ministerSpecific')} {/* Adjusted translation key */}
                    </p>
                  </div>

                  <button
                      onClick={submitApplication}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {t('step6.submitButton')} {/* Adjusted translation key */}
                  </button>
                </div>
            )}

            {/* Navigation Buttons (conditionally rendered) */}
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              {/* Show Previous button if not on the first step */}
              {currentStep > 1 && (
                  <button
                      onClick={prevStep}
                      disabled={currentStep === 1 || currentStep === 5} // Disable Prev button on quiz step, quiz handles its own navigation
                      className="flex items-center gap-2 px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <ArrowLeft className={`w-5 h-5 ${rtl ? 'rtl:rotate-180' : ''}`} />
                    {t('navigation.previous')}
                  </button>
              )}

              {/* Show Next button if not on the final step (submission complete) AND not on the quiz step */}
              {currentStep < steps.length && currentStep !== 5 && (
                  <button
                      onClick={nextStep}
                      disabled={
                          (currentStep === 1 && !candidateType) ||
                          (currentStep === 2 && (!formData.fullName || !(candidateType === 'minister' ? formData.position : formData.committee) || !formData.profileImage)) ||
                          // Add validation for other steps if necessary, e.g., required documents
                          (currentStep === 3 && (
                              !formData.policeRecord ||
                              !formData.wealthDeclaration ||
                              !formData.conflictOfInterest ||
                              !formData.cv
                          )) ||
                          (currentStep === 4 && (
                              candidateType === 'minister' && (!formData.fiveYearPlan || !formData.vision2048 || !formData.yearlyPlan) ||
                              candidateType === 'committee' && !formData.yearlyPlan
                          ))
                      }
                      className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold ${currentStep === 1 ? 'ml-auto' : ''}`}
                  >
                    {t('navigation.next')}
                    <ArrowRight className={`w-5 h-5 ${rtl ? 'rtl:rotate-180' : ''}`} />
                  </button>
              )}

              {/* If on the first step, and no "Previous" button is shown, ensure "Next" is aligned right */}
              {currentStep === 1 && (
                  <div className="flex-1" /> // Spacer to push the next button to the right
              )}

            </div>
          </div>
        </div>
      </div>
  );
};

export default CandidateSubmission;