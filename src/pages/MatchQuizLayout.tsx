// pages/MatchQuizLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import PlatformHeader from '../components/platform/PlatformHeader.tsx'; // Adjust path
import Footer from '../components/Footer.tsx'; // Adjust path

const MatchQuizLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col"> {/* Re-added gradient background for consistency */}
            <PlatformHeader />
            <main className="flex-grow"> {/* 'flex-grow' to push footer to bottom */}
                {/* This div applies the desired width constraints and padding */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* The Outlet will render MatchQuiz here, and MatchQuiz itself has a white background div */}
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MatchQuizLayout;