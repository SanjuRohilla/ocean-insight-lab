import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import OceanLifeBackground from '@/components/OceanLifeBackground';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: newProjectName,
          description: newProjectDescription,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProject(false);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-bio-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <OceanLifeBackground />
      <Navigation />
      
      <div className="container mx-auto px-6 py-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-orbitron font-bold mb-2">
              <span className="bio-text">My Projects</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your eDNA analysis projects
            </p>
          </div>
          <Button
            onClick={() => setShowNewProject(!showNewProject)}
            className="bg-gradient-bio text-ocean-depth"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {showNewProject && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Start a new eDNA analysis project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createProject} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Marine Biodiversity Study 2025"
                    required
                    className="bg-ocean-surface border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe your project goals and methodology..."
                    className="bg-ocean-surface border-white/20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-gradient-bio text-ocean-depth">
                    Create Project
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProject(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="glass-card hover-bio">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  {getStatusIcon(project.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{project.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && !showNewProject && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first eDNA analysis project to get started
              </p>
              <Button
                onClick={() => setShowNewProject(true)}
                className="bg-gradient-bio text-ocean-depth"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;