import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import MethodologySection from '../components/MethodologySection';
import Footer from '../components/Footer';

export default function LandingPage() {

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const methodologyRef = useRef(null);

  const handleScroll = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onScrollHero ={() => handleScroll(heroRef)} 
        onScrollFeatures ={() => handleScroll(featuresRef)} 
        onScrollMethodology ={() => handleScroll(methodologyRef)} 
        />
      
      {/* The main tag contains the page content. 
        The padding-top (pt-24) ensures content isn't hidden 
        behind the fixed Navbar.
      */}
      <main className="flex-grow pt-18">
        <HeroSection sectionRef={heroRef} />
        <FeaturesSection sectionRef={featuresRef} />
        <MethodologySection sectionRef={methodologyRef} />
      </main>

      <Footer />
    </div>
  );
}
