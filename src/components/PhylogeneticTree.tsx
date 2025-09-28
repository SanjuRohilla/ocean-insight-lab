import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TreePine, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search,
  Info,
  Dna,
  Play,
  Pause
} from 'lucide-react';
import OceanLifeBackground from './OceanLifeBackground';

interface TreeNode {
  id: string;
  name: string;
  level: string;
  children?: TreeNode[];
  confidence?: number;
  novelSpecies?: boolean;
  sequenceCount?: number;
}

const PhylogeneticTree: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Mock phylogenetic data
  const treeData: TreeNode = {
    id: 'root',
    name: 'Marine Life',
    level: 'Domain',
    children: [
      {
        id: 'bacteria',
        name: 'Bacteria',
        level: 'Kingdom',
        sequenceCount: 487,
        children: [
          {
            id: 'proteobacteria',
            name: 'Proteobacteria',
            level: 'Phylum',
            confidence: 94,
            sequenceCount: 234,
            children: [
              {
                id: 'gammaproteobacteria',
                name: 'Gammaproteobacteria',
                level: 'Class',
                confidence: 89,
                sequenceCount: 156,
                novelSpecies: true
              }
            ]
          },
          {
            id: 'firmicutes',
            name: 'Firmicutes',
            level: 'Phylum',
            confidence: 92,
            sequenceCount: 123
          }
        ]
      },
      {
        id: 'eukarya',
        name: 'Eukarya',
        level: 'Kingdom',
        sequenceCount: 421,
        children: [
          {
            id: 'animalia',
            name: 'Animalia',
            level: 'Phylum',
            confidence: 97,
            sequenceCount: 289,
            children: [
              {
                id: 'cnidaria',
                name: 'Cnidaria',
                level: 'Class',
                confidence: 95,
                sequenceCount: 87,
                novelSpecies: true
              },
              {
                id: 'mollusca',
                name: 'Mollusca',
                level: 'Class',
                confidence: 91,
                sequenceCount: 76
              }
            ]
          },
          {
            id: 'plantae',
            name: 'Plantae',
            level: 'Phylum',
            confidence: 88,
            sequenceCount: 132
          }
        ]
      },
      {
        id: 'archaea',
        name: 'Archaea',
        level: 'Kingdom',
        sequenceCount: 218,
        children: [
          {
            id: 'methanobrevibacter',
            name: 'Methanobrevibacter',
            level: 'Genus',
            confidence: 86,
            sequenceCount: 45,
            novelSpecies: true
          }
        ]
      }
    ]
  };

  const drawTree = (time: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas with ocean gradient background
    const gradient = ctx.createRadialGradient(
      canvas.offsetWidth / 2, canvas.offsetHeight / 2, 0,
      canvas.offsetWidth / 2, canvas.offsetHeight / 2, Math.max(canvas.offsetWidth, canvas.offsetHeight)
    );
    gradient.addColorStop(0, 'hsl(215, 100%, 12%)');
    gradient.addColorStop(0.5, 'hsl(218, 100%, 8%)');
    gradient.addColorStop(1, 'hsl(220, 100%, 4%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Apply zoom
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);

    // Draw animated background particles
    if (isPlaying) {
      for (let i = 0; i < 30; i++) {
        const particleX = (Math.sin(time * 0.001 + i * 0.5) * 50) + (i % 10) * (canvas.offsetWidth / 10);
        const particleY = (Math.cos(time * 0.0005 + i * 0.3) * 30) + (Math.floor(i / 10)) * (canvas.offsetHeight / 3);
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(184, 100%, 50%, ${0.3 + Math.sin(time * 0.002 + i) * 0.2})`;
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = 'hsl(184, 100%, 50%)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw tree recursively with enhanced visuals
    const drawNode = (node: TreeNode, x: number, y: number, level: number, animationProgress: number = 1) => {
      const baseRadius = 8;
      const radius = baseRadius + (level * 3) + (isPlaying ? Math.sin(time * 0.003 + level) * 2 : 0);
      
      const colors = {
        novel: `hsl(184, 100%, 50%, ${0.8 + Math.sin(time * 0.002) * 0.2})`,
        root: `hsl(174, 100%, 45%, ${0.8 + Math.sin(time * 0.002) * 0.2})`,
        branch: `hsl(158, 100%, 40%, ${0.7 + Math.sin(time * 0.002) * 0.15})`,
        default: `hsl(195, 100%, 55%, ${0.6 + Math.sin(time * 0.002) * 0.1})`
      };
      
      const color = node.novelSpecies 
        ? colors.novel
        : level === 0 
          ? colors.root 
          : level === 1
            ? colors.branch
            : colors.default;

      // Draw connection lines first (with animated glow)
      if (node.children) {
        const childSpacing = 120;
        const startX = x + 120;
        const childY = y - ((node.children.length - 1) * childSpacing) / 2;

        node.children.forEach((child, index) => {
          const childX = startX;
          const childYPos = childY + (index * childSpacing);

          // Animated connection line
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(childX - radius, childYPos);
          
          // Create flowing energy effect
          const gradient = ctx.createLinearGradient(x + radius, y, childX - radius, childYPos);
          const flowOffset = isPlaying ? (time * 0.005) % 1 : 0;
          gradient.addColorStop(0, 'hsl(184, 100%, 50%, 0.3)');
          gradient.addColorStop(flowOffset, 'hsl(174, 100%, 45%, 0.8)');
          gradient.addColorStop(1, 'hsl(158, 100%, 40%, 0.3)');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.shadowColor = 'hsl(184, 100%, 50%)';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Recursively draw child
          drawNode(child, childX, childYPos, level + 1, animationProgress);
        });
      }

      // Draw node with enhanced effects
      ctx.beginPath();
      ctx.arc(x, y, radius * animationProgress, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Multiple glow layers for novel species
      if (node.novelSpecies) {
        ctx.shadowColor = 'hsl(184, 100%, 50%)';
        ctx.shadowBlur = 20;
        ctx.fill();
        
        // Secondary glow
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(184, 100%, 50%, 0.2)`;
        ctx.fill();
        
        ctx.shadowBlur = 0;
      }

      // Inner core
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, 2 * Math.PI);
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.fill();

      // Confidence indicator ring
      if (node.confidence) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, (node.confidence / 100) * 2 * Math.PI);
        ctx.strokeStyle = `hsl(158, 100%, 40%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Enhanced label with background
      ctx.fillStyle = 'hsla(220, 100%, 4%, 0.8)';
      ctx.fillRect(x + radius + 8, y - 10, ctx.measureText(node.name).width + 8, 20);
      
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.font = `${node.novelSpecies ? 'bold' : 'normal'} ${12 + level * 2}px 'Inter', sans-serif`;
      ctx.fillText(node.name, x + radius + 12, y + 4);

      // Sequence count indicator
      if (node.sequenceCount) {
        const countText = `${node.sequenceCount}`;
        ctx.fillStyle = `hsl(184, 100%, 50%, 0.8)`;
        ctx.font = '10px Inter';
        ctx.fillText(countText, x - ctx.measureText(countText).width / 2, y + radius + 15);
      }
    };

    // Start drawing from root with animation
    const animationProgress = isAnimating ? Math.min(1, (time % 2000) / 2000) : 1;
    drawNode(treeData, 60, canvas.offsetHeight / 2, 0, animationProgress);
    
    ctx.restore();

    // Continue animation if playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawTree);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawTree);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      drawTree();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [zoomLevel, isPlaying]);

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const animateGrowth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      drawTree();
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <section id="phylogeny" className="py-20 px-6 relative">
      {/* Ocean Life Background */}
      <OceanLifeBackground />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="bio-text">Interactive</span> Phylogenetic Tree
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore evolutionary relationships and taxonomic classifications dynamically
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Tree Visualization */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-[600px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <TreePine className="w-5 h-5 text-bio-cyan" />
                    <span>Phylogenetic Tree</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
                      className="border-bio-cyan/30 text-bio-cyan hover:bg-bio-cyan/10"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.2))}
                      className="border-bio-cyan/30 text-bio-cyan hover:bg-bio-cyan/10"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(1)}
                      className="border-bio-cyan/30 text-bio-cyan hover:bg-bio-cyan/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={animateGrowth}
                      className="border-bio-green/30 text-bio-green hover:bg-bio-green/10"
                    >
                      <Dna className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAnimation}
                      className={`${
                        isPlaying 
                          ? 'border-bio-cyan/30 text-bio-cyan hover:bg-bio-cyan/10' 
                          : 'border-muted/30 text-muted hover:bg-muted/10'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                <canvas
                  ref={canvasRef}
                  className={`w-full h-full cursor-crosshair transition-all duration-1000 ${
                    isAnimating ? 'animate-fade-in' : ''
                  }`}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    // Simple node selection logic (mock)
                    setSelectedNode(treeData.children?.[0] || null);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Node Information */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-bio-cyan" />
                  <span>Node Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedNode ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxonomic Name</p>
                      <p className="text-lg font-semibold bio-text">{selectedNode.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Classification Level</p>
                      <Badge variant="outline" className="text-bio-cyan border-bio-cyan/30">
                        {selectedNode.level}
                      </Badge>
                    </div>
                    {selectedNode.confidence && (
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence Score</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-ocean-surface rounded-full h-2">
                            <div 
                              className="bg-bio-green h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${selectedNode.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedNode.confidence}%</span>
                        </div>
                      </div>
                    )}
                    {selectedNode.sequenceCount && (
                      <div>
                        <p className="text-sm text-muted-foreground">Sequence Count</p>
                        <p className="text-xl font-bold bio-text">{selectedNode.sequenceCount}</p>
                      </div>
                    )}
                    {selectedNode.novelSpecies && (
                      <Badge variant="outline" className="text-bio-cyan border-bio-cyan bg-bio-cyan/10">
                        🧬 Novel Species
                      </Badge>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <TreePine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click on any node to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Tree Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 glass-card text-center">
                    <p className="text-2xl font-bold bio-text">1,247</p>
                    <p className="text-xs text-muted-foreground">Total Taxa</p>
                  </div>
                  <div className="p-3 glass-card text-center">
                    <p className="text-2xl font-bold text-bio-cyan">23</p>
                    <p className="text-xs text-muted-foreground">Novel Species</p>
                  </div>
                  <div className="p-3 glass-card text-center">
                    <p className="text-2xl font-bold text-bio-green">95.2%</p>
                    <p className="text-xs text-muted-foreground">Avg Confidence</p>
                  </div>
                  <div className="p-3 glass-card text-center">
                    <p className="text-2xl font-bold text-bio-teal">8</p>
                    <p className="text-xs text-muted-foreground">Max Depth</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-bio-teal bio-glow"></div>
                  <span className="text-sm">Root Node</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-bio-green"></div>
                  <span className="text-sm">Standard Taxa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-bio-cyan bio-glow"></div>
                  <span className="text-sm">Novel Species</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhylogeneticTree;