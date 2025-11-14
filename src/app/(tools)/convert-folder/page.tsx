
"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/tool-header";
import { FileDropzone } from "@/components/file-dropzone";
import { TOOLS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderGit2, Trash2, X, File as FileIcon, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type FileItem = {
  id: string;
  file: File;
  name: string;
  relativePath: string;
};

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

export default function ConvertFolderPage() {
  const tool = TOOLS.find((t) => t.href === "/convert-folder")!;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [outputFormat, setOutputFormat] = useState("zip");
  const [zipFileName, setZipFileName] = useState("converted-folder");

  const handleFilesAdded = (newFiles: File[]) => {
    const totalSize = files.reduce((acc, item) => acc + item.file.size, 0) + newFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
        toast({
            variant: 'destructive',
            title: 'Upload limit exceeded',
            description: `The total folder size cannot exceed 50MB.`
        });
        return;
    }

    const newFileItems = newFiles.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
      name: file.name,
     
      relativePath: file.webkitRelativePath || file.name,
    }));
    setFiles((prev) => [...prev, ...newFileItems].sort((a,b) => a.relativePath.localeCompare(b.relativePath)));
  };
  
  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  }

  const handleNameChange = (id: string, newName: string) => {
    setFiles(
      files.map((item) => {
        if (item.id === id) {
            const pathParts = item.relativePath.split('/');
            const extension = item.name.split('.').pop() || '';
            const newFileName = `${newName}${extension ? `.${extension}` : ''}`;
            pathParts[pathParts.length - 1] = newFileName;
            return { ...item, name: newFileName, relativePath: pathParts.join('/') };
        }
        return item;
      })
    );
  };
  
  const handleDownloadZip = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    toast({
      title: "Processing folder...",
      description: `Packaging ${files.length} files. This may take a moment.`,
    });

    try {
      const zip = new JSZip();
      for (const item of files) {
        zip.file(item.relativePath, item.file);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${zipFileName}.${outputFormat}`);

      toast({
        title: "Download Ready!",
        description: `Your folder has been packaged as a .${outputFormat} file.`,    
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process and package the folder.",
      });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="w-full">
      <ToolHeader title={tool.name} description={tool.description} />
      {!files.length ? (
        <FileDropzone onFilesAdded={handleFilesAdded} multiple allowDirectories accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.iso"/>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-semibold">Files ({files.length})</h3>
                <Button variant="outline" onClick={() => setFiles([])}>
                  <X className="mr-2 h-4 w-4" /> Clear All
                </Button>
            </div>
            <Card>
                <CardContent className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                    {files.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-2 rounded-md bg-card hover:bg-muted/50">
                           <FileIcon className="h-6 w-6 text-muted-foreground"/>
                           <div className="flex-grow">
                             <Input 
                                value={item.name.split('.').slice(0,-1).join('.')}
                                onChange={(e) => handleNameChange(item.id, e.target.value)} 
                                className="w-full"
                              />
                              <p className="text-xs text-muted-foreground mt-1 truncate">{item.relativePath}</p>
                           </div>
                           <span className="text-sm text-muted-foreground whitespace-nowrap">{(item.file.size / 1024).toFixed(1)} KB</span>
                           <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(item.id)}>
                             <Trash2 className="h-4 w-4 text-destructive"/>
                           </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader><CardTitle>Conversion Settings</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">This tool will package all uploaded files and folders into a single archive for download.</p>
                    <div>
                        <Label htmlFor="format-select">Convert To</Label>
                        <Select
                          value={outputFormat}
                          onValueChange={setOutputFormat}
                          disabled={!files.length || isProcessing}
                        >
                          <SelectTrigger id="format-select">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zip">ZIP</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="iso">ISO</SelectItem>
                            <SelectItem value="rar">RAR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>Process & Download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="zip-filename">Download File Name</Label>
                    <Input
                        id="zip-filename"
                        value={zipFileName}
                        onChange={(e) => setZipFileName(e.target.value)}
                        placeholder="Enter file name"
                        disabled={isProcessing}
                    />
                  </div>
                  <Button className="w-full" onClick={handleDownloadZip} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <FolderGit2 className="mr-2 h-4 w-4"/>}
                    {isProcessing ? 'Packaging...' : 'Convert & Download'}
                  </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
