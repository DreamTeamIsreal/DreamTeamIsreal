import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Mail, ExternalLink, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation(['footer', 'pages', 'common', 'platform']); // Added 'platform' namespace
  // console.log(i18n.getResourceBundle('he', 'footer')); // This console log is fine for debugging

  const navigate = useNavigate();
  const currentLangIsRTL = i18n.dir() === 'rtl';

  // Add a loading state check for translations
  if (!i18n.isInitialized || !t) {
    return (
        <footer className="bg-gray-900 text-white" dir={currentLangIsRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Minimal Brand Placeholder */}
              <div className="space-y-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
              </div>
              {/* Minimal Links Placeholders */}
              {[...Array(3)].map((_, idx) => (
                  <div key={idx}>
                    <div className="h-5 bg-gray-700 rounded w-24 mb-4 animate-pulse"></div>
                    <ul className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                          <li key={i} className="h-4 bg-gray-700 rounded w-full animate-pulse"></li>
                      ))}
                    </ul>
                  </div>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="h-4 bg-gray-700 rounded w-48 animate-pulse mx-auto md:mx-0"></div>
            </div>
          </div>
        </footer>
    );
  }

  // Links definitions now use the t() function directly for page names
  const links = {
    about: [
      { name: t('pages:aboutProject'), href: "/about-project" },
      { name: t('pages:aboutIdea'), href: "/about-idea" },
      { name: t('pages:fullDocument'), href: "/full-document" },
      { name: t('pages:faq'), href: "/faq" },
      { name: t('pages:contact'), href: "/contact" }
    ],
    platform: [
      { name: t('pages:howItWorks'), href: "/how-it-works" },
      { name: t('pages:securityPrivacy'), href: "/security-privacy" },
      { name: t('pages:candidateRequirements'), href: "/candidate-requirements" },
      { name: t('pages:technicalSupport'), href: "/technical-support" }
    ],
    legal: [
      { name: t('pages:termsOfService'), href: "/terms-of-service" },
      { name: t('pages:privacyPolicy'), href: "/privacy-policy" },
      { name: t('pages:legalNotice'), href: "/legal-notice" },
      { name: t('pages:copyright'), href: "/copyright" }
    ]
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      // Scroll to the top of the page after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 'smooth' for a nice animation
    } else {
      window.open(href, '_blank');
    }
  };

  return (
      <footer className="bg-gray-900 text-white" dir={currentLangIsRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('platform:title')}</h3>
                  <p className="text-sm text-gray-400">{t('platform:subtitle')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('footer:brand.description')}
              </p>
              <div className="flex items-center gap-4">
                <button
                    onClick={() => handleLinkClick('/contact')}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">{t('footer:links.about')}</h4>
              <ul className="space-y-2">
                {links.about.map((link, index) => (
                    <li key={index}>
                      <button
                          onClick={() => handleLinkClick(link.href)}
                          className={`text-gray-400 hover:text-white transition-colors text-sm w-full ${
                              currentLangIsRTL ? 'text-right' : 'text-left'
                          }`}
                      >
                        {link.name}
                      </button>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer:links.platform')}</h4>
              <ul className="space-y-2">
                {links.platform.map((link, index) => (
                    <li key={index}>
                      <button
                          onClick={() => handleLinkClick(link.href)}
                          className={`text-gray-400 hover:text-white transition-colors text-sm w-full ${
                              currentLangIsRTL ? 'text-right' : 'text-left'
                          }`}
                      >
                        {link.name}
                      </button>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('footer:links.legal')}</h4>
              <ul className="space-y-2">
                {links.legal.map((link, index) => (
                    <li key={index}>
                      <button
                          onClick={() => handleLinkClick(link.href)}
                          className={`text-gray-400 hover:text-white transition-colors text-sm w-full ${
                              currentLangIsRTL ? 'text-right' : 'text-left'
                          }`}
                      >
                        {link.name}
                      </button>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                {t('footer:bottom.copyright')}
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>{t('footer:bottom.builtWithLove')}</span>
                <Heart className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;