import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import MethodologySection from '../components/MethodologySection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* The main tag contains the page content. 
        The padding-top (pt-24) ensures content isn't hidden 
        behind the fixed Navbar.
      */}
      <main className="flex-grow pt-24">
        <HeroSection />
        <FeaturesSection />
        <MethodologySection />
      </main>

      <Footer />
    </div>
  );
}
