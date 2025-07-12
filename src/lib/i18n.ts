import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Internationalization support
export interface Language {
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
}

export const languages: Language[] = [
    {code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl'},
    {code: 'en', name: 'English', nativeName: 'English', direction: 'ltr'},
    {code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl'},
    {code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr'},
    {code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr'}
];

i18n
    .use(Backend) // loads translations via http (e.g. from /locales/locales)
    .use(LanguageDetector) // detects user language
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        fallbackLng: 'he', // use hebrew if detected language is not available
        debug: true, // enable debug output in console
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        // Optionally, you can specify where your translation files are
        backend: {
            loadPath: './locales/{{lng}}/{{ns}}.json', // Path to your translation files
        },
        // Define your namespaces here (e.g., 'common', 'faq', 'header', 'footer')
        // create ns array based on the locales/en folder
        ns: [
            'aboutIdea',
            'aboutProject',
            'candidate',
            'candidateProfile',
            'candidateRequirements',
            'candidateShowcase',
            'candidateSubmission',
            'committees',
            'common',
            'contact',
            'copyright',
            'ctaSection',
            'dataViz',
            'existingSelections',
            'faq',
            'footer',
            'fullDocument',
            'heroSection',
            'howItWorks',
            'keyFeaturesSection',
            'legalNotice',
            'nav',
            'pages',
            'platform',
            'platformDemoSection',
            'platformEntry',
            'platformHeader',
            'positions',
            'privacyPolicy',
            'questionnaire',
            'questions',
            'registration',
            'saveMessages',
            'sections',
            'securityPrivacy',
            'selectCandidates',
            'summary',
            'systemOverviewSection',
            'teamBuilder',
            'technicalSupport',
            'termsOfService'
        ],
         // Default namespaces to load
        defaultNS: 'common', // Default namespace if not specified in t() call
    });

export const getCurrentLanguage = (): string => {
    return i18n.language || 'he'; // Get language from i18n instance
};

export const setLanguage = (langCode: string): void => {
    i18n.changeLanguage(langCode); // `react-i18next` handles localStorage and updates
};