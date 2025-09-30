import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Dna, Waves, BarChart3, TreePine, FolderOpen, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { name: 'eDNA Analytics', href: '#dashboard', icon: Dna },
    { name: 'Geo Simulator', href: '#geological', icon: Waves },
    { name: 'Phylogenetic Tree', href: '#phylogeny', icon: TreePine },
    { name: 'Biodiversity', href: '#insights', icon: BarChart3 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-bio rounded-xl flex items-center justify-center animate-pulse-bio">
              <Dna className="w-6 h-6 text-ocean-depth" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold bio-text">
                DeepSea eDNA
              </h1>
              <p className="text-xs text-muted-foreground">Marine Biodiversity AI</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-300 group"
              >
                <item.icon className="w-4 h-4 group-hover:text-bio-cyan transition-colors" />
                <span className="font-inter font-medium">{item.name}</span>
              </a>
            ))}
            {user && (
              <>
                <Link to="/projects">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <FolderOpen className="w-4 h-4" />
                    <span>Projects</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            )}
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-bio text-ocean-depth font-semibold hover-bio"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 animate-fade-in">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 p-3 glass-card hover-glass rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 text-bio-cyan" />
                <span className="font-inter font-medium">{item.name}</span>
              </a>
            ))}
            {user ? (
              <>
                <Link to="/projects" onClick={() => setIsOpen(false)}>
                  <Button className="w-full flex items-center justify-center space-x-2 glass-card">
                    <FolderOpen className="w-5 h-5" />
                    <span>Projects</span>
                  </Button>
                </Link>
                <Button 
                  onClick={() => { handleSignOut(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center space-x-2"
                  variant="outline"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => { navigate('/auth'); setIsOpen(false); }}
                className="w-full bg-gradient-bio text-ocean-depth font-semibold"
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;