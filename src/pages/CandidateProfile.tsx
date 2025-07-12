import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Users, Award, FileText, Video, MessageCircle, Phone, Mail } from 'lucide-react';
import PlatformHeader from '../components/platform/PlatformHeader';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, i18n } = useTranslation('candidateProfile'); // Initialize useTranslation with the 'candidateProfile' namespace

  const rtl = i18n.dir() === 'rtl'; // Determine text direction for RTL support

  // Mock candidate data - in real app would fetch by ID
  // Note: Names are typically not translated. Dynamic content like experience/vision
  // would usually come from a backend and be stored in the primary language,
  // then displayed as-is, or translated on the backend if a multi-language database is used.
  // For this exercise, I'm treating the mock descriptive text as translatable for demonstration.
  const candidate = {
    id: id || '1',
    name: 'דר\' שרה לוי', // Name is kept as is, typically not translated
    position: t('candidate.position'), // This is a title, so it's translated
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    experience: t('candidate.experience'), // Example of translating mock descriptive text
    education: t('candidate.education'), // Example of translating mock descriptive text
    vision: t('candidate.vision'), // Example of translating mock descriptive text
    rating: 4.8,
    supporters: 1247,
    votes: 51234,
    percentage: 41.5,
    videoUrl: 'https://example.com/video',
    achievements: [
      t('candidate.achievements.item1'),
      t('candidate.achievements.item2'),
      t('candidate.achievements.item3'),
      t('candidate.achievements.item4')
    ],
    plans: {
      fiveYear: t('candidate.plans.fiveYearDescription'),
      vision2048: t('candidate.plans.vision2048Description'),
      yearly: t('candidate.plans.yearlyDescription')
    },
    documents: [
      { type: t('documents.policeApproval.type'), status: t('documents.status.approved'), date: '15/12/2024' },
      { type: t('documents.assetDeclaration.type'), status: t('documents.status.approved'), date: '10/12/2024' },
      { type: t('documents.conflictOfInterest.type'), status: t('documents.status.approved'), date: '12/12/2024' },
      { type: t('documents.cv.type'), status: t('documents.status.approved'), date: '08/12/2024' }
    ],
    customQuestion: t('candidate.customQuestion'), // The custom question itself is translated
    contact: {
      email: 'sarah.levy@dreamteam.gov.il',
      phone: '050-1234567'
    }
  };

  return (
      <div className={`min-h-screen bg-gray-50 ${rtl ? 'rtl' : 'ltr'}`}> {/* Apply RTL class to main container */}
        <PlatformHeader />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
          >
            {/* Apply rtl:rotate-180 to flip the arrow for RTL languages */}
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            {t('backButton')}
          </button>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex items-center gap-6">
                <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{candidate.name}</h1>
                  <p className="text-2xl text-blue-100 mb-4">{candidate.position}</p>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{candidate.percentage}%</div>
                      <div className="text-blue-100">{t('stats.support')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{candidate.votes.toLocaleString()}</div>
                      <div className="text-blue-100">{t('stats.votes')}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star className="w-6 h-6 text-yellow-300 fill-current" />
                        <span className="text-3xl font-bold">{candidate.rating}</span>
                      </div>
                      <div className="text-blue-100">{t('stats.rating')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{candidate.supporters}</div>
                      <div className="text-blue-100">{t('stats.supporters')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sections.aboutCandidate')}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('sections.professionalExperience')}</h3>
                    <p className="text-gray-700">{candidate.experience}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('sections.education')}</h3>
                    <p className="text-gray-700">{candidate.education}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('sections.vision')}</h3>
                    <p className="text-gray-700">{candidate.vision}</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sections.keyAchievements')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {candidate.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{achievement}</span>
                      </div>
                  ))}
                </div>
              </div>

              {/* Work Plans */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sections.workPlans')}</h2>
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{t('candidate.plans.fiveYearTitle')}</h3>
                    <p className="text-gray-700 leading-relaxed">{candidate.plans.fiveYear}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{t('candidate.plans.vision2048Title')}</h3>
                    <p className="text-gray-700 leading-relaxed">{candidate.plans.vision2048}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{t('candidate.plans.yearlyTitle')}</h3>
                    <p className="text-gray-700 leading-relaxed">{candidate.plans.yearly}</p>
                  </div>
                </div>
              </div>

              {/* Custom Question */}
              {candidate.customQuestion && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sections.debateQuestion')}</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">{t('customQuestion.label')}</h3>
                          <p className="text-blue-800">{candidate.customQuestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Documents */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('sidebar.documentsTitle')}</h3>
                <div className="space-y-3">
                  {candidate.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{doc.type}</div>
                          <div className="text-sm text-gray-500">{doc.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        {doc.status}
                      </span>
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Video */}
              {candidate.videoUrl && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t('sidebar.videoTitle')}</h3>
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">{t('sidebar.videoDescription')}</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {t('sidebar.playVideoButton')}
                      </button>
                    </div>
                  </div>
              )}

              {/* Contact */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('sidebar.contactTitle')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${candidate.contact.email}`} className="text-blue-600 hover:text-blue-700">
                      {candidate.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${candidate.contact.phone}`} className="text-blue-600 hover:text-blue-700">
                      {candidate.contact.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Button */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('sidebar.supportCandidateTitle')}</h3>
                <p className="text-green-100 mb-4">{t('sidebar.joinSupporters', { supporters: candidate.supporters })}</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold w-full">
                  {t('sidebar.addSupportButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CandidateProfile;