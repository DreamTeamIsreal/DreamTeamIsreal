import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SystemOverview from '../components/SystemOverview';
import KeyFeatures from '../components/KeyFeatures';
import PlatformDemo from '../components/PlatformDemo';
import CandidateShowcase from '../components/CandidateShowcase';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
    // Add immediate console log and alert to test if JavaScript is working
    console.log('LandingPage component is loading...');

    return (
        <div className="min-h-screen">
            <Header/>
            <Hero/>
            <SystemOverview/>
            <KeyFeatures/>
            <PlatformDemo/>
            <CandidateShowcase/>
            <CallToAction/>
            <Footer/>
        </div>
    );
};

export default LandingPage;