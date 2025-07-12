import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { User, FileText, Award, Camera, Upload, Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import apiService from '../lib/api';

interface CandidateFormData {
  // Step 1: Personal Info
  fullName: string;
  candidacyType: 'Minister' | 'Knesset Committee';
  desiredPosition: string;
  desiredCommittee: string;
  professionalExperience: string;
  education: string;
  personalVision: string;

  // Step 2: Documents
  profileImage: File | null;
  policeRecord: File | null;
  wealthDeclaration: File | null;
  conflictOfInterest: File | null;
  cv: File | null;

  // Step 3: Work Plans
  fiveYearPlan: string;
  longTermVision2048: string;
  detailedAnnualPlan: string;
  visionAndWorkPlanInCommittee: string;

  // Step 4: Additional
  introductionVideoLink: string;
  additionalDebateQuestion: string;
}

interface MultiStepCandidateFormProps {
  onSuccess?: (candidateId: string) => void;
  onError?: (error: string) => void;
  initialData?: Partial<CandidateFormData>;
}

const MultiStepCandidateForm: React.FC<MultiStepCandidateFormProps> = ({
  onSuccess,
  onError,
  initialData = {}
}) => {
  const { t, i18n } = useTranslation(['candidateSubmission', 'common']);
  const rtl = i18n.dir() === 'rtl';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CandidateFormData>({
    fullName: '',
    candidacyType: 'Minister',
    desiredPosition: '',
    desiredCommittee: '',
    professionalExperience: '',
    education: '',
    personalVision: '',
    profileImage: null,
    policeRecord: null,
    wealthDeclaration: null,
    conflictOfInterest: null,
    cv: null,
    fiveYearPlan: '',
    longTermVision2048: '',
    detailedAnnualPlan: '',
    visionAndWorkPlanInCommittee: '',
    introductionVideoLink: '',
    additionalDebateQuestion: '',
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const steps = [
    { number: 1, title: t('steps.personalDetails'), icon: User },
    { number: 2, title: t('steps.requiredDocuments'), icon: FileText },
    { number: 3, title: t('steps.workPlans'), icon: Award },
    { number: 4, title: t('steps.additionalInfo'), icon: Camera }
  ];

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

  const handleInputChange = (field: keyof CandidateFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDraftSaved(false);
  };

  const handleFileUpload = (field: keyof CandidateFormData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    setDraftSaved(false);
  };

  const saveDraft = async () => {
    try {
      setIsSavingDraft(true);
      
      const candidateData = {
        ...formData,
        status: 'draft'
      };

      const response = await apiService.submitCandidateApplication(candidateData);
      
      if (response.success) {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 3000);
      } else {
        throw new Error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const submitApplication = async () => {
    try {
      setIsSubmitting(true);
      
      const candidateData = {
        ...formData,
        status: 'pending_review'
      };

      const response = await apiService.submitCandidateApplication(candidateData);
      
      if (response.success) {
        onSuccess?.(response.data?.candidateId || '');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.professionalExperience && formData.education && formData.personalVision);
      case 2:
        return !!(formData.profileImage && formData.cv);
      case 3:
        return !!(formData.fiveYearPlan && formData.detailedAnnualPlan);
      case 4:
        return true; // Additional info is optional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.fullName')} *
                </label>
                                 <input
                   type="text"
                   value={formData.fullName}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder={t('fields.fullNamePlaceholder')}
                 />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.candidacyType')} *
                </label>
                                 <select
                   value={formData.candidacyType}
                   onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('candidacyType', e.target.value as 'Minister' | 'Knesset Committee')}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                  <option value="Minister">{t('candidacyTypes.minister')}</option>
                  <option value="Knesset Committee">{t('candidacyTypes.committee')}</option>
                </select>
              </div>
            </div>

            {formData.candidacyType === 'Minister' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.desiredPosition')} *
                </label>
                <select
                  value={formData.desiredPosition}
                  onChange={(e) => handleInputChange('desiredPosition', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('fields.selectPosition')}</option>
                  {positions.map((position, index) => (
                    <option key={index} value={position}>{position}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.desiredCommittee')} *
                </label>
                <select
                  value={formData.desiredCommittee}
                  onChange={(e) => handleInputChange('desiredCommittee', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t('fields.selectCommittee')}</option>
                  {committees.map((committee, index) => (
                    <option key={index} value={committee}>{committee}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.professionalExperience')} *
              </label>
              <textarea
                value={formData.professionalExperience}
                onChange={(e) => handleInputChange('professionalExperience', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.professionalExperiencePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.education')} *
              </label>
              <textarea
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.educationPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.personalVision')} *
              </label>
              <textarea
                value={formData.personalVision}
                onChange={(e) => handleInputChange('personalVision', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.personalVisionPlaceholder')}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.profileImage')} *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('profileImage', e.target.files?.[0] || null)}
                  className="hidden"
                  id="profileImage"
                />
                <label htmlFor="profileImage" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {formData.profileImage ? formData.profileImage.name : t('fields.clickToUpload')}
                  </p>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.cv')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('cv', e.target.files?.[0] || null)}
                    className="hidden"
                    id="cv"
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      {formData.cv ? formData.cv.name : t('fields.uploadCV')}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.policeRecord')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('policeRecord', e.target.files?.[0] || null)}
                    className="hidden"
                    id="policeRecord"
                  />
                  <label htmlFor="policeRecord" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      {formData.policeRecord ? formData.policeRecord.name : t('fields.uploadPoliceRecord')}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.wealthDeclaration')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('wealthDeclaration', e.target.files?.[0] || null)}
                    className="hidden"
                    id="wealthDeclaration"
                  />
                  <label htmlFor="wealthDeclaration" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      {formData.wealthDeclaration ? formData.wealthDeclaration.name : t('fields.uploadWealthDeclaration')}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.conflictOfInterest')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('conflictOfInterest', e.target.files?.[0] || null)}
                    className="hidden"
                    id="conflictOfInterest"
                  />
                  <label htmlFor="conflictOfInterest" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      {formData.conflictOfInterest ? formData.conflictOfInterest.name : t('fields.uploadConflictOfInterest')}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.fiveYearPlan')} *
              </label>
              <textarea
                value={formData.fiveYearPlan}
                onChange={(e) => handleInputChange('fiveYearPlan', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.fiveYearPlanPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.longTermVision2048')}
              </label>
              <textarea
                value={formData.longTermVision2048}
                onChange={(e) => handleInputChange('longTermVision2048', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.longTermVision2048Placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.detailedAnnualPlan')} *
              </label>
              <textarea
                value={formData.detailedAnnualPlan}
                onChange={(e) => handleInputChange('detailedAnnualPlan', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.detailedAnnualPlanPlaceholder')}
              />
            </div>

            {formData.candidacyType === 'Knesset Committee' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.visionAndWorkPlanInCommittee')}
                </label>
                <textarea
                  value={formData.visionAndWorkPlanInCommittee}
                  onChange={(e) => handleInputChange('visionAndWorkPlanInCommittee', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('fields.visionAndWorkPlanInCommitteePlaceholder')}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.introductionVideoLink')}
              </label>
              <input
                type="url"
                value={formData.introductionVideoLink}
                onChange={(e) => handleInputChange('introductionVideoLink', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.introductionVideoLinkPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.additionalDebateQuestion')}
              </label>
              <textarea
                value={formData.additionalDebateQuestion}
                onChange={(e) => handleInputChange('additionalDebateQuestion', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('fields.additionalDebateQuestionPlaceholder')}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('progress.step', { current: currentStep, total: steps.length })}</span>
          <span>{Math.round((currentStep / steps.length) * 100)}% {t('progress.completed')}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6" })}
          {steps[currentStep - 1].title}
        </h2>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('navigation.previous')}
        </button>

        <div className="flex items-center gap-4">
          {/* Draft Save Button */}
          <button
            onClick={saveDraft}
            disabled={isSavingDraft}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-all"
          >
                         {isSavingDraft ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
               <Check className="w-4 h-4" />
             )}
            {isSavingDraft ? t('saving') : t('saveDraft')}
          </button>

          {/* Draft Saved Indicator */}
          {draftSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm">{t('draftSaved')}</span>
            </div>
          )}

          {/* Next/Submit Button */}
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isStepValid(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {t('navigation.next')}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitApplication}
              disabled={isSubmitting || !isStepValid(currentStep)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                isSubmitting || !isStepValid(currentStep)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {isSubmitting ? t('submitting') : t('submitApplication')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepCandidateForm;