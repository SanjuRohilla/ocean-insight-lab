import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Copy, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pastedContent, setPastedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          content: e.target?.result as string,
        };
        
        setFiles(prev => [...prev, newFile]);
        toast({
          title: "File uploaded",
          description: `${file.name} has been successfully uploaded.`,
        });
      };
      reader.readAsText(file);
    });
  };

  const handlePasteContent = () => {
    if (pastedContent.trim()) {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: `pasted_content_${Date.now()}.txt`,
        size: pastedContent.length,
        type: 'text/plain',
        content: pastedContent,
      };
      
      setFiles(prev => [...prev, newFile]);
      setPastedContent('');
      toast({
        title: "Content added",
        description: "Pasted content has been added to your files.",
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    toast({
      title: "File removed",
      description: "File has been removed from the list.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (file: UploadedFile) => {
    if (file.content) {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-bio-cyan" />
            <span>File Upload</span>
          </CardTitle>
          <CardDescription>
            Upload eDNA sequence files (FASTA, FASTQ, CSV, TXT)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-bio-cyan/30 rounded-lg p-8 text-center hover:border-bio-cyan/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-bio-cyan mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Click to browse or drag & drop your files here</p>
            <p className="text-sm text-muted-foreground">Supports: .fasta, .fastq, .csv, .txt files</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".fasta,.fastq,.csv,.txt,.fa,.fq"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Copy-Paste Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Copy className="w-5 h-5 text-bio-teal" />
            <span>Paste Content</span>
          </CardTitle>
          <CardDescription>
            Paste your eDNA sequence data directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your sequence data here (FASTA format, CSV data, etc.)..."
            value={pastedContent}
            onChange={(e) => setPastedContent(e.target.value)}
            className="min-h-32 bg-ocean-surface/50 border-bio-teal/30 focus:border-bio-teal"
          />
          <Button 
            onClick={handlePasteContent}
            disabled={!pastedContent.trim()}
            className="bg-gradient-to-r from-bio-teal to-bio-cyan text-ocean-depth"
          >
            <Copy className="w-4 h-4 mr-2" />
            Add Pasted Content
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-bio-green" />
              <span>Uploaded Files ({files.length})</span>
            </CardTitle>
            <CardDescription>
              Manage your uploaded sequence files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-ocean-surface/30 rounded-lg border border-white/10">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-bio-cyan" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type || 'text/plain'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">Ready</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(file)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;