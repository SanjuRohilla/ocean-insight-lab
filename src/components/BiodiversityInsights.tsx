import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Globe,
  Zap,
  Users,
  Target
} from 'lucide-react';

declare global {
  interface Window {
    voiceflow: any;
  }
}

const BiodiversityInsights: React.FC = () => {
  const [animatedValues, setAnimatedValues] = useState({
    speciesRichness: 0,
    shannonIndex: 0,
    simpsonIndex: 0,
    evenness: 0,
  });
  const voiceflowLoaded = useRef(false);

  const targetValues = {
    speciesRichness: 1247,
    shannonIndex: 3.42,
    simpsonIndex: 0.78,
    evenness: 0.89,
  };

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        speciesRichness: Math.round(targetValues.speciesRichness * easeOutQuart),
        shannonIndex: +(targetValues.shannonIndex * easeOutQuart).toFixed(2),
        simpsonIndex: +(targetValues.simpsonIndex * easeOutQuart).toFixed(2),
        evenness: +(targetValues.evenness * easeOutQuart).toFixed(2),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  // Load Voiceflow chatbot
  useEffect(() => {
    if (voiceflowLoaded.current) return;
    voiceflowLoaded.current = true;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = () => {
      if (window.voiceflow) {
        window.voiceflow.chat.load({
          verify: { projectID: '68de1ef55427f87add0e664b' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          },
          render: {
            mode: 'embedded',
            target: document.getElementById('voiceflow-chat')
          }
        });
      }
    };
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const ecosystemMetrics = [
    {
      label: 'Species Richness',
      value: animatedValues.speciesRichness,
      description: 'Total number of unique species identified',
      icon: Globe,
      color: 'bio-cyan',
      format: (val: number) => val.toLocaleString()
    },
    {
      label: 'Shannon Diversity Index',
      value: animatedValues.shannonIndex,
      description: 'Measures species diversity accounting for abundance',
      icon: BarChart3,
      color: 'bio-teal',
      format: (val: number) => val.toFixed(2)
    },
    {
      label: 'Simpson Index',
      value: animatedValues.simpsonIndex,
      description: 'Probability that two randomly selected individuals belong to different species',
      icon: PieChart,
      color: 'bio-green',
      format: (val: number) => val.toFixed(2)
    },
    {
      label: 'Pielou Evenness',
      value: animatedValues.evenness,
      description: 'How evenly species are distributed in the community',
      icon: Activity,
      color: 'bio-blue',
      format: (val: number) => val.toFixed(2)
    }
  ];

  const taxonomicDistribution = [
    { group: 'Bacteria', count: 487, percentage: 39, color: 'bio-cyan' },
    { group: 'Protists', count: 234, percentage: 19, color: 'bio-teal' },
    { group: 'Fish', count: 198, percentage: 16, color: 'bio-green' },
    { group: 'Invertebrates', count: 176, percentage: 14, color: 'bio-blue' },
    { group: 'Algae', count: 89, percentage: 7, color: 'accent' },
    { group: 'Other', count: 63, percentage: 5, color: 'muted' },
  ];

  const threatLevels = [
    { level: 'Critically Endangered', count: 12, color: 'destructive' },
    { level: 'Endangered', count: 34, color: 'bio-blue' },
    { level: 'Vulnerable', count: 67, color: 'bio-teal' },
    { level: 'Near Threatened', count: 89, color: 'bio-green' },
    { level: 'Least Concern', count: 1045, color: 'bio-cyan' },
  ];

  const novelFindings = [
    {
      title: 'Deep-sea Hydrothermal Vent Bacteria',
      description: 'Previously unknown thermophilic bacteria discovered at 3,200m depth',
      confidence: 94,
      novelty: 'High',
      sequences: 156
    },
    {
      title: 'Bioluminescent Plankton Species',
      description: 'New dinoflagellate with unique light-producing mechanisms',
      confidence: 87,
      novelty: 'Medium',
      sequences: 89
    },
    {
      title: 'Arctic Deep-water Coral',
      description: 'Cold-water coral species adapted to extreme polar conditions',
      confidence: 91,
      novelty: 'High',
      sequences: 67
    }
  ];

  return (
    <section id="insights" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="bio-text">Biodiversity</span> Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive analysis of marine ecosystem diversity and conservation status
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-12">
          {/* Ecosystem Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemMetrics.map((metric) => (
              <Card key={metric.label} className="glass-card hover-bio group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 text-${metric.color} group-hover:scale-110 transition-transform`} />
                    <Badge variant="outline" className={`text-${metric.color} border-${metric.color}/30`}>
                      Live
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold bio-text">
                      {metric.format(metric.value)}
                    </p>
                    <p className="font-medium text-foreground">{metric.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Taxonomic Distribution */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-bio-cyan" />
                  <span>Taxonomic Distribution</span>
                </CardTitle>
                <CardDescription>
                  Species composition across major taxonomic groups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {taxonomicDistribution.map((group) => (
                  <div key={group.group} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{group.group}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {group.count} species
                        </span>
                        <Badge variant="outline" className={`text-${group.color} border-${group.color}/30`}>
                          {group.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-ocean-surface rounded-full h-3">
                      <div 
                        className={`bg-${group.color} h-3 rounded-full transition-all duration-2000 animate-pulse-bio`}
                        style={{ 
                          width: `${group.percentage}%`,
                          animationDelay: `${taxonomicDistribution.indexOf(group) * 0.2}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Conservation Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-bio-cyan" />
                  <span>Conservation Status</span>
                </CardTitle>
                <CardDescription>
                  IUCN Red List assessment of identified species
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {threatLevels.map((threat) => (
                  <div key={threat.level} className="flex items-center justify-between p-3 glass-card hover-glass">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${threat.color}`} />
                      <span className="font-medium">{threat.level}</span>
                    </div>
                    <Badge variant="outline" className={`text-${threat.color} border-${threat.color}/30`}>
                      {threat.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Novel Discoveries */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-bio-cyan" />
                <span>Novel Species Discoveries</span>
              </CardTitle>
              <CardDescription>
                Potentially new species identified through eDNA analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {novelFindings.map((finding) => (
                  <Card key={finding.title} className="glass-card hover-bio group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`${
                            finding.novelty === 'High' 
                              ? 'text-bio-cyan border-bio-cyan/30' 
                              : 'text-bio-teal border-bio-teal/30'
                          }`}
                        >
                          {finding.novelty} Novelty
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {finding.sequences} sequences
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 bio-text group-hover:text-bio-cyan transition-colors">
                          {finding.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {finding.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Score</span>
                          <span className="font-medium">{finding.confidence}%</span>
                        </div>
                        <div className="w-full bg-ocean-surface rounded-full h-2">
                          <div 
                            className="bg-bio-green h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${finding.confidence}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Interface with Voiceflow */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-bio-cyan" />
                <span>Ask the AI Researcher</span>
              </CardTitle>
              <CardDescription>
                Query our AI system about marine biodiversity patterns and discoveries using the chat widget below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div id="voiceflow-chat" className="min-h-[500px] w-full glass-card rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BiodiversityInsights;