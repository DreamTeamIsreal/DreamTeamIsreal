import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, FileText, Award, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CandidateRequirements = () => {
    const navigate = useNavigate();
    // Destructure t (translation function) and i18n (i18n instance) from useTranslation
    // 'candidateRequirements' is the namespace where these translations reside.
    const { t, i18n } = useTranslation('candidateRequirements');

    // Determine direction based on i18n's current language direction or your custom isRTL
    const rtl = i18n.dir() === 'rtl';

    const basicRequirements = [
        {
            icon: UserCheck,
            title: t('basicRequirements.title'),
            items: [
                t('basicRequirements.items.citizen'),
                t('basicRequirements.items.votingRight'),
                t('basicRequirements.items.noCriminalRecord'),
                t('basicRequirements.items.integrity')
            ]
        },
        {
            icon: FileText,
            title: t('requiredDocuments.title'),
            items: [
                t('requiredDocuments.items.policeApproval'),
                t('requiredDocuments.items.assetDeclaration'),
                t('requiredDocuments.items.conflictOfInterest'),
                t('requiredDocuments.items.resume')
            ]
        },
        {
            icon: Award,
            title: t('professionalSkills.title'),
            items: [
                t('professionalSkills.items.education'),
                t('professionalSkills.items.experience'),
                t('professionalSkills.items.understanding'),
                t('professionalSkills.items.management')
            ]
        },
        {
            icon: Shield,
            title: t('transparencyRequirements.title'),
            items: [
                t('transparencyRequirements.items.publishInfo'),
                t('transparencyRequirements.items.accessibility'),
                t('transparencyRequirements.items.answerQuestions'),
                t('transparencyRequirements.items.meetDeadlines')
            ]
        }
    ];

    return (
        <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`}>
            <Header />

            <div className="pt-20">
                {/* Hero Section */}
                <section
                    className={`py-16 bg-gradient-to-br from-indigo-50 to-purple-50 ${rtl ? 'text-right' : 'text-left'}`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => navigate('/')}
                            className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8 ${rtl ? 'flex-row-reverse' : ''}`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {t('hero.backButton')}
                        </button>

                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 bg-indigo-100 rounded-full px-6 py-3 mb-6">
                                <UserCheck className="w-6 h-6 text-indigo-600" />
                                <span
                                    className="font-bold text-indigo-800">{t('hero.title')}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {t('hero.heading')}
                            </h1>

                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {t('hero.description')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Basic Requirements */}
                <section className={`py-16 bg-white ${rtl ? 'text-right' : 'text-left'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('basicRequirements.title')}</h2>
                            <p className="text-lg text-gray-600">{t('basicRequirements.description')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {basicRequirements.map((req, index) => {
                                const IconComponent = req.icon;
                                return (
                                    <div key={index} className="bg-gray-50 rounded-2xl p-6">
                                        <IconComponent className="w-8 h-8 text-indigo-600 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{req.title}</h3>
                                        <ul className="text-gray-600 space-y-2">
                                            {req.items.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default CandidateRequirements;