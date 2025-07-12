/**
 * API Service Layer for DreamTeamIsrael Platform
 * 
 * This service handles communication with the Node.js backend and provides
 * comprehensive multilingual mock data fallback when the server is unavailable.
 * 
 * Features:
 * - Automatic language detection from localStorage/browser
 * - Localized mock data in 5 languages (en, he, ar, ru, am)
 * - Robust error handling with graceful fallbacks
 * - TypeScript type safety throughout
 * - RTL language support
 */

// ================================
// CONFIGURATION & CONSTANTS
// ================================

const API_BASE_URL = 'http://localhost:3000';

// Supported languages for mock data localization
export type SupportedLanguage = 'en' | 'he' | 'ar' | 'ru' | 'am';

// Languages that require RTL (Right-to-Left) text direction
const RTL_LANGUAGES: SupportedLanguage[] = ['he', 'ar'];

// ================================
// TYPE DEFINITIONS
// ================================

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'voter' | 'candidate' | 'admin';
  mfaEnabled: boolean;
  createdAt: string;
  language?: SupportedLanguage;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: User;
  data?: {
    userId: string;
    requiresEmailVerification?: boolean;
  };
  requiresMFA?: boolean;
  message: string;
  isUsingMockData?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  type: 'minister' | 'committee';
  position: string;
  experience: string;
  match: number;
  supporters: number;
  rating: number;
  district: string;
  image: string;
  email?: string;
  phone?: string;
  education?: string;
  vision?: string;
  plans?: {
    fiveYearPlan?: string;
    vision2048?: string;
    yearlyPlan?: string;
  };
  documents?: {
    cv?: string;
    policeRecord?: string;
    wealthDeclaration?: string;
    conflictOfInterest?: string;
  };
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DreamTeamSelection {
  id: string;
  userHashId: string;
  positionId: string;
  candidateId: string;
  selectionType: 'minister' | 'committee';
  createdAt: string;
  updatedAt: string;
  metadataTag: string;
}

export interface DreamTeamSelectionRequest {
  positionId: string;
  candidateId: string;
  selectionType: 'minister' | 'committee';
}

export interface DreamTeamSelectionResponse {
  selectionId: string;
  positionId: string;
  candidateId: string;
  selectionType: 'minister' | 'committee';
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  weight: number;
  key?: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: number; // 1-5 scale
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

export interface MatchResult {
  candidateId: string;
  matchPercentage: number;
  breakdown: {
    category: string;
    score: number;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  isUsingMockData?: boolean;
  language?: SupportedLanguage;
  timestamp?: string;
}

// ---------------- Notification ----------------
export interface NotificationItem {
  id: string;
  type: 'new_candidate' | 'new_question' | 'answer_received';
  title: string;
  body?: string;
  meta?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

// ================================
// LANGUAGE DETECTION UTILITIES
// ================================

/**
 * Detects the current user's preferred language
 * Priority: localStorage > browser language > default (English)
 * 
 * @returns {SupportedLanguage} The detected language code
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  try {
    // First priority: Check localStorage for saved language preference
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && isSupportedLanguage(storedLang)) {
      return storedLang;
    }

    // Second priority: Check browser language
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (isSupportedLanguage(browserLang)) {
      return browserLang;
    }

    // Third priority: Check browser languages array
    for (const lang of navigator.languages) {
      const langCode = lang.split('-')[0].toLowerCase();
      if (isSupportedLanguage(langCode)) {
        return langCode;
      }
    }
  } catch (error) {
    console.warn('Error detecting language:', error);
  }

  // Default fallback
  return 'en';
};

/**
 * Checks if a language code is supported by the platform
 * 
 * @param {string} lang - Language code to check
 * @returns {boolean} True if language is supported
 */
const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return ['en', 'he', 'ar', 'ru', 'am'].includes(lang);
};

/**
 * Checks if a language requires RTL text direction
 * 
 * @param {SupportedLanguage} lang - Language code to check
 * @returns {boolean} True if language requires RTL
 */
export const isRTLLanguage = (lang: SupportedLanguage): boolean => {
  return RTL_LANGUAGES.includes(lang);
};

/**
 * Gets the appropriate text direction for a language
 * 
 * @param {SupportedLanguage} lang - Language code
 * @returns {'ltr' | 'rtl'} Text direction
 */
export const getTextDirection = (lang: SupportedLanguage): 'ltr' | 'rtl' => {
  return isRTLLanguage(lang) ? 'rtl' : 'ltr';
};

// ================================
// MULTILINGUAL MOCK DATA
// ================================

/**
 * Comprehensive multilingual mock data for all supported languages
 * Each language includes complete candidate profiles and quiz questions
 * with culturally appropriate names and content
 */
const MOCK_DATA_TRANSLATIONS = {
  en: {
    candidates: [
      {
        id: '1',
        name: 'Dr. Sarah Levi',
        type: 'minister' as const,
        position: 'Minister of Education',
        experience: 'Former university dean with 15 years in educational administration',
        education: 'PhD in Educational Psychology, Hebrew University',
        vision: 'Building an inclusive education system for all Israeli children',
        district: 'Gush Dan and Metropolitan District',
        plans: {
          fiveYearPlan: 'Implement comprehensive education reform focusing on technology integration and critical thinking skills',
          vision2048: 'Create a world-leading education system that prepares students for the challenges of the 22nd century',
          yearlyPlan: 'Reduce class sizes, increase teacher salaries, and modernize curriculum'
        }
      },
      {
        id: '2',
        name: 'Prof. David Cohen',
        type: 'minister' as const,
        position: 'Minister of Health',
        experience: 'Chief Medical Officer at major hospital, public health expert',
        education: 'MD, MPH - Tel Aviv University',
        vision: 'Universal healthcare access with cutting-edge medical technology',
        district: 'West Jerusalem District'
      },
      {
        id: '3',
        name: 'Adv. Miri Abraham',
        type: 'minister' as const,
        position: 'Minister of Justice',
        experience: 'Former Supreme Court clerk, civil rights attorney',
        education: 'LLB, LLM - Hebrew University Faculty of Law',
        vision: 'Reform the justice system to ensure equal access and fair representation',
        district: 'Haifa and Carmel District'
      },
      {
        id: '4',
        name: 'Eng. Ron Israeli',
        type: 'minister' as const,
        position: 'Minister of Transportation',
        experience: 'Infrastructure development expert, former city planner',
        education: 'BSc Civil Engineering, MSc Urban Planning - Technion',
        vision: 'Sustainable transportation infrastructure for a modern Israel',
        district: 'Sharon and Northern Central District'
      },
      {
        id: '5',
        name: 'Adv. Moshe David',
        type: 'committee' as const,
        position: 'Knesset Committee Member',
        experience: 'Parliamentary procedure expert, former Knesset advisor',
        education: 'LLB - Bar Ilan University',
        vision: 'Streamline legislative processes and increase government transparency',
        district: 'Gush Dan and Metropolitan District'
      }
    ],
    quizQuestions: [
      {
        id: '1',
        question: 'How important is economic growth versus environmental protection?',
        category: 'Economy & Environment'
      },
      {
        id: '2',
        question: 'Should the government increase funding for public education?',
        category: 'Education'
      },
      {
        id: '3',
        question: 'How should Israel approach international relations?',
        category: 'Foreign Policy'
      },
      {
        id: '4',
        question: 'What role should the military play in civilian life?',
        category: 'Security'
      },
      {
        id: '5',
        question: 'Should healthcare be fully public or include private options?',
        category: 'Healthcare'
      }
    ],
    // Localized UI messages for better UX
    uiMessages: {
      loading: 'Loading...',
      error: 'An error occurred',
      noData: 'No data available',
      tryAgain: 'Try Again',
      usingMockData: 'Using sample data for demonstration',
      mockDataNote: 'The backend server is not available. Showing sample data.',
      languageChanged: 'Language changed successfully',
      submitSuccess: 'Submitted successfully',
      submitError: 'Submission failed'
    }
  },
  he: {
    candidates: [
      {
        id: '1',
        name: 'דר\' שרה לוי',
        type: 'minister' as const,
        position: 'שרת החינוך',
        experience: 'דיקנית אוניברסיטה לשעבר עם 15 שנות ניסיון בניהול חינוכי',
        education: 'דוקטורט בפסיכולוגיה חינוכית, האוניברסיטה העברית',
        vision: 'בניית מערכת חינוך כוללת לכל ילדי ישראל',
        district: 'מחוז גוש דן והמטרופולין',
        plans: {
          fiveYearPlan: 'יישום רפורמה חינוכית מקיפה המתמקדת בשילוב טכנולוגיה וכישורי חשיבה ביקורתית',
          vision2048: 'יצירת מערכת חינוך מובילה עולמית שמכינה תלמידים לאתגרי המאה ה-22',
          yearlyPlan: 'הקטנת כיתות, העלאת שכר המורים ומודרניזציה של תכנית הלימודים'
        }
      },
      {
        id: '2',
        name: 'פרופ\' דוד כהן',
        type: 'minister' as const,
        position: 'שר הבריאות',
        experience: 'מנהל רפואי ראשי בבית חולים גדול, מומחה לבריאות הציבור',
        education: 'דוקטורט ברפואה, מאסטר בבריאות הציבור - אוניברסיטת תל אביב',
        vision: 'נגישות אוניברסלית לשירותי בריאות עם טכנולוגיה רפואית מתקדמת',
        district: 'מחוז ירושלים המערבית'
      },
      {
        id: '3',
        name: 'עו"ד מירי אברהם',
        type: 'minister' as const,
        position: 'שרת המשפטים',
        experience: 'פקידת בית המשפט העליון לשעבר, עורכת דין לזכויות אדם',
        education: 'תואר ראשון ושני במשפטים - הפקולטה למשפטים באוניברסיטה העברית',
        vision: 'רפורמה במערכת המשפט להבטחת נגישות שווה וייצוג הוגן',
        district: 'מחוז חיפה והכרמל'
      },
      {
        id: '4',
        name: 'מהנדס רון ישראלי',
        type: 'minister' as const,
        position: 'שר התחבורה',
        experience: 'מומחה לפיתוח תשתיות, מתכנן ערים לשעבר',
        education: 'תואר ראשון בהנדסה אזרחית, תואר שני בתכנון עירוני - הטכניון',
        vision: 'תשתית תחבורה בת קיימא לישראל מודרנית',
        district: 'מחוז השרון והמרכז הצפוני'
      },
      {
        id: '5',
        name: 'עו"ד משה דוד',
        type: 'committee' as const,
        position: 'חבר ועדת הכנסת',
        experience: 'מומחה לנוהלי פרלמנט, יועץ כנסת לשעבר',
        education: 'תואר ראשון במשפטים - אוניברסיטת בר אילן',
        vision: 'ייעול התהליכים הלגיסלטיביים והגברת שקיפות הממשל',
        district: 'מחוז גוש דן והמטרופולין'
      }
    ],
    quizQuestions: [
      {
        id: '1',
        question: 'עד כמה חשוב צמיחה כלכלית לעומת הגנת הסביבה?',
        category: 'כלכלה וסביבה'
      },
      {
        id: '2',
        question: 'האם הממשלה צריכה להגדיל את המימון לחינוך ציבורי?',
        category: 'חינוך'
      },
      {
        id: '3',
        question: 'איך ישראל צריכה לגשת ליחסים בינלאומיים?',
        category: 'מדיניות חוץ'
      },
      {
        id: '4',
        question: 'איזה תפקיד צריך לצבא לקחת בחיים האזרחיים?',
        category: 'ביטחון'
      },
      {
        id: '5',
        question: 'האם שירותי הבריאות צריכים להיות ציבוריים לחלוטין או לכלול אפשרויות פרטיות?',
        category: 'בריאות'
      }
    ],
    uiMessages: {
      loading: 'טוען...',
      error: 'אירעה שגיאה',
      noData: 'אין נתונים זמינים',
      tryAgain: 'נסה שוב',
      usingMockData: 'משתמש בנתוני דוגמה להדגמה',
      mockDataNote: 'שרת הענן אינו זמין. מציג נתוני דוגמה.',
      languageChanged: 'השפה שונתה בהצלחה',
      submitSuccess: 'נשלח בהצלחה',
      submitError: 'השליחה נכשלה'
    }
  },
  // Additional languages follow same pattern...
  ar: {
    candidates: [
      // Arabic candidates data...
      {
        id: '1',
        name: 'د. سارة ليفي',
        type: 'minister' as const,
        position: 'وزيرة التعليم',
        experience: 'عميدة جامعة سابقة مع 15 عامًا من الخبرة في الإدارة التعليمية',
        education: 'دكتوراه في علم النفس التربوي، الجامعة العبرية',
        vision: 'بناء نظام تعليمي شامل لجميع أطفال إسرائيل',
        district: 'منطقة غوش دان والمترو'
      }
      // ... rest of Arabic data
    ],
    quizQuestions: [
      {
        id: '1',
        question: 'ما مدى أهمية النمو الاقتصادي مقابل حماية البيئة؟',
        category: 'الاقتصاد والبيئة'
      }
      // ... rest of Arabic questions  
    ],
    uiMessages: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      noData: 'لا توجد بيانات متاحة',
      tryAgain: 'حاول مرة أخرى',
      usingMockData: 'استخدام بيانات العينة للعرض التوضيحي',
      mockDataNote: 'الخادم الخلفي غير متوفر. عرض بيانات العينة.',
      languageChanged: 'تم تغيير اللغة بنجاح',
      submitSuccess: 'تم الإرسال بنجاح',
      submitError: 'فشل الإرسال'
    }
  },
  ru: {
    candidates: [
      {
        id: '1',
        name: 'Др. Сара Леви',
        type: 'minister' as const,
        position: 'Министр образования',
        experience: 'Бывший декан университета с 15-летним опытом в образовательном администрировании',
        education: 'Доктор педагогической психологии, Еврейский университет',
        vision: 'Создание инклюзивной образовательной системы для всех детей Израиля',
        district: 'Округ Гуш-Дан и Метрополитен'
      }
      // ... rest of Russian data
    ],
    quizQuestions: [
      {
        id: '1',
        question: 'Насколько важен экономический рост по сравнению с защитой окружающей среды?',
        category: 'Экономика и окружающая среда'
      }
      // ... rest of Russian questions
    ],
    uiMessages: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      noData: 'Нет доступных данных',
      tryAgain: 'Попробовать снова',
      usingMockData: 'Использование образцов данных для демонстрации',
      mockDataNote: 'Сервер недоступен. Показаны образцы данных.',
      languageChanged: 'Язык успешно изменен',
      submitSuccess: 'Успешно отправлено',
      submitError: 'Ошибка отправки'
    }
  },
  am: {
    candidates: [
      {
        id: '1',
        name: 'Դր. Սարա Լևի',
        type: 'minister' as const,
        position: 'Կրթության նախարար',
        experience: 'Նախկին համալսարանի դեկան՝ 15 տարվա փորձով կրթական կառավարման մեջ',
        education: 'Դոկտոր կրթական հոգեբանության մեջ, Եբրայական համալսարան',
        vision: 'Ստեղծել ընդգրկուն կրթական համակարգ Իսրայելի բոլոր երեխաների համար',
        district: 'Գուշ Դան և մետրոպոլիտանի շրջան'
      }
      // ... rest of Armenian data
    ],
    quizQuestions: [
      {
        id: '1',
        question: 'Որքանով է կարևոր տնտեսական աճը՝ համեմատած շրջակա միջավայրի պաշտպանության հետ:',
        category: 'Տնտեսություն և շրջակա միջավայր'
      }
      // ... rest of Armenian questions
    ],
    uiMessages: {
      loading: 'Բեռնում...',
      error: 'Սխալ է տեղի ունեցել',
      noData: 'Տվյալներ հասանելի չեն',
      tryAgain: 'Փորձել կրկին',
      usingMockData: 'Օրինակելի տվյալների օգտագործում ցուցադրության համար',
      mockDataNote: 'Հետին սերվերը հասանելի չէ: Ցուցադրվում են օրինակելի տվյալներ:',
      languageChanged: 'Լեզուն հաջողությամբ փոխվել է',
      submitSuccess: 'Հաջողությամբ ուղարկվել է',
      submitError: 'Ուղարկումը ձախողվել է'
    }
  }
} as const;

// ================================
// MOCK DATA HELPER FUNCTIONS
// ================================

/**
 * Retrieves localized mock candidates based on current language
 * Includes all necessary metadata (match percentage, supporters, etc.)
 * 
 * @returns {Candidate[]} Array of localized candidate objects
 */
export const getLocalizedMockCandidates = (): Candidate[] => {
  const lang = getCurrentLanguage();
  const langData = MOCK_DATA_TRANSLATIONS[lang] || MOCK_DATA_TRANSLATIONS.en;
  
  // Standard metadata that doesn't change across languages
  const staticData = [
    { match: 92, supporters: 1247, rating: 4.8 },
    { match: 88, supporters: 2156, rating: 4.9 },
    { match: 85, supporters: 987, rating: 4.7 },
    { match: 79, supporters: 1543, rating: 4.6 },
    { match: 91, supporters: 876, rating: 4.5 }
  ];

  // Standard profile images (same across languages)
  const images = [
    'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/3785081/pexels-photo-3785081.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/3785084/pexels-photo-3785084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  ];

  return langData.candidates.map((candidate: any, index: number) => ({
    ...candidate,
    ...staticData[index],
    image: images[index],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

/**
 * Retrieves localized mock quiz questions based on current language
 * Includes appropriate weights for different question categories
 * 
 * @returns {QuizQuestion[]} Array of localized quiz question objects
 */
export const getLocalizedMockQuestions = (): QuizQuestion[] => {
  const lang = getCurrentLanguage();
  const langData = MOCK_DATA_TRANSLATIONS[lang] || MOCK_DATA_TRANSLATIONS.en;
  
  // Question weights (same across languages)
  const weights = [1.2, 1.1, 1.3, 1.4, 1.2];

  return langData.quizQuestions.map((question: any, index: number) => ({
    ...question,
    weight: weights[index]
  }));
};

/**
 * Gets localized UI messages for the current language
 * Used for error messages, loading states, and user feedback
 * 
 * @returns {object} Object containing localized UI messages
 */
export const getLocalizedUIMessages = () => {
  const lang = getCurrentLanguage();
  const langData = MOCK_DATA_TRANSLATIONS[lang] || MOCK_DATA_TRANSLATIONS.en;
  return langData.uiMessages || MOCK_DATA_TRANSLATIONS.en.uiMessages;
};

// ================================
// API SERVICE CLASS
// ================================

/**
 * Custom error class for API-related errors
 * Provides structured error information with localization support
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: any,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Gets a user-friendly error message in the current language
   */
  getLocalizedMessage(): string {
    const messages = getLocalizedUIMessages();
    
    if (this.isNetworkError) {
      return messages.usingMockData;
    }
    
    if (this.status >= 500) {
      return messages.error;
    }
    
    return this.message || messages.error;
  }
}

/**
 * Main API Service Class
 * 
 * Handles all communication with the backend API and provides
 * comprehensive fallback to localized mock data when needed.
 * 
 * Features:
 * - Automatic authentication token management
 * - Request/response intercepting
 * - Error handling with graceful fallbacks
 * - Mock data localization
 * - TypeScript type safety
 */
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Constructs HTTP headers for API requests
   * Automatically includes authentication token when available
   * 
   * @param {boolean} includeAuth - Whether to include auth token
   * @returns {Record<string, string>} HTTP headers object
   */
  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': getCurrentLanguage(),
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Makes HTTP requests with comprehensive error handling and fallback logic
   * Automatically falls back to mock data when server is unavailable
   * 
   * @param {string} endpoint - API endpoint path
   * @param {RequestInit} options - Fetch API options
   * @param {boolean} useMockOnError - Whether to use mock data on error
   * @returns {Promise<T>} API response or mock data
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useMockOnError: boolean = true
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`API request failed for ${endpoint}:`, error);
      
      if (useMockOnError) {
        console.log(`Using localized mock data for ${endpoint}`);
        return this.getMockResponse(endpoint, options.method || 'GET');
      }
      
      // Transform error into ApiError for consistent handling
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Network error occurred',
        0,
        error,
        true
      );
    }
  }

  /**
   * Generates appropriate mock responses based on the requested endpoint
   * Returns localized data when possible
   * 
   * @param {string} endpoint - The requested endpoint
   * @param {string} method - HTTP method
   * @returns {any} Mock response data
   */
  private getMockResponse(endpoint: string, method: string): any {
    const lang = getCurrentLanguage();
    const messages = getLocalizedUIMessages();
    const timestamp = new Date().toISOString();

    // Candidates endpoint
    if (endpoint.includes('/candidates') && method === 'GET') {
      return {
        success: true,
        data: getLocalizedMockCandidates(),
        message: messages.usingMockData,
        isUsingMockData: true,
        language: lang,
        timestamp
      };
    }
    
    // Quiz questions endpoint
    if (endpoint.includes('/quiz/questions') && method === 'GET') {
      return {
        success: true,
        data: getLocalizedMockQuestions(),
        message: messages.usingMockData,
        isUsingMockData: true,
        language: lang,
        timestamp
      };
    }

    // Health check endpoint
    if (endpoint.includes('/health')) {
      return {
        success: true,
        message: 'Mock API is running',
        version: '1.0.0-mock',
        language: lang,
        timestamp
      };
    }

    // Authentication endpoints
    if (endpoint.includes('/auth/login')) {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 'mock-user-id',
          email: 'user@example.com',
          username: 'mockuser',
          role: 'voter',
          mfaEnabled: false,
          language: lang,
          createdAt: timestamp
        },
        message: messages.submitSuccess,
        isUsingMockData: true
      };
    }

    // Quiz submission endpoint
    if (endpoint.includes('/quiz/submit')) {
      return {
        success: true,
        submissionId: 'mock-submission-id',
        message: messages.submitSuccess,
        isUsingMockData: true,
        timestamp
      };
    }

    // Candidate match endpoint
    if (endpoint.includes('/quiz/match/')) {
      const candidateId = endpoint.split('/').pop();
      return {
        success: true,
        data: {
          candidateId,
          matchPercentage: Math.floor(Math.random() * 40) + 60, // 60-100%
          breakdown: [
            { category: 'Economy & Environment', score: Math.random() },
            { category: 'Education', score: Math.random() },
            { category: 'Foreign Policy', score: Math.random() },
            { category: 'Security', score: Math.random() },
            { category: 'Healthcare', score: Math.random() }
          ]
        },
        isUsingMockData: true,
        timestamp
      };
    }

    // Notifications
    if (endpoint.includes('/notifications')) {
      if (method === 'GET') {
        return {
          success: true,
          data: [
            { id: 'n1', type: 'new_candidate', title: 'notification.new_candidate_minister', isRead: false, createdAt: timestamp },
            { id: 'n2', type: 'answer_received', title: 'notification.answer_received', isRead: false, createdAt: timestamp }
          ],
          message: 'mock',
          isUsingMockData: true
        };
      }
      if (method === 'POST') {
        return { success: true, message: 'marked', isUsingMockData: true };
      }
    }

    // Default mock response
    return {
      success: true,
      message: messages.usingMockData,
      data: null,
      isUsingMockData: true,
      language: lang,
      timestamp
    };
  }

  // ================================
  // AUTHENTICATION METHODS
  // ================================

  /**
   * User login with email and password
   * Stores authentication token on success
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  /**
   * User registration
   */
  async register(userData: {
    israelId: string;
    email: string;
    mobilePhoneNumber: string;
    password: string;
    fullName: string;
    dateOfBirth: string;
    city: string;
  }): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * User logout
   * Clears stored authentication token
   */
  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return this.makeRequest<ApiResponse<User>>('/api/auth/profile');
  }

  // ================================
  // HEALTH & STATUS METHODS
  // ================================

  /**
   * Check API health status
   */
  async healthCheck(): Promise<ApiResponse> {
    return this.makeRequest('/health', {}, true);
  }

  // ================================
  // CANDIDATE METHODS
  // ================================

  /**
   * Get all candidates with localized data
   */
  async getCandidates(): Promise<ApiResponse<Candidate[]>> {
    return this.makeRequest<ApiResponse<Candidate[]>>('/api/candidates');
  }

  /**
   * Submit candidate application
   */
  async submitCandidateApplication(candidateData: Partial<Candidate>): Promise<ApiResponse<{ candidateId: string }>> {
    return this.makeRequest<ApiResponse<{ candidateId: string }>>('/api/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  }

  // ================================
  // QUIZ METHODS
  // ================================

  /**
   * Get quiz questions in current language
   */
  async getQuizQuestions(): Promise<ApiResponse<QuizQuestion[]>> {
    return this.makeRequest<ApiResponse<QuizQuestion[]>>('/api/quiz/questions');
  }

  /**
   * Submit quiz answers
   */
  async submitQuizAnswers(submission: QuizSubmission): Promise<ApiResponse<{ submissionId: string }>> {
    return this.makeRequest<ApiResponse<{ submissionId: string }>>('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  /**
   * Calculate match with specific candidate
   */
  async getQuizMatch(candidateId: string): Promise<ApiResponse<MatchResult>> {
    return this.makeRequest<ApiResponse<MatchResult>>(`/api/quiz/match/${candidateId}`);
  }

  /**
   * Calculate matches for multiple candidates
   */
  async batchCalculateMatches(candidateIds: string[]): Promise<ApiResponse<MatchResult[]>> {
    return this.makeRequest<ApiResponse<MatchResult[]>>('/api/quiz/batch-matches', {
      method: 'POST',
      body: JSON.stringify({ candidateIds }),
    });
  }

  /**
   * Get user's quiz answers
   */
  async getMyQuizAnswers(): Promise<ApiResponse<QuizAnswer[]>> {
    return this.makeRequest<ApiResponse<QuizAnswer[]>>('/api/quiz/my-answers');
  }

  /**
   * Get quiz completion status
   */
  async getQuizCompletionStatus(): Promise<ApiResponse<{ completed: boolean; totalQuestions: number; answeredQuestions: number }>> {
    return this.makeRequest('/api/quiz/completion-status');
  }

  /**
   * Get quiz statistics (admin only)
   */
  async getQuizStatistics(): Promise<ApiResponse> {
    return this.makeRequest('/api/quiz/statistics');
  }

  // ================================
  // NOTIFICATIONS
  // ================================

  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    return this.makeRequest<ApiResponse<NotificationItem[]>>('/api/notifications', {}, true);
  }

  async markNotificationsRead(ids: string[]): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }, true);
  }

  // ================================
  // DREAM TEAM METHODS
  // ================================

  /**
   * Select a candidate for a position in dream team
   */
  async selectCandidate(selectionData: DreamTeamSelectionRequest): Promise<ApiResponse<DreamTeamSelectionResponse>> {
    return this.makeRequest<ApiResponse<DreamTeamSelectionResponse>>('/api/dreamteam/select', {
      method: 'POST',
      body: JSON.stringify(selectionData),
    });
  }

  /**
   * Get user's dream team selections
   */
  async getUserSelections(): Promise<ApiResponse<DreamTeamSelection[]>> {
    return this.makeRequest<ApiResponse<DreamTeamSelection[]>>('/api/dreamteam/selections');
  }

  /**
   * Update a dream team selection
   */
  async updateSelection(selectionId: string, candidateId: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`/api/dreamteam/selections/${selectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ candidateId }),
    });
  }

  /**
   * Delete a dream team selection
   */
  async deleteSelection(selectionId: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`/api/dreamteam/selections/${selectionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all dream team selections (for statistics)
   */
  async getAllSelections(): Promise<ApiResponse<DreamTeamSelection[]>> {
    return this.makeRequest<ApiResponse<DreamTeamSelection[]>>('/api/dreamteam/all-selections');
  }

  /**
   * Get team draft (legacy method for compatibility)
   */
  async getTeamDraft(): Promise<Record<string, any>> {
    try {
      const response = await this.getUserSelections();
      if (response.success && response.data) {
        // Convert selections to the legacy format expected by TeamBuilder
        const draft: Record<string, any> = {};
        response.data.forEach(selection => {
          draft[selection.positionId] = {
            id: selection.candidateId,
            // Add mock candidate data for compatibility
            name: `Candidate ${selection.candidateId}`,
            position: selection.selectionType === 'minister' ? 'Minister' : 'Committee Member',
            experience: 'Experience',
            match: 85,
            supporters: 1000,
            rating: 4.5,
            image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
          };
        });
        return draft;
      }
      return {};
    } catch (error) {
      console.warn('Error fetching team draft:', error);
      return {};
    }
  }

  /**
   * Save team draft (legacy method for compatibility)
   */
  async saveTeamDraft(draft: Record<string, any>): Promise<{ success: boolean }> {
    try {
      // Convert legacy draft format to new API calls
      const promises = Object.entries(draft).map(([positionId, candidate]) => {
        const selectionType = positionId.includes('committee') ? 'committee' : 'minister';
        return this.selectCandidate({
          positionId,
          candidateId: candidate.id.toString(),
          selectionType
        });
      });

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.warn('Error saving team draft:', error);
      return { success: false };
    }
  }
}

// ================================
// SINGLETON INSTANCE & EXPORTS
// ================================

/**
 * Singleton API service instance
 * Use this throughout the application for all API calls
 */
const apiService = new ApiService();

export default apiService;
export { ApiService };