import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Activity, 
  Zap, 
  TrendingUp, 
  Users, 
  Database,
  ArrowRight,
  FileText,
  Microscope
} from 'lucide-react';
import dashboardImage from '@/assets/dashboard-visualization.jpg';

const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [progress, setProgress] = useState(0);

  // Simulate AI processing
  React.useEffect(() => {
    if (activeTab === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setActiveTab('results');
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const stats = [
    { label: 'Taxa Identified', value: '1,247', icon: Microscope, color: 'bio-cyan' },
    { label: 'Novel Species', value: '23', icon: Zap, color: 'bio-teal' },
    { label: 'Sequences Processed', value: '45.2K', icon: Database, color: 'bio-green' },
    { label: 'Accuracy Rate', value: '97.8%', icon: TrendingUp, color: 'bio-blue' },
  ];

  const taxonomyData = [
    { kingdom: 'Bacteria', count: 487, percentage: 39 },
    { kingdom: 'Eukarya', count: 421, percentage: 34 },
    { kingdom: 'Archaea', count: 218, percentage: 17 },
    { kingdom: 'Viruses', count: 121, percentage: 10 },
  ];

  return (
    <section id="dashboard" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="bio-text">eDNA Analytics</span> Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced AI pipeline for environmental DNA sequence analysis and marine biodiversity discovery
          </p>
        </div>

        {/* Dashboard Interface */}
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'upload', label: 'Upload Data', icon: Upload },
              { id: 'processing', label: 'AI Processing', icon: Activity },
              { id: 'results', label: 'Results', icon: FileText },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`flex items-center space-x-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-bio text-ocean-depth' 
                    : 'border-bio-cyan text-bio-cyan hover:bg-bio-cyan/10'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
              <Card className="glass-card hover-glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-bio-cyan" />
                    <span>Upload eDNA Files</span>
                  </CardTitle>
                  <CardDescription>
                    Support for FASTA, FASTQ, and CSV formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-bio-cyan/30 rounded-lg p-8 text-center hover:border-bio-cyan/50 transition-colors">
                    <Upload className="w-12 h-12 text-bio-cyan mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Drag & drop your files here</p>
                    <Button variant="outline" className="border-bio-cyan text-bio-cyan">
                      Browse Files
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>sample_ocean_edna.fastq</span>
                      <Badge variant="secondary">Ready</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>metadata_coordinates.csv</span>
                      <Badge variant="secondary">Ready</Badge>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-bio text-ocean-depth"
                    onClick={() => setActiveTab('processing')}
                  >
                    Start AI Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Pipeline Configuration</CardTitle>
                  <CardDescription>
                    Customize your analysis parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Database Reference</label>
                    <select className="w-full p-2 rounded-lg bg-ocean-surface border border-white/20">
                      <option>NCBI GenBank (Marine)</option>
                      <option>SILVA rRNA Database</option>
                      <option>PR2 Protist Database</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Similarity Threshold</label>
                    <input 
                      type="range" 
                      min="80" 
                      max="100" 
                      defaultValue="97" 
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">97% similarity</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Organisms</label>
                    <div className="flex flex-wrap gap-2">
                      {['Bacteria', 'Fish', 'Plankton', 'Coral', 'All'].map((org) => (
                        <Badge key={org} variant="outline" className="cursor-pointer hover:bg-bio-cyan/20">
                          {org}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Processing Tab */}
          {activeTab === 'processing' && (
            <div className="space-y-8 animate-fade-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-bio-cyan animate-spin" />
                    <span>AI Pipeline Processing</span>
                  </CardTitle>
                  <CardDescription>
                    Advanced machine learning analysis in progress...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-bio-cyan font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { stage: 'Quality Control', status: progress > 20 ? 'complete' : 'active' },
                      { stage: 'Sequence Alignment', status: progress > 60 ? 'complete' : progress > 20 ? 'active' : 'pending' },
                      { stage: 'Taxonomic Classification', status: progress > 90 ? 'complete' : progress > 60 ? 'active' : 'pending' },
                    ].map((stage) => (
                      <div key={stage.stage} className="flex items-center space-x-3 p-3 glass-card">
                        <div className={`w-3 h-3 rounded-full ${
                          stage.status === 'complete' ? 'bg-bio-green' :
                          stage.status === 'active' ? 'bg-bio-cyan animate-pulse' :
                          'bg-muted'
                        }`} />
                        <span className="text-sm">{stage.stage}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-8 animate-fade-in">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Card key={stat.label} className="glass-card hover-bio">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold bio-text">{stat.value}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Taxonomy Breakdown */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Taxonomic Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of identified organisms by kingdom
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {taxonomyData.map((item) => (
                      <div key={item.kingdom} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.kingdom}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} species ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-ocean-surface rounded-full h-2">
                          <div 
                            className="bg-gradient-bio h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;