import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import DashboardPreview from '@/components/DashboardPreview';
import GeologicalSimulator from '@/components/GeologicalSimulator';
import PhylogeneticTree from '@/components/PhylogeneticTree';
import BiodiversityInsights from '@/components/BiodiversityInsights';
import OceanParticles from '@/components/OceanParticles';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean relative overflow-x-hidden">
      {/* Animated Background Particles */}
      <OceanParticles />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* eDNA Analytics Dashboard */}
        <DashboardPreview />
        
        {/* Geological Condition Simulator */}
        <GeologicalSimulator />
        
        {/* Interactive Phylogenetic Tree */}
        <PhylogeneticTree />
        
        {/* Biodiversity Insights */}
        <BiodiversityInsights />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-bio rounded-lg flex items-center justify-center animate-pulse-bio">
              <span className="text-ocean-depth font-bold text-sm">🧬</span>
            </div>
            <h3 className="text-xl font-orbitron font-bold bio-text">DeepSea eDNA</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Advancing marine biodiversity research through AI-powered environmental DNA analysis
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 DeepSea eDNA Platform. Unlocking the secrets of ocean life.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
