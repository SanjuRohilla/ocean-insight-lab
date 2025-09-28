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
  Dna
} from 'lucide-react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Apply zoom
    ctx.scale(zoomLevel, zoomLevel);

    // Draw tree recursively
    const drawNode = (node: TreeNode, x: number, y: number, level: number) => {
      const radius = 6 + (level * 2);
      const color = node.novelSpecies 
        ? 'hsl(var(--bio-cyan))' 
        : level === 0 
          ? 'hsl(var(--bio-teal))' 
          : 'hsl(var(--bio-green))';

      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Add glow effect for novel species
      if (node.novelSpecies) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw label
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.font = `${10 + level}px Inter`;
      ctx.fillText(node.name, x + radius + 5, y + 3);

      // Draw connections to children
      if (node.children) {
        const childSpacing = 120;
        const startX = x + 100;
        const childY = y - ((node.children.length - 1) * childSpacing) / 2;

        node.children.forEach((child, index) => {
          const childX = startX;
          const childYPos = childY + (index * childSpacing);

          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(childX - radius, childYPos);
          ctx.strokeStyle = 'hsl(var(--border))';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Recursively draw child
          drawNode(child, childX, childYPos, level + 1);
        });
      }
    };

    // Start drawing from root
    drawNode(treeData, 50, canvas.offsetHeight / 2, 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      drawTree();
      setTimeout(() => setIsAnimating(false), 1000);
    }, 500);

    return () => clearTimeout(timer);
  }, [zoomLevel]);

  const animateGrowth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      drawTree();
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <section id="phylogeny" className="py-20 px-6">
      <div className="container mx-auto">
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