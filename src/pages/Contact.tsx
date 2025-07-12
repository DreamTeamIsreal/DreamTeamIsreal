import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle, Clock, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Contact = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('contact'); // Initialize useTranslation hook
  const rtl = i18n.dir() === 'rtl'; // Determine if current language is RTL

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general' // Default to a key that can be translated
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('form.submissionSuccessAlert'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t('contactMethods.email.title'),
      description: "info@dreamteam.gov.il",
      action: t('contactMethods.email.action'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: t('contactMethods.phone.title'),
      description: "03-1234567",
      action: t('contactMethods.phone.action'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: MessageCircle,
      title: t('contactMethods.chat.title'),
      description: t('contactMethods.chat.description'),
      action: t('contactMethods.chat.action'),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPin,
      title: t('contactMethods.address.title'),
      description: t('contactMethods.address.description'),
      action: t('contactMethods.address.action'),
      color: "from-orange-500 to-orange-600"
    }
  ];

  const departments = [
    {
      title: t('departments.generalQuestions.title'),
      description: t('departments.generalQuestions.description'),
      email: "info@dreamteam.gov.il"
    },
    {
      title: t('departments.technicalSupport.title'),
      description: t('departments.technicalSupport.description'),
      email: "support@dreamteam.gov.il"
    },
    {
      title: t('departments.candidates.title'),
      description: t('departments.candidates.description'),
      email: "candidates@dreamteam.gov.il"
    },
    {
      title: "עיתונות", // Still hardcoded, but should be replaced by t('departments.press.title')
      description: "פניות תקשורת ועיתונאים", // Still hardcoded, but should be replaced by t('departments.press.description')
      email: "press@dreamteam.gov.il"
    }
  ];

  return (
      <div className={`min-h-screen bg-white ${rtl ? 'rtl' : 'ltr'}`} dir={i18n.dir()}>
        <Header />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-3 bg-teal-100 rounded-full px-6 py-3 mb-8">
                <Mail className="w-6 h-6 text-teal-600" />
                <span className="font-bold text-teal-800">{t('hero.contactUs')}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                {t('hero.letsTalk')}
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {t('hero.weAreHereForYou')}
              </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t('hero.description')}
              </p>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('contactMethods.heading')}</h2>
                <p className="text-xl text-gray-600">{t('contactMethods.subheading')}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                      <div key={index} className="text-center group">
                        <div className={`w-20 h-20 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                        <p className="text-gray-600 mb-4">{method.description}</p>
                        <button className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                          {method.action}
                        </button>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('form.heading')}</h2>
                <p className="text-xl text-gray-600">{t('form.subheading')}</p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.nameLabel')} *
                      </label>
                      <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder={t('form.namePlaceholder')}
                          required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.emailLabel')} *
                      </label>
                      <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="example@email.com"
                          required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.phoneLabel')}
                      </label>
                      <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="050-1234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('form.typeLabel')} *
                      </label>
                      <select
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          required
                      >
                        <option value="general">{t('form.typeOptionGeneral')}</option>
                        <option value="candidate">{t('form.typeOptionCandidate')}</option>
                        <option value="technical">{t('form.typeOptionTechnical')}</option>
                        <option value="press">{t('form.typeOptionPress')}</option>
                        <option value="partnership">{t('form.typeOptionPartnership')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.subjectLabel')} *
                    </label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder={t('form.subjectPlaceholder')}
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.messageLabel')} *
                    </label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder={t('form.messagePlaceholder')}
                        required
                    />
                  </div>

                  <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center gap-3"
                  >
                    <Send className="w-6 h-6" />
                    {t('form.sendButton')}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Departments */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('departments.heading')}</h2>
                <p className="text-xl text-gray-600">{t('departments.subheading')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {departments.map((dept, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{dept.title}</h3>
                      <p className="text-gray-600 mb-4">{dept.description}</p>
                      <a
                          href={`mailto:${dept.email}`}
                          className="text-teal-600 font-semibold hover:text-teal-700 transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {dept.email}
                      </a>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Office Hours */}
          <section className="py-20 bg-gradient-to-br from-teal-600 to-blue-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-8">{t('officeHours.heading')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-teal-200" />
                      <div>
                        <div className="font-semibold">{t('officeHours.weekdayLabel')}</div>
                        <div className="text-teal-100">{t('officeHours.weekdayHours')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-teal-200" />
                      <div>
                        <div className="font-semibold">{t('officeHours.fridayLabel')}</div>
                        <div className="text-teal-100">{t('officeHours.fridayHours')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <MessageCircle className="w-6 h-6 text-teal-200" />
                      <div>
                        <div className="font-semibold">{t('officeHours.chatLabel')}</div>
                        <div className="text-teal-100">{t('officeHours.chatHours')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                  <Users className="w-16 h-16 text-white mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{t('community.title')}</h3>
                  <p className="text-teal-100 mb-6">
                    {t('community.description')}
                  </p>
                  <button className="bg-white text-teal-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                    {t('community.joinButton')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
  );
};

export default Contact;