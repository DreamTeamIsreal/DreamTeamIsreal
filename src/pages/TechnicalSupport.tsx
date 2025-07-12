import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const TechnicalSupport = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['technicalSupport', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const supportChannels = [
    {
      icon: MessageCircle,
      title: t('technicalSupport:supportChannels.chat.title'),
      description: t('technicalSupport:supportChannels.chat.description'),
      action: t('technicalSupport:supportChannels.chat.action'),
      availability: t('technicalSupport:supportChannels.chat.availability'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: t('technicalSupport:supportChannels.email.title'),
      description: "support@dreamteam.gov.il",
      action: t('technicalSupport:supportChannels.email.action'),
      availability: t('technicalSupport:supportChannels.email.availability'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: t('technicalSupport:supportChannels.phone.title'),
      description: "03-1234567 שלוחה 1", // This might need to be dynamic or a specific translation key if the number changes per locale
      action: t('technicalSupport:supportChannels.phone.action'),
      availability: t('technicalSupport:supportChannels.phone.availability'),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: HelpCircle,
      title: t('technicalSupport:supportChannels.helpCenter.title'),
      description: t('technicalSupport:supportChannels.helpCenter.description'),
      action: t('technicalSupport:supportChannels.helpCenter.action'),
      availability: t('technicalSupport:supportChannels.helpCenter.availability'),
      color: "from-orange-500 to-orange-600"
    }
  ];

  const commonIssues = [
    {
      category: t('technicalSupport:commonIssues.category1.title'),
      questions: [
        {
          q: t('technicalSupport:commonIssues.category1.q1.question'),
          a: t('technicalSupport:commonIssues.category1.q1.answer')
        },
        {
          q: t('technicalSupport:commonIssues.category1.q2.question'),
          a: t('technicalSupport:commonIssues.category1.q2.answer')
        },
        {
          q: t('technicalSupport:commonIssues.category1.q3.question'),
          a: t('technicalSupport:commonIssues.category1.q3.answer')
        }
      ]
    },
    {
      category: t('technicalSupport:commonIssues.category2.title'),
      questions: [
        {
          q: t('technicalSupport:commonIssues.category2.q1.question'),
          a: t('technicalSupport:commonIssues.category2.q1.answer')
        },
        {
          q: t('technicalSupport:commonIssues.category2.q2.question'),
          a: t('technicalSupport:commonIssues.category2.q2.answer')
        },
        {
          q: t('technicalSupport:commonIssues.category2.q3.question'),
          a: t('technicalSupport:commonIssues.category2.q3.answer')
        }
      ]
    },
    {
      category: t('technicalSupport:commonIssues.category3.title'),
      questions: [
        {
          q: t('technicalSupport:commonIssues.category3.q1.question'),
          a: t('technicalSupport:commonIssues.category3.q1.answer')
        },
        {
          q: t('technicalSupport:commonIssues.category3.q2.question'),
          a: t('technicalSupport:commonIssues.category3.q2.answer')
        },
        {
          q: t('technicalSupport:commonIssues.category3.q3.question'),
          a: t('technicalSupport:commonIssues.category3.q3.answer')
        }
      ]
    }
  ];

  const systemRequirements = [
    {
      category: t('technicalSupport:systemRequirements.category1.title'),
      items: [
        t('technicalSupport:systemRequirements.category1.item1'),
        t('technicalSupport:systemRequirements.category1.item2'),
        t('technicalSupport:systemRequirements.category1.item3'),
        t('technicalSupport:systemRequirements.category1.item4')
      ]
    },
    {
      category: t('technicalSupport:systemRequirements.category2.title'),
      items: [
        t('technicalSupport:systemRequirements.category2.item1'),
        t('technicalSupport:systemRequirements.category2.item2'),
        t('technicalSupport:systemRequirements.category2.item3'),
        t('technicalSupport:systemRequirements.category2.item4')
      ]
    },
    {
      category: t('technicalSupport:systemRequirements.category3.title'),
      items: [
        t('technicalSupport:systemRequirements.category3.item1'),
        t('technicalSupport:systemRequirements.category3.item2'),
        t('technicalSupport:systemRequirements.category3.item3')
      ]
    },
    {
      category: t('technicalSupport:systemRequirements.category4.title'),
      items: [
        t('technicalSupport:systemRequirements.category4.item1'),
        t('technicalSupport:systemRequirements.category4.item2'),
        t('technicalSupport:systemRequirements.category4.item3')
      ]
    }
  ];

  const filteredQuestions = searchTerm
      ? commonIssues.flatMap(category =>
          category.questions
              .filter(q =>
                  q.q.includes(searchTerm) ||
                  q.a.includes(searchTerm) ||
                  category.category.includes(searchTerm)
              )
              .map(q => ({ ...q, category: category.category }))
      )
      : [];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                {t('common:backToHomePage')}
              </button>

              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-blue-100 rounded-full px-6 py-3 mb-6">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-blue-800">{t('technicalSupport:hero.tag')}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t('technicalSupport:hero.title')}
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  {t('technicalSupport:hero.description')}
                </p>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                  <Search className={`absolute ${rtl ? 'left-4' : 'right-4'} top-4 w-6 h-6 text-gray-400`} />
                  <input
                      type="text"
                      placeholder={t('technicalSupport:hero.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full ${rtl ? 'pl-14 pr-6' : 'pr-14 pl-6'} py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Support Channels */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('technicalSupport:supportChannels.mainTitle')}</h2>
                <p className="text-lg text-gray-600">{t('technicalSupport:supportChannels.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {supportChannels.map((channel, index) => {
                  const IconComponent = channel.icon;
                  return (
                      <div key={index} className="text-center group">
                        <div className={`w-20 h-20 bg-gradient-to-r ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
                        <p className="text-gray-600 mb-2">{channel.description}</p>
                        <p className="text-sm text-gray-500 mb-4">{channel.availability}</p>
                        <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                          {channel.action}
                        </button>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Search Results or Common Issues */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {searchTerm ? (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                      {t('technicalSupport:searchResults.title', { term: searchTerm, count: filteredQuestions.length })}
                    </h2>
                    {filteredQuestions.length > 0 ? (
                        <div className="space-y-4">
                          {filteredQuestions.map((item, index) => (
                              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="text-sm text-blue-600 font-medium mb-2">{item.category}</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.q}</h3>
                                <p className="text-gray-700">{item.a}</p>
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-600 mb-4">{t('technicalSupport:searchResults.noResults')}</p>
                          <button
                              onClick={() => setSearchTerm('')}
                              className="text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            {t('technicalSupport:searchResults.clearSearch')}
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <div>
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('technicalSupport:commonIssues.mainTitle')}</h2>
                      <p className="text-lg text-gray-600">{t('technicalSupport:commonIssues.subtitle')}</p>
                    </div>

                    <div className="space-y-8">
                      {commonIssues.map((category, categoryIndex) => (
                          <div key={categoryIndex}>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">{category.category}</h3>
                            <div className="space-y-4">
                              {category.questions.map((item, itemIndex) => {
                                const id = categoryIndex * 100 + itemIndex;
                                return (
                                    <div key={id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                      <button
                                          onClick={() => setOpenFaq(openFaq === id ? null : id)}
                                          className={`w-full px-6 py-4 ${rtl ? 'text-right' : 'text-left'} flex items-center justify-between hover:bg-gray-50 transition-colors`}
                                      >
                                        <h4 className="text-lg font-semibold text-gray-900 flex-1">{item.q}</h4>
                                        {openFaq === id ? (
                                            <ChevronUp className={`w-6 h-6 text-gray-400 flex-shrink-0 ${rtl ? 'ml-4' : 'mr-4'}`} />
                                        ) : (
                                            <ChevronDown className={`w-6 h-6 text-gray-400 flex-shrink-0 ${rtl ? 'ml-4' : 'mr-4'}`} />
                                        )}
                                      </button>
                                      {openFaq === id && (
                                          <div className="px-6 pb-4 bg-gray-50">
                                            <p className="text-gray-700">{item.a}</p>
                                          </div>
                                      )}
                                    </div>
                                );
                              })}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </section>

          {/* System Requirements */}
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('technicalSupport:systemRequirements.mainTitle')}</h2>
                <p className="text-lg text-gray-600">{t('technicalSupport:systemRequirements.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {systemRequirements.map((req, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{req.category}</h3>
                      <ul className={`space-y-2 ${rtl ? 'list-none pr-4' : 'list-disc pl-4'}`}>
                        {req.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                        ))}
                      </ul>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">{t('technicalSupport:contactSupport.title')}</h2>
              <p className="text-lg text-blue-100 mb-8">
                {t('technicalSupport:contactSupport.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-lg">
                  {t('technicalSupport:contactSupport.liveChatButton')}
                </button>

                <a
                    href="mailto:support@dreamteam.gov.il"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-bold text-lg"
                >
                  {t('technicalSupport:contactSupport.emailButton')}
                </a>
              </div>

              <div className="mt-8 text-blue-100">
                <p>{t('technicalSupport:contactSupport.avgResponseTime')}</p>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default TechnicalSupport;