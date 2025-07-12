import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, BookOpen, Users, Vote, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const FullDocument = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['fullDocument', 'common']); // Load specific namespaces
  const rtl = i18n.dir() === 'rtl';

  const chapters = [
    {
      number: "1",
      title: t('fullDocument:chapter1.title'),
      description: t('fullDocument:chapter1.description'),
      pages: `1-15`
    },
    {
      number: "2",
      title: t('fullDocument:chapter2.title'),
      description: t('fullDocument:chapter2.description'),
      pages: `16-35`
    },
    {
      number: "3",
      title: t('fullDocument:chapter3.title'),
      description: t('fullDocument:chapter3.description'),
      pages: `36-50`
    },
    {
      number: "4",
      title: t('fullDocument:chapter4.title'),
      description: t('fullDocument:chapter4.description'),
      pages: `51-65`
    },
    {
      number: "5",
      title: t('fullDocument:chapter5.title'),
      description: t('fullDocument:chapter5.description'),
      pages: `66-80`
    },
    {
      number: "6",
      title: t('fullDocument:chapter6.title'),
      description: t('fullDocument:chapter6.description'),
      pages: `81-95`
    },
    {
      number: "7",
      title: t('fullDocument:chapter7.title'),
      description: t('fullDocument:chapter7.description'),
      pages: `96-110`
    },
    {
      number: "8",
      title: t('fullDocument:chapter8.title'),
      description: t('fullDocument:chapter8.description'),
      pages: `111-150`
    }
  ];

  const highlights = [
    {
      icon: Vote,
      title: t('fullDocument:highlight1.title'),
      description: t('fullDocument:highlight1.description')
    },
    {
      icon: Users,
      title: t('fullDocument:highlight2.title'),
      description: t('fullDocument:highlight2.description')
    },
    {
      icon: Shield,
      title: t('fullDocument:highlight3.title'),
      description: t('fullDocument:highlight3.description')
    },
    {
      icon: BookOpen,
      title: t('fullDocument:highlight4.title'),
      description: t('fullDocument:highlight4.description')
    }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-3 bg-green-100 rounded-full px-6 py-3 mb-8">
                <FileText className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">{t('fullDocument:hero.tag')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                {t('fullDocument:hero.titlePart1')}
                <br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t('fullDocument:hero.titlePart2')}
              </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
                {t('fullDocument:hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg flex items-center gap-3">
                  <Download className="w-6 h-6" />
                  {t('fullDocument:hero.downloadButton')}
                </button>

                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg flex items-center gap-3">
                  <Eye className="w-6 h-6" />
                  {t('fullDocument:hero.viewOnlineButton')}
                </button>
              </div>
            </div>
          </section>

          {/* Document Stats */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-3xl font-black text-green-600 mb-2">150</div>
                  <div className="text-sm text-gray-600">{t('fullDocument:stats.pages')}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-3xl font-black text-blue-600 mb-2">8</div>
                  <div className="text-sm text-gray-600">{t('fullDocument:stats.chapters')}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-3xl font-black text-purple-600 mb-2">100</div>
                  <div className="text-sm text-gray-600">{t('fullDocument:stats.questions')}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="text-3xl font-black text-orange-600 mb-2">50+</div>
                  <div className="text-sm text-gray-600">{t('fullDocument:stats.examples')}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('fullDocument:toc.title')}</h2>
                <p className="text-xl text-gray-600">{t('fullDocument:toc.subtitle')}</p>
              </div>

              <div className="space-y-6">
                {chapters.map((chapter, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">{chapter.number}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{chapter.title}</h3>
                          <p className="text-gray-600 mb-2">{chapter.description}</p>
                          <span className="text-sm text-blue-600 font-medium">{t('common:pages', { pages: chapter.pages })}</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Highlights Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('fullDocument:highlights.title')}</h2>
                <p className="text-xl text-gray-600">{t('fullDocument:highlights.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {highlights.map((highlight, index) => {
                  const IconComponent = highlight.icon;
                  return (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{highlight.title}</h3>
                        <p className="text-gray-600 text-sm">{highlight.description}</p>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sample Content */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('fullDocument:sample.title')}</h2>
                <p className="text-xl text-gray-600">{t('fullDocument:sample.subtitle')}</p>
              </div>

              <div className="bg-white rounded-3xl p-12 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('fullDocument:sample.sectionTitle')}</h3>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                  <p>{t('fullDocument:sample.paragraph1')}</p>
                  <p>{t('fullDocument:sample.paragraph2')}</p>
                  <p>{t('fullDocument:sample.paragraph3')}</p>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>{t('fullDocument:sample.notePrefix')}</strong> {t('fullDocument:sample.noteContent')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Download CTA */}
          <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold mb-8">{t('fullDocument:cta.title')}</h2>
              <p className="text-xl text-green-100 mb-12">
                {t('fullDocument:cta.subtitle')}
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
                <h3 className="text-xl font-bold mb-4">{t('fullDocument:cta.includesTitle')}</h3>
                <div className="grid md:grid-cols-2 gap-4 text-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>{t('fullDocument:cta.includes1')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>{t('fullDocument:cta.includes2')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>{t('fullDocument:cta.includes3')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span>{t('fullDocument:cta.includes4')}</span>
                  </div>
                </div>
              </div>

              <button className="bg-white text-green-600 px-12 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-xl shadow-lg flex items-center gap-3 mx-auto">
                <Download className="w-6 h-6" />
                {t('fullDocument:cta.downloadButton')}
              </button>
            </div>
          </section>

          <div className="mt-8 text-center">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              {t('common:back')}
            </button>
          </div>
        </div>

        <Footer />
      </div>
  );
};

export default FullDocument;