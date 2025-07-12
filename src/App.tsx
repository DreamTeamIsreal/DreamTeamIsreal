import React, { useEffect, Suspense } from 'react'; // Import Suspense here
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Import your page components
import LandingPage from './pages/LandingPage';
import PlatformEntry from './pages/PlatformEntry';
import CandidateSubmission from './pages/CandidateSubmission';
import TeamBuilder from './pages/TeamBuilder';
import DataVisualization from './pages/DataVisualization';
import AdminPanel from './pages/AdminPanel';
import CandidateProfile from './pages/CandidateProfile';
import CandidatesDirectory from './pages/CandidatesDirectory';
import MatchQuiz from './pages/MatchQuiz';
import MatchQuizLayout from './pages/MatchQuizLayout';

// About pages
import AboutProject from './pages/AboutProject';
import AboutIdea from './pages/AboutIdea';
import FullDocument from './pages/FullDocument';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';

// Legal pages
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LegalNotice from './pages/LegalNotice';
import Copyright from './pages/Copyright';

// Platform pages
import SecurityPrivacy from './pages/SecurityPrivacy';
import CandidateRequirements from './pages/CandidateRequirements';
import TechnicalSupport from './pages/TechnicalSupport';

// Note: The ReactDOM.createRoot block typically belongs in index.tsx or main.tsx.
// It's included here for context but should not be part of App.tsx itself.
// If this is your actual App.tsx, ensure your build setup correctly handles it.

function App() {
    // Add immediate console log and alert to test if JavaScript is working
    console.log('App component is loading...');

    const { t, i18n } = useTranslation('common'); // Use the 'common' namespace for generic translations

    useEffect(() => {
        // Set document direction and language based on i18n's current state
        // This removes the dependency on local isRTL and getCurrentLanguage utilities.
        document.documentElement.dir = i18n.dir(); // 'ltr' or 'rtl'
        document.documentElement.lang = i18n.language; // 'en', 'he', 'ar', etc.
    }, [i18n.dir, i18n.language]); // Re-run effect if direction or language changes

    return (
        <Suspense fallback={<div>Loading...</div>}> {/* Use t() for translation */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/platform" element={<PlatformEntry />} />
                <Route path="/candidate-submission" element={<CandidateSubmission />} />
                <Route path="/team-builder" element={<TeamBuilder />} />
                <Route path="/data-visualization" element={<DataVisualization />} />
                <Route path="/" element={<MatchQuizLayout />}>
                    <Route path="match-quiz" element={<MatchQuiz />} />
                </Route>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/candidate/:id" element={<CandidateProfile />} />
                <Route path="/candidates" element={<CandidatesDirectory />} />

                {/* About routes */}
                <Route path="/about-project" element={<AboutProject />} />
                <Route path="/about-idea" element={<AboutIdea />} />
                <Route path="/full-document" element={<FullDocument />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />

                {/* Legal routes */}
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/legal-notice" element={<LegalNotice />} />
                <Route path="/copyright" element={<Copyright />} />

                {/* Platform routes */}
                <Route path="/security-privacy" element={<SecurityPrivacy />} />
                <Route path="/candidate-requirements" element={<CandidateRequirements />} />
                <Route path="/technical-support" element={<TechnicalSupport />} />
            </Routes>
        </Suspense>
    );
}

export default App;