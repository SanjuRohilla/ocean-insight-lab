import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Play, Download } from 'lucide-react';
import DNAHelix from './DNAHelix';
import heroImage from '@/assets/hero-marine-ecosystem.jpg';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-depth/60 via-ocean-dark/80 to-ocean-depth/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* DNA Helix Animation */}
          <div className="mb-8 animate-fade-in">
            <DNAHelix />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6 leading-tight">
            <span className="bio-text">Decoding</span>
            <br />
            <span className="text-foreground">the Deep</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-inter font-light mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-Driven <span className="bio-text font-semibold">eDNA Insights</span> for Ocean Life Discovery
            <br />
            Unlock the secrets of marine biodiversity through environmental DNA analysis
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Real-time Analysis', 'AI Classification', 'Biodiversity Mapping', '3D Visualization'].map((feature) => (
              <div key={feature} className="glass-card px-4 py-2 text-sm font-inter font-medium">
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-bio text-ocean-depth font-semibold text-lg px-8 py-4 h-auto hover-bio group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Analysis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-bio-cyan text-bio-cyan hover:bg-bio-cyan/10 font-semibold text-lg px-8 py-4 h-auto hover-glass group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View Demo Data
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ArrowDown className="w-8 h-8 text-bio-cyan mx-auto animate-pulse-bio" />
          </div>
        </div>
      </div>

      {/* Animated Wave Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full animate-wave"
        >
          <path
            d="M0,60 C300,0 600,120 1200,60 L1200,120 L0,120 Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--bio-cyan))" />
              <stop offset="50%" stopColor="hsl(var(--bio-teal))" />
              <stop offset="100%" stopColor="hsl(var(--bio-green))" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Hero;