import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Waves, 
  Gauge, 
  Droplets, 
  Mountain,
  Fish,
  Shell,
  Microscope,
  Zap
} from 'lucide-react';
import geologicalImage from '@/assets/geological-environment.jpg';

const GeologicalSimulator: React.FC = () => {
  const [parameters, setParameters] = useState({
    depth: [2000],
    temperature: [4],
    salinity: [35],
    pressure: [200],
    oxygen: [6],
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const parameterConfig = [
    { 
      key: 'depth', 
      label: 'Depth', 
      icon: Mountain, 
      unit: 'm', 
      min: 0, 
      max: 6000, 
      color: 'bio-blue' 
    },
    { 
      key: 'temperature', 
      label: 'Temperature', 
      icon: Thermometer, 
      unit: '°C', 
      min: -2, 
      max: 30, 
      color: 'bio-cyan' 
    },
    { 
      key: 'salinity', 
      label: 'Salinity', 
      icon: Droplets, 
      unit: 'PSU', 
      min: 30, 
      max: 40, 
      color: 'bio-teal' 
    },
    { 
      key: 'pressure', 
      label: 'Pressure', 
      icon: Gauge, 
      unit: 'atm', 
      min: 1, 
      max: 600, 
      color: 'bio-green' 
    },
  ];

  const organismTypes = [
    { 
      name: 'Deep-sea Fish', 
      icon: Fish, 
      survivability: calculateSurvivability('fish'),
      description: 'Adapted to high pressure and low light conditions'
    },
    { 
      name: 'Coral Communities', 
      icon: Shell, 
      survivability: calculateSurvivability('coral'),
      description: 'Require specific temperature and light conditions'
    },
    { 
      name: 'Extremophiles', 
      icon: Zap, 
      survivability: calculateSurvivability('extremophile'),
      description: 'Thrive in extreme environmental conditions'
    },
    { 
      name: 'Microorganisms', 
      icon: Microscope, 
      survivability: calculateSurvivability('microorganism'),
      description: 'Highly adaptable to various conditions'
    },
  ];

  function calculateSurvivability(type: string): number {
    const depth = parameters.depth[0];
    const temp = parameters.temperature[0];
    const salinity = parameters.salinity[0];
    
    switch (type) {
      case 'fish':
        return Math.max(0, Math.min(100, 
          100 - (Math.abs(depth - 1000) / 50) - (Math.abs(temp - 4) * 10)
        ));
      case 'coral':
        return Math.max(0, Math.min(100,
          100 - (depth / 30) - (Math.abs(temp - 25) * 5)
        ));
      case 'extremophile':
        return Math.max(60, Math.min(100, 
          80 + (depth / 100) + (Math.abs(temp) * 2)
        ));
      case 'microorganism':
        return Math.max(70, 95);
      default:
        return 50;
    }
  }

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const ecosystemHealth = (
      organismTypes.reduce((sum, org) => sum + org.survivability, 0) / organismTypes.length
    );
    
    setResults({
      ecosystemHealth: Math.round(ecosystemHealth),
      dominantSpecies: organismTypes.sort((a, b) => b.survivability - a.survivability)[0].name,
      biodiversityIndex: Math.round((ecosystemHealth / 100) * 4.2 * 100) / 100,
      predictedSpecies: Math.round(ecosystemHealth * 2.3),
    });
    
    setIsSimulating(false);
  };

  return (
    <section id="geological" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="bio-text">Geological</span> Condition Simulator
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Predict marine life survivability based on environmental parameters using AI modeling
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Parameter Controls */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Waves className="w-5 h-5 text-bio-cyan" />
                  <span>Environmental Parameters</span>
                </CardTitle>
                <CardDescription>
                  Adjust conditions to simulate different marine environments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {parameterConfig.map((param) => (
                  <div key={param.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <param.icon className={`w-4 h-4 text-${param.color}`} />
                        <span className="font-medium">{param.label}</span>
                      </div>
                      <Badge variant="outline" className={`text-${param.color} border-${param.color}/30`}>
                        {parameters[param.key as keyof typeof parameters][0]} {param.unit}
                      </Badge>
                    </div>
                    <Slider
                      value={parameters[param.key as keyof typeof parameters]}
                      onValueChange={(value) => 
                        setParameters(prev => ({ ...prev, [param.key]: value }))
                      }
                      min={param.min}
                      max={param.max}
                      step={param.key === 'temperature' ? 0.1 : 1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{param.min} {param.unit}</span>
                      <span>{param.max} {param.unit}</span>
                    </div>
                  </div>
                ))}
                
                <Button 
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full bg-gradient-bio text-ocean-depth font-semibold hover-bio"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-ocean-depth border-t-transparent rounded-full animate-spin mr-2" />
                      Running AI Simulation...
                    </>
                  ) : (
                    'Run Ecosystem Simulation'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card className="glass-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-bio-cyan">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 glass-card">
                      <p className="text-sm text-muted-foreground">Ecosystem Health</p>
                      <p className="text-2xl font-bold bio-text">{results.ecosystemHealth}%</p>
                    </div>
                    <div className="p-3 glass-card">
                      <p className="text-sm text-muted-foreground">Predicted Species</p>
                      <p className="text-2xl font-bold bio-text">{results.predictedSpecies}</p>
                    </div>
                  </div>
                  <div className="p-3 glass-card">
                    <p className="text-sm text-muted-foreground">Dominant Species Type</p>
                    <p className="text-lg font-semibold">{results.dominantSpecies}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Organism Survivability */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Organism Survivability Prediction</CardTitle>
                <CardDescription>
                  AI-predicted survival rates for different marine life forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {organismTypes.map((organism) => (
                  <div key={organism.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 glass-card rounded-lg">
                          <organism.icon className="w-5 h-5 text-bio-cyan" />
                        </div>
                        <div>
                          <p className="font-medium">{organism.name}</p>
                          <p className="text-xs text-muted-foreground">{organism.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          organism.survivability > 70 ? 'text-bio-green border-bio-green/30' :
                          organism.survivability > 40 ? 'text-bio-cyan border-bio-cyan/30' :
                          'text-destructive border-destructive/30'
                        }`}
                      >
                        {Math.round(organism.survivability)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-ocean-surface rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          organism.survivability > 70 ? 'bg-bio-green' :
                          organism.survivability > 40 ? 'bg-bio-cyan' :
                          'bg-destructive'
                        }`}
                        style={{ width: `${organism.survivability}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environment Preview */}
            <Card className="glass-card overflow-hidden">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${geologicalImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-depth/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-medium mb-2">Current Environment</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {parameters.depth[0]}m depth
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {parameters.temperature[0]}°C
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {parameters.pressure[0]} atm
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeologicalSimulator;