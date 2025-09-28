import React from 'react';

const DNAHelix: React.FC = () => {
  return (
    <div className="relative w-32 h-64 mx-auto">
      <div className="absolute inset-0 animate-dna">
        {/* DNA Strand 1 */}
        <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-bio-cyan to-bio-teal rounded-full opacity-80">
          <div className="absolute inset-0 animate-pulse-bio rounded-full"></div>
        </div>
        
        {/* DNA Strand 2 */}
        <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-b from-bio-teal to-bio-green rounded-full opacity-80">
          <div className="absolute inset-0 animate-pulse-bio rounded-full"></div>
        </div>
        
        {/* Base Pairs */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute left-1 right-1 h-0.5 bg-gradient-bio opacity-60"
            style={{
              top: `${(i * 8) + 8}%`,
              transform: `rotateZ(${i * 30}deg)`,
              transformOrigin: 'center',
            }}
          >
            <div className="absolute inset-0 animate-pulse-bio"></div>
          </div>
        ))}
        
        {/* Connecting Particles */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-bio-cyan rounded-full animate-float"
            style={{
              left: `${25 + Math.sin(i * 0.5) * 25}%`,
              top: `${(i * 12) + 10}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-bio opacity-20 blur-xl animate-pulse-bio"></div>
    </div>
  );
};

export default DNAHelix;