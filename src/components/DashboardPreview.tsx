import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
  Microscope,
  Download
} from 'lucide-react';
import dashboardImage from '@/assets/dashboard-visualization.jpg';
import OceanLifeBackground from './OceanLifeBackground';
import FileUpload from './FileUpload';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('eDNA Analysis Report', 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Summary Statistics
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, 65);
    doc.setFontSize(12);
    doc.text('Taxa Identified: 1,247', 20, 80);
    doc.text('Novel Species: 23', 20, 95);
    doc.text('Sequences Processed: 45.2K', 20, 110);
    doc.text('Accuracy Rate: 97.8%', 20, 125);
    
    // Taxonomic Distribution
    doc.setFontSize(16);
    doc.text('Taxonomic Distribution', 20, 150);
    doc.setFontSize(12);
    taxonomyData.forEach((item, index) => {
      doc.text(`${item.kingdom}: ${item.count} species (${item.percentage}%)`, 20, 165 + (index * 15));
    });
    
    // Methodology
    doc.setFontSize(16);
    doc.text('Methodology', 20, 230);
    doc.setFontSize(10);
    doc.text('Environmental DNA (eDNA) sequences were processed using advanced AI algorithms.', 20, 245);
    doc.text('Quality control, sequence alignment, and taxonomic classification were performed', 20, 255);
    doc.text('using NCBI GenBank marine database with 97% similarity threshold.', 20, 265);
    
    doc.save('edna-analysis-report.pdf');
    
    toast({
      title: "PDF Generated",
      description: "Your eDNA analysis report has been downloaded.",
    });
  };

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
    <section id="dashboard" className="py-20 px-6 h-30">
      <OceanLifeBackground/>
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
            <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
              <div className="md:col-span-2">
                <FileUpload />
              </div>

              <div>
                <Card className="glass-card h-fit">
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
                    <Button 
                      className="w-full bg-gradient-bio text-ocean-depth mt-4"
                      onClick={() => setActiveTab('processing')}
                    >
                      Start AI Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
              {/* Dashboard Visualization */}
              <Card className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle>AI Analysis Dashboard</CardTitle>
                  <CardDescription>
                    Comprehensive visualization of eDNA sequence analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={dashboardImage} 
                      alt="eDNA Analysis Dashboard showing phylogenetic tree and biodiversity metrics" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </AspectRatio>
                </CardContent>
              </Card>

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

              {/* Download Report Button */}
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={generatePDFReport}
                  className="bg-gradient-to-r from-bio-green to-bio-teal text-ocean-depth px-8 py-3 text-lg font-semibold"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;